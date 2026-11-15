'use strict';

const rawScenes = `
@intro|Introduce yourself|Meeting someone new|Say your name, origin and home. Give a short answer, then ask “How about you?”|I’m from + origin; I live in + home now. Use “Where are you from?” with be and “Where do you live?” with live.|From indique l’origine. In indique ici où vous habitez. Pour une question avec live, ajoutez do.|Introduce yourself in three sentences, then ask where the other person is from.
P|Hi, I’m [your name]. Nice to meet you.|Bonjour, je m’appelle [votre prénom]. Enchantée.|Say this when you meet someone for the first time.
P|I’m from [place], and I live in [town].|Je viens de [lieu] et j’habite à [ville].|Use your real places. Example: I’m from France, and I live in Lyon.
P|Where are you from?|D’où venez-vous ?|Ask the other person about their origin.
V|hometown|ville d’origine|Is this your hometown?
V|live near|habiter près de|I live near a small town.
D|New acquaintance|Hi, nice to meet you. Where are you from?|I’m from France. How about you?
D|New acquaintance|I’m from Boston. Do you live in France now?|Yes, I do. I live near Lyon.
M|Hi, I’m [name]. I’m from [place]. I live in [town]. Where are you from?|Lovely to meet you. I’m originally from [place], and I now live near [town]. How about you? Are you from around here?
Q|Which question asks where someone lives now?|Where are you from?~Where do you live?~What do you do?|1|Use do + subject + live to ask about someone’s current home.
T|Build a question about origin.|Where are you from?|from?~you~Where~are|With be, use Where + are + you.
G|I ___ in France. (habiter)|live|Use live after I to talk about your home.
@work|Talk about your work|A client, supplier or another traveller|Start with your role. Add two tasks and say what happens first and next.|I’m a wedding planner. I help couples plan their weddings. For routines use I + base verb; for a colleague use she + verb-s.|On dit I’m a wedding planner avec a. Après help couples, plan reste à la base verbale.|Explain your job in three or four sentences. Then ask the other person about their work.
P|I’m a wedding planner. I help couples plan their weddings.|Je suis organisatrice de mariages. J’aide les couples à organiser leur mariage.|Use the first sentence for your job title and the second for what you do.
P|First, I meet the couple. Then I contact venues and suppliers.|D’abord, je rencontre le couple. Puis, je contacte les lieux de réception et les prestataires.|Use first and then to explain the client journey.
P|What do you do for work?|Quel est votre métier ?|Use after someone introduces themselves.
V|venue|lieu de réception|I help the couple choose a venue.
V|supplier / vendor|prestataire (vendor est courant aux États-Unis)|I confirm the schedule with the suppliers.
V|on the wedding day|le jour du mariage|I coordinate the team on the wedding day.
D|Guest|What do you do for work?|I’m a wedding planner. I help couples choose a venue and plan the day.
D|Guest|What do you do on the wedding day?|I coordinate the team and check the schedule.
D|You|What do you do for work?|I work at a hotel.
M|I’m a wedding planner. I meet couples, contact suppliers and organise the wedding day.|I’m a wedding planner. First, I find out what the couple wants. Then I help them choose a venue and coordinate the suppliers. On the wedding day, I keep an eye on the schedule. What do you do for work?
Q|Which phrase gives your job title?|I work a wedding planner.~I’m wedding planner.~I’m a wedding planner.|2|Use be + a + job title.
T|Build a question about a regular activity.|What do you do on the wedding day?|day?~do~on~What~the~you~wedding~do|The first do helps form the question. The second means faire.
G|Your colleague ___ (contact) suppliers every week.|contacts|With she or he, add -s in an affirmative present simple sentence.
@chat|Make small talk|Another traveller, a hotel guest or a supplier|Open with an easy question, react to the answer and ask one follow-up question. End politely.|Is this your first time here? uses be. Do you have any recommendations? uses do + have. How was your flight? asks about a finished flight. I am here for work (I’m here for work) describes why you’re here now. I come here for work describes a regular visit. I’ve come here for work puts the focus on why you came.|Un petit échange peut suivre trois étapes : une question, une réaction et une relance. Was est le passé de is. I’m here for work = je suis ici pour le travail. I come here for work = je viens ici régulièrement pour le travail.|Choose a traveller, another guest or a supplier. Start, react, ask a follow-up and close the conversation.
P|Is this your first time here?|C’est votre première fois ici ?|An easy opener for another traveller.
P|How was your flight?|Comment s’est passé votre vol ?|Ask someone who has just arrived.
P|That sounds lovely. What did you like best?|Ça a l’air très bien. Qu’avez-vous préféré ?|React, then ask about a completed visit. After did use like.
P|It was nice talking to you. Enjoy your stay!|J’ai été ravie de discuter avec vous. Bon séjour !|Close a short conversation warmly.
V|here for work|ici pour le travail|I’m here for work.
V|here on holiday / on vacation|ici en vacances (UK / US)|I’m here on vacation.
V|recommend|recommander|Can you recommend a café near here?
D|Hotel guest|Is this your first time in Boston?|Yes, it is. How about you?
D|Hotel guest|I’m here for work. Are you here on holiday?|Yes. I’m going to visit the waterfront. Do you have any recommendations?
D|Hotel guest|There’s a lovely café near the hotel.|That sounds lovely. Thanks for the tip!
M|Hi! Is this your first time here? … That sounds nice. Are you here on holiday? … It was nice talking to you.|Good morning! How was your flight? … I’m glad to hear that. Are you here for work or on vacation? … That sounds interesting. Do you have time to see the city while you’re here? … Enjoy your stay!
Q|They say “I’m here for work.” Which reply keeps the exchange going?|Oh, nice. What kind of work do you do?~Here’s my passport.~No, it isn’t.|0|A short reaction followed by a related question keeps the conversation going.
T|Ask about someone’s finished flight.|How was your flight?|flight?~your~How~was|Use How + was + your flight.
@prep|Before you travel|Your documents, plans and timetable|Save the booking and hotel address offline. Check entry requirements, baggage rules and the airline’s check-in instructions. Compare train, bus or taxi for your arrival. Keep a backup route and a few phrases on your phone.|Use at + time, on + day or date, in + month. Use “I’m going to + verb” for plans, and “The flight leaves at…” for the timetable.|At pour l’heure, on pour le jour ou la date, in pour le mois. Going to + verbe exprime un projet, leaves annonce l’horaire.|Pick a destination, date, departure time and arrival transport. Say your plan and confirm one detail with a partner.
P|I’m going to Boston. I’m going to take the subway into town.|Je vais à Boston. J’ai prévu de prendre le métro pour aller en ville.|Compare going to + place with going to + verb.
P|My flight leaves at eight fifteen a.m. on Friday.|Mon vol part vendredi à 8 h 15.|Use a.m. for morning and p.m. for afternoon/evening.
P|Could you confirm the date and time, please?|Pourriez-vous confirmer la date et l’heure ?|A useful question when a date or time is unclear.
V|booking confirmation|confirmation de réservation|I saved the booking confirmation on my phone.
V|departure / arrival|départ / arrivée|What time is our arrival?
V|round-trip / return ticket|billet aller-retour (US / UK)|I’d like a return ticket, please.
V|May sixth / the sixth of May|le 6 mai (US / UK)|My flight leaves on the sixth of May.
D|Travel companion|When does the flight leave?|It leaves at eight fifteen a.m. on Friday.
D|Travel companion|How are you going to get to the hotel?|I’m going to take the subway.
M|I’m going to Boston. My flight leaves at eight fifteen on Friday. I’m going to take the subway to the hotel.|I’m flying to Boston on Friday. My flight leaves at eight fifteen a.m. and arrives in the afternoon. I’m going to take the subway if it’s convenient. Could you confirm the hotel address, please?
Q|Which asks for the timetable?|What time does the flight leave?~What time does the flight leaves?~What time do the flight leave?|0|Use does with the flight. After does, use leave.
G|My flight leaves ___ Friday ___ 8:15 a.m. (two words)|on at|Use on with a day and at with a time.
@depart|Airport departures|Ticket counter, bag drop, security and gate|Check the departures board → find your airline counter or bag drop → show your documents → follow security instructions → recheck the gate and boarding time. Follow the airport’s signs and staff instructions.|Here’s my + document when you hand it over. I’d like to + verb for an action. Could I + verb? for permission. Where is + place? for a location.|Here’s my… sert à présenter un document. Après I’d like to ou Could I, employez la base verbale.|Check in for a flight, say how many bags you have and find the new gate.
P|Hi, I’m checking in for the flight to Boston. Here’s my passport.|Bonjour, je viens m’enregistrer pour le vol pour Boston. Voici mon passeport.|Say this first at the check-in counter.
P|I’d like to check this bag, please. This is my carry-on.|Je voudrais enregistrer cette valise. Voici mon bagage cabine.|Check a bag means put it in the hold.
P|What time does boarding start? Which gate should I go to?|À quelle heure commence l’embarquement ? À quelle porte dois-je aller ?|Boarding time and departure time can be different.
V|boarding pass|carte d’embarquement|Could I see your boarding pass?
V|carry-on / hand luggage|bagage cabine (US / UK)|Do you have any hand luggage?
V|bag drop|dépose-bagages|Where is the bag drop?
V|boarding gate|porte d’embarquement|Your boarding gate is B12.
V|delayed / gate change|retardé / changement de porte|The flight is delayed. Check the screen for a gate change.
D|Agent|May I see your passport? Are you checking any bags?|Of course. Here’s my passport. Yes, I’m checking one bag.
D|Security officer|Please follow the instructions on the screen.|Sorry, could you say that again more slowly, please?
D|Gate agent|Your flight now boards at gate B12.|Sorry, did you say B12? What time does boarding start?
M|Here’s my passport. I have one bag to check. Where is gate B12?|Good morning. I’m checking in for the flight to Boston. I’d like to check one bag, please. Could you confirm the boarding time and gate?
Q|The agent says “Are you checking any bags?” How do you reply?|I’m from France.~Yes, just this suitcase.~I’d like a window table.|1|Checking a bag means handing it over to travel in the hold.
T|Ask for the boarding time.|What time does boarding start?|start?~boarding~What~does~time|What time + does + subject + base verb.
Q|Listen to the announcement. What is the new gate?|A12~B12~B15|1|The announcement says gate B twelve.
@arrive|Airport arrivals|Border questions, bags and transport|Follow arrivals signs. If asked by an officer, answer truthfully about your visit and stay. Find your baggage carousel, then follow customs signs and directions to ground transport.|I’m here for + reason. I’m staying at + hotel, for + duration. Use How do I get to + destination? to ask the way.|At indique ici le lieu de séjour. For indique ici la durée ou la raison du voyage.|Tell the officer the purpose and length of your visit. Then ask where to find your bag and how to get to town.
P|I’m here on holiday. I’m staying for five nights.|Je suis ici en vacances. Je reste cinq nuits.|On vacation is common in the US. Adapt the details to your real trip.
P|My suitcase hasn’t arrived. Where can I report it?|Ma valise n’est pas arrivée. Où puis-je le signaler ?|Learn this as a ready-made phrase at the baggage service desk.
P|How do I get to the city centre from here?|Comment puis-je rejoindre le centre-ville d’ici ?|In the US you can ask “How do I get downtown?”
V|passport control|contrôle des passeports|Where is passport control?
V|baggage claim / baggage reclaim|livraison des bagages (US / UK)|Follow the signs to baggage claim.
V|carousel|tapis à bagages|Which carousel is for this flight?
V|shuttle|navette|Is there a shuttle to the station?
V|the T / subway|transports de Boston / métro|Where can I catch the T?
D|Officer|What is the purpose of your visit?|I’m here on vacation. I’m staying for five nights.
D|Baggage agent|Which flight were you on?|The flight from Paris. My suitcase hasn’t arrived.
D|Information desk|You can take a shuttle to the station.|Where does the shuttle leave from?
M|I’m here on vacation. I’m staying at a hotel for five nights. Where is baggage claim?|I’m here on vacation for five nights. I’m staying at a hotel downtown. Could you tell me where baggage claim is and where I can catch the shuttle?
Q|Where do you collect a checked suitcase?|At the boarding gate.~At the hotel reception desk.~At baggage claim.|2|Baggage claim is the arrivals area for collecting checked luggage.
G|I’m staying ___ a hotel ___ five nights. (two words)|at for|At marks the place; for marks how long you stay.
@hotel|Hotel check-in & help|Reception, room problems and check-out|Give the booking name and number of nights. Ask about breakfast and check-out. If there’s a room problem, say what is wrong and ask for a solution.|I have a reservation under + name. Is breakfast included? The shower doesn’t work uses doesn’t + base verb. Could you send someone? asks for help.|Under + nom = au nom de. Après doesn’t, work reste sans s. Could you + verbe rend la demande polie.|Check in for two nights, ask about breakfast, then report a problem with the shower.
P|Hello, I have a reservation under [surname] for two nights.|Bonjour, j’ai une réservation au nom de [nom] pour deux nuits.|Have the confirmation handy.
P|Is breakfast included? What time is check-out?|Le petit-déjeuner est-il compris ? À quelle heure faut-il libérer la chambre ?|Ask these before you leave the desk.
P|The shower doesn’t work. Could you send someone to check it, please?|La douche ne fonctionne pas. Pourriez-vous envoyer quelqu’un pour vérifier ?|Describe the problem before asking for a solution.
V|quiet room|chambre calme|Could I have a quiet room, please?
V|key card|carte de chambre|Here is your key card.
V|extra towels / pillows|serviettes / oreillers supplémentaires|Could we have two extra towels, please?
V|card hold|préautorisation sur la carte|Is this a temporary hold or a charge?
D|Receptionist|Good evening. Do you have a reservation?|Yes, I have a reservation under [surname] for two nights.
D|Receptionist|Here’s your key card. Your room is on the third floor.|Thank you. Is breakfast included?
D|Receptionist|How can I help?|The shower doesn’t work. Could you send someone to check it, please?
M|I have a reservation under [surname]. Is breakfast included? What time is check-out?|Hello, I have a booking under [surname] for two nights. Could you confirm whether breakfast is included? Also, would it be possible to have a quiet room away from the lift?
Q|Which reports a problem politely?|The shower doesn’t work. Could you check it, please?~The shower don’t works.~I’d like the check, please.|0|Use doesn’t + work, then ask for help with Could you.
T|Ask about included breakfast.|Is breakfast included?|included?~Is~breakfast|Put Is first in a yes/no question.
G|The key card doesn’t ___ (work).|work|Use the base form after doesn’t.
@food|Restaurant English|Booking, ordering, correcting and paying|Ask for a table or give your reservation name. Order a drink and a dish. If needed, check ingredients or politely correct a mistake. Then ask for the bill or check and pay.|I’d like + thing; I’d like to + verb. Does this contain + ingredient? I ordered X, but this is Y. Could we have + the bill/check?|I’d like = je voudrais. Bill est courant au Royaume-Uni; check aux États-Unis. Contain signifie contenir.|Order a main with a side, check an ingredient, correct a wrong dish and pay by card.
P|Do you have a table for two? Could we see the menu, please?|Avez-vous une table pour deux ? Pourrions-nous voir la carte ?|Use when arriving without a reservation.
P|I’d like the salmon with vegetables, please. Does it contain nuts?|Je voudrais le saumon avec des légumes. Est-ce que ce plat contient des fruits à coque ?|If you have an allergy, state it clearly: I have a nut allergy.
P|Sorry, I ordered the soup, but this is the salad.|Excusez-moi, j’ai commandé la soupe, mais c’est la salade.|Say what you ordered and what you received.
P|Could we have the check, please? Can I pay by card?|Pourrions-nous avoir l’addition ? Puis-je payer par carte ?|In the UK, say the bill, please.
V|starter / appetizer|entrée (UK / US)|I’ll have the soup as a starter.
V|main course / entrée|plat principal (entrée, surtout US)|What comes with the main course?
V|side dish|accompagnement|Could I have vegetables as a side?
V|tap water|eau du robinet|Could we have some tap water, please?
V|dessert|dessert|Could we see the dessert menu?
D|Server|Are you ready to order?|Yes, I’d like the salmon with vegetables, please. Could I have some tap water?
D|Server|Here’s your salad.|Sorry, I ordered the soup, but this is the salad.
D|Server|Would you like dessert?|No, thank you. Could we have the check, please?
M|I’d like the salmon with vegetables, please. Could we have the check? Can I pay by card?|I’d like the salmon with vegetables, please. Could you tell me whether the sauce contains nuts? … Thank you. We’ll skip dessert. Could we have the check, and can we pay by card?
Q|You’re in Boston and want to pay. What can you say?|What is your departure gate?~Could we have the check, please?~Could we see the starter menu?|1|In the US, the check is the restaurant bill.
T|Ask politely for the menu.|Could we see the menu please?|menu~we~please?~see~Could~the|Could + we + see + the menu + please.
@tickets|Tickets & admission|Museum, ferry or attraction entrance|Check the date, entry time and entrance on your ticket. At the desk, show the ticket and confirm where to go. When buying one, state how many and ask for the total.|Here’s my ticket, or Here are our tickets. How much is + one item? How much are + plural items? How many + plural noun asks for a number.|Here’s pour un billet, Here are pour plusieurs. How much demande le prix; how many demande combien de billets.|Buy two tickets or show a booked ticket, ask about the entry time and find the entrance.
P|I’d like two tickets for the two o’clock tour, please.|Je voudrais deux billets pour la visite de 14 h.|Use for + time or event to specify which tickets.
P|Here’s my ticket. Is this the right entrance?|Voici mon billet. Est-ce la bonne entrée ?|Useful at a museum, ferry terminal or venue.
P|How much are the tickets? Do I need to book in advance?|Combien coûtent les billets ? Dois-je réserver à l’avance ?|Use are with tickets in the plural.
V|timed entry|entrée à horaire réservé|I have a timed-entry ticket for two p.m.
V|ticket desk|guichet|Where is the ticket desk?
V|scan a ticket|scanner un billet|Could you scan my ticket, please?
V|sold out|complet|The two o’clock tour is sold out.
D|Ticket clerk|How many tickets would you like?|Two, please. How much are they?
D|Entrance attendant|May I see your ticket?|Of course. Here’s my ticket. Is this the right entrance for the two o’clock tour?
M|Here’s my ticket. Is this the right entrance? What time does the tour start?|Hi, I have a ticket for the two o’clock tour. Could you scan it here, please? Where should I wait for the guide?
Q|You have one ticket ready. What do you say?|Where are my bags?~How many is it?~Here’s my ticket.|2|Use Here’s my + singular item when you hand it over.
G|How ___ tickets would you like?|many|Use many with plural countable nouns such as tickets.
@directions|Directions & transport|On the street, at a station or back to your hotel|Name your destination and ask whether to walk or take transport. Listen for a turn and a landmark. Repeat one detail to check. At a station, confirm the direction or platform before boarding.|Ask “How do I get to…?” and “Is it far?” Directions use the base verb: Go straight, turn left, take the first right. Use next to, opposite/across from and on your left.|Les consignes commencent par un verbe sans sujet. Opposite/across from = en face de. Next to = à côté de.|Ask how to get to the hotel or harbour. Repeat the turn, then ask about walking time or the best transport.
P|Excuse me, how do I get to the harbour?|Excusez-moi, comment aller au port ?|Start with Excuse me to get someone’s attention.
P|Is it within walking distance, or should I take the bus?|Est-ce accessible à pied ou devrais-je prendre le bus ?|Ask before choosing a route.
P|So I go straight and turn left at the bank, is that right?|Donc je continue tout droit et je tourne à gauche à la banque, c’est bien ça ?|Repeat the important part before leaving.
V|go straight on / go straight ahead|aller tout droit (UK / US)|Go straight ahead for two blocks.
V|cross the street|traverser la rue|Cross the street at the lights.
V|opposite / across from|en face de (across from est courant aux États-Unis)|The hotel is across from the station.
V|platform / stop|quai / arrêt|Which platform is it? Which stop should I get off at?
D|Local|Go straight and turn left at the bank. It’s across from the museum.|Thank you. Left at the bank, then across from the museum?
D|Station staff|Take the train towards downtown. Get off at the next stop.|Thanks. Which platform should I use?
M|Excuse me, how do I get to the hotel? Is it far? … Left at the bank, right?|Excuse me, is the hotel within walking distance? … Let me check I understood. I go straight, turn left at the bank and the hotel is across from the museum, right?
Q|“The café is across from the hotel.” Where is it?|On the other side of the street.~Inside the hotel.~Next to the reception desk.|0|Across from means opposite, on the other side.
T|Ask the way to the harbour.|How do I get to the harbour?|get~harbour?~do~to~How~the~I|How + do + I + get + to + place.
Q|Listen to the directions. Where do you turn right?|At the museum.~At the hotel.~At the bank.|2|The directions say to turn right at the bank.
`;

