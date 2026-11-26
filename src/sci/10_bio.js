/* ========== ① いろいろな生物とその共通点（第2分野(1)） ========== */
// 顕微鏡：A 接眼レンズ B レボルバー C 対物レンズ D ステージ E 反射鏡 F 調節ねじ
const FIG_MIC=SV(250,250,
  `<rect x="52" y="226" width="130" height="16" rx="5" class="os"/>`+
  `<polygon points="150,226 168,226 168,150 140,72 124,80 150,150" class="os"/>`+
  `<rect x="104" y="92" width="30" height="12" class="os"/>`+
  `<rect x="80" y="40" width="26" height="92" rx="3" class="os"/>`+
  `<rect x="84" y="20" width="18" height="20" rx="2" class="ac"/>`+
  `<polygon points="72,132 114,132 120,144 66,144" class="ac"/>`+
  `<rect x="86" y="144" width="14" height="24" rx="2" class="ac"/><rect x="68" y="144" width="10" height="16" rx="2" transform="rotate(18 73 144)" class="os"/>`+
  `<rect x="40" y="174" width="128" height="9" rx="2" class="ac"/>`+
  `<ellipse cx="93" cy="208" rx="17" ry="6" class="ac"/>`+L(93,214,93,226,"k")+
  `<circle cx="160" cy="124" r="11" class="ac"/>`+
  TAG(40,34,84,30,"A")+TAG(28,140,70,138,"B")+TAG(40,166,86,160,"C")+TAG(22,182,40,178,"D")+TAG(52,212,76,208,"E")+TAG(206,128,171,124,"F"));
const MIC_NM={A:"接眼レンズ|Eyepiece|接目鏡",B:"レボルバー|Revolving nosepiece|旋轉盤",C:"対物レンズ|Objective lens|接物鏡",D:"ステージ|Stage|載物台",E:"反射鏡|Mirror|反光鏡",F:"調節ねじ|Focus knob|調節輪"};
const MIC_DO={A:"目でのぞくレンズ|the lens you look into|眼睛看的鏡頭",B:"回して対物レンズを切りかえる|turn it to change objective lenses|轉動它來換接物鏡",C:"観察するものに近いレンズ|the lens close to the specimen|靠近觀察物的鏡頭",D:"プレパラートをのせる台|where you put the slide|放玻片標本的台子",E:"光を集めて明るくする|collects light to brighten the view|聚集光線讓視野變亮",F:"回してピントを合わせる|turn it to focus|轉動它來對焦"};
function micName(){ const ks=Object.keys(MIC_NM); const a=pick(ks); const ws=shuf(ks.filter(k=>k!==a)).slice(0,3);
  return {q:X(`図の ${a} の部分の名前は？|What is part ${a} in the figure?|圖中 ${a} 的名稱是？`)+FIG_MIC,ans:X(MIC_NM[a]),
    wrongs:ws.map(k=>({v:X(MIC_NM[k]),why:X(`${X(MIC_NM[k])}は図の ${k}（${X(MIC_DO[k])}）です。|${X(MIC_NM[k])} is ${k} in the figure (${X(MIC_DO[k])}).|${X(MIC_NM[k])}是圖中的 ${k}（${X(MIC_DO[k])}）。`)})),
    exp:X(`${a} は${X(MIC_NM[a])}：${X(MIC_DO[a])}。|${a} is the ${X(MIC_NM[a]).toLowerCase()}: ${X(MIC_DO[a])}.|${a} 是${X(MIC_NM[a])}：${X(MIC_DO[a])}。`),tf:v=>X(`図の ${a} は|Part ${a} in the figure is|圖中的 ${a} 是`)+FIG_MIC+`→ ${v}`,kind:"fig"}; }
function micMag(){ const e=pick([5,10,15]),o=pick([4,10,40]); const ans=e*o; const mag=n=>X(`${n}倍|×${n}|${n}倍`);
  return {q:X(`接眼レンズ ${mag(e)}、対物レンズ ${mag(o)} のとき、顕微鏡の倍率は？|Eyepiece ${mag(e)}, objective ${mag(o)}. What is the magnification?|接目鏡 ${mag(e)}、接物鏡 ${mag(o)}，顯微鏡的放大倍率是？`),ans:mag(ans),
    wrongs:[[e+o,"倍率は「たし算」ではなく「かけ算」です。|Multiply the two, don't add.|放大倍率要相乘，不是相加。"],[o,"接眼レンズの倍率もかけます。|Multiply by the eyepiece too.|也要乘上接目鏡的倍率。"],[e*o*10,"かけ算をもう一度確かめよう。|Check the multiplication again.|再檢查一次乘法。"],[Math.max(e,o)/Math.min(e,o),"わり算ではなく、かけ算です。|Multiply, don't divide.|是乘法，不是除法。"]]
      .filter(([v])=>v!==ans&&Number.isInteger(v)).slice(0,3).map(([v,why])=>({v:mag(v),why:X(why)})),
    exp:X(`倍率 ＝ 接眼レンズの倍率 × 対物レンズの倍率 ＝ ${e} × ${o} ＝ ${ans}|Magnification = eyepiece × objective = ${e} × ${o} = ${ans}|放大倍率 ＝ 接目鏡 × 接物鏡 ＝ ${e} × ${o} ＝ ${ans}`),tf:v=>X(`接眼 ${mag(e)}・対物 ${mag(o)} の倍率は|Eyepiece ${mag(e)} and objective ${mag(o)} give|接目鏡 ${mag(e)}、接物鏡 ${mag(o)} 的倍率是`)+` ${v}`,kind:"calc"}; }
