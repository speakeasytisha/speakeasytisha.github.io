const STORAGE_KEY = 'isabelle_lesson_23_interview_simulator_v2';
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
let activityState = {};
let manualStatus = {
  'oral-star':'not-started',
  'oral-mock':'not-started',
  'writing-followup':'not-started'
};
let manualComments = {'oral-star':'','oral-mock':'','writing-followup':''};
let listeningIndex = 0;
let recorder, chunks = [];

const sectionDefinitions = [
  {id:'identity', objective:'Present a clear professional identity', subject:'30-second profile and networking sentence', method:'QCM / immediate feedback', max:4},
  {id:'grammar', objective:'Use interview grammar accurately', subject:'Experience, motivation, clarification, advice/advise', method:'Fill-in / dropdown / immediate feedback', max:14},
  {id:'screening', objective:'Answer recruiter screening questions clearly', subject:'Availability, salary, Dutch level, relocation, role fit', method:'QCM / immediate feedback', max:8},
  {id:'listening', objective:'Understand and react to professional messages', subject:'Recruiter and agency audio scenarios', method:'Listening QCM / immediate feedback', max:5},
  {id:'technical', objective:'Select precise legal and real-estate interview language', subject:'Transactions, due diligence, stakeholders, risk', method:'QCM / immediate feedback', max:8},
  {id:'star', objective:'Structure achievement examples using STAR', subject:'Senior residence transaction story', method:'Word order / matching / immediate feedback', max:6},
  {id:'clarify', objective:'Clarify unexpected questions calmly', subject:'Repair phrases and indirect questions', method:'QCM / immediate feedback', max:6},
  {id:'oral-star', objective:'Present a professional STAR achievement orally', subject:'Complex transaction under time pressure', method:'Trainer observation / oral production', manual:true},
  {id:'oral-mock', objective:'Complete a realistic interview simulation', subject:'Recruiter + hiring manager + technical questions', method:'Trainer observation / oral simulation', manual:true},
  {id:'writing-followup', objective:'Write a professional follow-up message', subject:'Thank-you email and next-step confirmation', method:'Trainer observation / written production', manual:true}
];

const identityQuiz = [
  {q:'A recruiter says: “Could you briefly introduce yourself?”', a:'professional', section:'identity', options:{
    professional:'I am a real estate legal and commercial professional with over 24 years of experience in the French property sector.',
    tooLong:'I studied law a long time ago and after that I did many different things in real estate, so I can explain everything if you want.',
    tooSmall:'I worked in real estate and now I want a job in Holland.'
  }, why:'Start with a clear professional identity, then add details only when needed.'},
  {q:'Which sentence best explains your added value?', a:'dual', section:'identity', options:{
    dual:'I combine legal real-estate expertise with commercial experience and stakeholder coordination skills.',
    generic:'I am serious, motivated and I like real estate.',
    weak:'I can do many things because I have worked for a long time.'
  }, why:'The strongest version is precise: legal + commercial + coordination.'},
  {q:'A contact asks what kind of role you want. Choose the clearest answer.', a:'roles', section:'identity', options:{
    vague:'I am open to anything connected with property.',
    roles:'I am looking for a role involving real-estate transactions, contract negotiation, stakeholder coordination or business affairs.',
    tooNarrow:'I only want exactly the same job as before.'
  }, why:'A clear target helps people understand how to help.'},
  {q:'A Dutch professional asks why the Netherlands. Choose the most natural answer.', a:'nl', section:'identity', options:{
    nl:'I am planning the next stage of my career in the Netherlands and would like to contribute in an international real-estate environment.',
    personalOnly:'I have personal reasons, so I need to find something quickly.',
    apologetic:'I know it may be difficult for me, but I hope I can find something.'
  }, why:'Keep the answer positive, professional and future-focused.'}
];

const vocab = [
  ['profile','🧭','professional identity','identité professionnelle','the clear way you present who you are at work','Your professional identity should be clear in the first thirty seconds.','Say it before giving details.'],
  ['profile','⚖️','legal advisory work','conseil juridique','work that helps teams understand legal risks and solutions','My background includes legal advisory work for major real estate developers.','Useful in interviews and CVs.'],
  ['profile','🤝','stakeholder coordination','coordination des parties prenantes','working with different people involved in a project','Stakeholder coordination is essential in complex real-estate transactions.','Say stakeholder, not interlocutor.'],
  ['profile','📈','commercial perspective','vision commerciale','the ability to understand business objectives, not only legal rules','My commercial perspective helps me propose practical solutions.','Very useful for business affairs.'],
  ['recruiter','🧑‍💼','headhunter','chasseur de têtes','a recruiter who actively looks for candidates for a specific role','A headhunter contacted me about a legal and business affairs role.','Professional job-search word.'],
  ['recruiter','🏢','recruitment agency','cabinet de recrutement','a company that helps employers find candidates','I am speaking with a recruitment agency about opportunities in the Netherlands.','Can be temporary or permanent roles.'],
  ['recruiter','🕒','availability','disponibilité','when you can speak, start a role or attend an interview','I am available for a short call on Tuesday afternoon.','Be precise and easy to schedule.'],
  ['recruiter','💶','salary expectations','prétentions salariales','the salary range you expect for a role','I would prefer to understand the full scope of the role before discussing salary expectations in detail.','Useful when you need time.'],
  ['technical','🏗️','real-estate transaction','transaction immobilière','a property-related acquisition, sale, lease or investment operation','I have experience supporting complex real-estate transactions.','Broad useful term.'],
  ['technical','🔎','due diligence','audit préalable / due diligence','the process of checking legal, financial and technical information before a transaction','Due diligence helps identify risks before signing.','Important for investment roles.'],
  ['technical','🛡️','risk mitigation','réduction des risques','actions taken to reduce legal or commercial risk','My role was to identify risks and propose practical mitigation strategies.','Business-friendly legal language.'],
  ['technical','📑','contract negotiation','négociation contractuelle','discussion and adjustment of contractual terms','Contract negotiation requires clarity, diplomacy and legal precision.','Avoid “negociate”.'],
  ['technical','🏦','financing','financement','money or funding arranged for a project or transaction','Financing experience can be valuable in real-estate investment roles.','Mention transferable exposure carefully.'],
  ['technical','📊','portfolio management','gestion de portefeuille','management of several assets or properties as a group','Portfolio management requires legal, financial and operational coordination.','Useful for funds.'],
  ['culture','🇳🇱','direct communication','communication directe','clear and straightforward communication','Dutch professional culture often values direct communication and clear answers.','Direct does not mean rude.'],
  ['culture','⏱️','punctuality','ponctualité','arriving or replying at the agreed time','Punctuality creates a professional first impression.','Confirm time zones if needed.'],
  ['culture','👥','flat hierarchy','hiérarchie moins marquée','a workplace style with less visible distance between levels','In a flat hierarchy, it can be normal to share a clear opinion.','Stay polite and prepared.'],
  ['culture','💬','clarity','clarté','simple, direct and useful information','A clear answer is often better than a long explanation.','Helpful for Dutch interviews.'],
  ['followup','📩','follow-up email','mail de suivi','a short message after a call or interview','I am writing to follow up on our conversation.','Use follow up on.'],
  ['followup','🔁','to keep someone informed','tenir quelqu’un informé','to give updates when the situation changes','I will keep you informed of my availability.','Polite and professional.'],
  ['followup','🗓️','to confirm a call','confirmer un appel','to make sure both people agree on the time and topic','I am writing to confirm our call on Tuesday at 2 p.m.','Useful for interviews.'],
  ['followup','🙏','to thank someone for their time','remercier quelqu’un pour son temps','to show appreciation after a professional exchange','Thank you again for your time and for the useful information.','Good networking habit.']
];

