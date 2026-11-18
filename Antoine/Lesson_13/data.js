/* Antoine · VTEST Final Masterclass · lesson data
   SpeakEasyTisha · independent VTEST-inspired preparation */

const MODULES = [
  { id: 0, icon: "🔗", title: "Verb patterns & prepositions", short: "Verb patterns",
    goal: "Learn which verbs take TO + verb and which take -ING, then use them to talk about your move to Australia." },
  { id: 1, icon: "🔀", title: "Conditionals", short: "Conditionals",
    goal: "Distinguish real future, imagined situations and the unreal past." },
  { id: 2, icon: "⚙️", title: "Passive voice", short: "Passive voice",
    goal: "Focus on the action or the result, not the person who did it." },
  { id: 3, icon: "🧩", title: "Relative clauses · who vs whose", short: "Relative clauses",
    goal: "Join two ideas without repeating the noun, and never confuse WHO and WHOSE again." },
  { id: 4, icon: "🚀", title: "Phrasal verbs & expressions", short: "Phrasal verbs",
    goal: "Understand what the small words mean first, then see how each one transforms a verb." }
];

/* ---------- 1. Automatically checked questions ---------- */
const QUESTIONS = [
  // Module 0 — verb patterns
  {s:0, stem:"I decided ___ to Australia.", answer:"to move", options:["moving","move","to move"], hint:"decide + TO + base verb"},
  {s:0, stem:"I enjoy ___ new people.", answer:"meeting", options:["to meet","meeting","meet"], hint:"enjoy + -ING"},
  {s:0, stem:"We avoided ___ unnecessary costs.", answer:"making", options:["making","to make","make"], hint:"avoid + -ING"},
  {s:0, stem:"I look forward to ___ from you.", answer:"hearing", options:["to hear","hearing","hear"], hint:"look forward to + -ING · here TO is a preposition"},
  {s:0, stem:"She suggested ___ earlier.", answer:"leaving", options:["to leave","leave","leaving"], hint:"suggest + -ING"},
  {s:0, stem:"They agreed ___ the plan.", answer:"to review", options:["reviewing","to review","review"], hint:"agree + TO + verb"},
  {s:0, stem:"He is interested in ___ abroad.", answer:"working", options:["working","work","to work"], hint:"preposition (in) + -ING"},
  {s:0, stem:"We managed ___ on time.", answer:"to arrive", options:["arrive","to arrive","arriving"], hint:"manage + TO + verb"},
  {s:0, stem:"I am used to ___ early.", answer:"getting up", options:["getting up","get up","to get up"], hint:"be used to + -ING (= être habitué à)"},
  {s:0, stem:"I stopped ___ coffee to save money.", answer:"buying", options:["to buy","buy","buying"], hint:"stop + -ING = quit an activity"},
  // Module 1 — conditionals
  {s:1, stem:"If I ___ enough, I will travel.", answer:"save", options:["saved","save","had saved"], hint:"First conditional: if + present, will + verb"},
  {s:1, stem:"If I had more time, I ___ another language.", answer:"would learn", options:["learned","will learn","would learn"], hint:"Second conditional: would + base verb"},
  {s:1, stem:"If we had left earlier, we ___ the train.", answer:"would have caught", options:["would catch","will catch","would have caught"], hint:"Third conditional: would have + past participle"},
  {s:1, stem:"If you heat ice, it ___.", answer:"melts", options:["melts","will melt","melted"], hint:"Zero conditional: a general truth"},
  {s:1, stem:"If I ___ you, I would apply.", answer:"were", options:["am","were","had been"], hint:"Advice: If I were you…"},
  {s:1, stem:"If she ___ the email, she would have replied.", answer:"had seen", options:["had seen","saw","has seen"], hint:"Third conditional: if + past perfect"},
  {s:1, stem:"Unless it ___, we will train outside.", answer:"rains", options:["will rain","rained","rains"], hint:"unless = if not · present after unless"},
  {s:1, stem:"If he studied more, he ___ more confident.", answer:"would feel", options:["would feel","will feel","had felt"], hint:"Second conditional"},
  {s:1, stem:"If I had accepted the offer, I ___ in France now.", answer:"would be", options:["would have been","will be","would be"], hint:"Mixed conditional: past cause → present result (now)"},
  {s:1, stem:"If we ___ the paperwork today, we can leave tomorrow.", answer:"finish", options:["finish","had finished","finished"], hint:"Real future: present in the if-clause"},
  // Module 2 — passive
  {s:2, stem:"The application ___ yesterday.", answer:"was submitted", options:["is submitting","submitted","was submitted"], hint:"Past simple passive: was/were + past participle"},
  {s:2, stem:"English ___ in Australia.", answer:"is spoken", options:["is spoken","speaks","has speaking"], hint:"Present simple passive"},
  {s:2, stem:"The documents ___ next week.", answer:"will be checked", options:["checked","will be checked","will check"], hint:"Future passive: will be + past participle"},
  {s:2, stem:"The offer has already ___.", answer:"been accepted", options:["been accepted","accepted","being accepted"], hint:"Present perfect passive: has been + past participle"},
  {s:2, stem:"The interview ___ by the manager.", answer:"was conducted", options:["was conducted","conducted","was conducting"], hint:"Agent introduced with by"},
  {s:2, stem:"The new system ___ at the moment.", answer:"is being tested", options:["is being tested","has tested","is testing"], hint:"Present continuous passive: is being + past participle"},
  // Module 3 — relative clauses (who / whose focus)
  {s:3, stem:"The colleague ___ helped me was very kind.", answer:"who", options:["who","whose","which"], hint:"A VERB follows (helped) → WHO"},
  {s:3, stem:"This is the office ___ I worked for six years.", answer:"where", options:["whose","who","where"], hint:"WHERE = a place"},
  {s:3, stem:"The report, ___ was published yesterday, is useful.", answer:"which", options:["which","who","that"], hint:"Non-defining clause (commas) for a thing: WHICH, never THAT"},
  {s:3, stem:"The candidate ___ CV impressed us got the job.", answer:"whose", options:["who","which","whose"], hint:"A NOUN follows (CV) → WHOSE = his/her CV"},
  {s:3, stem:"The role ___ I applied for requires English.", answer:"that", options:["that","where","whose"], hint:"Defining clause for a thing: THAT / WHICH (or nothing)"},
  {s:3, stem:"Sydney is a city ___ many people want to work.", answer:"where", options:["whose","who","where"], hint:"WHERE = in which (a place)"},
  {s:3, stem:"I met a recruiter ___ works for Qantas.", answer:"who", options:["whose","who","who’s"], hint:"A VERB follows (works) → WHO (she works…)"},
  {s:3, stem:"I met a recruiter ___ company hires staff in Perth.", answer:"whose", options:["who","whose","who’s"], hint:"A NOUN follows (company) → WHOSE (her company)"},
  {s:3, stem:"The backpacker ___ passport was stolen went to the embassy.", answer:"whose", options:["who","whose","which"], hint:"His passport → WHOSE passport"},
  {s:3, stem:"The farmer ___ hired us pays every Friday.", answer:"who", options:["whose","who","where"], hint:"He hired us → WHO hired us"},
  {s:3, stem:"Australia is a country ___ economy depends on tourism.", answer:"whose", options:["which","whose","where"], hint:"WHOSE also works for things: its economy → whose economy"},
  {s:3, stem:"Do you know ___ responsible for the rosters?", answer:"who’s", options:["whose","who’s","who"], hint:"WHO’S = who IS (who is responsible)"},
  {s:3, stem:"I don’t know ___ backpack this is.", answer:"whose", options:["who’s","whose","who"], hint:"Possession: whose backpack? (à qui ?)"},
  {s:3, stem:"We stayed with a family ___ house overlooks the beach.", answer:"whose", options:["who","whose","which"], hint:"Their house → WHOSE house"},
  {s:3, stem:"The manager ___ I spoke to was very helpful.", answer:"who", options:["whose","who","which"], hint:"I spoke to HIM (object) → WHO / THAT · no noun after the gap"},
  // Module 4 — phrasal verbs
  {s:4, stem:"We need to ___ the problem before Friday.", answer:"look into", options:["look up","look after","look into"], hint:"look into = investigate (into = inside the problem)"},
  {s:4, stem:"Can you ___ my dog this weekend?", answer:"look after", options:["look into","look after","look up"], hint:"look after = take care of"},
  {s:4, stem:"I will ___ the word in a dictionary.", answer:"look up", options:["look up","look after","look into"], hint:"look up = search for information"},
  {s:4, stem:"I’m ___ a job in hospitality in Perth.", answer:"looking for", options:["looking after","looking for","looking up"], hint:"look for = search for (for = the goal)"},
  {s:4, stem:"We want to ___ our own business.", answer:"set up", options:["set up","set off","set aside"], hint:"set up = establish, create"},
  {s:4, stem:"We ___ for Uluru at dawn.", answer:"set off", options:["set up","set off","set back"], hint:"set off = start a journey (off = departure)"},
  {s:4, stem:"Please ___ the form before the interview.", answer:"fill out", options:["fill out","fill over","fill up"], hint:"fill out / fill in = complete a form"},
  {s:4, stem:"We must ___ the plan despite setbacks.", answer:"carry out", options:["carry out","carry on","carry over"], hint:"carry out = execute"},
  {s:4, stem:"Please ___ speaking; you are doing well.", answer:"carry on", options:["carry out","carry on","carry over"], hint:"carry on = continue (on = continuation)"},
  {s:4, stem:"I finally ___ why it failed.", answer:"figured out", options:["turned down","figured out","put off"], hint:"figure out = understand (out = into the light)"},
  {s:4, stem:"They ___ the meeting until Monday.", answer:"put off", options:["put up","put on","put off"], hint:"put off = postpone"},
  {s:4, stem:"She ___ the job offer because the pay was too low.", answer:"turned down", options:["turned up","turned into","turned down"], hint:"turn down = refuse (down = lower, reject)"},
  {s:4, stem:"Our van ___ near Darwin.", answer:"broke down", options:["broke down","broke into","broke up"], hint:"break down = stop working"},
  {s:4, stem:"I ___ an old friend at the airport.", answer:"ran into", options:["ran out of","ran by","ran into"], hint:"run into = meet by chance"},
  {s:4, stem:"We have ___ time.", answer:"run out of", options:["run into","run over","run out of"], hint:"run out of = have none left"},
  {s:4, stem:"The flight will ___ at 8 a.m.", answer:"take off", options:["take after","take over","take off"], hint:"take off = leave the ground"},
  {s:4, stem:"She will ___ the project when the manager leaves.", answer:"take over", options:["take up","take off","take over"], hint:"take over = take control"},
  {s:4, stem:"I ___ a good solution.", answer:"came up with", options:["came up with","came down with","came across"], hint:"come up with = think of an idea"},
  {s:4, stem:"We ___ at the hostel at 3 p.m.", answer:"checked in", options:["checked out","checked in","checked on"], hint:"check in = register on arrival"},
  {s:4, stem:"Can you ___ at the airport?", answer:"pick me up", options:["pick up me","pick me up","pick me out"], hint:"Separable + pronoun: verb + ME + particle"},
  {s:4, stem:"I need to ___ the bus at the next stop.", answer:"get off", options:["get off","get out","get up"], hint:"get off = leave a bus/train/plane"},
  {s:4, stem:"I can’t ___ the noise in this hostel any more.", answer:"put up with", options:["put up with","put off","put away"], hint:"put up with = tolerate (supporter)"},
  {s:4, stem:"Don’t ___! You’re nearly there.", answer:"give up", options:["give in","give up","give out"], hint:"give up = stop trying, abandon"},
  {s:4, stem:"Please ___; I’ll put you through to HR.", answer:"hold on", options:["hold up","hold on","hold back"], hint:"hold on = wait (on the phone)"}
];

