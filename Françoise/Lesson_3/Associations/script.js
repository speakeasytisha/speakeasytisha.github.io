"use strict";
/* ============ DATA ============ */
const VOCAB={"Your roles": [["association", "association", "A group of people working for a shared purpose.", "I work for a volleyball association."], ["employee", "salariée", "Someone who is paid to work.", "I am employed by the volleyball association."], ["volunteer", "bénévole", "A person who helps without being paid.", "I volunteer for two other associations."], ["accounting", "comptabilité", "The work of managing financial records.", "I used to work in accounting."], ["coordinate", "coordonner", "To organise people and activities.", "I coordinate activities and meetings."], ["follow up", "relancer / faire le suivi", "To check progress after a previous contact.", "I follow up with the project partners."], ["draw up a budget", "établir un budget", "To prepare a financial plan.", "I draw up budgets for events."], ["join", "rejoindre / adhérer à", "To become a member of a group or start working with it.", "I might join another association soon."]], "Volleyball club": [["sports association", "association sportive", "A non-profit club organised around a sport.", "I am paid by a sports association: a volleyball club."], ["registration", "inscription", "Signing up officially as a member or player.", "I manage the registrations at the start of the season."], ["membership fee", "cotisation", "The money members pay each year to belong to a club.", "Members pay their membership fee in September."], ["season", "saison", "The period of the year when matches are played.", "The new season starts in September."], ["match / tournament", "match / tournoi", "A game / a competition with several teams and games.", "We are organising a tournament in the spring."], ["coach", "entraîneur / entraîneuse", "The person who trains a team.", "I send the training schedule to the coaches."], ["sports hall", "gymnase", "An indoor building for sport.", "I book the sports hall for training sessions."], ["the board", "le bureau / le conseil d’administration", "The elected group that runs an association.", "I present the accounts to the board."]], "Heritage & projects": [["heritage", "patrimoine", "Valuable historical or cultural things passed down.", "We protect local heritage."], ["preserve", "préserver", "To keep something safe from damage or loss.", "We preserve historic buildings."], ["restore", "restaurer", "To repair a historic structure carefully.", "The team hopes to restore the canal."], ["listed monument", "monument classé", "A building with official heritage protection.", "Is the building a listed monument?"], ["funding", "financement", "Money provided for a project.", "The project received funding."], ["grant", "subvention", "Money awarded to support a project.", "We applied for a grant."], ["donor", "donateur", "A person or organisation giving money.", "We thank our donors."], ["fundraising", "collecte de fonds", "Activities to raise money.", "We organise a fundraising campaign."]], "Water & landscape": [["irrigation canal", "canal d’irrigation", "A waterway carrying water to agricultural land.", "The canal carried water to fields."], ["sluice gate", "vanne / écluse de régulation", "A gate that controls water flow.", "The sluice gate regulates the water flow."], ["lock", "écluse de navigation", "A chamber that raises or lowers boats.", "This irrigation canal is not a navigation lock."], ["snowmelt", "eau de fonte des neiges", "Water produced as snow melts.", "Snowmelt feeds mountain streams."], ["stream", "ruisseau", "A small flowing body of water.", "A stream supplies the canal."], ["water supply", "approvisionnement en eau", "The system for bringing water to people.", "The canal supported the local water supply."], ["stonework", "maçonnerie en pierre", "Structures built from stone.", "The historic stonework needs careful repairs."], ["erosion", "érosion", "Gradual wearing away by water or weather.", "Erosion has damaged the canal."]], "Village traditions": [["communal bread oven", "four à pain communal", "An oven shared by a village community.", "Families used a communal bread oven."], ["take turns", "faire à tour de rôle", "To do something one person after another.", "Neighbours took turns baking bread."], ["fountain", "fontaine", "A structure where water flows for people to collect.", "The village fountain was a meeting place."], ["craftsmanship", "savoir-faire artisanal", "Skill in making or repairing things by hand.", "The restoration requires traditional craftsmanship."], ["pass down", "transmettre", "To give knowledge or traditions to another generation.", "We pass down traditions to younger generations."]], "History & research": [["archaeology", "archéologie", "The study of the past through material remains.", "I volunteer with an archaeology association."], ["excavation", "fouille archéologique", "Careful digging to uncover remains.", "The excavation revealed old foundations."], ["genealogy", "généalogie", "The study of family histories.", "I help with genealogy research."], ["archive", "archives", "A collection of historical records.", "We consult local archives."], ["family tree", "arbre généalogique", "A diagram showing family relationships.", "We are researching a family tree."], ["castle", "château", "A historic fortified or grand building.", "The association aims to protect a castle near Ajaccio."]], "Communication": [["arrange a meeting", "organiser une réunion", "To set a time for people to meet.", "I arrange meetings with partners."], ["get in touch", "prendre contact", "To contact someone.", "I get in touch with local partners."], ["look into", "examiner / se renseigner sur", "To investigate something.", "I will look into the funding options."], ["carry out", "mener / réaliser", "To complete a planned task.", "We carry out conservation work."], ["set up", "mettre en place", "To organise or establish something.", "We set up community events."], ["apply for", "demander (une aide)", "To formally request something.", "We apply for heritage grants."], ["keep someone updated", "tenir quelqu’un informé", "To share new information regularly.", "I keep the members updated."]]};