const grammar = [
  {title:'Experience in + noun / verb-ing', rule:'Use experience in before a field or an activity.', fr:'On dit experience in + domaine ou action en -ing.', formula:'experience in + noun / verb-ing', questions:[
    {type:'fill', prompt:'I have experience ___ contract negotiation.', answers:['in'], hint:'experience in + noun'},
    {type:'fill', prompt:'I have experience in ___ complex contracts.', answers:['negotiating'], hint:'After a preposition, use verb-ing.'},
    {type:'select', prompt:'Choose the best sentence.', answer:'I have experience in coordinating different stakeholders.', choices:['I have experience to coordinate different stakeholders.','I have experience in coordinating different stakeholders.','I have experience for coordinate different stakeholders.']}
  ]},
  {title:'I would like to / I would be pleased to', rule:'Use would to sound polite, professional and confident.', fr:'Would permet de formuler une demande ou une disponibilité avec politesse.', formula:'I would + base verb', questions:[
    {type:'fill', prompt:'I ___ welcome the opportunity to discuss my profile.', answers:['would'], hint:'Use would + base verb.'},
    {type:'select', prompt:'Choose the most professional answer.', answer:'I would be pleased to arrange a short call next week.', choices:['I want a call next week.','I would be pleased to arrange a short call next week.','I am demanding a call next week.']},
    {type:'fill', prompt:'I would be pleased ___ provide further information.', answers:['to'], hint:'would be pleased to + base verb'}
  ]},
  {title:'Clarifying with indirect questions', rule:'Indirect questions sound more polite in professional conversations.', fr:'Les questions indirectes sont plus naturelles et polies en entretien.', formula:'Could you tell me + subject + verb', questions:[
    {type:'select', prompt:'Choose the polite version.', answer:'Could you tell me what the next step would be?', choices:['What is the next step?','Could you tell me what the next step would be?','Tell me the next step.']},
    {type:'fill', prompt:'Could you ___ what you mean by “business affairs”?', answers:['clarify','explain'], hint:'clarify or explain'},
    {type:'fill', prompt:'Let me make sure I ___ correctly.', answers:['understood'], hint:'Use past simple: understood.'}
  ]},
  {title:'Advice / advise', rule:'Advice is the noun. Advise is the verb.', fr:'Advice = le conseil. Advise = conseiller.', formula:'to advise someone / to give advice', questions:[
    {type:'select', prompt:'Choose the correct sentence.', answer:'I advise operational teams on legal risks.', choices:['I advice operational teams on legal risks.','I advise operational teams on legal risks.','I give advise to operational teams.']},
    {type:'fill', prompt:'I can provide practical ___ on contract risks.', answers:['advice'], hint:'You provide advice.'},
    {type:'fill', prompt:'My role was to ___ teams before signing.', answers:['advise'], hint:'Verb = advise.'}
  ]},
  {title:'Because / so / however', rule:'Use connectors to structure your answer clearly.', fr:'Les connecteurs permettent de structurer une réponse orale sans trop parler.', formula:'because = reason · so = consequence · however = contrast', questions:[
    {type:'fill', prompt:'Dutch is important, ___ I am actively developing my Dutch skills.', answers:['so'], hint:'Consequence: so.'},
    {type:'fill', prompt:'I understand the requirement. ___, my international experience could be relevant.', answers:['however'], hint:'Contrast: however.'}
  ]}
];

const screening = [
  {q:'Recruiter: “When would you be available for a first call?”', a:'precise', options:{precise:'Thank you. I would be available on Tuesday afternoon or Thursday morning. Would either of those times suit you?', vague:'I am available sometimes next week, tell me when.', tooMuch:'I can move everything if needed because this is important.'}, why:'Offer two clear options and make scheduling easy.'},
  {q:'Recruiter: “What kind of role are you looking for?”', a:'targeted', options:{targeted:'I am looking for a role involving real-estate transactions, contract negotiation, stakeholder coordination or business affairs.', vague:'Anything in real estate could be interesting.', tooNarrow:'Only one precise title would interest me.'}, why:'A recruiter needs clear keywords.'},
  {q:'Recruiter: “Do you speak Dutch?”', a:'honest', options:{honest:'I am actively learning Dutch and I am committed to developing it. In the meantime, I can work in English in an international environment.', defensive:'No, but Dutch is very difficult and I cannot do everything at once.', overpromise:'Yes, I can work fully in Dutch immediately.'}, why:'Be honest, positive and professionally realistic.'},
  {q:'Recruiter: “Are you already in the Netherlands?”', a:'relocation', options:{relocation:'I am currently based in France, but I am preparing a move to the Netherlands and can discuss realistic timing.', weak:'No, I am not there, so I do not know.', vague:'Maybe later, depending on everything.'}, why:'Give a clear situation and invite a practical discussion.'},
  {q:'Recruiter: “What are your salary expectations?”', a:'range', options:{range:'I would like to understand the scope of the role first, but I am open to discussing a realistic range based on responsibilities and market practice.', fixed:'I cannot answer until you tell me everything.', low:'I will accept anything because I want to move.'}, why:'Do not undersell your profile; ask for context.'},
  {q:'Recruiter: “Why should a Dutch company consider your profile?”', a:'value', options:{value:'I bring a dual legal and commercial perspective, long real-estate experience and the ability to coordinate stakeholders in complex projects.', emotional:'Because I really want to live in the Netherlands.', unsure:'I hope my experience could maybe be useful.'}, why:'Answer with value, not only motivation.'},
  {q:'Recruiter: “Would you consider a temporary assignment?”', a:'open', options:{open:'I would be open to discussing a temporary or project-based assignment if it is aligned with my real-estate and legal experience.', noContext:'No, I only want a perfect permanent role.', tooOpen:'Yes, anything is fine.'}, why:'Stay open but protect your professional positioning.'},
  {q:'Recruiter: “Can you send me your CV?”', a:'send', options:{send:'Of course. I will send my CV after this call, along with a short summary of my profile.', informal:'Yes, I can send it if I find the right version.', abrupt:'Already sent.'}, why:'Confirm the action and add a professional summary.'}
];

const listenings = [
  {title:'Recruiter voicemail', script:'Hello Isabelle, this is Anna from Bridge Talent. Thank you for your application. Your profile could be relevant for an international real estate role. Could you send me your updated CV and let me know your availability for a short call next week?', question:'What should you do next?', options:['Send your updated CV and propose availability.','Wait until the recruiter calls again.','Send a long explanation of your whole career.'], answer:0, model:'Thank you for your message. I would be pleased to send my updated CV. I am available on Tuesday afternoon or Thursday morning for a short call. Please let me know which option would suit you best.'},
  {title:'Dutch-language concern', script:'Your experience is interesting. However, for this role, Dutch is important because many internal documents and meetings are in Dutch. Could you tell me more about your Dutch level?', question:'Which reply is best?', options:['Be honest and explain your learning plan.','Say you are fluent to keep the opportunity.','Avoid the question and talk about French experience.'], answer:0, model:'I understand that Dutch is important. I am currently learning Dutch and I am committed to developing my professional Dutch skills. I would also be happy to discuss whether my English and French real-estate experience could be useful in an international team.'},
  {title:'Agency reply', script:'Thank you for contacting us. We do not have a vacancy at the moment, but your background is interesting. We may have opportunities later this year.', question:'What is the best follow-up?', options:['Thank them and ask to stay in touch.','Tell them they should create a role for you.','Do not answer because there is no vacancy.'], answer:0, model:'Thank you for your reply. I understand that there is no vacancy at the moment. I would be grateful if you kept my profile in mind for future opportunities aligned with my legal and commercial real-estate experience.'},
  {title:'Unexpected salary question', script:'Before we continue, could you give me an idea of your salary expectations for the Dutch market?', question:'What should you do?', options:['Ask for the scope first and discuss a realistic range.','Give the lowest possible number.','Refuse to answer completely.'], answer:0, model:'I would prefer to understand the full scope of the role and responsibilities before giving a precise figure. However, I am open to discussing a realistic range based on the Dutch market and the level of responsibility.'},
  {title:'Fast speaker', script:'Could you briefly walk me through your background and explain how your French property development experience could transfer to a Dutch real estate investment environment?', question:'What can you do if the question is too fast?', options:['Ask for clarification and repeat the key point.','Pretend you understood everything.','Answer a different question.'], answer:0, model:'Of course. Could I just clarify one point? Would you like me to focus mainly on my legal transaction experience or on my commercial property development background?'}
];

