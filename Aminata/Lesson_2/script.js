"use strict";

const STORAGE_KEY = "aminata-lesson-2-flight-v1";
const state = { score: {}, completed: {}, startedAt: Date.now(), recordings: {}, timers: {}, saved: {} };

const vocabData = {
  clarify: [
    { en: "Could you clarify…?", fr: "Pourriez-vous préciser… ?", def: "Ask for more exact information without sounding abrupt.", ex: "Could you clarify whether this is an allergy or a preference?" },
    { en: "Let me make sure I have understood correctly.", fr: "Permettez-moi de vérifier que j’ai bien compris.", def: "Introduce a professional reformulation.", ex: "Let me make sure I have understood correctly: you need a dairy-free meal." },
    { en: "May I ask…?", fr: "Puis-je vous demander… ?", def: "Open a sensitive or detailed question politely.", ex: "May I ask when the symptoms began?" },
    { en: "When you say…, do you mean…?", fr: "Quand vous dites…, voulez-vous dire… ?", def: "Check the meaning of an unclear expression.", ex: "When you say special assistance, do you mean help during boarding?" },
    { en: "Could you confirm…?", fr: "Pourriez-vous confirmer… ?", def: "Verify an important fact before acting.", ex: "Could you confirm your seat number, please?" },
    { en: "Is that correct?", fr: "Est-ce exact ?", def: "Invite the interlocutor to validate your summary.", ex: "You requested a vegetarian meal and have a nut allergy. Is that correct?" }
  ],
  reassure: [
    { en: "I understand your concern.", fr: "Je comprends votre inquiétude.", def: "Acknowledge a concern without making a promise.", ex: "I understand your concern about the connection." },
    { en: "Let me look into that for you.", fr: "Je vais vérifier cela pour vous.", def: "Show that you are taking responsibility for checking.", ex: "Let me look into the latest arrival information for you." },
    { en: "I’ll keep you informed.", fr: "Je vous tiendrai informé(e).", def: "Promise an update, not a guaranteed result.", ex: "I’ll keep you informed as soon as I receive confirmation." },
    { en: "Thank you for bringing this to my attention.", fr: "Merci de m’avoir signalé cela.", def: "Respond professionally to a problem or complaint.", ex: "Thank you for bringing this to my attention. I’ll check it immediately." },
    { en: "I’ll do my best to assist you.", fr: "Je ferai de mon mieux pour vous aider.", def: "Offer help without promising an impossible outcome.", ex: "I’ll do my best to assist you with your transfer." },
    { en: "Thank you for your patience.", fr: "Merci pour votre patience.", def: "Recognise the passenger’s wait and close politely.", ex: "I’ll return in a few minutes. Thank you for your patience." }
  ],
  meals: [
    { en: "dietary requirement", fr: "besoin alimentaire spécifique", def: "A food need linked to health, religion or preference.", ex: "Do you have any dietary requirements?" },
    { en: "food allergy", fr: "allergie alimentaire", def: "An immune reaction that may create a safety risk.", ex: "We must verify every ingredient when a passenger has a food allergy." },
    { en: "intolerance", fr: "intolérance", def: "Difficulty digesting or reacting to a substance, distinct from an allergy.", ex: "The passenger has a lactose intolerance." },
    { en: "plant-based", fr: "à base de végétaux", def: "Made primarily or entirely from plants.", ex: "The roasted vegetable salad is a plant-based option." },
    { en: "a suitable alternative", fr: "une alternative adaptée", def: "A replacement that respects the passenger’s needs.", ex: "I’ll check whether we have a suitable alternative." },
    { en: "to verify the ingredients", fr: "vérifier les ingrédients", def: "Check the content before recommending or serving.", ex: "I need to verify the ingredients before serving the dessert." }
  ],
  comfort: [
    { en: "to adjust the air vent", fr: "régler la ventilation", def: "Change the direction or airflow above the seat.", ex: "I can help you adjust the air vent." },
    { en: "an available seat", fr: "un siège disponible", def: "A seat that may legally and operationally be used.", ex: "Let me check whether another seat is available." },
    { en: "mobility assistance", fr: "assistance à la mobilité", def: "Help for a passenger who has difficulty moving.", ex: "The passenger has requested mobility assistance on arrival." },
    { en: "a connecting flight", fr: "un vol en correspondance", def: "The next flight in a multi-flight journey.", ex: "The passenger is worried about missing a connecting flight." },
    { en: "to feel light-headed", fr: "se sentir étourdi(e)", def: "Feel weak or as if you might faint.", ex: "The passenger says she feels light-headed." },
    { en: "to remain seated", fr: "rester assis(e)", def: "Stay in the seat for safety or medical reasons.", ex: "Please remain seated while I contact a colleague." }
  ],
  handover: [
    { en: "The passenger in seat…", fr: "Le passager au siège…", def: "A precise operational opening.", ex: "The passenger in seat 4A requires a nut-free meal." },
    { en: "has requested…", fr: "a demandé…", def: "Report a request that is still relevant now.", ex: "She has requested assistance on arrival." },
    { en: "I have already…", fr: "J’ai déjà…", def: "Report an action completed with a current result.", ex: "I have already removed the incorrect tray." },
    { en: "We still need to…", fr: "Il nous reste à…", def: "Identify the outstanding action.", ex: "We still need to confirm a safe meal option." },
    { en: "Please be aware that…", fr: "Veuillez noter que…", def: "Highlight important operational information.", ex: "Please be aware that the passenger has a severe allergy." },
    { en: "I will follow up…", fr: "Je vais assurer le suivi…", def: "State who will continue the action.", ex: "I will follow up with the passenger after the announcement." }
  ]
};

const vocabQuizData = [
  { q: "A passenger uses an unclear expression. What is the best response?", options: ["You are not clear.", "When you say ‘special assistance’, do you mean help during boarding?", "Repeat everything."], answer: "When you say ‘special assistance’, do you mean help during boarding?", why: "It checks the exact meaning politely and efficiently." },
  { q: "Which phrase acknowledges concern without promising a result?", options: ["I guarantee your connection.", "I understand your concern.", "There is no problem."], answer: "I understand your concern.", why: "It shows empathy without making an unsafe promise." },
  { q: "Which action is essential before serving food to a passenger with an allergy?", options: ["Verify the ingredients", "Guess from the appearance", "Offer the most popular dish"], answer: "Verify the ingredients", why: "Allergy information is safety-critical." },
  { q: "Which phrase is best for an outstanding action in a crew handover?", options: ["We still need to confirm a safe alternative.", "Maybe someone does it.", "The meal was bad."], answer: "We still need to confirm a safe alternative.", why: "It identifies a clear operational next step." },
  { q: "What is a connecting flight?", options: ["A flight that follows another flight in the same journey", "A private flight", "A flight without passengers"], answer: "A flight that follows another flight in the same journey", why: "A connection is the next segment of the passenger’s journey." },
  { q: "Which phrase checks your understanding?", options: ["Is that correct?", "You are correct.", "It is finished."], answer: "Is that correct?", why: "It invites the passenger to validate your reformulation." },
  { q: "Which expression means a replacement that respects the passenger’s needs?", options: ["a suitable alternative", "a random plate", "a standard mistake"], answer: "a suitable alternative", why: "Suitable means appropriate for the specific restriction or preference." },
  { q: "Which phrase indicates that you will provide updates?", options: ["I’ll keep you informed.", "You must find out.", "I know everything."], answer: "I’ll keep you informed.", why: "It creates a clear expectation of follow-up." },
  { q: "Which symptom means feeling weak or close to fainting?", options: ["to feel light-headed", "to feel connected", "to feel seated"], answer: "to feel light-headed", why: "Light-headed describes dizziness or weakness." },
  { q: "Which opening is most precise for a cabin handover?", options: ["There is a woman.", "The passenger in seat 4A…", "Someone said something."], answer: "The passenger in seat 4A…", why: "A seat number immediately identifies the person concerned." }
];

