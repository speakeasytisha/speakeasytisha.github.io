'use strict';
/* =====================================================================
   LAURA · CABIN DESIGN ENGLISH · LESSON 02 — Two cabinets. One assembly.
   Files: index.html · style.css · script.js
   ===================================================================== */

/* ---------------------------------------------------------------
   1. DATA · QUESTIONS
   --------------------------------------------------------------- */
const QUESTIONS = {
  position:[
    {id:'p1',type:'choice',prompt:'Where is the tray in the finished unit?',options:['In front of the worktop.','Under the shelf.','Outside Cabinet A.'],answer:1,hint:'Look in the lower part of open Cabinet A.',explain:'The tray is directly under the shelf.'},
    {id:'p2',type:'fill',prompt:'Complete with two words meaning “beside”. Cabinet B is ___ Cabinet A.',answer:['next to'],hint:'Start with “next”.',explain:'Cabinet B is next to Cabinet A.'},
    {id:'p3',type:'choice',prompt:'Which sentence gives the exact side of Cabinet B from this front view?',options:['Cabinet B is to the right of Cabinet A.','Cabinet B is next to Cabinet A.','Cabinet B is to the left of Cabinet A.'],answer:0,hint:'“Next to” tells you the cabinets are beside each other. Which sentence tells you the side?',explain:'Cabinet B is to the right of Cabinet A in the front view.'},
    {id:'p4',type:'fill',prompt:'Complete with one word. The divider is ___ Cabinet A and Cabinet B.',answer:['between'],hint:'You are naming two reference points.',explain:'Use “between A and B” for a position in the middle of two things.'},
    {id:'p5',type:'choice',prompt:'Which sentence says that the worktop rests on the cabinets?',options:['The worktop is behind the cabinets.','The worktop is under the cabinets.','The worktop is on top of the cabinets.'],answer:2,hint:'Choose the expression that describes contact with the top surface.',explain:'“On top of” puts the worktop on the upper surface of both cabinets.'},
    {id:'p6',type:'choice',prompt:'The arrow on the container points down. The container is…',options:['the right way up.','upside down.','on its side.'],answer:1,hint:'The top is now at the bottom.',explain:'If the arrow points down, the container is upside down.'},
    {id:'p7',type:'fill',prompt:'Complete with one word. The container isn’t standing up. It’s lying ___ its side.',answer:['on'],hint:'Think of “on top of”, “on the door”…',explain:'“On its side” = lying on one side.'},
    {id:'p8',type:'choice',prompt:'Choose the correct sentence.',options:['The shelf is up the tray.','The shelf is upper the tray.','The shelf is above the tray.'],answer:2,hint:'You need a preposition followed by a reference point.',explain:'“Above” is a preposition: above + the tray. “Up” is an adverb (move it up) and “upper” is an adjective (the upper shelf).'},
    {id:'p9',type:'choice',prompt:'On an aircraft drawing, what does “RH side” mean?',options:['The right-hand side when you face the front of the aircraft.','The right-hand side of your screen, always.','The side near the cockpit.'],answer:0,hint:'Aircraft sides do not change with your drawing view.',explain:'LH / RH are defined when you face forward, towards the nose of the aircraft.'},
    {id:'p10',type:'fill',prompt:'The galley is at the back of the aircraft, near the tail. In aircraft English, it’s at the ___ end of the cabin.',answer:['aft'],hint:'The opposite of “forward”.',explain:'“Aft” = towards the tail. “Forward” = towards the nose.'},
    {id:'p11',type:'fill',prompt:'Complete with one word. The label is in the top-left ___ of the door.',answer:['corner'],hint:'Where two edges meet.',explain:'“In the top-left corner” = dans le coin en haut à gauche.'}
  ],
  movement:[
    {id:'m1',type:'choice',prompt:'The tray is outside the unit now. Which instruction moves it inside?',options:['The tray is inside Cabinet A.','Slide the tray out of Cabinet A.','Slide the tray into Cabinet A.'],answer:2,hint:'Choose the expression for movement from outside to inside.',explain:'Use “into” for movement to the inside of a place.'},
    {id:'m2',type:'order',prompt:'Put the placement instruction in order.',words:['Place','the tray','under','the shelf.'],answer:'Place the tray under the shelf.',hint:'Start with the action verb, then name the part and destination.',explain:'“Place” gives the action. “Under the shelf” gives the destination.'},
    {id:'m3',type:'fill',prompt:'Complete with two words. To remove the tray, slide it ___ Cabinet A.',answer:['out of'],hint:'This is the opposite of “into” here.',explain:'“Out of” expresses movement from inside to outside.'},
    {id:'m4',type:'order',prompt:'Ask your colleague politely to move the handle to the right.',words:['Could you','move','the handle','to the right,','please?'],answer:'Could you move the handle to the right, please?',hint:'Begin with “Could you” and follow it with the base verb.',explain:'Use “Could you + move” for a polite request.'},
    {id:'m5',type:'choice',prompt:'Your colleague is about to move the worktop. Ask them to leave it in place for now.',options:['Don’t move the worktop yet.','Don’t moving the worktop yet.','Take the worktop off for now.'],answer:0,hint:'Start with “Don’t”, then add the base verb.',explain:'“Don’t move the worktop yet” asks your colleague to leave it where it is for now.'},
    {id:'m6',type:'choice',prompt:'The box is on the floor. Move it to the top surface: “Lift the box ___ the worktop.”',options:['onto','into','out of'],answer:0,hint:'Movement towards a surface.',explain:'“Onto” = movement to a surface. Afterwards, the box is “on” the worktop.'},
    {id:'m7',type:'choice',prompt:'The box is on the worktop. Remove it: “Take the box ___ the worktop.”',options:['out','off','down'],answer:1,hint:'The opposite of “on / onto”.',explain:'“Take it off the worktop” = remove it from the surface.'},
    {id:'m8',type:'choice',prompt:'The container is upside down. Which instruction corrects it?',options:['Lay it on its side.','Turn it upside down.','Turn it the right way up.'],answer:2,hint:'You want the arrow to point up again.',explain:'“Turn it the right way up” = remettez-le dans le bon sens.'},
    {id:'m9',type:'order',prompt:'Ask your colleague to rotate the container.',words:['Could you','rotate','the container','90 degrees','clockwise?'],answer:'Could you rotate the container 90 degrees clockwise?',hint:'Could you + verb + part + amount + direction.',explain:'Amount first (90 degrees), then the direction (clockwise).'},
    {id:'m10',type:'choice',prompt:'Raise or rise? “Could you ___ the shelf by 10 mm?”',options:['rise','raise','arise'],answer:1,hint:'You move the shelf: the verb needs an object.',explain:'“Raise” takes an object: raise the shelf. “Rise” has no object: the sun rises.'},
    {id:'m11',type:'choice',prompt:'“Anticlockwise” is British English. In American English, say…',options:['counterclockwise','backclockwise','unclockwise'],answer:0,hint:'“Counter” = against.',explain:'UK anticlockwise = US counterclockwise.'},
    {id:'m12',type:'fill',prompt:'One word. The oven and the coffee maker are in the wrong places. Exchange them: “___ the oven and the coffee maker.”',answer:['swap','switch'],hint:'Starts with “sw…”.',explain:'“Swap” = intervertir (US also: “switch”).'}
  ],
  adjust:[
    {id:'a1',type:'choice',prompt:'Compare the draft with the target. How should the shelf move?',options:['Slide it to the left.','Raise it a little.','Lower it a little.'],answer:1,hint:'Look at how close the shelf is to the tray in the current draft.',explain:'The shelf is lower in the draft, so it needs to move up.'},
    {id:'a2',type:'choice',prompt:'Which request matches the change to the divider?',options:['Could you move the divider to the right?','Could you lower the divider a little?','Could you shift the divider slightly to the left?'],answer:2,hint:'Compare the divider’s horizontal position in the two drawings.',explain:'The divider is too far right in the draft. Shift it a little to the left.'},
    {id:'a3',type:'choice',prompt:'How should you move the handle?',options:['Move it closer to the right edge of the door.','Move it closer to the centre of the door.','Move it below the door.'],answer:0,hint:'Look at the distance from the handle to the right edge of the door.',explain:'The target puts the handle closer to the door’s right edge.'},
    {id:'a4',type:'fill',prompt:'Complete with “by” or “to”. Move the handle ___ the right edge. The blank gives a destination.',answer:['to'],hint:'Use the word for where the handle should end up.',explain:'“To” names a destination. “By” can introduce the amount of change.'},
    {id:'a5',type:'fill',prompt:'Complete with “by” or “to”. Raise the shelf ___ 5 mm. The blank introduces the amount of change.',answer:['by'],hint:'You are giving the difference between the old and new positions.',explain:'“By 5 mm” tells your colleague how much to raise it.'},
    {id:'a6',type:'choice',prompt:'The two front faces are in the same plane. They are…',options:['level.','flush.','clear.'],answer:1,hint:'“Affleurant” in French.',explain:'“Flush” = in the same plane. “Level” = horizontal.'},
    {id:'a7',type:'fill',prompt:'One word. The tray can’t slide out: there isn’t ___ clearance.',answer:['enough'],hint:'Enough + noun.',explain:'“There isn’t enough clearance” = il n’y a pas assez de jeu.'}
  ],
  listening:[
    {id:'l1',type:'choice',prompt:'Which part should stay where it is?',options:['The divider.','The worktop.','The handle.'],answer:1,hint:'Listen for “Please leave…”',explain:'The colleague asks Laura to leave the worktop where it is.'},
    {id:'l2',type:'choice',prompt:'Which way should the divider move?',options:['Slightly to the left.','Slightly to the right.','Down a little.'],answer:0,hint:'Listen to the request that starts “Could you shift…”.',explain:'The colleague asks Laura to shift the divider slightly to the left.'},
    {id:'l3',type:'choice',prompt:'What should you check once the shelf has been raised?',options:['That the worktop is level.','That both cabinets are the same height.','That the tray still slides out easily.'],answer:2,hint:'Listen again to the final sentence.',explain:'The final request is to check that the tray still slides out easily.'},
    {id:'l4',type:'choice',prompt:'Where should the handle go?',options:['Closer to the centre of the door.','Closer to the right edge of the door.','Under the door.'],answer:1,hint:'Listen for “closer to…”.',explain:'Move the handle closer to the right edge of the door.'},
    {id:'l5',type:'choice',prompt:'Which change happens before the tray check?',options:['The shelf is raised.','The worktop is removed.','The divider is lowered.'],answer:0,hint:'Listen for “Once…”.',explain:'“Once the shelf has been raised, could you check…?”'}
  ]
};

const MODELS = {
  technical:[
    ['A2+','Let’s look at the front view. Cabinet B is next to Cabinet A. The divider goes between them. The tray goes under the shelf. Could you move the shelf up, the divider to the left and the handle to the right, please? Then let’s check that the tray slides out.'],
    ['B1','In the finished unit, Cabinet B sits to the right of Cabinet A. The divider sits between the two cabinets, and the tray goes directly under the shelf. In the draft, the shelf is too low, so could you raise it a little? Could you also shift the divider slightly to the left and move the handle closer to the right edge of the door? Then we can check the clearance above the tray.'],
    ['B1+','Let’s compare the front views. The target shows Cabinet B next to Cabinet A, with a divider between them and the tray directly underneath the shelf. In the draft, the shelf sits too close to the tray. Could you raise it to the position shown in the target? The divider needs to shift slightly left, and the handle should sit closer to the door’s right edge. Once the layout has been updated, let’s verify the clearance and check that the tray can slide out freely.']
  ],
  email:[
    ['A2+','Subject: Galley cabinet drawing\n\nHi Alex,\n\nCould you raise the shelf, move the divider to the left and move the handle to the right, please? The worktop can stay where it is. Please let me know when the updated drawing is ready.\n\nThanks,\nLaura'],
    ['B1','Subject: Three changes to the galley cabinet layout\n\nHi Alex,\n\nThanks for reviewing the cabinet drawing. Could you raise the shelf a little, shift the divider slightly to the left and move the handle closer to the right edge of the door? Please leave the worktop where it is and check that the tray still slides out easily.\n\nCould you confirm when the revised drawing is ready?\n\nBest regards,\nLaura'],
    ['B1+','Subject: Galley cabinet layout revision · shelf, divider and handle\n\nHi Alex,\n\nFollowing our review of the front view, could you bring the draft into line with the target layout? Please raise the shelf, shift the divider slightly left and reposition the handle closer to the door’s right edge. The worktop can stay in its current position. Once the shelf has been moved, could you verify the clearance above the tray and confirm that it can still slide out freely?\n\nPlease let me know when the revised drawing is available.\n\nMany thanks,\nLaura']
  ]
};

/* ---------------------------------------------------------------
   2. DATA · VOCABULARY  [term, French, definition, example, icon]
   --------------------------------------------------------------- */
