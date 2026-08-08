"use strict";

const qs = (s, root = document) => root.querySelector(s);
const qsa = (s, root = document) => [...root.querySelectorAll(s)];
const STORAGE_KEY = "aminata-grammar-addon-v1";
const $toast = qs("#toast");

const quizSets = {
  methodQuiz: {
    scoreKey: "methodQuiz", section: "method", points: 1,
    data: [
      {q:"The passenger usually ___ a special meal before travelling.", answer:"requests", wrong:["is requesting","requested","has request"], why:"“Usually” signals a routine, so use the present simple. The passenger is third person singular: requests."},
      {q:"We ___ the ingredients at the moment.", answer:"are checking", wrong:["check","checked","have check"], why:"“At the moment” signals an action in progress: are + checking."},
      {q:"The passenger ___ the wrong tray, so the problem exists now.", answer:"has received", wrong:["received yesterday","is receive","has receive"], why:"The past action has a current result, so use has + past participle."},
      {q:"___ you request the meal during booking?", answer:"Did", wrong:["Do","Have","Are"], why:"The action happened at a finished past time, so the question starts with Did."}
    ]
  },
  foundationQuiz: {
    scoreKey: "foundationQuiz", section: "foundations", points: 2,
    data: [
      {q:"The passenger ___ worried about the connection.", answer:"is", wrong:["does","has","are"], why:"Use be to describe a present state."},
      {q:"___ the passenger have any allergies?", answer:"Does", wrong:["Is","Has","Do"], why:"Present simple question + third-person singular subject: Does + passenger + have."},
      {q:"The crew ___ already confirmed the arrival time.", answer:"has", wrong:["is","does","have"], why:"Present perfect with singular collective subject: has confirmed."},
      {q:"We ___ not serve alcohol before take-off.", answer:"do", wrong:["are","have","does"], why:"Present simple negative with we: do not serve."}
    ]
  },
  presentSimpleQuiz: {
    scoreKey: "presentSimpleQuiz", section: "presentSimple", points: 2,
    data: [
      {q:"The purser ___ the cabin before every departure.", answer:"checks", wrong:["check","is checking","checked"], why:"A repeated procedure uses the present simple; purser is singular, so add -s."},
      {q:"Passengers usually ___ their boarding passes at the gate.", answer:"show", wrong:["shows","are showing","showed"], why:"Passengers is plural, so use the base form show."},
      {q:"The passenger ___ meat.", answer:"does not eat", wrong:["does not eats","is not eat","not eats"], why:"After does not, use the base verb: eat."},
      {q:"___ the airline provide special meals?", answer:"Does", wrong:["Do","Is","Has"], why:"Airline is singular and this is a general service question: Does."},
      {q:"Safety procedures ___ essential on every flight.", answer:"remain", wrong:["remains","are remaining","remained"], why:"Procedures is plural, so the present simple base form is remain."}
    ]
  },
  presentContrastQuiz: {
    scoreKey: "presentContrastQuiz", section: "presentContinuous", points: 2,
    data: [
      {q:"We normally ___ the menu after take-off.", answer:"present", wrong:["are presenting","presented","have presented"], why:"“Normally” describes a routine: present simple."},
      {q:"I ___ the ingredients right now.", answer:"am checking", wrong:["check","checked","have checked"], why:"“Right now” requires the present continuous."},
      {q:"The passenger ___ a blanket at the moment.", answer:"is requesting", wrong:["requests","requested","has requested"], why:"The request is happening now: is requesting."},
      {q:"I ___ your concern.", answer:"understand", wrong:["am understanding","understood now","have understanding"], why:"Understand is usually a state verb, so use present simple."},
      {q:"The crew usually ___ together during service.", answer:"works", wrong:["is working","work","worked"], why:"Crew is treated as singular here and “usually” signals a routine: works."},
      {q:"Today, we ___ a new Business Class menu.", answer:"are serving", wrong:["serve every day","served","have serve"], why:"“Today” describes a temporary current situation: are serving."}
    ]
  },
  pastQuiz: {
    scoreKey: "pastQuiz", section: "pastSimple", points: 2,
    data: [
      {q:"Yesterday, the passenger ___ a vegetarian meal.", answer:"requested", wrong:["has requested","request","did requested"], why:"Yesterday is a finished past time, so use the past simple."},
      {q:"The crew member ___ the passenger a blanket.", answer:"gave", wrong:["gived","has given yesterday","give"], why:"Give is irregular: gave."},
      {q:"___ you speak to the purser after the complaint?", answer:"Did", wrong:["Have","Do","Were"], why:"A finished past question starts with Did."},
      {q:"I ___ the tray because it contained nuts.", answer:"removed", wrong:["have removed last night","remove","did removed"], why:"This is a completed action in the story: removed."},
      {q:"The passenger did not ___ the standard meal.", answer:"accept", wrong:["accepted","accepts","accepting"], why:"After did not, use the base verb: accept."}
    ]
  },
  pastPerfectQuiz: {
    scoreKey: "pastPerfectQuiz", section: "presentPerfect", points: 2,
    data: [
      {q:"The passenger ___ the wrong dish, so we need a solution now.", answer:"has received", wrong:["received yesterday","has receive","is received"], why:"The current result is important: has received."},
      {q:"I ___ for several airlines during my career.", answer:"have worked", wrong:["worked in 2022","have work","am working"], why:"This summarises life experience without a finished time: have worked."},
      {q:"She ___ the meal when she booked the ticket last week.", answer:"requested", wrong:["has requested last week","has request","requests"], why:"“Last week” is a finished past time: requested."},
      {q:"___ you ever managed a medical situation on board?", answer:"Have", wrong:["Did ever","Are","Has"], why:"Life experience question: Have + you + past participle."},
      {q:"The ground team ___ the assistance yet.", answer:"has not confirmed", wrong:["did not confirmed","has not confirm","is not confirming yet always"], why:"Yet commonly appears with the present perfect negative."},
      {q:"We ___ the passenger two minutes ago.", answer:"informed", wrong:["have informed two minutes ago","have inform","are informing"], why:"“Two minutes ago” is a finished past time: informed."}
    ]
  },
  futureQuiz: {
    scoreKey: "futureQuiz", section: "future", points: 2,
    data: [
      {q:"I can see the passenger is cold. I ___ bring a blanket.", answer:"will", wrong:["am going","am bringing yesterday","have"], why:"This is an immediate decision made now: will."},
      {q:"We have planned the service. We ___ offer the new menu after take-off.", answer:"are going to", wrong:["will suddenly","were","have"], why:"A prior intention or plan uses going to."},
      {q:"The purser ___ the passenger at the gate at 4 p.m.; it is arranged.", answer:"is meeting", wrong:["meets usually","met","has met"], why:"A fixed future arrangement uses the present continuous."},
      {q:"Don’t worry. I ___ keep you informed.", answer:"will", wrong:["am keeping yesterday","have","did"], why:"A promise uses will."},
      {q:"Look at those clouds. The flight ___ experience turbulence.", answer:"is going to", wrong:["has","did","is experience"], why:"Visible evidence supports going to."},
      {q:"We ___ assistance for your connection after landing tomorrow.", answer:"are arranging", wrong:["arranged tomorrow","have arrange","are arrange"], why:"A planned arrangement can use present continuous."}
    ]
  },
  questionQuiz: {
    scoreKey: "questionQuiz", section: "questions", points: 2,
    data: [
      {q:"___ you have any food allergies?", answer:"Do", wrong:["Are","Have","Does"], why:"Have is the main verb in a present simple question: Do you have…?"},
      {q:"___ the passenger feeling unwell now?", answer:"Is", wrong:["Does","Has","Did"], why:"Feeling is present continuous, so use Is."},
      {q:"___ you request a special meal when you booked?", answer:"Did", wrong:["Have","Do","Are"], why:"The booking is a finished past event: Did."},
      {q:"___ the crew confirmed the updated arrival time?", answer:"Has", wrong:["Does","Is","Did"], why:"Confirmed is a past participle with a current result: Has confirmed."},
      {q:"___ you prefer tea or coffee?", answer:"Would", wrong:["Did","Are","Have"], why:"Would you prefer…? is a polite choice question."},
      {q:"___ you tell me which meal you ordered?", answer:"Could", wrong:["Must","Did","Are"], why:"Could you tell me…? is a polite request."},
      {q:"___ the passenger usually travel with assistance?", answer:"Does", wrong:["Is","Has","Do"], why:"Passenger is singular in the present simple: Does."}
    ]
  },
  modalQuiz: {
    scoreKey: "modalQuiz", section: "modals", points: 2,
    data: [
      {q:"Passengers ___ fasten their seat belts during take-off.", answer:"must", wrong:["might","would","could prefer"], why:"This is a strong safety obligation: must."},
      {q:"___ I see your boarding pass, please?", answer:"May", wrong:["Must","Did","Have"], why:"May I…? is a polite request for permission."},
      {q:"The meal ___ contain traces of nuts; we need to verify it.", answer:"may", wrong:["must certainly","would always","can to"], why:"May expresses possibility, not certainty."},
      {q:"You ___ remain seated if you feel dizzy.", answer:"should", wrong:["would prefer","might to","did"], why:"Should gives professional advice."},
      {q:"You ___ open the overhead compartment during turbulence.", answer:"must not", wrong:["do not have to","may","could"], why:"Must not expresses prohibition."},
      {q:"You ___ move seats; this one is already suitable.", answer:"do not have to", wrong:["must not","cannot ever","should to"], why:"Do not have to means there is no obligation."},
      {q:"___ you prefer a light meal or the vegetarian pasta?", answer:"Would", wrong:["Must","Did","Have"], why:"Would you prefer…? is polished service language."}
    ]
  },
  precisionQuiz: {
    scoreKey: "precisionQuiz", section: "precision", points: 2,
    data: [
      {q:"I am ___ experienced flight attendant.", answer:"an", wrong:["a","the","—"], why:"Experienced begins with a vowel sound, so use an."},
      {q:"___ passenger in seat 4A has a nut allergy.", answer:"The", wrong:["A","An","—"], why:"The passenger is specific and identified by seat number."},
      {q:"Passengers need clear ___.", answer:"information", wrong:["informations","an information","the informations"], why:"Information is uncountable in English."},
      {q:"We have only ___ water left.", answer:"a little", wrong:["a few","many","an"], why:"Water is uncountable, so use a little."},
      {q:"There are ___ vegetarian options available.", answer:"a few", wrong:["a little","much","an"], why:"Options are countable plural, so use a few."},
      {q:"The passenger is worried ___ the connection.", answer:"about", wrong:["of","at","for"], why:"The correct combination is worried about."},
      {q:"I am interested ___ joining Air France.", answer:"in", wrong:["of","at","to"], why:"The correct combination is interested in."},
      {q:"The request was made ___ booking.", answer:"during", wrong:["at","on","for"], why:"Use during for an event occurring within a period or process."},
      {q:"We will meet the passenger ___ the gate after landing.", answer:"at", wrong:["in","on","during"], why:"Use at for a specific point or location such as the gate."}
    ]
  },
  connectorQuiz: {
    scoreKey: "connectorQuiz", section: "connectors", points: 2,
    data: [
      {q:"The passenger has a nut allergy, ___ we must verify the ingredients.", answer:"so", wrong:["although","however","in addition"], why:"So introduces the result of the allergy information."},
      {q:"The passenger requested a vegetarian meal; ___, a chicken dish was served.", answer:"however", wrong:["because","therefore","first"], why:"However introduces a contrast."},
      {q:"___, I apologised. Then, I removed the tray.", answer:"First", wrong:["Although","Because","However"], why:"First introduces the first step in a sequence."},
      {q:"The flight was delayed ___ bad weather.", answer:"because of", wrong:["although","so","however"], why:"Because of is followed by a noun phrase: bad weather."},
      {q:"The arrival time has changed. ___, the ground team will assist the passenger.", answer:"Therefore", wrong:["But","During","Although"], why:"Therefore introduces a logical consequence."},
      {q:"Let me confirm: ___, you need a dairy-free and gluten-free meal.", answer:"in other words", wrong:["yesterday","despite","at first"], why:"In other words reformulates information clearly."}
    ]
  },
  finalQuiz: {
    scoreKey: "finalQuiz", section: "finalMission", points: 1,
    data: [
      {q:"The crew usually ___ the cabin before boarding.",answer:"checks",wrong:["is checking now","checkes","has check"],why:"Routine + singular subject: checks."},
      {q:"We ___ a passenger with a medical concern right now.",answer:"are assisting",wrong:["assist every day","assisted yesterday","have assist"],why:"Right now: present continuous."},
      {q:"The passenger ___ the wrong meal ten minutes ago.",answer:"received",wrong:["has received ten minutes ago","receive","has receive"],why:"Ten minutes ago: past simple."},
      {q:"The purser ___ already confirmed the ingredients.",answer:"has",wrong:["is","did","does"],why:"Already + current result: has confirmed."},
      {q:"___ you ever worked in Business Class?",answer:"Have",wrong:["Did ever","Are","Has"],why:"Life experience: Have you ever + past participle."},
      {q:"___ the passenger need wheelchair assistance?",answer:"Does",wrong:["Is","Has","Do"],why:"Present simple singular question: Does."},
      {q:"___ you feeling better now?",answer:"Are",wrong:["Do","Have","Did"],why:"Feeling is present continuous: Are you feeling…?"},
      {q:"Could you tell me where the passenger ___?",answer:"is sitting",wrong:["does sit?","sitting is","did sat"],why:"Indirect question uses statement word order."},
      {q:"I ___ check the updated arrival time immediately.",answer:"will",wrong:["have","did","am check"],why:"Immediate promise/decision: will."},
      {q:"We ___ meet the passenger at the gate at 4 p.m.; it is arranged.",answer:"are going to",wrong:["met","have","did"],why:"A planned future arrangement can use going to."},
      {q:"Passengers ___ remain seated during turbulence.",answer:"must",wrong:["would","might prefer","did"],why:"Safety obligation: must."},
      {q:"The meal ___ contain dairy, so I need to check.",answer:"may",wrong:["must certainly","did","has to contain always"],why:"Uncertain possibility: may."},
      {q:"Would you prefer ___ hot drink?",answer:"a",wrong:["an","the always","—"],why:"Hot begins with a consonant sound and the drink is non-specific."},
      {q:"The passenger needs some ___.",answer:"assistance",wrong:["assistances","an assistance","the assistances"],why:"Assistance is uncountable."},
      {q:"She is worried ___ her short connection.",answer:"about",wrong:["of","in","at"],why:"Worried about is the correct combination."},
      {q:"The request was made ___ the flight.",answer:"during",wrong:["at","on","to"],why:"During + event/period."},
      {q:"The passenger is lactose intolerant, ___ we need a dairy-free option.",answer:"so",wrong:["although","however","first"],why:"So introduces the result."},
      {q:"I apologised; ___, I offered an alternative.",answer:"then",wrong:["because","although","despite"],why:"Then sequences the next action."},
      {q:"I hope you will be interested ___ my profile.",answer:"in",wrong:["of","at","for"],why:"Interested in is the correct combination."},
      {q:"Best ___",answer:"regards",wrong:["regard","regarding","regarded"],why:"The standard professional closing is Best regards."}
    ]
  }
};

