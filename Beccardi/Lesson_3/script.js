'use strict';

const state = {
  sectionIndex: 0,
  timerSeconds: 60 * 60,
  timerInterval: null,
  finalSeconds: 5 * 60,
  finalInterval: null,
  scores: {fluency: new Set(), grammar: new Set(), graph: new Set(), listening: new Set(), global: new Set()}
};

const STORE_KEY = 'cflSutomaLesson3V2';
const sections = [...document.querySelectorAll('.lesson-section')];
const progressBar = document.getElementById('progressBar');
const progressLabel = document.getElementById('progressLabel');
const stepDots = document.getElementById('stepDots');
const toast = document.getElementById('toast');
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const shuffle = arr => [...arr].sort(() => Math.random() - .5);
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const technicalVocab = {
  Engine: [
    ['high-pressure turbine (HPT)','turbine haute pression','The turbine section driven by hot gas immediately downstream of the combustor.','The high-pressure turbine extracts energy from the hot gas flow.'],
    ['high-pressure turbine nozzle','distributeur / aubage directeur HP','The stationary nozzle assembly that conditions and directs flow toward the HPT rotor.','We are reviewing the high-pressure turbine nozzle definition.'],
    ['nozzle guide vane (NGV)','aube directrice / aube de distributeur','A stationary airfoil that guides hot gas into the turbine rotor.','The nozzle guide vanes direct the flow toward the first rotor stage.'],
    ['combustion chamber / combustor','chambre de combustion','The engine section where compressed air and fuel release heat before the turbine.','The HPT nozzle is located downstream of the combustion chamber.'],
    ['hot section','partie chaude','The high-temperature engine area including combustion and turbine components.','This component operates in the hot section.'],
    ['turbine rotor blade','aube rotor de turbine','A rotating turbine airfoil that extracts energy from the gas flow.','The flow leaving the nozzle reaches the turbine rotor blades.'],
    ['stator / stationary vane','stator / aube fixe','A fixed component used to guide or condition flow.','The nozzle guide vanes are stationary components.'],
    ['turbine stage','étage de turbine','A turbine section commonly described by a stationary vane row and a rotor row.','We are discussing the first high-pressure turbine stage.'],
    ['airfoil','profil aérodynamique','The aerodynamic shape of a blade or vane.','The airfoil geometry influences the gas flow.'],
    ['leading edge','bord d’attaque','The front edge of an airfoil relative to the incoming flow.','The leading edge sees a demanding thermal environment.'],
    ['trailing edge','bord de fuite','The rear edge of an airfoil where flow leaves the profile.','The trailing-edge region needs careful design control.'],
    ['shroud segment','segment de couronne','A stationary segment surrounding turbine blade tips or parts of the gas path.','The shroud segments form part of the hot gas path.'],
    ['casing','carter','The structural outer housing around engine components.','The vane assembly is mounted within the casing.'],
    ['hot gas path','veine chaude / trajet des gaz chauds','The path followed by high-temperature gas through the combustor and turbine.','The component sits directly in the hot gas path.'],
    ['cooling passage','canal de refroidissement','An internal route used to deliver cooling air through a component.','The cooling passage must remain consistent with the design definition.'],
    ['film cooling','refroidissement par film','Cooling in which air forms a protective layer over a hot surface.','Film cooling can help protect hot-section surfaces.']
  ],
  Design: [
    ['technical requirement','exigence technique','A condition or performance criterion that must be satisfied.','The latest definition still needs to meet the technical requirement.'],
    ['design definition','définition de conception','The controlled technical description of the component design.','We are consolidating the latest design definition.'],
    ['drawing package','dossier de plans','The set of controlled drawings needed to define or release a component.','The updated drawing package is being reviewed.'],
    ['revision / issue','révision / indice','A controlled version of a technical document or drawing.','Please confirm which drawing revision you are using.'],
    ['configuration','configuration','The defined combination and revision state of product elements.','All sites need to work from the same configuration.'],
    ['interface','interface','A boundary or connection between components, systems or teams.','We need to confirm the mechanical interface.'],
    ['tolerance','tolérance','The permitted variation around a specified dimension or value.','This dimension is close to the tolerance limit.'],
    ['clearance','jeu','The designed gap between neighbouring components or surfaces.','We need to verify the clearance before release.'],
    ['design margin','marge de conception','The difference between expected performance and a limit or requirement.','The review will confirm whether sufficient design margin remains.'],
    ['assumption','hypothèse','A condition accepted as true for analysis until confirmed.','We need to validate the main thermal assumptions.'],
    ['analysis result','résultat d’analyse','A result produced by engineering calculation or simulation.','The revised analysis results came in yesterday.'],
    ['verification','vérification','Confirmation that specified requirements have been met.','The next step is verification against the requirement.'],
    ['validation','validation','Confirmation that the solution is suitable for its intended use or purpose.','The validation activity is planned for next week.'],
    ['design review','revue de conception','A structured review of design maturity, risks and decisions.','We will present the open points at the design review.'],
    ['root cause','cause racine','The underlying cause of a problem rather than a symptom.','The team is still investigating the root cause.'],
    ['design change','modification de conception','A controlled modification to the technical definition.','The design change must be assessed before release.']
  ],
  Manufacturing: [
    ['casting','fonderie / pièce moulée','A manufacturing process in which material is formed in a mould.','The component starts from a complex casting.'],
    ['machining','usinage','Material-removal operations used to achieve final geometry.','The machining sequence is being reviewed.'],
    ['coating','revêtement','A protective or functional surface layer applied to a component.','The coating process is part of the manufacturing route.'],
    ['thermal barrier coating (TBC)','barrière thermique','A coating system used to reduce heat reaching a hot-section substrate.','The coating condition is included in the inspection criteria.'],
    ['inspection','contrôle / inspection','A check used to verify product condition or conformity.','The component will go through final inspection.'],
    ['dimensional check','contrôle dimensionnel','A measurement check against drawing dimensions and tolerances.','The dimensional check identified one area to review.'],
    ['non-conformance','non-conformité','A condition that does not meet a specified requirement.','A non-conformance was raised during inspection.'],
    ['deviation / waiver','dérogation','Authorised acceptance of a departure from a requirement under defined conditions.','The team is assessing whether a deviation is acceptable.'],
    ['rework','retouche / reprise','Additional work performed to bring a part back into conformity.','The part may require rework before release.'],
    ['scrap','rebut','Material or parts that cannot be accepted for intended use.','Our goal is to reduce the scrap rate.'],
    ['yield','rendement de production','The proportion of units that meet requirements without rejection.','Manufacturing yield has improved this quarter.'],
    ['supplier','fournisseur','An external or internal organisation supplying parts, material or services.','We are waiting for the supplier data.'],
    ['lead time','délai d’approvisionnement / fabrication','The elapsed time required to obtain or complete an item.','The current lead time creates a schedule risk.'],
    ['release / approval','libération / approbation','Formal authorisation for a document, design or product to move forward.','We need approval before the package can be released.']
  ],
  Programme: [
    ['workstream','lot / axe de travail','A defined stream of activities within a larger programme.','I coordinate several technical workstreams.'],
    ['milestone','jalon','A significant planned point or achievement in the schedule.','The next milestone is the international review.'],
    ['deliverable','livrable','An agreed output that must be provided by a team or owner.','The drawing package is the key deliverable this week.'],
    ['action item','action à réaliser','A specific task agreed during a meeting or review.','We closed three action items since last week.'],
    ['action owner','responsable de l’action','The person or team accountable for completing an action.','Let’s confirm the action owner before we close.'],
    ['due date','date d’échéance','The date by which an action or deliverable must be completed.','The due date is Thursday afternoon.'],
    ['open point','point ouvert','A question, issue or action that has not yet been resolved.','Two open points remain before validation.'],
    ['dependency','dépendance','A task or outcome that relies on another activity.','The test has a dependency on the drawing release.'],
    ['critical path','chemin critique','The chain of activities that determines the earliest completion date.','This activity is now on the critical path.'],
    ['schedule risk','risque planning','A risk that could delay planned dates or milestones.','Late analysis is becoming a schedule risk.'],
    ['on track','dans les temps / sur la bonne voie','Progressing according to plan.','Overall, the programme remains on track.'],
    ['behind schedule','en retard sur le planning','Later than the planned schedule.','One workstream is currently behind schedule.'],
    ['escalate','faire remonter','To raise an issue to a higher decision level.','We may need to escalate the resource issue.'],
    ['align / alignment','aligner / alignement','To create shared understanding of priorities, decisions and actions.','The kickoff should align all teams on the next steps.'],
    ['technical baseline','référence technique','The agreed controlled technical state used as a common reference.','All sites need the same technical baseline.'],
    ['decision request','demande de décision','A clear statement of the decision or support required from an audience.','Make the decision request explicit on the final slide.']
  ]
};

