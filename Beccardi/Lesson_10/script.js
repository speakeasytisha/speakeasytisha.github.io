"use strict";

const vocabulary = {
  "👋 Reactions & follow-up": [
    ["How’s your week going?", "Comment se passe votre semaine ?", "An easy opener when you see someone during the week.", "Hey, how’s your week going so far?"],
    ["What have you been up to?", "Quoi de neuf ? Qu’avez-vous fait dernièrement ?", "A friendly way to ask about recent activities.", "Hey, good to see you. What have you been up to?"],
    ["That sounds like fun.", "Ça a l’air sympa.", "A short reaction that shows interest.", "That sounds like fun. How often do you go?"],
    ["How did you get into that?", "Comment avez-vous commencé ?", "Ask how someone first became interested in something.", "A wine-tasting club? How did you get into that?"],
    ["How about you?", "Et vous ?", "Pass the conversation back after you’ve answered.", "I usually take it easy on Sundays. How about you?"],
    ["Let me think for a second.", "Laissez-moi réfléchir un instant.", "Give yourself time to find the right words.", "Let me think for a second. The last time I went was in spring."],
    ["Would you mind saying that again?", "Pourriez-vous répéter ?", "A polite request when you miss part of what someone said.", "Sorry, I missed the last part. Would you mind saying that again?"],
    ["It was great catching up.", "Ça m’a fait plaisir de discuter.", "A warm way to close a conversation with someone you already know.", "It was great catching up. See you at the meeting."]
  ],
  "🏡 Family & weekends": [
    ["spend time with family", "passer du temps en famille", "A simple way to describe time together without giving private details.", "I like to spend time with my family at weekends."],
    ["get together", "se retrouver, se réunir", "Meet socially with friends or family.", "We try to get together when everyone is free."],
    ["have people over", "recevoir du monde chez soi", "Invite people to your home.", "We had some friends over for dinner last weekend."],
    ["keep it low-key", "faire simple, rester tranquille", "Choose a relaxed plan without much activity or fuss.", "We kept it low-key and had lunch at home."],
    ["head out for a walk", "partir se promener", "Leave to go for a walk.", "If the weather’s good, I like to head out for a walk."],
    ["What did you get up to?", "Qu’avez-vous fait ?", "An informal question about what someone did.", "What did you get up to over the weekend?"]
  ],
  "⚽ Hobbies, soccer & travel": [
    ["be into something", "aimer beaucoup quelque chose", "A conversational way to describe an interest.", "I’m into soccer. I like watching a good match."],
    ["get into something", "se mettre à quelque chose", "Start to be interested in an activity.", "How did you get into following that team?"],
    ["follow a team", "suivre une équipe", "Keep up with a team’s matches and results.", "Do you follow a team, or do you just watch the big games?"],
    ["catch a game", "regarder ou aller voir un match", "Watch a match on TV or in person.", "Did you catch the game last night?"],
    ["show someone around", "faire découvrir un endroit à quelqu’un", "Take a visitor to see places you know.", "If I have time, I’ll show you around."],
    ["worth a visit", "qui vaut le détour", "A place that you think is worth seeing.", "Which part of town do you think is worth a visit?"],
    ["football / soccer", "football", "Soccer is the usual U.S. word for the sport called football in the UK.", "Do you watch much soccer?"]
  ],
  "🍷 Wine tasting & the club": [
    ["a wine-tasting club", "un club / une association de dégustation de vin", "A natural way to describe an association that meets to taste and discuss wines.", "I’m part of a wine-tasting club."],
    ["a tasting", "une dégustation", "An event where people sample wines and compare impressions.", "Our club sometimes gets together for a tasting."],
    ["a blind tasting", "une dégustation à l’aveugle", "A tasting where the wine’s identity is hidden at first.", "Have you ever done a blind tasting?"],
    ["compare notes", "comparer ses impressions", "Share what each person noticed.", "We taste the wines and compare notes."],
    ["a hint of cherry", "une légère note de cerise", "A subtle aroma or flavour that reminds you of cherry.", "I’m getting a hint of cherry. What do you notice?"],
    ["dry", "sec", "A tasting word for wine with little perceived sweetness.", "I’d say it’s fairly dry. What do you think?"],
    ["full-bodied", "corsé, avec du corps", "Describes a wine that feels rich or substantial in the mouth.", "This red feels more full-bodied than the last one."],
    ["the finish", "la finale, la persistance en bouche", "The sensations that remain after tasting.", "It has a slightly spicy finish."],
    ["pairs well with", "s’accorde bien avec", "Tastes good alongside a particular food.", "I think this would pair well with roast chicken."]
  ],
  "🤝 Meetings & leadership": [
    ["Shall we get started?", "On commence ?", "A friendly way to open a meeting.", "Shall we get started? We have one decision to make."],
    ["Could you walk us through it?", "Pourriez-vous nous expliquer cela étape par étape ?", "Invite someone to explain the process or issue.", "Could you walk us through what happened at the inspection stage?"],
    ["What’s your take on this?", "Quel est votre avis là-dessus ?", "Invite someone to give a view.", "We’ve heard from production. What’s your take on this from the quality side?"],
    ["I see your point. My concern is…", "Je vois ce que vous voulez dire. Ce qui m’inquiète, c’est…", "Acknowledge someone’s view before raising a concern.", "I see your point. My concern is the deadline."],
    ["take the lead on", "piloter, prendre en charge", "Take primary responsibility for getting something done.", "Could you take the lead on the follow-up check?"],
    ["flag a concern", "signaler un point préoccupant", "Draw attention to a possible issue.", "I’d like to flag a concern about the test results."],
    ["follow up with", "reprendre contact avec / faire le suivi auprès de", "Contact someone again to check the status or share an update.", "I’ll follow up with the quality team at two."],
    ["What do you need from me?", "De quoi avez-vous besoin de ma part ?", "Offer practical support when delegating.", "Could you review the checklist? What do you need from me?"],
    ["Just to recap…", "Pour récapituler…", "Signal that you are confirming the decision or the next step.", "Just to recap, I’ll send the notes by the end of the day."]
  ],
  "⚙ Inspection, quality & production": [
    ["a batch", "un lot", "A group of parts produced or tracked together.", "Two parts in this batch need a second check."],
    ["within tolerance", "dans les tolérances", "Inside the permitted measurement range.", "The readings from the second station are within tolerance."],
    ["outside tolerance", "hors tolérances", "Beyond the permitted measurement range.", "Two readings came back outside tolerance."],
    ["a fixture", "un montage de maintien, un outillage", "A device that holds a part in position for an operation or a check.", "We’ll check the fixture before we repeat the measurement."],
    ["a reading", "une valeur mesurée, un relevé", "A value shown by a measuring instrument.", "Could you log the readings from both stations?"],
    ["rework", "retouche, reprise", "Additional work to bring a part into line with requirements.", "We need quality to confirm whether rework is possible."],
    ["a bottleneck", "un goulet d’étranglement", "A step that limits how fast work moves through the process.", "The inspection queue is a bottleneck this week."],
    ["a handover", "un passage de relais", "Transfer information or responsibility to the next person or team.", "Let’s flag the open issue during the shift handover."],
    ["root cause", "cause profonde", "The underlying reason a problem occurs.", "We’ve seen the symptom. We’re still investigating the root cause."],
    ["put a batch on hold", "mettre un lot en attente", "Temporarily stop a batch from moving to the next stage.", "I’d suggest putting the batch on hold until quality has reviewed the new readings."]
  ]
};


// Deeper, categorised vocabulary for substantial social and professional conversation.
Object.assign(vocabulary, {
  "👨‍👩‍👧‍👦 Family & relationships — depth": [
    ["extended family", "famille élargie", "Relatives beyond parents, siblings and children.", "When possible, I enjoy spending time with my extended family."],
    ["keep in touch", "garder le contact", "Stay connected through messages, calls or visits.", "We keep in touch even when our schedules are busy."],
    ["be close to", "être proche de", "Have a strong emotional connection with someone.", "I'm close to my family, and we try to see one another regularly."],
    ["make time for", "prendre du temps pour", "Prioritise a person or activity despite other commitments.", "I try to make time for family meals during busy weeks."],
    ["a family tradition", "une tradition familiale", "An activity or custom shared across time.", "One of our family traditions is getting together for a special meal."],
    ["share responsibilities", "partager les responsabilités", "Divide practical tasks and commitments.", "We share responsibilities so everyone has time for their own activities."],
    ["balance work and family life", "équilibrer travail et vie familiale", "Manage competing personal and professional demands.", "It can be challenging to balance work and family life during a project launch."],
    ["a memorable occasion", "une occasion marquante", "An event that remains meaningful.", "A memorable occasion for us was a family celebration last summer."],
    ["get along with", "bien s'entendre avec", "Have a positive relationship with someone.", "We get along well because we respect each other's interests."],
    ["value quality time", "accorder de l'importance aux moments de qualité", "Prefer meaningful time together over quantity alone.", "I value quality time together, even if it's only a short weekend visit."]
  ],
  "🏃 Interests, activities & motivation": [
    ["take up a hobby", "se mettre à une activité", "Begin doing a new activity regularly.", "I took up this hobby because I wanted to learn something different."],
    ["get involved in an association", "s'engager dans une association", "Participate in a club or community group.", "I got involved in an association to meet people who share my interests."],
    ["attend an event", "assister à un événement", "Go to a scheduled gathering.", "We attend events where members share their knowledge."],
    ["organise a gathering", "organiser une rencontre", "Arrange a meeting or social occasion.", "Some members organise gatherings to explore a particular theme."],
    ["develop an interest in", "développer un intérêt pour", "Gradually become more interested in a subject.", "I've developed an interest in how wine reflects its region."],
    ["make the most of", "profiter pleinement de", "Use available time or opportunities well.", "I try to make the most of my weekends when work is busy."],
    ["switch off from work", "déconnecter du travail", "Mentally relax away from professional obligations.", "A good conversation with friends helps me switch off from work."],
    ["a rewarding experience", "une expérience enrichissante", "Something satisfying because you learn or contribute.", "Being part of an association has been a rewarding experience."],
    ["share a passion", "partager une passion", "Enjoy and discuss an enthusiasm with others.", "It's enjoyable to share a passion with people from different backgrounds."],
    ["an activity that brings people together", "une activité qui rassemble", "An interest that encourages social connection.", "Wine tasting is an activity that brings people together around discussion."]
  ],
  "🍇 Wine: appearance & aromas": [
    ["pale / deep colour", "robe pâle / soutenue", "Describe the intensity of the wine's colour.", "This red has a fairly deep colour compared with the previous glass."],
    ["ruby / garnet / golden", "rubis / grenat / doré", "Common colour descriptors depending on the wine.", "The wine has a ruby colour with a slightly garnet edge."],
    ["aroma / bouquet", "arôme / bouquet", "Smells perceived when you bring the glass to your nose.", "The aroma reminds me of ripe red fruit and dried herbs."],
    ["floral notes", "notes florales", "Scents reminiscent of flowers.", "I notice delicate floral notes, especially after swirling the glass."],
    ["citrus notes", "notes d'agrumes", "Lemon, lime or grapefruit-like aromas.", "This white has fresh citrus notes, particularly lemon."],
    ["stone fruit", "fruits à noyau", "Apricot or peach-like aroma descriptors.", "I can detect hints of peach and other stone fruit."],
    ["red berries / black fruit", "fruits rouges / fruits noirs", "Cherry and raspberry or blackberry and blackcurrant-like notes.", "This red seems to show more black fruit than red berries."],
    ["spicy / herbal / earthy", "épicé / herbacé / terreux", "Non-fruit descriptors used for some wines.", "I find it slightly spicy, with an earthy note on the finish."],
    ["subtle / pronounced", "subtil / prononcé", "Describe how faint or strong a characteristic seems.", "The fruit aroma is pronounced, but the floral note is subtle."],
    ["swirl the glass", "faire tourner le vin dans le verre", "Move the wine gently to release aromas.", "Swirl the glass gently and see whether you notice anything new."]
  ],
  "🍷 Wine: palate, structure & finish": [
    ["acidity", "acidité", "Fresh, mouth-watering sensation; not the same as sourness.", "The lively acidity makes this wine taste fresh."],
    ["tannins", "tanins", "Compounds that can create a drying or grippy sensation, especially in reds.", "The tannins feel firm but not harsh."],
    ["body / mouthfeel", "corps / sensation en bouche", "The wine's weight and texture in the mouth.", "It has a medium body and a smooth mouthfeel."],
    ["light-bodied / medium-bodied / full-bodied", "léger / moyennement corsé / corsé", "Words for the wine's perceived weight.", "Compared with the first sample, this one is more full-bodied."],
    ["crisp / refreshing", "vif / rafraîchissant", "Often used when noticeable acidity feels pleasant.", "It's a crisp white wine that could work well as an aperitif."],
    ["smooth / velvety", "souple / velouté", "Describe a soft, pleasant texture.", "The texture is smooth, almost velvety."],
    ["balanced", "équilibré", "No single element overwhelms the others.", "To me, it's well balanced: the fruit, acidity and tannins work together."],
    ["dry / off-dry / sweet", "sec / demi-sec / doux", "Describe the perceived level of sweetness.", "It tastes dry rather than sweet, despite its fruity aromas."],
    ["a lingering finish", "une finale persistante", "Flavours and sensations remain for some time after swallowing.", "It has a lingering finish with a gentle spicy note."],
    ["food pairing", "accord mets et vins", "Choosing food and wine that complement one another.", "I'd suggest a food pairing with grilled vegetables or poultry."]
  ],
  "🗣️ Explaining your association": [
    ["members come from different backgrounds", "les membres ont des parcours variés", "Emphasise the diversity of participants.", "Our members come from different backgrounds, which makes the discussion interesting."],
    ["explore a wine region", "découvrir une région viticole", "Learn about wine production and styles in an area.", "We sometimes explore a wine region through several representative bottles."],
    ["learn about grape varieties", "découvrir les cépages", "Understand characteristics of different grapes.", "We learn about grape varieties and how they influence style."],
    ["compare wines side by side", "comparer des vins côte à côte", "Taste multiple wines to notice differences.", "We compare wines side by side rather than tasting them in isolation."],
    ["share impressions rather than judge", "partager ses impressions plutôt que juger", "Invite different perceptions without right-or-wrong pressure.", "The aim is to share impressions rather than judge who is right."],
    ["I am still learning", "j'apprends encore", "A humble way to present expertise.", "I'm still learning, and that's what makes each tasting interesting."],
    ["to put it simply", "pour faire simple", "Signal an accessible explanation for someone unfamiliar with the topic.", "To put it simply, acidity gives freshness and tannins can give structure."],
    ["what stands out to me is…", "ce qui me frappe, c'est…", "Introduce your most striking observation.", "What stands out to me is the freshness and the long finish."],
    ["would you like to try it?", "souhaitez-vous le goûter ?", "Polite invitation without pressure.", "Would you like to try it and tell me what you notice?"],
    ["it depends on personal taste", "c'est une question de goût", "Respect different preferences.", "It depends on personal taste; some people prefer more acidity and others prefer a richer style."]
  ]
});