const bioMic=[micName,micName,micMag,
  Q("顕微鏡で観察するとき、はじめに使う対物レンズは？|Which objective lens do you use first?|用顯微鏡觀察時，一開始用哪個接物鏡？","いちばん低い倍率のもの|The lowest power|倍率最低的",
    [["いちばん高い倍率のもの|The highest power|倍率最高的","高い倍率は視野がせまく、見たいものを探しにくいです。|High power has a narrow view, so it is hard to find things.|高倍率視野窄，不容易找到要看的東西。"],["いちばん長いもの|The longest one|最長的","対物レンズは長いものほど倍率が高いです。|Longer objectives have higher power.|接物鏡越長，倍率越高。"],["どれでもよい|Any one|哪個都可以","低い倍率から始めると、視野が広く探しやすいです。|Starting low gives a wide view.|從低倍率開始，視野寬，容易找。"]],
    "低倍率で見たいものを視野の中央に入れてから、高倍率にする。|Find it at low power, center it, then switch to high power.|先用低倍率把要看的東西移到視野中央，再換高倍率。"),
  Q("ピントの合わせ方で正しいのは？|How do you focus correctly?|對焦的正確方法是？","のぞきながら対物レンズとプレパラートを遠ざける|Look through it and move the lens and slide apart|一邊看一邊讓接物鏡和玻片遠離",
    [["のぞきながら対物レンズとプレパラートを近づける|Look through it and move them closer|一邊看一邊讓它們靠近","ぶつかってプレパラートやレンズが割れることがあります。近づけるのは横から見ながら。|They may hit and break. Move them closer only while watching from the side.|可能會撞破玻片或鏡頭。靠近時要從側面看。"],["レボルバーを回す|Turn the nosepiece|轉動旋轉盤","レボルバーは対物レンズ（倍率）を切りかえるものです。|The nosepiece changes the objective (power).|旋轉盤是用來換接物鏡（倍率）。"],["反射鏡を動かす|Move the mirror|移動反光鏡","反射鏡は明るさを調節するものです。|The mirror adjusts brightness.|反光鏡是調節亮度的。"]],
    "横から見ながら近づけ、のぞきながら遠ざけてピントを合わせる。|Bring them close while watching from the side, then focus by moving apart while looking in.|從側面看著讓它們靠近，再一邊看一邊遠離來對焦。"),
  Q("レンズをとりつける順番は？|In what order do you attach the lenses?|裝鏡頭的順序是？","接眼レンズ → 対物レンズ|Eyepiece → objective|接目鏡 → 接物鏡",
    [["対物レンズ → 接眼レンズ|Objective → eyepiece|接物鏡 → 接目鏡","先に接眼レンズをつけないと、鏡筒にほこりが入ります。|Without the eyepiece first, dust falls into the tube.|不先裝接目鏡，灰塵會掉進鏡筒。"],["どちらが先でもよい|Either order|哪個先都可以","順番があります。ほこりが入らないように接眼レンズが先。|There is an order: eyepiece first, to keep dust out.|有順序：先裝接目鏡，避免灰塵進入。"],["反射鏡 → 接眼レンズ|Mirror → eyepiece|反光鏡 → 接目鏡","反射鏡ははじめから顕微鏡についています。|The mirror is already part of the microscope.|反光鏡本來就裝在顯微鏡上。"]],
    "ほこりが鏡筒に入らないよう、接眼レンズを先につける。|Attach the eyepiece first so dust doesn't get into the tube.|先裝接目鏡，避免灰塵進入鏡筒。"),
  Q("倍率を高くすると、視野はどうなる？|What happens to the view at higher power?|倍率提高時，視野會怎樣？","せまく、暗くなる|Narrower and darker|變窄、變暗",
    [["広く、明るくなる|Wider and brighter|變寬、變亮","それは倍率を低くしたときです。|That happens at lower power.|那是降低倍率時。"],["せまく、明るくなる|Narrower and brighter|變窄、變亮","入る光が少なくなるので暗くなります。|Less light comes in, so it gets darker.|進來的光變少，所以變暗。"],["広く、暗くなる|Wider and darker|變寬、變暗","大きく見えるぶん、見える範囲はせまくなります。|Things look bigger, so you see a smaller area.|看起來變大，看得到的範圍就變窄。"]],
    "高倍率：大きく見えるが、視野はせまく暗い。|High power: bigger, but the view is narrower and darker.|高倍率：看起來大，但視野窄又暗。"),
  Q("顕微鏡を直射日光の当たる場所で使ってはいけない理由は？|Why must you not use a microscope in direct sunlight?|為什麼不能在陽光直射處使用顯微鏡？","反射鏡で集めた日光で目をいためるから|Sunlight from the mirror can hurt your eyes|反光鏡聚集的陽光會傷眼睛",
    [["レンズがとけるから|The lenses melt|鏡頭會融化","レンズはとけません。目を守るためです。|Lenses don't melt. It is to protect your eyes.|鏡頭不會融化，是為了保護眼睛。"],["プレパラートがかわくから|The slide dries|玻片會變乾","いちばんの理由は目の安全です。|The main reason is eye safety.|最主要的理由是眼睛安全。"],["暗くて見えないから|It is too dark|太暗看不見","直射日光は明るすぎて危険です。|Direct sunlight is too bright and dangerous.|陽光直射太亮，很危險。"]],
    "直射日光の当たらない、明るく水平な場所で使う。|Use it in a bright, level place out of direct sunlight.|在明亮、平坦、沒有陽光直射的地方使用。"),
  Q("ルーペの正しい使い方は？（観察するものが動かせるとき）|How do you use a hand lens? (when the object can be moved)|放大鏡的正確用法是？（觀察物可以移動時）","ルーペを目に近づけて持ち、観察するものを前後に動かす|Hold it close to your eye and move the object back and forth|放大鏡靠近眼睛拿著，前後移動觀察物",
    [["ルーペを観察するものに近づけ、顔を前後に動かす|Hold it near the object and move your face|放大鏡靠近觀察物，前後移動臉","ルーペは目に近づけて持ちます。|Hold the lens close to your eye.|放大鏡要靠近眼睛拿。"],["ルーペを目から遠ざけて持つ|Hold it far from your eye|放大鏡離眼睛遠一點拿","目に近づけたほうが広く見えます。|Close to the eye gives a wider view.|靠近眼睛看得比較廣。"],["ルーペで太陽を見て明るさを確かめる|Look at the sun through it|用放大鏡看太陽確認亮度","ルーペで太陽を見ると目をいためます。ぜったいにしない。|Never look at the sun through a lens.|絕對不可以用放大鏡看太陽。"]],
    "ルーペは目に近づけて持つ。動かせないものは、顔を前後に動かす。|Hold it near your eye. If the object can't move, move your face.|放大鏡靠近眼睛。觀察物不能動時，就前後移動臉。"),
  Q("双眼実体顕微鏡の特徴は？|What is special about a stereo microscope?|解剖顯微鏡（雙眼實體顯微鏡）的特點是？","両目で見るので、立体的に見える|You use both eyes, so things look 3D|用雙眼看，看起來是立體的",
    [["プレパラートをつくる必要がある|You need a prepared slide|一定要做玻片標本","プレパラートはいりません。そのままのせて見られます。|No slide needed. Just put the object on it.|不需要玻片，直接放上去就能看。"],["600倍くらいまで大きくできる|It magnifies up to about ×600|可以放大到約600倍","20〜40倍くらいです。|It is about ×20–40.|大約20〜40倍。"],["片目でのぞく|You look with one eye|用單眼看","「双眼」なので両目で見ます。|Binocular means both eyes.|「雙眼」就是用兩隻眼睛看。"]],
    "双眼実体顕微鏡：両目で20〜40倍、立体的に観察できる。|Stereo microscope: both eyes, ×20–40, 3D view.|解剖顯微鏡：雙眼、20〜40倍、立體觀察。"),
];

// 花のつくり：A 柱頭 B やく C 花弁 D がく E 子房 F 胚珠
const FIG_FL=SV(250,225,
  `<path d="M104 166 Q58 150 48 88 Q82 108 104 158 Z" class="os"/><path d="M136 166 Q182 150 192 88 Q158 108 136 158 Z" class="os"/>`+
  `<path d="M112 172 Q88 186 70 176 Q90 168 112 166 Z" class="ac"/><path d="M128 172 Q152 186 170 176 Q150 168 128 166 Z" class="ac"/>`+
  L(102,166,88,96,"o")+L(138,166,152,96,"o")+`<ellipse cx="88" cy="90" rx="6" ry="9" class="ac"/><ellipse cx="152" cy="90" rx="6" ry="9" class="ac"/>`+
  L(120,130,120,74,"o")+`<ellipse cx="120" cy="70" rx="9" ry="5" class="ac"/>`+
  `<ellipse cx="120" cy="150" rx="17" ry="21" class="ac"/><circle cx="114" cy="146" r="3.5" class="pt"/><circle cx="126" cy="152" r="3.5" class="pt"/><circle cx="118" cy="160" r="3.5" class="pt"/>`+
  L(120,172,120,220,"o")+
  TAG(182,64,129,69,"A")+TAG(206,92,159,90,"B")+TAG(26,96,56,100,"C")+TAG(40,200,76,178,"D")+TAG(190,150,138,150,"E")+TAG(190,182,121,161,"F"));
