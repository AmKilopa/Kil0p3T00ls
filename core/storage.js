import{$compress,$decompress,$l}from'./utils.js';

class $st{
constructor(){
this.$p='k_';
this.$compress=true;
this.$maxAge=30*24*60*60*1000;
this.$maxSize=5*1024*1024;
this.$cleanupInterval=60*60*1000;
this.$stats={reads:0,writes:0,deletes:0,errors:0,compressionSaved:0};
this.$cache=new Map();
this.$cacheMaxSize=100;
this.$cacheMaxAge=5*60*1000;
this.$init();
}

$init(){
this.$initTime=Date.now();
this.$setupCleanup();
this.$loadStats();
}

$setupCleanup(){
setInterval(()=>{
this.$cleanup();
this.$cleanCache();
},this.$cleanupInterval);
}

async $s(k,v,t='local',options={}){
const fk=this.$p+k;
const compress=options.compress??this.$compress;
const ttl=options.ttl||this.$maxAge;

try{
this.$stats.writes++;

const data={
value:v,
timestamp:Date.now(),
ttl:ttl,
compressed:compress
};

let serialized=JSON.stringify(data);
const originalSize=serialized.length;

if(compress&&originalSize>1000){
const compressed=$compress(serialized);
if(compressed.length<originalSize*0.8){
serialized=compressed;
data.compressed=true;
this.$stats.compressionSaved+=originalSize-compressed.length;
}else{
data.compressed=false;
}
}

if(t==='chrome'&&typeof chrome!=='undefined'&&chrome.storage){
await chrome.storage.local.set({[fk]:serialized});
}else{
if(this.$getStorageSize()>this.$maxSize){
await this.$cleanup();
}
localStorage.setItem(fk,serialized);
}

this.$cache.set(fk,{data:v,timestamp:Date.now()});
this.$cleanCache();
this.$saveStats();
return true;

}catch(e){
this.$stats.errors++;
$l.e('Storage write failed',{key:k,error:e.message});
return false;
}
}

async $g(k,d=null,t='local'){
const fk=this.$p+k;

try{
this.$stats.reads++;

const cached=this.$cache.get(fk);
if(cached&&Date.now()-cached.timestamp<this.$cacheMaxAge){
return cached.data;
}

let raw;
if(t==='chrome'&&typeof chrome!=='undefined'&&chrome.storage){
const result=await chrome.storage.local.get(fk);
raw=result[fk];
}else{
raw=localStorage.getItem(fk);
}

if(!raw||raw===null||raw==='undefined')return d;

let data;
try{
if(typeof raw==='string'&&raw.startsWith('{')){
data=JSON.parse(raw);
}else if(typeof raw==='string'&&raw.length>100){
const decompressed=$decompress(raw);
if(decompressed&&decompressed!==raw){
data=JSON.parse(decompressed);
}else{
data=JSON.parse(raw);
}
}else{
return d;
}
}catch(parseError){
$l.w('Storage parse failed',{key:k,rawLength:raw?.length,error:parseError.message});
return d;
}

if(data&&typeof data==='object'&&data.timestamp&&data.ttl){
if(Date.now()-data.timestamp>data.ttl){
await this.$r(k,t);
return d;
}
}

const value=data?.value!==undefined?data.value:data;
this.$cache.set(fk,{data:value,timestamp:Date.now()});
this.$cleanCache();
return value;

}catch(e){
this.$stats.errors++;
$l.w('Storage read failed',{key:k,error:e.message});
return d;
}
}

async $r(k,t='local'){
const fk=this.$p+k;
try{
this.$stats.deletes++;
if(t==='chrome'&&typeof chrome!=='undefined'&&chrome.storage){
await chrome.storage.local.remove(fk);
}else{
localStorage.removeItem(fk);
}
this.$cache.delete(fk);
return true;
}catch(e){
this.$stats.errors++;
$l.e('Storage delete failed',{key:k,error:e.message});
return false;
}
}

async $c(t='local'){
try{
if(t==='chrome'&&typeof chrome!=='undefined'&&chrome.storage){
const all=await chrome.storage.local.get();
const keys=Object.keys(all).filter(k=>k.startsWith(this.$p));
await chrome.storage.local.remove(keys);
this.$stats.deletes+=keys.length;
}else{
const keys=Object.keys(localStorage).filter(k=>k.startsWith(this.$p));
keys.forEach(k=>localStorage.removeItem(k));
this.$stats.deletes+=keys.length;
}
this.$cache.clear();
return true;
}catch(e){
this.$stats.errors++;
$l.e('Storage clear failed',e);
return false;
}
}

async $ga(t='local'){
try{
if(t==='chrome'&&typeof chrome!=='undefined'&&chrome.storage){
const all=await chrome.storage.local.get();
const result={};
for(const[k,v]of Object.entries(all)){
if(k.startsWith(this.$p)){
try{
let data=JSON.parse(v);
if(data.compressed){
data=JSON.parse($decompress(v));
}
result[k.substring(this.$p.length)]=data.value??data;
}catch{
result[k.substring(this.$p.length)]=v;
}
}
}
return result;
}else{
const result={};
Object.keys(localStorage).forEach(k=>{
if(k.startsWith(this.$p)){
try{
let data=JSON.parse(localStorage.getItem(k));
if(data.compressed){
data=JSON.parse($decompress(localStorage.getItem(k)));
}
result[k.substring(this.$p.length)]=data.value??data;
}catch{
result[k.substring(this.$p.length)]=localStorage.getItem(k);
}
}
});
return result;
}
}catch(e){
this.$stats.errors++;
$l.e('Storage get all failed',e);
return{};
}
}

async $ss(tid,o){
await this.$s(`tool_${tid}`,o,'chrome',{ttl:this.$maxAge});
}

async $gs(tid,d={}){
return await this.$g(`tool_${tid}`,d,'chrome');
}

async $cleanup(){
$l.i('Starting storage cleanup...');
let cleaned=0;
const now=Date.now();
const threshold=now-this.$maxAge;

try{
if(typeof chrome!=='undefined'&&chrome.storage){
const all=await chrome.storage.local.get();
const toRemove=[];

for(const[k,v]of Object.entries(all)){
if(k.startsWith(this.$p)){
try{
const data=JSON.parse(v);
if(data.timestamp&&data.timestamp<threshold){
toRemove.push(k);
cleaned++;
}
}catch{
if(k.includes('_temp_')||k.includes('_cache_')){
toRemove.push(k);
cleaned++;
}
}
}
}

if(toRemove.length>0){
await chrome.storage.local.remove(toRemove);
}
}else{
const toRemove=[];
Object.keys(localStorage).forEach(k=>{
if(k.startsWith(this.$p)){
try{
const data=JSON.parse(localStorage.getItem(k));
if(data.timestamp&&data.timestamp<threshold){
toRemove.push(k);
cleaned++;
}
}catch{
if(k.includes('_temp_')||k.includes('_cache_')){
toRemove.push(k);
cleaned++;
}
}
}
});
toRemove.forEach(k=>localStorage.removeItem(k));
}

this.$stats.deletes+=cleaned;
$l.i(`Cleanup completed: ${cleaned} items removed`);
}catch(e){
$l.e('Cleanup failed',e);
}
}

$cleanCache(){
if(this.$cache.size<=this.$cacheMaxSize)return;

const entries=[...this.$cache.entries()];
entries.sort((a,b)=>a[1].timestamp-b[1].timestamp);
const toRemove=entries.slice(0,Math.floor(this.$cacheMaxSize*0.3));
toRemove.forEach(([k])=>this.$cache.delete(k));
}

$getStorageSize(){
try{
let size=0;
Object.keys(localStorage).forEach(k=>{
if(k.startsWith(this.$p)){
size+=localStorage.getItem(k).length;
}
});
return size;
}catch{
return 0;
}
}

async $export(){
try{
const data=await this.$ga('chrome');
const localData=await this.$ga('local');
const exportData={
version:'1.0.6',
timestamp:Date.now(),
chrome:data,
local:localData,
stats:this.$stats
};
return JSON.stringify(exportData,null,2);
}catch(e){
$l.e('Export failed',e);
return null;
}
}

async $import(jsonData){
try{
const data=JSON.parse(jsonData);
if(!data.version||!data.timestamp){
throw new Error('Invalid export format');
}

let imported=0;
if(data.chrome){
for(const[k,v]of Object.entries(data.chrome)){
await this.$s(k,v,'chrome');
imported++;
}
}
if(data.local){
for(const[k,v]of Object.entries(data.local)){
await this.$s(k,v,'local');
imported++;
}
}

$l.i(`Import completed: ${imported} items imported`);
return{success:true,imported};
}catch(e){
$l.e('Import failed',e);
return{success:false,error:e.message};
}
}

$getStats(){
const storageSize=this.$getStorageSize();
return{
...this.$stats,
storageSize,
storageSizeFormatted:this.$formatSize(storageSize),
cacheSize:this.$cache.size,
compressionRatio:this.$stats.compressionSaved>0?(this.$stats.compressionSaved/1024).toFixed(2)+'KB':'0KB',
uptime:Date.now()-(this.$initTime||Date.now())
};
}

$formatSize(bytes){
if(bytes===0)return '0 B';
const k=1024;
const sizes=['B','KB','MB','GB'];
const i=Math.floor(Math.log(bytes)/Math.log(k));
return parseFloat((bytes/Math.pow(k,i)).toFixed(2))+' '+sizes[i];
}

$saveStats(){
try{
localStorage.setItem(this.$p+'stats',JSON.stringify(this.$stats));
}catch(e){
$l.e('Failed to save stats',e);
}
}

$loadStats(){
try{
const saved=localStorage.getItem(this.$p+'stats');
if(saved&&saved!=='undefined'&&saved!=='null'){
const parsed=JSON.parse(saved);
if(parsed&&typeof parsed==='object'){
this.$stats={...this.$stats,...parsed};
}
}
}catch(e){
$l.w('Failed to load stats',e.message);
this.$stats={reads:0,writes:0,deletes:0,errors:0,compressionSaved:0};
}
}

async $backup(){
const backup=await this.$export();
if(!backup)return null;

const blob=new Blob([backup],{type:'application/json'});
const url=URL.createObjectURL(blob);
const a=document.createElement('a');
a.href=url;
a.download=`kil0p3tools-backup-${new Date().toISOString().split('T')[0]}.json`;
a.click();
URL.revokeObjectURL(url);
return true;
}

async $optimize(){
$l.i('Starting storage optimization...');
let optimized=0;

try{
const all=await this.$ga('chrome');
await this.$c('chrome');
for(const[k,v]of Object.entries(all)){
await this.$s(k,v,'chrome',{compress:true});
optimized++;
}
$l.i(`Optimization completed: ${optimized} items recompressed`);
return{success:true,optimized};
}catch(e){
$l.e('Optimization failed',e);
return{success:false,error:e.message};
}
}

$reset(){
this.$c('local');
this.$c('chrome');
this.$cache.clear();
this.$stats={reads:0,writes:0,deletes:0,errors:0,compressionSaved:0};
this.$saveStats();
$l.i('Storage completely reset');
}
}

export const $storage=new $st();