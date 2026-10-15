const LEVEL_MODELS = [
 [
  [
   "I prefer working from home.",
   "It saves travel time.",
   "For example, I can start work earlier.",
   "But I sometimes miss my colleagues.",
   "Overall, I prefer working from home."
  ],
  [
   "I think working from home is better for tasks that require concentration.",
   "One reason is that employees can avoid a long commute and organise their day more easily.",
   "For example, I can finish a detailed report without interruptions from a busy office.",
   "However, the office is often better for quick discussions and teamwork.",
   "Overall, I would recommend a mixture of home and office days."
  ],
  [
   "In my view, remote work is most effective when organisations adapt it to the nature of each task.",
   "Reduced commuting and greater autonomy can improve productivity, particularly for focused individual work.",
   "For instance, a project analyst might prepare complex data at home and reserve office days for collaborative decisions.",
   "Nevertheless, fully remote arrangements may weaken informal communication and make onboarding more difficult.",
   "On balance, I would favour a structured hybrid policy rather than treating either location as universally superior."
  ]
 ],
 [
  [
   "I think AI makes work easier.",
   "It can save time.",
   "For example, it can help write a first draft of an email.",
   "But people must check its answers.",
   "Overall, AI is useful when we use it carefully."
  ],
  [
   "I believe AI can make many jobs more efficient.",
   "It helps employees handle repetitive tasks and spend more time on important decisions.",
   "For example, a customer-service team can use AI to organise common questions before a person replies.",
   "However, AI can make mistakes and should not replace human judgement.",
   "Overall, I would recommend using AI as a tool, with clear checks for accuracy and privacy."
  ],
  [
   "From my perspective, AI can substantially improve workplace efficiency, provided that its limitations are understood.",
   "By automating routine processes, it can free employees to concentrate on analysis, relationships and complex decisions.",
   "For instance, an AI assistant might summarise a lengthy report, while a specialist verifies the figures and draws conclusions.",
   "Nevertheless, inaccurate outputs, confidentiality risks and overreliance on automation remain serious concerns.",
   "Consequently, I would advocate targeted adoption, staff training and human oversight rather than unrestricted deployment."
  ]
 ],
 [
  [
   "I like online training.",
   "It is flexible.",
   "For example, I can study at home after work.",
   "But I sometimes need help from a teacher.",
   "Overall, I prefer online lessons for simple topics."
  ],
  [
   "In my opinion, online training can be as effective as classroom learning for motivated students.",
   "It gives learners flexibility and lets them review materials at their own pace.",
   "For example, an employee can replay a grammar explanation before practising it in a video lesson.",
   "However, classroom sessions may offer more immediate interaction and practical teamwork.",
   "Overall, I would choose a blended course with online resources and regular live practice."
  ],
  [
   "I would argue that training effectiveness depends more on instructional design than on whether the course is online or face to face.",
   "Well-structured online programmes can combine flexibility, repeated practice and personalised feedback.",
   "For instance, learners might prepare independently through short modules and then apply their knowledge in a live problem-solving session.",
   "That said, subjects requiring hands-on demonstrations or spontaneous group interaction may benefit from physical classrooms.",
   "Ultimately, I would recommend blended delivery, with the format chosen according to the learning objective."
  ]
 ],
 [
  [
   "I prefer travelling by train.",
   "It is comfortable for short trips.",
   "For example, I can read during the journey.",
   "But flying is faster for long distances.",
   "Overall, I choose the train when possible."
  ],
  [
   "I think trains are often better than planes for journeys between nearby cities.",
   "Stations are usually easier to reach, and passengers can use the travel time to work or relax.",
   "For example, on a three-hour train journey, I can avoid the extra time needed for airport security.",
   "However, flying is more practical when the destination is very far away.",
   "Overall, I would compare the total journey time before booking."
  ],
  [
   "In my view, rail travel is frequently the stronger option on short and medium-distance routes.",
   "When transfers, check-in procedures and city-centre access are considered, trains can be both convenient and less environmentally damaging.",
   "For example, a direct intercity service may take only slightly longer than a flight once airport transfers are included.",
   "Nevertheless, air travel remains essential for many international routes where rail connections are limited.",
   "On balance, I would prioritise rail where the overall journey is competitive, while recognising that distance and accessibility matter."
  ]
 ],
 [
  [
   "I think good service is very important.",
   "Customers need help when there is a problem.",
   "For example, a helpful employee can solve a delivery issue.",
   "But prices must also be fair.",
   "Overall, I choose good service at a reasonable price."
  ],
  [
   "I believe companies should focus on service quality as well as competitive prices.",
   "Helpful staff and clear communication can encourage customers to return.",
   "For example, a company that quickly replaces a damaged product may keep a loyal customer even if its prices are slightly higher.",
   "However, very high prices can still discourage people from buying.",
   "Overall, I would recommend reliable service supported by transparent, fair pricing."
  ],
  [
   "From my perspective, long-term customer loyalty depends more on consistent service quality than on being the cheapest provider.",
   "Responsive support, trustworthy information and effective problem resolution can create value that a discount alone cannot offer.",
   "For instance, a retailer that handles a delayed delivery proactively may protect its reputation and reduce complaints.",
   "Nevertheless, price sensitivity is real, particularly when customers perceive little difference between competing offers.",
   "I would therefore prioritise measurable service standards while keeping prices sufficiently competitive for the target market."
  ]
 ],
 [
  [
   "I think companies should reduce waste.",
   "It is better for the environment.",
   "For example, offices can use less paper.",
   "But some changes cost money.",
   "Overall, companies should start with simple actions."
  ],
  [
   "I think businesses should make waste reduction a clear priority.",
   "Using fewer materials can protect the environment and lower operating costs over time.",
   "For example, a company could replace disposable cups with reusable ones and improve recycling in its offices.",
   "However, new equipment and processes may require an initial investment.",
   "Overall, I would recommend setting realistic targets and measuring the results."
  ],
  [
   "I strongly believe organisations should take greater responsibility for reducing waste across their operations.",
   "Beyond the environmental benefits, better resource management can improve efficiency and strengthen stakeholder trust.",
   "For instance, a manufacturer could redesign packaging, monitor material losses and work with suppliers to reduce unnecessary shipments.",
   "Admittedly, implementation may involve upfront costs and coordination challenges, particularly for smaller businesses.",
   "Even so, I would advocate a phased strategy with measurable targets, employee involvement and regular progress reviews."
  ]
 ],
 [
  [
   "I like the idea of a four-day working week.",
   "People can have more time to rest.",
   "For example, they can spend Friday with their family.",
   "But some businesses need staff every day.",
   "Overall, I think it is a good idea for some jobs."
  ],
  [
   "I think a four-day working week could improve employees' work-life balance.",
   "More time to rest may help people stay motivated and focused at work.",
   "For example, an employee could use an extra day for family responsibilities and return feeling refreshed.",
   "However, customer-facing teams would need careful schedules to maintain service.",
   "Overall, I would recommend testing the idea before making it permanent."
  ],
  [
   "In my opinion, a four-day working week deserves serious consideration, but its success depends on workload and service requirements.",
   "A shorter schedule could improve wellbeing and retention if organisations also redesign inefficient processes.",
   "For example, a company might reduce unnecessary meetings and run a limited pilot while monitoring output and customer satisfaction.",
   "Nevertheless, compressing the same workload into fewer days could increase pressure rather than reduce it.",
   "I would therefore support a carefully evaluated trial with clear performance measures and safeguards against overwork."
  ]
 ],
 [
  [
   "I prefer face-to-face meetings.",
   "It is easier to talk to people.",
   "For example, I can ask a quick question in the room.",
   "But video calls save travel time.",
   "Overall, I prefer meeting in person for important discussions."
  ],
  [
   "I believe face-to-face meetings are often better for complex team discussions.",
   "People can read body language more easily and solve misunderstandings quickly.",
   "For example, a project team may make a difficult decision faster when everyone can discuss ideas around one table.",
   "However, video calls are more convenient when colleagues work in different cities.",
   "Overall, I would choose the meeting format according to the purpose."
  ],
  [
   "From my perspective, in-person meetings offer distinct advantages for relationship-building and sensitive decision-making.",
   "Non-verbal signals and informal exchanges can improve trust and help teams address disagreement constructively.",
   "For instance, a new project team might benefit from meeting face to face before collaborating remotely on routine updates.",
   "That said, video calls reduce travel and can make participation easier for geographically dispersed colleagues.",
   "On balance, I would reserve in-person meetings for high-value collaboration and use well-managed video calls for straightforward coordination."
  ]
 ]
];
