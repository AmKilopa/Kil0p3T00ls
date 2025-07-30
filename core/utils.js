export function $n(m,t='info',d=3000,pos='top'){
document.querySelectorAll('.toast-notification').forEach(n=>n.remove());
const n=document.createElement('div');
n.className=`toast-notification toast-${t}`;
const c={success:'#059669',error:'#dc2626',warning:'#d97706',info:'#1a1a1a'};
const b={success:'#10b981',error:'#ef4444',warning:'#f59e0b',info:'#333'};
const i={success:'✓',error:'✕',warning:'⚠',info:'ℹ'};
const positions={
top:{top:'20px',left:'50%',transform:'translateX(-50%) translateY(-100px)'},
bottom:{bottom:'20px',left:'50%',transform:'translateX(-50%) translateY(100px)'},
topRight:{top:'20px',right:'20px',transform:'translateX(100px)'},
bottomRight:{bottom:'20px',right:'20px',transform:'translateX(100px)'}
};
n.style.cssText=`position:fixed;${Object.entries(positions[pos]||positions.top).map(([k,v])=>`${k}:${v}`).join(';')};background:${c[t]||c.info};border:1px solid ${b[t]||b.info};color:white;padding:12px 20px;border-radius:8px;font-size:12px;font-weight:500;z-index:10000;transition:all 0.4s cubic-bezier(0.68,-0.55,0.265,1.55);backdrop-filter:blur(10px);box-shadow:0 8px 32px rgba(0,0,0,0.3);display:flex;align-items:center;gap:8px;max-width:400px;`;
n.innerHTML=`<span style="font-size:14px;">${i[t]||i.info}</span><span>${m}</span>`;
document.body.appendChild(n);
setTimeout(()=>{
const showPos=pos==='top'?{transform:'translateX(-50%) translateY(0)'}:pos==='bottom'?{transform:'translateX(-50%) translateY(0)'}:{transform:'translateX(0)'};
Object.assign(n.style,showPos);
},50);
setTimeout(()=>{
const hidePos=positions[pos]||positions.top;
Object.assign(n.style,hidePos);
setTimeout(()=>n.parentNode&&n.parentNode.removeChild(n),400);
},d);
}

window.showNotification=$n;

export async function $cp(t){
try{
if(navigator.clipboard&&window.isSecureContext){
await navigator.clipboard.writeText(t);
return true;
}else{
const a=document.createElement('textarea');
a.value=t;
a.style.cssText='position:fixed;left:-999999px;top:-999999px;opacity:0;pointer-events:none;';
document.body.appendChild(a);
a.focus();
a.select();
a.setSelectionRange(0,99999);
const s=document.execCommand('copy');
a.remove();
return s;
}
}catch(e){
const a=document.createElement('textarea');
a.value=t;
a.style.cssText='position:fixed;left:-999999px;top:-999999px;opacity:0;pointer-events:none;';
document.body.appendChild(a);
a.focus();
a.select();
try{
const s=document.execCommand('copy');
a.remove();
return s;
}catch{
a.remove();
return false;
}
}}

export async function $paste(){
try{
if(navigator.clipboard&&window.isSecureContext){
return await navigator.clipboard.readText();
}else{
return null;
}
}catch(e){
return null;
}}

export function $dl(d,f,m='text/plain'){
try{
const b=new Blob([d],{type:m});
const u=URL.createObjectURL(b);
const l=document.createElement('a');
l.href=u;
l.download=f;
l.style.display='none';
document.body.appendChild(l);
l.click();
document.body.removeChild(l);
setTimeout(()=>URL.revokeObjectURL(u),100);
return true;
}catch(e){
return false;
}}

export function $rf(accept='*/*'){
return new Promise((resolve,reject)=>{
const i=document.createElement('input');
i.type='file';
i.accept=accept;
i.style.display='none';
i.onchange=e=>{
const f=e.target.files[0];
if(f){
const r=new FileReader();
r.onload=()=>resolve({file:f,content:r.result,name:f.name,size:f.size,type:f.type});
r.onerror=()=>reject(new Error('File read failed'));
r.readAsText(f);
}else{
reject(new Error('No file selected'));
}
};
document.body.appendChild(i);
i.click();
document.body.removeChild(i);
});
}