const grammar = [
  {
    title: "Habits and arrangements",
    use: "Use the present simple for your routines and interests. Use the present continuous for an arrangement that has been made or for an activity in progress.",
    forms: [["+ habit", "I go to tastings when I can."], ["− habit", "I don’t go every month."], ["? habit", "Do you go often?"], ["+ arrangement", "I’m meeting a colleague for lunch tomorrow."], ["− arrangement", "I’m not joining the call this afternoon."], ["? arrangement", "Are you meeting the team tomorrow?"]],
    tip: "Frequency words like usually often go before the main verb. With be, they usually follow it. “I usually go” and “I’m usually free on Fridays.”",
    fr: "Présent simple pour les habitudes. Be + verbe en -ing pour un rendez-vous prévu ou une action en cours. Usually suit généralement be."
  },
  {
    title: "Tell a story or ask about experience",
    use: "Use the past simple with a finished time, like last weekend or in October. Use have/has + past participle for experience up to now or when a result matters now.",
    forms: [["+ past", "I went to a tasting last Saturday."], ["− past", "I didn’t go to the one in May."], ["? past", "Did you go last Saturday?"], ["+ experience", "I’ve been to a few tastings."], ["− experience", "I haven’t tried that wine yet."], ["? experience", "Have you ever tried a blind tasting?"]],
    tip: "A natural exchange moves from experience to a finished event. “Have you ever been to Montréal?” → “Yes, I have.” → “When did you go?” After did, use the base verb. “Did you go?”",
    fr: "Passé simple anglais avec un moment passé terminé. Present perfect pour un bilan ou une expérience jusqu’à maintenant. Après did, mettez la base verbale."
  },
  {
    title: "Ask questions people want to answer",
    use: "Use an open question for details. Start a polite request with Could you …? In an embedded question, keep statement word order after the question word.",
    forms: [["Open", "What do you like about it?"], ["Subject question", "Who checked the readings?"], ["Direct", "When does the test start?"], ["Embedded", "Could you tell me when the test starts?"], ["Clarification", "When you say ‘checked,’ do you mean visually or with a gauge?"]],
    tip: "Who checked the readings? uses no do because who is the subject. In “Who did you ask?”, you is the subject.",
    fr: "Question directe avec auxiliaire si nécessaire. Dans une question indirecte après Could you tell me…, gardez l’ordre sujet + verbe. Pas de do si who est le sujet."
  },
  {
    title: "Suggest, invite and delegate",
    use: "Use could for an option or a polite request, should for advice, and suggest + -ing or suggest (that) + subject + base verb for a proposal.",
    forms: [["Option", "We could repeat the check."], ["Advice", "We should tell the incoming shift."], ["Request", "Could you take the lead on this?"], ["Proposal", "I suggest checking the fixture first."], ["Alternative", "I suggest we check the fixture first."], ["Negative", "We shouldn’t move the batch yet."]],
    tip: "After could or should, use the base verb. A clear request includes the outcome and timing. “Could you check the readings and update us by two?”",
    fr: "Could et should se construisent avec la base verbale. Après suggest, utilisez le verbe en -ing ou une proposition comme we check."
  },
  {
    title: "Report facts and uncertainty",
    use: "Use active voice to name the actor. Use be + past participle when the action or result matters more. Use may or might to signal a possible explanation.",
    forms: [["Active", "Quality checked the readings."], ["Passive", "The readings were checked this morning."], ["Negative", "The cause hasn’t been confirmed yet."], ["Question", "Was the fixture checked?"], ["Possibility", "The fixture might be affecting the readings."]],
    tip: "Separate the observation from the hypothesis. “We found two parts outside tolerance” reports a result. “The fixture may be involved” leaves the cause open.",
    fr: "Voix passive avec be + participe passé. May et might expriment une possibilité. Distinguez le constat de l’hypothèse."
  }
];


// Additional B1+/B2 patterns, taught with form, meaning and contrast.
grammar.push(
  {
    title: "Present perfect continuous — interests and duration",
    use: "Use have/has been + verb-ing for an activity that began in the past and continues or has a present result. Use for + duration and since + starting point. Compare with the present perfect simple for completed achievements or totals.",
    forms: [["Affirmative", "I've been attending tastings for several years."],["Negative", "I haven't been going very regularly lately."],["Question", "How long have you been involved in the association?"],["Since", "She's been learning about wine since 2021."],["Simple vs continuous", "I've attended six events this year (total). / I've been attending events this year (ongoing activity)."]],
    tip: "Use for two years, since 2024. Avoid I am attending for three years for an activity begun in the past. State verbs such as know usually use the simple form: I've known him for years.",
    fr: "Have/has been + -ing : activité commencée dans le passé et encore liée au présent. For = durée ; since = point de départ."
  },
  {
    title: "Used to, would and be used to — past and familiar habits",
    use: "Use used to + base verb for a past state or regular activity that is no longer true; would + base verb for repeated past actions in a narrative (not generally past states); be used to + noun/-ing for being accustomed to something.",
    forms: [["Past habit", "I used to play football every weekend."],["Negative", "I didn't use to know much about wine."],["Question", "Did you use to travel regularly?"],["Repeated past action", "At university, we would meet on Fridays."],["Familiarity", "I'm used to presenting in English now."],["New familiarity", "I'm getting used to speaking spontaneously."]],
    tip: "Did you use to...? (not did you used to). Be used to + -ing differs from used to + base verb.",
    fr: "Used to + infinitif sans to : ancienne habitude. Be used to + -ing : être habitué à."
  },
  {
    title: "Past continuous and past perfect — richer stories",
    use: "Use was/were + -ing for the background action; past simple for the interrupting event. Use had + past participle for something completed before another past point.",
    forms: [["Background", "We were discussing the aromas when a new guest arrived."],["Negative", "I wasn't expecting such a strong contrast."],["Question", "What were you doing when you noticed it?"],["Earlier past", "I'd already tried the first wine before the discussion began."],["Past perfect negative", "I hadn't realised how different the styles were."],["Past perfect question", "Had you tasted anything similar before?"]],
    tip: "Don't use past perfect for every event in a chronological story. It is useful only when you need to make an earlier event clear.",
    fr: "Past continuous = décor ou action en cours dans le passé ; past perfect = événement antérieur à un autre moment passé."
  },
  {
    title: "Future plans, predictions and commitments",
    use: "Use be going to for an intention, present continuous for a confirmed arrangement, will for a spontaneous decision, offer or prediction, and present simple for an official schedule.",
    forms: [["Intention", "I'm going to attend the next event."],["Arrangement", "We're meeting the group on Thursday."],["Promise", "I'll send you the details tomorrow."],["Negative intention", "I'm not going to stay for the full session."],["Question", "Are you going to join us?"],["Schedule", "The tasting starts at seven."]],
    tip: "Avoid using will for every future event. Choose the form that expresses intention, arrangement, spontaneous decision or timetable.",
    fr: "Going to = intention ; présent en -ing = rendez-vous fixé ; will = décision immédiate / promesse ; présent simple = horaires."
  },
  {
    title: "Comparison, degree and nuance",
    use: "Use comparative + than for contrasts, as + adjective + as for equality, slightly/far/much for degree, and whereas/while to compare complete clauses.",
    forms: [["Comparative", "This wine is lighter than the previous one."],["Long adjective", "This explanation is more detailed than mine."],["Equality", "The second wine isn't as acidic as the first."],["Degree", "It's slightly fruitier but much less tannic."],["Contrast", "Whereas the first was crisp, the second is rounder."],["Question", "Which style do you find more approachable?"]],
    tip: "Short adjectives often take -er (light → lighter); longer ones use more (balanced → more balanced). Good → better, bad → worse. Not more better.",
    fr: "Comparatif en -er ou avec more, as…as, et nuances avec slightly, much, far."
  },
  {
    title: "Relative clauses — add useful information",
    use: "Use who for people, which for things and that in defining clauses. Non-defining extra information takes commas and who/which, not that.",
    forms: [["Person", "I know a member who organises the tastings."],["Thing", "It's an association that brings people together."],["Place", "We visited a region where several grape varieties are grown."],["Extra detail", "The Loire Valley, which has many wine styles, is fascinating."],["Negative", "I don't know anyone who dislikes every kind of wine."],["Question", "Is that the bottle you mentioned earlier?"]],
    tip: "Use who, which, where, whose appropriately. You can omit the relative pronoun when it is the object: the wine (that) we tasted.",
    fr: "Who = personnes ; which = choses ; where = lieux ; dont = whose pour la possession. Les propositions non essentielles prennent une virgule."
  },
  {
    title: "First and second conditionals — real possibilities and imagination",
    use: "First conditional: if + present, will/can + base verb for a possible future. Second: if + past, would/could + base verb for a hypothetical situation now or in the future.",
    forms: [["Real", "If you enjoy fresh whites, you'll probably like this one."],["Real negative", "If the weather is poor, we won't eat outside."],["Real question", "What will you do if the event is cancelled?"],["Hypothetical", "If I had more time, I'd visit more vineyards."],["Hypothetical negative", "I wouldn't choose that wine if the dish was very spicy."],["Polite hypothetical", "If you were new to wine, where would you start?"]],
    tip: "Do not usually put will in the if-clause of a first conditional. In formal English, If I were… is preferred for hypothetical situations.",
    fr: "Premier conditionnel = possibilité réelle ; deuxième = situation imaginaire. Pas de will après if dans la proposition conditionnelle standard."
  },
  {
    title: "Third conditional — reflect on an earlier choice",
    use: "Use if + had + past participle, would have + past participle to imagine a different result in the past. This is useful for stories and professional debriefs.",
    forms: [["Affirmative", "If I'd known about the event, I would have attended."],["Negative", "If we hadn't checked again, we might have missed the issue."],["Question", "What would you have done if the schedule had changed?"],["Could have", "We could have invited more guests if we'd had space."],["Contrast", "We didn't know, so we didn't attend; if we'd known, we'd have gone."]],
    tip: "If I would have known is not the standard form. Use If I had known, I would have… .",
    fr: "Troisième conditionnel : if + had + participe passé ; would have + participe passé. Pour imaginer un autre passé."
  },
  {
    title: "Verb patterns and natural explanations",
    use: "Some verbs take to + infinitive (decide, hope, plan, want); others take -ing (enjoy, avoid, consider); after prepositions use a noun or -ing. Help can take the base verb or to-infinitive.",
    forms: [["To-infinitive", "I decided to join an association."],["-ing", "I enjoy discovering new styles."],["Preposition + -ing", "I'm interested in learning more."],["Negative", "I try to avoid talking only about work."],["Question", "Would you consider organising a tasting?"],["Purpose", "We meet to exchange ideas."]],
    tip: "Look forward to + -ing (I look forward to meeting you); would like + to-infinitive (I'd like to attend). Do not say enjoy to taste.",
    fr: "Certains verbes sont suivis de to + infinitif, d'autres de -ing. Après une préposition : -ing."
  },
  {
    title: "Discourse markers — organise detailed answers",
    use: "Use actually to correct or add nuance, for example to illustrate, although to contrast with a clause, despite to contrast with a noun or -ing, and on the whole to summarise.",
    forms: [["Sequence", "To begin with, we look at the colour; then we discuss the aromas."],["Example", "For example, one wine may have floral notes."],["Concession", "Although it's quite dry, it tastes fruity."],["Different pattern", "Despite being dry, it tastes fruity."],["Correction", "Actually, I joined the group only recently."],["Conclusion", "On the whole, I prefer lighter styles."]],
    tip: "Although + subject + verb; despite + noun or -ing. Because + clause; because of + noun. Use connectors to guide the listener, not to sound academic.",
    fr: "Although + proposition ; despite + nom / -ing. Because + proposition ; because of + nom."
  }
);

function choice(id, prompt, options, correct, hint, why, fr) {
  return { id, prompt, options, correct, hint, why, fr };
}
function blank(id, prompt, answers, hint, why, fr) {
  return { id, prompt, answers, hint, why, fr };
}

const phraseQuestions = [
  choice("p1", "A colleague says, “I joined a tennis club last year.” Keep the conversation moving.", ["How did you get into tennis?", "Can we circle back to the agenda?", "I’ll find out who’s responsible."], 0, "Ask about the beginning of the hobby.", "It follows up on the new information and invites a story.", "Posez une question sur le début de cette activité."),
  choice("p2", "Someone asks about your weekend. Give a friendly answer and pass the conversation back.", ["Good, thanks. See you around.", "Pretty relaxed. I spent time with family. How about you?", "I’m available at two if you need me."], 1, "Look for a detail and a question.", "Pretty relaxed is a natural short answer. How about you? gives the other person a turn.", "Choisissez une réponse avec un détail et une question en retour."),
  choice("p3", "Explain what happens at your wine-tasting club.", ["We have people over every time.", "We’re looking into the readings.", "We taste a few wines and compare notes."], 2, "Think of exchanging impressions.", "Compare notes means share what each person noticed.", "Expliquez que vous goûtez et comparez vos impressions."),
  choice("p4", "You couldn’t hear the end of a sentence. What do you say?", ["I’m not sure I agree with that.", "Sorry, would you mind saying the last part again?", "It was great catching up."], 1, "Ask explicitly for repetition.", "Would you mind + -ing is a polite way to ask someone to repeat something.", "Demandez de répéter la fin de la phrase."),
  choice("p5", "Invite someone from quality to give an opinion.", ["What’s your take on this?", "Could you take the lead on the inspection?", "I’ll keep you posted."], 0, "Ask for a view.", "What’s your take on this? invites an opinion in a conversational way.", "Invitez la personne du service qualité à donner son avis."),
  choice("p6", "Both teams agree on a decision. Signal that you are about to confirm it.", ["How did you get into that?", "Let me get this straight. I missed it.", "Just to recap, here’s what we agreed."], 2, "Find the phrase that introduces a brief summary.", "Just to recap signals a summary of a discussion or decision.", "Annoncez que vous allez récapituler la décision."),
  choice("p7", "Which line reports a result and keeps the cause open?", ["The fixture caused both problems.", "Two readings are outside tolerance. We’re still investigating the cause.", "Everything is within tolerance."], 1, "Choose a measurement and an open question, not a diagnosis.", "The first sentence is the observation. The second keeps the cause open.", "Distinguez le résultat mesuré de la cause encore inconnue."),
  choice("p8", "You want to end a friendly catch-up before the meeting begins.", ["It was great catching up. See you in there.", "What have you been up to lately?", "Did you say the meeting was cancelled?"], 0, "Use a warm closing and refer to the next time you’ll see each other.", "It was great catching up closes the conversation naturally.", "Terminez chaleureusement avant la réunion.")
];

