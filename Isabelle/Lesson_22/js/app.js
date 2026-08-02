const DATA = {
  vocab: [
    ['people','🤝','recruiter','recruteur / recruteuse','A person who helps companies find candidates.','I spoke with a recruiter about a real-estate role.','speak with a recruiter'],
    ['people','🎯','headhunter','chasseur de têtes','A recruiter who searches for specific experienced profiles.','A headhunter contacted me about a legal role.','be contacted by a headhunter'],
    ['people','🏢','hiring manager','responsable du recrutement / manager opérationnel','The person in the company who may manage the new employee.','The hiring manager would like to arrange a first interview.','meet the hiring manager'],
    ['people','📇','professional contact','contact professionnel','Someone you know through work.','I am reconnecting with former professional contacts.','reconnect with a contact'],
    ['people','🔗','referral','recommandation / mise en relation','An introduction or recommendation that can lead to an opportunity.','Some roles are filled through referrals.','ask for a referral'],
    ['people','🏬','employment agency','agence de recrutement / agence d’emploi','An organisation that connects candidates and employers.','I contacted an employment agency specialising in real estate.','contact an agency'],
    ['people','⏳','temporary staffing agency','agence d’intérim','An agency for temporary assignments.','A temporary staffing agency may offer short assignments.','temporary assignment'],
    ['people','🧩','secondment agency','cabinet de détachement / detacheringsbureau','An agency that places professionals with client companies for projects.','A secondment agency could be useful for project-based legal roles.','secondment role'],

    ['contracts','📄','permanent role','poste permanent / CDI','A long-term position with no fixed end date.','I am open to a permanent role aligned with my experience.','permanent position'],
    ['contracts','🗓️','fixed-term contract','CDD / contrat à durée déterminée','A contract with a defined end date.','I would consider a fixed-term contract if the role is relevant.','fixed-term opportunity'],
    ['contracts','🛠️','temporary assignment','mission temporaire','A short-term work assignment.','A temporary assignment could be a good first step into the Dutch market.','short-term assignment'],
    ['contracts','🏠','hybrid work','travail hybride','A mix of office work and remote work.','Could you clarify whether the role is hybrid?','hybrid role'],
    ['contracts','⏱️','part-time','temps partiel','Working fewer hours than a full-time role.','I would be open to a part-time arrangement depending on the position.','part-time option'],
    ['contracts','📌','notice period','préavis','The time you must give before starting/leaving a job.','My notice period is flexible because I am currently exploring opportunities.','notice period'],

    ['process','📩','application','candidature','Your CV and letter for a role.','Thank you for considering my application.','submit an application'],
    ['process','💬','screening call','premier appel de sélection','A short call before a full interview.','I would be pleased to arrange a screening call.','first screening call'],
    ['process','🧭','shortlist','présélection','A smaller list of candidates selected after initial review.','I would be happy to know whether my profile could be shortlisted.','be shortlisted'],
    ['process','📅','availability','disponibilités','The times when you are free.','I am available on Tuesday afternoon or Thursday morning.','share your availability'],
    ['process','🔄','follow-up','suivi / relance','A message sent after a previous contact.','I am writing to follow up on the CV I sent last week.','follow up on something'],
    ['process','✅','next step','prochaine étape','What happens after the current exchange.','Could you let me know the next step in the process?','clarify the next step'],
    ['process','🧪','assessment','test / évaluation','A test or exercise used during recruitment.','Could you tell me whether there will be an assessment?','complete an assessment'],

    ['money','💶','salary expectation','prétention salariale','The salary you hope or expect to receive.','Could we discuss the salary range for the role?','salary expectations'],
    ['money','📊','salary range','fourchette salariale','The minimum and maximum salary for a role.','Could you share the salary range for this position?','share a salary range'],
    ['money','💼','package','package / rémunération globale','Salary plus benefits.','I would like to understand the overall package before giving a precise figure.','overall package'],
    ['money','🧾','gross salary','salaire brut','Salary before tax and deductions.','Is the figure gross annual salary?','gross annual salary'],
    ['money','🌿','benefits','avantages','Additional advantages such as insurance or pension.','Could you tell me more about the benefits?','salary and benefits'],
    ['money','🎯','competitive salary','salaire compétitif','A salary aligned with the market and the responsibilities.','I would be open to discussing a competitive salary in line with the role.','competitive salary'],

    ['communication','🔁','Could you repeat that, please?','Pouvez-vous répéter, s’il vous plaît ?','A polite way to ask someone to say something again.','Could you repeat the postcode, please?','ask someone to repeat'],
    ['communication','🐢','Could you speak a little more slowly?','Pouvez-vous parler un peu plus lentement ?','A polite way to slow the call down.','Could you speak a little more slowly, please?','slow down the call'],
    ['communication','🔎','Could you clarify what you mean?','Pouvez-vous préciser ce que vous voulez dire ?','A polite way to ask for more explanation.','Could you clarify what you mean by secondment?','clarify a point'],
    ['communication','📝','Could you send that in writing?','Pouvez-vous me l’envoyer par écrit ?','A useful way to confirm important details after a call.','Could you send the job description in writing?','confirm in writing'],
    ['communication','✅','Let me make sure I understood correctly.','Permettez-moi de vérifier que j’ai bien compris.','A professional way to read back information.','Let me make sure I understood correctly: the call is on Tuesday at 2 pm.','read back details'],
    ['communication','⏸️','Could I get back to you by email?','Puis-je vous répondre par e-mail ?','A safe phrase when you need time to think.','Could I get back to you by email after reviewing the details?','buy time professionally']
  ],
  inbox: [
    {id:'inbox1', title:'Message 1', text:'Thank you for your application. Your profile is interesting. Could we arrange a short call next week?', answer:'positive', options:['Positive reply: prepare availability','Final offer: negotiate salary immediately','Refusal: do not answer'], feedback:'This is a positive first step. Reply quickly, thank them and propose two clear time slots.'},
    {id:'inbox2', title:'Message 2', text:'Thank you for connecting. I am not the right person, but I can forward your profile to a colleague.', answer:'warm', options:['Warm reply: thank and make it easy','Pressure reply: ask for a job now','No reply needed'], feedback:'This is useful networking. Thank the person and attach or offer a short profile/CV.'},
    {id:'inbox3', title:'Message 3', text:'Dutch is essential for this role. What is your current level?', answer:'dutch', options:['Answer honestly and show a learning plan','Ignore the question','Say you are fluent if you are not'], feedback:'Be honest and positive. Show commitment without overpromising.'},
    {id:'inbox4', title:'Message 4', text:'Could you send me your CV and salary expectations?', answer:'cvmoney', options:['Send CV and ask about salary range if needed','Send a very long life story','Refuse to discuss anything'], feedback:'Send the CV and answer salary carefully. You can ask for the range or say you would like to understand the role first.'},
    {id:'inbox5', title:'Message 5', text:'We do not have a vacancy at the moment, but your background is interesting.', answer:'future', options:['Ask to be kept in mind for future opportunities','Apologise for bothering them','Send five more emails immediately'], feedback:'This is not a full refusal. Keep the door open politely.'},
    {id:'inbox6', title:'Message 6', text:'Please complete the attached assessment before Friday.', answer:'assessment', options:['Confirm receipt and clarify the deadline if needed','Complain that assessments are unfair','Ignore until Friday evening'], feedback:'Recruitment processes may include tests. Acknowledge receipt, confirm the deadline and ask practical questions if needed.'},
    {id:'inbox7', title:'Message 7', text:'We tried calling you. Could you let us know when you are available?', answer:'availability', options:['Apologise briefly and give two time slots','Wait several days','Reply only with “yes”'], feedback:'Give precise availability. Make the next step easy.'},
    {id:'inbox8', title:'Message 8', text:'Could you tell me what kind of role you are looking for in the Netherlands?', answer:'target', options:['Give a clear target role in 2–3 sentences','Send your entire CV in the message','Say “anything”'], feedback:'Never say “anything”. Give a focused target: legal, commercial, real estate, transactions, stakeholder coordination.'}
  ],
  replies: [
    {id:'reply1', prompt:'A recruiter asks for a call.', answer:0, options:[
      'Thank you for your message. I would be pleased to arrange a short call. I am available on Tuesday afternoon or Thursday morning.',
      'Hello, yes, call me whenever because I need a job.',
      'Thank you. I am very busy, so please send everything first.'
    ], feedback:'This is clear, polite and gives precise availability.'},
    {id:'reply2', prompt:'A contact says there is no vacancy now.', answer:1, options:[
      'Why not? I have a lot of experience.',
      'Thank you for letting me know. I would be grateful if you kept my profile in mind for future opportunities aligned with my experience.',
      'Ok.'
    ], feedback:'This keeps the relationship open without pressure.'},
    {id:'reply3', prompt:'A recruiter asks about Dutch.', answer:2, options:[
      'My Dutch is perfect.',
      'I do not speak Dutch, but this should not matter.',
      'I am actively developing my Dutch skills and I am committed to becoming effective in a Dutch professional environment.'
    ], feedback:'This is honest, positive and professional.'},
    {id:'reply4', prompt:'A person accepts your LinkedIn request.', answer:0, options:[
      'Thank you for connecting. I am currently exploring real-estate opportunities in the Netherlands and would be pleased to follow your work.',
      'Thank you. Can you send my CV to your director today?',
      'Thanks.'
    ], feedback:'This creates context without applying pressure.'},
    {id:'reply5', prompt:'A recruiter asks for salary expectations too early.', answer:1, options:[
      'I want the highest salary possible.',
      'I would like to understand the responsibilities and the overall package before giving a precise figure. Could you share the salary range for the role?',
      'I do not discuss salary.'
    ], feedback:'This buys time and asks for useful information.'},
    {id:'reply6', prompt:'You did not understand a phrase on the phone.', answer:2, options:[
      'I do not understand English.',
      'Please talk better.',
      'Could you clarify what you mean by that, please?'
    ], feedback:'This is a professional recovery phrase.'},
    {id:'reply7', prompt:'A recruiter proposes Monday at 14:00 but you need to confirm.', answer:0, options:[
      'Thank you. Monday at 2 pm works well for me. I look forward to speaking with you.',
      'Ok maybe.',
      'Can you call me another day?'
    ], feedback:'Confirm the day, time and positive next step.'},
    {id:'reply8', prompt:'You want details after a call.', answer:1, options:[
      'Send me everything.',
      'Thank you for the call. Could you send me the job description and next steps in writing, please?',
      'I forgot what you said.'
    ], feedback:'This is clear and protects you from misunderstanding details.'}
  ],
  grammar: [
    {id:'g1', title:'1. Polite request: Could you + base verb', rule:'Use Could you + base verb to ask for repetition, clarification or practical information.', fr:'Utilisez Could you + verbe de base pour demander poliment une répétition, une précision ou une information pratique.', formula:'Could you + repeat / clarify / send / confirm + ...?', examples:['Could you repeat that, please?','Could you clarify the salary range?','Could you send me the job description in writing?'], items:[
      {q:'Could you ___ the salary range?', a:['clarify'], hint:'verb: clarify'},
      {q:'Could you ___ that in writing?', a:['send'], hint:'verb: send'},
      {q:'Could you ___ the address, please?', a:['repeat','confirm'], hint:'verb: repeat / confirm'}
    ]},
    {id:'g2', title:'2. Indirect questions: polite word order', rule:'After Could you tell me, use statement word order: Could you tell me what the role involves?', fr:'Après Could you tell me, on garde l’ordre affirmatif : what the role involves, pas what does the role involve.', formula:'Could you tell me + question word + subject + verb?', examples:['Could you tell me what the role involves?','Could you explain how the process works?','Could you let me know when the interview would take place?'], items:[
      {q:'Could you tell me what the role ___?', a:['involves'], hint:'not “does involve”'},
      {q:'Could you explain how the process ___?', a:['works'], hint:'statement order'},
      {q:'Could you let me know when the interview ___ take place?', a:['would'], hint:'conditional auxiliary'}
    ]},
    {id:'g3', title:'3. Availability: on + day, at + time, from...to...', rule:'Use on for days, at for clock times, and from...to... for time ranges.', fr:'Utilisez on pour les jours, at pour les heures, et from...to... pour les plages horaires.', formula:'I am available on Tuesday at 2 pm / from 10 to 12.', examples:['I am available on Tuesday afternoon.','I am available at 2 pm.','I am available from 10 am to 12 pm.'], items:[
      {q:'I am available ___ Tuesday afternoon.', a:['on'], hint:'day = on'},
      {q:'I am available ___ 2 pm.', a:['at'], hint:'time = at'},
      {q:'I am available ___ 10 am to 12 pm.', a:['from'], hint:'range = from...to'}
    ]},
    {id:'g4', title:'4. Open to + noun / verb-ing', rule:'After open to, use a noun or verb-ing.', fr:'Après open to, utilisez un nom ou un verbe en -ing.', formula:'I am open to + a role / discussing / relocating.', examples:['I am open to a short assignment.','I am open to discussing a first call.','I am open to relocating at the right time.'], items:[
      {q:'I am open to ___ a temporary assignment.', a:['considering'], hint:'verb-ing (to consider)'},
      {q:'I am open to ___ the salary range.', a:['discussing'], hint:'verb-ing (to discuss)'},
      {q:'I am open to ___ in the Netherlands.', a:['working','relocating'], hint:'verb-ing (to work)'}
    ]},
    {id:'g5', title:'5. Follow up on / with / about', rule:'Follow up on something, follow up with a person, follow up about a topic.', fr:'Follow up on + action/document, follow up with + personne, follow up about + sujet.', formula:'follow up on my application • follow up with the recruiter • follow up about the role', examples:['I am writing to follow up on my application.','I will follow up with the recruiter next week.','I am following up about the role we discussed.'], items:[
      {q:'I am writing to follow up ___ my application.', a:['on'], hint:'on + application'},
      {q:'I will follow up ___ the recruiter.', a:['with'], hint:'with + person'},
      {q:'I am following up ___ the role we discussed.', a:['about','on'], hint:'about + topic'}
    ]}
  ],
  builders: [
    ['Thank you for your message I would be pleased to arrange a short call',['Thank you for your message','I would be pleased','to arrange','a short call']],
    ['Could you tell me what the next step in the process would be',['Could you tell me','what the next step','in the process','would be']],
    ['I am actively developing my Dutch skills',['I am','actively developing','my Dutch skills']],
    ['I would like to understand the overall package before giving a precise figure',['I would like to understand','the overall package','before giving','a precise figure']],
    ['I am writing to follow up on the CV I sent last week',['I am writing','to follow up on','the CV','I sent last week']],
    ['Could you send me the job description in writing please',['Could you send me','the job description','in writing','please']]
  ],
  listening: [
    {title:'Recruiter call invitation', audio:'Hello Isabelle, thank you for sending your CV. Your profile is interesting for a real-estate transaction role. Could we arrange a short screening call next Tuesday at 2 pm?', question:'What is the recruiter asking for?', options:['A short screening call next Tuesday at 2 pm','A full contract immediately','A property visit'], answer:0, model:'The recruiter is asking for a short screening call next Tuesday at 2 pm. I should reply by confirming my availability or proposing another time.'},
    {title:'Dutch-language question', audio:'Thank you for your interest. Dutch is important for this position because the role involves local stakeholders. Could you tell me your current Dutch level and your learning plan?', question:'What does the recruiter want to know?', options:['My current Dutch level and my learning plan','My postal address','My former manager’s phone number'], answer:0, model:'The recruiter wants to know my Dutch level and my learning plan. I should answer honestly and show commitment.'},
    {title:'Salary question', audio:'Before we arrange the next step, could you share your salary expectations and your availability to start?', question:'Which two points are mentioned?', options:['Salary expectations and availability to start','Dutch postcode and phone number','Property size and service charges'], answer:0, model:'The recruiter asks about salary expectations and availability to start. I can ask for the salary range and explain that I would like to understand the role and package.'},
    {title:'No vacancy now', audio:'Thank you for your speculative application. We do not currently have a suitable vacancy, but your real-estate legal and commercial background is interesting. We will keep your details on file.', question:'What is the best reaction?', options:['Thank them and ask to be kept in mind','Delete the contact immediately','Send a complaint'], answer:0, model:'This is not a strong lead yet, but it is still a professional contact. I can thank them and ask to be kept in mind for future opportunities.'},
    {title:'Agency clarification', audio:'This role is not a permanent position. It is a six-month temporary assignment through our agency, with hybrid work in Amsterdam two days per week.', question:'What should you clarify?', options:['The contract type, duration, location and hybrid schedule','The price of an apartment','The recruiter’s personal address'], answer:0, model:'I should clarify the contract type, the duration, the location and the hybrid schedule, then decide whether it fits my project.'}
  ],
  clarify: [
    {id:'c1', text:'You did not catch the company name.', answer:0, options:['Could you repeat the company name, please?','What?','I don’t understand anything.'], feedback:'Ask directly and politely.'},
    {id:'c2', text:'The recruiter speaks very quickly.', answer:1, options:['You speak too fast.','Could you speak a little more slowly, please?','I will stop the call.'], feedback:'This is the safest phrase.'},
    {id:'c3', text:'You need the details after the call.', answer:2, options:['I forgot.','Can you send all stuff?','Could you send me the details in writing, please?'], feedback:'This is professional and precise.'},
    {id:'c4', text:'You are not ready to answer salary immediately.', answer:0, options:['Could I get back to you by email after reviewing the role in more detail?','I have no idea.','That is private.'], feedback:'This gives you time without losing credibility.'},
    {id:'c5', text:'You want to verify what you understood.', answer:1, options:['You said many things.','Let me make sure I understood correctly.','I think I understood maybe.'], feedback:'This shows professionalism and active listening.'},
    {id:'c6', text:'You need to know if the role is permanent or temporary.', answer:2, options:['Is it good or bad?','How many people work there?','Could you clarify whether this is a permanent role or a temporary assignment?'], feedback:'Use the exact contract vocabulary.'}
  ],
  survival: [
    ['I am sorry, could you repeat that, please?','repetition'],
    ['Could you speak a little more slowly, please?','speed'],
    ['Could you clarify what you mean by that?','meaning'],
    ['Could you send me the details in writing?','written confirmation'],
    ['Let me make sure I understood correctly.','read-back'],
    ['Could I get back to you by email?','time to think'],
    ['That sounds interesting. Could you tell me more about the role?','curiosity'],
    ['Could you let me know the next step in the process?','next step']
  ],
  roleplays: [
    {title:'1. Recruiter screening call', contact:'Recruiter', cues:['Thank the recruiter','Explain your profile in 30 seconds','Give your target role','Confirm availability'], dialogue:[
      ['contact','Good morning Isabelle, thank you for your application. Could you briefly introduce your background?'],
      ['you','Good morning, and thank you for your time. I am a real estate legal and commercial professional with over 24 years of experience in the French property sector. My background combines legal advisory work, contract negotiation, risk analysis, sales management and stakeholder coordination.'],
      ['contact','What type of role are you looking for in the Netherlands?'],
      ['you','I am looking for a role where I can combine real estate legal expertise with business-oriented responsibilities, ideally involving transactions, contracts, stakeholder coordination and international communication.'],
      ['contact','Would you be available for a longer interview next week?'],
      ['you','Yes, I would be pleased to arrange that. I am available on Tuesday afternoon or Thursday morning.']
    ]},
    {title:'2. Headhunter asks about Dutch', contact:'Headhunter', cues:['Do not panic','Be honest','Show active learning','Redirect to your value'], dialogue:[
      ['contact','Dutch is important for many of our clients. What is your current Dutch level?'],
      ['you','I am currently developing my Dutch skills, and I understand that Dutch is important for integration and local stakeholder communication. I am committed to improving quickly.'],
      ['contact','Would that be a problem for a legal role?'],
      ['you','It may depend on the role. For a fully Dutch-speaking legal position, I understand it could be a limitation at first. However, for international real estate environments, transaction support or roles involving English-speaking stakeholders, my legal and commercial experience could be valuable while I continue improving my Dutch.']
    ]},
    {title:'3. Temporary agency / first step into the market', contact:'Agency consultant', cues:['Clarify contract type','Ask about duration','Ask about location and hybrid work','Stay open but selective'], dialogue:[
      ['contact','We may have a six-month assignment with a real-estate company in Amsterdam. Would you be open to a temporary assignment?'],
      ['you','I would be open to a temporary assignment if the responsibilities are aligned with my experience and if it could be a meaningful first step into the Dutch real-estate market.'],
      ['contact','The role involves contract review and coordination with external advisers.'],
      ['you','That sounds relevant to my background. Could you clarify the expected start date, the working language, the location and whether the role is hybrid?']
    ]},
    {title:'4. Salary expectation question', contact:'Recruiter', cues:['Do not give a random number','Ask about range','Mention role and package','Stay professional'], dialogue:[
      ['contact','What are your salary expectations?'],
      ['you','I would like to understand the responsibilities, seniority level and overall package before giving a precise figure. Could you share the salary range for the role?'],
      ['contact','The salary depends on experience.'],
      ['you','Of course. Based on my experience, I would be open to discussing a competitive salary in line with the responsibilities and the Dutch market.']
    ]},
    {title:'5. Unexpected fast phone call', contact:'Recruiter', cues:['Slow the call down','Repeat key details','Ask for written confirmation','Stay calm'], dialogue:[
      ['contact','I am calling about the Amsterdam role. Could you join a Teams call tomorrow at eleven and send the updated CV today?'],
      ['you','Thank you for calling. Could you repeat the time, please? I want to make sure I understood correctly.'],
      ['contact','Tomorrow at eleven.'],
      ['you','Thank you. Tomorrow at 11 am works for me. I will send my updated CV today. Could you also send the Teams invitation and the role details by email, please?']
    ]},
    {title:'6. LinkedIn contact becomes a useful lead', contact:'Professional contact', cues:['Thank the person','Explain project briefly','Ask for insight, not a job','Ask for one recommendation'], dialogue:[
      ['contact','Thank you for connecting. How can I help?'],
      ['you','Thank you for your message. I am exploring real-estate opportunities in the Netherlands, especially roles combining legal, commercial and transaction-related responsibilities.'],
      ['contact','What information are you looking for?'],
      ['you','I would value your perspective on the market. Which types of companies do you think could benefit from a profile combining legal real-estate knowledge and commercial experience?']
    ]}
  ],
  messages: [
    {title:'Positive recruiter reply', scenario:'A recruiter says your profile is interesting and asks for a call.', task:'Write a 3–4 sentence reply with thanks, availability and next step.', model:'Thank you for your message. I would be very pleased to arrange a short call to discuss the role in more detail. I am available on Tuesday afternoon or Thursday morning. Please let me know what would be most convenient for you.'},
    {title:'Dutch concern', scenario:'A recruiter asks whether your Dutch level is sufficient.', task:'Write a confident but honest reply.', model:'Thank you for raising this point. I understand that Dutch is important in many roles in the Netherlands, and I am actively developing my Dutch-language skills. I would be happy to discuss whether my legal and commercial real-estate experience could be relevant in an international or partially English-speaking environment while I continue improving my Dutch.'},
    {title:'No vacancy now', scenario:'A company replies that there is no vacancy at the moment.', task:'Keep the relationship open without pressure.', model:'Thank you for your reply and for considering my profile. I understand that there is no suitable vacancy at the moment. I would be grateful if you kept my details in mind for future opportunities aligned with my legal and commercial real-estate experience.'},
    {title:'After a networking call', scenario:'You had a 15-minute informational conversation.', task:'Thank the person and mention one useful point.', model:'Thank you again for taking the time to speak with me today. Your insight into the Dutch real-estate market and the importance of local networks was very helpful. I will continue refining my approach and would be pleased to stay in touch.'},
    {title:'Follow up after sending CV', scenario:'You sent your CV one week ago and have not received a reply.', task:'Write a polite follow-up.', model:'I hope you are well. I am writing to follow up on the CV I sent last week regarding potential real-estate opportunities in the Netherlands. I would be very happy to provide any further information if useful.'}
  ],
  mockModel: `Step 1 — Reply to the recruiter\nThank you for your message. I would be pleased to arrange a short call to discuss the opportunity. I am available on Tuesday afternoon or Thursday morning. Please let me know what would be most convenient for you.\n\nStep 2 — Call answer\nI am a real estate legal and commercial professional with over 24 years of experience in the French property sector. I am now exploring opportunities in the Netherlands where I can combine legal expertise, contract negotiation, transaction support and stakeholder coordination. I am actively developing my Dutch skills, and I would be particularly interested in roles where my international experience and professional English can be useful while I continue improving Dutch.\n\nStep 3 — Salary answer\nI would like to understand the responsibilities, seniority level and overall package before giving a precise figure. Could you share the salary range for the role?\n\nStep 4 — Follow-up after the call\nThank you again for your time today. I appreciated learning more about the role and the recruitment process. As discussed, I would be pleased to continue the conversation and I remain available to provide any additional information about my background.`
};

