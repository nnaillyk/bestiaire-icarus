// Corrections d'après les fichiers du jeu (gamefix.js) : comportements réels et créatures manquantes
(function(){
  const ALIAS={"Woolly Mammoth":"Mammoth","Columbian Mammoth":"Mammoth","Lava Broodling":"Lava Broodlings"};
  const byN=Object.fromEntries(C.map(c=>[c[0],c]));
  // 1) Comportement réel envers le joueur (profil de relation de l'IA sauvage)
  for(const c of C){const g=GAME_BEH[ALIAS[c[0]]||c[0]];if(g)c[1]=g;}
  // Meutes de loups : le chef est neutre mais les loups qui le suivent sont hostiles (Follower_Wolf)
  for(const n of ["Wolf","Snow Wolf"])if(byN[n])byN[n][1]="A";
  // Trait officiel « Facilement aggravé » : attaque au moindre dérangement
  for(const c of C){const tr=GAME_TRAITS[ALIAS[c[0]]||c[0]];if(tr&&/Easily Aggravated/.test(tr[0])&&c[1]==="N")c[1]="A";}
  // Animaux de ferme : amicaux envers le joueur
  for(const c of C)if((c[10]||"")==="ferme")c[1]="P";

  // 2) Créatures et variantes présentes dans le jeu mais absentes du bestiaire
  // [nom anglais du jeu, parent, comportement, type, description fr, description en, butin (null = parent, "" = aucun), cartes (null = parent)]
  const V=[
   ["Large Deer","Deer","P","faune","Grand cerf adulte, plus gros que le cerf commun : plus de cuir et de viande.","A fully grown deer, bigger than the common one: more leather and meat.","Leather 12-18 100;Fur 6-12 100;Bone 4-6 100;Raw Meat 2-4 100;Raw Gamey Meat 3-5 25"],
   ["Large Antelope","Antelope","P","faune","Grande antilope des déserts, plus rentable à chasser.","A large desert antelope, more rewarding to hunt.","Leather 12-18 100;Fur 6-12 100;Bone 4-6 100;Raw Meat 2-4 100;Raw Gamey Meat 3-5 25"],
   ["Pack Wolf","Wolf","A","faune","Loup suiveur d'une meute : hostile dès qu'il vous repère, il accompagne le chef de meute.","A pack follower: hostile as soon as it spots you, it travels with the pack leader.",null],
   ["Alpha Cougar","Cougar","A","alpha","Puma alpha, plus grand et plus dangereux que ses congénères.","An alpha cougar, bigger and more dangerous than its kin.",null],
   ["Alpha Hyena","Hyena","A","alpha","Hyène alpha qui mène la meute ; hostile, contrairement aux hyènes ordinaires.","An alpha hyena leading the pack; hostile, unlike ordinary hyenas.",null],
   ["Alpha Snow Leopard","Snow Leopard","A","alpha","Léopard des neiges alpha, très résistant.","A very tough alpha snow leopard.","Leather 10-16 100;Fur 4-6 100;Bone 6-10 100;Raw Stringy Meat 10-20 100"],
   ["Black Jaguar","Jaguar","A","alpha","Jaguar noir, version élite du jaguar rencontrée en mission.","Black jaguar, an elite jaguar met during missions.",null],
   ["Contaminated Bear","Bear","A","alpha","Ours contaminé et empoisonné.","A contaminated, poisoned bear.",null],
   ["Armored Scorpion","Scorpion","N","alpha","Scorpion cuirassé, bien plus résistant aux coups.","An armoured scorpion, far tougher to damage.",null],
   ["Sandworm Spitter","Sandworm","A","boss","Variante du ver des sables qui crache à distance.","A sandworm variant that spits from range.",""],
   ["Lava Flyer","Lava Broodling","A","faune","Rejeton volant du Chasseur de lave.","A flying offspring of the Lava Hunter.",""],
   ["Lava Bomber","Lava Broodling","A","faune","Rejeton du Chasseur de lave qui explose.","A Lava Hunter offspring that explodes.",""],
   ["Swamp Roat","Roat","P","faune","Roat des marais.","Swamp roat.",null,{prometheus:"@marais",elysium:"@marais"}],
   ["Lava Roat","Roat","P","faune","Roat des zones volcaniques.","Roat of the volcanic zones.",null,{prometheus:"@volcan",elysium:"@volcan"}],
   ["Snow Pygmy Lop","Pygmy Lop","P","faune","Lapin pygmée des neiges.","Snow pygmy lop.",null,{elysium:"@toundra,arctique"}],
   ["Alpha Skulmutt","Skulmutt","N","alpha","Chef de meute des Skulmutts, porteur d'une barre d'uranium.","Skulmutt pack leader, carrying a uranium rod.","Leather 10-16 100;Fur 2-3 100;Bone 2-3 100;Raw Meat 1-2 100;Radioactive Waste 1-2 100;Raw Stringy Meat 3-5 20"],
   ["Stomper Matriarch","Stomper","N","alpha","Matriarche d'un troupeau de Stompers, plus grande et plus forte.","The matriarch of a Stomper herd, bigger and stronger.",null],
   ["Scout Drone","Drone","A","faune","Drone d'éclaireur TPS.","TPS scout drone.",null],
   ["Hunter Drone","Drone","A","faune","Drone chasseur TPS, plus offensif.","TPS hunter drone, more aggressive.",null],
   ["Carrier Drone","Drone","A","faune","Drone porteur TPS qui déploie d'autres drones.","TPS carrier drone that deploys other drones.",null],
   ["TPS Soldier","Drone","A","enemy","Soldat TPS armé, ennemi humain d'Elysium.","Armed TPS soldier, a human enemy on Elysium.","",{elysium:"@toundra,desert,geo,volcan"}],
   ["Bull","Cattle","P","ferme","Taureau d'élevage ; se monte et charge.","Farm bull; rideable and charges.",null],
   ["Calf","Cattle","P","ferme","Veau, petit de la vache.","Calf, the cow's young.",null],
   ["Rooster","Chicken","P","ferme","Coq, nécessaire pour l'élevage des poules.","Rooster, needed to breed chickens.",null],
   ["Ram","Sheep","P","ferme","Bélier, mâle du mouton.","Ram, the male sheep.",null],
   ["Lamb","Sheep","P","ferme","Agneau.","Lamb.",null],
   ["Piglet","Pig","P","ferme","Porcelet.","Piglet.","Leather 7-10 100;Bone 2-4 100;Raw Bacon 1-3 100;Raw White Meat 2-4 100"]
  ];
  for(const [n,par,b,k,fr,en,loot,maps] of V){const p=byN[par];if(!p||byN[n])continue;
    const row=[n,b,p[2],k==="ferme"&&["Bull"].includes(n)?"m":"0",null,p[5],p[6],p[7],fr,maps||JSON.parse(JSON.stringify(p[9])),k];
    C.push(row);byN[n]=row;
    if(loot===null){if(LOOT[par])LOOT[n]=LOOT[par];}else if(loot)LOOT[n]=loot;
    NO_VESTIGE.add(n);LORE_EN[n]=en;
    const off=TYPE_NAMES[n];if(off&&off!==n)NAME_FR[n]=off;
    if(CRE_IMG&&!CRE_IMG[n]&&CRE_IMG[par])CRE_IMG[n]=CRE_IMG[par];
  }
  Object.assign(KIND_L.fr,{alpha:"Alpha / élite",enemy:"Ennemi"});Object.assign(KIND_L.en,{alpha:"Alpha / elite",enemy:"Enemy"});
})();