const VOCAB = {
  'Galley modules':[
    ['galley','office de bord (cuisine de l’avion)','The area of an aircraft where meals and drinks are prepared.','The galley is at the aft end of the cabin.','🍽'],
    ['monument','monument (élément fixe : office, toilettes…)','A large fixed unit in the cabin, such as a galley or a lavatory.','The galley monument is against the bulkhead.','🏛'],
    ['compartment','compartiment','One of the spaces in a unit.','The oven is in the top-left compartment.','▦'],
    ['bay','logement / emplacement','An open space designed for one item, such as a trolley.','Slide the trolley into the bottom-left bay.','⬚'],
    ['oven','four','Heats meals during the flight.','Install the oven above the drawer unit.','♨'],
    ['coffee maker / beverage maker','cafetière / machine à boissons','Makes hot drinks.','The coffee maker is to the right of the oven.','☕'],
    ['standard container','conteneur standard','A storage box. It often has a “this way up” arrow.','Make sure the container is the right way up.','📦'],
    ['drawer unit','bloc tiroirs','A module with drawers that slide out.','Put the drawer unit directly above the trolley.','🗄'],
    ['trolley (UK) / cart (US)','chariot','A unit on wheels used to serve passengers.','Slide the trolley into the bay.','🛒'],
    ['waste bin (UK) / trash can (US)','poubelle','A container for rubbish (US: trash).','Put the waste bin next to the trolley.','🗑'],
    ['row / column','rangée / colonne','A horizontal / vertical line of compartments.','In the top row, the oven is on the left.','▤']
  ],
  'Cabin parts':[
    ['galley cabinet','meuble d’office de bord','A storage unit in an aircraft’s galley.','Cabinet B is to the right of Cabinet A.','🗃'],
    ['worktop / countertop','plan de travail','The flat working surface above the cabinets. “Worktop” is common in UK English and “countertop” in US English.','The worktop runs across the top of both cabinets.','▭'],
    ['shelf','tablette / étagère','A flat surface that supports items inside a cabinet.','The shelf is above the tray.','▬'],
    ['tray','bac / plateau','A shallow container.','Slide the tray into Cabinet A.','⊔'],
    ['divider','séparateur / cloison de séparation','A part that separates two spaces.','The divider is between the cabinets.','┃'],
    ['door / handle','porte / poignée','The panel that closes a cabinet, and the part you hold to open it.','The handle is near the right edge of the door.','🚪'],
    ['hinge','charnière','The part a door turns on.','The hinges are on the left-hand side of the door.','⟟'],
    ['latch','loquet / verrou','A small device that keeps a door or container closed.','Check that the latch is closed.','🔒'],
    ['base rail','traverse inférieure','A horizontal strip along the base of this cabinet design.','The base rail is at the bottom of the unit.','▁'],
    ['front edge','bord avant','The edge facing you from the front.','Check that the front edges line up.','▕']
  ],
  'Position':[
    ['under / underneath','sous / juste en dessous','Lower than and often directly beneath another part.','The tray is under the shelf.','⬇'],
    ['above / below','au-dessus de / en dessous de','Higher or lower than a reference point.','The shelf is above the tray.','⇕'],
    ['over / across','au-dessus de / d’un côté à l’autre','“Over” can mean above. “Across” indicates that something spans from side to side.','The worktop goes over both cabinets, across the top.','⇔'],
    ['on / on top of','sur / posé sur','Touching a surface or supported by the top surface.','The worktop sits on top of both cabinets.','⊤'],
    ['next to / beside','à côté de','Alongside another part.','Cabinet B is beside Cabinet A.','◫'],
    ['to the left of / to the right of','à gauche de / à droite de','On a specific side from the agreed viewpoint.','Cabinet B is to the right of Cabinet A.','⇆'],
    ['between','entre','In the space separating two things.','The divider is between Cabinet A and Cabinet B.','⫼'],
    ['inside / outside','à l’intérieur de / à l’extérieur de','Within or beyond the boundaries of something.','The shelf is inside the cabinet.','⊡'],
    ['in front of / behind','devant / derrière','Further forward or further back.','The tray sits behind the door when the door is closed.','⧉'],
    ['against / near','contre / près de','Touching a surface or close to a point.','The panel is against the wall. The handle is near the right edge.','⇥'],
    ['in the middle / in the centre','au milieu / au centre','At the central point (US: center).','The container is in the centre compartment.','⊙'],
    ['in the top-left corner','dans le coin en haut à gauche','Where the top edge and the left edge meet.','The label is in the top-left corner.','◸'],
    ['opposite','en face de','Facing something, on the other side.','The galley is opposite the entry door.','⇄']
  ],
  'Orientation':[
    ['the right way up','dans le bon sens','The top is at the top.','Turn the container the right way up.','⬆'],
    ['upside down','à l’envers (haut en bas)','The top is at the bottom.','The container is upside down — the arrow points down.','⬇'],
    ['on its side','couché sur le côté','Lying on one side, not standing up.','Lay the container on its side.','⮕'],
    ['upright / vertical','debout / vertical','Standing straight up.','Stand the panel upright.','┃'],
    ['flat / horizontal','à plat / horizontal','Lying level, parallel to the floor.','The handle on the drawer is horizontal.','━'],
    ['back to front','devant derrière','The front is at the back.','The drawer is back to front: the handle is at the back.','⇄'],
    ['face up / face down','face visible vers le haut / vers le bas','The front face points up / down.','Put the panel face down to protect the finish.','▣'],
    ['clockwise / anticlockwise (US: counterclockwise)','dans le sens / le sens inverse des aiguilles d’une montre','The direction of a rotation.','Rotate the knob clockwise to tighten it.','↻']
  ],
  'Aircraft directions':[
    ['forward / aft','vers l’avant / vers l’arrière (de l’avion)','Towards the nose / towards the tail of the aircraft.','Move the bracket 10 mm aft.','✈'],
    ['inboard / outboard','côté axe de l’avion / côté fuselage','Towards the centre line / towards the outside of the aircraft.','The cabinet is on the outboard side, against the sidewall.','↔'],
    ['LH / RH side','côté gauche / droit','Left-hand / right-hand side, seen when you face forward in the aircraft.','The galley is on the RH side of the aircraft.','⇋'],
    ['aisle','allée / couloir','The passage between the seats.','The trolley goes down the aisle.','┆'],
    ['sidewall','paroi latérale','The inside wall along the side of the cabin.','The panel is against the sidewall.','▏'],
    ['bulkhead','cloison','A wall that divides the cabin.','The galley monument is against the bulkhead.','▐'],
    ['overhead bin / stowage bin','coffre à bagages','The storage compartment above the seats.','The overhead bin is above the seats.','⌂'],
    ['floor / ceiling','plancher / plafond','The bottom / top surface of the cabin.','The monument is fixed to the floor.','⊥']
  ],
  'Movement verbs':[
    ['place / position','placer / positionner','Put a part in a particular place.','Position the divider between the cabinets.','📍'],
    ['slide into / slide out of','faire coulisser dans / hors de','Move smoothly from outside to inside or the reverse.','Slide the tray out of Cabinet A.','⇥'],
    ['raise / lower','remonter / abaisser','Move a part up or down.','Could you raise the shelf a little?','↕'],
    ['lift / pick up','soulever / prendre','Take something up with your hands.','Lift the box onto the worktop.','🖐'],
    ['put down / set down','poser','Place something on a surface.','Put the tray down on the bench.','⤓'],
    ['push / pull','pousser / tirer','Move away from you / towards you.','Pull the drawer out. Push it back in.','⇄'],
    ['insert / remove','insérer / retirer','Put into / take out of.','Insert the tray. Remove the handle.','⊕'],
    ['turn / rotate / flip','tourner / faire pivoter / retourner','Change the orientation of a part.','Rotate it 90 degrees. Flip it over.','⟳'],
    ['shift slightly','déplacer légèrement','Move something a small distance.','Shift the divider slightly to the left.','↤'],
    ['swap','intervertir','Exchange the positions of two parts.','Swap the oven and the coffee maker.','⇋'],
    ['onto / off','sur (mouvement) / hors de','Movement to a surface / away from a surface.','Lift it onto the worktop. Take it off the worktop.','⤒'],
    ['towards / away from','vers / en s’éloignant de','Move in the direction of, or increase the distance from, a reference point.','Move the handle towards the right edge.','➝'],
    ['by / to','de (écart) / jusqu’à','Use “by” before the amount of change and “to” before the destination.','Raise it by 5 millimetres. Move it to the upper mark.','📏']
  ],
  'Assembly & checks':[
    ['assemble','assembler','Put separate parts together to form a unit.','The drawing shows how the unit is assembled.','🧩'],
    ['join / attach','relier / fixer','Connect parts or fix one part to another.','Attach the handle to the right-hand door.','🔗'],
    ['fix / fasten / secure','fixer / attacher / sécuriser','Hold a part firmly in place.','Secure the container with the latch.','🔩'],
    ['tighten / loosen','serrer / desserrer','Make a screw tighter / less tight.','Tighten the screws by hand first.','🔧'],
    ['align / line up','aligner / être aligné','Bring edges or parts into the same line.','Could you check that both front edges line up?','📐'],
    ['fit together','s’ajuster / s’emboîter','Have the right sizes and shapes to go together.','Let’s check whether the two modules fit together.','⧉'],
    ['gap / clearance','écart / jeu ou espace libre','A gap is space between parts. Clearance is space available for a part to fit or move.','There should be enough clearance for the tray to slide out.','↔'],
    ['flush / level','affleurant / de niveau','Flush faces are in the same plane. A level shelf is horizontal.','Check that the front faces are flush and the shelf is level.','═']
  ],
  'Design review phrases':[
    ['Let’s look at the front view.','Regardons la vue de face.','Agree on the view before you describe left and right.','Let’s look at the front view first.','👁'],
    ['Could you move it a little?','Pourriez-vous le déplacer un peu ?','Use “Could you” to make a polite request. Add a direction.','Could you move the handle a little to the right?','🙏'],
    ['Leave it where it is.','Laissez-le là où il est.','Ask someone to keep a part in the current position.','Please leave the worktop where it is.','✋'],
    ['It’s the wrong way round.','C’est inversé.','Two parts are in each other’s place, or a part faces the wrong way.','Cabinet A and Cabinet B are the wrong way round.','⇄'],
    ['Once you’ve moved it, could you check…?','Une fois la pièce déplacée, pourriez-vous vérifier… ?','Request a check after an adjustment.','Once you’ve moved the shelf, could you check the clearance?','✔'],
    ['Could you confirm when the revised drawing is ready?','Pourriez-vous me confirmer quand le plan révisé sera prêt ?','Ask for confirmation after a drawing update.','Could you confirm when the revised drawing is ready?','✉']
  ]
};

/* ---------------------------------------------------------------
   3. GAME DATA
   --------------------------------------------------------------- */
// Game 1 · Position playground (two-cabinet unit)
const SB_ZONES = [
  {id:'top',   r:[7,7,86,11],    tag:'top',            phrase:pid => pid === 'worktop' ? 'across the top of both cabinets' : 'on top of the two cabinets'},
  {id:'Aup',   r:[12,22,34,24],  tag:'A · upper space', cab:'A', level:'up',  phrase:() => 'inside Cabinet A, in the upper space'},
  {id:'Alow',  r:[12,50,34,31],  tag:'A · lower space', cab:'A', level:'low', phrase:() => 'inside Cabinet A, in the lower space'},
  {id:'mid',   r:[46.5,20,6,61], tag:'between',         phrase:() => 'between Cabinet A and Cabinet B'},
  {id:'doorL', r:[54,30,10,40],  tag:'door · left',     phrase:() => 'on the door of Cabinet B, near its left edge'},
  {id:'doorC', r:[65.5,30,10,40],tag:'door · middle',   phrase:() => 'in the middle of the door of Cabinet B'},
  {id:'doorR', r:[77,30,11,40],  tag:'door · right',    phrase:() => 'on the door of Cabinet B, near its right edge'},
  {id:'outL',  r:[0,25,9,55],    tag:'left',            phrase:() => 'outside the unit, to the left of Cabinet A'},
  {id:'outR',  r:[91,25,9,55],   tag:'right',           phrase:() => 'outside the unit, to the right of Cabinet B'},
  {id:'below', r:[10,90,80,10],  tag:'under the unit',  phrase:() => 'under the unit, below the base rail'}
];
const SB_PIECES = {
  worktop:{name:'worktop', size:[86,10.5], rots:[0]},
  divider:{name:'divider', size:[3,62], rots:[0]},
  shelf:{name:'shelf', size:[34,7], rots:[0]},
  tray:{name:'tray', size:[26,12], rots:[0,180], rest:true},
  handle:{name:'handle', size:[2.6,18], rots:[0,90]},
  box:{name:'container', size:[10,16.5], rots:[0,90,180,270], rest:true}
};
const CONTAINER_SVG = '<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="10" y="8" width="80" height="84" rx="5" fill="#d7e8e1" stroke="#2f6a6a" stroke-width="4"/><rect x="36" y="14" width="28" height="7" rx="3" fill="#2f6a6a"/><path d="M50 28 L70 52 H58 V78 H42 V52 H30Z" fill="#c58b4d"/></svg>';

const SB_CHALLENGES = [
  {id:'c1', text:'Assemble the finished unit. Copy the drawing at the top of this section: worktop, divider, shelf, tray and handle.', say:'Assemble the finished unit. Put the worktop across the top of both cabinets, the divider between the cabinets, the shelf in the upper space of Cabinet A, the tray under the shelf, and the handle on the door, near its right edge.', hint:'Five parts. The tray goes in the lower space, the right way up. The handle is vertical.',
    check:L => L('worktop').zone==='top' && L('divider').zone==='mid' && L('shelf').zone==='Aup' && L('tray').zone==='Alow' && L('tray').rot===0 && L('handle').zone==='doorR' && L('handle').rot===0},
  {id:'c2', text:'Put the tray above the shelf, inside Cabinet A.', say:'Put the tray above the shelf, inside Cabinet A.', hint:'The tray goes in the upper space and the shelf in the lower space.',
    check:L => L('tray').zone==='Aup' && L('shelf').zone==='Alow'},
  {id:'c3', text:'Now the tray is upside down, under the shelf.', say:'Now the tray is upside down, under the shelf.', hint:'Select the tray and press “Turn upside down”.',
    check:L => L('tray').zone==='Alow' && L('tray').rot===180 && L('shelf').zone==='Aup'},
  {id:'c4', text:'Move the handle near the left edge of the door.', say:'Move the handle near the left edge of the door.', hint:'The left edge of Cabinet B’s door is next to the divider.',
    check:L => L('handle').zone==='doorL'},
  {id:'c5', text:'Make the handle horizontal and put it in the middle of the door.', say:'Make the handle horizontal and put it in the middle of the door.', hint:'Select the handle and press “Turn” to make it horizontal.',
    check:L => L('handle').zone==='doorC' && L('handle').rot===90},
  {id:'c6', text:'Put the container outside the unit, to the right of Cabinet B. Lay it on its side.', say:'Put the container outside the unit, to the right of Cabinet B. Lay it on its side.', hint:'Rotate the container 90 degrees: on its side.',
    check:L => L('box').zone==='outR' && [90,270].includes(L('box').rot)},
  {id:'c7', text:'Put the container under the unit, the right way up.', say:'Put the container under the unit, the right way up.', hint:'The arrow should point up.',
    check:L => L('box').zone==='below' && L('box').rot===0},
  {id:'c8', text:'Put the container inside Cabinet A, in the upper space, the right way up. The shelf goes directly under it.', say:'Put the container inside Cabinet A, in the upper space, the right way up. The shelf goes directly under it.', hint:'If a space is full, drop the new part there: the two parts swap places.',
    check:L => L('box').zone==='Aup' && L('box').rot===0 && L('shelf').zone==='Alow'},
  {id:'c9', text:'Take the divider out and put it to the left of the unit. Then put the container upside down between the two cabinets.', say:'Take the divider out and put it to the left of the unit. Then put the container upside down between the two cabinets.', hint:'Divider → left of Cabinet A. Container → between the cabinets, arrow pointing down.',
    check:L => L('divider').zone==='outL' && L('box').zone==='mid' && L('box').rot===180},
  {id:'c10', text:'Back to the drawing! Rebuild the finished unit, and put the container back in the parts tray.', say:'Back to the drawing! Rebuild the finished unit, and leave the container in the parts tray.', hint:'Worktop on top, divider between, shelf in the upper space, tray under it, handle near the right edge of the door. Container: back to the tray.',
    check:L => SB_CHALLENGES[0].check(L) && !L('box').zone}
];