const STORAGE_KEY = 'isabelle_lesson_22_job_search_response_lab_v2';
let score = 0;
let done = new Set();
let sectionStats = {};
let manualStatus = {'manual-calls':'not-started','manual-writing':'not-started','manual-mock':'not-started'};
let manualComments = {'manual-calls':'','manual-writing':'','manual-mock':''};
let notes = {};
let listeningIndex = 0;
let mediaRecorder = null;
let recordedChunks = [];

const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

const sectionDefinitions = [
  {id:'inbox', objective:'Identify the type of reply and the correct next step', subject:'Recruiter, agency and LinkedIn messages', method:'QCM / immediate feedback', max:DATA.inbox.length},
  {id:'best-reply', objective:'Choose a concise, professional response', subject:'Replies to recruiters, contacts and companies', method:'QCM / immediate feedback', max:DATA.replies.length},
  {id:'grammar', objective:'Use polite grammar for replies and clarification', subject:'Could you, indirect questions, availability, follow-up, open to', method:'Typed answers / immediate feedback', max:DATA.grammar.reduce((a,g)=>a+g.items.length,0)},
  {id:'word-order', objective:'Build accurate professional reply sentences', subject:'LinkedIn, recruiter and follow-up sentence structure', method:'Word order / immediate feedback', max:DATA.builders.length},
  {id:'listening', objective:'Understand practical details in job-search audio messages', subject:'Calls, Dutch question, salary, availability, contract type', method:'Listening QCM / immediate feedback', max:DATA.listening.length},
  {id:'clarify', objective:'Recover professionally when information is unclear or unexpected', subject:'Repeat, slow down, confirm, buy time, written confirmation', method:'Scenario QCM / immediate feedback', max:DATA.clarify.length},
  {id:'manual-calls', objective:'Manage a recruiter, headhunter or agency call orally', subject:'Roleplays: profile, Dutch, salary, availability, next steps', method:'Mise en situation orale / trainer validation', manual:true},
  {id:'manual-writing', objective:'Write clear replies and follow-up messages', subject:'Recruiter replies, LinkedIn messages and follow-ups', method:'Production écrite / trainer validation', manual:true},
  {id:'manual-mock', objective:'Complete a reply-call-follow-up chain', subject:'Mini mock: from first reply to interview preparation', method:'Simulation orale et écrite / trainer validation', manual:true}
];