export function $rfb(accept='*/*'){
return new Promise((resolve,reject)=>{
const i=document.createElement('input');
i.type='file';
i.accept=accept;
i.style.display='none';
i.onchange=e=>{
const f=e.target.files[0];
if(f){
const r=new FileReader();
r.onload=()=>resolve({file:f,content:r.result,name:f.name,size:f.size,type:f.type});
r.onerror=()=>reject(new Error('File read failed'));
r.readAsDataURL(f);
}else{
reject(new Error('No file selected'));
}
};
document.body.appendChild(i);
i.click();
document.body.removeChild(i);
});
}

export function $fs(b){
if(b===0)return '0 Bytes';
const k=1024;
const s=['Bytes','KB','MB','GB','TB'];
const i=Math.floor(Math.log(b)/Math.log(k));
return parseFloat((b/Math.pow(k,i)).toFixed(2))+' '+s[i];
}

export function $dt(d=new Date(),locale='ru-RU'){
return new Intl.DateTimeFormat(locale,{
year:'numeric',month:'2-digit',day:'2-digit',
hour:'2-digit',minute:'2-digit',second:'2-digit'
}).format(d);
}

export function $dtr(d){
const n=new Date();
const diff=n-d;
const s=Math.floor(diff/1000);
const m=Math.floor(s/60);
const h=Math.floor(m/60);
const day=Math.floor(h/24);
if(day>0)return`${day} дн. назад`;
if(h>0)return`${h} ч. назад`;
if(m>0)return`${m} мин. назад`;
return`${s} сек. назад`;
}

export function $db(f,w){
let t;
return function(...a){
clearTimeout(t);
t=setTimeout(()=>f(...a),w);
};
}

export function $th(f,l){
let i;
return function(...a){
if(!i){
f.apply(this,a);
i=true;
setTimeout(()=>i=false,l);
}
};
}

export function $em(e){
return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

export function $url(u){
try{
new URL(u);
return true;
}catch{
return false;
}}

export function $id(l=8){
const c='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
let r='';
for(let i=0;i<l;i++){
r+=c.charAt(Math.floor(Math.random()*c.length));
}
return r;
}

export function $uuid(){
return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,c=>{
const r=Math.random()*16|0;
const v=c==='x'?r:(r&0x3|0x8);
return v.toString(16);
});
}

export function $hash(s,algorithm='simple'){
if(algorithm==='simple'){
let h=0;
for(let i=0;i<s.length;i++){
const c=s.charCodeAt(i);
h=((h<<5)-h)+c;
h=h&h;
}
return Math.abs(h).toString(16);
}
return s;
}

export function $sleep(ms){
return new Promise(resolve=>setTimeout(resolve,ms));
}

export function $sup(f){
const ft={
clipboard:!!navigator.clipboard,
serviceWorker:'serviceWorker' in navigator,
localStorage:(()=>{
try{
const t='test';
localStorage.setItem(t,t);
localStorage.removeItem(t);
return true;
}catch{
return false;
}
})(),
webgl:(()=>{
try{
const c=document.createElement('canvas');
return !!(c.getContext('webgl')||c.getContext('experimental-webgl'));
}catch{
return false;
}
})(),
fullscreen:!!(document.fullscreenEnabled||document.webkitFullscreenEnabled||document.mozFullScreenEnabled),
geolocation:!!navigator.geolocation,
notifications:'Notification' in window,
vibration:!!navigator.vibrate,
camera:!!(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia)
};
return f?ft[f]||false:ft;
}

export function $el(t,a={},c=''){
const e=document.createElement(t);
Object.entries(a).forEach(([k,v])=>{
if(k==='style'&&typeof v==='object'){
Object.assign(e.style,v);
}else if(k==='className'){
e.className=v;
}else if(k==='dataset'&&typeof v==='object'){
Object.entries(v).forEach(([dk,dv])=>e.dataset[dk]=dv);
}else if(k.startsWith('on')&&typeof v==='function'){
e.addEventListener(k.slice(2).toLowerCase(),v);
}else if(k!=='onclick'&&k!=='onload'&&!k.startsWith('on')){
e.setAttribute(k,v);
}
});
if(c)e.innerHTML=c;
return e;
}

