const $=(s,p=document)=>p.querySelector(s), $$=(s,p=document)=>[...p.querySelectorAll(s)];
const STORAGE_KEY='isabelle_l23_state_v3';
const done=new Set();
let auto={};
let mediaRecorder=null, chunks=[], recordingUrl=null;

const DATA={
vocab:[
['impact','🎯','deliver results','obtenir des résultats','To produce a useful or measurable outcome.','I focus on delivering practical results while managing risk.'],
['impact','📈','add value','apporter de la valeur','To make a useful contribution to a company, team or project.','My dual legal and commercial background allows me to add value across a transaction.'],
['impact','🧭','drive a project forward','faire avancer un projet','To actively help a project progress.','I helped drive the project forward by clarifying the contractual position.'],
['impact','🧩','solve a complex issue','résoudre un problème complexe','To find a workable solution to a difficult situation.','I enjoy solving complex issues involving several stakeholders.'],
['impact','⚙️','streamline','rationaliser / fluidifier','To make a process simpler or more efficient.','I streamlined part of the review process by clarifying responsibilities earlier.'],
['impact','🔎','identify the key issue','identifier l’enjeu principal','To recognise the most important problem or risk.','I first identify the key issue before proposing a solution.'],
['legal','⚖️','risk assessment','évaluation des risques','The process of identifying and evaluating legal or business risks.','Risk assessment was an important part of my property-development work.'],
['legal','📑','contractual framework','cadre contractuel','The set of contracts and rules governing a project.','I reviewed the contractual framework before advising the operational team.'],
['legal','🛡️','mitigate risk','réduire / atténuer un risque','To reduce the likelihood or impact of a risk.','We mitigated the risk by clarifying the responsibilities of each party.'],
['legal','🧠','legal judgement','jugement / discernement juridique','The ability to make sound decisions using legal knowledge and context.','I bring legal judgement together with a practical understanding of operations.'],
['legal','✅','regulatory compliance','conformité réglementaire','Acting in accordance with applicable rules and regulations.','I reviewed marketing materials to support legal and regulatory compliance.'],
['legal','🔗','transferable expertise','expertise transférable','Knowledge and skills that remain useful in a new market or role.','Contract analysis and negotiation are transferable areas of my expertise.'],
['commercial','🤝','commercial awareness','sens / vision commerciale','Understanding how decisions affect clients, revenue and business objectives.','My sales background strengthened my commercial awareness.'],
['commercial','🏢','property disposal','cession d’actif immobilier','The sale of a property or property asset.','I managed property disposals and coordinated the sale process.'],
['commercial','💶','property valuation','valorisation immobilière','The process of assessing the value of property.','I prepared property valuation studies and sale proposals.'],
['commercial','📣','call for tenders','appel d’offres','A formal process inviting competing offers.','I organised calls for tenders and negotiated with potential buyers.'],
['commercial','🗣️','negotiate terms','négocier les conditions','To discuss and agree the conditions of a transaction or contract.','I negotiated terms with clients and external partners.'],
['commercial','🎯','client-focused','orienté client','Organised around understanding and serving client needs.','I take a pragmatic, client-focused approach to negotiations.'],
['leadership','🧑‍🤝‍🧑','stakeholder coordination','coordination des parties prenantes','Managing communication and actions between people involved in a project.','Stakeholder coordination has been central to my work.'],
['leadership','🧱','cross-functional','transversal / interfonctionnel','Involving several departments or areas of expertise.','I am comfortable working in cross-functional environments.'],
['leadership','🧭','align priorities','aligner les priorités','To help people agree on what matters most.','I helped align legal and operational priorities.'],
['leadership','📡','liaise with','assurer la liaison avec','To communicate and coordinate professionally with another person or group.','I liaised with notaries, lawyers, investors and surveyors.'],
['leadership','🪜','support operational teams','accompagner les équipes opérationnelles','To advise or help teams doing day-to-day project work.','I supported operational teams on contracts, planning and risk prevention.'],
['leadership','🧘','remain composed','rester calme / garder son sang-froid','To stay calm and controlled under pressure.','I remain composed when negotiations become difficult.'],
['interview','✨','what sets me apart','ce qui me distingue','A phrase used to explain your distinctive value.','What sets me apart is my combination of legal and commercial experience.'],
['interview','🔁','build on my experience','m’appuyer sur / prolonger mon expérience','To use previous experience as a foundation for a new challenge.','I would like to build on my experience in an international environment.'],
['interview','🧩','bridge the gap','combler l’écart','To reduce a difference in knowledge or experience.','I am actively learning Dutch in order to bridge the language gap.'],
['interview','🌍','adapt to a new market','s’adapter à un nouveau marché','To learn and work effectively in a different market.','I am ready to adapt my experience to a new market and regulatory context.'],
['interview','🛠️','hands-on experience','expérience pratique / terrain','Practical experience gained by doing the work directly.','I bring hands-on experience of negotiations and property transactions.'],
['interview','💡','pragmatic approach','approche pragmatique','A practical way of solving problems based on what works.','I take a pragmatic approach to legal and commercial questions.']
],
upgrade:[
{id:'up1',q:'How would you describe your profile?',answer:'What sets me apart is the combination of legal expertise, commercial awareness and hands-on property experience.',choices:['I have done a lot of different things in real estate.','What sets me apart is the combination of legal expertise, commercial awareness and hands-on property experience.','I am very polyvalent and dynamic.'],feedback:'This gives a clear professional identity and explains the distinctive value.'},
{id:'up2',q:'How do you describe stakeholder work?',answer:'I coordinated with internal teams and external stakeholders to keep projects moving while managing legal risk.',choices:['I coordinated with internal teams and external stakeholders to keep projects moving while managing legal risk.','I talked with many different people.','I had relations with notaries, lawyers and others.'],feedback:'“Coordinated with” and “keep projects moving” show action and purpose.'},
{id:'up3',q:'How do you express adaptability?',answer:'I adapt quickly by understanding the context, asking focused questions and identifying what is transferable from my previous experience.',choices:['I can adapt me to every situation.','I am adaptable because I have a lot of experience.','I adapt quickly by understanding the context, asking focused questions and identifying what is transferable from my previous experience.'],feedback:'The stronger answer explains HOW you adapt, not only that you are adaptable.'},
{id:'up4',q:'How do you describe legal work?',answer:'I advised operational teams, assessed risk and negotiated workable contractual solutions.',choices:['I did legal advice for operations.','I advised operational teams, assessed risk and negotiated workable contractual solutions.','I made juridical things and contracts.'],feedback:'Use “legal”, not “juridical”, and choose active professional verbs.'},
{id:'up5',q:'How do you express a result?',answer:'By clarifying the contractual responsibilities early, I helped the team move forward with a clearer risk position.',choices:['By clarifying the contractual responsibilities early, I helped the team move forward with a clearer risk position.','Finally it was okay and the project continued.','I explained the contract and after there was no problem.'],feedback:'Method + impact makes the result credible.'},
{id:'up6',q:'How do you answer “Why you?”',answer:'I could bring a combination of legal judgement, transaction experience and commercial awareness that allows me to understand both risk and business priorities.',choices:['You should hire me because I have 24 years of experience.','I am motivated and I learn fast.','I could bring a combination of legal judgement, transaction experience and commercial awareness that allows me to understand both risk and business priorities.'],feedback:'Years of experience matter, but the value of those years matters more.'},
{id:'up7',q:'How do you talk about Dutch?',answer:'My Dutch is still at an early stage, and I am actively developing it. In the meantime, I can contribute in English while building the local language skills the role requires.',choices:['My Dutch is still at an early stage, and I am actively developing it. In the meantime, I can contribute in English while building the local language skills the role requires.','I do not speak Dutch yet but I hope it will be fine.','Dutch is not really necessary because many people speak English.'],feedback:'Acknowledge the gap, show action, and focus on contribution.'},
{id:'up8',q:'How do you explain your move to the Netherlands?',answer:'I am making a deliberate long-term move to the Netherlands and I am looking for a role where I can build the next stage of my career, not simply test the market.',choices:['I want to try the Netherlands because I like Amsterdam.','I am making a deliberate long-term move to the Netherlands and I am looking for a role where I can build the next stage of my career, not simply test the market.','I want a change because I worked in France for too long.'],feedback:'This sounds committed, positive and career-focused.'}
],
grammar1:[
{id:'g1a',q:'I ___ complex development contracts throughout my career.',answers:['have negotiated'],hint:'Career experience relevant now → present perfect.',clue:'Verb to conjugate: NEGOTIATE'},
{id:'g1b',q:'I ___ at Eiffage from 2017 to 2025.',answers:['worked'],hint:'Finished period + dates → past simple.',clue:'Verb to conjugate: WORK'},
{id:'g1c',q:'Over the years, I ___ strong relationships with a wide range of stakeholders.',answers:['have developed','developed'],hint:'Career overview → present perfect is strongest.',clue:'Verb to conjugate: DEVELOP'},
{id:'g1d',q:'As Sales Manager, I ___ an annual fees budget of approximately €1 million excluding VAT.',answers:['managed'],hint:'Finished role → past simple.',clue:'Verb to conjugate: MANAGE'}
],
grammar2:[
{id:'g2a',q:'I helped reduce uncertainty by ___ the responsibilities early.',answers:['clarifying'],hint:'Remember the structure: by + verb-ing.',clue:'Verb to use: CLARIFY'},
{id:'g2b',q:'I supported the sale process by ___ legal, financial and technical information.',answers:['coordinating','reviewing'],hint:'Use an -ing form after by.',clue:'Possible verb: COORDINATE (REVIEW also works)'},
{id:'g2c',q:'I built trust with stakeholders by ___ clear and practical advice.',answers:['providing','giving'],hint:'Remember the structure: by + verb-ing.',clue:'Possible verb: PROVIDE (GIVE also works)'},
{id:'g2d',q:'I moved the negotiation forward by ___ on the key commercial and legal priorities.',answers:['focusing'],hint:'Use an -ing form after by.',clue:'Verb to use: FOCUS'}
],
grammar3:[
{id:'g3a',q:'___ my experience is mainly in French real estate law, the core contract and negotiation skills are transferable.',answers:['while','although'],hint:'You need a word that introduces a contrast.',clue:'Choose from: WHILE / ALTHOUGH'},
{id:'g3b',q:'I would combine my existing expertise ___ focused learning of Dutch practice.',answers:['with'],hint:'Think of the fixed structure: combine X ... Y.',clue:'Preposition clue: WITH'},
{id:'g3c',q:'I am still developing my Dutch; ___, I am committed to learning it consistently.',answers:['however'],hint:'You need a formal contrast connector after a semicolon.',clue:'Connector clue: HOWEVER'},
{id:'g3d',q:'My background would enable me ___ contribute from both a legal and commercial perspective.',answers:['to'],hint:'Think of the structure: enable someone ... + verb.',clue:'Grammar clue: TO'}
],
stories:{
negotiation:{title:'Contract negotiation',prompt:'A contractual disagreement created uncertainty on a property-development project.',map:['S: What was the disagreement?','T: What did you need to protect or achieve?','A: What did you analyse, clarify and negotiate?','R: What changed?','R: What did the situation show about your approach?'],power:'Useful verbs: reviewed · identified · reframed · negotiated · clarified · secured'},
sales:{title:'Property sale / disposal',prompt:'You were responsible for bringing a property asset to market and negotiating the transaction.',map:['S: What type of asset / market context?','T: What was your commercial responsibility?','A: Valuation, tender, client visits, negotiation, documents?','R: What was achieved?','R: What does it show about your commercial judgement?'],power:'Useful verbs: valued · marketed · organised · negotiated · coordinated · closed'},
risk:{title:'Risk prevention',prompt:'An operational team needed legal guidance before progressing with a development decision.',map:['S: What risk or uncertainty existed?','T: What decision had to be made?','A: What did you review and advise?','R: How did your input change the decision?','R: What did you learn about balancing rigour and pragmatism?'],power:'Useful verbs: assessed · flagged · advised · mitigated · documented · enabled'},
coordination:{title:'Stakeholder coordination',prompt:'A project involved internal operational staff and several external professional partners.',map:['S: Why was coordination difficult?','T: What needed to be aligned?','A: How did you communicate and structure the process?','R: What became clearer/faster/safer?','R: What does it demonstrate about your working style?'],power:'Useful verbs: liaised · aligned · facilitated · prioritised · followed up · resolved'}
},
pressure:[
{id:'p1',q:'“Your experience is in French law. How would you work in the Dutch market?”',cue:'Position: recognise the difference. Proof: transferable contract / negotiation / risk skills. Pivot: explain how you would learn Dutch practice.',b1:'My experience is mainly in French real estate law, so I know that I would need to learn the Dutch legal framework. However, many of my core skills are transferable, such as contract analysis, negotiation, risk prevention and stakeholder coordination. I am used to learning regulatory changes, and I would approach the Dutch market in the same structured way.',b2:'While my legal experience is rooted in the French market, the core capabilities I bring are highly transferable: analysing contractual risk, negotiating workable terms, advising operational teams and coordinating multiple stakeholders. I would not assume that French solutions apply directly. I would combine that experience with focused learning of Dutch practice and local expert input, which is the same disciplined approach I have used whenever a project involved a new regulatory issue.'},
{id:'p2',q:'“Your Dutch is still limited. Why should that not be a problem?”',cue:'Position: be honest. Proof: current English + language-learning plan. Pivot: show contribution now and progression.',b1:'My Dutch is still at a beginner level and I am actively learning. I can already work on my professional English and communicate in an international environment. I would continue studying Dutch regularly so that I can become more effective with local colleagues and clients.',b2:'My Dutch is still developing, so I would be transparent about that from the start. At the same time, I can contribute professionally in English in an international environment, and I have a clear commitment to improving Dutch consistently. I see language learning as part of my integration into the market, not as a separate project, so I would connect it directly to the vocabulary, situations and stakeholders I encounter in the role.'},
{id:'p3',q:'“You have a very senior profile. Would this role be a step backwards for you?”',cue:'Position: explain your intention. Proof: value learning / market entry over title. Pivot: why this role makes sense.',b1:'I do not see it as a step backwards. I am changing market and I know that I need to learn a new professional environment. The most important thing for me is to find a role where my experience is useful and where I can develop in the Netherlands.',b2:'I am deliberately prioritising the right market entry and the right scope over reproducing my previous title immediately. I bring senior experience, but I also recognise that moving into a new country requires curiosity and a willingness to learn. If the role gives me meaningful responsibility, exposure to the Dutch market and the opportunity to contribute, I would see that as a strategic next step rather than a step backwards.'},
{id:'p4',q:'“What is a weakness or development area for you?”',cue:'Use Dutch as the development area: honest current level + concrete learning plan + why it matters professionally.',b1:'One area I am developing is my Dutch. I am still at an early stage, so I know I need to improve it to integrate fully into the local professional environment. I am learning regularly and I would continue to build the language through everyday situations and the vocabulary connected to my role.',b2:'A clear development area for me is Dutch. I am still at an early stage, and I see improving it as an important part of building a long-term career in the Netherlands. I am approaching it practically: regular study, exposure to everyday Dutch and a strong focus on the professional vocabulary I would actually use in the role. I can already contribute in English, but my goal is to become progressively more effective and integrated in Dutch as well.'},
{id:'p5',q:'“Why do you want to work in the Netherlands?”',cue:'Keep it professional: long-term intention + market/environment + fit with your next career chapter.',b1:'I am making a long-term move to the Netherlands and I would like to continue my career in real estate there. I am interested in working in an international environment and discovering a new property market while using my legal and commercial experience.',b2:'I am making a deliberate long-term move to the Netherlands, and professionally I see it as an opportunity to build the next stage of my career in a highly international property environment. I am particularly interested in roles where legal judgement, commercial thinking and stakeholder coordination come together, because that is where my experience is strongest and where I believe I can contribute most effectively.'},
{id:'p6',q:'“What salary are you looking for?”',cue:'Avoid a random number if you do not know the market range. Show flexibility while protecting your value.',b1:'I am open to discussing a competitive salary based on the responsibilities of the role and the overall package. I would be interested to understand the range you have budgeted for the position.',b2:'At this stage, I would prefer to look at the responsibilities, level of autonomy and overall package before giving a very precise figure. I am looking for a competitive package that reflects the scope of the role and my experience. Could you share the salary range budgeted for the position so that we can see whether our expectations are aligned?'}
],
listening:[
{title:'Transferability',text:'You have extensive experience in France, but our legal framework and transaction process are different. How would you make sure you become effective quickly in the Dutch market?',question:'What does the interviewer mainly want to know?',answer:'How you would adapt your expertise to a new legal and market context.',options:['Whether you remember every French law.','How you would adapt your expertise to a new legal and market context.','Whether you can speak Dutch perfectly today.'],model:'Acknowledge the difference, explain transferable skills, then give a concrete learning strategy.',b1:'I know the Dutch legal framework is different, so I would not assume that the French approach is the same. I would first learn the main rules and processes that are important for the role. At the same time, I can already use my experience in contract analysis, negotiation and risk management while I develop my knowledge of the Dutch market.',b2:'I would approach the transition in a structured way. I would first identify the Dutch rules, transaction steps and professional practices that are most relevant to the role, and I would use local expertise whenever necessary rather than assuming that French solutions apply. At the same time, I could contribute immediately through transferable skills such as contract analysis, negotiation, risk assessment and stakeholder coordination.'},
{title:'Motivation',text:'Your background is quite broad. What specifically attracts you to this position rather than another real-estate role?',question:'What should your answer focus on?',answer:'The match between this role’s responsibilities and your distinctive experience.',options:['Your full career chronology.','Your personal life in the Netherlands.','The match between this role’s responsibilities and your distinctive experience.'],model:'Choose two or three responsibilities from the role and connect each to relevant evidence from your experience.',b1:'What attracts me to this role is the combination of legal, commercial and property responsibilities. These are areas I have worked in throughout my career, so I believe I could use my experience while also learning a new market. I also like the fact that the role involves working with different teams and stakeholders.',b2:'This role appeals to me because it brings together the areas where my experience is strongest: legal analysis, commercial understanding and coordination across property stakeholders. I am not simply looking for any real-estate position in the Netherlands. I am looking for a role where that cross-functional background is genuinely useful and where I can continue developing in an international environment.'},
{title:'Seniority',text:'You have more than twenty years of experience. How would you feel about joining a team where the reporting line or title may be different from what you had in France?',question:'What concern is behind the question?',answer:'Whether you are genuinely comfortable with a different title or structure.',options:['Whether you are genuinely comfortable with a different title or structure.','Whether you can manage a €1 million budget.','Whether you have a driving licence.'],model:'Show that you are intentional about entering a new market and focused on contribution, scope and learning rather than title alone.',b1:'I would be comfortable with that because I am entering a new market and I know I will need to learn how the organisation and the Dutch market work. For me, the responsibilities and the opportunity to contribute are more important than having exactly the same title I had in France.',b2:'I am deliberately prioritising the right scope and the right market entry over reproducing my previous title immediately. I bring significant experience, but I also recognise that joining a new country and organisation requires curiosity and flexibility. I would judge the opportunity by the responsibility, contribution and learning it offers rather than by title alone.'},
{title:'Behavioural',text:'Can you give me a concrete example of a time when legal risk and a commercial objective were in tension? What did you do and what was the outcome?',question:'Which answer structure is best?',answer:'STARR: situation, task, your action, result and reflection.',options:['A list of all your legal responsibilities.','STARR: situation, task, your action, result and reflection.','A general description of your personality.'],model:'Use one real situation. Keep the context short and spend most of the answer on your personal action and the result.',b1:'In one project, the commercial team wanted to move quickly but there was a contractual risk that needed to be clarified. My role was to analyse the issue and help find a safe solution. I reviewed the contract, discussed the key points with the team and proposed a workable way forward. The project continued with a clearer understanding of the risk.',b2:'On one development matter, commercial timing was becoming urgent while the contractual position still contained an important area of uncertainty. I reviewed the relevant documentation, identified which risks were genuinely critical and discussed workable options with the operational team. By separating the non-negotiable legal protections from the points where we had flexibility, we were able to move forward without losing sight of the commercial objective.'},
{title:'Development area',text:'What is one area you would need to develop if you joined us, and what are you already doing about it?',question:'What makes a strong answer?',answer:'A real development area plus specific action and evidence of progress.',options:['A real development area plus specific action and evidence of progress.','A fake weakness that is actually a strength.','Saying you do not have any weaknesses.'],model:'Use Dutch as a constructive development area: current level, action plan and professional reason for improving it.',b1:'One area I need to develop is my Dutch. I am still at an early stage, but I am learning regularly because I want to integrate well into the local professional environment. I would continue studying while also learning the vocabulary connected to my role.',b2:'A clear development area for me is Dutch. I am still at an early stage, and I see improving it as part of building a long-term career in the Netherlands. I am studying consistently and I would connect that learning directly to the situations and professional vocabulary I encounter in the role. I can contribute in English from the start while progressively becoming more effective in Dutch.'}
],
unexpected:[
{id:'u1',q:'“What would success look like for you in your first six months?”',why:'Tests whether you can set realistic priorities and enter a new organisation with humility and purpose.',cue:'Use 3 stages: understand → contribute → become more autonomous.',b1:'For me, success in the first six months would mean understanding the team, the main processes and the Dutch property context. I would also want to become useful quickly, build good working relationships and gradually take responsibility for my own work.',b2:'I would define success in three stages: first, understanding the team, priorities and Dutch market context; second, becoming a reliable contributor on live matters by applying my existing experience; and third, reaching increasing autonomy while having built strong working relationships and a clear plan for the local knowledge I still need to deepen.'},
{id:'u2',q:'“Tell me something about yourself that is not on your CV.”',why:'Tests personality, judgement and whether you can be human without becoming too personal.',cue:'Choose one professional quality or useful life experience that reveals how you work.',b1:'One thing that may not be obvious from my CV is that I really enjoy learning from new environments. I have worked with many different types of people and situations, and I like understanding how things work before finding the best way to contribute.',b2:'Something that may not be fully visible on my CV is how much I enjoy learning through change. I have moved between legal, commercial and operational perspectives during my career, and I have found that I am at my best when I need to understand a new context, connect different viewpoints and turn that understanding into something practical.'},
{id:'u3',q:'“What would your former colleagues say about you?”',why:'Tests self-awareness and whether your claimed strengths sound credible to other people.',cue:'Choose 2 qualities + one small proof. Avoid a long list of adjectives.',b1:'I think they would say that I am reliable and calm. When there is a difficult issue, I try to understand the facts, communicate clearly and help the team find a practical solution.',b2:'I think former colleagues would describe me as reliable, pragmatic and composed. I was often the person people came to when a situation involved both legal complexity and an operational deadline, because I would clarify the issue, explain the risk and focus on a workable way forward.'},
{id:'u4',q:'“Tell me about a mistake or a decision you would handle differently today.”',why:'Tests accountability and learning — not whether you have had a perfect career.',cue:'Small real example → own it → what you changed → evidence of learning.',b1:'Earlier in my career, I sometimes spent too much time trying to make an answer completely perfect before sharing it. I learned that it is often better to communicate earlier, explain what is already clear and identify what still needs to be checked. That makes collaboration faster and more effective.',b2:'Earlier in my career, I sometimes waited too long to communicate because I wanted the analysis to be completely finished first. I learned that in fast-moving projects, it is often more valuable to communicate the current risk position early, distinguish what is confirmed from what still needs verification, and update the team as the analysis develops. I changed my approach and became more proactive in that respect.'},
{id:'u5',q:'“What would you do in your first 30 days?”',why:'Tests how you learn, prioritise and enter a new role without pretending to know everything immediately.',cue:'Listen and map → meet key people → learn processes → identify quick contribution.',b1:'In the first 30 days, I would focus on understanding the team, the priorities and the main processes. I would meet the people I work with most closely, learn the important Dutch procedures for the role and identify where I can start contributing with my existing experience.',b2:'My first priority would be to build a clear map of the role: the team, decision-making process, key stakeholders, current matters and the Dutch practices most relevant to my responsibilities. I would listen carefully before trying to change anything, while also identifying a few areas where my existing legal and commercial experience could help the team immediately.'},
{id:'u6',q:'“What do you do when you disagree with a colleague or stakeholder?”',why:'Tests maturity, direct communication and your ability to protect relationships while defending a position.',cue:'Clarify objective → listen → explain evidence → find common ground → escalate only if necessary.',b1:'I first try to understand why we disagree and what the other person needs to achieve. Then I explain my position clearly and use facts or the contract to support it. I try to find a solution that protects the important point while allowing the project to continue.',b2:'I try to separate the person from the issue. I first clarify the shared objective and understand the reasoning behind the other position. Then I explain my analysis and the consequences of the different options as clearly as possible. If there is room for compromise, I look for it; if a risk is genuinely unacceptable, I explain why and what alternatives are available.'},
{id:'u7',q:'“Why are you making this move now?”',why:'Tests whether the Netherlands move and career change are intentional, stable and positive.',cue:'Long-term decision → next career chapter → international environment → contribution.',b1:'I am making a deliberate long-term move to the Netherlands and it feels like the right moment to build a new professional chapter. I want to continue working in real estate, use my experience and develop in a more international environment.',b2:'This is a deliberate long-term decision rather than a short-term experiment. After building significant experience in the French property sector, I am ready for a new professional chapter where I can apply what I know in a different market, continue learning and contribute in an international environment.'},
{id:'u8',q:'“If we called your previous manager, what would they say you still need to improve?”',why:'Tests honesty and consistency. It is another version of the development-area question.',cue:'Dutch is a safe, relevant answer here: current gap → action → commitment.',b1:'For this move, they would probably say that I need to develop my Dutch. I agree with that. I am still at an early stage, but I am working on it regularly because I want to integrate well and become more effective in the local environment.',b2:'In the context of moving to the Netherlands, the clearest development area would be Dutch. I am still at an early stage, and I am realistic about the fact that stronger Dutch will make me more effective with local colleagues, partners and clients. I am already working on it consistently and I would continue to connect the language learning directly to the role.'}
],
sim:{
legal:[
{q:'Tell me about yourself and the value you would bring to a Legal & Business Affairs role.',cue:'Identity → dual legal/commercial value → 2 proof points → Netherlands direction.',model:'I am a real-estate legal and commercial professional with more than 24 years’ experience across property development, legal advisory work and sales management. What I would bring to a Legal & Business Affairs role is the ability to look at a transaction from both a risk and a business perspective. I have negotiated development contracts, advised operational teams, managed property sales and coordinated with notaries, lawyers, investors and technical stakeholders. I am now looking to apply that cross-functional experience in the Netherlands while building strong knowledge of the local legal and market framework.'},
{q:'Give me an example of a difficult contract negotiation and how you moved it forward.',cue:'STARR. Situation 15% → Task 10% → Action 50% → Result 15% → Reflection 10%.',model:'On a development project, a contractual disagreement created uncertainty about responsibilities between several parties. My task was to secure the legal position without unnecessarily delaying the project. I reviewed the relevant agreements, identified the core exposure and separated the points that were legally essential from those that were commercially negotiable. I then worked with the operational team and external partners to reframe the discussion around the project objectives. We reached workable wording and the team could proceed with greater clarity. It reinforced my belief that strong legal support should manage risk while helping the business move forward.'},
{q:'How would you approach an issue where you do not yet know the Dutch legal rule?',cue:'Do not bluff. Clarify facts → identify issue → research / local expert input → document advice → learn.',model:'I would never assume that the French approach applies. I would first clarify the facts and the business objective, identify the legal question precisely and determine what level of risk or timing is involved. I would then use the appropriate Dutch sources and, where necessary, seek local expert input. My contribution would be to structure the issue, ask the right questions and translate the legal analysis into practical advice for the operational team. That approach also helps me build local knowledge efficiently.'},
{q:'Why should we choose you rather than someone with direct Dutch-market experience?',cue:'Respect their advantage → explain your distinctive combination → show learning speed → fit.',model:'Direct Dutch-market experience is clearly valuable, and I would not try to minimise that. What I can offer is a distinctive combination of senior property-development experience, contract negotiation, sales management and stakeholder coordination. I understand how legal decisions affect transactions and operational priorities. If the role needs someone who can connect those perspectives and learn the local framework quickly, I believe my background could add a different and useful dimension to the team.'}
],
development:[
{q:'What makes your experience relevant to a property-development or transaction role in the Netherlands?',cue:'Development lifecycle → legal + commercial → stakeholders → transferability.',model:'My experience covers several stages of the property-development lifecycle. I have worked on contract drafting and negotiation, planning and development issues, risk prevention, property valuation, sales processes and stakeholder coordination. That means I understand not only the legal documentation but also the commercial and operational decisions around it. The local rules are different, but the ability to analyse a project, identify risks, coordinate specialists and keep the transaction moving is directly transferable.'},
{q:'Tell me about a project where you had to coordinate many stakeholders.',cue:'STARR + name categories, not confidential names. Explain how you aligned priorities.',model:'On development projects I regularly worked with operational teams, notaries, lawyers, investors, surveyors and technical partners. In one case, several workstreams had to be aligned before a transaction could move forward. I mapped the outstanding points, clarified who owned each decision and created a clear sequence for legal and operational follow-up. By keeping the discussion focused on dependencies and deadlines, we reduced confusion and allowed the parties to progress more efficiently. It showed the value of structured communication in complex projects.'},
{q:'How do you balance commercial urgency with legal risk?',cue:'Not “legal blocks business.” Risk level → options → recommendation → decision ownership.',model:'I start by understanding the commercial objective and the real deadline, because that determines which risks matter most. I then assess the legal exposure and distinguish between a risk that must be prevented, one that can be mitigated and one that may be acceptable with the right information. Rather than simply saying no, I try to present workable options and explain the consequences of each. That allows the business to make an informed decision while preserving the necessary legal safeguards.'},
{q:'What part of the Dutch property market would you need to learn first?',cue:'Show curiosity, not ignorance. Mention transaction process, local planning/contract conventions, stakeholders, language.',model:'I would prioritise understanding the local transaction process, the main contractual conventions, the role of the different professional stakeholders and the planning or regulatory points most relevant to the position. I would also build the Dutch terminology connected to those situations. My aim would be to learn the framework through real cases so that the knowledge becomes operational quickly.'}
],
commercial:[
{q:'How would your legal background help you with international real-estate clients?',cue:'Trust → explain clearly → anticipate risk → negotiate → client experience.',model:'My legal background helps me give clients clarity and confidence, particularly when a transaction has technical or contractual complexity. I am used to identifying the points that matter, explaining them in practical language and anticipating issues before they become obstacles. Combined with ten years of sales-management experience, that allows me to remain client-focused while still protecting the quality and security of the transaction.'},
{q:'Tell me about your sales and negotiation experience.',cue:'10 years sales manager → valuation / tender / visits / negotiation / client types → result mindset.',model:'I spent ten years in sales management within the property sector. My responsibilities included valuation studies, bringing assets to market, organising calls for tenders, client visits, negotiations and coordination of the documentation needed for transactions. I worked with individual clients, developers, social landlords, institutional owners and professional partners. That experience taught me to adapt the way I communicate while keeping the commercial objective and transaction quality clearly in view.'},
{q:'How would you build trust with an international buyer or seller in English?',cue:'Needs analysis → simple clear language → confirm understanding → transparency → follow-up.',model:'I would begin by understanding the client’s objective, priorities and level of property knowledge. I would keep my English clear and avoid unnecessary technical language, while explaining important risks or steps precisely. I would confirm key information in writing and make sure the client knows what happens next. For me, trust comes from being transparent, responsive and consistent rather than trying to sound overly sophisticated.'},
{q:'What does excellent client service mean to you?',cue:'Anticipation + responsiveness + clarity + realistic promises + follow-through.',model:'Excellent client service means understanding the real need, communicating clearly, anticipating potential issues and following through on what you have promised. In property, clients also need realism: it is better to explain a constraint early and offer options than to create false expectations. My legal and commercial experience has taught me that trust is built through both responsiveness and sound judgement.'}
]
}
};

