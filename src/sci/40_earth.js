/* ========== ④ 大地の成り立ちと変化（第2分野(2)） ========== */
// 火山の形：ドーム状・成層火山・たて状
const VOL={dome:"ねばりけが強い|very sticky (viscous) magma|黏性強",cone:"ねばりけが中くらい|medium viscosity|黏性中等",shield:"ねばりけが弱い|runny magma|黏性弱"};
function volFig(order){ let b=""; order.forEach((k,i)=>{ const x=10+i*104,cx=x+46,by=90; b+=L(x,by,x+92,by,"o");
  if(k==="dome") b+=`<path d="M${cx-30} ${by} Q${cx-30} ${by-56} ${cx} ${by-56} Q${cx+30} ${by-56} ${cx+30} ${by} Z" class="ac"/>`;
  if(k==="cone") b+=`<path d="M${cx-44} ${by} Q${cx-16} ${by-24} ${cx-6} ${by-60} L${cx+6} ${by-60} Q${cx+16} ${by-24} ${cx+44} ${by} Z" class="ac"/>`;
  if(k==="shield") b+=`<path d="M${cx-46} ${by} Q${cx-20} ${by-22} ${cx} ${by-22} Q${cx+20} ${by-22} ${cx+46} ${by} Z" class="ac"/>`;
  b+=T(cx,by+20,LET[i]); }); return SV(320,116,b); }
const VQ=[["マグマのねばりけが最も強い火山の形は？|Which volcano shape comes from the most viscous magma?|岩漿黏性最強的火山形狀是？","dome","ねばりけが強いと溶岩が流れにくく、盛り上がった形になります。|Sticky lava doesn't flow, so it piles up into a dome.|黏性強的熔岩不易流動，會堆成隆起的形狀。"],
  ["おだやかに噴火し、溶岩が流れやすい火山の形は？|Which shape comes from gentle eruptions with runny lava?|噴發溫和、熔岩容易流動的火山形狀是？","shield","ねばりけが弱いと溶岩がうすく広がり、なだらかな形になります。|Runny lava spreads thin into a gentle shape.|黏性弱的熔岩會薄薄地擴散，形成平緩的形狀。"],
  ["富士山や桜島のような形の火山は？|Which shape is like Mt. Fuji or Sakurajima?|像富士山、櫻島那樣形狀的火山是？","cone","溶岩と火山灰が交互に積み重なった円すい形（成層火山）です。|Layers of lava and ash make a cone (stratovolcano).|熔岩和火山灰交互堆積成圓錐形（層狀火山）。"]];
const VNM={dome:"ドーム状（昭和新山・雲仙普賢岳）|dome (Showa-shinzan, Unzen)|鐘狀（昭和新山、雲仙普賢岳）",cone:"円すい形の成層火山（富士山・桜島）|cone-shaped stratovolcano (Fuji, Sakurajima)|圓錐形層狀火山（富士山、櫻島）",shield:"たて状（マウナロア）|shield (Mauna Loa)|盾狀（茂納羅亞）"};
function volShape(){ const order=shuf(["dome","cone","shield"]); const fig=volFig(order); const [q,k,why]=pick(VQ); const a=LET[order.indexOf(k)];
  const ws=order.map((kk,i)=>kk===k?null:{v:LET[i],why:X(`${LET[i]} は${X(VNM[kk])}。マグマは${X(VOL[kk])}。|${LET[i]} is a ${X(VNM[kk])}: ${X(VOL[kk])}.|${LET[i]} 是${X(VNM[kk])}，岩漿${X(VOL[kk])}。`)}).filter(Boolean);
  ws.push({v:X("形からは分からない|Can't tell from shape|從形狀看不出來"),why:X("火山の形はマグマのねばりけで決まります。|The shape depends on magma viscosity.|火山形狀由岩漿黏性決定。")});
  return {q:X(q)+fig,ans:a,wrongs:ws,exp:`${a}：`+X(why),tf:v=>X(q)+fig+`→ ${v}`,kind:"fig"}; }
// 火成岩のつくり：A 斑状組織 B 等粒状組織
const FIG_ROCK=(()=>{ let b=`<rect x="10" y="10" width="130" height="110" rx="6" class="bx"/><rect x="170" y="10" width="130" height="110" rx="6" class="bx"/>`;
  let s=1; const rnd=()=>{ s=(s*9301+49297)%233280; return s/233280; };
  for(let i=0;i<150;i++) b+=`<circle cx="${(16+rnd()*118).toFixed(1)}" cy="${(16+rnd()*98).toFixed(1)}" r="1.2" class="kf"/>`;
  for(const [x,y,r,a] of [[40,40,13,10],[95,32,10,40],[60,90,12,70],[112,84,9,20],[30,100,7,50]]){ const p=[0,1,2,3,4,5].map(j=>{ const t=rad(a+j*60); return P2(x+r*Math.cos(t)*(j%2?1:.75),y+r*Math.sin(t)); }).join(" "); b+=`<polygon points="${p}" class="ac"/>`; }
  for(let gx=0;gx<5;gx++) for(let gy=0;gy<4;gy++){ const x=176+gx*25+(gy%2)*6,y=16+gy*26; b+=`<polygon points="${P2(x,y+4)} ${P2(x+20,y)} ${P2(x+24,y+18)} ${P2(x+6,y+24)}" class="${(gx+gy)%3?"ac":"os"}"/>`; }
  return SV(310,146,b+T(75,140,"A")+T(235,140,"B")); })();
