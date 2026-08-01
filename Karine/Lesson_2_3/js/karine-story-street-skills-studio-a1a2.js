(function(){
  'use strict';

  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  const state = { answered: 0, correct: 0, timer: null, rec: null, chunks: [], lastBlob: null };

  const STORAGE_KEY = 'karine_story_street_skills_studio_qualiopi_v3';
  let sectionStats = {};
  let evaluationDone = new Set();
  let manualStatus = {
    'oral-questions':'not-started',
    'roleplay':'not-started',
    'writing':'not-started',
    'story':'not-started',
    'final-speaking':'not-started'
  };
  const sectionDefinitions = [
    {id:'vocab', objective:'Use essential shop, supermarket, pharmacy, butcher and petrol-station vocabulary', subject:'Expanded real-life vocabulary bank', method:'QCM vocabulary', max:6},
    {id:'past', objective:'Tell a short story with past continuous and past simple', subject:'Past continuous + past simple', method:'QCM grammar', max:6},
    {id:'dialogue', objective:'Understand realistic service dialogues and identify the key information', subject:'Boutique, pharmacy, petrol station, butcher and salon dialogues', method:'QCM listening / reading dialogue', max:5},
    {id:'oral-questions', objective:'Ask and answer everyday questions using the correct tense', subject:'Question practice and tense clues', method:'Mise en situation orale', manual:true},
    {id:'roleplay', objective:'Participate in practical roleplays with polite phrases', subject:'Shop, pharmacy, petrol station, supermarket and salon situations', method:'Jeu de rôle / grille d’observation', manual:true},
    {id:'writing', objective:'Write a short SMS or email for a realistic problem or request', subject:'Guided written production', method:'Production écrite', manual:true},
    {id:'story', objective:'Tell a short personal story about a problem or difficult client', subject:'Worst day / worst client storytelling', method:'Production orale guidée', manual:true},
    {id:'final-speaking', objective:'Complete the final CLOE-style challenge: speak, ask and react', subject:'Final oral challenge', method:'Simulation orale', manual:true}
  ];

  const vocab = {
  "Shops & everyday places": [
    {
      "emoji": "🛍️",
      "en": "a boutique",
      "fr": "une boutique",
      "def": "a small shop, often for clothes, gifts, or accessories",
      "ex": "I bought a scarf in a small boutique."
    },
    {
      "emoji": "👗",
      "en": "a clothes shop",
      "fr": "un magasin de vêtements",
      "def": "a shop where you buy clothes",
      "ex": "I went to a clothes shop to look for a dress."
    },
    {
      "emoji": "👠",
      "en": "a shoe shop",
      "fr": "un magasin de chaussures",
      "def": "a shop where you buy shoes",
      "ex": "The shoe shop was very busy during the sales."
    },
    {
      "emoji": "🏬",
      "en": "a department store",
      "fr": "un grand magasin",
      "def": "a large shop with many departments",
      "ex": "You can buy clothes, perfume, and home products in a department store."
    },
    {
      "emoji": "🛒",
      "en": "a supermarket",
      "fr": "un supermarché",
      "def": "a large shop for food and everyday products",
      "ex": "I go to the supermarket once a week."
    },
    {
      "emoji": "🥬",
      "en": "a greengrocer’s",
      "fr": "un primeur",
      "def": "a shop that sells fruit and vegetables",
      "ex": "I bought fresh tomatoes at the greengrocer’s."
    },
    {
      "emoji": "🥖",
      "en": "a bakery",
      "fr": "une boulangerie",
      "def": "a shop where you buy bread and pastries",
      "ex": "I went to the bakery for bread."
    },
    {
      "emoji": "🥩",
      "en": "a butcher’s",
      "fr": "une boucherie / chez le boucher",
      "def": "a shop where you buy meat",
      "ex": "I bought chicken at the butcher’s."
    },
    {
      "emoji": "🐟",
      "en": "a fishmonger’s",
      "fr": "une poissonnerie",
      "def": "a shop where you buy fish and seafood",
      "ex": "The fishmonger’s has fresh fish this morning."
    },
    {
      "emoji": "💐",
      "en": "a florist",
      "fr": "un fleuriste",
      "def": "a shop where you buy flowers",
      "ex": "I stopped at the florist to buy flowers for a friend."
    },
    {
      "emoji": "📚",
      "en": "a bookshop",
      "fr": "une librairie",
      "def": "a shop that sells books",
      "ex": "I bought a novel in the bookshop."
    },
    {
      "emoji": "🧰",
      "en": "a hardware store / DIY store",
      "fr": "un magasin de bricolage",
      "def": "a shop for tools and things for the house or garden",
      "ex": "On Mondays, we sometimes go to the hardware store."
    },
    {
      "emoji": "💊",
      "en": "a pharmacy / chemist’s",
      "fr": "une pharmacie",
      "def": "a place where you buy medicine and ask for health advice",
      "ex": "I went to the pharmacy because I had a sore throat."
    },
    {
      "emoji": "📮",
      "en": "a post office",
      "fr": "un bureau de poste",
      "def": "a place where you send letters and parcels",
      "ex": "I went to the post office to send a parcel."
    },
    {
      "emoji": "🏦",
      "en": "a bank",
      "fr": "une banque",
      "def": "a place where you manage money",
      "ex": "I need to go to the bank before lunch."
    },
    {
      "emoji": "⛽",
      "en": "a petrol station / gas station",
      "fr": "une station-service",
      "def": "a place where you put fuel in your car",
      "ex": "I stopped at the petrol station to fill up the car."
    },
    {
      "emoji": "🚗",
      "en": "a car garage",
      "fr": "un garage automobile",
      "def": "a place where cars are repaired",
      "ex": "I took the car to the garage because there was a problem."
    },
    {
      "emoji": "🧺",
      "en": "a dry cleaner’s",
      "fr": "un pressing",
      "def": "a place where clothes are professionally cleaned",
      "ex": "I took my jacket to the dry cleaner’s."
    },
    {
      "emoji": "✂️",
      "en": "a hair salon",
      "fr": "un salon de coiffure",
      "def": "a place where people have their hair cut or styled",
      "ex": "I worked in a hair salon before I retired."
    },
    {
      "emoji": "👓",
      "en": "an optician’s",
      "fr": "un opticien",
      "def": "a shop where you buy glasses or contact lenses",
      "ex": "I went to the optician’s to check my glasses."
    }
  ],
  "Supermarket essentials": [
    {
      "emoji": "🛒",
      "en": "a trolley / cart",
      "fr": "un chariot",
      "def": "a large basket with wheels for shopping",
      "ex": "I took a trolley because I had a lot to buy."
    },
    {
      "emoji": "🧺",
      "en": "a basket",
      "fr": "un panier",
      "def": "a small container for a few items",
      "ex": "I only needed a basket because I was buying three things."
    },
    {
      "emoji": "🧍",
      "en": "a queue / line",
      "fr": "une file d’attente",
      "def": "people waiting one behind another",
      "ex": "There was a long queue at the checkout."
    },
    {
      "emoji": "💳",
      "en": "the checkout / till",
      "fr": "la caisse",
      "def": "the place where you pay",
      "ex": "I was waiting at the checkout when my phone rang."
    },
    {
      "emoji": "🤖",
      "en": "a self-checkout",
      "fr": "une caisse automatique",
      "def": "a machine where customers scan and pay themselves",
      "ex": "I used the self-checkout because the queue was shorter."
    },
    {
      "emoji": "🏷️",
      "en": "a price tag",
      "fr": "une étiquette de prix",
      "def": "a label that shows the price",
      "ex": "I checked the price tag before buying it."
    },
    {
      "emoji": "🧾",
      "en": "a receipt",
      "fr": "un ticket de caisse / reçu",
      "def": "the paper or email that proves you paid",
      "ex": "Do you have your receipt?"
    },
    {
      "emoji": "💳",
      "en": "a loyalty card",
      "fr": "une carte de fidélité",
      "def": "a card for customer points or reductions",
      "ex": "The cashier asked me for my loyalty card."
    },
    {
      "emoji": "📦",
      "en": "an item",
      "fr": "un article / produit",
      "def": "one product you buy",
      "ex": "I have five items in my basket."
    },
    {
      "emoji": "📚",
      "en": "a shelf",
      "fr": "une étagère / un rayon",
      "def": "where products are displayed",
      "ex": "The shampoo is on the top shelf."
    },
    {
      "emoji": "➡️",
      "en": "an aisle",
      "fr": "une allée / un rayon",
      "def": "a passage between shelves in a supermarket",
      "ex": "The rice is in aisle five."
    },
    {
      "emoji": "🔖",
      "en": "on sale",
      "fr": "en promotion / soldé",
      "def": "with a reduced price",
      "ex": "This shampoo is on sale today."
    },
    {
      "emoji": "📉",
      "en": "a discount",
      "fr": "une réduction",
      "def": "money taken off the price",
      "ex": "There is a twenty percent discount on this product."
    },
    {
      "emoji": "✅",
      "en": "in stock",
      "fr": "en stock",
      "def": "available to buy now",
      "ex": "The product is in stock."
    },
    {
      "emoji": "❌",
      "en": "out of stock",
      "fr": "en rupture de stock",
      "def": "not available now",
      "ex": "The conditioner is out of stock."
    },
    {
      "emoji": "🧴",
      "en": "toiletries",
      "fr": "produits de toilette",
      "def": "products for washing and personal care",
      "ex": "I bought toiletries for the trip."
    },
    {
      "emoji": "🧽",
      "en": "cleaning products",
      "fr": "produits ménagers",
      "def": "products used to clean the house",
      "ex": "I bought cleaning products for the house."
    },
    {
      "emoji": "🥛",
      "en": "the dairy section",
      "fr": "le rayon frais / produits laitiers",
      "def": "the part of the supermarket with milk, cheese, and yoghurts",
      "ex": "The yoghurt is in the dairy section."
    },
    {
      "emoji": "❄️",
      "en": "frozen food",
      "fr": "produits surgelés",
      "def": "food kept very cold",
      "ex": "I bought frozen vegetables."
    },
    {
      "emoji": "🥦",
      "en": "fresh produce",
      "fr": "produits frais / fruits et légumes",
      "def": "fresh fruit and vegetables",
      "ex": "Fresh produce is near the entrance."
    }
  ],
  "Boutique & returns": [
    {
      "emoji": "📏",
      "en": "a size",
      "fr": "une taille",
      "def": "how big or small clothes are",
      "ex": "Do you have this dress in my size?"
    },
    {
      "emoji": "🚪",
      "en": "a fitting room / changing room",
      "fr": "une cabine d’essayage",
      "def": "a small room where you try on clothes",
      "ex": "Where is the fitting room, please?"
    },
    {
      "emoji": "👚",
      "en": "to try on",
      "fr": "essayer un vêtement",
      "def": "to put clothes on to see if they fit",
      "ex": "I would like to try on this jacket."
    },
    {
      "emoji": "↩️",
      "en": "to return an item",
      "fr": "retourner un article",
      "def": "to take something back to the shop",
      "ex": "I would like to return this jacket."
    },
    {
      "emoji": "🔁",
      "en": "to exchange",
      "fr": "échanger",
      "def": "to change one item for another",
      "ex": "Can I exchange it for another size?"
    },
    {
      "emoji": "💶",
      "en": "a refund",
      "fr": "un remboursement",
      "def": "money given back when you return something",
      "ex": "Could I have a refund, please?"
    },
    {
      "emoji": "📦",
      "en": "available",
      "fr": "disponible",
      "def": "possible to get or buy",
      "ex": "Is this dress available in blue?"
    },
    {
      "emoji": "📌",
      "en": "to keep it for me",
      "fr": "me le garder / me le mettre de côté",
      "def": "to reserve an item for a short time",
      "ex": "Could you keep it for me until tomorrow?"
    },
    {
      "emoji": "👖",
      "en": "too tight",
      "fr": "trop serré",
      "def": "too small around the body",
      "ex": "These trousers are too tight."
    },
    {
      "emoji": "👕",
      "en": "too loose",
      "fr": "trop large",
      "def": "too big around the body",
      "ex": "This shirt is too loose."
    },
    {
      "emoji": "🎨",
      "en": "a pattern",
      "fr": "un motif",
      "def": "a repeated design on fabric",
      "ex": "I like the pattern on this dress."
    },
    {
      "emoji": "🧵",
      "en": "fabric",
      "fr": "le tissu",
      "def": "the material clothes are made of",
      "ex": "The fabric is soft and comfortable."
    },
    {
      "emoji": "🛍️",
      "en": "a purchase",
      "fr": "un achat",
      "def": "something you buy",
      "ex": "I am happy with my purchase."
    },
    {
      "emoji": "🧾",
      "en": "proof of purchase",
      "fr": "preuve d’achat",
      "def": "evidence that you bought the item",
      "ex": "The receipt is proof of purchase."
    },
    {
      "emoji": "🧥",
      "en": "the wrong size",
      "fr": "la mauvaise taille",
      "def": "not the correct size",
      "ex": "I would like to return it because it is the wrong size."
    }
  ],
  "Pharmacy & health": [
    {
      "emoji": "🤕",
      "en": "a headache",
      "fr": "un mal de tête",
      "def": "pain in your head",
      "ex": "I have a headache."
    },
    {
      "emoji": "😷",
      "en": "a sore throat",
      "fr": "un mal de gorge",
      "def": "pain in your throat",
      "ex": "I have had a sore throat since yesterday."
    },
    {
      "emoji": "🤧",
      "en": "a cough",
      "fr": "une toux",
      "def": "when you cough repeatedly",
      "ex": "I have a cough and I don’t feel well."
    },
    {
      "emoji": "🌡️",
      "en": "a fever / temperature",
      "fr": "de la fièvre",
      "def": "a body temperature that is too high",
      "ex": "Do you have a fever?"
    },
    {
      "emoji": "🤒",
      "en": "a cold",
      "fr": "un rhume",
      "def": "a common illness with a runny nose or cough",
      "ex": "I think I have a cold."
    },
    {
      "emoji": "💊",
      "en": "medicine",
      "fr": "un médicament",
      "def": "something you take to feel better",
      "ex": "What medicine can I take?"
    },
    {
      "emoji": "💊",
      "en": "painkillers",
      "fr": "des antidouleurs",
      "def": "medicine for pain",
      "ex": "The pharmacist recommended painkillers."
    },
    {
      "emoji": "🍬",
      "en": "lozenges",
      "fr": "des pastilles pour la gorge",
      "def": "small tablets for a sore throat",
      "ex": "You can try these lozenges."
    },
    {
      "emoji": "🧴",
      "en": "syrup",
      "fr": "du sirop",
      "def": "liquid medicine",
      "ex": "This syrup is for a cough."
    },
    {
      "emoji": "📄",
      "en": "a prescription",
      "fr": "une ordonnance",
      "def": "a doctor’s written order for medicine",
      "ex": "Do you have a prescription?"
    },
    {
      "emoji": "⏱️",
      "en": "dosage",
      "fr": "la posologie",
      "def": "how much medicine to take and how often",
      "ex": "Could you explain the dosage, please?"
    },
    {
      "emoji": "🔁",
      "en": "twice a day",
      "fr": "deux fois par jour",
      "def": "two times each day",
      "ex": "Take one tablet twice a day."
    },
    {
      "emoji": "⚠️",
      "en": "side effects",
      "fr": "effets secondaires",
      "def": "unwanted effects from medicine",
      "ex": "Are there any side effects?"
    },
    {
      "emoji": "🥜",
      "en": "an allergy",
      "fr": "une allergie",
      "def": "a bad reaction to something",
      "ex": "I have an allergy to aspirin."
    },
    {
      "emoji": "🩹",
      "en": "a bandage",
      "fr": "un pansement / bandage",
      "def": "material used to cover an injury",
      "ex": "Do you have a bandage, please?"
    },
    {
      "emoji": "🧴",
      "en": "a cream",
      "fr": "une crème",
      "def": "medicine or product you put on the skin",
      "ex": "You can apply this cream twice a day."
    },
    {
      "emoji": "👩‍⚕️",
      "en": "to recommend something",
      "fr": "recommander quelque chose",
      "def": "to suggest what is good to take or use",
      "ex": "Could you recommend something for a sore throat?"
    }
  ],
  "Butcher’s & food shops": [
    {
      "emoji": "🥩",
      "en": "beef",
      "fr": "du bœuf",
      "def": "meat from a cow",
      "ex": "I would like some beef for dinner."
    },
    {
      "emoji": "🐔",
      "en": "chicken",
      "fr": "du poulet",
      "def": "meat from a chicken",
      "ex": "I bought chicken for six people."
    },
    {
      "emoji": "🐖",
      "en": "pork",
      "fr": "du porc",
      "def": "meat from a pig",
      "ex": "Do you have pork chops?"
    },
    {
      "emoji": "🐑",
      "en": "lamb",
      "fr": "de l’agneau",
      "def": "meat from a young sheep",
      "ex": "The butcher recommended lamb."
    },
    {
      "emoji": "🥩",
      "en": "a steak",
      "fr": "un steak",
      "def": "a piece of beef",
      "ex": "I would like two steaks, please."
    },
    {
      "emoji": "🍗",
      "en": "a chicken breast",
      "fr": "un blanc de poulet",
      "def": "a piece of chicken meat",
      "ex": "Can I have four chicken breasts, please?"
    },
    {
      "emoji": "🥓",
      "en": "minced beef / ground beef",
      "fr": "de la viande hachée",
      "def": "beef cut into very small pieces",
      "ex": "I need minced beef for pasta."
    },
    {
      "emoji": "🌭",
      "en": "sausages",
      "fr": "des saucisses",
      "def": "long pieces of seasoned meat",
      "ex": "We bought sausages for the barbecue."
    },
    {
      "emoji": "🍖",
      "en": "a roast",
      "fr": "un rôti",
      "def": "a large piece of meat cooked in the oven",
      "ex": "I would like a roast for Sunday lunch."
    },
    {
      "emoji": "⚖️",
      "en": "one kilo / half a kilo",
      "fr": "un kilo / un demi-kilo",
      "def": "a quantity of food",
      "ex": "Could I have half a kilo of chicken, please?"
    },
    {
      "emoji": "🔪",
      "en": "a slice",
      "fr": "une tranche",
      "def": "a thin piece of food",
      "ex": "Can I have six slices of ham, please?"
    },
    {
      "emoji": "👨‍🍳",
      "en": "enough for six people",
      "fr": "assez pour six personnes",
      "def": "the right quantity for six people",
      "ex": "How much do I need for six people?"
    },
    {
      "emoji": "⭐",
      "en": "What do you recommend?",
      "fr": "Que recommandez-vous ?",
      "def": "a polite question asking for advice",
      "ex": "What do you recommend for dinner?"
    },
    {
      "emoji": "🧊",
      "en": "fresh",
      "fr": "frais / fraîche",
      "def": "not old; good quality",
      "ex": "The fish is very fresh today."
    }
  ],
  "Professions & people": [
    {
      "emoji": "🧑‍💼",
      "en": "a shop assistant / sales assistant",
      "fr": "un vendeur / une vendeuse",
      "def": "a person who helps customers in a shop",
      "ex": "The shop assistant helped me find another size."
    },
    {
      "emoji": "💳",
      "en": "a cashier",
      "fr": "un caissier / une caissière",
      "def": "a person who takes payment",
      "ex": "The cashier was very friendly."
    },
    {
      "emoji": "💊",
      "en": "a pharmacist",
      "fr": "un pharmacien / une pharmacienne",
      "def": "a person who gives medicine and advice",
      "ex": "The pharmacist recommended something for my headache."
    },
    {
      "emoji": "🥩",
      "en": "a butcher",
      "fr": "un boucher / une bouchère",
      "def": "a person who prepares and sells meat",
      "ex": "The butcher suggested a good piece of beef."
    },
    {
      "emoji": "🥖",
      "en": "a baker",
      "fr": "un boulanger / une boulangère",
      "def": "a person who makes bread",
      "ex": "The baker was putting fresh bread on the shelves."
    },
    {
      "emoji": "🐟",
      "en": "a fishmonger",
      "fr": "un poissonnier / une poissonnière",
      "def": "a person who sells fish",
      "ex": "The fishmonger recommended salmon."
    },
    {
      "emoji": "🥬",
      "en": "a greengrocer",
      "fr": "un primeur",
      "def": "a person who sells fruit and vegetables",
      "ex": "The greengrocer was arranging the apples."
    },
    {
      "emoji": "💐",
      "en": "a florist",
      "fr": "un fleuriste",
      "def": "a person who sells flowers",
      "ex": "The florist prepared a bouquet."
    },
    {
      "emoji": "🍽️",
      "en": "a waiter / waitress",
      "fr": "un serveur / une serveuse",
      "def": "a person who serves customers in a restaurant",
      "ex": "The waiter brought the menu."
    },
    {
      "emoji": "🏨",
      "en": "a receptionist",
      "fr": "un réceptionniste",
      "def": "a person who welcomes guests and answers questions",
      "ex": "The receptionist confirmed our room number."
    },
    {
      "emoji": "🔧",
      "en": "a mechanic",
      "fr": "un mécanicien / une mécanicienne",
      "def": "a person who repairs cars",
      "ex": "I called a mechanic because my car had a problem."
    },
    {
      "emoji": "💇",
      "en": "a hairdresser",
      "fr": "un coiffeur / une coiffeuse",
      "def": "a person who cuts and styles hair",
      "ex": "The hairdresser was helping a client."
    },
    {
      "emoji": "👓",
      "en": "an optician",
      "fr": "un opticien / une opticienne",
      "def": "a person who sells glasses",
      "ex": "The optician helped me choose new glasses."
    },
    {
      "emoji": "🏪",
      "en": "a manager",
      "fr": "un responsable / une responsable",
      "def": "a person in charge of a shop or team",
      "ex": "The manager came to help with the problem."
    },
    {
      "emoji": "🛡️",
      "en": "a security guard",
      "fr": "un agent de sécurité",
      "def": "a person who keeps a place safe",
      "ex": "The security guard helped the customer find the exit."
    }
  ],
  "Getting fuel & car problems": [
    {
      "emoji": "⛽",
      "en": "to fill up the car",
      "fr": "faire le plein",
      "def": "to put fuel in the car",
      "ex": "I filled up the car before the trip."
    },
    {
      "emoji": "⛽",
      "en": "a pump",
      "fr": "une pompe",
      "def": "the machine that gives fuel",
      "ex": "The pump stopped when I was filling up the car."
    },
    {
      "emoji": "4️⃣",
      "en": "pump number four",
      "fr": "la pompe numéro quatre",
      "def": "the number of the fuel pump",
      "ex": "I have a problem with pump number four."
    },
    {
      "emoji": "🟢",
      "en": "unleaded petrol",
      "fr": "essence sans plomb",
      "def": "petrol for many cars",
      "ex": "Do you need unleaded petrol or diesel?"
    },
    {
      "emoji": "⚫",
      "en": "diesel",
      "fr": "diesel / gazole",
      "def": "a type of fuel",
      "ex": "My car takes diesel."
    },
    {
      "emoji": "🚗",
      "en": "the fuel tank",
      "fr": "le réservoir",
      "def": "the part of the car where fuel goes",
      "ex": "The fuel tank was almost empty."
    },
    {
      "emoji": "💳",
      "en": "to pay at the pump",
      "fr": "payer à la pompe",
      "def": "to pay directly at the fuel machine",
      "ex": "I tried to pay at the pump, but my card was refused."
    },
    {
      "emoji": "🏪",
      "en": "to pay inside",
      "fr": "payer à l’intérieur",
      "def": "to pay in the shop at the petrol station",
      "ex": "You can pay inside if the pump does not work."
    },
    {
      "emoji": "📵",
      "en": "my card was refused",
      "fr": "ma carte a été refusée",
      "def": "the payment card did not work",
      "ex": "My card was refused at the pump."
    },
    {
      "emoji": "📶",
      "en": "contactless payment",
      "fr": "paiement sans contact",
      "def": "payment by tapping your card or phone",
      "ex": "Do you take contactless payment?"
    },
    {
      "emoji": "🧾",
      "en": "a fuel receipt",
      "fr": "un reçu de carburant",
      "def": "the receipt after buying fuel",
      "ex": "Could I have a fuel receipt, please?"
    },
    {
      "emoji": "🛞",
      "en": "tyre pressure",
      "fr": "la pression des pneus",
      "def": "how much air is in the tyres",
      "ex": "I checked the tyre pressure at the petrol station."
    },
    {
      "emoji": "🧽",
      "en": "a car wash",
      "fr": "un lavage auto",
      "def": "a place or machine that washes cars",
      "ex": "We used the car wash after filling up."
    },
    {
      "emoji": "⚠️",
      "en": "a warning light",
      "fr": "un voyant d’alerte",
      "def": "a light in the car that shows a problem",
      "ex": "A warning light came on while we were driving."
    },
    {
      "emoji": "🔧",
      "en": "a breakdown",
      "fr": "une panne",
      "def": "when a car stops working",
      "ex": "We had a breakdown on the way to the campsite."
    },
    {
      "emoji": "🧴",
      "en": "windscreen washer fluid",
      "fr": "liquide lave-glace",
      "def": "liquid used to clean the windscreen",
      "ex": "I bought windscreen washer fluid at the petrol station."
    }
  ],
  "Problems & useful solutions": [
    {
      "emoji": "❌",
      "en": "a problem",
      "fr": "un problème",
      "def": "something that is wrong",
      "ex": "I have a problem with my room."
    },
    {
      "emoji": "💡",
      "en": "a solution",
      "fr": "une solution",
      "def": "a way to fix a problem",
      "ex": "I found a solution for the client."
    },
    {
      "emoji": "😟",
      "en": "worried",
      "fr": "inquiet / inquiète",
      "def": "nervous about a problem",
      "ex": "The client was worried about her appointment."
    },
    {
      "emoji": "😠",
      "en": "angry / annoyed",
      "fr": "fâché / agacé",
      "def": "unhappy because of a problem",
      "ex": "The customer was annoyed because she had to wait."
    },
    {
      "emoji": "🧘",
      "en": "calm",
      "fr": "calme",
      "def": "not angry or stressed",
      "ex": "I tried to stay calm."
    },
    {
      "emoji": "⏳",
      "en": "patient / patience",
      "fr": "patient / patience",
      "def": "able to wait calmly",
      "ex": "Thank you for your patience."
    },
    {
      "emoji": "📋",
      "en": "a schedule",
      "fr": "un planning",
      "def": "a list of appointments or times",
      "ex": "Let me check the schedule for you."
    },
    {
      "emoji": "📅",
      "en": "an appointment",
      "fr": "un rendez-vous",
      "def": "a fixed time to meet someone",
      "ex": "I confirm your appointment at 10 a.m."
    },
    {
      "emoji": "🔍",
      "en": "to check",
      "fr": "vérifier",
      "def": "to look carefully to confirm something",
      "ex": "I will check the appointment for you."
    },
    {
      "emoji": "🗣️",
      "en": "to explain",
      "fr": "expliquer",
      "def": "to make something clear",
      "ex": "I explained the problem to the cashier."
    },
    {
      "emoji": "💬",
      "en": "to complain",
      "fr": "se plaindre",
      "def": "to say that something is wrong",
      "ex": "The customer was complaining at the checkout."
    },
    {
      "emoji": "⚖️",
      "en": "a refund or an exchange",
      "fr": "un remboursement ou un échange",
      "def": "two possible solutions when an item is wrong",
      "ex": "I can offer you a refund or an exchange."
    },
    {
      "emoji": "🔄",
      "en": "to come back",
      "fr": "revenir",
      "def": "to return to a place later",
      "ex": "I can come back in ten minutes."
    },
    {
      "emoji": "🎧",
      "en": "Could you repeat, please?",
      "fr": "Pouvez-vous répéter, s’il vous plaît ?",
      "def": "a useful phrase when you do not understand",
      "ex": "Could you repeat the price, please?"
    },
    {
      "emoji": "🔡",
      "en": "Could you spell that, please?",
      "fr": "Pouvez-vous l’épeler, s’il vous plaît ?",
      "def": "a useful phrase for names or addresses",
      "ex": "Could you spell your surname, please?"
    },
    {
      "emoji": "✅",
      "en": "Could you confirm...?",
      "fr": "Pouvez-vous confirmer... ?",
      "def": "a polite phrase to check information",
      "ex": "Could you confirm the time, please?"
    }
  ]
};

  const vocabQuizData = [
    {q:"Where can you buy medicine and ask for advice?", options:["at a boutique", "at a pharmacy", "at the butcher’s"], answer:1, hint:"Think about medicine."},
    {q:"Who takes payment at the checkout?", options:["a cashier", "a mechanic", "a receptionist"], answer:0, hint:"This person works with money and receipts."},
    {q:"What do you do at a petrol station before a long trip?", options:["return an item", "fill up the car", "book a table"], answer:1, hint:"Your car needs fuel."},
    {q:"If a product is not available, it is...", options:["noisy", "fully booked", "out of stock"], answer:2, hint:"The shop does not have it now."},
    {q:"A long queue means...", options:["many people are waiting", "the room is quiet", "the hair is dry"], answer:0, hint:"Think about waiting before paying."},
    {q:"The person who sells meat is...", options:["a butcher", "a pharmacist", "a waiter"], answer:0, hint:"You go to this shop for chicken, beef, or pork."}
  ];

  const pastQuizData = [
    {q:"Choose the best sentence.", stem:"I ___ at the checkout when the card machine stopped working.", options:["wait", "was waiting", "am waiting"], answer:1, hint:"Background action in the past = was/were + verb-ing."},
    {q:"Choose the best sentence.", stem:"While she was looking for the receipt, the customer ___.", options:["arrived", "was arriving", "arrive"], answer:0, hint:"The event that happened = past simple."},
    {q:"Choose the best sentence.", stem:"They ___ the car when it started to rain.", options:["were filling up", "fill up", "are filling up"], answer:0, hint:"The action was in progress before the rain started."},
    {q:"Choose the best sentence.", stem:"While I was explaining the problem, the pharmacist ___ me a question.", options:["asks", "was asking", "asked"], answer:2, hint:"The pharmacist’s question happened during your explanation."},
    {q:"Choose the best sentence.", stem:"The client was shouting while I ___ to help her.", options:["try", "was trying", "tried"], answer:1, hint:"Two actions were happening at the same time in the past."},
    {q:"Choose the best sentence.", stem:"I was driving to the campsite when I ___ we had no petrol.", options:["realised", "was realising", "realise"], answer:0, hint:"Realised is the sudden event in the story."}
  ];

  const warmups = [
    {q:"What do you usually buy at the supermarket?", m:"I usually buy vegetables, fruit, milk, and things for the house."},
    {q:"Where do you go when you need medicine?", m:"I go to the pharmacy and ask the pharmacist for advice."},
    {q:"What do you say if a product is the wrong size?", m:"I say: I’m sorry, this is the wrong size. Do you have another size, please?"},
    {q:"What do you do before a long car trip?", m:"Before a long car trip, I fill up the car and check the tyres."},
    {q:"Tell me about a small problem you had in a shop.", m:"I had a problem because I forgot my receipt, but the shop assistant helped me."},
    {q:"What were you doing yesterday afternoon?", m:"Yesterday afternoon, I was studying English and preparing dinner."}
  ];

  const questions = {
    routine: [
      {q:"What do you usually buy at the supermarket?", clue:"usually → present simple", model:"I usually buy vegetables, fruit, milk, and things for the house."},
      {q:"Where do you usually go for bread?", clue:"usually → present simple", model:"I usually go to the bakery for bread."},
      {q:"Do you often go to the butcher’s?", clue:"often → present simple", model:"Yes, I sometimes go to the butcher’s to buy meat for the weekend."},
      {q:"What does a pharmacist do?", clue:"profession / fact → present simple", model:"A pharmacist gives medicine and advice to customers."}
    ],
    past: [
      {q:"What did you buy last week?", clue:"last week → past simple", model:"Last week, I bought vegetables and shampoo at the supermarket."},
      {q:"Where did you go yesterday?", clue:"yesterday → past simple", model:"Yesterday, I went to the pharmacy because I had a sore throat."},
      {q:"Did you fill up the car last weekend?", clue:"last weekend → past simple", model:"Yes, I filled up the car before our trip."},
      {q:"What happened at the checkout?", clue:"happened → past simple", model:"The card machine stopped working, so I paid with another card."}
    ],
    story: [
      {q:"What were you doing when the phone rang?", clue:"were you doing / when → past continuous + past simple", model:"I was helping a client when the phone rang."},
      {q:"What was the customer doing when you arrived?", clue:"was doing / when → past continuous", model:"The customer was waiting near the door when I arrived."},
      {q:"What were you doing when the pump stopped?", clue:"were doing / when → past continuous + event", model:"I was filling up the car when the pump stopped."},
      {q:"What was happening while you were waiting?", clue:"while → action in progress", model:"While I was waiting, a customer was complaining at the checkout."}
    ],
    future: [
      {q:"What are you going to buy this week?", clue:"going to → plan", model:"I am going to buy vegetables, shampoo, and things for the house."},
      {q:"What are you doing tomorrow morning?", clue:"tomorrow morning → arrangement or plan", model:"Tomorrow morning, I am meeting a friend for coffee."},
      {q:"Do you think the shop will be busy?", clue:"I think / will → prediction", model:"Yes, I think the shop will be busy because there are sales."},
      {q:"What will you say if the customer is worried?", clue:"will → quick decision / reaction", model:"I will say: Don’t worry, I’ll check it for you."}
    ],
    experience: [
      {q:"Have you ever had a difficult customer?", clue:"ever → present perfect", model:"Yes, I have had a difficult customer, but I stayed polite and calm."},
      {q:"Have you ever lost a receipt?", clue:"ever → present perfect", model:"Yes, I have lost a receipt before. It was embarrassing."},
      {q:"How long have you lived in Saint-Gilles-Croix-de-Vie?", clue:"how long / have lived → present perfect", model:"I have lived in Saint-Gilles-Croix-de-Vie for many years."},
      {q:"Have you ever had a problem at a hotel?", clue:"ever → present perfect", model:"Yes, I have had a problem at a hotel because the room was noisy."}
    ]
  };

  const dialogues = [
    {
      title:"At the boutique: the wrong size",
      intro:"A customer wants to return a jacket because it is the wrong size.",
      lines:[
        ["Shop assistant", "Good morning. How can I help you?"],
        ["Customer", "Hello. I would like to return this jacket, please."],
        ["Shop assistant", "Of course. What is the problem?"],
        ["Customer", "It is the wrong size. It is too small."],
        ["Shop assistant", "Do you have the receipt?"],
        ["Customer", "Yes, here it is."],
        ["Shop assistant", "Thank you. I can offer you another size or a refund."]
      ],
      quiz:{q:"What is the problem?", options:["The jacket is too small.","The room is noisy.","The pump stopped."], answer:0, hint:"Listen for the phrase 'wrong size'."},
      modelA1:"I would like to return this jacket. It is too small. I have the receipt.",
      modelA2:"Hello. I would like to return this jacket because it is the wrong size. It is too small. Could I have another size or a refund, please?"
    },
    {
      title:"At the pharmacy: asking for advice",
      intro:"You have a sore throat and need help from the pharmacist.",
      lines:[
        ["Pharmacist", "Hello. What can I do for you?"],
        ["Customer", "Hello. I have a sore throat and I don’t feel very well."],
        ["Pharmacist", "How long have you had it?"],
        ["Customer", "Since yesterday."],
        ["Pharmacist", "Do you have a fever?"],
        ["Customer", "No, I don’t."],
        ["Pharmacist", "You can try these lozenges, and you should drink water."]
      ],
      quiz:{q:"How long has the customer had a sore throat?", options:["Since yesterday.","For one week.","Since Friday morning."], answer:0, hint:"Listen for a present perfect clue with 'since'."},
      modelA1:"Hello. I have a sore throat. What can I take, please?",
      modelA2:"Hello. I have had a sore throat since yesterday, and I don’t feel very well. Could you recommend something, please?"
    },
    {
      title:"At the petrol station: card problem",
      intro:"You were filling up the car when your card was refused.",
      lines:[
        ["Customer", "Excuse me. I have a problem with pump number four."],
        ["Assistant", "What happened?"],
        ["Customer", "I was filling up the car when my card was refused."],
        ["Assistant", "Don’t worry. You can pay inside."],
        ["Customer", "Thank you. Do you take contactless cards?"],
        ["Assistant", "Yes, we do."],
        ["Customer", "Great, thank you for your help."]
      ],
      quiz:{q:"What was the customer doing when the card was refused?", options:["Filling up the car.","Booking a room.","Buying bread."], answer:0, hint:"The sentence uses 'I was ... when'."},
      modelA1:"Excuse me. I have a problem. My card was refused. Can I pay inside?",
      modelA2:"Excuse me. I was filling up the car when my card was refused. Would it be possible to pay inside, please?"
    },
    {
      title:"At the butcher’s: choosing meat",
      intro:"You want advice for a meal with six people.",
      lines:[
        ["Butcher", "Good morning. What would you like?"],
        ["Customer", "Good morning. I need meat for six people."],
        ["Butcher", "What are you going to cook?"],
        ["Customer", "I’m going to cook dinner for my family."],
        ["Butcher", "I recommend this chicken. It is very good."],
        ["Customer", "Perfect. How much do I need for six people?"],
        ["Butcher", "About one and a half kilos."]
      ],
      quiz:{q:"How many people is the meal for?", options:["Six people.","Two people.","Ten people."], answer:0, hint:"Listen for the number after 'for'."},
      modelA1:"Good morning. I need meat for six people, please.",
      modelA2:"Good morning. I need meat for six people. I’m going to cook dinner for my family. What do you recommend?"
    },
    {
      title:"At the salon: the worst client ever",
      intro:"A customer was angry, but you stayed calm and found a solution.",
      lines:[
        ["Customer", "I’m not happy. My appointment was at ten!"],
        ["Karine", "I’m sorry. Let me check the schedule for you."],
        ["Customer", "I was waiting outside when the salon opened."],
        ["Karine", "I understand. Please take a seat. I will check with Laura."],
        ["Customer", "Thank you."],
        ["Karine", "Laura can see you in ten minutes. Thank you for your patience."],
        ["Customer", "Okay, that’s fine."]
      ],
      quiz:{q:"What did Karine do?", options:["She stayed calm and checked the schedule.","She refused to help.","She closed the salon."], answer:0, hint:"What professional reaction did she have?"},
      modelA1:"I’m sorry. I will check the schedule for you. Please take a seat.",
      modelA2:"I’m sorry for the wait. Let me check the schedule for you. Laura can see you in ten minutes. Thank you for your patience."
    }
  ];

  const roleplays = [
    {
      title:"Boutique return",
      aim:"Return an item and ask for another size or a refund.",
      you:"Customer",
      tisha:"Shop assistant",
      phrases:["I would like to return this item.","It is the wrong size.","Do you have another size?","Could I have a refund, please?"],
      a1:"Hello. I would like to return this dress. It is too small. I have the receipt.",
      a2:"Hello. I would like to return this dress because it is the wrong size. Do you have another size, or would it be possible to have a refund, please?"
    },
    {
      title:"Pharmacy advice",
      aim:"Explain a health problem and ask for advice.",
      you:"Customer",
      tisha:"Pharmacist",
      phrases:["I have a headache.","I have had a sore throat since yesterday.","What can I take?","How often should I take it?"],
      a1:"Hello. I have a headache. What can I take, please?",
      a2:"Hello. I have had a headache since this morning. Could you recommend something? How often should I take it, please?"
    },
    {
      title:"Petrol station problem",
      aim:"Explain what happened while you were filling up the car.",
      you:"Customer",
      tisha:"Petrol station assistant",
      phrases:["I have a problem with pump number four.","I was filling up the car when...","My card was refused.","Can I pay inside?"],
      a1:"Excuse me. I have a problem. My card was refused. Can I pay inside?",
      a2:"Excuse me. I was filling up the car at pump number four when my card was refused. Would it be possible to pay inside, please?"
    },
    {
      title:"Worst client at the salon",
      aim:"Reassure a difficult client and offer a solution.",
      you:"Salon team",
      tisha:"Angry customer",
      phrases:["I’m sorry for the wait.","Let me check.","Please take a seat.","Thank you for your patience."],
      a1:"I’m sorry. I will check the appointment. Please take a seat.",
      a2:"I’m sorry for the wait. Let me check your appointment. Please take a seat, and I will speak to Laura. Thank you for your patience."
    },
    {
      title:"Supermarket checkout",
      aim:"Explain that you forgot your card and ask to pay another way.",
      you:"Customer",
      tisha:"Cashier",
      phrases:["I’m sorry, I forgot my card.","Can I pay with cash?","Can you wait a moment?","I will come back."],
      a1:"I’m sorry, I forgot my card. Can I pay with cash?",
      a2:"I’m sorry, I forgot my bank card. Would it be possible to pay with cash, please? If not, I can come back in ten minutes."
    }
  ];

  const writings = [
    {
      title:"Boutique: ask about availability",
      task:"You saw a jacket in a boutique. Write a short message to ask if they have it in your size.",
      help:"Use: Do you have...? / in size... / Could you keep it for me?",
      a1:"Hello,\nDo you have this jacket in size M, please?\nThank you,\nKarine",
      a2:"Hello,\nI saw a jacket in your boutique yesterday. Could you please tell me if you have it in size M?\nIf possible, could you keep it for me until tomorrow?\nThank you for your help.\nKind regards,\nKarine"
    },
    {
      title:"Pharmacy: ask for advice",
      task:"You have had a sore throat since yesterday. Write a message asking what you can take.",
      help:"Use: I have had... since... / Could you recommend...? / How often should I take it?",
      a1:"Hello,\nI have a sore throat.\nWhat can I take, please?\nThank you,\nKarine",
      a2:"Hello,\nI have had a sore throat since yesterday, and I don’t feel very well.\nCould you please recommend something? I would also like to know how often I should take it.\nThank you for your help.\nKind regards,\nKarine"
    },
    {
      title:"Petrol station: card problem",
      task:"You had a problem at the pump. Write a short message explaining what happened.",
      help:"Use: I was filling up the car when... / my card was refused / Can I...?",
      a1:"Hello,\nI have a problem with pump number four.\nMy card was refused. Can I pay inside, please?\nThank you,\nKarine",
      a2:"Hello,\nI was filling up the car at pump number four when my card was refused.\nWould it be possible to pay inside, please?\nThank you for your help.\nKind regards,\nKarine"
    },
    {
      title:"Campsite shop: ask about supplies",
      task:"You are at a campsite and need to know if there is a small supermarket nearby.",
      help:"Use: Is there...? / nearby / Could you tell me...?",
      a1:"Hello,\nIs there a small supermarket near the campsite, please?\nThank you,\nKarine",
      a2:"Hello,\nCould you please tell me if there is a small supermarket near the campsite?\nWe need to buy water, bread, and a few things for dinner.\nThank you for your help.\nKind regards,\nKarine"
    },
    {
      title:"Restaurant: problem during dinner",
      task:"You were eating dinner when there was a problem with the order. Write a polite message.",
      help:"Use: We were eating when... / the order was wrong / Could you...?",
      a1:"Hello,\nThere is a problem with our order.\nThis is not what we ordered.\nCould you check, please?\nThank you,\nKarine",
      a2:"Hello,\nWe were eating dinner when we realised there was a problem with our order.\nThis is not what we ordered. Would it be possible to check it, please?\nThank you for your help.\nKind regards,\nKarine"
    },
    {
      title:"Salon: difficult customer recap",
      task:"Write a short recap of a difficult client situation using past continuous and past simple.",
      help:"Use: I was... when... / The customer was... / I stayed calm / I found a solution.",
      a1:"Yesterday, I had a difficult customer.\nShe was waiting when the phone rang.\nI stayed calm and checked the appointment.\nI found a solution.",
      a2:"Yesterday, I had a difficult customer at the salon.\nI was helping another client when she arrived and started complaining.\nShe was annoyed because she had to wait. I stayed calm, checked the schedule, and offered a solution."
    }
  ];

  const stories = [
    {
      title:"The worst day ever",
      prompts:["Where were you?", "What were you doing?", "What happened suddenly?", "How did you feel?", "What solution did you find?"],
      modelA1:"Yesterday was a difficult day. I was shopping when I lost my receipt. I was embarrassed, but the shop assistant helped me. In the end, everything was okay.",
      modelA2:"Yesterday was a very difficult day. I was waiting at the checkout when I realised I didn’t have my bank card. I was embarrassed because there was a long queue behind me. I stayed calm, explained the problem to the cashier, and came back later to pay."
    },
    {
      title:"The worst client ever",
      prompts:["What was the client doing?", "Why was the client unhappy?", "What were you doing?", "What did you say?", "What happened in the end?"],
      modelA1:"The client was angry because she was waiting. I was helping another client when she arrived. I said, “Don’t worry, I will check.” I stayed calm and found a solution.",
      modelA2:"One day, a client was very angry because she thought her appointment was at ten o’clock. I was helping another client when she came into the salon and started complaining. I stayed polite, checked the schedule, and offered her another appointment. In the end, she was calmer."
    },
    {
      title:"A petrol station problem",
      prompts:["Where were you going?", "What were you doing at the station?", "What happened?", "Who helped you?", "What did you do next?"],
      modelA1:"I was going to the campsite. I was filling up the car when my card was refused. I asked the assistant for help. I paid inside and continued my trip.",
      modelA2:"Last summer, we were driving to a campsite when we stopped at a petrol station. I was filling up the car when my card was refused. I was a little stressed, but the assistant told me I could pay inside. After that, we continued our trip."
    },
    {
      title:"A shop problem",
      prompts:["What did you want to buy?", "What were you doing?", "What happened?", "What did the shop assistant say?", "What solution did you choose?"],
      modelA1:"I wanted to buy a jacket. I was trying it on when I saw it was too small. The shop assistant helped me. I chose another size.",
      modelA2:"I wanted to buy a jacket for the weekend. I was trying it on when I realised it was the wrong size. The shop assistant was very helpful and checked if they had another size. In the end, I bought the larger one."
    }
  ];

  function shuffle(arr){
    const copy = arr.slice();
    for(let i=copy.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [copy[i],copy[j]] = [copy[j],copy[i]];
    }
    return copy;
  }
  function escapeHTML(str){
    return String(str).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
  }
  function br(str){ return escapeHTML(str).replace(/\n/g,'<br>'); }

  function toast(msg){
    const old = $('.toast'); if(old) old.remove();
    const t = document.createElement('div'); t.className='toast'; t.textContent=msg;
    document.body.appendChild(t);
    setTimeout(()=>t.remove(),2200);
  }

  function speak(text){
    if(!('speechSynthesis' in window)){ toast('Audio is not available on this device.'); return; }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(String(text || '').replace(/\s+/g,' ').trim());
    utter.lang = $('#accentSelect')?.value || 'en-GB';
    utter.rate = 0.86;
    utter.pitch = 1.02;
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.lang && v.lang.toLowerCase().startsWith(utter.lang.toLowerCase())) || voices.find(v => v.lang && v.lang.startsWith('en'));
    if(preferred) utter.voice = preferred;
    window.speechSynthesis.speak(utter);
  }

  function updateScore(){
    $('#scoreBadge').textContent = `Score: ${state.correct} / ${state.answered}`;
  }

  function makeQuiz(container, data, prefix){
    const root = $(container);
    if(!root) return;
    root.innerHTML = '';
    data.forEach((item, idx) => {
      const card = document.createElement('article');
      card.className = 'q-card';
      const choices = shuffle(item.options.map((text, i) => ({text, correct: i === item.answer})));
      card.innerHTML = `
        <div class="q-top">
          <div>
            <p class="kicker">Question ${idx+1}</p>
            <p><b>${escapeHTML(item.q)}</b></p>
            ${item.stem ? `<p>${escapeHTML(item.stem)}</p>` : ''}
          </div>
          <button class="ghost" data-hint="${prefix}-${idx}" type="button">💡 Hint</button>
        </div>
        <div id="hint-${prefix}-${idx}" class="hint hidden">${escapeHTML(item.hint)}</div>
        <div class="choices"></div>
        <div class="feedback" aria-live="polite"></div>
      `;
      const choiceBox = $('.choices', card);
      choices.forEach(c => {
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'choice'; b.textContent = c.text;
        b.addEventListener('click', () => {
          if(card.dataset.done === 'yes') return;
          card.dataset.done = 'yes';
          state.answered++;
          if(c.correct){
            state.correct++;
            b.classList.add('correct');
            $('.feedback',card).className = 'feedback ok';
            $('.feedback',card).textContent = 'Correct. Excellent.';
          }else{
            b.classList.add('incorrect');
            $('.feedback',card).className = 'feedback no';
            const good = choices.find(x=>x.correct)?.text;
            $('.feedback',card).textContent = `Not quite. Correct answer: ${good}`;
            $$('.choice', card).forEach(btn => { if(btn.textContent === good) btn.classList.add('correct'); });
          }
          registerEvaluationAttempt(prefix, idx, c.correct);
          updateScore();
        });
        choiceBox.appendChild(b);
      });
      root.appendChild(card);
    });
  }

  function renderVocab(){
    const select = $('#vocabCategory');
    if(!select) return;
    select.innerHTML = Object.keys(vocab).map(k=>`<option value="${escapeHTML(k)}">${escapeHTML(k)}</option>`).join('');
    function draw(){
      const cards = vocab[select.value] || [];
      $('#vocabCards').innerHTML = cards.map((v,i)=>`
        <article class="vocab-card">
          <span class="emoji">${v.emoji}</span>
          <b>${escapeHTML(v.en)}</b>
          <small>${escapeHTML(v.fr)}</small>
          <p>${escapeHTML(v.def)}</p>
          <p><em>${escapeHTML(v.ex)}</em></p>
          <div class="vocab-actions">
            <button class="audio" data-say="${escapeHTML(v.en + '. ' + v.ex)}" type="button">🔊</button>
            <button class="ghost" data-toggle="vocabfr-${i}" type="button">FR help</button>
          </div>
          <div id="vocabfr-${i}" class="frhelp hidden">${escapeHTML(v.fr)} · ${escapeHTML(v.def)}</div>
        </article>
      `).join('');
    }
    select.addEventListener('change', draw);
    draw();
  }

  function renderQuestionTab(tab='routine'){
    const items = questions[tab] || questions.routine;
    $('#questionPanel').innerHTML = items.map((it, i)=>`
      <article class="question-card">
        <p class="kicker">Ask + answer ${i+1}</p>
        <h3>${escapeHTML(it.q)}</h3>
        <span class="clue">${escapeHTML(it.clue)}</span>
        <div class="button-row">
          <button class="audio" data-say="${escapeHTML(it.q)}" type="button">🔊 Question</button>
          <button class="ghost" data-toggle="qmodel-${tab}-${i}" type="button">Show model answer</button>
        </div>
        <div id="qmodel-${tab}-${i}" class="model-box hidden">
          <p><b>Model:</b> ${escapeHTML(it.model)}</p>
          <button class="audio" data-say="${escapeHTML(it.model)}" type="button">🔊 Model</button>
        </div>
      </article>
    `).join('');
  }

  function renderDialogues(){
    const select = $('#dialogueSelect');
    select.innerHTML = dialogues.map((d,i)=>`<option value="${i}">${escapeHTML(d.title)}</option>`).join('');
    function draw(){
      const d = dialogues[Number(select.value)] || dialogues[0];
      $('#dialoguePanel').innerHTML = `
        <h3>${escapeHTML(d.title)}</h3>
        <p>${escapeHTML(d.intro)}</p>
        <div class="button-row">
          <button class="audio" data-say="${escapeHTML(d.lines.map(l=>l.join(': ')).join('. '))}" type="button">🔊 Play full dialogue</button>
          <button class="ghost" data-toggle="dialogueTranscript" type="button">Show / hide transcript</button>
          <button class="ghost" data-toggle="dialogueModels" type="button">Show models</button>
        </div>
        <div id="dialogueTranscript" class="dialogue-lines hidden">
          ${d.lines.map(line=>`<div class="line"><b>${escapeHTML(line[0])}:</b> ${escapeHTML(line[1])}</div>`).join('')}
        </div>
        <div id="dialogueModels" class="model-box hidden">
          <p><b>A1 model:</b> ${escapeHTML(d.modelA1)}</p>
          <p><b>A2 model:</b> ${escapeHTML(d.modelA2)}</p>
          <button class="audio" data-say="${escapeHTML(d.modelA2)}" type="button">🔊 Listen to A2 model</button>
        </div>
      `;
      makeQuiz('#dialogueQuiz', [d.quiz], 'dialogue'+select.value);
    }
    select.addEventListener('change', draw);
    draw();
  }

  function renderRoleplays(){
    const select = $('#roleplaySelect');
    select.innerHTML = roleplays.map((r,i)=>`<option value="${i}">${escapeHTML(r.title)}</option>`).join('');
    function draw(){
      const r = roleplays[Number(select.value)] || roleplays[0];
      $('#roleplayPanel').innerHTML = `
        <h3>${escapeHTML(r.title)}</h3>
        <p><b>Goal:</b> ${escapeHTML(r.aim)}</p>
        <div class="role-grid">
          <div class="model-box"><p><b>You:</b> ${escapeHTML(r.you)}</p></div>
          <div class="model-box"><p><b>Tisha:</b> ${escapeHTML(r.tisha)}</p></div>
        </div>
        <div class="pill-list">${r.phrases.map(p=>`<span class="pill">${escapeHTML(p)}</span>`).join('')}</div>
        <div class="button-row">
          <button class="ghost" data-toggle="roleModels" type="button">Show / hide models</button>
          <button class="audio" data-say="${escapeHTML(r.phrases.join('. '))}" type="button">🔊 Useful phrases</button>
        </div>
        <div id="roleModels" class="model-box hidden">
          <p><b>A1:</b> ${escapeHTML(r.a1)}</p>
          <p><b>A2:</b> ${escapeHTML(r.a2)}</p>
          <button class="audio" data-say="${escapeHTML(r.a2)}" type="button">🔊 A2 model</button>
        </div>
        <p class="frhelp">Étape 1 : lis le modèle. Étape 2 : répète avec Tisha. Étape 3 : cache le modèle et recommence.</p>
      `;
    }
    select.addEventListener('change', draw);
    draw();
  }

  function renderWriting(){
    const select = $('#writingSelect');
    select.innerHTML = writings.map((w,i)=>`<option value="${i}">${escapeHTML(w.title)}</option>`).join('');
    function draw(){
      const w = writings[Number(select.value)] || writings[0];
      $('#writingPanel').innerHTML = `
        <h3>${escapeHTML(w.title)}</h3>
        <p><b>Task:</b> ${escapeHTML(w.task)}</p>
        <p class="hint"><b>Useful help:</b> ${escapeHTML(w.help)}</p>
        <div class="button-row">
          <button class="ghost" data-toggle="writingA1" type="button">Show A1 model</button>
          <button class="ghost" data-toggle="writingA2" type="button">Show A2 model</button>
          <button class="audio" data-say="${escapeHTML(w.task)}" type="button">🔊 Task</button>
        </div>
        <div id="writingA1" class="model-box hidden"><p>${br(w.a1)}</p><button class="audio" data-say="${escapeHTML(w.a1)}" type="button">🔊 A1</button></div>
        <div id="writingA2" class="model-box hidden"><p>${br(w.a2)}</p><button class="audio" data-say="${escapeHTML(w.a2)}" type="button">🔊 A2</button></div>
      `;
    }
    select.addEventListener('change', draw);
    draw();
  }

  function renderStory(){
    const select = $('#storyType');
    select.innerHTML = stories.map((s,i)=>`<option value="${i}">${escapeHTML(s.title)}</option>`).join('');
    function draw(){
      const s = stories[Number(select.value)] || stories[0];
      $('#storyPanel').innerHTML = `
        <h3>${escapeHTML(s.title)}</h3>
        <p><b>Build your story with these questions:</b></p>
        <ul>${s.prompts.map(p=>`<li>${escapeHTML(p)}</li>`).join('')}</ul>
        <div class="button-row">
          <button class="ghost" data-toggle="storyA1" type="button">Show A1 story</button>
          <button class="ghost" data-toggle="storyA2" type="button">Show A2 story</button>
          <button class="audio" data-say="${escapeHTML(s.prompts.join('. '))}" type="button">🔊 Prompts</button>
        </div>
        <div id="storyA1" class="model-box hidden"><p>${escapeHTML(s.modelA1)}</p></div>
        <div id="storyA2" class="model-box hidden"><p>${escapeHTML(s.modelA2)}</p><button class="audio" data-say="${escapeHTML(s.modelA2)}" type="button">🔊 A2 story</button></div>
        <p class="frhelp">Objectif oral : 5 phrases. Utilise au moins une phrase avec <b>I was ... when ...</b> ou <b>While I was ...</b>.</p>
      `;
    }
    select.addEventListener('change', draw);
    draw();
  }


  function ensureEvaluationStats(){
    sectionDefinitions.forEach(d => {
      if(!d.manual && !sectionStats[d.id]) sectionStats[d.id] = {correct:0, attempted:0, max:d.max};
    });
  }

  function sectionFromQuizPrefix(prefix){
    if(String(prefix).startsWith('vocab')) return 'vocab';
    if(String(prefix).startsWith('past')) return 'past';
    if(String(prefix).startsWith('dialogue')) return 'dialogue';
    return null;
  }

  function registerEvaluationAttempt(prefix, idx, isCorrect){
    const section = sectionFromQuizPrefix(prefix);
    if(!section) return;
    ensureEvaluationStats();
    const id = `${prefix}-${idx}`;
    const st = sectionStats[section];
    if(!st) return;
    if(!evaluationDone.has('attempt:'+id)){
      st.attempted++;
      evaluationDone.add('attempt:'+id);
    }
    if(isCorrect && !evaluationDone.has('correct:'+id)){
      st.correct++;
      evaluationDone.add('correct:'+id);
    }
    saveEvaluation(false);
    renderEvaluation();
  }

  function statusFromScore(correct, max, attempted){
    if(!attempted) return 'not-started';
    const pct = max ? Math.round((correct / max) * 100) : 0;
    if(pct >= 80) return 'achieved';
    if(pct >= 50) return 'progress';
    return 'not-achieved';
  }

  function statusLabel(status){
    return {
      'achieved':'Objectif atteint',
      'progress':'Objectif en cours d’acquisition',
      'not-achieved':'Objectif non atteint',
      'not-started':'Non commencé'
    }[status] || status;
  }

  function renderEvaluation(){
    ensureEvaluationStats();
    const rows = $('#evaluationRows');
    if(!rows) return;
    rows.innerHTML = sectionDefinitions.map(d => {
      if(d.manual){
        const st = manualStatus[d.id] || 'not-started';
        return `<tr><td>${escapeHTML(d.objective)}</td><td>${escapeHTML(d.subject)}</td><td>${escapeHTML(d.method)}</td><td class="score-mini">Évaluation manuelle</td><td><span class="status ${st}">${statusLabel(st)}</span></td></tr>`;
      }
      const s = sectionStats[d.id] || {correct:0, attempted:0, max:d.max};
      const st = statusFromScore(s.correct, s.max, s.attempted);
      const pct = s.max ? Math.round((s.correct / s.max) * 100) : 0;
      return `<tr><td>${escapeHTML(d.objective)}</td><td>${escapeHTML(d.subject)}</td><td>${escapeHTML(d.method)}</td><td class="score-mini">${s.correct}/${s.max} — ${pct}%</td><td><span class="status ${st}">${statusLabel(st)}</span></td></tr>`;
    }).join('');
    const completed = sectionDefinitions.filter(d => d.manual ? (manualStatus[d.id] || 'not-started') !== 'not-started' : (sectionStats[d.id]?.attempted || 0) > 0).length;
    const rate = Math.round((completed / sectionDefinitions.length) * 100);
    if($('#completionRate')) $('#completionRate').textContent = rate + '%';
    const statuses = sectionDefinitions.map(d => d.manual ? (manualStatus[d.id] || 'not-started') : statusFromScore(sectionStats[d.id]?.correct || 0, d.max, sectionStats[d.id]?.attempted || 0));
    let overall = 'not-started';
    if(statuses.some(s => s !== 'not-started')) overall = statuses.every(s => s === 'achieved') ? 'achieved' : statuses.some(s => s === 'not-achieved') ? 'not-achieved' : 'progress';
    const os = $('#overallStatus');
    if(os){ os.textContent = statusLabel(overall); os.className = 'status ' + overall; }
  }

  function collectEvaluationState(){
    return {
      version:3,
      learner:$('#learnerName')?.value || 'Karine Cormier',
      trainer:$('#trainerName')?.value || 'Tisha DOUTY-DOSIERE',
      date:$('#evaluationDate')?.value || '',
      sectionStats,
      manualStatus,
      evaluationDone:[...evaluationDone],
      comments:$('#trainerComments')?.value || '',
      lastSaved:new Date().toISOString()
    };
  }

  function saveEvaluation(showMessage=true){
    const state = collectEvaluationState();
    try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }catch(e){ console.warn('Could not save evaluation state', e); }
    if($('#lastSaved')) $('#lastSaved').textContent = new Date(state.lastSaved).toLocaleString();
    if(showMessage) toast('Progress saved in this browser.');
  }

  function loadEvaluation(){
    try{
      const raw = localStorage.getItem(STORAGE_KEY);
      if(!raw) return;
      const s = JSON.parse(raw);
      sectionStats = s.sectionStats || {};
      manualStatus = s.manualStatus || manualStatus;
      evaluationDone = new Set(s.evaluationDone || []);
      if($('#learnerName') && s.learner) $('#learnerName').value = s.learner;
      if($('#trainerName') && s.trainer) $('#trainerName').value = s.trainer;
      if($('#evaluationDate') && s.date) $('#evaluationDate').value = s.date;
      if($('#trainerComments')) $('#trainerComments').value = s.comments || '';
      if($('#lastSaved') && s.lastSaved) $('#lastSaved').textContent = new Date(s.lastSaved).toLocaleString();
      $$('[data-manual]').forEach(sel => { sel.value = manualStatus[sel.dataset.manual] || 'not-started'; });
    }catch(e){ console.warn('Could not load saved evaluation', e); }
  }

  function reportRows(){
    ensureEvaluationStats();
    return sectionDefinitions.map(d => {
      if(d.manual){
        const st = manualStatus[d.id] || 'not-started';
        return [d.objective, d.subject, d.method, 'Évaluation manuelle', statusLabel(st)];
      }
      const s = sectionStats[d.id] || {correct:0, attempted:0, max:d.max};
      const st = statusFromScore(s.correct, s.max, s.attempted);
      const pct = s.max ? Math.round((s.correct / s.max) * 100) : 0;
      return [d.objective, d.subject, d.method, `${s.correct}/${s.max} - ${pct}%`, statusLabel(st)];
    });
  }

  function getOverallReportData(){
    renderEvaluation();
    return {
      learner:$('#learnerName')?.value || 'Karine Cormier',
      trainer:$('#trainerName')?.value || 'Tisha DOUTY-DOSIERE',
      date:$('#evaluationDate')?.value || '',
      completion:$('#completionRate')?.textContent || '0%',
      overall:$('#overallStatus')?.textContent || 'Non commencé',
      comments:$('#trainerComments')?.value || '',
      rows:reportRows()
    };
  }

  function safeFileName(s){
    return String(s || 'report').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9_-]+/g,'-').replace(/^-+|-+$/g,'');
  }

  function downloadBlob(blob, name){
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1500);
  }

  function downloadReadableHTML(){
    saveEvaluation(false);
    const d = getOverallReportData();
    const rows = d.rows.map(r => `<tr>${r.map(c => `<td>${escapeHTML(c)}</td>`).join('')}</tr>`).join('');
    const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Bilan Qualiopi - ${escapeHTML(d.learner)}</title><style>body{font-family:Arial,sans-serif;color:#222;max-width:1100px;margin:35px auto;padding:0 24px}h1{color:#67226f}h2{color:#1ca8a6}table{border-collapse:collapse;width:100%;font-size:13px}th,td{border:1px solid #aaa;padding:8px;vertical-align:top}th{background:#eee}.meta{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin:18px 0}.box{border:1px solid #bbb;padding:10px;border-radius:8px}.comments{white-space:pre-wrap;min-height:80px}@media print{body{margin:0;max-width:none}}</style></head><body><h1>Bilan d'évaluation des acquis - Qualiopi</h1><h2>Karine - Story Street Skills Studio</h2><div class="meta"><div class="box"><b>Apprenante:</b> ${escapeHTML(d.learner)}</div><div class="box"><b>Formatrice:</b> ${escapeHTML(d.trainer)}</div><div class="box"><b>Date:</b> ${escapeHTML(d.date)}</div><div class="box"><b>Completion:</b> ${escapeHTML(d.completion)}</div><div class="box"><b>Résultat global:</b> ${escapeHTML(d.overall)}</div></div><table><thead><tr><th>Objectif pédagogique</th><th>Support / sujet</th><th>Mode d'évaluation</th><th>Score</th><th>Résultat</th></tr></thead><tbody>${rows}</tbody></table><h2>Observations de la formatrice</h2><div class="box comments">${escapeHTML(d.comments) || 'Aucune observation saisie.'}</div><p><small>Rapport généré depuis la page interactive. Les résultats restent également sauvegardés dans le navigateur utilisé.</small></p></body></html>`;
    downloadBlob(new Blob([html], {type:'text/html;charset=utf-8'}), `${safeFileName(d.learner)}-Story-Street-Bilan-Qualiopi.html`);
  }

  function latinText(s){
    return String(s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘]/g,"'").replace(/[“”]/g,'"').replace(/[–—]/g,'-').replace(/[^\x20-\x7E]/g,'');
  }
  function pdfEscape(s){ return latinText(s).replace(/\\/g,'\\\\').replace(/\(/g,'\\(').replace(/\)/g,'\\)'); }
  function wrapText(text, max=92){
    const words = latinText(text).split(/\s+/), lines=[]; let line='';
    for(const w of words){ if(!w) continue; const next = line ? line + ' ' + w : w; if(next.length > max && line){ lines.push(line); line = w; } else line = next; }
    if(line) lines.push(line); return lines.length ? lines : [''];
  }
  function buildSimplePDF(d){
    const pageW=595,pageH=842,left=42,top=800,bottom=45,lineH=14; let pages=[[]], y=top;
    function addLine(text,size=10,bold=false){ const wrapped=wrapText(text,size>=14?72:94); for(const ln of wrapped){ if(y<bottom){pages.push([]);y=top} pages[pages.length-1].push({text:ln,x:left,y,size,bold}); y-=size>=14?20:lineH; } }
    function gap(n=8){ y-=n; }
    addLine('BILAN D EVALUATION DES ACQUIS - QUALIOPI',17,true);
    addLine('Karine - Story Street Skills Studio',12,true); gap();
    addLine(`Apprenante: ${d.learner}`); addLine(`Formatrice: ${d.trainer}`); addLine(`Date: ${d.date}`); addLine(`Completion: ${d.completion} | Resultat global: ${d.overall}`); gap(12);
    d.rows.forEach((r,i)=>{ addLine(`${i+1}. Objectif: ${r[0]}`,11,true); addLine(`Support / sujet: ${r[1]}`); addLine(`Mode d evaluation: ${r[2]}`); addLine(`Score: ${r[3]} | Resultat: ${r[4]}`); gap(7); });
    addLine('Observations de la formatrice',12,true); addLine(d.comments || 'Aucune observation saisie.');
    const objs=[]; function obj(body){objs.push(body);return objs.length}
    const font1=obj('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');
    const font2=obj('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');
    const pageRefs=[], contentRefs=[];
    for(const lines of pages){ let stream=''; for(const l of lines){ stream += `BT /${l.bold?'F2':'F1'} ${l.size} Tf 1 0 0 1 ${l.x} ${l.y} Tm (${pdfEscape(l.text)}) Tj ET\n`; } contentRefs.push(obj(`<< /Length ${stream.length} >>\nstream\n${stream}endstream`)); pageRefs.push(obj('PLACEHOLDER')); }
    const pagesRef=obj('PLACEHOLDER_PAGES');
    pageRefs.forEach((ref,i)=>{ objs[ref-1]=`<< /Type /Page /Parent ${pagesRef} 0 R /MediaBox [0 0 ${pageW} ${pageH}] /Resources << /Font << /F1 ${font1} 0 R /F2 ${font2} 0 R >> >> /Contents ${contentRefs[i]} 0 R >>`; });
    objs[pagesRef-1]=`<< /Type /Pages /Kids [${pageRefs.map(r=>r+' 0 R').join(' ')}] /Count ${pageRefs.length} >>`;
    const catalog=obj(`<< /Type /Catalog /Pages ${pagesRef} 0 R >>`);
    let out='%PDF-1.4\n%PDFREPORT\n', offsets=[0];
    for(let i=0;i<objs.length;i++){ offsets.push(out.length); out += `${i+1} 0 obj\n${objs[i]}\nendobj\n`; }
    const xref=out.length; out += `xref\n0 ${objs.length+1}\n0000000000 65535 f \n`;
    for(let i=1;i<offsets.length;i++) out += String(offsets[i]).padStart(10,'0')+' 00000 n \n';
    out += `trailer\n<< /Size ${objs.length+1} /Root ${catalog} 0 R >>\nstartxref\n${xref}\n%%EOF`;
    return new Blob([new TextEncoder().encode(out)], {type:'application/pdf'});
  }
  function downloadPDFReport(){
    saveEvaluation(false);
    const d = getOverallReportData();
    downloadBlob(buildSimplePDF(d), `${safeFileName(d.learner)}-Story-Street-Bilan-Qualiopi.pdf`);
  }

  function resetEvaluation(){
    if(!confirm('Reset all saved results for this lesson?')) return;
    try{ localStorage.removeItem(STORAGE_KEY); }catch(e){}
    location.reload();
  }

  function initEvaluation(){
    ensureEvaluationStats();
    if($('#evaluationDate') && !$('#evaluationDate').value) $('#evaluationDate').value = new Date().toISOString().slice(0,10);
    loadEvaluation();
    $$('[data-manual]').forEach(sel => sel.addEventListener('change', () => { manualStatus[sel.dataset.manual] = sel.value; saveEvaluation(false); renderEvaluation(); }));
    $('#trainerComments')?.addEventListener('input', () => saveEvaluation(false));
    $('#learnerName')?.addEventListener('change', () => saveEvaluation(false));
    $('#trainerName')?.addEventListener('change', () => saveEvaluation(false));
    $('#evaluationDate')?.addEventListener('change', () => saveEvaluation(false));
    $('#saveProgress')?.addEventListener('click', () => saveEvaluation(true));
    $('#downloadPdf')?.addEventListener('click', downloadPDFReport);
    $('#downloadHtml')?.addEventListener('click', downloadReadableHTML);
    $('#printReport')?.addEventListener('click', () => { saveEvaluation(false); window.print(); });
    $('#resetProgress')?.addEventListener('click', resetEvaluation);
    renderEvaluation();
  }

  function initTimer(){
    function setDisplay(seconds){
      const m = String(Math.floor(seconds/60)).padStart(2,'0');
      const s = String(seconds%60).padStart(2,'0');
      $('#timerDisplay').textContent = `${m}:${s}`;
    }
    $$('[data-time]').forEach(btn => btn.addEventListener('click', () => {
      if(state.timer) clearInterval(state.timer);
      let remaining = Number(btn.dataset.time) || 60;
      setDisplay(remaining);
      state.timer = setInterval(() => {
        remaining--;
        setDisplay(remaining);
        if(remaining <= 0){ clearInterval(state.timer); state.timer=null; toast('Time is finished. Well done!'); }
      }, 1000);
    }));
    $('#stopTimer')?.addEventListener('click', () => { if(state.timer) clearInterval(state.timer); state.timer=null; });
  }

  async function initRecorder(){
    const start = $('#startRec'), stop = $('#stopRec'), download = $('#downloadRec'), status = $('#recStatus'), playback = $('#audioPlayback');
    if(!start || !stop) return;
    if(!navigator.mediaDevices || !window.MediaRecorder){
      status.textContent = 'Recording is not available in this browser. On iPhone/iPad, use Voice Memos and send the audio separately.';
      start.disabled = true;
      return;
    }
    start.addEventListener('click', async () => {
      try{
        const stream = await navigator.mediaDevices.getUserMedia({audio:true});
        state.chunks = [];
        state.rec = new MediaRecorder(stream);
        state.rec.ondataavailable = e => { if(e.data.size) state.chunks.push(e.data); };
        state.rec.onstop = () => {
          state.lastBlob = new Blob(state.chunks, {type:'audio/webm'});
          playback.src = URL.createObjectURL(state.lastBlob);
          download.disabled = false;
          status.textContent = 'Recording ready. Listen or download it.';
          stream.getTracks().forEach(t=>t.stop());
        };
        state.rec.start();
        start.disabled = true; stop.disabled = false; download.disabled = true;
        status.textContent = 'Recording... speak now.';
      }catch(err){
        status.textContent = 'Microphone permission was refused or is not available. On iPhone/iPad, use Voice Memos.';
      }
    });
    stop.addEventListener('click', () => {
      if(state.rec && state.rec.state !== 'inactive') state.rec.stop();
      start.disabled = false; stop.disabled = true;
    });
    download.addEventListener('click', () => {
      if(!state.lastBlob) return;
      const a = document.createElement('a');
      a.href = URL.createObjectURL(state.lastBlob);
      a.download = 'karine-speaking-practice.webm';
      a.click();
    });
  }

  function initGlobalEvents(){
    $('#toggleFr')?.addEventListener('click', () => {
      document.body.classList.toggle('show-fr');
      $('#toggleFr').textContent = document.body.classList.contains('show-fr') ? '🇫🇷 Hide French help' : '🇫🇷 Show French help';
    });
    $('#stopAudio')?.addEventListener('click', () => { if('speechSynthesis' in window) window.speechSynthesis.cancel(); });
    document.body.addEventListener('click', e => {
      const sayBtn = e.target.closest('[data-say]');
      if(sayBtn){ speak(sayBtn.dataset.say); return; }
      const targetBtn = e.target.closest('[data-say-target]');
      if(targetBtn){ const el = document.getElementById(targetBtn.dataset.sayTarget); if(el) speak(el.textContent); return; }
      const toggleBtn = e.target.closest('[data-toggle]');
      if(toggleBtn){ const el = document.getElementById(toggleBtn.dataset.toggle); if(el) el.classList.toggle('hidden'); return; }
      const hintBtn = e.target.closest('[data-hint]');
      if(hintBtn){ const el = document.getElementById('hint-'+hintBtn.dataset.hint); if(el) el.classList.toggle('hidden'); return; }
      const warm = e.target.closest('[data-next-warmup]');
      if(warm){
        const item = warmups[Math.floor(Math.random()*warmups.length)];
        $('#warmupQuestion').textContent = item.q;
        $('#warmupModel').innerHTML = `<p><b>Model:</b> ${escapeHTML(item.m)}</p><p class="frhelp">Modèle : phrase simple + un détail.</p>`;
        return;
      }
    });
    $$('.tab').forEach(btn => btn.addEventListener('click', () => {
      $$('.tab').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      renderQuestionTab(btn.dataset.questionTab);
    }));
    $('#copyWriting')?.addEventListener('click', async () => {
      const text = $('#studentWriting')?.value || '';
      if(!text.trim()){ toast('Write a message first.'); return; }
      try{ await navigator.clipboard.writeText(text); toast('Copied.'); }
      catch(e){ toast('Copy is not available. Select the text manually.'); }
    });
    $('#clearWriting')?.addEventListener('click', () => { $('#studentWriting').value = ''; });
  }

  function init(){
    renderVocab();
    makeQuiz('#vocabQuiz', vocabQuizData, 'vocab');
    makeQuiz('#pastQuiz', pastQuizData, 'past');
    renderQuestionTab('routine');
    renderDialogues();
    renderRoleplays();
    renderWriting();
    renderStory();
    initTimer();
    initRecorder();
    initGlobalEvents();
    initEvaluation();
    updateScore();
    if('speechSynthesis' in window){ window.speechSynthesis.onvoiceschanged = () => {}; }
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();


// Qualiopi learner reflection copy helper
(function(){
  function ready(fn){ if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn); else fn(); }
  ready(function(){
    var btn = document.getElementById('copyQualityReflection');
    var box = document.getElementById('qualityReflection');
    var status = document.getElementById('qualityCopyStatus');
    if(!btn || !box) return;
    btn.addEventListener('click', async function(){
      var text = box.value || '';
      if(!text.trim()){
        if(status) status.textContent = 'Write your reflection first.';
        return;
      }
      try{
        await navigator.clipboard.writeText(text);
        if(status) status.textContent = 'Reflection copied. You can paste it into your message to Tisha.';
      }catch(err){
        if(status) status.textContent = 'Copy is not available here. Please select the text manually.';
      }
    });
  });
})();