function normalize(v){return String(v||'').toLowerCase().trim().replace(/[’‘]/g,"'").replace(/[.,!?;:]/g,'').replace(/\s+/g,' ')}
function toast(msg){let old=$('.toast'); if(old) old.remove(); const t=document.createElement('div'); t.className='toast'; t.textContent=msg; document.body.appendChild(t); setTimeout(()=>t.remove(),2100)}
function speak(text){ if(!('speechSynthesis' in window)){alert('Audio not available on this browser.'); return;} speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(String(text)); u.lang=$('#accent')?.value || 'en-GB'; u.rate=.88; speechSynthesis.speak(u); }
function ensureStats(){sectionDefinitions.forEach(s=>{ if(!s.manual && !sectionStats[s.id]) sectionStats[s.id]={correct:0,max:s.max}; });}
function updateMastery(section,id,isCorrect){ ensureStats(); const st=sectionStats[section]; if(!st) return; if(isCorrect && !done.has(id)){ done.add(id); st.correct++; score++; $('#score').textContent=score; } saveState(false); renderEvaluation(); }
function statusFromScore(correct,max){ if(!correct) return 'not-started'; const pct=max?Math.round(correct/max*100):0; if(pct>=80) return 'achieved'; if(pct>=50) return 'progress'; return 'not-achieved'; }
function statusLabel(s){return {'achieved':'Objectif atteint','progress':'Objectif en cours d’acquisition','not-achieved':'Objectif non atteint','not-started':'Non commencé'}[s]||s;}
function maxScore(){return sectionDefinitions.filter(s=>!s.manual).reduce((a,s)=>a+s.max,0)}