function shuffle(arr){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a}
function norm(s){return String(s||'').trim().toLowerCase().replace(/[’‘]/g,"'").replace(/\s+/g,' ')}
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1800)}
function say(text){if(!('speechSynthesis'in window)){toast('Speech synthesis is not available in this browser.');return}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang=$('#accent').value;const voices=speechSynthesis.getVoices();const pref=voices.find(v=>v.lang===u.lang)||voices.find(v=>v.lang.startsWith(u.lang.slice(0,2)));if(pref)u.voice=pref;u.rate=.92;speechSynthesis.speak(u)}
document.addEventListener('click',e=>{const b=e.target.closest('[data-say]');if(b)say(b.dataset.say);const s=e.target.closest('[data-scroll]');if(s){const el=$(s.dataset.scroll);if(el)el.scrollIntoView({behavior:'smooth'})}});

function renderVocab(){
 const filter=$('#vocabFilter').value, query=norm($('#vocabSearch').value);
 const items=DATA.vocab.filter(v=>(filter==='all'||v[0]===filter)&&(!query||norm(v.join(' ')).includes(query)));
 $('#vocabGrid').innerHTML=items.map(v=>`<article class="vocab-card"><span class="icon">${v[1]}</span><h3>${v[2]}</h3><div class="translation frText">${v[3]}</div><p class="definition">${v[4]}</p><p class="example">“${v[5]}”</p><button data-say="${v[5].replace(/"/g,'&quot;')}">🔊 Listen</button></article>`).join('');
}
$('#vocabFilter').addEventListener('change',renderVocab);$('#vocabSearch').addEventListener('input',renderVocab);

