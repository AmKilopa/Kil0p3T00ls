import{$cc}from'./config.js';

let $a=false,$t=null;

export async function init(){
await $gt();
await $ls();
$se();
$ui();
}

async function $gt(){
try{
const[t]=await chrome.tabs.query({active:true,currentWindow:true});
$t=t;
if($t&&$t.url){
const u=new URL($t.url);
document.getElementById('currentDomain').textContent=u.hostname;
document.getElementById('tabInfo').textContent=u.hostname;
}
}catch(e){
document.getElementById('currentDomain').textContent='Недоступно';
document.getElementById('tabInfo').textContent='Недоступно';
}}

async function $ls(){
if($t){
try{
const r=await chrome.storage.local.get([`cors_${$t.id}`]);
$a=r[`cors_${$t.id}`]||false;
}catch(e){
$a=false;
}
}}

async function $ss(){
if($t){
try{
await chrome.storage.local.set({[`cors_${$t.id}`]:$a});
}catch(e){}
}}

function $ui(){
const i=document.getElementById('corsStatusIndicator');
const s=document.getElementById('corsStatusText');
const b=document.getElementById('corsToggleBtn');
const ic=document.getElementById('corsToggleIcon');
const tx=document.getElementById('corsToggleText');
const si=document.getElementById('corsStatusInfo');
const ar=document.getElementById('activeRules');

if($a){
i.className='status-indicator active';
s.textContent='CORS отключён';
ic.textContent='🔓';
tx.textContent='Включить CORS';
b.style.background='linear-gradient(135deg, #dc2626, #991b1b)';
si.textContent='Отключён';
ar.textContent='1';
}else{
i.className='status-indicator inactive';
s.textContent='CORS защита активна';
ic.textContent='🛡️';
tx.textContent='Отключить CORS';
b.style.background='linear-gradient(135deg, #2a2a2a, #1a1a1a)';
si.textContent='Защищён';
ar.textContent='0';
}}

async function $tc(){
if(!$t){
$n('Не удалось получить информацию о вкладке','error');
return;
}
$a=!$a;
try{
await $ss();
await chrome.runtime.sendMessage({
action:$a?'enable-cors':'disable-cors',
tabId:$t.id
});
$ui();
$n($a?'CORS отключён для этой вкладки':'CORS защита восстановлена','success');
}catch(e){
$n('Ошибка при изменении настроек CORS','error');
$a=!$a;
}}

function $se(){
const b=document.getElementById('corsToggleBtn');
if(b)b.onclick=$tc;
}

function $n(m,t='info'){
if(window.showNotification){
window.showNotification(m,t);
}else{
console.log(`[${t.toUpperCase()}] ${m}`);
}}

export{$tc as toggleCors,$ui as updateUI,$gt as getCurrentTab,$ls as loadState,$ss as saveState};