const questionQuizData = [
  { q: "___ you have any food allergies?", options: ["Are", "Do", "Have"], answer: "Do", why: "This asks about a general fact, so use Do + subject + base verb." },
  { q: "___ you experiencing any pain at the moment?", options: ["Are", "Do", "Did"], answer: "Are", why: "At the moment describes a current situation: Are + verb-ing." },
  { q: "When ___ you request the special meal?", options: ["have", "did", "are"], answer: "did", why: "The request happened at a finished past time." },
  { q: "___ you informed another crew member yet?", options: ["Did", "Do", "Have"], answer: "Have", why: "Yet and a result relevant now favour the present perfect." },
  { q: "Which question is most professional?", options: ["What do you want?", "May I ask what you would prefer?", "Tell me your choice."], answer: "May I ask what you would prefer?", why: "It is polite, open and appropriate for premium service." },
  { q: "Which question correctly asks about duration?", options: ["How long are you feeling unwell?", "How long have you been feeling unwell?", "How long do you felt unwell?"], answer: "How long have you been feeling unwell?", why: "The condition began in the past and continues now." },
  { q: "Choose the correct indirect question.", options: ["Could you tell me where is your passport?", "Could you tell me where your passport is?", "Could you tell where your passport?"], answer: "Could you tell me where your passport is?", why: "Indirect questions use statement word order after the introductory phrase." },
  { q: "Which question checks a dietary risk precisely?", options: ["Do you like food?", "Could you clarify whether this is an allergy or an intolerance?", "Why are you difficult?"], answer: "Could you clarify whether this is an allergy or an intolerance?", why: "It distinguishes two clinically important concepts professionally." },
  { q: "___ the passenger taken any medication?", options: ["Has", "Does", "Is"], answer: "Has", why: "Use Has + past participle for an action relevant now." },
  { q: "Which sentence is grammatically correct?", options: ["Did you requested assistance?", "Did you request assistance?", "Do you requested assistance?"], answer: "Did you request assistance?", why: "After did, use the base verb." },
  { q: "Which question asks about an action happening now?", options: ["Why do you wait?", "Why are you waiting near the galley?", "Why did you waiting?"], answer: "Why are you waiting near the galley?", why: "Are + verb-ing describes the current action." },
  { q: "Which is the best confirmation question?", options: ["So, you need wheelchair assistance on arrival. Is that correct?", "You need wheelchair, yes?", "I decide you need assistance."], answer: "So, you need wheelchair assistance on arrival. Is that correct?", why: "It reformulates the need and explicitly invites confirmation." }
];

const wordOrderSentences = [
  ["Could", "you", "confirm", "your", "seat", "number,", "please?"],
  ["Do", "you", "have", "any", "other", "food", "allergies?"],
  ["When", "did", "you", "request", "the", "special", "meal?"],
  ["Have", "you", "already", "spoken", "to", "another", "crew", "member?"],
  ["May", "I", "ask", "what", "you", "would", "prefer?"],
  ["Could", "you", "clarify", "whether", "this", "is", "an", "allergy", "or", "an", "intolerance?" ]
];

const tenseQuizData = [
  { q: "The passenger ___ meat for religious reasons.", options: ["is not eating now", "does not eat", "did not ate"], answer: "does not eat", why: "This is a stable dietary requirement, so use the present simple." },
  { q: "The passenger ___ for a replacement meal at the moment.", options: ["waits", "is waiting", "has waited yesterday"], answer: "is waiting", why: "At the moment indicates an action happening now." },
  { q: "She ___ the vegetarian meal when she booked the ticket.", options: ["requested", "has request", "is requesting"], answer: "requested", why: "The booking is a finished past event." },
  { q: "She ___ the wrong tray, so the problem is still current.", options: ["received yesterday at 2", "has received", "is receive"], answer: "has received", why: "The present perfect connects the past event to the present problem." },
  { q: "I ___ the incorrect tray and I am checking an alternative now.", options: ["have removed", "remove yesterday", "am removed"], answer: "have removed", why: "The action is completed and its result matters now." },
  { q: "The passenger usually ___ a gluten-free meal before travelling.", options: ["requests", "is requesting usually", "request"], answer: "requests", why: "Usually signals a repeated action; third-person singular takes -s." },
  { q: "Right now, the purser ___ the ingredients with catering.", options: ["checks every flight", "is checking", "checked during booking"], answer: "is checking", why: "Right now requires the present continuous." },
  { q: "The symptoms ___ about twenty minutes ago.", options: ["began", "have begin", "are beginning yesterday"], answer: "began", why: "Ago requires the past simple." },
  { q: "The passenger ___ any medication yet.", options: ["has not taken", "did not took", "is not take"], answer: "has not taken", why: "Yet is commonly used with the present perfect for a current result." },
  { q: "I ___ the passenger as soon as I receive confirmation.", options: ["will update", "am updated", "updated now"], answer: "will update", why: "This is a future action following a condition or time clause." }
];

const serviceQuizData = [
  { q: "A passenger says, ‘I am allergic to nuts.’ What should you do first?", options: ["Recommend the pear and almond tart", "Verify the ingredients and available safe options", "Say that all meals are probably safe"], answer: "Verify the ingredients and available safe options", why: "An allergy is safety-critical; never guess." },
  { q: "A passenger wants a light, dairy-free meal. Which option is the best recommendation?", options: ["Poached salmon with steamed vegetables", "Pear and almond tart", "Chicken with potato purée"], answer: "Poached salmon with steamed vegetables", why: "The menu identifies it as light and dairy-free." },
  { q: "Which response is most elegant?", options: ["Take the salmon.", "As you are looking for a light option, I would recommend the poached salmon. Would that be suitable?", "The fish is there."], answer: "As you are looking for a light option, I would recommend the poached salmon. Would that be suitable?", why: "It links the recommendation to the passenger’s preference and checks acceptance." },
  { q: "A vegan passenger asks about the roasted vegetable salad. What must you mention?", options: ["It contains sesame", "It contains chicken", "It is served hot with dairy"], answer: "It contains sesame", why: "Potential allergens must be communicated even when the dish matches the preference." },
  { q: "A passenger dislikes the proposed alternative. What is the best reply?", options: ["That is all we have.", "I understand. Let me check whether another suitable option is available.", "You must choose now."], answer: "I understand. Let me check whether another suitable option is available.", why: "It acknowledges the response and continues the service process professionally." },
  { q: "Which sentence avoids an unsafe guarantee?", options: ["I guarantee that you will catch your connection.", "I’ll check the latest information and see what assistance may be available.", "The flight will definitely arrive early."], answer: "I’ll check the latest information and see what assistance may be available.", why: "It promises an action, not an outcome outside your control." },
  { q: "A passenger has a dairy intolerance. Which menu item is clearly unsuitable?", options: ["Herb-roasted chicken with potato purée", "Poached salmon with steamed vegetables", "Roasted vegetable salad"], answer: "Herb-roasted chicken with potato purée", why: "The menu states that the dish contains dairy." },
  { q: "How should you finish a recommendation?", options: ["Is that okay for you?", "Would that be suitable for you?", "You agree."], answer: "Would that be suitable for you?", why: "It is polite and gives the passenger space to confirm or clarify." }
];

