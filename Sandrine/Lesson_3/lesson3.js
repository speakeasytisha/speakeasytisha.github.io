'use strict';
/* =========================================================
   London Calling · Lesson 03 · Sandrine — SpeakEasyTisha
   v3 · weather + two-week planner + games
   ========================================================= */
const KEY = 'speakeasytisha.sandrine.london.lesson03.v1';   // same key: earlier progress is kept
const HOTEL = 'The Resident Covent Garden, London';

/* ---------- 1. DATA · ATTRACTIONS ---------- */
const ATTRACTIONS = [
 {id:'eye',name:'London Eye',short:'the London Eye',icon:'🎡',kind:'Views · South Bank',area:'South Bank · Waterloo',q:'London Eye, London SE1 7PB',wx:'views',energy:1,
  where:"It's on the South Bank, next to the River Thames, opposite the Houses of Parliament.",verb:'go up the London Eye',
  link:'https://www.londoneye.com/',photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/London_Eye_from_Westminster_Bridge.jpg/1280px-London_Eye_from_Westminster_Bridge.jpg',photoPage:'https://commons.wikimedia.org/wiki/File:London_Eye_from_Westminster_Bridge.jpg',
  desc:'The London Eye is a giant observation wheel beside the Thames. From a glass capsule, visitors can admire the Houses of Parliament, the bridges and much of central London. It is a popular choice for a family that wants panoramic views — but choose a clear day! Tickets and time slots should be checked on the official website.',
  facts:['It offers views over London.','It is on the South Bank.','A clear day gives the best views.'],question:'Why might a family choose the London Eye?',options:['To admire the city from above','To visit a collection of dinosaur fossils','To catch a train to France'],answer:0,fr:'Une grande roue panoramique au bord de la Tamise.'},
 {id:'nhm',name:'Natural History Museum',short:'the Natural History Museum',icon:'🦕',kind:'Science · South Kensington',area:'South Kensington',q:'Natural History Museum, Cromwell Road, London',wx:'indoor',energy:2,
  where:"It's in South Kensington, in west London, next to the Science Museum.",verb:'visit the Natural History Museum',
  link:'https://www.nhm.ac.uk/visit.html',photo:'https://cdn.mos.cms.futurecdn.net/fvvEkNQbdXQxdMVySJBJmj.jpg',
  desc:'Inside this remarkable Victorian building, visitors can explore dinosaurs, mammals, rocks and the natural world. In Hintze Hall, a blue whale skeleton called Hope hangs overhead. General admission is free, although special exhibitions may cost extra and free advance booking can be useful. A perfect rainy-day choice.',
  facts:['General admission is free.','Hope is a blue whale skeleton.','Some exhibitions may require payment.'],question:'Which statement is correct?',options:['Every exhibition is always free','General admission is free','The museum is beside Greenwich Pier'],answer:1,fr:'Musée d’histoire naturelle, avec une baleine suspendue dans le grand hall.'},
 {id:'globe',name:'Shakespeare’s Globe',short:'Shakespeare’s Globe',icon:'🎭',kind:'Theatre · Bankside',area:'Bankside · Southwark',q:"Shakespeare's Globe, 21 New Globe Walk, London",wx:'outdoor',energy:2,
  where:"It's on Bankside, on the south bank of the Thames, next to Tate Modern.",verb:'take a tour of Shakespeare’s Globe',
  link:'https://www.shakespearesglobe.com/',photo:'https://commons.wikimedia.org/wiki/Special:FilePath/Shakespeare%27s_Globe%2C_London.jpg?width=960',photoPage:'https://commons.wikimedia.org/wiki/File:Shakespeare%27s_Globe,_London.jpg',
  desc:'Shakespeare’s Globe is a reconstructed open-air theatre inspired by the playhouses of Shakespeare’s time. You can discover theatre history on a guided tour or check which performances are scheduled. Remember: the centre of the theatre has no roof!',
  facts:['It is a theatre.','Guided tours are possible.','It is open-air.'],question:'What can visitors learn about?',options:['How London buses are built','Shakespeare and theatre history','Space travel'],answer:1,fr:'Théâtre historique reconstruit, à ciel ouvert : visites et spectacles.'},
 {id:'borough',name:'Borough Market',short:'Borough Market',icon:'🧀',kind:'Food · London Bridge',area:'London Bridge · Southwark',q:'Borough Market, London SE1 9AL',wx:'covered',energy:2,
  where:"It's next to London Bridge, on the south side of the river.",verb:'have lunch at Borough Market',
  link:'https://boroughmarket.org.uk/',photo:'https://media.cntraveler.com/photos/5a833194fc08c0430e845e6d/16%3A9/w_2560%2Cc_limit/Borough-Market_2018_1600-x-1066.jpg',
  desc:'Borough Market is a lively food market near London Bridge. Visitors can browse stalls, taste food from different traditions and buy something for lunch. It is a great place to practise asking about ingredients, prices and portions. Opening times vary, so check the market website.',
  facts:['It is close to London Bridge.','You can browse food stalls.','It is useful for practising food questions.'],question:'What language is especially useful here?',options:['Describing airport security','Requesting a hotel room','Asking about ingredients and prices'],answer:2,fr:'Marché alimentaire animé avec cuisines variées.'},
 {id:'cutty',name:'Cutty Sark',short:'the Cutty Sark',icon:'⛵',kind:'Maritime heritage · Greenwich',area:'Greenwich',q:'Cutty Sark, King William Walk, London SE10 9HT',wx:'indoor',energy:2,
  where:"It's in Greenwich, in south-east London, right next to the river.",verb:'explore the Cutty Sark',
  link:'https://www.rmg.co.uk/cutty-sark',photo:'https://upload.wikimedia.org/wikipedia/commons/e/e1/Cutty_Sark_26-06-2012_%287471549450%29.jpg',
  desc:'The Cutty Sark is a restored nineteenth-century sailing ship in Greenwich. Visitors can discover life at sea, learn about the tea trade, walk on the main deck and even walk beneath the ship. Unlike the free National Maritime Museum nearby, the ship has paid admission. Perfect for ocean lovers!',
  facts:['It is a historic ship.','It is in Greenwich.','Entry is paid.'],question:'Which description fits this place?',options:['A theatre in Bankside','A shopping street in the West End','A historic sailing ship'],answer:2,fr:'Ancien voilier du XIXe siècle à visiter à Greenwich.'},
 {id:'observatory',name:'Royal Observatory Greenwich',short:'the Royal Observatory',icon:'🔭',kind:'Space & time · Greenwich',area:'Greenwich Park',q:'Royal Observatory Greenwich, Blackheath Avenue, London SE10 8XJ',wx:'outdoor',energy:3,closed:true,
  where:"It's at the top of the hill in Greenwich Park, in south-east London.",verb:'stand on the Prime Meridian at the Royal Observatory',
  link:'https://www.rmg.co.uk/royal-observatory',photo:'https://www.britainexpress.com/images/attractions/editor3/Royal-Observatory-Greenwich-5043.jpg',
  desc:'At the Royal Observatory, visitors discover the story of time, navigation and astronomy. The famous Prime Meridian runs through the site: you can stand with one foot in the east and one in the west! Real-life update: the Observatory closed temporarily on 2 November 2026 for a major refurbishment, with a phased reopening expected in summer 2027 — check the website for your dates.',
  facts:['It explores astronomy and time.','You can learn about the Prime Meridian.','It is temporarily closed — check before you go.'],question:'What is the Prime Meridian associated with?',options:['A famous food market','Longitude and timekeeping','The London Underground'],answer:1,fr:'Observatoire consacré au temps et à l’astronomie — fermé temporairement pour travaux (réouverture progressive prévue à l’été 2027).'},
 {id:'tate',name:'Tate Modern',short:'Tate Modern',icon:'🖼️',kind:'Modern art · Bankside',area:'Bankside · Southwark',q:'Tate Modern, Bankside, London SE1 9TG',wx:'indoor',energy:2,
  where:"It's on Bankside, on the south bank, opposite St Paul's Cathedral across the Millennium Bridge.",verb:'look at modern art at Tate Modern',
  link:'https://www.tate.org.uk/visit/tate-modern',photo:'https://cdn-imgix.headout.com/media/images/1b54e124f87c91bf384c0a1ae8b41c2f-31857-london-tate-modern---electric-dreams-exhibition-12.jpg?ar=14%3A11&auto=compress%2Cformat&crop=faces&fit=crop&h=401.4&q=90&w=510.8727272727273',
  desc:'Tate Modern is a major museum of modern and contemporary art inside a former power station by the Thames. Visitors can enjoy many free collection displays and discover changing exhibitions. It invites conversation: Which work is most surprising? How does it make you feel?',
  facts:['It occupies a former power station.','It displays modern and contemporary art.','Some exhibitions are ticketed.'],question:'What kind of art is Tate Modern known for?',options:['Ancient Egyptian tombs only','Modern and contemporary art','Only landscape painting'],answer:1,fr:'Musée d’art moderne dans une ancienne centrale électrique.'},
 {id:'covent',name:'Covent Garden',short:'Covent Garden',icon:'🎪',kind:'Street culture · West End',area:'Covent Garden · near your hotel',q:'Covent Garden Market, London WC2E 8RF',wx:'covered',energy:1,
  where:"It's in the West End, in central London — a few minutes' walk from our hotel.",verb:'watch the street performers in Covent Garden',
  link:'https://www.coventgarden.london/',photo:'https://www.cynic.org.uk/photos/ap/full/20080920/dsc_5281.jpg',
  desc:'Covent Garden combines a historic covered market, small shops, street entertainment and places to eat. It makes a good relaxed stop near your hotel: listen to performers, browse stalls or ask for a recommendation before a show in the West End. Easy on tired legs!',
  facts:['It has a covered market.','You may find street performers.','It is close to your hotel.'],question:'Why is Covent Garden useful for a relaxed afternoon?',options:['It is only an airport','It combines markets, performances and cafés','It is a ferry terminal'],answer:1,fr:'Quartier vivant : marché couvert, artistes de rue, boutiques et cafés.'}
];
const EXTRAS = [
 {id:'hyde',name:'Hyde Park picnic & pedalos',short:'the picnic in Hyde Park',icon:'🌳',wx:'outdoor',energy:1,wind:true,verb:'have a picnic and take a pedalo on the Serpentine in Hyde Park'},
 {id:'boat',name:'Thames boat trip',short:'the boat trip',icon:'⛴️',wx:'outdoor',energy:1,wind:true,verb:'take a boat trip on the Thames'},
 {id:'science',name:'Science Museum (space gallery!)',short:'the Science Museum',icon:'🚀',wx:'indoor',energy:2,verb:'visit the Science Museum'},
 {id:'skygarden',name:'Sky Garden (free views, book ahead)',short:'the Sky Garden',icon:'🌿',wx:'views',energy:1,verb:'enjoy the free views from the Sky Garden'},
 {id:'camden',name:'Camden Market',short:'Camden Market',icon:'🛍️',wx:'covered',energy:2,verb:'browse the stalls at Camden Market'},
 {id:'hampstead',name:'Hampstead Heath hike',short:'the hike on Hampstead Heath',icon:'🥾',wx:'outdoor',energy:3,verb:'go for a hike on Hampstead Heath'},
 {id:'oxford',name:'Shopping on Oxford Street',short:'the shopping trip',icon:'👟',wx:'outdoor',energy:2,verb:'go shopping on Oxford Street'},
 {id:'cinema',name:'Cinema night',short:'the cinema',icon:'🎬',wx:'indoor',energy:1,verb:'go to the cinema'},
 {id:'rest',name:'Lie-in & lazy morning',short:'a lazy morning',icon:'😴',wx:'indoor',energy:0,verb:'have a lie-in and take it easy'}
];
const ACTS = Object.fromEntries([...ATTRACTIONS, ...EXTRAS].map(a => [a.id, a]));
const WXTAG = {indoor:'🏠 indoor', covered:'☂️ covered', outdoor:'🌳 outdoor', views:'👀 needs clear views'};

/* ---------- 2. DATA · PHRASES & WORDS ---------- */
const PHRASES = {
 ask:[["What's the weather like today?",'Quel temps fait-il aujourd’hui ?'],["What's the forecast for tomorrow?",'Quelles sont les prévisions pour demain ?'],["Is it going to rain this afternoon?",'Est-ce qu’il va pleuvoir cet après-midi ?'],["Will it be sunny at the weekend?",'Fera-t-il beau ce week-end ?'],["What's the temperature?",'Quelle température fait-il ?'],["Do we need an umbrella?",'Faut-il prendre un parapluie ?']],
 describe:[["It's sunny and warm.",'Il fait beau et chaud.'],["It's a bit chilly.",'Il fait un peu frais.'],["It's cloudy but dry.",'C’est nuageux mais sec.'],["It's pouring with rain!",'Il pleut à verse !'],["There might be a few showers.",'Il pourrait y avoir quelques averses.'],["It's blowing a gale!",'Il y a un vent à décorner les bœufs !'],["What a lovely day!",'Quelle belle journée !']],
 decide:[["Since it's raining, let's go to a museum.",'Puisqu’il pleut, allons au musée.'],["As it's going to be sunny, we should be outside.",'Comme il va faire beau, on devrait être dehors.'],["If it rains, we'll go to the cinema.",'S’il pleut, on ira au cinéma.'],["It's too windy for the boat, so let's walk instead.",'Il y a trop de vent pour le bateau, donc marchons plutôt.'],["Let's keep the London Eye for a clear day.",'Gardons le London Eye pour un jour dégagé.'],["We'd better take our brollies.",'On ferait mieux de prendre nos parapluies.']],
 change:[["Let's move the boat trip to Friday.",'Déplaçons la balade en bateau à vendredi.'],["Why don't we swap Tuesday and Thursday?",'Et si on échangeait mardi et jeudi ?'],["Let's put off the hike until the weekend.",'Reportons la randonnée au week-end.'],["The kids are worn out — let's take it easy.",'Les enfants sont épuisés — allons-y doucement.'],["Shall we have a lie-in tomorrow?",'Et si on faisait la grasse matinée demain ?'],["Are you up for a long walk?",'Ça vous dit, une longue marche ?'],["We could do something more relaxing.",'On pourrait faire quelque chose de plus reposant.'],["Can we fit in the Sky Garden?",'On peut caser le Sky Garden ?']]
};
const WEATHER_WORDS = [
 ['☀️','sunny','ensoleillé',"It's sunny and warm today."],['🌤️','sunny spells','éclaircies','There will be sunny spells this afternoon.'],['☁️','cloudy','nuageux',"It's cloudy but dry."],['🌥️','overcast','couvert','The sky is grey and overcast.'],
 ['🌦️','showers','averses','There might be a few showers.'],['🌧️','pouring','il pleut à verse',"It's pouring — take a brolly!"],['💧','drizzle','bruine',"It's only drizzle. Let's go out."],['⛈️','thunderstorm','orage',"There's going to be a thunderstorm tonight."],
 ['💨','windy','venteux',"It's too windy for the boat."],['🌫️','foggy','brumeux',"It's foggy, so the views won't be great."],['🥶','chilly / freezing','frais / glacial',"It's a bit chilly — bring a jumper."],['🌡️','mild / warm / hot','doux / chaud / très chaud',"It's mild for April."]
];
const RECEPTION = [
 ['Receptionist','Good morning! How can I help you today?'],
 ['You','Could you recommend somewhere interesting to visit with two teenagers?'],
 ['Receptionist',"Of course! For spectacular views, try the London Eye — but go on a clear day. For science, the Natural History Museum is brilliant, especially if it rains."],
 ['Receptionist',"For food and atmosphere, try Borough Market. For theatre and history, visit Shakespeare's Globe. And Greenwich is fantastic for ships!"],
 ['You',"Thank you! And what's the weather going to be like this week?"],
 ['Receptionist',"Typical London, I'm afraid — a bit of everything! Check the forecast every morning and keep an umbrella in your bag."]
];

