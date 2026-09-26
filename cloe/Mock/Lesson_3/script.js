const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
const norm=s=>String(s??'').trim().toLowerCase().replace(/[’]/g,"'").replace(/[?.!,;:]+$/g,'').replace(/\s+/g,' ');
const shuffle=a=>[...a].sort(()=>Math.random()-.5);

const state={completed:new Set(),guidedFirst:0,guidedDone:new Set(),guidedAttempts:{},currentGuided:0,solo:false,fr:false,examAnswers:[],examScore:null,startTime:Date.now(),ladderDone:new Set()};
const STORAGE='cloe_success_path_l3_v1';

document.body.classList.add('fr-hidden');

const expressionMap=[
  ['INTERACT','Requests & clarification','Ask for action, repetition, confirmation or more detail without sounding abrupt.'],
  ['COLLABORATE','Meetings & teamwork','Agree, disagree, suggest, interrupt politely, move on and summarise.'],
  ['RESPOND','Problems & service','Apologise, reassure, explain a delay, propose a solution and manage expectations.'],
  ['PROGRESS','Follow-up & deadlines','Check status, chase politely, confirm next steps, prioritise and close the loop.']
];

const bank=[];
function add(category,items){items.forEach(x=>bank.push({category,...x}));}
add('Requests',[
 {level:'A2',phrase:'Could you send me the file, please?',fr:'Pourriez-vous m’envoyer le fichier, s’il vous plaît ?',meaning:'Polite neutral request.',register:'neutral-professional',example:'Could you send me the revised file before lunch, please?'},
 {level:'A2',phrase:'Can you help me with this?',fr:'Pouvez-vous m’aider avec ceci ?',meaning:'Simple request for help.',register:'neutral',example:'Can you help me with this spreadsheet?'},
 {level:'B1',phrase:'Would you mind checking this?',fr:'Cela vous dérangerait-il de vérifier ceci ?',meaning:'Polite request; followed by -ing.',register:'polite',example:'Would you mind checking the figures before we send them?'},
 {level:'B1',phrase:'Could you possibly…?',fr:'Pourriez-vous éventuellement… ?',meaning:'Softens a request when it may be inconvenient.',register:'polite',example:'Could you possibly move the meeting to 3 p.m.?'},
 {level:'B1+',phrase:'I’d appreciate it if you could…',fr:'Je vous serais reconnaissant(e) si vous pouviez…',meaning:'Formal, courteous request.',register:'formal',example:'I’d appreciate it if you could confirm receipt.'},
 {level:'B2',phrase:'Would it be possible to…?',fr:'Serait-il possible de… ?',meaning:'Diplomatic way to explore an option.',register:'diplomatic',example:'Would it be possible to extend the deadline by two days?'}
]);
add('Clarification',[
 {level:'A2',phrase:'Could you repeat that, please?',fr:'Pourriez-vous répéter, s’il vous plaît ?',meaning:'Ask someone to say something again.',register:'neutral',example:'Could you repeat the reference number, please?'},
 {level:'A2',phrase:'What do you mean by…?',fr:'Que voulez-vous dire par… ?',meaning:'Ask for the meaning of a word or idea.',register:'direct-neutral',example:'What do you mean by “priority client”?'},
 {level:'B1',phrase:'I’m sorry, I didn’t quite catch that.',fr:'Désolé(e), je n’ai pas bien compris/entendu.',meaning:'Polite way to say you did not hear or understand.',register:'polite',example:'I’m sorry, I didn’t quite catch the date.'},
 {level:'B1',phrase:'Just to clarify, do you mean…?',fr:'Juste pour clarifier, voulez-vous dire… ?',meaning:'Check your interpretation before acting.',register:'professional',example:'Just to clarify, do you mean Friday this week?'},
 {level:'B1+',phrase:'Could you elaborate on that?',fr:'Pourriez-vous développer ce point ?',meaning:'Ask for more detail or explanation.',register:'formal-neutral',example:'Could you elaborate on the second option?'},
 {level:'B2',phrase:'If I understand correctly,…',fr:'Si j’ai bien compris,…',meaning:'Restate your understanding before confirming.',register:'professional',example:'If I understand correctly, the change only affects new clients.'}
]);
add('Meetings',[
 {level:'A2',phrase:'Shall we start?',fr:'On commence ?',meaning:'Invite the group to begin.',register:'neutral',example:'Everyone is here. Shall we start?'},
 {level:'A2',phrase:'Let’s move on to the next point.',fr:'Passons au point suivant.',meaning:'Transition to another agenda item.',register:'neutral-professional',example:'Let’s move on to the next point: delivery dates.'},
 {level:'B1',phrase:'Can I add something here?',fr:'Puis-je ajouter quelque chose ici ?',meaning:'Enter the discussion politely.',register:'neutral',example:'Can I add something here about the budget?'},
 {level:'B1',phrase:'Could we come back to that later?',fr:'Pourrions-nous revenir là-dessus plus tard ?',meaning:'Park a topic temporarily.',register:'polite',example:'Could we come back to that later, after the sales update?'},
 {level:'B1+',phrase:'To sum up, we’ve agreed to…',fr:'Pour résumer, nous avons convenu de…',meaning:'Summarise a decision.',register:'professional',example:'To sum up, we’ve agreed to test the new process next month.'},
 {level:'B2',phrase:'Before we move on, may I raise one point?',fr:'Avant de passer à la suite, puis-je soulever un point ?',meaning:'Polite formal intervention before changing topic.',register:'formal-diplomatic',example:'Before we move on, may I raise one point about resources?'}
]);
add('Phone & video',[
 {level:'A2',phrase:'Could I speak to…?',fr:'Puis-je parler à… ?',meaning:'Ask to speak to someone.',register:'polite',example:'Could I speak to the purchasing manager, please?'},
 {level:'A2',phrase:'Can you hear me?',fr:'Vous m’entendez ?',meaning:'Check audio connection.',register:'neutral',example:'Can you hear me clearly now?'},
 {level:'B1',phrase:'I’ll put you through.',fr:'Je vous le/la passe.',meaning:'Connect a caller to another person.',register:'phone',example:'One moment, I’ll put you through.'},
 {level:'B1',phrase:'The line is breaking up.',fr:'La ligne coupe / grésille.',meaning:'Explain poor call quality.',register:'phone',example:'The line is breaking up. Could we switch to Teams?'},
 {level:'B1+',phrase:'You’re on mute.',fr:'Votre micro est coupé.',meaning:'Tell someone their microphone is muted.',register:'video-call',example:'I think you’re on mute—we can’t hear you.'},
 {level:'B2',phrase:'I’m afraid we seem to have lost you.',fr:'J’ai bien peur que nous ayons perdu la connexion avec vous.',meaning:'Diplomatic way to note a lost connection.',register:'polite-formal',example:'I’m afraid we seem to have lost you. We’ll wait a moment.'}
]);
add('Email & messaging',[
 {level:'A2',phrase:'Please find attached…',fr:'Veuillez trouver ci-joint…',meaning:'Introduce an attachment.',register:'formal-standard',example:'Please find attached the updated schedule.'},
 {level:'A2',phrase:'Thanks for your message.',fr:'Merci pour votre message.',meaning:'Acknowledge a message.',register:'neutral',example:'Thanks for your message. I’ll check this today.'},
 {level:'B1',phrase:'I’m writing to confirm…',fr:'Je vous écris pour confirmer…',meaning:'State the purpose of a confirmation email.',register:'professional',example:'I’m writing to confirm our appointment on 12 October.'},
 {level:'B1',phrase:'Please let me know if you need anything else.',fr:'N’hésitez pas à me dire si vous avez besoin d’autre chose.',meaning:'Offer further help when closing.',register:'professional',example:'Please let me know if you need anything else from our side.'},
 {level:'B1+',phrase:'Further to our conversation,…',fr:'Suite à notre conversation,…',meaning:'Refer back to a previous exchange.',register:'formal',example:'Further to our conversation, I’m sending the revised proposal.'},
 {level:'B2',phrase:'For ease of reference,…',fr:'Pour faciliter la consultation / à titre de référence,…',meaning:'Point readers to useful information.',register:'formal',example:'For ease of reference, I’ve highlighted the revised sections.'}
]);
add('Agreement',[
 {level:'A2',phrase:'I agree.',fr:'Je suis d’accord.',meaning:'Simple agreement.',register:'neutral',example:'I agree. Tuesday would be better.'},
 {level:'A2',phrase:'That sounds good.',fr:'Cela me paraît bien.',meaning:'Accept a suggestion or plan.',register:'friendly-neutral',example:'A call at 10? That sounds good.'},
 {level:'B1',phrase:'I completely agree.',fr:'Je suis tout à fait d’accord.',meaning:'Strong agreement.',register:'neutral',example:'I completely agree with your first point.'},
 {level:'B1',phrase:'That makes sense.',fr:'C’est logique / cela se tient.',meaning:'Show that an explanation or proposal is reasonable.',register:'natural-professional',example:'That makes sense. Let’s test it with one team first.'},
 {level:'B1+',phrase:'We’re on the same page.',fr:'Nous sommes sur la même longueur d’onde.',meaning:'Say that people share the same understanding or goal.',register:'informal-professional',example:'Good—we’re on the same page about the priorities.'},
 {level:'B2',phrase:'I’m fully in favour of that approach.',fr:'Je suis entièrement favorable à cette approche.',meaning:'Formal strong support for an approach.',register:'formal',example:'I’m fully in favour of that approach, provided we monitor the risks.'}
]);
add('Disagreement',[
 {level:'A2',phrase:'I’m not sure I agree.',fr:'Je ne suis pas sûr(e) d’être d’accord.',meaning:'Soften disagreement.',register:'polite',example:'I’m not sure I agree. The cost may be too high.'},
 {level:'B1',phrase:'I see your point, but…',fr:'Je comprends votre point de vue, mais…',meaning:'Acknowledge first, then disagree.',register:'professional',example:'I see your point, but we may need more data.'},
 {level:'B1',phrase:'I have a few concerns about that.',fr:'J’ai quelques réserves à ce sujet.',meaning:'Diplomatic concern rather than direct rejection.',register:'professional',example:'I have a few concerns about that timeline.'},
 {level:'B1+',phrase:'I’m afraid I see it differently.',fr:'J’ai bien peur de voir les choses différemment.',meaning:'Polite formal disagreement.',register:'formal-polite',example:'I’m afraid I see it differently on the staffing issue.'},
 {level:'B2',phrase:'I’m not entirely convinced that…',fr:'Je ne suis pas entièrement convaincu(e) que…',meaning:'Diplomatic scepticism.',register:'diplomatic',example:'I’m not entirely convinced that outsourcing is the best option.'},
 {level:'B2',phrase:'There may be another way of looking at this.',fr:'Il y a peut-être une autre façon de voir les choses.',meaning:'Introduce an alternative without confrontation.',register:'diplomatic',example:'There may be another way of looking at this from the client’s perspective.'}
]);
add('Suggestions',[
 {level:'A2',phrase:'Why don’t we…?',fr:'Pourquoi ne pas… ?',meaning:'Make a simple suggestion.',register:'neutral',example:'Why don’t we call them this afternoon?'},
 {level:'A2',phrase:'How about…?',fr:'Et si… ? / Que diriez-vous de… ?',meaning:'Informal-neutral suggestion; often followed by -ing.',register:'neutral',example:'How about moving the meeting to Friday?'},
 {level:'B1',phrase:'We could…',fr:'Nous pourrions…',meaning:'Suggest an option.',register:'neutral',example:'We could send a short survey first.'},
 {level:'B1',phrase:'I suggest we…',fr:'Je propose que nous…',meaning:'Clear professional suggestion.',register:'professional',example:'I suggest we review the figures before deciding.'},
 {level:'B1+',phrase:'It might be worth…',fr:'Cela vaudrait peut-être la peine de…',meaning:'Tentative suggestion; followed by -ing.',register:'diplomatic',example:'It might be worth checking with legal first.'},
 {level:'B2',phrase:'Would you be open to…?',fr:'Seriez-vous ouvert(e) à… ?',meaning:'Invite discussion of an alternative.',register:'diplomatic',example:'Would you be open to extending the pilot by two weeks?'}
]);
add('Problems & solutions',[
 {level:'A2',phrase:'There’s a problem with…',fr:'Il y a un problème avec…',meaning:'State a problem simply.',register:'neutral',example:'There’s a problem with the delivery address.'},
 {level:'A2',phrase:'Let’s find a solution.',fr:'Trouvons une solution.',meaning:'Move toward problem-solving.',register:'positive-neutral',example:'Let’s find a solution that works for both teams.'},
 {level:'B1',phrase:'We need to look into this.',fr:'Nous devons examiner cela.',meaning:'Investigate a problem.',register:'professional',example:'The figures do not match, so we need to look into this.'},
 {level:'B1',phrase:'One option would be to…',fr:'Une option serait de…',meaning:'Propose one possible solution.',register:'professional',example:'One option would be to split the order into two shipments.'},
 {level:'B1+',phrase:'We may need to reconsider…',fr:'Nous devrons peut-être reconsidérer…',meaning:'Diplomatically signal that a plan may need changing.',register:'diplomatic',example:'We may need to reconsider the launch date.'},
 {level:'B2',phrase:'The most practical way forward would be to…',fr:'La solution la plus pratique pour avancer serait de…',meaning:'Recommend a pragmatic next step.',register:'formal-professional',example:'The most practical way forward would be to run a smaller pilot.'}
]);
add('Apologies & service',[
 {level:'A2',phrase:'I’m sorry about that.',fr:'Je suis désolé(e) pour cela.',meaning:'Simple apology.',register:'neutral',example:'I’m sorry about that. I’ll correct it now.'},
 {level:'A2',phrase:'Sorry for the delay.',fr:'Désolé(e) pour le retard.',meaning:'Apologise for being late or replying late.',register:'neutral',example:'Sorry for the delay in getting back to you.'},
 {level:'B1',phrase:'I’m sorry for the inconvenience.',fr:'Je suis désolé(e) pour la gêne occasionnée.',meaning:'Standard service apology.',register:'professional',example:'I’m sorry for the inconvenience caused by the cancellation.'},
 {level:'B1',phrase:'Thank you for your patience.',fr:'Merci pour votre patience.',meaning:'Acknowledge waiting or disruption positively.',register:'professional',example:'Thank you for your patience while we investigate the issue.'},
 {level:'B1+',phrase:'I completely understand your concern.',fr:'Je comprends parfaitement votre préoccupation.',meaning:'Show empathy before explaining or solving.',register:'customer-care',example:'I completely understand your concern about the unexpected charge.'},
 {level:'B2',phrase:'Please accept our sincere apologies for…',fr:'Veuillez accepter nos sincères excuses pour…',meaning:'Formal strong apology.',register:'formal',example:'Please accept our sincere apologies for the disruption to your service.'}
]);
add('Deadlines & follow-up',[
 {level:'A2',phrase:'When do you need it?',fr:'Quand en avez-vous besoin ?',meaning:'Ask for a deadline.',register:'neutral',example:'When do you need the final version?'},
 {level:'A2',phrase:'I’ll send it by Friday.',fr:'Je l’enverrai d’ici vendredi.',meaning:'Commit to a deadline.',register:'neutral',example:'I’ll send it by Friday afternoon.'},
 {level:'B1',phrase:'I’m just following up on…',fr:'Je me permets de revenir sur…',meaning:'Politely check progress on an earlier request.',register:'professional',example:'I’m just following up on the quotation I sent last week.'},
 {level:'B1',phrase:'Could you keep me posted?',fr:'Pourriez-vous me tenir au courant ?',meaning:'Ask for updates.',register:'professional',example:'Could you keep me posted on any changes?'},
 {level:'B1+',phrase:'Are we still on track for…?',fr:'Sommes-nous toujours dans les temps pour… ?',meaning:'Check whether a deadline or milestone remains achievable.',register:'project-professional',example:'Are we still on track for the November launch?'},
 {level:'B2',phrase:'Could you give me an update on where things stand?',fr:'Pourriez-vous me faire un point sur la situation ?',meaning:'Diplomatic detailed status request.',register:'professional',example:'Could you give me an update on where things stand with the contract?'}
]);
add('Opinions & presentations',[
 {level:'A2',phrase:'I think…',fr:'Je pense que…',meaning:'Give a simple opinion.',register:'neutral',example:'I think the first option is easier.'},
 {level:'A2',phrase:'In my opinion,…',fr:'À mon avis,…',meaning:'State a personal view.',register:'neutral',example:'In my opinion, we need more time.'},
 {level:'B1',phrase:'From my point of view,…',fr:'De mon point de vue,…',meaning:'Frame your perspective.',register:'professional',example:'From my point of view, the main risk is timing.'},
 {level:'B1',phrase:'The key point is…',fr:'Le point essentiel est…',meaning:'Highlight the most important idea.',register:'presentation',example:'The key point is that customer demand is rising.'},
 {level:'B1+',phrase:'What I’d like to highlight is…',fr:'Ce que je voudrais souligner, c’est…',meaning:'Draw attention to a key idea.',register:'presentation-formal',example:'What I’d like to highlight is the improvement in response time.'},
 {level:'B2',phrase:'As far as I’m concerned,…',fr:'En ce qui me concerne,…',meaning:'State your own position, sometimes with emphasis.',register:'neutral-formal',example:'As far as I’m concerned, reliability matters more than speed.'}
]);
add('Closing & next steps',[
 {level:'A2',phrase:'See you then.',fr:'À ce moment-là / à bientôt.',meaning:'Confirm an agreed meeting time.',register:'friendly-neutral',example:'Thursday at 2 works for me. See you then.'},
 {level:'A2',phrase:'Talk to you soon.',fr:'À bientôt / on se reparle bientôt.',meaning:'Friendly conversational closing.',register:'informal-professional',example:'Thanks for your help. Talk to you soon.'},
 {level:'B1',phrase:'I’ll get back to you.',fr:'Je reviendrai vers vous / je vous recontacterai.',meaning:'Promise a later response.',register:'natural-professional',example:'I need to check with finance. I’ll get back to you tomorrow.'},
 {level:'B1',phrase:'Let’s agree on the next steps.',fr:'Mettons-nous d’accord sur les prochaines étapes.',meaning:'Move from discussion to action.',register:'professional',example:'Before we finish, let’s agree on the next steps.'},
 {level:'B1+',phrase:'I’ll keep you updated.',fr:'Je vous tiendrai informé(e).',meaning:'Promise future updates.',register:'professional',example:'I’ll keep you updated as soon as we hear from the supplier.'},
 {level:'B2',phrase:'I think that covers everything for now.',fr:'Je pense que cela couvre tout pour le moment.',meaning:'Polite meeting/call close after checking completion.',register:'professional',example:'I think that covers everything for now. Thank you for your time.'}
]);