const grammarQuestions = [
  blank("g1", "I usually ___ the match with friends. (watch)", ["watch"], "A first-person habit takes the base form.", "Usually signals a habit here. Use the present simple.", "Complétez avec le présent simple."),
  blank("g2", "I ___ a colleague for lunch tomorrow. It’s already arranged. (meet)", ["am meeting", "'m meeting"], "Use am + -ing for this fixed arrangement.", "The present continuous describes a planned arrangement here.", "Le rendez-vous est déjà fixé. Utilisez be + -ing."),
  blank("g3", "I ___ to a tasting last Saturday. (go)", ["went"], "Last Saturday is a finished time. Go is irregular.", "Went is the past simple of go.", "Last Saturday situe l’action dans le passé terminé."),
  blank("g4", "___ you ever tried a blind tasting? (have)", ["have"], "Ask about someone’s experience up to now.", "Have + subject + past participle forms this present perfect question.", "Posez une question sur une expérience."),
  blank("g5", "Could you tell me when the inspection ___? (start; present simple)", ["starts"], "After when, use the inspection + verb.", "The inspection is singular. Use starts in statement word order.", "Gardez l’ordre sujet + verbe après when."),
  choice("g6", "Find out who performed the check.", ["Who did checked the readings?", "Who checked the readings?", "Who the readings checked?"], 1, "Who is the subject of the verb here.", "When who asks for the subject, use who + checked.", "Who représente la personne qui a effectué le contrôle."),
  blank("g7", "I suggest ___ the fixture before the next check. (inspect)", ["inspecting"], "A verb immediately after suggest takes -ing.", "Suggest + -ing names the action you propose.", "Utilisez la forme en -ing après suggest."),
  choice("g8", "Which sentence makes a polite request and gives a clear deadline?", ["Could you to send the readings by two?", "Do you sent the readings by two?", "Could you send the readings by two?"], 2, "Could + you + base verb.", "Send stays in the base form after could. By two sets the deadline.", "Choisissez une demande polie avec une heure limite."),
  blank("g9", "The readings ___ checked this morning. (be; past simple)", ["were"], "The subject, readings, is plural.", "Were + checked forms a past simple passive.", "Complétez cette phrase passive au passé."),
  blank("g10", "The fixture might ___ the readings. (affect)", ["affect"], "A modal is followed by the base verb.", "Might + affect suggests a possible explanation.", "Might introduit une hypothèse. Ajoutez la base verbale.")
];


phraseQuestions.push(
  choice("p10","You meet a new American colleague. Which opener is polished but natural?",["Yo, what's up?","How have things been since the kickoff?","I require information about your personal life."],1,"Choose friendly standard English rather than slang or stiff wording.","How have things been? is conversational without being overly casual.","Choisissez un registre naturel et courtois."),
  choice("p11","A guest at a tasting has never tried red wine. Choose the most approachable description.",["Its polyphenolic extraction exceeds the norm.","It has a pleasant cherry aroma and feels smooth in the mouth.","This red slaps."],1,"Use two sensory impressions that an interested non-expert can understand.","Cherry aroma and smooth texture are specific, accurate descriptions without specialist jargon or slang.","Privilégiez deux sensations faciles à comprendre."),
  choice("p12","A colleague says, 'We just chilled.' What is the closest neutral meaning?",["We had a relaxing time.","We changed our schedule.","We became cold."],0,"This informal verb means to relax.","Chilled is very informal here; had a relaxing time is neutral.","Chilled = se détendre dans ce contexte."),
  choice("p13","How would you politely ask a guest to describe an aroma?",["Tell me the right answer.","Do you notice any fruit or floral notes?","You don't understand wine, do you?"],1,"Offer two accessible categories and invite their opinion.","The question supports the guest without assuming expertise.","Une invitation ouverte et bienveillante."),
  choice("p14","Choose the best way to describe a family activity without disclosing private details.",["I should give you all my family's personal information.","We try to organise family meals when everyone's available.","My family is good."],1,"A specific activity is more engaging and respects privacy.","The sentence gives a real conversational topic while leaving personal boundaries intact.","Décrivez une activité concrète sans détails intimes."),
  choice("p15","In a professional meeting, a colleague says 'Let's circle back'. What do they mean?",["Let's drink something.","Let's return to this topic later.","Let's conclude immediately."],1,"This idiom refers to discussion, not physical movement.","Circle back is conversational business language; return to this topic is the neutral equivalent.","Revenir sur le sujet ultérieurement."),
  choice("p16","Which reply best builds a real conversation?",["I like wine.","I enjoy tastings because different people notice different aromas. Have you ever tried one?","Yes."],1,"Add why, give an example, ask the other person.","A reason and genuine follow-up encourage an exchange.","Ajoutez un motif et une vraie question.")
);

grammarQuestions.push(
  blank("g11","I've been ___ part in tastings for two years. (take)",["taking"],"Have been + verb-ing.","Present perfect continuous describes an activity extending to now.","Have been + -ing."),
  choice("g12","Choose the correct duration expression.",["I've belonged to the club since three years.","I've belonged to the club for three years.","I'm belonging to the club for three years."],1,"For + duration; since + starting point.","For three years expresses duration; belong is normally not continuous.","For exprime une durée."),
  blank("g13","I used to ___ football every Saturday. (play)",["play"],"Used to + base verb.","Used to describes a past regular habit.","Used to + base verb."),
  blank("g14","I'm used to ___ presentations in English now. (give)",["giving"],"Be used to + -ing.","This phrase means that presenting has become familiar.","Be used to + -ing."),
  blank("g15","We ___ discussing the tasting when the guest arrived. (be)",["were"],"We + were + -ing.","Past continuous provides the background action.","Past continuous au pluriel."),
  blank("g16","I had already ___ that variety before the event started. (try)",["tried"],"Had + past participle.","Past perfect places one action before another past event.","Had + participe passé."),
  choice("g17","The tasting is booked for next Friday. Choose the best form.",["We're meeting next Friday.","We meet now tomorrow.","We will meeting next Friday."],0,"A confirmed arrangement often uses present continuous.","We're meeting indicates a fixed arrangement.","Présent continu pour un rendez-vous fixé."),
  blank("g18","This red is slightly ___ than the first one. (light)",["lighter"],"Comparative: adjective + -er for light.","Lighter than is the regular comparative.","Comparatif en -er."),
  blank("g19","The second wine isn't as ___ as the first. (acidic)",["acidic"],"As + adjective + as.","The adjective is unchanged in equality comparisons.","As + adjectif + as."),
  choice("g20","Choose a natural relative clause.",["It's a club who meets monthly.","It's a club that brings people together.","It's a club what joins people."],1,"A club is a thing/organisation; that fits a defining clause.","That introduces a defining relative clause.","That introduit une relative déterminative."),
  blank("g21","The Loire Valley, ___ has many wine styles, is worth exploring.",["which"],"A non-defining clause about a place as a thing takes which.","Which follows a comma and adds extra information.","Which dans une relative non déterminative."),
  blank("g22","If you prefer a lighter style, you ___ probably enjoy this wine. (will)",["will","'ll"],"If + present, will + base verb.","First conditional connects a real preference with a possible outcome.","Premier conditionnel."),
  blank("g23","If I ___ more time, I'd join another association. (have)",["had"],"Second conditional: if + past, would + base verb.","Had is the hypothetical past form.","Deuxième conditionnel."),
  blank("g24","If I'd known about the tasting, I would have ___. (go)",["gone"],"Would have + past participle of go.","Third conditional reflects on a different past outcome.","Troisième conditionnel."),
  choice("g25","Which sentence has the correct verb pattern?",["I enjoy to discover new regions.","I enjoy discovering new regions.","I enjoy discover new regions."],1,"Enjoy + verb-ing.","Enjoy discovering is correct.","Enjoy + -ing."),
  blank("g26","I look forward to ___ you at the next session. (see)",["seeing"],"Here to is a preposition, so use -ing.","Look forward to seeing is the standard pattern.","Look forward to + -ing."),
  choice("g27","Choose the correct contrast.",["Despite it's dry, it tastes fruity.","Although it's dry, it tastes fruity.","Although being dry, it tastes fruity."],1,"Although + subject + verb.","Although it's dry introduces a complete clause.","Although + proposition."),
  blank("g28","Despite ___ tired, we enjoyed the event. (be)",["being"],"Despite + noun or -ing.","Despite being tired is idiomatic.","Despite + -ing."),
  blank("g29","I didn't ___ to understand the difference between acidity and sweetness. (use)",["use"],"After didn't, use the base form.","Didn't use to is the standard negative.","Didn't use to."),
  choice("g30","Choose the correct question to deepen a conversation.",["How long you have been a member?","How long have you been a member?","How long are you a member since?"],1,"Present perfect question: how long + have + subject + past participle.","How long have you been a member? asks about a period continuing until now.","Question sur la durée jusqu'à présent."),
  blank("g31","We could ___ different bottles side by side. (compare)",["compare"],"After could, use the base verb.","Could + compare suggests a possible activity.","Could + base verb."),
  choice("g32","Select the most natural explanation of a past experience.",["I had gone to a wine tasting yesterday and I have meet friends.","I went to a tasting yesterday and met some interesting people.","I have went yesterday to a tasting."],1,"Yesterday requires past simple; irregular meet → met.","Both actions happened at a finished past time.","Past simple pour hier."),
  choice("g33","Choose a polite, indirect question.",["Could you tell me how does the club work?","Could you tell me how the club works?","Can you tell how works the club?"],1,"An embedded question uses statement word order.","How the club works follows tell me.","Question indirecte : sujet + verbe."),
  blank("g34","What would you have done if the event ___ been cancelled? (have)",["had"],"If + had + past participle for an unreal past.","The question uses a third conditional.","If + past perfect."),
  choice("g35","Which is a stronger yet accessible wine description?",["Very good and nice.","It feels balanced, with lively acidity and a lingering finish.","This is the most incredible wine ever made."],1,"Use objective sensory features and moderate claims.","The middle option is precise, accessible and suitably measured.","Description sensorielle précise et nuancée.")
);

const listening = [
  {
    title: "Lunch with a colleague", task: "Listen for why the club appeals to the speaker and how the colleague keeps the conversation moving.",
    fr: "Repérez ce qui plaît dans le club et comment le collègue relance la conversation.",
    lines: [["Jordan","What do you usually do at weekends?"],["Alex","I’m part of a wine-tasting club. What I like most is hearing how differently people describe the same wine."],["Jordan","That sounds fun. How did you get into it?"],["Alex","A friend invited me along. Have you ever tried a blind tasting?"]],
    cue: "Reply as Jordan. Share an experience, or say you haven’t tried it and ask what happens.",
    questions: [
      choice("l1","What does Alex especially enjoy?",["Visiting a new vineyard each weekend.","Hearing other people’s impressions.","Learning to identify the price of a wine."],1,"Listen after “What I like most…”","Alex likes hearing how differently people describe the same wine.","Repérez ce qui plaît le plus à Alex."),
      choice("l2","How does Jordan follow up?",["Jordan asks how Alex got interested.","Jordan invites Alex to a tasting.","Jordan asks where the wine was made."],0,"Listen to Jordan’s second turn.","“How did you get into it?” asks how the interest began.","Écoutez la deuxième réplique de Jordan.")
    ]
  },
  {
    title: "A decision in the daily huddle", task: "Listen for the action, its owner and the deadline.",
    fr: "Repérez l’action, la personne responsable et l’heure limite.",
    lines: [["Casey","We still need a second check. Riley, could you take the lead on that?"],["Riley","I can check the fixture before lunch, but I’ll need someone from quality for the repeat measurement."],["Casey","I’ll arrange that. Please send me both readings by two. I’ll update the team at half past two."]],
    cue: "Reply as Riley. Confirm the two things you will do and the deadline for sending the readings.",
    questions: [
      choice("l3","What will Riley check before lunch?",["The incoming shift’s schedule.","The handover notes.","The fixture."],2,"Listen for the noun after “check the…”","Riley offers to check the fixture before lunch.","Repérez ce que Riley vérifiera avant le déjeuner."),
      blank("l4","By what time should Casey receive both readings? Type the time.",["two","2","2:00","14:00","2 pm","2 p.m.","2:00 pm","two pm","two o’clock","two o'clock","by two","by 2","by 2:00"],"Distinguish the delivery deadline from the time of the team update.","The readings are due by two. The team update is at half past two.","Distinguez l’heure limite de l’heure du point d’équipe.")
    ]
  },
  {
    title: "A technical handover", task: "Listen for what’s been measured and what’s still uncertain.",
    fr: "Repérez ce qui a été mesuré et ce qui reste incertain.",
    lines: [["Taylor","Two parts came back outside tolerance on the first check."],["Morgan","Do we know what caused it?"],["Taylor","The fixture might be involved, but we haven’t confirmed that. Keep the batch on hold and log the second set of readings."],["Morgan","Got it. I’ll flag it during the shift handover."]],
    cue: "Say how you would brief the next shift in two sentences. Include the observation and the action.",
    questions: [
      choice("l5","What is confirmed?",["Two parts were outside tolerance on the first check.","The fixture caused the readings.","The second check cleared the parts."],0,"Listen for the opening observation.","The first measurement is confirmed. The cause is still open.","Repérez le constat confirmé."),
      choice("l6","What should happen to the batch?",["It should move to shipping.","It should stay on hold.","It should be sent for rework immediately."],1,"Listen for the action after the uncertainty.","Taylor says to keep the batch on hold and record the next measurements.","Repérez la consigne pour le lot.")
    ]
  }
];


