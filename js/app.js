(()=>{const TABS=[['home','🏠','Home'],['tools','🧰','Tools'],['favs','⭐','Favorites'],['settings','⚙️','Settings']],ORD=['home','tools','favs','settings','tool'],CI={All:'✨',Text:'📝',Dev:'💻',Math:'🧮',Design:'🎨',Time:'⏱️',Fun:'🎲'};
const fav=()=>store.get('fav',[]),rec=()=>store.get('rec',[]),byId=id=>TOOLS.find(t=>t.id==id),pad=n=>String(n).padStart(2,0);
let at='',from='tools',cur=null,cat='All',th;
const io='IntersectionObserver' in window?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.06}):null;
const reveal=r=>$$('.card,.tile,.grp',r||document).forEach(e=>{if(e.classList.contains('rv'))return;e.classList.add('rv');io?io.observe(e):e.classList.add('in')});
/* ---------- nav ---------- */
$('#tabs').innerHTML='<i class="ind" id="ind"></i>'+TABS.map(([k,i,n])=>`<button data-s="${k}"><span>${i}</span><b>${n}</b>${k=='favs'?'<em id="fb"></em>':''}</button>`).join('');
const ind=n=>{const b=$(`#tabs [data-s="${n}"]`);if(!b)return;$$('#tabs button').forEach(x=>x.classList.toggle('on',x==b));$('#ind').style.cssText=`width:${b.offsetWidth}px;transform:translateX(${b.offsetLeft}px)`};
function go(n){if(n==at)return;const nx=$('#s-'+n),pv=at&&$('#s-'+at),d=ORD.indexOf(n)>=ORD.indexOf(at)?1:-1;
$$('.sv').forEach(x=>{if(x!=nx&&x!=pv){x.hidden=true;x.classList.remove('on','out')}});nx.style.setProperty('--dx',d*44+'px');
if(pv){pv.style.setProperty('--dx',-d*44+'px');pv.classList.remove('on');pv.classList.add('out');setTimeout(()=>{if(pv.classList.contains('out')){pv.hidden=true;pv.classList.remove('out')}},220)}
setTimeout(()=>{nx.classList.remove('out');nx.hidden=false;nx.classList.remove('on');void nx.offsetWidth;nx.classList.add('on');scrollTo({top:0,behavior:'instant'})},pv?180:0);at=n;ind(n=='tool'?from:n)}
function route(){const h=location.hash.slice(1)||'home';if(h.startsWith('tool/')){const t=byId(h.slice(5));if(!t)return location.hash='tools';if(at!='tool'&&at)from=at;openTool(t);go('tool')}else{const n=ORD.slice(0,4).includes(h)?h:'home';if(n=='favs')renderFavs();go(n)}}
addEventListener('hashchange',route);addEventListener('resize',()=>ind(at=='tool'?from:at));
/* ---------- cards / favorites ---------- */
const card=(t,i)=>`<div class="card" tabindex="0" data-id="${t.id}" style="--i:${i}"><button class="heart ${fav().includes(t.id)?'on':''}" data-h="${t.id}" aria-label="Favorite">${fav().includes(t.id)?'♥':'♡'}</button><div class="ic">${t.ic}</div><h3>${t.name}</h3><p>${t.desc}</p></div>`;
const chip=id=>{const t=byId(id);return t?`<button class="mini" data-go="${id}">${t.ic} ${t.name}</button>`:''};
function badge(){const n=fav().length;$('#fb').textContent=n||'';ind(at=='tool'?from:at)}
function toggleFav(id){let f=fav();const on=!f.includes(id);f=on?[...f,id]:f.filter(x=>x!=id);store.set('fav',f);$$(`[data-h="${id}"]`).forEach(h=>{h.classList.toggle('on',on);h.textContent=on?'♥':'♡';h.classList.remove('beat');void h.offsetWidth;h.classList.add('beat')});badge();stats();
if(!on&&at=='favs'){const c=$(`#fgrid [data-id="${id}"]`);if(c){c.classList.add('gone');setTimeout(()=>{c.remove();$('#fempty').hidden=!!$$('#fgrid .card').length},340)}}
toast(on?'Added to favorites ⭐':'Removed from favorites')}
function renderFavs(){const f=fav().map(byId).filter(Boolean);$('#fgrid').innerHTML=f.map(card).join('');$('#fempty').hidden=!!f.length;reveal($('#fgrid'))}
/* ---------- tools section ---------- */
$('#s-tools').innerHTML=`<div class="ph"><h2>Tools</h2><p><span id="count">${TOOLS.length}</span> tools · private & offline · tap ♡ to favorite</p></div><div class="sbar"><input id="q" class="search" placeholder="Search tools…  (press / )" autocomplete="off"></div><div class="cats" id="cats">${['All',...Object.keys(CI).slice(1)].map(c=>`<button class="${c==cat?'on':''}">${CI[c]} ${c}</button>`).join('')}</div><div class="grid" id="grid"></div><p class="empty" id="empty">No tools match 🔍</p>`;
$('#s-favs').innerHTML=`<div class="ph"><h2>Favorites</h2><p>Your starred tools — saved in this browser.</p></div><div class="grid" id="fgrid"></div><div class="empty2" id="fempty"><span class="em2">💫</span>No favorites yet.<br>Tap the ♡ on any tool to pin it here.<br><br><button class="btn" data-go="tools">Browse tools</button></div>`;
function draw(){const q=$('#q').value.toLowerCase().trim(),l=TOOLS.filter(t=>(cat=='All'||t.cat==cat)&&(t.name+t.desc+t.cat).toLowerCase().includes(q));$('#grid').innerHTML=l.map(card).join('');$('#empty').style.display=l.length?'none':'block';reveal($('#grid'))}
$('#q').oninput=draw;$('#cats').onclick=e=>{const b=e.target.closest('button');if(!b)return;cat=b.textContent.replace(/^\S+\s/,'');$$('#cats button').forEach(x=>x.classList.toggle('on',x==b));draw()};
/* ---------- tool view ---------- */
$('#s-tool').innerHTML=`<button class="btn ghost" id="back">← Back</button><div class="vh"><div class="ic" id="vi"></div><div><h2 id="vt"></h2><p id="vd"></p></div><button class="heart big" id="vs"></button></div><div class="panel" id="vb"></div><div id="rel"></div>`;
$('#back').onclick=()=>location.hash=from;
function openTool(t){cur=t;$('#vi').textContent=t.ic;$('#vt').textContent=t.name;$('#vd').textContent=t.desc;const on=fav().includes(t.id),h=$('#vs');h.dataset.h=t.id;h.classList.toggle('on',on);h.textContent=on?'♥':'♡';$('#vb').innerHTML=t.html;t.init($('#vb'));
$('#rel').innerHTML=`<h4>More ${t.cat} tools</h4><div class="rec">${TOOLS.filter(x=>x.cat==t.cat&&x.id!=t.id).map(x=>chip(x.id)).join('')}</div>`;store.set('rec',[t.id,...rec().filter(x=>x!=t.id)].slice(0,6));store.set('used',store.get('used',0)+1);setTimeout(()=>{const i=$('#vb input:not([type=range]):not([type=checkbox]),#vb textarea');i&&i.focus({preventScroll:true})},400)}
/* ---------- home (data only) ---------- */
const TZ=[['New York','America/New_York'],['London','Europe/London'],['Tokyo','Asia/Tokyo'],['Sydney','Australia/Sydney']],MN=['New Moon','Waxing Crescent','First Quarter','Waxing Gibbous','Full Moon','Waning Gibbous','Last Quarter','Waning Crescent'],ME='🌑🌒🌓🌔🌕🌖🌗🌘',
Q=['Small steps every day beat big plans someday.','Done is better than perfect — ship it.','Take a breath. You are doing better than you think.','Curiosity is a superpower. Follow it today.','Focus on one thing for the next 25 minutes.','Rest is productive too. Drink some water.','Make something today that you would use yourself.','Progress, not perfection.','Your future self will thank you for starting now.','Be kind to yourself and to others today.'];
const tile=(cls,i,h,b)=>`<div class="tile ${cls}" style="--i:${i}"><h4>${h}</h4>${b}</div>`;
$('#s-home').innerHTML=`<div class="hh"><p class="hi" id="hi"></p><div class="clk" id="hc"></div><p class="dt" id="hd"></p><div class="hol" id="hl"></div></div><div class="tiles">`+
tile('',1,'Today',`<div class="row2"><div class="ringw"><svg class="rg" viewBox="0 0 80 80"><defs><linearGradient id="rgg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" style="stop-color:var(--a)"/><stop offset="1" style="stop-color:var(--b)"/></linearGradient></defs><circle cx="40" cy="40" r="34"/><circle id="rp" cx="40" cy="40" r="34" pathLength="100" stroke-dashoffset="100"/></svg></div><div><b id="dp" style="font-size:32px"></b><span class="v" id="dl"></span></div></div>`)+
tile('s8',2,'This week <span id="wn"></span>',`<div class="wk" id="wk">${'MTWTFSS'.split('').map(x=>`<i>${x}</i>`).join('')}</div><span class="v" id="we"></span>`)+
tile('',3,'This month',`<b id="mp" style="font-size:32px"></b><div class="bar"><i id="mb"></i></div><span class="v" id="ml"></span>`)+
tile('',4,'This year',`<b id="yp" style="font-size:32px"></b><div class="bar"><i id="yb"></i></div><span class="v" id="yl"></span>`)+
tile('',5,'Next holiday',`<div class="row2"><span class="em2" id="he"></span><div><b id="hn" style="font-size:22px"></b><span class="v" id="hdays"></span></div></div>`)+
tile('',6,'Moon',`<div class="row2"><span class="em2" id="me"></span><div><b id="mn" style="font-size:20px"></b><span class="v" id="mi"></span></div></div><div class="wc" style="margin-top:12px"><span>Next full moon</span><b id="mf"></b></div><div class="wc"><span>Next new moon</span><b id="mnn"></b></div>`)+
tile('',7,'Around the world',TZ.map((z,i)=>`<div class="wc"><span>${z[0]}</span><b id="wc${i}"></b></div>`).join(''))+
tile('',8,'Your clock',`<b id="pd" style="font-size:24px"></b><span class="v" id="tz"></span><span class="v" id="off"></span><div class="wc" style="margin-top:8px"><span>Local date</span><b id="iso"></b></div><div class="wc"><span>Unix time</span><b id="ux"></b></div>`)+
tile('',9,'Your stats',`<div class="nums"><div><b id="st1" style="font-size:28px"></b><span class="v">tool opens</span></div><div><b id="st2" style="font-size:28px"></b><span class="v">favorites</span></div></div><span class="v" id="st3"></span>`)+
tile('s8',10,'Daily nudge',`<p class="quote" id="qt"></p>`)+`</div>`;
function stats(){$('#st1').textContent=store.get('used',0);$('#st2').textContent=fav().length;$('#st3').textContent=`${TOOLS.length} tools ready · ${THEMES[th.k].e} ${THEMES[th.k].n} theme`}
const set=(id,v)=>{const e=$('#'+id);if(e&&e.textContent!==String(v))e.textContent=v};
function tick(){const n=new Date(),h24=store.get('h24',false),sec=store.get('secs',true),y=n.getFullYear(),m=n.getMonth(),d=n.getDate(),d0=new Date(y,m,d),pd=(n-d0)/864e5,hr=n.getHours(),nick=store.get('nick','');
set('hc',n.toLocaleTimeString([],{hour:'numeric',minute:'2-digit',second:sec?'2-digit':undefined,hour12:!h24}));set('hd',n.toLocaleDateString([],{weekday:'long',month:'long',day:'numeric',year:'numeric'}));
set('hi',(hr<5?'Still up':hr<12?'Good morning':hr<18?'Good afternoon':'Good evening')+(nick?', '+nick:'')+' '+(hr<5?'🦉':hr<12?'☀️':hr<18?'🌤️':'🌙'));
const left=864e5-(n-d0),lh=left/36e5|0,lm=Math.floor(left%36e5/6e4);set('dp',Math.floor(pd*100)+'%');$('#rp').style.strokeDashoffset=100-pd*100;set('dl',`${lh}h ${lm}m left today`);
const di=(n.getDay()+6)%7;$$('#wk i').forEach((e,i)=>e.className=i<di?'dn':i==di?'now':'');set('we',di>=5?"It's the weekend 🎉":`Weekend in ${5-di} day${5-di>1?'s':''}`);
const t=new Date(Date.UTC(y,m,d)),dn=t.getUTCDay()||7;t.setUTCDate(t.getUTCDate()+4-dn);const wn=Math.ceil(((t-Date.UTC(t.getUTCFullYear(),0,1))/864e5+1)/7);set('wn','· Week '+wn);
const dim=new Date(y,m+1,0).getDate(),mp=(d-1+pd)/dim*100,yl=(new Date(y+1,0,1)-new Date(y,0,1))/864e5,doy=Math.round((d0-new Date(y,0,1))/864e5)+1,yp=(doy-1+pd)/yl*100;
set('mp',mp.toFixed(0)+'%');$('#mb').style.width=mp+'%';set('ml',`${dim-d} days left in ${n.toLocaleDateString([],{month:'long'})}`);set('yp',yp.toFixed(1)+'%');$('#yb').style.width=yp+'%';set('yl',`Day ${doy} of ${yl}`);
const nh=nextHoliday(n),T=THEMES[nh.k];set('he',T.e);set('hn',T.n);set('hdays',nh.days?nh.days==1?'Tomorrow!':`in ${nh.days} days`:'Today! 🎉');
const jd=n/864e5+2440587.5,ph=(((jd-2451550.1)/29.530588853)%1+1)%1,mi=Math.round(ph*8)%8;set('me',ME[mi*2]+(ME[mi*2+1]||''));set('mn',MN[mi]);set('mi',Math.round((1-Math.cos(2*Math.PI*ph))/2*100)+'% illuminated');
const fd=Math.round(((.5-ph+1)%1)*29.53),nd=Math.round(((1-ph)%1)*29.53),dd=x=>x<1?'Today':x==1?'Tomorrow':x+' days';set('mf',dd(fd));set('mnn',dd(nd));set('iso',`${y}-${pad(m+1)}-${pad(d)}`);set('ux',Math.floor(n/1e3));
TZ.forEach((z,i)=>set('wc'+i,n.toLocaleTimeString([],{timeZone:z[1],hour:'numeric',minute:'2-digit',hour12:!h24})));
set('pd',hr<5?'Late night 🌌':hr<12?'Morning 🌅':hr<17?'Afternoon ☀️':hr<21?'Evening 🌇':'Night 🌙');set('tz',Intl.DateTimeFormat().resolvedOptions().timeZone);const o=-n.getTimezoneOffset();set('off',`UTC${o<0?'−':'+'}${pad(Math.abs(o)/60|0)}:${pad(Math.abs(o)%60)}`);set('qt','“'+Q[doy%Q.length]+'”')}
/* ---------- themes ---------- */
const tile2=(k,i,act)=>{const t=THEMES[k];return`<button class="tt ${act?'act':''}" data-th="${k}" style="--i:${i}"><div class="pv" style="background:linear-gradient(120deg,${t.g1},${t.a} 55%,${t.b})">${t.e}</div><b>${t.n}</b><small>${t.d}</small></button>`};
function tgrid(){const pick=store.get('theme','auto'),au=THEMES[autoTheme()];return`<div class="tgrid"><button class="tt auto ${pick=='auto'?'act':''}" data-th="auto" style="--i:0"><div class="pv" style="background:linear-gradient(120deg,#7c6cff,#ff7a1a,#2ecc71,#e63946)">🗓️</div><div><b>Auto — follows the calendar</b><br><small>Right now: ${au.e} ${au.n}</small></div></button>`+Object.keys(THEMES).map((k,i)=>tile2(k,i+1,pick==k)).join('')+'</div>'}
function paint(){th=applyTheme();const t=th.t;$('#themeBtn').innerHTML=`<span>${t.e}</span><b>${t.n}</b>${th.auto?'<em>AUTO</em>':''}<s>▾</s>`;if(!$('#pop').hidden)$('#pop').innerHTML='<h5>Choose a theme</h5>'+tgrid();const sg=$('#sg');if(sg)sg.innerHTML=tgrid();set('hl',th.k!='default'?t.m:'');if($('#st3'))stats()}
function pick(k,x,y){store.set('theme',k);paint();const f=document.createElement('div');f.className='flash';f.style.cssText=`left:${x}px;top:${y}px;background:radial-gradient(circle,${th.t.a},transparent 70%)`;document.body.append(f);setTimeout(()=>f.remove(),1000);toast(th.t.e+' '+th.t.n+(k=='auto'?' (auto)':''))}
$('#themeBtn').onclick=e=>{e.stopPropagation();const p=$('#pop');p.hidden=!p.hidden;if(!p.hidden)p.innerHTML='<h5>Choose a theme</h5>'+tgrid()};
/* ---------- settings ---------- */
const tg=(id,t,s)=>`<label class="tg"><span>${t}<small>${s}</small></span><input type="checkbox" id="${id}"><i></i></label>`;
$('#s-settings').innerHTML=`<div class="ph"><h2>Settings</h2><p>Everything is saved in this browser.</p></div>
<div class="grp" style="--i:0"><h4>Profile</h4><div class="f"><label>Nickname</label><input id="nick" maxlength="24" placeholder="What should we call you?"></div><small id="ns" style="color:var(--muted)">Shown in your home greeting.</small></div>
<div class="grp" style="--i:1"><h4>Theme</h4><div id="sg"></div></div>
<div class="grp" style="--i:2"><h4>Preferences</h4>${tg('o-h24','24-hour clock','Use 13:00 instead of 1:00 PM')}${tg('o-secs','Show seconds','Live seconds on the home clock')}${tg('o-fx','Floating effects','Falling emoji and decorations')}</div>
<div class="grp" style="--i:3"><h4>Data</h4><button class="btn ghost" id="reset">Reset everything</button></div>`;
$('#nick').value=store.get('nick','');let nt;$('#nick').oninput=e=>{store.set('nick',e.target.value.trim());tick();$('#ns').textContent='Saved ✓';clearTimeout(nt);nt=setTimeout(()=>$('#ns').textContent='Shown in your home greeting.',1500)};
[['o-h24','h24',false],['o-secs','secs',true],['o-fx','fx',true]].forEach(([id,k,d])=>{const e=$('#'+id);e.checked=store.get(k,d);e.onchange=()=>{store.set(k,e.checked);tick();if(k=='fx')paint()}});
$('#reset').onclick=()=>{if(confirm('Reset favorites, nickname, theme and all settings?')){Object.keys(localStorage).filter(k=>k.startsWith('smt.')).forEach(k=>localStorage.removeItem(k));location.hash='home';location.reload()}};
/* ---------- global events ---------- */
document.addEventListener('click',e=>{closeCtx();const T=e.target,hh=T.closest('[data-h]'),th2=T.closest('[data-th]'),g=T.closest('[data-go]'),s=T.closest('#tabs [data-s]'),c=T.closest('.card'),cp=T.closest('[data-c]'),o=T.closest('.out');
if(hh){e.stopPropagation();return toggleFav(hh.dataset.h)}if(th2){const r=th2.getBoundingClientRect();$('#pop').hidden=true;return pick(th2.dataset.th,r.left+r.width/2,r.top+r.height/2)}
if(s)location.hash=s.dataset.s;else if(g)location.hash=byId(g.dataset.go)?'tool/'+g.dataset.go:g.dataset.go;else if(c)location.hash='tool/'+c.dataset.id;
else if(cp){let v=cp.dataset.c;try{const el=v[0]=='#'&&$(v);if(el)v=el.textContent}catch(_){}copy(v)}else if(o&&o.id&&o.textContent.trim())copy(o.textContent);
if(!T.closest('#pop'))$('#pop').hidden=true});
addEventListener('keydown',e=>{const tg=document.activeElement.tagName,typing=/INPUT|TEXTAREA|SELECT/.test(tg);
if(e.key=='Escape'){closeCtx();if(!$('#pop').hidden)$('#pop').hidden=true;else if(at=='tool')location.hash=from}
if(e.key=='Enter'&&tg=='INPUT'&&document.activeElement.type!='checkbox'&&$('#vb').contains(document.activeElement)){const b=$('#vb .btn');b&&b.click()}
if(e.key=='Enter'&&document.activeElement.classList.contains('card'))location.hash='tool/'+document.activeElement.dataset.id;
if(typing||e.ctrlKey||e.metaKey)return;if(e.key=='/'){e.preventDefault();location.hash='tools';setTimeout(()=>$('#q').focus(),350)}if('1234'.includes(e.key)&&e.key)location.hash=TABS[e.key-1][0]});
/* ---------- scroll, spotlight, context menu ---------- */
let rf;const sc=()=>{rf=0;const h=document.documentElement,p=h.scrollTop/Math.max(1,h.scrollHeight-innerHeight),b=$('#totop');$('#prog').style.transform=`scaleX(${p})`;b.style.setProperty('--p',Math.round(p*100));b.classList.toggle('show',h.scrollTop>400);$('.nav').classList.toggle('scrolled',h.scrollTop>10)};
addEventListener('scroll',()=>{closeCtx();rf=rf||requestAnimationFrame(sc)},{passive:true});$('#totop').onclick=()=>scrollTo({top:0,behavior:'smooth'});
addEventListener('resize',()=>closeCtx());if('ResizeObserver' in window)new ResizeObserver(()=>ind(at=='tool'?from:at)).observe($('#tabs'));
document.addEventListener('pointermove',e=>{const t=e.target.closest&&e.target.closest('.tile,.card,.grp');if(t){const r=t.getBoundingClientRect();t.style.setProperty('--mx',e.clientX-r.left+'px');t.style.setProperty('--my',e.clientY-r.top+'px')}},{passive:true});
const ctx=$('#ctx');let acts=[];const closeCtx=()=>{ctx.hidden=true};
function showCtx(x,y,head,items){acts=[];let i=0;ctx.innerHTML=`<div class="ch">${head}</div>`+items.map(it=>{if(it=='-')return'<hr>';if(it.th)return`<div class="th">${it.th}</div>`;acts.push(it.f);return`<button data-i="${acts.length-1}" style="--i:${i++}"><span class="ci">${it.i}</span><span>${it.t}</span>${it.k?`<kbd>${it.k}</kbd>`:''}</button>`}).join('');
ctx.hidden=false;const w=ctx.offsetWidth,h=ctx.offsetHeight,fx=x+w+10>innerWidth,fy=y+h+10>innerHeight;ctx.style.left=Math.max(8,fx?x-w:x)+'px';ctx.style.top=Math.max(8,fy?y-h:y)+'px';ctx.style.setProperty('--ox',fx?'100%':'0');ctx.style.setProperty('--oy',fy?'100%':'0');ctx.style.animation='none';void ctx.offsetWidth;ctx.style.animation=''}
ctx.addEventListener('click',e=>{const b=e.target.closest('[data-i]');if(b)acts[b.dataset.i]()});
document.addEventListener('contextmenu',e=>{const T=e.target;if(T.closest('input,textarea,select'))return;e.preventDefault();const card=T.closest('.card'),out=T.closest('.out'),sel=String(getSelection()).trim(),it=[],fx=store.get('fx',true),pk=store.get('theme','auto');
if(sel)it.push({i:'📋',t:'Copy selection',f:()=>copy(sel)},'-');
if(card){const id=card.dataset.id,t=byId(id),on=fav().includes(id);it.push({i:t.ic,t:'Open '+t.name,f:()=>location.hash='tool/'+id},{i:on?'💔':'♥',t:on?'Remove favorite':'Add to favorites',f:()=>toggleFav(id)},{i:'🔗',t:'Copy link',f:()=>copy(location.href.split('#')[0]+'#tool/'+id)},'-')}
if(out&&out.textContent.trim())it.push({i:'📋',t:'Copy output',f:()=>copy(out.textContent)},'-');
if(at=='tool')it.push({i:'←',t:'Back',k:'Esc',f:()=>location.hash=from},'-');
TABS.forEach(([k,i,n],j)=>it.push({i,t:n,k:String(j+1),f:()=>location.hash=k}));
it.push('-',{th:`<button data-th="auto" title="Auto" class="${pk=='auto'?'act':''}">🗓️</button>`+Object.keys(THEMES).map(k=>`<button data-th="${k}" title="${THEMES[k].n}" class="${pk==k?'act':''}">${THEMES[k].e}</button>`).join('')},'-',{i:'✨',t:fx?'Turn effects off':'Turn effects on',f:()=>{store.set('fx',!fx);$('#o-fx').checked=!fx;paint()}},{i:'⬆️',t:'Scroll to top',f:()=>scrollTo({top:0,behavior:'smooth'})},{i:'🔄',t:'Reload',f:()=>location.reload()});
showCtx(e.clientX,e.clientY,`${th.t.e} Sukis Multi Tools`,it)});
ctx.addEventListener('contextmenu',e=>e.preventDefault());
/* ---------- boot ---------- */
paint();badge();draw();stats();tick();setInterval(tick,1000);route();reveal();sc();setTimeout(()=>ind(at=='tool'?from:at),50);
})();
