export const $corsConfig={
id:'cors-unblock',
title:'CORS разблокировщик',
description:'Отключение CORS ограничений для разработки',
icon:'🚀',
status:'ready',
category:'development',
version:'1.0.0',
author:'Kil0p3',
lastUpdated:'2025-07-28',
permissions:['declarativeNetRequest','tabs','storage','activeTab'],
hostPermissions:['<all_urls>'],
$config:{
baseRuleId:100000,
maxRulesPerTab:10,
defaultTimeout:5000
},
$messages:{
enabled:'CORS отключён для этой вкладки',
disabled:'CORS защита восстановлена',
error:'Ошибка при изменении настроек CORS',
tabError:'Не удалось получить информацию о вкладке'
},
$status:{
active:{
indicator:'active',
text:'CORS отключён',
icon:'🔓',
buttonText:'Включить CORS',
buttonStyle:'linear-gradient(135deg, #dc2626, #991b1b)',
info:'Отключён',
rules:'1'
},
inactive:{
indicator:'inactive',
text:'CORS защита активна',
icon:'🛡️',
buttonText:'Отключить CORS',
buttonStyle:'linear-gradient(135deg, #2a2a2a, #1a1a1a)',
info:'Защищён',
rules:'0'
}
}
};