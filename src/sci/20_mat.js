/* ========== ② 身の回りの物質（第1分野(2)） ========== */
// ガスバーナー：A 空気調節ねじ（上） B ガス調節ねじ（下）
const FIG_GB=SV(220,220,`<path d="M100 38 Q92 18 100 4 Q108 18 100 38 Z" class="ac"/><path d="M100 36 Q96 26 100 18 Q104 26 100 36 Z" class="kf"/>`+
  `<rect x="88" y="40" width="24" height="150" rx="2" class="os"/><rect x="80" y="118" width="40" height="16" rx="3" class="ac"/><rect x="83" y="150" width="34" height="13" rx="3" class="ac"/>`+
  `<rect x="112" y="172" width="58" height="10" rx="3" class="os"/><ellipse cx="100" cy="200" rx="54" ry="11" class="os"/>`+TAG(168,126,121,126,"A")+TAG(40,160,82,156,"B"));
const MV="|g/cm³|";   // 単位
const mat1=[
  ()=>{ const a=pick(["A","B"]); const nm={A:"空気調節ねじ|Air adjustment screw|空氣調節輪",B:"ガス調節ねじ|Gas adjustment screw|瓦斯調節輪"};
    return {q:X(`図のガスバーナーで、${a} のねじの名前は？|In the burner, what is screw ${a}?|圖中瓦斯燈的 ${a} 是？`)+FIG_GB,ans:X(nm[a]),
      wrongs:[{v:X(nm[a==="A"?"B":"A"]),why:X(`上が空気調節ねじ、下がガス調節ねじです。|The upper one adjusts air, the lower one gas.|上面是空氣調節輪，下面是瓦斯調節輪。`)},{v:X("元栓|Main gas valve|總開關"),why:X("元栓はガス管の口にある栓です。|The main valve is at the gas outlet.|總開關在瓦斯管的出口。")},{v:X("コック|Cock (stopcock)|旋塞","コック"),why:X("コックはバーナーにつながるガスの通り道を開け閉めするものです。|The cock opens the gas line to the burner.|旋塞是開關通往燈的瓦斯通道。")}],
      exp:X("上：空気調節ねじ（炎の色）、下：ガス調節ねじ（炎の大きさ）。|Upper: air (flame color). Lower: gas (flame size).|上：空氣調節輪（火焰顏色），下：瓦斯調節輪（火焰大小）。"),tf:v=>X(`図の ${a} は|Screw ${a} is|圖中的 ${a} 是`)+FIG_GB+`→ ${v}`,kind:"fig"}; },
  Q("ガスバーナーの炎がオレンジ色でゆらゆらしている。どうする？|The flame is orange and flickering. What do you do?|瓦斯燈的火焰是橘色、搖搖晃晃。該怎麼做？","空気調節ねじを開いて空気を入れ、青い炎にする|Open the air screw to make a blue flame|打開空氣調節輪讓空氣進入，變成藍色火焰",
    [["ガス調節ねじを開いてガスを増やす|Open the gas screw for more gas|打開瓦斯調節輪增加瓦斯","ガスを増やすと炎が大きくなるだけで、空気は足りないままです。|More gas only makes it bigger; air is still lacking.|增加瓦斯只會讓火焰變大，空氣還是不足。"],["空気調節ねじを閉めて空気を減らす|Close the air screw|關緊空氣調節輪","空気が足りないのでオレンジ色になっています。減らすと逆です。|It is orange because air is lacking.|是因為空氣不足才變橘色，減少空氣會更糟。"],["すぐに元栓を閉める|Close the main valve at once|馬上關掉總開關","火を消す必要はありません。空気を調節します。|No need to turn it off; adjust the air.|不必熄火，調節空氣就好。"]],
    "オレンジ色の炎＝空気不足。空気調節ねじを開いて青い炎に。|Orange flame = not enough air. Open the air screw for a blue flame.|橘色火焰＝空氣不足。打開空氣調節輪變成藍色火焰。",FIG_GB),
  Q("有機物の説明で正しいのは？|Which describes organic matter?|關於有機物，正確的是？","炭素をふくみ、燃えると二酸化炭素が出る|Contains carbon; burning gives carbon dioxide|含有碳，燃燒會產生二氧化碳",
    [["燃えると酸素が出る|Burning gives oxygen|燃燒會產生氧氣","燃えるときは酸素が使われ、二酸化炭素と水ができます。|Burning uses oxygen and makes CO₂ and water.|燃燒時會消耗氧氣，產生二氧化碳和水。"],["電気をよく通す|Conducts electricity well|很容易導電","電気をよく通すのは金属の性質です。|Conducting electricity is a metal property.|導電是金屬的性質。"],["燃えずに白い粉が残る|Doesn't burn; white powder remains|不會燃燒，留下白色粉末","それは食塩などの無機物です。|That is inorganic matter like salt.|那是食鹽等無機物。"]],
    "有機物：炭素をふくむ（砂糖・デンプン・ロウ・プラスチック）。燃えて二酸化炭素と水ができる。|Organic: contains carbon (sugar, starch, wax, plastic). Burns into CO₂ and water.|有機物：含碳（糖、澱粉、蠟、塑膠），燃燒產生二氧化碳和水。"),
  Q("有機物はどれ？|Which is organic matter?|哪一個是有機物？","砂糖|Sugar|砂糖",
    [["食塩|Salt|食鹽","食塩は燃えない無機物です。|Salt doesn't burn: inorganic.|食鹽不會燃燒，是無機物。"],["ガラス|Glass|玻璃","ガラスは無機物です。|Glass is inorganic.|玻璃是無機物。"],["鉄|Iron|鐵","鉄は金属で、無機物です。|Iron is a metal: inorganic.|鐵是金屬，屬於無機物。"]],
    "有機物：砂糖・デンプン・ロウ・エタノール・プラスチック・木。|Organic: sugar, starch, wax, ethanol, plastic, wood.|有機物：砂糖、澱粉、蠟、酒精、塑膠、木頭。"),
  Q("金属に共通する性質ではないものは？|Which is NOT shared by all metals?|哪一個不是金屬共同的性質？","磁石につく|Sticks to a magnet|會被磁鐵吸引",
    [["電気をよく通す|Conducts electricity|容易導電","電気をよく通すのはすべての金属の性質です。|All metals conduct electricity.|所有金屬都容易導電。"],["みがくと光る（金属光沢）|Shiny when polished|磨過會發亮（金屬光澤）","金属光沢はすべての金属にあります。|All metals have luster.|所有金屬都有金屬光澤。"],["たたくと広がり、引っぱるとのびる|Can be hammered flat and stretched|敲打會延展、拉扯會伸長","展性・延性はすべての金属の性質です。|All metals are malleable and ductile.|延展性是所有金屬的性質。"]],
    "磁石につくのは鉄など一部の金属だけ。アルミニウムや銅はつかない。|Only some metals like iron stick to magnets; aluminum and copper don't.|只有鐵等部分金屬會被磁鐵吸，鋁和銅不會。"),
  Q("砂糖・食塩・デンプンのうち、水にとけにくく、ヨウ素液で青紫色になるのは？|Of sugar, salt and starch, which barely dissolves and turns blue-purple with iodine?|砂糖、食鹽、澱粉中，不易溶於水、遇碘液變藍紫色的是？","デンプン|Starch|澱粉",
    [["砂糖|Sugar|砂糖","砂糖は水によくとけます。|Sugar dissolves well.|砂糖很容易溶於水。"],["食塩|Salt|食鹽","食塩は水によくとけ、ヨウ素液に反応しません。|Salt dissolves and doesn't react with iodine.|食鹽易溶於水，不和碘液反應。"],["どれも青紫色になる|All turn blue-purple|全部都會變藍紫色","ヨウ素液で青紫色になるのはデンプンだけです。|Only starch turns blue-purple.|只有澱粉遇碘液會變藍紫色。"]],
    "白い粉の見分け方：加熱してこげる→砂糖かデンプン、水にとけにくい・ヨウ素液→デンプン。|White powders: burns black → sugar or starch; insoluble + iodine → starch.|白色粉末的分辨：加熱燒焦→糖或澱粉，不溶於水、遇碘液→澱粉。"),
  Q("「物質」を表しているのはどれ？|Which word names a substance (material)?|哪一個表示「物質」？","ガラス|Glass|玻璃",
    [["コップ|Cup|杯子","コップは形や大きさで見たときの「物体」です。|A cup is an object (by shape and use).|杯子是從形狀、用途來看的「物體」。"],["机|Desk|桌子","机は物体です。材料（木など）が物質です。|A desk is an object; its material (wood) is the substance.|桌子是物體，材料（木頭等）才是物質。"],["ボール|Ball|球","ボールは物体です。|A ball is an object.|球是物體。"]],
    "物体：形や大きさで見たもの（コップ）。物質：材料で見たもの（ガラス）。|Object: by shape/use (cup). Substance: by material (glass).|物體：從形狀、用途看（杯子）。物質：從材料看（玻璃）。"),
];

