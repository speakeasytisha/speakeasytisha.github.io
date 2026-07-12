(() => {
  'use strict';

  const destinations = {
    nantucket: {
      name: 'Nantucket',
      category: 'island',
      icon: '⛵',
      tag: 'Island charm',
      location: 'on an island in Massachusetts, south of Cape Cod',
      known: 'harbour views, grey shingle houses, lighthouses and a calm New England atmosphere',
      adjectives: ['quiet', 'charming', 'coastal', 'elegant'],
      reason: 'it feels calm, elegant and very different from a big city',
      comparative: 'quieter than Key West',
      superlative: 'the most peaceful option',
      images: [
        {src:'images/nantucket-town.jpg', alt:'Nantucket harbour and waterfront houses', caption:'Real image · Nantucket harbour atmosphere'},
        {src:'images/nantucket-hotel.jpg', alt:'White Elephant Hotel postcard in Nantucket', caption:'Real image · Classic Nantucket hotel mood'}
      ],
      placeWords: [
        ['harbour','port','a protected place for boats','The harbour looks peaceful.','⚓'],
        ['lighthouse','phare','a tall light tower near the sea','I want to see the lighthouse.','💡'],
        ['shingle house','maison en bardeaux','a house with wooden shingles','The shingle houses look charming.','🏠']
      ],
      quickFacts: [
        'You can reach Nantucket by ferry or by air.',
        'Brant Point is a famous place to watch boats and ferries.',
        'The Whaling Museum is one of the best-known sights.'
      ],
      transportTitle: 'Real transport',
      transportText: 'The Town of Nantucket lists ferry and air connections. Steamship Authority runs the main ferry service to Nantucket.',
      transportLinks: [
        ['Town travel page', 'https://www.nantucket-ma.gov/776/Traveling-to-Nantucket'],
        ['Steamship Authority ferries', 'https://www.steamshipauthority.com/visitors/nantucket']
      ],
      sightsTitle: 'Real sights',
      sightsText: 'The Whaling Museum and Brant Point are classic Nantucket visits.',
      sightsLinks: [
        ['Whaling Museum', 'https://nha.org/visit/museums-and-tours/whaling-museum/'],
        ['Brant Point', 'https://www.nantucket-ma.gov/3680/Brant-Point']
      ],
      hotelTitle: 'Real stay idea',
      hotelText: 'Nantucket offers practical inns and iconic harbour hotels.',
      hotelLinks: [
        ['The Nantucket Inn', 'https://www.nantucketinn.net/'],
        ['White Elephant', 'https://www.whiteelephantnantucket.com/']
      ],
      transportOptions: [
        {value:'take the ferry from Hyannis', reason:'it feels special and relaxing'},
        {value:'fly from Boston to Nantucket', reason:'it is faster and more direct'}
      ],
      activityOptions: ['walk by the harbour', 'visit the Whaling Museum', 'see the lighthouse and take photos']
    },
    keywest: {
      name: 'Key West',
      category: 'tropical',
      icon: '🌴',
      tag: 'Tropical colour',
      location: 'in the Florida Keys, in southern Florida',
      known: 'Duval Street, tropical weather, colourful houses, the Southernmost Point and island energy',
      adjectives: ['hot', 'colourful', 'lively', 'sunny'],
      reason: 'it is sunny, colourful and full of energy',
      comparative: 'hotter than Nantucket',
      superlative: 'the most tropical option',
      images: [
        {src:'images/bellamannaro-key-west-6510976_1280.jpg', alt:'Duval Street in Key West', caption:'Real image · Duval Street in Key West'},
        {src:'images/johannesw-bar-542568_1280.jpg', alt:'La Concha Hotel in Key West', caption:'Real image · La Concha Hotel, Key West'}
      ],
      placeWords: [
        ['street','rue','a road in a town or city','Duval Street is lively.','🛣️'],
        ['tropical','tropical','hot and linked to a tropical climate','Key West feels tropical.','🌺'],
        ['sunset','coucher de soleil','the time when the sun goes down','The sunset looks amazing.','🌅']
      ],
      quickFacts: [
        'You can fly to Key West International Airport.',
        'Duval Street is one of the most famous streets on the island.',
        'The Hemingway Home & Museum is open every day.'
      ],
      transportTitle: 'Real transport',
      transportText: 'Key West International Airport is the main airport for the island, and many visitors also drive down from Miami.',
      transportLinks: [
        ['Key West International Airport', 'https://eyw.com/'],
        ['Visit Florida · Key West', 'https://www.visitflorida.com/places-to-go/southeast/key-west/']
      ],
      sightsTitle: 'Real sights',
      sightsText: 'Key West is known for Duval Street, the Hemingway Home & Museum, and the Southernmost Point buoy.',
      sightsLinks: [
        ['Hemingway Home', 'https://www.hemingwayhome.com/'],
        ['Southernmost Point', 'https://www.cityofkeywest-fl.gov/Facilities/Facility/Details/Southernmost-Point-44']
      ],
      hotelTitle: 'Real stay idea',
      hotelText: 'Historic hotels and island-style stays are common in Key West.',
      hotelLinks: [
        ['La Concha Hotel', 'https://www.marriott.com/en-us/hotels/eywak-crowne-plaza-key-west-la-concha/overview/'],
        ['Key West accommodations', 'https://www.visitflorida.com/places-to-go/southeast/key-west/']
      ],
      transportOptions: [
        {value:'fly to Key West', reason:'it is the easiest way to reach the island'},
        {value:'drive from Miami to Key West', reason:'the Overseas Highway is scenic and memorable'}
      ],
      activityOptions: ['walk along Duval Street', 'visit the Hemingway Home', 'watch the sunset by the water']
    },
    charleston: {
      name: 'Charleston, South Carolina',
      category: 'historic',
      icon: '🏛️',
      tag: 'Historic city',
      location: 'in coastal South Carolina',
      known: 'Rainbow Row, elegant streets, historic houses, the City Market and a refined Southern atmosphere',
      adjectives: ['historic', 'elegant', 'romantic', 'charming'],
      reason: 'it feels historic, stylish and romantic',
      comparative: 'more historic than Key West',
      superlative: 'the most elegant option',
      images: [
        {src:'images/charleston-rainbow-row.jpg', alt:'Rainbow Row in Charleston', caption:'Real image · Rainbow Row, Charleston'},
        {src:'images/charleston-hotel.jpg', alt:'Classic hotel mood in Charleston', caption:'Real image · Classic hotel mood in Charleston'}
      ],
      placeWords: [
        ['district','quartier','an area of a city','The historic district is beautiful.','📍'],
        ['market','marché','a place where people buy things','The market is lively.','🛍️'],
        ['historic house','maison historique','an old house with historical value','The historic houses look elegant.','🏠']
      ],
      quickFacts: [
        'You can fly into Charleston International Airport.',
        'Rainbow Row is one of the city’s most photographed landmarks.',
        'Charleston City Market is one of the best-known places in the centre.'
      ],
      transportTitle: 'Real transport',
      transportText: 'Charleston International Airport is the main airport for the city and the official tourism site helps visitors plan a stay.',
      transportLinks: [
        ['Charleston International Airport', 'https://iflychs.com/'],
        ['Charleston visitor planning', 'https://www.charlestoncvb.com/']
      ],
      sightsTitle: 'Real sights',
      sightsText: 'Rainbow Row and Charleston City Market are classic Charleston visits.',
      sightsLinks: [
        ['Charleston City Market', 'https://www.thecharlestoncitymarket.com/'],
        ['Official Charleston site', 'https://www.charlestoncvb.com/']
      ],
      hotelTitle: 'Real stay idea',
      hotelText: 'Charleston offers historic inns, elegant hotels and coastal resorts.',
      hotelLinks: [
        ['Historic inns and hotels', 'https://www.charlestoncvb.com/'],
        ['Francis Marion Hotel', 'https://www.francismarionhotel.com/']
      ],
      transportOptions: [
        {value:'fly to Charleston', reason:'it is practical and direct'},
        {value:'drive from Savannah to Charleston', reason:'it is a pleasant coastal route'}
      ],
      activityOptions: ['visit Rainbow Row', 'walk through the historic district', 'visit the City Market and take photos']
    }
  };

  const vocab = {
    scenery: [
      ['harbour', 'port', 'a place where boats arrive and leave', 'Nantucket has a beautiful harbour.', '⚓'],
      ['lighthouse', 'phare', 'a tall light tower near the sea', 'I want to see the lighthouse.', '💡'],
      ['shore', 'rivage', 'the land next to the sea', 'You can walk along the shore.', '🌊'],
      ['street', 'rue', 'a road in a town or city', 'Duval Street is lively.', '🛣️'],
      ['district', 'quartier', 'an area of a city', 'The market is in the historic district.', '📍'],
      ['view', 'vue', 'what you can see from a place', 'The view is wonderful.', '👀']
    ],
    hotel: [
      ['hotel', 'hôtel', 'a place where you stay when you travel', 'I am going to book a hotel.', '🏨'],
      ['room', 'chambre', 'a private space in a hotel', 'We need a double room.', '🛏️'],
      ['check in', 'arriver à l’hôtel', 'to arrive and receive your room', 'We are going to check in at 3 p.m.', '🧳'],
      ['check out', 'quitter l’hôtel', 'to leave the hotel and finish your stay', 'We are going to check out on Sunday.', '🚪'],
      ['near', 'près de', 'close to something', 'The hotel is near the centre.', '📌'],
      ['comfortable', 'confortable', 'pleasant and easy to use', 'This hotel looks comfortable.', '🙂']
    ],
    transport: [
      ['ferry', 'ferry / bateau', 'a boat for passengers or cars', 'We are going to take the ferry.', '⛴️'],
      ['flight', 'vol', 'a journey by plane', 'The flight is early in the morning.', '✈️'],
      ['airport', 'aéroport', 'the place where planes arrive and leave', 'The airport is small and practical.', '🛫'],
      ['ticket', 'billet', 'the document for travel or entry', 'I need a return ticket.', '🎫'],
      ['arrival', 'arrivée', 'the moment you get to a place', 'Our arrival is at 11:20.', '🕓'],
      ['departure', 'départ', 'the moment you leave a place', 'The departure is at 8:00.', '🧭']
    ],
    compare: [
      ['quiet', 'calme', 'not noisy', 'Nantucket is quiet.', '🤫'],
      ['lively', 'animé', 'full of people and activity', 'Key West is lively.', '🎉'],
      ['historic', 'historique', 'connected to history', 'Charleston is historic.', '🏛️'],
      ['elegant', 'élégant', 'stylish and refined', 'Charleston feels elegant.', '✨'],
      ['hotter than', 'plus chaud que', 'used to compare temperature', 'Key West is hotter than Nantucket.', '🌞'],
      ['the most peaceful', 'le plus paisible', 'the calmest in a group', 'Nantucket is the most peaceful option.', '🌿']
    ],
    calendar: [
      ['Monday', 'lundi', 'the first weekday', 'We are going to leave on Monday.', '📅'],
      ['July', 'juillet', 'the seventh month of the year', 'We are going to travel in July.', '🗓️'],
      ['on', 'le / le jour de', 'used with days and dates', 'We are going to leave on Tuesday.', '🔹'],
      ['in', 'en', 'used with months and years', 'We are going to travel in August.', '🔹'],
      ['at', 'à', 'used with clock times', 'The ferry leaves at 9:30 a.m.', '⏰'],
      ['date', 'date', 'the day number in a month', 'The date is 14 July.', '📌']
    ],
    surprise: [
      ['surprise trip', 'voyage surprise', 'a trip someone does not know about yet', 'I am going to plan a surprise trip.', '🎁'],
      ['plan', 'préparer / planifier', 'to organise something before it happens', 'I am going to plan everything.', '📝'],
      ['choose', 'choisir', 'to pick one option', 'I am going to choose Charleston.', '✅'],
      ['because', 'parce que', 'to give a reason', 'I choose it because it is elegant.', '🔗'],
      ['for my friend', 'pour mon amie', 'to say who the plan is for', 'I am planning it for my friend.', '💌'],
      ['going to', 'aller / avoir l’intention de', 'used for a future plan', 'We are going to stay near the water.', '➡️']
    ]
  };

  const state = { current: 'nantucket', helpOn: true, vocabTab: 'scenery', speechLang: 'en-GB' };
  const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const times = ['8:00 a.m.','9:30 a.m.','11:15 a.m.','2:00 p.m.','4:30 p.m.','6:00 p.m.'];

  const $ = (sel, parent = document) => parent.querySelector(sel);
  const $$ = (sel, parent = document) => Array.from(parent.querySelectorAll(sel));
  const safe = value => String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const normalise = text => String(text || '').toLowerCase().replace(/[.,!?]/g, '').replace(/\s+/g, ' ').trim();

  function speak(text) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = state.speechLang;
    utter.rate = 0.92;
    const voices = speechSynthesis.getVoices() || [];
    const voice = voices.find(v => v.lang === state.speechLang) || voices.find(v => /^en/i.test(v.lang));
    if (voice) utter.voice = voice;
    speechSynthesis.speak(utter);
  }

  function applyHelpToggle() {
    document.body.classList.toggle('help-off', !state.helpOn);
    $('#frToggle').textContent = state.helpOn ? '🇫🇷 French help: ON' : '🇫🇷 French help: OFF';
  }

  function visibleDestinations() {
    const filter = $('#styleSelect').value;
    return Object.entries(destinations).filter(([, d]) => filter === 'all' || d.category === filter);
  }

  function renderDestinations() {
    const list = $('#destinationList');
    const visible = visibleDestinations();
    if (!visible.find(([key]) => key === state.current)) state.current = visible[0][0];
    list.innerHTML = '';
    visible.forEach(([key, d]) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `dest-card ${state.current === key ? 'selected' : ''}`;
      btn.innerHTML = `<span class="dest-icon">${d.icon}</span><strong>${safe(d.name)}</strong><small>${safe(d.tag)}</small><small>📍 ${safe(d.location)}</small><small>${safe(d.reason)}</small>`;
      btn.addEventListener('click', () => { state.current = key; updateDynamicSections(); renderDestinations(); });
      list.appendChild(btn);
    });
  }

  function renderSpotlight() {
    const d = destinations[state.current];
    $('#spotMain').innerHTML = `
      <div class="eyebrow" style="color:#f8d27b">Your current choice</div>
      <h3>${d.icon} ${safe(d.name)}</h3>
      <p><b>Location:</b> It is ${safe(d.location)}.</p>
      <p><b>Known for:</b> ${safe(d.known)}.</p>
      <p><b>Why choose it?</b> Because ${safe(d.reason)}.</p>
      <span class="fr">Localisation : ${safe(d.location)}. Ce lieu est connu pour ${safe(d.known)}. Pourquoi le choisir ? Parce qu’il/elle ${safe(d.reason)}.</span>`;

    $('#spotFacts').innerHTML = `
      <div class="fact"><b>🌟 Adjectives</b><br>${d.adjectives.map(safe).join(', ')}<span class="fr">Adjectifs utiles</span></div>
      <div class="fact"><b>📚 Comparative</b><br>${safe(d.comparative)}<span class="fr">Comparatif utile</span></div>
      <div class="fact"><b>🏆 Superlative</b><br>${safe(d.superlative)}<span class="fr">Superlatif utile</span></div>
      <div class="fact"><b>💬 Easy sentence</b><br>I would like to visit ${safe(d.name)} because it looks ${safe(d.adjectives[0])} and ${safe(d.adjectives[1])}.<span class="fr">Je voudrais visiter… parce que cela semble…</span></div>`;

    $('#photoGrid').innerHTML = d.images.map(img => `
      <article class="photo-card">
        <img src="${safe(img.src)}" alt="${safe(img.alt)}">
        <div class="photo-card__body">
          <b>${safe(img.caption)}</b>
          <div class="photo-card__actions">
            <button class="audio-btn speak-photo" type="button" data-speech="This is ${safe(d.name)}. It looks ${safe(d.adjectives[0])} and ${safe(d.adjectives[1])}.">🔊 Listen</button>
          </div>
        </div>
      </article>`).join('');
    $$('.speak-photo').forEach(btn => btn.addEventListener('click', () => speak(btn.dataset.speech)));

    $('#placeSupport').innerHTML = `
      <div class="section-head"><div><div class="eyebrow">Place support</div><h2>${safe(d.name)} · small useful words</h2><p>Use these words before you speak about this destination.</p><span class="fr">Utilisez ces mots avant de parler de cette destination.</span></div></div>
      <div class="vocab-list">${d.placeWords.map(([term, fr, def, ex, emoji]) => `<article class="vocab-item"><div class="vocab-top"><div><h4>${emoji} ${safe(term)}</h4><span class="fr">${safe(fr)}</span></div><button class="audio-btn place-audio" type="button" data-speech="${safe(term)}. ${safe(ex)}">🔊</button></div><p>${safe(def)}</p><p><i>“${safe(ex)}”</i></p></article>`).join('')}</div>`;
    $$('.place-audio').forEach(btn => btn.addEventListener('click', () => speak(btn.dataset.speech)));
  }

  function renderVocabTabs() {
    const labels = {scenery:'🌊 Scenery', hotel:'🏨 Hotel', transport:'✈️ Transport', compare:'⚖️ Compare', calendar:'📅 Calendar', surprise:'🎁 Surprise trip'};
    const tabs = $('#vocabTabs');
    tabs.innerHTML = '';
    Object.keys(vocab).forEach(key => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `tab ${state.vocabTab === key ? 'active' : ''}`;
      btn.textContent = labels[key];
      btn.addEventListener('click', () => { state.vocabTab = key; renderVocabTabs(); renderVocabList(); });
      tabs.appendChild(btn);
    });
  }

  function renderVocabList() {
    const list = $('#vocabList');
    list.innerHTML = '';
    vocab[state.vocabTab].forEach(([term, fr, definition, example, emoji]) => {
      const item = document.createElement('article');
      item.className = 'vocab-item';
      item.innerHTML = `<div class="vocab-top"><div><h4>${emoji} ${safe(term)}</h4><span class="fr">${safe(fr)}</span></div><button class="audio-btn vocab-audio" type="button">🔊</button></div><p>${safe(definition)}</p><p><i>“${safe(example)}”</i></p>`;
      $('.vocab-audio', item).addEventListener('click', () => speak(`${term}. ${example}`));
      list.appendChild(item);
    });
  }

  function setChoice(containerId, feedbackId, options, correct, hint) {
    const root = $('#' + containerId); const feedback = $('#' + feedbackId); if (!root || !feedback) return;
    root.innerHTML = '';
    feedback.textContent = '';
    feedback.className = 'feedback';
    options.forEach((text, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button'; btn.className = 'choice-btn'; btn.textContent = text;
      btn.addEventListener('click', () => {
        $$('.choice-btn', root).forEach(b => b.disabled = true);
        if (idx === correct) {
          btn.classList.add('correct'); feedback.className = 'feedback good'; feedback.textContent = '✓ Correct.';
        } else {
          btn.classList.add('wrong'); $$('.choice-btn', root)[correct].classList.add('correct');
          feedback.className = 'feedback bad'; feedback.textContent = `Not this time. ${hint}`;
        }
      });
      root.appendChild(btn);
    });
  }

  function setupChoices() {
    setChoice('prepChoice', 'prepFeedback', ['in', 'on', 'at'], 1, 'Nantucket is on an island.');
    setChoice('advChoice', 'advFeedback', ['beautiful', 'beautifully', 'more beautiful'], 1, 'Use an adverb after the verb: walk around beautifully.');
    setChoice('compareChoice', 'compareFeedback', [
      'Charleston is more historic than Key West.',
      'Charleston is historicer than Key West.',
      'Charleston more historic than Key West.'
    ], 0, 'Use more + adjective with historic.');
    setChoice('irregularChoice', 'irregularFeedback', ['taked', 'took', 'taken'], 1, 'Past simple of take = took.');
  }

  function setupBuilders() {
    $$('.builder').forEach(builder => {
      if (builder.dataset.ready === 'yes') return;
      builder.dataset.ready = 'yes';
      const answer = builder.dataset.answer.split(' ');
      const words = builder.dataset.words.split('|');
      builder.innerHTML = `<div class="builder-instruction">Tap the words in the order you want. Tap a yellow word to move it back.</div><div class="word-bank"></div><div class="answer-zone"><span class="builder-placeholder">Your sentence appears here.</span></div><div class="builder-actions"><button class="secondary check-builder" type="button">Check</button><button class="mini-btn reset-builder" type="button">Clear</button><button class="audio-btn model-builder" type="button">🔊 Listen</button></div><div class="builder-status" aria-live="polite"></div>`;
      const bank = $('.word-bank', builder), zone = $('.answer-zone', builder), status = $('.builder-status', builder);
      function createChip(word) {
        const chip = document.createElement('button');
        chip.type = 'button'; chip.className = 'word-chip'; chip.textContent = word;
        chip.addEventListener('click', () => {
          if (chip.parentElement === bank) { $('.builder-placeholder', zone)?.remove(); zone.appendChild(chip); }
          else { bank.appendChild(chip); if (!$('.word-chip', zone)) zone.innerHTML = '<span class="builder-placeholder">Your sentence appears here.</span>'; }
          status.textContent = ''; status.className = 'builder-status';
        });
        return chip;
      }
      words.forEach(word => bank.appendChild(createChip(word)));
      $('.check-builder', builder).addEventListener('click', () => {
        const built = $$('.word-chip', zone).map(ch => ch.textContent).join(' ');
        if (normalise(built) === normalise(answer.join(' '))) {
          status.className = 'builder-status good'; status.textContent = '✓ Excellent. Say it aloud.';
        } else {
          status.className = 'builder-status bad'; status.textContent = `Model: “${answer.join(' ')}.”`;
        }
      });
      $('.reset-builder', builder).addEventListener('click', () => {
        $$('.word-chip', zone).forEach(ch => bank.appendChild(ch));
        zone.innerHTML = '<span class="builder-placeholder">Your sentence appears here.</span>';
        status.className = 'builder-status'; status.textContent = '';
      });
      $('.model-builder', builder).addEventListener('click', () => speak(answer.join(' ')));
    });
  }

  function renderRealTravelCards() {
    const d = destinations[state.current];
    const cards = [
      {title:d.transportTitle, text:d.transportText, links:d.transportLinks, emoji:'🚆'},
      {title:d.sightsTitle, text:d.sightsText, links:d.sightsLinks, emoji:'📍'},
      {title:d.hotelTitle, text:d.hotelText, links:d.hotelLinks, emoji:'🏨'}
    ];
    $('#realTravelCards').innerHTML = cards.map(card => `
      <article class="booking-card real-card">
        <div class="emoji">${card.emoji}</div>
        <h3>${safe(card.title)}</h3>
        <p>${safe(card.text)}</p>
        <div class="travel-links">${card.links.map(([label, href]) => `<a class="mini-btn" href="${safe(href)}" target="_blank" rel="noopener">${safe(label)}</a>`).join('')}</div>
      </article>`).join('');
  }

  function fillTripDestinationSelect() {
    const select = $('#tripDestination');
    select.innerHTML = Object.entries(destinations).map(([key, d]) => `<option value="${key}">${safe(d.name)}</option>`).join('');
    select.value = state.current;
  }

  function updateTripOptions() {
    const key = $('#tripDestination').value;
    const d = destinations[key];
    $('#tripTransport').innerHTML = d.transportOptions.map((opt, i) => `<option value="${i}">${safe(opt.value)}</option>`).join('');
    $('#tripActivity').innerHTML = d.activityOptions.map(act => `<option value="${safe(act)}">${safe(act)}</option>`).join('');
  }

  function buildTrip() {
    const key = $('#tripDestination').value;
    const d = destinations[key];
    const transportObj = d.transportOptions[Number($('#tripTransport').value) || 0];
    const transport = transportObj.value;
    const reason = transportObj.reason;
    const hotel = $('#tripHotel').value;
    const activity = $('#tripActivity').value;
    const output = `I am going to plan a surprise trip for my friend. We are going to go to ${d.name}. We are going to ${transport} because ${reason}. We are going to stay in ${hotel}. We are going to ${activity}. I think my friend is going to love it because ${d.name} looks ${d.adjectives[0]} and ${d.adjectives[1]}.`;
    $('#tripOutput').textContent = output;
    $('#messageOutput').textContent = `Hi! I am planning a surprise trip for you. We are going to go to ${d.name}. We are going to ${transport}. We are going to stay in ${hotel}, and we are going to ${activity}. I think you are going to love it!`;
    $('#dialogueReply').textContent = `We are going to go to ${d.name}. It is ${d.comparative}, and I think it is ${d.superlative}.`;
    $('#modelSpeech').textContent = `I am going to plan a surprise trip for my friend. We are going to go to ${d.name}. We are going to ${transport}. We are going to stay in ${hotel}. We are going to ${activity}. I think my friend is going to love it because it looks ${d.adjectives[0]} and ${d.adjectives[1]}.`;
    return output;
  }

  function populateCalendarFields() {
    $('#calendarDay').innerHTML = days.map(day => `<option value="${day}">${day}</option>`).join('');
    $('#calendarMonth').innerHTML = months.map(month => `<option value="${month}">${month}</option>`).join('');
    $('#calendarDate').innerHTML = Array.from({length:31}, (_,i) => `<option value="${i+1}">${i+1}</option>`).join('');
    $('#calendarTime').innerHTML = times.map(time => `<option value="${time}">${time}</option>`).join('');
    $('#calendarDay').value = 'Friday';
    $('#calendarMonth').value = 'July';
    $('#calendarDate').value = '18';
    $('#calendarTime').value = '9:30 a.m.';
  }

  function buildCalendarSentence() {
    const day = $('#calendarDay').value;
    const month = $('#calendarMonth').value;
    const date = $('#calendarDate').value;
    const time = $('#calendarTime').value;
    const dest = destinations[state.current].name;
    const sentence = `We are going to leave on ${day}, ${date} ${month}, at ${time}, and travel to ${dest}.`;
    $('#calendarOutput').textContent = sentence;
    return sentence;
  }

  function updateDynamicSections() {
    renderSpotlight();
    renderRealTravelCards();
    fillTripDestinationSelect();
    updateTripOptions();
    buildTrip();
    buildCalendarSentence();
  }

  function bindGlobal() {
    $('#frToggle').addEventListener('click', () => { state.helpOn = !state.helpOn; applyHelpToggle(); });
    $('#printBtn').addEventListener('click', () => window.print());
    $('.speak-page').addEventListener('click', () => speak($('.speak-page').dataset.speech));
    $('#styleSelect').addEventListener('change', () => { renderDestinations(); updateDynamicSections(); });
    $('#tripDestination').addEventListener('change', () => { updateTripOptions(); buildTrip(); });
    $('#tripTransport').addEventListener('change', buildTrip);
    $('#tripHotel').addEventListener('change', buildTrip);
    $('#tripActivity').addEventListener('change', buildTrip);
    $('#buildTrip').addEventListener('click', buildTrip);
    $('#listenTrip').addEventListener('click', () => speak(buildTrip()));
    $('#listenCompare').addEventListener('click', () => speak($('#compareModel').textContent));
    $('#listenSpeech').addEventListener('click', () => speak($('#modelSpeech').textContent));
    $('#listenDialogue').addEventListener('click', () => speak(`Friend: I need a break. I want somewhere beautiful. You: I am going to plan a surprise trip for you. Friend: Really? Where are we going to go? You: ${$('#dialogueReply').textContent}`));
    $('#buildCalendar').addEventListener('click', buildCalendarSentence);
    $('#listenCalendar').addEventListener('click', () => speak(buildCalendarSentence()));
    ['calendarDay','calendarMonth','calendarDate','calendarTime'].forEach(id => $('#' + id).addEventListener('change', buildCalendarSentence));
  }

  applyHelpToggle();
  renderDestinations();
  renderVocabTabs();
  renderVocabList();
  setupChoices();
  setupBuilders();
  populateCalendarFields();
  updateDynamicSections();
  bindGlobal();
})();
