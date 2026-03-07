/* SpeakEasyTisha — CLOE Exam Perfection (Step 3)
   Put this file in: /js/cloe-exam-perfection-step3.js
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

  var KEY_STATE = "se_cloe_step3_state_v1";
  var KEY_SCORE = "se_cloe_step3_score_v1";
  var KEY_NOTES = "se_cloe_step3_notes_v1";

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
      id:"supplier_followup",
      title:"Supplier follow‑up (quality part)",
      desc:"Chase a missing part / update delivery. Polite but clear.",
      tags:["email","call","problem"],
      recommended:45,
      speakPrompt:"You are following up with a supplier about a delayed part. Explain the situation and ask for a new delivery date.",
      dialogue:[
        {sp:"Interviewer", en:"Good morning. How can I help you?", fr:"Bonjour. Comment puis‑je vous aider ?"},
        {sp:"Candidate", en:"Good morning. I’m calling to follow up on a delivery that is currently delayed.", fr:"Bonjour. J’appelle pour relancer une livraison qui est actuellement en retard."},
        {sp:"Interviewer", en:"Which reference are you talking about?", fr:"De quelle référence s’agit‑il ?"},
        {sp:"Candidate", en:"It’s part number RQ‑784. We expected it yesterday, and it may impact production.", fr:"C’est la pièce RQ‑784. Elle était attendue hier et cela peut impacter la production."},
        {sp:"Interviewer", en:"What would you like us to do?", fr:"Que souhaitez‑vous que nous fassions ?"},
        {sp:"Candidate", en:"Could you please confirm the new delivery date and share an updated tracking status? If needed, we can prioritise the shipment.", fr:"Pouvez‑vous confirmer la nouvelle date de livraison et partager un statut de suivi mis à jour ? Si besoin, nous pouvons prioriser l’envoi."},
        {sp:"Interviewer", en:"Okay, I’ll check and get back to you today.", fr:"D’accord, je vérifie et je reviens vers vous aujourd’hui."},
        {sp:"Candidate", en:"Thank you. I really appreciate your help. Have a good day.", fr:"Merci, j’apprécie votre aide. Bonne journée."}
      ],
      writing:{
        subject:"Subject: Follow‑up on delayed part RQ‑784",
        body:
`Hello [Name],

I’m following up on part RQ‑784, which was expected on [date] but has not arrived yet.
This delay may impact our production schedule.

Could you please confirm the updated delivery date and share the latest tracking information?
If needed, we can discuss a priority shipment.

Thank you in advance for your support.

Best regards,
[Your Name]
Quality Department`
      },
      vocab:[
        {icon:"📦", word:"delivery date", def:"the date the shipment arrives", fr:"date de livraison"},
        {icon:"⏳", word:"delay / delayed", def:"arriving later than expected", fr:"retard / en retard"},
        {icon:"🔎", word:"tracking status", def:"shipment progress information", fr:"suivi / statut de suivi"},
        {icon:"⚠️", word:"impact", def:"affect / influence", fr:"impacter"},
        {icon:"🫶", word:"thank you in advance", def:"polite phrase before the person helps", fr:"merci d’avance"}
      ],
      builderModel:[
        {step:1, text:"I’m following up on a delayed delivery, and I’d like to confirm the new delivery date."},
        {step:2, text:"The part was expected yesterday, and this delay may impact production and planning."},
        {step:3, text:"Could you please share the updated tracking status? Thank you in advance for your help."}
      ],
      fill:{
        template:
"I’m {b0} on part RQ‑784, which was expected on {b1}. This delay may {b2} our production schedule. Could you please {b3} the updated delivery date and share the latest {b4} information? Thank you in advance.",
        blanks:[
          {id:"b0", options:["following up","looking forward","giving up"], answer:"following up"},
          {id:"b1", options:["Monday","monkey","money"], answer:"Monday"},
          {id:"b2", options:["impact","improve","ignore"], answer:"impact"},
          {id:"b3", options:["confirm","confuse","consume"], answer:"confirm"},
          {id:"b4", options:["tracking","cooking","parking"], answer:"tracking"}
        ]
      },
      quizBank:[
        {
          prompt:"Choose the most professional reply:",
          question:"The supplier says: “We don’t have an exact date yet.”",
          options:[
            {t:"That’s unacceptable. You must deliver tomorrow.", ok:false, why:"Too aggressive; not professional."},
            {t:"I understand. Could you please share an estimated timeframe and keep me updated today?", ok:true, why:"Polite + asks for next step."},
            {t:"Okay bye.", ok:false, why:"Too short; no request or closing."}
          ]
        },
        {
          prompt:"Choose the best opening line:",
          question:"You call a supplier to follow up.",
          options:[
            {t:"Hey, what’s up?", ok:false, why:"Too informal."},
            {t:"Good morning, I’m calling to follow up on a delivery that is delayed.", ok:true, why:"Clear and professional."},
            {t:"I want the part now.", ok:false, why:"Not polite; no context."}
          ]
        },
        {
          prompt:"Choose the best request:",
          question:"You need tracking details.",
          options:[
            {t:"Send me tracking.", ok:false, why:"Too direct; missing politeness."},
            {t:"Could you please share the latest tracking information?", ok:true, why:"Polite request (CLOE style)."},
            {t:"You should have sent it already.", ok:false, why:"Blaming is not helpful."}
          ]
        }
      ]
    },

    {
      id:"meeting_reschedule",
      title:"Meeting reschedule",
      desc:"Move a meeting and propose options (polite).",
      tags:["meeting","call","email"],
      recommended:45,
      speakPrompt:"You need to reschedule a meeting because you have an urgent issue. Propose two new time slots politely.",
      dialogue:[
        {sp:"Interviewer", en:"Hello, this is Alex. How are you?", fr:"Bonjour, Alex à l’appareil. Comment ça va ?"},
        {sp:"Candidate", en:"Hello Alex, I’m fine, thank you. I’m calling about our meeting tomorrow.", fr:"Bonjour Alex, très bien merci. J’appelle au sujet de notre réunion de demain."},
        {sp:"Interviewer", en:"Yes, what’s the matter?", fr:"Oui, quel est le problème ?"},
        {sp:"Candidate", en:"Unfortunately, I have an urgent issue to handle. Would it be possible to reschedule?", fr:"Malheureusement, j’ai une urgence à gérer. Serait‑il possible de reprogrammer ?"},
        {sp:"Interviewer", en:"When are you available?", fr:"Quand êtes‑vous disponible ?"},
        {sp:"Candidate", en:"I can do Thursday at 10:30 or Friday at 2:00 pm. Which option works best for you?", fr:"Je peux jeudi à 10h30 ou vendredi à 14h. Quelle option vous convient le mieux ?"},
        {sp:"Interviewer", en:"Thursday at 10:30 is perfect.", fr:"Jeudi à 10h30, c’est parfait."},
        {sp:"Candidate", en:"Great, thank you. I’ll send an updated calendar invite.", fr:"Parfait, merci. Je vous envoie une invitation mise à jour."}
      ],
      writing:{
        subject:"Subject: Request to reschedule our meeting",
        body:
`Hello Alex,

I hope you’re doing well. Unfortunately, I need to reschedule our meeting planned for [date/time] due to an urgent issue.

Would Thursday at 10:30 or Friday at 2:00 pm work for you?
Please let me know which option you prefer, and I will send an updated invitation.

Thank you for your understanding.

Best regards,
[Your Name]`
      },
      vocab:[
        {icon:"📅", word:"reschedule", def:"change the time/date of a meeting", fr:"reprogrammer"},
        {icon:"⏰", word:"available", def:"free / not busy", fr:"disponible"},
        {icon:"🙏", word:"thank you for your understanding", def:"polite phrase when you change plans", fr:"merci de votre compréhension"},
        {icon:"🧾", word:"calendar invite", def:"meeting invitation (Outlook/Google)", fr:"invitation calendrier"},
        {icon:"🧠", word:"urgent issue", def:"something important to handle now", fr:"urgence"}
      ],
      builderModel:[
        {step:1, text:"I’m calling about our meeting tomorrow and I’d like to reschedule, if possible."},
        {step:2, text:"I have an urgent issue to handle, so I won’t be available at the planned time."},
        {step:3, text:"I can do Thursday at 10:30 or Friday at 2:00 pm. Which works best for you?"}
      ],
      fill:{
        template:
"Unfortunately, I need to {b0} our meeting planned for {b1}. Would {b2} at 10:30 or {b3} at 2:00 pm work for you? Thank you for your {b4}.",
        blanks:[
          {id:"b0", options:["reschedule","recycle","recommend"], answer:"reschedule"},
          {id:"b1", options:["tomorrow","tomato","today"], answer:"tomorrow"},
          {id:"b2", options:["Thursday","thirsty","thousand"], answer:"Thursday"},
          {id:"b3", options:["Friday","friendly","frozen"], answer:"Friday"},
          {id:"b4", options:["understanding","underground","undertaking"], answer:"understanding"}
        ]
      },
      quizBank:[
        {
          prompt:"Choose the best polite request:",
          question:"You want to change the meeting.",
          options:[
            {t:"Change it.", ok:false, why:"Too direct."},
            {t:"Would it be possible to reschedule our meeting?", ok:true, why:"Very polite and clear."},
            {t:"You must move it.", ok:false, why:"Too strong."}
          ]
        },
        {
          prompt:"Choose the best closing:",
          question:"After agreeing on a new time.",
          options:[
            {t:"Great, I’ll send an updated calendar invite. Thank you.", ok:true, why:"Clear next step + polite."},
            {t:"Ok.", ok:false, why:"Too short."},
            {t:"Finally.", ok:false, why:"Negative tone."}
          ]
        }
      ]
    },

    {
      id:"complaint_service",
      title:"Customer complaint (service)",
      desc:"Apologise, clarify, offer a solution.",
      tags:["call","problem"],
      recommended:60,
      speakPrompt:"A client complains the service was slow. Apologise, ask for details, and propose a solution politely.",
      dialogue:[
        {sp:"Interviewer", en:"Hello. I’m not happy with the service.", fr:"Bonjour. Je ne suis pas satisfait du service."},
        {sp:"Candidate", en:"I’m sorry to hear that. I understand it’s frustrating.", fr:"Je suis désolé de l’entendre. Je comprends que ce soit frustrant."},
        {sp:"Interviewer", en:"We waited a long time.", fr:"Nous avons attendu longtemps."},
        {sp:"Candidate", en:"Thank you for telling me. Could you please confirm the date and what happened exactly?", fr:"Merci de me le dire. Pouvez‑vous confirmer la date et ce qui s’est passé exactement ?"},
        {sp:"Interviewer", en:"It was yesterday evening.", fr:"C’était hier soir."},
        {sp:"Candidate", en:"I see. I will investigate and come back to you today. In the meantime, I can offer a discount or a refund depending on the case.", fr:"Je vois. Je vais enquêter et revenir vers vous aujourd’hui. En attendant, je peux proposer une remise ou un remboursement selon le cas."},
        {sp:"Interviewer", en:"Okay. Thank you.", fr:"D’accord. Merci."},
        {sp:"Candidate", en:"You’re welcome. Thank you again, and we’ll do our best to improve.", fr:"Je vous en prie. Merci encore, et nous ferons le nécessaire pour améliorer."}
      ],
      writing:{
        subject:"Subject: Apology and follow‑up regarding your complaint",
        body:
`Hello [Name],

Thank you for your message. I’m sorry to hear about your experience, and I understand your frustration.

Could you please confirm the date/time and provide a few details about what happened?
Once I have that information, I will investigate and come back to you today.

Depending on the situation, we can offer a discount or a refund.
Thank you for your patience.

Kind regards,
[Your Name]`
      },
      vocab:[
        {icon:"🙏", word:"I’m sorry to hear that", def:"polite empathy phrase", fr:"je suis désolé de l’apprendre"},
        {icon:"🧾", word:"complaint", def:"a customer problem/report", fr:"réclamation"},
        {icon:"🔎", word:"investigate", def:"check facts and find the cause", fr:"enquêter"},
        {icon:"🏷️", word:"discount", def:"price reduction", fr:"remise"},
        {icon:"💳", word:"refund", def:"money returned", fr:"remboursement"}
      ],
      builderModel:[
        {step:1, text:"I’m sorry to hear that, and I understand your frustration."},
        {step:2, text:"Could you please share the date and details, so I can investigate properly?"},
        {step:3, text:"I’ll come back to you today, and we can discuss a discount or refund depending on the case."}
      ],
      fill:{
        template:
"Thank you for your message. I’m {b0} to hear about your experience. Could you please {b1} the date and provide a few {b2}? I will {b3} and come back to you today. Depending on the situation, we can offer a {b4}.",
        blanks:[
          {id:"b0", options:["sorry","hungry","sleepy"], answer:"sorry"},
          {id:"b1", options:["confirm","compare","complete"], answer:"confirm"},
          {id:"b2", options:["details","candles","bottles"], answer:"details"},
          {id:"b3", options:["investigate","invent","invite"], answer:"investigate"},
          {id:"b4", options:["discount","discussion","document"], answer:"discount"}
        ]
      },
      quizBank:[
        {
          prompt:"Choose the best empathy sentence:",
          question:"The client is unhappy.",
          options:[
            {t:"That’s not my problem.", ok:false, why:"No empathy; unprofessional."},
            {t:"I’m sorry to hear that. I understand your frustration.", ok:true, why:"Empathy + professional tone."},
            {t:"Calm down.", ok:false, why:"Rude / negative."}
          ]
        },
        {
          prompt:"Choose the best next step:",
          question:"You need more information.",
          options:[
            {t:"Can you confirm the date and what happened exactly?", ok:true, why:"Clarification question; useful."},
            {t:"Just wait.", ok:false, why:"No action."},
            {t:"I don’t know.", ok:false, why:"No solution."}
          ]
        }
      ]
    },

    {
      id:"travel_change",
      title:"Travel change (booking issue)",
      desc:"Explain, propose alternatives, confirm details.",
      tags:["travel","call","problem"],
      recommended:45,
      speakPrompt:"Your travel plan changed. Call to request a change and propose an alternative politely.",
      dialogue:[
        {sp:"Interviewer", en:"Hello, travel desk. How can I help?", fr:"Bonjour, service voyage. Je vous écoute."},
        {sp:"Candidate", en:"Hello, I’d like to change my booking because my schedule has changed.", fr:"Bonjour, je voudrais modifier ma réservation car mon planning a changé."},
        {sp:"Interviewer", en:"What date do you need now?", fr:"Quelle date vous faut‑il maintenant ?"},
        {sp:"Candidate", en:"Ideally, next Wednesday morning. If that’s not possible, Thursday afternoon works too.", fr:"Idéalement, mercredi prochain matin. Sinon, jeudi après‑midi fonctionne aussi."},
        {sp:"Interviewer", en:"Okay. I can offer a later flight on Wednesday.", fr:"D’accord. Je peux proposer un vol plus tard mercredi."},
        {sp:"Candidate", en:"That sounds good. Could you please confirm the price difference and send the updated itinerary?", fr:"Très bien. Pouvez‑vous confirmer la différence de prix et envoyer l’itinéraire mis à jour ?"},
        {sp:"Interviewer", en:"Sure. I’ll email it in a few minutes.", fr:"Bien sûr. Je l’envoie par email dans quelques minutes."},
        {sp:"Candidate", en:"Perfect, thank you very much.", fr:"Parfait, merci beaucoup."}
      ],
      writing:{
        subject:"Subject: Request to change my booking",
        body:
`Hello,

I would like to change my booking because my schedule has changed.
Ideally, I need to travel on Wednesday morning. If that is not possible, Thursday afternoon also works.

Could you please confirm the available options and the price difference?
Thank you in advance.

Best regards,
[Your Name]`
      },
      vocab:[
        {icon:"✈️", word:"booking", def:"reservation", fr:"réservation"},
        {icon:"🔁", word:"change / modify", def:"update something", fr:"modifier"},
        {icon:"🧾", word:"itinerary", def:"travel plan document", fr:"itinéraire"},
        {icon:"💶", word:"price difference", def:"extra cost or refund amount", fr:"différence de prix"},
        {icon:"📧", word:"send by email", def:"email it", fr:"envoyer par email"}
      ],
      builderModel:[
        {step:1, text:"I’d like to change my booking because my schedule has changed."},
        {step:2, text:"Ideally I need Wednesday morning; if that’s not possible, Thursday afternoon works too."},
        {step:3, text:"Could you please confirm the options and the price difference, and send the updated itinerary?"}
      ],
      fill:{
        template:
"I would like to {b0} my booking because my {b1} has changed. Ideally, I need {b2} morning. If that’s not possible, {b3} afternoon works too. Could you please send the updated {b4}?",
        blanks:[
          {id:"b0", options:["change","charge","chase"], answer:"change"},
          {id:"b1", options:["schedule","sandwich","student"], answer:"schedule"},
          {id:"b2", options:["Wednesday","window","wonder"], answer:"Wednesday"},
          {id:"b3", options:["Thursday","thunder","theory"], answer:"Thursday"},
          {id:"b4", options:["itinerary","identity","industry"], answer:"itinerary"}
        ]
      },
      quizBank:[
        {
          prompt:"Choose the best alternative phrase:",
          question:"You want a backup option.",
          options:[
            {t:"If that’s not possible, Thursday afternoon works too.", ok:true, why:"Clear alternative."},
            {t:"Thursday maybe.", ok:false, why:"Too vague."},
            {t:"I hate flying.", ok:false, why:"Irrelevant."}
          ]
        }
      ]
    },

    {
      id:"invoice_query",
      title:"Invoice / payment question",
      desc:"Ask politely, give reference, propose a next step.",
      tags:["email","call","problem"],
      recommended:45,
      speakPrompt:"You need to ask about an unpaid invoice. Request an update politely and give the reference.",
      dialogue:[
        {sp:"Interviewer", en:"Accounts payable, good morning.", fr:"Comptabilité fournisseurs, bonjour."},
        {sp:"Candidate", en:"Good morning. I’m calling about invoice INV‑2026‑031. I’d like to check the payment status.", fr:"Bonjour. J’appelle au sujet de la facture INV‑2026‑031. Je voudrais vérifier le statut de paiement."},
        {sp:"Interviewer", en:"When was it sent?", fr:"Quand a‑t‑elle été envoyée ?"},
        {sp:"Candidate", en:"It was sent on March 2nd. Could you please confirm when it will be paid?", fr:"Elle a été envoyée le 2 mars. Pouvez‑vous confirmer quand elle sera payée ?"},
        {sp:"Interviewer", en:"We should be able to pay next week.", fr:"Nous devrions pouvoir payer la semaine prochaine."},
        {sp:"Candidate", en:"Thank you. Could you also confirm the exact date by email, please?", fr:"Merci. Pouvez‑vous aussi confirmer la date exacte par email, s’il vous plaît ?"}
      ],
      writing:{
        subject:"Subject: Payment status — invoice INV‑2026‑031",
        body:
`Hello,

I’m following up on invoice INV‑2026‑031, sent on March 2nd.
Could you please confirm the current payment status and the expected payment date?

If you need any additional information, I’m happy to help.

Thank you in advance.

Best regards,
[Your Name]`
      },
      vocab:[
        {icon:"🧾", word:"invoice", def:"bill for payment", fr:"facture"},
        {icon:"💸", word:"payment status", def:"where payment is in the process", fr:"statut de paiement"},
        {icon:"📌", word:"reference number", def:"invoice ID", fr:"numéro de référence"},
        {icon:"📆", word:"expected date", def:"probable date", fr:"date prévue"},
        {icon:"🤝", word:"additional information", def:"extra details needed", fr:"informations complémentaires"}
      ],
      builderModel:[
        {step:1, text:"I’m following up on invoice INV‑2026‑031 and I’d like to check the payment status."},
        {step:2, text:"It was sent on March 2nd, and we haven’t received confirmation yet."},
        {step:3, text:"Could you please confirm the expected payment date? Thank you in advance."}
      ],
      fill:{
        template:
"I’m {b0} up on invoice INV‑2026‑031, sent on March 2nd. Could you please confirm the current payment {b1} and the expected payment {b2}? If you need any additional {b3}, I’m happy to help. Thank you in {b4}.",
        blanks:[
          {id:"b0", options:["following","flying","filing"], answer:"following"},
          {id:"b1", options:["status","station","sticker"], answer:"status"},
          {id:"b2", options:["date","data","day"], answer:"date"},
          {id:"b3", options:["information","invitation","infection"], answer:"information"},
          {id:"b4", options:["advance","advice","address"], answer:"advance"}
        ]
      },
      quizBank:[
        {
          prompt:"Choose the best professional line:",
          question:"You want the expected payment date.",
          options:[
            {t:"Pay now!", ok:false, why:"Too aggressive."},
            {t:"Could you please confirm the expected payment date?", ok:true, why:"Polite and clear."},
            {t:"Whatever.", ok:false, why:"Not professional."}
          ]
        }
      ]
    },

    {
      id:"safety_quality_issue",
      title:"Quality issue / non-conformity",
      desc:"Describe the problem, request action, propose next steps.",
      tags:["problem","email","meeting"],
      recommended:60,
      speakPrompt:"You discovered a non‑conformity. Explain the issue, ask for corrective action, and propose next steps.",
      dialogue:[
        {sp:"Interviewer", en:"Can you explain the issue?", fr:"Pouvez‑vous expliquer le problème ?"},
        {sp:"Candidate", en:"Yes. During inspection, we found a non‑conformity on the latest batch.", fr:"Oui. Lors du contrôle, nous avons trouvé une non‑conformité sur le dernier lot."},
        {sp:"Interviewer", en:"What is the impact?", fr:"Quel est l’impact ?"},
        {sp:"Candidate", en:"The parts may not meet the required specifications, so we must stop usage until we confirm the root cause.", fr:"Les pièces peuvent ne pas respecter les spécifications, donc nous devons arrêter l’utilisation jusqu’à confirmation de la cause racine."},
        {sp:"Interviewer", en:"What do you need from the supplier?", fr:"Que faut‑il du fournisseur ?"},
        {sp:"Candidate", en:"We need a corrective action plan and a timeline. Could you please share a report and propose containment actions today?", fr:"Nous avons besoin d’un plan d’actions correctives et d’un calendrier. Pouvez‑vous partager un rapport et proposer des actions de confinement aujourd’hui ?"},
        {sp:"Interviewer", en:"Okay, let’s schedule a quick meeting.", fr:"D’accord, planifions une réunion rapide."},
        {sp:"Candidate", en:"Perfect. I’ll send an invite and share the inspection photos.", fr:"Parfait. J’envoie une invitation et je partage les photos de contrôle."}
      ],
      writing:{
        subject:"Subject: Non‑conformity detected — request for corrective action",
        body:
`Hello [Name],

During inspection, we detected a non‑conformity on batch [batch number].
The parts may not meet the required specifications, so we are temporarily stopping usage until we confirm the root cause.

Could you please share:
- a short analysis of the root cause,
- a corrective action plan (CAPA),
- and a timeline for implementation?

If possible, please send an initial update today.
Thank you for your support.

Best regards,
[Your Name]
Quality Department`
      },
      vocab:[
        {icon:"✅", word:"inspection", def:"quality check", fr:"contrôle"},
        {icon:"❌", word:"non‑conformity", def:"does not match requirements", fr:"non‑conformité"},
        {icon:"📏", word:"specifications", def:"technical requirements", fr:"spécifications"},
        {icon:"🧩", word:"root cause", def:"main reason of the problem", fr:"cause racine"},
        {icon:"🛠️", word:"corrective action plan", def:"actions to fix and prevent", fr:"plan d’actions correctives"}
      ],
      builderModel:[
        {step:1, text:"We detected a non‑conformity during inspection, and we need immediate follow‑up."},
        {step:2, text:"The parts may not meet specifications, so we are stopping usage until we confirm the root cause."},
        {step:3, text:"Could you please share a corrective action plan and timeline today, and we can schedule a short meeting?"}
      ],
      fill:{
        template:
"During {b0}, we detected a {b1} on the latest batch. The parts may not meet the required {b2}. Could you please share a {b3} action plan and a {b4} for implementation?",
        blanks:[
          {id:"b0", options:["inspection","vacation","invention"], answer:"inspection"},
          {id:"b1", options:["non‑conformity","new company","nice compliment"], answer:"non‑conformity"},
          {id:"b2", options:["specifications","spectators","spoons"], answer:"specifications"},
          {id:"b3", options:["corrective","creative","collective"], answer:"corrective"},
          {id:"b4", options:["timeline","timetable","tea time"], answer:"timeline"}
        ]
      },
      quizBank:[
        {
          prompt:"Choose the best next step:",
          question:"You found a non‑conformity.",
          options:[
            {t:"Ignore it.", ok:false, why:"Not acceptable."},
            {t:"Request a corrective action plan and timeline.", ok:true, why:"Professional and realistic."},
            {t:"Post on social media.", ok:false, why:"Not professional."}
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