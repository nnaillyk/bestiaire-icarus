// Zones d'apparition des créatures : emplacements relevés sur les calques « Spawns » de l'ICARUS Wiki (copies des textures AISpawnMap du jeu),
// créatures et pourcentages vérifiés dans les fichiers du jeu (data.pak : D_AISpawnZones, D_AISpawnConfig).
// Chaque zone : [nom, niveaux, points (en % de la carte : x, y), {créature: % d'apparition}, autres apparitions]
// Les points sont placés au cœur de chaque zone colorée du calque.
const SPAWNZ={
  olympus:[
    ["Conifer_Easy","1-30",[[83.3,50],[73.3,66.7],[53.3,78.3],[66.7,78.3]],{"Rabbit":23,"Wolf":19,"Deer":14,"Pronghorn":12,"Chamois":12,"Large Deer":12,"Terrenus":9},["Cave Worm","Quarrite","Bee","Kiwi"]],
    ["Conifer_Medium","1-50",[[71.2,55.8],[41.7,81.7],[82.5,68.3]],{"Deer":21,"Wolf":18,"Large Deer":13,"Rabbit":13,"Pronghorn":8,"Chamois":8,"Buffalo":5,"Bear":5,"Terrenus":3,"Moa":3,"Boar":3},["Cave Worm","Quarrite","Spider","Bee","Kiwi"]],
    ["Conifer_Hard","60-80",[[16.7,16.7],[33.3,23.3],[16.7,33.3],[48.3,17.5]],{"Wolf":23,"Large Deer":14,"Deer":11,"Buffalo":9,"Rabbit":9,"Terrenus":6,"Boar":6,"Moa":6,"Bear":6,"Chamois":6,"Pronghorn":6},["Cave Worm","Quarrite","Spider","Bee","Kiwi"]],
    ["Conifer_Super_Hard","60-120",[[54.2,20.8],[47.5,25.8],[20.8,43.7],[27.5,48.3]],{"Wolf":17,"Bear":17,"Large Deer":13,"Moa":10,"Boar":10,"Deer":10,"Buffalo":7,"Terrenus":7,"Rabbit":3,"Chamois":3,"Pronghorn":3},["Cave Worm","Quarrite","Spider","Bee","Kiwi"]],
    ["Desert_Easy","30-50",[[15.8,48.3],[19.2,60],[33.3,78.3]],{"Antelope":33,"Large Antelope":33,"Zebra":17,"Pronghorn":10,"Chamois":7},["Cave Worm","Quarrite"]],
    ["Desert_Medium","40-60",[[23.3,70]],{"Large Antelope":22,"Antelope":19,"Hyena":14,"Dribbo":8,"Scorpion":8,"Elephant":5,"Pronghorn":5,"Zebra":5,"Chamois":5,"Cougar":5,"Boar":3},["Cave Worm","Quarrite"]],
    ["Desert_Hard","50-80",[[63.3,23.3],[66.7,46.7],[83.3,20]],{"Scorpion":14,"Cougar":14,"Hyena":14,"Antelope":11,"Large Antelope":11,"Boar":8,"Zebra":8,"Dribbo":8,"Elephant":5,"Chamois":5,"Pronghorn":3},["Cave Worm","Quarrite"]],
    ["Desert_Super_Hard","80-100",[[74.7,23.3],[82,39.2]],{"Scorpion":18,"Hyena":15,"Cougar":15,"Boar":15,"Antelope":9,"Large Antelope":9,"Chamois":6,"Zebra":6,"Elephant":6,"Pronghorn":3},["Cave Worm","Quarrite"]],
    ["Transition_Easy","10-40",[[50,30],[38.3,55],[56.7,70]],{"Snow Wolf":67,"Snow Rabbit":33},["Quarrite"]],
    ["Transition_Hard","20-60",[[52,39.2],[40.8,51.7],[55,61.3]],{"Snow Wolf":61,"Arctic Moa":12,"Snow Rabbit":12,"Arctic Scorpion":6,"Snow Leopard":6,"Woolly Mammoth":3},["Quarrite"]],
    ["Bear_Easy","20-80",[[70,77.5]],{"Polar Bear":100},["Quarrite"]],
    ["Bear_Hard","60-120",[[77.5,81.7]],{"Polar Bear":50,"Arctic Scorpion":33,"Woolly Mammoth":17},["Quarrite"]]
  ],
  styx:[
    ["Conifer_Easy","1-30",[[44.1,49.6],[54.3,62.1],[20.7,81.6]],{"Chamois":21,"Rabbit":21,"Wolf":17,"Deer":13,"Large Deer":11,"Komodo":6,"Terrenus":4,"Jaguar":4,"Bear":2},["Garganutan","Kea","Bee","Kiwi"]],
    ["Conifer_Medium","1-50",[[37.9,69.1],[34.8,72.3],[55.1,68.4],[22.3,80.1]],{"Deer":19,"Wolf":16,"Chamois":14,"Rabbit":12,"Komodo":12,"Large Deer":12,"Bear":5,"Buffalo":5,"Terrenus":2,"Moa":2,"Boar":2},["Garganutan","Kea","Spider","Bee","Kiwi"]],
    ["Conifer_Medium_Crocs","1-50",[[30.9,84]],{"Crocodile":39,"Komodo":22,"Wolf":11,"Large Deer":11,"Deer":6,"Bear":6,"Buffalo":6},["Garganutan","Kea","Spider","Bee","Kiwi"]],
    ["Conifer_Hard","60-80",[[17.3,39.2],[36.7,21.2],[73.9,47.3]],{"Wolf":21,"Large Deer":15,"Jaguar":12,"Deer":12,"Komodo":9,"Rabbit":9,"Buffalo":9,"Moa":6,"Bear":6,"Terrenus":3},["Garganutan","Kea","Spider","Bee","Kiwi"]],
    ["Conifer_Super_Hard","60-120",[[66.4,26.7],[32,78.5]],{"Wolf":15,"Jaguar":15,"Bear":15,"Komodo":12,"Deer":9,"Moa":9,"Boar":9,"Large Deer":9,"Buffalo":6,"Terrenus":3},["Garganutan","Kea","Spider","Bee","Kiwi"]],
    ["Conifer_Super_Hard_Crocs","60-120",[[42.8,18.3],[80.4,42.9]],{"Crocodile":42,"Komodo":16,"Jaguar":11,"Bear":11,"Large Deer":11,"Wolf":5,"Buffalo":5},["Garganutan","Kea","Spider","Bee","Kiwi"]],
    ["Desert_Easy","30-50",[[36.3,33.2],[30.5,36.7],[44.5,29]],{"Antelope":33,"Large Antelope":33,"Zebra":17,"Chamois":17},["Garganutan"]],
    ["Desert_Medium","40-60",[[30.5,42],[28,30]],{"Large Antelope":21,"Antelope":18,"Hyena":15,"Chamois":12,"Scorpion":9,"Zebra":6,"Elephant":6,"Cougar":6,"Moa":3,"Boar":3},["Garganutan"]],
    ["Desert_Medium_Crocs","40-60",[[22.3,37.1],[33.2,27]],{"Crocodile":50,"Zebra":17,"Hyena":17,"Cougar":8,"Large Antelope":8},["Garganutan"]],
    ["Desert_Hard","50-80",[[75.4,70.7],[83.2,53.5],[82.4,85.5]],{"Cougar":15,"Scorpion":15,"Hyena":15,"Large Antelope":12,"Boar":9,"Zebra":9,"Antelope":9,"Moa":6,"Elephant":6,"Chamois":6},["Garganutan"]],
    ["Desert_Super_Hard","80-100",[[70.7,72.3],[83.2,57.4],[76.2,58.2]],{"Scorpion":18,"Hyena":15,"Cougar":15,"Dribbo":9,"Moa":9,"Large Antelope":9,"Elephant":6,"Antelope":6,"Boar":6,"Zebra":6,"Chamois":3},["Garganutan"]],
    ["Desert_Super_Hard_Crocs","80-100",[[70.7,86.3],[85.5,81.6]],{"Crocodile":54,"Dribbo":15,"Chamois":8,"Boar":8,"Large Antelope":8,"Cougar":8},["Garganutan"]],
    ["Arctic_Easy","10-40",[[19.5,24.2],[57.4,19.1],[64.5,48],[57,52.3],[63.3,60]],{"Snow Wolf":40,"Arctic Moa":20,"Tusker":20,"Snow Rabbit":20},[]],
    ["Arctic_Hard","60-100",[[24.6,18.4],[73,20.7],[79.3,33.2],[69.1,34]],{"Snow Wolf":43,"Tusker":22,"Snow Rabbit":17,"Snow Leopard":9,"Polar Bear":4,"Woolly Mammoth":4},[]],
    ["Arctic_Bear_Easy","20-80",[[19.1,60.5],[45.7,77],[42.6,90.2]],{"Polar Bear":67,"Tusker":33},[]],
    ["Bear_Hard","60-120",[[24.6,58.2],[48,80.9],[52.7,89.5]],{"Polar Bear":50,"Arctic Scorpion":33,"Woolly Mammoth":17},[]]
  ],
  prometheus:[
    ["1 Grasslands_General","10-60",[[55.5,24.4],[45.3,33.3],[35.6,37.2],[45.7,38.5],[45.8,42.7],[55.7,42.1],[40.2,42.7],[46.5,47.1]],{"Plains Equix":25,"Chala":19,"Pygmy Lop":16,"Moa":9,"Drac":9,"Boar":9,"Terrenus":6,"Viscid":3,"Crocodile":3},["Kea","Bee"]],
    ["2 Grasslands_General","25-40",[[32.7,35.1],[41.5,26],[48.9,29.4]],{"Plains Equix":25,"Chala":19,"Pygmy Lop":16,"Moa":9,"Drac":9,"Boar":9,"Terrenus":6,"Viscid":3,"Crocodile":3},["Kea","Spider","Bee"]],
    ["3 Grasslands_Blueback","10-30",[[46.2,22.7],[50.9,49.4]],{"Blueback":31,"Plains Equix":16,"Pygmy Lop":16,"Chala":12,"Drac":9,"Boar":9,"Viscid":3,"Crocodile":3},["Kea"]],
    ["4 Grasslands_Blueback","15-40",[[46.5,18.2]],{"Blueback":32,"Pygmy Lop":16,"Plains Equix":16,"Chala":13,"Boar":10,"Drac":10,"Bear":3},["Kea"]],
    ["5 Grasslands_Conifer","20-60",[[31,30.4],[35.4,28.9],[57.9,52.4]],{"Wolf":29,"Chala":18,"Rabbit":18,"Jaguar":14,"Buffalo":7,"Terrenus":7,"Bear":4,"Moa":4},["Kea","Spider","Bee"]],
    ["6 Grasslands_General_Birds","10-50",[[52,36.1],[34.6,36],[52.2,37.8],[59.3,39.3],[37.9,42.7]],{"Plains Equix":25,"Chala":19,"Pygmy Lop":16,"Moa":9,"Drac":9,"Boar":9,"Terrenus":6,"Viscid":3,"Crocodile":3},["Dreadwing"]],
    ["7 Grasslands_General_Birds","25-40",[[31.6,34.2]],{"Plains Equix":25,"Chala":19,"Pygmy Lop":16,"Moa":9,"Drac":9,"Boar":9,"Terrenus":6,"Viscid":3,"Crocodile":3},["Dreadwing","Spider"]],
    ["8 Grasslands_Cliffs","15-70",[[55,20.5],[49,28.5],[55.1,30.4],[40.8,49.1]],{"Jaguar":35,"Boar":29,"Pygmy Lop":12,"Blueback":12,"Buffalo":12},["Dreadwing"]],
    ["9 Grasslands_Crater","45-65",[[45.7,41.3]],{"Bear Cub":28,"Bear":28,"Chala":14,"Pygmy Lop":10,"Plains Equix":10,"Boar":7,"Moa":3},["Kea"]],
    ["10 Lava_General","20-120",[[60.8,6.6],[62.2,9.1],[61.6,14.4],[61.8,15.8],[72.7,7.1],[71.3,11.3],[76.3,13.8],[86.7,10.8],[87.5,15.3],[94.3,15.8],[84.5,20.9],[96.7,21.7],[95.1,30.6],[93.5,32.5]],{"Redback":27,"Lava Broodling":23,"Rabbit":14,"Boar":14,"Chala":9,"Stonejaw":9,"Drac":5},["Drifter"]],
    ["11 Lava_General","40-80",[[88,18.6],[93.1,18.4],[85.1,23],[89.5,33.3]],{"Redback":23,"Lava Broodling":19,"Ignari":15,"Rabbit":12,"Boar":12,"Stonejaw":8,"Chala":8,"Drac":4},["Drifter"]],
    ["12 Lava_Striker","20-60",[[79.2,21.7]],{"Redback":27,"Lava Broodling":23,"Rabbit":14,"Boar":14,"Chala":9,"Arid Striker":9,"Drac":5},["Drifter"]],
    ["13 Lava_Striker","35-70",[[70.1,9],[78.8,18.4]],{"Redback":26,"Lava Broodling":22,"Boar":13,"Rabbit":13,"Chala":9,"Arid Striker":9,"Ashen Drake":4,"Drac":4},["Dreadwing","Drifter","Lava Flyer"]],
    ["14 Lava_Striker","30-60",[[83.8,10.4]],{"Ashen Drake":20,"Redback":15,"Rabbit":15,"Boar":15,"Lava Broodling":10,"Arid Striker":10,"Chala":10,"Drac":5},["Drifter"]],
    ["15 Lava_Striker","35-70",[[64.5,4]],{"Arid Striker":57,"Lava Broodling":29,"Drac":14},["Drifter","Lava Flyer"]],
    ["16 Lava_Striker","30-80",[[78.6,28.2],[96.2,25.7],[87.3,29.1]],{"Redback":27,"Lava Broodling":23,"Rabbit":14,"Boar":14,"Chala":9,"Arid Striker":9,"Drac":5},["Drifter","Lava Flyer"]],
    ["17 Lava_Striker","60-120",[[87.5,31]],{"Redback":27,"Lava Broodling":23,"Rabbit":14,"Boar":14,"Chala":9,"Arid Striker":9,"Drac":5},["Dreadwing","Drifter","Lava Flyer"]],
    ["18 Lava_General_Birds","20-70",[[57.7,5.5],[55.9,15],[70.6,7.1],[90.7,11.2],[93.9,14.1],[96.4,18.7],[96.7,20.9],[96.4,23]],{"Redback":27,"Lava Broodling":23,"Rabbit":14,"Boar":14,"Chala":9,"Stonejaw":9,"Drac":5},["Dreadwing","Drifter"]],
    ["19 Lava_Buffalo","15-70",[[59.4,10],[91.4,14.4],[94.1,20.7]],{"Buffalo":52,"Chala":19,"Rabbit":16,"Boar":10,"Drac":3},["Drifter"]],
    ["20 Lava_Drakes","15-100",[[68.7,6.3],[75.4,11.9],[77.1,15.7],[78.4,17.5],[88.4,12.1],[91.4,17.3],[83.2,25.3],[88.8,27.3]],{"Ashen Drake":59,"Rabbit":18,"Chala":12,"Stonejaw":6,"Drac":6},["Drifter"]],
    ["21 Volcanic_SulfurPools","80-110",[[54.8,6.1]],{},["Drifter"]],
    ["22 Tundra_General","30-70",[[30.6,18.7],[38.8,16.6],[39.1,20.8],[29.1,25.6],[43.8,57.9],[44.8,61],[40.2,61.9]],{"Snow Wolf":29,"Deer":14,"Plains Equix":14,"Blueback":11,"Pygmy Lop":11,"Snow Leopard":11,"Snow Rabbit":11},["Kea"]],
    ["23 Arctic_Striker","40-70",[[20.9,23.4],[35.6,57.1]],{"Snow Wolf":29,"Shaggy Zebra":24,"Snow Rabbit":24,"Snow Leopard":14,"Snow Stalker":10},["Dreadwing"]],
    ["24 Arctic_Striker","50-120",[[10.6,21.4],[20.8,20.7],[34.8,54.5]],{"Snow Wolf":29,"Shaggy Zebra":24,"Snow Rabbit":24,"Snow Leopard":14,"Snow Stalker":10},["Dreadwing"]],
    ["25 Arctic_General","35-120",[[17.4,12.2],[16.7,16.6],[13.2,19.2],[18.9,24.2],[40.2,56.1]],{"Snow Wolf":24,"Shaggy Zebra":20,"Snow Rabbit":20,"Arctic Moa":16,"Snow Leopard":12,"Polar Bear":8},[]],
    ["26 Swamp_General","15-120",[[8.2,31.7],[12.5,36],[19.7,32.8],[14,38.3],[9.4,43],[13.5,45.7],[25.5,46.3],[20.3,48.5],[34.6,47.1],[16.2,51.4],[22.7,52.7],[26.2,52.4],[62.9,32.7],[65.8,33.7],[70.1,16.4],[71.9,22.5],[74.8,30.6],[71.9,33.9],[97.4,28.3]],{"Ubis":20,"Stryder":20,"Needler":16,"Pygmy Lop":10,"Swamp Roat":8,"Chala":8,"Viscid":8,"Komodo":8,"Columbian Mammoth":2},["Drifter"]],
    ["27 Swamp_Flooded","30-90",[[22.8,31.3],[23.9,37],[61.6,24.6],[26.7,57.4],[27.4,61.3]],{"Ubis":25,"Stryder":25,"Crocodile":25,"Chala":12,"Needler":12},["Drifter"]],
    ["28 Swamp_Megatree","30-120",[[11.1,33.9],[9.2,36.7],[12.6,47.7],[22.8,55],[65.6,25.7],[71.7,19],[72.9,21.7],[72.3,25.6]],{"Ubis":19,"Stryder":19,"Jaguar":15,"Needler":15,"Pygmy Lop":9,"Chala":8,"Komodo":8,"Swamp Roat":8},["Dreadwing"]],
    ["29 Swamp_General_Birds","25-80",[[14.7,40.2],[19.5,45.1],[30.1,44.8],[27.2,49.8],[34,41.7],[63.3,41.8],[70.6,37.2],[87.6,19.6]],{"Ubis":20,"Stryder":20,"Needler":16,"Pygmy Lop":10,"Swamp Roat":8,"Chala":8,"Viscid":8,"Komodo":8,"Columbian Mammoth":2},["Dreadwing"]],
    ["30 Tundra_Strikers","35-75",[[41.3,65.1]],{"Snow Wolf":25,"Deer":12,"Snow Stalker":12,"Blueback":9,"Woolly Mammoth":9,"Pygmy Lop":9,"Snow Leopard":9,"Snow Rabbit":6,"Plains Equix":6},[]],
    ["31 Tundra_Strikers","40-90",[[39.8,65.2]],{"Snow Wolf":25,"Deer":12,"Snow Stalker":12,"Blueback":9,"Woolly Mammoth":9,"Pygmy Lop":9,"Snow Leopard":9,"Snow Rabbit":6,"Plains Equix":6},["Dreadwing"]],
    ["32 Icesheet_Top","80-120",[[52.7,68]],{"Snow Wolf":60,"Snow Leopard":30,"Polar Bear":10},[]],
    ["33 Icesheet_Lower","80-120",[[55.5,72.6]],{"Polar Bear":44,"Snow Leopard":33,"Snow Wolf":22},[]],
    ["34 Icesheet_Middle","100-120",[[46.8,83.4]],{"Snow Wolf":60,"Snow Leopard":40},[]],
    ["35 Icesheet_Middle","100-120",[[42.1,83.6],[45.3,93.2]],{"Snow Wolf":50,"Snow Leopard":50},[]],
    ["36 Icesheet_Middle","100-120",[[47.8,85.7],[39.4,90.4]],{"Snow Wolf":62,"Snow Leopard":38},[]],
    ["37 Icesheet_Middle","110-120",[[48,87.5],[39.2,88.6]],{"Snow Wolf":80,"Snow Leopard":20},[]],
    ["38 Icesheet_Connection","100-120",[[48.6,68.3],[44.7,69.5],[29.9,81.7],[28.9,86.2],[55.9,79.4],[58.5,82.7]],{"Snow Stalker":57,"Snow Leopard":43},[]],
    ["39 Icesheet_Connection","100-120",[[46.4,72],[29.8,83.6],[54.6,80.9]],{"Snow Stalker":62,"Snow Leopard":38},[]],
    ["40 Icesheet_Top","100-120",[[38.1,74]],{"Snow Wolf":73,"Snow Stalker":27},[]],
    ["42 Icesheet_Top","100-120",[[30.8,72.6],[36.5,76.7]],{"Viscid":40,"Snow Wolf":30,"Snow Leopard":30},[]],
    ["43 Ashlands_Blue","70-120",[[82.2,41.2],[95.1,36.9],[93.3,47.8],[64.1,66.4],[78.2,54.3],[80.5,58.7],[85,50.7],[89.9,54.3],[83.4,74.1],[85.1,75.6]],{"Stonejaw":50,"Ashen Drake":20,"Lava Broodling":20,"Drac":10},["Dreadwing"]],
    ["44 Ashlands_Blue","70-120",[[84.7,44.4],[92.4,38.4],[97.7,46.3],[64.7,71.7],[78.8,56.8],[88.6,51.1],[82.8,77]],{"Stonejaw":50,"Arid Striker":38,"Drac":12},["Dreadwing"]],
    ["45 Ashlands_Orange","100-120",[[66.4,60.1],[64.8,63.9],[78,51.8],[83.8,61.2],[89.5,66.4],[73.9,78],[70.8,80.6]],{"Redback":33,"Stonejaw":33,"Lava Roat":17,"Drac":17},[]],
    ["46 Ashlands_Orange","100-120",[[82.1,51.8],[84,59.9],[87.4,71.8],[69.4,78.1],[72.2,79.2]],{"Stonejaw":50,"Drac":25,"Redback":25},[]],
    ["47 Ashlands_Purple","100-120",[[84.2,63.9],[70.4,66.8],[74.4,72.6],[73.1,76.3]],{"Ignari":35,"Stonejaw":35,"Drac":18,"Lava Roat":12},["Drifter","Lava Flyer"]],
    ["48 Ashlands_Purple","100-120",[[71.7,63.9],[81.3,65.1],[70.8,71.2]],{"Ignari":40,"Stonejaw":40,"Drac":20},["Drifter","Lava Flyer"]],
    ["49 Ashlands_Green","100-120",[[79,43.5],[72.1,47.3],[66,52.2],[71.7,59.1]],{"Stonejaw":33,"Drac":27,"Lava Roat":13,"Redback":13,"Ignari":13},[]],
    ["50 Ashlands_Green","100-120",[[78.2,40.5],[69.2,48.2],[67.3,52.1],[74.4,55.4]],{"Stonejaw":38,"Drac":31,"Redback":15,"Arid Striker":15},[]],
    ["51 Ashlands_Red","110-120",[[91.8,69.7],[69.8,83.9],[80.3,80.6],[86.1,80.2]],{"Stonejaw":40,"Redback":30,"Drac":20,"Ignari":10},["Drifter","Lava Flyer"]],
    ["52 Ashlands_Red","110-120",[[82.4,34.6],[91.1,56.2]],{"Lava Broodling":36,"Stonejaw":29,"Drac":14,"Redback":14,"Ignari":7},["Drifter","Lava Flyer"]],
    ["53 Ashlands_Red","110-120",[[79.6,36.1],[91.6,57.4],[92.2,70.6],[94.7,72.2],[79.2,81.8],[83.8,82.3]],{"Lava Broodling":36,"Arid Striker":29,"Drac":14,"Redback":14,"Ignari":7},["Drifter","Lava Flyer"]]
  ],
  elysium:[
    ["Volcanic_1","50-70",[[8.3,10],[21.7,29.9],[8.3,33]],{"Lava Broodling":21,"Stonejaw":17,"Redback":17,"Lava Roat":17,"Arid Striker":8,"Dreadwing":8,"Scout Drone":4,"Ravager":4,"Stomper":4},["Drifter","Lava Flyer","Scuttler"]],
    ["Volcanic_2","50-70",[[80.7,67.7],[91.7,78.3]],{"Redback":22,"Lava Broodling":22,"Ignari":17,"Ashen Drake":11,"Stomper":11,"Scout Drone":6,"Scuttler":6,"Lava Roat":6},["Drifter","Lava Flyer"]],
    ["Geothermal","20-40",[[33.5,19.3],[59.5,16.9]],{"Hopper":57,"Scout Drone":14,"Sulfuric Spider":14,"Raptor":14},["Gaseous Floater","Sulfur Worm"]],
    ["Geothermal_Center","20-40",[[45.3,19.3]],{"Hopper":40,"Sulfuric Spider":30,"Raptor":20,"Scout Drone":10},["Gaseous Floater","Sulfur Worm"]],
    ["Geothermal_Channels","20-40",[[48.9,25.2],[40,21]],{"Hopper":50,"Sulfuric Spider":25,"Scout Drone":12,"Raptor":12},["Gaseous Floater","Sulfur Worm"]],
    ["Desert_Large","40-70",[[38.3,35.8],[30,30]],{"Draven":22,"Dune Raptor":17,"Hyena":11,"Scorpion":11,"Scout Drone":6,"Moa":6,"Sandhorn":6,"Dribbo":6,"Elephant":6,"Korrin":6,"Trapjaw":6},[]],
    ["Desert_Large_Channels","40-70",[[48.9,29.9],[36.5,43.5]],{"Korrin":40,"Hyena":20,"Draven":20,"Scout Drone":10,"Antelope":10},[]],
    ["Desert_Small","30-50",[[64.2,41.7],[56,33.4]],{"Korrin":19,"Scorpion":10,"Hyena":10,"Moa":10,"Draven":10,"Dune Raptor":10,"Boar":5,"Sandhorn":5,"Scout Drone":5,"Cougar":5,"Zebra":5,"Trapjaw":5,"Dribbo":5},[]],
    ["Desert_OutsideEden","20-50",[[52.4,50]],{"Korrin":20,"Moa":10,"Dune Raptor":10,"Draven":10,"Hyena":10,"Scorpion":10,"Boar":5,"Scout Drone":5,"Zebra":5,"Trapjaw":5,"Dribbo":5,"Komodo":5},[]],
    ["Desert_RightOutsideEden","15-30",[[45.9,47]],{"Korrin":25,"Moa":12,"Draven":12,"Hyena":12,"Scorpion":12,"Boar":6,"Zebra":6,"Dribbo":6,"Komodo":6},[]],
    ["Arctic_2","50-70",[[76,26.4],[80.7,41.7]],{"Snow Wolf":21,"Shaggy Zebra":17,"Snow Leopard":12,"Blueback":12,"Frostfoot":12,"Skulk":8,"Polar Bear":8,"Scout Drone":4,"Arctic Moa":4},[]],
    ["Arctic_1","50-70",[[26.5,71.2],[21.7,57]],{"Skulk":23,"Frostfoot":18,"Shaggy Zebra":18,"Snow Stalker":14,"Blueback":14,"Scout Drone":5,"Tusker":5,"Woolly Mammoth":5},[]],
    ["Arctic_1_Channels","50-70",[[31.2,63.5],[35.9,68.3],[18.8,59.4],[43,80]],{"Skulk":21,"Snow Wolf":21,"Shaggy Zebra":21,"Snow Stalker":14,"Blueback":14,"Scout Drone":7},[]],
    ["Tundra_1","5-15",[[50,61.8]],{"Drosik":29,"Gribbler":24,"Snow Pygmy Lop":24,"Tusker":12,"Skulk":6,"Storca":6},[]],
    ["Tundra_2","10-30",[[37.1,55.9]],{"Drosik":21,"Gribbler":21,"Snow Pygmy Lop":17,"Skulk":17,"Slinker":8,"Tusker":8,"Storca":6,"Frostfoot":0},[]],
    ["Tundra_2_Channels","10-30",[[38.8,49.4]],{"Drosik":25,"Gribbler":20,"Skulk":20,"Snow Pygmy Lop":20,"Slinker":5,"Storca":5,"Tusker":5},[]],
    ["Swamp_1","30-40",[[70.1,67.7],[64.2,78.3]],{"Stryder":22,"Komodo":14,"Swamp Hopper":14,"Reaver":14,"Clicker":14,"Ubis":7,"Viscid":6,"Swamp Roat":4,"Pygmy Lop":4,"Carrier Drone":1},["Drifter"]],
    ["Swamp_1_Channels","30-40",[[76,58.8],[51.2,73],[58.3,77.7]],{"Stryder":33,"Komodo":20,"Swamp Hopper":20,"Swamp Roat":13,"Scout Drone":7,"Reaver":7},["Drifter"]],
    ["Swamp_2","30-40",[[12,88],[47.7,78.3]],{"Stryder":22,"Needler":16,"Ubis":16,"Crocodile":11,"Komodo":11,"Clicker":11,"Venomfly":11,"Swamp Roat":3,"Carrier Drone":1},["Drifter"]],
    ["Swamp_2_Channels","30-40",[[33.5,81.8]],{"Stryder":25,"Ubis":19,"Needler":19,"Komodo":12,"Swamp Roat":12,"Scout Drone":6,"Crocodile":6},["Drifter"]]
  ]
};
// Variantes et petits : ils apparaissent dans les zones de l'espèce de base
const SPAWN_ALIAS={"Bear Cub":"Bear","Baby Deer":"Deer","Polar Bear Cub":"Polar Bear","Pack Wolf":"Wolf","Contaminated Bear":"Bear","Alpha Cougar":"Cougar","Alpha Hyena":"Hyena","Alpha Snow Leopard":"Snow Leopard","Armored Scorpion":"Scorpion","Black Jaguar":"Jaguar","Lava Bomber":"Lava Flyer","Alpha Skulmutt":"Skulmutt"};
const ZONE_L={fr:{Conifer:"Forêt",Desert:"Désert",Transition:"Transition (neige)",Bear:"Ours polaires",Arctic:"Arctique",Easy:"facile",Medium:"moyen",Hard:"difficile",Super:"très",Crocs:"(crocodiles)",
    Grasslands:"Prairies",General:"générale",Blueback:"dos-bleus",Cliffs:"falaises",Crater:"cratère",Birds:"oiseaux",Lava:"Lave",Striker:"frappeurs",Buffalo:"buffles",Drakes:"drakes",Volcanic:"Volcanique",SulfurPools:"bassins de soufre",
    Tundra:"Toundra",Strikers:"rôdeurs",Swamp:"Marais",Flooded:"inondé",Megatree:"arbre géant",Icesheet:"Banquise",Top:"haut",Lower:"bas",Middle:"milieu",Connection:"passage",Ashlands:"Terres de cendre",Blue:"bleu",Orange:"orange",Purple:"violet",Green:"vert",Red:"rouge",
    Geothermal:"Géothermique",Center:"centre",Channels:"chenaux",Large:"grand",Small:"petit",OutsideEden:"hors d'Eden",RightOutsideEden:"est d'Eden"},
  en:{Conifer:"Forest",Desert:"Desert",Transition:"Transition (snow)",Bear:"Polar bears",Arctic:"Arctic",Easy:"easy",Medium:"medium",Hard:"hard",Super:"very",Crocs:"(crocodiles)",
    Grasslands:"Grasslands",General:"general",Blueback:"bluebacks",Cliffs:"cliffs",Crater:"crater",Birds:"birds",Lava:"Lava",Striker:"strikers",Buffalo:"buffalo",Drakes:"drakes",Volcanic:"Volcanic",SulfurPools:"sulfur pools",
    Tundra:"Tundra",Strikers:"stalkers",Swamp:"Swamp",Flooded:"flooded",Megatree:"megatree",Icesheet:"Ice sheet",Top:"top",Lower:"lower",Middle:"middle",Connection:"connection",Ashlands:"Ashlands",Blue:"blue",Orange:"orange",Purple:"purple",Green:"green",Red:"red",
    Geothermal:"Geothermal",Center:"centre",Channels:"channels",Large:"large",Small:"small",OutsideEden:"outside Eden",RightOutsideEden:"east of Eden"}};