const typedSets = {
  foundationGrid: {scoreKey:"foundationGrid", section:"foundations", points:2, data:[
    {prompt:"I ___ available today. (be)", answers:["am"], explanation:"I am."},
    {prompt:"The passenger ___ worried. (be)", answers:["is"], explanation:"Singular subject: is."},
    {prompt:"The passengers ___ ready. (be)", answers:["are"], explanation:"Plural subject: are."},
    {prompt:"___ you have an allergy? (do)", answers:["do"], explanation:"Present simple question with you: Do."},
    {prompt:"The passenger ___ not need a seat change. (do)", answers:["does"], explanation:"Singular present simple negative helper: does."},
    {prompt:"The crew ___ confirmed the meal. (have)", answers:["has"], explanation:"Crew is singular here: has."}
  ]},
  presentSimpleTyped: {scoreKey:"presentSimpleTyped", section:"presentSimple", points:2, data:[
    {prompt:"The purser ___ the cabin before every flight. (check)", answers:["checks"], explanation:"Third-person singular + -s."},
    {prompt:"We ___ meals after take-off. (serve)", answers:["serve"], explanation:"We + base form."},
    {prompt:"The passenger ___ meat. (not / eat)", answers:["does not eat","doesn't eat"], explanation:"Does not + base verb."},
    {prompt:"___ the passenger ___ assistance? (need)", answers:["does the passenger need"], explanation:"Does + subject + base verb."},
    {prompt:"I ___ the final arrival time. (not / know)", answers:["do not know","don't know"], explanation:"I + do not + base verb."},
    {prompt:"Safety ___ our first priority. (remain)", answers:["remains"], explanation:"Safety is singular: remains."}
  ]},
  presentContinuousTyped: {scoreKey:"presentContinuousTyped", section:"presentContinuous", points:2, data:[
    {prompt:"I ___ the passenger’s request now. (record)", answers:["am recording"], explanation:"I am + verb-ing."},
    {prompt:"The crew ___ the ingredients. (check)", answers:["is checking"], explanation:"Crew is singular here: is checking."},
    {prompt:"The passengers ___ at the gate. (wait)", answers:["are waiting"], explanation:"Plural subject: are waiting."},
    {prompt:"She ___ well at the moment. (not / feel)", answers:["is not feeling","isn't feeling"], explanation:"Is not + verb-ing."},
    {prompt:"___ you ___ to Paris today? (travel)", answers:["are you travelling","are you traveling"], explanation:"Are + subject + verb-ing."}
  ]},
  pastTyped: {scoreKey:"pastTyped", section:"pastSimple", points:2, data:[
    {prompt:"The passenger ___ a special meal. (request)", answers:["requested"], explanation:"Regular past: requested."},
    {prompt:"I ___ the passenger a blanket. (give)", answers:["gave"], explanation:"Give → gave."},
    {prompt:"The crew ___ immediate action. (take)", answers:["took"], explanation:"Take → took."},
    {prompt:"We ___ the final message. (not / receive)", answers:["did not receive","didn't receive"], explanation:"Did not + base verb."},
    {prompt:"___ you ___ to the purser? (speak)", answers:["did you speak"], explanation:"Did + subject + base verb."},
    {prompt:"The ground team ___ a wheelchair. (bring)", answers:["brought"], explanation:"Bring → brought."}
  ]},
  perfectTyped: {scoreKey:"perfectTyped", section:"presentPerfect", points:2, data:[
    {prompt:"The passenger ___ the wrong tray. (receive)", answers:["has received"], explanation:"Has + received."},
    {prompt:"We ___ the ingredients. (check)", answers:["have checked"], explanation:"Have + checked."},
    {prompt:"The assistance ___ yet. (not / arrive)", answers:["has not arrived","hasn't arrived"], explanation:"Has not + past participle."},
    {prompt:"___ you ___ the purser? (inform)", answers:["have you informed"], explanation:"Have + subject + past participle."},
    {prompt:"I ___ in aviation for more than ten years. (work)", answers:["have worked"], explanation:"Duration continuing to now: have worked."},
    {prompt:"The captain ___ the delay. (just / confirm)", answers:["has just confirmed"], explanation:"Has + just + past participle."}
  ]},
  questionTransform: {scoreKey:"questionTransform", section:"questions", points:2, data:[
    {prompt:"Upgrade: “What do you want?”", answers:["what would you prefer","may i ask what you would prefer","could you tell me what you would prefer"], explanation:"Use would prefer or an indirect question for premium service."},
    {prompt:"Upgrade: “Give me your boarding pass.”", answers:["could you show me your boarding pass","may i see your boarding pass","could i see your boarding pass"], explanation:"Use could/may for a polite request."},
    {prompt:"Upgrade: “Where is your seat?”", answers:["could you tell me where your seat is","may i ask where your seat is"], explanation:"Indirect question: statement word order, where your seat is."},
    {prompt:"Upgrade: “Do you have allergies?”", answers:["may i ask whether you have any allergies","could you tell me whether you have any allergies","do you have any allergies"], explanation:"Any makes the neutral question natural; indirect wording is more refined."}
  ]},
  errorRepair: {scoreKey:"errorRepair", section:"errorClinic", points:2, data:[
    {prompt:"im 37 years old and I live in Vélizy-Villacoublay.", answers:["i'm 37 years old and i live in vélizy-villacoublay","i am 37 years old and i live in vélizy-villacoublay"], explanation:"Use capital I and the apostrophe in I’m."},
    {prompt:"I’m flight attendant.", answers:["i'm a flight attendant","i am a flight attendant"], explanation:"A singular job title needs an article: a flight attendant."},
    {prompt:"I love cooking and take care of people.", answers:["i love cooking and taking care of people"], explanation:"Parallel structure: cooking and taking."},
    {prompt:"I’m very available.", answers:["i'm fully available","i am fully available","i have full availability"], explanation:"Fully available or I have full availability is more natural professionally."},
    {prompt:"I would like to send you my cv with my letter of motivation.", answers:["i would like to send you my cv and cover letter","i would like to send you my cv together with my cover letter"], explanation:"Use CV and cover letter; and is more natural than with here."},
    {prompt:"I hope you will be interested of my profil.", answers:["i hope you will be interested in my profile"], explanation:"Interested in + profile."},
    {prompt:"Best regard", answers:["best regards"], explanation:"The standard closing is plural: Best regards."},
    {prompt:"I have two children's.", answers:["i have two children"], explanation:"Children is already plural; no apostrophe and no final -s."}
  ]}
};

