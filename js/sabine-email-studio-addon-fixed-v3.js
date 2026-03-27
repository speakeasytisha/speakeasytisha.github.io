(function () {
  'use strict';

  var state = {
    showFr: true,
    voice: 'UK',
    scenarioId: 'timeline',
    orderSelected: []
  };

  var vocabItems = [
    { icon: '👋', category: 'greetings', en: 'Dear Emma and Lucas,', fr: 'Chère Emma et Lucas,', definition: 'A polite greeting at the start of an email.', example: 'Dear Emma and Lucas, I am writing to confirm the wedding timeline.' },
    { icon: '🌞', category: 'greetings', en: 'Good morning,', fr: 'Bonjour,', definition: 'A simple professional greeting.', example: 'Good morning, I am following up about the florist delivery.' },
    { icon: '☎️', category: 'greetings', en: 'Hello Sabine, this is Emma calling.', fr: 'Bonjour Sabine, Emma à l’appareil.', definition: 'A natural way to present yourself on the phone.', example: 'Hello Sabine, this is Emma calling about the final timeline.' },
    { icon: '🤝', category: 'greetings', en: 'Hi, how are you?', fr: 'Bonjour, comment allez-vous ?', definition: 'A friendly opening at the start of a meeting.', example: 'Hi, how are you? Thank you for meeting with me today.' },
    { icon: '🙂', category: 'greetings', en: 'Fine, thank you. And you?', fr: 'Bien, merci. Et vous ?', definition: 'A simple polite answer in a meeting or on a call.', example: 'Fine, thank you. And you?' },
    { icon: '📝', category: 'subjects', en: 'Subject: Final timeline confirmation', fr: 'Objet : confirmation du planning final', definition: 'The subject line tells the reader the topic immediately.', example: 'Subject: Final timeline confirmation' },
    { icon: '🌧️', category: 'subjects', en: 'Subject: Rain plan for Saturday', fr: 'Objet : plan pluie pour samedi', definition: 'A clear subject line for a problem or update.', example: 'Subject: Rain plan for Saturday' },
    { icon: '👥', category: 'subjects', en: 'Subject: Final guest count and venue meeting', fr: 'Objet : nombre final d’invités et réunion avec le lieu', definition: 'A subject line for guest numbers and a venue check.', example: 'Subject: Final guest count and venue meeting' },
    { icon: '❓', category: 'questions', en: 'Could you confirm…?', fr: 'Pourriez-vous confirmer… ?', definition: 'A polite question for confirmation.', example: 'Could you confirm the final guest list by Thursday?' },
    { icon: '⏰', category: 'questions', en: 'What time…?', fr: 'À quelle heure… ?', definition: 'A question to ask about a schedule.', example: 'What time does the photographer arrive at the venue?' },
    { icon: '🙏', category: 'requests', en: 'Could you please send…?', fr: 'Pourriez-vous envoyer… s’il vous plaît ?', definition: 'A polite request with could you please.', example: 'Could you please send the updated menu today?' },
    { icon: '📩', category: 'requests', en: 'Please let me know…', fr: 'Merci de me dire…', definition: 'A softer way to request information.', example: 'Please let me know if the couple would like a vegan option.' },
    { icon: '📤', category: 'requests', en: 'Could you please send me any final changes by Thursday evening?', fr: 'Pourriez-vous m’envoyer les derniers changements d’ici jeudi soir ?', definition: 'A polite request for final changes before a deadline.', example: 'Could you please send me any final changes by Thursday evening?' },
    { icon: '⚠️', category: 'problems', en: 'There is a problem with…', fr: 'Il y a un problème avec…', definition: 'A calm way to describe a problem.', example: 'There is a problem with the delivery time for the chairs.' },
    { icon: '🚚', category: 'problems', en: 'The delivery is late.', fr: 'La livraison est en retard.', definition: 'A direct phrase for a delay.', example: 'The delivery is late, so I am checking another option.' },
    { icon: '💛', category: 'reassurance', en: 'Do not worry, I will…', fr: 'Ne vous inquiétez pas, je vais…', definition: 'A reassuring phrase with will.', example: 'Do not worry, I will update the seating plan today.' },
    { icon: '🔎', category: 'reassurance', en: 'I am checking this now.', fr: 'Je vérifie cela maintenant.', definition: 'A reassuring phrase for an action in progress.', example: 'I am checking this now and I will come back to you shortly.' },
    { icon: '✅', category: 'reassurance', en: 'I will confirm the guest count with the venue before the meeting.', fr: 'Je confirmerai le nombre d’invités avec le lieu avant la réunion.', definition: 'A reassuring line when you take responsibility for the next step.', example: 'I will confirm the guest count with the venue before the meeting.' },
    { icon: '🔁', category: 'follow-up', en: 'I am following up on…', fr: 'Je reviens vers vous au sujet de…', definition: 'A phrase for a follow-up email.', example: 'I am following up on the final table plan.' },
    { icon: '📅', category: 'follow-up', en: 'As discussed…', fr: 'Comme convenu…', definition: 'A phrase to refer to a previous conversation.', example: 'As discussed, the ceremony starts at 3 PM.' },
    { icon: '📍', category: 'instructions', en: 'Please arrive at…', fr: 'Merci d’arriver à…', definition: 'A polite instruction about place or time.', example: 'Please arrive at the venue at 1 PM.' },
    { icon: '📎', category: 'instructions', en: 'Please find attached…', fr: 'Veuillez trouver ci-joint…', definition: 'A formal phrase for an attachment.', example: 'Please find attached the updated schedule.' },
    { icon: '🌷', category: 'closing', en: 'Thank you for your help.', fr: 'Merci pour votre aide.', definition: 'A polite closing line.', example: 'Thank you for your help and your quick reply.' },
    { icon: '💐', category: 'closing', en: 'Best regards,', fr: 'Cordialement,', definition: 'A professional ending before the name.', example: 'Best regards,' },
    { icon: '✨', category: 'closing', en: 'Kind regards,', fr: 'Bien cordialement,', definition: 'A polite and warm ending.', example: 'Kind regards,' }
  ];

  var phraseFamilies = [
    {
      title: '👋 Greetings',
      note: 'Use these at the beginning of an email, a call, or a meeting.',
      fr: 'Utilise ces phrases au début d’un e-mail, d’un appel ou d’une réunion.',
      items: [
        { en: '<span class="hl-structure">Dear</span> Emma and Lucas,', fr: 'Chère Emma et Lucas,', when: 'When you know the names in an email.', icon: '👋' },
        { en: '<span class="hl-structure">Good morning</span>,', fr: 'Bonjour,', when: 'When you want a simple professional opening in an email.', icon: '🌞' },
        { en: 'Hello Sabine, <span class="hl-structure">this is</span> Emma <span class="hl-verb">calling</span>.', fr: 'Bonjour Sabine, Emma à l’appareil.', when: 'When you begin a phone call and present yourself.', icon: '☎️' },
        { en: '<span class="hl-structure">Hi, how are you?</span>', fr: 'Bonjour, comment allez-vous ?', when: 'At the start of a meeting.', icon: '🤝' },
        { en: '<span class="hl-structure">Fine, thank you. And you?</span>', fr: 'Bien, merci. Et vous ?', when: 'To answer politely in a meeting or on a call.', icon: '🙂' }
      ]
    },
    {
      title: '📝 Subject lines',
      note: 'Use a short subject that says the topic immediately.',
      fr: 'Utilise un objet court qui dit immédiatement le sujet.',
      items: [
        { en: '<span class="hl-vocab">Subject:</span> <span class="hl-structure">Final timeline confirmation</span>', fr: 'Objet : confirmation du planning final', when: 'For the last version of the schedule.', icon: '📋' },
        { en: '<span class="hl-vocab">Subject:</span> <span class="hl-structure">Rain plan for Saturday</span>', fr: 'Objet : plan pluie pour samedi', when: 'For a weather update or backup plan.', icon: '🌧️' },
        { en: '<span class="hl-vocab">Subject:</span> <span class="hl-structure">Final guest count and venue meeting</span>', fr: 'Objet : nombre final d’invités et réunion avec le lieu', when: 'For guest numbers and a venue check.', icon: '👥' }
      ]
    },
    {
      title: '❓ Questions and requests',
      note: 'The polite helper is often <code>could</code>.',
      fr: 'Le mot de politesse est souvent <code>could</code>.',
      items: [
        { en: '<span class="hl-polite">Could you please</span> <span class="hl-verb">confirm</span> the final guest list?', fr: 'Pourriez-vous confirmer la liste finale des invités ?', when: 'When you need confirmation.', icon: '👥' },
        { en: '<span class="hl-polite">Could you please</span> <span class="hl-verb">send</span> the updated menu?', fr: 'Pourriez-vous envoyer le menu mis à jour ?', when: 'When you need a document or file.', icon: '🍽️' },
        { en: '<span class="hl-polite">Please let me know</span> if the couple would like a vegan option.', fr: 'Merci de me dire si le couple souhaite une option vegan.', when: 'When you need an answer but want a softer request.', icon: '🥗' },
        { en: '<span class="hl-polite">Could you please send me</span> any final changes <span class="hl-prep">by</span> Thursday evening?', fr: 'Pourriez-vous m’envoyer les derniers changements d’ici jeudi soir ?', when: 'When you need final information before a deadline.', icon: '📤' }
      ]
    },
    {
      title: '⚠️ Problems',
      note: 'Say the problem calmly and clearly.',
      fr: 'Dis le problème calmement et clairement.',
      items: [
        { en: '<span class="hl-structure">There is a problem with</span> the chair delivery.', fr: 'Il y a un problème avec la livraison des chaises.', when: 'When something is not correct.', icon: '🪑' },
        { en: 'The <span class="hl-vocab">delivery</span> is <span class="hl-vocab">late</span>.', fr: 'La livraison est en retard.', when: 'When you need to describe a delay.', icon: '🚚' }
      ]
    },
    {
      title: '💛 Reassurance',
      note: 'Use <code>will</code> for a promise and present continuous for an action now.',
      fr: 'Utilise <code>will</code> pour une promesse et le présent continu pour une action maintenant.',
      items: [
        { en: '<span class="hl-polite">Do not worry</span>, I <span class="hl-verb">will update</span> the seating plan today.', fr: 'Ne vous inquiétez pas, je mettrai à jour le plan de table aujourd’hui.', when: 'When the client is stressed.', icon: '💛' },
        { en: 'I <span class="hl-verb">am checking</span> this <span class="hl-prep">now</span>.', fr: 'Je vérifie cela maintenant.', when: 'When you want to reassure with an action in progress.', icon: '🔎' },
        { en: 'I <span class="hl-verb">will confirm</span> the <span class="hl-vocab">guest count</span> with the <span class="hl-vocab">venue</span> before the <span class="hl-vocab">meeting</span>.', fr: 'Je confirmerai le nombre d’invités avec le lieu avant la réunion.', when: 'When you take responsibility for the next step.', icon: '✅' }
      ]
    },
    {
      title: '🔁 Follow-up and instructions',
      note: 'Use these after a previous exchange or to give practical details.',
      fr: 'Utilise ces phrases après un échange précédent ou pour donner des détails pratiques.',
      items: [
        { en: 'I <span class="hl-verb">am following up</span> on the florist delivery.', fr: 'Je reviens vers vous au sujet de la livraison du fleuriste.', when: 'For a follow-up email.', icon: '🌸' },
        { en: '<span class="hl-structure">As discussed</span>, the ceremony starts <span class="hl-prep">at</span> 3 PM.', fr: 'Comme convenu, la cérémonie commence à 15 h.', when: 'When you refer to an earlier discussion.', icon: '⛪' },
        { en: '<span class="hl-polite">Please arrive</span> <span class="hl-prep">at</span> the venue <span class="hl-prep">at</span> 1 PM.', fr: 'Merci d’arriver au lieu de réception à 13 h.', when: 'For clear instructions.', icon: '📍' }
      ]
    },
    {
      title: '💐 Polite closing',
      note: 'Thank the person and end warmly.',
      fr: 'Remercie la personne et termine chaleureusement.',
      items: [
        { en: '<span class="hl-structure">Thank you for your help.</span>', fr: 'Merci pour votre aide.', when: 'Before your final closing.', icon: '🌷' },
        { en: '<span class="hl-structure">Best regards,</span>', fr: 'Cordialement,', when: 'A professional ending.', icon: '💐' },
        { en: '<span class="hl-structure">Kind regards,</span>', fr: 'Bien cordialement,', when: 'A polite and slightly warmer ending.', icon: '✨' }
      ]
    }
  ];

  var scenarios = {
    timeline: {
      label: 'Final timeline',
      icon: '📋',
      summary: 'The couple wants the final schedule. Sabine confirms the timeline and explains how she will confirm the final guest count with the venue.',
      summaryFr: 'Le couple veut le planning final. Sabine confirme le programme et explique comment elle va confirmer le nombre final d’invités avec le lieu.',
      original: {
        title: 'Client email',
        subject: 'Final timeline confirmation',
        from: 'Emma and Lucas',
        to: 'Sabine',
        lines: [
          'Dear Sabine,',
          'We hope you are well.',
          'Could you please send us the final timeline for Saturday?',
          'We would also like the venue to have the final guest count before the meeting.',
          'Thank you very much.',
          'Best regards,',
          'Emma and Lucas'
        ],
        html: [
          '<p><span class="hl-vocab">Dear</span> Sabine,</p>',
          '<p>We hope you are well.</p>',
          '<p><span class="hl-polite">Could you please</span> <span class="hl-verb">send</span> us the <span class="hl-vocab">final timeline</span> for <span class="hl-prep">Saturday</span>?</p>',
          '<p>We would also like the <span class="hl-vocab">venue</span> to have the <span class="hl-vocab">final guest count</span> before the <span class="hl-vocab">meeting</span>.</p>',
          '<p>Thank you very much.</p>',
          '<p><span class="hl-structure">Best regards</span>,</p>',
          '<p>Emma and Lucas</p>'
        ]
      },
      reply: {
        title: 'Polite reply',
        subject: 'Re: Final timeline confirmation',
        from: 'Sabine',
        to: 'Emma and Lucas',
        lines: [
          'Dear Emma and Lucas,',
          'Thank you for your email.',
          'I am writing to confirm the final timeline for Saturday.',
          'The ceremony starts at 3 PM and the cocktail starts at 4 PM.',
          'I will confirm the final guest count with the venue before the meeting.',
          'Could you please send me any final changes by Thursday evening?',
          'Please find attached the updated schedule.',
          'Kind regards,',
          'Sabine'
        ],
        html: [
          '<p><span class="hl-vocab">Dear</span> Emma and Lucas,</p>',
          '<p><span class="hl-structure">Thank you for your email.</span></p>',
          '<p>I <span class="hl-verb">am writing</span> to <span class="hl-verb">confirm</span> the <span class="hl-vocab">final timeline</span> for <span class="hl-prep">Saturday</span>.</p>',
          '<p>The <span class="hl-vocab">ceremony</span> starts <span class="hl-prep">at</span> 3 PM and the <span class="hl-vocab">cocktail</span> starts <span class="hl-prep">at</span> 4 PM.</p>',
          '<p>I <span class="hl-verb">will confirm</span> the <span class="hl-vocab">final guest count</span> with the <span class="hl-vocab">venue</span> before the <span class="hl-vocab">meeting</span>.</p>',
          '<p><span class="hl-polite">Could you please send me</span> any final changes <span class="hl-prep">by</span> Thursday evening?</p>',
          '<p><span class="hl-polite">Please find attached</span> the <span class="hl-vocab">updated schedule</span>.</p>',
          '<p><span class="hl-structure">Kind regards</span>,</p>',
          '<p>Sabine</p>'
        ]
      },
      phone: [
        { who: 'Client', html: 'Hello Sabine, this is Emma calling.' },
        { who: 'Sabine', html: 'Hello Emma. How can I help you?' },
        { who: 'Client', html: 'Could you please confirm the final timeline for Saturday?' },
        { who: 'Sabine', html: 'Yes. I <span class="hl-verb">am checking</span> the <span class="hl-vocab">timeline</span> now.' },
        { who: 'Sabine', html: 'The <span class="hl-vocab">ceremony</span> starts <span class="hl-prep">at</span> 3 PM and the <span class="hl-vocab">cocktail</span> starts <span class="hl-prep">at</span> 4 PM.' },
        { who: 'Sabine', html: 'I <span class="hl-verb">will confirm</span> the <span class="hl-vocab">guest count</span> with the <span class="hl-vocab">venue</span> before the <span class="hl-vocab">meeting</span>.' },
        { who: 'Sabine', html: '<span class="hl-polite">Could you please send me</span> any final changes <span class="hl-prep">by</span> Thursday evening?' }
      ],
      meeting: [
        { who: 'Client', html: 'Hi, how are you?' },
        { who: 'Sabine', html: 'Fine, thank you. And you?' },
        { who: 'Client', html: 'Fine, thank you.' },
        { who: 'Sabine', html: 'Today I would like to review the <span class="hl-vocab">timeline</span> with you.' },
        { who: 'Sabine', html: 'First, the <span class="hl-vocab">ceremony</span> starts at 3 PM.' },
        { who: 'Sabine', html: 'Then the <span class="hl-vocab">cocktail</span> starts at 4 PM.' },
        { who: 'Sabine', html: 'I <span class="hl-verb">will confirm</span> the <span class="hl-vocab">guest count</span> with the <span class="hl-vocab">venue</span> before the <span class="hl-vocab">meeting</span>.' }
      ],
      builderChoices: {
        subject: ['Final timeline confirmation', 'Final guest count and venue meeting', 'Updated schedule for Saturday'],
        greeting: ['Dear Emma and Lucas,', 'Good morning,', 'Hello,'],
        opening: ['Thank you for your email.', 'I hope you are well.', 'I am writing to confirm the final timeline for Saturday.'],
        detail: ['The ceremony starts at 3 PM and the cocktail starts at 4 PM.', 'Please find attached the updated schedule.', 'As discussed, the venue meeting is on Friday afternoon.'],
        request: ['Could you please send me any final changes by Thursday evening?', 'Please let me know if there are any changes to the guest list.', 'Could you please confirm the final guest list?'],
        reassurance: ['I will confirm the final guest count with the venue before the meeting.', 'Do not worry, I am checking everything now.', 'I will keep you updated.'],
        closing: ['Kind regards,\nSabine', 'Best regards,\nSabine', 'Thank you for your help.\nSabine']
      },
      orderCorrect: [
        'Dear Emma and Lucas,',
        'Thank you for your email.',
        'I am writing to confirm the final timeline for Saturday.',
        'I will confirm the final guest count with the venue before the meeting.',
        'Could you please send me any final changes by Thursday evening?',
        'Kind regards,'
      ]
    },
    menu: {
      label: 'Menu update',
      icon: '🍽️',
      summary: 'The couple asks about dietary restrictions. Sabine writes to the caterer, then replies to the couple.',
      summaryFr: 'Le couple pose une question sur les restrictions alimentaires. Sabine écrit au traiteur puis répond au couple.',
      original: {
        title: 'Client email',
        subject: 'Dietary restrictions for the menu',
        from: 'Laura and Benjamin',
        to: 'Sabine',
        lines: [
          'Good morning Sabine,',
          'We have two guests with gluten-free meals and one guest with a vegan meal.',
          'Could you please let us know if the menu can be updated?',
          'Thank you for your help.',
          'Best regards,',
          'Laura and Benjamin'
        ],
        html: [
          '<p><span class="hl-structure">Good morning</span> Sabine,</p>',
          '<p>We have two guests with <span class="hl-vocab">gluten-free meals</span> and one guest with a <span class="hl-vocab">vegan meal</span>.</p>',
          '<p><span class="hl-polite">Could you please</span> let us know if the <span class="hl-vocab">menu</span> can be <span class="hl-verb">updated</span>?</p>',
          '<p><span class="hl-structure">Thank you for your help.</span></p>',
          '<p><span class="hl-structure">Best regards</span>,</p>',
          '<p>Laura and Benjamin</p>'
        ]
      },
      reply: {
        title: 'Reply to the couple',
        subject: 'Re: Dietary restrictions for the menu',
        from: 'Sabine',
        to: 'Laura and Benjamin',
        lines: [
          'Dear Laura and Benjamin,',
          'Thank you for your message.',
          'I am following up with the caterer about the gluten-free and vegan meals.',
          'I am checking the updated menu now and I will send you a confirmation this afternoon.',
          'Please let me know if there are any other dietary restrictions.',
          'Best regards,',
          'Sabine'
        ],
        html: [
          '<p><span class="hl-vocab">Dear</span> Laura and Benjamin,</p>',
          '<p><span class="hl-structure">Thank you for your message.</span></p>',
          '<p>I <span class="hl-verb">am following up</span> with the <span class="hl-vocab">caterer</span> about the <span class="hl-vocab">gluten-free</span> and <span class="hl-vocab">vegan meals</span>.</p>',
          '<p>I <span class="hl-verb">am checking</span> the <span class="hl-vocab">updated menu</span> now and I <span class="hl-verb">will send</span> you a confirmation this afternoon.</p>',
          '<p><span class="hl-polite">Please let me know</span> if there are any other <span class="hl-vocab">dietary restrictions</span>.</p>',
          '<p><span class="hl-structure">Best regards</span>,</p>',
          '<p>Sabine</p>'
        ]
      },
      phone: [
        { who: 'Client', html: 'Hello Sabine, can the <span class="hl-vocab">menu</span> be updated for gluten-free and vegan guests?' },
        { who: 'Sabine', html: 'Yes, of course. I <span class="hl-verb">am checking</span> this with the <span class="hl-vocab">caterer</span> now.' },
        { who: 'Sabine', html: 'I <span class="hl-verb">will send</span> you a confirmation this afternoon.' },
        { who: 'Sabine', html: '<span class="hl-polite">Please let me know</span> if there are any other dietary restrictions.' }
      ],
      meeting: [
        { who: 'Sabine', html: 'During the menu meeting, we need to review the <span class="hl-vocab">dietary restrictions</span>.' },
        { who: 'Sabine', html: 'At the moment, we have two <span class="hl-vocab">gluten-free meals</span> and one <span class="hl-vocab">vegan meal</span>.' },
        { who: 'Sabine', html: 'I <span class="hl-verb">am following up</span> with the <span class="hl-vocab">caterer</span> today.' },
        { who: 'Sabine', html: 'I <span class="hl-verb">will confirm</span> the final menu before Friday.' }
      ],
      builderChoices: {
        subject: ['Dietary restrictions for the menu', 'Updated menu information', 'Caterer follow-up'],
        greeting: ['Dear Laura and Benjamin,', 'Good morning,', 'Hello,'],
        opening: ['Thank you for your message.', 'I hope you are well.', 'I am writing to follow up on the menu.'],
        detail: ['I am following up with the caterer about the gluten-free and vegan meals.', 'I am checking the updated menu now.', 'The caterer is reviewing the dietary restrictions today.'],
        request: ['Please let me know if there are any other dietary restrictions.', 'Could you please confirm if there are any other menu changes?', 'Please send me any final menu changes today.'],
        reassurance: ['I will send you a confirmation this afternoon.', 'Do not worry, I am checking this now.', 'I will keep you updated.'],
        closing: ['Best regards,\nSabine', 'Kind regards,\nSabine', 'Thank you for your help.\nSabine']
      },
      orderCorrect: [
        'Dear Laura and Benjamin,',
        'Thank you for your message.',
        'I am following up with the caterer about the gluten-free and vegan meals.',
        'Please let me know if there are any other dietary restrictions.',
        'Best regards,'
      ]
    },
    rain: {
      label: 'Rain plan',
      icon: '🌧️',
      summary: 'The weather forecast changes. Sabine reassures the couple and gives clear instructions for the backup plan.',
      summaryFr: 'La météo change. Sabine rassure le couple et donne des instructions claires pour le plan B.',
      original: {
        title: 'Client email',
        subject: 'Rain plan for Saturday',
        from: 'Nora and Thomas',
        to: 'Sabine',
        lines: [
          'Dear Sabine,',
          'We are worried about the weather for Saturday.',
          'Could you please let us know what the rain plan is?',
          'Thank you very much.',
          'Kind regards,',
          'Nora and Thomas'
        ],
        html: [
          '<p><span class="hl-vocab">Dear</span> Sabine,</p>',
          '<p>We are <span class="hl-vocab">worried</span> about the <span class="hl-vocab">weather</span> for Saturday.</p>',
          '<p><span class="hl-polite">Could you please</span> let us know what the <span class="hl-vocab">rain plan</span> is?</p>',
          '<p>Thank you very much.</p>',
          '<p><span class="hl-structure">Kind regards</span>,</p>',
          '<p>Nora and Thomas</p>'
        ]
      },
      reply: {
        title: 'Reassuring reply',
        subject: 'Re: Rain plan for Saturday',
        from: 'Sabine',
        to: 'Nora and Thomas',
        lines: [
          'Dear Nora and Thomas,',
          'Thank you for your email.',
          'Do not worry, I am checking the latest weather update now.',
          'If it rains, the ceremony will take place inside the reception hall.',
          'Please arrive at the venue at 1 PM for the updated briefing.',
          'I will confirm the final plan tomorrow morning.',
          'Kind regards,',
          'Sabine'
        ],
        html: [
          '<p><span class="hl-vocab">Dear</span> Nora and Thomas,</p>',
          '<p><span class="hl-structure">Thank you for your email.</span></p>',
          '<p><span class="hl-polite">Do not worry</span>, I <span class="hl-verb">am checking</span> the latest <span class="hl-vocab">weather update</span> now.</p>',
          '<p>If it <span class="hl-verb">rains</span>, the <span class="hl-vocab">ceremony</span> will take place <span class="hl-prep">inside</span> the <span class="hl-vocab">reception hall</span>.</p>',
          '<p><span class="hl-polite">Please arrive</span> <span class="hl-prep">at</span> the <span class="hl-vocab">venue</span> <span class="hl-prep">at</span> 1 PM for the updated briefing.</p>',
          '<p>I <span class="hl-verb">will confirm</span> the final plan tomorrow morning.</p>',
          '<p><span class="hl-structure">Kind regards</span>,</p>',
          '<p>Sabine</p>'
        ]
      },
      phone: [
        { who: 'Client', html: 'Hello Sabine, we are worried about the weather for Saturday.' },
        { who: 'Sabine', html: '<span class="hl-polite">Do not worry</span>. I <span class="hl-verb">am checking</span> the latest weather update now.' },
        { who: 'Sabine', html: 'If it rains, the <span class="hl-vocab">ceremony</span> will take place <span class="hl-prep">inside</span> the <span class="hl-vocab">reception hall</span>.' },
        { who: 'Sabine', html: 'I <span class="hl-verb">will confirm</span> the final plan tomorrow morning.' }
      ],
      meeting: [
        { who: 'Sabine', html: 'Let us review the <span class="hl-vocab">rain plan</span> together.' },
        { who: 'Sabine', html: 'If the weather changes, the ceremony moves <span class="hl-prep">inside</span> the hall.' },
        { who: 'Sabine', html: '<span class="hl-polite">Please arrive</span> <span class="hl-prep">at</span> the <span class="hl-vocab">venue</span> early for the updated briefing.' },
        { who: 'Sabine', html: 'I <span class="hl-verb">will send</span> the final confirmation tomorrow morning.' }
      ],
      builderChoices: {
        subject: ['Rain plan for Saturday', 'Weather update for Saturday', 'Updated ceremony plan'],
        greeting: ['Dear Nora and Thomas,', 'Good afternoon,', 'Hello,'],
        opening: ['Thank you for your email.', 'I hope you are well.', 'I am following up on the weather update.'],
        detail: ['If it rains, the ceremony will take place inside the reception hall.', 'I am checking the latest weather update now.', 'The updated briefing is at the venue at 1 PM.'],
        request: ['Please let me know if you have any questions.', 'Could you please confirm that this plan is clear?', 'Please let me know if you need any other information.'],
        reassurance: ['Do not worry, I will confirm the final plan tomorrow morning.', 'I will send the final confirmation tomorrow morning.', 'I will keep you updated.'],
        closing: ['Kind regards,\nSabine', 'Best regards,\nSabine', 'Thank you for your understanding.\nSabine']
      },
      orderCorrect: [
        'Dear Nora and Thomas,',
        'Thank you for your email.',
        'Do not worry, I am checking the latest weather update now.',
        'Please arrive at the venue at 1 PM for the updated briefing.',
        'Kind regards,'
      ]
    },
    chairs: {
      label: 'Late chairs',
      icon: '🪑',
      summary: 'The supplier delivery is late. Sabine writes a follow-up, explains the problem, and reassures the couple.',
      summaryFr: 'La livraison du fournisseur est en retard. Sabine écrit un suivi, explique le problème et rassure le couple.',
      original: {
        title: 'Supplier email',
        subject: 'Delay with the chair delivery',
        from: 'Event Rental Team',
        to: 'Sabine',
        lines: [
          'Good afternoon Sabine,',
          'There is a delay with the chair delivery for Saturday.',
          'The new arrival time is 11:30 AM.',
          'Please let us know if this causes a problem.',
          'Best regards,',
          'Event Rental Team'
        ],
        html: [
          '<p><span class="hl-structure">Good afternoon</span> Sabine,</p>',
          '<p>There is a <span class="hl-vocab">delay</span> with the <span class="hl-vocab">chair delivery</span> for Saturday.</p>',
          '<p>The new <span class="hl-vocab">arrival time</span> is 11:30 AM.</p>',
          '<p><span class="hl-polite">Please let us know</span> if this causes a problem.</p>',
          '<p><span class="hl-structure">Best regards</span>,</p>',
          '<p>Event Rental Team</p>'
        ]
      },
      reply: {
        title: 'Follow-up reply',
        subject: 'Re: Delay with the chair delivery',
        from: 'Sabine',
        to: 'Event Rental Team',
        lines: [
          'Good afternoon,',
          'Thank you for your message.',
          'There is a problem with the new delivery time because the setup starts at 11 AM.',
          'Could you please confirm whether an earlier delivery is possible?',
          'I am checking another option now and I will keep you updated.',
          'Kind regards,',
          'Sabine'
        ],
        html: [
          '<p><span class="hl-structure">Good afternoon</span>,</p>',
          '<p><span class="hl-structure">Thank you for your message.</span></p>',
          '<p>There is a <span class="hl-vocab">problem</span> with the new <span class="hl-vocab">delivery time</span> because the <span class="hl-vocab">setup</span> starts <span class="hl-prep">at</span> 11 AM.</p>',
          '<p><span class="hl-polite">Could you please</span> <span class="hl-verb">confirm</span> whether an earlier <span class="hl-vocab">delivery</span> is possible?</p>',
          '<p>I <span class="hl-verb">am checking</span> another option now and I <span class="hl-verb">will keep</span> you updated.</p>',
          '<p><span class="hl-structure">Kind regards</span>,</p>',
          '<p>Sabine</p>'
        ]
      },
      phone: [
        { who: 'Supplier', html: 'Hello Sabine, the <span class="hl-vocab">chair delivery</span> is late.' },
        { who: 'Sabine', html: 'Thank you for the update. There is a <span class="hl-vocab">problem</span> because the <span class="hl-vocab">setup</span> starts at 11 AM.' },
        { who: 'Sabine', html: '<span class="hl-polite">Could you please</span> confirm whether an earlier delivery is possible?' },
        { who: 'Sabine', html: 'I <span class="hl-verb">am checking</span> another option now and I <span class="hl-verb">will keep</span> the couple updated.' }
      ],
      meeting: [
        { who: 'Sabine', html: 'In this meeting, I want to explain the <span class="hl-vocab">delivery problem</span> clearly.' },
        { who: 'Sabine', html: 'The <span class="hl-vocab">chair delivery</span> is late, but I <span class="hl-verb">am checking</span> another option.' },
        { who: 'Sabine', html: '<span class="hl-polite">Do not worry</span>. I <span class="hl-verb">will update</span> you as soon as I have confirmation.' },
        { who: 'Sabine', html: 'For the moment, the <span class="hl-vocab">setup</span> still starts at 11 AM.' }
      ],
      builderChoices: {
        subject: ['Delay with the chair delivery', 'Delivery update for Saturday', 'Urgent chair delivery follow-up'],
        greeting: ['Good afternoon,', 'Dear team,', 'Hello,'],
        opening: ['Thank you for your message.', 'I am following up on the delivery update.', 'I hope you are well.'],
        detail: ['There is a problem with the new delivery time because the setup starts at 11 AM.', 'The setup starts at 11 AM, so the new delivery time is difficult.', 'I am checking another option now.'],
        request: ['Could you please confirm whether an earlier delivery is possible?', 'Please let me know if the chairs can arrive before 11 AM.', 'Could you please send me an updated delivery time?'],
        reassurance: ['I will keep you updated.', 'I am checking another option now and I will keep you updated.', 'Do not worry, I am working on this now.'],
        closing: ['Kind regards,\nSabine', 'Best regards,\nSabine', 'Thank you for your quick reply.\nSabine']
      },
      orderCorrect: [
        'Good afternoon,',
        'Thank you for your message.',
        'There is a problem with the new delivery time because the setup starts at 11 AM.',
        'Could you please confirm whether an earlier delivery is possible?',
        'Kind regards,'
      ]
    }
  };

  var quizItems = [
    { prompt: 'You start a phone call politely.', choices: ['Hello Sabine, this is Emma calling.', 'Sabine. Emma here.', 'Hi Sabine calling Emma.'], answer: 'Hello Sabine, this is Emma calling.', explain: 'Use Hello + name + this is + name + calling.' },
    { prompt: 'You begin a meeting politely.', choices: ['Hi, how are you?', 'You are fine?', 'How are?'], answer: 'Hi, how are you?', explain: 'This is a simple polite opening for a meeting.' },
    { prompt: 'You want to ask for confirmation politely.', choices: ['Could you please confirm the final guest count?', 'Confirm the guest count now.', 'I confirm the guest count yesterday.'], answer: 'Could you please confirm the final guest count?', explain: 'Use could you please + base verb for a polite request.' },
    { prompt: 'You want to reassure a stressed couple.', choices: ['Do not worry, I will update the seating plan today.', 'The seating plan worries me.', 'I updated tomorrow.'], answer: 'Do not worry, I will update the seating plan today.', explain: 'Use Do not worry + will for reassurance and a promise.' },
    { prompt: 'You want to attach a document politely.', choices: ['Please find attached the updated schedule.', 'Attach schedule.', 'I am attach the schedule.'], answer: 'Please find attached the updated schedule.', explain: 'This is a standard polite attachment phrase.' },
    { prompt: 'You want to follow up after a previous exchange.', choices: ['I am following up on the florist delivery.', 'I follow florist yesterday.', 'Follow-up florist.'], answer: 'I am following up on the florist delivery.', explain: 'Use I am following up on… for a professional follow-up.' },
    { prompt: 'You want to ask about a schedule.', choices: ['What time does the photographer arrive at the venue?', 'What time photographer arrive?', 'When the photographer arrived?'], answer: 'What time does the photographer arrive at the venue?', explain: 'Use What time + does + subject + base verb.' },
    { prompt: 'You want to give an instruction politely.', choices: ['Please arrive at the venue at 1 PM.', 'Arrive venue 1 PM.', 'You arrive in venue at 1 PM please.'], answer: 'Please arrive at the venue at 1 PM.', explain: 'This is the most natural professional instruction.' }
  ];

  var reviewItems = [
    { title: '1. Reason', line: 'I am writing to confirm…', fr: 'J’écris pour confirmer…' },
    { title: '2. Request', line: 'Could you please send / confirm…?', fr: 'Pourriez-vous envoyer / confirmer… ?' },
    { title: '3. Reassurance', line: 'Do not worry, I will…', fr: 'Ne vous inquiétez pas, je vais…' },
    { title: '4. Follow-up', line: 'I am following up on…', fr: 'Je reviens vers vous au sujet de…' },
    { title: '5. Instructions', line: 'Please arrive at… / Please find attached…', fr: 'Merci d’arriver à… / Veuillez trouver ci-joint…' },
    { title: '6. Closing', line: 'Thank you for your help. Kind regards,', fr: 'Merci pour votre aide. Bien cordialement,' }
  ];

  function qs(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function qsa(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  function safeOn(selector, eventName, handler, scope) {
    var element = qs(selector, scope);
    if (element) {
      element.addEventListener(eventName, handler);
    }
  }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function iconizeHtml(input) {
    if (input === null || input === undefined) {
      return '';
    }

    var iconMap = [
      { phrase: 'hello sabine', icon: '☎️' },
      { phrase: 'this is', icon: '🪪' },
      { phrase: 'calling', icon: '📞' },
      { phrase: 'hi', icon: '👋' },
      { phrase: 'how are you', icon: '🙂' },
      { phrase: 'fine, thank you', icon: '😊' },
      { phrase: 'and you', icon: '🤝' },
      { phrase: 'guest count', icon: '👥' },
      { phrase: 'guest list', icon: '👥' },
      { phrase: 'venue meeting', icon: '🤝' },
      { phrase: 'meeting', icon: '🤝' },
      { phrase: 'rain plan', icon: '🌧️' },
      { phrase: 'weather update', icon: '🌦️' },
      { phrase: 'weather', icon: '☁️' },
      { phrase: 'phone call', icon: '📞' },
      { phrase: 'timeline', icon: '📋' },
      { phrase: 'updated schedule', icon: '📋' },
      { phrase: 'schedule', icon: '🗓️' },
      { phrase: 'menu', icon: '🍽️' },
      { phrase: 'vegan', icon: '🥗' },
      { phrase: 'gluten-free', icon: '🌾' },
      { phrase: 'caterer', icon: '👨‍🍳' },
      { phrase: 'florist', icon: '🌸' },
      { phrase: 'flowers', icon: '💐' },
      { phrase: 'chair delivery', icon: '🪑' },
      { phrase: 'delivery time', icon: '⏰' },
      { phrase: 'delivery', icon: '🚚' },
      { phrase: 'venue', icon: '📍' },
      { phrase: 'ceremony', icon: '⛪' },
      { phrase: 'cocktail', icon: '🥂' },
      { phrase: 'attached', icon: '📎' },
      { phrase: 'follow-up', icon: '🔁' },
      { phrase: 'following up', icon: '🔁' },
      { phrase: 'follow up', icon: '🔁' },
      { phrase: 'confirm', icon: '✅' },
      { phrase: 'final changes', icon: '📝' },
      { phrase: 'update', icon: '📝' },
      { phrase: 'email', icon: '📧' },
      { phrase: 'reply', icon: '↩️' },
      { phrase: 'problem', icon: '⚠️' },
      { phrase: 'thank you', icon: '🙏' },
      { phrase: 'dear', icon: '💌' },
      { phrase: 'good morning', icon: '🌞' },
      { phrase: 'good afternoon', icon: '🌤️' },
      { phrase: 'best regards', icon: '💐' },
      { phrase: 'kind regards', icon: '✨' },
      { phrase: 'do not worry', icon: '💛' },
      { phrase: 'please let me know', icon: '📩' },
      { phrase: 'please find attached', icon: '📎' },
      { phrase: 'please arrive', icon: '📍' },
      { phrase: 'saturday', icon: '📅' },
      { phrase: 'thursday evening', icon: '🌙' },
      { phrase: 'today', icon: '📆' },
      { phrase: 'tomorrow', icon: '⏭️' }
    ];

    var parts = String(input).split(/(<[^>]+>)/g);

    return parts.map(function (part) {
      if (!part || part.charAt(0) === '<') {
        return part;
      }

      var result = part;
      iconMap.forEach(function (entry) {
        var escaped = entry.phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        var regex = new RegExp('\\b' + escaped + '\\b', 'gi');
        result = result.replace(regex, function (match) {
          return '<span class="icon-word"><span class="emoji">' + entry.icon + '</span><span class="word">' + match + '</span></span>';
        });
      });
      return result;
    }).join('');
  }

  function speakText(text) {
    if (!window.speechSynthesis || !text) {
      return;
    }
    window.speechSynthesis.cancel();
    var utterance = new SpeechSynthesisUtterance(String(text).replace(/<[^>]+>/g, ' '));
    utterance.lang = state.voice === 'UK' ? 'en-GB' : 'en-US';
    window.speechSynthesis.speak(utterance);
  }

  function syncFrVisibility() {
    qsa('.fr-text').forEach(function (element) {
      element.classList.toggle('hidden', !state.showFr);
    });
  }

  function renderVocab() {
    var grid = qs('#vocab-grid');
    if (!grid) { return; }

    var searchEl = qs('#vocab-search');
    var filterEl = qs('#vocab-filter');
    var search = searchEl ? searchEl.value.trim().toLowerCase() : '';
    var filter = filterEl ? filterEl.value : 'all';

    var filtered = vocabItems.filter(function (item) {
      var matchesFilter = filter === 'all' || item.category === filter;
      var haystack = [item.en, item.fr, item.definition, item.example].join(' ').toLowerCase();
      var matchesSearch = !search || haystack.indexOf(search) !== -1;
      return matchesFilter && matchesSearch;
    });

    if (!filtered.length) {
      grid.innerHTML = '<div class="empty-state">No vocabulary found.</div>';
      return;
    }

    grid.innerHTML = filtered.map(function (item) {
      return [
        '<article class="vocab-card" tabindex="0">',
          '<div class="vocab-inner">',
            '<div class="vocab-face front">',
              '<div class="vocab-top">',
                '<span class="vocab-icon">', item.icon, '</span>',
                '<span class="tag">', escapeHtml(item.category), '</span>',
              '</div>',
              '<div>',
                '<h3 class="vocab-word">', escapeHtml(item.en), '</h3>',
                '<p class="vocab-fr fr-text">', escapeHtml(item.fr), '</p>',
              '</div>',
              '<div class="vocab-sentence">', escapeHtml(item.example), '</div>',
              '<div><button class="btn secondary mini-speak" data-say="', escapeHtml(item.example), '" type="button">🔊 Listen</button></div>',
            '</div>',
            '<div class="vocab-face back">',
              '<div>',
                '<h3>', item.icon, ' ', escapeHtml(item.en), ' <span class="fr-text">= ', escapeHtml(item.fr), '</span></h3>',
                '<p>', escapeHtml(item.definition), '</p>',
                '<p><strong>Example:</strong> ', escapeHtml(item.example), '</p>',
              '</div>',
            '</div>',
          '</div>',
        '</article>'
      ].join('');
    }).join('');

    qsa('.vocab-card', grid).forEach(function (card) {
      card.addEventListener('click', function (event) {
        if (event.target && event.target.classList.contains('mini-speak')) {
          return;
        }
        card.classList.toggle('flipped');
      });
      card.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          card.classList.toggle('flipped');
        }
      });
    });

    qsa('.mini-speak', grid).forEach(function (button) {
      button.addEventListener('click', function (event) {
        event.stopPropagation();
        speakText(button.getAttribute('data-say'));
      });
    });

    syncFrVisibility();
  }

  function renderPhraseMap() {
    var grid = qs('#phrase-map-grid');
    if (!grid) { return; }

    grid.innerHTML = phraseFamilies.map(function (group) {
      return [
        '<article class="phrase-card">',
          '<h3>', group.title, '</h3>',
          '<p>', group.note, '</p>',
          '<p class="fr-text">', group.fr, '</p>',
          '<ul>',
            group.items.map(function (item) {
              return '<li class="email-line"><div><span class="icon-word"><span class="emoji">' + item.icon + '</span><span class="word">phrase</span></span> ' + iconizeHtml(item.en) + '</div><div class="muted">Use it when: ' + escapeHtml(item.when) + '</div><div class="fr-text">' + escapeHtml(item.fr) + '</div></li>';
            }).join(''),
          '</ul>',
        '</article>'
      ].join('');
    }).join('');

    syncFrVisibility();
  }

  function renderScenarioPills() {
    var box = qs('#scenario-pills');
    if (!box) { return; }
    box.innerHTML = Object.keys(scenarios).map(function (key) {
      var scenario = scenarios[key];
      var activeClass = key === state.scenarioId ? ' active' : '';
      return '<button class="pill' + activeClass + '" type="button" data-scenario="' + key + '">' + scenario.icon + ' ' + escapeHtml(scenario.label) + '</button>';
    }).join('');

    qsa('.pill', box).forEach(function (button) {
      button.addEventListener('click', function () {
        state.scenarioId = button.getAttribute('data-scenario');
        state.orderSelected = [];
        renderScenarioPills();
        renderDialogues();
        renderEmails();
        renderOrderBuilder();
        populateBuilderChoices();
        buildGuidedEmail();
      });
    });
  }

  function renderDialogueLines(containerId, lines) {
    var box = qs(containerId);
    if (!box) { return; }
    box.innerHTML = lines.map(function (line) {
      return '<div class="dialogue-line"><span class="dialogue-role">' + escapeHtml(line.who) + '</span><div>' + iconizeHtml(line.html) + '</div></div>';
    }).join('');
  }

  function getScenarioText(lines) {
    return lines.map(function (line) {
      return line.who ? line.who + '. ' + line.html.replace(/<[^>]+>/g, ' ') : line.replace(/<[^>]+>/g, ' ');
    }).join(' ');
  }

  function getScenarioName(scenario) {
    if (!scenario || !scenario.original || !scenario.original.from) {
      return 'the client';
    }
    return scenario.original.from;
  }

  function withDialogueIntro(type, scenario, lines) {
    var safeLines = lines.slice();
    if (!safeLines.length) {
      return safeLines;
    }

    if (type === 'phone') {
      if (!/this is/i.test(safeLines[0].html)) {
        safeLines.unshift(
          { who: 'Caller', html: 'Hello Sabine, this is ' + escapeHtml(getScenarioName(scenario)) + ' calling.' },
          { who: 'Sabine', html: 'Hello. How can I help you?' }
        );
      }
      return safeLines;
    }

    if (type === 'meeting') {
      if (!/how are you/i.test(safeLines[0].html)) {
        safeLines.unshift(
          { who: 'Guest', html: 'Hi, how are you?' },
          { who: 'Sabine', html: 'Fine, thank you. And you?' },
          { who: 'Guest', html: 'Fine, thank you.' }
        );
      }
    }
    return safeLines;
  }

  function renderDialogues() {
    var scenario = scenarios[state.scenarioId];
    renderDialogueLines('#phone-dialogue', withDialogueIntro('phone', scenario, scenario.phone));
    renderDialogueLines('#meeting-dialogue', withDialogueIntro('meeting', scenario, scenario.meeting));
  }

  function renderEmailCard(targetPrefix, email) {
    var titleEl = qs('#' + targetPrefix + '-title');
    var bodyEl = qs('#' + targetPrefix + '-body');
    if (!bodyEl) { return; }
    if (titleEl) {
      titleEl.textContent = email.title;
    }
    bodyEl.innerHTML = [
      '<div class="email-meta">',
        '<div class="email-line"><strong>Subject:</strong> ' + iconizeHtml(escapeHtml(email.subject)) + '</div>',
        '<div class="email-line"><strong>From:</strong> ' + iconizeHtml(escapeHtml(email.from)) + '</div>',
        '<div class="email-line"><strong>To:</strong> ' + iconizeHtml(escapeHtml(email.to)) + '</div>',
      '</div>',
      '<div class="email-body">', email.html.map(iconizeHtml).join(''), '</div>'
    ].join('');
  }

  function renderEmails() {
    var scenario = scenarios[state.scenarioId];
    var summary = qs('#scenario-summary');
    if (summary) {
      summary.innerHTML = '<h3>' + scenario.icon + ' ' + escapeHtml(scenario.label) + '</h3><p class="summary-line">' + iconizeHtml(escapeHtml(scenario.summary)) + '</p><p class="summary-line fr-text">' + escapeHtml(scenario.summaryFr) + '</p>';
    }
    renderEmailCard('original-email', scenario.original);
    renderEmailCard('reply-email', scenario.reply);
    syncFrVisibility();
  }

  function renderQuiz() {
    var box = qs('#quiz-box');
    if (!box) { return; }

    box.innerHTML = quizItems.map(function (item, index) {
      return [
        '<div class="quiz-item" data-index="', index, '">',
          '<p><strong>', (index + 1), '.</strong> ', iconizeHtml(escapeHtml(item.prompt)), '</p>',
          '<div class="choice-row">',
            item.choices.map(function (choice) {
              return '<button class="choice-btn" type="button" data-choice="' + escapeHtml(choice) + '">' + iconizeHtml(escapeHtml(choice)) + '</button>';
            }).join(''),
          '</div>',
          '<div class="feedback"></div>',
        '</div>'
      ].join('');
    }).join('');

    qsa('.quiz-item', box).forEach(function (itemEl) {
      var item = quizItems[Number(itemEl.getAttribute('data-index'))];
      qsa('.choice-btn', itemEl).forEach(function (button) {
        button.addEventListener('click', function () {
          qsa('.choice-btn', itemEl).forEach(function (btn) {
            btn.classList.remove('correct', 'wrong');
          });
          var feedback = qs('.feedback', itemEl);
          var choice = button.getAttribute('data-choice');
          if (choice === item.answer) {
            button.classList.add('correct');
            feedback.innerHTML = '✅ Correct — ' + iconizeHtml(escapeHtml(item.explain));
            feedback.className = 'feedback ok';
          } else {
            button.classList.add('wrong');
            feedback.innerHTML = '✘ Try again — ' + iconizeHtml(escapeHtml(item.explain));
            feedback.className = 'feedback bad';
          }
        });
      });
    });
  }

  function shuffleArray(array) {
    var copy = array.slice();
    for (var i = copy.length - 1; i > 0; i -= 1) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = copy[i];
      copy[i] = copy[j];
      copy[j] = temp;
    }
    return copy;
  }

  function renderOrderBuilder() {
    var bank = qs('#order-bank');
    var selected = qs('#order-selected');
    var feedback = qs('#order-feedback');
    if (!bank || !selected) { return; }

    var correct = scenarios[state.scenarioId].orderCorrect;
    if (!state.orderPool || state.orderPoolScenario !== state.scenarioId) {
      state.orderPool = shuffleArray(correct);
      state.orderPoolScenario = state.scenarioId;
      state.orderSelected = [];
    }

    bank.innerHTML = state.orderPool.filter(function (line) {
      return state.orderSelected.indexOf(line) === -1;
    }).map(function (line) {
      return '<button class="sentence-btn" type="button" data-line="' + escapeHtml(line) + '">' + iconizeHtml(escapeHtml(line)) + '</button>';
    }).join('');

    selected.innerHTML = state.orderSelected.map(function (line) {
      return '<button class="sentence-btn" type="button" data-line="' + escapeHtml(line) + '">' + iconizeHtml(escapeHtml(line)) + '</button>';
    }).join('');

    if (!bank.innerHTML) {
      bank.innerHTML = '<div class="empty-state">All the lines are in your reply.</div>';
    }
    if (!selected.innerHTML) {
      selected.innerHTML = '<div class="empty-state">Tap the sentence bank to build the reply.</div>';
    }
    if (feedback) {
      feedback.className = 'feedback-box muted-box';
      feedback.innerHTML = iconizeHtml('Choose a scenario above, then build the polite reply.');
    }

    qsa('#order-bank .sentence-btn').forEach(function (button) {
      button.addEventListener('click', function () {
        state.orderSelected.push(button.getAttribute('data-line'));
        renderOrderBuilder();
      });
    });

    qsa('#order-selected .sentence-btn').forEach(function (button) {
      button.addEventListener('click', function () {
        var line = button.getAttribute('data-line');
        var index = state.orderSelected.indexOf(line);
        if (index !== -1) {
          state.orderSelected.splice(index, 1);
        }
        renderOrderBuilder();
      });
    });
  }

  function checkOrder() {
    var correct = scenarios[state.scenarioId].orderCorrect;
    var feedback = qs('#order-feedback');
    if (!feedback) { return; }
    if (state.orderSelected.length !== correct.length) {
      feedback.className = 'feedback-box bad';
      feedback.textContent = '✘ Add all the lines before you check.';
      return;
    }
    var isCorrect = state.orderSelected.every(function (line, index) {
      return line === correct[index];
    });
    if (isCorrect) {
      feedback.className = 'feedback-box ok';
      feedback.textContent = '✅ Great. The reply is in a clear professional order.';
    } else {
      feedback.className = 'feedback-box bad';
      feedback.textContent = '✘ Almost. Try greeting → thanks → main point → request / instruction → closing.';
    }
  }

  function populateSelect(id, options) {
    var select = qs(id);
    if (!select) { return; }
    select.innerHTML = options.map(function (option) {
      return '<option value="' + escapeHtml(option) + '">' + escapeHtml(option) + '</option>';
    }).join('');
  }

  function populateBuilderChoices() {
    var choices = scenarios[state.scenarioId].builderChoices;
    populateSelect('#build-subject', choices.subject || [scenarios[state.scenarioId].reply.subject]);
    populateSelect('#build-greeting', choices.greeting || ['Dear,']);
    populateSelect('#build-opening', choices.opening || ['Thank you for your email.']);
    populateSelect('#build-detail', choices.detail || choices.main || ['I am writing to confirm the details.']);
    populateSelect('#build-request', choices.request || ['Please let me know if there are any changes.']);
    populateSelect('#build-reassurance', choices.reassurance || ['I will keep you updated.']);
    populateSelect('#build-closing', choices.closing || ['Kind regards,\nSabine']);
  }

  function buildGuidedEmail() {
    var subject = qs('#build-subject');
    var greeting = qs('#build-greeting');
    var opening = qs('#build-opening');
    var detail = qs('#build-detail');
    var request = qs('#build-request');
    var reassurance = qs('#build-reassurance');
    var closing = qs('#build-closing');
    var output = qs('#built-email');
    if (!subject || !greeting || !opening || !detail || !request || !reassurance || !closing || !output) { return; }

    var lines = [
      'Subject: ' + subject.value,
      '',
      greeting.value,
      '',
      opening.value,
      detail.value,
      request.value,
      reassurance.value,
      '',
      closing.value
    ];

    output.innerHTML = lines.map(function (line) {
      if (!line) {
        return '<div class="output-spacer"></div>';
      }
      return '<div class="output-line">' + iconizeHtml(escapeHtml(line)) + '</div>';
    }).join('');
    output.setAttribute('data-plain-text', lines.join('\n'));
  }

  function renderReview() {
    var grid = qs('#review-grid');
    if (!grid) { return; }
    grid.innerHTML = reviewItems.map(function (item) {
      return '<article class="review-card"><h3>' + escapeHtml(item.title) + '</h3><p class="review-line">' + iconizeHtml(escapeHtml(item.line)) + '</p><p class="review-line fr-text">' + escapeHtml(item.fr) + '</p></article>';
    }).join('');
    syncFrVisibility();
  }

  function setupControls() {
    safeOn('#toggle-fr', 'click', function () {
      state.showFr = !state.showFr;
      var button = qs('#toggle-fr');
      if (button) {
        button.textContent = 'FR help: ' + (state.showFr ? 'ON' : 'OFF');
      }
      syncFrVisibility();
    });

    safeOn('#toggle-voice', 'click', function () {
      state.voice = state.voice === 'UK' ? 'US' : 'UK';
      var button = qs('#toggle-voice');
      if (button) {
        button.textContent = 'Voice: ' + state.voice;
      }
    });

    safeOn('#speak-page', 'click', function () {
      speakText('Sabine wedding email studio. Learn polite greetings, requests, reassurance, follow-up, instructions, and closings.');
    });

    safeOn('#reset-page', 'click', function () {
      state.showFr = true;
      state.voice = 'UK';
      state.scenarioId = 'timeline';
      state.orderPoolScenario = null;
      var search = qs('#vocab-search');
      var filter = qs('#vocab-filter');
      if (search) { search.value = ''; }
      if (filter) { filter.value = 'all'; }
      renderAll();
      var frButton = qs('#toggle-fr');
      var voiceButton = qs('#toggle-voice');
      if (frButton) { frButton.textContent = 'FR help: ON'; }
      if (voiceButton) { voiceButton.textContent = 'Voice: UK'; }
    });

    safeOn('#vocab-search', 'input', renderVocab);
    safeOn('#vocab-filter', 'change', renderVocab);
    safeOn('#check-order', 'click', checkOrder);
    safeOn('#reset-order', 'click', function () {
      state.orderPoolScenario = null;
      renderOrderBuilder();
    });
    safeOn('#build-email', 'click', buildGuidedEmail);
    safeOn('#listen-built', 'click', function () {
      var output = qs('#built-email');
      if (output) {
        speakText(output.getAttribute('data-plain-text') || output.textContent);
      }
    });
    safeOn('#speak-original', 'click', function () {
      speakText(scenarios[state.scenarioId].original.lines.join(' '));
    });
    safeOn('#speak-reply', 'click', function () {
      speakText(scenarios[state.scenarioId].reply.lines.join(' '));
    });
    safeOn('#speak-phone', 'click', function () {
      speakText(getScenarioText(scenarios[state.scenarioId].phone));
    });
    safeOn('#speak-meeting', 'click', function () {
      speakText(getScenarioText(scenarios[state.scenarioId].meeting));
    });

    ['#build-subject', '#build-greeting', '#build-opening', '#build-detail', '#build-request', '#build-reassurance', '#build-closing'].forEach(function (selector) {
      safeOn(selector, 'change', buildGuidedEmail);
    });
  }

  function renderAll() {
    renderVocab();
    renderPhraseMap();
    renderScenarioPills();
    renderDialogues();
    renderEmails();
    renderQuiz();
    renderOrderBuilder();
    populateBuilderChoices();
    buildGuidedEmail();
    renderReview();
    syncFrVisibility();
  }

  setupControls();
  renderAll();
}());