const rawRules = `
@be|Be · identity and origin|Say who you are, where you’re from or how you feel now.|I am / I’m from France.|I’m not from Boston.|Are you from France?|Be s’utilise seul. Am pour I, is pour he/she/it, are pour you/we/they. Pour une question, placez am/is/are avant le sujet.|Who are you? Where are you from? Right now.
Q|Choose the correct question.|Do you are from France?~Are you from France?~You is from France?|1|With be, put are before you.
@simple|Present simple · routines and timetables|Describe what you do regularly or give a scheduled time.|I meet couples. The train leaves at nine.|I don’t work on Sundays. The train doesn’t leave at eight.|Do you meet suppliers? When does the train leave?|Pour les habitudes et horaires. Avec he/she/it, ajoutez souvent -s (organises), parfois -es (goes). Have devient has. Après does/doesn’t, reprenez la base verbale.|Usually · every week · leaves at nine
Q|Which is a regular responsibility?|I’m meeting a supplier right now.~I’m going to meet a supplier tomorrow.~I meet suppliers every week.|2|Every week signals a repeated routine.
@continuous|Present continuous · right now or a confirmed arrangement|Use am/is/are + verb-ing for something in progress, or add a future time for an arrangement.|I’m checking in now. I’m meeting a client tomorrow at ten.|I’m not checking a bag today.|Are you checking any bags?|L’action est en cours ou le rendez-vous est déjà fixé. Gardez be devant le verbe en -ing. Make → making; sit → sitting.|Now · at the moment · tomorrow at ten (arrangement)
G|I ___ checking in right now. (full form)|am|Use am + checking with I.
@future|Going to · your travel plan|Use am/is/are + going to + base verb for an intention. Going to + place can mean you’re travelling there.|I’m going to take the train.|I’m not going to rent a car.|Are you going to take the bus?|Comparez I’m going to Boston (destination) et I’m going to visit Boston (projet + verbe).|Tomorrow · next week · after arrival
Q|Which expresses an intention about transport?|I’m going to take the bus.~I’m going take the bus.~I going to take the bus.|0|Use am + going to + the base verb take.
@past|Past simple · what happened|Use the past for a finished event. Learn common forms as pairs: go → went, take → took, order → ordered. For be use was/were without did.|I took the train yesterday. The flight was fine.|I didn’t take a taxi. The flight wasn’t late.|Did you take the train? How was your flight?|Après did ou didn’t, revenez à la base du verbe : take, pas took. Were pour you/we/they.|Yesterday · last night · on your last trip
G|Did you ___ (take) the train yesterday?|take|After did, use the base form.
@polite|Polite requests · ask clearly|Use Could I + verb to ask permission, Could you + verb for help, and I’d like + noun or to + verb for a request. Use I don’t need… to decline or specify.|I’d like a quiet room. I’d like to check in.|No, thank you. I don’t need a taxi.|Could you call a taxi, please?|Could + sujet + base verbale. I’d like a room, mais I’d like to book a room.|Excuse me · please · thank you
Q|Which politely asks someone to call a taxi?|Could you to call a taxi?~Could you call a taxi, please?~I’d like call a taxi.|1|After could you, use call without to.
@time|Dates, times and places · at, on, in|Use at for times and points, on for days and dates, in for months and larger places. Say the month aloud to avoid confusing day/month order.|We arrive at 3 p.m. on Friday, in May.|We don’t arrive on Thursday.|Do we arrive at three p.m. on Friday?|8:15 a.m. = eight fifteen in the morning. 3 p.m. = three in the afternoon. 6 May = the sixth of May (UK); May 6 = May sixth (US).|At the gate · on Monday · in Boston
Q|Complete “Your tour is ___ 2 p.m. ___ Saturday.”|in / at~on / in~at / on|2|At before a time and on before a day.
@compare|Compare travel options|Use -er for many short adjectives and more with longer ones. Add than for a comparison. Good becomes better. Use the + -est or the most to pick one option from a group.|The bus is cheaper than a taxi.|The bus isn’t faster than the train.|Which option is the most convenient?|Cheap → cheaper → the cheapest. Convenient → more convenient → the most convenient. Good → better → the best.|Compare cost, travel time and convenience.
Q|Compare the price of a bus and a taxi.|The bus is more cheap than a taxi.~The bus is cheaper than a taxi.~The bus is cheapest than a taxi.|1|Cheap is a short adjective. Use cheaper than.
`;

