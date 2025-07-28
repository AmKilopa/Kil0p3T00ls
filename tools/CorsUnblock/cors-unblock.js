import{$cc}from'./config.js';
import{$storage}from'../../core/storage.js';
import{$n}from'../../core/utils.js';

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
$a=await $storage.$g(`cors_${$t.id}`,false,'chrome');
}}

async function $ss(){
if($t){
await $storage.$s(`cors_${$t.id}`,$a,'chrome');
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

export{$tc as toggleCors,$ui as updateUI,$gt as getCurrentTab,$ls as loadState,$ss as saveState};