/* ---------- 3. DATA · VOCABULARY ---------- */
const VOCAB = {
'Recommendations':[['recommend','recommander','suggest something suitable','Could you recommend a family activity?'],['worth visiting','qui vaut la visite','interesting enough to visit','Is the Globe worth visiting?'],['nearby','à proximité','not far away','Is there a café nearby?'],['suitable','adapté','appropriate for a person or group','Is the exhibition suitable for teenagers?'],['instead','à la place','as an alternative','We could walk instead.'],['guided tour','visite guidée','visit led by a guide','Do you offer a guided tour?']],
'Weather':[['sunny spells','éclaircies','short periods of sunshine','There will be sunny spells this afternoon.'],['showers','averses','short periods of rain','There might be a few showers.'],['drizzle','bruine','very light rain',"It's only drizzle — let's go out."],['pouring (with rain)','pleuvoir à verse','raining very heavily',"It's pouring — take a brolly!"],['brolly (UK, informal)','parapluie','umbrella',"Don't forget your brolly."],['chilly','frais','quite cold',"It's a bit chilly this morning."],['mild','doux','not cold; pleasant',"It's mild for March."],['forecast','prévisions météo','prediction of the weather',"What's the forecast for tomorrow?"],['overcast','couvert','completely grey sky',"It's overcast but dry."],['heatwave','canicule','period of very hot weather','London is having a heatwave.']],
'Plans & energy':[['move (to)','déplacer (à)','change the day of an activity',"Let's move the boat trip to Friday."],['swap','échanger','exchange two things',"Why don't we swap Monday and Tuesday?"],['put off / postpone','reporter','do something later',"Let's put off the hike until Saturday."],['take it easy','y aller doucement','relax, do less',"The kids are tired — let's take it easy."],['worn out / shattered','épuisé','very tired',"We're shattered after all that walking."],['have a lie-in','faire la grasse matinée','stay in bed late',"Let's have a lie-in tomorrow."],['be up for (something)','avoir envie de','want to do something','Are you up for a walk?'],['fit in','caser','find time for','Can we fit in the Sky Garden?']],
'Transport':[['Tube / Underground','métro londonien','urban rail network','Which Tube line should we take?'],['platform','quai','area where you board a train','Which platform does it leave from?'],['change lines','changer de ligne','transfer between routes','Do we need to change lines?'],['get off','descendre','leave a bus or train','Get off at Waterloo.'],['tap in / tap out','valider à l’entrée / à la sortie','use your card on a reader','Remember to tap out on the Tube.'],['DLR','métro léger automatique','Docklands Light Railway','Take the DLR to Cutty Sark station.'],['River Bus','navette fluviale','paid boat transport','Is the River Bus running today?'],['single ticket','aller simple','ticket for one journey','Do I need a single ticket?'],['return ticket','aller-retour','ticket for outward and return travel','Do you sell return tickets?'],['service disruption','perturbation','transport not running normally','Is there a service disruption?']],
'Directions':[['go straight on','allez tout droit','continue without turning','Go straight on past the shop.'],['turn left','tournez à gauche','change direction to the left','Turn left after the bridge.'],['turn right','tournez à droite','change direction to the right','Turn right at the crossing.'],['opposite','en face de','on the other side, facing','The café is opposite the lift.'],['next to','à côté de','directly beside','The toilets are next to the entrance.'],['on the corner of','à l’angle de','where two streets meet','The bank is on the corner of the High Street.'],['go past','passer devant','walk beside and continue','Go past the pharmacy.'],['pedestrian crossing','passage piéton','marked place to cross the road','Cross at the pedestrian crossing.'],['junction','intersection','place where roads meet','Turn right at the junction.'],['within walking distance','accessible à pied','near enough to walk','Is it within walking distance?']],
'Tickets & money':[['admission','entrée (droit d’accès)','permission or ticket to enter','Is admission free?'],['time slot','créneau horaire','reserved time to arrive','Our time slot is at eleven.'],['booking confirmation','confirmation de réservation','message proving a reservation','Here is our booking confirmation.'],['QR code','code QR','code scanned from a phone','Could you scan this QR code?'],['under 4s go free','gratuit pour les moins de 4 ans','no charge for small children','Under 4s go free.'],['refund','remboursement','money given back','Can we get a refund?'],['booking fee','frais de réservation','extra charge for booking','Is there a booking fee?'],['contactless','sans contact','paying by tapping card or phone','Can I pay contactless?'],['altogether','au total','in total','How much is that altogether?'],['receipt','reçu','proof of payment','Could I have a receipt?']],
'Signs & facilities':[['way out (UK) / exit','sortie','the door to leave','Follow the signs to the way out.'],['cloakroom','vestiaire','place to leave coats and bags','Can we leave our coats in the cloakroom?'],['lockers','consignes','small cupboards you can lock','Are there any lockers for our bags?'],['baby changing','table à langer','room for changing a baby','Baby changing is next to the toilets.'],['lower ground floor','niveau -1','floor just below street level','The lockers are on the lower ground floor.'],['information desk','accueil / point info','place to ask questions','Ask at the information desk.'],['audio guide','audioguide','recorded commentary','Scan the QR code for the audio guide.'],['staff only','réservé au personnel','visitors cannot enter','That door is staff only.']],
'Inside a building':[['ground floor (UK)','rez-de-chaussée','street-level floor in the UK','The shop is on the ground floor.'],['first floor (UK)','premier étage','one floor above ground in the UK','The gallery is on the first floor.'],['lift (UK) / elevator (US)','ascenseur','machine between floors','Where is the lift, please?'],['stairs','escaliers','steps between floors','Go up the stairs.'],['corridor','couloir','long passage inside','Walk down the corridor.'],['toilets / loo (UK) · restroom (US)','toilettes','room with sanitary facilities','Where are the toilets, please?'],['accessible entrance','entrée accessible','entrance without barriers','Is there an accessible entrance?'],['queue (UK) / line (US)','file d’attente','people waiting their turn','Join the queue on the left.']],
'Food & family':[['grab a bite','manger un morceau','eat something small or quick','Can we grab a bite nearby?'],['eat in / take away','sur place / à emporter','eat here or somewhere else','Is that to eat in or take away?'],['bill (UK) / check (US)','addition','restaurant payment document','Could we have the bill, please?'],['allergic to','allergique à','body reacts badly to a food','My daughter is allergic to nuts.'],['jacket potato','pomme de terre au four','potato baked in its skin','I’d like a jacket potato with beans.'],['toastie','sandwich grillé','hot grilled sandwich','Two cheese toasties, please.'],['tap water','eau du robinet','free drinking water','Could we have a jug of tap water?'],['starving','affamé','very hungry (informal)',"We're starving!"]],
'Reviews & departure':[['crowded','bondé','full of people','The market was crowded.'],['breathtaking','époustouflant','extremely impressive','The views were breathtaking.'],['disappointing','décevant','not as good as expected','The tour was disappointing.'],['however','cependant','introduces a contrast',"It was busy; however, we loved it."],['although','bien que','introduces a contrast clause','Although it rained, we enjoyed it.'],['luggage','bagages','travel bags','Where can we leave our luggage?'],['boarding pass','carte d’embarquement','document needed to board','Here is my boarding pass.'],['passport control','contrôle des passeports','border identity checks','Where is passport control?']]
};

