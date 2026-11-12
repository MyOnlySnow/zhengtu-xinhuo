const nav=document.querySelector('#main-nav');
const menu=document.querySelector('.menu-toggle');

function closeSubmenus(except=null){
  for(const toggle of nav.querySelectorAll('.nav-toggle')){
    if(toggle===except)continue;
    toggle.setAttribute('aria-expanded','false');
    document.getElementById(toggle.getAttribute('aria-controls')).hidden=true;
  }
}

export function closeNavigation(){
  closeSubmenus();
  nav.classList.remove('open');
  menu.setAttribute('aria-expanded','false');
}

export function syncNavigation(page,query){
  const group=['resources','trail','map','sources'].includes(page)?'resources':page?'study':'home';
  const current=page==='person'?'#/people':page==='story'?'#/study?tab=stories':page==='speech'?'#/speeches':page==='case'?'#/cases':
    page==='study'?(query.get('tab')&&query.get('tab')!=='learn'?`#/study?tab=${query.get('tab')}`:'#/study'):
    page==='trail'?(query.get('mode')&&query.get('mode')!=='overview'?`#/trail?mode=${query.get('mode')}`:'#/trail'):`#/${page}`;
  for(const item of nav.querySelectorAll('[data-nav]'))item.classList.toggle('active',item.dataset.nav===group);
  for(const a of nav.querySelectorAll('a')){
    if(a.getAttribute('href')===current)a.setAttribute('aria-current','page');
    else a.removeAttribute('aria-current');
  }
  closeNavigation();
}

export function initNavigation(){
  menu.addEventListener('click',()=>{
    const open=menu.getAttribute('aria-expanded')!=='true';
    closeSubmenus();nav.classList.toggle('open',open);menu.setAttribute('aria-expanded',String(open));
  });
  nav.addEventListener('click',e=>{
    const toggle=e.target.closest('.nav-toggle');
    if(!toggle)return;
    const open=toggle.getAttribute('aria-expanded')!=='true';
    closeSubmenus(toggle);toggle.setAttribute('aria-expanded',String(open));
    document.getElementById(toggle.getAttribute('aria-controls')).hidden=!open;
  });
  nav.addEventListener('keydown',e=>{
    const toggle=e.target.closest('.nav-toggle');
    if(toggle&&e.key==='ArrowDown'){
      e.preventDefault();closeSubmenus(toggle);toggle.setAttribute('aria-expanded','true');
      const panel=document.getElementById(toggle.getAttribute('aria-controls'));panel.hidden=false;panel.querySelector('a').focus();
    }
  });
  document.addEventListener('keydown',e=>{
    if(e.key!=='Escape')return;
    const open=nav.querySelector('.nav-toggle[aria-expanded="true"]');
    if(open){e.preventDefault();closeSubmenus();open.focus();}
    else if(nav.classList.contains('open')){e.preventDefault();closeNavigation();menu.focus();}
  });
  document.addEventListener('click',e=>{if(!e.target.closest('.site-header'))closeNavigation();});
  document.addEventListener('focusin',e=>{if(!e.target.closest('.site-header'))closeNavigation();});
  nav.addEventListener('click',e=>{if(e.target.closest('a'))closeNavigation();});
  matchMedia('(max-width: 1180px)').addEventListener('change',()=>closeNavigation());
}
