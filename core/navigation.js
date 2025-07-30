import{$an,$l}from'./utils.js';

class $nav{
constructor(){
this.$cv='menu';
this.$ct=null;
this.$h=[];
this.$animating=false;
this.$favorites=new Set();
this.$recents=[];
this.$searchQuery='';
this.$maxHistory=10;
this.$maxRecents=5;
this.$transitions={
slideLeft:{out:'translateX(-100%)',in:'translateX(100%)',to:'translateX(0)'},
slideRight:{out:'translateX(100%)',in:'translateX(-100%)',to:'translateX(0)'},
fade:{out:'opacity:0',in:'opacity:0',to:'opacity:1'},
scale:{out:'transform:scale(0.95);opacity:0',in:'transform:scale(1.05);opacity:0',to:'transform:scale(1);opacity:1'}
};
this.$currentTransition='slideLeft';
this.$init();
}

$init(){
this.$lf();
this.$lr();
this.$setupSearch();
}

async $sv(vn,d=null,transition=null){
if(this.$animating)return;
if(this.$cv!==vn){
this.$h.push({view:this.$cv,data:this.$ct,timestamp:Date.now()});
if(this.$h.length>this.$maxHistory){
this.$h.shift();
}
}

this.$animating=true;
const t=transition||this.$currentTransition;
await this.$ta(vn,t);

const mv=document.getElementById('menuView');
const tv=document.getElementById('toolView');

mv.classList.toggle('hidden',vn!=='menu');
tv.classList.toggle('hidden',vn!=='tool');

this.$cv=vn;
this.$ct=d;

if(vn==='tool'&&d){
this.$ar(d.id);
}

this.$ub();
this.$animating=false;
$l.i(`Navigated to ${vn}`,d);
}

async $ta(vn,transition){
const views=document.querySelectorAll('.view:not(.hidden)');
const t=this.$transitions[transition]||this.$transitions.slideLeft;

views.forEach(view=>{
view.style.cssText+=`transition:all 0.3s cubic-bezier(0.4,0,0.2,1);${t.out};`;
});

await new Promise(resolve=>setTimeout(resolve,150));

const targetView=document.getElementById(vn==='menu'?'menuView':'toolView');
if(targetView){
targetView.style.cssText+=`${t.in};`;
await new Promise(resolve=>setTimeout(resolve,50));
targetView.style.cssText+=`${t.to};`;
}

await new Promise(resolve=>setTimeout(resolve,200));
views.forEach(view=>{
view.style.cssText=view.style.cssText.replace(/transition:[^;]+;?/g,'').replace(/transform:[^;]+;?/g,'').replace(/opacity:[^;]+;?/g,'');
});
}

$gb(){
if(this.$h.length>0){
const p=this.$h.pop();
this.$sv(p.view,p.data,'slideRight');
}else{
this.$sv('menu',null,'slideRight');
}
}

$gc(){
return this.$cv;
}

$gct(){
return this.$ct;
}

$ch(){
this.$h=[];
this.$ct=null;
}

$sf(toolId){
if(this.$favorites.has(toolId)){
this.$favorites.delete(toolId);
}else{
this.$favorites.add(toolId);
}
this.$ssf();
this.$uf();
$l.i(`Tool ${toolId} ${this.$favorites.has(toolId)?'added to':'removed from'} favorites`);
}

$if(toolId){
return this.$favorites.has(toolId);
}

$gf(){
return[...this.$favorites];
}

$ar(toolId){
this.$recents=this.$recents.filter(id=>id!==toolId);
this.$recents.unshift(toolId);
if(this.$recents.length>this.$maxRecents){
this.$recents.pop();
}
this.$ssr();
this.$ur();
}

$gr(){
return this.$recents;
}

$setSearch(query){
this.$searchQuery=query.toLowerCase();
this.$ft();
}

$gs(){
return this.$searchQuery;
}

$ft(){
const tools=document.querySelectorAll('.tool-card');
tools.forEach(tool=>{
const title=tool.querySelector('.tool-title')?.textContent.toLowerCase()||'';
const desc=tool.querySelector('.tool-description')?.textContent.toLowerCase()||'';
const visible=!this.$searchQuery||title.includes(this.$searchQuery)||desc.includes(this.$searchQuery);
tool.style.display=visible?'block':'none';
if(visible){
$an(tool,'fadeIn',200);
}
});
}

$st(transition){
if(this.$transitions[transition]){
this.$currentTransition=transition;
$l.i(`Transition set to ${transition}`);
}
}

$ub(){
const bc=document.getElementById('breadcrumbs');
if(!bc)return;

let crumbs=[];
if(this.$cv==='menu'){
crumbs.push({name:'Главная',action:()=>this.$sv('menu')});
}else if(this.$cv==='tool'&&this.$ct){
crumbs.push({name:'Главная',action:()=>this.$sv('menu')});
crumbs.push({name:this.$ct.title,action:null});
}

bc.innerHTML=crumbs.map((crumb,i)=>
`<span class="breadcrumb-item ${i===crumbs.length-1?'active':''}" data-action="${crumb.action?'home':''}">
${crumb.name}
</span>`
).join('<span class="breadcrumb-separator">›</span>');

bc.querySelectorAll('.breadcrumb-item[data-action="home"]').forEach(item=>{
item.style.cursor='pointer';
item.addEventListener('click',()=>this.$sv('menu'));
});
}

$uf(){
const fc=document.getElementById('favoritesContainer');
if(!fc)return;

const favorites=this.$gf();
if(favorites.length===0){
fc.style.display='none';
return;
}

fc.style.display='block';
fc.innerHTML=favorites.map(toolId=>{
const tool=this.$gt(toolId);
return tool?`<div class="favorite-tool" data-tool="${toolId}">
<span class="tool-icon">${tool.icon}</span>
<span class="tool-name">${tool.title}</span>
<button class="remove-favorite" data-tool-id="${toolId}">×</button>
</div>`:'';
}).join('');

fc.querySelectorAll('.remove-favorite').forEach(btn=>{
btn.addEventListener('click',()=>{
const toolId=btn.getAttribute('data-tool-id');
this.$sf(toolId);
});
});
}

$ur(){
const rc=document.getElementById('recentsContainer');
if(!rc)return;

const recents=this.$gr();
if(recents.length===0){
rc.style.display='none';
return;
}

rc.style.display='block';
rc.innerHTML=recents.map(toolId=>{
const tool=this.$gt(toolId);
return tool?`<div class="recent-tool" data-tool="${toolId}">
<span class="tool-icon">${tool.icon}</span>
<span class="tool-name">${tool.title}</span>
<span class="recent-time">${this.$grt(toolId)}</span>
</div>`:'';
}).join('');
}

$gt(toolId){
return window.$toolsRegistry?.find(t=>t.id===toolId)||null;
}

$grt(toolId){
const index=this.$recents.indexOf(toolId);
if(index===-1)return'';
const times=['Только что','Недавно','Ранее','Давно','Очень давно'];
return times[Math.min(index,times.length-1)];
}

$setupSearch(){
const si=document.getElementById('searchInput');
if(si){
si.addEventListener('input',e=>this.$setSearch(e.target.value));
si.addEventListener('keydown',e=>{
if(e.key==='Escape'){
si.value='';
this.$setSearch('');
si.blur();
}
});
}
}

$ghs(){
return this.$h.map(h=>({
view:h.view,
data:h.data,
timestamp:h.timestamp,
ago:Date.now()-h.timestamp
}));
}

$ch(){
this.$h=[];
this.$ssn();
}

$ssf(){
try{
localStorage.setItem('k_favorites',JSON.stringify([...this.$favorites]));
}catch(e){
$l.e('Failed to save favorites',e);
}
}

$lf(){
try{
const saved=localStorage.getItem('k_favorites');
if(saved){
this.$favorites=new Set(JSON.parse(saved));
}
}catch(e){
$l.e('Failed to load favorites',e);
}
}

$ssr(){
try{
localStorage.setItem('k_recents',JSON.stringify(this.$recents));
}catch(e){
$l.e('Failed to save recents',e);
}
}

$lr(){
try{
const saved=localStorage.getItem('k_recents');
if(saved){
this.$recents=JSON.parse(saved);
}
}catch(e){
$l.e('Failed to load recents',e);
}
}

$ssn(){
try{
localStorage.setItem('k_nav_history',JSON.stringify(this.$h));
}catch(e){
$l.e('Failed to save navigation history',e);
}
}

$sa(){
document.addEventListener('keydown',e=>{
if(e.altKey&&e.key==='ArrowLeft'){
e.preventDefault();
this.$gb();
}
if(e.altKey&&e.key==='ArrowRight'){
e.preventDefault();
}
if(e.ctrlKey&&e.key==='f'){
e.preventDefault();
const si=document.getElementById('searchInput');
if(si){
si.focus();
si.select();
}
}
if(e.key==='Escape'&&this.$cv==='tool'){
e.preventDefault();
this.$gb();
}
});
}

$resetAll(){
this.$ch();
this.$favorites.clear();
this.$recents=[];
this.$searchQuery='';
this.$ssf();
this.$ssr();
this.$ssn();
this.$uf();
this.$ur();
$l.i('Navigation data reset');
}

$getStats(){
return{
currentView:this.$cv,
historyLength:this.$h.length,
favoritesCount:this.$favorites.size,
recentsCount:this.$recents.length,
isAnimating:this.$animating,
currentTransition:this.$currentTransition
};
}
}

export const $navigation=new $nav();