const graphVocab = {
  GraphAnatomy: [
    ['x-axis','axe horizontal / axe des abscisses','The horizontal axis, often used for time or categories.','The x-axis shows the months from June to October.'],
    ['y-axis','axe vertical / axe des ordonnées','The vertical axis, often used for a numerical measure.','The y-axis represents programme readiness.'],
    ['data series','série de données','A related set of values shown together on a graph.','The gold data series represents actual readiness.'],
    ['data point','point de données','One individual value shown on a graph.','The September data point is 82 percent.'],
    ['legend / key','légende','The part of a chart explaining symbols, lines or colours.','The legend distinguishes actuals from the target.'],
    ['scale','échelle','The numerical intervals used on an axis.','Check the scale before comparing the two charts.'],
    ['baseline','valeur de référence','A starting reference used for comparison.','June is our baseline for this presentation.'],
    ['trendline','courbe de tendance','A line showing the general direction of a data series.','The trendline shows steady improvement.'],
    ['outlier','valeur aberrante','A data point noticeably different from the overall pattern.','August looks like an outlier and needs explanation.'],
    ['range','plage / étendue','The span between lower and upper values.','The data range is relatively narrow.']
  ],
  GraphTrends: [
    ['increase / rise','augmenter / hausse','To move to a higher value.','Readiness increased steadily.'],
    ['decrease / fall','diminuer / baisse','To move to a lower value.','The number of open issues fell in September.'],
    ['dip','petite baisse temporaire','A short or relatively small decrease.','There was a slight dip in July.'],
    ['recover','se redresser','To improve again after a decline.','The figures recovered quickly after the dip.'],
    ['remain stable','rester stable','To show little or no meaningful movement.','The schedule remained broadly stable.'],
    ['level off','se stabiliser','To stop increasing or decreasing significantly.','The curve levelled off in September.'],
    ['plateau','palier / plateau','A period where values remain at a similar level.','The data reached a plateau during the summer.'],
    ['fluctuate','fluctuer','To move up and down repeatedly.','Supplier lead time fluctuated during the quarter.'],
    ['peak','pic / maximum','The highest point in a period.','Readiness reached a peak in October.'],
    ['trough / low point','creux / point bas','The lowest point in a period.','July was the low point of the series.'],
    ['gradually','progressivement','Changing slowly over time.','The value increased gradually.'],
    ['steadily','régulièrement','Changing consistently in one direction.','Readiness rose steadily from June onwards.'],
    ['sharply','fortement / brusquement','Changing quickly and by a large amount.','The defect rate fell sharply.'],
    ['slightly','légèrement','Changing by a small amount.','We were slightly below target in September.']
  ],
  GraphTarget: [
    ['target','objectif / cible','The planned or desired result.','Our October target is 85 percent.'],
    ['actuals','réalisé / données réelles','The real measured results, compared with plan or forecast.','The actuals are shown by the solid line.'],
    ['forecast','prévision','An estimate of a future result.','The forecast suggests we will remain above target.'],
    ['variance','écart','The difference between actual and planned or expected values.','The variance to target was three percentage points.'],
    ['gap','écart','A difference between two values or levels.','The gap to target narrowed in September.'],
    ['above target','au-dessus de l’objectif','Higher than the target value.','October readiness is four percentage points above target.'],
    ['below target','en dessous de l’objectif','Lower than the target value.','September was three percentage points below target.'],
    ['meet the target','atteindre l’objectif','To reach the planned value.','We met the target in October.'],
    ['exceed the target','dépasser l’objectif','To perform above the planned value.','The latest figure exceeds the target.'],
    ['miss the target','ne pas atteindre l’objectif','To finish below the planned value.','We missed the September target by three percentage points.'],
    ['percentage point','point de pourcentage','The arithmetic difference between two percentage values.','82 percent to 85 percent is a three-percentage-point gap.'],
    ['increase by / increase to','augmenter de / augmenter à','Use “by” for the amount of change and “to” for the final value.','Readiness increased by seven points, from 75 to 82 percent.']
  ],
  GraphPresentation: [
    ['Let me walk you through…','Laissez-moi vous présenter…','A natural phrase for guiding an audience through information.','Let me walk you through the main changes shown here.'],
    ['If you look at…','Si vous regardez…','A phrase used to direct attention to a part of a visual.','If you look at the September point, we were just below target.'],
    ['Overall, we can see…','Globalement, on peut voir…','A phrase for stating the general pattern first.','Overall, we can see a clear upward trend.'],
    ['The key takeaway is…','Le message principal est…','A phrase for the conclusion the audience should remember.','The key takeaway is that the gap has been closed.'],
    ['The most important change is…','Le changement le plus important est…','A phrase for selecting one meaningful movement.','The most important change is the improvement since August.'],
    ['Compared with…','Par rapport à…','A phrase for comparing one period, group or value with another.','Compared with June, readiness is 28 points higher.'],
    ['From … onwards…','À partir de…','A phrase for describing a trend beginning at a point in time.','From August onwards, the improvement accelerated.'],
    ['This suggests that…','Cela suggère que…','A phrase for interpreting what the data may mean.','This suggests that the current actions are having an effect.'],
    ['However, we should keep in mind…','Cependant, il faut garder à l’esprit…','A phrase for adding caution or nuance.','However, we should keep in mind that two critical actions remain open.'],
    ['What matters most is…','Ce qui compte surtout est…','A phrase for prioritising the message.','What matters most is that the critical path remains protected.'],
    ['Based on this trend, I recommend…','Sur la base de cette tendance, je recommande…','A phrase connecting data to a recommendation.','Based on this trend, I recommend keeping the current review plan.'],
    ['What I need today is…','Ce dont j’ai besoin aujourd’hui est…','A clear phrase for a decision or alignment request.','What I need today is confirmation of the remaining priorities.']
  ]
};

