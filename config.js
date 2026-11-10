// =====================================================
// MAP LAYERS: put the layer names from your Mapbox style here
// (Mapbox Studio > your style > Layers panel). Change only the
// text in quotes. A name that doesn't exist is simply skipped.
// =====================================================
var MAP_LAYERS = {
    // ---- from your Mapbox style ----
    hdbBlocks:      ['hdb footprint'],
    bus:            ['busstops-hdb-access'],
    mrt:            ['mrt station'],
    walkshed:       ['mrt-exits-1200m-coverage', 'bus-stops-1200m-coverage'],   // 1.2 km ≈ 15-minute walk
    paths:          ['singapore-pedestrian-paths'],
    hawker:         ['hawker centres'],
    goToPoints:     ['dementiafriendlygotopoin'],      // name was cut off in Studio; the start is enough
    demographics:   ['planning-areas-demograp'],       // name was cut off in Studio; the start is enough
    boundaries:     ['planning area'],
    hdbAll:         ['hdb-atlas-blocks'],
    hdbEstates:     ['hdb-estates-mapbox'],

    // ---- not in your style yet: add these layers in Mapbox Studio, then put their names here ----
    routeGoogle:    ['route-google'],
    routeOneMap:    ['route-onemap'],
    routeLaura:     ['route-laura'],
    neighbourhoods: ['neighbourhood-hatch']
};

// Shows exactly the layers listed, hides all the others
function showLayers(keys) {
    // 'transitNodes' still works: it means bus + mrt
    if (keys.indexOf('transitNodes') > -1) keys = keys.concat(['bus', 'mrt']);
    var out = [];
    Object.keys(MAP_LAYERS).forEach(function (k) {
        [].concat(MAP_LAYERS[k]).forEach(function (name) {
            out.push({ layer: name, opacity: keys.indexOf(k) > -1 ? 1 : 0, duration: 600 });
        });
    });
    return out;
}

// =====================================================
// MAP KEY + COLOURS — one palette for every map on the site
// (Story map here; the Four Walks maps and the Map of Realities
//  key use the same colours, set at the top of those pages)
// =====================================================
var MAP_COLOURS = {
    hdb:       '#CDB896',                  // ← HDB blocks (fill)
    hdbLine:   '#A8916B',                  // ← HDB block outline
    hdbEstate: 'rgba(205,184,150,0.28)',   // ← HDB estate areas (see-through)
    mrt:       '#E6A819',                  // ← MRT / LRT stations (the yellow ✕ on your map)
    bus:       '#FA4D65'                   // ← bus stops (the red bus on your map)
};

// Story-map layers that are repainted (layer name → colours).
// Empty = the HDB layers keep the colours set in Mapbox Studio.
// To repaint one, add e.g. 'hdb-atlas-blocks': { fill: MAP_COLOURS.hdb, line: MAP_COLOURS.hdbLine }
var MAP_RECOLOUR = {};

// Layers whose text labels are removed (the icons stay)
var MAP_HIDE_TEXT = ['mrt station', 'busstops-hdb-access'];

// Layers drawn at every zoom (HDB on the whole-island view; MRT + bus stops when zoomed in)
var MAP_ALL_ZOOMS = ['hdb-atlas-blocks', 'hdb footprint', 'hdb-estates-mapbox', 'mrt station', 'busstops-hdb-access'];

// Extra style changes for single layers (Mapbox paint / layout properties)
var MAP_STYLE = {
    // pedestrian paths: stronger colour, thicker the closer you zoom in
    'singapore-pedestrian-paths': {
        paint: {
            'line-color': 'rgba(77,104,161,0.24)',   // ← path colour (#4d68a1 at 24%). 8-digit hex like #4d68a13d also works now
            'line-width': ['interpolate', ['linear'], ['zoom'], 11, 0.5, 14, 1.4, 16, 2.6, 18, 4]   // ← width at each zoom
        }
    },
    // MRT icons always drawn, even where they overlap other labels
    // (bus stops are left to Mapbox, which thins them out on the island view;
    //  to show every bus stop, copy this line for 'busstops-hdb-access')
    'mrt station':         { layout: { 'icon-allow-overlap': true, 'icon-ignore-placement': true } }
};

// The map key under each text box. It lists only the layers that chapter shows.
// symbol: block | area | line | dashed | dot | ring | cross | bus | hatch
// colour: a colour, or 'auto' = take it from the Mapbox layer (fallback: used if Mapbox's colour can't be read)
// Put chapter.mapKey = false in a chapter to hide its key.
var MAP_KEY = {
    'hdb-estates-mapbox':         { label: 'HDB estate',                 symbol: 'area',   colour: 'auto', fallback: '#e6e3dc', edge: 'rgba(43,43,43,0.25)' },
    'hdb-atlas-blocks':           { label: 'HDB block',                  symbol: 'block',  colour: 'auto', fallback: '#d6d3cc' },
    'hdb footprint':              { label: 'HDB block footprint',        symbol: 'block',  colour: 'auto', fallback: '#d6d3cc' },
    'busstops-hdb-access':        { label: 'Bus stop',                   symbol: 'bus',    colour: MAP_COLOURS.bus },
    'mrt station':                { label: 'MRT / LRT station',          symbol: 'cross',  colour: MAP_COLOURS.mrt },
    'mrt-exits-1200m-coverage':   { label: '15-min walk from MRT',       symbol: 'ring',   colour: 'auto' },
    'bus-stops-1200m-coverage':   { label: '15-min walk from bus stop',  symbol: 'ring',   colour: 'auto' },
    'singapore-pedestrian-paths': { label: 'Pedestrian path',            symbol: 'line',   colour: 'auto' },
    'hawker centres':             { label: 'Hawker centre',              symbol: 'dot',    colour: 'auto' },
    'dementiafriendlygotopoin':   { label: 'Dementia Go-To Point',       symbol: 'dot',    colour: 'auto' },
    'planning-areas-demograp':    { label: 'Planning area (residents)',  symbol: 'area',   colour: 'auto' },
    'planning area':              { label: 'Planning area boundary',     symbol: 'dashed', colour: 'auto' },
    'neighbourhood-hatch':        { label: 'Our four neighbourhoods',    symbol: 'hatch',  colour: 'auto' },
    'route-google':               { label: 'Google Maps route',          symbol: 'line',   colour: 'auto' },
    'route-onemap':               { label: 'OneMap route',               symbol: 'dashed', colour: 'auto' },
    'route-laura':                { label: 'Walked route',               symbol: 'line',   colour: 'auto' }
};

var QUEENSTOWN = { center: [103.8037, 1.2946], zoom: 15.4, pitch: 0, bearing: 0, speed: 0.6 };
var FOUR_HOODS = { center: [103.7960, 1.3240], zoom: 12.1, pitch: 0, bearing: 0, speed: 0.6 };
// ISLAND: bigger Singapore, shifted right so it clears the text box on the left.
// zoom = size (+0.1 ≈ 7% bigger); center[0] smaller = island moves right, center[1] bigger = island moves down
var ISLAND     = { center: [103.7620, 1.3570], zoom: 11.2, pitch: 0, bearing: 0, speed: 0.6 };
var REGION     = { center: [103.8150, 1.3400], zoom: 11.6, pitch: 0, bearing: 0, speed: 0.6 };
var UBI        = { center: [103.8990, 1.3300], zoom: 15.6, pitch: 0, bearing: 0, speed: 0.6 };   // Ubi Grove (chapter 2 photos) — approximate, adjust if needed

// Photo column for chapters 2 and 3 — photos scroll up past the map.
// Photos live in place-named folders under assets/ (e.g. assets/Ubi Grove/, assets/built-projects/).
// Optional per photo: text (a longer line under the caption) and link (a source URL).
// A missing photo shows as a grey frame with its file name.
function photoFrames(list) {
    return '<div class="ch3p-photos">' + list.map(function (p, i) {
        return '<figure class="ch3p-frame">' +
            '<div class="ch3p-media">' +
                '<img src="' + p.src + '" alt="' + p.caption + '" loading="lazy" ' +
                'onerror="this.parentNode.classList.add(\'missing\')">' +
                '<span class="ch3p-missing">add photo:<br>' + p.src + '</span>' +
            '</div>' +
            '<figcaption><b>[' + ('0' + (i + 1)).slice(-2) + ']</b> ' + p.caption +
                (p.text ? '<br>' + p.text : '') +
                (p.link ? ' <a href="' + p.link + '" target="_blank" rel="noopener noreferrer">Source ↗</a>' : '') +
            '</figcaption>' +
        '</figure>';
    }).join('') + '</div>';
}

// =====================================================
// CHAPTER 2 — FOUR ISSUE CARDS (click a card → evidence window)
// cover = photo on the card; photos = photos in the window
// =====================================================
var URBAN_ISSUES = [
    {
        key: 'repetition',
        kicker: '01 / LOOK-ALIKE SPACES',
        title: 'Which block is it?',
        sub: 'Everything looks so similar. How do I know which block is mine?',
        cover: 'assets/Ubi Grove/ubi_grove_bto.avif',
        detail: {
            kicker: 'SPATIAL CONDITION',
            title: 'Repeated spaces and indistinct landmarks',
            body: 'Repetitive block forms and similar-looking corridors can make it difficult to distinguish one place from another, particularly for visitors or people unfamiliar with the estate. The challenge is telling one block from the next.',
            photos: ['assets/Ubi Grove/ubi_grove_bto.avif', 'assets/Rivervale Shores/bto_void_deck7.avif'],
            links: [['CNA: HDB void deck maze', 'https://www.channelnewsasia.com/cna-insider/ground-up/hdb-void-deck-complicated-maze-6481881']],
            diagram: '<svg preserveAspectRatio="xMidYMid slice" viewBox="0 0 350 190"><rect fill="#e4e4e0" height="190" width="350"></rect><path d="M0 35H350M0 135H350" stroke="#f6f6f3" stroke-width="18"></path><g fill="#c4c4bf"><rect height="68" width="55" x="25" y="52"></rect><rect height="68" width="55" x="105" y="52"></rect><rect height="68" width="55" x="185" y="52"></rect><rect height="68" width="55" x="265" y="52"></rect></g><g fill="#f0f0ec"><rect height="43" width="18" x="43" y="65"></rect><rect height="43" width="18" x="123" y="65"></rect><rect height="43" width="18" x="203" y="65"></rect><rect height="43" width="18" x="283" y="65"></rect></g></svg>'
        }
    },
    {
        key: 'routes',
        kicker: '02 / INDIRECT ROUTES',
        title: 'Why can’t I walk straight there?',
        sub: 'I can see where I need to go, but the path takes me all the way around.',
        cover: 'assets/Ubi Grove/ubi-grove-path.avif',
        detail: {
            kicker: 'SPATIAL CONDITION',
            title: 'Visibility is not the same as access',
            body: 'A bus stop or destination may be visible across an estate but reachable only by an indirect route. Walls, planting and entrances can turn a short distance into a long walk. The diagram illustrates the problem; it is not a surveyed route.',
            photos: ['assets/Ubi Grove/ubi-grove-path.avif', 'assets/Ubi Grove/tile_collage.avif', 'assets/Tampines GreenOpal/bto-void-deck13.avif'],
            links: [['CNA reporting', 'https://www.channelnewsasia.com/cna-insider/ground-up/hdb-void-deck-complicated-maze-6481881']],
            diagram: '<svg preserveAspectRatio="xMidYMid slice" viewBox="0 0 350 190"><rect fill="#e4e4e0" height="190" width="350"></rect><g fill="#c4c4bf"><rect height="62" width="85" x="35" y="25"></rect><rect height="64" width="96" x="218" y="101"></rect><rect height="53" width="58" x="139" y="24"></rect></g><path d="M65 130 L65 165 L180 165 L180 88 L268 88 L268 122" fill="none" stroke="#2B2B2B" stroke-linecap="round" stroke-width="7"></path><path d="M65 130L268 122" stroke="#fff" stroke-dasharray="6 6" stroke-width="3"></path><circle cx="65" cy="130" fill="#2B2B2B" r="8"></circle><circle cx="268" cy="122" fill="#2B2B2B" r="8"></circle></svg>'
        }
    },
    {
        key: 'junctions',
        kicker: '03 / CONFUSING JUNCTIONS',
        title: 'Which way do I turn?',
        sub: 'There are so many corners and passages. Where does this one lead?',
        cover: 'assets/Tampines GreenOpal/bto_void_deck12.avif',
        detail: {
            kicker: 'SPATIAL CONDITION',
            title: 'Decisions along the way',
            body: 'At junctions, changes in level and lift lobbies, people need enough spatial information to decide where to go next. Landmarks, sightlines, connections and signage may all influence these decisions.',
            photos: ['assets/Tampines GreenOpal/bto_void_deck12.avif', 'assets/Tampines GreenOpal/bto-void-deck13.avif', 'assets/Bidadari Alkaff CourtView/carpark-hdb.avif'],
            links: [['Read related reporting', 'https://www.channelnewsasia.com/cna-insider/ground-up/hdb-void-deck-complicated-maze-6481881']],
            diagram: '<svg preserveAspectRatio="xMidYMid slice" viewBox="0 0 350 190"><rect fill="#e4e4e0" height="190" width="350"></rect><path d="M0 25H350M0 165H350" stroke="#f6f6f3" stroke-width="14"></path><path d="M80 0V190M260 0V190" stroke="#c4c4bf" stroke-width="30"></path><path d="M175 0V190" stroke="#f6f6f3" stroke-width="30"></path><g fill="none" stroke="#2B2B2B" stroke-width="4"><path d="M175 160V93H85"></path><path d="M175 93H265"></path></g><circle cx="175" cy="93" fill="#2B2B2B" r="11"></circle><text fill="white" font-size="15" text-anchor="middle" x="175" y="98">?</text></svg>'
        }
    },
    {
        key: 'news',
        kicker: '04 / HARD-TO-READ LAYOUTS',
        title: 'Where is the entrance?',
        sub: 'I can see the block number, but I still can’t work out how to get in.',
        cover: 'assets/Bidadari Alkaff CourtView/bto_void_deck10.avif',
        detail: {
            kicker: 'NEWS / SOURCE',
            title: 'When the void deck becomes a maze',
            body: 'CNA Insider reports on navigation difficulties in selected HDB developments and the design considerations behind complex ground-level spaces. Read the full reporting for interviews, examples and context. This prototype does not reproduce unverified public comments.',
            photos: ['assets/Bidadari Alkaff CourtView/bto_void_deck10.avif', 'assets/Bidadari Alkaff CourtView/carpark-hdb.avif', 'assets/Ubi Grove/ubi_grove_bto.avif'],
            links: [['Open CNA article', 'https://www.channelnewsasia.com/cna-insider/ground-up/hdb-void-deck-complicated-maze-6481881']],
            diagram: '<svg preserveAspectRatio="xMidYMid slice" viewBox="0 0 350 190"><rect fill="#e4e4e0" height="190" width="350"></rect><rect fill="#ffffff" height="155" rx="3" width="270" x="40" y="19"></rect><rect fill="#2B2B2B" height="8" width="238" x="56" y="36"></rect><rect fill="#2B2B2B" height="12" width="206" x="56" y="57"></rect><rect fill="#2B2B2B" height="12" width="222" x="56" y="76"></rect><rect fill="#cfcfca" height="52" width="99" x="56" y="102"></rect><g fill="#b9b9b4"><rect height="5" width="106" x="167" y="105"></rect><rect height="5" width="100" x="167" y="117"></rect><rect height="5" width="106" x="167" y="129"></rect><rect height="5" width="78" x="167" y="141"></rect></g></svg>'
        }
    }
];
var URBAN_PHOTO_CREDIT = '(CNA, 2026)';