/* ---------- 4. DATA · QUESTIONS  [question, options, correctIndex, explanation] ---------- */
const Q = {
recap:[
 ['Which question politely asks for a suggestion?',['Where is I go?','Could you recommend somewhere interesting?','You give attractions.'],1,'Use “Could you recommend…?” — polite and natural.'],
 ['A place is “worth visiting” when it is…',['interesting enough to see','not allowed to enter','always free'],0,'Worth visiting = mérite une visite.'],
 ['The receptionist says Greenwich is “fantastic for ships”. Which place matches?',['Tate Modern','Cutty Sark','Borough Market'],1,'The Cutty Sark is a historic sailing ship in Greenwich.'],
 ['Why does the receptionist say “go on a clear day” for the London Eye?',['Because it is closed when it rains','Because you can see further when there are no clouds','Because tickets are cheaper'],1,'Clear day = ciel dégagé → better views.']
],
reading:[],
weather:[
 ['Which question is the most natural way to ask about the weather?',["What's the weather like today?","How is the weather like today?","What weather is it today?"],0,'Say “What’s the weather like?” (not “How is the weather like?”).'],
 ['Look outside: water is falling right now.',["It rains.","It's raining.","It's rain."],1,'Right now → present continuous: It’s raining. (“It rains a lot in London” = in general.)'],
 ['There are dark clouds everywhere.',["It's going to rain.","It rained.","It's going to sunny."],0,'Going to + visible evidence (the dark clouds).'],
 ['The forecast is uncertain — maybe rain later.',["It must rain later.","It might rain later.","It raining later."],1,'Might = maybe / peut-être.'],
 ['Choose the correct sentence.',["If it will rain, we visit the museum.","If it rains, we'll visit the museum.","If it rain, we will visiting the museum."],1,'If + present simple, will + base verb.'],
 ["“It's chilly” means…",["it's quite cold","it's very hot","it's spicy"],0,'Chilly = frais. (Chilli with two Ls = piment!)'],
 ['A British forecast says “sunny spells”. It means…',['sun all day long','some sunshine between the clouds','a magic spell for good weather'],1,'Sunny spells = éclaircies.'],
 ["An American friend says “It's 75 degrees!”. It's…",['freezing','pleasantly warm — about 24°C','boiling — 75°C!'],1,'The US uses Fahrenheit. 75°F ≈ 24°C. The UK uses Celsius.'],
 ["“It's pouring!” means…",['it is raining very heavily','it is sunny','someone is serving tea'],0,'Pouring = il pleut à verse.'],
 ['Choose the best reason sentence.',["Since it's sunny, let's have a picnic in Hyde Park.","Since it's sunny, let's stay in a dark cinema all day.","Because sunny, picnic."],0,'Since / As + reason, + suggestion with let’s.']
],
wdec:[
 ['☀️ Saturday · sunny, 19°C · 😀 everyone is full of energy|What should we do?',['Spend the whole day in a dark cinema','Go up the London Eye and walk along the South Bank','Stay in the hotel room'],1,'Great weather + lots of energy → be outside and enjoy the views!'],
 ['🌧️ Tuesday · heavy rain all day · 🙂 normal energy|What should we do?',['A picnic in Hyde Park','The Natural History Museum','A boat trip on the open deck'],1,'Since it’s pouring, an indoor museum is the best choice.'],
 ['🌫️ Wednesday morning · thick fog · 🙂 normal energy|What should we do?',['The London Eye — the views will be amazing!','Tate Modern in the morning, then the views later if the fog clears','The viewpoint on Hampstead Heath'],1,'Fog hides the views. Do something indoors first and keep the views for a clear day.'],
 ['🌤️ Thursday · sunny spells · 😴 the teenagers are shattered after a late night|What should we do?',['A 10 km hike on Hampstead Heath','A lie-in, then a relaxed stroll around Covent Garden','Three museums in one day'],1,'When the kids are worn out, take it easy!'],
 ['💨 Friday · very windy, gusts of 45 mph · 😀 lots of energy|What should we do?',['A boat trip on the Thames','The Science Museum, then lunch in South Kensington','Pedalos on the Serpentine'],1,'Strong winds make boats uncomfortable — choose something sheltered.'],
 ['🌦️ Sunday · showers on and off · 🙂 normal energy|What should we do?',['Covent Garden — the market is covered, so we can shelter','A long walk without umbrellas','Cancel the whole day'],0,'With showers, choose a place where you can shelter — and take a brolly!']
],
plan:[
 ['You want to change Monday’s activity to Thursday.',["Let's move the boat trip to Thursday.","Let's moving the boat trip at Thursday.","We move it Thursday?"],0,'Let’s + base verb · move something TO a day.'],
 ['You want to exchange two days.',["Why don't we swap Tuesday and Thursday?","Why we don't swap Tuesday and Thursday?","Why don't we to swap Tuesday and Thursday?"],0,'Why don’t we + base verb…?'],
 ['“The kids are shattered.” (UK, informal) means they are…',['very tired','broken into pieces','very excited'],0,'Shattered / worn out / exhausted = épuisés.'],
 ["“Let's put off the hike until Friday.” means…",['cancel it for ever','postpone it until Friday','do it right now'],1,'Put off = reporter.'],
 ['Suggest a relaxing day.',["Let's take it easy today.","Let's take it easily today.","Let's easy today."],0,'“Take it easy” is a fixed expression.'],
 ['“Shall we have a lie-in tomorrow?” means…',['stay in bed later than usual','tell a small lie','go to bed early'],0,'A lie-in = une grasse matinée.']
],
route:[
 ['On a London bus, you normally…',['tap in and tap out','tap in only','pay cash to the driver'],1,'On buses, tap in only. On the Tube, tap in AND tap out.'],
 ['Which is the most polite direction question?',['Tell me station.','Could you tell me how to get to the station?','Where goes station?'],1,'Could you tell me how to get to…?'],
 ['Which phrase describes a change of line?',['Get off and take another line.','Stay on the bus for ever.','Cross a street.'],0,'Change lines = faire une correspondance.'],
 ['Two teenagers aged 12 and 14 on the Tube…',['always travel free','may get the TfL Young Visitor discount','must share one adult card'],1,'Ask staff to set the Young Visitor discount on a Visitor Oyster card.'],
 ['A teenager aged 16 on the Tube…',['always travels free','normally pays an adult fare','must sit with the driver'],1,'From 16, travellers normally pay adult fares (unless they have a special photocard).'],
 ['What does “opposite” mean?',['on the same side','on the other side, facing','far behind'],1,'Opposite = en face de.']
],
mapgame:[],
price:[
 ['How old must you be to pay the adult price?',['18 or over','16 or over','12 or over'],1,'The board says Adult (16+).'],
 ['How much is it for a 15-year-old?',['£22','£11','Free'],1,'Child tickets are for ages 4–15 → £11.'],
 ['Children under 4…',['pay £5','go free','cannot enter'],1,'Under 4s go free.'],
 ['Two adults and two children aged 12 and 14. How much altogether?',['£44','£66','£88'],1,'2 × £22 + 2 × £11 = £44 + £22 = £66.'],
 ['Two adults and two teenagers aged 13 and 16. How much altogether?',['£66','£77','£88'],1,'The 16-year-old pays the adult price: 3 × £22 + 1 × £11 = £77.'],
 ['Is there a family ticket for the ship?',['Yes, for £40','No — but a child ticket is half the adult price','Only on Mondays'],1,'No family ticket is listed. Ask: “Is there a family ticket?” — “I’m afraid not.”'],
 ['Afternoon tea for 2 adults + 2 children (12 and 14). How much more than normal tickets (£66)?',['£66 more','£100 more','£166 more'],1,'2 × £47 + 2 × £36 = £166. £166 − £66 = £100 more — but the food is included!'],
 ['Which Greenwich museum is free?',['Cutty Sark','National Maritime Museum','Royal Observatory'],1,'The National Maritime Museum has free entry.'],
 ['Why can’t you visit the Royal Observatory at the moment?',['It’s too expensive','It’s temporarily closed for refurbishment','It’s only for students'],1,'It closed on 2 November 2026; a phased reopening is expected in summer 2027.']
],
ticket:[
 ['How do you ask about price?',['How many does it cost?','How much does it cost?','How costly many?'],1,'How much for price; how many for number.'],
 ['How do you ask about quantity?',['How much tickets?','How many tickets do we need?','How many money?'],1,'Tickets are countable → how many.'],
 ['If the attraction is free, you should…',['assume no booking is ever needed','check whether a time slot is required or recommended','pay anyway without checking'],1,'Free entry does not always mean no booking.'],
 ['A booking confirmation is…',['a message proving a reservation','a receipt for lunch only','a type of train'],0,'Confirmation = proof of your booking.'],
 ['Students pay £16.50 at Cutty Sark. How much for two students?',['£32','£33','£35.50'],1,'2 × £16.50 = £33.'],
 ['“Could we pay by card?” is…',['a polite request','a past tense','an imperative'],0,'Could + subject + base verb = polite request.']
],
sign:[
 ['You want a coffee with river views. Which floor?',['Lower ground floor','Second floor','Ground floor'],1,'The directory says: Second floor — Café · Roof terrace.'],
 ['Your teenager asks: “Where are the toilets?” You answer…',["They're on the second floor.","They're downstairs, on the lower ground floor.","They're in the gift shop."],1,'Toilets → lower ground floor (downstairs).'],
 ['On this floor, the cloakroom sign has a ⬅ arrow. So the cloakroom is…',['on your left','upstairs','closed'],0,'⬅ = on your left.'],
 ['“Way out” on a British sign means…',['the exit','a long way','the entrance'],0,'Way out (UK) = Exit = Sortie.'],
 ['What can you do with the QR code?',['Pay for lunch','Listen to a free audio guide','Open the lockers'],1,'Scan the QR code for the audio guide.'],
 ['The galleries are on the first floor. In the US, that would be…',['the first floor','the second floor','the basement'],1,'UK first floor = US second floor.']
],
floor:[
 ['In London, the ground floor is…',['rez-de-chaussée','premier étage','deuxième étage'],0,'UK ground floor = RDC.'],
 ['UK first floor = US…',['first floor','second floor','ground floor'],1,'In the US, the first floor is at street level.'],
 ['What is the correct ordinal for 21?',['21th','21st','21nd'],1,'Twenty-first = 21st.'],
 ['What is the correct ordinal for 12?',['12nd','12st','12th'],2,'11th, 12th, 13th all use -th.'],
 ['What is a natural British request?',['Where are the toilets, please?','Where is the restrooms, please?','Where toilets is?'],0,'“Toilets” is natural in the UK (“loo” is informal).'],
 ['“Go along the corridor” means…',['go through the hallway','go up one floor','go outside'],0,'Corridor = couloir.']
],
food:[
 ['Which request is polite?',['Give four sandwiches.','Could we have four sandwiches, please?','We four sandwich.'],1,'Could we have…, please?'],
 ['Which noun is uncountable here?',['sandwiches','bottles','water'],2,'Water is uncountable (but bottles of water are countable).'],
 ['The British word for the restaurant check is…',['bill','receipt line','fare'],0,'Bill (UK) · check (US).'],
 ['“Does this contain nuts?” asks about…',['price','ingredients / allergies','travel'],1,'Very useful allergy question.'],
 ['Which is correct?',['How much sandwiches?','How many sandwiches?','How many water?'],1,'Count individual sandwiches → how many.'],
 ['A “jacket potato” is…',['a potato baked in its skin','a potato wearing a jacket','chips'],0,'Jacket potato = pomme de terre cuite au four.'],
 ['The staff ask: “Eat in or take away?” They want to know…',['if you will eat here or somewhere else','if you want the bill','if you have a booking'],0,'Eat in = sur place · take away = à emporter.'],
 ['Free drinking water in a UK café is called…',['tap water','sparkling water','squash'],0,'Ask: “Could we have a jug of tap water, please?”']
],
return:[
 ['“Which stop should we get off at?” asks…',['where to leave the bus or train','how much lunch costs','where your hotel room is'],0,'Get off = descendre.'],
 ['Phone battery low: the safest next step is…',['guess a random platform','ask staff for a reliable route','take the first bus'],1,'Ask staff, then check the direction and the stop.'],
 ['Which is a correct negative?',['We not need change.','We don’t need to change.','We doesn’t need change.'],1,'Do not + base verb.'],
 ['It has started to drizzle. Drizzle is…',['very light rain','a thunderstorm','snow'],0,'Drizzle = bruine — annoying but not a disaster!']
],
review:[
 ['A finished action yesterday uses…',['present perfect','past simple','future continuous'],1,'Yesterday → past simple.'],
 ['Choose the correct sentence.',['We have visited it yesterday.','We visited it yesterday.','We has visited it yesterday.'],1,'Never present perfect with “yesterday”.'],
 ['Choose the present perfect.',['We have already seen the exhibition.','We already saw yesterday have.','We have see it.'],0,'Have/has + past participle.'],
 ['Which is correct?',['We waited since two hours.','We waited for two hours.','We waited during two hours.'],1,'For + duration.'],
 ['Which is correct?',['We have been here since 10 a.m.','We have been here for 10 a.m.','We are here since for 10.'],0,'Since + starting point.'],
 ['Choose the adverb.',['The guide explained everything clearly.','The guide explained everything clear.','The guide was clearly.'],0,'Clearly describes HOW the guide explained.'],
 ['“Although” introduces…',['a contrast','a question','a floor number'],0,'Although it rained, we had fun.']
],
home:[
 ['At passport control, you may need to…',['show a valid travel document','show a café menu','show your hotel floor plan'],0,'Follow the border officer’s instructions.'],
 ['Which polite request is suitable?',['Where the platform?','Could you tell me which platform to use?','Platform give.'],1,'Indirect question after “Could you tell me…”.'],
 ['“We checked out at eight.” is…',['past simple','present perfect','present simple'],0,'Checked out = a finished past action.']
]
};
const MUCH_MANY_QUIZ = [
 ['You need four entry tickets. Which question is correct?',['How much tickets do we need?','How many tickets do we need?','How many ticket do we need?'],1,'Tickets are plural countable nouns → how many.'],
 ['You want to know the total admission price.',['How many does it cost?','How much does it cost?','How much tickets it costs?'],1,'For price, ask “How much does it cost?”'],
 ['Choose the natural question.',['How much information do we need?','How many information do we need?','How many informations?'],0,'Information is uncountable in English.'],
 ['The children are hungry. Ask about sandwiches.',['How much sandwiches should we buy?','How many sandwiches should we buy?','How many sandwich should we buy?'],1,'Individual sandwiches are countable.'],
 ['You need drinking water for your family.',['How many water should we bring?','How much water should we bring?','How much bottles should we bring?'],1,'Water is uncountable unless you count bottles.'],
 ['You want to count bottles of water.',['How many bottles of water do we need?','How much bottles of water do we need?','How many water do we need?'],0,'Bottles are countable; water is not.'],
 ['Choose the correct question about waiting.',['How much time do we have?','How many time do we have?','How many times do we have?'],0,'Time (duration) is uncountable. Times (occasions) can be counted.'],
 ['Ask about the number of stops.',['How much stops are there?','How many stops are there?','How many stop is there?'],1,'Stops are countable.'],
 ['Ask about luggage in general.',['How many luggage are we carrying?','How much luggage are we carrying?','How many luggages?'],1,'Luggage is uncountable. Count suitcases or bags instead.'],
 ['Choose the correct negative sentence.',['We do not have many time.','We do not have much time.','We do not have many times.'],1,'Much + uncountable noun in negatives.'],
 ['Choose the natural sentence about the queue.',['There are a lot of people waiting.','There is much people waiting.','There are much people waiting.'],0,'People is plural; “a lot of” sounds natural in positive sentences.'],
 ['Ask about the number of visits (occasions).',['How much times have you visited?','How many times have you visited?','How many time have you visited?'],1,'Times = occasions → countable.'],
 ['At the ticket desk: what does “How much is admission?” mean?',['How many people can come?','What is the entry price?','How long does the visit take?'],1,'How much is…? asks for an amount of money.'],
 ['Choose the natural question about advice.',['How many advice can you give us?','How much advice can you give us?','How many advices can you give us?'],1,'Advice is uncountable. Ask “How many suggestions?” for individual ideas.'],
 ['You want two separate pieces of information.',['Could you give us two pieces of information?','Could you give us two informations?','Could you give us much informations?'],0,'Use “pieces of information” to count.']
];
const MUCH_MANY_ORDERS = [['How','much','is','an','adult','ticket','?'],['How','many','tickets','do','we','need','?'],['How','much','time','have','we','got','?'],['How','many','stops','are','there','?']];
const MUCH_MANY_OPEN = [
 ['At the ticket office · ask three useful questions','Ask the price for your family, the number of tickets required, and whether there are any time slots left.','How much is it for two adults and two teenagers? How many tickets do we need? Are there any time slots left this afternoon?','Could you tell me how much admission would be for two adults and two teenagers? How many separate tickets would we need, and are there any time slots left this afternoon?'],
 ['Family planning · count and measure','Ask about water, bottles of water, time and stops on the journey.','How much water should we bring? How many bottles do we need? How much time have we got? How many stops are there?','Before we leave, could we check how much water to take and how many bottles to pack? Also, how much time do we have before our booking, and how many stops are there on the route?']
];
const ORDERS = {
 weather:[['If','it','rains',',',"we'll",'visit','the','museum','.'],['Since',"it's",'sunny',',',"let's",'have','a','picnic','.'],['The','kids','are','tired',',','so',"let's",'take','it','easy','.'],["What's",'the','weather','going','to','be','like','tomorrow','?']],
 route:[['Could','you','tell','me','how','to','get','to','Greenwich','?'],['Which','line','should','we','take','?'],['Do','we','need','to','change','lines','?']],
 ticket:[['How','much','is','that','altogether','?'],['Is','there','a','family','ticket','?'],['Do','we','have','to','pay','in','advance','?']],
 floor:[['Where','are','the','toilets',',','please','?'],['Take','the','lift','to','the','second','floor','.'],['Go','along','the','corridor','and','turn','left','.']],
 food:[['Could','we','have','a','table','for','four',',','please','?'],['Does','this','cake','contain','nuts','?']],
 return:[['Could','you','tell','us','how','to','get','back','to','Covent','Garden','?'],['Which','stop','should','we','get','off','at','?']],
 review:[['Although','it','was','raining',',','we','really','enjoyed','our','visit','.'],['We','have','already','visited','two','attractions','.']],
 home:[['Could','you','tell','me','where','passport','control','is','?'],['We','need','to','collect','our','luggage','first','.']]
};
const OPEN = {
 recap:[['At the desk · ask for three different recommendations','Speak as a hotel guest. Ask about views, a cultural activity, and a place to eat.','Could you recommend a place with great views? We would also like a cultural activity and somewhere interesting to eat.','What would you suggest for a family with two teenagers? Ideally, we would like a mix of sightseeing, culture and local food — and something indoors in case it rains.']],
 weather:[
  ['Ask the receptionist about tomorrow','Ask about the forecast, the temperature and whether you need an umbrella. Then decide on an activity.',"Excuse me, what's the weather going to be like tomorrow? Is it going to rain? Do we need an umbrella? OK, if it rains, we'll go to the Natural History Museum.","Good evening. Do you happen to know what the forecast is for tomorrow? We were hoping to go up the London Eye, but if it's going to be foggy, we might visit Tate Modern instead and save the views for later in the week."],
  ['Convince your teenagers to change the plan','It is going to pour with rain and the teenagers want to go to the park. Explain why you should change, suggest an alternative and promise the park another day.',"It's going to pour with rain today, so let's go to the Science Museum. We can go to Hyde Park on Friday because it's going to be sunny.","I know you were looking forward to the park, but since it's going to pour all afternoon, why don't we visit the Science Museum instead? The forecast says Friday will be gloriously sunny, so let's save the picnic and the pedalos for then."]
 ],
 plan:[['Present your two-week plan','Explain at least four days: the weather, the activity and why. Use since / as / so / if / because. Mention one change because the children are tired.',"On Monday it's going to rain, so we're going to visit the Natural History Museum. On Tuesday it's going to be sunny, so we're going to go up the London Eye. On Wednesday the kids are tired, so we're going to take it easy in Covent Garden.","We've planned our fortnight around the weather. Since Monday looks wet, we'll start indoors at the Natural History Museum. As Tuesday is going to be clear, we've kept the London Eye for that day. After two busy days, the teenagers will probably be worn out, so on Wednesday we'll have a lie-in and a relaxed afternoon in Covent Garden. If the forecast changes, we'll simply swap days."]],
 route:[['Ask a stranger for help','You are near your hotel and need to reach your chosen destination. Ask about transport, changes and walking directions.','Excuse me, could you tell me how to get to the attraction? Which line should we take?','Excuse me, we’re heading to the attraction with two teenagers. What would be the most convenient route, and will we need to change?']],
 price:[['Discuss and decide · which ticket?','Compare the options on the board. Which ticket would you choose for your family, and why? Use: cheaper / more expensive / better value / included / I’d rather…','I think normal tickets are better value. They cost £66 for the four of us. The afternoon tea is more expensive, but the food is included.','Although the afternoon tea sounds fun, it costs £100 more than standard tickets, so I’d rather buy normal entry and have a picnic in Greenwich Park. Since the National Maritime Museum is free, we could visit it in the afternoon too.']],
 ticket:[['Ticket office · two different situations','A: You have a reservation and must show the QR code. B: You have no ticket and want to know availability and the total price.','Hello, we have a booking for four. Here is the confirmation. / Hello, are there any tickets left for today?','Good morning. We booked a timed entry for two adults and two teenagers. Could you scan this QR code? / We haven’t booked; would you mind checking the next available slot and the total price?']],
 floor:[['Inside the attraction · ask for facilities','Ask for the toilets, the lift, the café and the correct floor; then explain the route to your family.','Excuse me, where are the toilets? Is there a lift to the second floor?','Would you mind telling us where the lift is? And is the café on the second floor? OK kids, the toilets are downstairs, then we’ll take the lift up to the café.']],
 food:[['A family lunch order','Order four items, ask about ingredients, say if you will eat in, and ask for the bill.','Could we have two toasties, two jacket potatoes and four drinks, please? Does the carrot cake contain nuts? We’d like to eat in.','We’d like to order for four, please — to eat in. Could you recommend something vegetarian? One of our children is allergic to nuts, so could you check the ingredients of the cakes? Could we have the bill when we’ve finished?']],
 return:[['Navigate back when your phone battery is low','Ask a member of staff for the best route back to your hotel and repeat the instructions clearly.','Excuse me, how do we get back to Covent Garden? Which stop should we use?','I’m sorry to bother you. Our phone battery is almost flat. Could you explain the easiest route back to Covent Garden, including any changes?']],
 review:[['Write an authentic visitor review','Choose a rating. Write 90–130 words: the place, the weather, access, tickets, atmosphere, highlights, difficulties and whether you recommend it.','We visited this attraction yesterday with our family. It was raining, but we were inside. The staff were friendly and the visit was interesting. However, it was crowded. Overall, I would recommend it.','We spent an enjoyable rainy afternoon exploring this attraction. Although the queue was longer than expected, the staff handled the crowds efficiently. The exhibitions were presented clearly, and our teenagers especially enjoyed the interactive features. We would happily recommend it to other families — ideally booked in advance.']],
 home:[['At the departure point','Explain your journey, request help with documents or luggage, and respond to a delay.','Hello, we are travelling to France today. Where do we check in? We have four passports and three bags.','Good morning. We are returning to France with our two teenagers. Could you confirm where we need to complete document checks, and what we should do if our service is delayed?']],
 final:[['Your London day · complete spoken narrative','Describe your day from hotel reception to the evening return. Write 130–180 words or speak for two minutes. Include the weather, directions, tickets, facilities, lunch, and a past simple + present perfect contrast.','We left the hotel in the morning. It was cloudy, so we visited a museum. We took the Tube, bought our tickets and had lunch in the café. We have already seen so many interesting places in London.','After breakfast, we checked the forecast: showers in the morning and sunny spells later. Since it was raining, we started indoors and took the DLR to Greenwich. At the ticket desk, we asked about prices — our sixteen-year-old had to pay the adult price! We followed the signs to the café on the second floor and had a lovely lunch. Although we were worn out by the evening, we have already discovered much more of London than we expected.']]
};