function zoneLabel(z){const L=ZONE_L[prefs.lang]||ZONE_L.fr;const m=z.match(/^(\d+) (.*)$/);const name=m?m[2]:z;
  const [head,...rest]=name.split("_");const t=`${L[head]||head}${rest.length?" · "+rest.map(w=>L[w]||w.replace(/(\d)/," $1")).join(" "):""}`;
  return m?`${t} (${FR()?"zone":"zone"} ${m[1]})`:t;}
// Zones où une créature apparaît sur une carte : [{z, lv, pts, pct}] (pct null = présente sans % précis)
function spawnZonesFor(map,name){const zs=SPAWNZ[map];if(!zs)return null;const base=SPAWN_ALIAS[name]||name;const out=[];
  for(const [z,lv,pts,mobs,other] of zs){if(mobs[base]!==undefined)out.push({z,lv,pts,pct:mobs[base]});else if(other.includes(base))out.push({z,lv,pts,pct:null});}
  return out.sort((a,b)=>(b.pct??-1)-(a.pct??-1));}
const hasSpawnData=map=>!!SPAWNZ[map];
// Mini-cartes affichées directement dans la fiche d'une créature
function spawnMiniMaps(name){const fr=FR();const maps=REGIONS.filter(k=>byName[name]&&byName[name][9][k]!==undefined);
  const withZ=maps.map(k=>[k,spawnZonesFor(k,name)]).filter(([,z])=>z&&z.length);
  if(!withZ.length)return "";
  return `<div class="sec"><h3>${fr?"Emplacement sur la carte":"Location on the map"}</h3>
   ${withZ.map(([k,zs])=>{const M=WMAPS[k];const best=zs.filter(z=>z.pct!==null).slice(0,3);
     return `<div class="minimap-wrap"><div class="minimap-hd"><b>${esc(mapName(k))}</b><span class="exs">${zs.length} ${fr?"zone(s)":"zone(s)"}${best.length?` · ${fr?"le plus fréquent":"most common"} : ${best.map(z=>`${esc(zoneLabel(z.z))} ${z.pct} %`).join(", ")}`:""}</span></div>
     <button type="button" class="minimap" data-spawn="${k}" data-n="${esc(name)}" aria-label="${fr?"Ouvrir la grande carte":"Open the full map"}" style="background-image:url('${IMG_BASE}${encodeURI(M.bg)}')">
      ${zs.flatMap(z=>z.pts.map(p=>`<i style="left:${p[0]}%;top:${p[1]}%">${z.pct===null?"":z.pct}</i>`)).join("")}
      <span class="minimap-cta">${fr?"Agrandir ↗":"Enlarge ↗"}</span></button></div>`;}).join("")}
   <p class="note">${fr?"Les épingles rouges montrent les zones où il apparaît et sa chance d'apparition, vérifiée dans les fichiers du jeu. Touchez la carte pour l'agrandir.":"Red pins show the zones where it spawns and its spawn chance, checked against the game files. Tap the map to enlarge it."}</p></div>`;}