function parse(raw) {
  const entries = [];
  for (const line of raw.trim().split('\n')) {
    const [kind, ...parts] = line.split('|');
    if (kind.startsWith('@')) entries.push({id: kind.slice(1), meta: parts, lines: []});
    else entries.at(-1).lines.push([kind, ...parts]);
  }
  return entries;
}

const scenes = parse(rawScenes);
const rules = parse(rawRules);
const groups = [{id:'review', meta:['Verb review'], lines:rules.flatMap(rule => rule.lines)}, ...scenes];
const $ = id => document.getElementById(id);
const query = (selector, root = document) => Array.from(root.querySelectorAll(selector));
const escapeHtml = text => String(text).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fr = text => '<span class="fr" lang="fr">' + escapeHtml(text) + '</span>';
const listen = (text, label = '▶ Listen') => '<button type="button" class="audio-btn" data-say="' + escapeHtml(text) + '">' + label + '</button>';
const key = 'sabine-personal-travel-guide-v1';
let saved = {};
try { saved = JSON.parse(localStorage.getItem(key) || '{}') || {}; } catch {}
const state = Object.assign({guided:{}, exam:{}, deadline:0, submitted:false, mode:'guided', fields:{}, acquisition:{}, french:true, accent:'en-GB'}, saved);
const items = new Map();
const groupsOfItems = new Map();
const save = () => { try { localStorage.setItem(key, JSON.stringify(state)); } catch {} };

