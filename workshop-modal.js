(() => {
  const dialog=document.getElementById('km-workshop-audiences');
  const data=JSON.parse(document.getElementById('workshop-content').textContent),byId=new Map(data.map(w=>[w.id,w]));
  const shell=dialog.querySelector('.km-offering'),detail=document.getElementById('workshop-detail');let opener,workshop;
  const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
  // Reserve the tallest stage at the current width before the visitor switches tabs.
  function reserveStageSpace(){
    if(!dialog.open)return;
    const scene=detail.querySelector('.kb-scene');
    scene.style.minHeight='';
    const measure=scene.cloneNode(true);
    measure.removeAttribute('id');measure.setAttribute('aria-hidden','true');measure.removeAttribute('aria-live');
    measure.style.cssText='position:absolute;visibility:hidden;pointer-events:none;inset:0 auto auto 0;width:'+scene.getBoundingClientRect().width+'px;height:auto;min-height:0;transform:none';
    scene.parentElement.append(measure);
    let tallest=0;
    for(const stage of workshop.stages){
      for(const [role,key] of Object.entries({'scene-title':'heading','scene-copy':'copy','source-label':'sourceLabel','source-copy':'sourceCopy'}))measure.querySelector('[data-role="'+role+'"]').textContent=stage[key];
      tallest=Math.max(tallest,measure.getBoundingClientRect().height);
    }
    measure.remove();scene.style.minHeight=Math.ceil(tallest)+'px';
  }
  let measuredWidth=0;
  if(typeof ResizeObserver!=='undefined')new ResizeObserver(()=>{
    if(dialog.open&&Math.abs(dialog.clientWidth-measuredWidth)>.5){measuredWidth=dialog.clientWidth;reserveStageSpace();}
  }).observe(dialog);
  document.fonts?.ready.then(()=>{if(dialog.open)reserveStageSpace();});
  function selectStage(index){
    const s=workshop.stages[index];shell.dataset.step=String(index);
    const bindings={'paper-title':'paperTitle','paper-body':'paperBody','paper-question':'paperQuestion','paper-stamp':'stamp','scene-title':'heading','scene-copy':'copy','source-label':'sourceLabel','source-copy':'sourceCopy'};
    for(const [role,key] of Object.entries(bindings))detail.querySelector('[data-role="'+role+'"]').textContent=s[key];
    detail.querySelector('[data-role=count]').textContent='0'+(index+1)+' / 03';
    detail.querySelectorAll('.kb-chapter').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index)));
    if(!matchMedia('(prefers-reduced-motion: reduce)').matches)detail.querySelector('.kb-scene').animate?.([{transform:'translateY(6px)'},{transform:'translateY(0)'}],{duration:240,easing:'ease-out'});
  }
  function open(item,trigger){
    workshop=item;opener=trigger;
    detail.innerHTML=`<div class="kb-hero"><p class="kb-kicker">${escape(item.category)} · Workshop</p><div class="kb-hero-grid"><div><h2 class="kb-title" id="workshop-title" aria-label="${escape(item.title)}">${item.titleLines.map((line,i)=>'<span>'+(i===item.titleLines.length-1?'<em>'+escape(line)+'</em>':escape(line))+'</span>').join(' ')}</h2><p class="kb-deck">${escape(item.deck)}</p><div class="kb-format"><span>${escape(item.duration)}</span><span>Interactive workshop</span></div></div><div class="kb-stack" aria-label="Illustrative workshop exercise"><div class="kb-back-sheet"></div><div class="kb-mid-sheet"></div><section class="kb-paper"><div class="kb-paper-top"><span>${escape(item.document)}</span><span class="kb-paper-km"><img src="logos/km-lettermark-brass.png" alt="KM"></span></div><h3 data-role="paper-title"></h3><p class="kb-paper-body" data-role="paper-body"></p><p class="kb-paper-question" data-role="paper-question"></p><div class="kb-paper-bottom"><span>Illustrative example</span><span class="kb-paper-stamp" data-role="paper-stamp"></span></div></section></div></div></div><section class="kb-audience" aria-label="Great for"><h3>Great for</h3><ul class="kb-audiences">${item.greatFor.map(t=>'<li>'+escape(t)+'</li>').join('')}</ul></section><div class="kb-body"><div class="kb-preview-label"><span>Explore the workshop</span><span data-role="count"></span></div><div class="kb-route" role="group" aria-label="Workshop stages">${item.stages.map((s,i)=>'<button type="button" class="kb-chapter" data-step="'+i+'" aria-pressed="false" aria-controls="workshop-scene"><span class="kb-chapter-num">0'+(i+1)+'</span><span class="kb-chapter-name">'+escape(s.label)+'</span></button>').join('')}</div><div class="kb-scene" id="workshop-scene" aria-live="polite" aria-atomic="true"><div><h3 data-role="scene-title"></h3><p class="kb-scene-copy" data-role="scene-copy"></p></div><div class="kb-source"><p class="kb-label" data-role="source-label"></p><p data-role="source-copy"></p></div></div></div><section class="kb-outcomes"><h3>What you’ll<br> take away</h3><ul class="kb-deliverables">${item.outcomes.map(t=>'<li><span aria-hidden="true">✓</span>'+escape(t)+'</li>').join('')}</ul></section><p class="kb-planning-note">Duration shown is a planning default. We’ll confirm the format and delivery details together.</p><footer class="kb-footer"><div class="kb-brand"><img src="logos/km-lettermark-brass.png" alt="KM"><span>Katie Moore</span></div><a class="kb-cta" data-selected-workshop="${escape(item.id)}" href="mailto:katherine.rs.moore@gmail.com?subject=${encodeURIComponent(item.title+' workshop inquiry')}&amp;body=${encodeURIComponent('I’m interested in '+item.title+'.\n\nOrganization / team:\nGoals:\nPreferred timing and format:\n')}">Inquire about this workshop <span aria-hidden="true">→</span></a></footer>`;
    detail.querySelectorAll('.kb-chapter').forEach(b=>b.addEventListener('click',()=>selectStage(Number(b.dataset.step))));
    selectStage(0);dialog.showModal();measuredWidth=dialog.clientWidth;reserveStageSpace();document.body.classList.add('workshop-open');dialog.scrollTop=0;dialog.querySelector('.kb-close').focus();
  }
  document.querySelectorAll('#for-teams [data-workshop]').forEach(button=>button.addEventListener('click',event=>{if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||event.button)return;const item=byId.get(button.dataset.workshop);if(!item)return;event.preventDefault();open(item,button);}));
  dialog.querySelector('.kb-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>{document.body.classList.remove('workshop-open');opener?.focus();});
  dialog.addEventListener('keydown',event=>{
    if(event.key!=='Tab')return;
    const controls=[...dialog.querySelectorAll('button,a[href]')].filter(el=>!el.disabled&&el.getClientRects().length);
    if(event.shiftKey&&document.activeElement===controls[0]){event.preventDefault();controls.at(-1).focus();}
    else if(!event.shiftKey&&document.activeElement===controls.at(-1)){event.preventDefault();controls[0].focus();}
  });
})();