function setAuto(id,correct){auto[id]={correct,attempted:true};saveState();updateScores()}
function renderQuiz(){
 $('#upgradeGrid').innerHTML=DATA.upgrade.map((item,index)=>`<article class="quiz-card" data-q="${item.id}">
   <div class="quiz-head"><span class="quiz-number">${String(index+1).padStart(2,'0')}</span><span class="quiz-skill">PRECISION & IMPACT</span></div>
   <h3>${item.q}</h3>
   <p class="quiz-instruction">Choose the answer that sounds the most precise, credible and professional.</p>
   <div class="options">${shuffle(item.choices).map(c=>`<button type="button" data-answer="${encodeURIComponent(c)}">${c}</button>`).join('')}</div>
   <div class="feedback feedback-box" aria-live="polite">Choose an answer to receive immediate feedback.</div>
   <div class="quiz-coach">💡 Focus on <strong>active verbs + evidence + professional value</strong>, not vague adjectives.</div>
 </article>`).join('');

 $$('#upgradeGrid .quiz-card').forEach(card=>card.addEventListener('click',e=>{
   const b=e.target.closest('button[data-answer]'); if(!b)return;
   const item=DATA.upgrade.find(x=>x.id===card.dataset.q);
   const val=decodeURIComponent(b.dataset.answer);
   const ok=val===item.answer;

   $$('.options button',card).forEach(x=>x.classList.remove('correct','wrong'));
   b.classList.add(ok?'correct':'wrong');

   const f=$('.feedback',card);
   if(ok){
     f.innerHTML=`<strong>✅ CORRECT</strong><span>${item.feedback}</span>`;
     f.className='feedback feedback-box good';
   }else{
     f.innerHTML=`<strong>❌ NOT YET — TRY AGAIN</strong><span>This answer is understandable, but another option is more precise and professional.</span>`;
     f.className='feedback feedback-box bad';
   }
   setAuto(item.id,ok);
 }));
}

