/* ========== なかま分け（2つのなかまにすばやく分ける） ========== */
const SORTS=[
  ["被子植物|Angiosperms|被子植物","裸子植物|Gymnosperms|裸子植物",[["アブラナ|Rapeseed|油菜",0],["サクラ|Cherry|櫻花",0],["エンドウ|Pea|豌豆",0],["イネ|Rice|稻",0],["ユリ|Lily|百合",0],["マツ|Pine|松",1],["イチョウ|Ginkgo|銀杏",1],["スギ|Japanese cedar|日本柳杉",1,"スギは種子をつくる裸子植物（スギゴケとはちがう）。|Cedar is a seed-making gymnosperm (not haircap moss).|柳杉是會產生種子的裸子植物（和杉葉蘚不同）。"],["ソテツ|Cycad|蘇鐵",1],["ヒノキ|Japanese cypress|日本扁柏",1]]],
  ["単子葉類|Monocots|單子葉植物","双子葉類|Dicots|雙子葉植物",[["イネ|Rice|稻",0],["トウモロコシ|Corn|玉米",0],["ユリ|Lily|百合",0],["ツユクサ|Dayflower|鴨跖草",0],["ネギ|Green onion|蔥",0],["アブラナ|Rapeseed|油菜",1],["タンポポ|Dandelion|蒲公英",1],["アサガオ|Morning glory|牽牛花",1],["エンドウ|Pea|豌豆",1],["ヒマワリ|Sunflower|向日葵",1]]],
  ["合弁花類|Fused petals|合瓣花類","離弁花類|Free petals|離瓣花類",[["アサガオ|Morning glory|牽牛花",0],["ツツジ|Azalea|杜鵑",0],["タンポポ|Dandelion|蒲公英",0],["ヒマワリ|Sunflower|向日葵",0],["アブラナ|Rapeseed|油菜",1],["サクラ|Cherry|櫻花",1],["エンドウ|Pea|豌豆",1],["バラ|Rose|玫瑰",1],["ホウセンカ|Garden balsam|鳳仙花",1]]],
  ["脊椎動物|Vertebrates|脊椎動物","無脊椎動物|Invertebrates|無脊椎動物",[["メダカ|Medaka fish|青鱂魚",0],["カエル|Frog|青蛙",0],["トカゲ|Lizard|蜥蜴",0],["ハト|Pigeon|鴿子",0],["クジラ|Whale|鯨魚",0],["バッタ|Grasshopper|蝗蟲",1],["カニ|Crab|螃蟹",1],["イカ|Squid|烏賊",1,"イカは軟体動物で背骨がない。|Squid is a mollusk with no backbone.|烏賊是軟體動物，沒有脊椎骨。"],["クモ|Spider|蜘蛛",1],["ミミズ|Earthworm|蚯蚓",1]]],
  ["卵生|Lays eggs|卵生","胎生|Live birth|胎生",[["メダカ|Medaka fish|青鱂魚",0],["カエル|Frog|青蛙",0],["ヘビ|Snake|蛇",0],["ペンギン|Penguin|企鵝",0,"ペンギンは鳥類なので卵生。|Penguins are birds: they lay eggs.|企鵝是鳥類，所以是卵生。"],["カメ|Turtle|龜",0],["イヌ|Dog|狗",1],["クジラ|Whale|鯨魚",1,"クジラは哺乳類なので胎生。|Whales are mammals: live birth.|鯨魚是哺乳類，所以是胎生。"],["コウモリ|Bat|蝙蝠",1,"コウモリは空を飛ぶが哺乳類。|Bats fly but are mammals.|蝙蝠會飛，但是哺乳類。"],["ウマ|Horse|馬",1],["ヒト|Human|人類",1]]],
  ["有機物|Organic|有機物","無機物|Inorganic|無機物",[["砂糖|Sugar|砂糖",0],["デンプン|Starch|澱粉",0],["ロウ|Wax|蠟",0],["プラスチック|Plastic|塑膠",0],["エタノール|Ethanol|乙醇",0],["食塩|Salt|食鹽",1],["ガラス|Glass|玻璃",1],["鉄|Iron|鐵",1],["水|Water|水",1],["二酸化炭素|Carbon dioxide|二氧化碳",1,"二酸化炭素は炭素をふくむが無機物として扱う。|CO₂ contains carbon but is treated as inorganic.|二氧化碳含碳，但歸類為無機物。"]]],
  ["金属|Metal|金屬","金属でない|Not metal|非金屬",[["鉄|Iron|鐵",0],["銅|Copper|銅",0],["アルミニウム|Aluminum|鋁",0],["金|Gold|金",0],["水銀|Mercury|水銀",0,"水銀は常温で液体の金属。|Mercury is a metal that is liquid at room temperature.|水銀是常溫下呈液態的金屬。"],["ガラス|Glass|玻璃",1],["プラスチック|Plastic|塑膠",1],["木|Wood|木頭",1],["ゴム|Rubber|橡膠",1],["食塩|Salt|食鹽",1]]],
  ["純物質|Pure substance|純物質","混合物|Mixture|混合物",[["水|Water|水",0],["酸素|Oxygen|氧氣",0],["鉄|Iron|鐵",0],["エタノール|Ethanol|乙醇",0],["塩化ナトリウム|Sodium chloride|氯化鈉",0],["空気|Air|空氣",1,"空気は窒素・酸素などの混合物。|Air is a mix of nitrogen, oxygen, etc.|空氣是氮氣、氧氣等的混合物。"],["海水|Seawater|海水",1],["食塩水|Salt water|食鹽水",1],["牛乳|Milk|牛奶",1],["花こう岩|Granite|花崗岩",1,"岩石はいろいろな鉱物の混合物。|Rocks are mixtures of minerals.|岩石是多種礦物的混合物。"]]],
  ["火山岩|Volcanic rock|火山岩","深成岩|Plutonic rock|深成岩",[["流紋岩|Rhyolite|流紋岩",0],["安山岩|Andesite|安山岩",0],["玄武岩|Basalt|玄武岩",0],["斑状組織|Porphyritic texture|斑狀組織",0],["地表近くで急に冷えた|Cooled fast near the surface|在地表附近快速冷卻",0],["花こう岩|Granite|花崗岩",1],["せん緑岩|Diorite|閃長岩",1],["斑れい岩|Gabbro|輝長岩",1],["等粒状組織|Equigranular texture|等粒狀組織",1],["地下深くでゆっくり冷えた|Cooled slowly deep underground|在地下深處慢慢冷卻",1]]],
  ["示相化石|Facies fossil|指相化石","示準化石|Index fossil|標準化石",[["サンゴ|Coral|珊瑚",0,"サンゴはあたたかく浅い海を示す。|Coral shows a warm, shallow sea.|珊瑚表示溫暖的淺海。"],["シジミ|Shijimi clam|蜆",0,"シジミは河口や湖を示す。|Shijimi shows a river mouth or lake.|蜆表示河口或湖泊。"],["ブナの葉|Beech leaf|山毛櫸的葉",0],["三葉虫|Trilobite|三葉蟲",1],["フズリナ|Fusulinid|紡錘蟲",1],["アンモナイト|Ammonite|菊石",1],["恐竜|Dinosaur|恐龍",1],["ビカリア|Vicarya|維卡里亞螺",1],["ナウマンゾウ|Naumann's elephant|諾氏古菱齒象",1]]],
  ["有色鉱物|Dark mineral|有色礦物","無色鉱物|Light mineral|無色礦物",[["クロウンモ|Biotite|黑雲母",0],["カクセン石|Hornblende|角閃石",0],["キ石|Pyroxene|輝石",0],["カンラン石|Olivine|橄欖石",0],["磁鉄鉱|Magnetite|磁鐵礦",0],["セキエイ|Quartz|石英",1],["チョウ石|Feldspar|長石",1]]],
  ["反射|Reflection|反射","屈折|Refraction|折射",[["鏡に自分の姿がうつる|You see yourself in a mirror|在鏡子裡看到自己",0],["水面に景色がうつる|Scenery mirrored on water|水面映出景色",0],["光ファイバーで光が進む|Light travels in an optical fiber|光在光纖中前進",0,"光ファイバーは全反射を利用している。|Optical fibers use total internal reflection.|光纖利用全反射。"],["ものが見える（乱反射）|Seeing objects (diffuse light)|看得見物體（漫反射）",0],["コップのストローが折れて見える|A straw looks bent in a glass|杯中吸管看起來折斷",1],["水中のコインが浮いて見える|A coin underwater looks raised|水中的硬幣看起來浮起",1],["虫めがねで大きく見える|A magnifier makes things bigger|放大鏡讓東西變大",1],["プリズムで光が色に分かれる|A prism splits light into colors|三稜鏡把光分成顏色",1]]],
  ["はなれていてもはたらく|Acts at a distance|不接觸也能作用","ふれてはたらく|Acts by contact|接觸才能作用",[["重力|Gravity|重力",0],["磁石の力|Magnetic force|磁力",0],["電気の力|Electric force|電力",0],["摩擦力|Friction|摩擦力",1],["弾性力|Elastic force|彈力",1],["垂直抗力|Normal force|正向力",1],["手でおす力|Pushing by hand|用手推的力",1]]],
];

