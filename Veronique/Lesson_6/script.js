const DATA = {"timePrep": [{"q": "We are travelling ___ May.", "a": "in", "o": ["at", "on", "in"], "h": "Use IN with months and seasons."}, {"q": "Check-in is ___ 3:00 p.m.", "a": "at", "o": ["at", "on", "in"], "h": "Use AT with a precise time."}, {"q": "The reservation starts ___ May 12th.", "a": "on", "o": ["at", "on", "in"], "h": "Use ON with a date or day."}, {"q": "We will arrive ___ the afternoon.", "a": "in", "o": ["at", "on", "in"], "h": "Morning / afternoon / evening normally use IN."}, {"q": "The rooftop is beautiful ___ night.", "a": "at", "o": ["at", "on", "in"], "h": "The fixed expression is AT night."}, {"q": "Spring in New York is ___ March, April and May.", "a": "in", "o": ["at", "on", "in"], "h": "Use IN with months."}, {"q": "Breakfast starts ___ 6:00 a.m.", "a": "at", "o": ["at", "on", "in"], "h": "Precise clock time = AT."}, {"q": "Our stay ends ___ Friday morning.", "a": "on", "o": ["at", "on", "in"], "h": "Day + part of day = ON Friday morning."}], "amenities": [{"q": "Choose the correct description: The hotel ___ a 24-hour fitness center.", "a": "has", "o": ["has", "have", "is have"], "h": "Hotel = it, so use HAS."}, {"q": "Choose the negative: The hotel ___ a swimming pool.", "a": "doesn't have", "o": ["hasn't", "doesn't have", "isn't have"], "h": "Present simple negative: DOESN'T + base verb."}, {"q": "Choose the question.", "a": "Does the hotel have room service?", "o": ["Does the hotel have room service?", "Does the hotel has room service?", "Has the hotel room service?"], "h": "DOES + subject + base verb HAVE."}, {"q": "The rate ___ breakfast.", "a": "includes", "o": ["includes", "is include", "include"], "h": "Rate = it, so INCLUDE becomes INCLUDES."}, {"q": "Breakfast ___ in this rate.", "a": "is included", "o": ["includes", "is included", "is include"], "h": "Passive form: BE + past participle."}, {"q": "Choose the negative passive.", "a": "Breakfast isn't included.", "o": ["Breakfast doesn't included.", "Breakfast isn't included.", "Breakfast not includes."], "h": "BE + not + past participle."}, {"q": "Choose the correct question.", "a": "Is breakfast included?", "o": ["Does breakfast included?", "Is breakfast included?", "Is included breakfast?"], "h": "Passive question: IS + subject + past participle."}, {"q": "The room ___ a city view.", "a": "has", "o": ["have", "has", "is"], "h": "Room = it, so HAS."}, {"q": "The room rate ___ the spa treatment.", "a": "doesn't include", "o": ["isn't include", "doesn't include", "not includes"], "h": "Present simple negative: DOESN'T + INCLUDE."}, {"q": "Which question asks about the contents of the rate?", "a": "What does the rate include?", "o": ["What the rate includes?", "What does the rate include?", "What is the rate include?"], "h": "WHAT + DOES + subject + base verb."}], "phrasal": [{"q": "You arrive and register at the hotel. You ___ .", "a": "check in", "o": ["check in", "check out", "go out"], "h": "IN often suggests entering / starting a stay."}, {"q": "You leave the hotel and settle the final bill. You ___ .", "a": "check out", "o": ["check in", "check out", "fill in"], "h": "OUT often suggests leaving / finishing."}, {"q": "Complete a registration form = ___ the form.", "a": "fill out", "o": ["fill out", "go out", "check out"], "h": "FILL OUT means complete a form."}, {"q": "Search for your booking in the computer = ___ the reservation.", "a": "look up", "o": ["look up", "wake up", "pick up"], "h": "LOOK UP = search for information."}, {"q": "Collect your luggage later = ___ your luggage.", "a": "pick up", "o": ["drop off", "pick up", "send up"], "h": "PICK UP = collect."}, {"q": "Leave your luggage with the bell desk = ___ your luggage.", "a": "drop off", "o": ["drop off", "go through", "come back"], "h": "DROP OFF = leave something or someone at a place."}, {"q": "There is no more toilet paper. You have ___ toilet paper.", "a": "run out of", "o": ["gone through", "run out of", "checked out"], "h": "RUN OUT OF = have none left."}, {"q": "Housekeeping will ___ extra towels to your room.", "a": "send up", "o": ["send up", "go out", "fill out"], "h": "UP can describe movement to a higher floor."}, {"q": "Arrange a wake-up call = ___ a wake-up call.", "a": "set up", "o": ["set up", "pick up", "check out"], "h": "SET UP often means arrange or prepare."}, {"q": "Review the reservation details together = ___ the details.", "a": "go through", "o": ["go through", "go out", "run out"], "h": "GO THROUGH can mean review step by step."}], "recommend": [{"q": "You want a recommendation for dinner. Which is most natural?", "a": "What would you recommend for dinner?", "o": ["What would you recommend for dinner?", "What you recommend dinner?", "May you recommend dinner me?"], "h": "WOULD YOU RECOMMEND is a very natural recommendation question."}, {"q": "Ask for a nearby restaurant politely.", "a": "Could you recommend a good restaurant nearby?", "o": ["Could you recommend a good restaurant nearby?", "Could you to recommend a restaurant?", "Should you recommend me restaurant?"], "h": "COULD + subject + base verb."}, {"q": "Ask what is the best option.", "a": "Where should we go for breakfast?", "o": ["Where should we go for breakfast?", "Where we should go for breakfast?", "Where should we going?"], "h": "Direct question: question word + SHOULD + subject + base verb."}, {"q": "Give advice in the affirmative.", "a": "You should book the rooftop in advance.", "o": ["You should book the rooftop in advance.", "You should to book the rooftop.", "You should booked the rooftop."], "h": "SHOULD + base verb."}, {"q": "Give advice in the negative.", "a": "You shouldn't wait until the last minute.", "o": ["You don't should wait.", "You shouldn't wait until the last minute.", "You shouldn't to wait."], "h": "SHOULDN'T + base verb."}, {"q": "Which question is a polite indirect recommendation question?", "a": "Could you tell me which restaurant you would recommend?", "o": ["Could you tell me which restaurant would you recommend?", "Could you tell me which restaurant you would recommend?", "Could tell me which restaurant you recommend would?"], "h": "After 'Could you tell me', use statement order."}, {"q": "Ask the concierge for an activity suggestion.", "a": "Do you have any recommendations for this evening?", "o": ["Do you have any recommendations for this evening?", "Have you recommendations evening?", "Are you recommend something?"], "h": "'Do you have any recommendations for…?' is a useful fixed frame."}, {"q": "Choose the natural answer to 'What would you recommend?'", "a": "I'd recommend the rooftop around sunset.", "o": ["I'd recommend the rooftop around sunset.", "I recommend to you must rooftop.", "You may recommended rooftop."], "h": "I'D RECOMMEND + noun / -ing phrase."}], "pastSimple": [{"q": "Affirmative: Yesterday, we ___ at the hotel at 3 p.m.", "a": "checked in", "o": ["checked in", "have checked in", "check in"], "h": "Finished time: yesterday → Past Simple."}, {"q": "Affirmative: The receptionist ___ our reservation immediately.", "a": "found", "o": ["find", "found", "has found"], "h": "Completed action during the stay → Past Simple."}, {"q": "Affirmative: We ___ breakfast at the hotel on Tuesday.", "a": "had", "o": ["have", "had", "have had"], "h": "Specific finished day → Past Simple."}, {"q": "Affirmative: The room ___ very quiet last night.", "a": "was", "o": ["was", "has been", "is"], "h": "BE in the past: I/he/she/it = was."}, {"q": "Affirmative: The staff ___ very helpful.", "a": "were", "o": ["was", "were", "have been"], "h": "STAFF can be treated as plural here; WERE fits the exercise."}, {"q": "Affirmative: We ___ the concierge for a restaurant recommendation.", "a": "asked", "o": ["asked", "have asked", "ask"], "h": "Completed action at a finished moment."}, {"q": "Affirmative: Housekeeping ___ extra towels to the room.", "a": "brought", "o": ["bringed", "brought", "has brought"], "h": "BRING is irregular: brought."}, {"q": "Negative: We ___ room service yesterday.", "a": "didn't use", "o": ["didn't used", "didn't use", "haven't used"], "h": "DIDN'T + base verb."}, {"q": "Negative: The room ___ a park view.", "a": "didn't have", "o": ["didn't had", "didn't have", "hasn't had"], "h": "DIDN'T + HAVE."}, {"q": "Negative: We ___ late.", "a": "weren't", "o": ["wasn't", "weren't", "haven't been"], "h": "WE + BE in the past = were / weren't."}, {"q": "Negative: The hotel ___ our first email.", "a": "didn't answer", "o": ["didn't answered", "didn't answer", "hasn't answer"], "h": "DIDN'T + base verb ANSWER."}, {"q": "Negative: I ___ the minibar.", "a": "didn't use", "o": ["didn't use", "didn't used", "haven't use"], "h": "DIDN'T + base verb."}, {"q": "Question: ___ you enjoy the breakfast?", "a": "Did", "o": ["Did", "Have", "Were"], "h": "Past Simple question with a normal verb: DID + subject + base verb."}, {"q": "Question: What time ___ you check out?", "a": "did", "o": ["did", "have", "were"], "h": "WHAT TIME + DID + subject + base verb."}, {"q": "Question: ___ the room clean when you arrived?", "a": "Was", "o": ["Did", "Was", "Has"], "h": "BE uses WAS/WERE directly; no DID."}, {"q": "Question: ___ they charge you for breakfast?", "a": "Did", "o": ["Did", "Have", "Were"], "h": "DID + subject + base verb CHARGE."}, {"q": "Question: Where ___ you stay last year?", "a": "did", "o": ["did", "have", "were"], "h": "Specific finished time 'last year' → Past Simple."}, {"q": "Choose the correct sentence.", "a": "We stayed there for five nights last May.", "o": ["We have stayed there for five nights last May.", "We stayed there for five nights last May.", "We did stayed there for five nights."], "h": "Last May is finished → Past Simple."}, {"q": "Choose the correct negative with BE.", "a": "The lobby wasn't crowded.", "o": ["The lobby didn't be crowded.", "The lobby wasn't crowded.", "The lobby hasn't crowded."], "h": "BE past negative = wasn't / weren't."}, {"q": "Choose the correct question with BE.", "a": "Were the elevators busy?", "o": ["Did the elevators be busy?", "Were the elevators busy?", "Have the elevators busy?"], "h": "BE moves before the subject."}], "presentPerfect": [{"q": "Affirmative: We ___ this hotel twice.", "a": "have stayed at", "o": ["stayed at", "have stayed at", "have stay at"], "h": "Experience with no finished time → have + past participle."}, {"q": "Affirmative: I ___ the confirmation email.", "a": "have received", "o": ["received yesterday", "have received", "have receive"], "h": "Current result, no finished past time stated."}, {"q": "Affirmative: The hotel ___ our room.", "a": "has upgraded", "o": ["has upgraded", "have upgraded", "upgraded last year"], "h": "Hotel = it → HAS + past participle."}, {"q": "Affirmative: We ___ several hotels in New York.", "a": "have tried", "o": ["have tried", "has tried", "tried in 2024"], "h": "Life experience, no specific finished time."}, {"q": "Affirmative: The concierge ___ a table for us.", "a": "has booked", "o": ["has booked", "have booked", "has book"], "h": "HAS + past participle."}, {"q": "Affirmative: I ___ my key card.", "a": "have lost", "o": ["have lost", "have lose", "lost yesterday"], "h": "Current result: you do not have it now."}, {"q": "Affirmative: We ___ here since Monday.", "a": "have been", "o": ["were", "have been", "have be"], "h": "SINCE + starting point, continuing to now."}, {"q": "Negative: We ___ breakfast yet.", "a": "haven't had", "o": ["didn't have yet", "haven't had", "haven't have"], "h": "YET commonly goes with Present Perfect in textbook usage."}, {"q": "Negative: The hotel ___ my question yet.", "a": "hasn't answered", "o": ["hasn't answered", "didn't answered", "hasn't answer"], "h": "HAS NOT + past participle."}, {"q": "Negative: I ___ room service before.", "a": "haven't used", "o": ["haven't used", "didn't used", "haven't use"], "h": "Experience up to now."}, {"q": "Negative: We ___ any problems so far.", "a": "haven't had", "o": ["haven't had", "didn't have yesterday", "haven't have"], "h": "SO FAR connects past to now."}, {"q": "Negative: The room ___ cleaned yet.", "a": "hasn't been", "o": ["hasn't been", "didn't been", "hasn't be"], "h": "Present Perfect of BE: has/have been."}, {"q": "Question: ___ you ever stayed at a luxury hotel in New York?", "a": "Have", "o": ["Did", "Have", "Were"], "h": "EVER asks about life experience → Present Perfect."}, {"q": "Question: ___ the hotel confirmed your booking?", "a": "Has", "o": ["Did", "Has", "Have"], "h": "Hotel = it → HAS."}, {"q": "Question: How long ___ you been here?", "a": "have", "o": ["did", "have", "were"], "h": "HOW LONG + HAVE + subject + been for continuing time."}, {"q": "Question: ___ you received the final bill yet?", "a": "Have", "o": ["Did", "Have", "Are"], "h": "YET + current relevance."}, {"q": "Question: What hotels ___ you tried in New York?", "a": "have", "o": ["did", "have", "were"], "h": "Experience, no finished time stated."}, {"q": "Choose the correct sentence.", "a": "I've already checked the reservation.", "o": ["I've already checked the reservation.", "I have already check the reservation.", "I already checked the reservation last year and now."], "h": "HAVE + past participle CHECKED."}, {"q": "Choose the correct form with SINCE.", "a": "We've been at the hotel since Monday.", "o": ["We were at the hotel since Monday.", "We've been at the hotel since Monday.", "We have be at the hotel since Monday."], "h": "SINCE often describes a situation continuing until now."}, {"q": "Choose the correct question.", "a": "Have you ever used in-room dining?", "o": ["Did you ever used in-room dining?", "Have you ever used in-room dining?", "Have you ever use in-room dining?"], "h": "HAVE + subject + past participle."}], "mixedTenses": [{"q": "We ___ at The Plaza last year.", "a": "stayed", "o": ["stayed", "have stayed", "stay"], "h": "Last year = finished time → Past Simple."}, {"q": "We ___ at The Plaza three times.", "a": "have stayed", "o": ["stayed last year", "have stayed", "have stay"], "h": "Experience / number of times, no finished time → Present Perfect."}, {"q": "I ___ the concierge yesterday.", "a": "called", "o": ["called", "have called", "have call"], "h": "Yesterday = Past Simple."}, {"q": "I ___ the concierge, so the restaurant is booked now.", "a": "have called", "o": ["called in 2024", "have called", "have call"], "h": "Current result; no finished time given → Present Perfect."}, {"q": "___ you enjoy your stay last weekend?", "a": "Did", "o": ["Did", "Have", "Has"], "h": "Last weekend = Past Simple."}, {"q": "___ you ever stayed in a room with a Central Park view?", "a": "Have", "o": ["Did", "Have", "Were"], "h": "Ever + life experience → Present Perfect."}, {"q": "The room ___ clean when we arrived.", "a": "was", "o": ["was", "has been", "have been"], "h": "When we arrived = finished past moment."}, {"q": "The room ___ very comfortable so far.", "a": "has been", "o": ["was yesterday", "has been", "is been"], "h": "So far connects to now."}, {"q": "We ___ breakfast at 8:00 this morning.", "a": "had", "o": ["had", "have had", "have"], "h": "Specific time stated → Past Simple."}, {"q": "We ___ breakfast yet.", "a": "haven't had", "o": ["didn't have at 8", "haven't had", "haven't have"], "h": "Yet → Present Perfect in this lesson."}, {"q": "The hotel ___ my email on Monday.", "a": "answered", "o": ["answered", "has answered", "has answer"], "h": "Monday is a finished time in this sentence."}, {"q": "The hotel ___ all my questions, so I'm ready to book.", "a": "has answered", "o": ["answered last Monday", "has answered", "have answered"], "h": "Current result, no finished time."}, {"q": "I ___ my key card last night.", "a": "lost", "o": ["lost", "have lost", "have lose"], "h": "Last night = Past Simple."}, {"q": "I ___ my key card. Could you make me another one?", "a": "have lost", "o": ["lost in 2020", "have lost", "have lose"], "h": "Current result: the key is missing now."}, {"q": "How long ___ you stayed here?", "a": "have", "o": ["did", "have", "were"], "h": "How long + present connection → Present Perfect."}, {"q": "Where ___ you stay when you visited New York in 2025?", "a": "did", "o": ["did", "have", "were"], "h": "In 2025 = finished time → Past Simple."}, {"q": "The restaurant ___ excellent last night.", "a": "was", "o": ["was", "has been", "have been"], "h": "Last night = finished past."}, {"q": "The service ___ excellent throughout our stay so far.", "a": "has been", "o": ["was in 2024", "has been", "have been"], "h": "So far = continuing period."}, {"q": "We ___ any problems during our stay last May.", "a": "didn't have", "o": ["didn't have", "haven't had", "haven't have"], "h": "Last May = finished time."}, {"q": "We ___ any problems so far.", "a": "haven't had", "o": ["didn't have last year", "haven't had", "haven't have"], "h": "So far = Present Perfect."}], "reviewQuiz": [{"q": "The room was extremely clean and comfortable. Choose the best adjective.", "a": "spotless", "o": ["spotless", "crowded", "overpriced"], "h": "SPOTLESS = perfectly clean."}, {"q": "The staff answered quickly and solved the problem. The service was ___.", "a": "responsive", "o": ["responsive", "noisy", "cramped"], "h": "RESPONSIVE = reacts quickly and helpfully."}, {"q": "The room was smaller than expected. It felt ___.", "a": "cramped", "o": ["spacious", "cramped", "breathtaking"], "h": "CRAMPED = uncomfortably small."}, {"q": "The hotel is close to many attractions. The location is ___.", "a": "convenient", "o": ["convenient", "unreliable", "outdated"], "h": "CONVENIENT = easy and practical."}, {"q": "The skyline from the room was amazing. The view was ___.", "a": "breathtaking", "o": ["breathtaking", "basic", "noisy"], "h": "BREATHTAKING = extremely impressive."}, {"q": "The stay cost more than the quality justified. It felt ___.", "a": "overpriced", "o": ["overpriced", "spotless", "welcoming"], "h": "OVERPRICED = too expensive for what you receive."}]};