function renderFills(target,data){
 $(target).innerHTML=data.map((item,index)=>`<div class="fill-item" data-fill="${item.id}">
   <div class="fill-top"><span class="fill-number">${String(index+1).padStart(2,'0')}</span><div class="fill-sentence">${item.q}</div></div>
   <input autocomplete="off" placeholder="Type the missing word(s)" aria-label="Grammar answer">
   <div class="fill-actions">
     <button class="check-fill" type="button">✓ Check my answer</button>
     <button class="hint-button" type="button">💡 Show hint</button>
   </div>
   <div class="verb-hint" aria-live="polite"><b>${item.clue||'Useful clue'}</b><br><span>${item.hint}</span></div>
   <div class="feedback feedback-box" aria-live="polite">Type your answer, then check it.</div>
 </div>`).join('');

 $$(`${target} .fill-item`).forEach(card=>{
   const hintBtn=$('.hint-button',card);
   const hintBox=$('.verb-hint',card);
   hintBtn.addEventListener('click',()=>{
     const showing=hintBox.classList.toggle('show');
     hintBtn.textContent=showing?'🙈 Hide hint':'💡 Show hint';
   });

   $('.check-fill',card).addEventListener('click',()=>{
     const item=data.find(x=>x.id===card.dataset.fill);
     const val=norm($('input',card).value);
     const f=$('.feedback',card);
     if(!val){
       f.innerHTML='<strong>⌨️ TYPE AN ANSWER FIRST</strong><span>Use the hint if you need the base verb or grammar clue.</span>';
       f.className='feedback feedback-box neutral';
       return;
     }
     const ok=item.answers.some(a=>norm(a)===val);
     if(ok){
       f.innerHTML=`<strong>✅ CORRECT</strong><span>Good — now read the complete sentence aloud once.</span>`;
       f.className='feedback feedback-box good';
     }else{
       f.innerHTML=`<strong>❌ NOT YET — TRY AGAIN</strong><span>${item.hint} You can open the hint to see the base verb or clue.</span>`;
       f.className='feedback feedback-box bad';
     }
     setAuto(item.id,ok);
   });

   $('input',card).addEventListener('keydown',e=>{if(e.key==='Enter')$('.check-fill',card).click()});
 });
}

