/* 45 Study 理科（tools/build.py が src/sci/*.js から作る。直接編集しない） */
/* 45 Study 理科：問題をその場で作る（計算問題の数字は毎回かわる）。tools/build.py が src/sci/*.js をつなげて sci.js を作る。
   単元の並び：中学校学習指導要領（平成29年告示）理科 第1学年（第1分野(1)(2)・第2分野(1)(2)）。教科書の順に 生物 → 物質 → 光・音・力 → 大地
   ことば：文は "日本語|English|繁體中文" の3つを | でつなげて書き、X() で今の言語を取り出す。簡体字は build.py が sci.js 全体を変換して sci_zh.js を作る。
   gen() が返すもの：{ q:問題, ans:答え, wrongs:[{v,why}], exp:解き方, tf:v=>○×の文, kind } （どれもHTML。MATH と同じ形） */
const SCI=(()=>{
const LG=(()=>{ let l=null; try{ l=JSON.parse(localStorage.getItem("s_lang")); }catch(e){} if(!l){ const n=(navigator.language||"ja").toLowerCase(); l=n.startsWith("zh")?"zh":n.startsWith("ja")?"ja":"en"; } return {ja:0,en:1,"zh-Hant":2,zh:2}[l]??1; })();
const X=s=>{ if(typeof s!=="string") return s; const a=s.split("|"); return a.length===3?a[LG]:s; };
const R=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const fm=(n,d=2)=>String(+(+n).toFixed(d));          // 2.70 → "2.7"
const LET="ABCDEF";
const UQ=(ans,ws)=>{ const seen=new Set([String(ans)]); return ws.filter(w=>!seen.has(String(w.v))&&seen.add(String(w.v))); };   // 同じ誤答をのぞく
/* 図 */
const SV=(w,h,body)=>`<svg class="fig" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
const T=(x,y,s,c="lb",a="middle")=>`<text x="${x}" y="${y}" class="${c}" text-anchor="${a}">${s}</text>`;
const L=(x1,y1,x2,y2,c="k")=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${c}"/>`;
// 矢印（先の三角つき）
function AR(x1,y1,x2,y2,c="ar"){ const a=Math.atan2(y2-y1,x2-x1),h=9,w=5; const bx=x2-h*Math.cos(a),by=y2-h*Math.sin(a);
  const p=[[x2,y2],[bx+w*Math.sin(a),by-w*Math.cos(a)],[bx-w*Math.sin(a),by+w*Math.cos(a)]].map(q=>q.map(v=>v.toFixed(1)).join(",")).join(" ");
  return `<line x1="${x1}" y1="${y1}" x2="${bx.toFixed(1)}" y2="${by.toFixed(1)}" class="${c}"/><polygon points="${p}" class="${c==="ar"?"ah":"kf"}"/>`; }
// 引き出し線つきの記号
const TAG=(lx,ly,px,py,s)=>L(lx+(px>lx?8:-8),ly-5,px,py,"k")+T(lx,ly,s);
/* 文の問題：[問題, 答え, [[誤答,理由]×3], 解き方, 図] → 問題を作る関数 */
function Q(q,ans,ws,exp,fig){ return ()=>{ const qq=X(q)+(fig?(typeof fig==="function"?fig():fig):""); return {q:qq,ans:X(ans),wrongs:ws.map(([v,why])=>({v:X(v),why:X(why)})),exp:X(exp),tf:v=>`${qq}<br>→ ${v}`,kind:fig?"fig":"word"}; }; }
// 計算の誤答：答えと同じ・同じ値はのぞき、足りなければ近い数で埋める
function WN(ans,list,unit,step){ const out=[],seen=new Set([fm(ans)]);
  for(const [v,why] of list){ if(v==null||!isFinite(v)||v<=0) continue; const k=fm(v); if(seen.has(k)) continue; seen.add(k); out.push({v:k+unit,why}); }
  for(const d of [1,-1,2,-2,3,-3]){ if(out.length>=3) break; const v=+(ans+d*step).toFixed(3); if(v<=0||seen.has(fm(v))) continue; seen.add(fm(v)); out.push({v:fm(v)+unit,why:X("計算ミスです。下の解き方で確かめよう。|A calculation slip. Check with the steps below.|計算錯誤。用下面的解法確認看看。")}); }
  return out.slice(0,3); }
const C=(q,ans,unit,ws,exp,fig)=>({q:q+(fig||""),ans:fm(ans)+unit,wrongs:WN(ans,ws,unit,Math.max(.1,Math.abs(ans)>=20?Math.round(Math.abs(ans)/10):1)),exp,tf:v=>`${q}${fig||""}<br>→ ${v}`,kind:fig?"fig":"calc"});
// 記号で答える問題の誤答（選んだ記号ごとの理由）
const WL=(ans,whyOf,letters)=>letters.filter(l=>l!==ans).slice(0,3).map(l=>({v:l,why:whyOf(l)}));
// 2つのなかまに分ける（なかま分け）：sets=[名前A,名前B]、items=[[ことば, 0か1, ひとこと]]
function SORT(a,b,items){ return items.map(([w,s,hint])=>()=>{ const A=X(a),B=X(b),ok=s?B:A,ng=s?A:B,ww=X(w);
  const why=X(`「${ww}」は「${ok}」のなかまです。|"${ww}" belongs to "${ok}".|「${ww}」屬於「${ok}」。`)+(hint?" "+X(hint):"");
  const mem=items.filter(x=>x[1]===s).map(x=>X(x[0])).join(X("、|, |、"));
  return {q:`<div class="srt">${ww}</div>`,ans:ok,wrongs:[{v:ng,why}],opts:[A,B],exp:X(`「${ok}」のなかま：|"${ok}": |「${ok}」：`)+mem,sec:6,tf:v=>X(`「${ww}」は「${v}」のなかま|"${ww}" belongs to "${v}"|「${ww}」屬於「${v}」`),kind:"sort",fwhy:why}; }); }
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
    "シダ植物：根・茎・葉の区別あり、胞子でふえる（イヌワラビ・スギナ）。|Ferns: roots, stems, leaves; spores (e.g. Japanese painted fern, horsetail).|蕨類：有根莖葉，用孢子繁殖（例如蹄蓋蕨、問荊）。"),
  Q("コケ植物の「仮根」のおもなはたらきは？|What do moss rhizoids mainly do?|苔蘚「假根」的主要功能是？","体を地面などに固定する|Hold the plant to the ground|把身體固定在地面等處",
    [["水を吸収する|Absorb water|吸收水分","コケ植物は水を体の表面全体から吸収します。|Mosses absorb water through their whole surface.|苔蘚從整個身體表面吸收水分。"],["胞子をつくる|Make spores|製造孢子","胞子は胞子のうでつくられます。|Spores form in sporangia.|孢子在孢子囊中形成。"],["栄養分をたくわえる|Store food|儲存養分","仮根は体を固定するためのものです。|Rhizoids anchor the plant.|假根是用來固定身體的。"]],
    "コケ植物：根・茎・葉の区別なし。仮根で体を固定し、水は体の表面から。|Mosses: no true roots/stems/leaves; rhizoids anchor; water through the surface.|苔蘚：沒有根莖葉的區別，用假根固定，從表面吸水。"),
  Q("イヌワラビの茎はどこにある？|Where is the stem of a Japanese painted fern?|蹄蓋蕨的莖在哪裡？","地下（地下茎）|Underground (rhizome)|地下（地下莖）",
    [["地上にまっすぐ立っている|Standing up above ground|直立在地面上","地上に出ているのは葉です。茎は地下にあります。|What you see above ground are leaves; the stem is underground.|地面上的是葉，莖在地下。"],["葉の先|At the leaf tip|葉子的尖端","葉の先にあるのは葉の一部です。|The tip is part of the leaf.|葉尖是葉子的一部分。"],["茎はない|It has no stem|沒有莖","シダ植物には根・茎・葉の区別があります。|Ferns do have stems.|蕨類有根、莖、葉的區別。"]],
    "イヌワラビは地下茎。地上に出ているのは葉。|Japanese painted fern: the stem is a rhizome; above ground is leaves.|蹄蓋蕨的莖是地下莖，地面上的是葉。"),
  Q("ゼニゴケで、胞子のうがあるのは？|In liverworts (Marchantia), where are the sporangia?|地錢的孢子囊在哪一株？","雌株|Female plants|雌株",
    [["雄株|Male plants|雄株","雄株は精子をつくります。胞子のうは雌株です。|Male plants make sperm; sporangia are on females.|雄株產生精子，孢子囊在雌株。"],["両方|Both|兩者都有","胞子のうができるのは雌株だけです。|Only female plants make sporangia.|只有雌株會形成孢子囊。"],["仮根|The rhizoids|假根","仮根は体を固定する部分です。|Rhizoids anchor the plant.|假根是固定身體的部分。"]],
    "ゼニゴケ・スギゴケは雌株と雄株があり、雌株に胞子のうができる。|Liverworts/mosses have male and female plants; sporangia form on females.|地錢、杉葉蘚分雌株和雄株，雌株會形成孢子囊。"),
  Q("シダ植物はどれ？|Which is a fern?|哪一個是蕨類植物？","スギナ|Horsetail|問荊",
    [["スギゴケ|Haircap moss|杉葉蘚","スギゴケはコケ植物です。|Haircap moss is a moss.|杉葉蘚是苔蘚。"],["スギ|Japanese cedar|日本柳杉","スギは種子をつくる裸子植物です。|Cedar is a seed-making gymnosperm.|柳杉是會產生種子的裸子植物。"],["ゼニゴケ|Liverwort|地錢","ゼニゴケはコケ植物です。|Liverwort is a bryophyte (moss group).|地錢是苔蘚植物。"]],
    "シダ植物：イヌワラビ・スギナ・ゼンマイ。コケ植物：ゼニゴケ・スギゴケ。|Ferns: Japanese painted fern, horsetail, royal fern. Mosses: liverwort, haircap moss.|蕨類：蹄蓋蕨、問荊、紫萁。苔蘚：地錢、杉葉蘚。"),
];

