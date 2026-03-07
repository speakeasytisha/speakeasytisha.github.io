/* SpeakEasyTisha — What If? Conditional Response Lab
   Put this file in: /js/what-if-conditional-lab.js
*/
(function(){
  "use strict";

  function $(sel, root){ return (root || document).querySelector(sel); }
  function $all(sel, root){ return Array.from((root || document).querySelectorAll(sel)); }
  function shuffle(arr){
    var a = arr.slice();
    for (var i=a.length-1;i>0;i--){
      var j = Math.floor(Math.random()*(i+1));
      var t=a[i]; a[i]=a[j]; a[j]=t;
    }
    return a;
  }

  var LS = {
    get: function(k, fallback){
      try{
        var v = localStorage.getItem(k);
        return v === null ? fallback : JSON.parse(v);
      }catch(e){ return fallback; }
    },
    set: function(k, v){
      try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){}
    },
    del: function(k){
      try{ localStorage.removeItem(k); }catch(e){}
    }
  };

  var KEY_STATE = "se_whatif_state_v1";
  var KEY_SCORE = "se_whatif_score_v1";
  var KEY_NOTES = "se_whatif_notes_v1";

  var state = LS.get(KEY_STATE, {
    activeTopicId: null,
    mastered: {},
    builderAwarded: {},
    quizAwarded: {},
    fillAwarded: {},
    spokeAwarded: {}
  });
  var scoreState = LS.get(KEY_SCORE, {score:0});

  function setScore(n){
    scoreState.score = n;
    LS.set(KEY_SCORE, scoreState);
    $("#scoreTop").textContent = String(n);
    $("#scoreBottom").textContent = String(n);
  }
  function addScore(delta){
    setScore(Math.max(0, (scoreState.score||0) + delta));
  }

  // Speech
  var accentSel = $("#accent");
  var speechSupported = ("speechSynthesis" in window) && ("SpeechSynthesisUtterance" in window);

  function stopSpeech(){
    if (!speechSupported) return;
    try{ window.speechSynthesis.cancel(); }catch(e){}
  }

  function pickVoice(lang){
    if (!speechSupported) return null;
    var voices = window.speechSynthesis.getVoices ? window.speechSynthesis.getVoices() : [];
    if (!voices || !voices.length) return null;
    var exact = voices.filter(function(v){ return (v.lang||"").toLowerCase() === lang.toLowerCase(); });
    if (exact.length) return exact[0];
    var base = lang.toLowerCase().slice(0,2);
    var partial = voices.filter(function(v){ return (v.lang||"").toLowerCase().indexOf(base) === 0; });
    return partial.length ? partial[0] : voices[0];
  }

  function speak(text){
    if (!speechSupported){
      alert("Text-to-speech is not available in this browser.");
      return;
    }
    stopSpeech();
    var u = new SpeechSynthesisUtterance(String(text||""));
    var lang = accentSel ? accentSel.value : "en-GB";
    u.lang = lang;
    u.rate = 0.98;
    u.pitch = 1.0;
    var v = pickVoice(lang);
    if (v) u.voice = v;
    window.speechSynthesis.speak(u);
  }

  if (speechSupported && window.speechSynthesis){
    window.speechSynthesis.onvoiceschanged = function(){};
  }
  $("#btnStopSpeech") && $("#btnStopSpeech").addEventListener("click", stopSpeech);

  // Scroll chips
  $all("[data-scroll]").forEach(function(btn){
    btn.addEventListener("click", function(){
      var sel = btn.getAttribute("data-scroll");
      var el = $(sel);
      if (el) el.scrollIntoView({behavior:"smooth", block:"start"});
    });
  });

  // Data
  var TOPICS = [
    {
      id:"advice_jetlag_big_day",
      title:"Advice — Jet lag before a big day",
      desc:"Give friendly, practical advice using “If I were you…”",
      tags:[
        "advice",
        "second",
        "travel",
        "fun"
      ],
      recommended:45,
      speakPrompt:"Your friend is jet-lagged before an important day. What would you do? What advice would you give?",
      dialogue:[
        {
          sp:"Examiner",
          en:"What would you do if you were jet‑lagged before an important day?",
          fr:"Que feriez-vous si vous aviez le décalage horaire avant une journée importante ?"
        },
        {
          sp:"Candidate",
          en:"If I were you, I’d keep it simple: light food, water, and a short walk outside.",
          fr:"À ta place, je ferais simple : repas léger, eau, et petite marche dehors."
        },
        {
          sp:"Examiner",
          en:"Why?",
          fr:"Pourquoi ?"
        },
        {
          sp:"Candidate",
          en:"Because daylight helps your body clock. I’d also avoid a long nap, maybe 20 minutes максимум.",
          fr:"Parce que la lumière aide l’horloge interne. J’éviterais aussi une longue sieste, plutôt 20 minutes max."
        },
        {
          sp:"Examiner",
          en:"Anything else?",
          fr:"Autre chose ?"
        },
        {
          sp:"Candidate",
          en:"Yes—prepare tonight: outfit, documents, and an early bedtime. That usually works.",
          fr:"Oui — préparer ce soir : tenue, documents, et se coucher tôt. Ça marche souvent."
        }
      ],
      writing:{
        subject:"Subject: Quick plan for jet lag",
        body:`Hi!

If I were you, I’d go for a short walk in daylight, drink plenty of water, and eat something light.
Try a 20‑minute nap only (not more), then prepare everything for tomorrow and go to bed early.

You’ve got this 💪`
      },
      vocab:[
        {
          icon:"🕒",
          word:"jet lag",
          def:"tiredness after crossing time zones",
          fr:"décalage horaire"
        },
        {
          icon:"🌞",
          word:"daylight",
          def:"natural light during the day",
          fr:"lumière du jour"
        },
        {
          icon:"🥤",
          word:"to stay hydrated",
          def:"drink enough water",
          fr:"rester hydraté"
        },
        {
          icon:"😴",
          word:"a short nap",
          def:"sleep for a short time",
          fr:"petite sieste"
        },
        {
          icon:"🧳",
          word:"to prepare in advance",
          def:"get ready earlier",
          fr:"préparer à l’avance"
        }
      ],
      builderModel:[
        {
          step:1,
          text:"If I were you, I’d start with something simple: water, light food, and daylight."
        },
        {
          step:2,
          text:"I’d take a short walk and avoid a long nap, because daylight helps reset your body clock."
        },
        {
          step:3,
          text:"Finally, I’d prepare everything for tomorrow and go to bed early to feel ready."
        }
      ],
      fill:{
        template:"If I {b0} you, I {b1} drink water and go outside in {b2}. I {b3} avoid a long nap, because it can make you feel worse. Finally, I’d {b4} everything for tomorrow.",
        blanks:[
          {
            id:"b0",
            options:[
              "were",
              "was",
              "am"
            ],
            answer:"were"
          },
          {
            id:"b1",
            options:[
              "would",
              "will",
              "can"
            ],
            answer:"would"
          },
          {
            id:"b2",
            options:[
              "daylight",
              "midnight",
              "deadline"
            ],
            answer:"daylight"
          },
          {
            id:"b3",
            options:[
              "would",
              "will",
              "did"
            ],
            answer:"would"
          },
          {
            id:"b4",
            options:[
              "prepare",
              "repair",
              "repeat"
            ],
            answer:"prepare"
          }
        ]
      },
      quizBank:[
        {
          prompt:"Best structure",
          question:"Which sentence is correct for advice?",
          options:[
            {
              t:"If I was you, I will drink water.",
              ok:false,
              why:"For advice, use *If I were you, I would…*"
            },
            {
              t:"If I were you, I’d drink water and go outside.",
              ok:true,
              why:"Correct: were + would for advice."
            },
            {
              t:"If I am you, I would drink water.",
              ok:false,
              why:"Incorrect structure."
            }
          ]
        },
        {
          prompt:"Best connector",
          question:"You add a reason. Choose the best option.",
          options:[
            {
              t:"because daylight helps reset your body clock",
              ok:true,
              why:"Clear reason."
            },
            {
              t:"because yes",
              ok:false,
              why:"Not a real reason."
            },
            {
              t:"because maybe",
              ok:false,
              why:"Too vague."
            }
          ]
        },
        {
          prompt:"Best tone",
          question:"Which closing sounds supportive?",
          options:[
            {
              t:"You’ve got this.",
              ok:true,
              why:"Encouraging and natural."
            },
            {
              t:"That’s your problem.",
              ok:false,
              why:"Negative."
            },
            {
              t:"Whatever.",
              ok:false,
              why:"Dismissive."
            }
          ]
        }
      ]
    },
    {
      id:"advice_tourist_traps",
      title:"Advice — Avoid tourist traps",
      desc:"Give advice with “I’d recommend… / I’d suggest…”",
      tags:[
        "advice",
        "second",
        "travel",
        "fun"
      ],
      recommended:45,
      speakPrompt:"Your friend wants to visit a city without falling into tourist traps. What would you advise?",
      dialogue:[
        {
          sp:"Examiner",
          en:"What would you do to avoid tourist traps in a new city?",
          fr:"Que feriez-vous pour éviter les pièges à touristes dans une nouvelle ville ?"
        },
        {
          sp:"Candidate",
          en:"If I were you, I’d book one must‑see place, then explore local neighbourhoods on foot.",
          fr:"À ta place, je réserverais un incontournable, puis j’explorerais des quartiers locaux à pied."
        },
        {
          sp:"Examiner",
          en:"How do you choose restaurants?",
          fr:"Comment choisissez-vous les restaurants ?"
        },
        {
          sp:"Candidate",
          en:"I’d check recent reviews, look for a short menu, and avoid places with photos everywhere.",
          fr:"Je regarderais les avis récents, une carte courte, et j’éviterais les restos avec des photos partout."
        },
        {
          sp:"Examiner",
          en:"Any last tip?",
          fr:"Un dernier conseil ?"
        },
        {
          sp:"Candidate",
          en:"Yes—go early for famous spots and keep afternoons flexible. Less stress, more fun.",
          fr:"Oui — aller tôt pour les lieux connus et garder l’après‑midi flexible. Moins de stress, plus de plaisir."
        }
      ],
      writing:{
        subject:"Subject: Mini plan to avoid tourist traps",
        body:`Hi!

If I were you, I’d choose ONE must‑see place, then spend the rest of the day exploring local areas.
For restaurants, I’d check recent reviews and pick places with a short menu (usually fresher).
Also, go early for famous spots—then keep the afternoon flexible.

Enjoy!`
      },
      vocab:[
        {
          icon:"🎯",
          word:"a must‑see",
          def:"a place you really should visit",
          fr:"un incontournable"
        },
        {
          icon:"🧭",
          word:"neighbourhood",
          def:"a local area in a city",
          fr:"quartier"
        },
        {
          icon:"📝",
          word:"recent reviews",
          def:"new comments/ratings online",
          fr:"avis récents"
        },
        {
          icon:"📋",
          word:"a short menu",
          def:"few dishes on the menu",
          fr:"carte courte"
        },
        {
          icon:"⏰",
          word:"to go early",
          def:"arrive earlier than most people",
          fr:"y aller tôt"
        }
      ],
      builderModel:[
        {
          step:1,
          text:"If I were you, I’d plan one must‑see place, then explore neighbourhoods on foot."
        },
        {
          step:2,
          text:"I’d choose restaurants with recent reviews and a short menu, because it’s usually more authentic."
        },
        {
          step:3,
          text:"Finally, I’d go early for famous spots and keep afternoons flexible to enjoy the city."
        }
      ],
      fill:{
        template:"If I were you, I’d plan one {b0}, then explore local {b1}. I’d check {b2} reviews and pick a restaurant with a {b3} menu. I’d also go {b4} to avoid crowds.",
        blanks:[
          {
            id:"b0",
            options:[
              "must-see",
              "must-do",
              "must-be"
            ],
            answer:"must-see"
          },
          {
            id:"b1",
            options:[
              "neighbourhoods",
              "neighbours",
              "neighbour"
            ],
            answer:"neighbourhoods"
          },
          {
            id:"b2",
            options:[
              "recent",
              "receipt",
              "rescue"
            ],
            answer:"recent"
          },
          {
            id:"b3",
            options:[
              "short",
              "shot",
              "shirt"
            ],
            answer:"short"
          },
          {
            id:"b4",
            options:[
              "early",
              "easily",
              "earth"
            ],
            answer:"early"
          }
        ]
      },
      quizBank:[
        {
          prompt:"Grammar",
          question:"Choose the correct advice form:",
          options:[
            {
              t:"If I were you, I’d go early.",
              ok:true,
              why:"Correct advice form."
            },
            {
              t:"If I will be you, I go early.",
              ok:false,
              why:"Incorrect structure."
            },
            {
              t:"If I was you, I will go early.",
              ok:false,
              why:"Tense mismatch for advice."
            }
          ]
        },
        {
          prompt:"Vocabulary",
          question:"A “must‑see” is…",
          options:[
            {
              t:"a place you really should visit",
              ok:true,
              why:"Correct meaning."
            },
            {
              t:"a place you must work",
              ok:false,
              why:"Wrong."
            },
            {
              t:"a place you can’t enter",
              ok:false,
              why:"Wrong."
            }
          ]
        },
        {
          prompt:"Style",
          question:"Which sentence sounds more natural?",
          options:[
            {
              t:"I’d check recent reviews.",
              ok:true,
              why:"Natural spoken English."
            },
            {
              t:"I check reviews recent.",
              ok:false,
              why:"Word order."
            },
            {
              t:"I checking reviews.",
              ok:false,
              why:"Incorrect tense."
            }
          ]
        }
      ]
    },
    {
      id:"advice_small_talk_locals",
      title:"Advice — Small talk with locals",
      desc:"Sound friendly: “I’d start with…” “I’d ask…”",
      tags:[
        "advice",
        "second",
        "social",
        "fun"
      ],
      recommended:45,
      speakPrompt:"Your friend is shy and wants to talk to locals in English. What would you suggest?",
      dialogue:[
        {
          sp:"Examiner",
          en:"What would you do if you were shy but wanted to talk to locals?",
          fr:"Que feriez-vous si vous étiez timide mais vouliez parler avec des locaux ?"
        },
        {
          sp:"Candidate",
          en:"If I were you, I’d start with simple questions like ‘Is this seat free?’ or ‘What do you recommend?’",
          fr:"À ta place, je commencerais par des questions simples comme ‘Cette place est libre ?’ ou ‘Vous conseillez quoi ?’"
        },
        {
          sp:"Examiner",
          en:"How do you keep it going?",
          fr:"Comment continuer ?"
        },
        {
          sp:"Candidate",
          en:"I’d use follow‑up questions: ‘Oh really?’ ‘How come?’ and I’d smile—tone matters.",
          fr:"J’utiliserais des questions de relance : ‘Ah oui ?’ ‘Pourquoi ?’ et je sourirais — le ton compte."
        },
        {
          sp:"Examiner",
          en:"Good.",
          fr:"Bien."
        },
        {
          sp:"Candidate",
          en:"And if I made a mistake, I’d just correct myself and continue. Fluency is confidence.",
          fr:"Et si je faisais une erreur, je me corrigerais et je continuerais. L’aisance, c’est la confiance."
        }
      ],
      writing:{
        subject:"Subject: Quick small-talk starters",
        body:`Hi!

If I were you, I’d start with easy questions:
• “Is this seat free?” • “What do you recommend?” • “How’s your day?”

Then use follow‑ups: “Oh really?” “How come?” “That sounds great!”
And don’t worry about mistakes—just keep going 😊`
      },
      vocab:[
        {
          icon:"🙂",
          word:"to be shy",
          def:"not confident speaking to strangers",
          fr:"être timide"
        },
        {
          icon:"🪑",
          word:"Is this seat free?",
          def:"polite question in public places",
          fr:"Cette place est libre ?"
        },
        {
          icon:"⭐",
          word:"What do you recommend?",
          def:"ask for a suggestion",
          fr:"Vous conseillez quoi ?"
        },
        {
          icon:"🔁",
          word:"follow‑up question",
          def:"a question that continues the conversation",
          fr:"question de relance"
        },
        {
          icon:"💬",
          word:"tone matters",
          def:"how you sound is important",
          fr:"le ton compte"
        }
      ],
      builderModel:[
        {
          step:1,
          text:"If I were you, I’d start with simple, safe questions to open the conversation."
        },
        {
          step:2,
          text:"I’d use follow‑ups and friendly tone, because people respond to confidence and warmth."
        },
        {
          step:3,
          text:"Finally, I’d accept small mistakes and keep going—fluency improves with practice."
        }
      ],
      fill:{
        template:"If I were you, I’d {b0} with simple questions. I’d use {b1}-up questions and a friendly {b2}. If I made a {b3}, I’d correct myself and {b4}.",
        blanks:[
          {
            id:"b0",
            options:[
              "start",
              "stare",
              "store"
            ],
            answer:"start"
          },
          {
            id:"b1",
            options:[
              "follow",
              "fellow",
              "hollow"
            ],
            answer:"follow"
          },
          {
            id:"b2",
            options:[
              "tone",
              "town",
              "turn"
            ],
            answer:"tone"
          },
          {
            id:"b3",
            options:[
              "mistake",
              "mission",
              "message"
            ],
            answer:"mistake"
          },
          {
            id:"b4",
            options:[
              "continue",
              "contain",
              "control"
            ],
            answer:"continue"
          }
        ]
      },
      quizBank:[
        {
          prompt:"Starter",
          question:"Which is a good small-talk opener?",
          options:[
            {
              t:"Is this seat free?",
              ok:true,
              why:"Simple and polite."
            },
            {
              t:"Tell me your secrets.",
              ok:false,
              why:"Too personal."
            },
            {
              t:"Why are you here?",
              ok:false,
              why:"Can sound intrusive."
            }
          ]
        },
        {
          prompt:"Advice grammar",
          question:"Choose the correct form:",
          options:[
            {
              t:"If I were you, I’d ask follow‑up questions.",
              ok:true,
              why:"Correct advice form."
            },
            {
              t:"If I am you, I ask follow‑up questions.",
              ok:false,
              why:"Incorrect structure."
            },
            {
              t:"If I were you, I will ask follow‑up questions.",
              ok:false,
              why:"Use would for advice."
            }
          ]
        },
        {
          prompt:"Tone",
          question:"What helps conversation most?",
          options:[
            {
              t:"a friendly tone",
              ok:true,
              why:"Tone matters in small talk."
            },
            {
              t:"speaking very fast",
              ok:false,
              why:"Can reduce clarity."
            },
            {
              t:"never smiling",
              ok:false,
              why:"Less friendly."
            }
          ]
        }
      ]
    },
    {
      id:"second_lost_passport",
      title:"What if…? — You lost your passport abroad",
      desc:"Use 2nd conditional: If I lost…, I would…",
      tags:[
        "second",
        "whatif",
        "travel",
        "problem"
      ],
      recommended:60,
      speakPrompt:"What would you do if you lost your passport while travelling?",
      dialogue:[
        {
          sp:"Examiner",
          en:"What would you do if you lost your passport abroad?",
          fr:"Que feriez-vous si vous perdiez votre passeport à l’étranger ?"
        },
        {
          sp:"Candidate",
          en:"If I lost my passport, I’d stay calm and report it immediately.",
          fr:"Si je perdais mon passeport, je resterais calme et je le signalerais tout de suite."
        },
        {
          sp:"Examiner",
          en:"Where?",
          fr:"Où ?"
        },
        {
          sp:"Candidate",
          en:"I’d go to the local police station, then contact my embassy to ask for an emergency document.",
          fr:"J’irais au commissariat, puis je contacterais mon ambassade pour un document d’urgence."
        },
        {
          sp:"Examiner",
          en:"And your travel plans?",
          fr:"Et vos plans ?"
        },
        {
          sp:"Candidate",
          en:"I’d keep digital copies of documents and I’d inform the airline or hotel if needed.",
          fr:"Je garderais des copies numériques et j’informerais la compagnie ou l’hôtel si nécessaire."
        }
      ],
      writing:{
        subject:"Subject: Lost passport — next steps",
        body:`Hello,

If I lost my passport abroad, I would report it to the local police and ask for a report.
Then I would contact my embassy to request an emergency travel document.

I would also use my digital copies (passport scan, ID) to speed up the process.

Best regards,
[Your Name]`
      },
      vocab:[
        {
          icon:"🧳",
          word:"to lose",
          def:"to misplace; not have it anymore",
          fr:"perdre"
        },
        {
          icon:"👮",
          word:"police report",
          def:"official document from the police",
          fr:"déclaration / procès-verbal"
        },
        {
          icon:"🏛️",
          word:"embassy",
          def:"official office of your country abroad",
          fr:"ambassade"
        },
        {
          icon:"📄",
          word:"emergency document",
          def:"temporary travel paper",
          fr:"document d’urgence"
        },
        {
          icon:"🧠",
          word:"digital copy",
          def:"scan/photo stored on your phone",
          fr:"copie numérique"
        }
      ],
      builderModel:[
        {
          step:1,
          text:"If I lost my passport abroad, I would stay calm and report it immediately."
        },
        {
          step:2,
          text:"I would go to the police for a report and contact my embassy for an emergency document."
        },
        {
          step:3,
          text:"Finally, I would use digital copies and inform the airline or hotel if necessary."
        }
      ],
      fill:{
        template:"If I {b0} my passport abroad, I {b1} stay calm and report it. I would go to the {b2} for a report, then contact my {b3}. I would use a {b4} to help confirm my identity.",
        blanks:[
          {
            id:"b0",
            options:[
              "lost",
              "lose",
              "would lose"
            ],
            answer:"lost"
          },
          {
            id:"b1",
            options:[
              "would",
              "will",
              "did"
            ],
            answer:"would"
          },
          {
            id:"b2",
            options:[
              "police",
              "policy",
              "polite"
            ],
            answer:"police"
          },
          {
            id:"b3",
            options:[
              "embassy",
              "embassy-man",
              "embrace"
            ],
            answer:"embassy"
          },
          {
            id:"b4",
            options:[
              "digital copy",
              "difficult copy",
              "digital coffee"
            ],
            answer:"digital copy"
          }
        ]
      },
      quizBank:[
        {
          prompt:"2nd conditional",
          question:"Choose the correct sentence:",
          options:[
            {
              t:"If I lose my passport, I would call the embassy.",
              ok:false,
              why:"Mixes 1st and 2nd. Use: If I lost…, I would…"
            },
            {
              t:"If I lost my passport, I would call the embassy.",
              ok:true,
              why:"Correct 2nd conditional."
            },
            {
              t:"If I lost my passport, I will call the embassy.",
              ok:false,
              why:"Use would for hypothetical."
            }
          ]
        },
        {
          prompt:"Order",
          question:"What is a logical first step?",
          options:[
            {
              t:"Report it (police report).",
              ok:true,
              why:"You usually need an official report."
            },
            {
              t:"Buy a new passport online.",
              ok:false,
              why:"Not realistic."
            },
            {
              t:"Ignore it.",
              ok:false,
              why:"Not safe."
            }
          ]
        },
        {
          prompt:"Vocabulary",
          question:"An “embassy” is…",
          options:[
            {
              t:"your country’s official office abroad",
              ok:true,
              why:"Correct."
            },
            {
              t:"a hotel lobby",
              ok:false,
              why:"No."
            },
            {
              t:"a passport photo",
              ok:false,
              why:"No."
            }
          ]
        }
      ]
    },
    {
      id:"second_phone_stolen",
      title:"What if…? — Your phone was stolen",
      desc:"Use “I’d / I would” + practical steps.",
      tags:[
        "second",
        "whatif",
        "travel",
        "problem"
      ],
      recommended:60,
      speakPrompt:"What would you do if your phone was stolen during a trip?",
      dialogue:[
        {
          sp:"Examiner",
          en:"What would you do if your phone was stolen on holiday?",
          fr:"Que feriez-vous si on vous volait votre téléphone en vacances ?"
        },
        {
          sp:"Candidate",
          en:"If my phone was stolen, I’d lock it remotely and change my main passwords.",
          fr:"Si on me volait mon téléphone, je le bloquerais à distance et je changerais mes mots de passe."
        },
        {
          sp:"Examiner",
          en:"Then?",
          fr:"Ensuite ?"
        },
        {
          sp:"Candidate",
          en:"I’d contact my mobile provider to block the SIM, and I’d report the theft to the police.",
          fr:"Je contacterais mon opérateur pour bloquer la SIM, et je déclarerais le vol à la police."
        },
        {
          sp:"Examiner",
          en:"How would you pay or travel?",
          fr:"Et pour payer ou voyager ?"
        },
        {
          sp:"Candidate",
          en:"I’d use a backup card and a paper copy of my tickets. And I’d buy a cheap temporary phone.",
          fr:"J’utiliserais une carte de secours et une copie papier des billets. Et j’achèterais un téléphone temporaire pas cher."
        }
      ],
      writing:{
        subject:"Subject: Phone stolen — action plan",
        body:`Hi,

If my phone was stolen, I would lock it remotely, block the SIM card with my provider, and change my passwords.
I would also report the theft to the police and keep the reference number.

Then I would use a backup payment method and a paper copy of my tickets.

Best,
[Your Name]`
      },
      vocab:[
        {
          icon:"📵",
          word:"to lock remotely",
          def:"lock a device from another device",
          fr:"verrouiller à distance"
        },
        {
          icon:"🔐",
          word:"password",
          def:"secret code for accounts",
          fr:"mot de passe"
        },
        {
          icon:"📶",
          word:"SIM card",
          def:"phone chip for network",
          fr:"carte SIM"
        },
        {
          icon:"🧾",
          word:"reference number",
          def:"official report number",
          fr:"numéro de dossier"
        },
        {
          icon:"💳",
          word:"backup card",
          def:"extra card kept safe",
          fr:"carte de secours"
        }
      ],
      builderModel:[
        {
          step:1,
          text:"If my phone was stolen, I would lock it remotely and change my main passwords."
        },
        {
          step:2,
          text:"I would block the SIM card with my provider and report the theft to the police."
        },
        {
          step:3,
          text:"Finally, I would use a backup payment method and a temporary phone to stay organised."
        }
      ],
      fill:{
        template:"If my phone {b0} stolen, I {b1} lock it remotely and change my {b2}. I would block the {b3} and report it to the {b4}.",
        blanks:[
          {
            id:"b0",
            options:[
              "was",
              "is",
              "were"
            ],
            answer:"was"
          },
          {
            id:"b1",
            options:[
              "would",
              "will",
              "did"
            ],
            answer:"would"
          },
          {
            id:"b2",
            options:[
              "passwords",
              "postcards",
              "passports"
            ],
            answer:"passwords"
          },
          {
            id:"b3",
            options:[
              "SIM card",
              "gym card",
              "sim carded"
            ],
            answer:"SIM card"
          },
          {
            id:"b4",
            options:[
              "police",
              "policy",
              "polish"
            ],
            answer:"police"
          }
        ]
      },
      quizBank:[
        {
          prompt:"Correct tense",
          question:"Choose the best sentence:",
          options:[
            {
              t:"If my phone was stolen, I would lock it remotely.",
              ok:true,
              why:"Correct."
            },
            {
              t:"If my phone is stolen, I would lock it remotely.",
              ok:false,
              why:"Mixed conditional; for hypothetical use was + would."
            },
            {
              t:"If my phone was stolen, I will lock it remotely.",
              ok:false,
              why:"Use would for hypothetical."
            }
          ]
        },
        {
          prompt:"Best first action",
          question:"What should you do first?",
          options:[
            {
              t:"Lock it remotely / secure accounts.",
              ok:true,
              why:"Protects your data quickly."
            },
            {
              t:"Post about it on social media.",
              ok:false,
              why:"Not priority."
            },
            {
              t:"Buy a new phone immediately without blocking SIM.",
              ok:false,
              why:"Security first."
            }
          ]
        },
        {
          prompt:"Vocabulary",
          question:"A “SIM card” is…",
          options:[
            {
              t:"the chip that connects your phone to the network",
              ok:true,
              why:"Correct."
            },
            {
              t:"a travel guide book",
              ok:false,
              why:"No."
            },
            {
              t:"a hotel key",
              ok:false,
              why:"No."
            }
          ]
        }
      ]
    },
    {
      id:"second_food_poisoning",
      title:"What if…? — Food poisoning on a trip",
      desc:"Explain steps calmly + ask for help.",
      tags:[
        "second",
        "whatif",
        "health",
        "travel",
        "problem"
      ],
      recommended:60,
      speakPrompt:"What would you do if you got food poisoning during a trip?",
      dialogue:[
        {
          sp:"Examiner",
          en:"What would you do if you got food poisoning while travelling?",
          fr:"Que feriez-vous si vous aviez une intoxication alimentaire en voyage ?"
        },
        {
          sp:"Candidate",
          en:"If I got food poisoning, I’d drink water, rest, and avoid heavy food.",
          fr:"Si j’avais une intoxication, je boirais de l’eau, je me reposerais et j’éviterais les repas lourds."
        },
        {
          sp:"Examiner",
          en:"When would you seek help?",
          fr:"Quand demander de l’aide ?"
        },
        {
          sp:"Candidate",
          en:"If symptoms were severe or lasted more than a day, I’d call a doctor or local medical service.",
          fr:"Si les symptômes étaient forts ou duraient plus d’un jour, j’appellerais un médecin."
        },
        {
          sp:"Examiner",
          en:"How would you communicate?",
          fr:"Comment expliquer ?"
        },
        {
          sp:"Candidate",
          en:"I’d explain symptoms clearly and ask for advice or medicine. And I’d inform my hotel if I needed support.",
          fr:"J’expliquerais clairement et je demanderais conseil ou un médicament. Et j’informerais l’hôtel si besoin."
        }
      ],
      writing:{
        subject:"Subject: Need medical advice (food poisoning)",
        body:`Hello,

If I got food poisoning during a trip, I would rest, stay hydrated, and avoid heavy food.
If symptoms were severe or lasted more than 24 hours, I would contact a doctor or medical service.

Could you please advise the next steps?

Thank you,
[Your Name]`
      },
      vocab:[
        {
          icon:"🤢",
          word:"food poisoning",
          def:"illness after eating bad food",
          fr:"intoxication alimentaire"
        },
        {
          icon:"💧",
          word:"to stay hydrated",
          def:"drink enough water",
          fr:"rester hydraté"
        },
        {
          icon:"🩺",
          word:"symptoms",
          def:"signs of illness",
          fr:"symptômes"
        },
        {
          icon:"☎️",
          word:"to call a doctor",
          def:"contact medical help",
          fr:"appeler un médecin"
        },
        {
          icon:"🏨",
          word:"to inform the hotel",
          def:"tell the hotel staff",
          fr:"informer l’hôtel"
        }
      ],
      builderModel:[
        {
          step:1,
          text:"If I got food poisoning, I would rest, drink water, and avoid heavy food."
        },
        {
          step:2,
          text:"If symptoms were severe or lasted more than 24 hours, I would call a doctor for advice."
        },
        {
          step:3,
          text:"Finally, I would communicate clearly and ask for the right medicine or support."
        }
      ],
      fill:{
        template:"If I {b0} food poisoning, I {b1} rest and stay {b2}. If symptoms {b3} severe, I would call a {b4}.",
        blanks:[
          {
            id:"b0",
            options:[
              "got",
              "get",
              "would get"
            ],
            answer:"got"
          },
          {
            id:"b1",
            options:[
              "would",
              "will",
              "did"
            ],
            answer:"would"
          },
          {
            id:"b2",
            options:[
              "hydrated",
              "heated",
              "hidden"
            ],
            answer:"hydrated"
          },
          {
            id:"b3",
            options:[
              "were",
              "are",
              "will be"
            ],
            answer:"were"
          },
          {
            id:"b4",
            options:[
              "doctor",
              "driver",
              "doctorate"
            ],
            answer:"doctor"
          }
        ]
      },
      quizBank:[
        {
          prompt:"2nd conditional",
          question:"Choose the correct structure:",
          options:[
            {
              t:"If I got food poisoning, I would call a doctor.",
              ok:true,
              why:"Correct hypothetical."
            },
            {
              t:"If I get food poisoning, I would call a doctor.",
              ok:false,
              why:"Mixed; for hypothetical use got + would."
            },
            {
              t:"If I got food poisoning, I call a doctor.",
              ok:false,
              why:"Missing would."
            }
          ]
        },
        {
          prompt:"Best condition phrase",
          question:"You talk about a possible serious situation. Choose the best:",
          options:[
            {
              t:"If symptoms were severe…",
              ok:true,
              why:"Good condition clause."
            },
            {
              t:"If symptoms are severe yesterday…",
              ok:false,
              why:"Time mismatch."
            },
            {
              t:"If symptoms will severe…",
              ok:false,
              why:"Missing 'be'."
            }
          ]
        },
        {
          prompt:"Vocabulary",
          question:"“Symptoms” means…",
          options:[
            {
              t:"signs of illness",
              ok:true,
              why:"Correct."
            },
            {
              t:"a type of sandwich",
              ok:false,
              why:"No."
            },
            {
              t:"train schedules",
              ok:false,
              why:"No."
            }
          ]
        }
      ]
    },
    {
      id:"first_rainy_day_plan",
      title:"If… (real) — If it rains tomorrow",
      desc:"Use 1st conditional: If it rains, I’ll…",
      tags:[
        "first",
        "real",
        "travel",
        "fun"
      ],
      recommended:45,
      speakPrompt:"If it rains tomorrow during your city trip, what will you do?",
      dialogue:[
        {
          sp:"Examiner",
          en:"If it rains tomorrow, what will you do?",
          fr:"S’il pleut demain, que ferez-vous ?"
        },
        {
          sp:"Candidate",
          en:"If it rains, I’ll switch to indoor plans like museums or a nice café.",
          fr:"S’il pleut, je passerai à des plans en intérieur comme les musées ou un café sympa."
        },
        {
          sp:"Examiner",
          en:"And transport?",
          fr:"Et le transport ?"
        },
        {
          sp:"Candidate",
          en:"I’ll use public transport and carry a small umbrella. If the rain stops, I’ll go back to walking.",
          fr:"Je prendrai les transports et un petit parapluie. Si la pluie s’arrête, je marcherai à nouveau."
        }
      ],
      writing:{
        subject:"Subject: Rain plan for tomorrow",
        body:`Hi!

If it rains tomorrow, I’ll do indoor activities (museum + café).
If it stops, I’ll walk around again.

See you!`
      },
      vocab:[
        {
          icon:"🌧️",
          word:"to rain",
          def:"water falls from the sky",
          fr:"pleuvoir"
        },
        {
          icon:"🏛️",
          word:"indoor plans",
          def:"activities inside a building",
          fr:"plans en intérieur"
        },
        {
          icon:"☂️",
          word:"umbrella",
          def:"rain protection",
          fr:"parapluie"
        },
        {
          icon:"🚇",
          word:"public transport",
          def:"metro/bus/tram",
          fr:"transports en commun"
        },
        {
          icon:"🚶",
          word:"to walk around",
          def:"explore on foot",
          fr:"se balader"
        }
      ],
      builderModel:[
        {
          step:1,
          text:"If it rains tomorrow, I’ll switch to indoor plans like a museum or a café."
        },
        {
          step:2,
          text:"I’ll use public transport and bring an umbrella to stay comfortable."
        },
        {
          step:3,
          text:"If the rain stops, I’ll go back to walking around and exploring outside."
        }
      ],
      fill:{
        template:"If it {b0} tomorrow, I’{b1} go to a {b2} or a café. I’{b3} use public transport and bring an {b4}.",
        blanks:[
          {
            id:"b0",
            options:[
              "rains",
              "rain",
              "rained"
            ],
            answer:"rains"
          },
          {
            id:"b1",
            options:[
              "ll",
              "d",
              "m"
            ],
            answer:"ll"
          },
          {
            id:"b2",
            options:[
              "museum",
              "music",
              "muscle"
            ],
            answer:"museum"
          },
          {
            id:"b3",
            options:[
              "ll",
              "re",
              "ve"
            ],
            answer:"ll"
          },
          {
            id:"b4",
            options:[
              "umbrella",
              "ambrella",
              "umbre"
            ],
            answer:"umbrella"
          }
        ]
      },
      quizBank:[
        {
          prompt:"1st conditional",
          question:"Choose the correct sentence:",
          options:[
            {
              t:"If it rains, I’ll go to a museum.",
              ok:true,
              why:"Correct (real future)."
            },
            {
              t:"If it rained, I’ll go to a museum.",
              ok:false,
              why:"Tenses don't match."
            },
            {
              t:"If it rains, I would go to a museum.",
              ok:false,
              why:"That’s more hypothetical."
            }
          ]
        },
        {
          prompt:"Vocabulary",
          question:"An “umbrella” is…",
          options:[
            {
              t:"a tool to protect you from rain",
              ok:true,
              why:"Correct."
            },
            {
              t:"a type of sandwich",
              ok:false,
              why:"No."
            },
            {
              t:"a train ticket",
              ok:false,
              why:"No."
            }
          ]
        },
        {
          prompt:"Fluency",
          question:"Which connector sounds natural?",
          options:[
            {
              t:"If the rain stops, I’ll go back to walking.",
              ok:true,
              why:"Natural conditional link."
            },
            {
              t:"If the rain stop, I go back walking.",
              ok:false,
              why:"Missing 's' and tense."
            },
            {
              t:"If rain stopped, I will walking.",
              ok:false,
              why:"Incorrect."
            }
          ]
        }
      ]
    },
    {
      id:"first_flight_delayed",
      title:"If… (real) — If your flight is delayed",
      desc:"Use 1st conditional + polite solutions.",
      tags:[
        "first",
        "real",
        "travel",
        "problem"
      ],
      recommended:60,
      speakPrompt:"If your flight is delayed at the airport, what will you do?",
      dialogue:[
        {
          sp:"Examiner",
          en:"If your flight is delayed, what will you do at the airport?",
          fr:"Si votre vol est retardé, que ferez-vous à l’aéroport ?"
        },
        {
          sp:"Candidate",
          en:"If my flight is delayed, I’ll check updates, then ask the airline about the new boarding time.",
          fr:"Si mon vol est retardé, je vérifierai les infos et je demanderai l’heure d’embarquement."
        },
        {
          sp:"Examiner",
          en:"And if it’s a long delay?",
          fr:"Et si c’est long ?"
        },
        {
          sp:"Candidate",
          en:"If it’s more than a few hours, I’ll ask about food vouchers or rebooking options.",
          fr:"Si c’est plus que quelques heures, je demanderai des bons repas ou un rebooking."
        }
      ],
      writing:{
        subject:"Subject: Flight delay — request for options",
        body:`Hello,

If my flight is delayed, I’ll check the updates and ask the airline for the new boarding time.
If the delay is long, I’ll ask about rebooking options or vouchers.

Thank you,
[Your Name]`
      },
      vocab:[
        {
          icon:"🛫",
          word:"flight delay",
          def:"plane leaves later than planned",
          fr:"retard de vol"
        },
        {
          icon:"📢",
          word:"updates",
          def:"new information",
          fr:"mises à jour / infos"
        },
        {
          icon:"🧾",
          word:"voucher",
          def:"coupon for food/hotel",
          fr:"bon / voucher"
        },
        {
          icon:"🔁",
          word:"rebooking",
          def:"changing to another flight",
          fr:"rebooking"
        },
        {
          icon:"🧍",
          word:"boarding time",
          def:"time you enter the plane",
          fr:"heure d’embarquement"
        }
      ],
      builderModel:[
        {
          step:1,
          text:"If my flight is delayed, I’ll check updates and ask the airline for the new boarding time."
        },
        {
          step:2,
          text:"If it’s a long delay, I’ll ask about rebooking options and any vouchers."
        },
        {
          step:3,
          text:"Finally, I’ll message people I’m meeting and adjust my plan calmly."
        }
      ],
      fill:{
        template:"If my flight {b0} delayed, I’{b1} check {b2} and ask for the new {b3} time. If it’s long, I’{b4} ask about rebooking.",
        blanks:[
          {
            id:"b0",
            options:[
              "is",
              "was",
              "were"
            ],
            answer:"is"
          },
          {
            id:"b1",
            options:[
              "ll",
              "d",
              "m"
            ],
            answer:"ll"
          },
          {
            id:"b2",
            options:[
              "updates",
              "upsets",
              "uptakes"
            ],
            answer:"updates"
          },
          {
            id:"b3",
            options:[
              "boarding",
              "boring",
              "board"
            ],
            answer:"boarding"
          },
          {
            id:"b4",
            options:[
              "ll",
              "re",
              "ve"
            ],
            answer:"ll"
          }
        ]
      },
      quizBank:[
        {
          prompt:"Real future",
          question:"Choose the best sentence:",
          options:[
            {
              t:"If my flight is delayed, I’ll ask about options.",
              ok:true,
              why:"Correct 1st conditional."
            },
            {
              t:"If my flight was delayed, I’ll ask about options.",
              ok:false,
              why:"Tense mismatch."
            },
            {
              t:"If my flight is delayed, I would ask about options.",
              ok:false,
              why:"More hypothetical."
            }
          ]
        },
        {
          prompt:"Best question",
          question:"What is a polite request to the airline?",
          options:[
            {
              t:"Could you tell me the new boarding time, please?",
              ok:true,
              why:"Polite and clear."
            },
            {
              t:"Tell me now.",
              ok:false,
              why:"Too direct."
            },
            {
              t:"You are late.",
              ok:false,
              why:"Not a request."
            }
          ]
        },
        {
          prompt:"Vocabulary",
          question:"A “voucher” is…",
          options:[
            {
              t:"a coupon for food/hotel",
              ok:true,
              why:"Correct."
            },
            {
              t:"a passport scan",
              ok:false,
              why:"No."
            },
            {
              t:"a suitcase",
              ok:false,
              why:"No."
            }
          ]
        }
      ]
    },
    {
      id:"first_restaurant_full",
      title:"If… (real) — If the restaurant is full",
      desc:"Real options + polite negotiation.",
      tags:[
        "first",
        "real",
        "restaurant",
        "social"
      ],
      recommended:45,
      speakPrompt:"If the restaurant is full, what will you do?",
      dialogue:[
        {
          sp:"Examiner",
          en:"If the restaurant is fully booked, what will you do?",
          fr:"Si le restaurant est complet, que ferez-vous ?"
        },
        {
          sp:"Candidate",
          en:"If it’s full, I’ll ask if there’s a waiting list or a table later.",
          fr:"S’il est complet, je demanderai une liste d’attente ou une table plus tard."
        },
        {
          sp:"Examiner",
          en:"And if you’re in a hurry?",
          fr:"Et si vous êtes pressé ?"
        },
        {
          sp:"Candidate",
          en:"Then I’ll choose another place nearby or take food to go.",
          fr:"Alors je choisirai un autre endroit à côté ou je prendrai à emporter."
        }
      ],
      writing:{
        subject:"Subject: Plan B for dinner",
        body:`If the restaurant is full, I’ll ask for a table later or join the waiting list.
If that doesn’t work, I’ll choose another place nearby or get takeaway.`
      },
      vocab:[
        {
          icon:"📅",
          word:"fully booked",
          def:"no tables available",
          fr:"complet"
        },
        {
          icon:"🧍",
          word:"waiting list",
          def:"queue for a table",
          fr:"liste d’attente"
        },
        {
          icon:"⏳",
          word:"table later",
          def:"a later reservation time",
          fr:"table plus tard"
        },
        {
          icon:"🥡",
          word:"takeaway / to go",
          def:"food you take with you",
          fr:"à emporter"
        },
        {
          icon:"📍",
          word:"nearby",
          def:"close to this place",
          fr:"à proximité"
        }
      ],
      builderModel:[
        {
          step:1,
          text:"If the restaurant is full, I’ll ask about the waiting list or a table later."
        },
        {
          step:2,
          text:"If there’s no option, I’ll choose another place nearby to save time."
        },
        {
          step:3,
          text:"Or I’ll get takeaway and keep the evening easy and relaxed."
        }
      ],
      fill:{
        template:"If the restaurant is {b0}, I’{b1} ask for the {b2} list. If there’s no table, I’{b3} go somewhere {b4}.",
        blanks:[
          {
            id:"b0",
            options:[
              "full",
              "fill",
              "fell"
            ],
            answer:"full"
          },
          {
            id:"b1",
            options:[
              "ll",
              "d",
              "m"
            ],
            answer:"ll"
          },
          {
            id:"b2",
            options:[
              "waiting",
              "writing",
              "wishing"
            ],
            answer:"waiting"
          },
          {
            id:"b3",
            options:[
              "ll",
              "re",
              "ve"
            ],
            answer:"ll"
          },
          {
            id:"b4",
            options:[
              "nearby",
              "near",
              "nearly"
            ],
            answer:"nearby"
          }
        ]
      },
      quizBank:[
        {
          prompt:"Polite question",
          question:"Choose the best sentence:",
          options:[
            {
              t:"Is there a waiting list, please?",
              ok:true,
              why:"Polite and simple."
            },
            {
              t:"Give me a table now.",
              ok:false,
              why:"Too direct."
            },
            {
              t:"I want a table because I said so.",
              ok:false,
              why:"Rude."
            }
          ]
        },
        {
          prompt:"1st conditional",
          question:"Correct form:",
          options:[
            {
              t:"If it’s full, I’ll choose another place.",
              ok:true,
              why:"Correct."
            },
            {
              t:"If it was full, I’ll choose another place.",
              ok:false,
              why:"Mismatch."
            },
            {
              t:"If it’s full, I would choose another place.",
              ok:false,
              why:"More hypothetical."
            }
          ]
        },
        {
          prompt:"Vocabulary",
          question:"“Takeaway” means…",
          options:[
            {
              t:"food you take with you",
              ok:true,
              why:"Correct."
            },
            {
              t:"a phone call",
              ok:false,
              why:"No."
            },
            {
              t:"a hotel room",
              ok:false,
              why:"No."
            }
          ]
        }
      ]
    },
    {
      id:"third_booked_earlier",
      title:"Regret — If I had booked earlier…",
      desc:"Use 3rd conditional: If I had…, I would have…",
      tags:[
        "third",
        "regret",
        "travel"
      ],
      recommended:45,
      speakPrompt:"Think about a travel mistake: If you had booked earlier, what would have happened?",
      dialogue:[
        {
          sp:"Examiner",
          en:"If you had booked earlier, what would have been different?",
          fr:"Si vous aviez réservé plus tôt, qu’est-ce qui aurait changé ?"
        },
        {
          sp:"Candidate",
          en:"If I had booked earlier, I would have paid less and had more choices.",
          fr:"Si j’avais réservé plus tôt, j’aurais payé moins et eu plus de choix."
        },
        {
          sp:"Examiner",
          en:"What would you do next time?",
          fr:"Et la prochaine fois ?"
        },
        {
          sp:"Candidate",
          en:"Next time, I’ll set a reminder and book as soon as I know my dates.",
          fr:"La prochaine fois, je mettrai un rappel et je réserverai dès que j’ai mes dates."
        }
      ],
      writing:{
        subject:"Subject: Lesson learned (booking)",
        body:`If I had booked earlier, I would have paid less and had more options.
Next time, I’ll book as soon as my dates are confirmed.`
      },
      vocab:[
        {
          icon:"📉",
          word:"to pay less",
          def:"spend less money",
          fr:"payer moins"
        },
        {
          icon:"✅",
          word:"more choices",
          def:"more available options",
          fr:"plus de choix"
        },
        {
          icon:"⏰",
          word:"a reminder",
          def:"alert on your phone",
          fr:"rappel"
        },
        {
          icon:"📅",
          word:"confirmed dates",
          def:"fixed/decided dates",
          fr:"dates confirmées"
        },
        {
          icon:"🧠",
          word:"lesson learned",
          def:"something you learned from a mistake",
          fr:"leçon apprise"
        }
      ],
      builderModel:[
        {
          step:1,
          text:"If I had booked earlier, I would have paid less and had more choices."
        },
        {
          step:2,
          text:"I waited too long, so prices went up and options disappeared."
        },
        {
          step:3,
          text:"Next time, I’ll book earlier and set a reminder to avoid the same mistake."
        }
      ],
      fill:{
        template:"If I {b0} booked earlier, I {b1} have paid less. I {b2} have had more {b3}. Next time, I’ll set a {b4}.",
        blanks:[
          {
            id:"b0",
            options:[
              "had",
              "have",
              "would"
            ],
            answer:"had"
          },
          {
            id:"b1",
            options:[
              "would",
              "will",
              "can"
            ],
            answer:"would"
          },
          {
            id:"b2",
            options:[
              "would",
              "will",
              "did"
            ],
            answer:"would"
          },
          {
            id:"b3",
            options:[
              "choices",
              "chances",
              "changes"
            ],
            answer:"choices"
          },
          {
            id:"b4",
            options:[
              "reminder",
              "remainder",
              "remember"
            ],
            answer:"reminder"
          }
        ]
      },
      quizBank:[
        {
          prompt:"3rd conditional",
          question:"Choose the correct sentence:",
          options:[
            {
              t:"If I had booked earlier, I would have paid less.",
              ok:true,
              why:"Correct 3rd conditional."
            },
            {
              t:"If I booked earlier, I would have paid less.",
              ok:false,
              why:"Missing 'had'."
            },
            {
              t:"If I had booked earlier, I would pay less.",
              ok:false,
              why:"Wrong time frame."
            }
          ]
        },
        {
          prompt:"Meaning",
          question:"This sentence describes…",
          options:[
            {
              t:"a past situation that cannot be changed",
              ok:true,
              why:"Exactly."
            },
            {
              t:"a plan for tomorrow",
              ok:false,
              why:"No."
            },
            {
              t:"a daily habit",
              ok:false,
              why:"No."
            }
          ]
        },
        {
          prompt:"Next time",
          question:"Which is a good next‑time plan?",
          options:[
            {
              t:"I’ll set a reminder and book earlier.",
              ok:true,
              why:"Practical."
            },
            {
              t:"I’ll never travel again.",
              ok:false,
              why:"Too extreme."
            },
            {
              t:"I’ll blame the airline.",
              ok:false,
              why:"Not helpful."
            }
          ]
        }
      ]
    },
    {
      id:"third_missed_train_address",
      title:"Regret — If I had checked the address…",
      desc:"Regret + prevention strategy.",
      tags:[
        "third",
        "regret",
        "travel",
        "problem"
      ],
      recommended:45,
      speakPrompt:"If you had checked the address properly, what would have happened?",
      dialogue:[
        {
          sp:"Examiner",
          en:"Tell me about a travel mistake. What would you have done differently?",
          fr:"Parlez d’une erreur en voyage. Qu’auriez-vous fait autrement ?"
        },
        {
          sp:"Candidate",
          en:"If I had checked the address, I wouldn’t have gone to the wrong station.",
          fr:"Si j’avais vérifié l’adresse, je ne serais pas allé à la mauvaise gare."
        },
        {
          sp:"Examiner",
          en:"Result?",
          fr:"Résultat ?"
        },
        {
          sp:"Candidate",
          en:"I would have caught my train on time. Next time, I’ll double‑check on a map the night before.",
          fr:"J’aurais pris mon train à l’heure. La prochaine fois, je vérifierai sur une carte la veille."
        }
      ],
      writing:{
        subject:"Subject: What I learned (station mistake)",
        body:`If I had checked the address, I wouldn’t have gone to the wrong station.
I would have caught my train on time. Next time, I’ll double‑check the map the night before.`
      },
      vocab:[
        {
          icon:"🗺️",
          word:"to double‑check",
          def:"check again to be sure",
          fr:"revérifier"
        },
        {
          icon:"🚉",
          word:"station",
          def:"train station",
          fr:"gare"
        },
        {
          icon:"❌",
          word:"the wrong place",
          def:"incorrect location",
          fr:"mauvais endroit"
        },
        {
          icon:"⏱️",
          word:"on time",
          def:"not late",
          fr:"à l’heure"
        },
        {
          icon:"🌙",
          word:"the night before",
          def:"previous evening",
          fr:"la veille"
        }
      ],
      builderModel:[
        {
          step:1,
          text:"If I had checked the address, I wouldn’t have gone to the wrong station."
        },
        {
          step:2,
          text:"I would have arrived on time and avoided stress and extra cost."
        },
        {
          step:3,
          text:"Next time, I’ll double‑check the map the night before and leave earlier."
        }
      ],
      fill:{
        template:"If I {b0} checked the address, I {b1} have gone to the wrong station. I {b2} have caught my train {b3}. Next time, I’ll {b4}-check the map.",
        blanks:[
          {
            id:"b0",
            options:[
              "had",
              "have",
              "would"
            ],
            answer:"had"
          },
          {
            id:"b1",
            options:[
              "wouldn’t",
              "won’t",
              "didn’t"
            ],
            answer:"wouldn’t"
          },
          {
            id:"b2",
            options:[
              "would",
              "will",
              "can"
            ],
            answer:"would"
          },
          {
            id:"b3",
            options:[
              "on time",
              "in time",
              "at time"
            ],
            answer:"on time"
          },
          {
            id:"b4",
            options:[
              "double",
              "triple",
              "single"
            ],
            answer:"double"
          }
        ]
      },
      quizBank:[
        {
          prompt:"3rd conditional",
          question:"Pick the correct form:",
          options:[
            {
              t:"If I had checked the address, I wouldn’t have missed the train.",
              ok:true,
              why:"Correct."
            },
            {
              t:"If I checked the address, I wouldn’t have missed the train.",
              ok:false,
              why:"Needs 'had'."
            },
            {
              t:"If I had checked the address, I won’t miss the train.",
              ok:false,
              why:"Wrong time frame."
            }
          ]
        },
        {
          prompt:"Prevention",
          question:"Best prevention plan:",
          options:[
            {
              t:"Double‑check the map the night before.",
              ok:true,
              why:"Smart."
            },
            {
              t:"Leave without checking anything.",
              ok:false,
              why:"Risky."
            },
            {
              t:"Ask random people only.",
              ok:false,
              why:"Not reliable."
            }
          ]
        },
        {
          prompt:"Vocabulary",
          question:"“On time” means…",
          options:[
            {
              t:"not late",
              ok:true,
              why:"Correct."
            },
            {
              t:"very expensive",
              ok:false,
              why:"No."
            },
            {
              t:"far away",
              ok:false,
              why:"No."
            }
          ]
        }
      ]
    },
    {
      id:"third_bad_hotel_reviews",
      title:"Regret — If I had read the reviews…",
      desc:"Regret + better decision making.",
      tags:[
        "third",
        "regret",
        "hotel",
        "travel"
      ],
      recommended:45,
      speakPrompt:"If you had read reviews, what would have been different about your hotel choice?",
      dialogue:[
        {
          sp:"Examiner",
          en:"If you had read the reviews, what would have happened?",
          fr:"Si vous aviez lu les avis, qu’est-ce qui se serait passé ?"
        },
        {
          sp:"Candidate",
          en:"If I had read the reviews, I would have chosen a different hotel.",
          fr:"Si j’avais lu les avis, j’aurais choisi un autre hôtel."
        },
        {
          sp:"Examiner",
          en:"What did you learn?",
          fr:"Qu’avez-vous appris ?"
        },
        {
          sp:"Candidate",
          en:"I learned to check recent reviews and location. Next time, I’ll compare two options before booking.",
          fr:"J’ai appris à vérifier les avis récents et l’emplacement. La prochaine fois, je comparerai deux options avant de réserver."
        }
      ],
      writing:{
        subject:"Subject: Hotel choice — lesson learned",
        body:`If I had read the reviews, I would have chosen a different hotel.
Next time, I’ll check recent reviews and location, then compare at least two options before booking.`
      },
      vocab:[
        {
          icon:"⭐",
          word:"reviews",
          def:"ratings/comments online",
          fr:"avis"
        },
        {
          icon:"📍",
          word:"location",
          def:"where the place is",
          fr:"emplacement"
        },
        {
          icon:"⚖️",
          word:"to compare",
          def:"look at differences",
          fr:"comparer"
        },
        {
          icon:"🛏️",
          word:"to book",
          def:"reserve a room",
          fr:"réserver"
        },
        {
          icon:"🧠",
          word:"to learn",
          def:"understand from experience",
          fr:"apprendre"
        }
      ],
      builderModel:[
        {
          step:1,
          text:"If I had read the reviews, I would have chosen a different hotel."
        },
        {
          step:2,
          text:"I didn’t check enough, so the location and comfort were disappointing."
        },
        {
          step:3,
          text:"Next time, I’ll read recent reviews and compare two options before I book."
        }
      ],
      fill:{
        template:"If I {b0} read the reviews, I {b1} have chosen a different hotel. Next time, I’ll check {b2} reviews and the {b3}, then {b4} two options.",
        blanks:[
          {
            id:"b0",
            options:[
              "had",
              "have",
              "would"
            ],
            answer:"had"
          },
          {
            id:"b1",
            options:[
              "would",
              "will",
              "can"
            ],
            answer:"would"
          },
          {
            id:"b2",
            options:[
              "recent",
              "receipt",
              "rescue"
            ],
            answer:"recent"
          },
          {
            id:"b3",
            options:[
              "location",
              "locomotion",
              "locution"
            ],
            answer:"location"
          },
          {
            id:"b4",
            options:[
              "compare",
              "complete",
              "compete"
            ],
            answer:"compare"
          }
        ]
      },
      quizBank:[
        {
          prompt:"3rd conditional",
          question:"Choose the correct sentence:",
          options:[
            {
              t:"If I had read the reviews, I would have chosen a different hotel.",
              ok:true,
              why:"Correct."
            },
            {
              t:"If I read the reviews, I would have chosen a different hotel.",
              ok:false,
              why:"Needs 'had'."
            },
            {
              t:"If I had read the reviews, I would choose a different hotel.",
              ok:false,
              why:"Wrong time frame."
            }
          ]
        },
        {
          prompt:"Better strategy",
          question:"Best next step next time:",
          options:[
            {
              t:"Compare two options before booking.",
              ok:true,
              why:"Smart decision making."
            },
            {
              t:"Book the first hotel you see.",
              ok:false,
              why:"Risky."
            },
            {
              t:"Never read anything.",
              ok:false,
              why:"Not helpful."
            }
          ]
        },
        {
          prompt:"Vocabulary",
          question:"“Location” means…",
          options:[
            {
              t:"where the place is",
              ok:true,
              why:"Correct."
            },
            {
              t:"the hotel menu",
              ok:false,
              why:"No."
            },
            {
              t:"your passport number",
              ok:false,
              why:"No."
            }
          ]
        }
      ]
    }
  ];



  // UI refs
  var topicGrid = $("#topicGrid");
  var searchEl = $("#search");

  var activeTopicPill = $("#activeTopicPill");
  var dialogueWrap = $("#dialogueWrap");
  var emailWrap = $("#emailWrap");

  var quizPrompt = $("#quizPrompt");
  var quizOptions = $("#quizOptions");
  var quizFeedback = $("#quizFeedback");

  var builderFeedback = $("#builderFeedback");
  var blockPool = $("#blockPool");
  var answerLane = $("#answerLane");

  var fillText = $("#fillText");
  var fillFeedback = $("#fillFeedback");

  var flashGrid = $("#flashGrid");

  var timerNum = $("#timerNum");
  var recommendedTimeEl = $("#recommendedTime");
  var speakPromptEl = $("#speakPrompt");
  var chkSpokeFull = $("#chkSpokeFullTime");
  var timedFeedback = $("#timedFeedback");

  $("#maxTop").textContent = "30";
  $("#maxBottom").textContent = "30";
  $("#masteredMax").textContent = String(TOPICS.length);

  function getActiveTopic(){
    var id = state.activeTopicId || TOPICS[0].id;
    return TOPICS.find(function(t){ return t.id === id; }) || TOPICS[0];
  }

  // Map
  var filterState = "all";
  function renderMap(){
    if (!topicGrid) return;
    topicGrid.innerHTML = "";
    var q = (searchEl && searchEl.value ? searchEl.value.trim().toLowerCase() : "");
    var topics = TOPICS.filter(function(t){
      var matchesFilter = (filterState === "all") || t.tags.indexOf(filterState) >= 0;
      var hay = (t.title + " " + t.desc + " " + t.tags.join(" ")).toLowerCase();
      var matchesSearch = !q || hay.indexOf(q) >= 0;
      return matchesFilter && matchesSearch;
    });

    topics.forEach(function(t){
      var card = document.createElement("button");
      card.type = "button";
      card.className = "topic" + (t.id === state.activeTopicId ? " is-active" : "");
      card.setAttribute("aria-label", "Open topic: " + t.title);

      var title = document.createElement("div");
      title.className = "topic__t";
      title.textContent = t.title;

      var desc = document.createElement("div");
      desc.className = "topic__d";
      desc.textContent = t.desc;

      var tags = document.createElement("div");
      tags.className = "tags";
      t.tags.forEach(function(tag){
        var el = document.createElement("span");
        el.className = "tag";
        el.textContent = tag;
        tags.appendChild(el);
      });

      card.appendChild(title);
      card.appendChild(desc);
      card.appendChild(tags);

      card.addEventListener("click", function(){
        state.activeTopicId = t.id;
        LS.set(KEY_STATE, state);
        renderAll();
        var models = $("#models");
        if (models) models.scrollIntoView({behavior:"smooth", block:"start"});
      });

      topicGrid.appendChild(card);
    });
  }

  $all(".chip").forEach(function(ch){
    ch.addEventListener("click", function(){
      $all(".chip").forEach(function(x){ x.classList.remove("is-on"); });
      ch.classList.add("is-on");
      filterState = ch.getAttribute("data-filter") || "all";
      renderMap();
    });
  });
  searchEl && searchEl.addEventListener("input", renderMap);

  // Models
  var dialogueHidden = false;
  var emailHidden = false;

  $("#btnToggleDialogue") && $("#btnToggleDialogue").addEventListener("click", function(){
    dialogueHidden = !dialogueHidden;
    dialogueWrap.style.display = dialogueHidden ? "none" : "";
  });
  $("#btnToggleEmail") && $("#btnToggleEmail").addEventListener("click", function(){
    emailHidden = !emailHidden;
    emailWrap.style.display = emailHidden ? "none" : "";
  });

  $("#btnListenDialogue") && $("#btnListenDialogue").addEventListener("click", function(){
    var t = getActiveTopic();
    speak(t.dialogue.map(function(l){ return l.sp + ". " + l.en; }).join(" "));
  });

  $("#btnListenEmail") && $("#btnListenEmail").addEventListener("click", function(){
    var t = getActiveTopic();
    speak(t.writing.subject + ". " + t.writing.body.replace(/\n/g, " "));
  });

  $("#btnCopyEmail") && $("#btnCopyEmail").addEventListener("click", function(){
    var t = getActiveTopic();
    copyToClipboard(t.writing.subject + "\n\n" + t.writing.body);
  });

  function renderModels(){
    var t = getActiveTopic();
    activeTopicPill.textContent = "Topic: " + t.title;

    dialogueWrap.innerHTML = "";
    var d = document.createElement("div");
    d.className = "dialogue";

    t.dialogue.forEach(function(line){
      var row = document.createElement("div");
      row.className = "line";

      var sp = document.createElement("div");
      sp.className = "speaker";
      sp.textContent = line.sp;

      var txt = document.createElement("div");
      txt.className = "text";
      txt.innerHTML = escapeHtml(line.en) + (line.fr ? "<div class='fr'>FR: " + escapeHtml(line.fr) + "</div>" : "");

      var btn = document.createElement("button");
      btn.className = "iconbtn";
      btn.type = "button";
      btn.textContent = "🔊";
      btn.title = "Listen";
      btn.addEventListener("click", function(){ speak(line.en); });

      row.appendChild(sp);
      row.appendChild(txt);
      row.appendChild(btn);
      d.appendChild(row);
    });

    dialogueWrap.appendChild(d);

    emailWrap.innerHTML = "";
    var em = document.createElement("div");
    em.className = "email";
    var subj = document.createElement("div");
    subj.className = "subj";
    subj.textContent = t.writing.subject;
    var pre = document.createElement("pre");
    pre.textContent = t.writing.body;
    em.appendChild(subj);
    em.appendChild(pre);
    emailWrap.appendChild(em);
  }

  // Quiz
  var currentQuiz = null;
  var selectedOptIndex = -1;

  function newQuiz(){
    var t = getActiveTopic();
    var bank = t.quizBank || [];
    if (!bank.length){
      currentQuiz = null;
      quizPrompt.textContent = "No quiz for this topic.";
      quizOptions.innerHTML = "";
      quizFeedback.className = "feedback";
      quizFeedback.textContent = "";
      return;
    }
    currentQuiz = bank[Math.floor(Math.random()*bank.length)];
    selectedOptIndex = -1;
    quizFeedback.className = "feedback";
    quizFeedback.textContent = "";

    quizPrompt.textContent = currentQuiz.prompt + " " + currentQuiz.question;
    quizOptions.innerHTML = "";

    currentQuiz.options.forEach(function(o, idx){
      var lab = document.createElement("label");
      lab.className = "opt";

      var radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "quizOpt";
      radio.value = String(idx);
      radio.addEventListener("change", function(){ selectedOptIndex = idx; });

      var text = document.createElement("div");
      text.textContent = o.t;

      lab.appendChild(radio);
      lab.appendChild(text);
      quizOptions.appendChild(lab);
    });
  }

  $("#btnNewQuiz") && $("#btnNewQuiz").addEventListener("click", newQuiz);
  $("#btnResetQuiz") && $("#btnResetQuiz").addEventListener("click", newQuiz);
  $("#btnListenQuiz") && $("#btnListenQuiz").addEventListener("click", function(){
    if (!currentQuiz) return;
    speak(currentQuiz.question);
  });

  $("#btnCheckQuiz") && $("#btnCheckQuiz").addEventListener("click", function(){
    if (!currentQuiz){
      quizFeedback.className = "feedback warn";
      quizFeedback.textContent = "Select a topic first.";
      return;
    }
    if (selectedOptIndex < 0){
      quizFeedback.className = "feedback warn";
      quizFeedback.textContent = "Choose an option first.";
      return;
    }
    var opt = currentQuiz.options[selectedOptIndex];
    if (opt.ok){
      quizFeedback.className = "feedback good";
      quizFeedback.textContent = "✅ Correct. Why: " + opt.why;

      var t = getActiveTopic();
      if (!state.quizAwarded[t.id]){
        addScore(3);
        state.quizAwarded[t.id] = true;
        LS.set(KEY_STATE, state);
        renderScoreUI();
      }
    }else{
      quizFeedback.className = "feedback bad";
      quizFeedback.textContent = "❌ Not the best. Why: " + opt.why;
    }
  });

  // Builder
  function tKey(){ return "topic_" + getActiveTopic().id; }

  function getBuilderState(){
    var st = LS.get(KEY_STATE, state);
    st.builder = st.builder || {};
    return st.builder[tKey()] || null;
  }
  function saveBuilderState(b){
    var st = LS.get(KEY_STATE, state);
    st.builder = st.builder || {};
    st.builder[tKey()] = b;
    LS.set(KEY_STATE, st);
    state = st;
  }

  function initBuilder(forceReset){
    var model = (getActiveTopic().builderModel || []);
    builderFeedback.className = "feedback";
    builderFeedback.textContent = "Build your answer in the best order (Step 1 → Step 2 → Step 3).";

    var correctIds = model.map(function(_,i){ return "b"+i; });
    var saved = getBuilderState();
    var changed = !saved || (saved.correctIds || []).join("|") !== correctIds.join("|");

    if (forceReset || changed){
      saved = {
        correctIds: correctIds,
        pool: shuffle(model.map(function(m,i){ return {id:"b"+i, step:m.step, text:m.text}; })),
        lane: []
      };
      saveBuilderState(saved);
    }
    renderBuilder(saved);
  }

  function renderBuilder(b){
    blockPool.innerHTML = "";
    answerLane.innerHTML = "";
    b.pool.forEach(function(item){ blockPool.appendChild(renderPoolBlock(item)); });
    b.lane.forEach(function(item){ answerLane.appendChild(renderLaneItem(item)); });
  }

  function renderPoolBlock(item){
    var el = document.createElement("div");
    el.className = "block";
    el.setAttribute("draggable","true");

    var left = document.createElement("div");
    var t = document.createElement("div"); t.className="block__text"; t.textContent=item.text;
    var m = document.createElement("div"); m.className="block__meta"; m.textContent="Step " + item.step;
    left.appendChild(t); left.appendChild(m);

    var btns = document.createElement("div");
    btns.className="block__btns";

    var addBtn = document.createElement("button");
    addBtn.type="button"; addBtn.textContent="➕ Add";
    addBtn.addEventListener("click", function(){ movePoolToLane(item.id); });

    var listenBtn = document.createElement("button");
    listenBtn.type="button"; listenBtn.textContent="🔊"; listenBtn.title="Listen";
    listenBtn.addEventListener("click", function(){ speak(item.text); });

    btns.appendChild(addBtn); btns.appendChild(listenBtn);

    el.appendChild(left); el.appendChild(btns);

    el.addEventListener("dragstart", function(e){
      try{ e.dataTransfer.setData("text/plain", item.id); e.dataTransfer.effectAllowed="move"; }catch(err){}
    });

    return el;
  }

  function renderLaneItem(item){
    var li = document.createElement("li");
    li.className="answeritem";
    li.setAttribute("data-id", item.id);

    var t = document.createElement("div");
    t.className="answeritem__text";
    t.textContent=item.text;

    var btns = document.createElement("div");
    btns.className="answeritem__btns";

    var up = document.createElement("button"); up.type="button"; up.textContent="↑";
    up.addEventListener("click", function(){ moveInLane(item.id,-1); });

    var down = document.createElement("button"); down.type="button"; down.textContent="↓";
    down.addEventListener("click", function(){ moveInLane(item.id,+1); });

    var remove = document.createElement("button"); remove.type="button"; remove.textContent="✖";
    remove.addEventListener("click", function(){ moveLaneToPool(item.id); });

    btns.appendChild(up); btns.appendChild(down); btns.appendChild(remove);

    li.appendChild(t); li.appendChild(btns);

    li.addEventListener("dragover", function(e){ e.preventDefault(); });
    li.addEventListener("drop", function(e){
      e.preventDefault();
      var dragId="";
      try{ dragId = e.dataTransfer.getData("text/plain"); }catch(err){}
      if (dragId) dropBefore(dragId, item.id);
    });

    return li;
  }

  function movePoolToLane(id){
    var b = getBuilderState(); if (!b) return;
    var idx = b.pool.findIndex(function(x){ return x.id === id; });
    if (idx < 0) return;
    b.lane.push(b.pool.splice(idx,1)[0]);
    saveBuilderState(b);
    renderBuilder(b);
  }
  function moveLaneToPool(id){
    var b = getBuilderState(); if (!b) return;
    var idx = b.lane.findIndex(function(x){ return x.id === id; });
    if (idx < 0) return;
    b.pool.push(b.lane.splice(idx,1)[0]);
    saveBuilderState(b);
    renderBuilder(b);
  }
  function moveInLane(id, delta){
    var b = getBuilderState(); if (!b) return;
    var idx = b.lane.findIndex(function(x){ return x.id === id; });
    if (idx < 0) return;
    var n = idx + delta;
    if (n < 0 || n >= b.lane.length) return;
    var tmp=b.lane[idx]; b.lane[idx]=b.lane[n]; b.lane[n]=tmp;
    saveBuilderState(b);
    renderBuilder(b);
  }
  function dropBefore(dragId, beforeId){
    var b = getBuilderState(); if (!b) return;
    var beforeIdx = b.lane.findIndex(function(x){ return x.id === beforeId; });
    if (beforeIdx < 0) return;

    var fromPoolIdx = b.pool.findIndex(function(x){ return x.id === dragId; });
    var fromLaneIdx = b.lane.findIndex(function(x){ return x.id === dragId; });
    var item=null;

    if (fromPoolIdx >= 0){
      item = b.pool.splice(fromPoolIdx,1)[0];
    }else if (fromLaneIdx >= 0){
      item = b.lane.splice(fromLaneIdx,1)[0];
      beforeIdx = b.lane.findIndex(function(x){ return x.id === beforeId; });
      if (beforeIdx < 0) beforeIdx = b.lane.length;
    }else return;

    b.lane.splice(beforeIdx,0,item);
    saveBuilderState(b);
    renderBuilder(b);
  }

  answerLane && answerLane.addEventListener("dragover", function(e){ e.preventDefault(); });
  answerLane && answerLane.addEventListener("drop", function(e){
    e.preventDefault();
    var id="";
    try{ id = e.dataTransfer.getData("text/plain"); }catch(err){}
    if (id) movePoolToLane(id);
  });

  $("#btnResetBuilder") && $("#btnResetBuilder").addEventListener("click", function(){ initBuilder(true); });
  $("#btnListenBuilder") && $("#btnListenBuilder").addEventListener("click", function(){
    speak((getActiveTopic().builderModel || []).map(function(x){ return x.text; }).join(" "));
  });

  $("#btnCheckBuilder") && $("#btnCheckBuilder").addEventListener("click", function(){
    var b = getBuilderState(); if (!b) return;
    if (b.lane.length !== b.correctIds.length){
      builderFeedback.className = "feedback warn";
      builderFeedback.textContent = "Add all blocks first (tap ➕ Add).";
      return;
    }
    var correct=0;
    for (var i=0;i<b.correctIds.length;i++){
      if (b.lane[i].id === b.correctIds[i]) correct++;
    }
    if (correct === b.correctIds.length){
      builderFeedback.className = "feedback good";
      builderFeedback.textContent = "✅ Perfect order. This is exactly the 3-step structure.";
      var t = getActiveTopic();
      if (!state.builderAwarded[t.id]){
        addScore(4);
        state.builderAwarded[t.id] = true;
        LS.set(KEY_STATE, state);
        renderScoreUI();
      }
    }else{
      builderFeedback.className = "feedback bad";
      builderFeedback.textContent = "❌ Not perfect yet. Correct positions: " + correct + " / " + b.correctIds.length + ".";
    }
  });

  // Fill
  var currentFill = null;

  function renderFill(){
    var t = getActiveTopic();
    currentFill = t.fill || null;
    if (!currentFill){
      fillText.textContent = "No fill exercise for this topic.";
      return;
    }
    var html = currentFill.template;
    currentFill.blanks.forEach(function(b){
      var opts = b.options.map(function(o){
        return "<option value='" + escapeAttr(o) + "'>" + escapeHtml(o) + "</option>";
      }).join("");
      var sel = "<select data-blank='" + escapeAttr(b.id) + "' class='blank'><option value=''>— choose —</option>" + opts + "</select>";
      html = html.replace("{" + b.id + "}", sel);
    });
    fillText.innerHTML = html;
    fillFeedback.className = "feedback";
    fillFeedback.textContent = "Choose the best words, then click Check.";
  }

  function resetFill(){ renderFill(); }
  function checkFill(){
    if (!currentFill){
      fillFeedback.className = "feedback warn";
      fillFeedback.textContent = "Select a topic first.";
      return;
    }
    var okCount=0;
    var total=currentFill.blanks.length;
    $all("select[data-blank]", fillText).forEach(function(sel){
      var id = sel.getAttribute("data-blank");
      var b = currentFill.blanks.find(function(x){ return x.id === id; });
      sel.classList.remove("ok","no");
      if (!sel.value){ sel.classList.add("no"); return; }
      if (sel.value === b.answer){ okCount++; sel.classList.add("ok"); }
      else sel.classList.add("no");
    });
    if (okCount === total){
      fillFeedback.className = "feedback good";
      fillFeedback.textContent = "✅ Perfect. You chose the most professional wording.";
      var t = getActiveTopic();
      if (!state.fillAwarded[t.id]){
        addScore(3);
        state.fillAwarded[t.id] = true;
        LS.set(KEY_STATE, state);
        renderScoreUI();
      }
    }else{
      fillFeedback.className = "feedback warn";
      fillFeedback.textContent = "Almost. Correct: " + okCount + "/" + total + ". Fix the red blanks and try again.";
    }
  }

  $("#btnNewFill") && $("#btnNewFill").addEventListener("click", resetFill);
  $("#btnResetFill") && $("#btnResetFill").addEventListener("click", resetFill);
  $("#btnCheckFill") && $("#btnCheckFill").addEventListener("click", checkFill);
  $("#btnListenFill") && $("#btnListenFill").addEventListener("click", function(){
    if (!currentFill) return;
    speak(fillText.textContent.replace(/\s+/g," ").trim());
  });

  // Vocab
  function renderVocab(){
    var t = getActiveTopic();
    flashGrid.innerHTML = "";
    (t.vocab || []).forEach(function(v){
      var card = document.createElement("div");
      card.className="flash";
      card.tabIndex=0;

      var inner = document.createElement("div");
      inner.className="flash__inner";

      var front = document.createElement("div");
      front.className="flash__face flash__front";
      var ic = document.createElement("div"); ic.className="icon"; ic.textContent=v.icon||"🧠";
      var w = document.createElement("div"); w.className="word"; w.textContent=v.word;

      var actions = document.createElement("div");
      actions.className="flash__actions";
      var listen = document.createElement("button");
      listen.type="button";
      listen.textContent="🔊 Listen";
      listen.addEventListener("click", function(e){ e.stopPropagation(); speak(v.word); });
      actions.appendChild(listen);

      front.appendChild(ic); front.appendChild(w); front.appendChild(actions);

      var back = document.createElement("div");
      back.className="flash__face flash__back";
      back.innerHTML = "<div><strong>Meaning</strong></div><div style='margin-top:6px'>" + escapeHtml(v.def) + "</div>"
        + "<div class='fr' style='margin-top:10px'><strong>FR:</strong> " + escapeHtml(v.fr || "—") + "</div>"
        + "<div class='tiny muted' style='margin-top:10px'>Tap to flip back</div>";

      inner.appendChild(front); inner.appendChild(back);
      card.appendChild(inner);

      function toggle(){ card.classList.toggle("is-flipped"); }
      card.addEventListener("click", toggle);
      card.addEventListener("keydown", function(e){
        if (e.key==="Enter" || e.key===" "){ e.preventDefault(); toggle(); }
      });

      flashGrid.appendChild(card);
    });
  }

  $("#btnShuffleVocab") && $("#btnShuffleVocab").addEventListener("click", function(){
    var t=getActiveTopic();
    t.vocab = shuffle(t.vocab || []);
    renderVocab();
  });

  // Timed speaking
  var timerId=null;
  var timerRemaining=45;
  var timerBase=45;

  function setTimer(seconds){
    timerBase=seconds;
    timerRemaining=seconds;
    timerNum.textContent=String(seconds);
  }
  function stopTimer(){
    if (timerId){ clearInterval(timerId); timerId=null; }
  }
  function startTimer(){
    stopTimer();
    timerRemaining=timerBase;
    timerNum.textContent=String(timerRemaining);
    timerId=setInterval(function(){
      timerRemaining -= 1;
      timerNum.textContent=String(Math.max(0,timerRemaining));
      if (timerRemaining <= 0){
        stopTimer();
        speak("Time. Quick close: one summary sentence and a polite ending.");
      }
    }, 1000);
  }

  function setPreset(seconds){
    $all(".chipbtn").forEach(function(b){ b.classList.remove("is-on"); });
    if (seconds===30) $("#btnSet30").classList.add("is-on");
    if (seconds===45) $("#btnSet45").classList.add("is-on");
    if (seconds===60) $("#btnSet60").classList.add("is-on");
    setTimer(seconds);
  }

  $("#btnStartTimer") && $("#btnStartTimer").addEventListener("click", startTimer);
  $("#btnStopTimer") && $("#btnStopTimer").addEventListener("click", stopTimer);
  $("#btnResetTimer") && $("#btnResetTimer").addEventListener("click", function(){ stopTimer(); setTimer(timerBase); });

  $("#btnSet30") && $("#btnSet30").addEventListener("click", function(){ setPreset(30); });
  $("#btnSet45") && $("#btnSet45").addEventListener("click", function(){ setPreset(45); });
  $("#btnSet60") && $("#btnSet60").addEventListener("click", function(){ setPreset(60); });

  function updateTimedPanel(){
    var t=getActiveTopic();
    recommendedTimeEl.textContent=String(t.recommended || 45);
    speakPromptEl.textContent=t.speakPrompt || "—";
    timedFeedback.className="feedback";
    timedFeedback.textContent="Tip: Speak in 3 steps. Use connectors: overall, however, for example…";
    chkSpokeFull.checked=false;

    var rec=t.recommended || 45;
    setPreset(rec === 60 ? 60 : (rec === 30 ? 30 : 45));
    setTimer(rec);
  }

  $("#btnMarkMastered") && $("#btnMarkMastered").addEventListener("click", function(){
    var t=getActiveTopic();
    if (!chkSpokeFull.checked){
      timedFeedback.className="feedback warn";
      timedFeedback.textContent="Tick “I spoke for the full time” first — then mark mastered.";
      return;
    }
    if (!state.mastered[t.id]){
      state.mastered[t.id]=true;
      if (!state.spokeAwarded[t.id]){
        addScore(5);
        state.spokeAwarded[t.id]=true;
      }
      LS.set(KEY_STATE, state);
      timedFeedback.className="feedback good";
      timedFeedback.textContent="🔑 Topic mastered! Great job. (Try it again with the other accent.)";
      renderScoreUI();
      renderMap();
    }else{
      timedFeedback.className="feedback";
      timedFeedback.textContent="Already marked as mastered. You can keep practicing.";
    }
  });

  // Score UI
  function renderScoreUI(){
    var mastered = Object.keys(state.mastered||{}).filter(function(k){ return !!state.mastered[k]; }).length;
    $("#masteredCount").textContent=String(mastered);
    setScore(scoreState.score || 0);
  }

  // Notes
  var notesBox=$("#notesBox");
  if (notesBox){
    notesBox.value = LS.get(KEY_NOTES, "");
    notesBox.addEventListener("input", function(){ LS.set(KEY_NOTES, notesBox.value); });
  }
  $("#btnCopyNotes") && $("#btnCopyNotes").addEventListener("click", function(){
    copyToClipboard(notesBox ? notesBox.value : "");
  });

  // Global controls
  $("#btnPrint") && $("#btnPrint").addEventListener("click", function(){ window.print(); });
  $("#btnResetAll") && $("#btnResetAll").addEventListener("click", function(){
    stopSpeech();
    stopTimer();
    LS.del(KEY_STATE);
    LS.del(KEY_SCORE);
    LS.del(KEY_NOTES);
    state = {
      activeTopicId: TOPICS[0].id,
      mastered: {},
      builderAwarded: {},
      quizAwarded: {},
      fillAwarded: {},
      spokeAwarded: {}
    };
    scoreState = {score:0};
    LS.set(KEY_SCORE, scoreState);
    if (notesBox) notesBox.value="";
    renderAll();
    alert("Reset done.");
  });

  // Clipboard + helpers
  function copyToClipboard(text){
    var t=String(text||"");
    if (navigator.clipboard && navigator.clipboard.writeText){
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
  function escapeHtml(s){
    return String(s).replace(/[&<>"']/g, function(m){
      return ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;" })[m];
    });
  }
  function escapeAttr(s){
    return String(s).replace(/'/g, "&#039;").replace(/"/g, "&quot;");
  }

  // Render all
  function renderAll(){
    if (!state.activeTopicId) state.activeTopicId = TOPICS[0].id;
    renderMap();
    renderModels();
    newQuiz();
    initBuilder(true);
    renderFill();
    renderVocab();
    updateTimedPanel();
    renderScoreUI();
    LS.set(KEY_STATE, state);
  }

  renderAll();

})();
  // ===== Grammar Quick Check (Conditionals) =====
  var GQ = [
    {q:"Advice: ___ I were you, I’d talk to the receptionist.", a:"If", options:["If","When","Because"], why:"Advice uses: If I were you, I would…"},
    {q:"2nd conditional: If I ___ my passport, I would contact the embassy.", a:"lost", options:["lose","lost","will lose"], why:"Hypothetical: If + past simple, would + base verb."},
    {q:"1st conditional: If it ___ tomorrow, I’ll go to a museum.", a:"rains", options:["rains","rained","would rain"], why:"Real future: If + present simple, will + base verb."},
    {q:"3rd conditional: If I had booked earlier, I ___ have paid less.", a:"would", options:["will","would","can"], why:"Past regret: would have + past participle."},
    {q:"Advice: If I were you, I ___ check recent reviews.", a:"would", options:["would","will","did"], why:"Advice uses would (or 'I’d')."},
    {q:"2nd conditional: If my phone was stolen, I ___ lock it remotely.", a:"would", options:["would","will","am"], why:"Hypothetical: would + verb."},
    {q:"1st conditional: If the restaurant is full, we ___ try another place.", a:"will", options:["will","would","have"], why:"Real future: will + verb."},
    {q:"3rd conditional: If I had checked the address, I wouldn’t ___ missed the train.", a:"have", options:["have","has","had"], why:"Wouldn’t have + past participle."}
  ];

  var gqWrap = $("#grammarQuiz");
  var gqScoreEl = $("#grammarScore");
  var gqBtnReset = $("#btnGrammarReset");

  function renderGrammarQuiz(){
    if (!gqWrap) return;
    gqWrap.innerHTML = "";
    var correct = 0;

    GQ.forEach(function(item, idx){
      var card = document.createElement("div");
      card.className = "gq";

      var q = document.createElement("div");
      q.className = "gq__q";
      q.innerHTML = "<span class='pill tiny'>Q"+(idx+1)+"</span> " + escapeHtml(item.q);

      var opts = document.createElement("div");
      opts.className = "gq__opts";

      var fb = document.createElement("div");
      fb.className = "gq__fb muted";

      item.options.forEach(function(opt){
        var b = document.createElement("button");
        b.type="button";
        b.className="optbtn";
        b.textContent = opt;
        b.addEventListener("click", function(){
          if (card.getAttribute("data-answered")) return;
          card.setAttribute("data-answered","1");
          var ok = opt === item.a;
          if (ok){ b.classList.add("is-correct"); correct += 1; }
          else{ b.classList.add("is-wrong"); }
          fb.className = "gq__fb " + (ok ? "good" : "warn");
          fb.textContent = (ok ? "✅ Correct. " : "⚠️ Not quite. ") + item.why;

          if (gqScoreEl){
            gqScoreEl.textContent = String(correct) + " / " + String(GQ.length);
          }
        });
        opts.appendChild(b);
      });

      card.appendChild(q);
      card.appendChild(opts);
      card.appendChild(fb);
      gqWrap.appendChild(card);
    });

    if (gqScoreEl){
      gqScoreEl.textContent = "0 / " + String(GQ.length);
    }
  }

  gqBtnReset && gqBtnReset.addEventListener("click", function(){
    renderGrammarQuiz();
  });

  renderGrammarQuiz();

  // ===== Fun mode: spin a random scenario =====
  var btnSpin = $("#btnSpin");
  btnSpin && btnSpin.addEventListener("click", function(){
    if (!TOPICS || !TOPICS.length) return;
    var pick = TOPICS[Math.floor(Math.random()*TOPICS.length)];
    if (pick && pick.id){
      // set selection + scroll to models
      try{
        var sel = $("#topicSelect");
        if (sel){
          sel.value = pick.id;
          sel.dispatchEvent(new Event("change"));
        }else{
          // if select not found, try clicking the card
          var card = document.querySelector('[data-topic="'+pick.id+'"]');
          card && card.click();
        }
      }catch(e){}
      var models = $("#models");
      models && models.scrollIntoView({behavior:"smooth", block:"start"});
    }
  });