/* Exercise types: {t:'qcm',q,o:[options],a,hint,why} · {t:'fill',q,a:[accepted answers],hint,why} · {t:'order',a:'sentence',hint} */
const STEPS=[
{id:1,zone:'tz1',kicker:'STEP 1 · EVERY WEEK',title:'What I usually do',tense:'Present simple',
 cando:'I can describe my job and my weekly routine in each association.',
 when:['Your permanent job and who pays you','Routines and habits: every week, on Saturdays…','Facts about each association'],
 form:[['+','I <b>work</b> · the club <b>pays</b> · she <b>manages</b>'],['−','I <b>don’t work</b> · the club <b>doesn’t pay</b>'],['?','<b>Do</b> you <b>work</b>…? · <b>Does</b> the association <b>meet</b>…?']],
 words:['every day','every week','on Saturdays','once a month','usually','always','often','sometimes','never'],
 examples:['I **work** for a volleyball association. It **pays** my salary.','I **usually answer** emails in the morning.','The heritage association **meets** once a month.','I **don’t get** paid by the other two associations: I **volunteer**.','On Saturdays, the teams **play** matches.'],
 fr:'Travail permanent = présent simple. « Je travaille pour un club de volley » → <b>I work</b> for a volleyball club (pas <i>I am working</i>).',
 watch:'he / she / it / the club → <b>+s</b>: the club organis<b>es</b>, the association meet<b>s</b>, it ha<b>s</b>. Adverbs go <b>before</b> the verb: I <b>usually</b> answer… (but after <i>be</i>: I am <b>always</b> busy).',
 ex:[
  {t:'qcm',q:'Which sentence describes your permanent job?',o:['I am working for a volleyball association.','I work for a volleyball association.','I working for a volleyball association.'],a:'I work for a volleyball association.',hint:'A permanent situation, not something temporary.',why:'Permanent job → present simple.'},
  {t:'fill',q:'The volleyball association ___ (pay) my salary.',a:['pays'],hint:'The association = it → add -s.',why:'it pays'},
  {t:'fill',q:'I ___ (not / get) paid by the other two associations.',a:['don\'t get','do not get'],hint:'I + don’t + base verb.',why:'I don’t get paid… I volunteer.'},
  {t:'qcm',q:'Where does “usually” go?',o:['I manage usually the registrations.','I usually manage the registrations.'],a:'I usually manage the registrations.',hint:'Frequency adverbs go before the main verb.',why:'subject + usually + verb'},
  {t:'fill',q:'___ the heritage association meet every month?',a:['does'],hint:'Question with “the association” (= it).',why:'Does + subject + base verb'},
  {t:'order',a:'I usually answer emails in the morning.',hint:'Subject + adverb + verb + object + time.'}],
 prompt:'Describe a normal week. Who pays you? What do you do for each association? How often?',
 chips:['I work for a volleyball association.','I’m paid by the volleyball association.','I’m in charge of…','I manage the registrations.','I keep the accounts.','I answer emails and phone calls.','I book the sports hall.','I also volunteer for two other associations.','One of them works on…','We meet once a month.','On Saturdays, …'],
 trainer:'~12 min. Ask her: “Tell me about a typical Monday / Saturday.” Correct only the 3rd-person -s and adverb position. Note her real tasks; they will come back in every later step.'},

{id:2,zone:'tz2',kicker:'STEP 2 · NOW & IN THE DIARY',title:'What I’m working on — and what’s planned',tense:'Present continuous',
 cando:'I can talk about current projects and fixed appointments in my diary.',
 when:['Right now / these weeks: a temporary project','A fixed arrangement in the diary: a day, a time, people have agreed'],
 form:[['+','I<b>’m preparing</b> · we<b>’re meeting</b> · the club <b>is organising</b>'],['−','I<b>’m not working</b> · we <b>aren’t meeting</b>'],['?','<b>Are</b> you <b>preparing</b>…? · <b>Is</b> the club <b>holding</b>…?']],
 words:['now','at the moment','currently','these days','this week','this month','tomorrow','next Tuesday','on 15 November'],
 examples:['At the moment, I**’m preparing** the new season.','These days, the heritage association **is working** on a funding application.','I**’m meeting** the treasurer next Tuesday at six.','We**’re holding** a tournament on 15 November.','I **work** for the club (always) — but this month I**’m working** on the registrations (temporary).'],
 fr:'« En ce moment / actuellement » → présent continu. Rendez-vous fixé (jour + heure) → aussi présent continu : « Je vois le maire mardi » → <b>I’m meeting</b> the mayor on Tuesday.',
 watch:'Spelling: organis<b>e</b> → organis<b>ing</b>, plan → pla<b>nn</b>ing, write → writing. Some verbs are almost never in -ing: <b>need, want, know, like, belong</b> → We <b>need</b> volunteers (not <i>are needing</i>).',
 ex:[
  {t:'qcm',q:'Which sentence is about a project these weeks?',o:['I prepare the season every year.','This month, I’m preparing the new season.','I prepared the season last year.'],a:'This month, I’m preparing the new season.',hint:'Look for “this month”.',why:'Temporary project → present continuous.'},
  {t:'fill',q:'This month, we ___ (prepare) the new volleyball season.',a:['are preparing','\'re preparing'],hint:'are + verb-ing; drop the final e.',why:'we are preparing'},
  {t:'qcm',q:'Every Saturday, the teams ___ matches.',o:['play','are playing'],a:'play',hint:'“Every Saturday” = routine.',why:'Routine → present simple (Step 1!).'},
  {t:'fill',q:'I ___ (meet) the treasurer next Tuesday at 6 p.m.',a:['am meeting','\'m meeting'],hint:'A fixed appointment in the diary.',why:'Arrangement → am + -ing'},
  {t:'qcm',q:'We ___ more volunteers for the heritage day.',o:['need','are needing'],a:'need',hint:'“Need” is a state verb.',why:'State verbs stay in present simple.'},
  {t:'order',a:'We are holding a tournament in November.',hint:'Subject + are + -ing + object + time.'}],
 prompt:'What are you working on at the moment, in each association? What appointments are in your diary for the next two weeks?',
 chips:['At the moment, I’m preparing…','This month, I’m working on…','These days, the heritage association is…','We’re applying for a grant for…','I’m organising…','Next week, I’m meeting…','On Saturday, we’re holding…','I’m not working on … at the moment.'],
 trainer:'~12 min. Have her open her real diary/phone: each appointment becomes one sentence (“On Thursday I’m meeting…”). Then contrast quickly with Step 1: “Usually I… but this week I’m…”.'},

{id:3,zone:'tz3',kicker:'STEP 3 · NEXT',title:'Plans and goals',tense:'Going to · might',
 cando:'I can explain what I and the associations plan to do, and what is still uncertain.',
 when:['An intention: it is decided, even if the details are not organised yet','Goals: what the association is going to focus on, renovate, organise','Not sure yet? → <b>might</b> / <b>I’m thinking of</b> + -ing'],
 form:[['+','I<b>’m going to focus</b> · the association <b>is going to restore</b>'],['−','we <b>aren’t going to</b> change… · I<b>’m not going to</b>…'],['?','<b>Are</b> you <b>going to</b>…? · <b>Is</b> the club <b>going to</b>…?']],
 words:['next year','next season','this winter','in 2027','soon','one day','in the future'],
 examples:['Next year, the association **is going to restore** the bread oven.','The club **is going to focus** on young players next season.','We**’re going to raise** funds **to repair** the canal.','I **might start** working with another association.','I**’m thinking of joining** a fourth association.'],
 fr:'Projet décidé → <b>going to</b>. Pas encore sûr → <b>might</b> (« il se peut que ») ou <b>I’m thinking of</b> + -ing (« j’envisage de »). Rendez-vous fixé avec date et heure → plutôt présent continu (Step 2).',
 watch:'going to + <b>base verb</b>: going to <b>restore</b> (not <i>restoring</i>). To give the reason, add <b>to + verb</b>: …raise funds <b>to restore</b> the oven. You will often <i>hear</i> “gonna” — don’t write it.',
 ex:[
  {t:'qcm',q:'The association has decided: it ___ renovate the bread oven next year.',o:['is going to','goes to','going to'],a:'is going to',hint:'Don’t forget “be”.',why:'is going to + base verb'},
  {t:'fill',q:'We ___ (focus) on young players next season. (plan)',a:['are going to focus','\'re going to focus'],hint:'are going to + base verb',why:'we are going to focus'},
  {t:'qcm',q:'You are not sure yet about the fourth association. Which is best?',o:['I am going to start with another association.','I might start working with another association.','I start with another association.'],a:'I might start working with another association.',hint:'Uncertain → ?',why:'might = possible, not decided.'},
  {t:'qcm',q:'Which one is a fixed appointment in the diary?',o:['We’re meeting the architect on Friday at 10.','One day, we’re going to restore the castle.'],a:'We’re meeting the architect on Friday at 10.',hint:'Day + time + people agreed.',why:'Arrangement → present continuous; long-term goal → going to.'},
  {t:'fill',q:'We are going to raise funds ___ restore the canal.',a:['to'],hint:'Purpose: pour + infinitif.',why:'to + base verb'},
  {t:'order',a:'The association is going to restore the bread oven.',hint:'Subject + is going to + verb + object.'}],
 prompt:'What are the goals of each association for next year? What are you going to focus on? What about the fourth association?',
 chips:['Next season, the club is going to…','The heritage association is going to focus on…','We’re going to restore…','We’re going to raise funds to…','I’m going to…','I might start working with…','I’m thinking of joining…','We aren’t going to … yet.'],
 trainer:'~12 min. Mini role-play: you are a journalist / a funder asking “What are your plans for 2027?” Push for one reason each time (“…to…”, “…because…”).'},

{id:4,zone:'tz4',kicker:'STEP 4 · BEFORE',title:'What happened: dates and achievements',tense:'Past simple · used to',
 cando:'I can say when I moved, when I started, and what the associations have achieved, with dates.',
 when:['A finished action at a specific time: in 2019, last year, two years ago','Your arrival in Corsica, your start in each association','Achievements: what the associations did','<b>used to</b>: a past situation that is not true now'],
 form:[['+','I <b>moved</b> · we <b>restored</b> · I <b>began</b> · we <b>raised</b>'],['−','I <b>didn’t work</b> · we <b>didn’t finish</b>'],['?','<b>Did</b> you <b>work</b>…? · When <b>did</b> you <b>move</b>…?']],
 words:['in 2019','last year','last season','two years ago','when I arrived','then','after that'],
 examples:['I **used to work** in accounting.','I **moved** to Corsica in [year].','I **started** working for the volleyball association in [year].','I **joined** the heritage association [two years ago].','The villagers **built** the canal in 1875.','Last spring, we **organised** a heritage day.'],
 fr:'Attention : « Je suis arrivée en Corse en 2012 » → <b>I moved / came</b> to Corsica in 2012. Avec une date ou un moment terminé, jamais <i>I have moved in…</i>.',
 watch:'After <b>did / didn’t</b>, the verb goes back to its base: Did you <b>work</b>? (not <i>worked</i>). Irregulars to know: be→<b>was/were</b>, begin→<b>began</b>, become→<b>became</b>, build→<b>built</b>, get→<b>got</b>, have→<b>had</b>, make→<b>made</b>, meet→<b>met</b>, win→<b>won</b>, come→<b>came</b>. -ed sounds: work<b>ed</b> /t/ · mov<b>ed</b> /d/ · start<b>ed</b> /ɪd/.',
 ex:[
  {t:'fill',q:'I ___ (move) to Corsica a few years ago.',a:['moved'],hint:'Regular verb + -d.',why:'moved'},
  {t:'fill',q:'I ___ (start) working for the volleyball association in 2022.',a:['started'],hint:'Regular verb + -ed (sounds /ɪd/).',why:'started'},
  {t:'qcm',q:'Before Corsica, I ___ in accounting.',o:['used to work','use to work','used to worked'],a:'used to work',hint:'used to + base verb',why:'A past situation that has changed.'},
  {t:'fill',q:'The villagers ___ (build) the canal in 1875.',a:['built'],hint:'Irregular verb.',why:'build → built'},
  {t:'qcm',q:'When did you ___ the heritage association?',o:['joined','join','joining'],a:'join',hint:'After “did”, base verb.',why:'Did + subject + base verb'},
  {t:'order',a:'When did you move to Corsica?',hint:'When + did + subject + base verb…?'}],
 prompt:'Tell the beginning of your story: your previous job, your move to Corsica, when you started in each association, and one thing each association achieved.',
 chips:['I used to work in accounting.','I moved to Corsica in…','I started working for the volleyball association in…','I joined the … association in…','I began volunteering because…','Last year, we organised…','Last season, the club…','In 2025, the association received funding for…','We didn’t … , but we…'],
 trainer:'~15 min. Draw a timeline on paper with her real dates. Each date = one past-simple sentence. Ask “When…?” and “What did you do then?”. Drill 3–4 irregulars.'},

{id:5,zone:'tz5',kicker:'STEP 5 · UP TO NOW',title:'My experience so far',tense:'Present perfect',
 cando:'I can say how long I have done something, and talk about my experiences without a date.',
 when:['From the past until now: <b>for</b> (a duration) / <b>since</b> (a starting point)','Life experience, no date: <b>ever / never</b>','Results so far: <b>already / yet / just</b>'],
 form:[['+','I<b>’ve worked</b> · the club <b>has grown</b> · we<b>’ve raised</b>'],['−','we <b>haven’t finished</b> yet · she <b>hasn’t been</b>'],['?','<b>Have</b> you <b>ever taken part</b>…? · <b>Has</b> the association <b>finished</b> yet?']],
 words:['for three years','since 2021','since I moved here','ever','never','already','yet','just','so far'],
 examples:['I**’ve lived** in Corsica **for** [number] years.','I**’ve worked** for the volleyball association **since** [year].','I**’ve never taken** part in a real excavation.','**Have** you **ever visited** the canal?','We**’ve already raised** part of the money, but we **haven’t finished** the work **yet**.'],
 fr:'Le piège n°1 : « Je travaille au club <b>depuis</b> 3 ans » → <b>I’ve worked</b> for the club <b>for</b> three years (pas <i>I work since…</i>). <b>for</b> = durée (3 ans) · <b>since</b> = point de départ (2021).',
 watch:'Golden rule: <b>When? / a finished date</b> → past simple (I started in 2021). <b>How long? / ever / until now</b> → present perfect (I’ve worked there since 2021). Participles: be→<b>been</b>, do→<b>done</b>, take→<b>taken</b>, see→<b>seen</b>, meet→<b>met</b>, become→<b>become</b>.',
 ex:[
  {t:'qcm',q:'« Je travaille pour le club depuis 2022. »',o:['I work for the club since 2022.','I have worked for the club since 2022.','I have worked for the club for 2022.'],a:'I have worked for the club since 2022.',hint:'depuis + until now…',why:'have + participle + since + starting point'},
  {t:'fill',q:'I have lived in Corsica ___ many years.',a:['for'],hint:'A duration.',why:'for + duration'},
  {t:'fill',q:'I have volunteered with them ___ 2023.',a:['since'],hint:'A starting point.',why:'since + starting point'},
  {t:'qcm',q:'Have you ___ taken part in an excavation?',o:['ever','yet','since'],a:'ever',hint:'Life experience question.',why:'Have you ever…?'},
  {t:'fill',q:'We haven’t finished the restoration ___.',a:['yet'],hint:'Negative, at the end of the sentence.',why:'not … yet'},
  {t:'qcm',q:'I ___ to Corsica in 2010.',o:['moved','have moved'],a:'moved',hint:'There is a finished date.',why:'Specific past date → past simple (Step 4).'},
  {t:'order',a:'Have you ever worked with volunteers?',hint:'Have + you + ever + participle…?'}],
 prompt:'How long have you lived in Corsica and worked in each association? What have you already done, and what haven’t you done yet? What have you never done?',
 chips:['I’ve lived in Corsica for…','I’ve worked for the volleyball association since…','I’ve volunteered with … for … years.','The club has grown a lot.','We’ve already…','We haven’t … yet.','I’ve never…','I’ve learned a lot about…'],
 trainer:'~15 min. Play “How long…? / When…?” in pairs of questions: “How long have you worked there?” → “Since 2022.” → “So when did you start?” → “In 2022.” This contrast is the key to the whole story.'}
];

