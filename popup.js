class $k{
constructor(){
this.$cv='menu';
this.$ct=null;
this.$t=[];
this.init();
}

async init(){
await this.$lt();
this.$rm();
this.$se();
}

async $lt(){
try{
const{$r}=await import('./config/tools-registry.js');
this.$t=$r||[];
}catch(e){
this.$t=[];
}
document.getElementById('toolsCount').textContent=this.$t.length;
}

$rm(){
const c=document.getElementById('toolsContainer');
c.innerHTML='';
this.$t.forEach((t,i)=>{
const tc=document.createElement('div');
tc.className='tool-card';
tc.onclick=()=>this.$ot(t);
tc.innerHTML=`<div class="tool-header-card">
<div class="tool-number">${String(i+1).padStart(2,'0')}</div>
<div class="tool-icon">${t.icon}</div>
<div class="tool-info">
<div class="tool-title">${t.title}</div>
<div class="tool-description">${t.description}</div></div>
<div class="tool-status status-${t.status}">${this.$gst(t.status)}</div></div>`;
c.appendChild(tc);
});
}

$gst(s){
const sm={'ready':'Готов','beta':'Бета','coming-soon':'Скоро'};
return sm[s]||s;
}

async $ot(t){
if(t.status==='coming-soon'){
this.$sn('Этот инструмент пока не готов');
return;
}
this.$sl();
this.$ct=t;
document.getElementById('toolIconHeader').textContent=t.icon;
document.getElementById('toolNameHeader').textContent=t.title;
setTimeout(async()=>{
await this.$ltc(t);
this.$sv('tool');
this.$hl();
},300);
}

async $ltc(t){
const c=document.getElementById('toolContent');
try{
this.$rtc();
await this.$ltcs(t);
const hr=`./tools/${t.folder}/${t.id}.html`;
const r=await fetch(hr);
if(!r.ok)throw new Error(`Failed to load ${hr}: ${r.status}`);
const hc=await r.text();
c.innerHTML=hc;
const jm=await import(`./tools/${t.folder}/${t.id}.js`);
if(jm.init){
await jm.init();
}
}catch(e){
c.innerHTML=this.$gec(t,e);
}}

$rtc(){
const ets=document.querySelectorAll('link[data-tool-css]');
ets.forEach(l=>l.remove());
}

async $ltcs(t){
const cu=`./tools/${t.folder}/${t.id}.css`;
return new Promise(r=>{
const l=document.createElement('link');
l.rel='stylesheet';
l.type='text/css';
l.href=cu;
l.setAttribute('data-tool-css',t.id);
l.onload=()=>r();
l.onerror=()=>r();
document.head.appendChild(l);
});
}

$gec(t,e){
return`<div class="tool-section"><div style="text-align:center;padding:40px 20px;">
<div style="font-size:48px;margin-bottom:20px;">❌</div>
<h2 style="margin-bottom:12px;color:#fff;">Ошибка загрузки</h2>
<p style="color:#888;margin-bottom:20px;">Не удалось загрузить инструмент "${t.title}"</p>
<div style="background:#1a1a1a;border:1px solid #333;border-radius:8px;padding:15px;margin-bottom:20px;">
<p style="color:#ff6b6b;font-size:12px;font-family:monospace;">${e.message}</p></div>
<button class="secondary-button" onclick="location.reload()">
<span class="button-icon">🔄</span>Перезагрузить</button></div></div>`;
}

$sv(vn){
document.getElementById('menuView').classList.toggle('hidden',vn!=='menu');
document.getElementById('toolView').classList.toggle('hidden',vn!=='tool');
this.$cv=vn;
}

$se(){
document.getElementById('backButton').onclick=()=>{
this.$sv('menu');
this.$ct=null;
};
}

$sl(){
document.getElementById('loadingOverlay').classList.remove('hidden');
}

$hl(){
document.getElementById('loadingOverlay').classList.add('hidden');
}

$sn(m,t='info'){
const n=document.getElementById('notification');
const nt=document.getElementById('notificationText');
nt.textContent=m;
n.className=`notification show notification-${t}`;
setTimeout(()=>{
n.classList.remove('show');
setTimeout(()=>n.classList.add('hidden'),300);
},2500);
}}

new $k();