const FL_NM={A:"柱頭|Stigma|柱頭",B:"やく|Anther|花藥",C:"花弁|Petal|花瓣",D:"がく|Sepal|花萼",E:"子房|Ovary|子房",F:"胚珠|Ovule|胚珠"};
const FL_DO={A:"めしべの先。花粉がつく|tip of the pistil; pollen lands here|雌蕊的頂端，花粉附著的地方",B:"おしべの先。花粉が入っている|tip of the stamen; holds pollen|雄蕊的頂端，裝有花粉",C:"花びら|the colored leaves of the flower|花的花瓣",D:"花のいちばん外側で花を支える|outermost part that supports the flower|花最外側、支撐花的部分",E:"めしべのもとのふくらんだ部分|swollen base of the pistil|雌蕊基部膨大的部分",F:"子房の中のつぶ|small grains inside the ovary|子房裡的小顆粒"};
function flName(){ const ks=Object.keys(FL_NM); const a=pick(ks); const ws=shuf(ks.filter(k=>k!==a)).slice(0,3);
  return {q:X(`図の ${a} の部分の名前は？|What is part ${a} in the figure?|圖中 ${a} 的名稱是？`)+FIG_FL,ans:X(FL_NM[a]),
    wrongs:ws.map(k=>({v:X(FL_NM[k]),why:X(`${X(FL_NM[k])}は図の ${k}（${X(FL_DO[k])}）です。|${X(FL_NM[k])} is ${k} (${X(FL_DO[k])}).|${X(FL_NM[k])}是圖中的 ${k}（${X(FL_DO[k])}）。`)})),
    exp:X(`${a} は${X(FL_NM[a])}：${X(FL_DO[a])}。|${a} is the ${X(FL_NM[a]).toLowerCase()}: ${X(FL_DO[a])}.|${a} 是${X(FL_NM[a])}：${X(FL_DO[a])}。`),tf:v=>X(`図の ${a} は|Part ${a} is|圖中的 ${a} 是`)+FIG_FL+`→ ${v}`,kind:"fig"}; }
const bioFlower=[flName,flName,flName,
  Q("「受粉」とは何のこと？|What is pollination?|什麼是「授粉」？","花粉がめしべの柱頭につくこと|Pollen landing on the stigma|花粉附著在雌蕊的柱頭上",
    [["花粉がおしべのやくにつくこと|Pollen landing on the anther|花粉附著在雄蕊的花藥上","花粉はもともとやくの中にあります。つくのは柱頭です。|Pollen is made in the anther; it must reach the stigma.|花粉本來就在花藥裡，要附著到柱頭。"],["胚珠が種子になること|An ovule becoming a seed|胚珠變成種子","それは受粉したあとに起こる変化です。|That happens after pollination.|那是授粉之後的變化。"],["子房が果実になること|An ovary becoming a fruit|子房變成果實","それも受粉したあとに起こる変化です。|That also happens after pollination.|那也是授粉之後的變化。"]],
    "受粉：花粉が柱頭につく → やがて子房は果実、胚珠は種子になる。|Pollination: pollen on the stigma → later the ovary becomes fruit and ovules become seeds.|授粉：花粉附著在柱頭 → 之後子房變果實，胚珠變種子。",FIG_FL),
  Q("受粉したあと、子房は何になる？|After pollination, what does the ovary become?|授粉後，子房會變成什麼？","果実|Fruit|果實",
    [["種子|Seed|種子","種子になるのは胚珠です。|The ovule becomes the seed.|變成種子的是胚珠。"],["花弁|Petal|花瓣","花弁はやがてかれて落ちます。|Petals wither and fall.|花瓣會枯萎掉落。"],["花粉|Pollen|花粉","花粉はおしべのやくでつくられます。|Pollen is made in the anther.|花粉是在雄蕊的花藥製造的。"]],
    "子房 → 果実、胚珠 → 種子|Ovary → fruit, ovule → seed|子房 → 果實，胚珠 → 種子"),
  Q("受粉したあと、胚珠は何になる？|After pollination, what does the ovule become?|授粉後，胚珠會變成什麼？","種子|Seed|種子",
    [["果実|Fruit|果實","果実になるのは子房です。|The ovary becomes the fruit.|變成果實的是子房。"],["柱頭|Stigma|柱頭","柱頭はめしべの先の部分です。|The stigma is the tip of the pistil.|柱頭是雌蕊的頂端。"],["がく|Sepal|花萼","がくは花の外側で花を支える部分です。|The sepal supports the flower from outside.|花萼是在外側支撐花的部分。"]],
    "子房 → 果実、胚珠 → 種子|Ovary → fruit, ovule → seed|子房 → 果實，胚珠 → 種子"),
  Q("花のつくりを外側から順に並べると？|From outside to inside, the parts of a flower are…|從外到內，花的構造依序是？","がく → 花弁 → おしべ → めしべ|Sepals → petals → stamens → pistil|花萼 → 花瓣 → 雄蕊 → 雌蕊",
    [["花弁 → がく → おしべ → めしべ|Petals → sepals → stamens → pistil|花瓣 → 花萼 → 雄蕊 → 雌蕊","いちばん外側はがくです。|The sepals are outermost.|最外側是花萼。"],["がく → 花弁 → めしべ → おしべ|Sepals → petals → pistil → stamens|花萼 → 花瓣 → 雌蕊 → 雄蕊","中心にあるのはめしべです。|The pistil is in the center.|中心是雌蕊。"],["めしべ → おしべ → 花弁 → がく|Pistil → stamens → petals → sepals|雌蕊 → 雄蕊 → 花瓣 → 花萼","それは内側からの順です。|That is from the inside.|那是從內側開始的順序。"]],
    "外側から がく・花弁・おしべ・めしべ（中心）。|Outside in: sepals, petals, stamens, pistil (center).|由外到內：花萼、花瓣、雄蕊、雌蕊（中心）。"),
  Q("マツの花で、花粉が入っているのはどこ？|In a pine, where is the pollen?|松樹的花，花粉在哪裡？","雄花のりん片の花粉のう|Pollen sacs on the male cone scales|雄毬花鱗片上的花粉囊",
    [["雌花のりん片の胚珠|Ovules on the female cone scales|雌毬花鱗片上的胚珠","雌花のりん片にあるのは胚珠です。|Female scales carry ovules.|雌毬花的鱗片上是胚珠。"],["子房の中|Inside the ovary|子房裡面","マツには子房がありません。|Pines have no ovary.|松樹沒有子房。"],["柱頭の上|On the stigma|柱頭上","マツには柱頭がありません。花粉は風で直接胚珠につきます。|Pines have no stigma; wind carries pollen straight to the ovules.|松樹沒有柱頭，花粉靠風直接附著到胚珠。"]],
    "マツ：雄花のりん片に花粉のう、雌花のりん片に胚珠（むき出し）。|Pine: pollen sacs on male scales, bare ovules on female scales.|松樹：雄毬花鱗片有花粉囊，雌毬花鱗片有裸露的胚珠。"),
  Q("胚珠が子房の中にある植物を何という？|Plants with ovules inside an ovary are called…|胚珠包在子房裡的植物叫做？","被子植物|Angiosperms|被子植物",
    [["裸子植物|Gymnosperms|裸子植物","裸子植物は子房がなく、胚珠がむき出しです。|Gymnosperms have no ovary; the ovules are bare.|裸子植物沒有子房，胚珠裸露。"],["シダ植物|Ferns|蕨類植物","シダ植物は種子をつくらず、胞子でふえます。|Ferns make spores, not seeds.|蕨類不產生種子，用孢子繁殖。"],["コケ植物|Mosses|苔蘚植物","コケ植物も胞子でふえます。|Mosses also reproduce by spores.|苔蘚也是用孢子繁殖。"]],
    "被子植物：胚珠が子房の中。裸子植物：子房がなく胚珠がむき出し。|Angiosperms: ovules in an ovary. Gymnosperms: no ovary, bare ovules.|被子植物：胚珠在子房內。裸子植物：沒有子房，胚珠裸露。"),
  Q("裸子植物はどれ？|Which is a gymnosperm?|哪一個是裸子植物？","イチョウ|Ginkgo|銀杏",
    [["アブラナ|Rapeseed|油菜","アブラナは子房があるので被子植物です。|Rapeseed has an ovary: angiosperm.|油菜有子房，是被子植物。"],["サクラ|Cherry|櫻花","サクラは実（果実）ができる被子植物です。|Cherry makes fruit: angiosperm.|櫻花會結果實，是被子植物。"],["ツツジ|Azalea|杜鵑","ツツジは被子植物です。|Azalea is an angiosperm.|杜鵑是被子植物。"]],
    "裸子植物の例：マツ・イチョウ・スギ・ソテツ。|Gymnosperms: pine, ginkgo, cedar, cycad.|裸子植物的例子：松、銀杏、杉、蘇鐵。"),
];