// 動物の分類：特徴の表（1つかくす）
const ANI=["魚類|Fish|魚類","両生類|Amphibians|兩生類","は虫類|Reptiles|爬蟲類","鳥類|Birds|鳥類","哺乳類|Mammals|哺乳類"];
// セルの「/」は図では改行、選択肢では「 / 」
const ANI_R=[["呼吸|Breathing|呼吸",["えら|Gills|鰓","子:えら・皮膚/親:肺・皮膚|Young: gills, skin/Adult: lungs, skin|幼:鰓、皮膚/成:肺、皮膚","肺|Lungs|肺","肺|Lungs|肺","肺|Lungs|肺"],["気管|Tracheae|氣管"]],
  ["体表|Body cover|體表",["うろこ|Scales|鱗片","しめった皮膚|Moist skin|濕潤的皮膚","かたいうろこ|Hard scales|硬鱗片","羽毛|Feathers|羽毛","毛|Hair|毛"],[]],
  ["子のうまれ方|Birth|生殖方式",["卵（水中・殻なし）|Eggs in water|卵（水中・無殼）","卵（水中・殻なし）|Eggs in water|卵（水中・無殼）","卵（陸上・殻あり）|Shelled eggs, land|卵（陸上・有殼）","卵（陸上・殻あり）|Shelled eggs, land|卵（陸上・有殼）","胎生|Live birth|胎生"],["卵（陸上・殻なし）|Unshelled eggs, land|卵（陸上・無殼）"]]];
// 表は「なかま（行）× 特徴（列）」。A は r=特徴, c=なかま
function aniFig(r,c){ let b=""; const x0=70,cw=110,y0=26,rh=30;
  ANI_R.forEach(([rn],ri)=>{ b+=T(x0+cw*ri+cw/2,18,X(rn),"xs"); });
  ANI.forEach((n,ci)=>{ const y=y0+rh*ci; b+=`<rect x="2" y="${y}" width="${x0-4}" height="${rh-4}" rx="4" class="bx"/>`+T(x0/2,y+rh/2+2,X(n),"xs");
    ANI_R.forEach(([,cells],ri)=>{ const on=ri===r&&ci===c,cx=x0+cw*ri+cw/2,ln=X(cells[ci]).split("/"); b+=`<rect x="${x0+cw*ri+2}" y="${y}" width="${cw-4}" height="${rh-4}" rx="4" class="${on?"ac":"bx"}"/>`+
      (on?T(cx,y+rh/2+2,"A","lb"):ln.length>1?T(cx,y+11,ln[0],"xs")+T(cx,y+23,ln[1],"xs"):T(cx,y+rh/2+2,ln[0],"xs")); }); });
  return SV(x0+cw*3+4,y0+rh*5+4,b); }