// builds the 2 × 2 card grid used in chapter 2
function issueCards(list) {
    return '<div class="ps-grid">' + list.map(function (d) {
        return '<button type="button" class="ps-card" data-issue="' + d.key + '" aria-label="Explore evidence: ' + d.title + '">' +
            '<div class="ps-card-media">' +
                '<img src="' + d.cover + '" alt="Photograph of an HDB estate" loading="lazy" ' +
                'onerror="this.parentNode.classList.add(\'missing\')">' +
                '<span class="ps-missing">add photo:<br>' + d.cover + '</span>' +
            '</div>' +
            '<div class="ps-card-copy">' +
                '<span class="ps-kicker">' + d.kicker + '</span>' +
                '<strong class="ps-title">' + d.title + '</strong>' +
                '<span class="ps-sub">' + d.sub + '</span>' +
                '<span class="ps-link">VIEW EVIDENCE ↗</span>' +
            '</div>' +
        '</button>';
    }).join('') + '</div>';
}

// =====================================================
// CHAPTER 3 — "HOW SINGAPORE RESPONDS" TABS
// Overview · Built projects · News & media · Design guidance
// =====================================================
var RESPONSES = {

    overview: {
        lead: 'Residents point out what is confusing. Designers try new ideas. Agencies put changes in place. Here are some of the responses.',
        paths: [
            { tab: 'Projects', index: '01 / BUILT PROJECTS', title: 'See what’s been tried',      who: 'Residents · Designers · Town Councils · Public agencies', cta: 'Explore projects ↗' },
            { tab: 'News',     index: '02 / NEWS & MEDIA',    title: 'Hear different experiences', who: 'Residents · Caregivers · Journalists · Community voices', cta: 'Explore stories ↗' },
            { tab: 'Guidance', index: '03 / DESIGN GUIDANCE', title: 'See how it’s designed',      who: 'Architects · Planners · LTA · HDB · BCA · Researchers',  cta: 'Explore guidance ↗' }
        ],
        question: 'Residents often notice what plans and standards miss. Their feedback can change what gets built.',
        footnote: 'Choose one of the three pathways to explore further.'
    },

    // ---- BUILT PROJECTS (photo: images are in assets/built-projects/; a missing one shows a grey frame) ----
    projectMethods: ['Signs & maps', 'Colour & landmarks', 'Memory & familiarity', 'Routes & access'],
    projectsFootnote: 'Built interventions and documented transit or district precedents. Evidence of effectiveness varies by project.',
    projects: [
        { name: 'Zhenghua / Senja', tag: 'DIRECTIONAL SIGNAGE', method: 'Signs & maps', photo: 'assets/built-projects/zhenghua-after.png',
          short: 'Clearer directions, type sizes and signs tested on site.',
          body: 'The Zhenghua Wayfinding Project at Senja and Segar explored clearer directional signage to help residents and visitors find destinations such as Bukit Panjang Polyclinic and West View Primary School. Stakeholder feedback and test prints informed design decisions.',
          links: [['OneService', 'https://www.oneservice.gov.sg/']] },
        { name: 'Nee Soon / Khatib Central', tag: 'COLOUR & LANDMARKS', method: 'Colour & landmarks', photo: 'assets/built-projects/nee-soon-colour-zoning.png',
          short: 'Colour-coded blocks and familiar local icons.',
          body: 'Dementia-friendly interventions in parts of Nee Soon use colour and locally associated icons to support orientation. Their reception also raises questions about visual overload and whether cues are meaningful to different residents.',
          links: [['Dementia Singapore', 'https://dementia.org.sg/']] },
        { name: 'Kebun Baru / Ang Mo Kio', tag: 'MURALS & MEMORY', method: 'Memory & familiarity', photo: 'assets/built-projects/kebun-baru-murals.png',
          short: 'Familiar images near important decision points.',
          body: 'Nostalgic murals aim to support recognition and wayfinding by linking locations to familiar imagery. Familiarity is personal and can vary between residents.',
          links: [['Dementia Singapore', 'https://dementia.org.sg/']] },
        { name: 'Yio Chu Kang', tag: 'NEIGHBOURHOOD DESIGN', method: 'Routes & access', photo: 'assets/built-projects/yio-chu-kang-ground-markers.png',
          short: 'Signs, accessible paths and community spaces considered together.',
          body: 'The Yio Chu Kang dementia-friendly neighbourhood pilot considers navigation alongside physical access, safety, heritage identity and community life.',
          links: [['CLC / AIC design guide', 'https://knowledgehub.clc.gov.sg/publications-library/dementia-friendly-neighbourhood-design-guide/'], ['CLC pilot publication', 'https://clc.gov.sg/docs/default-source/books/creating-a-dementia-friendly-neighbourhood_a-yio-chu-kang-pilot-project.pdf']] },
        { name: 'LTA street-level wayfinding pilot', tag: 'MAPS & DIRECTIONS', method: 'Signs & maps', photo: 'assets/built-projects/lta-street-wayfinding.png',
          short: 'Kiosks, neighbourhood maps and fingerposts in the Central Area and Yishun.',
          body: 'A street-level pilot uses different scales of map and direction signs. Useful for comparing routes through streets with routes inside HDB precincts.',
          links: [['LTA announcement', 'https://www.lta.gov.sg/content/ltagov/en/newsroom/2023/12/news-releases/pilot_for_new_street-level_wayfinding_system.html']] },
        { name: 'MRT wayfinding redesign', tag: 'INFORM · DIRECT · CONFIRM', method: 'Signs & maps', photo: 'assets/built-projects/mrt-wayfinding-signage.png',
          short: 'Consistent station maps, exit identifiers and directional signs.',
          body: 'The MRT signage system is a transport precedent for providing information at different stages of a journey. It is not an HDB-estate intervention.',
          links: [['LTA TEL signage factsheet', 'https://lta.gov.sg/content/dam/ltagov/news/press/2019/20191211_TEL1_new_systemmap_wayfinding_signage.pdf'], ['RICE Media interview', 'https://www.ricemedia.co/the-wayfinder-who-revamped-mrt-station-signs/']] },
        { name: 'SBS Transit — Find Your Way', tag: 'DEMENTIA-FRIENDLY TRANSIT', method: 'Memory & familiarity', photo: 'assets/built-projects/sbs-find-your-way.png',
          short: 'A dementia-friendly navigation initiative in public transport.',
          body: 'A transport-focused example to compare with residential neighbourhood wayfinding. See the project source for its actual implemented features.',
          links: [['SBS Transit', 'https://www.sbstransit.com.sg/findyourway']] },
        { name: 'Jurong East J-Walk signage', tag: 'DISTRICT CONNECTIONS', method: 'Routes & access', photo: 'assets/built-projects/jurong-east-jwalk.png',
          short: 'Coordinated signs across elevated pedestrian links.',
          body: 'A district-scale guideline for continuous connections, useful for thinking beyond individual buildings. This is a documented signage framework, not an independently evaluated outcome.',
          links: [['LTA J-Walk guidelines', 'https://www.lta.gov.sg/content/dam/ltagov/industry_innovations/industry_matters/development_construction_resources/architectural_standards/pdf/20150209%20j%20walk%20signage%20guidelines.pdf']] }
    ],

    // ---- NEWS & MEDIA (topic and source are the two filters) ----
    newsTopics: ['Getting lost', 'Signs & design', 'Inclusive spaces', 'Mobility & access'],
    newsSources: ['Journalism / editorial', 'Government / institutional', 'Specialist / community', 'Video'],
    newsFootnote: 'Source type describes who published the item, not whether its subject is a government initiative. Some linked sources remain unreviewed.',
    news: [
        { name: 'When the void deck becomes a maze', tag: 'CNA INSIDER / REPORTING', topic: 'Getting lost', source: 'Journalism / editorial',
          short: 'Newer HDB void decks and complicated circulation routes.',
          body: 'Reporting on how the arrangement of some newer HDB developments can make routes less intuitive. Read the article for the specific estates, interviews and architectural context.',
          url: 'https://www.channelnewsasia.com/cna-insider/ground-up/hdb-void-deck-complicated-maze-6481881' },
        { name: 'Street-level wayfinding pilot', tag: 'LTA / NEWS RELEASE', topic: 'Signs & design', source: 'Government / institutional',
          short: 'Kiosks, totems and fingerposts to help people orient themselves.',
          body: 'LTA announced a street-level wayfinding pilot for the Central Area and Yishun in December 2023. It offers a useful comparison between public street information and the experience within residential estates.',
          url: 'https://www.lta.gov.sg/content/ltagov/en/newsroom/2023/12/news-releases/pilot_for_new_street-level_wayfinding_system.html' },
        { name: 'Designing a dementia-friendly neighbourhood', tag: 'CLC / PROJECT PUBLICATION', topic: 'Inclusive spaces', source: 'Government / institutional',
          short: 'The Yio Chu Kang pilot and its broader environmental approach.',
          body: 'A publication on the Yio Chu Kang pilot describes how dementia-friendly neighbourhood design can involve more than directional signs.',
          url: 'https://clc.gov.sg/docs/default-source/books/creating-a-dementia-friendly-neighbourhood_a-yio-chu-kang-pilot-project.pdf' },
        { name: 'MRT station features across Singapore', tag: 'MUSTSHARENEWS / JUL 2026', topic: 'Signs & design', source: 'Journalism / editorial',
          short: 'An overview of distinctive MRT station features and how travellers encounter them.',
          url: 'https://mustsharenews.com/mrt-stations-features/' },
        { name: 'Autism-friendly features in Singapore', tag: 'MUSTSHARENEWS / APR 2026', topic: 'Inclusive spaces', source: 'Journalism / editorial',
          short: 'Examples of sensory and accessibility features; relevant to inclusive navigation beyond HDB estates.',
          url: 'https://mustsharenews.com/autism-friendly-features-singapore/amp/' },
        { name: 'The wayfinder who revamped MRT station signs', tag: 'RICE MEDIA / MAR 2025', topic: 'Signs & design', source: 'Journalism / editorial',
          short: 'A look at the design thinking behind Singapore MRT wayfinding signage.',
          url: 'https://www.ricemedia.co/the-wayfinder-who-revamped-mrt-station-signs/' },
        { name: 'Confusing place names', tag: 'RICE MEDIA / MAR 2024', topic: 'Getting lost', source: 'Journalism / editorial',
          short: 'A related discussion about naming and how places are understood.',
          url: 'https://www.ricemedia.co/?p=70422' },
        { name: 'When my gong gong with dementia went missing', tag: 'STACKED HOMES / SEP 2024', topic: 'Getting lost', source: 'Journalism / editorial',
          short: 'A personal account raising questions about dementia and neighbourhood preparedness.',
          url: 'https://stackedhomes.com/when-my-gong-gong-with-dementia-went-missing-are-singapores-neighbourhoods-prepared-for-an-ageing-crisis/' },
        { name: 'Mobility scooter rules', tag: 'MALAY MAIL / FEB 2026', topic: 'Mobility & access', source: 'Journalism / editorial',
          short: 'Related accessibility and mobility policy; not itself a wayfinding intervention.',
          url: 'https://www.malaymail.com/news/singapore/2026/02/04/medical-certs-speed-cuts-singapore-to-clamp-down-on-personal-mobility-scooters-with-tougher-rules-from-june/207990' },
        { name: 'Changi Airport Calm Room', tag: 'WANDERLUST / OCT 2025', topic: 'Inclusive spaces', source: 'Journalism / editorial',
          short: 'A sensory-friendly space for neurodivergent travellers, offered as a related precedent.',
          url: 'https://www.wanderlustmagazine.com/news/singapore-changi-airport-sensory-space-neurodivergent-travellers/' },
        { name: 'Public feedback on CCL6 signage', tag: 'SGTRAINS / MAR 2025', topic: 'Signs & design', source: 'Specialist / community',
          short: 'Public feedback on planned Circle Line wayfinding signage.',
          url: 'https://blog.sgtrains.com/2025/03/lta-seeks-public-feedback-on-new-ccl-wayfinding-signage-ahead-of-ccl6-opening-in-2026/' },
        { name: 'The new MRT wayfinding system, one year on', tag: 'SGTRAINS / FEB 2021', topic: 'Signs & design', source: 'Specialist / community',
          short: 'A retrospective on the MRT signage system after its introduction.',
          url: 'https://blog.sgtrains.com/2021/02/new-wayfinding-system-one-year-on/' },
        { name: 'Man with dementia travelled from Choa Chu Kang to Bedok', tag: 'MOTHERSHIP / 2018', topic: 'Getting lost', source: 'Journalism / editorial',
          short: 'A reported dementia-related wandering case; link supplied, article not independently reviewed.',
          url: 'https://mothership.sg/2018/11/dementia-elderly-parent-caregiver-reality-2' },
        { name: 'Lost in transit', tag: 'ASIA NEWS NETWORK / RELATED READING', topic: 'Getting lost', source: 'Journalism / editorial',
          short: 'Related reporting on navigating transit; article not independently reviewed.',
          url: 'https://asianews.network/?p=258037' },
        { name: 'DIY wayfinding signs', tag: 'VIDEO / YOUTUBE', topic: 'Signs & design', source: 'Video',
          short: 'Community-created wayfinding signs; video not independently reviewed.',
          url: 'https://www.youtube.com/watch?v=cSf6Gfym6og' },
        { name: 'MRT signage explained', tag: 'VIDEO / ASIAONE', topic: 'Signs & design', source: 'Video',
          short: 'Video on MRT signage; video not independently reviewed.',
          url: 'https://www.youtube.com/watch?v=5Cis_h7c2TE' },
        { name: 'Dementia-friendly Singapore', tag: 'VIDEO / THE STRAITS TIMES', topic: 'Inclusive spaces', source: 'Video',
          short: 'Video about dementia-friendly environments; video not independently reviewed.',
          url: 'https://www.youtube.com/watch?v=XZtA9cL8H6w' }
    ],

    // ---- DESIGN GUIDANCE (grouped by "what do you need?") ----
    guidanceGroups: [
        { name: 'Signs & maps',           help: 'Choose readable signs, symbols, maps and directions at decision points.' },
        { name: 'Walking routes',         help: 'Plan continuous, direct connections from buildings to public transport.' },
        { name: 'Accessibility & safety', help: 'Make routes and information easier to use for people with different mobility and sensory needs.' },
        { name: 'Neighbourhood identity', help: 'Understand estate names, local landmarks and dementia-friendly orientation.' },
        { name: 'Other sign rules',       help: 'Check requirements for outdoor commercial signs; not a general pedestrian wayfinding guide.' }
    ],
    guidanceFootnote: 'Mandatory requirements, voluntary standards and advisory guides have different legal status. Confirm applicability before use.',
    guidance: [
        { group: 'Signs & maps', name: 'SS 599:2014 Guide for wayfinding signage in public areas', url: 'https://www.singaporestandardseshop.sg/Product/SSPdtDetail/9c68c888-43d8-4536-8611-a10ddf939b36',
          issuer: 'Enterprise Singapore (Safety & Quality Standards Committee), 2014, current', status: 'National standard (voluntary unless a code cites it)', applies: 'Indoor and outdoor public areas, for pedestrians',
          help: 'Use when choosing public-sign typography, pictograms and basic sign design.',
          framework: 'Wayfinding principles and sign elements, with specific consideration for the elderly; includes a pictogram set. Excludes safety, evacuation, disability-specific, road and car-park signs.' },
        { group: 'Signs & maps', name: 'Guide for Wayfinding Signage', url: 'https://www.lta.gov.sg/content/dam/ltagov/industry_innovations/industry_matters/development_construction_resources/walking_cycling_plan/pdf/Guide%20for%20Wayfinding%20Signage.pdf',
          issuer: 'LTA, Walking & Cycling Plan resources', status: 'Guidance tied to a mandatory submission', applies: 'Developments and their links to transit',
          help: 'Use when locating signs along routes to transit and amenities.',
          framework: 'IDIAC: Identity, Directional, Informational, Advisory/Regulatory, Confirmation (repeated every 20–30 m). Signs go at decision points, junctions, atria and transit links. Physical specs defer to SS 599.' },
        { group: 'Signs & maps', name: 'Transit signage system (TEL1 factsheet)', url: 'https://lta.gov.sg/content/dam/ltagov/news/press/2019/20191211_TEL1_new_systemmap_wayfinding_signage.pdf',
          issuer: 'LTA, Dec 2019', status: 'Operating standard for rail', applies: 'MRT stations from TEL onward',
          help: 'Use to understand how MRT information guides, directs and confirms a journey.',
          framework: 'Inform → Direct → Confirm: one-stop information points, then directional signs, then exit identifiers; larger fonts, stronger contrast, new icons, numbered exits.' },
        { group: 'Signs & maps', name: 'J-Walk Signage Guidelines', url: 'https://www.lta.gov.sg/content/dam/ltagov/industry_innovations/industry_matters/development_construction_resources/architectural_standards/pdf/20150209%20j%20walk%20signage%20guidelines.pdf',
          issuer: 'LTA, 2015', status: 'District guideline (Jurong Lake District)', applies: 'Second-storey pedestrian network from Jurong East MRT',
          help: 'Use for a coordinated sign system across an elevated district walkway network.',
          framework: 'Five sign types (identity, directional, information, guide maps, transit identification); one brand, colour and typeface (Futura); signs at decision zones, sheltered, lit at 200–500 lux. A model for a precinct-wide system.' },
        { group: 'Signs & maps', name: 'Street-level wayfinding pilot', url: 'https://www.lta.gov.sg/content/ltagov/en/newsroom/2023/12/news-releases/pilot_for_new_street-level_wayfinding_system.html',
          issuer: 'LTA, Dec 2023', status: 'Pilot; may become a standard', applies: 'Streets in the Central Area and Yishun',
          help: 'Use to compare neighbourhood maps, totems and directional fingerposts.',
          framework: 'Kiosk (wider area), Totem (immediate area), Fingerpost (confirmation); “You are here” maps with 3D landmarks.' },
        { group: 'Walking routes', name: 'Walking and Cycling Plan (WCP)', url: 'https://www.ura.gov.sg/guidelines/development-control/development-control-handbooks/residential/flats-condominiums/wcp/',
          issuer: 'URA development control + LTA', status: 'Mandatory for qualifying developments (e.g. flats and condos over 700 units; HDB over 1,000 units coordinated with HDB)', applies: 'New developments',
          help: 'Use when planning direct pedestrian connections in qualifying new developments.',
          framework: 'Must show direct access to public transport, “way-finding signage to public transport facilities and amenities”, and barrier-free access for children, elderly and mobility-challenged groups.' },
        { group: 'Walking routes', name: 'RE:think – Designing for Wayfinding', url: 'https://www.lta.gov.sg/content/dam/ltagov/who_we_are/statistics_and_publications/books/pdf/REthink_190918web.pdf',
          issuer: 'LTA Architecture, 2018', status: 'Design handbook', applies: 'MRT stations',
          help: 'Use when designing legible spaces through layout, light, colour and views, not just signs.',
          framework: 'Space, Light, Colour, Visual: wayfinding is designed through layout, sightlines, daylight, line colours and art, so stations need fewer signs. Station codes in coloured “caplets”.' },
        { group: 'Accessibility & safety', name: 'Universal Design Guide for Public Places', url: 'https://www1.bca.gov.sg/docs/default-source/universaldesign/udguide2016.pdf',
          issuer: 'BCA, 2016', status: 'Good-practice guide (beyond the code)', applies: 'Public buildings',
          help: 'Use for accessible, intuitive information and visual reference points.',
          framework: 'Seven Principles of Universal Design (incl. “simple and intuitive” and “perceptible information”). Wayfinding chapter: legible characters sized to viewing distance, strong contrast, at least 200 lux, multilingual signs at about 2,100 mm, symbols, a directory with map at entrances, braille maps, visual reference points (atria, views, landmarks).' },
        { group: 'Accessibility & safety', name: 'Code on Accessibility in the Built Environment 2025', url: 'https://www1.bca.gov.sg/docs/default-source/docs-corp-news-and-publications/circulars/circular---code-on-accessibility-in-the-built-environment-2025.pdf',
          issuer: 'BCA, in force from 1 Nov 2025', status: 'Mandatory', applies: 'Building works',
          help: 'Use to check mandatory accessibility provisions for applicable building works.',
          framework: 'Accessible routes and entrances, International Symbol of Access, tactile indicators at stairs, colour bands on ramps, “T” telecoil signs. No dementia, autism or sensory clauses.' },
        { group: 'Accessibility & safety', name: 'Fire Code 2023', url: 'https://www.scdf.gov.sg/fire-safety-services-listing/fire-code-2023/table-of-content/chapter-2-means-of-escape/clause-2.3-means-of-escape-requirements',
          issuer: 'SCDF', status: 'Mandatory', applies: 'All buildings',
          help: 'Use to check fire-exit and staircase-identification requirements.',
          framework: 'Staircase storey signs at every landing (min. 300 × 300 mm; storey number at least 125 mm high; contrasting colour). Exit signs and exit lighting are in Chapter 8.' },
        { group: 'Neighbourhood identity', name: 'Dementia-Friendly Neighbourhood Design Guide', url: 'https://knowledgehub.clc.gov.sg/publications-library/dementia-friendly-neighbourhood-design-guide/',
          issuer: 'Centre for Liveable Cities with AIC, updated Mar 2025', status: 'Guidance', applies: 'HDB neighbourhoods',
          help: 'Use for neighbourhood-level design that supports orientation and familiarity.',
          framework: 'Combines agency and international dementia-friendly principles for high-density estates; built on the AIC–CLC study and the Yio Chu Kang pilot (CLC pilot book).' },
        { group: 'Neighbourhood identity', name: 'Handbook on Guidelines for Naming of Buildings and Estates', url: 'https://isomer-user-content.by.gov.sg/472/f77f2582-2fa0-40af-87c8-590653d9c9ad/SBNB-handbook-building.pdf',
          issuer: 'Street & Building Names Board (URA is secretariat)', status: 'Mandatory approval', applies: 'Building, estate and precinct names',
          help: 'Use to understand how buildings and estates are officially named.',
          framework: 'Names must reflect location, avoid duplicates, and be short and easy to pronounce. Precinct boundaries are set by HDB with planners, and names are approved by SBNB and published on OneMap (MND, Mar 2024).' },
        { group: 'Neighbourhood identity', name: 'HDB block and precinct signage', url: 'https://www.sg101.gov.sg/resources/archives/infrastructure-age-friendly-neighbourhoods/',
          issuer: 'HDB (build), Town Councils (maintain)', status: 'No public guideline found', applies: 'Block numbers, light boxes, lobby and directory boards',
          help: 'Background on block-number practices; no public estate-wide guide was identified in the supplied research.',
          framework: 'Practice only: block numbers on façades and light boxes, plus eye-level numbers in some upgraded estates (SG101).' },
        { group: 'Other sign rules', name: 'Outdoor sign display guidelines', url: 'https://www1.bca.gov.sg/regulatory-info/outdoor-advertisement-licensing/outdoor-advertising-sign-signboard/sign-display-guidelines-and-requirements',
          issuer: 'BCA (with URA)', status: 'Mandatory licensing', applies: 'Commercial and advertising signs',
          help: 'Use for commercial sign licensing, not as a general wayfinding standard.',
          framework: 'Licensing, size and illumination limits; signs on residential buildings prohibited. Shows that commercial signs are regulated more tightly than wayfinding.' }
    ]
};

