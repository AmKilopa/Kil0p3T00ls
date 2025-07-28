export const $spellConfig={
id:'spell-checker',
title:'Проверка орфографии',
description:'Исправление ошибок в тексте',
icon:'✍️',
status:'beta',
category:'text-tools',
version:'1.0.0',
author:'Kil0p3',
lastUpdated:'2025-07-28',
permissions:[],
$api:{
baseUrl:'https://api.languagetool.org/v2/check',
timeout:10000,
language:'auto',
settings:{
enabledOnly:false,
level:'picky',
enableHiddenRules:true
}
},
$messages:{
noText:'Введите текст для проверки',
checking:'Проверяю орфографию...',
noErrors:'Ошибок не найдено',
errorsFound:'Найдены ошибки:',
apiError:'Ошибка проверки орфографии',
copied:'Исправленный текст скопирован',
replaced:'Текст заменён на исправленный',
cleared:'Текст очищен',
noCorrected:'Нет исправленного текста',
noTextToCopy:'Нет текста для копирования',
copyError:'Ошибка при копировании'
},
$ui:{
maxSuggestions:3,
minTextLength:1,
maxTextLength:10000
}
};