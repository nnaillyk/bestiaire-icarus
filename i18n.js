// Traductions : interface (fr / en), noms des créatures, traits, textes des régions
const UI={
fr:{brand_small:"Manuel du prospecteur",brand:"Bestiaire d'Icarus",regions:"Régions",index:"Index",objects:"Objets",farm:"Ferme",settings:"Paramètres",
 sources:"Sources : fichiers du jeu (bestiaire, butins, objets) et ICARUS Wiki (PV, biomes).",
 difficulty:"Difficulté",exclusive:n=>`${n} espèce${n>1?"s":""} exclusive${n>1?"s":""}`,fauna:"Faune recensée",animals:"Animaux",
 species:"espèces",aggressive_n:"agressives",bosses_n:"boss & hunts",tame_n:"apprivoisables",great_hunt:"Great Hunt",
 no_hunt:"Aucune campagne de chasse sur cette région.",farm_hunt:"Ces animaux s'achètent à l'atelier ou viennent d'un DLC.",
 search_c:"Créature, biome, faiblesse, objet…",search_i:"Cuir, peau arctique, soufre…",all:"Tous",fauna_k:"Faune",boss_k:"Boss & Great Hunt",cave_k:"Grottes",
 aggr_f:"Agressifs",neut_f:"Neutres",pass_f:"Paisibles",tame_f:"Apprivoisables",all_zones:"Toutes les zones",
 sort_danger:"Tri : danger",sort_hp:"Tri : PV",sort_name:"Tri : nom",
 result:n=>`${n} créature${n>1?"s":""} · touchez une fiche pour le détail et le butin`,
 none_c:m=>`Aucune créature ne correspond à ces filtres sur ${m}.`,
 carn:"Carnivore",herb:"Herbivore",nc:"n.c.",no_loot:"Butin non documenté",regions_n:n=>`${n} régions`,exclusive_s:"Exclusif",workshop:"Atelier / DLC",
 items_title:"Index des objets",items_n:n=>`${n} objets`,items_f1:"Butin au couteau de dépeçage",items_f2:"+ trophées et butins de boss",
 items_p:"Tout ce que la faune d'Icarus laisse derrière elle. Choisissez un objet pour voir quelles créatures le donnent, en quelle quantité, avec quelle chance et sur quelle région.",
 tip:"Astuce",tip_t:"Le banc de dépeçage (Skinning Bench) donne des quantités fixes, souvent bien plus élevées que le couteau. Les chiffres affichés sont ceux du couteau.",
 all_regions:"Toutes régions",none_i:"Aucun objet ne correspond.",source_s:n=>n>1?"sources":"source",
 creature:"Créature",object:"Objet",back:"Retour",close:"Fermer",hp:"Points de vie",diet:"Régime",taming:"Dressage",no:"Non",
 combat:"Combat",weak:"Faible",resist:"Résiste",traits:"Traits",loot_knife:"Butin au couteau",loot:"Butin",item:"Objet",qty:"Qté",chance:"Chance",
 v_boss:"Le vestige (tête) tombe directement sur la carcasse du boss.",v_chance:"Le vestige tombe avec la chance indiquée.",v_tax:"Le vestige s'obtient au couteau de taxidermie.",
 not_doc:"Butin non documenté.",where:"Où le trouver",zone_unk:"Zone non précisée",wiki:"Ouvrir la page du wiki ↗",
 sources_k:"Sources",regions_k:"Régions",best:"Meilleure source",vest_note:"Trophée unique : tête de boss, ou carcasse traitée au couteau de taxidermie, à exposer dans votre base.",
 droppers:"Créatures qui le donnent",
 s_lang:"Langue",s_theme:"Thème",t_auto:"Automatique",t_light:"Clair",t_dark:"Sombre",s_install:"Installer l'app",s_about:"À propos",
 inst_pc:"PC (Edge ou Chrome) : cliquez sur l'icône « Installer » dans la barre d'adresse, ou menu ⋯ › Applications › Installer.",
 inst_android:"Android (Chrome) : menu ⋮ › « Ajouter à l'écran d'accueil » ou « Installer l'application ».",
 inst_ios:"iPhone (Safari) : bouton Partager › « Sur l'écran d'accueil ».",
 installed:"L'app est installée et fonctionne hors connexion.",install_btn:"Installer maintenant",
 about_t:"Données extraites des fichiers du jeu Icarus (data.pak) et complétées par l'ICARUS Wiki. Les PV sont ceux du niveau 0. Les noms français sont des traductions non officielles ; le nom anglais du jeu est affiché en dessous.",
 offline:"Disponible hors connexion",gname:"Nom en jeu"},
en:{brand_small:"Prospector's field manual",brand:"Icarus Bestiary",regions:"Regions",index:"Index",objects:"Items",farm:"Farm",settings:"Settings",
 sources:"Sources: game files (bestiary, loot, items) and ICARUS Wiki (HP, biomes).",
 difficulty:"Difficulty",exclusive:n=>`${n} exclusive species`,fauna:"Recorded fauna",animals:"Animals",
 species:"species",aggressive_n:"aggressive",bosses_n:"bosses & hunts",tame_n:"tameable",great_hunt:"Great Hunt",
 no_hunt:"No hunting campaign in this region.",farm_hunt:"These animals come from the Workshop or a DLC.",
 search_c:"Creature, biome, weakness, item…",search_i:"Leather, arctic pelt, sulfur…",all:"All",fauna_k:"Fauna",boss_k:"Bosses & Great Hunts",cave_k:"Caves",
 aggr_f:"Aggressive",neut_f:"Neutral",pass_f:"Passive",tame_f:"Tameable",all_zones:"All zones",
 sort_danger:"Sort: danger",sort_hp:"Sort: HP",sort_name:"Sort: name",
 result:n=>`${n} creature${n>1?"s":""} · tap a card for details and loot`,
 none_c:m=>`No creature matches these filters in ${m}.`,
 carn:"Carnivore",herb:"Herbivore",nc:"n/a",no_loot:"Loot not documented",regions_n:n=>`${n} regions`,exclusive_s:"Exclusive",workshop:"Workshop / DLC",
 items_title:"Item index",items_n:n=>`${n} items`,items_f1:"Skinning knife loot",items_f2:"+ trophies and boss loot",
 items_p:"Everything the wildlife of Icarus leaves behind. Pick an item to see which creatures drop it, how many, how often and in which region.",
 tip:"Tip",tip_t:"The Skinning Bench gives fixed amounts, often far higher than the knife. The numbers shown are knife numbers.",
 all_regions:"All regions",none_i:"No item matches.",source_s:n=>n>1?"sources":"source",
 creature:"Creature",object:"Item",back:"Back",close:"Close",hp:"Health",diet:"Diet",taming:"Taming",no:"No",
 combat:"Combat",weak:"Weak to",resist:"Resists",traits:"Traits",loot_knife:"Knife loot",loot:"Loot",item:"Item",qty:"Qty",chance:"Chance",
 v_boss:"The vestige (head) drops directly from the boss carcass.",v_chance:"The vestige drops at the chance shown.",v_tax:"The vestige comes from the taxidermy knife.",
 not_doc:"Loot not documented.",where:"Where to find it",zone_unk:"Zone not specified",wiki:"Open the wiki page ↗",
 sources_k:"Sources",regions_k:"Regions",best:"Best source",vest_note:"Unique trophy: a boss head, or a carcass processed with the taxidermy knife, to display in your base.",
 droppers:"Creatures that drop it",
 s_lang:"Language",s_theme:"Theme",t_auto:"Automatic",t_light:"Light",t_dark:"Dark",s_install:"Install the app",s_about:"About",
 inst_pc:"PC (Edge or Chrome): click the “Install” icon in the address bar, or menu ⋯ › Apps › Install.",
 inst_android:"Android (Chrome): menu ⋮ › “Add to Home screen” or “Install app”.",
 inst_ios:"iPhone (Safari): Share button › “Add to Home Screen”.",
 installed:"The app is installed and works offline.",install_btn:"Install now",
 about_t:"Data extracted from the Icarus game files (data.pak) and completed with the ICARUS Wiki. HP values are level 0.",
 offline:"Available offline",gname:"In-game name"}
};