function heading(title, label, description = '') {
  return '<div class="section-head"><div><div class="eyebrow">' + escapeHtml(label) + '</div><h2>' + escapeHtml(title) +
    '</h2><p>' + escapeHtml(description) + '</p></div></div>';
}
function modelHtml(basic, stretch) {
  return '<details class="guided-only"><summary>Model answer · Clear (A2)</summary><p>' + escapeHtml(basic) + '</p>' + listen(basic) +
    '</details><details class="guided-only"><summary>Model answer · Stretch (B1)</summary><p>' + escapeHtml(stretch) + '</p>' + listen(stretch) + '</details>';
}
function vocabCard(english, french, example, phrase) {
  return '<article class="vocab-item"><div class="vocab-top"><strong>' + escapeHtml(english) + '</strong>' + listen(english) +
    '</div>' + fr(french) + '<p>' + escapeHtml(example) + '</p>' + (phrase ? '' : listen(example, '▶ Example')) + '</article>';
}
function selectOptions(select, options) {
  select.replaceChildren(...options.map(([value, label]) => new Option(label, value)));
}
const sceneOptions = scenes.map(scene => [scene.id, scene.meta[0]]);
selectOptions($('pocketSelect'), sceneOptions);
selectOptions($('vocabSelect'), sceneOptions);
$('pocketSelect').value = 'depart';
$('jump').innerHTML = scenes.map(scene => '<button class="secondary" type="button" data-pocket="' + scene.id + '">' + escapeHtml(scene.meta[0]) + '</button>').join('');
function renderPocket() {
  const scene = scenes.find(entry => entry.id === $('pocketSelect').value);
  $('pocketLines').innerHTML = scene.lines.filter(([kind]) => kind === 'P').map(([, ...line]) => vocabCard(...line, true)).join('') +
    '<p><a href="#' + scene.id + '">Practise this conversation ↓</a></p>';
}
function renderVocabulary() {
  const scene = scenes.find(entry => entry.id === $('vocabSelect').value);
  const term = $('filter').value.toLowerCase().trim();
  const lines = scene.lines.filter(([kind, ...line]) => ['P','V'].includes(kind) && line.join(' ').toLowerCase().includes(term));
  $('vocab').innerHTML = lines.map(([kind, ...line]) => vocabCard(...line, kind === 'P')).join('') || '<p>No matches in this category.</p>';
}
$('pocketSelect').addEventListener('change', renderPocket);
$('vocabSelect').addEventListener('change', renderVocabulary);
$('filter').addEventListener('input', renderVocabulary);
renderPocket();
renderVocabulary();