/* ---------- 5. DATA · GAMES ---------- */
const MATCHES = {
 match_weather:{pairs:[['☀️','sunny'],['🌧️','rainy'],['💨','windy'],['🌫️','foggy'],['⛈️','stormy'],['🌤️','sunny spells'],['☁️','cloudy'],['🥶','freezing']],left:'Sky',right:'Word',big:true},
 match_signs:{pairs:[["“I need the loo!”",'🚻 Toilets · Lower ground floor'],["“Let's leave our coats.”",'🧥 Cloakroom · ⬅ on your left'],["“I'd love a hot chocolate.”",'☕ Café · Second floor'],["“My bag is too heavy.”",'🔒 Lockers · Lower ground floor'],["“The kids want souvenirs.”",'🛍️ Gift shop · ➡ on your right'],["“We want to see the galleries.”",'🖼️ Galleries 4–7 · First floor'],["“Let's eat our sandwiches.”",'🧺 Picnic area · Lower ground floor'],["“We need to leave now.”",'🚪 Way out · ⬆ straight ahead']],left:'What your family says',right:'The sign you follow'},
 match_ukus:{pairs:[['🇬🇧 lift','🇺🇸 elevator'],['🇬🇧 toilets','🇺🇸 restroom'],['🇬🇧 queue','🇺🇸 line'],['🇬🇧 way out','🇺🇸 exit'],['🇬🇧 ground floor','🇺🇸 first floor'],['🇬🇧 bill','🇺🇸 check'],['🇬🇧 takeaway','🇺🇸 takeout'],['🇬🇧 mobile phone','🇺🇸 cell phone']],left:'British English',right:'American English'}
};
const MAP_BUILDINGS = [
 {id:'pharmacy',label:'Pharmacy',icon:'💊',x:110,y:300,w:65,h:75},{id:'bank',label:'Bank',icon:'🏦',x:110,y:225,w:65,h:65},{id:'post',label:'Post office',icon:'📮',x:20,y:225,w:80,h:65},
 {id:'bakery',label:'Bakery',icon:'🥐',x:225,y:300,w:75,h:75},{id:'cafe',label:'Café',icon:'☕',x:225,y:225,w:80,h:65},{id:'museum',label:'Museum',icon:'🏛️',x:315,y:225,w:80,h:65},
 {id:'cinema',label:'Cinema',icon:'🎬',x:20,y:110,w:80,h:65},{id:'bookshop',label:'Bookshop',icon:'📚',x:110,y:110,w:65,h:65},{id:'tube',label:'Tube',icon:'🚇',x:225,y:110,w:80,h:65},
 {id:'restaurant',label:'Restaurant',icon:'🍝',x:315,y:110,w:80,h:65},{id:'hotel',label:'Hotel',icon:'🏨',x:225,y:15,w:80,h:85},{id:'park',label:'Park',icon:'🌳',x:445,y:15,w:150,h:160},
 {id:'supermarket',label:'Supermarket',icon:'🛒',x:445,y:225,w:95,h:65}
];
const MAP_MISSIONS = [
 ['Go straight on. Go past the pharmacy. It’s on your left, on the corner of the High Street.','bank'],
 ['Go straight on. It’s on your right, opposite the pharmacy.','bakery'],
 ['Go straight on and cross the High Street at the pedestrian crossing. It’s on your right, on the corner.','tube'],
 ['Go straight on to the junction and turn right into the High Street. Go past the café. It’s on your right, on the corner of Park Lane.','museum'],
 ['Go to the junction and turn left into the High Street. It’s the second building on your right.','cinema'],
 ['Cross the High Street and keep going. It’s on your right, at the end of Station Road, after the Tube station.','hotel'],
 ['Go to the junction and turn right into the High Street. Go straight on past Park Lane. It’s on your left.','park'],
 ['Go to the junction and turn right into the High Street. It’s on your left, opposite the museum.','restaurant']
];
const CUTTY = {adult:22, child:11, student:16.5, teaAdult:47, teaChild:36, teaStudent:41.5};
const CUTTY_DESK = [
 ['Staff','Good morning! Welcome to Cutty Sark. Have you booked?'],
 ['You',"No, we haven't. Have you got any tickets left for this morning?"],
 ['Staff',"Yes, we've got space at eleven o'clock. How many of you are there?"],
 ['You','There are four of us — two adults and two teenagers. Is there a family ticket?'],
 ['Staff',"Not for the ship, I'm afraid, but children's tickets are half price. How old are the teenagers?"],
 ['You','Thirteen and sixteen.'],
 ['Staff','OK, so the sixteen-year-old pays the adult price. That’s three adults at twenty-two pounds and one child at eleven pounds.'],
 ['You','So how much is that altogether?'],
 ['Staff','Seventy-seven pounds, please. The audio guide is included.'],
 ['You','Great. Can I pay contactless?'],
 ['Staff','Of course. Here are your tickets. Enjoy your visit — just follow the signs to the entrance.']
];
const MENU = [
 {id:'toastie',cat:'main',icon:'🧀',name:'Cheese & tomato toastie',sg:'cheese and tomato toastie',pl:'cheese and tomato toasties',price:6.5,tags:['V']},
 {id:'jacket',cat:'main',icon:'🥔',name:'Jacket potato with beans',sg:'jacket potato with beans',pl:'jacket potatoes with beans',price:7,tags:['V']},
 {id:'fishfinger',cat:'main',icon:'🐟',name:'Fish finger sandwich',sg:'fish finger sandwich',pl:'fish finger sandwiches',price:8.5,tags:[]},
 {id:'club',cat:'main',icon:'🥪',name:'Chicken & bacon club sandwich',sg:'chicken and bacon club sandwich',pl:'chicken and bacon club sandwiches',price:8.95,tags:[]},
 {id:'soup',cat:'main',icon:'🍲',name:'Soup of the day with bread',sg:'bowl of soup',pl:'bowls of soup',price:6,tags:['V','VG']},
 {id:'sausage',cat:'main',icon:'🥐',name:'Sausage roll',sg:'sausage roll',pl:'sausage rolls',price:3.95,tags:[]},
 {id:'scone',cat:'sweet',icon:'🫖',name:'Scone with jam & clotted cream',sg:'scone with jam and cream',pl:'scones with jam and cream',price:4.25,tags:['V']},
 {id:'carrot',cat:'sweet',icon:'🥕',name:'Carrot cake (contains walnuts)',sg:'slice of carrot cake',pl:'slices of carrot cake',price:3.8,tags:['V','N']},
 {id:'brownie',cat:'sweet',icon:'🍫',name:'Chocolate brownie',sg:'chocolate brownie',pl:'chocolate brownies',price:3.5,tags:['V']},
 {id:'fruit',cat:'sweet',icon:'🍓',name:'Fruit pot',sg:'fruit pot',pl:'fruit pots',price:2.95,tags:['V','VG']},
 {id:'tea',cat:'drink',icon:'🍵',name:'Pot of tea',sg:'pot of tea',pl:'pots of tea',price:2.8,tags:[]},
 {id:'hotchoc',cat:'drink',icon:'☕',name:'Hot chocolate',sg:'hot chocolate',pl:'hot chocolates',price:3.6,tags:[]},
 {id:'oj',cat:'drink',icon:'🧃',name:'Orange juice',sg:'orange juice',pl:'orange juices',price:2.5,tags:[]},
 {id:'sparkling',cat:'drink',icon:'🫧',name:'Sparkling water',sg:'bottle of sparkling water',pl:'bottles of sparkling water',price:1.9,tags:[]},
 {id:'tap',cat:'drink',icon:'🚰',name:'Jug of tap water',sg:'jug of tap water',pl:'jugs of tap water',price:0,tags:[]}
];
const CAFE_BUDGET = 45;

/* ---------- 6. FORECAST MODEL (simulation) ---------- */
const WX = {
 sunny:{icon:'☀️',label:'Sunny',say:"it's going to be sunny"},
 spells:{icon:'🌤️',label:'Sunny spells',say:'there will be sunny spells'},
 cloudy:{icon:'☁️',label:'Cloudy',say:"it's going to be cloudy"},
 showers:{icon:'🌦️',label:'Showers',say:'there might be some showers',showery:true},
 rain:{icon:'🌧️',label:'Rain',say:"it's going to rain",wet:true},
 storm:{icon:'⛈️',label:'Thunderstorms',say:'there are going to be thunderstorms',wet:true},
 windy:{icon:'💨',label:'Windy',say:"it's going to be windy"},
 fog:{icon:'🌫️',label:'Foggy',say:"it's going to be foggy"}
};
const HIGHS = [8,9,12,15,18,21,23,23,20,16,11,8];
const SEASON_WEIGHTS = {
 winter:{sunny:8,spells:17,cloudy:24,showers:17,rain:17,windy:9,fog:8,storm:0},
 mid:{sunny:15,spells:25,cloudy:19,showers:18,rain:12,windy:6,fog:4,storm:1},
 summer:{sunny:34,spells:25,cloudy:15,showers:10,rain:7,windy:3,fog:0,storm:6}
};

/* ---------- 7. STATE & UTILITIES ---------- */
let state;
const $ = id => document.getElementById(id);
const escapeHtml = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const REG = {};          // number of scored items per prefix (for stamps)
let pick = null;         // tap-to-place selection (planner + match games)

function defaults(){return {fields:{},results:{},orders:{},openChecks:{},matches:{},wishlist:[],planner:{start:'',seed:1,slots:{},tired:{},wx:{},twists:[]},cafe:{},stamps:{},updated:Date.now(),version:3};}
try{
 state = Object.assign(defaults(), JSON.parse(localStorage.getItem(KEY) || '{}'));
 for (const k of ['fields','results','orders','openChecks','matches','cafe','stamps']) state[k] ??= {};
 state.wishlist ??= [];
 state.planner = Object.assign(defaults().planner, state.planner || {});
}catch(e){state = defaults();}

function save(){state.updated = Date.now();try{localStorage.setItem(KEY, JSON.stringify(state));}catch(e){toast('Storage full or unavailable — save your progress file.');}updateScore();}
function toast(message){document.querySelector('.toast')?.remove();const el=document.createElement('div');el.className='toast';el.textContent=message;document.body.append(el);setTimeout(()=>el.remove(),3400);}
function hash(str){let h=2166136261;for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
function rng(seed){let a=seed>>>0;return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function shuffleIdx(n, key){const r=rng(hash(key));const idx=[...Array(n).keys()];for(let i=n-1;i>0;i--){const j=Math.floor(r()*(i+1));[idx[i],idx[j]]=[idx[j],idx[i]];}return idx;}
const isExam = () => $('mode')?.value === 'exam';
const money = n => n % 1 === 0 ? '£' + n : '£' + n.toFixed(2);
function burst(el){if(!el)return;const r=el.getBoundingClientRect();for(let i=0;i<14;i++){const s=document.createElement('span');s.className='confetti';s.textContent=['🎉','⭐','✨','🇬🇧','💂'][i%5];s.style.left=(r.left+r.width/2)+'px';s.style.top=(r.top+20)+'px';s.style.setProperty('--dx',(Math.random()*240-120)+'px');s.style.setProperty('--dy',(-Math.random()*160-40)+'px');document.body.append(s);setTimeout(()=>s.remove(),1100);}}

/* Speech: British/American voice, no French voice on iOS */
let VOICES = [];
function loadVoices(){VOICES = window.speechSynthesis ? speechSynthesis.getVoices() : [];}
if ('speechSynthesis' in window){loadVoices(); speechSynthesis.onvoiceschanged = loadVoices;}
function listen(text){
 if(!('speechSynthesis' in window)){toast('Speech is not available in this browser.');return;}
 const clean = String(text).replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}]/gu,'').replace(/·/g,',').trim();
 speechSynthesis.cancel();
 const u = new SpeechSynthesisUtterance(clean);
 const lang = ($('accent')?.value || 'en-GB');
 u.lang = lang; u.rate = .88;
 const norm = v => v.lang.replace('_','-').toLowerCase();
 const v = VOICES.find(v => norm(v) === lang.toLowerCase()) || VOICES.find(v => norm(v).startsWith('en'));
 if (v) u.voice = v;
 speechSynthesis.speak(u);
}
function sayBtn(text, label='▶'){return `<button type="button" class="say" data-say="${escapeHtml(text)}" aria-label="Listen">${label}</button>`;}

/* ---------- 8. DATES ---------- */
function parseDate(s){const [y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d);}
function iso(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
function nextSaturday(){const d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()+((6-d.getDay()+7)%7||7));return iso(d);}
function dayDate(i){const d=parseDate(state.planner.start);d.setDate(d.getDate()+i);return d;}
const WD=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MO=['January','February','March','April','May','June','July','August','September','October','November','December'];
function ordinal(n){const s=['th','st','nd','rd'],v=n%100;return n+(s[(v-20)%10]||s[v]||s[0]);}
const shortDate = i => {const d=dayDate(i);return `${WD[d.getDay()].slice(0,3)} ${d.getDate()} ${MO[d.getMonth()].slice(0,3)}`;};
const longDate = i => {const d=dayDate(i);return `${WD[d.getDay()]} the ${ordinal(d.getDate())} of ${MO[d.getMonth()]}`;};
const weekday = i => WD[dayDate(i).getDay()];

/* ---------- 9. GENERIC EXERCISES ---------- */
function question(container, prefix, entries, opts={}){
 const box=$(container); if(!box) return; REG[prefix]=entries.length;
 box.innerHTML = entries.map((q,i)=>{
  const id=prefix+'_'+i, r=state.results[id], sel=r?.selected, order=shuffleIdx(q[1].length,id);
  let fb='';
  if(sel!==undefined) fb = r.correct ? `✓ Correct! ${q[3]||''}` : (isExam() ? '✗ Not quite — try again.' : `✗ Not quite — try again. 💡 ${q[3]||''}`);
  const parts = String(q[0]).split('|');
  const head = parts.length>1 ? `<div class="scenario-card">${escapeHtml(parts[0])}</div><h4>${escapeHtml(parts[1])}</h4>` : `<h4>${escapeHtml(q[0])}</h4>`;
  return `<div class="exercise ${r?.correct?'done':''}" data-question="${id}"><span class="tasklabel">${opts.label||'CHECKPOINT'} ${i+1}</span>${head}
   <div class="answers">${order.map(j=>`<button data-answer="${j}" class="${sel===j?(r.correct?'correct':'incorrect'):''}" aria-pressed="${sel===j}" type="button">${escapeHtml(q[1][j])}</button>`).join('')}</div>
   <div class="feedback ${sel===undefined?'':r.correct?'ok':'no'}">${escapeHtml(fb)}</div></div>`;
 }).join('');
 box.querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>{
  const card=b.closest('[data-question]'), id=card.dataset.question, i=+id.split('_').pop(), q=entries[i], selected=+b.dataset.answer, ok=selected===q[2];
  state.results[id]={selected,correct:ok,time:Date.now()}; save(); question(container,prefix,entries,opts);
  if(ok) burst(box.querySelector(`[data-question="${id}"]`));
 });
}

function orders(container, prefix, arr){
 const box=$(container); if(!box) return;
 const tidy = s => s.replace(/\s+([?.!,])/g,'$1');
 box.innerHTML = arr.map((words,i)=>{
  const id=prefix+'_'+i, st=state.orders[id]||{}, chosen=st.indices||[];
  const order=shuffleIdx(words.length,'ord'+id).filter(j=>!chosen.includes(j));
  const fb = st.correct ? '✓ Perfect sentence!' : (st.attempted && st.wrong ? '✗ Not yet — check the word order and try again.' : '');
  return `<div class="exercise ${st.correct?'done':''}" data-order="${id}"><span class="tasklabel">WORD ORDER ${i+1}</span><h4>Build the sentence. Tap a word to add it; tap it again to send it back.</h4>
   <div class="sentence">${chosen.map(j=>`<button type="button" data-remove="${j}">${escapeHtml(words[j])}</button>`).join('')||'<small>Your words appear here.</small>'}</div>
   <div class="wordbank">${order.map(j=>`<button type="button" data-add="${j}">${escapeHtml(words[j])}</button>`).join('')}</div>
   <div class="actions"><button type="button" data-check>Check</button><button class="secondary" type="button" data-clear>Clear</button><button class="secondary hint-btn" type="button" data-hint>Hint</button><button class="secondary" type="button" data-model>Show answer</button>${sayBtn(tidy(words.join(' ')),'▶ Listen')}</div>
   <div class="feedback ${st.correct?'ok':fb?'no':''}">${fb}</div><div class="model">${escapeHtml(tidy(words.join(' ')))}</div></div>`;
 }).join('');
 box.querySelectorAll('[data-order]').forEach(card=>{
  const id=card.dataset.order, words=arr[+id.split('_').pop()];
  const set = (indices, checked=false) => {
   const correct = indices.length===words.length && indices.every((j,k)=>words[j]===words[k]);
   const prev = state.orders[id]||{};
   state.orders[id] = {indices, correct: checked ? correct : (prev.correct && correct), attempted: checked||prev.attempted||false, wrong: checked && !correct};
   save(); orders(container,prefix,arr);
   if(checked && correct) burst(box.querySelector(`[data-order="${id}"]`));
  };
  card.querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>set([...(state.orders[id]?.indices||[]),+b.dataset.add]));
  card.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>set((state.orders[id]?.indices||[]).filter(j=>j!==+b.dataset.remove)));
  card.querySelector('[data-check]').onclick=()=>set(state.orders[id]?.indices||[],true);
  card.querySelector('[data-clear]').onclick=()=>set([]);
  card.querySelector('[data-hint]').onclick=()=>{card.querySelector('.feedback').textContent=`Hint: start with “${words.slice(0,2).join(' ')}…”`;};
  card.querySelector('[data-model]').onclick=()=>card.querySelector('.model').classList.toggle('visible');
 });
}

function openTasks(container, prefix, arr){
 const box=$(container); if(!box) return;
 box.innerHTML = arr.map((o,i)=>{const id=prefix+'_'+i;return `<div class="exercise open-task"><span class="tasklabel">🎤 SPEAK / WRITE · ${i+1}</span><h4>${escapeHtml(o[0])}</h4><p>${escapeHtml(o[1])}</p>
  <div class="french-note">Parlez à la première personne (« I / we »). Une question polie → un détail → une raison → merci.</div>
  <textarea data-open="${id}" placeholder="Write your answer or speaking notes here…">${escapeHtml(state.fields['open_'+id]||'')}</textarea>
  <div class="actions"><button type="button" data-review>Check my answer</button><button type="button" data-hintopen class="secondary hint-btn">Hint</button><button type="button" data-modelopen class="secondary">Show models</button><button type="button" data-listenmodel class="secondary">▶ Listen to a model</button></div>
  <div class="feedback">${escapeHtml(state.openChecks[id]?.text||'')}</div>
  <div class="model"><b>Clear · A2/B1</b><p>${escapeHtml(o[2])}</p>${sayBtn(o[2],'▶ Listen')}<hr><b>Stretch · B1+</b><p>${escapeHtml(o[3])}</p>${sayBtn(o[3],'▶ Listen')}</div></div>`;}).join('');
 box.querySelectorAll('.open-task').forEach((card,i)=>{
  const id=prefix+'_'+i, t=card.querySelector('textarea');
  t.addEventListener('input',()=>{state.fields['open_'+id]=t.value;save();});
  card.querySelector('[data-review]').onclick=()=>{const n=t.value.trim().split(/\s+/).filter(Boolean).length;const msg=n<8?'Keep going: add a polite question and a detail.':n<25?'Good start! Add a reason (because / since / so) or a follow-up question.':'Great, detailed answer! Compare it with the models — your trainer will give feedback.';state.openChecks[id]={text:msg,words:n,attempted:true};save();card.querySelector('.feedback').textContent=msg;};
  card.querySelector('[data-hintopen]').onclick=()=>{card.querySelector('.feedback').textContent='Try: polite question → detail → reason → thank you.';};
  card.querySelector('[data-modelopen]').onclick=()=>card.querySelector('.model').classList.toggle('visible');
  card.querySelector('[data-listenmodel]').onclick=()=>listen(arr[i][2]);
 });
}

function phraseLists(){
 document.querySelectorAll('[data-phrases]').forEach(el=>{
  el.innerHTML = PHRASES[el.dataset.phrases].map(([en,fr])=>`<button type="button" class="phrase" data-say="${escapeHtml(en)}"><span>▶ ${escapeHtml(en)}</span><small class="fr-inline">${escapeHtml(fr)}</small></button>`).join('');
 });
}
function dialogue(container, lines){
 const box=$(container); if(!box) return;
 box.innerHTML = lines.map(([who,txt])=>`<div class="line ${who==='You'?'me':''}"><b>${escapeHtml(who)}</b><span>${escapeHtml(txt)}</span>${sayBtn(txt)}</div>`).join('') + `<div class="taskactions">${sayBtn(lines.map(l=>l[1]).join(' '),'▶ Listen to the whole dialogue')}</div>`;
}