const guided=[
 {type:'mcq',level:'A2',family:'Requests',title:'A polite request',context:'You need a colleague to email a document.',prompt:'Choose the most appropriate expression.',options:['Send me the document.','Could you send me the document, please?','You send the document now.'],answer:1,hint:'Look for a request that is clear but not an order.',why:'“Could you… please?” is a standard polite request. The other options are too direct or unnatural.',model:'Could you send me the document, please?',fr:'Pourriez-vous m’envoyer le document, s’il vous plaît ?'},
 {type:'dropdown',level:'A2',family:'Clarification',title:'You did not hear',context:'A client gives a reference number too quickly.',prompt:'I’m sorry, I didn’t quite ___ that.',options:['catch','take','listen','hold'],answer:'catch',hint:'Think of the fixed expression meaning “I didn’t hear/understand clearly.”',why:'The natural chunk is “I didn’t quite catch that.”',model:'I’m sorry, I didn’t quite catch that. Could you repeat the number?',fr:'Désolé(e), je n’ai pas bien compris/entendu.'},
 {type:'text',level:'A2',family:'Meetings',title:'Change agenda item',context:'You have finished discussing point 1.',prompt:'Let’s ___ on to the next point.',answers:['move'],hint:'The fixed phrasal verb is “___ on”.',why:'“Move on to” means continue to the next topic.',model:'Let’s move on to the next point.',fr:'Passons au point suivant.'},
 {type:'reorder',level:'A2',family:'Clarification',title:'Build the polite question',context:'You need a speaker to repeat something.',prompt:'Put the words in the natural order.',tokens:['repeat','Could','please','that','you'],answer:['Could','you','repeat','that','please'],hint:'Start with the modal, then subject, then verb.',why:'Polite question order is “Could + subject + base verb…?”',model:'Could you repeat that, please?',fr:'Pourriez-vous répéter, s’il vous plaît ?'},
 {type:'wordbank',level:'B1',family:'Suggestions',title:'Make a suggestion',context:'The team needs more time to decide.',prompt:'Build a natural suggestion.',tokens:['Why','don’t','we','postpone','the','decision','until','Friday'],answer:['Why','don’t','we','postpone','the','decision','until','Friday'],hint:'A common suggestion starts “Why don’t we…?”',why:'“Why don’t we + base verb” is a natural neutral suggestion.',model:'Why don’t we postpone the decision until Friday?',fr:'Pourquoi ne pas reporter la décision à vendredi ?'},
 {type:'mcq',level:'B1',family:'Clarification',title:'Check your understanding',context:'A manager says the deadline has changed, but the new date is unclear.',prompt:'Which phrase best checks your interpretation?',options:['Just to clarify, do you mean next Monday?','I don’t understand you.','Say the date again.'],answer:0,hint:'Choose the option that confirms your interpretation politely.',why:'“Just to clarify…” is a professional way to verify meaning before acting.',model:'Just to clarify, do you mean next Monday?',fr:'Juste pour clarifier, voulez-vous dire lundi prochain ?'},
 {type:'dropdown',level:'B1',family:'Agreement',title:'Natural agreement',context:'A colleague proposes testing the process with one team first.',prompt:'That ___ sense. Let’s try it.',options:['does','makes','takes','gets'],answer:'makes',hint:'This is a fixed collocation with “sense”.',why:'The expression is “That makes sense.”',model:'That makes sense. Let’s try it.',fr:'C’est logique / cela se tient.'},
 {type:'text',level:'B1',family:'Deadlines & follow-up',title:'Ask for updates',context:'A supplier is waiting for confirmation from another department.',prompt:'Could you keep me ___?',answers:['posted','updated'],hint:'A common chunk is “keep me p_____”.',why:'“Keep me posted” means keep me informed. “Keep me updated” is also natural.',model:'Could you keep me posted on any changes?',fr:'Pourriez-vous me tenir au courant ?'},
 {type:'reorder',level:'B1',family:'Disagreement',title:'Disagree diplomatically',context:'You understand the proposal but see a risk.',prompt:'Build the professional response.',tokens:['point','but','I','your','see','some','concerns','have'],answer:['I','see','your','point','but','I','have','some','concerns'],hint:'Acknowledge first, then introduce your concern.',why:'“I see your point, but…” softens disagreement and keeps the exchange constructive.',model:'I see your point, but I have some concerns.',fr:'Je comprends votre point de vue, mais j’ai quelques réserves.'},
 {type:'mcq',level:'B1',family:'Apologies & service',title:'Customer complaint',context:'A customer’s delivery arrived two days late.',prompt:'Which opening is most appropriate?',options:['It’s not our fault.','I’m sorry for the inconvenience. Let me look into this.','You need to wait.'],answer:1,hint:'Acknowledge the impact before investigating.',why:'A professional service response combines apology and action.',model:'I’m sorry for the inconvenience. Let me look into this for you.',fr:'Je suis désolé(e) pour la gêne occasionnée. Je vais vérifier cela.'},
 {type:'wordbank',level:'B1',family:'Closing & next steps',title:'Promise a later answer',context:'You need information from finance before replying.',prompt:'Build the natural phrase.',tokens:['I’ll','get','back','to','you','tomorrow'],answer:['I’ll','get','back','to','you','tomorrow'],hint:'English uses “get back to someone” for replying later.',why:'“I’ll get back to you” is the natural professional chunk.',model:'I’ll get back to you tomorrow.',fr:'Je reviendrai vers vous / je vous recontacterai demain.'},
 {type:'paragraph',level:'B1+',family:'Email & messaging',title:'Order the short email',context:'You need to follow up politely after no reply.',prompt:'Put the lines in the best professional order.',tokens:['Kind regards,','I’m just following up on the quotation I sent last Tuesday.','Could you let me know if you have any questions?','Hello,'],answer:['Hello,','I’m just following up on the quotation I sent last Tuesday.','Could you let me know if you have any questions?','Kind regards,'],hint:'Greeting → reason for writing → helpful next step → closing.',why:'A concise follow-up email should orient the reader immediately and end with an easy action.',model:'Hello,\nI’m just following up on the quotation I sent last Tuesday.\nCould you let me know if you have any questions?\nKind regards,',fr:'Bonjour, je me permets de revenir sur le devis envoyé mardi dernier…'},
 {type:'dropdown',level:'B1+',family:'Problems & solutions',title:'Investigate the issue',context:'Two reports show different totals.',prompt:'We need to look ___ this before the meeting.',options:['at','into','for','after'],answer:'into',hint:'The phrasal verb meaning “investigate” is “look ___”.',why:'“Look into” means investigate a problem or situation.',model:'We need to look into this before the meeting.',fr:'Nous devons examiner cela avant la réunion.'},
 {type:'text',level:'B1+',family:'Meetings',title:'Summarise a decision',context:'The team has decided to test a new process in October.',prompt:'To sum ___, we’ve agreed to run the pilot in October.',answers:['up'],hint:'A meeting summary often begins “To sum ___”.',why:'“To sum up” introduces a concise summary.',model:'To sum up, we’ve agreed to run the pilot in October.',fr:'Pour résumer, nous avons convenu de lancer le pilote en octobre.'},
 {type:'mcq',level:'B1+',family:'Suggestions',title:'Diplomatic suggestion',context:'You think the team should check with legal before signing.',prompt:'Choose the most diplomatic suggestion.',options:['Check with legal.','You must ask legal.','It might be worth checking with legal first.'],answer:2,hint:'Choose the phrase that suggests without sounding like an order.',why:'“It might be worth + -ing” is a useful tentative professional suggestion.',model:'It might be worth checking with legal first.',fr:'Cela vaudrait peut-être la peine de vérifier d’abord avec le service juridique.'},
 {type:'reorder',level:'B2',family:'Suggestions',title:'Open an alternative',context:'A negotiation is stuck on the current proposal.',prompt:'Build the diplomatic question.',tokens:['open','Would','to','you','be','discussing','an','alternative'],answer:['Would','you','be','open','to','discussing','an','alternative'],hint:'After “open to”, use -ing.',why:'“Would you be open to…?” invites discussion without forcing agreement.',model:'Would you be open to discussing an alternative?',fr:'Seriez-vous ouvert(e) à discuter d’une alternative ?'},
 {type:'mcq',level:'B2',family:'Disagreement',title:'Diplomatic scepticism',context:'A senior colleague proposes outsourcing everything immediately.',prompt:'Which response is most measured?',options:['That’s a bad idea.','I’m not entirely convinced that a full outsourcing approach is the best option.','No, we won’t do that.'],answer:1,hint:'At B2, look for controlled disagreement with room for discussion.',why:'“I’m not entirely convinced that…” communicates doubt without closing the conversation.',model:'I’m not entirely convinced that a full outsourcing approach is the best option.',fr:'Je ne suis pas entièrement convaincu(e) qu’une externalisation totale soit la meilleure option.'},
 {type:'paragraph',level:'B2',family:'Problems & solutions',title:'Structure a diplomatic response',context:'A project is late and you need to respond to a client.',prompt:'Put the response in the strongest professional order.',tokens:['We’ll keep you updated on progress.','I completely understand your concern about the delay.','The most practical way forward would be to deliver phase one on Monday and phase two on Wednesday.','Thank you for raising this.'],answer:['Thank you for raising this.','I completely understand your concern about the delay.','The most practical way forward would be to deliver phase one on Monday and phase two on Wednesday.','We’ll keep you updated on progress.'],hint:'Acknowledge → empathise → solution → follow-up.',why:'This sequence manages the relationship before presenting a practical solution and next-step commitment.',model:'Thank you for raising this. I completely understand your concern about the delay. The most practical way forward would be to deliver phase one on Monday and phase two on Wednesday. We’ll keep you updated on progress.',fr:'Merci d’avoir soulevé ce point. Je comprends parfaitement votre préoccupation…'}
];