const earth1=[volShape,volShape,volShape,
  Q("図の A のような岩石のつくりを何という？|What is the texture of rock A called?|像圖中 A 那樣的岩石組織叫做？","斑状組織|Porphyritic texture|斑狀組織",
    [["等粒状組織|Equigranular texture|等粒狀組織","等粒状組織は B のように大きな結晶がそろったつくりです。|Equigranular is like B, all large crystals.|等粒狀組織是像 B 那樣大結晶整齊排列。"],["地層|Strata|地層","地層は堆積物が層になったものです。|Strata are layers of sediment.|地層是沉積物堆積成的層。"],["化石|Fossil|化石","化石は昔の生物のあとです。|Fossils are traces of ancient life.|化石是古代生物的遺跡。"]],
    "斑状組織（A）：大きな結晶（斑晶）と細かい部分（石基）。マグマが地表近くで急に冷えた＝火山岩。|Porphyritic (A): big crystals (phenocrysts) in fine groundmass; cooled fast near the surface = volcanic rock.|斑狀組織（A）：大結晶（斑晶）和細小部分（石基）；岩漿在地表附近快速冷卻＝火山岩。",FIG_ROCK),
  Q("図の B のようなつくりの岩石は、どのようにできた？|How did rock B form?|像圖中 B 那樣組織的岩石是怎麼形成的？","マグマが地下深くでゆっくり冷えて固まった|Magma cooled slowly deep underground|岩漿在地下深處慢慢冷卻凝固",
    [["マグマが地表近くで急に冷えて固まった|Magma cooled fast near the surface|岩漿在地表附近快速冷卻凝固","それは A（斑状組織）の火山岩のでき方です。|That is how A (volcanic rock) forms.|那是 A（斑狀組織）火山岩的形成方式。"],["土砂が積もって固まった|Sediment piled up and hardened|泥沙堆積後變硬","それは堆積岩のでき方です。|That is sedimentary rock.|那是沉積岩的形成方式。"],["生物の死がいが積もった|Dead organisms piled up|生物遺骸堆積","それは石灰岩やチャートなどの堆積岩です。|That is limestone or chert.|那是石灰岩、燧石等沉積岩。"]],
    "等粒状組織（B）：ゆっくり冷えて結晶が大きく成長した＝深成岩（花こう岩など）。|Equigranular (B): slow cooling grows large crystals = plutonic rock (e.g. granite).|等粒狀組織（B）：慢慢冷卻使結晶長大＝深成岩（如花崗岩）。",FIG_ROCK),
  Q("斑状組織で、まわりの細かい粒やガラスの部分を何という？|In porphyritic rock, the fine part around the big crystals is…|斑狀組織中，大結晶周圍細小顆粒或玻璃質的部分叫做？","石基|Groundmass|石基",
    [["斑晶|Phenocrysts|斑晶","斑晶は大きな結晶のほうです。|Phenocrysts are the big crystals.|斑晶是大的結晶。"],["鉱物|Minerals|礦物","鉱物は岩石をつくる粒の種類のことです。|Minerals are the kinds of grains.|礦物是組成岩石的顆粒種類。"],["火山灰|Volcanic ash|火山灰","火山灰は噴火でふき出す細かい粒です。|Ash is erupted fine particles.|火山灰是噴發噴出的細小顆粒。"]],
    "斑状組織＝斑晶（大きな結晶）＋石基（細かい部分）。|Porphyritic = phenocrysts + groundmass.|斑狀組織＝斑晶（大結晶）＋石基（細小部分）。",FIG_ROCK),
  Q("マグマのねばりけが強い火山の火山灰や岩石の色は？|What color are ash and rocks from a volcano with viscous magma?|岩漿黏性強的火山，其火山灰和岩石的顏色是？","白っぽい|Whitish|偏白",
    [["黒っぽい|Blackish|偏黑","黒っぽいのはねばりけが弱いマグマです（有色鉱物が多い）。|Dark ones come from runny magma (more dark minerals).|偏黑的是黏性弱的岩漿（有色礦物多）。"],["赤い|Red|紅色","色は無色鉱物と有色鉱物の割合で決まります。|Color depends on light vs. dark minerals.|顏色由無色和有色礦物的比例決定。"],["透明|Clear|透明","岩石は透明ではありません。|Rocks aren't clear.|岩石不是透明的。"]],
    "ねばりけ強い→白っぽい（無色鉱物が多い）・激しい噴火。弱い→黒っぽい・おだやか。|Viscous → whitish (light minerals), explosive. Runny → dark, gentle.|黏性強→偏白（無色礦物多）、劇烈噴發；黏性弱→偏黑、溫和。"),
  Q("白っぽい深成岩はどれ？|Which is a whitish plutonic rock?|哪一個是偏白的深成岩？","花こう岩|Granite|花崗岩",
    [["玄武岩|Basalt|玄武岩","玄武岩は黒っぽい火山岩です。|Basalt is a dark volcanic rock.|玄武岩是偏黑的火山岩。"],["流紋岩|Rhyolite|流紋岩","流紋岩は白っぽいですが、火山岩です。|Rhyolite is whitish but volcanic.|流紋岩偏白，但屬於火山岩。"],["斑れい岩|Gabbro|輝長岩","斑れい岩は黒っぽい深成岩です。|Gabbro is a dark plutonic rock.|輝長岩是偏黑的深成岩。"]],
    "火山岩：流紋岩・安山岩・玄武岩（白→黒）。深成岩：花こう岩・せん緑岩・斑れい岩（白→黒）。|Volcanic: rhyolite, andesite, basalt (light→dark). Plutonic: granite, diorite, gabbro.|火山岩：流紋岩、安山岩、玄武岩（白→黑）；深成岩：花崗岩、閃長岩、輝長岩（白→黑）。"),
  Q("無色鉱物はどれ？|Which is a light-colored (colorless) mineral?|哪一個是無色礦物？","セキエイ|Quartz|石英",
    [["クロウンモ|Biotite|黑雲母","クロウンモは黒色でうすくはがれる有色鉱物です。|Biotite is black and peels in sheets.|黑雲母是黑色、會薄片剝落的有色礦物。"],["カクセン石|Hornblende|角閃石","カクセン石は緑黒色の有色鉱物です。|Hornblende is a dark green-black mineral.|角閃石是綠黑色的有色礦物。"],["カンラン石|Olivine|橄欖石","カンラン石は黄緑色の有色鉱物です。|Olivine is a yellow-green mineral.|橄欖石是黃綠色的有色礦物。"]],
    "無色鉱物：セキエイ・チョウ石。有色鉱物：クロウンモ・カクセン石・キ石・カンラン石・磁鉄鉱。|Light: quartz, feldspar. Dark: biotite, hornblende, pyroxene, olivine, magnetite.|無色礦物：石英、長石；有色礦物：黑雲母、角閃石、輝石、橄欖石、磁鐵礦。"),
  Q("軽石にたくさんの小さな穴があいているのはなぜ？|Why does pumice have many small holes?|浮石有很多小孔，原因是？","マグマにふくまれていた気体がぬけたあとだから|Gas escaped from the magma|岩漿中所含的氣體跑出去留下的痕跡",
    [["虫が食べたあとだから|Bugs ate it|被蟲吃過","生物とは関係ありません。|It has nothing to do with living things.|和生物無關。"],["雨にとかされたから|Rain dissolved it|被雨水溶解","できたときから穴があいています。|The holes formed when it was made.|形成時就有孔了。"],["結晶が大きく育ったから|Crystals grew large|結晶長得很大","穴は気体のあとです。|The holes are left by gas.|孔是氣體留下的。"]],
    "マグマの中の気体（水蒸気など）がぬけて、穴の多い軽石ができる。|Gas (mainly steam) escaping from magma leaves pumice full of holes.|岩漿中的氣體（水蒸氣等）逸出，形成多孔的浮石。"),
];