const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const state={answers:{},pages:{},scenario:0,bridge:false};

const HOTELS={
 plaza:{
   name:"The Plaza",
   address:"768 Fifth Avenue, New York, NY 10019",
   checkin:"3:00 p.m.",checkout:"12:00 p.m.",
   rooms:["Plaza King","Deluxe King","Deluxe Two Queens","Grand Luxe King","Terrace Room King","Junior / One-Bedroom Suite"],
   views:["Courtyard or city view","58th Street view","Terrace / courtyard garden","Selected park / partial park view","Fifth Avenue view"],
   defaultRoom:"Plaza King"
 },
 arlo:{
   name:"Arlo Midtown",
   address:"351 West 38th Street, New York, NY 10018",
   checkin:"after 3:00 p.m.",checkout:"12:00 p.m.",
   rooms:["Urban King","King City","Terrace King City","Two Double","Terrace Two Double","Arlo Suite"],
   views:["Urban street view","City view","Terrace + city view","High-floor city view"],
   defaultRoom:"King City"
 },
 citizenm:{
   name:"citizenM New York Times Square",
   address:"218 West 50th Street, New York, NY 10019",
   checkin:"2:00 p.m.",checkout:"11:00 a.m.",
   rooms:["King Room","High Floor King","Premium View King","Accessible King"],
   views:["Standard city view","High floor","Premium city view"],
   defaultRoom:"High Floor King"
 }
};