/* ---------- 2. Vocabulary by category ---------- */
const VOCAB = {
  "Verb patterns": [
    ["decide to","décider de","choose a course of action","I decided to move to Australia."],
    ["avoid + -ing","éviter de","prevent an unwanted action","I avoid spending too much."],
    ["look forward to + -ing","avoir hâte de","anticipate positively","I look forward to meeting the team."],
    ["be used to + -ing","avoir l’habitude de","be accustomed to","I am used to working under pressure."],
    ["manage to","réussir à","succeed in doing something difficult","I managed to save $3,000."],
    ["consider + -ing","envisager de","think about a possibility","I’m considering working on a farm."]
  ],
  "Conditionals": [
    ["provided that","à condition que","only if","I will accept provided that the hours are fair."],
    ["unless","sauf si / à moins que","if not","I will go unless it rains."],
    ["if I had known","si j’avais su","unreal past condition","If I had known, I would have called."],
    ["otherwise","sinon","if not","Apply now; otherwise, you may miss the deadline."],
    ["as long as","tant que / du moment que","on condition that","As long as I can save money, I’ll stay."]
  ],
  "Passive": [
    ["be hired","être embauché","receive a job","I was hired last month."],
    ["be required","être exigé","be necessary by rule","A visa is required for this role."],
    ["be provided","être fourni","be supplied","Training will be provided."],
    ["be paid","être payé","receive wages","Staff are paid every fortnight."],
    ["be based in","être basé à","have its office in","The company is based in Brisbane."]
  ],
  "Relatives": [
    ["who","qui (personne, sujet)","+ verb · replaces he/she/they","The recruiter who called me was friendly."],
    ["whose","dont le/la/les · à qui","+ noun · replaces his/her/their/its","The recruiter whose agency I contacted was friendly."],
    ["who’s","qui est / qui a","= who is / who has","She’s the one who’s in charge."],
    ["which","qui / que (chose)","for things; non-defining with commas","The visa, which costs $650, lasts a year."],
    ["that","qui / que","people or things, defining only","The job that I want is in Perth."],
    ["where","où","for a place","This is the farm where I worked."],
    ["when","où (temps)","for a moment in time","2026 is the year when I moved."]
  ],
  "Travel phrasals": [
    ["check in / check out","s’enregistrer / partir (hôtel)","arrive and register / leave and pay","We checked out at 10 a.m."],
    ["set off","partir (en voyage)","start a journey","We set off for Cairns at dawn."],
    ["take off","décoller","plane leaves the ground","The plane took off on time."],
    ["get on / get off","monter / descendre","board / leave transport","Get off at Central Station."],
    ["pick up / drop off","aller chercher / déposer","collect / leave someone","Can you drop me off at the hostel?"],
    ["get around","se déplacer","travel from place to place","It’s easy to get around by tram."],
    ["look around","faire le tour, visiter","explore a place","We looked around the market."]
  ],
  "Work & job search": [
    ["look for","chercher","search for","I’m looking for work in hospitality."],
    ["fill in / fill out","remplir","complete a form","Fill in your tax file number."],
    ["sign up (for)","s’inscrire","register","I signed up for a barista course."],
    ["follow up on","donner suite à","check progress after contact","I will follow up on my application."],
    ["take on","embaucher / accepter","hire / accept work","They are taking on new staff."],
    ["carry out","effectuer, mener à bien","execute a task","I carried out a process audit."],
    ["set up","créer, monter","establish","We plan to set up a business."],
    ["turn down","refuser","reject","I turned down an unpaid trial."]
  ],
  "Everyday & problems": [
    ["run out of","être à court de","have none left","We ran out of petrol."],
    ["break down","tomber en panne","stop working","The van broke down."],
    ["sort out","régler, arranger","solve a problem","I sorted out my bank account."],
    ["put up with","supporter","tolerate","I put up with the heat."],
    ["get over","se remettre de","recover from","I got over the jet lag."],
    ["find out","découvrir, apprendre","discover information","I found out the shop was hiring."],
    ["come across","tomber sur","find by chance","I came across a useful advert."]
  ]
};
const VOCAB_DEFAULT = ["Verb patterns","Conditionals","Passive","Relatives","Travel phrasals"];