// 種子植物の分類（なかまの図）：空らんを1つかくす
const TREE=[["種子植物|Seed plants|種子植物",150,18],["被子植物|Angiosperms|被子植物",95,70],["裸子植物|Gymnosperms|裸子植物",225,70],["単子葉類|Monocots|單子葉植物",47,122],["双子葉類|Dicots|雙子葉植物",147,122],["合弁花類|Fused petals|合瓣花類",100,174],["離弁花類|Free petals|離瓣花類",206,174]];
const TREE_E=[[0,1],[0,2],[1,3],[1,4],[4,5],[4,6]];
const TREE_WHY=["",
  "胚珠が子房の中にあるなかま|ovules inside an ovary|胚珠在子房內的一類","胚珠がむき出しのなかま|bare ovules|胚珠裸露的一類",
  "子葉が1枚のなかま|one seed leaf|子葉1片的一類","子葉が2枚のなかま|two seed leaves|子葉2片的一類",
  "花弁がくっついているなかま|petals joined together|花瓣連在一起的一類","花弁が1枚ずつ離れているなかま|petals separate|花瓣一片片分開的一類"];
function treeFig(hide){ let b=""; for(const [p,c] of TREE_E){ const P=TREE[p],Q2=TREE[c]; b+=L(P[1],P[2]+12,Q2[1],Q2[2]-12,"o"); }
  TREE.forEach(([n,x,y],i)=>{ b+=`<rect x="${x-46}" y="${y-12}" width="92" height="24" rx="6" class="${i===hide?"ac":"bx"}"/>`+T(x,y+4,i===hide?"A":X(n),i===hide?"lb":"sm"); }); return SV(300,192,b); }
function plantTree(){ const h=R(1,6); const ws=shuf([1,2,3,4,5,6].filter(i=>i!==h)).slice(0,3); const fig=treeFig(h);
  return {q:X("図の A に入るなかまは？|Which group goes in box A?|圖中 A 應填入哪一類？")+fig,ans:X(TREE[h][0]),
    wrongs:ws.map(i=>({v:X(TREE[i][0]),why:X(`${X(TREE[i][0])}は${X(TREE_WHY[i])}です。図の位置を確かめよう。|${X(TREE[i][0])}: ${X(TREE_WHY[i])}. Check where it goes in the chart.|${X(TREE[i][0])}是${X(TREE_WHY[i])}。確認它在圖中的位置。`)})),
    exp:X(`A は${X(TREE[h][0])}（${X(TREE_WHY[h])}）。|A is ${X(TREE[h][0])} (${X(TREE_WHY[h])}).|A 是${X(TREE[h][0])}（${X(TREE_WHY[h])}）。`),tf:v=>X("図の A は|Box A is|圖中的 A 是")+fig+`→ ${v}`,kind:"fig"}; }
// 葉脈と根：A 平行脈 B 網状脈 C ひげ根 D 主根と側根
const FIG_LR=SV(300,170,
  `<path d="M40 14 Q62 80 40 150 Q18 80 40 14 Z" class="ac"/>`+L(40,18,40,146)+`<path d="M34 26 Q27 80 34 138" class="k"/><path d="M46 26 Q53 80 46 138" class="k"/>`+
  `<path d="M115 16 Q174 64 115 152 Q56 64 115 16 Z" class="ac"/>`+L(115,20,115,148)+L(115,52,104,42)+L(115,52,126,42)+L(115,82,96,68)+L(115,82,134,68)+L(115,114,100,102)+L(115,114,130,102)+L(104,74,100,86)+L(126,74,130,86)+L(106,106,103,118)+L(124,106,127,118)+
  L(190,16,190,24,"o")+[[-26,96],[-18,110],[-8,116],[2,118],[12,114],[22,104],[30,88],[-32,76]].map(([dx,dy])=>`<path d="M190 24 Q${190+dx*.4} ${24+dy*.5} ${190+dx} ${24+dy}" class="o"/>`).join("")+
  `<line x1="262" y1="16" x2="262" y2="128" class="o" style="stroke-width:5"/>`+[[40,-20],[60,22],[78,-24],[96,20],[110,-14]].map(([y,dx])=>L(262,y,262+dx,y+14,"o")).join("")+
  T(40,166,"A")+T(115,166,"B")+T(190,166,"C")+T(262,166,"D"));