// Deeper listening: implied meaning, register, paraphrase and oral synthesis.
listening[0].questions.push(
  choice("l7","What does Alex imply about the value of the association?",["It is mainly a competition.","Different perspectives make the experience rewarding.","Members must have expert knowledge."],1,"Listen for 'hearing how differently people describe the same wine'.","The value comes from exchanging different impressions.","Inférence à partir des impressions partagées."),
  choice("l8","Which neutral paraphrase best matches 'How did you get into it?'",["How did you become interested in it?","How did you travel there?","What time did it begin?"],0,"The speaker asks about the origin of an interest.","Become interested in is a neutral paraphrase.","Reformulez l'origine d'un intérêt.")
);
listening[1].questions.push(
  choice("l9","Which action is not yet arranged?",["Riley checking the fixture.","Casey finding someone from quality.","Casey updating the team at 2:30."],1,"Riley says they will need somebody from quality; Casey promises to arrange that.","Casey has not yet arranged support from quality.","Distinguez une promesse d'une action déjà programmée."),
  choice("l10","Which reply correctly confirms owner, action and deadline?",["Okay, whatever.","I'll check the fixture before lunch and send both readings by two once quality has repeated the measurement.","I will send the batch immediately."],1,"Combine the responsibilities and time.","The reply includes action, dependency and deadline.","Réponse structurée : action, dépendance et échéance.")
);
listening[2].questions.push(
  choice("l11","How certain is Taylor that the fixture caused the problem?",["Completely certain.","Not certain; it is only a possibility.","Certain it played no part."],1,"Might and haven't confirmed indicate uncertainty.","Taylor explicitly separates the measured result from a possible cause.","Might + absence de confirmation = hypothèse."),
  choice("l12","Which two ideas should be kept separate in a briefing?",["The observation and the hypothesis.","The building and its location.","The meeting room and the weather."],0,"Notice 'came back outside tolerance' versus 'might be involved'.","Professional clarity requires facts to be distinguished from possible explanations.","Distinguez fait et hypothèse.")
);

const scenarios = [
  {
    id: "lunch", title: "Lunch with a U.S. colleague", topic: "Family & weekends",
    setting: "You’re getting lunch with a colleague you met during the U.S. kickoff. Share only the personal details you feel comfortable sharing.",
    moves: ["Answer the question.", "Add a specific detail.", "Ask a related question back."],
    phrases: ["We kept it pretty low-key.", "We had some friends over.", "How about you?"],
    debrief: "Did you give your colleague something specific to ask you about?",
    turns: [
      ["Hey! Did you do anything fun over the weekend?", "Give a short answer, then one detail. Ask how their weekend went.", "Did you do anything fun? = Avez-vous fait quelque chose de sympa ?", "It was pretty relaxed. I spent time with family. How about you?", "We kept it pretty low-key. I had lunch with family and went out for a walk afterwards. What did you get up to?"],
      ["We had some friends over. Do you get together with family often?", "Use usually, when we can, or it depends. Ask about the friends or the meal.", "get together = se retrouver", "When we can. We usually get together for a meal. What did you make for your friends?", "It depends on everyone’s schedule, but we try to make time for a meal together. What’s your go-to dish when you have friends over?"],
      ["We cooked together, actually. What do you like to do when you get a weekend to yourself?", "Change naturally from family to a hobby. Add a reason and pass the question back.", "when you get a weekend to yourself = quand vous avez un week-end à vous", "I like to watch soccer when I can. Do you follow any teams?", "If I have a free weekend, I like catching a game or going to a wine tasting. What do you make time for when you get a weekend off?"]
    ],
    twist: "I missed the last part. What did you do on Sunday?"
  },
  {
    id: "wine", title: "At your wine-tasting club", topic: "Describe, compare & invite",
    setting: "An English-speaking guest joins a tasting. Help them feel welcome and explain what the club does.",
    moves: ["Explain what happens at a tasting.", "Describe a wine in everyday language.", "Invite the other person’s view."],
    phrases: ["We taste the wines and compare notes.", "I’m getting a hint of cherry.", "What do you notice?"],
    debrief: "Did you check what the guest noticed before giving more detail?",
    turns: [
      ["Is this your first time here? I’m new. How does the club work?", "Say you’re part of the club. Describe what happens and invite them to join in.", "How does the club work? = Comment fonctionne le club ?", "I’m part of the club. We taste a few wines and compare notes. Feel free to join us.", "I’m a member. We usually try a few wines side by side and share what we notice. You’re welcome to taste along and tell us what you think."],
      ["What are you getting from this red? I can’t quite place it.", "Use a hint of or reminds me of. Ask what the guest notices.", "I can’t quite place it. = Je n’arrive pas à identifier ce que c’est.", "I’m getting a hint of cherry. What do you notice?", "It reminds me a little of cherry, especially on the finish. I’d say it’s fairly dry, too. Are you picking up anything different?"],
      ["That’s helpful. Is there a wine you’d recommend I try next?", "Make a recommendation based on a preference or a food pairing.", "pair well with = bien s’accorder avec", "If you like dry whites, try this one. It goes well with seafood.", "If you’re in the mood for something lighter, I’d go for the dry white. It would pair well with seafood. Do you usually prefer whites or reds?"]
    ],
    twist: "What exactly do you mean by ‘the finish’?"
  },
  {
    id: "travel", title: "Soccer, travel & shared interests", topic: "Tell a short story",
    setting: "You’re waiting for a table with an English-speaking visitor. The conversation moves from soccer to travel.",
    moves: ["React to what you hear.", "Ask about experience, then a specific detail.", "Link one topic to the next."],
    phrases: ["Did you catch the game?", "Have you ever been to Montréal?", "What stood out for you?"],
    debrief: "Could you ask a follow-up that used a detail the other person had just given?",
    turns: [
      ["Did you catch the game last night?", "Reply whether you saw it or missed it. Ask what the other person thought.", "catch the game = voir le match", "I missed it. Was it a good game?", "I didn’t get a chance to watch it. I heard it was close, though. What did you make of the second half?"],
      ["It was good. I saw a game in Montréal once, too. Have you ever been there?", "Answer truthfully with your own experience or say you’d like to go. Ask for a detail about their visit.", "Have you ever been there? = Y êtes-vous déjà allé ?", "I haven’t been there yet, but I’d like to go. When did you go?", "I haven’t made it there yet. I’d love to see the city and catch a game if I can. What stood out for you when you went?"],
      ["The atmosphere was great. What would you recommend if I had a free afternoon where you live?", "Suggest a real local place. Say what makes it worth a visit.", "worth a visit = qui vaut le détour", "I’d go to the town centre. It’s a good place for a walk. What do you like to do when you visit a new place?", "If you’ve only got an afternoon, I’d start in the town centre and take a walk from there. It’s a good way to get a feel for the place. Would you rather walk or find somewhere nice to eat?"]
    ],
    twist: "I only have two hours and it’s raining. What would you suggest?"
  },
  {
    id: "meeting", title: "Lead the daily huddle", topic: "Open, invite input & decide",
    setting: "You have ten minutes with production and quality. A second measurement is needed before a batch can move on.",
    moves: ["Name the decision.", "Bring both teams into the discussion.", "Recap the action, owner and timing."],
    phrases: ["Shall we get started?", "What’s your take on this?", "Just to recap…"],
    debrief: "Did everybody leave with a clear decision, an owner and a deadline?",
    turns: [
      ["Everyone’s here. What do we need to cover?", "Open the meeting, state the decision needed and bring production in.", "What do we need to cover? = Que devons-nous aborder ?", "Shall we get started? We need to decide what to do with this batch. Could production tell us what happened?", "Thanks for joining. We have ten minutes to agree on what to do with the batch. Could production walk us through the first check, then we’ll hear from quality?"],
      ["Production wants to release it today. Quality says we still need a second check.", "Acknowledge the pressure, state your concern and invite quality to propose timing.", "release the batch = libérer le lot", "I understand the timing is tight. I think we need to check it again. Quality, when could you do that?", "I see why production wants to move quickly. My concern is that we don’t have a second set of readings yet. What’s the earliest quality could repeat the check?"],
      ["Quality can repeat it before two if production makes the fixture available.", "Confirm the hold. Give production and quality one action each. Say when you’ll follow up.", "make the fixture available = mettre le montage à disposition", "Just to recap, the batch stays on hold. Production will make the fixture available, and quality will check the parts by two. I’ll follow up at two thirty.", "Let’s hold the batch until quality confirms the results. Could production make the fixture available after lunch? Quality will share the new readings by two, and I’ll bring everyone back together at two thirty."]
    ],
    twist: "Quality says they can’t repeat the check until three. How will you keep everyone informed?"
  },
  {
    id: "leadership", title: "Coach a teammate", topic: "Feedback, delegation & support",
    setting: "You’re speaking privately to a teammate after a shift handover. Start with specific positive feedback and agree on a manageable improvement.",
    moves: ["Name what went well.", "Describe a specific change.", "Offer support and agree on a check-in."],
    phrases: ["I appreciated how you…", "Could you take the lead on…?", "What do you need from me?"],
    debrief: "Did your request explain the outcome and leave room for input?",
    turns: [
      ["How did you think the handover went?", "Give specific positive feedback, then raise one improvement.", "handover = passage de relais", "Your summary was clear. Next time, could you add a deadline for each open action?", "I appreciated how you explained the quality issue. For the next handover, it would help to name who owns each open action and when it’s due."],
      ["I can do that, but I don’t know which team owns the repeat check.", "Clarify that quality owns the measurement. Delegate confirming the time and offer support.", "owns the repeat check = est responsable du nouveau contrôle", "Quality owns the check. Could you confirm the time with them? Let me know if you need help.", "Quality will carry out the second check. Could you take the lead on confirming their timing and updating the handover log? I can introduce you to the shift contact if that would help."],
      ["Thanks. I might need more time before I can confirm it.", "Ask what is holding things up and agree on a realistic check-in.", "what’s holding things up = ce qui retarde les choses", "What’s holding things up? Can we check in at two and see where things stand?", "Of course. What’s the main thing you’re waiting on? Let’s touch base at two even if the timing is still open, so we can tell the next shift what to expect."]
    ],
    twist: "I can confirm the time or update the log now. Which should I do first?"
  },
  {
    id: "technical", title: "Explain an inspection issue", topic: "Technical vocabulary & clarification",
    setting: "An English-speaking colleague joins midway through a fictional shift handover. Two parts were outside tolerance on the first check. The cause is open.",
    moves: ["Report the measured result.", "Distinguish the possible cause from the confirmed facts.", "Check the handover instruction is clear."],
    phrases: ["Two readings came back outside tolerance.", "The fixture might be involved.", "Could you log the second set of readings?"],
    debrief: "Could your colleague tell exactly which part was a fact, which was a hypothesis and what to do next?",
    turns: [
      ["Can you walk me through what happened at inspection?", "Summarize the first check using batch and outside tolerance.", "outside tolerance = hors tolérances", "We checked the batch. Two parts came back outside tolerance on the first check.", "During the first inspection, two parts in the batch came back outside tolerance. We’ve recorded the readings and asked quality to repeat the measurement."],
      ["So the fixture caused the high readings, right?", "Correct the assumption politely. Use might and hasn’t been confirmed.", "fixture = montage de maintien", "The fixture might be involved. We haven’t confirmed the cause yet.", "That’s one possibility, but the root cause hasn’t been confirmed. We’ll check the fixture and compare the readings before drawing a conclusion."],
      ["What should I tell the next shift?", "Say what happens to the batch and what needs recording. Check they have the timing.", "put the batch on hold = mettre le lot en attente", "Tell them to keep the batch on hold and log the second set of readings. Can you send the readings by two?", "Please flag the batch as on hold during the handover. Ask the next shift to log the repeat measurements and share them by two. Does that timing work for the team?"]
    ],
    twist: "When you say the batch is ‘on hold,’ can we still move it to the next stage?"
  }
];

scenarios.push(
  {
    id: "family-depth", title: "A meaningful conversation about family", topic: "Habits, memories & balance",
    setting: "An English-speaking colleague asks how you balance a demanding job with your personal life. Share only details you are comfortable sharing.",
    moves: ["Describe a regular family activity with frequency and details.", "Tell a short story about a memorable occasion.", "Ask a thoughtful question without asking for overly personal information."],
    phrases: ["We make time for each other whenever we can.", "One occasion I remember particularly well was…", "How do you usually spend time with the people close to you?"],
    debrief: "Did you use a habit, a specific past example, a reason and a reciprocal question?",
    turns: [
      ["You mentioned family is important to you. What do you usually do together?", "Give a detailed but appropriately private answer: when, what, how often and why.", "usually = habituellement; make time for = réserver du temps", "We try to have meals together whenever our schedules allow. I enjoy that time because we can catch up properly. And you?", "We all have busy schedules, so we deliberately make time for shared meals or an outing when possible. It gives us a chance to talk about what everyone has been doing. Do you have a similar tradition in your family?"],
      ["That sounds lovely. Has there been a recent occasion that stood out?", "Tell a short real story using past simple and one past continuous or past perfect if useful.", "stand out = marquer les esprits", "We had a family celebration recently. We spent the afternoon together, and it was a really enjoyable occasion.", "One occasion that stands out was a family gathering when we managed to get several people together. We were sharing stories over dinner, and I realised how valuable that time was, especially when work gets demanding."],
      ["How do you manage when work gets particularly busy?", "Use a concession, a practical strategy and a reflective conclusion.", "manage = gérer; despite = malgré", "It's not always easy, but I try to plan ahead and keep some time free for family.", "Although my schedule can become intense during major projects, I try to protect a few regular moments for the people close to me. It isn't always perfect, but I've found that making time deliberately helps. How do you manage your own work-life balance?"]
    ],
    twist: "Do you think family traditions are becoming more important or less important these days?"
  },
  {
    id: "wine-depth", title: "Explain a tasting to a curious newcomer", topic: "Accessible expertise & sensory vocabulary",
    setting: "At a tasting, a visitor is interested but knows very little about wine. Keep your explanations accurate, concrete and welcoming — never lecture or assume they know technical terms.",
    moves: ["Introduce the club and how a session works.", "Describe colour, aroma, palate, acidity, tannins and finish in accessible language.", "Compare two styles, offer a food pairing and invite a personal view."],
    phrases: ["First we look at the colour, then smell and taste the wine.", "This one has ripe-fruit aromas, soft tannins and a fairly long finish.", "What stands out to you? There isn't just one correct impression."],
    debrief: "Could a non-expert follow your explanation? Did you introduce at least five precise descriptors without overwhelming them?",
    turns: [
      ["I'm curious about your association. What do you actually do at a tasting?", "Explain the purpose, the sequence and the social side in three or four sentences.", "association = club / association; compare notes = échanger ses impressions", "We meet to explore different wines and share impressions. We usually look at the colour, smell the aromas, taste the wine and discuss what we notice.", "Our association brings together people who enjoy discovering wine, whatever their level of knowledge. At a typical tasting, we compare several wines, starting with appearance, then aroma, texture and finish. We also discuss grape varieties or regions, but the best part is exchanging impressions: people often notice different things in the same glass."],
      ["I can smell fruit, but I don't know what else to look for. How would you describe this glass?", "Describe appearance, two aromas, body, acidity/tannins and finish. Explain any technical term plainly.", "acidity = acidité; tannins = tanins; finish = finale", "It's ruby-red, with cherry and berry aromas. It feels medium-bodied, with soft tannins and a gentle finish.", "To me, it has a clear ruby colour and aromas of cherry and blackberries, perhaps a slight spicy note. On the palate it's medium-bodied, with fresh acidity and fairly smooth tannins — that's the gentle drying sensation you can feel in some reds. The fruit remains on the finish, which is what you notice after tasting."],
      ["How is that different from the first wine? And what food would suit it?", "Compare fairly; propose a pairing with a reason; invite the guest's preference.", "lighter than = plus léger que; pair with = accorder avec", "This one is fuller and has firmer tannins than the first. I think it would go well with roast chicken. Which one do you prefer?", "Whereas the first wine was lighter and more refreshing, this one is richer, with more pronounced tannins and a longer finish. I'd pair it with roast poultry or a mushroom dish because the flavours should complement each other. Of course, pairing is partly a matter of taste. Which style do you find more enjoyable?" ]
    ],
    twist: "I don't like dry wines. Does that mean a fruity-smelling wine will always taste sweet?"
  }
);

