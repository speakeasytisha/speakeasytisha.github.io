'use strict';

// Each grammar topic pairs a reference with controlled practice.
const grammar = [
['B1 stretch · present perfect continuous and past perfect','Use have/has been + -ing for an activity continuing until now or leaving a visible result. Use had + past participle for an earlier event viewed from a later past point.','I’ve been waiting for twenty minutes. I haven’t been waiting long. Had they left when you arrived? They had already closed.','Prefer “I’ve known her for years” with stative know. Past perfect helps when the order may be unclear. With a clear sequence, “I checked the form and sent it” works.',
 'By the time I phoned, the office ___.|had already closed|has already closed|already closing|0|Both events are past and the closure happened first.', 'We’ve been ___ (wait) since nine o’clock.|waiting','Had / you / booked / before / you / arrived?'],
['Modals and conditions · rules, advice and options','Use modal + base verb. Must/have to express obligation, should expresses advice, could/might express options or possibility. First conditional uses if + present, will/can + base. Second conditional uses if + past, would + base.','You must sign here. You should keep a copy. If the form arrives today, I’ll check it. If I had more time, I’d paint more.','Mustn’t means forbidden. Don’t have to means optional. Use had to for past obligation. In hypothetical advice, “If I were you” is a standard expression.',
 'You ___ send a paper copy. The PDF is enough.|mustn’t|must|don’t have to|2|The paper copy is optional.', 'If I had more time, I ___ (would/will) take a painting course.|would','If / she / replies / today, / I’ll / confirm / the / date.'],
['Nouns, articles, possessives and quantities','Use a/an for a single countable thing introduced for the first time, the for an identified thing, and often zero article for general plurals or uncountables. Use many/few with plural count nouns and much/little with uncountables.','I need a form. The form is on my colleague’s desk. How many copies do you need? There’s a little time. This file is mine.','Information, advice, equipment and luggage are uncountable. Say a piece of advice. Choose a/an by sound: an hour, a university. Your modifies a noun. Yours replaces it.',
 'Could you send me ___ about the new procedure?|some information|an information|two informations|0|Information is uncountable.', 'These documents belong to me. They are ___ (my/mine).|mine','How / much / luggage / can / I / take?'],
['Prepositions, dates, times and movement','Use at for clock times, on for days/dates, in for months, years and most parts of the day. By is a deadline, until marks continuation, and from…to gives a range. Use to for destination and at/in for location.','The meeting is on 21 May at 10:30. Send it by noon. The office stays open until six. Go straight past reception.','Say at night, on Monday morning, arrive at the station and arrive in Lille. No preposition before next Friday. 21 May is said “the twenty-first of May” in British English or “May twenty-first” in American English.',
 'Please confirm your appointment ___ Friday at midday.|until|by|in|1|Confirming is an action with a deadline.', 'I’m available ___ (at/on/in) Monday morning.|on','The / office / stays / open / until / five.'],
['Preferences, comparatives and superlatives','Use -er/-est for most one-syllable adjectives, -ier/-iest after consonant + y, and more/most for most longer adjectives. Use than for comparisons, the for superlatives and as…as for equality.','A campervan is more flexible than a hotel. This is the easiest route. I prefer painting to drawing. I’d rather paint outside.','Good → better → best, bad → worse → worst. Some two-syllable adjectives vary, such as quieter/more quiet. Double the final consonant in big → bigger. After would rather use a base verb.',
 'This route is ___ than the motorway today.|more short|shortest|shorter|2|Short has one syllable.', 'This is the ___ (easy) route on the map.|easiest','I’d / rather / stay / at / a / campsite.'],
['Verb patterns and purpose','Use enjoy/avoid/finish + -ing, want/need/plan + to-infinitive and to + base verb to explain purpose. Like can take -ing or to + verb in many contexts.','I enjoy painting. I plan to visit Scotland. I called to check the booking. Please avoid sharing personal information.','Stop doing means quit an activity. Stop to do means pause another activity for a purpose. After a preposition, use -ing: “Thank you for checking.”',
 'Thank you for ___ the updated form.|sending|to send|send|0|For is a preposition here.', 'We stopped ___ (to buy/buying) food because we wanted to have a picnic.|to buy','I / called / to / confirm / the / booking.'],
['Connectors, sequencing and sentence boundaries','Use because + clause, because of + noun phrase, so for a result, and but or although for contrast. Put a comma after an opening although clause. Use however to start a new sentence with a following comma.','Although it was busy, we found a pitch. First, check the reference. Then, update the record. Finally, send a confirmation.','For a story, use in the end for the outcome and at the end of + event/time for a position. Use for example before an illustration. See the bilingual connector bank.',
 '___ the form was incomplete, I asked for a new copy.|However|Because|Because of|1|The form was incomplete is a complete clause.', 'We needed a pitch, ___ (so/because) we called the campsite.|so','Although / it / was / raining, / we / went / out.'],
['Pronouns and object order','A subject pronoun comes before the verb. An object pronoun comes after a verb or preposition. Use someone/anyone for people and something/anything for things.','I called them and spoke to her. Someone sent me a form. I didn’t see anyone. Did anyone call?','After a separable phrasal verb, put a short object pronoun in the middle: pick it up. Say “Nobody called” or “Nobody has called”, with a positive verb form.',
 'I can collect the documents and bring ___ to the meeting.|they|them|their|1|Use an object pronoun after bring.', 'I didn’t receive ___ (something/anything) yesterday.|anything','Could / you / pick / it / up / for / me?'],
['Adverbs, adjective order and instructions','Use adjectives before nouns or after be, seem, feel and look. Use adverbs to describe how an action happens. Start instructions with the base verb, or use don’t + base verb for a negative instruction.','It’s a clear message. She explained it clearly. First, open the form. Don’t share the link.','Good is usually an adjective and well usually describes how you do something. Fast and hard can already be adverbs. Hardly means almost not. Always check the order in “a small blue bag”.',
 'Could you speak more ___, please?|clear|clearness|clearly|2|Use an adverb after speak.', 'Please ___ (not/close) the portal until I’ve checked the form.|don’t close|do not close','Please / read / the / instructions / carefully.'],
['B1 stretch · defining clauses and the passive','Use who for people, which for things and that for either in defining clauses. Use be + past participle when the action or result matters most.','The colleague who checks the records is away. The file was sent yesterday. Has the form been signed?','You can omit the relative pronoun when it is the object: “the file I sent.” Keep it when it is the subject: “the form that needs a signature.” By can name the agent.',
 'The form ___ by the partner yesterday.|has sign|signed by|was signed|2|Use was + past participle with a finished past time.', 'The colleague ___ handles the bookings is on leave. Use a relative pronoun.|who|that','Has / the / final / version / been / approved?']
];

const vocabulary = [
['Work and administration',[
['handle an application','traiter une demande','Deal with it from receipt to the next step.','I handle applications and check supporting documents.'],
['supporting document','justificatif','Proof that must accompany a request.','Please attach a supporting document.'],
['follow up with a partner','relancer un partenaire','Contact them again about an open request.','I’ll follow up with our partner tomorrow.'],
['reference number','numéro de référence','The identifier of a file or request.','Could you confirm the reference number?'],
['meet a deadline','respecter une échéance','Finish by the required time.','We need the correct form to meet the deadline.'],
['outstanding','en attente / non réglé','Still waiting to be completed.','Two signatures are still outstanding.']]],
['Daily life, family, hobbies and preferences',[
['take the dog for a walk','promener le chien','Go out walking with the dog.','I usually take the dog for a walk after work.'],
['paint a landscape','peindre un paysage','Make a picture of a natural scene.','I enjoy painting landscapes and flowers.'],
['spend time with','passer du temps avec','Be with someone for a while.','I spent time with my family during the trip.'],
['go for a swim','aller nager','Go somewhere to swim.','I went for a swim with my daughter.'],
['eat out','manger au restaurant','Have a meal away from home.','We ate out at an Asian restaurant.'],
['I’d rather','je préférerais','Give a preference, followed by a base verb.','I’d rather paint outside if the weather is good.']]],
['Airport, hotel, transport and food',[
['boarding pass','carte d’embarquement','The document you show before boarding.','Where can I get my boarding pass?'],
['hand luggage','bagage cabine','Bags you take into the cabin.','Is hand luggage included?'],
['declare goods','déclarer des marchandises','Report items to customs.','Do I need to declare these goods?'],
['a return ticket','un billet aller-retour','A ticket to go and come back. US: round-trip ticket.','I’d like a return ticket to Lille.'],
['booking confirmation','confirmation de réservation','The message that confirms a reservation.','I have my booking confirmation here.'],
['a table for two','une table pour deux','A table for two people at a restaurant.','Could we have a table for two?'],
['the bill / the check','l’addition','Bill is common in the UK, check in the US.','Could we have the bill, please?'],
['turn left at','tourner à gauche à','Give a direction and a landmark.','Turn left at the traffic lights.']]],
['Campervan and accommodation',[
['campervan','camping-car','A van equipped for travelling and sleeping.','We travelled around France in a campervan.'],
['pitch','emplacement de camping','An individual space at a campsite.','Is there a pitch available for tonight?'],
['electric hook-up','branchement électrique','A connection for a campervan or caravan.','Does the pitch have an electric hook-up?'],
['rent a house','louer une maison','Pay to use a house for a period.','We rented a house so our family could join us.'],
['set off','partir / prendre la route','Start a journey.','We set off early on Saturday.'],
['a change of plan','un changement de programme','A decision to do something differently.','Heavy rain meant a change of plan.']]],
['News, opinions and conversation',[
['go on strike','faire grève','Stop working as part of a protest.','Some workers went on strike.'],
['take part in a demonstration','participer à une manifestation','Join a public gathering to express a view.','I took part in a demonstration.'],
['the cost of living','le coût de la vie','The cost of everyday goods and services.','People were worried about the cost of living.'],
['carry a banner','porter une banderole','Carry a large sign with a message.','People were carrying banners when I arrived.'],
['raise a concern','soulever une inquiétude','Tell others about a problem or worry.','A colleague raised a concern about the deadline.'],
['Could you rephrase that?','Pourriez-vous reformuler ?','Ask for the question in different words.','Sorry, could you rephrase that?'],
['Let me put it another way.','Je vais le dire autrement.','Restart if the first explanation is unclear.','Let me put it another way. We need your signature before Friday.']]],
['Connectors and sequencing',[
['first / then / after that / finally','d’abord / puis / ensuite / enfin','Put steps or events in order.','First, check the form. Then, update the file. Finally, confirm receipt.'],
['before / after / while / when','avant / après / pendant que / quand','Show the timing of events.','While I was checking the form, my colleague called.'],
['because / because of','parce que / en raison de','Give a reason. Use a clause after because and a noun phrase after because of.','We changed plans because it rained. We changed plans because of the rain.'],
['so / as a result','donc / par conséquent','Give the consequence.','The form was incomplete, so I requested a new copy.'],
['but / although / however','mais / bien que / cependant','Show contrast. Start a new sentence with However, in basic writing.','Although it was late, I called. The office was open. However, nobody answered.'],
['also / in addition','aussi / de plus','Add information.','The pitch is quiet. In addition, it has an electric hook-up.'],
['for example / such as','par exemple / comme','Introduce an illustration. Such as introduces examples in a noun list.','I enjoy outdoor activities such as walking.'],
['in my view / on the one hand / on the other hand','à mon avis / d’une part / d’autre part','Express a view or balance two points.','On the one hand, a campervan is flexible. On the other hand, parking can be difficult.'],
['in the end / to sum up','finalement / pour résumer','Give an outcome or sum up an argument.','In the end, we found a quiet place to stay.']]],
['Email, coordination and problem solving',[
['confirm receipt','confirmer la réception','Tell someone that their message or document arrived.','Could you confirm receipt of the attachment?'],
['reschedule an appointment','reprogrammer un rendez-vous','Move a booked appointment to another time.','Could we reschedule our appointment for Thursday?'],
['Please find attached…','Veuillez trouver ci-joint…','Introduce a file included with your email.','Please find attached the updated form.'],
['I’m afraid…','Je crains que… / Malheureusement…','Soften unwelcome news.','I’m afraid the original room is unavailable.'],
['Would Thursday work for you?','Est-ce que jeudi vous conviendrait ?','Check an alternative politely.','Would Thursday at 10 a.m. work for you?'],
['I’ll keep you updated.','Je vous tiendrai au courant.','Promise to share progress.','I’ll keep you updated if the date changes.']]]
];

const oral = [
{title:'Introduce yourself and your work', task:'Introduce yourself to a new English-speaking partner. Explain where you live, what you do and one interest. Link your English goal to a situation at work.',
 steps:['Location · I’m based near…','Role · I work in… / My role involves…','Example · On a typical day, I…','Personal detail and goal · Outside work, I… / I’d like to improve my English so I can…'],
 a:'I’m based near Lille. I work in administration at CARSAT. I check documents and communicate with partner organisations. In my free time, I enjoy drawing and painting. I’d like to feel more confident when I speak English.',
 b:'I’m based near Lille, in northern France, and I work in administration at CARSAT. My role involves checking company documents and communicating with partner organisations. For example, if information is missing, I ask the partner for the details we need. Outside work, I enjoy painting landscapes. I’d like to use English more confidently so I can explain a procedure clearly and deal with follow-up questions.',
 follow:['What part of your work requires the most attention?','Can you give an example of a time you had to clarify a request?','What would you like to be able to do more easily in English?'],
 back:'Could you tell me a little about your role?'},
{title:'Tell your campervan story',task:'Tell a colleague about your trip around France. Describe the journey, one moment you remember and your preference for a future trip.',
 steps:['Set the time and place · We spent… travelling around…','Give the background · We were… when… / There was…','Add the result · In the end, we…','Compare and look ahead · I’d rather… because… / Next time, I’m going to…'],
 a:'We travelled around France in a campervan. We also rented a house and our children joined us. I enjoyed spending time with my family. Next time, I’d like to visit a new region.',
 b:'We spent about a month travelling around France in a campervan. We could change our plans easily, which made the trip feel relaxed. We also rented a house so the children could join us. Although a campervan gives you more freedom, I think a house is more practical when the whole family wants to spend time together. Next time, I’d like to combine the two again.',
 follow:['How did you decide where to stop each night?','What were you doing when your plans changed? Use a real moment or describe an imagined one.','Would you recommend a campervan to someone travelling with family?'],
 back:'What kind of accommodation would you choose?'},
{title:'Discuss a local event or demonstration',task:'Explain an event you took part in to a colleague. Describe what you saw, explain why it mattered and respond to a different opinion.',
 steps:['Event · On that day, I took part in…','Scene · When I arrived, people were…','Reason · I went because… / I went to…','Balance · In my view… / Although… / I see your point, but…'],
 a:'I took part in a demonstration. There were a lot of people and some were carrying banners. I went because I care about public services. I understand that some people were worried about disruption.',
 b:'I took part in a demonstration because I wanted to make my views heard. When I arrived, people were carrying banners and talking about issues such as the cost of living. In my view, a demonstration can draw attention to a problem. However, I also understand that disruption can be difficult for people who need to travel. I think it’s worth listening to both sides.',
 follow:['What did you notice when you arrived?','Have you followed the topic since then?','How would you respond to someone who disagrees?'],
 back:'What do you think would help both sides understand each other?'},
{title:'Role-play · a missing document',task:'You are calling an English-speaking partner. The file you received has no signature. Ask for a signed version by Thursday at noon, offer a next step and confirm the agreement.',
 steps:['Open · Hello, this is… I’m calling about…','Explain · I received… but…','Request · Could you send… by…?','Confirm · Just to check, you’ll… and I’ll…'],
 a:'Hello, this is Frankie. I’m calling about the form you sent yesterday. It isn’t signed. Could you send a signed copy by noon on Thursday? Thank you. I’ll confirm when I receive it.',
 b:'Hello, this is Frankie from the admin team. I’m calling about the form you sent yesterday. I’ve checked it and noticed that the signature is missing. Could you send a signed PDF by noon on Thursday? If that isn’t possible, please let me know today so we can agree on a new deadline. Just to confirm, you’ll email the PDF and I’ll let you know as soon as it arrives.',
 follow:['Partner: I can’t send it by noon. Would 3 p.m. work?','Partner: Which version should I sign?','Partner: Could you confirm what happens once you receive it?'],
 back:'Could you confirm when you’ll be able to send it?'},
{title:'Role-play · an accommodation problem',task:'You are travelling for a work event. Your booking is for a quiet room, but your room is next to a lift. Ask for an alternative and check the details.',
 steps:['Open politely · Excuse me. Could you help me with…?','Explain · I booked… but…','Suggest · Would it be possible to…?','Check · Is there an extra charge? / Could you confirm…?'],
 a:'Hello. I booked a quiet room, but my room is next to the lift. Could I move to a quieter room, please? Is there an extra charge?',
 b:'Excuse me, could you help me with my booking? I asked for a quiet room because I have an early meeting tomorrow, but the room I’ve been given is next to the lift. Would it be possible to move to a quieter room on another floor? If there’s nothing available now, could you let me know when a room might be ready and whether there would be an extra charge?',
 follow:['Reception: We have a room available after 4 p.m.','Reception: The alternative room costs €15 more.','Reception: Would you like to leave your luggage at reception?'],
 back:'Could you tell me where I can leave my luggage?'},
{title:'Compare options · weekend plans and hobbies',task:'A colleague asks what you do at weekends. Tell a recent weekend story and recommend either a painting workshop or an outdoor event for next weekend.',
 steps:['Habit · I usually…','Past example · Last weekend, I…','Compare · One option is… whereas…','Recommend · I’d choose… because… / If the weather is good, we could…'],
 a:'I usually enjoy painting at weekends. Last weekend, I went swimming with my daughter and we ate out. I’d choose the painting workshop because I like trying new techniques.',
 b:'I usually spend part of the weekend drawing or painting, but I also enjoy going out with family. One recent weekend, I went swimming with my daughter and afterwards we ate at an Asian restaurant. A workshop would be more relaxing than a large outdoor event, and I could learn a new technique. On the other hand, if the weather is good, an outdoor event might be a nice change.',
 follow:['Would you prefer going alone or with someone?','Have you ever tried a different style of painting?','What are you going to do if the workshop is full?'],
 back:'What do you usually do to relax at weekends?'}
];