// 密度
const DEN=[["アルミニウム|aluminum|鋁",2.70],["亜鉛|zinc|鋅",7.13],["鉄|iron|鐵",7.87],["銅|copper|銅",8.96],["銀|silver|銀",10.50],["鉛|lead|鉛",11.35],["金|gold|金",19.32]];
const dU=" g/cm³";
const DEN_EXP=(m,V,d)=>X(`密度 ＝ 質量 ÷ 体積 ＝ ${m} ÷ ${V} ＝ ${d} g/cm³|Density = mass ÷ volume = ${m} ÷ ${V} = ${d} g/cm³|密度 ＝ 質量 ÷ 體積 ＝ ${m} ÷ ${V} ＝ ${d} g/cm³`);
function denCalc(){ const [n,d]=pick(DEN); const V=pick([10,20,30,40,50]); const m=fm(d*V);
  return C(X(`質量 ${m} g、体積 ${V} cm³ の金属の密度は？|A metal has mass ${m} g and volume ${V} cm³. Its density?|質量 ${m} g、體積 ${V} cm³ 的金屬，密度是？`),d,dU,
    [[V/m,X("わる順番が逆です。質量 ÷ 体積。|Divided the wrong way: mass ÷ volume.|除的順序相反：質量 ÷ 體積。")],[m*V,X("かけ算ではなく、わり算です。|Divide, don't multiply.|是除法，不是乘法。")],[m-V,X("ひき算ではなく、わり算です。|Divide, don't subtract.|是除法，不是減法。")]],DEN_EXP(m,V,fm(d))); }
function denMass(){ const [n,d]=pick(DEN); const V=pick([2,4,5,10,20]); const m=+(d*V).toFixed(2);
  return C(X(`密度 ${fm(d)} g/cm³ の金属 ${V} cm³ の質量は？|A metal with density ${fm(d)} g/cm³ and volume ${V} cm³. Its mass?|密度 ${fm(d)} g/cm³ 的金屬 ${V} cm³，質量是？`),m," g",
    [[d/V,X("質量 ＝ 密度 × 体積。わるのではなくかけます。|Mass = density × volume. Multiply.|質量 ＝ 密度 × 體積，要相乘。")],[V/d,X("質量 ＝ 密度 × 体積 です。|Mass = density × volume.|質量 ＝ 密度 × 體積。")],[d+V,X("たし算ではなく、かけ算です。|Multiply, don't add.|是乘法，不是加法。")]],
    X(`質量 ＝ 密度 × 体積 ＝ ${fm(d)} × ${V} ＝ ${fm(m)} g|Mass = density × volume = ${fm(d)} × ${V} = ${fm(m)} g|質量 ＝ 密度 × 體積 ＝ ${fm(d)} × ${V} ＝ ${fm(m)} g`)); }
function denVol(){ const [n,d]=pick(DEN); const V=pick([5,10,15,20,25]); const m=fm(d*V);
  return C(X(`密度 ${fm(d)} g/cm³ の金属が ${m} g ある。体積は？|A metal (density ${fm(d)} g/cm³) has mass ${m} g. Its volume?|密度 ${fm(d)} g/cm³ 的金屬有 ${m} g，體積是？`),V," cm³",
    [[m*d,X("体積 ＝ 質量 ÷ 密度。かけるのではなくわります。|Volume = mass ÷ density. Divide.|體積 ＝ 質量 ÷ 密度，要相除。")],[d/m,X("わる順番が逆です。質量 ÷ 密度。|Divided the wrong way: mass ÷ density.|除的順序相反：質量 ÷ 密度。")],[m-d,X("ひき算ではなく、わり算です。|Divide, don't subtract.|是除法，不是減法。")]],
    X(`体積 ＝ 質量 ÷ 密度 ＝ ${m} ÷ ${fm(d)} ＝ ${V} cm³|Volume = mass ÷ density = ${m} ÷ ${fm(d)} = ${V} cm³|體積 ＝ 質量 ÷ 密度 ＝ ${m} ÷ ${fm(d)} ＝ ${V} cm³`)); }
function denWhich(){ const four=shuf(DEN).slice(0,4); const [n,d]=four[0]; const V=pick([10,20,30,40]); const m=fm(d*V);
  let rows=""; four.slice().sort((a,b)=>a[1]-b[1]).forEach(([nn,dd],i)=>{ rows+=T(20,24+i*24,X(nn),"sm","start")+T(200,24+i*24,fm(dd)+" g/cm³","sm","end"); });
  const fig=SV(220,112,rows);
  return {q:X(`質量 ${m} g、体積 ${V} cm³ の金属は、表のどれ？|Which metal in the table has mass ${m} g and volume ${V} cm³?|質量 ${m} g、體積 ${V} cm³ 的金屬是表中的哪一個？`)+fig,ans:X(n),
    wrongs:four.slice(1).map(([nn,dd])=>({v:X(nn),why:X(`${X(nn)}の密度は ${fm(dd)} g/cm³。${m} ÷ ${V} ＝ ${fm(d)} g/cm³ です。|${X(nn)} is ${fm(dd)} g/cm³, but ${m} ÷ ${V} = ${fm(d)} g/cm³.|${X(nn)}的密度是 ${fm(dd)} g/cm³，而 ${m} ÷ ${V} ＝ ${fm(d)} g/cm³。`)})),
    exp:DEN_EXP(m,V,fm(d))+X("。密度は物質によって決まっているので、物質を見分けられる。|. Density is fixed for each substance, so it identifies the substance.|。密度依物質而定，所以可以用來分辨物質。"),tf:v=>X(`質量 ${m} g・体積 ${V} cm³ の金属は|The metal (${m} g, ${V} cm³) is|質量 ${m} g、體積 ${V} cm³ 的金屬是`)+fig+`→ ${v}`,kind:"fig"}; }