const bioClass=[plantTree,plantTree,plantTree,
  Q("図の A のような葉脈を何という？|What is the vein pattern in A called?|像圖中 A 的葉脈叫做？","平行脈|Parallel veins|平行脈",
    [["網状脈|Net veins|網狀脈","網状脈は B のように網の目になった葉脈です。|Net veins form a mesh like B.|網狀脈是像 B 那樣呈網狀的葉脈。"],["ひげ根|Fibrous roots|鬚根","ひげ根は C のような根のようすです。|Fibrous roots look like C.|鬚根是像 C 那樣的根。"],["主根|Taproot|主根","主根は D の太い根です。|The taproot is the thick root in D.|主根是 D 中粗的根。"]],
    "平行脈（A）は単子葉類、網状脈（B）は双子葉類。|Parallel veins (A): monocots. Net veins (B): dicots.|平行脈（A）是單子葉植物，網狀脈（B）是雙子葉植物。",FIG_LR),
  Q("図の B のような葉脈をもつ植物のなかまは？|Plants with leaves like B are…|葉脈像圖中 B 的植物屬於？","双子葉類|Dicots|雙子葉植物",
    [["単子葉類|Monocots|單子葉植物","単子葉類の葉脈は A のような平行脈です。|Monocots have parallel veins like A.|單子葉植物是像 A 的平行脈。"],["裸子植物|Gymnosperms|裸子植物","葉脈のようすで分けるのは、単子葉類と双子葉類です。|Vein patterns separate monocots and dicots.|用葉脈區分的是單子葉和雙子葉植物。"],["シダ植物|Ferns|蕨類植物","網状脈は双子葉類の特徴です。|Net veins are a dicot feature.|網狀脈是雙子葉植物的特徵。"]],
    "双子葉類：子葉2枚・網状脈・主根と側根。|Dicots: 2 seed leaves, net veins, taproot + side roots.|雙子葉植物：子葉2片、網狀脈、主根和側根。",FIG_LR),
  Q("図の C のような根を何という？|What are roots like C called?|像圖中 C 的根叫做？","ひげ根|Fibrous roots|鬚根",
    [["主根|Taproot|主根","主根は D のまん中の太い根です。|The taproot is the thick central root in D.|主根是 D 中間粗的根。"],["側根|Side roots|側根","側根は主根から出る細い根です。|Side roots branch from the taproot.|側根是從主根長出的細根。"],["平行脈|Parallel veins|平行脈","平行脈は葉のすじ（葉脈）のようすです。|Parallel veins are a leaf pattern.|平行脈是葉脈的樣子。"]],
    "ひげ根（C）は単子葉類、主根と側根（D）は双子葉類。|Fibrous roots (C): monocots. Taproot + side roots (D): dicots.|鬚根（C）是單子葉植物，主根和側根（D）是雙子葉植物。",FIG_LR),
  Q("単子葉類の特徴の組み合わせは？|Which set describes monocots?|單子葉植物的特徵組合是？","子葉1枚・平行脈・ひげ根|1 seed leaf, parallel veins, fibrous roots|子葉1片・平行脈・鬚根",
    [["子葉2枚・網状脈・主根と側根|2 seed leaves, net veins, taproot|子葉2片・網狀脈・主根和側根","それは双子葉類の特徴です。|Those are dicot features.|那是雙子葉植物的特徵。"],["子葉1枚・網状脈・主根と側根|1 seed leaf, net veins, taproot|子葉1片・網狀脈・主根和側根","単子葉類の葉脈は平行脈、根はひげ根です。|Monocots have parallel veins and fibrous roots.|單子葉植物是平行脈、鬚根。"],["子葉2枚・平行脈・ひげ根|2 seed leaves, parallel veins, fibrous roots|子葉2片・平行脈・鬚根","単子葉類の子葉は1枚です。|Monocots have one seed leaf.|單子葉植物的子葉是1片。"]],
    "単子葉類：子葉1枚・平行脈・ひげ根（イネ・トウモロコシ・ユリ）。|Monocots: 1 seed leaf, parallel veins, fibrous roots (rice, corn, lily).|單子葉植物：子葉1片・平行脈・鬚根（稻、玉米、百合）。"),
  Q("単子葉類はどれ？|Which is a monocot?|哪一個是單子葉植物？","トウモロコシ|Corn|玉米",
    [["アブラナ|Rapeseed|油菜","アブラナは双子葉類（離弁花類）です。|Rapeseed is a dicot (free petals).|油菜是雙子葉植物（離瓣花類）。"],["タンポポ|Dandelion|蒲公英","タンポポは双子葉類（合弁花類）です。|Dandelion is a dicot (fused petals).|蒲公英是雙子葉植物（合瓣花類）。"],["エンドウ|Pea|豌豆","エンドウは双子葉類（離弁花類）です。|Pea is a dicot (free petals).|豌豆是雙子葉植物（離瓣花類）。"]],
    "単子葉類の例：イネ・トウモロコシ・ユリ・ツユクサ。|Monocots: rice, corn, lily, dayflower.|單子葉植物：稻、玉米、百合、鴨跖草。"),
  Q("合弁花類はどれ？|Which has fused petals?|哪一個是合瓣花類？","アサガオ|Morning glory|牽牛花",
    [["アブラナ|Rapeseed|油菜","アブラナは花弁が4枚に離れている離弁花類です。|Rapeseed has 4 separate petals.|油菜的4片花瓣分開，是離瓣花類。"],["サクラ|Cherry|櫻花","サクラは花弁が離れている離弁花類です。|Cherry petals are separate.|櫻花的花瓣分開，是離瓣花類。"],["エンドウ|Pea|豌豆","エンドウは離弁花類です。|Pea has separate petals.|豌豆是離瓣花類。"]],
    "合弁花類：アサガオ・ツツジ・タンポポ。離弁花類：アブラナ・サクラ・エンドウ。|Fused: morning glory, azalea, dandelion. Free: rapeseed, cherry, pea.|合瓣花類：牽牛花、杜鵑、蒲公英。離瓣花類：油菜、櫻花、豌豆。"),
  Q("被子植物と裸子植物を分ける特徴は？|What separates angiosperms from gymnosperms?|區分被子植物和裸子植物的特徵是？","胚珠が子房の中にあるかどうか|Whether the ovules are inside an ovary|胚珠是否包在子房裡",
    [["子葉の数|Number of seed leaves|子葉的數目","子葉の数で分けるのは単子葉類と双子葉類です。|That separates monocots and dicots.|用子葉數目區分的是單子葉和雙子葉。"],["花弁がくっついているかどうか|Whether petals are joined|花瓣是否相連","それは合弁花類と離弁花類の分け方です。|That separates fused and free petals.|那是合瓣花類和離瓣花類的區分方法。"],["種子をつくるかどうか|Whether they make seeds|是否產生種子","どちらも種子をつくる種子植物です。|Both make seeds.|兩者都是會產生種子的種子植物。"]],
    "被子：胚珠が子房の中。裸子：胚珠がむき出し。|Angiosperms: ovules in an ovary. Gymnosperms: bare ovules.|被子：胚珠在子房內。裸子：胚珠裸露。"),
];