const wordOrderSentences = [
  ["Could","you","tell","me","which","meal","you","requested?"],
  ["Has","the","passenger","received","the","replacement","meal?"],
  ["Did","you","inform","the","purser","about","the","allergy?"],
  ["Would","you","prefer","still","or","sparkling","water?"],
  ["Are","you","feeling","better","now?"],
  ["Does","the","passenger","need","connection","assistance?"]
];

const dialogueData = [
  {before:"Crew: ", answer:"May", options:["Did","May","Has","Must"], after:" I see your boarding pass, please?", why:"May I…? politely asks permission."},
  {before:"Passenger: I have a nut allergy. Crew: The dish ", answer:"may", options:["may","did","would to","has"], after:" contain traces of nuts, so I’ll verify it.", why:"May expresses possibility."},
  {before:"Crew: You ", answer:"must", options:["might","must","would","could"], after:" remain seated until the sign is switched off.", why:"Must expresses a safety obligation."},
  {before:"Crew: ", answer:"Would", options:["Did","Have","Would","Are"], after:" you prefer the vegetarian pasta or the salad?", why:"Would you prefer…? offers a polite choice."},
  {before:"Crew: You ", answer:"do not have to", options:["must not","do not have to","may not ever","should to"], after:" change seats; this one is suitable.", why:"No obligation = do not have to."}
];