const technical = [
  {q:'Which word means checking legal, financial and technical information before a transaction?', a:'due diligence', options:['due diligence','portfolio','referral'], why:'Due diligence is the checking process before a transaction.'},
  {q:'Which phrase is best for “parties prenantes”?', a:'stakeholders', options:['interlocutors','stakeholders','actors'], why:'Stakeholders is the professional word for people or groups involved in a project.'},
  {q:'How can you explain legal value to management?', a:'business', options:['I only explain the law and the business decides.','I identify risks and propose practical, business-oriented solutions.','I avoid giving advice if the topic is complex.'], why:'Business-oriented legal advice is practical and solution-focused.'},
  {q:'Which phrase is strongest for negotiation?', a:'drafted and negotiated', options:['I made contracts.','I drafted and negotiated real-estate development contracts.','I saw contracts sometimes.'], why:'Drafted and negotiated is precise and senior.'},
  {q:'Choose the best phrase for “cession” in a transaction context.', a:'disposal', options:['disposal','disappearance','departure'], why:'Disposal can mean sale or transfer of an asset in business/property contexts.'},
  {q:'Which answer connects sales experience to a legal/business role?', a:'commercial', options:['My sales experience is separate from legal work.','My sales experience helps me understand client needs, negotiation dynamics and business priorities.','Sales is not useful here.'], why:'This transforms sales into added value.'},
  {q:'Which answer is best if financing is not your strongest area?', a:'transferable', options:['I do not know financing, so I cannot discuss it.','I have not specialised in financing, but I have worked on transactions where legal, commercial and financial issues had to be coordinated.','I will learn everything after I start.' ], why:'Acknowledge the limit and show transferable exposure.'},
  {q:'Which phrase is best for external professionals?', a:'external advisers', options:['external advisers','outside people','foreign actors'], why:'External advisers is natural for lawyers, notaries, consultants and specialists.'}
];

const starItems = [
  {title:'Situation', order:['In 2021, I worked on a complex senior serviced-residence transaction.','The project involved multiple stakeholders and a very short timeline.'], target:'In 2021, I worked on a complex senior serviced-residence transaction. The project involved multiple stakeholders and a very short timeline.'},
  {title:'Task', order:['My task was to help finalise key off-plan sale and lease documentation','so that the transaction could move forward before the deadline.'], target:'My task was to help finalise key off-plan sale and lease documentation so that the transaction could move forward before the deadline.'},
  {title:'Action', order:['I coordinated with internal teams and external advisers,','prioritised the main legal risks and followed up closely with the stakeholders.'], target:'I coordinated with internal teams and external advisers, prioritised the main legal risks and followed up closely with the stakeholders.'},
  {title:'Result', order:['As a result, the documentation was completed on time','and the transaction supported the business unit’s objectives.'], target:'As a result, the documentation was completed on time and the transaction supported the business unit’s objectives.'},
  {title:'Transfer to new role', order:['This experience is relevant because it shows my ability','to combine legal precision, negotiation and business awareness.'], target:'This experience is relevant because it shows my ability to combine legal precision, negotiation and business awareness.'},
  {title:'Dutch market bridge', order:['In the Netherlands, I would bring the same structured approach','while adapting to local practices and continuing to develop my Dutch.'], target:'In the Netherlands, I would bring the same structured approach while adapting to local practices and continuing to develop my Dutch.'}
];

const clarify = [
  {q:'The recruiter speaks too fast. What do you say?', a:'slow', options:{slow:'Could you speak a little more slowly, please?', panic:'I do not understand anything.', silence:'...' }, why:'Ask calmly and specifically.'},
  {q:'You do not know a technical word. What do you say?', a:'clarify', options:{clarify:'Could you clarify what you mean by that term?', pretend:'Yes, of course.', avoid:'That is not important.'}, why:'Clarifying is professional.'},
  {q:'You need to check you understood the next step. What do you say?', a:'confirm', options:{confirm:'Let me make sure I understood correctly: you would like me to send my CV and availability by email.', direct:'What do I do now?', lost:'I am lost.'}, why:'Reformulate the action.'},
  {q:'You need details in writing after a phone call. What do you say?', a:'email', options:{email:'Could you send me the details by email, please?', pushy:'You must send everything now.', weak:'Maybe send something if possible.'}, why:'Short, polite and practical.'},
  {q:'You need time before answering a salary question. What do you say?', a:'time', options:{time:'May I take a little time to consider the full scope of the role before giving a precise figure?', no:'I cannot answer.', low:'I accept any salary.'}, why:'You protect your position while staying cooperative.'},
  {q:'You are asked about Dutch and feel nervous. What do you say?', a:'dutch', options:{dutch:'I understand that Dutch is important. I am actively learning and committed to improving quickly.', sorry:'I am sorry, my Dutch is not good, so maybe it is impossible.', false:'My Dutch is already fluent.'}, why:'Honesty + action plan + confidence.'}
];


const recordingTasks = [
  {title:'Recruiter screening answer', task:'Record a 60-second answer to: Could you briefly introduce yourself and explain what kind of role you are looking for?', cues:['professional identity','24 years of experience','legal + commercial profile','Netherlands project'], model:'I am a real estate legal and commercial professional with over 24 years of experience in the French property sector. I am looking for a role where I can combine contract negotiation, transaction support, stakeholder coordination and practical business advice in an international real-estate environment.'},
  {title:'Dutch-language question', task:'Record a calm answer to: This role requires Dutch. How would you manage that?', cues:['honest','actively learning','committed','international value'], model:'I understand that Dutch is important. I am actively learning Dutch and I am committed to developing my professional Dutch skills. In the meantime, I believe I can contribute through my real-estate experience, my English communication skills and my ability to work with international stakeholders.'},
  {title:'Salary and availability', task:'Record an answer to: What are your salary expectations and when could you start?', cues:['scope first','realistic range','Dutch market','relocation timing'], model:'I would prefer to understand the full scope of the role before giving a precise figure, but I am open to discussing a realistic range based on the responsibilities and the Dutch market. Regarding availability, I am currently based in France, but I am preparing my move and can discuss a realistic start date.'},
  {title:'Technical value', task:'Record an answer to: How could your French real-estate experience be useful for our company?', cues:['transferable skills','risk analysis','negotiation','external advisers','business priorities'], model:'Although the legal framework is different, many skills are transferable. I can analyse risk, coordinate internal teams and external advisers, negotiate contractual points and support business objectives. My commercial experience also helps me understand client needs and practical constraints.'},
  {title:'Unexpected situation', task:'Record a short repair phrase for this situation: the recruiter speaks too fast and you need clarification.', cues:['stay calm','ask politely','repeat the key point','continue professionally'], model:'Could you speak a little more slowly, please? I want to make sure I understand the question correctly. Are you asking me about my legal transaction experience or about my commercial real-estate background?'}
];

