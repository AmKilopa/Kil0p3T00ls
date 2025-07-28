import{$tc}from'./config.js';
import{$storage}from'../../core/storage.js';
import{$n}from'../../core/utils.js';

let $e={};

export async function init(){
$ie();
$se();
await $ls();
$gp();
}

function $ie(){
$e={
ls:document.getElementById('passwordLength'),
lv:document.getElementById('lengthValue'),
gb:document.getElementById('generatePasswordBtn'),
cpb:document.getElementById('copyPasswordBtn'),
pf:document.getElementById('generatedPassword'),
cb:{
u:document.getElementById('includeUppercase'),
lw:document.getElementById('includeLowercase'),
n:document.getElementById('includeNumbers'),
s:document.getElementById('includeSymbols'),
es:document.getElementById('excludeSimilar'),
ea:document.getElementById('excludeAmbiguous')
},
sf:document.getElementById('strengthFill'),
st:document.getElementById('strengthText'),
ev:document.getElementById('entropyValue'),
ct:document.getElementById('crackTimeValue'),
cv:document.getElementById('combinationsValue')
};
}

function $se(){
$e.ls.addEventListener('input',async()=>{
$e.lv.textContent=$e.ls.value;
if($e.pf.value)$gp();
await $ss();
});

Object.values($e.cb).forEach(c=>{
c.addEventListener('change',async()=>{
if($e.pf.value)$gp();
await $ss();
});
});

$e.gb.onclick=$gp;
$e.cpb.onclick=$cpp;
}

function $gp(){
const l=parseInt($e.ls.value);
const o={
l,
u:$e.cb.u.checked,
lw:$e.cb.lw.checked,
n:$e.cb.n.checked,
s:$e.cb.s.checked,
es:$e.cb.es.checked,
ea:$e.cb.ea.checked
};

if(!o.u&&!o.lw&&!o.n&&!o.s){
$e.pf.value='';
$e.st.textContent='Выберите хотя бы один тип символов';
$e.sf.style.width='0%';
$ups({entropy:0,combinations:0,secondsToBreak:0});
return;
}

const p=$cp(o);
$e.pf.value=p;

const a=$ap(p,o);
$ups(a);
$upss(a);
}

function $cp(o){
let cs='';

if(o.u)cs+=$tc.$cs.uppercase;
if(o.lw)cs+=$tc.$cs.lowercase;
if(o.n)cs+=$tc.$cs.numbers;
if(o.s)cs+=$tc.$cs.symbols;

if(o.es){
cs=cs.split('').filter(c=>!$tc.$cs.similar.includes(c)).join('');
}

if(o.ea){
cs=cs.split('').filter(c=>!$tc.$cs.ambiguous.includes(c)).join('');
}

let p='';
for(let i=0;i<o.l;i++){
const ri=Math.floor(Math.random()*cs.length);
p+=cs.charAt(ri);
}

return p;
}

function $ap(p,o){
let css=0;

if(o.u)css+=$tc.$cs.uppercase.length;
if(o.lw)css+=$tc.$cs.lowercase.length;
if(o.n)css+=$tc.$cs.numbers.length;
if(o.s)css+=$tc.$cs.symbols.length;

if(o.es)css-=$tc.$cs.similar.length;
if(o.ea)css-=$tc.$cs.ambiguous.length;

const e=p.length*Math.log2(css);
const cb=Math.pow(css,p.length);
const stb=cb/(2*$tc.$s.$bfs);

return{
entropy:e,
combinations:cb,
secondsToBreak:stb,
strength:$gps(e)
};
}

function $gps(e){
for(const[l,cf]of Object.entries($tc.$s.$el)){
if(e>=cf.min&&e<cf.max){
return{
level:l,
text:cf.text,
color:cf.color
};
}
}
return $tc.$s.$el.veryStrong;
}

function $ups(a){
const{strength}=a;

$e.st.textContent=strength.text;
$e.st.style.color=strength.color;

const pct=Math.min((a.entropy/128)*100,100);
$e.sf.style.width=`${pct}%`;
$e.sf.style.background=strength.color;
}

function $upss(a){
$e.ev.textContent=a.entropy>0?`${Math.round(a.entropy)} бит`:'-';
$e.cv.textContent=a.combinations>0?$fln(a.combinations):'-';
$e.ct.textContent=a.secondsToBreak>0?$ft(a.secondsToBreak):'-';
}

function $fln(n){
if(n<1000)return n.toString();
if(n<1000000)return`${(n/1000).toFixed(1)}K`;
if(n<1000000000)return`${(n/1000000).toFixed(1)}M`;
if(n<1000000000000)return`${(n/1000000000).toFixed(1)}B`;
if(n<1000000000000000)return`${(n/1000000000000).toFixed(1)}T`;
return`${(n/1000000000000000).toFixed(1)}Q`;
}

function $ft(s){
if(s<1)return'Мгновенно';
if(s<60)return`${Math.round(s)} сек`;
if(s<3600)return`${Math.round(s/60)} мин`;
if(s<86400)return`${Math.round(s/3600)} ч`;
if(s<31536000)return`${Math.round(s/86400)} дн`;
if(s<31536000000)return`${Math.round(s/31536000)} лет`;
return'Столетия';
}

async function $cpp(){
const p=$e.pf.value;

if(!p){
$n('Сначала сгенерируйте пароль','warning');
return;
}

try{
if(navigator.clipboard&&window.isSecureContext){
await navigator.clipboard.writeText(p);
$n('Пароль скопирован в буфер обмена','success');
}else{
$e.pf.select();
$e.pf.setSelectionRange(0, 99999);
const successful = document.execCommand('copy');
window.getSelection().removeAllRanges();

if(successful) {
$n('Пароль скопирован в буфер обмена','success');
} else {
throw new Error('Copy command failed');
}
}

}catch(e){
console.error('Copy failed:', e);
$n('Ошибка при копировании пароля','error');
}}

function $go(){
return{
length:parseInt($e.ls.value),
uppercase:$e.cb.u.checked,
lowercase:$e.cb.lw.checked,
numbers:$e.cb.n.checked,
symbols:$e.cb.s.checked,
excludeSimilar:$e.cb.es.checked,
excludeAmbiguous:$e.cb.ea.checked
};
}

function $so(o){
$e.ls.value=o.length||12;
$e.lv.textContent=$e.ls.value;

$e.cb.u.checked=o.uppercase??true;
$e.cb.lw.checked=o.lowercase??true;
$e.cb.n.checked=o.numbers??true;
$e.cb.s.checked=o.symbols??true;
$e.cb.es.checked=o.excludeSimilar??false;
$e.cb.ea.checked=o.excludeAmbiguous??false;
}

async function $ss(){
await $storage.$ss('password-generator',$go());
}

async function $ls(){
const s=await $storage.$gs('password-generator',$tc.$d);
$so(s);
}

export{$gp as generatePassword,$cpp as copyPassword,$go as getPasswordOptions,$so as setPasswordOptions,$ap as analyzePassword,$cp as createPassword};