const sectionRequirements = {
  method:["methodQuiz"], foundations:["foundationGrid","foundationQuiz"], presentSimple:["presentSimpleTyped","presentSimpleQuiz"], presentContinuous:["presentContinuousTyped","presentContrastQuiz"], pastSimple:["pastTyped","pastQuiz"], presentPerfect:["perfectTyped","pastPerfectQuiz"], future:["futureQuiz","futureBuilder"], questions:["questionQuiz","wordOrder","questionTransform"], modals:["modalQuiz","modalDialogue"], precision:["precisionQuiz"], connectors:["connectorQuiz","handoverBuilder"], errorClinic:["errorRepair","profileWriting"], finalMission:["finalQuiz","finalPlanning"]
};
const allSections = ["briefing","method","foundations","presentSimple","presentContinuous","pastSimple","presentPerfect","future","questions","modals","precision","connectors","errorClinic","finalMission","debrief","qualiopi"];
const competencies = [
  ["Time-frame selection","Choose routine, current, finished, present-result and future forms"],
  ["Core conjugation","Control be, do, have and main-verb forms"],
  ["Question formation","Use auxiliaries and indirect word order accurately"],
  ["Professional modal language","Express obligation, permission, advice and polite service"],
  ["Precision grammar","Use articles, quantity words and prepositions"],
  ["Information transfer","Connect and reformulate cabin information"],
  ["Written accuracy","Repair recurring errors and develop a professional profile"],
  ["Oral grammar transfer","Use target grammar during a spontaneous response"]
];