/* ---------- 3. Particles: the meaning of the small words ---------- */
const PARTICLES = [
  {p:"up", icon:"⬆️", color:"#2d7a55", core:"upward · increase · completely · appear", fr:"vers le haut · augmenter · complètement · apparaître",
   picture:"Imagine something rising until it is full or finished.", ex:["turn up the volume (increase)","fill up the tank (completely)","set up a business (build it)","show up (appear)"]},
  {p:"down", icon:"⬇️", color:"#a6423b", core:"downward · decrease · stop · reject · write on paper", fr:"vers le bas · diminuer · s’arrêter · refuser · noter",
   picture:"Imagine something falling, slowing or being pushed away.", ex:["slow down (decrease)","break down (stop working)","turn down an offer (reject)","write down (on paper)"]},
  {p:"out", icon:"🚪", color:"#c65f32", core:"exit · discover · to the end · distribute · nothing left", fr:"sortir · découvrir · jusqu’au bout · distribuer · plus rien",
   picture:"Imagine something coming out of a box into the light.", ex:["check out (leave)","find out (discover)","fill out a form (to the end)","run out of (nothing left)"]},
  {p:"in / into", icon:"📥", color:"#1f6f78", core:"enter · include · arrive · (into) inside → investigate, collide, transform", fr:"entrer · inclure · arriver · (into) dedans → examiner, heurter, transformer",
   picture:"Imagine going inside a room — or inside a problem.", ex:["check in (arrive)","fill in your name (include)","look into (go inside the problem)","turn into (become)"]},
  {p:"on", icon:"▶️", color:"#2a6db0", core:"continue · start working · wear / attach · board", fr:"continuer · mettre en marche · porter · monter (transport)",
   picture:"Imagine a switch staying ON — the action keeps going.", ex:["carry on (continue)","turn on (start)","put on a jacket (wear)","get on the bus (board)"]},
  {p:"off", icon:"⏹️", color:"#7a4fa0", core:"depart · stop · cancel · remove · separate", fr:"partir · arrêter · annuler · enlever · séparer",
   picture:"Imagine something leaving a surface or a switch going OFF.", ex:["take off (plane leaves)","turn off (stop)","call off (cancel)","put off (push away in time)"]},
  {p:"over", icon:"🔄", color:"#b78131", core:"review from top to bottom · transfer · recover · visit", fr:"revoir en entier · transférer · se remettre · passer chez",
   picture:"Imagine your eyes moving over a whole page, or control passing over to someone.", ex:["go over (review)","take over (take control)","get over (recover)","come over (visit)"]},
  {p:"through", icon:"➡️", color:"#3d7f8a", core:"from start to finish · succeed in passing", fr:"du début à la fin · réussir à passer",
   picture:"Imagine a tunnel: you enter at one end and come out at the other.", ex:["go through a contract (all of it)","get through (succeed / reach by phone)","put through (connect a call)"]},
  {p:"after", icon:"👣", color:"#8a5a3c", core:"follow · behind · take care of", fr:"suivre · derrière · s’occuper de",
   picture:"Imagine walking behind someone to protect them.", ex:["look after (care for)","take after (resemble a parent)","run after (chase)"]},
  {p:"back", icon:"↩️", color:"#4f6d7a", core:"return · reverse · delay", fr:"retour · revenir en arrière · retarder",
   picture:"Imagine a U-turn arrow.", ex:["call back (return a call)","give back (return)","set back (delay)"]},
  {p:"away / aside", icon:"💨", color:"#5b7f3a", core:"distance · leave · store · keep for later", fr:"distance · partir · ranger · mettre de côté",
   picture:"Imagine moving something out of the way.", ex:["put away (store)","give away (for free)","set aside (save for later)"]},
  {p:"for", icon:"🎯", color:"#c0392b", core:"goal · purpose · seek", fr:"but · objectif · chercher",
   picture:"Imagine a target you are aiming at.", ex:["look for (search)","ask for (request)","apply for (a job)"]},
  {p:"forward", icon:"⏩", color:"#1d8a7a", core:"toward the future · ahead · propose", fr:"vers l’avenir · en avant · proposer",
   picture:"Imagine looking ahead on the road.", ex:["look forward to (anticipate)","put forward (propose)","bring forward (move earlier)"]},
  {p:"by", icon:"🚶", color:"#6b6b6b", core:"pass near · visit briefly · survive with little", fr:"passer près · passer brièvement · se débrouiller",
   picture:"Imagine walking past a door and stopping for a second.", ex:["drop by (short visit)","get by (manage)","stand by (wait, be ready)"]},
  {p:"around", icon:"🔁", color:"#9b6a1f", core:"in all directions · move about · explore", fr:"dans tous les sens · se déplacer · explorer",
   picture:"Imagine a circle around a place.", ex:["look around (explore)","get around (travel)","turn around (face the other way / improve)"]},
  {p:"across / along", icon:"↔️", color:"#3a5a99", core:"(across) from one side to the other → find by chance · (along) together, progress", fr:"(across) d’un côté à l’autre → trouver par hasard · (along) ensemble, avancer",
   picture:"Imagine crossing a street and finding something on the other side.", ex:["come across (find by chance)","get along with (relationship)","come along (progress)"]}
];