const writing = [
{title:'Email · request a missing document',task:'A partner, Maya, sent form A17 yesterday without a signature. Email her to thank her, explain what is missing, request a signed PDF by Thursday at noon and say what you will do when it arrives.',
 steps:['Subject and greeting · Include the reference A17.','Purpose and context · Thank Maya and explain what you received.','Action and deadline · Request a signed PDF by noon on Thursday.','Close · Say what you will do on receipt and sign off.'],
 a:'Subject: Signed form A17 needed by Thursday\n\nHi Maya,\n\nThank you for sending form A17 yesterday. The signature is missing. Could you send a signed PDF by noon on Thursday, please?\n\nI’ll confirm when I receive it.\n\nBest regards,\nFrankie',
 b:'Subject: Form A17 – signed PDF needed by Thursday at noon\n\nHi Maya,\n\nThank you for sending form A17 yesterday. I’ve checked the document and noticed that the signature is missing. Could you send a signed PDF by noon on Thursday so that we can update the file?\n\nIf you need more time, please let me know today. I’ll confirm receipt as soon as the document arrives.\n\nKind regards,\nFrankie',
 checks:['My subject names the form.','I asked for the signed PDF and gave the exact deadline.','I said what happens next.'],
 tip:'B1 upgrade · Connect the request to its purpose with so that. Give a realistic alternative if the deadline is difficult.'},
{title:'Email · reschedule a meeting',task:'You have a partner meeting with Ms Carter on Tuesday at 10 a.m. You have a scheduling conflict. Apologise, offer Thursday at 10 or Friday at 2, ask her to choose and offer to send a new invitation.',
 steps:['Greet the named partner formally.','Identify the original meeting and explain briefly.','Offer both alternatives with times.','Ask for a reply and say what you will send.'],
 a:'Subject: Rescheduling Tuesday’s meeting\n\nDear Ms Carter,\n\nI’m sorry, but I can’t attend our meeting on Tuesday at 10 a.m. Could we meet on Thursday at 10 a.m. or on Friday at 2 p.m.?\n\nPlease let me know which time works for you. I’ll send a new invitation.\n\nKind regards,\nFrankie',
 b:'Subject: New time for our Tuesday meeting\n\nDear Ms Carter,\n\nI’m writing to ask whether we could reschedule our meeting planned for Tuesday at 10 a.m. I’m sorry for the inconvenience, but I have a scheduling conflict.\n\nI’m available on Thursday at 10 a.m. or Friday at 2 p.m. Could you let me know which time would suit you better? Once you confirm, I’ll send an updated invitation.\n\nKind regards,\nFrankie',
 checks:['I mentioned the original appointment.','I offered both alternatives.','My tone, greeting and close suit the recipient.'],
 tip:'B1 upgrade · Use statement order after which time in an indirect question. Use once + present, then will for your next action.'},
{title:'Internal note · a change in procedure',task:'Tell your team about a fictional change. From Monday, use the shared folder instead of emailing completed forms. Name each file with its reference number, and contact Alex if access fails.',
 steps:['Heading · Name what is changing.','Opening · Say when it starts and what to do.','Steps · Explain naming and saving in order.','Help · Say who to contact if there is a problem.'],
 a:'New way to save completed forms\n\nFrom Monday, please save completed forms in the shared folder. First, name the file with its reference number. Then save it in the folder. If you can’t open the folder, please contact Alex.',
 b:'Team note · Saving completed forms from Monday\n\nFrom Monday, please use the shared folder for completed forms instead of sending them by email. First, rename each file using the reference number. Then, save it in the shared folder so that everyone can find the latest version.\n\nIf you can’t access the folder, contact Alex before you send any files.',
 checks:['I stated the start date.','I gave the actions in order.','I explained what to do if access fails.'],
 tip:'B1 upgrade · Use instead of + -ing to show what is changing. Keep each instruction short.'},
{title:'Short report · log a service problem',task:'On Wednesday at 9 a.m. the shared portal stopped accepting uploads. Three forms were affected. You notified support at 9:20. The portal works again, but one form still needs uploading. Write a short report for your team lead.',
 steps:['Incident · State when and what happened.','Impact · Say how many forms were affected.','Action · State whom you informed and when.','Status and next step · Say what works now and what remains.'],
 a:'Portal upload problem · Wednesday\n\nAt 9 a.m. on Wednesday, the portal stopped accepting uploads. Three forms were affected. I contacted support at 9:20 a.m. The portal is working again. I still need to upload one form.',
 b:'Incident summary · Shared portal uploads\n\nAt 9 a.m. on Wednesday, the shared portal stopped accepting uploads, which affected three forms. I reported the issue to support at 9:20 a.m.\n\nThe portal is now working again. Two forms have been uploaded and one is still outstanding. I’ll upload the remaining form and confirm when the file is complete.',
 checks:['I reported facts in chronological order.','I distinguished the past incident from the current status.','I stated one concrete next step.'],
 tip:'B1 upgrade · Use past simple for times that are finished, present perfect for the current result and will for the next action.'},
{title:'Short recommendation · organise an event',task:'Your team needs a venue. Venue A is cheaper and close to the station but has no projector. Venue B costs more but includes a projector and help setting up. Recommend one and explain your decision.',
 steps:['State your recommendation immediately.','Compare one advantage and one drawback.','Link the reason to the team’s needs.','Suggest one next action.'],
 a:'I recommend Venue B. It costs more than Venue A, but it has a projector and someone can help us set it up. We need a projector for our presentation. I suggest checking the price before we book.',
 b:'I’d recommend Venue B because we need to show slides during the event. Although Venue A is cheaper and closer to the station, it doesn’t have a projector. Venue B includes both equipment and help with the setup, so it would save us time on the day. Before booking, I suggest confirming that the equipment is included in the quoted price.',
 checks:['I gave a clear recommendation.','I compared both options using the facts.','I proposed a concrete next step.'],
 tip:'B1 upgrade · Give both sides with although, then show why one practical need matters most.'}
];

const passages = [
{title:'Read · partner email', text:'Hi Frankie,\n\nWe received form B28 on Monday. Please send a new copy with the correct reference number by Thursday at 12:30. You don’t need to resend the supporting documents. If you expect a delay, call me before Wednesday at 4 p.m.\n\nThanks,\nMaya',
 q:['What must you send?|A new form with the correct reference|Every supporting document|A new reference by phone|0|Look for the first requested action.',
 'When is the replacement due?|Wednesday at 4 p.m.|Monday at noon|Thursday at 12:30|2|Distinguish the deadline from the time to call.',
 'What should you do if you expect a delay?|Wait until Thursday|Call Maya before Wednesday at 4 p.m.|Resend all documents|1|Find the instruction starting with If.']},
{title:'Read · change to a workplace procedure',text:'From next Monday, visitors must sign in at reception before entering the meeting rooms. If reception is closed, call the host using the number on the invitation. The side entrance is for staff only. Large deliveries should still go to the loading area.',
 q:['What has changed for visitors?|They should go to the loading area.|They must sign in before entering meeting rooms.|They must use the side entrance.|1|Look for the instruction that refers to visitors.',
 'What do visitors do when reception is closed?|Call the host.|Enter with a staff member’s code.|Deliver their invitation to the loading area.|0|Check the instruction following If.',
 'Which instruction remains the same?|Visitors call before every meeting.|Staff must sign in.|Large deliveries go to the loading area.|2|Still signals a continuing procedure.']},
{title:'Listen · a voicemail about a meeting',audio:true,text:'Hello, this is Alex. Thursday’s training will start at half past nine instead of nine. We’re moving to room twelve because the projector in room seven is broken. Please bring your laptop. If you can’t attend, email me by four this afternoon.',
 q:['What time will training now start?|9:00|9:30|12:30|1|Listen for instead of.',
 'Why has the room changed?|Room 12 is closed.|There aren’t enough chairs.|The projector in room 7 is broken.|2|Listen for because.',
 'What should you bring?|A laptop|A projector|A printed form|0|Listen for Please bring.']},
{title:'Listen · respond to a partner update',audio:true,text:'Hi, it’s Nina from the partner team. I’ve sent the two updated forms, but I’m still waiting for the manager’s signature on the third one. Could you check the first two today? I’ll send the final form on Friday morning. If the signature arrives earlier, I’ll ring you.',
 q:['How many updated forms has Nina sent?|Three|One|Two|2|Listen to the first sentence after the greeting.',
 'What does Nina ask you to do today?|Check the first two forms.|Call the manager.|Send the final form.|0|Listen for Could you.',
 'When will Nina call?|When you send a reminder.|If the signature arrives earlier.|At the end of Friday.|1|Listen for the condition in the last sentence.']}
];

const vocabularyQuestions = [
'Our partner hasn’t replied. I’ll ___ with her tomorrow.|set off|follow up|sign in|1|Choose the phrase for contacting someone again.',
'Please attach a ___ to prove your address.|boarding pass|deadline|supporting document|2|It’s evidence for an application.',
'I’d like a ___ to Lille, please. I’ll come back tonight.|return ticket|hand luggage|reference number|0|The ticket covers both directions.',
'Does this campsite have a ___ for a campervan tonight?|pitch|boarding gate|platform|0|Choose the area you can park and stay in.',
'I didn’t catch that. Could you ___?|take part|sign for it|rephrase that|2|Ask to hear the idea in different words.',
'She attended the march. She ___.|went on strike|took part in a demonstration|set off on a trip|1|Attending a march means joining a public gathering.',
'The file was incomplete. ___, we requested another copy.|As a result|On the other hand|For example|0|The second sentence gives the consequence.',
'I’m sorry, Tuesday is difficult. ___?|Could you attach the file|Is the signature outstanding|Would Thursday work for you|2|Suggest a new appointment time.',
'The hotel has an indoor pool. ___, it offers free parking.|However|In addition|Because of|1|Add another benefit.',
'We checked three campsites. ___, we found a quiet pitch.|While|Such as|In the end|2|Give the final outcome.'
];

const mockReading = {title:'Read · a partner’s update', text:'Hello,\n\nThe Thursday workshop has moved to Room 4. Please bring the printed checklist. We will email the slides afterwards, so there is no need to print them. If you have mobility requirements, contact reception by Wednesday afternoon.\n\nThanks, Sam',
 q:['Where will the workshop take place?|At reception|In Room 4|Online|1|Find the updated room.',
 'What should you print?|The slides|The email|The checklist|2|Read the sentence beginning Please.',
 'Who should contact reception?|Anyone with mobility requirements|Everyone attending|Anyone without the slides|0|Find the condition in the final sentence.']};
const mockListening = {title:'Listen · an appointment update',audio:true,text:'Hello, this is Naomi. I can’t make our call at two on Tuesday. Could we speak at eleven on Wednesday instead? I’ll review the documents before the call. Please send me the latest version by Tuesday evening.',
 q:['What time does Naomi propose?|Tuesday at two|Wednesday at two|Wednesday at eleven|2|Listen for instead.',
 'When does she need the latest version?|By Tuesday evening|After the call|Wednesday evening|0|Listen for by.',
 'What will Naomi do before the call?|Cancel Wednesday’s call|Review the documents|Book a room|1|Listen for before the call.']};
const mockWrite = {title:'Email · correct a venue booking',task:'The venue confirmed a room for 12 people on Thursday. Your group needs space for 18 people at 10 a.m. and step-free access. Email the bookings team to explain the issue, request a suitable room and ask for written confirmation by Tuesday.',
 a:'Subject: Change to Thursday’s room booking\n\nDear Bookings Team,\n\nThank you for confirming our room for Thursday. The room is for 12 people, but we need space for 18 at 10 a.m. We also need step-free access. Could you offer a suitable room and confirm it by email by Tuesday?\n\nKind regards,\nFrankie',
 b:'Subject: Thursday at 10 a.m. – room for 18 with step-free access\n\nDear Bookings Team,\n\nThank you for confirming our booking for Thursday. The current room accommodates 12, but our group has increased to 18. We’ll also need step-free access.\n\nWould it be possible to move us to a suitable room for the 10 a.m. session? Please confirm the new room and access arrangements by email no later than Tuesday.\n\nKind regards,\nFrankie'};
const mockReport = {title:'Structured update · a new filing process',task:'Write a structured update for your manager about a trial. The team started testing a shared folder last Monday. The old process required staff to email forms individually. Twelve forms went into the folder during the first week, but two staff members could not access it. Explain the purpose and outcome of the trial, what needs fixing, and what you recommend for next week.',
 a:'Shared folder trial · week one\n\nWe started using a shared folder last Monday. Before the trial, we sent forms by email. The new folder makes it easier to find forms.\n\nWe saved twelve forms in the first week. Two people couldn’t open the folder. Next week, I recommend checking everyone’s access before we continue the trial.',
 b:'Shared folder trial · progress update\n\nPurpose\nWe began testing a shared folder last Monday so the team could find completed forms in one place. Previously, staff emailed each form separately.\n\nResults\nDuring the first week, the team saved twelve forms in the folder. However, two colleagues could not access it, so the process is not ready for the whole team yet.\n\nNext steps\nI recommend checking everyone’s access before we extend the trial next week. Once access has been confirmed, we can use the folder for all new forms and review the process on Friday.'};
const mockLanguage = [
 'Thank you for ___ the meeting time.|confirm|confirming|to confirm|1|Use -ing after for.',
 'If the partner calls, I ___ the new deadline.|explained|would explaining|will explain|2|Use will after a present condition for this future result.',
 'Could you tell me ___?|which form I need|which form do I need|which form need I|0|Use statement order inside the question.',
 'The team is still waiting ___ the final signature.|at|for|since|1|Wait takes for before the thing you expect.'
];
const mockOral = {title:'Workplace interview · organise a visit',task:'1. Introduce yourself and explain one thing you do at work.\n2. Role-play: a partner arrives early. The meeting room is unavailable until ten. Explain the issue, offer somewhere to wait and check whether your solution works.\n3. Discussion: Which is better for a first meeting, a video call or meeting in person? Give a reason and an example.',
 a:'I work in administration. I check documents and answer questions from partners.\n\nI’m sorry, the room isn’t free until ten. You can wait in reception. Would you like some water?\n\nI prefer meeting in person at first because it’s easier to get to know someone.',
 b:'I work in administration, where I check company documents and follow up with partner organisations.\n\nI’m afraid our meeting room is occupied until ten. In the meantime, would you like to wait in reception? I can let the host know you’ve arrived. Does that work for you?\n\nI’d normally choose to meet in person first, because it’s easier to build a relationship. For example, you can introduce the visitor to other colleagues. However, a video call may be more practical if people are travelling.'};