function renderVocab(){
  const filter=$('#vocabFilter').value;
  const search=normalize($('#vocabSearch').value);
  const rows=DATA.vocab.filter(v=>(filter==='all'||v[0]===filter) && (!search || normalize(v.join(' ')).includes(search)));
  $('#vocabGrid').innerHTML=rows.map(v=>`<article class="vocab-card"><div class="icon">${v[1]}</div><span class="tag">${v[0]}</span><h3>${v[2]}</h3><p class="frText"><strong>FR:</strong> ${v[3]}</p><p class="definition"><strong>Definition:</strong> ${v[4]}</p><p class="example">${v[5]}</p><p class="collocation">${v[6]}</p><button data-say="${encodeURIComponent(v[2])}">🔊 Word</button> <button data-say="${encodeURIComponent(v[5])}">🔊 Example</button></article>`).join('') || '<p>No matching vocabulary yet.</p>';
}
function renderInbox(){
  // In the DATA.inbox activities, the first option is the correct professional reaction.
  // The previous version tried to map text labels to option indexes, which made inbox 3
  // mark the wrong answer as correct and left inbox 4 with no correct option.
  $('#inboxGrid').innerHTML=DATA.inbox.map((q,idx)=>`<article class="quiz-card"><h3>${q.title}</h3><p class="question-text">${q.text}</p><div class="options vertical">${q.options.map((o,i)=>`<button data-quiz="inbox" data-id="${q.id}" data-ok="${i===0}" data-index="${i}">${o}</button>`).join('')}</div><div class="feedback" id="fb-${q.id}"></div></article>`).join('');
}
function renderReplies(){
  $('#replyGrid').innerHTML=DATA.replies.map(q=>`<article class="quiz-card"><h3>${q.prompt}</h3><div class="options vertical">${q.options.map((o,i)=>`<button data-quiz="best-reply" data-id="${q.id}" data-ok="${i===q.answer}">${o}</button>`).join('')}</div><div class="feedback" id="fb-${q.id}"></div></article>`).join('');
}
function renderClarify(){
  $('#clarifyGrid').innerHTML=DATA.clarify.map(q=>`<article class="quiz-card"><h3>${q.text}</h3><div class="options vertical">${q.options.map((o,i)=>`<button data-quiz="clarify" data-id="${q.id}" data-ok="${i===q.answer}">${o}</button>`).join('')}</div><div class="feedback" id="fb-${q.id}"></div></article>`).join('');
  $('#survivalStrip').innerHTML=DATA.survival.map(s=>`<span class="survival-chip"><button data-say="${encodeURIComponent(s[0])}" class="ghost">🔊</button> ${s[0]} <small>(${s[1]})</small></span>`).join('');
}
function renderGrammar(){
  let counter=0;
  $('#grammarGrid').innerHTML=DATA.grammar.map((g,gi)=>`<article class="grammar-card"><h3>${g.title}</h3><div class="rule"><strong>Rule:</strong> ${g.rule}<p class="frText"><strong>FR:</strong> ${g.fr}</p></div><div class="formula">${g.formula}</div><h4>Useful examples</h4>${g.examples.map(e=>`<p class="example">${e} <button data-say="${encodeURIComponent(e)}">🔊</button></p>`).join('')}<div class="mini-exercise"><h4>Immediate practice</h4>${g.items.map((it,ii)=>{counter++;return `<label class="input-row"><span>${it.q}</span><input data-fill="grammar" data-section="grammar" data-id="g-${gi}-${ii}" data-answers="${encodeURIComponent(JSON.stringify(it.a))}" placeholder="Type the missing word..."><small class="hint">Hint: ${it.hint}</small><span class="feedback" id="fb-g-${gi}-${ii}"></span></label>`}).join('')}</div></article>`).join('');
}
function renderBuilders(){
  $('#builderGrid').innerHTML=DATA.builders.map((b,i)=>`<article class="builder-card"><h3>Sentence ${i+1}</h3><div class="builder-answer" id="builderAns${i}" data-value=""></div><div class="block-row" id="builderBlocks${i}"></div><div class="buttons"><button onclick="resetBuilder(${i})" class="secondary">Clear</button><button data-say="${encodeURIComponent(b[0])}" class="ghost">🔊 Model</button></div><div class="feedback" id="builderFb${i}"></div></article>`).join('');
  DATA.builders.forEach((_,i)=>resetBuilder(i));
}
window.resetBuilder=function(i){
  const parts=DATA.builders[i][1].slice().sort(()=>Math.random()-.5);
  $('#builderAns'+i).textContent=''; $('#builderAns'+i).dataset.value='';
  $('#builderBlocks'+i).innerHTML=parts.map(p=>`<button data-part="${encodeURIComponent(p)}" onclick="addBuilderPart(${i},this)">${p}</button>`).join('');
  const fb=$('#builderFb'+i); fb.textContent='Click the first block.'; fb.className='feedback progress';
}
window.addBuilderPart=function(i,btn){
  const part=decodeURIComponent(btn.dataset.part);
  const ans=$('#builderAns'+i);
  const current=ans.dataset.value ? ans.dataset.value+' '+part : part;
  ans.dataset.value=current; ans.textContent=current; btn.disabled=true;
  const target=DATA.builders[i][0]; const id='builder-'+i; const fb=$('#builderFb'+i);
  if(target.startsWith(current) && current!==target){ fb.textContent='✅ Good so far. Continue.'; fb.className='feedback progress'; }
  else if(current===target){ fb.textContent='✅ Correct sentence.'; fb.className='feedback correct'; updateMastery('word-order',id,true); }
  else { fb.textContent='❌ Not in the right order. Press Clear and try again.'; fb.className='feedback incorrect'; }
}
function renderListening(){
  const l=DATA.listening[listeningIndex%DATA.listening.length];
  $('#listeningTitle').textContent=l.title;
  $('#listeningQuestion').textContent=l.question;
  $('#listeningOptions').innerHTML=l.options.map((o,i)=>`<button data-listening="${i}" data-ok="${i===l.answer}">${o}</button>`).join('');
  $('#listeningFeedback').textContent=''; $('#listeningFeedback').className='feedback';
  $('#transcript').textContent=l.audio; $('#transcript').classList.add('hidden');
  $('#listeningModel').innerHTML=`<strong>Model answer:</strong> ${l.model}<br><button data-say="${encodeURIComponent(l.model)}">🔊 Listen to model answer</button>`; $('#listeningModel').classList.add('hidden');
}
function renderRoleplays(){
  $('#roleplayGrid').innerHTML=DATA.roleplays.map((r,i)=>`<article class="role-card"><h3>${r.title}</h3><p><strong>Partner:</strong> ${r.contact}</p><div class="cue-list">${r.cues.map(c=>`<span>${c}</span>`).join('')}</div><textarea class="practice-note" data-note="role-${i}" placeholder="Trainer / learner notes for this call..."></textarea><div class="buttons"><button onclick="toggleId('dialogue-${i}')">Show full partner dialogue</button><button data-say="${encodeURIComponent(r.dialogue.map(d=>d[1]).join(' '))}" class="ghost">🔊 Listen to dialogue</button></div><div id="dialogue-${i}" class="dialogue hidden">${r.dialogue.map(d=>`<div class="line ${d[0]}"><strong>${d[0]==='you'?'You':r.contact}:</strong> ${d[1]} ${d[0]==='you'?`<button data-say="${encodeURIComponent(d[1])}" class="ghost">🔊</button>`:''}</div>`).join('')}</div></article>`).join('');
  $('#oralValidationCalls').innerHTML=manualBlock('manual-calls','Trainer validation — recruiter / headhunter / agency calls');
}
function renderMessages(){
  $('#messageLab').innerHTML=DATA.messages.map((m,i)=>`<article class="write-card"><h3>${m.title}</h3><p class="scenario"><strong>Scenario:</strong> ${m.scenario}</p><p><strong>Task:</strong> ${m.task}</p><textarea class="practice-note writing-input" data-note="message-${i}" placeholder="Write your version here..."></textarea><div class="char-count" id="count-message-${i}">0 characters</div><div class="buttons"><button onclick="toggleId('messageModel-${i}')">Show model</button><button data-say="${encodeURIComponent(m.model)}" class="ghost">🔊 Model</button></div><div id="messageModel-${i}" class="model hidden">${m.model}</div></article>`).join('');
  $('#writingValidation').innerHTML=manualBlock('manual-writing','Trainer validation — written replies and follow-ups');
  $$('.writing-input').forEach(t=>t.addEventListener('input',()=> updateCharCount(t)));
}
function renderMock(){
  $('#mockModel').textContent=DATA.mockModel;
  $('#mockValidation').innerHTML=manualBlock('manual-mock','Trainer validation — complete reply-call-follow-up chain');
}
function manualBlock(key,title){
  return `<h3>${title}</h3><div class="manual-row"><label>Status<select data-manual="${key}"><option value="not-started">Non commencé</option><option value="progress">Objectif en cours d’acquisition</option><option value="achieved">Objectif atteint</option><option value="not-achieved">Objectif non atteint</option></select></label><label>Evidence / comments<textarea data-comment="${key}" rows="4" placeholder="What was observed? What was correct? What should be reviewed?"></textarea></label></div>`;
}
window.toggleId=function(id){ $('#'+id)?.classList.toggle('hidden'); }
function updateCharCount(t){ const id=t.dataset.note; const counter=$('#count-'+id); if(counter) counter.textContent=`${t.value.length} characters`; notes[id]=t.value; saveState(false); }