const writingTasks = [
  {title:'After a recruiter call', prompt:'Write a short thank-you email after a first recruiter call.', cues:['thank the recruiter','summarise your profile','confirm next step','professional closing'], model:'Dear [Name],\n\nThank you for taking the time to speak with me today. I appreciated the opportunity to explain my legal and commercial real-estate background and to learn more about the type of opportunities you are currently following in the Netherlands.\n\nAs discussed, please find attached my CV. I would be pleased to provide any further information you may need.\n\nKind regards,\nIsabelle'},
  {title:'After no reply', prompt:'Write a polite follow-up one week after sending a speculative application.', cues:['refer to previous message','stay polite','ask to keep profile in mind','no pressure'], model:'Dear [Name],\n\nI hope you are well. I am writing to follow up on the speculative application I sent last week.\n\nI remain very interested in opportunities where my legal and commercial real-estate experience could be useful, particularly in contract negotiation, transaction support and stakeholder coordination.\n\nThank you again for your time and consideration. I would be grateful if you kept my profile in mind for any suitable current or future opportunities.\n\nKind regards,\nIsabelle'},
  {title:'Clarify interview details', prompt:'Write an email to confirm a scheduled interview and ask who will attend.', cues:['thank them','confirm date/time','ask politely','professional tone'], model:'Dear [Name],\n\nThank you for arranging the interview. I am writing to confirm our meeting on [day] at [time].\n\nCould you please let me know who will attend the interview and whether there is anything specific you would like me to prepare in advance?\n\nI look forward to speaking with you.\n\nKind regards,\nIsabelle'}
];

const mockPrompts = [
  {title:'1. Recruiter opening', question:'Could you briefly introduce yourself?', cues:['legal + commercial profile','24 years','French property sector','current Netherlands project'], model:'I am a real estate legal and commercial professional with over 24 years of experience in the French property sector. My background combines legal advisory work, property development, contract negotiation, risk analysis and sales management. I am now looking to bring this dual perspective to an international real-estate environment in the Netherlands.'},
  {title:'2. Motivation', question:'Why are you interested in opportunities in the Netherlands?', cues:['new professional chapter','international environment','real estate market','adaptability'], model:'I am preparing the next stage of my career in the Netherlands. I am interested in the international dimension of the Dutch real-estate market and in roles where I could use my legal, commercial and stakeholder-management experience. I know I need to keep developing my Dutch, and I am committed to doing that seriously.'},
  {title:'3. Role target', question:'What type of role are you looking for?', cues:['transactions','contracts','stakeholders','business affairs','real-estate development'], model:'I am looking for a role involving real-estate transactions, contract negotiation, stakeholder coordination or business affairs. I would be particularly interested in a position where I can combine legal analysis with practical business support.'},
  {title:'4. Technical value', question:'How would your French real-estate experience be useful in a Dutch company?', cues:['transferable skills','risk analysis','negotiation','external advisers','client needs'], model:'Although the legal framework is different, many skills are transferable. I can analyse risks, coordinate with internal teams and external advisers, negotiate contractual points and support business objectives. My commercial experience also helps me understand client needs and practical constraints.'},
  {title:'5. STAR achievement', question:'Tell me about a complex transaction you managed.', cues:['senior residence','short deadline','stakeholders','actions','result'], model:'In 2021, I worked on a complex senior serviced-residence transaction with multiple stakeholders and a very short timeline. My task was to help finalise key off-plan sale and lease documentation before the deadline. I coordinated with internal teams and external advisers, prioritised the main legal risks and followed up closely with the stakeholders. As a result, the documentation was completed on time and the transaction supported the business unit’s objectives.'},
  {title:'6. Dutch question', question:'This role requires Dutch. How would you manage that?', cues:['honest','actively learning','international value','commitment'], model:'I understand that Dutch is important, especially for local documents and internal communication. I am actively learning Dutch and I am committed to developing my professional Dutch skills. In the meantime, I believe I could contribute through my legal and commercial real-estate experience, my English communication skills and my ability to work with international stakeholders.'},
  {title:'7. Salary and availability', question:'What are your salary expectations and when could you start?', cues:['scope first','market range','relocation timing','practical discussion'], model:'I would prefer to understand the full scope of the role before giving a precise figure, but I am open to discussing a realistic range based on the responsibilities and the Dutch market. Regarding timing, I am currently based in France, but I am preparing a move to the Netherlands and can discuss a realistic start date.'},
  {title:'8. Your questions', question:'Do you have any questions for us?', cues:['team','role priorities','Dutch/English balance','next steps'], model:'Yes, thank you. I would like to understand what the main priorities for this role would be during the first six months. I would also be interested to know how the team works with external advisers and what balance of Dutch and English is used in day-to-day communication.'}
];

function norm(v){return String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘]/g,"'").replace(/[.,!?;:]/g,'').replace(/\s+/g,' ').trim();}
function speak(text){
  if(!('speechSynthesis' in window)){ alert('Audio not available on this device.'); return; }
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = $('#accent')?.value || 'en-GB';
  u.rate = .9;
  speechSynthesis.speak(u);
}
function recordActivity(id, section, ok){
  activityState[id] = {section, ok: !!ok, touched:true, at:new Date().toISOString()};
  saveState(false);
  renderEvaluation();
}
function sectionStats(id){
  const def = sectionDefinitions.find(d=>d.id===id);
  const items = Object.values(activityState).filter(x=>x.section===id);
  const correct = items.filter(x=>x.ok).length;
  const touched = items.length;
  return {correct, touched, max:def?.max||0};
}
function statusFrom(correct,max,touched){
  if(!touched) return 'not-started';
  const pct = max ? Math.round(correct/max*100) : 0;
  if(pct >= 80) return 'achieved';
  if(pct >= 50) return 'progress';
  return 'not-achieved';
}
function statusLabel(s){return {'achieved':'Objectif atteint','progress':'Objectif en cours d’acquisition','not-achieved':'Objectif non atteint','not-started':'Non commencé'}[s]||s;}
function updateScore(){
  const auto = sectionDefinitions.filter(d=>!d.manual);
  const max = auto.reduce((n,d)=>n+d.max,0);
  const correct = Object.values(activityState).filter(x=>x.ok).length;
  $('#score').textContent = correct;
  $('#maxScore').textContent = max;
}
function shuffleEntries(entries, correctKey){
  const shuffled = entries.slice().sort(()=>Math.random()-.5);
  if(shuffled.length > 1 && String(shuffled[0].key) === String(correctKey)){
    const first = shuffled.shift();
    shuffled.push(first);
  }
  return shuffled;
}
function normaliseChoiceConfig(item){
  const raw = item.options;
  let entries = [];
  let correctKey = String(item.a ?? item.answer ?? '');
  if(Array.isArray(raw)){
    entries = raw.map((text,idx)=>({key:String(idx), text:String(text)}));
    if(typeof item.answer === 'number') correctKey = String(item.answer);
    else if(typeof item.a === 'number') correctKey = String(item.a);
    else {
      const found = entries.find(e=>norm(e.text)===norm(item.a));
      if(found) correctKey = found.key;
    }
  } else {
    entries = Object.entries(raw).map(([key,text])=>({key:String(key), text:String(text)}));
    if(!entries.some(e=>e.key===correctKey)){
      const found = entries.find(e=>norm(e.text)===norm(item.a));
      if(found) correctKey = found.key;
    }
  }
  return {entries:shuffleEntries(entries, correctKey), correctKey};
}
function choiceButtons(container, item, idBase, section){
  const cfg = normaliseChoiceConfig(item);
  container.innerHTML = `<article class="quiz-card"><h3>${item.q}</h3><div class="options-vertical">${cfg.entries.map(e=>`<button data-choice="${escapeAttr(e.key)}">${e.text}</button>`).join('')}</div><div class="feedback"></div></article>`;
  $$('button[data-choice]', container).forEach(btn=>{
    btn.onclick = () => {
      const ok = String(btn.dataset.choice) === String(cfg.correctKey);
      $$('button[data-choice]', container).forEach(b=>b.classList.remove('correct-choice','wrong-choice','selected'));
      btn.classList.add(ok?'correct-choice':'wrong-choice');
      const fb = $('.feedback', container);
      fb.textContent = ok ? '✅ Correct. ' + item.why : '❌ Not the best option. ' + item.why;
      fb.className = 'feedback ' + (ok ? 'correct' : 'incorrect');
      recordActivity(idBase, section, ok);
    };
  });
}

