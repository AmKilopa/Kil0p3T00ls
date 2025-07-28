import{$corsConfig}from'./config.js';
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

const status=$a?$corsConfig.$status.active:$corsConfig.$status.inactive;

i.className=`status-indicator ${status.indicator}`;
s.textContent=status.text;
ic.textContent=status.icon;
tx.textContent=status.buttonText;
b.style.background=status.buttonStyle;
si.textContent=status.info;
ar.textContent=status.rules;
}

async function $tc(){
if(!$t){
$n($corsConfig.$messages.tabError,'error');
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
$n($a?$corsConfig.$messages.enabled:$corsConfig.$messages.disabled,'success');
}catch(e){
$n($corsConfig.$messages.error,'error');
$a=!$a;
}}

function $se(){
const b=document.getElementById('corsToggleBtn');
if(b)b.onclick=$tc;
}

export{$tc as toggleCors,$ui as updateUI,$gt as getCurrentTab,$ls as loadState,$ss as saveState};