var config = {
    style: 'mapbox://styles/heymanslo25/cmuxisotu00mc01sd1txnhoc5',
    accessToken: 'pk.eyJ1IjoiaGV5bWFuc2xvMjUiLCJhIjoiY210cGhuZmY4MHcydDJ3cXVtanJsMXdjZyJ9.UpQe2Q9wZFjNiwgY1DWmZA',
    showMarkers: false,
    markerColor: '#3FB1CE',
    //projection: 'equirectangular',
    inset: false,
    insetOptions: {
        markerColor: 'orange'
    },
    insetPosition: 'bottom-right',
    use3dTerrain: false,

    // ---- Fixed title block (top-left) ----
    title: 'How Do We Get Home?',
    tagline: 'Wayfinding from transit to front door in Singapore’s HDB estates',
    homePage: 'video.html',   // clicking the top-left title goes here (the video start page)

    menu: [
        {
            label: 'What',
            content: `
                <h3>How Do We Get Home?</h3>
                <p>Roughly 8 in 10 Singaporeans live in public Housing &amp; Development Board (HDB) estates. These estates sit at the heart of Singaporean life, which is why they are called the “heartlands”. HDB is Singapore’s largest land developer. It designs and builds roughly 20,000 dwelling units a year and, as of 2025, manages approximately 10,700 residential blocks across the island, with more on the way.</p>
                <p>This project looks at the route a resident takes from the nearest transport node, such as a bus stop or MRT station, to the lift lobby of their HDB block. We stop at the lift lobby to protect residents’ privacy. We want to understand the cues and elements that help residents make it home. We believe there is a significant gap between the wayfinding designers and architects put up and how well it works for the people who live there.</p>
                <p>We hope to pilot a conversation about closing the gap between practitioner and public.</p>

                <!-- COLLAGE FRAME (same image as Research Team) -->
                <div style="width:100%; aspect-ratio:2200 / 1211; margin:40px 0 30px; overflow:hidden;">
                    <img src="assets/characters_wayfinding_trimmed.jpg" alt="The research team and a dog crossing a zebra crossing in an HDB estate" style="width:100%; height:100%; object-fit:cover; display:block;">
                </div>
            `
        },
        {
            label: 'Why',
            content: `
                <h3>Why</h3>
                <p>Because these spaces are so widespread, they need to be well designed and to serve the functions of a public space. Singapore has a growing population of persons with disabilities and age-related impairments. For them, common areas must be legible, easy to navigate and distinct enough to reduce the risk of getting lost or disoriented.</p>

                <h4>Affective and quantitative space</h4>
                <p>It can be argued that the Singaporean metropolis is an assembly of two types of architectural-urban space: the “affective” and the “quantitative”. Affective space is designed to capture the attention of viewers for capitalist gain and extraction. Zones such as Marina Bay Sands, Gardens by the Bay, Changi Airport and Orchard Road use excessive visuals and sensory engineering to captivate shoppers and create associations of desire and lifestyle. Besides visuals, this includes smell, sound and temperature. Neighbourhood town centres such as Ang Mo Kio and Toa Payoh are less “spectacular”, but they are also affective. They concentrate retail, commercial and recreational programmes in one central location that residents naturally gravitate to.</p>
                <p>Quantitative space takes the form of hyper-rationalist, utilitarian structures that create a flat baseline for the rest of the city to build on. Examples are bus interchanges, train stations, sheltered walkways and the void decks of public housing estates. They are often bare of ornamentation and unique markers. On Goh’s reading, the void deck is deliberately neutral space, stripped of the markers that might make it the property of any one community. In this way it is emblematic of Singapore’s approach to multiculturalism (2005). Because of the “tragedy of the commons” argument at state level, few HDB estates have exceptional aesthetics. The exceptions are pushed bottom-up by close-knit communities working through their Town Councils and Neighbourhood Resident organisations.</p>

                <h4>The problem with “boring spaces”</h4>
                <p>Affective spaces concentrate interest and activity at specific nodes, such as the shopping mall and the town centre. This pushes developers and state agencies to design these areas far more elaborately than, say, the void decks beneath HDB blocks. The result is a legible pattern of “boring spaces” filling the gaps between “spaces of interest”, accelerating people from node to node.</p>
                <p>Key to this project was the observation that navigating within these boring spaces is very hard. They are procedural and modular, and they are mass-produced across the island regardless of neighbourhood:</p>
                <ul>
                    <li>MRT stations are rolled out in batches, with stations on the same line sharing one aesthetic.</li>
                    <li>Void decks share the same typologies depending on their decade of construction.</li>
                    <li>Sheltered walkways are largely identical across the whole island.</li>
                </ul>

                <h4>Beyond the signboard</h4>
                <p>Recent efforts have added visual character to void decks, especially in estates with many elderly residents with dementia or very young children. Elsewhere, HDB wayfinding is often little more than block numbers and directional signs on the sides of columns. People look at them on their first visit and never again. We theorise that after that first encounter, a mental map made of other stimuli and cues takes over.</p>

                <h4>Research questions</h4>
                <ul>
                    <li>What visual markers (landmarks, colours, unique forms) and non-visual markers (smells, sound profiles, contrasting thermal comfort) do residents use to build their mental maps?</li>
                    <li>In a linear void deck with four identical lift lobbies, how does a resident know which one leads home?</li>
                    <li>How do these markers change after 1, 5 or 20 years of living in a place?</li>
                    <li>How would a resident give directions to a visitor who has never been to the area?</li>
                    <li>How might architects and planners turn this into more effective, intentional wayfinding?</li>
                </ul>
            `
        },
        {
            label: 'How: Research and Visualisation',
            content: `
                <h3>How</h3>
                <p>The project studies wayfinding at three scales, from the whole island down to a single walk home.</p>

                <div style="display:grid; grid-template-columns:repeat(4, minmax(0, 1fr)); gap:0 22px; margin:24px 0 18px;">

                    <div style="border-top:1px solid #2B2B2B; padding-top:14px;">
                        <div style="margin:0 0 8px; font-size:12px; font-weight:500; letter-spacing:0.06em; text-transform:uppercase;">01 The island</div>
                        <p style="margin:0;">Statistics and spatial data show the distribution, age and typologies of HDB blocks across Singapore, alongside its transport nodes. <em>Story ch. 01</em></p>
                    </div>

                    <div style="border-top:1px solid #2B2B2B; padding-top:14px;">
                        <div style="margin:0 0 8px; font-size:12px; font-weight:500; letter-spacing:0.06em; text-transform:uppercase;">02 Our four walks</div>
                        <p style="margin:0;">Each team member documents their own route home in depth. <em>Story ch. 03–04, Four Walks</em></p>
                    </div>

                    <div style="border-top:1px solid #2B2B2B; padding-top:14px;">
                        <div style="margin:0 0 8px; font-size:12px; font-weight:500; letter-spacing:0.06em; text-transform:uppercase;">03 Residents’ routes</div>
                        <p style="margin:0;">HDB residents share their own routes through a form, offline walking interviews and sketch-mapping workshops.</p>
                    </div>

                    <div style="border-top:1px solid #2B2B2B; padding-top:14px;">
                        <div style="margin:0 0 8px; font-size:12px; font-weight:500; letter-spacing:0.06em; text-transform:uppercase;">04 Map of Realities</div>
                        <p style="margin:0;">After editors review them, entries are published on a map that shows where each one is and what the contributor found effective or ineffective.</p>
                    </div>

                </div>

                <h4>What we ask residents</h4>
                <ul>
                    <li>When do you know you are almost home?</li>
                    <li>What do you hear, see and smell in your block?</li>
                    <li>How would you give directions to a first-time visitor?</li>
                    <li>What challenges do you face, such as confusing junctions or identical repeated elements?</li>
                </ul>

                <!-- DRAFT paragraph: check before publishing -->
                <h4>Lived vs. algorithmic navigation</h4>
                <p>Navigation apps compute one shortest route, usually to the middle of a block. Residents rarely walk it. They follow preferred routes built from mental maps: the shaded path, the shortcut past the provision shop, the lobby with the potted plants. A first-time visitor has none of this and relies on the computed route and the signs. We collect lived routes so they can be compared with computed ones, and so that what residents already know can shape how the walk home is designed.</p>
            `
        },
      

{
    label: 'Our Four Walks',
    content:
        '<h3>Our Four Walks</h3>' +
        '<p>Each of the four team members contributes one case study, an in-depth look at our own routes home. We record what we notice, the landmarks we register, the coloured tiles we follow and the sounds we use to orient ourselves. The walks model the attitude we ask contributors to take: looking at and noticing their surroundings on purpose.</p>' +
        '<p>Each walk is recorded, logged, scored and compared the same way.</p>' +

        // ORIGINAL FIVE RESEARCH STEPS
        '<div class="walk-methods">' +

            '<div class="walk-method">' +
                '<div class="method-title">01 Choosing the routes</div>' +
                '<p>Four walks chosen to differ: MRT to HDB (Queenstown, Holland Village) and MRT to condo (Jurong East, Bishan); flat and hilly; mature and newer. [Add selection criteria.]</p>' +
            '</div>' +

            '<div class="walk-method">' +
                '<div class="method-title">02 Recording</div>' +
                '<p>Chest-height POV video, Strava GPS, photos at every stop where we noticed something.</p>' +
            '</div>' +

            '<div class="walk-method">' +
                '<div class="method-title">03 Logging</div>' +
                '<p>For each stop: space type, cues used, signs seen and used, hesitations.</p>' +
            '</div>' +

            '<div class="walk-method">' +
                '<div class="method-title">04 Scoring the senses</div>' +
                '<p>Each stretch scored 0–1 for see, hear, smell, touch and feel, by [two team members, averaged].</p>' +
            '</div>' +

            '<div class="walk-method">' +
                '<div class="method-title">05 Comparing</div>' +
                '<p>Same start and end entered into Google Maps and OneMap; all reasonable routes computed on the OpenStreetMap footpath network.</p>' +
            '</div>' +

        '</div>' +

        // FOUR WALK IMAGE CARDS
        '<div class="walk-gallery">' +

            '<div class="walk-card">' +
                '<div class="walk-caption">' +
                    '<div class="walk-title">01 Queenstown</div>' +
                    '<p>MRT to HDB<br>Mature estate<br>Walking route and observations</p>' +
                '</div>' +
                '<div class="walk-image">' +
                    '<img src="assets/laura/laura01.png" alt="Queenstown">' +
                '</div>' +
            '</div>' +

            '<div class="walk-card">' +
                '<div class="walk-caption">' +
                    '<div class="walk-title">02 Holland Village</div>' +
                    '<p>MRT to HDB<br>Mature estate<br>Walking route and observations</p>' +
                '</div>' +
                '<div class="walk-image">' +
                    '<img src="assets/heymans/heymans02.png" alt="Holland Village">' +
                '</div>' +
            '</div>' +

            '<div class="walk-card">' +
                '<div class="walk-caption">' +
                    '<div class="walk-title">03 Jurong East</div>' +
                    '<p>MRT to Condo<br>Residential estate<br>Walking route and observations</p>' +
                '</div>' +
                '<div class="walk-image">' +
                    '<img src="assets/jamie/jamie05.JPG" alt="Jurong East">' +
                '</div>' +
            '</div>' +

            '<div class="walk-card">' +
                '<div class="walk-caption">' +
                    '<div class="walk-title">04 Bishan</div>' +
                    '<p>MRT to Condo<br>Residential estate<br>Walking route and observations</p>' +
                '</div>' +
                '<div class="walk-image">' +
                    '<img src="assets/david/david05.jpg" alt="Bishan">' +
                '</div>' +
            '</div>' +

        '</div>'
},

        {
            label: 'Data Sources',
    content: `

        <!-- =====================================
             04 DATA SOURCES
             ===================================== -->

        <section class="research-section">

            <div class="research-heading">
                <h3>Data Sources</h3>
            </div>

            <div class="research-content">

                <table class="research-table">

                    <colgroup>
                        <col style="width:32%">
                        <col style="width:21%">
                        <col style="width:22%">
                        <col style="width:25%">
                    </colgroup>

                    <thead>
                        <tr>
                            <th>Dataset</th>
                            <th>From</th>
                            <th colspan="2">Used for</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td>HDB Property Information</td>
                            <td>HDB · data.gov.sg</td>
                            <td colspan="2">Block locations and year built</td>
                        </tr>

                        <tr>
                            <td>Resident population by subzone and age</td>
                            <td>SingStat</td>
                            <td colspan="2">Share of older residents</td>
                        </tr>

                        <tr>
                            <td>MRT station exits, bus stops</td>
                            <td>LTA · DataMall</td>
                            <td colspan="2">Nodes and walksheds</td>
                        </tr>

                        <tr>
                            <td>Covered linkways</td>
                            <td>LTA · DataMall</td>
                            <td colspan="2">Routes walked in rain or heat</td>
                        </tr>

                        <tr>
                            <td>Dementia Go-To Points</td>
                            <td>MOH · data.gov.sg</td>
                            <td colspan="2">Safe-return network</td>
                        </tr>

                        <tr>
                            <td>Street and footpath network</td>
                            <td>OpenStreetMap</td>
                            <td colspan="2">All possible routes; Space Syntax</td>
                        </tr>

                        <tr>
                            <td>Address search</td>
                            <td>OneMap API (SLA)</td>
                            <td colspan="2">Placing articles and entries</td>
                        </tr>

                        <tr>
                            <td>News, Reddit, parliamentary replies</td>
                            <td>Public sources</td>
                            <td colspan="2">Problems today, in people's words</td>
                        </tr>

                        <tr>
                            <td>POV video, Strava, photos</td>
                            <td>Our team</td>
                            <td colspan="2">The four walks</td>
                        </tr>

                        <tr>
                            <td>Survey entries</td>
                            <td>Ushahidi · the public</td>
                            <td colspan="2">Map of Realities</td>
                        </tr>
                    </tbody>

                </table>

                <p class="research-note">
                    [Download cleaned data · scripts]
                </p>

            </div>

        </section>


        <!-- =====================================
             05 REGULATIONS
             ===================================== -->

        <section class="research-section">

            <div class="research-heading">
                <h3>Regulations</h3>
            </div>

            <div class="research-content">

                <table class="research-table">

                    <colgroup>
                        <col style="width:32%">
                        <col style="width:21%">
                        <col style="width:22%">
                        <col style="width:25%">
                    </colgroup>

                    <thead>
                        <tr>
                            <th>Document</th>
                            <th>Issuer</th>
                            <th>Status</th>
                            <th>Covers</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td>SS 599:2014 Wayfinding signage</td>
                            <td>Enterprise Singapore</td>
                            <td>Voluntary standard</td>
                            <td>Public areas</td>
                        </tr>

                        <tr>
                            <td>Guide for Wayfinding Signage</td>
                            <td>LTA</td>
                            <td>Tied to mandatory WCP</td>
                            <td>Developments and transit links</td>
                        </tr>

                        <tr>
                            <td>Walking and Cycling Plan</td>
                            <td>URA · LTA</td>
                            <td>Mandatory (large developments)</td>
                            <td>Access to public transport</td>
                        </tr>

                        <tr>
                            <td>Code on Accessibility 2025</td>
                            <td>BCA</td>
                            <td>Mandatory</td>
                            <td>Building works</td>
                        </tr>

                        <tr>
                            <td>Universal Design Guide</td>
                            <td>BCA</td>
                            <td>Good practice</td>
                            <td>Public buildings</td>
                        </tr>

                        <tr>
                            <td>Fire Code 2023</td>
                            <td>SCDF</td>
                            <td>Mandatory</td>
                            <td>Exits, storey signs</td>
                        </tr>

                        <tr>
                            <td>Naming of buildings and estates</td>
                            <td>Street &amp; Building Names Board</td>
                            <td>Mandatory approval</td>
                            <td>Estate and precinct names</td>
                        </tr>

                        <tr>
                            <td>Dementia-Friendly Neighbourhood Design Guide</td>
                            <td>CLC · AIC</td>
                            <td>Guidance</td>
                            <td>HDB neighbourhoods</td>
                        </tr>

                        <tr class="research-emphasis">
                            <td>HDB estate wayfinding</td>
                            <td>HDB · Town Councils</td>
                            <td>No public guideline</td>
                            <td>Block numbers, lobbies, void decks</td>
                        </tr>
                    </tbody>

                </table>

            </div>

        </section>


        <!-- =====================================
             06 PILOT PROJECTS
             ===================================== -->

        <section class="research-section">

            <div class="research-heading">
                <h3>Pilot Projects</h3>
            </div>

            <div class="research-content">

                <div class="pilot-list">

                    <!-- 01 KEBUN BARU -->

                    <a class="pilot-row"
                       href="https://dementia.org.sg/blog/2020/04/20/building-an-inclusive-dementia-friendly-kebun-baru/"
                       target="_blank"
                       rel="noopener noreferrer">

                        <span class="pilot-year">2019–20</span>

                        <span class="pilot-name">
                            Retro murals co-designed with people with dementia
                        </span>

                        <span class="pilot-place">KEBUN BARU</span>

                        <span class="pilot-arrow">↗</span>
                    </a>


                    <!-- 02 SBS TRANSIT -->

                    <a class="pilot-row"
                       href="https://www.sbstransit.com.sg/findyourway"
                       target="_blank"
                       rel="noopener noreferrer">

                        <span class="pilot-year">2021–22</span>

                        <span class="pilot-name">
                            "Find Your Way" with SBS Transit and Dementia SG
                        </span>

                        <span class="pilot-place">INTERCHANGES</span>

                        <span class="pilot-arrow">↗</span>
                    </a>


                    <!-- 03 YIO CHU KANG -->

                    <a class="pilot-row"
                       href="https://www.sutd.edu.sg/news-listing/eye-catching-ground-signs-and-rest-areas-designed-to-prevent-residents-with-dementia-in-yio-chu-kang-from-getting-lost"
                       target="_blank"
                       rel="noopener noreferrer">

                        <span class="pilot-year">2023</span>

                        <span class="pilot-name">
                            Ground markers and rest areas (SUTD, CLC)
                        </span>

                        <span class="pilot-place">YIO CHU KANG</span>

                        <span class="pilot-arrow">↗</span>
                    </a>


                    <!-- 04 ZHENGHUA -->

                    <a class="pilot-row"
                       href="https://www.oneservice.gov.sg/awards/oneservice-awards/award-categories/zhenghua-wayfinding-project/"
                       target="_blank"
                       rel="noopener noreferrer">

                        <span class="pilot-year">2023</span>

                        <span class="pilot-name">
                            On-site font and sign tests (LASALLE)
                        </span>

                        <span class="pilot-place">ZHENGHUA</span>

                        <span class="pilot-arrow">↗</span>
                    </a>


                    <!-- 05 LTA WAYFINDING -->

                    <a class="pilot-row"
                       href="https://www.lta.gov.sg/content/ltagov/en/newsroom/2023/12/news-releases/pilot_for_new_street-level_wayfinding_system.html"
                       target="_blank"
                       rel="noopener noreferrer">

                        <span class="pilot-year">2023</span>

                        <span class="pilot-name">
                            LTA street-level wayfinding pilot
                        </span>

                        <span class="pilot-place">CITY &amp; YISHUN</span>

                        <span class="pilot-arrow">↗</span>
                    </a>


                    <!-- 06 CARA GO-TO POINT -->

                    <a class="pilot-row"
                       href="https://cara.sg/new-feature-dementia-gtp-locator/"
                       target="_blank"
                       rel="noopener noreferrer">

                        <span class="pilot-year">2024</span>

                        <span class="pilot-name">
                            Go-To Point locator on OneMap / CARA
                        </span>

                        <span class="pilot-place">ISLAND-WIDE</span>

                        <span class="pilot-arrow">↗</span>
                    </a>

                </div>

            </div>

        </section>


        <!-- =====================================
             07 REFERENCES
             ===================================== -->

        <section class="research-section">

            <div class="research-heading">
                <h3>References</h3>
            </div>

            <div class="research-content">

                <table class="research-table">

                    <colgroup>
                        <col style="width:53%">
                        <col style="width:47%">
                    </colgroup>

                    <thead>
                        <tr>
                            <th>Source</th>
                            <th>Used for</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td>[Goh (2005): full reference]</td>
                            <td>The void deck as neutral space (Why)</td>
                        </tr>

                        <tr>
                            <td>[Source]</td>
                            <td>Roughly 8 in 10 Singaporeans live in HDB estates (What)</td>
                        </tr>

                        <tr>
                            <td>[Source]</td>
                            <td>About 20,000 units a year; about 10,700 blocks as of 2025 (What)</td>
                        </tr>
                    </tbody>

                </table>

            </div>

        </section>

    `
},
{
    label: 'Data Management Plan',
    content:
        // =====================================
        // DATA MANAGEMENT PLAN (same content as the Add Your Walk page)
        // =====================================

        '<h3>Data Management Plan</h3>' +
        '<p style="max-width:720px;">From your story to shared knowledge: how community contributions are submitted, reviewed, published and exported.</p>' +

        // ---- 01 PROCESS ----
        '<div style="display:grid; grid-template-columns:minmax(0,1fr) minmax(0,2.2fr); gap:0 44px; align-items:start; margin:45px 0 0; padding-top:16px; border-top:1px solid #2B2B2B;">' +

            '<div style="min-width:0;">' +
                '<div style="margin:0 0 12px; font-size:12px; font-weight:500; letter-spacing:0.06em; text-transform:uppercase;">01 Process</div>' +
                '<p>Every contribution helps us understand how residents experience their everyday journeys. To make sure the information is useful and responsibly shared, each submission follows a clear process.</p>' +
                '<p>Entries are reviewed by our team before they appear on the Map of Realities. We may contact contributors when clarification or changes are needed.</p>' +
                '<p style="margin-bottom:0;">Once published, the information contributes to a growing picture of how people navigate Singapore’s HDB estates. Published entries are also exported regularly to update our research findings.</p>' +
            '</div>' +

            '<figure style="min-width:0; margin:0;">' +
                '<img src="assets/data management diagram.png" alt="Data management plan diagram" loading="lazy" style="display:block; width:100%; height:auto; max-height:70vh; object-fit:contain; object-position:left top;">' +
                '<figcaption style="display:flex; justify-content:space-between; gap:20px; margin-top:16px; padding-top:12px; border-top:1px solid rgba(43,43,43,0.15); font-size:11px; color:#777;">' +
                    '<span>DATA MANAGEMENT PLAN</span><span>SUBMISSION / REVIEW / PUBLICATION / EXPORT</span>' +
                '</figcaption>' +
            '</figure>' +

        '</div>' +

        // ---- 02 USERS AND ROLES ----
        '<div style="margin:70px 0 0; padding-top:16px; border-top:1px solid #2B2B2B;">' +
            '<div style="margin:0 0 18px; font-size:12px; font-weight:500; letter-spacing:0.06em; text-transform:uppercase;">02 Users and roles</div>' +

            '<table style="width:100%; border-collapse:collapse; table-layout:fixed; border:none; background:transparent; font-family:inherit; color:#2B2B2B;">' +
                '<colgroup><col style="width:20%;"><col style="width:25%;"><col style="width:55%;"></colgroup>' +
                '<thead><tr>' +
                    '<th style="text-align:left; border:none; padding:0 12px 14px 0; font-size:12px; font-weight:500;">ROLE</th>' +
                    '<th style="text-align:left; border:none; padding:0 12px 14px 0; font-size:12px; font-weight:500;">WHO</th>' +
                    '<th style="text-align:left; border:none; padding:0 12px 14px 0; font-size:12px; font-weight:500;">CAN</th>' +
                '</tr></thead>' +
                '<tbody>' +
                    '<tr style="border-top:1px solid rgba(43,43,43,0.15);"><td style="padding:10px 12px 10px 0; font-size:13px; font-weight:500;">Administrator</td><td style="padding:10px 12px 10px 0; font-size:13px; font-weight:300;">Team lead</td><td style="padding:10px 12px 10px 0; font-size:13px; font-weight:300;">Sets the overall survey design and outreach direction; oversees the Editors and Partner relations.</td></tr>' +
                    '<tr style="border-top:1px solid rgba(43,43,43,0.15);"><td style="padding:10px 12px 10px 0; font-size:13px; font-weight:500;">Editors</td><td style="padding:10px 12px 10px 0; font-size:13px; font-weight:300;">The team</td><td style="padding:10px 12px 10px 0; font-size:13px; font-weight:300;">Review, code and publish entries to the website; update the consolidated map.</td></tr>' +
                    '<tr style="border-top:1px solid rgba(43,43,43,0.15);"><td style="padding:10px 12px 10px 0; font-size:13px; font-weight:500;">Contributors</td><td style="padding:10px 12px 10px 0; font-size:13px; font-weight:300;">You, the public</td><td style="padding:10px 12px 10px 0; font-size:13px; font-weight:300;">Submit entries but cannot publish them. Contributors vary in age and background.</td></tr>' +
                    '<tr style="border-top:1px solid rgba(43,43,43,0.15); border-bottom:1px solid rgba(43,43,43,0.15);"><td style="padding:10px 12px 10px 0; font-size:13px; font-weight:500;">Partners</td><td style="padding:10px 12px 10px 0; font-size:13px; font-weight:300;">External parties and institutions</td><td style="padding:10px 12px 10px 0; font-size:13px; font-weight:300;">View and download the data for further research and projects.</td></tr>' +
                '</tbody>' +
            '</table>' +
        '</div>' +

        // ---- 03 PRIVACY PROMISES ----
        '<div style="margin:70px 0 0; padding-top:16px; border-top:1px solid #2B2B2B;">' +
            '<div style="margin:0 0 12px; font-size:12px; font-weight:500; letter-spacing:0.06em; text-transform:uppercase;">03 Privacy promises</div>' +
            '<p style="max-width:720px;">Sharing your experience relies on trust, so keeping your privacy safe is our top priority.</p>' +

            '<div style="display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:22px; margin-top:22px;">' +
                '<div style="border-top:1px solid rgba(43,43,43,0.28); padding-top:14px;"><div style="margin:0 0 6px; font-size:14px; font-weight:500;">No names, no home addresses</div><p style="margin:0;">We focus on the route, not your front door. No identifying details are ever shown.</p></div>' +
                '<div style="border-top:1px solid rgba(43,43,43,0.28); padding-top:14px;"><div style="margin:0 0 6px; font-size:14px; font-weight:500;">No hidden agendas</div><p style="margin:0;">We are upfront about what data we collect and why we need it.</p></div>' +
                '<div style="border-top:1px solid rgba(43,43,43,0.28); padding-top:14px;"><div style="margin:0 0 6px; font-size:14px; font-weight:500;">You’re in control</div><p style="margin:0;">We only collect what is necessary, and you can leave any optional questions blank.</p></div>' +
            '</div>' +
        '</div>' +

        // ---- 04 FORM FEEDBACK ----
        '<div style="display:grid; grid-template-columns:minmax(0,1fr) minmax(0,2.2fr); gap:0 44px; align-items:start; margin:70px 0 40px; padding-top:16px; border-top:1px solid #2B2B2B;">' +

            '<div style="min-width:0;">' +
                '<div style="margin:0 0 12px; font-size:12px; font-weight:500; letter-spacing:0.06em; text-transform:uppercase;">04 Form feedback</div>' +
                '<p>The Ushahidi form is designed to make participation accessible and straightforward, allowing residents to share their everyday experiences of finding their way home.</p>' +
                '<p>Feedback helps us understand how people experience the submission process, including which questions are clear, which steps may be confusing, and where the form could become easier to use.</p>' +
                '<p style="margin-bottom:0;">These observations help us refine the way information is collected, making participation more inclusive and improving the quality of contributions.</p>' +
            '</div>' +

            '<figure style="min-width:0; margin:0;">' +
                '<img src="assets/ushahidi form feedback diagram.png" alt="Ushahidi form feedback diagram" loading="lazy" style="display:block; width:100%; height:auto; max-height:70vh; object-fit:contain; object-position:left top;">' +
                '<figcaption style="display:flex; justify-content:space-between; gap:20px; margin-top:16px; padding-top:12px; border-top:1px solid rgba(43,43,43,0.15); font-size:11px; color:#777;">' +
                    '<span>USHAHIDI FORM FEEDBACK</span><span>PARTICIPATION / USER EXPERIENCE / IMPROVEMENT</span>' +
                '</figcaption>' +
            '</figure>' +

        '</div>'
},
{
    label: 'Research Team',
    content:

        // =====================================
        // RESEARCH TEAM
        // =====================================

        '<h3>Research Team</h3>' +
        '<p>We are four Master of Architecture students from the National University of Singapore’s Department of Architecture.</p>' +

        // SIX PORTRAIT FRAMES: dog, four researchers, supervisor
        '<div style="display:grid; grid-template-columns:repeat(6,minmax(0,1fr)); gap:22px; width:100%; margin:55px 0 20px;">' +

            // 00 [DOG NAME]
            '<div style="min-width:0;">' +
                '<div style="border-top:1px solid #2B2B2B; padding-top:14px; height:72px; margin-bottom:18px; box-sizing:border-box;">' +
                    '<div style="font-size:13px; font-weight:500;">00 Mochi</div>' +
                    '<p style="margin:5px 0 0; font-size:12px; font-weight:300;">Researcher</p>' +
                '</div>' +
                '<div style="width:100%; aspect-ratio:3 / 4; overflow:hidden; display:flex; align-items:flex-end; justify-content:center;">' +
                    '<img src="assets/People/dog.png" alt="Team dog" style="width:65%; height:auto; max-height:100%; object-fit:contain; display:block; margin-bottom:6%;">' +
                '</div>' +
            '</div>' +

            // 01 JAMIE LOH
            '<div style="min-width:0;">' +
                '<div style="border-top:1px solid #2B2B2B; padding-top:14px; height:72px; margin-bottom:18px; box-sizing:border-box;">' +
                    '<div style="font-size:13px; font-weight:500;">01 Jamie Loh</div>' +
                    '<p style="margin:5px 0 0; font-size:12px; font-weight:300;">Researcher</p>' +
                '</div>' +
                '<div style="width:100%; aspect-ratio:3 / 4; overflow:hidden;">' +
                    '<img src="assets/People/jamie.png" alt="Jamie Loh" style="width:100%; height:100%; object-fit:cover; display:block;">' +
                '</div>' +
            '</div>' +

            // 02 HEYMANS LO
            '<div style="min-width:0;">' +
                '<div style="border-top:1px solid #2B2B2B; padding-top:14px; height:72px; margin-bottom:18px; box-sizing:border-box;">' +
                    '<div style="font-size:13px; font-weight:500;">02 Heymans Lo</div>' +
                    '<p style="margin:5px 0 0; font-size:12px; font-weight:300;">Researcher</p>' +
                '</div>' +
                '<div style="width:100%; aspect-ratio:3 / 4; overflow:hidden;">' +
                    '<img src="assets/People/david.png" alt="Heymans Lo" style="width:100%; height:100%; object-fit:cover; display:block;">' +
                '</div>' +
            '</div>' +

            // 03 LAURA DIETZOLD
            '<div style="min-width:0;">' +
                '<div style="border-top:1px solid #2B2B2B; padding-top:14px; height:72px; margin-bottom:18px; box-sizing:border-box;">' +
                    '<div style="font-size:13px; font-weight:500;">03 Laura Dietzold</div>' +
                    '<p style="margin:5px 0 0; font-size:12px; font-weight:300;">Researcher</p>' +
                '</div>' +
                '<div style="width:100%; aspect-ratio:3 / 4; overflow:hidden;">' +
                    '<img src="assets/People/laura.png" alt="Laura Dietzold" style="width:100%; height:100%; object-fit:cover; display:block;">' +
                '</div>' +
            '</div>' +

            // 04 DAVID QUEK
            '<div style="min-width:0;">' +
                '<div style="border-top:1px solid #2B2B2B; padding-top:14px; height:72px; margin-bottom:18px; box-sizing:border-box;">' +
                    '<div style="font-size:13px; font-weight:500;">04 David Quek</div>' +
                    '<p style="margin:5px 0 0; font-size:12px; font-weight:300;">Researcher</p>' +
                '</div>' +
                '<div style="width:100%; aspect-ratio:3 / 4; overflow:hidden;">' +
                    '<img src="assets/People/heymans.png" alt="David Quek" style="width:100%; height:100%; object-fit:cover; display:block;">' +
                '</div>' +
            '</div>' +

            // 05 AHN CHAEWON
            '<div style="min-width:0;">' +
                '<div style="border-top:1px solid #2B2B2B; padding-top:14px; height:72px; margin-bottom:18px; box-sizing:border-box;">' +
                    '<div style="font-size:13px; font-weight:500;">05 Ahn Chaewon</div>' +
                    '<p style="margin:5px 0 0; font-size:12px; font-weight:300;">Assistant Professor<br>Supervisor</p>' +
                '</div>' +
                '<div style="width:100%; aspect-ratio:3 / 4; overflow:hidden;">' +
                    '<img src="assets/People/chaewon.png" alt="Ahn Chaewon" style="width:100%; height:100%; object-fit:cover; display:block;">' +
                '</div>' +
            '</div>' +

        '</div>' +


       // =====================================
        // UNIVERSITY / COURSE CREDIT + CONTACT
        // =====================================

        '<div style="display:grid; grid-template-columns:repeat(5,minmax(0,1fr)); gap:22px; width:100%; margin-top:40px; padding-bottom:35px; font-family:inherit; font-size:11px; font-weight:300; line-height:1.5; color:#2B2B2B;">' +

            // COLUMN 01 — ADDRESS (LEFT)
            '<div style="grid-column:1 / 2; text-align:left;">' +
                'Thesis Studio Space<br>' +
                'Level 3, SDE3<br>' +
                'National University of Singapore<br>' +
                '4 Architecture Drive<br>' +
                'Singapore 117566' +
            '</div>' +

            // COLUMN 03 — CONTACT (MIDDLE)
            '<div style="grid-column:3.5 / 5; text-align:left;">' +

                '<div style="margin-bottom:12px;">' +
                    'Tel: <a href="tel:+6565166666" style="color:inherit; text-decoration:none;">+65 6516 6666</a>' +
                '</div>' +

                '<div>' +
                    'Email: <a href="mailto:howdowegethome@nus.edu.sg" style="color:inherit; text-decoration:none;">howdowegethome@nus.edu.sg</a>' +
                '</div>' +

            '</div>' +

            // COLUMN 05 — COURSE & UNIVERSITY (RIGHT)
            '<div style="grid-column:5 / 6; text-align:right;">' +

                '<div style="margin-bottom:12px;">' +
                    'DEP5118 Community Data Gathering and Visualisation' +
                '</div>' +

                '<div>' +
                    'Department of Architecture<br>' +
                    'College of Design and Engineering<br>' +
                    'National University of Singapore' +
                '</div>' +

            '</div>' +

        '</div>' +

        '</div>'
},
    ],


    // =====================================================
    // CHAPTERS
    // group  = main chapter number shown in the top-right list (1, 2, 3, 4)
    // navTitle = name in the top-right list (main chapters only)
    // sub    = sub-chapter name; only listed while you are in that chapter
    // steps with no navTitle / sub belong to the chapter above them
    // =====================================================
    chapters: [

        // ---------- CHAPTER 1: INTRODUCTION ----------
        {
            id: 'invitation',
            group: 1,
            navTitle: 'Introduction',
            hideTitle: true,
            alignment: 'left',
            backdrop: 'assets/characters_wayfinding_trimmed.jpg',   // drawing of us walking (trimmed copy, no white margins), on the right
            description: `
                <div class="story-box">
                    <div class="story-label">(01) INTRODUCTION</div>
                    <h2>How do we get home?</h2>
                    <p>Think about your walk home. What tells you where to turn?</p>
                    <p>A familiar shop, a crossing, a tree, or simply a route you know by heart. We find our way using more than signs.</p>
                    <p class="story-ask">Four people. Many ways of finding home.</p>
                    <p class="story-label">SCROLL TO EXPLORE ↓</p>
                </div>
            `,
            location: ISLAND,
            onChapterEnter: showLayers([]),
            onChapterExit: []
        },
        // ---- the map stays on the island; one layer comes in at each step ----
        // step 1: HDB
        {
            id: 'context-hdb',
            group: 1,
            hideTitle: true,
            alignment: 'left',
            description: `
                <div class="story-box">
                    <div class="story-label">(01) THE GEOGRAPHIC CONTEXT</div>
                    <h2>Where we live.</h2>
                    <p>Roughly 8 in 10 Singaporeans live in public HDB estates: around 10,700 residential blocks across the island.</p>
                </div>
            `,
            location: ISLAND,
            onChapterEnter: showLayers(['hdbEstates', 'hdbAll', 'hdbBlocks']),
            onChapterExit: []
        },
        // step 2: + bus stops and MRT / LRT stations together
        {
            id: 'context-mrt',
            group: 1,
            hideTitle: true,
            alignment: 'left',
            description: `
                <div class="story-box">
                    <div class="story-label">(01) THE GEOGRAPHIC CONTEXT</div>
                    <h2>From transit to front door.</h2>
                    <p>From the MRT to our lift lobby, we rarely navigate by street names alone. We remember the bakery, a familiar turn, the colour of a block.</p>
                    <p>Singapore’s public housing neighbourhoods are connected by an extensive transport network. But being close to transit does not always mean the way home is easy to read.</p>
                    <p class="story-label">WAYFINDING FROM TRANSIT TO FRONT DOOR IN SINGAPORE’S HDB ESTATES</p>
                </div>
            `,
            location: ISLAND,
            onChapterEnter: showLayers(['hdbEstates', 'hdbAll', 'hdbBlocks', 'bus', 'mrt']),   // add 'walkshed' to show the 15-min walk circles
            onChapterExit: []
        },

        // ---------- CHAPTER 2: THE URBAN PROBLEM ----------
        // same island map, all layers off so the cards are easier to read;
        // the four issue cards are built from config.panels.issues
        {
            id: 'urban-problem',
            group: 2,
            navTitle: 'The urban problem',
            hideTitle: true,
            alignment: 'left',
            stepClass: 'panel-step',
            description: `
                <div class="story-box">
                    <div class="story-label">(02) THE URBAN PROBLEM</div>
                    <h2>Neighbourhoods are becoming hard to navigate.</h2>
                    <p>Some newer HDB estates have attracted attention for indirect routes, fragmented void decks and circulation that is difficult to understand.</p>
                    <p>The challenge is not always a missing sign. Sometimes the spatial arrangement itself makes the next turn unclear.</p>
                </div>
                <div class="sp-panel" data-panel="issues"></div>
            `,
            location: ISLAND,
            onChapterEnter: showLayers([]),
            onChapterExit: []
        },

        // ---------- CHAPTER 3: EXISTING RESPONSES ----------
        // text box on the left; the tabbed panel is built from config.panels.responses
        {
            id: 'existing-responses',
            group: 3,
            navTitle: 'Existing responses',
            hideTitle: true,
            alignment: 'left',
            stepClass: 'panel-step',
            description: `
                <div class="story-box">
                    <div class="story-label">(03) EXISTING RESPONSES</div>
                    <h2>How are we making neighbourhoods easier to navigate?</h2>
                    <p>Bigger signs, coloured blocks and familiar murals are some ways neighbourhoods are being made easier to navigate. But whose experiences shape these changes?</p>
                    <p>Residents, caregivers, designers and public agencies each see different problems. Their feedback can help shape what gets designed, tested and improved.</p>
                </div>
                <div class="sp-panel" data-panel="responses"></div>
            `,
            location: REGION,
            onChapterEnter: showLayers(['boundaries', 'neighbourhoods', 'goToPoints']),
            onChapterExit: []
        },

        // ---------- CHAPTER 4: FILL THE GAP (spinning ring → Four Walks page) ----------
        {
            id: 'four-walks-finale',
            group: 4,
            navTitle: 'Fill the gap',
            hideTitle: true,
            alignment: 'left',
            description: `
                <section class="ch9-layout">

                    <div class="ch9-introduction">
                        <div class="ch9-eyebrow">(04) FILL THE GAP</div>
                        <h2 class="ch9-heading">Fill the gap. Add your cues.</h2>
                        <p class="ch9-summary">
                            What do you see? A familiar smell. The sound of the playground. The shade of a tree.
                            A neighbour you recognise. These are all ways we find our way home.
                        </p>
                        <p class="ch9-summary">
                            But these everyday cues rarely appear on maps. What do you notice on your walk home?
                            What helps you find your way, and what gets you lost?
                        </p>
                        <div class="ch9-criteria">
                            <span>What guides you?</span>
                            <span>See · shops, colours, trees</span>
                            <span>Hear · playgrounds, traffic, voices</span>
                            <span>Remember · routines, encounters, memories</span>
                            <span>Move · shortcuts, slopes, crossings</span>
                        </div>
                        <a class="ch9-cta" href="four data.html" style="margin-right:22px;">SEE OUR FOUR WALKS ↗</a>
                        <a class="ch9-cta" href="survey.html">ADD YOUR WALK ↗</a>
                    </div>

                    <div class="ch9-gallery">
                        <div class="ch9-ring">
                        <a class="ch9-walk ch9-walk-1" href="four data.html#queenstown" aria-label="Explore the Queenstown walk">
                            <div class="ch9-walk-inner">
                                <div class="ch9-walk-label">
                                    <span>01 / TOUCH · GROUND &amp; TEXTURE</span>
                                    <strong>Queenstown</strong>
                                </div>
                                <div class="ch9-walk-image">
                                    <img src="assets/People/laura.png" alt="Laura" loading="lazy">
                                </div>
                            </div>
                        </a>

                        <a class="ch9-walk ch9-walk-2" href="four data.html#holland-village" aria-label="Explore the Holland Village walk">
                            <div class="ch9-walk-inner">
                                <div class="ch9-walk-label">
                                    <span>02 / FEEL · SLOPE &amp; HEIGHT</span>
                                    <strong>Holland Village</strong>
                                </div>
                                <div class="ch9-walk-image">
                                    <img src="assets/People/heymans.png" alt="Heymans" loading="lazy">
                                </div>
                            </div>
                        </a>

                        <a class="ch9-walk ch9-walk-3" href="four data.html#jurong-east" aria-label="Explore the Jurong East walk">
                            <div class="ch9-walk-inner">
                                <div class="ch9-walk-label">
                                    <span>03 / SEE · SHOPFRONTS &amp; SIGNS</span>
                                    <strong>Jurong East</strong>
                                </div>
                                <div class="ch9-walk-image">
                                    <img src="assets/People/jamie.png" alt="Jamie" loading="lazy">
                                </div>
                            </div>
                        </a>

                        <a class="ch9-walk ch9-walk-4" href="four data.html#bishan" aria-label="Explore the Bishan walk">
                            <div class="ch9-walk-inner">
                                <div class="ch9-walk-label">
                                    <span>04 / SMELL</span>
                                    <strong>Bishan</strong>
                                </div>
                                <div class="ch9-walk-image">
                                    <img src="assets/People/david.png" alt="David" loading="lazy">
                                </div>
                            </div>
                        </a>
                        </div>
                        <div class="ch9-gallery-center">
                            <span>FOUR WALKS</span>
                            <small>Click one of us to explore</small>
                        </div>
                    </div>

                </section>
            `,
            location: FOUR_HOODS,
            onChapterEnter: showLayers(['neighbourhoods']),
            onChapterExit: []
        }
    ]
};