// 種子をつくらない植物：見分け方の図（1つかくす）
const KEY_N=["種子植物|Seed plants|種子植物","シダ植物|Ferns|蕨類植物","コケ植物|Mosses|苔蘚植物"];
function keyFig(h){ const box=(x,y,w,s,on)=>`<rect x="${x-w/2}" y="${y-13}" width="${w}" height="26" rx="6" class="${on?"ac":"bx"}"/>`+T(x,y+4,s,on?"lb":"sm");
  const yes=X("はい|Yes|是"),no=X("いいえ|No|否");
  return SV(320,200,box(110,20,190,X("種子をつくる？|Makes seeds?|產生種子？"),false)+L(70,33,50,72,"o")+L(150,33,210,72,"o")+T(46,56,yes,"xs")+T(196,52,no,"xs")+
    box(50,86,92,h===0?"A":X(KEY_N[0]),h===0)+box(210,86,190,X("根・茎・葉の区別がある？|Has roots, stems, leaves?|有根、莖、葉的區別？"),false)+
    L(170,99,140,140,"o")+L(250,99,270,140,"o")+T(140,124,yes,"xs")+T(280,124,no,"xs")+
    box(140,154,92,h===1?"A":X(KEY_N[1]),h===1)+box(266,154,92,h===2?"A":X(KEY_N[2]),h===2)); }
function plantKey(){ const h=R(0,2); const fig=keyFig(h); const ws=[0,1,2].filter(i=>i!==h).map(i=>({v:X(KEY_N[i]),why:X(`${X(KEY_N[i])}は図の別の場所です。「はい・いいえ」をたどり直そう。|${X(KEY_N[i])} is elsewhere in the chart. Follow the Yes/No again.|${X(KEY_N[i])}在圖中別的位置，重新沿著「是・否」走一次。`)}));
  ws.push({v:X("裸子植物|Gymnosperms|裸子植物"),why:X("裸子植物は種子をつくるので「種子植物」の中のなかまです。|Gymnosperms make seeds, so they are inside \"seed plants\".|裸子植物會產生種子，屬於種子植物的一部分。")});
  return {q:X("図の A に入るなかまは？|Which group goes in box A?|圖中 A 應填入哪一類？")+fig,ans:X(KEY_N[h]),wrongs:ws,exp:X("種子をつくらない植物のうち、根・茎・葉の区別があるのがシダ植物、ないのがコケ植物。|Of plants without seeds, ferns have roots, stems and leaves; mosses don't.|不產生種子的植物中，有根莖葉區別的是蕨類，沒有的是苔蘚。"),tf:v=>X("図の A は|Box A is|圖中的 A 是")+fig+`→ ${v}`,kind:"fig"}; }
const bioSpore=[plantKey,plantKey,
  Q("シダ植物やコケ植物は何でふえる？|How do ferns and mosses reproduce?|蕨類和苔蘚靠什麼繁殖？","胞子|Spores|孢子",
    [["種子|Seeds|種子","種子でふえるのは種子植物です。|Seed plants use seeds.|用種子繁殖的是種子植物。"],["花粉|Pollen|花粉","花粉は種子植物の花でつくられます。|Pollen is made by flowers of seed plants.|花粉是種子植物的花製造的。"],["胚珠|Ovules|胚珠","胚珠は種子植物の花の中にあります。|Ovules are in the flowers of seed plants.|胚珠在種子植物的花裡。"]],
    "シダ植物・コケ植物は花をさかせず、胞子でふえる。|Ferns and mosses don't flower; they use spores.|蕨類和苔蘚不開花，用孢子繁殖。"),
  Q("胞子が入っているふくろを何という？|What is the sac holding spores called?|裝孢子的囊叫做？","胞子のう|Sporangium|孢子囊",
    [["花粉のう|Pollen sac|花粉囊","花粉のうはマツの雄花などにあり、花粉が入っています。|Pollen sacs hold pollen (e.g. pine).|花粉囊裡裝的是花粉（例如松樹）。"],["子房|Ovary|子房","子房は被子植物のめしべのもとです。|The ovary is the base of a pistil.|子房是被子植物雌蕊的基部。"],["仮根|Rhizoid|假根","仮根はコケ植物の根のような部分です。|Rhizoids are root-like parts of mosses.|假根是苔蘚像根的部分。"]],
    "胞子は胞子のうの中でつくられる。|Spores form inside sporangia.|孢子在孢子囊裡形成。"),
  Q("シダ植物の特徴は？|What is true of ferns?|蕨類植物的特徵是？","根・茎・葉の区別がある|They have roots, stems and leaves|有根、莖、葉的區別",
    [["根・茎・葉の区別がない|No roots, stems or leaves|沒有根、莖、葉的區別","それはコケ植物の特徴です。|That is mosses.|那是苔蘚的特徵。"],["花をさかせて種子をつくる|They flower and make seeds|開花產生種子","シダ植物は花をさかせず、胞子でふえます。|Ferns have no flowers; they use spores.|蕨類不開花，用孢子繁殖。"],["体の表面全体から水を吸収する|They take in water through the whole surface|從整個身體表面吸水","それはコケ植物です。シダ植物は根から吸収します。|That is mosses; ferns use roots.|那是苔蘚，蕨類用根吸水。"]],
    "シダ植物：根・茎・葉の区別あり、胞子でふえる（イヌワラビ・スギナ）。|Ferns: roots, stems, leaves; spores (e.g. lady fern, horsetail).|蕨類：有根莖葉，用孢子繁殖（例如蹄蓋蕨、問荊）。"),
  Q("コケ植物の「仮根」のおもなはたらきは？|What do moss rhizoids mainly do?|苔蘚「假根」的主要功能是？","体を地面などに固定する|Hold the plant to the ground|把身體固定在地面等處",
    [["水を吸収する|Absorb water|吸收水分","コケ植物は水を体の表面全体から吸収します。|Mosses absorb water through their whole surface.|苔蘚從整個身體表面吸收水分。"],["胞子をつくる|Make spores|製造孢子","胞子は胞子のうでつくられます。|Spores form in sporangia.|孢子在孢子囊中形成。"],["栄養分をたくわえる|Store food|儲存養分","仮根は体を固定するためのものです。|Rhizoids anchor the plant.|假根是用來固定身體的。"]],
    "コケ植物：根・茎・葉の区別なし。仮根で体を固定し、水は体の表面から。|Mosses: no true roots/stems/leaves; rhizoids anchor; water through the surface.|苔蘚：沒有根莖葉的區別，用假根固定，從表面吸水。"),
  Q("イヌワラビの茎はどこにある？|Where is the stem of a lady fern?|蹄蓋蕨的莖在哪裡？","地下（地下茎）|Underground (rhizome)|地下（地下莖）",
    [["地上にまっすぐ立っている|Standing up above ground|直立在地面上","地上に出ているのは葉です。茎は地下にあります。|What you see above ground are leaves; the stem is underground.|地面上的是葉，莖在地下。"],["葉の先|At the leaf tip|葉子的尖端","葉の先にあるのは葉の一部です。|The tip is part of the leaf.|葉尖是葉子的一部分。"],["茎はない|It has no stem|沒有莖","シダ植物には根・茎・葉の区別があります。|Ferns do have stems.|蕨類有根、莖、葉的區別。"]],
    "イヌワラビは地下茎。地上に出ているのは葉。|Lady fern: the stem is a rhizome; above ground is leaves.|蹄蓋蕨的莖是地下莖，地面上的是葉。"),
  Q("ゼニゴケで、胞子のうがあるのは？|In liverworts (Marchantia), where are the sporangia?|地錢的孢子囊在哪一株？","雌株|Female plants|雌株",
    [["雄株|Male plants|雄株","雄株は精子をつくります。胞子のうは雌株です。|Male plants make sperm; sporangia are on females.|雄株產生精子，孢子囊在雌株。"],["両方|Both|兩者都有","胞子のうができるのは雌株だけです。|Only female plants make sporangia.|只有雌株會形成孢子囊。"],["仮根|The rhizoids|假根","仮根は体を固定する部分です。|Rhizoids anchor the plant.|假根是固定身體的部分。"]],
    "ゼニゴケ・スギゴケは雌株と雄株があり、雌株に胞子のうができる。|Liverworts/mosses have male and female plants; sporangia form on females.|地錢、杉葉蘚分雌株和雄株，雌株會形成孢子囊。"),
  Q("シダ植物はどれ？|Which is a fern?|哪一個是蕨類植物？","スギナ|Horsetail|問荊",
    [["スギゴケ|Haircap moss|杉葉蘚","スギゴケはコケ植物です。|Haircap moss is a moss.|杉葉蘚是苔蘚。"],["スギ|Japanese cedar|日本柳杉","スギは種子をつくる裸子植物です。|Cedar is a seed-making gymnosperm.|柳杉是會產生種子的裸子植物。"],["ゼニゴケ|Liverwort|地錢","ゼニゴケはコケ植物です。|Liverwort is a moss plant.|地錢是苔蘚植物。"]],
    "シダ植物：イヌワラビ・スギナ・ゼンマイ。コケ植物：ゼニゴケ・スギゴケ。|Ferns: lady fern, horsetail, royal fern. Mosses: liverwort, haircap moss.|蕨類：蹄蓋蕨、問荊、紫萁。苔蘚：地錢、杉葉蘚。"),
];