const FLOAT=[["氷|ice|冰",0.92],["ポリエチレン|polyethylene|聚乙烯",0.95],["ポリプロピレン|polypropylene|聚丙烯",0.90],["スギの木|cedar wood|杉木",0.38]],SINK=[["ポリスチレン|polystyrene|聚苯乙烯",1.06],["ポリ塩化ビニル|PVC|聚氯乙烯",1.40],["ガラス|glass|玻璃",2.50],["アルミニウム|aluminum|鋁",2.70],["鉄|iron|鐵",7.87]];
function denFloat(){ const up=Math.random()<.6; const a=pick(up?FLOAT:SINK); const others=shuf(up?SINK:FLOAT).slice(0,3); const lab=([n,d])=>`${X(n)}（${fm(d)}）`;
  return {q:X(up?"水（密度 1.00 g/cm³）に入れると浮くのは？（ ）は密度 g/cm³|Which floats in water (1.00 g/cm³)? (density in g/cm³)|放進水（密度 1.00 g/cm³）中會浮起來的是？（括號內為密度 g/cm³）":"水（密度 1.00 g/cm³）に入れると沈むのは？（ ）は密度 g/cm³|Which sinks in water (1.00 g/cm³)? (density in g/cm³)|放進水（密度 1.00 g/cm³）中會沉下去的是？（括號內為密度 g/cm³）"),ans:lab(a),
    wrongs:others.map(o=>({v:lab(o),why:X(up?`密度が水より大きい（${fm(o[1])} > 1.00）ので沈みます。|Denser than water (${fm(o[1])} > 1.00), so it sinks.|密度比水大（${fm(o[1])} > 1.00），所以會沉。`:`密度が水より小さい（${fm(o[1])} < 1.00）ので浮きます。|Less dense than water (${fm(o[1])} < 1.00), so it floats.|密度比水小（${fm(o[1])} < 1.00），所以會浮。`)})),
    exp:X("水より密度が小さい物質は浮き、大きい物質は沈む。|Less dense than water floats; denser sinks.|密度比水小的會浮，比水大的會沉。"),tf:v=>X(up?"水に浮くのは|This floats in water:|會浮在水上的是":"水に沈むのは|This sinks in water:|會沉入水中的是")+` ${v}`,kind:"word"}; }
// メスシリンダーの目盛り
function cylRead(){ const b=R(4,11)*5, v=b+R(1,8)*.5; const y=u=>190-(u-b)*30, Y=y(v);
  let tk=""; for(let i=0;i<=5;i++){ tk+=L(80,y(b+i),i%5?92:98,y(b+i),"o"); } tk+=T(72,y(b)+4,String(b),"sm","end")+T(72,y(b+5)+4,String(b+5),"sm","end");
  const fig=SV(200,215,`<path d="M80 ${Y-9} Q115 ${Y+9} 150 ${Y-9} L150 205 L80 205 Z" class="wa"/><path d="M80 ${Y-9} Q115 ${Y+9} 150 ${Y-9}" class="o"/>`+L(80,24,80,206,"o")+L(150,24,150,206,"o")+tk+T(175,y(b+2.5),"mL","sm"));
  const ans=v.toFixed(1); const ws=[[(v+.5).toFixed(1),"液面のへこんだ下の面を読みます。ふちの高いところではありません。|Read the bottom of the curved surface, not the edges.|要讀液面凹下去的最低處，不是邊緣。"],[String(Math.round(v+.01)),"最小目盛りの10分の1まで目分量で読みます（小数第1位まで）。|Estimate to 1/10 of the smallest division (one decimal).|要估讀到最小刻度的十分之一（小數第1位）。"],[(2*b+5-v).toFixed(1),"目盛りは下から上へ大きくなります。|The scale increases upward.|刻度是由下往上變大。"],[(v-1).toFixed(1),"目盛りを1つ数えまちがえています。|You miscounted one division.|刻度數錯了一格。"]].filter(([w])=>w!==ans&&w!==String(+ans));
  return {q:X("メスシリンダーの目盛りを読むと何 mL？|What is the reading in mL?|量筒的刻度是多少 mL？")+fig,ans:ans+" mL",wrongs:UQ(ans+" mL",ws.map(([w,why])=>({v:w+" mL",why:X(why)}))).slice(0,3),
    exp:X(`目の高さを液面にそろえ、へこんだ下の面を、最小目盛りの10分の1まで読む → ${ans} mL|Eye level with the surface; read the bottom of the curve to 1/10 of a division → ${ans} mL|視線與液面同高，讀凹面最低處，估讀到最小刻度的十分之一 → ${ans} mL`),tf:v=>X("目盛りは|The reading is|刻度是")+fig+`→ ${v}`,kind:"fig"}; }
function denDisp(){ const [n,d]=pick(DEN); const a=pick([40,50,60]),V=R(2,9); const m=fm(d*V),b=a+V;
  return C(X(`メスシリンダーに水を ${a}.0 cm³ 入れ、質量 ${m} g の金属を沈めると、目盛りが ${b}.0 cm³ になった。金属の密度は？|A cylinder holds ${a}.0 cm³ of water. Sinking a ${m} g metal raises it to ${b}.0 cm³. The metal's density?|量筒中裝水 ${a}.0 cm³，放入質量 ${m} g 的金屬後，刻度變成 ${b}.0 cm³。金屬的密度是？`),d,dU,
    [[m/b,X("体積は「ふえた分」です。水の体積をふくめません。|The volume is the increase only, not including the water.|體積是「增加的部分」，不包含水的體積。")],[m/a,X("体積は ふえた分（後 − 前）です。|Volume = after − before.|體積是增加的部分（後 − 前）。")],[V/m,X("わる順番が逆です。質量 ÷ 体積。|Divided the wrong way: mass ÷ volume.|除的順序相反：質量 ÷ 體積。")]],
    X(`体積 ＝ ${b} − ${a} ＝ ${V} cm³、密度 ＝ ${m} ÷ ${V} ＝ ${fm(d)} g/cm³|Volume = ${b} − ${a} = ${V} cm³, density = ${m} ÷ ${V} = ${fm(d)} g/cm³|體積 ＝ ${b} − ${a} ＝ ${V} cm³，密度 ＝ ${m} ÷ ${V} ＝ ${fm(d)} g/cm³`)); }
const mat2=[denCalc,denCalc,denMass,denVol,denWhich,denWhich,denFloat,cylRead,cylRead,denDisp];

// 気体の集め方：A 水上置換法 B 上方置換法 C 下方置換法
const FIG_GAS=SV(330,175,
  `<rect x="6" y="96" width="100" height="56" class="o"/><rect x="7" y="104" width="98" height="47" class="wa"/><path d="M56 128 L56 52 Q66 38 76 52 L76 128 Z" class="wa"/><path d="M56 128 L56 52 Q66 38 76 52 L76 128" class="o"/><path d="M0 76 L30 76 L30 140 L66 140 L66 124" class="o"/>`+
  `<path d="M150 112 L150 46 Q160 32 170 46 L170 112" class="o"/><path d="M120 150 L160 150 L160 52" class="o"/>`+
  `<path d="M260 36 L260 110 Q270 124 280 110 L280 36" class="o"/><path d="M228 18 L270 18 L270 108" class="o"/>`+T(56,170,"A")+T(160,170,"B")+T(270,170,"C"));