let state = {completed:{}, activities:{}, scores:{}, quizAnswers:{}, typedValues:{}, formValues:{}, startedAt:Date.now(), lastSection:"briefing"};
let mediaRecorder = null, mediaChunks = [], timerHandle = null;

function safeLoad(){try{const raw=localStorage.getItem(STORAGE_KEY);if(raw) state={...state,...JSON.parse(raw)};}catch(e){console.warn("Storage unavailable",e);}}
function safeSave(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}catch(e){console.warn("Storage unavailable",e);} updateDashboard();}
function normalize(value){return String(value||"").toLowerCase().trim().replace(/[’]/g,"'").replace(/[?.!,;:]/g,"").replace(/\s+/g," ");}
function escapeHtml(s){return String(s).replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));}
function showToast(msg){$toast.textContent=msg;$toast.classList.add("show");setTimeout(()=>$toast.classList.remove("show"),2200);}
function copyText(text){navigator.clipboard?.writeText(text).then(()=>showToast("Copied")).catch(()=>showToast("Copy unavailable"));}
function downloadText(filename,text,type="text/plain"){const blob=new Blob([text],{type});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),500);}
function speak(text, lang){if(!("speechSynthesis" in window)){showToast("Speech is not supported in this browser.");return;}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang=lang||qs("#accentSelect").value||"en-GB";u.rate=.92;speechSynthesis.speak(u);}
function optionOrder(item,index){const wrong=[...item.wrong];const positions=[2,0,3,1,1,3,0,2];const pos=Math.min(positions[index%positions.length],wrong.length);wrong.splice(pos,0,item.answer);return wrong;}
function setScore(key,earned,total){state.scores[key]={earned,total};safeSave();}
function setActivity(key,done=true){state.activities[key]=done;Object.entries(sectionRequirements).forEach(([section,reqs])=>{if(reqs.every(r=>state.activities[r])) state.completed[section]=true;});safeSave();}
function markCompleted(section){state.completed[section]=true;safeSave();}

function renderQuiz(id,config){const root=qs(`#${id}`);if(!root)return;root.innerHTML="";const saved=state.quizAnswers[id]||{};config.data.forEach((item,index)=>{const card=document.createElement("div");card.className="quiz-item";card.dataset.index=index;const options=optionOrder(item,index);card.innerHTML=`<p><strong>${index+1}.</strong> ${escapeHtml(item.q)}</p><div class="quiz-options">${options.map(o=>`<label><input type="radio" name="${id}-${index}" value="${escapeHtml(o)}"><span>${escapeHtml(o)}</span></label>`).join("")}</div><p class="instant-feedback"></p>`;qsa("input",card).forEach(input=>input.addEventListener("change",()=>evaluateQuiz(id,config,index,card,input.value)));root.appendChild(card);if(saved[index]){const input=qsa("input",card).find(i=>i.value===saved[index]);if(input){input.checked=true;evaluateQuiz(id,config,index,card,input.value,false);}}});if(!state.scores[config.scoreKey])setScore(config.scoreKey,0,config.data.length*config.points);}
function evaluateQuiz(id,config,index,card,value,save=true){const item=config.data[index];qsa("label",card).forEach(l=>l.classList.remove("correct","incorrect"));const correct=value===item.answer;const selected=qsa("input",card).find(i=>i.value===value);if(selected)selected.closest("label").classList.add(correct?"correct":"incorrect");const right=qsa("input",card).find(i=>i.value===item.answer);if(!correct&&right)right.closest("label").classList.add("correct");card.dataset.answered="true";card.dataset.correct=String(correct);const feedback=qs(".instant-feedback",card);feedback.className=`instant-feedback ${correct?"good":"bad"}`;feedback.textContent=`${correct?"Correct.":"Not quite."} ${item.why}`;state.quizAnswers[id]=state.quizAnswers[id]||{};state.quizAnswers[id][index]=value;const cards=qsa(".quiz-item",qs(`#${id}`));const earned=cards.filter(c=>c.dataset.correct==="true").length*config.points;const answered=cards.filter(c=>c.dataset.answered==="true").length;state.scores[config.scoreKey]={earned,total:config.data.length*config.points};if(answered===config.data.length)setActivity(id,true);if(save)safeSave();else updateDashboard();}

function renderTyped(id,config,grid=false){const root=qs(`#${id}`);if(!root)return;root.innerHTML="";const saved=state.typedValues[id]||{};config.data.forEach((item,index)=>{const card=document.createElement("div");card.className=grid?"typed-card":"typed-item";card.dataset.index=index;card.innerHTML=grid?`<label>${escapeHtml(item.prompt)}<input type="text" autocomplete="off"><span class="typed-feedback"></span></label>`:`<div class="typed-prompt"><strong>${index+1}.</strong> ${escapeHtml(item.prompt)}</div><input type="text" autocomplete="off" placeholder="Type the complete answer"><p class="typed-feedback"></p>`;const input=qs("input",card);input.value=saved[index]||"";const check=()=>evaluateTyped(id,config,index,card,input.value);input.addEventListener("blur",check);input.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();check();}});input.addEventListener("input",()=>{state.typedValues[id]=state.typedValues[id]||{};state.typedValues[id][index]=input.value;safeSave();});root.appendChild(card);if(input.value)evaluateTyped(id,config,index,card,input.value,false);});if(!state.scores[config.scoreKey])setScore(config.scoreKey,0,config.data.length*config.points);}
function evaluateTyped(id,config,index,card,value,save=true){const item=config.data[index],norm=normalize(value);if(!norm)return;const correct=item.answers.some(a=>normalize(a)===norm);card.classList.toggle("good",correct);card.classList.toggle("bad",!correct);card.dataset.answered="true";card.dataset.correct=String(correct);const fb=qs(".typed-feedback",card);fb.textContent=correct?`Correct. ${item.explanation}`:`Try again. Model: ${item.answers[0]}. ${item.explanation}`;fb.style.color=correct?"#16834a":"#b42318";const cards=qsa(gridSelector(id),qs(`#${id}`));const earned=cards.filter(c=>c.dataset.correct==="true").length*config.points;const answered=cards.filter(c=>c.dataset.answered==="true").length;state.scores[config.scoreKey]={earned,total:config.data.length*config.points};if(answered===config.data.length)setActivity(id,true);if(save)safeSave();else updateDashboard();}
function gridSelector(id){return id==="foundationGrid"?".typed-card":".typed-item";}