const relayQuizData = [
  { q: "Which detail is essential in a handover about a severe allergy?", options: ["The passenger’s favourite colour", "The allergen and verified action", "The passenger’s holiday plans"], answer: "The allergen and verified action", why: "The colleague needs safety-critical information and the action already taken." },
  { q: "Which sentence is the clearest operational update?", options: ["The passenger was unhappy.", "Passenger in 7C has requested wheelchair assistance on arrival; the request still needs confirmation.", "Something needs doing later."], answer: "Passenger in 7C has requested wheelchair assistance on arrival; the request still needs confirmation.", why: "It identifies the passenger, request and outstanding action." },
  { q: "Which information can usually be omitted from a concise meal handover?", options: ["Seat number", "Severe allergy", "The passenger’s opinion about the airport décor"], answer: "The passenger’s opinion about the airport décor", why: "It does not change the required action." },
  { q: "Which tense reports an action completed with a current result?", options: ["I have removed the tray.", "I remove the tray yesterday.", "I am remove the tray."], answer: "I have removed the tray.", why: "The present perfect highlights the action’s current operational result." },
  { q: "Which phrase clearly identifies an outstanding task?", options: ["We still need to verify the ingredients.", "Maybe it is fine.", "It was nice."], answer: "We still need to verify the ingredients.", why: "It tells the colleague exactly what remains to be done." },
  { q: "A passenger is worried about a connection. Which details are essential?", options: ["Arrival time, connecting flight and assistance requested", "Favourite airline and meal preference only", "Seat colour and weather at departure"], answer: "Arrival time, connecting flight and assistance requested", why: "These details determine the operational response." }
];

const listeningData = [
  {
    id: "meal", title: "Missing special meal", label: "UK · moderate speed", text: "Excuse me. I requested a vegetarian meal when I booked my ticket two weeks ago, but the tray I have received contains chicken. I also have a serious nut allergy, so I need to know exactly what is in any alternative meal.",
    questions: [
      { q: "What is the main problem?", options: ["The passenger received the wrong meal", "The passenger lost a passport", "The passenger wants a seat upgrade"], answer: "The passenger received the wrong meal", why: "The requested vegetarian meal was replaced by a chicken dish." },
      { q: "Which detail is safety-critical?", options: ["The booking was two weeks ago", "The passenger has a serious nut allergy", "The passenger is in Business Class"], answer: "The passenger has a serious nut allergy", why: "The allergy affects any alternative offered." }
    ], model: "Let me make sure I have understood correctly: you requested a vegetarian meal, but you received chicken, and you also have a serious nut allergy. Is that correct?"
  },
  {
    id: "connection", title: "Tight connection", label: "US · natural speed", text: "Hi. The departure delay has made me really anxious because I only have forty minutes to catch my connecting flight to Boston. I am travelling with my eight-year-old daughter, and our next gate is usually in another terminal. Could you check the updated arrival time and tell me what assistance is available?",
    questions: [
      { q: "How much connection time does the passenger have?", options: ["Fourteen minutes", "Forty minutes", "One hour and forty minutes"], answer: "Forty minutes", why: "The passenger says she only has forty minutes." },
      { q: "What two factors increase the concern?", options: ["She is travelling with a child and may need another terminal", "She dislikes the meal and the seat", "She has no luggage and no ticket"], answer: "She is travelling with a child and may need another terminal", why: "Both details may affect how quickly she can transfer." }
    ], model: "So, you have a forty-minute connection to Boston, you are travelling with your eight-year-old daughter, and the next gate may be in another terminal. You would like the updated arrival time and information about transfer assistance. Is that correct?"
  },
  {
    id: "medical", title: "Passenger feeling unwell", label: "UK · softly spoken", text: "I am sorry to bother you, but I have been feeling light-headed for about fifteen minutes. I did not eat breakfast this morning, and I took my usual blood-pressure medication before boarding. I do not have chest pain, but I feel weak when I stand up.",
    questions: [
      { q: "How long has the passenger felt light-headed?", options: ["About fifteen minutes", "Since yesterday", "Five hours"], answer: "About fifteen minutes", why: "The passenger gives a duration of approximately fifteen minutes." },
      { q: "Which symptom is NOT present?", options: ["Weakness when standing", "Chest pain", "Light-headedness"], answer: "Chest pain", why: "The passenger explicitly says there is no chest pain." }
    ], model: "You have felt light-headed for about fifteen minutes, you have not eaten breakfast, and you took blood-pressure medication before boarding. You feel weak when you stand, but you do not have chest pain. Is that correct?"
  },
  {
    id: "seat", title: "Seat and mobility concern", label: "US · faster message", text: "I recently had back surgery, and I was told at check-in that I could have an aisle seat, but my boarding pass shows a middle seat in row twenty-eight. I cannot remain in that position for a long flight, and I may need help reaching the lavatory. Could you see whether there is a safer available seat?",
    questions: [
      { q: "What was the passenger told at check-in?", options: ["An aisle seat could be provided", "The flight was cancelled", "A wheelchair was unavailable"], answer: "An aisle seat could be provided", why: "The passenger expected an aisle seat after speaking to check-in staff." },
      { q: "What is the real need?", options: ["A free upgrade", "A safer seat and possible mobility assistance", "A special meal"], answer: "A safer seat and possible mobility assistance", why: "Recent surgery affects seating and movement." }
    ], model: "So, following recent back surgery, you expected an aisle seat but have been assigned a middle seat in row twenty-eight. You may also need help reaching the lavatory. You would like us to check for a safer available seat. Is that correct?"
  }
];

const speakingData = [
  { id: "sp1", level: "LEVEL 1 · GUIDED", title: "Missing vegetarian meal", text: "I ordered a vegetarian meal, but this tray contains chicken. I also have a nut allergy.", guidance: ["Acknowledge", "Ask one safety question", "Reformulate", "Explain next action", "Confirm follow-up"], starter: "I’m sorry about the mistake. May I ask…", duration: 75, model: "I’m sorry about the mistake. May I ask whether you have any other food allergies? Let me confirm: you requested a vegetarian meal and you have a nut allergy. I’ll remove this tray and verify the ingredients of the available alternatives before offering you another meal. I’ll return as soon as I have confirmed a safe option. Thank you for letting me know." },
  { id: "sp2", level: "LEVEL 1 · GUIDED", title: "Seat change request", text: "My seat does not recline, and I have an important meeting after landing. I need to rest.", guidance: ["Show understanding", "Check the seat", "Ask preference", "Offer realistic possibilities", "Do not promise an upgrade"], starter: "I understand that you need to rest. Let me…", duration: 75, model: "I understand that you need to rest before your meeting. Let me first check whether the seat mechanism can be adjusted. If it cannot, I’ll see whether another suitable seat is available. May I ask whether an aisle or window seat would be preferable? I cannot guarantee a change, but I’ll do my best to find an appropriate solution and keep you informed." },
  { id: "sp3", level: "LEVEL 2 · SUPPORTED", title: "Nervous passenger during turbulence", text: "The turbulence is getting stronger. Is the aircraft safe? I am very frightened.", guidance: ["Calm tone", "Acknowledge fear", "Clear safety instruction", "Avoid technical overload", "Confirm return"], starter: "", duration: 90, model: "I understand that the turbulence feels frightening. The captain and flight crew are monitoring the conditions, and turbulence is something aircraft are designed to manage. For your safety, please keep your seat belt securely fastened and remain seated. I will stay nearby and check on you again shortly. Would it help if I explained what you can expect over the next few minutes?" },
  { id: "sp4", level: "LEVEL 2 · SUPPORTED", title: "Business Class meal complaint", text: "This is not the meal I selected, and it is already cold. I expected a much higher standard of service.", guidance: ["Do not become defensive", "Apologise", "Clarify original choice", "Offer solution", "Thank passenger"], starter: "", duration: 90, model: "I’m very sorry that the meal does not match your selection and has not been served at the expected temperature. Could you confirm which dish you originally chose? I’ll remove this tray and check what alternatives are available. If possible, I’ll arrange a properly heated replacement. Thank you for bringing this to my attention, and I’ll update you as quickly as possible." },
  { id: "sp5", level: "LEVEL 3 · LILATE", title: "Allergy plus limited options", text: "I cannot eat gluten or dairy, and I was told there are no special meals left. What can I eat?", guidance: ["Identify two restrictions", "Ask about allergies", "Verify, never guess", "Offer process before product", "Close clearly"], starter: "", duration: 105, model: "I understand. Before I recommend anything, may I ask whether these are intolerances or severe allergies, and whether you have any additional restrictions? I’ll check the ingredient information for every available item rather than make an assumption. If there is no complete meal that is suitable, I will see whether we can create a safe combination from individually verified items. I’ll return once I have confirmed the options with the purser." },
  { id: "sp6", level: "LEVEL 3 · LILATE", title: "Delayed flight and missed connection", text: "We are late, my next flight leaves forty minutes after we land, and I am travelling with a young child. What are you going to do?", guidance: ["Extract timing", "Ask destination or flight", "Avoid guarantee", "Explain available checks", "Reassure and update"], starter: "", duration: 105, model: "I understand why you are concerned, especially as you are travelling with a young child. Could you confirm your connecting destination and flight number? I’ll check the latest arrival time and the connection information available to us. I cannot guarantee the onward flight, but I can find out whether transfer assistance or updated instructions are available. I’ll keep you informed as soon as I receive confirmation." }
];