const GAS_NM={A:"水上置換法|Water displacement|排水集氣法",B:"上方置換法|Upward displacement|向下排空氣法",C:"下方置換法|Downward displacement|向上排空氣法"};
const GAS_DO={A:"水にとけにくい気体|gases that barely dissolve in water|難溶於水的氣體",B:"水にとけやすく、空気より軽い気体|soluble gases lighter than air|易溶於水、比空氣輕的氣體",C:"水にとけやすく、空気より重い気体|soluble gases heavier than air|易溶於水、比空氣重的氣體"};
function gasWay(){ const a=pick(["A","B","C"]); const ws=["A","B","C"].filter(k=>k!==a).map(k=>({v:X(GAS_NM[k]),why:X(`${X(GAS_NM[k])}は図の ${k}（${X(GAS_DO[k])}を集める）。|${X(GAS_NM[k])} is ${k} (for ${X(GAS_DO[k])}).|${X(GAS_NM[k])}是圖中的 ${k}（收集${X(GAS_DO[k])}）。`)}));
  ws.push({v:X("ろ過|Filtration|過濾"),why:X("ろ過は液体と固体を分ける方法です。|Filtration separates solids from liquids.|過濾是分離固體和液體的方法。")});
  return {q:X(`図の ${a} の気体の集め方を何という？|What is collection method ${a} called?|圖中 ${a} 的集氣法叫做？`)+FIG_GAS,ans:X(GAS_NM[a]),wrongs:ws,
    exp:X(`${a}：${X(GAS_NM[a])}。${X(GAS_DO[a])}を集める。|${a}: ${X(GAS_NM[a])}, for ${X(GAS_DO[a])}.|${a}：${X(GAS_NM[a])}，收集${X(GAS_DO[a])}。`),tf:v=>X(`図の ${a} は|Method ${a} is|圖中的 ${a} 是`)+FIG_GAS+`→ ${v}`,kind:"fig"}; }
const GN={O:"酸素|Oxygen|氧氣",C:"二酸化炭素|Carbon dioxide|二氧化碳",H:"水素|Hydrogen|氫氣",N:"アンモニア|Ammonia|氨",Z:"窒素|Nitrogen|氮氣"};
const gq=(q,a,ws,exp,fig)=>Q(q,GN[a],ws.map(([k,why])=>[GN[k],why]),exp,fig);
const mat3=[gasWay,gasWay,
  gq("二酸化マンガンにうすい過酸化水素水（オキシドール）を加えると発生する気体は？|Adding dilute hydrogen peroxide to manganese dioxide produces…|在二氧化錳中加入稀過氧化氫（雙氧水），產生的氣體是？","O",
    [["C","二酸化炭素は石灰石にうすい塩酸を加えると発生します。|CO₂ comes from limestone + dilute HCl.|二氧化碳是石灰石加稀鹽酸產生的。"],["H","水素は亜鉛などにうすい塩酸を加えると発生します。|Hydrogen comes from zinc + dilute HCl.|氫氣是鋅等加稀鹽酸產生的。"],["N","アンモニアは塩化アンモニウムと水酸化カルシウムを加熱して発生させます。|Ammonia comes from heating ammonium chloride + calcium hydroxide.|氨是加熱氯化銨和氫氧化鈣產生的。"]],
    "酸素：二酸化マンガン＋過酸化水素水。火のついた線香を入れると激しく燃える。|Oxygen: MnO₂ + H₂O₂. A glowing incense stick burns brightly.|氧氣：二氧化錳＋過氧化氫。放入點燃的線香會劇烈燃燒。"),
  gq("石灰石にうすい塩酸を加えると発生する気体は？|Adding dilute hydrochloric acid to limestone produces…|在石灰石中加入稀鹽酸，產生的氣體是？","C",
    [["O","酸素は二酸化マンガンと過酸化水素水で発生します。|Oxygen comes from MnO₂ + H₂O₂.|氧氣是二氧化錳加過氧化氫產生的。"],["H","水素は亜鉛や鉄などの金属にうすい塩酸を加えると発生します。|Hydrogen comes from metals like zinc + HCl.|氫氣是鋅、鐵等金屬加稀鹽酸產生的。"],["Z","窒素は空気中に多くふくまれる気体です。|Nitrogen is the main gas in air.|氮氣是空氣中含量最多的氣體。"]],
    "二酸化炭素：石灰石（貝殻・卵の殻）＋うすい塩酸。石灰水を白くにごらせる。|CO₂: limestone (shells) + dilute HCl. Turns limewater milky.|二氧化碳：石灰石（貝殼、蛋殼）＋稀鹽酸，使石灰水變白濁。"),
  gq("亜鉛にうすい塩酸を加えると発生する気体は？|Adding dilute hydrochloric acid to zinc produces…|在鋅中加入稀鹽酸，產生的氣體是？","H",
    [["C","塩酸で二酸化炭素が出るのは石灰石のときです。|HCl gives CO₂ with limestone, not zinc.|鹽酸加石灰石才會產生二氧化碳。"],["O","酸素は二酸化マンガンと過酸化水素水です。|Oxygen comes from MnO₂ + H₂O₂.|氧氣是二氧化錳加過氧化氫。"],["N","アンモニアは加熱して発生させます。|Ammonia is made by heating.|氨是加熱產生的。"]],
    "水素：亜鉛・鉄・マグネシウム＋うすい塩酸。火を近づけると音を立てて燃え、水ができる。|Hydrogen: zinc/iron/magnesium + dilute HCl. Pops with a flame and makes water.|氫氣：鋅、鐵、鎂＋稀鹽酸。靠近火會發出聲音燃燒，產生水。"),
  gq("石灰水を白くにごらせる気体は？|Which gas turns limewater milky?|會使石灰水變白濁的氣體是？","C",
    [["O","酸素は物を燃やすはたらきがあります。石灰水は変化しません。|Oxygen helps burning; limewater doesn't change.|氧氣有助燃性，石灰水不會變化。"],["H","水素は燃える気体です。石灰水は変化しません。|Hydrogen burns; limewater doesn't change.|氫氣是可燃氣體，石灰水不變。"],["Z","窒素は変化しにくい気体です。|Nitrogen is unreactive.|氮氣不容易起反應。"]],
    "二酸化炭素は石灰水を白くにごらせる。水に少しとけ、水溶液は酸性。|CO₂ turns limewater milky; dissolves a little; its solution is acidic.|二氧化碳使石灰水變白濁；稍溶於水，水溶液呈酸性。"),
  gq("火のついた線香を入れると、線香が激しく燃える気体は？|Which gas makes a glowing incense stick burn brightly?|放入點燃的線香會劇烈燃燒的氣體是？","O",
    [["C","二酸化炭素の中では線香の火は消えます。|In CO₂ the flame goes out.|在二氧化碳中線香的火會熄滅。"],["H","水素は自分が燃える気体です。物を燃やすはたらきはありません。|Hydrogen burns itself but doesn't help burning.|氫氣是自己會燃燒的氣體，沒有助燃性。"],["Z","窒素の中では火は消えます。|In nitrogen the flame goes out.|在氮氣中火會熄滅。"]],
    "酸素：物を燃やすはたらき（助燃性）がある。気体そのものは燃えない。|Oxygen supports burning but doesn't burn itself.|氧氣有助燃性，本身不會燃燒。"),
  gq("水にとけやすく、空気より軽く、においのある気体は？|Which gas is very soluble, lighter than air and smelly?|極易溶於水、比空氣輕、有刺激性氣味的氣體是？","N",
    [["H","水素は水にとけにくく、においもありません。|Hydrogen barely dissolves and has no smell.|氫氣難溶於水，也沒有氣味。"],["C","二酸化炭素は空気より重く、においがありません。|CO₂ is heavier than air and odorless.|二氧化碳比空氣重，沒有氣味。"],["O","酸素は水にとけにくく、においがありません。|Oxygen barely dissolves and is odorless.|氧氣難溶於水，沒有氣味。"]],
    "アンモニア：刺激臭、水にとけやすい（アルカリ性）、空気より軽い → 上方置換法。|Ammonia: sharp smell, very soluble (alkaline), lighter than air → upward displacement.|氨：刺激性氣味、極易溶於水（鹼性）、比空氣輕 → 向下排空氣法。"),
  gq("空気中にいちばん多くふくまれている気体は？|Which gas makes up most of the air?|空氣中含量最多的氣體是？","Z",
    [["O","酸素は約21%で2番目です。|Oxygen is about 21%, second.|氧氣約21%，排第二。"],["C","二酸化炭素は約0.04%しかありません。|CO₂ is only about 0.04%.|二氧化碳只有約0.04%。"],["H","水素は空気中にほとんどありません。|Air has almost no hydrogen.|空氣中幾乎沒有氫氣。"]],
    "空気：窒素 約78%、酸素 約21%。|Air: nitrogen ~78%, oxygen ~21%.|空氣：氮氣約78%、氧氣約21%。"),
  gq("最も密度が小さい（いちばん軽い）気体は？|Which is the least dense (lightest) gas?|密度最小（最輕）的氣體是？","H",
    [["N","アンモニアも空気より軽いですが、水素ほどではありません。|Ammonia is lighter than air, but not as light as hydrogen.|氨也比空氣輕，但沒有氫氣那麼輕。"],["O","酸素は空気より少し重いです。|Oxygen is slightly heavier than air.|氧氣比空氣稍重。"],["C","二酸化炭素は空気より重いです。|CO₂ is heavier than air.|二氧化碳比空氣重。"]],
    "水素：物質の中で最も密度が小さい。水にとけにくいので水上置換法。|Hydrogen: the least dense substance; collect by water displacement.|氫氣：密度最小的物質；難溶於水，用排水集氣法。"),
  Q("アンモニアを集めるのに適した方法は？|Which method is best for collecting ammonia?|收集氨最適合的方法是？","上方置換法|Upward displacement|向下排空氣法",
    [["水上置換法|Water displacement|排水集氣法","アンモニアは水にとけやすいので水上置換法は使えません。|Ammonia dissolves in water, so you can't use water.|氨極易溶於水，不能用排水集氣法。"],["下方置換法|Downward displacement|向上排空氣法","下方置換法は空気より重い気体用です。アンモニアは軽い。|That is for heavier gases; ammonia is lighter.|那是比空氣重的氣體用的，氨比較輕。"],["ろ過|Filtration|過濾","ろ過は液体と固体を分ける方法です。|Filtration separates solids from liquids.|過濾是分離固體和液體的方法。"]],
    "水にとけやすく空気より軽い → 上方置換法。|Soluble and lighter than air → upward displacement.|易溶於水且比空氣輕 → 向下排空氣法。",FIG_GAS),
];