// 動物の分類：特徴の表（1つかくす）
const ANI=["魚類|Fish|魚類","両生類|Amphibians|兩生類","は虫類|Reptiles|爬蟲類","鳥類|Birds|鳥類","哺乳類|Mammals|哺乳類"];
const ANI_R=[["呼吸|Breathing|呼吸",["えら|Gills|鰓","子:えら 親:肺|Young: gills→lungs|幼:鰓 成:肺","肺|Lungs|肺","肺|Lungs|肺","肺|Lungs|肺"],["気管|Tracheae|氣管"]],
  ["体表|Body cover|體表",["うろこ|Scales|鱗片","しめった皮膚|Moist skin|濕潤的皮膚","かたいうろこ|Hard scales|硬鱗片","羽毛|Feathers|羽毛","毛|Hair|毛"],[]],
  ["子のうまれ方|Birth|生殖方式",["卵（水中・殻なし）|Eggs in water|卵（水中・無殼）","卵（水中・殻なし）|Eggs in water|卵（水中・無殼）","卵（陸上・殻あり）|Shelled eggs, land|卵（陸上・有殼）","卵（陸上・殻あり）|Shelled eggs, land|卵（陸上・有殼）","胎生|Live birth|胎生"],["卵（陸上・殻なし）|Unshelled eggs, land|卵（陸上・無殼）"]]];
// 表は「なかま（行）× 特徴（列）」。A は r=特徴, c=なかま
function aniFig(r,c){ let b=""; const x0=70,cw=110,y0=26,rh=30;
  ANI_R.forEach(([rn],ri)=>{ b+=T(x0+cw*ri+cw/2,18,X(rn),"xs"); });
  ANI.forEach((n,ci)=>{ const y=y0+rh*ci; b+=`<rect x="2" y="${y}" width="${x0-4}" height="${rh-4}" rx="4" class="bx"/>`+T(x0/2,y+rh/2+2,X(n),"xs");
    ANI_R.forEach(([,cells],ri)=>{ const on=ri===r&&ci===c; b+=`<rect x="${x0+cw*ri+2}" y="${y}" width="${cw-4}" height="${rh-4}" rx="4" class="${on?"ac":"bx"}"/>`+T(x0+cw*ri+cw/2,y+rh/2+2,on?"A":X(cells[ci]),on?"lb":"xs"); }); });
  return SV(x0+cw*3+4,y0+rh*5+4,b); }
function aniTable(){ const r=R(0,2),c=R(0,4); const [rn,cells,extra]=ANI_R[r]; const ans=X(cells[c]); const fig=aniFig(r,c);
  const opts=[...new Set([...cells.map(X),...extra.map(X)])].filter(v=>v!==ans);
  const ws=shuf(opts).slice(0,3).map(v=>{ const who=cells.map((x,i)=>X(x)===v?X(ANI[i]):null).filter(Boolean);
    return {v,why:who.length?X(`「${v}」は${who.join("・")}の特徴です。|"${v}" fits ${who.join(", ")}.|「${v}」是${who.join("、")}的特徵。`):X(`「${v}」は脊椎動物のなかまの特徴ではありません。|"${v}" is not a feature of these vertebrates.|「${v}」不是這些脊椎動物的特徵。`)}; });
  return {q:X(`表の A に入るのは？（${X(ANI[c])}の${X(rn)}）|What goes in A? (${X(rn)} of ${X(ANI[c])})|表中 A 應填入什麼？（${X(ANI[c])}的${X(rn)}）`)+fig,ans,wrongs:ws,
    exp:X(`${X(ANI[c])}の${X(rn)}は「${ans}」。|${X(ANI[c])}: ${X(rn).toLowerCase()} = "${ans}".|${X(ANI[c])}的${X(rn)}是「${ans}」。`),tf:v=>X("表の A は|A in the table is|表中的 A 是")+fig+`→ ${v}`,kind:"fig"}; }