// 地震
const FIG_SEIS=(()=>{ const pts=[]; let s=7; const rn=()=>{ s=(s*16807)%2147483647; return s/2147483647-.5; };
  for(let i=0;i<=300;i++){ const x=10+i; let a=0; if(x>60) a=x<150?7:x<230?30*Math.exp(-(x-150)/90)+6:10*Math.exp(-(x-230)/40); pts.push(P2(x,70+a*rn()*2)); }
  return SV(320,130,`<polyline points="${pts.join(" ")}" class="ln"/>`+L(60,20,60,112,"dl")+L(150,20,150,112,"dl")+T(105,22,"A")+T(200,22,"B")+AR(60,108,150,108,"k")+AR(150,108,60,108,"k")+T(105,124,"C","sm")+T(296,124,X("時間→|time →|時間→"),"xs","end")); })();
const earth2=[
  Q("図の地震計の記録で、A のはじめの小さなゆれを何という？|In the seismogram, what is the first small shaking A called?|地震儀紀錄中，A 一開始的小搖晃叫做？","初期微動|Preliminary tremors|初期微動",
    [["主要動|Main shaking|主震動","主要動は B のあとから来る大きなゆれです。|Main shaking is the big shaking at B.|主震動是 B 之後的大搖晃。"],["余震|Aftershock|餘震","余震は大きな地震のあとに続いて起こる地震です。|Aftershocks are later quakes.|餘震是大地震之後接著發生的地震。"],["津波|Tsunami|海嘯","津波は海の水が大きく動く現象です。|A tsunami is a huge sea wave.|海嘯是海水大規模移動的現象。"]],
    "初期微動（A）は P波、主要動（B）は S波によるゆれ。|Preliminary tremors (A) come from P waves; main shaking (B) from S waves.|初期微動（A）由 P 波造成，主震動（B）由 S 波造成。",FIG_SEIS),
  Q("図の B の大きなゆれを伝える波は？|Which wave causes the big shaking B?|圖中 B 的大搖晃是由哪種波傳來的？","S波|S wave|S 波",
    [["P波|P wave|P 波","P波は先に届く速い波で、初期微動を起こします。|P waves arrive first and cause the small tremors.|P 波較快先到，造成初期微動。"],["光|Light|光","地震のゆれは地面を伝わる波です。|Quake shaking is a wave through the ground.|地震搖晃是在地面傳播的波。"],["音|Sound|聲音","地震の波は P波と S波です。|Earthquake waves are P and S waves.|地震波是 P 波和 S 波。"]],
    "P波（速い）→初期微動、S波（おそい）→主要動。|P (fast) → small tremors; S (slow) → main shaking.|P 波（快）→初期微動；S 波（慢）→主震動。",FIG_SEIS),
  Q("図の C の時間（初期微動が続く時間）を何という？|What is time C called?|圖中 C 的時間（初期微動持續的時間）叫做？","初期微動継続時間|P–S time (duration of tremors)|初期微動持續時間",
    [["震度|Seismic intensity|震度","震度はその場所のゆれの大きさです。|Intensity is how strongly a place shakes.|震度是該地搖晃的程度。"],["マグニチュード|Magnitude|規模","マグニチュードは地震そのものの規模です。|Magnitude is the size of the quake itself.|規模是地震本身的大小。"],["主要動|Main shaking|主震動","主要動は B からのゆれです。|Main shaking starts at B.|主震動是從 B 開始的搖晃。"]],
    "初期微動継続時間は、震源からの距離が遠いほど長い（距離に比例）。|The P–S time grows with distance (proportional).|初期微動持續時間和震源距離成正比，越遠越長。",FIG_SEIS),
  ()=>{ const v=pick([5,6,7,8]),t=pick([5,8,10,12,15,20]); const d=v*t;
    return C(X(`震源から ${d} km の地点に、P波が ${t} 秒後に届いた。P波の速さは？|P waves reached a point ${d} km away in ${t} s. Their speed?|P 波在 ${t} 秒後到達離震源 ${d} km 的地點，P 波的速度是？`),v," km/s",
      [[t/d,X("速さ ＝ 距離 ÷ 時間 です。|Speed = distance ÷ time.|速度 ＝ 距離 ÷ 時間。")],[d*t,X("かけ算ではなく、わり算です。|Divide, don't multiply.|是除法，不是乘法。")],[d-t,X("ひき算ではなく、わり算です。|Divide, don't subtract.|是除法，不是減法。")]],
      X(`速さ ＝ ${d} ÷ ${t} ＝ ${v} km/s|Speed = ${d} ÷ ${t} = ${v} km/s|速度 ＝ ${d} ÷ ${t} ＝ ${v} km/s`)); },
  ()=>{ const k=pick([6,7,8]),x1=pick([5,10,15]),x2=pick([4,6,8,12,20,25,30].filter(v=>v!==x1)); const d1=k*x1,d2=k*x2;
    return C(X(`震源から ${d1} km の地点で初期微動継続時間が ${x1} 秒だった。震源から ${d2} km の地点では何秒？|At ${d1} km from the focus the P–S time was ${x1} s. What is it at ${d2} km?|離震源 ${d1} km 處的初期微動持續時間是 ${x1} 秒。離震源 ${d2} km 處是幾秒？`),x2," s",
      [[x1*d2/10,X("初期微動継続時間は距離に比例します。|The P–S time is proportional to distance.|初期微動持續時間和距離成正比。")],[x1+(d2-d1),X("距離の差をそのままたしてはいけません。比例で考えます。|Don't add the distance; use proportion.|不能直接加距離差，要用比例。")],[d2/x1,X(`距離 ${d1} km で ${x1} 秒 → 1秒あたり ${k} km。|${d1} km ↔ ${x1} s, so ${k} km per second.|${d1} km 對應 ${x1} 秒 → 每秒 ${k} km。`)]],
      X(`${d1} km で ${x1} 秒 → ${d2} km では ${x1} × ${d2}/${d1} ＝ ${x2} 秒|${x1} s at ${d1} km → at ${d2} km: ${x1} × ${d2}/${d1} = ${x2} s|${d1} km 為 ${x1} 秒 → ${d2} km 為 ${x1} × ${d2}/${d1} ＝ ${x2} 秒`)); },
  ()=>{ const d=12*R(3,10); const tp=d/6,ts=d/4;
    return C(X(`P波の速さ 6 km/s、S波の速さ 4 km/s。震源から ${d} km の地点の初期微動継続時間は？|P waves: 6 km/s, S waves: 4 km/s. P–S time at ${d} km?|P 波 6 km/s、S 波 4 km/s。離震源 ${d} km 處的初期微動持續時間是？`),ts-tp," s",
      [[ts,X(`それは S波が届くまでの時間です。P波の ${tp} 秒をひきます。|That is the S arrival; subtract the P time ${tp} s.|那是 S 波到達的時間，要減掉 P 波的 ${tp} 秒。`)],[tp,X("それは P波が届くまでの時間です。|That is the P arrival time.|那是 P 波到達的時間。")],[ts+tp,X("たし算ではなく、S波 − P波 の時間です。|It is S time − P time, not the sum.|是 S 波時間 − P 波時間，不是相加。")]],
      X(`P波 ${d}÷6 ＝ ${tp} 秒、S波 ${d}÷4 ＝ ${ts} 秒、差 ＝ ${ts-tp} 秒|P: ${d}÷6 = ${tp} s, S: ${d}÷4 = ${ts} s, difference = ${ts-tp} s|P 波 ${d}÷6 ＝ ${tp} 秒，S 波 ${d}÷4 ＝ ${ts} 秒，差 ＝ ${ts-tp} 秒`)); },
  Q("震源の真上の地表の点を何という？|The point on the surface right above the focus is…|震源正上方的地表點叫做？","震央|Epicenter|震央",
    [["震源|Focus (hypocenter)|震源","震源は地下で地震が発生した場所です。|The focus is underground where it starts.|震源是地下發生地震的地方。"],["断層|Fault|斷層","断層は地層や岩石がずれたところです。|A fault is where rocks slipped.|斷層是地層或岩石錯動的地方。"],["火口|Crater|火山口","火口は火山の噴火口です。|A crater is a volcano's vent.|火山口是火山的噴發口。"]],
    "震源：地下の発生場所。震央：その真上の地表。|Focus: where it starts underground. Epicenter: directly above on the surface.|震源：地下發生處；震央：其正上方的地表。"),
  Q("日本の震度は何段階？|How many levels does Japan's seismic intensity scale have?|日本的震度分為幾級？","10段階（0〜7、5と6は弱・強）|10 (0–7, with 5 and 6 split into lower/upper)|10級（0〜7，5和6分弱、強）",
    [["7段階|7|7級","5弱・5強・6弱・6強があるので10段階です。|5 and 6 are split, making 10.|5和6分弱、強，共10級。"],["8段階|8|8級","0から7までに、5と6が弱・強に分かれて10段階です。|0–7 with 5 and 6 split = 10.|0到7，5和6各分弱、強，共10級。"],["12段階|12|12級","日本の震度は10段階です。|Japan uses 10 levels.|日本的震度是10級。"]],
    "震度：その場所のゆれの大きさ（0・1・2・3・4・5弱・5強・6弱・6強・7）。|Intensity: shaking at a place (0, 1, 2, 3, 4, 5−, 5+, 6−, 6+, 7).|震度：該地搖晃程度（0、1、2、3、4、5弱、5強、6弱、6強、7）。"),
  Q("地震そのものの規模（エネルギーの大きさ）を表すものは？|What shows the size (energy) of the earthquake itself?|表示地震本身規模（能量大小）的是？","マグニチュード|Magnitude|規模",
    [["震度|Seismic intensity|震度","震度は場所ごとのゆれの大きさで、同じ地震でも場所でちがいます。|Intensity varies by place.|震度是各地的搖晃程度，同一地震各地不同。"],["初期微動継続時間|P–S time|初期微動持續時間","それは震源からの距離に関係します。|That depends on distance.|那和離震源的距離有關。"],["震央|Epicenter|震央","震央は場所のことです。|The epicenter is a place.|震央是一個地點。"]],
    "マグニチュード：地震の規模（1つの地震に1つ）。震度：各地のゆれ。|Magnitude: one value per quake. Intensity: shaking at each place.|規模：每次地震只有一個值；震度：各地的搖晃。"),
  Q("日本付近で、海洋プレートはどう動いている？|Near Japan, how do the ocean plates move?|日本附近的海洋板塊怎麼移動？","大陸プレートの下にしずみこんでいる|They sink under the continental plates|隱沒到大陸板塊下方",
    [["大陸プレートの上に乗り上げている|They ride over the continental plates|爬到大陸板塊上方","海洋プレートのほうが下にしずみこみます。|Ocean plates go underneath.|海洋板塊是往下隱沒。"],["まったく動いていない|They don't move|完全不動","プレートは1年に数cmずつ動いています。|Plates move a few cm per year.|板塊每年移動數公分。"],["日本からはなれている|They move away from Japan|遠離日本","日本の下に向かって動いています。|They move toward and under Japan.|是朝日本下方移動。"]],
    "海洋プレートが大陸プレートの下にしずみこむ → ひずみがたまり地震が起こる。震源は太平洋側で浅く、日本海側ほど深い。|Ocean plates subduct under continental plates → strain builds → quakes. Foci are shallow on the Pacific side and deeper toward the Sea of Japan.|海洋板塊隱沒到大陸板塊下 → 累積應力 → 發生地震；震源在太平洋側淺、往日本海側越深。"),
  Q("緊急地震速報のしくみは？|How does Japan's Earthquake Early Warning work?|日本緊急地震速報的原理是？","P波を感知して、S波が来る前に知らせる|It detects P waves and warns before S waves arrive|偵測到 P 波後，在 S 波到達前發出警報",
    [["地震が起こる前に予知して知らせる|It predicts quakes before they happen|在地震發生前預測並通知","地震の発生を前もって予知することはできません。|Quakes can't be predicted in advance.|無法事先預測地震發生。"],["S波を感知してから知らせる|It warns after detecting S waves|偵測到 S 波後才通知","S波が来てからでは大きなゆれに間に合いません。|After S waves it would be too late.|S 波到了才通知就來不及了。"],["津波を見てから知らせる|It warns after seeing a tsunami|看到海嘯後才通知","地震のゆれの予報です。P波を使います。|It warns of shaking using P waves.|是地震搖晃的預報，利用 P 波。"]],
    "P波はS波より速い。その差を使い、大きなゆれ（S波）の前に知らせる。|P waves are faster than S waves; the gap gives warning time.|P 波比 S 波快，利用時間差在大搖晃（S 波）前發出通知。"),
];