// 水溶液
function conc(){ const T0=pick([50,100,200,250,400,500]); const ps=[2,4,5,8,10,12,15,20,25,30].filter(p=>T0*p%100===0); const p=pick(ps); const a=T0*p/100,b=T0-a;
  return C(X(`水 ${b} g に食塩 ${a} g をとかした食塩水の質量パーセント濃度は？|${a} g of salt dissolved in ${b} g of water. Mass percent concentration?|在 ${b} g 水中溶解 ${a} g 食鹽，食鹽水的質量百分濃度是？`),p," %",
    [[a/b*100,X("わる数は水の質量ではなく、水溶液全体（水＋食塩）の質量です。|Divide by the whole solution (water + salt), not just water.|要除以整個溶液（水＋鹽）的質量，不是只有水。")],[a,X("そのままではなく、水溶液全体の質量でわって100をかけます。|Divide by the solution mass and × 100.|要除以溶液總質量再乘100。")],[a/T0,X("100をかけて％にします。|Multiply by 100 for %.|要乘100換成%。")]],
    X(`濃度 ＝ 溶質 ÷ 溶液 × 100 ＝ ${a} ÷ (${b}＋${a}) × 100 ＝ ${p} %|% = solute ÷ solution × 100 = ${a} ÷ (${b} + ${a}) × 100 = ${p} %|濃度 ＝ 溶質 ÷ 溶液 × 100 ＝ ${a} ÷ (${b}＋${a}) × 100 ＝ ${p} %`)); }
function concMass(){ const T0=pick([50,100,150,200,300,400]); const p=pick([2,5,10,15,20]); const a=T0*p/100; if(!Number.isInteger(a*10)) return concMass();
  return C(X(`${p} % の砂糖水 ${T0} g にとけている砂糖は何 g？|How much sugar is in ${T0} g of ${p}% sugar water?|${p} % 的糖水 ${T0} g 中溶有多少 g 的糖？`),a," g",
    [[T0*p,X("100でわるのをわすれています。|You forgot to divide by 100.|忘了除以100。")],[T0/p,X("溶質 ＝ 溶液 × 濃度 ÷ 100 です。|Solute = solution × % ÷ 100.|溶質 ＝ 溶液 × 濃度 ÷ 100。")],[T0-a,X("それは水（溶媒）の質量です。|That is the water (solvent) mass.|那是水（溶劑）的質量。")]],
    X(`溶質 ＝ ${T0} × ${p} ÷ 100 ＝ ${fm(a)} g|Solute = ${T0} × ${p} ÷ 100 = ${fm(a)} g|溶質 ＝ ${T0} × ${p} ÷ 100 ＝ ${fm(a)} g`)); }
// 溶解度曲線：硝酸カリウムと塩化ナトリウム（100 g の水）
const KNO3=[13.3,22,31.6,45.6,63.9,85.2,109.2,138,168.8],NACL=[35.7,35.7,35.8,36.1,36.3,36.7,37.1,37.5,38];
function solFig(swap){ const px=t=>40+t*3,py=g=>200-g; let b="";
  for(let g=0;g<=180;g+=20) b+=L(40,py(g),280,py(g),"g")+T(34,py(g)+4,String(g),"xs","end"); for(let t=0;t<=80;t+=20) b+=L(px(t),20,px(t),200,"g")+T(px(t),214,String(t),"xs");
  const pl=a=>a.map((g,i)=>`${px(i*10)},${py(g)}`).join(" ");
  b+=`<polyline points="${pl(KNO3)}" class="ln"/><polyline points="${pl(NACL)}" class="ln2"/>`+T(226,52,swap?"B":"A")+T(262,154,swap?"A":"B")+L(40,20,40,200,"ax")+L(40,200,280,200,"ax")+T(160,230,X("水の温度（℃）|Water temperature (°C)|水溫（℃）"),"xs")+T(44,14,X("100 g の水にとける質量（g）|Mass dissolving in 100 g water (g)|100 g 水能溶解的質量（g）"),"xs","start");
  return SV(300,236,b); }