function renderIdentity(){
  $('#identityQuiz').innerHTML = identityQuiz.map((q,i)=>`<div id="identity-${i}"></div>`).join('');
  identityQuiz.forEach((q,i)=>choiceButtons($('#identity-'+i), q, 'identity-'+i, q.section));
}
function renderVocab(){
  const f = $('#vocabFilter').value;
  const q = norm($('#vocabSearch').value);
  const rows = vocab.filter(v => (f==='all'||v[0]===f) && (!q || norm(v.join(' ')).includes(q)) );
  $('#vocabGrid').innerHTML = rows.map((v,i)=>`<article class="vocab-card"><div class="term-line"><div class="icon">${v[1]}</div><span class="tag">${v[0]}</span></div><h3>${v[2]}</h3><p class="frbox"><strong>FR:</strong> ${v[3]}</p><small><strong>Meaning:</strong> ${v[4]}</small><p class="model">${v[5]}</p><small><strong>Coach note:</strong> ${v[6]}</small><button class="say" data-say="${escapeAttr(v[5])}">🔊 Example</button></article>`).join('') || '<p>No vocabulary found.</p>';
  bindSay();
}
function escapeAttr(s){return String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');}
function renderGrammar(){
  $('#grammarGrid').innerHTML = grammar.map((g,gi)=>`<article class="grammar-card"><h3>${g.title}</h3><div class="rule"><strong>Rule:</strong> ${g.rule}</div><div class="frbox"><strong>FR:</strong> ${g.fr}</div><div class="formula">${g.formula}</div><div class="practice" id="grammar-${gi}"></div></article>`).join('');
  grammar.forEach((g,gi)=>{
    const area = $('#grammar-'+gi);
    area.innerHTML = g.questions.map((q,qi)=>{
      const id = `grammar-${gi}-${qi}`;
      if(q.type==='select'){
        return `<div class="quiz-card" data-qid="${id}"><p><strong>${q.prompt}</strong></p><select data-select="${id}"><option value="">Choose...</option>${q.choices.map(c=>`<option>${c}</option>`).join('')}</select><div class="feedback"></div></div>`;
      }
      return `<div class="quiz-card" data-qid="${id}"><p><strong>${q.prompt}</strong></p><input class="fill-input" data-fill="${id}" placeholder="Type the missing word"><div class="small-note">Hint: ${q.hint}</div><div class="feedback"></div></div>`;
    }).join('');
    g.questions.forEach((q,qi)=>{
      const id = `grammar-${gi}-${qi}`;
      const card = $(`[data-qid="${id}"]`);
      if(q.type==='select'){
        const sel = $(`[data-select="${id}"]`);
        sel.onchange = () => {
          if(!sel.value){ $('.feedback',card).textContent=''; return; }
          const ok = sel.value === q.answer;
          $('.feedback',card).textContent = ok ? '✅ Correct.' : '❌ Not yet. Correct answer: ' + q.answer;
          $('.feedback',card).className = 'feedback ' + (ok?'correct':'incorrect');
          recordActivity(id,'grammar',ok);
        };
      }else{
        const input = $(`[data-fill="${id}"]`);
        input.oninput = () => {
          const val = norm(input.value);
          if(!val){ $('.feedback',card).textContent=''; return; }
          const ok = q.answers.map(norm).includes(val);
          $('.feedback',card).textContent = ok ? '✅ Correct.' : '❌ Keep going. Expected: ' + q.answers.join(' / ');
          $('.feedback',card).className = 'feedback ' + (ok?'correct':'incorrect');
          recordActivity(id,'grammar',ok);
        };
      }
    });
  });
}
function renderScreening(){
  $('#screeningGrid').innerHTML = screening.map((q,i)=>`<div id="screen-${i}"></div>`).join('');
  screening.forEach((q,i)=>choiceButtons($('#screen-'+i), q, 'screen-'+i, 'screening'));
}
function renderListening(){
  const l = listenings[listeningIndex % listenings.length];
  const entries = shuffleEntries(l.options.map((text,idx)=>({key:String(idx), text:String(text)})), String(l.answer));
  $('#listeningTitle').textContent = l.title;
  $('#listeningQuestion').textContent = l.question;
  $('#listeningOptions').innerHTML = entries.map(e=>`<button data-listen-choice="${e.key}">${e.text}</button>`).join('');
  $('#scriptBox').textContent = l.script;
  $('#modelReplyBox').innerHTML = `<strong>Model answer:</strong><br>${l.model}<br><button class="say" data-say="${escapeAttr(l.model)}">🔊 Listen to model answer</button>`;
  $('#scriptBox').classList.add('hidden');
  $('#modelReplyBox').classList.add('hidden');
  $('#listeningFeedback').textContent = '';
  $$('[data-listen-choice]').forEach(btn=>{
    btn.onclick = () => {
      const ok = Number(btn.dataset.listenChoice) === l.answer;
      $$('[data-listen-choice]').forEach(b=>b.classList.remove('correct-choice','wrong-choice'));
      btn.classList.add(ok?'correct-choice':'wrong-choice');
      $('#listeningFeedback').textContent = ok ? '✅ Correct. Now reveal the model answer and practise replying.' : '❌ Not quite. Listen again, then check the script.';
      $('#listeningFeedback').className = 'feedback ' + (ok?'correct':'incorrect');
      recordActivity('listening-'+(listeningIndex%listenings.length),'listening',ok);
    };
  });
  bindSay();
}

function renderTechnical(){
  $('#technicalGrid').innerHTML = technical.map((q,i)=>`<div id="tech-${i}"></div>`).join('');
  technical.forEach((q,i)=>{
    const correctText = q.options.includes(q.a) ? q.a : q.options[1];
    choiceButtons($('#tech-'+i), {q:q.q, a:correctText, options:q.options, why:q.why}, 'technical-'+i, 'technical');
  });
}

function renderStar(){
  $('#starGrid').innerHTML = starItems.map((item,i)=>{
    const shuffled = item.order.slice().sort(()=>Math.random()-.5);
    return `<article class="star-card" data-star="${i}"><h3>${item.title}</h3><p>Put the idea in the best order. Feedback appears as you build.</p><div class="sentence-output" id="starOut-${i}" data-value=""></div><div class="block-bank" id="starBank-${i}">${shuffled.map(part=>`<button data-part="${escapeAttr(part)}">${part}</button>`).join('')}</div><div class="buttons"><button class="ghost" data-clear-star="${i}">Clear</button><button class="say" data-say="${escapeAttr(item.target)}">🔊 Model</button></div><div class="feedback" id="starFb-${i}"></div></article>`;
  }).join('');
  starItems.forEach((item,i)=>{
    $$(`#starBank-${i} button`).forEach(btn=>{
      btn.onclick = () => addStarPart(i, btn);
    });
    $(`[data-clear-star="${i}"]`).onclick = () => resetStar(i);
  });
  bindSay();
}
function addStarPart(i, btn){
  const part = btn.dataset.part;
  const out = $(`#starOut-${i}`);
  const current = out.dataset.value ? JSON.parse(out.dataset.value) : [];
  current.push(part);
  out.dataset.value = JSON.stringify(current);
  const span = document.createElement('span'); span.textContent = part; out.appendChild(span);
  btn.disabled = true;
  const built = current.join(' ');
  const target = starItems[i].target;
  const fb = $(`#starFb-${i}`);
  if(target.startsWith(built) && built !== target){
    fb.textContent = '🟡 Good so far. Continue.';
    fb.className = 'feedback partial';
  } else if(built === target){
    fb.textContent = '✅ Correct. Practise saying it without reading.';
    fb.className = 'feedback correct';
    recordActivity('star-'+i,'star',true);
  } else {
    fb.textContent = '❌ The order is not right. Clear and try again.';
    fb.className = 'feedback incorrect';
    recordActivity('star-'+i,'star',false);
  }
}
function resetStar(i){
  const out = $(`#starOut-${i}`); out.innerHTML=''; out.dataset.value='';
  $$(`#starBank-${i} button`).forEach(b=>b.disabled=false);
  $(`#starFb-${i}`).textContent='';
}
function renderClarify(){
  $('#clarifyGrid').innerHTML = clarify.map((q,i)=>`<div id="clarify-${i}"></div>`).join('');
  clarify.forEach((q,i)=>choiceButtons($('#clarify-'+i), q, 'clarify-'+i, 'clarify'));
}
function renderWriting(){
  $('#writingGrid').innerHTML = writingTasks.map((w,i)=>`<article class="write-card"><h3>${w.title}</h3><p><strong>Task:</strong> ${w.prompt}</p><div class="cue-list">${w.cues.map(c=>`<span>${c}</span>`).join('')}</div><textarea class="write-text" data-write="${i}" placeholder="Write your answer here..."></textarea><div class="character-counter" id="count-${i}">0 words</div><div class="buttons"><button data-model="${i}">Show model</button><button class="say" data-say="${escapeAttr(w.model)}">🔊 Listen to model</button></div><div class="model hidden" id="writeModel-${i}">${w.model.replace(/\n/g,'<br>')}</div></article>`).join('');
  $$('[data-write]').forEach(t=>t.oninput=()=>{
    const words = t.value.trim()?t.value.trim().split(/\s+/).length:0;
    $(`#count-${t.dataset.write}`).textContent = words + ' words';
  });
  $$('[data-model]').forEach(b=>b.onclick=()=> $(`#writeModel-${b.dataset.model}`).classList.toggle('hidden'));
  bindSay();
}
function renderRecordingTask(){
  if(!$('#recordTaskSelect')) return;
  if(!$('#recordTaskSelect').innerHTML){
    $('#recordTaskSelect').innerHTML = recordingTasks.map((r,i)=>`<option value="${i}">${r.title}</option>`).join('');
  }
  const r = recordingTasks[Number($('#recordTaskSelect').value)||0];
  $('#recordTaskCard').innerHTML = `<h3>${r.title}</h3><p><strong>Task:</strong> ${r.task}</p><div class="cue-list">${r.cues.map(c=>`<span>${c}</span>`).join('')}</div><div class="buttons"><button id="showRecordModel">Show model answer</button><button class="say" data-say="${escapeAttr(r.task)}">🔊 Listen to task</button><button class="say" data-say="${escapeAttr(r.model)}">🔊 Listen to model</button></div><div id="recordModel" class="model hidden">${r.model}</div>`;
  $('#showRecordModel').onclick = () => $('#recordModel').classList.toggle('hidden');
  bindSay();
}
function randomRecordingTask(){
  const sel = $('#recordTaskSelect');
  if(!sel) return;
  const next = (Number(sel.value) + 1 + Math.floor(Math.random()*(recordingTasks.length-1))) % recordingTasks.length;
  sel.value = String(next);
  renderRecordingTask();
}

function renderMock(){
  $('#mockMenu').innerHTML = mockPrompts.map((m,i)=>`<button data-mock="${i}" class="${i===0?'active':''}">${m.title}</button>`).join('');
  $$('[data-mock]').forEach(btn=>btn.onclick=()=>showMock(Number(btn.dataset.mock)));
  showMock(0);
}
function showMock(i){
  const m = mockPrompts[i];
  $$('[data-mock]').forEach(b=>b.classList.toggle('active', Number(b.dataset.mock)===i));
  $('#mockCard').innerHTML = `<h3>${m.title}</h3><p class="pill">Question</p><p class="model">${m.question}</p><button class="say" data-say="${escapeAttr(m.question)}">🔊 Listen to question</button><h4>Cue cards — speak first, then reveal the model</h4><div class="cue-list">${m.cues.map(c=>`<span>${c}</span>`).join('')}</div><textarea rows="5" placeholder="Trainer or learner notes during the live answer..."></textarea><div class="buttons"><button id="showMockModel">Show model answer</button><button class="say" data-say="${escapeAttr(m.model)}">🔊 Listen to model</button></div><div id="mockModel" class="model hidden">${m.model}</div>`;
  $('#showMockModel').onclick = () => $('#mockModel').classList.toggle('hidden');
  bindSay();
}
function bindSay(){ $$('.say').forEach(btn=>btn.onclick=()=>speak(btn.dataset.say)); }
function syncManual(key,value){
  const base = key.replace('-footer','');
  manualStatus[base] = value;
  $$(`[data-manual="${base}"], [data-manual="${base}-footer"]`).forEach(sel=>{if(sel.value!==value) sel.value=value;});
  saveState(false); renderEvaluation();
}
function syncComment(key,value){ manualComments[key]=value; saveState(false); }
function renderEvaluation(){
  updateScore();
  const rows = $('#evaluationRows'); if(!rows) return;
  rows.innerHTML = sectionDefinitions.map(d=>{
    if(d.manual){
      const st = manualStatus[d.id] || 'not-started';
      return `<tr><td>${d.objective}</td><td>${d.subject}</td><td>${d.method}</td><td class="score-mini">Évaluation manuelle</td><td><span class="status ${st}">${statusLabel(st)}</span></td></tr>`;
    }
    const s = sectionStats(d.id);
    const st = statusFrom(s.correct,d.max,s.touched);
    const pct = d.max ? Math.round(s.correct/d.max*100) : 0;
    return `<tr><td>${d.objective}</td><td>${d.subject}</td><td>${d.method}</td><td class="score-mini">${s.correct}/${d.max} — ${pct}%</td><td><span class="status ${st}">${statusLabel(st)}</span></td></tr>`;
  }).join('');
  const completed = sectionDefinitions.filter(d=> d.manual ? (manualStatus[d.id]||'not-started')!=='not-started' : sectionStats(d.id).touched>0).length;
  const rate = Math.round(completed/sectionDefinitions.length*100);
  $('#completionRate').textContent = rate+'%';
  const statuses = sectionDefinitions.map(d=> d.manual ? (manualStatus[d.id]||'not-started') : statusFrom(sectionStats(d.id).correct,d.max,sectionStats(d.id).touched));
  let overall = 'not-started';
  if(statuses.some(s=>s!=='not-started')) overall = statuses.every(s=>s==='achieved') ? 'achieved' : statuses.some(s=>s==='not-achieved') ? 'not-achieved' : 'progress';
  $('#overallStatus').textContent = statusLabel(overall);
  $('#overallStatus').className = 'status '+overall;
}
function collectState(){
  return {
    version:1,
    activityState,
    manualStatus,
    manualComments,
    learner:$('#learnerName')?.value||'Isabelle Davion',
    trainer:$('#trainerName')?.value||'Tisha DOUTY-DOSIERE',
    date:$('#evaluationDate')?.value||'',
    oralComments:$('#oralComments')?.value||'',
    writingComments:$('#writingComments')?.value||'',
    trainerComments:$('#trainerComments')?.value||'',
    lastSaved:new Date().toISOString()
  };
}
function saveState(show=true){
  try{
    const state = collectState();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    if($('#lastSaved')) $('#lastSaved').textContent = new Date(state.lastSaved).toLocaleString();
    if(show) alert('Progress saved in this browser. / Progression enregistrée dans ce navigateur.');
  }catch(e){ console.warn('Save failed',e); }
}
function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY); if(!raw) return;
    const s = JSON.parse(raw);
    activityState = s.activityState || {};
    manualStatus = {...manualStatus, ...(s.manualStatus||{})};
    manualComments = {...manualComments, ...(s.manualComments||{})};
    if($('#learnerName')) $('#learnerName').value = s.learner || 'Isabelle Davion';
    if($('#trainerName')) $('#trainerName').value = s.trainer || 'Tisha DOUTY-DOSIERE';
    if($('#evaluationDate') && s.date) $('#evaluationDate').value = s.date;
    if($('#oralComments')) $('#oralComments').value = s.oralComments || '';
    if($('#writingComments')) $('#writingComments').value = s.writingComments || '';
    if($('#trainerComments')) $('#trainerComments').value = s.trainerComments || '';
    if($('#lastSaved') && s.lastSaved) $('#lastSaved').textContent = new Date(s.lastSaved).toLocaleString();
    Object.keys(manualStatus).forEach(k=>$$(`[data-manual="${k}"], [data-manual="${k}-footer"]`).forEach(sel=>sel.value=manualStatus[k]));
    Object.keys(manualComments).forEach(k=>$$(`[data-comment="${k}"]`).forEach(t=>t.value=manualComments[k]));
  }catch(e){ console.warn('Load failed',e); }
}
function reportRows(){
  return sectionDefinitions.map(d=>{
    if(d.manual){
      const st = manualStatus[d.id] || 'not-started';
      return [d.objective,d.subject,d.method,'Evaluation manuelle',statusLabel(st)];
    }
    const s = sectionStats(d.id); const st=statusFrom(s.correct,d.max,s.touched); const pct=d.max?Math.round(s.correct/d.max*100):0;
    return [d.objective,d.subject,d.method,`${s.correct}/${d.max} - ${pct}%`,statusLabel(st)];
  });
}
function escapeHtml(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function safeFileName(s){return String(s||'report').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9_-]+/g,'-').replace(/^-+|-+$/g,'');}
function downloadBlob(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1500);}
function getOverallReportData(){renderEvaluation();return {learner:$('#learnerName')?.value||'',trainer:$('#trainerName')?.value||'',date:$('#evaluationDate')?.value||'',completion:$('#completionRate')?.textContent||'0%',overall:$('#overallStatus')?.textContent||'Non commencé',oralComments:$('#oralComments')?.value||'',writingComments:$('#writingComments')?.value||'',trainerComments:$('#trainerComments')?.value||'',manualComments,rows:reportRows()};}
function downloadReadableHTML(){
  saveState(false); const d=getOverallReportData();
  const rows=d.rows.map(r=>`<tr>${r.map(c=>`<td>${escapeHtml(c)}</td>`).join('')}</tr>`).join('');
  const manual = Object.entries(d.manualComments).map(([k,v])=>`<h3>${escapeHtml(k)}</h3><div class="box comments">${escapeHtml(v)||'No section comment.'}</div>`).join('');
  const html=`<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Bilan Qualiopi - ${escapeHtml(d.learner)}</title><style>body{font-family:Arial,sans-serif;color:#222;max-width:1100px;margin:35px auto;padding:0 24px}h1{color:#102235}h2{color:#1f7a86}table{border-collapse:collapse;width:100%;font-size:13px}th,td{border:1px solid #aaa;padding:8px;vertical-align:top}th{background:#eee}.meta{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin:18px 0}.box{border:1px solid #bbb;padding:10px;border-radius:8px}.comments{white-space:pre-wrap;min-height:70px}@media print{body{margin:0;max-width:none}}</style></head><body><h1>Bilan d'evaluation des acquis - Qualiopi</h1><h2>Lesson 23 - Netherlands Real Estate Interview Simulator</h2><div class="meta"><div class="box"><b>Apprenante:</b> ${escapeHtml(d.learner)}</div><div class="box"><b>Formatrice:</b> ${escapeHtml(d.trainer)}</div><div class="box"><b>Date:</b> ${escapeHtml(d.date)}</div><div class="box"><b>Completion:</b> ${escapeHtml(d.completion)}</div><div class="box"><b>Resultat global:</b> ${escapeHtml(d.overall)}</div></div><table><thead><tr><th>Objectif pedagogique</th><th>Support / sujet</th><th>Mode d'evaluation</th><th>Score</th><th>Resultat</th></tr></thead><tbody>${rows}</tbody></table><h2>Commentaires par section</h2>${manual}<h2>Commentaires oraux</h2><div class="box comments">${escapeHtml(d.oralComments)||'Aucun commentaire oral.'}</div><h2>Commentaires écrits</h2><div class="box comments">${escapeHtml(d.writingComments)||'Aucun commentaire écrit.'}</div><h2>Commentaires généraux de la formatrice</h2><div class="box comments">${escapeHtml(d.trainerComments)||'Aucun commentaire général.'}</div><p><small>Rapport genere depuis la page interactive. Les resultats restent sauvegardes dans le navigateur utilise.</small></p></body></html>`;
  downloadBlob(new Blob([html],{type:'text/html;charset=utf-8'}),`${safeFileName(d.learner)}-Lesson-23-Bilan-Qualiopi.html`);
}
function latinText(s){return String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘]/g,"'").replace(/[“”]/g,'"').replace(/[–—]/g,'-').replace(/[^\x20-\x7E]/g,'');}
function pdfEscape(s){return latinText(s).replace(/\\/g,'\\\\').replace(/\(/g,'\\(').replace(/\)/g,'\\)');}
function wrapText(text,max=92){const words=latinText(text).split(/\s+/);const lines=[];let line='';for(const w of words){if(!w)continue;const next=line?line+' '+w:w;if(next.length>max&&line){lines.push(line);line=w}else line=next}if(line)lines.push(line);return lines.length?lines:[''];}
function buildSimplePDF(d){
  const pageW=595,pageH=842,left=42,top=800,bottom=45,lineH=14;let pages=[[]],y=top;
  function addLine(text,size=10,bold=false){const wrapped=wrapText(text,size>=14?70:94);for(const ln of wrapped){if(y<bottom){pages.push([]);y=top}pages[pages.length-1].push({text:ln,x:left,y,size,bold});y-=size>=14?20:lineH;}}
  function gap(n=8){y-=n;}
  addLine('BILAN D EVALUATION DES ACQUIS - QUALIOPI',17,true); addLine('Lesson 23 - Netherlands Real Estate Interview Simulator',12,true); gap();
  addLine(`Apprenante: ${d.learner}`); addLine(`Formatrice: ${d.trainer}`); addLine(`Date: ${d.date}`); addLine(`Completion: ${d.completion} | Resultat global: ${d.overall}`); gap(12);
  d.rows.forEach((r,i)=>{addLine(`${i+1}. Objectif: ${r[0]}`,11,true); addLine(`Support / sujet: ${r[1]}`); addLine(`Mode d evaluation: ${r[2]}`); addLine(`Score: ${r[3]} | Resultat: ${r[4]}`); gap(7);});
  addLine('Commentaires oraux',12,true); addLine(d.oralComments||'Aucun commentaire oral.'); gap(); addLine('Commentaires ecrits',12,true); addLine(d.writingComments||'Aucun commentaire ecrit.'); gap(); addLine('Commentaires generaux',12,true); addLine(d.trainerComments||'Aucun commentaire general.');
  Object.entries(d.manualComments||{}).forEach(([k,v])=>{gap(); addLine(`Commentaire section - ${k}`,11,true); addLine(v||'Aucun commentaire.');});
  const objs=[]; const obj=body=>{objs.push(body);return objs.length;};
  const font1=obj('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>'); const font2=obj('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');
  const pageRefs=[], contentRefs=[];
  for(const lines of pages){let stream='';for(const l of lines){stream+=`BT /${l.bold?'F2':'F1'} ${l.size} Tf 1 0 0 1 ${l.x} ${l.y} Tm (${pdfEscape(l.text)}) Tj ET\n`;} contentRefs.push(obj(`<< /Length ${stream.length} >>\nstream\n${stream}endstream`)); pageRefs.push(obj('PLACEHOLDER'));}
  const pagesRef=obj('PLACEHOLDER_PAGES');
  pageRefs.forEach((ref,i)=>{objs[ref-1]=`<< /Type /Page /Parent ${pagesRef} 0 R /MediaBox [0 0 ${pageW} ${pageH}] /Resources << /Font << /F1 ${font1} 0 R /F2 ${font2} 0 R >> >> /Contents ${contentRefs[i]} 0 R >>`;});
  objs[pagesRef-1]=`<< /Type /Pages /Kids [${pageRefs.map(r=>r+' 0 R').join(' ')}] /Count ${pageRefs.length} >>`;
  const catalog=obj(`<< /Type /Catalog /Pages ${pagesRef} 0 R >>`); let out='%PDF-1.4\n%PDFREPORT\n',offsets=[0];
  for(let i=0;i<objs.length;i++){offsets.push(out.length);out+=`${i+1} 0 obj\n${objs[i]}\nendobj\n`;} const xref=out.length; out+=`xref\n0 ${objs.length+1}\n0000000000 65535 f \n`; for(let i=1;i<offsets.length;i++) out+=String(offsets[i]).padStart(10,'0')+' 00000 n \n'; out+=`trailer\n<< /Size ${objs.length+1} /Root ${catalog} 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return new Blob([new TextEncoder().encode(out)],{type:'application/pdf'});
}
function downloadPDFReport(){saveState(false);const d=getOverallReportData();downloadBlob(buildSimplePDF(d),`${safeFileName(d.learner)}-Lesson-23-Bilan-Qualiopi.pdf`);}
function resetProgress(){if(!confirm('Reset all saved results for this lesson?'))return;localStorage.removeItem(STORAGE_KEY);location.reload();}
function resetLessonOnly(){if(confirm('Clear saved data and restart this lesson?')){localStorage.removeItem(STORAGE_KEY);location.reload();}}
async function startRecording(){
  try{
    if(!navigator.mediaDevices?.getUserMedia) throw new Error('MediaRecorder not supported');
    const stream = await navigator.mediaDevices.getUserMedia({audio:true});
    chunks=[]; recorder = new MediaRecorder(stream);
    recorder.ondataavailable = e => chunks.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(chunks,{type:'audio/webm'}); const url=URL.createObjectURL(blob);
      $('#player').src=url; $('#downloadAudio').href=url; $('#downloadAudio').classList.remove('hidden');
      stream.getTracks().forEach(t=>t.stop());
    };
    recorder.start(); $('#startRec').disabled=true; $('#stopRec').disabled=false; $('#recStatus').textContent='Recording...';
  }catch(e){ $('#recStatus').textContent='Recording is not available here. Use Voice Memos or another recorder, then save the file separately.'; }
}
function stopRecording(){ if(recorder && recorder.state!=='inactive'){ recorder.stop(); $('#startRec').disabled=false; $('#stopRec').disabled=true; $('#recStatus').textContent='Recording stopped. Listen and download if needed.'; } }
function clearRecording(){ $('#player').removeAttribute('src'); $('#downloadAudio').classList.add('hidden'); $('#recStatus').textContent='Recording cleared.'; }
function initEvaluation(){
  if($('#evaluationDate') && !$('#evaluationDate').value) $('#evaluationDate').value = new Date().toISOString().slice(0,10);
  loadState();
  $$('[data-manual]').forEach(sel=> sel.onchange = () => syncManual(sel.dataset.manual, sel.value));
  $$('[data-comment]').forEach(t=> t.oninput = () => syncComment(t.dataset.comment, t.value));
  ['oralComments','writingComments','trainerComments','learnerName','trainerName','evaluationDate'].forEach(id=>{const el=$('#'+id); if(el) el.oninput=()=>saveState(false);});
  $('#saveProgress').onclick = () => saveState(true);
  $('#downloadHtml').onclick = downloadReadableHTML;
  $('#downloadPdf').onclick = downloadPDFReport;
  $('#printReport').onclick = () => {saveState(false); window.print();};
  $('#resetProgress').onclick = resetProgress;
  renderEvaluation();
}
function init(){
  $('#maxScore').textContent = sectionDefinitions.filter(d=>!d.manual).reduce((n,d)=>n+d.max,0);
  renderIdentity(); renderVocab(); renderGrammar(); renderScreening(); renderListening(); renderTechnical(); renderStar(); renderClarify(); renderWriting(); renderRecordingTask(); renderMock();
  $('#vocabFilter').onchange=renderVocab; $('#vocabSearch').oninput=renderVocab;
  $('#listenAudio').onclick=()=>speak(listenings[listeningIndex%listenings.length].script);
  $('#newListening').onclick=()=>{listeningIndex=(listeningIndex+1)%listenings.length;renderListening();};
  $('#showScript').onclick=()=>$('#scriptBox').classList.toggle('hidden');
  $('#showModelReply').onclick=()=>$('#modelReplyBox').classList.toggle('hidden');
  $('#stopSpeech').onclick=()=>speechSynthesis.cancel();
  $('#printLesson').onclick=()=>window.print();
  $('#resetPage').onclick=resetLessonOnly;
  $('#startRec').onclick=startRecording; $('#stopRec').onclick=stopRecording; $('#clearRec').onclick=clearRecording; if($('#recordTaskSelect')) $('#recordTaskSelect').onchange=renderRecordingTask; if($('#newRecordTask')) $('#newRecordTask').onclick=randomRecordingTask;
  $$('[data-scroll]').forEach(b=>b.onclick=()=>document.querySelector(b.dataset.scroll).scrollIntoView({behavior:'smooth'}));
  bindSay(); initEvaluation();
}
document.addEventListener('DOMContentLoaded', init);