/* ---------- 10. MATCH GAME (drag or tap) ---------- */
function matchGame(id){
 const box=$(id==='match_weather'?'weatherMatch':id==='match_signs'?'signMatch':'ukusMatch'); if(!box) return;
 const cfg=MATCHES[id], pairs=cfg.pairs; REG[id]=1;
 const st = state.matches[id] ||= {placed:{}, checked:false};
 const placedR = Object.values(st.placed).map(Number);
 const bank = shuffleIdx(pairs.length,id).filter(r=>!placedR.includes(r));
 const res = state.results[id];
 box.innerHTML = `<div class="match ${cfg.big?'big':''}" data-match="${id}">
  <div class="match-bank" data-bank>${bank.map(r=>`<button type="button" class="chip ${pick?.match===id&&pick.r===r?'picked':''}" draggable="true" data-r="${r}">${escapeHtml(pairs[r][1])}</button>`).join('')||'<small>All placed! Press Check.</small>'}</div>
  <div class="match-head"><span>${escapeHtml(cfg.left)}</span><span>${escapeHtml(cfg.right)}</span></div>
  ${pairs.map((p,l)=>{const r=st.placed[l];const cls=st.checked&&r!==undefined?(+r===l?'ok':'no'):'';return `<div class="match-row"><div class="match-left">${escapeHtml(p[0])}</div><div class="drop ${cls}" data-l="${l}">${r!==undefined?`<button type="button" class="chip placed" draggable="true" data-r="${r}" data-from="${l}">${escapeHtml(pairs[r][1])}</button>`:'<small>drop here</small>'}</div></div>`;}).join('')}
  <div class="actions"><button type="button" data-mcheck>Check</button><button type="button" class="secondary" data-mreset>Start again</button><button type="button" class="secondary hint-btn" data-msolve>Show answers</button></div>
  <div class="feedback ${res?.correct?'ok':res?'no':''}">${res?(res.correct?'✓ All correct — brilliant!':`✗ ${res.score}/${pairs.length} correct — move the red ones.`):'Drag a card onto the right line — or tap a card, then tap a line.'}</div></div>`;
 const root=box.querySelector('[data-match]');
 const place=(r,l)=>{for(const k in st.placed) if(+st.placed[k]===r) delete st.placed[k]; st.placed[l]=r; st.checked=false; pick=null; save(); matchGame(id);};
 root.querySelectorAll('.chip').forEach(c=>{
  c.ondragstart=e=>{e.dataTransfer.setData('text/plain',JSON.stringify({match:id,r:+c.dataset.r}));};
  c.onclick=e=>{e.stopPropagation();
   if(c.dataset.from!==undefined && !(pick?.match===id)){delete st.placed[c.dataset.from]; st.checked=false; save(); matchGame(id); return;}
   if(c.dataset.from!==undefined && pick?.match===id){place(pick.r,+c.dataset.from);return;}
   pick = (pick?.match===id && pick.r===+c.dataset.r) ? null : {match:id,r:+c.dataset.r}; matchGame(id);};
 });
 root.querySelectorAll('.drop').forEach(d=>{
  d.ondragover=e=>{e.preventDefault();d.classList.add('over');};
  d.ondragleave=()=>d.classList.remove('over');
  d.ondrop=e=>{e.preventDefault();try{const p=JSON.parse(e.dataTransfer.getData('text/plain'));if(p.match===id) place(p.r,+d.dataset.l);}catch(_){}};
  d.onclick=()=>{if(pick?.match===id) place(pick.r,+d.dataset.l);};
 });
 const bankEl=root.querySelector('[data-bank]');
 bankEl.ondragover=e=>e.preventDefault();
 bankEl.ondrop=e=>{e.preventDefault();try{const p=JSON.parse(e.dataTransfer.getData('text/plain'));if(p.match===id){for(const k in st.placed) if(+st.placed[k]===p.r) delete st.placed[k]; save(); matchGame(id);}}catch(_){}};
 root.querySelector('[data-mcheck]').onclick=()=>{let score=0;pairs.forEach((_,l)=>{if(+st.placed[l]===l)score++;});st.checked=true;state.results[id]={selected:1,correct:score===pairs.length,score,time:Date.now()};save();matchGame(id);if(score===pairs.length)burst(box);};
 root.querySelector('[data-mreset]').onclick=()=>{state.matches[id]={placed:{},checked:false};delete state.results[id];pick=null;save();matchGame(id);};
 root.querySelector('[data-msolve]').onclick=()=>{const solved={};pairs.forEach((_,l)=>solved[l]=l);state.matches[id]={placed:solved,checked:true};save();matchGame(id);toast('Answers shown — press “Start again” to try it yourself.');};
}

/* ---------- 11. ATTRACTIONS, WISHLIST & MAP ---------- */
function energyDots(n){return n===0?'⚡ none':'⚡'.repeat(n);}
function renderAttractions(){
 const opts = ATTRACTIONS.map(a=>`<option value="${a.id}">${escapeHtml(a.name)}</option>`).join('');
 $('destination').innerHTML=opts; $('secondDestination').innerHTML=opts; $('reviewPlace').innerHTML=opts;
 $('attractionCards').innerHTML = ATTRACTIONS.map(a=>{const inList=state.wishlist.includes(a.id);return `<article class="attraction ${inList?'in-list':''}">
  <div class="photo"><img loading="lazy" src="${a.photo}" alt="Photograph of ${escapeHtml(a.name)}" onerror="this.style.display='none';this.nextElementSibling.hidden=false"><div class="image-unavailable" hidden>Photograph unavailable · <a href="${a.photoPage||a.link}" target="_blank" rel="noopener">View photo / official site ↗</a></div><span class="area-badge">📍 ${escapeHtml(a.area)}</span>${a.closed?'<span class="closed-badge">🚧 Temporarily closed</span>':''}</div>
  <div class="inside"><small>${escapeHtml(a.kind)}</small><h3>${a.icon} ${escapeHtml(a.name)}</h3><p>${escapeHtml(a.desc.slice(0,170))}…</p><div class="tags"><span>${WXTAG[a.wx]}</span><span>${energyDots(a.energy)}</span></div></div>
  <div class="actions"><button type="button" data-choose="${a.id}" class="${inList?'is-picked':''}">${inList?'✓ In my list':'＋ Add to my list'}</button><button type="button" class="secondary" data-map="${a.id}">📍 Map</button><a class="buttonlink secondary" href="${a.link}" target="_blank" rel="noopener">Website ↗</a><button class="secondary" type="button" data-read="${a.id}">Read more</button></div></article>`;}).join('');
 $('readings').innerHTML = ATTRACTIONS.map(a=>`<article class="reading" id="read-${a.id}" hidden><h3>${a.icon} ${escapeHtml(a.name)} · Read &amp; understand</h3><p>${escapeHtml(a.desc)}</p><p><b>Where is it?</b> ${escapeHtml(a.where)}</p><ul>${a.facts.map(f=>`<li>${escapeHtml(f)}</li>`).join('')}</ul><p class="french-note">${escapeHtml(a.fr)}</p>${sayBtn(a.desc+' '+a.where,'▶ Listen to the reading')} <button type="button" class="secondary" data-map="${a.id}">📍 Map</button> <a href="${a.link}" target="_blank" rel="noopener" class="small-link">Official visitor information ↗</a></article>`).join('');
 document.querySelectorAll('[data-choose]').forEach(b=>b.onclick=()=>toggleWish(b.dataset.choose));
 document.querySelectorAll('[data-map]').forEach(b=>b.onclick=()=>openMap(b.dataset.map));
 document.querySelectorAll('[data-read]').forEach(b=>b.onclick=()=>{const el=$('read-'+b.dataset.read);el.hidden=!el.hidden;if(!el.hidden)el.scrollIntoView({behavior:'smooth',block:'nearest'});});
 Q.reading = ATTRACTIONS.map(a=>[`${a.icon} ${a.name} · ${a.question}`,a.options,a.answer,a.facts.join(' ')]);
 question('readingQuestions','reading',Q.reading);
 renderWishlist();
}
function toggleWish(id){
 const a=ACTS[id], i=state.wishlist.indexOf(id);
 if(i>=0){state.wishlist.splice(i,1);toast(`${a.name} removed from your list.`);}
 else{state.wishlist.push(id);toast(`${a.icon} ${a.name} added! Plan it in your calendar (Section 04).`);
  if(state.wishlist.length===1){$('destination').value=id;state.fields.destination=id;updateChoice();}}
 save(); renderAttractions(); renderBank();
}
function renderWishlist(){
 const box=$('wishlist'); if(!box) return;
 box.innerHTML = state.wishlist.length ? `<b>🗺️ My London list (${state.wishlist.length})</b> ${state.wishlist.map(id=>`<span class="wish">${ACTS[id].icon} ${escapeHtml(ACTS[id].name)} <button type="button" data-unwish="${id}" aria-label="Remove">✕</button></span>`).join('')} <a href="#planner" class="small-link">→ Plan them in the calendar</a>` : '<b>🗺️ My London list</b> <span class="small">is empty — press “＋ Add to my list” on the places you like.</span>';
 box.querySelectorAll('[data-unwish]').forEach(b=>b.onclick=()=>toggleWish(b.dataset.unwish));
}
function openMap(id){
 const a=ACTS[id], dlg=$('mapDialog');
 $('mapTitle').textContent=`${a.icon} ${a.name}`; $('mapArea').textContent='📍 '+a.area;
 $('mapFrame').src=`https://maps.google.com/maps?q=${encodeURIComponent(a.q)}&z=14&output=embed`;
 $('mapOpen').href=`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(a.q)}`;
 $('mapRoute').href=`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(HOTEL)}&destination=${encodeURIComponent(a.q)}&travelmode=transit`;
 $('mapSay').innerHTML=`<b>Where is it?</b> ${escapeHtml(a.where)}`;
 $('mapListen').onclick=()=>listen(`Where is ${a.name}? ${a.where}`);
 if(dlg.showModal) dlg.showModal(); else window.open($('mapOpen').href,'_blank');
}
function updateChoice(){
 const a=ATTRACTIONS.find(x=>x.id===$('destination').value)||ATTRACTIONS[0];
 $('routeInfo').innerHTML=`<p><b>Destination:</b> ${a.icon} ${escapeHtml(a.name)} · ${escapeHtml(a.area)}. <b>Start:</b> The Resident Covent Garden.</p><p>Ask: <i>“What's the easiest way to get to ${escapeHtml(a.name)} from here?”</i> ${sayBtn(`Excuse me, what's the easiest way to get to ${a.name} from here?`)}</p><p>Modes to investigate: <b>walking, bus, Underground${['cutty','observatory'].includes(a.id)?', DLR or River Bus':''}</b>. Use the live map to choose a real route.</p>`;
 $('mapsOut').href=`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(HOTEL)}&destination=${encodeURIComponent(a.q)}&travelmode=transit`;
 renderTicketScenario(); renderInsideScenario(); updateReviewSelect();
}
function updateReviewSelect(){const cur=state.fields.reviewPlace||$('destination').value;$('reviewPlace').value=ATTRACTIONS.some(a=>a.id===cur)?cur:'eye';}

/* ---------- 12. WEATHER SECTION ---------- */
function renderWeatherWords(){
 $('weatherWords').innerHTML = WEATHER_WORDS.map(([ic,w,fr,ex])=>`<button type="button" class="wx-tile" data-say="${escapeHtml(w+'. '+ex)}"><span class="wx-ic">${ic}</span><b>${escapeHtml(w)}</b><small class="fr-inline">${escapeHtml(fr)}</small><em>${escapeHtml(ex)}</em></button>`).join('');
}

/* ---------- 13. PLANNER ---------- */
function weightedPick(weights, r){const tot=Object.values(weights).reduce((a,b)=>a+b,0);let x=r()*tot;for(const [k,w] of Object.entries(weights)){if((x-=w)<0)return k;}return 'cloudy';}
let FC_CACHE={key:'',days:[]};
function baseForecast(){
 const p=state.planner, key=p.start+'|'+p.seed;
 if(FC_CACHE.key===key) return FC_CACHE.days;
 const r=rng(hash(key)); const days=[];
 for(let i=0;i<14;i++){
  const m=dayDate(i).getMonth(), season=[11,0,1].includes(m)?'winter':[5,6,7].includes(m)?'summer':'mid';
  let code=weightedPick(SEASON_WEIGHTS[season],r);
  if(i>0 && r()<.35) code=days[i-1].code;           // weather often lasts a couple of days
  let hi=HIGHS[m]+Math.round((r()-.5)*6); if(code==='sunny')hi+=2; if(WX[code].wet)hi-=1;
  days.push({code,hi,lo:hi-5-Math.round(r()*3)});
 }
 // make sure the fortnight has some contrast to discuss
 const wetIdx=days.map((d,i)=>WX[d.code].wet?i:-1).filter(i=>i>=0), sunIdx=days.map((d,i)=>['sunny','spells'].includes(d.code)?i:-1).filter(i=>i>=0);
 if(wetIdx.length<2){[3,9].forEach(i=>{if(!WX[days[i].code].wet)days[i].code='rain';});}
 if(sunIdx.length<2){[1,6].forEach(i=>{days[i].code='sunny';});}
 FC_CACHE={key,days}; return days;
}
function wxOf(i){const b=baseForecast()[i];const code=state.planner.wx[i]||b.code;return Object.assign({code},WX[code],{hi:b.hi,lo:b.lo});}
function forecastSentence(i){const w=wxOf(i);return `On ${longDate(i)}, ${w.say}, with a high of ${w.hi} degrees and a low of ${w.lo}.`;}