const quizSets = {
  fluency: [
    {q:'You cannot remember “nozzle guide vane”. What is the strongest response?', options:['Sorry, I don’t know the word.','It’s the stationary component that guides the hot gas into the turbine — I’ll come back to the exact term.','Wait. My English is difficult.'], a:'It’s the stationary component that guides the hot gas into the turbine — I’ll come back to the exact term.', why:'Describe the function and keep the message moving.'},
    {q:'A colleague asks about “readiness”, but you do not know whether they mean technical or schedule readiness.', options:['Can you repeat everything?','Just to clarify, are you referring to technical readiness or schedule readiness?','Yes, exactly.'], a:'Just to clarify, are you referring to technical readiness or schedule readiness?', why:'Clarify the ambiguous concept, not the whole question.'},
    {q:'You need three seconds to organise a technical answer.', options:['That’s a good question. Let me think about the best way to put that.','I have no idea how to explain.','Please wait for my English.'], a:'That’s a good question. Let me think about the best way to put that.', why:'It buys time while sounding controlled.'},
    {q:'Your first explanation was too technical for the audience.', options:['Forget what I said.','What I mean is, this component controls how the hot gas enters the turbine.','It is too complicated to explain.'], a:'What I mean is, this component controls how the hot gas enters the turbine.', why:'Reformulate with function-based language.'}
  ],
  grammar: [
    {q:'The latest drawing package ___ at the moment.', options:['is reviewing','is being reviewed','has reviewed'], a:'is being reviewed', why:'Present continuous passive = is/are being + past participle.'},
    {q:'Three action items ___ since last week.', options:['have been closed','were being close','have closed by themselves'], a:'have been closed', why:'Present perfect passive for completed progress connected to now.'},
    {q:'The issue ___ during the thermal review yesterday.', options:['was identified','is identified yesterday','has been identify'], a:'was identified', why:'Past passive with a finished past time.'},
    {q:'The gas flow ___ through the stationary vanes before it reaches the rotor.', options:['is directed','is directing','has direct'], a:'is directed', why:'Present passive for a general technical process.'},
    {q:'The validation run ___ in Mexico next week.', options:['will be supported','will supporting','is support'], a:'will be supported', why:'Future passive = will be + past participle.'},
    {q:'Which sentence is better when the action owner matters?', options:['The updated package will be sent by 3 p.m.','The Mexico team will send the updated package by 3 p.m.','The package is being somewhere.'], a:'The Mexico team will send the updated package by 3 p.m.', why:'Use active voice when ownership and accountability matter.'}
  ],
  graph: [
    {q:'Readiness moved from 75% to 82%. Which sentence describes the amount of change?', options:['Readiness increased by 7 percentage points.','Readiness increased to 7 percentage points.','Readiness increased from 7.'], a:'Readiness increased by 7 percentage points.', why:'“By” gives the amount of change.'},
    {q:'September actual = 82%; target = 85%.', options:['We were three percentage points below target.','We were three percent to target.','We increased target by 82.'], a:'We were three percentage points below target.', why:'Difference between two percentages = percentage points.'},
    {q:'What is the best opening for a graph?', options:['I will read every number.','This chart compares programme readiness with our October target.','The graph is beautiful.'], a:'This chart compares programme readiness with our October target.', why:'Orient the audience before discussing detail.'},
    {q:'The figures rise consistently over several months.', options:['They fluctuated wildly.','They increased steadily.','They remained flat.'], a:'They increased steadily.', why:'“Steadily” describes consistent movement in one direction.'},
    {q:'Which phrase turns data into an executive message?', options:['The key takeaway is that the gap has now been closed.','September is September.','The axis has numbers.'], a:'The key takeaway is that the gap has now been closed.', why:'A presentation needs interpretation, not just description.'}
  ],
  listening: [
    {q:'How many of last week’s five action items are now closed?', options:['Two','Three','Five'], a:'Three', why:'The speaker says three of the five actions were closed.'},
    {q:'Why did the thermal review move from Tuesday to Thursday?', options:['The supplier cancelled the meeting.','The revised analysis arrived late.','Mexico asked for more time.'], a:'The revised analysis arrived late.', why:'The delay is linked to the revised analysis.'},
    {q:'What condition must be met for Mexico to support the validation run?', options:['They must receive the updated drawing package by 3 p.m. Central tomorrow.','Leadership must approve ten more slides.','The supplier variation must be zero.'], a:'They must receive the updated drawing package by 3 p.m. Central tomorrow.', why:'“Provided they receive…” introduces the condition.'},
    {q:'What variation is mentioned in the supplier data?', options:['18%','1.8%','0.18%'], a:'1.8%', why:'The speaker says one-point-eight percent.'},
    {q:'How serious is the supplier variation right now?', options:['It is an immediate stop-work issue.','It is not a stop-work issue, but engineering should confirm the trend.','It has already been ignored.'], a:'It is not a stop-work issue, but engineering should confirm the trend.', why:'The speaker distinguishes “not critical now” from “needs confirmation”.'},
    {q:'What should happen to the kickoff deck?', options:['Add ten technical slides.','Keep the main chart, show movement since June, and make the leadership decision explicit.','Remove all charts.'], a:'Keep the main chart, show movement since June, and make the leadership decision explicit.', why:'The speaker wants a concise, decision-oriented deck.'},
    {q:'What is the implied communication problem the speaker wants to avoid?', options:['Waiting until Thursday to raise a known risk.','Speaking too slowly.','Using British English.'], a:'Waiting until Thursday to raise a known risk.', why:'The instruction is to flag risk today instead of waiting.'},
    {q:'Which summary best captures the overall update?', options:['Everything is complete and there are no risks.','Progress is positive, but timing and dependencies still require active management.','The programme should stop immediately.'], a:'Progress is positive, but timing and dependencies still require active management.', why:'This combines progress with remaining schedule and coordination risk.'}
  ],
  global: [
    {q:'Which action is clearest across time zones?', options:['Send it tomorrow afternoon.','Could you send the updated package by 3 p.m. Central tomorrow?','Send it when you can.'], a:'Could you send the updated package by 3 p.m. Central tomorrow?', why:'It specifies deliverable, deadline and time zone.'},
    {q:'Which closing question confirms ownership?', options:['So… okay?','Can we confirm that the Mexico team owns this action?','Somebody will do it, right?'], a:'Can we confirm that the Mexico team owns this action?', why:'The owner is explicit.'},
    {q:'Which sentence makes a dependency clear?', options:['The validation can start provided the updated package is released on time.','Things depend on things.','Maybe the validation is possible.'], a:'The validation can start provided the updated package is released on time.', why:'It expresses the condition and the consequence.'},
    {q:'A risk could affect the critical path. What should you say?', options:['Let’s wait and see.','I’d like to flag a schedule risk before we move on.','It is probably fine.'], a:'I’d like to flag a schedule risk before we move on.', why:'Flagging it early makes the risk explicit and actionable.'}
  ]
};