function solCurve(){ const swap=Math.random()<.5; const fig=solFig(swap); const K=swap?"B":"A",N=swap?"A":"B"; const askK=Math.random()<.5;
  const ans=askK?K:N, oth=askK?N:K;
  return {q:X(askK?"図は硝酸カリウムと塩化ナトリウムの溶解度曲線。水溶液を冷やして結晶を多く取り出しやすいのは？|Solubility curves of potassium nitrate and sodium chloride. Which gives more crystals by cooling?|圖是硝酸鉀和氯化鈉的溶解度曲線。冷卻溶液時較容易析出大量晶體的是？":"図は硝酸カリウムと塩化ナトリウムの溶解度曲線。温度による溶解度の変化が小さいのは？|Solubility curves of potassium nitrate and sodium chloride. Which changes little with temperature?|圖是硝酸鉀和氯化鈉的溶解度曲線。溶解度隨溫度變化小的是？")+fig,ans,
    wrongs:[{v:oth,why:X(askK?`${oth} は温度が変わってもとける量がほとんど変わらないので、冷やしても結晶はあまり出ません。|${oth} hardly changes with temperature, so cooling gives few crystals.|${oth} 溶解量幾乎不隨溫度改變，冷卻也不太會析出晶體。`:`${oth} は温度が上がるととける量が大きくふえます。|${oth} rises a lot with temperature.|${oth} 溫度升高時溶解量大增。`)},
      {v:X("どちらも同じ|Both the same|兩者相同"),why:X("2本のグラフの形はちがいます。|The two curves are different.|兩條曲線形狀不同。")},{v:X("グラフからは分からない|Can't tell from the graph|從圖無法判斷"),why:X("グラフのかたむきで、温度による変化が分かります。|The slope shows the change with temperature.|看曲線的斜率就知道隨溫度的變化。")}],
    exp:X(`${K}：硝酸カリウム（温度で大きく変わる → 冷やすと結晶が出る）、${N}：塩化ナトリウム（ほぼ変わらない → 水を蒸発させて取り出す）。|${K}: potassium nitrate (changes a lot → cooling works). ${N}: sodium chloride (barely changes → evaporate the water).|${K}：硝酸鉀（隨溫度大變 → 冷卻可析出），${N}：氯化鈉（幾乎不變 → 蒸發水分取出）。`),tf:v=>X("あてはまるのは|The answer is|答案是")+fig+`→ ${v}`,kind:"fig"}; }
const KN={0:13,20:32,40:64,60:109,80:169};
function recryst(){ const ts=[0,20,40,60,80]; let i=R(1,4),j=R(0,i-1); const t1=ts[i],t2=ts[j],s1=KN[t1],s2=KN[t2]; const w=pick([100,100,200,50]); const ans=(s1-s2)*w/100;
  return C(X(`100 g の水にとける硝酸カリウムは ${t1}℃で ${s1} g、${t2}℃で ${s2} g。${t1}℃の水 ${w} g に硝酸カリウムをとけるだけとかし、${t2}℃まで冷やすと、出てくる結晶は何 g？|100 g of water dissolves ${s1} g of potassium nitrate at ${t1}°C and ${s2} g at ${t2}°C. A saturated solution in ${w} g of water at ${t1}°C is cooled to ${t2}°C. How many grams of crystals form?|100 g 水在 ${t1}℃可溶解 ${s1} g 硝酸鉀，在 ${t2}℃可溶解 ${s2} g。在 ${t1}℃的 ${w} g 水中溶解到飽和，冷卻到 ${t2}℃，析出多少 g 晶體？`),ans," g",
    [[s1-s2,X("水が 100 g ではないので、水の量に合わせて計算します。|The water isn't 100 g; scale by the water amount.|水不是 100 g，要依水量換算。")],[s1*w/100,X(`${t2}℃でもとけたままの分があります。ひき算します。|Some stays dissolved at ${t2}°C; subtract it.|在 ${t2}℃仍有一部分溶著，要減掉。`)],[s2*w/100,X(`それは ${t2}℃でとけている量です。|That is what stays dissolved at ${t2}°C.|那是在 ${t2}℃仍溶解的量。`)],[(s1+s2)*w/100,X("たし算ではなく、ひき算です。|Subtract, don't add.|要相減，不是相加。")]],
    X(`(${s1} − ${s2}) × ${w}/100 ＝ ${fm(ans)} g（とけきれなくなった分が結晶になる＝再結晶）|(${s1} − ${s2}) × ${w}/100 = ${fm(ans)} g (what can no longer dissolve crystallizes)|(${s1} − ${s2}) × ${w}/100 ＝ ${fm(ans)} g（溶不下的部分析出成晶體＝再結晶）`)); }
const mat4=[conc,conc,concMass,solCurve,solCurve,recryst,recryst,
  Q("砂糖水で、砂糖のようにとけている物質を何という？|In sugar water, what is the dissolved sugar called?|糖水中，像糖那樣被溶解的物質叫做？","溶質|Solute|溶質",
    [["溶媒|Solvent|溶劑","溶媒は物質をとかしている液体（ここでは水）です。|The solvent is the liquid that dissolves it (water).|溶劑是溶解物質的液體（這裡是水）。"],["溶液|Solution|溶液","溶液は溶質が溶媒にとけた液全体です。|The solution is the whole liquid.|溶液是溶質溶在溶劑中的整體液體。"],["結晶|Crystal|晶體","結晶は規則正しい形をした固体です。|Crystals are regularly shaped solids.|晶體是形狀規則的固體。"]],
    "溶質（とけている物質）＋溶媒（とかす液体）＝溶液。水が溶媒なら水溶液。|Solute + solvent = solution. With water as solvent: aqueous solution.|溶質（被溶解）＋溶劑（溶解它的液體）＝溶液；溶劑是水就叫水溶液。"),
  Q("水溶液の性質で正しいのは？|Which is true of a solution?|關於水溶液，正確的是？","透明で、濃さはどこも同じ|It is clear and evenly concentrated|透明，各處濃度相同",
    [["時間がたつと、とけた物質が底にたまる|The solute settles over time|時間久了溶質會沉到底部","とけた物質は時間がたっても沈みません。|A dissolved substance never settles out.|溶解的物質放久也不會沉澱。"],["色がついたものは水溶液ではない|Colored liquids aren't solutions|有顏色的就不是水溶液","色がついていても透明なら水溶液です（硫酸銅水溶液など）。|Colored but clear is still a solution (e.g. copper sulfate).|有顏色但透明就是水溶液（例如硫酸銅水溶液）。"],["下のほうが濃い|It is denser at the bottom|下面比較濃","粒子は全体に均一に広がっています。|The particles spread evenly.|粒子均勻地分布在整個溶液中。"]],
    "水溶液：透明（色はあってもよい）・均一・時間がたっても変わらない。|Solution: clear (may be colored), uniform, stable over time.|水溶液：透明（可以有顏色）、均勻、放久也不變。"),
  Q("塩化ナトリウムの結晶を水溶液から取り出すのに向いている方法は？|How do you best get sodium chloride crystals from its solution?|從水溶液中取出氯化鈉晶體，適合的方法是？","水を蒸発させる|Evaporate the water|讓水蒸發",
    [["冷やす|Cool it|冷卻","塩化ナトリウムは温度でとける量がほとんど変わらないので、冷やしてもあまり出ません。|Its solubility barely changes, so cooling gives little.|氯化鈉的溶解量幾乎不隨溫度改變，冷卻析出很少。"],["ろ過する|Filter it|過濾","とけている物質はろ紙を通りぬけます。|Dissolved particles pass through filter paper.|溶解的物質會穿過濾紙。"],["かき混ぜる|Stir it|攪拌","かき混ぜても結晶は出てきません。|Stirring doesn't make crystals.|攪拌不會析出晶體。"]],
    "温度で溶解度が変わりにくい物質は、水を蒸発させて取り出す。|If solubility barely changes with temperature, evaporate the water.|溶解度不易隨溫度改變的物質，用蒸發水分的方法取出。"),
  Q("ろ過のしかたで正しいのは？|Which is correct filtering?|過濾的正確方法是？","液はガラス棒を伝わらせて注ぎ、ろうとのあしはビーカーのかべにつける|Pour along a glass rod; the funnel tip touches the beaker wall|沿玻璃棒倒入液體，漏斗尖端緊貼燒杯內壁",
    [["液を直接ろ紙のまん中に勢いよく注ぐ|Pour straight onto the middle of the paper|直接用力倒在濾紙中央","ろ紙が破れたり、液がはねたりします。ガラス棒を伝わらせます。|It can tear the paper or splash. Use a glass rod.|濾紙可能破掉或液體濺出，要沿玻璃棒倒。"],["ろうとのあしをビーカーのまん中に向ける|Point the tip at the middle of the beaker|漏斗尖端朝向燒杯中央","液がはねないよう、とがったほうをかべにつけます。|Touch the wall with the pointed side so it doesn't splash.|尖的那一側要貼著杯壁，以免液體濺出。"],["ろ紙を水でぬらさずに使う|Use the filter paper dry|濾紙不沾濕就使用","ろ紙は水でぬらしてろうとに密着させます。|Wet the paper so it sticks to the funnel.|要把濾紙沾濕，讓它緊貼漏斗。"]],
    "ろ過：ガラス棒を伝わらせて注ぐ、ろうとのあしのとがったほうをビーカーのかべにつける。|Filtering: pour along a glass rod; the funnel's pointed tip touches the beaker wall.|過濾：沿玻璃棒倒入；漏斗尖端較長的一側貼著燒杯內壁。"),
];