// ===================== VERB LAB DATA =====================
// Drill line formats:
//   c|prompt|option|option|option|correctIndex|hint      (multiple choice; options are shuffled on screen)
//   f|prompt|hint|accepted answer|other accepted answer  (write the answer; contractions are accepted automatically)
//   t|word / word / word?|hint                           (build the sentence with tiles)
const tenses = [
{
 id:"ps", tab:"Present simple", name:"Present simple", fr:"le présent simple", icon:"🔁", kicker:"HABITS · ROUTINES · FACTS · LIKES",
 intro:"Use it for things that are generally true for you: your routine, your habits, your likes and facts. The big rule: with he / she / it, the verb takes -s.",
 when:[
  ["Habits and routines","habitudes et routines","I paint on Sunday mornings."],
  ["Facts and things that are always true","faits, vérités générales","Lille is in the north of France."],
  ["Likes, feelings and opinions (state verbs)","goûts, opinions, états","I love landscapes. I don’t understand."],
  ["Timetables and programmes","horaires","The train leaves at 8:15."]],
 signal:["always","usually","often","sometimes","rarely","never","every day","every Sunday","once a week","twice a month","on Mondays","in the morning"],
 signalNote:"Frequency words go <b>before</b> the main verb (I <b>usually</b> paint) but <b>after</b> be (I am <b>usually</b> tired).",
 table:{head:["","I / you / we / they","he / she / it"],rows:[
  ["✚ Positive","I <b>paint</b>.","She <b>paints</b>."],
  ["− Negative","I <b>don’t</b> (do not) <b>paint</b>.","She <b>doesn’t</b> (does not) <b>paint</b>."],
  ["? Question","<b>Do</b> you <b>paint</b>?","<b>Does</b> she <b>paint</b>?"],
  ["Short answers","Yes, I <b>do</b>. / No, I <b>don’t</b>.","Yes, she <b>does</b>. / No, she <b>doesn’t</b>."]]},
 spelling:[
  "Most verbs: + <b>s</b> → paint → paints, walk → walks, live → lives.",
  "-s, -sh, -ch, -x, -o: + <b>es</b> → watch → watches, finish → finishes, fix → fixes, go → goes, do → does.",
  "Consonant + y: y → <b>ies</b> → study → studies, carry → carries. But vowel + y: + s → play → plays, buy → buys.",
  "Irregular: have → <b>has</b>. Be → I am / he is / they are.",
  "Sound of -s: /s/ in <i>works</i>, /z/ in <i>plays</i>, /ɪz/ (extra syllable) in <i>watches</i>."],
 traps:[
  "After <b>does / doesn’t</b>, the verb has <b>no -s</b>: Does she paint? ✓ — Does she <s>paints</s>? ✗",
  "<b>Be</b> never uses do: Are you tired? ✓ — <s>Do you are tired?</s> ✗",
  "State verbs stay simple: I <b>like</b>, I <b>want</b>, I <b>need</b>, I <b>know</b> — not <s>I’m liking</s>.",
  "French trap: <i>Je travaille ici depuis 5 ans</i> is NOT present simple → I <b>have worked</b> here for 5 years (see Present perfect)."],
 examples:[
  ["She paints every weekend.","She doesn’t paint during the week.","Does she paint every weekend?"],
  ["We go swimming on Saturdays.","We don’t go swimming on Sundays.","Do you go swimming on Saturdays?"],
  ["My son lives in Lille.","He doesn’t live with me.","Where does he live?"],
  ["It rains a lot in the north.","It doesn’t rain much in July.","Does it rain a lot in Lille?"]],
 drills:[
  ["A · Choose the correct form",[
   "c|My daughter ___ swimming every Saturday.|go|goes|going|1|He / she / it → go + es = goes.",
   "c|I ___ landscapes on Sunday mornings.|paints|paint|painting|1|With I, use the base verb: no -s.",
   "c|___ your son live near you?|Do|Does|Is|1|He / she / it questions use does.",
   "c|She ___ coffee in the evening.|doesn’t drink|don’t drink|doesn’t drinks|0|doesn’t + base verb (no -s).",
   "c|My neighbour ___ his dog twice a day.|walk|walkes|walks|2|Walk → walks (just + s).",
   "c|Where ___ you usually go on holiday?|does|do|are|1|You → do.",
   "c|I ___ usually tired on Monday mornings.|am|do|have|0|Tired is an adjective, so use be: I am usually tired."]],
  ["B · Write the he / she / it form",[
   "f|watch → she ___|-ch → add -es.|watches",
   "f|study → he ___|Consonant + y → ies.|studies",
   "f|play → it ___|Vowel + y → just add -s.|plays",
   "f|have → she ___|Have is irregular.|has",
   "f|go → he ___|Go → add -es.|goes",
   "f|My sister ___ (work) in Lille.|He / she / it → + s.|works"]],
  ["C · Make it negative, a question or a short answer",[
   "f|Make it negative: She paints on Fridays.|doesn’t + base verb.|She doesn’t paint on Fridays",
   "f|Make it negative: They live in Paris.|don’t + base verb.|They don’t live in Paris",
   "f|Make it a question: He likes Asian food.|Does + subject + base verb.|Does he like Asian food",
   "f|Make it a question: You walk to work.|Do + subject + base verb.|Do you walk to work",
   "f|Short answer: Does your daughter like swimming? (✓ yes)|Yes, + she + auxiliary.|Yes, she does",
   "f|Short answer: Do you work on Saturdays? (✗ no)|No, + I + auxiliary + not.|No, I don’t"]],
  ["D · Build the sentence",[
   "t|How / often / does / she / paint?|Question word + does + subject + base verb.",
   "t|My / daughter / doesn’t / like / cold / water.|Subject + doesn’t + base verb.",
   "t|I / am / always / happy / at / the / weekend.|Always goes after be."]],
  ["E · Find the correct sentence",[
   "c|Which sentence is correct?|She doesn’t likes cold weather.|She don’t like cold weather.|She doesn’t like cold weather.|2|doesn’t + base verb.",
   "c|Which sentence is correct?|I always am late.|I am always late.|Always I am late.|1|Frequency words come after be.",
   "c|Which sentence is correct?|Do you are free tonight?|Are you free tonight?|Does you free tonight?|1|Be makes its own questions: no do."]]],
 task:{title:"Describe a typical week",task:"Describe a typical week for you and for one person in your family. Talk about what you usually do, what you never do and what they like.",
  words:["usually","often","every Saturday","never","on Sunday mornings","he / she + -s","doesn’t"],
  steps:["Start with your weekdays: During the week, I usually…","Add your weekend: At the weekend, I often…","Add one negative: I don’t… / I never…","Describe one person with he / she: My daughter goes… She doesn’t…"],
  checks:["I used at least six different verbs.","I added -s / -es for he / she / it.","I used doesn’t or don’t at least once.","I used three frequency words in the right place."],
  a:"During the week, I usually get up at seven. I work and I come home at about six. I often paint on Sunday mornings. I don’t paint every day because I don’t have time. My daughter goes swimming every Saturday. She loves the water, but she doesn’t like cold weather.",
  b:"During the week, I usually get up at about seven and leave after breakfast. In the evening, I relax and I sometimes draw for half an hour. At the weekend, I have more time, so I often paint landscapes on Sunday mornings when the light is good. My daughter goes swimming every Saturday; she says it helps her to relax. She doesn’t like cold water, so she always chooses the indoor pool. We rarely stay at home on Sunday afternoons: we usually go for a walk or eat out together."}
},
{
 id:"pc", tab:"Present continuous", name:"Present continuous", fr:"le présent progressif (être en train de)", icon:"▶️", kicker:"NOW · TEMPORARY · DESCRIBE A PHOTO · ARRANGEMENTS",
 intro:"Use it for what is happening now or around now. It is also your best friend for describing a photo in the CLOE speaking test: In this picture, a man is riding a bike.",
 when:[
  ["An action happening now","maintenant, en ce moment","I’m writing a message right now."],
  ["A temporary situation (around now)","situation temporaire","These days, I’m reading a novel in English."],
  ["Describing a photo or a scene","décrire une photo","In this picture, two people are walking on a beach."],
  ["A fixed plan with a time or a person","rendez-vous prévu","I’m meeting my sister on Saturday."],
  ["Changes in progress","évolution","My English is getting better!"]],
 signal:["now","right now","at the moment","today","this week","these days","currently","Look!","Listen!","in this picture"],
 signalNote:"Compare: I <b>usually</b> paint in the morning (habit), but <b>today</b> I’m painting in the afternoon (temporary).",
 table:{head:["","I","you / we / they","he / she / it"],rows:[
  ["✚ Positive","I’<b>m</b> paint<b>ing</b>.","They’<b>re</b> paint<b>ing</b>.","She’<b>s</b> paint<b>ing</b>."],
  ["− Negative","I’<b>m not</b> painting.","They <b>aren’t</b> painting.","She <b>isn’t</b> painting."],
  ["? Question","<b>Am</b> I painting?","<b>Are</b> they painting?","<b>Is</b> she painting?"],
  ["Short answers","Yes, I <b>am</b>. / No, I’<b>m not</b>.","Yes, they <b>are</b>. / No, they <b>aren’t</b>.","Yes, she <b>is</b>. / No, she <b>isn’t</b>."]]},
 spelling:[
  "Most verbs: + <b>ing</b> → paint → painting, read → reading, walk → walking.",
  "Silent -e: drop the e → make → making, write → writing, take → taking. (But: be → being, see → seeing.)",
  "One short vowel + one consonant: double it → swim → swimming, sit → sitting, run → running, stop → stopping, get → getting.",
  "No doubling when the last syllable is not stressed: visit → visiting, open → opening. UK: travel → travelling / US: traveling.",
  "-ie → -ying: lie → lying, die → dying."],
 traps:[
  "Never forget <b>be</b>: She <s>working</s> ✗ → She <b>is</b> working ✓.",
  "State verbs are not normally used with -ing: like, love, hate, want, need, know, understand, believe, remember, prefer. I <b>need</b> help ✓ — <s>I’m needing</s> ✗.",
  "Some verbs change meaning: I <b>think</b> it’s nice (opinion) / I’m <b>thinking</b> about my trip (process). I <b>have</b> a car / I’m <b>having</b> lunch.",
  "In questions, be goes before the subject: What <b>are you</b> doing? ✓ — <s>What you are doing?</s> ✗"],
 examples:[
  ["I’m painting the garden fence.","I’m not painting a picture today.","What are you painting?"],
  ["My daughter is studying for an exam.","She isn’t going out tonight.","Is she studying in her room?"],
  ["We’re travelling around Brittany this week.","We aren’t staying in a hotel.","Are you staying at a campsite?"],
  ["It’s raining at the moment.","It isn’t raining in Lille.","Is it raining where you are?"]],
 drills:[
  ["A · Choose the correct form",[
   "c|Look! The children ___ in the sea.|swim|are swimming|swimming|1|Look! = now → are + -ing.",
   "c|Please be quiet. I ___ to the radio.|listen|listening|am listening|2|Now → am + -ing.",
   "c|I ___ what you mean.|am understanding|understand|understands|1|Understand is a state verb: no -ing.",
   "c|What ___ you doing this weekend?|do|are|is|1|Arrangement: are you doing…?",
   "c|At the moment, she ___ a novel in English.|reads|is reading|are reading|1|At the moment → is + -ing.",
   "c|I usually paint in the morning, but today I ___ in the afternoon.|paint|am painting|painted|1|Today = temporary change.",
   "c|In this picture, a man ___ a bike.|rides|is riding|ride|1|Describing a photo → is + -ing."]],
  ["B · Write the -ing form",[
   "f|write → ___|Drop the silent e.|writing",
   "f|swim → ___|Short vowel + consonant: double the m.|swimming",
   "f|sit → ___|Double the t.|sitting",
   "f|make → ___|Drop the e.|making",
   "f|lie → ___|-ie → -ying.|lying",
   "f|visit → ___|The stress is on vi-, so no doubling.|visiting"]],
  ["C · Complete, make negatives and questions",[
   "f|My son ___ (study) in Lille this year.|Temporary situation: is + -ing.|is studying",
   "f|Make it negative: They are watching TV.|aren’t + -ing.|They aren’t watching TV",
   "f|Make it a question: She is cooking dinner.|Move is before she.|Is she cooking dinner",
   "f|Short answer: Are you working today? (✗ no)|No, I + ’m not.|No, I’m not",
   "f|Short answer: Is it raining? (✓ yes)|Yes, it + is.|Yes, it is"]],
  ["D · Build the sentence",[
   "t|What / is / he / doing / right / now?|Question word + is + subject + -ing.",
   "t|In / this / picture, / two / women / are / walking / a / dog.|Describe a photo: are + -ing.",
   "t|I’m / not / working / this / afternoon.|I’m not + -ing."]],
  ["E · Simple or continuous? Find the correct sentence",[
   "c|Which sentence is correct?|She working in the garden.|She is work in the garden.|She is working in the garden.|2|is + -ing.",
   "c|Which sentence is correct?|I’m wanting a coffee.|I want a coffee.|I wanting a coffee.|1|Want is a state verb.",
   "c|Which sentence is correct?|What you are doing?|What are you doing?|What do you doing?|1|Be goes before the subject.",
   "c|My daughter ___ to the pool every Saturday. Today she ___ at home.|goes / is staying|is going / stays|go / is staying|0|Habit → present simple. Today → continuous."]]],
 task:{title:"Describe a photo",task:"Imagine a photo of a busy beach on a summer afternoon. Use the people and actions below to describe what is happening. Then add one sentence about what you are doing these days.",
  scene:[["👨‍👩‍👧","a family · have a picnic"],["🏰","two children · build a sandcastle"],["🏊","a man · swim in the sea"],["📖","an older woman · read under an umbrella"],["🐕","a couple · walk their dog"],["🏄","a teenager · windsurf"]],
  words:["In this picture…","In the foreground","In the background","On the left / right","while","It looks like…"],
  steps:["Say where it is: This picture shows… / In this picture, it’s…","Describe 4 actions with is / are + -ing.","Use positions: in the foreground, in the background, on the right…","Add an opinion: It looks like everyone is enjoying…"],
  checks:["I used is / are + -ing at least five times.","I used positions (foreground, background, left, right).","I added one negative (isn’t / aren’t).","I gave an impression: It looks like…"],
  a:"In this picture, it’s a sunny day at the beach. A family is having a picnic. Two children are building a sandcastle. A man is swimming in the sea and an older woman is reading a book under an umbrella. A couple is walking their dog. It looks like a nice day.",
  b:"This picture shows a busy beach on a summer afternoon. In the foreground, a family is having a picnic on a blue blanket, and two children are building a sandcastle next to them. In the background, a man is swimming, while a teenager is windsurfing further out. On the right, an older woman is sitting under an umbrella; she’s reading and she isn’t paying attention to the noise. It looks like everyone is enjoying the good weather. These days, I’m painting a lot of beach scenes, so this picture really inspires me!"}
},
{
 id:"past", tab:"Past simple", name:"Past simple", fr:"le prétérit (passé composé / passé simple)", icon:"⏮️", kicker:"FINISHED ACTIONS · FINISHED TIME · STORIES",
 intro:"Use it for actions that are finished at a finished time: yesterday, last summer, in 2019, two years ago. The same form works for every person — no -s!",
 when:[
  ["A finished action at a finished time","action terminée, moment terminé","I went to Brittany last summer."],
  ["A list of actions in a story","une suite d’actions","We arrived, parked the campervan and went for a swim."],
  ["A finished past habit or situation","habitude passée","When I was a child, I walked to school."],
  ["With ago (= il y a)","il y a… (temps)","I started painting ten years ago."]],
 signal:["yesterday","last night","last week","last summer","… ago","in 2019","when I was young","on Monday (past)","then","after that","What time…?","When…?"],
 signalNote:"<b>Ago</b> comes after the time: two years <b>ago</b> = il y a deux ans.",
 table:{head:["","All persons (I / you / he / she / it / we / they)"],rows:[
  ["✚ Regular verbs","She <b>painted</b>. They <b>visited</b>. (+ -ed)"],
  ["✚ Irregular verbs","She <b>went</b>. They <b>saw</b>. I <b>took</b>. (learn the form)"],
  ["− Negative","She <b>didn’t</b> (did not) <b>go</b>. — didn’t + <b>base verb</b>"],
  ["? Question","<b>Did</b> you <b>go</b>? Where <b>did</b> you <b>go</b>? — did + <b>base verb</b>"],
  ["Short answers","Yes, I <b>did</b>. / No, she <b>didn’t</b>."],
  ["Be: was / were","I / he / she / it <b>was</b> · you / we / they <b>were</b> · <b>wasn’t / weren’t</b> · <b>Was</b> it nice? <b>Were</b> you there? (no did!)"]]},
 spelling:[
  "Most verbs: + <b>ed</b> → walk → walked, paint → painted.",
  "Ends in -e: + <b>d</b> → like → liked, arrive → arrived, decide → decided.",
  "Consonant + y → <b>ied</b>: study → studied, try → tried. Vowel + y → + ed: play → played, stay → stayed.",
  "Short vowel + consonant: double it → stop → stopped, plan → planned. UK travel → travelled / US traveled.",
  "Sound of -ed: /t/ walked, stopped, watched · /d/ played, called, arrived · /ɪd/ (extra syllable) after t or d: painted, visited, needed, decided."],
 traps:[
  "Only <b>one</b> past form: did <b>OR</b> the past verb. Did you <s>saw</s>? ✗ → Did you <b>see</b>? ✓ · I didn’t <s>went</s> ✗ → I didn’t <b>go</b> ✓",
  "No -s for he / she / it: She <b>went</b> ✓ — <s>She wents</s> ✗",
  "Was / were never take did: <b>Were</b> you tired? ✓ — <s>Did you were tired?</s> ✗",
  "French trap: <i>J’ai visité Rome l’année dernière</i> → I <b>visited</b> Rome last year (NOT I have visited — the time is finished).",
  "found = trouvé (find) · founded = fondé (found a company). Learn the irregular verbs in the next tab 📚."],
 examples:[
  ["We travelled around France in a campervan.","We didn’t stay in hotels.","Where did you travel?"],
  ["I painted a landscape last Sunday.","I didn’t finish it.","Did you finish your painting?"],
  ["My daughter went swimming yesterday.","She didn’t swim for long.","Did she go with a friend?"],
  ["The weather was beautiful.","It wasn’t cold.","Was it hot in the south?"],
  ["The children were happy.","They weren’t tired.","Were they happy at the campsite?"]],
 drills:[
  ["A · Write the past form",[
   "f|go → ___|Irregular.|went",
   "f|see → ___|Irregular.|saw",
   "f|eat → ___|Irregular.|ate",
   "f|buy → ___|Irregular: same as bring → brought.|bought",
   "f|take → ___|Irregular.|took",
   "f|write → ___|Irregular.|wrote",
   "f|study → ___|Consonant + y → ied.|studied",
   "f|stop → ___|Double the p.|stopped",
   "f|arrive → ___|Ends in e: just + d.|arrived",
   "f|stay → ___|Vowel + y: just + ed.|stayed"]],
  ["B · Choose the correct form",[
   "c|Last summer we ___ around France in a campervan.|travel|travelled|have travelled|1|Last summer = finished time.",
   "c|I ___ to the beach yesterday.|didn’t go|didn’t went|don’t went|0|didn’t + base verb.",
   "c|___ you enjoy your trip?|Do|Did|Were|1|Past question with a main verb (enjoy) → did.",
   "c|The weather ___ beautiful last weekend.|were|was|did|1|The weather = it → was.",
   "c|___ the children happy at the campsite?|Did|Was|Were|2|The children = they → were.",
   "c|We ___ a lovely restaurant two days ago.|find|founded|found|2|Find → found.",
   "c|Did she ___ her paintings?|sold|sell|sells|1|Did + base verb.",
   "c|I started painting ten years ___.|ago|since|before|0|Ten years ago = il y a dix ans."]],
  ["C · Make it negative, a question or a short answer",[
   "f|Make it negative: I bought a new easel.|didn’t + base verb (buy).|I didn’t buy a new easel",
   "f|Make it a question: She took the train.|Did + she + base verb (take).|Did she take the train",
   "f|Make it negative: It was cold.|was → wasn’t.|It wasn’t cold",
   "f|Make it a question: They were tired.|Were goes first. No did!|Were they tired",
   "f|Short answer: Did you visit Brittany? (✓ yes)|Yes, I + did.|Yes, I did",
   "f|Short answer: Was the hotel expensive? (✗ no)|No, it + wasn’t.|No, it wasn’t"]],
  ["D · Tell the story (one gap at a time)",[
   "f|Last Saturday, I ___ (get) up early.|Get is irregular.|got",
   "f|Then I ___ (drive) to the coast.|Drive is irregular.|drove",
   "f|I ___ (paint) the sea for two hours.|Regular verb: + ed.|painted",
   "f|At lunchtime, I ___ (have) a sandwich in a café.|Have is irregular.|had",
   "f|I ___ (not / stay) late because it was cold.|didn’t + base verb.|didn’t stay",
   "t|Where / did / you / go / last / summer?|Question word + did + subject + base verb."]],
  ["E · Sounds and traps",[
   "c|In which verb does -ed sound like an extra syllable /ɪd/?|walked|played|painted|2|After t or d → /ɪd/: paint-ed.",
   "c|-ed in <i>stopped</i> sounds like…|/t/|/d/|/ɪd/|0|After p → /t/.",
   "c|Which sentence is correct?|Did you saw the sea?|Did you see the sea?|Did you seen the sea?|1|Did + base verb.",
   "c|Which sentence is correct?|I have visited Rome last year.|I visited Rome last year.|I visit Rome last year.|1|Last year is finished → past simple.",
   "c|Which sentence is correct?|Did you were at home?|Were you at home?|Was you at home?|1|You → were, and no did."]]],
 task:{title:"Tell me about your last trip or weekend",task:"Describe your last weekend or your last holiday. Say where you went, who you were with, what you did, what the weather was like, and one thing you didn’t do.",
  words:["last summer / last weekend","first","then","after that","finally","was / were","didn’t"],
  steps:["Set the time and place: Last summer, we went to…","Who with: I was with… / We were…","Three or four actions in order: First… Then… After that…","Weather and feelings: The weather was… It wasn’t…","One negative and an ending: We didn’t… In the end…"],
  checks:["I used at least six past verbs.","I used at least three irregular verbs (went, saw, ate…).","I used didn’t + base verb once.","I used was / were.","I used sequence words."],
  a:"Last weekend, I stayed near home. On Saturday morning, I went swimming with my daughter. After that, we ate at an Asian restaurant. The food was very good. On Sunday, I painted in the garden. I didn’t go out in the evening because I was tired.",
  b:"Last summer, we spent about a month travelling around France in a campervan. First, we drove to Brittany, where we stayed at a small campsite near the sea. The weather wasn’t always good, but we didn’t mind. After that, we went south and rented a house so that the children could join us. We swam, ate outside every evening, and I painted a few landscapes. It was a wonderful holiday, and I came home full of ideas for new paintings."}
},
{
 id:"pastc", tab:"Past continuous", name:"Past continuous", fr:"l’imparfait (être en train de, au passé)", icon:"🎞️", kicker:"IN PROGRESS IN THE PAST · BACKGROUND · INTERRUPTIONS",
 intro:"Use it to describe an action that was in progress at a moment in the past — the background of a story. It often translates the French imparfait: Il pleuvait. Je peignais.",
 when:[
  ["An action in progress at a past moment","en cours à un moment passé","At 8 p.m. yesterday, I was cooking."],
  ["The background of a story","le décor d’une histoire","The sun was shining and people were walking on the beach."],
  ["Two long actions at the same time (while)","deux actions en même temps","While I was painting, my daughter was reading."],
  ["A long action interrupted by a short one","action interrompue","I was driving when my phone rang."]],
 signal:["at 8 o’clock yesterday","at that moment","all evening","all day","while","when (+ interruption)","this time last year"],
 signalNote:"Think of a film: the past continuous is the <b>scene</b>; the past simple is the <b>event</b> that happens in it.",
 table:{head:["","I / he / she / it","you / we / they"],rows:[
  ["✚ Positive","She <b>was</b> paint<b>ing</b>.","They <b>were</b> paint<b>ing</b>."],
  ["− Negative","She <b>wasn’t</b> painting.","They <b>weren’t</b> painting."],
  ["? Question","<b>Was</b> she painting?","<b>Were</b> they painting? · What <b>were</b> you doing?"],
  ["Short answers","Yes, she <b>was</b>. / No, she <b>wasn’t</b>.","Yes, they <b>were</b>. / No, they <b>weren’t</b>."]]},
 spelling:[
  "<b>Was</b> with I / he / she / it — <b>were</b> with you / we / they.",
  "Singular group nouns take was: my family <b>was</b>…, the team <b>was</b>… People = plural → people <b>were</b>…",
  "-ing spelling is the same as the present continuous: swimming, writing, sitting, lying.",
  "In fast speech, was sounds like /wəz/ and were like /wə/: <i>I was painting</i> → /aɪ wəz ˈpeɪntɪŋ/."],
 traps:[
  "State verbs stay in the past simple: I <b>knew</b> ✓ — <s>I was knowing</s> ✗. I <b>wanted</b> ✓ — <s>I was wanting</s> ✗.",
  "Never forget was / were: <s>I painting when…</s> ✗ → I <b>was</b> painting when… ✓",
  "Don’t use it for a complete, finished action: <s>Last year I was going to Spain</s> ✗ → Last year I <b>went</b> to Spain ✓.",
  "French imparfait is not always past continuous! A past <b>habit</b> → past simple or used to: <i>Je nageais tous les jours</i> → I <b>swam</b> / I <b>used to swim</b> every day."],
 examples:[
  ["At 7 o’clock last night, I was painting.","I wasn’t watching TV.","What were you doing at 7?"],
  ["It was raining when we arrived at the campsite.","It wasn’t snowing.","Was it raining when you arrived?"],
  ["The children were playing on the beach.","They weren’t swimming.","Were they playing together?"],
  ["While I was walking by the sea, I saw a seal.","I wasn’t looking at my phone.","What were you doing when you saw it?"]],
 drills:[
  ["A · Was or were? Choose the correct form",[
   "c|At 9 p.m. yesterday, I ___ a film.|watched|was watching|were watching|1|At a precise past moment → was + -ing.",
   "c|The children ___ in the garden.|was playing|were playing|playing|1|The children = they → were.",
   "c|What ___ you doing when I called?|was|were|did|1|You → were.",
   "c|My daughter ___ when I got home. She was in the kitchen.|wasn’t sleeping|didn’t sleeping|weren’t sleeping|0|She → wasn’t + -ing.",
   "c|When we arrived, the sun ___.|shone|was shining|is shining|1|Background description → was + -ing.",
   "c|I ___ the answer.|was knowing|knew|were knowing|1|Know is a state verb.",
   "c|My family ___ dinner when the lights went out.|were having|was having|was have|1|My family (one group) → was."]],
  ["B · Complete with was / were + -ing",[
   "f|I ___ (paint) when the doorbell rang.|I → was + -ing.|was painting",
   "f|They ___ (wait) for the bus.|They → were + -ing.|were waiting",
   "f|It ___ (snow) all day.|It → was + -ing.|was snowing",
   "f|We ___ (drive) along the coast at midnight.|We → were + -ing.|were driving",
   "f|He ___ (not / listen) to the guide.|wasn’t + -ing.|wasn’t listening",
   "f|Make it a question: You were sleeping.|Were + you + -ing.|Were you sleeping"]],
  ["C · Make it negative, a question or a short answer",[
   "f|Make it negative: She was reading a magazine.|was → wasn’t.|She wasn’t reading a magazine",
   "f|Make it a question: They were having dinner.|Were goes first.|Were they having dinner",
   "f|Short answer: Were you sleeping? (✗ no)|No, I + wasn’t.|No, I wasn’t",
   "f|Short answer: Was it raining? (✓ yes)|Yes, it + was.|Yes, it was",
   "t|What / was / she / doing / at / ten / o’clock?|Question word + was + subject + -ing."]],
  ["D · Find the correct sentence",[
   "c|Which sentence is correct?|We was walking on the beach.|We were walking on the beach.|We were walk on the beach.|1|We → were + -ing.",
   "c|Which sentence is correct?|I was wanting to go home.|I wanted to go home.|I were wanting to go home.|1|Want is a state verb.",
   "c|Which sentence is correct? (a finished trip)|In 2019, I was going to Spain for a week.|In 2019, I went to Spain for a week.|In 2019, I were going to Spain.|1|A complete finished action → past simple.",
   "c|<i>Quand j’étais petite, je nageais tous les jours.</i>|When I was little, I was swimming every day.|When I was little, I swam every day.|When I was little, I were swimming every day.|1|A past habit → past simple (or used to)."]]],
 task:{title:"Describe a scene from the past",task:"Think of a moment when you arrived somewhere (a campsite, a beach, a party, a town). Describe the scene: what was the weather like and what were the people doing? Finish with one event in the past simple.",
  words:["When we arrived…","was / were + -ing","while","Meanwhile","Suddenly…"],
  steps:["Set the moment: When I arrived at…, it was…","Weather: The sun was shining / It was raining…","Three people and what they were doing.","Use while for two things at the same time.","End with one event: Suddenly, … (past simple)."],
  checks:["I used was / were + -ing at least four times.","I used while once.","I used was with I / he / she / it and were with you / we / they.","I ended with a past simple event."],
  a:"When we arrived at the campsite, it was raining. Some people were sitting under their tents. Two children were playing with a ball. A man was cooking on a barbecue. My daughter was sleeping in the campervan. Suddenly, the sun came out!",
  b:"When we arrived at the campsite in Brittany, it was late afternoon and a light rain was falling. A few families were sitting under their awnings, chatting and drinking tea, while their children were running between the pitches with a football. Near the entrance, a man was trying to light a barbecue, but the wind was blowing out the flames. Meanwhile, my daughter was sleeping in the back of the campervan. Suddenly, the clouds disappeared, and everybody came out to look at the rainbow over the sea."}
},
{
 id:"story", tab:"Past simple + continuous", name:"Past simple or past continuous?", fr:"prétérit ou imparfait ?", icon:"📖", kicker:"TELL A STORY · WHEN AND WHILE",
 intro:"Good stories mix both tenses: the past continuous paints the background, the past simple tells what happened. This is the key to telling a story in your CLOE speaking test.",
 when:[
  ["Long background action + short event","action longue + événement court","I <b>was painting</b> when it <b>started</b> to rain."],
  ["while + long action (past continuous)","pendant que…","<b>While</b> we <b>were driving</b>, the children <b>were singing</b>."],
  ["when + short event (past simple)","quand…","<b>When</b> the phone <b>rang</b>, I <b>was cooking</b>."],
  ["A series of finished actions → all past simple","une suite d’actions","I <b>opened</b> the door, <b>saw</b> my friend and <b>smiled</b>."],
  ["Meaning changes!","attention au sens","When she arrived, I <b>made</b> tea (after she arrived) / I <b>was making</b> tea (I had already started)."]],
 signal:["when","while","as","suddenly","then","at that moment","in the end"],
 signalNote:"Story recipe: <b>background</b> (was / were + -ing) ➜ <b>event</b> (past simple) ➜ <b>result</b> (past simple) ➜ <b>ending</b> (In the end…).",
 table:{head:["","Past continuous = the scene 🎞️","Past simple = the event ⚡"],rows:[
  ["Form","was / were + -ing","-ed or irregular form"],
  ["Length","long, in progress, unfinished at that moment","short, complete"],
  ["Typical link","<b>while</b> I was walking…","<b>when</b> I saw…"],
  ["Example","I <b>was walking</b> the dog…","…when it <b>started</b> to rain."]]},
 spelling:[
  "You can start with either part: <i>When the phone rang, I was cooking</i> = <i>I was cooking when the phone rang</i>.",
  "Put a comma when the when / while clause comes first: <b>While</b> I was driving<b>,</b> I saw a deer.",
  "Useful story words: First… / At first… / Then… / Suddenly… / Luckily… / Unfortunately… / In the end…"],
 traps:[
  "<s>When I was arriving, they had dinner.</s> ✗ → When I <b>arrived</b>, they <b>were having</b> dinner. ✓ (Arrive is short; dinner is the long action.)",
  "Don’t use while with a short event: <s>While the phone rang…</s> ✗ → <b>When</b> the phone rang… ✓",
  "A list of quick actions = all past simple: I got up, had a coffee and left. (Not was getting up…)"],
 examples:[
  ["I was walking the dog when it started to rain.","I wasn’t carrying an umbrella.","What were you doing when it started to rain?"],
  ["While we were driving, we saw a deer.","We weren’t going fast.","Were you driving when you saw it?"],
  ["When I got home, my daughter was cooking.","She wasn’t watching TV.","Was she cooking when you got home?"]],
 drills:[
  ["A · Choose the correct form",[
   "c|I ___ a shower when the phone rang.|took|was taking|were taking|1|Long action interrupted → was + -ing.",
   "c|While we ___ along the coast, we saw dolphins.|drove|were driving|was driving|1|While + long action → were + -ing.",
   "c|When I got home, my daughter ___ dinner.|was cooking|cooks|were cooking|0|She had already started → was cooking.",
   "c|She ___ when she was walking in the forest.|was falling|fell|falls|1|Short event → past simple.",
   "c|What ___ when the accident happened?|did you do|were you doing|you were doing|1|Activity in progress at that moment.",
   "c|When the film finished, we ___ to bed.|were going|went|go|1|One action after another → past simple.",
   "c|___ the phone rang, I was cooking.|While|When|During|1|When + short event."]],
  ["B · Complete each gap",[
   "f|I ___ (walk) by the sea when it started to rain.|Long background action.|was walking",
   "f|I was walking by the sea when it ___ (start) to rain.|Short event.|started",
   "f|While she ___ (paint), her phone rang.|While + long action.|was painting",
   "f|We ___ (have) dinner when the lights went out.|Long action, we → were.|were having",
   "f|The children were playing when their father ___ (arrive).|Short event.|arrived",
   "f|I ___ (see) an old friend while I was shopping.|Short event: see is irregular.|saw"]],
  ["C · Build the sentence",[
   "t|What / were / you / doing / when / the / storm / started?|What + were + you + -ing + when + past simple.",
   "t|While / I / was / driving, / I / saw / a / deer.|While + past continuous, + past simple.",
   "t|When / we / arrived, / it / was / raining.|When + past simple, + past continuous."]],
  ["D · Find the correct sentence",[
   "c|Which sentence is correct?|When I was arriving, they had dinner.|When I arrived, they were having dinner.|When I arrived, they were have dinner.|1|Arrive = short; dinner = long.",
   "c|Which sentence is correct?|While the phone rang, I was cooking.|When the phone rang, I was cooking.|When the phone was ringing, I cooked.|1|Short event → when + past simple.",
   "c|Which sentence is correct?|I was getting up, having a coffee and leaving.|I got up, had a coffee and left.|I got up, was having a coffee and was leaving.|1|A list of quick actions → past simple.",
   "c|“When she arrived, I made tea.” What does it mean?|I started making tea after she arrived.|I was already making tea.|I made tea every day.|0|Past simple + past simple = one after the other."]]],
 task:{title:"Tell a short story",task:"Tell a short story about a moment when something unexpected happened — on a trip, at the weekend or at home. Set the scene with the past continuous, then tell the events with the past simple.",
  words:["One day / One evening","was / were + -ing","while","when","Suddenly","Luckily","In the end"],
  steps:["Background: One evening last summer, I was… The sun was…","The event: Suddenly, … (past simple)","What you did next: I… Then I…","Ending: In the end, … / Luckily, …"],
  checks:["I set the scene with was / were + -ing.","I used when and while correctly.","I told the main events in the past simple.","I gave an ending with In the end / Luckily."],
  a:"Last summer, we were driving to Brittany. It was raining and the children were sleeping. Suddenly, we heard a strange noise. We had a flat tyre! We stopped by the road. While I was looking for the tools, a kind man stopped and helped us. In the end, we arrived at the campsite at midnight.",
  b:"One evening last summer, I was painting by a lake while my family was preparing dinner at the campsite. The light was perfect and everything was calm. Suddenly, a strong wind started to blow and my easel fell into the water! While I was trying to get it back, a family who were walking nearby came to help me. They didn’t speak French, so we talked in English. In the end, I saved the painting, and we invited them to share our dinner."}
},
{
 id:"pp", tab:"Present perfect", name:"Present perfect", fr:"le present perfect (passé ↔ présent)", icon:"🔗", kicker:"EXPERIENCE · NEWS · JUST / ALREADY / YET · FOR / SINCE",
 intro:"The present perfect connects the past to now. Use it when the time is not given or not finished: your life experience, recent news with a result now, and situations that started in the past and continue today.",
 when:[
  ["Life experience (no time given)","expérience de vie","I have visited Scotland twice. Have you ever tried sushi?"],
  ["Recent news with a result now","nouvelle récente, résultat visible","I’ve lost my keys (I can’t find them now). She’s passed her exam!"],
  ["just / already / yet","juste / déjà / pas encore","I’ve just finished. I’ve already eaten. I haven’t finished yet."],
  ["Started in the past and still true now (for / since)","depuis… (et ça continue)","I’ve lived here for fifteen years. I’ve painted since 2015."],
  ["Unfinished time: today, this week, this year, so far","période pas terminée","I’ve had three coffees today."]],
 signal:["ever","never","before","just","already","yet","still","recently","so far","for","since","How long…?","today","this week","this year","twice","three times"],
 signalNote:"<b>ever / never / just / already</b> go between have and the participle (I’ve <b>never</b> been). <b>yet</b> goes at the end (Have you finished <b>yet</b>?).",
 table:{head:["","I / you / we / they","he / she / it"],rows:[
  ["✚ Positive","I’<b>ve</b> (have) <b>visited</b> Rome.","She’<b>s</b> (has) <b>visited</b> Rome."],
  ["− Negative","I <b>haven’t</b> visited Rome.","She <b>hasn’t</b> visited Rome."],
  ["? Question","<b>Have</b> you <b>ever</b> visited Rome?","<b>Has</b> she visited Rome?"],
  ["Short answers","Yes, I <b>have</b>. / No, I <b>haven’t</b>.","Yes, she <b>has</b>. / No, she <b>hasn’t</b>."],
  ["How long?","<b>How long have</b> you lived here?","<b>How long has</b> she worked there?"]]},
 spelling:[
  "Form = <b>have / has + past participle</b> (the 3rd column of the verb list).",
  "Regular verbs: participle = past simple: visited, played, studied, stopped.",
  "Irregular verbs: learn the 3rd form: go → <b>gone</b>, see → <b>seen</b>, eat → <b>eaten</b>, do → <b>done</b>, be → <b>been</b>, write → <b>written</b>, take → <b>taken</b>.",
  "<b>for</b> + a duration: for ten years, for two weeks, for a long time. <b>since</b> + a starting point: since 2010, since Monday, since I was a child.",
  "<b>been</b> vs <b>gone</b>: She has <b>been</b> to Spain (she went and came back) · She has <b>gone</b> to Spain (she is there now)."],
 traps:[
  "<b>No finished time</b> with the present perfect: <s>I have seen him yesterday</s> ✗ → I <b>saw</b> him yesterday ✓.",
  "French trap: <i>J’habite ici depuis 10 ans</i> → I <b>have lived</b> here <b>for</b> 10 years ✓ — <s>I live here since 10 years</s> ✗.",
  "<i>depuis</i> + duration → <b>for</b>; <i>depuis</i> + date / moment → <b>since</b>.",
  "He / she / it → <b>has</b>: She <b>has</b> finished ✓ — <s>She have finished</s> ✗. (She’s finished = She has finished.)",
  "Use the participle, not the past simple: I have <b>eaten</b> ✓ — <s>I have ate</s> ✗."],
 examples:[
  ["I have visited Scotland twice.","I have never been to Ireland.","Have you ever been to Ireland?"],
  ["My daughter has just passed her driving test.","She hasn’t bought a car yet.","Has she bought a car yet?"],
  ["We’ve lived in this house for twelve years.","We haven’t moved since 2013.","How long have you lived there?"],
  ["I’ve already finished my painting.","I haven’t framed it yet.","Have you framed it yet?"]],
 drills:[
  ["A · Write the past participle",[
   "f|go → have ___|Irregular: 3rd form.|gone|been",
   "f|see → have ___|Irregular: 3rd form.|seen",
   "f|eat → have ___|Irregular: 3rd form.|eaten",
   "f|write → have ___|Irregular: double t.|written",
   "f|take → have ___|Irregular: 3rd form.|taken",
   "f|do → have ___|Irregular: 3rd form.|done",
   "f|buy → have ___|Same as the past simple.|bought",
   "f|swim → have ___|swim · swam · ___|swum",
   "f|visit → have ___|Regular: + ed.|visited"]],
  ["B · Have or has? Choose the correct form",[
   "c|I ___ to Scotland twice.|have been|has been|was|0|Experience, I → have been.",
   "c|My daughter ___ her exam!|have passed|has passed|has pass|1|She → has + participle.",
   "c|___ you ever tried Indian food?|Did|Have|Has|1|Ever + experience → Have you ever…?",
   "c|___ your son ever been to London?|Have|Has|Is|1|Your son = he → has.",
   "c|I ___ my keys. I can’t open the door!|lost|have lost|was losing|1|Result now → present perfect.",
   "c|She isn’t here. She ___ to the shops.|has been|has gone|have gone|1|She is there now → gone."]],
  ["C · Just, already, yet, ever, never",[
   "c|Have you finished your painting ___?|already|yet|just|1|Yet goes at the end of questions.",
   "c|I’ve ___ finished. Look, the paint is still wet!|yet|just|ever|1|Just = a very short time ago.",
   "c|“Shall we book the campsite?” “I’ve ___ booked it!”|yet|ever|already|2|Already = earlier than expected.",
   "c|I’ve ___ been to Corsica. I’d love to go!|ever|never|yet|1|Never = not at any time.",
   "c|We haven’t eaten ___.|yet|already|just|0|Yet goes at the end of negatives.",
   "t|Have / you / ever / been / to / Scotland?|Have + you + ever + participle.",
   "f|Put <i>already</i> in the sentence: I have booked the hotel.|Between have and the participle.|I have already booked the hotel|I’ve already booked the hotel"]],
  ["D · For or since?",[
   "f|___ last summer|A starting point.|since",
   "f|___ three weeks|A duration.|for",
   "f|___ I was a child|A starting point.|since",
   "f|___ Monday|A starting point.|since",
   "f|___ a long time|A duration.|for",
   "c|I’ve lived here ___ 2010.|for|since|from|1|2010 is a starting point.",
   "c|He has worked there ___ fifteen years.|since|for|ago|1|Fifteen years is a duration.",
   "t|How / long / have / you / lived / in / Lille?|How long + have + you + participle."]],
  ["E · Make it negative, a question or a short answer",[
   "f|Make it negative: I have finished the book.|have → haven’t.|I haven’t finished the book",
   "f|Make it a question: She has visited London.|Has goes first.|Has she visited London",
   "f|Make it negative with yet: We have booked the campsite.|haven’t + participle + yet (at the end).|We haven’t booked the campsite yet",
   "f|Short answer: Have you ever painted a portrait? (✗ no)|No, I + haven’t.|No, I haven’t",
   "f|Short answer: Has she finished? (✓ yes)|Yes, she + has.|Yes, she has"]],
  ["F · French traps",[
   "c|<i>J’habite à Lille depuis 20 ans.</i>|I live in Lille since 20 years.|I have lived in Lille for 20 years.|I lived in Lille for 20 years.|1|Still true now + duration → have lived + for.",
   "c|<i>Je peins depuis 2015.</i>|I have painted since 2015.|I paint since 2015.|I am painting for 2015.|0|Still true now + starting point → have painted + since.",
   "c|Which sentence is correct?|I have seen this film last week.|I saw this film last week.|I have saw this film.|1|Last week is finished → past simple.",
   "c|Which sentence is correct?|She have just arrived.|She has just arrive.|She has just arrived.|2|She → has + participle."]]],
 task:{title:"Talk about your experiences",task:"Talk about your life experiences: places you have visited (and how many times), something you have never done but would like to do, and how long you have lived where you live or done your hobby.",
  words:["I’ve been to…","twice / three times","I’ve never…","I’ve already…","I haven’t… yet","for","since","So far this year…"],
  steps:["Where you live: I’ve lived in / near… for / since…","Places: I’ve been to… twice. I’ve never been to…","Your hobby: I’ve painted since… So far this year, I’ve…","Something not done yet: I haven’t… yet, but I’d like to."],
  checks:["I used have / has + participle at least five times.","I used for AND since correctly.","I used never and already or yet.","I didn’t use a finished time (yesterday, last year) with the present perfect."],
  a:"I have lived near Lille for many years. I have visited a lot of regions in France. I have been to Brittany three times, but I have never been to Corsica. I have painted since I was young. This year, I have already finished five paintings, but I haven’t sold any yet.",
  b:"I’ve lived near Lille for most of my life, and I’ve seen the city change a lot. I’ve travelled quite a lot in France — I’ve been to Brittany several times and I’ve explored the south in a campervan — but I’ve never visited Corsica, which is on my list. I’ve loved drawing since I was a child, and over the last few years I’ve started painting landscapes more seriously. So far this year, I’ve finished five paintings, although I haven’t shown them to anyone yet!"}
},
{
 id:"ppps", tab:"Present perfect vs past simple", name:"Present perfect or past simple?", fr:"present perfect ou prétérit ?", icon:"⚖️", kicker:"THE MOST IMPORTANT CHOICE · TIME FINISHED OR NOT?",
 intro:"Ask yourself one question: is the time finished or given? Yes → past simple. No time, or time not finished → present perfect. In conversation, we often ask in the present perfect and give details in the past simple.",
 when:[
  ["Present perfect: no time, the experience is what matters","pas de moment précis","I’ve been to Scotland."],
  ["Past simple: you give the time or details (when, where, how)","moment précis / détails","I went there in 2018. It rained every day!"],
  ["Present perfect: still true now","ça continue","I’ve lived in Lille for ten years. (I still live there.)"],
  ["Past simple: finished situation","c’est fini","I lived in Paris for five years. (I don’t live there now.)"],
  ["When…? questions → always past simple","Quand… ? = prétérit","When did you go? ✓ — When have you gone? ✗"]],
 signal:["PP: ever · never · just · already · yet · for / since (until now) · so far · today · this week","PS: yesterday · last … · … ago · in 2019 · When…? · What time…? · when I was…"],
 signalNote:"<b>This morning</b>: at 10 a.m. → I’ve had two coffees this morning (still morning). At 4 p.m. → I had two coffees this morning (morning finished).",
 table:{head:["","Present perfect 🔗","Past simple ⏮️"],rows:[
  ["Time","not given or not finished","finished and given"],
  ["Form","have / has + participle","-ed or irregular past"],
  ["Question","<b>Have</b> you <b>been</b> to Rome?","<b>When did</b> you <b>go</b>?"],
  ["Example","I’ve lost my phone. (Where is it?)","I lost it on the train yesterday."],
  ["Conversation","Have you ever tried surfing?","Yes, I tried it in Biarritz last year. I fell a lot!"]]},
 spelling:[
  "The classic pattern: ① question in the present perfect ➜ ② short answer ➜ ③ details in the past simple.",
  "“Have you seen the new exhibition?” “Yes, I <b>have</b>. I <b>saw</b> it last Saturday. It <b>was</b> amazing.”",
  "A person who is no longer alive → past simple: My grandfather <b>loved</b> painting."],
 traps:[
  "<s>I have visited Rome in 2019.</s> ✗ → I <b>visited</b> Rome in 2019. ✓",
  "<s>When have you arrived?</s> ✗ → When <b>did</b> you arrive? ✓",
  "<s>Did you ever go to Scotland?</s> (unnatural) → <b>Have</b> you ever <b>been</b> to Scotland? ✓",
  "<s>I live here since ten years.</s> ✗ → I’<b>ve lived</b> here <b>for</b> ten years. ✓"],
 examples:[
  ["I’ve been to Scotland. I went there in 2018.","I haven’t been back since then.","Have you been to Scotland? When did you go?"],
  ["She has lost her phone. She lost it on the train.","She hasn’t found it yet.","Has she found it? Where did she lose it?"],
  ["I’ve lived in Lille for ten years. Before that, I lived in Paris.","I didn’t like living in Paris.","How long have you lived in Lille?"]],
 drills:[
  ["A · Choose the correct form",[
   "c|I ___ to Edinburgh in 2018.|have been|went|have gone|1|In 2018 = finished time.",
   "c|___ you ever ___ snails?|Did / eat|Have / eaten|Have / ate|1|Ever + experience → Have … eaten.",
   "c|“Have you been to Italy?” “Yes, I ___ there two years ago.”|have gone|went|have been|1|Two years ago → past simple.",
   "c|When ___ the exhibition?|have you seen|did you see|you saw|1|When…? → past simple.",
   "c|She ___ in Paris for three years, then she moved to Lille.|has lived|lived|has been|1|Finished situation.",
   "c|We ___ three paintings so far this month.|sold|have sold|were selling|1|So far = until now.",
   "c|I ___ him yesterday.|have seen|saw|see|1|Yesterday → past simple.",
   "c|It’s 10 a.m. I ___ two coffees this morning.|had|have had|was having|1|The morning is not finished.",
   "c|It’s 4 p.m. I ___ two coffees this morning.|had|have had|have|0|The morning is finished.",
   "c|My grandfather ___ painting. He died in 2010.|loved|has loved|has been loving|0|He is no longer alive → past simple."]],
  ["B · Complete each gap",[
   "f|I ___ (visit) Rome last year.|Last year → past simple.|visited",
   "f|Have you ever ___ (try) surfing?|Have + participle.|tried",
   "f|I ___ (never / see) the Northern Lights.|have + never + participle (see → seen).|have never seen",
   "f|We ___ (go) to the coast last weekend.|Last weekend → past simple.|went",
   "f|She ___ (already / finish) her painting.|has + already + participle.|has already finished",
   "f|They ___ (move) here in 2015.|In 2015 → past simple.|moved",
   "f|They ___ (live) here since 2015.|Since → present perfect.|have lived"]],
  ["C · Build the conversation",[
   "t|Have / you / ever / been / to / Brittany?|① Present perfect question.",
   "t|When / did / you / go / there?|② When → past simple.",
   "t|I / went / there / two / years / ago.|③ Details → past simple."]],
  ["D · Find the correct version",[
   "c|Which conversation is correct?|“Have you been to Rome?” “Yes, I have been there in 2019.”|“Did you go to Rome?” “Yes, I have gone in 2019.”|“Have you been to Rome?” “Yes, I went there in 2019.”|2|Question PP → details PS.",
   "c|Which sentence is correct?|When have you started painting?|When did you start painting?|When you started painting?|1|When → past simple.",
   "c|Which sentence is correct?|I live in Lille since ten years.|I’ve lived in Lille for ten years.|I lived in Lille since ten years.|1|Still true + duration → have lived + for.",
   "c|Which sentence is correct?|I’ve finished my painting yesterday.|I finished my painting yesterday.|I’ve finish my painting yesterday.|1|Yesterday → past simple."]]],
 task:{title:"One experience, two tenses",task:"Tell someone about one experience you have had (a place you have visited or something new you have tried). Start with the present perfect, then give the details with the past simple: when, where, who with, what happened and how it was.",
  words:["Have I ever…? Yes, I’ve…","I went / I tried…","in 2018 / last spring / … ago","It was…","Since then, I’ve…"],
  steps:["Introduce the experience: I’ve been to… / I’ve tried…","When and who with: I went there in… with…","What happened: We visited… It rained… (past simple)","How it was: It was… I loved…","Link back to now: Since then, I’ve… / I’ve never…"],
  checks:["I introduced the experience with the present perfect.","I gave the details in the past simple.","I used a finished time expression (in…, last…, … ago).","I came back to now with Since then, I’ve… or I’ve never…"],
  a:"I have been to Scotland once. I went there in 2018 with my family. We visited Edinburgh and we walked a lot. It rained every day, but we loved it. I haven’t been back since then, but I would like to go again.",
  b:"Have I ever done something unusual? Yes — I’ve painted outdoors in the rain! It happened last spring in Brittany. I was painting a small harbour when the weather suddenly changed. I didn’t want to stop, so I put up an umbrella and kept going. The colours ran a little, but the result was surprisingly beautiful. Since then, I’ve painted outside in all kinds of weather, and that painting has become one of my favourites."}
},
{
 id:"fut", tab:"Future forms", name:"Future · will, going to, present continuous", fr:"le futur", icon:"🔮", kicker:"PLANS · ARRANGEMENTS · DECISIONS · PREDICTIONS",
 intro:"English has several futures. Choose by meaning: a plan you have already decided (going to), an arrangement with a time or person (present continuous), or a decision, promise or opinion now (will).",
 when:[
  ["be going to: a plan or intention decided before","projet, intention","I’m going to paint the sea next weekend."],
  ["be going to: evidence now","je le vois venir","Look at those clouds! It’s going to rain."],
  ["Present continuous: a fixed arrangement","rendez-vous fixé","I’m meeting my sister on Saturday at 10."],
  ["will: a decision at the moment of speaking, an offer, a promise","décision immédiate, offre, promesse","It’s cold. I’ll close the window. I’ll help you!"],
  ["will: prediction or opinion (I think…, probably)","prédiction, opinion","I think it will be sunny tomorrow."],
  ["Present simple: timetables","horaires","The train leaves at 8:15."]],
 signal:["tomorrow","next week","next summer","soon","in two days","this weekend","tonight","I think…","I’m sure…","probably","I hope…"],
 signalNote:"After <b>when / if / as soon as</b> about the future, use the present simple: When I <b>arrive</b>, I’ll call you. ✓ — <s>When I will arrive</s> ✗",
 table:{head:["","will","be going to"],rows:[
  ["✚ Positive","I / she / they <b>will</b> (’ll) <b>go</b>.","I’<b>m going to</b> go. She’<b>s going to</b> go. They’<b>re going to</b> go."],
  ["− Negative","I <b>won’t</b> (will not) <b>go</b>.","I’<b>m not going to</b> go. She <b>isn’t going to</b> go."],
  ["? Question","<b>Will</b> you <b>go</b>?","<b>Are</b> you <b>going to</b> go? <b>Is</b> she <b>going to</b> go?"],
  ["Short answers","Yes, I <b>will</b>. / No, I <b>won’t</b>.","Yes, I <b>am</b>. / No, she <b>isn’t</b>."]]},
 spelling:[
  "will + <b>base verb</b>, for every person: she will <b>go</b> (no -s, no to).",
  "going to + <b>base verb</b>: I’m going to <b>visit</b>.",
  "In speech, going to often sounds like <i>gonna</i> — understand it, but write going to.",
  "won’t /wəʊnt/ ≠ want /wɒnt/: listen carefully!"],
 traps:[
  "<s>I will to go.</s> ✗ → I will <b>go</b>. ✓",
  "<s>When I will arrive, I’ll call you.</s> ✗ → When I <b>arrive</b>, I’ll call you. ✓",
  "Plans: <s>I go to the cinema tomorrow.</s> ✗ → I’m <b>going</b> to the cinema tomorrow / I’m <b>going to go</b>… ✓",
  "Instant decision: “The phone’s ringing.” “I’<b>ll</b> answer it!” ✓ — <s>I’m going to answer it</s> (sounds pre-planned)."],
 examples:[
  ["I’m going to visit my son next month.","I’m not going to drive.","Are you going to take the train?"],
  ["I’m meeting a friend for lunch tomorrow.","We aren’t meeting at the restaurant.","Where are you meeting?"],
  ["I think it will be sunny on Saturday.","It won’t rain.","Will it be warm?"]],
 drills:[
  ["A · Choose the best future form",[
   "c|Look at the sky! It ___ rain.|will|is going to|goes to|1|Evidence now → going to.",
   "c|“I’m thirsty.” “I ___ get you a glass of water.”|am going to|will|am getting|1|Offer / instant decision → will.",
   "c|I ___ my sister on Saturday at 11. We’ve booked a table.|will meet|am meeting|meet|1|Fixed arrangement → present continuous.",
   "c|The train ___ at 7:45 tomorrow morning.|leaves|will leaving|is leave|0|Timetable → present simple.",
   "c|I think you ___ love this book.|are going|will|are|1|I think + prediction → will.",
   "c|When I ___ home, I’ll call you.|will get|get|am going to get|1|After when → present simple.",
   "c|We ___ to Scotland next summer. We’ve already decided.|will go|are going to go|go|1|Decided plan → going to.",
   "c|I promise I ___ forget.|won’t|am not going|don’t|0|Promise → will / won’t."]],
  ["B · Complete the sentence",[
   "f|Next year, I ___ (going to / learn) watercolour.|I’m going to + base verb.|am going to learn",
   "f|She ___ (will / not / come) tomorrow.|will not = won’t.|won’t come",
   "f|It’s cold. I ___ (will / close) the window.|Instant decision → ’ll.|will close",
   "f|Make it a question: She is going to paint the kitchen.|Is goes first.|Is she going to paint the kitchen",
   "f|Make it negative: I will be late.|will → won’t.|I won’t be late",
   "f|Short answer: Will you come to my exhibition? (✓ yes)|Yes, I + will.|Yes, I will"]],
  ["C · Build the sentence",[
   "t|What / are / you / going / to / do / this / weekend?|What + are + you + going to + base verb.",
   "t|I’ll / call / you / when / I / arrive.|When + present simple.",
   "t|Are / you / meeting / anyone / tomorrow?|Arrangement question: are + you + -ing."]],
  ["D · Find the correct sentence",[
   "c|Which sentence is correct?|I will to visit Rome.|I will visit Rome.|I will visiting Rome.|1|will + base verb.",
   "c|Which sentence is correct?|When I will see her, I’ll tell her.|When I see her, I’ll tell her.|When I see her, I tell her tomorrow.|1|After when → present simple.",
   "c|Which sentence is correct? (a plan)|I go to the dentist tomorrow.|I’m going to the dentist tomorrow.|I will going to the dentist tomorrow.|1|Arrangement → present continuous."]]],
 task:{title:"Your plans and predictions",task:"Talk about your plans for next weekend and your next holiday. Include one arrangement (present continuous), two plans (going to) and one prediction or promise (will).",
  words:["On Saturday I’m meeting…","I’m going to…","We’re going to…","I think it will…","I’ll…","When I…, I’ll…"],
  steps:["An arrangement: On Saturday morning, I’m…","Two plans: I’m going to… We’re going to…","A prediction: I think it will… / It probably won’t…","A promise or offer: I’ll send you…"],
  checks:["I used the present continuous for an arrangement.","I used going to for two plans.","I used will / won’t for a prediction or promise.","After when / if, I used the present simple."],
  a:"Next weekend, I’m going to paint in the garden if the weather is nice. On Saturday, I’m meeting a friend for lunch. Next summer, we are going to travel to Scotland. I think it will be beautiful, but it will probably rain! I’ll send you a photo.",
  b:"This weekend is quite busy. On Saturday morning I’m taking my daughter to the pool, and in the afternoon I’m meeting a friend for coffee in town. On Sunday, I’m going to start a new painting — I’d like to try a sea view in watercolour. As for next summer, we’re going to travel to Scotland in the campervan. I think the landscapes will be amazing for painting, although I’m sure it will rain more than once! When I get back, I’ll show you my favourite painting from the trip."}
}
];

