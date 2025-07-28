class $st{
constructor(){
this.$p='k_';
}

async $s(k,v,t='local'){
const fk=this.$p+k;
try{
if(t==='chrome'&&typeof chrome!=='undefined'&&chrome.storage){
await chrome.storage.local.set({[fk]:v});
}else{
localStorage.setItem(fk,JSON.stringify(v));
}
return true;
}catch(e){
return false;
}
}

async $g(k,d=null,t='local'){
const fk=this.$p+k;
try{
if(t==='chrome'&&typeof chrome!=='undefined'&&chrome.storage){
const r=await chrome.storage.local.get(fk);
return r[fk]!==undefined?r[fk]:d;
}else{
const v=localStorage.getItem(fk);
return v?JSON.parse(v):d;
}
}catch(e){
return d;
}
}

async $r(k,t='local'){
const fk=this.$p+k;
try{
if(t==='chrome'&&typeof chrome!=='undefined'&&chrome.storage){
await chrome.storage.local.remove(fk);
}else{
localStorage.removeItem(fk);
}
return true;
}catch(e){
return false;
}
}

async $c(t='local'){
try{
if(t==='chrome'&&typeof chrome!=='undefined'&&chrome.storage){
const a=await chrome.storage.local.get();
const k=Object.keys(a).filter(k=>k.startsWith(this.$p));
await chrome.storage.local.remove(k);
}else{
const k=Object.keys(localStorage).filter(k=>k.startsWith(this.$p));
k.forEach(k=>localStorage.removeItem(k));
}
return true;
}catch(e){
return false;
}
}

async $ga(t='local'){
try{
if(t==='chrome'&&typeof chrome!=='undefined'&&chrome.storage){
const a=await chrome.storage.local.get();
const r={};
Object.keys(a).forEach(k=>{
if(k.startsWith(this.$p)){
r[k.substring(this.$p.length)]=a[k];
}
});
return r;
}else{
const r={};
Object.keys(localStorage).forEach(k=>{
if(k.startsWith(this.$p)){
try{
r[k.substring(this.$p.length)]=JSON.parse(localStorage.getItem(k));
}catch(e){}
}
});
return r;
}
}catch(e){
return{};
}
}

async $ss(tid,o){
await this.$s(`tool_${tid}`,o,'chrome');
}

async $gs(tid,d={}){
return await this.$g(`tool_${tid}`,d,'chrome');
}
}

export const $storage=new $st();