const ladder=[
 {level:'A2',label:'Clear function',q:'You need someone to repeat a phone number.',options:['Could you repeat that, please?','You repeat.','Again!'],answer:0,explain:'A2 success = clear, polite functional phrase.'},
 {level:'B1',label:'Natural chunk',q:'You will reply tomorrow after checking internally.',options:['I return toward you tomorrow.','I’ll get back to you tomorrow.','I come back at you tomorrow.'],answer:1,explain:'B1 success = choose the natural English chunk, not a literal translation.'},
 {level:'B1+',label:'Register',q:'You disagree with a colleague in a meeting.',options:['You’re wrong.','I see your point, but I have a few concerns.','No.'],answer:1,explain:'B1+ success = manage tone while communicating the disagreement.'},
 {level:'B2',label:'Diplomacy',q:'You want a client to consider another option.',options:['Choose another option.','Would you be open to discussing an alternative?','You should change your decision.'],answer:1,explain:'B2 success = precision, diplomacy and room for interaction.'}
];

const exam=[
 {type:'mcq',family:'Clarification',prompt:'A client gives a date you are not sure you heard correctly. Choose the best response.',options:['Just to clarify, did you say the 14th?','Tell me again.','I did not listen.'],answer:0,why:'“Just to clarify…” politely checks exact information.'},
 {type:'dropdown',family:'Meetings',prompt:'Let’s ___ on to the next point.',options:['go','move','take','come'],answer:'move',why:'“Move on to” is the fixed meeting transition.'},
 {type:'text',family:'Deadlines & follow-up',prompt:'I’m just following ___ on the quotation I sent last week.',answers:['up'],why:'The phrasal verb is “follow up on”.'},
 {type:'reorder',family:'Requests',prompt:'Put the words in the most natural order.',tokens:['possibly','Could','send','you','the','updated','version'],answer:['Could','you','possibly','send','the','updated','version'],why:'“Could you possibly + base verb” is a polite softened request.'},
 {type:'mcq',family:'Disagreement',prompt:'Your manager suggests a very short deadline. Which response is most professional?',options:['Impossible.','I have a few concerns about that timeline.','No way.'],answer:1,why:'It raises the problem without sounding confrontational.'},
 {type:'wordbank',family:'Closing & next steps',prompt:'Build the natural promise to update someone.',tokens:['I’ll','keep','you','updated'],answer:['I’ll','keep','you','updated'],why:'“Keep someone updated” is a natural follow-up commitment.'},
 {type:'dropdown',family:'Phone & video',prompt:'I’m afraid the line is breaking ___. Could you call me back?',options:['down','off','up','out'],answer:'up',why:'“The line is breaking up” describes poor call quality.'},
 {type:'mcq',family:'Suggestions',prompt:'You want to make a tentative recommendation before a contract is signed.',options:['It might be worth checking with legal first.','Check legal now.','You are required to ask legal.'],answer:0,why:'“It might be worth…” is diplomatic and appropriately tentative.'},
 {type:'paragraph',family:'Apologies & service',prompt:'Order the response to a customer complaint.',tokens:['Let me look into this for you straight away.','Thank you for letting us know.','I’m sorry for the inconvenience.','I’ll update you by 3 p.m.'],answer:['Thank you for letting us know.','I’m sorry for the inconvenience.','Let me look into this for you straight away.','I’ll update you by 3 p.m.'],why:'A strong service response acknowledges, apologises, acts and sets an update expectation.'},
 {type:'mcq',family:'Suggestions',prompt:'A client rejects your first proposal. Which phrase best reopens the discussion?',options:['Would you be open to discussing an alternative?','You need to reconsider.','Then there is nothing else to discuss.'],answer:0,why:'It invites collaboration and preserves the relationship.'}
];