// Irregular verbs: [base, past simple, past participle, French]
const irregularGroups = [
 ["All the same (A · A · A)","Easy! The three forms are identical.",[
  ["cost","cost","cost","coûter"],["cut","cut","cut","couper"],["hit","hit","hit","frapper"],["let","let","let","laisser"],["put","put","put","mettre"],["read","read (said “red”)","read (said “red”)","lire"],["set","set","set","fixer / régler"],["shut","shut","shut","fermer"]]],
 ["Past = participle (A · B · B)","Learn one new form and use it twice.",[
  ["bring","brought","brought","apporter"],["build","built","built","construire"],["buy","bought","bought","acheter"],["catch","caught","caught","attraper"],["feel","felt","felt","ressentir"],["find","found","found","trouver"],["get","got","got (US: gotten)","obtenir / devenir"],["have","had","had","avoir"],["hear","heard","heard","entendre"],["keep","kept","kept","garder"],["leave","left","left","partir / laisser"],["lose","lost","lost","perdre"],["make","made","made","faire / fabriquer"],["meet","met","met","rencontrer"],["pay","paid","paid","payer"],["say","said","said","dire"],["sell","sold","sold","vendre"],["send","sent","sent","envoyer"],["sit","sat","sat","s’asseoir"],["sleep","slept","slept","dormir"],["spend","spent","spent","dépenser / passer (du temps)"],["stand","stood","stood","être debout"],["teach","taught","taught","enseigner"],["tell","told","told","raconter / dire"],["think","thought","thought","penser"],["understand","understood","understood","comprendre"],["win","won","won","gagner"]]],
 ["Back to the start (A · B · A)","The participle looks like the base verb.",[
  ["become","became","become","devenir"],["come","came","come","venir"],["run","ran","run","courir"]]],
 ["All different (A · B · C)","Three forms to learn. Say them aloud as a little song.",[
  ["be","was / were","been","être"],["begin","began","begun","commencer"],["break","broke","broken","casser"],["choose","chose","chosen","choisir"],["do","did","done","faire"],["draw","drew","drawn","dessiner"],["drink","drank","drunk","boire"],["drive","drove","driven","conduire"],["eat","ate","eaten","manger"],["fall","fell","fallen","tomber"],["fly","flew","flown","voler (avion)"],["forget","forgot","forgotten","oublier"],["give","gave","given","donner"],["go","went","gone / been","aller"],["know","knew","known","savoir / connaître"],["ride","rode","ridden","faire du vélo / cheval"],["ring","rang","rung","sonner"],["see","saw","seen","voir"],["sing","sang","sung","chanter"],["speak","spoke","spoken","parler"],["swim","swam","swum","nager"],["take","took","taken","prendre"],["wake","woke","woken","se réveiller"],["wear","wore","worn","porter (vêtement)"],["write","wrote","written","écrire"]]]
];