/* ========== 単元 ========== */
const units=[
 {id:"bio",s:"sci",g:"life",n:{ja:"いろいろな生物",en:"Living things","zh-Hant":"各種生物"},gr:"1",k:"math",ref:X("第2分野(1) いろいろな生物とその共通点|Field 2 (1) Diversity of living things|第2領域(1) 各種生物及其共同點"),
  parts:[1,2,3,4,5],pn:{1:X("観察器具（顕微鏡・ルーペ）|Microscopes & hand lenses|觀察器材（顯微鏡、放大鏡）"),2:X("花のつくり|Parts of a flower|花的構造"),3:X("種子植物の分類|Classifying seed plants|種子植物的分類"),4:X("種子をつくらない植物|Plants without seeds|不產生種子的植物"),5:X("動物の分類|Classifying animals|動物的分類")},
  sk:{1:bioMic,2:bioFlower,3:bioClass,4:bioSpore,5:bioAnimal}},
 {id:"mat",s:"sci",g:"part",n:{ja:"身の回りの物質",en:"Materials around us","zh-Hant":"身邊的物質"},gr:"1",k:"math",ref:X("第1分野(2) 身の回りの物質|Field 1 (2) Materials around us|第1領域(2) 身邊的物質"),
  parts:[1,2,3,4,5],pn:{1:X("物質の区別|Telling substances apart|物質的區別"),2:X("密度|Density|密度"),3:X("気体の性質|Properties of gases|氣體的性質"),4:X("水溶液（濃度・溶解度）|Solutions (concentration, solubility)|水溶液（濃度、溶解度）"),5:X("状態変化|Changes of state|狀態變化")},
  sk:{1:mat1,2:mat2,3:mat3,4:mat4,5:mat5}},
 {id:"phys",s:"sci",g:"ene",n:{ja:"光・音・力",en:"Light, sound & force","zh-Hant":"光、聲音與力"},gr:"1",k:"math",ref:X("第1分野(1) 身近な物理現象|Field 1 (1) Everyday physics|第1領域(1) 身邊的物理現象"),
  parts:[1,2,3,4,5],pn:{1:X("光の反射と屈折|Reflection & refraction|光的反射與折射"),2:X("凸レンズ|Convex lenses|凸透鏡"),3:X("音|Sound|聲音"),4:X("力と重さ・質量|Forces, weight & mass|力與重量、質量"),5:X("ばね・2力のつり合い|Springs & balanced forces|彈簧、兩力平衡")},
  sk:{1:phys1,2:phys2,3:phys3,4:phys4,5:phys5}},
 {id:"earth",s:"sci",g:"earth",n:{ja:"大地の変化",en:"The changing Earth","zh-Hant":"大地的變化"},gr:"1",k:"math",ref:X("第2分野(2) 大地の成り立ちと変化|Field 2 (2) How the land forms and changes|第2領域(2) 大地的形成與變化"),
  parts:[1,2,3,4],pn:{1:X("火山と火成岩|Volcanoes & igneous rocks|火山與火成岩"),2:X("地震|Earthquakes|地震"),3:X("地層と化石|Strata & fossils|地層與化石"),4:X("大地の変動と災害|Crustal movement & disasters|地殼變動與災害")},
  sk:{1:earth1,2:earth2,3:earth3,4:earth4}},
 {id:"sort",s:"sci",g:"sort",n:{ja:"なかま分け",en:"Sort it!","zh-Hant":"分類遊戲"},gr:"1",k:"math",ref:X("中1理科の全単元から|From all Grade 7 science units|國一自然全部單元"),
  parts:SORTS.map((_,i)=>i+1),pn:Object.fromEntries(SORTS.map(([a,b],i)=>[i+1,`${X(a)} / ${X(b)}`])),sk:Object.fromEntries(SORTS.map(([a,b,it],i)=>[i+1,SORT(a,b,it)]))},
];
// 問題を作る（MATH.make と同じ。変な選択肢が出ないよう作り直しつき）
function make(fn){ for(let i=0;i<20;i++){ try{ const g=fn(); if(g&&(g.opts||g.wrongs.length>=3)&&!g.wrongs.some(w=>w.v===g.ans)) return g; }catch(e){} } return fn(); }
return {units,make};
})();
