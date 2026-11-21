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