// ===================== QUESTION LAB DATA =====================
const auxMap = [
 ["Present simple","do / does","<b>Do</b> you paint? <b>Does</b> she paint?","Yes, I do. / No, she doesn’t."],
 ["Be (present)","am / is / are","<b>Are</b> you tired? <b>Is</b> it far?","Yes, I am. / No, it isn’t."],
 ["Present continuous","am / is / are","What <b>are</b> you doing? <b>Is</b> she working?","Yes, she is. / No, she isn’t."],
 ["Past simple","did","Where <b>did</b> you go? <b>Did</b> she call?","Yes, I did. / No, she didn’t."],
 ["Be (past)","was / were","<b>Was</b> it nice? <b>Were</b> they there?","Yes, it was. / No, they weren’t."],
 ["Past continuous","was / were","What <b>were</b> you doing? <b>Was</b> it raining?","Yes, it was. / No, I wasn’t."],
 ["Present perfect","have / has","<b>Have</b> you ever been…? <b>Has</b> she finished?","Yes, I have. / No, she hasn’t."],
 ["Future · will","will","<b>Will</b> you come?","Yes, I will. / No, I won’t."],
 ["Future · going to","am / is / are","<b>Are</b> you going to paint?","Yes, I am. / No, I’m not."],
 ["Modals","can / could / should / would","<b>Can</b> you swim? <b>Could</b> you help me?","Yes, I can. / No, I can’t."]
];
const questionWords = [
 ["What","Qu’est-ce que / quoi","What do you paint?"],["Where","Où","Where did you go?"],["When","Quand","When did you arrive?"],
 ["Who","Qui","Who did you meet?"],["Why","Pourquoi","Why are you learning English?"],["How","Comment","How was your trip?"],
 ["Which","Lequel / quel (choix)","Which colour do you prefer?"],["Whose","À qui","Whose bag is this?"],
 ["How long","Combien de temps / depuis quand","How long have you lived here?"],["How often","À quelle fréquence","How often do you swim?"],
 ["How many","Combien (dénombrable)","How many children do you have?"],["How much","Combien (indénombrable / prix)","How much does it cost?"],
 ["What time","À quelle heure","What time does the train leave?"],["What kind of","Quel genre de","What kind of music do you like?"]
];
const questionRules = [
 ["The golden order: Q · A · S · V","Question word + <b>Auxiliary</b> + <b>Subject</b> + <b>Verb</b> (+ the rest). Where | <b>did</b> | <b>you</b> | <b>go</b> | last summer?"],
 ["Only ONE auxiliary carries the tense","<s>Does she paints?</s> ✗ → Does she <b>paint</b>? ✓ · <s>Did you went?</s> ✗ → Did you <b>go</b>? ✓ · <s>Have you saw?</s> ✗ → Have you <b>seen</b>? ✓"],
 ["Be and modals do the job alone","<b>Are</b> you ready? · <b>Can</b> you help? — <s>Do you are…?</s> <s>Do you can…?</s> ✗"],
 ["Subject questions: no do / did","<b>Who called</b> you? (someone called you) vs <b>Who did you call</b>? (you called someone). <b>What happened</b>? ✓ — <s>What did happen?</s> ✗"],
 ["Prepositions go at the end","<b>Who</b> did you go <b>with</b>? · What are you talking <b>about</b>? · Where are you <b>from</b>?"],
 ["Polite / indirect questions keep statement order","Where <b>is the station</b>? → Could you tell me where <b>the station is</b>? · Do you know what time <b>it starts</b>?"]
];
const questionDrills = [
 ["A · Choose the auxiliary",[
  "c|___ you like painting? (in general)|Do|Does|Are|0|Present simple, you → do.",
  "c|___ your daughter go swimming every week?|Do|Does|Is|1|Present simple, she → does.",
  "c|___ you go to the beach yesterday?|Do|Were|Did|2|Past simple + main verb → did.",
  "c|___ she ever been to Scotland?|Has|Have|Did|0|Present perfect, she → has.",
  "c|___ they watching TV when you arrived?|Did|Were|Was|1|Past continuous, they → were.",
  "c|___ it raining when you left?|Did|Is|Was|2|Past continuous, it → was.",
  "c|___ you come to my exhibition next week?|Will|Do|Are|0|Future decision / request → will.",
  "c|___ you tired now?|Do|Are|Have|1|Tired = adjective → be.",
  "c|How long ___ you lived here?|did|do|have|2|How long + still true → present perfect.",
  "c|What ___ you doing right now?|do|are|did|1|Now → present continuous.",
  "c|What time ___ the museum open? (every day)|does|is|do|0|Timetable, it → does.",
  "c|___ the weather nice in Brittany last week?|Did|Was|Were|1|Be in the past, it → was."]],
 ["B · Choose the question word",[
  "c|___ do you go swimming? — Twice a week.|How long|How often|How many|1|Frequency → how often.",
  "c|___ have you lived in Lille? — For twelve years.|How long|When|How often|0|Duration → how long.",
  "c|___ did you go with? — With my daughter.|Who|Which|Whose|0|A person → who (+ with at the end).",
  "c|___ paintings have you sold? — About ten.|How much|How many|How long|1|Paintings = countable → how many.",
  "c|___ does the course cost? — €120.|How much|How many|What|0|Price → how much.",
  "c|___ are you learning English? — Because I love travelling.|What|Why|How|1|A reason → why.",
  "c|___ colour do you prefer, blue or green?|Which|Who|Where|0|A choice between options → which.",
  "c|___ was your trip? — Wonderful, thanks!|What|How|Which|1|Opinion / impression → how."]],
 ["C · Write the question (add the auxiliary)",[
  "f|Words: when · you · usually · paint → Answer: “On Sunday mornings.”|When + do + you + usually + paint.|When do you usually paint|When do you paint",
  "f|Words: where · you · go · last summer → Answer: “To Brittany.”|Past → did.|Where did you go last summer",
  "f|Words: what · you · do · at 8 p.m. yesterday → Answer: “I was cooking.”|Past continuous → were + doing.|What were you doing at 8 pm yesterday|What were you doing at 8 p.m. yesterday|What were you doing at 8 p.m yesterday|What were you doing at 8pm yesterday",
  "f|Words: you · ever · try · surfing → Answer: “No, I haven’t.”|Have + you + ever + participle.|Have you ever tried surfing",
  "f|Words: how long · she · live · in Lille → Answer: “Since 2010.”|How long + has + she + participle.|How long has she lived in Lille",
  "f|Words: what · you · do · this weekend → Answer: “I’m meeting a friend.”|Arrangement → are you doing.|What are you doing this weekend",
  "f|Words: your son · like · cooking → Answer: “Yes, he does.”|He → does + base verb.|Does your son like cooking",
  "f|Words: it · rain · tomorrow → Answer: “Probably not.”|Prediction → will.|Will it rain tomorrow"]],
 ["D · Subject or object question?",[
  "c|Someone called you. You ask:|Who did call you?|Who called you?|Who you called?|1|Who is the subject → no did.",
  "c|You called someone. Your friend asks:|Who did you call?|Who called you?|Who you did call?|0|You is the subject → did you.",
  "c|Something happened. You ask:|What did happen?|What happened?|What it happened?|1|What is the subject → no did.",
  "c|Your friend saw something. You ask:|What saw you?|What did you see?|What you saw?|1|You is the subject → did you see.",
  "c|You want to know which person won the prize.|Who did win the prize?|Who won the prize?|Who won did the prize?|1|Who is the subject → no did.",
  "c|You want to know which painting she bought.|Which painting bought she?|Which painting did she buy?|Which painting she bought?|1|She is the subject → did she buy."]],
 ["E · Short answers",[
  "c|Do you like swimming? — Yes, I ___.|like|do|am|1|Use the auxiliary from the question.",
  "c|Has she finished? — No, she ___.|didn’t|hasn’t|doesn’t|1|Has → hasn’t.",
  "c|Were you at home? — Yes, I ___.|was|were|did|0|I → was.",
  "c|Did they enjoy the trip? — Yes, they ___.|enjoyed|did|were|1|Did → did.",
  "c|Is it raining? — No, it ___.|doesn’t|isn’t|wasn’t|1|Is → isn’t.",
  "c|Will you be there? — Yes, I ___.|will|am|do|0|Will → will."]],
 ["F · Build the question",[
  "t|Where / did / you / stay / in / Scotland?|Question word + did + subject + base verb.",
  "t|Who / did / you / go / with?|The preposition goes at the end.",
  "t|What / kind / of / music / do / you / like?|What kind of + noun + do + you + verb.",
  "t|How / many / paintings / have / you / finished?|How many + noun + have + you + participle.",
  "t|Could / you / tell / me / where / the / station / is?|Polite question: statement order at the end."]],
 ["G · Find the correct question",[
  "c|Which question is correct?|Where you went last summer?|Where did you go last summer?|Where did you went last summer?|1|did + base verb.",
  "c|Which question is correct?|Does she likes painting?|Do she like painting?|Does she like painting?|2|does + base verb.",
  "c|Which question is correct?|Do you can swim?|Can you swim?|Are you can swim?|1|Modals make their own questions.",
  "c|Which question is correct?|How long do you live here?|How long have you lived here?|How long are you living here since?|1|How long + until now → present perfect.",
  "c|Which question is correct?|Are you agree?|Do you agree?|Have you agree?|1|Agree is a verb → do you agree?",
  "c|Which question is correct?|Could you tell me where is the station?|Could you tell me where the station is?|Could you tell me where does the station?|1|Indirect question → statement order."]]
];
const questionTask = {title:"Interview a new friend",task:"You are going to meet an English-speaking painter at an exhibition. Prepare eight questions to get to know them: use a different tense or auxiliary in each one (do / does, did, was / were, have / has, will, going to, can). Then say them aloud.",
 words:["Do you…?","Where did you…?","What were you doing when…?","Have you ever…?","How long have you…?","Are you going to…?","Will you…?","Who did you… with?"],
 steps:["Present simple: their habits and likes.","Past simple: a past trip or how they started.","Present perfect: experience and how long.","Future: their plans.","Add one follow-up question: Why? / What was it like?"],
 checks:["I used eight different auxiliaries or tenses.","Every question has the auxiliary BEFORE the subject.","The verb after do / does / did is the base verb.","I added at least one follow-up question (Why…? / What was it like?)."],
 a:"Where do you live?\nWhat do you like painting?\nWhen did you start painting?\nWhere did you study art?\nHave you ever painted in Scotland?\nHow long have you lived here?\nAre you going to show more paintings next year?\nCan you give me some advice?",
 b:"Where are you from, and what brought you to this exhibition?\nWhat kind of subjects do you usually paint, and why?\nHow did you start painting — did someone teach you?\nWhat were you doing before you became a painter?\nHave you ever exhibited abroad? What was it like?\nHow long have you been working on this series?\nWhat are you going to work on next?\nWould you mind if I took a photo of this painting?"};