function persist(){
  localStorage.setItem(STORAGE,JSON.stringify({completed:[...state.completed],guidedFirst:state.guidedFirst,guidedDone:[...state.guidedDone],examScore:state.examScore,ladderDone:[...state.ladderDone]}));
}
function restore(){
  try{const d=JSON.parse(localStorage.getItem(STORAGE)||'{}');
    (d.completed||[]).forEach(x=>state.completed.add(x));
    state.guidedFirst=d.guidedFirst||0;(d.guidedDone||[]).forEach(x=>state.guidedDone.add(x));
    state.examScore=Number.isFinite(d.examScore)?d.examScore:null;(d.ladderDone||[]).forEach(x=>state.ladderDone.add(x));
  }catch(e){}
}
restore();

function renderExpressionMap(){
  $('#expressionMap').innerHTML=expressionMap.map(([k,t,p])=>`<article><span>${esc(k)}</span><h3>${esc(t)}</h3><p>${esc(p)}</p></article>`).join('');
}

function populateFilters(){
  const cats=['All',...new Set(bank.map(x=>x.category))];
  $('#categoryFilter').innerHTML=cats.map(x=>`<option value="${esc(x)}">${esc(x)}</option>`).join('');
}
function filteredBank(){
  const level=$('#levelFilter').value,cat=$('#categoryFilter').value,q=norm($('#expressionSearch').value);
  return bank.filter(x=>(level==='All'||x.level===level)&&(cat==='All'||x.category===cat)&&(!q||norm([x.phrase,x.fr,x.meaning,x.example,x.category].join(' ')).includes(q)));
}
function renderBank(items=filteredBank()){
  $('#expressionCount').textContent=items.length;
  $('#expressionBank').innerHTML=items.map((x,i)=>`<article class="expression-card">
    <button class="expression-summary" type="button" aria-expanded="false">
      <span class="expression-level">${esc(x.level)}</span><span><strong>${esc(x.phrase)}</strong><small>${esc(x.category)} · ${esc(x.register)}</small></span><span class="expression-arrow">＋</span>
    </button>
    <div class="expression-detail hidden">
      <div class="meaning-line">${esc(x.meaning)}</div>
      <div class="register-row"><span>${esc(x.category)}</span><span>${esc(x.register)}</span></div>
      <div class="expression-example"><b>Example:</b> ${esc(x.example)}</div>
      <div class="fr-help"><b>FR:</b> ${esc(x.fr)}</div>
      <div class="card-actions"><button class="speak-btn" type="button" data-speak="${esc(x.phrase)}">🔊 Hear expression</button><button class="speak-btn" type="button" data-speak="${esc(x.example)}">🔊 Hear example</button></div>
    </div>
  </article>`).join('') || '<p>No expression matches these filters.</p>';
  $$('.expression-summary').forEach(btn=>btn.addEventListener('click',()=>{const d=btn.nextElementSibling;const open=!d.classList.contains('hidden');d.classList.toggle('hidden',open);btn.setAttribute('aria-expanded',String(!open));$('.expression-arrow',btn).textContent=open?'＋':'−';}));
  $$('.speak-btn').forEach(b=>b.addEventListener('click',()=>speak(b.dataset.speak)));
}
function speak(text){
  if(!('speechSynthesis' in window)) return alert('Audio is not available in this browser.');
  speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(text); u.lang=$('#accentFilter')?.value||'en-GB'; u.rate=.9; speechSynthesis.speak(u);
}

