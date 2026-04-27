(function(){
  'use strict';
  var accent='US', voices=[], lastIntro='', lastA2='', lastB1='', lastDialogue='', lastRoleplay='';
  function $(id){return document.getElementById(id)}
  function $all(sel,root){return Array.prototype.slice.call((root||document).querySelectorAll(sel))}
  function val(id){var el=$(id); if(!el) return ''; return (el.value||'').trim()}
  function esc(s){return String(s||'').replace(/[&<>]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;'}[c]})}
  function pick(id){var v=val(id), other=val(id+'Other'); return v==='other' ? other : v}
  function sentence(s){s=(s||'').trim(); if(!s) return ''; return s.charAt(0).toUpperCase()+s.slice(1).replace(/[.!?]*$/,'.')}
  function loadVoices(){voices=window.speechSynthesis?window.speechSynthesis.getVoices():[]}
  function voice(){var lang=accent==='UK'?'en-GB':'en-US'; return voices.find(function(v){return v.lang&&v.lang.indexOf(lang)===0})||voices.find(function(v){return v.lang&&v.lang.indexOf('en')===0})||null}
  function speak(text){if(!window.speechSynthesis) return; window.speechSynthesis.cancel(); var u=new SpeechSynthesisUtterance(String(text||'')); var v=voice(); if(v) u.voice=v; u.lang=accent==='UK'?'en-GB':'en-US'; u.rate=.88; u.pitch=1.04; window.speechSynthesis.speak(u)}
  function textFromSelector(sel){var el=document.querySelector(sel); return el?el.innerText||el.textContent:''}
  function setAccent(next){accent=next; $('voiceUS').classList.toggle('active',next==='US'); $('voiceUK').classList.toggle('active',next==='UK'); $('voiceUS').setAttribute('aria-pressed',next==='US'); $('voiceUK').setAttribute('aria-pressed',next==='UK')}

  var prompts=[
    {icon:'😊',title:'Feeling sentence',help:'Make the feeling sentence sound natural.',id:'pFeeling',options:['I’m feeling happy today.','I’m feeling a little nervous, but I’m motivated.','I’m feeling excited to start.','I’m feeling more confident step by step.','other']},
    {icon:'🔗',title:'Add a connector',help:'Use because / and / but to make your answer longer.',id:'pConnector',options:['because English is important for my future.','and I want to practise speaking.','but speaking is difficult for me.','because I would like to work with visitors.','other']},
    {icon:'🏰',title:'Future job sentence',help:'Say your goal in a clear professional way.',id:'pDream',options:['I would like to work at Disneyland.','I would like to welcome visitors in a magical park.','I would like to help customers in English.','I’m preparing for a future job with international visitors.','other']},
    {icon:'🗣️',title:'Confidence sentence',help:'Useful sentence for a first course.',id:'pConfidence',options:['I can speak slowly and clearly.','I need time, but I can answer.','Can you repeat, please?','I don’t understand everything yet, but I’m learning.','other']},
    {icon:'🌟',title:'Stronger ending',help:'Finish your introduction with a positive goal.',id:'pEnding',options:['My goal is to speak more confidently.','My goal is to understand simple conversations.','My goal is to pass the VTest.','My goal is to feel ready for customer service.','other']}
  ];

  var dialogue=[
    {teacher:'Hello Angie! Nice to meet you. How are you today?',answerId:'d1',answers:['I’m feeling happy today.','I’m feeling a little nervous, but I’m motivated.','I’m feeling excited to start English.','other']},
    {teacher:'Can you introduce yourself?',answerId:'d2',answers:['My name is Angie. I am from France.','My name is Angie and I live in France.','My name is Angie. I am preparing for the VTest.','other']},
    {teacher:'Why do you want to improve your English?',answerId:'d3',answers:['I need English for work and travel.','I would like to work in a magical theme park.','I want to speak more confidently.','other']},
    {teacher:'What can you say to a visitor?',answerId:'d4',answers:['Hello, how can I help you?','Good morning, welcome to the park. How can I help you?','Please follow me.','other']}
  ];

  var quiz=[
    {q:'Choose the correct sentence.',choices:['He have 60 years old.','He is 60 years old.','He has 60 years old.'],a:1},
    {q:'Choose the best question for customer service.',choices:['How can I help you?','How I can help you?','How help you?'],a:0},
    {q:'Choose the correct phrase.',choices:['I work from 5 a.m. to 1 p.m.','I work at 5 a.m. to 1 p.m.','I work of 5 a.m. at 1 p.m.'],a:0},
    {q:'What is the best answer to “Where do you live?”',choices:['I live in France.','I am live France.','I living in France.'],a:0},
    {q:'Choose the best connector.',choices:['I like English because it is useful.','I like English but it is useful.','I like English then it is useful.'],a:0}
  ];

  function renderPrompts(){
    var host=$('promptGrid'); if(!host) return; host.innerHTML='';
    prompts.forEach(function(p){
      var card=document.createElement('article'); card.className='prompt-card';
      var opts=p.options.map(function(o){return '<option value="'+esc(o)+'">'+esc(o==='other'?'➕ other':o)+'</option>'}).join('');
      card.innerHTML='<h3>'+p.icon+' '+p.title+'</h3><div class="prompt-help">'+esc(p.help)+'</div><select id="'+p.id+'">'+opts+'</select><textarea id="'+p.id+'Other" class="otherArea" style="display:none" placeholder="Write your own improved sentence..."></textarea><div class="prompt-actions"><button class="btn ghost promptListen" type="button" data-id="'+p.id+'">🔊 Listen sentence</button></div>';
      host.appendChild(card);
      $(p.id).addEventListener('change',function(){ $(p.id+'Other').style.display=this.value==='other'?'block':'none'; });
    });
  }

  function renderDialogue(){
    var host=$('dialogueBox'); if(!host) return; host.innerHTML='';
    dialogue.forEach(function(d,i){
      var row=document.createElement('div'); row.className='dialogueLine';
      row.innerHTML='<div><span class="speaker">Tisha:</span><br>'+esc(d.teacher)+'<br><button class="btn ghost smallSpeak" type="button" data-text="'+esc(d.teacher)+'">🔊 Listen</button></div><label class="field"><span>Angie answer '+(i+1)+'</span><select id="'+d.answerId+'">'+d.answers.map(function(a){return '<option value="'+esc(a)+'">'+esc(a==='other'?'➕ other':a)+'</option>'}).join('')+'</select><input class="other" id="'+d.answerId+'Other" type="text" placeholder="Write your own answer"></label>';
      host.appendChild(row);
      $(d.answerId).addEventListener('change',showOthers);
    });
  }

  function renderQuiz(){
    var host=$('quiz'); if(!host) return; host.innerHTML='';
    quiz.forEach(function(item,i){
      var div=document.createElement('div'); div.className='quizItem';
      div.innerHTML='<strong>Question '+(i+1)+':</strong> '+esc(item.q)+' <button class="miniListen" type="button" data-text="'+esc(item.q)+'">🔊</button><div class="quizOptions">'+item.choices.map(function(c,j){return '<label><input type="radio" name="q'+i+'" value="'+j+'"> '+esc(c)+'</label>'}).join('')+'</div>';
      host.appendChild(div);
    });
  }

  function showOthers(){
    $all('select').forEach(function(sel){var wrap=sel.closest('.field'); var other=$(sel.id+'Other'); if(other){ if(sel.value==='other'){other.style.display='block'; if(wrap)wrap.classList.add('show-other')} else {other.style.display='none'; if(wrap)wrap.classList.remove('show-other')} }});
  }

  function makeLowerFirst(s){
    s = String(s || '').trim();
    if(!s) return '';
    return s.charAt(0).toLowerCase() + s.slice(1);
  }

  function removeFinalDot(s){
    return String(s || '').trim().replace(/[.!?]+$/,'');
  }

  function buildModels(name, feeling, from, live, family, pets, work, dream, need, hobbies, goal){
    var familyIdea = removeFinalDot(family);
    var petsIdea = removeFinalDot(pets);
    var workIdea = removeFinalDot(work);
    var dreamIdea = removeFinalDot(dream);
    var hobbiesIdea = removeFinalDot(hobbies);
    var goalIdea = removeFinalDot(goal).replace(/^to\s+/i,'');

    lastA2 =
      'Hello, my name is ' + name + '. ' +
      'I’m from ' + from + ', and I live ' + live + '. ' +
      'Today, I’m feeling ' + feeling + ', and I am ready to practise English. ' +
      familyIdea + '. ' +
      petsIdea + '. ' +
      workIdea + ', and ' + makeLowerFirst(dreamIdea) + '. ' +
      'I need English ' + need + '. ' +
      'In my free time, I like ' + hobbiesIdea + '. ' +
      'My goal is to ' + goalIdea + '.';

    lastB1 =
      'Hello, my name is ' + name + '. ' +
      'I’m from ' + from + ', and I currently live ' + live + '. ' +
      'Today, I’m feeling ' + feeling + ', and I’m excited to start improving my English step by step. ' +
      familyIdea + ', and ' + makeLowerFirst(petsIdea) + '. ' +
      workIdea + '. ' +
      'In the future, ' + makeLowerFirst(dreamIdea) + ', so I need English ' + need + '. ' +
      'I would especially like to welcome people, answer simple questions, and feel more natural when I speak. ' +
      'Outside work, I enjoy ' + hobbiesIdea + '. ' +
      'During this course, my main goal is to ' + goalIdea + ' and become more confident in real conversations.';

    lastA2 = fixCapitalI(lastA2);
    lastB1 = fixCapitalI(lastB1);
    if($('modelA2')) $('modelA2').innerHTML=esc(lastA2);
    if($('modelB1')) $('modelB1').innerHTML=esc(lastB1);
  }
function fixCapitalI(text) {
  return String(text)
    .replace(/(^|[\s.,;:!?])i(?=($|[\s.,;:!?]))/g, "$1I")
    .replace(/\bi'm\b/gi, "I'm")
    .replace(/\bi’m\b/gi, "I’m")
    .replace(/\bi've\b/gi, "I've")
    .replace(/\bi’ve\b/gi, "I’ve")
    .replace(/\bi'd\b/gi, "I'd")
    .replace(/\bi’d\b/gi, "I’d")
    .replace(/\bi'll\b/gi, "I'll")
    .replace(/\bi’ll\b/gi, "I’ll");
}
  
  function buildIntro(){
    var name=pick('name')||'Angie';
    var feeling=pick('feeling')||'motivated';
    var from=pick('from')||'France';
    var live=pick('live')||'in France';
    var family=sentence(pick('family')||'I have a small family');
    var pets=sentence(pick('pets')||'I love animals');
    var work=sentence(pick('work')||'I am preparing for a new job');
    var dream=sentence(pick('dream')||'I would like to work in a magical theme park');
    var need=pick('englishNeed')||'for work, travel and the VTest';
    var hobbies=pick('hobbies')||'travelling';
    var goal=pick('goal')||'speak more confidently';
    lastIntro = fixCapitalI('Hello, my name is '+name+'. I’m feeling '+feeling+' today. I am from '+from+' and I live '+live+'. '+family+' '+pets+' '+work+' '+dream+' I need English '+need+'. In my free time, I like '+hobbies+'. My goal is to '+goal+'.');
    $('introOutput').innerHTML='<strong>Your introduction:</strong><br>'+esc(lastIntro)+'<hr><strong>Teacher correction focus:</strong> “I’m feeling...” + subject + verb + short sentences + pronunciation + confidence.';
    buildModels(
            name,
            feeling,
            from,
            live,
            fixCapitalI(family),
            fixCapitalI(pets),
            fixCapitalI(work),
            fixCapitalI(dream),
            need,
            hobbies,
            goal
          );
              return lastIntro;
            }

  function buildDialogue(){
    var lines=[];
    dialogue.forEach(function(d){ lines.push('Tisha: '+d.teacher); lines.push('Angie: '+(pick(d.answerId)||d.answers[0])); });
    lastDialogue=lines.join('\n');
    $('dialogueOutput').innerHTML='<strong>Your conversation:</strong><br>'+esc(lastDialogue).replace(/\n/g,'<br>');
    return lastDialogue;
  }

  function visitorFollowUp(problem, question){
    var p = (problem || '').toLowerCase();
    var q = (question || '').toLowerCase();
    if (p.indexOf('lost') !== -1 || q.indexOf('where would you like to go') !== -1) return 'I would like to go to the castle, please.';
    if (p.indexOf('ticket') !== -1 || q.indexOf('ticket') !== -1) return 'Yes, here is my ticket.';
    if (p.indexOf('child') !== -1 || q.indexOf('child') !== -1) return 'Her name is Emma. She is seven years old.';
    if (p.indexOf('restaurant') !== -1 || q.indexOf('restaurant') !== -1) return 'I am looking for a family restaurant, please.';
    if (p.indexOf('show') !== -1 || q.indexOf('show') !== -1) return 'I would like to see the parade show, please.';
    return 'Yes, thank you. I need some help, please.';
  }

  function buildRoleplay(){
    var welcome=pick('welcomePhrase')||'Good morning, welcome to the park. How can I help you?';
    var problem=pick('guestProblem')||'I am lost. I need directions.';
    var question=pick('helpQuestion')||'Where would you like to go?';
    var answer=visitorFollowUp(problem, question);
    var solution=pick('solutionPhrase')||'Of course. I can help you. Follow me, please.';
    lastRoleplay='Angie: '+welcome+'\nVisitor: Hello. '+problem+'\nAngie: '+question+'\nVisitor: '+answer+'\nAngie: '+solution+'\nVisitor: Thank you very much.\nAngie: You are welcome. Have a magical day!';
    $('roleplayOutput').innerHTML='<strong>Role play:</strong><br>'+esc(lastRoleplay).replace(/\n/g,'<br>');
    return lastRoleplay;
  }
  function checkQuiz(){
    var ok=0;
    quiz.forEach(function(item,i){var picked=document.querySelector('input[name="q'+i+'"]:checked'); var box=$all('.quizItem')[i]; box.classList.remove('good','bad'); if(picked&&Number(picked.value)===item.a){ok++; box.classList.add('good')}else{box.classList.add('bad')}});
    $('quizScore').textContent='Score: '+ok+' / '+quiz.length;
  }

  document.addEventListener('click',function(e){
    var t=e.target;
    if(t.matches('[data-speak]')) speak(textFromSelector(t.getAttribute('data-speak')));
    if(t.matches('[data-text]')) speak(t.getAttribute('data-text'));
    if(t.classList.contains('promptListen')){var id=t.getAttribute('data-id'); var out=$(id).value==='other'?$(id+'Other').value:$(id).value; speak(out)}
    if(t.matches('[data-toggle]')) $(t.getAttribute('data-toggle')).classList.toggle('open');
  });

  function init(){
    loadVoices(); if(window.speechSynthesis) window.speechSynthesis.onvoiceschanged=loadVoices;
    $('voiceUS').addEventListener('click',function(){setAccent('US')}); $('voiceUK').addEventListener('click',function(){setAccent('UK')}); $('stopVoice').addEventListener('click',function(){if(window.speechSynthesis)window.speechSynthesis.cancel()});
    renderPrompts(); renderDialogue(); renderQuiz(); showOthers();
    $all('select').forEach(function(s){s.addEventListener('change',showOthers)});
    $('buildIntro').addEventListener('click',buildIntro); $('listenIntro').addEventListener('click',function(){speak(lastIntro||buildIntro())}); $('copyIntro').addEventListener('click',function(){navigator.clipboard&&navigator.clipboard.writeText(lastIntro||buildIntro())}); $('resetIntro').addEventListener('click',function(){$('introForm').reset(); $('introOutput').innerHTML=''; $('modelA2').textContent='Build your introduction first to see an upgraded model.'; $('modelB1').textContent='Build your introduction first to see a stronger model.'; lastIntro=''; lastA2=''; lastB1=''; showOthers()});
    $('listenModelA2').addEventListener('click',function(){if(!lastA2) buildIntro(); speak(lastA2)}); $('listenModelB1').addEventListener('click',function(){if(!lastB1) buildIntro(); speak(lastB1)});
    $('buildDialogue').addEventListener('click',buildDialogue); $('listenDialogue').addEventListener('click',function(){speak(lastDialogue||buildDialogue())});
    $('buildRoleplay').addEventListener('click',buildRoleplay); $('listenRoleplay').addEventListener('click',function(){speak(lastRoleplay||buildRoleplay())});
    $('checkQuiz').addEventListener('click',checkQuiz); $('resetQuiz').addEventListener('click',function(){renderQuiz(); $('quizScore').textContent=''});
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
