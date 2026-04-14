(function () {
  'use strict';

  const state = {
    accent: 'en-US',
    ipadMode: true,
    scoreCorrect: 0,
    scoreTotal: 0,
    completed: new Set(),
    current: {},
    evaluated: {},
    timers: {},
    writingMode: 'essay'
  };

  const speakingStarters = [
    'In my view,',
    'I would say that',
    'One important point is that',
    'For example,',
    'This matters because',
    'From a practical point of view,',
    'A good solution would be',
    'Overall,'
  ];

  const data = {
    readAnswer: [
      {
        id: 'ra1',
        title: 'Office update email',
        tags: ['general', 'customer'],
        text: 'From: Maya Lopez\nSubject: Meeting change\n\nHello team,\nThe client review meeting planned for Thursday at 10:00 has been moved to 14:30 because the finance manager is unavailable in the morning. Please update your slides before 12:00 and send them to me for a final check. We will still meet in Conference Room B.\n\nThanks,\nMaya',
        questions: [
          {
            q: 'Why was the meeting moved?',
            options: ['The room is unavailable.', 'The client requested a later date.', 'The finance manager is unavailable in the morning.', 'The slides are not ready yet.'],
            answer: 2,
            explain: 'The email says the finance manager is unavailable in the morning.'
          },
          {
            q: 'What must the team do before 12:00?',
            options: ['Call the client.', 'Send updated slides to Maya.', 'Book a new room.', 'Prepare a budget report.'],
            answer: 1,
            explain: 'They must update the slides and send them to Maya before 12:00.'
          },
          {
            q: 'What stayed the same?',
            options: ['The date', 'The room', 'The presenter', 'The agenda'],
            answer: 1,
            explain: 'The email states the meeting will still be in Conference Room B.'
          }
        ]
      },
      {
        id: 'ra2',
        title: 'Travel confirmation',
        tags: ['events', 'general'],
        text: 'Dear Mr. Bernard,\n\nYour train from Lyon to Paris on 16 June has been confirmed. Departure time: 08:24 from Platform 7. Please arrive at least 20 minutes early because ticket checks will take place before boarding. A meal is not included in your fare, but drinks and snacks can be purchased on board.\n\nKind regards,\nTravel Services',
        questions: [
          {
            q: 'When should Mr. Bernard arrive?',
            options: ['At 08:24 exactly', '20 minutes before departure', 'After ticket checks', 'At Platform 20'],
            answer: 1,
            explain: 'The message says to arrive at least 20 minutes early.'
          },
          {
            q: 'What is not included?',
            options: ['A seat', 'The ticket', 'A meal', 'Ticket checks'],
            answer: 2,
            explain: 'The email says a meal is not included in the fare.'
          },
          {
            q: 'Where does the train leave from?',
            options: ['Paris', 'Platform 7', 'Travel Services', 'Lyon Platform 16'],
            answer: 1,
            explain: 'Departure is at Platform 7.'
          }
        ]
      },
      {
        id: 'ra3',
        title: 'Football club volunteer note',
        tags: ['sportsmedia', 'events'],
        text: 'Hi volunteers,\n\nThank you for helping with Saturday\'s youth football tournament. Please be on site by 08:15. The first match starts at 09:00, but registration opens at 08:30. Emma will manage refreshments, Karim will welcome teams, and Leo will check the equipment bags. If it rains, the final will be moved to the indoor court.\n\nSee you then!',
        questions: [
          {
            q: 'What opens at 08:30?',
            options: ['The first match', 'Registration', 'Refreshments', 'The indoor court'],
            answer: 1,
            explain: 'The message says registration opens at 08:30.'
          },
          {
            q: 'Who will welcome the teams?',
            options: ['Emma', 'Karim', 'Leo', 'The coach'],
            answer: 1,
            explain: 'Karim will welcome teams.'
          },
          {
            q: 'What happens if it rains?',
            options: ['The event is cancelled.', 'Registration starts later.', 'The final moves indoors.', 'Volunteers arrive earlier.'],
            answer: 2,
            explain: 'The final will be moved to the indoor court.'
          }
        ]
      },
      {
        id: 'ra4',
        title: 'Cinema customer notice',
        tags: ['sportsmedia', 'customer'],
        text: 'Dear customer,\n\nDue to a technical issue, the 19:30 screening of Northern Lights will begin 25 minutes later than expected. Your ticket remains valid. If you prefer not to wait, you may exchange your ticket for tomorrow\'s screening or request a refund at the main desk before 20:00. We apologise for the inconvenience.\n\nCity Screen Cinema',
        questions: [
          {
            q: 'Why is the film delayed?',
            options: ['The actors are late.', 'The screening room is full.', 'There is a technical issue.', 'The ticket desk closed early.'],
            answer: 2,
            explain: 'The notice says the delay is due to a technical issue.'
          },
          {
            q: 'What can customers do if they do not want to wait?',
            options: ['Ask for free snacks only', 'Exchange the ticket or request a refund', 'Enter another film immediately', 'Keep the ticket for any date'],
            answer: 1,
            explain: 'Customers may exchange the ticket or request a refund.'
          },
          {
            q: 'Where can they ask for a refund?',
            options: ['Online only', 'At the main desk', 'Inside the screening room', 'At the café'],
            answer: 1,
            explain: 'Refunds are available at the main desk before 20:00.'
          }
        ]
      }
    ],
    listenAnswer: [
      {
        id: 'la1',
        title: 'Voicemail about delivery',
        tags: ['customer', 'general'],
        audio: 'Hello, this is Sandra from Northline Supplies. I am calling about your order number A four seven two. The delivery scheduled for tomorrow morning will arrive in the afternoon instead because our driver had a vehicle problem. We expect the goods to reach you around three thirty. Please call us back if nobody will be available to receive them.',
        transcript: 'Hello, this is Sandra from Northline Supplies. I am calling about your order number A472. The delivery scheduled for tomorrow morning will arrive in the afternoon instead because our driver had a vehicle problem. We expect the goods to reach you around 3:30. Please call us back if nobody will be available to receive them.',
        questions: [
          {
            q: 'Why is the delivery late?',
            options: ['The order was incomplete.', 'The driver had a vehicle problem.', 'The client changed the time.', 'The address was incorrect.'],
            answer: 1,
            explain: 'Sandra says the driver had a vehicle problem.'
          },
          {
            q: 'When should the goods arrive?',
            options: ['Tomorrow morning', 'At noon', 'Around 3:30', 'Next week'],
            answer: 2,
            explain: 'The delivery is expected around 3:30.'
          },
          {
            q: 'What should the listener do if nobody is available?',
            options: ['Cancel the order', 'Call back', 'Send an email next week', 'Visit the warehouse'],
            answer: 1,
            explain: 'She asks the listener to call back.'
          }
        ]
      },
      {
        id: 'la2',
        title: 'Training update',
        tags: ['general', 'events'],
        audio: 'Hi everyone. A quick update about Friday\'s customer service workshop. We are still meeting in Room twelve, but we will start at nine fifteen instead of nine because the trainer\'s flight lands late. Please bring the printed case study you received yesterday and be ready to work in pairs after the break.',
        transcript: 'Hi everyone. A quick update about Friday\'s customer service workshop. We are still meeting in Room 12, but we will start at 9:15 instead of 9:00 because the trainer\'s flight lands late. Please bring the printed case study you received yesterday and be ready to work in pairs after the break.',
        questions: [
          {
            q: 'What changed?',
            options: ['The room', 'The trainer', 'The start time', 'The case study'],
            answer: 2,
            explain: 'Only the start time changed.'
          },
          {
            q: 'Why is the workshop starting later?',
            options: ['The room is occupied.', 'The trainer\'s flight is late.', 'The participants asked for a later time.', 'The printer is broken.'],
            answer: 1,
            explain: 'The trainer\'s flight lands late.'
          },
          {
            q: 'What should participants bring?',
            options: ['A laptop only', 'A badge', 'The printed case study', 'A completed survey'],
            answer: 2,
            explain: 'They should bring the printed case study.'
          }
        ]
      },
      {
        id: 'la3',
        title: 'Match-day announcement',
        tags: ['sportsmedia', 'events'],
        audio: 'Attention supporters. The under nineteen football match will now take place on pitch two instead of the main field. Kick-off remains at eleven o\'clock. Please use the east entrance because the west side is closed for maintenance. Refreshments are available next to the ticket desk.',
        transcript: 'Attention supporters. The under-19 football match will now take place on Pitch 2 instead of the main field. Kick-off remains at 11:00. Please use the east entrance because the west side is closed for maintenance. Refreshments are available next to the ticket desk.',
        questions: [
          {
            q: 'What changed?',
            options: ['The kick-off time', 'The age group', 'The pitch', 'The refreshments'],
            answer: 2,
            explain: 'The match moved to Pitch 2.'
          },
          {
            q: 'Which entrance should people use?',
            options: ['The main gate', 'The west entrance', 'The east entrance', 'The staff entrance'],
            answer: 2,
            explain: 'Supporters should use the east entrance.'
          },
          {
            q: 'Why is the west side closed?',
            options: ['Security issues', 'Maintenance work', 'A private event', 'Bad weather'],
            answer: 1,
            explain: 'The west side is closed for maintenance.'
          }
        ]
      }
    ],
    listenChoose: [
      {
        id: 'lc1',
        title: 'Quick booking message',
        tags: ['customer', 'events'],
        audio: 'There are only two double rooms left for Friday night, so I recommend booking before noon.',
        transcript: 'There are only two double rooms left for Friday night, so I recommend booking before noon.',
        question: 'What is the speaker suggesting?',
        options: ['Arriving before noon', 'Booking quickly', 'Requesting a single room', 'Calling on Friday night'],
        answer: 1,
        explain: 'The speaker recommends booking before noon because only two rooms are left.'
      },
      {
        id: 'lc2',
        title: 'Project update',
        tags: ['general'],
        audio: 'The report is almost finished, but I still need the sales figures from the Madrid office.',
        transcript: 'The report is almost finished, but I still need the sales figures from the Madrid office.',
        question: 'What is missing?',
        options: ['The final report', 'The Madrid office', 'The sales figures', 'The project deadline'],
        answer: 2,
        explain: 'The sales figures are still needed.'
      },
      {
        id: 'lc3',
        title: 'Cinema promotion',
        tags: ['sportsmedia', 'customer'],
        audio: 'Students can buy a reduced-price ticket if they show their card at the desk before the film starts.',
        transcript: 'Students can buy a reduced-price ticket if they show their card at the desk before the film starts.',
        question: 'How can students get the discount?',
        options: ['By booking online only', 'By arriving after the film begins', 'By showing their card at the desk', 'By buying two tickets'],
        answer: 2,
        explain: 'The discount is available when they show their student card at the desk.'
      },
      {
        id: 'lc4',
        title: 'Football practice',
        tags: ['sportsmedia'],
        audio: 'Training will finish earlier tonight because the lights on the second half of the pitch are not working.',
        transcript: 'Training will finish earlier tonight because the lights on the second half of the pitch are not working.',
        question: 'Why will training end earlier?',
        options: ['The coach is unavailable.', 'The lights are not working properly.', 'The players arrived late.', 'The weather is too cold.'],
        answer: 1,
        explain: 'The problem is with the lights.'
      }
    ],
    multipleChoice: [
      {
        q: 'Could you please ______ the client that the order has been shipped?',
        options: ['to inform', 'inform', 'informed', 'informing'],
        answer: 1,
        explain: 'After “could you please”, use the base verb: inform.'
      },
      {
        q: 'We need to arrive early ______ set up the room before the guests come.',
        options: ['for', 'so', 'to', 'because'],
        answer: 2,
        explain: '“To set up” expresses purpose.'
      },
      {
        q: 'There aren\'t ______ tickets left for the evening screening.',
        options: ['some', 'many', 'much', 'a'],
        answer: 1,
        explain: '“Tickets” is countable plural, so “many” is correct in the negative.'
      },
      {
        q: 'If the customer ______ again, please offer a refund.',
        options: ['complain', 'complains', 'complaining', 'complained'],
        answer: 1,
        explain: 'This is a first conditional pattern: if + present simple.'
      },
      {
        q: 'The meeting was postponed, ______ everyone received an updated invitation.',
        options: ['but', 'so', 'because', 'although'],
        answer: 1,
        explain: 'The second clause is the result, so “so” is best.'
      },
      {
        q: 'I\'d recommend ______ the report before you send it.',
        options: ['check', 'checked', 'checking', 'to checking'],
        answer: 2,
        explain: 'After “recommend”, the -ing form is common here.'
      },
      {
        q: 'This cinema is ______ than the one near the station.',
        options: ['comfortable', 'more comfortable', 'most comfortable', 'comfortabler'],
        answer: 1,
        explain: 'A comparative form is needed: more comfortable.'
      },
      {
        q: 'The players were tired, ______ they kept working until the end.',
        options: ['however', 'because', 'unless', 'while'],
        answer: 0,
        explain: '“However” shows contrast.'
      },
      {
        q: 'Please send me the file as soon as you ______ the final version.',
        options: ['finish', 'will finish', 'finished', 'finishing'],
        answer: 0,
        explain: 'After “as soon as”, use the present simple for future meaning.'
      },
      {
        q: 'He asked whether the tickets ______ refundable.',
        options: ['is', 'are', 'was', 'were'],
        answer: 3,
        explain: 'Reported speech shifts “are” to “were” here.'
      }
    ],
    fillBlank: [
      {
        id: 'fb1',
        tags: ['customer', 'general'],
        audio: 'The replacement printer will arrive on Tuesday, the twenty second of July, at nine fifteen.',
        transcript: 'The replacement printer will arrive on Tuesday, 22 July, at 9:15.',
        prompt: 'Type the arrival time only.',
        answers: ['9:15', '09:15', 'nine fifteen'],
        explain: 'The delivery time is 9:15.'
      },
      {
        id: 'fb2',
        tags: ['events'],
        audio: 'Your reference number is B K seven four one nine.',
        transcript: 'Your reference number is BK7419.',
        prompt: 'Type the reference number.',
        answers: ['BK7419', 'bk7419'],
        explain: 'The correct reference number is BK7419.'
      },
      {
        id: 'fb3',
        tags: ['sportsmedia'],
        audio: 'Tickets for the final cost eighteen euros fifty if you book online before Friday.',
        transcript: 'Tickets for the final cost 18 euros 50 if you book online before Friday.',
        prompt: 'Type the ticket price only.',
        answers: ['18.50', '18,50', '18 euros 50', '18€50', '18.5'],
        explain: 'The online price is 18.50 euros.'
      },
      {
        id: 'fb4',
        tags: ['customer'],
        audio: 'Please return the completed form to room two hundred and six before half past four.',
        transcript: 'Please return the completed form to Room 206 before 4:30.',
        prompt: 'Type the room number.',
        answers: ['206', 'Room 206', 'room 206'],
        explain: 'The form must go to Room 206.'
      }
    ],
    readFluency: [
      {
        id: 'rf1',
        tags: ['general'],
        text: 'Professional communication is not only about using correct grammar. It also means being clear, polite, and well organised. When people share accurate information and respond on time, teamwork becomes easier and problems are solved more quickly.'
      },
      {
        id: 'rf2',
        tags: ['sportsmedia'],
        text: 'The city football club is launching a weekend programme for young players. Families can register online, attend a welcome session, and speak to the coaching team about training times, equipment, and safety rules.'
      },
      {
        id: 'rf3',
        tags: ['sportsmedia'],
        text: 'Independent cinemas often create a stronger experience for viewers because they organise themed evenings, invite local guests, and build a sense of community around each screening.'
      },
      {
        id: 'rf4',
        tags: ['customer', 'events'],
        text: 'Before a business trip, travellers should confirm transport details, hotel check-in times, and meeting addresses. Small checks like these can prevent stress and save valuable time later.'
      }
    ],
    listenRepeat: [
      {
        id: 'lr1',
        tags: ['general'],
        text: 'Could you send me the updated version by the end of the day?'
      },
      {
        id: 'lr2',
        tags: ['customer'],
        text: 'I apologise for the delay, and I appreciate your patience.'
      },
      {
        id: 'lr3',
        tags: ['sportsmedia'],
        text: 'The match starts at seven, but the gates open at six thirty.'
      },
      {
        id: 'lr4',
        tags: ['sportsmedia'],
        text: 'This documentary was more interesting than I expected.'
      },
      {
        id: 'lr5',
        tags: ['events'],
        text: 'Please keep your ticket with you until the end of the journey.'
      }
    ],
    speaking: [
      {
        id: 'sp1',
        tags: ['general'],
        prompt: 'What makes someone professional at work? Explain your view with examples.',
        ideas: ['punctuality', 'clear communication', 'respect', 'taking responsibility', 'working well with others'],
        model: 'In my view, being professional at work means much more than dressing well. First, a professional person communicates clearly and respectfully, even when there is a problem. For example, if a client is unhappy, a professional employee stays calm, explains the situation, and offers a solution. Another important point is reliability. People need to trust you to arrive on time, finish tasks, and keep your promises. Overall, professionalism is a combination of attitude, communication, and responsibility.'
      },
      {
        id: 'sp2',
        tags: ['customer'],
        prompt: 'How should a company respond when a customer complains about poor service?',
        ideas: ['listen carefully', 'apologise politely', 'explain only if necessary', 'offer a solution', 'follow up'],
        model: 'A company should respond quickly and politely when a customer complains. First, it is important to listen carefully and understand the exact problem. Then the company should apologise in a professional way, even if the mistake was small. After that, the staff should offer a clear solution, such as a refund, a replacement, or a new appointment. For example, if a delivery arrives late, the company could explain the delay and give the customer a realistic new delivery time. In my opinion, the key is to make the customer feel heard and respected.'
      },
      {
        id: 'sp3',
        tags: ['sportsmedia'],
        prompt: 'Do team sports help people develop useful skills for work? Why or why not?',
        ideas: ['discipline', 'communication', 'teamwork', 'dealing with pressure', 'leadership'],
        model: 'Yes, I think team sports help people develop many useful skills for work. To begin with, they teach teamwork, because players have to trust each other and work toward a common goal. They also help people communicate clearly under pressure. For example, during a football match, players must react quickly, adapt, and support each other. These are also useful qualities in a professional environment. In addition, sports can develop discipline and resilience, because people learn to improve after mistakes. Overall, team sports can prepare people well for real workplace situations.'
      },
      {
        id: 'sp4',
        tags: ['sportsmedia'],
        prompt: 'Can films or documentaries be a good way to learn English? Explain your opinion.',
        ideas: ['natural language', 'pronunciation', 'culture', 'motivation', 'repetition'],
        model: 'I believe films and documentaries can be a very good way to learn English, especially when learners combine them with active practice. First, they expose you to natural pronunciation, rhythm, and everyday expressions. They also show cultural details that are difficult to learn from a grammar book alone. For example, if you watch a film with subtitles and repeat useful lines, you can improve both listening and speaking. Documentaries are also helpful because they often use clear vocabulary around real topics. In short, films are not enough by themselves, but they are an excellent tool when used regularly and actively.'
      },
      {
        id: 'sp5',
        tags: ['events'],
        prompt: 'What are the most important things to organise before a business or study trip?',
        ideas: ['transport', 'accommodation', 'documents', 'budget', 'meeting times'],
        model: 'Before a business or study trip, several things need to be organised carefully. First, transport and accommodation must be confirmed so there are no last-minute surprises. It is also important to check documents such as tickets, identification, and meeting details. Another key point is planning the schedule, including arrival times, local transport, and any appointments. For example, if someone lands late in the evening, they should already know how they will get to the hotel. Overall, good preparation reduces stress and allows people to focus on the purpose of the trip.'
      }
    ],
    writingEssay: [
      {
        id: 'we1',
        tags: ['customer', 'general'],
        title: 'Professional complaint response',
        prompt: 'You recently received a complaint from a customer about a delayed order and poor communication. Write a clear and professional response. Explain the situation, apologise, and give the next steps.',
        minWords: 120,
        plan: ['Opening: thank the customer for contacting you', 'State the problem clearly', 'Apologise and explain briefly', 'Give the solution / next steps', 'Close politely and invite further contact'],
        model: 'Dear Ms Parker,\n\nThank you for your message regarding your recent order. I am sorry to hear that the delivery was delayed and that you did not receive clear updates from our team.\n\nWe have checked your file, and the delay was caused by a transport issue at our regional warehouse. Unfortunately, this was not communicated to you quickly enough, and I understand your frustration.\n\nTo resolve the situation, we have arranged priority delivery for tomorrow before 1:00 p.m. In addition, we will refund the shipping cost as a gesture of goodwill. You will receive a tracking update by email within the next hour.\n\nWe apologise again for the inconvenience and appreciate your patience. Please contact me directly if you need any further assistance.\n\nKind regards,\nCustomer Support'
      },
      {
        id: 'we2',
        tags: ['general'],
        title: 'Opinion essay',
        prompt: 'Some people believe that remote work improves productivity, while others think office work is more effective. Write a structured response giving your opinion and examples.',
        minWords: 140,
        plan: ['Introduce the topic', 'Present your opinion clearly', 'Give two supporting reasons with examples', 'Mention the other point of view briefly', 'Conclude clearly'],
        model: 'Remote work can improve productivity in many situations, although it is not the best solution for every job. In my opinion, it is most effective when people need quiet time to complete tasks that require concentration.\n\nOne reason is that working from home often reduces interruptions. In an office, people may lose time because of noise or unexpected conversations. At home, many workers can organise their schedule more efficiently. Another advantage is flexibility. Employees can sometimes work at the time of day when they feel most focused, which may improve the quality of their work.\n\nHowever, office work can still be better for teamwork, especially when fast decisions are needed. Face-to-face communication is often quicker and easier in those situations.\n\nOverall, I think remote work is highly productive when it is well organised, but companies should remain flexible and choose the best system for each task.'
      },
      {
        id: 'we3',
        tags: ['sportsmedia'],
        title: 'Sports event email',
        prompt: 'You are helping to organise a local football event for teenagers. Write an email to volunteers with practical information: arrival time, tasks, equipment, and what to do in case of bad weather.',
        minWords: 120,
        plan: ['Greeting and purpose', 'Arrival time and schedule', 'Volunteer roles', 'Equipment reminders', 'Weather plan and closing'],
        model: 'Dear volunteers,\n\nThank you again for helping with Saturday\'s youth football event. I am writing to confirm the final practical details before the tournament begins.\n\nPlease arrive at the sports centre by 8:15 a.m. so that we can prepare the registration desk and check the pitches before the teams arrive. The first matches will start at 9:00 a.m.\n\nSome of you will welcome teams and parents, while others will help with refreshments, score sheets, and equipment. Please make sure that all balls, bibs, cones, and first-aid materials are ready before the event starts.\n\nIf the weather becomes too bad, the afternoon matches will be moved to the indoor hall. I will send a final confirmation by message early in the morning.\n\nThanks again for your support. Your help will make a real difference for the players.\n\nBest regards,\nEvent Coordinator'
      },
      {
        id: 'we4',
        tags: ['sportsmedia'],
        title: 'Film club recommendation',
        prompt: 'Your community is considering starting a local film club. Write a structured text explaining why this could be a good idea and what should be organised first.',
        minWords: 130,
        plan: ['Introduce the idea', 'Explain benefits for the community', 'Suggest practical first steps', 'Conclude with recommendation'],
        model: 'Starting a local film club could be an excellent idea for the community because it would combine culture, learning, and social interaction. In my opinion, it would attract people of different ages and create a new place for discussion and exchange.\n\nOne important benefit is that films can bring people together around shared interests. After a screening, members could talk about themes, characters, or cultural questions. This would make the club more dynamic than simply watching a film alone at home. It could also help people improve their English if some films or discussions were in English.\n\nTo organise the club successfully, the first steps should be practical. The group needs a venue, basic equipment, a schedule, and a simple way to communicate with members. It would also be useful to choose a clear theme for the first month, such as world cinema, documentaries, or sports films.\n\nOverall, I think a film club would be a positive and realistic project if it is well planned from the beginning.'
      }
    ],
    writingPhoto: [
      {
        id: 'wp1',
        tags: ['general', 'customer'],
        title: 'Office meeting photo',
        visual: '💼🖥️📊',
        details: ['three colleagues', 'laptops open', 'one person presenting', 'documents on the table'],
        prompt: 'Describe the photo. Explain what the people might be doing, how the atmosphere seems, and what could happen next.',
        minWords: 90,
        plan: ['Describe the place', 'Describe the people and actions', 'Add possible purpose', 'End with what may happen next'],
        model: 'In this photo, I can see three colleagues in what looks like a modern office meeting room. Two people are sitting at a table with laptops open, while another person seems to be presenting some information. There are also papers and documents on the table, so they may be discussing a project or preparing for an important client meeting.\n\nThe atmosphere appears focused but positive. The people seem engaged and professional, which suggests that the meeting is productive. It is possible that they are reviewing sales figures, checking a presentation, or deciding on the next steps for a project.\n\nI think the meeting will probably end with a clear action plan, and each person will leave with specific tasks to complete.'
      },
      {
        id: 'wp2',
        tags: ['sportsmedia'],
        title: 'Training ground photo',
        visual: '⚽🏃‍♂️🏟️',
        details: ['young players', 'coach giving instructions', 'cones on the grass', 'late afternoon light'],
        prompt: 'Describe the photo. Say what is happening, what the people might be preparing for, and why the moment seems important.',
        minWords: 90,
        plan: ['State what you can see', 'Describe actions', 'Suggest the purpose', 'Explain why it matters'],
        model: 'This photo shows a group of young football players on a training ground. A coach is standing near them and appears to be giving instructions before an exercise begins. There are cones on the grass, which suggests that the team is about to practise movement, passing, or positioning.\n\nThe players look attentive, so this may be an important training session before a match or tournament. The atmosphere seems serious but encouraging, because the coach probably wants the team to stay focused and improve together.\n\nThis moment is important because preparation often makes a big difference in sport. Clear instructions and organised practice can help players perform better and feel more confident during competition.'
      },
      {
        id: 'wp3',
        tags: ['sportsmedia', 'customer'],
        title: 'Cinema reception photo',
        visual: '🎬🍿🎟️',
        details: ['people at the desk', 'film posters', 'one customer holding a ticket', 'friendly staff member'],
        prompt: 'Describe the photo. Explain the scene, the relationship between the people, and what may happen next.',
        minWords: 90,
        plan: ['Describe the location', 'Explain who the people are', 'Say what they may be discussing', 'Predict the next step'],
        model: 'In this photo, I can see what looks like the reception area of a cinema. There are posters on the wall, and one customer is holding a ticket while speaking to a staff member at the desk. Other people may be waiting nearby for information or for the film to begin.\n\nThe relationship between the people seems polite and professional. The customer may be asking a question about the screening time, seat number, or ticket price. The staff member appears friendly, so the conversation is probably going smoothly.\n\nNext, the customer will most likely go to the screening room, buy snacks, or wait in the lobby until the film starts.'
      }
    ]
  };

  const el = {
    scoreCorrect: document.getElementById('score-correct'),
    scoreTotal: document.getElementById('score-total'),
    footerScore: document.getElementById('footer-score'),
    progressText: document.getElementById('progress-text'),
    progressFill: document.getElementById('progress-fill'),
    accentUs: document.getElementById('accent-us'),
    accentUk: document.getElementById('accent-uk'),
    ipadToggle: document.getElementById('ipad-toggle'),
    copyCheatBtn: document.getElementById('copy-cheat-btn'),
    resetScore: document.getElementById('reset-score'),
    contextFocus: document.getElementById('context-focus'),
    studentName: document.getElementById('student-name'),
    startMockBtn: document.getElementById('start-mock-btn'),
    readAnswerContent: document.getElementById('read-answer-content'),
    readAnswerFeedback: document.getElementById('read-answer-feedback'),
    listenAnswerContent: document.getElementById('listen-answer-content'),
    listenAnswerScript: document.getElementById('listen-answer-script'),
    listenAnswerFeedback: document.getElementById('listen-answer-feedback'),
    listenChooseContent: document.getElementById('listen-choose-content'),
    listenChooseScript: document.getElementById('listen-choose-script'),
    listenChooseFeedback: document.getElementById('listen-choose-feedback'),
    multipleChoiceContent: document.getElementById('multiple-choice-content'),
    multipleChoiceFeedback: document.getElementById('multiple-choice-feedback'),
    fillBlankContent: document.getElementById('fill-blank-content'),
    fillBlankScript: document.getElementById('fill-blank-script'),
    fillBlankFeedback: document.getElementById('fill-blank-feedback'),
    readFluencyContent: document.getElementById('read-fluency-content'),
    readFluencyTimer: document.getElementById('read-fluency-timer'),
    listenRepeatContent: document.getElementById('listen-repeat-content'),
    listenRepeatText: document.getElementById('listen-repeat-text'),
    listenRepeatTimer: document.getElementById('listen-repeat-timer'),
    speakingPromptContent: document.getElementById('speaking-prompt-content'),
    speakingIdeas: document.getElementById('speaking-ideas'),
    speakingModel: document.getElementById('speaking-model'),
    speakingStarters: document.getElementById('speaking-starters'),
    speakingOutline: document.getElementById('speaking-outline'),
    speakingPrepTimer: document.getElementById('speaking-prep-timer'),
    speakingSpeakTimer: document.getElementById('speaking-speak-timer'),
    writingPromptContent: document.getElementById('writing-prompt-content'),
    writingAnswer: document.getElementById('writing-answer'),
    writingPlan: document.getElementById('writing-plan'),
    writingModel: document.getElementById('writing-model'),
    writingSelfCheck: document.getElementById('writing-self-check'),
    writingTimer: document.getElementById('writing-timer'),
    wordCount: document.getElementById('word-count'),
    modeEssay: document.getElementById('mode-essay'),
    modePhoto: document.getElementById('mode-photo'),
    miniMockContent: document.getElementById('mini-mock-content')
  };

  function uid(prefix) {
    return prefix + '-' + Math.random().toString(36).slice(2, 8);
  }

  function safeText(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getContext() {
    return el.contextFocus.value;
  }

  function pickPool(list) {
    const context = getContext();
    if (context === 'general') {
      return list.slice();
    }
    const exact = list.filter(function (item) {
      return Array.isArray(item.tags) && item.tags.indexOf(context) !== -1;
    });
    if (exact.length) {
      return exact;
    }
    const generalPlus = list.filter(function (item) {
      return !Array.isArray(item.tags) || item.tags.indexOf('general') !== -1;
    });
    return generalPlus.length ? generalPlus : list.slice();
  }

  function pickRandom(list, previousId) {
    const pool = pickPool(list);
    let filtered = pool;
    if (previousId && pool.length > 1) {
      filtered = pool.filter(function (item) {
        return item.id !== previousId;
      });
    }
    return filtered[Math.floor(Math.random() * filtered.length)];
  }

  function shuffle(list) {
    const copy = list.slice();
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = copy[i];
      copy[i] = copy[j];
      copy[j] = temp;
    }
    return copy;
  }

  function speakText(text, rate) {
    if (!('speechSynthesis' in window)) {
      return;
    }
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = state.accent;
    utter.rate = rate || 1;
    utter.pitch = 1;

    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(function (voice) {
      return voice.lang && voice.lang.toLowerCase().indexOf(state.accent.toLowerCase()) === 0;
    });
    if (preferred) {
      utter.voice = preferred;
    }
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  }

  if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = function () {
      return true;
    };
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
      return;
    }
    const temp = document.createElement('textarea');
    temp.value = text;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand('copy');
    document.body.removeChild(temp);
  }

  function setFeedback(node, html, good) {
    node.innerHTML = html;
    node.className = 'feedback ' + (good ? 'good' : 'bad');
  }

  function clearFeedback(node) {
    node.textContent = '';
    node.className = 'feedback';
  }

  function updateScore(correctAdd, totalAdd) {
    state.scoreCorrect += correctAdd;
    state.scoreTotal += totalAdd;
    el.scoreCorrect.textContent = state.scoreCorrect;
    el.scoreTotal.textContent = state.scoreTotal;
    el.footerScore.textContent = 'Score ' + state.scoreCorrect + ' / ' + state.scoreTotal;
  }

  function resetScore() {
    state.scoreCorrect = 0;
    state.scoreTotal = 0;
    updateScore(0, 0);
  }

  function updateProgress() {
    const totalSections = 4;
    const value = Math.round((state.completed.size / totalSections) * 100);
    el.progressText.textContent = value + '%';
    el.progressFill.style.width = value + '%';
  }

  function toggleComplete(key, button) {
    if (state.completed.has(key)) {
      state.completed.delete(key);
      button.classList.remove('done');
      button.textContent = 'Mark complete';
    } else {
      state.completed.add(key);
      button.classList.add('done');
      button.textContent = 'Completed ✓';
    }
    updateProgress();
  }

  function normalizeAnswer(value) {
    return String(value || '')
      .trim()
      .toLowerCase()
      .replace(/[\s]+/g, ' ')
      .replace(/[€]/g, ' euros ')
      .replace(/[^a-z0-9:.,/ ]/g, '');
  }

  function startTimer(key, seconds, displayNode, formatter) {
    if (state.timers[key]) {
      clearInterval(state.timers[key]);
    }
    let remaining = seconds;
    displayNode.textContent = formatter ? formatter(remaining) : String(remaining);
    state.timers[key] = setInterval(function () {
      remaining -= 1;
      displayNode.textContent = formatter ? formatter(Math.max(remaining, 0)) : String(Math.max(remaining, 0));
      if (remaining <= 0) {
        clearInterval(state.timers[key]);
      }
    }, 1000);
  }

  function mmss(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
  }

  function renderQuestionBlock(group, question, index) {
    const name = group + '-' + index + '-' + uid('q');
    let optionsHtml = '';
    question.options.forEach(function (option, optionIndex) {
      optionsHtml += '<label class="option-label" data-q="' + index + '" data-opt="' + optionIndex + '">' +
        '<input type="radio" name="' + name + '" value="' + optionIndex + '"> <span>' + safeText(option) + '</span></label>';
    });
    return '<div class="question-box" data-name="' + name + '">' +
      '<p>' + safeText(question.q) + '</p>' +
      '<div class="options">' + optionsHtml + '</div></div>';
  }

  function renderReadAnswer() {
    const previous = state.current.readAnswer ? state.current.readAnswer.id : null;
    const task = pickRandom(data.readAnswer, previous);
    state.current.readAnswer = task;
    state.evaluated.readAnswer = false;
    clearFeedback(el.readAnswerFeedback);
    let html = '<div class="prompt-box"><strong>' + safeText(task.title) + '</strong></div>';
    html += '<div class="text-box">' + safeText(task.text).replace(/\n/g, '<br>') + '</div>';
    task.questions.forEach(function (question, index) {
      html += renderQuestionBlock('read-answer', question, index);
    });
    el.readAnswerContent.innerHTML = html;
  }

  function checkQuestionSet(container, task, feedbackNode, stateKey) {
    let correct = 0;
    let details = '';
    task.questions.forEach(function (question, qIndex) {
      const box = container.querySelectorAll('.question-box')[qIndex];
      const labels = box.querySelectorAll('.option-label');
      const checked = box.querySelector('input[type="radio"]:checked');
      labels.forEach(function (label, idx) {
        label.classList.remove('correct');
        label.classList.remove('wrong');
        if (idx === question.answer) {
          label.classList.add('correct');
        }
      });
      if (checked && Number(checked.value) === question.answer) {
        correct += 1;
      } else if (checked) {
        labels[Number(checked.value)].classList.add('wrong');
      }
      details += '<strong>Q' + (qIndex + 1) + ':</strong> ' + safeText(question.explain) + '<br>';
    });

    if (!state.evaluated[stateKey]) {
      updateScore(correct, task.questions.length);
      state.evaluated[stateKey] = true;
    }
    setFeedback(feedbackNode, 'You got <strong>' + correct + ' / ' + task.questions.length + '</strong>.<br>' + details, correct === task.questions.length);
  }

  function renderListenAnswer() {
    const previous = state.current.listenAnswer ? state.current.listenAnswer.id : null;
    const task = pickRandom(data.listenAnswer, previous);
    state.current.listenAnswer = task;
    state.evaluated.listenAnswer = false;
    clearFeedback(el.listenAnswerFeedback);
    el.listenAnswerScript.classList.add('hidden');
    el.listenAnswerScript.innerHTML = safeText(task.transcript);
    let html = '<div class="prompt-box"><strong>' + safeText(task.title) + '</strong><br><span class="muted">Listen and answer the questions.</span></div>';
    task.questions.forEach(function (question, index) {
      html += renderQuestionBlock('listen-answer', question, index);
    });
    el.listenAnswerContent.innerHTML = html;
  }

  function renderListenChoose() {
    const previous = state.current.listenChoose ? state.current.listenChoose.id : null;
    const task = pickRandom(data.listenChoose, previous);
    state.current.listenChoose = task;
    state.evaluated.listenChoose = false;
    clearFeedback(el.listenChooseFeedback);
    el.listenChooseScript.classList.add('hidden');
    el.listenChooseScript.innerHTML = safeText(task.transcript);
    let html = '<div class="prompt-box"><strong>' + safeText(task.title) + '</strong></div>';
    html += renderQuestionBlock('listen-choose', { q: task.question, options: task.options, answer: task.answer }, 0);
    el.listenChooseContent.innerHTML = html;
  }

  function checkListenChoose() {
    const task = state.current.listenChoose;
    const container = el.listenChooseContent;
    const box = container.querySelector('.question-box');
    const labels = box.querySelectorAll('.option-label');
    const checked = box.querySelector('input[type="radio"]:checked');
    labels.forEach(function (label, index) {
      label.classList.remove('correct');
      label.classList.remove('wrong');
      if (index === task.answer) {
        label.classList.add('correct');
      }
    });
    const isCorrect = checked && Number(checked.value) === task.answer;
    if (checked && !isCorrect) {
      labels[Number(checked.value)].classList.add('wrong');
    }
    if (!state.evaluated.listenChoose) {
      updateScore(isCorrect ? 1 : 0, 1);
      state.evaluated.listenChoose = true;
    }
    setFeedback(el.listenChooseFeedback, (isCorrect ? 'Correct.' : 'Not quite.') + ' ' + safeText(task.explain), isCorrect);
  }

  function renderMultipleChoice() {
    state.current.multipleChoice = shuffle(data.multipleChoice).slice(0, 5);
    state.evaluated.multipleChoice = false;
    clearFeedback(el.multipleChoiceFeedback);
    let html = '';
    state.current.multipleChoice.forEach(function (question, index) {
      html += renderQuestionBlock('multiple-choice', question, index);
    });
    el.multipleChoiceContent.innerHTML = html;
  }

  function checkMultipleChoice() {
    const task = { questions: state.current.multipleChoice };
    checkQuestionSet(el.multipleChoiceContent, task, el.multipleChoiceFeedback, 'multipleChoice');
  }

  function renderFillBlank() {
    const previous = state.current.fillBlank ? state.current.fillBlank.id : null;
    const task = pickRandom(data.fillBlank, previous);
    state.current.fillBlank = task;
    state.evaluated.fillBlank = false;
    clearFeedback(el.fillBlankFeedback);
    el.fillBlankScript.classList.add('hidden');
    el.fillBlankScript.innerHTML = safeText(task.transcript);
    el.fillBlankContent.innerHTML = '<div class="prompt-box"><strong>' + safeText(task.prompt) + '</strong></div>' +
      '<label><span>Your answer</span><input type="text" id="fill-blank-input" placeholder="Type the answer"></label>';
  }

  function checkFillBlank() {
    const task = state.current.fillBlank;
    const input = document.getElementById('fill-blank-input');
    const answer = normalizeAnswer(input.value);
    const ok = task.answers.some(function (candidate) {
      return normalizeAnswer(candidate) === answer;
    });
    if (!state.evaluated.fillBlank) {
      updateScore(ok ? 1 : 0, 1);
      state.evaluated.fillBlank = true;
    }
    setFeedback(el.fillBlankFeedback, (ok ? 'Correct.' : 'Not quite.') + ' ' + safeText(task.explain), ok);
  }

  function renderReadFluency() {
    const previous = state.current.readFluency ? state.current.readFluency.id : null;
    const task = pickRandom(data.readFluency, previous);
    state.current.readFluency = task;
    el.readFluencyContent.innerHTML = '<div class="text-box">' + safeText(task.text) + '</div>';
    el.readFluencyTimer.textContent = '60';
  }

  function renderListenRepeat() {
    const previous = state.current.listenRepeat ? state.current.listenRepeat.id : null;
    const task = pickRandom(data.listenRepeat, previous);
    state.current.listenRepeat = task;
    el.listenRepeatContent.innerHTML = '<div class="prompt-box"><strong>Listen carefully, then repeat the sentence aloud.</strong></div>';
    el.listenRepeatText.textContent = task.text;
    el.listenRepeatText.classList.add('hidden');
    el.listenRepeatTimer.textContent = '15';
  }

  function renderSpeakingStarters() {
    el.speakingStarters.innerHTML = '';
    speakingStarters.forEach(function (text) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'chip';
      btn.textContent = text;
      btn.addEventListener('click', function () {
        insertAtCursor(el.speakingOutline, text + ' ');
      });
      el.speakingStarters.appendChild(btn);
    });
  }

  function insertAtCursor(textarea, text) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;
    textarea.value = value.slice(0, start) + text + value.slice(end);
    textarea.focus();
    textarea.selectionStart = textarea.selectionEnd = start + text.length;
  }

  function renderSpeakingPrompt() {
    const previous = state.current.speaking ? state.current.speaking.id : null;
    const task = pickRandom(data.speaking, previous);
    state.current.speaking = task;
    el.speakingIdeas.classList.add('hidden');
    el.speakingModel.classList.add('hidden');
    el.speakingIdeas.innerHTML = '<strong>Useful ideas:</strong><br>' + safeText(task.ideas.join(' • '));
    el.speakingModel.innerHTML = '<strong>Model answer:</strong><br>' + safeText(task.model).replace(/\n/g, '<br>');
    el.speakingPromptContent.innerHTML = '<div class="prompt-box"><strong>Prompt:</strong><br>' + safeText(task.prompt) + '</div>';
    el.speakingPrepTimer.textContent = '45';
    el.speakingSpeakTimer.textContent = '60';
  }

  function renderWritingTask() {
    const source = state.writingMode === 'essay' ? data.writingEssay : data.writingPhoto;
    const previous = state.current.writing ? state.current.writing.id : null;
    const task = pickRandom(source, previous);
    state.current.writing = task;
    el.writingPlan.classList.add('hidden');
    el.writingModel.classList.add('hidden');
    el.writingSelfCheck.innerHTML = '';
    el.writingSelfCheck.className = 'feedback';

    if (state.writingMode === 'essay') {
      el.writingPromptContent.innerHTML = '<div class="prompt-box">' +
        '<div class="badge-row"><span class="badge">Essay / structured response</span><span class="badge">Minimum ' + task.minWords + ' words</span></div>' +
        '<strong>' + safeText(task.title) + '</strong><p>' + safeText(task.prompt) + '</p></div>';
    } else {
      const details = task.details.map(function (detail) {
        return '<span class="badge">' + safeText(detail) + '</span>';
      }).join('');
      el.writingPromptContent.innerHTML = '<div class="photo-card">' +
        '<div class="badge-row"><span class="badge">Describe the photo</span><span class="badge">Minimum ' + task.minWords + ' words</span></div>' +
        '<div class="photo-visual">' + safeText(task.visual) + '</div>' +
        '<strong>' + safeText(task.title) + '</strong><div class="badge-row">' + details + '</div>' +
        '<p>' + safeText(task.prompt) + '</p></div>';
    }

    el.writingPlan.innerHTML = '<strong>Suggested plan:</strong><br>' + task.plan.map(function (step, index) {
      return (index + 1) + '. ' + safeText(step);
    }).join('<br>');
    el.writingModel.innerHTML = '<strong>Model answer:</strong><br>' + safeText(task.model).replace(/\n/g, '<br>');
  }

  function updateWordCount() {
    const text = el.writingAnswer.value.trim();
    const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
    el.wordCount.textContent = String(words);
  }

  function selfCheckWriting() {
    const task = state.current.writing;
    const text = el.writingAnswer.value.trim();
    const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
    const connectors = ['however', 'therefore', 'for example', 'overall', 'first', 'another', 'because', 'in my opinion'];
    const foundConnectors = connectors.filter(function (item) {
      return text.toLowerCase().indexOf(item) !== -1;
    });
    const paragraphs = text.split(/\n+/).filter(function (line) {
      return line.trim();
    }).length;
    const comments = [];

    if (words >= task.minWords) {
      comments.push('✅ Word count target reached (' + words + ' words).');
    } else {
      comments.push('❌ Try to reach at least ' + task.minWords + ' words. You have ' + words + '.');
    }

    if (paragraphs >= 2) {
      comments.push('✅ Your answer is split into more than one paragraph.');
    } else {
      comments.push('❌ Add clearer paragraphing to organise your ideas.');
    }

    if (foundConnectors.length >= 2) {
      comments.push('✅ Good use of connectors: ' + foundConnectors.join(', ') + '.');
    } else {
      comments.push('❌ Add more connectors such as “for example”, “however”, or “overall”.');
    }

    if (/dear|kind regards|best regards|hello/i.test(text) && state.writingMode === 'essay') {
      comments.push('✅ Your tone sounds suitable for a professional email-style response.');
    }

    setFeedback(el.writingSelfCheck, comments.join('<br>'), words >= task.minWords && foundConnectors.length >= 2);
  }

  function generateMiniMock() {
    const student = el.studentName.value.trim() || 'Mathieu';
    const readTask = pickRandom(data.readAnswer);
    const listenTask = pickRandom(data.listenAnswer);
    const speakingTask = pickRandom(data.speaking);
    const writingSource = state.writingMode === 'essay' ? data.writingEssay : data.writingPhoto;
    const writingTask = pickRandom(writingSource);

    const text =
      'Mini mock for ' + student + '\n\n' +
      '1. Read and answer\n' +
      '- ' + readTask.title + '\n\n' +
      '2. Listen and answer\n' +
      '- ' + listenTask.title + '\n\n' +
      '3. Speaking prompt\n' +
      '- ' + speakingTask.prompt + '\n\n' +
      '4. Writing task\n' +
      '- ' + writingTask.title + ': ' + writingTask.prompt + '\n\n' +
      'Teacher quick focus\n' +
      '- listening: key facts and timing\n' +
      '- reading: precise detail\n' +
      '- speaking: structure + clear example + close\n' +
      '- writing: organisation + connectors + polite/clear language';

    el.miniMockContent.textContent = text;
  }

  function reportText() {
    const student = el.studentName.value.trim() || 'Mathieu';
    return 'VTest realistic mock report\n' +
      'Student: ' + student + '\n' +
      'Context: ' + getContext() + '\n' +
      'Score: ' + state.scoreCorrect + ' / ' + state.scoreTotal + '\n' +
      'Completed sections: ' + Array.from(state.completed).join(', ') + '\n\n' +
      'Current speaking prompt:\n' + (state.current.speaking ? state.current.speaking.prompt : '') + '\n\n' +
      'Current writing task:\n' + (state.current.writing ? state.current.writing.prompt : '') + '\n\n' +
      'Suggested follow-up:\n' +
      '- Review errors from listening/reading\n' +
      '- Repeat speaking with one stronger example\n' +
      '- Rewrite the writing task using better connectors and clearer structure';
  }

  function setMode(mode) {
    state.writingMode = mode;
    el.modeEssay.classList.toggle('active', mode === 'essay');
    el.modePhoto.classList.toggle('active', mode === 'photo');
    renderWritingTask();
  }

  function hookEvents() {
    el.accentUs.addEventListener('click', function () {
      state.accent = 'en-US';
      el.accentUs.classList.add('active');
      el.accentUk.classList.remove('active');
    });
    el.accentUk.addEventListener('click', function () {
      state.accent = 'en-GB';
      el.accentUk.classList.add('active');
      el.accentUs.classList.remove('active');
    });
    el.ipadToggle.addEventListener('click', function () {
      state.ipadMode = !state.ipadMode;
      el.ipadToggle.classList.toggle('active', state.ipadMode);
      el.ipadToggle.textContent = state.ipadMode ? 'On' : 'Off';
      el.ipadToggle.setAttribute('aria-pressed', state.ipadMode ? 'true' : 'false');
    });

    document.querySelectorAll('.complete-btn').forEach(function (button) {
      button.addEventListener('click', function () {
        toggleComplete(button.getAttribute('data-complete'), button);
      });
    });

    el.resetScore.addEventListener('click', resetScore);

    el.copyCheatBtn.addEventListener('click', function () {
      copyText(
        'VTest-style quick tips\n' +
        '- Read the question carefully before you answer.\n' +
        '- In listening, focus on dates, numbers, actions, and changes.\n' +
        '- It is better to say something than nothing in speaking.\n' +
        '- Use a simple structure: opinion, reason, example, close.\n' +
        '- In writing, organise clearly and proofread at the end.'
      );
      el.copyCheatBtn.textContent = 'Copied ✓';
      window.setTimeout(function () {
        el.copyCheatBtn.textContent = 'Copy quick exam tips';
      }, 1500);
    });

    el.startMockBtn.addEventListener('click', function () {
      renderAll();
      generateMiniMock();
      document.getElementById('listening-reading').scrollIntoView({ behavior: 'smooth' });
    });

    el.contextFocus.addEventListener('change', function () {
      renderAll();
    });

    document.getElementById('check-read-answer').addEventListener('click', function () {
      checkQuestionSet(el.readAnswerContent, state.current.readAnswer, el.readAnswerFeedback, 'readAnswer');
    });
    document.getElementById('new-read-answer').addEventListener('click', renderReadAnswer);
    document.getElementById('copy-read-text').addEventListener('click', function () {
      copyText(state.current.readAnswer.text);
    });

    document.getElementById('play-listen-answer').addEventListener('click', function () {
      speakText(state.current.listenAnswer.audio, 1);
    });
    document.getElementById('slow-listen-answer').addEventListener('click', function () {
      speakText(state.current.listenAnswer.audio, 0.8);
    });
    document.getElementById('toggle-listen-answer-script').addEventListener('click', function (event) {
      el.listenAnswerScript.classList.toggle('hidden');
      event.currentTarget.textContent = el.listenAnswerScript.classList.contains('hidden') ? 'Show transcript' : 'Hide transcript';
    });
    document.getElementById('check-listen-answer').addEventListener('click', function () {
      checkQuestionSet(el.listenAnswerContent, state.current.listenAnswer, el.listenAnswerFeedback, 'listenAnswer');
    });
    document.getElementById('new-listen-answer').addEventListener('click', renderListenAnswer);

    document.getElementById('play-listen-choose').addEventListener('click', function () {
      speakText(state.current.listenChoose.audio, 1);
    });
    document.getElementById('slow-listen-choose').addEventListener('click', function () {
      speakText(state.current.listenChoose.audio, 0.8);
    });
    document.getElementById('toggle-listen-choose-script').addEventListener('click', function (event) {
      el.listenChooseScript.classList.toggle('hidden');
      event.currentTarget.textContent = el.listenChooseScript.classList.contains('hidden') ? 'Show transcript' : 'Hide transcript';
    });
    document.getElementById('check-listen-choose').addEventListener('click', checkListenChoose);
    document.getElementById('new-listen-choose').addEventListener('click', renderListenChoose);

    document.getElementById('check-multiple-choice').addEventListener('click', checkMultipleChoice);
    document.getElementById('new-multiple-choice').addEventListener('click', renderMultipleChoice);

    document.getElementById('play-fill-blank').addEventListener('click', function () {
      speakText(state.current.fillBlank.audio, 1);
    });
    document.getElementById('slow-fill-blank').addEventListener('click', function () {
      speakText(state.current.fillBlank.audio, 0.78);
    });
    document.getElementById('toggle-fill-blank-script').addEventListener('click', function (event) {
      el.fillBlankScript.classList.toggle('hidden');
      event.currentTarget.textContent = el.fillBlankScript.classList.contains('hidden') ? 'Show transcript' : 'Hide transcript';
    });
    document.getElementById('check-fill-blank').addEventListener('click', checkFillBlank);
    document.getElementById('new-fill-blank').addEventListener('click', renderFillBlank);

    document.getElementById('start-read-fluency').addEventListener('click', function () {
      startTimer('readFluency', 60, el.readFluencyTimer);
    });
    document.getElementById('new-read-fluency').addEventListener('click', renderReadFluency);
    document.getElementById('copy-read-fluency').addEventListener('click', function () {
      copyText(state.current.readFluency.text);
    });

    document.getElementById('play-listen-repeat').addEventListener('click', function () {
      speakText(state.current.listenRepeat.text, 1);
    });
    document.getElementById('slow-listen-repeat').addEventListener('click', function () {
      speakText(state.current.listenRepeat.text, 0.75);
    });
    document.getElementById('start-listen-repeat').addEventListener('click', function () {
      startTimer('listenRepeat', 15, el.listenRepeatTimer);
    });
    document.getElementById('toggle-listen-repeat-text').addEventListener('click', function (event) {
      el.listenRepeatText.classList.toggle('hidden');
      event.currentTarget.textContent = el.listenRepeatText.classList.contains('hidden') ? 'Show text' : 'Hide text';
    });
    document.getElementById('new-listen-repeat').addEventListener('click', renderListenRepeat);

    document.getElementById('start-speaking-prep').addEventListener('click', function () {
      startTimer('speakingPrep', 45, el.speakingPrepTimer);
    });
    document.getElementById('start-speaking-speak').addEventListener('click', function () {
      startTimer('speakingSpeak', 60, el.speakingSpeakTimer);
    });
    document.getElementById('new-speaking-prompt').addEventListener('click', renderSpeakingPrompt);
    document.getElementById('toggle-speaking-ideas').addEventListener('click', function (event) {
      el.speakingIdeas.classList.toggle('hidden');
      event.currentTarget.textContent = el.speakingIdeas.classList.contains('hidden') ? 'Show ideas' : 'Hide ideas';
    });
    document.getElementById('toggle-speaking-model').addEventListener('click', function (event) {
      el.speakingModel.classList.toggle('hidden');
      event.currentTarget.textContent = el.speakingModel.classList.contains('hidden') ? 'Show model answer' : 'Hide model answer';
    });
    document.getElementById('clear-speaking-outline').addEventListener('click', function () {
      el.speakingOutline.value = '';
    });

    el.modeEssay.addEventListener('click', function () {
      setMode('essay');
    });
    el.modePhoto.addEventListener('click', function () {
      setMode('photo');
    });
    el.writingAnswer.addEventListener('input', updateWordCount);

    document.getElementById('start-writing-timer').addEventListener('click', function () {
      startTimer('writing', 30 * 60, el.writingTimer, mmss);
    });
    document.getElementById('reset-writing-timer').addEventListener('click', function () {
      if (state.timers.writing) {
        clearInterval(state.timers.writing);
      }
      el.writingTimer.textContent = '30:00';
    });
    document.getElementById('new-essay-task').addEventListener('click', function () {
      setMode('essay');
    });
    document.getElementById('new-photo-task').addEventListener('click', function () {
      setMode('photo');
    });
    document.getElementById('toggle-writing-plan').addEventListener('click', function (event) {
      el.writingPlan.classList.toggle('hidden');
      event.currentTarget.textContent = el.writingPlan.classList.contains('hidden') ? 'Show plan' : 'Hide plan';
    });
    document.getElementById('toggle-writing-model').addEventListener('click', function (event) {
      el.writingModel.classList.toggle('hidden');
      event.currentTarget.textContent = el.writingModel.classList.contains('hidden') ? 'Show model answer' : 'Hide model answer';
    });
    document.getElementById('listen-writing-model').addEventListener('click', function () {
      if (state.current.writing) {
        speakText(state.current.writing.model.replace(/\n/g, ' '), 1);
      }
    });
    document.getElementById('self-check-writing').addEventListener('click', selfCheckWriting);
    document.getElementById('clear-writing-answer').addEventListener('click', function () {
      el.writingAnswer.value = '';
      updateWordCount();
    });

    document.getElementById('generate-mini-mock').addEventListener('click', generateMiniMock);
    document.getElementById('copy-report').addEventListener('click', function () {
      copyText(reportText());
      this.textContent = 'Copied ✓';
      const self = this;
      window.setTimeout(function () {
        self.textContent = 'Copy report';
      }, 1500);
    });
  }

  function renderAll() {
    renderReadAnswer();
    renderListenAnswer();
    renderListenChoose();
    renderMultipleChoice();
    renderFillBlank();
    renderReadFluency();
    renderListenRepeat();
    renderSpeakingPrompt();
    renderWritingTask();
    updateWordCount();
  }

  function init() {
    hookEvents();
    renderSpeakingStarters();
    renderAll();
    generateMiniMock();
    updateProgress();
  }

  init();
}());