function shuffleDifferent(tokens){let result=[...tokens];for(let tries=0;tries<10;tries++){result=[...tokens].sort(()=>Math.random()-.5);if(result.join("|")!==tokens.join("|"))break;}return result;}
function renderWordOrder(){const root=qs("#wordOrderArea");root.innerHTML="";wordOrderSentences.forEach((tokens,index)=>{const card=document.createElement("div");card.className="word-order-card";card.innerHTML=`<p><strong>Question ${index+1}</strong></p><div class="word-bank"></div><div class="sentence-build"></div><p class="word-order-feedback"></p>`;const bank=qs(".word-bank",card),build=qs(".sentence-build",card);shuffleDifferent(tokens).forEach(token=>{const b=document.createElement("button");b.type="button";b.className="word-token";b.textContent=token;b.addEventListener("click",()=>{(b.parentElement===bank?build:bank).appendChild(b);evaluateWordOrder(card,tokens);});bank.appendChild(b);});root.appendChild(card);});if(!state.scores.wordOrder)setScore("wordOrder",0,12);}
function evaluateWordOrder(card,tokens){const built=qsa(".sentence-build .word-token",card).map(b=>b.textContent);const fb=qs(".word-order-feedback",card);if(built.length<tokens.length){fb.textContent=`${built.length}/${tokens.length} words placed`;return;}const correct=built.join(" ")===tokens.join(" ");card.dataset.correct=String(correct);fb.textContent=correct?"Correct — professional word order.":"Not quite. Move words back and try again.";fb.style.color=correct?"#16834a":"#b42318";const count=qsa(".word-order-card",qs("#wordOrderArea")).filter(c=>c.dataset.correct==="true").length;state.scores.wordOrder={earned:count*2,total:12};qs("#wordOrderResult").textContent=`${count}/6 correct`;if(count===6)setActivity("wordOrder",true);safeSave();}

function renderDialogue(){const root=qs("#modalDialogue");root.innerHTML="";dialogueData.forEach((item,index)=>{const line=document.createElement("div");line.className="dialogue-line";const opts=optionOrder({answer:item.answer,wrong:item.options.filter(o=>o!==item.answer)},index);line.innerHTML=`<strong>${index+1}.</strong> ${escapeHtml(item.before)}<select><option value="">Choose…</option>${opts.map(o=>`<option>${escapeHtml(o)}</option>`).join("")}</select>${escapeHtml(item.after)}<p class="instant-feedback"></p>`;const select=qs("select",line);select.addEventListener("change",()=>{const correct=select.value===item.answer;line.dataset.answered=select.value?"true":"false";line.dataset.correct=String(correct);const fb=qs(".instant-feedback",line);fb.className=`instant-feedback ${correct?"good":"bad"}`;fb.textContent=correct?`Correct. ${item.why}`:`Not quite. Correct answer: ${item.answer}. ${item.why}`;const lines=qsa(".dialogue-line",root);const earned=lines.filter(l=>l.dataset.correct==="true").length*2;const answered=lines.filter(l=>l.dataset.answered==="true").length;state.scores.modalDialogue={earned,total:10};if(answered===5)setActivity("modalDialogue",true);safeSave();});root.appendChild(line);});if(!state.scores.modalDialogue)setScore("modalDialogue",0,10);}