(()=>{const st=document.createElement("style");st.textContent=`
.minimap-wrap{margin-top:10px}
.minimap-hd{display:grid;gap:2px;margin-bottom:6px}
.minimap{all:unset;cursor:pointer;position:relative;display:block;width:100%;max-width:420px;aspect-ratio:1;border-radius:10px;background-size:cover;background-position:center;background-color:var(--soft);border:1px solid var(--line);overflow:hidden}
.minimap:focus-visible{outline:2px solid var(--map);outline-offset:2px}
.minimap i{position:absolute;transform:translate(-50%,-50%);min-width:14px;height:14px;padding:0 3px;border-radius:999px;background:#e53935;color:#fff;font:600 9px/14px var(--f-mono);font-style:normal;text-align:center;box-shadow:0 0 0 1.5px #fff,0 1px 4px rgba(0,0,0,.6)}
.minimap-cta{position:absolute;right:8px;bottom:8px;background:rgba(0,0,0,.65);color:#fff;font-size:.75rem;padding:3px 8px;border-radius:999px}
`;document.head.appendChild(st);})();
// Ouvre la carte centrée sur les zones d'une créature
function showOnMap(map,name){state.wm=map;state.wfocus=name;state.wz=1;state.wx=null;
  if(typeof closeSheet==="function"&&sheet.classList.contains("on"))closeSheet();
  if(location.hash==="#cartes")renderCartes();else location.hash="#cartes";}