// Game 4 · Galley builder
const GALLEY_PIECES = {
  oven:{name:'oven'}, coffee:{name:'coffee maker'}, box:{name:'container'},
  cabA:{name:'Cabinet A', proper:true}, cabB:{name:'Cabinet B', proper:true},
  drawer:{name:'drawer unit'}, trolley:{name:'trolley'}, bin:{name:'waste bin'}
};
Object.values(GALLEY_PIECES).forEach(p => p.rots = [0,90,180,270]);
const CELLS = {
  c00:'the top-left compartment', c01:'the top compartment in the centre', c02:'the top-right compartment',
  c10:'the middle-left compartment', c11:'the centre compartment', c12:'the middle-right compartment',
  c20:'the bottom-left bay', c21:'the bottom bay in the centre', c22:'the bottom-right bay'
};
const CELL_TAGS = {c00:'top-left',c01:'top centre',c02:'top-right',c10:'middle-left',c11:'centre',c12:'middle-right',c20:'bottom-left bay',c21:'bottom centre bay',c22:'bottom-right bay'};
const FRAME = '<rect x="6" y="6" width="88" height="88" rx="7" fill="#eef4f3" stroke="#3d6670" stroke-width="3"/>';
const MOD_SVG = {
  oven: FRAME+'<circle cx="20" cy="17" r="4.5" fill="#3d6670"/><circle cx="33" cy="17" r="4.5" fill="#3d6670"/><rect x="52" y="13" width="30" height="7" rx="3" fill="#c58b4d"/><rect x="15" y="28" width="70" height="46" rx="5" fill="#2f4f57"/><rect x="21" y="34" width="58" height="34" rx="3" fill="#f0a35e" opacity=".6"/><rect x="26" y="80" width="48" height="6" rx="3" fill="#9fb3b6"/>',
  coffee: FRAME+'<rect x="16" y="13" width="68" height="15" rx="4" fill="#3d6670"/><rect x="42" y="28" width="16" height="8" fill="#9fb3b6"/><path d="M33 42h34l-4 38H37z" fill="#7a4f2c"/><path d="M67 50q13 5 0 20" stroke="#3d6670" fill="none" stroke-width="4"/><rect x="14" y="83" width="72" height="5" rx="2" fill="#9fb3b6"/>',
  box: '<rect x="10" y="8" width="80" height="84" rx="5" fill="#d7e8e1" stroke="#2f6a6a" stroke-width="4"/><rect x="36" y="14" width="28" height="7" rx="3" fill="#2f6a6a"/><path d="M50 28 L70 52 H58 V76 H42 V52 H30Z" fill="#c58b4d"/><text x="50" y="88" font-size="8" text-anchor="middle" fill="#2f6a6a" font-weight="700" font-family="Arial">THIS WAY UP</text>',
  cabA: FRAME+'<rect x="14" y="14" width="72" height="72" fill="#fbfdf9" stroke="#9fb3b6"/><rect x="18" y="38" width="64" height="6" fill="#b8d7ce" stroke="#416b6c"/><path d="M24 58h52l-4 18H28z" fill="#d5e7df" stroke="#517e78" stroke-width="2"/><path d="M24 58h52" stroke="#517e78" stroke-width="4"/><text x="50" y="30" font-size="13" text-anchor="middle" fill="#3d6670" font-weight="800" font-family="Arial">A</text>',
  cabB: FRAME+'<rect x="14" y="14" width="72" height="72" fill="#fffaf2" stroke="#557e83" stroke-width="2"/><rect x="17" y="22" width="4" height="12" fill="#9fb3b6"/><rect x="17" y="66" width="4" height="12" fill="#9fb3b6"/><rect x="72" y="22" width="6" height="26" rx="3" fill="#b9824e"/><text x="48" y="58" font-size="13" text-anchor="middle" fill="#3d6670" font-weight="800" font-family="Arial">B</text>',
  drawer: FRAME+'<rect x="13" y="13" width="74" height="34" rx="3" fill="#f8f1e1" stroke="#557e83" stroke-width="2"/><rect x="13" y="53" width="74" height="34" rx="3" fill="#f8f1e1" stroke="#557e83" stroke-width="2"/><rect x="38" y="19" width="24" height="6" rx="3" fill="#b9824e"/><rect x="38" y="59" width="24" height="6" rx="3" fill="#b9824e"/>',
  trolley: '<rect x="14" y="8" width="72" height="8" rx="4" fill="#3d6670"/><rect x="18" y="14" width="64" height="66" rx="4" fill="#dfe8ea" stroke="#3d6670" stroke-width="3"/><path d="M26 30h48M26 46h48M26 62h48" stroke="#9fb3b6" stroke-width="3"/><rect x="62" y="22" width="12" height="6" rx="2" fill="#c58b4d"/><circle cx="28" cy="88" r="7" fill="#2f4f57"/><circle cx="72" cy="88" r="7" fill="#2f4f57"/>',
  bin: FRAME+'<path d="M22 18h56l-4 8H26z" fill="#3d6670"/><rect x="30" y="30" width="40" height="10" rx="3" fill="#2f4f57"/><rect x="24" y="44" width="52" height="40" rx="4" fill="#dce9e5" stroke="#557e83" stroke-width="2"/><text x="50" y="69" font-size="10" text-anchor="middle" fill="#3d6670" font-weight="800" font-family="Arial">WASTE</text>'
};
const GALLEY_SCENARIOS = [
  {id:'s1', title:'Breakfast galley · short-haul aircraft', brief:'A short-haul airline serves breakfast. They need an oven, a coffee maker, a container, two cabinets, a drawer unit, a trolley and a waste bin.',
    target:{oven:'c00',coffee:'c01',box:'c02',drawer:'c10',cabA:'c12',trolley:'c20',bin:'c21',cabB:'c22'},
    steps:['Let’s start at the bottom. Slide the trolley into the bottom-left bay.',
      'Put the waste bin next to the trolley, in the bottom bay in the centre.',
      'Place Cabinet B in the bottom-right bay, to the right of the waste bin.',
      'Now the middle row. Put the drawer unit in the middle-left compartment, directly above the trolley.',
      'Leave the centre compartment empty. Put Cabinet A in the middle-right compartment, above Cabinet B.',
      'Finally, the top row. Install the oven in the top-left compartment, above the drawer unit. Put the coffee maker to the right of the oven, and the container in the top-right corner. Make sure the container is the right way up.'],
    draft:{oven:'c01',coffee:'c00',box:'c02@180',drawer:'c11',cabA:'c12',trolley:'c20',bin:'c21',cabB:'c22'},
    note:'Hi Laura, I’ve checked the draft. The oven and the coffee maker are in the wrong places — could you swap them? The container is upside down, so please turn it the right way up. Also, the drawer unit should be directly above the trolley, so move it one compartment to the left. Everything else is fine. Thanks!'},
  {id:'s2', title:'Aft galley · long-haul aircraft', brief:'A long-haul aircraft needs a galley at the aft end of the cabin. The middle-right compartment stays empty for a future water heater.',
    target:{box:'c00',oven:'c01',coffee:'c02',cabA:'c10',drawer:'c11',cabB:'c20',trolley:'c21',bin:'c22'},
    steps:['This time, start with the top row. Install the oven in the top compartment in the centre.',
      'Put the container to the left of the oven, in the top-left compartment. It should be the right way up.',
      'Place the coffee maker to the right of the oven.',
      'In the middle row, put Cabinet A on the left, under the container. Put the drawer unit next to Cabinet A, in the centre compartment. Leave the middle-right compartment empty.',
      'Under the worktop, slide the trolley into the bottom bay in the centre, directly below the drawer unit.',
      'Finally, put Cabinet B in the bottom-left bay and the waste bin in the bottom-right bay.'],
    draft:{box:'c00',oven:'c01',coffee:'c02@90',cabA:'c12',drawer:'c11',cabB:'c20',trolley:'c22',bin:'c21'},
    note:'Hi Laura, a few things to change. The trolley and the waste bin need to swap places — the trolley goes in the centre bay. The coffee maker is on its side; please stand it up. And Cabinet A is on the wrong side: move it from the middle-right compartment to the middle-left compartment, under the container. Thanks.'},
  {id:'s3', title:'Compact galley · business jet', brief:'A business jet has a small galley. There is no trolley, and the container is stored on its side to save height.',
    target:{oven:'c00',coffee:'c01',drawer:'c10',cabA:'c11',cabB:'c12',bin:'c20',box:'c22@90'},
    steps:['This galley is for a business jet, so there’s no trolley.',
      'In the top row, put the oven in the top-left compartment and the coffee maker next to it, on the right. Leave the top-right compartment empty.',
      'In the middle row, place the drawer unit on the left, under the oven. Put Cabinet B on the right, and Cabinet A in the centre, between the drawer unit and Cabinet B.',
      'Under the worktop, put the waste bin in the bottom-left bay.',
      'Finally, lay the container on its side in the bottom-right bay, under Cabinet B. Leave the bottom bay in the centre empty.'],
    draft:{oven:'c00',coffee:'c01',drawer:'c10',cabA:'c12',cabB:'c11',bin:'c21',box:'c22'},
    note:'Hi Laura, nearly there. Cabinet A and Cabinet B are the wrong way round — could you swap them? The container should be on its side, not upright. And the waste bin needs to move one bay to the left, into the bottom-left corner. Thanks!'},
  {id:'s4', title:'Customer redesign · catering change', brief:'The customer has changed the catering concept. There is no waste bin in this version, and the container goes right in the middle of the galley.',
    target:{coffee:'c00',oven:'c02',box:'c11',drawer:'c12',trolley:'c20',cabA:'c21',cabB:'c22'},
    steps:['The customer wants a new layout. There’s no waste bin in this version.',
      'In the top row, put the coffee maker in the top-left compartment and the oven in the top-right compartment. Leave the space between them empty.',
      'Put the container in the centre compartment, right in the middle of the galley. Check that it’s the right way up.',
      'Place the drawer unit to the right of the container, under the oven.',
      'Under the worktop, slide the trolley into the bottom-left bay. Then put Cabinet A in the bottom bay in the centre and Cabinet B in the bottom-right bay.'],
    draft:{coffee:'c02',oven:'c00',box:'c11@180',drawer:'c10',trolley:'c20',cabA:'c21',cabB:'c22'},
    note:'Hi Laura, the coffee maker and the oven are the wrong way round: swap them, please. The container is upside down — turn it over. And the drawer unit should be on the right, under the oven, not on the left. Thanks.'}
];
const GB_MODES = ['copy','listen','fix'];
const SCENARIO_FR = {
  s1:'Une compagnie court-courrier sert le petit-déjeuner. Il faut un four, une cafetière, un conteneur, deux meubles, un bloc tiroirs, un chariot et une poubelle.',
  s2:'Un avion long-courrier a besoin d’un office à l’arrière de la cabine. Le compartiment du milieu à droite reste vide pour un futur chauffe-eau.',
  s3:'Un avion d’affaires a un petit office. Pas de chariot, et le conteneur est rangé couché sur le côté pour gagner de la hauteur.',
  s4:'Le client a changé son concept de restauration. Pas de poubelle dans cette version, et le conteneur va au centre de l’office.'
};
const SCENARIO_WORDS = {
  s1:[['breakfast service','service du petit-déjeuner'],['short-haul','court-courrier'],['hot drinks','boissons chaudes'],['hot meals','repas chauds'],['serve passengers','servir les passagers']],
  s2:[['long-haul','long-courrier'],['aft galley','office arrière'],['at the aft end of the cabin','à l’arrière de la cabine'],['water heater','chauffe-eau'],['for future use','pour un usage futur']],
  s3:[['business jet','avion d’affaires'],['compact','compact'],['to save height','pour gagner de la hauteur'],['stored on its side','rangé couché sur le côté'],['there’s no trolley','il n’y a pas de chariot']],
  s4:[['customer','client'],['redesign','refonte / nouvelle conception'],['catering concept','concept de restauration'],['right in the middle','en plein milieu'],['in this version','dans cette version']],
  free:[['my design','ma conception'],['I chose to…','j’ai choisi de…'],['because','parce que'],['it saves space','cela fait gagner de la place'],['it’s easy to reach','c’est facile d’accès']]
};
const GALLEY_FR = {oven:'four', coffee:'cafetière', box:'conteneur', cabA:'meuble A', cabB:'meuble B', drawer:'bloc tiroirs', trolley:'chariot', bin:'poubelle'};
const POSITION_BANK = [['in the top row','dans la rangée du haut'],['in the middle row','dans la rangée du milieu'],['under the worktop','sous le plan de travail'],['on the left / on the right','à gauche / à droite'],['in the centre','au centre'],['directly above','juste au-dessus de'],['next to','à côté de'],['between … and …','entre … et …'],['is empty','est vide'],['the right way up','dans le bon sens'],['on its side','couché sur le côté'],['upside down','à l’envers']];

// Game 2 · Action simulator
const SIM_START = {door:'closed', drawer:'in', shelf:'high', tray:'in', box:'floor', rot:0, handle:'on'};
const ACTIONS = [
  {id:'openDoor', fam:'Open & close', label:'Open the door', say:'Open the door.', can:s => s.door==='closed', apply:s => s.door='open'},
  {id:'closeDoor', fam:'Open & close', label:'Close the door', say:'Close the door.', can:s => s.door==='open', apply:s => s.door='closed'},
  {id:'pullDrawer', fam:'In & out', label:'Pull the drawer out', say:'Pull the drawer out.', can:s => s.drawer==='in', apply:s => s.drawer='out'},
  {id:'pushDrawer', fam:'In & out', label:'Push the drawer in', say:'Push the drawer back in.', can:s => s.drawer==='out', apply:s => s.drawer='in'},
  {id:'trayOut', fam:'In & out', label:'Slide the tray out of the cabinet', say:'Slide the tray out of the cabinet and put it on the bench.', can:s => s.tray==='in', apply:s => s.tray='out'},
  {id:'trayIn', fam:'In & out', label:'Slide the tray into the cabinet', say:'Slide the tray into the cabinet, under the shelf.', can:s => s.tray==='out', apply:s => s.tray='in'},
  {id:'raiseShelf', fam:'Up & down', label:'Raise the shelf', say:'Raise the shelf.', can:s => s.shelf==='low', apply:s => s.shelf='high'},
  {id:'lowerShelf', fam:'Up & down', label:'Lower the shelf', say:'Lower the shelf.', can:s => s.shelf==='high', apply:s => s.shelf='low'},
  {id:'boxUp', fam:'Up & down', label:'Lift the box onto the worktop', say:'Lift the box onto the worktop.', can:s => s.box==='floor', apply:s => s.box='worktop'},
  {id:'boxDown', fam:'Up & down', label:'Take the box off the worktop', say:'Take the box off the worktop and put it down on the floor.', can:s => s.box==='worktop', apply:s => s.box='floor'},
  {id:'boxFlip', fam:'Turn it', label:'Turn the box upside down', say:'Turn the box upside down.', can:s => s.rot!==180, apply:s => s.rot=180},
  {id:'boxUpright', fam:'Turn it', label:'Turn the box the right way up', say:'Turn the box the right way up.', can:s => s.rot!==0, apply:s => s.rot=0},
  {id:'boxSide', fam:'Turn it', label:'Lay the box on its side', say:'Lay the box on its side.', can:s => s.rot!==90, apply:s => s.rot=90},
  {id:'handleOff', fam:'Connect & disconnect', label:'Remove the handle', say:'Remove the handle from the door.', can:s => s.handle==='on', apply:s => s.handle='off'},
  {id:'handleOn', fam:'Connect & disconnect', label:'Attach the handle', say:'Attach the handle to the door.', can:s => s.handle==='off', apply:s => s.handle='on'}
];

// Game 3 · Memory
const OPPOSITES = [
  ['raise','remonter','lower','abaisser'],['into','dans (mouvement)','out of','hors de'],['onto','sur (mouvement)','off','hors de (surface)'],
  ['open','ouvrir','close','fermer'],['push in','rentrer (en poussant)','pull out','sortir (en tirant)'],['attach','fixer','remove','retirer'],
  ['tighten','serrer','loosen','desserrer'],['upside down','à l’envers','the right way up','dans le bon sens'],['above','au-dessus de','below','en dessous de'],
  ['in front of','devant','behind','derrière'],['clockwise','sens horaire','anticlockwise','sens antihoraire'],['forward','vers l’avant','aft','vers l’arrière'],
  ['inboard','côté axe','outboard','côté fuselage'],['towards','vers','away from','en s’éloignant de'],['inside','à l’intérieur','outside','à l’extérieur'],
  ['lift','soulever','put down','poser'],['vertical','vertical','horizontal','horizontal'],['top','haut','bottom','bas']
];

// Game 5 · Operator (offsets in mm from the target position)
const OP_DRAFT = {shelf:25, divider:15, handle:-20};
const OP_PARTS = {
  shelf:{name:'shelf', range:[-20,35], moves:[['up','▲ Raise',-5,'raised'],['down','▼ Lower',5,'lowered']]},
  divider:{name:'divider', range:[-25,25], moves:[['left','◀ Shift left',-5,'shifted … to the left'],['right','▶ Shift right',5,'shifted … to the right']]},
  handle:{name:'handle', range:[-40,5], moves:[['left','◀ Move towards the centre',-5,'moved … towards the centre of the door'],['right','▶ Move towards the right edge',5,'moved … towards the right edge']]}
};

/* ---------------------------------------------------------------
   4. STATE · PROGRESS
   --------------------------------------------------------------- */
const STORAGE_KEY = 'laura-aviation-lesson-02-v2';
const SKILLS = [
  'Describe part positions and orientation', 'Give placement and movement instructions', 'Follow spoken assembly instructions',
  'Explain a layout to a colleague', 'Request adjustments in millimetres', 'Understand a design update', 'Write a technical follow-up'
];
const GAME_ITEMS = [
  ...SB_CHALLENGES.map(c => ({id:'sb-' + c.id, label:'Playground ' + c.id})),
  ...GALLEY_SCENARIOS.flatMap(s => GB_MODES.map(m => ({id:`gb-${m}-${s.id}`, label:`Galley ${m} ${s.id}`}))),
  {id:'act-game', label:'Listen & act'}, {id:'memory', label:'Opposites match'},
  {id:'op-fix', label:'Fix the draft'}, {id:'op-req', label:'Colleague requests'}
];
const ITEMS = [...Object.values(QUESTIONS).flat(), ...GAME_ITEMS];
const $ = id => document.getElementById(id);
const trackedFields = 'textarea:not(#reportText), #sessionDate, #lessonUrl, #french, #guided, #accent, #speed, .skillstatus select, .survey select';
let state = {answers:{}, results:{}, fields:{}};
let toastTimer;