const MIXED=[
 {t:'qcm',q:'Before I came to Corsica, I ___ in accounting.',o:['used to work','have worked','am working'],a:'used to work',hint:'BEFORE — finished.',why:'used to: Step 4'},
 {t:'qcm',q:'I ___ for the volleyball association since 2022.',o:['work','have worked','worked'],a:'have worked',hint:'since → UP TO NOW.',why:'Present perfect: Step 5'},
 {t:'qcm',q:'Every Monday, I ___ the new registrations.',o:['check','am checking','have checked'],a:'check',hint:'EVERY WEEK.',why:'Present simple: Step 1'},
 {t:'qcm',q:'This week, I ___ the end-of-year tournament.',o:['organise','am organising','organised'],a:'am organising',hint:'NOW, temporary.',why:'Present continuous: Step 2'},
 {t:'qcm',q:'Next year, the association ___ restore the bread oven.',o:['is going to','has','did'],a:'is going to',hint:'NEXT, a decided goal.',why:'Going to: Step 3'},
 {t:'qcm',q:'Last spring, we ___ a heritage day.',o:['have organised','organised','are organising'],a:'organised',hint:'“Last spring” is finished.',why:'Past simple: Step 4'},
 {t:'qcm',q:'I’m not sure yet, but I ___ start working with a fourth association.',o:['might','am going to','have'],a:'might',hint:'Not decided.',why:'might: Step 3'},
 {t:'qcm',q:'We ___ the funding application yet.',o:['didn’t send','haven’t sent','don’t send'],a:'haven’t sent',hint:'yet → UP TO NOW.',why:'Present perfect: Step 5'}
];