const twists = [
  "“That sounds interesting. Could you tell me a bit more about it?”",
  "“What do you like most about that hobby?”",
  "“Have you always been interested in that?”",
  "“I didn’t catch the last part. Would you mind saying it again?”",
  "“That sounds fun. How often do you get together?”"
];
const speakingModels = [
  ["B1", "I’m part of a wine-tasting club. We taste a few wines and compare notes. Have you ever tried a tasting? What I like most is hearing what other people notice. Back to the batch, we found two parts outside tolerance. We don’t know the cause yet. I suggest we keep the batch on hold. What do you think? Could quality repeat the check and send the readings by two?"],
  ["B1+ / B2", "Outside work, I’m part of a wine-tasting club. We try wines side by side, and it’s interesting how differently people describe the same glass. Have you ever done a blind tasting? My favourite part is comparing notes. On the batch, we have two parts outside tolerance on the first check. The fixture might be involved, although we haven’t confirmed the cause. I’d suggest holding the batch until we have repeat readings. What’s your take on that from production? If that works for everyone, quality will send the new readings by two, and I’ll follow up at two thirty."]
];
const writingModels = [
  ["B1", "Hi everyone,\n\nThanks for the discussion today. We agreed to keep the batch on hold because two parts were outside tolerance. Quality will repeat the check and send the new readings by 2 p.m. I’ll update the team at 2:30 p.m. Please let me know if you have any concerns or if the timing changes.\n\nThanks"],
  ["B1+ / B2", "Hi everyone,\n\nThanks for your input earlier. To recap, the batch will remain on hold while we verify the initial readings. The cause is still open. Quality will repeat the measurement and share the results by 2 p.m., and I’ll follow up with the team at 2:30 p.m. If anything might affect the deadline, please flag it so we can update the next shift.\n\nThanks"]
];
const writingChecks = ["I thanked the team and stated the decision.", "I named the action, owner and deadline.", "I invited people to raise concerns."];
const competencies = [
  ["social", "Keep an informal conversation going"],
  ["meeting", "Lead a meeting and invite input"],
  ["lead", "Give feedback and delegate clearly"],
  ["industrial", "Explain an inspection issue precisely"],
  ["accuracy", "Use the target grammar in conversation"],
  ["writing", "Confirm a decision in writing"]
];

const orderedLines = [
  "Thanks for joining. We need to decide what to do with the batch.",
  "Could production walk us through the first check?",
  "Quality, what’s your recommendation based on those readings?",
  "Just to recap, quality will repeat the check by two."
];
phraseQuestions.push({
  id: "p9", prompt: "Build a short huddle. Select the four lines in the order you would say them.",
  tiles: [orderedLines[2], orderedLines[0], orderedLines[3], orderedLines[1]], sequence: [1, 3, 0, 2],
  hint: "Open with the decision to make. Get the facts, invite a recommendation, then recap.",
  why: "You opened with purpose, got the facts, invited a recommendation and confirmed the action.",
  fr: "Sélectionnez les phrases dans l’ordre, de l’ouverture jusqu’au récapitulatif."
});

const offlineAudio = new Map([
  ["How’s your week going?", "line-001"],
  ["Hey, how’s your week going so far?", "line-002"],
  ["What have you been up to?", "line-003"],
  ["Hey, good to see you. What have you been up to?", "line-004"],
  ["That sounds like fun.", "line-005"],
  ["That sounds like fun. How often do you go?", "line-006"],
  ["How did you get into that?", "line-007"],
  ["A wine-tasting club? How did you get into that?", "line-008"],
  ["How about you?", "line-009"],
  ["I usually take it easy on Sundays. How about you?", "line-010"],
  ["Let me think for a second.", "line-011"],
  ["Let me think for a second. The last time I went was in spring.", "line-012"],
  ["Would you mind saying that again?", "line-013"],
  ["Sorry, I missed the last part. Would you mind saying that again?", "line-014"],
  ["It was great catching up.", "line-015"],
  ["It was great catching up. See you at the meeting.", "line-016"],
  ["spend time with family", "line-017"],
  ["I like to spend time with my family at weekends.", "line-018"],
  ["get together", "line-019"],
  ["We try to get together when everyone is free.", "line-020"],
  ["have people over", "line-021"],
  ["We had some friends over for dinner last weekend.", "line-022"],
  ["keep it low-key", "line-023"],
  ["We kept it low-key and had lunch at home.", "line-024"],
  ["head out for a walk", "line-025"],
  ["If the weather’s good, I like to head out for a walk.", "line-026"],
  ["What did you get up to?", "line-027"],
  ["What did you get up to over the weekend?", "line-028"],
  ["be into something", "line-029"],
  ["I’m into soccer. I like watching a good match.", "line-030"],
  ["get into something", "line-031"],
  ["How did you get into following that team?", "line-032"],
  ["follow a team", "line-033"],
  ["Do you follow a team, or do you just watch the big games?", "line-034"],
  ["catch a game", "line-035"],
  ["Did you catch the game last night?", "line-036"],
  ["show someone around", "line-037"],
  ["If I have time, I’ll show you around.", "line-038"],
  ["worth a visit", "line-039"],
  ["Which part of town do you think is worth a visit?", "line-040"],
  ["football / soccer", "line-041"],
  ["Do you watch much soccer?", "line-042"],
  ["a wine-tasting club", "line-043"],
  ["I’m part of a wine-tasting club.", "line-044"],
  ["a tasting", "line-045"],
  ["Our club sometimes gets together for a tasting.", "line-046"],
  ["a blind tasting", "line-047"],
  ["Have you ever done a blind tasting?", "line-048"],
  ["compare notes", "line-049"],
  ["We taste the wines and compare notes.", "line-050"],
  ["a hint of cherry", "line-051"],
  ["I’m getting a hint of cherry. What do you notice?", "line-052"],
  ["dry", "line-053"],
  ["I’d say it’s fairly dry. What do you think?", "line-054"],
  ["full-bodied", "line-055"],
  ["This red feels more full-bodied than the last one.", "line-056"],
  ["the finish", "line-057"],
  ["It has a slightly spicy finish.", "line-058"],
  ["pairs well with", "line-059"],
  ["I think this would pair well with roast chicken.", "line-060"],
  ["Shall we get started?", "line-061"],
  ["Shall we get started? We have one decision to make.", "line-062"],
  ["Could you walk us through it?", "line-063"],
  ["Could you walk us through what happened at the inspection stage?", "line-064"],
  ["What’s your take on this?", "line-065"],
  ["We’ve heard from production. What’s your take on this from the quality side?", "line-066"],
  ["I see your point. My concern is…", "line-067"],
  ["I see your point. My concern is the deadline.", "line-068"],
  ["take the lead on", "line-069"],
  ["Could you take the lead on the follow-up check?", "line-070"],
  ["flag a concern", "line-071"],
  ["I’d like to flag a concern about the test results.", "line-072"],
  ["follow up with", "line-073"],
  ["I’ll follow up with the quality team at two.", "line-074"],
  ["What do you need from me?", "line-075"],
  ["Could you review the checklist? What do you need from me?", "line-076"],
  ["Just to recap…", "line-077"],
  ["Just to recap, I’ll send the notes by the end of the day.", "line-078"],
  ["a batch", "line-079"],
  ["Two parts in this batch need a second check.", "line-080"],
  ["within tolerance", "line-081"],
  ["The readings from the second station are within tolerance.", "line-082"],
  ["outside tolerance", "line-083"],
  ["Two readings came back outside tolerance.", "line-084"],
  ["a fixture", "line-085"],
  ["We’ll check the fixture before we repeat the measurement.", "line-086"],
  ["a reading", "line-087"],
  ["Could you log the readings from both stations?", "line-088"],
  ["rework", "line-089"],
  ["We need quality to confirm whether rework is possible.", "line-090"],
  ["a bottleneck", "line-091"],
  ["The inspection queue is a bottleneck this week.", "line-092"],
  ["a handover", "line-093"],
  ["Let’s flag the open issue during the shift handover.", "line-094"],
  ["root cause", "line-095"],
  ["We’ve seen the symptom. We’re still investigating the root cause.", "line-096"],
  ["put a batch on hold", "line-097"],
  ["I’d suggest putting the batch on hold until quality has reviewed the new readings.", "line-098"],
  ["I missed the last part. What did you do on Sunday?", "line-099"],
  ["Hey! Did you do anything fun over the weekend?", "line-100"],
  ["It was pretty relaxed. I spent time with family. How about you?", "line-101"],
  ["We kept it pretty low-key. I had lunch with family and went out for a walk afterwards. What did you get up to?", "line-102"],
  ["We had some friends over. Do you get together with family often?", "line-103"],
  ["When we can. We usually get together for a meal. What did you make for your friends?", "line-104"],
  ["It depends on everyone’s schedule, but we try to make time for a meal together. What’s your go-to dish when you have friends over?", "line-105"],
  ["We cooked together, actually. What do you like to do when you get a weekend to yourself?", "line-106"],
  ["I like to watch soccer when I can. Do you follow any teams?", "line-107"],
  ["If I have a free weekend, I like catching a game or going to a wine tasting. What do you make time for when you get a weekend off?", "line-108"],
  ["What exactly do you mean by ‘the finish’?", "line-109"],
  ["Is this your first time here? I’m new. How does the club work?", "line-110"],
  ["I’m part of the club. We taste a few wines and compare notes. Feel free to join us.", "line-111"],
  ["I’m a member. We usually try a few wines side by side and share what we notice. You’re welcome to taste along and tell us what you think.", "line-112"],
  ["What are you getting from this red? I can’t quite place it.", "line-113"],
  ["It reminds me a little of cherry, especially on the finish. I’d say it’s fairly dry, too. Are you picking up anything different?", "line-114"],
  ["That’s helpful. Is there a wine you’d recommend I try next?", "line-115"],
  ["If you like dry whites, try this one. It goes well with seafood.", "line-116"],
  ["If you’re in the mood for something lighter, I’d go for the dry white. It would pair well with seafood. Do you usually prefer whites or reds?", "line-117"],
  ["I only have two hours and it’s raining. What would you suggest?", "line-118"],
  ["I missed it. Was it a good game?", "line-119"],
  ["I didn’t get a chance to watch it. I heard it was close, though. What did you make of the second half?", "line-120"],
  ["It was good. I saw a game in Montréal once, too. Have you ever been there?", "line-121"],
  ["I haven’t been there yet, but I’d like to go. When did you go?", "line-122"],
  ["I haven’t made it there yet. I’d love to see the city and catch a game if I can. What stood out for you when you went?", "line-123"],
  ["The atmosphere was great. What would you recommend if I had a free afternoon where you live?", "line-124"],
  ["I’d go to the town centre. It’s a good place for a walk. What do you like to do when you visit a new place?", "line-125"],
  ["If you’ve only got an afternoon, I’d start in the town centre and take a walk from there. It’s a good way to get a feel for the place. Would you rather walk or find somewhere nice to eat?", "line-126"],
  ["Quality says they can’t repeat the check until three. How will you keep everyone informed?", "line-127"],
  ["Everyone’s here. What do we need to cover?", "line-128"],
  ["Shall we get started? We need to decide what to do with this batch. Could production tell us what happened?", "line-129"],
  ["Thanks for joining. We have ten minutes to agree on what to do with the batch. Could production walk us through the first check, then we’ll hear from quality?", "line-130"],
  ["Production wants to release it today. Quality says we still need a second check.", "line-131"],
  ["I understand the timing is tight. I think we need to check it again. Quality, when could you do that?", "line-132"],
  ["I see why production wants to move quickly. My concern is that we don’t have a second set of readings yet. What’s the earliest quality could repeat the check?", "line-133"],
  ["Quality can repeat it before two if production makes the fixture available.", "line-134"],
  ["Just to recap, the batch stays on hold. Production will make the fixture available, and quality will check the parts by two. I’ll follow up at two thirty.", "line-135"],
  ["Let’s hold the batch until quality confirms the results. Could production make the fixture available after lunch? Quality will share the new readings by two, and I’ll bring everyone back together at two thirty.", "line-136"],
  ["I can confirm the time or update the log now. Which should I do first?", "line-137"],
  ["How did you think the handover went?", "line-138"],
  ["Your summary was clear. Next time, could you add a deadline for each open action?", "line-139"],
  ["I appreciated how you explained the quality issue. For the next handover, it would help to name who owns each open action and when it’s due.", "line-140"],
  ["I can do that, but I don’t know which team owns the repeat check.", "line-141"],
  ["Quality owns the check. Could you confirm the time with them? Let me know if you need help.", "line-142"],
  ["Quality will carry out the second check. Could you take the lead on confirming their timing and updating the handover log? I can introduce you to the shift contact if that would help.", "line-143"],
  ["Thanks. I might need more time before I can confirm it.", "line-144"],
  ["What’s holding things up? Can we check in at two and see where things stand?", "line-145"],
  ["Of course. What’s the main thing you’re waiting on? Let’s touch base at two even if the timing is still open, so we can tell the next shift what to expect.", "line-146"],
  ["When you say the batch is ‘on hold,’ can we still move it to the next stage?", "line-147"],
  ["Can you walk me through what happened at inspection?", "line-148"],
  ["We checked the batch. Two parts came back outside tolerance on the first check.", "line-149"],
  ["During the first inspection, two parts in the batch came back outside tolerance. We’ve recorded the readings and asked quality to repeat the measurement.", "line-150"],
  ["So the fixture caused the high readings, right?", "line-151"],
  ["The fixture might be involved. We haven’t confirmed the cause yet.", "line-152"],
  ["That’s one possibility, but the root cause hasn’t been confirmed. We’ll check the fixture and compare the readings before drawing a conclusion.", "line-153"],
  ["What should I tell the next shift?", "line-154"],
  ["Tell them to keep the batch on hold and log the second set of readings. Can you send the readings by two?", "line-155"],
  ["Please flag the batch as on hold during the handover. Ask the next shift to log the repeat measurements and share them by two. Does that timing work for the team?", "line-156"],
  ["I’m part of a wine-tasting club. We taste a few wines and compare notes. Have you ever tried a tasting? What I like most is hearing what other people notice. Back to the batch, we found two parts outside tolerance. We don’t know the cause yet. I suggest we keep the batch on hold. What do you think? Could quality repeat the check and send the readings by two?", "line-157"],
  ["Outside work, I’m part of a wine-tasting club. We try wines side by side, and it’s interesting how differently people describe the same glass. Have you ever done a blind tasting? My favourite part is comparing notes. On the batch, we have two parts outside tolerance on the first check. The fixture might be involved, although we haven’t confirmed the cause. I’d suggest holding the batch until we have repeat readings. What’s your take on that from production? If that works for everyone, quality will send the new readings by two, and I’ll follow up at two thirty.", "line-158"],
  ["I'm part of a wine-tasting club. I like hearing what other people notice in the same wine. How about you? Are you part of any clubs?", "line-159"]
]);


