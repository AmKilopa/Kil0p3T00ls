export function $n(m,t='info',d=3000){
document.querySelectorAll('.toast-notification').forEach(n=>n.remove());
const n=document.createElement('div');
n.className=`toast-notification toast-${t}`;
const c={success:'#059669',error:'#dc2626',warning:'#d97706',info:'#1a1a1a'};
const b={success:'#10b981',error:'#ef4444',warning:'#f59e0b',info:'#333'};
n.style.cssText=`position:fixed;top:20px;left:50%;transform:translateX(-50%) translateY(-100px);background:${c[t]||c.info};border:1px solid ${b[t]||b.info};color:white;padding:12px 20px;border-radius:8px;font-size:12px;font-weight:500;z-index:10000;transition:all 0.3s ease;backdrop-filter:blur(10px);box-shadow:0 4px 20px rgba(0,0,0,0.3);`;
n.textContent=m;
document.body.appendChild(n);
setTimeout(()=>n.style.transform='translateX(-50%) translateY(0)',100);
setTimeout(()=>{
n.style.transform='translateX(-50%) translateY(-100px)';
setTimeout(()=>n.parentNode&&n.parentNode.removeChild(n),300);
},d);
}

export async function $cp(t){
try{
if(navigator.clipboard&&window.isSecureContext){
await navigator.clipboard.writeText(t);
return true;
}else{
const a=document.createElement('textarea');
a.value=t;
a.style.cssText='position:fixed;left:-999999px;top:-999999px;';
document.body.appendChild(a);
a.focus();
a.select();
const s=document.execCommand('copy');
a.remove();
return s;
}
}catch(e){
return false;
}}

export function $dl(d,f,m='text/plain'){
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
}

export function $fs(b){
if(b===0)return '0 Bytes';
const k=1024;
const s=['Bytes','KB','MB','GB'];
const i=Math.floor(Math.log(b)/Math.log(k));
return parseFloat((b/Math.pow(k,i)).toFixed(2))+' '+s[i];
}

export function $dt(d){
return new Intl.DateTimeFormat('ru-RU',{
year:'numeric',month:'2-digit',day:'2-digit',
hour:'2-digit',minute:'2-digit',second:'2-digit'
}).format(d);
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
})()
};
return ft[f]||false;
}

export function $el(t,a={},c=''){
const e=document.createElement(t);
Object.entries(a).forEach(([k,v])=>{
if(k==='style'&&typeof v==='object'){
Object.assign(e.style,v);
}else if(k==='className'){
e.className=v;
}else{
e.setAttribute(k,v);
}
});
if(c)e.innerHTML=c;
return e;
}

export function $an(e,a='fadeIn'){
const an={
fadeIn:'opacity:0;transition:opacity 0.3s ease;',
slideUp:'transform:translateY(20px);opacity:0;transition:all 0.3s ease;',
slideDown:'transform:translateY(-20px);opacity:0;transition:all 0.3s ease;',
scaleIn:'transform:scale(0.8);opacity:0;transition:all 0.3s ease;'
};
const fs={
fadeIn:'opacity:1;',
slideUp:'transform:translateY(0);opacity:1;',
slideDown:'transform:translateY(0);opacity:1;',
scaleIn:'transform:scale(1);opacity:1;'
};
e.style.cssText+=an[a]||an.fadeIn;
setTimeout(()=>e.style.cssText+=fs[a]||fs.fadeIn,50);
}

export const $l={
i:(m,...a)=>{
if(typeof process!=='undefined'&&process.env.NODE_ENV!=='production'){
console.log(`[K] ${m}`,...a);
}
},
w:(m,...a)=>console.warn(`[K] ${m}`,...a),
e:(m,...a)=>console.error(`[K] ${m}`,...a)
};