const BEH_L={fr:{P:"Paisible",N:"Neutre",A:"Agressif"},en:{P:"Passive",N:"Neutral",A:"Aggressive"}};
const TAME_L={fr:{m:"Monture",c:"Compagnon",a:"Apprivoisable"},en:{m:"Mount",c:"Companion",a:"Tameable"}};
const KIND_L={fr:{boss:"Boss",hunt:"Great Hunt",grotte:"Grotte",ferme:"Ferme"},en:{boss:"Boss",hunt:"Great Hunt",grotte:"Cave",ferme:"Farm"}};
const ZL_EN={foret:"Forest & rivers",desert:"Desert",arctique:"Arctic & glaciers",prairie:"Grasslands & woods",toundra:"Tundra",marais:"Swamp",volcan:"Volcanic",geo:"Geothermal",grotte:"Caves",irradie:"Irradiated zones",arene:"Great Hunt arena",ferme:"Ranch"};
const CATS_EN={rare:"Boss materials",mat:"Materials",meat:"Meat & food",res:"Resources & organs",ore:"Ores",tech:"Tech & radiation",trophy:"Trophies"};

const MAPS_EN={
 olympus:{tag:"Base game",size:"3 atmospheres · 6 biomes",text:"The original region, where it all began. Lush forests, scorching deserts and frozen tundra around an arctic massif. The recommended drop zone is Conifer, in the forest.",hunt:["Quarrite","unlocks the Mining Armature."]},
 styx:{tag:"Styx DLC",size:"3 atmospheres · 13 biomes",text:"A former red zone centred on a huge braided river, with reports of abnormal growth and mutations in the wildlife. Four World Blockers lift as you complete missions.",hunt:["Garganutan","unlocks the Anti-materiel Rifle."]},
 prometheus:{tag:"New Frontiers DLC",size:"6 atmospheres · 15 biomes",text:"A region warped by the violence of terraforming, once reserved for scientists. It brings swamps, volcanic zones and stabilised (red) exotics. The Null Sector opens to the south.",hunt:["Rimetusk","unlocks the Tactical Bow."]},
 elysium:{tag:"Dangerous Horizons DLC",size:"6 atmospheres · 25 biomes",text:"An uncharted sector known only to a few Group 15 agents. Crash-land at the Crashsite, then head for Eden, the first permanent settlement on Icarus. Uranium and radiation included.",hunt:null},
 ferme:{name:"Farm",tag:"Orbital Workshop & DLC",size:"Ranching and companions",text:"Domestic animals you won't find in the wild: they come from the orbital Workshop or the Pet Bundle DLC, then you raise them at the ranch. The game's bestiary lists them separately.",hunt:null}
};