// ===================== QUESTION QUEST GAME =====================
const auxButtons = ["Do","Does","Did","Am","Is","Are","Was","Were","Have","Has","Will","Can"];
const rushItems = [
 ["___ you like painting?","in general","Do","Present simple, you → do."],
 ["___ your daughter go swimming every week?","habit","Does","Present simple, she → does."],
 ["___ you go to the beach yesterday?","yesterday","Did","Past simple → did."],
 ["___ she ever been to Scotland?","experience","Has","Present perfect, she → has."],
 ["___ you ever tried sushi?","experience","Have","Present perfect, you → have."],
 ["___ they watching TV when you arrived?","in progress, past","Were","Past continuous, they → were."],
 ["___ it raining when you left?","in progress, past","Was","Past continuous, it → was."],
 ["___ you come to my exhibition next week?","future request","Will/Can","Will + base verb (Can also works for a request)."],
 ["___ you tired?","now","Are","Be + adjective, you → are."],
 ["___ your son live in Lille?","now, in general","Does","Present simple, he → does."],
 ["Where ___ you go last summer?","last summer","Did","Past simple → did."],
 ["What ___ you doing right now?","now","Are","Present continuous → are."],
 ["How long ___ you lived here?","until now","Have","Present perfect → have."],
 ["What time ___ the train leave?","timetable","Does","Present simple, it → does."],
 ["___ he at home yesterday?","yesterday","Was","Be in the past, he → was."],
 ["Why ___ she crying?","now","Is","Present continuous, she → is."],
 ["___ you swim?","ability","Can","Ability → can."],
 ["What ___ you doing at 8 p.m. yesterday?","in progress, past","Were","Past continuous, you → were."],
 ["How often ___ you paint?","habit","Do","Present simple, you → do."],
 ["Who ___ you see at the party?","last night","Did","Past simple, object question → did."],
 ["___ your parents ever visited Italy?","experience","Have","Present perfect, they → have."],
 ["Where ___ your brother work?","now, in general","Does","Present simple, he → does."],
 ["___ the weather nice in Brittany?","last week","Was","Be in the past → was."],
 ["What ___ you going to cook tonight?","plan","Are","Going to, you → are."],
 ["___ it rain tomorrow?","prediction","Will","Prediction → will."],
 ["How many paintings ___ you sold this year?","so far this year","Have","Present perfect → have."],
 ["When ___ they arrive?","answer: yesterday","Did","Past simple → did."],
 ["___ I late?","now","Am","Be, I → am."],
 ["___ your friends at the concert?","last Saturday","Were","Be in the past, they → were."],
 ["___ she finished her painting yet?","yet","Has","Present perfect + yet, she → has."],
 ["___ you help me, please?","polite request","Can/Will","Request → can / could (will also works)."],
 ["Where ___ you staying this week?","temporary, now","Are","Present continuous → are."],
 ["___ your daughter like cold water?","in general","Does","Present simple, she → does."],
 ["What ___ you do last weekend?","last weekend","Did","Past simple → did."],
 ["___ you been to the new museum?","experience","Have","Present perfect → have."],
 ["___ it snowing when you woke up?","in progress, past","Was","Past continuous, it → was."]
];
const matchItems = [
 ["Twice a week.",["How often do you go swimming?","How long do you go swimming?","How many do you go swimming?"]],
 ["For twelve years — and I still live there.",["How long have you lived there?","When did you live there?","How long do you live there?"]],
 ["Yes, twice! I loved Edinburgh.",["Have you ever been to Scotland?","Did you ever went to Scotland?","Are you been to Scotland?"]],
 ["To Brittany, with my family.",["Where did you go last summer?","Where have you gone last summer?","Where you went last summer?"]],
 ["I was painting in the garden.",["What were you doing when I called?","What did you do when I called?","What you were doing when I called?"]],
 ["No, she hasn’t. She’s still working on it.",["Has she finished her painting yet?","Did she finish her painting yesterday?","Does she finish her painting?"]],
 ["I’m meeting a friend for lunch.",["What are you doing on Saturday?","What do you do on Saturday?","What did you do on Saturday?"]],
 ["My daughter. She has a lot of talent!",["Who painted this picture?","Who did paint this picture?","Who did you paint this picture?"]],
 ["My neighbour. We go every Sunday.",["Who do you go swimming with?","Who goes swimming with?","With who you go swimming?"]],
 ["Landscapes, mostly. And the sea.",["What do you like painting?","What are you liking to paint?","What does you like painting?"]],
 ["About €40, I think.",["How much did it cost?","How many did it cost?","How much it cost?"]],
 ["Yes, I will. I promise!",["Will you call me tomorrow?","Are you call me tomorrow?","Do you will call me tomorrow?"]],
 ["Because I love travelling.",["Why are you learning English?","Why you are learning English?","Why do you learning English?"]],
 ["It was amazing, but it rained a lot.",["How was your trip?","How did your trip?","How is your trip yesterday?"]],
 ["No, it wasn’t. It was sunny.",["Was it raining when you arrived?","Did it raining when you arrived?","Was it rain when you arrived?"]],
 ["Yes, I am. I’ve already booked it.",["Are you going to visit Rome?","Do you going to visit Rome?","Will you going to visit Rome?"]],
 ["At 7:45, from platform 3.",["What time does the train leave?","What time the train leaves?","What time does the train leaves?"]],
 ["Since I was a child.",["How long have you painted?","When do you paint?","How long do you paint?"]]
];
const fixItems = [
 ["Where did you go last summer?",""],
 ["Where you went last summer?","Where did you go last summer?"],
 ["Does she likes painting?","Does she like painting?"],
 ["Have you ever been to Scotland?",""],
 ["Did you ever been to Scotland?","Have you ever been to Scotland?"],
 ["What are you doing?",""],
 ["What you are doing?","What are you doing?"],
 ["Who called you yesterday?",""],
 ["Who did call you yesterday?","Who called you yesterday?"],
 ["Do you can swim?","Can you swim?"],
 ["How long have you lived in Lille?",""],
 ["How long do you live in Lille?","How long have you lived in Lille?"],
 ["Were you sleeping when I called?",""],
 ["Did you sleeping when I called?","Were you sleeping when I called?"],
 ["Is she going to visit her son?",""],
 ["Will you to come tomorrow?","Will you come tomorrow?"],
 ["Who did you go with?",""],
 ["With who you went?","Who did you go with?"],
 ["Are you agree?","Do you agree?"],
 ["How much paintings have you sold?","How many paintings have you sold?"],
 ["What time does the train leave?",""],
 ["When have you arrived?","When did you arrive?"],
 ["Was the weather nice?",""],
 ["Did the weather was nice?","Was the weather nice?"],
 ["Has your son finished his studies?",""],
 ["Have your son finished his studies?","Has your son finished his studies?"]
];
const diceTopics = [
 ["🎨","painting"],["🏖️","holidays"],["👨‍👩‍👧","family"],["🍽️","food and restaurants"],["🏊","sport"],["🏠","home"],["🚐","travel by campervan"],["🎬","films and music"]
];
const diceTenses = ["Present simple","Past simple","Present perfect","Past continuous","Future (going to)","Present continuous"];
const diceModels = {
 "painting":["What do you like painting?","When did you start painting?","Have you ever sold a painting?","What were you painting when I called?","What are you going to paint next?","What are you painting at the moment?"],
 "holidays":["Where do you usually go on holiday?","Where did you go last summer?","Have you ever been abroad on holiday?","What were you doing when the storm started?","Where are you going to go next summer?","Are you planning a trip at the moment?"],
 "family":["Does your daughter live with you?","What did you do together last weekend?","How long have you lived in your house?","What were the children doing when you got home?","Are you going to see your family this weekend?","What is your daughter studying at the moment?"],
 "food and restaurants":["What kind of food do you like?","Where did you eat last weekend?","Have you ever tried Japanese food?","What were you cooking when the phone rang?","Are you going to eat out this weekend?","What are you cooking tonight?"],
 "sport":["How often do you go swimming?","Did you play any sport when you were young?","Have you ever run a race?","Were you swimming when it started to rain?","Are you going to try a new sport this year?","Are you training for anything at the moment?"],
 "home":["Do you live in a house or a flat?","When did you move to your home?","How long have you lived there?","What were you doing at home last night at 8?","Are you going to change anything in your home?","Are you redecorating at the moment?"],
 "travel by campervan":["Do you like travelling by campervan?","Where did you sleep on your campervan trip?","Have you ever had a problem on the road?","Where were you driving when you saw the sea?","Are you going to travel by campervan again?","Are you looking for a campsite for next summer?"],
 "films and music":["What kind of music do you listen to?","What film did you see last?","Have you ever been to a big concert?","What were you watching when I arrived?","Are you going to see a film this weekend?","What are you reading or watching these days?"]
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
const html = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const normalize = value => value.trim().toLowerCase().replace(/[’‘]/g, "'").replace(/[.!?]+$/, '').replace(/\s+/g, ' ');
const KEY = 'speakeasy-frankie-cloe-masterclass-v1';
let saved = {};
try { saved = JSON.parse(localStorage.getItem(KEY)) || {}; } catch {}
const state = {scores:{}, drafts:{}, ...saved};
const bank = new Map();

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
}
function listen(text, label = 'Listen') {
  return `<button class="listen" type="button" data-say="${html(text)}">▶ ${label}</button>`;
}
function choice(line) {
  const [prompt, one, two, three, correct, hint] = line.split('|');
  const options = [one, two, three];
  return {type:'choice', prompt, options, correct:Number(correct), answer:options[Number(correct)], hint};
}
function fill(line, hint) {
  const [prompt, ...accepted] = line.split('|');
  return {type:'fill', prompt, accepted, answer:accepted.join(' / '), hint};
}
function tiles(line, hint) {
  const tokens = line.split(' / ');
  return {type:'tiles', prompt:'Build the full sentence or question. Click a chosen tile to move it back.', tokens, answer:tokens.join(' '), hint};
}
function shuffled(tokens) {
  const values = tokens.map((word, id) => ({word, id}));
  for (let i = values.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [values[i], values[j]] = [values[j], values[i]];
  }
  if (values.every((item, index) => item.word === tokens[index])) {
    const other = values.findIndex(item => item.word !== values[0].word);
    if (other > 0) [values[0], values[other]] = [values[other], values[0]];
  }
  return values;
}
function quizMarkup(key, question, mock = false) {
  bank.set(key, question);
  let controls = '';
  if (question.type === 'choice') {
    if (!question.order) question.order = shuffled(question.options).map(item => item.id);
    controls = `<div class="options" role="group" aria-label="Select one answer">${question.order.map(i => `<button type="button" data-choice="${i}" aria-pressed="false">${html(question.options[i])}</button>`).join('')}</div>`;
  } else if (question.type === 'fill') {
    controls = `<form><input aria-label="Your answer" type="text" autocomplete="off" autocapitalize="off" spellcheck="false"><button type="submit">Check</button></form>`;
  } else {
    controls = '<div class="tiles" data-built role="group" aria-label="Your sentence"></div><div class="tiles" data-tiles role="group" aria-label="Available words"></div>';
  }
  return `<article class="exercise" data-key="${key}" ${mock ? 'data-mock' : ''}><p><b>${rich(question.prompt)}</b></p>${controls}
    ${mock ? '' : '<div class="actions"><button type="button" data-hint>Hint</button><button type="button" data-answer>Show answer</button></div>'}
    <p class="status ${state.scores[key] ? 'good' : ''}" role="status">${!mock && state.scores[key] ? '✓ Previously answered correctly.' : ''}</p><p class="assist" hidden></p></article>`;
}
function setFeedback(card, correct, message) {
  const result = $('.status', card);
  result.textContent = message;
  result.className = 'status ' + (correct ? 'good' : 'bad');
  state.scores[card.dataset.key] = correct;
  save();
  progress();
}
// Accept contracted and full forms: don't = do not, she's = she is / she has, etc.
function variants(value) {
  let text = normalize(value).replace(/[,;:"“”]/g, ' ');
  text = text.replace(/\bcan't\b/g, 'cannot').replace(/\bcan not\b/g, 'cannot').replace(/\bwon't\b/g, 'will not')
    .replace(/n't\b/g, ' not').replace(/'m\b/g, ' am').replace(/'re\b/g, ' are').replace(/'ve\b/g, ' have').replace(/'ll\b/g, ' will').replace(/'d\b/g, ' would')
    .replace(/\s+/g, ' ').trim();
  return [text, text.replace(/'s\b/g, ' is'), text.replace(/'s\b/g, ' has')];
}
function accepts(question, value) {
  if (!value.trim()) return false;
  const typed = variants(value);
  return question.accepted.some(answer => variants(answer).some(form => typed.includes(form)));
}
function gradeFill(card) {
  const question = bank.get(card.dataset.key);
  const correct = accepts(question, $('input', card).value);
  setFeedback(card, correct, correct ? '✓ Correct. Say the full sentence aloud.' : '✗ Not yet. Check the form and try again — use Hint if you need help.');
}
function drawTiles(card, focusId) {
  const built = card.built;
  const tileButton = ({word, id}) => `<button type="button" data-tile="${id}">${html(word)}</button>`;
  $('[data-built]', card).innerHTML = built.map(tileButton).join('');
  $('[data-tiles]', card).innerHTML = card.scrambled.filter(item => !built.includes(item)).map(tileButton).join('');
  if (focusId !== undefined) $(`[data-tile="${focusId}"]`, card).focus();
}
function setupTiles(root) {
  $$('[data-tiles]', root).forEach(container => {
    const card = container.closest('.exercise');
    card.scrambled = shuffled(bank.get(card.dataset.key).tokens);
    card.built = [];
    drawTiles(card);
  });
}
function renderGrammar() {
  $('#grammar-items').innerHTML = grammar.map(([title, rule, forms, exception, mc, missing, order], index) => {
    const id = 'gw' + index;
    return `<details class="topic" data-topic="${id}"><summary>${html(title)}</summary>
    <p><b>Use and structure.</b> ${html(rule)}</p><p class="forms">${html(forms)} ${listen(forms, 'Listen to examples')}</p>
    <p><b>Watch for this.</b> ${html(exception)}</p><div class="quiz-grid">${[choice(mc),fill(missing, rule),tiles(order, rule)].map((question, i) => quizMarkup(id + '-' + i, question)).join('')}</div>
    <button type="button" data-reset="${id}">Reset this topic</button></details>`;
  }).join('');
  setupTiles($('#grammar-items'));
}
function renderVocabulary() {
  $('#words').innerHTML = vocabulary.map(([title, words]) => `<details class="topic"><summary>${html(title)}</summary>${words.map(([word, french, meaning, example]) =>
    `<div class="term"><b>${html(word)}</b> <span class="fr" lang="fr">· ${html(french)}</span> ${listen(word + '. ' + example)}<br>${html(meaning)} <em>${html(example)}</em></div>`).join('')}</details>`).join('');
  $('#vocab-quiz').innerHTML = vocabularyQuestions.map((line, i) => quizMarkup('vocab-' + i, choice(line))).join('');
}
function passageMarkup(passage, mock) {
  if (!passage.audio) return `<p class="passage">${html(passage.text)}</p>`;
  return listen(passage.text, 'Play recording') + (mock ? '' : `<details class="reference"><summary>Transcript</summary><p>${html(passage.text)}</p></details>`);
}
function renderComprehension() {
  $('#comprehension-items').innerHTML = passages.map((passage, i) => `<details class="topic"><summary>${html(passage.title)}</summary>${passageMarkup(passage, false)}
    <div class="quiz-grid">${passage.q.map((line, j) => quizMarkup('comp-' + i + '-' + j, choice(line))).join('')}</div></details>`).join('');
}
function models(task, audio = false) {
  return `<details class="reference"><summary>Compare the A2+ and B1 models</summary><div class="model-grid">${[['A2+ · clear and direct',task.a],['B1 · developed and connected',task.b]].map(([level, text]) =>
    `<article class="model"><b>${level}</b><pre>${html(text)}</pre>${audio ? listen(text, 'Listen to model') : ''}</article>`).join('')}</div></details>`;
}
function draft(key, label) {
  return `<label for="draft-${key}">${label}</label><textarea rows="6" id="draft-${key}" data-draft="${key}">${html(state.drafts[key] || '')}</textarea>`;
}
function coachingSteps(task) {
  return `<h3>Build it step by step</h3><ol>${task.steps.map(item => `<li>${html(item)}</li>`).join('')}</ol>`;
}
function setOptions(select, tasks) {
  select.innerHTML = tasks.map((task, i) => `<option value="${i}">${html(task.title)}</option>`).join('');
}
function oralLadder(index, task) {
  return `<details class="reference"><summary>Rehearse one answer at a time</summary>
    <ol class="ladder">${task.steps.map((step, i) => `<li><p>${html(step)}</p><label for="oral-step-${index}-${i}">Your key words</label>
    <input id="oral-step-${index}-${i}" type="text" data-draft="oralstep-${index}-${i}" value="${html(state.drafts[`oralstep-${index}-${i}`] || '')}"></li>`).join('')}</ol>
    <p>Say each piece once. Then put them together and answer a follow-up without reading your notes.</p></details>`;
}
function renderOral() {
  const index = Number($('#oral-select').value);
  const task = oral[index];
  $('#oral-task').innerHTML = `<div class="task-grid"><div class="prompt"><h3>Situation</h3><p>${html(task.task)}</p>${listen(task.task,'Listen to the task')}${coachingSteps(task)}</div>
    <div class="prompt"><h3>Respond to a follow-up</h3><ol>${task.follow.map(line => `<li>${html(line)} ${listen(line)}</li>`).join('')}</ol><p><b>Switch roles and ask</b> · ${html(task.back)}</p>
    <p><b>If you need a moment</b> · “Let me think for a second.” <b>If you need help</b> · “Could you say that again, please?”</p></div></div>
    ${oralLadder(index, task)}${models(task, true)}${draft('oral-' + index, 'My key words and one sentence to improve')}`;
}
function renderWriting() {
  const index = Number($('#write-select').value);
  const task = writing[index];
  $('#write-task').innerHTML = `<div class="task-grid"><div class="prompt"><h3>Your task</h3><p>${html(task.task)}</p>${coachingSteps(task)}<p><b>${html(task.tip)}</b></p></div>
    <div class="checklist"><h3>Check your message</h3>${task.checks.map(line => `<label><input type="checkbox"> ${html(line)}</label>`).join('')}<p>Read your last sentence aloud. Can the reader tell exactly what to do next?</p></div></div>
    ${draft('write-' + index,'My draft')}<p class="status" data-word-count></p>${models(task)}`;
  wordCount($('[data-draft]', $('#write-task')));
}
function wordCount(input) {
  const output = $('[data-word-count]', input.parentElement);
  if (output) output.textContent = (input.value.trim().match(/\S+/g)?.length || 0) + ' words';
}
function progress() {
  const questions = [...bank.keys()].filter(key => !key.startsWith('mock-'));
  const done = questions.filter(key => state.scores[key]).length;
  $('#score').textContent = `${done} of ${questions.length} guided questions answered correctly.`;
  const bar = $('#completion-bar');
  if (bar) bar.style.width = `${questions.length ? Math.round(done / questions.length * 100) : 0}%`;
  updateCounts();
}

// ===================== VERB LAB + QUESTION LAB RENDERING =====================
// Trusted lesson text may contain <b>, <i>, <s> and <em>; everything typed by the learner is escaped.
const rich = value => html(value).replace(/&lt;(\/?)(b|i|s|em)&gt;/g, '<$1$2>');
const plain = value => String(value).replace(/<[^>]+>/g, '');

function parseDrill(line) {
  const [type, ...rest] = line.split('|');
  if (type === 'c') return choice(rest.join('|'));
  if (type === 't') return tiles(rest[0], rest[1]);
  const [prompt, hint, ...accepted] = rest;
  return {type:'fill', prompt, accepted, answer:accepted.join(' / '), hint};
}
function drillGroups(prefix, groups) {
  return groups.map(([label, lines], g) => `<div class="drill-group"><h5><span class="drill-step">${html(label.split(' · ')[0])}</span> ${html(label.split(' · ').slice(1).join(' · '))}<small>${lines.length} questions</small></h5>
    <div class="quiz-grid">${lines.map((line, n) => quizMarkup(`${prefix}-${g}-${n}`, parseDrill(line))).join('')}</div></div>`).join('');
}
function produceMarkup(key, task) {
  const scene = task.scene ? `<div class="scene">${task.scene.map(([icon, text]) => `<span><b aria-hidden="true">${icon}</b>${html(text)}</span>`).join('')}</div>` : '';
  return `<div class="produce"><div class="produce-head"><span class="produce-badge">YOUR TURN · SPEAK IT, THEN WRITE IT</span><h4>${html(task.title)}</h4></div>
    <div class="task-grid"><div class="prompt"><h3>Your task</h3><p>${html(task.task)}</p>${scene}${listen(task.task, 'Listen to the task')}
      <h3>Build it step by step</h3><ol>${task.steps.map(step => `<li>${html(step)}</li>`).join('')}</ol>
      <p class="useful"><b>Useful words</b> ${task.words.map(word => `<span class="chip">${html(word)}</span>`).join('')}</p></div>
    <div class="checklist"><h3>Check your answer</h3>${task.checks.map(line => `<label><input type="checkbox"> ${html(line)}</label>`).join('')}
      <p>Say your answer aloud first. Then write it, check the list and compare with the two models below.</p></div></div>
    <div class="draft-box">${draft(key, 'My answer')}<p class="status" data-word-count></p></div>
    ${models(task, true)}</div>`;
}
function tensePanel(t, index) {
  const prefix = 'v' + t.id;
  const table = `<div class="table-wrap"><table class="form-table"><thead><tr>${t.table.head.map(cell => `<th>${rich(cell)}</th>`).join('')}</tr></thead>
    <tbody>${t.table.rows.map(row => `<tr>${row.map((cell, i) => i ? `<td>${rich(cell)}</td>` : `<th scope="row">${rich(cell)}</th>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  const examples = `<div class="table-wrap"><table class="example-table"><thead><tr><th>✚ Positive</th><th>− Negative</th><th>? Question</th><th><span class="sr">Listen</span></th></tr></thead>
    <tbody>${t.examples.map(row => `<tr>${row.map(cell => `<td>${rich(cell)}</td>`).join('')}<td>${listen(row.map(plain).join(' '), 'Listen')}</td></tr>`).join('')}</tbody></table></div>`;
  const total = t.drills.reduce((sum, [, lines]) => sum + lines.length, 0);
  return `<div class="tense-panel" id="panel-${t.id}" role="tabpanel" aria-labelledby="tab-${t.id}" ${index ? 'hidden' : ''}>
    <div class="tense-head"><span class="tense-icon" aria-hidden="true">${t.icon}</span><div><p class="section-kicker">${html(t.kicker)}</p>
      <h3>${html(t.name)} <span class="fr" lang="fr">· ${html(t.fr)}</span></h3><p>${html(t.intro)}</p></div></div>
    <div class="lesson-step"><span class="step-no">1</span><h4>When do I use it?</h4></div>
    <div class="rule-cards"><div class="rule-card"><ul class="use-list">${t.when.map(([use, fr, example]) => `<li><b>${rich(use)}</b> <span class="fr" lang="fr">· ${html(fr)}</span><em>${rich(example)}</em></li>`).join('')}</ul></div>
      <div class="rule-card rule-signal"><h5>🔎 Signal words · <span class="fr" lang="fr">mots-clés</span></h5><div class="chips">${t.signal.map(word => `<span class="chip">${html(word)}</span>`).join('')}</div><p>${rich(t.signalNote)}</p></div></div>
    <div class="lesson-step"><span class="step-no">2</span><h4>How do I build it? · + / − / ? / short answers</h4></div>${table}
    <div class="rule-cards"><div class="rule-card"><h5>✍️ Spelling, sound and patterns</h5><ul>${t.spelling.map(item => `<li>${rich(item)}</li>`).join('')}</ul></div>
      <div class="rule-card rule-warn"><h5>⚠️ Watch out · exceptions and French traps</h5><ul>${t.traps.map(item => `<li>${rich(item)}</li>`).join('')}</ul></div></div>
    <div class="lesson-step"><span class="step-no">3</span><h4>Examples in every form · listen and repeat</h4></div>${examples}
    <div class="lesson-step"><span class="step-no">4</span><h4>Practise step by step · ${total} questions</h4></div>
    <p class="step-tip">Work from A to the end. After each correct answer, say the full sentence aloud.</p>
    ${drillGroups(prefix, t.drills)}
    <div class="lesson-step"><span class="step-no">5</span><h4>Use it · describe something in this tense</h4></div>
    ${produceMarkup('verb-' + t.id, t.task)}
    <button type="button" data-reset="${prefix}">↺ Reset the ${html(t.tab.toLowerCase())} questions</button></div>`;
}
function irregularPanel() {
  return `<div class="tense-panel" id="panel-irr" role="tabpanel" aria-labelledby="tab-irr" hidden>
    <div class="tense-head"><span class="tense-icon" aria-hidden="true">📚</span><div><p class="section-kicker">PAST SIMPLE · PAST PARTICIPLE · LEARN BY PATTERN</p>
      <h3>Irregular verbs <span class="fr" lang="fr">· les verbes irréguliers</span></h3>
      <p>You need column 2 for the past simple (I <b>went</b>) and column 3 for the present perfect (I have <b>gone</b>). Learn them in groups: verbs with the same pattern are easier to remember.</p></div></div>
    <div class="trainer" id="irr-trainer"></div>
    <label class="search-label" for="irr-search">🔍 Find a verb (English or French)</label><input id="irr-search" type="search" placeholder="e.g. went, nager, buy…" autocomplete="off">
    ${irregularGroups.map(([title, note, verbs]) => `<div class="irr-group"><h5>${html(title)} <small>${html(note)}</small></h5><div class="table-wrap"><table class="form-table irr-table">
      <thead><tr><th>Base verb</th><th>Past simple</th><th>Past participle</th><th class="fr-col">Français</th><th><span class="sr">Listen</span></th></tr></thead>
      <tbody>${verbs.map(([base, past, participle, fr]) => `<tr data-verb="${html([base, past, participle, fr].join(' ').toLowerCase())}"><th scope="row">${html(base)}</th><td>${html(past)}</td><td>${html(participle)}</td><td class="fr-col"><span class="fr" lang="fr">${html(fr)}</span></td>
      <td>${listen([base, past, participle].map(form => form.replace(/\(.*?\)/g, '')).join(', '), 'Listen')}</td></tr>`).join('')}</tbody></table></div></div>`).join('')}
    <p class="irr-empty" hidden>No verb found. Try another spelling.</p></div>`;
}
function renderVerbLab() {
  const tabs = tenses.flatMap((t, i) => {
    const tab = `<button type="button" role="tab" id="tab-${t.id}" data-tense="${t.id}" aria-controls="panel-${t.id}" aria-selected="${i === 0}"><span aria-hidden="true">${t.icon}</span> ${html(t.tab)} <span class="tab-count" data-count="v${t.id}"></span></button>`;
    return t.id === 'past' ? [tab, '<button type="button" role="tab" id="tab-irr" data-tense="irr" aria-controls="panel-irr" aria-selected="false"><span aria-hidden="true">📚</span> Irregular verbs</button>'] : [tab];
  });
  const map = `<details class="reference tense-map"><summary>The big picture · all the tenses on one page</summary><div class="table-wrap"><table class="form-table">
    <thead><tr><th>Tense</th><th>Form</th><th>Main use</th><th>Signal words</th></tr></thead><tbody>
    <tr><th scope="row">Present simple</th><td>I paint · she paint<b>s</b></td><td>habits, facts, likes</td><td>usually, every…, never</td></tr>
    <tr><th scope="row">Present continuous</th><td>am / is / are + -ing</td><td>now, temporary, photos, arrangements</td><td>now, at the moment, today</td></tr>
    <tr><th scope="row">Past simple</th><td>-ed / irregular · did</td><td>finished action, finished time</td><td>yesterday, last…, … ago, in 2019</td></tr>
    <tr><th scope="row">Past continuous</th><td>was / were + -ing</td><td>in progress in the past, background</td><td>while, when, at 8 p.m. yesterday</td></tr>
    <tr><th scope="row">Present perfect</th><td>have / has + participle</td><td>experience, news, until now</td><td>ever, never, just, already, yet, for, since</td></tr>
    <tr><th scope="row">Future</th><td>will · going to · am / is / are + -ing</td><td>decisions, plans, arrangements</td><td>tomorrow, next…, I think…</td></tr></tbody></table></div>
    <p>Not sure which tense to use? Ask: <b>Is it finished?</b> <b>Is there a time?</b> <b>Is it a habit or happening now?</b></p></details>`;
  $('#verb-lab').innerHTML = `${map}<div class="tense-tabs" role="tablist" aria-label="Choose a tense">${tabs.join('')}</div>
    ${tenses.map((t, i) => tensePanel(t, i)).join('')}${irregularPanel()}`;
  setupTiles($('#verb-lab'));
  $$('#verb-lab [data-draft]').forEach(wordCount);
  renderTrainer();
  if (state.tense) showTense(state.tense, false);
}
function showTense(id, scroll = true) {
  if (!$(`#panel-${id}`)) return;
  $$('[data-tense]').forEach(tab => tab.setAttribute('aria-selected', String(tab.dataset.tense === id)));
  $$('#verb-lab .tense-panel').forEach(panel => { panel.hidden = panel.id !== 'panel-' + id; });
  state.tense = id;
  save();
  if (scroll) $('.tense-tabs').scrollIntoView?.({block:'start', behavior:'smooth'});
}
function updateCounts() {
  $$('[data-count]').forEach(badge => {
    const keys = [...bank.keys()].filter(key => key.startsWith(badge.dataset.count + '-'));
    const done = keys.filter(key => state.scores[key]).length;
    badge.textContent = `${done}/${keys.length}`;
    badge.classList.toggle('complete', keys.length > 0 && done === keys.length);
  });
}

// ----- Irregular verb trainer -----
const allIrregulars = irregularGroups.flatMap(([, , verbs]) => verbs);
let trainer = null;
function newTrainerRound() {
  const pool = [...allIrregulars];
  for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
  trainer = {items:pool.slice(0, 10), index:0, score:0, checked:false, mistakes:[]};
}
const formsOf = value => value.replace(/\(.*?\)/g, ' ').split('/').map(form => normalize(form.replace(/:.*$/, ''))).filter(Boolean)
  .concat((value.match(/US: (\w+)/) || []).slice(1));
function renderTrainer() {
  const box = $('#irr-trainer');
  if (!trainer) {
    box.innerHTML = `<div class="trainer-intro"><div><h5>🏋️ Irregular verb trainer</h5><p>10 random verbs. Write the past simple and the past participle. Your best score is saved.</p></div>
      <div><span class="best">Best: ${state.trainerBest ?? '–'}/10</span><button class="primary" type="button" data-trainer="start">Start a round</button></div></div>`;
    return;
  }
  if (trainer.index >= trainer.items.length) {
    state.trainerBest = Math.max(state.trainerBest || 0, trainer.score);
    save();
    box.innerHTML = `<div class="trainer-end"><h5>Round complete · ${trainer.score}/10 ${trainer.score >= 8 ? '🎉' : trainer.score >= 5 ? '👍' : '💪'}</h5>
      ${trainer.mistakes.length ? `<p>Practise these again:</p><ul>${trainer.mistakes.map(([base, past, participle]) => `<li><b>${html(base)}</b> → ${html(past)} → ${html(participle)} ${listen(`${base}, ${past}, ${participle}`.replace(/\(.*?\)/g, ''), 'Listen')}</li>`).join('')}</ul>` : '<p>Perfect round — no mistakes!</p>'}
      <button class="primary" type="button" data-trainer="start">New round</button> <button type="button" data-trainer="close">Close</button></div>`;
    return;
  }
  const [base, , , fr] = trainer.items[trainer.index];
  box.innerHTML = `<div class="trainer-card"><div class="trainer-top"><span>Verb ${trainer.index + 1} of 10</span><span>Score ${trainer.score}</span></div>
    <p class="trainer-verb">${html(base)} <span class="fr" lang="fr">· ${html(fr)}</span></p>
    <form class="trainer-form" data-trainer-form><label>Past simple <input type="text" name="past" autocomplete="off" autocapitalize="off"></label>
    <label>Past participle <input type="text" name="participle" autocomplete="off" autocapitalize="off"></label><button type="submit" class="primary">Check</button></form>
    <p class="status" role="status"></p></div>`;
  $('input', box).focus();
}
function checkTrainer(form) {
  const box = $('#irr-trainer');
  const [base, past, participle] = trainer.items[trainer.index];
  if (trainer.checked) { trainer.index++; trainer.checked = false; renderTrainer(); return; }
  const okPast = formsOf(past).includes(normalize(form.past.value));
  const okPart = formsOf(participle).includes(normalize(form.participle.value));
  const correct = okPast && okPart;
  if (correct) trainer.score++; else trainer.mistakes.push(trainer.items[trainer.index]);
  trainer.checked = true;
  const status = $('.status', box);
  status.className = 'status ' + (correct ? 'good' : 'bad');
  status.innerHTML = (correct ? '✓ Correct! ' : '✗ Not quite. ') + `<b>${html(base)} → ${html(past)} → ${html(participle)}</b>. Press Enter or Next.`;
  $('button[type=submit]', form).textContent = 'Next →';
  $('button[type=submit]', form).focus();
  hear(`${base}, ${past}, ${participle}`.replace(/\(.*?\)/g, ''));
}

// ----- Question lab -----
function renderQuestionLab() {
  $('#question-lab').innerHTML = `
    <div class="lesson-step"><span class="step-no">1</span><h4>Which auxiliary do I use? · the auxiliary map</h4></div>
    <p class="step-tip">The auxiliary is the little “helper” verb that comes <b>before the subject</b> in a question. Find the tense → you find the auxiliary.</p>
    <div class="table-wrap"><table class="form-table aux-table"><thead><tr><th>Tense</th><th>Auxiliary</th><th>Questions</th><th>Short answers</th></tr></thead>
    <tbody>${auxMap.map(([tense, aux, example, short]) => `<tr><th scope="row">${html(tense)}</th><td><span class="aux-pill">${html(aux)}</span></td><td>${rich(example)}</td><td>${html(short)}</td></tr>`).join('')}</tbody></table></div>
    <div class="lesson-step"><span class="step-no">2</span><h4>Six rules for perfect questions</h4></div>
    <div class="rule-grid">${questionRules.map(([title, text], i) => `<div class="rule-card"><h5><span class="rule-no">${i + 1}</span> ${html(title)}</h5><p>${rich(text)}</p></div>`).join('')}</div>
    <div class="qasi" aria-label="Question order"><span><small>Question word</small>Where</span><span class="hl"><small>Auxiliary</small>did</span><span><small>Subject</small>you</span><span><small>Verb</small>go</span><span><small>The rest</small>last summer?</span>${listen('Where did you go last summer?', 'Listen')}</div>
    <details class="reference"><summary>Question words · <span class="fr" lang="fr">les mots interrogatifs</span></summary><div class="table-wrap"><table class="form-table">
      <thead><tr><th>English</th><th class="fr-col">Français</th><th>Example</th></tr></thead><tbody>${questionWords.map(([word, fr, example]) => `<tr><th scope="row">${html(word)}</th><td class="fr-col"><span class="fr" lang="fr">${html(fr)}</span></td><td>${html(example)} ${listen(example, 'Listen')}</td></tr>`).join('')}</tbody></table></div></details>
    <div class="lesson-step"><span class="step-no">3</span><h4>Practise step by step · ${questionDrills.reduce((sum, [, lines]) => sum + lines.length, 0)} questions <span class="tab-count" data-count="q"></span></h4></div>
    ${drillGroups('q', questionDrills)}
    <div class="lesson-step"><span class="step-no">4</span><h4>Use it · prepare your own questions</h4></div>
    ${produceMarkup('verb-questions', questionTask)}
    <button type="button" data-reset="q">↺ Reset the question practice</button>`;
  setupTiles($('#question-lab'));
  $$('#question-lab [data-draft]').forEach(wordCount);
}

// ----- Question Quest game -----
const gameModes = {
  rush:{icon:'⚡', name:'Auxiliary rush', text:'Choose the missing auxiliary as fast as you can.'},
  match:{icon:'🎯', name:'Answer → question', text:'Read the answer. Which question was asked?'},
  fix:{icon:'🕵️', name:'Right or wrong?', text:'Is the question correct? Spot the mistakes!'},
  dice:{icon:'🎲', name:'Question dice', text:'Roll a topic and a tense, then ask the question aloud.'}
};
let game = null;
let gameTimer;
const shuffle = list => { const copy = [...list]; for (let i = copy.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [copy[i], copy[j]] = [copy[j], copy[i]]; } return copy; };
function gameHome() {
  clearInterval(gameTimer);
  game = null;
  const best = state.gameBest || {};
  $('#game').innerHTML = `<div class="game-home"><div class="game-title"><span aria-hidden="true">🏆</span><div><h4>Question Quest</h4><p>Choose a game. Each correct answer = 10 points. Three in a row = streak bonus! 🔥</p></div></div>
    <div class="game-modes">${Object.entries(gameModes).map(([id, mode]) => `<button type="button" class="game-mode" data-game-start="${id}"><span class="gm-icon" aria-hidden="true">${mode.icon}</span><b>${mode.name}</b><small>${mode.text}</small>${id !== 'dice' ? `<span class="gm-best">Best: ${best[id] ?? '–'}</span>` : '<span class="gm-best">Speaking</span>'}</button>`).join('')}</div>
    <label class="game-timed"><input type="checkbox" id="game-timed" ${state.gameTimed === false ? '' : 'checked'}> ⏱ 90-second challenge (untick for a relaxed round of 15 questions)</label></div>`;
}
function startGame(mode) {
  clearInterval(gameTimer);
  const timed = $('#game-timed')?.checked ?? true;
  state.gameTimed = timed;
  save();
  const pool = mode === 'rush' ? shuffle(rushItems) : mode === 'match' ? shuffle(matchItems) : mode === 'fix' ? shuffle(fixItems) : [];
  game = {mode, pool, index:0, score:0, streak:0, bestStreak:0, right:0, total:0, mistakes:[], locked:false, timed, rolls:0};
  if (mode !== 'dice' && timed) {
    game.deadline = Date.now() + 90000;
    gameTimer = setInterval(gameTick, 250);
  }
  renderRound();
}
function gameTick() {
  if (!game?.deadline) return;
  const left = Math.max(0, game.deadline - Date.now());
  const bar = $('#game .timebar span');
  const text = $('#game .time-left');
  if (bar) bar.style.width = (left / 900) + '%';
  if (text) text.textContent = Math.ceil(left / 1000) + 's';
  if (left <= 0) endGame();
}
function gameHud() {
  return `<div class="game-hud"><span>${gameModes[game.mode].icon} <b>${gameModes[game.mode].name}</b></span><span>⭐ ${game.score}</span><span class="${game.streak >= 3 ? 'hot' : ''}">🔥 ${game.streak}</span>
    <span class="time-left">${game.timed ? '90s' : `${Math.min(game.index + 1, 15)} / 15`}</span><button type="button" data-game="quit" class="game-quit">✕ Quit</button></div>${game.timed ? '<div class="timebar"><span></span></div>' : ''}`;
}
function renderRound() {
  const box = $('#game');
  if (game.mode === 'dice') return renderDice();
  if (!game.timed && game.index >= 15) return endGame();
  if (game.index >= game.pool.length) game.pool = game.pool.concat(shuffle(game.pool));
  const item = game.pool[game.index];
  let body = '';
  if (game.mode === 'rush') {
    const [sentence, context] = item;
    body = `<p class="game-q">${html(sentence).replace('___', '<span class="gap">___</span>')}</p><p class="game-ctx">⏱ ${html(context)}</p>
      <div class="aux-grid">${auxButtons.map(aux => `<button type="button" data-game-answer="${aux}">${aux}</button>`).join('')}</div>`;
  } else if (game.mode === 'match') {
    const [answer, options] = item;
    game.order = shuffle(options.map((_, i) => i));
    body = `<p class="game-label">The answer was:</p><p class="game-q answer-bubble">“${html(answer)}”</p><p class="game-label">Which question was asked?</p>
      <div class="match-grid">${game.order.map(i => `<button type="button" data-game-answer="${i}">${html(options[i])}</button>`).join('')}</div>`;
  } else {
    const [question] = item;
    body = `<p class="game-label">Is this question correct?</p><p class="game-q">${html(question)}</p>
      <div class="fix-grid"><button type="button" class="yes" data-game-answer="right">✓ Right</button><button type="button" class="no" data-game-answer="wrong">✗ Wrong</button></div>`;
  }
  box.innerHTML = `${gameHud()}<div class="game-stage">${body}<p class="game-feedback" role="status"></p></div>`;
  game.locked = false;
  gameTick();
}
function answerRound(value) {
  if (!game || game.locked) return;
  const item = game.pool[game.index];
  let correct, solution, why;
  if (game.mode === 'rush') {
    const accepted = item[2].split('/');
    correct = accepted.includes(value);
    solution = item[0].replace('___', accepted[0]);
    why = item[3];
  } else if (game.mode === 'match') {
    correct = Number(value) === 0;
    solution = item[1][0];
    why = `Answer: “${item[0]}”`;
  } else {
    const isRight = item[1] === '';
    correct = (value === 'right') === isRight;
    solution = isRight ? item[0] : item[1];
    why = isRight ? 'This question is correct.' : `Wrong: “${item[0]}”`;
  }
  game.total++;
  if (correct) {
    game.right++;
    game.streak++;
    game.bestStreak = Math.max(game.bestStreak, game.streak);
    game.score += 10 + (game.streak >= 3 ? 5 : 0);
  } else {
    game.streak = 0;
    game.mistakes.push([solution, why]);
  }
  game.locked = true;
  const feedback = $('#game .game-feedback');
  feedback.className = 'game-feedback ' + (correct ? 'good' : 'bad');
  feedback.innerHTML = correct ? `✓ ${game.streak >= 3 ? '🔥 Streak bonus! ' : 'Yes! '}<b>${html(solution)}</b>` : `✗ The correct question is: <b>${html(solution)}</b><br><small>${html(why)}</small>`;
  $$('#game [data-game-answer]').forEach(button => { button.disabled = true; });
  const chosen = $(`#game [data-game-answer="${CSS.escape(value)}"]`);
  chosen?.classList.add(correct ? 'right' : 'wrong');
  setTimeout(() => {
    if (!game || game.mode === 'dice') return;
    game.index++;
    if (game.timed && Date.now() >= game.deadline) endGame(); else renderRound();
  }, correct ? 900 : 2300);
}
function endGame() {
  clearInterval(gameTimer);
  if (!game) return;
  const {mode, score, right, total, bestStreak, mistakes} = game;
  state.gameBest = state.gameBest || {};
  const record = score > (state.gameBest[mode] || 0);
  if (record) state.gameBest[mode] = score;
  save();
  game.locked = true;
  $('#game').innerHTML = `<div class="game-end"><p class="game-trophy" aria-hidden="true">${record ? '🏆' : right / Math.max(total, 1) >= .7 ? '🌟' : '💪'}</p>
    <h4>${record ? 'New best score!' : 'Round finished!'} ${score} points</h4>
    <p>${right} correct out of ${total} · best streak 🔥 ${bestStreak}</p>
    ${mistakes.length ? `<div class="game-review"><h5>Learn from your mistakes</h5><ol>${mistakes.map(([solution, why]) => `<li><b>${html(solution)}</b> ${listen(solution, 'Listen')}<br><small>${html(why)}</small></li>`).join('')}</ol></div>` : (total ? '<p>No mistakes. Brilliant! 🎉</p>' : '')}
    <div class="actions"><button class="primary" type="button" data-game-start="${mode}">Play again</button><button type="button" data-game="home">Choose another game</button></div></div>`;
  game = null;
}
function renderDice(reveal = false) {
  const box = $('#game');
  if (!game.current) {
    box.innerHTML = `${gameHud()}<div class="game-stage dice-stage"><p class="game-q">Roll the dice to get a topic and a tense.</p><button class="primary dice-roll" type="button" data-game="roll">🎲 Roll the dice</button>
      <p class="game-ctx">Say your question aloud, then check the model. Even better: ask a real person and listen to the answer!</p></div>`;
    $('#game .time-left').textContent = `${game.rolls} rolled`;
    return;
  }
  const [icon, topic] = game.current.topic;
  const tense = game.current.tense;
  const model = diceModels[topic][diceTenses.indexOf(tense)];
  box.innerHTML = `${gameHud()}<div class="game-stage dice-stage"><div class="dice-faces"><span class="die"><b aria-hidden="true">${icon}</b>${html(topic)}</span><span class="die die-tense"><b aria-hidden="true">⏱</b>${html(tense)}</span></div>
    <p class="game-q">Ask a question about <b>${html(topic)}</b> in the <b>${html(tense.toLowerCase())}</b>.</p>
    ${reveal ? `<p class="game-feedback good">Model: <b>${html(model)}</b> ${listen(model, 'Listen')}</p><p class="game-ctx">Did you put the auxiliary before the subject? Now answer your own question in one or two sentences!</p>` : '<button type="button" data-game="reveal">👀 Show a model question</button>'}
    <div class="actions"><button class="primary" type="button" data-game="roll">🎲 Roll again</button></div></div>`;
  $('#game .time-left').textContent = `${game.rolls} rolled`;
}
function rollDice() {
  game.rolls++;
  game.current = {topic:diceTopics[Math.floor(Math.random() * diceTopics.length)], tense:diceTenses[Math.floor(Math.random() * diceTenses.length)]};
  renderDice();
}
function handleGameClick(button) {
  if (button.dataset.gameStart) return startGame(button.dataset.gameStart);
  if (button.dataset.gameAnswer !== undefined) return answerRound(button.dataset.gameAnswer);
  const action = button.dataset.game;
  if (action === 'quit') return game && game.mode !== 'dice' && game.total ? endGame() : gameHome();
  if (action === 'home') return gameHome();
  if (action === 'roll') return rollDice();
  if (action === 'reveal') return renderDice(true);
}


const examStages = [
  {title:'Reading', minutes:4, passage:mockReading},
  {title:'Listening', minutes:4, passage:mockListening},
  {title:'Language use', minutes:3, questions:mockLanguage},
  {title:'Writing · short message', minutes:7, task:mockWrite, draftKey:'mock-writing'},
  {title:'Writing · structured update', minutes:10, task:mockReport, draftKey:'mock-report'},
  {title:'Oral interview', minutes:8, task:mockOral}
];
let session = null;
let clockInterval;
const exam = $('#exam-panel');

function renderExamHome() {
  exam.innerHTML = '<div class="prompt"><h3>36-minute practice route</h3><p>Reading → Listening → Language use → Short message → Structured update → Oral interview. For the oral stage, have someone read the prompts and ask you a follow-up aloud. Work at your own pace in Guided mode above whenever you need a model.</p><button class="primary" type="button" id="start-mock">Start timed mock</button></div>';
}
function renderExamStage() {
  const {index} = session;
  const stage = examStages[index];
  const content = stage.passage
    ? passageMarkup(stage.passage, true) + stage.passage.q.map((line, i) => quizMarkup(`mock-${index}-${i}`, choice(line), true)).join('')
    : stage.questions ? stage.questions.map((line, i) => quizMarkup(`mock-${index}-${i}`, choice(line), true)).join('')
    : stage.draftKey ? draft(stage.draftKey, 'My timed response') + '<p class="status" data-word-count></p>'
    : '<p>Answer aloud. Ask for clarification if needed and give a reason or example. After the interview, you can note one answer to rework.</p>';
  const prompt = stage.task?.task || (index === 0 ? 'Read the message and select an answer for each question.' : index === 1 ? 'Play the voicemail and select an answer for each question.' : 'Choose the best phrase to complete each workplace sentence.');
  exam.innerHTML = `<div class="exam-layout"><div><p class="badge">PART ${index + 1} OF ${examStages.length}</p><h3 tabindex="-1">${stage.title}</h3>${content}</div><aside class="stage"><div class="clock" role="timer" aria-label="Time remaining"></div><h4>Instructions</h4>
    <p class="passage">${html(prompt)}</p>${stage.task === mockOral ? listen(prompt, 'Listen to the prompts') : ''}
    ${stage.passage?.audio || stage.task === mockOral ? '<button id="exam-stop" type="button">Stop audio</button><p id="exam-audio-status" role="status"></p>' : ''}
    <button type="button" class="primary" id="submit-stage">${index === examStages.length - 1 ? 'Finish mock' : 'Submit and continue'}</button> <button type="button" id="exit-mock">Exit mock</button></aside></div>`;
  // Only the timed practice workspace is interactive during a mock.
  document.body.classList.add('mock-active');
  for (const section of $$('main > section')) if (section.id !== 'exam') section.inert = true;
  $('nav').inert = true;
  if (stage.draftKey) wordCount($('[data-draft]', exam));
  $('h3', exam).focus();
  $('#exam').scrollIntoView?.({block:'start'});
  session.deadline = Date.now() + stage.minutes * 60000;
  tick();
  clockInterval = setInterval(tick, 250);
}
function tick() {
  const seconds = Math.max(0, Math.ceil((session.deadline - Date.now()) / 1000));
  $('.clock', exam).textContent = Math.floor(seconds / 60) + ':' + String(seconds % 60).padStart(2, '0');
  if (seconds === 0) {
    clearInterval(clockInterval);
    if (examStages[session.index].draftKey) $('[data-draft]', exam).readOnly = true;
    $('.clock', exam).textContent = '0:00 · Time is up';
    $$('[data-choice]', exam).forEach(button => { button.disabled = true; });
    $('#submit-stage').focus();
  }
}
function advanceExam() {
  clearInterval(clockInterval);
  window.speechSynthesis?.cancel();
  session.index++;
  if (session.index < examStages.length) renderExamStage();
  else finishExam();
}
function finishExam() {
  const review = [mockReading,mockListening,{title:'Language use',q:mockLanguage}].map((passage, i) => {
    const results = passage.q.map((line, j) => {
      const question = choice(line);
      const selected = session.responses[`mock-${i}-${j}`];
      const answer = selected === undefined ? 'Skipped' : question.options[selected];
      return {question, answer, correct:selected === question.correct};
    });
    return `<div class="prompt"><h3>${html(passage.title)} · ${results.filter(r => r.correct).length}/${results.length}</h3>${passage.audio ? passageMarkup(passage,false) : ''}<ol>${results.map(r => `<li>${html(r.question.prompt)} <b>${r.correct ? '✓' : '✗'}</b> Your answer: ${html(r.answer)}. Model: ${html(r.question.answer)}.</li>`).join('')}</ol></div>`;
  }).join('');
  document.body.classList.remove('mock-active');
  for (const section of $$('main > section')) section.inert = false;
  $('nav').inert = false;
  session = null;
  exam.innerHTML = `<h3 tabindex="-1">Review your practice</h3><div class="model-grid">${review}</div>
    <h3>Writing</h3><p class="passage">${html(state.drafts['mock-writing'] || 'No response entered.')}</p><p>Did you include the date, time, 18 people, step-free access and a reply deadline?</p>${models(mockWrite)}
    <h3>Structured update</h3><p class="passage">${html(state.drafts['mock-report'] || 'No response entered.')}</p><p>Did you report the trial’s purpose, the twelve forms, the access issue and a practical recommendation?</p>${models(mockReport)}
    <h3>Oral interview</h3><p>Check whether you developed your introduction, asked if your solution worked and supported your opinion with an example.</p>${models(mockOral,true)}
    ${draft('mock-reflection','One oral answer I want to improve')}<button type="button" id="start-mock">Start a new attempt</button>`;
  $('h3', exam).focus();
  $('#exam').scrollIntoView?.({block:'start'});
}

function hear(text) {
  const feedback = $('#exam-audio-status') || $('#audio-status');
  feedback.textContent = '';
  if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) {
    feedback.textContent = 'Spoken audio is unavailable in this browser.';
    return;
  }
  const lang = $('#accent').value;
  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = lang;
  const voice = window.speechSynthesis.getVoices().find(item => item.lang.toLowerCase() === lang.toLowerCase());
  if (voice) speech.voice = voice;
  speech.rate = .91;
  speech.onerror = event => {
    if (event.error === 'canceled' || event.error === 'interrupted') return;
    feedback.textContent = 'Audio could not start. Check that this browser has an English voice.';
  };
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(speech);
}
function resetQuiz(prefix) {
  const cards = $$('[data-key]').filter(card => card.dataset.key.startsWith(prefix + '-'));
  for (const card of cards) {
    const key = card.dataset.key;
    delete state.scores[key];
    delete bank.get(key).order;
    card.outerHTML = quizMarkup(key, bank.get(key));
  }
  for (const card of $$('[data-key]').filter(card => card.dataset.key.startsWith(prefix + '-'))) {
    if ($('[data-tiles]', card)) setupTiles(card);
  }
  save();
  progress();
}
function handleExercise(button, card) {
  const question = bank.get(card.dataset.key);
  if (button.hasAttribute('data-choice')) {
    const selected = Number(button.dataset.choice);
    $$('[data-choice]', card).forEach(option => {
      const active = option === button;
      option.classList.toggle('chosen', active);
      option.setAttribute('aria-pressed', String(active));
    });
    if (card.hasAttribute('data-mock')) {
      if (Date.now() < session.deadline) session.responses[card.dataset.key] = selected;
      return;
    }
    const correct = selected === question.correct;
    setFeedback(card, correct, correct ? '✓ Correct. ' + question.hint : '✗ Try again. ' + question.hint);
    return;
  }
  if (button.hasAttribute('data-tile')) {
    const id = Number(button.dataset.tile);
    const item = card.scrambled.find(word => word.id === id);
    if (card.built.includes(item)) card.built = card.built.filter(word => word !== item);
    else card.built.push(item);
    drawTiles(card, id);
    const prefix = card.built.every((word, index) => word.word === question.tokens[index]);
    const correct = prefix && card.built.length === question.tokens.length;
    const message = correct ? '✓ Correct. Your sentence is complete.' :
      !prefix ? '✗ Check the order. Click a tile to remove it.' : '✓ Correct so far. Keep going.';
    setFeedback(card, correct, card.built.length ? message : 'Choose a tile to start.');
    if (prefix) $('.status', card).classList.replace('bad','good');
    return;
  }
  if (button.hasAttribute('data-hint') || button.hasAttribute('data-answer')) {
    const help = $('.assist', card);
    help.hidden = false;
    help.textContent = button.hasAttribute('data-answer') ? 'Model answer: ' + question.answer : 'Hint: ' + question.hint;
  }
}
document.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button) return;
  const card = button.closest('.exercise');
  if (button.dataset.say) hear(button.dataset.say);
  if (button.dataset.tense) showTense(button.dataset.tense, false);
  if (button.closest('#game')) handleGameClick(button);
  if (button.dataset.trainer === 'start') { newTrainerRound(); renderTrainer(); }
  if (button.dataset.trainer === 'close') { trainer = null; renderTrainer(); }
  if (button.dataset.reset) resetQuiz(button.dataset.reset);
  if (card) handleExercise(button, card);
  if (button.id === 'start-mock') {
    state.drafts['mock-writing'] = '';
    state.drafts['mock-report'] = '';
    save();
    session = {index:0,responses:{}};
    renderExamStage();
  }
  if (button.id === 'exam-stop') window.speechSynthesis?.cancel();
  if (button.id === 'submit-stage') advanceExam();
  if (button.id === 'exit-mock') {
    clearInterval(clockInterval);
    window.speechSynthesis?.cancel();
    session = null;
    document.body.classList.remove('mock-active');
    for (const section of $$('main > section')) section.inert = false;
    $('nav').inert = false;
    renderExamHome();
    $('#start-mock').focus();
  }
});
document.addEventListener('submit', event => {
  if (event.target.matches('[data-trainer-form]')) { event.preventDefault(); checkTrainer(event.target); return; }
  const card = event.target.closest('.exercise');
  if (!card) return;
  event.preventDefault();
  gradeFill(card);
});
document.addEventListener('input', event => {
  const input = event.target;
  if (input.matches('[data-draft]')) {
    state.drafts[input.dataset.draft] = input.value;
    wordCount(input);
    save();
  }
  if (input.id === 'irr-search') {
    const query = normalize(input.value);
    let shown = 0;
    $$('#panel-irr tr[data-verb]').forEach(row => { row.hidden = Boolean(query) && !row.dataset.verb.includes(query); if (!row.hidden) shown++; });
    $$('#panel-irr .irr-group').forEach(group => { group.hidden = !$$('tr[data-verb]', group).some(row => !row.hidden); });
    $('#panel-irr .irr-empty').hidden = shown > 0;
    return;
  }
  const fillCard = input.closest('.exercise');
  if (fillCard && input.type === 'text') {
    const question = bank.get(fillCard.dataset.key);
    if (accepts(question, input.value)) gradeFill(fillCard);
    else {
      delete state.scores[fillCard.dataset.key];
      $('.status', fillCard).textContent = '';
      save();
      progress();
    }
  }
});
$('#notes').value = state.notes || '';
$('#notes').addEventListener('input', event => { state.notes = event.target.value; save(); });
$('#stop').addEventListener('click', () => window.speechSynthesis?.cancel());
$('#accent').value = state.accent === 'en-US' ? 'en-US' : 'en-GB';
$('#accent').addEventListener('change', event => {
  window.speechSynthesis?.cancel();
  state.accent = event.target.value;
  save();
});
$('#french').checked = state.french !== false;
function applyFrench() {
  document.body.classList.toggle('no-fr', !$('#french').checked);
}
$('#french').addEventListener('change', event => {
  state.french = event.target.checked;
  applyFrench();
  save();
});
applyFrench();
const dialog = $('#disclaimer');
function showNotice() {
  if (!dialog.open) dialog.showModal();
}
$('#notice').addEventListener('click', showNotice);
$('#print').addEventListener('click', () => window.print());
$('#export').addEventListener('click', () => {
  const lines = ['Frankie’s CLOE Masterclass', $('#score').textContent, '', 'Grammar topics'];
  grammar.forEach(([title], i) => {
    const count = [0,1,2].filter(j => state.scores[`gw${i}-${j}`]).length;
    lines.push(`${title} · ${count}/3`);
  });
  lines.push('', 'Verb lab');
  tenses.forEach(t => {
    const keys = [...bank.keys()].filter(key => key.startsWith(`v${t.id}-`));
    lines.push(`${t.name} · ${keys.filter(key => state.scores[key]).length}/${keys.length}`);
  });
  const questionKeys = [...bank.keys()].filter(key => key.startsWith('q-'));
  lines.push(`Questions · ${questionKeys.filter(key => state.scores[key]).length}/${questionKeys.length}`);
  lines.push(`Irregular verb trainer · best ${state.trainerBest ?? '–'}/10`);
  const best = state.gameBest || {};
  lines.push(`Question Quest · best scores: rush ${best.rush ?? '–'}, answer → question ${best.match ?? '–'}, right or wrong ${best.fix ?? '–'}`);
  lines.push('', 'Practice notes', state.notes || '', '', 'Saved drafts');
  for (const [key, value] of Object.entries(state.drafts)) {
    if (!value.trim()) continue;
    const [kind, number, step] = key.split('-');
    const title = kind === 'verb' ? (number === 'questions' ? questionTask.title : tenses.find(t => t.id === number)?.name + ' · ' + tenses.find(t => t.id === number)?.task.title) : kind === 'oral' ? oral[number]?.title : kind === 'oralstep' ? oral[number]?.title + ' · step ' + (Number(step) + 1) : kind === 'write' ? writing[number]?.title :
      ({writing:mockWrite.title, report:mockReport.title, reflection:'Mock interview reflection'})[number];
    lines.push(title || key, value, '');
  }
  const url = URL.createObjectURL(new Blob([lines.join('\n')], {type:'text/plain;charset=utf-8'}));
  const download = document.createElement('a');
  download.href = url;
  download.download = 'Frankie_CLOE_Practice_Summary.txt';
  download.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
renderVerbLab();
renderQuestionLab();
gameHome();
renderGrammar();
renderVocabulary();
renderComprehension();
setOptions($('#oral-select'), oral);
setOptions($('#write-select'), writing);
$('#oral-select').addEventListener('change', renderOral);
$('#write-select').addEventListener('change', renderWriting);
renderOral();
renderWriting();
renderExamHome();
progress();
showNotice();

// Highlight the learning section on navigation without changing the lesson logic.
if ('IntersectionObserver' in window) {
  const links = $$('nav.section-nav a[href^="#"]');
  const headings = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const visible = new Map();
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => visible.set(entry.target.id, entry.isIntersecting));
    const active = headings.find(section => visible.get(section.id)) || headings[0];
    links.forEach(link => link.classList.toggle('active', active && link.getAttribute('href') === '#' + active.id));
  }, {rootMargin:'-15% 0px -70% 0px',threshold:0});
  headings.forEach(heading => observer.observe(heading));
}
