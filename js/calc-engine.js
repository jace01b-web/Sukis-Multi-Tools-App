/* Suki's calculator engine — safe expression parser (no eval/Function), formatter, fractions, stats, programmer (BigInt) math */
const CalcEngine=(()=>{
'use strict';
const D={deg:Math.PI/180,rad:1,grad:Math.PI/200};
const cl=x=>Math.abs(x)<1e-15?0:+x.toPrecision(15);
const toR=(x,c)=>x*D[c.angle||'rad'],fromR=(x,c)=>x/D[c.angle||'rad'];
const CONST={pi:Math.PI,e:Math.E,tau:Math.PI*2,phi:(1+Math.sqrt(5))/2,inf:Infinity,infinity:Infinity};

/* ---------- math helpers ---------- */
function gamma(z){
  if(z<.5)return Math.PI/(Math.sin(Math.PI*z)*gamma(1-z));
  z-=1;const g=7,C=[.99999999999980993,676.5203681218851,-1259.1392167224028,771.32342877765313,-176.61502916214059,12.507343278686905,-.13857109526572012,9.9843695780195716e-6,1.5056327351493116e-7];
  let x=C[0];for(let i=1;i<g+2;i++)x+=C[i]/(z+i);const t=z+g+.5;
  return Math.sqrt(2*Math.PI)*Math.pow(t,z+.5)*Math.exp(-t)*x}
function fact(n){
  if(n<0&&Number.isInteger(n))return NaN;
  if(Number.isInteger(n)){if(n>170)return Infinity;let r=1;for(let i=2;i<=n;i++)r*=i;return r}
  return gamma(n+1)}
const isInt=Number.isInteger;
function ncr(n,k){if(!isInt(n)||!isInt(k)||n<0||k<0||k>n)return NaN;k=Math.min(k,n-k);let r=1;for(let i=1;i<=k;i++)r=r*(n-k+i)/i;return Math.round(r)}
function npr(n,k){if(!isInt(n)||!isInt(k)||n<0||k<0||k>n)return NaN;let r=1;for(let i=0;i<k;i++)r*=n-i;return r}
const gcd=(a,b)=>{a=Math.abs(a);b=Math.abs(b);while(b)[a,b]=[b,a%b];return a};
function pow(a,b){
  if(a<0&&!isInt(b)){const k=1/b;if(isInt(Math.round(k))&&Math.abs(k-Math.round(k))<1e-12&&Math.round(k)%2!==0)return-Math.pow(-a,b);return NaN}
  return Math.pow(a,b)}
function isPrime(n){if(!isInt(n)||n<2)return 0;if(n<4)return 1;if(n%2==0||n%3==0)return 0;for(let i=5;i*i<=n;i+=6)if(n%i==0||n%(i+2)==0)return 0;return 1}
const med=a=>{const s=[...a].sort((x,y)=>x-y),m=s.length>>1;return s.length%2?s[m]:(s[m-1]+s[m])/2};
const mean=a=>a.reduce((x,y)=>x+y,0)/a.length;
const varr=(a,s)=>{const m=mean(a);return a.reduce((x,y)=>x+(y-m)**2,0)/(a.length-(s?1:0))};

/* ---------- functions ---------- */
// each: [minArgs,maxArgs,fn(ctx,...args)]
const F={
sin:[1,1,(c,x)=>cl(Math.sin(toR(x,c)))],cos:[1,1,(c,x)=>cl(Math.cos(toR(x,c)))],
tan:[1,1,(c,x)=>{const r=toR(x,c);return Math.abs(Math.cos(r))<1e-14?NaN:cl(Math.tan(r))}],
asin:[1,1,(c,x)=>cl(fromR(Math.asin(x),c))],acos:[1,1,(c,x)=>cl(fromR(Math.acos(x),c))],atan:[1,1,(c,x)=>cl(fromR(Math.atan(x),c))],
atan2:[2,2,(c,y,x)=>cl(fromR(Math.atan2(y,x),c))],
sinh:[1,1,(c,x)=>cl(Math.sinh(x))],cosh:[1,1,(c,x)=>cl(Math.cosh(x))],tanh:[1,1,(c,x)=>cl(Math.tanh(x))],
asinh:[1,1,(c,x)=>cl(Math.asinh(x))],acosh:[1,1,(c,x)=>cl(Math.acosh(x))],atanh:[1,1,(c,x)=>cl(Math.atanh(x))],
sec:[1,1,(c,x)=>cl(1/Math.cos(toR(x,c)))],csc:[1,1,(c,x)=>cl(1/Math.sin(toR(x,c)))],cot:[1,1,(c,x)=>cl(1/Math.tan(toR(x,c)))],
ln:[1,1,(c,x)=>x>0?Math.log(x):x===0?-Infinity:NaN],
log:[1,2,(c,x,b)=>b===undefined?(x>0?cl(Math.log10(x)):x===0?-Infinity:NaN):(x>0&&b>0&&b!==1?cl(Math.log(x)/Math.log(b)):NaN)],
log2:[1,1,(c,x)=>x>0?cl(Math.log2(x)):x===0?-Infinity:NaN],
exp:[1,1,(c,x)=>Math.exp(x)],sqrt:[1,1,(c,x)=>x<0?NaN:cl(Math.sqrt(x))],cbrt:[1,1,(c,x)=>cl(Math.cbrt(x))],
root:[2,2,(c,x,n)=>n==0?NaN:pow(x,1/n)],pow:[2,2,(c,a,b)=>pow(a,b)],sq:[1,1,(c,x)=>x*x],cube:[1,1,(c,x)=>x*x*x],
abs:[1,1,(c,x)=>Math.abs(x)],sign:[1,1,(c,x)=>Math.sign(x)],floor:[1,1,(c,x)=>Math.floor(x)],ceil:[1,1,(c,x)=>Math.ceil(x)],
round:[1,2,(c,x,d=0)=>{const m=10**d;return Math.round(x*m)/m}],
trunc:[1,1,(c,x)=>Math.trunc(x)],frac:[1,1,(c,x)=>x-Math.trunc(x)],
fact:[1,1,(c,x)=>fact(x)],gamma:[1,1,(c,x)=>gamma(x)],ncr:[2,2,(c,n,k)=>ncr(n,k)],npr:[2,2,(c,n,k)=>npr(n,k)],
gcd:[2,99,(c,...a)=>a.reduce(gcd)],lcm:[2,99,(c,...a)=>a.reduce((x,y)=>x&&y?Math.abs(x*y)/gcd(x,y):0)],
mod:[2,2,(c,a,b)=>{if(b===0)throw new Error('Cannot divide by zero');return cl(a-b*Math.floor(a/b))}],
min:[1,99,(c,...a)=>Math.min(...a)],max:[1,99,(c,...a)=>Math.max(...a)],sum:[1,99,(c,...a)=>a.reduce((x,y)=>x+y,0)],
mean:[1,99,(c,...a)=>mean(a)],median:[1,99,(c,...a)=>med(a)],stdev:[2,99,(c,...a)=>Math.sqrt(varr(a,1))],stdevp:[1,99,(c,...a)=>Math.sqrt(varr(a,0))],
var:[2,99,(c,...a)=>varr(a,1)],varp:[1,99,(c,...a)=>varr(a,0)],
hypot:[1,99,(c,...a)=>Math.hypot(...a)],
rand:[0,0,()=>Math.random()],randint:[2,2,(c,a,b)=>a+Math.floor(Math.random()*(b-a+1))],
deg:[1,1,(c,x)=>cl(x*180/Math.PI)],rad:[1,1,(c,x)=>x*Math.PI/180],
fib:[1,1,(c,n)=>{if(!isInt(n)||n<0||n>1476)return NaN;let a=0,b=1;for(let i=0;i<n;i++)[a,b]=[b,a+b];return a}],
isprime:[1,1,(c,x)=>isPrime(x)],
clamp:[3,3,(c,x,a,b)=>Math.min(b,Math.max(a,x))],
lerp:[3,3,(c,a,b,t)=>a+(b-a)*t]
};
const ALIAS={avg:'mean',average:'mean',sgn:'sign',ceiling:'ceil',int:'trunc',cosec:'csc',sqr:'sq',comb:'ncr',perm:'npr',nthroot:'root',lg:'log',arcsin:'asin',arccos:'acos',arctan:'atan',stddev:'stdev',factorial:'fact',ln2:'log2',variance:'var',random:'rand',prime:'isprime',sd:'stdev'};
const fname=n=>{n=n.toLowerCase();return ALIAS[n]||n};
const isFn=n=>fname(n) in F;
const reserved=n=>{n=n.toLowerCase();return n in CONST||isFn(n)||n=='ans'||n=='mod'};

/* ---------- lexer ---------- */
function norm(s){
  return String(s).replace(/[×·∙⋅]/g,'*').replace(/÷/g,'/').replace(/[−–—]/g,'-')
   .replace(/π/g,' pi ').replace(/τ/g,' tau ').replace(/φ/g,' phi ').replace(/∞/g,' inf ')
   .replace(/⁻¹/g,'^(-1)').replace(/²/g,'^2').replace(/³/g,'^3')
   .replace(/∛\s*(\d+\.?\d*|\.\d+|[A-Za-z_]\w*)/g,'cbrt($1)').replace(/√\s*(\d+\.?\d*|\.\d+|[A-Za-z_]\w*)/g,'sqrt($1)').replace(/∛/g,'cbrt').replace(/√/g,'sqrt')
   .replace(/[“”‘’]/g,'')}
function lex(s){
  const out=[];let i=0;
  while(i<s.length){
    const c=s[i];if(/\s/.test(c)){i++;continue}
    const rest=s.slice(i);let m;
    if(m=/^0[xX][0-9a-fA-F]+/.exec(rest)){out.push({t:'num',v:parseInt(m[0].slice(2),16)});i+=m[0].length;continue}
    if(m=/^0[bB][01]+/.exec(rest)){out.push({t:'num',v:parseInt(m[0].slice(2),2)});i+=m[0].length;continue}
    if(m=/^0[oO][0-7]+/.exec(rest)){out.push({t:'num',v:parseInt(m[0].slice(2),8)});i+=m[0].length;continue}
    if(m=/^(\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/.exec(rest)){out.push({t:'num',v:+m[0]});i+=m[0].length;continue}
    if(m=/^[A-Za-z_][A-Za-z_0-9]*/.exec(rest)){out.push({t:'id',v:m[0]});i+=m[0].length;continue}
    if(rest.startsWith('**')){out.push({t:'op',v:'^'});i+=2;continue}
    if('+-*/^!%(),'.includes(c)){out.push({t:'op',v:c});i++;continue}
    throw new Error(`Unexpected "${c}"`)}
  return out}

/* ---------- parser ---------- */
const BIN={'+':[10],'-':[10],'*':[20],'/':[20],'^':[30,1]};
function parse(src){
  const tk=lex(norm(src));tk.push({t:'end'});let p=0;
  const peek=()=>tk[p],next=()=>tk[p++],isOp=v=>peek().t=='op'&&peek().v==v;
  const startsOperand=k=>k.t=='num'||(k.t=='id'&&k.v.toLowerCase()!='mod')||(k.t=='op'&&k.v=='(');
  const close=()=>{if(isOp(')'))next();else if(peek().t!='end')throw new Error('Missing )')};
  function expr(min){
    let l=prefix();
    for(;;){
      const k=peek();
      if(k.t=='op'){
        if(k.v=='!'){next();l={t:'fact',a:l};continue}
        if(k.v=='%'){
          if(startsOperand(tk[p+1])&&20>=min){next();const r=expr(21);l={t:'bin',op:'mod',a:l,b:r};continue}
          next();l={t:'pct',a:l};continue}
        const b=BIN[k.v];
        if(b&&b[0]>=min){next();const r=expr(b[1]?b[0]:b[0]+1);l={t:'bin',op:k.v,a:l,b:r};continue}
        if(k.v=='('&&20>=min){const r=expr(21);l={t:'bin',op:'*',a:l,b:r};continue}
        break}
      if(k.t=='id'&&k.v.toLowerCase()=='mod'&&20>=min){next();const r=expr(21);l={t:'bin',op:'mod',a:l,b:r};continue}
      if((k.t=='id'||(k.t=='num'&&l.t!='num'))&&20>=min){const r=expr(21);l={t:'bin',op:'*',a:l,b:r};continue}
      break}
    return l}
  function prefix(){
    const k=next();
    if(k.t=='num')return{t:'num',v:k.v};
    if(k.t=='op'){
      if(k.v=='-')return{t:'un',a:expr(25)};
      if(k.v=='+')return expr(25);
      if(k.v=='('){const e=expr(0);close();return e}}
    if(k.t=='id'){
      if(isOp('(')){next();const a=[];if(!isOp(')')&&peek().t!='end'){do{a.push(expr(0))}while(isOp(',')&&next())}close();return{t:'call',n:k.v,a}}
      if(isFn(k.v)&&startsOperand(peek())){return{t:'call',n:k.v,a:[expr(25)]}}
      return{t:'var',n:k.v}}
    throw new Error(k.t=='end'?'Incomplete expression':`Unexpected "${k.v}"`)}
  const e=expr(0);
  if(peek().t!='end')throw new Error(peek().t=='op'&&peek().v==')'?'Extra )':'Syntax error');
  return e}

/* ---------- evaluator ---------- */
function getVar(n,c){
  if(c.vars&&Object.prototype.hasOwnProperty.call(c.vars,n))return c.vars[n];
  const l=n.toLowerCase();
  if(l=='ans')return c.ans||0;
  if(l in CONST)return CONST[l];
  if(n.length>1&&[...n].every(ch=>c.vars&&ch in c.vars))return[...n].reduce((a,ch)=>a*c.vars[ch],1);
  throw new Error(`Unknown name "${n}"`)}
function ev(n,c,depth=0){
  if(depth>400)throw new Error('Expression too deep');
  const r=x=>ev(x,c,depth+1);
  switch(n.t){
    case'num':return n.v;
    case'var':return getVar(n.n,c);
    case'un':return-r(n.a);
    case'pct':return r(n.a)/100;
    case'fact':return fact(r(n.a));
    case'bin':{
      const a=r(n.a);
      if((n.op=='+'||n.op=='-')&&n.b.t=='pct'){const p=r(n.b.a);return n.op=='+'?a+a*p/100:a-a*p/100}
      const b=r(n.b);
      switch(n.op){
        case'+':return a+b;case'-':return a-b;case'*':return a*b;
        case'/':if(b===0)throw new Error('Cannot divide by zero');return a/b;
        case'^':return pow(a,b);
        case'mod':if(b===0)throw new Error('Cannot divide by zero');return cl(a-b*Math.floor(a/b))}
      return NaN}
    case'call':{
      const name=n.n,f=c.funcs&&c.funcs[name];
      if(f){
        if(n.a.length!=f.p.length)throw new Error(`${name} needs ${f.p.length} argument${f.p.length>1?'s':''}`);
        const vars=Object.assign({},c.vars);f.p.forEach((p,i)=>vars[p]=r(n.a[i]));
        return ev(f.ast,Object.assign({},c,{vars}),depth+1)}
      const k=fname(name),fn=F[k];
      if(!fn){ // implicit multiply: x(3) with x a variable
        if(n.a.length==1&&c.vars&&name in c.vars)return c.vars[name]*r(n.a[0]);
        throw new Error(`Unknown function "${name}"`)}
      if(n.a.length<fn[0]||n.a.length>fn[1])throw new Error(fn[0]==fn[1]?`${k} needs ${fn[0]} argument${fn[0]!=1?'s':''}`:`${k} needs ${fn[0]}–${fn[1]} arguments`);
      return fn[2](c,...n.a.map(r))}}
  throw new Error('Syntax error')}

/* run: supports "a=5", "x+=2", "f(x)=x^2", ";" separated statements */
function run(src,c){
  let last={kind:'val',value:0};
  const parts=String(src).split(';').filter(s=>s.trim());
  if(!parts.length)throw new Error('Empty');
  for(const part of parts){
    let m;
    if(m=/^\s*([A-Za-z_]\w*)\s*\(([^)]*)\)\s*(?::=|=)(?!=)\s*(.+)$/.exec(part)){
      const name=m[1],ps=m[2].split(',').map(x=>x.trim()).filter(Boolean);
      if(reserved(name))throw new Error(`"${name}" is a built-in name`);
      if(ps.some(x=>!/^[A-Za-z_]\w*$/.test(x)))throw new Error('Bad parameter list');
      const ast=parse(m[3]);c.funcs=c.funcs||{};c.funcs[name]={p:ps,ast,src:m[3].trim()};
      last={kind:'def',name,text:`${name}(${ps.join(', ')}) = ${m[3].trim()}`};continue}
    if(m=/^\s*([A-Za-z_]\w*)\s*([+\-*/^])?(?::=|=)(?!=)\s*(.+)$/.exec(part)){
      const name=m[1];if(reserved(name))throw new Error(`"${name}" is a built-in name`);
      c.vars=c.vars||{};let v=ev(parse(m[3]),c);
      if(m[2]){const o=c.vars[name];if(o===undefined)throw new Error(`Unknown name "${name}"`);v=ev({t:'bin',op:m[2],a:{t:'num',v:o},b:{t:'num',v}},c)}
      c.vars[name]=cl(v);last={kind:'asg',name,value:cl(v)};continue}
    const v=ev(parse(part),c);last={kind:'val',value:cl(v)}}
  return last}

/* ---------- formatting ---------- */
function plain(v,sig){
  const p=+v.toPrecision(sig);let s=p.toString();
  if(/e/.test(s)){s=p.toFixed(Math.min(100,Math.max(0,sig-1-Math.floor(Math.log10(Math.abs(p))))));s=s.replace(/(\.\d*?)0+$/,'$1').replace(/\.$/,'')}
  return s}
function groupNum(s){if(/e/.test(s))return s;const [i,f]=s.split('.');return i.replace(/\B(?=(\d{3})+(?!\d))/g,',')+(f!==undefined?'.'+f:'')}
function fmt(v,o={}){
  const mode=o.mode||'auto',d=o.digits??4;
  if(typeof v!='number')return String(v);
  if(Number.isNaN(v))return'Math error';
  if(!isFinite(v))return v<0?'−∞':'∞';
  if(v===0)return'0';
  const a=Math.abs(v);let s;
  if(mode=='fix'&&a<1e21)s=v.toFixed(d);
  else if(mode=='sci'){s=v.toExponential(d)}
  else if(mode=='eng'){const e=Math.floor(Math.log10(a)/3)*3,m=v/10**e;s=(+m.toFixed(d))+'e'+(e<0?'':'+')+e}
  else if(a>=1e15||a<1e-9){let [m,e]=v.toExponential(11).split('e');m=m.replace(/\.?0+$/,'');s=m+'e'+e}
  else s=plain(v,12);
  if(o.group&&(mode=='auto'||mode=='fix'))s=groupNum(s);
  return s.replace(/^-/,'−')}

function frac(x,maxD=10000){
  if(!isFinite(x)||isInt(x))return null;
  const sign=x<0?-1:1,a=Math.abs(x);let h1=1,h0=0,k1=0,k0=1,b=a;
  for(let i=0;i<40;i++){
    const ai=Math.floor(b),h2=ai*h1+h0,k2=ai*k1+k0;
    if(k2>maxD)break;
    h0=h1;h1=h2;k0=k1;k1=k2;
    if(Math.abs(a-h1/k1)<1e-11*Math.max(1,a))break;
    b=1/(b-ai);if(!isFinite(b))break}
  if(!k1||Math.abs(a-h1/k1)>1e-9*Math.max(1,a))return null;
  return{n:sign*h1,d:k1}}

/* ---------- statistics ---------- */
function parseNums(txt){return(txt.match(/[-+−]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?/g)||[]).map(x=>+x.replace('−','-'))}
function quant(s,q){const p=(s.length-1)*q,lo=Math.floor(p),hi=Math.ceil(p);return s[lo]+(s[hi]-s[lo])*(p-lo)}
function stats(arr){
  const n=arr.length;if(!n)return null;
  const s=[...arr].sort((x,y)=>x-y),sum=arr.reduce((x,y)=>x+y,0),m=sum/n;
  const cnt=new Map();arr.forEach(x=>cnt.set(x,(cnt.get(x)||0)+1));
  const mx=Math.max(...cnt.values()),modes=mx>1?[...cnt].filter(e=>e[1]==mx).map(e=>e[0]):[];
  const ss=arr.reduce((x,y)=>x+(y-m)**2,0),vP=ss/n,vS=n>1?ss/(n-1):NaN;
  const q1=quant(s,.25),q3=quant(s,.75);
  const m3=arr.reduce((x,y)=>x+(y-m)**3,0)/n,skew=vP?m3/vP**1.5:0;
  return{n,sum,mean:m,median:quant(s,.5),modes,min:s[0],max:s[n-1],range:s[n-1]-s[0],varP:vP,varS:vS,sdP:Math.sqrt(vP),sdS:Math.sqrt(vS),
   q1,q3,iqr:q3-q1,sumsq:arr.reduce((x,y)=>x+y*y,0),gm:s[0]>0?Math.exp(arr.reduce((x,y)=>x+Math.log(y),0)/n):NaN,
   hm:s[0]>0?n/arr.reduce((x,y)=>x+1/y,0):NaN,sem:n>1?Math.sqrt(vS/n):NaN,cv:m?Math.sqrt(vS)/Math.abs(m):NaN,skew,sorted:s}}
function regress(pts){
  const n=pts.length;if(n<2)return null;
  const mx=mean(pts.map(p=>p[0])),my=mean(pts.map(p=>p[1]));
  let sxy=0,sxx=0,syy=0;pts.forEach(([x,y])=>{sxy+=(x-mx)*(y-my);sxx+=(x-mx)**2;syy+=(y-my)**2});
  if(!sxx)return null;const m=sxy/sxx,b=my-m*mx,r=syy?sxy/Math.sqrt(sxx*syy):1;
  return{n,m,b,r,r2:r*r}}

/* ---------- programmer mode (BigInt) ---------- */
const PW=['nand','xnor','and','nor','xor','not','or','mod','lsh','rsh','shl','shr'];
const PPREC={'|':1,or:1,nor:1,'^':2,xor:2,xnor:2,'&':3,and:3,nand:3,'<<':4,'>>':4,lsh:4,rsh:4,shl:4,shr:4,'+':5,'-':5,'*':6,'/':6,'%':6,mod:6};
const DIG={2:/^[01]+/,8:/^[0-7]+/,10:/^[0-9]+/,16:/^[0-9a-fA-F]+/};
function progEval(src,base,bits,signed){
  const B=BigInt(bits),MASK=(1n<<B)-1n,HALF=1n<<(B-1n);
  const wrap=x=>{let u=x&MASK;return signed&&u>=HALF?u-(1n<<B):u};
  const tk=[];let i=0;const s=String(src).replace(/[×·]/g,'*').replace(/÷/g,'/').replace(/−/g,'-').replace(/_/g,'');
  while(i<s.length){
    const c=s[i];if(/\s/.test(c)){i++;continue}
    const rest=s.slice(i);let m;
    if(m=/^(nand|xnor|and|nor|xor|not|or|mod|lsh|rsh|shl|shr)(?![a-z])/i.exec(rest)){tk.push({t:'op',v:m[1].toLowerCase()});i+=m[1].length;continue}
    if(m=/^0[xX]([0-9a-fA-F]+)/.exec(rest)){tk.push({t:'n',v:BigInt('0x'+m[1])});i+=m[0].length;continue}
    if(base!=16&&(m=/^0[bB]([01]+)/.exec(rest))){tk.push({t:'n',v:BigInt('0b'+m[1])});i+=m[0].length;continue}
    if(m=/^0[oO]([0-7]+)/.exec(rest)){tk.push({t:'n',v:BigInt('0o'+m[1])});i+=m[0].length;continue}
    if(m=DIG[base].exec(rest)){const pre=base==16?'0x':base==8?'0o':base==2?'0b':'';tk.push({t:'n',v:BigInt(pre+m[0])});i+=m[0].length;continue}
    if(rest.startsWith('>>>')){tk.push({t:'op',v:'>>>'});i+=3;continue}
    if(rest.startsWith('<<')||rest.startsWith('>>')){tk.push({t:'op',v:rest.slice(0,2)});i+=2;continue}
    if('+-*/%&|^~()'.includes(c)){tk.push({t:'op',v:c});i++;continue}
    throw new Error(`Unexpected "${c}"`)}
  tk.push({t:'end'});let p=0;
  const peek=()=>tk[p];
  const ex=min=>{
    let l=un();
    for(;;){
      const k=peek();if(k.t!='op')break;
      const pr=PPREC[k.v]||(k.v=='>>>'?4:0);if(!pr||pr<min)break;
      p++;const r=ex(pr+1);l=bin(k.v,l,r)}
    return l};
  const bin=(o,a,b)=>{
    switch(o){
      case'+':return wrap(a+b);case'-':return wrap(a-b);case'*':return wrap(a*b);
      case'/':if(b==0n)throw new Error('Cannot divide by zero');return wrap(a/b);
      case'%':case'mod':if(b==0n)throw new Error('Cannot divide by zero');return wrap(a%b);
      case'&':case'and':return wrap(a&b);case'|':case'or':return wrap(a|b);case'^':case'xor':return wrap(a^b);
      case'nand':return wrap(~(a&b));case'nor':return wrap(~(a|b));case'xnor':return wrap(~(a^b));
      case'<<':case'lsh':case'shl':if(b<0n)throw new Error('Negative shift');return wrap(b>=B?0n:a<<b);
      case'>>':case'rsh':case'shr':if(b<0n)throw new Error('Negative shift');return wrap(a>>(b>B?B:b));
      case'>>>':if(b<0n)throw new Error('Negative shift');return wrap(b>=B?0n:(a&MASK)>>b)}
    return 0n};
  const un=()=>{
    const k=tk[p++];
    if(k.t=='n')return wrap(k.v);
    if(k.t=='op'){
      if(k.v=='-')return wrap(-un());if(k.v=='+')return un();
      if(k.v=='~'||k.v=='not')return wrap(~un());
      if(k.v=='('){const e=ex(0);if(peek().t=='op'&&peek().v==')')p++;else if(peek().t!='end')throw new Error('Missing )');return e}}
    throw new Error(k.t=='end'?'Incomplete expression':`Unexpected "${k.v||''}"`)};
  const v=ex(0);if(peek().t!='end')throw new Error('Syntax error');
  return v}

return{parse,ev,run,fmt,frac,stats,regress,parseNums,progEval,F,isFn,reserved,fname,CONST,gamma,fact,groupNum,norm,
  fnNames:()=>Object.keys(F).sort()}
})();
if(typeof module!=='undefined')module.exports=CalcEngine;