function setFrench(on){
  state.fr=on;document.body.classList.toggle('fr-mode',on);document.body.classList.toggle('fr-hidden',!on);$('#toggleFrench').setAttribute('aria-pressed',String(on));$('#toggleFrench').textContent=on?'FR Coach ✓':'FR Coach';
}

function typeLabel(type){return ({mcq:'SINGLE-ANSWER MULTIPLE CHOICE',dropdown:'DROP-DOWN GAP',text:'TYPED GAP',reorder:'SCRAMBLED SENTENCE',wordbank:'WORD BANK',paragraph:'SCRAMBLED TEXT'})[type]||'PRACTICE';}
function renderInteractive(q,where,mode='guided'){
  let html='';
  if(q.context) html+=`<span class="context-pill">CONTEXT · ${esc(q.context)}</span>`;
  html+=`<div class="question-box">${esc(q.prompt)}</div>`;
  if(q.type==='mcq') html+=`<div class="answer-options">${q.options.map((o,i)=>`<button class="answer-option" data-choice="${i}" type="button">${esc(o)}</button>`).join('')}</div>`;
  if(q.type==='dropdown') html+=`<div class="dropdown-line"><select class="select-answer"><option value="">Choose…</option>${q.options.map(o=>`<option>${esc(o)}</option>`).join('')}</select></div>`;
  if(q.type==='text') html+=`<input class="typed-answer" type="text" autocomplete="off" placeholder="Type the missing word or expression" />`;
  if(q.type==='reorder'||q.type==='wordbank') html+=`<div class="sequence-area" aria-label="Your answer"></div><div class="word-bank">${shuffle(q.tokens).map((t,i)=>`<button class="word-chip" data-token="${esc(t)}" data-id="${i}" type="button">${esc(t)}</button>`).join('')}</div><div class="micro-tip">Click words to build the answer. Click a word in your answer to remove it.</div>`;
  if(q.type==='paragraph') html+=`<div class="sequence-area text-order-lines" aria-label="Your ordered text"></div><div class="word-bank text-order-lines">${shuffle(q.tokens).map((t,i)=>`<button class="order-chip" data-token="${esc(t)}" data-id="${i}" type="button">${esc(t)}</button>`).join('')}</div><div class="micro-tip">Click each line in the order you want it to appear.</div>`;
  where.innerHTML=html;
  where.dataset.seq=JSON.stringify([]);
  $$('.answer-option',where).forEach(b=>b.addEventListener('click',()=>{$$('.answer-option',where).forEach(x=>x.classList.remove('selected'));b.classList.add('selected');where.dataset.choice=b.dataset.choice;if(mode==='guided') setTimeout(validateGuided,120);}));
  const sel=$('.select-answer',where); if(sel) sel.addEventListener('change',()=>{if(mode==='guided'&&sel.value)setTimeout(validateGuided,120);});
  const input=$('.typed-answer',where); if(input) input.addEventListener('keydown',e=>{if(e.key==='Enter'&&mode==='guided')validateGuided();});
  $$('.word-chip,.order-chip',where).forEach(b=>b.addEventListener('click',()=>{if(b.classList.contains('used'))return;let seq=JSON.parse(where.dataset.seq);seq.push({id:b.dataset.id,token:b.dataset.token});where.dataset.seq=JSON.stringify(seq);b.classList.add('used');renderSequence(where,q,mode);}));
}
function renderSequence(where,q,mode){
  const area=$('.sequence-area',where),seq=JSON.parse(where.dataset.seq);area.innerHTML=seq.map((x,i)=>`<button class="word-chip" data-seq-index="${i}" type="button">${esc(x.token)}</button>`).join('');
  $$('[data-seq-index]',area).forEach(b=>b.addEventListener('click',()=>{let s=JSON.parse(where.dataset.seq);const [removed]=s.splice(Number(b.dataset.seqIndex),1);where.dataset.seq=JSON.stringify(s);const source=$(`[data-id="${CSS.escape(removed.id)}"]`,where);if(source)source.classList.remove('used');renderSequence(where,q,mode);}));
  if(mode==='guided'&&seq.length===q.answer.length)setTimeout(validateGuided,120);
}
function readAnswer(q,where){
  if(q.type==='mcq') return Number(where.dataset.choice);
  if(q.type==='dropdown') return $('.select-answer',where)?.value||'';
  if(q.type==='text') return $('.typed-answer',where)?.value||'';
  return JSON.parse(where.dataset.seq||'[]').map(x=>x.token);
}
function isCorrect(q,a){
  if(q.type==='mcq') return a===q.answer;
  if(q.type==='dropdown') return norm(a)===norm(q.answer);
  if(q.type==='text') return q.answers.some(x=>norm(a)===norm(x));
  return a.length===q.answer.length&&a.every((x,i)=>norm(x)===norm(q.answer[i]));
}
function answerDisplay(q){
  if(q.type==='mcq')return q.options[q.answer];
  if(q.type==='text')return q.answers[0];
  if(q.type==='dropdown')return q.answer;
  return q.answer.join(q.type==='paragraph'?' → ':' ');
}

