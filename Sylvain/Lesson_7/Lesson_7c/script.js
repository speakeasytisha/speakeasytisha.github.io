const $ = (sel, parent=document) => parent.querySelector(sel);
const $$ = (sel, parent=document) => Array.from(parent.querySelectorAll(sel));

function shuffle(array){
  const a=[...array];
  for(let i=a.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}

const quizzes = {
  ordinals: [
    {title:'Ordinal use', q:'Choose the best sentence.', options:['The first order is ready.','The one order is ready.','The order first is ready.'], answer:'The first order is ready.', hint:'Use first / second / third for position or sequence.'},
    {title:'Date: how to say it', q:'How do you say “25 June”?', options:['the twenty-fifth of June','the twenty-five June','the June twenty-five'], answer:'the twenty-fifth of June', hint:'For dates, say the ordinal: twenty-fifth, not twenty-five.'},
    {title:'Order details', q:'Meal number 3 = the ___ meal.', options:['third','three','threeth'], answer:'third', hint:'1st = first, 2nd = second, 3rd = third.'},
    {title:'Priority', q:'Food safety is the ___ priority.', options:['first','one','oneth'], answer:'first', hint:'Priority uses an ordinal: first priority, second priority.'},
    {title:'Written date', q:'Choose a correct written date.', options:['25 June','twenty-five June','the 25 June'], answer:'25 June', hint:'In writing: 25 June / June 25 / 25th June. In speaking: the twenty-fifth of June.'},
    {title:'Sequence', q:'First, we receive the order. ___, we check the labels.', options:['Second','Two','The two'], answer:'Second', hint:'Use ordinal words for steps: first, second, third.'},
    {title:'Ordinal spelling', q:'12th = ___', options:['twelfth','twelveth','twelvth'], answer:'twelfth', hint:'Be careful: twelve → twelfth.'},
    {title:'Ordinal spelling', q:'20th = ___', options:['twentieth','twentyth','twentyth'], answer:'twentieth', hint:'twenty changes to twentieth.'}
  ],
  quantifiers: [
    {title:'Each / every', q:'___ meal has a label.', options:['Each','Much','Any'], answer:'Each', hint:'Use each when you focus on meals one by one.'},
    {title:'Each / every', q:'___ order is important for the client.', options:['Every','Much','Any'], answer:'Every', hint:'Use every when you mean all orders in general.'},
    {title:'Some / any', q:'Do you have ___ allergies?', options:['any','some','much'], answer:'any', hint:'Use any in most questions.'},
    {title:'Some / any', q:'We have ___ vegetarian meals today.', options:['some','any','much'], answer:'some', hint:'Use some in positive sentences.'},
    {title:'Some / any', q:'We do not have ___ changes for the order.', options:['any','some','many'], answer:'any', hint:'Use any in negative sentences.'},
    {title:'Many / much', q:'How ___ meals do you need?', options:['many','much','all'], answer:'many', hint:'Meals are countable plural, so use many.'},
    {title:'Many / much', q:'How ___ time do we have before delivery?', options:['much','many','each'], answer:'much', hint:'Time is uncountable, so use much.'},
    {title:'A lot of', q:'Today, we have ___ work.', options:['a lot of','many','each'], answer:'a lot of', hint:'A lot of works with countable and uncountable nouns and sounds natural.'},
    {title:'All / all the', q:'___ meals are labelled for this flight.', options:['All the','Every the','Much'], answer:'All the', hint:'Use all the for a specific group: the meals for this flight.'},
    {title:'Always / all the time', q:'Food safety is ___ important.', options:['always','all the time','every'], answer:'always', hint:'Always goes before the adjective: is always important.'},
    {title:'Always / all the time', q:'The phone is ringing ___ today.', options:['all the time','always time','every time'], answer:'all the time', hint:'All the time can mean very often, especially today or during a period.'},
    {title:'A few / a little', q:'We need ___ more information.', options:['a little','a few','many'], answer:'a little', hint:'Information is uncountable, so use a little.'},
    {title:'A few / a little', q:'We need ___ more labels.', options:['a few','a little','much'], answer:'a few', hint:'Labels are countable plural, so use a few.'},
    {title:'Every + singular', q:'Choose the correct sentence.', options:['Every meal has a label.','Every meals have a label.','Every meal have a label.'], answer:'Every meal has a label.', hint:'After every, use a singular noun: every meal.'},
    {title:'Each + singular', q:'Choose the correct sentence.', options:['Each client receives a confirmation.','Each clients receive a confirmation.','Each client receive a confirmation.'], answer:'Each client receives a confirmation.', hint:'After each, use a singular noun. With he/she/it style subject, add -s: receives.'},
    {title:'Countable or uncountable', q:'We do not have ___ space on the aircraft.', options:['much','many','each'], answer:'much', hint:'Space is uncountable, so use much in negatives/questions.'}
  ],
  toat: [
    {title:'Destination', q:'I am going ___ the airport.', options:['to','at','in'], answer:'to', hint:'Movement/direction = to.'},
    {title:'Location', q:'I am ___ the airport now.', options:['at','to','on'], answer:'at', hint:'Exact place/location = at.'},
    {title:'Recipient', q:'I will send the confirmation ___ the client.', options:['to','at','in'], answer:'to', hint:'Recipient of a message = to.'},
    {title:'Exact time', q:'The delivery is ___ 07:45.', options:['at','to','on'], answer:'at', hint:'Exact time = at.'},
    {title:'Destination', q:'We are moving ___ Lisbon in August.', options:['to','at','on'], answer:'to', hint:'Moving destination = to.'},
    {title:'Place at work', q:'The driver is waiting ___ the gate.', options:['at','to','in'], answer:'at', hint:'Exact position = at.'},
    {title:'Professional context', q:'We deliver food ___ the airline.', options:['to','at','on'], answer:'to', hint:'Deliver to someone / a company.'},
    {title:'Meeting place', q:'We are meeting ___ the restaurant.', options:['at','to','on'], answer:'at', hint:'Meeting location = at.'}
  ],
  comparisons: [
    {title:'Short adjective', q:'This order is ___ than yesterday’s order.', options:['harder','more hard','hardest'], answer:'harder', hint:'Hard is a short adjective: hard → harder.'},
    {title:'Long adjective', q:'This delivery is ___ because there are allergies.', options:['more difficult','difficulter','more hard'], answer:'more difficult', hint:'Difficult is a long adjective: more difficult.'},
    {title:'Superlative', q:'Food safety is ___ part of the process.', options:['the most important','the importantest','more important'], answer:'the most important', hint:'Important is long: the most important.'},
    {title:'Family words', q:'Which sentence sounds natural?', options:['My older daughter is at school.','My more old daughter is at school.','My elder than daughter is at school.'], answer:'My older daughter is at school.', hint:'Older is the most natural everyday comparison word.'},
    {title:'Family formal', q:'For family, “my ___ daughter” is correct and more formal.', options:['eldest','old more','most old'], answer:'eldest', hint:'Eldest is used mainly for family.'},
    {title:'Short adjective', q:'The new system is ___ than the old system.', options:['faster','more fast','fastest'], answer:'faster', hint:'Fast is short: fast → faster.'},
    {title:'Irregular adjective', q:'This solution is ___ than the first one.', options:['better','more good','gooder'], answer:'better', hint:'Good is irregular: good → better → the best.'},
    {title:'Superlative irregular', q:'This is ___ option for the client.', options:['the best','the better','the goodest'], answer:'the best', hint:'Good → better → the best.'},
    {title:'Oldest / eldest', q:'Choose the correct sentence.', options:['She is the oldest in the group.','She is the elder in the group.','She is the more old in the group.'], answer:'She is the oldest in the group.', hint:'Oldest is general superlative. Eldest is mainly for family before a noun.'},
    {title:'Long adjective', q:'The dietary requirements are ___ than usual.', options:['more complicated','complicateder','more complicate'], answer:'more complicated', hint:'Complicated is long: more complicated.'}
  ],
  connectors: [
    {title:'Sequencing', q:'___, we receive the order. Then, we check the labels.', options:['First','Because','However'], answer:'First', hint:'Use first to start a sequence.'},
    {title:'Sequencing', q:'First, we prepare the meals. ___, we deliver the food.', options:['After that','Because','Although'], answer:'After that', hint:'Use after that to continue a sequence.'},
    {title:'Reason', q:'We need clear labels ___ there are allergies.', options:['because','but','finally'], answer:'because', hint:'Because introduces a reason.'},
    {title:'Result', q:'There are allergies, ___ we need clear labels.', options:['so','although','before'], answer:'so', hint:'So introduces a result.'},
    {title:'Contrast', q:'The order is more difficult. ___, we can manage it.', options:['However','Because','First'], answer:'However', hint:'However introduces contrast and sounds professional.'},
    {title:'Purpose', q:'We check each label ___ avoid mistakes.', options:['to','because','although'], answer:'to', hint:'To + verb can express purpose.'},
    {title:'Condition', q:'___ the delivery point changes, please call me.', options:['If','Because','Finally'], answer:'If', hint:'If introduces a condition.'},
    {title:'Professional connector', q:'___ your message, I confirm the updated order.', options:['Regarding','Because','Finally'], answer:'Regarding', hint:'Regarding means concerning / about in a professional message.'},
    {title:'Polite request', q:'___ confirm the exact delivery point?', options:['Could you please','Finally you','Because you'], answer:'Could you please', hint:'Could you please + base verb = polite request.'},
    {title:'Conclusion', q:'___, the order is confirmed for 07:45.', options:['Overall','Although','If'], answer:'Overall', hint:'Overall gives a short conclusion.'}
  ],
  integrated: [
    {title:'Mixed precision', q:'___ meal needs a clear English label.', options:['Each','Much','Always'], answer:'Each', hint:'One by one: each meal.'},
    {title:'Mixed precision', q:'The driver is ___ the airport, but the food goes ___ the aircraft.', options:['at / to','to / at','at / at'], answer:'at / to', hint:'At = location. To = destination.'},
    {title:'Mixed precision', q:'The second order is ___ than the first order.', options:['more difficult','more hard','difficultest'], answer:'more difficult', hint:'Difficult is long: more difficult.'},
    {title:'Mixed precision', q:'We don’t have ___ information about the exact gate.', options:['any','some','many'], answer:'any', hint:'Negative sentence: use any.'},
    {title:'Mixed precision', q:'How ___ trays do you need for the flight?', options:['many','much','each'], answer:'many', hint:'Trays are countable plural.'},
    {title:'Mixed precision', q:'The order is on 25 June. Say it:', options:['the twenty-fifth of June','twenty-five June','the twenty-five of June'], answer:'the twenty-fifth of June', hint:'Dates use ordinal pronunciation.'},
    {title:'Mixed precision', q:'Food safety is ___ point.', options:['the most important','the importantest','more important than'], answer:'the most important', hint:'Superlative: the most important.'},
    {title:'Mixed precision', q:'___, we check allergies. After that, we prepare the labels.', options:['First','However','Because'], answer:'First', hint:'Start the sequence with first.'},
    {title:'Mixed precision', q:'Some meals are special, ___ we need to label them carefully.', options:['so','but','although'], answer:'so', hint:'So introduces the result.'},
    {title:'Mixed precision', q:'Could you confirm ___ the delivery is at the gate or at the aircraft?', options:['whether','because','finally'], answer:'whether', hint:'Whether is useful to ask between two options.'},
    {title:'Mixed precision', q:'We need ___ time to finish the labels.', options:['a little','a few','many'], answer:'a little', hint:'Time is uncountable.'},
    {title:'Mixed precision', q:'___ clients ask for special meals, but not every client.', options:['Some','Any','Much'], answer:'Some', hint:'Positive sentence with an unspecified quantity: some.'}
  ]
};

const comparisonVocab = {
  short: [
    {word:'hard → harder → the hardest', fr:'difficile / plus difficile / le plus difficile', ex:'This delivery is harder than yesterday’s delivery.'},
    {word:'fast → faster → the fastest', fr:'rapide / plus rapide / le plus rapide', ex:'The second method is faster.'},
    {word:'small → smaller → the smallest', fr:'petit / plus petit / le plus petit', ex:'This aircraft has a smaller oven.'},
    {word:'old → older → the oldest', fr:'vieux / plus âgé / le plus vieux', ex:'This system is older than the new one.'},
    {word:'warm → warmer → the warmest', fr:'chaud / plus chaud / le plus chaud', ex:'Lisbon is warmer than Savoie.'},
    {word:'safe → safer → the safest', fr:'sûr / plus sûr / le plus sûr', ex:'This option is safer for the delivery.'}
  ],
  long: [
    {word:'difficult → more difficult → the most difficult', fr:'difficile / plus difficile / le plus difficile', ex:'This order is more difficult because there are allergies.'},
    {word:'important → more important → the most important', fr:'important / plus important / le plus important', ex:'Food safety is the most important point.'},
    {word:'professional → more professional → the most professional', fr:'professionnel / plus professionnel / le plus professionnel', ex:'This email sounds more professional.'},
    {word:'complicated → more complicated → the most complicated', fr:'compliqué / plus compliqué / le plus compliqué', ex:'The delivery is more complicated today.'},
    {word:'expensive → more expensive → the most expensive', fr:'cher / plus cher / le plus cher', ex:'This option is more expensive.'},
    {word:'efficient → more efficient → the most efficient', fr:'efficace / plus efficace / le plus efficace', ex:'This process is more efficient.'}
  ],
  irregular: [
    {word:'good → better → the best', fr:'bon / meilleur / le meilleur', ex:'This solution is better for the client.'},
    {word:'bad → worse → the worst', fr:'mauvais / pire / le pire', ex:'A late delivery is worse for the client.'},
    {word:'far → farther/further → the farthest/furthest', fr:'loin / plus loin / le plus loin', ex:'The new airport is farther from the kitchen.'},
    {word:'little → less → the least', fr:'peu / moins / le moins', ex:'This option uses less space.'},
    {word:'many/much → more → the most', fr:'beaucoup / plus / le plus', ex:'Today, we have more orders than yesterday.'}
  ],
  family: [
    {word:'older', fr:'plus âgé / plus vieux', ex:'My daughter is older now.'},
    {word:'oldest', fr:'le plus âgé / le plus vieux', ex:'She is the oldest in the group.'},
    {word:'elder', fr:'aîné, plus âgé dans la famille', ex:'My elder brother lives in France. Formal.'},
    {word:'eldest', fr:'l’aîné(e) dans la famille', ex:'My eldest daughter is studying. Formal family word.'},
    {word:'younger', fr:'plus jeune', ex:'My younger cousin lives in Portugal.'},
    {word:'youngest', fr:'le / la plus jeune', ex:'She is the youngest in the family.'}
  ]
};

const connectorVocab = {
  sequence: [
    {word:'first', fr:'d’abord / premièrement', ex:'First, we receive the order.'},
    {word:'then', fr:'ensuite', ex:'Then, we check the labels.'},
    {word:'after that', fr:'après cela', ex:'After that, we prepare the meals.'},
    {word:'later', fr:'plus tard', ex:'Later, I will call the client.'},
    {word:'finally', fr:'enfin / pour finir', ex:'Finally, we deliver the food.'},
    {word:'meanwhile', fr:'pendant ce temps', ex:'Meanwhile, the team prepares the trays.'}
  ],
  addition: [
    {word:'and', fr:'et', ex:'We prepare meals and labels.'},
    {word:'also', fr:'aussi / également', ex:'We also check the delivery time.'},
    {word:'as well as', fr:'ainsi que', ex:'We check the labels as well as the quantities.'},
    {word:'in addition', fr:'de plus', ex:'In addition, we need the exact delivery point.'},
    {word:'another point is...', fr:'un autre point est...', ex:'Another point is the aircraft equipment.'}
  ],
  cause: [
    {word:'because', fr:'parce que', ex:'We need clear labels because there are allergies.'},
    {word:'so', fr:'donc', ex:'There are allergies, so we need clear labels.'},
    {word:'therefore', fr:'donc / par conséquent', ex:'The order changed; therefore, we need a new confirmation.'},
    {word:'as a result', fr:'par conséquent', ex:'As a result, the delivery time changed.'},
    {word:'that is why', fr:'c’est pourquoi', ex:'That is why I am contacting you.'}
  ],
  contrast: [
    {word:'but', fr:'mais', ex:'The order is difficult, but we can manage it.'},
    {word:'however', fr:'cependant', ex:'However, we need the exact delivery point.'},
    {word:'although', fr:'bien que', ex:'Although the order is late, we will prepare it.'},
    {word:'even though', fr:'même si', ex:'Even though the oven is small, the trays will fit.'},
    {word:'on the other hand', fr:'d’un autre côté', ex:'On the other hand, the delivery is easier.'}
  ],
  purpose: [
    {word:'to + verb', fr:'pour + verbe', ex:'We check the labels to avoid mistakes.'},
    {word:'in order to', fr:'afin de', ex:'We pack the meals carefully in order to save space.'},
    {word:'so that', fr:'afin que / pour que', ex:'We label each item so that the crew can identify it easily.'}
  ],
  condition: [
    {word:'if', fr:'si', ex:'If the delivery point changes, please call me.'},
    {word:'unless', fr:'sauf si / à moins que', ex:'We will deliver at 07:45 unless the time changes.'},
    {word:'in case', fr:'au cas où', ex:'Please send a phone number in case the driver has a problem.'}
  ],
  professional: [
    {word:'regarding', fr:'concernant', ex:'Regarding the updated order, I confirm the new details.'},
    {word:'concerning', fr:'concernant', ex:'Concerning the labels, we will write them in English.'},
    {word:'please note that', fr:'veuillez noter que', ex:'Please note that the aircraft has no microwave.'},
    {word:'could you please confirm...', fr:'pourriez-vous confirmer...', ex:'Could you please confirm the delivery point?'},
    {word:'as discussed', fr:'comme convenu / comme discuté', ex:'As discussed, the delivery is planned at 07:45.'},
    {word:'I look forward to your confirmation', fr:'dans l’attente de votre confirmation', ex:'I look forward to your confirmation.'}
  ]
};

const writingModels = {
  mainWriting: {
    a2: `Hello,\n\nThank you for your message.\nWe received the updated order.\nThe first meal is ketogenic.\nThe second meal has allergies.\nEach meal will have a clear English label.\nWe will deliver the food to the aircraft at 07:45.\nCould you confirm the exact delivery point?\n\nBest regards,`,
    a2plus: `Hello,\n\nThank you for your updated order.\nFirst, we will prepare the three crew meals. Then, we will check each label and every dietary requirement.\nSome meals are more difficult because there are allergies, but food safety is the most important point.\nWe will deliver the food to the aircraft at 07:45.\nCould you please confirm the exact delivery point at the airport?\n\nBest regards,`,
    b1: `Hello,\n\nThank you for sending the updated order.\nFirst, we will prepare the crew meals, then we will check each label carefully, especially for allergies and dietary requirements.\nThe second meal is more difficult because it requires special attention, but food safety is always the most important part of the process.\nPlease note that the aircraft has a small oven but no microwave, so we will adapt the packaging.\nWe will deliver the food to the aircraft at 07:45. Could you please confirm the exact delivery point and the contact person at the airport?\n\nBest regards,`
  }
};

const scenarios = [
  {
    title:'Scenario 1 — Missed call: message to your wife',
    context:'Your wife called you while you were preparing an order. Write a short message to explain the situation and say when you will call back.',
    requirements:'Use present continuous, past simple, will, because/so, and at least one question.',
    models:{
      a2:`Hi,\n\nSorry, I missed your call. I was busy with an order.\nI am checking the labels now.\nI will call you at 6 p.m.\nAre you at home?`,
      a2plus:`Hi,\n\nSorry, I missed your call because I was preparing an airline order.\nAt the moment, I am checking each label and some dietary requirements.\nI will finish soon, so I will call you at 6 p.m.\nAre you still at home?`,
      b1:`Hi,\n\nI’m sorry I missed your call. I was preparing an urgent airline order, and I couldn’t answer at that moment.\nI’m checking each label now because some meals have special requirements.\nI will call you as soon as I finish, probably at around 6 p.m.\nAre you at home, or should I call you later?`
    }
  },
  {
    title:'Scenario 2 — Ask for missing order information',
    context:'An airline client sent an order, but some information is missing. Write a professional message asking for details.',
    requirements:'Use any, some, to, at, could you please, and one connector of contrast.',
    models:{
      a2:`Hello,\n\nThank you for your order.\nWe have some information, but we do not have any delivery point.\nCould you please send the delivery point at the airport?\nWe will send the confirmation to you today.\n\nBest regards,`,
      a2plus:`Hello,\n\nThank you for your order.\nWe received some details, but we do not have any information about the exact delivery point.\nCould you please confirm where the driver should go at the airport?\nAfter that, I will send the final confirmation to you.\n\nBest regards,`,
      b1:`Hello,\n\nThank you for sending the order.\nWe have received the main details; however, we do not have any information about the exact delivery point at the airport.\nCould you please confirm where the driver should deliver the food and whether there are any last-minute dietary requirements?\nAs soon as I receive your answer, I will send the final confirmation to you.\n\nBest regards,`
    }
  },
  {
    title:'Scenario 3 — Explain a delivery delay',
    context:'There is traffic near the airport. Write a professional message to explain the delay and propose a solution.',
    requirements:'Use at, to, because, however, will, and a comparison.',
    models:{
      a2:`Hello,\n\nThe driver is near the airport, but there is traffic.\nThe delivery will be a little late.\nWe will go to the gate as soon as possible.\nCould you confirm the contact person?\n\nBest regards,`,
      a2plus:`Hello,\n\nThe driver is at the airport area, but there is a lot of traffic near the gate.\nThe delivery is more difficult today because of the traffic.\nHowever, we will deliver the food to the aircraft as soon as possible.\nCould you please confirm the contact person at the airport?\n\nBest regards,`,
      b1:`Hello,\n\nI would like to inform you that the driver is already at the airport area. However, there is a lot of traffic near the gate, so the delivery may be slightly later than planned.\nThis delivery is more difficult than usual, but we are doing everything possible to bring the food to the aircraft quickly.\nCould you please confirm the best contact person at the airport in case the driver needs assistance?\n\nBest regards,`
    }
  },
  {
    title:'Scenario 4 — Confirm packaging instructions',
    context:'The aircraft has a small oven and no microwave. Write a message confirming packaging and labels.',
    requirements:'Use each, every, all the, at least one ordinal, and in order to.',
    models:{
      a2:`Hello,\n\nThank you for the information.\nThe aircraft has a small oven and no microwave.\nEach hot meal will be in an oven-safe container.\nAll the labels will be in English.\nThe first tray is for the crew.\n\nBest regards,`,
      a2plus:`Hello,\n\nThank you for the equipment information.\nThe aircraft has a small oven and no microwave, so each hot meal will be packed in an oven-safe container.\nAll the labels will be written in English in order to help the crew identify every item.\nThe first tray is for the crew, and the second tray contains the special meals.\n\nBest regards,`,
      b1:`Hello,\n\nThank you for confirming the aircraft equipment.\nAs discussed, the aircraft has a small oven and no microwave. Therefore, each hot meal will be packed in an oven-safe container in order to make reheating easier for the crew.\nAll the labels will be written clearly in English, and every special requirement will be identified separately.\nThe first tray will include the standard crew meal, and the second tray will include the special meals.\n\nBest regards,`
    }
  },
  {
    title:'Scenario 5 — Your work today',
    context:'Write a short update about your day at work: what you did, what you are doing now and what you will do next.',
    requirements:'Use first, then, after that, now, will, and one quantity word.',
    models:{
      a2:`Today, I have a lot of work.\nFirst, I received the orders.\nThen, I checked the labels.\nNow, I am preparing the meals.\nAfter that, I will send the confirmation.`,
      a2plus:`Today, I have a lot of work because there are several airline orders.\nFirst, I received the information from the client.\nThen, I checked each label and every special requirement.\nNow, I am preparing the meals.\nAfter that, I will send the confirmation to the client.`,
      b1:`Today is a busy day because we have a lot of airline catering work.\nFirst, I received the updated orders from the client. Then, I checked each label carefully, especially the allergy information.\nAt the moment, I am preparing the meals with my team.\nAfter that, I will send the confirmation to the client and organise the delivery to the aircraft.\nOverall, the order is more difficult than usual, but everything is under control.`
    }
  },
  {
    title:'Scenario 6 — Personal and professional journey',
    context:'Write a short paragraph about your past, present and future. This prepares the next lesson.',
    requirements:'Use past simple, present simple, present continuous, going to/will, and at least three connectors.',
    models:{
      a2:`In the past, I worked in restaurants.\nToday, I have a catering business.\nI prepare food for airline clients.\nAt the moment, I am improving my English.\nIn the future, I am going to move to Lisbon.\nI will use English for my work.`,
      a2plus:`In the past, I worked in restaurants and developed my experience as a chef.\nToday, I run a catering business and prepare food for airline clients.\nAt the moment, I am improving my English because I want to communicate more clearly.\nIn the future, I am going to move to Lisbon, and I will continue to work with airline clients.`,
      b1:`In the past, I worked in restaurants and developed strong experience as a chef and business owner.\nToday, I run a catering business and provide meals for airline clients, which requires organisation, precision and food safety.\nAt the moment, I am improving my English because I want to communicate more clearly with clients and partners.\nIn the future, I am going to move to Lisbon, and I would like to develop more direct relationships with airline clients.\nOverall, English will be an important tool for my personal and professional projects.`
    }
  }
];

function renderQuiz(name){
  const zone = document.querySelector(`[data-quiz="${name}"]`);
  if(!zone) return;
  zone.innerHTML = '';
  quizzes[name].forEach((item, idx)=>{
    const card = document.createElement('article');
    card.className = 'quiz-card';
    card.innerHTML = `<h4>${idx+1}. ${item.title}</h4><p>${item.q}</p><div class="option-list"></div><button class="hint-btn" type="button">💡 Hint</button><div class="hint">${item.hint}</div><div class="feedback"></div>`;
    const list = $('.option-list', card);
    shuffle(item.options).forEach(opt=>{
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'option';
      btn.textContent = opt;
      btn.addEventListener('click',()=>{
        $$('.option', card).forEach(b=>b.disabled=true);
        const fb = $('.feedback', card);
        if(opt === item.answer){
          btn.classList.add('correct');
          fb.textContent = 'Correct ✅';
          fb.className = 'feedback good';
        }else{
          btn.classList.add('wrong');
          const correct = $$('.option', card).find(b=>b.textContent === item.answer);
          if(correct) correct.classList.add('correct');
          fb.textContent = `Not this one. Correct answer: ${item.answer}`;
          fb.className = 'feedback bad';
        }
      });
      list.appendChild(btn);
    });
    $('.hint-btn', card).addEventListener('click',()=> $('.hint', card).classList.toggle('show'));
    zone.appendChild(card);
  });
}

function renderVocab(targetId, data, key){
  const target = document.getElementById(targetId);
  if(!target) return;
  target.innerHTML = '';
  data[key].forEach(item=>{
    const card = document.createElement('article');
    card.className = 'vocab-card';
    card.innerHTML = `<h4>${item.word}</h4><span class="translation">${item.fr}</span><p>${item.ex}</p>`;
    target.appendChild(card);
  });
}

function highlightModel(text){
  const terms = ['First','Then','After that','However','because','so','each','every','some','any','a lot of','many','much','to the aircraft','at 07:45','at the airport','more difficult','the most important','Could you please'];
  let out = text;
  terms.sort((a,b)=>b.length-a.length).forEach(t=>{
    const escaped = t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    out = out.replace(new RegExp(escaped,'g'), `<span class="highlight">${t}</span>`);
  });
  return out;
}

function renderMainWriting(level='a2'){
  const box = $('#mainWritingModel');
  if(!box) return;
  const names = {a2:'Simple A2', a2plus:'Strong A2+', b1:'Early B1'};
  box.innerHTML = `<h3>${names[level]}</h3><div class="email-box">${highlightModel(writingModels.mainWriting[level])}</div>`;
}

function renderScenarios(){
  const list = $('#scenarioList');
  if(!list) return;
  list.innerHTML = '';
  scenarios.forEach((s, i)=>{
    const card = document.createElement('article');
    card.className = 'scenario-card';
    card.innerHTML = `
      <h3>${s.title}</h3>
      <p class="scenario-context">${s.context}</p>
      <div class="requirements"><strong>Include:</strong> ${s.requirements}</div>
      <div class="model-levels">
        <button class="small-model-btn active" data-level="a2">A2 model</button>
        <button class="small-model-btn" data-level="a2plus">A2+ model</button>
        <button class="small-model-btn" data-level="b1">B1 model</button>
      </div>
      <div class="scenario-model">${highlightModel(s.models.a2)}</div>
    `;
    $$('.small-model-btn', card).forEach(btn=>{
      btn.addEventListener('click',()=>{
        $$('.small-model-btn', card).forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        $('.scenario-model', card).innerHTML = highlightModel(s.models[btn.dataset.level]);
      });
    });
    list.appendChild(card);
  });
}

function bindUI(){
  $('#toggleFrench')?.addEventListener('click',()=>{
    document.body.classList.toggle('show-fr');
    $('#toggleFrench').textContent = document.body.classList.contains('show-fr') ? '🇫🇷 Hide French help' : '🇫🇷 Show French help';
  });
  $('#resetAll')?.addEventListener('click',()=>{
    Object.keys(quizzes).forEach(renderQuiz);
    $$('.answer').forEach(a=>a.classList.add('hidden'));
    window.scrollTo({top:0,behavior:'smooth'});
  });
  $('#comparisonCategory')?.addEventListener('change', e=>renderVocab('comparisonVocab', comparisonVocab, e.target.value));
  $('#connectorCategory')?.addEventListener('change', e=>renderVocab('connectorVocab', connectorVocab, e.target.value));
  $$('.model-tab').forEach(btn=>{
    btn.addEventListener('click',()=>{
      $$('.model-tab').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      renderMainWriting(btn.dataset.level);
    });
  });
  document.addEventListener('click', (e)=>{
    if(e.target.classList.contains('show-answer')){
      const ans = e.target.parentElement.querySelector('.answer');
      if(ans) ans.classList.toggle('hidden');
    }
  });
}

document.addEventListener('DOMContentLoaded',()=>{
  Object.keys(quizzes).forEach(renderQuiz);
  renderVocab('comparisonVocab', comparisonVocab, 'short');
  renderVocab('connectorVocab', connectorVocab, 'sequence');
  renderMainWriting('a2');
  renderScenarios();
  bindUI();
});