const finalQuestions = [
  {q:'“What is the biggest risk to the October plan right now?”', model:'“The biggest risk is the dependency between the remaining analysis and the drawing release. At the moment, it is manageable, but if the analysis slips, it could affect the validation sequence. Our next step is to close those points before the next review.”'},
  {q:'“Why are you confident the current trend will continue?”', model:'“I would not say there is zero risk, but the trend is supported by the actions already closed and by improved alignment between the teams. The next milestone will give us another objective check before we commit to the final plan.”'},
  {q:'“What decision do you need from us today?”', model:'“What I need today is confirmation that we keep the current review sequence and that the remaining priorities are aligned across all sites. That will allow each team to work to the same plan and protect the validation schedule.”'},
  {q:'“If one site misses its deadline, what will you do?”', model:'“First, I would confirm the impact on the critical path. If the delay affects validation or another team’s deliverable, I would escalate it early, agree a recovery action and make sure the new owner and deadline are explicit.”'}
];

const listeningText = "Quick update before we move on. We closed three of the five open action items from last week, but the thermal review has slipped from Tuesday to Thursday because the revised analysis came in late. The Mexico team can still support the validation run, provided they receive the updated drawing package by three p.m. Central tomorrow. One more thing: the latest supplier data shows a one-point-eight percent variation, which is not a stop-work issue, but I do want engineering to confirm the trend before Friday. For the kickoff deck, please don't add another ten slides. Keep the main chart, show the movement since June, and make the decision we need from leadership explicit. If anyone sees a risk to that plan, flag it today rather than waiting for the Thursday review.";