// 地層：柱状図
const LAY=[["れき|gravel|礫",0],["砂|sand|砂",1],["泥|mud|泥",2],["凝灰岩|tuff|凝灰岩",3],["石灰岩|limestone|石灰岩",4]];
function layPat(k,x,y,w,h){ let b=`<rect x="${x}" y="${y}" width="${w}" height="${h}" class="${k===3?"ac":"bx"}"/>`;
  if(k===0) for(let i=0;i<6;i++) b+=`<circle cx="${x+10+i*10}" cy="${y+h/2+(i%2?4:-4)}" r="3.6" class="o"/>`;
  if(k===1) for(let i=0;i<14;i++) b+=`<circle cx="${x+5+i*5}" cy="${y+h/2+(i%2?3:-3)}" r="1.3" class="kf"/>`;
  if(k===2) for(let i=0;i<3;i++) b+=L(x+6,y+6+i*6,x+w-6,y+6+i*6,"k");
  if(k===3) for(let i=0;i<7;i++) b+=`<path d="M${x+6+i*10} ${y+h-6} l4 -8 l4 8" class="k"/>`;
  if(k===4) for(let i=0;i<2;i++) b+=L(x,y+8+i*9,x+w,y+8+i*9,"k")+L(x+18+i*20,y+8+i*9,x+18+i*20,y+17+i*9,"k");
  return b; }