const INTERVIEW=[
 ['Step 4','When did you move to Corsica?'],['Step 4','What did you do before?'],['Step 5','How long have you worked for the volleyball association?'],['Step 5','Have you ever taken part in an excavation?'],['Step 1','What do you do on a typical day at the club?'],['Step 1','How often does the heritage association meet?'],['Step 2','What are you working on at the moment?'],['Step 2','What’s in your diary next week?'],['Step 3','What is the association going to focus on next year?'],['Step 3','Are you going to work with another association?']
];

const STORY_MODELS=[
 ['A2+ model',`Before I came to Corsica, I used to work in accounting. I moved to Corsica in [year]. I started working for the volleyball association in [year], and I joined two other associations as a volunteer.

I have worked for the volleyball club for [number] years. I have learned a lot about archaeology and genealogy, but I have never taken part in a big excavation.

Every week, I manage the registrations and I answer emails. The volleyball club pays my salary. The heritage association meets once a month.

At the moment, we are preparing the new season. Next Tuesday, I am meeting our partners.

Next year, the heritage association is going to restore the bread oven. I might start working with another association, too.`],
 ['B1 model',`My background is in accounting: that’s what I used to do before I moved to Corsica in [year]. A few years later, in [year], I started working for a local volleyball association, which is my paid job. Around the same time, I joined two associations as a volunteer, one working on heritage protection and one on archaeology and genealogy.

Since then, I’ve worked with a lot of different people, and I’ve discovered a great deal about Corsican history. We’ve already raised money for some projects, although we haven’t finished the restoration work yet.

In a typical week, I manage registrations, keep the accounts and stay in touch with coaches and partners. I usually spend [time] on the volunteer work.

These days, the club is preparing the new season, and the heritage association is working on a funding application. In fact, I’m meeting the treasurer next week to look at the budget.

Looking ahead, the heritage association is going to focus on the bread oven and the canal, so that young people can discover them. As for me, I might start working with a fourth association: I’m thinking about it.`]
];