const ANI_S=s=>X(s).replace("/"," / ");
function aniTable(){ const r=R(0,2),c=R(0,4); const [rn,cells,extra]=ANI_R[r]; const ans=ANI_S(cells[c]); const fig=aniFig(r,c);
  const opts=[...new Set([...cells.map(ANI_S),...extra.map(ANI_S)])].filter(v=>v!==ans);
  const ws=shuf(opts).slice(0,3).map(v=>{ const who=cells.map((x,i)=>ANI_S(x)===v?X(ANI[i]):null).filter(Boolean);
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
/* ========== ② 身の回りの物質（第1分野(2)） ========== */
// ガスバーナー：A 空気調節ねじ（上） B ガス調節ねじ（下）
const FIG_GB=SV(220,220,`<path d="M100 38 Q92 18 100 4 Q108 18 100 38 Z" class="ac"/><path d="M100 36 Q96 26 100 18 Q104 26 100 36 Z" class="kf"/>`+
  `<rect x="88" y="40" width="24" height="150" rx="2" class="os"/><rect x="80" y="118" width="40" height="16" rx="3" class="ac"/><rect x="83" y="150" width="34" height="13" rx="3" class="ac"/>`+
  `<rect x="112" y="172" width="58" height="10" rx="3" class="os"/><ellipse cx="100" cy="200" rx="54" ry="11" class="os"/>`+TAG(168,126,121,126,"A")+TAG(40,160,82,156,"B"));
const MV="|g/cm³|";   // 単位
const mat1=[
  ()=>{ const a=pick(["A","B"]); const nm={A:"空気調節ねじ|Air adjustment screw|空氣調節輪",B:"ガス調節ねじ|Gas adjustment screw|瓦斯調節輪"};
    return {q:X(`図のガスバーナーで、${a} のねじの名前は？|In the burner, what is screw ${a}?|圖中本生燈的 ${a} 是？`)+FIG_GB,ans:X(nm[a]),
      wrongs:[{v:X(nm[a==="A"?"B":"A"]),why:X(`上が空気調節ねじ、下がガス調節ねじです。|The upper one adjusts air, the lower one gas.|上面是空氣調節輪，下面是瓦斯調節輪。`)},{v:X("元栓|Main gas valve|總開關"),why:X("元栓はガス管の口にある栓です。|The main valve is at the gas outlet.|總開關在瓦斯管的出口。")},{v:X("コック|Cock (stopcock)|旋塞","コック"),why:X("コックはバーナーにつながるガスの通り道を開け閉めするものです。|The cock opens the gas line to the burner.|旋塞是開關通往燈的瓦斯通道。")}],
      exp:X("上：空気調節ねじ（炎の色）、下：ガス調節ねじ（炎の大きさ）。|Upper: air (flame color). Lower: gas (flame size).|上：空氣調節輪（火焰顏色），下：瓦斯調節輪（火焰大小）。"),tf:v=>X(`図の ${a} は|Screw ${a} is|圖中的 ${a} 是`)+FIG_GB+`→ ${v}`,kind:"fig"}; },
  Q("ガスバーナーの炎がオレンジ色でゆらゆらしている。どうする？|The flame is orange and flickering. What do you do?|本生燈的火焰是橘色、搖搖晃晃。該怎麼做？","空気調節ねじを開いて空気を入れ、青い炎にする|Open the air screw to make a blue flame|打開空氣調節輪讓空氣進入，變成藍色火焰",
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
const GAS_NM={A:"水上置換法|Water displacement|排水集氣法",B:"上方置換法|Upward delivery|向下排空氣法",C:"下方置換法|Downward delivery|向上排空氣法"};
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
    "アンモニア：刺激臭、水にとけやすい（アルカリ性）、空気より軽い → 上方置換法。|Ammonia: sharp smell, very soluble (alkaline), lighter than air → upward delivery.|氨：刺激性氣味、極易溶於水（鹼性）、比空氣輕 → 向下排空氣法。"),
  gq("空気中にいちばん多くふくまれている気体は？|Which gas makes up most of the air?|空氣中含量最多的氣體是？","Z",
    [["O","酸素は約21%で2番目です。|Oxygen is about 21%, second.|氧氣約21%，排第二。"],["C","二酸化炭素は約0.04%しかありません。|CO₂ is only about 0.04%.|二氧化碳只有約0.04%。"],["H","水素は空気中にほとんどありません。|Air has almost no hydrogen.|空氣中幾乎沒有氫氣。"]],
    "空気：窒素 約78%、酸素 約21%。|Air: nitrogen ~78%, oxygen ~21%.|空氣：氮氣約78%、氧氣約21%。"),
  gq("最も密度が小さい（いちばん軽い）気体は？|Which is the least dense (lightest) gas?|密度最小（最輕）的氣體是？","H",
    [["N","アンモニアも空気より軽いですが、水素ほどではありません。|Ammonia is lighter than air, but not as light as hydrogen.|氨也比空氣輕，但沒有氫氣那麼輕。"],["O","酸素は空気より少し重いです。|Oxygen is slightly heavier than air.|氧氣比空氣稍重。"],["C","二酸化炭素は空気より重いです。|CO₂ is heavier than air.|二氧化碳比空氣重。"]],
    "水素：物質の中で最も密度が小さい。水にとけにくいので水上置換法。|Hydrogen: the least dense substance; collect by water displacement.|氫氣：密度最小的物質；難溶於水，用排水集氣法。"),
  Q("アンモニアを集めるのに適した方法は？|Which method is best for collecting ammonia?|收集氨最適合的方法是？","上方置換法|Upward delivery|向下排空氣法",
    [["水上置換法|Water displacement|排水集氣法","アンモニアは水にとけやすいので水上置換法は使えません。|Ammonia dissolves in water, so you can't use water.|氨極易溶於水，不能用排水集氣法。"],["下方置換法|Downward delivery|向上排空氣法","下方置換法は空気より重い気体用です。アンモニアは軽い。|That is for heavier gases; ammonia is lighter.|那是比空氣重的氣體用的，氨比較輕。"],["ろ過|Filtration|過濾","ろ過は液体と固体を分ける方法です。|Filtration separates solids from liquids.|過濾是分離固體和液體的方法。"]],
    "水にとけやすく空気より軽い → 上方置換法。|Soluble and lighter than air → upward delivery.|易溶於水且比空氣輕 → 向下排空氣法。",FIG_GAS),
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
/* ========== ③ 身近な物理現象（第1分野(1)） ========== */
const rad=d=>d*Math.PI/180, P2=(x,y)=>`${x.toFixed(1)},${y.toFixed(1)}`;
// 光の反射：鏡の面との角を見せて反射角を聞く（入射角は法線から測る）
function reflAng(){ const surf=Math.random()<.6; const th=pick(surf?[20,25,30,35,40,50,55,60,65,70]:[20,25,30,35,40,45,50,55,60]); const P=[150,150];
  let b=L(20,150,280,150,"o")+[...Array(13)].map((_,i)=>L(30+i*20,150,22+i*20,160,"k")).join("")+L(150,150,150,30,"dl")+T(160,40,X("法線|normal|法線"),"xs","start");
  let S,arc,lab;
  if(surf){ S=[P[0]-125*Math.cos(rad(th)),P[1]-125*Math.sin(rad(th))]; arc=`<path d="M120 150 A30 30 0 0 1 ${P2(150-30*Math.cos(rad(th)),150-30*Math.sin(rad(th)))}" class="k"/>`; lab=[150-46*Math.cos(rad(th/2)),150-46*Math.sin(rad(th/2))+4]; }
  else { S=[P[0]-125*Math.sin(rad(th)),P[1]-125*Math.cos(rad(th))]; arc=`<path d="M150 120 A30 30 0 0 0 ${P2(150-30*Math.sin(rad(th)),150-30*Math.cos(rad(th)))}" class="k"/>`; lab=[150-46*Math.sin(rad(th/2)),150-46*Math.cos(rad(th/2))+4]; }
  b+=AR(S[0],S[1],150,150)+arc+T(lab[0],lab[1],th+"°","sm")+T(250,145,X("鏡|mirror|鏡子"),"xs");
  const fig=SV(300,170,b); const ans=surf?90-th:th;
  const ws=surf?[[th,"鏡の面との角です。入射角・反射角は法線から測ります。|That is the angle with the mirror. Measure from the normal.|那是和鏡面的夾角。入射角、反射角要從法線量起。"],[180-2*th,"それは入射光と反射光の間の角です。|That is the angle between the two rays.|那是入射光和反射光之間的夾角。"],[90+th,"90° からひきます。|Subtract from 90°.|要用 90° 去減。"],[90-th+10,"入射角を法線から正しく測ろう。|Measure the incidence angle from the normal.|要從法線正確量出入射角。"]]
    :[[90-th,"入射角は法線との角なので、そのまま反射角と等しくなります。|The incidence angle is already from the normal; the reflection angle equals it.|入射角是和法線的夾角，反射角和它相等。"],[2*th,"それは入射光と反射光の間の角です。|That is the angle between the two rays.|那是入射光和反射光之間的夾角。"],[180-th,"反射角は入射角と等しくなります。|Reflection angle = incidence angle.|反射角等於入射角。"],[th+10,"反射角は入射角と等しくなります。|Reflection angle = incidence angle.|反射角等於入射角。"]];
  return {q:X("図のように光が鏡に当たった。反射角は何度？|Light hits a mirror as shown. What is the angle of reflection?|光如圖射到鏡子上，反射角是幾度？")+fig,ans:ans+"°",
    wrongs:UQ(ans+"°",ws.filter(([v])=>v>0).map(([v,why])=>({v:v+"°",why:X(why)}))).slice(0,3),
    exp:X(surf?`入射角 ＝ 90° − ${th}° ＝ ${ans}°。反射角 ＝ 入射角 ＝ ${ans}°|Incidence = 90° − ${th}° = ${ans}°. Reflection = incidence = ${ans}°|入射角 ＝ 90° − ${th}° ＝ ${ans}°。反射角 ＝ 入射角 ＝ ${ans}°`:`反射の法則：反射角 ＝ 入射角 ＝ ${ans}°|Law of reflection: reflection = incidence = ${ans}°|反射定律：反射角 ＝ 入射角 ＝ ${ans}°`),tf:v=>X("反射角は|The angle of reflection is|反射角是")+fig+`→ ${v}`,kind:"fig"}; }
// 光の屈折：進む向き A〜C（法線に近づく・まっすぐ・法線から離れる）
function refrDir(){ const down=Math.random()<.5; const i=down?45:40; const ang=down?{n:28,s:45,f:62}:{n:25,s:40,f:60}; const L3=shuf(["n","s","f"]); const nm={}; L3.forEach((k,j)=>nm[k]=LET[j]);
  const P=[150,100]; let b=`<rect x="10" y="100" width="280" height="90" class="wa"/>`+L(10,100,290,100,"o")+L(150,20,150,180,"dl")+T(24,90,X("空気|air|空氣"),"xs","start")+T(24,180,X("水|water|水"),"xs","start");
  const S=down?[P[0]-90*Math.sin(rad(i)),P[1]-90*Math.cos(rad(i))]:[P[0]-90*Math.sin(rad(i)),P[1]+90*Math.cos(rad(i))]; b+=AR(S[0],S[1],P[0],P[1]);
  for(const k of ["n","s","f"]){ const a=ang[k]; const E=down?[P[0]+80*Math.sin(rad(a)),P[1]+80*Math.cos(rad(a))]:[P[0]+80*Math.sin(rad(a)),P[1]-80*Math.cos(rad(a))]; b+=L(P[0],P[1],E[0],E[1],"ln2")+T(E[0]+(E[0]>P[0]?10:-10),E[1]+(down?12:-4),nm[k]); }
  const fig=SV(300,192,b); const good=down?"n":"f";
  const why={n:"法線に近づく向きです。|This bends toward the normal.|這是靠近法線的方向。",s:"境界面で光は折れ曲がります（屈折）。|Light bends at the boundary (refraction).|光在界面會偏折（折射）。",f:"法線から離れる向きです。|This bends away from the normal.|這是遠離法線的方向。"};
  const ws=["n","s","f"].filter(k=>k!==good).map(k=>({v:nm[k],why:X(why[k])+" "+X(down?"空気→水では、屈折角は入射角より小さくなります。|From air to water, the refraction angle is smaller.|從空氣到水，折射角比入射角小。":"水→空気では、屈折角は入射角より大きくなります。|From water to air, the refraction angle is larger.|從水到空氣，折射角比入射角大。")}));
  ws.push({v:X("どれでもない|None|都不是"),why:X("どれかの線が正しい向きです。|One of the lines is right.|其中有一條線是正確的方向。")});
  return {q:X(down?"光が空気中から水中へ進む。光はどの向きに進む？|Light goes from air into water. Which way does it go?|光從空氣射入水中，光會往哪個方向前進？":"光が水中から空気中へ進む。光はどの向きに進む？|Light goes from water into air. Which way does it go?|光從水中射入空氣，光會往哪個方向前進？")+fig,ans:nm[good],wrongs:ws,
    exp:X(down?"空気→水（ガラス）：法線に近づくように曲がる（屈折角 < 入射角）。|Air → water/glass: bends toward the normal (refraction < incidence).|空氣→水（玻璃）：偏向法線（折射角 < 入射角）。":"水（ガラス）→空気：法線から離れるように曲がる（屈折角 > 入射角）。入射角が大きいと全反射する。|Water/glass → air: bends away from the normal (refraction > incidence). At large angles: total internal reflection.|水（玻璃）→空氣：偏離法線（折射角 > 入射角）；入射角太大時會全反射。"),tf:v=>X("光が進むのは|The light goes along|光前進的方向是")+fig+`→ ${v}`,kind:"fig"}; }
const phys1=[reflAng,reflAng,reflAng,refrDir,refrDir,
  Q("光が鏡で反射するとき、入射角と反射角の関係は？|When light reflects off a mirror, how do the angles compare?|光在鏡子反射時，入射角和反射角的關係是？","入射角 ＝ 反射角|Incidence = reflection|入射角 ＝ 反射角",
    [["入射角 ＞ 反射角|Incidence > reflection|入射角 ＞ 反射角","反射では2つの角はいつも等しくなります。|In reflection they are always equal.|反射時兩個角永遠相等。"],["入射角 ＜ 反射角|Incidence < reflection|入射角 ＜ 反射角","反射では2つの角はいつも等しくなります。|In reflection they are always equal.|反射時兩個角永遠相等。"],["入射角 ＋ 反射角 ＝ 90°|They add to 90°|入射角 ＋ 反射角 ＝ 90°","90°になるのは、入射角とそのときの鏡の面との角です。|What adds to 90° is incidence + angle with the mirror.|和為 90° 的是入射角和鏡面夾角。"]],
    "反射の法則：入射角 ＝ 反射角（どちらも法線から測る）。|Law of reflection: incidence = reflection (both from the normal).|反射定律：入射角 ＝ 反射角（都從法線量起）。"),
  Q("ものが見えるのは、ものの表面で光がどうなるから？|We see objects because light at their surface…|我們看得到物體，是因為光在物體表面…？","いろいろな向きに反射する（乱反射）|Reflects in all directions (diffuse reflection)|向各方向反射（漫反射）",
    [["すべて吸収される|Is all absorbed|全部被吸收","すべて吸収されると、目に光が届かず見えません。|If all were absorbed, no light reaches our eyes.|全部吸收的話光到不了眼睛，就看不見。"],["まっすぐ通りぬける|Passes straight through|直接穿透","通りぬけるだけでは、ものの表面は見えません。|Passing through doesn't show the surface.|只穿透看不見物體表面。"],["すべて屈折する|All refracts|全部折射","屈折は物質の境界で光が曲がることです。|Refraction is bending at a boundary.|折射是光在物質界面偏折。"]],
    "表面のでこぼこで光がいろいろな向きに反射（乱反射）し、目に届くので見える。|Rough surfaces scatter light (diffuse reflection) into our eyes.|表面凹凸使光向各方向反射（漫反射），到達眼睛所以看得見。"),
  Q("水の入ったコップの底のコインが浮き上がって見えるのは、光の何のため？|A coin in a cup of water looks raised. Why?|裝水杯底的硬幣看起來浮起來，是因為光的什麼現象？","屈折|Refraction|折射",
    [["反射|Reflection|反射","反射ははね返ることです。水面で曲がるのは屈折です。|Reflection bounces; bending at the surface is refraction.|反射是彈回，在水面偏折是折射。"],["全反射|Total internal reflection|全反射","全反射は光がすべてはね返る現象です。|Total reflection means all light bounces back.|全反射是光全部被反射。"],["直進|Traveling straight|直進","光がまっすぐ進むなら、浮き上がって見えません。|Straight light wouldn't make it look raised.|光如果直進，就不會看起來浮起。"]],
    "水から空気へ出るとき光が屈折するため、実際より浅く（浮いて）見える。|Light refracts leaving the water, so it looks shallower.|光從水進入空氣時折射，所以看起來比實際淺。"),
  Q("光ファイバーで光が外にもれずに進むのは、何を利用している？|Optical fibers keep light inside by using…|光纖讓光不外漏地前進，是利用了什麼？","全反射|Total internal reflection|全反射",
    [["乱反射|Diffuse reflection|漫反射","乱反射は光がいろいろな向きに散ることです。|Diffuse reflection scatters light.|漫反射是光向各方向散開。"],["光の直進|Light traveling straight|光的直進","ファイバーが曲がっていても光が進むのは全反射のおかげです。|Light follows bends thanks to total reflection.|光纖彎曲光也能前進，是靠全反射。"],["屈折|Refraction|折射","屈折して外に出ると光がもれてしまいます。|Refracting out would leak the light.|折射出去光就漏掉了。"]],
    "水やガラスから空気へ進む光は、入射角が大きいとすべて反射する（全反射）。|From glass to air at large angles, all light reflects (total internal reflection).|光從玻璃射向空氣時，入射角大就會全部反射（全反射）。"),
  Q("白色光をプリズムに通すとどうなる？|What happens when white light passes through a prism?|白光通過三稜鏡會怎樣？","いろいろな色の光に分かれる|It splits into many colors|分成各種顏色的光",
    [["すべて黒くなる|It turns black|全部變黑","光は消えません。色ごとに分かれます。|Light doesn't vanish; it splits by color.|光不會消失，而是依顏色分開。"],["まっすぐ通りぬけるだけ|It just goes straight|只是直接穿過","光はプリズムで屈折します。|Light refracts in a prism.|光在三稜鏡中會折射。"],["すべて反射してもどる|It all reflects back|全部反射回來","多くの光はプリズムを通りぬけます。|Most light passes through.|大部分的光會穿過三稜鏡。"]],
    "白色光はいろいろな色の光が混ざったもの。色によって屈折のしかたがちがうので分かれる。|White light is a mix of colors; each bends differently.|白光由各色光混合，各色折射程度不同所以分開。"),
];

// 凸レンズ：物体の位置と像
const LENS_C=[["far","焦点距離の2倍より遠い|beyond 2F|比2倍焦距遠"],["2f","焦点距離の2倍の位置|at 2F|在2倍焦距處"],["mid","焦点と焦点距離の2倍の間|between F and 2F|在焦點和2倍焦距之間"],["in","焦点より内側|inside F|在焦點內側"]];
const IMG={far:"実物より小さい倒立の実像|Smaller, upside-down real image|比實物小的倒立實像","2f":"実物と同じ大きさの倒立の実像|Same-size, upside-down real image|和實物一樣大的倒立實像",mid:"実物より大きい倒立の実像|Larger, upside-down real image|比實物大的倒立實像",in:"スクリーンにはうつらない（レンズを通すと正立の虚像が見える）|No image on the screen (a virtual image is seen through the lens)|屏幕上沒有像（透過透鏡可看到正立虛像）"};
const IMG_W={far:"焦点距離の2倍より遠いと、像は小さくなります。|Beyond 2F the image is smaller.|比2倍焦距遠時，像會變小。","2f":"ちょうど2倍の位置なら、同じ大きさになります。|Exactly at 2F gives the same size.|剛好在2倍焦距時，大小相同。",mid:"焦点と2倍の間なら、大きな実像になります。|Between F and 2F gives a larger real image.|在焦點與2倍焦距之間時，會成放大的實像。",in:"焦点より内側だと実像はできず、虚像が見えます。|Inside F: no real image, only a virtual one.|在焦點內側不成實像，只看得到虛像。"};
function lensFig(c){ const x={far:40,"2f":100,mid:126,in:174}[c]; let b=L(10,110,390,110,"k")+`<ellipse cx="200" cy="110" rx="9" ry="72" class="ac"/>`;
  for(const [px,s] of [[100,"2F"],[150,"F"],[250,"F"],[300,"2F"]]) b+=`<circle cx="${px}" cy="110" r="3" class="kf"/>`+T(px,130,s,"xs");
  b+=AR(x,110,x,70,"ar")+T(x,62,X("物体|object|物體"),"xs")+T(200,198,X("凸レンズ|convex lens|凸透鏡"),"xs"); return SV(400,204,b); }
function lensImg(){ const [c,pos]=pick(LENS_C); const fig=lensFig(c);
  const ws=LENS_C.filter(([k])=>k!==c).map(([k])=>({v:X(IMG[k]),why:X(IMG_W[c])}));
  return {q:X(`凸レンズの${X(pos)}に物体を置いた。スクリーンにできる像は？|An object is ${X(pos)} of a convex lens. What image forms on a screen?|物體放在凸透鏡的${X(pos)}。屏幕上會形成什麼像？`)+fig,ans:X(IMG[c]),wrongs:ws,
    exp:X("2倍より遠い→小さい実像、2倍→同じ大きさ、焦点と2倍の間→大きい実像（すべて倒立）、焦点の内側→虚像（正立・大きい）。|Beyond 2F → smaller; at 2F → same; F–2F → larger (all inverted real); inside F → virtual (upright, larger).|2倍焦距外→縮小實像，2倍處→等大，焦點與2倍間→放大實像（都倒立），焦點內→虛像（正立、放大）。"),tf:v=>X(`凸レンズの${X(pos)}に物体を置くと|An object ${X(pos)} gives|物體放在${X(pos)}時`)+fig+`→ ${v}`,kind:"fig"}; }
function lensCalc(){ const f=pick([5,6,8,10,12,15,20]); const up=Math.random()<.5;
  if(up) return C(X(`焦点距離 ${f} cm の凸レンズ。実物と同じ大きさの像をスクリーンにうつすには、物体をレンズから何 cm に置く？|A convex lens has focal length ${f} cm. Where should the object be for a same-size image?|焦距 ${f} cm 的凸透鏡。要在屏幕上得到和實物一樣大的像，物體要放在離透鏡幾 cm 處？`),2*f," cm",
    [[f,X("焦点に置くと像はできません。2倍の位置です。|At F there is no image; use 2F.|放在焦點不會成像，要放在2倍焦距。")],[f/2,X("焦点の内側では実像はできません。|Inside F there is no real image.|焦點內側不會成實像。")],[3*f,X("同じ大きさになるのは焦点距離のちょうど2倍です。|Same size is exactly 2 × focal length.|等大的像是剛好2倍焦距。")]],
    X(`同じ大きさの実像：物体もスクリーンも焦点距離の2倍 → ${2*f} cm|Same-size real image: object and screen both at 2F → ${2*f} cm|等大實像：物體和屏幕都在2倍焦距 → ${2*f} cm`));
  return C(X(`物体を凸レンズから ${2*f} cm に置くと、反対側 ${2*f} cm のスクリーンに実物と同じ大きさの像ができた。焦点距離は？|With the object ${2*f} cm from a lens, a same-size image forms on a screen ${2*f} cm away. Focal length?|物體放在離凸透鏡 ${2*f} cm 處，另一側 ${2*f} cm 的屏幕上出現等大的像。焦距是？`),f," cm",
    [[2*f,X("同じ大きさの像のとき、距離は焦点距離の2倍です。2でわります。|Same size means distance = 2F; divide by 2.|等大時距離是2倍焦距，要除以2。")],[4*f,X("2つの距離をたすのではありません。|Don't add the two distances.|不是把兩個距離相加。")],[f/2,X("2倍の位置なので、焦点距離は距離の半分です。|At 2F, the focal length is half the distance.|在2倍焦距處，焦距是距離的一半。")]],
    X(`同じ大きさ → 2倍の位置。${2*f} ÷ 2 ＝ ${f} cm|Same size → at 2F. ${2*f} ÷ 2 = ${f} cm|等大 → 在2倍焦距。${2*f} ÷ 2 ＝ ${f} cm`)); }
const phys2=[lensImg,lensImg,lensImg,lensCalc,lensCalc,
  Q("凸レンズの「焦点」とは？|What is the focal point of a convex lens?|凸透鏡的「焦點」是？","光軸に平行な光が、レンズを通ったあと集まる点|Where light parallel to the axis meets after the lens|平行主軸的光通過透鏡後會聚的點",
    [["レンズのまん中の点|The center of the lens|透鏡的中心點","レンズの中心を通る光はまっすぐ進みます。焦点はレンズの外です。|Light through the center goes straight; the focus is outside the lens.|通過透鏡中心的光直進，焦點在透鏡外。"],["像がいちばん小さくなる点|Where the image is smallest|像最小的點","焦点は平行な光が集まる点です。|It is where parallel light meets.|焦點是平行光會聚的點。"],["光がはね返る点|Where light bounces back|光反彈的點","凸レンズでは光は屈折して通りぬけます。|Light refracts through a lens.|光在凸透鏡中是折射穿過。"]],
    "焦点：光軸に平行な光が集まる点。レンズの中心から焦点までが焦点距離。|Focal point: where parallel light meets. Lens center to focus = focal length.|焦點：平行光會聚的點；透鏡中心到焦點的距離是焦距。"),
  Q("凸レンズの中心を通る光はどう進む？|How does light through the center of a convex lens travel?|通過凸透鏡中心的光會怎麼前進？","そのまままっすぐ進む|Straight on|直線前進",
    [["焦点を通る|Through the focus|通過焦點","焦点を通るのは光軸に平行に入った光です。|Light entering parallel to the axis goes through the focus.|平行主軸入射的光才會通過焦點。"],["光軸に平行になる|Parallel to the axis|變成和主軸平行","光軸に平行に出るのは焦点を通って入った光です。|Light coming through the focus exits parallel.|通過焦點入射的光才會平行射出。"],["はね返る|Bounces back|反彈回去","凸レンズは光を通します。|A convex lens lets light through.|凸透鏡會讓光通過。"]],
    "平行な光→焦点を通る。中心を通る光→まっすぐ。焦点を通る光→平行に出る。|Parallel → through F. Through center → straight. Through F → exits parallel.|平行光→通過焦點；通過中心→直進；通過焦點→平行射出。"),
  Q("スクリーンに実像がうつっているとき、凸レンズの上半分を紙でかくすと？|With a real image on the screen, you cover the top half of the lens. Then…|屏幕上有實像時，用紙遮住凸透鏡上半部，會怎樣？","像は全体がうつるが、暗くなる|The whole image stays but gets darker|像仍然完整，但變暗",
    [["像の上半分が消える|The top half disappears|像的上半部消失","レンズのどの部分を通った光も像全体をつくります。|Light through any part forms the whole image.|通過透鏡任何部分的光都能形成整個像。"],["像の下半分が消える|The bottom half disappears|像的下半部消失","像は欠けません。集まる光が減るので暗くなります。|Nothing is cut off; less light makes it darker.|像不會缺，只是光變少而變暗。"],["像が消える|The image disappears|像消失","下半分を通る光でも像はできます。|Light through the bottom half still forms it.|通過下半部的光仍能成像。"]],
    "レンズの一部をかくしても像の形は変わらず、光の量が減って暗くなる。|Covering part of the lens dims the image but keeps its shape.|遮住部分透鏡，像的形狀不變，光變少所以變暗。"),
  Q("虫めがねで近くのものを大きく見るとき、見えている像は？|With a magnifying glass up close, the image you see is…|用放大鏡看近處的東西變大時，看到的像是？","正立の虚像|An upright virtual image|正立虛像",
    [["倒立の実像|An upside-down real image|倒立實像","実像はスクリーンにうつる像です。虫めがねで見るのは虚像です。|Real images appear on a screen; this is virtual.|實像是能投在屏幕上的像，放大鏡看到的是虛像。"],["倒立の虚像|An upside-down virtual image|倒立虛像","凸レンズの虚像は正立（上下そのまま）です。|A lens's virtual image is upright.|凸透鏡的虛像是正立的。"],["正立の実像|An upright real image|正立實像","凸レンズの実像は倒立になります。|A lens's real image is inverted.|凸透鏡的實像是倒立的。"]],
    "焦点の内側の物体をレンズを通して見ると、正立で大きな虚像が見える。|An object inside F seen through the lens gives an upright, larger virtual image.|透過透鏡看焦點內的物體，會看到正立放大的虛像。"),
];

// 音：波形（振幅と振動数）
function wave(x,y,w,amp,n){ const pts=[]; for(let i=0;i<=80;i++){ const t=i/80; pts.push(P2(x+t*w,y-amp*Math.sin(t*n*2*Math.PI))); } return `<polyline points="${pts.join(" ")}" class="ln"/>`+L(x,y,x+w,y,"g"); }
const WV={loud:[26,3],soft:[7,3],high:[14,6],low:[14,1.5]};
const WV_N={loud:"大きい音|louder|較大聲",soft:"小さい音|softer|較小聲",high:"高い音|higher|較高",low:"低い音|lower|較低"};
const WV_W={loud:"振幅が大きいので大きい音です（高さは同じ）。|Bigger amplitude: louder (same pitch).|振幅較大，所以是較大聲（音高相同）。",soft:"振幅が小さいので小さい音です（高さは同じ）。|Smaller amplitude: softer (same pitch).|振幅較小，所以是較小聲（音高相同）。",high:"振動数が多いので高い音です（大きさは同じ）。|More vibrations: higher (same loudness).|振動次數多，所以是較高的音（大小相同）。",low:"振動数が少ないので低い音です（大きさは同じ）。|Fewer vibrations: lower (same loudness).|振動次數少，所以是較低的音（大小相同）。"};
function soundWave(){ const ks=shuf(Object.keys(WV)); const ask=pick(ks); const nm={}; ks.forEach((k,i)=>nm[k]=LET[i]);
  let b=T(150,14,X("もとの音|original sound|原來的聲音"),"xs")+wave(90,46,120,14,3);
  ks.forEach((k,i)=>{ const x=10+(i%2)*150,y=110+Math.floor(i/2)*72; b+=T(x+4,y-26,LET[i],"lb","start")+wave(x+18,y,120,WV[k][0],WV[k][1]); });
  const fig=SV(300,214,b);
  return {q:X(`オシロスコープで見た音の波形。もとの音より${X(WV_N[ask])}は？（横軸は時間、たて軸は振動の幅。目盛りは同じ）|Sound waveforms (horizontal: time, vertical: vibration; same scales). Which is ${X(WV_N[ask])} than the original?|用示波器看到的聲音波形（橫軸時間、縱軸振幅，刻度相同）。比原來的聲音${X(WV_N[ask])}的是？`)+fig,ans:nm[ask],
    wrongs:ks.filter(k=>k!==ask).map(k=>({v:nm[k],why:`${nm[k]}：`+X(WV_W[k])})),
    exp:X("振幅（ゆれの幅）が大きい→大きい音。振動数（山の数）が多い→高い音。|Bigger amplitude → louder. More peaks (frequency) → higher.|振幅（擺動幅度）大→聲音大；振動次數（波峰數）多→聲音高。"),tf:v=>X(`もとの音より${X(WV_N[ask])}のは|The one ${X(WV_N[ask])} is|比原來${X(WV_N[ask])}的是`)+fig+`→ ${v}`,kind:"fig"}; }
function soundDist(){ const echo=Math.random()<.4; const t=echo?pick([2,3,4,5,6]):pick([2,3,4,5,6,8,10]); const d=340*t;
  if(!echo) return C(X(`いなずまが光ってから ${t} 秒後に雷の音が聞こえた。雷までの距離は何 m？（音の速さ 340 m/s）|Thunder is heard ${t} s after the lightning. How far away is it? (sound: 340 m/s)|看到閃電 ${t} 秒後聽到雷聲。雷離這裡幾 m？（音速 340 m/s）`),d," m",
    [[d/2,X("いなずまから耳までは片道です。2でわりません。|Lightning to you is one way; don't halve it.|從閃電到耳朵是單程，不用除以2。")],[340/t,X("距離 ＝ 速さ × 時間。わるのではなくかけます。|Distance = speed × time. Multiply.|距離 ＝ 速度 × 時間，要相乘。")],[340+t,X("たし算ではなく、かけ算です。|Multiply, don't add.|是乘法，不是加法。")]],
    X(`距離 ＝ 340 × ${t} ＝ ${d} m（光はほぼ一瞬で届く）|Distance = 340 × ${t} = ${d} m (light arrives almost instantly)|距離 ＝ 340 × ${t} ＝ ${d} m（光幾乎瞬間到達）`));
  return C(X(`山に向かって大声を出すと、${t} 秒後に山びこが聞こえた。山までの距離は何 m？（音の速さ 340 m/s）|You shout at a mountain and hear the echo ${t} s later. How far is it? (sound: 340 m/s)|對著山大叫，${t} 秒後聽到回聲。山離這裡幾 m？（音速 340 m/s）`),d/2," m",
    [[d,X("山びこは山まで行って帰ってくる（往復）ので、2でわります。|The echo goes there and back; divide by 2.|回聲是來回（往返），要除以2。")],[340/t,X("距離 ＝ 速さ × 時間 ÷ 2 です。|Distance = speed × time ÷ 2.|距離 ＝ 速度 × 時間 ÷ 2。")],[d*2,X("往復なので2でわります。かけません。|Round trip: divide by 2, not multiply.|往返要除以2，不是乘以2。")]],
    X(`往復 ${d} m なので、片道は ${d} ÷ 2 ＝ ${d/2} m|Round trip ${d} m, so one way = ${d} ÷ 2 = ${d/2} m|往返 ${d} m，所以單程 ＝ ${d} ÷ 2 ＝ ${d/2} m`)); }
function soundHz(){ const f=pick([100,200,250,400,500,1000]); const n=pick([1,2,4,5]); const s=n/f;
  return C(X(`ある音は ${fm(s,4)} 秒間に ${n} 回振動する。振動数は何 Hz？|A sound vibrates ${n} time(s) in ${fm(s,4)} s. What is its frequency in Hz?|某聲音在 ${fm(s,4)} 秒內振動 ${n} 次，振動頻率是幾 Hz？`),f," Hz",
    [[f/n,X(`${n} 回振動しているので、1回あたりの時間ではなく回数で考えます。|It vibrates ${n} times; count all of them.|振動了 ${n} 次，要算全部的次數。`)],[f*n,X("振動数 ＝ 回数 ÷ 時間 です。|Frequency = count ÷ time.|頻率 ＝ 次數 ÷ 時間。")],[f*10,X("小数の位どりを確かめよう。|Check the decimal places.|檢查小數點的位數。")]],
    X(`振動数 ＝ 1秒間に振動する回数 ＝ ${n} ÷ ${fm(s,4)} ＝ ${f} Hz|Frequency = vibrations per second = ${n} ÷ ${fm(s,4)} = ${f} Hz|頻率 ＝ 每秒振動次數 ＝ ${n} ÷ ${fm(s,4)} ＝ ${f} Hz`)); }
const phys3=[soundWave,soundWave,soundWave,soundDist,soundDist,soundHz,
  Q("音を出しているものは、どうなっている？|What is happening to something making a sound?|發出聲音的物體正在怎樣？","振動している|It is vibrating|正在振動",
    [["光を出している|It gives off light|正在發光","音は物体の振動で生まれます。|Sound comes from vibration.|聲音由物體振動產生。"],["とまっている|It is still|靜止不動","振動をとめると音もとまります。|Stop the vibration and the sound stops.|停止振動，聲音也會停止。"],["熱くなっている|It is getting hot|正在變熱","音と温度は直接関係ありません。|Sound isn't about heat.|聲音和溫度沒有直接關係。"]],
    "音は物体の振動。振動が空気などを波として伝わり、耳に届く。|Sound is vibration traveling as waves through air to our ears.|聲音是物體的振動，以波的形式經空氣等傳到耳朵。"),
  Q("容器の中の空気をぬいていくと、中のブザーの音はどうなる？|As air is pumped out of a container, the buzzer inside sounds…|把容器中的空氣抽掉，裡面蜂鳴器的聲音會怎樣？","だんだん小さくなる|Quieter and quieter|越來越小",
    [["だんだん大きくなる|Louder and louder|越來越大","音を伝える空気がへるので、小さくなります。|Less air to carry the sound means quieter.|傳聲的空氣變少，聲音變小。"],["高くなる|Higher|變高","高さではなく、伝わり方が変わります。|The pitch doesn't change; transmission does.|改變的是傳播，不是音高。"],["変わらない|No change|不變","音は真空中では伝わりません。|Sound can't travel in a vacuum.|聲音不能在真空中傳播。"]],
    "音は空気・水・固体の中を伝わるが、真空中は伝わらない。|Sound travels through air, water and solids, but not a vacuum.|聲音能在空氣、水、固體中傳播，但不能在真空中傳播。"),
  Q("弦をはじいたとき、音を高くするには？|How do you make a plucked string sound higher?|撥弦時，要讓聲音變高該怎麼做？","弦を短くする|Make the string shorter|把弦變短",
    [["弦を強くはじく|Pluck it harder|用力撥","強くはじくと大きい音になります（高さは同じ）。|Harder makes it louder, not higher.|用力撥只會變大聲，音高不變。"],["弦を太くする|Use a thicker string|換粗的弦","太い弦は低い音になります。|Thicker strings sound lower.|粗的弦聲音較低。"],["弦をゆるめる|Loosen the string|把弦放鬆","ゆるめると低い音になります。|Looser is lower.|放鬆會變低。"]],
    "高い音：弦を短く・細く・強くはる（振動数が多くなる）。|Higher: shorter, thinner, tighter string (more vibrations).|高音：弦短、細、拉緊（振動頻率變高）。"),
  Q("音の速さについて正しいのは？|Which is true about the speed of sound?|關於聲音的速度，正確的是？","空気中で約340 m/s。光よりずっとおそい|About 340 m/s in air, much slower than light|在空氣中約340 m/s，比光慢得多",
    [["光と同じ速さ|Same as light|和光一樣快","光は約30万 km/s で、音よりはるかに速いです。|Light is ~300,000 km/s, far faster.|光約每秒30萬 km，比聲音快得多。"],["空気中で約3 m/s|About 3 m/s in air|在空氣中約3 m/s","それでは遅すぎます。約340 m/s です。|Too slow; it is about 340 m/s.|太慢了，約 340 m/s。"],["真空中がいちばん速い|Fastest in a vacuum|在真空中最快","真空中では音は伝わりません。|Sound can't travel in a vacuum.|聲音不能在真空中傳播。"]],
    "音：空気中約340 m/s。だから花火や雷は光が先、音があと。|Sound: ~340 m/s in air, so we see fireworks and lightning before we hear them.|聲音在空氣中約340 m/s，所以煙火、雷電都是先看到光、後聽到聲音。"),
];

// 力：矢印の読みとり・重さと質量
function forceArrow(){ const k=R(2,7), s=pick([1,2,5,0.5]); const g=26; let b="";
  for(let i=0;i<=10;i++) b+=L(20+i*g,20,20+i*g,98,"g"); for(let j=0;j<=3;j++) b+=L(20,20+j*g,280,20+j*g,"g");
  b+=`<rect x="20" y="33" width="${g*2}" height="52" rx="4" class="os"/>`+`<circle cx="${20+g*2}" cy="59" r="4" class="kf"/>`+AR(20+g*2,59,20+g*(2+k),59);
  const fig=SV(300,110,b); const ans=k*s, sU=fm(s);
  return C(X(`1目盛りを ${sU} N とすると、矢印の力の大きさは？|If one square is ${sU} N, how big is the force?|若一格代表 ${sU} N，箭頭表示的力是多少？`),ans," N",
    [[k,X(`目盛りの数（${k}）に ${sU} N をかけます。|Multiply the ${k} squares by ${sU} N.|格數（${k}）要乘上 ${sU} N。`)],[(k+1)*s,X("矢印は作用点（黒い点）から数えます。|Count from the point of action (the dot).|要從作用點（黑點）開始數。")],[k/s,X("わるのではなく、かけます。|Multiply, don't divide.|是乘法，不是除法。")]],
    X(`矢印の長さ ${k} 目盛り × ${sU} N ＝ ${fm(ans)} N（矢印の長さ＝力の大きさ）|${k} squares × ${sU} N = ${fm(ans)} N (arrow length = force size)|箭頭長 ${k} 格 × ${sU} N ＝ ${fm(ans)} N（箭頭長度＝力的大小）`),fig); }
function weightMass(){ const m=pick([300,600,900,1200,1800,2400]); const v=R(0,2);
  const pre=X("100 g の物体にはたらく重力を 1 N、月の重力は地球の 6分の1 とする。|Take gravity on 100 g as 1 N; the Moon's gravity is 1/6 of Earth's.|設作用在 100 g 物體上的重力為 1 N，月球重力為地球的 1/6。");
  if(v===0) return C(pre+"<br>"+X(`質量 ${m} g の物体の、地球での重さは？|Weight on Earth of an object of mass ${m} g?|質量 ${m} g 的物體在地球上的重量是？`),m/100," N",
    [[m,X("重さの単位は N です。100 g で 1 N。|Weight is in N; 100 g → 1 N.|重量單位是 N，100 g 為 1 N。")],[m/600,X("それは月での重さです。|That is the weight on the Moon.|那是在月球上的重量。")],[m/10,X("100 g で 1 N なので、100 でわります。|100 g → 1 N, so divide by 100.|100 g 為 1 N，要除以 100。")]],X(`${m} ÷ 100 ＝ ${m/100} N|${m} ÷ 100 = ${m/100} N|${m} ÷ 100 ＝ ${m/100} N`));
  if(v===1) return C(pre+"<br>"+X(`質量 ${m} g の物体の、月での重さは？|Weight on the Moon of an object of mass ${m} g?|質量 ${m} g 的物體在月球上的重量是？`),m/600," N",
    [[m/100,X("それは地球での重さです。月では6分の1。|That is on Earth; the Moon is 1/6.|那是在地球上的重量，月球是 1/6。")],[m/6,X("まず N にしてから 6 でわります（100 g で 1 N）。|Convert to N first (100 g → 1 N), then ÷ 6.|先換成 N（100 g 為 1 N）再除以 6。")],[m*6/100,X("月の重力は小さいので、6でわります。|The Moon's gravity is weaker: divide by 6.|月球重力較小，要除以 6。")]],X(`地球 ${m/100} N → 月 ${m/100} ÷ 6 ＝ ${m/600} N|Earth ${m/100} N → Moon ${m/100} ÷ 6 = ${m/600} N|地球 ${m/100} N → 月球 ${m/100} ÷ 6 ＝ ${m/600} N`));
  return C(pre+"<br>"+X(`質量 ${m} g の物体を月に持っていくと、月での質量は？|What is the mass on the Moon of an object of mass ${m} g?|質量 ${m} g 的物體帶到月球，在月球上的質量是？`),m," g",
    [[m/6,X("質量は場所によって変わりません。変わるのは重さです。|Mass doesn't change with place; weight does.|質量不隨地點改變，改變的是重量。")],[m/600,X("質量の単位は g。場所が変わっても同じです。|Mass is in g and stays the same.|質量單位是 g，地點改變也一樣。")],[m*6,X("質量は場所によって変わりません。|Mass doesn't depend on place.|質量不隨地點改變。")]],X(`質量（物質そのものの量）はどこでも ${m} g|Mass (amount of matter) is ${m} g anywhere|質量（物質本身的量）在哪裡都是 ${m} g`)); }
const phys4=[forceArrow,forceArrow,weightMass,weightMass,weightMass,
  Q("力のはたらきにふくまれないものは？|Which is NOT an effect of a force?|下列哪一個不是力的作用？","物体の色を変える|Change an object's color|改變物體的顏色",
    [["物体の形を変える|Change its shape|改變物體的形狀","形を変えるのは力のはたらきです（ばねをのばす）。|Changing shape is a force effect (stretching a spring).|改變形狀是力的作用（拉長彈簧）。"],["物体の動きを変える|Change its motion|改變物體的運動","動きを変えるのは力のはたらきです（ボールをける）。|Changing motion is a force effect (kicking a ball).|改變運動是力的作用（踢球）。"],["物体を支える|Hold it up|支撐物體","支えるのも力のはたらきです（物を持ち上げる）。|Holding up is a force effect.|支撐也是力的作用（拿起東西）。"]],
    "力のはたらき：形を変える・動きを変える・支える。|Forces change shape, change motion, or hold things up.|力的作用：改變形狀、改變運動、支撐物體。"),
  Q("力を矢印で表すとき、矢印の「始まりの点」は何を表す？|When drawing a force as an arrow, the starting point shows…|用箭頭表示力時，箭頭的「起點」表示什麼？","作用点（力がはたらく点）|The point of action|作用點（力作用的點）",
    [["力の大きさ|Size of the force|力的大小","力の大きさは矢印の長さで表します。|Size is shown by length.|力的大小用箭頭長度表示。"],["力の向き|Direction of the force|力的方向","向きは矢印の向きで表します。|Direction is shown by the arrowhead.|方向用箭頭的指向表示。"],["物体の重さ|The object's weight|物體的重量","始まりの点は力がはたらく場所です。|The start is where the force acts.|起點是力作用的位置。"]],
    "力の3要素：作用点（始まり）・向き（矢印の向き）・大きさ（長さ）。|Three elements: point of action (start), direction (arrowhead), size (length).|力的三要素：作用點（起點）、方向（箭頭方向）、大小（長度）。"),
  Q("はなれていてもはたらく力はどれ？|Which force acts even at a distance?|哪一種力不接觸也能作用？","磁石の力|Magnetic force|磁力",
    [["摩擦力|Friction|摩擦力","摩擦力はふれ合っている面ではたらきます。|Friction acts where surfaces touch.|摩擦力在接觸面作用。"],["弾性力|Elastic force|彈力","弾性力は変形した物体がふれているものにはたらきます。|Elastic force acts on things it touches.|彈力作用在接觸的物體上。"],["垂直抗力|Normal force|正向力","垂直抗力は面がふれている物体をおす力です。|The normal force is a surface pushing what touches it.|正向力是接觸面推物體的力。"]],
    "はなれていてもはたらく力：重力・磁石の力・電気の力。|Forces at a distance: gravity, magnetic, electric.|不接觸也能作用的力：重力、磁力、電力。"),
  Q("上皿てんびんではかるのは？|What does a pan balance measure?|上皿天平測量的是？","質量（g）|Mass (g)|質量（g）",
    [["重さ（N）|Weight (N)|重量（N）","重さ（力）はばねばかりではかります。|Weight (a force) is measured with a spring scale.|重量（力）用彈簧秤測量。"],["体積（cm³）|Volume (cm³)|體積（cm³）","体積はメスシリンダーなどではかります。|Volume uses a graduated cylinder.|體積用量筒等測量。"],["密度（g/cm³）|Density (g/cm³)|密度（g/cm³）","密度は質量と体積から計算します。|Density is calculated from mass and volume.|密度是由質量和體積計算出來的。"]],
    "上皿てんびん→質量（月でも同じ値）。ばねばかり→重さ（月では6分の1）。|Pan balance → mass (same on the Moon). Spring scale → weight (1/6 on the Moon).|上皿天平→質量（在月球也相同）；彈簧秤→重量（在月球是 1/6）。"),
];

// ばね・2力のつり合い
function springText(){ let F1,x1,F2,x2; do{ F1=pick([1,2]); x1=pick([1.5,2,3,4]); F2=pick([0.5,1.5,2.5,3,4,5,6].filter(v=>v!==F1)); x2=x1*F2/F1; }while(Math.abs(x2*10-Math.round(x2*10))>1e-9);   // 答えは小数第1位まで（0.375 のような丸めを出さない）
  x2=+x2.toFixed(1); const tot=Math.random()<.4; const L0=pick([8,10,12,15]);
  if(!tot) return C(X(`${F1} N の力で ${x1} cm のびるばねに、${F2} N の力を加えると何 cm のびる？|A spring stretches ${x1} cm with ${F1} N. How much with ${F2} N?|一彈簧受 ${F1} N 的力伸長 ${x1} cm。受 ${F2} N 的力會伸長幾 cm？`),x2," cm",
    [[x1*F2,X(`${F1} N で ${x1} cm なので、1 N あたりにしてからかけます。|First find the stretch per 1 N.|先算出每 1 N 伸長多少。`)],[x1+F2-F1,X("ふえた力の分だけたすのではなく、比例で考えます。|It is proportional, not additive.|是成正比，不是相加。")],[F2/x1,X("のびは力に比例します（のび ＝ 1 N あたりののび × 力）。|Stretch is proportional to force.|伸長量和力成正比。")]],
    X(`フックの法則：のびは力に比例。${x1} ÷ ${F1} × ${F2} ＝ ${fm(x2)} cm|Hooke's law: stretch ∝ force. ${x1} ÷ ${F1} × ${F2} = ${fm(x2)} cm|虎克定律：伸長量和力成正比。${x1} ÷ ${F1} × ${F2} ＝ ${fm(x2)} cm`));
  return C(X(`もとの長さ ${L0} cm、${F1} N の力で ${x1} cm のびるばね。${F2} N の力を加えたときの、ばね全体の長さは？|A ${L0} cm spring stretches ${x1} cm with ${F1} N. Its total length with ${F2} N?|原長 ${L0} cm 的彈簧受 ${F1} N 伸長 ${x1} cm。受 ${F2} N 時彈簧的總長是？`),L0+x2," cm",
    [[x2,X("それは「のび」です。もとの長さをたします。|That is just the stretch; add the original length.|那只是「伸長量」，要加上原長。")],[L0+x1,X(`${F2} N のときののびを求めます。|Use the stretch for ${F2} N.|要算 ${F2} N 時的伸長量。`)],[L0*F2/F1,X("比例するのは「のび」で、ばね全体の長さではありません。|The stretch is proportional, not the total length.|成正比的是伸長量，不是彈簧總長。")]],
    X(`のび ＝ ${x1} ÷ ${F1} × ${F2} ＝ ${fm(x2)} cm、全体 ＝ ${L0} ＋ ${fm(x2)} ＝ ${fm(L0+x2)} cm|Stretch = ${x1} ÷ ${F1} × ${F2} = ${fm(x2)} cm; total = ${L0} + ${fm(x2)} = ${fm(L0+x2)} cm|伸長 ＝ ${x1} ÷ ${F1} × ${F2} ＝ ${fm(x2)} cm，總長 ＝ ${L0} ＋ ${fm(x2)} ＝ ${fm(L0+x2)} cm`)); }
function springGraph(){ const k=pick([0.5,1,1.5,2,2.5]); const F1=pick([1,2,3,5,6,7,8]); const ans=+(k*F1).toFixed(2); const px=f=>40+f*30,py=c=>170-c*12;
  let b=""; for(let f=0;f<=4;f++) b+=L(px(f),20,px(f),170,"g")+T(px(f),186,String(f),"xs"); for(let c=0;c<=12;c+=2) b+=L(40,py(c),px(4),py(c),"g")+T(34,py(c)+4,String(c),"xs","end");
  b+=L(40,20,40,170,"ax")+L(40,170,px(4),170,"ax")+L(px(0),py(0),px(4),py(4*k),"ln")+`<circle cx="${px(4)}" cy="${py(4*k)}" r="4" class="pt"/>`+T(px(2),202,X("力の大きさ（N）|Force (N)|力的大小（N）"),"xs")+T(44,14,X("ばねののび（cm）|Stretch (cm)|彈簧伸長量（cm）"),"xs","start");
  const fig=SV(200,208,b);
  return C(X(`グラフのばねに ${F1} N の力を加えると、のびは何 cm？|With ${F1} N on the spring in the graph, how much does it stretch?|圖中的彈簧受 ${F1} N 的力，伸長幾 cm？`),ans," cm",
    [[F1/k,X("グラフで 1 N あたりののびを読み、力にかけます。|Read the stretch per 1 N and multiply.|從圖讀出每 1 N 的伸長量再乘以力。")],[4*k,X(`それは 4 N のときののびです。${F1} N を求めます。|That is for 4 N; find it for ${F1} N.|那是 4 N 時的伸長量，要求 ${F1} N 的。`)],[k*(F1+1),X("比例なので、1 N あたりののび × 力です。|Proportional: stretch per N × force.|成正比：每 N 伸長量 × 力。")]],
    X(`4 N で ${fm(4*k)} cm → 1 N で ${fm(k)} cm → ${F1} N で ${fm(ans)} cm|4 N → ${fm(4*k)} cm, so 1 N → ${fm(k)} cm, ${F1} N → ${fm(ans)} cm|4 N → ${fm(4*k)} cm，1 N → ${fm(k)} cm，${F1} N → ${fm(ans)} cm`),fig); }
// 2力のつり合い：4つの図
const BAL={ok:"同じ直線上・大きさが等しい・向きが反対で、つり合っています。|Same line, equal, opposite: balanced.|在同一直線、大小相等、方向相反，所以平衡。",
  neq:"2力の大きさ（矢印の長さ）がちがいます。|The forces are different sizes.|兩力的大小（箭頭長度）不同。",off:"2力が同じ直線上にありません。|The forces are not on the same line.|兩力不在同一直線上。",dir:"2力の向きが反対ではありません。|The forces are not opposite.|兩力的方向不是相反的。"};
function balFig(order){ let b=""; order.forEach((k,i)=>{ const x=10+i*84,cx=x+36,cy=52; b+=`<rect x="${cx-14}" y="${cy-14}" width="28" height="28" rx="3" class="os"/>`+T(cx,104,LET[i]);
    if(k==="ok") b+=AR(cx-14,cy,cx-40,cy)+AR(cx+14,cy,cx+40,cy);
    if(k==="neq") b+=AR(cx-14,cy,cx-30,cy)+AR(cx+14,cy,cx+44,cy);
    if(k==="off") b+=AR(cx-14,cy-9,cx-40,cy-9)+AR(cx+14,cy+9,cx+40,cy+9);
    if(k==="dir") b+=AR(cx-14,cy,cx-40,cy)+AR(cx,cy-14,cx,cy-40); }); return SV(340,112,b); }
function balance(){ const order=shuf(["ok","neq","off","dir"]); const fig=balFig(order); const a=LET[order.indexOf("ok")];
  return {q:X("2つの力がつり合っているのはどれ？|Which shows two balanced forces?|哪一個是兩力平衡？")+fig,ans:a,wrongs:order.map((k,i)=>k==="ok"?null:{v:LET[i],why:X(BAL[k])}).filter(Boolean),
    exp:X("2力のつり合い：①同じ直線上 ②大きさが等しい ③向きが反対。|Balanced forces: same line, equal size, opposite directions.|兩力平衡：①在同一直線 ②大小相等 ③方向相反。"),tf:v=>X("つり合っているのは|The balanced one is|平衡的是")+fig+`→ ${v}`,kind:"fig"}; }
const phys5=[springText,springText,springGraph,springGraph,balance,balance,
  Q("「ばねののびは、ばねに加えた力の大きさに比例する」という法則は？|The law \"a spring's stretch is proportional to the force\" is…|「彈簧伸長量和所受的力成正比」的定律是？","フックの法則|Hooke's law|虎克定律",
    [["反射の法則|Law of reflection|反射定律","反射の法則は光の入射角と反射角の関係です。|That is about light angles.|反射定律是光的入射角和反射角的關係。"],["慣性の法則|Law of inertia|慣性定律","慣性の法則は運動についての法則です（中3）。|That is about motion (grade 9).|慣性定律是關於運動的定律（國三）。"],["質量保存の法則|Conservation of mass|質量守恆定律","質量保存の法則は化学変化での質量の関係です（中2）。|That is about mass in reactions (grade 8).|質量守恆定律是化學變化中的質量關係（國二）。"]],
    "フックの法則：ばねののび ∝ 力の大きさ（グラフは原点を通る直線）。|Hooke's law: stretch ∝ force (a straight line through the origin).|虎克定律：彈簧伸長量 ∝ 力的大小（圖形是通過原點的直線）。"),
  Q("机の上に置いた本にはたらく重力とつり合っている力は？|What balances gravity on a book resting on a desk?|放在桌上的書，和重力平衡的力是？","机が本をおす力（垂直抗力）|The desk pushing up (normal force)|桌子推書的力（正向力）",
    [["摩擦力|Friction|摩擦力","摩擦力は面にそって動きをさまたげる力です。|Friction acts along the surface against motion.|摩擦力是沿著接觸面阻礙運動的力。"],["磁石の力|Magnetic force|磁力","本と机の間に磁石の力ははたらいていません。|There is no magnetic force here.|書和桌子之間沒有磁力。"],["本が机をおす力|The book pushing the desk|書推桌子的力","それは机にはたらく力です。本にはたらく力を考えます。|That acts on the desk, not the book.|那是作用在桌子上的力，要考慮作用在書上的力。"]],
    "本にはたらく：重力（下向き）と垂直抗力（上向き）がつり合う。|On the book: gravity (down) balances the normal force (up).|作用在書上：重力（向下）和正向力（向上）平衡。"),
];
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