function renderForecast(){
 $('forecast').innerHTML = Array.from({length:14},(_,i)=>{const w=wxOf(i);return `<button type="button" class="fc-day ${w.wet?'wet':''} ${['sunny','spells'].includes(w.code)?'sun':''} ${state.planner.wx[i]?'changed':''}" data-fc="${i}"><small>${shortDate(i)}</small><span class="fc-ic">${w.icon}</span><b>${w.label}</b><span>${w.hi}° / ${w.lo}°</span></button>`;}).join('');
 $('forecast').querySelectorAll('[data-fc]').forEach(b=>b.onclick=()=>listen(forecastSentence(+b.dataset.fc)));
}
function renderBank(){
 const box=$('activityBank'); if(!box) return;
 const mine=state.wishlist.filter(id=>ACTS[id]);
 const others=ATTRACTIONS.map(a=>a.id).filter(id=>!mine.includes(id));
 const chip=id=>{const a=ACTS[id];return `<button type="button" class="act-chip ${pick?.act===id&&!pick.from?'picked':''}" draggable="true" data-act="${id}"><span>${a.icon}</span><b>${escapeHtml(a.name)}</b><small>${WXTAG[a.wx].split(' ')[0]} ${energyDots(a.energy)}${a.closed?' · 🚧 closed':''}</small></button>`;};
 box.innerHTML = `${mine.length?`<h4>⭐ My London list</h4>${mine.map(chip).join('')}`:'<p class="small">Tip: add places to “My London list” in Section 02 — they appear here first.</p>'}
  <h4>🙂 Easygoing extras &amp; ideas</h4>${EXTRAS.map(a=>chip(a.id)).join('')}
  <h4>🏛️ More attractions</h4>${others.map(chip).join('')}`;
 box.querySelectorAll('[data-act]').forEach(c=>{
  c.ondragstart=e=>e.dataTransfer.setData('text/plain',JSON.stringify({act:c.dataset.act}));
  c.onclick=()=>{pick=(pick?.act===c.dataset.act&&!pick.from)?null:{act:c.dataset.act};renderBank();renderCalendar();if(pick)toast(`${ACTS[pick.act].icon} Now tap a morning or afternoon slot.`);};
 });
}
function conflictsFor(a,w,tired){
 const out=[];
 if(w.wet&&(a.wx==='outdoor'||a.wx==='views')) out.push({icon:'🌧️',msg:`${a.name} is outdoors, but ${w.say}.`});
 if(w.code==='fog'&&a.wx==='views') out.push({icon:'🌫️',msg:`Fog will hide the views from ${a.short}.`});
 if(w.code==='windy'&&a.wind) out.push({icon:'💨',msg:`It's too windy for ${a.short}.`});
 if(tired&&a.energy>=2) out.push({icon:'😴',msg:`The kids are worn out — ${a.short} is too tiring today.`});
 if(a.closed) out.push({icon:'🚧',msg:`${a.name} is temporarily closed — check the official website for your dates.`});
 return out;
}
function tipsFor(a,w){
 if(w.showery&&a.wx==='outdoor') return '☂️ Showers: take a brolly!';
 if(w.wet&&(a.wx==='indoor'||a.wx==='covered')) return '👍 Good rainy-day choice';
 if(['sunny','spells'].includes(w.code)&&(a.wx==='outdoor'||a.wx==='views')) return '👍 Perfect for the sunshine';
 return '';
}
function dayEnergy(i){return ['am','pm'].reduce((s,k)=>{const id=state.planner.slots[`${i}_${k}`];return s+(id?ACTS[id].energy:0);},0);}
function renderCalendar(){
 const p=state.planner;
 $('calendar').innerHTML = [0,1].map(wk=>`<div class="cal-week"><h4>Week ${wk+1}</h4><div class="cal-grid">${Array.from({length:7},(_,k)=>{const i=wk*7+k,w=wxOf(i),e=dayEnergy(i);
  return `<div class="cal-day ${p.tired[i]?'tired':''} ${w.wet?'wet':''}"><div class="cal-head"><b>${shortDate(i)}</b><span title="${w.label}">${w.icon} ${w.hi}°</span></div>
   ${p.tired[i]?'<div class="tired-badge">😴 Tired teens!</div>':''}
   ${['am','pm'].map(s=>{const key=`${i}_${s}`,id=p.slots[key];const a=id&&ACTS[id];const c=a?conflictsFor(a,w,p.tired[i]):[];const tip=a&&!c.length?tipsFor(a,w):'';
    return `<div class="slot ${pick?'targetable':''}" data-slot="${key}"><small>${s==='am'?'Morning':'Afternoon'}</small>${a?`<div class="planned ${c.length?'warn':''} ${pick?.from===key?'picked':''}" draggable="true" data-from="${key}"><span>${a.icon} ${escapeHtml(a.name)}</span>${c.map(x=>`<i title="${escapeHtml(x.msg)}">${x.icon}</i>`).join('')}${tip?`<em>${tip}</em>`:''}<button type="button" class="rm" data-rm="${key}" aria-label="Remove">✕</button></div>`:'<span class="empty">＋</span>'}</div>`;}).join('')}
   <div class="energy ${e>4?'heavy':''}">${e>4?'⚡ Heavy day!':`Energy: ${e?energyDots(e):'free day'}`}</div></div>`;}).join('')}</div></div>`).join('');
 const cal=$('calendar');
 cal.querySelectorAll('.planned').forEach(el=>{
  el.ondragstart=e=>{e.stopPropagation();e.dataTransfer.setData('text/plain',JSON.stringify({from:el.dataset.from}));};
  el.onclick=e=>{if(e.target.closest('.rm'))return;e.stopPropagation();
   if(pick && pick.from!==el.dataset.from){placeAct(el.dataset.from);return;}
   pick=pick?.from===el.dataset.from?null:{from:el.dataset.from,act:p.slots[el.dataset.from]};renderCalendar();renderBank();if(pick)toast('Now tap another slot to move it (or to swap two activities).');};
 });
 cal.querySelectorAll('[data-rm]').forEach(b=>b.onclick=e=>{e.stopPropagation();delete p.slots[b.dataset.rm];pick=null;save();renderCalendar();});
 cal.querySelectorAll('.slot').forEach(s=>{
  s.ondragover=e=>{e.preventDefault();s.classList.add('over');};
  s.ondragleave=()=>s.classList.remove('over');
  s.ondrop=e=>{e.preventDefault();s.classList.remove('over');try{pick=JSON.parse(e.dataTransfer.getData('text/plain'));if(pick.from)pick.act=p.slots[pick.from];placeAct(s.dataset.slot);}catch(_){}};
  s.onclick=()=>{if(pick)placeAct(s.dataset.slot);};
 });
}
function placeAct(target){
 const p=state.planner; if(!pick) return;
 if(pick.from){ if(pick.from===target){pick=null;renderCalendar();return;}
  const moving=p.slots[pick.from], there=p.slots[target];
  p.slots[target]=moving; if(there) p.slots[pick.from]=there; else delete p.slots[pick.from];
  toast(there?`🔁 Swapped! “Let's swap ${ACTS[moving].short} and ${ACTS[there].short}.”`:`➡️ Moved! “Let's move ${ACTS[moving].short} to ${weekday(+target.split('_')[0])}.”`);
 } else { p.slots[target]=pick.act; }
 pick=null; save(); renderCalendar(); renderBank();
 const w=wxOf(+target.split('_')[0]); const a=ACTS[p.slots[target]]; const c=conflictsFor(a,w,p.tired[+target.split('_')[0]]);
 if(c.length) toast(`${c[0].icon} ${c[0].msg}`);
}
function analysePlan(){
 const p=state.planner; let placed=0; const problems=[], goods=[], heavy=[];
 for(let i=0;i<14;i++){const w=wxOf(i);
  for(const s of ['am','pm']){const id=p.slots[`${i}_${s}`]; if(!id) continue; placed++; const a=ACTS[id];
   conflictsFor(a,w,p.tired[i]).forEach(c=>problems.push({...c,day:i,a}));
   const t=tipsFor(a,w); if(t.startsWith('👍')) goods.push(`${a.icon} ${a.name} on ${shortDate(i)} — ${t.slice(2).trim().toLowerCase()}.`);}
  if(dayEnergy(i)>4) heavy.push(i);}
 heavy.forEach(i=>{if(heavy.includes(i-1)) problems.push({icon:'⚡',day:i,msg:`${shortDate(i-1)} and ${shortDate(i)} are both heavy days — the teenagers will be shattered!`,heavy:true});});
 return {placed,problems,goods};
}
function fixSentence(pr){
 const d=weekday(pr.day);
 if(pr.icon==='🌧️') return `Since it's going to rain on ${d}, why don't we move ${pr.a.short} to a sunnier day?`;
 if(pr.icon==='🌫️') return `Let's keep ${pr.a.short} for a clear day — it's going to be foggy on ${d}.`;
 if(pr.icon==='💨') return `It's too windy on ${d}, so let's put off ${pr.a.short} and do something sheltered.`;
 if(pr.icon==='😴') return `The kids are worn out on ${d}, so let's take it easy and do something more relaxing.`;
 if(pr.icon==='🚧') return `Let's check if ${pr.a.short} is open — if not, we could visit the National Maritime Museum instead.`;
 return `Why don't we swap one of these busy days with a lazy morning?`;
}
function checkPlan(){
 const {placed,problems,goods}=analysePlan(); const box=$('planFeedback');
 let stars = placed<6 ? 0 : problems.length===0 ? 3 : problems.length<=2 ? 2 : 1;
 state.planner.lastCheck={placed,problems:problems.length,stars,time:Date.now()}; save();
 box.innerHTML = `<div class="plan-score">${placed<6?`📝 You have planned ${placed} activit${placed===1?'y':'ies'}. Add at least 6 to get your Master Planner stamp!`:`${'★'.repeat(stars)}${'☆'.repeat(3-stars)} ${stars===3?'Weather-proof plan! Brilliant!':stars===2?'Nearly there — fix a couple of things.':'Lots to fix — read the forecast again!'}`}</div>
  ${problems.length?`<h4>⚠️ Things to change — and what to say</h4><ul>${problems.map(pr=>`<li><b>${pr.icon} ${shortDate(pr.day)}:</b> ${escapeHtml(pr.msg)}<br><span class="say-it">🗣️ “${escapeHtml(fixSentence(pr))}”</span> ${sayBtn(fixSentence(pr))}</li>`).join('')}</ul>`:''}
  ${goods.length?`<h4>👍 Great choices</h4><ul>${goods.slice(0,6).map(g=>`<li>${escapeHtml(g)}</li>`).join('')}</ul>`:''}`;
 if(stars===3) burst(box);
}
function doTwist(){
 const p=state.planner;
 const filled=[...new Set(Object.keys(p.slots).map(k=>+k.split('_')[0]))];
 const pool=filled.length?filled:[...Array(14).keys()];
 const r=Math.random, i=pool[Math.floor(r()*pool.length)], type=['rain','tired','sun','rain','tired'][Math.floor(r()*5)];
 let t;
 if(type==='rain'){p.wx[i]='rain';t={title:'🌧️ Weather alert!',text:`The forecast has changed: on ${longDate(i)} it's going to pour with rain all day.`,task:`Move any outdoor activity. Say: “Since it's going to pour on ${weekday(i)}, why don't we … instead?”`};}
 else if(type==='tired'){p.tired[i]=true;t={title:'😴 Tired teens!',text:`On ${longDate(i)}, the teenagers are shattered after a late night. They want something easygoing.`,task:`Replace tiring activities (⚡⚡ or more). Say: “The kids are worn out, so let's take it easy and …”`};}
 else {p.wx[i]='sunny';t={title:'☀️ Good news!',text:`${longDate(i)} is now going to be gloriously sunny and warm.`,task:`Move an outdoor or views activity to this day. Say: “As it's going to be sunny on ${weekday(i)}, let's move … to that day.”`};}
 p.twists.unshift(t); p.twists=p.twists.slice(0,3); save(); renderPlanner(); listen(t.text);
 $('twistBox').scrollIntoView({behavior:'smooth',block:'nearest'});
}
function renderTwists(){
 const p=state.planner;
 $('twistBox').innerHTML = p.twists.length ? `<div class="twists">${p.twists.map((t,k)=>`<div class="twist ${k?'old':''}"><b>${escapeHtml(t.title)}</b><p>${escapeHtml(t.text)} ${sayBtn(t.text)}</p><p class="task">🎯 ${escapeHtml(t.task)}</p></div>`).join('')}<button type="button" class="secondary" id="clearTwists">Undo all twists</button></div>` : '';
 $('clearTwists')?.addEventListener('click',()=>{p.wx={};p.tired={};p.twists=[];save();renderPlanner();});
}
function planSentences(){
 const p=state.planner, out=[];
 for(let i=0;i<14;i++){const am=p.slots[`${i}_am`],pm=p.slots[`${i}_pm`]; if(!am&&!pm) continue; const w=wxOf(i);
  const reason = p.tired[i] ? "the kids are worn out" : w.say;
  let s=`On ${longDate(i)}, ${reason}, so `;
  if(am&&pm) s+=`in the morning we're going to ${ACTS[am].verb}, and in the afternoon we're going to ${ACTS[pm].verb}.`;
  else s+=`in the ${am?'morning':'afternoon'} we're going to ${ACTS[am||pm].verb}.`;
  out.push(s.charAt(0).toUpperCase()+s.slice(1));}
 return out;
}
function downloadICS(){
 const p=state.planner, lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//SpeakEasyTisha//London Calling//EN','CALSCALE:GREGORIAN','X-WR-CALNAME:London trip'];
 const stamp=new Date().toISOString().replace(/[-:]/g,'').split('.')[0]+'Z'; let n=0;
 const esc=s=>String(s).replace(/\\/g,'\\\\').replace(/;/g,'\\;').replace(/,/g,'\\,').replace(/\n/g,'\\n');
 for(let i=0;i<14;i++) for(const s of ['am','pm']){const id=p.slots[`${i}_${s}`]; if(!id) continue; const a=ACTS[id], d=iso(dayDate(i)).replace(/-/g,''), w=wxOf(i);
  lines.push('BEGIN:VEVENT',`UID:${d}-${s}-${id}@speakeasytisha`,`DTSTAMP:${stamp}`,`DTSTART:${d}T${s==='am'?'100000':'140000'}`,`DTEND:${d}T${s==='am'?'130000':'173000'}`,`SUMMARY:${esc(a.icon+' '+a.name)}`,`LOCATION:${esc(a.q||'London')}`,`DESCRIPTION:${esc(`Practice forecast: ${w.label}, ${w.hi}°C. Check the real forecast and opening times before you go.${a.link?' '+a.link:''}`)}`,'END:VEVENT'); n++;}
 lines.push('END:VCALENDAR');
 if(!n){toast('Your calendar is empty — add some activities first!');return;}
 download('Sandrine_London_trip.ics',lines.join('\r\n'),'text/calendar');
 toast(`📅 ${n} events downloaded. Open the file to add them to your phone or computer calendar.`);
}
function renderPlanner(){renderForecast();renderBank();renderCalendar();renderTwists();}