function strata(){ const order=shuf(LAY.map((_,i)=>i)); const h=26; let b="";
  order.forEach((k,i)=>{ b+=layPat(k,60,10+i*h,74,h)+T(48,10+i*h+h/2+5,LET[i],"lb","end")+T(144,10+i*h+h/2+4,X(LAY[k][0]),"xs","start"); });
  const fig=SV(220,10+h*5+10,b); const pos=k=>LET[order.indexOf(k)];
  const qs=[["最も古いと考えられる層は？（地層の逆転はない）|Which layer is the oldest? (no overturning)|最古老的地層是？（地層沒有倒轉）",LET[4],"地層はふつう下にあるものほど古い。|Lower layers are usually older.|地層通常越下面越古老。",l=>X(`${l} より下に古い層があります。|There are older layers below ${l}.|${l} 下面還有更古老的地層。`)],
    ["火山の噴火があったと分かる層は？|Which layer shows a volcanic eruption?|哪一層可以知道曾有火山噴發？",pos(3),"凝灰岩は火山灰などが積もってできた岩石。|Tuff forms from volcanic ash.|凝灰岩是火山灰等堆積形成的岩石。",l=>X(`${l} は${X(LAY[order[LET.indexOf(l)]][0])}の層です。|${l} is ${X(LAY[order[LET.indexOf(l)]][0])}.|${l} 是${X(LAY[order[LET.indexOf(l)]][0])}層。`)],
    ["粒が最も大きく、河口や海岸に近い浅い所で積もったと考えられる層は？|Which layer has the biggest grains, deposited near a river mouth or shore?|顆粒最大、被認為是在河口或海岸附近淺處堆積的地層是？",pos(0),"粒が大きいれき（2 mm以上）は重く、岸の近くで先に沈む。|Big gravel (≥2 mm) sinks first, near shore.|大顆粒的礫（2 mm以上）較重，在岸邊先沉積。",l=>X(`${l} は${X(LAY[order[LET.indexOf(l)]][0])}の層です。粒の大きさを比べよう。|${l} is ${X(LAY[order[LET.indexOf(l)]][0])}. Compare grain sizes.|${l} 是${X(LAY[order[LET.indexOf(l)]][0])}層，比較顆粒大小。`)],
    ["粒が最も小さく、岸から遠い沖で積もったと考えられる層は？|Which layer has the finest grains, deposited far offshore?|顆粒最小、被認為是在離岸較遠處堆積的地層是？",pos(2),"泥（1/16 mm以下）は軽く、沖まで運ばれて積もる。|Mud (≤1/16 mm) is carried far offshore.|泥（1/16 mm以下）較輕，會被搬運到外海堆積。",l=>X(`${l} は${X(LAY[order[LET.indexOf(l)]][0])}の層です。粒の大きさを比べよう。|${l} is ${X(LAY[order[LET.indexOf(l)]][0])}. Compare grain sizes.|${l} 是${X(LAY[order[LET.indexOf(l)]][0])}層，比較顆粒大小。`)]];
  const [q,a,exp,why]=pick(qs);
  return {q:X(q)+fig,ans:a,wrongs:shuf(LET.slice(0,5).split("").filter(l=>l!==a)).slice(0,3).map(l=>({v:l,why:why(l)})),exp:X(exp),tf:v=>X(q)+fig+`→ ${v}`,kind:"fig"}; }
