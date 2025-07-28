export async function init(){
$setup();}
let $dom={};
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
acts:document.getElementById('actions')};
$dom.btn.onclick=$run;$dom.copy.onclick=$copy;
$dom.swap.onclick=$swap;$dom.clr.onclick=$wipe;}

async function $run(){
const txt=$dom.txt.value.trim();
if(!txt)return $msg('Введите текст','warning');
$dom.btn.innerHTML='⏳ Проверяю...';$dom.btn.disabled=true;
try{
const instanceId=Date.now()+':'+Math.random().toString(36);
const res=await fetch(`https://api.languagetool.org/v2/check?c=1&instanceId=${instanceId}&v=standalone`,{
method:'POST',
headers:{'Content-Type':'application/x-www-form-urlencoded'},
body:`text=${encodeURIComponent(txt)}&language=auto&enabledOnly=false&level=picky&enableHiddenRules=true`});
const data=await res.json();
console.log('LanguageTool response:',data);
if(data.matches&&data.matches.length>0){
const fixed=$apply(txt,data.matches);
$show(data.matches,fixed);
}else{
$dom.box.style.display='block';
$dom.box.className='spell-results success';
$dom.head.textContent='Ошибок не найдено';
$dom.num.textContent='✓';
$dom.list.innerHTML='<div style="text-align:center;color:#22c55e;">Текст корректен</div>';}
}catch(e){
console.log('API error:',e);
$msg('Ошибка API','error');}
finally{
$dom.btn.innerHTML='<span class="button-icon">🔍</span>Проверить';
$dom.btn.disabled=false;}}

function $apply(txt,matches){
let out=txt;
matches.sort((a,b)=>b.offset-a.offset);
for(const m of matches){
if(m.replacements&&m.replacements[0]){
out=out.substring(0,m.offset)+m.replacements[0].value+out.substring(m.offset+m.length);}}
return out;}

function $show(matches,fixed){
$dom.box.style.display='block';
$dom.box.className='spell-results error';
$dom.head.textContent='Найдены ошибки:';
$dom.num.textContent=matches.length;
$dom.list.innerHTML=matches.map(m=>{
const word=$dom.txt.value.substring(m.offset,m.offset+m.length);
const sugg=m.replacements?m.replacements.slice(0,3).map(r=>r.value).join(', '):'';
return`<div style="margin:4px 0;padding:4px;background:rgba(0,0,0,0.2);border-radius:3px;">
<span class="error-highlight">${word}</span>
${sugg?' → '+sugg:''}
<div style="font-size:10px;color:#888;margin-top:2px;">${m.message||''}</div>
</div>`;}).join('');
if(fixed!==$dom.txt.value){
$dom.fix.value=fixed;
$dom.out.style.display='block';
$dom.acts.style.display='flex';}}

async function $copy(){
const txt=$dom.fix.value;
if(!txt)return $msg('Нет текста','warning');
try{
await navigator.clipboard.writeText(txt);
$msg('Скопировано','success');}
catch(e){$msg('Ошибка копирования','error');}}

function $swap(){
const txt=$dom.fix.value;
if(!txt)return $msg('Нет текста','warning');
$dom.txt.value=txt;$msg('Заменено','success');$hide();}

function $wipe(){
$dom.txt.value='';$dom.fix.value='';$hide();
$msg('Очищено','info');}

function $hide(){
$dom.box.style.display='none';
$dom.out.style.display='none';
$dom.acts.style.display='none';}

function $msg(txt,type='info'){
if(window.showNotification)window.showNotification(txt,type);
else console.log(`${type.toUpperCase()}: ${txt}`);}