function renderStory(key='negotiation'){
 $$('.story-tab').forEach(b=>b.classList.toggle('active',b.dataset.story===key));
 const s=DATA.stories[key];
 $('#storyPanel').innerHTML=`<h3>${s.title}</h3><p><strong>Prompt:</strong> ${s.prompt}</p><ol>${s.map.map(x=>`<li>${x}</li>`).join('')}</ol><p class="cue"><strong>${s.power}</strong></p>`;
}
$$('.story-tab').forEach(b=>b.addEventListener('click',()=>renderStory(b.dataset.story)));

function renderPressure(){
 $('#pressureGrid').innerHTML=DATA.pressure.map(p=>`<article class="pressure-card"><div class="q">${p.q}</div><div class="answer-map"><span>1 · Position</span><span>2 · Proof</span><span>3 · Pivot</span></div><div class="pressure-actions"><button class="cue-btn" data-toggle="cue-${p.id}">💡 Cue</button><button class="answer-btn" data-toggle="b1-${p.id}">B1+</button><button class="answer-btn" data-toggle="b2-${p.id}">B2</button></div><div id="cue-${p.id}" class="cue hidden">${p.cue}</div><div id="b1-${p.id}" class="model hidden"><b>B1+ model</b><p>${p.b1}</p><button data-say="${p.b1.replace(/"/g,'&quot;')}">🔊 Listen</button></div><div id="b2-${p.id}" class="model hidden"><b>B2 model</b><p>${p.b2}</p><button data-say="${p.b2.replace(/"/g,'&quot;')}">🔊 Listen</button></div></article>`).join('');
 $$('#pressureGrid [data-toggle]').forEach(b=>b.addEventListener('click',()=>$('#'+b.dataset.toggle).classList.toggle('hidden')));
}
function renderUnexpected(){
 const skills=['Future success','Self-awareness','Professional reputation','Learning from mistakes','First 30 days','Handling disagreement','Motivation for change','Development area'];
 $('#unexpectedGrid').innerHTML=DATA.unexpected.map((p,index)=>`<article class="unexpected-card ${index<4?'guided':'independent'}">
   <div class="unexpected-card-head">
     <span class="unexpected-number">${String(index+1).padStart(2,'0')}</span>
     <div><small>${index<4?'GUIDED PRACTICE':'MORE INDEPENDENT'}</small><span class="unexpected-skill">${skills[index]}</span></div>
   </div>

   <div class="uq">${p.q}</div>

   <div class="decode-box">
     <span class="decode-label">STEP 1 · DECODE</span>
     <p><b>What are they really testing?</b><br>${p.why}</p>
   </div>

   <div class="unexpected-action-row">
     <button type="button" class="ped-btn plan-btn" data-toggle="ucue-${p.id}"><span>2</span> Build my 3-keyword plan</button>
     <button type="button" class="ped-btn b1-btn" data-toggle="ub1-${p.id}"><span>3</span> Compare B1+</button>
     <button type="button" class="ped-btn b2-btn" data-toggle="ub2-${p.id}"><span>4</span> Compare B2</button>
   </div>

   <div id="ucue-${p.id}" class="answer-stage cue hidden">
     <div class="stage-label">STEP 2 · PLAN BEFORE YOU SPEAK</div>
     <p><b>3-keyword speaking map:</b> ${p.cue}</p>
     <p class="stage-task">Now close this box and answer aloud for 45–60 seconds before opening a model.</p>
   </div>

   <div id="ub1-${p.id}" class="answer-stage model hidden">
     <div class="stage-label">STEP 4 · B1+ COMPARISON MODEL</div>
     <p>${p.b1}</p>
     <button class="audio-model-btn" data-say="${p.b1.replace(/"/g,'&quot;')}">🔊 Listen to B1+</button>
   </div>

   <div id="ub2-${p.id}" class="answer-stage model hidden">
     <div class="stage-label">STEP 4 · B2 COMPARISON MODEL</div>
     <p>${p.b2}</p>
     <button class="audio-model-btn" data-say="${p.b2.replace(/"/g,'&quot;')}">🔊 Listen to B2</button>
   </div>
 </article>`).join('');

 $$('#unexpectedGrid [data-toggle]').forEach(b=>b.addEventListener('click',()=>{
   const target=$('#'+b.dataset.toggle);
   const willOpen=target.classList.contains('hidden');
   target.classList.toggle('hidden');
   b.classList.toggle('open',willOpen);
 }));
}


