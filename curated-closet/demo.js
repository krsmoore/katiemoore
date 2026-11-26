const looks = [
  [1,'Red lapels over winter white'], [144,'Gathered red shoulders and dark flares'],
  [7,'Emerald and charcoal tailoring'], [37,'Green jumpsuit with tan points'],
  [16,'Cornflower and an ivory tie'], [134,'Black turtleneck and teal sweep']
];
const names = new Map(looks);
const byId = id => document.getElementById(id);
const photo = (id, alt='') => '<img src="look-'+id+'.jpg" alt="'+alt+'">';
const today = new Date();
const dateKey = d => [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
const dateLabel = key => new Date(key+'T12:00:00').toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric',year:'numeric'});
const validDate = key => typeof key==='string' && /^\d{4}-\d{2}-\d{2}$/.test(key) && dateKey(new Date(key+'T12:00:00'))===key;
const storageKey = 'curated-closet-public-demo-plans-v1';
let plans = {};
try {
  const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
  plans = Object.fromEntries(Object.entries(saved).filter(([day,id])=>validDate(day)&&names.has(id)));
} catch {}
function persist() {
  try { localStorage.setItem(storageKey,JSON.stringify(plans)); return ''; }
  catch { return ' Browser storage is unavailable. This plan lasts for this visit.'; }
}
byId('plan-date').value=dateKey(today);
byId('outfits').innerHTML=looks.map(([id,name])=>'<label><input type="radio" name="look" value="'+id+'" required>'+photo(id)+'<span>'+name+'</span></label>').join('');
function showPlans(){
  const rows=Object.entries(plans).sort(([a],[b])=>a.localeCompare(b));
  byId('saved').innerHTML=rows.length?rows.map(([day,id])=>'<div class="record">'+photo(id)+'<div>'+dateLabel(day)+'<strong>'+names.get(id)+'</strong></div><button data-remove="'+day+'" aria-label="Remove plan for '+dateLabel(day)+'">Remove</button></div>').join(''):'<p>No outfits planned yet.</p>';
}
byId('saved').onclick=event=>{
  const day=event.target.closest('button')?.dataset.remove;
  if(!day)return;
  delete plans[day];
  byId('plan-status').textContent='Plan removed.'+persist();
  showPlans();
};
byId('plan-form').onsubmit=event=>{
  event.preventDefault();
  const day=byId('plan-date').value,id=Number(new FormData(event.target).get('look'));
  if(!validDate(day)||!names.has(id))return;
  plans[day]=id;
  byId('plan-status').textContent=names.get(id)+' planned for '+dateLabel(day)+'.'+persist();
  showPlans();
};
showPlans();

// A fictional season of wears, shared by the calendar and reports.
const wears=new Map();
for(let offset=-3;offset<=0;offset++){
  [2,5,9,12,16,20,23,27].forEach((day,index)=>{
    const date=new Date(today.getFullYear(),today.getMonth()+offset,day);
    if(dateKey(date)<=dateKey(today))wears.set(dateKey(date),looks[(index+offset+6)%looks.length][0]);
  });
}
let month=new Date(today.getFullYear(),today.getMonth()-(today.getDate()<2?1:0),1);
function renderMonth(){
  const label=month.toLocaleDateString(undefined,{year:'numeric',month:'long'});
  byId('month').textContent=label;
  const calendar=byId('calendar');
  calendar.innerHTML=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d=>'<span class="weekday">'+d+'</span>').join('');
  const counts=new Map();
  const days=new Date(month.getFullYear(),month.getMonth()+1,0).getDate();
  for(let i=0;i<days;i++){
    const date=new Date(month.getFullYear(),month.getMonth(),i+1),key=dateKey(date),id=wears.get(key);
    const el=document.createElement(id?'button':'div');
    el.className=id?'day':'day empty-day';
    if(!i)el.style.gridColumnStart=String((date.getDay()+6)%7+1);
    el.textContent=String(i+1);
    if(id){
      counts.set(id,(counts.get(id)||0)+1);
      el.insertAdjacentHTML('beforeend',photo(id));
      el.setAttribute('aria-label',dateLabel(key)+', '+names.get(id));
      el.onclick=()=>{byId('day-title').textContent=dateLabel(key);byId('day-body').innerHTML=photo(id,names.get(id))+'<p>'+names.get(id)+'</p>';byId('day').showModal();};
    }
    calendar.append(el);
  }
  const ranked=[...counts].sort((a,b)=>b[1]-a[1]);
  const total=ranked.reduce((sum,row)=>sum+row[1],0);
  byId('stats').innerHTML='<div class="metrics"><div><strong>'+total+'</strong>Wears logged</div><div><strong>'+counts.size+' of 6</strong>Looks worn</div></div>'+(total?'<h3>Most worn this month</h3><ul class="ranking">'+ranked.map(([id,n])=>'<li>'+photo(id)+'<span>'+names.get(id)+'</span><span>'+n+(n===1?' wear':' wears')+'</span></li>').join('')+'</ul>':'<p>No sample wears this month.</p>');
}
for(const [id,delta] of [['prev',-1],['next',1]])byId(id).onclick=()=>{month=new Date(month.getFullYear(),month.getMonth()+delta,1);renderMonth();};
function route(){
  const page=['history','reports'].includes(location.hash.slice(1))?location.hash.slice(1):'planner';
  for(const name of ['planner','history','reports'])byId(name).hidden=name!==page;
  for(const link of document.querySelectorAll('.sections a')){
    if(link.hash==='#'+page)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');
  }
  byId('period').hidden=page==='planner';
  if(page!=='planner')renderMonth();
}
window.addEventListener('hashchange',route);
route();