const VOCAB={
 booking:[
  ["reservation / booking","réservation","An arrangement that keeps a room for you.","I have a reservation for five nights."],
  ["availability","disponibilité","Whether a room can be booked.","Could you check availability for May 12th?"],
  ["room rate","tarif de la chambre","The price charged for the room.","Does this room rate include breakfast?"],
  ["refundable rate","tarif remboursable","A rate that can be refunded under its conditions.","I'd prefer a refundable rate."],
  ["non-refundable","non remboursable","A rate that normally cannot be refunded after booking.","This rate is cheaper but non-refundable."],
  ["confirmation number","numéro de confirmation","The reference number for the booking.","Could you repeat the confirmation number?"]
 ],
 rooms:[
  ["king room","chambre avec lit king-size","A room built around one king bed.","I'd like a king room, please."],
  ["two queens","chambre avec deux lits queen-size","A common U.S. room type for up to several guests.","Do you have a room with two queen beds?"],
  ["suite","suite","A larger accommodation, often with a separate living area.","The suite has a separate sitting area."],
  ["connecting rooms","chambres communicantes","Two rooms connected by an internal door.","Do you have connecting rooms?"],
  ["accessible room","chambre accessible PMR","A room adapted for accessibility needs.","Is an accessible room available?"],
  ["city view","vue sur la ville","A view toward city streets/buildings.","I'd prefer a city view."],
  ["park view","vue sur le parc","A room looking toward a park.","Does this room have a park view?"],
  ["courtyard view","vue sur cour","A view toward an internal courtyard.","The courtyard view should be quieter."],
  ["high floor","étage élevé","A room on a higher floor.","Could I request a high floor?"],
  ["terrace room","chambre avec terrasse","A room that includes private outdoor space.","The terrace room has outdoor space."]
 ],
 areas:[
  ["lobby","hall d'hôtel","The main public entrance / sitting area.","I'll meet you in the lobby."],
  ["front desk","réception","The desk for check-in, keys, payment and help.","Ask at the front desk."],
  ["concierge desk","conciergerie","The place for recommendations, tickets and reservations.","The concierge recommended a restaurant."],
  ["bell desk / bell staff","bagagerie / bagagiste","Staff who help with luggage and storage.","Can I leave my bags with the bell desk?"],
  ["elevator","ascenseur","American English for lift.","Take the elevator to the 12th floor."],
  ["hallway","couloir","The passage outside hotel rooms.","The room is at the end of the hallway."],
  ["fitness center","salle de sport","Hotel exercise facilities.","The fitness center is open 24 hours."],
  ["rooftop","toit-terrasse","A bar or terrace on the roof.","The rooftop has city views."],
  ["housekeeping","service des chambres / entretien","The department that cleans guest rooms.","Could you ask housekeeping for more towels?"],
  ["luggage storage","consigne à bagages","A place to leave bags before/after the room is available.","Is luggage storage available after check-out?"]
 ],
 amenities:[
  ["amenities","équipements / services","Facilities or useful services offered by a hotel.","What amenities are included?"],
  ["complimentary Wi-Fi","Wi-Fi gratuit","Internet access provided without an additional charge.","Is complimentary Wi-Fi included?"],
  ["breakfast included","petit-déjeuner inclus","Breakfast is part of the rate.","Breakfast is included in this package."],
  ["in-room dining","restauration en chambre","Food ordered and delivered to your room.","Is in-room dining available after 10 p.m.?"],
  ["spa","spa","Wellness / treatment facilities.","Does the hotel have a spa?"],
  ["laundry service","service de blanchisserie","The hotel cleans clothing for a fee.","How long does the laundry service take?"],
  ["wake-up call","appel de réveil","A scheduled call to wake a guest.","Could you set up a wake-up call for 7 a.m.?"],
  ["late check-out","départ tardif","Permission to keep the room after normal check-out.","Is late check-out available?"]
 ],
 payment:[
  ["security deposit","caution de garantie","A refundable amount for possible extras or damage.","Is there a security deposit at check-in?"],
  ["authorization hold","préautorisation / empreinte bancaire","A temporary block on your card, not necessarily a final charge.","How long does the authorization hold stay on the card?"],
  ["incidentals","frais supplémentaires","Extra hotel charges beyond room/tax.","The card is required for incidentals."],
  ["prepayment","prépaiement","Money actually paid before arrival.","The room is fully prepaid."],
  ["balance due","solde restant dû","The amount still to pay.","Is there a balance due at check-in?"],
  ["receipt","reçu / facture","Proof and details of payment.","Could you email me the receipt?"],
  ["itemized bill","facture détaillée","A bill showing each separate charge.","Could I see an itemized bill?"],
  ["charge","débit / frais facturé","An amount added to the account.","What is this charge for?"]
 ],
 problems:[
  ["extra towels","serviettes supplémentaires","Additional clean towels.","Could you send up two extra towels?"],
  ["toilet paper","papier toilette","Paper supplied in the bathroom.","We've run out of toilet paper."],
  ["air conditioning","climatisation","The system that cools the room.","The air conditioning isn't working."],
  ["heating","chauffage","The system that heats the room.","The heating seems to be off."],
  ["key card","carte-clé","Electronic card used to open the room.","My key card isn't working."],
  ["noisy room","chambre bruyante","A room affected by unwanted noise.","The room is very noisy at night."],
  ["housekeeping","service d'entretien","Cleaning and room servicing.","Housekeeping hasn't come yet."],
  ["maintenance","maintenance / service technique","Staff who repair hotel equipment.","Could someone from maintenance come up?"]
 ],
 roomservice:[
  ["room service","service en chambre","Food/drink delivered to your room.","What time does room service finish?"],
  ["in-room dining menu","menu du service en chambre","The menu for food delivered to the room.","Where can I find the in-room dining menu?"],
  ["place an order","passer une commande","Order food or drinks.","I'd like to place an order."],
  ["delivery time","délai de livraison","How long food takes to arrive.","What is the estimated delivery time?"],
  ["tray","plateau","The tray used to deliver food.","Where should I leave the tray?"],
  ["service charge","frais de service","An extra fee added for service.","Is a service charge already included?"]
 ],
 recommendations:[
  ["recommend","recommander","Suggest something as a good choice.","What would you recommend nearby?"],
  ["within walking distance","accessible à pied","Close enough to walk to.","Is there a restaurant within walking distance?"],
  ["book in advance","réserver à l'avance","Reserve before going.","Should we book in advance?"],
  ["local favorite","adresse appréciée des locaux","A place popular with people who live nearby.","Could you recommend a local favorite?"],
  ["casual","décontracté","Relaxed, not formal.","We're looking for something casual."],
  ["upscale","haut de gamme","More luxurious / expensive / polished.","Is there an upscale restaurant nearby?"]
 ],
 phrasal:[
  ["check in","s'enregistrer à l'arrivée","Register when you arrive at the hotel.","We checked in at 3 p.m."],
  ["check out","libérer la chambre / régler le départ","Leave the hotel and finish the account.","We need to check out by noon."],
  ["fill out","remplir","Complete a form.","Please fill out this form."],
  ["look up","chercher / retrouver une information","Search for information.","Let me look up your reservation."],
  ["pick up","récupérer","Collect something.","We'll pick up our bags later."],
  ["drop off","déposer","Leave something or someone at a place.","Can we drop off our luggage early?"],
  ["run out of","ne plus avoir","Have no more of something.","We've run out of clean towels."],
  ["send up","faire monter / envoyer à l'étage","Send something to a guest room.","We'll send up fresh towels."],
  ["set up","organiser / mettre en place","Arrange something.","Could you set up a wake-up call?"],
  ["go through","passer en revue","Review step by step.","Let's go through the bill together."]
 ]
};