const SPEAKING=[["Your professional introduction","Start with your paid job at the volleyball association → describe your two volunteer associations → connect your accounting background → mention the possible new association.","I work for a volleyball association. They pay my salary. I also volunteer for two other associations. They work on heritage, archaeology and genealogy. I used to work in accounting. I might start working with another association soon.","I’m employed by a local volleyball association, where I’m in charge of [main tasks]. Alongside that, I volunteer for two associations involved in heritage protection, archaeology and genealogy. My background is in accounting, which is very useful for budgets and funding applications. I may also start working with a fourth association in the near future."],["Explain an irrigation canal","Explain what it is → say where water comes from → explain the purpose → mention restoration and uncertainties.","An irrigation canal carries water to fields. It can use water from streams and mountain snowmelt. Our aim is to protect this historic system.","The canal is part of Corsica’s historic water-management system. It channelled water towards farmland and sometimes supplied fountains. Restoration may involve stonework and sluice gates, which regulate water flow. I would like to confirm which canal and period we are discussing."],["Tell the story of a communal oven","Introduce the oven → describe taking turns → explain why it mattered → say what preservation means.","A communal bread oven was shared by neighbours. Families took turns baking bread. It was an important place in village life.","In many Corsican villages, shared bread ovens formed part of everyday community life. Neighbours would take turns using the ovens, which brought families together. Preserving these structures helps pass down both craftsmanship and collective memory."],["Respond to an examiner’s follow-up","Answer directly → give an example → connect to your responsibilities.","At the volleyball club, I manage the registrations and I answer emails. For example, I send the training schedule to the coaches.","One of my main responsibilities at the volleyball club involves keeping members and coaches informed. For instance, I manage registrations and membership fees, and in my volunteer work I follow up on funding applications and help prepare community heritage activities."]];

const WRITING=[["Email: inform members about the new season","Greeting → news → practical details → what members must do → polite closing.","Subject: New season registrations\nDear members,\nThe new season is starting soon. Registrations are now open. Please send your form and membership fee before [date]. Training sessions start on [date].\nBest wishes,\nFrançoise","Subject: Registrations for the [year] season are now open\nDear members,\nWe are delighted to announce that registrations for the new season are now open. This year, the club is going to offer an extra training session for young players. Could you please return your registration form and membership fee by [date]? The training schedule will be sent to all coaches next week.\nIf you have any questions, do not hesitate to contact me.\nBest regards,\nFrançoise"],["Email: request project information","Greeting → reason → specific request → deadline → polite closing.","Subject: Canal project information\nDear Ms Martin,\nI am writing about the canal project. Could you send me the latest information about the restoration work? Thank you for your help.\nKind regards,\nFrançoise","Subject: Request for an update on the canal conservation project\nDear Ms Martin,\nI am contacting you on behalf of our association regarding the canal conservation project. Could you please share the latest schedule, the work planned for the sluice gates and any available funding updates? This information will help us prepare our next meeting.\nMany thanks for your assistance.\nKind regards,\nFrançoise"],["Email: invite volunteers to an event","Purpose → event details to confirm → what volunteers will do → reply request.","Subject: Heritage event\nHello everyone,\nWe are planning a heritage event next month. We need volunteers to welcome visitors and explain the site. Please let me know if you are available.\nBest wishes,\nFrançoise","Subject: Volunteers needed for our Corsican heritage day\nDear volunteers,\nOur association is preparing a community heritage day to highlight traditional fountains, bread ovens and local history. We would appreciate help welcoming visitors, coordinating activities and sharing information. The date and programme will be confirmed shortly. Could you let me know whether you would be interested in taking part?\nThank you for supporting our local heritage.\nBest regards,\nFrançoise"]];

/* ============ HELPERS ============ */
const $=id=>document.getElementById(id);
const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const bold=s=>escapeHTML(s).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>');
const plain=s=>String(s).replace(/\*\*/g,'').replace(/\[([^\]]+)\]/g,'$1');
const norm=s=>String(s).toLowerCase().replace(/[’‘]/g,"'").replace(/\s+/g,' ').trim().replace(/[.!?]+$/,'');
const store={get(k){try{return localStorage.getItem('fr-l4-'+k)}catch(e){return null}},set(k,v){try{localStorage.setItem('fr-l4-'+k,v)}catch(e){}}};
const state={results:{},revealed:{},order:{}};
const say=(s)=>{if(!('speechSynthesis' in window)){alert('Speech synthesis is unavailable in this browser.');return;}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(plain(s));u.lang=$('accent').value;u.rate=.86;const v=speechSynthesis.getVoices().find(v=>v.lang.toLowerCase()===u.lang.toLowerCase());if(v)u.voice=v;speechSynthesis.speak(u)};
document.addEventListener('click',e=>{const b=e.target.closest('[data-tts]');if(b){e.preventDefault();say(b.dataset.tts)}});