let currentListening=0;
function loadListening(i=currentListening){
 currentListening=(i+DATA.listening.length)%DATA.listening.length;const l=DATA.listening[currentListening];
 $('#listeningTitle').textContent=l.title;$('#listeningPrompt').textContent='Listen once before revealing the text. '+l.question;
 $('#listeningOptions').innerHTML=shuffle(l.options).map(o=>`<button data-lanswer="${encodeURIComponent(o)}">${o}</button>`).join('');
 $('#listeningFeedback').textContent='';$('#listeningFeedback').className='feedback';
 ['#transcript','#listeningStrategy','#listeningB1','#listeningB2'].forEach(id=>$(id).classList.add('hidden'));
 $('#transcript').innerHTML=`<b>Transcript</b><p>${l.text}</p>`;
 $('#listeningStrategy').innerHTML=`<b>Answer strategy</b><p>${l.model}</p>`;
 $('#listeningB1').innerHTML=`<b>B1+ model answer</b><p>${l.b1}</p><button data-say="${l.b1.replace(/"/g,'&quot;')}">🔊 Listen</button>`;
 $('#listeningB2').innerHTML=`<b>B2 model answer</b><p>${l.b2}</p><button data-say="${l.b2.replace(/"/g,'&quot;')}">🔊 Listen</button>`;
 $$('#listeningOptions button').forEach(b=>b.addEventListener('click',()=>{
   const val=decodeURIComponent(b.dataset.lanswer),ok=val===l.answer;
   $$('#listeningOptions button').forEach(x=>x.classList.remove('correct','wrong'));
   b.classList.add(ok?'correct':'wrong');
   if(ok){
     $('#listeningFeedback').innerHTML='<strong>✅ CORRECT</strong><span>You identified the interviewer’s real concern. Answer aloud before opening a model.</span>';
     $('#listeningFeedback').className='feedback feedback-box good';
     $('#listeningStrategy').classList.remove('hidden');
   }else{
     $('#listeningFeedback').innerHTML='<strong>❌ NOT YET — TRY AGAIN</strong><span>Listen for what the interviewer wants to evaluate, not only the vocabulary in the question.</span>';
     $('#listeningFeedback').className='feedback feedback-box bad';
   }
   setAuto('listen'+currentListening,ok);
 }));
}
$('#newListening').addEventListener('click',()=>loadListening(currentListening+1));
$('#playListening').addEventListener('click',()=>say(DATA.listening[currentListening].text));
$('#toggleTranscript').addEventListener('click',()=>$('#transcript').classList.toggle('hidden'));
$('#showListeningB1').addEventListener('click',()=>$('#listeningB1').classList.toggle('hidden'));
$('#showListeningB2').addEventListener('click',()=>$('#listeningB2').classList.toggle('hidden'));