const competencyLabels = [
  "I can welcome a passenger professionally.", "I can identify the principal request.", "I can detect important secondary information.", "I can ask relevant follow-up questions.", "I can reformulate accurately.", "I can reassure without making unsafe promises.", "I can offer an appropriate solution.", "I can confirm the next action.", "I can transmit information to a colleague.", "I can write a concise service report.", "I can respond without a memorised script.", "I can understand more than one accent."
];

function qs(selector, scope = document) { return scope.querySelector(selector); }
function qsa(selector, scope = document) { return [...scope.querySelectorAll(selector)]; }
function shuffle(items) { const arr = [...items]; for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; }
function shuffleDifferent(items) { let result = shuffle(items); if (result.join("|") === items.join("|") && result.length > 1) result = [...result.slice(1), result[0]]; return result; }
function optionsWithVariedAnswer(item, index) { const wrong = shuffle(item.options.filter(o => o !== item.answer)); const positions = [1, 2, 0, 2, 1, 0, 1, 0, 2, 1, 2, 0]; const at = Math.min(positions[index % positions.length], wrong.length); wrong.splice(at, 0, item.answer); return wrong; }
function escapeHtml(value = "") { return String(value).replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c])); }
function storageGet(key) { try { return localStorage.getItem(key); } catch { return null; } }
function storageSet(key, value) { try { localStorage.setItem(key, value); return true; } catch { return false; } }
function storageRemove(key) { try { localStorage.removeItem(key); return true; } catch { return false; } }
function showToast(message) { const toast = qs("#toast"); toast.textContent = message; toast.classList.add("show"); setTimeout(() => toast.classList.remove("show"), 2200); }
function downloadBlob(content, filename, type = "text/plain") { const blob = new Blob([content], { type }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
function countWords(text) { return text.trim() ? text.trim().split(/\s+/).length : 0; }

function speak(text, lang, rate = 0.95) {
  if (!("speechSynthesis" in window)) return showToast("Text-to-speech is not available in this browser.");
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang || qs("#accentSelect").value;
  utterance.rate = rate;
  const voices = speechSynthesis.getVoices();
  const preferred = voices.find(v => v.lang === utterance.lang) || voices.find(v => v.lang.startsWith(utterance.lang.slice(0, 2)));
  if (preferred) utterance.voice = preferred;
  speechSynthesis.speak(utterance);
}

function setScore(key, earned, total) { state.score[key] = { earned, total }; updateDashboard(); saveState(); }
function markCompleted(key, value = true) { if (!key) return; state.completed[key] = value; updateDashboard(); saveState(); }
function getTotals() { return Object.values(state.score).reduce((acc, item) => ({ earned: acc.earned + Number(item.earned || 0), total: acc.total + Number(item.total || 0) }), { earned: 0, total: 0 }); }
function updateDashboard() {
  const sections = qsa(".lesson-section[data-progress-key]");
  const complete = sections.filter(s => state.completed[s.dataset.progressKey]).length;
  const percent = Math.round((complete / sections.length) * 100) || 0;
  const totals = getTotals();
  qs("#globalProgressText").textContent = `${percent}%`; qs("#globalProgressBar").style.width = `${percent}%`;
  qs("#scoreValue").textContent = totals.earned; qs("#scoreTotal").textContent = totals.total;
  qs("#reportScore").textContent = `${totals.earned} / ${totals.total}`; qs("#reportCompletion").textContent = `${percent}%`;
  updateAutoCriteria();
}

function saveState() {
  const formValues = {};
  qsa("input, textarea, select").forEach((el, i) => {
    const key = el.id || el.name || el.dataset.plan || el.dataset.rubric || `field-${i}`;
    if (el.type === "radio" || el.type === "checkbox") formValues[key + (el.value ? `::${el.value}` : "")] = el.checked;
    else formValues[key] = el.value;
  });
  state.saved = { formValues, showFr: document.body.classList.contains("show-fr"), focus: document.body.classList.contains("focus-mode") };
  storageSet(STORAGE_KEY, JSON.stringify({ score: state.score, completed: state.completed, saved: state.saved, startedAt: state.startedAt }));
}
function loadState() {
  const raw = storageGet(STORAGE_KEY); if (!raw) return;
  try {
    const parsed = JSON.parse(raw); Object.assign(state.score, parsed.score || {}); Object.assign(state.completed, parsed.completed || {}); state.startedAt = parsed.startedAt || Date.now(); state.saved = parsed.saved || {};
    const values = state.saved.formValues || {};
    qsa("input, textarea, select").forEach((el, i) => {
      const key = el.id || el.name || el.dataset.plan || el.dataset.rubric || `field-${i}`;
      if (el.type === "radio" || el.type === "checkbox") { const stored = values[key + (el.value ? `::${el.value}` : "")]; if (typeof stored === "boolean") el.checked = stored; }
      else if (Object.prototype.hasOwnProperty.call(values, key)) el.value = values[key];
    });
    document.body.classList.toggle("show-fr", !!state.saved.showFr); document.body.classList.toggle("focus-mode", !!state.saved.focus);
    qs("#translationToggle").setAttribute("aria-pressed", String(!!state.saved.showFr)); qs("#focusToggle").setAttribute("aria-pressed", String(!!state.saved.focus));
  } catch { /* ignore corrupted storage */ }
}

function renderVocab(category = "clarify") {
  const grid = qs("#vocabGrid"); grid.innerHTML = "";
  vocabData[category].forEach(item => {
    const card = document.createElement("article"); card.className = "vocab-card";
    card.innerHTML = `<div class="vocab-card-head"><span>${escapeHtml(item.en)}</span><button class="speak-button" type="button" aria-label="Listen">▶</button></div><p class="fr-support">${escapeHtml(item.fr)}</p><p>${escapeHtml(item.def)}</p><small>${escapeHtml(item.ex)}</small>`;
    qs("button", card).addEventListener("click", () => speak(`${item.en}. ${item.ex}`)); grid.appendChild(card);
  });
}

function renderChoiceQuiz(container, data, prefix, scoreKey, sectionKey, resultEl) {
  container.innerHTML = "";
  data.forEach((item, index) => {
    const article = document.createElement("article"); article.className = "quiz-item"; article.dataset.index = index;
    const options = optionsWithVariedAnswer(item, index);
    article.innerHTML = `<p><strong>${index + 1}.</strong> ${escapeHtml(item.q)}</p><div class="quiz-options">${options.map((option, oi) => `<label><input type="radio" name="${prefix}-${index}" value="${escapeHtml(option)}"><span>${escapeHtml(option)}</span></label>`).join("")}</div><p class="item-explanation" aria-live="polite"></p>`;
    qsa("input", article).forEach(input => input.addEventListener("change", () => { evaluateChoiceItem(article, item); updateInstantChoiceScore(container, data, scoreKey, sectionKey, resultEl); }));
    container.appendChild(article);
  });
}
function evaluateChoiceItem(itemEl, item) {
  const selected = qs("input:checked", itemEl); if (!selected) return;
  const correctInput = qsa("input", itemEl).find(input => input.value === item.answer);
  qsa("label", itemEl).forEach(label => label.classList.remove("correct", "incorrect"));
  const correct = selected.value === item.answer;
  selected.closest("label").classList.add(correct ? "correct" : "incorrect"); if (!correct && correctInput) correctInput.closest("label").classList.add("correct");
  itemEl.dataset.answered = "true"; itemEl.dataset.correct = String(correct);
  const explanation = qs(".item-explanation", itemEl); explanation.className = `item-explanation ${correct ? "good" : "bad"}`; explanation.textContent = `${correct ? "Correct." : "Not quite."} ${item.why || "Review the professional meaning."}`;
  saveState();
}
function updateInstantChoiceScore(container, data, scoreKey, sectionKey, resultEl) {
  const items = qsa(".quiz-item", container); const answered = items.filter(i => i.dataset.answered === "true").length; const earned = items.filter(i => i.dataset.correct === "true").length;
  setScore(scoreKey, earned, data.length); resultEl.textContent = `${answered}/${data.length} answered · ${earned} correct`;
  if (answered === data.length) markCompleted(sectionKey);
}
function restoreQuiz(container, data, scoreKey, sectionKey, resultEl) {
  qsa(".quiz-item", container).forEach((itemEl, index) => { if (qs("input:checked", itemEl)) evaluateChoiceItem(itemEl, data[index]); });
  updateInstantChoiceScore(container, data, scoreKey, sectionKey, resultEl);
}

function renderWordOrder() {
  const area = qs("#wordOrderArea"); area.innerHTML = "";
  wordOrderSentences.forEach((tokens, index) => {
    const card = document.createElement("div"); card.className = "word-order-card"; card.dataset.index = index;
    card.innerHTML = `<p><strong>Question ${index + 1}</strong></p><div class="word-bank"></div><div class="sentence-build" aria-label="Built sentence"></div><p class="word-order-feedback"></p>`;
    const bank = qs(".word-bank", card), build = qs(".sentence-build", card);
    shuffleDifferent(tokens).forEach(token => { const btn = document.createElement("button"); btn.type = "button"; btn.className = "word-token"; btn.textContent = token; btn.addEventListener("click", () => { (btn.parentElement === bank ? build : bank).appendChild(btn); evaluateWordOrderCard(card, tokens); }); bank.appendChild(btn); });
    area.appendChild(card);
  }); setScore("wordOrder", 0, wordOrderSentences.length * 2); qs("#wordOrderResult").textContent = `0/${wordOrderSentences.length} correct`;
}
function evaluateWordOrderCard(card, correctTokens) {
  const built = qsa(".sentence-build .word-token", card).map(b => b.textContent), feedback = qs(".word-order-feedback", card);
  if (built.length < correctTokens.length) { feedback.textContent = `${built.length}/${correctTokens.length} words placed`; feedback.style.color = "var(--muted)"; return; }
  const correct = built.join(" ") === correctTokens.join(" "); card.dataset.correct = String(correct); feedback.textContent = correct ? "Correct — precise question structure." : "Not quite. Move words back and try again."; feedback.style.color = correct ? "#16834a" : "#b42318";
  const count = qsa(".word-order-card", qs("#wordOrderArea")).filter(c => c.dataset.correct === "true").length; setScore("wordOrder", count * 2, wordOrderSentences.length * 2); qs("#wordOrderResult").textContent = `${count}/${wordOrderSentences.length} correct`; if (count === wordOrderSentences.length) markCompleted("questions");
}

function renderListening() {
  const root = qs("#listeningActivities"); root.innerHTML = "";
  listeningData.forEach((item, itemIndex) => {
    const card = document.createElement("article"); card.className = "listening-card"; card.dataset.listeningId = item.id;
    card.innerHTML = `<div class="listening-head"><div><span class="activity-label">Scenario ${itemIndex + 1} · ${escapeHtml(item.label)}</span><h3>${escapeHtml(item.title)}</h3></div><span class="points">${item.questions.length} points</span></div>
      <div class="accent-actions"><button class="button primary small" type="button" data-listen="${item.id}" data-lang="en-GB" data-rate="0.9">▶ UK</button><button class="button secondary small" type="button" data-listen="${item.id}" data-lang="en-US" data-rate="0.95">▶ US</button><button class="button ghost small" type="button" data-listen="${item.id}" data-lang="en-GB" data-rate="1.12">▶ Faster</button></div>
      <div class="note-grid"><input data-note="${item.id}-seat" placeholder="seat/person"><input data-note="${item.id}-request" placeholder="request"><input data-note="${item.id}-problem" placeholder="problem"><input data-note="${item.id}-restriction" placeholder="restriction"><input data-note="${item.id}-action" placeholder="action needed"></div>
      <div class="listening-questions">${item.questions.map((question, qi) => `<div class="listening-question" data-q-index="${qi}"><p><strong>${qi + 1}.</strong> ${escapeHtml(question.q)}</p><div class="quiz-options">${optionsWithVariedAnswer(question, qi + itemIndex).map(o => `<label><input type="radio" name="listen-${item.id}-${qi}" value="${escapeHtml(o)}"><span>${escapeHtml(o)}</span></label>`).join("")}</div><p class="instant-feedback"></p></div>`).join("")}</div>
      <label><strong>Your reformulation</strong><textarea data-listening-note="${item.id}" rows="3" placeholder="So, you… Is that correct?"></textarea></label>
      <div class="panel-actions"><button class="button ghost small" type="button" data-transcript="${item.id}">Show transcript</button><button class="button secondary small" type="button" data-model="${item.id}">Show model reformulation</button><button class="button ghost small" type="button" data-record-listening="${item.id}">● Record reformulation</button><button class="button ghost small" type="button" data-stop-listening="${item.id}" disabled>■ Stop</button></div>
      <p class="transcript" id="transcript-${item.id}" hidden>${escapeHtml(item.text)}</p><p class="model-reformulation" id="model-${item.id}" hidden>${escapeHtml(item.model)}</p><audio id="audio-listen-${item.id}" controls hidden></audio><a id="download-listen-${item.id}" class="button secondary small" href="#" download="aminata-${item.id}-reformulation.webm" hidden>Download recording</a>`;
    qsa("[data-listen]", card).forEach(btn => btn.addEventListener("click", () => speak(item.text, btn.dataset.lang, Number(btn.dataset.rate))));
    qsa(".listening-question input", card).forEach(input => input.addEventListener("change", () => evaluateListeningQuestion(item, input.closest(".listening-question"))));
    qs(`[data-transcript="${item.id}"]`, card).addEventListener("click", e => { const el = qs(`#transcript-${item.id}`); el.hidden = !el.hidden; e.currentTarget.textContent = el.hidden ? "Show transcript" : "Hide transcript"; });
    qs(`[data-model="${item.id}"]`, card).addEventListener("click", e => { const el = qs(`#model-${item.id}`); el.hidden = !el.hidden; e.currentTarget.textContent = el.hidden ? "Show model reformulation" : "Hide model reformulation"; });
    qs(`[data-record-listening="${item.id}"]`, card).addEventListener("click", () => startRecording(`listen-${item.id}`, 75));
    qs(`[data-stop-listening="${item.id}"]`, card).addEventListener("click", () => stopRecording(`listen-${item.id}`)); root.appendChild(card);
  });
}
function evaluateListeningQuestion(item, qEl) {
  const index = Number(qEl.dataset.qIndex), data = item.questions[index], selected = qs("input:checked", qEl); if (!selected) return;
  qsa("label", qEl).forEach(l => l.classList.remove("correct", "incorrect")); const correct = selected.value === data.answer; selected.closest("label").classList.add(correct ? "correct" : "incorrect"); const c = qsa("input", qEl).find(i => i.value === data.answer); if (!correct && c) c.closest("label").classList.add("correct");
  qEl.dataset.answered = "true"; qEl.dataset.correct = String(correct); const feedback = qs(".instant-feedback", qEl); feedback.className = `instant-feedback ${correct ? "good" : "bad"}`; feedback.textContent = `${correct ? "Correct." : "Not quite."} ${data.why}`; updateListeningScore(); saveState();
}
function updateListeningScore() {
  const questions = qsa(".listening-question"); const earned = questions.filter(q => q.dataset.correct === "true").length; const answered = questions.filter(q => q.dataset.answered === "true").length; setScore("listening", earned, questions.length); if (answered === questions.length) markCompleted("listening");
}

function renderSpeaking() {
  const root = qs("#speakingMissions"); root.innerHTML = "";
  speakingData.forEach((item, index) => {
    const card = document.createElement("article"); card.className = "speaking-card"; card.dataset.speakingId = item.id;
    card.innerHTML = `<div class="speaking-head"><div><span class="mission-level">${escapeHtml(item.level)}</span><h3>${index + 1}. ${escapeHtml(item.title)}</h3></div><span class="timer-chip" id="timer-${item.id}">${formatTime(item.duration)}</span></div><div class="prompt-block"><p><strong>Passenger:</strong> “${escapeHtml(item.text)}”</p></div><div class="scenario-audio"><button class="button primary small" type="button" data-sp-listen="${item.id}" data-lang="en-GB">▶ UK passenger</button><button class="button secondary small" type="button" data-sp-listen="${item.id}" data-lang="en-US">▶ US passenger</button><button class="button ghost small" type="button" data-sp-fast="${item.id}">▶ Faster</button></div><div class="flight-checklist">${item.guidance.map(g => `<span>${escapeHtml(g)}</span>`).join("")}</div>${item.starter ? `<p class="sentence-starter"><strong>Possible opening:</strong> ${escapeHtml(item.starter)}</p>` : ""}<textarea class="speaking-notes" rows="3" data-speaking-note="${item.id}" placeholder="Prepare 3–5 keywords, not a complete script…"></textarea><div class="record-controls"><button class="button record" type="button" data-record="${item.id}">● Start recording</button><button class="button ghost" type="button" data-stop="${item.id}" disabled>■ Stop</button><button class="button ghost" type="button" data-timer-only="${item.id}">Start timer</button></div><p class="record-status" id="status-${item.id}">Ready</p><audio id="audio-${item.id}" controls hidden></audio><a class="button secondary small download-audio" id="download-${item.id}" href="#" download="aminata-${item.id}.webm" hidden>Download recording</a><details class="model-box"><summary>Reveal B2 model</summary><div class="model-content"><button class="speak-button inline" type="button" data-model-speak="${item.id}">▶ Listen</button><p id="speaking-model-${item.id}">${escapeHtml(item.model)}</p></div></details>`;
    qsa(`[data-sp-listen="${item.id}"]`, card).forEach(btn => btn.addEventListener("click", () => speak(item.text, btn.dataset.lang, .95)));
    qs(`[data-sp-fast="${item.id}"]`, card).addEventListener("click", () => speak(item.text, "en-GB", 1.14));
    qs(`[data-record="${item.id}"]`, card).addEventListener("click", () => startRecording(item.id, item.duration)); qs(`[data-stop="${item.id}"]`, card).addEventListener("click", () => stopRecording(item.id)); qs(`[data-timer-only="${item.id}"]`, card).addEventListener("click", () => startTimer(item.id, item.duration)); qs(`[data-model-speak="${item.id}"]`, card).addEventListener("click", () => speak(item.model)); root.appendChild(card);
  });
}

async function startRecording(id, duration = 90) {
  if (!navigator.mediaDevices?.getUserMedia || !("MediaRecorder" in window)) return showToast("Audio recording is not supported in this browser.");
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true }); const recorder = new MediaRecorder(stream), chunks = [];
    recorder.addEventListener("dataavailable", e => { if (e.data.size) chunks.push(e.data); });
    recorder.addEventListener("stop", () => {
      const blob = new Blob(chunks, { type: recorder.mimeType || "audio/webm" }), url = URL.createObjectURL(blob); const audio = id === "final" ? qs("#finalAudio") : qs(`#audio-${id}`), link = id === "final" ? qs("#finalDownload") : qs(`#download-${id}`); if (audio) { audio.src = url; audio.hidden = false; } if (link) { link.href = url; link.hidden = false; }
      stream.getTracks().forEach(t => t.stop()); markCompleted(id.startsWith("listen-") ? "listening" : id === "final" ? "finalMission" : "roleplay");
    });
    state.recordings[id] = recorder; recorder.start(); const start = qs(`[data-record="${id}"]`) || qs(`[data-record-listening="${id.replace("listen-", "")}"]`) || (id === "final" ? qs("#finalRecordBtn") : null); const stop = qs(`[data-stop="${id}"]`) || qs(`[data-stop-listening="${id.replace("listen-", "")}"]`) || (id === "final" ? qs("#finalStopBtn") : null); if (start) start.disabled = true; if (stop) stop.disabled = false; const status = qs(`#status-${id}`); if (status) status.textContent = "Recording…"; startTimer(id, duration, true); showToast("Recording started.");
  } catch { showToast("Microphone access was not granted. Please allow it in your browser."); }
}
function stopRecording(id) { const recorder = state.recordings[id]; if (recorder && recorder.state !== "inactive") recorder.stop(); clearInterval(state.timers[id]); const start = qs(`[data-record="${id}"]`) || qs(`[data-record-listening="${id.replace("listen-", "")}"]`) || (id === "final" ? qs("#finalRecordBtn") : null); const stop = qs(`[data-stop="${id}"]`) || qs(`[data-stop-listening="${id.replace("listen-", "")}"]`) || (id === "final" ? qs("#finalStopBtn") : null); if (start) start.disabled = false; if (stop) stop.disabled = true; const status = qs(`#status-${id}`); if (status) status.textContent = "Recording complete — listen and download."; }
function startTimer(id, duration, autoStop = false) { clearInterval(state.timers[id]); let remaining = duration; const display = id === "final" ? qs("#finalTimer") : qs(`#timer-${id}`); if (display) display.textContent = formatTime(remaining); state.timers[id] = setInterval(() => { remaining -= 1; if (display) display.textContent = formatTime(Math.max(remaining, 0)); if (remaining <= 0) { clearInterval(state.timers[id]); if (autoStop) stopRecording(id); } }, 1000); }
function formatTime(seconds) { return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`; }

function updateRecommendation() { const text = `As you are looking for ${qs("#mealPreference").value}, I would recommend ${qs("#recommendedDish").value} ${qs("#recommendationReason").value}. Would that be suitable for you?`; qs("#generatedRecommendation").textContent = text; markCompleted("premium"); saveState(); }
function updateRelay() { const values = ["relaySeat", "relayRequest", "relayProblem", "relayAction", "relayNext"].map(id => qs(`#${id}`).value.trim()); const text = values.every(Boolean) ? `${values[0]} ${values[1]}. ${values[2]}. ${values[3]}. ${values[4]}.` : "Complete the five fields to generate your report."; qs("#generatedRelay").textContent = text; if (values.every(Boolean)) markCompleted("relay"); saveState(); }

function renderCompetencies() {
  const board = qs("#competencyBoard"); board.innerHTML = competencyLabels.map((label, index) => `<label class="competency-item"><input type="checkbox" id="competency-${index}" value="${escapeHtml(label)}"><span>${escapeHtml(label)}</span></label>`).join("");
  qsa(".competency-item input", board).forEach(input => input.addEventListener("change", () => { input.closest(".competency-item").classList.toggle("checked", input.checked); const checked = qsa(".competency-item input:checked", board).length; if (checked === competencyLabels.length) markCompleted("qualiopi"); saveState(); }));
}

function setupWriting() {
  const text = qs("#reportWriting"), update = () => { const words = countWords(text.value); qs("#reportWordCount").textContent = words; qs("#writingStatusBadge").textContent = words < 70 ? `${70 - words} more words recommended` : words <= 110 ? "Target length reached" : `${words - 110} words over target`; if (words >= 70) markCompleted("writing"); saveState(); };
  text.addEventListener("input", update); qs("#copyWriting").addEventListener("click", async () => { await navigator.clipboard.writeText(text.value); showToast("Writing copied."); }); qs("#downloadWriting").addEventListener("click", () => downloadBlob(text.value, "aminata-lesson-2-purser-message.txt")); update();
  qs("#finalHandoverText").addEventListener("input", e => { const words = countWords(e.target.value); qs("#finalHandoverBadge").textContent = words < 45 ? `${45 - words} more words recommended` : words <= 80 ? "Target length reached" : `${words - 80} words over target`; if (words >= 45) markCompleted("finalMission"); saveState(); });
  qs("#copyFinalHandover").addEventListener("click", async () => { await navigator.clipboard.writeText(qs("#finalHandoverText").value); showToast("Final handover copied."); });
}

function setupFinalMission() {
  const script = qs("#finalPassengerScript").textContent.trim(); qs("#finalListenUk").addEventListener("click", () => speak(script, "en-GB", .92)); qs("#finalListenUs").addEventListener("click", () => speak(script, "en-US", .96)); qs("#finalListenFast").addEventListener("click", () => speak(script, "en-GB", 1.15));
  qs("#finalRecordBtn").addEventListener("click", () => startRecording("final", 120)); qs("#finalStopBtn").addEventListener("click", () => stopRecording("final")); qs("#finalTimerBtn").addEventListener("click", () => startTimer("final", 120));
}

function setupRanges() { qsa('input[type="range"]').forEach(input => { const output = input.parentElement.querySelector("output"); const update = () => { if (output) output.textContent = `${input.value}/5`; saveState(); }; input.addEventListener("input", update); update(); }); }
function setupChecklists() { qsa(".writing-checklist").forEach(list => qsa('input[type="checkbox"]', list).forEach(box => box.addEventListener("change", () => { const all = qsa('input[type="checkbox"]', list); if (all.every(b => b.checked)) markCompleted("writing"); saveState(); }))); }

function updateAutoCriteria() {
  if (!qs("#autoCriteria")) return; const criterionData = [
    ["Vocabulary and professional phrasing", "vocab"], ["Question formation", "questions"], ["Word order", "wordOrder"], ["Listening comprehension", "listening"], ["Time-reference control", "tenses"], ["Premium service decisions", "service"], ["Operational information selection", "relay"]
  ];
  qs("#autoCriteria").innerHTML = criterionData.map(([label, key]) => { const item = state.score[key]; let status = "À réaliser"; if (item) { const ratio = item.total ? item.earned / item.total : 0; status = ratio >= .8 ? "Acquis" : ratio >= .5 ? "En cours" : "À renforcer"; } const cls = status === "Acquis" ? "acquired" : status === "En cours" ? "progress" : "pending"; return `<div class="criterion-row"><span>${escapeHtml(label)}</span><strong class="${cls}">${status}${item ? ` · ${item.earned}/${item.total}` : ""}</strong></div>`; }).join("");
}

function reportCompetencies() { return qsa(".competency-item input").map(i => `<li>${i.checked ? "☑" : "☐"} ${escapeHtml(i.value)}</li>`).join(""); }
function buildReportHtml() {
  const totals = getTotals(), date = qs("#lessonDate").value || new Date().toISOString().slice(0, 10), completion = qs("#reportCompletion").textContent;
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Évaluation Qualiopi — Aminata Touré — Leçon 2</title><style>body{font-family:Arial,sans-serif;color:#071b3a;margin:0;background:#f3f5f9}main{max-width:900px;margin:auto;background:white;padding:42px}h1{border-bottom:5px solid #d7193f;padding-bottom:15px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}.box,.metric{border:1px solid #ccd3df;border-radius:12px;padding:15px;margin:12px 0}.metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.comment{white-space:pre-wrap}.criterion-row{display:flex;justify-content:space-between;border-bottom:1px solid #e5e8ee;padding:8px 0}li{margin:7px 0}@media print{body{background:white}main{max-width:none;padding:0}.box{break-inside:avoid}}</style></head><body><main><h1>Évaluation Qualiopi — Aminata Touré</h1><p><strong>Leçon 2 :</strong> Listen, Clarify, Reassure & Resolve</p><div class="metrics"><div class="metric"><small>Date</small><br><strong>${escapeHtml(date)}</strong></div><div class="metric"><small>Durée</small><br><strong>${escapeHtml(qs("#actualDuration").value || "Non renseignée")}</strong></div><div class="metric"><small>Score</small><br><strong>${totals.earned}/${totals.total}</strong></div><div class="metric"><small>Progression</small><br><strong>${escapeHtml(completion)}</strong></div></div><div class="box"><h2>Compétences travaillées</h2><ul>${reportCompetencies()}</ul></div><div class="box"><h2>Indicateurs automatisés</h2>${qs("#autoCriteria").innerHTML}</div><div class="grid"><div class="box"><h2>Validation formatrice</h2><p>Compréhension orale : <strong>${escapeHtml(qs("#listeningStatus").value)}</strong></p><p>Questions et clarification : <strong>${escapeHtml(qs("#questionStatus").value)}</strong></p><p>Interaction passager : <strong>${escapeHtml(qs("#oralStatus").value)}</strong></p><p>Transmission et écrit : <strong>${escapeHtml(qs("#writingStatus").value)}</strong></p><p>Résultat global : <strong>${escapeHtml(qs("#overallStatus").value)}</strong></p></div><div class="box"><h2>Satisfaction</h2><p>Objectifs : ${qs("#satObjectives").value}/5</p><p>Activités : ${qs("#satActivities").value}/5</p><p>Confiance : ${qs("#satConfidence").value}/5</p><p>Rythme : ${qs("#satPace").value}/5</p></div></div><div class="box"><h2>Commentaires de l’apprenante</h2><div class="comment">${escapeHtml(qs("#learnerComments").value || "—")}</div></div><div class="box"><h2>Commentaires de la formatrice</h2><div class="comment">${escapeHtml(qs("#trainerComments").value || "—")}</div></div><div class="box"><h2>Prochaine priorité</h2><div class="comment">${escapeHtml(qs("#nextPriority").value || "—")}</div></div><div class="grid"><div class="box">Apprenante : <strong>${escapeHtml(qs("#learnerName").value)}</strong></div><div class="box">Formatrice : <strong>${escapeHtml(qs("#trainerName").value)}</strong></div></div><p style="font-size:12px;color:#667085">Document généré depuis la page interactive. Les compétences orales et écrites restent soumises à la validation de la formatrice.</p></main></body></html>`;
}
function buildPlainReport() { const totals = getTotals(); return `ÉVALUATION QUALIOPI — AMINATA TOURÉ — LEÇON 2\n\nDate : ${qs("#lessonDate").value || "Non renseignée"}\nDurée : ${qs("#actualDuration").value || "Non renseignée"}\nScore interactif : ${totals.earned}/${totals.total}\nProgression : ${qs("#reportCompletion").textContent}\n\nCompréhension orale : ${qs("#listeningStatus").value}\nQuestions et clarification : ${qs("#questionStatus").value}\nInteraction passager : ${qs("#oralStatus").value}\nTransmission et écrit : ${qs("#writingStatus").value}\nRésultat global : ${qs("#overallStatus").value}\n\nCommentaires apprenante :\n${qs("#learnerComments").value || "—"}\n\nCommentaires formatrice :\n${qs("#trainerComments").value || "—"}\n\nProchaine priorité :\n${qs("#nextPriority").value || "—"}\n\nApprenante : ${qs("#learnerName").value}\nFormatrice : ${qs("#trainerName").value}`; }
function setupReports() {
  const today = new Date(); qs("#reportDate").textContent = today.toLocaleDateString("fr-FR"); if (!qs("#lessonDate").value) qs("#lessonDate").value = today.toISOString().slice(0, 10); qs("#reportDuration").textContent = `${Math.max(1, Math.round((Date.now() - state.startedAt) / 60000))} min active`;
  qs("#downloadReportHtml").addEventListener("click", () => { downloadBlob(buildReportHtml(), "evaluation-qualiopi-aminata-lecon-2.html", "text/html"); markCompleted("qualiopi"); showToast("Evaluation HTML downloaded."); });
  qs("#copyReport").addEventListener("click", async () => { await navigator.clipboard.writeText(buildPlainReport()); markCompleted("qualiopi"); showToast("Evaluation copied."); });
  qs("#printReport").addEventListener("click", () => { document.body.classList.add("print-report-only"); window.print(); setTimeout(() => document.body.classList.remove("print-report-only"), 500); markCompleted("qualiopi"); }); qs("#printLesson").addEventListener("click", () => { document.body.classList.remove("print-report-only"); window.print(); });
}

function setupMiniCheck() { const list = qs('[data-question="method-1"]'); qsa("button", list).forEach(btn => btn.addEventListener("click", () => { qsa("button", list).forEach(b => b.classList.remove("selected", "correct", "incorrect")); btn.classList.add("selected"); const correct = btn.dataset.choice === list.dataset.answer; btn.classList.add(correct ? "correct" : "incorrect"); if (!correct) qsa("button", list).find(b => b.dataset.choice === list.dataset.answer).classList.add("correct"); qs(".feedback", list.parentElement).textContent = correct ? "Exactly. Medical safety and precise clarification come before a promise." : "First clarify the medical limitation and available safe options. Never promise an upgrade before checking."; setScore("method", correct ? 1 : 0, 1); markCompleted("method"); })); }
function setupGeneralActions() {
  qs("#translationToggle").addEventListener("click", e => { const active = !document.body.classList.contains("show-fr"); document.body.classList.toggle("show-fr", active); e.currentTarget.setAttribute("aria-pressed", String(active)); saveState(); }); qs("#focusToggle").addEventListener("click", e => { const active = !document.body.classList.contains("focus-mode"); document.body.classList.toggle("focus-mode", active); e.currentTarget.setAttribute("aria-pressed", String(active)); saveState(); });
  qs("#saveAllBtn").addEventListener("click", () => { saveState(); showToast("Progress saved in this browser."); }); qs("#resumeBtn").addEventListener("click", () => { const first = qsa(".lesson-section[data-progress-key]").find(s => !state.completed[s.dataset.progressKey]); (first || qs("#briefing")).scrollIntoView({ behavior: "smooth" }); });
  qsa("[data-speak-target]").forEach(btn => btn.addEventListener("click", () => { const target = qs(`#${btn.dataset.speakTarget}`); if (target) speak(target.textContent); })); qsa("input, textarea, select").forEach(el => { el.addEventListener("change", saveState); if (el.tagName === "TEXTAREA" || el.type === "text") el.addEventListener("input", saveState); }); window.addEventListener("beforeunload", saveState);
  qs("#resetLesson").addEventListener("click", () => { if (!confirm("Reset all saved answers, scores and progress for this lesson?")) return; storageRemove(STORAGE_KEY); location.reload(); });
}
function setupNavigationObserver() { const links = qsa(".side-nav a[data-section]"); const observer = new IntersectionObserver(entries => { const visible = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0]; if (visible) { links.forEach(link => link.classList.toggle("active", link.dataset.section === visible.target.id)); if (visible.target.classList.contains("completed-on-view")) markCompleted(visible.target.dataset.progressKey); } }, { threshold: [0.2, .55] }); qsa(".lesson-section").forEach(s => observer.observe(s)); }

function init() {
  renderVocab();
  renderChoiceQuiz(qs("#vocabQuiz"), vocabQuizData, "vocab", "vocab", "vocabulary", qs("#vocabQuizResult"));
  renderChoiceQuiz(qs("#questionQuiz"), questionQuizData, "question", "questions", "questions", qs("#questionQuizResult"));
  renderChoiceQuiz(qs("#tenseQuiz"), tenseQuizData, "tense", "tenses", "tenses", qs("#tenseQuizResult"));
  renderChoiceQuiz(qs("#serviceQuiz"), serviceQuizData, "service", "service", "premium", qs("#serviceQuizResult"));
  renderChoiceQuiz(qs("#relayQuiz"), relayQuizData, "relay", "relay", "relay", qs("#relayQuizResult"));
  renderWordOrder(); renderListening(); renderSpeaking(); renderCompetencies();
  loadState();
  restoreQuiz(qs("#vocabQuiz"), vocabQuizData, "vocab", "vocabulary", qs("#vocabQuizResult")); restoreQuiz(qs("#questionQuiz"), questionQuizData, "questions", "questions", qs("#questionQuizResult")); restoreQuiz(qs("#tenseQuiz"), tenseQuizData, "tenses", "tenses", qs("#tenseQuizResult")); restoreQuiz(qs("#serviceQuiz"), serviceQuizData, "service", "premium", qs("#serviceQuizResult")); restoreQuiz(qs("#relayQuiz"), relayQuizData, "relay", "relay", qs("#relayQuizResult"));
  qsa(".listening-question input:checked").forEach(input => { const card = input.closest(".listening-card"), item = listeningData.find(x => x.id === card.dataset.listeningId); evaluateListeningQuestion(item, input.closest(".listening-question")); });
  qsa(".competency-item input").forEach(input => input.closest(".competency-item").classList.toggle("checked", input.checked));
  setupGeneralActions(); setupMiniCheck(); setupWriting(); setupFinalMission(); setupRanges(); setupChecklists(); setupReports(); setupNavigationObserver();
  qs("#vocabCategory").addEventListener("change", e => { renderVocab(e.target.value); markCompleted("vocabulary"); }); qs("#listenVocabBtn").addEventListener("click", () => speak(vocabData[qs("#vocabCategory").value].map(x => `${x.en}. ${x.ex}`).join(" ")));
  [["resetVocabQuiz","vocabQuiz",vocabQuizData,"vocab","vocab","vocabulary","vocabQuizResult"],["resetQuestionQuiz","questionQuiz",questionQuizData,"question","questions","questions","questionQuizResult"],["resetTenseQuiz","tenseQuiz",tenseQuizData,"tense","tenses","tenses","tenseQuizResult"],["resetServiceQuiz","serviceQuiz",serviceQuizData,"service","service","premium","serviceQuizResult"],["resetRelayQuiz","relayQuiz",relayQuizData,"relay","relay","relay","relayQuizResult"]].forEach(([btnId,containerId,data,prefix,scoreKey,sectionKey,resultId]) => qs(`#${btnId}`).addEventListener("click", () => { renderChoiceQuiz(qs(`#${containerId}`), data, prefix, scoreKey, sectionKey, qs(`#${resultId}`)); setScore(scoreKey, 0, data.length); qs(`#${resultId}`).textContent = `0/${data.length} answered`; }));
  qs("#resetWordOrder").addEventListener("click", renderWordOrder);
  ["mealPreference","recommendedDish","recommendationReason"].forEach(id => qs(`#${id}`).addEventListener("change", updateRecommendation)); updateRecommendation(); qs("#copyRecommendation").addEventListener("click", async () => { await navigator.clipboard.writeText(qs("#generatedRecommendation").textContent); showToast("Recommendation copied."); });
  ["relaySeat","relayRequest","relayProblem","relayAction","relayNext"].forEach(id => qs(`#${id}`).addEventListener("input", updateRelay)); updateRelay(); qs("#copyRelay").addEventListener("click", async () => { await navigator.clipboard.writeText(qs("#generatedRelay").textContent); showToast("Handover copied."); }); qs("#downloadRelay").addEventListener("click", () => downloadBlob(qs("#generatedRelay").textContent, "aminata-crew-handover.txt"));
  qsa('input[type="range"]').forEach(i => i.dispatchEvent(new Event("input"))); qs("#reportWriting").dispatchEvent(new Event("input")); qs("#finalHandoverText").dispatchEvent(new Event("input")); updateDashboard();
}

document.addEventListener("DOMContentLoaded", init);