function escapeHtml(value) {
  const chars = {'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'};
  return String(value).replace(/[&<>"']/g, char => chars[char]);
}
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const shuffle = list => {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
};
const joinAnd = list => list.length <= 1 ? (list[0] || '') : list.slice(0, -1).join(', ') + ' and ' + list[list.length - 1];

function toast(message) {
  const box = $('toast');
  box.textContent = message;
  box.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => box.classList.remove('visible'), 3200);
}

function score() {
  return {
    attempted: ITEMS.filter(item => item.id in state.results).length,
    correct: ITEMS.filter(item => state.results[item.id] === true).length,
    total: ITEMS.length,
    games: GAME_ITEMS.filter(item => state.results[item.id] === true).length
  };
}

function setResult(id, value) {
  // Once a game item has been completed, keep the success.
  if (state.results[id] === true && id.match(/^(sb|gb|act|memory|op)-?/)) return;
  state.results[id] = value;
  save();
}

function reportData() {
  const {attempted, correct, total, games} = score();
  const statuses = SKILLS.map((skill, index) => skill + ': ' + $('skill-' + index).value).join(' | ');
  const survey = ['sv-useful','sv-games','sv-level'].map(id => $(id).value || '—');
  return [
    $('sessionDate').value || 'Date to complete', 'Laura Schmitt',
    'Lesson 02 — Two cabinets. One assembly.',
    'Describe part positions and orientation; give movement instructions; follow spoken assembly instructions; request adjustments and checks',
    'Galley cabinet and galley module vocabulary; position, orientation and aircraft directions; movement verbs; static vs movement prepositions; imperatives; polite requests; assembly sequence; alignment and clearance; by/to + millimetres',
    'Multiple choice; gap fill; sentence tiles; drag-and-drop position playground; action simulator; listen & act; opposites memory; galley builder (copy, listen & build, fix, free design); CAD adjustment game; flashcards; listening; speaking + recording; email',
    `${correct}/${attempted} checked (${total} available)`,
    `${games}/${GAME_ITEMS.length} game items completed`,
    'Explain a galley layout and request three layout changes',
    'Write and confirm a drawing update', 'Understand a colleague’s spoken assembly instructions and design update',
    'Read a front view; describe a cabinet and galley assembly; specify adjustments',
    statuses, 'Useful: ' + survey[0] + ' | Games: ' + survey[1] + ' | Level: ' + survey[2],
    $('strengths').value || 'To complete', $('difficulties').value || 'To complete',
    $('nextSteps').value, $('lessonUrl').value || 'To add'
  ];
}

function updateProgress() {
  const {attempted, correct, total} = score();
  $('answeredMetric').textContent = attempted + ' / ' + total;
  $('correctMetric').textContent = correct;
  $('percentMetric').textContent = attempted ? Math.round(correct / attempted * 100) + '%' : '0%';
  $('progressBar').style.width = (attempted / total * 100) + '%';
  $('reportText').value = reportData().map(text => String(text).replace(/\t/g,' ').replace(/[\r\n]+/g,' / ')).join('\t');
  updateGameScores();
}

function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* storage unavailable */ }
  updateProgress();
}

function restore() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved?.answers && saved.results && saved.fields) state = saved;
  } catch { /* default state */ }
  document.querySelectorAll(trackedFields).forEach(field => {
    if (!(field.id in state.fields)) return;
    if (field.type === 'checkbox') field.checked = state.fields[field.id];
    else field.value = state.fields[field.id];
  });
}

const guided = () => $('guided').checked;

/* ---------------------------------------------------------------
   5. AUDIO · speech synthesis + recorder
   --------------------------------------------------------------- */
function spokenText(text) {
  return text.replace(/(\d+)\s?mm\b/g, '$1 millimetres').replace(/\bLH\b/g, 'L H').replace(/\bRH\b/g, 'R H');
}
function speak(text, onEnd) {
  if (!text || !text.trim()) { toast('Add some text first.'); return; }
  if (!('speechSynthesis' in window)) { toast('Speech is unavailable in this browser.'); return; }
  const speech = window.speechSynthesis;
  speech.cancel();
  const utterance = new SpeechSynthesisUtterance(spokenText(text));
  const accent = $('accent').value;
  utterance.lang = accent;
  utterance.rate = Number($('speed').value);
  const voices = speech.getVoices().filter(voice => voice.lang.toLowerCase().replace('_','-').startsWith('en'));
  const voice = voices.find(v => v.lang.replace('_','-').toLowerCase() === accent.toLowerCase()) || voices[0];
  if (voice) utterance.voice = voice;
  utterance.onerror = event => {
    if (!['canceled', 'interrupted'].includes(event.error)) toast('Audio could not play. Check your browser’s English speech voices.');
  };
  if (onEnd) utterance.onend = onEnd;
  speech.speak(utterance);
}

function setupRecorders() {
  document.querySelectorAll('.recorder').forEach(box => {
    const name = box.dataset.recorder;
    box.innerHTML = `<b class="micro">🎙 RECORD YOURSELF</b>
      <button type="button" class="small rec-start">● Record</button>
      <button type="button" class="small rec-stop" disabled>■ Stop</button>
      <audio controls hidden></audio>
      <a class="small rec-dl" hidden download="Laura_Lesson02_${name}.webm">↓ Download</a>
      <span class="micro rec-status"></span>`;
    const start = box.querySelector('.rec-start'), stop = box.querySelector('.rec-stop');
    const audio = box.querySelector('audio'), dl = box.querySelector('.rec-dl'), status = box.querySelector('.rec-status');
    let recorder, chunks = [], stream;
    start.addEventListener('click', async () => {
      if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) { status.textContent = 'Recording is not available in this browser.'; return; }
      try {
        stream = await navigator.mediaDevices.getUserMedia({audio:true});
        chunks = [];
        recorder = new MediaRecorder(stream);
        recorder.ondataavailable = e => e.data.size && chunks.push(e.data);
        recorder.onstop = () => {
          const blob = new Blob(chunks, {type: recorder.mimeType || 'audio/webm'});
          const url = URL.createObjectURL(blob);
          audio.src = url; audio.hidden = false;
          const ext = (recorder.mimeType || '').includes('mp4') ? 'm4a' : 'webm';
          dl.href = url; dl.download = `Laura_Lesson02_${name}.${ext}`; dl.hidden = false;
          status.textContent = 'Listen to yourself, then try again with keywords only.';
          stream.getTracks().forEach(t => t.stop());
        };
        recorder.start();
        start.classList.add('recording'); start.disabled = true; stop.disabled = false;
        status.textContent = 'Recording… speak now.';
      } catch { status.textContent = 'Microphone access was refused.'; }
    });
    stop.addEventListener('click', () => {
      if (recorder?.state === 'recording') recorder.stop();
      start.classList.remove('recording'); start.disabled = false; stop.disabled = true;
    });
  });
}

/* ---------------------------------------------------------------
   6. QUESTIONS (choice · fill · order)
   --------------------------------------------------------------- */
function normalize(value) {
  return value.toLowerCase().replace(/[’‘]/g, "'").replace(/[.,!?]/g, '').replace(/\s+/g, ' ').trim();
}
function showFeedback(card, message, kind) {
  const box = card.querySelector('.feedback');
  box.textContent = message;
  box.className = 'feedback ' + kind;
}
function showResult(item, card) {
  if (!(item.id in state.results)) { showFeedback(card, '', ''); return; }
  const correct = state.results[item.id];
  const incorrect = guided() ? 'Try again or use Hint.' : 'Try again.';
  showFeedback(card, correct ? '✓ Correct. ' + item.explain : '✕ ' + incorrect, correct ? 'good' : 'bad');
}
function helpButtons() {
  return '<button class="small hint" type="button">◈ Hint</button> <button class="small reveal" type="button">✓ Show answer</button><div class="feedback" role="status"></div>';
}
function questionMarkup(question) {
  let controls, type;
  if (question.type === 'choice') {
    type = 'Choose the best answer';
    controls = '<div class="options">' + shuffle(question.options.map((o, i) => [o, i])).map(([option, index]) =>
      `<button type="button" class="option" data-index="${index}" aria-pressed="false">${escapeHtml(option)}</button>`).join('') + '</div>';
  } else if (question.type === 'fill') {
    type = 'Fill the gap';
    controls = `<div class="answer-box"><input autocomplete="off" aria-labelledby="${question.id}-prompt" placeholder="Type your answer…"><button type="button" class="small check">Check answer</button></div>`;
  } else {
    type = 'Build the sentence';
    let order = shuffle(question.words.map((_, i) => i));
    if (order.every((v, i) => v === i)) order.push(order.shift());
    controls = '<p class="micro">Tap a tile to add it. Tap it again in your sentence to remove it.</p><div class="tiles">' +
      order.map(index => `<button type="button" class="tile" data-tile="${index}">${escapeHtml(question.words[index])}</button>`).join('') +
      '</div><div class="arranged" role="group" aria-label="Your sentence"></div>' +
      '<button type="button" class="small check">Check sentence</button> <button type="button" class="small clear">Clear tiles</button>';
  }
  return `<article class="question" id="${question.id}"><div class="tag">${type}</div><h4 id="${question.id}-prompt">${escapeHtml(question.prompt)}</h4>${controls}${helpButtons()}</article>`;
}
function renderTiles(question, card) {
  const selected = state.answers[question.id] || [];
  card.querySelector('.arranged').innerHTML = selected.map(index =>
    `<button type="button" class="arranged-tile" data-remove="${index}" aria-label="Remove ${escapeHtml(question.words[index])}">${escapeHtml(question.words[index])}</button>`).join('');
  card.querySelectorAll('.tile').forEach(tile => tile.disabled = selected.includes(Number(tile.dataset.tile)));
}
function renderChoices(question, card) {
  const chosen = state.answers[question.id];
  const correct = state.results[question.id];
  card.querySelectorAll('.option').forEach(button => {
    const selected = Number(button.dataset.index) === chosen;
    button.setAttribute('aria-pressed', selected);
    button.classList.toggle('correct', selected && correct === true);
    button.classList.toggle('incorrect', selected && correct === false);
  });
}
function recordCheck(item, card, correct) {
  state.results[item.id] = correct;
  showResult(item, card);
  save();
}
function editAnswer(item, card, value) {
  state.answers[item.id] = value;
  delete state.results[item.id];
  showResult(item, card);
  save();
}
function checkQuestion(question, card) {
  const value = question.type === 'fill' ? card.querySelector('input').value :
    (state.answers[question.id] || []).map(index => question.words[index]).join(' ');
  if (!value.trim()) { showFeedback(card, 'Add an answer first.', 'help'); return; }
  recordCheck(question, card, [].concat(question.answer).some(answer => normalize(answer) === normalize(value)));
}
function setupQuestion(question) {
  const card = $(question.id);
  const input = card.querySelector('input');
  if (input) {
    input.value = state.answers[question.id] || '';
    input.addEventListener('input', () => editAnswer(question, card, input.value));
    input.addEventListener('keydown', event => { if (event.key === 'Enter') checkQuestion(question, card); });
  }
  if (question.type === 'choice') renderChoices(question, card);
  if (question.type === 'order') renderTiles(question, card);
  showResult(question, card);
  card.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.matches('.option')) {
      const index = Number(button.dataset.index);
      state.answers[question.id] = index;
      recordCheck(question, card, index === question.answer);
      renderChoices(question, card);
    }
    if (button.matches('.check')) checkQuestion(question, card);
    if (button.matches('[data-tile], [data-remove], .clear')) {
      let selected = state.answers[question.id] || [];
      if (button.matches('[data-tile]')) selected = [...selected, Number(button.dataset.tile)];
      if (button.matches('[data-remove]')) selected = selected.filter(index => index !== Number(button.dataset.remove));
      if (button.matches('.clear')) selected = [];
      editAnswer(question, card, selected);
      renderTiles(question, card);
    }
    const answer = question.type === 'choice' ? question.options[question.answer] : [].concat(question.answer)[0];
    if (button.matches('.hint')) showFeedback(card, 'Hint · ' + question.hint, 'help');
    if (button.matches('.reveal')) showFeedback(card, 'Model answer · ' + answer + ' · ' + question.explain, 'help');
  });
}
function renderQuestions(group) {
  $(group + 'Exercises').innerHTML = QUESTIONS[group].map(questionMarkup).join('');
  QUESTIONS[group].forEach(setupQuestion);
}
function resetGroup(group) {
  QUESTIONS[group].forEach(item => { delete state.answers[item.id]; delete state.results[item.id]; });
  renderQuestions(group);
  save();
  toast('Section reset.');
}

/* ---------------------------------------------------------------
   7. STATIC CABINET DRAWINGS (finished / draft / operator)
   --------------------------------------------------------------- */
const DRAWING_PARTS = [['worktop','Worktop'],['shelf','Shelf'],['tray','Tray'],['divider','Divider'],['handle','Handle']];
function cabinetHtml(view, opts = {}) {
  let description = 'Front view. Open Cabinet A on the left, Cabinet B with a closed door on the right, and a base rail at the bottom.';
  if (view === 'target') description += ' The worktop is across both cabinets. The divider is centred between them. The tray is below the shelf inside Cabinet A. The handle is near the right edge of the door.';
  if (view === 'draft') description += ' The divider is to the right of the centre line. The shelf sits low, close to the tray. The handle is nearer the middle of the door. The worktop spans both cabinets.';
  if (view === 'op') description = 'Your working draft. ' + (opts.label || '');
  const style = opts.vars ? ` style="${opts.vars}"` : '';
  const guides = opts.guides ? '<div class="guide guide-shelf"></div><div class="guide guide-divider"></div><div class="guide guide-handle"></div>' : '';
  return `<div class="cabinet cabinet-${view}"${style} role="img" aria-label="${escapeHtml(description)}">
    <div class="cab-grid" aria-hidden="true"></div>
    <div class="cab-left">Cabinet A</div><div class="cab-right">Cabinet B</div>
    <div class="cab-seam" aria-hidden="true"></div>
    <div class="cab-base"><span>Base rail</span></div>
    ${DRAWING_PARTS.map(([id, name]) => `<div class="cab-part part-${id}${opts.active === id ? ' active' : ''}"><span>${name}</span></div>`).join('')}
    ${guides}
  </div>`;
}
function renderStaticCabinets() {
  document.querySelectorAll('[data-cabinet]').forEach(host => host.innerHTML = cabinetHtml(host.dataset.cabinet));
}

/* ---------------------------------------------------------------
   8. DRAG BOARD ENGINE (mouse · touch · pen · tap-to-place · keyboard)
   --------------------------------------------------------------- */
