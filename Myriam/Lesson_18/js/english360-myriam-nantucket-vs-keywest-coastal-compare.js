(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const state = {
    level: 'B1',
    currentImage: 0,
    vocabCategory: 'All'
  };

  const images = [
    {
      title: 'Nantucket Main Street',
      theme: 'Architecture + village atmosphere',
      src: './img/nantucket-main-street.jpg',
      alt: 'Main street in Nantucket with cobblestones, trees and local shops',
      text: 'This image shows a bright street in Nantucket. We can see cobblestones, cars, trees and traditional buildings. The atmosphere looks calm, elegant and very New England.',
      starter: 'This picture shows the town centre of Nantucket, which looks calm, historic and welcoming.',
      prompts: [
        'Describe the street, the buildings and the atmosphere.',
        'Say why it looks traditional or charming.',
        'Compare it with a more tropical destination.'
      ]
    },
    {
      title: 'Nantucket Town Centre',
      theme: 'Culture + daily life',
      src: './img/nantucket-town-centre.jpg',
      alt: 'Historic cobblestone town centre in Nantucket',
      text: 'This photo highlights Nantucket’s cobblestone streets and colourful historic houses. It is a good image to talk about small-town charm, local life and a peaceful walking atmosphere.',
      starter: 'Here, we can see a historic part of Nantucket where visitors can walk, shop and enjoy a slower rhythm of life.',
      prompts: [
        'Use: smaller, quieter, more traditional.',
        'Say what tourists can do there.',
        'Explain who would enjoy this place most.'
      ]
    },
    {
      title: 'Brant Point Lighthouse',
      theme: 'History + coastal symbol',
      src: './img/nantucket-lighthouse.jpg',
      alt: 'Brant Point Lighthouse in Nantucket',
      text: 'This picture presents Brant Point Lighthouse, one of the island’s best-known landmarks. It is perfect for speaking about maritime history, the coast and the identity of Nantucket.',
      starter: 'This picture shows Brant Point Lighthouse, one of the most iconic places in Nantucket.',
      prompts: [
        'Describe the beach, the lighthouse and the sky.',
        'Use one superlative.',
        'Explain why it represents Nantucket well.'
      ]
    },
    {
      title: 'Key West Colourful Cottage',
      theme: 'Architecture + tropical charm',
      src: './img/keywest-cottage.png',
      alt: 'Colourful house in Key West with tropical plants',
      text: 'This photo shows a colourful house in Key West. The bright colours, tropical plants and white fence make the place look warm, cheerful and relaxed.',
      starter: 'This picture shows a colourful house in Key West, which looks warmer and more tropical than Nantucket.',
      prompts: [
        'Describe the colours, the plants and the style of the house.',
        'Compare the architecture with Nantucket.',
        'Say why the place feels tropical.'
      ]
    },
    {
      title: 'Ernest Hemingway Home',
      theme: 'History + literature',
      src: './img/keywest-hemingway.png',
      alt: 'Ernest Hemingway Home in Key West',
      text: 'This image shows the Ernest Hemingway Home in Key West. It is an excellent way to talk about history, literature, architecture and why Key West attracts visitors who enjoy culture.',
      starter: 'This picture shows the Hemingway Home, a historic place where we can connect Key West with literature and culture.',
      prompts: [
        'Mention the historic aspect.',
        'Use: more cultural / more colourful / more tropical.',
        'Explain why people may want to visit it.'
      ]
    },
    {
      title: 'Key West Sunset',
      theme: 'Culture + atmosphere',
      src: './img/keywest-sunset.png',
      alt: 'Sunset in Key West with silhouettes of people and a sailboat',
      text: 'This sunset image captures the lively and scenic side of Key West. We can see people watching the sunset, which creates a social, memorable and almost festive atmosphere.',
      starter: 'This picture shows a sunset in Key West, where many people seem to be enjoying the evening together.',
      prompts: [
        'Describe the sky, the sea and the people.',
        'Say how the atmosphere feels.',
        'Compare it with the quieter feeling of Nantucket.'
      ]
    }
  ];

  const vocab = [
    {word:'cobblestone', fr:'pavé', cat:'Architecture', def:'a small rounded stone used to make an old street', ex:'Nantucket is famous for its cobblestone streets.'},
    {word:'lighthouse', fr:'phare', cat:'History', def:'a tower with a strong light for ships', ex:'Brant Point Lighthouse is one of Nantucket’s landmarks.'},
    {word:'whaling', fr:'chasse à la baleine', cat:'History', def:'the historical activity of hunting whales', ex:'Nantucket became rich because of whaling.'},
    {word:'maritime', fr:'maritime', cat:'History', def:'connected with the sea or ships', ex:'The island has a strong maritime history.'},
    {word:'charming', fr:'charmant', cat:'Atmosphere', def:'pleasant and attractive in a warm way', ex:'Nantucket looks charming and elegant.'},
    {word:'peaceful', fr:'paisible', cat:'Atmosphere', def:'calm and quiet', ex:'The town feels peaceful and relaxing.'},
    {word:'lively', fr:'animé', cat:'Atmosphere', def:'full of energy, movement or activity', ex:'Key West feels more lively at night.'},
    {word:'tropical', fr:'tropical', cat:'Atmosphere', def:'hot, sunny and typical of a tropical region', ex:'Key West has a more tropical atmosphere.'},
    {word:'colourful', fr:'coloré', cat:'Architecture', def:'full of bright colours', ex:'The houses in Key West look colourful.'},
    {word:'historic', fr:'historique', cat:'History', def:'important in history or old and traditional', ex:'Both places have historic areas to visit.'},
    {word:'harbour', fr:'port', cat:'Location', def:'a protected place by the sea where boats stay', ex:'The lighthouse stands near the harbour.'},
    {word:'off the coast of', fr:'au large de / au large de la côte de', cat:'Location', def:'located in the sea near a coast', ex:'Nantucket is off the coast of Massachusetts.'},
    {word:'at the end of', fr:'à l’extrémité de', cat:'Location', def:'in the final part of a place or route', ex:'Key West is at the end of the Florida Keys.'},
    {word:'south-western', fr:'sud-ouest / sud-ouest de', cat:'Location', def:'in the south-west area of a region', ex:'Key West is at the south-western end of the Florida Keys.'},
    {word:'quieter', fr:'plus calme', cat:'Comparison', def:'more calm and less noisy', ex:'Nantucket is quieter than Key West.'},
    {word:'more colourful', fr:'plus coloré', cat:'Comparison', def:'having more bright colours', ex:'Key West is more colourful than Nantucket.'},
    {word:'more historic', fr:'plus historique', cat:'Comparison', def:'having a stronger historical character', ex:'Nantucket feels more historic than many beach towns.'},
    {word:'recommend', fr:'recommander', cat:'Useful verbs', def:'to say that something is good for someone', ex:'I would recommend Key West to travellers who love sunsets.'},
    {word:'stroll', fr:'se promener', cat:'Useful verbs', def:'to walk slowly in a relaxed way', ex:'Visitors can stroll through the town centre.'},
    {word:'explore', fr:'explorer', cat:'Useful verbs', def:'to discover a place by visiting it carefully', ex:'You can explore museums, streets and coastal views.'},
    {word:'sunset', fr:'coucher de soleil', cat:'Culture', def:'the time when the sun goes down', ex:'Mallory Square is famous for its sunset atmosphere.'},
    {word:'shipwreck', fr:'naufrage / épave', cat:'History', def:'a ship that has been destroyed at sea', ex:'Key West has a famous shipwreck history.'}
  ];

  const quizOne = [
    {
      q: 'Which sentence is correct?',
      options: [
        'Nantucket is more quiet than Key West.',
        'Nantucket is quieter than Key West.',
        'Nantucket is the quieter than Key West.'
      ],
      answer: 1,
      explain: 'For short adjectives like quiet, we usually say quieter than.'
    },
    {
      q: 'Which location sentence is correct?',
      options: [
        'Key West is off the coast of Massachusetts.',
        'Key West is at the south-western end of the Florida Keys.',
        'Key West is in the north-east of the US.'
      ],
      answer: 1,
      explain: 'Key West is in Florida, at the south-western end of the Florida Keys.'
    },
    {
      q: 'Which place is more closely linked to the whaling story of the Essex?',
      options: ['Key West', 'Nantucket', 'Both places equally'],
      answer: 1,
      explain: 'The whaleship Essex is strongly connected with Nantucket’s whaling history.'
    }
  ];

  const quizTwo = [
    {
      q: 'Complete the sentence: Key West is ___ than Nantucket at night.',
      options: ['more lively', 'livelier more', 'most lively'],
      answer: 0,
      explain: 'With lively, we can say more lively.'
    },
    {
      q: 'Complete the sentence: Brant Point is one of the ___ places in Nantucket.',
      options: ['most iconic', 'more iconic', 'iconicest'],
      answer: 0,
      explain: 'We say one of the most iconic places.'
    },
    {
      q: 'Complete the sentence: Nantucket is ___ the coast of Massachusetts.',
      options: ['at the end of', 'off', 'more'],
      answer: 1,
      explain: 'The correct phrase is off the coast of Massachusetts.'
    }
  ];

  const oralTasks = [
    {
      title: 'Describe Nantucket for a calm traveller',
      prompt: 'Describe Nantucket, say where it is, what you can see or do there, and explain why it may suit a traveller who likes calm places.',
      plan: ['location', 'historic streets / lighthouse / museums', 'atmosphere', 'why it suits calm travellers'],
      models: {
        A2: 'Nantucket is in Massachusetts, in the north-east of the United States. It is an island off the coast of Massachusetts. It has historic streets, small shops and a lighthouse. The atmosphere looks calm and charming. I think it is a good place for a calm traveller because it is quieter than Key West.',
        B1: 'Nantucket is an island in Massachusetts, in the north-east of the US, south of Cape Cod. It is known for its cobblestone streets, its lighthouse and its maritime history. Compared with Key West, it looks smaller, quieter and more traditional. I would recommend it to a calm traveller because the atmosphere seems elegant and peaceful, and visitors can enjoy walking, shopping and visiting the Whaling Museum.',
        B2: 'Nantucket is a small island off the coast of Massachusetts in the north-east of the United States. What makes it attractive is its combination of maritime history, elegant architecture and a peaceful village atmosphere. Compared with Key West, it is less tropical and less lively at night, but it is more traditional and arguably more refined. I would recommend Nantucket to travellers who enjoy history, quiet walks and a more intimate island experience.'
      }
    },
    {
      title: 'Compare Nantucket and Key West',
      prompt: 'Compare the two places using at least two comparatives and one reason.',
      plan: ['location', 'architecture', 'atmosphere', 'history', 'your preference'],
      models: {
        A2: 'Nantucket and Key West are both attractive islands, but they are different. Nantucket is quieter and more traditional than Key West. Key West is more colourful and more tropical than Nantucket. Nantucket is in Massachusetts, while Key West is in Florida. I would choose Key West because it looks warmer and more lively.',
        B1: 'Although both places are attractive coastal destinations, they offer very different experiences. Nantucket is smaller, quieter and more historic, whereas Key West is more colourful, more tropical and more lively at night. Nantucket is in Massachusetts, off the coast of New England, while Key West is in Florida at the end of the Florida Keys. I would choose Nantucket for a peaceful cultural trip, but I would recommend Key West to travellers who prefer sunshine, nightlife and sunsets.',
        B2: 'Nantucket and Key West are both iconic American islands, yet they appeal to visitors in very different ways. Nantucket is more traditional, more historic and more understated, thanks to its cobblestone streets, lighthouse and strong whaling heritage. By contrast, Key West is more vibrant, more tropical and more festive, with colourful houses, literary history and a famous sunset culture. Personally, I would recommend Nantucket for a refined and peaceful escape, whereas Key West would be ideal for someone seeking colour, energy and a relaxed island lifestyle.'
      }
    },
    {
      title: 'Recommend one place to a couple interested in history',
      prompt: 'Choose Nantucket or Key West and explain which place would be better for a couple who loves history and culture.',
      plan: ['name the place', 'mention location', 'give historical reasons', 'compare briefly', 'recommend'],
      models: {
        A2: 'I would recommend Nantucket to a couple who likes history. It is in Massachusetts, in the north-east of the US. It has a lighthouse and a famous whaling history. It is quieter than Key West, so the couple can visit and relax. It looks very charming.',
        B1: 'For a couple interested in history, I would probably recommend Nantucket. It is located in Massachusetts, off the coast of New England, and it has a strong maritime identity. Visitors can see the Whaling Museum, Brant Point Lighthouse and the historic town centre. Key West is also interesting because of Hemingway and the shipwreck history, but Nantucket feels more traditional and more directly linked to an important part of American maritime history.',
        B2: 'If the couple is especially interested in history and culture, Nantucket would be my first recommendation. Its maritime past, symbolised by the Whaling Museum and Brant Point Lighthouse, gives the island a strong historical personality. In addition, the town itself feels like a living museum because of the cobblestone streets and preserved buildings. Key West is also culturally rich, particularly because of Hemingway and its wrecking history, but Nantucket offers a more coherent and immersive historical atmosphere.'
      }
    },
    {
      title: 'Recommend one place for atmosphere and nightlife',
      prompt: 'Recommend the better destination for travellers who want energy, colour and evening activities.',
      plan: ['say the destination', 'use 2 comparatives', 'mention evening life or atmosphere', 'give your reason'],
      models: {
        A2: 'I would recommend Key West. It is in Florida, in the south-east of the US. It is more colourful and more lively than Nantucket. People can enjoy the sunset and the evening atmosphere. I think it is better for travellers who want energy.',
        B1: 'For travellers who want colour, atmosphere and nightlife, I would clearly recommend Key West. It is more tropical and more lively than Nantucket, especially in the evening. The colourful streets, sunset culture and relaxed island life make it a strong choice for people who want a more energetic trip. Nantucket is charming, but it is calmer and less lively at night.',
        B2: 'Travellers who are looking for colour, energy and memorable evenings would probably prefer Key West. Compared with Nantucket, it is more vibrant, more tropical and more socially active after dark. Places such as Mallory Square and the lively streets of Old Town create an experience that feels dynamic and festive. Nantucket is beautiful, but its appeal is more discreet and peaceful than energetic.'
      }
    }
  ];

  const writingTasks = [
    {
      title: 'Write a short comparison paragraph',
      prompt: 'Write 80–125 words to compare Nantucket and Key West. Mention their location, one historical point and your preference.',
      models: {
        A2: 'Nantucket and Key West are both beautiful places in the United States. Nantucket is in Massachusetts, in the north-east of the country, while Key West is in Florida, in the south-east. Nantucket is quieter and more traditional than Key West. It is famous for its whaling history and lighthouse. Key West is more colourful and more tropical. It is also famous for the Hemingway Home. I would prefer Nantucket because I like peaceful places and historic streets.',
        B1: 'Although Nantucket and Key West are both island destinations, they offer different experiences. Nantucket is located in Massachusetts, off the coast of New England, and it is known for its maritime past, its Whaling Museum and Brant Point Lighthouse. By contrast, Key West is in Florida at the end of the Florida Keys, and it is famous for its colourful houses, literary history and lively sunset atmosphere. Nantucket is quieter and more traditional, whereas Key West is warmer and more lively. Personally, I would choose Nantucket because I prefer calm, elegant places.',
        B2: 'Nantucket and Key West are two memorable American islands, but their identities are quite different. Nantucket, which lies off the coast of Massachusetts in the north-east of the United States, is strongly associated with maritime history, whaling heritage and refined New England charm. Key West, by contrast, stands at the south-western end of the Florida Keys and offers a more tropical, colourful and festive atmosphere. Its Hemingway connection and shipwreck history add an important cultural dimension. While Key West appears more vibrant and exotic, I would still choose Nantucket because its historic character and peaceful elegance appeal to me more.'
      }
    },
    {
      title: 'Write a recommendation email',
      prompt: 'Write a short email to a friend and recommend one of the two places for a holiday. Explain why.',
      models: {
        A2: `Hi,

I would like to recommend Nantucket for your next holiday. It is in Massachusetts, in the north-east of the US. It is smaller and quieter than Key West. You can walk in the town centre, see the lighthouse and enjoy the calm atmosphere. It is a very charming place. I think you would like it because you enjoy peaceful holidays.

Best,
Myriam`,
        B1: `Hi,

If you are looking for a charming holiday destination, I would recommend Nantucket. It is an island in Massachusetts, south of Cape Cod, and it has a strong historical atmosphere. Compared with Key West, it is quieter and more traditional, which makes it perfect for relaxed walks and cultural visits. You could visit the Whaling Museum, Brant Point Lighthouse and the lovely town centre. I think you would enjoy it because you like peaceful places with character.

Best wishes,
Myriam`,
        B2: `Hi,

After comparing both destinations, I would recommend Nantucket for your next holiday. It is an island off the coast of Massachusetts in the north-east of the US, and it offers a beautiful combination of history, coastal scenery and elegance. Unlike Key West, which is more tropical and lively, Nantucket feels more refined and peaceful. The cobblestone streets, lighthouse and maritime heritage make it particularly memorable. Since you enjoy quiet places with cultural interest, I think Nantucket would suit you perfectly.

All the best,
Myriam`
      }
    },
    {
      title: 'Write about the best place for history lovers',
      prompt: 'Write 80–125 words to explain which destination is best for history lovers and why.',
      models: {
        A2: 'I think Nantucket is the best place for history lovers. It is in Massachusetts and it has a famous maritime history. People can visit the Whaling Museum and Brant Point Lighthouse. The town looks old and traditional. Key West also has history because of Hemingway, but Nantucket seems more historic to me. That is why I would recommend it to people who love history.',
        B1: 'In my opinion, Nantucket is the better destination for history lovers. The island is located off the coast of Massachusetts and has a strong maritime identity. Tourists can discover the Whaling Museum, the lighthouse and the historic town centre. It also has a connection with the true story of the whaleship Essex. Key West is culturally rich as well, especially because of Hemingway and the shipwreck history, but Nantucket feels more traditional and more directly linked to a major period of American history.',
        B2: 'For visitors who are especially interested in history, Nantucket is probably the stronger choice. Its location off the coast of Massachusetts and its preserved town centre immediately create a sense of the past. More importantly, the island’s whaling heritage, represented by the Whaling Museum and the legacy of the Essex tragedy, gives Nantucket a distinctive historical depth. Key West certainly has a rich cultural identity, particularly because of Hemingway and its wrecking past, yet Nantucket offers a more cohesive and immersive historical experience overall.'
      }
    }
  ];

  function renderGalleryTabs() {
    const host = $('#galleryTabs');
    host.innerHTML = '';
    images.forEach((img, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tab-btn' + (idx === state.currentImage ? ' active' : '');
      btn.textContent = img.title;
      btn.addEventListener('click', () => {
        state.currentImage = idx;
        renderGalleryTabs();
        renderCurrentImage();
      });
      host.appendChild(btn);
    });
  }

  function renderCurrentImage() {
    const img = images[state.currentImage];
    $('#placeImage').src = img.src;
    $('#placeImage').alt = img.alt;
    $('#placeTheme').textContent = img.theme;
    $('#placeTitle').textContent = img.title;
    $('#placeText').textContent = img.text;
    $('#placeStarter').textContent = img.starter;
    const ul = $('#placePrompts');
    ul.innerHTML = '';
    img.prompts.forEach(prompt => {
      const li = document.createElement('li');
      li.textContent = prompt;
      ul.appendChild(li);
    });
  }

  function renderVocab() {
    const categories = ['All', ...new Set(vocab.map(v => v.cat))];
    const filterHost = $('#vocabFilters');
    filterHost.innerHTML = '';
    categories.forEach(cat => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'filter-btn' + (cat === state.vocabCategory ? ' active' : '');
      btn.textContent = cat;
      btn.addEventListener('click', () => {
        state.vocabCategory = cat;
        renderVocab();
      });
      filterHost.appendChild(btn);
    });

    const grid = $('#vocabGrid');
    grid.innerHTML = '';
    vocab.filter(v => state.vocabCategory === 'All' || v.cat === state.vocabCategory).forEach(item => {
      const card = document.createElement('article');
      card.className = 'vocab-card';
      card.innerHTML = `
        <h4><span>${item.word}</span><span class="pill">${item.cat}</span></h4>
        <div class="fr">FR: ${item.fr}</div>
        <div class="vocab-meta"><strong>Definition:</strong> ${item.def}</div>
        <div class="vocab-meta"><strong>Example:</strong> ${item.ex}</div>
      `;
      grid.appendChild(card);
    });
  }

  function makeQuiz(hostId, questions) {
    const host = $(hostId);
    host.innerHTML = '';
    questions.forEach((item, idx) => {
      const block = document.createElement('div');
      block.className = 'question-block';
      const q = document.createElement('div');
      q.innerHTML = `<strong>${idx + 1}.</strong> ${item.q}`;
      block.appendChild(q);

      const options = document.createElement('div');
      options.className = 'options';
      item.options.forEach((opt, optIdx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'option-btn';
        btn.textContent = opt;
        btn.addEventListener('click', () => {
          const feedback = block.querySelector('.feedback');
          if (optIdx === item.answer) {
            feedback.className = 'feedback correct';
            feedback.textContent = 'Correct. ' + item.explain;
          } else {
            feedback.className = 'feedback incorrect';
            feedback.textContent = 'Not quite. ' + item.explain;
          }
        });
        options.appendChild(btn);
      });
      block.appendChild(options);
      const feedback = document.createElement('div');
      feedback.className = 'feedback';
      block.appendChild(feedback);
      host.appendChild(block);
    });
  }

  function renderLevels() {
    const host = $('#levelButtons');
    host.innerHTML = '';
    [
      {key:'A2', label:'A2+'},
      {key:'B1', label:'B1'},
      {key:'B2', label:'B2'}
    ].forEach(level => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'level-btn' + (state.level === level.key ? ' active' : '');
      btn.textContent = level.label;
      btn.addEventListener('click', () => {
        state.level = level.key;
        renderLevels();
        renderOral();
        renderWriting();
      });
      host.appendChild(btn);
    });
  }

  function renderOralSelect() {
    const select = $('#oralTask');
    select.innerHTML = oralTasks.map((task, i) => `<option value="${i}">${task.title}</option>`).join('');
    select.addEventListener('change', renderOral);
    renderOral();
  }

  function renderOral() {
    const idx = Number($('#oralTask').value || 0);
    const task = oralTasks[idx];
    $('#oralTitle').textContent = task.title;
    $('#oralPrompt').textContent = task.prompt;
    const plan = $('#oralPlan');
    plan.innerHTML = '';
    task.plan.forEach(step => {
      const li = document.createElement('li');
      li.textContent = step;
      plan.appendChild(li);
    });
    const model = $('#oralModel');
    model.innerHTML = `<strong>${state.level === 'A2' ? 'A2+' : state.level} model:</strong><br>${task.models[state.level]}`;
  }

  function renderWritingSelect() {
    const select = $('#writingTask');
    select.innerHTML = writingTasks.map((task, i) => `<option value="${i}">${task.title}</option>`).join('');
    select.addEventListener('change', renderWriting);
    renderWriting();
  }

  function renderWriting() {
    const idx = Number($('#writingTask').value || 0);
    const task = writingTasks[idx];
    $('#writingTitle').textContent = task.title;
    $('#writingPrompt').textContent = task.prompt;
    const model = $('#writingModel');
    model.innerHTML = `<strong>${state.level === 'A2' ? 'A2+' : state.level} model:</strong><br>${task.models[state.level].replace(/\n/g, '<br>')}`;
  }

  function hookBuilder() {
    $('#builderCheck').addEventListener('click', () => {
      const p1 = $('#builderPlace').value;
      const adj = $('#builderAdj').value;
      const p2 = $('#builderPlace2').value;
      const reason = $('#builderReason').value;
      const feedback = $('#builderFeedback');
      if (p1 === p2) {
        feedback.className = 'feedback incorrect';
        feedback.textContent = 'Choose two different places so the comparison makes sense.';
        return;
      }
      feedback.className = 'feedback correct';
      feedback.textContent = `${p1} ${adj} ${p2} ${reason}`;
    });
  }

  function hookModelToggles() {
    $('#toggleOralModel').addEventListener('click', () => {
      const panel = $('#oralModel');
      panel.classList.toggle('hidden');
      $('#toggleOralModel').textContent = panel.classList.contains('hidden') ? 'Show model answer' : 'Hide model answer';
    });
    $('#toggleWritingModel').addEventListener('click', () => {
      const panel = $('#writingModel');
      panel.classList.toggle('hidden');
      $('#toggleWritingModel').textContent = panel.classList.contains('hidden') ? 'Show model answer' : 'Hide model answer';
    });
  }

  function init() {
    renderGalleryTabs();
    renderCurrentImage();
    renderVocab();
    makeQuiz('#quizOne', quizOne);
    makeQuiz('#quizTwo', quizTwo);
    renderLevels();
    renderOralSelect();
    renderWritingSelect();
    hookBuilder();
    hookModelToggles();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