/* ---------- 4. Verb families: one verb, many particles ---------- */
/* t: S = separable · I = inseparable · — = no object */
const FAMILIES = [
  {verb:"look", fr:"regarder", base:"use your eyes", rows:[
    ["for","look for","search for","chercher","I’m looking for a job in hospitality in Perth.","I","for = a goal you aim at"],
    ["up","look up","find information (dictionary, online)","chercher (une info)","Look up the bus times before you leave.","S","up = bring the information up to the surface"],
    ["into","look into","investigate","examiner, enquêter sur","The airline is looking into my lost luggage.","I","into = go inside the problem"],
    ["after","look after","take care of","s’occuper de","I looked after children as an au pair.","I","after = stay behind someone, protecting them"],
    ["forward","look forward to","anticipate with pleasure","avoir hâte de","I look forward to hearing from you.","I","forward = toward the future · + -ING"],
    ["over","look over","check quickly","relire, parcourir","Could you look over my CV?","S","over = eyes travel over the whole page"],
    ["around","look around","explore a place","faire le tour, visiter","We looked around Fremantle market.","I","around = in every direction"],
    ["out","look out","be careful","faire attention","Look out! There’s a kangaroo on the road!","—","out = eyes outward, alert"],
    ["back","look back on","remember the past","repenser à","I look back on my first job with pride.","I","back = toward the past"]
  ]},
  {verb:"get", fr:"obtenir · arriver · devenir", base:"obtain, arrive, become", rows:[
    ["up","get up","leave your bed","se lever","I get up at 5 a.m. for fruit picking.","—","up = rise"],
    ["on","get on","board a bus, train or plane","monter dans","Get on the train at Central Station.","I","on = onto the vehicle"],
    ["off","get off","leave a bus, train or plane","descendre de","Get off at the next stop.","I","off = leave the surface"],
    ["in / into","get in(to)","enter a car or taxi","monter (en voiture)","Get in the taxi, it’s raining!","I","in = inside"],
    ["back","get back","return home","rentrer, revenir","We got back from the outback on Sunday.","—","back = return"],
    ["by","get by","survive with limited means","se débrouiller","I can get by on $600 a week.","—","by = just pass, minimally"],
    ["over","get over","recover from","se remettre de","It took me a week to get over the jet lag.","I","over = climb over an obstacle"],
    ["along","get along with","have a good relationship","bien s’entendre avec","I get along with my flatmates.","I","along = go together"],
    ["around","get around","travel from place to place","se déplacer","It’s easy to get around Melbourne by tram.","—","around = move about"],
    ["through","get through (to)","reach by phone · succeed","joindre · venir à bout de","I finally got through to the tax office.","I","through = from one end to the other"]
  ]},
  {verb:"take", fr:"prendre", base:"take, carry", rows:[
    ["off","take off","leave the ground (plane) · remove clothes","décoller · enlever","Our flight takes off at 8 a.m.","S","off = leave the surface"],
    ["on","take on","hire · accept work","embaucher · accepter","The café is taking on new staff.","S","on = add onto yourself"],
    ["over","take over","take control","reprendre, prendre le contrôle","I took over the project when my manager left.","S","over = control passes over to you"],
    ["up","take up","start a hobby","se mettre à","I want to take up surfing in Australia.","S","up = begin, appear"],
    ["out","take out","withdraw (money) · remove","retirer","I need to take out some cash.","S","out = out of the account"],
    ["back","take back","return an item · retract","rapporter · retirer (ses paroles)","I took the jacket back to the shop.","S","back = return"],
    ["after","take after","resemble a parent","ressembler à (un parent)","I take after my father.","I","after = follow in someone’s footsteps"],
    ["down","take down","write notes","noter","Take down the reference number.","S","down = onto paper"]
  ]},
  {verb:"put", fr:"mettre, poser", base:"place something", rows:[
    ["on","put on","wear","mettre (vêtement, crème)","Put on sunscreen — the sun is strong!","S","on = attach to your body"],
    ["off","put off","postpone","reporter","Don’t put off your visa application.","S","off = push away in time"],
    ["up","put up","give someone a bed","héberger","My friend put me up for a week in Sydney.","S","up = build / install"],
    ["up with","put up with","tolerate","supporter","I can’t put up with the noise in this hostel.","I","three-part phrasal verb"],
    ["away","put away","store in its place","ranger","Put your things away before the inspection.","S","away = out of sight"],
    ["forward","put forward","propose","proposer, avancer (une idée)","I put forward a new idea at the meeting.","S","forward = to the front"],
    ["through","put through","connect a phone call","passer (au téléphone)","I’ll put you through to HR.","S","through = from one line to another"]
  ]},
  {verb:"turn", fr:"tourner", base:"rotate, change direction", rows:[
    ["on","turn on","switch on","allumer","Turn on the air-con, it’s 40 degrees!","S","on = active"],
    ["off","turn off","switch off","éteindre","Turn off the lights when you leave.","S","off = stop"],
    ["up","turn up","arrive, appear · increase volume","arriver, se présenter · monter (le son)","Only three candidates turned up.","—","up = appear"],
    ["down","turn down","refuse · lower","refuser · baisser","I turned down the offer because the pay was too low.","S","down = reject"],
    ["into","turn into","become","se transformer en","My holiday job turned into a full-time position.","I","into = change into a new form"],
    ["out","turn out","prove to be","s’avérer","The interview turned out to be easy.","—","out = the result comes out"],
    ["to","turn to","ask for help","se tourner vers","I turned to my manager for advice.","I","to = direction of a person"],
    ["around","turn around","face the other way · improve a bad situation","faire demi-tour · redresser","We turned around a failing process.","S","around = full rotation"]
  ]},
  {verb:"check", fr:"vérifier", base:"verify", rows:[
    ["in","check in","register on arrival (hotel, airport)","s’enregistrer","We checked in at the hostel at 3 p.m.","—","in = enter"],
    ["out","check out","leave a hotel and pay · have a look at","régler et partir · jeter un œil","We must check out by 10 a.m.","—","out = exit"],
    ["on","check on","make sure someone/something is OK","vérifier (l’état de)","Can you check on the order?","I","on = focus on"],
    ["over","check over","examine carefully","vérifier en détail","The mechanic checked over the van.","S","over = the whole surface"]
  ]},
  {verb:"come", fr:"venir", base:"move toward", rows:[
    ["up with","come up with","think of an idea","trouver (une idée)","I came up with a cheaper solution.","I","up = the idea appears"],
    ["across","come across","find by chance","tomber sur","I came across a great job ad on Seek.","I","across = cross paths with"],
    ["back","come back","return","revenir","I’ll come back to Australia next year.","—","back = return"],
    ["up","come up","arise, happen","survenir","A problem came up during my shift.","—","up = appear"],
    ["along","come along","accompany · progress","venir avec · avancer","My English is coming along nicely.","—","along = moving forward together"],
    ["over","come over","visit someone’s home","passer (chez quelqu’un)","Come over for a barbecue on Saturday!","—","over = from your place to mine"],
    ["down with","come down with","catch an illness","tomber malade","I came down with a cold after the flight.","I","down = health goes down"]
  ]},
  {verb:"go", fr:"aller", base:"move", rows:[
    ["on","go on","continue · happen","continuer · se passer","Go on, I’m listening. · What’s going on?","—","on = continuation"],
    ["over","go over","review","revoir, réviser","Let’s go over your answers.","I","over = the whole surface"],
    ["through","go through","examine in detail · experience","passer en revue · traverser (une épreuve)","We went through the contract line by line.","I","through = start to finish"],
    ["back","go back","return","retourner","I’d love to go back to Byron Bay.","—","back = return"],
    ["out","go out","leave home for fun","sortir","We go out every Friday night.","—","out = exit"],
    ["up / down","go up / go down","increase / decrease","augmenter / baisser","Rents have gone up in Sydney.","—","up = more · down = less"],
    ["off","go off","ring (alarm) · explode","sonner · exploser","My alarm went off at 4 a.m.","—","off = sudden release"]
  ]},
  {verb:"set", fr:"placer, régler", base:"place, fix", rows:[
    ["up","set up","establish","créer, monter","We want to set up our own business.","S","up = build"],
    ["off","set off","start a journey","partir, se mettre en route","We set off for Uluru at dawn.","—","off = departure"],
    ["out","set out","present clearly · start with a goal","exposer · entreprendre","The contract sets out your duties.","S","out = into view"],
    ["aside","set aside","save for later","mettre de côté","I set aside $200 every week.","S","aside = to one side"],
    ["back","set back","delay · cost","retarder · coûter","The visa delay set us back two weeks.","S","back = backwards"]
  ]},
  {verb:"give", fr:"donner", base:"give", rows:[
    ["up","give up","stop trying · quit a habit","abandonner · arrêter","Never give up! · I gave up smoking.","S","up = completely finished"],
    ["back","give back","return","rendre","Give back the keys when you leave.","S","back = return"],
    ["out","give out","distribute","distribuer","Staff gave out maps at the entrance.","S","out = to everyone"],
    ["away","give away","offer for free · reveal a secret","donner · révéler","They gave away free samples.","S","away = it leaves you"],
    ["in","give in","surrender · submit a document","céder · remettre","Give in your application by Friday.","S","in = hand in"]
  ]},
  {verb:"run", fr:"courir", base:"run", rows:[
    ["out of","run out of","have none left","être à court de","We ran out of petrol in the outback.","I","out = nothing left"],
    ["into","run into","meet by chance · encounter problems","croiser · rencontrer (des difficultés)","I ran into a French friend in Cairns.","I","into = collide with"],
    ["over","run over","go beyond the time","dépasser (l’horaire)","The meeting ran over by 20 minutes.","—","over = beyond the limit"],
    ["through","run through","rehearse quickly","répéter, passer en revue","Let’s run through the presentation.","I","through = start to finish, fast"],
    ["away","run away","escape","s’enfuir","The dog ran away from the farm.","—","away = distance"]
  ]},
  {verb:"pick · break", fr:"cueillir · casser", base:"pick, break", rows:[
    ["up","pick up","collect someone · learn informally","aller chercher · apprendre sur le tas","Can you pick me up at the airport? · I picked up some Aussie slang.","S","up = lift"],
    ["out","pick out","choose","choisir","Pick out the best candidate.","S","out = take from a group"],
    ["down","break down","stop working","tomber en panne","Our van broke down near Darwin.","—","down = stop"],
    ["into","break into","enter by force","entrer par effraction","Someone broke into my car.","I","into = inside"],
    ["out","break out","start suddenly (fire, war)","éclater","A bushfire broke out near the town.","—","out = bursts out"]
  ]},
  {verb:"phone & paperwork", fr:"téléphone & démarches", base:"useful mixed verbs", rows:[
    ["in","fill in","complete (missing information)","remplir","Fill in your tax file number here.","S","in = put words inside the boxes"],
    ["out","fill out","complete a whole form","remplir (un formulaire)","Fill out the application form.","S","out = to the end"],
    ["up","fill up","fill completely (petrol)","faire le plein","Fill up the tank before the desert.","S","up = completely"],
    ["up","sign up (for)","register","s’inscrire","I signed up for a barista course.","—","up = add your name"],
    ["on","hold on","wait (on the phone)","patienter","Hold on, I’ll put you through.","—","on = keep the line on"],
    ["up","hang up","end a phone call","raccrocher","Don’t hang up, I’m transferring you.","—","up = the old phone went up on the wall"],
    ["back","call back","return a call","rappeler","I’ll call you back in ten minutes.","S","back = return"],
    ["off","call off","cancel","annuler","The tour was called off because of the storm.","S","off = stop"],
    ["out","find out","discover information","découvrir, apprendre","I found out the café was hiring.","S","out = into the light"],
    ["out","sort out","solve, organise","régler, arranger","I sorted out my bank account.","S","out = problem removed"],
    ["up on","follow up on","check progress after contact","donner suite à, relancer","I’ll follow up on my application.","I","three-part phrasal verb"]
  ]}
];