const earth3=[strata,strata,strata,strata,
  Q("サンゴの化石をふくむ地層は、どんな環境で積もった？|A layer with coral fossils formed in…|含有珊瑚化石的地層，是在什麼環境堆積的？","あたたかくて浅い海|A warm, shallow sea|溫暖的淺海",
    [["冷たくて深い海|A cold, deep sea|寒冷的深海","サンゴはあたたかく浅い海にすみます。|Coral lives in warm, shallow seas.|珊瑚生活在溫暖的淺海。"],["湖や河口|A lake or river mouth|湖泊或河口","湖や河口を示すのはシジミの化石です。|Freshwater clams (shijimi) show lakes or river mouths.|表示湖泊或河口的是蜆的化石。"],["陸上の森|A forest on land|陸地上的森林","サンゴは海の生物です。|Coral is a sea creature.|珊瑚是海洋生物。"]],
    "示相化石：当時の環境が分かる（サンゴ→あたたかく浅い海、シジミ→河口や湖）。|Facies fossils show past environments (coral → warm shallow sea; shijimi clam → river mouth/lake).|指相化石：可知當時環境（珊瑚→溫暖淺海，蜆→河口或湖泊）。"),
  Q("アンモナイトの化石が見つかった地層ができた時代は？|A layer with ammonite fossils formed in which era?|發現菊石化石的地層，是在哪個時代形成的？","中生代|Mesozoic|中生代",
    [["古生代|Paleozoic|古生代","古生代の示準化石は三葉虫やフズリナです。|Paleozoic index fossils: trilobites, fusulinids.|古生代的標準化石是三葉蟲、紡錘蟲。"],["新生代|Cenozoic|新生代","新生代の示準化石はビカリアやナウマンゾウです。|Cenozoic: Vicarya, Naumann's elephant.|新生代的標準化石是維卡里亞螺、諾氏古菱齒象。"],["どの時代か分からない|Can't tell|無法判斷","アンモナイトは時代が分かる示準化石です。|Ammonites are index fossils.|菊石是可判斷年代的標準化石。"]],
    "示準化石：古生代＝三葉虫・フズリナ、中生代＝アンモナイト・恐竜、新生代＝ビカリア・ナウマンゾウ。|Index fossils: Paleozoic = trilobites, fusulinids; Mesozoic = ammonites, dinosaurs; Cenozoic = Vicarya, Naumann's elephant.|標準化石：古生代＝三葉蟲、紡錘蟲；中生代＝菊石、恐龍；新生代＝維卡里亞螺、諾氏古菱齒象。"),
  Q("うすい塩酸をかけると気体（二酸化炭素）が出る岩石は？|Which rock gives off gas (CO₂) with dilute hydrochloric acid?|滴上稀鹽酸會產生氣體（二氧化碳）的岩石是？","石灰岩|Limestone|石灰岩",
    [["チャート|Chert|燧石","チャートは塩酸と反応せず、とてもかたい岩石です。|Chert doesn't react and is very hard.|燧石不和鹽酸反應，非常堅硬。"],["花こう岩|Granite|花崗岩","花こう岩は火成岩で、塩酸で気体は出ません。|Granite is igneous; no gas.|花崗岩是火成岩，滴鹽酸不會產生氣體。"],["凝灰岩|Tuff|凝灰岩","凝灰岩は火山灰が固まった岩石です。|Tuff is hardened volcanic ash.|凝灰岩是火山灰凝固的岩石。"]],
    "石灰岩：塩酸で二酸化炭素が出る。チャート：反応しない・鉄のくぎで傷がつかないほどかたい。|Limestone fizzes (CO₂) in acid. Chert doesn't, and is too hard to scratch with an iron nail.|石灰岩：遇鹽酸產生二氧化碳。燧石：不反應，硬到鐵釘也刮不出痕跡。"),
  Q("堆積岩の粒が丸みをおびているのはなぜ？|Why are the grains in sedimentary rock rounded?|沉積岩的顆粒為什麼是圓的？","流れる水に運ばれる間にけずられたから|They were worn down while carried by water|被流水搬運時磨圓了",
    [["マグマが冷えて固まったから|Magma cooled|岩漿冷卻凝固","マグマからできるのは火成岩で、粒は角ばっています。|Igneous rocks from magma have angular grains.|岩漿形成的是火成岩，顆粒有稜角。"],["生物がつくったから|Living things made them|生物製造的","丸みは水に運ばれたしるしです。|Roundness shows transport by water.|圓滑是被水搬運的證據。"],["はじめから丸かったから|They were always round|本來就是圓的","川を流れる間にぶつかり合ってけずられます。|They collide and wear down in rivers.|在河中互相碰撞而被磨圓。"]],
    "堆積岩の粒は流水で運ばれて丸い。火山灰がもとの凝灰岩や火成岩の粒は角ばっている。|Sedimentary grains are rounded by water; tuff and igneous grains are angular.|沉積岩顆粒因流水搬運而圓滑；凝灰岩、火成岩顆粒有稜角。"),
  Q("離れた場所の地層を比べるとき、目印（かぎ層）になりやすい層は？|Which layer is a good key bed for matching distant strata?|比較不同地點的地層時，容易成為標準層（鍵層）的是？","火山灰の層（凝灰岩）|A volcanic ash layer (tuff)|火山灰層（凝灰岩）",
    [["泥の層|A mud layer|泥層","泥の層は多くの時代・場所にあり、目印になりにくいです。|Mud layers are common, so hard to match.|泥層在許多時代、地點都有，不易當標記。"],["砂の層|A sand layer|砂層","砂の層もいろいろな所にあります。|Sand layers are common too.|砂層也到處都有。"],["表面の土|Topsoil|表土","表面の土は地層を比べる目印になりません。|Topsoil isn't a marker.|表土不能當比較地層的標記。"]],
    "火山灰は短い期間に広い範囲に積もるので、かぎ層になる。|Ash falls widely in a short time, making a key bed.|火山灰在短時間內廣泛堆積，所以能當鍵層。"),
];