function renderGuided(){
  const i=state.currentGuided,q=guided[i],done=state.guidedDone.has(i);
  $('#guidedStage').innerHTML=`<div class="exercise-head"><div class="exercise-meta"><span>GUIDED PRACTICE · ${esc(q.level)} · ${esc(q.family)}</span><b>${i+1} of ${guided.length}</b></div><div class="guided-dots">${guided.map((_,j)=>`<i class="${state.guidedDone.has(j)?'done':j===i?'current':''}"></i>`).join('')}</div></div><div class="exercise-main"><span class="exercise-type">${typeLabel(q.type)}</span><h3>${esc(q.title)}</h3><p class="instruction">Use R.E.A.C.T. before you answer.</p><div id="guidedQuestion"></div><div id="guidedFeedback"></div><div class="exercise-actions"><button class="button ghost small hint-action" id="showHint" type="button">Hint</button><button class="button ghost small model-action" id="showModel" type="button">Model</button><button class="button ghost small" id="checkAnswer" type="button">Check answer</button>${i>0?'<button class="button ghost small" id="prevGuided" type="button">← Previous</button>':''}<button class="button primary small next-btn" id="nextGuided" type="button">${i===guided.length-1?'Finish lab':'Next →'}</button></div></div>`;
  renderInteractive(q,$('#guidedQuestion'),'guided');
  $('#nextGuided').disabled=!done;
  if(state.solo){document.body.classList.add('solo-mode');}else document.body.classList.remove('solo-mode');
  $('#showHint')?.addEventListener('click',()=>{$('#guidedFeedback').innerHTML=`<div class="hint-box"><b>Hint:</b> ${esc(q.hint)}</div>`;});
  $('#showModel')?.addEventListener('click',()=>{$('#guidedFeedback').innerHTML=`<div class="model-box"><b>Model:</b> ${esc(q.model).replace(/\n/g,'<br>')}<div class="fr-inline"><b>FR:</b> ${esc(q.fr)}</div><div class="model-audio"><button class="button ghost small" id="modelAudio" type="button">🔊 Hear model</button></div></div>`;$('#modelAudio').addEventListener('click',()=>speak(q.model));});
  $('#checkAnswer').addEventListener('click',validateGuided);
  $('#prevGuided')?.addEventListener('click',()=>{state.currentGuided--;renderGuided();});
  $('#nextGuided').addEventListener('click',()=>{if(i<guided.length-1){state.currentGuided++;renderGuided();}else{state.completed.add(4);persist();updateProgress();$('#adaptive').scrollIntoView({behavior:'smooth'});}});
  if(done) $('#guidedFeedback').innerHTML=`<div class="feedback-box good"><b>Completed.</b> Correct answer: ${esc(answerDisplay(q))}</div>`;
}
function validateGuided(){
  const i=state.currentGuided,q=guided[i],where=$('#guidedQuestion'); if(!where)return;
  const a=readAnswer(q,where); if((q.type==='mcq'&&Number.isNaN(a))||((q.type==='dropdown'||q.type==='text')&&!String(a).trim())||((q.type==='reorder'||q.type==='wordbank'||q.type==='paragraph')&&!a.length))return;
  const correct=isCorrect(q,a); state.guidedAttempts[i]=(state.guidedAttempts[i]||0)+1;
  if(state.guidedAttempts[i]===1&&correct) state.guidedFirst++;
  if(correct) state.guidedDone.add(i);
  const fb=$('#guidedFeedback');
  fb.innerHTML=`<div class="feedback-box ${correct?'good':'bad'}"><b>${correct?'✓ Correct':'Not yet'}</b><br>${esc(q.why)}${correct?'':`<br><b>Try again.</b>`}<div class="fr-inline"><b>FR model:</b> ${esc(q.fr)}</div></div>${correct?`<div class="model-box"><b>Model:</b> ${esc(q.model).replace(/\n/g,'<br>')} <button class="button ghost small" id="modelAudio2" type="button">🔊</button></div>`:''}`;
  $('#modelAudio2')?.addEventListener('click',()=>speak(q.model));
  if(q.type==='mcq'){$$('.answer-option',where).forEach((b,j)=>{if(correct&&j===q.answer)b.classList.add('correct');else if(!correct&&b.classList.contains('selected'))b.classList.add('wrong');});}
  $('#nextGuided').disabled=!state.guidedDone.has(i);
  $('#guidedScore').textContent=`${state.guidedFirst}/${guided.length}`; $('#guidedProgress').textContent=`${state.guidedDone.size} / ${guided.length} complete`;
  if(state.guidedDone.size===guided.length)state.completed.add(4);persist();updateProgress();
}

