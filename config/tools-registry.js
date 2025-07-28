export const $r=[
{
id:'cors-unblock',
title:'CORS разблокировщик',
description:'Отключение CORS ограничений для разработки',
icon:'🚀',
status:'ready',
category:'development',
folder:'CorsUnblock',
version:'1.0.0',
author:'Kil0p3',
permissions:['declarativeNetRequest','tabs','storage','activeTab'],
hostPermissions:['<all_urls>']
},
{
id:'password-generator',
title:'Генератор паролей',
description:'Создание надёжных паролей с настройками',
icon:'🔐',
status:'ready',
category:'security',
folder:'PasswordGenerator',
version:'1.0.0',
author:'Kil0p3',
permissions:[]
},
{
id:'keyboard-layout-fix',
title:'Исправление раскладки',
description:'Конвертация текста между русской и английской раскладкой',
icon:'⌨️',
status:'ready',
category:'text-tools',
folder:'KeyboardLayoutFix',
version:'1.0.0',
author:'Kil0p3',
permissions:[]
},
{
id:'spell-checker',
title:'Проверка орфографии',
description:'Исправление ошибок в тексте',
icon:'✍️',
status:'beta',
category:'text-tools',
folder:'SpellChecker',
version:'1.0.0',
author:'Kil0p3',
permissions:[]
},
{
id:'qr-generator',
title:'QR код генератор',
description:'Создание QR кодов для текста и ссылок',
icon:'📱',
status:'coming-soon',
category:'generators',
folder:'QrGenerator',
version:'1.0.0',
author:'Kil0p3',
permissions:[]
}
];

const $m=new Map($r.map(t=>[t.id,t]));
const $c=new Map();
const $s=new Map();
const $stats={t:0,r:0,b:0,cs:0,cat:0};

function $init(){
$r.forEach(t=>{
if(!$c.has(t.category))$c.set(t.category,[]);
$c.get(t.category).push(t);
if(!$s.has(t.status))$s.set(t.status,[]);
$s.get(t.status).push(t);});
$stats.t=$r.length;
$stats.r=($s.get('ready')||[]).length;
$stats.b=($s.get('beta')||[]).length;
$stats.cs=($s.get('coming-soon')||[]).length;
$stats.cat=$c.size;}

$init();

export const $get=id=>$m.get(id);
export const $cat=cat=>$c.get(cat)||[];
export const $stat=stat=>$s.get(stat)||[];
export const $cats=()=>[...$c.keys()].sort();
export const $info=()=>({...$stats});