function init(){
  createStepDots(); bindNavigation(); bindHeader(); bindTimer(); bindGlobalClicks(); renderAllVocab(); renderAllQuizzes(); renderFinalQuestions(); bindGraphBuilder(); bindListening(); bindTechnicalRetrieval(); bindKickoffBuilder(); bindFinalTimer(); bindRecorder(); bindBilan(); bindSaveReset(); setDateStamp(); restoreSession(); updateGraphOutput(); updateScores(); showSection(0);
}
document.addEventListener('DOMContentLoaded', init);

function createStepDots(){
  stepDots.innerHTML='';
  sections.forEach((section,index)=>{const b=document.createElement('button');b.type='button';b.setAttribute('aria-label',`${index+1}. ${section.dataset.title}`);b.title=section.dataset.title;b.innerHTML=`<span>${index+1}</span>`;b.addEventListener('click',()=>showSection(index));stepDots.appendChild(b);});
}
function bindNavigation(){
  $$('[data-next]').forEach(b=>b.addEventListener('click',()=>showSection(Math.min(state.sectionIndex+1,sections.length-1))));
  $$('[data-prev]').forEach(b=>b.addEventListener('click',()=>showSection(Math.max(state.sectionIndex-1,0))));
}
function showSection(index){state.sectionIndex=index;sections.forEach((s,i)=>s.classList.toggle('active',i===index));updateProgress();window.scrollTo({top:0,behavior:'smooth'});}
function updateProgress(){const pct=((state.sectionIndex+1)/sections.length)*100;progressBar.style.width=`${pct}%`;progressLabel.textContent=sections[state.sectionIndex]?.dataset.title||'';[...stepDots.children].forEach((d,i)=>d.classList.toggle('active',i===state.sectionIndex));}
function bindHeader(){
  const toggle=$('#translationToggle');toggle?.addEventListener('click',()=>{const show=document.body.classList.toggle('show-fr');toggle.classList.toggle('active',show);toggle.setAttribute('aria-pressed',String(show));toggle.querySelector('span:last-child').textContent=show?'Traductions visibles':'Afficher les traductions';saveSession(false);});
}
function bindTimer(){
  $('#timerStart')?.addEventListener('click',()=>{if(state.timerInterval)return;state.timerInterval=setInterval(()=>{state.timerSeconds=Math.max(0,state.timerSeconds-1);updateTimer();if(state.timerSeconds===0)pauseTimer();},1000);});
  $('#timerPause')?.addEventListener('click',pauseTimer);$('#timerReset')?.addEventListener('click',()=>{pauseTimer();state.timerSeconds=3600;updateTimer();});updateTimer();
}
function pauseTimer(){if(state.timerInterval)clearInterval(state.timerInterval);state.timerInterval=null;}
function updateTimer(){const m=String(Math.floor(state.timerSeconds/60)).padStart(2,'0'),s=String(state.timerSeconds%60).padStart(2,'0');if($('#sessionTimer'))$('#sessionTimer').textContent=`${m}:${s}`;}

