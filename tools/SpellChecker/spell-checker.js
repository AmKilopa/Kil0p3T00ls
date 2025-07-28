import{$spellConfig}from'./config.js';
import{$storage}from'../../core/storage.js';
import{$n}from'../../core/utils.js';

let $dom={};

export async function init(){
$setup();
await $ls();
}

function $setup(){
$dom={
txt:document.getElementById('originalText'),
fix:document.getElementById('correctedText'),
btn:document.getElementById('checkBtn'),
copy:document.getElementById('copyBtn'),
swap:document.getElementById('replaceBtn'),
clr:document.getElementById('clearBtn'),
box:document.getElementById('results'),
list:document.getElementById('errorsList'),
num:document.getElementById('errorCount'),
head:document.getElementById('resultTitle'),
out:document.getElementById('correctedSection'),
acts:document.getElementById('actions')
};

$dom.btn.onclick=$run;
$dom.copy.onclick=$copy;
$dom.swap.onclick=$swap;
$dom.clr.onclick=$wipe;
$dom.txt.addEventListener('input',$ss);
}

async function $run(){
const txt=$dom.txt.value.trim();
if(!txt)return $n($spellConfig.$messages.noText,'warning');

if(txt.length>$spellConfig.$ui.maxTextLength){
$n(`Текст слишком длинный (максимум ${$spellConfig.$ui.maxTextLength} символов)`,'warning');
return;
}

$dom.btn.innerHTML='⏳ '+$spellConfig.$messages.checking;
$dom.btn.disabled=true;

try{
const instanceId=Date.now()+':'+Math.random().toString(36);
const params=new URLSearchParams({
text:txt,
language:$spellConfig.$api.language,
enabledOnly:$spellConfig.$api.settings.enabledOnly,
level:$spellConfig.$api.settings.level,
enableHiddenRules:$spellConfig.$api.settings.enableHiddenRules,
c:1,
instanceId,
v:'standalone'
});

const controller=new AbortController();
const timeoutId=setTimeout(()=>controller.abort(),$spellConfig.$api.timeout);

const res=await fetch($spellConfig.$api.baseUrl,{
method:'POST',
headers:{'Content-Type':'application/x-www-form-urlencoded'},
body:params.toString(),
signal:controller.signal
});

clearTimeout(timeoutId);

if(!res.ok)throw new Error(`HTTP ${res.status}`);

const data=await res.json();

if(data.matches&&data.matches.length>0){
const fixed=$apply(txt,data.matches);
$show(data.matches,fixed);
$n(`${$spellConfig.$messages.errorsFound} ${data.matches.length}`,'info');
}else{
$dom.box.style.display='block';
$dom.box.className='spell-results success';
$dom.head.textContent=$spellConfig.$messages.noErrors;
$dom.num.textContent='✓';
$dom.list.innerHTML='<div style="text-align:center;color:#22c55e;">Текст корректен</div>';
$n($spellConfig.$messages.noErrors,'success');
}
}catch(e){
console.error('API error:',e);
if(e.name==='AbortError'){
$n('Превышено время ожидания','error');
}else{
$n($spellConfig.$messages.apiError,'error');
}
}finally{
$dom.btn.innerHTML='<span class="button-icon">🔍</span>Проверить';
$dom.btn.disabled=false;
}
}

function $apply(txt,matches){
let out=txt;
matches.sort((a,b)=>b.offset-a.offset);
for(const m of matches){
if(m.replacements&&m.replacements[0]){
out=out.substring(0,m.offset)+m.replacements[0].value+out.substring(m.offset+m.length);
}
}
return out;
}

function $show(matches,fixed){
$dom.box.style.display='block';
$dom.box.className='spell-results error';
$dom.head.textContent=$spellConfig.$messages.errorsFound;
$dom.num.textContent=matches.length;

$dom.list.innerHTML=matches.map(m=>{
const word=$dom.txt.value.substring(m.offset,m.offset+m.length);
const sugg=m.replacements?m.replacements.slice(0,$spellConfig.$ui.maxSuggestions).map(r=>r.value).join(', '):'';
return`<div style="margin:4px 0;padding:4px;background:rgba(0,0,0,0.2);border-radius:3px;">
<span class="error-highlight">${word}</span>
${sugg?' → '+sugg:''}
<div style="font-size:10px;color:#888;margin-top:2px;">${m.message||''}</div>
</div>`;
}).join('');

if(fixed!==$dom.txt.value){
$dom.fix.value=fixed;
$dom.out.style.display='block';
$dom.acts.style.display='flex';
}
}

async function $copy(){
const txt=$dom.fix.value;
if(!txt)return $n($spellConfig.$messages.noTextToCopy,'warning');

try{
if(navigator.clipboard&&window.isSecureContext){
await navigator.clipboard.writeText(txt);
$n($spellConfig.$messages.copied,'success');
}else{
$dom.fix.select();
document.execCommand('copy');
$n($spellConfig.$messages.copied,'success');
}
}catch(e){
$n($spellConfig.$messages.copyError,'error');
}
}

function $swap(){
const txt=$dom.fix.value;
if(!txt)return $n($spellConfig.$messages.noCorrected,'warning');

$dom.txt.value=txt;
$n($spellConfig.$messages.replaced,'success');
$hide();
$ss();
}

function $wipe(){
$dom.txt.value='';
$dom.fix.value='';
$hide();
$n($spellConfig.$messages.cleared,'info');
$ss();
}

function $hide(){
$dom.box.style.display='none';
$dom.out.style.display='none';
$dom.acts.style.display='none';
}

async function $ss(){
await $storage.$ss('spell-checker',{
text:$dom.txt.value
});
}

async function $ls(){
const s=await $storage.$gs('spell-checker',{text:''});
if(s.text)$dom.txt.value=s.text;
}

export{$run as checkSpelling,$copy as copyText,$swap as replaceText,$wipe as clearText};