// Noms français (traduction non officielle ; les noms inventés par le jeu restent tels quels)
const NAME_FR={"Wolf":"Loup","Snow Wolf":"Loup des neiges","Bear":"Ours","Bear Cub":"Ourson","Polar Bear":"Ours polaire","Polar Bear Cub":"Ourson polaire","Boar":"Sanglier","Deer":"Cerf","Baby Deer":"Faon","Antelope":"Antilope","Rabbit":"Lapin","Snow Rabbit":"Lapin des neiges","Arctic Moa":"Moa arctique","Buffalo":"Bison","Pronghorn":"Antilocapre","Cougar":"Puma","Hyena":"Hyène","Arctic Scorpion":"Scorpion arctique","Elephant":"Éléphant","Zebra":"Zèbre","Snow Leopard":"Léopard des neiges","Woolly Mammoth":"Mammouth laineux","Spider":"Araignée","Kea":"Kéa","Komodo":"Varan de Komodo","Columbian Mammoth":"Mammouth de Colomb","Lava Broodling":"Rejeton de lave","Plains Equix":"Équix des plaines","Pygmy Lop":"Lapin pygmée","Shaggy Zebra":"Zèbre laineux","Dune Raptor":"Raptor des dunes","Swamp Hopper":"Hopper des marais","Sulfuric Spider":"Araignée sulfurique","Bee":"Abeille","Cave Worm":"Ver des cavernes","Teenage Caveworm":"Ver des cavernes adolescent","Arctic Vesper":"Vesper arctique","Sulfur Vesper":"Vesper sulfureux","Gaseous Floater":"Flotteur gazeux","Sulfur Worm":"Ver de soufre","Black Wolf":"Loup noir","Giant Scorpion":"Scorpion géant","Sandworm":"Ver des sables","Landshark":"Requin des sables","Lava Hunter":"Chasseur de lave","Sandwyrm Queen":"Reine des wyrms des sables","Unstable Quarrite":"Quarrite instable","Rimetusk Matriarch":"Matriarche Rimetusk","Sheep":"Mouton","Chicken":"Poule","Cattle":"Vache","Pig":"Cochon","Horse":"Cheval","Cat":"Chat","Dog":"Chien"};
const LORE_ALIAS={"Woolly Mammoth":"Mammoth","Columbian Mammoth":"Mammoth","Lava Broodling":"Lava Broodlings","Snow Rabbit":"Rabbit"};

