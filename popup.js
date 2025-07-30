import{$navigation}from'./core/navigation.js';
import{$storage}from'./core/storage.js';
import{$n,$an}from'./core/utils.js';

class $k{
constructor(){
this.$t=[];
window.$toolsRegistry=[];
this.init();
}

async init(){
await this.$lt();
await this.$cu();
this.$rm();
this.$se();
this.$su();
$navigation.$sa();
}

async $lt(){
try{
const{$r}=await import('./config/tools-registry.js');
this.$t=$r||[];
window.$toolsRegistry=this.$t;
}catch(e){
this.$t=[];
}
document.getElementById('toolsCount').textContent=this.$t.length;
}

async $cu(){
try{
const r=await chrome.runtime.sendMessage({action:'get-update-info'});
if(r.success&&r.hasUpdate){
this.$su(r);
}
}catch(e){}}

$su(ui){
const ub=document.getElementById('$unb');
const cv=document.getElementById('$cv');
const lv=document.getElementById('$lv');
const urb=document.getElementById('$urb');
const uxb=document.getElementById('$uxb');
if(cv)cv.textContent=ui.current;
if(lv)lv.textContent=ui.latest;
if(urb){
urb.onclick=()=>{
chrome.tabs.create({url:ui.url});
this.$hu();
};
}
if(uxb){
uxb.onclick=()=>this.$hu();
}
if(ub){
ub.classList.remove('hidden');
$an(ub,'slideDown',300);
}}

async $hu(){
try{
await chrome.runtime.sendMessage({action:'dismiss-update'});
const ub=document.getElementById('$unb');
if(ub){
$an(ub,'slideUp',300);
setTimeout(()=>ub.classList.add('hidden'),300);
}
}catch(e){}}

$rm(){
const c=document.getElementById('toolsContainer');
c.innerHTML='';
this.$rfs();
this.$rrs();
this.$rat();
this.$setupAllEventListeners();
}

$setupAllEventListeners(){
document.querySelectorAll('.tool-card').forEach(card=>{
if(!card.onclick){
const toolId=card.getAttribute('data-tool-id');
const tool=this.$t.find(t=>t.id===toolId);
if(tool){
card.addEventListener('click',()=>this.$ot(tool));
}
}
});

document.querySelectorAll('.favorite-btn').forEach(btn=>{
btn.addEventListener('click',e=>{
e.stopPropagation();
const toolId=btn.getAttribute('data-tool-id');
$navigation.$sf(toolId);
location.reload();
});
});

document.querySelectorAll('.recent-card').forEach(card=>{
const toolId=card.getAttribute('data-tool-id');
const tool=this.$t.find(t=>t.id===toolId);
if(tool){
card.addEventListener('click',()=>this.$ot(tool));
}
});
}

$rfs(){
const favorites=$navigation.$gf();
if(favorites.length===0)return;

const fc=document.createElement('div');
fc.className='section-container';
fc.innerHTML=`<div class="section-header">
<span class="section-icon">⭐</span>
<span class="section-title">Избранное</span>
<span class="section-count">${favorites.length}</span></div>
<div class="favorites-grid" id="favoritesGrid"></div>`;

const fg=fc.querySelector('#favoritesGrid');
favorites.forEach(toolId=>{
const tool=this.$t.find(t=>t.id===toolId);
if(tool){
const ft=this.$ctc(tool,true);
fg.appendChild(ft);
}
});

document.getElementById('toolsContainer').appendChild(fc);
}

$rrs(){
const recents=$navigation.$gr();
if(recents.length===0)return;

const rc=document.createElement('div');
rc.className='section-container';
rc.innerHTML=`<div class="section-header">
<span class="section-icon">🕒</span>
<span class="section-title">Недавние</span>
<span class="section-count">${recents.length}</span></div>
<div class="recents-list" id="recentsList"></div>`;

const rl=rc.querySelector('#recentsList');
recents.forEach(toolId=>{
const tool=this.$t.find(t=>t.id===toolId);
if(tool){
const rt=this.$crc(tool);
rl.appendChild(rt);
}
});

document.getElementById('toolsContainer').appendChild(rc);
}

$rat(){
const ac=document.createElement('div');
ac.className='section-container';
ac.innerHTML=`<div class="section-header">
<span class="section-icon">🛠️</span>
<span class="section-title">Все инструменты</span>
<span class="section-count">${this.$t.length}</span></div>
<div class="all-tools" id="allTools"></div>`;

const at=ac.querySelector('#allTools');
this.$t.forEach((t,i)=>{
const tc=this.$ctc(t,false,i);
at.appendChild(tc);
});

document.getElementById('toolsContainer').appendChild(ac);
}

$ctc(tool,isFavorite=false,index=0){
const tc=document.createElement('div');
tc.className=`tool-card ${isFavorite?'favorite-card':''}`;
tc.setAttribute('data-tool-id',tool.id);

const favoriteIcon=$navigation.$if(tool.id)?'⭐':'☆';
const favoriteClass=$navigation.$if(tool.id)?'favorited':'';

tc.innerHTML=`<div class="tool-header-card">
${!isFavorite?`<div class="tool-number">${String(index+1).padStart(2,'0')}</div>`:''}
<div class="tool-icon">${tool.icon}</div>
<div class="tool-info">
<div class="tool-title">${tool.title}</div>
<div class="tool-description">${tool.description}</div></div>
<div class="tool-actions">
<button class="favorite-btn ${favoriteClass}" data-tool-id="${tool.id}" title="${$navigation.$if(tool.id)?'Удалить из избранного':'Добавить в избранное'}">
${favoriteIcon}
</button>
<div class="tool-status status-${tool.status}">${this.$gst(tool.status)}</div></div></div>`;

if(!isFavorite){
setTimeout(()=>$an(tc,'slideUp',300),index*50);
}

return tc;
}

$crc(tool){
const rc=document.createElement('div');
rc.className='recent-card';
rc.setAttribute('data-tool-id',tool.id);
rc.innerHTML=`<div class="recent-info">
<span class="tool-icon">${tool.icon}</span>
<span class="tool-name">${tool.title}</span>
<span class="recent-time">Недавно</span></div>`;
return rc;
}

$gst(s){
const sm={'ready':'Готов','beta':'Бета','coming-soon':'Скоро'};
return sm[s]||s;
}

async $ot(t){
if(t.status==='coming-soon'){
$n('Этот инструмент пока не готов','warning');
return;
}
this.$sl();
document.getElementById('toolIconHeader').textContent=t.icon;
document.getElementById('toolNameHeader').textContent=t.title;
setTimeout(async()=>{
await this.$ltc(t);
await $navigation.$sv('tool',t,'slideLeft');
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
const errorContainer=document.createElement('div');
errorContainer.className='tool-section';
errorContainer.innerHTML=`<div style="text-align:center;padding:40px 20px;">
<div style="font-size:48px;margin-bottom:20px;">❌</div>
<h2 style="margin-bottom:12px;color:#fff;">Ошибка загрузки</h2>
<p style="color:#888;margin-bottom:20px;">Не удалось загрузить инструмент "${t.title}"</p>
<div style="background:#1a1a1a;border:1px solid #333;border-radius:8px;padding:15px;margin-bottom:20px;">
<p style="color:#ff6b6b;font-size:12px;font-family:monospace;">${e.message}</p></div>
<button class="secondary-button reload-btn">
<span class="button-icon">🔄</span>Перезагрузить</button></div>`;

const reloadBtn=errorContainer.querySelector('.reload-btn');
if(reloadBtn){
reloadBtn.addEventListener('click',()=>location.reload());
}

return errorContainer.outerHTML;
}

$se(){
document.getElementById('backButton').onclick=()=>{
$navigation.$gb();
};

const settings=document.getElementById('settingsBtn');
if(settings){
settings.onclick=()=>this.$ss();
}

const clear=document.getElementById('clearDataBtn');
if(clear){
clear.onclick=()=>this.$cd();
}
}

$su(){
const si=document.getElementById('searchInput');
if(si){
si.addEventListener('input',e=>{
const query=e.target.value.toLowerCase();
this.$ft(query);
});

si.addEventListener('keydown',e=>{
if(e.key==='Escape'){
si.value='';
this.$ft('');
si.blur();
}
});
}
}

$ft(query){
const tools=document.querySelectorAll('.tool-card');
const sections=document.querySelectorAll('.section-container');

if(!query){
tools.forEach(tool=>tool.style.display='block');
sections.forEach(section=>section.style.display='block');
return;
}

let hasVisibleTools=false;
tools.forEach(tool=>{
const title=tool.querySelector('.tool-title')?.textContent.toLowerCase()||'';
const desc=tool.querySelector('.tool-description')?.textContent.toLowerCase()||'';
const visible=title.includes(query)||desc.includes(query);
tool.style.display=visible?'block':'none';
if(visible)hasVisibleTools=true;
});

const allToolsSection=document.querySelector('.section-container:last-child');
if(query&&allToolsSection){
sections.forEach((section,index)=>{
if(index<sections.length-1){
section.style.display='none';
}else{
section.style.display=hasVisibleTools?'block':'none';
}
});
}

if(!hasVisibleTools&&query){
const container=document.getElementById('toolsContainer');
const noResults=document.getElementById('noResults');
if(!noResults){
const nr=document.createElement('div');
nr.id='noResults';
nr.className='no-results';
nr.innerHTML=`<div class="no-results-content">
<div class="no-results-icon">🔍</div>
<div class="no-results-text">Ничего не найдено</div>
<div class="no-results-desc">Попробуйте изменить поисковый запрос</div></div>`;
container.appendChild(nr);
}
}else{
const noResults=document.getElementById('noResults');
if(noResults)noResults.remove();
}
}

async $ss(){
const stats=await $storage.$getStats();
const navStats=$navigation.$getStats();
$n(`Статистика: ${stats.reads} чтений, ${stats.writes} записей, ${navStats.favoritesCount} избранных`,'info');
}

async $cd(){
if(confirm('Очистить все данные расширения?')){
await $storage.$reset();
$navigation.$resetAll();
location.reload();
}
}

$sl(){
document.getElementById('loadingOverlay').classList.remove('hidden');
}

$hl(){
document.getElementById('loadingOverlay').classList.add('hidden');
}
}

new $k();