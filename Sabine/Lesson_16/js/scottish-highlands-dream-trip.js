(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));
  let currentLang = 'en-GB';

  function speak(text) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = currentLang;
    const voices = speechSynthesis.getVoices() || [];
    const v = voices.find(v => v.lang === currentLang) || voices.find(v => v.lang.startsWith('en'));
    if (v) utter.voice = v;
    utter.rate = 0.95;
    speechSynthesis.speak(utter);
  }

  $('#voiceUk')?.addEventListener('click', () => {
    currentLang = 'en-GB';
    speak('Welcome to your dream trip to the Scottish Highlands.');
  });
  $('#voiceUs')?.addEventListener('click', () => {
    currentLang = 'en-US';
    speak('Welcome to your dream trip to the Scottish Highlands.');
  });

  $$('[data-say]').forEach(btn => btn.addEventListener('click', () => speak(btn.dataset.say)));

  $$('.reveal-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.target);
      if (!target) return;
      const open = target.classList.toggle('open');
      btn.textContent = open ? 'Hide model answer' : (btn.textContent.includes('easy') ? 'Show easy model' : 'Show model answer');
    });
  });

  $('#frToggle')?.addEventListener('click', () => {
    $$('.help').forEach(el => el.classList.toggle('show'));
  });

  $('#checkTransport')?.addEventListener('click', () => {
    const answers = { q1: 'b', q2: 'a', q3: 'b', q4: 'b' };
    let score = 0;
    Object.entries(answers).forEach(([name, value]) => {
      const checked = document.querySelector(`input[name="${name}"]:checked`);
      if (checked && checked.value === value) score++;
    });
    const fb = $('#transportFeedback');
    if (!fb) return;
    fb.innerHTML = `${score}/4 correct. ` + (score === 4
      ? 'Excellent! You are ready to talk about transport in Scotland.'
      : 'Review these words: ScotRail, Jacobite, return ticket, Caledonian Sleeper.');
  });

  const patternData = {
    'I like': {
      details: ['Glencoe', 'Loch Ness', 'the view', 'this hotel', 'the steam train'],
      reasons: ['because it looks beautiful', 'because it looks peaceful', 'because the view is amazing', 'because I like the atmosphere']
    },
    'I want to visit': {
      details: ['Glencoe', 'Loch Ness', 'the castle', 'Glenfinnan'],
      reasons: ['because it looks beautiful', 'because I like history', 'because it looks famous', 'because I want to take photos']
    },
    'I want to take': {
      details: ['the train', 'the steam train', 'a boat trip'],
      reasons: ['because the journey looks scenic', 'because it looks fun', 'because I want to relax', 'because I want to enjoy the view']
    },
    'I want to book': {
      details: ['a double room', 'a return ticket', 'a room with breakfast included'],
      reasons: ['because it is practical', 'because it sounds comfortable', 'because it is easy', 'because I want a simple trip']
    },
    'I want to stay in': {
      details: ['a cosy hotel', 'a traditional hotel', 'an elegant hotel'],
      reasons: ['because it looks quiet', 'because it looks comfortable', 'because it looks elegant', 'because it is near the station']
    },
    'I want to see': {
      details: ['the castle', 'Loch Ness', 'the mountains', 'the viaduct'],
      reasons: ['because it looks amazing', 'because I like history', 'because it is iconic', 'because I want to take photos']
    }
  };

  function fillSelect(select, values) {
    if (!select) return;
    select.innerHTML = values.map(v => `<option value="${v}">${v}</option>`).join('');
  }

  function updatePatternOptions() {
    const patternSelect = $('#patternChoice');
    if (!patternSelect) return;
    if (!patternSelect.options.length) {
      patternSelect.innerHTML = Object.keys(patternData).map(k => `<option value="${k}">${k}</option>`).join('');
    }
    const selected = patternSelect.value || Object.keys(patternData)[0];
    fillSelect($('#detailChoice'), patternData[selected].details);
    fillSelect($('#reasonChoice'), patternData[selected].reasons);
  }

  $('#patternChoice')?.addEventListener('change', updatePatternOptions);
  updatePatternOptions();

  function buildSentenceText() {
    const pattern = $('#patternChoice')?.value || 'I like';
    const detail = $('#detailChoice')?.value || 'Glencoe';
    const reason = $('#reasonChoice')?.value || 'because it looks beautiful';
    return `${pattern} ${detail} ${reason}.`;
  }

  $('#buildSentence')?.addEventListener('click', () => {
    $('#sentenceResult').textContent = buildSentenceText();
  });
  $('#listenSentence')?.addEventListener('click', () => speak(buildSentenceText()));

  const transportMap = {
    ScotRail: 'travel by the ScotRail scenic train',
    Jacobite: 'take the Jacobite steam train',
    Sleeper: 'travel on the Caledonian Sleeper'
  };
  const activityMap = {
    photos: 'take photos and enjoy the scenery',
    castle: 'visit a castle and learn about the history',
    boat: 'take a boat trip on the loch',
    train: 'enjoy the train journey and the views'
  };
  const hotelMap = {
    cosy: 'stay in a cosy hotel with breakfast included',
    traditional: 'stay in a traditional hotel near the station',
    elegant: 'stay in an elegant hotel with a beautiful view'
  };
  const placeReasons = {
    'Glencoe': 'because the mountains and the valley look beautiful',
    'Loch Ness': 'because the loch and the castle look amazing',
    'Glenfinnan': 'because the viaduct and the train are iconic'
  };

  function buildTripText() {
    const transport = $('#transportChoice')?.value || 'ScotRail';
    const place = $('#placeChoice')?.value || 'Glencoe';
    const activity = $('#activityChoice')?.value || 'photos';
    const hotel = $('#hotelChoice')?.value || 'cosy';
    return `My dream trip is in the Scottish Highlands. I would like to go to ${place} ${placeReasons[place]}. I would like to ${transportMap[transport]}. I would also like to ${activityMap[activity]}. I would like to ${hotelMap[hotel]}.`;
  }

  $('#buildTrip')?.addEventListener('click', () => {
    $('#tripResult').textContent = buildTripText();
  });
  $('#listenTrip')?.addEventListener('click', () => speak(buildTripText()));
})();
