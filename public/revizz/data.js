const DEMO_COURSES = [
  {id:'svt', title:'La photosynthèse', subject:'SVT', chapter:'Énergie et cellule vivante', level:'Terminale', color:'green', icon:'leaf', date:'2026-10-20', mastery:68, pages:4, sections:[
    {title:'Le principe de la photosynthèse',text:'La photosynthèse permet aux végétaux chlorophylliens de produire de la matière organique à partir de matière minérale, grâce à l’énergie lumineuse. Elle utilise du dioxyde de carbone (CO₂) et de l’eau (H₂O), et libère du dioxygène (O₂).'},
    {title:'Le bilan de la réaction',text:'Le bilan simplifié est : 6 CO₂ + 6 H₂O + énergie lumineuse → C₆H₁₂O₆ + 6 O₂. Le glucose est une molécule organique qui peut être utilisée pour la respiration ou stockée sous forme d’amidon.'},
    {title:'Le rôle des chloroplastes',text:'La photosynthèse a lieu dans les chloroplastes des cellules chlorophylliennes. La chlorophylle, située dans les membranes des thylakoïdes, absorbe principalement les lumières bleue et rouge.'},
    {title:'Les deux phases',text:'La phase photochimique se déroule dans les thylakoïdes. Elle dépend directement de la lumière et produit de l’ATP et du NADPH. La fixation du CO₂ se déroule dans le stroma, au cours du cycle de Calvin. Elle utilise l’ATP et le NADPH pour permettre la synthèse de matière organique.'},
    {title:'Les facteurs limitants',text:'L’intensité lumineuse, la concentration en CO₂ et la température influencent la vitesse de la photosynthèse. Un facteur limitant est un paramètre dont la faible disponibilité freine le processus, même lorsque les autres paramètres sont favorables.'}
  ],cards:[
    {q:'Où se déroule la photosynthèse dans la cellule ?',a:'Dans les chloroplastes des cellules chlorophylliennes.',source:2},
    {q:'Quels sont les deux réactifs minéraux de la photosynthèse ?',a:'Le dioxyde de carbone (CO₂) et l’eau (H₂O).',source:0},
    {q:'Complète : 6 CO₂ + 6 H₂O + lumière → … + 6 O₂',a:'C₆H₁₂O₆, le glucose.',source:1},
    {q:'Où se déroule le cycle de Calvin ?',a:'Dans le stroma du chloroplaste.',source:3},
    {q:'Quelles couleurs la chlorophylle absorbe-t-elle principalement ?',a:'Les lumières bleue et rouge.',source:2},
    {q:'Qu’est-ce qu’un facteur limitant ?',a:'Un paramètre dont la faible disponibilité freine la photosynthèse, même si les autres paramètres sont favorables.',source:4}
  ],quiz:[
    {q:'Dans quelle structure cellulaire se déroule la photosynthèse ?',options:['La mitochondrie','Le chloroplaste','Le noyau','Le ribosome'],correct:[1],explanation:'La photosynthèse a lieu dans les chloroplastes. Les membranes des thylakoïdes contiennent la chlorophylle.',source:2},
    {q:'Quels éléments sont consommés lors de la photosynthèse ?',options:['Le dioxyde de carbone','Le dioxygène','L’eau','Le glucose'],correct:[0,2],explanation:'Le CO₂ et l’eau sont les réactifs. Le glucose et le dioxygène sont des produits de la réaction.',source:1},
    {q:'Où la fixation du CO₂ se déroule-t-elle ?',options:['Dans le noyau','Dans les thylakoïdes','Dans le stroma','Dans la membrane cellulaire'],correct:[2],explanation:'Le cycle de Calvin fixe le CO₂ dans le stroma, en utilisant l’ATP et le NADPH.',source:3},
    {q:'Quelles couleurs la chlorophylle absorbe-t-elle principalement ?',options:['Le vert et le jaune','Le bleu et le rouge','Le rouge et le vert','Uniquement le bleu'],correct:[1],explanation:'La chlorophylle absorbe surtout les lumières bleue et rouge.',source:2},
    {q:'Quels paramètres peuvent limiter la photosynthèse ?',options:['La concentration en CO₂','L’intensité lumineuse','La température','Le nombre de noyaux'],correct:[0,1,2],explanation:'Le cours cite la lumière, la concentration en CO₂ et la température comme facteurs influençant la photosynthèse.',source:4}
  ]},
  {id:'maths',title:'Dérivation et variations',subject:'Mathématiques',chapter:'Analyse · Chapitre 3',level:'Terminale',color:'purple',icon:'function',date:'2026-10-19',mastery:42,pages:6,sections:[
    {title:'Le nombre dérivé',text:'Le nombre dérivé de f en a est la limite, lorsqu’elle existe, du taux d’accroissement [f(a+h) − f(a)] / h lorsque h tend vers 0. Il correspond au coefficient directeur de la tangente à la courbe au point d’abscisse a.'},
    {title:'Les dérivées usuelles',text:'La dérivée d’une constante est 0. Si f(x) = xⁿ, alors f′(x) = n × xⁿ⁻¹, sur un domaine où cette formule est définie. La dérivée de x² est 2x ; celle de 1/x est −1/x² pour x ≠ 0.'},
    {title:'Dérivée d’un produit',text:'Pour deux fonctions u et v dérivables sur un intervalle, (uv)′ = u′v + uv′. Il ne faut pas multiplier directement les deux dérivées.'},
    {title:'Signe de la dérivée et variations',text:'Sur un intervalle, si f′ est strictement positive, f est strictement croissante. Si f′ est strictement négative, f est strictement décroissante. Pour dresser un tableau de variations, calculer f′, étudier son signe puis en déduire les variations de f.'},
    {title:'Équation de la tangente',text:'L’équation de la tangente à la courbe de f au point d’abscisse a est y = f′(a)(x − a) + f(a). Pour f(x) = x² en a = 1, on obtient y = 2(x − 1) + 1 = 2x − 1.'}
  ],cards:[{q:'Quelle est la dérivée de x² ?',a:'f′(x) = 2x.',source:1},{q:'Quelle est la dérivée d’un produit uv ?',a:'(uv)′ = u′v + uv′.',source:2},{q:'Que signifie f′(x) > 0 sur un intervalle ?',a:'La fonction f est strictement croissante sur cet intervalle.',source:3},{q:'Quelle est l’équation de la tangente en a ?',a:'y = f′(a)(x − a) + f(a).',source:4},{q:'Que représente le nombre dérivé f′(a) ?',a:'Le coefficient directeur de la tangente en a.',source:0},{q:'Quelle est la dérivée d’une constante ?',a:'0.',source:1}],quiz:[
    {q:'Quelle est la dérivée de f(x) = x² ?',options:['x','2x','x³ / 3','2'],correct:[1],explanation:'La formule (xⁿ)′ = n × xⁿ⁻¹ donne (x²)′ = 2x.',source:1},
    {q:'Quelle est la bonne formule pour (uv)′ ?',options:['u′ × v′','u′ + v′','u′v + uv′','uv′ − u′v'],correct:[2],explanation:'La dérivée d’un produit est u′v + uv′. Multiplier les dérivées est une erreur fréquente.',source:2},
    {q:'Si f′ est strictement négative sur un intervalle, f est…',options:['Croissante','Constante','Décroissante','Nécessairement négative'],correct:[2],explanation:'Le signe de f′ détermine les variations de f, pas le signe de f.',source:3},
    {q:'La tangente à y = x² en x = 1 a pour équation…',options:['y = 2x','y = x + 1','y = 2x − 1','y = x² − 1'],correct:[2],explanation:'f′(1) = 2 et f(1) = 1. Donc y = 2(x − 1) + 1 = 2x − 1.',source:4}
  ]},
  {id:'histoire',title:'La Guerre froide',subject:'Histoire',chapter:'Un monde bipolaire · Chapitre 2',level:'Terminale',color:'orange',icon:'globe',date:'2026-10-18',mastery:81,pages:5,sections:[
    {title:'Un monde bipolaire',text:'La Guerre froide oppose les États-Unis et l’URSS de 1947 à 1991. Les deux puissances défendent des modèles idéologiques rivaux et organisent chacune un bloc d’alliés. Elles évitent un affrontement militaire direct entre elles.'},
    {title:'La rupture de 1947',text:'En 1947, la doctrine Truman vise à contenir l’expansion du communisme. Le plan Marshall propose une aide économique américaine à l’Europe. La doctrine Jdanov présente le monde comme divisé en deux camps antagonistes.'},
    {title:'Berlin, symbole de la division',text:'Le blocus de Berlin a lieu de juin 1948 à mai 1949. Les Occidentaux mettent en place un pont aérien. Le mur de Berlin est construit en août 1961 et s’ouvre le 9 novembre 1989.'},
    {title:'La crise de Cuba',text:'En octobre 1962, l’installation de missiles soviétiques à Cuba provoque une crise majeure. Les États-Unis mettent en place un blocus naval. La crise se termine par le retrait des missiles soviétiques et des engagements réciproques.'},
    {title:'La fin de la Guerre froide',text:'Mikhaïl Gorbatchev lance des réformes à partir de 1985. La chute du mur de Berlin en 1989 symbolise la fin de la division de l’Europe. L’URSS disparaît en décembre 1991, ce qui marque la fin de la Guerre froide.'}
  ],cards:[{q:'Quelles sont les dates de la Guerre froide ?',a:'De 1947 à 1991.',source:0},{q:'Quand le mur de Berlin s’ouvre-t-il ?',a:'Le 9 novembre 1989.',source:2},{q:'Quel est l’objectif de la doctrine Truman ?',a:'Contenir l’expansion du communisme.',source:1},{q:'Quand a lieu la crise de Cuba ?',a:'En octobre 1962.',source:3},{q:'Que se passe-t-il en décembre 1991 ?',a:'L’URSS disparaît, ce qui marque la fin de la Guerre froide.',source:4}],quiz:[
    {q:'Quelle période correspond à la Guerre froide ?',options:['1914–1918','1939–1945','1947–1991','1961–1989'],correct:[2],explanation:'La période de référence du cours est 1947–1991.',source:0},
    {q:'Quel événement a lieu le 9 novembre 1989 ?',options:['La construction du mur','L’ouverture du mur de Berlin','La fin de l’URSS','La crise de Cuba'],correct:[1],explanation:'L’ouverture du mur symbolise la fin de la division de l’Europe.',source:2},
    {q:'Quels événements sont liés à l’année 1947 ?',options:['La doctrine Truman','La construction du mur de Berlin','Le plan Marshall','La doctrine Jdanov'],correct:[0,2,3],explanation:'Les doctrines Truman et Jdanov et le plan Marshall sont présentés dans la rupture de 1947. Le mur est construit en 1961.',source:1}
  ]},
  {id:'physique',title:'Les ondes mécaniques',subject:'Physique-chimie',chapter:'Ondes et signaux · Chapitre 1',level:'Terminale',color:'blue',icon:'waves',date:'2026-10-17',mastery:56,pages:3,sections:[
    {title:'Définition d’une onde mécanique',text:'Une onde mécanique est la propagation d’une perturbation dans un milieu matériel, sans transport global de matière. Elle transporte de l’énergie. Elle ne se propage pas dans le vide.'},
    {title:'La célérité',text:'La célérité v est la vitesse de propagation de la perturbation. Elle est égale au rapport de la distance parcourue d sur la durée Δt : v = d / Δt. Elle s’exprime en mètres par seconde (m·s⁻¹).'},
    {title:'Période, fréquence et longueur d’onde',text:'Pour une onde périodique, la période T est la plus petite durée de répétition du signal. La fréquence est f = 1 / T, exprimée en hertz. La longueur d’onde λ est la distance parcourue pendant une période : λ = v × T = v / f.'}
  ],cards:[{q:'Une onde mécanique transporte-t-elle de la matière ?',a:'Elle transporte de l’énergie, sans transport global de matière.',source:0},{q:'Quelle relation relie fréquence et période ?',a:'f = 1 / T.',source:2},{q:'Quelle est la formule de la célérité ?',a:'v = d / Δt, en m·s⁻¹.',source:1},{q:'Quelle relation définit la longueur d’onde ?',a:'λ = v × T = v / f.',source:2}],quiz:[{q:'Une onde mécanique peut-elle se propager dans le vide ?',options:['Oui, toujours','Non, elle nécessite un milieu matériel','Seulement si elle est rapide','Seulement pour le son'],correct:[1],explanation:'Une onde mécanique a besoin d’un milieu matériel.',source:0},{q:'Quelle est la relation entre longueur d’onde, célérité et fréquence ?',options:['λ = v × f','λ = f / v','λ = v / f','λ = v + f'],correct:[2],explanation:'Le cours donne λ = v × T = v / f.',source:2}]}
];