function updateBuilders(){const future=[qs("#futureOpen").value,qs("#futureAction").value,qs("#futureClose").value].join(" ");qs("#futureGenerated").textContent=future;state.formValues.futureGenerated=future;setActivity("futureBuilder",true);const handover=[qs("#handoverSituation").value,qs("#handoverProblem").value,qs("#handoverAction").value,qs("#handoverNext").value].join(" ");qs("#handoverGenerated").textContent=handover;state.formValues.handoverGenerated=handover;setActivity("handoverBuilder",true);}
function updateWriting(){const text=qs("#profileWriting").value;const count=(text.trim().match(/\b[\w’'-]+\b/g)||[]).length;qs("#profileWordCount").textContent=count;qs("#profileBadge").textContent=count===0?"Start writing":count<80?`${80-count} words to minimum`:count<=120?"Target length reached":"Above recommended length";state.formValues.profileWriting=text;if(count>=80)setActivity("profileWriting",true);safeSave();}
function updateFinalPlanning(){const values=["oralNow","oralResult","oralQuestion","oralFuture"].map(id=>qs(`#${id}`).value.trim());values.forEach((v,i)=>state.formValues[["oralNow","oralResult","oralQuestion","oralFuture"][i]]=v);if(values.every(Boolean))setActivity("finalPlanning",true);safeSave();}

function updateDashboard(){const scoreEntries=Object.values(state.scores);const earned=scoreEntries.reduce((s,x)=>s+(x.earned||0),0),total=scoreEntries.reduce((s,x)=>s+(x.total||0),0);qs("#scoreValue").textContent=earned;qs("#scoreTotal").textContent=total;qs("#reportScore").textContent=`${earned} / ${total}`;const completed=allSections.filter(s=>state.completed[s]).length;const pct=Math.round(completed/allSections.length*100);qs("#globalProgressText").textContent=`${pct}%`;qs("#globalProgressBar").style.width=`${pct}%`;qs("#reportCompletion").textContent=`${pct}%`;qsa(".side-nav a").forEach(a=>a.classList.toggle("done",!!state.completed[a.dataset.section]));updateEvaluation(earned,total,pct);}
function updateEvaluation(earned,total,pct){const ratio=total?earned/total:0;const scoreStatus=ratio>=.8?"Maîtrisé":ratio>=.6?"Acquis":ratio>0?"En cours":"Non commencé";const items=[`Interactive accuracy: ${Math.round(ratio*100)}% — ${scoreStatus}`,`Completed sections: ${allSections.filter(s=>state.completed[s]).length}/${allSections.length}`,`Typed conjugation evidence: ${typedMastery()}%`, `Question and modal evidence: ${groupMastery(["questionQuiz","wordOrder","questionTransform","modalQuiz","modalDialogue"])}%`, `Precision and transfer evidence: ${groupMastery(["precisionQuiz","connectorQuiz","errorRepair"])}%`];qs("#autoCriteria").innerHTML=items.map(x=>`<p class="auto-criterion"><span>✓</span>${escapeHtml(x)}</p>`).join("");qs("#competencyBoard").innerHTML=competencies.map((c,i)=>{const thresholds=["presentSimple","presentContinuous","pastSimple","presentPerfect","future","questions","modals","precision"];const done=!!state.completed[thresholds[i]];return `<div class="competency-row ${done?"achieved":""}"><span>${done?"✓":"○"}</span><div><strong>${c[0]}</strong><small>${c[1]}</small></div><em>${done?"Evidence collected":"In progress"}</em></div>`;}).join("");qs("#reportDate").textContent=qs("#lessonDate").value||new Date().toLocaleDateString("en-GB");const mins=Math.max(1,Math.round((Date.now()-(state.startedAt||Date.now()))/60000));qs("#reportDuration").textContent=qs("#actualDuration").value||`${mins} min active`;
}
function typedMastery(){return groupMastery(["foundationGrid","presentSimpleTyped","presentContinuousTyped","pastTyped","perfectTyped"]);}
function groupMastery(keys){let e=0,t=0;keys.forEach(k=>{if(state.scores[k]){e+=state.scores[k].earned;t+=state.scores[k].total;}});return t?Math.round(e/t*100):0;}

function collectFormValues(){qsa("input[type=text],input[type=date],textarea,select").forEach(el=>{if(el.id)state.formValues[el.id]=el.value;});qsa("input[type=range]").forEach(el=>{if(el.id||el.dataset.rubric)state.formValues[el.id||`rubric-${el.dataset.rubric}`]=el.value;});safeSave();}
function restoreFormValues(){Object.entries(state.formValues||{}).forEach(([id,val])=>{const el=qs(`#${CSS.escape(id)}`);if(el&&!["futureGenerated","handoverGenerated"].includes(id))el.value=val;});}
function reportText(){const e=Object.values(state.scores).reduce((s,x)=>s+(x.earned||0),0),t=Object.values(state.scores).reduce((s,x)=>s+(x.total||0),0);return `GRAMMAR ADD-ON — AMINATA TOURÉ\nGrammar for Cabin Excellence\n\nInteractive score: ${e}/${t}\nCompletion: ${qs("#reportCompletion").textContent}\nDate: ${qs("#lessonDate").value||new Date().toLocaleDateString("en-GB")}\nDuration: ${qs("#actualDuration").value||qs("#reportDuration").textContent}\n\nTRAINER VALIDATION\nTenses: ${qs("#tenseStatus").value}\nQuestions: ${qs("#questionStatus").value}\nProfessional grammar: ${qs("#professionalStatus").value}\nWriting: ${qs("#writingStatus").value}\nOral: ${qs("#oralStatus").value}\nOverall: ${qs("#overallStatus").value}\n\nLEARNER COMMENTS\n${qs("#learnerComments").value}\n\nTRAINER COMMENTS\n${qs("#trainerComments").value}\n\nNEXT PRIORITY\n${qs("#nextPriority").value}\n\nLearner: ${qs("#learnerName").value}\nTrainer: ${qs("#trainerName").value}`;}
function reportHtml(){return `<!doctype html><html><head><meta charset="utf-8"><title>Aminata Touré — Grammar Evaluation</title><style>body{font-family:Arial,sans-serif;color:#12213d;max-width:900px;margin:35px auto;padding:0 25px}h1{border-bottom:4px solid #d7193f;padding-bottom:12px}h2{margin-top:28px;color:#06183a}.summary{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.summary div{border:1px solid #ccd3df;padding:14px;border-radius:8px}pre{white-space:pre-wrap;font:inherit;line-height:1.6}.sign{display:grid;grid-template-columns:1fr 1fr;gap:25px;margin-top:40px}.sign div{border-top:1px solid #333;padding-top:8px}@media print{body{margin:0}}</style></head><body><h1>Aminata Touré — Grammar for Cabin Excellence</h1><div class="summary"><div><strong>Score</strong><br>${qs("#reportScore").textContent}</div><div><strong>Completion</strong><br>${qs("#reportCompletion").textContent}</div><div><strong>Date / duration</strong><br>${qs("#lessonDate").value||new Date().toLocaleDateString("en-GB")} · ${qs("#actualDuration").value||qs("#reportDuration").textContent}</div></div><h2>Progressive Qualiopi evaluation</h2><pre>${escapeHtml(reportText())}</pre><div class="sign"><div>Learner signature</div><div>Trainer signature</div></div></body></html>`;}

async function startRecording(){if(!navigator.mediaDevices?.getUserMedia){showToast("Microphone recording is not available.");return;}try{const stream=await navigator.mediaDevices.getUserMedia({audio:true});mediaChunks=[];mediaRecorder=new MediaRecorder(stream);mediaRecorder.ondataavailable=e=>{if(e.data.size)mediaChunks.push(e.data);};mediaRecorder.onstop=()=>{const blob=new Blob(mediaChunks,{type:mediaRecorder.mimeType||"audio/webm"});const url=URL.createObjectURL(blob);qs("#finalAudio").src=url;qs("#finalAudio").hidden=false;qs("#finalDownload").href=url;qs("#finalDownload").hidden=false;stream.getTracks().forEach(t=>t.stop());setActivity("finalPlanning",true);};mediaRecorder.start();qs("#finalRecordBtn").disabled=true;qs("#finalStopBtn").disabled=false;startTimer(90);showToast("Recording started");}catch(e){showToast("Please allow microphone access.");}}
function stopRecording(){if(mediaRecorder&&mediaRecorder.state!=="inactive")mediaRecorder.stop();qs("#finalRecordBtn").disabled=false;qs("#finalStopBtn").disabled=true;clearInterval(timerHandle);}
function startTimer(seconds=90){clearInterval(timerHandle);let left=seconds;const display=qs("#finalTimer");display.textContent=formatTime(left);timerHandle=setInterval(()=>{left--;display.textContent=formatTime(Math.max(0,left));if(left<=0){clearInterval(timerHandle);if(mediaRecorder?.state==="recording")stopRecording();}},1000);}
function formatTime(s){return `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;}

function setupEvents(){
  qs("#translationToggle").addEventListener("click",e=>{document.body.classList.toggle("show-fr");e.currentTarget.setAttribute("aria-pressed",document.body.classList.contains("show-fr"));});
  qs("#focusToggle").addEventListener("click",e=>{document.body.classList.toggle("focus-mode");e.currentTarget.setAttribute("aria-pressed",document.body.classList.contains("focus-mode"));});
  qs("#saveAllBtn").addEventListener("click",()=>{collectFormValues();showToast("Progress saved in this browser");});
  qs("#resumeBtn").addEventListener("click",()=>qs(`#${state.lastSection||"briefing"}`)?.scrollIntoView({behavior:"smooth"}));
  qsa(".tab-button").forEach(btn=>btn.addEventListener("click",()=>{qsa(".tab-button").forEach(b=>b.classList.toggle("active",b===btn));qsa(".tab-panel").forEach(p=>p.classList.toggle("active",p.id===`tab-${btn.dataset.tab}`));}));
  ["futureOpen","futureAction","futureClose","handoverSituation","handoverProblem","handoverAction","handoverNext"].forEach(id=>qs(`#${id}`).addEventListener("change",updateBuilders));
  qs("#speakFuture").addEventListener("click",()=>speak(qs("#futureGenerated").textContent));qs("#copyFuture").addEventListener("click",()=>copyText(qs("#futureGenerated").textContent));qs("#speakHandover").addEventListener("click",()=>speak(qs("#handoverGenerated").textContent));qs("#copyHandover").addEventListener("click",()=>copyText(qs("#handoverGenerated").textContent));
  qs("#profileWriting").addEventListener("input",updateWriting);qs("#copyProfile").addEventListener("click",()=>copyText(qs("#profileWriting").value));qs("#downloadProfile").addEventListener("click",()=>downloadText("aminata-grammar-professional-introduction.txt",qs("#profileWriting").value));qs("#listenProfileTask").addEventListener("click",()=>speak("Write a professional introduction of eighty to one hundred and twenty words. Include your role, experience, strengths, Air France objective and one example of passenger care. Use at least three different time forms."));
  qsa("[data-speak-target]").forEach(btn=>btn.addEventListener("click",()=>speak(qs(`#${btn.dataset.speakTarget}`).textContent)));
  ["oralNow","oralResult","oralQuestion","oralFuture"].forEach(id=>qs(`#${id}`).addEventListener("input",updateFinalPlanning));
  qs("#finalRecordBtn").addEventListener("click",startRecording);qs("#finalStopBtn").addEventListener("click",stopRecording);qs("#finalTimerBtn").addEventListener("click",()=>startTimer(90));
  qsa("input[type=range]").forEach(r=>r.addEventListener("input",()=>{const out=r.closest("label")?.querySelector("output");if(out)out.textContent=`${r.value}/5`;collectFormValues();}));
  qsa("#qualiopi input,#qualiopi textarea,#qualiopi select").forEach(el=>el.addEventListener("change",collectFormValues));
  qs("#lessonDate").value=qs("#lessonDate").value||new Date().toISOString().slice(0,10);
  qs("#downloadReportHtml").addEventListener("click",()=>downloadText("aminata-grammar-addon-qualiopi-evaluation.html",reportHtml(),"text/html"));
  qs("#copyReport").addEventListener("click",()=>copyText(reportText()));qs("#printLesson").addEventListener("click",()=>window.print());qs("#printReport").addEventListener("click",()=>{const w=window.open("","_blank");w.document.write(reportHtml());w.document.close();w.focus();w.print();});
  qs("#resetLesson").addEventListener("click",()=>{if(confirm("Reset all scores and saved answers for this lesson?")){try{localStorage.removeItem(STORAGE_KEY);}catch(e){}location.reload();}});
  qsa("input[type=text],textarea,select").forEach(el=>el.addEventListener("change",collectFormValues));
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){state.lastSection=entry.target.id;qsa(".side-nav a").forEach(a=>a.classList.toggle("active",a.dataset.section===entry.target.id));if(entry.target.classList.contains("completed-on-view")||entry.target.id==="qualiopi")markCompleted(entry.target.id);safeSave();}}),{rootMargin:"-30% 0px -60% 0px",threshold:.01});qsa(".lesson-section").forEach(s=>observer.observe(s));
}

function init(){safeLoad();restoreFormValues();Object.entries(quizSets).forEach(([id,cfg])=>renderQuiz(id,cfg));Object.entries(typedSets).forEach(([id,cfg])=>renderTyped(id,cfg,id==="foundationGrid"));renderWordOrder();renderDialogue();setupEvents();updateBuilders();updateWriting();updateFinalPlanning();qsa("input[type=range]").forEach(r=>{const v=state.formValues[r.id||`rubric-${r.dataset.rubric}`];if(v)r.value=v;const out=r.closest("label")?.querySelector("output");if(out)out.textContent=`${r.value}/5`;});markCompleted("briefing");updateDashboard();}

document.addEventListener("DOMContentLoaded",init);
