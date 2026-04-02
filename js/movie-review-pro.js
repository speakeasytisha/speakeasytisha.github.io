(function () {
  'use strict';

  var state = {
    score: 0,
    total: 0,
    accent: 'us',
    compact: true,
    selectedMovieId: 'project-hail-mary',
    selectedSortChipId: null,
    sortPlacements: {},
    timers: {
      prep: null,
      speak: null,
      prepValue: 20,
      speakValue: 75
    }
  };

  var movies = [
    {
      id: 'project-hail-mary',
      title: 'Project Hail Mary',
      year: 2026,
      runtime: '2h 36m',
      runtimeWords: '2 hours and 36 minutes',
      rating: 'PG-13',
      imdb: '8.4',
      primaryGenre: 'Sci-Fi',
      genres: ['Sci-Fi', 'Thriller', 'Adventure'],
      icon: '🚀',
      audience: 'best for teens and adults who enjoy ambitious science-fiction and suspense',
      pros: 'the intelligent premise, emotional tension, and large-scale sense of mission',
      cons: 'the long runtime and science-heavy details may feel demanding to some viewers',
      description: 'A science teacher wakes up alone on a spacecraft with no memory of how he got there. As he slowly reconstructs the mission, he realizes he may be humanity’s only chance to stop a mysterious threat to the sun.'
    },
    {
      id: 'dhurandhar-the-revenge',
      title: 'Dhurandhar The Revenge',
      year: 2026,
      runtime: '3h 50m',
      runtimeWords: '3 hours and 50 minutes',
      rating: 'Not listed',
      imdb: '8.6',
      primaryGenre: 'Action/Adventure',
      genres: ['Action/Adventure', 'Crime', 'Thriller'],
      icon: '🔥',
      audience: 'best for viewers who enjoy intense action, crime power struggles, and very long thrillers',
      pros: 'the scale, tension, and ruthless atmosphere',
      cons: 'the extreme runtime may be too heavy for casual viewers',
      description: 'After a major death creates a dangerous power vacuum, alliances collapse and violence escalates. The story focuses on revenge, survival, and shifting loyalties in a brutal criminal world.'
    },
    {
      id: 'ready-or-not-2',
      title: 'Ready or Not 2: Here I Come',
      year: 2026,
      runtime: '1h 48m',
      runtimeWords: '1 hour and 48 minutes',
      rating: 'R',
      imdb: '7.0',
      primaryGenre: 'Horror/Thriller',
      genres: ['Horror/Thriller', 'Dark Comedy', 'Action'],
      icon: '🩸',
      audience: 'appropriate mainly for adults and older teens who can handle violent, darkly comic horror',
      pros: 'the fast pacing, survival tension, and chaotic energy',
      cons: 'the violence and dark tone clearly limit the audience',
      description: 'After surviving a deadly game, Grace is pulled into another violent fight for survival. Rival families and a power struggle push the story toward horror, action, and dark comedy.'
    },
    {
      id: 'hoppers',
      title: 'Hoppers',
      year: 2026,
      runtime: '1h 44m',
      runtimeWords: '1 hour and 44 minutes',
      rating: 'PG',
      imdb: '7.5',
      primaryGenre: 'Family/Animation',
      genres: ['Family/Animation', 'Sci-Fi', 'Comedy'],
      icon: '🦫',
      audience: 'ideal for families, children, and viewers who want a lighter film with imagination and humor',
      pros: 'the playful concept, family appeal, and accessible tone',
      cons: 'adults looking for darker or more realistic drama may find it too light',
      description: 'A teenage animal lover uses advanced technology to place her consciousness into a robotic beaver. Through that unusual experience, she uncovers secrets in the animal world and beyond.'
    },
    {
      id: 'they-will-kill-you',
      title: 'They Will Kill You',
      year: 2026,
      runtime: '1h 34m',
      runtimeWords: '1 hour and 34 minutes',
      rating: 'R',
      imdb: '6.5',
      primaryGenre: 'Horror/Thriller',
      genres: ['Horror/Thriller', 'Action', 'Dark Comedy'],
      icon: '🏙️',
      audience: 'mainly for adults who enjoy violent, strange, and highly stylized horror',
      pros: 'the energy, visual style, and bold lead performance',
      cons: 'the gore and chaotic tone may feel excessive or uneven',
      description: 'A woman working in a New York high-rise discovers disturbing disappearances and sinister secrets inside the building. The film combines horror, action, and grotesque dark humor.'
    },
    {
      id: 'goat',
      title: 'GOAT',
      year: 2026,
      runtime: '1h 40m',
      runtimeWords: '1 hour and 40 minutes',
      rating: 'PG',
      imdb: '6.8',
      primaryGenre: 'Family/Animation',
      genres: ['Family/Animation', 'Sports', 'Comedy'],
      icon: '🏀',
      audience: 'appropriate for families, sports fans, and viewers who enjoy underdog stories',
      pros: 'the accessible sports theme, upbeat energy, and family-friendly spirit',
      cons: 'some viewers may want more depth than a simple inspirational story offers',
      description: 'A young goat dreams of playing a high-intensity sport dominated by larger, stronger athletes. The film turns that underdog ambition into an energetic animated sports story.'
    },
    {
      id: 'scream-7',
      title: 'Scream 7',
      year: 2026,
      runtime: '1h 49m',
      runtimeWords: '1 hour and 49 minutes',
      rating: 'R',
      imdb: '5.6',
      primaryGenre: 'Horror/Thriller',
      genres: ['Horror/Thriller', 'Mystery', 'Slasher'],
      icon: '🔪',
      audience: 'best for horror fans and mature viewers who enjoy slasher mysteries',
      pros: 'the franchise familiarity, suspense, and mystery element',
      cons: 'younger viewers should avoid it because of violent content and intense scenes',
      description: 'A new Ghostface killer appears in the town where Sidney Prescott has built a new life. The fresh attacks force the characters back into a violent mystery filled with fear and suspicion.'
    },
    {
      id: 'reminders-of-him',
      title: 'Reminders of Him',
      year: 2026,
      runtime: '1h 54m',
      runtimeWords: '1 hour and 54 minutes',
      rating: 'PG-13',
      imdb: '6.4',
      primaryGenre: 'Romance/Drama',
      genres: ['Romance/Drama', 'Emotional'],
      icon: '💌',
      audience: 'a strong choice for viewers who like emotional stories, redemption arcs, and romance',
      pros: 'the emotional intensity and second-chance theme',
      cons: 'viewers looking for fast action may find it too intimate or sentimental',
      description: 'This romance drama centers on forgiveness, loss, and the possibility of a second chance. It focuses more on emotional repair and relationships than on action or spectacle.'
    },
    {
      id: 'undertone',
      title: 'Undertone',
      year: 2025,
      runtime: '1h 34m',
      runtimeWords: '1 hour and 34 minutes',
      rating: 'R',
      imdb: '6.2',
      primaryGenre: 'Horror/Thriller',
      genres: ['Horror/Thriller', 'Supernatural'],
      icon: '🎙️',
      audience: 'suitable for mature viewers who enjoy paranormal tension and atmospheric horror',
      pros: 'the eerie concept and strong atmosphere',
      cons: 'the slow-build tension may not satisfy viewers who expect nonstop action',
      description: 'The host of a paranormal podcast receives terrifying recordings and begins to feel haunted by them. The story builds fear through sound, mystery, and psychological pressure.'
    },
    {
      id: 'the-ai-doc',
      title: 'The AI Doc: Or How I Became an Apocaloptimist',
      year: 2026,
      runtime: '1h 43m',
      runtimeWords: '1 hour and 43 minutes',
      rating: 'PG-13',
      imdb: '7.1',
      primaryGenre: 'Documentary',
      genres: ['Documentary', 'Technology'],
      icon: '🤖',
      audience: 'appropriate for teens and adults interested in technology, society, and the future of AI',
      pros: 'the timely subject and thought-provoking interviews',
      cons: 'it is less suitable for viewers who want pure entertainment or fictional storytelling',
      description: 'A filmmaker and future father investigates the promises and dangers of artificial intelligence. Through interviews and personal reflection, the documentary explores the kind of world the next generation may inherit.'
    },
    {
      id: 'the-mummy-returns',
      title: 'The Mummy Returns',
      year: 2001,
      runtime: '2h 10m',
      runtimeWords: '2 hours and 10 minutes',
      rating: 'PG-13',
      imdb: '6.4',
      primaryGenre: 'Action/Adventure',
      genres: ['Action/Adventure', 'Fantasy', 'Thriller'],
      icon: '🏺',
      audience: 'good for teens and adults who enjoy fantasy adventure with action and classic blockbuster energy',
      pros: 'the adventure scale, fantasy spectacle, and energetic pace',
      cons: 'some effects and story choices may feel dated compared with newer films',
      description: 'The return of Imhotep brings ancient danger back to life in London. The film mixes action, fantasy, monsters, and treasure-hunt adventure in a classic blockbuster style.'
    }
  ];

  var categoryTargets = [
    'Sci-Fi',
    'Action/Adventure',
    'Horror/Thriller',
    'Romance/Drama',
    'Family/Animation',
    'Documentary'
  ];

  var tenseQuestions = [
    {
      prompt: 'Choose the best sentence to describe a movie plot.',
      options: [
        'The film follows a teacher who wakes up alone in space.',
        'The film followed a teacher who wakes up alone in space.',
        'The film is following a teacher who woke up alone in space.'
      ],
      correct: 0,
      explain: 'Use the present simple to describe plot and general content.'
    },
    {
      prompt: 'Choose the best sentence about your viewing experience.',
      options: [
        'I watch it last weekend and the ending surprises me.',
        'I watched it last weekend, and the ending surprised me.',
        'I have watch it last weekend, and the ending surprised me.'
      ],
      correct: 1,
      explain: 'Use the past simple for completed actions in the past.'
    },
    {
      prompt: 'Choose the best sentence for general experience.',
      options: [
        'I have seen this film twice, so I can compare it with similar titles.',
        'I saw this film twice, so I can compare it with similar titles ever.',
        'I am seeing this film twice already.'
      ],
      correct: 0,
      explain: 'Use the present perfect for life experience without a finished time reference.'
    },
    {
      prompt: 'Choose the most professional recommendation sentence.',
      options: [
        'Families should probably choose Hoppers because it is lighter and more accessible.',
        'Families must choose Hoppers because all families like cartoons.',
        'Families choosing Hoppers because it is more light.'
      ],
      correct: 0,
      explain: 'Use modals like should, may, or might to recommend politely and clearly.'
    }
  ];

  var audienceQuestions = [
    {
      prompt: 'Which sentence is the most appropriate for an R-rated horror movie?',
      options: [
        'It is perfect for very young children because it is energetic.',
        'It is mainly suitable for mature viewers because of violent and disturbing scenes.',
        'It is appropriate for everyone because ratings are not important.'
      ],
      correct: 1,
      explain: 'R-rated films are generally described as suitable for mature viewers.'
    },
    {
      prompt: 'Which sentence best describes a PG family animation?',
      options: [
        'It may appeal to families and younger viewers who want something imaginative and light.',
        'It is only for adults because animation is usually very serious.',
        'It is probably too violent for almost everyone.'
      ],
      correct: 0,
      explain: 'A PG family film can be recommended to families and younger viewers.'
    },
    {
      prompt: 'Which sentence sounds the most professional?',
      options: [
        'This one is good for people who likes weird things maybe.',
        'It may appeal to viewers who enjoy psychological tension and a slower build.',
        'This movie is for all because it is a movie.'
      ],
      correct: 1,
      explain: '“It may appeal to viewers who…” is a strong professional pattern.'
    }
  ];

  var speakingPrompts = [
    'Describe a movie from the list that you would recommend to a teenager and explain why it is appropriate.',
    'Compare two movies from different categories and explain which one is more suitable for a family evening.',
    'Choose one thriller from the list and explain its strengths, weaknesses, and target audience.',
    'Talk about a movie you would not recommend to young viewers and justify your opinion clearly.',
    'Present one film as if you were speaking to an examiner: title, genre, rating, runtime, plot, pros, cons, and recommendation.'
  ];

  var writingTasks = {
    essay: [
      {
        task: 'Write a short opinion essay (120–160 words). Which movie from the list would you recommend to a mixed audience of teenagers and adults? Compare it with at least one other title, mention the rating and runtime, and explain why it is more appropriate.',
        model: `If I had to recommend one movie to both teenagers and adults, I would choose Project Hail Mary. To begin with, it is a PG-13 science-fiction thriller, so it is intense without being as extreme as the R-rated horror films in the list. In addition, although it runs for 2 hours and 36 minutes, the ambitious plot and emotional tension make it feel meaningful rather than empty.

The film follows a science teacher who wakes up alone on a spaceship and gradually discovers that he may be humanity’s last hope. What I find most effective is the balance between suspense, science, and emotion. Compared with Scream 7 or Ready or Not 2, it is less violent and more suitable for a wider audience. Overall, it is one of the most interesting and appropriate choices for viewers who want something exciting, intelligent, and memorable.`
      },
      {
        task: 'Write a short essay (120–160 words). Explain which category from the movie list is the most effective for exam-style speaking and writing practice: horror/thriller, romance/drama, science-fiction, family animation, or documentary. Support your opinion with examples.',
        model: `In my opinion, science-fiction is the most effective category for exam-style speaking and writing practice. First, it naturally encourages detailed description because students can talk about the setting, the mission, the technology, and the emotional stakes. Project Hail Mary is a strong example because it allows the speaker to discuss genre, audience, tension, and scientific themes.

In contrast, family animation such as Hoppers or GOAT is easier to describe, but the language can become simpler. Horror films can also produce strong opinions, yet they often lead students to repeat the same words such as scary or violent. Science-fiction usually offers richer vocabulary and more complex comparisons. Overall, it is the best category for candidates who want to sound precise, thoughtful, and well-structured during an exam.`
      }
    ],
    review: [
      {
        task: 'Write a professional review paragraph (100–140 words) about one movie from the list. Include title, genre, rating, runtime, plot, strengths, weaknesses, and audience.',
        model: `Reminders of Him is a PG-13 romance drama that runs for 1 hour and 54 minutes. Rather than focusing on spectacle, the film concentrates on forgiveness, emotional pain, and the possibility of a second chance. This makes it quite different from the louder action or horror titles in the set.

What works particularly well is the emotional intensity of the story. It is likely to appeal to viewers who enjoy intimate character-driven films. However, audiences looking for fast pacing or visual excitement may find it too quiet. Overall, it is a solid choice for people who appreciate emotional storytelling and reflective drama.`
      },
      {
        task: 'Write a review paragraph (100–140 words) about a thriller from the list. Mention why it is or is not appropriate for younger viewers.',
        model: `Undertone is an R-rated supernatural thriller with a runtime of 1 hour and 34 minutes. The story follows a paranormal podcast host who becomes haunted by terrifying recordings, and the film builds tension through mystery, sound, and fear rather than through nonstop action.

One of its strongest points is the atmosphere. The premise is eerie, focused, and effective. However, the slow-build structure may frustrate viewers who expect constant shocks. Because of its disturbing themes and mature tone, it is not suitable for younger audiences. Overall, it is best for adults who enjoy psychological tension and carefully constructed horror.`
      }
    ],
    email: [
      {
        task: 'Write an email (110–150 words) to a friend who wants a movie recommendation for a family evening. Recommend one title from the list and explain why it is appropriate.',
        model: `Subject: Movie recommendation for your family evening

Hi,

If you are looking for a film that works well for a family evening, I would recommend Hoppers. It is a PG animated science-fiction comedy, and it runs for 1 hour and 44 minutes, so it is long enough to feel complete without becoming tiring.

The story follows a teenage animal lover who uses technology to enter the body of a robotic beaver, which gives the film an imaginative and original premise. What makes it especially suitable is the light tone and family-friendly style. Compared with the horror titles on the list, it is clearly more accessible for younger viewers.

Overall, it seems like a fun, creative choice for a mixed audience.

Best,
[Your name]`
      },
      {
        task: 'Write an email (110–150 words) to a colleague recommending a film for adults who enjoy serious discussion. Mention one alternative and explain why your main choice is better.',
        model: `Subject: Film suggestion for our discussion group

Hello,

For an adult discussion group, I would strongly recommend The AI Doc: Or How I Became an Apocaloptimist. It is a PG-13 documentary with a runtime of 1 hour and 43 minutes, and it explores both the promises and the risks of artificial intelligence through interviews and personal reflection.

Although Project Hail Mary is also thought-provoking, the documentary is more directly connected to real-world debates. In addition, it is easier to use as a starting point for conversation because the themes are current and concrete. It may not be as entertaining as a fictional thriller, but it is more suitable if the goal is discussion.

Best regards,
[Your name]`
      }
    ]
  };

  var summaryChips = [
    'It is a science-fiction thriller.',
    'It runs for 2 hours and 36 minutes.',
    'The film follows a teacher in space.',
    'What stands out most is the suspense.',
    'It may appeal to teens and adults.',
    'However, the runtime is quite long.'
  ];

  var upgradeChips = [
    'To begin with, ',
    'the film follows ',
    'a determined protagonist ',
    'who faces an extreme situation. ',
    'In addition, ',
    'the pacing is surprisingly effective. ',
    'However, ',
    'some viewers may find it too long. ',
    'Overall, ',
    'I would recommend it to viewers who enjoy ambitious storytelling.'
  ];

  var goodChips = [
    'What works particularly well is…',
    'The strongest aspect is…',
    'The atmosphere is effective because…',
    'The story feels ambitious and engaging.',
    'The performances are convincing.'
  ];

  var weakChips = [
    'However, the pacing may feel slow.',
    'Some viewers may find it too violent.',
    'The runtime could feel excessive.',
    'The tone may be too dark for some audiences.',
    'It is less suitable for viewers who prefer lighter stories.'
  ];

  var speakingStarters = [
    'I would like to talk about…',
    'To begin with, this film is…',
    'It is rated… and it runs for…',
    'The story follows…',
    'What I find effective is…',
    'However, one limitation is…',
    'Compared with…',
    'Overall, I would recommend it to…'
  ];

  var writingPhraseChips = [
    'To begin with, ',
    'The film follows ',
    'What stands out most is ',
    'In addition, ',
    'However, ',
    'Compared with ',
    'Overall, I would recommend it to '
  ];


  var adjectiveChips = [
    'gripping',
    'suspenseful',
    'thought-provoking',
    'emotionally powerful',
    'heartwarming',
    'intense',
    'ambitious',
    'predictable',
    'uneven',
    'moving',
    'family-friendly',
    'visually striking'
  ];

  var adverbChips = [
    'extremely',
    'surprisingly',
    'remarkably',
    'particularly',
    'highly',
    'slightly',
    'fairly',
    'mostly',
    'clearly',
    'genuinely'
  ];

  var audienceVocabChips = [
    'It may appeal to viewers who enjoy…',
    'It is aimed mainly at…',
    'It is suitable for…',
    'It is less appropriate for…',
    'I would strongly recommend it to…',
    'It is worth watching because…',
    'The plot revolves around…',
    'The film deals with…'
  ];

  var categoryVocab = [
    {
      icon: '😱',
      title: 'Thriller / horror',
      text: 'suspenseful, unsettling, violent, eerie, disturbing, intense, dark, slow-build tension'
    },
    {
      icon: '💌',
      title: 'Romance / drama',
      text: 'emotional, moving, intimate, reflective, character-driven, heartfelt, sentimental'
    },
    {
      icon: '🚀',
      title: 'Science-fiction / action',
      text: 'ambitious, imaginative, high-stakes, futuristic, action-packed, visually striking'
    },
    {
      icon: '🎈',
      title: 'Family / animation',
      text: 'light, playful, accessible, entertaining, family-friendly, uplifting, imaginative'
    },
    {
      icon: '📚',
      title: 'Documentary',
      text: 'informative, thought-provoking, timely, realistic, eye-opening, discussion-friendly'
    }
  ];

  var smsPhraseChips = [
    'Hi! ',
    'Are you free on Friday evening? ',
    'Would you like to see ',
    'at 8:15? ',
    'It looks really good. ',
    'I would love to go. ',
    'Sorry, I am busy that night. ',
    'Are you free on Saturday instead? ',
    'Let me know!'
  ];

  function byId(id) {
    return document.getElementById(id);
  }

  function movieById(id) {
    return movies.find(function (movie) {
      return movie.id === id;
    });
  }

  function updateScoreDisplay() {
    byId('score-display').textContent = state.score + ' / ' + state.total;
  }

  function addPoint() {
    state.score += 1;
    updateScoreDisplay();
  }

  function addPossiblePoint() {
    state.total += 1;
    updateScoreDisplay();
  }

  function setFeedback(id, message, type) {
    var box = byId(id);
    if (!box) {
      return;
    }
    box.textContent = message;
    box.classList.remove('good', 'bad');
    if (type) {
      box.classList.add(type);
    }
  }

  function copyText(text) {
    if (!navigator.clipboard) {
      window.prompt('Copy this text:', text);
      return;
    }
    navigator.clipboard.writeText(text).catch(function () {
      window.prompt('Copy this text:', text);
    });
  }

  function speakText(text) {
    if (!('speechSynthesis' in window)) {
      return;
    }
    window.speechSynthesis.cancel();
    var utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = state.accent === 'uk' ? 'en-GB' : 'en-US';
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  }

  function renderChips(targetId, items, textareaId) {
    var wrap = byId(targetId);
    wrap.innerHTML = '';
    items.forEach(function (item) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'chip';
      btn.textContent = item;
      btn.addEventListener('click', function () {
        if (textareaId) {
          var box = byId(textareaId);
          box.value += (box.value && !box.value.endsWith(' ') ? ' ' : '') + item;
          box.focus();
        } else {
          copyText(item);
        }
      });
      wrap.appendChild(btn);
    });
  }

  function renderGenreFilter() {
    var select = byId('genre-filter');
    var genreSet = ['all'];
    movies.forEach(function (movie) {
      if (genreSet.indexOf(movie.primaryGenre) === -1) {
        genreSet.push(movie.primaryGenre);
      }
    });
    select.innerHTML = genreSet.map(function (genre) {
      var label = genre === 'all' ? 'All categories' : genre;
      return '<option value="' + genre + '">' + label + '</option>';
    }).join('');
  }

  function movieCardMarkup(movie) {
    return '' +
      '<article class="movie-card' + (movie.id === state.selectedMovieId ? ' active' : '') + '" data-id="' + movie.id + '">' +
      '  <div class="movie-head">' +
      '    <div>' +
      '      <div class="small-note">' + movie.icon + ' ' + movie.year + '</div>' +
      '      <h3>' + movie.title + '</h3>' +
      '    </div>' +
      '    <div class="badge">IMDb ' + movie.imdb + '</div>' +
      '  </div>' +
      '  <div class="movie-badges">' +
      '    <span class="badge">' + movie.primaryGenre + '</span>' +
      '    <span class="badge">' + movie.rating + '</span>' +
      '    <span class="badge">' + movie.runtime + '</span>' +
      '  </div>' +
      '  <p class="movie-desc">' + movie.description + '</p>' +
      '  <p class="movie-meta"><strong>Appropriate for:</strong> ' + movie.audience + '</p>' +
      '  <p class="movie-meta"><strong>Good:</strong> ' + movie.pros + '</p>' +
      '  <p class="movie-meta"><strong>Not as strong:</strong> ' + movie.cons + '</p>' +
      '</article>';
  }

  function renderMovies() {
    var filter = byId('genre-filter').value || 'all';
    var grid = byId('movie-grid');
    grid.innerHTML = movies
      .filter(function (movie) {
        return filter === 'all' || movie.primaryGenre === filter;
      })
      .map(movieCardMarkup)
      .join('');

    Array.prototype.forEach.call(grid.querySelectorAll('.movie-card'), function (card) {
      card.addEventListener('click', function () {
        state.selectedMovieId = card.getAttribute('data-id');
        renderMovies();
        refreshSelectedMovieContent();
      });
    });
  }

  function refreshSelectedMovieContent() {
    var movie = movieById(state.selectedMovieId);
    if (!movie) {
      return;
    }

    byId('model-summary').innerHTML =
      '<strong>' + movie.title + '</strong> is a <strong>' + movie.rating + ' ' + movie.primaryGenre + '</strong> film that runs for <strong>' + movie.runtimeWords + '</strong>. ' +
      movie.description + ' What works particularly well is ' + movie.pros + '. However, ' + movie.cons + '. It is ' + movie.audience + '.';
    buildSpeakingModel();
    buildSmsModels();
  }


  function comparisonMovieFor(movie) {
    if (movie.primaryGenre === 'Family/Animation') {
      return movieById('project-hail-mary');
    }
    if (movie.primaryGenre === 'Horror/Thriller') {
      return movieById('hoppers');
    }
    if (movie.primaryGenre === 'Romance/Drama') {
      return movieById('project-hail-mary');
    }
    return movieById('hoppers');
  }

  function renderCategoryVocab() {
    var target = byId('category-vocab');
    if (!target) {
      return;
    }
    target.innerHTML = categoryVocab.map(function (item) {
      return '<article class="vocab-card"><h4>' + item.icon + ' ' + item.title + '</h4><p>' + item.text + '</p></article>';
    }).join('');
  }

  function buildDialogueModel() {
    var text = 'A: We need to recommend a movie for two teenagers and one adult. Which title would you suggest?\n' +
      'B: I would probably choose Project Hail Mary because it is exciting but not as extreme as the R-rated thrillers.\n\n' +
      'A: Good point. How could we describe it in a more professional way?\n' +
      'B: To begin with, it is a science-fiction thriller with a strong emotional core and an ambitious story.\n\n' +
      'A: What about a negative point?\n' +
      'B: However, its long runtime may feel demanding for viewers who prefer shorter, lighter films.\n\n' +
      'A: Compare it with a family movie from the list.\n' +
      'B: Compared with Hoppers, it is more intense, more serious, and clearly aimed at older viewers.';
    byId('dialogue-model').textContent = text;
  }

  function buildSpeakingModel() {
    var movie = movieById(state.selectedMovieId);
    var compareMovie = comparisonMovieFor(movie);
    if (!movie) {
      return;
    }
    var text = 'I would like to talk about ' + movie.title + '. To begin with, it is a ' + movie.rating + ' ' + movie.primaryGenre + ' film, and it runs for ' + movie.runtimeWords + '. ' +
      'The story follows ' + movie.description.charAt(0).toLowerCase() + movie.description.slice(1) + ' ' +
      'What I find most effective is ' + movie.pros + '. ' +
      'However, ' + movie.cons + '. ' +
      'Compared with ' + compareMovie.title + ', it feels ' + (movie.primaryGenre === compareMovie.primaryGenre ? 'more focused' : 'more intense and targeted at a different audience') + '. ' +
      'I watched similar films before, but this one stood out because of its tone and concept. ' +
      'Overall, I would recommend it to viewers who enjoy this kind of story.';
    byId('speaking-model').textContent = text;
  }

  function buildSmsModels() {
    var movie = movieById(state.selectedMovieId);
    if (!movie) {
      return;
    }
    byId('sms-model-invite').textContent = 'Hi! Are you free on Friday evening? Would you like to see ' + movie.title + ' at 8:15? It is a ' + movie.rating + ' ' + movie.primaryGenre + ' film and it looks really good. Let me know!';
    byId('sms-model-accept').textContent = 'Hi! Yes, that sounds great. I am free after 7, so 8:15 works for me. ' + movie.title + ' sounds exciting. See you there!';
    byId('sms-model-decline').textContent = 'Hi! I would love to go, but I am busy on Friday evening. Are you free on Saturday instead? We could still see ' + movie.title + ' then.';
  }

  function createQuestionCard(question, index, targetId) {
    var wrap = document.createElement('article');
    wrap.className = 'question-card';
    wrap.innerHTML = '<strong>' + (index + 1) + '.</strong> ' + question.prompt + '<div class="options-grid"></div><div class="feedback-box" id="' + targetId + '-fb-' + index + '"></div>';
    var optionsWrap = wrap.querySelector('.options-grid');
    question.options.forEach(function (option, optionIndex) {
      addPossiblePoint();
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'option-btn';
      btn.textContent = option;
      btn.addEventListener('click', function () {
        if (btn.disabled) {
          return;
        }
        var buttons = optionsWrap.querySelectorAll('button');
        Array.prototype.forEach.call(buttons, function (button) {
          button.disabled = true;
        });
        if (optionIndex === question.correct) {
          btn.classList.add('correct');
          addPoint();
          setFeedback(targetId + '-fb-' + index, 'Correct. ' + question.explain, 'good');
        } else {
          btn.classList.add('wrong');
          buttons[question.correct].classList.add('correct');
          setFeedback(targetId + '-fb-' + index, 'Not quite. ' + question.explain, 'bad');
        }
      });
      optionsWrap.appendChild(btn);
    });
    return wrap;
  }

  function renderQuiz(targetId, questions) {
    var target = byId(targetId);
    target.innerHTML = '';
    questions.forEach(function (question, index) {
      target.appendChild(createQuestionCard(question, index, targetId));
    });
  }

  function createSortChip(movie) {
    var chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'sort-chip';
    chip.draggable = true;
    chip.textContent = movie.icon + ' ' + movie.title;
    chip.setAttribute('data-id', movie.id);
    chip.addEventListener('click', function () {
      state.selectedSortChipId = movie.id;
      highlightSelectedSortChip();
    });
    chip.addEventListener('dragstart', function (event) {
      event.dataTransfer.setData('text/plain', movie.id);
      state.selectedSortChipId = movie.id;
      highlightSelectedSortChip();
    });
    return chip;
  }

  function highlightSelectedSortChip() {
    Array.prototype.forEach.call(document.querySelectorAll('.sort-chip'), function (chip) {
      chip.classList.toggle('selected', chip.getAttribute('data-id') === state.selectedSortChipId);
    });
  }

  function getUnplacedMovies() {
    var placedIds = Object.keys(state.sortPlacements);
    return movies.filter(function (movie) {
      return placedIds.indexOf(movie.id) === -1;
    });
  }

  function renderSortActivity() {
    var bank = byId('movie-bank');
    var board = byId('category-board');
    bank.innerHTML = '';
    board.innerHTML = '';

    getUnplacedMovies().forEach(function (movie) {
      bank.appendChild(createSortChip(movie));
    });

    categoryTargets.forEach(function (category) {
      var wrapper = document.createElement('section');
      wrapper.className = 'category-drop';
      wrapper.innerHTML = '<h3>' + category + '</h3><div class="drop-slot" data-category="' + category + '"></div>';
      var slot = wrapper.querySelector('.drop-slot');

      slot.addEventListener('dragover', function (event) {
        event.preventDefault();
      });
      slot.addEventListener('drop', function (event) {
        event.preventDefault();
        var movieId = event.dataTransfer.getData('text/plain');
        placeMovie(movieId, category);
      });
      slot.addEventListener('click', function () {
        if (state.selectedSortChipId) {
          placeMovie(state.selectedSortChipId, category);
        }
      });

      Object.keys(state.sortPlacements).forEach(function (movieId) {
        if (state.sortPlacements[movieId] === category) {
          var movie = movieById(movieId);
          slot.appendChild(createSortChip(movie));
        }
      });
      board.appendChild(wrapper);
    });
    highlightSelectedSortChip();
  }

  function placeMovie(movieId, category) {
    if (!movieId) {
      return;
    }
    state.sortPlacements[movieId] = category;
    state.selectedSortChipId = null;
    renderSortActivity();
  }

  function resetSortActivity() {
    state.sortPlacements = {};
    state.selectedSortChipId = null;
    setFeedback('category-feedback', '', '');
    renderSortActivity();
  }

  function checkSortActivity() {
    var placedCount = Object.keys(state.sortPlacements).length;
    if (placedCount !== movies.length) {
      setFeedback('category-feedback', 'Place every movie before checking.', 'bad');
      return;
    }

    var correct = 0;
    Array.prototype.forEach.call(document.querySelectorAll('.sort-chip'), function (chip) {
      chip.classList.remove('correct', 'wrong');
    });

    Object.keys(state.sortPlacements).forEach(function (movieId) {
      var movie = movieById(movieId);
      var category = state.sortPlacements[movieId];
      var chip = document.querySelector('.sort-chip[data-id="' + movieId + '"]');
      addPossiblePoint();
      if (movie.primaryGenre === category) {
        correct += 1;
        addPoint();
        if (chip) {
          chip.classList.add('correct');
        }
      } else if (chip) {
        chip.classList.add('wrong');
      }
    });

    if (correct === movies.length) {
      setFeedback('category-feedback', 'Excellent. Every movie is in the correct category.', 'good');
    } else {
      setFeedback('category-feedback', 'You got ' + correct + ' out of ' + movies.length + ' correct. Review the red items and try again.', 'bad');
    }
  }

  function buildWritingTask() {
    var type = byId('writing-task-type').value;
    var set = writingTasks[type];
    var item = set[Math.floor(Math.random() * set.length)];
    byId('writing-task').textContent = item.task;
    byId('writing-model').textContent = item.model;
  }

  function updateAccentButtons() {
    byId('accent-us').classList.toggle('active', state.accent === 'us');
    byId('accent-uk').classList.toggle('active', state.accent === 'uk');
  }

  function setupAccentAndMode() {
    byId('accent-us').addEventListener('click', function () {
      state.accent = 'us';
      updateAccentButtons();
    });
    byId('accent-uk').addEventListener('click', function () {
      state.accent = 'uk';
      updateAccentButtons();
    });
    byId('ipad-toggle').addEventListener('click', function () {
      state.compact = !state.compact;
      document.body.classList.toggle('compact', state.compact);
      byId('ipad-toggle').textContent = state.compact ? 'On' : 'Off';
      byId('ipad-toggle').classList.toggle('active', state.compact);
      byId('ipad-toggle').setAttribute('aria-pressed', state.compact ? 'true' : 'false');
    });
    document.body.classList.add('compact');
  }

  function setupCopyButtons() {
    byId('copy-transitions').addEventListener('click', function () {
      copyText('To begin with, …\nIn addition, …\nWhat stands out most is …\nHowever, …\nCompared with …\nOverall, …');
    });
    byId('copy-grammar').addEventListener('click', function () {
      copyText('Present simple: describe the plot and general facts.\nPast simple: describe your viewing experience or completed reactions.\nPresent perfect: talk about general experience.\nModals: recommend or warn politely.\nComparatives and superlatives: compare movies clearly.\nTransitions: first, in addition, however, compared with, overall.');
    });
    byId('copy-task').addEventListener('click', function () {
      copyText(byId('writing-task').textContent);
    });
    byId('copy-writing').addEventListener('click', function () {
      copyText(byId('writing-output').value);
    });
    byId('copy-report').addEventListener('click', function () {
      var checks = Array.prototype.map.call(document.querySelectorAll('.eval-check'), function (checkbox) {
        return (checkbox.checked ? '✓ ' : '□ ') + checkbox.parentNode.textContent.trim();
      }).join('\n');
      copyText('Movie Review Pro Lab — Final Checklist\n\n' + checks);
    });
  }

  function setupReviewBuilders() {
    renderChips('summary-chips', summaryChips, null);
    renderChips('upgrade-chips', upgradeChips, 'upgrade-output');
    renderChips('good-chips', goodChips, 'pros-cons-output');
    renderChips('weak-chips', weakChips, 'pros-cons-output');
    renderChips('speaking-starters', speakingStarters, 'speaking-outline');
    renderChips('writing-phrases', writingPhraseChips, 'writing-output');
    renderChips('adjective-chips', adjectiveChips, 'vocab-builder');
    renderChips('adverb-chips', adverbChips, 'vocab-builder');
    renderChips('audience-vocab-chips', audienceVocabChips, 'vocab-builder');
    renderChips('sms-chips', smsPhraseChips, 'sms-output');
    renderCategoryVocab();

    byId('clear-vocab-builder').addEventListener('click', function () {
      byId('vocab-builder').value = '';
      setFeedback('vocab-feedback', '', '');
    });
    byId('check-vocab-builder').addEventListener('click', function () {
      var text = byId('vocab-builder').value.toLowerCase();
      var checks = [
        adjectiveChips.some(function (item) { return text.indexOf(item) !== -1; }),
        adverbChips.some(function (item) { return text.indexOf(item) !== -1; }),
        text.indexOf('appeal') !== -1 || text.indexOf('suitable') !== -1 || text.indexOf('aimed') !== -1,
        text.indexOf('movie') !== -1 || text.indexOf('film') !== -1 || text.indexOf('thriller') !== -1 || text.indexOf('drama') !== -1
      ];
      addPossiblePoint();
      if (checks.filter(Boolean).length >= 3) {
        addPoint();
        setFeedback('vocab-feedback', 'Excellent. Your sentence uses richer review vocabulary.', 'good');
      } else {
        setFeedback('vocab-feedback', 'Add at least one adjective, one adverb, and one audience expression.', 'bad');
      }
    });

    byId('clear-upgrade').addEventListener('click', function () {
      byId('upgrade-output').value = '';
      setFeedback('upgrade-feedback', '', '');
    });
    byId('check-upgrade').addEventListener('click', function () {
      var text = byId('upgrade-output').value.toLowerCase();
      if (text.indexOf('however') !== -1 && text.indexOf('overall') !== -1) {
        addPossiblePoint();
        addPoint();
        setFeedback('upgrade-feedback', 'Strong structure. You used at least one contrast and one conclusion marker.', 'good');
      } else {
        addPossiblePoint();
        setFeedback('upgrade-feedback', 'Add a contrast marker such as “However,” and a conclusion such as “Overall,”.', 'bad');
      }
    });

    byId('clear-pros-cons').addEventListener('click', function () {
      byId('pros-cons-output').value = '';
      setFeedback('pros-cons-feedback', '', '');
    });
    byId('check-pros-cons').addEventListener('click', function () {
      var text = byId('pros-cons-output').value.toLowerCase();
      addPossiblePoint();
      if ((text.indexOf('however') !== -1 || text.indexOf('may') !== -1) && (text.indexOf('works') !== -1 || text.indexOf('strong') !== -1 || text.indexOf('effective') !== -1)) {
        addPoint();
        setFeedback('pros-cons-feedback', 'Well done. Your answer includes both a positive and a limitation.', 'good');
      } else {
        setFeedback('pros-cons-feedback', 'Try to include one positive point and one limitation with a linker such as “However,”.', 'bad');
      }
    });
  }

  function setupDialogue() {
    byId('check-dialogue').addEventListener('click', function () {
      var selects = document.querySelectorAll('.dialogue-select');
      var correct = 0;
      Array.prototype.forEach.call(selects, function (select) {
        addPossiblePoint();
        if (select.value === select.getAttribute('data-answer')) {
          correct += 1;
          addPoint();
          select.style.borderColor = 'rgba(31, 157, 98, 0.55)';
        } else {
          select.style.borderColor = 'rgba(196, 60, 92, 0.55)';
        }
      });
      if (correct === selects.length) {
        setFeedback('dialogue-feedback', 'Excellent. The dialogue is natural, precise, and professional.', 'good');
      } else {
        setFeedback('dialogue-feedback', 'You got ' + correct + ' out of ' + selects.length + ' correct. Focus on clear, grammatically accurate review language.', 'bad');
      }
    });

    byId('reset-dialogue').addEventListener('click', function () {
      Array.prototype.forEach.call(document.querySelectorAll('.dialogue-select'), function (select) {
        select.selectedIndex = 0;
        select.style.borderColor = '#cbd5f1';
      });
      setFeedback('dialogue-feedback', '', '');
    });

    byId('new-dialogue').addEventListener('click', function () {
      byId('reset-dialogue').click();
    });
  }

  function randomItem(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  function setupSpeaking() {
    byId('new-speaking').addEventListener('click', function () {
      byId('speaking-prompt').textContent = randomItem(speakingPrompts);
    });
    byId('speak-prompt-audio').addEventListener('click', function () {
      speakText(byId('speaking-prompt').textContent);
    });
    byId('clear-outline').addEventListener('click', function () {
      byId('speaking-outline').value = '';
      setFeedback('outline-feedback', '', '');
    });
    byId('check-outline').addEventListener('click', function () {
      var text = byId('speaking-outline').value.toLowerCase();
      var keywords = ['title', 'genre', 'recommend'];
      var count = keywords.filter(function (keyword) {
        return text.indexOf(keyword) !== -1;
      }).length;
      addPossiblePoint();
      if (count >= 2 || (text.indexOf('overall') !== -1 && text.indexOf('however') !== -1)) {
        addPoint();
        setFeedback('outline-feedback', 'Good outline. It looks structured and exam-ready.', 'good');
      } else {
        setFeedback('outline-feedback', 'Add clearer structure: introduction, details, comparison or limitation, then recommendation.', 'bad');
      }
    });

    byId('reset-speaking-timers').addEventListener('click', function () {
      resetTimers();
    });

    byId('start-prep').addEventListener('click', function () {
      startCountdown('prep');
    });
    byId('start-speak').addEventListener('click', function () {
      startCountdown('speak');
    });
  }

  function startCountdown(type) {
    var valueKey = type === 'prep' ? 'prepValue' : 'speakValue';
    var timerKey = type;
    var output = byId(type === 'prep' ? 'prep-timer' : 'speak-timer');
    clearInterval(state.timers[timerKey]);
    state.timers[timerKey] = setInterval(function () {
      if (state.timers[valueKey] <= 0) {
        clearInterval(state.timers[timerKey]);
        speakText(type === 'prep' ? 'Preparation time is over.' : 'Speaking time is over.');
        return;
      }
      state.timers[valueKey] -= 1;
      output.textContent = state.timers[valueKey];
    }, 1000);
  }

  function resetTimers() {
    clearInterval(state.timers.prep);
    clearInterval(state.timers.speak);
    state.timers.prepValue = 20;
    state.timers.speakValue = 75;
    byId('prep-timer').textContent = '20';
    byId('speak-timer').textContent = '75';
  }


  function setupSms() {
    byId('clear-sms').addEventListener('click', function () {
      byId('sms-output').value = '';
      setFeedback('sms-feedback', '', '');
    });

    byId('check-sms').addEventListener('click', function () {
      var text = byId('sms-output').value.toLowerCase();
      var type = byId('sms-type').value;
      var checks = [];
      if (type === 'invite') {
        checks = [
          text.indexOf('hi') !== -1 || text.indexOf('hello') !== -1,
          text.indexOf('would you like') !== -1 || text.indexOf('are you free') !== -1,
          text.indexOf(movieById(state.selectedMovieId).title.toLowerCase()) !== -1 || text.indexOf('movie') !== -1,
          text.indexOf('?') !== -1,
          text.indexOf('friday') !== -1 || text.indexOf('saturday') !== -1 || text.indexOf('8:') !== -1 || text.indexOf('evening') !== -1
        ];
      } else if (type === 'accept') {
        checks = [
          text.indexOf('yes') !== -1 || text.indexOf('great') !== -1 || text.indexOf('sounds good') !== -1,
          text.indexOf('works for me') !== -1 || text.indexOf('see you') !== -1 || text.indexOf('i am free') !== -1
        ];
      } else {
        checks = [
          text.indexOf('sorry') !== -1 || text.indexOf('busy') !== -1,
          text.indexOf('instead') !== -1 || text.indexOf('another time') !== -1 || text.indexOf('saturday') !== -1
        ];
      }
      addPossiblePoint();
      if (checks.every(Boolean)) {
        addPoint();
        setFeedback('sms-feedback', 'Great. Your SMS is realistic, clear, and appropriate.', 'good');
      } else {
        setFeedback('sms-feedback', 'Add a greeting or reaction, a clear invitation or reply, and a day/time detail when relevant.', 'bad');
      }
    });
  }

  function setupWriting() {
    byId('new-writing-task').addEventListener('click', buildWritingTask);
    byId('writing-task-type').addEventListener('change', buildWritingTask);
    byId('clear-writing').addEventListener('click', function () {
      byId('writing-output').value = '';
      setFeedback('writing-feedback', '', '');
    });
    byId('listen-model').addEventListener('click', function () {
      speakText(byId('writing-model').textContent);
    });
    byId('check-writing').addEventListener('click', function () {
      var text = byId('writing-output').value.toLowerCase();
      var checks = [
        text.indexOf('however') !== -1 || text.indexOf('in addition') !== -1,
        text.indexOf('compared with') !== -1 || text.indexOf('more ') !== -1 || text.indexOf('most ') !== -1,
        text.indexOf('recommend') !== -1,
        text.indexOf('rated') !== -1 || text.indexOf('pg') !== -1 || text.indexOf('r') !== -1,
        text.indexOf('runs for') !== -1 || text.indexOf('hour') !== -1
      ];
      var passed = checks.filter(Boolean).length;
      addPossiblePoint();
      if (passed >= 4) {
        addPoint();
        setFeedback('writing-feedback', 'Strong draft. You included most of the key exam-style elements.', 'good');
      } else {
        setFeedback('writing-feedback', 'Add more structure: rating, runtime, comparison, transition words, and a clear recommendation.', 'bad');
      }
    });
  }

  function setupGeneralActions() {
    byId('genre-filter').addEventListener('change', renderMovies);
    byId('shuffle-movie').addEventListener('click', function () {
      state.selectedMovieId = randomItem(movies).id;
      renderMovies();
      refreshSelectedMovieContent();
    });
    byId('reset-score').addEventListener('click', function () {
      state.score = 0;
      state.total = 0;
      updateScoreDisplay();
      renderQuiz('tense-quiz', tenseQuestions);
      renderQuiz('audience-quiz', audienceQuestions);
      setFeedback('category-feedback', 'Score reset. Quiz totals restarted too.', 'good');
    });
    byId('check-categories').addEventListener('click', checkSortActivity);
    byId('reset-categories').addEventListener('click', resetSortActivity);
    byId('print-grammar').addEventListener('click', function () {
      window.print();
    });
  }

  function init() {
    setupAccentAndMode();
    setupCopyButtons();
    renderGenreFilter();
    renderMovies();
    refreshSelectedMovieContent();
    renderQuiz('tense-quiz', tenseQuestions);
    renderQuiz('audience-quiz', audienceQuestions);
    renderSortActivity();
    setupReviewBuilders();
    setupDialogue();
    buildDialogueModel();
    setupSpeaking();
    setupSms();
    setupWriting();
    setupGeneralActions();
    buildWritingTask();
    updateAccentButtons();
    updateScoreDisplay();
  }

  document.addEventListener('DOMContentLoaded', init);
}());