const APPLICATIONS={
 svt:[
  {q:'Exercice d’application : écris le bilan simplifié de la photosynthèse et nomme la molécule organique produite.',answer:'6 CO₂ + 6 H₂O + énergie lumineuse → C₆H₁₂O₆ + 6 O₂. La molécule organique produite est le glucose.',source:1,kind:'EXERCICE D’APPLICATION',keywords:['glucose','co2','h2o','o2']},
  {q:'Problème : deux plantes identiques ont la même quantité d’eau et de CO₂. L’une reçoit de la lumière, l’autre reste dans le noir. Explique, à partir du cours, quel facteur peut limiter leur production de matière organique.',answer:'La lumière fournit l’énergie nécessaire à la photosynthèse. Dans le noir, l’énergie lumineuse manque : la lumière est le facteur limitant de la production de matière organique.',source:4,kind:'PROBLÈME',keywords:['lumiere','energie','limitant']}
 ],
 maths:[
  {q:'Exercice d’application : à l’aide de la formule du cours, calcule la dérivée de f(x) = x³.',answer:'La formule (xⁿ)′ = n × xⁿ⁻¹ donne f′(x) = 3x².',source:1,kind:'EXERCICE D’APPLICATION',patterns:['3\\s*\\*?\\s*x\\s*(?:²|\\^\\s*2|2)']},
  {q:'Problème : une trajectoire est représentée par f(x) = x². Calcule l’équation de sa tangente en a = 1, en détaillant les étapes.',answer:'f′(x) = 2x, donc f′(1) = 2 et f(1) = 1. L’équation est y = 2(x − 1) + 1, soit y = 2x − 1.',source:4,kind:'PROBLÈME',patterns:['2\\s*\\*?\\s*x\\s*[-−]\\s*1']}
 ],
 histoire:[
  {q:'Exercice : replace dans l’ordre chronologique la construction du mur de Berlin, son ouverture et la disparition de l’URSS. Précise leurs années.',answer:'Construction du mur en 1961, ouverture du mur en 1989, disparition de l’URSS en 1991.',source:2,kind:'EXERCICE D’APPLICATION',keywords:['1961','1989','1991']},
  {q:'Analyse : explique comment Berlin illustre la division du monde pendant la Guerre froide, en utilisant les dates du cours.',answer:'Berlin symbolise la division entre les blocs rivaux des États-Unis et de l’URSS. Le blocus a lieu en 1948–1949, le mur est construit en 1961 et il s’ouvre en 1989.',source:2,kind:'ANALYSE DE SITUATION',keywords:['berlin','blocs','mur','1961','1989']}
 ],
 physique:[
  {q:'Exercice d’application : un signal a une période de 0,02 s. Calcule sa fréquence avec la relation du cours.',answer:'f = 1 / T = 1 / 0,02 = 50 Hz.',source:2,kind:'EXERCICE D’APPLICATION',patterns:['50\\s*(?:hz|hertz)']},
  {q:'Problème : une onde a une célérité de 6 m/s et une fréquence de 2 Hz. Quelle est sa longueur d’onde ? Donne la relation utilisée et l’unité.',answer:'λ = v / f = 6 / 2 = 3 m. La longueur d’onde vaut 3 mètres.',source:2,kind:'PROBLÈME',patterns:['3\\s*(?:m\\b|metre)']}
 ]
};