function exercise(line, group, unique) {
  const [type, question, answer, extra, explanation] = line;
  const id = group + '-' + unique;
  const options = type === 'Q' ? answer.split('~') : type === 'T' ? extra.split('~') : [];
  const correct = type === 'Q' ? Number(extra) : answer;
  items.set(id, {id, group, type, options, correct, explanation: type === 'Q' ? explanation : type === 'T' ? explanation : extra});
  if (!groupsOfItems.has(group)) groupsOfItems.set(group, []);
  groupsOfItems.get(group).push(id);
  const audioPrompts = {
    'depart-2': 'Attention, passengers for Boston. Your flight will now board at gate B twelve. Boarding starts at nine fifteen.',
    'directions-2': 'Go straight ahead and turn right at the bank. The hotel is across from the museum.'
  };
  const spoken = audioPrompts[id];
  const audio = spoken ? listen(spoken,'▶ Play the prompt') + '<details class="guided-only"><summary>Transcript</summary><p>' + escapeHtml(spoken) + '</p></details>' : '';
  const controls = type === 'Q' ? '<div class="answer-options">' + options.map((option, i) =>
    '<button class="choice-btn" type="button" aria-pressed="false" data-option="' + i + '">' + escapeHtml(option) + '</button>').join('') + '</div>' :
    type === 'T' ? '<p>Tap words to add them. Tap a word in your answer to return it.</p><div class="answer-zone tiles" aria-label="Your word order"></div><div class="word-bank tiles" aria-label="Available words"></div>' :
    '<label>Type the missing word(s) <input class="gap" autocomplete="off" spellcheck="false"></label>';
  return '<div class="exercise" data-exercise="' + id + '"><p>' + escapeHtml(question) + '</p>' + audio + controls +
    '<div class="exercise-actions"><button type="button" class="mini-btn guided-only" data-hint>Hint</button></div><p class="feedback" role="status"></p></div>';
}
function sectionReset(id) {
  return '<button type="button" class="mini-btn guided-only" data-reset="' + id + '">Reset this section’s practice</button>';
}
$('rules').innerHTML = rules.map(rule => {
  const [title, usage, positive, negative, question, french, cues] = rule.meta;
  return '<article class="panel rule-panel"><div class="study"><h3>' + escapeHtml(title) + '</h3><p>' + escapeHtml(usage) + '</p><div class="rule-forms">' +
    [['Affirmative',positive],['Negative',negative],['Question',question]].map(([label, sample]) => '<div><b>' + label + '</b>' + escapeHtml(sample) + '</div>').join('') +
    '</div><p class="note">' + escapeHtml(cues) + '</p>' + fr(french) + listen(positive + ' ' + question) + '</div>' +
    rule.lines.map((line, i) => exercise(line, 'review', rule.id + '-' + i)).join('') + '</article>';
}).join('') + '<div class="panel study"><h3>Compare three uses</h3><p><b>Every week:</b> I meet clients. <b>Right now:</b> I’m meeting a client. <b>Next week’s plan:</b> I’m going to meet a client.</p><p><b>Fixed timetable:</b> The flight leaves at nine. <b>Finished action:</b> I took the train yesterday.</p></div>' + sectionReset('review');
$('review').classList.remove('study');

function dialogueHtml(lines) {
  const turns = lines.map(([speaker, question, response], i) => '<div class="turn" data-turn="' + i + '"><p><b>' +
    escapeHtml(speaker) + '</b> · ' + escapeHtml(question) + listen(question) +
    '</p><label>Say your reply aloud, then compare <button class="mini-btn" type="button" data-reply aria-expanded="false">Show reply</button></label>' +
    '<p class="model-reply" hidden><b>Sample reply</b> · ' + escapeHtml(response) + listen(response) + '</p></div>').join('');
  return '<div class="dialogue-card study"><h3>Quick conversation · listen, answer, compare</h3>' + turns +
    '<details><summary>Full transcript</summary>' + lines.map(([speaker, question, response]) => '<p><b>' + escapeHtml(speaker) + '</b> · ' +
    escapeHtml(question) + '<br><b>Reply</b> · ' + escapeHtml(response) + '</p>').join('') + '</details><div class="audio-row">' +
    listen(lines.flatMap(([,question,response]) => [question,response]).join(' '), '▶ Play full dialogue') + '</div></div>';
}
function builderHtml() {
  return '<div class="panel study"><h3>Build your introduction</h3><div class="grid-2">' +
    '<label>Your first name <input id="profileName" placeholder="Your name"></label><label>Where you’re from <input id="profileFrom" placeholder="e.g. France"></label>' +
    '<label>Where you live now <input id="profileHome" placeholder="e.g. Lyon"></label><label>Choose a responsibility <select id="profileTask"><option>help couples choose a venue</option><option>contact suppliers and confirm the schedule</option><option>coordinate the team on the wedding day</option></select></label></div>' +
    '<div class="row"><label>Model length <select id="profileLevel"><option value="clear">Clear</option><option value="stretch">Stretch</option></select></label>' +
    '<button class="primary" type="button" id="buildProfile">Build introduction</button></div><div class="note" id="profileOutput" aria-live="polite">Fill in the details and build your introduction.</div></div>';
}
function calendarHtml() {
  return '<div class="panel study"><h3>Build your departure and arrival plan</h3><p>Use your own details or the example. Say your two times out loud before you listen.</p>' +
    '<div class="grid-2"><label>Departure day <select id="day"></select></label><label>Departure time <select id="departureTime"></select></label>' +
    '<label>Arrival time <select id="arrivalTime"></select></label><label>Transport after arrival <select id="transport"><option>subway</option><option>shuttle</option><option>train</option><option>bus</option><option>taxi</option></select></label></div>' +
    '<p id="planOutput" class="note" aria-live="polite"></p><div id="planAudio"></div></div>';
}
$('scenes').innerHTML = scenes.map(scene => {
  const [title, context, steps, grammar, french, mission] = scene.meta;
  const phrases = scene.lines.filter(([kind]) => kind === 'P');
  const dialogue = scene.lines.filter(([kind]) => kind === 'D').map(([, ...line]) => line);
  const [, basic, stretch] = scene.lines.find(([kind]) => kind === 'M');
  const checks = scene.lines.filter(([kind]) => ['Q','T','G'].includes(kind));
  return '<section id="' + scene.id + '" class="section">' + heading(title, context) + '<div class="panel scenario-panel">' +
    '<div class="study"><div class="note"><b>What to do</b><p>' + escapeHtml(steps) + '</p></div><div class="tip"><b>Build the sentence</b><p>' +
    escapeHtml(grammar) + '</p>' + fr(french) + '</div><div class="vocab-list">' + phrases.map(([, ...line]) => vocabCard(...line, true)).join('') + '</div></div>' +
    '<div><h3>Quick checks</h3>' + checks.map((line,i) => exercise(line, scene.id, i)).join('') + sectionReset(scene.id) + '</div>' +
    dialogueHtml(dialogue) + '<div class="study"><h3>Now you try</h3><p>' + escapeHtml(mission) + '</p>' + modelHtml(basic, stretch) + '</div></div>' +
    (scene.id === 'work' ? builderHtml() : scene.id === 'prep' ? calendarHtml() : '') + '</section>';
}).join('');
$('missionModels').innerHTML = modelHtml(
  'Hi, I’m [name]. I’m from [place]. I’m a wedding planner. What do you do for work? … Here’s my passport. Where is gate B12? … Where is baggage claim? … I have a reservation under [name]. Is breakfast included? … I’d like the salmon, please. Could we have the check? … Here’s my ticket. How do I get back to the hotel?',
  'Lovely to meet you. I’m originally from [place]. I help couples choose a venue and coordinate suppliers on the wedding day. How about you? … I’d like to check this bag. Could you confirm the gate? … Where can I catch the shuttle? … I have a reservation for two nights. Could you confirm whether breakfast is included? … I’d like the salmon with vegetables. Could we have the check, please? … Here’s my ticket for the two o’clock tour. So I turn left at the bank to get back to the hotel, right?'
);
$('nav').insertAdjacentHTML('beforeend', scenes.map(scene => '<a href="#' + scene.id + '">' + escapeHtml(scene.meta[0]) + '</a>').join('') + '<a href="#mission">Final role-play</a><a href="#tracking">Lesson record</a>');

