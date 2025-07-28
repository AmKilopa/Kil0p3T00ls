export const $passwordConfig={
id:'password-generator',
title:'Генератор паролей',
description:'Создание надёжных паролей с настройками',
icon:'🔐',
status:'ready',
category:'security',
version:'1.0.0',
author:'Kil0p3',
lastUpdated:'2025-07-28',
permissions:[],
$d:{
length:12,
includeUppercase:true,
includeLowercase:true,
includeNumbers:true,
includeSymbols:true,
excludeSimilar:false,
excludeAmbiguous:false
},
$cs:{
uppercase:'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
lowercase:'abcdefghijklmnopqrstuvwxyz',
numbers:'0123456789',
symbols:'!@#$%^&*()_+-=[]{}|;:,.<>?',
similar:'0O1lI',
ambiguous:'{}[]()\/\\\'\"~,;.<>'
},
$v:{
minLength:4,
maxLength:128
},
$s:{
$el:{
veryWeak:{min:0,max:28,color:'#ef4444',text:'Очень слабый'},
weak:{min:28,max:36,color:'#f97316',text:'Слабый'},
fair:{min:36,max:60,color:'#eab308',text:'Средний'},
strong:{min:60,max:128,color:'#22c55e',text:'Сильный'},
veryStrong:{min:128,max:Infinity,color:'#059669',text:'Очень сильный'}
},
$bfs:1000000000
},
$messages:{
noTypes:'Выберите хотя бы один тип символов',
copied:'Пароль скопирован в буфер обмена',
generate:'Сначала сгенерируйте пароль',
copyError:'Ошибка при копировании пароля'
}
};