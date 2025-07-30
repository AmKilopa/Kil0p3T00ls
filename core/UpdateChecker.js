export class $uc{
static $api='https://api.github.com/repos/AmKilopa/Kil0p3T00ls/releases/latest';
static $int=2*60*60*1000;
static $key='updateChecker';

static async $init(){
await this.$check();
this.$schedule();
}

static async $check(){
try{
const res=await fetch(this.$api);
if(!res.ok)return{success:false,error:`GitHub API: ${res.status}`};
const data=await res.json();
const latest=data.tag_name.replace('v','');
const current=chrome.runtime.getManifest().version;
const hasUpdate=this.$compare(latest,current);
const updateData={
hasUpdate,
current,
latest,
url:data.html_url,
notes:data.body?.substring(0,200)||'',
published:data.published_at,
checked:Date.now()
};
await chrome.storage.local.set({[this.$key]:updateData});
if(hasUpdate){
await this.$setBadge();
}else{
await this.$clearBadge();
}
return{success:true,data:updateData};
}catch(e){
return{success:false,error:e.message};
}}

static $compare(latest,current){
const l=latest.split('.').map(Number);
const c=current.split('.').map(Number);
for(let i=0;i<Math.max(l.length,c.length);i++){
const lv=l[i]||0;
const cv=c[i]||0;
if(lv>cv)return true;
if(lv<cv)return false;
}
return false;
}

static async $setBadge(){
try{
await chrome.action.setBadgeText({text:'!'});
await chrome.action.setBadgeBackgroundColor({color:'#22c55e'});
}catch(e){}}

static async $clearBadge(){
try{
await chrome.action.setBadgeText({text:''});
}catch(e){}}

static async $get(){
try{
const result=await chrome.storage.local.get(this.$key);
return result[this.$key]||{hasUpdate:false};
}catch(e){
return{hasUpdate:false};
}}

static async $dismiss(){
try{
const data=await this.$get();
data.hasUpdate=false;
await chrome.storage.local.set({[this.$key]:data});
await this.$clearBadge();
}catch(e){}}

static $schedule(){
setTimeout(async()=>{
await this.$check();
this.$schedule();
},this.$int);
}

static async $forceCheck(){
return await this.$check();
}
}