function renderLadder(){
  $('#ladder').innerHTML=ladder.map((x,i)=>`<article class="ladder-card"><div class="ladder-level"><b>${esc(x.level)}</b><span>${esc(x.label)}</span></div><h3>${esc(x.q)}</h3><div class="ladder-options">${x.options.map((o,j)=>`<button type="button" data-ladder="${i}" data-option="${j}">${esc(o)}</button>`).join('')}</div><div class="ladder-explain" id="ladderExplain${i}">${state.ladderDone.has(i)?esc(x.explain):'Choose one answer.'}</div></article>`).join('');
  $$('[data-ladder]').forEach(b=>b.addEventListener('click',()=>{const i=Number(b.dataset.ladder),j=Number(b.dataset.option),x=ladder[i];$$(`[data-ladder="${i}"]`).forEach(z=>z.disabled=true);b.classList.add(j===x.answer?'right':'wrong');const right=$(`[data-ladder="${i}"][data-option="${x.answer}"]`);if(right)right.classList.add('right');$(`#ladderExplain${i}`).textContent=x.explain;state.ladderDone.add(i);if(state.ladderDone.size===ladder.length)state.completed.add(5);persist();updateProgress();}));
}

let examIndex=0,questionTimer=null,totalTimer=null,examStart=null,questionSeconds=55,remaining=55;
function startExam(){
  state.examAnswers=[];state.examScore=null;examIndex=0;examStart=Date.now();clearInterval(totalTimer);totalTimer=setInterval(updateExamTotal,1000);renderExamQuestion();
}
function updateExamTotal(){const s=Math.floor((Date.now()-examStart)/1000);$('#totalTime').textContent=`${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;}
function setTimer(){clearInterval(questionTimer);remaining=questionSeconds;paintTimer();questionTimer=setInterval(()=>{remaining--;paintTimer();if(remaining<=0){clearInterval(questionTimer);submitExam(true);}},1000);}
function paintTimer(){const pct=Math.max(0,remaining/questionSeconds*100),bar=$('#examTimerBar');$('#questionTime').textContent=`${remaining}s`;bar.style.width=`${pct}%`;bar.style.background=pct>50?'var(--green)':pct>25?'var(--yellow)':'var(--red)';}
function renderExamQuestion(){
  const q=exam[examIndex];$('#examQuestionLabel').textContent=`QUESTION ${examIndex+1} / ${exam.length}`;$('#examStepDots').innerHTML=`<span class="exam-dots">${exam.map((_,i)=>`<i class="${i<examIndex?'answered':i===examIndex?'active':''}"></i>`).join('')}</span>`;
  $('#examContent').innerHTML=`<div class="exam-question"><small>${typeLabel(q.type)} · ${esc(q.family)}</small><h3>Choose the most natural professional English.</h3><div id="examQuestion"></div><div class="exercise-actions"><button class="button primary" id="examValidate" type="button">VALIDATE</button></div></div>`;
  renderInteractive(q,$('#examQuestion'),'exam');$('#examValidate').addEventListener('click',()=>submitExam(false));setTimer();
}
function submitExam(timeout){
  const q=exam[examIndex],where=$('#examQuestion');let a=timeout?null:readAnswer(q,where);clearInterval(questionTimer);state.examAnswers.push({answer:a,correct:!timeout&&isCorrect(q,a),family:q.family,timeout});
  $('#examContent').innerHTML=`<div class="exam-start-card"><span class="ready-ring">${timeout?'0':'✓'}</span><h3>${timeout?'Time is up':'Answer recorded'}</h3><p>Next question in 3 seconds…</p></div>`;
  setTimeout(()=>{examIndex++;if(examIndex<exam.length)renderExamQuestion();else finishExam();},3000);
}
function finishExam(){
  clearInterval(questionTimer);clearInterval(totalTimer);state.examScore=state.examAnswers.filter(x=>x.correct).length;state.completed.add(6);persist();updateProgress();
  const review=exam.map((q,i)=>{const r=state.examAnswers[i];return `<details><summary class="${r?.correct?'ok':'no'}">${r?.correct?'✓':'✗'} Q${i+1} · ${esc(q.family)}</summary><p><b>Answer:</b> ${esc(answerDisplay(q))}<br>${esc(q.why)}</p></details>`;}).join('');
  $('#examContent').innerHTML=`<div class="exam-start-card"><span class="ready-ring">${state.examScore}</span><h3>${state.examScore}/10</h3><p>${scoreMessage(state.examScore)}</p><div class="result-review">${review}</div><button class="button primary" id="retryExam" type="button">TRY AGAIN</button></div>`;
  $('#examQuestionLabel').textContent='COMPLETE';$('#questionTime').textContent='—';$('#examTimerBar').style.width='100%';$('#examTimerBar').style.background='var(--green)';$('#retryExam').addEventListener('click',startExam);renderResults();
}
function scoreMessage(s){return s>=9?'Excellent control of professional expressions. Keep training speed and adaptability.':s>=7?'Strong result. Review the few functions that still cause hesitation.':s>=5?'Good base. Revisit your weak expression families before moving to a full mock.':'Use the guided lab again. Focus on function, register and fixed chunks before retesting.';}

function renderResults(){
  $('#guidedScore').textContent=`${state.guidedFirst}/${guided.length}`;
  if(state.examScore!==null){$('#finalScore').textContent=`${state.examScore}/10`;$('#finalMessage').textContent=scoreMessage(state.examScore);const missed={};state.examAnswers.forEach(x=>{if(!x.correct)missed[x.family]=(missed[x.family]||0)+1;});const arr=Object.entries(missed).sort((a,b)=>b[1]-a[1]);if(arr.length){$('#priorityCard').classList.remove('hidden');$('#priorityList').innerHTML=`<div class="priority-pills">${arr.map(([k,v])=>`<span>${esc(k)} · ${v} to review</span>`).join('')}</div>`;}else $('#priorityCard').classList.add('hidden');}
}
function updateProgress(){
  $$('.section-done').forEach(b=>{const n=Number(b.dataset.complete);b.classList.toggle('done',state.completed.has(n));});
  const pct=Math.round(state.completed.size/6*100);$('#progressLabel').textContent=`${pct}% complete`;$('#headerProgress').style.width=`${pct}%`;$('#lessonProgressScore').textContent=`${pct}%`;renderResults();
}

function download(filename,text,type='text/plain'){const blob=new Blob([text],{type});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500);}
function reportText(){
  const weak={};state.examAnswers.forEach(x=>{if(!x.correct)weak[x.family]=(weak[x.family]||0)+1;});
  return `CLOE SUCCESS PATH · LESSON 3\nExpressions & Functional English\n\nLesson progress: ${Math.round(state.completed.size/6*100)}%\nGuided lab first-attempt score: ${state.guidedFirst}/${guided.length}\nTimed mini-test: ${state.examScore===null?'not completed':state.examScore+'/10'}\n\nRevision priorities:\n${Object.keys(weak).length?Object.entries(weak).map(([k,v])=>`- ${k}: ${v} missed`).join('\n'):'- No timed-test priorities identified yet.'}\n\nCore technique: R.E.A.C.T. = Read · Effect · Appropriacy · Chunk · Test\n\nIndependent CLOE preparation resource. Not the official exam platform.`;
}

// global UI
$$('[data-scroll]').forEach(b=>b.addEventListener('click',()=>$(b.dataset.scroll)?.scrollIntoView({behavior:'smooth'})));
$('#toggleFrench').addEventListener('click',()=>setFrench(!state.fr));
$('#openCoach').addEventListener('click',()=>$('#coachModal').classList.remove('hidden'));
$('#closeCoach').addEventListener('click',()=>$('#coachModal').classList.add('hidden'));
$('#coachGotIt').addEventListener('click',()=>$('#coachModal').classList.add('hidden'));
$('#coachModal').addEventListener('click',e=>{if(e.target.id==='coachModal')$('#coachModal').classList.add('hidden');});
$$('.section-done').forEach(b=>b.addEventListener('click',()=>{const n=Number(b.dataset.complete);state.completed.has(n)?state.completed.delete(n):state.completed.add(n);persist();updateProgress();}));
$('#levelFilter').addEventListener('change',()=>renderBank());$('#categoryFilter').addEventListener('change',()=>renderBank());$('#expressionSearch').addEventListener('input',()=>renderBank());
$('#randomExpressions').addEventListener('click',()=>renderBank(shuffle(filteredBank()).slice(0,6)));
$('#guidedMode').addEventListener('click',()=>{state.solo=false;$('#guidedMode').classList.add('active');$('#soloMode').classList.remove('active');$('#hintFeature').textContent='✓ hints';renderGuided();});
$('#soloMode').addEventListener('click',()=>{state.solo=true;$('#soloMode').classList.add('active');$('#guidedMode').classList.remove('active');$('#hintFeature').textContent='hints hidden';renderGuided();});
$('#startExam').addEventListener('click',startExam);
$('#downloadReport').addEventListener('click',()=>download('CLOE_Lesson_03_Expressions_Report.txt',reportText()));
$('#exportProgress').addEventListener('click',()=>download('CLOE_Lesson_03_Progress.json',JSON.stringify({lesson:3,title:'Expressions & Functional English',completed:[...state.completed],guidedFirst:state.guidedFirst,guidedDone:[...state.guidedDone],miniTest:state.examScore,exported:new Date().toISOString()},null,2),'application/json'));
$('#resetAll').addEventListener('click',()=>{if(!confirm('Reset all Lesson 3 progress?'))return;localStorage.removeItem(STORAGE);location.reload();});
setInterval(()=>{const s=Math.floor((Date.now()-state.startTime)/1000);$('#lessonClock').textContent=`${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;},1000);

renderExpressionMap();populateFilters();renderBank();renderGuided();renderLadder();updateProgress();setFrench(false);