function renderEvaluation(){
  ensureStats();
  const rows=$('#evaluationRows'); if(!rows) return;
  rows.innerHTML=sectionDefinitions.map(d=>{
    if(d.manual){
      const st=manualStatus[d.id]||'not-started';
      return `<tr><td>${d.objective}</td><td>${d.subject}</td><td>${d.method}</td><td class="score-mini">Trainer validation</td><td><span class="status ${st}">${statusLabel(st)}</span></td></tr>`;
    }
    const s=sectionStats[d.id]||{correct:0,max:d.max};
    const st=statusFromScore(s.correct,s.max);
    const pct=s.max?Math.round(s.correct/s.max*100):0;
    return `<tr><td>${d.objective}</td><td>${d.subject}</td><td>${d.method}</td><td class="score-mini">${s.correct}/${s.max} — ${pct}%</td><td><span class="status ${st}">${statusLabel(st)}</span></td></tr>`;
  }).join('');
  const completed=sectionDefinitions.filter(d=>d.manual?(manualStatus[d.id]||'not-started')!=='not-started':(sectionStats[d.id]?.correct||0)>0).length;
  const rate=Math.round(completed/sectionDefinitions.length*100);
  $('#completionRate').textContent=rate+'%';
  const statuses=sectionDefinitions.map(d=>d.manual?(manualStatus[d.id]||'not-started'):statusFromScore(sectionStats[d.id]?.correct||0,d.max));
  let overall='not-started';
  if(statuses.some(s=>s!=='not-started')) overall=statuses.every(s=>s==='achieved')?'achieved':statuses.some(s=>s==='not-achieved')?'not-achieved':'progress';
  const os=$('#overallStatus'); os.textContent=statusLabel(overall); os.className='status '+overall;
}
function collectState(){
  $$('[data-comment]').forEach(t=>{ const key=t.dataset.comment; if(t.value.trim() || !manualComments[key]) manualComments[key]=t.value; });
  $$('.practice-note').forEach(t=>{ if(t.dataset.note) notes[t.dataset.note]=t.value; });
  return {version:1,score,done:[...done],sectionStats,manualStatus,manualComments,notes,learner:$('#learnerName')?.value||'Isabelle Davion',trainer:$('#trainerName')?.value||'',date:$('#evaluationDate')?.value||'',generalComments:$('#trainerComments')?.value||'',lastSaved:new Date().toISOString()};
}
function saveState(show=true){
  try{ const state=collectState(); localStorage.setItem(STORAGE_KEY,JSON.stringify(state)); if($('#lastSaved')) $('#lastSaved').textContent=new Date(state.lastSaved).toLocaleString(); if(show) toast('Progress saved.'); }catch(e){ console.warn(e); }
}
function loadState(){
  try{
    const raw=localStorage.getItem(STORAGE_KEY); if(!raw) return;
    const s=JSON.parse(raw); score=s.score||0; done=new Set(s.done||[]); sectionStats=s.sectionStats||{}; manualStatus={...manualStatus,...(s.manualStatus||{})}; manualComments={...manualComments,...(s.manualComments||{})}; notes=s.notes||{};
    $('#score').textContent=score;
    if($('#learnerName')&&s.learner) $('#learnerName').value=s.learner;
    if($('#trainerName')&&s.trainer) $('#trainerName').value=s.trainer;
    if($('#evaluationDate')&&s.date) $('#evaluationDate').value=s.date;
    if($('#trainerComments')) $('#trainerComments').value=s.generalComments||'';
    if($('#lastSaved')&&s.lastSaved) $('#lastSaved').textContent=new Date(s.lastSaved).toLocaleString();
    $$('[data-manual]').forEach(sel=>{sel.value=manualStatus[sel.dataset.manual]||'not-started'});
    $$('[data-comment]').forEach(t=>{t.value=manualComments[t.dataset.comment]||''});
    $$('.practice-note').forEach(t=>{ if(t.dataset.note && notes[t.dataset.note]) t.value=notes[t.dataset.note]; if(t.classList.contains('writing-input')) updateCharCount(t); });
  } catch(e){ console.warn('Could not load state',e); }
}
function reportRows(){
  ensureStats();
  return sectionDefinitions.map(d=>{
    if(d.manual) return [d.objective,d.subject,d.method,'Trainer validation',statusLabel(manualStatus[d.id]||'not-started'),manualComments[d.id]||''];
    const s=sectionStats[d.id]||{correct:0,max:d.max}; const pct=s.max?Math.round(s.correct/s.max*100):0; return [d.objective,d.subject,d.method,`${s.correct}/${s.max} - ${pct}%`,statusLabel(statusFromScore(s.correct,s.max)),''];
  });
}
function getOverallReportData(){renderEvaluation(); collectState(); return {learner:$('#learnerName')?.value||'Isabelle Davion',trainer:$('#trainerName')?.value||'',date:$('#evaluationDate')?.value||'',completion:$('#completionRate')?.textContent||'0%',overall:$('#overallStatus')?.textContent||'Non commencé',comments:$('#trainerComments')?.value||'',rows:reportRows()};}
function safeFileName(s){return String(s||'report').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9_-]+/g,'-').replace(/^-+|-+$/g,'')}
function escapeHtml(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function downloadBlob(blob,name){const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(a.href),1500)}
function downloadReadableHTML(){
  saveState(false); const d=getOverallReportData();
  const rows=d.rows.map(r=>`<tr>${r.slice(0,5).map(c=>`<td>${escapeHtml(c)}</td>`).join('')}<td>${escapeHtml(r[5]||'')}</td></tr>`).join('');
  const notesHtml=Object.entries(notes).filter(([,v])=>String(v).trim()).map(([k,v])=>`<h3>${escapeHtml(k)}</h3><div class="box comments">${escapeHtml(v)}</div>`).join('');
  const html=`<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Bilan Qualiopi - ${escapeHtml(d.learner)}</title><style>body{font-family:Arial,sans-serif;color:#222;max-width:1100px;margin:35px auto;padding:0 24px}h1{color:#0f2b3a}h2{color:#1c7c7d}table{border-collapse:collapse;width:100%;font-size:13px}th,td{border:1px solid #aaa;padding:8px;vertical-align:top}th{background:#eee}.meta{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin:18px 0}.box{border:1px solid #bbb;padding:10px;border-radius:8px}.comments{white-space:pre-wrap;min-height:70px}@media print{body{margin:0;max-width:none}}</style></head><body><h1>Bilan d'évaluation des acquis - Qualiopi</h1><h2>Isabelle Lesson 22 - From First Reply to First Interview</h2><div class="meta"><div class="box"><b>Apprenante:</b> ${escapeHtml(d.learner)}</div><div class="box"><b>Formatrice:</b> ${escapeHtml(d.trainer)}</div><div class="box"><b>Date:</b> ${escapeHtml(d.date)}</div><div class="box"><b>Completion:</b> ${escapeHtml(d.completion)}</div><div class="box"><b>Résultat global:</b> ${escapeHtml(d.overall)}</div></div><table><thead><tr><th>Objectif pédagogique</th><th>Support / sujet</th><th>Mode d'évaluation</th><th>Score / validation</th><th>Résultat</th><th>Commentaires</th></tr></thead><tbody>${rows}</tbody></table><h2>Observations générales de la formatrice</h2><div class="box comments">${escapeHtml(d.comments)||'Aucune observation saisie.'}</div>${notesHtml?`<h2>Notes de production et entraînements</h2>${notesHtml}`:''}<p><small>Rapport généré depuis la page interactive. Les résultats sont aussi sauvegardés dans le navigateur utilisé.</small></p></body></html>`;
  downloadBlob(new Blob([html],{type:'text/html;charset=utf-8'}),`${safeFileName(d.learner)}-Lesson-22-Bilan-Qualiopi.html`);
}
function latinText(s){return String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘]/g,"'").replace(/[“”]/g,'"').replace(/[–—]/g,'-').replace(/[^\x20-\x7E]/g,'')}
function pdfEscape(s){return latinText(s).replace(/\\/g,'\\\\').replace(/\(/g,'\\(').replace(/\)/g,'\\)')}
function wrapText(text,max=92){const words=latinText(text).split(/\s+/); const lines=[]; let line=''; for(const w of words){if(!w)continue; const next=line?line+' '+w:w; if(next.length>max && line){lines.push(line); line=w;} else line=next;} if(line)lines.push(line); return lines.length?lines:[''];}
function buildSimplePDF(d){
  const pageW=595,pageH=842,left=42,top=800,bottom=45,lineH=14; let pages=[[]],y=top;
  function addLine(text,size=10,bold=false){for(const ln of wrapText(text,size>=14?72:94)){ if(y<bottom){pages.push([]); y=top;} pages[pages.length-1].push({text:ln,x:left,y,size,bold}); y-=size>=14?20:lineH; }}
  function gap(n=8){y-=n;}
  addLine('BILAN D EVALUATION DES ACQUIS - QUALIOPI',17,true); addLine('Isabelle Lesson 22 - From First Reply to First Interview',12,true); gap();
  addLine(`Apprenante: ${d.learner}`); addLine(`Formatrice: ${d.trainer}`); addLine(`Date: ${d.date}`); addLine(`Completion: ${d.completion} | Resultat global: ${d.overall}`); gap(12);
  d.rows.forEach((r,i)=>{addLine(`${i+1}. Objectif: ${r[0]}`,11,true); addLine(`Support / sujet: ${r[1]}`); addLine(`Mode: ${r[2]}`); addLine(`Score / validation: ${r[3]} | Resultat: ${r[4]}`); if(r[5]) addLine(`Commentaires: ${r[5]}`); gap(7);});
  addLine('Observations generales de la formatrice',12,true); addLine(d.comments||'Aucune observation saisie.');
  const objs=[]; function obj(body){objs.push(body);return objs.length} const font1=obj('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>'); const font2=obj('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>'); const pageRefs=[]; const contentRefs=[];
  for(const lines of pages){let stream=''; for(const l of lines){stream+=`BT /${l.bold?'F2':'F1'} ${l.size} Tf 1 0 0 1 ${l.x} ${l.y} Tm (${pdfEscape(l.text)}) Tj ET\n`;} contentRefs.push(obj(`<< /Length ${stream.length} >>\nstream\n${stream}endstream`)); pageRefs.push(obj('PLACEHOLDER'));}
  const pagesRef=obj('PLACEHOLDER_PAGES'); pageRefs.forEach((ref,i)=>{objs[ref-1]=`<< /Type /Page /Parent ${pagesRef} 0 R /MediaBox [0 0 ${pageW} ${pageH}] /Resources << /Font << /F1 ${font1} 0 R /F2 ${font2} 0 R >> >> /Contents ${contentRefs[i]} 0 R >>`;}); objs[pagesRef-1]=`<< /Type /Pages /Kids [${pageRefs.map(r=>r+' 0 R').join(' ')}] /Count ${pageRefs.length} >>`; const catalog=obj(`<< /Type /Catalog /Pages ${pagesRef} 0 R >>`);
  let out='%PDF-1.4\n%PDFREPORT\n',offsets=[0]; for(let i=0;i<objs.length;i++){offsets.push(out.length); out+=`${i+1} 0 obj\n${objs[i]}\nendobj\n`;} const xref=out.length; out+=`xref\n0 ${objs.length+1}\n0000000000 65535 f \n`; for(let i=1;i<offsets.length;i++) out+=String(offsets[i]).padStart(10,'0')+' 00000 n \n'; out+=`trailer\n<< /Size ${objs.length+1} /Root ${catalog} 0 R >>\nstartxref\n${xref}\n%%EOF`; return new Blob([new TextEncoder().encode(out)],{type:'application/pdf'});
}
function downloadPDFReport(){ saveState(false); const d=getOverallReportData(); downloadBlob(buildSimplePDF(d),`${safeFileName(d.learner)}-Lesson-22-Bilan-Qualiopi.pdf`); }
function copyReportText(){
  saveState(false); const d=getOverallReportData();
  const lines=[`Bilan Qualiopi - Lesson 22`, `Learner: ${d.learner}`, `Trainer: ${d.trainer}`, `Date: ${d.date}`, `Completion: ${d.completion}`, `Overall: ${d.overall}`, '', ...d.rows.map((r,i)=>`${i+1}. ${r[0]} — ${r[3]} — ${r[4]}${r[5]?`\nComments: ${r[5]}`:''}`), '', 'General comments:', d.comments||''];
  navigator.clipboard?.writeText(lines.join('\n')).then(()=>toast('Report text copied.')).catch(()=>alert(lines.join('\n')));
}
function resetAll(){ if(!confirm('Reset all saved results for this lesson?')) return; localStorage.removeItem(STORAGE_KEY); location.reload(); }
function initEvaluation(){
  ensureStats(); $('#maxScore').textContent=maxScore(); if($('#evaluationDate')&&!$('#evaluationDate').value) $('#evaluationDate').value=new Date().toISOString().slice(0,10); loadState();
  $$('[data-manual]').forEach(sel=>sel.onchange=()=>{manualStatus[sel.dataset.manual]=sel.value; syncManualFields(sel.dataset.manual); saveState(false); renderEvaluation();});
  $$('[data-comment]').forEach(t=>t.oninput=()=>{manualComments[t.dataset.comment]=t.value; syncManualFields(t.dataset.comment); saveState(false);});
  $('#trainerComments').oninput=()=>saveState(false); $('#learnerName').onchange=()=>saveState(false); $('#trainerName').onchange=()=>saveState(false); $('#evaluationDate').onchange=()=>saveState(false);
  $('#saveProgress').onclick=()=>saveState(true); $('#downloadPdf').onclick=downloadPDFReport; $('#downloadHtml').onclick=downloadReadableHTML; $('#copyReport').onclick=copyReportText; $('#printReport').onclick=()=>{saveState(false); window.print();}; $('#resetProgress').onclick=resetAll;
  renderEvaluation();
}
function syncManualFields(key){
  $$(`[data-manual="${key}"]`).forEach(sel=>{ if(sel.value!==manualStatus[key]) sel.value=manualStatus[key]||'not-started'; });
  $$(`[data-comment="${key}"]`).forEach(t=>{ if(t.value!==manualComments[key]) t.value=manualComments[key]||''; });
}

