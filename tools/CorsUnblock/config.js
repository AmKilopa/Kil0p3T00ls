export const $cc={
id:'cors-unblock',
title:'CORS разблокировщик',
description:'Отключение CORS ограничений для разработки',
icon:'🚀',
status:'ready',
category:'development',
version:'1.0.0',
author:'Kil0p3',
lastUpdated:'2024-01-15',
permissions:['declarativeNetRequest','tabs','storage','activeTab'],
hostPermissions:['<all_urls>'],
$s:{
autoDisableOnTabClose:true,
showSecurityWarnings:true,
maxRuleLifetime:60,
autoCleanupRules:true,
$ch:{
'Access-Control-Allow-Origin':'*',
'Access-Control-Allow-Methods':'GET, POST, PUT, DELETE, OPTIONS, HEAD, PATCH',
'Access-Control-Allow-Headers':'*',
'Access-Control-Allow-Credentials':'true',
'Access-Control-Expose-Headers':'*'
},
$rh:['X-Frame-Options','Content-Security-Policy','Content-Security-Policy-Report-Only']
}
};