class DragBoard {
  constructor(options) {
    Object.assign(this, options);
    this.layout = {};
    this.available = [];
    this.selected = null;
    this.justDragged = false;
    this.bind();
  }
  load(available, layout = {}) {
    this.available = available.slice();
    this.layout = {};
    this.available.forEach(pid => {
      const p = layout[pid] || {};
      this.layout[pid] = {zone:p.zone || null, rot:p.rot || 0};
    });
    this.selected = null;
    this.render();
  }
  occupant(zone) { return this.available.find(pid => this.layout[pid].zone === zone) || null; }
  place(pid, zone) {
    const from = this.layout[pid].zone;
    let swapped = null;
    if (zone) {
      const other = this.occupant(zone);
      if (other && other !== pid) { this.layout[other].zone = from; swapped = other; }
    }
    this.layout[pid].zone = zone;
    this.selected = pid;
    this.render();
    this.onChange?.({type:'place', pid, zone, from, swapped});
  }
  turn(pid, how) {
    const rots = this.pieces[pid].rots || [0];
    if (rots.length < 2) return;
    const cur = this.layout[pid].rot;
    const next = how === 'flip' ? (rots.includes((cur + 180) % 360) ? (cur + 180) % 360 : cur)
                                : rots[(rots.indexOf(cur) + 1) % rots.length];
    this.layout[pid].rot = next;
    this.render();
    this.onChange?.({type:'turn', pid, rot:next});
  }
  render() {
    this.root.querySelectorAll('[data-zone]').forEach(zoneEl => {
      const pid = this.occupant(zoneEl.dataset.zone);
      zoneEl.classList.toggle('filled', !!pid);
      zoneEl.innerHTML = (this.zoneLabel ? this.zoneLabel(zoneEl.dataset.zone) : '') + (pid ? this.pieceButton(pid, zoneEl.dataset.zone) : '');
    });
    const bin = this.root.querySelector('[data-bin]');
    const loose = this.available.filter(pid => !this.layout[pid].zone);
    bin.innerHTML = loose.length ? loose.map(pid => this.pieceButton(pid, null)).join('')
      : `<p class="micro bin-empty">${this.emptyBinText || 'Every part is placed.'}</p>`;
    this.root.classList.toggle('has-selection', !!this.selected);
    this.renderToolbar();
  }
  pieceButton(pid, zone) {
    const {rot} = this.layout[pid];
    const sel = this.selected === pid;
    const style = zone && this.pieceStyle ? this.pieceStyle(pid, rot, zone) : '';
    const label = this.pieces[pid].name + (zone ? '' : ' (in the tray)');
    return `<button type="button" class="piece piece-${pid} ${zone ? 'on-board' : 'in-bin'}${sel ? ' selected' : ''}" data-piece="${pid}" aria-pressed="${sel}" style="${style}" aria-label="${escapeHtml(label)}">${this.renderPiece(pid, rot, zone)}</button>`;
  }
  renderToolbar() {
    const bar = this.root.querySelector('[data-toolbar]');
    if (!bar) return;
    const pid = this.selected;
    if (!pid) { bar.innerHTML = `<span class="micro">${this.toolbarHint || 'Select a part to turn it, or drag it to a new place.'}</span>`; return; }
    const rots = this.pieces[pid].rots || [0];
    const text = this.describe(pid);
    const btns = [];
    if (rots.length > 2) btns.push('<button type="button" data-act="rotate">⟳ Rotate 90°</button>');
    if (rots.includes(180)) btns.push('<button type="button" data-act="flip">⇅ Turn upside down / back</button>');
    if (rots.length === 2 && !rots.includes(180)) btns.push('<button type="button" data-act="rotate">⟲ Turn (vertical ↔ horizontal)</button>');
    if (this.layout[pid].zone) btns.push(`<button type="button" data-act="bin">↩ Back to the ${this.binName || 'tray'}</button>`);
    btns.push('<button type="button" data-act="deselect">✕</button>');
    bar.innerHTML = `<div class="tb-text"><b>${escapeHtml(cap(this.pieces[pid].name))}</b><span>${escapeHtml(text)}</span> <button type="button" class="listen" data-say="${escapeHtml(text)}">▶</button></div><div class="tb-btns">${btns.join('')}</div>`;
  }
  bind() {
    this.root.addEventListener('pointerdown', e => {
      const el = e.target.closest('[data-piece]');
      if (!el || !this.root.contains(el) || e.button > 0) return;
      const pid = el.dataset.piece;
      const start = {x:e.clientX, y:e.clientY};
      let ghost = null, offset = {x:0, y:0}, lastOver = null, lastY = start.y, scroller = null;
      const highlight = target => {
        const over = target?.closest('[data-zone], [data-bin]');
        const valid = over && this.root.contains(over) ? over : null;
        if (lastOver && lastOver !== valid) lastOver.classList.remove('over');
        if (valid) valid.classList.add('over');
        lastOver = valid;
      };
      const move = ev => {
        if (!ghost) {
          if (Math.hypot(ev.clientX - start.x, ev.clientY - start.y) < 6) return;
          const r = el.getBoundingClientRect();
          ghost = el.cloneNode(true);
          ghost.classList.add('drag-ghost');
          ghost.removeAttribute('data-piece');
          Object.assign(ghost.style, {width:r.width + 'px', height:r.height + 'px', left:r.left + 'px', top:r.top + 'px', inset:'auto', margin:0});
          offset = {x:start.x - r.left, y:start.y - r.top};
          document.body.append(ghost);
          el.classList.add('drag-source');
          this.root.classList.add('is-dragging');
          scroller = setInterval(() => {
            const edge = 90, h = window.innerHeight;
            if (lastY < edge) window.scrollBy({top:-Math.ceil((edge - lastY) / 4), behavior:'instant'});
            else if (lastY > h - edge) window.scrollBy({top:Math.ceil((lastY - (h - edge)) / 4), behavior:'instant'});
          }, 16);
        }
        lastY = ev.clientY;
        ev.preventDefault();
        ghost.style.left = ev.clientX - offset.x + 'px';
        ghost.style.top = ev.clientY - offset.y + 'px';
        highlight(document.elementFromPoint(ev.clientX, ev.clientY));
      };
      const up = ev => {
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
        window.removeEventListener('pointercancel', up);
        clearInterval(scroller);
        if (!ghost) return;
        ghost.remove();
        lastOver?.classList.remove('over');
        this.root.classList.remove('is-dragging');
        el.classList.remove('drag-source');
        this.justDragged = true;
        setTimeout(() => this.justDragged = false, 60);
        const target = ev.type === 'pointercancel' ? null : document.elementFromPoint(ev.clientX, ev.clientY);
        const zone = target?.closest('[data-zone]');
        const bin = target?.closest('[data-bin]');
        if (zone && this.root.contains(zone)) this.place(pid, zone.dataset.zone);
        else if (bin && this.root.contains(bin)) this.place(pid, null);
        else this.render();
      };
      window.addEventListener('pointermove', move, {passive:false});
      window.addEventListener('pointerup', up);
      window.addEventListener('pointercancel', up);
    });
    this.root.addEventListener('click', e => {
      if (this.justDragged) return;
      const act = e.target.closest('[data-act]');
      if (act && this.selected) {
        const a = act.dataset.act;
        if (a === 'rotate') this.turn(this.selected, 'rotate');
        if (a === 'flip') this.turn(this.selected, 'flip');
        if (a === 'bin') this.place(this.selected, null);
        if (a === 'deselect') { this.selected = null; this.render(); }
        return;
      }
      const piece = e.target.closest('[data-piece]');
      if (piece) {
        this.selected = this.selected === piece.dataset.piece ? null : piece.dataset.piece;
        this.render();
        this.onChange?.({type:'select', pid:this.selected});
        return;
      }
      const zone = e.target.closest('[data-zone]');
      if (zone && this.selected) { this.place(this.selected, zone.dataset.zone); return; }
      const bin = e.target.closest('[data-bin]');
      if (bin && this.selected && this.layout[this.selected].zone) this.place(this.selected, null);
    });
    this.root.addEventListener('keydown', e => {
      const zone = e.target.closest?.('[data-zone]');
      if (zone && e.target === zone && (e.key === 'Enter' || e.key === ' ') && this.selected) {
        e.preventDefault();
        this.place(this.selected, zone.dataset.zone);
      }
    });
  }
}

/* ---------------------------------------------------------------
   9. GAME 1 · POSITION PLAYGROUND
   --------------------------------------------------------------- */
let sbBoard, sbIndex = 0;
function sbOrientation(pid, rot) {
  if (pid === 'tray') return rot === 180 ? 'It’s upside down.' : 'It’s the right way up.';
  if (pid === 'handle') return rot === 90 ? 'It’s horizontal.' : 'It’s vertical.';
  if (pid === 'box') return rot === 0 ? 'It’s the right way up: the arrow points up.' : rot === 180 ? 'It’s upside down: the arrow points down.' : 'It’s on its side.';
  return '';
}
function sbDescribe(pid) {
  const L = sbBoard.layout, piece = SB_PIECES[pid], spot = L[pid];
  if (!spot.zone) return `The ${piece.name} is in the parts tray. ${sbOrientation(pid, spot.rot)}`.trim();
  const zone = SB_ZONES.find(z => z.id === spot.zone);
  let text = `The ${piece.name} is ${zone.phrase(pid)}.`;
  if (zone.cab === 'A') {
    const otherZone = zone.level === 'up' ? 'Alow' : 'Aup';
    const other = sbBoard.occupant(otherZone);
    if (other) text += zone.level === 'up' ? ` It’s above the ${SB_PIECES[other].name}.` : ` It’s under the ${SB_PIECES[other].name}.`;
  }
  if (zone.id === 'below') text += ' It’s at the very bottom.';
  if (zone.id === 'top' && pid !== 'worktop') text += ' It’s at the top of the unit.';
  const o = sbOrientation(pid, spot.rot);
  return o ? text + ' ' + o : text;
}
function sbPieceStyle(pid, rot, zoneId) {
  const zone = SB_ZONES.find(z => z.id === zoneId);
  let [pw, ph] = SB_PIECES[pid].size;
  if (pid === 'handle' && rot === 90) [pw, ph] = [12, 4.5];
  const [, , zw, zh] = zone.r;
  const w = Math.min(100, pw / zw * 100), h = Math.min(100, ph / zh * 100);
  const top = SB_PIECES[pid].rest ? Math.max(0, 100 - h - 6) : (100 - h) / 2;
  return `width:${w}%;height:${h}%;left:${(100 - w) / 2}%;top:${top}%`;
}
function sbRenderPiece(pid, rot, zone) {
  const name = cap(SB_PIECES[pid].name);
  if (!zone) {
    const extra = pid === 'box' ? (rot === 180 ? ' <small>upside down</small>' : rot ? ' <small>on its side</small>' : '')
      : pid === 'tray' && rot === 180 ? ' <small>upside down</small>' : pid === 'handle' && rot === 90 ? ' <small>horizontal</small>' : '';
    return `<span class="chip"><span class="chip-ico chip-${pid}"></span>${name}${extra}</span>`;
  }
  if (pid === 'tray') return `<svg viewBox="0 0 100 46" preserveAspectRatio="none" style="transform:rotate(${rot}deg)" aria-hidden="true"><path d="M3 4 H97 L88 43 H12 Z" fill="#d5e7df" stroke="#517e78" stroke-width="2"/><path d="M3 4 H97" stroke="#517e78" stroke-width="7"/></svg><span class="plabel">${name}</span>`;
  if (pid === 'box') return `<span style="display:block;width:100%;height:100%;transform:rotate(${rot}deg);transition:transform .3s">${CONTAINER_SVG}</span><span class="plabel">${name}</span>`;
  const cls = pid === 'handle' && rot === 90 ? ' horizontal' : '';
  return `<span class="sbp-${pid}${cls}" style="position:absolute;inset:0"></span><span class="plabel">${name}</span>`;
}
function setupPlayground() {
  const surface = $('sbSurface');
  surface.insertAdjacentHTML('beforeend', SB_ZONES.map(z =>
    `<div class="sb-zone" data-zone="${z.id}" tabindex="0" role="button" aria-label="${escapeHtml(z.phrase('x'))}" style="left:${z.r[0]}%;top:${z.r[1]}%;width:${z.r[2]}%;height:${z.r[3]}%"></div>`).join(''));
  sbBoard = new DragBoard({
    root:$('sbRoot'), pieces:SB_PIECES, binName:'tray', emptyBinText:'The parts tray is empty.',
    toolbarHint:'Tip · select a part to turn it upside down or rotate it.',
    zoneLabel:id => `<span class="zone-tag">${SB_ZONES.find(z => z.id === id).tag}</span>`,
    pieceStyle:sbPieceStyle, renderPiece:sbRenderPiece, describe:sbDescribe,
    onChange:() => { $('sbFeedback').textContent = ''; $('sbFeedback').className = 'feedback'; if (!$('sbAll').hidden) sbDescribeAll(); }
  });
  sbBoard.load(Object.keys(SB_PIECES));
  $('sbReset').addEventListener('click', () => { sbBoard.load(Object.keys(SB_PIECES)); $('sbAll').hidden = true; });
  $('sbZones').addEventListener('change', () => surface.classList.toggle('show-zones', $('sbZones').checked));
  $('sbDescribeAll').addEventListener('click', sbDescribeAll);
  $('sbPrev').addEventListener('click', () => sbShow(sbIndex - 1));
  $('sbNext').addEventListener('click', () => sbShow(sbIndex + 1));
  $('sbListen').addEventListener('click', () => speak(SB_CHALLENGES[sbIndex].say));
  $('sbListenMode').addEventListener('change', () => sbShow(sbIndex));
  $('sbHint').addEventListener('click', () => { $('sbFeedback').textContent = 'Hint · ' + SB_CHALLENGES[sbIndex].hint; $('sbFeedback').className = 'feedback help'; });
  $('sbCheck').addEventListener('click', () => {
    const c = SB_CHALLENGES[sbIndex];
    const ok = c.check(pid => sbBoard.layout[pid]);
    setResult('sb-' + c.id, ok);
    $('sbFeedback').className = 'feedback ' + (ok ? 'good' : 'bad');
    $('sbFeedback').textContent = ok ? '✓ Well done! Now describe the unit aloud, then press “🗣 Describe the whole unit” to compare.' : '✕ Not yet. Select each part and read the blue description. ' + (guided() ? 'Use the hint if you need it.' : '');
    sbDots();
    if (ok) toast('Challenge complete ✓');
  });
  sbShow(0);
}
function sbDescribeAll() {
  const placed = Object.keys(SB_PIECES).filter(pid => sbBoard.layout[pid].zone);
  const box = $('sbAll');
  const text = placed.length ? 'Let’s look at the front view. ' + placed.map(sbDescribe).join(' ') : 'There are no parts on the unit yet.';
  box.innerHTML = `<b>YOUR UNIT IN ENGLISH</b>${escapeHtml(text)} <button class="listen" data-say="${escapeHtml(text)}">▶ Listen</button>`;
  box.hidden = false;
}
function sbDots() {
  $('sbDots').innerHTML = SB_CHALLENGES.map((c, i) => {
    const r = state.results['sb-' + c.id];
    return `<button type="button" class="${i === sbIndex ? 'current' : ''} ${r === true ? 'done' : r === false ? 'tried' : ''}" data-sbgo="${i}" aria-label="Challenge ${i + 1}">${i + 1}</button>`;
  }).join('');
  $('sbDots').querySelectorAll('[data-sbgo]').forEach(b => b.addEventListener('click', () => sbShow(Number(b.dataset.sbgo))));
}
function sbShow(i) {
  sbIndex = (i + SB_CHALLENGES.length) % SB_CHALLENGES.length;
  const c = SB_CHALLENGES[sbIndex];
  $('sbCounter').textContent = `CHALLENGE ${sbIndex + 1} / ${SB_CHALLENGES.length}`;
  const hide = $('sbListenMode').checked;
  $('sbText').textContent = hide ? 'Press ▶ Listen and build what you hear.' : c.text;
  $('sbText').classList.toggle('hidden-text', false);
  $('sbFeedback').textContent = ''; $('sbFeedback').className = 'feedback';
  sbDots();
}

/* ---------------------------------------------------------------
   10. GAME 2 · ACTION SIMULATOR + LISTEN & ACT
   --------------------------------------------------------------- */
