/* Calculator — Basic + Advanced (Scientific · Programmer · Graph · Stats) */
(()=>{
const E=CalcEngine,qa=s=>esc(String(s)).replace(/"/g,'&quot;'),PAL=['#ff6cb4','#4cd6a0','#ffd166','#6cb8ff','#c28bff','#ff8a5c'];
const isOpTxt=t=>/^\s*(\+|-|−|\*|\/|×|÷|\^|%|!|mod\b|²)/i.test(t);
const raw=v=>E.fmt(v,{mode:'auto'}).replace('−','-');

const FN=[['sin','sin⁻¹','sin(','asin('],['cos','cos⁻¹','cos(','acos('],['tan','tan⁻¹','tan(','atan('],
['ln','eˣ','ln(','exp('],['log','10ˣ','log(','10^('],['log₂','2ˣ','log2(','2^('],
['√x','x²','sqrt(','^2'],['xʸ','ʸ√x','^','root('],['1/x','|x|','1/(','abs('],
['n!','nPr','!','nPr('],['π','τ','π','τ'],['e','φ','e','φ'],
['(','⌊x⌋','(','floor('],[')','⌈x⌉',')','ceil('],['Ans','rand','ans','rand()']];
const HYP=[['sinh','asinh','sinh(','asinh('],['cosh','acosh','cosh(','acosh('],['tanh','atanh','tanh(','atanh(']];
const PAD=['AC','⌫','%','÷','7','8','9','×','4','5','6','−','1','2','3','+','±','0','.','='];
const MISC=[[',',','],['x','x'],['y','y'],['mod',' mod '],['EE','E'],['nCr','nCr('],['f(x)=','f(x)=']];
const EX=['2^10','sin(30)+cos(60)','sqrt(2)*pi','200+15%','5!/(3!*2!)','x=7; x^2+1','f(x)=x^2-3x+2; f(5)','ncr(52,5)','log(1000)','mean(3,7,9,12)','0xFF+0b101','e^(pi/2)'];
const PK=['AND','OR','XOR','NOT','NAND','NOR','<<','>>','MOD','(',')','⌫','A','B','7','8','9','÷','C','D','4','5','6','×','E','F','1','2','3','−','AC','0','00','FF','=','+'];
const PKI={AND:' and ',OR:' or ',XOR:' xor ',NOT:'not ',NAND:' nand ',NOR:' nor ','<<':' << ','>>':' >> ',MOD:' mod ','÷':'/','×':'*','−':'-','+':'+'};

const HTML=`<div class="cw" id="cw">
<div class="seg big" id="cmode"><button data-k="basic">🧮 Basic</button><button data-k="adv">✨ Advanced</button></div>

<div class="cpane" id="pb">
 <div class="out big" id="d" style="text-align:right;color:var(--text);-webkit-text-fill-color:var(--text)">0</div>
 <div class="cprev" id="bp"></div>
 <div class="keys" id="k"></div>
 <p class="chint">Tip: switch to <b>✨ Advanced</b> for scientific functions, programmer mode, graphing and statistics.</p>
</div>

<div class="cpane" id="pa" hidden>
 <div class="seg" id="asub"><button data-k="sci">🔬 Scientific</button><button data-k="prog">💾 Programmer</button><button data-k="graph">📈 Graph</button><button data-k="stats">📊 Stats</button></div>

 <div class="cpane" id="as"><div class="sci">
  <div class="cmain">
   <div class="disp">
    <div class="dtop"><button class="pill" id="angle" title="Angle mode (click to change)">DEG</button><button class="pill" id="hyp" title="Hyperbolic functions">hyp</button><button class="pill" id="shf" title="Inverse / second functions">2nd</button><button class="pill mem" id="memp" hidden title="Memory (click to insert)">M</button><span class="gap"></span></div>
    <input id="ex" class="ex" placeholder="Type or tap…  e.g. sin(30)+2^3" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="done">
    <div class="res" id="rs" title="Click to copy">0</div>
    <div class="alts" id="alts"></div>
   </div>
   <div class="opts">
    <label>Format<select id="fm"><option value="auto">Auto</option><option value="fix">Fixed</option><option value="sci">Scientific</option><option value="eng">Engineering</option></select></label>
    <label>Digits<input type="number" id="dg" min="0" max="15"></label>
    <label class="ck"><input type="checkbox" id="gp"> 1,000 groups</label>
   </div>
   <div class="memrow" id="mr"><button data-mm="mc">MC</button><button data-mm="mr">MR</button><button data-mm="m+">M+</button><button data-mm="m-">M−</button><button data-mm="ms">MS</button></div>
   <div class="kp"><div class="fn" id="fn"></div><div class="pad" id="pd"></div></div>
   <div class="misc" id="ms"></div>
  </div>
  <aside class="side">
   <div class="seg sm" id="sside"><button data-k="h">History</button><button data-k="v">Variables</button><button data-k="?">Help</button></div>
   <div class="sbody"><div class="cpane" id="sh"></div><div class="cpane" id="sv" hidden></div><div class="cpane" id="sq" hidden></div></div>
  </aside>
 </div></div>

 <div class="cpane" id="ap" hidden><div class="prog">
  <div class="pctl"><div class="seg sm" id="pbase"><button data-k="16">HEX</button><button data-k="10">DEC</button><button data-k="8">OCT</button><button data-k="2">BIN</button></div>
  <div class="seg sm" id="pbits"><button data-k="8">8</button><button data-k="16">16</button><button data-k="32">32</button><button data-k="64">64</button></div>
  <div class="seg sm" id="psign"><button data-k="u">Unsigned</button><button data-k="s">Signed</button></div></div>
  <input id="pe" class="ex" placeholder="e.g.  FF and 0F  ·  1 << 4  ·  ~0  ·  0xAB xor 0x0F" autocomplete="off" autocapitalize="off" spellcheck="false">
  <div class="perr" id="perr"></div>
  <div class="pvals" id="pvl"></div>
  <div class="pext" id="pext"></div>
  <div class="bits" id="bits"></div>
  <div class="pk" id="pk"></div>
 </div></div>

 <div class="cpane" id="ag" hidden><div class="gr">
  <div class="gfs" id="gfs"></div>
  <div class="gbar"><button class="mini" id="gadd">＋ Function</button><span class="gap"></span><button class="mini" id="gzi" title="Zoom in">＋</button><button class="mini" id="gzo" title="Zoom out">－</button><button class="mini" id="grs">⌂ Reset</button><button class="mini" id="gang" title="Angle mode for graph">RAD</button></div>
  <div class="gcv" id="gcv"><canvas id="gc"></canvas><div class="gtip" id="gtip" hidden></div></div>
  <p class="chint">Drag to pan · scroll / pinch to zoom · hover to trace. Variables and functions you defined in Scientific (like <code>a=2</code>, <code>f(x)=…</code>) work here too.</p>
  <div class="alts" id="groots"></div>
 </div></div>

 <div class="cpane" id="at" hidden><div class="stp">
  <div class="f"><label>Data — numbers separated by commas, spaces or new lines. Give two numbers per line for regression.</label><textarea id="sd" placeholder="e.g.  4, 8, 15, 16, 23, 42" spellcheck="false"></textarea></div>
  <div class="row" style="margin-bottom:6px"><button class="mini" id="sdemo">Example</button><button class="mini" id="sdemo2">Example (x, y)</button><button class="mini" id="sclr">Clear</button><button class="mini" id="scp">Copy results</button></div>
  <div id="sout"></div>
 </div></div>
</div>
</div>`;

T('calc','Calculator','🧮','Math','Basic + advanced: scientific, programmer, graphing & stats',HTML,r=>{
const $r=s=>$(s,r);
/* ===== shared context ===== */
const C={angle:store.get('c.angle','deg'),vars:store.get('c.vars',{}),funcs:{},ans:store.get('c.ans',0)};
const O={mode:store.get('c.fmt','auto'),digits:store.get('c.dig',4),group:store.get('c.grp',false)};
const savedF=store.get('c.funcs',{});Object.keys(savedF).forEach(k=>{try{E.run(`${k}(${savedF[k].p.join(',')})=${savedF[k].s}`,C)}catch(_){}});
const saveCtx=()=>{store.set('c.vars',C.vars);store.set('c.ans',C.ans);store.set('c.funcs',Object.fromEntries(Object.entries(C.funcs).map(([k,f])=>[k,{p:f.p,s:f.src}])))};
const clone=()=>({angle:C.angle,vars:{...C.vars},funcs:{...C.funcs},ans:C.ans});
const fmtv=v=>E.fmt(v,O);
const coarse=matchMedia('(pointer:coarse)').matches;
const keepFocus=el=>el.addEventListener('mousedown',e=>{if(e.target.closest('button'))e.preventDefault()});
let mode=store.get('c.mode','basic'),sub=store.get('c.sub','sci'),side='h';
const segs=[];const mk=(id,cb)=>{const s=seg($r(id),cb);segs.push(s);return s};
const refit=()=>{segs.forEach(s=>s.place());graph.draw&&graph.draw()};

/* ===== top: basic <-> advanced ===== */
const pb=$r('#pb'),pa=$r('#pa');
const cm=mk('#cmode',(k,d)=>{mode=k;store.set('c.mode',k);swap(k=='basic'?pa:pb,k=='basic'?pb:pa,d);setTimeout(refit,170);setTimeout(()=>{if(k=='adv')focusMain()},200)});
const subs={sci:$r('#as'),prog:$r('#ap'),graph:$r('#ag'),stats:$r('#at')};
const asub=mk('#asub',(k,d,old)=>{sub=k;store.set('c.sub',k);swap(subs[old],subs[k],d);setTimeout(refit,170);if(k=='graph')setTimeout(()=>{graph.rebuild();graph.draw()},180);if(k=='stats')stat.render();setTimeout(focusMain,200)});
function focusMain(){if(coarse)return;const el=mode=='adv'&&sub=='sci'?ex:mode=='adv'&&sub=='prog'?pe:null;el&&el.focus({preventScroll:true})}

/* ===== BASIC ===== */
{const d=$r('#d'),bp=$r('#bp'),bc={angle:'deg',vars:{},funcs:{},ans:0};let s='',fresh=false;
$r('#k').innerHTML=PAD.map(x=>x=='±'?'<button data-x="(">(</button>':`<button class="${'÷×−+%'.includes(x)?'op':x=='='?'eq':''}" data-x="${x}">${x=='AC'?'C':x}</button>`).join('');
const show=()=>{d.textContent=s||'0';let t='';try{if(s&&/[-+*\/÷×−%^(]/.test(s.replace(/^[-−]/,''))){t='= '+E.fmt(E.run(s,{...bc,vars:{}}).value)}}catch(_){}bp.textContent=t};
const P=x=>{
 if(s=='Error')s='';
 if(x=='AC'||x=='C'){s='';fresh=false}
 else if(x=='⌫'){s=s.slice(0,-1);fresh=false}
 else if(x=='='){if(!s)return;try{const v=E.run(s,bc).value;bc.ans=v;s=raw(v);fresh=true}catch(_){s='Error';fresh=true;d.classList.remove('shake');void d.offsetWidth;d.classList.add('shake')}}
 else{if(fresh){if(!isOpTxt(x))s='';fresh=false}s+=x}
 show()};
on(r,'#k button','click',e=>P(e.currentTarget.dataset.x));keepFocus($r('#k'));
r._basicKey=P}

/* ===== SCIENTIFIC ===== */
const ex=$r('#ex'),rs=$r('#rs'),alts=$r('#alts');
let fresh=false,shift=false,hyp=false,mem=store.get('c.mem',[0,false]),hist=store.get('c.hist',[]),hI=-1;
const label=i=>{let f=FN[i];if(hyp&&i<3)f=HYP[i];return f};
function renderFn(){$r('#fn').innerHTML=FN.map((_,i)=>{const f=label(i);return`<button data-i="${i}" class="${shift?'sh':''}"><span>${shift?f[1]:f[0]}</span><small>${shift?f[0]:f[1]}</small></button>`}).join('');
 $r('#shf').classList.toggle('on',shift);$r('#hyp').classList.toggle('on',hyp)}
$r('#pd').innerHTML=PAD.map(x=>`<button class="${'÷×−+%'.includes(x)?'op':x=='='?'eq':/^(AC|⌫|±)$/.test(x)?'ac':''}" data-x="${x}">${x}</button>`).join('');
$r('#ms').innerHTML=MISC.map(([l,t])=>`<button data-t="${qa(t)}">${l}</button>`).join('');
renderFn();
const alabel=()=>{$r('#angle').textContent=C.angle.toUpperCase()};alabel();
const memUI=()=>{const m=$r('#memp');m.hidden=!mem[1];m.textContent='M = '+E.fmt(mem[0],{mode:'auto'});store.set('c.mem',mem)};memUI();
$r('#fm').value=O.mode;$r('#dg').value=O.digits;$r('#gp').checked=O.group;
const dgDis=()=>{$r('#dg').disabled=O.mode=='auto'};dgDis();

function chips(v){
 const a=[];
 if(isFinite(v)){
  const f=E.frac(v);if(f){const w=Math.trunc(f.n/f.d),rem=Math.abs(f.n)%f.d;a.push(['Fraction',`${f.n}/${f.d}`]);if(Math.abs(w)>=1)a.push(['Mixed',`${w} ${rem}/${f.d}`])}
  if(v!==0&&O.mode!='sci')a.push(['Scientific',E.fmt(v,{mode:'sci',digits:6})]);
  if(Number.isInteger(v)&&v>=0&&v<2**53)a.push(['Hex','0x'+v.toString(16).toUpperCase()],['Binary','0b'+v.toString(2)])}
 alts.innerHTML=a.map(([l,t])=>`<button class="chp" data-c="${qa(t)}"><small>${l}</small>${esc(t)}</button>`).join('')}
function showVal(v,isLive){rs.textContent=fmtv(v);rs.className='res'+(isLive?' live':'');rs.dataset.c=raw(v);chips(v)}
function live(){
 const s=ex.value.trim();
 if(!s){rs.textContent='0';rs.className='res live';rs.dataset.c='0';alts.innerHTML='';return}
 try{const o=E.run(s,clone());
  if(o.kind=='def'){rs.textContent=o.text;rs.className='res live def';alts.innerHTML='';return}
  showVal(o.value,true)}
 catch(e){rs.className='res live err';rs.textContent='…';alts.innerHTML=`<span class="hint">⚠ ${esc(e.message)}</span>`}}
function bump(){rs.classList.remove('bump');void rs.offsetWidth;rs.classList.add('bump')}
function shake(el){el.classList.remove('shake');void el.offsetWidth;el.classList.add('shake')}
function pushHist(e,t,v){hist.unshift({e,r:t,v:v===undefined?null:v});hist=hist.slice(0,60);store.set('c.hist',hist);hI=-1;renderHist()}
function commit(){
 const s=ex.value.trim();if(!s)return;
 try{const o=E.run(s,C);
  if(o.kind=='def'){rs.textContent=o.text;rs.className='res def';rs.dataset.c=o.text;alts.innerHTML='';pushHist(s,o.text);toast('Function saved ✓')}
  else{C.ans=o.value;showVal(o.value);pushHist(s,fmtv(o.value),o.value)}
  saveCtx();renderVars();fresh=true;bump()}
 catch(e){rs.textContent=e.message;rs.className='res err';alts.innerHTML='';shake(rs)}}
function ins(t){
 if(fresh){ex.value=isOpTxt(t)?'ans':'';fresh=false}
 const a=ex.selectionStart??ex.value.length,b=ex.selectionEnd??a;
 ex.value=ex.value.slice(0,a)+t+ex.value.slice(b);const p=a+t.length;
 if(!coarse)ex.focus({preventScroll:true});try{ex.setSelectionRange(p,p)}catch(_){}live()}
function back(){
 if(fresh)fresh=false;
 let a=ex.selectionStart??ex.value.length,b=ex.selectionEnd??a;
 if(a!=b){ex.value=ex.value.slice(0,a)+ex.value.slice(b)}
 else if(a>0){const m=/([A-Za-z]+[0-9]?\()$/.exec(ex.value.slice(0,a));const n=m?m[1].length:1;ex.value=ex.value.slice(0,a-n)+ex.value.slice(a);a-=n}
 if(!coarse)ex.focus({preventScroll:true});try{ex.setSelectionRange(a,a)}catch(_){}live()}
function cur(){try{return E.run(ex.value.trim(),clone()).value}catch(_){return C.ans}}
function sign(){let v=ex.value.trim();if(!v)return;ex.value=/^-\(.*\)$/.test(v)?v.slice(2,-1):/^-/.test(v)?v.slice(1):/^[\d.]+$/.test(v)?'-'+v:`-(${v})`;fresh=false;live()}

$r('#pd').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const x=b.dataset.x;
 if(x=='AC'){ex.value='';fresh=false;live();alts.innerHTML=''}else if(x=='⌫')back();else if(x=='=')commit();else if(x=='±')sign();
 else ins(x=='÷'?'/':x=='×'?'*':x=='−'?'-':x)});
$r('#ms').addEventListener('click',e=>{const b=e.target.closest('button');if(b)ins(b.dataset.t)});
$r('#fn').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const f=label(+b.dataset.i);ins(shift?f[3]:f[2]);if(shift){shift=false;renderFn()}});
[$r('#fn'),$r('#pd'),$r('#ms'),$r('#mr'),$r('.dtop')].forEach(keepFocus);
$r('#shf').onclick=()=>{shift=!shift;renderFn()};
$r('#hyp').onclick=()=>{hyp=!hyp;renderFn()};
$r('#angle').onclick=()=>{C.angle=C.angle=='deg'?'rad':C.angle=='rad'?'grad':'deg';alabel();store.set('c.angle',C.angle);live();toast('Angle: '+({deg:'degrees',rad:'radians',grad:'gradians'})[C.angle])};
$r('#mr').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const m=b.dataset.mm,v=cur();
 if(m=='mc')mem=[0,false];else if(m=='mr'){if(mem[1])ins(raw(mem[0]))}else if(m=='ms')mem=[v,true];else if(m=='m+')mem=[mem[0]+v,true];else mem=[mem[0]-v,true];memUI()});
$r('#memp').onclick=()=>{if(mem[1])ins(raw(mem[0]))};
$r('#fm').onchange=e=>{O.mode=e.target.value;store.set('c.fmt',O.mode);dgDis();live();renderHist()};
$r('#dg').oninput=e=>{O.digits=Math.max(0,Math.min(15,+e.target.value||0));store.set('c.dig',O.digits);live();renderHist()};
$r('#gp').onchange=e=>{O.group=e.target.checked;store.set('c.grp',O.group);live();renderHist()};
ex.addEventListener('input',()=>{fresh=false;hI=-1;live()});
ex.addEventListener('keydown',e=>{
 if(e.key!='Escape'||ex.value)e.stopPropagation();
 if(e.key=='Enter'){e.preventDefault();commit();return}
 if(e.key=='Escape'&&ex.value){e.preventDefault();ex.value='';fresh=false;live();return}
 if(e.key=='ArrowUp'||e.key=='ArrowDown'){if(!hist.length)return;e.preventDefault();hI=Math.max(-1,Math.min(hist.length-1,hI+(e.key=='ArrowUp'?1:-1)));ex.value=hI<0?'':hist[hI].e;fresh=false;live();return}
 if(fresh&&e.key.length==1&&!e.ctrlKey&&!e.metaKey){if(isOpTxt(e.key))ex.value='ans';else ex.value='';fresh=false}});
rs.addEventListener('animationend',()=>rs.classList.remove('shake'));

/* ----- side: history / variables / help ----- */
const sh=$r('#sh'),sv=$r('#sv'),sq=$r('#sq');
function renderHist(){
 sh.innerHTML=hist.length?`<div class="sact"><button class="mini" id="hclr">Clear history</button></div>`+hist.map((h,i)=>`<div class="hrow" style="--i:${Math.min(i,10)}"><button class="he" data-hi="${i}" title="Use expression">${esc(h.e)}</button><button class="hr" data-hr="${i}" title="Insert result">= ${esc(h.v!=null?fmtv(h.v):h.r)}</button></div>`).join(''):'<p class="sempty">Your calculations show up here.<br>Press <kbd>Enter</kbd> or <b>=</b>. Use <kbd>↑</kbd> to recall.</p>'}
sh.addEventListener('click',e=>{
 if(e.target.closest('#hclr')){hist=[];store.set('c.hist',hist);renderHist();return}
 const he=e.target.closest('[data-hi]'),hr=e.target.closest('[data-hr]');
 if(he){ex.value=hist[he.dataset.hi].e;fresh=false;live();ex.focus({preventScroll:true})}
 else if(hr){const h=hist[hr.dataset.hr];ins(h.v!=null?raw(h.v):h.r)}});
function renderVars(){
 const vs=Object.entries(C.vars),fs=Object.entries(C.funcs);
 sv.innerHTML=(vs.length||fs.length||mem[1]?`<div class="sact"><button class="mini" id="vclr">Clear all</button></div>`:'')+
  `<div class="vrow"><button class="vn" data-vi="ans">ans</button><span>= ${esc(fmtv(C.ans))}</span><i></i></div>`+
  (mem[1]?`<div class="vrow"><button class="vn" data-vi="${raw(mem[0])}">M</button><span>= ${esc(fmtv(mem[0]))}</span><i></i></div>`:'')+
  vs.map(([k,v])=>`<div class="vrow"><button class="vn" data-vi="${qa(k)}">${esc(k)}</button><span>= ${esc(fmtv(v))}</span><button class="vx" data-vd="${qa(k)}" title="Delete">✕</button></div>`).join('')+
  fs.map(([k,f])=>`<div class="vrow"><button class="vn" data-vi="${qa(k)}(">${esc(k)}(${esc(f.p.join(','))})</button><span>= ${esc(f.src)}</span><button class="vx" data-vf="${qa(k)}" title="Delete">✕</button></div>`).join('')+
  (vs.length||fs.length?'':'<p class="sempty">Define variables like <code>a=5</code> or functions like <code>f(x)=x^2+1</code> and they appear here.</p>')}
sv.addEventListener('click',e=>{
 const i=e.target.closest('[data-vi]'),d=e.target.closest('[data-vd]'),f=e.target.closest('[data-vf]');
 if(i)ins(i.dataset.vi);else if(d){delete C.vars[d.dataset.vd]}else if(f){delete C.funcs[f.dataset.vf]}
 else if(e.target.closest('#vclr')){C.vars={};C.funcs={};mem=[0,false];memUI()}
 else return;
 if(!i){saveCtx();renderVars();live()}});
sq.innerHTML=`<div class="help"><h5>Try these</h5><div class="exs">${EX.map(x=>`<button class="chp" data-ex="${qa(x)}">${esc(x)}</button>`).join('')}</div>
<h5>Syntax</h5><p>Operators <code>+ − × ÷ ^ % !</code> and <code>mod</code>. Brackets close themselves. Implicit multiplication works: <code>2pi</code>, <code>3(4+1)</code>, <code>2x</code>.</p>
<p><code>200+10%</code> = 220 &nbsp;·&nbsp; <code>50%</code> = 0.5 &nbsp;·&nbsp; <code>-2^2</code> = −4 &nbsp;·&nbsp; <code>x=5; x*2</code> runs several statements.</p>
<p>Numbers: <code>1e3</code>, <code>0xFF</code>, <code>0b101</code>, <code>0o17</code>. Constants: <code>pi e tau phi ans</code>.</p>
<h5>Functions</h5><p class="fnl">${E.fnNames().map(n=>`<code>${n}</code>`).join(' ')}</p>
<p class="hint">Keys: <kbd>Enter</kbd> calculate · <kbd>↑</kbd><kbd>↓</kbd> history · <kbd>Esc</kbd> clear</p></div>`;
sq.addEventListener('click',e=>{const b=e.target.closest('[data-ex]');if(b){ex.value=b.dataset.ex;fresh=false;live();ex.focus({preventScroll:true})}});
const ss=mk('#sside',(k,d,old)=>{side=k;const m={h:sh,v:sv,'?':sq};swap(m[old],m[k],d)});

/* ===== PROGRAMMER ===== */
const pe=$r('#pe'),PS={base:store.get('c.pb',16),bits:store.get('c.pbits',32),signed:store.get('c.psg',false),val:0n};
const pbase=mk('#pbase',k=>{PS.base=+k;store.set('c.pb',PS.base);pe.value=pe.value.trim()?pstr(PS.val):'';pcalc();pkeys()});
const pbits=mk('#pbits',k=>{PS.bits=+k;store.set('c.pbits',PS.bits);pcalc(true)});
const psign=mk('#psign',k=>{PS.signed=k=='s';store.set('c.psg',PS.signed);pcalc(true)});
const mask=()=>(1n<<BigInt(PS.bits))-1n,U=()=>PS.val&mask(),Sg=()=>{const u=U(),h=1n<<BigInt(PS.bits-1);return u>=h?u-(1n<<BigInt(PS.bits)):u};
const grp=(s,n=4)=>{const o=[];for(let i=s.length;i>0;i-=n)o.unshift(s.slice(Math.max(0,i-n),i));return o.join(' ')};
const pstr=v=>{const u=v&mask(),b=PS.base;if(b==10&&PS.signed){const h=1n<<BigInt(PS.bits-1);return(u>=h?u-(1n<<BigInt(PS.bits)):u).toString()}return u.toString(b).toUpperCase()};
let pfresh=false;
function pcalc(rewrap){
 const s=pe.value.trim();let err='';
 if(rewrap){try{PS.val=s?E.progEval(s,PS.base,PS.bits,PS.signed):PS.val}catch(_){}if(!s)PS.val=PS.val&mask()}
 else if(!s)PS.val=0n;
 else try{PS.val=E.progEval(s,PS.base,PS.bits,PS.signed)}catch(e){err=e.message}
 $r('#perr').textContent=err;prender()}
function prender(){
 const u=U(),sg=Sg(),B=PS.bits;
 const rows=[['HEX',16,grp(u.toString(16).toUpperCase())],['DEC',10,(PS.signed?sg:u).toString()],['OCT',8,grp(u.toString(8),3)],['BIN',2,grp(u.toString(2).padStart(B,'0'))]];
 $r('#pvl').innerHTML=rows.map(([n,b,t])=>`<div class="prow ${PS.base==b?'on':''}"><button class="pbn" data-pb="${b}">${n}</button><code data-c="${qa(t.replace(/ /g,''))}">${t}</code></div>`).join('');
 const ex2=[];
 if(u<=0x10FFFFn){const n=Number(u);if(n>=32&&n!=127&&!(n>=0xD800&&n<=0xDFFF))ex2.push(['Char',`“${String.fromCodePoint(n)}”`])}
 const bytes=[];for(let i=B/8-1;i>=0;i--)bytes.push(((u>>BigInt(i*8))&255n).toString(16).toUpperCase().padStart(2,'0'));ex2.push(['Bytes',bytes.join(' ')]);
 try{const dv=new DataView(new ArrayBuffer(8));if(B==32){dv.setUint32(0,Number(u));ex2.push(['Float32',E.fmt(dv.getFloat32(0))])}else if(B==64){dv.setBigUint64(0,u);ex2.push(['Float64',E.fmt(dv.getFloat64(0))])}}catch(_){}
 ex2.push(['Ones set',u.toString(2).replace(/0/g,'').length+''],['Signed',sg.toString()]);
 $r('#pext').innerHTML=ex2.map(([l,t])=>`<span class="chp" data-c="${qa(t)}"><small>${l}</small>${esc(t)}</span>`).join('');
 const bs=u.toString(2).padStart(B,'0'),per=B>16?16:B,rowsN=B/per;let h='';
 for(let rI=0;rI<rowsN;rI++){const hi=B-1-rI*per,lo=hi-per+1;h+=`<div class="brow"><small class="bl">${hi}</small>`;
  for(let i=0;i<per;i++){const idx=hi-i,bit=bs[B-1-idx];h+=`<button class="bit ${bit=='1'?'one':''} ${i%4==3&&i<per-1?'gap4':''}" data-bit="${idx}" title="bit ${idx}">${bit}</button>`}
  h+=`<small class="bl">${lo}</small></div>`}
 $r('#bits').innerHTML=h}
function pkeys(){$r('#pk').innerHTML=PK.map(x=>{const dig=/^[0-9A-F]$/.test(x)||x=='00'||x=='FF';let dis=false;if(dig){const ch=x=='00'||x=='FF'?[...x]:[x];dis=ch.some(c=>parseInt(c,16)>=PS.base)}
 return`<button class="${/^(AND|OR|XOR|NOT|NAND|NOR|<<|>>|MOD)$/.test(x)?'lg':'÷×−+'.includes(x)?'op':x=='='?'eq':/^(AC|⌫)$/.test(x)?'ac':''}" ${dis?'disabled':''} data-p="${x}">${x}</button>`}).join('')}
function pins(t){
 if(pfresh){pe.value=/^\s*(and|or|xor|nand|nor|<<|>>|mod|[+\-*\/%&|^])/i.test(t)?pe.value:'';pfresh=false}
 const a=pe.selectionStart??pe.value.length,b=pe.selectionEnd??a;
 pe.value=pe.value.slice(0,a)+t+pe.value.slice(b);const p=a+t.length;if(!coarse)pe.focus({preventScroll:true});try{pe.setSelectionRange(p,p)}catch(_){}pcalc()}
$r('#pk').addEventListener('click',e=>{const b=e.target.closest('button');if(!b||b.disabled)return;const x=b.dataset.p;
 if(x=='AC'){pe.value='';pfresh=false;pcalc()}
 else if(x=='⌫'){const a=pe.selectionStart??pe.value.length;let v=pe.value;const m=/( (and|or|xor|nand|nor|mod) | ?(<<|>>) ?)$/i.exec(v.slice(0,a));const n=m?m[0].length:1;pe.value=v.slice(0,Math.max(0,a-n))+v.slice(a);pfresh=false;pcalc()}
 else if(x=='='){if(pe.value.trim()){pe.value=pstr(PS.val);pfresh=true;pcalc()}}
 else pins(PKI[x]??x)});
$r('#pvl').addEventListener('click',e=>{const b=e.target.closest('[data-pb]');if(b)pbase.set(b.dataset.pb)});
$r('#bits').addEventListener('click',e=>{const b=e.target.closest('[data-bit]');if(!b)return;PS.val=(U()^(1n<<BigInt(b.dataset.bit)));pe.value=pstr(PS.val);pfresh=true;prender();pkeys()});
pe.addEventListener('input',()=>{pfresh=false;pcalc()});
pe.addEventListener('keydown',e=>{if(e.key!='Escape'||pe.value)e.stopPropagation();if(e.key=='Enter'){e.preventDefault();if(pe.value.trim()){pe.value=pstr(PS.val);pfresh=true;pcalc()}}if(e.key=='Escape'&&pe.value){e.preventDefault();pe.value='';pcalc()}});
[$r('#pk'),$r('#bits')].forEach(keepFocus);

/* ===== GRAPH ===== */
const graph=(()=>{
 const G={fs:store.get('c.gfs',[{e:'sin(x)',on:true},{e:'x^2/8',on:true}]),angle:store.get('c.gang','rad')},V={cx:0,cy:0,s:50};
 let comp=[],tr=null,rt=0;const cv=$r('#gc'),tip=$r('#gtip');
 const colors=i=>PAL[i%PAL.length];
 function build(){comp=G.fs.map(f=>{const src=f.e.trim().replace(/^(y|f\s*\(\s*x\s*\))\s*=\s*/i,'');if(!src)return{blank:true};
  try{const ast=E.parse(src),ctx={angle:G.angle,vars:{...C.vars},funcs:C.funcs,ans:C.ans};ctx.vars.x=1;E.ev(ast,ctx);return{f:x=>{ctx.vars.x=x;try{return E.ev(ast,ctx)}catch(_){return NaN}}}}catch(e){return{err:e.message}}})}
 function list(){$r('#gfs').innerHTML=G.fs.map((f,i)=>`<div class="gf" style="--c:${colors(i)}"><button class="gdot ${f.on?'on':''}" data-gt="${i}" title="Show / hide"></button><span class="gl">y =</span><input data-gi="${i}" value="${qa(f.e)}" placeholder="e.g. sin(x)·x" spellcheck="false" autocomplete="off" class="${comp[i]&&comp[i].err?'bad':''}" title="${qa(comp[i]&&comp[i].err||'')}"><button class="vx" data-gx="${i}" title="Remove">✕</button></div>`).join('')}
 const nice=raw=>{const p=10**Math.floor(Math.log10(raw)),f=raw/p;return(f<1.5?1:f<3.5?2:f<7.5?5:10)*p};
 const tfmt=x=>{const s=+x.toPrecision(10);return Math.abs(s)>=1e6||(s!==0&&Math.abs(s)<1e-4)?s.toExponential(2):String(s)};
 function draw(){
  const W=cv.clientWidth,H=cv.clientHeight;if(!W||!H)return;
  const dpr=Math.min(devicePixelRatio||1,2);if(cv.width!=Math.round(W*dpr)||cv.height!=Math.round(H*dpr)){cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr)}
  const g=cv.getContext('2d');g.setTransform(dpr,0,0,dpr,0,0);g.clearRect(0,0,W,H);
  const X=x=>W/2+(x-V.cx)*V.s,Y=y=>H/2-(y-V.cy)*V.s,st=nice(70/V.s);
  const x0=V.cx-W/2/V.s,x1=V.cx+W/2/V.s,y0=V.cy-H/2/V.s,y1=V.cy+H/2/V.s;
  g.font='11px ui-monospace,Menlo,Consolas,monospace';g.textBaseline='top';
  const sub=st/(Math.round(st/10**Math.floor(Math.log10(st)))==2?4:5);
  g.lineWidth=1;g.strokeStyle='rgba(255,255,255,.045)';g.beginPath();
  for(let x=Math.ceil(x0/sub)*sub;x<=x1;x+=sub){const px=Math.round(X(x))+.5;g.moveTo(px,0);g.lineTo(px,H)}
  for(let y=Math.ceil(y0/sub)*sub;y<=y1;y+=sub){const py=Math.round(Y(y))+.5;g.moveTo(0,py);g.lineTo(W,py)}g.stroke();
  g.strokeStyle='rgba(255,255,255,.14)';g.beginPath();
  for(let x=Math.ceil(x0/st)*st;x<=x1;x+=st){const px=Math.round(X(x))+.5;g.moveTo(px,0);g.lineTo(px,H)}
  for(let y=Math.ceil(y0/st)*st;y<=y1;y+=st){const py=Math.round(Y(y))+.5;g.moveTo(0,py);g.lineTo(W,py)}g.stroke();
  const ax=Math.min(H-2,Math.max(2,Y(0))),ay=Math.min(W-2,Math.max(2,X(0)));
  g.strokeStyle='rgba(255,255,255,.55)';g.lineWidth=1.4;g.beginPath();g.moveTo(0,Math.round(ax)+.5);g.lineTo(W,Math.round(ax)+.5);g.moveTo(Math.round(ay)+.5,0);g.lineTo(Math.round(ay)+.5,H);g.stroke();
  g.fillStyle='rgba(235,238,255,.7)';
  g.textAlign='center';for(let x=Math.ceil(x0/st)*st;x<=x1;x+=st){if(Math.abs(x)<st/2)continue;const px=X(x);g.fillText(tfmt(x),px,Math.min(H-14,Math.max(4,ax+5)))}
  g.textAlign='left';for(let y=Math.ceil(y0/st)*st;y<=y1;y+=st){if(Math.abs(y)<st/2)continue;const py=Y(y);const lx=ay>W-50?ay-8-g.measureText(tfmt(y)).width:ay+6;g.fillText(tfmt(y),Math.max(2,lx),py-6)}
  comp.forEach((c,i)=>{if(!c.f||!G.fs[i].on)return;
   g.strokeStyle=colors(i);g.lineWidth=2.4;g.lineJoin='round';g.beginPath();let pen=false,py=0;
   for(let px=0;px<=W;px+=1){const y=c.f(V.cx+(px-W/2)/V.s),yy=Y(y);
    if(!isFinite(y)||Math.abs(yy)>1e7){pen=false;continue}
    if(pen&&Math.abs(yy-py)>H*1.5)pen=false;
    if(!pen){g.moveTo(px,yy);pen=true}else g.lineTo(px,yy);py=yy}
   g.stroke()});
  if(tr){const px=tr.px;g.strokeStyle='rgba(255,255,255,.3)';g.setLineDash([4,4]);g.lineWidth=1;g.beginPath();g.moveTo(px+.5,0);g.lineTo(px+.5,H);g.stroke();g.setLineDash([]);
   const x=V.cx+(px-W/2)/V.s;const lines=[`<b>x = ${tfmt(x)}</b>`];
   comp.forEach((c,i)=>{if(!c.f||!G.fs[i].on)return;const y=c.f(x);if(isFinite(y)){g.fillStyle=colors(i);g.beginPath();g.arc(px,Y(y),4.5,0,7);g.fill();g.strokeStyle='#fff';g.lineWidth=1.5;g.stroke();lines.push(`<span style="color:${colors(i)}">●</span> ${tfmt(y)}`)}else lines.push(`<span style="color:${colors(i)}">●</span> —`)});
   tip.innerHTML=lines.join('<br>');tip.hidden=false;tip.style.left=Math.min(W-tip.offsetWidth-8,Math.max(8,px+12))+'px';tip.style.top='10px'}else tip.hidden=true;
  clearTimeout(rt);rt=setTimeout(roots,140)}
 function roots(){
  const W=cv.clientWidth,out=[];if(!W)return;
  comp.forEach((c,i)=>{if(!c.f||!G.fs[i].on)return;const a=V.cx-W/2/V.s,b=V.cx+W/2/V.s,N=700,rr=[];let px=a,py=c.f(a);
   for(let k=1;k<=N&&rr.length<5;k++){const x=a+(b-a)*k/N,y=c.f(x);
    if(isFinite(py)&&isFinite(y)&&py*y<0){let lo=px,hi=x,fl=py;for(let j=0;j<50;j++){const m=(lo+hi)/2,fm=c.f(m);if(fl*fm<=0)hi=m;else{lo=m;fl=fm}}const m=(lo+hi)/2;if(Math.abs(c.f(m))<1e-3*Math.max(1,Math.abs(py),Math.abs(y))||Math.abs(hi-lo)<1e-9)rr.push(m)}
    else if(y===0&&isFinite(y))rr.push(x);px=x;py=y}
   rr.forEach(x=>out.push(`<button class="chp" data-c="${qa(tfmt(x))}" style="--c:${colors(i)}"><small><span style="color:${colors(i)}">●</span> zero</small>x ≈ ${tfmt(x)}</button>`));
   const y0=c.f(0);if(isFinite(y0)&&V.cx-W/2/V.s<=0&&V.cx+W/2/V.s>=0)out.push(`<button class="chp" data-c="${qa(tfmt(y0))}"><small><span style="color:${colors(i)}">●</span> y-intercept</small>${tfmt(y0)}</button>`)});
  $r('#groots').innerHTML=out.join('')}
 const rebuild=()=>{build();list()};
 const save=()=>store.set('c.gfs',G.fs);
 function zoom(f,cx,cy){const W=cv.clientWidth,H=cv.clientHeight,mx=cx??W/2,my=cy??H/2,wx=V.cx+(mx-W/2)/V.s,wy=V.cy-(my-H/2)/V.s;V.s=Math.max(1e-4,Math.min(1e7,V.s*f));V.cx=wx-(mx-W/2)/V.s;V.cy=wy+(my-H/2)/V.s;draw()}
 $r('#gfs').addEventListener('input',e=>{const i=e.target.dataset.gi;if(i==null)return;G.fs[i].e=e.target.value;save();build();e.target.classList.toggle('bad',!!(comp[i]&&comp[i].err));e.target.title=comp[i]&&comp[i].err||'';draw()});
 $r('#gfs').addEventListener('click',e=>{const t=e.target.closest('[data-gt]'),x=e.target.closest('[data-gx]');
  if(t){G.fs[t.dataset.gt].on=!G.fs[t.dataset.gt].on;t.classList.toggle('on');save();draw()}
  else if(x){if(G.fs.length>1){G.fs.splice(+x.dataset.gx,1);save();rebuild();draw()}else{G.fs[0].e='';save();rebuild();draw()}}});
 $r('#gfs').addEventListener('keydown',e=>e.stopPropagation());
 $r('#gadd').onclick=()=>{if(G.fs.length>=6)return toast('Up to 6 functions');G.fs.push({e:'',on:true});save();rebuild();const l=$$('#gfs input',r);l[l.length-1].focus()};
 $r('#gzi').onclick=()=>zoom(1.5);$r('#gzo').onclick=()=>zoom(1/1.5);$r('#grs').onclick=()=>{V.cx=0;V.cy=0;V.s=50;draw()};
 $r('#gang').onclick=()=>{G.angle=G.angle=='rad'?'deg':'rad';store.set('c.gang',G.angle);$r('#gang').textContent=G.angle.toUpperCase();build();draw()};$r('#gang').textContent=G.angle.toUpperCase();
 cv.addEventListener('wheel',e=>{e.preventDefault();const b=cv.getBoundingClientRect();zoom(Math.exp(-e.deltaY*.0016),e.clientX-b.left,e.clientY-b.top)},{passive:false});
 const ptr=new Map();let lastD=0;
 cv.addEventListener('pointerdown',e=>{cv.setPointerCapture(e.pointerId);ptr.set(e.pointerId,{x:e.clientX,y:e.clientY});lastD=0;cv.classList.add('drag');
  if(e.pointerType!='mouse'){const b=cv.getBoundingClientRect();tr={px:e.clientX-b.left};draw()}});
 cv.addEventListener('pointermove',e=>{const b=cv.getBoundingClientRect();
  if(ptr.has(e.pointerId)){const p=ptr.get(e.pointerId);
   if(ptr.size==1){V.cx-=(e.clientX-p.x)/V.s;V.cy+=(e.clientY-p.y)/V.s;ptr.set(e.pointerId,{x:e.clientX,y:e.clientY});tr=e.pointerType=='mouse'?{px:e.clientX-b.left}:null;draw()}
   else if(ptr.size==2){ptr.set(e.pointerId,{x:e.clientX,y:e.clientY});const [a,c]=[...ptr.values()],d=Math.hypot(a.x-c.x,a.y-c.y);if(lastD)zoom(d/lastD,(a.x+c.x)/2-b.left,(a.y+c.y)/2-b.top);lastD=d}}
  else if(e.pointerType=='mouse'){tr={px:e.clientX-b.left};draw()}});
 const up=e=>{ptr.delete(e.pointerId);lastD=0;if(!ptr.size)cv.classList.remove('drag')};
 cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);cv.addEventListener('pointerleave',e=>{if(e.pointerType=='mouse'&&!ptr.size){tr=null;draw()}});
 rebuild();
 return{draw,rebuild,build}})();