// 状態変化：水を加熱したときの温度のグラフ
const FIG_HEAT=(()=>{ const px=t=>40+t*15,py=c=>170-(c+20)*1.2; let b=L(40,20,40,182,"ax")+L(40,182,290,182,"ax");
  b+=L(40,py(0),290,py(0),"dl")+L(40,py(100),290,py(100),"dl")+T(34,py(0)+4,"0","xs","end")+T(34,py(100)+4,"100","xs","end");
  b+=`<polyline points="${px(0)},${py(-20)} ${px(2)},${py(0)} ${px(5)},${py(0)} ${px(9)},${py(100)} ${px(14)},${py(100)} ${px(15.5)},${py(118)}" class="ln"/>`;
  b+=T(px(3.5),py(0)-8,"A")+T(px(11.5),py(100)-8,"B")+T(165,198,X("加熱した時間|Heating time|加熱時間"),"xs")+T(44,14,X("温度（℃）|Temperature (°C)|溫度（℃）"),"xs","start");
  return SV(300,204,b); })();
function pureFig(swap){ const px=t=>40+t*24,py=c=>170-c*1.5; let b=L(40,20,40,182,"ax")+L(40,182,290,182,"ax");
  const A=`${px(0)},${py(20)} ${px(3)},${py(78)} ${px(7)},${py(78)} ${px(9.5)},${py(95)}`, B=`${px(0)},${py(20)} ${px(2.6)},${py(74)} ${px(5)},${py(84)} ${px(7.5)},${py(92)} ${px(9.5)},${py(98)}`;
  b+=`<polyline points="${swap?B:A}" class="ln"/><polyline points="${swap?A:B}" class="ln2"/>`+T(px(5.2),py(swap?84:78)-10,"A")+T(px(6.2),py(swap?78:88)+18,"B");
  b+=T(165,198,X("加熱した時間|Heating time|加熱時間"),"xs")+T(44,14,X("温度（℃）|Temperature (°C)|溫度（℃）"),"xs","start"); return SV(300,204,b); }
function pureMix(){ const swap=Math.random()<.5; const fig=pureFig(swap); const pure=swap?"B":"A",mix=swap?"A":"B";
  return {q:X("図は2つの液体を加熱したときの温度の変化。純物質（1種類の物質）のグラフは？|Temperature while heating two liquids. Which is a pure substance?|圖是加熱兩種液體時溫度的變化。純物質（只有一種物質）的是？")+fig,ans:pure,
    wrongs:[{v:mix,why:X(`${mix} は沸とう中も温度が上がり続けています。混合物です。|${mix} keeps rising while boiling: a mixture.|${mix} 沸騰時溫度仍持續上升，是混合物。`)},{v:X("どちらも|Both|兩者都是"),why:X("温度が一定になるのは片方だけです。|Only one stays flat.|只有一個溫度保持不變。")},{v:X("どちらでもない|Neither|兩者都不是"),why:X("沸点で温度が一定になるのが純物質です。|A pure substance stays flat at its boiling point.|在沸點溫度保持不變的就是純物質。")}],
    exp:X(`純物質は沸点で温度が一定になる（${pure}）。混合物は一定にならない（${mix}）。|A pure substance stays at its boiling point (${pure}); a mixture doesn't (${mix}).|純物質在沸點溫度保持不變（${pure}），混合物不會（${mix}）。`),tf:v=>X("純物質のグラフは|The pure substance is|純物質的是")+fig+`→ ${v}`,kind:"fig"}; }
const MPBP=[["酸素|Oxygen|氧氣",-218,-183],["エタノール|Ethanol|乙醇",-115,78],["水|Water|水",0,100],["水銀|Mercury|水銀",-39,357],["パルミチン酸|Palmitic acid|棕櫚酸",63,351],["鉄|Iron|鐵",1538,2862],["塩化ナトリウム|Sodium chloride|氯化鈉",801,1413],["窒素|Nitrogen|氮氣",-210,-196]];
const stOf=([,mp,bp],t)=>t<mp?0:t<bp?1:2;
const STN=["固体|solid|固體","液体|liquid|液體","気体|gas|氣體"];
function mpbp(){ for(let k=0;k<30;k++){ const t=pick([-100,20,50,90,120,1000]); const s=R(0,2); const yes=MPBP.filter(x=>stOf(x,t)===s),no=MPBP.filter(x=>stOf(x,t)!==s); if(!yes.length||no.length<3) continue;
    const a=pick(yes),ws=shuf(no).slice(0,3); const four=shuf([a,...ws]); let rows=T(150,16,X("融点|m.p.|熔點"),"xs","end")+T(206,16,X("沸点|b.p.|沸點"),"xs","end");
    four.forEach(([n,mp,bp],i)=>{ rows+=T(6,38+i*22,X(n),"sm","start")+T(150,38+i*22,mp+"℃","sm","end")+T(206,38+i*22,bp+"℃","sm","end"); });
    const fig=SV(216,124,rows); const st=X(STN[s]);
    return {q:X(`${t}℃で${st}なのはどれ？|Which is a ${st} at ${t}°C?|在 ${t}℃時是${st}的是？`)+fig,ans:X(a[0]),
      wrongs:ws.map(x=>{ const s2=stOf(x,t); return {v:X(x[0]),why:X(`${X(x[0])}は${t}℃では${X(STN[s2])}です（融点 ${x[1]}℃・沸点 ${x[2]}℃）。|${X(x[0])} is a ${X(STN[s2])} at ${t}°C (m.p. ${x[1]}, b.p. ${x[2]}).|${X(x[0])}在 ${t}℃是${X(STN[s2])}（熔點 ${x[1]}℃、沸點 ${x[2]}℃）。`)}; }),
      exp:X("融点より低い→固体、融点と沸点の間→液体、沸点より高い→気体。|Below m.p. → solid; between → liquid; above b.p. → gas.|低於熔點→固體，在熔點和沸點之間→液體，高於沸點→氣體。"),tf:v=>X(`${t}℃で${st}なのは|At ${t}°C, the ${st} is|在 ${t}℃是${st}的是`)+fig+`→ ${v}`,kind:"fig"}; } }