export function $an(e,a='fadeIn',duration=300){
const an={
fadeIn:{from:'opacity:0;',to:'opacity:1;'},
slideUp:{from:'transform:translateY(20px);opacity:0;',to:'transform:translateY(0);opacity:1;'},
slideDown:{from:'transform:translateY(-20px);opacity:0;',to:'transform:translateY(0);opacity:1;'},
slideLeft:{from:'transform:translateX(20px);opacity:0;',to:'transform:translateX(0);opacity:1;'},
slideRight:{from:'transform:translateX(-20px);opacity:0;',to:'transform:translateX(0);opacity:1;'},
scaleIn:{from:'transform:scale(0.8);opacity:0;',to:'transform:scale(1);opacity:1;'},
bounceIn:{from:'transform:scale(0.3);opacity:0;',to:'transform:scale(1);opacity:1;'},
rotateIn:{from:'transform:rotate(-180deg);opacity:0;',to:'transform:rotate(0deg);opacity:1;'}
};
const animation=an[a]||an.fadeIn;
e.style.cssText+=`${animation.from}transition:all ${duration}ms cubic-bezier(0.68,-0.55,0.265,1.55);`;
setTimeout(()=>{
e.style.cssText+=animation.to;
},50);
}

export function $vd(data,rules){
const errors=[];
Object.entries(rules).forEach(([field,rule])=>{
const value=data[field];
if(rule.required&&(value===undefined||value===null||value==='')){
errors.push(`${field} is required`);
return;
}
if(value!==undefined&&value!==null&&value!==''){
if(rule.type==='email'&&!$em(value)){
errors.push(`${field} must be a valid email`);
}
if(rule.type==='url'&&!$url(value)){
errors.push(`${field} must be a valid URL`);
}
if(rule.minLength&&value.length<rule.minLength){
errors.push(`${field} must be at least ${rule.minLength} characters`);
}
if(rule.maxLength&&value.length>rule.maxLength){
errors.push(`${field} must be at most ${rule.maxLength} characters`);
}
if(rule.min&&Number(value)<rule.min){
errors.push(`${field} must be at least ${rule.min}`);
}
if(rule.max&&Number(value)>rule.max){
errors.push(`${field} must be at most ${rule.max}`);
}
if(rule.pattern&&!rule.pattern.test(value)){
errors.push(`${field} format is invalid`);
}
}
});
return{valid:errors.length===0,errors};
}

export function $compress(str){
try{
return btoa(unescape(encodeURIComponent(str)));
}catch{
return str;
}}

export function $decompress(str){
try{
return decodeURIComponent(escape(atob(str)));
}catch{
return str;
}}

export function $retry(fn,attempts=3,delay=1000){
return new Promise((resolve,reject)=>{
const attempt=async(n)=>{
try{
const result=await fn();
resolve(result);
}catch(error){
if(n<=1){
reject(error);
}else{
setTimeout(()=>attempt(n-1),delay);
}
}
};
attempt(attempts);
});
}

export function $chunk(array,size){
const chunks=[];
for(let i=0;i<array.length;i+=size){
chunks.push(array.slice(i,i+size));
}
return chunks;
}

export function $unique(array){
return[...new Set(array)];
}

export function $shuffle(array){
const arr=[...array];
for(let i=arr.length-1;i>0;i--){
const j=Math.floor(Math.random()*(i+1));
[arr[i],arr[j]]=[arr[j],arr[i]];
}
return arr;
}

export function $clamp(value,min,max){
return Math.min(Math.max(value,min),max);
}

export function $lerp(start,end,t){
return start+(end-start)*t;
}

export function $rnd(min,max){
return Math.floor(Math.random()*(max-min+1))+min;
}

export const $l={
i:(m,...a)=>{
if(typeof process!=='undefined'&&process.env.NODE_ENV!=='production'){
console.log(`[K] ${m}`,...a);
}
},
w:(m,...a)=>console.warn(`[K] ${m}`,...a),
e:(m,...a)=>console.error(`[K] ${m}`,...a),
t:(label)=>console.time(`[K] ${label}`),
te:(label)=>console.timeEnd(`[K] ${label}`)
};