const SCENARIOS=[
 {icon:"🧺",name:"Towels",title:"You have run out of clean towels",context:"Call the front desk. Ask for two bath towels and one hand towel. You are leaving in 45 minutes.",v:["run out of","bath towel","hand towel","send up","in about 45 minutes"],everyday:"Hi, we've run out of clean towels in the room. Could you send up two bath towels and one hand towel, please? We're going out in about 45 minutes.",polished:"Good evening. I'm afraid we've run out of clean towels in the room. Would it be possible to have two bath towels and one hand towel sent up when convenient? We are planning to leave in approximately 45 minutes."},
 {icon:"🔑",name:"Key card",title:"Your key card has stopped working",context:"You are outside the room. Explain the problem and ask what identification is needed for a replacement.",v:["key card","stopped working","replacement","photo ID","room number"],everyday:"Hi, my key card has stopped working. Could you make me a new one? Do you need to see my photo ID?",polished:"Hello. My room key card appears to have stopped working. Could you please issue a replacement? Please let me know what identification you need from me."},
 {icon:"❄️",name:"A/C",title:"The air conditioning isn't cooling the room",context:"Explain when you noticed it, what you tried and ask for maintenance.",v:["air conditioning","isn't cooling","turn it down","maintenance","come up"],everyday:"Hi, the air conditioning isn't cooling the room. I turned the temperature down, but it still isn't working. Could someone from maintenance come up, please?",polished:"Good evening. The air conditioning does not appear to be cooling the room properly. I have already lowered the temperature, but the problem has continued. Would it be possible to have someone from maintenance take a look?"},
 {icon:"🔊",name:"Noise",title:"The room is too noisy at night",context:"Explain the problem. Ask whether a quieter room is available.",v:["noise","hallway","street noise","quieter room","move rooms"],everyday:"Hi, the room is very noisy at night, especially from the hallway. Is there any chance we could move to a quieter room?",polished:"Good evening. Unfortunately, we have had quite a lot of noise outside the room during the night. Would it be possible to move to a quieter room if one is available?"},
 {icon:"🍽",name:"Room service",title:"You want dinner in the room",context:"Ask whether room service is still available, how long delivery takes and whether the service charge is included.",v:["room service","still available","delivery time","service charge","included"],everyday:"Hi, is room service still available? About how long would delivery take, and is the service charge already included?",polished:"Good evening. Could you please let me know whether in-room dining is still available? I would also like to know the approximate delivery time and whether a service charge is already included."},
 {icon:"🧻",name:"Bathroom",title:"You need toilet paper and toiletries",context:"Ask housekeeping for toilet paper, shampoo and tissues.",v:["toilet paper","shampoo","tissues","housekeeping","send up"],everyday:"Hi, could housekeeping send up some toilet paper, shampoo and a box of tissues, please?",polished:"Hello. Would it be possible to have housekeeping send up some additional toilet paper, shampoo and a box of tissues, please? Thank you very much."}
];