/* ============ VOCAB (unchanged engine) ============ */
function vocab(){const c=$('vocabCategory').value;$('vocab').innerHTML=VOCAB[c].map(([word,fr,def,example])=>`<details class="vocabitem"><summary>${escapeHTML(word)} <small> · ${escapeHTML(fr)}</small><button class="listen" type="button" data-tts="${escapeHTML(word)}">▶ Listen</button></summary><div class="body"><p><b>FR:</b> ${escapeHTML(fr)}</p><p><b>Definition:</b> ${escapeHTML(def)}</p><p><b>Example:</b> ${escapeHTML(example)} <button class="listen" type="button" data-tts="${escapeHTML(example)}">▶</button></p></div></details>`).join('');}
Object.keys(VOCAB).forEach(k=>$('vocabCategory').add(new Option(k,k)));$('vocabCategory').onchange=vocab;vocab();

/* ============ EXERCISES ============ */
const allEx=[];STEPS.forEach(s=>s.ex.forEach((x,i)=>allEx.push({key:`s${s.id}-${i}`,step:s.id,x})));MIXED.forEach((x,i)=>allEx.push({key:`s6-${i}`,step:6,x}));
const total=allEx.length;
function setFeed(key,ok,hint){const e=$('feed-'+key);e.className='feedback '+(ok?'good':'bad');e.textContent=ok?'✓ Correct! Well done.':'✗ Not quite. '+hint;state.results[key]=ok;update();}
function exHTML(key,x,n){
 const head=`<h4>${n} · ${x.t==='order'?'Build the sentence':escapeHTML(x.q)}</h4>`;
 let body='';
 if(x.t==='qcm')body=`<div class="opts">${x.o.map((o,j)=>`<button type="button" data-opt="${j}">${escapeHTML(o)}</button>`).join('')}</div>`;
 else if(x.t==='fill')body=`<input class="fill" id="in-${key}" placeholder="Type your answer" aria-label="Answer"><button type="button" data-check>Check</button>`;
 else body=`<div class="tokens" id="bank-${key}"></div><div class="selected" id="sel-${key}"></div>`;
 return `<article class="exercise" data-key="${key}">${head}${body}<div class="feedback" id="feed-${key}" aria-live="polite"></div><button class="hint" data-hintbtn>Hint</button><button class="hint answer" data-show>Show answer</button>${x.t==='order'?'<button class="hint" data-oreset>Try again</button>':''}</article>`;
}
function wireEx(key,x){
 const root=document.querySelector(`[data-key="${key}"]`);const answerText=x.t==='fill'?x.a[0]:x.a;
 root.querySelector('[data-hintbtn]').onclick=()=>{const f=$('feed-'+key);f.className='feedback';f.textContent='💡 '+x.hint};
 root.querySelector('[data-show]').onclick=()=>{const f=$('feed-'+key);f.className='feedback';f.textContent='Answer: '+answerText+(x.why?' — '+x.why:'');state.revealed[key]=true;update()};
 if(x.t==='qcm')root.querySelectorAll('[data-opt]').forEach(b=>b.onclick=()=>{root.querySelectorAll('[data-opt]').forEach(z=>z.classList.remove('chosen'));b.classList.add('chosen');setFeed(key,b.textContent.trim()===x.a,x.hint)});
 else if(x.t==='fill'){const fn=()=>setFeed(key,x.a.map(norm).includes(norm($('in-'+key).value)),x.hint);root.querySelector('[data-check]').onclick=fn;$('in-'+key).addEventListener('keydown',e=>{if(e.key==='Enter')fn()});}
 else{const words=x.a.split(' ');const fresh=()=>{state.order[key]={items:shuffle(words.map((w,j)=>({w,j}))),chosen:[]};delete state.results[key];$('feed-'+key).textContent='';drawOrder(key,x);update()};fresh();root.querySelector('[data-oreset]').onclick=fresh;}
}
function shuffle(a){const x=[...a];for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]];}if(x.length>1&&x.every((z,i)=>z===a[i]))[x[0],x[1]]=[x[1],x[0]];return x;}
function drawOrder(key,x){const s=state.order[key];$('bank-'+key).innerHTML=s.items.filter(it=>!s.chosen.some(c=>c.j===it.j)).map(it=>`<button type="button" data-word="${it.j}">${escapeHTML(it.w)}</button>`).join('');$('sel-'+key).innerHTML=s.chosen.map(it=>`<button type="button" data-return="${it.j}">${escapeHTML(it.w)} ↶</button>`).join('');
 $('bank-'+key).querySelectorAll('[data-word]').forEach(b=>b.onclick=()=>{s.chosen.push(s.items.find(it=>it.j===+b.dataset.word));drawOrder(key,x);if(s.chosen.length===s.items.length)setFeed(key,s.chosen.map(c=>c.w).join(' ')===x.a,x.hint)});
 $('sel-'+key).querySelectorAll('[data-return]').forEach(b=>b.onclick=()=>{s.chosen=s.chosen.filter(c=>c.j!==+b.dataset.return);delete state.results[key];$('feed-'+key).textContent='';drawOrder(key,x);update()});}