function bindGlobalClicks(){
  document.addEventListener('click',e=>{
    const speakBtn=e.target.closest('.speak-button[data-speak]'); if(speakBtn){speak(speakBtn.dataset.speak);return;}
    const modelBtn=e.target.closest('.model-pressure[data-target]'); if(modelBtn){$('#'+modelBtn.dataset.target)?.classList.toggle('hidden');return;}
    const mini=e.target.closest('.mini-timer-start'); if(mini){startMiniTimer(mini);return;}
  });
}
function startMiniTimer(btn){const display=$('#'+btn.dataset.display);let sec=Number(btn.dataset.seconds||60);if(btn._timer)clearInterval(btn._timer);const draw=()=>display.textContent=`${String(Math.floor(sec/60)).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}`;draw();btn._timer=setInterval(()=>{sec--;draw();if(sec<=0){clearInterval(btn._timer);btn._timer=null;showToast('Time — finish your sentence.');}},1000);}
function speak(text,rate=.96){if(!('speechSynthesis'in window)){showToast('La synthèse vocale n’est pas disponible.');return;}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang=$('#accentSelect')?.value||'en-US';u.rate=rate;const voices=speechSynthesis.getVoices();u.voice=voices.find(v=>v.lang===u.lang)||voices.find(v=>v.lang?.startsWith(u.lang.slice(0,2)))||null;speechSynthesis.speak(u);}

function renderAllVocab(){
  renderVocabSet(technicalVocab.Engine,'#vocabEngine');renderVocabSet(technicalVocab.Design,'#vocabDesign');renderVocabSet(technicalVocab.Manufacturing,'#vocabManufacturing');renderVocabSet(technicalVocab.Programme,'#vocabProgramme');
  renderVocabSet(graphVocab.GraphAnatomy,'#vocabGraphAnatomy');renderVocabSet(graphVocab.GraphTrends,'#vocabGraphTrends');renderVocabSet(graphVocab.GraphTarget,'#vocabGraphTarget');renderVocabSet(graphVocab.GraphPresentation,'#vocabGraphPresentation');
}
function renderVocabSet(items,selector){const root=$(selector);if(!root)return;root.innerHTML=items.map(([term,fr,def,ex])=>`<article><strong>${esc(term)}</strong><em>${esc(fr)}</em><p>${esc(def)}</p><p><b>Example:</b> ${esc(ex)}</p><button class="mini-button speak-button" data-speak="${esc(term)}. ${esc(ex)}" type="button">🔊 Listen</button></article>`).join('');}
function bindTechnicalRetrieval(){
  $('#randomTechnical')?.addEventListener('click',()=>{const cat=$('#retrievalCategory').value;const pool=technicalVocab[cat]||[];const picks=shuffle(pool).slice(0,3);$('#technicalPrompts').innerHTML=picks.map(x=>`<span>${esc(x[0])}</span>`).join('');});
}

function renderAllQuizzes(){renderQuiz('fluencyQuiz',quizSets.fluency,'fluency');renderQuiz('passiveQuiz',quizSets.grammar,'grammar');renderQuiz('graphQuiz',quizSets.graph,'graph');renderQuiz('listeningQuiz',quizSets.listening,'listening');renderQuiz('globalQuiz',quizSets.global,'global');}
function renderQuiz(id,items,key){const root=$('#'+id);if(!root)return;const intro=id==='passiveQuiz'?root.innerHTML:'';root.innerHTML=intro+items.map((item,i)=>{const opts=shuffle(item.options);return `<div class="quiz-item" data-key="${key}" data-index="${i}"><p><strong>${i+1}.</strong> ${esc(item.q)}</p><div>${opts.map(o=>`<button type="button" data-answer="${esc(o)}">${esc(o)}</button>`).join('')}</div><span class="quiz-feedback"></span></div>`}).join('');root.querySelectorAll('.quiz-item button').forEach(btn=>btn.addEventListener('click',handleQuiz));}
function handleQuiz(e){const btn=e.currentTarget,item=btn.closest('.quiz-item'),key=item.dataset.key,index=Number(item.dataset.index),data=quizSets[key][index],correct=btn.dataset.answer===data.a;item.querySelectorAll('button').forEach(b=>b.classList.remove('is-correct','is-wrong'));btn.classList.add(correct?'is-correct':'is-wrong');const fb=item.querySelector('.quiz-feedback');fb.className='quiz-feedback '+(correct?'correct':'wrong');fb.textContent=correct?`✓ Correct. ${data.why}`:`✗ Try again. Hint: ${data.why}`;if(correct)state.scores[key].add(index);else state.scores[key].delete(index);updateScores();saveSession(false);}
function updateScores(){const config={fluency:['scoreFluency',4,'FluencyQuiz'],grammar:['scoreGrammar',6,'Grammar'],graph:['scoreGraph',5,'GraphQuiz'],listening:['scoreListening',8,'Listening'],global:['scoreGlobal',4,'Global']};Object.entries(config).forEach(([key,[id,total,skill]])=>{const score=state.scores[key].size,set=$('#'+id);if(set){set.textContent=`${score} / ${total}`;set.classList.remove('good','mid');if(score===total)set.classList.add('good');else if(score>0)set.classList.add('mid');}autoStatus(skill,score,total);});}
function autoStatus(skill,score,total){const sel=$(`.status-select[data-skill="${skill}"]`);if(!sel||sel.dataset.manual==='true')return;if(score===0)sel.value='Non commencé';else if(score/total>=.8)sel.value='Acquis';else sel.value='En cours';}