// =====================================================
// CHAPTER 2 + 3 PANELS — the content of the cards and tabs
// (index.html builds the cards from this; change only the text)
// photo: a missing photo shows as a grey frame with its file name
// =====================================================
config.panels = {

    // ---------- CHAPTER 2: four issue cards ----------
    issues: {
        head: 'SPATIAL ISSUES FOUND THROUGH PUBLIC DISCOURSE',
        hint: 'Click a card for evidence and sources',
        footnote: 'Photographs supplied for this project; diagrams are conceptual, not measured plans. Source: CNA (image credit visible in photographs).',
        photoCredit: '(CNA, 2026)',
        cards: [
            {
                kicker: '01 / LOOK-ALIKE SPACES',
                title: 'Which block is it?',
                sub: 'Everything looks so similar. How do I know which block is mine?',
                photo: 'assets/Ubi Grove/ubi_grove_bto.avif',
                detailKicker: 'SPATIAL CONDITION',
                detailTitle: 'Repeated spaces and indistinct landmarks',
                body: 'Repetitive block forms and similar-looking corridors can make it difficult to distinguish one place from another, particularly for visitors or people unfamiliar with the estate. The challenge is telling one block from the next.',
                photos: ['assets/Ubi Grove/ubi_grove_bto.avif', 'assets/Rivervale Shores/bto_void_deck7.avif'],
                links: [['CNA: HDB void deck maze', 'https://www.channelnewsasia.com/cna-insider/ground-up/hdb-void-deck-complicated-maze-6481881']]
            },
            {
                kicker: '02 / INDIRECT ROUTES',
                title: 'Why can’t I walk straight there?',
                sub: 'I can see where I need to go, but the path takes me all the way around.',
                photo: 'assets/Ubi Grove/ubi-grove-path.avif',
                detailKicker: 'SPATIAL CONDITION',
                detailTitle: 'Visibility is not the same as access',
                body: 'A bus stop or destination may be visible across an estate but reachable only by an indirect route. Walls, planting and entrances can turn a short distance into a long walk.',
                photos: ['assets/Ubi Grove/ubi-grove-path.avif', 'assets/Ubi Grove/tile_collage.avif', 'assets/Tampines GreenOpal/bto-void-deck13.avif'],
                links: [['CNA reporting', 'https://www.channelnewsasia.com/cna-insider/ground-up/hdb-void-deck-complicated-maze-6481881']]
            },
            {
                kicker: '03 / CONFUSING JUNCTIONS',
                title: 'Which way do I turn?',
                sub: 'There are so many corners and passages. Where does this one lead?',
                photo: 'assets/Tampines GreenOpal/bto_void_deck12.avif',
                detailKicker: 'SPATIAL CONDITION',
                detailTitle: 'Decisions along the way',
                body: 'At junctions, changes in level and lift lobbies, people need enough spatial information to decide where to go next. Landmarks, sightlines, connections and signage may all influence these decisions.',
                photos: ['assets/Tampines GreenOpal/bto_void_deck12.avif', 'assets/Tampines GreenOpal/bto-void-deck13.avif', 'assets/Bidadari Alkaff CourtView/carpark-hdb.avif'],
                links: [['Read related reporting', 'https://www.channelnewsasia.com/cna-insider/ground-up/hdb-void-deck-complicated-maze-6481881']]
            },
            {
                kicker: '04 / HARD-TO-READ LAYOUTS',
                title: 'Where is the entrance?',
                sub: 'I can see the block number, but I still can’t work out how to get in.',
                photo: 'assets/Bidadari Alkaff CourtView/bto_void_deck10.avif',
                detailKicker: 'NEWS / SOURCE',
                detailTitle: 'When the void deck becomes a maze',
                body: 'CNA Insider reports on navigation difficulties in selected HDB developments and the design considerations behind complex ground-level spaces. Read the full reporting for interviews, examples and context.',
                photos: ['assets/Bidadari Alkaff CourtView/bto_void_deck10.avif', 'assets/Bidadari Alkaff CourtView/carpark-hdb.avif', 'assets/Ubi Grove/ubi_grove_bto.avif'],
                links: [['Open CNA article', 'https://www.channelnewsasia.com/cna-insider/ground-up/hdb-void-deck-complicated-maze-6481881']]
            }
        ]
    },

    // ---------- CHAPTER 3: tabs ----------
    responses: {
        head: 'HOW SINGAPORE RESPONDS',
        tabs: ['01 / At a glance', '02 / Built projects', '03 / News & media', '04 / Design guidance'],

        overview: {
            intro: 'Residents point out what is confusing. Designers try new ideas. Agencies put changes in place. Here are some of the responses.',
            question: 'Residents often notice what plans and standards miss. Their feedback can change what gets built.',
            footnote: 'Choose one of the three pathways to explore further.',
            // photo: the picture in each frame (swap the file names for your own photos)
            paths: [
                { tab: 1, icon: 'projects', photo: 'assets/building.png', index: '01 / BUILT PROJECTS', title: 'See what’s been tried', who: 'Residents · Designers · Town Councils · Public agencies', cta: 'Explore projects ↗' },
                { tab: 2, icon: 'news',     photo: 'assets/news.png', index: '02 / NEWS & MEDIA',    title: 'Hear different experiences', who: 'Residents · Caregivers · Journalists · Community voices', cta: 'Explore stories ↗' },
                { tab: 3, icon: 'guidance', photo: 'assets/ideas.png', index: '03 / DESIGN GUIDANCE', title: 'See how it’s designed', who: 'Architects · Planners · LTA · HDB · BCA · Researchers', cta: 'Explore guidance ↗' }
            ]
        },

        projects: {
            filterLabel: 'WAYFINDING METHOD',
            filters: ['All', 'Signs & maps', 'Colour & landmarks', 'Memory & familiarity', 'Routes & access'],
            countLabel: 'PROJECTS / PRECEDENTS',
            footnote: 'Built interventions and documented transit or district precedents. Evidence of effectiveness varies by project.',
            items: [
                { name: 'Zhenghua / Senja', tag: 'DIRECTIONAL SIGNAGE', method: 'Signs & maps', photo: 'assets/built-projects/zhenghua-after.png',
                  short: 'Clearer directions, type sizes and signs tested on site.',
                  body: 'The Zhenghua Wayfinding Project at Senja and Segar explored clearer directional signage to help residents and visitors find destinations such as Bukit Panjang Polyclinic and West View Primary School. Stakeholder feedback and test prints informed design decisions.',
                  links: [['OneService', 'https://www.oneservice.gov.sg/']] },
                { name: 'Nee Soon / Khatib Central', tag: 'COLOUR & LANDMARKS', method: 'Colour & landmarks', photo: 'assets/built-projects/nee-soon-colour-zoning.png',
                  short: 'Colour-coded blocks and familiar local icons.',
                  body: 'Dementia-friendly interventions in parts of Nee Soon use colour and locally associated icons to support orientation. Their reception also raises questions about visual overload and whether cues are meaningful to different residents.',
                  links: [['Dementia Singapore', 'https://dementia.org.sg/']] },
                { name: 'Kebun Baru / Ang Mo Kio', tag: 'MURALS & MEMORY', method: 'Memory & familiarity', photo: 'assets/built-projects/kebun-baru-murals.png',
                  short: 'Familiar images near important decision points.',
                  body: 'Nostalgic murals aim to support recognition and wayfinding by linking locations to familiar imagery. Familiarity is personal and can vary between residents.',
                  links: [['Dementia Singapore', 'https://dementia.org.sg/']] },
                { name: 'Yio Chu Kang', tag: 'NEIGHBOURHOOD DESIGN', method: 'Routes & access', photo: 'assets/built-projects/yio-chu-kang-ground-markers.png',
                  short: 'Signs, accessible paths and community spaces considered together.',
                  body: 'The Yio Chu Kang dementia-friendly neighbourhood pilot considers navigation alongside physical access, safety, heritage identity and community life.',
                  links: [['CLC / AIC design guide', 'https://knowledgehub.clc.gov.sg/publications-library/dementia-friendly-neighbourhood-design-guide/'], ['CLC pilot publication', 'https://clc.gov.sg/docs/default-source/books/creating-a-dementia-friendly-neighbourhood_a-yio-chu-kang-pilot-project.pdf']] },
                { name: 'LTA street-level wayfinding pilot', tag: 'MAPS & DIRECTIONS', method: 'Signs & maps', photo: 'assets/built-projects/lta-street-wayfinding.png',
                  short: 'Kiosks, neighbourhood maps and fingerposts in the Central Area and Yishun.',
                  body: 'A street-level pilot uses different scales of map and direction signs. Useful for comparing routes through streets with routes inside HDB precincts.',
                  links: [['LTA announcement', 'https://www.lta.gov.sg/content/ltagov/en/newsroom/2023/12/news-releases/pilot_for_new_street-level_wayfinding_system.html']] },
                { name: 'MRT wayfinding redesign', tag: 'INFORM · DIRECT · CONFIRM', method: 'Signs & maps', photo: 'assets/built-projects/mrt-wayfinding-signage.png',
                  short: 'Consistent station maps, exit identifiers and directional signs.',
                  body: 'The MRT signage system is a transport precedent for providing information at different stages of a journey. It is not an HDB-estate intervention.',
                  links: [['LTA TEL signage factsheet', 'https://lta.gov.sg/content/dam/ltagov/news/press/2019/20191211_TEL1_new_systemmap_wayfinding_signage.pdf'], ['RICE Media interview', 'https://www.ricemedia.co/the-wayfinder-who-revamped-mrt-station-signs/']] },
                { name: 'SBS Transit — Find Your Way', tag: 'DEMENTIA-FRIENDLY TRANSIT', method: 'Memory & familiarity', photo: 'assets/built-projects/sbs-find-your-way.png',
                  short: 'A dementia-friendly navigation initiative in public transport.',
                  body: 'A transport-focused example to compare with residential neighbourhood wayfinding. See the project source for its actual implemented features.',
                  links: [['SBS Transit', 'https://www.sbstransit.com.sg/findyourway']] },
                { name: 'Jurong East J-Walk signage', tag: 'DISTRICT CONNECTIONS', method: 'Routes & access', photo: 'assets/built-projects/jurong-east-jwalk.png',
                  short: 'Coordinated signs across elevated pedestrian links.',
                  body: 'A district-scale guideline for continuous connections, useful for thinking beyond individual buildings. This is a documented signage framework, not an independently evaluated outcome.',
                  links: [['LTA J-Walk guidelines', 'https://www.lta.gov.sg/content/dam/ltagov/industry_innovations/industry_matters/development_construction_resources/architectural_standards/pdf/20150209%20j%20walk%20signage%20guidelines.pdf']] }
            ]
        },

        news: {
            topicLabel: 'TOPIC',
            topics: ['All topics', 'Getting lost', 'Signs & design', 'Inclusive spaces', 'Mobility & access'],
            sourceLabel: 'SOURCE',
            sources: ['All sources', 'Journalism / editorial', 'Government / institutional', 'Specialist / community', 'Video'],
            countLabel: 'SOURCES',
            footnote: 'Source type describes who published the item, not whether its subject is a government initiative. Some linked sources remain unreviewed.',
            items: [
                { name: 'When the void deck becomes a maze', tag: 'CNA INSIDER / REPORTING', topic: 'Getting lost', source: 'Journalism / editorial',
                  short: 'Newer HDB void decks and complicated circulation routes.',
                  body: 'Reporting on how the arrangement of some newer HDB developments can make routes less intuitive. Read the article for the specific estates, interviews and architectural context.',
                  links: [['Read CNA article', 'https://www.channelnewsasia.com/cna-insider/ground-up/hdb-void-deck-complicated-maze-6481881']] },
                { name: 'Street-level wayfinding pilot', tag: 'LTA / NEWS RELEASE', topic: 'Signs & design', source: 'Government / institutional',
                  short: 'Kiosks, totems and fingerposts to help people orient themselves.',
                  body: 'LTA announced a street-level wayfinding pilot for the Central Area and Yishun in December 2023. It offers a useful comparison between public street information and the experience within residential estates.',
                  links: [['Read LTA announcement', 'https://www.lta.gov.sg/content/ltagov/en/newsroom/2023/12/news-releases/pilot_for_new_street-level_wayfinding_system.html']] },
                { name: 'Designing a dementia-friendly neighbourhood', tag: 'CLC / PROJECT PUBLICATION', topic: 'Inclusive spaces', source: 'Government / institutional',
                  short: 'The Yio Chu Kang pilot and its broader environmental approach.',
                  body: 'A publication on the Yio Chu Kang pilot describes how dementia-friendly neighbourhood design can involve more than directional signs.',
                  links: [['Read project publication', 'https://clc.gov.sg/docs/default-source/books/creating-a-dementia-friendly-neighbourhood_a-yio-chu-kang-pilot-project.pdf']] },
                { name: 'MRT station features across Singapore', tag: 'MUSTSHARENEWS / JUL 2026', topic: 'Signs & design', source: 'Journalism / editorial',
                  short: 'An overview of distinctive MRT station features and how travellers encounter them.',
                  links: [['Open original source', 'https://mustsharenews.com/mrt-stations-features/']] },
                { name: 'Autism-friendly features in Singapore', tag: 'MUSTSHARENEWS / APR 2026', topic: 'Inclusive spaces', source: 'Journalism / editorial',
                  short: 'Examples of sensory and accessibility features; relevant to inclusive navigation beyond HDB estates.',
                  links: [['Open original source', 'https://mustsharenews.com/autism-friendly-features-singapore/amp/']] },
                { name: 'The wayfinder who revamped MRT station signs', tag: 'RICE MEDIA / MAR 2025', topic: 'Signs & design', source: 'Journalism / editorial',
                  short: 'A look at the design thinking behind Singapore MRT wayfinding signage.',
                  links: [['Open original source', 'https://www.ricemedia.co/the-wayfinder-who-revamped-mrt-station-signs/']] },
                { name: 'Confusing place names', tag: 'RICE MEDIA / MAR 2024', topic: 'Getting lost', source: 'Journalism / editorial',
                  short: 'A related discussion about naming and how places are understood.',
                  links: [['Open original source', 'https://www.ricemedia.co/?p=70422']] },
                { name: 'When my gong gong with dementia went missing', tag: 'STACKED HOMES / SEP 2024', topic: 'Getting lost', source: 'Journalism / editorial',
                  short: 'A personal account raising questions about dementia and neighbourhood preparedness.',
                  links: [['Open original source', 'https://stackedhomes.com/when-my-gong-gong-with-dementia-went-missing-are-singapores-neighbourhoods-prepared-for-an-ageing-crisis/']] },
                { name: 'Mobility scooter rules', tag: 'MALAY MAIL / FEB 2026', topic: 'Mobility & access', source: 'Journalism / editorial',
                  short: 'Related accessibility and mobility policy; not itself a wayfinding intervention.',
                  links: [['Open original source', 'https://www.malaymail.com/news/singapore/2026/02/04/medical-certs-speed-cuts-singapore-to-clamp-down-on-personal-mobility-scooters-with-tougher-rules-from-june/207990']] },
                { name: 'Changi Airport Calm Room', tag: 'WANDERLUST / OCT 2025', topic: 'Inclusive spaces', source: 'Journalism / editorial',
                  short: 'A sensory-friendly space for neurodivergent travellers, offered as a related precedent.',
                  links: [['Open original source', 'https://www.wanderlustmagazine.com/news/singapore-changi-airport-sensory-space-neurodivergent-travellers/']] },
                { name: 'Public feedback on CCL6 signage', tag: 'SGTRAINS / MAR 2025', topic: 'Signs & design', source: 'Specialist / community',
                  short: 'Public feedback on planned Circle Line wayfinding signage.',
                  links: [['Open original source', 'https://blog.sgtrains.com/2025/03/lta-seeks-public-feedback-on-new-ccl-wayfinding-signage-ahead-of-ccl6-opening-in-2026/']] },
                { name: 'The new MRT wayfinding system, one year on', tag: 'SGTRAINS / FEB 2021', topic: 'Signs & design', source: 'Specialist / community',
                  short: 'A retrospective on the MRT signage system after its introduction.',
                  links: [['Open original source', 'https://blog.sgtrains.com/2021/02/new-wayfinding-system-one-year-on/']] },
                { name: 'Man with dementia travelled from Choa Chu Kang to Bedok', tag: 'MOTHERSHIP / 2018', topic: 'Getting lost', source: 'Journalism / editorial',
                  short: 'A reported dementia-related wandering case; link supplied, article not independently reviewed.',
                  links: [['Open original source', 'https://mothership.sg/2018/11/dementia-elderly-parent-caregiver-reality-2']] },
                { name: 'Lost in transit', tag: 'ASIA NEWS NETWORK / RELATED READING', topic: 'Getting lost', source: 'Journalism / editorial',
                  short: 'Related reporting on navigating transit; article not independently reviewed.',
                  links: [['Open original source', 'https://asianews.network/?p=258037']] },
                { name: 'DIY wayfinding signs', tag: 'VIDEO / YOUTUBE', topic: 'Signs & design', source: 'Video',
                  short: 'Community-created wayfinding signs; video not independently reviewed.',
                  links: [['Open original source', 'https://www.youtube.com/watch?v=cSf6Gfym6og']] },
                { name: 'MRT signage explained', tag: 'VIDEO / ASIAONE', topic: 'Signs & design', source: 'Video',
                  short: 'Video on MRT signage; video not independently reviewed.',
                  links: [['Open original source', 'https://www.youtube.com/watch?v=5Cis_h7c2TE']] },
                { name: 'Dementia-friendly Singapore', tag: 'VIDEO / THE STRAITS TIMES', topic: 'Inclusive spaces', source: 'Video',
                  short: 'Video about dementia-friendly environments; video not independently reviewed.',
                  links: [['Open original source', 'https://www.youtube.com/watch?v=XZtA9cL8H6w']] }
            ]
        },

        guidance: {
            filterLabel: 'WHAT DO YOU NEED?',
            countLabel: 'GUIDES',
            footnote: 'Mandatory requirements, voluntary standards and advisory guides have different legal status. Confirm applicability before use.',
            groups: [
                { name: 'Signs & maps', help: 'Choose readable signs, symbols, maps and directions at decision points.', items: [
                    { name: 'SS 599:2014 Guide for wayfinding signage in public areas', url: 'https://www.singaporestandardseshop.sg/Product/SSPdtDetail/9c68c888-43d8-4536-8611-a10ddf939b36',
                      issuer: 'Enterprise Singapore (Safety & Quality Standards Committee), 2014, current', status: 'National standard (voluntary unless a code cites it)', applies: 'Indoor and outdoor public areas, for pedestrians',
                      use: 'Use when choosing public-sign typography, pictograms and basic sign design.',
                      body: 'Wayfinding principles and sign elements, with specific consideration for the elderly; includes a pictogram set. Excludes safety, evacuation, disability-specific, road and car-park signs.' },
                    { name: 'Guide for Wayfinding Signage', url: 'https://www.lta.gov.sg/content/dam/ltagov/industry_innovations/industry_matters/development_construction_resources/walking_cycling_plan/pdf/Guide%20for%20Wayfinding%20Signage.pdf',
                      issuer: 'LTA, Walking & Cycling Plan resources', status: 'Guidance tied to a mandatory submission', applies: 'Developments and their links to transit',
                      use: 'Use when locating signs along routes to transit and amenities.',
                      body: 'IDIAC: Identity, Directional, Informational, Advisory/Regulatory, Confirmation (repeated every 20–30 m). Signs go at decision points, junctions, atria and transit links. Physical specs defer to SS 599.' },
                    { name: 'Transit signage system (TEL1 factsheet)', url: 'https://lta.gov.sg/content/dam/ltagov/news/press/2019/20191211_TEL1_new_systemmap_wayfinding_signage.pdf',
                      issuer: 'LTA, Dec 2019', status: 'Operating standard for rail', applies: 'MRT stations from TEL onward',
                      use: 'Use to understand how MRT information guides, directs and confirms a journey.',
                      body: 'Inform → Direct → Confirm: one-stop information points, then directional signs, then exit identifiers; larger fonts, stronger contrast, new icons, numbered exits.' },
                    { name: 'J-Walk Signage Guidelines', url: 'https://www.lta.gov.sg/content/dam/ltagov/industry_innovations/industry_matters/development_construction_resources/architectural_standards/pdf/20150209%20j%20walk%20signage%20guidelines.pdf',
                      issuer: 'LTA, 2015', status: 'District guideline (Jurong Lake District)', applies: 'Second-storey pedestrian network from Jurong East MRT',
                      use: 'Use for a coordinated sign system across an elevated district walkway network.',
                      body: 'Five sign types (identity, directional, information, guide maps, transit identification); one brand, colour and typeface (Futura); signs at decision zones, sheltered, lit at 200–500 lux. A model for a precinct-wide system.' },
                    { name: 'Street-level wayfinding pilot', url: 'https://www.lta.gov.sg/content/ltagov/en/newsroom/2023/12/news-releases/pilot_for_new_street-level_wayfinding_system.html',
                      issuer: 'LTA, Dec 2023', status: 'Pilot; may become a standard', applies: 'Streets in the Central Area and Yishun',
                      use: 'Use to compare neighbourhood maps, totems and directional fingerposts.',
                      body: 'Kiosk (wider area), Totem (immediate area), Fingerpost (confirmation); “You are here” maps with 3D landmarks.' }
                ]},
                { name: 'Walking routes', help: 'Plan continuous, direct connections from buildings to public transport.', items: [
                    { name: 'Walking and Cycling Plan (WCP)', url: 'https://www.ura.gov.sg/guidelines/development-control/development-control-handbooks/residential/flats-condominiums/wcp/',
                      issuer: 'URA development control + LTA', status: 'Mandatory for qualifying developments (e.g. flats and condos over 700 units; HDB over 1,000 units coordinated with HDB)', applies: 'New developments',
                      use: 'Use when planning direct pedestrian connections in qualifying new developments.',
                      body: 'Must show direct access to public transport, “way-finding signage to public transport facilities and amenities”, and barrier-free access for children, elderly and mobility-challenged groups.' },
                    { name: 'RE:think – Designing for Wayfinding', url: 'https://www.lta.gov.sg/content/dam/ltagov/who_we_are/statistics_and_publications/books/pdf/REthink_190918web.pdf',
                      issuer: 'LTA Architecture, 2018', status: 'Design handbook', applies: 'MRT stations',
                      use: 'Use when designing legible spaces through layout, light, colour and views—not just signs.',
                      body: 'Space, Light, Colour, Visual: wayfinding is designed through layout, sightlines, daylight, line colours and art, so stations need fewer signs. Station codes in coloured “caplets”.' }
                ]},
                { name: 'Accessibility & safety', help: 'Make routes and information easier to use for people with different mobility and sensory needs.', items: [
                    { name: 'Universal Design Guide for Public Places', url: 'https://www1.bca.gov.sg/docs/default-source/universaldesign/udguide2016.pdf',
                      issuer: 'BCA, 2016', status: 'Good-practice guide (beyond the code)', applies: 'Public buildings',
                      use: 'Use for accessible, intuitive information and visual reference points.',
                      body: 'Seven Principles of Universal Design (incl. “simple and intuitive” and “perceptible information”). Wayfinding chapter: legible characters sized to viewing distance, strong contrast, at least 200 lux, multilingual signs at about 2,100 mm, symbols, a directory with map at entrances, braille maps, visual reference points (atria, views, landmarks).' },
                    { name: 'Code on Accessibility in the Built Environment 2025', url: 'https://www1.bca.gov.sg/docs/default-source/docs-corp-news-and-publications/circulars/circular---code-on-accessibility-in-the-built-environment-2025.pdf',
                      issuer: 'BCA, in force from 1 Nov 2025', status: 'Mandatory', applies: 'Building works',
                      use: 'Use to check mandatory accessibility provisions for applicable building works.',
                      body: 'Accessible routes and entrances, International Symbol of Access, tactile indicators at stairs, colour bands on ramps, “T” telecoil signs. No dementia, autism or sensory clauses.' },
                    { name: 'Fire Code 2023', url: 'https://www.scdf.gov.sg/fire-safety-services-listing/fire-code-2023/table-of-content/chapter-2-means-of-escape/clause-2.3-means-of-escape-requirements',
                      issuer: 'SCDF', status: 'Mandatory', applies: 'All buildings',
                      use: 'Use to check fire-exit and staircase-identification requirements.',
                      body: 'Staircase storey signs at every landing (min. 300 × 300 mm; storey number at least 125 mm high; contrasting colour). Exit signs and exit lighting are in Chapter 8.' }
                ]},
                { name: 'Neighbourhood identity', help: 'Understand estate names, local landmarks and dementia-friendly orientation.', items: [
                    { name: 'Dementia-Friendly Neighbourhood Design Guide', url: 'https://knowledgehub.clc.gov.sg/publications-library/dementia-friendly-neighbourhood-design-guide/',
                      issuer: 'Centre for Liveable Cities with AIC, updated Mar 2025', status: 'Guidance', applies: 'HDB neighbourhoods',
                      use: 'Use for neighbourhood-level design that supports orientation and familiarity.',
                      body: 'Combines agency and international dementia-friendly principles for high-density estates; built on the AIC–CLC study and the Yio Chu Kang pilot (CLC pilot book).' },
                    { name: 'Handbook on Guidelines for Naming of Buildings and Estates (and the streets handbook)', url: 'https://isomer-user-content.by.gov.sg/472/f77f2582-2fa0-40af-87c8-590653d9c9ad/SBNB-handbook-building.pdf',
                      issuer: 'Street & Building Names Board (URA is secretariat)', status: 'Mandatory approval', applies: 'Building, estate and precinct names',
                      use: 'Use to understand how buildings and estates are officially named.',
                      body: 'Names must reflect location, avoid duplicates, and be short and easy to pronounce. Precinct boundaries are set by HDB with planners, and names are approved by SBNB and published on OneMap (MND, Mar 2024).' },
                    { name: 'HDB block and precinct signage', url: 'https://www.sg101.gov.sg/resources/archives/infrastructure-age-friendly-neighbourhoods/',
                      issuer: 'HDB (build), Town Councils (maintain)', status: 'No public guideline found', applies: 'Block numbers, light boxes, lobby and directory boards',
                      use: 'Background on block-number practices; no public estate-wide guide was identified in the supplied research.',
                      body: 'Practice only: block numbers on façades and light boxes, plus eye-level numbers in some upgraded estates (SG101).' }
                ]},
                { name: 'Other sign rules', help: 'Check requirements for outdoor commercial signs; not a general pedestrian wayfinding guide.', items: [
                    { name: 'Outdoor sign display guidelines', url: 'https://www1.bca.gov.sg/regulatory-info/outdoor-advertisement-licensing/outdoor-advertising-sign-signboard/sign-display-guidelines-and-requirements',
                      issuer: 'BCA (with URA)', status: 'Mandatory licensing', applies: 'Commercial and advertising signs',
                      use: 'Use for commercial sign licensing, not as a general wayfinding standard.',
                      body: 'Licensing, size and illumination limits; signs on residential buildings prohibited. Shows that commercial signs are regulated more tightly than wayfinding.' }
                ]}
            ]
        }
    }
};