/* ===== STATS ===== */
const stat=(()=>{
 const sd=$r('#sd');let last='';
 sd.value=store.get('c.sdata','');
 const T2=v=>Number.isNaN(v)?'—':typeof v=='number'&&isFinite(v)&&Math.abs(v)>=1e-6&&Math.abs(v)<1e9?String(+v.toPrecision(7)):E.fmt(v,{mode:'auto'}),tile=(l,v)=>{const t=typeof v=='number'?T2(v):v;return`<div class="stat" data-c="${qa(t)}"><b>${esc(t)}</b><span>${l}</span></div>`};
 function block(title,s){
  if(!s)return'';
  const mt=s.modes.length?(s.modes.length>4?s.modes.slice(0,4).map(T2).join(', ')+'…':s.modes.map(T2).join(', ')):'none';
  const nb=Math.max(3,Math.min(12,Math.ceil(Math.sqrt(s.n)))),w=(s.max-s.min)/nb||1,bins=Array(nb).fill(0);s.sorted.forEach(x=>bins[Math.min(nb-1,Math.floor((x-s.min)/w))]++);const mb=Math.max(...bins);
  return`<h5 class="sech">${title}</h5><div class="stats">${[['Count',s.n],['Sum',s.sum],['Mean',s.mean],['Median',s.median],['Mode',mt],['Min',s.min],['Max',s.max],['Range',s.range],['Std dev (sample)',s.sdS],['Std dev (pop.)',s.sdP],['Variance (sample)',s.varS],['Variance (pop.)',s.varP],['Q1',s.q1],['Q3',s.q3],['IQR',s.iqr],['Geo. mean',s.gm],['Harm. mean',s.hm],['Std error',s.sem],['Coef. of var.',s.cv],['Skewness',s.skew],['Sum of squares',s.sumsq]].map(([l,v])=>tile(l,v)).join('')}</div>
  <div class="hist" title="Histogram">${bins.map((c,i)=>`<i style="--h:${c/mb*100}%;--i:${i}" title="${T2(s.min+i*w)} – ${T2(s.min+(i+1)*w)}: ${c}"></i>`).join('')}</div>`}
 function render(){
  const txt=sd.value;store.set('c.sdata',txt);const out=$r('#sout');
  const lines=txt.split(/\n/).map(l=>E.parseNums(l)).filter(a=>a.length);
  if(!lines.length){out.innerHTML='<p class="sempty">Paste or type some numbers above ✨</p>';last='';return}
  const pairs=lines.length>=2&&lines.every(a=>a.length==2);let h='';
  if(pairs){
   const xs=lines.map(a=>a[0]),ys=lines.map(a=>a[1]),rg=E.regress(lines);
   if(rg)h+=`<h5 class="sech">Linear regression</h5><div class="regl"><code data-c="y = ${qa(T2(rg.m))}x ${rg.b<0?'−':'+'} ${qa(T2(Math.abs(rg.b)))}">y = ${esc(T2(rg.m))}x ${rg.b<0?'−':'+'} ${esc(T2(Math.abs(rg.b)))}</code></div><div class="stats">${[['Slope (m)',rg.m],['Intercept (b)',rg.b],['Correlation r',rg.r],['R²',rg.r2],['Points',rg.n]].map(([l,v])=>tile(l,v)).join('')}</div>`;
   h+=block('X values',E.stats(xs))+block('Y values',E.stats(ys));
   last=`Linear regression: y = ${T2(rg?rg.m:NaN)}x + ${T2(rg?rg.b:NaN)}, r = ${T2(rg?rg.r:NaN)}`}
  else{const all=lines.flat(),s=E.stats(all);h=block('Summary',s);last=s?['n','sum','mean','median','min','max','sdS','sdP'].map(k=>`${k}: ${T2(s[k])}`).join('\n'):''}
  out.innerHTML=h}
 sd.addEventListener('input',render);sd.addEventListener('keydown',e=>e.stopPropagation());
 $r('#sdemo').onclick=()=>{sd.value='4, 8, 15, 16, 23, 42, 8, 15, 8';render()};
 $r('#sdemo2').onclick=()=>{sd.value='1 2.1\n2 3.9\n3 6.2\n4 7.8\n5 10.1\n6 12.2';render()};
 $r('#sclr').onclick=()=>{sd.value='';render()};
 $r('#scp').onclick=()=>last?copy(last):toast('Nothing to copy yet');
 return{render}})();