const stagedMicroLexicon = {"family": ["We try to get together when everyone is available.", "I make time for family despite a busy schedule.", "We keep in touch even when we cannot meet.", "One of our family traditions is having a meal together.", "Last summer, we enjoyed a memorable family occasion."], "activities": ["I follow a soccer team and watch their matches.", "I took up this hobby a few years ago.", "I’m keen on travelling and discovering new places.", "I try to make the most of my free weekends.", "I’ve had the opportunity to visit several interesting places."], "association": ["I’m a member of a local wine-tasting association.", "I got involved because I wanted to share an interest with others.", "Members sometimes organise themed evenings.", "We exchange ideas and learn from one another.", "Being part of the group has been a rewarding experience."], "tasting": ["This wine has a deep ruby colour.", "I notice an aroma of red berries and a hint of spice.", "It feels crisp, with lively acidity.", "The tannins feel quite soft and smooth.", "The wine has a pleasant, lingering finish.", "I think it would pair well with grilled vegetables."], "connect": ["That sounds interesting. How did you get involved?", "What do you enjoy most about it?", "Speaking of travel, have you visited this region?", "Could you walk me through the latest findings?", "What’s your view on the proposed next step?", "Just to recap, we’ll repeat the check before deciding."]};
const stageQuestions = {
  family: [
    blank('sfamily1','I usually ___ time for family at weekends. (make)',['make'],'Present simple with I takes the base verb.','Usually + base verb describes a habit.','I = base verb.'),
    blank('sfamily2','Last Sunday we ___ together for lunch. (get)',['got'],'Get is irregular in the past.','Got is the past simple of get.','Get → got.'),
    choice('sfamily3','Choose the correct sentence about an old habit that is different today.',['We used to meet more often, but now we live farther apart.', 'We use to met more often, but now we live farther apart.', 'We are used to meet more often, but now we live farther apart.'],0,'Used to + infinitive without to as a separate part.','Used to meet describes a former habit.','Ancienne habitude = used to + base.'),
    choice('sfamily4','Which question is friendly and invites the other person to say more?',['Give me your address.', 'What traditions do you enjoy?', 'Do you have a family? Yes or no.'],1,'Ask about an experience or preference without intruding.','An open question invites a personal but comfortable answer.','Question ouverte et respectueuse.')
  ],
  activities: [
    blank('sactivities1','I have never ___ to a final. (be)',['been'],'Have + past participle of be.','Been forms the present perfect with have.','Be → been.'),
    choice('sactivities2','Which two sentences correctly describe an experience, then say when it happened?',['I went last year. When have you gone?', 'I have gone last year.', 'I have been to a live match. I went last year.'],2,'Experience without time, then a dated finished event.','Present perfect then past simple fits the time references.','Present perfect puis prétérit.'),
    blank('sactivities3','When did you ___ following soccer? (start)',['start'],'Did + base verb.','After did, use start, not started.','Après did, base verbale.'),
    choice('sactivities4','Which comparison is correct?',['Watching live is more better.', 'Watching live is more exciting than watching on TV.', 'Watching live is the more exciting than TV.'],1,'For an adjective like exciting, use more ... than.','More exciting than is correct.','More + adjectif long + than.')
  ],
  association: [
    blank('sassociation1','Our association ___ themed evenings. (organise)',['organises', 'organizes'],'Association is singular.','It organises (UK) / organizes (US) a regular event.','Sujet singulier → -s.'),
    choice('sassociation2','Select the best reason for joining.',['I joined because I wanted to share an interest.', 'I joined because to meet people.', 'I have joined last year because curiosity.'],0,'Because + full clause.','Because I wanted to... supplies a subject and verb.','Because + sujet + verbe.'),
    blank('sassociation3','I have ___ a lot from other members. (learn)',['learned', 'learnt'],'Present perfect: have + participle.','Learned and learnt are acceptable participles.','Have + participe passé.'),
    choice('sassociation4','Which sentence means you joined in the past and are still a member?',['I’ve been belonging to the association for three years.', 'I’m belonging to the association since 2023.', 'I’ve been a member of the association for three years.'],2,'Belong is generally not used in continuous forms.','I’ve been a member... expresses a state continuing to now.','Belong = verbe d’état.')
  ],
  tasting: [
    choice('stasting1','Which sentence describes a wine clearly without using unnecessary jargon?',['The phenolic profile is optimally polymerised.', 'It smells of red berries and feels quite smooth.', 'It is very good wine, trust me.'],1,'Use familiar sensory descriptions.','Aroma and texture give specific but understandable information.','Odeur + texture.'),
    blank('stasting2','This wine is ___ aromatic than the last one. (more)',['more'],'Long adjective aromatic takes more.','More aromatic than is a standard comparison.','More + adjectif long + than.'),
    choice('stasting3','Choose a respectful, nuanced suggestion.',['This definitely pairs with one dish only.', 'You must agree it is the best.', 'I’d say it could pair well with roast poultry.'],2,'Hedge personal observations or choices.','I’d say... could... acknowledges subjectivity.','I’d say = je dirais.'),
    blank('stasting4','This is a wine ___ comes from a cool region. (relative pronoun)',['that', 'which'],'Relative pronoun referring to a thing.','That / which introduces the detail about the wine.','Which / that = chose.')
  ],
  connect: [
    choice('sconnect1','Choose the correct indirect question.',['Could you tell me when does the meeting start?', 'Could you tell me when the meeting starts?', 'Could you tell me when starts the meeting?'],1,'Indirect questions use statement word order.','When the meeting starts is correct.','Question indirecte : ordre affirmatif.'),
    blank('sconnect2','If we receive the readings today, we ___ make a decision tomorrow. (can)',['can'],'Real conditional: if + present, can/will + base.','Can works in the result clause.','If + présent, can + base.'),
    choice('sconnect3','Which sentence distinguishes evidence from a hypothesis?',['The fixture caused the issue; we all know that.', 'Two readings are outside tolerance. The fixture may be involved, but we haven’t confirmed it.', 'The batch is certainly defective, although we have no test results.'],1,'Say what was measured and what remains uncertain.','A measurement is separate from the potential cause.','Fait avéré ≠ hypothèse.'),
    blank('sconnect4','What ___ you enjoy most about being a member? (do)',['do'],'Present simple open question with you.','What do you enjoy ...?','What + do + you + base.')
  ],
};

const $ = (selector) => document.querySelector(selector);
const sections = [...document.querySelectorAll(".lesson-section")];
const questionGroups = {
  ...stageQuestions,
  phrases: phraseQuestions,
  grammar: grammarQuestions,
  listening: listening.flatMap((item) => item.questions)
};
const questionList = Object.values(questionGroups).flat();
const questionsById = new Map(questionList.map((question) => [question.id, question]));
const storageKey = "cfl-thomas-conversation-expanded-v2";
const defaults = {
  french: false, accent: "en-US", speed: "1", section: "start", practice: {},
  scenario: "lunch", mode: "guided", role: {}, draft: "", writing: {},
  assessment: {}, notes: "", lessonUrl: "", twist: 0, sessionSeconds: 3600
};
let state;
try {
  state = { ...defaults, ...JSON.parse(localStorage.getItem(storageKey)) };
} catch {
  state = structuredClone(defaults);
}
const activeTimers = { session: null, mission: null };
let missionSeconds = 90;
let activeSpeech = null;

function save() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
  } catch {
    // The lesson remains usable when browser storage is unavailable.
  }
}