/* ---------- 5. Who vs whose: join the sentences ---------- */
const JOINS = [
  {a:"I met a recruiter.", b:"She works for Qantas.", answer:"who", joined:"I met a recruiter <b>who</b> works for Qantas.", why:"SHE + verb → WHO + verb"},
  {a:"I met a recruiter.", b:"Her agency places staff in Perth.", answer:"whose", joined:"I met a recruiter <b>whose</b> agency places staff in Perth.", why:"HER agency → WHOSE agency"},
  {a:"That’s the backpacker.", b:"His passport was stolen.", answer:"whose", joined:"That’s the backpacker <b>whose</b> passport was stolen.", why:"HIS passport → WHOSE passport"},
  {a:"That’s the backpacker.", b:"He helped me at the hostel.", answer:"who", joined:"That’s the backpacker <b>who</b> helped me at the hostel.", why:"HE helped → WHO helped"},
  {a:"I worked for a company.", b:"Its headquarters are in Lyon.", answer:"whose", joined:"I worked for a company <b>whose</b> headquarters are in Lyon.", why:"ITS headquarters → WHOSE headquarters (things too!)"},
  {a:"We have a manager.", b:"She always listens to the team.", answer:"who", joined:"We have a manager <b>who</b> always listens to the team.", why:"SHE listens → WHO listens"},
  {a:"I contacted the farmers.", b:"Their farm needs pickers.", answer:"whose", joined:"I contacted the farmers <b>whose</b> farm needs pickers.", why:"THEIR farm → WHOSE farm"},
  {a:"I contacted the farmers.", b:"They need pickers.", answer:"who", joined:"I contacted the farmers <b>who</b> need pickers.", why:"THEY need → WHO need"}
];