// 大地の変動：断層としゅう曲
const FIG_FAULT=(()=>{ let b=""; // A：正断層（引っぱる力）
  for(let i=0;i<4;i++){ b+=`<polygon points="10,${24+i*14} 62,${24+i*14} ${62+7},${38+i*14} 10,${38+i*14}" class="${i%2?"ac":"bx"}"/>`; b+=`<polygon points="${66+4},${40+i*14} 122,${40+i*14} 122,${54+i*14} ${66+11},${54+i*14}" class="${i%2?"ac":"bx"}"/>`; }
  b+=L(60,14,84,96,"o")+AR(30,104,4,104,"k")+AR(100,104,126,104,"k")+T(66,124,"A");
  // B：逆断層（おす力）
  for(let i=0;i<4;i++){ b+=`<polygon points="150,${40+i*14} ${200},${40+i*14} ${200+7},${54+i*14} 150,${54+i*14}" class="${i%2?"ac":"bx"}"/>`; b+=`<polygon points="${204+4},${24+i*14} 262,${24+i*14} 262,${38+i*14} ${204+11},${38+i*14}" class="${i%2?"ac":"bx"}"/>`; }
  b+=L(198,14,222,96,"o")+AR(144,104,170,104,"k")+AR(268,104,242,104,"k")+T(206,124,"B");
  // C：しゅう曲
  for(let i=0;i<4;i++) b+=`<path d="M290 ${40+i*14} Q320 ${10+i*14} 350 ${40+i*14} Q380 ${70+i*14} 410 ${40+i*14}" class="${i%2?"ln":"o"}"/>`;
  b+=AR(284,104,308,104,"k")+AR(416,104,392,104,"k")+T(350,124,"C"); return SV(420,132,b); })();
