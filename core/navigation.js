class $nav{
constructor(){
this.$cv='menu';
this.$ct=null;
this.$h=[];
}

$sv(vn,d=null){
if(this.$cv!==vn){
this.$h.push({view:this.$cv,data:this.$ct});
}
document.getElementById('menuView').classList.toggle('hidden',vn!=='menu');
document.getElementById('toolView').classList.toggle('hidden',vn!=='tool');
this.$cv=vn;
this.$ct=d;
}

$gb(){
if(this.$h.length>0){
const p=this.$h.pop();
this.$sv(p.view,p.data);
}else{
this.$sv('menu');
}
}

$gc(){
return this.$cv;
}

$gct(){
return this.$ct;
}

$ch(){
this.$h=[];
this.$ct=null;
}
}

export const $navigation=new $nav();