/* ============ STEPS ============ */
function chipsHTML(id,chips){return `<div class="chips">${chips.map(c=>`<button type="button" class="chip" data-insert="${id}" data-text="${escapeHTML(c)}">${escapeHTML(c)}</button>`).join('')}</div>`;}
function stepHTML(s){
 const exs=s.ex.map((x,i)=>exHTML(`s${s.id}-${i}`,x,String(i+1).padStart(2,'0'))).join('');
 return `<article class="step ${s.zone}" id="step${s.id}">
 <header class="stephead"><span class="stepnum">${s.kicker}</span><h3>${escapeHTML(s.title)}</h3><span class="tense">${escapeHTML(s.tense)}</span><p class="cando">🎯 ${escapeHTML(s.cando)}</p></header>
 <div class="idea">
  <div class="card"><h4>① The idea · when do I use it?</h4><ul>${s.when.map(w=>`<li>${w}</li>`).join('')}</ul>
   <table class="formtable">${s.form.map(([k,v])=>`<tr><th>${k}</th><td>${v}</td></tr>`).join('')}</table>
   <p class="words">${s.words.map(w=>`<span>${escapeHTML(w)}</span>`).join('')}</p></div>
  <div class="card"><h4>② Listen &amp; notice</h4><ul class="examples">${s.examples.map(e=>`<li><button class="listen" type="button" data-tts="${escapeHTML(e)}">▶</button> <span>${bold(e)}</span></li>`).join('')}</ul>
   <div class="fr">${s.fr}</div><div class="watch"><b>Watch out ·</b> ${s.watch}</div></div>
 </div>
 <h4 class="sub">③ Quick practice <span class="stepscore" data-stepscore="${s.id}"></span></h4><div class="exgrid">${exs}</div>
 <div class="yourturn"><h4>④ Your turn · your real life</h4><p>${escapeHTML(s.prompt)}</p><p class="small">Tap a starter to add it, then finish the sentence with your real information.</p>${chipsHTML('my'+s.id,s.chips)}
  <textarea id="my${s.id}" class="mine" placeholder="Write 3–5 sentences about you…"></textarea>
  <div class="models"><button type="button" class="ghost" data-readmine="my${s.id}">▶ Listen to my sentences</button>${s.id<5?`<a class="btn" href="#step${s.id+1}">Next: Step ${s.id+1} →</a>`:`<a class="btn" href="#step6">Next: build my story →</a>`}</div></div>
 <details class="trainer"><summary>Trainer note</summary><p>${escapeHTML(s.trainer)}</p></details>
 </article>`;}
function finalHTML(){
 return `<article class="step tz6" id="step6">
 <header class="stephead"><span class="stepnum">STEP 6 · PUT IT ALL TOGETHER</span><h3>My story with the associations</h3><span class="tense">All five tenses</span><p class="cando">🎯 I can tell my story from my past to my future plans, and answer follow-up questions.</p></header>
 <h4 class="sub">① Which time zone? Mixed check <span class="stepscore" data-stepscore="6"></span></h4><div class="exgrid">${MIXED.map((x,i)=>exHTML(`s6-${i}`,x,String(i+1).padStart(2,'0'))).join('')}</div>
 <div class="yourturn"><h4>② Build my story</h4><p>This collects your sentences from Steps 1–5 <b>in chronological order</b>: before → up to now → every week → now → next. Then improve it: add linking words.</p>
  <p class="words">${['Before that,','In [year],','A few years later,','Since then,','Nowadays,','Every week,','At the moment,','Next year,','As for me,','because','so that','although'].map(w=>`<button type="button" class="chip" data-insert="story" data-text="${escapeHTML(w)}">${escapeHTML(w)}</button>`).join('')}</p>
  <div class="models"><button type="button" id="buildStory">Build my story from Steps 1–5</button><button type="button" class="ghost" data-readmine="story">▶ Listen to my story</button></div>
  <textarea id="story" class="mine story" placeholder="Press “Build my story” or write here…"></textarea>
  <div class="models">${STORY_MODELS.map((m,i)=>`<button type="button" class="ghost" data-storymodel="${i}">${m[0]}</button>`).join('')}<button type="button" class="ghost" id="listenModel">▶ Listen to the model</button></div><div class="model hidden" id="storyModel"></div>
  <p class="small">[brackets] = replace with your real information.</p></div>
 <div class="yourturn"><h4>③ Interview practice · one question per tense</h4><p>Listen to the question, answer out loud in 2–3 sentences: answer → example → detail.</p><ul class="interview">${INTERVIEW.map(([t,q])=>`<li><button class="listen" type="button" data-tts="${escapeHTML(q)}">▶</button> <span>${escapeHTML(q)}</span> <small>${t}</small></li>`).join('')}</ul></div>
 <details class="trainer"><summary>Trainer note</summary><p>~20 min. First the mixed check, then you build and edit your story. Final task: You tell it out loud without reading (use the 5-zone timeline as a prompt card), then you ask 3–4 interview questions in random order.</p></details>
 </article>`;}
$('steps').innerHTML=STEPS.map(stepHTML).join('')+finalHTML();
$('stepper').innerHTML=[...STEPS.map(s=>[s.id,s.tense,s.zone]),[6,'My story','tz6']].map(([id,t,z])=>`<a href="#step${id}" class="${z}"><b>${id}</b><span>${escapeHTML(t)}</span><small data-stepscore="${id}"></small></a>`).join('');
allEx.forEach(({key,x})=>wireEx(key,x));

/* chips insert text into a textarea */
document.addEventListener('click',e=>{const c=e.target.closest('[data-insert]');if(!c)return;const ta=$(c.dataset.insert),t=c.dataset.text;const start=ta.selectionStart??ta.value.length;const before=ta.value.slice(0,start),after=ta.value.slice(start);const needSpace=before&&!/[\s]$/.test(before);ta.value=before+(needSpace?' ':'')+t+' '+after;const pos=(before+(needSpace?' ':'')+t+' ').length;ta.focus();ta.setSelectionRange(pos,pos);ta.dispatchEvent(new Event('input'))});
document.addEventListener('click',e=>{const b=e.target.closest('[data-readmine]');if(!b)return;const v=$(b.dataset.readmine).value.trim();if(v)say(v);else alert('Write something first!')});

/* story */
const zoneLabels={4:'Before',5:'Up to now',1:'Every week',2:'Now and in the diary',3:'Next'};
$('buildStory').onclick=()=>{const parts=[4,5,1,2,3].map(id=>$('my'+id).value.trim()).filter(Boolean);if(!parts.length){alert('Write your sentences in Steps 1–5 first.');return;}if($('story').value.trim()&&!confirm('Replace the story text that is already here?'))return;$('story').value=parts.join('\n\n');$('story').dispatchEvent(new Event('input'))};
let shownModel=0;document.querySelectorAll('[data-storymodel]').forEach(b=>b.onclick=()=>{shownModel=+b.dataset.storymodel;const m=$('storyModel');m.textContent=STORY_MODELS[shownModel][1];m.classList.remove('hidden')});
$('listenModel').onclick=()=>say(STORY_MODELS[shownModel][1]);