const SECTION_NAMES=[
 "01 · Build your May trip","02 · Choose your hotel","03 · Hotel description grammar","04 · Vocabulary bank","05 · Reservation email","06 · Check-in & payment","07 · Phrasal verbs","08 · Recommendations","09 · Problems & room service","10 · Tense masterclass introduction","11 · Past Simple","12 · Present Perfect","13 · Mixed tenses","14 · Check-out","15 · Hotel review","16 · Certification bridge","17 · Recap"
];

function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
function speak(text,rate){
 if(!("speechSynthesis" in window)){alert("Audio is not supported in this browser.");return}
 speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang="en-US";u.rate=rate||parseFloat($("#speedSelect").value);
 const voices=speechSynthesis.getVoices();u.voice=voices.find(v=>v.lang==="en-US")||voices.find(v=>v.lang.startsWith("en"))||null;speechSynthesis.speak(u);
}
function bindSpeak(r=document){$$(".speak",r).forEach(b=>b.onclick=()=>speak(b.dataset.text||b.textContent))}
function dateNice(v){if(!v)return"not chosen";const d=new Date(v+"T12:00:00");return d.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"})}
function daypart(t){if(!t)return"";const h=+t.split(":")[0];if(h<12)return"morning";if(h<17)return"afternoon";if(h<21)return"evening";return"night"}
function timeNice(t){if(!t)return"not chosen";const [h,m]=t.split(":").map(Number),ap=h>=12?"p.m.":"a.m.",hh=(h%12)||12;return `${hh}:${String(m).padStart(2,"0")} ${ap}`}
function nights(a,b){if(!a||!b)return 0;return Math.max(0,Math.round((new Date(b)-new Date(a))/86400000))}
function formatMoney(n){return n?`$${Number(n).toLocaleString("en-US",{maximumFractionDigits:0})}`:"not entered"}

function populateHotelOptions(){
 const key=$("#hotelSelect").value,h=HOTELS[key];$("#roomSelect").innerHTML=h.rooms.map(x=>`<option ${x===h.defaultRoom?"selected":""}>${x}</option>`).join("");
 $("#viewSelect").innerHTML=h.views.map(x=>`<option>${x}</option>`).join("");
 $$(".hotel-card").forEach(c=>c.classList.toggle("selected",c.dataset.hotelCard===key));
 updateTrip();
}
function tripParagraph(){
 const h=HOTELS[$("#hotelSelect").value],ni=nights($("#checkinDate").value,$("#checkoutDate").value),rate=Number($("#nightlyRate").value||0);
 let p=`I'm planning a ${ni||"multi-night"} stay at ${h.name}`;
 if($("#checkinDate").value)p+=` from ${dateNice($("#checkinDate").value)} to ${dateNice($("#checkoutDate").value)}`;
 p+=`. I'd like a ${$("#roomSelect").value.toLowerCase()} with ${$("#viewSelect").value.toLowerCase()}. I expect to arrive at ${timeNice($("#arrivalTime").value)} in the ${daypart($("#arrivalTime").value)}.`;
 if($("#breakfastSelect").value==="included")p+=" I'd like a rate that includes breakfast.";
 if($("#breakfastSelect").value==="notneeded")p+=" I don't need breakfast included.";
 if($("#breakfastSelect").value==="check")p+=" I still need to confirm whether breakfast is included in the rate.";
 if(rate&&ni)p+=` The live nightly rate I found is about $${rate}, so the room subtotal would be about $${(rate*ni).toLocaleString("en-US")} before taxes and fees.`;
 return p;
}
function updateTrip(){
 const h=HOTELS[$("#hotelSelect").value],ni=nights($("#checkinDate").value,$("#checkoutDate").value),rate=Number($("#nightlyRate").value||0);
 $("#tripSummary").innerHTML=`
   <h3>${h.name}</h3><p>${h.address}</p><hr>
   <p><strong>Dates:</strong> ${dateNice($("#checkinDate").value)} → ${dateNice($("#checkoutDate").value)}</p>
   <p><strong>Nights:</strong> ${ni||"—"} · <strong>Season:</strong> spring</p>
   <p><strong>Arrival:</strong> ${timeNice($("#arrivalTime").value)} · ${daypart($("#arrivalTime").value)}</p>
   <p><strong>Departure:</strong> ${timeNice($("#departureTime").value)} · ${daypart($("#departureTime").value)}</p>
   <p><strong>Guests:</strong> ${$("#guestCount").value}</p><p><strong>Room:</strong> ${$("#roomSelect").value}</p><p><strong>View:</strong> ${$("#viewSelect").value}</p>
   <p><strong>Hotel check-in/out:</strong> ${h.checkin} / ${h.checkout}</p>
   <p><strong>Live rate:</strong> ${formatMoney(rate)} ${rate&&ni?`· approx. room subtotal $${(rate*ni).toLocaleString("en-US")}`:""}</p>
   <hr><p class="trip-paragraph">${tripParagraph()}</p>`;
 $("#emailTripFacts").innerHTML=`<p>${tripParagraph()}</p>`;
}
function renderVocab(){
 const c=$("#vocabCategory").value;$("#vocabGrid").innerHTML=VOCAB[c].map(x=>`<article class="vocab-card"><h3>${x[0]}</h3><div class="vocab-fr">${x[1]}</div><p><b>Meaning:</b> ${x[2]}</p><p><b>Example:</b> ${x[3]}</p><button class="v-audio" data-t="${encodeURIComponent(x[0]+". "+x[3])}">🔊 Listen</button></article>`).join("");
 $$(".v-audio").forEach(b=>b.onclick=()=>speak(decodeURIComponent(b.dataset.t)));
}
function ensureState(name){if(!state.answers[name])state.answers[name]={};if(state.pages[name]==null)state.pages[name]=0}
function scoreSet(name,data){ensureState(name);const a=state.answers[name],answered=Object.keys(a).length,correct=Object.values(a).filter(Boolean).length;return{answered,correct,total:data.length,pct:data.length?Math.round(correct/data.length*100):0}}
function renderQuiz(name,data,root,pageSize=5){
 ensureState(name);const page=state.pages[name],pages=Math.ceil(data.length/pageSize),start=page*pageSize,end=Math.min(data.length,start+pageSize),sc=scoreSet(name,data);
 const qs=data.slice(start,end);
 $(root).innerHTML=`<div class="quiz-summary"><b>${sc.correct}/${data.length} correct · ${sc.answered}/${data.length} answered</b><span>Page ${page+1}/${pages}</span></div>
 <div class="quiz-page">${qs.map((x,j)=>{const i=start+j,id=`${name}_${i}`,answered=Object.prototype.hasOwnProperty.call(state.answers[name],i);return `<article class="quiz-card"><p><b>${i+1}.</b> ${x.q}</p><div class="options">${shuffle(x.o).map(o=>`<button class="option" data-set="${name}" data-i="${i}" data-v="${encodeURIComponent(o)}" ${answered?"disabled":""}>${o}</button>`).join("")}</div><button class="hint-btn practice-support qhint" data-id="${id}">Hint</button><div class="hint hidden" id="h_${id}">${x.h}</div><div class="feedback" id="f_${id}">${answered?(state.answers[name][i]?"✓ Correct.":"Review the correct form, then continue."):""}</div></article>`}).join("")}</div>
 <div class="quiz-nav">${Array.from({length:pages},(_,p)=>`<button class="page-dot ${p===page?"active":""}" data-set="${name}" data-page="${p}">${p*pageSize+1}–${Math.min(data.length,(p+1)*pageSize)}</button>`).join("")}</div>`;
 $$(".qhint",$(root)).forEach(b=>b.onclick=()=>$("#h_"+b.dataset.id).classList.toggle("hidden"));
 $$(".option",$(root)).forEach(b=>{
   if(b.disabled){
     const i=+b.dataset.i;const correctAnswer=data[i].a;
     if(decodeURIComponent(b.dataset.v)===correctAnswer)b.classList.add("correct");
     if(state.answers[name][i]===false && decodeURIComponent(b.dataset.v)!==correctAnswer){}
   }
   b.onclick=()=>{
     const i=+b.dataset.i,v=decodeURIComponent(b.dataset.v),ok=v===data[i].a;state.answers[name][i]=ok;
     const card=b.closest(".quiz-card");$$(".option",card).forEach(x=>{x.disabled=true;if(decodeURIComponent(x.dataset.v)===data[i].a)x.classList.add("correct")});if(!ok)b.classList.add("wrong");
     $("#f_"+name+"_"+i).textContent=ok?"✓ Correct.":"Not quite. The correct answer is highlighted.";$("#f_"+name+"_"+i).className="feedback "+(ok?"good":"bad");updateAll();
   };
 });
 $$(".page-dot",$(root)).forEach(b=>b.onclick=()=>{state.pages[b.dataset.set]=+b.dataset.page;renderNamedQuiz(b.dataset.set)});
}
const QUIZ_MAP={
 timePrep:["timePrep","#timePrepQuiz",5],
 amenities:["amenities","#amenitiesQuiz",5],
 phrasal:["phrasal","#phrasalQuiz",5],
 recommend:["recommend","#recommendQuiz",4],
 pastSimple:["pastSimple","#pastSimpleQuiz",5],
 presentPerfect:["presentPerfect","#presentPerfectQuiz",5],
 mixedTenses:["mixedTenses","#mixedTensesQuiz",5],
 reviewQuiz:["reviewQuiz","#reviewQuiz",3]
};
function renderNamedQuiz(name){const [key,root,size]=QUIZ_MAP[name];renderQuiz(name,DATA[key],root,size)}

function renderScenarios(){
 $("#scenarioTabs").innerHTML=SCENARIOS.map((s,i)=>`<button class="scenario-tab ${i===state.scenario?"active":""}" data-i="${i}">${s.icon} ${s.name}</button>`).join("");
 const s=SCENARIOS[state.scenario];
 $("#scenarioStage").innerHTML=`<div class="scenario-stage"><p class="micro">${s.icon} ${s.name}</p><h3>${s.title}</h3><p>${s.context}</p><div class="scenario-vocab">${s.v.map(v=>`<span>${v}</span>`).join("")}</div><button class="secondary scenario-audio">▶ Hear situation</button><textarea id="scenarioAnswer${state.scenario}" rows="6" placeholder="Build your response..."></textarea><details class="model practice-support"><summary>Model · Everyday natural</summary><p>${s.everyday}</p></details><details class="model practice-support"><summary>Model · Extra polite / luxury style</summary><p>${s.polished}</p></details></div>`;
 $(".scenario-audio").onclick=()=>speak(s.context);
 $$(".scenario-tab").forEach(b=>b.onclick=()=>{const old=$("#scenarioAnswer"+state.scenario);if(old)localStorage.setItem("hotel_scenario_"+state.scenario,old.value);state.scenario=+b.dataset.i;renderScenarios();const cur=$("#scenarioAnswer"+state.scenario);if(cur)cur.value=localStorage.getItem("hotel_scenario_"+state.scenario)||"";});
 const cur=$("#scenarioAnswer"+state.scenario);if(cur)cur.value=localStorage.getItem("hotel_scenario_"+state.scenario)||"";
}
function checkBridge(){
 const floor=$("#bridgeFloor").value.trim().toLowerCase(),br=$("#bridgeBreakfast").value.trim().toLowerCase(),co=$("#bridgeCheckout").value.trim().toLowerCase();
 const a=/14|fourteenth/.test(floor),b=/not|isn.?t|no|not included/.test(br),c=/11|eleven/.test(co);
 state.bridge=a&&b&&c;$("#bridgeFeedback").textContent=state.bridge?"✓ Perfect. You caught all three key details.":"Almost. Listen again for the floor, breakfast and check-out time.";$("#bridgeFeedback").className="feedback "+(state.bridge?"good":"bad");updateAll();
}

function automaticRows(){
 const names=[
  ["Time prepositions","timePrep",DATA.timePrep],
  ["Hotel description grammar","amenities",DATA.amenities],
  ["Phrasal verbs","phrasal",DATA.phrasal],
  ["Recommendation grammar","recommend",DATA.recommend],
  ["Past Simple","pastSimple",DATA.pastSimple],
  ["Present Perfect","presentPerfect",DATA.presentPerfect],
  ["Past / Present Perfect contrast","mixedTenses",DATA.mixedTenses],
  ["Review vocabulary","reviewQuiz",DATA.reviewQuiz]
 ];
 return names.map(([label,key,data])=>({label,...scoreSet(key,data)})).concat([{label:"Certification bridge",answered:state.bridge?1:0,correct:state.bridge?1:0,total:1,pct:state.bridge?100:0}]);
}
function status(row){if(row.answered===0)return"Pas commencé";if(row.answered<row.total)return"En cours";return row.pct>=70?"Acquis":"À renforcer"}
function statusClass(s){return s==="Acquis"?"status-good":s==="À renforcer"?"status-bad":s==="En cours"?"status-progress":"status-none"}

function renderSectionValidation(){
 const saved=JSON.parse(localStorage.getItem("hotel_section_validation")||"{}");
 $("#sectionValidationTable").innerHTML=SECTION_NAMES.map((s,i)=>`<tr><td>${s}</td><td><select class="manual-status" data-sec="${i}"><option>Pas commencé</option><option>En cours</option><option>Acquis</option><option>À renforcer</option></select></td><td><input class="manual-comment" data-sec="${i}" placeholder="Commentaire formateur"></td></tr>`).join("");
 $$(".manual-status").forEach(x=>{if(saved[x.dataset.sec]?.status)x.value=saved[x.dataset.sec].status;x.onchange=saveValidation});
 $$(".manual-comment").forEach(x=>{if(saved[x.dataset.sec]?.comment)x.value=saved[x.dataset.sec].comment;x.oninput=saveValidation});
}
function saveValidation(){
 const d={};$$(".manual-status").forEach(x=>d[x.dataset.sec]={status:x.value,comment:$(`.manual-comment[data-sec="${x.dataset.sec}"]`).value});localStorage.setItem("hotel_section_validation",JSON.stringify(d));renderCentrePreview();
}
function capturedWritten(){
 const ids=[
  ["Hotel choice","hotelChoiceReason"],["Reservation email","reservationEmail"],["Check-in response","checkinResponse"],["Problem email","problemEmail"],["Check-out response","checkoutResponse"],["Hotel review","reviewAnswer"],["Certification oral notes","bridgeOral"],["What I learned","learnedToday"],["Next practice","nextPractice"]
 ];
 const arr=ids.map(([label,id])=>({label,text:$("#"+id)?.value.trim()||""}));
 for(let i=0;i<SCENARIOS.length;i++){const live=$("#scenarioAnswer"+i);const text=live?live.value.trim():(localStorage.getItem("hotel_scenario_"+i)||"").trim();if(text)arr.push({label:`Scenario · ${SCENARIOS[i].name}`,text});}
 return arr;
}
function renderWritten(){
 const arr=capturedWritten();$("#writtenCapture").innerHTML=arr.map(x=>`<article class="written-item"><b>${x.label}</b><pre>${escapeHtml(x.text||"—")}</pre></article>`).join("");
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}

function buildCentreSummary(){
 const rows=automaticRows(),validation=JSON.parse(localStorage.getItem("hotel_section_validation")||"{}"),writes=capturedWritten();
 return `N° de séance : ${$("#sessionNumber").value||"—"}
Durée du cours : ${$("#sessionDuration").value||"—"}
Heures restantes : ${$("#hoursRemaining").value||"—"}
Date : ${$("#lessonDate").value||"—"}

OBJECTIFS DE LA SÉANCE
Planifier et réserver un séjour hôtelier en anglais ; comparer des hôtels et leurs prestations ; comprendre le vocabulaire des chambres, vues, services et paiements ; communiquer lors du check-in, pendant le séjour et au check-out ; demander des recommandations ; maîtriser les principaux phrasal verbs liés à l'hôtel ; distinguer Past Simple et Present Perfect ; rédiger un avis structuré.

CONTENU / ACTIVITÉS
${$("#adminContent").value}

COMPÉTENCES TRAVAILLÉES
${$("#adminCompetencies").value}

MODES D’ÉVALUATION
${$("#adminMethods").value}

RÉSULTATS AUTOMATIQUES
${rows.map(r=>`- ${r.label} : ${r.correct}/${r.total} (${r.pct}%) — ${status(r)}`).join("\n")}

VALIDATION SECTION PAR SECTION
${SECTION_NAMES.map((s,i)=>`- ${s} : ${validation[i]?.status||"Pas commencé"}${validation[i]?.comment?` — ${validation[i].comment}`:""}`).join("\n")}

PRODUCTIONS ÉCRITES / NOTES SAISIES
${writes.map(w=>`[${w.label}]\n${w.text||"—"}`).join("\n\n")}

NIVEAU D’ACQUISITION GLOBAL
${$("#overallLevel").value}

OBSERVATIONS
${$("#adminObservations").value||"—"}`;
}
function renderCentrePreview(){$("#centrePreview").textContent=buildCentreSummary()}
function renderAdmin(){
 const rows=automaticRows();$("#autoTable").innerHTML=rows.map(r=>{const st=status(r);return`<tr><td>${r.label}</td><td>${r.correct}/${r.total}</td><td>${r.pct}%</td><td><span class="status-pill ${statusClass(st)}">${st}</span></td></tr>`}).join("");
 renderWritten();renderCentrePreview();
}
function saveCore(){
 const ids=["checkinDate","checkoutDate","arrivalTime","departureTime","guestCount","hotelSelect","roomSelect","viewSelect","breakfastSelect","nightlyRate","hotelChoiceReason","reservationEmail","checkinResponse","problemEmail","checkoutResponse","reviewAnswer","bridgeOral","learnedToday","nextPractice","sessionNumber","sessionDuration","hoursRemaining","lessonDate","adminContent","adminCompetencies","adminMethods","adminObservations","overallLevel"];
 const d={};ids.forEach(id=>{if($("#"+id))d[id]=$("#"+id).value});localStorage.setItem("hotel_lesson_core",JSON.stringify(d));
}
function restoreCore(){
 try{const d=JSON.parse(localStorage.getItem("hotel_lesson_core")||"{}");Object.entries(d).forEach(([id,v])=>{if($("#"+id))$("#"+id).value=v})}catch(e){}
}
function updateAll(){
 let answered=0,total=0;Object.entries(QUIZ_MAP).forEach(([name,[key]])=>{const sc=scoreSet(name,DATA[key]);answered+=sc.answered;total+=sc.total});answered+=state.bridge?1:0;total+=1;
 const p=Math.round(answered/total*100);$("#progressBar").style.width=p+"%";$("#progressText").textContent=p+"% complete";renderAdmin();saveCore();
}
function download(name,text,type="text/plain"){const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([text],{type}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
function reportHtml(){return`<!doctype html><html><head><meta charset="utf-8"><title>Hotel Lesson Report</title><style>body{font-family:Arial;max-width:950px;margin:35px auto;line-height:1.5}h1{color:#9f1d2b}pre{white-space:pre-wrap;background:#f4f1ea;padding:18px;border-radius:12px}</style></head><body><h1>New York Real Talk · Hotel Journey</h1><pre>${escapeHtml(buildCentreSummary())}</pre></body></html>`}
function tripDownload(){
 const h=HOTELS[$("#hotelSelect").value];const html=`<!doctype html><html><head><meta charset="utf-8"><title>New York Trip Plan</title><style>body{font-family:Arial;max-width:760px;margin:40px auto;line-height:1.5}h1{color:#9f1d2b}.card{border:1px solid #ddd;padding:20px;border-radius:14px}</style></head><body><h1>My New York Hotel Plan</h1><div class="card"><h2>${h.name}</h2><p>${h.address}</p><p><b>Check-in:</b> ${dateNice($("#checkinDate").value)} · ${timeNice($("#arrivalTime").value)}</p><p><b>Check-out:</b> ${dateNice($("#checkoutDate").value)} · ${timeNice($("#departureTime").value)}</p><p><b>Room:</b> ${$("#roomSelect").value}</p><p><b>Preference:</b> ${$("#viewSelect").value}</p><p><b>Guests:</b> ${$("#guestCount").value}</p><p><b>Live nightly rate entered:</b> ${formatMoney($("#nightlyRate").value)}</p><hr><p>${tripParagraph()}</p></div></body></html>`;download("My_New_York_Hotel_Trip_Plan.html",html,"text/html");
}
async function copyText(txt,feedback){
 try{await navigator.clipboard.writeText(txt);$(feedback).textContent="✓ Copied.";$(feedback).className="feedback good"}catch(e){$(feedback).textContent="Copy manually from the visible text.";$(feedback).className="feedback bad"}
}
function localDate(){const d=new Date(),p=n=>String(n).padStart(2,"0");return`${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}`}

function init(){
 $("#jsWarning").style.display="none";bindSpeak();
 $$("[data-scroll]").forEach(b=>b.onclick=()=>$(b.dataset.scroll).scrollIntoView({behavior:"smooth"}));
 $("#modeSelect").onchange=e=>document.body.classList.toggle("challenge-mode",e.target.value==="challenge");
 $("#resetBtn").onclick=()=>{if(confirm("Reset the complete lesson and trainer trace?")){["hotel_lesson_core","hotel_section_validation"].forEach(k=>localStorage.removeItem(k));for(let i=0;i<SCENARIOS.length;i++)localStorage.removeItem("hotel_scenario_"+i);location.reload()}};
 restoreCore();
 if(!$("#lessonDate").value)$("#lessonDate").value=localDate();
 if(!$("#checkinDate").value)$("#checkinDate").value="2027-05-10";
 if(!$("#checkoutDate").value)$("#checkoutDate").value="2027-05-15";
 populateHotelOptions();
 // restore dependent fields after populate
 try{const d=JSON.parse(localStorage.getItem("hotel_lesson_core")||"{}");if(d.roomSelect && [...$("#roomSelect").options].some(o=>o.value===d.roomSelect))$("#roomSelect").value=d.roomSelect;if(d.viewSelect && [...$("#viewSelect").options].some(o=>o.value===d.viewSelect))$("#viewSelect").value=d.viewSelect}catch(e){}
 updateTrip();

 ["checkinDate","checkoutDate","arrivalTime","departureTime","guestCount","roomSelect","viewSelect","breakfastSelect","nightlyRate"].forEach(id=>$("#"+id).addEventListener("input",()=>{updateTrip();saveCore();renderAdmin()}));
 $("#hotelSelect").onchange=()=>{populateHotelOptions();saveCore();renderAdmin()};
 $$(".choose-hotel").forEach(b=>b.onclick=()=>{$("#hotelSelect").value=b.dataset.hotel;populateHotelOptions();$("#book").scrollIntoView({behavior:"smooth"});saveCore()});
 $("#downloadTrip").onclick=tripDownload;$("#copyTrip").onclick=()=>copyText(tripParagraph(),"#tripCopyFeedback");
 $("#vocabCategory").onchange=renderVocab;renderVocab();
 $$("[data-hint]").forEach(b=>b.onclick=()=>$("#"+b.dataset.hint).classList.toggle("hidden"));

 Object.keys(QUIZ_MAP).forEach(renderNamedQuiz);
 renderScenarios();

 $("#bridgeAudio").onclick=()=>speak("Good afternoon. Your room is ready on the fourteenth floor. Breakfast is not included in your current rate, but you can add it at the front desk. Check-out is at eleven a.m. on Friday.");
 $("#bridgeTranscriptBtn").onclick=()=>{const t=$("#bridgeTranscript");t.classList.toggle("hidden");$("#bridgeTranscriptBtn").textContent=t.classList.contains("hidden")?"Show transcript":"Hide transcript"};
 $("#bridgeCheck").onclick=checkBridge;

 renderSectionValidation();
 $("#refreshAdmin").onclick=renderAdmin;
 $("#copyCentre").onclick=()=>copyText(buildCentreSummary(),"#copyFeedback");
 $("#downloadReport").onclick=()=>download("New_York_Hotel_Lesson_Full_Report.html",reportHtml(),"text/html");
 $("#printBtn").onclick=()=>window.print();

 ["hotelChoiceReason","reservationEmail","checkinResponse","problemEmail","checkoutResponse","reviewAnswer","bridgeOral","learnedToday","nextPractice","sessionNumber","sessionDuration","hoursRemaining","lessonDate","adminContent","adminCompetencies","adminMethods","adminObservations","overallLevel"].forEach(id=>$("#"+id).addEventListener("input",()=>{saveCore();renderAdmin()}));

 if(!$("#adminContent").value)$("#adminContent").value="Planification d’un séjour à New York ; comparaison de trois hôtels réels ; dates, saisons et heures ; types de chambres et vues ; équipements et services ; email de réservation ; check-in et paiement ; vocabulaire de l’hôtel ; phrasal verbs ; demandes de recommandations ; problèmes de chambre et room service ; check-out ; Past Simple ; Present Perfect ; contraste des deux temps ; rédaction d’un avis ; courte passerelle certification.";
 if(!$("#adminCompetencies").value)$("#adminCompetencies").value="Réserver et comparer un hôtel ; demander et confirmer des informations ; comprendre les prestations incluses ou payantes ; communiquer lors du check-in, pendant le séjour et au check-out ; formuler une demande ou une recommandation ; résoudre un problème ; utiliser les phrasal verbs du contexte hôtelier ; raconter une expérience au Past Simple ; relier le passé au présent avec le Present Perfect ; rédiger un avis structuré.";
 if(!$("#adminMethods").value)$("#adminMethods").value="QCM progressifs avec correction immédiate et indices ; formulaire de réservation ; comparaison guidée ; production écrite ; dialogues et jeux de rôle ; exercices grammaticaux par séries de 5 ; 20 exercices Past Simple + 20 Present Perfect + 20 contrastifs ; observation formateur ; une courte tâche de transfert certification.";
 renderAdmin();updateAll();
}
document.addEventListener("DOMContentLoaded",init);