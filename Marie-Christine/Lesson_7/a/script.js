'use strict';

const STORAGE_KEY = 'se_mc_lesson7_conversation_builder_v700';
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const escapeHtml = (s='') => String(s).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const shuffle = arr => { const a=[...arr]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; };
const wordCount = txt => (txt.trim().match(/\b[\w’'-]+\b/g)||[]).length;

let state = {
  answers:{}, oral:{}, writing:{}, chainDraft:'', notes:'', trainerComments:'',
  speakingEval:'', writingEval:'', usefulness:'', clarity:'', confidence:'',
  fontScale:1, frHelp:true, voice:'en-GB', speed:'0.92'
};
try { state = {...state, ...(JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}'))}; } catch(e) {}
function saveState(){ try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }catch(e){} }

const groups = {};
function q(id,prompt,options,answer,hint){ return {id,prompt,options,answer,hint}; }

groups.formula = {
  label:'Conversation formula', container:'formulaQuiz', score:'formulaScore', total:'formulaTotal',
  items:[
    q('f1','“Do you like travelling?” — You answer: “Yes, I do.” What is the best next move?',['Because I enjoy discovering new places.','Yes.','Travelling.'],'Because I enjoy discovering new places.','After the direct answer, add a reason.'),
    q('f2','“I spent the weekend with my family.” Which detail develops the answer?',['We had lunch together and then went for a long walk.','Family is a noun.','Yes, weekend.'],'We had lunch together and then went for a long walk.','Add something concrete that happened.'),
    q('f3','Someone says: “I’m going to Ireland next month.” Choose a natural reaction.',['That sounds exciting!','Ireland is in Europe.','I went yesterday tomorrow.'],'That sounds exciting!','React to the person before changing the subject.'),
    q('f4','After explaining your own preference, how can you return the conversation?',['What about you?','Because.','Yes, I prefer.'],'What about you?','A question back gives the other person a turn.'),
    q('f5','Which response follows Answer → Reason → Detail?',['I prefer smaller hotels because they feel more personal. For example, I like talking to the owners.','Smaller hotels.','Because personal hotel.'],'I prefer smaller hotels because they feel more personal. For example, I like talking to the owners.','Look for a clear answer, a reason, and an example.'),
    q('f6','Which sentence best adds a contrast?',['The town was crowded, but we still enjoyed the atmosphere.','The town was crowded because crowded.','The town was crowded and because.'],'The town was crowded, but we still enjoyed the atmosphere.','Use but/although/however for contrast.'),
    q('f7','You need a little thinking time. What sounds natural?',['That’s a good question. Let me think for a moment.','I don’t know English.','Wait me.'],'That’s a good question. Let me think for a moment.','Use a complete phrase that keeps the interaction comfortable.'),
    q('f8','Which ending best keeps the conversation alive?',['Have you ever had a similar experience?','That is all.','Finished.'],'Have you ever had a similar experience?','Ask about the other person’s experience.')
  ]
};

groups.vocab = {
  label:'Vocabulary check', container:'vocabQuiz', score:'vocabScore', total:'vocabTotal',
  items:[
    q('v1','You want to show interest after someone tells you good news.',['That sounds wonderful!','Never mind.','I have no idea.'],'That sounds wonderful!','Choose a positive reaction.'),
    q('v2','You need time before answering a difficult question.',['Let me think for a moment.','Tell me again yesterday.','It depends because no.'],'Let me think for a moment.','Use a thinking-time phrase.'),
    q('v3','You want to give one concrete example.',['For example,…','However,…','Anyway no.'],'For example,…','This phrase introduces an example.'),
    q('v4','You want the other person to repeat more slowly.',['Could you say that again a little more slowly?','Tell again slow.','Repeat you.'],'Could you say that again a little more slowly?','Use could you + base verb for a polite request.'),
    q('v5','You want to express a personal preference.',['I tend to prefer…','I am preference…','I have prefer…'],'I tend to prefer…','This is a natural B1 preference phrase.'),
    q('v6','You want to soften a different opinion.',['I see what you mean, but…','You are wrong.','No, impossible.'],'I see what you mean, but…','Acknowledge the other idea first.'),
    q('v7','You want to invite the other person to speak.',['What about you?','And me?','Tell your.'],'What about you?','This is a simple, natural hand-back.'),
    q('v8','You did not understand one word.',['What does “platform” mean?','What means platform?','Platform what?'],'What does “platform” mean?','Use What does + word + mean?')
  ]
};

groups.connector = {
  label:'Connectors', container:'connectorQuiz', score:'connectorScore', total:'connectorTotal',
  items:[
    q('c1','I enjoy travelling ___ I like discovering new cultures.',['because','however','so'],'because','The second idea gives the reason.'),
    q('c2','It started raining, ___ we went into a café.',['so','because','although'],'so','The second action is the result.'),
    q('c3','The hotel was comfortable, ___ it was quite far from the centre.',['but','because','for example'],'but','The ideas contrast.'),
    q('c4','I enjoy historical places. ___, I love visiting old castles.',['For example','However','So'],'For example','The second sentence illustrates the first.'),
    q('c5','___ it was cold, we spent most of the day outside.',['Although','Because','So'],'Although','Cold weather contrasts with staying outside.'),
    q('c6','I prefer walking holidays, ___ my husband prefers relaxing by the sea.',['whereas','so','because'],'whereas','Compare two different preferences.'),
    q('c7','We visited the market and we ___ had lunch nearby.',['also','however','although'],'also','You are adding another activity.'),
    q('c8','The train was delayed. ___, we arrived in time for dinner.',['However','Because','For example'],'However','The result is surprising compared with the first sentence.'),
    q('c9','First we visited the museum. ___, we walked to the old town.',['Then','Because','Although'],'Then','This is sequence.'),
    q('c10','I booked early ___ I wanted a quiet room.',['because','whereas','however'],'because','The second part explains why.')
  ]
};

groups.verb1 = {
  label:'Verb contrasts A', container:'verb1Quiz', score:'verb1Score', total:'verb1Total',
  items:[
    q('a1','She ___ me that the train was late.',['told','said','spoke'],'told','Tell normally takes a person: told me.'),
    q('a2','She ___ that the train was late.',['said','told','talked'],'said','There is no person directly after the verb.'),
    q('a3','Do you ___ English with your grandchildren?',['speak','talk','say'],'speak','Use speak + language.'),
    q('a4','We ___ about our holiday for an hour.',['talked','spoke English','said'],'talked','Use talk about + topic.'),
    q('a5','I need to ___ a decision today.',['make','do','say'],'make','We make a decision.'),
    q('a6','I usually ___ some exercise in the morning.',['do','make','tell'],'do','Exercise is an activity.'),
    q('a7','Please ___ at this map.',['look','see','watch'],'look','Direct your eyes: look at.'),
    q('a8','From the hotel, you can ___ the cathedral.',['see','watch','look'],'see','Notice with your eyes: see.'),
    q('a9','We ___ a documentary last night.',['watched','looked','saw at'],'watched','Watch moving images for a period.'),
    q('a10','Can you ___ hello to your family for me?',['say','tell','talk'],'say','The expression is say hello.'),
    q('a11','He ___ a funny story at dinner.',['told','said','spoke'],'told','The collocation is tell a story.'),
    q('a12','I need to ___ some research before the trip.',['do','make','speak'],'do','The collocation is do research.')
  ]
};

groups.verb2 = {
  label:'Verb contrasts B', container:'verb2Quiz', score:'verb2Score', total:'verb2Total',
  items:[
    q('b1','We are going to ___ to Italy in October.',['go','come','bring'],'go','Movement to another place from here: go.'),
    q('b2','Can you ___ here for a moment, please?',['come','go','take'],'come','Movement toward the speaker: come.'),
    q('b3','Please ___ your passport with you when you come here.',['bring','take','borrow'],'bring','Carry something toward the destination/speaker.'),
    q('b4','It may rain. ___ an umbrella with you.',['Take','Bring here','Lend'],'Take','Carry something from here to another place.'),
    q('b5','I ___ her very well; we have been friends for years.',['know','meet','remember to'],'know','Already be familiar with someone.'),
    q('b6','I first ___ her in Montreal.',['met','knew','reminded'],'met','Meet = encounter a person, often first time.'),
    q('b7','I still ___ our family trip to Iceland very clearly.',['remember','remind','lend'],'remember','The memory is in your own mind.'),
    q('b8','Please ___ me to buy the tickets tomorrow.',['remind','remember','borrow'],'remind','Another person helps you remember.'),
    q('b9','Can I ___ your pen for a minute?',['borrow','lend','bring'],'borrow','You receive it temporarily.'),
    q('b10','Can you ___ me your pen for a minute?',['lend','borrow','take'],'lend','The other person gives it temporarily.'),
    q('b11','I’m ___ to the station now.',['going','coming from you','bringing'],'going','Movement to a different location.'),
    q('b12','Don’t forget to ___ a warm coat to Ireland.',['take','borrow','meet'],'take','Carry it with you to the destination.')
  ]
};

groups.tense = {
  label:'Tenses in conversation', container:'tenseQuiz', score:'tenseScore', total:'tenseTotal',
  items:[
    q('t1','“What do you usually do on holiday?”',['I usually walk a lot and visit local places.','I am usually walked a lot.','I have going every holiday.'],'I usually walk a lot and visit local places.','Habit → present simple.'),
    q('t2','“What did you do last weekend?”',['I went to the coast.','I have gone to the coast last weekend.','I go to the coast last weekend.'],'I went to the coast.','Finished time “last weekend” → past simple.'),
    q('t3','“Have you ever been to Ireland?”',['Yes, I have. I’ve been there before.','Yes, I did been.','Yes, I went ever.'],'Yes, I have. I’ve been there before.','Life experience, no finished time → present perfect.'),
    q('t4','“What are you doing on Friday evening?”',['I’m meeting friends for dinner.','I meet friends yesterday.','I will meeting friends.'],'I’m meeting friends for dinner.','Fixed arrangement → present continuous.'),
    q('t5','“What are you going to do in October?”',['I’m going to travel to Italy.','I going travel Italy.','I travelled next October.'],'I’m going to travel to Italy.','Decided plan → be going to + base verb.'),
    q('t6','“What do you think the weather will be like?”',['I think it will be cooler.','I think it is cooler yesterday.','I think it going cooler.'],'I think it will be cooler.','Prediction → will.'),
    q('t7','Which question asks about a life experience?',['Have you ever tried Irish stew?','Did you ever tried yesterday?','Do you went before?'],'Have you ever tried Irish stew?','Have you ever + past participle.'),
    q('t8','Which question asks about a finished trip?',['Where did you stay in Scotland last year?','Where have you stayed last year?','Where do you stayed last year?'],'Where did you stay in Scotland last year?','Finished time → did + base verb.'),
    q('t9','Which negative sentence is correct?',['I didn’t enjoy the hotel very much.','I didn’t enjoyed the hotel.','I not enjoyed the hotel.'],'I didn’t enjoy the hotel very much.','After didn’t, use the base verb.'),
    q('t10','Which present-perfect negative is correct?',['I haven’t visited that part of Ireland yet.','I didn’t visited it yet.','I haven’t visit it yet.'],'I haven’t visited that part of Ireland yet.','have not + past participle.'),
    q('t11','Which sentence describes a current temporary action?',['I’m preparing my next trip at the moment.','I prepare yesterday at the moment.','I have prepare now.'],'I’m preparing my next trip at the moment.','At the moment → present continuous.'),
    q('t12','Which future question is correct?',['When are you going to leave?','When you going to leave?','When are you going leave?'],'When are you going to leave?','Wh-word + be + subject + going to + base verb?')
  ]
};

groups.reaction = {
  label:'Natural reactions', container:'reactionQuiz', score:'reactionScore', total:'reactionTotal',
  items:[
    q('r1','“We finally found our lost suitcase.”',['What a relief!','That is suitcase.','No problem for me.'],'What a relief!','React to the good resolution after a stressful situation.'),
    q('r2','“I’m starting a new course next week.”',['That sounds interesting!','I didn’t ask.','Course is noun.'],'That sounds interesting!','Show positive interest.'),
    q('r3','“My train was cancelled and I waited three hours.”',['That sounds really frustrating.','Great!','I am train.'],'That sounds really frustrating.','Show empathy.'),
    q('r4','“I’ve never travelled alone.”',['Really? Would you like to?','No alone.','Never is adverb.'],'Really? Would you like to?','React and follow up.'),
    q('r5','You need time to answer.',['That’s a good question. Let me think.','Question good wait.','I stop.'],'That’s a good question. Let me think.','Use a natural thinking-time phrase.'),
    q('r6','Someone explains a different preference.',['I see what you mean.','You are false.','No.'],'I see what you mean.','Acknowledge the other person.'),
    q('r7','“We’re going to Alsace in December.”',['How lovely! It should be beautiful at that time of year.','December is month.','Okay end.'],'How lovely! It should be beautiful at that time of year.','React and add a relevant comment.'),
    q('r8','“I don’t really like crowded cities.”',['I understand. I sometimes feel the same way.','Wrong opinion.','Crowded no.'],'I understand. I sometimes feel the same way.','Show understanding without forcing agreement.')
  ]
};

groups.follow = {
  label:'Follow-up questions', container:'followQuiz', score:'followScore', total:'followTotal',
  items:[
    q('u1','“I went to Cork last year.”',['What did you like most about Cork?','What is your name?','Do you like Tuesday?'],'What did you like most about Cork?','Reuse the detail “Cork”.'),
    q('u2','“I’m going to Italy in October.”',['Which part of Italy are you going to visit?','Did you go yesterday?','Do you Italy?'],'Which part of Italy are you going to visit?','Ask for more detail about the plan.'),
    q('u3','“I prefer travelling by train.”',['What do you like about travelling by train?','Where is your car yesterday?','Train yes?'],'What do you like about travelling by train?','Ask for the reason behind the preference.'),
    q('u4','“My granddaughter loves art.”',['What kind of art does she like?','How old is the train?','Do she loves?'],'What kind of art does she like?','Develop the detail “art”.'),
    q('u5','“We stayed in a small village.”',['What was the village like?','What village stay?','Are you village?'],'What was the village like?','Ask for a description.'),
    q('u6','“I’ve been to Scotland several times.”',['What keeps bringing you back?','When did you went ever?','Scotland how many is?'],'What keeps bringing you back?','Ask about the reason for repeated visits.'),
    q('u7','“The restaurant was expensive, but excellent.”',['What did you have there?','Are restaurants expensive noun?','Why excellent yesterday tomorrow?'],'What did you have there?','Continue with a relevant detail.'),
    q('u8','“I’m learning English to communicate more easily.”',['When do you find English most useful?','Why language is word?','Do English?'],'When do you find English most useful?','Ask about the real-life context.')
  ]
};

groups.reference = {
  label:'Reference words', container:'referenceQuiz', score:'referenceScore', total:'referenceTotal',
  items:[
    q('p1','The hotel was small, but ___ was very comfortable.',['it','they','one'],'it','Hotel = one thing.'),
    q('p2','The restaurants were busy, but ___ were excellent.',['they','it','one'],'they','Restaurants = plural.'),
    q('p3','We missed the train. ___ was very stressful.',['That','They','Ones'],'That','That can refer to the whole situation.'),
    q('p4','I prefer the smaller suitcase to the large ___.',['one','it are','they'],'one','One replaces a singular countable noun.'),
    q('p5','These shoes are more comfortable than the black ___.',['ones','one','it'],'ones','Shoes = plural, so use ones.'),
    q('p6','I loved the old town. ___ had a wonderful atmosphere.',['It','They','One'],'It','Old town = singular.'),
    q('p7','The children enjoyed the museums because ___ were interactive.',['they','it','one'],'they','Museums = plural.'),
    q('p8','We changed hotels at the last minute. ___ actually worked out well.',['That','Ones','They hotel'],'That','That refers to the change of hotels.')
  ]
};

const listeningAItems = [
  q('la1','Why did they go to the coast?',['Because the weather was beautiful.','Because the train was late.','Because they needed a hotel.'],'Because the weather was beautiful.','Listen for the reason introduced by “because”.'),
  q('la2','What did they do after lunch?',['They walked along the beach.','They went shopping.','They drove to Scotland.'],'They walked along the beach.','Listen for “then”.'),
  q('la3','How does speaker A react?',['“That sounds nice.”','“That is wrong.”','“I don’t care.”'],'“That sounds nice.”','Identify the reaction phrase.'),
  q('la4','How does speaker B return the conversation?',['“What did you do?”','“Weekend finished.”','“I went home.”'],'“What did you do?”','Listen for the question back.')
];
const listeningBItems = [
  q('lb1','Which two trips are mentioned?',['Ireland and Italy.','Scotland and Boston.','France and Canada.'],'Ireland and Italy.','Listen for the destinations.'),
  q('lb2','Why is the speaker looking forward to both trips?',['Because they will be very different.','Because they are free.','Because they are the same.'],'Because they will be very different.','Listen for “because”.'),
  q('lb3','Which connector compares Ireland and Italy?',['whereas','because','so'],'whereas','It introduces contrast.'),
  q('lb4','What follow-up question does speaker A ask?',['Which one are you most excited about?','What is your address?','Did you work yesterday?'],'Which one are you most excited about?','It develops the topic of the two trips.')
];
groups.listeningA = {label:'Listening A',container:'listeningAQuiz',score:null,total:null,items:listeningAItems};
groups.listeningB = {label:'Listening B',container:'listeningBQuiz',score:null,total:null,items:listeningBItems};

groups.reading = {
  label:'Reading strategy', container:'readingQuiz', score:'readingScore', total:'readingTotal',
  items:[
    q('rd1','Why does Alex prefer the countryside?',['Because he likes quiet places and long walks.','Because cities have more restaurants.','Because he never travels.'],'Because he likes quiet places and long walks.','Find the reason after “because”.'),
    q('rd2','What example does Alex give?',['A stay in a small village near the mountains.','A business meeting.','A flight delay.'],'A stay in a small village near the mountains.','Look for “For example”.'),
    q('rd3','Which word introduces Alex’s contrasting idea about cities?',['However','Because','First'],'However','The idea changes direction.'),
    q('rd4','How does Emma react before asking a question?',['“I know what you mean.”','“You are wrong.”','“No cities.”'],'“I know what you mean.”','This acknowledges Alex’s point.'),
    q('rd5','What tense does Emma use in “Have you ever combined…?”',['Present perfect.','Past simple.','Present continuous.'],'Present perfect.','It asks about life experience.'),
    q('rd6','Why is Alex’s final question useful?',['It returns the conversation to Emma.','It ends the conversation immediately.','It corrects Emma’s grammar.'],'It returns the conversation to Emma.','A question back keeps the exchange balanced.'),
    q('rd7','Which phrase is a reason?',['because I like quiet places','for a few days','last year'],'because I like quiet places','Because introduces a reason.'),
    q('rd8','Which sentence is the best summary of Alex’s style?',['He answers, gives reasons and examples, contrasts ideas, then asks back.','He gives only one-word answers.','He asks questions without answering.'],'He answers, gives reasons and examples, contrasts ideas, then asks back.','Look at the overall communication pattern.')
  ]
};

groups.upgrade = {
  label:'B1 upgrade clinic', container:'upgradeQuiz', score:'upgradeScore', total:'upgradeTotal',
  items:[
    q('g1','Question: “Do you like visiting museums?”',['Yes, especially small local museums, because I often learn something unexpected. What about you?','Yes.','Museum is interesting because yes.'],'Yes, especially small local museums, because I often learn something unexpected. What about you?','Strong response = answer + detail/reason + question back.'),
    q('g2','Question: “How was your weekend?”',['It was really nice. We had lunch with family and then went for a walk because the weather was good.','Good.','Weekend was do walk.'],'It was really nice. We had lunch with family and then went for a walk because the weather was good.','Look for a clear past-tense mini-story.'),
    q('g3','Question: “Which do you prefer, trains or planes?”',['I usually prefer trains because the journey feels more relaxed, although flying is faster for long distances.','Train.','I prefer trains because planes train.'],'I usually prefer trains because the journey feels more relaxed, although flying is faster for long distances.','A B1 answer can include reason + contrast.'),
    q('g4','Someone says: “I’ve just come back from Ireland.”',['Really? That sounds lovely. What was your favourite part?','Ireland.','Where yesterday tomorrow?'],'Really? That sounds lovely. What was your favourite part?','React first, then follow up.'),
    q('g5','You do not know a word.',['I’m not sure what that word means. Could you explain it?','I no understand word.','Stop English.'],'I’m not sure what that word means. Could you explain it?','Use a full clarification strategy.'),
    q('g6','You disagree politely.',['I see what you mean, but I tend to prefer quieter places.','No, you’re wrong.','Not agree.'],'I see what you mean, but I tend to prefer quieter places.','Acknowledge + contrast + your view.'),
    q('g7','You need time before answering.',['That’s a good question. Let me think for a moment.','Wait.','No answer.'],'That’s a good question. Let me think for a moment.','Gain time without breaking the conversation.'),
    q('g8','Question: “Have you ever travelled alone?”',['No, I haven’t, but I think I’d like to try it one day because it could be a different experience. Have you?','No.','I didn’t never travel.'],'No, I haven’t, but I think I’d like to try it one day because it could be a different experience. Have you?','Correct present perfect + development + question back.')
  ]
};

groups.final = {
  label:'Final objective check', container:'finalQuiz', score:'finalScore', total:'finalTotal',
  items:[
    q('z1','She ___ me that she was arriving later.',['told','said','talked'],'told','Tell + person.'),
    q('z2','I need to ___ a reservation before Friday.',['make','do','speak'],'make','Make a reservation.'),
    q('z3','“Have you ever been to Italy?”',['Yes, I have. I’ve been there twice.','Yes, I did went.','Yes, I have been last October.'],'Yes, I have. I’ve been there twice.','Life experience with no finished time.'),
    q('z4','The hotel was expensive, ___ it was in a perfect location.',['but','because','so'],'but','Contrast.'),
    q('z5','Someone says: “I’m moving next month.”',['Really? How are you feeling about it?','Move is verb.','Okay bye.'],'Really? How are you feeling about it?','Reaction + relevant follow-up.'),
    q('z6','Can I ___ your charger for ten minutes?',['borrow','lend','take you'],'borrow','You receive it temporarily.'),
    q('z7','Please ___ me to send the email tomorrow.',['remind','remember','know'],'remind','Another person helps you remember.'),
    q('z8','Which is the best extended answer?',['I prefer travelling in spring because the weather is usually mild and places are less crowded. For example, walking is much more pleasant.','Spring.','I preference spring because mild.'],'I prefer travelling in spring because the weather is usually mild and places are less crowded. For example, walking is much more pleasant.','Answer + reason + example.'),
    q('z9','“What did you do last Saturday?”',['We visited friends and had lunch together.','We have visited friends last Saturday.','We visit last Saturday.'],'We visited friends and had lunch together.','Finished past time → past simple.'),
    q('z10','“What are you doing this Friday?”',['I’m meeting my daughter for lunch.','I met my daughter this Friday future.','I have meet Friday.'],'I’m meeting my daughter for lunch.','Arrangement → present continuous.'),
    q('z11','I can ___ the mountains from the window.',['see','watch','look at to'],'see','Notice with your eyes.'),
    q('z12','We ___ about the trip for a long time.',['talked','said','told about'],'talked','Talk about a topic.'),
    q('z13','The two restaurants were good, but the smaller ___ was quieter.',['one','it','they'],'one','Replace singular countable noun.'),
    q('z14','You need thinking time.',['Let me think for a moment.','Wait me.','I no know now.'],'Let me think for a moment.','Natural conversation strategy.'),
    q('z15','Best question back after describing a holiday:',['What kind of holidays do you enjoy?','Holiday finish?','Do you yesterday?'],'What kind of holidays do you enjoy?','Relevant open question.')
  ]
};

const vocab = [
  ['Conversation starters','💬','How have you been?','Comment allez-vous ? / Comment ça va depuis ?','A friendly way to ask how someone has been recently.','How have you been? I haven’t seen you for a while.'],
  ['Conversation starters','💬','What have you been up to?','Qu’est-ce que vous avez fait dernièrement ?','An informal way to ask about recent activities.','What have you been up to since we last spoke?'],
  ['Conversation starters','💬','How did it go?','Comment ça s’est passé ?','A way to ask about the result or experience of something.','You had an appointment yesterday. How did it go?'],
  ['Conversation starters','💬','What are your plans?','Quels sont vos projets ?','A question about future intentions or arrangements.','What are your plans for the weekend?'],
  ['Conversation starters','💬','Have you ever…?','Avez-vous déjà… ?','A present-perfect question about life experience.','Have you ever travelled to Ireland in winter?'],
  ['Conversation starters','💬','What do you think about…?','Que pensez-vous de… ?','A question asking for an opinion.','What do you think about travelling by train?'],

  ['Reactions','✨','That sounds lovely!','Ça a l’air très sympa !','A warm positive reaction to someone’s news or plan.','You’re spending the weekend by the sea? That sounds lovely!'],
  ['Reactions','✨','Really?','Vraiment ?','A short reaction showing surprise or interest.','Really? I didn’t know you had lived there.'],
  ['Reactions','✨','That’s interesting.','C’est intéressant.','A neutral positive reaction that encourages the speaker.','That’s interesting. How did you discover that place?'],
  ['Reactions','✨','What a relief!','Quel soulagement !','A reaction when a problem has finally been solved.','You found your passport? What a relief!'],
  ['Reactions','✨','That sounds difficult.','Ça a l’air difficile.','An empathetic reaction to a difficult experience.','You waited three hours at the airport? That sounds difficult.'],
  ['Reactions','✨','I know what you mean.','Je vois ce que vous voulez dire.','A phrase showing that you understand or share a feeling.','I know what you mean. Crowded places can be tiring.'],

  ['Opinions & preferences','🗣️','I tend to prefer…','J’ai tendance à préférer…','A natural way to express a general preference.','I tend to prefer smaller towns because they feel more relaxed.'],
  ['Opinions & preferences','🗣️','In my experience…','D’après mon expérience…','A phrase introducing an opinion based on personal experience.','In my experience, travelling early in the morning is less stressful.'],
  ['Opinions & preferences','🗣️','As far as I’m concerned…','En ce qui me concerne…','A B1 phrase introducing your personal view.','As far as I’m concerned, the location is more important than the size of the hotel.'],
  ['Opinions & preferences','🗣️','I’d rather…','Je préférerais…','A phrase for choosing one option over another.','I’d rather take the train than drive in heavy traffic.'],
  ['Opinions & preferences','🗣️','It depends.','Ça dépend.','A useful response when your answer changes according to the situation.','It depends. For a short journey, I prefer the train.'],
  ['Opinions & preferences','🗣️','I see what you mean, but…','Je vois ce que vous voulez dire, mais…','A polite way to introduce a different opinion.','I see what you mean, but I prefer having a clear plan.'],

  ['Reasons, examples & links','🔗','because','parce que','A connector introducing a reason.','I booked early because I wanted a quiet room.'],
  ['Reasons, examples & links','🔗','so','donc / alors','A connector introducing a result.','The weather was good, so we stayed outside.'],
  ['Reasons, examples & links','🔗','for example','par exemple','A phrase introducing a concrete example.','I like local food. For example, I always visit markets when I travel.'],
  ['Reasons, examples & links','🔗','however','cependant','A connector introducing contrast between sentences.','The room was small. However, it was very comfortable.'],
  ['Reasons, examples & links','🔗','although','bien que / même si','A connector joining two contrasting ideas in one sentence.','Although it was raining, we went for a walk.'],
  ['Reasons, examples & links','🔗','whereas','tandis que','A connector comparing two contrasting facts.','I like active holidays, whereas my husband prefers relaxing.'],

  ['Clarifying & thinking time','🛟','Let me think for a moment.','Laissez-moi réfléchir un instant.','A phrase to gain time while keeping the conversation flowing.','That’s a good question. Let me think for a moment.'],
  ['Clarifying & thinking time','🛟','Could you say that again?','Pourriez-vous répéter ?','A polite request for repetition.','Sorry, could you say that again, please?'],
  ['Clarifying & thinking time','🛟','Could you speak a little more slowly?','Pourriez-vous parler un peu plus lentement ?','A polite request to reduce speaking speed.','Could you speak a little more slowly, please?'],
  ['Clarifying & thinking time','🛟','What does … mean?','Que veut dire… ?','A question asking for the meaning of a word or phrase.','What does “platform change” mean?'],
  ['Clarifying & thinking time','🛟','Do you mean…?','Vous voulez dire… ?','A question used to check your understanding.','Do you mean the train leaves at ten fifteen?'],
  ['Clarifying & thinking time','🛟','I’m not sure I understood.','Je ne suis pas sûre d’avoir compris.','A polite way to signal a comprehension problem.','I’m not sure I understood. Could you explain that again?'],

  ['Follow-up questions','↩️','What about you?','Et vous ?','A simple way to give the conversation back to the other person.','I prefer walking holidays. What about you?'],
  ['Follow-up questions','↩️','What was it like?','Comment c’était ?','A question asking for a description of an experience or place.','You stayed in a small village. What was it like?'],
  ['Follow-up questions','↩️','What did you like most?','Qu’avez-vous préféré ?','A question asking for the favourite part of an experience.','What did you like most about Ireland?'],
  ['Follow-up questions','↩️','How did you feel about it?','Qu’en avez-vous pensé / Comment vous êtes-vous senti(e) ?','A question asking for a personal reaction.','How did you feel about travelling alone?'],
  ['Follow-up questions','↩️','What kind of…?','Quel type de… ?','An open question asking for a category or type.','What kind of places do you enjoy visiting?'],
  ['Follow-up questions','↩️','Would you do it again?','Le referiez-vous ?','A question asking whether someone would repeat an experience.','Would you do that trip again?'],

  ['Useful verb expressions','🔀','say something / tell someone','dire quelque chose / dire à quelqu’un','Say focuses on words; tell normally takes a person.','She said the train was late, and she told me to wait.'],
  ['Useful verb expressions','🔀','speak a language / talk about a topic','parler une langue / parler d’un sujet','Speak is common with languages; talk is common for conversation and topics.','We spoke English and talked about our travel plans.'],
  ['Useful verb expressions','🔀','make a decision / do research','prendre une décision / faire des recherches','Make often creates a result; do often describes an activity or task.','We did some research before we made a decision.'],
  ['Useful verb expressions','🔀','go / come','aller / venir','Go moves away or elsewhere; come moves toward the speaker/destination.','I’m going to the station now. Can you come with me?'],
  ['Useful verb expressions','🔀','bring / take','apporter / emporter','Bring moves something toward here; take moves it from here to elsewhere.','Bring your passport when you come, and take an umbrella when you leave.'],
  ['Useful verb expressions','🔀','borrow / lend','emprunter / prêter','Borrow means receive temporarily; lend means give temporarily.','Can I borrow your pen? Yes, I can lend it to you.']
].map(([cat,icon,word,fr,def,example],i)=>({id:'voc'+i,cat,icon,word,fr,def,example}));

const writingTasks = [
  {id:'w1',title:'A weekend message',prompt:'Write a message about a recent day or weekend. Develop it with a reason, two details, a reaction, and one question back.',targets:['past simple','because','sequence','question back'],min:55,hint:'Use: Last… / First… / Then… / because… / It was… / What about you?',a2:'Last weekend, I went to the coast with my family. We had lunch and walked by the sea because the weather was good. It was a lovely day. What did you do?',b1:'Last weekend, I went to the coast with my family because the weather was too nice to stay at home. First, we had lunch near the harbour, and then we went for a long walk by the sea. It was quite busy, but the atmosphere was really pleasant. I was happy to spend time together. What did you do at the weekend?'},
  {id:'w2',title:'A recommendation',prompt:'Recommend a place, activity or travel style to someone and explain why.',targets:['present simple','opinion','because','for example'],min:55,hint:'Start: I’d recommend… / I think you would enjoy… because… / For example… / If you like…, you could…',a2:'I would recommend visiting a small coastal town because it is relaxing. You can walk by the sea and eat local food. I think you would enjoy it.',b1:'I’d recommend staying in a smaller coastal town rather than a large city because the atmosphere is usually more relaxed. For example, you can walk by the sea, visit a local market and try regional food without rushing. If you enjoy quiet places and outdoor activities, I think it would suit you very well.'},
  {id:'w3',title:'Explain a preference',prompt:'Compare two options and explain which one you prefer.',targets:['comparatives','whereas / although','preference','reason'],min:60,hint:'Try: I tend to prefer… because… / … is more… than… / whereas… / However…',a2:'I prefer travelling by train because it is more relaxing than driving. Planes are faster, but trains are more comfortable for short trips.',b1:'I tend to prefer travelling by train for medium-distance journeys because it feels more relaxing than driving. You can read or look at the scenery, whereas driving requires constant attention. Flying is obviously faster for long distances; however, for a shorter trip, I would usually choose the train.'},
  {id:'w4',title:'Future plan with detail',prompt:'Write about one upcoming plan. Separate the intention, fixed arrangement and prediction.',targets:['going to','present continuous','will','looking forward to'],min:60,hint:'Plan: I’m going to… Arrangement: I’m leaving / meeting… Prediction: I think it will…',a2:'I’m going to travel in September. I’m leaving in the middle of the month. I think the weather will be cool, but I hope it will be sunny. I’m looking forward to the trip.',b1:'I’m going to travel in September, and I’m really looking forward to having a change of scenery. I’m leaving in the middle of the month, so the main arrangements are already fixed. I think the weather will probably be cooler than at home, but that should be ideal for walking and visiting places without too much heat.'},
  {id:'w5',title:'Past → present → future',prompt:'Write one fluid paragraph connecting a past experience, your present preference and a future plan.',targets:['past simple','present / present perfect','future','connectors'],min:75,hint:'Past: Last year / I went… Present: Now / I usually / I’ve always… Future: Next / I’m going to…',a2:'Last year, I travelled with my family and we had a wonderful time. Now I really enjoy trips where I can walk and discover new places. Next month, I’m going to travel again and I’m very happy about it.',b1:'Last year, I travelled with my family and we had a wonderful time because we were able to discover new places together. Since then, I’ve realised that I especially enjoy trips that combine walking, local culture and time with family. I usually prefer a relaxed programme rather than planning every minute. Next month, I’m going to travel again, and I’m looking forward to using more English while I’m away.'}
];

const chainScenarios = [
  {title:'A favourite way to spend a weekend',prompt:'Someone asks: “What do you like doing at the weekend?”',other:'What do you like doing at the weekend?',hint:'Answer directly → reason → one example from a recent weekend → react/question back.',model:'I usually like spending time with my family or going somewhere for the day because I enjoy having a change from the normal routine. For example, if the weather is good, I like walking by the sea or visiting a new place. It helps me relax. What do you usually enjoy doing at the weekend?'},
  {title:'A memorable trip',prompt:'Someone asks: “What is one trip you remember particularly well?”',other:'What is one trip you remember particularly well?',hint:'Use past simple for the trip. Add why it was memorable. Finish with “Have you ever…?”',model:'One trip I remember particularly well is a family trip to Iceland. We saw incredible landscapes and spent a lot of time together, which made the experience very special. The weather was cold, but that was part of the adventure. Have you ever been somewhere that completely surprised you?'},
  {title:'Planning or spontaneity',prompt:'Someone says: “I never plan anything when I travel. I prefer being spontaneous.”',other:'I never plan anything when I travel. I prefer being spontaneous.',hint:'React politely → give your own preference → one reason → acknowledge the other side → ask back.',model:'I see what you mean. I like having some flexibility as well, but I tend to plan the important things because it makes the trip less stressful. For example, I usually book transport and accommodation in advance. After that, I’m happy to decide activities spontaneously. Do you ever book anything before you leave?'},
  {title:'Using English in real life',prompt:'Someone asks: “When do you find English most useful?”',other:'When do you find English most useful?',hint:'Present simple for usual situations. Give two contexts and one reason. Ask about the other person.',model:'I find English most useful when I travel and when I speak with family members who use English regularly. I also like being able to understand signs, menus and practical information without always translating everything. It makes me feel more independent. When do you use English most often?'}
];

const lilateScenarios = [
  {title:'A visitor asks for a recommendation',prompt:'A visitor has one free afternoon and asks what you recommend doing. Ask one useful question first, then make a recommendation and explain why.',hint:'Clarify interests first: “What kind of activities do you enjoy?” Then recommend + reason + practical detail + check.',model:'Of course. Before I recommend something, what kind of activities do you enjoy — walking, history or shopping? If you like walking and local atmosphere, I’d recommend exploring the old town and then having a drink near the harbour because everything is easy to reach on foot. If the weather is good, you could also walk along the coast. Does that sound like the kind of afternoon you had in mind?'},
  {title:'A colleague did not understand an instruction',prompt:'Someone says they are not sure what they need to do next. Clarify what they understood, reformulate the next step, and check comprehension.',hint:'React → “Which part is unclear?” → reformulate simply → “Is that clearer?”',model:'No problem. Which part is unclear — the time, the place or what you need to bring? The next step is simply to confirm the appointment by email and then bring the document with you on the day. You don’t need to send anything else for now. Is that clearer?'},
  {title:'Two options for a meeting place',prompt:'Someone asks you to choose between a café in the centre and a quieter place outside town. Compare the options and recommend one.',hint:'Use comparative language + whereas/however + recommendation + reason.',model:'Both options could work, but I’d probably choose the café in the centre because it is easier for everyone to reach. The place outside town may be quieter, whereas the central café is more convenient for public transport. However, if we need a long or private discussion, the quieter place could be better. What is more important for you: convenience or privacy?'},
  {title:'A practical misunderstanding',prompt:'You hear a time but are not sure whether the person said 13:15 or 13:50. Clarify politely and confirm the final information.',hint:'Say you are not sure → give the two possibilities → ask for confirmation → repeat the final answer.',model:'Sorry, I’m not sure I understood the time correctly. Did you say thirteen fifteen — a quarter past one — or thirteen fifty? Could you confirm that for me, please? Great, thank you. So the appointment is at thirteen fifteen. I’ve got it now.'},
  {title:'Explain a change of plan',prompt:'A plan has changed. Explain the original plan, the new plan, the reason for the change, and ask whether the other person agrees.',hint:'Original plan → however/but → new plan → because → question back.',model:'We originally planned to meet at eleven, but we need to change the time because one person will arrive later than expected. I suggest meeting at twelve instead, which should give everyone enough time. The place can stay the same. Would twelve o’clock work for you?'}
];

function renderQuiz(groupKey){
  const g=groups[groupKey]; const root=$('#'+g.container); if(!root) return;
  root.innerHTML='';
  if(g.total) $('#'+g.total).textContent=g.items.length;
  g.items.forEach((item,index)=>{
    const card=document.createElement('article'); card.className='exercise-card';
    const opts=shuffle(item.options);
    const saved=state.answers[item.id];
    card.innerHTML=`<span class="exercise-number">${index+1}</span><p>${escapeHtml(item.prompt)}</p><div class="answer-options"></div><div class="exercise-tools"><button class="hint-button" type="button">💡 Hint</button></div><div class="hint-box" hidden>${escapeHtml(item.hint)}</div><div class="feedback-line" aria-live="polite"></div>`;
    const box=$('.answer-options',card); const fb=$('.feedback-line',card); const hb=$('.hint-button',card); const hint=$('.hint-box',card);
    hb.addEventListener('click',()=>{hint.hidden=!hint.hidden; hb.textContent=hint.hidden?'💡 Hint':'Hide hint';});
    opts.forEach((opt,oi)=>{
      const b=document.createElement('button'); b.type='button'; b.dataset.value=opt; b.innerHTML=`<span class="quiz-option-letter">${String.fromCharCode(65+oi)}</span>${escapeHtml(opt)}`;
      b.addEventListener('click',()=>answerQuestion(groupKey,item,opt,card)); box.appendChild(b);
    });
    if(saved) applySaved(item,saved,card);
    root.appendChild(card);
  });
  updateGroupScore(groupKey); updateDashboard();
}

function answerQuestion(groupKey,item,opt,card){
  if(state.answers[item.id]) return;
  const correct=opt===item.answer;
  state.answers[item.id]={selected:opt,correct}; saveState();
  applySaved(item,state.answers[item.id],card); updateGroupScore(groupKey); updateListeningScore(); updateDashboard();
}
function applySaved(item,saved,card){
  const buttons=$$('.answer-options button',card); buttons.forEach(b=>{ b.disabled=true; const val=b.dataset.value; if(val===item.answer)b.classList.add('correct'); if(val===saved.selected && !saved.correct)b.classList.add('incorrect'); });
  const fb=$('.feedback-line',card); fb.className='feedback-line '+(saved.correct?'good':'bad'); fb.textContent=saved.correct?'✓ Correct':`✗ Not quite. Best answer: ${item.answer}`;
}
function scoreGroup(groupKey){ const g=groups[groupKey]; const done=g.items.filter(x=>state.answers[x.id]); return {correct:done.filter(x=>state.answers[x.id].correct).length,attempted:done.length,total:g.items.length}; }
function updateGroupScore(groupKey){ const g=groups[groupKey]; if(!g.score)return; const s=scoreGroup(groupKey); $('#'+g.score).textContent=s.correct; if(g.total) $('#'+g.total).textContent=g.items.length; }
function updateListeningScore(){ const a=scoreGroup('listeningA'),b=scoreGroup('listeningB'); $('#listeningScore').textContent=a.correct+b.correct; $('#listeningTotal').textContent=a.total+b.total; }
function resetGroup(containerKey){
  let keys=[];
  if(containerKey==='listeningAll') keys=['listeningA','listeningB']; else keys=Object.keys(groups).filter(k=>groups[k].container===containerKey || k===containerKey);
  keys.forEach(k=>groups[k].items.forEach(i=>delete state.answers[i.id])); saveState(); keys.forEach(renderQuiz); updateListeningScore(); updateDashboard();
}

const categories=['All categories',...new Set(vocab.map(v=>v.cat))];
function renderVocab(){
  const select=$('#vocabCategory'); select.innerHTML=categories.map(c=>`<option>${escapeHtml(c)}</option>`).join('');
  select.addEventListener('change',renderVocabCards); renderVocabCards();
}
function renderVocabCards(){
  const cat=$('#vocabCategory').value||'All categories'; const list=cat==='All categories'?vocab:vocab.filter(v=>v.cat===cat); $('#vocabCount').textContent=list.length;
  $('#vocabGrid').innerHTML=list.map(v=>`<article class="vocab-card"><div class="vocab-card-top"><div class="vocab-icon">${v.icon}</div><div><div class="vocab-word">${escapeHtml(v.word)}</div><div class="vocab-pos">${escapeHtml(v.cat)}</div></div></div><span class="vocab-fr">${escapeHtml(v.fr)}</span><p class="vocab-def"><strong>Definition:</strong> ${escapeHtml(v.def)}</p><p class="vocab-example"><strong>Example:</strong> ${escapeHtml(v.example)}</p><button class="vocab-audio" data-speak="${escapeHtml(v.word+'. '+v.example)}">🔊 Word + sentence</button></article>`).join('');
  $$('.vocab-audio').forEach(b=>b.addEventListener('click',()=>speak(b.dataset.speak)));
}

function speak(text){
  if(!('speechSynthesis' in window)) return alert('Speech synthesis is not supported in this browser.');
  speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(text); u.lang=state.voice||'en-GB'; u.rate=parseFloat(state.speed||0.92);
  const voices=speechSynthesis.getVoices(); const match=voices.find(v=>v.lang.toLowerCase().startsWith(u.lang.toLowerCase())) || voices.find(v=>v.lang.toLowerCase().startsWith('en'));
  if(match)u.voice=match; speechSynthesis.speak(u);
}

function initToggles(){
  $$('.hint-toggle').forEach(b=>b.addEventListener('click',()=>{const el=$('#'+b.dataset.target); el.hidden=!el.hidden; b.textContent=el.hidden?'Hint':'Hide hint';}));
  $$('.model-toggle').forEach(b=>b.addEventListener('click',()=>{const el=$('#'+b.dataset.target); el.hidden=!el.hidden; b.textContent=el.hidden?'Show models':'Hide models';}));
  $$('.model-audio').forEach(b=>b.addEventListener('click',()=>{const el=$('#'+b.dataset.model); const p=$$('p',el).at(-1); speak((p?p.textContent:el.textContent).replace(/^B1:\s*/,'').trim());}));
  $$('.speak-phrase').forEach(b=>b.addEventListener('click',()=>speak(b.dataset.speak)));
  $$('.transcript-btn').forEach(b=>b.addEventListener('click',()=>{const el=$('#'+b.dataset.target); const open=el.classList.toggle('open'); el.hidden=!open; b.textContent=open?'Hide transcript':'Show transcript';}));
}

function initListening(){
  const a=`A: Did you have a good weekend? B: Yes, I did. We went to the coast because the weather was beautiful. We had lunch near the harbour and then we walked along the beach. It was quite busy, but the atmosphere was lovely. A: That sounds nice. Did you stay there all day? B: Almost. We came home in the early evening. What did you do?`;
  const b=`A: Have you planned anything for the autumn? B: Yes. I'm going to Ireland in September, and I'm travelling to Italy in October. I'm really looking forward to both trips because they will be very different. A: Really? Which one are you most excited about? B: That's difficult to say. Ireland may be cooler, whereas Italy will probably be warmer. I think both will be interesting in different ways.`;
  $('#listenA').addEventListener('click',()=>speak(a)); $('#listenB').addEventListener('click',()=>speak(b));
}

let chainIndex=0;
function showChain(index){ chainIndex=index%chainScenarios.length; const s=chainScenarios[chainIndex]; $('#chainTitle').textContent=s.title; $('#chainPrompt').textContent=s.prompt; $('#chainTurns').innerHTML=`<div class="chain-turn other">${escapeHtml(s.other)}</div><div class="chain-turn you"><strong>Your turn:</strong> answer + reason + detail + reaction + question back</div>`; $('#chainHint').innerHTML=s.hint; $('#chainModel').textContent=s.model; $('#chainHint').hidden=true; $('#chainModel').hidden=true; $('#chainHintBtn').textContent='Hint'; $('#chainModelBtn').textContent='Show B1 model'; }
function initChain(){
  showChain(Math.floor(Math.random()*chainScenarios.length));
  $('#newChain').addEventListener('click',()=>showChain((chainIndex+1)%chainScenarios.length));
  $('#chainHintBtn').addEventListener('click',()=>{const e=$('#chainHint');e.hidden=!e.hidden;$('#chainHintBtn').textContent=e.hidden?'Hint':'Hide hint';});
  $('#chainModelBtn').addEventListener('click',()=>{const e=$('#chainModel');e.hidden=!e.hidden;$('#chainModelBtn').textContent=e.hidden?'Show B1 model':'Hide B1 model';});
  $('#chainListenBtn').addEventListener('click',()=>speak(chainScenarios[chainIndex].model));
  $('#chainDraft').value=state.chainDraft||''; updateChainWords();
  $('#chainDraft').addEventListener('input',()=>{state.chainDraft=$('#chainDraft').value; saveState();updateChainWords();});
  $('#saveChain').addEventListener('click',()=>{state.chainDraft=$('#chainDraft').value;saveState();$('#chainStatus').textContent='✓ rehearsal saved';$('#chainStatus').classList.add('done');});
  $('#copyChain').addEventListener('click',()=>navigator.clipboard?.writeText($('#chainDraft').value));
}
function updateChainWords(){const n=wordCount($('#chainDraft').value);$('#chainWords').textContent=n;const status=$('#chainStatus');if(n>=35){status.textContent='✓ good rehearsal length';status.classList.add('done')}else{status.textContent='○ build toward 35+ words';status.classList.remove('done')}}

function renderWritingTasks(){
  const root=$('#writingMissionGrid'); root.innerHTML='';
  writingTasks.forEach((t,i)=>{
    const saved=(state.writing[t.id]||{}).text||''; const n=wordCount(saved); const done=n>=t.min;
    const card=document.createElement('article'); card.className='production-card'; card.innerHTML=`<span class="badge-new">WRITING ${i+1}</span><h3>${escapeHtml(t.title)}</h3><p><strong>Task:</strong> ${escapeHtml(t.prompt)}</p><div class="target-strip">${t.targets.map(x=>`<span>${escapeHtml(x)}</span>`).join('')}</div><div class="writing-actions"><button class="button secondary write-hint">Hint</button><button class="button ghost write-model">Show models</button><button class="button secondary write-audio">🔊 Listen to B1 model</button></div><div class="hint-box" hidden>${escapeHtml(t.hint)}</div><div class="model-box" hidden><p><strong>A2+ model:</strong> ${escapeHtml(t.a2)}</p><p><strong>B1 model:</strong> ${escapeHtml(t.b1)}</p></div><textarea rows="9" placeholder="Write your response here...">${escapeHtml(saved)}</textarea><div class="word-meter"><span><strong class="wc">${n}</strong> words</span><span>Completion target: ${t.min}+ words</span></div><span class="task-status ${done?'done':''}" id="${t.id}Status">${done?'✓ completed':'○ in progress'}</span>`;
    const hint=$('.hint-box',card),model=$('.model-box',card),ta=$('textarea',card),wc=$('.wc',card),status=$('.task-status',card);
    $('.write-hint',card).addEventListener('click',e=>{hint.hidden=!hint.hidden;e.currentTarget.textContent=hint.hidden?'Hint':'Hide hint';});
    $('.write-model',card).addEventListener('click',e=>{model.hidden=!model.hidden;e.currentTarget.textContent=model.hidden?'Show models':'Hide models';});
    $('.write-audio',card).addEventListener('click',()=>speak(t.b1));
    ta.addEventListener('input',()=>{const count=wordCount(ta.value);wc.textContent=count;state.writing[t.id]={text:ta.value,done:count>=t.min};saveState();if(count>=t.min){status.textContent='✓ completed';status.classList.add('done')}else{status.textContent='○ in progress';status.classList.remove('done')}updateDashboard();});
    root.appendChild(card);
  });
}

function initOral(){
  $$('.mark-oral').forEach(b=>{ const id=b.dataset.task; if(state.oral[id])setOralStatus(id,true); b.addEventListener('click',()=>{state.oral[id]=!state.oral[id];saveState();setOralStatus(id,state.oral[id]);updateDashboard();}); });
}
function setOralStatus(id,done){ const s=$('#'+id+'Status'); if(!s)return; s.textContent=done?'✓ practised':'○ not practised';s.classList.toggle('done',!!done); const b=$(`.mark-oral[data-task="${id}"]`); if(b)b.textContent=done?'↻ Mark as not practised':'✓ Mark as practised'; }

let lilateIndex=0;
function showLilate(i){ lilateIndex=i%lilateScenarios.length;const s=lilateScenarios[lilateIndex];$('#lilateTitle').textContent=s.title;$('#lilatePrompt').textContent=s.prompt;$('#lilateHint').textContent=s.hint;$('#lilateModel').textContent=s.model;$('#lilateHint').hidden=true;$('#lilateModel').hidden=true;$('#lilateHintBtn').textContent='Hint';$('#lilateModelBtn').textContent='Show B1 model'; }
function initLilate(){showLilate(Math.floor(Math.random()*lilateScenarios.length));$('#newLilate').addEventListener('click',()=>showLilate((lilateIndex+1)%lilateScenarios.length));$('#lilateHintBtn').addEventListener('click',()=>{const e=$('#lilateHint');e.hidden=!e.hidden;$('#lilateHintBtn').textContent=e.hidden?'Hint':'Hide hint'});$('#lilateModelBtn').addEventListener('click',()=>{const e=$('#lilateModel');e.hidden=!e.hidden;$('#lilateModelBtn').textContent=e.hidden?'Show B1 model':'Hide B1 model'});$('#lilateListenBtn').addEventListener('click',()=>speak(lilateScenarios[lilateIndex].model));}

let mediaRecorder=null, chunks=[], audioUrl=null;
function initRecorder(){
  const start=$('#recordStart'),stop=$('#recordStop'),play=$('#recordPlayback'),download=$('#recordDownload'),status=$('#recordStatus');
  if(!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder){status.textContent='Recording is not supported in this browser. You can still practise aloud.';start.disabled=true;return;}
  start.addEventListener('click',async()=>{try{const stream=await navigator.mediaDevices.getUserMedia({audio:true});chunks=[];mediaRecorder=new MediaRecorder(stream);mediaRecorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};mediaRecorder.onstop=()=>{const blob=new Blob(chunks,{type:mediaRecorder.mimeType||'audio/webm'});if(audioUrl)URL.revokeObjectURL(audioUrl);audioUrl=URL.createObjectURL(blob);play.src=audioUrl;play.hidden=false;download.href=audioUrl;download.download='lesson-7-speaking-practice.webm';download.hidden=false;stream.getTracks().forEach(t=>t.stop());status.textContent='Recording ready — listen back and notice your connectors, verb choice and question back.'};mediaRecorder.start();start.disabled=true;stop.disabled=false;status.textContent='Recording…';}catch(e){status.textContent='Microphone access was not available. Check browser permission and try again.';}});
  stop.addEventListener('click',()=>{if(mediaRecorder?.state==='recording'){mediaRecorder.stop();start.disabled=false;stop.disabled=true;}});
}

function initControls(){
  $('#frToggle').checked=state.frHelp!==false; document.body.classList.toggle('hide-fr',state.frHelp===false); $('#voiceSelect').value=state.voice||'en-GB';$('#speedSelect').value=state.speed||'0.92';document.documentElement.style.fontSize=`${state.fontScale||1}em`;
  $('#frToggle').addEventListener('change',e=>{state.frHelp=e.target.checked;document.body.classList.toggle('hide-fr',!state.frHelp);saveState();});
  $('#voiceSelect').addEventListener('change',e=>{state.voice=e.target.value;saveState();}); $('#speedSelect').addEventListener('change',e=>{state.speed=e.target.value;saveState();});
  $('#fontDown').addEventListener('click',()=>setFont(Math.max(.88,(state.fontScale||1)-.08)));$('#fontUp').addEventListener('click',()=>setFont(Math.min(1.32,(state.fontScale||1)+.08)));$('#fontReset').addEventListener('click',()=>setFont(1));
  $$('.reset-section').forEach(b=>b.addEventListener('click',()=>resetGroup(b.dataset.reset)));
  $('#resetAll').addEventListener('click',()=>{if(confirm('Reset all saved lesson progress in this browser?')){localStorage.removeItem(STORAGE_KEY);location.reload();}});
}
function setFont(v){state.fontScale=Number(v.toFixed(2));document.documentElement.style.fontSize=`${state.fontScale}em`;saveState();}

function updateDashboard(){
  const groupKeys=Object.keys(groups); let correct=0,attempted=0,total=0;
  groupKeys.forEach(k=>{const s=scoreGroup(k);correct+=s.correct;attempted+=s.attempted;total+=s.total;});
  const pct=attempted?Math.round(correct/attempted*100):0;$('#objectivePercent').textContent=pct+'%';$('#objectiveBar').style.width=pct+'%';
  const oralIds=['oral1','oral2','oral3','oral4','oral5'];const oralDone=oralIds.filter(id=>state.oral[id]).length;$('#speakingCount').textContent=`${oralDone} / 5`;$('#speakingBar').style.width=(oralDone/5*100)+'%';
  const writeDone=writingTasks.filter(t=>wordCount((state.writing[t.id]||{}).text||'')>=t.min).length;$('#writingCount').textContent=`${writeDone} / 5`;$('#writingBar').style.width=(writeDone/5*100)+'%';
  $('#exerciseDetailGrid').innerHTML=groupKeys.map(k=>{const s=scoreGroup(k);return `<div class="exercise-detail"><strong>${escapeHtml(groups[k].label)}</strong><span>${s.correct}/${s.total} correct · ${s.attempted} attempted</span></div>`}).join('');
  const oralDetails=oralIds.map((id,i)=>`<div class="exercise-detail"><strong>Oral ${i+1}${i===4?' · LILATE mission':''}</strong><span>${state.oral[id]?'✓ practised':'○ pending'}</span></div>`).join('');
  const writingDetails=writingTasks.map((t,i)=>{const n=wordCount((state.writing[t.id]||{}).text||'');return `<div class="exercise-detail"><strong>Writing ${i+1} · ${escapeHtml(t.title)}</strong><span>${n>=t.min?'✓ completed':n+' / '+t.min+' words'}</span></div>`}).join('');
  $('#productionDetailGrid').innerHTML=oralDetails+writingDetails;
}

function initNotesEvaluation(){
  const fields=['speakingEval','writingEval','usefulness','clarity','confidence','trainerComments'];
  fields.forEach(id=>{const el=$('#'+id);if(!el)return;el.value=state[id]||'';el.addEventListener('input',()=>{state[id]=el.value;saveState();});});
  $('#lessonNotes').value=state.notes||'';$('#lessonNotes').addEventListener('input',()=>{state.notes=$('#lessonNotes').value;saveState();});
  $('#saveNotes').addEventListener('click',()=>{state.notes=$('#lessonNotes').value;saveState();alert('Notes saved in this browser.');});
  $('#copyNotes').addEventListener('click',()=>navigator.clipboard?.writeText($('#lessonNotes').value));
  $('#downloadNotes').addEventListener('click',()=>downloadBlob('lesson-7-notes.txt',$('#lessonNotes').value,'text/plain'));
  $('#downloadTxt').addEventListener('click',()=>downloadBlob('lesson-7-complete-evaluation.txt',buildReportText(),'text/plain'));
  $('#downloadHtml').addEventListener('click',()=>downloadBlob('lesson-7-complete-evaluation.html',buildReportHtml(),'text/html'));
  $('#downloadPdf').addEventListener('click',()=>{const w=window.open('','_blank'); if(!w)return alert('Please allow pop-ups to print the PDF report.');w.document.write(buildReportHtml(true));w.document.close();setTimeout(()=>w.print(),300);});
}
function downloadBlob(name,text,type){const blob=new Blob([text],{type:type+';charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function buildReportData(){
  const details=Object.keys(groups).map(k=>({label:groups[k].label,...scoreGroup(k)}));const totalCorrect=details.reduce((n,x)=>n+x.correct,0),totalAttempted=details.reduce((n,x)=>n+x.attempted,0);return {date:new Date().toLocaleDateString('fr-FR'),details,totalCorrect,totalAttempted,pct:totalAttempted?Math.round(totalCorrect/totalAttempted*100):0,oral:['oral1','oral2','oral3','oral4','oral5'].filter(id=>state.oral[id]).length,writing:writingTasks.filter(t=>wordCount((state.writing[t.id]||{}).text||'')>=t.min).length};
}
function buildReportText(){const r=buildReportData();return `LESSON 07 — CONVERSATION BUILDER\nDate: ${r.date}\n\nOBJECTIVE SCORE: ${r.totalCorrect}/${r.totalAttempted} attempted (${r.pct}%)\n${r.details.map(x=>`- ${x.label}: ${x.correct}/${x.total} correct; ${x.attempted} attempted`).join('\n')}\n\nSPEAKING PRACTICE: ${r.oral}/5\nWRITING PRACTICE: ${r.writing}/5\nSpeaking assessment: ${state.speakingEval||'—'}\nWriting assessment: ${state.writingEval||'—'}\nUsefulness: ${state.usefulness||'—'}\nClarity: ${state.clarity||'—'}\nConfidence: ${state.confidence||'—'}\n\nTRAINER COMMENTS\n${state.trainerComments||'—'}\n\nLESSON NOTES\n${state.notes||'—'}\n`;}
function buildReportHtml(forPrint=false){const r=buildReportData();return `<!doctype html><html><head><meta charset="utf-8"><title>Lesson 7 Progress Report</title><style>body{font-family:Arial,sans-serif;color:#18304a;margin:36px;background:#fffdf9}header{background:#173b57;color:white;padding:28px;border-radius:18px}h1{margin:0}h2{color:#267f7b;border-bottom:2px solid #d7a94a;padding-bottom:6px}.score{font-size:28px;font-weight:800;color:#267f7b}.grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.card{border:1px solid #d8dfdf;border-radius:12px;padding:12px;background:white}.muted{color:#6b7782}.comments{white-space:pre-wrap;background:#eef9f6;padding:15px;border-radius:12px}@media print{body{margin:14mm}.no-print{display:none}}</style></head><body><header><small>SPEAKEASYTISHA · LESSON 07</small><h1>Conversation Builder — Progress & Evaluation</h1><p>${r.date}</p></header><h2>Objective progress</h2><p class="score">${r.totalCorrect}/${r.totalAttempted} attempted · ${r.pct}% correct</p><div class="grid">${r.details.map(x=>`<div class="card"><strong>${escapeHtml(x.label)}</strong><br>${x.correct}/${x.total} correct · ${x.attempted} attempted</div>`).join('')}</div><h2>Production</h2><div class="grid"><div class="card"><strong>Speaking practice</strong><br>${r.oral}/5 practised<br><span class="muted">Assessment: ${escapeHtml(state.speakingEval||'—')}</span></div><div class="card"><strong>Writing practice</strong><br>${r.writing}/5 completed<br><span class="muted">Assessment: ${escapeHtml(state.writingEval||'—')}</span></div></div><h2>Learner feedback</h2><div class="grid"><div class="card">Usefulness: ${escapeHtml(state.usefulness||'—')}</div><div class="card">Clarity: ${escapeHtml(state.clarity||'—')}</div><div class="card">Confidence: ${escapeHtml(state.confidence||'—')}</div></div><h2>Trainer comments</h2><div class="comments">${escapeHtml(state.trainerComments||'—')}</div><h2>Lesson notes</h2><div class="comments">${escapeHtml(state.notes||'—')}</div>${forPrint?'':'<p class="muted">Generated from the interactive lesson dashboard.</p>'}</body></html>`;}

function init(){
  initControls(); renderVocab();
  Object.keys(groups).forEach(renderQuiz); updateListeningScore();
  initToggles(); initListening(); initChain(); renderWritingTasks(); initOral(); initLilate(); initRecorder(); initNotesEvaluation(); updateDashboard();
  speechSynthesis?.getVoices();
}

document.addEventListener('DOMContentLoaded',init);
