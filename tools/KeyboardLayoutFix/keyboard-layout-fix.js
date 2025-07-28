import{$layoutConfig}from'./config.js';
import{$storage}from'../../core/storage.js';
import{$n}from'../../core/utils.js';

let $e={},$mode='auto',$isProcessing=false;

export async function init(){
await $initElements();
await $loadSettings();
$setupEventListeners();
$updateUI();
$updateCounts();
}

async function $initElements(){
$e={
input:document.getElementById('inputText'),
output:document.getElementById('outputText'),
convertBtn:document.getElementById('convertBtn'),
convertText:document.getElementById('convertText'),
copyBtn:document.getElementById('copyBtn'),
swapBtn:document.getElementById('swapBtn'),
clearBtn:document.getElementById('clearInputBtn'),
pasteBtn:document.getElementById('pasteBtn'),
inputCount:document.getElementById('inputCount'),
outputCount:document.getElementById('outputCount'),
currentMode:document.getElementById('currentMode'),
processedCount:document.getElementById('processedCount'),
detectedLayout:document.getElementById('detectedLayout'),
modeBtns:{
auto:document.getElementById('autoMode'),
ruEn:document.getElementById('ruToEnMode'),
enRu:document.getElementById('enToRuMode')
}
};
}

function $setupEventListeners(){
$e.input.addEventListener('input',()=>{
$updateCounts();
$analyzeText();
$saveSettings();
});

$e.input.addEventListener('paste',()=>{
setTimeout(()=>{
$updateCounts();
$analyzeText();
},50);
});

$e.convertBtn.addEventListener('click',$convertText);
$e.copyBtn.addEventListener('click',$copyResult);
$e.swapBtn.addEventListener('click',$swapText);
$e.clearBtn.addEventListener('click',$clearInput);
$e.pasteBtn.addEventListener('click',$pasteText);

Object.entries($e.modeBtns).forEach(([key,btn])=>{
btn.addEventListener('click',()=>{
const newMode=key==='auto'?'auto':key==='ruEn'?'ru-en':'en-ru';
$setMode(newMode);
});
});

document.addEventListener('keydown',(e)=>{
if(e.ctrlKey&&e.key==='Enter'){
e.preventDefault();
$convertText();
}
});
}

async function $setMode(mode){
$mode=mode;
$updateModeButtons();
$updateModeDisplay();
await $saveSettings();
if($e.input.value.trim())$analyzeText();
}

function $updateModeButtons(){
Object.values($e.modeBtns).forEach(btn=>btn.classList.remove('active'));
if($mode==='auto')$e.modeBtns.auto.classList.add('active');
else if($mode==='ru-en')$e.modeBtns.ruEn.classList.add('active');
else if($mode==='en-ru')$e.modeBtns.enRu.classList.add('active');
}

function $updateModeDisplay(){
$e.currentMode.textContent=$layoutConfig.$modes[$mode]?.name||$layoutConfig.$modes.auto.name;
$e.convertText.textContent=$layoutConfig.$modes[$mode]?.buttonText||$layoutConfig.$modes.auto.buttonText;
}

function $updateCounts(){
const inputLength=$e.input.value.length;
const outputLength=$e.output.value.length;
$e.inputCount.textContent=`${inputLength} символов`;
$e.outputCount.textContent=`${outputLength} символов`;
}

function $analyzeText(){
const text=$e.input.value.trim();
if(!text){
$e.detectedLayout.textContent='-';
return;
}

if($mode==='auto'){
const detected=$detectLayout(text);
$e.detectedLayout.textContent=detected==='ru'?'Русская':'Английская';
}else{
const forcedMode=$mode==='ru-en'?'Русская':'Английская';
$e.detectedLayout.textContent=`${forcedMode} (принудительно)`;
}
}

function $detectLayout(text){
let ruCount=0,enCount=0,totalLetters=0;
for(const char of text.toLowerCase()){
if(/[а-яё]/.test(char)){
ruCount++;
totalLetters++;
}else if(/[a-z]/.test(char)){
enCount++;
totalLetters++;
}
}
if(totalLetters===0)return 'unknown';
return ruCount>enCount?'ru':'en';
}