const ICONS={
 logo:'<path d="M7 19V5h7a5 5 0 0 1 0 10h-2l6 6M7 10h6"/>',
 grid:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
 book:'<path d="M12 5C8 2 4 3 2 4v15c3-1 7-1 10 2 3-3 7-3 10-2V4c-2-1-6-2-10 1zm0 0v16"/>',
 cards:'<rect x="7" y="5" width="14" height="17" rx="2"/><path d="M3 17V4a2 2 0 0 1 2-2h11M11 10h6m-6 4h4"/>',
 calendar:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4m10-4v4M3 11h18m-13 4h2m4 0h2m-8 3h2"/>',
 target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
 chart:'<path d="M4 3v17h17M8 15l4-5 4 2 5-7"/>',
 error:'<path d="M4 5h16v15H4zM8 2v6m8-6v6M8 12h8m-8 4h5"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>',
 chevron:'<path d="m9 5 7 7-7 7"/>',
 down:'<path d="m6 9 6 6 6-6"/>',
 search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
 bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M9 21h6"/>',
 moon:'<path d="M21 13A9 9 0 0 1 11 3a9 9 0 1 0 10 10Z"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1"/>',
 help:'<circle cx="12" cy="12" r="9"/><path d="M9 9a3 3 0 1 1 4 3v2m-1 3h.01"/>',
 fire:'<path d="M13 2c1 5-3 5-2 10 2-1 3-3 3-4 6 6 6 13-2 14C3 22 2 13 7 8c-1 5 1 5 2 5C8 8 12 8 13 2Z"/>',
 leaf:'<path d="M20 3C8 2 3 7 5 15s17 6 15-12ZM4 21 16 9M9 16v-5m0 5h5"/>',
 function:'<path d="M7 5c4 1 6 6 6 10s-2 5-5 4M5 9h11M15 5l5 14m0-14-5 14"/>',
 globe:'<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18M5 7h14M5 17h14"/>',
 waves:'<path d="M2 7c4-8 6 8 10 0s6 8 10 0M2 13c4-8 6 8 10 0s6 8 10 0M2 19c4-8 6 8 10 0s6 8 10 0"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 check:'<path d="m5 12 4 4L20 5"/>',
 sparkle:'<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Zm7-2v4m-2-2h4"/>',
 bolt:'<path d="m14 2-10 12h7l-1 8 10-12h-7l1-8Z"/>',
 trophy:'<path d="M8 3h8v7a4 4 0 0 1-8 0V3Zm0 2H4v3a4 4 0 0 0 4 4m8-7h4v3a4 4 0 0 1-4 4m-4 2v6m-4 1h8"/>',
 upload:'<path d="M12 16V3m-5 5 5-5 5 5M3 16v4a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-4"/>',
 camera:'<path d="M3 6h4l2-3h6l2 3h4v15H3V6Z"/><circle cx="12" cy="13" r="4"/>',
 file:'<path d="M5 2h9l5 5v15H5V2Zm9 0v6h5M8 12h8m-8 4h6"/>',
 close:'<path d="m6 6 12 12M6 18 18 6"/>',
 back:'<path d="M19 12H5m6-6-6 6 6 6"/>',
 edit:'<path d="m15 3 6 6-12 12H3v-6L15 3Zm-3 3 6 6"/>',
 download:'<path d="M12 3v13m-5-5 5 5 5-5M3 17v4h18v-4"/>',
 play:'<path d="m8 4 13 8-13 8V4Z"/>',
 flag:'<path d="M5 22V3c5-4 9 4 15 0v11c-6 4-10-4-15 0"/>',
 mic:'<rect x="8" y="2" width="8" height="13" rx="4"/><path d="M5 10v2a7 7 0 0 0 14 0v-2m-7 9v3m-4 0h8"/>',
 brain:'<path d="M12 5c-3-5-7-2-6 1-5 0-5 7-2 8-2 4 1 7 4 6 1 3 4 2 4-1V5Zm0 0c3-5 7-2 6 1 5 0 5 7 2 8 2 4-1 7-4 6-1 3-4 2-4-1M6 6v3m12-3v3m-14 5h3m13 0h-3"/>',
 refresh:'<path d="M20 7a9 9 0 1 0 1 9M20 2v6h-6"/>',
 menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
 settings:'<path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="3"/><circle cx="15" cy="17" r="3"/>',
 shield:'<path d="m12 2 9 4v6c0 5-9 10-9 10S3 17 3 12V6l9-4Z"/><path d="m8 12 3 3 5-6"/>'
};