// Traits : phrases entières, puis mots isolés (pour les pourcentages)
const TOK_EN={"—":"—","Accélérations brutales":"Explosive bursts of speed","Adapté à la chaleur":"Heat-adapted","Agressif autour de la nourriture":"Aggressive around food","Armure de roche à briser":"Rock armour must be broken","Attaque de feu":"Fire attack","Attaque de givre":"Frost attack","attaque ralentissante":"slowing attack","Attaques à distance":"Ranged attacks","aveugle une fois enterré":"blind when burrowed","Bactéries":"Bacteria","blessures":"wounds","blessures profondes":"deep wounds","blindé":"armoured","Bonds explosifs":"Explosive leaps","Boss de la campagne Garganutan":"Garganutan campaign boss","Boss de la campagne Quarrite":"Quarrite campaign boss","Boss de la campagne Rimetusk":"Rimetusk campaign boss","Carapace dure":"Hard carapace","Charge":"Charges","Charge si provoqué":"Charges when provoked","Charognard en essaim":"Swarming scavenger","Chasse au son":"Hunts by sound","Commotion":"Concussion","Coups puissants":"Strong attacks","Crache des épines":"Spits spines","Crache du soufre collant":"Spits sticky sulfur","crache feu et lave":"spits fire and lava","critique : gueule":"crit spot: mouth","critique : yeux":"crit spot: eyes","Critiques : yeux, ventre":"Crit spots: eyes, belly","dard perforant":"piercing sting","DLC Pet Bundle":"Pet Bundle DLC","Dos blindé":"Armoured back","Embuscade immergée":"Submerged ambush","Empoisonne":"Poisons","enragé par les projectiles":"enraged by projectiles","Essaim":"Swarm","Explose à l'impact":"Explodes on impact","Farouche":"Skittish","Filaments paralysants":"Paralysing tendrils","Fuit les humains":"Flees from humans","Furtivité conseillée":"Use stealth","Gèle":"Freezes","Grande capacité de charge":"Large carry capacity","Griffes irradiées":"Irradiated claws","hémorragie":"haemorrhage","humeur changeante":"unpredictable temper","immunisé aux projectiles":"immune to projectiles","insensible à la douleur":"feels no pain","Lait":"Milk","laser":"laser","lent":"slow","mêlée":"melee","Mère souvent proche":"Mother often nearby","Meute":"Pack","Monture rapide, gros dégâts":"Fast mount, high damage","Monture via le DLC Pet Bundle":"Mount via the Pet Bundle DLC","Morsure infectieuse":"Infectious bite","Nage dans le sable":"Swims through sand","Nageur rapide":"Fast swimmer","ne fuit jamais":"never retreats","Niche au sol":"Ground nester","nid":"nest","outils de minage":"mining tools","perforant":"armour piercing","Pille les séchoirs":"Raids drying racks","Pond des œufs":"Lays eggs","Protège ses petits":"Protects its young","Radioactif":"Radioactive","Ralentit":"Slows","Rapide":"Fast","Récupère sa santé":"Recovers health","renvoie les projectiles":"ricochets projectiles","Résiste au feu":"Fire resistant","Ruche":"Hive","saut long":"long jump","Se divise":"Splits apart","Se fait passer pour un rocher":"Disguises as a boulder","se replie pour se soigner":"retreats to heal","S'enrage":"Enrages","Sens thermique":"Heat sense","Suit ses parents":"Follows its parents","tête critique":"head crits","Tir précis":"Precise fire","Tonte : 8-12 laine":"Shearing: 8-12 wool","traînée":"leaves a trail","Traumatisme contondant":"Blunt force trauma","Très farouche":"Very skittish","Variante grande antilope":"Large antelope variant","Variantes moyenne et grande":"Medium and large variants","Venin":"Venom","viande":"meat","Vol":"Flying","Vole":"Flies","vue faible":"poor vision"};
const WORD_EN=[["Étourdissement","Stun/Slow"],["Électricité","Electric"],["Explosifs","Explosives"],["Feu","Fire"],["Givre","Frost"]];

// --- Objets & crafts ---
Object.assign(UI.fr,{bestiary:"Bestiaire",crafts:"Crafts",catalog_title:"Objets du jeu",
 catalog_p:"Tous les objets d'Icarus extraits des fichiers du jeu. Touchez un objet pour voir comment le fabriquer, à quoi il sert et quelles créatures le lâchent.",
 all_cats:"Toutes les catégories",f_all:"Tous",f_loot:"Butin d'animaux",f_craft:"Fabricables",show_more:"Afficher plus",
 shown:(a,b)=>`${a} sur ${b}`,crafts_title:"Recettes de fabrication",
 crafts_p:"Les recettes du jeu, établi par établi. Cherchez un objet ou un ingrédient, puis touchez-le pour sa fiche complète.",
 all_stations:"Tous les établis",search_r:"Objet ou ingrédient…",search_x:"Nom d'objet, description…",recipes_n:n=>`${n} recette${n>1?"s":""}`,
 crafting:"Fabrication",used_in:"Utilisé dans",dropped_by:"Lâché par",station:"Établi",stack:"Pile max",category:"Catégorie",
 and_more:n=>`et ${n} autre${n>1?"s":""}`,no_recipe:"Ne se fabrique pas.",produces:"Produit",
 names_note:"Les noms d'objets et d'établis restent en anglais quand le jeu n'a pas de traduction lisible.",img_note:"Images : ICARUS Wiki (chargées à la demande, gardées pour le hors connexion).",
 items_k:"objets",recipes_k:"recettes",stations_k:"établis"});