let sim = {...SIM_START}, simMode = 'explore', simGame = null;
function simRender() {
  const scene = $('simScene');
  Object.entries(sim).forEach(([k, v]) => scene.dataset[k] = v);
  const rot = sim.rot === 0 ? 'the right way up' : sim.rot === 180 ? 'upside down' : 'on its side';
  $('simStatus').innerHTML = `<b>Door</b> ${sim.door} · <b>Drawer</b> ${sim.drawer} · <b>Shelf</b> ${sim.shelf === 'high' ? 'in the high position' : 'in the low position'} · <b>Tray</b> ${sim.tray === 'in' ? 'in the cabinet' : 'on the bench'} · <b>Box</b> ${sim.box === 'floor' ? 'on the floor' : 'on the worktop'}, ${rot} · <b>Handle</b> ${sim.handle === 'on' ? 'attached' : 'removed'}`;
  $('simActions').querySelectorAll('[data-action]').forEach(btn => {
    const a = ACTIONS.find(x => x.id === btn.dataset.action);
    btn.disabled = simMode === 'explore' && !a.can(sim);
    btn.title = btn.disabled ? 'Not possible right now' : '';
  });
}
function simSetupButtons() {
  const fams = [...new Set(ACTIONS.map(a => a.fam))];
  $('simActions').innerHTML = fams.map(f => `<div class="action-group"><b>${f}</b><div>${ACTIONS.filter(a => a.fam === f).map(a =>
    `<button type="button" class="action-btn" data-action="${a.id}">${a.label}</button>`).join('')}</div></div>`).join('');
}
function simSay(text, kicker = 'INSTRUCTION') {
  $('simSaid').innerHTML = `<small>${kicker}</small>${escapeHtml(text)} <button class="listen" style="background:#fff" data-say="${escapeHtml(text)}">▶</button>`;
}
function simSetMode(mode) {
  simMode = mode;
  document.querySelectorAll('[data-simmode]').forEach(b => b.classList.toggle('active', b.dataset.simmode === mode));
  sim = {...SIM_START};
  if (mode === 'explore') {
    $('simHow').innerHTML = '<b>Explore:</b> press an action. The part moves, and you see — and can hear — the full instruction. Say it aloud after the voice.';
    $('simRound').hidden = true;
    simSay('Press an action to start.');
    simGame = null;
  } else {
    $('simHow').innerHTML = '<b>Listen &amp; act:</b> press <b>▶ Play the instruction</b>. Don’t read — listen! Then press the matching action. 8 rounds. The text appears only after you answer (or if you press “Show text”).';
    simGame = {round:0, score:0, tries:0, current:null, last:null};
    simNextRound();
  }
  simRender();
}
function simNextRound() {
  if (simGame.round >= 8) {
    const ok = simGame.score >= 6;
    setResult('act-game', ok);
    $('simRound').innerHTML = `<span class="round-text">🏁 Finished: ${simGame.score} / 8 correct first time.</span> ${ok ? '✓ Excellent listening!' : 'Play again to reach 6 / 8.'} <button class="small" id="simAgain">↻ Play again</button>`;
    $('simRound').hidden = false;
    $('simAgain').addEventListener('click', () => simSetMode('game'));
    simSay(ok ? 'Well done!' : 'Try again — you can do it!', 'RESULT');
    return;
  }
  const options = ACTIONS.filter(a => a.can(sim) && a.id !== simGame.last);
  simGame.current = options[Math.floor(Math.random() * options.length)];
  simGame.round++; simGame.tries = 0;
  $('simRound').hidden = false;
  $('simRound').innerHTML = `<span class="round-text">Round ${simGame.round} / 8 · Score ${simGame.score}</span>
    <button class="primary" id="simPlay">▶ Play the instruction</button>
    <button class="small" id="simShow">Show text</button>
    <span class="heard" id="simHeard"></span>`;
  $('simPlay').addEventListener('click', () => speak(simGame.current.say));
  $('simShow').addEventListener('click', () => $('simHeard').textContent = '“' + simGame.current.say + '”');
  simSay('Listen, then press the matching action.', 'LISTEN & ACT');
}
function simAct(id) {
  const a = ACTIONS.find(x => x.id === id);
  if (simMode === 'explore') {
    if (!a.can(sim)) return;
    a.apply(sim); simRender(); simSay(a.say);
    return;
  }
  if (!simGame?.current) return;
  const btn = $('simActions').querySelector(`[data-action="${id}"]`);
  if (id === simGame.current.id) {
    a.apply(sim); simRender();
    if (simGame.tries === 0) simGame.score++;
    btn.classList.add('right'); setTimeout(() => btn.classList.remove('right'), 700);
    simSay(a.say, simGame.tries === 0 ? '✓ CORRECT' : '✓ CORRECT (second try)');
    simGame.last = id;
    $('simRound').querySelector('.round-text').textContent = `Round ${simGame.round} / 8 · Score ${simGame.score}`;
    $('simRound').insertAdjacentHTML('beforeend', '<button class="small" id="simNext">Next round →</button>');
    $('simHeard').textContent = '“' + simGame.current.say + '”';
    simGame.current = null;
    $('simNext').addEventListener('click', simNextRound);
  } else {
    simGame.tries++;
    btn.classList.add('wrong'); setTimeout(() => btn.classList.remove('wrong'), 700);
    simSay(`Not that one. You pressed “${a.label}”. Listen again.`, '✕ TRY AGAIN');
  }
}
function setupSimulator() {
  simSetupButtons();
  $('simActions').addEventListener('click', e => { const b = e.target.closest('[data-action]'); if (b) simAct(b.dataset.action); });
  document.querySelectorAll('[data-simmode]').forEach(b => b.addEventListener('click', () => simSetMode(b.dataset.simmode)));
  $('simReset').addEventListener('click', () => simSetMode(simMode));
  simSetMode('explore');
}

/* ---------------------------------------------------------------
   11. GAME 3 · OPPOSITES MATCH (drag and drop)
   --------------------------------------------------------------- */
let matchBoard, matchSet = [];
function matchNew() {
  matchSet = shuffle(OPPOSITES).slice(0, 8);
  $('matchRows').innerHTML = matchSet.map((p, i) => `<div class="match-row" id="mrow-${i}">
    <div class="match-word">${escapeHtml(p[0])}<span class="fr">${escapeHtml(p[1])}</span></div>
    <div class="match-arrow">↔</div>
    <div class="match-slot" data-zone="m${i}" tabindex="0" role="button" aria-label="Opposite of ${escapeHtml(p[0])}"></div></div>`).join('');
  const pieces = {};
  matchSet.forEach((p, i) => pieces['w' + i] = {name:p[2], fr:p[3], rots:[0]});
  matchBoard.pieces = pieces;
  matchBoard.load(shuffle(Object.keys(pieces)));
  $('matchFeedback').textContent = ''; $('matchFeedback').className = 'feedback';
  matchScore();
}
function matchScore(n) {
  const placed = matchBoard.available.filter(pid => matchBoard.layout[pid].zone).length;
  $('matchScore').textContent = n === undefined ? `${placed} / 8 placed` : `${n} / 8 pairs correct`;
}
function matchCheck() {
  let good = 0;
  matchSet.forEach((p, i) => {
    const pid = matchBoard.occupant('m' + i);
    const row = $('mrow-' + i);
    row.classList.remove('good', 'bad');
    if (!pid) return;
    const ok = pid === 'w' + i;
    row.classList.add(ok ? 'good' : 'bad');
    if (ok) good++;
  });
  const done = good === 8;
  setResult('memory', done);
  $('matchFeedback').className = 'feedback ' + (done ? 'good' : 'bad');
  $('matchFeedback').textContent = done ? '✓ All 8 pairs are correct! Say each pair aloud.' : `✕ ${good} / 8 correct. Move the words in the red rows.` + (guided() ? ' Use the French under each word to help you.' : '');
  matchScore(good);
}
function setupMatch() {
  matchBoard = new DragBoard({
    root:$('matchRoot'), pieces:{}, emptyBinText:'All the words are placed. Press Check!',
    renderPiece:pid => `<span class="match-chip">${escapeHtml(matchBoard.pieces[pid].name)}<span class="fr">${escapeHtml(matchBoard.pieces[pid].fr)}</span></span>`,
    zoneLabel:() => '<span class="slot-tag">drop the opposite here</span>',
    describe:() => '',
    onChange:() => { document.querySelectorAll('.match-row').forEach(r => r.classList.remove('good', 'bad')); matchScore(); }
  });
  $('matchCheck').addEventListener('click', matchCheck);
  $('matchNew').addEventListener('click', matchNew);
  $('matchSay').addEventListener('click', () => {
    const pairs = matchSet.map((p, i) => { const pid = matchBoard.occupant('m' + i); return pid ? `${p[0]} — ${matchBoard.pieces[pid].name}` : null; }).filter(Boolean);
    speak(pairs.length ? pairs.join('. ') + '.' : 'Place some words first.');
  });
  matchNew();
}

/* ---------------------------------------------------------------
   12. GAME 4 · GALLEY BUILDER
   --------------------------------------------------------------- */
let gbBoard, gbMode = 'copy', gbScenario = GALLEY_SCENARIOS[0], gbStep = 0;
const gName = pid => GALLEY_PIECES[pid].proper ? GALLEY_PIECES[pid].name : 'the ' + GALLEY_PIECES[pid].name;
const normRot = r => (r === 270 ? 90 : r);
function parseLayout(obj) {
  const out = {};
  Object.entries(obj).forEach(([pid, v]) => { const [zone, rot] = v.split('@'); out[pid] = {zone, rot:Number(rot || 0)}; });
  return out;
}
function modSvg(pid, rot = 0) {
  return `<svg class="mod" viewBox="0 0 100 100" style="transform:rotate(${rot}deg)" aria-hidden="true">${MOD_SVG[pid]}</svg>`;
}
function orientSentence(pid, rot) {
  const r = normRot(rot);
  return r === 0 ? 'It’s the right way up.' : r === 180 ? 'It’s upside down.' : 'It’s on its side.';
}
function gOcc(layout, r, c) { return Object.keys(layout).find(p => layout[p].zone === `c${r}${c}`) || null; }
function gbDescribePiece(pid, layout = gbBoard.layout) {
  const z = layout[pid].zone;
  const n = gName(pid);
  if (!z) return `${cap(n)} is in the parts store. It isn’t in the galley yet.`;
  const r = +z[1], c = +z[2];
  const rel = [];
  const up = r > 0 && gOcc(layout, r - 1, c); if (up) rel.push(`under ${gName(up)}`);
  const down = r < 2 && gOcc(layout, r + 1, c); if (down) rel.push(`above ${gName(down)}`);
  const left = c > 0 && gOcc(layout, r, c - 1), right = c < 2 && gOcc(layout, r, c + 1);
  if (left && right) rel.push(`between ${gName(left)} and ${gName(right)}`);
  else if (left) rel.push(`to the right of ${gName(left)}`);
  else if (right) rel.push(`to the left of ${gName(right)}`);
  let s = `${cap(n)} is in ${CELLS[z]}`;
  if (r === 2 && !up) s += ', under the worktop';
  s += rel.length ? ', ' + joinAnd(rel.slice(0, 2)) + '.' : '.';
  return s + ' ' + orientSentence(pid, layout[pid].rot);
}
function gbDescribeAll(layout, level, namer = gName) {
  const gName = namer;
  const rowIntro = ['In the top row', 'In the middle row, just above the worktop', 'Under the worktop, in the bottom row'];
  const colWord = ['on the left', 'in the centre', 'on the right'];
  const colName = ['left', 'centre', 'right'];
  const out = ['Let’s look at the galley from the front.'];
  const placed = Object.keys(layout).filter(p => layout[p].zone);
  if (!placed.length) return 'The galley is empty. There are no modules in it yet.';
  for (let r = 0; r < 3; r++) {
    const items = [0,1,2].map(c => gOcc(layout, r, c));
    const parts = items.map((p, c) => p ? `${gName(p)} is ${colWord[c]}` : null).filter(Boolean);
    if (!parts.length) { out.push(`${rowIntro[r]}, all the ${r === 2 ? 'bays' : 'compartments'} are empty.`); continue; }
    out.push(`${rowIntro[r]}, ${joinAnd(parts)}.`);
    items.forEach((p, c) => { if (!p) out.push(`The ${colName[c]} ${r === 2 ? 'bay' : 'compartment'} is empty.`); });
  }
  if (level === 'b1') {
    let count = 0;
    for (let c = 0; c < 3 && count < 3; c++) {
      for (let r = 0; r < 2 && count < 3; r++) {
        const a = gOcc(layout, r, c), b = gOcc(layout, r + 1, c);
        if (a && b) { out.push(`${cap(gName(a))} is directly above ${gName(b)}.`); count++; break; }
      }
    }
    for (let r = 0; r < 3; r++) {
      const [l, m, rr] = [0,1,2].map(c => gOcc(layout, r, c));
      if (l && m && rr) { out.push(`${cap(gName(m))} sits between ${gName(l)} and ${gName(rr)}.`); break; }
    }
  }
  placed.forEach(p => { const n = normRot(layout[p].rot); if (n) out.push(`${cap(gName(p))} is ${n === 180 ? 'upside down' : 'on its side'}.`); });
  if (level === 'b1') out.push('Once everything is in place, let’s check that the front edges line up and that the trolley has enough clearance.');
  return out.join(' ');
}
function gbInstructions(layout, namer = gName) {
  const gName = namer;
  const seq = [];
  [2, 1, 0].forEach(r => [0, 1, 2].forEach(c => { const p = gOcc(layout, r, c); if (p) seq.push(p); }));
  if (!seq.length) return 'There is nothing to place yet.';
  const words = ['First,', 'Next,', 'Then,', 'After that,', 'Next,', 'Then,', 'After that,', 'Then,'];
  const done = new Set();
  const lines = seq.map((p, i) => {
    const z = layout[p].zone, r = +z[1], c = +z[2];
    const verb = p === 'trolley' ? `slide ${gName(p)} into` : ['oven','coffee'].includes(p) ? `install ${gName(p)} in` : (i % 2 ? `place ${gName(p)} in` : `put ${gName(p)} in`);
    let rel = '';
    const left = c > 0 && gOcc(layout, r, c - 1), below = r < 2 && gOcc(layout, r + 1, c);
    if (below && done.has(below)) rel = `, directly above ${gName(below)}`;
    else if (left && done.has(left)) rel = `, next to ${gName(left)}`;
    done.add(p);
    const n = normRot(layout[p].rot);
    const orient = p === 'box' && n === 0 ? ' Make sure it’s the right way up.' : n === 90 ? ' Lay it on its side.' : n === 180 ? ' Turn it upside down.' : '';
    const lead = i === seq.length - 1 && seq.length > 1 ? 'Finally,' : words[i];
    return `${lead} ${verb} ${CELLS[z]}${rel}.${orient}`;
  });
  const empties = Object.keys(CELLS).filter(z => !Object.values(layout).some(v => v.zone === z));
  if (empties.length && empties.length <= 3) lines.push(`Leave ${joinAnd(empties.map(z => CELLS[z]))} empty.`);
  return lines.join(' ');
}
function gbCheck() {
  const fb = $('gbFeedback');
  if (gbMode === 'free') { fb.innerHTML = '<div class="win"><b>Free design</b> · there is no target. Press <b>🗣 Describe my layout</b> and the model buttons below, then explain your design aloud and record yourself.</div>'; return; }
  const target = gbMode === 'fix' ? parseLayout(gbScenario.target) : parseLayout(gbScenario.target);
  const L = gbBoard.layout;
  const items = [];
  let ok = true;
  Object.keys(target).forEach(pid => {
    const t = target[pid], c = L[pid], n = cap(gName(pid));
    if (!c.zone) { ok = false; items.push(['bad', guided() ? `${n} isn’t in the galley yet. It goes in ${CELLS[t.zone]}.` : `${n} isn’t in the galley yet.`]); return; }
    let good = true;
    if (c.zone !== t.zone) { good = false; items.push(['bad', guided() ? `${n} is in ${CELLS[c.zone]}. It should be in ${CELLS[t.zone]}.` : `${n} is in the wrong place.`]); }
    const want = normRot(t.rot), have = normRot(c.rot);
    if (want !== have) {
      good = false;
      const fix = want === 0 ? (have === 180 ? 'Turn it the right way up.' : 'Stand it up — turn it the right way up.') : want === 90 ? 'Lay it on its side.' : 'Turn it upside down.';
      items.push(['bad', `${n} ${have === 180 ? 'is upside down' : have === 90 ? 'is on its side' : 'is the right way up'}. ${fix}`]);
    }
    if (good) items.push(['good', `✓ ${n} is in ${CELLS[t.zone]}.`]);
    else ok = false;
  });
  const id = `gb-${gbMode}-${gbScenario.id}`;
  setResult(id, ok);
  if (ok) {
    if (gbMode === 'listen' || gbMode === 'fix') gbRenderSide(true);
    fb.innerHTML = `<div class="win">🏆 <b>Perfect galley!</b> Every module is in the right place and the right way up. Now explain the layout to a colleague below — then record yourself.</div>`;
    toast('Galley complete ✓');
  } else {
    fb.innerHTML = `<p><b>Not yet.</b> ${guided() ? 'Read the comments, then move the modules.' : 'Check the red items.'}</p><ul>${items.map(([k, t]) => `<li class="${k}">${escapeHtml(t)}</li>`).join('')}</ul>`;
  }
}
function gbStatic(layout) {
  const cells = Object.keys(CELLS);
  const cellHtml = z => {
    const pid = Object.keys(layout).find(p => layout[p].zone === z);
    return `<div class="galley-cell${pid ? ' filled' : ''}">${pid ? `<div class="static-mod">${modSvg(pid, layout[pid].rot)}<span class="mname">${escapeHtml(cap(GALLEY_PIECES[pid].name))}</span></div>` : ''}</div>`;
  };
  return `<div class="galley mini" role="img" aria-label="${escapeHtml(gbDescribeAll(layout, 'a2'))}"><div class="galley-frame">${cells.slice(0, 6).map(cellHtml).join('')}<div class="galley-worktop"></div>${cells.slice(6).map(cellHtml).join('')}</div><div class="galley-floor"></div></div>`;
}
function gbRenderSide(reveal = false) {
  const side = $('gbSide');
  const s = gbScenario;
  const target = parseLayout(s.target);
  if (gbMode === 'copy') {
    side.innerHTML = `<article class="panel"><h3>Target drawing</h3>${gbStatic(target)}<p class="micro">Copy this layout exactly. Watch the orientation of the container!</p></article>`;
  } else if (gbMode === 'listen') {
    side.innerHTML = `<article class="panel"><h3>🎧 Your colleague’s instructions</h3>
      <div class="inline-actions" style="margin-top:0">
        <button class="small" id="gbPrevStep">◀</button>
        <button class="primary" id="gbPlayStep">▶ Play step ${gbStep + 1} / ${s.steps.length}</button>
        <button class="small" id="gbNextStep">▶▶ Next step</button>
        <button class="small" id="gbPlayAll">Play all</button>
      </div>
      <label class="micro setting"><input type="checkbox" id="gbShowText"> Show the text (transcript)</label>
      <ol class="step-list masked" id="gbSteps">${s.steps.map((t, i) => `<li class="${i === gbStep ? 'current' : ''}"><span class="step-words">${escapeHtml(t)}</span></li>`).join('')}</ol>
      ${reveal ? `<h3>Target drawing</h3>${gbStatic(target)}` : `<button class="small" id="gbReveal">👁 Reveal the target drawing</button>`}</article>`;
    $('gbPlayStep').addEventListener('click', () => speak(s.steps[gbStep]));
    $('gbNextStep').addEventListener('click', () => { gbStep = Math.min(s.steps.length - 1, gbStep + 1); gbRenderSide(reveal); speak(s.steps[gbStep]); });
    $('gbPrevStep').addEventListener('click', () => { gbStep = Math.max(0, gbStep - 1); gbRenderSide(reveal); });
    $('gbPlayAll').addEventListener('click', () => speak(s.steps.join(' ')));
    $('gbShowText').addEventListener('change', e => $('gbSteps').classList.toggle('masked', !e.target.checked));
    $('gbReveal')?.addEventListener('click', () => gbRenderSide(true));
  } else if (gbMode === 'fix') {
    side.innerHTML = `<article class="panel"><h3>✉ Review note from your colleague</h3>
      <div class="inline-actions" style="margin-top:0"><button class="primary" data-say="${escapeHtml(s.note)}">▶ Listen to the note</button><button class="small" id="gbNoteToggle">Show the text</button></div>
      <p class="transcript" id="gbNote" hidden>${escapeHtml(s.note)}</p>
      <p class="micro">The galley on the right is your colleague’s draft. Make the changes in the note.</p>
      ${reveal ? `<h3>Target drawing</h3>${gbStatic(target)}` : `<button class="small" id="gbReveal">👁 Reveal the target drawing</button>`}</article>`;
    $('gbNoteToggle').addEventListener('click', () => { $('gbNote').hidden = !$('gbNote').hidden; $('gbNoteToggle').textContent = $('gbNote').hidden ? 'Show the text' : 'Hide the text'; });
    $('gbReveal')?.addEventListener('click', () => gbRenderSide(true));
  } else {
    side.innerHTML = `<article class="panel"><h3>✏️ Your design brief</h3><p>Design a galley for an airline of your choice. Use <b>at least six</b> modules and <b>one</b> module on its side or upside down if you like.</p><p>Then:</p><ol><li>Press <b>🗣 Describe my layout</b>.</li><li>Explain it aloud and record yourself.</li><li>Give your colleague step-by-step instructions (model button below).</li></ol><p class="micro">Classroom idea: Laura builds a secret layout, then dictates it to Tisha, who builds it in another tab.</p></article>`;
  }
}
function gbSetup(keepStep = false) {
  const s = gbScenario;
  if (!keepStep) gbStep = 0;
  document.querySelectorAll('[data-gmode]').forEach(b => b.classList.toggle('active', b.dataset.gmode === gbMode));
  const titles = {copy:'Copy the drawing', listen:'Listen & build', fix:'Fix the draft', free:'Design your own galley'};
  $('gbTitle').textContent = titles[gbMode];
  const how = {
    copy:'<b>Copy:</b> look at the target drawing and drag each module into the same place in your galley. Select a module to rotate it or turn it upside down. Then press <b>Check</b>.',
    listen:'<b>Listen &amp; build:</b> you can’t see the target. Play each step, build what you hear, then press <b>Check</b>. Use the transcript only if you are stuck.',
    fix:'<b>Fix the draft:</b> your colleague built this galley but made mistakes. Listen to the review note, make the changes (swap, move, turn), then press <b>Check</b>.',
    free:'<b>Design your own:</b> all eight modules are in the store. Build any layout you like, then describe it and give instructions.'
  };
  $('gbHow').innerHTML = how[gbMode];
  $('gbScenarioWrap').hidden = gbMode === 'free';
  $('gbBrief').innerHTML = gbMode === 'free' ? '<h4>Free design</h4><p>No target, no wrong answers — just clear English.</p>' : `<h4>${escapeHtml(s.title)}</h4><p>${escapeHtml(s.brief)}</p><p class="fr">${escapeHtml(SCENARIO_FR[s.id])}</p>`;
  gbWordBank();
  $('gbDescCheck').innerHTML = '';
  const pieces = gbMode === 'free' ? Object.keys(GALLEY_PIECES) : Object.keys(s.target);
  gbBoard.load(pieces, gbMode === 'fix' ? parseLayout(s.draft) : {});
  $('gbFeedback').innerHTML = '';
  $('gbModelOut').innerHTML = '';
  gbRenderSide();
}
function setupGalley() {
  const zones = Object.keys(CELLS);
  const cell = z => `<div class="galley-cell" data-zone="${z}" tabindex="0" role="button" aria-label="${CELLS[z]}"></div>`;
  $('gbFrame').innerHTML = zones.slice(0, 6).map(cell).join('') + '<div class="galley-worktop">WORKTOP</div>' + zones.slice(6).map(cell).join('');
  $('gbScenario').innerHTML = GALLEY_SCENARIOS.map((s, i) => `<option value="${i}">${i + 1} · ${escapeHtml(s.title)}</option>`).join('');
  gbBoard = new DragBoard({
    root:$('gbRoot'), pieces:GALLEY_PIECES, binName:'parts store', emptyBinText:'The parts store is empty — every module is in the galley.',
    toolbarHint:'Tip · drop a module on a full compartment to swap the two modules.',
    zoneLabel:z => `<span class="cell-tag">${CELL_TAGS[z]}</span>`,
    renderPiece:(pid, rot) => `${modSvg(pid, rot)}<span class="mname">${escapeHtml(cap(GALLEY_PIECES[pid].name))}</span>`,
    describe:pid => gbDescribePiece(pid),
    onChange:() => { if ($('gbFeedback').innerHTML) $('gbFeedback').innerHTML = ''; }
  });
  $('gbTabs').addEventListener('click', e => { const b = e.target.closest('[data-gmode]'); if (b) { gbMode = b.dataset.gmode; gbSetup(); } });
  $('gbScenario').addEventListener('change', () => { gbScenario = GALLEY_SCENARIOS[Number($('gbScenario').value)]; gbSetup(); });
  $('gbCheck').addEventListener('click', gbCheck);
  $('gbReset').addEventListener('click', () => gbSetup());
  $('gbDescribe').addEventListener('click', () => {
    const text = gbDescribeAll(gbBoard.layout, 'b1');
    $('gbFeedback').innerHTML = `<div class="model-text"><b>Your layout in English:</b> ${escapeHtml(text)} <button class="listen" data-say="${escapeHtml(text)}">▶ Listen</button></div>`;
  });
  document.querySelectorAll('[data-gbmodel]').forEach(btn => btn.addEventListener('click', () => {
    if (!guided()) { toast('Models are hidden in exam mode. Switch Guided mode on in the settings.'); return; }
    const {layout, source} = gbSpeakLayout();
    const kind = btn.dataset.gbmodel;
    const text = kind === 'steps' ? gbInstructions(layout) : gbDescribeAll(layout, kind);
    const label = {a2:'A2+ description', b1:'B1 description', steps:'Step-by-step instructions'}[kind];
    $('gbModelOut').innerHTML = `<div class="model-text"><b>${label} · ${source}</b><br>${escapeHtml(text)} <button class="listen" data-say="${escapeHtml(text)}">▶ Listen</button></div>`;
  }));
  $('gbFrameBtn').addEventListener('click', () => {
    const {layout, source} = gbSpeakLayout();
    const blank = () => '§';
    const text = escapeHtml(gbDescribeAll(layout, 'a2', blank)).replace(/§/g, '<span class="blank">module</span>');
    const names = Object.keys(layout).filter(p => layout[p].zone).map(p => cap(GALLEY_PIECES[p].name));
    $('gbModelOut').innerHTML = `<div class="frame-text"><b>🧩 Speaking frame · ${source}</b><br>Say the text aloud and fill each gap with the right module. Look at the galley!<br>${text}<br><span class="micro">Modules: ${escapeHtml(names.join(' · '))}</span></div>`;
  });
  $('gbCheckDesc').addEventListener('click', gbCheckDescription);
  gbSetup();
}