const normalize = value => String(value ?? '').toLowerCase().replace(/[’‘]/g, "'").replace(/[.,!?/]/g, ' ').trim().replace(/\s+/g, ' ');
const tileAnswer = (item, selection) => (selection || []).map(index => item.options[index]).join(' ');
function correct(item, selection) {
  if (item.type === 'Q') return selection === item.correct;
  const value = item.type === 'T' ? tileAnswer(item, selection) : selection;
  return normalize(value) === normalize(item.correct);
}
function hasAnswer(value) {
  return Array.isArray(value) ? value.length > 0 : typeof value === 'number' || Boolean(value?.trim());
}
const roots = new Map(query('[data-exercise]').map(root => [root.dataset.exercise, root]));
const activeAnswers = () => state[state.mode];
const locked = () => state.mode === 'exam' && (!state.deadline || state.submitted || Date.now() >= state.deadline);
function drawFeedback(item, root) {
  const response = activeAnswers()[item.id];
  const feedback = root.querySelector('.feedback');
  let text = '';
  let tone = '';
  const showExamResult = state.mode === 'exam' && state.submitted;
  if (state.mode === 'guided' || showExamResult) {
    if (correct(item,response)) { text = '✓ Correct. ' + item.explanation; tone = 'good'; }
    else if (hasAnswer(response) && (item.type !== 'T' || response.length === item.options.length || showExamResult)) {
      text = '✗ ' + (showExamResult ? 'Incorrect. ' + item.explanation : 'Not yet. Try again or open the hint.');
      tone = 'bad';
    } else if (showExamResult) text = 'Unanswered.';
    else if (hasAnswer(response) && item.type === 'T') {
      const expected = item.correct.split(' ');
      const prefixMatches = response.every((index, i) => normalize(item.options[index]) === normalize(expected[i]));
      text = prefixMatches ? '✓ Good so far. Keep going.' : '✗ Check the order so far.';
      tone = prefixMatches ? 'good' : 'bad';
    }
    if (showExamResult && !correct(item,response)) text += ' Answer: ' + (item.type === 'Q' ? item.options[item.correct] : item.correct);
  }
  feedback.textContent = text;
  feedback.className = 'feedback ' + tone;
}
function drawItem(item, syncInput = true) {
  const root = roots.get(item.id);
  const value = activeAnswers()[item.id];
  if (item.type === 'Q') {
    query('[data-option]', root).forEach(button => {
      button.disabled = locked();
      button.setAttribute('aria-pressed', String(Number(button.dataset.option) === value));
    });
  } else if (item.type === 'G') {
    const input = root.querySelector('input');
    if (syncInput) input.value = value || '';
    input.disabled = locked();
  } else {
    const focus = document.activeElement?.dataset.tile;
    const selected = Array.isArray(value) ? value : [];
    const tile = index => '<button class="word-chip" type="button" data-tile="' + index + '"' +
      (locked() ? ' disabled' : '') + '>' + escapeHtml(item.options[index]) + '</button>';
    root.querySelector('.answer-zone').innerHTML = selected.map(tile).join('');
    root.querySelector('.word-bank').innerHTML = item.options.map((_,index) => index).filter(index => !selected.includes(index)).map(tile).join('');
    if (focus !== undefined) root.querySelector('[data-tile="' + focus + '"]')?.focus({preventScroll:true});
  }
  drawFeedback(item, root);
}
function scoreFor(ids, responses) {
  return ids.reduce((sum,id) => sum + Number(correct(items.get(id),responses[id])),0);
}
const columns = ['Section','Objectif visé','Contenu abordé','Types d’exercices','Résultats guidés','Résultats examen','Compétences','Prochaines étapes','Statut','Lien leçon','Notes formatrice'];
const nextSteps = {review:'Revoir la règle et refaire les phrases difficiles.', intro:'Se présenter sans lire, puis poser une question.', work:'Présenter deux tâches et expliquer leur ordre.', chat:'Ajouter une relance et une formule de clôture.', prep:'Redire le jour, l’heure et le moyen de transport.', depart:'Simuler le guichet et confirmer la porte.', arrive:'S’entraîner à demander où récupérer la valise.', hotel:'Simuler la réception et résoudre un problème.', food:'Commander puis demander l’addition.', tickets:'Montrer le billet et confirmer l’entrée.', directions:'Répéter le chemin pour vérifier.'};
function groupData(group) {
  const [title, context, , grammar] = group.meta;
  const ids = groupsOfItems.get(group.id);
  return {title, context:context || 'Révision des verbes et questions', grammar:grammar || 'Be, présent simple, présent en -ing, going to, passé simple, demandes, dates et comparatifs', guided:scoreFor(ids,state.guided) + '/' + ids.length, exam:state.submitted ? scoreFor(ids,state.exam) + '/' + ids.length : '—'};
}
function updateScores() {
  const ids = [...items.keys()];
  $('score').textContent = 'Guided ' + scoreFor(ids,state.guided) + '/' + ids.length +
    (state.submitted ? ' · Exam ' + scoreFor(ids,state.exam) + '/' + ids.length : '');
  groups.forEach(group => {
    const data = groupData(group);
    const row = $('row-' + group.id);
    row.cells[1].textContent = data.guided;
    row.cells[2].textContent = data.exam;
  });
}
const statuses = ['', 'Acquis', 'En cours', 'Non acquis'];
$('trackingRows').innerHTML = groups.map(group => '<tr id="row-' + group.id + '"><th scope="row">' + escapeHtml(group.meta[0]) +
  '</th><td></td><td></td><td><select aria-label="Acquisition: ' + escapeHtml(group.meta[0]) + '" data-status="' + group.id + '">' +
  statuses.map(status => '<option value="' + status + '">' + (status || '— À renseigner') + '</option>').join('') + '</select></td></tr>').join('');
