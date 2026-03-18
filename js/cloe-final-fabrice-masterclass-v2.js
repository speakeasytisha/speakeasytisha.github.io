/* SpeakEasyTisha — Fabrice Final CLOE Exam Masterclass (v2)
   Put this file in: /js/cloe-final-fabrice-masterclass-v2.js
*/
(function(){
  "use strict";

  var DATA = {"scenarios": [{"id": "renault_supplier_delay", "cat": "Renault (Quality)", "tags": ["work", "email", "call", "problem", "quality"], "title": "Supplier delay — missing part", "desc": "Follow up politely, ask for tracking + new date.", "recommended": 45, "prompt": "You are following up with a supplier because a part is delayed. Explain the impact, request a new delivery date and tracking info.", "structure": [{"t": "Greeting + context", "en": "Good morning. I’m calling to follow up on a delayed delivery (part RQ‑784).", "fr": "Bonjour. J’appelle pour relancer une livraison en retard (pièce RQ‑784)."}, {"t": "2 key details", "en": "We expected it yesterday, and the delay may impact our production schedule.", "fr": "On l’attendait hier, et le retard peut impacter la production."}, {"t": "Request + close", "en": "Could you please confirm the new delivery date and share the latest tracking status? Thank you in advance.", "fr": "Pouvez‑vous confirmer la nouvelle date et partager le suivi ? Merci d’avance."}], "dialogue": [{"sp": "Examiner", "en": "Good morning. How can I help you?", "fr": "Bonjour. Comment puis‑je vous aider ?"}, {"sp": "Fabrice", "en": "Good morning. I’m calling to follow up on a delivery that is currently delayed.", "fr": "Bonjour. J’appelle pour relancer une livraison qui est en retard."}, {"sp": "Examiner", "en": "Which reference is it?", "fr": "Quelle référence ?"}, {"sp": "Fabrice", "en": "It’s part RQ‑784. We expected it yesterday and it may impact production.", "fr": "C’est la pièce RQ‑784. Elle était attendue hier et peut impacter la production."}, {"sp": "Examiner", "en": "What do you need?", "fr": "De quoi avez‑vous besoin ?"}, {"sp": "Fabrice", "en": "Could you confirm the new delivery date and share the latest tracking information, please?", "fr": "Pouvez‑vous confirmer la nouvelle date et le suivi, s’il vous plaît ?"}, {"sp": "Examiner", "en": "Okay, I’ll check and get back to you today.", "fr": "D’accord, je vérifie et je reviens vers vous aujourd’hui."}, {"sp": "Fabrice", "en": "Thank you. I really appreciate your help. Have a good day.", "fr": "Merci. J’apprécie votre aide. Bonne journée."}], "writing": {"subject": "Subject: Follow‑up on delayed part RQ‑784", "body": "Hello [Name],\n\nI’m following up on part RQ‑784, which was expected on [date] but has not arrived yet. This delay may impact our production schedule.\n\nCould you please confirm the updated delivery date and share the latest tracking information? If needed, we can discuss a priority shipment.\n\nThank you in advance for your support.\n\nBest regards,\nFabrice", "tips": [{"en": "Keep it short: purpose → impact → request → closing.", "fr": "Court : objectif → impact → demande → formule de fin."}, {"en": "Use polite modals: could / would / can.", "fr": "Utilise des modaux polis : could / would / can."}]}, "quizBank": [{"prompt": "Supplier says: “We don’t have an exact date yet.” Choose the best reply:", "options": [{"t": "That’s unacceptable. Deliver tomorrow.", "ok": false, "why": "Too aggressive."}, {"t": "I understand. Could you share an estimated timeframe and keep me updated today?", "ok": true, "why": "Polite + clear next step."}, {"t": "Okay bye.", "ok": false, "why": "Too short; no request."}]}], "builderModel": [{"step": 1, "text": "I’m calling to follow up on a delayed delivery (part RQ‑784)."}, {"step": 2, "text": "We expected it yesterday, and the delay may impact our production schedule."}, {"step": 3, "text": "Could you please confirm the new delivery date and share the latest tracking status? Thank you in advance."}], "fill": {"template": "I’m {b0} up on part RQ‑784, which was expected {b1}. This delay may {b2} our schedule. Could you please {b3} the updated delivery date and share the latest {b4} status?", "blanks": [{"id": "b0", "options": ["following", "flying", "filing"], "answer": "following"}, {"id": "b1", "options": ["yesterday", "yester-year", "yesterday's"], "answer": "yesterday"}, {"id": "b2", "options": ["impact", "improve", "ignore"], "answer": "impact"}, {"id": "b3", "options": ["confirm", "confuse", "consume"], "answer": "confirm"}, {"id": "b4", "options": ["tracking", "parking", "cooking"], "answer": "tracking"}]}, "vocab": [{"icon": "📦", "word": "delivery date", "def": "the date the shipment arrives", "fr": "date de livraison"}, {"icon": "⏳", "word": "delay", "def": "arriving later than expected", "fr": "retard"}, {"icon": "🔎", "word": "tracking status", "def": "shipment progress info", "fr": "statut de suivi"}, {"icon": "⚙️", "word": "production schedule", "def": "planned production timing", "fr": "planning de production"}, {"icon": "🫶", "word": "thank you in advance", "def": "polite phrase before help", "fr": "merci d’avance"}]}, {"id": "renault_non_conformity", "cat": "Renault (Quality)", "tags": ["work", "meeting", "problem", "quality"], "title": "Non‑conformity — corrective actions", "desc": "Explain issue, ask for CAPA + timeline.", "recommended": 60, "prompt": "You detected a non‑conformity during inspection. Explain the impact and ask for corrective actions and a timeline.", "structure": [{"t": "State the issue", "en": "We detected a non‑conformity during inspection on the latest batch.", "fr": "Nous avons détecté une non‑conformité lors du contrôle sur le dernier lot."}, {"t": "Impact + safety", "en": "The parts may not meet specifications, so we are stopping usage until we confirm the root cause.", "fr": "Les pièces peuvent ne pas respecter les spécifications, donc on stoppe l’usage."}, {"t": "Request + next step", "en": "Could you share a corrective action plan and timeline today? We can schedule a short meeting.", "fr": "Pouvez‑vous partager un plan d’actions correctives et un planning aujourd’hui ?"}], "dialogue": [{"sp": "Examiner", "en": "Can you explain the issue?", "fr": "Pouvez‑vous expliquer le problème ?"}, {"sp": "Fabrice", "en": "Yes. We detected a non‑conformity during inspection on the latest batch.", "fr": "Oui. Non‑conformité détectée lors du contrôle sur le dernier lot."}, {"sp": "Examiner", "en": "What is the impact?", "fr": "Quel est l’impact ?"}, {"sp": "Fabrice", "en": "The parts may not meet specifications, so we are stopping usage until we confirm the root cause.", "fr": "Les pièces peuvent ne pas respecter les spécifications, donc on stoppe l’usage."}, {"sp": "Examiner", "en": "What do you need from the supplier?", "fr": "Que faut‑il du fournisseur ?"}, {"sp": "Fabrice", "en": "We need a corrective action plan and a timeline. Could you send an initial update today?", "fr": "Nous avons besoin d’un plan d’actions correctives et d’un délai. Pouvez-vous envoyer une première réponse aujourd’hui ?"}, {"sp": "Examiner", "en": "Okay, we’ll organise a quick meeting.", "fr": "D’accord, on organise une réunion rapide."}, {"sp": "Fabrice", "en": "Perfect. I’ll share the inspection report and photos. Thank you.", "fr": "Parfait. Je partage le rapport et les photos. Merci."}], "writing": {"subject": "Subject: Non‑conformity detected — request for corrective action", "body": "Hello [Name],\n\nDuring inspection, we detected a non‑conformity on batch [batch number]. The parts may not meet the required specifications, so we are temporarily stopping usage until we confirm the root cause.\n\nCould you please share:\n- a short root cause analysis,\n- a corrective action plan (CAPA),\n- and a timeline for implementation?\n\nIf possible, please send an initial update today.\n\nBest regards,\nFabrice", "tips": [{"en": "Use strong-but-polite: need / could you / if possible.", "fr": "Fermeté polie : need / could you / if possible."}, {"en": "Use transitions: therefore, as a result, in the meantime.", "fr": "Transitions : therefore, as a result, in the meantime."}]}, "quizBank": [{"prompt": "Choose the best sentence (professional):", "options": [{"t": "Your parts are terrible. Fix it now.", "ok": false, "why": "Too aggressive."}, {"t": "Could you please share a corrective action plan and a timeline?", "ok": true, "why": "Professional request."}, {"t": "Whatever happens, happens.", "ok": false, "why": "Not professional."}]}], "builderModel": [{"step": 1, "text": "We detected a non‑conformity during inspection on the latest batch."}, {"step": 2, "text": "The parts may not meet specifications, so we are stopping usage until we confirm the root cause."}, {"step": 3, "text": "Could you share a corrective action plan and timeline today? Thank you for your support."}], "fill": {"template": "During {b0}, we detected a {b1}. The parts may not meet the required {b2}, so we are stopping usage. Could you share a {b3} action plan and a {b4}?", "blanks": [{"id": "b0", "options": ["inspection", "vacation", "invention"], "answer": "inspection"}, {"id": "b1", "options": ["non‑conformity", "new company", "nice comment"], "answer": "non‑conformity"}, {"id": "b2", "options": ["specifications", "spectators", "spoons"], "answer": "specifications"}, {"id": "b3", "options": ["corrective", "creative", "collective"], "answer": "corrective"}, {"id": "b4", "options": ["timeline", "tea time", "time line"], "answer": "timeline"}]}, "vocab": [{"icon": "✅", "word": "inspection", "def": "quality check", "fr": "contrôle"}, {"icon": "❌", "word": "non‑conformity", "def": "doesn’t match requirements", "fr": "non‑conformité"}, {"icon": "📏", "word": "specifications", "def": "technical requirements", "fr": "spécifications"}, {"icon": "🧩", "word": "root cause", "def": "main reason of the problem", "fr": "cause racine"}, {"icon": "🛠️", "word": "corrective action plan", "def": "actions to fix and prevent", "fr": "plan d’actions correctives"}]}, {"id": "travel_airport_delay", "cat": "Travel (Airport)", "tags": ["travel", "problem", "call"], "title": "Flight delay — ask for options", "desc": "Ask for boarding time, rebooking, vouchers.", "recommended": 60, "prompt": "Your flight is delayed. Ask the airline about the new boarding time and options (rebooking/vouchers).", "structure": [{"t": "Situation", "en": "My flight is delayed and I’d like to check the updated boarding time.", "fr": "Mon vol est retardé et je voudrais l’heure d’embarquement mise à jour."}, {"t": "Condition + options", "en": "If the delay is long, could you tell me about rebooking options or vouchers?", "fr": "Si le retard est long, pouvez-vous expliquer les options (rebooking/vouchers) ?"}, {"t": "Close", "en": "Thank you for your help. Could you confirm by email, please?", "fr": "Merci. Pouvez-vous confirmer par email ?"}], "dialogue": [{"sp": "Examiner", "en": "How can I help you?", "fr": "Comment puis‑je vous aider ?"}, {"sp": "Fabrice", "en": "Hello. My flight is delayed and I’d like to check the updated boarding time, please.", "fr": "Bonjour. Mon vol est retardé, je voudrais l’heure d’embarquement."}, {"sp": "Examiner", "en": "The new boarding time is 18:10.", "fr": "Nouvelle heure d’embarquement : 18h10."}, {"sp": "Fabrice", "en": "Thank you. If the delay becomes longer, could you tell me about rebooking options or vouchers?", "fr": "Merci. Si le retard augmente, pouvez-vous me dire pour un rebooking ou des vouchers ?"}, {"sp": "Examiner", "en": "Yes, we can rebook if needed.", "fr": "Oui, on peut rebooker si besoin."}, {"sp": "Fabrice", "en": "Perfect. Could you confirm the options by email, please?", "fr": "Parfait. Pouvez-vous confirmer par email ?"}], "writing": {"subject": "Subject: Flight delay — request for options", "body": "Hello,\n\nMy flight is currently delayed. Could you please confirm the updated boarding time?\n\nIf the delay is extended, could you also confirm the available options (rebooking and/or vouchers)?\n\nThank you for your support.\n\nBest regards,\nFabrice", "tips": [{"en": "Use 1st conditional for real future: If the delay is extended, I’ll…", "fr": "1st conditional : If the delay is extended, I’ll…"}, {"en": "Polite requests: Could you please… / Would it be possible to…", "fr": "Demandes polies : Could you please… / Would it be possible to…"}]}, "quizBank": [{"prompt": "Choose the best request:", "options": [{"t": "Tell me the time now.", "ok": false, "why": "Too direct."}, {"t": "Could you please confirm the updated boarding time?", "ok": true, "why": "Polite and clear."}, {"t": "You are late.", "ok": false, "why": "Not a request."}]}], "builderModel": [{"step": 1, "text": "My flight is delayed and I’d like to confirm the updated boarding time."}, {"step": 2, "text": "If the delay is extended, could you tell me about rebooking options or vouchers?"}, {"step": 3, "text": "Thank you for your help. Could you confirm by email, please?"}], "fill": {"template": "My flight is {b0}. Could you {b1} confirm the updated {b2} time? If the delay is long, could you explain {b3} options or {b4}?", "blanks": [{"id": "b0", "options": ["delayed", "deleted", "delighted"], "answer": "delayed"}, {"id": "b1", "options": ["please", "pleas", "pleased"], "answer": "please"}, {"id": "b2", "options": ["boarding", "boring", "board"], "answer": "boarding"}, {"id": "b3", "options": ["rebooking", "rebaking", "rebuilding"], "answer": "rebooking"}, {"id": "b4", "options": ["vouchers", "vochers", "vectors"], "answer": "vouchers"}]}, "vocab": [{"icon": "🛫", "word": "boarding time", "def": "time you enter the plane", "fr": "heure d’embarquement"}, {"icon": "🔁", "word": "rebooking", "def": "changing to another flight", "fr": "rebooking"}, {"icon": "🧾", "word": "voucher", "def": "coupon for food/hotel", "fr": "bon / voucher"}, {"icon": "📢", "word": "update", "def": "new information", "fr": "mise à jour"}, {"icon": "🙏", "word": "thank you for your support", "def": "polite closing", "fr": "merci pour votre aide"}]}, {"id": "hotel_noise", "cat": "Hotel", "tags": ["travel", "hotel", "problem", "call"], "title": "Hotel noise — request a room change", "desc": "Complain politely and ask for a quieter room.", "recommended": 60, "prompt": "Your room is noisy. Call reception, explain the problem politely, and ask for a quieter room or solution.", "structure": [{"t": "Polite opener", "en": "Hello, I’m sorry to bother you, but my room is very noisy.", "fr": "Bonjour, désolé de vous déranger, mais ma chambre est très bruyante."}, {"t": "Detail + request", "en": "I can hear loud music from the street. If possible, could I change rooms?", "fr": "J’entends de la musique forte. Si possible, puis-je changer de chambre ?"}, {"t": "Close", "en": "Thank you for your help. What time can I switch rooms?", "fr": "Merci. À quelle heure puis-je changer ?"}], "dialogue": [{"sp": "Examiner", "en": "Reception, how can I help?", "fr": "Réception, je vous écoute."}, {"sp": "Fabrice", "en": "Hello, I’m sorry to bother you, but my room is very noisy.", "fr": "Bonjour, désolé de vous déranger, mais ma chambre est très bruyante."}, {"sp": "Examiner", "en": "What’s the issue?", "fr": "Quel est le souci ?"}, {"sp": "Fabrice", "en": "I can hear loud music from the street and I can’t sleep.", "fr": "J’entends de la musique forte et je n’arrive pas à dormir."}, {"sp": "Examiner", "en": "We can offer earplugs.", "fr": "On peut proposer des bouchons d’oreille."}, {"sp": "Fabrice", "en": "Thank you, but if possible, I’d prefer a quieter room away from the street.", "fr": "Merci, mais si possible je préfère une chambre plus calme."}, {"sp": "Examiner", "en": "We can move you to the courtyard side.", "fr": "On peut vous déplacer côté cour."}, {"sp": "Fabrice", "en": "Perfect. What time can I switch rooms? Thank you.", "fr": "Parfait. À quelle heure puis-je changer ? Merci."}], "writing": {"subject": "Subject: Request for a quieter room (noise issue)", "body": "Hello,\n\nI’m currently staying in room [number]. Unfortunately, it is very noisy (loud music from the street), and I’m having difficulty sleeping.\n\nIf possible, could you move me to a quieter room away from the street?\n\nThank you for your help.\n\nBest regards,\nFabrice", "tips": [{"en": "Use soft language: unfortunately, if possible, I’d prefer…", "fr": "Langage doux : unfortunately, if possible, I’d prefer…"}, {"en": "Use prepositions: away from / next to / on the street / in the courtyard.", "fr": "Prépositions : away from / next to / on the street / in the courtyard."}]}, "quizBank": [{"prompt": "Choose the best opener:", "options": [{"t": "Your hotel is terrible.", "ok": false, "why": "Too negative."}, {"t": "I’m sorry to bother you, but my room is very noisy.", "ok": true, "why": "Polite + clear."}, {"t": "Fix it.", "ok": false, "why": "Too direct."}]}], "builderModel": [{"step": 1, "text": "I’m sorry to bother you, but my room is very noisy."}, {"step": 2, "text": "I can hear loud music from the street. If possible, could I change rooms?"}, {"step": 3, "text": "Thank you for your help. What time can I switch rooms?"}], "fill": {"template": "I’m sorry to {b0} you, but my room is very {b1}. I can hear loud music from the {b2}. If possible, could I change {b3}? Thank you for your {b4}.", "blanks": [{"id": "b0", "options": ["bother", "butter", "brother"], "answer": "bother"}, {"id": "b1", "options": ["noisy", "nosy", "easy"], "answer": "noisy"}, {"id": "b2", "options": ["street", "sheet", "seat"], "answer": "street"}, {"id": "b3", "options": ["rooms", "rumors", "rulers"], "answer": "rooms"}, {"id": "b4", "options": ["help", "helm", "heap"], "answer": "help"}]}, "vocab": [{"icon": "🔊", "word": "noisy", "def": "with a lot of sound", "fr": "bruyant"}, {"icon": "😴", "word": "I can’t sleep", "def": "I’m unable to sleep", "fr": "je n’arrive pas à dormir"}, {"icon": "↔️", "word": "to switch rooms", "def": "change to another room", "fr": "changer de chambre"}, {"icon": "🚪", "word": "away from the street", "def": "not facing the street", "fr": "loin de la rue"}, {"icon": "🙏", "word": "thank you for your help", "def": "polite closing", "fr": "merci pour votre aide"}]}, {"id": "news_discussion", "cat": "News", "tags": ["discussion", "news", "opinion"], "title": "News discussion — give an opinion", "desc": "Use transitions + modals to sound natural.", "recommended": 60, "prompt": "Discuss a news topic with an opinion. Give two arguments and a short example. Use transitions (however, on the other hand…).", "structure": [{"t": "Opinion", "en": "In my opinion, this is a positive change overall.", "fr": "À mon avis, c’est globalement positif."}, {"t": "2 points", "en": "First…, however… On the other hand…", "fr": "D’abord…, cependant… D’un autre côté…"}, {"t": "Close", "en": "So to sum up, the key point is…", "fr": "En résumé, le point clé est…"}], "dialogue": [{"sp": "Examiner", "en": "Tell me about a recent topic you found interesting in the news.", "fr": "Parlez d’un sujet d’actualité intéressant."}, {"sp": "Fabrice", "en": "Recently, I read about new technology being used to improve safety and efficiency at work.", "fr": "Récemment, j’ai lu sur de nouvelles technologies pour améliorer la sécurité et l’efficacité."}, {"sp": "Examiner", "en": "What’s your opinion?", "fr": "Votre avis ?"}, {"sp": "Fabrice", "en": "Overall, I think it can be positive. However, companies should protect personal data and train employees properly.", "fr": "Globalement positif. Cependant, il faut protéger les données et former les employés."}, {"sp": "Examiner", "en": "Can you give an example?", "fr": "Un exemple ?"}, {"sp": "Fabrice", "en": "For example, sensors could detect risks early, but only if the system is reliable and well‑maintained.", "fr": "Par exemple, des capteurs peuvent détecter tôt, mais seulement si le système est fiable."}], "writing": {"subject": "Short opinion paragraph (news)", "body": "In my opinion, using technology to improve safety at work is a positive change overall. First, it can help detect risks early and reduce accidents. However, companies should protect personal data and train employees properly. For example, sensors could warn teams before a machine failure, but only if the system is reliable. To sum up, technology can be very useful, as long as it is used responsibly.", "tips": [{"en": "Use transitions: first, however, for example, to sum up.", "fr": "Transitions : first, however, for example, to sum up."}, {"en": "Use modals for nuance: could / might / should.", "fr": "Nuance : could / might / should."}]}, "quizBank": [{"prompt": "Choose the best transition:", "options": [{"t": "However, companies should protect personal data.", "ok": true, "why": "Good contrast connector."}, {"t": "Because anyway.", "ok": false, "why": "Not a clear connector."}, {"t": "Yesterdayly.", "ok": false, "why": "Not a word."}]}], "builderModel": [{"step": 1, "text": "In my opinion, this is a positive change overall."}, {"step": 2, "text": "First, it can improve safety. However, companies should protect data and train employees."}, {"step": 3, "text": "For example…, so to sum up…, it should be used responsibly."}], "fill": {"template": "{b0}, I think it can be positive. {b1}, it may improve safety. {b2}, companies should protect data. {b3}, sensors could detect risks early. {b4}, it should be used responsibly.", "blanks": [{"id": "b0", "options": ["Overall", "Overhall", "Over all"], "answer": "Overall"}, {"id": "b1", "options": ["First", "Fast", "Furst"], "answer": "First"}, {"id": "b2", "options": ["However", "How ever", "Havever"], "answer": "However"}, {"id": "b3", "options": ["For example", "As example", "For sample"], "answer": "For example"}, {"id": "b4", "options": ["To sum up", "To sum it", "To some up"], "answer": "To sum up"}]}, "vocab": [{"icon": "📰", "word": "news topic", "def": "a subject in the news", "fr": "sujet d’actualité"}, {"icon": "⚖️", "word": "overall", "def": "in general", "fr": "globalement"}, {"icon": "🛡️", "word": "to protect data", "def": "keep information safe", "fr": "protéger les données"}, {"icon": "🧠", "word": "to train employees", "def": "teach staff skills", "fr": "former les employés"}, {"icon": "🔧", "word": "reliable", "def": "dependable / works well", "fr": "fiable"}]}, {"id": "movies_review", "cat": "Movies", "tags": ["discussion", "movies", "opinion", "fun"], "title": "Movies — review + superlatives", "desc": "Use comparatives/superlatives + reasons.", "recommended": 45, "prompt": "Talk about a film you enjoyed and compare it to another one. Use comparatives and superlatives.", "structure": [{"t": "Recommendation", "en": "I’d recommend it because it’s…", "fr": "Je le recommande parce que…"}, {"t": "Compare", "en": "It was more… than… / The best part was…", "fr": "Plus… que… / Le meilleur moment était…"}, {"t": "Close", "en": "If you like…, you’ll probably enjoy it.", "fr": "Si tu aimes…, tu aimeras probablement."}], "dialogue": [{"sp": "Examiner", "en": "Tell me about a film you watched recently.", "fr": "Parlez d’un film récent."}, {"sp": "Fabrice", "en": "Recently, I watched a film that was really engaging and well‑acted.", "fr": "J’ai vu un film très prenant et bien joué."}, {"sp": "Examiner", "en": "Would you recommend it?", "fr": "Vous le recommandez ?"}, {"sp": "Fabrice", "en": "Yes. The story was more realistic than I expected, and the best part was the ending.", "fr": "Oui. L’histoire était plus réaliste que prévu, et le meilleur moment était la fin."}, {"sp": "Examiner", "en": "Why did you like it?", "fr": "Pourquoi ?"}, {"sp": "Fabrice", "en": "Because the characters were believable and the pace was fast, so I never got bored.", "fr": "Parce que les personnages étaient crédibles et le rythme rapide."}], "writing": {"subject": "Short review paragraph (movie)", "body": "I recently watched a film that was more realistic than I expected. The acting was excellent, and the best part was the ending. The pace was fast, so I never got bored. If you like suspense and believable characters, you’ll probably enjoy it.", "tips": [{"en": "Comparatives: more + adjective + than (more realistic than…).", "fr": "Comparatif : more + adj + than."}, {"en": "Superlatives: the best / the worst / the most + adjective.", "fr": "Superlatif : the best / the most + adj."}]}, "quizBank": [{"prompt": "Choose the correct superlative:", "options": [{"t": "The best part was the ending.", "ok": true, "why": "Correct."}, {"t": "The goodest part was the ending.", "ok": false, "why": "Use best, not goodest."}, {"t": "The more best part…", "ok": false, "why": "Not correct."}]}], "builderModel": [{"step": 1, "text": "I’d recommend it because it’s engaging and well‑acted."}, {"step": 2, "text": "It was more realistic than I expected, and the best part was the ending."}, {"step": 3, "text": "If you like suspense, you’ll probably enjoy it."}], "fill": {"template": "I watched a film that was {b0} realistic than I expected. The {b1} part was the ending. The pace was {b2}, so I never got {b3}. I’d {b4} it.", "blanks": [{"id": "b0", "options": ["more", "most", "many"], "answer": "more"}, {"id": "b1", "options": ["best", "goodest", "better"], "answer": "best"}, {"id": "b2", "options": ["fast", "fasterly", "fastly"], "answer": "fast"}, {"id": "b3", "options": ["bored", "board", "boring"], "answer": "bored"}, {"id": "b4", "options": ["recommend", "recommand", "recommending"], "answer": "recommend"}]}, "vocab": [{"icon": "🎬", "word": "acting", "def": "performance by actors", "fr": "jeu d’acteur"}, {"icon": "⏱️", "word": "pace", "def": "speed/rhythm of the film", "fr": "rythme"}, {"icon": "😮", "word": "engaging", "def": "interesting / captivating", "fr": "prenant"}, {"icon": "🧩", "word": "believable", "def": "realistic / credible", "fr": "crédible"}, {"icon": "🏆", "word": "the best part", "def": "the most enjoyable part", "fr": "le meilleur moment"}]}, {"id": "travel_planning_itinerary", "cat": "Travel (Planning)", "tags": ["travel", "planning", "email"], "title": "Travel plan — choose the best option", "desc": "Explain your plan, preferences and ask for recommendations.", "recommended": 60, "prompt": "You are planning a trip. Explain what you want (dates, budget, activities) and ask for recommendations (hotel + transport).", "structure": [{"t": "Plan + dates", "en": "I’m planning a trip next month and I’d like to finalise my itinerary.", "fr": "Je prépare un voyage le mois prochain et je veux finaliser l’itinéraire."}, {"t": "Preferences", "en": "I’d prefer a well‑located hotel and easy transport (train/airport).", "fr": "Je préfère un hôtel bien situé et un transport facile."}, {"t": "Request + close", "en": "Could you recommend the best option within my budget? Thank you.", "fr": "Pouvez-vous recommander la meilleure option dans mon budget ? Merci."}], "dialogue": [{"sp": "Examiner", "en": "What kind of trip are you planning?", "fr": "Quel type de voyage ?"}, {"sp": "Fabrice", "en": "I’m planning a trip next month. I want to visit a few places and keep the schedule simple.", "fr": "Je prépare un voyage le mois prochain. Je veux visiter quelques endroits et garder un planning simple."}, {"sp": "Examiner", "en": "What are your priorities?", "fr": "Vos priorités ?"}, {"sp": "Fabrice", "en": "Location is the most important. I’d prefer a hotel close to public transport.", "fr": "L’emplacement est le plus important. Je préfère un hôtel proche des transports."}, {"sp": "Examiner", "en": "Do you have a budget?", "fr": "Un budget ?"}, {"sp": "Fabrice", "en": "Yes, around [amount] per night. Could you recommend the best option in that range?", "fr": "Oui, environ [montant] par nuit. Pouvez-vous recommander la meilleure option ?"}], "writing": {"subject": "Subject: Travel planning — request for recommendations", "body": "Hello,\n\nI’m planning a trip for [dates] and I’d like to finalise my itinerary. My main priorities are a well‑located hotel, easy public transport access, and a calm area.\n\nMy budget is around [amount] per night. Could you please recommend the best hotel options and the easiest way to get from the airport/train station?\n\nThank you in advance.\n\nBest regards,\nFabrice", "tips": [{"en": "Use superlatives: the best / the easiest / the most convenient.", "fr": "Superlatifs : the best / the easiest / the most convenient."}, {"en": "Use prepositions: close to / near / in the city center / on the left.", "fr": "Prépositions : close to / near / in the city center."}]}, "quizBank": [{"prompt": "Choose the best phrase to express priorities:", "options": [{"t": "My main priorities are location and easy transport.", "ok": true, "why": "Clear and natural."}, {"t": "I priority location.", "ok": false, "why": "Missing verb."}, {"t": "Priorities is location.", "ok": false, "why": "Grammar mistake."}]}], "builderModel": [{"step": 1, "text": "I’m planning a trip next month and I’d like to finalise my itinerary."}, {"step": 2, "text": "My priorities are a well‑located hotel and easy access to public transport."}, {"step": 3, "text": "Could you recommend the best option within my budget? Thank you in advance."}], "fill": {"template": "I’m {b0} a trip next month and I’d like to {b1} my itinerary. I’d prefer a hotel {b2} to public transport. Could you recommend the {b3} option within my {b4}?", "blanks": [{"id": "b0", "options": ["planning", "playing", "planting"], "answer": "planning"}, {"id": "b1", "options": ["finalise", "finishly", "finally"], "answer": "finalise"}, {"id": "b2", "options": ["close", "closed", "closing"], "answer": "close"}, {"id": "b3", "options": ["best", "goodest", "better"], "answer": "best"}, {"id": "b4", "options": ["budget", "bucket", "bugget"], "answer": "budget"}]}, "vocab": [{"icon": "🗺️", "word": "itinerary", "def": "travel plan / schedule", "fr": "itinéraire"}, {"icon": "📍", "word": "well‑located", "def": "in a good location", "fr": "bien situé"}, {"icon": "🚇", "word": "public transport", "def": "metro/bus/train", "fr": "transports en commun"}, {"icon": "🧾", "word": "budget", "def": "money limit", "fr": "budget"}, {"icon": "⭐", "word": "most convenient", "def": "easiest/best for you", "fr": "le plus pratique"}]}, {"id": "airport_lost_luggage", "cat": "Travel (Airport)", "tags": ["travel", "problem", "complaint"], "title": "Lost luggage — file a report", "desc": "Explain the situation and request next steps clearly.", "recommended": 60, "prompt": "Your luggage didn’t arrive. Speak to the airline desk: give details, file a report, and ask what will happen next.", "structure": [{"t": "Problem + detail", "en": "My luggage didn’t arrive. It’s a black suitcase with a red tag.", "fr": "Mon bagage n’est pas arrivé. Valise noire avec étiquette rouge."}, {"t": "Request", "en": "Could you help me file a report and tell me when it will be delivered?", "fr": "Pouvez-vous m’aider à faire une déclaration et me dire quand il sera livré ?"}, {"t": "Close", "en": "Thank you. Could you confirm the reference number by email?", "fr": "Merci. Pouvez-vous confirmer le numéro de dossier par email ?"}], "dialogue": [{"sp": "Examiner", "en": "How can I help you?", "fr": "Comment puis‑je vous aider ?"}, {"sp": "Fabrice", "en": "Hello. My luggage didn’t arrive on the carousel.", "fr": "Bonjour. Mon bagage n’est pas arrivé sur le tapis."}, {"sp": "Examiner", "en": "Can you describe it?", "fr": "Pouvez-vous le décrire ?"}, {"sp": "Fabrice", "en": "Yes, it’s a black suitcase with a red tag, and my name is on the label.", "fr": "Oui, valise noire avec étiquette rouge, mon nom est sur l’étiquette."}, {"sp": "Examiner", "en": "We’ll file a report. Where are you staying?", "fr": "On fait un dossier. Où logez-vous ?"}, {"sp": "Fabrice", "en": "I’m staying at [hotel]. Could you tell me the delivery timeframe, please?", "fr": "Je loge à [hôtel]. Pouvez-vous me dire le délai de livraison ?"}], "writing": {"subject": "Subject: Lost luggage report — request for update", "body": "Hello,\n\nMy luggage did not arrive on flight [number] on [date]. It is a black suitcase with a red tag. I have filed a report under reference [reference].\n\nCould you please confirm the expected delivery timeframe and any next steps?\n\nThank you for your help.\n\nBest regards,\nFabrice", "tips": [{"en": "Use past simple: did not arrive / I filed a report.", "fr": "Past simple : did not arrive / I filed a report."}, {"en": "Use polite requests: could you please…", "fr": "Demande polie : could you please…"}]}, "quizBank": [{"prompt": "Choose the best sentence for a report:", "options": [{"t": "My luggage didn’t arrive on the carousel.", "ok": true, "why": "Clear and correct."}, {"t": "My luggage no arrive.", "ok": false, "why": "Grammar."}, {"t": "Luggage is disappear.", "ok": false, "why": "Not natural."}]}], "builderModel": [{"step": 1, "text": "My luggage didn’t arrive. It’s a black suitcase with a red tag."}, {"step": 2, "text": "Could you help me file a report and tell me when it will be delivered?"}, {"step": 3, "text": "Thank you. Could you confirm the reference number by email?"}], "fill": {"template": "My {b0} didn’t {b1}. It’s a black {b2} with a red {b3}. Could you help me file a {b4}?", "blanks": [{"id": "b0", "options": ["luggage", "language", "lawn"], "answer": "luggage"}, {"id": "b1", "options": ["arrive", "arrival", "arrived"], "answer": "arrive"}, {"id": "b2", "options": ["suitcase", "software", "soup"], "answer": "suitcase"}, {"id": "b3", "options": ["tag", "tack", "take"], "answer": "tag"}, {"id": "b4", "options": ["report", "repeat", "repair"], "answer": "report"}]}, "vocab": [{"icon": "🧳", "word": "suitcase", "def": "travel bag", "fr": "valise"}, {"icon": "🏷️", "word": "tag", "def": "label on luggage", "fr": "étiquette"}, {"icon": "📝", "word": "to file a report", "def": "make an official statement", "fr": "faire une déclaration"}, {"icon": "📦", "word": "delivery timeframe", "def": "when it will be delivered", "fr": "délai de livraison"}, {"icon": "🔢", "word": "reference number", "def": "case ID", "fr": "numéro de dossier"}]}, {"id": "hotel_booking_change", "cat": "Hotel", "tags": ["travel", "hotel", "email"], "title": "Change a booking — new dates", "desc": "Request a change politely and ask for confirmation.", "recommended": 45, "prompt": "You need to change your hotel reservation dates. Explain the reason and ask for confirmation (price, availability).", "structure": [{"t": "Context", "en": "I have a reservation and I need to change the dates.", "fr": "J’ai une réservation et je dois changer les dates."}, {"t": "Details", "en": "It’s currently from [date] to [date]. I’d like to move it to [new dates].", "fr": "C’est du… au… Je voudrais déplacer au…"}, {"t": "Request", "en": "Could you confirm availability and the updated price, please?", "fr": "Pouvez-vous confirmer la disponibilité et le nouveau prix ?"}], "dialogue": [{"sp": "Examiner", "en": "How can I help?", "fr": "Je vous écoute."}, {"sp": "Fabrice", "en": "Hello. I have a reservation and I need to change the dates, please.", "fr": "Bonjour. J’ai une réservation et je dois changer les dates."}, {"sp": "Examiner", "en": "What are the new dates?", "fr": "Quelles sont les nouvelles dates ?"}, {"sp": "Fabrice", "en": "I’d like to move it to [new dates]. Could you confirm availability and the updated price?", "fr": "Je voudrais déplacer aux [nouvelles dates]. Pouvez-vous confirmer disponibilité et prix ?"}], "writing": {"subject": "Subject: Reservation change request", "body": "Hello,\n\nI have a reservation under the name [Name], currently from [old dates]. I would like to change it to [new dates], if possible.\n\nCould you please confirm availability and the updated total price?\n\nThank you in advance.\n\nBest regards,\nFabrice", "tips": [{"en": "Use ‘under the name…’ and ‘if possible’.", "fr": "Utilise ‘under the name…’ et ‘if possible’."}, {"en": "Close with a clear request: confirm availability + price.", "fr": "Demande claire : disponibilité + prix."}]}, "quizBank": [{"prompt": "Choose the best polite phrase:", "options": [{"t": "I want you change my booking.", "ok": false, "why": "Too direct/incorrect."}, {"t": "I would like to change my reservation dates, if possible.", "ok": true, "why": "Polite and correct."}, {"t": "Change it now.", "ok": false, "why": "Too direct."}]}], "builderModel": [{"step": 1, "text": "I have a reservation and I would like to change the dates, if possible."}, {"step": 2, "text": "It’s currently from [old dates] and I’d like to move it to [new dates]."}, {"step": 3, "text": "Could you confirm availability and the updated price, please? Thank you."}], "fill": {"template": "I have a {b0} under the name [Name]. I’d like to {b1} the dates to [new dates], if {b2}. Could you {b3} availability and the updated {b4}?", "blanks": [{"id": "b0", "options": ["reservation", "resolution", "resurrection"], "answer": "reservation"}, {"id": "b1", "options": ["change", "chance", "charge"], "answer": "change"}, {"id": "b2", "options": ["possible", "possibly", "possibility"], "answer": "possible"}, {"id": "b3", "options": ["confirm", "consume", "confuse"], "answer": "confirm"}, {"id": "b4", "options": ["price", "prize", "press"], "answer": "price"}]}, "vocab": [{"icon": "📅", "word": "reservation dates", "def": "booking dates", "fr": "dates de réservation"}, {"icon": "🧾", "word": "total price", "def": "full cost", "fr": "prix total"}, {"icon": "✅", "word": "availability", "def": "if a room is free", "fr": "disponibilité"}, {"icon": "👤", "word": "under the name…", "def": "in the name of…", "fr": "au nom de…"}, {"icon": "🙏", "word": "if possible", "def": "if it can be done", "fr": "si possible"}]}], "grammar_cards": [{"id": "present_simple", "title": "Present Simple (habits / facts)", "rule_en": "Base verb (+s for he/she/it). Use for habits, routines, facts.", "rule_fr": "Base du verbe (+s). Habitudes, routines, faits.", "keywords": "always • usually • often • every day • in general", "formation": [{"en": "I work. He works.", "fr": "Base (+s)."}, {"en": "I don’t work. He doesn’t work.", "fr": "don’t/doesn’t + base."}, {"en": "Do you work? Does he work?", "fr": "Do/Does + base ?"}], "examples": [{"en": "I usually check the schedule before the meeting.", "fr": "Je vérifie généralement le planning."}]}, {"id": "present_continuous", "title": "Present Continuous (now / temporary)", "rule_en": "am/is/are + verb‑ing.", "rule_fr": "am/is/are + -ing.", "keywords": "now • currently • at the moment", "formation": [{"en": "I’m calling to follow up…", "fr": "Je suis en train de…"}, {"en": "I’m not…", "fr": "am/is/are not"}, {"en": "Are you…?", "fr": "Am/Is/Are + sujet ?"}], "examples": [{"en": "We’re working on a corrective action plan.", "fr": "On travaille sur un plan d’actions."}]}, {"id": "past_simple", "title": "Past Simple (finished past)", "rule_en": "Verb‑ed or irregular form.", "rule_fr": "-ed ou irrégulier.", "keywords": "yesterday • last week • ago", "formation": [{"en": "I sent / I went / I was.", "fr": "V2."}, {"en": "I didn’t + base.", "fr": "didn’t + base."}, {"en": "Did you + base?", "fr": "Did + base ?"}], "examples": [{"en": "I filed a report yesterday.", "fr": "J’ai fait une déclaration hier."}]}, {"id": "present_perfect", "title": "Present Perfect (result / experience)", "rule_en": "have/has + V3.", "rule_fr": "have/has + V3.", "keywords": "already • yet • just • recently", "formation": [{"en": "I have sent…", "fr": "have + V3."}, {"en": "I haven’t…", "fr": "haven’t + V3."}, {"en": "Have you…?", "fr": "Have + V3 ?"}], "examples": [{"en": "I haven’t received a reply yet.", "fr": "Je n’ai pas encore reçu de réponse."}]}, {"id": "future", "title": "Future: will vs going to", "rule_en": "will (decision/prediction) vs going to (plan/evidence).", "rule_fr": "will vs going to.", "keywords": "tomorrow • next week • soon", "formation": [{"en": "I will send it now.", "fr": "will + base."}, {"en": "I’m going to travel next month.", "fr": "be going to + base."}, {"en": "I won’t / I’m not going to…", "fr": "won’t / not going to."}], "examples": [{"en": "If the delay is extended, I’ll ask for options.", "fr": "Si le retard augmente, je demanderai des options."}]}, {"id": "conditionals", "title": "Conditionals (what would you do if…?)", "rule_en": "If + past, would + base.", "rule_fr": "If + past, would + base.", "keywords": "If I were you… • If I lost… I would…", "formation": [{"en": "If I were you, I’d…", "fr": "Conseil."}, {"en": "If I lost my passport, I’d…", "fr": "Hypothèse."}, {"en": "If I had…, I would have…", "fr": "Regret."}], "examples": [{"en": "If I were you, I’d request confirmation by email.", "fr": "À ta place, je demanderais une confirmation par email."}]}], "modal_rules": {"intro_en": "Modals make you sound polite and precise.", "intro_fr": "Les modaux rendent ton anglais plus poli et précis.", "items": [{"m": "could", "use_en": "polite request", "use_fr": "demande polie", "ex_en": "Could you confirm the date, please?", "ex_fr": "Pouvez‑vous confirmer la date ?"}, {"m": "would", "use_en": "preference", "use_fr": "préférence", "ex_en": "I would prefer a quieter room.", "ex_fr": "Je préférerais une chambre plus calme."}, {"m": "should", "use_en": "advice", "use_fr": "conseil", "ex_en": "You should double‑check the address.", "ex_fr": "Tu devrais revérifier l’adresse."}, {"m": "must", "use_en": "strong obligation", "use_fr": "obligation", "ex_en": "We must stop usage until we confirm the root cause.", "ex_fr": "Nous devons arrêter l’usage…"}, {"m": "might", "use_en": "uncertainty", "use_fr": "incertitude", "ex_en": "The delay might impact the schedule.", "ex_fr": "Le retard pourrait impacter…"}], "practice": [{"q": "___ you please confirm availability? (polite)", "a": "Could", "opts": ["Can", "Could", "Must"], "why": "Could = more polite."}, {"q": "I ___ prefer a room away from the street. (preference)", "a": "would", "opts": ["would", "should", "must"], "why": "would prefer = polite preference."}, {"q": "The delay ___ impact production. (uncertain)", "a": "might", "opts": ["might", "must", "have to"], "why": "might = possibility."}]}, "prep_rules": {"time_place": [{"q": "The meeting is ___ Monday.", "a": "on", "opts": ["in", "on", "at"], "why": "on + days"}, {"q": "I arrive ___ 18:10.", "a": "at", "opts": ["in", "on", "at"], "why": "at + time"}, {"q": "We are ___ the airport.", "a": "at", "opts": ["at", "in", "on"], "why": "at + point/place"}, {"q": "The hotel is ___ the city center.", "a": "in", "opts": ["in", "on", "at"], "why": "in + area"}], "movement": [{"q": "I’m going ___ Paris.", "a": "to", "opts": ["to", "into", "at"], "why": "to + destination"}, {"q": "We walked ___ the room.", "a": "into", "opts": ["into", "to", "on"], "why": "into = inside"}, {"q": "The hotel is next ___ the station.", "a": "to", "opts": ["to", "at", "on"], "why": "next to"}, {"q": "Please reply ___ email.", "a": "by", "opts": ["by", "until", "for"], "why": "by email"}]}, "connector_bank": [{"icon": "✅", "en": "First of all,", "fr": "Tout d’abord,"}, {"icon": "⚖️", "en": "However,", "fr": "Cependant,"}, {"icon": "💡", "en": "For example,", "fr": "Par exemple,"}, {"icon": "🏁", "en": "To sum up,", "fr": "En résumé,"}], "superlative_practice": [{"q": "This hotel is ___ (comfortable) than the last one.", "a": "more comfortable", "opts": ["more comfortable", "comfortabler", "the most comfortable"], "why": "comparative: more + adjective + than"}, {"q": "That was the ___ (good) part of the movie.", "a": "best", "opts": ["best", "goodest", "better"], "why": "superlative: best"}, {"q": "This is the ___ (convenient) option.", "a": "most convenient", "opts": ["most convenient", "more convenient", "convenienter"], "why": "superlative: most + adjective"}, {"q": "My flight was ___ (late) than expected.", "a": "later", "opts": ["later", "latest", "more late"], "why": "comparative: later"}], "global_vocab": [{"icon": "🤝", "word": "follow up", "def": "contact again for an update", "fr": "relancer"}, {"icon": "🧩", "word": "root cause", "def": "main reason of a problem", "fr": "cause racine"}, {"icon": "🗓️", "word": "schedule", "def": "planned timing", "fr": "planning"}, {"icon": "🧾", "word": "invoice", "def": "bill for payment", "fr": "facture"}, {"icon": "🛂", "word": "passport control", "def": "immigration check", "fr": "contrôle passeport"}, {"icon": "🏨", "word": "check‑in", "def": "arrival process at hotel", "fr": "enregistrement"}, {"icon": "⭐", "word": "most convenient", "def": "easiest/best for you", "fr": "le plus pratique"}]};


  function $(sel, root){ return (root||document).querySelector(sel); }
  function $all(sel, root){ return Array.from((root||document).querySelectorAll(sel)); }
  function shuffle(arr){
    var a = arr.slice();
    for (var i=a.length-1;i>0;i--){
      var j = Math.floor(Math.random()*(i+1));
      var t=a[i]; a[i]=a[j]; a[j]=t;
    }
    return a;
  }
  function escapeHtml(s){
    return String(s).replace(/[&<>"']/g, function(m){
      return ({ "&":"&amp;","<":"&lt;",">":"&gt;", '"':"&quot;","'":"&#039;" })[m];
    });
  }

  // LocalStorage
  var LS = {
    get:function(k, fb){ try{ var v=localStorage.getItem(k); return v===null?fb:JSON.parse(v); }catch(e){ return fb; } },
    set:function(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} },
    del:function(k){ try{ localStorage.removeItem(k); }catch(e){} }
  };
  var KEY = { state:"se_fabrice_final_state_v1", score:"se_fabrice_final_score_v1", notes:"se_fabrice_final_notes_v1" };
  var state = LS.get(KEY.state, { activeScenarioId:null, mastered:{}, awarded:{ quiz:{}, builder:{}, fill:{}, preps:false, super:false, modals:false }, builderStates:{} });
  var scoreState = LS.get(KEY.score, { score:0 });

  function setScore(n){
    scoreState.score = n;
    LS.set(KEY.score, scoreState);
    $("#scoreTop").textContent = String(n);
    $("#scoreBottom").textContent = String(n);
  }
  function addScore(d){ setScore(Math.max(0, (scoreState.score||0) + d)); }
  $("#maxTop").textContent = "60";
  $("#maxBottom").textContent = "60";

  function bumpMasteredUI(){
    $("#masteredMax").textContent = String(DATA.scenarios.length);
    var n = Object.keys(state.mastered||{}).filter(function(k){ return !!state.mastered[k]; }).length;
    $("#masteredCount").textContent = String(n);
  }
  bumpMasteredUI();
  setScore(scoreState.score || 0);

  // Speech
  var accentSel = $("#accent");
  var speechSupported = ("speechSynthesis" in window) && ("SpeechSynthesisUtterance" in window);
  function stopSpeech(){ if(!speechSupported) return; try{ window.speechSynthesis.cancel(); }catch(e){} }
  function pickVoice(lang){
    if(!speechSupported) return null;
    var voices = window.speechSynthesis.getVoices ? window.speechSynthesis.getVoices() : [];
    if(!voices || !voices.length) return null;
    var exact = voices.filter(function(v){ return (v.lang||"").toLowerCase() === lang.toLowerCase(); });
    if(exact.length) return exact[0];
    var base = lang.toLowerCase().slice(0,2);
    var partial = voices.filter(function(v){ return (v.lang||"").toLowerCase().indexOf(base)===0; });
    return partial.length ? partial[0] : voices[0];
  }
  function speak(text){
    if(!speechSupported){ alert("Text-to-speech is not available in this browser."); return; }
    stopSpeech();
    var u = new SpeechSynthesisUtterance(String(text||""));
    var lang = accentSel ? accentSel.value : "en-GB";
    u.lang = lang;
    u.rate = 0.98;
    u.pitch = 1.0;
    var v = pickVoice(lang);
    if(v) u.voice = v;
    window.speechSynthesis.speak(u);
  }
  if (speechSupported && window.speechSynthesis) window.speechSynthesis.onvoiceschanged = function(){};
  $("#btnStopSpeech").addEventListener("click", stopSpeech);

  // Nav scroll
  $all("[data-scroll]").forEach(function(btn){
    btn.addEventListener("click", function(){
      var target = btn.getAttribute("data-scroll");
      var el = $(target);
      el && el.scrollIntoView({behavior:"smooth", block:"start"});
    });
  });

  // Timer
  var timerId=null, timerBase=45, timerRemaining=45;
  function setTimer(sec){
    timerBase=sec; timerRemaining=sec;
    $("#timerNum").textContent = String(sec);
  }
  function stopTimer(){ if(timerId){ clearInterval(timerId); timerId=null; } }
  function startTimer(){
    stopTimer();
    timerRemaining = timerBase;
    $("#timerNum").textContent = String(timerRemaining);
    $("#timerFeedback").className = "feedback";
    $("#timerFeedback").textContent = "Speak with structure. Don’t stop early.";
    timerId = setInterval(function(){
      timerRemaining -= 1;
      $("#timerNum").textContent = String(Math.max(0,timerRemaining));
      if(timerRemaining <= 0){
        stopTimer();
        $("#timerFeedback").className = "feedback good";
        $("#timerFeedback").textContent = "✅ Time. Finish with a polite closing sentence.";
        speak("Time. Finish with a polite closing sentence.");
      }
    }, 1000);
  }
  $("#btnStartTimer").addEventListener("click", startTimer);
  $("#btnStopTimer").addEventListener("click", stopTimer);
  $("#btnResetTimer").addEventListener("click", function(){ stopTimer(); setTimer(timerBase); });

  function presetBtn(btnId, sec){
    var b = $(btnId);
    b && b.addEventListener("click", function(){
      $all(".chipbtn").forEach(function(x){ x.classList.remove("is-on"); });
      b.classList.add("is-on");
      setTimer(sec);
    });
  }
  presetBtn("#t30",30); presetBtn("#t45",45); presetBtn("#t60",60); presetBtn("#t90",90);
  setTimer(45);

  // Exam simulator (simple)
  var WARMUP = [
    {q:"Can you introduce yourself and your job at Renault?", m:"I work at Renault in quality. My role is to ensure parts meet specifications and to follow up with suppliers when there is an issue."},
    {q:"What do you enjoy about your work?", m:"I enjoy problem solving and teamwork. I like finding the root cause and improving processes."},
    {q:"Tell me about your travel plans.", m:"I’m planning a trip and I’m going to book flights and hotels. I prefer to plan in advance to avoid stress."},
    {q:"What kind of movies do you like?", m:"I like movies with a strong plot and believable characters. I usually prefer thrillers or dramas."}
  ];
  var DISCUSS = [
    {q:"Discuss a news topic you found interesting. Give two points and an example.", m:"Overall, I think using technology to improve safety is positive. However, companies should protect data. For example, sensors can detect risks early. To sum up, it should be used responsibly."},
    {q:"Which is better: travelling by train or by plane? Why?", m:"In general, trains are more comfortable and less stressful. However, planes are faster for long distances. For example, for international travel, flying is usually the best option."},
    {q:"What makes a hotel ‘the best’ for you?", m:"The best hotel is clean, quiet, and well located. I also value friendly staff and clear communication."}
  ];
  function pickRandom(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
  function newSimulation(){
    var w = pickRandom(WARMUP);
    var s = pickRandom(DATA.scenarios);
    var d = pickRandom(DISCUSS);

    $("#simWarmQ").textContent = w.q;
    $("#simWarmModel").textContent = "Model: " + w.m;
    $("#simRoleQ").textContent = s.prompt;
    $("#simRoleModel").textContent = "Model: " + s.builderModel.map(function(x){ return x.text; }).join(" ");
    $("#simDiscQ").textContent = d.q;
    $("#simDiscModel").textContent = "Model: " + d.m;

    $("#btnListenWarm").onclick = function(){ speak(w.m); };
    $("#btnListenRole").onclick = function(){ speak(s.builderModel.map(function(x){return x.text;}).join(" ")); };
    $("#btnListenDisc").onclick = function(){ speak(d.m); };

    $("#btnTimerWarm").onclick = function(){ $all(".chipbtn").forEach(function(x){x.classList.remove("is-on");}); $("#t45").classList.add("is-on"); setTimer(45); startTimer(); };
    $("#btnTimerRole").onclick = function(){ $all(".chipbtn").forEach(function(x){x.classList.remove("is-on");}); $("#t60").classList.add("is-on"); setTimer(60); startTimer(); };
    $("#btnTimerDisc").onclick = function(){ $all(".chipbtn").forEach(function(x){x.classList.remove("is-on");}); $("#t90").classList.add("is-on"); setTimer(90); startTimer(); };
  }
  $("#btnNewSim").addEventListener("click", newSimulation);
  newSimulation();

  // Warmup bank buttons
  var warmupPhrases = ["Let me introduce myself…","In my role, I’m responsible for…","Overall, I would say…","In my experience…","To be honest…","To sum up…"];
  var warmupBank = $("#warmupBank");
  if(warmupBank){
    warmupPhrases.forEach(function(p){
      var b=document.createElement("button");
      b.type="button"; b.textContent=p;
      b.addEventListener("click", function(){ speak(p); });
      warmupBank.appendChild(b);
    });
  }

  // Scenario selection
  var scenarioSelect = $("#scenarioSelect");
  function populateScenarios(){
    scenarioSelect.innerHTML="";
    DATA.scenarios.forEach(function(s){
      var o=document.createElement("option");
      o.value=s.id;
      o.textContent="🧩 " + s.cat + " — " + s.title;
      scenarioSelect.appendChild(o);
    });
    if(!state.activeScenarioId) state.activeScenarioId = DATA.scenarios[0].id;
    scenarioSelect.value = state.activeScenarioId;
  }
  populateScenarios();
  function getScenario(){
    var id = scenarioSelect.value || state.activeScenarioId || DATA.scenarios[0].id;
    return DATA.scenarios.find(function(s){ return s.id===id; }) || DATA.scenarios[0];
  }

  var showFR = true;
  $("#btnToggleFR").addEventListener("click", function(){ showFR=!showFR; renderScenario(); });

  function renderScenario(){
    var s = getScenario();
    state.activeScenarioId = s.id;
    LS.set(KEY.state, state);

    $("#scenarioMeta").textContent = s.cat + " • " + (s.tags||[]).join(" • ") + " • ⏱ " + (s.recommended||45) + "s";
    $("#scenarioTitle").textContent = s.title;
    $("#scenarioDesc").textContent = s.desc;

    $("#masteredFeedback").className="feedback";
    $("#masteredFeedback").textContent = state.mastered[s.id] ? "Already mastered ✅ Keep practicing with the other accent." : "Not mastered yet. Practice the model + do the exercises, then mark mastered.";

    // Speaking structure
    var struct=$("#structureList");
    struct.innerHTML="";
    (s.structure||[]).forEach(function(it){
      var row=document.createElement("div");
      row.className="srow";
      row.innerHTML = "<strong>"+escapeHtml(it.t)+"</strong><div>"+escapeHtml(it.en)+"</div>" + (showFR ? "<div class='fr'>FR: "+escapeHtml(it.fr||"")+"</div>" : "");
      struct.appendChild(row);
    });

    // Dialogue
    var dwrap=$("#dialogueList");
    dwrap.innerHTML="";
    (s.dialogue||[]).forEach(function(line){
      var row=document.createElement("div"); row.className="line";
      var sp=document.createElement("div"); sp.className="speaker"; sp.textContent=line.sp;
      var tx=document.createElement("div"); tx.className="text";
      tx.innerHTML = escapeHtml(line.en) + (showFR ? "<div class='fr'>FR: "+escapeHtml(line.fr||"")+"</div>" : "");
      var btn=document.createElement("button"); btn.type="button"; btn.className="iconbtn"; btn.textContent="🔊";
      btn.addEventListener("click", function(){ speak(line.en); });
      row.appendChild(sp); row.appendChild(tx); row.appendChild(btn);
      dwrap.appendChild(row);
    });

    // Writing
    var w = s.writing || {subject:"",body:""};
    $("#emailBox").innerHTML = "<div class='subj'>"+escapeHtml(w.subject||"")+"</div><pre>"+escapeHtml(w.body||"")+"</pre>";
    $("#btnCopyEmail").onclick = function(){ copyToClipboard((w.subject||"") + "\n\n" + (w.body||"")); };
    $("#btnListenEmail").onclick = function(){ speak((w.subject||"") + ". " + String(w.body||"").replace(/\n/g," ")); };
    var tips=$("#emailTips"); tips.innerHTML="";
    (w.tips||[]).forEach(function(t){
      var div=document.createElement("div"); div.className="tip";
      div.innerHTML="<div><strong>"+escapeHtml(t.en)+"</strong></div>" + (showFR ? "<div class='fr'>FR: "+escapeHtml(t.fr||"")+"</div>" : "");
      tips.appendChild(div);
    });

    // Listen all
    $("#btnListenAll").onclick = function(){
      var parts=[];
      parts.push(s.title+".");
      (s.structure||[]).forEach(function(it){ parts.push(it.en); });
      (s.dialogue||[]).forEach(function(l){ parts.push(l.en); });
      parts.push(w.subject); parts.push(String(w.body||"").replace(/\n/g," "));
      speak(parts.join(" "));
    };

    // Practice
    newQuiz();
    initBuilder(true);
    renderFill();

    // Timer recommended
    var rec = s.recommended || 45;
    $all(".chipbtn").forEach(function(x){x.classList.remove("is-on");});
    var preset = rec===90? "#t90" : (rec===60? "#t60" : (rec===30? "#t30" : "#t45"));
    $(preset) && $(preset).classList.add("is-on");
    setTimer(rec);
  }
  scenarioSelect.addEventListener("change", renderScenario);

  // Spin
  $("#btnSpinScenario").addEventListener("click", function(){
    var pick = DATA.scenarios[Math.floor(Math.random()*DATA.scenarios.length)];
    scenarioSelect.value = pick.id;
    renderScenario();
    $("#scenarios").scrollIntoView({behavior:"smooth", block:"start"});
  });
  $("#btnJumpModels").addEventListener("click", function(){ $("#scenarios").scrollIntoView({behavior:"smooth", block:"start"}); });
  $("#btnJumpPractice").addEventListener("click", function(){
    $("#scenarios").scrollIntoView({behavior:"smooth", block:"start"});
    setTimeout(function(){ window.scrollBy({top: 420, left:0, behavior:"smooth"}); }, 200);
  });

  // Quiz
  var currentQuiz=null, selectedQuiz=-1;
  function newQuiz(){
    var s=getScenario();
    var bank=s.quizBank||[];
    currentQuiz = bank.length ? bank[Math.floor(Math.random()*bank.length)] : null;
    selectedQuiz=-1;
    $("#quizFeedback").className="feedback";
    $("#quizFeedback").textContent="";
    if(!currentQuiz){
      $("#quizPrompt").textContent="No quiz for this scenario.";
      $("#quizOptions").innerHTML="";
      return;
    }
    $("#quizPrompt").textContent=currentQuiz.prompt;
    var opts=$("#quizOptions"); opts.innerHTML="";
    currentQuiz.options.forEach(function(o, idx){
      var lab=document.createElement("label"); lab.className="opt";
      var r=document.createElement("input"); r.type="radio"; r.name="qopt"; r.value=String(idx);
      r.addEventListener("change", function(){ selectedQuiz=idx; });
      var t=document.createElement("div"); t.textContent=o.t;
      lab.appendChild(r); lab.appendChild(t);
      opts.appendChild(lab);
    });
  }
  $("#btnNewQuiz").addEventListener("click", newQuiz);
  $("#btnResetQuiz").addEventListener("click", newQuiz);
  $("#btnCheckQuiz").addEventListener("click", function(){
    if(!currentQuiz) return;
    if(selectedQuiz<0){
      $("#quizFeedback").className="feedback warn";
      $("#quizFeedback").textContent="Choose an option first.";
      return;
    }
    var o=currentQuiz.options[selectedQuiz];
    if(o.ok){
      $("#quizFeedback").className="feedback good";
      $("#quizFeedback").textContent="✅ Correct. Why: " + o.why;
      var s=getScenario();
      if(!state.awarded.quiz[s.id]){
        addScore(3);
        state.awarded.quiz[s.id]=true;
        LS.set(KEY.state,state);
      }
    }else{
      $("#quizFeedback").className="feedback bad";
      $("#quizFeedback").textContent="❌ Not the best. Why: " + o.why;
    }
  });

  // Builder
  function bKey(){ return "b_" + getScenario().id; }
  function getBuilderState(){ return state.builderStates[bKey()] || null; }
  function saveBuilderState(b){ state.builderStates[bKey()] = b; LS.set(KEY.state,state); }
  function initBuilder(forceReset){
    var s=getScenario();
    var model=s.builderModel||[];
    var correctIds=model.map(function(_,i){ return "b"+i; });
    var saved=getBuilderState();
    var changed=!saved || (saved.correctIds||[]).join("|")!==correctIds.join("|");
    if(forceReset || changed){
      saved = { correctIds: correctIds, pool: shuffle(model.map(function(m,i){ return {id:"b"+i, step:m.step, text:m.text}; })), lane: [] };
      saveBuilderState(saved);
    }
    renderBuilder(saved);
    $("#builderFeedback").className="feedback";
    $("#builderFeedback").textContent="Build the answer in the best order: Step 1 → Step 2 → Step 3.";
  }
  function renderPoolBlock(item){
    var el=document.createElement("div"); el.className="block"; el.setAttribute("draggable","true");
    var left=document.createElement("div");
    var tx=document.createElement("div"); tx.className="block__text"; tx.textContent=item.text;
    var meta=document.createElement("div"); meta.className="block__meta"; meta.textContent="Step " + item.step;
    left.appendChild(tx); left.appendChild(meta);

    var btns=document.createElement("div"); btns.className="block__btns";
    var addBtn=document.createElement("button"); addBtn.type="button"; addBtn.textContent="➕ Add";
    addBtn.addEventListener("click", function(){ movePoolToLane(item.id); });
    var listenBtn=document.createElement("button"); listenBtn.type="button"; listenBtn.textContent="🔊";
    listenBtn.addEventListener("click", function(){ speak(item.text); });
    btns.appendChild(addBtn); btns.appendChild(listenBtn);

    el.appendChild(left); el.appendChild(btns);
    el.addEventListener("dragstart", function(e){
      try{ e.dataTransfer.setData("text/plain", item.id); e.dataTransfer.effectAllowed="move"; }catch(err){}
    });
    return el;
  }
  function renderLaneItem(item){
    var li=document.createElement("li"); li.className="answeritem"; li.setAttribute("data-id", item.id);
    var tx=document.createElement("div"); tx.className="answeritem__text"; tx.textContent=item.text;
    var btns=document.createElement("div"); btns.className="answeritem__btns";

    var up=document.createElement("button"); up.type="button"; up.textContent="↑"; up.addEventListener("click", function(){ moveInLane(item.id,-1); });
    var down=document.createElement("button"); down.type="button"; down.textContent="↓"; down.addEventListener("click", function(){ moveInLane(item.id,+1); });
    var rm=document.createElement("button"); rm.type="button"; rm.textContent="✖"; rm.addEventListener("click", function(){ moveLaneToPool(item.id); });

    btns.appendChild(up); btns.appendChild(down); btns.appendChild(rm);
    li.appendChild(tx); li.appendChild(btns);

    li.addEventListener("dragover", function(e){ e.preventDefault(); });
    li.addEventListener("drop", function(e){
      e.preventDefault();
      var dragId="";
      try{ dragId=e.dataTransfer.getData("text/plain"); }catch(err){}
      if(dragId) dropBefore(dragId, item.id);
    });
    return li;
  }
  function renderBuilder(b){
    var pool=$("#blockPool"), lane=$("#answerLane");
    pool.innerHTML=""; lane.innerHTML="";
    b.pool.forEach(function(it){ pool.appendChild(renderPoolBlock(it)); });
    b.lane.forEach(function(it){ lane.appendChild(renderLaneItem(it)); });
  }
  function movePoolToLane(id){
    var b=getBuilderState(); if(!b) return;
    var idx=b.pool.findIndex(function(x){return x.id===id;});
    if(idx<0) return;
    b.lane.push(b.pool.splice(idx,1)[0]);
    saveBuilderState(b); renderBuilder(b);
  }
  function moveLaneToPool(id){
    var b=getBuilderState(); if(!b) return;
    var idx=b.lane.findIndex(function(x){return x.id===id;});
    if(idx<0) return;
    b.pool.push(b.lane.splice(idx,1)[0]);
    saveBuilderState(b); renderBuilder(b);
  }
  function moveInLane(id, delta){
    var b=getBuilderState(); if(!b) return;
    var idx=b.lane.findIndex(function(x){return x.id===id;});
    if(idx<0) return;
    var n=idx+delta;
    if(n<0 || n>=b.lane.length) return;
    var t=b.lane[idx]; b.lane[idx]=b.lane[n]; b.lane[n]=t;
    saveBuilderState(b); renderBuilder(b);
  }
  function dropBefore(dragId, beforeId){
    var b=getBuilderState(); if(!b) return;
    var beforeIdx=b.lane.findIndex(function(x){return x.id===beforeId;});
    if(beforeIdx<0) return;

    var fromPoolIdx=b.pool.findIndex(function(x){return x.id===dragId;});
    var fromLaneIdx=b.lane.findIndex(function(x){return x.id===dragId;});
    var item=null;
    if(fromPoolIdx>=0) item=b.pool.splice(fromPoolIdx,1)[0];
    else if(fromLaneIdx>=0){
      item=b.lane.splice(fromLaneIdx,1)[0];
      beforeIdx=b.lane.findIndex(function(x){return x.id===beforeId;});
      if(beforeIdx<0) beforeIdx=b.lane.length;
    } else return;

    b.lane.splice(beforeIdx,0,item);
    saveBuilderState(b); renderBuilder(b);
  }
  $("#answerLane").addEventListener("dragover", function(e){ e.preventDefault(); });
  $("#answerLane").addEventListener("drop", function(e){
    e.preventDefault();
    var id="";
    try{ id=e.dataTransfer.getData("text/plain"); }catch(err){}
    if(id) movePoolToLane(id);
  });

  $("#btnResetBuilder").addEventListener("click", function(){ initBuilder(true); });
  $("#btnCheckBuilder").addEventListener("click", function(){
    var b=getBuilderState(); if(!b) return;
    if(b.lane.length !== b.correctIds.length){
      $("#builderFeedback").className="feedback warn";
      $("#builderFeedback").textContent="Add all blocks first (tap ➕ Add).";
      return;
    }
    var correct=0;
    for(var i=0;i<b.correctIds.length;i++) if(b.lane[i].id===b.correctIds[i]) correct++;
    if(correct===b.correctIds.length){
      $("#builderFeedback").className="feedback good";
      $("#builderFeedback").textContent="✅ Perfect order. Great structure.";
      var s=getScenario();
      if(!state.awarded.builder[s.id]){
        addScore(4);
        state.awarded.builder[s.id]=true;
        LS.set(KEY.state,state);
      }
    }else{
      $("#builderFeedback").className="feedback bad";
      $("#builderFeedback").textContent="❌ Not perfect yet. Correct positions: "+correct+" / "+b.correctIds.length+".";
    }
  });

  // Fill-in
  var currentFill=null;
  function renderFill(){
    var s=getScenario();
    currentFill = s.fill || null;
    if(!currentFill){ $("#fillText").textContent="No fill exercise for this scenario."; return; }
    var html = currentFill.template;
    currentFill.blanks.forEach(function(b){
      var opts = b.options.map(function(o){ return "<option value='"+escapeHtml(o)+"'>"+escapeHtml(o)+"</option>"; }).join("");
      var sel = "<select data-blank='"+escapeHtml(b.id)+"'><option value=''>— choose —</option>"+opts+"</select>";
      html = html.replace("{"+b.id+"}", sel);
    });
    $("#fillText").innerHTML = html;
    $("#fillFeedback").className="feedback";
    $("#fillFeedback").textContent="Choose the best words, then click Check.";
  }
  function checkFill(){
    if(!currentFill) return;
    var ok=0, total=currentFill.blanks.length;
    $all("select[data-blank]", $("#fillText")).forEach(function(sel){
      var id=sel.getAttribute("data-blank");
      var b=currentFill.blanks.find(function(x){return x.id===id;});
      sel.classList.remove("ok","no");
      if(!sel.value){ sel.classList.add("no"); return; }
      if(sel.value===b.answer){ ok++; sel.classList.add("ok"); } else sel.classList.add("no");
    });
    if(ok===total){
      $("#fillFeedback").className="feedback good";
      $("#fillFeedback").textContent="✅ Perfect.";
      var s=getScenario();
      if(!state.awarded.fill[s.id]){
        addScore(3);
        state.awarded.fill[s.id]=true;
        LS.set(KEY.state,state);
      }
    }else{
      $("#fillFeedback").className="feedback warn";
      $("#fillFeedback").textContent="Almost. Correct: "+ok+"/"+total+". Fix the red blanks.";
    }
  }
  $("#btnNewFill").addEventListener("click", renderFill);
  $("#btnResetFill").addEventListener("click", renderFill);
  $("#btnCheckFill").addEventListener("click", checkFill);
  $("#btnListenFill").addEventListener("click", function(){ speak($("#fillText").textContent.replace(/\s+/g," ").trim()); });

  // Mastered
  $("#btnMarkMastered").addEventListener("click", function(){
    var s=getScenario();
    if(!state.mastered[s.id]){
      state.mastered[s.id]=true;
      addScore(5);
      LS.set(KEY.state,state);
      bumpMasteredUI();
      $("#masteredFeedback").className="feedback good";
      $("#masteredFeedback").textContent="🔑 Marked as mastered! Great job. Try again with the other accent.";
    }else{
      $("#masteredFeedback").className="feedback";
      $("#masteredFeedback").textContent="Already mastered ✅ Keep practicing.";
    }
  });

  // Speaking bank
  var speakingCats = [
    {title:"Greetings & opening", items:[
      {en:"Good morning / Good afternoon.", fr:"Bonjour."},
      {en:"Thank you for taking my call.", fr:"Merci de prendre mon appel."},
      {en:"I’m calling to follow up on…", fr:"J’appelle pour relancer…"},
      {en:"I’m writing regarding…", fr:"Je vous écris au sujet de…"}
    ]},
    {title:"Requests (polite)", items:[
      {en:"Could you please confirm…?", fr:"Pouvez-vous confirmer… ?"},
      {en:"Would it be possible to…?", fr:"Serait‑il possible de… ?"},
      {en:"Could you send me… by email?", fr:"Pouvez-vous m’envoyer… par email ?"},
      {en:"Could you clarify one point, please?", fr:"Pouvez-vous préciser un point ?"}
    ]},
    {title:"Problem solving", items:[
      {en:"Unfortunately, there’s an issue with…", fr:"Malheureusement, il y a un souci avec…"},
      {en:"This may impact our schedule.", fr:"Cela peut impacter notre planning."},
      {en:"In the meantime, we can…", fr:"En attendant, on peut…"},
      {en:"Let’s agree on the next steps.", fr:"Mettons-nous d’accord sur les prochaines étapes."}
    ]},
    {title:"Clarifying & checking", items:[
      {en:"Just to confirm, the new date is…", fr:"Pour confirmer, la nouvelle date est…"},
      {en:"Could you repeat that a bit more slowly?", fr:"Pouvez-vous répéter plus lentement ?"},
      {en:"If I understand correctly…", fr:"Si je comprends bien…"},
      {en:"Do you mean…?", fr:"Vous voulez dire… ?"}
    ]},
    {title:"Closing", items:[
      {en:"Thank you for your help.", fr:"Merci pour votre aide."},
      {en:"I look forward to your reply.", fr:"Dans l’attente de votre réponse."},
      {en:"Have a good day.", fr:"Bonne journée."},
      {en:"Best regards,", fr:"Cordialement,"}
    ]},
    {title:"Transitions for discussion", items:[
      {en:"Overall, …", fr:"Globalement, …"},
      {en:"However, …", fr:"Cependant, …"},
      {en:"For example, …", fr:"Par exemple, …"},
      {en:"To sum up, …", fr:"En résumé, …"}
    ]}
  ];

  function renderSpeakingBank(){
    var wrap=$("#speakingBank");
    wrap.innerHTML="";
    speakingCats.forEach(function(cat){
      var card=document.createElement("div");
      card.className="bankcard";
      card.innerHTML="<h3>"+escapeHtml(cat.title)+"</h3>";
      var list=document.createElement("div"); list.className="banklist";

      cat.items.forEach(function(p){
        var row=document.createElement("div"); row.className="phrase";
        row.innerHTML = "<div class='top'><div class='en'>"+escapeHtml(p.en)+"</div>"
          + "<div class='btns'><button class='iconbtn' type='button' title='Listen'>🔊</button>"
          + "<button class='iconbtn' type='button' title='Copy'>📋</button></div></div>"
          + "<div class='fr'>FR: "+escapeHtml(p.fr)+"</div>";
        var btnListen=row.querySelectorAll("button")[0];
        var btnCopy=row.querySelectorAll("button")[1];
        btnListen.addEventListener("click", function(){ speak(p.en); });
        btnCopy.addEventListener("click", function(){ copyToClipboard(p.en + "  —  " + p.fr); });
        list.appendChild(row);
      });
      card.appendChild(list);
      wrap.appendChild(card);
    });
  }
  renderSpeakingBank();

  $("#btnCopySpeaking").addEventListener("click", function(){
    var lines=[];
    speakingCats.forEach(function(cat){
      lines.push(cat.title.toUpperCase());
      cat.items.forEach(function(p){ lines.push("- " + p.en + " | " + p.fr); });
      lines.push("");
    });
    copyToClipboard(lines.join("\n"));
  });

  // Writing bank cards
  var writingCards = [
    {title:"✅ Email skeleton", content:[
      {en:"Hello [Name],", fr:"Bonjour,"},
      {en:"I’m writing regarding…", fr:"Je vous écris au sujet de…"},
      {en:"Here are the key details: …", fr:"Voici les détails clés : …"},
      {en:"Could you please confirm / send / clarify…?", fr:"Pouvez-vous confirmer / envoyer / préciser… ?"},
      {en:"Thank you in advance.", fr:"Merci d’avance."},
      {en:"Best regards,\nFabrice", fr:"Cordialement,\nFabrice"}
    ]},
    {title:"📩 Requests & follow‑ups", content:[
      {en:"Could you please confirm the updated delivery date?", fr:"Pouvez-vous confirmer la date de livraison mise à jour ?"},
      {en:"I’m following up on my previous email.", fr:"Je relance mon email précédent."},
      {en:"If possible, please reply today.", fr:"Si possible, merci de répondre aujourd’hui."},
      {en:"In the meantime, we can…", fr:"En attendant, on peut…"}
    ]},
    {title:"🧾 Closings", content:[
      {en:"I look forward to your reply.", fr:"Dans l’attente de votre réponse."},
      {en:"Thank you for your support.", fr:"Merci pour votre aide."},
      {en:"Please let me know if you need anything else.", fr:"N’hésitez pas si besoin."},
      {en:"Kind regards,", fr:"Bien cordialement,"}
    ]}
  ];

  function renderWritingBank(){
    var grid=$("#writingCards");
    grid.innerHTML="";
    writingCards.forEach(function(c){
      var card=document.createElement("article");
      card.className="step";
      var h=document.createElement("h3"); h.textContent=c.title;
      var ul=document.createElement("ul"); ul.className="bul";
      c.content.forEach(function(line){
        var li=document.createElement("li");
        li.innerHTML = "<strong>"+escapeHtml(line.en)+"</strong><div class='muted tiny'>FR: "+escapeHtml(line.fr)+"</div>";
        ul.appendChild(li);
      });
      var btn=document.createElement("button");
      btn.className="btn btn--ghost"; btn.type="button"; btn.textContent="📋 Copy";
      btn.addEventListener("click", function(){ copyToClipboard(c.content.map(function(x){return x.en;}).join("\n")); });
      card.appendChild(h); card.appendChild(ul); card.appendChild(btn);
      grid.appendChild(card);
    });
  }
  renderWritingBank();

  $("#btnCopyWriting").addEventListener("click", function(){
    var lines=[];
    writingCards.forEach(function(c){
      lines.push(c.title);
      c.content.forEach(function(x){ lines.push("- " + x.en + " | " + x.fr); });
      lines.push("");
    });
    copyToClipboard(lines.join("\n"));
  });

  // Grammar cards (collapse)
  var grammarOpen=false;
  function renderGrammar(){
    var grid=$("#grammarGrid");
    grid.innerHTML="";
    DATA.grammar_cards.forEach(function(g){
      var card=document.createElement("div");
      card.className="gcard";
      var head=document.createElement("div");
      head.className="ghead";
      head.innerHTML = "<h3>"+escapeHtml(g.title)+"</h3><div class='pill tiny'>tap</div>";
      var body=document.createElement("div");
      body.className="gbody";
      body.innerHTML =
        "<div class='muted'><strong>EN:</strong> "+escapeHtml(g.rule_en)+"</div>" +
        "<div class='muted' style='margin-top:6px'><strong>FR:</strong> "+escapeHtml(g.rule_fr)+"</div>" +
        "<div class='kwd'><code>"+escapeHtml(g.keywords)+"</code></div>";
      var ul=document.createElement("ul"); ul.className="bul";
      (g.formation||[]).forEach(function(f){
        var li=document.createElement("li");
        li.innerHTML="<strong>"+escapeHtml(f.en)+"</strong><div class='muted tiny'>FR: "+escapeHtml(f.fr)+"</div>";
        ul.appendChild(li);
      });
      body.appendChild(ul);
      (g.examples||[]).forEach(function(ex){
        var eg=document.createElement("div"); eg.className="eg";
        eg.innerHTML="<strong>Example</strong><div>"+escapeHtml(ex.en)+"</div><div class='muted tiny'>FR: "+escapeHtml(ex.fr)+"</div>";
        body.appendChild(eg);
      });
      head.addEventListener("click", function(){ card.classList.toggle("open"); });
      card.appendChild(head); card.appendChild(body);
      grid.appendChild(card);
    });
  }
  renderGrammar();
  $("#btnExpandAllGrammar").addEventListener("click", function(){
    grammarOpen=!grammarOpen;
    $all(".gcard").forEach(function(c){ grammarOpen ? c.classList.add("open") : c.classList.remove("open"); });
  });

  // Modals
  $("#modalIntro").textContent = DATA.modal_rules.intro_en + " / " + DATA.modal_rules.intro_fr;
  function renderModalTable(){
    var wrap=$("#modalTable");
    wrap.innerHTML="";
    DATA.modal_rules.items.forEach(function(it){
      var row=document.createElement("div"); row.className="mrow";
      row.innerHTML = "<div class='m'>"+escapeHtml(it.m)+"</div>"
        + "<div class='muted'>"+escapeHtml(it.use_en)+" / "+escapeHtml(it.use_fr)+"</div>"
        + "<div class='ex'>"+escapeHtml(it.ex_en)+"</div>"
        + "<div class='muted tiny'>FR: "+escapeHtml(it.ex_fr)+"</div>";
      wrap.appendChild(row);
    });
  }
  renderModalTable();

  var modalSet = DATA.modal_rules.practice.slice();
  function renderModalPractice(){
    var wrap=$("#modalPractice");
    wrap.innerHTML="";
    modalSet.forEach(function(item, idx){
      var q=document.createElement("div");
      q.className="qline";
      q.setAttribute("data-idx", String(idx));
      q.innerHTML = "<div class='q'>"+escapeHtml(item.q)+"</div>";
      var sel=document.createElement("select");
      sel.innerHTML = "<option value=''>— choose —</option>" + item.opts.map(function(o){return "<option>"+escapeHtml(o)+"</option>";}).join("");
      var why=document.createElement("div"); why.className="why"; why.textContent=item.why;
      q.appendChild(sel); q.appendChild(why);
      wrap.appendChild(q);
    });
    $("#modalFeedback").className="feedback";
    $("#modalFeedback").textContent="Choose an answer, then tap the line to check.";
    $all("#modalPractice .qline").forEach(function(line){
      line.addEventListener("click", function(e){
        if(e.target && e.target.tagName==="SELECT") return;
        var sel=line.querySelector("select");
        var idx=parseInt(line.getAttribute("data-idx"),10);
        if(!sel.value) return;
        var ok = sel.value === modalSet[idx].a;
        line.classList.remove("ok","no");
        line.classList.add(ok ? "ok" : "no");
        var why=line.querySelector(".why");
        why.style.display="block";
        why.textContent = (ok ? "✅ " : "⚠️ ") + modalSet[idx].why;
      });
    });
  }
  renderModalPractice();

  $("#btnShuffleModals").addEventListener("click", function(){
    modalSet = shuffle(DATA.modal_rules.practice);
    renderModalPractice();
    if(!state.awarded.modals){ addScore(2); state.awarded.modals=true; LS.set(KEY.state,state); }
  });

  // Prepositions
  var prepTimePlace = DATA.prep_rules.time_place.slice();
  var prepMove = DATA.prep_rules.movement.slice();
  function renderPrepSet(){
    var tp=$("#prepTimePlace"), mv=$("#prepMove");
    tp.innerHTML=""; mv.innerHTML="";
    function renderLine(item, groupEl){
      var line=document.createElement("div"); line.className="qline"; line.setAttribute("data-a", item.a);
      line.innerHTML = "<div class='q'>"+escapeHtml(item.q)+"</div>";
      var sel=document.createElement("select");
      sel.innerHTML="<option value=''>— choose —</option>" + item.opts.map(function(o){return "<option>"+escapeHtml(o)+"</option>";}).join("");
      var why=document.createElement("div"); why.className="why"; why.textContent=item.why;
      line.appendChild(sel); line.appendChild(why);
      groupEl.appendChild(line);
    }
    prepTimePlace.forEach(function(it){ renderLine(it,tp); });
    prepMove.forEach(function(it){ renderLine(it,mv); });
    $("#prepFeedback").className="feedback";
    $("#prepFeedback").textContent="Choose answers, then click Check.";
  }
  renderPrepSet();

  $("#btnNewPreps").addEventListener("click", function(){
    prepTimePlace = shuffle(DATA.prep_rules.time_place).slice(0,4);
    prepMove = shuffle(DATA.prep_rules.movement).slice(0,4);
    renderPrepSet();
  });
  $("#btnResetPreps").addEventListener("click", renderPrepSet);

  $("#btnCheckPreps").addEventListener("click", function(){
    var lines = $all("#preps .qline");
    var ok=0;
    lines.forEach(function(line){
      var a=line.getAttribute("data-a");
      var sel=line.querySelector("select");
      var why=line.querySelector(".why");
      line.classList.remove("ok","no");
      if(sel.value && sel.value===a){ ok++; line.classList.add("ok"); }
      else{ line.classList.add("no"); }
      why.style.display="block";
      why.textContent = (sel.value===a ? "✅ " : "⚠️ ") + why.textContent;
    });
    $("#prepFeedback").className = ok===lines.length ? "feedback good" : "feedback warn";
    $("#prepFeedback").textContent = "Score: " + ok + " / " + lines.length + ".";
    if(ok===lines.length && !state.awarded.preps){ addScore(4); state.awarded.preps=true; LS.set(KEY.state,state); }
  });

  // Connectors
  function renderConnectors(){
    var wrap=$("#connectorBank"); wrap.innerHTML="";
    DATA.connector_bank.forEach(function(c){
      var row=document.createElement("div"); row.className="citem";
      row.innerHTML = "<div class='ic'>"+escapeHtml(c.icon)+"</div>"
        + "<div><div class='en'>"+escapeHtml(c.en)+"</div><div class='fr'>FR: "+escapeHtml(c.fr)+"</div></div>"
        + "<button class='iconbtn' type='button' title='Listen'>🔊</button>";
      row.querySelector("button").addEventListener("click", function(){ speak(c.en); });
      wrap.appendChild(row);
    });
  }
  renderConnectors();
  $("#btnCopyConnectors").addEventListener("click", function(){
    copyToClipboard(DATA.connector_bank.map(function(c){ return c.en + " | " + c.fr; }).join("\n"));
  });

  // Superlatives
  var superSet = DATA.superlative_practice.slice();
  function renderSuper(){
    var wrap=$("#superPractice"); wrap.innerHTML="";
    superSet.forEach(function(item){
      var line=document.createElement("div"); line.className="qline"; line.setAttribute("data-a", item.a);
      line.innerHTML="<div class='q'>"+escapeHtml(item.q)+"</div>";
      var sel=document.createElement("select");
      sel.innerHTML="<option value=''>— choose —</option>" + item.opts.map(function(o){return "<option>"+escapeHtml(o)+"</option>";}).join("");
      var why=document.createElement("div"); why.className="why"; why.textContent=item.why;
      line.appendChild(sel); line.appendChild(why);
      wrap.appendChild(line);
    });
    $("#superFeedback").className="feedback";
    $("#superFeedback").textContent="Choose answers, then click Check.";
  }
  renderSuper();
  $("#btnResetSuper").addEventListener("click", renderSuper);
  $("#btnCheckSuper").addEventListener("click", function(){
    var lines=$all("#superPractice .qline");
    var ok=0;
    lines.forEach(function(line){
      var a=line.getAttribute("data-a");
      var sel=line.querySelector("select");
      var why=line.querySelector(".why");
      line.classList.remove("ok","no");
      if(sel.value && sel.value===a){ ok++; line.classList.add("ok"); }
      else{ line.classList.add("no"); }
      why.style.display="block";
    });
    $("#superFeedback").className = ok===lines.length ? "feedback good" : "feedback warn";
    $("#superFeedback").textContent = "Score: " + ok + " / " + lines.length + ".";
    if(ok===lines.length && !state.awarded.super){ addScore(4); state.awarded.super=true; LS.set(KEY.state,state); }
  });

  // Vocabulary
  var vocabFilter="all";
  function getAllVocab(){
    var list=[];
    DATA.scenarios.forEach(function(s){
      (s.vocab||[]).forEach(function(v){
        var tag="discussion";
        if((s.tags||[]).indexOf("work")>=0) tag="work";
        else if((s.tags||[]).indexOf("travel")>=0 || (s.tags||[]).indexOf("hotel")>=0) tag="travel";
        list.push({icon:v.icon, word:v.word, def:v.def, fr:v.fr, tag:tag});
      });
    });
    DATA.global_vocab.forEach(function(v){ list.push({icon:v.icon, word:v.word, def:v.def, fr:v.fr, tag:"work"}); });
    return list;
  }
  var vocabList = getAllVocab();

  function renderFlashcards(list){
    var grid=$("#flashGrid"); grid.innerHTML="";
    list.forEach(function(v){
      var card=document.createElement("div"); card.className="flash"; card.tabIndex=0;
      var inner=document.createElement("div"); inner.className="flash__inner";

      var front=document.createElement("div"); front.className="flash__face flash__front";
      var ic=document.createElement("div"); ic.className="icon"; ic.textContent=v.icon || "🧠";
      var w=document.createElement("div"); w.className="word"; w.textContent=v.word;
      var actions=document.createElement("div"); actions.className="flash__actions";
      var listen=document.createElement("button"); listen.type="button"; listen.textContent="🔊 Listen";
      listen.addEventListener("click", function(e){ e.stopPropagation(); speak(v.word); });
      actions.appendChild(listen);
      front.appendChild(ic); front.appendChild(w); front.appendChild(actions);

      var back=document.createElement("div"); back.className="flash__face flash__back";
      back.innerHTML = "<div><strong>Meaning</strong></div><div style='margin-top:6px'>"+escapeHtml(v.def)+"</div>"
        + "<div class='fr' style='margin-top:10px'><strong>FR:</strong> "+escapeHtml(v.fr||"—")+"</div>"
        + "<div class='tiny muted' style='margin-top:10px'>Tap to flip back</div>";

      inner.appendChild(front); inner.appendChild(back);
      card.appendChild(inner);

      function toggle(){ card.classList.toggle("is-flipped"); }
      card.addEventListener("click", toggle);
      card.addEventListener("keydown", function(e){ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); toggle(); } });

      grid.appendChild(card);
    });
  }
  function applyVocabFilter(){
    var list=vocabList.slice();
    if(vocabFilter!=="all") list=list.filter(function(v){ return v.tag===vocabFilter; });
    renderFlashcards(list);
  }
  applyVocabFilter();

  $all("[data-vfilter]").forEach(function(btn){
    btn.addEventListener("click", function(){
      $all("[data-vfilter]").forEach(function(x){ x.classList.remove("is-on"); });
      btn.classList.add("is-on");
      vocabFilter = btn.getAttribute("data-vfilter");
      applyVocabFilter();
    });
  });
  $("#btnShuffleVocab").addEventListener("click", function(){ vocabList = shuffle(vocabList); applyVocabFilter(); });

  // Notes
  var notesBox=$("#notesBox");
  if(notesBox){
    notesBox.value = LS.get(KEY.notes, "");
    notesBox.addEventListener("input", function(){ LS.set(KEY.notes, notesBox.value); });
  }
  $("#btnCopyNotes").addEventListener("click", function(){ copyToClipboard(notesBox ? notesBox.value : ""); });

  // Copy utility
  function copyToClipboard(text){
    var t=String(text||"");
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(t).then(function(){ toast("Copied!"); })
        .catch(function(){ fallbackCopy(t); });
    }else fallbackCopy(t);
  }
  function fallbackCopy(text){
    var ta=document.createElement("textarea");
    ta.value=text;
    ta.style.position="fixed";
    ta.style.left="-9999px";
    document.body.appendChild(ta);
    ta.focus(); ta.select();
    try{ document.execCommand("copy"); toast("Copied!"); }
    catch(e){ alert("Copy failed. You can manually copy."); }
    document.body.removeChild(ta);
  }
  function toast(msg){
    var t=document.createElement("div");
    t.textContent=msg;
    t.style.position="fixed";
    t.style.bottom="16px";
    t.style.left="50%";
    t.style.transform="translateX(-50%)";
    t.style.padding="10px 12px";
    t.style.borderRadius="14px";
    t.style.border="1px solid rgba(255,255,255,.14)";
    t.style.background="rgba(0,0,0,.55)";
    t.style.color="rgba(255,255,255,.92)";
    t.style.zIndex="9999";
    document.body.appendChild(t);
    setTimeout(function(){ try{ document.body.removeChild(t); }catch(e){} }, 1200);
  }

  // Print + Reset
  $("#btnPrint").addEventListener("click", function(){ window.print(); });
  $("#btnResetAll").addEventListener("click", function(){
    stopSpeech(); stopTimer();
    LS.del(KEY.state); LS.del(KEY.score); LS.del(KEY.notes);
    state = { activeScenarioId: DATA.scenarios[0].id, mastered:{}, awarded:{ quiz:{}, builder:{}, fill:{}, preps:false, super:false, modals:false }, builderStates:{} };
    scoreState = {score:0};
    LS.set(KEY.score, scoreState);
    if(notesBox) notesBox.value="";
    scenarioSelect.value = DATA.scenarios[0].id;
    bumpMasteredUI();
    setScore(0);
    renderScenario();
    newSimulation();
    applyVocabFilter();
    toast("Reset done.");
  });

  // Init
  renderScenario();

})();