function escapeHtml(value = "") {
  const replacements = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  return String(value).replace(/[&<>"']/g, (symbol) => replacements[symbol]);
}

function french(text) {
  return `<p class="fr" lang="fr">${escapeHtml(text)}</p>`;
}

function speakButton(text, label = "▶ Listen") {
  return `<button class="button quiet" type="button" data-speak="${escapeHtml(text)}">${escapeHtml(label)}</button>`;
}

function announce(message) {
  $("#announcement").textContent = message;
}

function applyFrench() {
  document.body.classList.toggle("show-fr", state.french);
  $("#fr-toggle").setAttribute("aria-pressed", String(state.french));
  $("#fr-toggle").textContent = state.french ? "FR help · on" : "FR help";
}

function showSection(id, focus = false) {
  const index = sections.findIndex((section) => section.id === id);
  if (index < 0) return;
  const section = sections[index];
  const changed = state.section !== id;
  if (changed) {
    stopSpeech();
    setAudioMessage("");
  }
  sections.forEach((item) => { item.hidden = item !== section; });
  document.querySelectorAll("#step-nav a").forEach((link) => {
    if (link.hash === `#${id}`) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  $("#section-label").textContent = section.dataset.title;
  $("#section-count").textContent = `${index + 1} / ${sections.length}`;
  $("#progress-bar").style.width = `${(index + 1) / sections.length * 100}%`;
  $("#back").hidden = index === 0;
  $("#next").hidden = index === sections.length - 1;
  if (index > 0) $("#back").textContent = `← ${sections[index - 1].dataset.title}`;
  if (index < sections.length - 1) $("#next").textContent = `${sections[index + 1].dataset.title} →`;
  state.section = id;
  save();
  if (id === "progress") renderProgress();
  if (focus && changed) {
    window.scrollTo({ top: 0, behavior: "instant" });
    const heading = section.querySelector("h1, h2");
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
  }
}


function navigate(id) {
  if (window.location.hash !== `#${id}`) window.location.hash = id;
  showSection(id, true);
}

function score(list = questionList) {
  return {
    correct: list.filter((question) => state.practice[question.id]?.passed).length,
    attempted: list.filter((question) => state.practice[question.id]?.attempted).length,
    total: list.length
  };
}

function refreshScore() {
  const totals = score();
  $("#score-top").textContent = `${totals.correct} / ${totals.total}`;
  $("#attempt-top").textContent = `${totals.attempted} attempted`;
}

function getQuestionState(id) {
  return state.practice[id] ??= {};
}

function normalise(value) {
  return value.toLowerCase().replace(/[‘’]/g, "'").replace(/[.!?]+$/, "").replace(/\s+/g, " ").trim();
}

function correctAnswer(question) {
  if (question.options) return question.options[question.correct];
  if (question.tiles) return question.sequence.map((index) => question.tiles[index]).join(" → ");
  return question.answers[0];
}

function questionMarkup(question) {
  const entry = state.practice[question.id] ?? {};
  let controls;
  if (question.options) {
    controls = `<div class="choices" role="group" aria-label="Choose a reply">${question.options.map((option, index) => {
      const picked = entry.value === index;
      const status = picked ? (entry.correct ? " correct" : " incorrect") : "";
      return `<button class="choice${status}" type="button" data-option="${index}" aria-pressed="${picked}">${escapeHtml(option)}</button>`;
    }).join("")}</div>`;
  } else if (question.tiles) {
    const picks = entry.value ?? [];
    controls = `<div class="choices" role="group" aria-label="Order the lines">${question.tiles.map((tile, index) => {
      const selected = picks.indexOf(index);
      return `<button class="choice" type="button" data-tile="${index}" aria-pressed="${selected !== -1}">${selected === -1 ? "" : `<b class="tile-position">${selected + 1}</b> `}${escapeHtml(tile)}</button>`;
    }).join("")}</div>`;
  } else {
    controls = `<form class="answer-form" autocomplete="off">
      <input type="text" aria-label="Missing words" placeholder="Type here" spellcheck="false" value="${escapeHtml(entry.draft ?? entry.value ?? "")}">
      <button class="button" type="submit">Check</button>
    </form>`;
  }
  return `<h4>${escapeHtml(question.prompt)}</h4>${french(question.fr)}${controls}
    <p class="feedback" role="status"></p>
    <div class="question-controls">
      <button class="button quiet" type="button" data-support="hint" aria-expanded="${!!entry.hint}" aria-controls="${question.id}-hint">Hint</button>
      <button class="button quiet" type="button" data-support="answer" aria-expanded="${!!entry.answer}" aria-controls="${question.id}-answer">Answer</button>
    </div>
    <p class="support" id="${question.id}-hint" ${entry.hint ? "" : "hidden"}>${escapeHtml(question.hint)}</p>
    <p class="support" id="${question.id}-answer" ${entry.answer ? "" : "hidden"}><strong>${escapeHtml(correctAnswer(question))}</strong><br>${escapeHtml(question.why)}</p>`;
}

function syncQuestion(card, question, entry) {
  const feedback = card.querySelector(".feedback");
  let message = "";
  if (entry.attempted) message = entry.correct ? `Correct. ${question.why}` : "Try again. You can use the hint.";
  if (question.tiles && entry.value?.length < question.tiles.length) {
    message = `${entry.value.length} / ${question.tiles.length} selected. Tap a selected line to remove it.`;
  }
  feedback.textContent = message;
  feedback.className = `feedback${entry.attempted ? (entry.correct ? " correct" : " incorrect") : ""}`;
  card.querySelectorAll("[data-option]").forEach((button) => {
    const picked = Number(button.dataset.option) === entry.value;
    button.setAttribute("aria-pressed", String(picked));
    button.classList.toggle("correct", picked && entry.correct);
    button.classList.toggle("incorrect", picked && !entry.correct);
  });
  card.querySelectorAll("[data-tile]").forEach((button) => {
    const i = Number(button.dataset.tile);
    const position = (entry.value ?? []).indexOf(i);
    button.setAttribute("aria-pressed", String(position !== -1));
    button.innerHTML = `${position === -1 ? "" : `<b class="tile-position">${position + 1}</b> `}${escapeHtml(question.tiles[i])}`;
  });
}

function renderQuestionList(container, list) {
  container.innerHTML = list.map((question) => `<article class="question" data-question="${question.id}">${questionMarkup(question)}</article>`).join("");
  container.querySelectorAll("[data-question]").forEach((card) => {
    syncQuestion(card, questionsById.get(card.dataset.question), state.practice[card.dataset.question] ?? {});
  });
}

function judge(question, entry, value) {
  entry.value = value;
  if (question.tiles && value.length < question.tiles.length) {
    entry.correct = false;
    return;
  }
  if (question.tiles) entry.correct = question.sequence.every((index, i) => value[i] === index);
  else if (question.options) entry.correct = question.correct === value;
  else entry.correct = question.answers.some((answer) => normalise(value) === normalise(answer));
  entry.attempted = true;
  if (entry.correct) entry.passed = true;
}

function handleQuestionClick(button, card) {
  const question = questionsById.get(card.dataset.question);
  const entry = getQuestionState(question.id);
  if (button.dataset.support) {
    const support = button.dataset.support;
    entry[support] = !entry[support];
    card.querySelector(`#${question.id}-${support}`).hidden = !entry[support];
    button.setAttribute("aria-expanded", String(entry[support]));
  }
  if (button.matches("[data-option]")) judge(question, entry, Number(button.dataset.option));
  if (button.matches("[data-tile]")) {
    const tile = Number(button.dataset.tile);
    const value = entry.value ?? [];
    judge(question, entry, value.includes(tile) ? value.filter((item) => item !== tile) : [...value, tile]);
  }
  syncQuestion(card, question, entry);
  refreshScore();
  save();
}

function renderVocabulary() {
  const category = $("#vocab-category").value;
  const term = vocabulary[category][Number($("#vocab-term").value)];
  const [word, fr, meaning, example] = term;
  $("#vocab-card").innerHTML = `<h3>${escapeHtml(word)}</h3><p>${escapeHtml(meaning)}</p>${french(fr)}
    <blockquote>${escapeHtml(example)}</blockquote>
    <div class="actions">${speakButton(word, "▶ Phrase")} ${speakButton(example, "▶ Example")}</div>`;
}

function setVocabTerms() {
  const terms = vocabulary[$("#vocab-category").value];
  $("#vocab-term").innerHTML = terms.map(([name], index) => `<option value="${index}">${escapeHtml(name)}</option>`).join("");
  renderVocabulary();
}

function renderGrammar() {
  $("#grammar-bank").innerHTML = grammar.map((topic, index) => `<details class="panel" ${index === 0 ? "open" : ""}>
    <summary>${escapeHtml(topic.title)}</summary>
    <p>${escapeHtml(topic.use)}</p>
    <dl class="form-list">${topic.forms.map(([label, example]) => `<dt>${escapeHtml(label)}</dt><dd>${escapeHtml(example)}</dd>`).join("")}</dl>
    <p>${escapeHtml(topic.tip)}</p>${french(topic.fr)}
  </details>`).join("");
  renderQuestionList($("#quiz-grammar"), grammarQuestions);
}

function renderListening() {
  $("#listening-bank").innerHTML = listening.map((item, index) => `<article class="panel listening-card">
    <span class="term-label">Exchange ${index + 1}</span><h3>${escapeHtml(item.title)}</h3>
    <p>${escapeHtml(item.task)}</p>${french(item.fr)}
    <button class="button primary" type="button" data-dialogue="${index}">▶ Play exchange</button>
    <details class="transcript"><summary>Show transcript</summary>
      ${item.lines.map(([speaker, line]) => `<p><strong>${escapeHtml(speaker)}</strong> · ${escapeHtml(line)}</p>`).join("")}
    </details>
    <div class="question-grid" id="listening-quiz-${index}"></div>
    <div class="listening-work"><p class="response-cue"><strong>Reply aloud, then extend it.</strong> ${escapeHtml(item.cue)}</p><p><strong>Second listen:</strong> identify the main message, two precise details, the speaker’s attitude and one useful phrase. Summarise in 3–4 sentences. After revealing the transcript, use one expression in a new sentence.</p><p><strong>Self-check:</strong> Did you distinguish facts from inference, use an appropriate register and ask a relevant follow-up question?</p></div>
  </article>`).join("");
  listening.forEach((item, index) => renderQuestionList($(`#listening-quiz-${index}`), item.questions));
}

function setAudioMessage(message) {
  $("#audio-alert").textContent = message;
  $("#audio-alert").hidden = !message;
}

function stopSpeech() {
  if (!activeSpeech) return;
  const { button, label, audio } = activeSpeech;
  activeSpeech = null;
  if (audio) audio.pause();
  else window.speechSynthesis?.cancel();
  button.textContent = label;
  button.removeAttribute("aria-pressed");
}

function playOffline(playback, clip) {
  if (playback !== activeSpeech) return;
  if (!clip) {
    stopSpeech();
    setAudioMessage("You can read the prompt or open the transcript.");
    return;
  }
  const audio = new Audio(`audio/${clip}.mp3`);
  playback.audio = audio;
  audio.playbackRate = Number(state.speed);
  if (state.accent === "en-GB") {
    setAudioMessage("This device is playing the bundled US audio. The UK option uses an installed British English voice.");
  }
  audio.addEventListener("ended", () => { if (activeSpeech === playback) stopSpeech(); });
  function failed() {
    if (playback !== activeSpeech) return;
    stopSpeech();
    setAudioMessage("Audio couldn’t load. You can read the prompt or open the transcript.");
  }
  audio.addEventListener("error", failed, { once: true });
  audio.play().catch(failed);
}

function playSpeech(button, lines, clip = offlineAudio.get(lines[0])) {
  setAudioMessage("");
  if (activeSpeech?.button === button) {
    stopSpeech();
    return;
  }
  stopSpeech();
  const playback = { button, label: button.textContent };
  activeSpeech = playback;
  button.textContent = "■ Stop";
  button.setAttribute("aria-pressed", "true");
  const speech = window.speechSynthesis;
  const preferred = speech?.getVoices().filter((voice) => voice.lang.toLowerCase() === state.accent.toLowerCase()) ?? [];
  if (!window.SpeechSynthesisUtterance || !preferred.length) {
    playOffline(playback, clip);
    return;
  }
  const isNatural = (voice) => /natural|premium|enhanced|neural/i.test(voice.name);
  const ranked = [...preferred].sort((a, b) => Number(isNatural(b)) - Number(isNatural(a)));
  function fallback() {
    if (playback !== activeSpeech || playback.audio) return;
    playback.utterance = null;
    playOffline(playback, clip);
  }
  let index = 0;
  function nextLine() {
    if (playback !== activeSpeech || playback.audio) return;
    if (index === lines.length) {
      stopSpeech();
      return;
    }
    const utterance = new SpeechSynthesisUtterance(lines[index]);
    const voice = ranked[index % Math.min(2, ranked.length)];
    utterance.lang = voice.lang;
    utterance.voice = voice;
    utterance.rate = Number(state.speed);
    utterance.pitch = index % 2 && lines.length > 1 ? 1.04 : 1;
    index += 1;
    playback.utterance = utterance;
    utterance.onend = () => window.setTimeout(nextLine, 270);
    utterance.onerror = fallback;
    try { speech.speak(utterance); } catch { fallback(); }
  }
  nextLine();
}

function currentScenario() {
  return scenarios.find((scenario) => scenario.id === state.scenario) ?? scenarios[0];
}

function roleState() {
  const scenario = currentScenario();
  return state.role[scenario.id] ??= {
    guided: { turn: 0, done: false }, live: { turn: 0, done: false }, notes: ""
  };
}

function modelMarkup(models, canListen = true) {
  return models.map(([level, words]) => `<div class="model-answer"><strong>${escapeHtml(level)}</strong><p>${escapeHtml(words).replaceAll("\n", "<br>")}</p>${canListen ? speakButton(words, "▶ Listen to model") : ""}</div>`).join("");
}

function renderRoleplay(focus = false) {
  stopSpeech();
  const scenario = currentScenario();
  const record = roleState();
  const guided = state.mode === "guided";
  const attempt = record[state.mode];
  const turn = attempt.turn;
  const [line, hint, fr, b1, b2] = scenario.turns[turn];
  const prompt = !guided && turn === 2 ? scenario.twist : line;
  $("#guided").setAttribute("aria-pressed", String(guided));
  $("#live").setAttribute("aria-pressed", String(!guided));
  document.querySelectorAll("[data-scenario]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.scenario === scenario.id)));
  const role = $("#role-content");
  role.innerHTML = `<div class="split role-layout"><article class="panel">
    <h3 id="role-title" tabindex="-1">${escapeHtml(scenario.title)}</h3><p>${escapeHtml(scenario.setting)}</p>
    ${attempt.done ? `<p class="feedback correct" role="status">Round complete. ${escapeHtml(scenario.debrief)}</p>
      <div class="actions role-lines"><button class="button" type="button" data-role="again">Try this mode again</button><button class="button primary" type="button" data-role="switch">Try ${guided ? "Live" : "Guided"} mode</button></div>`
    : `<span class="turn-count">Turn ${turn + 1} / 3${!guided && turn === 2 ? " · Unexpected follow-up" : ""}</span>
      <blockquote>${escapeHtml(prompt)}</blockquote>
      <div class="actions">${speakButton(prompt, "▶ Listen to the other person")}</div>
      ${guided ? `${french(fr)}<details class="models"><summary>Hint</summary><p class="support">${escapeHtml(hint)}</p></details>
        <details class="models"><summary>Answer · two model replies</summary><div>${modelMarkup([["B1",b1],["B1+ / B2",b2]])}</div></details>` : ""}
      <div class="actions role-lines"><button class="button" type="button" data-role="prev" ${turn ? "" : "disabled"}>Previous turn</button>
      <button class="button primary" type="button" data-role="next">${turn === 2 ? "Finish this round" : "I’ve replied · next turn →"}</button></div>`}
    </article><aside class="panel">
    ${guided ? `<h4>Build your reply</h4><ol>${scenario.moves.map((move) => `<li>${escapeHtml(move)}</li>`).join("")}</ol>
      <h4>Keep these phrases handy</h4><ul>${scenario.phrases.map((phrase) => `<li>${escapeHtml(phrase)}</li>`).join("")}</ul>` : `<h4>Your task</h4><p>Reply naturally to each line. Use the final turn to respond to an unexpected follow-up.</p>`}
    <label for="role-notes">Phrases or corrections to keep</label><textarea id="role-notes" rows="3">${escapeHtml(record.notes)}</textarea>
  </aside></div>`;
  if (focus) $("#role-title").focus({ preventScroll: true });
}

function handleRoleAction(action) {
  const attempt = roleState()[state.mode];
  if (action === "prev") attempt.turn = Math.max(attempt.turn - 1, 0);
  if (action === "next" && attempt.turn < 2) attempt.turn += 1;
  else if (action === "next") attempt.done = true;
  if (action === "again") {
    attempt.turn = 0;
    attempt.done = false;
  }
  if (action === "switch") state.mode = state.mode === "guided" ? "live" : "guided";
  save();
  renderRoleplay(true);
}

function syncMission() {
  $("#mission-twist").textContent = twists[state.twist];
  $("#draft").value = state.draft;
  updateWordCount();
  $("#writing-checklist").innerHTML = writingChecks.map((text, index) => `<label class="check-row"><input type="checkbox" data-writing="${index}" ${state.writing[index] ? "checked" : ""}>${escapeHtml(text)}</label>`).join("");
}

function updateWordCount() {
  const count = state.draft.match(/[\p{L}\p{N}]+(?:[’'–:.-][\p{L}\p{N}]+)*/gu)?.length ?? 0;
  $("#word-count").textContent = `${count} ${count === 1 ? "word" : "words"}`;
}

function timeText(seconds) {
  return [Math.floor(seconds / 60), seconds % 60].map((part) => String(part).padStart(2, "0")).join(":");
}

function setRemaining(kind, seconds) {
  if (kind === "session") {
    state.sessionSeconds = seconds;
    $("#session-time").textContent = timeText(seconds);
  } else {
    missionSeconds = seconds;
    $("#mission-clock").textContent = timeText(seconds);
  }
}

function timerButton(kind) {
  return kind === "session" ? $("#session-start") : $("#mission-timer");
}

function tickTimer(kind) {
  const timer = activeTimers[kind];
  if (!timer) return;
  const seconds = Math.max(0, Math.ceil((timer.deadline - Date.now()) / 1000));
  const previous = kind === "session" ? state.sessionSeconds : missionSeconds;
  if (seconds !== previous) {
    setRemaining(kind, seconds);
    if (kind === "session") save();
  }
  if (seconds === 0) {
    pauseTimer(kind);
    announce(kind === "mission" ? "Speaking time is up." : "Lesson timer complete.");
  }
}

function pauseTimer(kind) {
  if (activeTimers[kind]) clearInterval(activeTimers[kind].interval);
  activeTimers[kind] = null;
  const remaining = kind === "session" ? state.sessionSeconds : missionSeconds;
  const initial = kind === "session" ? 3600 : 90;
  timerButton(kind).textContent = remaining === 0 ? "Restart" : remaining < initial ? "Resume" : kind === "session" ? "Start" : "Start 90 s";
}

function toggleTimer(kind) {
  if (activeTimers[kind]) {
    pauseTimer(kind);
    return;
  }
  let seconds = kind === "session" ? state.sessionSeconds : missionSeconds;
  if (!seconds) {
    seconds = kind === "session" ? 3600 : 90;
    setRemaining(kind, seconds);
  }
  activeTimers[kind] = {
    deadline: Date.now() + seconds * 1000, interval: setInterval(() => tickTimer(kind), 250)
  };
  timerButton(kind).textContent = "Pause";
}

const ratingOptions = [
  ["", "Not assessed"],
  ["Acquis", "Acquis"],
  ["En cours", "En cours"],
  ["Non acquis", "Non acquis"]
];
const practiceLabels = { phrases: "Phrases & sequencing", grammar: "Grammar", listening: "Listening" };

function scoreRows() {
  return Object.entries(questionGroups).map(([key, questions]) => {
    const totals = score(questions);
    return `<tr><th scope="row">${practiceLabels[key]}</th><td>${totals.correct} / ${totals.total}</td><td>${totals.attempted} / ${totals.total}</td></tr>`;
  }).join("");
}

function completedRounds(mode) {
  return scenarios.filter((scenario) => state.role[scenario.id]?.[mode]?.done).length;
}

function renderProgress() {
  $("#progress-content").innerHTML = `<div class="split equal">
    <article class="panel"><h3>Practice results</h3>
      <p>A point is saved when you answer an item correctly. Correcting an answer earns the same point.</p>
      <table class="progress-table"><thead><tr><th scope="col">Skill</th><th scope="col">Correct</th><th scope="col">Tried</th></tr></thead><tbody>${scoreRows()}</tbody></table>
      <p><strong>Role-plays completed</strong><br>Guided ${completedRounds("guided")} / ${scenarios.length} · Live ${completedRounds("live")} / ${scenarios.length}</p>
      ${scenarios.some((scenario) => state.role[scenario.id]?.notes.trim()) ? `<h4>Your role-play notes</h4><ul>${scenarios.filter((scenario) => state.role[scenario.id]?.notes.trim()).map((scenario) => `<li><strong>${escapeHtml(scenario.title)}</strong> · ${escapeHtml(state.role[scenario.id].notes)}</li>`).join("")}</ul>` : ""}
    </article>
    <article class="panel"><h3>Skills observed · Qualiopi</h3><p>Record your level for each skill after speaking or writing.</p>
      <table class="progress-table"><thead><tr><th scope="col">Skill</th><th scope="col">Status</th></tr></thead><tbody>
      ${competencies.map(([id, name]) => `<tr><th scope="row"><label for="rating-${id}">${escapeHtml(name)}</label></th><td><select id="rating-${id}" data-rating="${id}">${ratingOptions.map(([value, label]) => `<option value="${value}" ${(state.assessment[id] ?? "") === value ? "selected" : ""}>${label}</option>`).join("")}</select></td></tr>`).join("")}
      </tbody></table>
    </article>
  </div>
  <article class="panel tracking"><h3>Session record</h3>
    <label for="lesson-url">Lesson URL</label><input type="url" id="lesson-url" placeholder="https://…" value="${escapeHtml(state.lessonUrl)}">
    <label for="session-notes">Feedback and next steps</label><textarea id="session-notes" rows="4" placeholder="Useful phrases, corrections, and what to practise next…">${escapeHtml(state.notes)}</textarea>
    <div class="actions">
      <button class="button primary" type="button" data-export="html">Download HTML report</button>
      <button class="button" type="button" data-export="print">Print / Save as PDF</button>
      <button class="button" type="button" data-export="copy">Copy spreadsheet row</button>
      <button class="button" type="button" data-export="tsv">Download spreadsheet row</button>
      <button class="button quiet" type="button" id="reset-lesson">Start a fresh session</button>
    </div><p class="feedback" id="export-status" role="status"></p>
  </article>`;
}

function paragraphs(value) {
  return escapeHtml(value).replaceAll("\n", "<br>");
}

function reportMarkup() {
  const date = new Intl.DateTimeFormat("en-GB", { dateStyle: "long", timeZone: "Europe/Paris" }).format(new Date());
  return `<p>CFL Welcome · SpeakEasyTisha · Suivi pédagogique Qualiopi</p>
  <h2>Thomas Beccardi · From small talk to leading the room</h2>
  <p>${date}</p>
  <h3>Objectifs et activités</h3>
  <p>Conversations informelles, animation de réunion, leadership, compte rendu d’un problème de contrôle et confirmation écrite d’une décision. Activités de compréhension orale, QCM, texte à trous, remise en ordre et mises en situation.</p>
  <h3>Résultats des exercices</h3>
  <table class="progress-table"><thead><tr><th scope="col">Activité</th><th scope="col">Réussite</th><th scope="col">Tentatives</th></tr></thead><tbody>${scoreRows()}</tbody></table>
  <p><strong>Mises en situation terminées</strong> · guidé ${completedRounds("guided")} / ${scenarios.length} · direct ${completedRounds("live")} / ${scenarios.length}</p>
  <h3>Compétences observées</h3>
  <table class="progress-table"><tbody>${competencies.map(([id, name]) => `<tr><th scope="row">${escapeHtml(name)}</th><td>${escapeHtml(state.assessment[id] || "Non évalué")}</td></tr>`).join("")}</tbody></table>
  ${state.lessonUrl ? `<p><strong>Lien du cours</strong> · ${escapeHtml(state.lessonUrl)}</p>` : ""}
  ${state.notes ? `<h3>Feedback et suite</h3><p>${paragraphs(state.notes)}</p>` : ""}
  ${scenarios.filter((scenario) => state.role[scenario.id]?.notes.trim()).map((scenario) => `<p><strong>${escapeHtml(scenario.title)}</strong> · ${paragraphs(state.role[scenario.id].notes)}</p>`).join("")}
  ${state.draft.trim() ? `<h3>Production écrite</h3><p>${paragraphs(state.draft)}</p><p>Critères cochés · ${Object.values(state.writing).filter(Boolean).length} / ${writingChecks.length}</p>` : ""}`;
}

function download(name, content, type) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

function dateForSheet() {
  return new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris" }).format(new Date());
}

function spreadsheetRow() {
  const automatic = Object.entries(questionGroups).map(([key, list]) => `${practiceLabels[key]} ${score(list).correct}/${list.length}`).join(" | ");
  const observed = competencies.map(([id, name]) => `${name} — ${state.assessment[id] || "Non évalué"}`).join(" | ");
  const cells = [
    dateForSheet(),
    "From small talk to leading the room",
    "Conversation informelle · réunions · leadership · vocabulaire industriel · grammaire",
    "QCM · texte à trous · remise en ordre · compréhension orale · jeux de rôle · écrit",
    automatic,
    `Guidé ${completedRounds("guided")}/${scenarios.length} · Direct ${completedRounds("live")}/${scenarios.length}`,
    observed,
    state.notes,
    state.lessonUrl
  ];
  return cells.map((cell) => {
    const clean = cell.replace(/[\r\n\t]+/g, " ").trim();
    return /^[=+\-@]/.test(clean) ? `'${clean}` : clean;
  }).join("\t");
}

async function copyText(text) {
  if (!text.trim()) return false;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const field = document.createElement("textarea");
    const previous = document.activeElement;
    field.className = "sr-only";
    field.value = text;
    document.body.append(field);
    field.select();
    let copied = false;
    try {
      copied = document.execCommand("copy");
    } finally {
      field.remove();
      previous?.focus();
    }
    return copied;
  }
}

function printReport() {
  $("#print-report").innerHTML = reportMarkup();
  window.print();
}

async function exportProgress(kind) {
  const status = $("#export-status");
  if (kind === "print") {
    printReport();
    return;
  }
  if (kind === "html") {
    const html = `<!doctype html><html lang="fr"><meta charset="utf-8"><title>Bilan de progression</title>
    <style>body{font:16px/1.5 system-ui,sans-serif;margin:32px auto;padding:0 18px;max-width:850px;color:#242322}h2{font:700 2.1rem Georgia,serif}h3{border-top:3px solid #f2b822;padding-top:10px}table{border-collapse:collapse;width:100%;text-align:left}td,th{border-bottom:1px solid #e9e2d5;padding:8px;vertical-align:top}@media print{table{page-break-inside:avoid}}</style>
    <main>${reportMarkup()}</main></html>`;
    download("Thomas_Conversation_Progress.html", html, "text/html;charset=utf-8");
    status.textContent = "HTML report downloaded.";
  }
  if (kind === "copy") {
    status.textContent = await copyText(spreadsheetRow()) ? "Spreadsheet row copied." : "Use Download spreadsheet row to export.";
  }
  if (kind === "tsv") {
    const header = "Date\tSéance\tContenu\tActivités\tScores\tMises en situation\tCompétences\tSuite et observations\tLien du cours";
    download("Thomas_Conversation_Tracking.tsv", `\ufeff${header}\n${spreadsheetRow()}\n`, "text/tab-separated-values;charset=utf-8");
    status.textContent = "Spreadsheet row downloaded.";
  }
}

function resetPractice(group) {
  if (!window.confirm("Reset the answers and score for this section?")) return;
  questionGroups[group].forEach(({ id }) => delete state.practice[id]);
  if (group === "listening") {
    stopSpeech();
    renderListening();
  } else {
    renderQuestionList($(`#quiz-${group}`), questionGroups[group]);
  }
  refreshScore();
  save();
  announce("Section practice reset.");
}

function initialise() {
  $("#step-nav").innerHTML = sections.map((section) => `<a href="#${section.id}">${section.dataset.title}</a>`).join("");
  $("#vocab-category").innerHTML = Object.keys(vocabulary).map((category) => `<option>${escapeHtml(category)}</option>`).join("");
  $("#scenarios").innerHTML = scenarios.map((scenario) => `<button class="scenario-button" type="button" data-scenario="${scenario.id}"><strong>${escapeHtml(scenario.title)}</strong><span>${escapeHtml(scenario.topic)}</span></button>`).join("");
  $("#mission-models").innerHTML = modelMarkup(speakingModels);
  $("#writing-models").innerHTML = modelMarkup(writingModels, false);
  $("#accent").value = state.accent;
  $("#rate").value = state.speed;
  setVocabTerms();
  Object.entries(stageQuestions).forEach(([id, qs]) => renderQuestionList($(`#quiz-${id}`), qs));
  document.querySelectorAll(".stage-draft").forEach(el => { el.value = (state.stageDrafts ?? {})[el.dataset.save] ?? ""; });
  document.querySelectorAll(".stage-notes").forEach(el => { el.value = (state.stageNotes ?? {})[el.dataset.notes] ?? ""; });
  renderQuestionList($("#quiz-phrases"), phraseQuestions);
  renderGrammar();
  renderListening();
  renderRoleplay();
  syncMission();
  applyFrench();
  refreshScore();
  setRemaining("session", state.sessionSeconds);
  pauseTimer("session");
  const requested = location.hash.slice(1);
  showSection(sections.some((section) => section.id === requested) ? requested : state.section);
  window.speechSynthesis?.getVoices();
}

window.addEventListener("hashchange", () => showSection(location.hash.slice(1) || "start", true));
window.addEventListener("beforeprint", () => { $("#print-report").innerHTML = reportMarkup(); });
$("#fr-toggle").addEventListener("click", () => {
  state.french = !state.french;
  applyFrench();
  save();
});
$("#accent").addEventListener("change", (event) => { state.accent = event.target.value; stopSpeech(); save(); });
$("#rate").addEventListener("change", (event) => { state.speed = event.target.value; stopSpeech(); save(); });
$("#vocab-category").addEventListener("change", () => { stopSpeech(); setVocabTerms(); });
$("#vocab-term").addEventListener("change", () => { stopSpeech(); renderVocabulary(); });
$("#back").addEventListener("click", () => navigate(sections[sections.findIndex((item) => item.id === state.section) - 1].id));
$("#next").addEventListener("click", () => navigate(sections[sections.findIndex((item) => item.id === state.section) + 1].id));
$("#print-button").addEventListener("click", printReport);
$("#session-start").addEventListener("click", () => toggleTimer("session"));
$("#session-reset").addEventListener("click", () => { setRemaining("session", 3600); pauseTimer("session"); save(); });
$("#mission-timer").addEventListener("click", () => toggleTimer("mission"));
$("#new-twist").addEventListener("click", () => {
  state.twist = (state.twist + 1) % twists.length;
  $("#mission-twist").textContent = twists[state.twist];
  announce(twists[state.twist]);
  save();
});
$("#copy-draft").addEventListener("click", async () => {
  if (!state.draft.trim()) {
    announce("Write a draft before copying.");
    $("#draft").focus();
    return;
  }
  const copied = await copyText(state.draft);
  $("#copy-draft").textContent = copied ? "Copied" : "Copy draft";
  announce(copied ? "Draft copied." : "Select and copy the text in the draft field.");
  if (!copied) $("#draft").select();
  setTimeout(() => { $("#copy-draft").textContent = "Copy draft"; }, 1600);
});
$("#reset-mission").addEventListener("click", () => {
  if (!window.confirm("Reset the final mission draft, checklist and timer?")) return;
  Object.assign(state, { draft: "", writing: {}, twist: 0 });
  setRemaining("mission", 90);
  pauseTimer("mission");
  syncMission();
  save();
});
$("#role-reset").addEventListener("click", () => {
  if (!window.confirm("Reset both rounds and the notes for this scenario?")) return;
  delete state.role[currentScenario().id];
  renderRoleplay(true);
  save();
});
["guided", "live"].forEach((mode) => $(`#${mode}`).addEventListener("click", () => {
  state.mode = mode;
  renderRoleplay(true);
  save();
}));

document.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  if (button.dataset.micro) {
    const [stage, indexString] = button.dataset.micro.split("-");
    const source = stagedMicroLexicon[stage]?.[Number(indexString)];
    if (source) playSpeech(button, [source]);
  }
  if (button.dataset.speak) playSpeech(button, [button.dataset.speak]);
  if (button.dataset.dialogue !== undefined) {
    const index = Number(button.dataset.dialogue);
    playSpeech(button, listening[index].lines.map(([, line]) => line), `exchange-${index}`);
  }
  if (button.dataset.reset) resetPractice(button.dataset.reset);
  if (button.dataset.scenario) {
    state.scenario = button.dataset.scenario;
    renderRoleplay(true);
    save();
  }
  if (button.dataset.role) handleRoleAction(button.dataset.role);
  if (button.dataset.export) exportProgress(button.dataset.export);
  if (button.id === "reset-lesson" && window.confirm("Clear this lesson’s answers, scores, drafts and notes from this browser?")) {
    state = structuredClone(defaults);
    save();
    history.replaceState(null, "", "#start");
    location.reload();
  }
  const card = button.closest("[data-question]");
  if (card && (button.dataset.option !== undefined || button.dataset.tile !== undefined || button.dataset.support)) handleQuestionClick(button, card);
});

document.addEventListener("submit", (event) => {
  const form = event.target;
  if (!form.matches(".answer-form")) return;
  event.preventDefault();
  const field = form.querySelector("input");
  const value = field.value.trim();
  if (!value) {
    form.closest(".question").querySelector(".feedback").textContent = "Type an answer first.";
    field.focus();
    return;
  }
  const card = form.closest("[data-question]");
  const question = questionsById.get(card.dataset.question);
  const entry = getQuestionState(question.id);
  judge(question, entry, value);
  syncQuestion(card, question, entry);
  refreshScore();
  save();
});

document.addEventListener("input", (event) => {
  if (event.target.matches(".stage-draft")) { state.stageDrafts ??= {}; state.stageDrafts[event.target.dataset.save] = event.target.value; save(); }
  if (event.target.matches(".stage-notes")) { state.stageNotes ??= {}; state.stageNotes[event.target.dataset.notes] = event.target.value; save(); }
  const field = event.target;
  if (field.matches(".answer-form input")) getQuestionState(field.closest("[data-question]").dataset.question).draft = field.value;
  else if (field.id === "role-notes") roleState().notes = field.value;
  else if (field.id === "session-notes") state.notes = field.value;
  else if (field.id === "lesson-url") state.lessonUrl = field.value;
  else if (field.id === "draft") {
    state.draft = field.value;
    updateWordCount();
  } else return;
  save();
});

document.addEventListener("change", (event) => {
  const field = event.target;
  if (field.dataset.rating) state.assessment[field.dataset.rating] = field.value;
  else if (field.dataset.writing !== undefined) state.writing[field.dataset.writing] = field.checked;
  else return;
  save();
});

initialise();
