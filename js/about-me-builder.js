
  (function () {
    const container = document.getElementById('aboutMeBuilder');
    if (!container) return;

    const nameInput = container.querySelector('#aboutName');
    const originInput = container.querySelector('#aboutOrigin');
    const cityInput = container.querySelector('#aboutCity');
    const jobInput = container.querySelector('#aboutJob');
    const companyInput = container.querySelector('#aboutCompany');
    const familyInput = container.querySelector('#aboutFamily');
    const hobbiesInput = container.querySelector('#aboutHobbies');
    const personalityInput = container.querySelector('#aboutPersonality');
    const goalsInput = container.querySelector('#aboutGoals');
    const situationSelect = container.querySelector('#aboutSituation');

    const includeIdentity = container.querySelector('#includeIdentity');
    const includeWork = container.querySelector('#includeWork');
    const includeFamily = container.querySelector('#includeFamily');
    const includeHobbies = container.querySelector('#includeHobbies');
    const includePersonality = container.querySelector('#includePersonality');
    const includeGoals = container.querySelector('#includeGoals');

    const basicOutput = container.querySelector('#aboutBasicOutput');
    const midOutput = container.querySelector('#aboutMidOutput');
    const advOutput = container.querySelector('#aboutAdvOutput');

    const audioButtons = container.querySelectorAll('[data-about-audio]');

    let lastBasic = '';
    let lastMid = '';
    let lastAdv = '';
    let aboutUtterance = null;
    let aboutWarnedSpeech = false;

    function clean(text) {
      return (text || '').trim();
    }

    function stripTrailingDot(text) {
      return text.replace(/\.+\s*$/, '');
    }

    // 🔧 NEW: strip leading “I / I'm / I am / I want to / to …”
    function stripLeadingI(text) {
      let t = text.trim();

      // Remove leading "I am", "I'm", "I’m"
      t = t.replace(/^(I\s+am\s+|I['’]m\s+)/i, '');

      // Remove leading plain "I "
      t = t.replace(/^I\s+/i, '');

      return t.trim();
    }

    function stripLeadingGoalStuff(text) {
      let t = text.trim();

      // Remove "I want to / I'd like to / I would like to / My goal is to"
      t = t.replace(/^(I\s+want\s+to\s+|I['’]d\s+like\s+to\s+|I\s+would\s+like\s+to\s+|My\s+goal\s+is\s+to\s+)/i, '');

      // If it still begins with "to ", remove that too
      t = t.replace(/^to\s+/i, '');

      return t.trim();
    }

    function makePlaceholder(value, placeholder) {
      return clean(value) || placeholder;
    }

    function buildParagraphs() {
      const name = makePlaceholder(nameInput.value, '___');
      const origin = clean(originInput.value);
      const city = clean(cityInput.value);
      const job = clean(jobInput.value);
      const company = clean(companyInput.value);

      // Use raw text, then clean inside the helper functions
      const family = clean(familyInput.value);
      const hobbiesRaw = clean(hobbiesInput.value);
      const personalityRaw = clean(personalityInput.value);
      const goalsRaw = clean(goalsInput.value);

      const situation = situationSelect.value;

      const incIdentity = includeIdentity.checked;
      const incWork = includeWork.checked;
      const incFam = includeFamily.checked;
      const incHob = includeHobbies.checked;
      const incPers = includePersonality.checked;
      const incGoals = includeGoals.checked;

      function joinSentences(list) {
        return list.filter(Boolean).join(' ');
      }

      function introBasic() {
        if (situation === 'casual') {
          return 'Hi, I\'m ' + name + '.';
        } else if (situation === 'friend') {
          return 'Hi, I\'m ' + name + '.';
        } else if (situation === 'professional') {
          return 'Hi, my name is ' + name + '.';
        } else {
          return 'Good morning, my name is ' + name + '.';
        }
      }

      function introMid() {
        let baseName;
        if (situation === 'casual' || situation === 'friend') {
          baseName = 'Hi, I\'m ' + name + '.';
        } else if (situation === 'professional') {
          baseName = 'Hi, my name is ' + name + '.';
        } else {
          baseName = 'Good morning, my name is ' + name + '.';
        }

        if (incIdentity && (origin || city)) {
          if (origin && city) {
            return baseName + ' I\'m from ' + origin + ' and I live in ' + city + '.';
          } else if (origin) {
            return baseName + ' I\'m from ' + origin + '.';
          } else {
            return baseName + ' I live in ' + city + '.';
          }
        }
        return baseName;
      }

      function introAdv() {
        let baseName;
        if (situation === 'casual') {
          baseName = 'Hey, I\'m ' + name + '.';
        } else if (situation === 'friend') {
          baseName = 'So, I\'m ' + name + '.';
        } else if (situation === 'professional') {
          baseName = 'Hi, my name is ' + name + '.';
        } else {
          baseName = 'Good morning, my name is ' + name + '.';
        }

        if (incIdentity && (origin || city)) {
          if (origin && city) {
            return baseName + ' I\'m originally from ' + origin + ', and I\'m currently based in ' + city + '.';
          } else if (origin) {
            return baseName + ' I\'m originally from ' + origin + '.';
          } else {
            return baseName + ' I\'m currently living in ' + city + '.';
          }
        }
        return baseName;
      }

      function familyBasicText() {
        if (!incFam || !family) return '';
        const f = stripTrailingDot(family);
        return f + '.';
      }

      function familyMidText() {
        if (!incFam || !family) return '';
        const f = stripTrailingDot(family);
        return 'In my personal life, ' + f + '.';
      }

      function familyAdvText() {
        if (!incFam || !family) return '';
        const f = stripTrailingDot(family);
        return 'On a personal note, ' + f + ', which is very important to me.';
      }

      function workBasic() {
        if (!incWork || !job) return '';
        if (company) {
          return 'I work as a ' + job + ' at ' + company + '.';
        }
        return 'I work as a ' + job + '.';
      }

      function workMid() {
        if (!incWork || !job) return '';
        if (company) {
          return 'I work as a ' + job + ' at ' + company + ', and I really enjoy what I do.';
        }
        return 'I currently work as a ' + job + ', and I really enjoy it.';
      }

      function workAdv() {
        if (!incWork || !job) return '';
        if (company) {
          return 'At the moment, I work as a ' + job + ' at ' + company + ', and I really enjoy working with different people and projects.';
        }
        return 'At the moment, I work as a ' + job + ', and I really enjoy working with different people and projects.';
      }

      // 🔧 HOBBIES – remove “I …” if learner typed it
      function hobbiesBasic() {
        if (!incHob || !hobbiesRaw) return '';
        let h = stripLeadingI(hobbiesRaw);
        h = stripTrailingDot(h);
        return 'In my free time, I like ' + h + '.';
      }

      function hobbiesMid() {
        if (!incHob || !hobbiesRaw) return '';
        let h = stripLeadingI(hobbiesRaw);
        h = stripTrailingDot(h);
        return 'In my free time, I really enjoy ' + h + ', it helps me relax.';
      }

      function hobbiesAdv() {
        if (!incHob || !hobbiesRaw) return '';
        let h = stripLeadingI(hobbiesRaw);
        h = stripTrailingDot(h);
        return 'Outside of work, I really enjoy ' + h + ', because it helps me relax and stay balanced.';
      }

      // 🔧 PERSONALITY – remove “I’m / I am …” if learner typed it
      function personalityBasic() {
        if (!incPers || !personalityRaw) return '';
        let p = stripLeadingI(personalityRaw);
        p = stripTrailingDot(p);
        return 'I would say I\'m ' + p + '.';
      }

      function personalityMid() {
        if (!incPers || !personalityRaw) return '';
        let p = stripLeadingI(personalityRaw);
        p = stripTrailingDot(p);
        return 'People usually describe me as ' + p + '.';
      }

      function personalityAdv() {
        if (!incPers || !personalityRaw) return '';
        let p = stripLeadingI(personalityRaw);
        p = stripTrailingDot(p);
        return 'People usually describe me as ' + p + ', and I try to keep that attitude in everything I do.';
      }

      // 🔧 GOALS – remove “I want to / I’d like to / to …” etc.
      function goalsBasic() {
        if (!incGoals || !goalsRaw) return '';
        let g = stripLeadingGoalStuff(goalsRaw);
        g = stripTrailingDot(g);
        return 'My goal is to ' + g + '.';
      }

      function goalsMid() {
        if (!incGoals || !goalsRaw) return '';
        let g = stripLeadingGoalStuff(goalsRaw);
        g = stripTrailingDot(g);
        return 'Right now, my main goal is to ' + g + '.';
      }

            function goalsAdv() {
        if (!incGoals || !goalsRaw) return '';

        // Start from the raw text for the advanced version
        let g = goalsRaw.trim();

        // Remove "I want to / I'd like to / I would like to / My goal is to"
        g = g.replace(/^(I\s+want\s+to\s+|I['’]d\s+like\s+to\s+|I\s+would\s+like\s+to\s+|My\s+goal\s+is\s+to\s+)/i, '');
        g = g.trim();

        // Make sure it starts with "to ..."
        if (!/^to\s+/i.test(g)) {
          g = 'to ' + g;
        }

        // Remove final dot if there is one
        g = stripTrailingDot(g);

        // Now the sentence is grammatically correct:
        // "I'm really focusing on my goal to improve my English..."
        return 'At the moment, I\'m really focusing on my goal ' + g + ', because it\'s important for my future.';
      }


      const basicParagraph = joinSentences([
        introBasic(),
        workBasic(),
        familyBasicText(),
        hobbiesBasic(),
        personalityBasic(),
        goalsBasic()
      ]);

      const midParagraph = joinSentences([
        introMid(),
        workMid(),
        familyMidText(),
        hobbiesMid(),
        personalityMid(),
        goalsMid()
      ]);

      const advParagraph = joinSentences([
        introAdv(),
        workAdv(),
        familyAdvText(),
        hobbiesAdv(),
        personalityAdv(),
        goalsAdv()
      ]);

      lastBasic = basicParagraph;
      lastMid = midParagraph;
      lastAdv = advParagraph;

      basicOutput.textContent = basicParagraph || 'Fill in the information above to see your basic paragraph.';
      midOutput.textContent = midParagraph || 'Fill in the information above to see your intermediate paragraph.';
      advOutput.textContent = advParagraph || 'Fill in the information above to see your advanced paragraph.';
    }

    function getBestParagraphText() {
      return lastAdv || lastMid || lastBasic || 'This is my introduction.';
    }

    function handleAudio(action) {
      if (!('speechSynthesis' in window)) {
        if (!aboutWarnedSpeech) {
          aboutWarnedSpeech = true;
          alert('Your browser does not support speech synthesis. The audio buttons may not work.');
        }
        return;
      }

      const synth = window.speechSynthesis;

      if (action === 'play') {
        if (synth.paused) {
          synth.resume();
          return;
        }
        const text = getBestParagraphText();
        synth.cancel();
        aboutUtterance = new SpeechSynthesisUtterance(text);
        aboutUtterance.lang = 'en-US';
        synth.speak(aboutUtterance);
      } else if (action === 'pause') {
        synth.pause();
      } else if (action === 'restart') {
        const text = getBestParagraphText();
        synth.cancel();
        aboutUtterance = new SpeechSynthesisUtterance(text);
        aboutUtterance.lang = 'en-US';
        synth.speak(aboutUtterance);
      }
    }

    const inputs = [
      nameInput, originInput, cityInput, jobInput, companyInput,
      familyInput, hobbiesInput, personalityInput, goalsInput,
      situationSelect,
      includeIdentity, includeWork, includeFamily,
      includeHobbies, includePersonality, includeGoals
    ];

    inputs.forEach(function (el) {
      if (!el) return;
      const eventName = (el.tagName === 'SELECT' || el.type === 'checkbox') ? 'change' : 'input';
      el.addEventListener(eventName, buildParagraphs);
    });

    audioButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const action = btn.getAttribute('data-about-audio');
        handleAudio(action);
      });
    });

    // Initial build
    buildParagraphs();
  })();