/* ============ STUDIO ============ */
function models(container,items,writing=false){$(container).innerHTML=items.map(([title,steps,a,b],i)=>`<article class="studio-card"><h3>${String(i+1).padStart(2,'0')} · ${escapeHTML(title)}</h3><p><b>Steps:</b> ${escapeHTML(steps)}</p><p><b>Useful phrases:</b> I am responsible for… · We aim to… · In the past… · At the moment… · For example… · Could you please…</p><label>Your ${writing?'written response':'speaking notes'}<textarea id="${container}input${i}" class="mine" placeholder="Try independently before opening a model…"></textarea></label><div class="models"><button type="button" data-model="${container}-${i}-a" class="ghost">A2+ model</button><button type="button" data-model="${container}-${i}-b" class="ghost">B1 model</button><button type="button" data-tts="${escapeHTML(a)}" class="ghost">▶ Listen to A2+</button></div><div class="model hidden" id="${container}model${i}"></div></article>`).join('');$(container).querySelectorAll('[data-model]').forEach(btn=>btn.onclick=()=>{const [,j,level]=btn.dataset.model.split('-');const m=$(container+'model'+j);m.textContent=items[+j][level==='a'?2:3];m.classList.remove('hidden')});}
models('speaking',SPEAKING);models('writing',WRITING,true);

/* ============ SAVE TEXT FIELDS ON THIS DEVICE ============ */
const saved=['role1','role2','role3','role4','realities','notes','nextSteps','story',...STEPS.map(s=>'my'+s.id)];
document.querySelectorAll('textarea.mine').forEach(t=>{if(!saved.includes(t.id))saved.push(t.id)});
saved.forEach(id=>{const el=$(id);if(!el)return;const v=store.get(id);if(v!==null)el.value=v;el.addEventListener('input',()=>{store.set(id,el.value);if(['notes','nextSteps'].includes(id))renderBilan()})});

/* ============ PROGRESS & CFL ============ */
function stepCount(id){const keys=allEx.filter(e=>e.step===id).map(e=>e.key);return {ok:keys.filter(k=>state.results[k]===true).length,n:keys.length};}
function update(){const correct=Object.values(state.results).filter(x=>x===true).length;$('progress').textContent=`${correct} / ${total} correct · ${Object.keys(state.results).length} attempted`;
 document.querySelectorAll('[data-stepscore]').forEach(e=>{const {ok,n}=stepCount(+e.dataset.stepscore);e.textContent=`${ok}/${n}`;e.classList.toggle('done',ok===n)});renderBilan();}
function summary(){const per={};[1,2,3,4,5,6].forEach(id=>{const {ok,n}=stepCount(id);per[id===6?'Step 6 – mixed tenses':`Step ${id} – ${STEPS[id-1].tense}`]=`${ok}/${n}`});
 return {learner:'Françoise Bernardini',lesson:'Lesson 4 — Corsican Heritage & Association Work (graduated grammar path)',date:$('lessonDate').value,minutes:$('minutes').value,status:$('lessonStatus').value,
 domains:['vocabulary: roles, volleyball club, heritage & community','Step 1 present simple – routines & job','Step 2 present continuous – current projects & arrangements','Step 3 going to / might – plans & goals','Step 4 past simple & used to – dates & achievements','Step 5 present perfect – for/since, ever/never, already/yet','Step 6 personal story & interview practice','professional emails'],
 scoresByStep:per,allObjective:{correct:Object.values(state.results).filter(Boolean).length,total},
 oral:$('oral').value,written:$('written').value,interaction:$('interaction').value,
 associationInfo:{paidVolleyball:$('role1').value,volunteerA:$('role2').value,volunteerB:$('role3').value,possibleNew:$('role4').value,clarifications:$('realities').value},
 story:$('story').value,notes:$('notes').value,nextSteps:$('nextSteps').value,answersRevealed:Object.keys(state.revealed).length};}
function renderBilan(){$('bilanOutput').className='bilanstat';const d=summary();$('bilanOutput').textContent=`Automated assessment: ${d.allObjective.correct}/${d.allObjective.total}\n`+Object.entries(d.scoresByStep).map(([k,v])=>`${k}: ${v}`).join(' · ')+`\nOral: ${d.oral} · Writing: ${d.written} · Interaction: ${d.interaction}`;}
function download(name,content,type){const a=document.createElement('a'),url=URL.createObjectURL(new Blob([content],{type}));a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
$('copy').onclick=()=>{const s=JSON.stringify(summary(),null,2);if(navigator.clipboard?.writeText){navigator.clipboard.writeText(s).then(()=>alert('CFL summary copied')).catch(()=>alert('Clipboard unavailable; use JSON export.'));}else alert('Clipboard unavailable; use JSON export.')};
$('json').onclick=()=>download('Francoise_CFL_Lesson4.json',JSON.stringify(summary(),null,2),'application/json');
$('csv').onclick=()=>{const d=summary();const lines=[['field','value'],...Object.entries(d).map(([k,v])=>[k,typeof v==='object'?JSON.stringify(v):String(v)])];download('Francoise_CFL_Lesson4.csv','﻿'+lines.map(a=>a.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(';')).join('\r\n'),'text/csv;charset=utf-8')};
$('reset').onclick=()=>{state.results={};state.revealed={};document.querySelectorAll('.exercise .feedback').forEach(f=>{f.textContent='';f.className='feedback'});document.querySelectorAll('.opts button').forEach(b=>b.classList.remove('chosen'));document.querySelectorAll('input.fill').forEach(i=>i.value='');allEx.filter(e=>e.x.t==='order').forEach(({key,x})=>{state.order[key]={items:shuffle(x.a.split(' ').map((w,j)=>({w,j}))),chosen:[]};drawOrder(key,x)});update();};
$('lessonDate').value=new Date().toLocaleDateString('en-CA');
['lessonDate','minutes','lessonStatus','oral','written','interaction'].forEach(k=>$(k).addEventListener('input',renderBilan));
update();
