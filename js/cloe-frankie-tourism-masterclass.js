/* SpeakEasyTisha — Frankie Final CLOE Exam Masterclass (v2)
   Put this file in: /js/cloe-final-frankie-masterclass-v2.js
*/
(function(){
  "use strict";

  var DATA = {"scenarios": [{"id": "airport_checkin_problem", "cat": "Airport", "tags": ["travel", "airport", "problem"], "title": "Check‑in issue — baggage and seat", "desc": "Polite problem solving: baggage allowance + seat change.", "recommended": 60, "prompt": "At the airport check‑in desk, you discover your baggage is over the limit and you want to sit next to your travel companion. What do you say?", "structure": [{"t": "Greeting + context", "en": "Hello. I’m checking in for flight [number] and I have a quick question about my baggage.", "fr": "Bonjour. Je m’enregistre pour le vol [numéro] et j’ai une question sur mon bagage."}, {"t": "Problem + 2 details", "en": "My suitcase is slightly over the allowance and I’m travelling with a companion.", "fr": "Ma valise dépasse légèrement et je voyage avec quelqu’un."}, {"t": "Request + close", "en": "Could you advise me on the best option, and could we sit together if possible? Thank you.", "fr": "Pouvez‑vous me dire la meilleure option, et pouvons‑nous être assis ensemble si possible ? Merci."}], "dialogue": [{"sp": "Agent", "en": "Good morning. How can I help you?", "fr": "Bonjour. Comment puis‑je vous aider ?"}, {"sp": "Frankie", "en": "Hello. I’m checking in for flight [number]. My suitcase is slightly over the allowance.", "fr": "Bonjour. Je m’enregistre pour le vol [numéro]. Ma valise dépasse un peu la limite."}, {"sp": "Agent", "en": "It’s one kilo over. You can pay the extra fee or move items to your carry‑on.", "fr": "C’est 1 kg en plus. Vous pouvez payer ou déplacer des affaires en cabine."}, {"sp": "Frankie", "en": "Okay, thank you. What is the extra fee? And if possible, could I sit next to my companion?", "fr": "D’accord, merci. Quel est le supplément ? Et si possible, puis-je être à côté de mon compagnon ?"}, {"sp": "Agent", "en": "I can check seat availability.", "fr": "Je peux vérifier la disponibilité."}, {"sp": "Frankie", "en": "Perfect. Thank you for your help.", "fr": "Parfait. Merci pour votre aide."}], "writing": {"subject": "Subject: Request for seat change (flight [number])", "body": "Hello,\n\nI’m travelling on flight [number] on [date]. If possible, could you please help me change my seat so I can sit next to my companion?\n\nThank you in advance for your support.\n\nBest regards,\nFrankie", "tips": [{"en": "Use polite modals: could / would it be possible…", "fr": "Modaux polis : could / would it be possible…"}, {"en": "Keep it short: context → request → thanks → closing.", "fr": "Court : contexte → demande → merci → formule de fin."}]}, "quizBank": [{"prompt": "Choose the most polite request:", "options": [{"t": "Move my seat now.", "ok": false, "why": "Too direct."}, {"t": "Could you please help me change my seat, if possible?", "ok": true, "why": "Polite + clear."}, {"t": "I want a different seat.", "ok": false, "why": "Not polite enough."}]}], "builderModel": [{"step": 1, "text": "Hello. I’m checking in for flight [number] and I have a quick question about my baggage."}, {"step": 2, "text": "My suitcase is slightly over the allowance, and I’m travelling with a companion."}, {"step": 3, "text": "Could you advise me on the best option, and could we sit together if possible? Thank you."}], "fill": {"template": "My suitcase is slightly {b0} the allowance. Could you {b1} me on the best {b2}, and could we sit {b3} if {b4}?", "blanks": [{"id": "b0", "options": ["over", "upper", "other"], "answer": "over"}, {"id": "b1", "options": ["advise", "advice", "advance"], "answer": "advise"}, {"id": "b2", "options": ["option", "occasion", "opinion"], "answer": "option"}, {"id": "b3", "options": ["together", "togather", "togetherly"], "answer": "together"}, {"id": "b4", "options": ["possible", "possibly", "possibility"], "answer": "possible"}]}, "vocab": [{"icon": "🧳", "word": "baggage allowance", "def": "max weight/size allowed", "fr": "franchise bagages"}, {"icon": "⚖️", "word": "over the limit", "def": "too heavy", "fr": "au‑dessus de la limite"}, {"icon": "💺", "word": "seat change", "def": "switch to another seat", "fr": "changer de siège"}, {"icon": "🧑‍🤝‍🧑", "word": "companion", "def": "person travelling with you", "fr": "compagnon / accompagnant"}, {"icon": "🙏", "word": "if possible", "def": "if it can be done", "fr": "si possible"}]}, {"id": "airport_lost_item", "cat": "Airport", "tags": ["travel", "airport", "problem"], "title": "Lost item — at security", "desc": "Explain what you lost and ask what to do next.", "recommended": 45, "prompt": "You think you left your phone at airport security. Ask for help and explain what it looks like.", "structure": [{"t": "Polite opener", "en": "Excuse me, I think I left my phone at security.", "fr": "Excusez‑moi, je pense avoir oublié mon téléphone au contrôle."}, {"t": "Description", "en": "It’s a black phone with a blue case and my name on the screen.", "fr": "Téléphone noir avec coque bleue et mon nom à l’écran."}, {"t": "Request + close", "en": "Could you tell me what I should do next? Thank you.", "fr": "Pouvez‑vous me dire quoi faire ensuite ? Merci."}], "dialogue": [{"sp": "Staff", "en": "How can I help you?", "fr": "Je vous écoute."}, {"sp": "Frankie", "en": "Hi. I think I left my phone at security.", "fr": "Bonjour. Je pense avoir laissé mon téléphone au contrôle."}, {"sp": "Staff", "en": "Can you describe it?", "fr": "Vous pouvez le décrire ?"}, {"sp": "Frankie", "en": "Yes, it’s black with a blue case. Could you check the lost‑and‑found, please?", "fr": "Oui, noir avec coque bleue. Pouvez‑vous vérifier les objets trouvés ?"}, {"sp": "Staff", "en": "Okay. Please fill out this form.", "fr": "D’accord. Merci de remplir ce formulaire."}, {"sp": "Frankie", "en": "Of course. Thank you for your help.", "fr": "Bien sûr. Merci pour votre aide."}], "writing": {"subject": "Subject: Lost item at security — request for update", "body": "Hello,\n\nI believe I left my phone at airport security today. It is a black phone with a blue case.\n\nCould you please confirm if it has been found and what the next steps are?\n\nThank you in advance.\n\nBest regards,\nFrankie", "tips": [{"en": "Use past: I left / I lost / I believe I left…", "fr": "Passé : I left / I lost / I believe I left…"}, {"en": "Add details: colour, case, time, location.", "fr": "Ajoute : couleur, coque, heure, lieu."}]}, "quizBank": [{"prompt": "Choose the best first sentence:", "options": [{"t": "I lost phone.", "ok": false, "why": "Missing article and details."}, {"t": "I think I left my phone at security.", "ok": true, "why": "Natural and clear."}, {"t": "Phone gone.", "ok": false, "why": "Too short / not clear."}]}], "builderModel": [{"step": 1, "text": "Excuse me, I think I left my phone at security."}, {"step": 2, "text": "It’s a black phone with a blue case, and I can describe it in more detail."}, {"step": 3, "text": "Could you tell me what I should do next, please? Thank you."}], "fill": {"template": "I think I {b0} my phone at {b1}. It’s {b2} with a {b3} case. Could you check the {b4}, please?", "blanks": [{"id": "b0", "options": ["left", "lift", "live"], "answer": "left"}, {"id": "b1", "options": ["security", "securing", "secret"], "answer": "security"}, {"id": "b2", "options": ["black", "blank", "back"], "answer": "black"}, {"id": "b3", "options": ["blue", "blew", "blow"], "answer": "blue"}, {"id": "b4", "options": ["lost‑and‑found", "lost and founds", "lose‑and‑found"], "answer": "lost‑and‑found"}]}, "vocab": [{"icon": "📱", "word": "phone case", "def": "protective cover", "fr": "coque"}, {"icon": "🧭", "word": "lost‑and‑found", "def": "place for lost items", "fr": "objets trouvés"}, {"icon": "🛂", "word": "security", "def": "airport check area", "fr": "contrôle de sécurité"}, {"icon": "📝", "word": "form", "def": "document to fill in", "fr": "formulaire"}, {"icon": "🔍", "word": "to check", "def": "look for / verify", "fr": "vérifier"}]}, {"id": "ballynahinch_day_trip", "cat": "Ballynahinch (Ireland)", "tags": ["tourism", "planning"], "title": "Ballynahinch — plan a day trip", "desc": "Describe activities and ask for recommendations.", "recommended": 60, "prompt": "You want to visit Ballynahinch. Explain what you want to do (nature, walks, local food) and ask for recommendations.", "structure": [{"t": "Context", "en": "I’m visiting Ballynahinch and I’d like to plan a simple day trip.", "fr": "Je visite Ballynahinch et je veux planifier une journée simple."}, {"t": "Preferences", "en": "I’d like nature, a short walk, and a local café or pub.", "fr": "Je veux de la nature, une petite marche, et un café/pub."}, {"t": "Request + close", "en": "Could you recommend the best places and the easiest way to get there? Thank you.", "fr": "Pouvez‑vous recommander les meilleurs endroits et le moyen le plus simple d’y aller ? Merci."}], "dialogue": [{"sp": "Local", "en": "Hi! What are you looking for today?", "fr": "Salut ! Tu cherches quoi aujourd’hui ?"}, {"sp": "Frankie", "en": "Hi. I’m visiting Ballynahinch and I’d like to plan a simple day trip.", "fr": "Bonjour. Je visite Ballynahinch et je voudrais planifier une journée."}, {"sp": "Local", "en": "Do you prefer nature or the town?", "fr": "Tu préfères la nature ou le centre ?"}, {"sp": "Frankie", "en": "Nature, please. A short walk and a nice place to eat. Any recommendations?", "fr": "Nature. Une petite marche et un endroit sympa pour manger. Des recommandations ?"}, {"sp": "Local", "en": "Yes, try a riverside walk and a local café in the centre.", "fr": "Oui, une balade près de la rivière et un café au centre."}, {"sp": "Frankie", "en": "Perfect, thank you! What’s the easiest way to get there?", "fr": "Parfait, merci ! Quel est le moyen le plus simple ?"}], "writing": {"subject": "Subject: Ballynahinch visit — recommendations", "body": "Hello,\n\nI’m visiting Ballynahinch for a day and I’d like a few recommendations. I’m looking for a short scenic walk, a quiet area, and a good local place to eat.\n\nCould you please suggest the best options and the easiest transport (bus/taxi) from [my location]?\n\nThank you in advance.\n\nBest regards,\nFrankie", "tips": [{"en": "Use superlatives: the best / the easiest / the most scenic.", "fr": "Superlatifs : the best / the easiest / the most scenic."}, {"en": "Use prepositions: near the river / in the centre / on the way to…", "fr": "Prépositions : near / in / on the way to…"}]}, "quizBank": [{"prompt": "Choose the best phrase for preferences:", "options": [{"t": "I like nature and a short walk.", "ok": true, "why": "Simple and correct."}, {"t": "I want to nature.", "ok": false, "why": "Grammar."}, {"t": "Nature is prefer.", "ok": false, "why": "Grammar."}]}], "builderModel": [{"step": 1, "text": "I’m visiting Ballynahinch and I’d like to plan a simple day trip."}, {"step": 2, "text": "I’d like nature, a short walk, and a good local place to eat."}, {"step": 3, "text": "Could you recommend the best places and the easiest way to get there? Thank you."}], "fill": {"template": "I’d like a {b0} walk near the {b1} and a {b2} café in the {b3}. What is the {b4} way to get there?", "blanks": [{"id": "b0", "options": ["scenic", "scene", "scenery"], "answer": "scenic"}, {"id": "b1", "options": ["river", "driver", "rival"], "answer": "river"}, {"id": "b2", "options": ["local", "locate", "location"], "answer": "local"}, {"id": "b3", "options": ["centre", "centered", "century"], "answer": "centre"}, {"id": "b4", "options": ["easiest", "easy", "easier"], "answer": "easiest"}]}, "vocab": [{"icon": "🌿", "word": "scenic", "def": "beautiful views", "fr": "pittoresque"}, {"icon": "🚶", "word": "short walk", "def": "a small hike", "fr": "petite marche"}, {"icon": "🍀", "word": "local", "def": "from the area", "fr": "local"}, {"icon": "🍽️", "word": "place to eat", "def": "restaurant/café", "fr": "endroit pour manger"}, {"icon": "🚌", "word": "transport", "def": "bus/taxi options", "fr": "transport"}]}, {"id": "tourist_directions", "cat": "Tourism", "tags": ["tourism", "directions"], "title": "Asking for directions — attraction", "desc": "Polite directions with prepositions.", "recommended": 45, "prompt": "You are in a city and want to find a museum. Ask for directions and repeat the key steps to confirm.", "structure": [{"t": "Ask politely", "en": "Excuse me, could you tell me how to get to the museum, please?", "fr": "Excusez‑moi, pouvez‑vous me dire comment aller au musée ?"}, {"t": "Clarify", "en": "Is it near the station? Should I take the bus or walk?", "fr": "C’est près de la gare ? Bus ou à pied ?"}, {"t": "Confirm + thanks", "en": "So I go straight, then turn left at the bank — is that correct? Thank you!", "fr": "Donc tout droit puis à gauche à la banque — c’est ça ? Merci !"}], "dialogue": [{"sp": "Local", "en": "Hi, can I help?", "fr": "Je peux vous aider ?"}, {"sp": "Frankie", "en": "Excuse me, could you tell me how to get to the museum, please?", "fr": "Excusez‑moi, pouvez‑vous me dire comment aller au musée ?"}, {"sp": "Local", "en": "Go straight, then turn left at the bank. It’s next to the park.", "fr": "Tout droit, puis à gauche à la banque. C’est à côté du parc."}, {"sp": "Frankie", "en": "Great — so straight, left at the bank, and it’s next to the park. Thank you!", "fr": "Super — tout droit, à gauche, et à côté du parc. Merci !"}], "writing": {"subject": "Short message: directions request", "body": "Hello,\n\nCould you please tell me how to get to the museum from the station? Is it within walking distance?\n\nThank you,\nFrankie", "tips": [{"en": "Use prepositions: next to / across from / near / on the left.", "fr": "Prépositions : next to / across from / near / on the left."}, {"en": "Repeat directions to confirm (sounds fluent).", "fr": "Répète pour confirmer (plus fluide)."}]}, "quizBank": [{"prompt": "Choose the correct phrase:", "options": [{"t": "It’s next to the park.", "ok": true, "why": "Correct preposition."}, {"t": "It’s next of the park.", "ok": false, "why": "Use next to."}, {"t": "It’s near from the park.", "ok": false, "why": "Near the park / close to the park."}]}], "builderModel": [{"step": 1, "text": "Excuse me, could you tell me how to get to the museum, please?"}, {"step": 2, "text": "Is it near the station, and should I walk or take the bus?"}, {"step": 3, "text": "So I go straight, then turn left at the bank — is that correct? Thank you!"}], "fill": {"template": "Go {b0}, then turn {b1} at the bank. It’s next {b2} the park. Is it {b3} walking distance {b4} the station?", "blanks": [{"id": "b0", "options": ["straight", "street", "strange"], "answer": "straight"}, {"id": "b1", "options": ["left", "lift", "leaf"], "answer": "left"}, {"id": "b2", "options": ["to", "two", "too"], "answer": "to"}, {"id": "b3", "options": ["within", "with", "without"], "answer": "within"}, {"id": "b4", "options": ["from", "for", "by"], "answer": "from"}]}, "vocab": [{"icon": "🧭", "word": "directions", "def": "how to get somewhere", "fr": "indications"}, {"icon": "⬅️", "word": "turn left", "def": "go left", "fr": "tourner à gauche"}, {"icon": "➡️", "word": "go straight", "def": "continue forward", "fr": "aller tout droit"}, {"icon": "📍", "word": "next to", "def": "beside", "fr": "à côté de"}, {"icon": "🚶", "word": "walking distance", "def": "close enough to walk", "fr": "à distance à pied"}]}, {"id": "restaurant_booking", "cat": "Tourism", "tags": ["tourism", "restaurant"], "title": "Restaurant booking — special request", "desc": "Book a table and ask for a quiet place.", "recommended": 45, "prompt": "Call a restaurant to book a table for tonight. Ask for a quiet table and confirm the time and number of people.", "structure": [{"t": "Greeting + booking", "en": "Hello, I’d like to book a table for tonight, please.", "fr": "Bonjour, je voudrais réserver une table pour ce soir."}, {"t": "Details", "en": "For two people at 7:30, if possible.", "fr": "Pour deux personnes à 19h30, si possible."}, {"t": "Request + close", "en": "Could we have a quiet table? Thank you — see you tonight.", "fr": "Peut‑on avoir une table au calme ? Merci — à ce soir."}], "dialogue": [{"sp": "Restaurant", "en": "Good evening, how can I help?", "fr": "Bonsoir, je vous écoute."}, {"sp": "Frankie", "en": "Hello, I’d like to book a table for tonight, please. For two people at 7:30, if possible.", "fr": "Bonjour, je voudrais réserver une table pour ce soir. Pour deux personnes à 19h30."}, {"sp": "Restaurant", "en": "Yes, we have availability.", "fr": "Oui, c’est possible."}, {"sp": "Frankie", "en": "Great. Could we have a quiet table, please? Thank you.", "fr": "Super. Peut‑on avoir une table au calme ? Merci."}], "writing": {"subject": "Subject: Table reservation request", "body": "Hello,\n\nI would like to reserve a table for two people tonight at 7:30 pm, if possible. Could we have a quiet table?\n\nThank you,\nFrankie", "tips": [{"en": "Use ‘for two people’ + ‘at 7:30 pm’.", "fr": "‘for two people’ + ‘at 7:30 pm’."}, {"en": "Use ‘could we…’ for polite requests.", "fr": "‘could we…’ pour une demande polie."}]}, "quizBank": [{"prompt": "Choose the correct sentence:", "options": [{"t": "I’d like to book a table for two at 7:30.", "ok": true, "why": "Correct."}, {"t": "I like book table two 7:30.", "ok": false, "why": "Grammar."}, {"t": "Reserve me table.", "ok": false, "why": "Too direct."}]}], "builderModel": [{"step": 1, "text": "Hello, I’d like to book a table for tonight, please."}, {"step": 2, "text": "For two people at 7:30 pm, if possible."}, {"step": 3, "text": "Could we have a quiet table? Thank you."}], "fill": {"template": "I’d like to {b0} a table {b1} two people {b2} 7:30 pm, if {b3}. Could we have a {b4} table?", "blanks": [{"id": "b0", "options": ["book", "cook", "look"], "answer": "book"}, {"id": "b1", "options": ["for", "from", "by"], "answer": "for"}, {"id": "b2", "options": ["at", "in", "on"], "answer": "at"}, {"id": "b3", "options": ["possible", "possibly", "possibility"], "answer": "possible"}, {"id": "b4", "options": ["quiet", "quite", "quilt"], "answer": "quiet"}]}, "vocab": [{"icon": "📞", "word": "to book a table", "def": "reserve seats", "fr": "réserver une table"}, {"icon": "🕢", "word": "at 7:30 pm", "def": "time phrase", "fr": "à 19h30"}, {"icon": "👥", "word": "for two people", "def": "number of guests", "fr": "pour deux personnes"}, {"icon": "🤫", "word": "quiet table", "def": "not noisy", "fr": "table au calme"}, {"icon": "✅", "word": "availability", "def": "free space", "fr": "disponibilité"}]}], "grammar_cards": [{"id": "present_simple", "title": "Present Simple (habits / facts)", "rule_en": "Base verb (+s for he/she/it). Use for habits, routines, facts.", "rule_fr": "Base du verbe (+s à he/she/it). Habitudes, routines, faits.", "keywords": "always • usually • often • every day • in general", "formation": [{"en": "I travel. She travels.", "fr": "Base (+s)."}, {"en": "Negative: I don’t travel. She doesn’t travel.", "fr": "don’t/doesn’t + base."}, {"en": "Question: Do you travel? Does she travel?", "fr": "Do/Does + base ?"}], "examples": [{"en": "I usually plan my trips in advance.", "fr": "Je planifie généralement mes voyages à l’avance."}]}, {"id": "past_simple", "title": "Past Simple (finished past)", "rule_en": "Verb‑ed or irregular form. Finished action in the past.", "rule_fr": "-ed ou irrégulier. Action finie.", "keywords": "yesterday • last week • ago", "formation": [{"en": "I left my phone.", "fr": "V2."}, {"en": "Negative: I didn’t leave…", "fr": "didn’t + base."}, {"en": "Question: Did you…?", "fr": "Did + base ?"}], "examples": [{"en": "I left my phone at security.", "fr": "J’ai laissé mon téléphone au contrôle."}]}, {"id": "future", "title": "Future: will vs going to", "rule_en": "will = decision now / prediction. going to = plan.", "rule_fr": "will = décision / prédiction. going to = plan.", "keywords": "tomorrow • next week • soon", "formation": [{"en": "I’ll call now. / I’m going to visit Ballynahinch.", "fr": "will / going to"}, {"en": "Negative: won’t / not going to.", "fr": "won’t / not going to"}, {"en": "Question: Will you…? / Are you going to…?", "fr": "Will…? / Are you going to…?"}], "examples": [{"en": "I’m going to book a table for tonight.", "fr": "Je vais réserver une table pour ce soir."}]}, {"id": "conditionals", "title": "Conditionals (What would you do if…?)", "rule_en": "If + past, would + base (hypothetical).", "rule_fr": "If + past, would + base (hypothèse).", "keywords": "If I were you… • If I lost… I would…", "formation": [{"en": "If I were you, I would ask for confirmation by email.", "fr": "Conseil : If I were you…"}, {"en": "If I lost my passport, I would contact the embassy.", "fr": "If + past, would + base."}], "examples": [{"en": "If my flight was cancelled, I would ask for rebooking options.", "fr": "Si mon vol était annulé, je demanderais un rebooking."}]}], "modal_rules": {"intro_en": "Modals make you sound polite and confident for tourism situations.", "intro_fr": "Les modaux rendent ton anglais plus poli et plus sûr en voyage.", "items": [{"m": "could", "use_en": "polite request", "use_fr": "demande polie", "ex_en": "Could you help me, please?", "ex_fr": "Pouvez‑vous m’aider ?"}, {"m": "would", "use_en": "preference", "use_fr": "préférence", "ex_en": "I would prefer a quiet table.", "ex_fr": "Je préférerais une table au calme."}, {"m": "should", "use_en": "advice", "use_fr": "conseil", "ex_en": "You should arrive early.", "ex_fr": "Tu devrais arriver tôt."}, {"m": "might", "use_en": "possibility", "use_fr": "possibilité", "ex_en": "The flight might be delayed.", "ex_fr": "Le vol pourrait être retardé."}], "practice": [{"q": "___ you please tell me how to get to the museum? (polite)", "a": "Could", "opts": ["Can", "Could", "Must"], "why": "Could = polite request."}, {"q": "I ___ prefer a quiet table. (preference)", "a": "would", "opts": ["would", "should", "might"], "why": "would prefer = preference."}, {"q": "The flight ___ be delayed. (possibility)", "a": "might", "opts": ["might", "must", "have to"], "why": "might = possibility."}]}, "prep_rules": {"time_place": [{"q": "The reservation is ___ 7:30 pm.", "a": "at", "opts": ["in", "on", "at"], "why": "at + time"}, {"q": "The museum is ___ the city centre.", "a": "in", "opts": ["in", "on", "at"], "why": "in + area"}, {"q": "We meet ___ Monday.", "a": "on", "opts": ["in", "on", "at"], "why": "on + day"}, {"q": "My hotel is ___ the station.", "a": "near", "opts": ["near", "near to", "near from"], "why": "near + noun"}], "movement": [{"q": "Go ___ the street and turn left.", "a": "down", "opts": ["down", "under", "inside"], "why": "go down the street"}, {"q": "Walk ___ the park.", "a": "to", "opts": ["to", "at", "in"], "why": "walk to + place"}, {"q": "It’s next ___ the bank.", "a": "to", "opts": ["to", "of", "from"], "why": "next to"}, {"q": "Reply ___ email, please.", "a": "by", "opts": ["by", "on", "at"], "why": "by email"}]}, "connector_bank": [{"icon": "✅", "en": "First of all,", "fr": "Tout d’abord,"}, {"icon": "➡️", "en": "Then,", "fr": "Ensuite,"}, {"icon": "⚖️", "en": "However,", "fr": "Cependant,"}, {"icon": "💡", "en": "For example,", "fr": "Par exemple,"}, {"icon": "🏁", "en": "To sum up,", "fr": "En résumé,"}], "superlative_practice": [{"q": "This is the ___ option for transport. (easy)", "a": "easiest", "opts": ["easiest", "more easy", "most easy"], "why": "superlative: -est"}, {"q": "Ballynahinch is ___ than I expected. (beautiful)", "a": "more beautiful", "opts": ["more beautiful", "beautifuler", "the most beautiful"], "why": "comparative: more + adj"}, {"q": "This is the ___ café in town. (good)", "a": "best", "opts": ["best", "goodest", "better"], "why": "superlative: best"}, {"q": "Walking is ___ than a taxi. (cheap)", "a": "cheaper", "opts": ["cheaper", "more cheap", "cheapest"], "why": "comparative: -er"}], "global_vocab": [{"icon": "🗺️", "word": "itinerary", "def": "travel plan", "fr": "itinéraire"}, {"icon": "🚌", "word": "bus stop", "def": "place where the bus stops", "fr": "arrêt de bus"}, {"icon": "🏨", "word": "accommodation", "def": "place to stay", "fr": "hébergement"}, {"icon": "🧾", "word": "receipt", "def": "proof of payment", "fr": "reçu"}, {"icon": "📍", "word": "near / next to", "def": "close / beside", "fr": "près de / à côté de"}, {"icon": "🎟️", "word": "ticket", "def": "entry or transport ticket", "fr": "billet"}]};


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
  $("#maxTop").textContent = "45";
  $("#maxBottom").textContent = "45";

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
      {en:"Best regards,\nFrankie", fr:"Cordialement,\nFrankie"}
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