function gbSpeakLayout() {
  const placed = Object.values(gbBoard.layout).some(v => v.zone);
  if (placed) return {layout:gbBoard.layout, source:'the galley you built'};
  if (gbMode === 'free') return {layout:gbBoard.layout, source:'your galley (empty — build something first!)'};
  return {layout:parseLayout(gbScenario.target), source:'the target layout (your galley is still empty)'};
}
function gbWordBank() {
  const ids = gbMode === 'free' ? Object.keys(GALLEY_PIECES) : Object.keys(gbScenario.target);
  const chip = ([en, fr]) => `<span class="wb"><b>${escapeHtml(en)}</b><span class="fr">${escapeHtml(fr)}</span><button class="listen" data-say="${escapeHtml(en.replace(' … and …', ' and'))}">▶</button></span>`;
  $('gbWordBank').innerHTML =
    '<div class="wb-title" style="margin-top:0;flex-basis:100%">Modules</div>' + ids.map(p => chip([GALLEY_PIECES[p].name, GALLEY_FR[p]])).join('') +
    '<div class="wb-title" style="flex-basis:100%">The situation</div>' + SCENARIO_WORDS[gbMode === 'free' ? 'free' : gbScenario.id].map(chip).join('') +
    '<div class="wb-title" style="flex-basis:100%">Positions</div>' + POSITION_BANK.map(chip).join('');
}
const MODULE_WORDS = {oven:/\boven\b/, coffee:/coffee|beverage/, box:/container|\bbox\b/, cabA:/cabinet a\b/, cabB:/cabinet b\b/, drawer:/drawer/, trolley:/trolley|\bcart\b/, bin:/\bbin\b|trash|waste/};
function gbCheckDescription() {
  const text = ' ' + $('gbExplain').value.toLowerCase().replace(/[’]/g, "'") + ' ';
  const box = $('gbDescCheck');
  if (!text.trim()) { box.innerHTML = '<p class="feedback help">Write your description first (or record it, then write the keywords).</p>'; return; }
  const placed = Object.keys(gbBoard.layout).filter(p => gbBoard.layout[p].zone);
  if (!placed.length) { box.innerHTML = '<p class="feedback help">Build a galley first — then describe it.</p>'; return; }
  const items = [];
  placed.forEach(p => {
    const n = cap(GALLEY_PIECES[p].name);
    items.push(MODULE_WORDS[p].test(text) ? ['good', `✓ You mentioned ${n === 'Cabinet A' || n === 'Cabinet B' ? n : 'the ' + GALLEY_PIECES[p].name}.`] : ['bad', `✕ You didn’t mention ${n === 'Cabinet A' || n === 'Cabinet B' ? n : 'the ' + GALLEY_PIECES[p].name}. Where is it? (${CELLS[gbBoard.layout[p].zone]})`]);
  });
  const rows = ['top', 'middle', 'bottom', 'worktop'].filter(w => text.includes(w));
  items.push(rows.length >= 2 ? ['good', `✓ You described the rows (${rows.join(', ')}).`] : ['bad', '✕ Say which row: “In the top row…”, “In the middle row…”, “Under the worktop…”']);
  const rels = ['above', 'below', 'under', 'next to', 'between', 'to the left of', 'to the right of'].filter(w => text.includes(' ' + w + ' '));
  items.push(rels.length >= 2 ? ['good', `✓ You used relations: ${rels.join(', ')}.`] : ['bad', '✕ Add two relations: “directly above”, “next to”, “between … and …”.']);
  const turned = placed.filter(p => normRot(gbBoard.layout[p].rot) !== 0);
  if (turned.length) items.push(/upside down|on its side/.test(text) ? ['good', '✓ You described the orientation.'] : ['bad', `✕ Don’t forget: ${turned.map(gName).join(' and ')} ${turned.length > 1 ? 'are' : 'is'} not the right way up.`]);
  const empty = Object.keys(CELLS).some(z => !placed.some(p => gbBoard.layout[p].zone === z));
  if (empty) items.push(text.includes('empty') ? ['good', '✓ You said which space is empty.'] : ['bad', '✕ Say which compartment or bay is empty.']);
  items.push(/let's look|front view|from the front/.test(text) ? ['good', '✓ Good opening.'] : ['bad', '✕ Start with: “Let’s look at the galley from the front.”']);
  items.push(/check|line up|clearance|flush/.test(text) ? ['good', '✓ You finished with a check.'] : ['bad', '✕ Finish with a check: “Let’s check that the front edges line up.”']);
  const good = items.filter(i => i[0] === 'good').length;
  box.innerHTML = `<p><b>${good} / ${items.length}</b> — ${good === items.length ? 'Excellent! Now say it aloud and record yourself.' : 'Add the red points, then check again.'}</p><ul>${items.map(([k, t]) => `<li class="${k}">${escapeHtml(t)}</li>`).join('')}</ul>`;
}

/* ---------------------------------------------------------------
   13. GAME 5 · OPERATOR (what needs to move?)
   --------------------------------------------------------------- */
let op = null;
function opVars(o) {
  return `--shelf-y:${41 + o.shelf * 0.52}%;--divider-x:${50 + o.divider * 0.4333}%;--handle-x:${85 + o.handle * 0.5}%`;
}
function opRender() {
  $('opCabinet').innerHTML = cabinetHtml('op', {vars:opVars(op.pos), guides:guided() && op.mode === 'fix', active:op.part, label:`Shelf offset ${op.pos.shelf} mm, divider ${op.pos.divider} mm, handle ${op.pos.handle} mm from the target.`});
  $('opParts').innerHTML = Object.entries(OP_PARTS).map(([id, p]) => `<button type="button" data-oppart="${id}" class="${op.part === id ? 'active' : ''}">${cap(p.name)}</button>`).join('');
  $('opButtons').innerHTML = OP_PARTS[op.part].moves.map(([dir, label]) => `<button type="button" data-opmove="${dir}">${label}<small>5 mm</small></button>`).join('');
  $('opLog').innerHTML = op.log.slice(0, 8).map(t => `<li>${escapeHtml(t)}</li>`).join('') || '<li class="micro">Your actions will appear here.</li>';
}
function opTotal(part, delta) {
  const p = OP_PARTS[part];
  if (delta === 0) return `The ${p.name} is back where it started.`;
  const move = p.moves.find(m => Math.sign(m[2]) === Math.sign(delta));
  const verb = move[3].includes('…') ? move[3].replace('…', `the ${p.name} ${Math.abs(delta)} mm`) : `${move[3]} the ${p.name} by ${Math.abs(delta)} mm`;
  return `In total, you’ve ${verb}.`;
}
function opMove(dir) {
  const part = OP_PARTS[op.part];
  const move = part.moves.find(m => m[0] === dir);
  const next = op.pos[op.part] + move[2];
  if (next < part.range[0] || next > part.range[1]) { toast(`You can’t move the ${part.name} any further in that direction.`); return; }
  op.history.push({...op.pos});
  op.pos[op.part] = next;
  const sentence = move[3].includes('…') ? `You ${move[3].replace('…', `the ${part.name} 5 mm`)}.` : `You ${move[3]} the ${part.name} by 5 mm.`;
  const startVal = op.mode === 'fix' ? OP_DRAFT[op.part] : op.reqStart[op.part];
  op.log.unshift(sentence + ' ' + opTotal(op.part, op.pos[op.part] - startVal));
  if ($('opSay').checked) speak(sentence);
  $('opFeedback').textContent = ''; $('opFeedback').className = 'feedback';
  opRender();
}
function opCheck() {
  const fb = $('opFeedback');
  if (op.mode === 'fix') {
    const msgs = [];
    const s = op.pos.shelf, d = op.pos.divider, h = op.pos.handle;
    if (s > 0) msgs.push(`The shelf is still too low${guided() ? ` — raise it by ${s} mm` : ''}.`);
    if (s < 0) msgs.push(`The shelf is now too high${guided() ? ` — lower it by ${-s} mm` : ''}.`);
    if (d > 0) msgs.push(`The divider is still too far to the right${guided() ? ` — shift it ${d} mm to the left` : ''}.`);
    if (d < 0) msgs.push(`The divider is too far to the left${guided() ? ` — shift it ${-d} mm to the right` : ''}.`);
    if (h < 0) msgs.push(`The handle isn’t close enough to the right edge${guided() ? ` — move it ${-h} mm to the right` : ''}.`);
    if (h > 0) msgs.push(`The handle is too close to the edge${guided() ? ` — move it ${h} mm towards the centre` : ''}.`);
    const ok = !msgs.length;
    setResult('op-fix', ok);
    fb.className = 'feedback ' + (ok ? 'good' : 'bad');
    fb.textContent = ok ? '✓ The draft matches the target! Now say it: “I raised the shelf by 25 mm, shifted the divider 15 mm to the left and moved the handle 20 mm closer to the right edge.”' : '✕ ' + msgs.join(' ');
    if (ok) toast('Draft fixed ✓');
    return;
  }
  if (!op.req || op.req.answered) return;
  const delta = {shelf:op.pos.shelf - op.reqStart.shelf, divider:op.pos.divider - op.reqStart.divider, handle:op.pos.handle - op.reqStart.handle};
  const want = {shelf:0, divider:0, handle:0};
  want[op.req.part] = op.req.delta;
  const ok = Object.keys(want).every(k => want[k] === delta[k]);
  op.reqTries++;
  if (ok) {
    if (op.reqTries === 1) op.reqScore++;
    fb.className = 'feedback good';
    fb.textContent = `✓ Correct: ${op.req.text}`;
    op.reqDone++;
    op.req.answered = true;
    opRequestBox();
  } else {
    fb.className = 'feedback bad';
    fb.textContent = '✕ Not quite. ' + (guided() ? 'Listen again. Check the part, the direction and the number of millimetres. Use Undo if needed.' : 'Listen again.');
  }
}
function opNewRequest() {
  const parts = Object.keys(OP_PARTS);
  let req;
  for (let guard = 0; guard < 50 && !req; guard++) {
    const part = parts[Math.floor(Math.random() * parts.length)];
    const n = [5, 10, 15, 20][Math.floor(Math.random() * 4)];
    const dir = Math.random() < .5 ? -1 : 1;
    const next = op.pos[part] + dir * n;
    const range = OP_PARTS[part].range;
    if (next < range[0] || next > range[1]) continue;
    const T = {
      shelf:{'-1':[`Could you raise the shelf by ${n} mm?`, `Please move the shelf up ${n} mm.`], '1':[`Could you lower the shelf by ${n} mm?`, `The shelf is too high. Lower it by ${n} mm, please.`]},
      divider:{'-1':[`Shift the divider ${n} mm to the left, please.`, `Could you move the divider ${n} mm to the left?`], '1':[`Could you shift the divider ${n} mm to the right?`, `Please move the divider ${n} mm to the right.`]},
      handle:{'-1':[`Could you move the handle ${n} mm towards the centre of the door?`, `Move the handle ${n} mm to the left, please.`], '1':[`Move the handle ${n} mm closer to the right edge of the door.`, `Could you move the handle ${n} mm towards the right edge?`]}
    };
    const options = T[part][String(dir)];
    req = {part, delta:dir * n, text:options[Math.floor(Math.random() * options.length)]};
  }
  op.req = req; op.reqStart = {...op.pos}; op.reqTries = 0;
  opRequestBox();
  $('opFeedback').textContent = ''; $('opFeedback').className = 'feedback';
}
function opRequestBox() {
  const box = $('opRequest');
  box.hidden = false;
  if (op.reqDone >= 5) {
    const ok = op.reqScore >= 4;
    setResult('op-req', ok);
    box.innerHTML = `<small>RESULT</small><div class="req-text">🏁 ${op.reqScore} / 5 correct first time.</div><p>${ok ? 'Excellent — you understood every request.' : 'Try another round to reach 4 / 5.'}</p><button class="small" id="opAgain">↻ New round</button>`;
    $('opAgain').addEventListener('click', () => opSetMode('req'));
    return;
  }
  const answered = op.req?.answered;
  box.innerHTML = `<small>REQUEST ${op.reqDone + (answered ? 0 : 1)} / 5 · SCORE ${op.reqScore}</small>
    <div class="req-text ${answered || op.showText ? '' : 'hidden-text'}" id="opReqText">${escapeHtml(op.req.text)}</div>
    <div class="inline-actions" style="margin-top:4px">
      ${answered ? '<button class="primary" id="opNextReq">Next request →</button>' : '<button class="listen" id="opPlayReq">▶ Play the request</button><button class="small" id="opShowReq">Show text</button>'}
    </div>`;
  $('opPlayReq')?.addEventListener('click', () => speak(op.req.text));
  $('opShowReq')?.addEventListener('click', () => $('opReqText').classList.remove('hidden-text'));
  $('opNextReq')?.addEventListener('click', () => { opNewRequest(); opRender(); });
}
function opSetMode(mode) {
  op = {mode, part:'shelf', pos:mode === 'fix' ? {...OP_DRAFT} : {shelf:0, divider:0, handle:0}, history:[], log:[], req:null, reqStart:null, reqDone:0, reqScore:0, reqTries:0};
  document.querySelectorAll('[data-opmode]').forEach(b => b.classList.toggle('active', b.dataset.opmode === mode));
  $('opTitle').textContent = mode === 'fix' ? 'Fix the draft — millimetre by millimetre.' : 'Your colleague asks for changes. Listen and do it.';
  $('opHow').innerHTML = mode === 'fix'
    ? '<b>Fix the draft:</b> choose a part, then move it 5 mm at a time until it matches the target (dashed orange outline in Guided mode). Read each sentence in the log aloud: “I raised the shelf by 10 mm.” Then press <b>Check</b>.'
    : '<b>Colleague requests:</b> the draft is now correct. Your colleague asks for 5 small changes. Press <b>▶ Play the request</b>, make the exact change, then press <b>Check</b>. Five requests, one point each time you get it first time.';
  $('opFeedback').textContent = ''; $('opFeedback').className = 'feedback';
  if (mode === 'req') opNewRequest(); else $('opRequest').hidden = true;
  opRender();
}
function setupOperator() {
  $('opParts').addEventListener('click', e => { const b = e.target.closest('[data-oppart]'); if (b) { op.part = b.dataset.oppart; opRender(); } });
  $('opButtons').addEventListener('click', e => { const b = e.target.closest('[data-opmove]'); if (b) opMove(b.dataset.opmove); });
  $('opCheck').addEventListener('click', opCheck);
  $('opUndo').addEventListener('click', () => { if (!op.history.length) return; op.pos = op.history.pop(); op.log.unshift('↶ Undo.'); opRender(); });
  $('opReset').addEventListener('click', () => opSetMode(op.mode));
  document.querySelectorAll('[data-opmode]').forEach(b => b.addEventListener('click', () => opSetMode(b.dataset.opmode)));
  opSetMode('fix');
}

/* ---------------------------------------------------------------
   14. VOCABULARY LIST + FLASHCARDS
   --------------------------------------------------------------- */
let flash = {deck:[], i:0, dir:'en', known:new Set()};
function renderVocabulary() {
  const category = $('vocabCategory').value;
  $('vocabList').innerHTML = VOCAB[category].map(([term, french, definition, example, icon]) => `
    <article class="vocab-item">
      <strong>${icon ? icon + ' ' : ''}${escapeHtml(term)}</strong>
      <div class="fr fr-term">${escapeHtml(french)}</div>
      <p>${escapeHtml(definition)}</p>
      <p><em>“${escapeHtml(example)}”</em></p>
      <div class="inline-actions">
        <button type="button" class="listen" data-say="${escapeHtml(term.replace(/\s*\((UK|US)[^)]*\)/g, '').replaceAll(' / ', '. '))}">▶ Term</button>
        <button type="button" class="listen" data-say="${escapeHtml(example)}">▶ Example</button>
      </div>
    </article>`).join('');
  flashLoad();
}
function flashLoad(shuffleDeck = false) {
  const deck = VOCAB[$('vocabCategory').value].map((v, i) => ({v, key:$('vocabCategory').value + i}));
  flash.deck = shuffleDeck ? shuffle(deck) : deck;
  flash.i = 0;
  flashShow();
}
function flashShow() {
  const remaining = flash.deck.filter(c => !flash.known.has(c.key));
  const card = $('flashCard');
  card.classList.remove('flipped');
  const total = flash.deck.length, known = total - remaining.length;
  $('flashProgress').textContent = `Known: ${known} / ${total}`;
  if (!remaining.length) {
    $('flashFront').innerHTML = '<div class="ficon">🏆</div><div class="fterm">All cards known!</div><small>Choose another category or shuffle to start again.</small>';
    $('flashBack').innerHTML = '';
    return;
  }
  const c = remaining[flash.i % remaining.length];
  const [term, fr, def, ex, icon] = c.v;
  const front = flash.dir === 'en' ? term : fr;
  $('flashFront').innerHTML = `<div class="ficon">${icon || '✈'}</div><div class="fterm">${escapeHtml(front)}</div><small>Say it in ${flash.dir === 'en' ? 'French' : 'English'}, then press the card to check.</small>`;
  $('flashBack').innerHTML = `<div class="fterm" style="font:800 1.3rem Manrope,Arial">${escapeHtml(flash.dir === 'en' ? term : term)}</div><div class="fr-big">${escapeHtml(fr)}</div><p>${escapeHtml(def)}</p><p><em>“${escapeHtml(ex)}”</em></p>`;
  flash.current = c;
}
function setupFlashcards() {
  $('flashCard').addEventListener('click', () => $('flashCard').classList.toggle('flipped'));
  $('flashGot').addEventListener('click', () => { if (flash.current) flash.known.add(flash.current.key); flashShow(); });
  $('flashAgain').addEventListener('click', () => { flash.i++; flashShow(); });
  $('flashShuffle').addEventListener('click', () => { flash.known = new Set([...flash.known].filter(k => !k.startsWith($('vocabCategory').value))); flashLoad(true); });
  $('flashDir').addEventListener('click', () => { flash.dir = flash.dir === 'en' ? 'fr' : 'en'; $('flashDir').textContent = 'Direction: ' + (flash.dir === 'en' ? 'English → French' : 'French → English'); flashShow(); });
  $('flashListen').addEventListener('click', () => { if (flash.current) speak(flash.current.v[0].replace(/\s*\((UK|US)[^)]*\)/g, '').replaceAll(' / ', '. ') + '. ' + flash.current.v[3]); });
  document.querySelectorAll('[data-vview]').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('[data-vview]').forEach(x => x.classList.toggle('active', x === b));
    const cards = b.dataset.vview === 'cards';
    $('vocabList').hidden = cards; $('flashBox').hidden = !cards;
  }));
}