Object.assign(UI.en,{bestiary:"Bestiary",crafts:"Crafts",catalog_title:"Game items",
 catalog_p:"Every item in Icarus, extracted from the game files. Tap an item to see how to craft it, what it's used for and which creatures drop it.",
 all_cats:"All categories",f_all:"All",f_loot:"Animal loot",f_craft:"Craftable",show_more:"Show more",
 shown:(a,b)=>`${a} of ${b}`,crafts_title:"Crafting recipes",
 crafts_p:"The game's recipes, bench by bench. Search for an item or an ingredient, then tap it for its full page.",
 all_stations:"All benches",search_r:"Item or ingredient…",search_x:"Item name, description…",recipes_n:n=>`${n} recipe${n>1?"s":""}`,
 crafting:"Crafting",used_in:"Used in",dropped_by:"Dropped by",station:"Bench",stack:"Max stack",category:"Category",
 and_more:n=>`and ${n} more`,no_recipe:"Cannot be crafted.",produces:"Produces",
 names_note:"",img_note:"Images: ICARUS Wiki (loaded on demand, kept for offline use).",
 items_k:"items",recipes_k:"recipes",stations_k:"benches"});

const GROUP_L={fr:{res:"Ressources",food:"Nourriture & soins",weap:"Armes & munitions",tool:"Outils",armor:"Armures & équipement",attach:"Accessoires & améliorations",bench:"Établis & déployables",build:"Construction",deco:"Décoration",ranch:"Élevage",trophy:"Trophées",fish:"Poissons",meta:"Atelier orbital",misc:"Divers"},
 en:{res:"Resources",food:"Food & medicine",weap:"Weapons & ammo",tool:"Tools",armor:"Armour & gear",attach:"Attachments & upgrades",bench:"Benches & deployables",build:"Building",deco:"Decoration",ranch:"Ranching",trophy:"Trophies",fish:"Fish",meta:"Orbital workshop",misc:"Misc"}};
const GROUP_ORDER=["res","food","weap","tool","armor","attach","bench","build","deco","ranch","trophy","fish","meta","misc"];
const GROUP_COLOR={res:"#3f7f86",food:"#a5473a",weap:"#8a3b52",tool:"#5d6570",armor:"#7a6248",attach:"#6a5aa0",bench:"#3c6b45",build:"#8a6a2e",deco:"#9a5a7a",ranch:"#6f7a2e",trophy:"#6a5aa0",fish:"#2f6f8f",meta:"#9a6a12",misc:"#5b6762"};