/* ---------- 6. Games data ---------- */
const SORT_ITEMS = [ // module 0: verb sorter
  ["decide","to"],["want","to"],["hope","to"],["manage","to"],["agree","to"],["refuse","to"],["afford","to"],["promise","to"],["plan","to"],["offer","to"],
  ["enjoy","ing"],["avoid","ing"],["suggest","ing"],["finish","ing"],["mind","ing"],["keep","ing"],["consider","ing"],["practise","ing"],["give up","ing"],
  ["look forward to","prep"],["interested in","prep"],["good at","prep"],["be used to","prep"],["thank you for","prep"],["tired of","prep"],["instead of","prep"]
];
const SORT_BINS = {to:"+ TO + verb", ing:"+ -ING", prep:"preposition + -ING"};

const HALVES = [ // module 1: match the halves
  ["If you heat water to 100°C,","it boils.","Zero"],
  ["If I save enough money,","I will travel around the coast.","First"],
  ["Unless the visa arrives soon,","we won’t book the flight.","First"],
  ["If I lived in Sydney,","I would go surfing every weekend.","Second"],
  ["If I were you,","I would apply for that job.","Second"],
  ["If I had known about the deadline,","I would have applied earlier.","Third"],
  ["If we had left earlier,","we would have caught the ferry.","Third"],
  ["If I had accepted that offer,","I would be in Lyon now.","Mixed"]
];