/* ---------------------------------------------------------------
   15. SCORES · MODE · BOOT
   --------------------------------------------------------------- */
function updateGameScores() {
  if (!$('sbScore')) return;
  const sbDone = SB_CHALLENGES.filter(c => state.results['sb-' + c.id] === true).length;
  $('sbScore').textContent = `${sbDone} / ${SB_CHALLENGES.length} challenges`;
  const gbDone = GAME_ITEMS.filter(i => i.id.startsWith('gb-') && state.results[i.id] === true).length;
  $('gbScore').textContent = `${gbDone} / ${GALLEY_SCENARIOS.length * GB_MODES.length} builds`;
  const act = state.results['act-game'];
  if (simMode === 'explore' || !simGame) $('simScore').textContent = act === true ? 'Listen & act: ✓ passed' : act === false ? 'Listen & act: try again' : 'Listen & act: not played';
  else $('simScore').textContent = `Listen & act: ${simGame.score} / 8`;
  $('opScore').textContent = `Draft: ${state.results['op-fix'] === true ? '✓ fixed' : 'not fixed'} · Requests: ${state.results['op-req'] === true ? '✓ passed' : (op?.mode === 'req' ? op.reqScore + ' / 5' : 'not played')}`;
}

function applyMode() {
  document.body.classList.toggle('hide-french', !$('french').checked);
  document.body.classList.toggle('exam-mode', !guided());
  document.querySelectorAll('.question').forEach(card => {
    const item = ITEMS.find(entry => entry.id === card.id);
    if (item) showResult(item, card);
  });
  if (!guided()) {
    document.querySelectorAll('.model-out').forEach(panel => panel.hidden = true);
    document.querySelectorAll('.model').forEach(button => button.setAttribute('aria-expanded', 'false'));
    $('gbModelOut').innerHTML = '';
  }
  document.querySelectorAll('.hint-btn').forEach(b => b.hidden = !guided());
  if (op) opRender();
}

async function copyText(text) {
  try { await navigator.clipboard.writeText(text); toast('Copied to clipboard.'); }
  catch {
    const field = document.createElement('textarea');
    field.value = text; field.style.position = 'fixed'; field.style.opacity = '0';
    document.body.append(field); field.select();
    const copied = document.execCommand('copy');
    field.remove();
    toast(copied ? 'Copied to clipboard.' : 'Select the text and copy it manually.');
  }
}

function downloadNotes() {
  const payload = {learner:'Laura Schmitt', lesson:'Aviation design English — lesson 02', exported:new Date().toISOString(), report:reportData(), ...state};
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], {type:'application/json'}));
  link.download = 'Laura_Lesson_02_Notes.json';
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

function boot() {
  $('skillStatuses').innerHTML = SKILLS.map((skill, index) => `<label class="skillstatus">${skill}
    <select id="skill-${index}"><option>Not assessed</option><option>Acquis</option><option>En cours</option><option>Non acquis</option></select></label>`).join('');
  restore();
  Object.keys(QUESTIONS).forEach(renderQuestions);
  renderStaticCabinets();
  setupPlayground();
  setupSimulator();
  setupMatch();
  setupGalley();
  setupOperator();
  $('vocabCategory').innerHTML = Object.keys(VOCAB).map(category => `<option>${escapeHtml(category)}</option>`).join('');
  $('vocabCategory').addEventListener('change', renderVocabulary);
  setupFlashcards();
  renderVocabulary();
  setupRecorders();
  applyMode();
  updateProgress();

  document.querySelectorAll(trackedFields).forEach(field => {
    field.addEventListener(field.tagName === 'TEXTAREA' || field.id === 'lessonUrl' ? 'input' : 'change', () => {
      state.fields[field.id] = field.type === 'checkbox' ? field.checked : field.value;
      if (field.id === 'french' || field.id === 'guided') applyMode();
      save();
    });
  });
  document.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.dataset.say) speak(button.dataset.say);
    if (button.dataset.read) {
      const source = $(button.dataset.read);
      speak(source.value ?? source.textContent.trim());
    }
    if (button.dataset.reset) resetGroup(button.dataset.reset);
    if (button.dataset.model) {
      const panel = $('model-' + button.dataset.model);
      if (panel.hidden && !panel.hasChildNodes()) {
        panel.innerHTML = MODELS[button.dataset.model].map(([level, text]) =>
          `<p><b>${level}</b><br>${escapeHtml(text).replace(/\n/g, '<br>')} <button type="button" class="listen" data-say="${escapeHtml(text)}">▶ Listen</button></p>`).join('');
      }
      panel.hidden = !panel.hidden;
      button.setAttribute('aria-expanded', String(!panel.hidden));
    }
  });
  $('stopAudio').addEventListener('click', () => window.speechSynthesis?.cancel());
  $('transcriptToggle').addEventListener('click', () => {
    const transcript = $('transcript');
    transcript.hidden = !transcript.hidden;
    $('transcriptToggle').textContent = transcript.hidden ? 'Show transcript' : 'Hide transcript';
    $('transcriptToggle').setAttribute('aria-expanded', String(!transcript.hidden));
  });
  $('printBtn').addEventListener('click', () => window.print());
  $('copyEmail').addEventListener('click', () => copyText($('emailDraft').value));
  $('copyReport').addEventListener('click', () => copyText($('reportText').value));
  $('downloadNotes').addEventListener('click', downloadNotes);
  $('resetAll').addEventListener('click', () => {
    if (!confirm('Reset all saved answers, scores and notes for this lesson?')) return;
    state = {answers:{}, results:{}, fields:{}};
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    location.reload();
  });
  if ('speechSynthesis' in window) window.speechSynthesis.getVoices();
}
document.addEventListener('DOMContentLoaded', boot);