/* ---------- 14. DIRECTIONS MAP GAME ---------- */
function mapGame(){
 const box=$('mapGame'); if(!box) return; REG.mapgame=MAP_MISSIONS.length;
 let round = Math.min(+state.fields.mapRound||0, MAP_MISSIONS.length-1);
 const [text,target]=MAP_MISSIONS[round], res=state.results['mapgame_'+round];
 const done=MAP_MISSIONS.map((_,i)=>state.results['mapgame_'+i]?.correct);
 const bld=MAP_BUILDINGS.map(b=>{const cls=res?.correct&&b.id===target?'hit':(state.fields.mapWrong===b.id&&!res?.correct?'miss':'');return `<g class="bld ${b.id==='park'?'park':''} ${cls}" data-b="${b.id}" tabindex="0" role="button" aria-label="${b.label}"><rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="6"/><text x="${b.x+b.w/2}" y="${b.y+b.h/2-4}" class="bi">${b.icon}</text><text x="${b.x+b.w/2}" y="${b.y+b.h/2+16}" class="bl">${b.label}</text></g>`;}).join('');
 box.innerHTML = `<div class="mapgame"><div class="mission"><div class="dots">${done.map((d,i)=>`<button type="button" class="dot ${d?'ok':''} ${i===round?'now':''}" data-round="${i}">${i+1}</button>`).join('')}</div>
  <span class="tasklabel">MISSION ${round+1} / ${MAP_MISSIONS.length}</span><p class="dir-text">“${escapeHtml(text)}”</p>
  <div class="actions">${sayBtn(text,'▶ Listen to the directions')}<button type="button" class="secondary" data-mnext>Next mission →</button></div>
  <div class="feedback ${res?.correct?'ok':res?'no':''}">${res?.correct?`✓ Yes! You found the ${MAP_BUILDINGS.find(b=>b.id===target).label.toLowerCase()}.`:res?`✗ That's the ${escapeHtml(MAP_BUILDINGS.find(b=>b.id===state.fields.mapWrong)?.label.toLowerCase()||'wrong place')}. Listen again — start at ★ and face up the map.`:'Start at ★ YOU ARE HERE, facing up the map (north). Tap the right building.'}</div>
  <p class="small">Score: ${done.filter(Boolean).length} / ${MAP_MISSIONS.length}</p></div>
  <svg viewBox="0 0 600 430" class="townmap" role="img" aria-label="Practice town map">
   <rect width="600" height="430" fill="#efe9dc"/>
   <rect x="0" y="180" width="600" height="40" class="road"/><rect x="180" y="0" width="40" height="430" class="road"/><rect x="400" y="0" width="40" height="430" class="road"/>
   <line x1="0" y1="200" x2="600" y2="200" class="lane"/><line x1="200" y1="0" x2="200" y2="430" class="lane"/><line x1="420" y1="0" x2="420" y2="430" class="lane"/>
   ${[0,1,2,3,4].map(k=>`<rect x="222" y="${183+k*7.5}" width="22" height="4" fill="#fff"/>`).join('')}
   <text x="560" y="196" class="rn" text-anchor="end">HIGH STREET</text><text x="205" y="168" class="rn" transform="rotate(-90 205 168)">STATION ROAD</text><text x="425" y="395" class="rn" transform="rotate(-90 425 395)">PARK LANE</text>
   ${bld}
   <g class="you"><circle cx="200" cy="405" r="13"/><text x="200" y="410" text-anchor="middle">★</text><text x="232" y="410" class="youlbl">YOU ARE HERE ↑</text></g>
  </svg></div>`;
 box.querySelectorAll('[data-round]').forEach(b=>b.onclick=()=>{state.fields.mapRound=+b.dataset.round;state.fields.mapWrong='';save();mapGame();});
 box.querySelector('[data-mnext]').onclick=()=>{state.fields.mapRound=(round+1)%MAP_MISSIONS.length;state.fields.mapWrong='';save();mapGame();};
 box.querySelectorAll('.bld').forEach(g=>{const go=()=>{if(state.results['mapgame_'+round]?.correct)return;const ok=g.dataset.b===target;state.results['mapgame_'+round]={selected:g.dataset.b,correct:ok,time:Date.now()};state.fields.mapWrong=ok?'':g.dataset.b;save();mapGame();if(ok){burst(box.querySelector('.mission'));listen('Well done!');}};g.onclick=go;g.onkeydown=e=>{if(e.key==='Enter')go();};});
}

/* ---------- 15. ARRIVAL SCENE & PRICES ---------- */
function renderArrival(){
 const photo=ACTS.cutty.photo;
 $('arrivalScene').innerHTML = `<div class="arrival" id="arrival" style="--bg:url('${photo}')">
  <div class="admissions">ADMISSIONS &amp; TICKETS <span>➜</span></div>
  <div class="doors"><div class="door l"></div><div class="door r"></div><div class="doorway">✨ WELCOME ABOARD ✨</div></div>
  <div class="family"><div class="person"><span class="bubble">Wow! It's enormous!</span>🧑</div><div class="person me"><span class="bubble">Wow… it's even more beautiful than in the photos!</span>👩</div><div class="person"><span class="bubble">Look at all those ropes!</span>🧑</div></div>
  <div class="photo-note">📸 (Someone has to take the photo!)</div></div>
  <div class="taskactions"><button type="button" id="openDoors">🚪 Open the doors</button>${sayBtn("Wow! It's enormous! Wow, it's even more beautiful than in the photos! Look at all those ropes!",'▶ Listen to the family')}</div>
  <div class="rule compact"><h3>What do you say when you arrive?</h3><div class="phrase-list inline">${[["Wow, it's huge!","Waouh, c'est immense !"],["Excuse me, where's the entrance?","Excusez-moi, où est l'entrée ?"],["Is this the queue for tickets?","C'est la file pour les billets ?"],["We've already booked. Do we need to queue?","Nous avons déjà réservé. Faut-il faire la queue ?"],["Where can we buy tickets?","Où peut-on acheter des billets ?"],["Can we leave our bags somewhere?","Peut-on laisser nos sacs quelque part ?"]].map(([en,fr])=>`<button type="button" class="phrase" data-say="${escapeHtml(en)}"><span>▶ ${escapeHtml(en)}</span><small class="fr-inline">${escapeHtml(fr)}</small></button>`).join('')}</div></div>`;
 $('openDoors').onclick=()=>{const el=$('arrival');el.classList.toggle('open');if(el.classList.contains('open')){listen("Wow! It's enormous!");burst(el);}};
}
function renderPriceBoard(){
 $('priceBoard').innerHTML = `<div class="priceboard">
  <div class="pb-card"><div class="pb-top">ROYAL MUSEUMS GREENWICH · CHOOSE YOUR TICKETS</div><h3>⛵ Cutty Sark</h3><ul><li>Explore the main deck</li><li>Walk beneath the ship</li><li>See how the crew lived</li><li>Family activities and interactives</li><li>Guaranteed entry time</li><li>Audio guide included</li></ul><div class="pb-prices"><div><small>Adult</small><b>£22</b></div><div><small>Child</small><b>£11</b></div></div><span class="pb-btn">BOOK NOW</span></div>
  <div class="pb-card"><div class="pb-top">EXPERIENCE</div><h3>🫖 Cutty Sark Afternoon Tea</h3><ul><li>Served beneath the famous hull</li><li>Sandwiches and sweet treats</li><li>Entry to the ship included</li><li>Vegan options available</li></ul><div class="pb-prices"><div><small>Adult</small><b>£47</b></div><div><small>Student</small><b>£41.50</b></div><div><small>Child</small><b>£36</b></div></div><span class="pb-btn">BOOK NOW</span></div>
  <div class="pb-table"><div class="pb-top">CURRENT PRICES · GREENWICH SITES</div><table><thead><tr><th>Location</th><th>Adult (16+)</th><th>Child*</th><th>Student</th></tr></thead><tbody>
   <tr><td>⛵ Cutty Sark</td><td>£22</td><td>£11</td><td>£16.50</td></tr>
   <tr><td>⚓ National Maritime Museum</td><td colspan="3" class="free">Free entry</td></tr>
   <tr><td>🔭 Royal Observatory</td><td colspan="3" class="closed">🚧 Temporarily closed for refurbishment</td></tr></tbody></table>
   <p>*Child tickets are for ages <b>4–15</b>. Children <b>under 4 go free</b>. No family ticket is listed for the ship.</p></div></div>
  <p class="small">Prices as shown on the official Royal Museums Greenwich website (rmg.co.uk), checked on 18 November 2026. Prices change — always check <a href="https://www.rmg.co.uk/plan-your-visit/tickets-prices" target="_blank" rel="noopener">the official ticket page ↗</a> before you go.</p>
  <div class="french-note">16+ = 16 ans et plus · Child = enfant (4–15 ans) · Under 4s go free = gratuit pour les moins de 4 ans · included = inclus.</div>`;
}
function ticketPrice(age,type='ship'){if(age<4)return 0;const adult=age>=16;if(type==='tea')return adult?CUTTY.teaAdult:CUTTY.teaChild;return adult?CUTTY.adult:CUTTY.child;}
function renderPriceCalc(){
 const ages=[...Array(8).keys()].map(k=>k+10);
 const sel=(id,def)=>`<select id="${id}">${ages.map(a=>`<option value="${a}" ${(+(state.fields[id]??def))===a?'selected':''}>${a} years old</option>`).join('')}</select>`;
 $('priceCalc').innerHTML = `<div class="calcbox"><h3>🧮 Your family · work it out first, then check</h3><div class="formgrid"><label>Teenager 1${sel('teenAge1',13)}</label><label>Teenager 2${sel('teenAge2',16)}</label></div>
  <div class="formgrid"><label>Your total for Cutty Sark (2 adults + 2 teenagers) in £<input id="calcGuess" type="number" step="0.5" placeholder="e.g. 66"></label><div class="calc-actions"><button type="button" id="calcCheck">Check my maths</button><button type="button" class="secondary hint-btn" id="calcShow">Show the calculation</button></div></div>
  <div id="calcOut" class="feedback"></div></div>`;
 const calc=()=>{const a1=+$('teenAge1').value,a2=+$('teenAge2').value;const ship=2*CUTTY.adult+ticketPrice(a1)+ticketPrice(a2);const tea=2*CUTTY.teaAdult+ticketPrice(a1,'tea')+ticketPrice(a2,'tea');const nAd=2+(a1>=16)+(a2>=16),nCh=4-nAd;return {a1,a2,ship,tea,nAd,nCh};};
 const explain=c=>`${c.nAd} adult${c.nAd>1?'s':''} × £22${c.nCh?` + ${c.nCh} child${c.nCh>1?'ren':''} × £11`:''} = ${money(c.ship)} for the ship. Afternoon tea for the four of you: ${money(c.tea)} (${money(c.tea-c.ship)} more, but food is included).`;
 const speak=c=>{const old=[c.a1,c.a2].filter(a=>a>=16);const intro=old.length===1?`Our ${old[0]}-year-old pays the adult price, so it's`:old.length===2?`Both teenagers pay the adult price, so it's`:`It's`;return `There are four of us: two adults and two teenagers aged ${c.a1} and ${c.a2}. ${intro} ${NUM[c.nAd]} adult tickets${c.nCh?` and ${NUM[c.nCh]} child ticket${c.nCh>1?'s':''}`:''}. That's ${c.ship} pounds altogether.`;};
 ['teenAge1','teenAge2'].forEach(id=>$(id).onchange=()=>{state.fields[id]=$(id).value;save();$('calcOut').textContent='';});
 $('calcCheck').onclick=()=>{const c=calc(),g=parseFloat($('calcGuess').value);const out=$('calcOut');if(isNaN(g)){out.textContent='Write your total first!';return;}
  if(Math.abs(g-c.ship)<.01){out.className='feedback ok';out.innerHTML=`✓ Correct! ${escapeHtml(explain(c))}<br>🗣️ “${escapeHtml(speak(c))}” ${sayBtn(speak(c))}`;burst(out);}
  else{out.className='feedback no';out.textContent=`✗ Not quite. Remember: 16+ pays the adult price (£22), 4–15 pays £11. Try again!`;}};
 $('calcShow').onclick=()=>{const c=calc();const out=$('calcOut');out.className='feedback';out.innerHTML=`${escapeHtml(explain(c))}<br>🗣️ “${escapeHtml(speak(c))}” ${sayBtn(speak(c))}`;};
}
function renderTicketScenario(){
 const a=ATTRACTIONS.find(x=>x.id===$('destination').value)||ATTRACTIONS[0];
 $('ticketScenario').innerHTML=`<div class="chapter"><h3>Your turn · at the ticket desk of ${a.icon} ${escapeHtml(a.name)}</h3><p>Use the Cutty Sark dialogue as a model, but for your main attraction. Check the real prices first on the <a href="${a.link}" target="_blank" rel="noopener" class="small-link">official website ↗</a>.</p><p><b>Role-play cards:</b> 🅰️ Your tickets are booked, but you arrive 20 minutes late. 🅱️ You have no tickets: ask for the next available entry and the total price. 🅲 There is a special exhibition with an extra charge — ask how much and decide.</p></div>`;
}
function renderInsideScenario(){
 const a=ATTRACTIONS.find(x=>x.id===$('destination').value)||ATTRACTIONS[0];
 $('insideScenario').innerHTML=`<div class="chapter"><h3>At ${a.icon} ${escapeHtml(a.name)} · entry &amp; facilities</h3><div class="dialogue" id="insideDlg"></div><div class="french-note">« The toilets are downstairs » = Les toilettes sont en bas.</div></div>`;
 dialogue('insideDlg',[['Staff','Welcome! Have you got your tickets?'],['You','Yes, here is our booking confirmation. Could you scan it, please?'],['Staff','Thank you. Go straight on and follow the signs.'],['You','Is there a lift? And where are the toilets?'],['Staff',"The toilets are downstairs, on the lower ground floor. The lift is on your left."],['You','Brilliant, thank you!']]);
}

/* ---------- 16. SIGNS ---------- */
function renderSigns(){
 $('signBoard').innerHTML = `<div class="signs">
  <div class="directory"><div class="dir-title">FLOOR GUIDE</div>
   <div class="lvl"><b>2</b><span>Second floor</span><em>☕ Café · Roof terrace with river views</em></div>
   <div class="lvl"><b>1</b><span>First floor</span><em>🖼️ Galleries 4–7 · Family discovery zone</em></div>
   <div class="lvl here"><b>G</b><span>Ground floor · YOU ARE HERE</span><em>🎟️ Admissions · ℹ️ Information desk · 🛍️ Gift shop · 🧥 Cloakroom · ♿ Accessible toilet</em></div>
   <div class="lvl"><b>LG</b><span>Lower ground floor</span><em>🚻 Toilets · 🚼 Baby changing · 🔒 Lockers · 🧺 Picnic area</em></div></div>
  <div class="wayfinding">
   <div class="wsign">⬅ <span>🧥 Cloakroom</span></div><div class="wsign">➡ <span>🛍️ Gift shop</span></div>
   <div class="wsign">↖ <span>🛗 Lift · all floors</span></div><div class="wsign">⬇ <span>🚻 Toilets · 🔒 Lockers · 🧺 Picnic area — stairs down</span></div>
   <div class="wsign green">⬆ <span>🚪 Way out</span></div><div class="wsign">↗ <span>☕ Café &amp; terrace · Second floor · take the lift</span></div>
   <div class="qr-card"><div class="qr" aria-hidden="true">${Array.from({length:49},(_,k)=>`<i class="${(hash('qr'+k)%3)?'on':''}"></i>`).join('')}</div><div><b>📱 Scan me!</b><br>Free audio guide in 8 languages</div></div>
   <div class="wsign staff">⛔ <span>Staff only</span></div></div></div>
  <div class="taskactions">${sayBtn('The café is on the second floor. Take the lift. The toilets, the lockers and the picnic area are downstairs, on the lower ground floor. The cloakroom is on your left and the gift shop is on your right. The way out is straight ahead.','▶ Listen to a guide describe the signs')}</div>`;
}

/* ---------- 17. CAFÉ GAME ---------- */
const NUM=['zero','one','two','three','four','five','six','seven','eight','nine','ten'];
function itemPhrase(m,q){if(q===1)return (/^[aeiou]/i.test(m.sg)?'an ':'a ')+m.sg;return (NUM[q]||q)+' '+m.pl;}
function listJoin(a){return a.length<2?a.join(''):a.slice(0,-1).join(', ')+' and '+a[a.length-1];}
function renderCafe(){
 const box=$('cafeGame'); if(!box) return; REG.cafe=1;
 const c=state.cafe, cats={main:'🍽️ Savoury',sweet:'🍰 Something sweet',drink:'🥤 Drinks'};
 const total=MENU.reduce((s,m)=>s+(c[m.id]||0)*m.price,0);
 box.innerHTML = `<div class="cafe">
  <div class="cafe-brief"><h3>🎯 Mission: lunch for four · budget ${money(CAFE_BUDGET)}</h3><div class="family-needs"><span>👩 You · anything you like</span><span>🧑 Your partner · something hot</span><span>🧑 Teen 1 · vegetarian 🌱</span><span>🧑 Teen 2 · allergic to nuts 🥜🚫</span></div><p class="small">Everyone needs something savoury and a drink. Prices are practice prices for a typical London museum café.</p></div>
  <div class="cafe-grid"><div class="chalkboard"><div class="cb-title">THE GALLEY CAFÉ</div>${Object.entries(cats).map(([k,lab])=>`<h4>${lab}</h4>${MENU.filter(m=>m.cat===k).map(m=>`<div class="menu-item"><span>${m.icon} ${escapeHtml(m.name)} ${m.tags.map(t=>`<i class="tag t${t}">${t}</i>`).join('')}</span><b>${m.price?money(m.price):'free'}</b><div class="qty"><button type="button" data-minus="${m.id}" aria-label="Less">−</button><span>${c[m.id]||0}</span><button type="button" data-plus="${m.id}" aria-label="More">+</button></div></div>`).join('')}`).join('')}<p class="cb-key">V = vegetarian · VG = vegan · N = contains nuts</p></div>
  <div class="receipt"><div class="rc-title">YOUR ORDER</div>${MENU.filter(m=>c[m.id]).map(m=>`<div class="rc-line"><span>${c[m.id]} × ${escapeHtml(m.name)}</span><b>${m.price?money(c[m.id]*m.price):"free"}</b></div>`).join('')||'<p class="small">Nothing yet — use + on the menu.</p>'}
   <div class="rc-total ${total>CAFE_BUDGET?'over':''}"><span>TOTAL</span><b>${money(Math.round(total*100)/100)}</b></div><div class="budgetbar"><div style="width:${Math.min(100,total/CAFE_BUDGET*100)}%"></div></div>
   <div class="actions"><button type="button" id="cafeCheck">✅ Check my order</button><button type="button" class="secondary" id="cafeClear">Clear</button></div><div id="cafeOut"></div></div></div></div>`;
 box.querySelectorAll('[data-plus]').forEach(b=>b.onclick=()=>{c[b.dataset.plus]=Math.min(9,(c[b.dataset.plus]||0)+1);save();renderCafe();});
 box.querySelectorAll('[data-minus]').forEach(b=>b.onclick=()=>{c[b.dataset.minus]=Math.max(0,(c[b.dataset.minus]||0)-1);if(!c[b.dataset.minus])delete c[b.dataset.minus];save();renderCafe();});
 $('cafeClear').onclick=()=>{state.cafe={};save();renderCafe();};
 $('cafeCheck').onclick=()=>cafeCheck(total);
}
function cafeCheck(total){
 const c=state.cafe, q=id=>c[id]||0;
 const mains=MENU.filter(m=>m.cat==='main').reduce((s,m)=>s+q(m.id),0);
 const drinks=MENU.filter(m=>m.cat==='drink'&&m.id!=='tap').reduce((s,m)=>s+q(m.id),0);
 const veg=MENU.filter(m=>m.cat==='main'&&m.tags.includes('V')).reduce((s,m)=>s+q(m.id),0);
 const hot=q('jacket')+q('soup')+q('toastie')+q('tea')+q('hotchoc');
 const checks=[[mains>=4,`${mains}/4 savoury dishes`,'Everyone needs something savoury.'],[drinks>=4||q('tap')>0,'Drinks for everyone','Add drinks — or a free jug of tap water!'],[veg>=1,'A vegetarian dish for Teen 1','Choose a dish marked V.'],[hot>=1,'Something hot for your partner','Choose soup, a toastie, a jacket potato or a hot drink.'],[total<=CAFE_BUDGET,`Budget: ${money(Math.round(total*100)/100)} / ${money(CAFE_BUDGET)}`,`You are ${money(Math.round((total-CAFE_BUDGET)*100)/100)} over budget — remove something.`]];
 const ok=checks.every(x=>x[0]); const nuts=q('carrot')>0;
 state.results.cafe={selected:1,correct:ok&&!nuts,time:Date.now()}; save();
 const items=MENU.filter(m=>q(m.id)).map(m=>itemPhrase(m,q(m.id)));
 let order=items.length?`Hello! Could we have ${listJoin(items)}, please?`:'';
 if(order) order+=` We'd like to eat in.${nuts?' Oh — does the carrot cake contain nuts? One of the children is allergic.':''} Could we have the bill when we've finished?`;
 $('cafeOut').innerHTML=`<ul class="checks">${checks.map(([p,lab,fix])=>`<li class="${p?'ok':'no'}">${p?'✓':'✗'} ${escapeHtml(p?lab:fix)}</li>`).join('')}${nuts?'<li class="no">⚠️ The carrot cake contains walnuts — Teen 2 is allergic! Ask the staff, or choose another dessert.</li>':''}</ul>${ok&&!nuts?'<p class="feedback ok">🎉 Perfect order — Café Pro!</p>':''}${order?`<div class="say-order"><b>🗣️ Say your order:</b><p>“${escapeHtml(order)}”</p>${sayBtn(order,'▶ Listen')}</div>`:''}`;
 if(ok&&!nuts) burst($('cafeOut'));
}

/* ---------- 18. REVIEWS, HOME ---------- */
function renderReviewSamples(){const r=$('rating').value;const ex={5:['★★★★★ · Outstanding day','We had an absolutely wonderful visit. The staff were welcoming, everything was well organised and the experience exceeded our expectations. We especially loved the atmosphere. We would definitely recommend it.'],4:['★★★★ · Very good','We really enjoyed our visit. The main attraction was fascinating and the staff were helpful. Although it was quite crowded, we still had a lovely afternoon. We would recommend booking in advance.'],3:['★★★ · Mixed feelings','We visited this attraction with our two teenagers. Some parts were interesting, but we had to wait longer than expected in the rain. The location was convenient; however, the experience could have been better organised.'],2:['★★ · Disappointing','We were looking forward to our visit, but we were disappointed. The queue was long and the information was unclear. Although there were some positive moments, we do not think it offered good value for money.'],1:['★ · Poor experience','Unfortunately, our visit was very disappointing. We faced several problems at the entrance and received little help. We left early. We would not recommend it unless the organisation improves.']};$('reviewExamples').innerHTML=`<div class="review-sample"><h4>Model · ${ex[r][0]}</h4><p>${ex[r][1]}</p>${sayBtn(ex[r][1],'▶ Listen to the review')}<p class="small">Teaching model only — not a real review.</p></div>`;}
const HOME={eurostar:{title:'Train · Eurostar',text:'From your hotel, reach London St Pancras International. Check your train ticket, allow the time the operator asks for document checks, find the departure area and board with your luggage.',dialogue:'Passenger: Excuse me, where do we go for Eurostar departures to Paris? Staff: Follow the signs for international departures. Passenger: Could you tell us how early we should arrive? Staff: Please check the instructions on your ticket.',link:'https://www.eurostar.com/',quiz:['Which London station is used for Eurostar services?',['St Pancras International','Waterloo East','Greenwich'],0,'Eurostar leaves from St Pancras International.']},plane:{title:'Plane · airport',text:'Check your airline and departure airport, travel to the correct terminal, find your bag-drop desk, go through security and passport control, and find your boarding gate.',dialogue:'Passenger: Hello, which desk should we use for bag drop? Staff: Check your flight number on the departure screens. Passenger: Could you tell us where security is? Staff: Follow the signs.',link:'https://www.gov.uk/hand-luggage-restrictions',quiz:['At the airport, what should you check first?',['The correct airline and terminal','The colour of a museum','Only the hotel lift'],0,'Airline + terminal first!']},ferry:{title:'Car + ferry',text:'Check your departure port, ferry company, vehicle booking and arrival time. Drive to vehicle check-in, prepare documents for all four travellers, follow the lanes and the staff directions.',dialogue:'Driver: Hello, we have a reservation for one car and four passengers. Staff: May I see your booking reference and travel documents? Driver: Of course. Which lane should we follow? Staff: Follow the signs for your sailing.',link:'https://www.gov.uk/bringing-goods-into-uk-personal-use',quiz:['What might you need at vehicle check-in?',['Vehicle booking and travel documents','A museum café menu','An Underground map only'],0,'Booking reference + documents.']}};
function renderHome(){const info=HOME[$('returnMode').value];$('homeText').innerHTML=`<div class="chapter"><h3>${info.title}</h3><p>${info.text}</p><p><b>Sample dialogue:</b> ${info.dialogue}</p>${sayBtn(info.dialogue,'▶ Listen')}<p><a href="${info.link}" target="_blank" rel="noopener" class="small-link">Official information ↗</a></p><div class="french-note">Reformulez le dialogue avec « Could you tell me… ? » et « We have booked… ».</div></div>`;question('homeQuestions','home',[...Q.home,info.quiz]);}

/* ---------- 19. SCORE & PASSPORT STAMPS ---------- */
const STAMPS=[
 {id:'reception',icon:'🛎️',label:'Reception',p:['recap']},{id:'explorer',icon:'🧭',label:'Explorer',p:['reading']},
 {id:'weather',icon:'🌦️',label:'Weather wizard',p:['weather','wdec','match_weather']},{id:'planner',icon:'📅',label:'Master planner',custom:()=>state.planner.lastCheck?.placed>=6&&state.planner.lastCheck?.problems===0},
 {id:'muchmany',icon:'🧮',label:'Much / many',p:['muchMany']},{id:'navigator',icon:'🚇',label:'Navigator',p:['route','mapgame']},
 {id:'tickets',icon:'🎟️',label:'Ticket detective',p:['price','ticket']},{id:'signs',icon:'🛗',label:'Sign reader',p:['sign','floor','match_signs','match_ukus']},
 {id:'cafe',icon:'🍰',label:'Café pro',p:['food','cafe']},{id:'return',icon:'🏨',label:'Way back',p:['return']},
 {id:'review',icon:'⭐',label:'Reviewer',p:['review']},{id:'home',icon:'🚆',label:'Homeward',p:['home']}
];
function stampEarned(s){
 if(s.custom) return !!s.custom();
 let total=0,correct=0;
 for(const p of s.p){total+=REG[p]||0;for(const [k,v] of Object.entries(state.results)) if((k===p||k.startsWith(p+'_'))&&v.correct) correct++;}
 return total>0 && correct>=Math.ceil(total*.7);
}
function renderPassport(){
 let earned=0;
 const html=STAMPS.map(s=>{const e=stampEarned(s);if(e)earned++;
  if(e&&!state.stamps[s.id]){state.stamps[s.id]=true;setTimeout(()=>{toast(`🛂 New passport stamp: ${s.icon} ${s.label}!`);burst($('passportMini'));},300);}
  return `<span class="stamp ${e?'on':''}" title="${s.label}${e?' ✓':' — 70% correct to earn it'}">${s.icon}<small>${s.label}</small></span>`;}).join('');
 if($('passport'))$('passport').innerHTML=`<b>🛂 My London passport · ${earned}/12 stamps</b><div class="stamps">${html}</div>`;
 if($('passportMini'))$('passportMini').innerHTML=`<div class="stamps mini">${html}</div>`;
 if($('stampCount'))$('stampCount').textContent=`${earned}/12`;
 try{localStorage.setItem(KEY,JSON.stringify(state));}catch(_){}
}
function updateScore(){
 const answers=Object.values(state.results||{}), words=Object.values(state.orders||{}).filter(x=>x.attempted);
 const total=answers.length+words.length, correct=answers.filter(x=>x.correct).length+words.filter(x=>x.correct).length;
 if($('correctCount'))$('correctCount').textContent=correct;
 if($('attemptCount'))$('attemptCount').textContent=total;
 if($('practicePct'))$('practicePct').textContent=total?Math.round(correct/total*100)+'%':'—';
 renderPassport();
}

/* ---------- 20. TRANSCRIPT, CFL, IO ---------- */
function generateTranscript(){
 const attraction=ATTRACTIONS.find(a=>a.id===$('destination').value)?.name||'our attraction', ret=HOME[$('returnMode').value].title;
 const sections=['recap_0','weather_0','plan_0','route_0','price_0','ticket_0','floor_0','food_0','return_0','review_0','home_0','final_0'].map(id=>state.fields['open_'+id]).filter(Boolean);
 const plan=planSentences();
 $('transcript').textContent=`LONDON CALLING · SPEAKING NOTES\nMain attraction: ${attraction}\nMy London list: ${state.wishlist.map(id=>ACTS[id].name).join(', ')||'—'}\nReturn travel: ${ret}\n\nMY FORTNIGHT\n${plan.length?plan.join('\n'):'(No activities planned yet.)'}\n\nMY ANSWERS\n`+(sections.length?sections.join('\n\n---\n\n'):'Use your answers from the speaking missions above to build your London story.');
}
const CFL_OBJ=['Listening / comprendre consignes, annonces et météo','Reading / comprendre descriptions, panneaux et tarifs','Interaction / recommandations, directions, billets, commande','Speaking / parler de la météo et adapter un programme','Speaking / raconter une expérience de voyage','Writing / rédiger un avis et expliquer un itinéraire'];
function cfl(){$('cflObjectives').innerHTML=CFL_OBJ.map((t,i)=>`<div class="cfl-obj"><b>${escapeHtml(t)}</b><label>Status<select id="objStatus${i}"><option>En cours</option><option>Acquis</option><option>Non acquis</option><option>Non évalué</option></select></label><label>Priority<select id="objPriority${i}"><option>Priorité 1</option><option>Priorité 2</option><option>Priorité 3</option></select></label></div>`).join('');}
function reportRow(){const status=CFL_OBJ.map((_,i)=>`Obj${i+1}: ${$('objStatus'+i).value}`).join(' | ');const v=[$('lessonDate').value||'','Sandrine','London Calling · Lesson 03 · Live London',$('duration').value,$('lessonUrl').value,'London attractions; weather language; two-week planning (weather & fatigue); directions; prices & tickets; UK/US floors & signs; café ordering; reviews; return to France',$('exerciseTypes').value,$('supportUsed').value,`${$('correctCount').textContent}/${$('attemptCount').textContent} correct; ${$('practicePct').textContent} on attempted; stamps ${$('stampCount').textContent}`,status,$('generalStatus').value,$('strengths').value,$('revisit').value,$('nextSteps').value];return v.map(x=>String(x).replace(/\t/g,' ').replace(/\r?\n/g,' | ')).join('\t');}
function download(name,contents,type='application/json'){const blob=new Blob([contents],{type});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),5000);}

function field(id){const el=$(id);if(!el)return;if(state.fields[id]!==undefined){el.type==='checkbox'?el.checked=!!state.fields[id]:el.value=state.fields[id];}
 el.addEventListener('input',()=>{state.fields[id]=el.type==='checkbox'?el.checked:el.value;save();
  if(['destination','secondDestination'].includes(id))updateChoice();if(id==='returnMode')renderHome();if(id==='rating')renderReviewSamples();if(id==='vocabCategory'||id==='vocabSearch')renderVocab();if(id==='mode')rerenderQuizzes();});}
function renderVocab(){const cat=$('vocabCategory').value,s=$('vocabSearch').value.toLowerCase().trim();const words=(VOCAB[cat]||[]).filter(w=>w.join(' ').toLowerCase().includes(s));$('vocabList').innerHTML=words.map(w=>`<article class="vocabitem"><h3>${escapeHtml(w[0])}</h3><div class="fr">${escapeHtml(w[1])}</div><p class="definition">${escapeHtml(w[2])}</p><p class="example">“${escapeHtml(w[3])}”</p><button data-say="${escapeHtml(w[0]+'. '+w[3])}" type="button">▶ Listen</button></article>`).join('')||'<p>No matches. Try another category or search.</p>';}
function nav(){const sections=[...document.querySelectorAll('main section')];$('nav').innerHTML=sections.map((s,i)=>`<a href="#${s.id}">${String(i+1).padStart(2,'0')} · ${escapeHtml(s.dataset.nav)}</a>`).join('');const h=()=>{let idx=0;sections.forEach((s,i)=>{if(s.getBoundingClientRect().top<240)idx=i;});[...$('nav').children].forEach((a,i)=>a.classList.toggle('active',i===idx));$('bar').style.width=((idx+1)/sections.length*100)+'%';};window.addEventListener('scroll',h,{passive:true});h();}

function rerenderQuizzes(){
 question('recapQuestions','recap',Q.recap);question('readingQuestions','reading',Q.reading);
 question('weatherQuestions','weather',Q.weather);question('weatherDecisions','wdec',Q.wdec,{label:'DECISION'});
 question('planQuestions','plan',Q.plan);question('routeQuestions','route',Q.route);
 question('priceQuestions','price',Q.price,{label:'PRICE DETECTIVE'});question('ticketQuestions','ticket',Q.ticket);
 question('signQuestions','sign',Q.sign,{label:'READ THE SIGNS'});question('floorQuestions','floor',Q.floor);
 question('foodQuestions','food',Q.food);question('returnQuestions','return',Q.return);question('reviewQuestions','review',Q.review);
 question('muchManyQuestions','muchMany',MUCH_MANY_QUIZ);renderHome();
}

function bind(){
 if(!state.planner.start) state.planner.start=nextSaturday();
 $('vocabCategory').innerHTML=Object.keys(VOCAB).map(k=>`<option>${escapeHtml(k)}</option>`).join('');
 cfl(); nav(); phraseLists(); dialogue('receptionDialogue',RECEPTION); renderAttractions();
 for(const id of ['destination','secondDestination','reviewPlace','accent','frenchHelp','mode','vocabCategory','vocabSearch','rating','returnMode','returnConcern','lessonDate','duration','lessonUrl','generalStatus','supportUsed','exerciseTypes','strengths','revisit','nextSteps','trainerNotes'])field(id);
 for(let i=0;i<CFL_OBJ.length;i++){field('objStatus'+i);field('objPriority'+i);}
 updateChoice(); renderVocab(); renderReviewSamples(); renderWeatherWords();
 rerenderQuizzes();
 Object.keys(MATCHES).forEach(matchGame);
 orders('muchManyOrder','muchMany',MUCH_MANY_ORDERS); openTasks('muchManyOpen','muchMany',MUCH_MANY_OPEN);
 for(const k of Object.keys(ORDERS)) orders(k==='floor'?'floorOrder':k+'Order',k,ORDERS[k]);
 for(const k of Object.keys(OPEN)) openTasks(k==='floor'?'insideOpen':k+'Open',k,OPEN[k]);
 mapGame(); renderArrival(); renderPriceBoard(); renderPriceCalc(); dialogue('cuttyDesk',CUTTY_DESK); renderSigns(); renderCafe();

 // planner controls
 $('planStart').value=state.planner.start;
 $('planStart').onchange=()=>{if(!$('planStart').value)return;state.planner.start=$('planStart').value;save();renderPlanner();};
 $('newForecast').onclick=()=>{state.planner.seed=(state.planner.seed||1)+1;state.planner.wx={};save();renderPlanner();toast('🔀 New forecast! Check your plan again.');};
 $('twistBtn').onclick=doTwist; $('checkPlan').onclick=checkPlan; $('icsBtn').onclick=downloadICS;
 $('clearPlan').onclick=()=>{if(confirm('Clear all the activities from your calendar?')){state.planner.slots={};pick=null;save();renderPlanner();$('planFeedback').innerHTML='';}};
 $('planSentencesBtn').onclick=()=>{const s=planSentences();$('planSentences').textContent=s.length?s.join('\n'):'Your calendar is empty — add some activities first!';};
 $('planSentencesListen').onclick=()=>{const s=planSentences();if(s.length)listen(s.slice(0,4).join(' '));else toast('Add some activities first!');};
 renderPlanner();
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&pick){pick=null;renderCalendar();renderBank();}});

 // map dialog
 $('mapClose').onclick=()=>{$('mapDialog').close();$('mapFrame').src='about:blank';};
 $('mapDialog').addEventListener('click',e=>{if(e.target===$('mapDialog')){$('mapDialog').close();$('mapFrame').src='about:blank';}});

 // display toggles
 const applyToggles=()=>{document.body.classList.toggle('show-french',$('frenchHelp').checked);document.body.classList.toggle('exam-mode',$('mode').value==='exam');};
 $('frenchHelp').addEventListener('change',applyToggles);$('mode').addEventListener('change',applyToggles);applyToggles();

 // tools
 $('resetBtn').onclick=()=>{if(confirm('Reset Sandrine Lesson 03? All answers, the calendar and trainer notes for THIS lesson will be erased. Save your progress file first if needed.')){localStorage.removeItem(KEY);location.reload();}};
 $('printBtn').onclick=()=>window.print();
 $('exportBtn').onclick=()=>{download('Sandrine_Lesson_03_progress.json',JSON.stringify({lesson:'Sandrine London Calling Lesson 03',exported:new Date().toISOString(),data:state},null,2));toast('💾 Progress file saved in your Downloads. Keep it — no need to open it.');};
 $('importBtn').onclick=()=>$('importFile').click();
 $('importFile').onchange=async e=>{const f=e.target.files?.[0];if(!f)return;try{const imp=JSON.parse(await f.text());if(imp.lesson!=='Sandrine London Calling Lesson 03'||!imp.data||typeof imp.data!=='object')throw Error('This file is not a Lesson 03 progress file.');if(confirm('Load this saved progress and replace the current progress?')){localStorage.setItem(KEY,JSON.stringify(imp.data));location.reload();}}catch(err){alert(err.message);}};
 $('transcriptBtn').onclick=generateTranscript;
 $('copyTranscript').onclick=()=>navigator.clipboard?.writeText($('transcript').textContent).then(()=>toast('Copied'),()=>toast('Copy unavailable — select the text.'));
 $('cflGenerate').onclick=()=>{$('cflOutput').textContent=reportRow();};
 $('cflCopy').onclick=()=>{const t=reportRow();$('cflOutput').textContent=t;if(navigator.clipboard?.writeText)navigator.clipboard.writeText(t).then(()=>toast('CFL row copied'),()=>toast('Select and copy the row manually'));else toast('Select and copy the row manually');};
 $('downloadReport').onclick=()=>download('Sandrine_Lesson_03_Report.txt',`London Calling · Lesson 03\n\n${reportRow()}\n\nTwo-week plan:\n${planSentences().join('\n')||'—'}\n\nLearning answers:\n${JSON.stringify(state,null,2)}`,'text/plain');

 // one single listener for every Listen button (no double playback)
 document.addEventListener('click',e=>{const b=e.target.closest('[data-say]');if(b){e.preventDefault();listen(b.dataset.say);}});
 updateScore();
}
bind();