async function $convertText(){
if($isProcessing)return;
const text=$e.input.value.trim();
if(!text){
$n($layoutConfig.$messages.noText,'warning');
$e.input.focus();
return;
}

$isProcessing=true;
$e.convertBtn.classList.add('processing');
$e.convertText.textContent='Конвертирую...';

try{
await new Promise(resolve=>setTimeout(resolve,100));
let result,actualMode;

if($mode==='auto'){
actualMode=$detectLayout(text)==='ru'?'ru-en':'en-ru';
}else{
actualMode=$mode;
}

if(actualMode==='ru-en'){
result=$convertString(text,$layoutConfig.$maps.ruToEn);
}else{
result=$convertString(text,$layoutConfig.$maps.enToRu);
}

$e.output.value=result;
$e.processedCount.textContent=text.length;
$updateCounts();
$flashSuccess($e.output);
const modeText=actualMode==='ru-en'?'РУ → EN':'EN → РУ';
$n(`${$layoutConfig.$messages.converted} (${modeText})`,'success');
}catch(error){
$n($layoutConfig.$messages.convertError,'error');
console.error('Conversion error:',error);
}finally{
$isProcessing=false;
$e.convertBtn.classList.remove('processing');
$updateModeDisplay();
}
}

function $convertString(text,mapping){
return text.split('').map(char=>mapping[char]||char).join('');
}

async function $copyResult(){
const text=$e.output.value.trim();
if(!text){
$n($layoutConfig.$messages.noCopyText,'warning');
return;
}

try{
if(navigator.clipboard&&window.isSecureContext){
await navigator.clipboard.writeText(text);
}else{
$e.output.select();
$e.output.setSelectionRange(0,99999);
document.execCommand('copy');
window.getSelection().removeAllRanges();
}
$flashSuccess($e.copyBtn);
$n($layoutConfig.$messages.copied,'success');
}catch(error){
$n($layoutConfig.$messages.copyError,'error');
console.error('Copy error:',error);
}
}

function $swapText(){
const text=$e.output.value.trim();
if(!text){
$n($layoutConfig.$messages.noResult,'warning');
return;
}
$e.input.value=text;
$e.output.value='';
$updateCounts();
$analyzeText();
$saveSettings();
$n($layoutConfig.$messages.swapped,'success');
}

function $clearInput(){
if(!$e.input.value){
$n($layoutConfig.$messages.alreadyEmpty,'info');
return;
}
$e.input.value='';
$e.output.value='';
$e.detectedLayout.textContent='-';
$e.processedCount.textContent='0';
$updateCounts();
$saveSettings();
$n($layoutConfig.$messages.cleared,'info');
}

async function $pasteText(){
try{
let text='';
if(navigator.clipboard&&window.isSecureContext){
text=await navigator.clipboard.readText();
}else{
$n($layoutConfig.$messages.pasteManually,'info');
$e.input.focus();
return;
}
if(text.trim()){
$e.input.value=text;
$updateCounts();
$analyzeText();
$saveSettings();
$n($layoutConfig.$messages.pasted,'success');
}else{
$n($layoutConfig.$messages.emptyClipboard,'warning');
}
}catch(error){
$n($layoutConfig.$messages.pasteError,'error');
console.error('Paste error:',error);
}
}

function $flashSuccess(element){
element.classList.add('success-flash');
setTimeout(()=>element.classList.remove('success-flash'),500);
}

function $updateUI(){
$updateModeButtons();
$updateModeDisplay();
$updateCounts();
$analyzeText();
}

async function $saveSettings(){
await $storage.$ss('keyboard-layout-fix',{
mode:$mode,
text:$e.input.value
});
}

async function $loadSettings(){
const settings=await $storage.$gs('keyboard-layout-fix',{
mode:'auto',
text:''
});
$mode=settings.mode;
if(settings.text)$e.input.value=settings.text;
}

export{
$convertText as convertText,
$copyResult as copyResult,
$swapText as swapText,
$clearInput as clearInput,
$setMode as setMode,
$detectLayout as detectLayout
};