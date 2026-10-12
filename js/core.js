const TOOLS=[],$=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const T=(id,name,ic,cat,desc,html,init)=>TOOLS.push({id,name,ic,cat,desc,html,init});
const store={get:(k,d)=>{try{return JSON.parse(localStorage.getItem('smt.'+k))??d}catch(_){return d}},set:(k,v)=>{try{localStorage.setItem('smt.'+k,JSON.stringify(v))}catch(_){}}};
let _t;const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(_t);_t=setTimeout(()=>t.classList.remove('on'),1800)};
const copy=t=>navigator.clipboard.writeText(t).then(()=>toast('Copied ✨'),()=>toast('Copy failed'));
const esc=s=>s.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const F=(l,i)=>`<div class="f"><label>${l}</label>${i}</div>`,TA=(id,l='Input',ph='')=>F(l,`<textarea id="${id}" placeholder="${ph}"></textarea>`),OUT=(id,l='Output')=>F(l,`<div class="out" id="${id}"></div><button class="btn sm" data-c="#${id}">Copy</button>`);
const on=(r,sel,ev,fn)=>$$(sel,r).forEach(e=>e.addEventListener(ev,fn));
/* animated pane swap (slides/blurs one pane out and the next in) */
const swap=(from,to,dir=1)=>{
  if(!to||from===to)return;
  [from,to].forEach(e=>e&&e._t&&clearTimeout(e._t));
  const show=()=>{to.style.setProperty('--sx',dir*34+'px');to.hidden=false;to.classList.remove('pout','pin');void to.offsetWidth;to.classList.add('pin')};
  if(from){from.style.setProperty('--sx',-dir*34+'px');from.classList.remove('pin');from.classList.add('pout');from._t=setTimeout(()=>{from.hidden=true;from.classList.remove('pout');show()},130)}else show()};
/* sliding segmented control: seg(el,onPick) -> {set(key),place()} */
const seg=(el,cb)=>{
  if(!$('.segi',el))el.insertAdjacentHTML('afterbegin','<i class="segi"></i>');
  let cur=null;const btns=()=>$$('button',el);
  const place=()=>{const b=btns().find(x=>x.dataset.k==cur),i=$('.segi',el);if(!b||!i||!b.offsetWidth)return;i.style.width=b.offsetWidth+'px';i.style.transform=`translateX(${b.offsetLeft}px)`};
  const set=(k,silent)=>{const ks=btns().map(b=>b.dataset.k),d=ks.indexOf(k)>=ks.indexOf(cur)?1:-1,old=cur;cur=k;btns().forEach(b=>b.classList.toggle('on',b.dataset.k==k));place();if(!silent&&cb)cb(k,d,old)};
  el.addEventListener('click',e=>{const b=e.target.closest('button');if(b&&b.dataset.k&&b.dataset.k!=cur)set(b.dataset.k)});
  return{set,place,get:()=>cur}};