function bindGraphBuilder(){$$('#graphBuilder select').forEach(s=>s.addEventListener('change',()=>{updateGraphOutput();saveSession(false);}));$('#speakGraphOutput')?.addEventListener('click',()=>speak($('#graphOutput').textContent));$('#copyGraphOutput')?.addEventListener('click',()=>copyText($('#graphOutput').textContent,'Commentaire copié.'));}
function updateGraphOutput(){const values=$$('#graphBuilder select').map(s=>s.value);if($('#graphOutput'))$('#graphOutput').textContent=values.join(' ');}

function bindListening(){$('#listenNormal')?.addEventListener('click',()=>speak(listeningText,1.02));$('#listenFast')?.addEventListener('click',()=>speak(listeningText,1.17));$('#revealTranscript')?.addEventListener('click',()=>$('#listenTranscript')?.classList.toggle('hidden'));}

function bindKickoffBuilder(){$('#assembleKickoff')?.addEventListener('click',()=>{const blocks=[1,2,3,4,5,6].map(n=>$('#kickoff'+n)?.value.trim()||'(add cue words)');const labels=['0:00–0:30 · Open & purpose','0:30–1:15 · Programme context','1:15–2:10 · Technical focus','2:10–3:20 · Graph story','3:20–4:20 · Risks & actions','4:20–5:00 · Close & decision'];$('#kickoffNotesOutput').textContent=blocks.map((b,i)=>`${labels[i]}\n${b}`).join('\n\n');saveSession(false);});$('#copyKickoffNotes')?.addEventListener('click',()=>copyText($('#kickoffNotesOutput')?.textContent||'','Cue sheet copied.'));$('#copyFullKickoff')?.addEventListener('click',()=>{const text=$$('.model-timeline section').map(s=>s.querySelector('p')?.textContent.trim()).join('\n\n');copyText(text,'Full model copied.');});}
function bindFinalTimer(){$('#startFinalTimer')?.addEventListener('click',()=>{if(state.finalInterval)return;state.finalInterval=setInterval(()=>{state.finalSeconds=Math.max(0,state.finalSeconds-1);updateFinalTimer();if(state.finalSeconds===0){clearInterval(state.finalInterval);state.finalInterval=null;showToast('5 minutes — presentation complete.');}},1000);});$('#resetFinalTimer')?.addEventListener('click',()=>{if(state.finalInterval)clearInterval(state.finalInterval);state.finalInterval=null;state.finalSeconds=300;updateFinalTimer();});updateFinalTimer();}
function updateFinalTimer(){const m=String(Math.floor(state.finalSeconds/60)).padStart(2,'0'),s=String(state.finalSeconds%60).padStart(2,'0');if($('#finalTimer'))$('#finalTimer').textContent=`${m}:${s}`;}
function renderFinalQuestions(){const root=$('#finalQuestions');if(!root)return;root.innerHTML=finalQuestions.map((x,i)=>`<article class="pressure-card"><span class="q-type">Q${i+1}</span><h3>${esc(x.q)}</h3><div class="answer-frame">Answer → Evidence → Next step</div><textarea id="finalQ${i+1}" placeholder="3 cue words + answer..." rows="4"></textarea><div class="pressure-tools"><button class="mini-button speak-button" data-speak="${esc(x.q.replace(/[“”]/g,''))}" type="button">🔊 Question</button><button class="mini-button model-pressure" data-target="finalQModel${i}" type="button">Model</button></div><div class="model-box hidden" id="finalQModel${i}"><p>${esc(x.model)}</p></div></article>`).join('');}


function bindRecorder(){
  const start=$('#startRecording'), stop=$('#stopRecording'), audio=$('#recordingPlayback'), download=$('#downloadRecording'), status=$('#recordingStatus');
  if(!start||!stop||!audio||!download)return;
  let recorder=null,chunks=[],stream=null,url='';
  start.addEventListener('click',async()=>{try{stream=await navigator.mediaDevices.getUserMedia({audio:true});chunks=[];recorder=new MediaRecorder(stream);recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};recorder.onstop=()=>{const blob=new Blob(chunks,{type:recorder.mimeType||'audio/webm'});if(url)URL.revokeObjectURL(url);url=URL.createObjectURL(blob);audio.src=url;download.href=url;download.classList.remove('disabled');status.textContent='Recording ready. Listen once for structure, then record a second attempt.';stream?.getTracks().forEach(t=>t.stop());};recorder.start();start.disabled=true;stop.disabled=false;status.textContent='Recording…';}catch(err){status.textContent='Microphone access is required. On GitHub Pages, allow microphone permission in the browser.';}});
  stop.addEventListener('click',()=>{if(recorder&&recorder.state!=='inactive'){recorder.stop();start.disabled=false;stop.disabled=true;}});
}