let track='legal',simIndex=0;
function loadSim(){
 const arr=DATA.sim[track],item=arr[simIndex%arr.length];$('#simRole').textContent={legal:'Legal & Business Affairs',development:'Property Development / Transactions',commercial:'Commercial / International Agency'}[track];
 $('#simNumber').textContent=(simIndex%arr.length)+1;$('#simQuestion').textContent=item.q;$('#simCue').innerHTML=`<b>Answer map</b><p>${item.cue}</p>`;$('#simModel').innerHTML=`<b>B2 model</b><p>${item.model}</p><button data-say="${item.model.replace(/"/g,'&quot;')}">🔊 Play model</button>`;$('#simCue').classList.add('hidden');$('#simModel').classList.add('hidden');
}
$('#roleTrack').addEventListener('change',e=>{track=e.target.value;simIndex=0;loadSim()});$('#newSimQuestion').addEventListener('click',()=>{simIndex++;loadSim()});$('#playSimQuestion').addEventListener('click',()=>say(DATA.sim[track][simIndex%DATA.sim[track].length].q));$('#showSimCue').addEventListener('click',()=>$('#simCue').classList.toggle('hidden'));$('#showSimModel').addEventListener('click',()=>$('#simModel').classList.toggle('hidden'));

$$('.model-btn[data-model]').forEach(b=>b.addEventListener('click',()=>$('#'+b.dataset.model).classList.toggle('hidden')));
$$('[data-toggle]').forEach(b=>{if(!b.closest('#pressureGrid')&&!b.closest('#unexpectedGrid'))b.addEventListener('click',()=>{const target=$('#'+b.dataset.toggle);if(target)target.classList.toggle('hidden')})});
let modelsShown=false;$('#showAllModels').addEventListener('click',()=>{modelsShown=!modelsShown;$$('.model').forEach(m=>m.classList.toggle('hidden',!modelsShown));$('#showAllModels').textContent=modelsShown?'🙈 Hide models':'👁 Reveal models'});

$('#toggleFrench').addEventListener('click',()=>{const hidden=document.body.classList.toggle('hide-fr');$$('.frText').forEach(x=>x.style.display=hidden?'none':'');$('#toggleFrench').textContent=hidden?'🇫🇷 Show French':'🇫🇷 Hide French';});
$('#stopSpeech').addEventListener('click',()=>speechSynthesis?.cancel());$('#printPage').addEventListener('click',()=>window.print());

$$('.done-btn').forEach(b=>b.addEventListener('click',()=>{done.add(b.dataset.done);b.textContent='✓ Section complete';b.disabled=true;saveState();updateScores()}));

$$('[data-rubric]').forEach(r=>r.addEventListener('input',()=>{r.nextElementSibling.textContent=r.value+'/5';updateMockScore();saveState()}));
function updateMockScore(){const vals=$$('[data-rubric]').map(x=>+x.value);const pct=Math.round(vals.reduce((a,b)=>a+b,0)/(vals.length*5)*100);$('#mockPercent').textContent=pct+'%';return pct}

async function startRecording(){
 if(!navigator.mediaDevices?.getUserMedia){toast('Microphone recording is unavailable in this browser.');return}
 try{const stream=await navigator.mediaDevices.getUserMedia({audio:true});chunks=[];mediaRecorder=new MediaRecorder(stream);mediaRecorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};mediaRecorder.onstop=()=>{const blob=new Blob(chunks,{type:mediaRecorder.mimeType||'audio/webm'});if(recordingUrl)URL.revokeObjectURL(recordingUrl);recordingUrl=URL.createObjectURL(blob);$('#audioPlayback').src=recordingUrl;$('#downloadRecording').href=recordingUrl;$('#downloadRecording').classList.remove('hidden');stream.getTracks().forEach(t=>t.stop())};mediaRecorder.start();$('#startRec').disabled=true;$('#stopRec').disabled=false;toast('Recording started')}
 catch(e){toast('Microphone permission was not available.')}
}
$('#startRec').addEventListener('click',startRecording);$('#stopRec').addEventListener('click',()=>{if(mediaRecorder?.state==='recording')mediaRecorder.stop();$('#startRec').disabled=false;$('#stopRec').disabled=true});$('#clearRec').addEventListener('click',()=>{if(recordingUrl)URL.revokeObjectURL(recordingUrl);recordingUrl=null;$('#audioPlayback').removeAttribute('src');$('#audioPlayback').load();$('#downloadRecording').classList.add('hidden')});

const autoSections=[
 ['Express professional value with precise B2 vocabulary','Upgrade the answer','QCM / feedback immédiat',['up1','up2','up3','up4','up5','up6','up7','up8']],
 ['Distinguish career overview from finished experience','Present perfect vs past simple','Texte à trous / feedback immédiat',['g1a','g1b','g1c','g1d']],
 ['Explain method and impact accurately','by + -ing','Texte à trous / feedback immédiat',['g2a','g2b','g2c','g2d']],
 ['Frame transferability and development areas professionally','Contrast & transferability','Texte à trous / feedback immédiat',['g3a','g3b','g3c','g3d']],
 ['Identify the intention behind interview questions','Listening under pressure','Écoute + QCM',['listen0','listen1','listen2','listen3','listen4']]
];
function sectionStats(ids){const attempted=ids.filter(id=>auto[id]?.attempted||auto[id]?.locked),good=ids.filter(id=>auto[id]?.correct);return{attempted:attempted.length,total:ids.length,good:good.length,pct:attempted.length?Math.round(good.length/attempted.length*100):0}}
function statusFor(stats){if(!stats.attempted)return'Non commencé';if(stats.attempted<stats.total)return'En cours';if(stats.pct>=75)return'Acquis';return'Non acquis'}
function updateScores(){
 const ids=autoSections.flatMap(x=>x[3]);const attempted=ids.filter(id=>auto[id]?.attempted||auto[id]?.locked).length,correct=ids.filter(id=>auto[id]?.correct).length;
 $('#score').textContent=correct;$('#maxScore').textContent=ids.length;const pct=attempted?Math.round(correct/attempted*100):0;$('#autoPercent').textContent=pct+'%';
 const completion=Math.round((attempted+done.size*4)/(ids.length+4)*100);$('#completionPercent').textContent=Math.min(100,completion)+'%';$('#progressText').textContent=Math.min(100,completion)+'% complete';$('#progressFill').style.width=Math.min(100,completion)+'%';
 $('#autoEvaluationRows').innerHTML=autoSections.map(s=>{const st=sectionStats(s[3]);return`<tr><td>${s[0]}</td><td>${s[1]}</td><td>${s[2]}</td><td>${st.good}/${st.total} correct · ${st.attempted}/${st.total} attempted</td><td>${statusFor(st)}</td></tr>`}).join('');
 updateOverall();
}
function updateOverall(){
 const manualVals=$$('[data-manual-status]').map(x=>x.value);const autoPct=parseInt($('#autoPercent').textContent)||0;const mock=updateMockScore();let label='Non commencé',cls='';
 if(autoPct||manualVals.some(x=>x!=='Non commencé')){if(autoPct>=75&&mock>=70&&manualVals.filter(x=>x==='Acquis').length>=2){label='Acquis';cls='achieved'}else if(manualVals.includes('Non acquis')&&autoPct<50){label='Non acquis';cls='notachieved'}else{label='En cours';cls='progress'}}
 const e=$('#overallStatus');e.textContent=label;e.className='evaluation-badge '+cls;
}
$$('[data-manual-status],[data-manual-score],[data-manual-comment],[data-survey],#learnerComments,#generalTrainerComments').forEach(el=>el.addEventListener('change',()=>{updateOverall();saveState()}));