function initRecorder(){
  const start=$('#startRec'), stop=$('#stopRec'), clear=$('#clearRec'), audio=$('#audioPlayback'), link=$('#downloadRecording');
  start.onclick=async()=>{
    if(!navigator.mediaDevices?.getUserMedia){alert('Recording is not available in this browser.');return;}
    try{
      recordedChunks=[]; const stream=await navigator.mediaDevices.getUserMedia({audio:true});
      mediaRecorder=new MediaRecorder(stream); mediaRecorder.ondataavailable=e=>{if(e.data.size>0) recordedChunks.push(e.data)};
      mediaRecorder.onstop=()=>{const blob=new Blob(recordedChunks,{type:'audio/webm'}); audio.src=URL.createObjectURL(blob); link.href=audio.src; link.classList.remove('hidden'); stream.getTracks().forEach(t=>t.stop());};
      mediaRecorder.start(); start.disabled=true; stop.disabled=false; toast('Recording started.');
    }catch(e){alert('Microphone permission was not granted or recording is unavailable.');}
  };
  stop.onclick=()=>{ if(mediaRecorder && mediaRecorder.state!=='inactive'){mediaRecorder.stop(); start.disabled=false; stop.disabled=true; toast('Recording saved on this page.');} };
  clear.onclick=()=>{audio.removeAttribute('src'); link.classList.add('hidden'); recordedChunks=[]; start.disabled=false; stop.disabled=true;};
}