function bindBilan(){$$('.status-select').forEach(s=>s.addEventListener('change',()=>{s.dataset.manual='true';saveSession(false);}));const slider=$('#confidenceSlider');slider?.addEventListener('input',()=>{$('#confidenceValue').textContent=`${slider.value} / 10`;saveSession(false);});$('#copyBilan')?.addEventListener('click',()=>copyText(buildBilan(),'Bilan copié.'));$('#downloadBilan')?.addEventListener('click',()=>{downloadBlob('Sutoma-Lesson-3-Qualiopi-Progress.txt',buildBilan(),'text/plain;charset=utf-8');setBilanStatus('Bilan téléchargé.');});}
function collectStatuses(){return $$('.status-select').map(s=>({skill:s.dataset.skill,status:s.value}));}
function buildBilan(){const status=collectStatuses().map(x=>`${x.skill}: ${x.status}`).join('\n');return `BILAN DE PROGRESSION — SUTOMA — LEÇON 3\n${$('#dateStamp')?.textContent||''}\n\nOBJECTIF\nExplain technical work, present graph data, understand faster project English and rehearse a structured 5-minute October kickoff update.\n\nRÉSULTATS AUTOMATIQUES\nFluency choices: ${state.scores.fluency.size} / 4\nPassive grammar: ${state.scores.grammar.size} / 6\nGraph precision: ${state.scores.graph.size} / 5\nHard listening: ${state.scores.listening.size} / 8\nGlobal collaboration: ${state.scores.global.size} / 4\n\nSTATUTS\n${status}\n\nPOINTS FORTS\n${$('#strengthsInput')?.value.trim()||'Non renseigné'}\n\nAXES À RENFORCER\n${$('#focusInput')?.value.trim()||'Non renseigné'}\n\nPRIORITÉ DU PROCHAIN COURS\n${$('#nextLessonInput')?.value.trim()||'Non renseigné'}\n\nCONFIANCE\n${$('#confidenceSlider')?.value||'5'} / 10\n\nHOMEWORK\nPodcast shadowing: ${$('#hw1')?.checked?'Completed':'Not completed'}\nTechnical voice note: ${$('#hw2')?.checked?'Completed':'Not completed'}\nGraph commentary: ${$('#hw3')?.checked?'Completed':'Not completed'}\nKickoff rehearsal: ${$('#hw4')?.checked?'Completed':'Not completed'}`;}
function setBilanStatus(message){if($('#bilanStatus'))$('#bilanStatus').textContent=message;showToast(message);}

function bindSaveReset(){$('#saveSession')?.addEventListener('click',()=>saveSession(true));$('#resetSession')?.addEventListener('click',()=>{if(confirm('Réinitialiser la Leçon 3 ?')){localStorage.removeItem(STORE_KEY);location.reload();}});$$('input,textarea,select').forEach(el=>{if(el.id==='accentSelect'||el.classList.contains('status-select'))return;el.addEventListener(el.type==='checkbox'?'change':'input',()=>saveSession(false));});$('#accentSelect')?.addEventListener('change',()=>saveSession(false));}
function saveSession(show=true){const fields={};$$('input[type="text"],textarea,select').forEach(el=>{if(el.id)fields[el.id]=el.value;});const checks={};$$('input[type="checkbox"]').forEach(el=>{if(el.id)checks[el.id]=el.checked;});const statuses=collectStatuses();const scores={};Object.keys(state.scores).forEach(k=>scores[k]=[...state.scores[k]]);const data={fields,checks,statuses,scores,showFr:document.body.classList.contains('show-fr'),graph:$$('#graphBuilder select').map(s=>s.value)};try{localStorage.setItem(STORE_KEY,JSON.stringify(data));if(show)setBilanStatus('Séance enregistrée dans ce navigateur.');}catch(e){if(show)setBilanStatus('Enregistrement local indisponible.');}}
function restoreSession(){try{const raw=localStorage.getItem(STORE_KEY);if(!raw)return;const d=JSON.parse(raw);Object.entries(d.fields||{}).forEach(([id,v])=>{const el=$('#'+CSS.escape(id));if(el)el.value=v;});Object.entries(d.checks||{}).forEach(([id,v])=>{const el=$('#'+CSS.escape(id));if(el)el.checked=Boolean(v);});(d.statuses||[]).forEach(x=>{const s=$(`.status-select[data-skill="${x.skill}"]`);if(s){s.value=x.status;s.dataset.manual='true';}});Object.keys(state.scores).forEach(k=>state.scores[k]=new Set(d.scores?.[k]||[]));if(d.showFr===false){document.body.classList.remove('show-fr');const t=$('#translationToggle');t?.classList.remove('active');if(t)t.querySelector('span:last-child').textContent='Afficher les traductions';}if(d.graph){$$('#graphBuilder select').forEach((el,i)=>{if(d.graph[i]!==undefined)el.value=d.graph[i];});updateGraphOutput();}if($('#confidenceSlider'))$('#confidenceValue').textContent=`${$('#confidenceSlider').value} / 10`;updateScores();}catch(e){} }

function setDateStamp(){if($('#dateStamp'))$('#dateStamp').textContent=new Intl.DateTimeFormat('fr-FR',{dateStyle:'long'}).format(new Date());}
function copyText(text,message){if(navigator.clipboard?.writeText)navigator.clipboard.writeText(text).then(()=>showToast(message)).catch(()=>fallbackCopy(text,message));else fallbackCopy(text,message);}
function fallbackCopy(text,message){const ta=document.createElement('textarea');ta.value=text;document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();showToast(message);}
function downloadBlob(filename,content,type){const blob=new Blob([content],{type});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),500);}
function showToast(message){if(!toast)return;toast.textContent=message;toast.classList.add('show');clearTimeout(showToast.t);showToast.t=setTimeout(()=>toast.classList.remove('show'),2200);}