const earth4=[
  Q("図の A の断層は、どんな力ではたらいてできた？（矢印は力の向き）|What force made fault A? (arrows show the force)|圖中 A 的斷層是受什麼力形成的？（箭頭為力的方向）","左右に引っぱる力|Pulling apart|向左右拉扯的力",
    [["左右からおす力|Pushing together|從左右推擠的力","おす力でできるのは B のような断層（逆断層）です。|Pushing makes faults like B (reverse faults).|推擠形成的是像 B 的斷層（逆斷層）。"],["下から持ち上げる力だけ|Only lifting from below|只有從下面抬起的力","矢印の向きを見よう。左右に引っぱられています。|See the arrows: it is pulled apart.|看箭頭方向，是向左右拉。"],["力ははたらいていない|No force|沒有受力","地層がずれるには大きな力が必要です。|Strata only slip under big forces.|地層要錯動需要很大的力。"]],
    "引っぱる力 → 正断層（A）。おす力 → 逆断層（B）・しゅう曲（C）。|Pulling → normal fault (A). Pushing → reverse fault (B), folds (C).|拉張力 → 正斷層（A）；擠壓力 → 逆斷層（B）、褶皺（C）。",FIG_FAULT),
  Q("図の C のように、地層が波打つように曲がったものを何という？|What is it called when strata bend like C?|像圖中 C 那樣地層彎曲成波浪狀，叫做？","しゅう曲|Fold|褶皺",
    [["断層|Fault|斷層","断層は地層が切れてずれたもの（A・B）です。|A fault is a break with slip (A, B).|斷層是地層斷開並錯動（A、B）。"],["不整合|Unconformity|不整合","不整合は地層の重なりが途中でとぎれた面です。|An unconformity is a gap in the layers.|不整合是地層堆積中斷的面。"],["柱状図|Columnar section|地層柱狀圖","柱状図は地層の重なりを表した図です。|A columnar section is a diagram of layers.|地層柱狀圖是表示地層堆疊的圖。"]],
    "しゅう曲：左右からおす大きな力で、地層が曲がったもの。|Fold: strata bent by strong pushing from both sides.|褶皺：地層受到兩側強大擠壓力而彎曲。",FIG_FAULT),
  Q("山の上の地層から海の生物の化石が見つかるのはなぜ？|Why are sea fossils found in strata on mountains?|山上的地層為什麼會找到海洋生物的化石？","海底でできた地層が隆起したから|Seafloor strata were uplifted|海底形成的地層隆起了",
    [["海の生物が山に登ったから|Sea animals climbed up|海洋生物爬上山","化石の生物は海でくらしていました。|Those animals lived in the sea.|化石生物原本生活在海裡。"],["大地が沈降したから|The land sank|大地沉降","沈降では地層は低くなります。|Sinking makes strata lower.|沉降會讓地層變低。"],["雨で運ばれたから|Rain carried them up|被雨水搬上去","雨は高い所へ物を運びません。|Rain doesn't carry things uphill.|雨水不會把東西搬到高處。"]],
    "大地が持ち上がる＝隆起、しずむ＝沈降。海でできた地層が隆起すると陸や山になる。|Uplift raises land; subsidence lowers it. Uplifted seafloor becomes land or mountains.|大地抬升＝隆起，下沉＝沉降；海中形成的地層隆起後變成陸地或山。"),
  Q("海岸ぞいに階段のような地形（海岸段丘）ができるのは？|Stepped coastal terraces form when…|沿著海岸形成階梯狀地形（海階）是因為？","大地の隆起が何度かくり返されたから|Uplift happened several times|大地多次隆起",
    [["大地が沈降したから|The land sank|大地沉降","沈降すると谷に海水が入りこみ、入り組んだ海岸（リアス海岸）になります。|Sinking floods valleys into a ria coast.|沉降會讓海水進入山谷，形成曲折的海岸（谷灣海岸）。"],["火山が噴火したから|A volcano erupted|火山噴發","段丘は海の波がけずった平らな面が持ち上がったものです。|Terraces are wave-cut flats that were raised.|海階是被海浪侵蝕的平面被抬升形成的。"],["川が土砂を運んだから|Rivers brought sediment|河流搬運泥沙","川の土砂が積もってできるのは三角州などです。|River sediment builds deltas.|河流泥沙堆積形成的是三角洲等。"]],
    "海岸段丘＝隆起のくり返し。リアス海岸＝沈降。|Coastal terraces = repeated uplift. Ria coast = subsidence.|海階＝多次隆起；谷灣海岸＝沉降。"),
  Q("火山がもたらす「めぐみ」はどれ？|Which is a benefit (blessing) from volcanoes?|火山帶來的「恩惠」是？","温泉や地熱発電|Hot springs and geothermal power|溫泉和地熱發電",
    [["火砕流|Pyroclastic flows|火山碎屑流","火砕流は高温のガスと火山灰が流れ下る災害です。|Pyroclastic flows are deadly hot clouds.|火山碎屑流是高溫氣體和火山灰往下流的災害。"],["液状化|Liquefaction|土壤液化","液状化は地震で地面が液体のようになる災害です。|Liquefaction is a quake hazard.|土壤液化是地震時地面像液體一樣的災害。"],["津波|Tsunami|海嘯","津波は地震などで起こる災害です。|Tsunamis are disasters.|海嘯是地震等引起的災害。"]],
    "めぐみ：温泉・地熱発電・美しい景観・豊かな地下水。災害：火砕流・火山灰・溶岩流。|Benefits: hot springs, geothermal power, scenery, groundwater. Hazards: pyroclastic flows, ash, lava.|恩惠：溫泉、地熱發電、美景、豐富地下水；災害：火山碎屑流、火山灰、熔岩流。"),
  Q("地震のときに、うめ立て地などで地面が液体のようになる現象は？|In a quake, ground on reclaimed land behaving like liquid is called…|地震時，填海地等地面變得像液體一樣的現象叫做？","液状化|Liquefaction|土壤液化",
    [["隆起|Uplift|隆起","隆起は大地が持ち上がることです。|Uplift is land rising.|隆起是大地抬升。"],["しゅう曲|Folding|褶皺","しゅう曲は地層が曲がることです。|Folding is strata bending.|褶皺是地層彎曲。"],["風化|Weathering|風化","風化は岩石がもろくなることです。|Weathering is rocks breaking down.|風化是岩石變得脆弱。"]],
    "液状化：水をふくむ砂の地面がゆれで液体のようになる。ハザードマップで危険な場所を確かめる。|Liquefaction: wet sandy ground turns liquid-like. Check hazard maps.|土壤液化：含水的砂質地面因搖晃變得像液體。用災害潛勢圖確認危險地點。"),
  Q("ずれた跡があり、今後もずれて地震を起こす可能性がある断層を何という？|A fault that may slip again and cause quakes is called…|有錯動痕跡、今後仍可能錯動引發地震的斷層叫做？","活断層|Active fault|活斷層",
    [["正断層|Normal fault|正斷層","正断層は引っぱる力でできた断層の種類です。|A normal fault is a type, from pulling.|正斷層是拉張力形成的斷層種類。"],["逆断層|Reverse fault|逆斷層","逆断層はおす力でできた断層の種類です。|A reverse fault is a type, from pushing.|逆斷層是擠壓力形成的斷層種類。"],["しゅう曲|Fold|褶皺","しゅう曲は地層が曲がったものです。|A fold is bent strata.|褶皺是地層彎曲。"]],
    "活断層：くり返しずれてきた断層で、これからも地震を起こすおそれがある。|Active fault: has slipped repeatedly and may again.|活斷層：曾反覆錯動，今後仍可能引發地震。"),
];