const STATION_FR={"Character":"Personnage (inventaire)","Campfire":"Feu de camp","Crafting Bench":"Établi d'artisanat","Mortar And Pestle":"Mortier et pilon","Oxite Dissolver":"Dissolveur d'oxite","Stone Furnace":"Four en pierre","Concrete Furnace":"Four en béton","Electric Furnace":"Four électrique","Machining Bench":"Établi d'usinage","Composter":"Composteur","Material Processor":"Transformateur de matériaux","Extractor":"Extracteur","Cooking Station":"Poste de cuisson","Fabricator":"Fabricateur","Skinning Bench":"Banc de dépeçage","Carpentry Bench":"Établi de menuiserie","Electric Carpentry Bench":"Établi de menuiserie électrique","Wood Composter":"Composteur en bois","Rain Collector":"Récupérateur d'eau de pluie","Metal Oxite Dissolver":"Dissolveur d'oxite en métal","Textiles Bench":"Établi textile","Masonry Bench":"Établi de maçonnerie","Electric Masonry Bench":"Établi de maçonnerie électrique","Cement Mixer":"Bétonnière","Generator":"Générateur","Herbalism Bench":"Établi d'herboristerie","Chemistry Bench":"Établi de chimie","Trophy Bench":"Établi à trophées","Repair Bench":"Établi de réparation","Anvil Bench":"Enclume","Firepit":"Foyer","Glassworking Bench":"Établi de verrerie","Kitchen Bench":"Plan de travail de cuisine","Medicine Bench":"Établi de médecine","Kitchen Stove":"Cuisinière","Potbelly Stove":"Poêle ventru","Drying Rack":"Séchoir","Decoration Bench":"Établi de décoration","Alteration Bench":"Établi d'altération","Advanced Alteration Bench":"Établi d'altération avancé","Advanced Textiles Bench":"Établi textile avancé","Electric Textiles Bench":"Établi textile électrique","Exotic Processor":"Transformateur d'exotiques","Electric Stove":"Cuisinière électrique","Advanced Kitchen Bench":"Cuisine avancée","Fishing Bench":"Établi de pêche","Forge":"Forge","Foundry":"Fonderie","Advanced Masonry Bench":"Établi de maçonnerie avancé","Smoker":"Fumoir","Roaster":"Rôtissoire","Water Purifier":"Purificateur d'eau","Cleaning Device":"Appareil de nettoyage","Ranching Station":"Poste d'élevage","Butchery Bench":"Établi de boucherie","Advanced Butchery Bench":"Établi de boucherie avancé","Manufacturer":"Manufacture","Polymerizer":"Polymériseur","Seed Extractor":"Extracteur de graines","Nuclear Centrifuge":"Centrifugeuse nucléaire","Vestige Exchange":"Échange de vestiges","Biomass Exchange":"Échange de biomasse","Crops Exchange":"Échange de récoltes","Fish Exchange":"Échange de poissons","Food Shop":"Épicerie","Electronic Food Trough":"Mangeoire électronique","Creature Exchange":"Échange de créatures"};
const EXTRA_FR=[["Any Chicken Vestige","N'importe quel vestige de poulet"],["Any Common Vestige","N'importe quel vestige commun"],["Any Uncommon Vestige","N'importe quel vestige peu commun"],["Any Rare Vestige","N'importe quel vestige rare"],["Any Unique Vestige","N'importe quel vestige unique"],["Any Enzyme","N'importe quelle enzyme"],["Any Freshwater Fish","N'importe quel poisson d'eau douce"],["Any Saltwater Fish","N'importe quel poisson d'eau salée"],["Any Unique Fish","N'importe quel poisson unique"],["Any Raw Fish","N'importe quel poisson cru"],["Any Fruit","N'importe quel fruit"],["Any Grain","N'importe quelle céréale"],["Any Herb","N'importe quelle herbe"],["Any Prime Meat","N'importe quelle viande de choix"],["Any Raw Meat","N'importe quelle viande crue"],["Any Speciality","N'importe quelle spécialité"],["Any Spoiled Item","N'importe quel objet avarié"],["Any Vegetable","N'importe quel légume"],["Biofuel","Biocarburant"],["Milk","Lait"],["Refined_Oil","Huile raffinée"],["Water","Eau"],["Electricity","Électricité"],["Oxygen","Oxygène"],["Fuel","Carburant"]];
// --- Noms d'objets en français : dictionnaire + règles « matériau + objet ». Si un mot est inconnu, le nom reste en anglais.
const ITEM_FR={"Fiber":"Fibre","Stick":"Bâton","Stone":"Pierre","Wood":"Bois","Rope":"Corde","Epoxy":"Époxy","Charcoal":"Charbon de bois","Water":"Eau","Gunpowder":"Poudre à canon","Flour":"Farine","Bread":"Pain","Clay":"Argile","Sand":"Sable","Silica":"Silice","Concrete Mix":"Mélange de béton","Cement":"Ciment","Glass":"Verre","Tree Sap":"Sève","Wild Berry":"Baies sauvages","Wheat":"Blé","Corn":"Maïs","Carrot":"Carotte","Pumpkin":"Citrouille","Squash":"Courge","Watermelon":"Pastèque","Potato":"Pomme de terre","Tomato":"Tomate","Garlic":"Ail","Onion":"Oignon","Mushroom":"Champignon","Coffee Bean":"Grain de café","Cocoa":"Cacao","Tea":"Thé","Soy Bean":"Soja","Banana":"Banane","Coconut":"Noix de coco","Young Coconut":"Jeune noix de coco","Mature Coconut":"Noix de coco mûre","Avocado":"Avocat","Kiwifruit":"Kiwi (fruit)","Rhubarb":"Rhubarbe","Sugar Cane":"Canne à sucre","Truffle":"Truffe","Yeast":"Levure","Lily":"Lys","Sponge":"Éponge","Reed Flower":"Fleur de roseau","Gorse Flower":"Fleur d'ajonc","Agave":"Agave","Prickly Pear":"Figue de Barbarie","Kumara":"Patate douce","Honey":"Miel","Beeswax":"Cire d'abeille","Milk":"Lait","Salt":"Sel","Sugar":"Sucre","Butter":"Beurre","Cheese":"Fromage","Biofuel":"Biocarburant","Crude Oil":"Pétrole brut","Refined Oil":"Huile raffinée","Aluminium Ingot":"Lingot d'aluminium","Electronics":"Électronique","Concrete":"Béton","Oxygen":"Oxygène","Fertilizer":"Engrais","Seed Pouch":"Sachet de graines","Bandage":"Bandage","Basic Bandage":"Bandage simple","Suture Kit":"Kit de suture","Splint":"Attelle","Campfire":"Feu de camp","Bedroll":"Sac de couchage","Firepit":"Foyer","Drying Rack":"Séchoir","Torch":"Torche","Wood Torch":"Torche en bois","Floor Torch":"Torche au sol","Wall Torch":"Torche murale","Lantern":"Lanterne","Waterskin":"Outre","Canteen":"Gourde","Oxidizer":"Oxygénateur","Crafting Bench":"Établi d'artisanat","Mortar And Pestle":"Mortier et pilon","Mortar and Pestle":"Mortier et pilon","Stone Furnace":"Four en pierre","Anvil Bench":"Enclume","Skinning Bench":"Banc de dépeçage","Taxidermy Knife":"Couteau de taxidermie","Butcher's Cleaver":"Hachoir de boucher","Milk Pail":"Seau à lait","Iron Bucket":"Seau en fer","Iron Shears":"Cisailles en fer","Watering Can":"Arrosoir","Animal Bed":"Lit pour animaux","Food Trough":"Mangeoire","Water Trough":"Abreuvoir","Ranching Station":"Poste d'élevage","Beehive":"Ruche","Spoiled Meat":"Viande avariée","Raw Meat":"Viande crue","Cooked Meat":"Viande cuite","Dried Meat":"Viande séchée","Crushed Bone":"Os broyé","Sulfur":"Soufre","Oxite":"Oxite","Exotics":"Exotiques","Ice":"Glace","Snow":"Neige","Gold Ore":"Minerai d'or","Iron Ore":"Minerai de fer","Copper Ore":"Minerai de cuivre","Coal Ore":"Minerai de charbon","Platinum Ore":"Minerai de platine","Titanium Ore":"Minerai de titane","Aluminium Ore":"Minerai d'aluminium","Silica Ore":"Minerai de silice","Lithium Ore":"Minerai de lithium","Raw Uranium":"Uranium brut"};
const MAT_FR={"Wood":"bois","Wooden":"bois","Stone":"pierre","Iron":"fer","Steel":"acier","Bone":"os","Copper":"cuivre","Gold":"or","Platinum":"platine","Titanium":"titane","Aluminium":"aluminium","Obsidian":"obsidienne","Leather":"cuir","Fur":"fourrure","Cloth":"tissu","Concrete":"béton","Glass":"verre","Thatch":"paille","Scoria":"scorie","Limestone":"calcaire","Carbon":"carbone","Composite":"composite","Brick":"brique","Clay":"argile","Ice":"glace","Bronze":"bronze","Flint":"silex","Caveworm":"ver des cavernes","Scorpion":"scorpion","Sandworm":"ver des sables","Ghillie":"ghillie","Beeswax Wood":"bois ciré","Refined Wood":"bois raffiné","Interior Wood":"bois d'intérieur","Reinforced Wood":"bois renforcé","Rimetusk":"Rimetusk","Black Wolf":"loup noir","Brown Bear":"ours brun","Polar Bear":"ours polaire","Lithium":"lithium","Electric":"électrique"};
const NOUN_FR={"Axe":["Hache","f"],"Pickaxe":["Pioche","f"],"Knife":["Couteau","m"],"Spear":["Lance","f"],"Bow":["Arc","m"],"Longbow":["Arc long","m"],"Crossbow":["Arbalète","f"],"Arrow":["Flèche","f"],"Bolt":["Carreau","m"],"Hammer":["Marteau","m"],"Sledgehammer":["Masse","f"],"Sickle":["Faucille","f"],"Shovel":["Pelle","f"],"Shield":["Bouclier","m"],"Heater Shield":["Bouclier écu","m"],"Javelin":["Javelot","m"],"Throwing Knife":["Couteau de lancer","m"],"Throwing Axe":["Hache de lancer","f"],"Wall":["Mur","m"],"Floor":["Sol","m"],"Roof":["Toit","m"],"Door":["Porte","f"],"Window":["Fenêtre","f"],"Beam":["Poutre","f"],"Ramp":["Rampe","f"],"Stairs":["Escalier","m"],"Frame":["Cadre","m"],"Railing":["Rambarde","f"],"Gate":["Portail","m"],"Crate":["Caisse","f"],"Table":["Table","f"],"Chair":["Chaise","f"],"Bed":["Lit","m"],"Cabinet":["Placard","m"],"Sign":["Panneau","m"],"Statue":["Statue","f"],"Lamp":["Lampe","f"],"Trough":["Auge","f"],"Saddle":["Selle","f"],"Backpack":["Sac à dos","m"],"Ingot":["Lingot","m","de"],"Ore":["Minerai","m","de"],"Nail":["Clou","m"],"Nails":["Clous","m"],"Fishing Rod":["Canne à pêche","f"],"Torch":["Torche","f"],"Furnace":["Four","m"],"Foundation":["Fondation","f"],"Pillar":["Pilier","m"],"Spikes":["Pieux","m"],"Fence":["Clôture","f"],"Armor":["Armure","f"],"Chest Armor":["Plastron","m"],"Head Armor":["Casque","m"],"Leg Armor":["Jambières","f"],"Legs Armor":["Jambières","f"],"Feet Armor":["Bottes","f"],"Arms Armor":["Gants","m"],"Arm Armor":["Gants","m"],"Helmet":["Casque","m"],"Ammo":["Munitions","f","de"],"Bucket":["Seau","m"],"Shears":["Cisailles","f"],"Pot":["Pot","m"],"Sculpture":["Sculpture","f"]};
const SIZE_FR={Small:["Petit","Petite"],Medium:["Moyen","Moyenne"],Large:["Grand","Grande"]};
const lc=s=>s.charAt(0).toLowerCase()+s.slice(1);
const CRE_MAT=new Set(["Caveworm","Scorpion","Sandworm","Rimetusk","Black Wolf","Brown Bear","Polar Bear"]);
const elide=s=>s.replace(/ de ([aeiouéèêh])/gi," d'$1");
// Nom de créature pour « Carcasse de… » : traduit si connu, nom propre du jeu sinon, sinon rien (on garde l'anglais)
function creFr(n){if(NAME_FR[n])return lc(NAME_FR[n]);if(typeof byNameEN!=="undefined"&&byNameEN.has(n))return n;return null;}
const byNameEN=new Set(C.map(c=>c[0]));
function frItemName(en){
  if(ITEM_FR[en])return ITEM_FR[en];
  if(STATION_FR[en]&&en!=="Character")return STATION_FR[en];
  let m,c;
  if((m=en.match(/^(.+) Carcass$/))&&(c=creFr(m[1])))return elide("Carcasse de "+c);
  if((m=en.match(/^(.+) Trophy$/))&&(c=creFr(m[1])))return elide("Trophée de "+c);
  if((m=en.match(/^(.+) Vestige$/))&&(c=creFr(m[1])))return elide("Vestige de "+c);
  if((m=en.match(/^(.+) Head$/))&&NAME_FR[m[1]])return elide("Tête de "+lc(NAME_FR[m[1]]));
  if(/ (Carcass|Trophy|Vestige)$/.test(en))return en;
  if((m=en.match(/^(.+) Building (Base|Advanced|Trim|Diagonal\/Curved) Set$/))&&MAT_FR[m[1]])
    return "Kit de construction "+{Base:"de base",Advanced:"avancé",Trim:"de finitions","Diagonal/Curved":"diagonales et courbes"}[m[2]]+" en "+MAT_FR[m[1]];
  let words=en.split(" "),size=null,adv=false;
  if(SIZE_FR[words[0]]){size=words[0];words=words.slice(1);}
  if(words[0]==="Advanced"){adv=true;words=words.slice(1);}
  let mat=null,creMat=false;
  for(const n of [3,2,1]){const k=words.slice(0,n).join(" ");if(words.length>n&&MAT_FR[k]){mat=MAT_FR[k];creMat=CRE_MAT.has(k);words=words.slice(n);break;}}
  let nounKey=words.join(" ");
  // « Leather Chest Armor » → Plastron en cuir
  const noun=NOUN_FR[nounKey];
  if(!noun)return en;
  const [nf,g,prep]=noun;let out=nf;
  if(size)out=(g==="f"?SIZE_FR[size][1]:SIZE_FR[size][0])+" "+lc(out);
  if(mat)out+=" "+(creMat?"de":(prep||"en"))+" "+mat;
  if(adv)out+=g==="f"?" avancée":" avancé";
  return elide(out);
}
const CRE_IMG_FALLBACK={"Woolly Mammoth":"ITEM_Mammoth_Head.png","Columbian Mammoth":"ITEM_Mammoth_Head.png","Lava Broodling":"T_ITEM_Head_LavaBroodling.png","Sulfuric Spider":"T_ITEM_Spider_Head.png"};
