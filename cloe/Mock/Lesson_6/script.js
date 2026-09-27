
(() => {
  "use strict";

  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];

  const state = {
    fr: false,
    supportMode: "guided",
    completedSections: new Set(),
    guidedIndex: 0,
    guidedFirstAttempts: {},
    guidedCorrect: 0,
    openCompleted: new Set(),
    lessonStarted: Date.now(),
    finalStarted: false,
    finalFinished: false,
    selectedFinalTask: 0,
    finalText: "",
    finalChecks: {},
    finalSeconds: 480,
    timerId: null
  };

  const writingSkills = [
    ["Purpose", "Make the reason for writing immediately clear."],
    ["Essential information", "Include every date, fact, condition and action requested."],
    ["Organisation", "Use a logical order the reader can follow without rereading."],
    ["Register", "Choose language that fits the relationship and situation."],
    ["Accuracy", "Use grammar and vocabulary precisely enough to avoid ambiguity."]
  ];

  const phrases = [
    {l:"A2", f:"Opening", p:"I’m writing about …", fr:"Je vous écris au sujet de…", note:"Simple and useful when the subject is already known."},
    {l:"A2", f:"Opening", p:"I’m writing to confirm …", fr:"Je vous écris pour confirmer…", note:"Use before a date, time, booking, order or arrangement."},
    {l:"B1", f:"Opening", p:"I’m writing regarding …", fr:"Je vous écris concernant…", note:"Neutral professional opening. Follow with a noun phrase."},
    {l:"B1+", f:"Opening", p:"Further to our conversation, …", fr:"Suite à notre échange,…", note:"Useful when continuing a recent discussion."},
    {l:"B2", f:"Opening", p:"I’m getting in touch to follow up on …", fr:"Je vous contacte pour faire le suivi de…", note:"Natural follow-up phrase; slightly less formal than regarding."},

    {l:"A2", f:"Request", p:"Could you please send me …?", fr:"Pourriez-vous m’envoyer… ?", note:"Safe, polite request."},
    {l:"B1", f:"Request", p:"Could you please confirm whether …?", fr:"Pourriez-vous confirmer si… ?", note:"Useful for yes/no information."},
    {l:"B1", f:"Request", p:"Would it be possible to …?", fr:"Serait-il possible de… ?", note:"Polite for changes and arrangements."},
    {l:"B1+", f:"Request", p:"I would appreciate it if you could …", fr:"Je vous serais reconnaissant(e) si vous pouviez…", note:"More formal. Keep the rest of the message concise."},
    {l:"B2", f:"Request", p:"Could you clarify what is required by …?", fr:"Pourriez-vous préciser ce qui est requis d’ici… ?", note:"Useful when instructions are ambiguous."},

    {l:"A2", f:"Confirming", p:"I can confirm that …", fr:"Je peux confirmer que…", note:"Direct and clear."},
    {l:"A2", f:"Confirming", p:"The meeting is scheduled for …", fr:"La réunion est prévue pour…", note:"Use for dates and times."},
    {l:"B1", f:"Confirming", p:"This is to confirm that …", fr:"Ce message confirme que…", note:"Formal written confirmation."},
    {l:"B1+", f:"Confirming", p:"As agreed, …", fr:"Comme convenu,…", note:"Good when the point has already been discussed."},

    {l:"A2", f:"Delay / problem", p:"There is a delay with …", fr:"Il y a un retard concernant…", note:"Name the delayed item precisely."},
    {l:"B1", f:"Delay / problem", p:"Unfortunately, we have experienced a delay due to …", fr:"Malheureusement, nous avons subi un retard en raison de…", note:"Give the cause only if useful."},
    {l:"B1+", f:"Delay / problem", p:"We have identified an issue affecting …", fr:"Nous avons identifié un problème affectant…", note:"Professional and neutral."},
    {l:"B2", f:"Delay / problem", p:"The current delay may have an impact on …", fr:"Le retard actuel risque d’avoir un impact sur…", note:"Useful for consequence without overclaiming."},

    {l:"A2", f:"Apology", p:"I’m sorry for the delay.", fr:"Je suis désolé(e) pour le retard.", note:"Simple and appropriate."},
    {l:"B1", f:"Apology", p:"We apologise for the inconvenience.", fr:"Nous nous excusons pour la gêne occasionnée.", note:"Standard customer-facing language."},
    {l:"B1+", f:"Apology", p:"Please accept our apologies for …", fr:"Veuillez accepter nos excuses pour…", note:"More formal."},
    {l:"B2", f:"Apology", p:"We regret any inconvenience this may have caused.", fr:"Nous regrettons toute gêne que cela a pu occasionner.", note:"Formal, often used after a problem has been resolved."},

    {l:"A2", f:"Rescheduling", p:"Can we move the meeting to …?", fr:"Pouvons-nous déplacer la réunion à… ?", note:"Fine for colleagues; use a more polite form externally."},
    {l:"B1", f:"Rescheduling", p:"Would you be available instead on …?", fr:"Seriez-vous disponible plutôt le… ?", note:"Polite alternative suggestion."},
    {l:"B1+", f:"Rescheduling", p:"Could we reschedule our meeting for …?", fr:"Pourrions-nous reprogrammer notre réunion pour… ?", note:"Standard professional phrasing."},
    {l:"B2", f:"Rescheduling", p:"If that time is not convenient, please suggest an alternative.", fr:"Si cet horaire ne convient pas, merci de proposer une alternative.", note:"Useful to keep the exchange moving."},

    {l:"A2", f:"Attachment", p:"I’ve attached the document.", fr:"J’ai joint le document.", note:"Natural and concise."},
    {l:"B1", f:"Attachment", p:"Please find the updated document attached.", fr:"Veuillez trouver le document mis à jour en pièce jointe.", note:"Formal but common."},
    {l:"B1+", f:"Attachment", p:"I’ve attached the revised version for your review.", fr:"J’ai joint la version révisée pour relecture.", note:"States both item and purpose."},

    {l:"A2", f:"Action", p:"Please let me know.", fr:"Merci de me tenir au courant.", note:"Too vague alone; add what you want to know."},
    {l:"B1", f:"Action", p:"Please let me know if you have any questions.", fr:"N’hésitez pas à me dire si vous avez des questions.", note:"Useful closing support."},
    {l:"B1", f:"Action", p:"Please confirm by Friday.", fr:"Merci de confirmer d’ici vendredi.", note:"Clear deadline."},
    {l:"B1+", f:"Action", p:"Please let me know how you would like to proceed.", fr:"Merci de m’indiquer comment vous souhaitez procéder.", note:"Good when the reader must choose the next step."},
    {l:"B2", f:"Action", p:"I would be grateful if you could confirm the next steps by Friday.", fr:"Je vous serais reconnaissant(e) de confirmer les prochaines étapes d’ici vendredi.", note:"Formal but still action-oriented."},

    {l:"A2", f:"Closing", p:"Thank you for your help.", fr:"Merci pour votre aide.", note:"Safe neutral close."},
    {l:"B1", f:"Closing", p:"Thank you in advance for your confirmation.", fr:"Merci d’avance pour votre confirmation.", note:"Best when a confirmation has been explicitly requested."},
    {l:"B1+", f:"Closing", p:"I look forward to hearing from you.", fr:"Dans l’attente de votre retour.", note:"Neutral professional close."},
    {l:"B2", f:"Closing", p:"Please do not hesitate to contact me if you require any further information.", fr:"N’hésitez pas à me contacter si vous avez besoin d’informations complémentaires.", note:"Formal; use only if relevant."},

    {l:"A2", f:"Sequence", p:"First, … Then, … Finally, …", fr:"D’abord… Ensuite… Enfin…", note:"Simple sequence for instructions."},
    {l:"B1", f:"Sequence", p:"Once this has been completed, …", fr:"Une fois cela terminé,…", note:"Useful for dependent steps."},
    {l:"B1+", f:"Sequence", p:"Before proceeding, please ensure that …", fr:"Avant de poursuivre, veuillez vous assurer que…", note:"Clear procedural instruction."},
    {l:"B2", f:"Sequence", p:"Provided that the information is complete, we can proceed with …", fr:"À condition que les informations soient complètes, nous pouvons poursuivre…", note:"Expresses a condition precisely."},

    {l:"A2", f:"Report / note", p:"The main problem is …", fr:"Le principal problème est…", note:"Direct factual opening."},
    {l:"B1", f:"Report / note", p:"The main issue identified was …", fr:"Le principal problème identifié était…", note:"Useful in incident or review notes."},
    {l:"B1+", f:"Report / note", p:"The review highlighted three main points.", fr:"L’examen a mis en évidence trois points principaux.", note:"Good report structure phrase."},
    {l:"B2", f:"Report / note", p:"Based on the information available, the recommended next step is …", fr:"D’après les informations disponibles, la prochaine étape recommandée est…", note:"Careful recommendation language."},

    {l:"A2", f:"Clarifying", p:"Do you mean …?", fr:"Voulez-vous dire… ?", note:"Simple clarification."},
    {l:"B1", f:"Clarifying", p:"Could you clarify which document you need?", fr:"Pourriez-vous préciser de quel document vous avez besoin ?", note:"Ask about the exact unclear element."},
    {l:"B1+", f:"Clarifying", p:"Just to make sure I understand correctly, …", fr:"Juste pour être sûr(e) d’avoir bien compris,…", note:"Useful before restating an instruction."},
    {l:"B2", f:"Clarifying", p:"My understanding is that … Please let me know if this is incorrect.", fr:"Si j’ai bien compris,… Merci de me corriger si ce n’est pas le cas.", note:"Excellent for avoiding ambiguity."},

    {l:"B1", f:"Recommendation", p:"I suggest that we …", fr:"Je propose que nous…", note:"Direct professional suggestion."},
    {l:"B1+", f:"Recommendation", p:"One option would be to …", fr:"Une option serait de…", note:"Useful when several solutions are possible."},
    {l:"B2", f:"Recommendation", p:"Given the current constraints, I recommend …", fr:"Compte tenu des contraintes actuelles, je recommande…", note:"Links recommendation to evidence."},

    {l:"B1", f:"Contrast / result", p:"However, …", fr:"Cependant,…", note:"Contrast."},
    {l:"B1", f:"Contrast / result", p:"As a result, …", fr:"Par conséquent,…", note:"Result or consequence."},
    {l:"B1+", f:"Contrast / result", p:"Although …, …", fr:"Bien que…,…", note:"Contrast within one sentence."},
    {l:"B2", f:"Contrast / result", p:"Nevertheless, …", fr:"Néanmoins,…", note:"More formal contrast."},

    {l:"B1", f:"Technical note", p:"The issue affects …", fr:"Le problème affecte…", note:"Define the exact scope of a technical issue."},
    {l:"B1+", f:"Technical note", p:"As a temporary workaround, …", fr:"Comme solution temporaire,…", note:"Introduce an interim procedure while a fix is pending."},
    {l:"B2", f:"Technical note", p:"The root cause is currently under investigation.", fr:"La cause première est actuellement en cours d’analyse.", note:"Use when the cause is not yet confirmed."},
    {l:"B2", f:"Technical note", p:"Until a permanent fix is deployed, …", fr:"Jusqu’au déploiement d’un correctif permanent,…", note:"Introduce a temporary operating rule."},

    {l:"B1", f:"Meeting summary", p:"The team agreed to …", fr:"L’équipe a convenu de…", note:"Record a decision rather than the conversation."},
    {l:"B1+", f:"Meeting summary", p:"It was agreed that …", fr:"Il a été convenu que…", note:"Neutral summary language for a shared decision."},
    {l:"B1+", f:"Meeting summary", p:"The following action was assigned to …", fr:"L’action suivante a été attribuée à…", note:"Link an action to an owner."},
    {l:"B2", f:"Meeting summary", p:"No change to the current schedule is required at this stage.", fr:"Aucune modification du calendrier actuel n’est nécessaire à ce stade.", note:"Useful for recording a status decision precisely."},

    {l:"B1", f:"Incident report", p:"The incident occurred at …", fr:"L’incident s’est produit à…", note:"Start chronology with an exact time or date."},
    {l:"B1", f:"Incident report", p:"Service was restored at …", fr:"Le service a été rétabli à…", note:"Record resolution time precisely."},
    {l:"B1+", f:"Incident report", p:"No data loss has been identified.", fr:"Aucune perte de données n’a été identifiée.", note:"State a verified finding without overclaiming."},
    {l:"B2", f:"Incident report", p:"A follow-up analysis will be completed to reduce the risk of recurrence.", fr:"Une analyse de suivi sera réalisée afin de réduire le risque de récurrence.", note:"Close with a preventive next step."},

    {l:"A2", f:"Handover", p:"This has been completed.", fr:"Ceci a été terminé.", note:"Simple completed-status phrase."},
    {l:"B1", f:"Handover", p:"The following item is still outstanding: …", fr:"L’élément suivant reste en attente :…", note:"Make unfinished work explicit."},
    {l:"B1+", f:"Handover", p:"Please follow up if nothing has been received by …", fr:"Merci de relancer si rien n’a été reçu d’ici…", note:"Clear conditional handover action."},
    {l:"B2", f:"Handover", p:"Please flag any change that could affect the agreed deadline.", fr:"Merci de signaler tout changement susceptible d’affecter l’échéance convenue.", note:"Useful risk-focused handover instruction."}
  ];

  const writingFormats = [
    {
      status:"confirmed", type:"Professional email / reply", level:"A2 → B2", icon:"✉",
      purpose:"Confirm, request, explain, apologise, reschedule or solve a problem with a clear reader-facing action.",
      structure:["Purpose in line 1","Essential facts / context","Request or next action","Appropriate close"],
      coaching:"Do not write a French-style long introduction. Put the reason for writing early and make the requested action explicit.",
      scenario:"A client needs a revised delivery date and wants to know whether the delay affects installation.",
      model1:"Hello,\n\nI’m writing to confirm that the delivery is now planned for Thursday. The installation can still take place on Friday as scheduled. Please let me know if you need any further information.\n\nKind regards,",
      model2:"Dear Customer,\n\nI’m writing to confirm the revised delivery date of Thursday. At this stage, the delay should not affect the installation planned for Friday. We will let you know immediately if the situation changes. Please contact me if you require any further information.\n\nKind regards,"
    },
    {
      status:"confirmed", type:"Technical note", level:"B1 → B2+", icon:"⚙",
      purpose:"Explain a technical situation, finding, constraint or recommended action precisely and without unnecessary narrative.",
      structure:["Objective / issue","Key facts or observations","Impact / constraint","Action or recommendation"],
      coaching:"Use concrete nouns, neutral verbs and exact conditions. Avoid vague pronouns such as it/this when several systems or documents are mentioned.",
      scenario:"A software update is causing duplicate customer records. Write a note for the operations team.",
      model1:"Issue: Duplicate customer records have appeared since the software update. The problem affects records created after 9:00 a.m. The IT team is investigating. Until the issue is resolved, please check for an existing record before creating a new one.",
      model2:"Technical note — Duplicate customer records\n\nFollowing this morning’s software update, the system may create duplicate records for new customers. The issue appears to affect entries created after 9:00 a.m. IT is currently investigating the cause. Until a fix is deployed, users should search for an existing customer record before creating a new entry and report any duplicate records to support."
    },
    {
      status:"confirmed", type:"Compte rendu / professional summary", level:"B1 → B2+", icon:"▤",
      purpose:"Record what happened or what was discussed so another person can understand the facts, decisions and next steps.",
      structure:["Context / objective","Key points","Decisions / outcome","Actions + owner / deadline when relevant"],
      coaching:"A compte rendu is not a transcript. Select useful information and separate facts, decisions and actions.",
      scenario:"Summarise a project meeting: launch stays 18 November; testing finishes 10 November; marketing needs final screenshots by 12 November.",
      model1:"Project meeting summary\n\nThe launch date remains 18 November. Testing will be completed by 10 November. Marketing needs the final screenshots by 12 November. The teams will confirm progress at the next project meeting.",
      model2:"Project meeting summary\n\nThe team confirmed that the launch date will remain 18 November. Testing is due to finish by 10 November, after which the final screenshots must be provided to Marketing no later than 12 November. No change to the launch schedule is currently required. Progress will be reviewed at the next project meeting."
    },
    {
      status:"extension", type:"Incident / problem report", level:"B1 → B2", icon:"!",
      purpose:"Document an incident objectively: what happened, impact, response and follow-up.",
      structure:["Time / event","Impact","Action taken / resolution","Preventive follow-up"],
      coaching:"Keep fact and opinion separate. Use chronology, precise times and neutral language; avoid blaming individuals unless the task requires attribution.",
      scenario:"The booking system stopped at 10:15, returned at 10:42, and six customers had to be called back.",
      model1:"At 10:15, the booking system stopped working. The service was restored at 10:42. Six customers could not complete their bookings and were called back after the system recovered. IT is reviewing the cause.",
      model2:"Incident report\n\nAt 10:15, the booking system became unavailable. Service was restored at 10:42. During the outage, six customers were unable to complete their bookings; each customer was contacted once the system was operational again. IT is reviewing the cause of the outage and will provide follow-up actions to reduce the risk of recurrence."
    },
    {
      status:"extension", type:"Procedure / instruction note", level:"A2 → B2", icon:"→",
      purpose:"Tell colleagues what to do and in what order, including conditions or warnings when necessary.",
      structure:["Objective","Ordered steps","Condition / caution","Completion / escalation point"],
      coaching:"Use action verbs and sequence markers. One step = one action. Put warnings before the risky step, not after it.",
      scenario:"Explain how to process an urgent request: verify details, mark urgent, send to priority inbox, confirm receipt.",
      model1:"For an urgent request, first check that all customer details are complete. Then mark the request as urgent and send it to the priority inbox. Finally, confirm that the request has been received.",
      model2:"Urgent request procedure\n\n1. Verify that the customer details and supporting documents are complete.\n2. Mark the request as URGENT in the system.\n3. Forward it to the priority inbox.\n4. Confirm receipt with the requester.\n\nIf any required information is missing, contact the requester before forwarding the case."
    },
    {
      status:"extension", type:"Internal message / chat update", level:"A2 → B1+", icon:"●",
      purpose:"Give a concise operational update to colleagues without the full structure of an external email.",
      structure:["Headline fact","Useful detail","Action / availability"],
      coaching:"Short does not mean vague. Include the exact time, version, location or action colleagues need.",
      scenario:"Tell the team the 2 p.m. meeting is now at 2:30 and Room 4 is unavailable, so use the video link.",
      model1:"Quick update: today’s 2 p.m. meeting has moved to 2:30 p.m. Room 4 is unavailable, so please use the usual video link.",
      model2:"Team update — today’s meeting has been moved from 2:00 to 2:30 p.m. As Room 4 is unavailable, we’ll meet via the usual video link. Please let me know before 2:15 if you cannot join."
    },
    {
      status:"extension", type:"Handover / action note", level:"B1 → B2", icon:"✓",
      purpose:"Transfer ongoing work so the next person knows status, priorities, deadlines and unresolved points.",
      structure:["Current status","Completed items","Outstanding actions + deadline","Risk / contact point"],
      coaching:"A good handover is operational. Write what is done, what is not done, who owns the next action and when it matters.",
      scenario:"You are away tomorrow. The contract is signed; invoice is pending; supplier confirmation is due by 11 a.m.; client call is at 3 p.m.",
      model1:"Handover for tomorrow: the contract has been signed. The invoice is still pending. Please check for the supplier’s confirmation by 11 a.m. and follow up if necessary. The client call is scheduled for 3 p.m.",
      model2:"Handover note\n\nCompleted: the contract has been signed and filed.\nOutstanding: the invoice has not yet been issued. Supplier confirmation is expected by 11:00; please follow up if nothing has been received by then.\nNext commitment: client call at 15:00. Please mention any supplier delay if it affects the delivery date."
    },
    {
      status:"extension", type:"Recommendation / short report", level:"B1+ → B2+", icon:"◆",
      purpose:"Present a finding and recommend a proportionate next step using evidence rather than unsupported opinion.",
      structure:["Objective / finding","Evidence","Implication","Recommendation + reason"],
      coaching:"Calibrate certainty: based on current data, appears, may, likely. A recommendation should follow logically from the evidence you present.",
      scenario:"Customer response times rose from 6 to 11 hours because requests are being routed manually. Recommend one next step.",
      model1:"The review shows that average response time has increased from six to eleven hours. Manual routing is creating delays. I recommend introducing automatic routing for the most common request types to reduce processing time.",
      model2:"Short report — response times\n\nAverage customer response time has increased from six to eleven hours. The review indicates that manual routing is a significant source of delay, particularly for high-volume request types. I recommend automating the routing of standard requests first, then reviewing response-time data after four weeks to measure the impact before extending the change."
    }
  ];

  const microTasks = [
    {
      type:"mcq", level:"A2", focus:"Register", title:"Choose the most appropriate request",
      prompt:"You are writing to a client you do not know well. You need a copy of the signed form.",
      options:["Send me the signed form today.","Could you please send me the signed form?","I want the signed form.","You must send the signed form."],
      answer:1,
      explanation:"“Could you please…” is clear and appropriately polite for an external professional contact.",
      hint:"Grammatically correct is not enough. Which option is direct without sounding abrupt?",
      model:"Could you please send me the signed form by the end of the day?"
    },
    {
      type:"mcq", level:"A2", focus:"Purpose", title:"Choose the clearest opening",
      prompt:"You are confirming a meeting on Thursday at 10:00.",
      options:["I’m writing to confirm our meeting on Thursday at 10:00.","About Thursday.","I tell you the meeting Thursday.","For the meeting, it is 10."],
      answer:0,
      explanation:"The first sentence immediately states the purpose and includes the essential date and time.",
      hint:"Look for purpose + exact information.",
      model:"I’m writing to confirm our meeting on Thursday at 10:00."
    },
    {
      type:"input", level:"A2", focus:"Accuracy", title:"Complete the professional sentence",
      prompt:"Type the missing word: “Please ___ the attached document before Friday.”",
      answers:["review","check"],
      explanation:"“Review” is particularly natural in professional English. “Check” is also acceptable here.",
      hint:"You need a verb meaning read/check carefully.",
      model:"Please review the attached document before Friday."
    },
    {
      type:"order", level:"B1", focus:"Structure", title:"Put the email in a logical order",
      prompt:"Reorder the four lines so the reader sees purpose → detail → action → close.",
      items:[
        "Thank you in advance for your confirmation.",
        "Could you please confirm whether 3:00 p.m. would be convenient?",
        "I’m writing regarding our meeting next Tuesday.",
        "We need to move the meeting from 2:00 p.m. to 3:00 p.m."
      ],
      answer:[2,3,1,0],
      explanation:"A clear professional message normally establishes the subject first, gives the change, asks for the action, then closes.",
      hint:"Start with why you are writing. End with the polite closing."
    },
    {
      type:"mcq", level:"B1", focus:"Clarity", title:"Remove the ambiguity",
      prompt:"Which sentence is clearest when two documents have been mentioned?",
      options:["Please send it by Friday.","Please send the revised contract by Friday.","Please send this by Friday.","Please send that thing by Friday."],
      answer:1,
      explanation:"Repeating the specific noun “the revised contract” prevents ambiguity.",
      hint:"Avoid pronouns when the reader could reasonably ask “which one?”",
      model:"Please send the revised contract by Friday."
    },
    {
      type:"bank", level:"B1", focus:"Collocation", title:"Build a natural professional sentence",
      prompt:"Build the sentence from the word bank.",
      bank:["Could","you","please","confirm","the","new","delivery","date"],
      answer:["Could","you","please","confirm","the","new","delivery","date"],
      explanation:"“Confirm the delivery date” is a high-frequency professional collocation.",
      hint:"Start with the polite modal request."
    },
    {
      type:"mcq", level:"B1", focus:"Tone", title:"Choose the best apology",
      prompt:"A customer received the wrong document. Which response is most professional?",
      options:[
        "Sorry, our mistake.",
        "We apologise for the error and have attached the correct document.",
        "You got the wrong one but now it is fine.",
        "It was not a big problem."
      ],
      answer:1,
      explanation:"It acknowledges the error and immediately gives the corrective action.",
      hint:"The strongest answer combines apology + solution."
    },
    {
      type:"input", level:"B1+", focus:"Linking", title:"Choose the logical connector",
      prompt:"Type the missing connector: “The supplier has not confirmed the shipment. ___, we cannot guarantee Friday delivery.”",
      answers:["therefore","as a result","consequently"],
      explanation:"A result connector is needed because the second sentence is a consequence of the first.",
      hint:"The relationship is cause → consequence, not contrast.",
      model:"The supplier has not confirmed the shipment. As a result, we cannot guarantee Friday delivery."
    },
    {
      type:"mcq", level:"B1+", focus:"Register", title:"Soften a direct instruction",
      prompt:"Which version is most appropriate when asking a colleague from another team for urgent help?",
      options:[
        "Do this before noon.",
        "You need to do this before noon.",
        "Would it be possible to review this before noon? It would help us meet the client deadline.",
        "I expect this before noon."
      ],
      answer:2,
      explanation:"It makes the request clear, gives a deadline and explains the professional reason without sounding authoritarian.",
      hint:"Look for polite request + useful context."
    },
    {
      type:"order", level:"B1+", focus:"Report structure", title:"Structure a short incident note",
      prompt:"Put the note in a logical sequence.",
      items:[
        "As a result, two customer orders were dispatched late.",
        "The issue was resolved at 11:20 a.m.",
        "A system outage began at 9:05 a.m.",
        "The IT team is reviewing the cause to prevent a recurrence."
      ],
      answer:[2,0,1,3],
      explanation:"A concise incident note usually follows chronology: event → impact → resolution → follow-up.",
      hint:"Find the earliest timestamp first, then consequence, resolution, next step."
    },
    {
      type:"mcq", level:"B2", focus:"Precision", title:"Choose the least ambiguous recommendation",
      prompt:"You only have partial information. Which sentence is best?",
      options:[
        "We should definitely cancel the project.",
        "Based on the information currently available, I recommend postponing the decision until the cost estimate is confirmed.",
        "Cancel it because costs are bad.",
        "It is clear that the project cannot work."
      ],
      answer:1,
      explanation:"It calibrates certainty, states the recommendation and explains the condition for the next decision.",
      hint:"Do not claim more certainty than the evidence supports."
    },
    {
      type:"mcq", level:"B2", focus:"Conciseness", title:"Choose the clearest professional version",
      prompt:"Which sentence communicates the same idea most efficiently?",
      options:[
        "Due to the fact that there was a situation involving a delay in the reception of the information, we were not in a position to be able to finish the report.",
        "Because the information arrived late, we could not complete the report on time.",
        "The information had lateness and therefore report impossibility.",
        "We had a late information problem which was not possible."
      ],
      answer:1,
      explanation:"The strongest version is short, grammatical and gives cause + consequence directly.",
      hint:"Professional English rewards clarity, not inflated wording."
    },
    {
      type:"order", level:"B1", focus:"Technical note", title:"Structure a technical note",
      prompt:"Put the note in the clearest order: issue → scope → temporary action → follow-up.",
      items:[
        "IT will provide a further update at 3:00 p.m.",
        "Until then, please save new files to the shared backup folder.",
        "The document server is currently unavailable.",
        "The issue affects files created after 11:20 a.m."
      ],
      answer:[2,3,1,0],
      explanation:"Technical notes should identify the issue, define who/what is affected, give the immediate action, then state the follow-up.",
      hint:"The reader first needs to know what is wrong, then what to do."
    },
    {
      type:"mcq", level:"B1", focus:"Meeting summary", title:"Choose the best compte-rendu sentence",
      prompt:"The team agreed to keep the launch date and finish testing by Friday. Which sentence records the decision most clearly?",
      options:[
        "We talked a lot about the launch and testing.",
        "The team confirmed that the launch date will remain unchanged and that testing will be completed by Friday.",
        "Testing and launch were in the meeting.",
        "The launch is probably okay and Friday is testing."
      ],
      answer:1,
      explanation:"A professional summary records the decision and deadline, not the fact that a discussion happened.",
      hint:"Look for decision + exact action + deadline."
    },
    {
      type:"bank", level:"B1+", focus:"Procedure", title:"Build a clear instruction",
      prompt:"Build the procedural sentence from the word bank.",
      bank:["Before","proceeding","please","verify","that","all","required","fields","are","complete"],
      answer:["Before","proceeding","please","verify","that","all","required","fields","are","complete"],
      explanation:"The sentence puts the condition before the action and uses a precise instruction verb.",
      hint:"Start with the sequence phrase that warns the reader not to continue yet."
    },
    {
      type:"mcq", level:"B2", focus:"Incident report", title:"Keep fact and interpretation separate",
      prompt:"Which sentence is most appropriate in an objective incident report when the cause is not yet confirmed?",
      options:[
        "The outage was caused by an operator who made a mistake.",
        "The system failed because somebody was careless.",
        "The cause of the outage has not yet been confirmed and is under investigation.",
        "It was obviously a human error."
      ],
      answer:2,
      explanation:"A report should not state an unconfirmed cause as fact. The third option accurately represents the current evidence.",
      hint:"Do not claim certainty that the investigation does not support."
    }
  ];

  const openTasks = [
    {
      level:"A2", format:"Internal update", focus:"Precision", title:"Write a concise team update",
      brief:"Write a short internal message about a meeting change.",
      points:["meeting moved from 2:00 to 2:30 p.m.","Room 4 unavailable","use the usual video link","ask colleagues to flag problems before 2:15"],
      min:35, max:65,
      hint:"No email ceremony is needed. Start with the change, then give the practical consequence and action.",
      model1:"Quick update: today’s meeting has moved from 2:00 to 2:30 p.m. Room 4 is unavailable, so please use the usual video link. Let me know before 2:15 if there is a problem.",
      model2:"Team update — today’s meeting has been moved from 2:00 to 2:30 p.m. As Room 4 is unavailable, we’ll meet via the usual video link. Please let me know by 2:15 if you are unable to join."
    },
    {
      level:"A2", format:"Professional email", focus:"Confirmation", title:"Confirm an appointment",
      brief:"Write a short message confirming a video meeting.",
      points:["Tuesday 14 October","10:30 a.m.","video meeting","ask the reader to confirm"],
      min:35, max:70,
      hint:"Use 3–4 sentences: reason → date/time → confirmation request → close.",
      model1:"Hello,\n\nI’m writing to confirm our video meeting on Tuesday 14 October at 10:30 a.m. Could you please confirm that this time is convenient?\n\nThank you.",
      model2:"Hello,\n\nI’m writing to confirm our video meeting scheduled for Tuesday 14 October at 10:30 a.m. Please let me know if this time is still convenient for you.\n\nKind regards,"
    },
    {
      level:"B1", format:"Incident report", focus:"Facts + chronology", title:"Report a short service outage",
      brief:"Write an objective incident report for an internal record.",
      points:["booking system stopped at 10:15","service restored at 10:42","six customers affected","IT investigating cause"],
      min:55, max:90,
      hint:"Use event → impact → resolution → follow-up. Do not invent a cause.",
      model1:"At 10:15, the booking system stopped working. Service was restored at 10:42. Six customers were affected and were contacted after the system recovered. IT is investigating the cause.",
      model2:"Incident report\n\nAt 10:15, the booking system became unavailable. Service was restored at 10:42. During the outage, six customers were unable to complete their bookings and were contacted once the system was operational again. The cause has not yet been confirmed; IT is investigating and will provide a follow-up update."
    },
    {
      level:"B1", format:"Compte rendu", focus:"Decisions + actions", title:"Summarise a project meeting",
      brief:"Write a concise professional meeting summary from the notes.",
      points:["launch remains 18 November","testing complete by 10 November","Marketing needs screenshots by 12 November","progress review next Monday"],
      min:65, max:105,
      hint:"Do not reproduce a conversation. Capture decisions, deadlines and the next review point.",
      model1:"Project meeting summary\n\nThe launch date remains 18 November. Testing will be completed by 10 November. Marketing needs the final screenshots by 12 November. Progress will be reviewed next Monday.",
      model2:"Project meeting summary\n\nThe team confirmed that the launch date will remain 18 November. Testing is due to finish by 10 November, after which the final screenshots must be sent to Marketing no later than 12 November. Progress against these actions will be reviewed next Monday."
    },
    {
      level:"B1+", format:"Technical note", focus:"Issue + action", title:"Write a technical note",
      brief:"Explain a software problem and the temporary procedure to the operations team.",
      points:["duplicate customer records since morning update","affects new records after 9:00","check for existing record before creating one","report duplicates to IT"],
      min:75, max:120,
      hint:"Use an informative heading if helpful. Name the system/problem precisely and make the temporary action impossible to miss.",
      model1:"Technical note — duplicate records\n\nDuplicate customer records have appeared since this morning’s update. The issue affects new records created after 9:00 a.m. Until the problem is resolved, please check for an existing record before creating a new one and report any duplicates to IT.",
      model2:"Technical note — duplicate customer records\n\nFollowing this morning’s software update, the system may create duplicate records for customers entered after 9:00 a.m. IT is investigating. Until a fix is deployed, users should search for an existing record before creating a new entry and report any confirmed duplicate records to the IT support team."
    },
    {
      level:"B1+", format:"Procedure note", focus:"Sequence + condition", title:"Write an urgent-request procedure",
      brief:"Write a short instruction note for colleagues processing urgent requests.",
      points:["verify customer details","mark request URGENT","send to priority inbox","if information missing, contact requester first"],
      min:65, max:110,
      hint:"One instruction per step. Put the exception/condition where the reader needs it.",
      model1:"Urgent request procedure\n\nFirst, verify that the customer details are complete. Then mark the request as URGENT and send it to the priority inbox. If any information is missing, contact the requester before forwarding the request.",
      model2:"Urgent request procedure\n\n1. Verify that all customer details and required documents are complete.\n2. If information is missing, contact the requester before proceeding.\n3. Mark the complete request as URGENT in the system.\n4. Forward it to the priority inbox and confirm receipt."
    },
    {
      level:"B2", format:"Handover note", focus:"Status + ownership", title:"Prepare a handover note",
      brief:"Write a handover for a colleague covering your work tomorrow.",
      points:["contract signed and filed","invoice still pending","supplier confirmation due by 11:00","client call at 3:00 and mention any supplier delay"],
      min:80, max:130,
      hint:"Separate completed work from outstanding work. Make deadlines and next actions easy to scan.",
      model1:"Handover for tomorrow\n\nThe contract has been signed and filed. The invoice is still pending. Please check for the supplier’s confirmation by 11:00 and follow up if necessary. The client call is at 3:00; please mention any supplier delay if it affects the delivery date.",
      model2:"Handover note\n\nCompleted: the contract has been signed and filed.\nOutstanding: the invoice is still pending. Supplier confirmation is expected by 11:00; please follow up if nothing has been received by then.\nNext commitment: client call at 15:00. Please flag any supplier delay that could affect the agreed delivery date."
    },
    {
      level:"B2", format:"Recommendation report", focus:"Evidence + recommendation", title:"Write a concise recommendation",
      brief:"Write a short management note after reviewing slower customer response times.",
      points:["response time rose from 6 to 11 hours","manual routing is main delay","recommend automatic routing for standard requests","review results after four weeks"],
      min:90, max:145,
      hint:"Finding → evidence → recommendation → measurement. Avoid presenting a recommendation as proven fact.",
      model1:"The review shows that average customer response time has increased from six to eleven hours. Manual routing is causing delays. I recommend introducing automatic routing for standard requests and reviewing the results after four weeks.",
      model2:"Short management note — response times\n\nAverage customer response time has increased from six to eleven hours. The review indicates that manual routing is a significant source of delay, particularly for standard high-volume requests. I recommend automating the routing of these requests first, then reviewing response-time data after four weeks to measure the impact before extending the change."
    }
  ];

  const ladder = [
    {level:"A2", title:"State the essential fact", text:"I’m writing to confirm our meeting on Friday at 10:00."},
    {level:"B1", title:"Add a clear action", text:"I’m writing to confirm our meeting on Friday at 10:00. Please let me know if the time is still convenient."},
    {level:"B1+", title:"Add flexibility and context", text:"I’m writing to confirm our meeting on Friday at 10:00. If that time is no longer convenient, please suggest an alternative."},
    {level:"B2", title:"Calibrate tone and consequence", text:"I’m writing to confirm our meeting on Friday at 10:00. If your availability has changed, please suggest an alternative so that we can finalise the schedule today."}
  ];

  const finalTasks = [
    {
      format:"Professional email", level:"B1", time:480,
      brief:"A supplier has told you that an important order will arrive three days late. Write a professional reply.",
      points:["acknowledge the new delivery date","explain that the delay may affect your production schedule","ask whether a partial delivery is possible sooner","ask for confirmation by 4:00 p.m. today"],
      model1:"Hello,\n\nThank you for the update. I understand that the order will now arrive three days later than planned. Unfortunately, this delay may affect our production schedule. Would it be possible to arrange a partial delivery sooner? Please confirm the available options by 4:00 p.m. today.\n\nKind regards,",
      model2:"Hello,\n\nThank you for letting us know about the revised delivery date. The three-day delay may have an impact on our production schedule, so we would like to explore whether part of the order could be delivered earlier. Could you please confirm whether a partial delivery is possible and advise us of the available options by 4:00 p.m. today?\n\nKind regards,"
    },
    {
      format:"Technical note", level:"B1+", time:480,
      brief:"A data-import tool is rejecting some employee records. Write a technical note for the processing team.",
      points:["problem affects files uploaded since 8:30","records with missing department code are rejected","temporary action: add department code before upload","IT will review permanent fix at 2:00 p.m."],
      model1:"Technical note — data import\n\nSome employee records uploaded since 8:30 are being rejected. The issue affects records with a missing department code. Until the problem is fixed, please add the department code before uploading the file. IT will review a permanent fix at 2:00 p.m.",
      model2:"Technical note — employee data import\n\nFiles uploaded since 8:30 may reject employee records when the department code is missing. As a temporary measure, please verify and add the department code before uploading each file. IT is reviewing the issue and will assess a permanent fix at 14:00. Please report any rejected record that already contains a valid department code."
    },
    {
      format:"Compte rendu", level:"B1+", time:480,
      brief:"Write a concise meeting summary for colleagues who were absent.",
      points:["launch date remains 3 December","supplier confirms materials by 24 November","training moved to 27 November","project lead sends revised plan today"],
      model1:"Meeting summary\n\nThe launch date remains 3 December. The supplier will confirm material availability by 24 November. Training has been moved to 27 November. The project lead will send the revised plan today.",
      model2:"Meeting summary\n\nThe team confirmed that the launch date will remain 3 December. The supplier is expected to confirm material availability by 24 November, while staff training has been rescheduled for 27 November. The project lead will circulate the revised plan today so that each team can confirm its remaining actions."
    },
    {
      format:"Incident report", level:"B2", time:480,
      brief:"Write an internal incident report after a temporary service failure.",
      points:["service unavailable 13:05–13:38","12 customer requests delayed","no data loss identified","IT monitoring and root cause not yet confirmed"],
      model1:"Incident report\n\nThe service was unavailable from 13:05 to 13:38. Twelve customer requests were delayed during this period. No data loss has been identified. IT is monitoring the service and the root cause has not yet been confirmed.",
      model2:"Incident report — temporary service failure\n\nThe service was unavailable between 13:05 and 13:38, resulting in delays to twelve customer requests. No data loss has been identified at this stage. Service has been restored and IT is continuing to monitor performance. The root cause remains under investigation; a follow-up update will be issued once the analysis is complete."
    }
  ];

  function init() {
    renderWritingMap();
    renderFilters();
    renderPhrases();
    renderWritingFormats();
    renderFinalChoices();
    renderGuidedTask();
    renderLadder();
    wireGlobal();
    updateProgress();
    startLessonClock();
  }

  function renderWritingMap() {
    const el = $("#writingMap");
    el.innerHTML = writingSkills.map(([t,d]) => `<article><b>${t}</b><span>${d}</span></article>`).join("");
  }

  function renderWritingFormats() {
    const el = $("#formatLibrary");
    if (!el) return;
    el.innerHTML = writingFormats.map((x,i) => `
      <details class="format-card">
        <summary>
          <span class="format-icon">${x.icon}</span>
          <span class="format-summary-text"><b>${escapeHtml(x.type)}</b><small>${escapeHtml(x.level)} · Professional writing practice</small></span>
        </summary>
        <div class="format-body">
          <div class="format-purpose"><b>Purpose</b><p>${escapeHtml(x.purpose)}</p></div>
          <div class="format-columns">
            <article><span class="mini-label">SKELETON</span><ol>${x.structure.map(s=>`<li>${escapeHtml(s)}</li>`).join("")}</ol></article>
            <article><span class="mini-label">COACHING</span><p>${escapeHtml(x.coaching)}</p></article>
          </div>
          <div class="format-scenario"><b>Practice scenario</b><p>${escapeHtml(x.scenario)}</p></div>
          <div class="model-comparison format-models">
            <article><span class="mini-label">MODEL 1 · CLEAR & ACCESSIBLE</span><p>${escapeHtml(x.model1)}</p></article>
            <article><span class="mini-label">MODEL 2 · STRONGER RANGE</span><p>${escapeHtml(x.model2)}</p></article>
          </div>
        </div>
      </details>`).join("");
  }

  function renderFinalChoices() {
    const el = $("#finalChoiceGrid");
    if (!el) return;
    el.innerHTML = finalTasks.map((x,i)=>`<button type="button" data-final-choice="${i}"><b>${escapeHtml(x.format)}</b><span>${escapeHtml(x.level)}</span></button>`).join("");
    $$('[data-final-choice]', el).forEach(btn => btn.addEventListener("click", () => {
      state.selectedFinalTask = Number(btn.dataset.finalChoice);
      $$('[data-final-choice]', el).forEach(b=>b.classList.remove("selected"));
      btn.classList.add("selected");
      const start = $("#startExam");
      start.disabled = false;
      start.textContent = `START · ${finalTasks[state.selectedFinalTask].format.toUpperCase()}`;
    }));
  }

  function renderFilters() {
    const types = [...new Set(phrases.map(x => x.f))].sort();
    $("#typeFilter").innerHTML = `<option value="All">All functions</option>` + types.map(x => `<option>${x}</option>`).join("");
    $("#phraseCount").textContent = phrases.length;
  }

  function renderPhrases() {
    const level = $("#levelFilter").value;
    const type = $("#typeFilter").value;
    const q = $("#phraseSearch").value.trim().toLowerCase();
    const filtered = phrases.filter(x =>
      (level === "All" || x.l === level) &&
      (type === "All" || x.f === type) &&
      (!q || `${x.p} ${x.fr} ${x.note} ${x.f}`.toLowerCase().includes(q))
    );
    $("#phraseLibrary").innerHTML = filtered.map(x => `
      <article class="phrase-card">
        <div class="phrase-top"><span class="level-tag">${x.l}</span><span class="function-tag">${x.f}</span></div>
        <h3>${escapeHtml(x.p)}</h3>
        <p>${escapeHtml(x.note)}</p>
        <p class="fr"><b>FR:</b> ${escapeHtml(x.fr)}</p>
      </article>
    `).join("") || `<div class="empty-state">No phrase matches these filters.</div>`;
  }

  function renderGuidedTask() {
    const stage = $("#guidedStage");
    const total = microTasks.length + openTasks.length;
    const i = state.guidedIndex;

    if (i >= total) {
      stage.innerHTML = `
        <div class="task-card">
          <div class="coach-label">GUIDED LAB COMPLETE</div>
          <h3>You have moved from controlled accuracy to complete professional messages.</h3>
          <p>Your automatically corrected micro-task score is <b>${state.guidedCorrect} / ${microTasks.length}</b>. You also completed <b>${state.openCompleted.size} / ${openTasks.length}</b> open-production tasks.</p>
          <button class="button primary" data-scroll="#realDeal" type="button">Go to the Real Deal</button>
        </div>`;
      wireScroll(stage);
      $("#guidedScore").textContent = `${state.guidedCorrect} / ${microTasks.length}`;
      $("#openScore").textContent = `${state.openCompleted.size} / ${openTasks.length}`;
      completeSection(4);
      return;
    }

    if (i < microTasks.length) {
      renderMicroTask(microTasks[i], i);
    } else {
      renderOpenTask(openTasks[i - microTasks.length], i - microTasks.length);
    }
    updateProgress();
  }

  function renderMicroTask(task, idx) {
    const stage = $("#guidedStage");
    let interaction = "";
    if (task.type === "mcq") {
      interaction = `<div class="option-grid">${task.options.map((o,j)=>`<button type="button" data-option="${j}">${escapeHtml(o)}</button>`).join("")}</div>`;
    } else if (task.type === "input") {
      interaction = `<input class="micro-input" id="microInput" type="text" autocomplete="off" placeholder="Type your answer…" />`;
    } else if (task.type === "order") {
      interaction = `<div class="reorder-list" id="reorderList">${task.items.map((o,j)=>reorderItem(o,j)).join("")}</div>`;
    } else if (task.type === "bank") {
      interaction = `<div class="wordbank" id="wordbank">${task.bank.map((w,j)=>`<button type="button" data-word="${j}">${escapeHtml(w)}</button>`).join("")}</div><div class="answer-line" id="answerLine"><span class="answer-placeholder">Build the sentence here…</span></div>`;
    }
    stage.innerHTML = `
      <article class="task-card">
        <div class="task-head">
          <span class="task-number">CONTROLLED PRACTICE · ${idx+1} / ${microTasks.length}</span>
          <div class="task-meta"><span>${task.level}</span><span>${task.focus}</span></div>
        </div>
        <h3>${escapeHtml(task.title)}</h3>
        <div class="prompt-box"><p>${escapeHtml(task.prompt)}</p></div>
        ${interaction}
        <div class="task-actions">
          <button class="small-button primary" id="checkTask" type="button">CHECK</button>
          <button class="small-button coach-only" id="showHint" type="button">Hint</button>
          <button class="small-button coach-only" id="showModel" type="button">Model</button>
        </div>
        <div class="coach-panel" id="coachPanel"></div>
        <div class="feedback" id="taskFeedback"></div>
      </article>`;
    setupMicroInteraction(task, idx);
    applySupportMode();
  }

  function reorderItem(text, original) {
    return `<div class="reorder-item" data-original="${original}"><span>${escapeHtml(text)}</span><div class="reorder-controls"><button type="button" data-dir="-1" aria-label="Move up">↑</button><button type="button" data-dir="1" aria-label="Move down">↓</button></div></div>`;
  }

  function setupMicroInteraction(task, idx) {
    let selected = null;
    let built = [];

    if (task.type === "mcq") {
      $$(".option-grid button").forEach(btn => btn.addEventListener("click", () => {
        $$(".option-grid button").forEach(b=>b.classList.remove("selected"));
        btn.classList.add("selected");
        selected = Number(btn.dataset.option);
      }));
    }

    if (task.type === "order") {
      $("#reorderList").addEventListener("click", e => {
        const b = e.target.closest("button[data-dir]");
        if (!b) return;
        const item = b.closest(".reorder-item");
        const dir = Number(b.dataset.dir);
        if (dir < 0 && item.previousElementSibling) item.parentNode.insertBefore(item, item.previousElementSibling);
        if (dir > 0 && item.nextElementSibling) item.parentNode.insertBefore(item.nextElementSibling, item);
      });
    }

    if (task.type === "bank") {
      $("#wordbank").addEventListener("click", e => {
        const b = e.target.closest("button[data-word]");
        if (!b || b.classList.contains("used")) return;
        b.classList.add("used");
        built.push({i:Number(b.dataset.word), w:b.textContent});
        renderBuilt();
      });
      $("#answerLine").addEventListener("click", e => {
        const t = e.target.closest(".token");
        if (!t) return;
        const pos = Number(t.dataset.pos);
        const removed = built.splice(pos,1)[0];
        $(`#wordbank button[data-word="${removed.i}"]`).classList.remove("used");
        renderBuilt();
      });
      function renderBuilt(){
        $("#answerLine").innerHTML = built.length ? built.map((x,p)=>`<span class="token" data-pos="${p}">${escapeHtml(x.w)}</span>`).join("") : `<span class="answer-placeholder">Build the sentence here…</span>`;
      }
    }

    $("#showHint").addEventListener("click", () => {
      showCoach(`<b>Hint</b><p>${escapeHtml(task.hint)}</p>`);
    });
    $("#showModel").addEventListener("click", () => {
      const model = task.model || (task.type==="bank" ? task.answer.join(" ")+"." : "");
      showCoach(`<b>Model</b><p>${escapeHtml(model)}</p>`);
    });
    $("#checkTask").addEventListener("click", () => {
      let correct = false;
      if (task.type === "mcq") correct = selected === task.answer;
      if (task.type === "input") {
        const val = normalize($("#microInput").value);
        correct = task.answers.some(a => normalize(a) === val);
      }
      if (task.type === "order") {
        const order = $$("#reorderList .reorder-item").map(x => Number(x.dataset.original));
        correct = JSON.stringify(order) === JSON.stringify(task.answer);
      }
      if (task.type === "bank") correct = JSON.stringify(built.map(x=>x.w)) === JSON.stringify(task.answer);

      if (!(idx in state.guidedFirstAttempts)) {
        state.guidedFirstAttempts[idx] = correct;
        if (correct) state.guidedCorrect++;
      }
      const fb = $("#taskFeedback");
      fb.className = `feedback show ${correct ? "good" : "bad"}`;
      fb.innerHTML = `<b>${correct ? "Correct." : "Not yet."}</b><p>${escapeHtml(task.explanation)}</p>${correct ? `<button class="small-button primary" id="nextTask" type="button">NEXT →</button>` : `<p><b>Try again</b> or use the hint/model if support is on.</p>`}`;
      if (correct) {
        $("#nextTask").addEventListener("click", () => { state.guidedIndex++; renderGuidedTask(); });
      }
      $("#guidedScore").textContent = `${state.guidedCorrect} / ${microTasks.length}`;
      updateProgress();
    });

    function showCoach(html) {
      const p = $("#coachPanel");
      p.innerHTML = html;
      p.classList.add("show");
    }
  }

  function renderOpenTask(task, idx) {
    const stage = $("#guidedStage");
    stage.innerHTML = `
      <article class="task-card">
        <div class="task-head">
          <span class="task-number">OPEN PRODUCTION · ${idx+1} / ${openTasks.length}</span>
          <div class="task-meta"><span>${task.level}</span><span>${escapeHtml(task.format || task.focus)}</span><span>${task.focus}</span></div>
        </div>
        <h3>${escapeHtml(task.title)}</h3>
        <div class="prompt-box">
          <h4>${escapeHtml(task.brief)}</h4>
          <ul>${task.points.map(p=>`<li>${escapeHtml(p)}</li>`).join("")}</ul>
        </div>
        <div class="live-metrics"><span>Suggested: ${task.min}–${task.max} words</span><span id="openWords">0 words</span></div>
        <textarea class="open-textarea" id="openText" placeholder="Write your response here…"></textarea>
        <div class="criteria-grid">
          <label><input type="checkbox" data-criterion="content"> <span>I included every required information point.</span></label>
          <label><input type="checkbox" data-criterion="structure"> <span>My message has a clear, logical order.</span></label>
          <label><input type="checkbox" data-criterion="register"> <span>My tone fits the professional situation.</span></label>
          <label><input type="checkbox" data-criterion="clarity"> <span>The reader knows exactly what happens next.</span></label>
        </div>
        <div class="task-actions">
          <button class="small-button primary" id="reviewOpen" type="button">REVIEW MY WRITING</button>
          <button class="small-button coach-only" id="showOpenHint" type="button">Hint</button>
          <button class="small-button coach-only" id="modelA" type="button">Model A2/B1</button>
          <button class="small-button coach-only" id="modelB" type="button">Model B1+/B2</button>
        </div>
        <div class="coach-panel" id="coachPanel"></div>
        <div class="feedback" id="taskFeedback"></div>
      </article>`;
    const ta = $("#openText");
    ta.addEventListener("input", () => $("#openWords").textContent = `${countWords(ta.value)} words`);
    $("#showOpenHint").addEventListener("click", () => showCoach(`<b>Coach hint</b><p>${escapeHtml(task.hint)}</p>`));
    $("#modelA").addEventListener("click", () => showCoach(`<b>Model · accessible</b><div class="model-answer">${escapeHtml(task.model1)}</div>`));
    $("#modelB").addEventListener("click", () => showCoach(`<b>Model · stronger</b><div class="model-answer">${escapeHtml(task.model2)}</div>`));
    $("#reviewOpen").addEventListener("click", () => {
      const text = ta.value.trim();
      const checks = $$('[data-criterion]').filter(x => x.checked).length;
      const words = countWords(text);
      const fb = $("#taskFeedback");
      if (words < 12) {
        fb.className = "feedback show bad";
        fb.innerHTML = `<b>Keep developing the response.</b><p>You currently have ${words} words. Focus first on including all required information points clearly.</p>`;
        return;
      }
      state.openCompleted.add(idx);
      fb.className = "feedback show info";
      fb.innerHTML = `
        <b>Structured review</b>
        <p>You wrote <b>${words} words</b> and checked <b>${checks}/4</b> communication criteria.</p>
        <p>${words < task.min ? "Your response is concise. Check that none of the required points are missing." : words > task.max ? "Your response is longer than the suggested training range. See whether any sentence can be simplified." : "Your length is within the suggested training range."}</p>
        <p>Now compare your response with both model levels. Look for <b>content, structure, register and clarity</b>—not identical wording.</p>
        <button class="small-button primary" id="nextTask" type="button">NEXT →</button>`;
      $("#nextTask").addEventListener("click", () => { state.guidedIndex++; renderGuidedTask(); });
      $("#openScore").textContent = `${state.openCompleted.size} / ${openTasks.length}`;
      updateProgress();
    });
    applySupportMode();

    function showCoach(html) {
      const p = $("#coachPanel");
      p.innerHTML = html;
      p.classList.add("show");
    }
  }

  function renderLadder() {
    $("#ladder").innerHTML = ladder.map((x,i)=>`
      <article class="ladder-card">
        <div class="ladder-step">${String(i+1).padStart(2,"0")}</div>
        <span>${x.level}</span>
        <h3>${escapeHtml(x.title)}</h3>
        <p>${escapeHtml(x.text)}</p>
      </article>`).join("");
  }

  function applySupportMode() {
    $$(".coach-only").forEach(el => el.style.display = state.supportMode === "guided" ? "" : "none");
    if (state.supportMode === "solo") {
      const p = $("#coachPanel");
      if (p) p.classList.remove("show");
    }
  }

  function startFinal() {
    const finalTask = finalTasks[state.selectedFinalTask];
    state.finalStarted = true;
    state.finalFinished = false;
    state.finalText = "";
    state.finalChecks = {};
    state.finalSeconds = finalTask.time || 480;
    $("#examContent").innerHTML = `
      <div class="exam-task-layout">
        <aside class="exam-brief">
          <span class="mini-label">${escapeHtml(finalTask.format)} · SCENARIO</span>
          <h3>${escapeHtml(finalTask.brief)}</h3>
          <p>Include all four points:</p>
          <ul>${finalTask.points.map(p=>`<li>${escapeHtml(p)}</li>`).join("")}</ul>
          <div class="official-note compact-note"><div class="official-icon">i</div><div><b>Training rule</b><p>No hints or models are available until you submit.</p></div></div>
        </aside>
        <div class="exam-writing-side">
          <div class="live-metrics"><span id="finalWordChip">0 words</span><span>Use C.L.E.A.R.</span></div>
          <textarea class="exam-textarea" id="finalText" placeholder="Write your professional reply here…"></textarea>
          <div class="task-actions"><button class="button primary" id="submitFinal" type="button">SUBMIT & REVIEW</button></div>
        </div>
      </div>`;
    const ta = $("#finalText");
    ta.addEventListener("input", () => {
      state.finalText = ta.value;
      const n = countWords(ta.value);
      $("#examWordCount").textContent = n;
      $("#finalWordChip").textContent = `${n} words`;
    });
    $("#submitFinal").addEventListener("click", finishFinal);
    clearInterval(state.timerId);
    state.timerId = setInterval(() => {
      state.finalSeconds--;
      updateFinalTimer();
      if (state.finalSeconds <= 0) finishFinal();
    }, 1000);
    updateFinalTimer();
  }

  function updateFinalTimer() {
    const s = Math.max(0, state.finalSeconds);
    const m = Math.floor(s/60);
    const sec = String(s%60).padStart(2,"0");
    $("#examTotalTime").textContent = `${m}:${sec}`;
    const total = finalTasks[state.selectedFinalTask]?.time || 480;
    const pct = s/total*100;
    $("#examTimerBar").style.width = `${pct}%`;
    $("#examTimerBar").style.background = pct > 45 ? "var(--green)" : pct > 20 ? "#e0a320" : "#c74c43";
  }

  function finishFinal() {
    if (state.finalFinished) return;
    const finalTask = finalTasks[state.selectedFinalTask];
    const ta = $("#finalText");
    if (ta) state.finalText = ta.value;
    if (!state.finalText.trim() && state.finalSeconds > 0) {
      alert("Write a response before submitting.");
      return;
    }
    state.finalFinished = true;
    clearInterval(state.timerId);
    const words = countWords(state.finalText);
    $("#finalWords").textContent = words;

    $("#examContent").innerHTML = `
      <div class="task-card">
        <div class="coach-label">POST-TASK REVIEW</div>
        <h3>Your writing is complete. Review it like an examiner would review communication.</h3>
        <div class="self-check">
          <label><input type="checkbox" data-final-check="content"> <span>I included all four required information points.</span></label>
          <label><input type="checkbox" data-final-check="purpose"> <span>The purpose and requested action are immediately clear.</span></label>
          <label><input type="checkbox" data-final-check="register"> <span>The tone is appropriately professional.</span></label>
          <label><input type="checkbox" data-final-check="accuracy"> <span>I checked dates, prepositions, verb forms and sentence clarity.</span></label>
        </div>
        <h4>Your response</h4>
        <div class="prompt-box"><p style="white-space:pre-wrap">${escapeHtml(state.finalText || "(No response entered)")}</p></div>
        <div class="model-comparison">
          <article><span class="mini-label">MODEL 1 · CLEAR & ACCESSIBLE</span><p>${escapeHtml(finalTask.model1)}</p></article>
          <article><span class="mini-label">MODEL 2 · STRONGER RANGE</span><p>${escapeHtml(finalTask.model2)}</p></article>
        </div>
        <div class="feedback show info"><b>How to compare</b><p>Do not ask “Did I write the same words?” Ask: Did I cover the same essential information? Is my order clear? Is my request explicit? Is my register appropriate? Could any sentence be misunderstood?</p></div>
      </div>`;

    $$('[data-final-check]').forEach(cb => cb.addEventListener("change", () => {
      state.finalChecks[cb.dataset.finalCheck] = cb.checked;
      updatePriorities();
    }));
    $("#resultsPanel").classList.add("show");
    completeSection(5);
    updatePriorities();
    updateProgress();
  }

  function updatePriorities() {
    const chips = [];
    if (!state.finalChecks.content) chips.push("Content coverage");
    if (!state.finalChecks.purpose) chips.push("Purpose & action");
    if (!state.finalChecks.register) chips.push("Professional register");
    if (!state.finalChecks.accuracy) chips.push("Accuracy & ambiguity check");
    if (state.guidedCorrect < 9) chips.push("Controlled writing accuracy");
    if (state.openCompleted.size < openTasks.length) chips.push("Additional writing formats");
    $("#priorityList").innerHTML = (chips.length ? chips : ["Maintain all four writing criteria"]).map(x=>`<span class="priority-chip">${x}</span>`).join("");
  }

  function wireGlobal() {
    wireScroll(document);

    $("#toggleFrench").addEventListener("click", () => {
      state.fr = !state.fr;
      document.body.classList.toggle("fr-hidden", !state.fr);
      $("#toggleFrench").setAttribute("aria-pressed", String(state.fr));
      $("#toggleFrench").textContent = state.fr ? "FR Coach ✓" : "FR Coach";
    });

    $("#guidedMode").addEventListener("click", () => {
      state.supportMode = "guided";
      $("#guidedMode").classList.add("active"); $("#soloMode").classList.remove("active");
      applySupportMode();
    });
    $("#soloMode").addEventListener("click", () => {
      state.supportMode = "solo";
      $("#soloMode").classList.add("active"); $("#guidedMode").classList.remove("active");
      applySupportMode();
    });

    ["levelFilter","typeFilter"].forEach(id => $("#"+id).addEventListener("change", renderPhrases));
    $("#phraseSearch").addEventListener("input", renderPhrases);

    $$(".section-done").forEach(btn => btn.addEventListener("click", () => {
      completeSection(Number(btn.dataset.complete));
      btn.textContent = "✓ Completed";
      btn.classList.add("completed");
    }));

    $("#openCoach").addEventListener("click", () => $("#coachDialog").showModal());
    $("#closeCoach").addEventListener("click", () => $("#coachDialog").close());

    $("#startExam").addEventListener("click", startFinal);

    $("#downloadReport").addEventListener("click", downloadReport);
    $("#exportProgress").addEventListener("click", exportProgress);

    $("#resetAll").addEventListener("click", () => {
      if (!confirm("Reset all Lesson 6 progress?")) return;
      location.reload();
    });
  }

  function wireScroll(root) {
    $$("[data-scroll]", root).forEach(btn => btn.addEventListener("click", () => {
      const el = $(btn.dataset.scroll);
      if (el) el.scrollIntoView({behavior:"smooth", block:"start"});
    }));
  }

  function completeSection(n) {
    state.completedSections.add(n);
    updateProgress();
  }

  function updateProgress() {
    const sectionPct = state.completedSections.size / 5 * 55;
    const microPct = Object.keys(state.guidedFirstAttempts).length / microTasks.length * 20;
    const openPct = state.openCompleted.size / openTasks.length * 15;
    const finalPct = state.finalFinished ? 10 : 0;
    const pct = Math.min(100, Math.round(sectionPct + microPct + openPct + finalPct));
    $("#progressLabel").textContent = `${pct}% complete`;
    $("#headerProgress").style.width = `${pct}%`;
    $("#pathwayScore").textContent = `${pct}%`;
  }

  function startLessonClock() {
    setInterval(() => {
      const sec = Math.floor((Date.now() - state.lessonStarted)/1000);
      const min = Math.floor(sec/60);
      const s = String(sec%60).padStart(2,"0");
      $("#lessonClock").textContent = `${String(min).padStart(2,"0")}:${s}`;
    }, 1000);
  }

  function downloadReport() {
    const lines = [
      "CLOE Success Path · Lesson 6 · Professional Written Production",
      "------------------------------------------------------------",
      `Controlled micro-tasks: ${state.guidedCorrect}/${microTasks.length}`,
      `Open production tasks completed: ${state.openCompleted.size}/${openTasks.length}`,
      `Final challenge format: ${finalTasks[state.selectedFinalTask]?.format || "not selected"}`,
      `Final independent writing: ${countWords(state.finalText)} words`,
      `Lesson completion: ${$("#pathwayScore").textContent}`,
      "",
      "Independent challenge response:",
      state.finalText || "(not completed)",
      "",
      "Self-review:",
      `Content coverage: ${state.finalChecks.content ? "checked" : "review"}`,
      `Purpose & action: ${state.finalChecks.purpose ? "checked" : "review"}`,
      `Professional register: ${state.finalChecks.register ? "checked" : "review"}`,
      `Accuracy & ambiguity: ${state.finalChecks.accuracy ? "checked" : "review"}`
    ];
    downloadBlob(lines.join("\n"), "CLOE_Lesson_06_Writing_Report.txt", "text/plain");
  }

  function exportProgress() {
    const data = {
      lesson: 6,
      title: "Professional Written Production",
      controlledScore: `${state.guidedCorrect}/${microTasks.length}`,
      openTasksCompleted: `${state.openCompleted.size}/${openTasks.length}`,
      finalFormat: finalTasks[state.selectedFinalTask]?.format || null,
      finalWords: countWords(state.finalText),
      finalChecks: state.finalChecks,
      completion: $("#pathwayScore").textContent,
      exportedAt: new Date().toISOString()
    };
    downloadBlob(JSON.stringify(data,null,2), "CLOE_Lesson_06_Writing_Progress.json", "application/json");
  }

  function downloadBlob(content, filename, type) {
    const blob = new Blob([content], {type});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 100);
  }

  function countWords(text) {
    const t = text.trim();
    return t ? t.split(/\s+/).filter(Boolean).length : 0;
  }

  function normalize(s) {
    return String(s||"").trim().toLowerCase().replace(/[.,!?;:]+$/,"").replace(/\s+/g," ");
  }

  function escapeHtml(s) {
    return String(s ?? "").replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  }

  document.addEventListener("DOMContentLoaded", init);
})();