function collect(){
 const notes={};$$('[data-note]').forEach(x=>notes[x.dataset.note]=x.value);
 const manual={};$$('[data-manual-status]').forEach(x=>{manual[x.dataset.manualStatus]=manual[x.dataset.manualStatus]||{};manual[x.dataset.manualStatus].status=x.value});$$('[data-manual-score]').forEach(x=>{manual[x.dataset.manualScore]=manual[x.dataset.manualScore]||{};manual[x.dataset.manualScore].score=x.value});$$('[data-manual-comment]').forEach(x=>{manual[x.dataset.manualComment]=manual[x.dataset.manualComment]||{};manual[x.dataset.manualComment].comment=x.value});
 const survey={};$$('[data-survey]').forEach(x=>survey[x.dataset.survey]=x.value);
 const rubrics={};$$('[data-rubric]').forEach(x=>rubrics[x.dataset.rubric]=x.value);
 return{auto,done:[...done],notes,manual,survey,rubrics,learner:$('#learnerName').value,trainer:$('#trainerName').value,date:$('#evaluationDate').value,learnerComments:$('#learnerComments').value,trainerComments:$('#generalTrainerComments').value,lastSaved:new Date().toISOString()}
}
function saveState(show=false){const s=collect();localStorage.setItem(STORAGE_KEY,JSON.stringify(s));$('#lastSaved').textContent=new Date(s.lastSaved).toLocaleString();if(show)toast('Lesson progress saved in this browser.')}
function restore(){
 try{const s=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');if(!s)return;auto=s.auto||{};(s.done||[]).forEach(x=>done.add(x));Object.entries(s.notes||{}).forEach(([k,v])=>{const x=$(`[data-note="${k}"]`);if(x)x.value=v});Object.entries(s.manual||{}).forEach(([k,v])=>{const st=$(`[data-manual-status="${k}"]`),sc=$(`[data-manual-score="${k}"]`),co=$(`[data-manual-comment="${k}"]`);if(st)st.value=v.status||'Non commencé';if(sc)sc.value=v.score||'';if(co)co.value=v.comment||''});Object.entries(s.survey||{}).forEach(([k,v])=>{const x=$(`[data-survey="${k}"]`);if(x)x.value=v});Object.entries(s.rubrics||{}).forEach(([k,v])=>{const x=$(`[data-rubric="${k}"]`);if(x){x.value=v;x.nextElementSibling.textContent=v+'/5'}});if(s.learner)$('#learnerName').value=s.learner;if(s.trainer)$('#trainerName').value=s.trainer;if(s.date)$('#evaluationDate').value=s.date;$('#learnerComments').value=s.learnerComments||'';$('#generalTrainerComments').value=s.trainerComments||'';if(s.lastSaved)$('#lastSaved').textContent=new Date(s.lastSaved).toLocaleString();$$('.done-btn').forEach(b=>{if(done.has(b.dataset.done)){b.textContent='✓ Section complete';b.disabled=true}});
 }catch(e){console.warn(e)}
}
$('#saveEvaluation').addEventListener('click',()=>saveState(true));

function reportText(){
 const s=collect(),rows=autoSections.map(x=>{const st=sectionStats(x[3]);return`${x[0]} — ${st.good}/${st.total} correct — ${statusFor(st)}`}).join('\n');
 const manual=Object.entries(s.manual).map(([k,v])=>`${k}: ${v.status||'Non commencé'}${v.score?` · ${v.score}/5`:''}${v.comment?` · ${v.comment}`:''}`).join('\n');
 return`BILAN D'ÉVALUATION DES ACQUIS — ISABELLE LESSON 23
Own Your Value · First Interview Masterclass

Apprenante: ${s.learner}
Formatrice: ${s.trainer}
Date: ${s.date}
Résultat global: ${$('#overallStatus').textContent}
Score exercices automatiques: ${$('#autoPercent').textContent}
Mock interview: ${$('#mockPercent').textContent}

OBJECTIFS AUTOMATIQUES
${rows}

PRODUCTIONS ORALES / ÉCRITES
${manual}

COMMENTAIRES APPRENANTE
${s.learnerComments||'—'}

OBSERVATIONS FORMATRICE
${s.trainerComments||'—'}
`}
$('#copySummary').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(reportText());toast('Evaluation summary copied.')}catch(e){toast('Copy was blocked by the browser.')}});

function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function downloadBlob(blob,name){const a=document.createElement('a');const u=URL.createObjectURL(blob);a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1000)}
$('#downloadReport').addEventListener('click',()=>{
 const s=collect();const rows=autoSections.map(x=>{const st=sectionStats(x[3]);return`<tr><td>${esc(x[0])}</td><td>${esc(x[1])}</td><td>${esc(x[2])}</td><td>${st.good}/${st.total}</td><td>${statusFor(st)}</td></tr>`}).join('');
 const manual=Object.entries(s.manual).map(([k,v])=>`<tr><td>${esc(k)}</td><td>Production orale/écrite</td><td>Évaluation manuelle</td><td>${esc(v.score||'—')}/5</td><td>${esc(v.status||'Non commencé')}<br>${esc(v.comment||'')}</td></tr>`).join('');
 const h=`<!doctype html><html lang="fr"><meta charset="utf-8"><title>Bilan Qualiopi Isabelle Lesson 23</title><style>body{font-family:Arial,sans-serif;max-width:1100px;margin:35px auto;padding:0 22px;color:#173042}h1{color:#173042}h2{color:#2d7588}table{border-collapse:collapse;width:100%;font-size:12px}th,td{border:1px solid #bbb;padding:8px;vertical-align:top}th{background:#eee}.box{border:1px solid #ccc;padding:12px;margin:8px 0;border-radius:8px}.meta{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}@media print{body{margin:0;max-width:none}}</style><body><h1>Bilan d'évaluation des acquis — Qualiopi</h1><h2>Isabelle · Lesson 23 — Own Your Value</h2><div class="meta"><div class="box"><b>Apprenante:</b> ${esc(s.learner)}</div><div class="box"><b>Formatrice:</b> ${esc(s.trainer)}</div><div class="box"><b>Date:</b> ${esc(s.date)}</div><div class="box"><b>Résultat global:</b> ${esc($('#overallStatus').textContent)}</div><div class="box"><b>Auto:</b> ${esc($('#autoPercent').textContent)}</div><div class="box"><b>Mock interview:</b> ${esc($('#mockPercent').textContent)}</div></div><h2>Objectifs et preuves</h2><table><thead><tr><th>Objectif</th><th>Activité</th><th>Mode</th><th>Score</th><th>Résultat</th></tr></thead><tbody>${rows}${manual}</tbody></table><h2>Retour apprenante</h2><div class="box">${esc(s.learnerComments||'—')}</div><h2>Observations formatrice</h2><div class="box">${esc(s.trainerComments||'—')}</div><h2>Satisfaction</h2><div class="box">${Object.entries(s.survey).map(([k,v])=>`${esc(k)}: ${esc(v||'—')}/5`).join(' · ')}</div><p><small>Rapport généré depuis la page interactive Isabelle Lesson 23.</small></p></body></html>`;
 downloadBlob(new Blob([h],{type:'text/html;charset=utf-8'}),'Isabelle-Davion-Lesson-23-Bilan-Qualiopi.html');toast('Qualiopi report downloaded.');
});
$('#resetLesson').addEventListener('click',()=>{if(confirm('Reset all saved answers, scores and notes for Lesson 23?')){localStorage.removeItem(STORAGE_KEY);location.reload()}});

if(!$('#evaluationDate').value)$('#evaluationDate').value=new Date().toISOString().slice(0,10);
let seconds=0;setInterval(()=>{seconds++;const m=String(Math.floor(seconds/60)).padStart(2,'0'),s=String(seconds%60).padStart(2,'0');$('#timer').textContent=`${m}:${s}`},1000);

renderVocab();renderQuiz();renderFills('#grammar1',DATA.grammar1);renderFills('#grammar2',DATA.grammar2);renderFills('#grammar3',DATA.grammar3);renderStory();renderPressure();renderUnexpected();loadListening();loadSim();restore();updateScores();
