const $cr=new Map();
const $bri=100000;

chrome.runtime.onInstalled.addListener(()=>{
$car();
});

chrome.runtime.onMessage.addListener((m,s,sr)=>{
switch(m.action){
case 'enable-cors':
$ec(m.tabId).then(()=>sr({success:true})).catch(e=>sr({success:false,error:e.message}));
break;
case 'disable-cors':
$dc(m.tabId).then(()=>sr({success:true})).catch(e=>sr({success:false,error:e.message}));
break;
case 'get-cors-status':
sr({active:$cr.has(m.tabId)});
break;
}
return true;
});

async function $ec(tid){
const nti=parseInt(tid);
if(isNaN(nti))throw new Error(`Invalid tabId: ${tid}`);
await $dc(nti);
const ts=Date.now()%1000;
const rid1=$bri+(nti*10)+1+ts;
const rid2=$bri+(nti*10)+2+ts;
const r=[{
id:rid1,
action:{
type:'modifyHeaders',
responseHeaders:[
{header:'Access-Control-Allow-Origin',operation:'set',value:'*'},
{header:'Access-Control-Allow-Methods',operation:'set',value:'GET, POST, PUT, DELETE, OPTIONS, HEAD, PATCH'},
{header:'Access-Control-Allow-Headers',operation:'set',value:'*'},
{header:'Access-Control-Allow-Credentials',operation:'set',value:'true'}
]},
condition:{
resourceTypes:['xmlhttprequest'],
tabIds:[nti]
}},{
id:rid2,
action:{
type:'modifyHeaders',
responseHeaders:[
{header:'X-Frame-Options',operation:'remove'},
{header:'Content-Security-Policy',operation:'remove'}
]},
condition:{
resourceTypes:['main_frame','sub_frame'],
tabIds:[nti]
}}];
try{
await chrome.declarativeNetRequest.updateSessionRules({addRules:r});
$cr.set(nti,[rid1,rid2]);
await $ueb(nti,true);
}catch(e){
throw new Error(`Failed to enable CORS: ${e.message}`);
}}

async function $dc(tid){
const nti=parseInt(tid);
if(isNaN(nti))return;
const ri=$cr.get(nti);
if(ri&&Array.isArray(ri)&&ri.length>0){
try{
await chrome.declarativeNetRequest.updateSessionRules({removeRuleIds:ri});
$cr.delete(nti);
await $ueb(nti,false);
}catch(e){
$cr.delete(nti);
throw new Error(`Failed to disable CORS: ${e.message}`);
}}}

async function $ueb(tid,ia){
try{
await chrome.action.setBadgeText({tabId:tid,text:ia?'OFF':''});
await chrome.action.setBadgeBackgroundColor({tabId:tid,color:ia?'#ef4444':'#6b7280'});
}catch(e){}}

async function $car(){
try{
const er=await chrome.declarativeNetRequest.getSessionRules();
const ori=er.filter(r=>r.id>=$bri).map(r=>r.id);
if(ori.length>0){
await chrome.declarativeNetRequest.updateSessionRules({removeRuleIds:ori});
}
$cr.clear();
}catch(e){}}

chrome.tabs.onRemoved.addListener(async(tid)=>{
try{
await $dc(tid);
chrome.storage.local.remove(`cors_${tid}`).catch(()=>{});
}catch(e){}
});

chrome.tabs.onUpdated.addListener(async(tid,ci,t)=>{
if(ci.status==='loading'&&$cr.has(tid)){
setTimeout(async()=>{
try{
await $ec(tid);
}catch(e){}
},500);
}
});

chrome.runtime.onSuspend.addListener(async()=>{
await $car();
});

setInterval(async()=>{
for(const[tid]of $cr.entries()){
try{
await chrome.tabs.get(tid);
}catch(e){
await $dc(tid);
}}
},2*60*1000);

globalThis.$dbg={
async $sar(){
try{
const r=await chrome.declarativeNetRequest.getSessionRules();
return{sessionRules:r,trackedRules:Object.fromEntries($cr)};
}catch(e){
return{error:e.message};
}},
async $ca(){
await $car();
},
$cr:$cr
};