const bioAnimal=[aniTable,aniTable,aniTable,aniTable,
  Q("背骨をもつ動物を何という？|Animals with a backbone are called…|有脊椎骨的動物叫做？","脊椎動物|Vertebrates|脊椎動物",
    [["無脊椎動物|Invertebrates|無脊椎動物","無脊椎動物は背骨をもたない動物です。|Invertebrates have no backbone.|無脊椎動物沒有脊椎骨。"],["節足動物|Arthropods|節肢動物","節足動物は外骨格をもつ無脊椎動物です。|Arthropods are invertebrates with exoskeletons.|節肢動物是有外骨骼的無脊椎動物。"],["軟体動物|Mollusks|軟體動物","軟体動物は外とう膜をもつ無脊椎動物です。|Mollusks are invertebrates with a mantle.|軟體動物是有外套膜的無脊椎動物。"]],
    "脊椎動物：魚類・両生類・は虫類・鳥類・哺乳類の5つのなかま。|Vertebrates: fish, amphibians, reptiles, birds, mammals.|脊椎動物：魚類、兩生類、爬蟲類、鳥類、哺乳類。"),
  Q("クジラは何類？|What kind of animal is a whale?|鯨魚屬於哪一類？","哺乳類|Mammal|哺乳類",
    [["魚類|Fish|魚類","クジラはえらではなく肺で呼吸します。|Whales breathe with lungs, not gills.|鯨魚用肺呼吸，不是鰓。"],["両生類|Amphibian|兩生類","クジラは子を乳で育てる胎生です。|Whales give live birth and feed milk.|鯨魚是胎生，用乳汁哺育。"],["は虫類|Reptile|爬蟲類","クジラは卵ではなく子をうみます。|Whales give birth to live young.|鯨魚不是生蛋，是生小孩。"]],
    "クジラ・イルカは海にすむが、肺で呼吸し胎生なので哺乳類。|Whales and dolphins live in the sea but breathe air and give live birth: mammals.|鯨魚、海豚住在海裡，但用肺呼吸、胎生，是哺乳類。"),
  Q("「胎生」とはどんなうまれ方？|What is live birth (viviparity)?|什麼是「胎生」？","母親の体内である程度育ってからうまれる|Young grow inside the mother before birth|在母體內發育到某個程度後才出生",
    [["殻のある卵からうまれる|Hatching from shelled eggs|從有殼的蛋孵出","それは卵生（は虫類・鳥類）です。|That is egg-laying (reptiles, birds).|那是卵生（爬蟲類、鳥類）。"],["水中の殻のない卵からうまれる|Hatching from eggs in water|從水中無殼的卵孵出","それは卵生（魚類・両生類）です。|That is egg-laying (fish, amphibians).|那是卵生（魚類、兩生類）。"],["親の体が2つに分かれてふえる|The parent splits in two|親代身體分成兩個","それは分裂といい、単細胞生物などのふえ方です。|That is fission (single-celled organisms).|那叫分裂，是單細胞生物等的繁殖方式。"]],
    "哺乳類は胎生。魚類・両生類・は虫類・鳥類は卵生。|Mammals: live birth. Fish, amphibians, reptiles, birds: eggs.|哺乳類是胎生；魚類、兩生類、爬蟲類、鳥類是卵生。"),
  Q("肉食動物の歯の特徴は？|What is special about a carnivore's teeth?|肉食動物牙齒的特徵是？","犬歯が大きくするどい|Large, sharp canines|犬齒大而尖銳",
    [["臼歯が平らで大きい|Large flat molars|臼齒平而大","草をすりつぶす平らな臼歯は草食動物の特徴です。|Flat grinding molars are for plant eaters.|磨碎草的平臼齒是草食動物的特徵。"],["門歯だけがある|Only incisors|只有門齒","肉食動物は犬歯で獲物をとらえます。|Carnivores catch prey with canines.|肉食動物用犬齒捕捉獵物。"],["歯がない|No teeth|沒有牙齒","肉食動物には犬歯や臼歯があります。|Carnivores have canines and molars.|肉食動物有犬齒和臼齒。"]],
    "肉食：犬歯で獲物をとらえ、臼歯で肉をさく。草食：門歯で草をかみ切り、臼歯ですりつぶす。|Carnivores: canines catch, molars tear. Herbivores: incisors cut, molars grind.|肉食：犬齒捕捉、臼齒撕肉。草食：門齒切草、臼齒磨碎。"),
  Q("草食動物の目が顔の横向きについている利点は？|Why are a herbivore's eyes on the sides of its head?|草食動物的眼睛長在臉的兩側有什麼好處？","広い範囲を見わたして敵を見つけやすい|They can see a wide area and spot enemies|能看見大範圍，容易發現敵人",
    [["立体的に見える範囲が広く、距離をつかみやすい|Wide 3D vision to judge distance|立體視野廣，容易判斷距離","それは目が前向きの肉食動物の利点です。|That is the benefit of forward eyes (carnivores).|那是眼睛朝前的肉食動物的優點。"],["暗いところでも色が見える|They see color in the dark|在暗處也能看到顏色","目のつき方は見える範囲に関係します。|Eye position affects the field of view.|眼睛的位置和視野範圍有關。"],["遠くの獲物を追いかけやすい|Easy to chase prey far away|容易追趕遠方的獵物","獲物を追うのは肉食動物です。|Chasing prey is what carnivores do.|追獵物的是肉食動物。"]],
    "草食：目が横向き → 視野が広い。肉食：目が前向き → 立体的に見えて距離がわかる。|Herbivores: side eyes, wide view. Carnivores: front eyes, depth perception.|草食：眼睛在兩側→視野廣。肉食：眼睛朝前→看得立體、能判斷距離。"),
  Q("昆虫のあしは体のどこに、何本ついている？|Where are an insect's legs, and how many?|昆蟲的腳長在身體哪裡？有幾隻？","胸部に6本|6 on the thorax|胸部，6隻",
    [["腹部に6本|6 on the abdomen|腹部，6隻","あしがついているのは胸部です。|Legs attach to the thorax.|腳長在胸部。"],["胸部に8本|8 on the thorax|胸部，8隻","8本あしはクモのなかまです（昆虫ではない）。|8 legs is spiders, not insects.|8隻腳是蜘蛛類（不是昆蟲）。"],["頭部に4本|4 on the head|頭部，4隻","頭部には触角や口があります。|The head has antennae and mouth.|頭部有觸角和口。"]],
    "昆虫：頭部・胸部・腹部。胸部に6本のあし。|Insects: head, thorax, abdomen; 6 legs on the thorax.|昆蟲：頭部、胸部、腹部；胸部有6隻腳。"),
  Q("イカやアサリのように、内臓が外とう膜でおおわれている動物は？|Animals like squid and clams with organs covered by a mantle are…|像烏賊、蛤蜊那樣內臟被外套膜包住的動物是？","軟体動物|Mollusks|軟體動物",
    [["節足動物|Arthropods|節肢動物","節足動物は外骨格と節のあるあしをもちます（エビ・バッタ）。|Arthropods have exoskeletons and jointed legs.|節肢動物有外骨骼和有節的腳（蝦、蝗蟲）。"],["哺乳類|Mammals|哺乳類","哺乳類は背骨のある脊椎動物です。|Mammals are vertebrates.|哺乳類是有脊椎的脊椎動物。"],["魚類|Fish|魚類","魚類は背骨のある脊椎動物です。|Fish are vertebrates.|魚類是脊椎動物。"]],
    "軟体動物：外とう膜があり、背骨や節がない（イカ・タコ・アサリ・マイマイ）。|Mollusks: mantle, no backbone or joints (squid, octopus, clam, snail).|軟體動物：有外套膜，沒有脊椎和節（烏賊、章魚、蛤蜊、蝸牛）。"),
  Q("エビやカニのからだの外側をおおう、かたい殻を何という？|What is the hard outer shell of shrimp and crabs?|蝦、蟹身體外面堅硬的殼叫做？","外骨格|Exoskeleton|外骨骼",
    [["外とう膜|Mantle|外套膜","外とう膜は軟体動物の内臓をおおう膜です。|The mantle covers mollusk organs.|外套膜是包覆軟體動物內臟的膜。"],["背骨|Backbone|脊椎骨","エビやカニは背骨のない無脊椎動物です。|Shrimp and crabs have no backbone.|蝦、蟹是沒有脊椎骨的無脊椎動物。"],["うろこ|Scales|鱗片","うろこは魚類やは虫類の体表です。|Scales cover fish and reptiles.|鱗片是魚類和爬蟲類的體表。"]],
    "節足動物：外骨格があり、体とあしに節がある（昆虫類・甲殻類）。|Arthropods: exoskeleton, jointed body and legs (insects, crustaceans).|節肢動物：有外骨骼，身體和腳有節（昆蟲類、甲殼類）。"),
];