const mat5=[pureMix,pureMix,mpbp,mpbp,mpbp,
  Q("図の B の温度を何という？|What is temperature B called?|圖中 B 的溫度叫做？","沸点|Boiling point|沸點",
    [["融点|Melting point|熔點","融点は固体がとけて液体になる温度（A）です。|The melting point is A, where solid turns liquid.|熔點是固體熔化成液體的溫度（A）。"],["密度|Density|密度","密度は1 cm³ あたりの質量です。|Density is mass per cm³.|密度是每 cm³ 的質量。"],["溶解度|Solubility|溶解度","溶解度は水100 gにとける限度の量です。|Solubility is the max amount in 100 g of water.|溶解度是100 g水能溶解的最大量。"]],
    "A＝融点（0℃）、B＝沸点（100℃）。状態が変わっている間は温度が一定。|A = melting point (0°C), B = boiling point (100°C). Temperature stays flat during the change.|A＝熔點（0℃），B＝沸點（100℃）。狀態改變期間溫度不變。",FIG_HEAT),
  Q("図の A や B の間、加熱しているのに温度が上がらないのはなぜ？|Why doesn't the temperature rise during A and B?|在圖中 A、B 期間，為什麼加熱溫度也不上升？","加えた熱が状態変化に使われるから|The heat is used to change state|加入的熱用在狀態變化上",
    [["火が弱くなるから|The flame gets weaker|火變小了","火の強さは同じです。|The flame is the same.|火的大小相同。"],["水がなくなるから|The water is gone|水沒有了","水はまだあります。状態が変わっているところです。|Water is still there; it is changing state.|水還在，正在改變狀態。"],["温度計がこわれるから|The thermometer breaks|溫度計壞了","温度計は正しく測っています。|The thermometer works fine.|溫度計量得正確。"]],
    "とける・沸とうする間は、熱が状態変化に使われ温度は一定。|While melting or boiling, heat goes into the change; temperature stays flat.|熔化、沸騰期間，熱用於狀態變化，溫度保持不變。",FIG_HEAT),
  Q("液体のロウが冷えて固体になると、体積と質量はどうなる？|When liquid wax becomes solid, what happens to volume and mass?|液態蠟冷卻變成固體時，體積和質量會怎樣？","体積は小さくなり、質量は変わらない|Volume decreases; mass stays the same|體積變小，質量不變",
    [["体積も質量も小さくなる|Both decrease|體積和質量都變小","状態が変わっても粒子の数は同じなので、質量は変わりません。|The number of particles is the same, so mass doesn't change.|狀態改變時粒子數相同，質量不變。"],["体積は大きくなり、質量は変わらない|Volume increases; mass the same|體積變大，質量不變","固体になると体積が大きくなるのは水の場合です（例外）。|Getting bigger when solid is water's exception.|變成固體體積變大是水的例外。"],["体積は変わらず、質量が大きくなる|Volume same; mass increases|體積不變，質量變大","質量は変わりません。|Mass doesn't change.|質量不會改變。"]],
    "多くの物質は液体→固体で体積が小さくなる（水は例外で大きくなる）。質量はいつも変わらない。|Most substances shrink when they solidify (water expands). Mass never changes.|大多數物質由液體變固體時體積變小（水是例外會變大），質量始終不變。"),
  Q("気体の粒子のようすで正しいのは？|Which describes particles in a gas?|關於氣體粒子的樣子，正確的是？","粒子の間が広く、自由に飛び回っている|Far apart, moving freely|粒子間距大，自由地飛來飛去",
    [["粒子が規則正しく並んでいる|Neatly lined up|粒子規則地排列","それは固体のようすです。|That is a solid.|那是固體的樣子。"],["粒子がくっついたまま動き回る|Touching and moving around|粒子靠在一起到處移動","それは液体のようすです。|That is a liquid.|那是液體的樣子。"],["粒子の数がふえている|There are more particles|粒子的數目增加了","状態が変わっても粒子の数は変わりません。|The number never changes.|狀態改變時粒子數不變。"]],
    "固体：規則正しく並ぶ。液体：くっついたまま動く。気体：間が広く飛び回る。|Solid: ordered. Liquid: close, moving. Gas: far apart, flying.|固體：規則排列。液體：靠近但能移動。氣體：間距大、到處飛。"),
  Q("水とエタノールの混合物を加熱したとき、はじめに出てくる液体に多くふくまれるのは？|Heating a water-ethanol mixture, what is the first liquid mostly?|加熱水和乙醇的混合物，最先收集到的液體中含量較多的是？","エタノール|Ethanol|乙醇",
    [["水|Water|水","水の沸点は100℃、エタノールは78℃。沸点の低いほうが先に出ます。|Water boils at 100°C, ethanol at 78°C; the lower one comes first.|水的沸點100℃，乙醇78℃，沸點低的先出來。"],["どちらも同じ量|Equal amounts|兩者一樣多","沸点のちがいで、出てくる割合が変わります。|Different boiling points change the ratio.|沸點不同，收集到的比例也不同。"],["何も出てこない|Nothing comes out|什麼都出不來","加熱すると気体になって出てきます。|Heating turns it into gas that comes out.|加熱後會變成氣體出來。"]],
    "蒸留：沸点のちがいを利用して、混合物から物質を分ける。|Distillation separates substances by boiling point.|蒸餾：利用沸點不同把混合物中的物質分離。"),
  Q("液体を加熱するとき、沸とう石を入れる理由は？|Why add boiling chips when heating a liquid?|加熱液體時放入沸石的原因是？","急に沸とうする（とつ沸）のを防ぐため|To prevent sudden violent boiling|防止突然劇烈沸騰（突沸）",
    [["早く沸とうさせるため|To boil faster|讓它更快沸騰","沸点は変わりません。おだやかに沸とうさせるためです。|The boiling point doesn't change; it keeps boiling gentle.|沸點不變，是為了讓沸騰平穩。"],["液体の色を変えるため|To change the color|改變液體的顏色","色は変わりません。|The color doesn't change.|顏色不會變。"],["温度を測るため|To measure temperature|為了測量溫度","温度は温度計で測ります。|A thermometer measures temperature.|溫度是用溫度計測量。"]],
    "沸とう石：急な沸とう（とつ沸）を防ぐ。|Boiling chips prevent sudden boiling (bumping).|沸石：防止突沸。"),
];