function initHandlers(){
  document.addEventListener('click', e=>{
    const say=e.target.closest('[data-say]'); if(say){speak(decodeURIComponent(say.dataset.say)); return;}
    const q=e.target.closest('[data-quiz]'); if(q){
      const ok=q.dataset.ok==='true', sec=q.dataset.quiz, id=q.dataset.id;
      const card=q.closest('.quiz-card'); $$('.options button',card).forEach(b=>b.classList.remove('selected','correct-choice','wrong-choice')); q.classList.add('selected',ok?'correct-choice':'wrong-choice');
      const fb=$('#fb-'+id); const source=[...DATA.inbox,...DATA.replies,...DATA.clarify].find(x=>x.id===id);
      if(ok){fb.textContent='✅ Correct. '+(source?.feedback||''); fb.className='feedback correct'; updateMastery(sec,id,true);}
      else {fb.textContent='❌ Not the best option yet. '+(source?.feedback||'Try again.'); fb.className='feedback incorrect';}
      return;
    }
    const l=e.target.closest('[data-listening]'); if(l){
      const ok=l.dataset.ok==='true'; const id='listening-'+(listeningIndex%DATA.listening.length); const card=l.closest('.listen-card'); $$('[data-listening]',card).forEach(b=>b.classList.remove('selected','correct-choice','wrong-choice')); l.classList.add('selected',ok?'correct-choice':'wrong-choice');
      if(ok){$('#listeningFeedback').textContent='✅ Correct. You understood the key detail.'; $('#listeningFeedback').className='feedback correct'; updateMastery('listening',id,true);} else {$('#listeningFeedback').textContent='❌ Listen again, then reveal the script if needed.'; $('#listeningFeedback').className='feedback incorrect';}
    }
  });
  document.addEventListener('input',e=>{
    const fill=e.target.closest('[data-fill="grammar"]'); if(fill){
      const answers=JSON.parse(decodeURIComponent(fill.dataset.answers)).map(normalize); const val=normalize(fill.value); const fb=$('#fb-'+fill.dataset.id);
      if(!val){fb.textContent=''; fb.className='feedback'; return;}
      if(answers.includes(val)){fb.textContent='✅ Correct.'; fb.className='feedback correct'; updateMastery('grammar',fill.dataset.id,true);} else {fb.textContent='Keep trying — check the hint and the example.'; fb.className='feedback progress';}
    }
    const note=e.target.closest('.practice-note'); if(note){ if(note.dataset.note){notes[note.dataset.note]=note.value; saveState(false);} }
  });
  $('#vocabFilter').onchange=renderVocab; $('#vocabSearch').oninput=renderVocab;
  $('#toggleFrench').onclick=()=>{document.body.classList.toggle('hidden-fr'); $('#toggleFrench').textContent=document.body.classList.contains('hidden-fr')?'🇫🇷 Show French':'🇫🇷 Hide French';};
  $('#stopSpeech').onclick=()=>speechSynthesis.cancel(); $('#printPage').onclick=()=>window.print();
  $('#newListening').onclick=()=>{listeningIndex++; renderListening();}; $('#listenAudio').onclick=()=>speak(DATA.listening[listeningIndex%DATA.listening.length].audio); $('#showTranscript').onclick=()=>$('#transcript').classList.toggle('hidden'); $('#showListeningModel').onclick=()=>$('#listeningModel').classList.toggle('hidden');
  $('#showMockModel').onclick=()=>$('#mockModel').classList.toggle('hidden');
  $$('[data-scroll]').forEach(b=>b.onclick=()=>document.querySelector(b.dataset.scroll).scrollIntoView({behavior:'smooth'}));
}
function initTimer(){
  const start=Date.now(); setInterval(()=>{const s=Math.floor((Date.now()-start)/1000); const m=String(Math.floor(s/60)).padStart(2,'0'); const ss=String(s%60).padStart(2,'0'); $('#timer').textContent=`${m}:${ss}`;},1000);
}
function init(){
  renderVocab(); renderInbox(); renderReplies(); renderGrammar(); renderBuilders(); renderListening(); renderClarify(); renderRoleplays(); renderMessages(); renderMock();
  initHandlers(); initRecorder(); initEvaluation(); initTimer();
}
document.addEventListener('DOMContentLoaded', init);