for (const select of query('[data-status]')) {
  select.value = state.acquisition[select.dataset.status] || '';
  select.addEventListener('change', () => {state.acquisition[select.dataset.status] = select.value; save();});
}
function tsv() {
  const rows = groups.map(group => {
    const data = groupData(group);
    const labels = {Q:'QCM',G:'Texte à trous',T:'Ordre des mots'};
    const types = [...new Set(groupsOfItems.get(group.id).map(id => labels[items.get(id).type]))];
    if (group.id !== 'review') types.push('Dialogue', 'Jeu de rôle');
    return [data.title,data.context,data.grammar,types.join(', '),data.guided,data.exam,group.id === 'review' ? 'Grammaire fonctionnelle' : 'Compréhension et interaction orales',nextSteps[group.id],state.acquisition[group.id] || '',state.fields.lessonUrl || '',state.fields.trainerNotes || ''];
  });
  return [columns,...rows].map(row => row.map(value => {
    const clean = String(value).replace(/[\t\r\n]+/g,' ');
    return /^[=+@-]/.test(clean) ? "'" + clean : clean;
  }).join('\t')).join('\n');
}
async function copyTracking() {
  try {
    await navigator.clipboard.writeText(tsv());
    $('copyStatus').textContent = 'Tracking copied.';
  } catch {
    const field = document.createElement('textarea');
    field.value = tsv();
    $('copyStatus').replaceChildren('Select and copy the tracking below.',field);
    field.focus();
    field.select();
  }
}
$('copyTracking').addEventListener('click',copyTracking);
$('saveTracking').addEventListener('click', () => {
  const url = URL.createObjectURL(new Blob(['\ufeff',tsv()],{type:'text/tab-separated-values;charset=utf-8'}));
  const link = Object.assign(document.createElement('a'), {href:url, download:'Sabine_Travel_Review_CFL.tsv'});
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
const profileExamples = {
  clear: 'Hi, I’m Alex. I’m from France and I live in Lyon. I’m a wedding planner. I help couples choose a venue. How about you?',
  stretch: 'Lovely to meet you. I’m Alex. I’m originally from France, and I now live in Lyon. I’m a wedding planner. As part of my work, I help couples choose a venue. What do you do for work?'
};
function buildProfile() {
  const name = $('profileName').value.trim() || '[your name]';
  const from = $('profileFrom').value.trim() || '[your place of origin]';
  const home = $('profileHome').value.trim() || '[your town]';
  const task = $('profileTask').value;
  const text = $('profileLevel').value === 'stretch' ?
    'Lovely to meet you. I’m ' + name + '. I’m originally from ' + from + ', and I now live in ' + home + '. I’m a wedding planner. As part of my work, I ' + task + '. What do you do for work?' :
    'Hi, I’m ' + name + '. I’m from ' + from + ' and I live in ' + home + '. I’m a wedding planner. I ' + task + '. How about you?';
  $('profileOutput').innerHTML = '<p>' + escapeHtml(text) + '</p>' + listen(text, '▶ Listen to your introduction') +
    listen(state.fields.profileLevel === 'stretch' ? profileExamples.stretch : profileExamples.clear, '▶ Listen to an example');
}
$('buildProfile').addEventListener('click',buildProfile);
for (const id of ['profileName','profileFrom','profileHome','profileTask','profileLevel','reflection','lessonUrl','trainerNotes']) {
  const input = $(id);
  if (id in state.fields) input.value = state.fields[id];
  else if (id === 'lessonUrl' && /^https?:/.test(location.href)) input.value = location.href.split('#')[0];
  state.fields[id] = input.value;
  input.addEventListener('input', () => {state.fields[id] = input.value; save();});
}
if (state.fields.profileName || state.fields.profileFrom || state.fields.profileHome) buildProfile();

const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const times = ['8:15 a.m.','10:30 a.m.','1:00 p.m.','3:00 p.m.','5:45 p.m.','8:00 p.m.'];
selectOptions($('day'),days.map(day => [day,day]));
selectOptions($('departureTime'),times.map(time => [time,time]));
selectOptions($('arrivalTime'),times.map(time => [time,time]));
$('day').value = 'Friday';
$('arrivalTime').value = '3:00 p.m.';
function renderPlan() {
  const parts = [
    'My flight leaves at ' + $('departureTime').value + ' on ' + $('day').value + '.',
    'It arrives at ' + $('arrivalTime').value + ' local time.',
    'I’m going to take ' + ($('transport').value === 'taxi' ? 'a taxi' : 'the ' + $('transport').value) + ' to the hotel.'
  ];
  $('planOutput').textContent = parts.join(' ');
  $('planAudio').innerHTML = '<button type="button" class="audio-btn" data-audio-parts="' +
    escapeHtml(JSON.stringify(parts)) + '">▶ Listen to your travel plan</button>';
}
for (const id of ['day','departureTime','arrivalTime','transport']) {
  const input = $(id);
  if (state.fields[id]) input.value = state.fields[id];
  input.addEventListener('change', () => {state.fields[id] = input.value;save();renderPlan();});
}
renderPlan();

function setFrench() {
  document.body.classList.toggle('help-off', !state.french);
  $('french').textContent = '🇫🇷 French help: ' + (state.french ? 'ON' : 'OFF');
  $('french').setAttribute('aria-pressed', String(state.french));
}
$('french').addEventListener('click',() => {state.french = !state.french; setFrench(); save();});
$('accent').value = state.accent;
$('accent').addEventListener('change',() => {state.accent = $('accent').value; save();});
setFrench();

let activeAudio = null;
let activeButton = null;
let originalLabel = '';
let audioRequest = 0;
function stopAudio() {
  audioRequest++;
  if (activeAudio) {
    activeAudio.pause();
    activeAudio = null;
  }
  window.speechSynthesis?.cancel();
  if (activeButton) activeButton.textContent = originalLabel;
  activeButton = null;
}
function playbackMessage(message) {
  if (!activeButton) return;
  activeButton.textContent = message;
  const request = audioRequest;
  setTimeout(() => { if (request === audioRequest) stopAudio(); }, 4000);
}
function speak(text, button) {
  const parts = Array.isArray(text) ? text : [text];
  const recordings = parts.map(part => window.lessonAudioClips?.[part]);
  stopAudio();
  activeButton = button;
  originalLabel = button.textContent;
  const request = audioRequest;
  if (recordings.every(index => index !== undefined)) {
    const accent = state.accent;
    const player = new Audio();
    activeAudio = player;
    let next = 0;
    const playNext = () => {
      if (request !== audioRequest) return;
      if (next === recordings.length) { stopAudio(); return; }
      player.src = 'audio/' + accent + '/' + String(recordings[next++]).padStart(3,'0') + '.mp3';
      player.play().catch(() => {
        if (request === audioRequest) playbackMessage('Audio unavailable · extract the full ZIP');
      });
    };
    player.addEventListener('ended', playNext);
    button.textContent = '♪ Playing…';
    playNext();
    return;
  }

  const synthesis = window.speechSynthesis;
  const voice = synthesis?.getVoices().find(candidate => candidate.lang.toLowerCase().replace('_','-') === state.accent.toLowerCase());
  if (!voice || !window.SpeechSynthesisUtterance) {
    playbackMessage('Device voice unavailable · try the example');
    return;
  }
  const utterance = new SpeechSynthesisUtterance(parts.join(' '));
  utterance.lang = state.accent;
  utterance.voice = voice;
  utterance.rate = .88;
  utterance.onend = () => { if (request === audioRequest) stopAudio(); };
  utterance.onerror = () => {
    if (request === audioRequest) playbackMessage('Device voice unavailable · try the example');
  };
  button.textContent = '♪ Playing…';
  synthesis.speak(utterance);
}
$('stop').addEventListener('click', stopAudio);
$('accent').addEventListener('change', stopAudio);
$('print').addEventListener('click', () => window.print());

function refresh() {
  $('mode').value = state.mode;
  document.body.classList.toggle('exam',state.mode === 'exam');
  $('examBox').hidden = state.mode !== 'exam';
  $('start').disabled = Boolean(state.deadline && !state.submitted);
  $('start').textContent = state.submitted ? 'Start fresh 12-minute attempt' : 'Start 12-minute attempt';
  $('submit').disabled = !state.deadline || state.submitted;
  for (const item of items.values()) drawItem(item);
  updateScores();
  tick();
}
function finish() {
  state.submitted = true;
  save();
  refresh();
}
function tick() {
  if (!state.deadline) {$('clock').textContent = 'Ready'; return;}
  if (state.submitted) {$('clock').textContent = 'Submitted · review answers below'; return;}
  const seconds = Math.max(0,Math.ceil((state.deadline-Date.now())/1000));
  if (!seconds) {finish();return;}
  $('clock').textContent = Math.floor(seconds/60) + ':' + String(seconds%60).padStart(2,'0');
}
$('mode').addEventListener('change', () => {state.mode = $('mode').value; save(); refresh();});
$('start').addEventListener('click', () => {
  state.exam = {};
  state.submitted = false;
  state.deadline = Date.now() + 12*60*1000;
  save();
  refresh();
});
$('submit').addEventListener('click',finish);
setInterval(tick, 500);

document.addEventListener('click',event => {
  const button = event.target.closest('button');
  if (!button) return;
  const data = button.dataset;
  if (data.say) {speak(data.say,button);return;}
  if (data.audioParts) {speak(JSON.parse(data.audioParts),button);return;}
  if (data.pocket) {$('pocketSelect').value = data.pocket;renderPocket();return;}
  if (data.reply !== undefined) {
    const reply = button.closest('.turn').querySelector('.model-reply');
    reply.hidden = !reply.hidden;
    button.textContent = reply.hidden ? 'Show reply' : 'Hide reply';
    button.setAttribute('aria-expanded',String(!reply.hidden));
    return;
  }
  if (data.reset && state.mode === 'guided') {
    for (const id of groupsOfItems.get(data.reset)) {delete state.guided[id];drawItem(items.get(id));}
    save();updateScores();
    return;
  }
  const root = button.closest('[data-exercise]');
  if (!root || locked()) return;
  const item = items.get(root.dataset.exercise);
  if (data.hint !== undefined && state.mode === 'guided') {
    const feedback = root.querySelector('.feedback');
    feedback.className = 'feedback';
    feedback.textContent = 'Hint: ' + item.explanation;
    return;
  }
  const answers = activeAnswers();
  if (data.option !== undefined) answers[item.id] = Number(data.option);
  else if (data.tile !== undefined) {
    const index = Number(data.tile);
    const selected = answers[item.id] || [];
    answers[item.id] = selected.includes(index) ? selected.filter(value => value !== index) : [...selected,index];
  } else return;
  save();
  drawItem(item);
  updateScores();
});
document.addEventListener('input',event => {
  if (!event.target.matches('input.gap') || locked()) return;
  const item = items.get(event.target.closest('[data-exercise]').dataset.exercise);
  activeAnswers()[item.id] = event.target.value;
  save();
  drawItem(item,false);
  updateScores();
});

const earlier = [
  ['Wedding planner English','https://speakeasytisha.github.io/wedding-planner-magic-speak-a1-a2-v3.html'],
  ['From first contact to the wedding day','https://speakeasytisha.github.io/ceremonie-story-journey.html'],
  ['Time, dates and schedules','https://speakeasytisha.github.io/time-dates-schedules-present-simple.html'],
  ['Tense Bootcamp','https://speakeasytisha.github.io/sabine-tense-bootcamp-present-future.html'],
  ['Prepositions and comparisons','https://speakeasytisha.github.io/sabine-prepositions-comparatives-reading-v2.html'],
  ['Wedding English Rescue Kit','https://speakeasytisha.github.io/sabine-wedding-english-rescue-kit-fixed.html'],
  ['Wedding English Confidence Studio','https://speakeasytisha.github.io/Sabine/Lesson_14/sabine-confidence-studio.html'],
  ['Scottish Highlands Dream Trip','https://speakeasytisha.github.io/Sabine/Lesson_16/scottish-highlands-dream-trip.html'],
  ['Coastal Dream Escapes Studio','https://speakeasytisha.github.io/Sabine/Lesson_17/sabine-coastal-trio.html'],
  ['Boston & Provincetown Real Trip Studio','https://speakeasytisha.github.io/Sabine/Lesson_18/index.html'],
  ['Boston & Provincetown lesson notes','https://docs.google.com/document/d/199KDhdLIPH7kUVwc-RmlTbLzN_2bxyeeQ846vDIcmtY/edit'],
  ['Present simple practice','https://speakeasytisha.github.io/Present-simple'],
  ['Discover the wedding business','https://speakeasytisha.github.io/ceremonie-story-discovery.html'],
  ['Wedding preparations and future plans','https://speakeasytisha.github.io/wedding-preparations-sabine-addon.html'],
  ['Wedding email studio','https://speakeasytisha.github.io/sabine-email-studio-addon-fixed-v3.html'],
  ['CLOE introduction','https://speakeasytisha.github.io/cloe-exam-prep.html'],
  ['CLOE practice with wedding scenarios','https://speakeasytisha.github.io/sabine-cloe-realistic-crash.html'],
  ['Past simple foundations','https://speakeasytisha.github.io/cloe-past-simple-foundation-addon.html'],
  ['CLOE practice simulator','https://speakeasytisha.github.io/cloe-exam-simulator-general.html']
];
$('earlierLinks').innerHTML = '<ul>' + earlier.map(([title,url]) => '<li><a href="' + escapeHtml(url) +
  '" target="_blank" rel="noopener">' + escapeHtml(title) + '</a></li>').join('') + '</ul>';
refresh();