const PASSIVE_GAME = [ // module 2: transformer
  {prompt:"They pay the staff every Friday.", answer:"The staff are paid every Friday.", options:["The staff are paid every Friday.","The staff paid every Friday.","The staff are paying every Friday."]},
  {prompt:"The manager reviewed my application.", answer:"My application was reviewed by the manager.", options:["My application reviewed the manager.","My application was reviewed by the manager.","My application has reviewing by the manager."]},
  {prompt:"They will provide training.", answer:"Training will be provided.", options:["Training will provide.","Training will be provided.","Training is providing."]},
  {prompt:"Someone has stolen my backpack!", answer:"My backpack has been stolen!", options:["My backpack has stolen!","My backpack was stealing!","My backpack has been stolen!"]},
  {prompt:"They are testing the new system.", answer:"The new system is being tested.", options:["The new system is being tested.","The new system is testing.","The new system has being tested."]},
  {prompt:"People speak English in Australia.", answer:"English is spoken in Australia.", options:["English speaks in Australia.","English is spoken in Australia.","English is speaking in Australia."]},
  {prompt:"The company hired 20 pickers last week.", answer:"20 pickers were hired last week.", options:["20 pickers were hired last week.","20 pickers hired last week.","20 pickers have been hire last week."]},
  {prompt:"They had already filled the position.", answer:"The position had already been filled.", options:["The position had already filled.","The position had already been filled.","The position was already filling."]},
  {prompt:"You must complete the form in English.", answer:"The form must be completed in English.", options:["The form must completed in English.","The form must be completed in English.","The form must be completing in English."]},
  {prompt:"They built the Opera House in 1973.", answer:"The Opera House was built in 1973.", options:["The Opera House built in 1973.","The Opera House was built in 1973.","The Opera House has built in 1973."]}
];