/* ===== keyboard ===== */
window.onkeydown=e=>{
 if(!r.isConnected)return;if(e.ctrlKey||e.metaKey||e.altKey)return;
 const tag=document.activeElement.tagName,typing=/INPUT|TEXTAREA|SELECT/.test(tag);
 if(mode=='basic'){const m={'/':'÷','*':'×','-':'−',Enter:'=','=':'=',Backspace:'⌫',Delete:'C',c:'C',C:'C'};
  if(typing)return;if(e.key=='Escape')return;
  if(/^[\d+.%()]$/.test(e.key)||m[e.key]){e.preventDefault();r._basicKey(m[e.key]||e.key)}return}
 if(typing||e.key.length!=1)return;
 if(sub=='sci'){ex.focus();}else if(sub=='prog'){pe.focus()}};

/* ===== init ===== */
const showNow=(el,hide)=>{hide.forEach(h=>h.hidden=true);el.hidden=false};
cm.set(mode,true);asub.set(sub,true);ss.set(side,true);pbase.set(String(PS.base),true);pbits.set(String(PS.bits),true);psign.set(PS.signed?'s':'u',true);
showNow(mode=='basic'?pb:pa,[pb,pa]);if(mode=='adv')showNow(subs[sub],Object.values(subs));
showNow(sh,[sh,sv,sq]);
renderHist();renderVars();pkeys();live();pcalc();stat.render();
if('ResizeObserver' in window){const ro=new ResizeObserver(()=>refit());ro.observe($r('#cw'))}
setTimeout(refit,60);setTimeout(refit,450);
});
})();
