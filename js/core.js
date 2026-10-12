const TOOLS=[],$=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const T=(id,name,ic,cat,desc,html,init)=>TOOLS.push({id,name,ic,cat,desc,html,init});
const store={get:(k,d)=>{try{return JSON.parse(localStorage.getItem('smt.'+k))??d}catch(_){return d}},set:(k,v)=>{try{localStorage.setItem('smt.'+k,JSON.stringify(v))}catch(_){}}};
let _t;const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(_t);_t=setTimeout(()=>t.classList.remove('on'),1800)};
const copy=t=>navigator.clipboard.writeText(t).then(()=>toast('Copied ✨'),()=>toast('Copy failed'));
const esc=s=>s.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const F=(l,i)=>`<div class="f"><label>${l}</label>${i}</div>`,TA=(id,l='Input',ph='')=>F(l,`<textarea id="${id}" placeholder="${ph}"></textarea>`),OUT=(id,l='Output')=>F(l,`<div class="out" id="${id}"></div><button class="btn sm" data-c="#${id}">Copy</button>`);
const on=(r,sel,ev,fn)=>$$(sel,r).forEach(e=>e.addEventListener(ev,fn));
