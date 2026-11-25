/* =====================================================================
   CONTENT FILE  —  this is the file to edit when you change your work.
   ---------------------------------------------------------------------
   Pictures:  "src: 'h2h-lion'" means media/img/h2h-lion.webp
              You can also give a full path to your own file, like
              "src: 'media/img/my-new-piece.png'"  (jpg, png, gif, webp all work)
   GIFs:      { type: 'gif', src: 'media/gifs/my-loop.gif' }
   Videos:    { type: 'video', sources: [ 'media/videos/my-film.mp4' ] }
              If the first file is missing, the next one in the list plays.
   wide:true  makes a tile span the full row.
   cover:     the picture used for a project's card under "Selected work".
   ===================================================================== */

window.PORTFOLIO = {
  owner: {
    name: 'Chin Zhen Xiang',
    zh: '陈震翔',
    nick: 'Chinny',
    roles: 'Illustrator · Designer · Animator',
    from: 'Malaysia',
    email: 'zhenxiang.work@gmail.com',
    instagram: '5_chinny',
    years: '2022 – 2025'
  },

  sections: [
    /* ---------------- SECTION 1 ---------------- */
    {
      id: 'thread', num: 1, title: 'A Thread of Life', zh: '爱情阿杂',
      tag: '8m40s short film', color: '#ffd23f', ink: '#1b1b1b', accent: '#e8262b',
      cover: 'tol-still-08',
      intro: 'My final year short film. It follows Ah Kit from 1984, a fourteen-year-old delivering mixed rice in Ipoh, to plane hopping to America, meeting his first love in his chicken rice shop, and finally a breakthrough with achar in Kuala Lumpur.',
      projects: [
        {
          title: 'The Film', meta: '8m40s · 2D animation · 2025',
          text: 'By 2025, their achar business became a huge success, and every Chinese New Year gathering was accompanied by Ah Kit\'s achar. Achar really represented Ah Kit\'s life as a whole. It starts off spicy and sour, and eventually the sweetness appears.',
          media: [
            { type: 'video', wide: true, poster: 'tol-still-08',
              sources: [
                { file: 'media/videos/a-thread-of-life.mp4', label: 'A Thread of Life · full film' },
                { file: 'media/videos/a-thread-of-life-reel.mp4', label: 'Stills reel (silent) · full film coming soon' },
                { file: 'media/videos/a-thread-of-life-reel.webm', label: 'Stills reel (silent) · full film coming soon' }
              ] },
            { src: 'tol-poster', caption: 'Key art' },
            { src: 'tol-mascot', caption: 'Ah Kit, character design', cutout: true }
          ]
        },
        {
          title: 'Animation Stills', meta: '2025',
          media: [
            { src: 'tol-still-01', caption: 'Mixed rice', wide: true },
            { src: 'tol-still-02' }, { src: 'tol-still-03' }, { src: 'tol-still-05' },
            { src: 'tol-still-06' }, { src: 'tol-still-07' }, { src: 'tol-still-08' },
            { src: 'tol-still-09' }, { src: 'tol-still-10' }, { src: 'tol-still-11' }, { src: 'tol-still-04' }, { src: 'tol-shop', caption: 'The chicken rice shop' }
          ]
        },
        {
          title: 'Merchandise', small: true, meta: 'Keychains · Badges · Mini achar charm · T-shirt',
          media: [
            { src: 'tol-merch-key-2', caption: 'Ah Kit keychain', bare: true },
            { src: 'tol-merch-key-4', caption: 'Bucket hat keychain', bare: true },
            { src: 'tol-merch-key-3', caption: 'Achar keychain', bare: true },
            { src: 'tol-merch-key-1', caption: '陳公館 signboard keychain', bare: true },
            { src: 'tol-merch-badge-2', caption: 'Badge', bare: true },
            { src: 'tol-merch-badge-1', caption: 'Badge', bare: true },
            { src: 'tol-merch-charm', caption: 'Mini achar charm, glows in the dark', bare: true },
            { src: 'tol-merch-tee', caption: 'T-shirt design', bare: true },
            { type: 'video', tall: true, muted: true, aside: true, poster: 'tol-tee-printing', sources: [ { file: 'media/videos/tol-tee-printing.mp4', label: 'Printing the t-shirts' } ] }
          ]
        },
        {
          title: 'MIAVILLE Art Bazaar', meta: 'The Linc KL · 28 – 30 Nov 2025',
          text: 'Collaborated with 50 artists to make this event happen. All merchandise sold out on the 3rd day.',
          media: [
            { src: 'tol-miaville-4', wide: true, caption: 'My booth' },
            { src: 'tol-miaville-poster', caption: 'Booth poster' },
            { src: 'tol-miaville-1' }, { src: 'tol-miaville-2' }, { src: 'tol-miaville-3' }
          ]
        },
        {
          title: 'Final Year Project Showcase', meta: 'Malaysian Institute of Arts · 12 Dec 2025',
          text: 'A thematic presentation showcasing and highlighting my animation project.',
          media: [ { src: 'tol-fyp-1' }, { src: 'tol-fyp-4' }, { src: 'tol-fyp-3' }, { src: 'tol-fyp-2' } ]
        },
        {
          title: 'Illuspeak', meta: 'MIA Illustration Diploma Show 2026 · GMBB, Kuala Lumpur · 18 – 26 Jul 2026',
          text: 'A Thread of Life got its own booth at the diploma show: Ah Kit on the wall, the film stills, the merch and my portfolio. I also curated the event website and made a digital stamp hunt minigame for visitors.',
          link: { href: 'https://illuspeak.netlify.app/', label: 'illuspeak.netlify.app' },
          media: [
            { src: 'tol-illuspeak-1', wide: true, caption: 'My booth' }, { src: 'illuspeak-site', caption: 'The event website' },
            { src: 'tol-illuspeak-2' }, { src: 'tol-illuspeak-3' }, { src: 'tol-illuspeak-4' },
            { src: 'tol-illuspeak-5' }, { src: 'tol-illuspeak-6' }, { src: 'tol-illuspeak-7' }
          ]
        }
      ]
    },

    /* ---------------- SECTION 2 ---------------- */
    {
      id: 'illustration', num: 2, title: 'Illustrations', zh: '插画',
      tag: 'Thematic · Pixel · Concept · Hand-drawn', color: '#e8262b', ink: '#fff7e6', accent: '#ffd23f',
      cover: 'h2h-piece-1',
      intro: 'Illustration work from 2022 to 2025: cultural heritage, fan art, original characters, pixel art and traditional media.',
      projects: [
        {
          title: 'Hands to Heart: The Dance of the Lion', cover: 'h2h-red', meta: 'Thematic · Cultural heritage · 2025',
          text: 'This series captures the spirit of lion dance: the rhythm, energy and craftsmanship that keep tradition alive. Inspired by my Perak roots, “霹霸” represents strength and pride. The first piece takes a maximalist approach with the drummer, cymbals, masked Buddha and flags, plus my own club “霸王”. The second captures the tension of pole jumping during Chinese New Year. The third honours masters Siow Ho Phiew and Lim Meng Kok, whose artistry shaped generations of lion dancers.',
          media: [
            { src: 'lion-dance', wide: true },
            { src: 'h2h-piece-1', caption: 'Piece 1 · 霸王' }, { src: 'h2h-piece-2', caption: 'Piece 2 · Pole jumping' },
            { src: 'h2h-piece-3', caption: 'Piece 3 · The masters' },
            { src: 'h2h-red' }, { src: 'h2h-gold' }
          ]
        },
        {
          title: 'HONOR Talents Global Design', meta: '2025',
          text: 'I adapted the lion dance artwork across watch faces and accessories, focusing on layout, colour, balance and keeping the visual identity of the series.',
          media: [ { type: 'video', poster: 'honor-watchface', muted: true, sources: [{ file: 'media/videos/honor-watchface.mp4', label: 'Watch face animation' }] },
            { src: 'h2h-honorpad', wide: true }, { src: 'honor-1', wide: true }, { src: 'honor-2' }, { src: 'honor-3' }, { src: 'honor-4', wide: true } ]
        },
        {
          title: 'Morning Market', meta: '2024',
          text: 'Life in an underground city where monsters have built their own society. Each creature in the bustling marketplace works hard to make a living in their own unique way.',
          media: [ { src: 'morning-market', wide: true } ]
        },
        { title: 'Ideal Breakfast', meta: '2024', text: 'I\'m really hungry… Am I? I\'m not sure ˙𐃷˙', media: [ { src: 'ideal-breakfast', wide: true } ] },
        {
          title: 'Pixel Art & Self Expression', meta: '2024',
          text: 'Pixel art of Vi from League of Legends and a snowy Christmas holiday. Self Expression is an experimental piece: a colourful image that keeps its colours harmonious, with flowers I love and a girl who shaped who I am today.',
          media: [ { src: 'pixel-vi', caption: 'Vi · pixel art', pixel: true }, { src: 'pixel-snow', caption: 'Snowy Christmas · pixel art', pixel: true }, { src: 'self-expression', caption: 'Self Expression' } ]
        },
        {
          title: 'Characters & Fan Art', meta: '2022 – 2025',
          media: [
            { src: 'fruity-buddies', caption: 'Fruity Buddies! · 2025 · an OC who loves fruit, plus her little buddies :D' },
            { src: 'lookback', caption: 'Lookback fan art · 2025' },
            { src: 'jp-osaka', caption: '30 Days in JP · 2025 · mascots from my month in Osaka' },
            { src: 'fan-mori', caption: 'Mori Calliope · 2022' }, { src: 'fan-demonslayer', caption: 'Demon Slayer · 2022' }
          ]
        },
        {
          title: 'Sang Kelembai', meta: 'A1 · pencil · 2024',
          text: 'A legendary spirit from Malaysian folklore. Locals believed it was kind-hearted with no intention to harm, yet through misfortune many people and animals turned to stone in its presence.',
          media: [ { src: 'sang-kelembai', wide: true } ]
        },
        {
          title: 'Hand-drawn Works', cover: 'texture-study', meta: 'Traditional media · 2023 – 2024',
          media: [
            { src: 'samzilla', caption: 'Samzilla · A2 watercolour, acrylic, colour pencil · Why is she breaking everything…', wide: true },
            { src: 'samzilla-d1' }, { src: 'samzilla-d2' }, { src: 'samzilla-d3' },
            { src: 'turf-war', caption: 'Turf War · A2 acrylic', wide: true },
            { src: 'closeup-1', caption: 'Close Up · A4 acrylic + colour pencil' }, { src: 'closeup-2' }, { src: 'closeup-3' },
            { src: 'texture-study', caption: 'Texture Study · mixed media A2 · 2023', wide: true, left: true }
          ]
        }
      ]
    },

    /* ---------------- SECTION 3 ---------------- */
    {
      id: 'identity', num: 3, title: 'Visual Identity', zh: '设计',
      tag: 'Branding · Posters · Products', color: '#ff2e93', ink: '#ffffff', accent: '#ffd23f',
      cover: 'shoyuemi',
      intro: 'Brand, campaign, packaging and poster design from 2024 to 2025.',
      projects: [
        {
          title: 'Popcorn Durian', cover: 'popcorn-pack', meta: 'Branding design · 2024 · 榴莲味啤啤果',
          media: [ { src: 'popcorn-poster', wide: true, caption: 'Poster' }, { src: 'popcorn-pack', cutout: true, caption: 'Packaging' }, { src: 'popcorn-pack-2', cutout: true, caption: 'Packaging, back' } ]
        },
        {
          title: 'ShoYueMi Valentine Day', cover: 'shoyuemi', meta: 'Snek Ku · Valentine\'s Day poster · 2024',
          text: 'A Valentine\'s Day poster for Snek Ku\'s ShoYueMi: “Don\'t forget about ShoYueMi, we want to be your Valentine too.”',
          media: [ { src: 'shoyuemi', caption: 'ShoYueMi · Valentine\'s Day poster · 2024' } ]
        },
        {
          title: 'Product Design', cover: 'rhino-phone', meta: '2024',
          text: 'Red packet design for the Year of the Snake, and “Toxic Beauty”, my Top 30 phone case for Rhinoshield × MIA Creative Jam 2024: an awareness piece about a beautiful ocean full of toxic waste.',
          media: [ { src: 'redpacket-page', wide: true }, { src: 'rhino-phone', caption: 'Toxic Beauty · Rhinoshield × MIA', cutout: true } ]
        },
        {
          title: 'Poster Design', cover: 'fight-fright', meta: '2024',
          text: 'Fight or Fright: a concept poster for a monster wrestling TV show set in the year 4024. If you see this, meowzilla said meow :3. Plus a newsprint poster on illustrator and animator Yoneyama Mai.',
          media: [ { src: 'poster-fight-fright', caption: 'Fight or Fright' }, { src: 'poster-yoneyama', caption: 'Yoneyama Mai' } ]
        },
        {
          title: 'MIA × MONIN', cover: 'monin-tote-art', meta: 'Promotional marketing & product design · 2024',
          text: 'From Masterclass to Masterpiece: a tote bag design competition between MONIN and the MIA illustration department. For my tote I highlighted some of the fruit syrups I really like.',
          media: [
            { src: 'monin-page', wide: true }, { src: 'monin-board' }, { src: 'monin-booth' },
            { src: 'monin-tote-art', caption: 'Tote bag artwork' }, { src: 'monin-chibi', cutout: true }, { src: 'monin-logo', cutout: true },
            { src: 'monin-tees' }, { src: 'monin-keychains' }, { src: 'monin-photo' }
          ]
        }
      ]
    },

    /* ---------------- SECTION 4 ---------------- */
    {
      id: 'publications', num: 4, title: 'Publications', zh: '漫画',
      tag: 'Comics · Visual novel', color: '#f4f1ea', ink: '#111111', accent: '#e8262b',
      cover: 'hm-cover',
      intro: 'Comic books and an interactive visual novel, 2023 to 2025.',
      projects: [
        {
          title: 'SMILE', meta: 'Comic book · Romance, horror · 13 pages · 2023',
          text: 'In a world devastated by an apocalypse, overwhelming emotions can transform humans into monstrous beings. Smile follows two characters: one immune to the curse, and another with great control of his emotions. Together they navigate the ruins, confronting the horrors outside and the struggles within, discovering the true cost of holding back what they feel.',
          media: [ { src: 'smile-cover', caption: 'Cover' }, { src: 'smile-p1' }, { src: 'smile-p2' }, { src: 'smile-p3' }, { src: 'smile-p4', wide: true } ]
        },
        {
          title: 'Haunted Mansion', meta: 'Interactive visual novel · Horror · 43 pages · 2025',
          text: 'A girl gets lost in the forest. Eventually she stumbles across an abandoned hut which brings her into a mysterious mansion. What does she do next? It\'s up to you…',
          media: [ { src: 'hm-cover', caption: 'Cover' }, { src: 'hm-book', cutout: true }, { src: 'hm-1' }, { src: 'hm-2' }, { src: 'hm-3' }, { src: 'hm-4' } ]
        },
        {
          title: 'New Life Project', meta: 'Comic book · Dystopian tragedy (sci-fi drama) · 39 pages · 2025',
          text: 'In a future doomed by meteor showers, the government introduces the New Life Project: a chance to upload one\'s mind into a perfect virtual world. Behind the scenes it funds the escape of the privileged. A mother chooses this digital eternity, leaving her child behind. The son keeps living quietly in the real world, and still loves his mom.',
          media: [ { src: 'nlp-cover', caption: 'Cover' }, { src: 'nlp-1' }, { src: 'nlp-2' }, { src: 'nlp-5' }, { src: 'nlp-3' }, { src: 'nlp-4' }, { src: 'nlp-6' }, { src: 'nlp-7' } ]
        }
      ]
    },

    /* ---------------- SECTION 5 ---------------- */
    {
      id: 'animation', num: 5, title: 'Animation', zh: '动画',
      tag: 'Alien Game · 2D · 2m12s', color: '#16121f', ink: '#ffffff', accent: '#ff3b3b',
      cover: 'ag-6',
      intro: 'Alien Game: a 2D sci-fi action animation.',
      projects: [
        {
          title: 'Alien Game', meta: '2D animation · Sci-fi & action · 2m12s · 2025',
          text: 'People born in Naville City have a mark on their face. Despised and outcast, the Navillians were wiped out in a war waged by the Valheire Empire. Two children survived: one mysteriously rose to become Queen of Valheire, the other lived under its control. Years later, aliens invade and stage a grand tournament where humans compete for a mysterious prize, broadcast as a TV show for the aliens\' entertainment.',
          media: [
            { src: 'ag-13', wide: true, caption: 'Key art' }
          ]
        },
        {
          title: 'Animation Stills', meta: '2025',
          media: [
            { src: 'ag-1', wide: true }, { src: 'ag-3' }, { src: 'ag-4' }, { src: 'ag-5' },
            { src: 'ag-6' }, { src: 'ag-7' }, { src: 'ag-8' }, { src: 'ag-9' }, { src: 'ag-10' }, { src: 'ag-11' }, { src: 'ag-12' }, { src: 'ag-2', wide: true }
          ]
        },
        {
          title: 'Animation Progress', meta: 'Sketch → inking → colouring → background → shadow + lighting',
          media: [
            { type: 'gif', src: 'media/gifs/alien-game-progress.gif', caption: 'From sketch to final frame' },
            { src: 'ag-chars-1', caption: 'Character design' }, { src: 'ag-chars-2', caption: 'Character design' },
            { src: 'ag-board', caption: 'Storyboard', wide: true }
          ]
        }
      ]
    },

    /* ---------------- SECTION 6 ---------------- */
    {
      id: 'threed', num: 6, title: '3D Modelling', zh: '三维',
      tag: 'Blender · 2025', color: '#3ad6ff', ink: '#0d1b2a', accent: '#ff2e93',
      cover: 'soda-1',
      intro: 'Products, rooms and creatures built in Blender, 2025.',
      projects: [
        { title: 'Soda Crackers', meta: '2025', media: [ { src: 'soda-1' }, { src: 'soda-2' } ] },
        { title: 'Interior Room', meta: '2025', media: [ { src: 'room-1' }, { src: 'room-2' }, { src: 'room-3' } ] },
        {
          title: 'Horror Hotel', meta: '2025',
          text: 'An entity has been spotted wandering around the hotel…',
          media: [ { src: 'hotel-1', wide: true }, { src: 'hotel-2' }, { src: 'hotel-5' }, { src: 'hotel-3' }, { src: 'hotel-4' } ]
        },
        { title: 'New Life Project', meta: '3D environments · 2025', media: [ { src: 'nlp3d-1' }, { src: 'nlp3d-3', wide: true }, { src: 'nlp3d-2' }, { src: 'nlp3d-4' }, { src: 'nlp3d-5' } ] }
      ]
    },

    /* ---------------- SECTION 7 ---------------- */
    {
      id: 'activities', num: 7, title: 'Creative Activities', zh: '活动',
      tag: 'Osaka · MIAVILLE · Showcases', color: '#7ee35b', ink: '#10240a', accent: '#ff2e93',
      cover: 'jp-manhole',
      intro: 'Workshops, bazaars and showcases in 2025.',
      projects: [
        {
          title: 'Summer 2025 Pavilion-Making Workshop', meta: 'Sozosha College of Design, Osaka, Japan · 27 Jul – 26 Aug 2025',
          text: 'I joined Sozosha\'s International Students Workshop in Osaka alongside students from France. We collaborated to design and build a mini, full-scale Kawaii-themed pavilion within a month.',
          media: [ { src: 'jp-group', wide: true }, { src: 'jp-manhole' }, { src: 'jp-1' }, { src: 'jp-2' }, { src: 'jp-3' } ]
        },
        { title: 'Sozosha Art Battle 2025', meta: 'Won 3rd place', text: 'An art competition hosted by Mr Taiga Asai at Sozosha College.', media: [ { src: 'jp-artbattle', wide: true } ] },
        {
          title: 'MIAVILLE Art Bazaar', meta: 'The Linc KL · 2025',
          text: 'Collaborated with 50 artists to make this event happen. A huge success, with all merchandise sold out on the 3rd day.',
          media: [ { src: 'bazaar-3', wide: true }, { src: 'bazaar-1' }, { src: 'bazaar-4' }, { src: 'bazaar-2' } ]
        },
        {
          title: 'Illuspeak', meta: 'MIA Illustration Diploma Show 2026 · GMBB, Kuala Lumpur · 18 – 26 Jul 2026',
          cover: 'illuspeak-group',
          text: 'Illuspeak was the Malaysian Institute of Art Illustration Diploma Show 2026 at GMBB. I showed A Thread of Life in my own booth, curated the event website and made a digital stamp hunt minigame for visitors. I also took home the Master of Everything Award and a Special Mention Award.',
          parts: [
            { title: 'My booth', meta: 'A Thread of Life',
              media: [ { src: 'tol-illuspeak-1', wide: true }, { src: 'tol-illuspeak-2' }, { src: 'tol-illuspeak-3' }, { src: 'tol-illuspeak-4' },
                { src: 'tol-illuspeak-5' }, { src: 'tol-illuspeak-6' }, { src: 'tol-illuspeak-7' } ] },
            { title: 'Digital stamp hunt', meta: 'Event website · Minigame',
              text: 'I curated the event website and made a stamp hunt for it. Six hidden QR stamps, drawn by me, were placed around the show for visitors to find and scan.',
              link: { href: 'https://illuspeak.netlify.app/', label: 'illuspeak.netlify.app' },
              media: [ { src: 'illuspeak-site', caption: 'The event website' }, { src: 'illuspeak-stamp-1', bare: true }, { src: 'illuspeak-stamp-2', bare: true }, { src: 'illuspeak-stamp-3', bare: true },
                { src: 'illuspeak-stamp-4', bare: true }, { src: 'illuspeak-stamp-5', bare: true }, { src: 'illuspeak-stamp-6', bare: true } ] },
            { title: 'The show', meta: 'GMBB · Jul 2026',
              media: [ { src: 'illuspeak-group', wide: true }, { src: 'illuspeak-poster', caption: 'Event poster' }, { src: 'illuspeak-group-2' } ] }
          ]
        }
      ]
    },

    /* ---------------- SECTION 8 ---------------- */
    {
      id: 'about', num: 8, title: 'About Me', zh: '关于我',
      tag: 'Player profile', color: '#ff8a1f', ink: '#1b1b1b', accent: '#2d3cff',
      cover: 'me-photo', about: true,
      intro: 'I\'m a designer specialising in illustration, animation and storytelling. I draw inspiration from a wide range of cultures and ideas, embracing versatility rather than being bound to one perspective. I\'m also skilled in communication, leadership and building strong relationships, which lets me collaborate effectively and bring stories to life with impact.',
      quote: 'I don\'t express my personal emotions directly through my art. Instead, I want my work to meet you with your own feelings. My pieces become meaningful through how you feel, how you interpret and how you choose to communicate with them. They\'re made for you to experience in your own way!',
      tools: ['Clip Studio Paint', 'Blender', 'Photoshop', 'Illustrator', 'After Effects', 'Premiere Pro', 'InDesign'],
      achievements: [
        ['Merit Award', 'The 2nd “Nanying Cup” National Original Comics Competition (Taiwan) · 第二屆「南應盃」全國原創漫畫大賽佳作獎'],
        ['Winner', 'Lions Club International Peace Poster Contest · “The Future of Peace”'],
        ['3rd Place', 'Sozosha Art Battle 2025, Osaka'],
        ['Top 30', 'Rhinoshield × MIA Creative Jam Phone Case Contest 2024 · “Toxic Beauty”'],
        ['Sold out', 'MIAVILLE Art Bazaar, The Linc KL · all merchandise sold out within 3 days'],
        ['Designer', 'HONOR Talents 2025 · watch interface and accessories design'],
        ['Core Designer', 'SPACEBOYFRIEND2005 · brand design and 2 debut shirts, 100 copies for launch'],
        ['Workshop', 'Summer 2025 Pavilion-Making Workshop · Sozosha College of Design, Osaka (30 days)'],
        ['Caricature Artist', 'HONOR Roadshow 2025 · 7 portraits within 3 hours'],
        ['Exhibited', 'Usaha Tegas Heritage Art Competition 2025 · “Sang Kelembai”'],
        ['Exhibited', 'BTS – Behind the Sketches: Thematic Cultural Heritage Showcase · Hands to Heart'],
        ['Exhibited', 'By Us For Real: Diploma Show · GMBB'],
        ['Exhibited', 'Final Year Project Showcase, MIA · A Thread of Life']
      ],
      projects: []
    }
  ],

  /* The full-screen showreel at the top of the page, played in this order.
     video: a clip in media/videos (if it's missing, the picture is shown instead)
     img:   a picture, shown whole (use wide/landscape pictures, tall ones leave big empty sides)
     open:  which project opens when someone clicks "Now playing" */
  showreel: [
    { title: 'A Thread of Life', video: 'reel-tol-1', img: 'tol-still-01', open: 'thread' },
    { title: 'Meowzilla · poster animation', video: 'reel-meowzilla', open: 'identity-4' },
    { title: 'Hands to Heart: The Dance of the Lion', img: 'lion-dance', open: 'illustration-1' },
    { title: 'A Thread of Life', video: 'reel-tol-2', img: 'tol-still-02', open: 'thread' },
    { title: 'HONOR Talents · watch face', video: 'reel-watch', open: 'illustration-2' },
    { title: 'Morning Market', img: 'morning-market', open: 'illustration-3' },
    { title: 'A Thread of Life', video: 'reel-tol-3', img: 'tol-still-09', open: 'thread' },
    { title: 'New Life Project · comic in motion', video: 'reel-manga', open: 'publications-3' },
    { title: 'Alien Game', img: 'ag-13', open: 'animation' },
    { title: 'A Thread of Life', video: 'reel-tol-4', img: 'tol-still-05', open: 'thread' },
    { title: 'SpaceBoyFriend2005 · brand animation', video: 'reel-spaceboyfriend' },
    { title: 'Ideal Breakfast', img: 'ideal-breakfast', open: 'illustration-3' },
    { title: 'A Thread of Life', video: 'reel-tol-5', img: 'tol-still-10', open: 'thread' },
    { title: 'Sang Kelembai', img: 'sang-kelembai', open: 'illustration-7' },
    { title: 'A Thread of Life', video: 'reel-tol-6', img: 'tol-still-11', open: 'thread' }
  ],

  /* Order of the cards under "Selected work", first one = top left.
     Each name is a section id + project number, so 'illustration-1' is the
     first project in Illustrations. 'thread' and 'animation' are the two films. */
  workOrder: [
    'thread', 'illustration-1', 'animation', 'illustration-3', 'publications-2', 'identity-1',
    'illustration-2', 'illustration-6', 'identity-5', 'publications-1', 'illustration-8', 'threed-3',
    'illustration-7', 'identity-2', 'publications-3', 'illustration-4', 'identity-4', 'illustration-5',
    'threed-1', 'identity-3', 'threed-4', 'threed-2', 'activities-4', 'activities-2', 'activities-1', 'activities-3', 'sketchbook'
  ],

  /* Sketchbook: shown as its own project */
  sketchbook: {
    id: 'sketchbook', num: '?', title: 'Sketchbook', zh: '草稿',
    tag: 'Behind the scenes', color: '#ffffff', ink: '#1b1b1b', accent: '#2d3cff',
    intro: 'The sketches and line work behind the finished pieces.',
    projects: [
      { title: 'Sketches', meta: 'Behind the scenes',
        media: [ { src: 'sketch-3' }, { src: 'sketch-1' }, { src: 'sketch-2' }, { src: 'sketch-4' }, { src: 'sketch-6' }, { src: 'sketch-7' }, { src: 'sketch-8' }, { src: 'sketch-9' }, { src: 'sketch-5' } ] }
    ]
  }
};