const WHO_GAME = [ // module 3: who / whose / who's dash
  {prompt:"The woman ___ interviewed me was from Melbourne.", answer:"who"},
  {prompt:"The woman ___ office I visited was from Melbourne.", answer:"whose"},
  {prompt:"He’s the guy ___ always late.", answer:"who’s"},
  {prompt:"The hostel ___ I stayed was very clean.", answer:"where"},
  {prompt:"The job, ___ starts in March, is in Perth.", answer:"which"},
  {prompt:"I have a friend ___ brother lives in Brisbane.", answer:"whose"},
  {prompt:"I have a friend ___ lives in Brisbane.", answer:"who"},
  {prompt:"___ been to Uluru before?", answer:"who’s"},
  {prompt:"The café ___ owner hired me is on the beach.", answer:"whose"},
  {prompt:"The café ___ hired me is on the beach.", answer:"which"},
  {prompt:"Candidates ___ English is fluent are preferred.", answer:"whose"},
  {prompt:"Candidates ___ speak fluent English are preferred.", answer:"who"},
  {prompt:"___ car is parked outside?", answer:"whose"},
  {prompt:"This is the town ___ we picked mangoes.", answer:"where"},
  {prompt:"My partner, ___ a nurse, wants to work in Sydney.", answer:"who’s"},
  {prompt:"My partner, ___ dream is to open a café, is very motivated.", answer:"whose"}
];
const WHO_OPTIONS = ["who","whose","who’s","which","where"];

/* ---------- 7. Sentence builders (several per module) ---------- */
const BUILDS = [
  [["I","look","forward","to","hearing","from","you","."],["I","decided","to","move","to","Australia","."],["I","am","used","to","working","under","pressure","."]],
  [["If","I","had","known",",","I","would","have","prepared","earlier","."],["If","I","save","enough",",","I","will","travel","."],["If","I","were","you",",","I","would","apply","."]],
  [["The","application","was","reviewed","yesterday","."],["Training","will","be","provided","."],["My","backpack","has","been","stolen","."]],
  [["The","colleague","who","helped","me","was","kind","."],["The","candidate","whose","CV","impressed","us","got","the","job","."],["This","is","the","farm","where","I","worked","."]],
  [["We","need","to","look","into","the","issue","."],["Can","you","pick","me","up","at","the","airport","?"],["I","can’t","put","up","with","the","noise","."]]
];

/* ---------- 8. Speaking & writing missions ---------- */
const MISSIONS = [
  ["Explain your move","Explain why you decided to move, what you enjoy doing, and what you are looking forward to.",
   "I decided to move to Australia because I want to gain international experience. I enjoy working with people, and I look forward to improving my English.",
   "After six years in process analysis, I decided to pursue an international opportunity. I am particularly looking forward to applying my problem-solving skills while adapting to a new environment."],
  ["Three futures","Give one realistic, one hypothetical and one past-unreal sentence about a job interview.",
   "If I prepare well, I will feel ready. If I had more time, I would practise more. If I had practised yesterday, I would have felt more confident.",
   "If I receive an interview invitation, I will research the company. Were I offered a leadership role, I would consider it carefully. Had I known the interview format earlier, I would have tailored my preparation."],
  ["Report a workplace improvement","Describe a process improvement using at least two passive structures.",
   "A problem was identified. A new procedure was introduced, and the results were checked.",
   "Following an internal review, several inefficiencies were identified. A revised workflow was implemented, and its effectiveness has since been evaluated."],
  ["Connect your experience","Describe a company, a colleague and a project using WHO, WHOSE, WHICH and WHERE — at least once each.",
   "I worked for a company which sells sports equipment. I had a colleague who helped me a lot. She was a manager whose team was very organised. The office where I worked was near Lyon.",
   "I worked for a retailer whose operations spanned several countries, where I analysed operational processes. One colleague, whose experience was invaluable, helped me implement a project which significantly improved efficiency. She is someone who always found time to coach new analysts."],
  ["Tell the story naturally","Use at least five phrasal verbs to describe a job search or a problem while travelling.",
   "I looked for a job online and came across a good advert. I filled out the form and followed up on my application. When our van broke down, we sorted it out quickly.",
   "Shortly after we set off from Perth, I came across an appealing vacancy, so I looked into the company and filled out the application. Two days later our van broke down, but rather than putting off the trip, we sorted out the repair and carried on. I followed up with the recruiter and was taken on the following week."]
];
