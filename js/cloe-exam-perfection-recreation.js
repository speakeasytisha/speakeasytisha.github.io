/* SpeakEasyTisha — CLOE Exam Perfection (Recreation)
   Put this file in: /js/cloe-exam-perfection-recreation.js
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

  var KEY_STATE = "se_cloe_rec_state_v1";
  var KEY_SCORE = "se_cloe_rec_score_v1";
  var KEY_NOTES = "se_cloe_rec_notes_v1";

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
      id:"hotel_change_booking",
      title:"Hotel — Change a booking",
      desc:"Modify dates / ask for confirmation. Polite and clear.",
      tags:[
        "hotel",
        "email",
        "call"
      ],
      recommended:45,
      speakPrompt:"You contact a hotel to change your booking dates. Explain the reason and ask for confirmation.",
      dialogue:[
        {
          sp:"Interviewer",
          en:"Good afternoon. How can I help you?",
          fr:"Bonjour. Comment puis-je vous aider ?"
        },
        {
          sp:"Candidate",
          en:"Good afternoon. I’d like to change my booking dates, if possible.",
          fr:"Bonjour. J’aimerais changer les dates de ma réservation, si possible."
        },
        {
          sp:"Interviewer",
          en:"Sure. What’s your reservation name?",
          fr:"Bien sûr. À quel nom est la réservation ?"
        },
        {
          sp:"Candidate",
          en:"It’s under Martin. I booked from April 12th to April 14th.",
          fr:"C’est au nom de Martin. J’ai réservé du 12 au 14 avril."
        },
        {
          sp:"Interviewer",
          en:"What dates do you need now?",
          fr:"Quelles dates souhaitez-vous maintenant ?"
        },
        {
          sp:"Candidate",
          en:"Could we move it to April 13th to April 15th? I can pay any difference.",
          fr:"Pourrions-nous la déplacer du 13 au 15 avril ? Je peux payer la différence."
        },
        {
          sp:"Interviewer",
          en:"Let me check availability… Yes, that works.",
          fr:"Je vérifie la disponibilité… Oui, c’est possible."
        },
        {
          sp:"Candidate",
          en:"Perfect, thank you. Could you please email me the updated confirmation?",
          fr:"Parfait, merci. Pouvez-vous m’envoyer la confirmation mise à jour par e-mail ?"
        }
      ],
      writing:{
        subject:"Subject: Request to change booking dates (Reservation: Martin)",
        body:`Hello,

I’m writing about my reservation under the name Martin (currently April 12th to April 14th).
If possible, I would like to change the dates to April 13th to April 15th.

Could you please confirm availability and send me an updated booking confirmation?
I can pay any difference in price.

Thank you in advance.

Best regards,
[Your Name]`
      },
      vocab:[
        {
          icon:"🗓️",
          word:"booking / reservation",
          def:"an arrangement to stay at a hotel",
          fr:"réservation"
        },
        {
          icon:"🔁",
          word:"to change the dates",
          def:"to move to new dates",
          fr:"changer les dates"
        },
        {
          icon:"✅",
          word:"confirmation",
          def:"official proof the booking is valid",
          fr:"confirmation"
        },
        {
          icon:"💳",
          word:"price difference",
          def:"extra amount to pay",
          fr:"différence de prix"
        },
        {
          icon:"🏨",
          word:"availability",
          def:"whether rooms are free",
          fr:"disponibilité"
        }
      ],
      builderModel:[
        {
          step:1,
          text:"Hello, I’m contacting you about my booking under [Name], and I’d like to change the dates."
        },
        {
          step:2,
          text:"The current dates are [old dates]. I’d like to move them to [new dates] if possible."
        },
        {
          step:3,
          text:"Could you confirm availability and email me an updated confirmation? Thank you in advance."
        }
      ],
      fill:{
        template:"Hello, I’m writing about my {b0} under the name Martin. If possible, I’d like to {b1} the dates to April 13th–15th. Could you please {b2} availability and send an updated {b3}? I can pay any {b4}.",
        blanks:[
          {
            id:"b0",
            options:[
              "reservation",
              "reputation",
              "revolution"
            ],
            answer:"reservation"
          },
          {
            id:"b1",
            options:[
              "change",
              "charge",
              "choose"
            ],
            answer:"change"
          },
          {
            id:"b2",
            options:[
              "confirm",
              "confuse",
              "compose"
            ],
            answer:"confirm"
          },
          {
            id:"b3",
            options:[
              "confirmation",
              "competition",
              "conversation"
            ],
            answer:"confirmation"
          },
          {
            id:"b4",
            options:[
              "price difference",
              "rice difference",
              "nice difference"
            ],
            answer:"price difference"
          }
        ]
      },
      quizBank:[
        {
          prompt:"Choose the most polite request:",
          question:"You want the hotel to send proof of your new dates.",
          options:[
            {
              t:"Send me the email now.",
              ok:false,
              why:"Too direct; missing politeness."
            },
            {
              t:"Could you please email me the updated confirmation?",
              ok:true,
              why:"Polite + clear."
            },
            {
              t:"I need it. Hurry up.",
              ok:false,
              why:"Rude tone."
            }
          ]
        },
        {
          prompt:"Choose the best opening line:",
          question:"You call the hotel to change dates.",
          options:[
            {
              t:"Hi. Change my booking.",
              ok:false,
              why:"Too abrupt."
            },
            {
              t:"Good afternoon. I’d like to change my booking dates, if possible.",
              ok:true,
              why:"Professional + polite."
            },
            {
              t:"I’m angry about my booking.",
              ok:false,
              why:"Unnecessary emotion at the start."
            }
          ]
        },
        {
          prompt:"Choose the best extra detail:",
          question:"You want to reassure the hotel.",
          options:[
            {
              t:"I can pay any difference in price.",
              ok:true,
              why:"Shows flexibility."
            },
            {
              t:"It’s not my problem.",
              ok:false,
              why:"Bad tone."
            },
            {
              t:"Whatever.",
              ok:false,
              why:"Too vague."
            }
          ]
        }
      ]
    },
    {
      id:"hotel_late_arrival_request",
      title:"Hotel — Late arrival + special request",
      desc:"Inform late check-in, ask to keep the room, request a baby cot.",
      tags:[
        "hotel",
        "call",
        "problem"
      ],
      recommended:45,
      speakPrompt:"You will arrive late at the hotel. Call to inform them and request a baby cot.",
      dialogue:[
        {
          sp:"Interviewer",
          en:"Hotel reception, good evening.",
          fr:"Réception de l’hôtel, bonsoir."
        },
        {
          sp:"Candidate",
          en:"Good evening. I have a reservation, but I’ll arrive late tonight.",
          fr:"Bonsoir. J’ai une réservation, mais j’arriverai tard ce soir."
        },
        {
          sp:"Interviewer",
          en:"What time do you expect to arrive?",
          fr:"À quelle heure pensez-vous arriver ?"
        },
        {
          sp:"Candidate",
          en:"Probably around 11:30 pm because my train is delayed.",
          fr:"Probablement vers 23h30 car mon train est en retard."
        },
        {
          sp:"Interviewer",
          en:"No problem. What name is the booking under?",
          fr:"Pas de souci. Au nom de qui est la réservation ?"
        },
        {
          sp:"Candidate",
          en:"It’s under Dupont. Also, could you please add a baby cot to the room?",
          fr:"C’est au nom de Dupont. Aussi, pourriez-vous ajouter un lit bébé dans la chambre ?"
        },
        {
          sp:"Interviewer",
          en:"Yes, we can. Anything else?",
          fr:"Oui, c’est possible. Autre chose ?"
        },
        {
          sp:"Candidate",
          en:"That’s all, thank you. Could you please confirm by email?",
          fr:"C’est tout, merci. Pouvez-vous confirmer par e-mail ?"
        }
      ],
      writing:{
        subject:"Subject: Late arrival tonight + baby cot request (Reservation: Dupont)",
        body:`Hello,

I have a reservation under the name Dupont for tonight.
Due to a train delay, I expect to arrive around 11:30 pm.

Could you please keep the room for a late check-in?
Also, could you add a baby cot in the room, if available?

Thank you very much.
Best regards,
[Your Name]`
      },
      vocab:[
        {
          icon:"🕦",
          word:"late arrival",
          def:"arriving later than planned",
          fr:"arrivée tardive"
        },
        {
          icon:"🚆",
          word:"train delay",
          def:"the train arrives late",
          fr:"retard de train"
        },
        {
          icon:"🛏️",
          word:"baby cot",
          def:"a small bed for a baby",
          fr:"lit bébé"
        },
        {
          icon:"🧾",
          word:"to confirm",
          def:"to officially say yes",
          fr:"confirmer"
        },
        {
          icon:"🔑",
          word:"check‑in",
          def:"arrival process at the hotel",
          fr:"enregistrement"
        }
      ],
      builderModel:[
        {
          step:1,
          text:"Good evening. I have a reservation under [Name], and I’m calling because I will arrive late tonight."
        },
        {
          step:2,
          text:"My train is delayed, so I expect to arrive around [time]. Could you please keep the room for a late check‑in?"
        },
        {
          step:3,
          text:"Also, could you add a baby cot in the room? Thank you very much."
        }
      ],
      fill:{
        template:"Good evening, I have a {b0} under Dupont. Because of a train {b1}, I will arrive around {b2}. Could you please keep the room for a late {b3}? Also, could you add a baby {b4}?",
        blanks:[
          {
            id:"b0",
            options:[
              "reservation",
              "resolution",
              "repetition"
            ],
            answer:"reservation"
          },
          {
            id:"b1",
            options:[
              "delay",
              "display",
              "detail"
            ],
            answer:"delay"
          },
          {
            id:"b2",
            options:[
              "11:30 pm",
              "11:30 am",
              "1:30 pm"
            ],
            answer:"11:30 pm"
          },
          {
            id:"b3",
            options:[
              "check-in",
              "check-out",
              "check-up"
            ],
            answer:"check-in"
          },
          {
            id:"b4",
            options:[
              "cot",
              "coat",
              "cat"
            ],
            answer:"cot"
          }
        ]
      },
      quizBank:[
        {
          prompt:"Choose the best reason:",
          question:"Why will you arrive late?",
          options:[
            {
              t:"Because my train is delayed.",
              ok:true,
              why:"Clear + realistic."
            },
            {
              t:"Because I don’t care.",
              ok:false,
              why:"Bad tone."
            },
            {
              t:"Because you are slow.",
              ok:false,
              why:"Blaming."
            }
          ]
        },
        {
          prompt:"Choose the best request:",
          question:"You want the hotel to keep the room.",
          options:[
            {
              t:"Don’t cancel my room.",
              ok:false,
              why:"Too direct."
            },
            {
              t:"Could you please keep the room for a late check‑in?",
              ok:true,
              why:"Polite + specific."
            },
            {
              t:"Keep it.",
              ok:false,
              why:"Too short."
            }
          ]
        },
        {
          prompt:"Choose the best extra request:",
          question:"You need a baby bed.",
          options:[
            {
              t:"Add a baby cot, please.",
              ok:true,
              why:"Simple and polite."
            },
            {
              t:"You must give me a baby bed.",
              ok:false,
              why:"Too demanding."
            },
            {
              t:"I want baby stuff.",
              ok:false,
              why:"Too vague."
            }
          ]
        }
      ]
    },
    {
      id:"hotel_noise_room_change",
      title:"Hotel — Noise complaint (room change)",
      desc:"Complain politely, ask for a quieter room, propose a solution.",
      tags:[
        "hotel",
        "problem",
        "call"
      ],
      recommended:60,
      speakPrompt:"You are in a noisy room. Call reception, explain the issue, and ask for a quieter room.",
      dialogue:[
        {
          sp:"Interviewer",
          en:"Reception, how can I help?",
          fr:"Réception, je vous écoute."
        },
        {
          sp:"Candidate",
          en:"Hello. I’m sorry to bother you, but my room is very noisy.",
          fr:"Bonjour. Désolé de vous déranger, mais ma chambre est très bruyante."
        },
        {
          sp:"Interviewer",
          en:"What is the problem exactly?",
          fr:"Quel est le problème exactement ?"
        },
        {
          sp:"Candidate",
          en:"I can hear loud music from the street and I can’t sleep.",
          fr:"J’entends de la musique forte depuis la rue et je n’arrive pas à dormir."
        },
        {
          sp:"Interviewer",
          en:"Would you like earplugs?",
          fr:"Souhaitez-vous des bouchons d’oreille ?"
        },
        {
          sp:"Candidate",
          en:"If possible, I’d prefer a quieter room. Do you have another room away from the street?",
          fr:"Si possible, je préférerais une chambre plus calme. Avez-vous une chambre côté cour ?"
        },
        {
          sp:"Interviewer",
          en:"Yes, we can move you to a room on the inner courtyard.",
          fr:"Oui, nous pouvons vous déplacer côté cour."
        },
        {
          sp:"Candidate",
          en:"Thank you very much. What time can I switch rooms?",
          fr:"Merci beaucoup. À quelle heure puis-je changer de chambre ?"
        }
      ],
      writing:{
        subject:"Subject: Request for quieter room (noise issue)",
        body:`Hello,

I’m currently staying in room [number], and unfortunately it is very noisy (loud music from the street).
I’m having difficulty sleeping.

If possible, could you move me to a quieter room away from the street?
Thank you for your help.

Best regards,
[Your Name]`
      },
      vocab:[
        {
          icon:"🔊",
          word:"noise / noisy",
          def:"loud sound",
          fr:"bruit / bruyant"
        },
        {
          icon:"😴",
          word:"to fall asleep",
          def:"to begin sleeping",
          fr:"s’endormir"
        },
        {
          icon:"🏨",
          word:"reception desk",
          def:"hotel front desk",
          fr:"réception"
        },
        {
          icon:"🔁",
          word:"to switch rooms",
          def:"to change to another room",
          fr:"changer de chambre"
        },
        {
          icon:"🧩",
          word:"a solution",
          def:"a way to fix the problem",
          fr:"solution"
        }
      ],
      builderModel:[
        {
          step:1,
          text:"Hello, I’m sorry to bother you, but my room is very noisy and I can’t sleep."
        },
        {
          step:2,
          text:"I can hear loud music from the street. If possible, I’d prefer a quieter room away from the street."
        },
        {
          step:3,
          text:"Could you please tell me if you have another room available and when I can switch? Thank you."
        }
      ],
      fill:{
        template:"Hello, I’m sorry to {b0} you, but my room is very {b1}. I can hear loud music from the {b2}. If possible, I’d like to {b3} rooms to a quieter one. Thank you for your {b4}.",
        blanks:[
          {
            id:"b0",
            options:[
              "bother",
              "butter",
              "brother"
            ],
            answer:"bother"
          },
          {
            id:"b1",
            options:[
              "noisy",
              "nosy",
              "easy"
            ],
            answer:"noisy"
          },
          {
            id:"b2",
            options:[
              "street",
              "sheet",
              "seat"
            ],
            answer:"street"
          },
          {
            id:"b3",
            options:[
              "switch",
              "swim",
              "sweep"
            ],
            answer:"switch"
          },
          {
            id:"b4",
            options:[
              "help",
              "helm",
              "heap"
            ],
            answer:"help"
          }
        ]
      },
      quizBank:[
        {
          prompt:"Choose the best apology:",
          question:"You want to sound polite.",
          options:[
            {
              t:"I’m sorry to bother you…",
              ok:true,
              why:"Polite opener."
            },
            {
              t:"This is your fault.",
              ok:false,
              why:"Blaming."
            },
            {
              t:"Fix it now!",
              ok:false,
              why:"Too aggressive."
            }
          ]
        },
        {
          prompt:"Choose the best request:",
          question:"You want a quieter room.",
          options:[
            {
              t:"Give me a new room.",
              ok:false,
              why:"Too direct."
            },
            {
              t:"If possible, I’d prefer a quieter room away from the street.",
              ok:true,
              why:"Polite + specific."
            },
            {
              t:"Your hotel is terrible.",
              ok:false,
              why:"Not helpful."
            }
          ]
        },
        {
          prompt:"Choose the best closing question:",
          question:"You need practical information.",
          options:[
            {
              t:"When can I switch rooms?",
              ok:true,
              why:"Clear next step."
            },
            {
              t:"Whatever.",
              ok:false,
              why:"No request."
            },
            {
              t:"Are you serious?",
              ok:false,
              why:"Confrontational."
            }
          ]
        }
      ]
    },
    {
      id:"restaurant_book_table_diet",
      title:"Restaurant — Book a table + allergy",
      desc:"Reserve a table and mention a dietary restriction politely.",
      tags:[
        "restaurant",
        "call",
        "travel"
      ],
      recommended:45,
      speakPrompt:"You call a restaurant to book a table and mention a food allergy.",
      dialogue:[
        {
          sp:"Interviewer",
          en:"Good evening, restaurant La Terrasse.",
          fr:"Bonsoir, restaurant La Terrasse."
        },
        {
          sp:"Candidate",
          en:"Good evening. I’d like to book a table for two, please.",
          fr:"Bonsoir. J’aimerais réserver une table pour deux, s’il vous plaît."
        },
        {
          sp:"Interviewer",
          en:"For what day and time?",
          fr:"Pour quel jour et quelle heure ?"
        },
        {
          sp:"Candidate",
          en:"For Saturday at 7:30 pm, if possible.",
          fr:"Pour samedi à 19h30, si possible."
        },
        {
          sp:"Interviewer",
          en:"Yes, we have availability.",
          fr:"Oui, nous avons de la disponibilité."
        },
        {
          sp:"Candidate",
          en:"Great. Also, one person has a nut allergy. Is that okay?",
          fr:"Parfait. Aussi, une personne est allergique aux fruits à coque. Est-ce possible ?"
        },
        {
          sp:"Interviewer",
          en:"Yes, we can adapt. Please remind us when you arrive.",
          fr:"Oui, on peut s’adapter. Merci de nous le rappeler à l’arrivée."
        },
        {
          sp:"Candidate",
          en:"Perfect, thank you. Could you confirm the reservation under [Name]?",
          fr:"Parfait, merci. Pouvez-vous confirmer la réservation au nom de [Nom] ?"
        }
      ],
      writing:{
        subject:"Subject: Table reservation for Saturday 7:30 pm (2 people) + allergy",
        body:`Hello,

I would like to confirm a reservation for two people on Saturday at 7:30 pm.
Please note that one guest has a nut allergy.

Could you please confirm the booking under the name [Your Name]?

Thank you very much.
Best regards,
[Your Name]`
      },
      vocab:[
        {
          icon:"🍽️",
          word:"to book a table",
          def:"to reserve a table",
          fr:"réserver une table"
        },
        {
          icon:"🥜",
          word:"nut allergy",
          def:"dangerous reaction to nuts",
          fr:"allergie aux fruits à coque"
        },
        {
          icon:"✅",
          word:"availability",
          def:"free space/time",
          fr:"disponibilité"
        },
        {
          icon:"🗓️",
          word:"for Saturday",
          def:"on Saturday",
          fr:"pour samedi"
        },
        {
          icon:"📝",
          word:"to confirm",
          def:"to officially validate",
          fr:"confirmer"
        }
      ],
      builderModel:[
        {
          step:1,
          text:"Good evening. I’d like to book a table for two on [day] at [time], please."
        },
        {
          step:2,
          text:"If possible, could you confirm availability? Also, one guest has a nut allergy."
        },
        {
          step:3,
          text:"Is that okay for your kitchen? Thank you very much."
        }
      ],
      fill:{
        template:"Good evening, I’d like to {b0} a table for {b1} on Saturday at {b2}. Also, one person has a {b3} allergy. Could you please {b4} the reservation?",
        blanks:[
          {
            id:"b0",
            options:[
              "book",
              "cook",
              "look"
            ],
            answer:"book"
          },
          {
            id:"b1",
            options:[
              "two",
              "to",
              "too"
            ],
            answer:"two"
          },
          {
            id:"b2",
            options:[
              "7:30 pm",
              "7:30 am",
              "5:30 pm"
            ],
            answer:"7:30 pm"
          },
          {
            id:"b3",
            options:[
              "nut",
              "net",
              "not"
            ],
            answer:"nut"
          },
          {
            id:"b4",
            options:[
              "confirm",
              "consume",
              "confess"
            ],
            answer:"confirm"
          }
        ]
      },
      quizBank:[
        {
          prompt:"Choose the best request:",
          question:"You want to reserve politely.",
          options:[
            {
              t:"Give me a table.",
              ok:false,
              why:"Too direct."
            },
            {
              t:"I’d like to book a table for two, please.",
              ok:true,
              why:"Polite and natural."
            },
            {
              t:"Table now.",
              ok:false,
              why:"Too abrupt."
            }
          ]
        },
        {
          prompt:"Choose the best way to mention an allergy:",
          question:"You need to inform the restaurant.",
          options:[
            {
              t:"One person has a nut allergy. Is that okay?",
              ok:true,
              why:"Clear + polite question."
            },
            {
              t:"We can’t eat anything.",
              ok:false,
              why:"Too vague."
            },
            {
              t:"Your food is dangerous.",
              ok:false,
              why:"Accusatory."
            }
          ]
        },
        {
          prompt:"Choose the best closing:",
          question:"You want confirmation.",
          options:[
            {
              t:"Could you confirm the reservation under [Name]?",
              ok:true,
              why:"Professional."
            },
            {
              t:"Bye.",
              ok:false,
              why:"Too short."
            },
            {
              t:"Don’t forget.",
              ok:false,
              why:"Sounds rude."
            }
          ]
        }
      ]
    },
    {
      id:"restaurant_complaint_dish",
      title:"Restaurant — Polite complaint (dish)",
      desc:"Explain the problem calmly, ask for a solution.",
      tags:[
        "restaurant",
        "problem",
        "call"
      ],
      recommended:60,
      speakPrompt:"In a restaurant, your dish is not what you ordered. Speak politely and ask for a solution.",
      dialogue:[
        {
          sp:"Interviewer",
          en:"Is everything okay with your meal?",
          fr:"Tout va bien avec votre repas ?"
        },
        {
          sp:"Candidate",
          en:"Thank you. Actually, there’s a small problem with my dish.",
          fr:"Merci. En fait, il y a un petit problème avec mon plat."
        },
        {
          sp:"Interviewer",
          en:"What seems to be the issue?",
          fr:"Quel est le problème ?"
        },
        {
          sp:"Candidate",
          en:"I ordered the vegetarian pasta, but this one has chicken.",
          fr:"J’ai commandé les pâtes végétariennes, mais celles‑ci ont du poulet."
        },
        {
          sp:"Interviewer",
          en:"I’m sorry about that. Would you like us to replace it?",
          fr:"Je suis désolé. Voulez-vous que nous le remplacions ?"
        },
        {
          sp:"Candidate",
          en:"Yes, please. If possible, could you remake the vegetarian version?",
          fr:"Oui, s’il vous plaît. Si possible, pourriez-vous refaire la version végétarienne ?"
        },
        {
          sp:"Interviewer",
          en:"Of course. It will take about ten minutes.",
          fr:"Bien sûr. Cela prendra environ dix minutes."
        },
        {
          sp:"Candidate",
          en:"Thank you very much. I appreciate it.",
          fr:"Merci beaucoup. J’apprécie."
        }
      ],
      writing:{
        subject:"Subject: Feedback about an order mix‑up",
        body:`Hello,

I visited your restaurant on [date], and overall the service was friendly.
However, there was a mix‑up with my order: I requested a vegetarian dish, but it arrived with chicken.

The team handled it quickly, and I appreciated the solution.
I wanted to share this feedback so it can be avoided in the future.

Best regards,
[Your Name]`
      },
      vocab:[
        {
          icon:"🍝",
          word:"dish",
          def:"a meal on the menu",
          fr:"plat"
        },
        {
          icon:"🥦",
          word:"vegetarian",
          def:"without meat",
          fr:"végétarien"
        },
        {
          icon:"🔁",
          word:"to replace",
          def:"to change for a new one",
          fr:"remplacer"
        },
        {
          icon:"🙏",
          word:"I appreciate it",
          def:"thank you; I’m grateful",
          fr:"j’apprécie"
        },
        {
          icon:"⚠️",
          word:"mix‑up",
          def:"a mistake / confusion",
          fr:"erreur / confusion"
        }
      ],
      builderModel:[
        {
          step:1,
          text:"Excuse me. There’s a small problem with my dish."
        },
        {
          step:2,
          text:"I ordered the vegetarian pasta, but this one has chicken."
        },
        {
          step:3,
          text:"Could you please replace it with the vegetarian version? Thank you."
        }
      ],
      fill:{
        template:"Excuse me, there’s a small {b0} with my dish. I {b1} the vegetarian pasta, but this one has {b2}. Could you please {b3} it? Thank you very {b4}.",
        blanks:[
          {
            id:"b0",
            options:[
              "problem",
              "promise",
              "program"
            ],
            answer:"problem"
          },
          {
            id:"b1",
            options:[
              "ordered",
              "owned",
              "opened"
            ],
            answer:"ordered"
          },
          {
            id:"b2",
            options:[
              "chicken",
              "kitchen",
              "children"
            ],
            answer:"chicken"
          },
          {
            id:"b3",
            options:[
              "replace",
              "repeat",
              "repair"
            ],
            answer:"replace"
          },
          {
            id:"b4",
            options:[
              "much",
              "match",
              "march"
            ],
            answer:"much"
          }
        ]
      },
      quizBank:[
        {
          prompt:"Choose the best tone:",
          question:"You want to complain politely.",
          options:[
            {
              t:"There’s a small problem with my dish.",
              ok:true,
              why:"Soft and polite."
            },
            {
              t:"This is terrible. You’re incompetent.",
              ok:false,
              why:"Aggressive."
            },
            {
              t:"I hate this.",
              ok:false,
              why:"Too emotional."
            }
          ]
        },
        {
          prompt:"Choose the clearest explanation:",
          question:"What went wrong?",
          options:[
            {
              t:"I ordered vegetarian, but it has chicken.",
              ok:true,
              why:"Clear and factual."
            },
            {
              t:"This is not good.",
              ok:false,
              why:"Too vague."
            },
            {
              t:"Fix it.",
              ok:false,
              why:"No details."
            }
          ]
        },
        {
          prompt:"Choose the best request:",
          question:"You want a solution.",
          options:[
            {
              t:"Could you please replace it with the vegetarian version?",
              ok:true,
              why:"Polite + specific."
            },
            {
              t:"Take it away.",
              ok:false,
              why:"Abrupt."
            },
            {
              t:"Do something.",
              ok:false,
              why:"Vague."
            }
          ]
        }
      ]
    },
    {
      id:"restaurant_pay_split_bill",
      title:"Restaurant — Pay + split the bill",
      desc:"Ask to split the bill and pay by card. Simple everyday English.",
      tags:[
        "restaurant",
        "travel",
        "social"
      ],
      recommended:45,
      speakPrompt:"You want to pay and split the bill with friends. Ask politely.",
      dialogue:[
        {
          sp:"Interviewer",
          en:"Would you like the bill?",
          fr:"Vous voulez l’addition ?"
        },
        {
          sp:"Candidate",
          en:"Yes, please. Could we split the bill into two payments?",
          fr:"Oui, s’il vous plaît. Peut-on partager l’addition en deux paiements ?"
        },
        {
          sp:"Interviewer",
          en:"Sure. Cash or card?",
          fr:"Bien sûr. Espèces ou carte ?"
        },
        {
          sp:"Candidate",
          en:"Card, please. And could I get the receipt as well?",
          fr:"Carte, s’il vous plaît. Et puis-je avoir le reçu aussi ?"
        },
        {
          sp:"Interviewer",
          en:"Of course. I’ll be right back.",
          fr:"Bien sûr. Je reviens tout de suite."
        },
        {
          sp:"Candidate",
          en:"Thank you.",
          fr:"Merci."
        },
        {
          sp:"Interviewer",
          en:"Here you go. Two equal amounts.",
          fr:"Voilà. Deux montants égaux."
        },
        {
          sp:"Candidate",
          en:"Perfect. Thanks a lot. Have a nice evening.",
          fr:"Parfait. Merci beaucoup. Bonne soirée."
        }
      ],
      writing:{
        subject:"Subject: Short message to friends (payment plan)",
        body:`Hi!

For the restaurant tonight, can we split the bill?
I can pay by card and send you my share right away if needed.

See you at 7:30 😊`
      },
      vocab:[
        {
          icon:"🧾",
          word:"the bill",
          def:"the total amount to pay",
          fr:"l’addition"
        },
        {
          icon:"➗",
          word:"to split",
          def:"to divide into parts",
          fr:"partager"
        },
        {
          icon:"💳",
          word:"to pay by card",
          def:"pay with a bank card",
          fr:"payer par carte"
        },
        {
          icon:"🧾",
          word:"receipt",
          def:"paper proof of payment",
          fr:"reçu"
        },
        {
          icon:" बराबर",
          word:"equal amounts",
          def:"same value",
          fr:"montants égaux"
        }
      ],
      builderModel:[
        {
          step:1,
          text:"Yes, please. Could we have the bill?"
        },
        {
          step:2,
          text:"Could we split it into two payments, please?"
        },
        {
          step:3,
          text:"I’ll pay by card. Could I get the receipt as well? Thank you."
        }
      ],
      fill:{
        template:"Yes please, could we have the {b0}? Could we {b1} it into two payments? I’ll pay by {b2}. Could I get the {b3} as {b4}?",
        blanks:[
          {
            id:"b0",
            options:[
              "bill",
              "ball",
              "bell"
            ],
            answer:"bill"
          },
          {
            id:"b1",
            options:[
              "split",
              "spill",
              "spell"
            ],
            answer:"split"
          },
          {
            id:"b2",
            options:[
              "card",
              "car",
              "cat"
            ],
            answer:"card"
          },
          {
            id:"b3",
            options:[
              "receipt",
              "recipe",
              "respect"
            ],
            answer:"receipt"
          },
          {
            id:"b4",
            options:[
              "well",
              "also",
              "else"
            ],
            answer:"also"
          }
        ]
      },
      quizBank:[
        {
          prompt:"Choose the best question:",
          question:"You want to divide the bill.",
          options:[
            {
              t:"Split the bill.",
              ok:false,
              why:"Missing politeness."
            },
            {
              t:"Could we split the bill into two payments, please?",
              ok:true,
              why:"Natural and polite."
            },
            {
              t:"I won’t pay.",
              ok:false,
              why:"Wrong meaning."
            }
          ]
        },
        {
          prompt:"Choose the right vocabulary:",
          question:"In English, l’addition is…",
          options:[
            {
              t:"the bill",
              ok:true,
              why:"Correct."
            },
            {
              t:"the table",
              ok:false,
              why:"Not the same."
            },
            {
              t:"the menu",
              ok:false,
              why:"Not the same."
            }
          ]
        },
        {
          prompt:"Choose the best closing:",
          question:"You finish the payment.",
          options:[
            {
              t:"Thanks a lot. Have a nice evening.",
              ok:true,
              why:"Friendly and natural."
            },
            {
              t:"Finally.",
              ok:false,
              why:"Negative tone."
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
      id:"travel_train_delay_rebook",
      title:"Travel — Train delay + rebooking",
      desc:"Ask about next connection, rebook politely, request help.",
      tags:[
        "travel",
        "problem",
        "call"
      ],
      recommended:60,
      speakPrompt:"Your train is delayed and you may miss your connection. Ask for options and rebooking.",
      dialogue:[
        {
          sp:"Interviewer",
          en:"Customer service, how can I help?",
          fr:"Service client, je vous écoute."
        },
        {
          sp:"Candidate",
          en:"Hello. My train is delayed and I’m worried I’ll miss my connection.",
          fr:"Bonjour. Mon train est en retard et j’ai peur de rater ma correspondance."
        },
        {
          sp:"Interviewer",
          en:"What is your destination?",
          fr:"Quelle est votre destination ?"
        },
        {
          sp:"Candidate",
          en:"I’m going to Lyon, and I had a connection in Paris.",
          fr:"Je vais à Lyon, avec une correspondance à Paris."
        },
        {
          sp:"Interviewer",
          en:"We can rebook you on the next train.",
          fr:"Nous pouvons vous replacer sur le prochain train."
        },
        {
          sp:"Candidate",
          en:"Thank you. Could you please confirm the next available option and any seat reservation?",
          fr:"Merci. Pouvez-vous confirmer la prochaine option disponible et la réservation de place ?"
        },
        {
          sp:"Interviewer",
          en:"Yes, I’ll send it by email.",
          fr:"Oui, je vous l’envoie par e-mail."
        },
        {
          sp:"Candidate",
          en:"Great, thank you for your help.",
          fr:"Parfait, merci pour votre aide."
        }
      ],
      writing:{
        subject:"Subject: Request for rebooking due to train delay",
        body:`Hello,

My train to Lyon is delayed, and I may miss my connection in Paris.
Could you please rebook me on the next available train and confirm my seat reservation?

Thank you in advance.
Best regards,
[Your Name]`
      },
      vocab:[
        {
          icon:"🚆",
          word:"train delay",
          def:"the train arrives late",
          fr:"retard de train"
        },
        {
          icon:"🔁",
          word:"to rebook",
          def:"to book again on another option",
          fr:"reprogrammer / rebooker"
        },
        {
          icon:"🔗",
          word:"connection",
          def:"a second train you need to catch",
          fr:"correspondance"
        },
        {
          icon:"💺",
          word:"seat reservation",
          def:"assigned seat booking",
          fr:"réservation de place"
        },
        {
          icon:"✅",
          word:"next available",
          def:"the nearest possible option",
          fr:"prochain disponible"
        }
      ],
      builderModel:[
        {
          step:1,
          text:"Hello. My train is delayed and I’m worried I’ll miss my connection."
        },
        {
          step:2,
          text:"I’m travelling to [destination] with a connection in [city]."
        },
        {
          step:3,
          text:"Could you please rebook me on the next available option and confirm my seat reservation? Thank you."
        }
      ],
      fill:{
        template:"Hello, my train is {b0} and I may miss my {b1}. Could you {b2} me on the next {b3} train and confirm my seat {b4}?",
        blanks:[
          {
            id:"b0",
            options:[
              "delayed",
              "delighted",
              "deleted"
            ],
            answer:"delayed"
          },
          {
            id:"b1",
            options:[
              "connection",
              "collection",
              "condition"
            ],
            answer:"connection"
          },
          {
            id:"b2",
            options:[
              "rebook",
              "reborn",
              "rebuild"
            ],
            answer:"rebook"
          },
          {
            id:"b3",
            options:[
              "available",
              "avoidable",
              "average"
            ],
            answer:"available"
          },
          {
            id:"b4",
            options:[
              "reservation",
              "revelation",
              "relation"
            ],
            answer:"reservation"
          }
        ]
      },
      quizBank:[
        {
          prompt:"Choose the best concern:",
          question:"You might miss the next train.",
          options:[
            {
              t:"I’m worried I’ll miss my connection.",
              ok:true,
              why:"Natural and clear."
            },
            {
              t:"I’m bored.",
              ok:false,
              why:"Wrong meaning."
            },
            {
              t:"I’m hungry.",
              ok:false,
              why:"Not relevant."
            }
          ]
        },
        {
          prompt:"Choose the best request:",
          question:"You need another train.",
          options:[
            {
              t:"Rebook me.",
              ok:false,
              why:"Too direct."
            },
            {
              t:"Could you please rebook me on the next available train?",
              ok:true,
              why:"Polite request."
            },
            {
              t:"You must fix it.",
              ok:false,
              why:"Too aggressive."
            }
          ]
        },
        {
          prompt:"Choose the best extra detail:",
          question:"You want confirmation of your seat.",
          options:[
            {
              t:"and confirm my seat reservation",
              ok:true,
              why:"Useful detail."
            },
            {
              t:"and bring me coffee",
              ok:false,
              why:"Not appropriate."
            },
            {
              t:"and don’t talk to me",
              ok:false,
              why:"Bad tone."
            }
          ]
        }
      ]
    },
    {
      id:"travel_directions_tickets",
      title:"Travel — Directions + ticket information",
      desc:"Ask for directions and ticket type at a station / museum.",
      tags:[
        "travel",
        "call",
        "social"
      ],
      recommended:45,
      speakPrompt:"You are in a city and need directions to a museum and ticket information.",
      dialogue:[
        {
          sp:"Interviewer",
          en:"Can I help you?",
          fr:"Je peux vous aider ?"
        },
        {
          sp:"Candidate",
          en:"Yes please. How do I get to the City Museum from here?",
          fr:"Oui, s’il vous plaît. Comment aller au musée de la ville d’ici ?"
        },
        {
          sp:"Interviewer",
          en:"Take the метро line 2 and get off at Central Station.",
          fr:"Prenez la ligne 2 et descendez à Central Station."
        },
        {
          sp:"Candidate",
          en:"Great, thank you. Do I need to buy a ticket in advance?",
          fr:"Super, merci. Dois-je acheter un billet à l’avance ?"
        },
        {
          sp:"Interviewer",
          en:"You can buy it online or at the entrance.",
          fr:"Vous pouvez l’acheter en ligne ou à l’entrée."
        },
        {
          sp:"Candidate",
          en:"Perfect. Is there a reduced ticket for students?",
          fr:"Parfait. Y a-t-il un tarif réduit pour les étudiants ?"
        },
        {
          sp:"Interviewer",
          en:"Yes, with a student ID.",
          fr:"Oui, avec une carte étudiante."
        },
        {
          sp:"Candidate",
          en:"Thanks a lot. Have a nice day!",
          fr:"Merci beaucoup. Bonne journée !"
        }
      ],
      writing:{
        subject:"Subject: Quick message — Museum plan",
        body:`Hi!

I’m going to the City Museum today.
I’ll take line 2 to Central Station. Tickets are available online or at the entrance.

Do you want to join me? 😊`
      },
      vocab:[
        {
          icon:"🧭",
          word:"directions",
          def:"how to get somewhere",
          fr:"indications"
        },
        {
          icon:"🚇",
          word:"line (metro line)",
          def:"a route on public transport",
          fr:"ligne"
        },
        {
          icon:"🎟️",
          word:"ticket in advance",
          def:"ticket bought before arriving",
          fr:"billet à l’avance"
        },
        {
          icon:"🎓",
          word:"reduced ticket",
          def:"discount price",
          fr:"tarif réduit"
        },
        {
          icon:"🪪",
          word:"ID",
          def:"identity card",
          fr:"pièce d’identité"
        }
      ],
      builderModel:[
        {
          step:1,
          text:"Hello. Could you tell me how to get to [place] from here, please?"
        },
        {
          step:2,
          text:"Which line should I take and where should I get off?"
        },
        {
          step:3,
          text:"Also, do I need to buy tickets in advance, and is there a reduced ticket? Thank you."
        }
      ],
      fill:{
        template:"Yes please, how do I get to the {b0} from here? Which {b1} should I take? Do I need to buy a {b2} in {b3}? Is there a {b4} ticket?",
        blanks:[
          {
            id:"b0",
            options:[
              "museum",
              "muscle",
              "music"
            ],
            answer:"museum"
          },
          {
            id:"b1",
            options:[
              "line",
              "lion",
              "lane"
            ],
            answer:"line"
          },
          {
            id:"b2",
            options:[
              "ticket",
              "tiger",
              "table"
            ],
            answer:"ticket"
          },
          {
            id:"b3",
            options:[
              "advance",
              "advice",
              "advert"
            ],
            answer:"advance"
          },
          {
            id:"b4",
            options:[
              "reduced",
              "refused",
              "reused"
            ],
            answer:"reduced"
          }
        ]
      },
      quizBank:[
        {
          prompt:"Choose the best question:",
          question:"You need directions.",
          options:[
            {
              t:"Where museum?",
              ok:false,
              why:"Not correct English."
            },
            {
              t:"How do I get to the City Museum from here?",
              ok:true,
              why:"Correct and natural."
            },
            {
              t:"I go museum now.",
              ok:false,
              why:"Incorrect grammar."
            }
          ]
        },
        {
          prompt:"Choose the best ticket question:",
          question:"You want to know when to buy.",
          options:[
            {
              t:"Do I need to buy a ticket in advance?",
              ok:true,
              why:"Correct phrase."
            },
            {
              t:"Do I need buy ticket before?",
              ok:false,
              why:"Missing 'to'."
            },
            {
              t:"Advance ticket is bad?",
              ok:false,
              why:"Wrong meaning."
            }
          ]
        },
        {
          prompt:"Choose the best closing:",
          question:"You finish politely.",
          options:[
            {
              t:"Thanks a lot. Have a nice day!",
              ok:true,
              why:"Friendly and natural."
            },
            {
              t:"Ok.",
              ok:false,
              why:"Too short."
            },
            {
              t:"You must help me.",
              ok:false,
              why:"Not a closing."
            }
          ]
        }
      ]
    },
    {
      id:"travel_lost_luggage_helpdesk",
      title:"Travel — Lost luggage (help desk)",
      desc:"Explain calmly, give details, ask for the next steps.",
      tags:[
        "travel",
        "problem",
        "call"
      ],
      recommended:60,
      speakPrompt:"At the airport, your luggage did not arrive. Explain and ask what to do next.",
      dialogue:[
        {
          sp:"Interviewer",
          en:"Hello, can I help you?",
          fr:"Bonjour, je peux vous aider ?"
        },
        {
          sp:"Candidate",
          en:"Yes, please. My luggage didn’t arrive on the baggage belt.",
          fr:"Oui, s’il vous plaît. Mon bagage n’est pas arrivé sur le tapis."
        },
        {
          sp:"Interviewer",
          en:"What flight were you on?",
          fr:"Vous étiez sur quel vol ?"
        },
        {
          sp:"Candidate",
          en:"Flight BA 304 from London. I landed about thirty minutes ago.",
          fr:"Le vol BA 304 depuis Londres. J’ai atterri il y a environ trente minutes."
        },
        {
          sp:"Interviewer",
          en:"Do you have your baggage tag?",
          fr:"Avez-vous l’étiquette bagage ?"
        },
        {
          sp:"Candidate",
          en:"Yes. Here it is. Could you tell me what the next steps are?",
          fr:"Oui. La voici. Pouvez-vous me dire quelles sont les prochaines étapes ?"
        },
        {
          sp:"Interviewer",
          en:"We’ll open a report and contact you when it arrives.",
          fr:"Nous allons ouvrir un dossier et vous contacter quand il arrivera."
        },
        {
          sp:"Candidate",
          en:"Thank you. Could you confirm the reference number by email, please?",
          fr:"Merci. Pouvez-vous confirmer le numéro de dossier par e-mail, s’il vous plaît ?"
        }
      ],
      writing:{
        subject:"Subject: Lost luggage report — flight BA 304",
        body:`Hello,

My luggage did not arrive after flight BA 304 from London on [date].
I reported it at the airport help desk and received reference number [number].

Could you please confirm the next steps and inform me when the luggage is located?

Thank you.
Best regards,
[Your Name]`
      },
      vocab:[
        {
          icon:"🧳",
          word:"luggage",
          def:"bags you travel with",
          fr:"bagages"
        },
        {
          icon:"🧾",
          word:"baggage tag",
          def:"label with tracking number",
          fr:"étiquette bagage"
        },
        {
          icon:"📝",
          word:"to open a report",
          def:"create an official file",
          fr:"ouvrir un dossier"
        },
        {
          icon:"📞",
          word:"to contact you",
          def:"call or message you",
          fr:"vous contacter"
        },
        {
          icon:"🔢",
          word:"reference number",
          def:"tracking/file ID",
          fr:"numéro de dossier"
        }
      ],
      builderModel:[
        {
          step:1,
          text:"Hello. My luggage didn’t arrive after my flight, and I need help."
        },
        {
          step:2,
          text:"I was on flight [number] from [city]. Here is my baggage tag."
        },
        {
          step:3,
          text:"Could you tell me the next steps and confirm the reference number, please? Thank you."
        }
      ],
      fill:{
        template:"Hello, my {b0} didn’t arrive after flight BA 304. Here is my baggage {b1}. Could you open a {b2} and give me a {b3} number? Please {b4} me when it arrives.",
        blanks:[
          {
            id:"b0",
            options:[
              "luggage",
              "language",
              "leverage"
            ],
            answer:"luggage"
          },
          {
            id:"b1",
            options:[
              "tag",
              "tug",
              "tagg"
            ],
            answer:"tag"
          },
          {
            id:"b2",
            options:[
              "report",
              "resort",
              "repair"
            ],
            answer:"report"
          },
          {
            id:"b3",
            options:[
              "reference",
              "referee",
              "relevance"
            ],
            answer:"reference"
          },
          {
            id:"b4",
            options:[
              "contact",
              "contract",
              "connect"
            ],
            answer:"contact"
          }
        ]
      },
      quizBank:[
        {
          prompt:"Choose the clearest problem statement:",
          question:"Your bag is missing.",
          options:[
            {
              t:"My luggage didn’t arrive on the baggage belt.",
              ok:true,
              why:"Clear and correct."
            },
            {
              t:"My bag is not good.",
              ok:false,
              why:"Wrong meaning."
            },
            {
              t:"I have no happy luggage.",
              ok:false,
              why:"Incorrect."
            }
          ]
        },
        {
          prompt:"Choose the best document:",
          question:"What helps the agent track your bag?",
          options:[
            {
              t:"the baggage tag",
              ok:true,
              why:"Correct tracking info."
            },
            {
              t:"the menu",
              ok:false,
              why:"Not relevant."
            },
            {
              t:"the hotel key",
              ok:false,
              why:"Not relevant."
            }
          ]
        },
        {
          prompt:"Choose the best request:",
          question:"You want follow-up.",
          options:[
            {
              t:"Could you confirm the reference number by email, please?",
              ok:true,
              why:"Polite and practical."
            },
            {
              t:"Find it now!",
              ok:false,
              why:"Too aggressive."
            },
            {
              t:"Ok bye.",
              ok:false,
              why:"No request."
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