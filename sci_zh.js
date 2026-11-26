/* 45 Study 理科（tools/build.py が src/sci/*.js から作る。直接编集しない） */
/* 45 Study 理科：问题をその场で作る（计算问题の数字は毎回かわる）。tools/build.py が src/sci/*.js をつなげて sci.js を作る。
   単元の并び：中学校学习指导要领（平成29年告示）理科 第1学年（第1分野(1)(2)・第2分野(1)(2)）。教科书の顺に 生物 → 物质 → 光・音・力 → 大地
   ことば：文は "日本语|English|繁体中文" の3つを | でつなげて书き、X() で今の言语を取り出す。简体字は build.py が sci.js 全体を変换して sci_zh.js を作る。
   gen() が返すもの：{ q:问题, ans:答え, wrongs:[{v,why}], exp:解き方, tf:v=>○×の文, kind } （どれもHTML。MATH と同じ形） */
const SCI=(()=>{
const LG=(()=>{ let l=null; try{ l=JSON.parse(localStorage.getItem("s_lang")); }catch(e){} if(!l){ const n=(navigator.language||"ja").toLowerCase(); l=n.startsWith("zh")?"zh":n.startsWith("ja")?"ja":"en"; } return {ja:0,en:1,"zh-Hant":2,zh:2}[l]??1; })();
const X=s=>{ if(typeof s!=="string") return s; const a=s.split("|"); return a.length===3?a[LG]:s; };
const R=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const fm=(n,d=2)=>String(+(+n).toFixed(d));          // 2.70 → "2.7"
const LET="ABCDEF";
const UQ=(ans,ws)=>{ const seen=new Set([String(ans)]); return ws.filter(w=>!seen.has(String(w.v))&&seen.add(String(w.v))); };   // 同じ误答をのぞく
/* 図 */
const SV=(w,h,body)=>`<svg class="fig" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
const T=(x,y,s,c="lb",a="middle")=>`<text x="${x}" y="${y}" class="${c}" text-anchor="${a}">${s}</text>`;
const L=(x1,y1,x2,y2,c="k")=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${c}"/>`;
// 矢印（先の三角つき）
function AR(x1,y1,x2,y2,c="ar"){ const a=Math.atan2(y2-y1,x2-x1),h=9,w=5; const bx=x2-h*Math.cos(a),by=y2-h*Math.sin(a);
  const p=[[x2,y2],[bx+w*Math.sin(a),by-w*Math.cos(a)],[bx-w*Math.sin(a),by+w*Math.cos(a)]].map(q=>q.map(v=>v.toFixed(1)).join(",")).join(" ");
  return `<line x1="${x1}" y1="${y1}" x2="${bx.toFixed(1)}" y2="${by.toFixed(1)}" class="${c}"/><polygon points="${p}" class="${c==="ar"?"ah":"kf"}"/>`; }
// 引き出し线つきの记号
const TAG=(lx,ly,px,py,s)=>L(lx+(px>lx?8:-8),ly-5,px,py,"k")+T(lx,ly,s);
/* 文の问题：[问题, 答え, [[误答,理由]×3], 解き方, 図] → 问题を作る関数 */
function Q(q,ans,ws,exp,fig){ return ()=>{ const qq=X(q)+(fig?(typeof fig==="function"?fig():fig):""); return {q:qq,ans:X(ans),wrongs:ws.map(([v,why])=>({v:X(v),why:X(why)})),exp:X(exp),tf:v=>`${qq}<br>→ ${v}`,kind:fig?"fig":"word"}; }; }
// 计算の误答：答えと同じ・同じ値はのぞき、足りなければ近い数で埋める
function WN(ans,list,unit,step){ const out=[],seen=new Set([fm(ans)]);
  for(const [v,why] of list){ if(v==null||!isFinite(v)||v<=0) continue; const k=fm(v); if(seen.has(k)) continue; seen.add(k); out.push({v:k+unit,why}); }
  for(const d of [1,-1,2,-2,3,-3]){ if(out.length>=3) break; const v=+(ans+d*step).toFixed(3); if(v<=0||seen.has(fm(v))) continue; seen.add(fm(v)); out.push({v:fm(v)+unit,why:X("计算ミスです。下の解き方で确かめよう。|A calculation slip. Check with the steps below.|计算错误。用下面的解法确认看看。")}); }
  return out.slice(0,3); }
const C=(q,ans,unit,ws,exp,fig)=>({q:q+(fig||""),ans:fm(ans)+unit,wrongs:WN(ans,ws,unit,Math.max(.1,Math.abs(ans)>=20?Math.round(Math.abs(ans)/10):1)),exp,tf:v=>`${q}${fig||""}<br>→ ${v}`,kind:fig?"fig":"calc"});
// 记号で答える问题の误答（选んだ记号ごとの理由）
const WL=(ans,whyOf,letters)=>letters.filter(l=>l!==ans).slice(0,3).map(l=>({v:l,why:whyOf(l)}));
// 2つのなかまに分ける（なかま分け）：sets=[名前A,名前B]、items=[[ことば, 0か1, ひとこと]]
function SORT(a,b,items){ return items.map(([w,s,hint])=>()=>{ const A=X(a),B=X(b),ok=s?B:A,ng=s?A:B,ww=X(w);
  const why=X(`「${ww}」は「${ok}」のなかまです。|"${ww}" belongs to "${ok}".|「${ww}」属于「${ok}」。`)+(hint?" "+X(hint):"");
  const mem=items.filter(x=>x[1]===s).map(x=>X(x[0])).join(X("、|, |、"));
  return {q:`<div class="srt">${ww}</div>`,ans:ok,wrongs:[{v:ng,why}],opts:[A,B],exp:X(`「${ok}」のなかま：|"${ok}": |「${ok}」：`)+mem,sec:6,tf:v=>X(`「${ww}」は「${v}」のなかま|"${ww}" belongs to "${v}"|「${ww}」属于「${v}」`),kind:"sort",fwhy:why}; }); }
/* ========== ① いろいろな生物とその共通点（第2分野(1)） ========== */
// 顕微镜：A 接眼レンズ B レボルバー C 対物レンズ D ステージ E 反射镜 F 调节ねじ
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
const MIC_NM={A:"接眼レンズ|Eyepiece|接目镜",B:"レボルバー|Revolving nosepiece|旋转盘",C:"対物レンズ|Objective lens|接物镜",D:"ステージ|Stage|载物台",E:"反射镜|Mirror|反光镜",F:"调节ねじ|Focus knob|调节轮"};
const MIC_DO={A:"目でのぞくレンズ|the lens you look into|眼睛看的镜头",B:"回して対物レンズを切りかえる|turn it to change objective lenses|转动它来换接物镜",C:"観察するものに近いレンズ|the lens close to the specimen|靠近观察物的镜头",D:"プレパラートをのせる台|where you put the slide|放玻片标本的台子",E:"光を集めて明るくする|collects light to brighten the view|聚集光线让视野变亮",F:"回してピントを合わせる|turn it to focus|转动它来对焦"};
function micName(){ const ks=Object.keys(MIC_NM); const a=pick(ks); const ws=shuf(ks.filter(k=>k!==a)).slice(0,3);
  return {q:X(`図の ${a} の部分の名前は？|What is part ${a} in the figure?|图中 ${a} 的名称是？`)+FIG_MIC,ans:X(MIC_NM[a]),
    wrongs:ws.map(k=>({v:X(MIC_NM[k]),why:X(`${X(MIC_NM[k])}は図の ${k}（${X(MIC_DO[k])}）です。|${X(MIC_NM[k])} is ${k} in the figure (${X(MIC_DO[k])}).|${X(MIC_NM[k])}是图中的 ${k}（${X(MIC_DO[k])}）。`)})),
    exp:X(`${a} は${X(MIC_NM[a])}：${X(MIC_DO[a])}。|${a} is the ${X(MIC_NM[a]).toLowerCase()}: ${X(MIC_DO[a])}.|${a} 是${X(MIC_NM[a])}：${X(MIC_DO[a])}。`),tf:v=>X(`図の ${a} は|Part ${a} in the figure is|图中的 ${a} 是`)+FIG_MIC+`→ ${v}`,kind:"fig"}; }
function micMag(){ const e=pick([5,10,15]),o=pick([4,10,40]); const ans=e*o; const mag=n=>X(`${n}倍|×${n}|${n}倍`);
  return {q:X(`接眼レンズ ${mag(e)}、対物レンズ ${mag(o)} のとき、顕微镜の倍率は？|Eyepiece ${mag(e)}, objective ${mag(o)}. What is the magnification?|接目镜 ${mag(e)}、接物镜 ${mag(o)}，显微镜的放大倍率是？`),ans:mag(ans),
    wrongs:[[e+o,"倍率は「たし算」ではなく「かけ算」です。|Multiply the two, don't add.|放大倍率要相乘，不是相加。"],[o,"接眼レンズの倍率もかけます。|Multiply by the eyepiece too.|也要乘上接目镜的倍率。"],[e*o*10,"かけ算をもう一度确かめよう。|Check the multiplication again.|再检查一次乘法。"],[Math.max(e,o)/Math.min(e,o),"わり算ではなく、かけ算です。|Multiply, don't divide.|是乘法，不是除法。"]]
      .filter(([v])=>v!==ans&&Number.isInteger(v)).slice(0,3).map(([v,why])=>({v:mag(v),why:X(why)})),
    exp:X(`倍率 ＝ 接眼レンズの倍率 × 対物レンズの倍率 ＝ ${e} × ${o} ＝ ${ans}|Magnification = eyepiece × objective = ${e} × ${o} = ${ans}|放大倍率 ＝ 接目镜 × 接物镜 ＝ ${e} × ${o} ＝ ${ans}`),tf:v=>X(`接眼 ${mag(e)}・対物 ${mag(o)} の倍率は|Eyepiece ${mag(e)} and objective ${mag(o)} give|接目镜 ${mag(e)}、接物镜 ${mag(o)} 的倍率是`)+` ${v}`,kind:"calc"}; }
const bioMic=[micName,micName,micMag,
  Q("顕微镜で観察するとき、はじめに使う対物レンズは？|Which objective lens do you use first?|用显微镜观察时，一开始用哪个接物镜？","いちばん低い倍率のもの|The lowest power|倍率最低的",
    [["いちばん高い倍率のもの|The highest power|倍率最高的","高い倍率は视野がせまく、见たいものを探しにくいです。|High power has a narrow view, so it is hard to find things.|高倍率视野窄，不容易找到要看的东西。"],["いちばん长いもの|The longest one|最长的","対物レンズは长いものほど倍率が高いです。|Longer objectives have higher power.|接物镜越长，倍率越高。"],["どれでもよい|Any one|哪个都可以","低い倍率から始めると、视野が広く探しやすいです。|Starting low gives a wide view.|从低倍率开始，视野宽，容易找。"]],
    "低倍率で见たいものを视野の中央に入れてから、高倍率にする。|Find it at low power, center it, then switch to high power.|先用低倍率把要看的东西移到视野中央，再换高倍率。"),
  Q("ピントの合わせ方で正しいのは？|How do you focus correctly?|对焦的正确方法是？","のぞきながら対物レンズとプレパラートを远ざける|Look through it and move the lens and slide apart|一边看一边让接物镜和玻片远离",
    [["のぞきながら対物レンズとプレパラートを近づける|Look through it and move them closer|一边看一边让它们靠近","ぶつかってプレパラートやレンズが割れることがあります。近づけるのは横から见ながら。|They may hit and break. Move them closer only while watching from the side.|可能会撞破玻片或镜头。靠近时要从侧面看。"],["レボルバーを回す|Turn the nosepiece|转动旋转盘","レボルバーは対物レンズ（倍率）を切りかえるものです。|The nosepiece changes the objective (power).|旋转盘是用来换接物镜（倍率）。"],["反射镜を动かす|Move the mirror|移动反光镜","反射镜は明るさを调节するものです。|The mirror adjusts brightness.|反光镜是调节亮度的。"]],
    "横から见ながら近づけ、のぞきながら远ざけてピントを合わせる。|Bring them close while watching from the side, then focus by moving apart while looking in.|从侧面看着让它们靠近，再一边看一边远离来对焦。"),
  Q("レンズをとりつける顺番は？|In what order do you attach the lenses?|装镜头的顺序是？","接眼レンズ → 対物レンズ|Eyepiece → objective|接目镜 → 接物镜",
    [["対物レンズ → 接眼レンズ|Objective → eyepiece|接物镜 → 接目镜","先に接眼レンズをつけないと、镜筒にほこりが入ります。|Without the eyepiece first, dust falls into the tube.|不先装接目镜，灰尘会掉进镜筒。"],["どちらが先でもよい|Either order|哪个先都可以","顺番があります。ほこりが入らないように接眼レンズが先。|There is an order: eyepiece first, to keep dust out.|有顺序：先装接目镜，避免灰尘进入。"],["反射镜 → 接眼レンズ|Mirror → eyepiece|反光镜 → 接目镜","反射镜ははじめから顕微镜についています。|The mirror is already part of the microscope.|反光镜本来就装在显微镜上。"]],
    "ほこりが镜筒に入らないよう、接眼レンズを先につける。|Attach the eyepiece first so dust doesn't get into the tube.|先装接目镜，避免灰尘进入镜筒。"),
  Q("倍率を高くすると、视野はどうなる？|What happens to the view at higher power?|倍率提高时，视野会怎样？","せまく、暗くなる|Narrower and darker|变窄、变暗",
    [["広く、明るくなる|Wider and brighter|变宽、变亮","それは倍率を低くしたときです。|That happens at lower power.|那是降低倍率时。"],["せまく、明るくなる|Narrower and brighter|变窄、变亮","入る光が少なくなるので暗くなります。|Less light comes in, so it gets darker.|进来的光变少，所以变暗。"],["広く、暗くなる|Wider and darker|变宽、变暗","大きく见えるぶん、见える范囲はせまくなります。|Things look bigger, so you see a smaller area.|看起来变大，看得到的范围就变窄。"]],
    "高倍率：大きく见えるが、视野はせまく暗い。|High power: bigger, but the view is narrower and darker.|高倍率：看起来大，但视野窄又暗。"),
  Q("顕微镜を直射日光の当たる场所で使ってはいけない理由は？|Why must you not use a microscope in direct sunlight?|为什么不能在阳光直射处使用显微镜？","反射镜で集めた日光で目をいためるから|Sunlight from the mirror can hurt your eyes|反光镜聚集的阳光会伤眼睛",
    [["レンズがとけるから|The lenses melt|镜头会融化","レンズはとけません。目を守るためです。|Lenses don't melt. It is to protect your eyes.|镜头不会融化，是为了保护眼睛。"],["プレパラートがかわくから|The slide dries|玻片会变干","いちばんの理由は目の安全です。|The main reason is eye safety.|最主要的理由是眼睛安全。"],["暗くて见えないから|It is too dark|太暗看不见","直射日光は明るすぎて危険です。|Direct sunlight is too bright and dangerous.|阳光直射太亮，很危险。"]],
    "直射日光の当たらない、明るく水平な场所で使う。|Use it in a bright, level place out of direct sunlight.|在明亮、平坦、没有阳光直射的地方使用。"),
  Q("ルーペの正しい使い方は？（観察するものが动かせるとき）|How do you use a hand lens? (when the object can be moved)|放大镜的正确用法是？（观察物可以移动时）","ルーペを目に近づけて持ち、観察するものを前后に动かす|Hold it close to your eye and move the object back and forth|放大镜靠近眼睛拿着，前后移动观察物",
    [["ルーペを観察するものに近づけ、颜を前后に动かす|Hold it near the object and move your face|放大镜靠近观察物，前后移动脸","ルーペは目に近づけて持ちます。|Hold the lens close to your eye.|放大镜要靠近眼睛拿。"],["ルーペを目から远ざけて持つ|Hold it far from your eye|放大镜离眼睛远一点拿","目に近づけたほうが広く见えます。|Close to the eye gives a wider view.|靠近眼睛看得比较广。"],["ルーペで太阳を见て明るさを确かめる|Look at the sun through it|用放大镜看太阳确认亮度","ルーペで太阳を见ると目をいためます。ぜったいにしない。|Never look at the sun through a lens.|绝对不可以用放大镜看太阳。"]],
    "ルーペは目に近づけて持つ。动かせないものは、颜を前后に动かす。|Hold it near your eye. If the object can't move, move your face.|放大镜靠近眼睛。观察物不能动时，就前后移动脸。"),
  Q("双眼実体顕微镜の特徴は？|What is special about a stereo microscope?|解剖显微镜（双眼实体显微镜）的特点是？","両目で见るので、立体的に见える|You use both eyes, so things look 3D|用双眼看，看起来是立体的",
    [["プレパラートをつくる必要がある|You need a prepared slide|一定要做玻片标本","プレパラートはいりません。そのままのせて见られます。|No slide needed. Just put the object on it.|不需要玻片，直接放上去就能看。"],["600倍くらいまで大きくできる|It magnifies up to about ×600|可以放大到约600倍","20〜40倍くらいです。|It is about ×20–40.|大约20〜40倍。"],["片目でのぞく|You look with one eye|用单眼看","「双眼」なので両目で见ます。|Binocular means both eyes.|「双眼」就是用两只眼睛看。"]],
    "双眼実体顕微镜：両目で20〜40倍、立体的に観察できる。|Stereo microscope: both eyes, ×20–40, 3D view.|解剖显微镜：双眼、20〜40倍、立体观察。"),
];

// 花のつくり：A 柱头 B やく C 花弁 D がく E 子房 F 胚珠
const FIG_FL=SV(250,225,
  `<path d="M104 166 Q58 150 48 88 Q82 108 104 158 Z" class="os"/><path d="M136 166 Q182 150 192 88 Q158 108 136 158 Z" class="os"/>`+
  `<path d="M112 172 Q88 186 70 176 Q90 168 112 166 Z" class="ac"/><path d="M128 172 Q152 186 170 176 Q150 168 128 166 Z" class="ac"/>`+
  L(102,166,88,96,"o")+L(138,166,152,96,"o")+`<ellipse cx="88" cy="90" rx="6" ry="9" class="ac"/><ellipse cx="152" cy="90" rx="6" ry="9" class="ac"/>`+
  L(120,130,120,74,"o")+`<ellipse cx="120" cy="70" rx="9" ry="5" class="ac"/>`+
  `<ellipse cx="120" cy="150" rx="17" ry="21" class="ac"/><circle cx="114" cy="146" r="3.5" class="pt"/><circle cx="126" cy="152" r="3.5" class="pt"/><circle cx="118" cy="160" r="3.5" class="pt"/>`+
  L(120,172,120,220,"o")+
  TAG(182,64,129,69,"A")+TAG(206,92,159,90,"B")+TAG(26,96,56,100,"C")+TAG(40,200,76,178,"D")+TAG(190,150,138,150,"E")+TAG(190,182,121,161,"F"));
const FL_NM={A:"柱头|Stigma|柱头",B:"やく|Anther|花药",C:"花弁|Petal|花瓣",D:"がく|Sepal|花萼",E:"子房|Ovary|子房",F:"胚珠|Ovule|胚珠"};
const FL_DO={A:"めしべの先。花粉がつく|tip of the pistil; pollen lands here|雌蕊的顶端，花粉附着的地方",B:"おしべの先。花粉が入っている|tip of the stamen; holds pollen|雄蕊的顶端，装有花粉",C:"花びら|the colored leaves of the flower|花的花瓣",D:"花のいちばん外侧で花を支える|outermost part that supports the flower|花最外侧、支撑花的部分",E:"めしべのもとのふくらんだ部分|swollen base of the pistil|雌蕊基部膨大的部分",F:"子房の中のつぶ|small grains inside the ovary|子房里的小颗粒"};
function flName(){ const ks=Object.keys(FL_NM); const a=pick(ks); const ws=shuf(ks.filter(k=>k!==a)).slice(0,3);
  return {q:X(`図の ${a} の部分の名前は？|What is part ${a} in the figure?|图中 ${a} 的名称是？`)+FIG_FL,ans:X(FL_NM[a]),
    wrongs:ws.map(k=>({v:X(FL_NM[k]),why:X(`${X(FL_NM[k])}は図の ${k}（${X(FL_DO[k])}）です。|${X(FL_NM[k])} is ${k} (${X(FL_DO[k])}).|${X(FL_NM[k])}是图中的 ${k}（${X(FL_DO[k])}）。`)})),
    exp:X(`${a} は${X(FL_NM[a])}：${X(FL_DO[a])}。|${a} is the ${X(FL_NM[a]).toLowerCase()}: ${X(FL_DO[a])}.|${a} 是${X(FL_NM[a])}：${X(FL_DO[a])}。`),tf:v=>X(`図の ${a} は|Part ${a} is|图中的 ${a} 是`)+FIG_FL+`→ ${v}`,kind:"fig"}; }
const bioFlower=[flName,flName,flName,
  Q("「受粉」とは何のこと？|What is pollination?|什么是「授粉」？","花粉がめしべの柱头につくこと|Pollen landing on the stigma|花粉附着在雌蕊的柱头上",
    [["花粉がおしべのやくにつくこと|Pollen landing on the anther|花粉附着在雄蕊的花药上","花粉はもともとやくの中にあります。つくのは柱头です。|Pollen is made in the anther; it must reach the stigma.|花粉本来就在花药里，要附着到柱头。"],["胚珠が种子になること|An ovule becoming a seed|胚珠变成种子","それは受粉したあとに起こる変化です。|That happens after pollination.|那是授粉之后的变化。"],["子房が果実になること|An ovary becoming a fruit|子房变成果实","それも受粉したあとに起こる変化です。|That also happens after pollination.|那也是授粉之后的变化。"]],
    "受粉：花粉が柱头につく → やがて子房は果実、胚珠は种子になる。|Pollination: pollen on the stigma → later the ovary becomes fruit and ovules become seeds.|授粉：花粉附着在柱头 → 之后子房变果实，胚珠变种子。",FIG_FL),
  Q("受粉したあと、子房は何になる？|After pollination, what does the ovary become?|授粉后，子房会变成什么？","果実|Fruit|果实",
    [["种子|Seed|种子","种子になるのは胚珠です。|The ovule becomes the seed.|变成种子的是胚珠。"],["花弁|Petal|花瓣","花弁はやがてかれて落ちます。|Petals wither and fall.|花瓣会枯萎掉落。"],["花粉|Pollen|花粉","花粉はおしべのやくでつくられます。|Pollen is made in the anther.|花粉是在雄蕊的花药制造的。"]],
    "子房 → 果実、胚珠 → 种子|Ovary → fruit, ovule → seed|子房 → 果实，胚珠 → 种子"),
  Q("受粉したあと、胚珠は何になる？|After pollination, what does the ovule become?|授粉后，胚珠会变成什么？","种子|Seed|种子",
    [["果実|Fruit|果实","果実になるのは子房です。|The ovary becomes the fruit.|变成果实的是子房。"],["柱头|Stigma|柱头","柱头はめしべの先の部分です。|The stigma is the tip of the pistil.|柱头是雌蕊的顶端。"],["がく|Sepal|花萼","がくは花の外侧で花を支える部分です。|The sepal supports the flower from outside.|花萼是在外侧支撑花的部分。"]],
    "子房 → 果実、胚珠 → 种子|Ovary → fruit, ovule → seed|子房 → 果实，胚珠 → 种子"),
  Q("花のつくりを外侧から顺に并べると？|From outside to inside, the parts of a flower are…|从外到内，花的构造依序是？","がく → 花弁 → おしべ → めしべ|Sepals → petals → stamens → pistil|花萼 → 花瓣 → 雄蕊 → 雌蕊",
    [["花弁 → がく → おしべ → めしべ|Petals → sepals → stamens → pistil|花瓣 → 花萼 → 雄蕊 → 雌蕊","いちばん外侧はがくです。|The sepals are outermost.|最外侧是花萼。"],["がく → 花弁 → めしべ → おしべ|Sepals → petals → pistil → stamens|花萼 → 花瓣 → 雌蕊 → 雄蕊","中心にあるのはめしべです。|The pistil is in the center.|中心是雌蕊。"],["めしべ → おしべ → 花弁 → がく|Pistil → stamens → petals → sepals|雌蕊 → 雄蕊 → 花瓣 → 花萼","それは内侧からの顺です。|That is from the inside.|那是从内侧开始的顺序。"]],
    "外侧から がく・花弁・おしべ・めしべ（中心）。|Outside in: sepals, petals, stamens, pistil (center).|由外到内：花萼、花瓣、雄蕊、雌蕊（中心）。"),
  Q("マツの花で、花粉が入っているのはどこ？|In a pine, where is the pollen?|松树的花，花粉在哪里？","雄花のりん片の花粉のう|Pollen sacs on the male cone scales|雄毬花鳞片上的花粉囊",
    [["雌花のりん片の胚珠|Ovules on the female cone scales|雌毬花鳞片上的胚珠","雌花のりん片にあるのは胚珠です。|Female scales carry ovules.|雌毬花的鳞片上是胚珠。"],["子房の中|Inside the ovary|子房里面","マツには子房がありません。|Pines have no ovary.|松树没有子房。"],["柱头の上|On the stigma|柱头上","マツには柱头がありません。花粉は风で直接胚珠につきます。|Pines have no stigma; wind carries pollen straight to the ovules.|松树没有柱头，花粉靠风直接附着到胚珠。"]],
    "マツ：雄花のりん片に花粉のう、雌花のりん片に胚珠（むき出し）。|Pine: pollen sacs on male scales, bare ovules on female scales.|松树：雄毬花鳞片有花粉囊，雌毬花鳞片有裸露的胚珠。"),
  Q("胚珠が子房の中にある植物を何という？|Plants with ovules inside an ovary are called…|胚珠包在子房里的植物叫做？","被子植物|Angiosperms|被子植物",
    [["裸子植物|Gymnosperms|裸子植物","裸子植物は子房がなく、胚珠がむき出しです。|Gymnosperms have no ovary; the ovules are bare.|裸子植物没有子房，胚珠裸露。"],["シダ植物|Ferns|蕨类植物","シダ植物は种子をつくらず、胞子でふえます。|Ferns make spores, not seeds.|蕨类不产生种子，用孢子繁殖。"],["コケ植物|Mosses|苔藓植物","コケ植物も胞子でふえます。|Mosses also reproduce by spores.|苔藓也是用孢子繁殖。"]],
    "被子植物：胚珠が子房の中。裸子植物：子房がなく胚珠がむき出し。|Angiosperms: ovules in an ovary. Gymnosperms: no ovary, bare ovules.|被子植物：胚珠在子房内。裸子植物：没有子房，胚珠裸露。"),
  Q("裸子植物はどれ？|Which is a gymnosperm?|哪一个是裸子植物？","イチョウ|Ginkgo|银杏",
    [["アブラナ|Rapeseed|油菜","アブラナは子房があるので被子植物です。|Rapeseed has an ovary: angiosperm.|油菜有子房，是被子植物。"],["サクラ|Cherry|樱花","サクラは実（果実）ができる被子植物です。|Cherry makes fruit: angiosperm.|樱花会结果实，是被子植物。"],["ツツジ|Azalea|杜鹃","ツツジは被子植物です。|Azalea is an angiosperm.|杜鹃是被子植物。"]],
    "裸子植物の例：マツ・イチョウ・スギ・ソテツ。|Gymnosperms: pine, ginkgo, cedar, cycad.|裸子植物的例子：松、银杏、杉、苏铁。"),
];

// 种子植物の分类（なかまの図）：空らんを1つかくす
const TREE=[["种子植物|Seed plants|种子植物",150,18],["被子植物|Angiosperms|被子植物",95,70],["裸子植物|Gymnosperms|裸子植物",225,70],["単子叶类|Monocots|单子叶植物",47,122],["双子叶类|Dicots|双子叶植物",147,122],["合弁花类|Fused petals|合瓣花类",100,174],["离弁花类|Free petals|离瓣花类",206,174]];
const TREE_E=[[0,1],[0,2],[1,3],[1,4],[4,5],[4,6]];
const TREE_WHY=["",
  "胚珠が子房の中にあるなかま|ovules inside an ovary|胚珠在子房内的一类","胚珠がむき出しのなかま|bare ovules|胚珠裸露的一类",
  "子叶が1枚のなかま|one seed leaf|子叶1片的一类","子叶が2枚のなかま|two seed leaves|子叶2片的一类",
  "花弁がくっついているなかま|petals joined together|花瓣连在一起的一类","花弁が1枚ずつ离れているなかま|petals separate|花瓣一片片分开的一类"];
function treeFig(hide){ let b=""; for(const [p,c] of TREE_E){ const P=TREE[p],Q2=TREE[c]; b+=L(P[1],P[2]+12,Q2[1],Q2[2]-12,"o"); }
  TREE.forEach(([n,x,y],i)=>{ b+=`<rect x="${x-46}" y="${y-12}" width="92" height="24" rx="6" class="${i===hide?"ac":"bx"}"/>`+T(x,y+4,i===hide?"A":X(n),i===hide?"lb":"sm"); }); return SV(300,192,b); }
function plantTree(){ const h=R(1,6); const ws=shuf([1,2,3,4,5,6].filter(i=>i!==h)).slice(0,3); const fig=treeFig(h);
  return {q:X("図の A に入るなかまは？|Which group goes in box A?|图中 A 应填入哪一类？")+fig,ans:X(TREE[h][0]),
    wrongs:ws.map(i=>({v:X(TREE[i][0]),why:X(`${X(TREE[i][0])}は${X(TREE_WHY[i])}です。図の位置を确かめよう。|${X(TREE[i][0])}: ${X(TREE_WHY[i])}. Check where it goes in the chart.|${X(TREE[i][0])}是${X(TREE_WHY[i])}。确认它在图中的位置。`)})),
    exp:X(`A は${X(TREE[h][0])}（${X(TREE_WHY[h])}）。|A is ${X(TREE[h][0])} (${X(TREE_WHY[h])}).|A 是${X(TREE[h][0])}（${X(TREE_WHY[h])}）。`),tf:v=>X("図の A は|Box A is|图中的 A 是")+fig+`→ ${v}`,kind:"fig"}; }
// 叶脉と根：A 平行脉 B 网状脉 C ひげ根 D 主根と侧根
const FIG_LR=SV(300,170,
  `<path d="M40 14 Q62 80 40 150 Q18 80 40 14 Z" class="ac"/>`+L(40,18,40,146)+`<path d="M34 26 Q27 80 34 138" class="k"/><path d="M46 26 Q53 80 46 138" class="k"/>`+
  `<path d="M115 16 Q174 64 115 152 Q56 64 115 16 Z" class="ac"/>`+L(115,20,115,148)+L(115,52,104,42)+L(115,52,126,42)+L(115,82,96,68)+L(115,82,134,68)+L(115,114,100,102)+L(115,114,130,102)+L(104,74,100,86)+L(126,74,130,86)+L(106,106,103,118)+L(124,106,127,118)+
  L(190,16,190,24,"o")+[[-26,96],[-18,110],[-8,116],[2,118],[12,114],[22,104],[30,88],[-32,76]].map(([dx,dy])=>`<path d="M190 24 Q${190+dx*.4} ${24+dy*.5} ${190+dx} ${24+dy}" class="o"/>`).join("")+
  `<line x1="262" y1="16" x2="262" y2="128" class="o" style="stroke-width:5"/>`+[[40,-20],[60,22],[78,-24],[96,20],[110,-14]].map(([y,dx])=>L(262,y,262+dx,y+14,"o")).join("")+
  T(40,166,"A")+T(115,166,"B")+T(190,166,"C")+T(262,166,"D"));
const bioClass=[plantTree,plantTree,plantTree,
  Q("図の A のような叶脉を何という？|What is the vein pattern in A called?|像图中 A 的叶脉叫做？","平行脉|Parallel veins|平行脉",
    [["网状脉|Net veins|网状脉","网状脉は B のように网の目になった叶脉です。|Net veins form a mesh like B.|网状脉是像 B 那样呈网状的叶脉。"],["ひげ根|Fibrous roots|须根","ひげ根は C のような根のようすです。|Fibrous roots look like C.|须根是像 C 那样的根。"],["主根|Taproot|主根","主根は D の太い根です。|The taproot is the thick root in D.|主根是 D 中粗的根。"]],
    "平行脉（A）は単子叶类、网状脉（B）は双子叶类。|Parallel veins (A): monocots. Net veins (B): dicots.|平行脉（A）是单子叶植物，网状脉（B）是双子叶植物。",FIG_LR),
  Q("図の B のような叶脉をもつ植物のなかまは？|Plants with leaves like B are…|叶脉像图中 B 的植物属于？","双子叶类|Dicots|双子叶植物",
    [["単子叶类|Monocots|单子叶植物","単子叶类の叶脉は A のような平行脉です。|Monocots have parallel veins like A.|单子叶植物是像 A 的平行脉。"],["裸子植物|Gymnosperms|裸子植物","叶脉のようすで分けるのは、単子叶类と双子叶类です。|Vein patterns separate monocots and dicots.|用叶脉区分的是单子叶和双子叶植物。"],["シダ植物|Ferns|蕨类植物","网状脉は双子叶类の特徴です。|Net veins are a dicot feature.|网状脉是双子叶植物的特征。"]],
    "双子叶类：子叶2枚・网状脉・主根と侧根。|Dicots: 2 seed leaves, net veins, taproot + side roots.|双子叶植物：子叶2片、网状脉、主根和侧根。",FIG_LR),
  Q("図の C のような根を何という？|What are roots like C called?|像图中 C 的根叫做？","ひげ根|Fibrous roots|须根",
    [["主根|Taproot|主根","主根は D のまん中の太い根です。|The taproot is the thick central root in D.|主根是 D 中间粗的根。"],["侧根|Side roots|侧根","侧根は主根から出る细い根です。|Side roots branch from the taproot.|侧根是从主根长出的细根。"],["平行脉|Parallel veins|平行脉","平行脉は叶のすじ（叶脉）のようすです。|Parallel veins are a leaf pattern.|平行脉是叶脉的样子。"]],
    "ひげ根（C）は単子叶类、主根と侧根（D）は双子叶类。|Fibrous roots (C): monocots. Taproot + side roots (D): dicots.|须根（C）是单子叶植物，主根和侧根（D）是双子叶植物。",FIG_LR),
  Q("単子叶类の特徴の组み合わせは？|Which set describes monocots?|单子叶植物的特征组合是？","子叶1枚・平行脉・ひげ根|1 seed leaf, parallel veins, fibrous roots|子叶1片・平行脉・须根",
    [["子叶2枚・网状脉・主根と侧根|2 seed leaves, net veins, taproot|子叶2片・网状脉・主根和侧根","それは双子叶类の特徴です。|Those are dicot features.|那是双子叶植物的特征。"],["子叶1枚・网状脉・主根と侧根|1 seed leaf, net veins, taproot|子叶1片・网状脉・主根和侧根","単子叶类の叶脉は平行脉、根はひげ根です。|Monocots have parallel veins and fibrous roots.|单子叶植物是平行脉、须根。"],["子叶2枚・平行脉・ひげ根|2 seed leaves, parallel veins, fibrous roots|子叶2片・平行脉・须根","単子叶类の子叶は1枚です。|Monocots have one seed leaf.|单子叶植物的子叶是1片。"]],
    "単子叶类：子叶1枚・平行脉・ひげ根（イネ・トウモロコシ・ユリ）。|Monocots: 1 seed leaf, parallel veins, fibrous roots (rice, corn, lily).|单子叶植物：子叶1片・平行脉・须根（稻、玉米、百合）。"),
  Q("単子叶类はどれ？|Which is a monocot?|哪一个是单子叶植物？","トウモロコシ|Corn|玉米",
    [["アブラナ|Rapeseed|油菜","アブラナは双子叶类（离弁花类）です。|Rapeseed is a dicot (free petals).|油菜是双子叶植物（离瓣花类）。"],["タンポポ|Dandelion|蒲公英","タンポポは双子叶类（合弁花类）です。|Dandelion is a dicot (fused petals).|蒲公英是双子叶植物（合瓣花类）。"],["エンドウ|Pea|豌豆","エンドウは双子叶类（离弁花类）です。|Pea is a dicot (free petals).|豌豆是双子叶植物（离瓣花类）。"]],
    "単子叶类の例：イネ・トウモロコシ・ユリ・ツユクサ。|Monocots: rice, corn, lily, dayflower.|单子叶植物：稻、玉米、百合、鸭跖草。"),
  Q("合弁花类はどれ？|Which has fused petals?|哪一个是合瓣花类？","アサガオ|Morning glory|牵牛花",
    [["アブラナ|Rapeseed|油菜","アブラナは花弁が4枚に离れている离弁花类です。|Rapeseed has 4 separate petals.|油菜的4片花瓣分开，是离瓣花类。"],["サクラ|Cherry|樱花","サクラは花弁が离れている离弁花类です。|Cherry petals are separate.|樱花的花瓣分开，是离瓣花类。"],["エンドウ|Pea|豌豆","エンドウは离弁花类です。|Pea has separate petals.|豌豆是离瓣花类。"]],
    "合弁花类：アサガオ・ツツジ・タンポポ。离弁花类：アブラナ・サクラ・エンドウ。|Fused: morning glory, azalea, dandelion. Free: rapeseed, cherry, pea.|合瓣花类：牵牛花、杜鹃、蒲公英。离瓣花类：油菜、樱花、豌豆。"),
  Q("被子植物と裸子植物を分ける特徴は？|What separates angiosperms from gymnosperms?|区分被子植物和裸子植物的特征是？","胚珠が子房の中にあるかどうか|Whether the ovules are inside an ovary|胚珠是否包在子房里",
    [["子叶の数|Number of seed leaves|子叶的数目","子叶の数で分けるのは単子叶类と双子叶类です。|That separates monocots and dicots.|用子叶数目区分的是单子叶和双子叶。"],["花弁がくっついているかどうか|Whether petals are joined|花瓣是否相连","それは合弁花类と离弁花类の分け方です。|That separates fused and free petals.|那是合瓣花类和离瓣花类的区分方法。"],["种子をつくるかどうか|Whether they make seeds|是否产生种子","どちらも种子をつくる种子植物です。|Both make seeds.|两者都是会产生种子的种子植物。"]],
    "被子：胚珠が子房の中。裸子：胚珠がむき出し。|Angiosperms: ovules in an ovary. Gymnosperms: bare ovules.|被子：胚珠在子房内。裸子：胚珠裸露。"),
];

// 种子をつくらない植物：见分け方の図（1つかくす）
const KEY_N=["种子植物|Seed plants|种子植物","シダ植物|Ferns|蕨类植物","コケ植物|Mosses|苔藓植物"];
function keyFig(h){ const box=(x,y,w,s,on)=>`<rect x="${x-w/2}" y="${y-13}" width="${w}" height="26" rx="6" class="${on?"ac":"bx"}"/>`+T(x,y+4,s,on?"lb":"sm");
  const yes=X("はい|Yes|是"),no=X("いいえ|No|否");
  return SV(320,200,box(110,20,190,X("种子をつくる？|Makes seeds?|产生种子？"),false)+L(70,33,50,72,"o")+L(150,33,210,72,"o")+T(46,56,yes,"xs")+T(196,52,no,"xs")+
    box(50,86,92,h===0?"A":X(KEY_N[0]),h===0)+box(210,86,190,X("根・茎・叶の区别がある？|Has roots, stems, leaves?|有根、茎、叶的区别？"),false)+
    L(170,99,140,140,"o")+L(250,99,270,140,"o")+T(140,124,yes,"xs")+T(280,124,no,"xs")+
    box(140,154,92,h===1?"A":X(KEY_N[1]),h===1)+box(266,154,92,h===2?"A":X(KEY_N[2]),h===2)); }
function plantKey(){ const h=R(0,2); const fig=keyFig(h); const ws=[0,1,2].filter(i=>i!==h).map(i=>({v:X(KEY_N[i]),why:X(`${X(KEY_N[i])}は図の别の场所です。「はい・いいえ」をたどり直そう。|${X(KEY_N[i])} is elsewhere in the chart. Follow the Yes/No again.|${X(KEY_N[i])}在图中别的位置，重新沿着「是・否」走一次。`)}));
  ws.push({v:X("裸子植物|Gymnosperms|裸子植物"),why:X("裸子植物は种子をつくるので「种子植物」の中のなかまです。|Gymnosperms make seeds, so they are inside \"seed plants\".|裸子植物会产生种子，属于种子植物的一部分。")});
  return {q:X("図の A に入るなかまは？|Which group goes in box A?|图中 A 应填入哪一类？")+fig,ans:X(KEY_N[h]),wrongs:ws,exp:X("种子をつくらない植物のうち、根・茎・叶の区别があるのがシダ植物、ないのがコケ植物。|Of plants without seeds, ferns have roots, stems and leaves; mosses don't.|不产生种子的植物中，有根茎叶区别的是蕨类，没有的是苔藓。"),tf:v=>X("図の A は|Box A is|图中的 A 是")+fig+`→ ${v}`,kind:"fig"}; }
const bioSpore=[plantKey,plantKey,
  Q("シダ植物やコケ植物は何でふえる？|How do ferns and mosses reproduce?|蕨类和苔藓靠什么繁殖？","胞子|Spores|孢子",
    [["种子|Seeds|种子","种子でふえるのは种子植物です。|Seed plants use seeds.|用种子繁殖的是种子植物。"],["花粉|Pollen|花粉","花粉は种子植物の花でつくられます。|Pollen is made by flowers of seed plants.|花粉是种子植物的花制造的。"],["胚珠|Ovules|胚珠","胚珠は种子植物の花の中にあります。|Ovules are in the flowers of seed plants.|胚珠在种子植物的花里。"]],
    "シダ植物・コケ植物は花をさかせず、胞子でふえる。|Ferns and mosses don't flower; they use spores.|蕨类和苔藓不开花，用孢子繁殖。"),
  Q("胞子が入っているふくろを何という？|What is the sac holding spores called?|装孢子的囊叫做？","胞子のう|Sporangium|孢子囊",
    [["花粉のう|Pollen sac|花粉囊","花粉のうはマツの雄花などにあり、花粉が入っています。|Pollen sacs hold pollen (e.g. pine).|花粉囊里装的是花粉（例如松树）。"],["子房|Ovary|子房","子房は被子植物のめしべのもとです。|The ovary is the base of a pistil.|子房是被子植物雌蕊的基部。"],["仮根|Rhizoid|假根","仮根はコケ植物の根のような部分です。|Rhizoids are root-like parts of mosses.|假根是苔藓像根的部分。"]],
    "胞子は胞子のうの中でつくられる。|Spores form inside sporangia.|孢子在孢子囊里形成。"),
  Q("シダ植物の特徴は？|What is true of ferns?|蕨类植物的特征是？","根・茎・叶の区别がある|They have roots, stems and leaves|有根、茎、叶的区别",
    [["根・茎・叶の区别がない|No roots, stems or leaves|没有根、茎、叶的区别","それはコケ植物の特徴です。|That is mosses.|那是苔藓的特征。"],["花をさかせて种子をつくる|They flower and make seeds|开花产生种子","シダ植物は花をさかせず、胞子でふえます。|Ferns have no flowers; they use spores.|蕨类不开花，用孢子繁殖。"],["体の表面全体から水を吸収する|They take in water through the whole surface|从整个身体表面吸水","それはコケ植物です。シダ植物は根から吸収します。|That is mosses; ferns use roots.|那是苔藓，蕨类用根吸水。"]],
    "シダ植物：根・茎・叶の区别あり、胞子でふえる（イヌワラビ・スギナ）。|Ferns: roots, stems, leaves; spores (e.g. Japanese painted fern, horsetail).|蕨类：有根茎叶，用孢子繁殖（例如蹄盖蕨、问荆）。"),
  Q("コケ植物の「仮根」のおもなはたらきは？|What do moss rhizoids mainly do?|苔藓「假根」的主要功能是？","体を地面などに固定する|Hold the plant to the ground|把身体固定在地面等处",
    [["水を吸収する|Absorb water|吸收水分","コケ植物は水を体の表面全体から吸収します。|Mosses absorb water through their whole surface.|苔藓从整个身体表面吸收水分。"],["胞子をつくる|Make spores|制造孢子","胞子は胞子のうでつくられます。|Spores form in sporangia.|孢子在孢子囊中形成。"],["栄养分をたくわえる|Store food|保存养分","仮根は体を固定するためのものです。|Rhizoids anchor the plant.|假根是用来固定身体的。"]],
    "コケ植物：根・茎・叶の区别なし。仮根で体を固定し、水は体の表面から。|Mosses: no true roots/stems/leaves; rhizoids anchor; water through the surface.|苔藓：没有根茎叶的区别，用假根固定，从表面吸水。"),
  Q("イヌワラビの茎はどこにある？|Where is the stem of a Japanese painted fern?|蹄盖蕨的茎在哪里？","地下（地下茎）|Underground (rhizome)|地下（地下茎）",
    [["地上にまっすぐ立っている|Standing up above ground|直立在地面上","地上に出ているのは叶です。茎は地下にあります。|What you see above ground are leaves; the stem is underground.|地面上的是叶，茎在地下。"],["叶の先|At the leaf tip|叶子的尖端","叶の先にあるのは叶の一部です。|The tip is part of the leaf.|叶尖是叶子的一部分。"],["茎はない|It has no stem|没有茎","シダ植物には根・茎・叶の区别があります。|Ferns do have stems.|蕨类有根、茎、叶的区别。"]],
    "イヌワラビは地下茎。地上に出ているのは叶。|Japanese painted fern: the stem is a rhizome; above ground is leaves.|蹄盖蕨的茎是地下茎，地面上的是叶。"),
  Q("ゼニゴケで、胞子のうがあるのは？|In liverworts (Marchantia), where are the sporangia?|地钱的孢子囊在哪一株？","雌株|Female plants|雌株",
    [["雄株|Male plants|雄株","雄株は精子をつくります。胞子のうは雌株です。|Male plants make sperm; sporangia are on females.|雄株产生精子，孢子囊在雌株。"],["両方|Both|两者都有","胞子のうができるのは雌株だけです。|Only female plants make sporangia.|只有雌株会形成孢子囊。"],["仮根|The rhizoids|假根","仮根は体を固定する部分です。|Rhizoids anchor the plant.|假根是固定身体的部分。"]],
    "ゼニゴケ・スギゴケは雌株と雄株があり、雌株に胞子のうができる。|Liverworts/mosses have male and female plants; sporangia form on females.|地钱、杉叶藓分雌株和雄株，雌株会形成孢子囊。"),
  Q("シダ植物はどれ？|Which is a fern?|哪一个是蕨类植物？","スギナ|Horsetail|问荆",
    [["スギゴケ|Haircap moss|杉叶藓","スギゴケはコケ植物です。|Haircap moss is a moss.|杉叶藓是苔藓。"],["スギ|Japanese cedar|日本柳杉","スギは种子をつくる裸子植物です。|Cedar is a seed-making gymnosperm.|柳杉是会产生种子的裸子植物。"],["ゼニゴケ|Liverwort|地钱","ゼニゴケはコケ植物です。|Liverwort is a bryophyte (moss group).|地钱是苔藓植物。"]],
    "シダ植物：イヌワラビ・スギナ・ゼンマイ。コケ植物：ゼニゴケ・スギゴケ。|Ferns: Japanese painted fern, horsetail, royal fern. Mosses: liverwort, haircap moss.|蕨类：蹄盖蕨、问荆、紫萁。苔藓：地钱、杉叶藓。"),
];

// 动物の分类：特徴の表（1つかくす）
const ANI=["鱼类|Fish|鱼类","両生类|Amphibians|两生类","は虫类|Reptiles|爬虫类","鸟类|Birds|鸟类","哺乳类|Mammals|哺乳类"];
// セルの「/」は図では改行、选択肢では「 / 」
const ANI_R=[["呼吸|Breathing|呼吸",["えら|Gills|鳃","子:えら・皮肤/亲:肺・皮肤|Young: gills, skin/Adult: lungs, skin|幼:鳃、皮肤/成:肺、皮肤","肺|Lungs|肺","肺|Lungs|肺","肺|Lungs|肺"],["気管|Tracheae|气管"]],
  ["体表|Body cover|体表",["うろこ|Scales|鳞片","しめった皮肤|Moist skin|湿润的皮肤","かたいうろこ|Hard scales|硬鳞片","羽毛|Feathers|羽毛","毛|Hair|毛"],[]],
  ["子のうまれ方|Birth|生殖方式",["卵（水中・壳なし）|Eggs in water|卵（水中・无壳）","卵（水中・壳なし）|Eggs in water|卵（水中・无壳）","卵（陆上・壳あり）|Shelled eggs, land|卵（陆上・有壳）","卵（陆上・壳あり）|Shelled eggs, land|卵（陆上・有壳）","胎生|Live birth|胎生"],["卵（陆上・壳なし）|Unshelled eggs, land|卵（陆上・无壳）"]]];
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
    return {v,why:who.length?X(`「${v}」は${who.join("・")}の特徴です。|"${v}" fits ${who.join(", ")}.|「${v}」是${who.join("、")}的特征。`):X(`「${v}」は脊椎动物のなかまの特徴ではありません。|"${v}" is not a feature of these vertebrates.|「${v}」不是这些脊椎动物的特征。`)}; });
  return {q:X(`表の A に入るのは？（${X(ANI[c])}の${X(rn)}）|What goes in A? (${X(rn)} of ${X(ANI[c])})|表中 A 应填入什么？（${X(ANI[c])}的${X(rn)}）`)+fig,ans,wrongs:ws,
    exp:X(`${X(ANI[c])}の${X(rn)}は「${ans}」。|${X(ANI[c])}: ${X(rn).toLowerCase()} = "${ans}".|${X(ANI[c])}的${X(rn)}是「${ans}」。`),tf:v=>X("表の A は|A in the table is|表中的 A 是")+fig+`→ ${v}`,kind:"fig"}; }
const bioAnimal=[aniTable,aniTable,aniTable,aniTable,
  Q("背骨をもつ动物を何という？|Animals with a backbone are called…|有脊椎骨的动物叫做？","脊椎动物|Vertebrates|脊椎动物",
    [["无脊椎动物|Invertebrates|无脊椎动物","无脊椎动物は背骨をもたない动物です。|Invertebrates have no backbone.|无脊椎动物没有脊椎骨。"],["节足动物|Arthropods|节肢动物","节足动物は外骨格をもつ无脊椎动物です。|Arthropods are invertebrates with exoskeletons.|节肢动物是有外骨骼的无脊椎动物。"],["软体动物|Mollusks|软件动物","软体动物は外とう膜をもつ无脊椎动物です。|Mollusks are invertebrates with a mantle.|软件动物是有外套膜的无脊椎动物。"]],
    "脊椎动物：鱼类・両生类・は虫类・鸟类・哺乳类の5つのなかま。|Vertebrates: fish, amphibians, reptiles, birds, mammals.|脊椎动物：鱼类、两生类、爬虫类、鸟类、哺乳类。"),
  Q("クジラは何类？|What kind of animal is a whale?|鲸鱼属于哪一类？","哺乳类|Mammal|哺乳类",
    [["鱼类|Fish|鱼类","クジラはえらではなく肺で呼吸します。|Whales breathe with lungs, not gills.|鲸鱼用肺呼吸，不是鳃。"],["両生类|Amphibian|两生类","クジラは子を乳で育てる胎生です。|Whales give live birth and feed milk.|鲸鱼是胎生，用乳汁哺育。"],["は虫类|Reptile|爬虫类","クジラは卵ではなく子をうみます。|Whales give birth to live young.|鲸鱼不是生蛋，是生小孩。"]],
    "クジラ・イルカは海にすむが、肺で呼吸し胎生なので哺乳类。|Whales and dolphins live in the sea but breathe air and give live birth: mammals.|鲸鱼、海豚住在海里，但用肺呼吸、胎生，是哺乳类。"),
  Q("「胎生」とはどんなうまれ方？|What is live birth (viviparity)?|什么是「胎生」？","母亲の体内である程度育ってからうまれる|Young grow inside the mother before birth|在母体内发育到某个程度后才出生",
    [["壳のある卵からうまれる|Hatching from shelled eggs|从有壳的蛋孵出","それは卵生（は虫类・鸟类）です。|That is egg-laying (reptiles, birds).|那是卵生（爬虫类、鸟类）。"],["水中の壳のない卵からうまれる|Hatching from eggs in water|从水中无壳的卵孵出","それは卵生（鱼类・両生类）です。|That is egg-laying (fish, amphibians).|那是卵生（鱼类、两生类）。"],["亲の体が2つに分かれてふえる|The parent splits in two|亲代身体分成两个","それは分裂といい、単细胞生物などのふえ方です。|That is fission (single-celled organisms).|那叫分裂，是单细胞生物等的繁殖方式。"]],
    "哺乳类は胎生。鱼类・両生类・は虫类・鸟类は卵生。|Mammals: live birth. Fish, amphibians, reptiles, birds: eggs.|哺乳类是胎生；鱼类、两生类、爬虫类、鸟类是卵生。"),
  Q("肉食动物の歯の特徴は？|What is special about a carnivore's teeth?|肉食动物牙齿的特征是？","犬歯が大きくするどい|Large, sharp canines|犬齿大而尖锐",
    [["臼歯が平らで大きい|Large flat molars|臼齿平而大","草をすりつぶす平らな臼歯は草食动物の特徴です。|Flat grinding molars are for plant eaters.|磨碎草的平臼齿是草食动物的特征。"],["门歯だけがある|Only incisors|只有门齿","肉食动物は犬歯で获物をとらえます。|Carnivores catch prey with canines.|肉食动物用犬齿捕捉猎物。"],["歯がない|No teeth|没有牙齿","肉食动物には犬歯や臼歯があります。|Carnivores have canines and molars.|肉食动物有犬齿和臼齿。"]],
    "肉食：犬歯で获物をとらえ、臼歯で肉をさく。草食：门歯で草をかみ切り、臼歯ですりつぶす。|Carnivores: canines catch, molars tear. Herbivores: incisors cut, molars grind.|肉食：犬齿捕捉、臼齿撕肉。草食：门齿切草、臼齿磨碎。"),
  Q("草食动物の目が颜の横向きについている利点は？|Why are a herbivore's eyes on the sides of its head?|草食动物的眼睛长在脸的两侧有什么好处？","広い范囲を见わたして敌を见つけやすい|They can see a wide area and spot enemies|能看见大范围，容易发现敌人",
    [["立体的に见える范囲が広く、距离をつかみやすい|Wide 3D vision to judge distance|立体视野广，容易判断距离","それは目が前向きの肉食动物の利点です。|That is the benefit of forward eyes (carnivores).|那是眼睛朝前的肉食动物的优点。"],["暗いところでも色が见える|They see color in the dark|在暗处也能看到颜色","目のつき方は见える范囲に関系します。|Eye position affects the field of view.|眼睛的位置和视野范围有关。"],["远くの获物を追いかけやすい|Easy to chase prey far away|容易追赶远方的猎物","获物を追うのは肉食动物です。|Chasing prey is what carnivores do.|追猎物的是肉食动物。"]],
    "草食：目が横向き → 视野が広い。肉食：目が前向き → 立体的に见えて距离がわかる。|Herbivores: side eyes, wide view. Carnivores: front eyes, depth perception.|草食：眼睛在两侧→视野广。肉食：眼睛朝前→看得立体、能判断距离。"),
  Q("昆虫のあしは体のどこに、何本ついている？|Where are an insect's legs, and how many?|昆虫的脚长在身体哪里？有几只？","胸部に6本|6 on the thorax|胸部，6只",
    [["腹部に6本|6 on the abdomen|腹部，6只","あしがついているのは胸部です。|Legs attach to the thorax.|脚长在胸部。"],["胸部に8本|8 on the thorax|胸部，8只","8本あしはクモのなかまです（昆虫ではない）。|8 legs is spiders, not insects.|8只脚是蜘蛛类（不是昆虫）。"],["头部に4本|4 on the head|头部，4只","头部には触角や口があります。|The head has antennae and mouth.|头部有触角和口。"]],
    "昆虫：头部・胸部・腹部。胸部に6本のあし。|Insects: head, thorax, abdomen; 6 legs on the thorax.|昆虫：头部、胸部、腹部；胸部有6只脚。"),
  Q("イカやアサリのように、内臓が外とう膜でおおわれている动物は？|Animals like squid and clams with organs covered by a mantle are…|像乌贼、蛤蜊那样内脏被外套膜包住的动物是？","软体动物|Mollusks|软件动物",
    [["节足动物|Arthropods|节肢动物","节足动物は外骨格と节のあるあしをもちます（エビ・バッタ）。|Arthropods have exoskeletons and jointed legs.|节肢动物有外骨骼和有节的脚（虾、蝗虫）。"],["哺乳类|Mammals|哺乳类","哺乳类は背骨のある脊椎动物です。|Mammals are vertebrates.|哺乳类是有脊椎的脊椎动物。"],["鱼类|Fish|鱼类","鱼类は背骨のある脊椎动物です。|Fish are vertebrates.|鱼类是脊椎动物。"]],
    "软体动物：外とう膜があり、背骨や节がない（イカ・タコ・アサリ・マイマイ）。|Mollusks: mantle, no backbone or joints (squid, octopus, clam, snail).|软件动物：有外套膜，没有脊椎和节（乌贼、章鱼、蛤蜊、蜗牛）。"),
  Q("エビやカニのからだの外侧をおおう、かたい壳を何という？|What is the hard outer shell of shrimp and crabs?|虾、蟹身体外面坚硬的壳叫做？","外骨格|Exoskeleton|外骨骼",
    [["外とう膜|Mantle|外套膜","外とう膜は软体动物の内臓をおおう膜です。|The mantle covers mollusk organs.|外套膜是包覆软件动物内脏的膜。"],["背骨|Backbone|脊椎骨","エビやカニは背骨のない无脊椎动物です。|Shrimp and crabs have no backbone.|虾、蟹是没有脊椎骨的无脊椎动物。"],["うろこ|Scales|鳞片","うろこは鱼类やは虫类の体表です。|Scales cover fish and reptiles.|鳞片是鱼类和爬虫类的体表。"]],
    "节足动物：外骨格があり、体とあしに节がある（昆虫类・甲壳类）。|Arthropods: exoskeleton, jointed body and legs (insects, crustaceans).|节肢动物：有外骨骼，身体和脚有节（昆虫类、甲壳类）。"),
];
/* ========== ② 身の回りの物质（第1分野(2)） ========== */
// ガスバーナー：A 空気调节ねじ（上） B ガス调节ねじ（下）
const FIG_GB=SV(220,220,`<path d="M100 38 Q92 18 100 4 Q108 18 100 38 Z" class="ac"/><path d="M100 36 Q96 26 100 18 Q104 26 100 36 Z" class="kf"/>`+
  `<rect x="88" y="40" width="24" height="150" rx="2" class="os"/><rect x="80" y="118" width="40" height="16" rx="3" class="ac"/><rect x="83" y="150" width="34" height="13" rx="3" class="ac"/>`+
  `<rect x="112" y="172" width="58" height="10" rx="3" class="os"/><ellipse cx="100" cy="200" rx="54" ry="11" class="os"/>`+TAG(168,126,121,126,"A")+TAG(40,160,82,156,"B"));
const MV="|g/cm³|";   // 単位
const mat1=[
  ()=>{ const a=pick(["A","B"]); const nm={A:"空気调节ねじ|Air adjustment screw|空气调节轮",B:"ガス调节ねじ|Gas adjustment screw|瓦斯调节轮"};
    return {q:X(`図のガスバーナーで、${a} のねじの名前は？|In the burner, what is screw ${a}?|图中本生灯的 ${a} 是？`)+FIG_GB,ans:X(nm[a]),
      wrongs:[{v:X(nm[a==="A"?"B":"A"]),why:X(`上が空気调节ねじ、下がガス调节ねじです。|The upper one adjusts air, the lower one gas.|上面是空气调节轮，下面是瓦斯调节轮。`)},{v:X("元栓|Main gas valve|总开关"),why:X("元栓はガス管の口にある栓です。|The main valve is at the gas outlet.|总开关在瓦斯管的出口。")},{v:X("コック|Cock (stopcock)|旋塞","コック"),why:X("コックはバーナーにつながるガスの通り道を开け闭めするものです。|The cock opens the gas line to the burner.|旋塞是开关通往灯的瓦斯信道。")}],
      exp:X("上：空気调节ねじ（炎の色）、下：ガス调节ねじ（炎の大きさ）。|Upper: air (flame color). Lower: gas (flame size).|上：空气调节轮（火焰颜色），下：瓦斯调节轮（火焰大小）。"),tf:v=>X(`図の ${a} は|Screw ${a} is|图中的 ${a} 是`)+FIG_GB+`→ ${v}`,kind:"fig"}; },
  Q("ガスバーナーの炎がオレンジ色でゆらゆらしている。どうする？|The flame is orange and flickering. What do you do?|本生灯的火焰是橘色、摇摇晃晃。该怎么做？","空気调节ねじを开いて空気を入れ、青い炎にする|Open the air screw to make a blue flame|打开空气调节轮让空气进入，变成蓝色火焰",
    [["ガス调节ねじを开いてガスを増やす|Open the gas screw for more gas|打开瓦斯调节轮增加瓦斯","ガスを増やすと炎が大きくなるだけで、空気は足りないままです。|More gas only makes it bigger; air is still lacking.|增加瓦斯只会让火焰变大，空气还是不足。"],["空気调节ねじを闭めて空気を减らす|Close the air screw|关紧空气调节轮","空気が足りないのでオレンジ色になっています。减らすと逆です。|It is orange because air is lacking.|是因为空气不足才变橘色，减少空气会更糟。"],["すぐに元栓を闭める|Close the main valve at once|马上关掉总开关","火を消す必要はありません。空気を调节します。|No need to turn it off; adjust the air.|不必熄火，调节空气就好。"]],
    "オレンジ色の炎＝空気不足。空気调节ねじを开いて青い炎に。|Orange flame = not enough air. Open the air screw for a blue flame.|橘色火焰＝空气不足。打开空气调节轮变成蓝色火焰。",FIG_GB),
  Q("有机物の说明で正しいのは？|Which describes organic matter?|关于有机物，正确的是？","炭素をふくみ、燃えると二酸化炭素が出る|Contains carbon; burning gives carbon dioxide|含有碳，燃烧会产生二氧化碳",
    [["燃えると酸素が出る|Burning gives oxygen|燃烧会产生氧气","燃えるときは酸素が使われ、二酸化炭素と水ができます。|Burning uses oxygen and makes CO₂ and water.|燃烧时会消耗氧气，产生二氧化碳和水。"],["电気をよく通す|Conducts electricity well|很容易导电","电気をよく通すのは金属の性质です。|Conducting electricity is a metal property.|导电是金属的性质。"],["燃えずに白い粉が残る|Doesn't burn; white powder remains|不会燃烧，留下白色粉末","それは食塩などの无机物です。|That is inorganic matter like salt.|那是食盐等无机物。"]],
    "有机物：炭素をふくむ（砂糖・デンプン・ロウ・プラスチック）。燃えて二酸化炭素と水ができる。|Organic: contains carbon (sugar, starch, wax, plastic). Burns into CO₂ and water.|有机物：含碳（糖、淀粉、蜡、塑料），燃烧产生二氧化碳和水。"),
  Q("有机物はどれ？|Which is organic matter?|哪一个是有机物？","砂糖|Sugar|砂糖",
    [["食塩|Salt|食盐","食塩は燃えない无机物です。|Salt doesn't burn: inorganic.|食盐不会燃烧，是无机物。"],["ガラス|Glass|玻璃","ガラスは无机物です。|Glass is inorganic.|玻璃是无机物。"],["鉄|Iron|铁","鉄は金属で、无机物です。|Iron is a metal: inorganic.|铁是金属，属于无机物。"]],
    "有机物：砂糖・デンプン・ロウ・エタノール・プラスチック・木。|Organic: sugar, starch, wax, ethanol, plastic, wood.|有机物：砂糖、淀粉、蜡、酒精、塑料、木头。"),
  Q("金属に共通する性质ではないものは？|Which is NOT shared by all metals?|哪一个不是金属共同的性质？","磁石につく|Sticks to a magnet|会被磁铁吸引",
    [["电気をよく通す|Conducts electricity|容易导电","电気をよく通すのはすべての金属の性质です。|All metals conduct electricity.|所有金属都容易导电。"],["みがくと光る（金属光沢）|Shiny when polished|磨过会发亮（金属光泽）","金属光沢はすべての金属にあります。|All metals have luster.|所有金属都有金属光泽。"],["たたくと広がり、引っぱるとのびる|Can be hammered flat and stretched|敲打会延展、拉扯会伸长","展性・延性はすべての金属の性质です。|All metals are malleable and ductile.|延展性是所有金属的性质。"]],
    "磁石につくのは鉄など一部の金属だけ。アルミニウムや铜はつかない。|Only some metals like iron stick to magnets; aluminum and copper don't.|只有铁等部分金属会被磁铁吸，铝和铜不会。"),
  Q("砂糖・食塩・デンプンのうち、水にとけにくく、ヨウ素液で青紫色になるのは？|Of sugar, salt and starch, which barely dissolves and turns blue-purple with iodine?|砂糖、食盐、淀粉中，不易溶于水、遇碘液变蓝紫色的是？","デンプン|Starch|淀粉",
    [["砂糖|Sugar|砂糖","砂糖は水によくとけます。|Sugar dissolves well.|砂糖很容易溶于水。"],["食塩|Salt|食盐","食塩は水によくとけ、ヨウ素液に反応しません。|Salt dissolves and doesn't react with iodine.|食盐易溶于水，不和碘液反应。"],["どれも青紫色になる|All turn blue-purple|全部都会变蓝紫色","ヨウ素液で青紫色になるのはデンプンだけです。|Only starch turns blue-purple.|只有淀粉遇碘液会变蓝紫色。"]],
    "白い粉の见分け方：加热してこげる→砂糖かデンプン、水にとけにくい・ヨウ素液→デンプン。|White powders: burns black → sugar or starch; insoluble + iodine → starch.|白色粉末的分辨：加热烧焦→糖或淀粉，不溶于水、遇碘液→淀粉。"),
  Q("「物质」を表しているのはどれ？|Which word names a substance (material)?|哪一个表示「物质」？","ガラス|Glass|玻璃",
    [["コップ|Cup|杯子","コップは形や大きさで见たときの「物体」です。|A cup is an object (by shape and use).|杯子是从形状、用途来看的「物体」。"],["机|Desk|桌子","机は物体です。材料（木など）が物质です。|A desk is an object; its material (wood) is the substance.|桌子是物体，材料（木头等）才是物质。"],["ボール|Ball|球","ボールは物体です。|A ball is an object.|球是物体。"]],
    "物体：形や大きさで见たもの（コップ）。物质：材料で见たもの（ガラス）。|Object: by shape/use (cup). Substance: by material (glass).|物体：从形状、用途看（杯子）。物质：从材料看（玻璃）。"),
];

// 密度
const DEN=[["アルミニウム|aluminum|铝",2.70],["亜铅|zinc|锌",7.13],["鉄|iron|铁",7.87],["铜|copper|铜",8.96],["银|silver|银",10.50],["铅|lead|铅",11.35],["金|gold|金",19.32]];
const dU=" g/cm³";
const DEN_EXP=(m,V,d)=>X(`密度 ＝ 质量 ÷ 体积 ＝ ${m} ÷ ${V} ＝ ${d} g/cm³|Density = mass ÷ volume = ${m} ÷ ${V} = ${d} g/cm³|密度 ＝ 质量 ÷ 体积 ＝ ${m} ÷ ${V} ＝ ${d} g/cm³`);
function denCalc(){ const [n,d]=pick(DEN); const V=pick([10,20,30,40,50]); const m=fm(d*V);
  return C(X(`质量 ${m} g、体积 ${V} cm³ の金属の密度は？|A metal has mass ${m} g and volume ${V} cm³. Its density?|质量 ${m} g、体积 ${V} cm³ 的金属，密度是？`),d,dU,
    [[V/m,X("わる顺番が逆です。质量 ÷ 体积。|Divided the wrong way: mass ÷ volume.|除的顺序相反：质量 ÷ 体积。")],[m*V,X("かけ算ではなく、わり算です。|Divide, don't multiply.|是除法，不是乘法。")],[m-V,X("ひき算ではなく、わり算です。|Divide, don't subtract.|是除法，不是减法。")]],DEN_EXP(m,V,fm(d))); }
function denMass(){ const [n,d]=pick(DEN); const V=pick([2,4,5,10,20]); const m=+(d*V).toFixed(2);
  return C(X(`密度 ${fm(d)} g/cm³ の金属 ${V} cm³ の质量は？|A metal with density ${fm(d)} g/cm³ and volume ${V} cm³. Its mass?|密度 ${fm(d)} g/cm³ 的金属 ${V} cm³，质量是？`),m," g",
    [[d/V,X("质量 ＝ 密度 × 体积。わるのではなくかけます。|Mass = density × volume. Multiply.|质量 ＝ 密度 × 体积，要相乘。")],[V/d,X("质量 ＝ 密度 × 体积 です。|Mass = density × volume.|质量 ＝ 密度 × 体积。")],[d+V,X("たし算ではなく、かけ算です。|Multiply, don't add.|是乘法，不是加法。")]],
    X(`质量 ＝ 密度 × 体积 ＝ ${fm(d)} × ${V} ＝ ${fm(m)} g|Mass = density × volume = ${fm(d)} × ${V} = ${fm(m)} g|质量 ＝ 密度 × 体积 ＝ ${fm(d)} × ${V} ＝ ${fm(m)} g`)); }
function denVol(){ const [n,d]=pick(DEN); const V=pick([5,10,15,20,25]); const m=fm(d*V);
  return C(X(`密度 ${fm(d)} g/cm³ の金属が ${m} g ある。体积は？|A metal (density ${fm(d)} g/cm³) has mass ${m} g. Its volume?|密度 ${fm(d)} g/cm³ 的金属有 ${m} g，体积是？`),V," cm³",
    [[m*d,X("体积 ＝ 质量 ÷ 密度。かけるのではなくわります。|Volume = mass ÷ density. Divide.|体积 ＝ 质量 ÷ 密度，要相除。")],[d/m,X("わる顺番が逆です。质量 ÷ 密度。|Divided the wrong way: mass ÷ density.|除的顺序相反：质量 ÷ 密度。")],[m-d,X("ひき算ではなく、わり算です。|Divide, don't subtract.|是除法，不是减法。")]],
    X(`体积 ＝ 质量 ÷ 密度 ＝ ${m} ÷ ${fm(d)} ＝ ${V} cm³|Volume = mass ÷ density = ${m} ÷ ${fm(d)} = ${V} cm³|体积 ＝ 质量 ÷ 密度 ＝ ${m} ÷ ${fm(d)} ＝ ${V} cm³`)); }
function denWhich(){ const four=shuf(DEN).slice(0,4); const [n,d]=four[0]; const V=pick([10,20,30,40]); const m=fm(d*V);
  let rows=""; four.slice().sort((a,b)=>a[1]-b[1]).forEach(([nn,dd],i)=>{ rows+=T(20,24+i*24,X(nn),"sm","start")+T(200,24+i*24,fm(dd)+" g/cm³","sm","end"); });
  const fig=SV(220,112,rows);
  return {q:X(`质量 ${m} g、体积 ${V} cm³ の金属は、表のどれ？|Which metal in the table has mass ${m} g and volume ${V} cm³?|质量 ${m} g、体积 ${V} cm³ 的金属是表中的哪一个？`)+fig,ans:X(n),
    wrongs:four.slice(1).map(([nn,dd])=>({v:X(nn),why:X(`${X(nn)}の密度は ${fm(dd)} g/cm³。${m} ÷ ${V} ＝ ${fm(d)} g/cm³ です。|${X(nn)} is ${fm(dd)} g/cm³, but ${m} ÷ ${V} = ${fm(d)} g/cm³.|${X(nn)}的密度是 ${fm(dd)} g/cm³，而 ${m} ÷ ${V} ＝ ${fm(d)} g/cm³。`)})),
    exp:DEN_EXP(m,V,fm(d))+X("。密度は物质によって决まっているので、物质を见分けられる。|. Density is fixed for each substance, so it identifies the substance.|。密度依物质而定，所以可以用来分辨物质。"),tf:v=>X(`质量 ${m} g・体积 ${V} cm³ の金属は|The metal (${m} g, ${V} cm³) is|质量 ${m} g、体积 ${V} cm³ 的金属是`)+fig+`→ ${v}`,kind:"fig"}; }
const FLOAT=[["氷|ice|冰",0.92],["ポリエチレン|polyethylene|聚乙烯",0.95],["ポリプロピレン|polypropylene|聚丙烯",0.90],["スギの木|cedar wood|杉木",0.38]],SINK=[["ポリスチレン|polystyrene|聚苯乙烯",1.06],["ポリ塩化ビニル|PVC|聚氯乙烯",1.40],["ガラス|glass|玻璃",2.50],["アルミニウム|aluminum|铝",2.70],["鉄|iron|铁",7.87]];
function denFloat(){ const up=Math.random()<.6; const a=pick(up?FLOAT:SINK); const others=shuf(up?SINK:FLOAT).slice(0,3); const lab=([n,d])=>`${X(n)}（${fm(d)}）`;
  return {q:X(up?"水（密度 1.00 g/cm³）に入れると浮くのは？（ ）は密度 g/cm³|Which floats in water (1.00 g/cm³)? (density in g/cm³)|放进水（密度 1.00 g/cm³）中会浮起来的是？（括号内为密度 g/cm³）":"水（密度 1.00 g/cm³）に入れると沈むのは？（ ）は密度 g/cm³|Which sinks in water (1.00 g/cm³)? (density in g/cm³)|放进水（密度 1.00 g/cm³）中会沉下去的是？（括号内为密度 g/cm³）"),ans:lab(a),
    wrongs:others.map(o=>({v:lab(o),why:X(up?`密度が水より大きい（${fm(o[1])} > 1.00）ので沈みます。|Denser than water (${fm(o[1])} > 1.00), so it sinks.|密度比水大（${fm(o[1])} > 1.00），所以会沉。`:`密度が水より小さい（${fm(o[1])} < 1.00）ので浮きます。|Less dense than water (${fm(o[1])} < 1.00), so it floats.|密度比水小（${fm(o[1])} < 1.00），所以会浮。`)})),
    exp:X("水より密度が小さい物质は浮き、大きい物质は沈む。|Less dense than water floats; denser sinks.|密度比水小的会浮，比水大的会沉。"),tf:v=>X(up?"水に浮くのは|This floats in water:|会浮在水上的是":"水に沈むのは|This sinks in water:|会沉入水中的是")+` ${v}`,kind:"word"}; }
// メスシリンダーの目盛り
function cylRead(){ const b=R(4,11)*5, v=b+R(1,8)*.5; const y=u=>190-(u-b)*30, Y=y(v);
  let tk=""; for(let i=0;i<=5;i++){ tk+=L(80,y(b+i),i%5?92:98,y(b+i),"o"); } tk+=T(72,y(b)+4,String(b),"sm","end")+T(72,y(b+5)+4,String(b+5),"sm","end");
  const fig=SV(200,215,`<path d="M80 ${Y-9} Q115 ${Y+9} 150 ${Y-9} L150 205 L80 205 Z" class="wa"/><path d="M80 ${Y-9} Q115 ${Y+9} 150 ${Y-9}" class="o"/>`+L(80,24,80,206,"o")+L(150,24,150,206,"o")+tk+T(175,y(b+2.5),"mL","sm"));
  const ans=v.toFixed(1); const ws=[[(v+.5).toFixed(1),"液面のへこんだ下の面を読みます。ふちの高いところではありません。|Read the bottom of the curved surface, not the edges.|要读液面凹下去的最低处，不是边缘。"],[String(Math.round(v+.01)),"最小目盛りの10分の1まで目分量で読みます（小数第1位まで）。|Estimate to 1/10 of the smallest division (one decimal).|要估读到最小刻度的十分之一（小数第1位）。"],[(2*b+5-v).toFixed(1),"目盛りは下から上へ大きくなります。|The scale increases upward.|刻度是由下往上变大。"],[(v-1).toFixed(1),"目盛りを1つ数えまちがえています。|You miscounted one division.|刻度数错了一格。"]].filter(([w])=>w!==ans&&w!==String(+ans));
  return {q:X("メスシリンダーの目盛りを読むと何 mL？|What is the reading in mL?|量筒的刻度是多少 mL？")+fig,ans:ans+" mL",wrongs:UQ(ans+" mL",ws.map(([w,why])=>({v:w+" mL",why:X(why)}))).slice(0,3),
    exp:X(`目の高さを液面にそろえ、へこんだ下の面を、最小目盛りの10分の1まで読む → ${ans} mL|Eye level with the surface; read the bottom of the curve to 1/10 of a division → ${ans} mL|视线与液面同高，读凹面最低处，估读到最小刻度的十分之一 → ${ans} mL`),tf:v=>X("目盛りは|The reading is|刻度是")+fig+`→ ${v}`,kind:"fig"}; }
function denDisp(){ const [n,d]=pick(DEN); const a=pick([40,50,60]),V=R(2,9); const m=fm(d*V),b=a+V;
  return C(X(`メスシリンダーに水を ${a}.0 cm³ 入れ、质量 ${m} g の金属を沈めると、目盛りが ${b}.0 cm³ になった。金属の密度は？|A cylinder holds ${a}.0 cm³ of water. Sinking a ${m} g metal raises it to ${b}.0 cm³. The metal's density?|量筒中装水 ${a}.0 cm³，放入质量 ${m} g 的金属后，刻度变成 ${b}.0 cm³。金属的密度是？`),d,dU,
    [[m/b,X("体积は「ふえた分」です。水の体积をふくめません。|The volume is the increase only, not including the water.|体积是「增加的部分」，不包含水的体积。")],[m/a,X("体积は ふえた分（后 − 前）です。|Volume = after − before.|体积是增加的部分（后 − 前）。")],[V/m,X("わる顺番が逆です。质量 ÷ 体积。|Divided the wrong way: mass ÷ volume.|除的顺序相反：质量 ÷ 体积。")]],
    X(`体积 ＝ ${b} − ${a} ＝ ${V} cm³、密度 ＝ ${m} ÷ ${V} ＝ ${fm(d)} g/cm³|Volume = ${b} − ${a} = ${V} cm³, density = ${m} ÷ ${V} = ${fm(d)} g/cm³|体积 ＝ ${b} − ${a} ＝ ${V} cm³，密度 ＝ ${m} ÷ ${V} ＝ ${fm(d)} g/cm³`)); }
const mat2=[denCalc,denCalc,denMass,denVol,denWhich,denWhich,denFloat,cylRead,cylRead,denDisp];

// 気体の集め方：A 水上置换法 B 上方置换法 C 下方置换法
const FIG_GAS=SV(330,175,
  `<rect x="6" y="96" width="100" height="56" class="o"/><rect x="7" y="104" width="98" height="47" class="wa"/><path d="M56 128 L56 52 Q66 38 76 52 L76 128 Z" class="wa"/><path d="M56 128 L56 52 Q66 38 76 52 L76 128" class="o"/><path d="M0 76 L30 76 L30 140 L66 140 L66 124" class="o"/>`+
  `<path d="M150 112 L150 46 Q160 32 170 46 L170 112" class="o"/><path d="M120 150 L160 150 L160 52" class="o"/>`+
  `<path d="M260 36 L260 110 Q270 124 280 110 L280 36" class="o"/><path d="M228 18 L270 18 L270 108" class="o"/>`+T(56,170,"A")+T(160,170,"B")+T(270,170,"C"));
const GAS_NM={A:"水上置换法|Water displacement|排水集气法",B:"上方置换法|Upward delivery|向下排空气法",C:"下方置换法|Downward delivery|向上排空气法"};
const GAS_DO={A:"水にとけにくい気体|gases that barely dissolve in water|难溶于水的气体",B:"水にとけやすく、空気より軽い気体|soluble gases lighter than air|易溶于水、比空气轻的气体",C:"水にとけやすく、空気より重い気体|soluble gases heavier than air|易溶于水、比空气重的气体"};
function gasWay(){ const a=pick(["A","B","C"]); const ws=["A","B","C"].filter(k=>k!==a).map(k=>({v:X(GAS_NM[k]),why:X(`${X(GAS_NM[k])}は図の ${k}（${X(GAS_DO[k])}を集める）。|${X(GAS_NM[k])} is ${k} (for ${X(GAS_DO[k])}).|${X(GAS_NM[k])}是图中的 ${k}（收集${X(GAS_DO[k])}）。`)}));
  ws.push({v:X("ろ过|Filtration|过滤"),why:X("ろ过は液体と固体を分ける方法です。|Filtration separates solids from liquids.|过滤是分离固体和液体的方法。")});
  return {q:X(`図の ${a} の気体の集め方を何という？|What is collection method ${a} called?|图中 ${a} 的集气法叫做？`)+FIG_GAS,ans:X(GAS_NM[a]),wrongs:ws,
    exp:X(`${a}：${X(GAS_NM[a])}。${X(GAS_DO[a])}を集める。|${a}: ${X(GAS_NM[a])}, for ${X(GAS_DO[a])}.|${a}：${X(GAS_NM[a])}，收集${X(GAS_DO[a])}。`),tf:v=>X(`図の ${a} は|Method ${a} is|图中的 ${a} 是`)+FIG_GAS+`→ ${v}`,kind:"fig"}; }
const GN={O:"酸素|Oxygen|氧气",C:"二酸化炭素|Carbon dioxide|二氧化碳",H:"水素|Hydrogen|氢气",N:"アンモニア|Ammonia|氨",Z:"窒素|Nitrogen|氮气"};
const gq=(q,a,ws,exp,fig)=>Q(q,GN[a],ws.map(([k,why])=>[GN[k],why]),exp,fig);
const mat3=[gasWay,gasWay,
  gq("二酸化マンガンにうすい过酸化水素水（オキシドール）を加えると発生する気体は？|Adding dilute hydrogen peroxide to manganese dioxide produces…|在二氧化锰中加入稀过氧化氢（双氧水），产生的气体是？","O",
    [["C","二酸化炭素は石灰石にうすい塩酸を加えると発生します。|CO₂ comes from limestone + dilute HCl.|二氧化碳是石灰石加稀盐酸产生的。"],["H","水素は亜铅などにうすい塩酸を加えると発生します。|Hydrogen comes from zinc + dilute HCl.|氢气是锌等加稀盐酸产生的。"],["N","アンモニアは塩化アンモニウムと水酸化カルシウムを加热して発生させます。|Ammonia comes from heating ammonium chloride + calcium hydroxide.|氨是加热氯化铵和氢氧化钙产生的。"]],
    "酸素：二酸化マンガン＋过酸化水素水。火のついた线香を入れると激しく燃える。|Oxygen: MnO₂ + H₂O₂. A glowing incense stick burns brightly.|氧气：二氧化锰＋过氧化氢。放入点燃的线香会剧烈燃烧。"),
  gq("石灰石にうすい塩酸を加えると発生する気体は？|Adding dilute hydrochloric acid to limestone produces…|在石灰石中加入稀盐酸，产生的气体是？","C",
    [["O","酸素は二酸化マンガンと过酸化水素水で発生します。|Oxygen comes from MnO₂ + H₂O₂.|氧气是二氧化锰加过氧化氢产生的。"],["H","水素は亜铅や鉄などの金属にうすい塩酸を加えると発生します。|Hydrogen comes from metals like zinc + HCl.|氢气是锌、铁等金属加稀盐酸产生的。"],["Z","窒素は空気中に多くふくまれる気体です。|Nitrogen is the main gas in air.|氮气是空气中含量最多的气体。"]],
    "二酸化炭素：石灰石（贝壳・卵の壳）＋うすい塩酸。石灰水を白くにごらせる。|CO₂: limestone (shells) + dilute HCl. Turns limewater milky.|二氧化碳：石灰石（贝壳、蛋壳）＋稀盐酸，使石灰水变白浊。"),
  gq("亜铅にうすい塩酸を加えると発生する気体は？|Adding dilute hydrochloric acid to zinc produces…|在锌中加入稀盐酸，产生的气体是？","H",
    [["C","塩酸で二酸化炭素が出るのは石灰石のときです。|HCl gives CO₂ with limestone, not zinc.|盐酸加石灰石才会产生二氧化碳。"],["O","酸素は二酸化マンガンと过酸化水素水です。|Oxygen comes from MnO₂ + H₂O₂.|氧气是二氧化锰加过氧化氢。"],["N","アンモニアは加热して発生させます。|Ammonia is made by heating.|氨是加热产生的。"]],
    "水素：亜铅・鉄・マグネシウム＋うすい塩酸。火を近づけると音を立てて燃え、水ができる。|Hydrogen: zinc/iron/magnesium + dilute HCl. Pops with a flame and makes water.|氢气：锌、铁、镁＋稀盐酸。靠近火会发出声音燃烧，产生水。"),
  gq("石灰水を白くにごらせる気体は？|Which gas turns limewater milky?|会使石灰水变白浊的气体是？","C",
    [["O","酸素は物を燃やすはたらきがあります。石灰水は変化しません。|Oxygen helps burning; limewater doesn't change.|氧气有助燃性，石灰水不会变化。"],["H","水素は燃える気体です。石灰水は変化しません。|Hydrogen burns; limewater doesn't change.|氢气是可燃气体，石灰水不变。"],["Z","窒素は変化しにくい気体です。|Nitrogen is unreactive.|氮气不容易起反应。"]],
    "二酸化炭素は石灰水を白くにごらせる。水に少しとけ、水溶液は酸性。|CO₂ turns limewater milky; dissolves a little; its solution is acidic.|二氧化碳使石灰水变白浊；稍溶于水，水溶液呈酸性。"),
  gq("火のついた线香を入れると、线香が激しく燃える気体は？|Which gas makes a glowing incense stick burn brightly?|放入点燃的线香会剧烈燃烧的气体是？","O",
    [["C","二酸化炭素の中では线香の火は消えます。|In CO₂ the flame goes out.|在二氧化碳中线香的火会熄灭。"],["H","水素は自分が燃える気体です。物を燃やすはたらきはありません。|Hydrogen burns itself but doesn't help burning.|氢气是自己会燃烧的气体，没有助燃性。"],["Z","窒素の中では火は消えます。|In nitrogen the flame goes out.|在氮气中火会熄灭。"]],
    "酸素：物を燃やすはたらき（助燃性）がある。気体そのものは燃えない。|Oxygen supports burning but doesn't burn itself.|氧气有助燃性，本身不会燃烧。"),
  gq("水にとけやすく、空気より軽く、においのある気体は？|Which gas is very soluble, lighter than air and smelly?|极易溶于水、比空气轻、有刺激性气味的气体是？","N",
    [["H","水素は水にとけにくく、においもありません。|Hydrogen barely dissolves and has no smell.|氢气难溶于水，也没有气味。"],["C","二酸化炭素は空気より重く、においがありません。|CO₂ is heavier than air and odorless.|二氧化碳比空气重，没有气味。"],["O","酸素は水にとけにくく、においがありません。|Oxygen barely dissolves and is odorless.|氧气难溶于水，没有气味。"]],
    "アンモニア：刺激臭、水にとけやすい（アルカリ性）、空気より軽い → 上方置换法。|Ammonia: sharp smell, very soluble (alkaline), lighter than air → upward delivery.|氨：刺激性气味、极易溶于水（碱性）、比空气轻 → 向下排空气法。"),
  gq("空気中にいちばん多くふくまれている気体は？|Which gas makes up most of the air?|空气中含量最多的气体是？","Z",
    [["O","酸素は约21%で2番目です。|Oxygen is about 21%, second.|氧气约21%，排第二。"],["C","二酸化炭素は约0.04%しかありません。|CO₂ is only about 0.04%.|二氧化碳只有约0.04%。"],["H","水素は空気中にほとんどありません。|Air has almost no hydrogen.|空气中几乎没有氢气。"]],
    "空気：窒素 约78%、酸素 约21%。|Air: nitrogen ~78%, oxygen ~21%.|空气：氮气约78%、氧气约21%。"),
  gq("最も密度が小さい（いちばん軽い）気体は？|Which is the least dense (lightest) gas?|密度最小（最轻）的气体是？","H",
    [["N","アンモニアも空気より軽いですが、水素ほどではありません。|Ammonia is lighter than air, but not as light as hydrogen.|氨也比空气轻，但没有氢气那么轻。"],["O","酸素は空気より少し重いです。|Oxygen is slightly heavier than air.|氧气比空气稍重。"],["C","二酸化炭素は空気より重いです。|CO₂ is heavier than air.|二氧化碳比空气重。"]],
    "水素：物质の中で最も密度が小さい。水にとけにくいので水上置换法。|Hydrogen: the least dense substance; collect by water displacement.|氢气：密度最小的物质；难溶于水，用排水集气法。"),
  Q("アンモニアを集めるのに适した方法は？|Which method is best for collecting ammonia?|收集氨最适合的方法是？","上方置换法|Upward delivery|向下排空气法",
    [["水上置换法|Water displacement|排水集气法","アンモニアは水にとけやすいので水上置换法は使えません。|Ammonia dissolves in water, so you can't use water.|氨极易溶于水，不能用排水集气法。"],["下方置换法|Downward delivery|向上排空气法","下方置换法は空気より重い気体用です。アンモニアは軽い。|That is for heavier gases; ammonia is lighter.|那是比空气重的气体用的，氨比较轻。"],["ろ过|Filtration|过滤","ろ过は液体と固体を分ける方法です。|Filtration separates solids from liquids.|过滤是分离固体和液体的方法。"]],
    "水にとけやすく空気より軽い → 上方置换法。|Soluble and lighter than air → upward delivery.|易溶于水且比空气轻 → 向下排空气法。",FIG_GAS),
];

// 水溶液
function conc(){ const T0=pick([50,100,200,250,400,500]); const ps=[2,4,5,8,10,12,15,20,25,30].filter(p=>T0*p%100===0); const p=pick(ps); const a=T0*p/100,b=T0-a;
  return C(X(`水 ${b} g に食塩 ${a} g をとかした食塩水の质量パーセント浓度は？|${a} g of salt dissolved in ${b} g of water. Mass percent concentration?|在 ${b} g 水中溶解 ${a} g 食盐，食盐水的质量百分浓度是？`),p," %",
    [[a/b*100,X("わる数は水の质量ではなく、水溶液全体（水＋食塩）の质量です。|Divide by the whole solution (water + salt), not just water.|要除以整个溶液（水＋盐）的质量，不是只有水。")],[a,X("そのままではなく、水溶液全体の质量でわって100をかけます。|Divide by the solution mass and × 100.|要除以溶液总质量再乘100。")],[a/T0,X("100をかけて％にします。|Multiply by 100 for %.|要乘100换成%。")]],
    X(`浓度 ＝ 溶质 ÷ 溶液 × 100 ＝ ${a} ÷ (${b}＋${a}) × 100 ＝ ${p} %|% = solute ÷ solution × 100 = ${a} ÷ (${b} + ${a}) × 100 = ${p} %|浓度 ＝ 溶质 ÷ 溶液 × 100 ＝ ${a} ÷ (${b}＋${a}) × 100 ＝ ${p} %`)); }
function concMass(){ const T0=pick([50,100,150,200,300,400]); const p=pick([2,5,10,15,20]); const a=T0*p/100; if(!Number.isInteger(a*10)) return concMass();
  return C(X(`${p} % の砂糖水 ${T0} g にとけている砂糖は何 g？|How much sugar is in ${T0} g of ${p}% sugar water?|${p} % 的糖水 ${T0} g 中溶有多少 g 的糖？`),a," g",
    [[T0*p,X("100でわるのをわすれています。|You forgot to divide by 100.|忘了除以100。")],[T0/p,X("溶质 ＝ 溶液 × 浓度 ÷ 100 です。|Solute = solution × % ÷ 100.|溶质 ＝ 溶液 × 浓度 ÷ 100。")],[T0-a,X("それは水（溶媒）の质量です。|That is the water (solvent) mass.|那是水（溶剂）的质量。")]],
    X(`溶质 ＝ ${T0} × ${p} ÷ 100 ＝ ${fm(a)} g|Solute = ${T0} × ${p} ÷ 100 = ${fm(a)} g|溶质 ＝ ${T0} × ${p} ÷ 100 ＝ ${fm(a)} g`)); }
// 溶解度曲线：硝酸カリウムと塩化ナトリウム（100 g の水）
const KNO3=[13.3,22,31.6,45.6,63.9,85.2,109.2,138,168.8],NACL=[35.7,35.7,35.8,36.1,36.3,36.7,37.1,37.5,38];
function solFig(swap){ const px=t=>40+t*3,py=g=>200-g; let b="";
  for(let g=0;g<=180;g+=20) b+=L(40,py(g),280,py(g),"g")+T(34,py(g)+4,String(g),"xs","end"); for(let t=0;t<=80;t+=20) b+=L(px(t),20,px(t),200,"g")+T(px(t),214,String(t),"xs");
  const pl=a=>a.map((g,i)=>`${px(i*10)},${py(g)}`).join(" ");
  b+=`<polyline points="${pl(KNO3)}" class="ln"/><polyline points="${pl(NACL)}" class="ln2"/>`+T(226,52,swap?"B":"A")+T(262,154,swap?"A":"B")+L(40,20,40,200,"ax")+L(40,200,280,200,"ax")+T(160,230,X("水の温度（℃）|Water temperature (°C)|水温（℃）"),"xs")+T(44,14,X("100 g の水にとける质量（g）|Mass dissolving in 100 g water (g)|100 g 水能溶解的质量（g）"),"xs","start");
  return SV(300,236,b); }
function solCurve(){ const swap=Math.random()<.5; const fig=solFig(swap); const K=swap?"B":"A",N=swap?"A":"B"; const askK=Math.random()<.5;
  const ans=askK?K:N, oth=askK?N:K;
  return {q:X(askK?"図は硝酸カリウムと塩化ナトリウムの溶解度曲线。水溶液を冷やして结晶を多く取り出しやすいのは？|Solubility curves of potassium nitrate and sodium chloride. Which gives more crystals by cooling?|图是硝酸钾和氯化钠的溶解度曲线。冷却溶液时较容易析出大量晶体的是？":"図は硝酸カリウムと塩化ナトリウムの溶解度曲线。温度による溶解度の変化が小さいのは？|Solubility curves of potassium nitrate and sodium chloride. Which changes little with temperature?|图是硝酸钾和氯化钠的溶解度曲线。溶解度随温度变化小的是？")+fig,ans,
    wrongs:[{v:oth,why:X(askK?`${oth} は温度が変わってもとける量がほとんど変わらないので、冷やしても结晶はあまり出ません。|${oth} hardly changes with temperature, so cooling gives few crystals.|${oth} 溶解量几乎不随温度改变，冷却也不太会析出晶体。`:`${oth} は温度が上がるととける量が大きくふえます。|${oth} rises a lot with temperature.|${oth} 温度升高时溶解量大增。`)},
      {v:X("どちらも同じ|Both the same|两者相同"),why:X("2本のグラフの形はちがいます。|The two curves are different.|两条曲线形状不同。")},{v:X("グラフからは分からない|Can't tell from the graph|从图无法判断"),why:X("グラフのかたむきで、温度による変化が分かります。|The slope shows the change with temperature.|看曲线的斜率就知道随温度的变化。")}],
    exp:X(`${K}：硝酸カリウム（温度で大きく変わる → 冷やすと结晶が出る）、${N}：塩化ナトリウム（ほぼ変わらない → 水を蒸発させて取り出す）。|${K}: potassium nitrate (changes a lot → cooling works). ${N}: sodium chloride (barely changes → evaporate the water).|${K}：硝酸钾（随温度大变 → 冷却可析出），${N}：氯化钠（几乎不变 → 蒸发水分取出）。`),tf:v=>X("あてはまるのは|The answer is|答案是")+fig+`→ ${v}`,kind:"fig"}; }
const KN={0:13,20:32,40:64,60:109,80:169};
function recryst(){ const ts=[0,20,40,60,80]; let i=R(1,4),j=R(0,i-1); const t1=ts[i],t2=ts[j],s1=KN[t1],s2=KN[t2]; const w=pick([100,100,200,50]); const ans=(s1-s2)*w/100;
  return C(X(`100 g の水にとける硝酸カリウムは ${t1}℃で ${s1} g、${t2}℃で ${s2} g。${t1}℃の水 ${w} g に硝酸カリウムをとけるだけとかし、${t2}℃まで冷やすと、出てくる结晶は何 g？|100 g of water dissolves ${s1} g of potassium nitrate at ${t1}°C and ${s2} g at ${t2}°C. A saturated solution in ${w} g of water at ${t1}°C is cooled to ${t2}°C. How many grams of crystals form?|100 g 水在 ${t1}℃可溶解 ${s1} g 硝酸钾，在 ${t2}℃可溶解 ${s2} g。在 ${t1}℃的 ${w} g 水中溶解到饱和，冷却到 ${t2}℃，析出多少 g 晶体？`),ans," g",
    [[s1-s2,X("水が 100 g ではないので、水の量に合わせて计算します。|The water isn't 100 g; scale by the water amount.|水不是 100 g，要依水量换算。")],[s1*w/100,X(`${t2}℃でもとけたままの分があります。ひき算します。|Some stays dissolved at ${t2}°C; subtract it.|在 ${t2}℃仍有一部分溶着，要减掉。`)],[s2*w/100,X(`それは ${t2}℃でとけている量です。|That is what stays dissolved at ${t2}°C.|那是在 ${t2}℃仍溶解的量。`)],[(s1+s2)*w/100,X("たし算ではなく、ひき算です。|Subtract, don't add.|要相减，不是相加。")]],
    X(`(${s1} − ${s2}) × ${w}/100 ＝ ${fm(ans)} g（とけきれなくなった分が结晶になる＝再结晶）|(${s1} − ${s2}) × ${w}/100 = ${fm(ans)} g (what can no longer dissolve crystallizes)|(${s1} − ${s2}) × ${w}/100 ＝ ${fm(ans)} g（溶不下的部分析出成晶体＝再结晶）`)); }
const mat4=[conc,conc,concMass,solCurve,solCurve,recryst,recryst,
  Q("砂糖水で、砂糖のようにとけている物质を何という？|In sugar water, what is the dissolved sugar called?|糖水中，像糖那样被溶解的物质叫做？","溶质|Solute|溶质",
    [["溶媒|Solvent|溶剂","溶媒は物质をとかしている液体（ここでは水）です。|The solvent is the liquid that dissolves it (water).|溶剂是溶解物质的液体（这里是水）。"],["溶液|Solution|溶液","溶液は溶质が溶媒にとけた液全体です。|The solution is the whole liquid.|溶液是溶质溶在溶剂中的整体液体。"],["结晶|Crystal|晶体","结晶は规则正しい形をした固体です。|Crystals are regularly shaped solids.|晶体是形状规则的固体。"]],
    "溶质（とけている物质）＋溶媒（とかす液体）＝溶液。水が溶媒なら水溶液。|Solute + solvent = solution. With water as solvent: aqueous solution.|溶质（被溶解）＋溶剂（溶解它的液体）＝溶液；溶剂是水就叫水溶液。"),
  Q("水溶液の性质で正しいのは？|Which is true of a solution?|关于水溶液，正确的是？","透明で、浓さはどこも同じ|It is clear and evenly concentrated|透明，各处浓度相同",
    [["时间がたつと、とけた物质が底にたまる|The solute settles over time|时间久了溶质会沉到底部","とけた物质は时间がたっても沈みません。|A dissolved substance never settles out.|溶解的物质放久也不会沉淀。"],["色がついたものは水溶液ではない|Colored liquids aren't solutions|有颜色的就不是水溶液","色がついていても透明なら水溶液です（硫酸铜水溶液など）。|Colored but clear is still a solution (e.g. copper sulfate).|有颜色但透明就是水溶液（例如硫酸铜水溶液）。"],["下のほうが浓い|It is denser at the bottom|下面比较浓","粒子は全体に均一に広がっています。|The particles spread evenly.|粒子均匀地分布在整个溶液中。"]],
    "水溶液：透明（色はあってもよい）・均一・时间がたっても変わらない。|Solution: clear (may be colored), uniform, stable over time.|水溶液：透明（可以有颜色）、均匀、放久也不变。"),
  Q("塩化ナトリウムの结晶を水溶液から取り出すのに向いている方法は？|How do you best get sodium chloride crystals from its solution?|从水溶液中取出氯化钠晶体，适合的方法是？","水を蒸発させる|Evaporate the water|让水蒸发",
    [["冷やす|Cool it|冷却","塩化ナトリウムは温度でとける量がほとんど変わらないので、冷やしてもあまり出ません。|Its solubility barely changes, so cooling gives little.|氯化钠的溶解量几乎不随温度改变，冷却析出很少。"],["ろ过する|Filter it|过滤","とけている物质はろ纸を通りぬけます。|Dissolved particles pass through filter paper.|溶解的物质会穿过滤纸。"],["かき混ぜる|Stir it|搅拌","かき混ぜても结晶は出てきません。|Stirring doesn't make crystals.|搅拌不会析出晶体。"]],
    "温度で溶解度が変わりにくい物质は、水を蒸発させて取り出す。|If solubility barely changes with temperature, evaporate the water.|溶解度不易随温度改变的物质，用蒸发水分的方法取出。"),
  Q("ろ过のしかたで正しいのは？|Which is correct filtering?|过滤的正确方法是？","液はガラス棒を伝わらせて注ぎ、ろうとのあしはビーカーのかべにつける|Pour along a glass rod; the funnel tip touches the beaker wall|沿玻璃棒倒入液体，漏斗尖端紧贴烧杯内壁",
    [["液を直接ろ纸のまん中に势いよく注ぐ|Pour straight onto the middle of the paper|直接用力倒在滤纸中央","ろ纸が破れたり、液がはねたりします。ガラス棒を伝わらせます。|It can tear the paper or splash. Use a glass rod.|滤纸可能破掉或液体溅出，要沿玻璃棒倒。"],["ろうとのあしをビーカーのまん中に向ける|Point the tip at the middle of the beaker|漏斗尖端朝向烧杯中央","液がはねないよう、とがったほうをかべにつけます。|Touch the wall with the pointed side so it doesn't splash.|尖的那一侧要贴着杯壁，以免液体溅出。"],["ろ纸を水でぬらさずに使う|Use the filter paper dry|滤纸不沾湿就使用","ろ纸は水でぬらしてろうとに密着させます。|Wet the paper so it sticks to the funnel.|要把滤纸沾湿，让它紧贴漏斗。"]],
    "ろ过：ガラス棒を伝わらせて注ぐ、ろうとのあしのとがったほうをビーカーのかべにつける。|Filtering: pour along a glass rod; the funnel's pointed tip touches the beaker wall.|过滤：沿玻璃棒倒入；漏斗尖端较长的一侧贴着烧杯内壁。"),
];

// 状态変化：水を加热したときの温度のグラフ
const FIG_HEAT=(()=>{ const px=t=>40+t*15,py=c=>170-(c+20)*1.2; let b=L(40,20,40,182,"ax")+L(40,182,290,182,"ax");
  b+=L(40,py(0),290,py(0),"dl")+L(40,py(100),290,py(100),"dl")+T(34,py(0)+4,"0","xs","end")+T(34,py(100)+4,"100","xs","end");
  b+=`<polyline points="${px(0)},${py(-20)} ${px(2)},${py(0)} ${px(5)},${py(0)} ${px(9)},${py(100)} ${px(14)},${py(100)} ${px(15.5)},${py(118)}" class="ln"/>`;
  b+=T(px(3.5),py(0)-8,"A")+T(px(11.5),py(100)-8,"B")+T(165,198,X("加热した时间|Heating time|加热时间"),"xs")+T(44,14,X("温度（℃）|Temperature (°C)|温度（℃）"),"xs","start");
  return SV(300,204,b); })();
function pureFig(swap){ const px=t=>40+t*24,py=c=>170-c*1.5; let b=L(40,20,40,182,"ax")+L(40,182,290,182,"ax");
  const A=`${px(0)},${py(20)} ${px(3)},${py(78)} ${px(7)},${py(78)} ${px(9.5)},${py(95)}`, B=`${px(0)},${py(20)} ${px(2.6)},${py(74)} ${px(5)},${py(84)} ${px(7.5)},${py(92)} ${px(9.5)},${py(98)}`;
  b+=`<polyline points="${swap?B:A}" class="ln"/><polyline points="${swap?A:B}" class="ln2"/>`+T(px(5.2),py(swap?84:78)-10,"A")+T(px(6.2),py(swap?78:88)+18,"B");
  b+=T(165,198,X("加热した时间|Heating time|加热时间"),"xs")+T(44,14,X("温度（℃）|Temperature (°C)|温度（℃）"),"xs","start"); return SV(300,204,b); }
function pureMix(){ const swap=Math.random()<.5; const fig=pureFig(swap); const pure=swap?"B":"A",mix=swap?"A":"B";
  return {q:X("図は2つの液体を加热したときの温度の変化。纯物质（1种类の物质）のグラフは？|Temperature while heating two liquids. Which is a pure substance?|图是加热两种液体时温度的变化。纯物质（只有一种物质）的是？")+fig,ans:pure,
    wrongs:[{v:mix,why:X(`${mix} は沸とう中も温度が上がり続けています。混合物です。|${mix} keeps rising while boiling: a mixture.|${mix} 沸腾时温度仍持续上升，是混合物。`)},{v:X("どちらも|Both|两者都是"),why:X("温度が一定になるのは片方だけです。|Only one stays flat.|只有一个温度保持不变。")},{v:X("どちらでもない|Neither|两者都不是"),why:X("沸点で温度が一定になるのが纯物质です。|A pure substance stays flat at its boiling point.|在沸点温度保持不变的就是纯物质。")}],
    exp:X(`纯物质は沸点で温度が一定になる（${pure}）。混合物は一定にならない（${mix}）。|A pure substance stays at its boiling point (${pure}); a mixture doesn't (${mix}).|纯物质在沸点温度保持不变（${pure}），混合物不会（${mix}）。`),tf:v=>X("纯物质のグラフは|The pure substance is|纯物质的是")+fig+`→ ${v}`,kind:"fig"}; }
const MPBP=[["酸素|Oxygen|氧气",-218,-183],["エタノール|Ethanol|乙醇",-115,78],["水|Water|水",0,100],["水银|Mercury|水银",-39,357],["パルミチン酸|Palmitic acid|棕榈酸",63,351],["鉄|Iron|铁",1538,2862],["塩化ナトリウム|Sodium chloride|氯化钠",801,1413],["窒素|Nitrogen|氮气",-210,-196]];
const stOf=([,mp,bp],t)=>t<mp?0:t<bp?1:2;
const STN=["固体|solid|固体","液体|liquid|液体","気体|gas|气体"];
function mpbp(){ for(let k=0;k<30;k++){ const t=pick([-100,20,50,90,120,1000]); const s=R(0,2); const yes=MPBP.filter(x=>stOf(x,t)===s),no=MPBP.filter(x=>stOf(x,t)!==s); if(!yes.length||no.length<3) continue;
    const a=pick(yes),ws=shuf(no).slice(0,3); const four=shuf([a,...ws]); let rows=T(150,16,X("融点|m.p.|熔点"),"xs","end")+T(206,16,X("沸点|b.p.|沸点"),"xs","end");
    four.forEach(([n,mp,bp],i)=>{ rows+=T(6,38+i*22,X(n),"sm","start")+T(150,38+i*22,mp+"℃","sm","end")+T(206,38+i*22,bp+"℃","sm","end"); });
    const fig=SV(216,124,rows); const st=X(STN[s]);
    return {q:X(`${t}℃で${st}なのはどれ？|Which is a ${st} at ${t}°C?|在 ${t}℃时是${st}的是？`)+fig,ans:X(a[0]),
      wrongs:ws.map(x=>{ const s2=stOf(x,t); return {v:X(x[0]),why:X(`${X(x[0])}は${t}℃では${X(STN[s2])}です（融点 ${x[1]}℃・沸点 ${x[2]}℃）。|${X(x[0])} is a ${X(STN[s2])} at ${t}°C (m.p. ${x[1]}, b.p. ${x[2]}).|${X(x[0])}在 ${t}℃是${X(STN[s2])}（熔点 ${x[1]}℃、沸点 ${x[2]}℃）。`)}; }),
      exp:X("融点より低い→固体、融点と沸点の间→液体、沸点より高い→気体。|Below m.p. → solid; between → liquid; above b.p. → gas.|低于熔点→固体，在熔点和沸点之间→液体，高于沸点→气体。"),tf:v=>X(`${t}℃で${st}なのは|At ${t}°C, the ${st} is|在 ${t}℃是${st}的是`)+fig+`→ ${v}`,kind:"fig"}; } }
const mat5=[pureMix,pureMix,mpbp,mpbp,mpbp,
  Q("図の B の温度を何という？|What is temperature B called?|图中 B 的温度叫做？","沸点|Boiling point|沸点",
    [["融点|Melting point|熔点","融点は固体がとけて液体になる温度（A）です。|The melting point is A, where solid turns liquid.|熔点是固体熔化成液体的温度（A）。"],["密度|Density|密度","密度は1 cm³ あたりの质量です。|Density is mass per cm³.|密度是每 cm³ 的质量。"],["溶解度|Solubility|溶解度","溶解度は水100 gにとける限度の量です。|Solubility is the max amount in 100 g of water.|溶解度是100 g水能溶解的最大量。"]],
    "A＝融点（0℃）、B＝沸点（100℃）。状态が変わっている间は温度が一定。|A = melting point (0°C), B = boiling point (100°C). Temperature stays flat during the change.|A＝熔点（0℃），B＝沸点（100℃）。状态改变期间温度不变。",FIG_HEAT),
  Q("図の A や B の间、加热しているのに温度が上がらないのはなぜ？|Why doesn't the temperature rise during A and B?|在图中 A、B 期间，为什么加热温度也不上升？","加えた热が状态変化に使われるから|The heat is used to change state|加入的热用在状态变化上",
    [["火が弱くなるから|The flame gets weaker|火变小了","火の强さは同じです。|The flame is the same.|火的大小相同。"],["水がなくなるから|The water is gone|水没有了","水はまだあります。状态が変わっているところです。|Water is still there; it is changing state.|水还在，正在改变状态。"],["温度计がこわれるから|The thermometer breaks|温度计坏了","温度计は正しく测っています。|The thermometer works fine.|温度计量得正确。"]],
    "とける・沸とうする间は、热が状态変化に使われ温度は一定。|While melting or boiling, heat goes into the change; temperature stays flat.|熔化、沸腾期间，热用于状态变化，温度保持不变。",FIG_HEAT),
  Q("液体のロウが冷えて固体になると、体积と质量はどうなる？|When liquid wax becomes solid, what happens to volume and mass?|液态蜡冷却变成固体时，体积和质量会怎样？","体积は小さくなり、质量は変わらない|Volume decreases; mass stays the same|体积变小，质量不变",
    [["体积も质量も小さくなる|Both decrease|体积和质量都变小","状态が変わっても粒子の数は同じなので、质量は変わりません。|The number of particles is the same, so mass doesn't change.|状态改变时粒子数相同，质量不变。"],["体积は大きくなり、质量は変わらない|Volume increases; mass the same|体积变大，质量不变","固体になると体积が大きくなるのは水の场合です（例外）。|Getting bigger when solid is water's exception.|变成固体体积变大是水的例外。"],["体积は変わらず、质量が大きくなる|Volume same; mass increases|体积不变，质量变大","质量は変わりません。|Mass doesn't change.|质量不会改变。"]],
    "多くの物质は液体→固体で体积が小さくなる（水は例外で大きくなる）。质量はいつも変わらない。|Most substances shrink when they solidify (water expands). Mass never changes.|大多数物质由液体变固体时体积变小（水是例外会变大），质量始终不变。"),
  Q("気体の粒子のようすで正しいのは？|Which describes particles in a gas?|关于气体粒子的样子，正确的是？","粒子の间が広く、自由に飞び回っている|Far apart, moving freely|粒子间距大，自由地飞来飞去",
    [["粒子が规则正しく并んでいる|Neatly lined up|粒子规则地排列","それは固体のようすです。|That is a solid.|那是固体的样子。"],["粒子がくっついたまま动き回る|Touching and moving around|粒子靠在一起到处移动","それは液体のようすです。|That is a liquid.|那是液体的样子。"],["粒子の数がふえている|There are more particles|粒子的数目增加了","状态が変わっても粒子の数は変わりません。|The number never changes.|状态改变时粒子数不变。"]],
    "固体：规则正しく并ぶ。液体：くっついたまま动く。気体：间が広く飞び回る。|Solid: ordered. Liquid: close, moving. Gas: far apart, flying.|固体：规则排列。液体：靠近但能移动。气体：间距大、到处飞。"),
  Q("水とエタノールの混合物を加热したとき、はじめに出てくる液体に多くふくまれるのは？|Heating a water-ethanol mixture, what is the first liquid mostly?|加热水和乙醇的混合物，最先收集到的液体中含量较多的是？","エタノール|Ethanol|乙醇",
    [["水|Water|水","水の沸点は100℃、エタノールは78℃。沸点の低いほうが先に出ます。|Water boils at 100°C, ethanol at 78°C; the lower one comes first.|水的沸点100℃，乙醇78℃，沸点低的先出来。"],["どちらも同じ量|Equal amounts|两者一样多","沸点のちがいで、出てくる割合が変わります。|Different boiling points change the ratio.|沸点不同，收集到的比例也不同。"],["何も出てこない|Nothing comes out|什么都出不来","加热すると気体になって出てきます。|Heating turns it into gas that comes out.|加热后会变成气体出来。"]],
    "蒸留：沸点のちがいを利用して、混合物から物质を分ける。|Distillation separates substances by boiling point.|蒸馏：利用沸点不同把混合物中的物质分离。"),
  Q("液体を加热するとき、沸とう石を入れる理由は？|Why add boiling chips when heating a liquid?|加热液体时放入沸石的原因是？","急に沸とうする（とつ沸）のを防ぐため|To prevent sudden violent boiling|防止突然剧烈沸腾（突沸）",
    [["早く沸とうさせるため|To boil faster|让它更快沸腾","沸点は変わりません。おだやかに沸とうさせるためです。|The boiling point doesn't change; it keeps boiling gentle.|沸点不变，是为了让沸腾平稳。"],["液体の色を変えるため|To change the color|改变液体的颜色","色は変わりません。|The color doesn't change.|颜色不会变。"],["温度を测るため|To measure temperature|为了测量温度","温度は温度计で测ります。|A thermometer measures temperature.|温度是用温度计测量。"]],
    "沸とう石：急な沸とう（とつ沸）を防ぐ。|Boiling chips prevent sudden boiling (bumping).|沸石：防止突沸。"),
];
/* ========== ③ 身近な物理现象（第1分野(1)） ========== */
const rad=d=>d*Math.PI/180, P2=(x,y)=>`${x.toFixed(1)},${y.toFixed(1)}`;
// 光の反射：镜の面との角を见せて反射角を闻く（入射角は法线から测る）
function reflAng(){ const surf=Math.random()<.6; const th=pick(surf?[20,25,30,35,40,50,55,60,65,70]:[20,25,30,35,40,45,50,55,60]); const P=[150,150];
  let b=L(20,150,280,150,"o")+[...Array(13)].map((_,i)=>L(30+i*20,150,22+i*20,160,"k")).join("")+L(150,150,150,30,"dl")+T(160,40,X("法线|normal|法线"),"xs","start");
  let S,arc,lab;
  if(surf){ S=[P[0]-125*Math.cos(rad(th)),P[1]-125*Math.sin(rad(th))]; arc=`<path d="M120 150 A30 30 0 0 1 ${P2(150-30*Math.cos(rad(th)),150-30*Math.sin(rad(th)))}" class="k"/>`; lab=[150-46*Math.cos(rad(th/2)),150-46*Math.sin(rad(th/2))+4]; }
  else { S=[P[0]-125*Math.sin(rad(th)),P[1]-125*Math.cos(rad(th))]; arc=`<path d="M150 120 A30 30 0 0 0 ${P2(150-30*Math.sin(rad(th)),150-30*Math.cos(rad(th)))}" class="k"/>`; lab=[150-46*Math.sin(rad(th/2)),150-46*Math.cos(rad(th/2))+4]; }
  b+=AR(S[0],S[1],150,150)+arc+T(lab[0],lab[1],th+"°","sm")+T(250,145,X("镜|mirror|镜子"),"xs");
  const fig=SV(300,170,b); const ans=surf?90-th:th;
  const ws=surf?[[th,"镜の面との角です。入射角・反射角は法线から测ります。|That is the angle with the mirror. Measure from the normal.|那是和镜面的夹角。入射角、反射角要从法线量起。"],[180-2*th,"それは入射光と反射光の间の角です。|That is the angle between the two rays.|那是入射光和反射光之间的夹角。"],[90+th,"90° からひきます。|Subtract from 90°.|要用 90° 去减。"],[90-th+10,"入射角を法线から正しく测ろう。|Measure the incidence angle from the normal.|要从法线正确量出入射角。"]]
    :[[90-th,"入射角は法线との角なので、そのまま反射角と等しくなります。|The incidence angle is already from the normal; the reflection angle equals it.|入射角是和法线的夹角，反射角和它相等。"],[2*th,"それは入射光と反射光の间の角です。|That is the angle between the two rays.|那是入射光和反射光之间的夹角。"],[180-th,"反射角は入射角と等しくなります。|Reflection angle = incidence angle.|反射角等于入射角。"],[th+10,"反射角は入射角と等しくなります。|Reflection angle = incidence angle.|反射角等于入射角。"]];
  return {q:X("図のように光が镜に当たった。反射角は何度？|Light hits a mirror as shown. What is the angle of reflection?|光如图射到镜子上，反射角是几度？")+fig,ans:ans+"°",
    wrongs:UQ(ans+"°",ws.filter(([v])=>v>0).map(([v,why])=>({v:v+"°",why:X(why)}))).slice(0,3),
    exp:X(surf?`入射角 ＝ 90° − ${th}° ＝ ${ans}°。反射角 ＝ 入射角 ＝ ${ans}°|Incidence = 90° − ${th}° = ${ans}°. Reflection = incidence = ${ans}°|入射角 ＝ 90° − ${th}° ＝ ${ans}°。反射角 ＝ 入射角 ＝ ${ans}°`:`反射の法则：反射角 ＝ 入射角 ＝ ${ans}°|Law of reflection: reflection = incidence = ${ans}°|反射定律：反射角 ＝ 入射角 ＝ ${ans}°`),tf:v=>X("反射角は|The angle of reflection is|反射角是")+fig+`→ ${v}`,kind:"fig"}; }
// 光の屈折：进む向き A〜C（法线に近づく・まっすぐ・法线から离れる）
function refrDir(){ const down=Math.random()<.5; const i=down?45:40; const ang=down?{n:28,s:45,f:62}:{n:25,s:40,f:60}; const L3=shuf(["n","s","f"]); const nm={}; L3.forEach((k,j)=>nm[k]=LET[j]);
  const P=[150,100]; let b=`<rect x="10" y="100" width="280" height="90" class="wa"/>`+L(10,100,290,100,"o")+L(150,20,150,180,"dl")+T(24,90,X("空気|air|空气"),"xs","start")+T(24,180,X("水|water|水"),"xs","start");
  const S=down?[P[0]-90*Math.sin(rad(i)),P[1]-90*Math.cos(rad(i))]:[P[0]-90*Math.sin(rad(i)),P[1]+90*Math.cos(rad(i))]; b+=AR(S[0],S[1],P[0],P[1]);
  for(const k of ["n","s","f"]){ const a=ang[k]; const E=down?[P[0]+80*Math.sin(rad(a)),P[1]+80*Math.cos(rad(a))]:[P[0]+80*Math.sin(rad(a)),P[1]-80*Math.cos(rad(a))]; b+=L(P[0],P[1],E[0],E[1],"ln2")+T(E[0]+(E[0]>P[0]?10:-10),E[1]+(down?12:-4),nm[k]); }
  const fig=SV(300,192,b); const good=down?"n":"f";
  const why={n:"法线に近づく向きです。|This bends toward the normal.|这是靠近法线的方向。",s:"境界面で光は折れ曲がります（屈折）。|Light bends at the boundary (refraction).|光在界面会偏折（折射）。",f:"法线から离れる向きです。|This bends away from the normal.|这是远离法线的方向。"};
  const ws=["n","s","f"].filter(k=>k!==good).map(k=>({v:nm[k],why:X(why[k])+" "+X(down?"空気→水では、屈折角は入射角より小さくなります。|From air to water, the refraction angle is smaller.|从空气到水，折射角比入射角小。":"水→空気では、屈折角は入射角より大きくなります。|From water to air, the refraction angle is larger.|从水到空气，折射角比入射角大。")}));
  ws.push({v:X("どれでもない|None|都不是"),why:X("どれかの线が正しい向きです。|One of the lines is right.|其中有一条线是正确的方向。")});
  return {q:X(down?"光が空気中から水中へ进む。光はどの向きに进む？|Light goes from air into water. Which way does it go?|光从空气射入水中，光会往哪个方向前进？":"光が水中から空気中へ进む。光はどの向きに进む？|Light goes from water into air. Which way does it go?|光从水中射入空气，光会往哪个方向前进？")+fig,ans:nm[good],wrongs:ws,
    exp:X(down?"空気→水（ガラス）：法线に近づくように曲がる（屈折角 < 入射角）。|Air → water/glass: bends toward the normal (refraction < incidence).|空气→水（玻璃）：偏向法线（折射角 < 入射角）。":"水（ガラス）→空気：法线から离れるように曲がる（屈折角 > 入射角）。入射角が大きいと全反射する。|Water/glass → air: bends away from the normal (refraction > incidence). At large angles: total internal reflection.|水（玻璃）→空气：偏离法线（折射角 > 入射角）；入射角太大时会全反射。"),tf:v=>X("光が进むのは|The light goes along|光前进的方向是")+fig+`→ ${v}`,kind:"fig"}; }
const phys1=[reflAng,reflAng,reflAng,refrDir,refrDir,
  Q("光が镜で反射するとき、入射角と反射角の関系は？|When light reflects off a mirror, how do the angles compare?|光在镜子反射时，入射角和反射角的关系是？","入射角 ＝ 反射角|Incidence = reflection|入射角 ＝ 反射角",
    [["入射角 ＞ 反射角|Incidence > reflection|入射角 ＞ 反射角","反射では2つの角はいつも等しくなります。|In reflection they are always equal.|反射时两个角永远相等。"],["入射角 ＜ 反射角|Incidence < reflection|入射角 ＜ 反射角","反射では2つの角はいつも等しくなります。|In reflection they are always equal.|反射时两个角永远相等。"],["入射角 ＋ 反射角 ＝ 90°|They add to 90°|入射角 ＋ 反射角 ＝ 90°","90°になるのは、入射角とそのときの镜の面との角です。|What adds to 90° is incidence + angle with the mirror.|和为 90° 的是入射角和镜面夹角。"]],
    "反射の法则：入射角 ＝ 反射角（どちらも法线から测る）。|Law of reflection: incidence = reflection (both from the normal).|反射定律：入射角 ＝ 反射角（都从法线量起）。"),
  Q("ものが见えるのは、ものの表面で光がどうなるから？|We see objects because light at their surface…|我们看得到物体，是因为光在物体表面…？","いろいろな向きに反射する（乱反射）|Reflects in all directions (diffuse reflection)|向各方向反射（漫反射）",
    [["すべて吸収される|Is all absorbed|全部被吸收","すべて吸収されると、目に光が届かず见えません。|If all were absorbed, no light reaches our eyes.|全部吸收的话光到不了眼睛，就看不见。"],["まっすぐ通りぬける|Passes straight through|直接穿透","通りぬけるだけでは、ものの表面は见えません。|Passing through doesn't show the surface.|只穿透看不见物体表面。"],["すべて屈折する|All refracts|全部折射","屈折は物质の境界で光が曲がることです。|Refraction is bending at a boundary.|折射是光在物质界面偏折。"]],
    "表面のでこぼこで光がいろいろな向きに反射（乱反射）し、目に届くので见える。|Rough surfaces scatter light (diffuse reflection) into our eyes.|表面凹凸使光向各方向反射（漫反射），到达眼睛所以看得见。"),
  Q("水の入ったコップの底のコインが浮き上がって见えるのは、光の何のため？|A coin in a cup of water looks raised. Why?|装水杯底的硬币看起来浮起来，是因为光的什么现象？","屈折|Refraction|折射",
    [["反射|Reflection|反射","反射ははね返ることです。水面で曲がるのは屈折です。|Reflection bounces; bending at the surface is refraction.|反射是弹回，在水面偏折是折射。"],["全反射|Total internal reflection|全反射","全反射は光がすべてはね返る现象です。|Total reflection means all light bounces back.|全反射是光全部被反射。"],["直进|Traveling straight|直进","光がまっすぐ进むなら、浮き上がって见えません。|Straight light wouldn't make it look raised.|光如果直进，就不会看起来浮起。"]],
    "水から空気へ出るとき光が屈折するため、実际より浅く（浮いて）见える。|Light refracts leaving the water, so it looks shallower.|光从水进入空气时折射，所以看起来比实际浅。"),
  Q("光ファイバーで光が外にもれずに进むのは、何を利用している？|Optical fibers keep light inside by using…|光纤让光不外漏地前进，是利用了什么？","全反射|Total internal reflection|全反射",
    [["乱反射|Diffuse reflection|漫反射","乱反射は光がいろいろな向きに散ることです。|Diffuse reflection scatters light.|漫反射是光向各方向散开。"],["光の直进|Light traveling straight|光的直进","ファイバーが曲がっていても光が进むのは全反射のおかげです。|Light follows bends thanks to total reflection.|光纤弯曲光也能前进，是靠全反射。"],["屈折|Refraction|折射","屈折して外に出ると光がもれてしまいます。|Refracting out would leak the light.|折射出去光就漏掉了。"]],
    "水やガラスから空気へ进む光は、入射角が大きいとすべて反射する（全反射）。|From glass to air at large angles, all light reflects (total internal reflection).|光从玻璃射向空气时，入射角大就会全部反射（全反射）。"),
  Q("白色光をプリズムに通すとどうなる？|What happens when white light passes through a prism?|白光通过三棱镜会怎样？","いろいろな色の光に分かれる|It splits into many colors|分成各种颜色的光",
    [["すべて黒くなる|It turns black|全部变黑","光は消えません。色ごとに分かれます。|Light doesn't vanish; it splits by color.|光不会消失，而是依颜色分开。"],["まっすぐ通りぬけるだけ|It just goes straight|只是直接穿过","光はプリズムで屈折します。|Light refracts in a prism.|光在三棱镜中会折射。"],["すべて反射してもどる|It all reflects back|全部反射回来","多くの光はプリズムを通りぬけます。|Most light passes through.|大部分的光会穿过三棱镜。"]],
    "白色光はいろいろな色の光が混ざったもの。色によって屈折のしかたがちがうので分かれる。|White light is a mix of colors; each bends differently.|白光由各色光混合，各色折射程度不同所以分开。"),
];

// 凸レンズ：物体の位置と像
const LENS_C=[["far","焦点距离の2倍より远い|beyond 2F|比2倍焦距远"],["2f","焦点距离の2倍の位置|at 2F|在2倍焦距处"],["mid","焦点と焦点距离の2倍の间|between F and 2F|在焦点和2倍焦距之间"],["in","焦点より内侧|inside F|在焦点内侧"]];
const IMG={far:"実物より小さい倒立の実像|Smaller, upside-down real image|比实物小的倒立实像","2f":"実物と同じ大きさの倒立の実像|Same-size, upside-down real image|和实物一样大的倒立实像",mid:"実物より大きい倒立の実像|Larger, upside-down real image|比实物大的倒立实像",in:"スクリーンにはうつらない（レンズを通すと正立の虚像が见える）|No image on the screen (a virtual image is seen through the lens)|屏幕上没有像（通过透镜可看到正立虚像）"};
const IMG_W={far:"焦点距离の2倍より远いと、像は小さくなります。|Beyond 2F the image is smaller.|比2倍焦距远时，像会变小。","2f":"ちょうど2倍の位置なら、同じ大きさになります。|Exactly at 2F gives the same size.|刚好在2倍焦距时，大小相同。",mid:"焦点と2倍の间なら、大きな実像になります。|Between F and 2F gives a larger real image.|在焦点与2倍焦距之间时，会成放大的实像。",in:"焦点より内侧だと実像はできず、虚像が见えます。|Inside F: no real image, only a virtual one.|在焦点内侧不成实像，只看得到虚像。"};
function lensFig(c){ const x={far:40,"2f":100,mid:126,in:174}[c]; let b=L(10,110,390,110,"k")+`<ellipse cx="200" cy="110" rx="9" ry="72" class="ac"/>`;
  for(const [px,s] of [[100,"2F"],[150,"F"],[250,"F"],[300,"2F"]]) b+=`<circle cx="${px}" cy="110" r="3" class="kf"/>`+T(px,130,s,"xs");
  b+=AR(x,110,x,70,"ar")+T(x,62,X("物体|object|物体"),"xs")+T(200,198,X("凸レンズ|convex lens|凸透镜"),"xs"); return SV(400,204,b); }
function lensImg(){ const [c,pos]=pick(LENS_C); const fig=lensFig(c);
  const ws=LENS_C.filter(([k])=>k!==c).map(([k])=>({v:X(IMG[k]),why:X(IMG_W[c])}));
  return {q:X(`凸レンズの${X(pos)}に物体を置いた。スクリーンにできる像は？|An object is ${X(pos)} of a convex lens. What image forms on a screen?|物体放在凸透镜的${X(pos)}。屏幕上会形成什么像？`)+fig,ans:X(IMG[c]),wrongs:ws,
    exp:X("2倍より远い→小さい実像、2倍→同じ大きさ、焦点と2倍の间→大きい実像（すべて倒立）、焦点の内侧→虚像（正立・大きい）。|Beyond 2F → smaller; at 2F → same; F–2F → larger (all inverted real); inside F → virtual (upright, larger).|2倍焦距外→缩小实像，2倍处→等大，焦点与2倍间→放大实像（都倒立），焦点内→虚像（正立、放大）。"),tf:v=>X(`凸レンズの${X(pos)}に物体を置くと|An object ${X(pos)} gives|物体放在${X(pos)}时`)+fig+`→ ${v}`,kind:"fig"}; }
function lensCalc(){ const f=pick([5,6,8,10,12,15,20]); const up=Math.random()<.5;
  if(up) return C(X(`焦点距离 ${f} cm の凸レンズ。実物と同じ大きさの像をスクリーンにうつすには、物体をレンズから何 cm に置く？|A convex lens has focal length ${f} cm. Where should the object be for a same-size image?|焦距 ${f} cm 的凸透镜。要在屏幕上得到和实物一样大的像，物体要放在离透镜几 cm 处？`),2*f," cm",
    [[f,X("焦点に置くと像はできません。2倍の位置です。|At F there is no image; use 2F.|放在焦点不会成像，要放在2倍焦距。")],[f/2,X("焦点の内侧では実像はできません。|Inside F there is no real image.|焦点内侧不会成实像。")],[3*f,X("同じ大きさになるのは焦点距离のちょうど2倍です。|Same size is exactly 2 × focal length.|等大的像是刚好2倍焦距。")]],
    X(`同じ大きさの実像：物体もスクリーンも焦点距离の2倍 → ${2*f} cm|Same-size real image: object and screen both at 2F → ${2*f} cm|等大实像：物体和屏幕都在2倍焦距 → ${2*f} cm`));
  return C(X(`物体を凸レンズから ${2*f} cm に置くと、反対侧 ${2*f} cm のスクリーンに実物と同じ大きさの像ができた。焦点距离は？|With the object ${2*f} cm from a lens, a same-size image forms on a screen ${2*f} cm away. Focal length?|物体放在离凸透镜 ${2*f} cm 处，另一侧 ${2*f} cm 的屏幕上出现等大的像。焦距是？`),f," cm",
    [[2*f,X("同じ大きさの像のとき、距离は焦点距离の2倍です。2でわります。|Same size means distance = 2F; divide by 2.|等大时距离是2倍焦距，要除以2。")],[4*f,X("2つの距离をたすのではありません。|Don't add the two distances.|不是把两个距离相加。")],[f/2,X("2倍の位置なので、焦点距离は距离の半分です。|At 2F, the focal length is half the distance.|在2倍焦距处，焦距是距离的一半。")]],
    X(`同じ大きさ → 2倍の位置。${2*f} ÷ 2 ＝ ${f} cm|Same size → at 2F. ${2*f} ÷ 2 = ${f} cm|等大 → 在2倍焦距。${2*f} ÷ 2 ＝ ${f} cm`)); }
const phys2=[lensImg,lensImg,lensImg,lensCalc,lensCalc,
  Q("凸レンズの「焦点」とは？|What is the focal point of a convex lens?|凸透镜的「焦点」是？","光轴に平行な光が、レンズを通ったあと集まる点|Where light parallel to the axis meets after the lens|平行主轴的光通过透镜后会聚的点",
    [["レンズのまん中の点|The center of the lens|透镜的中心点","レンズの中心を通る光はまっすぐ进みます。焦点はレンズの外です。|Light through the center goes straight; the focus is outside the lens.|通过透镜中心的光直进，焦点在透镜外。"],["像がいちばん小さくなる点|Where the image is smallest|像最小的点","焦点は平行な光が集まる点です。|It is where parallel light meets.|焦点是平行光会聚的点。"],["光がはね返る点|Where light bounces back|光反弹的点","凸レンズでは光は屈折して通りぬけます。|Light refracts through a lens.|光在凸透镜中是折射穿过。"]],
    "焦点：光轴に平行な光が集まる点。レンズの中心から焦点までが焦点距离。|Focal point: where parallel light meets. Lens center to focus = focal length.|焦点：平行光会聚的点；透镜中心到焦点的距离是焦距。"),
  Q("凸レンズの中心を通る光はどう进む？|How does light through the center of a convex lens travel?|通过凸透镜中心的光会怎么前进？","そのまままっすぐ进む|Straight on|直线前进",
    [["焦点を通る|Through the focus|通过焦点","焦点を通るのは光轴に平行に入った光です。|Light entering parallel to the axis goes through the focus.|平行主轴入射的光才会通过焦点。"],["光轴に平行になる|Parallel to the axis|变成和主轴平行","光轴に平行に出るのは焦点を通って入った光です。|Light coming through the focus exits parallel.|通过焦点入射的光才会平行射出。"],["はね返る|Bounces back|反弹回去","凸レンズは光を通します。|A convex lens lets light through.|凸透镜会让光通过。"]],
    "平行な光→焦点を通る。中心を通る光→まっすぐ。焦点を通る光→平行に出る。|Parallel → through F. Through center → straight. Through F → exits parallel.|平行光→通过焦点；通过中心→直进；通过焦点→平行射出。"),
  Q("スクリーンに実像がうつっているとき、凸レンズの上半分を纸でかくすと？|With a real image on the screen, you cover the top half of the lens. Then…|屏幕上有实像时，用纸遮住凸透镜上半部，会怎样？","像は全体がうつるが、暗くなる|The whole image stays but gets darker|像仍然完整，但变暗",
    [["像の上半分が消える|The top half disappears|像的上半部消失","レンズのどの部分を通った光も像全体をつくります。|Light through any part forms the whole image.|通过透镜任何部分的光都能形成整个像。"],["像の下半分が消える|The bottom half disappears|像的下半部消失","像は欠けません。集まる光が减るので暗くなります。|Nothing is cut off; less light makes it darker.|像不会缺，只是光变少而变暗。"],["像が消える|The image disappears|像消失","下半分を通る光でも像はできます。|Light through the bottom half still forms it.|通过下半部的光仍能成像。"]],
    "レンズの一部をかくしても像の形は変わらず、光の量が减って暗くなる。|Covering part of the lens dims the image but keeps its shape.|遮住部分透镜，像的形状不变，光变少所以变暗。"),
  Q("虫めがねで近くのものを大きく见るとき、见えている像は？|With a magnifying glass up close, the image you see is…|用放大镜看近处的东西变大时，看到的像是？","正立の虚像|An upright virtual image|正立虚像",
    [["倒立の実像|An upside-down real image|倒立实像","実像はスクリーンにうつる像です。虫めがねで见るのは虚像です。|Real images appear on a screen; this is virtual.|实像是能投在屏幕上的像，放大镜看到的是虚像。"],["倒立の虚像|An upside-down virtual image|倒立虚像","凸レンズの虚像は正立（上下そのまま）です。|A lens's virtual image is upright.|凸透镜的虚像是正立的。"],["正立の実像|An upright real image|正立实像","凸レンズの実像は倒立になります。|A lens's real image is inverted.|凸透镜的实像是倒立的。"]],
    "焦点の内侧の物体をレンズを通して见ると、正立で大きな虚像が见える。|An object inside F seen through the lens gives an upright, larger virtual image.|通过透镜看焦点内的物体，会看到正立放大的虚像。"),
];

// 音：波形（振幅と振动数）
function wave(x,y,w,amp,n){ const pts=[]; for(let i=0;i<=80;i++){ const t=i/80; pts.push(P2(x+t*w,y-amp*Math.sin(t*n*2*Math.PI))); } return `<polyline points="${pts.join(" ")}" class="ln"/>`+L(x,y,x+w,y,"g"); }
const WV={loud:[26,3],soft:[7,3],high:[14,6],low:[14,1.5]};
const WV_N={loud:"大きい音|louder|较大声",soft:"小さい音|softer|较小声",high:"高い音|higher|较高",low:"低い音|lower|较低"};
const WV_W={loud:"振幅が大きいので大きい音です（高さは同じ）。|Bigger amplitude: louder (same pitch).|振幅较大，所以是较大声（音高相同）。",soft:"振幅が小さいので小さい音です（高さは同じ）。|Smaller amplitude: softer (same pitch).|振幅较小，所以是较小声（音高相同）。",high:"振动数が多いので高い音です（大きさは同じ）。|More vibrations: higher (same loudness).|振动次数多，所以是较高的音（大小相同）。",low:"振动数が少ないので低い音です（大きさは同じ）。|Fewer vibrations: lower (same loudness).|振动次数少，所以是较低的音（大小相同）。"};
function soundWave(){ const ks=shuf(Object.keys(WV)); const ask=pick(ks); const nm={}; ks.forEach((k,i)=>nm[k]=LET[i]);
  let b=T(150,14,X("もとの音|original sound|原来的声音"),"xs")+wave(90,46,120,14,3);
  ks.forEach((k,i)=>{ const x=10+(i%2)*150,y=110+Math.floor(i/2)*72; b+=T(x+4,y-26,LET[i],"lb","start")+wave(x+18,y,120,WV[k][0],WV[k][1]); });
  const fig=SV(300,214,b);
  return {q:X(`オシロスコープで见た音の波形。もとの音より${X(WV_N[ask])}は？（横轴は时间、たて轴は振动の幅。目盛りは同じ）|Sound waveforms (horizontal: time, vertical: vibration; same scales). Which is ${X(WV_N[ask])} than the original?|用示波器看到的声音波形（横轴时间、纵轴振幅，刻度相同）。比原来的声音${X(WV_N[ask])}的是？`)+fig,ans:nm[ask],
    wrongs:ks.filter(k=>k!==ask).map(k=>({v:nm[k],why:`${nm[k]}：`+X(WV_W[k])})),
    exp:X("振幅（ゆれの幅）が大きい→大きい音。振动数（山の数）が多い→高い音。|Bigger amplitude → louder. More peaks (frequency) → higher.|振幅（摆动幅度）大→声音大；振动次数（波峰数）多→声音高。"),tf:v=>X(`もとの音より${X(WV_N[ask])}のは|The one ${X(WV_N[ask])} is|比原来${X(WV_N[ask])}的是`)+fig+`→ ${v}`,kind:"fig"}; }
function soundDist(){ const echo=Math.random()<.4; const t=echo?pick([2,3,4,5,6]):pick([2,3,4,5,6,8,10]); const d=340*t;
  if(!echo) return C(X(`いなずまが光ってから ${t} 秒后に雷の音が闻こえた。雷までの距离は何 m？（音の速さ 340 m/s）|Thunder is heard ${t} s after the lightning. How far away is it? (sound: 340 m/s)|看到闪电 ${t} 秒后听到雷声。雷离这里几 m？（音速 340 m/s）`),d," m",
    [[d/2,X("いなずまから耳までは片道です。2でわりません。|Lightning to you is one way; don't halve it.|从闪电到耳朵是单程，不用除以2。")],[340/t,X("距离 ＝ 速さ × 时间。わるのではなくかけます。|Distance = speed × time. Multiply.|距离 ＝ 速度 × 时间，要相乘。")],[340+t,X("たし算ではなく、かけ算です。|Multiply, don't add.|是乘法，不是加法。")]],
    X(`距离 ＝ 340 × ${t} ＝ ${d} m（光はほぼ一瞬で届く）|Distance = 340 × ${t} = ${d} m (light arrives almost instantly)|距离 ＝ 340 × ${t} ＝ ${d} m（光几乎瞬间到达）`));
  return C(X(`山に向かって大声を出すと、${t} 秒后に山びこが闻こえた。山までの距离は何 m？（音の速さ 340 m/s）|You shout at a mountain and hear the echo ${t} s later. How far is it? (sound: 340 m/s)|对着山大叫，${t} 秒后听到回声。山离这里几 m？（音速 340 m/s）`),d/2," m",
    [[d,X("山びこは山まで行って帰ってくる（往复）ので、2でわります。|The echo goes there and back; divide by 2.|回声是来回（往返），要除以2。")],[340/t,X("距离 ＝ 速さ × 时间 ÷ 2 です。|Distance = speed × time ÷ 2.|距离 ＝ 速度 × 时间 ÷ 2。")],[d*2,X("往复なので2でわります。かけません。|Round trip: divide by 2, not multiply.|往返要除以2，不是乘以2。")]],
    X(`往复 ${d} m なので、片道は ${d} ÷ 2 ＝ ${d/2} m|Round trip ${d} m, so one way = ${d} ÷ 2 = ${d/2} m|往返 ${d} m，所以单程 ＝ ${d} ÷ 2 ＝ ${d/2} m`)); }
function soundHz(){ const f=pick([100,200,250,400,500,1000]); const n=pick([1,2,4,5]); const s=n/f;
  return C(X(`ある音は ${fm(s,4)} 秒间に ${n} 回振动する。振动数は何 Hz？|A sound vibrates ${n} time(s) in ${fm(s,4)} s. What is its frequency in Hz?|某声音在 ${fm(s,4)} 秒内振动 ${n} 次，振动频率是几 Hz？`),f," Hz",
    [[f/n,X(`${n} 回振动しているので、1回あたりの时间ではなく回数で考えます。|It vibrates ${n} times; count all of them.|振动了 ${n} 次，要算全部的次数。`)],[f*n,X("振动数 ＝ 回数 ÷ 时间 です。|Frequency = count ÷ time.|频率 ＝ 次数 ÷ 时间。")],[f*10,X("小数の位どりを确かめよう。|Check the decimal places.|检查小数点的位数。")]],
    X(`振动数 ＝ 1秒间に振动する回数 ＝ ${n} ÷ ${fm(s,4)} ＝ ${f} Hz|Frequency = vibrations per second = ${n} ÷ ${fm(s,4)} = ${f} Hz|频率 ＝ 每秒振动次数 ＝ ${n} ÷ ${fm(s,4)} ＝ ${f} Hz`)); }
const phys3=[soundWave,soundWave,soundWave,soundDist,soundDist,soundHz,
  Q("音を出しているものは、どうなっている？|What is happening to something making a sound?|发出声音的物体正在怎样？","振动している|It is vibrating|正在振动",
    [["光を出している|It gives off light|正在发光","音は物体の振动で生まれます。|Sound comes from vibration.|声音由物体振动产生。"],["とまっている|It is still|静止不动","振动をとめると音もとまります。|Stop the vibration and the sound stops.|停止振动，声音也会停止。"],["热くなっている|It is getting hot|正在变热","音と温度は直接関系ありません。|Sound isn't about heat.|声音和温度没有直接关系。"]],
    "音は物体の振动。振动が空気などを波として伝わり、耳に届く。|Sound is vibration traveling as waves through air to our ears.|声音是物体的振动，以波的形式经空气等传到耳朵。"),
  Q("容器の中の空気をぬいていくと、中のブザーの音はどうなる？|As air is pumped out of a container, the buzzer inside sounds…|把容器中的空气抽掉，里面蜂鸣器的声音会怎样？","だんだん小さくなる|Quieter and quieter|越来越小",
    [["だんだん大きくなる|Louder and louder|越来越大","音を伝える空気がへるので、小さくなります。|Less air to carry the sound means quieter.|传声的空气变少，声音变小。"],["高くなる|Higher|变高","高さではなく、伝わり方が変わります。|The pitch doesn't change; transmission does.|改变的是传播，不是音高。"],["変わらない|No change|不变","音は真空中では伝わりません。|Sound can't travel in a vacuum.|声音不能在真空中传播。"]],
    "音は空気・水・固体の中を伝わるが、真空中は伝わらない。|Sound travels through air, water and solids, but not a vacuum.|声音能在空气、水、固体中传播，但不能在真空中传播。"),
  Q("弦をはじいたとき、音を高くするには？|How do you make a plucked string sound higher?|拨弦时，要让声音变高该怎么做？","弦を短くする|Make the string shorter|把弦变短",
    [["弦を强くはじく|Pluck it harder|用力拨","强くはじくと大きい音になります（高さは同じ）。|Harder makes it louder, not higher.|用力拨只会变大声，音高不变。"],["弦を太くする|Use a thicker string|换粗的弦","太い弦は低い音になります。|Thicker strings sound lower.|粗的弦声音较低。"],["弦をゆるめる|Loosen the string|把弦放松","ゆるめると低い音になります。|Looser is lower.|放松会变低。"]],
    "高い音：弦を短く・细く・强くはる（振动数が多くなる）。|Higher: shorter, thinner, tighter string (more vibrations).|高音：弦短、细、拉紧（振动频率变高）。"),
  Q("音の速さについて正しいのは？|Which is true about the speed of sound?|关于声音的速度，正确的是？","空気中で约340 m/s。光よりずっとおそい|About 340 m/s in air, much slower than light|在空气中约340 m/s，比光慢得多",
    [["光と同じ速さ|Same as light|和光一样快","光は约30万 km/s で、音よりはるかに速いです。|Light is ~300,000 km/s, far faster.|光约每秒30万 km，比声音快得多。"],["空気中で约3 m/s|About 3 m/s in air|在空气中约3 m/s","それでは遅すぎます。约340 m/s です。|Too slow; it is about 340 m/s.|太慢了，约 340 m/s。"],["真空中がいちばん速い|Fastest in a vacuum|在真空中最快","真空中では音は伝わりません。|Sound can't travel in a vacuum.|声音不能在真空中传播。"]],
    "音：空気中约340 m/s。だから花火や雷は光が先、音があと。|Sound: ~340 m/s in air, so we see fireworks and lightning before we hear them.|声音在空气中约340 m/s，所以烟火、雷电都是先看到光、后听到声音。"),
];

// 力：矢印の読みとり・重さと质量
function forceArrow(){ const k=R(2,7), s=pick([1,2,5,0.5]); const g=26; let b="";
  for(let i=0;i<=10;i++) b+=L(20+i*g,20,20+i*g,98,"g"); for(let j=0;j<=3;j++) b+=L(20,20+j*g,280,20+j*g,"g");
  b+=`<rect x="20" y="33" width="${g*2}" height="52" rx="4" class="os"/>`+`<circle cx="${20+g*2}" cy="59" r="4" class="kf"/>`+AR(20+g*2,59,20+g*(2+k),59);
  const fig=SV(300,110,b); const ans=k*s, sU=fm(s);
  return C(X(`1目盛りを ${sU} N とすると、矢印の力の大きさは？|If one square is ${sU} N, how big is the force?|若一格代表 ${sU} N，箭头表示的力是多少？`),ans," N",
    [[k,X(`目盛りの数（${k}）に ${sU} N をかけます。|Multiply the ${k} squares by ${sU} N.|格数（${k}）要乘上 ${sU} N。`)],[(k+1)*s,X("矢印は作用点（黒い点）から数えます。|Count from the point of action (the dot).|要从作用点（黑点）开始数。")],[k/s,X("わるのではなく、かけます。|Multiply, don't divide.|是乘法，不是除法。")]],
    X(`矢印の长さ ${k} 目盛り × ${sU} N ＝ ${fm(ans)} N（矢印の长さ＝力の大きさ）|${k} squares × ${sU} N = ${fm(ans)} N (arrow length = force size)|箭头长 ${k} 格 × ${sU} N ＝ ${fm(ans)} N（箭头长度＝力的大小）`),fig); }
function weightMass(){ const m=pick([300,600,900,1200,1800,2400]); const v=R(0,2);
  const pre=X("100 g の物体にはたらく重力を 1 N、月の重力は地球の 6分の1 とする。|Take gravity on 100 g as 1 N; the Moon's gravity is 1/6 of Earth's.|设作用在 100 g 物体上的重力为 1 N，月球重力为地球的 1/6。");
  if(v===0) return C(pre+"<br>"+X(`质量 ${m} g の物体の、地球での重さは？|Weight on Earth of an object of mass ${m} g?|质量 ${m} g 的物体在地球上的重量是？`),m/100," N",
    [[m,X("重さの単位は N です。100 g で 1 N。|Weight is in N; 100 g → 1 N.|重量单位是 N，100 g 为 1 N。")],[m/600,X("それは月での重さです。|That is the weight on the Moon.|那是在月球上的重量。")],[m/10,X("100 g で 1 N なので、100 でわります。|100 g → 1 N, so divide by 100.|100 g 为 1 N，要除以 100。")]],X(`${m} ÷ 100 ＝ ${m/100} N|${m} ÷ 100 = ${m/100} N|${m} ÷ 100 ＝ ${m/100} N`));
  if(v===1) return C(pre+"<br>"+X(`质量 ${m} g の物体の、月での重さは？|Weight on the Moon of an object of mass ${m} g?|质量 ${m} g 的物体在月球上的重量是？`),m/600," N",
    [[m/100,X("それは地球での重さです。月では6分の1。|That is on Earth; the Moon is 1/6.|那是在地球上的重量，月球是 1/6。")],[m/6,X("まず N にしてから 6 でわります（100 g で 1 N）。|Convert to N first (100 g → 1 N), then ÷ 6.|先换成 N（100 g 为 1 N）再除以 6。")],[m*6/100,X("月の重力は小さいので、6でわります。|The Moon's gravity is weaker: divide by 6.|月球重力较小，要除以 6。")]],X(`地球 ${m/100} N → 月 ${m/100} ÷ 6 ＝ ${m/600} N|Earth ${m/100} N → Moon ${m/100} ÷ 6 = ${m/600} N|地球 ${m/100} N → 月球 ${m/100} ÷ 6 ＝ ${m/600} N`));
  return C(pre+"<br>"+X(`质量 ${m} g の物体を月に持っていくと、月での质量は？|What is the mass on the Moon of an object of mass ${m} g?|质量 ${m} g 的物体带到月球，在月球上的质量是？`),m," g",
    [[m/6,X("质量は场所によって変わりません。変わるのは重さです。|Mass doesn't change with place; weight does.|质量不随地点改变，改变的是重量。")],[m/600,X("质量の単位は g。场所が変わっても同じです。|Mass is in g and stays the same.|质量单位是 g，地点改变也一样。")],[m*6,X("质量は场所によって変わりません。|Mass doesn't depend on place.|质量不随地点改变。")]],X(`质量（物质そのものの量）はどこでも ${m} g|Mass (amount of matter) is ${m} g anywhere|质量（物质本身的量）在哪里都是 ${m} g`)); }
const phys4=[forceArrow,forceArrow,weightMass,weightMass,weightMass,
  Q("力のはたらきにふくまれないものは？|Which is NOT an effect of a force?|下列哪一个不是力的作用？","物体の色を変える|Change an object's color|改变物体的颜色",
    [["物体の形を変える|Change its shape|改变物体的形状","形を変えるのは力のはたらきです（ばねをのばす）。|Changing shape is a force effect (stretching a spring).|改变形状是力的作用（拉长弹簧）。"],["物体の动きを変える|Change its motion|改变物体的运动","动きを変えるのは力のはたらきです（ボールをける）。|Changing motion is a force effect (kicking a ball).|改变运动是力的作用（踢球）。"],["物体を支える|Hold it up|支撑物体","支えるのも力のはたらきです（物を持ち上げる）。|Holding up is a force effect.|支撑也是力的作用（拿起东西）。"]],
    "力のはたらき：形を変える・动きを変える・支える。|Forces change shape, change motion, or hold things up.|力的作用：改变形状、改变运动、支撑物体。"),
  Q("力を矢印で表すとき、矢印の「始まりの点」は何を表す？|When drawing a force as an arrow, the starting point shows…|用箭头表示力时，箭头的「起点」表示什么？","作用点（力がはたらく点）|The point of action|作用点（力作用的点）",
    [["力の大きさ|Size of the force|力的大小","力の大きさは矢印の长さで表します。|Size is shown by length.|力的大小用箭头长度表示。"],["力の向き|Direction of the force|力的方向","向きは矢印の向きで表します。|Direction is shown by the arrowhead.|方向用箭头的指向表示。"],["物体の重さ|The object's weight|物体的重量","始まりの点は力がはたらく场所です。|The start is where the force acts.|起点是力作用的位置。"]],
    "力の3要素：作用点（始まり）・向き（矢印の向き）・大きさ（长さ）。|Three elements: point of action (start), direction (arrowhead), size (length).|力的三要素：作用点（起点）、方向（箭头方向）、大小（长度）。"),
  Q("はなれていてもはたらく力はどれ？|Which force acts even at a distance?|哪一种力不接触也能作用？","磁石の力|Magnetic force|磁力",
    [["摩擦力|Friction|摩擦力","摩擦力はふれ合っている面ではたらきます。|Friction acts where surfaces touch.|摩擦力在接触面作用。"],["弾性力|Elastic force|弹力","弾性力は変形した物体がふれているものにはたらきます。|Elastic force acts on things it touches.|弹力作用在接触的物体上。"],["垂直抗力|Normal force|正向力","垂直抗力は面がふれている物体をおす力です。|The normal force is a surface pushing what touches it.|正向力是接触面推物体的力。"]],
    "はなれていてもはたらく力：重力・磁石の力・电気の力。|Forces at a distance: gravity, magnetic, electric.|不接触也能作用的力：重力、磁力、电力。"),
  Q("上皿てんびんではかるのは？|What does a pan balance measure?|上皿天平测量的是？","质量（g）|Mass (g)|质量（g）",
    [["重さ（N）|Weight (N)|重量（N）","重さ（力）はばねばかりではかります。|Weight (a force) is measured with a spring scale.|重量（力）用弹簧秤测量。"],["体积（cm³）|Volume (cm³)|体积（cm³）","体积はメスシリンダーなどではかります。|Volume uses a graduated cylinder.|体积用量筒等测量。"],["密度（g/cm³）|Density (g/cm³)|密度（g/cm³）","密度は质量と体积から计算します。|Density is calculated from mass and volume.|密度是由质量和体积计算出来的。"]],
    "上皿てんびん→质量（月でも同じ値）。ばねばかり→重さ（月では6分の1）。|Pan balance → mass (same on the Moon). Spring scale → weight (1/6 on the Moon).|上皿天平→质量（在月球也相同）；弹簧秤→重量（在月球是 1/6）。"),
];

// ばね・2力のつり合い
function springText(){ let F1,x1,F2,x2; do{ F1=pick([1,2]); x1=pick([1.5,2,3,4]); F2=pick([0.5,1.5,2.5,3,4,5,6].filter(v=>v!==F1)); x2=x1*F2/F1; }while(Math.abs(x2*10-Math.round(x2*10))>1e-9);   // 答えは小数第1位まで（0.375 のような丸めを出さない）
  x2=+x2.toFixed(1); const tot=Math.random()<.4; const L0=pick([8,10,12,15]);
  if(!tot) return C(X(`${F1} N の力で ${x1} cm のびるばねに、${F2} N の力を加えると何 cm のびる？|A spring stretches ${x1} cm with ${F1} N. How much with ${F2} N?|一弹簧受 ${F1} N 的力伸长 ${x1} cm。受 ${F2} N 的力会伸长几 cm？`),x2," cm",
    [[x1*F2,X(`${F1} N で ${x1} cm なので、1 N あたりにしてからかけます。|First find the stretch per 1 N.|先算出每 1 N 伸长多少。`)],[x1+F2-F1,X("ふえた力の分だけたすのではなく、比例で考えます。|It is proportional, not additive.|是成正比，不是相加。")],[F2/x1,X("のびは力に比例します（のび ＝ 1 N あたりののび × 力）。|Stretch is proportional to force.|伸长量和力成正比。")]],
    X(`フックの法则：のびは力に比例。${x1} ÷ ${F1} × ${F2} ＝ ${fm(x2)} cm|Hooke's law: stretch ∝ force. ${x1} ÷ ${F1} × ${F2} = ${fm(x2)} cm|虎克定律：伸长量和力成正比。${x1} ÷ ${F1} × ${F2} ＝ ${fm(x2)} cm`));
  return C(X(`もとの长さ ${L0} cm、${F1} N の力で ${x1} cm のびるばね。${F2} N の力を加えたときの、ばね全体の长さは？|A ${L0} cm spring stretches ${x1} cm with ${F1} N. Its total length with ${F2} N?|原长 ${L0} cm 的弹簧受 ${F1} N 伸长 ${x1} cm。受 ${F2} N 时弹簧的总长是？`),L0+x2," cm",
    [[x2,X("それは「のび」です。もとの长さをたします。|That is just the stretch; add the original length.|那只是「伸长量」，要加上原长。")],[L0+x1,X(`${F2} N のときののびを求めます。|Use the stretch for ${F2} N.|要算 ${F2} N 时的伸长量。`)],[L0*F2/F1,X("比例するのは「のび」で、ばね全体の长さではありません。|The stretch is proportional, not the total length.|成正比的是伸长量，不是弹簧总长。")]],
    X(`のび ＝ ${x1} ÷ ${F1} × ${F2} ＝ ${fm(x2)} cm、全体 ＝ ${L0} ＋ ${fm(x2)} ＝ ${fm(L0+x2)} cm|Stretch = ${x1} ÷ ${F1} × ${F2} = ${fm(x2)} cm; total = ${L0} + ${fm(x2)} = ${fm(L0+x2)} cm|伸长 ＝ ${x1} ÷ ${F1} × ${F2} ＝ ${fm(x2)} cm，总长 ＝ ${L0} ＋ ${fm(x2)} ＝ ${fm(L0+x2)} cm`)); }
function springGraph(){ const k=pick([0.5,1,1.5,2,2.5]); const F1=pick([1,2,3,5,6,7,8]); const ans=+(k*F1).toFixed(2); const px=f=>40+f*30,py=c=>170-c*12;
  let b=""; for(let f=0;f<=4;f++) b+=L(px(f),20,px(f),170,"g")+T(px(f),186,String(f),"xs"); for(let c=0;c<=12;c+=2) b+=L(40,py(c),px(4),py(c),"g")+T(34,py(c)+4,String(c),"xs","end");
  b+=L(40,20,40,170,"ax")+L(40,170,px(4),170,"ax")+L(px(0),py(0),px(4),py(4*k),"ln")+`<circle cx="${px(4)}" cy="${py(4*k)}" r="4" class="pt"/>`+T(px(2),202,X("力の大きさ（N）|Force (N)|力的大小（N）"),"xs")+T(44,14,X("ばねののび（cm）|Stretch (cm)|弹簧伸长量（cm）"),"xs","start");
  const fig=SV(200,208,b);
  return C(X(`グラフのばねに ${F1} N の力を加えると、のびは何 cm？|With ${F1} N on the spring in the graph, how much does it stretch?|图中的弹簧受 ${F1} N 的力，伸长几 cm？`),ans," cm",
    [[F1/k,X("グラフで 1 N あたりののびを読み、力にかけます。|Read the stretch per 1 N and multiply.|从图读出每 1 N 的伸长量再乘以力。")],[4*k,X(`それは 4 N のときののびです。${F1} N を求めます。|That is for 4 N; find it for ${F1} N.|那是 4 N 时的伸长量，要求 ${F1} N 的。`)],[k*(F1+1),X("比例なので、1 N あたりののび × 力です。|Proportional: stretch per N × force.|成正比：每 N 伸长量 × 力。")]],
    X(`4 N で ${fm(4*k)} cm → 1 N で ${fm(k)} cm → ${F1} N で ${fm(ans)} cm|4 N → ${fm(4*k)} cm, so 1 N → ${fm(k)} cm, ${F1} N → ${fm(ans)} cm|4 N → ${fm(4*k)} cm，1 N → ${fm(k)} cm，${F1} N → ${fm(ans)} cm`),fig); }
// 2力のつり合い：4つの図
const BAL={ok:"同じ直在线・大きさが等しい・向きが反対で、つり合っています。|Same line, equal, opposite: balanced.|在同一直线、大小相等、方向相反，所以平衡。",
  neq:"2力の大きさ（矢印の长さ）がちがいます。|The forces are different sizes.|两力的大小（箭头长度）不同。",off:"2力が同じ直在线にありません。|The forces are not on the same line.|两力不在同一直在线。",dir:"2力の向きが反対ではありません。|The forces are not opposite.|两力的方向不是相反的。"};
function balFig(order){ let b=""; order.forEach((k,i)=>{ const x=10+i*84,cx=x+36,cy=52; b+=`<rect x="${cx-14}" y="${cy-14}" width="28" height="28" rx="3" class="os"/>`+T(cx,104,LET[i]);
    if(k==="ok") b+=AR(cx-14,cy,cx-40,cy)+AR(cx+14,cy,cx+40,cy);
    if(k==="neq") b+=AR(cx-14,cy,cx-30,cy)+AR(cx+14,cy,cx+44,cy);
    if(k==="off") b+=AR(cx-14,cy-9,cx-40,cy-9)+AR(cx+14,cy+9,cx+40,cy+9);
    if(k==="dir") b+=AR(cx-14,cy,cx-40,cy)+AR(cx,cy-14,cx,cy-40); }); return SV(340,112,b); }
function balance(){ const order=shuf(["ok","neq","off","dir"]); const fig=balFig(order); const a=LET[order.indexOf("ok")];
  return {q:X("2つの力がつり合っているのはどれ？|Which shows two balanced forces?|哪一个是两力平衡？")+fig,ans:a,wrongs:order.map((k,i)=>k==="ok"?null:{v:LET[i],why:X(BAL[k])}).filter(Boolean),
    exp:X("2力のつり合い：①同じ直在线 ②大きさが等しい ③向きが反対。|Balanced forces: same line, equal size, opposite directions.|两力平衡：①在同一直线 ②大小相等 ③方向相反。"),tf:v=>X("つり合っているのは|The balanced one is|平衡的是")+fig+`→ ${v}`,kind:"fig"}; }
const phys5=[springText,springText,springGraph,springGraph,balance,balance,
  Q("「ばねののびは、ばねに加えた力の大きさに比例する」という法则は？|The law \"a spring's stretch is proportional to the force\" is…|「弹簧伸长量和所受的力成正比」的定律是？","フックの法则|Hooke's law|虎克定律",
    [["反射の法则|Law of reflection|反射定律","反射の法则は光の入射角と反射角の関系です。|That is about light angles.|反射定律是光的入射角和反射角的关系。"],["惯性の法则|Law of inertia|惯性定律","惯性の法则は运动についての法则です（中3）。|That is about motion (grade 9).|惯性定律是关于运动的定律（国三）。"],["质量保存の法则|Conservation of mass|质量守恒定律","质量保存の法则は化学変化での质量の関系です（中2）。|That is about mass in reactions (grade 8).|质量守恒定律是化学变化中的质量关系（国二）。"]],
    "フックの法则：ばねののび ∝ 力の大きさ（グラフは原点を通る直线）。|Hooke's law: stretch ∝ force (a straight line through the origin).|虎克定律：弹簧伸长量 ∝ 力的大小（图形是通过原点的直线）。"),
  Q("机の上に置いた本にはたらく重力とつり合っている力は？|What balances gravity on a book resting on a desk?|放在桌上的书，和重力平衡的力是？","机が本をおす力（垂直抗力）|The desk pushing up (normal force)|桌子推书的力（正向力）",
    [["摩擦力|Friction|摩擦力","摩擦力は面にそって动きをさまたげる力です。|Friction acts along the surface against motion.|摩擦力是沿着接触面阻碍运动的力。"],["磁石の力|Magnetic force|磁力","本と机の间に磁石の力ははたらいていません。|There is no magnetic force here.|书和桌子之间没有磁力。"],["本が机をおす力|The book pushing the desk|书推桌子的力","それは机にはたらく力です。本にはたらく力を考えます。|That acts on the desk, not the book.|那是作用在桌子上的力，要考虑作用在书上的力。"]],
    "本にはたらく：重力（下向き）と垂直抗力（上向き）がつり合う。|On the book: gravity (down) balances the normal force (up).|作用在书上：重力（向下）和正向力（向上）平衡。"),
];
/* ========== ④ 大地の成り立ちと変化（第2分野(2)） ========== */
// 火山の形：ドーム状・成层火山・たて状
const VOL={dome:"ねばりけが强い|very sticky (viscous) magma|黏性强",cone:"ねばりけが中くらい|medium viscosity|黏性中等",shield:"ねばりけが弱い|runny magma|黏性弱"};
function volFig(order){ let b=""; order.forEach((k,i)=>{ const x=10+i*104,cx=x+46,by=90; b+=L(x,by,x+92,by,"o");
  if(k==="dome") b+=`<path d="M${cx-30} ${by} Q${cx-30} ${by-56} ${cx} ${by-56} Q${cx+30} ${by-56} ${cx+30} ${by} Z" class="ac"/>`;
  if(k==="cone") b+=`<path d="M${cx-44} ${by} Q${cx-16} ${by-24} ${cx-6} ${by-60} L${cx+6} ${by-60} Q${cx+16} ${by-24} ${cx+44} ${by} Z" class="ac"/>`;
  if(k==="shield") b+=`<path d="M${cx-46} ${by} Q${cx-20} ${by-22} ${cx} ${by-22} Q${cx+20} ${by-22} ${cx+46} ${by} Z" class="ac"/>`;
  b+=T(cx,by+20,LET[i]); }); return SV(320,116,b); }
const VQ=[["マグマのねばりけが最も强い火山の形は？|Which volcano shape comes from the most viscous magma?|岩浆黏性最强的火山形状是？","dome","ねばりけが强いと溶岩が流れにくく、盛り上がった形になります。|Sticky lava doesn't flow, so it piles up into a dome.|黏性强的熔岩不易流动，会堆成隆起的形状。"],
  ["おだやかに喷火し、溶岩が流れやすい火山の形は？|Which shape comes from gentle eruptions with runny lava?|喷发温和、熔岩容易流动的火山形状是？","shield","ねばりけが弱いと溶岩がうすく広がり、なだらかな形になります。|Runny lava spreads thin into a gentle shape.|黏性弱的熔岩会薄薄地扩散，形成平缓的形状。"],
  ["富士山や桜岛のような形の火山は？|Which shape is like Mt. Fuji or Sakurajima?|像富士山、樱岛那样形状的火山是？","cone","溶岩と火山灰が交互に积み重なった円すい形（成层火山）です。|Layers of lava and ash make a cone (stratovolcano).|熔岩和火山灰交互堆积成圆锥形（层状火山）。"]];
const VNM={dome:"ドーム状（昭和新山・云仙普贤岳）|dome (Showa-shinzan, Unzen)|钟状（昭和新山、云仙普贤岳）",cone:"円すい形の成层火山（富士山・桜岛）|cone-shaped stratovolcano (Fuji, Sakurajima)|圆锥形层状火山（富士山、樱岛）",shield:"たて状（マウナロア）|shield (Mauna Loa)|盾状（茂纳罗亚）"};
function volShape(){ const order=shuf(["dome","cone","shield"]); const fig=volFig(order); const [q,k,why]=pick(VQ); const a=LET[order.indexOf(k)];
  const ws=order.map((kk,i)=>kk===k?null:{v:LET[i],why:X(`${LET[i]} は${X(VNM[kk])}。マグマは${X(VOL[kk])}。|${LET[i]} is a ${X(VNM[kk])}: ${X(VOL[kk])}.|${LET[i]} 是${X(VNM[kk])}，岩浆${X(VOL[kk])}。`)}).filter(Boolean);
  ws.push({v:X("形からは分からない|Can't tell from shape|从形状看不出来"),why:X("火山の形はマグマのねばりけで决まります。|The shape depends on magma viscosity.|火山形状由岩浆黏性决定。")});
  return {q:X(q)+fig,ans:a,wrongs:ws,exp:`${a}：`+X(why),tf:v=>X(q)+fig+`→ ${v}`,kind:"fig"}; }
// 火成岩のつくり：A 斑状组织 B 等粒状组织
const FIG_ROCK=(()=>{ let b=`<rect x="10" y="10" width="130" height="110" rx="6" class="bx"/><rect x="170" y="10" width="130" height="110" rx="6" class="bx"/>`;
  let s=1; const rnd=()=>{ s=(s*9301+49297)%233280; return s/233280; };
  for(let i=0;i<150;i++) b+=`<circle cx="${(16+rnd()*118).toFixed(1)}" cy="${(16+rnd()*98).toFixed(1)}" r="1.2" class="kf"/>`;
  for(const [x,y,r,a] of [[40,40,13,10],[95,32,10,40],[60,90,12,70],[112,84,9,20],[30,100,7,50]]){ const p=[0,1,2,3,4,5].map(j=>{ const t=rad(a+j*60); return P2(x+r*Math.cos(t)*(j%2?1:.75),y+r*Math.sin(t)); }).join(" "); b+=`<polygon points="${p}" class="ac"/>`; }
  for(let gx=0;gx<5;gx++) for(let gy=0;gy<4;gy++){ const x=176+gx*25+(gy%2)*6,y=16+gy*26; b+=`<polygon points="${P2(x,y+4)} ${P2(x+20,y)} ${P2(x+24,y+18)} ${P2(x+6,y+24)}" class="${(gx+gy)%3?"ac":"os"}"/>`; }
  return SV(310,146,b+T(75,140,"A")+T(235,140,"B")); })();
const earth1=[volShape,volShape,volShape,
  Q("図の A のような岩石のつくりを何という？|What is the texture of rock A called?|像图中 A 那样的岩石组织叫做？","斑状组织|Porphyritic texture|斑状组织",
    [["等粒状组织|Equigranular texture|等粒状组织","等粒状组织は B のように大きな结晶がそろったつくりです。|Equigranular is like B, all large crystals.|等粒状组织是像 B 那样大结晶整齐排列。"],["地层|Strata|地层","地层は堆积物が层になったものです。|Strata are layers of sediment.|地层是沉积物堆积成的层。"],["化石|Fossil|化石","化石は昔の生物のあとです。|Fossils are traces of ancient life.|化石是古代生物的遗迹。"]],
    "斑状组织（A）：大きな结晶（斑晶）と细かい部分（石基）。マグマが地表近くで急に冷えた＝火山岩。|Porphyritic (A): big crystals (phenocrysts) in fine groundmass; cooled fast near the surface = volcanic rock.|斑状组织（A）：大结晶（斑晶）和细小部分（石基）；岩浆在地表附近快速冷却＝火山岩。",FIG_ROCK),
  Q("図の B のようなつくりの岩石は、どのようにできた？|How did rock B form?|像图中 B 那样组织的岩石是怎么形成的？","マグマが地下深くでゆっくり冷えて固まった|Magma cooled slowly deep underground|岩浆在地下深处慢慢冷却凝固",
    [["マグマが地表近くで急に冷えて固まった|Magma cooled fast near the surface|岩浆在地表附近快速冷却凝固","それは A（斑状组织）の火山岩のでき方です。|That is how A (volcanic rock) forms.|那是 A（斑状组织）火山岩的形成方式。"],["土砂が积もって固まった|Sediment piled up and hardened|泥沙堆积后变硬","それは堆积岩のでき方です。|That is sedimentary rock.|那是沉积岩的形成方式。"],["生物の死がいが积もった|Dead organisms piled up|生物遗骸堆积","それは石灰岩やチャートなどの堆积岩です。|That is limestone or chert.|那是石灰岩、燧石等沉积岩。"]],
    "等粒状组织（B）：ゆっくり冷えて结晶が大きく成长した＝深成岩（花こう岩など）。|Equigranular (B): slow cooling grows large crystals = plutonic rock (e.g. granite).|等粒状组织（B）：慢慢冷却使结晶长大＝深成岩（如花岗岩）。",FIG_ROCK),
  Q("斑状组织で、まわりの细かい粒やガラスの部分を何という？|In porphyritic rock, the fine part around the big crystals is…|斑状组织中，大结晶周围细小颗粒或玻璃质的部分叫做？","石基|Groundmass|石基",
    [["斑晶|Phenocrysts|斑晶","斑晶は大きな结晶のほうです。|Phenocrysts are the big crystals.|斑晶是大的结晶。"],["鉱物|Minerals|矿物","鉱物は岩石をつくる粒の种类のことです。|Minerals are the kinds of grains.|矿物是组成岩石的颗粒种类。"],["火山灰|Volcanic ash|火山灰","火山灰は喷火でふき出す细かい粒です。|Ash is erupted fine particles.|火山灰是喷发喷出的细小颗粒。"]],
    "斑状组织＝斑晶（大きな结晶）＋石基（细かい部分）。|Porphyritic = phenocrysts + groundmass.|斑状组织＝斑晶（大结晶）＋石基（细小部分）。",FIG_ROCK),
  Q("マグマのねばりけが强い火山の火山灰や岩石の色は？|What color are ash and rocks from a volcano with viscous magma?|岩浆黏性强的火山，其火山灰和岩石的颜色是？","白っぽい|Whitish|偏白",
    [["黒っぽい|Blackish|偏黑","黒っぽいのはねばりけが弱いマグマです（有色鉱物が多い）。|Dark ones come from runny magma (more dark minerals).|偏黑的是黏性弱的岩浆（有色矿物多）。"],["赤い|Red|红色","色は无色鉱物と有色鉱物の割合で决まります。|Color depends on light vs. dark minerals.|颜色由无色和有色矿物的比例决定。"],["透明|Clear|透明","岩石は透明ではありません。|Rocks aren't clear.|岩石不是透明的。"]],
    "ねばりけ强い→白っぽい（无色鉱物が多い）・激しい喷火。弱い→黒っぽい・おだやか。|Viscous → whitish (light minerals), explosive. Runny → dark, gentle.|黏性强→偏白（无色矿物多）、剧烈喷发；黏性弱→偏黑、温和。"),
  Q("白っぽい深成岩はどれ？|Which is a whitish plutonic rock?|哪一个是偏白的深成岩？","花こう岩|Granite|花岗岩",
    [["玄武岩|Basalt|玄武岩","玄武岩は黒っぽい火山岩です。|Basalt is a dark volcanic rock.|玄武岩是偏黑的火山岩。"],["流纹岩|Rhyolite|流纹岩","流纹岩は白っぽいですが、火山岩です。|Rhyolite is whitish but volcanic.|流纹岩偏白，但属于火山岩。"],["斑れい岩|Gabbro|辉长岩","斑れい岩は黒っぽい深成岩です。|Gabbro is a dark plutonic rock.|辉长岩是偏黑的深成岩。"]],
    "火山岩：流纹岩・安山岩・玄武岩（白→黒）。深成岩：花こう岩・せん绿岩・斑れい岩（白→黒）。|Volcanic: rhyolite, andesite, basalt (light→dark). Plutonic: granite, diorite, gabbro.|火山岩：流纹岩、安山岩、玄武岩（白→黑）；深成岩：花岗岩、闪长岩、辉长岩（白→黑）。"),
  Q("无色鉱物はどれ？|Which is a light-colored (colorless) mineral?|哪一个是无色矿物？","セキエイ|Quartz|石英",
    [["クロウンモ|Biotite|黑云母","クロウンモは黒色でうすくはがれる有色鉱物です。|Biotite is black and peels in sheets.|黑云母是黑色、会薄片剥落的有色矿物。"],["カクセン石|Hornblende|角闪石","カクセン石は绿黒色の有色鉱物です。|Hornblende is a dark green-black mineral.|角闪石是绿黑色的有色矿物。"],["カンラン石|Olivine|橄榄石","カンラン石は黄绿色の有色鉱物です。|Olivine is a yellow-green mineral.|橄榄石是黄绿色的有色矿物。"]],
    "无色鉱物：セキエイ・チョウ石。有色鉱物：クロウンモ・カクセン石・キ石・カンラン石・磁鉄鉱。|Light: quartz, feldspar. Dark: biotite, hornblende, pyroxene, olivine, magnetite.|无色矿物：石英、长石；有色矿物：黑云母、角闪石、辉石、橄榄石、磁铁矿。"),
  Q("軽石にたくさんの小さな穴があいているのはなぜ？|Why does pumice have many small holes?|浮石有很多小孔，原因是？","マグマにふくまれていた気体がぬけたあとだから|Gas escaped from the magma|岩浆中所含的气体跑出去留下的痕迹",
    [["虫が食べたあとだから|Bugs ate it|被虫吃过","生物とは関系ありません。|It has nothing to do with living things.|和生物无关。"],["雨にとかされたから|Rain dissolved it|被雨水溶解","できたときから穴があいています。|The holes formed when it was made.|形成时就有孔了。"],["结晶が大きく育ったから|Crystals grew large|结晶长得很大","穴は気体のあとです。|The holes are left by gas.|孔是气体留下的。"]],
    "マグマの中の気体（水蒸気など）がぬけて、穴の多い軽石ができる。|Gas (mainly steam) escaping from magma leaves pumice full of holes.|岩浆中的气体（水蒸气等）逸出，形成多孔的浮石。"),
];

// 地震
const FIG_SEIS=(()=>{ const pts=[]; let s=7; const rn=()=>{ s=(s*16807)%2147483647; return s/2147483647-.5; };
  for(let i=0;i<=300;i++){ const x=10+i; let a=0; if(x>60) a=x<150?7:x<230?30*Math.exp(-(x-150)/90)+6:10*Math.exp(-(x-230)/40); pts.push(P2(x,70+a*rn()*2)); }
  return SV(320,130,`<polyline points="${pts.join(" ")}" class="ln"/>`+L(60,20,60,112,"dl")+L(150,20,150,112,"dl")+T(105,22,"A")+T(200,22,"B")+AR(60,108,150,108,"k")+AR(150,108,60,108,"k")+T(105,124,"C","sm")+T(296,124,X("时间→|time →|时间→"),"xs","end")); })();
const earth2=[
  Q("図の地震计の记录で、A のはじめの小さなゆれを何という？|In the seismogram, what is the first small shaking A called?|地震仪纪录中，A 一开始的小摇晃叫做？","初期微动|Preliminary tremors|初期微动",
    [["主要动|Main shaking|主震动","主要动は B のあとから来る大きなゆれです。|Main shaking is the big shaking at B.|主震动是 B 之后的大摇晃。"],["余震|Aftershock|余震","余震は大きな地震のあとに続いて起こる地震です。|Aftershocks are later quakes.|余震是大地震之后接着发生的地震。"],["津波|Tsunami|海啸","津波は海の水が大きく动く现象です。|A tsunami is a huge sea wave.|海啸是海水大规模移动的现象。"]],
    "初期微动（A）は P波、主要动（B）は S波によるゆれ。|Preliminary tremors (A) come from P waves; main shaking (B) from S waves.|初期微动（A）由 P 波造成，主震动（B）由 S 波造成。",FIG_SEIS),
  Q("図の B の大きなゆれを伝える波は？|Which wave causes the big shaking B?|图中 B 的大摇晃是由哪种波传来的？","S波|S wave|S 波",
    [["P波|P wave|P 波","P波は先に届く速い波で、初期微动を起こします。|P waves arrive first and cause the small tremors.|P 波较快先到，造成初期微动。"],["光|Light|光","地震のゆれは地面を伝わる波です。|Quake shaking is a wave through the ground.|地震摇晃是在地面传播的波。"],["音|Sound|声音","地震の波は P波と S波です。|Earthquake waves are P and S waves.|地震波是 P 波和 S 波。"]],
    "P波（速い）→初期微动、S波（おそい）→主要动。|P (fast) → small tremors; S (slow) → main shaking.|P 波（快）→初期微动；S 波（慢）→主震动。",FIG_SEIS),
  Q("図の C の时间（初期微动が続く时间）を何という？|What is time C called?|图中 C 的时间（初期微动持续的时间）叫做？","初期微动継続时间|P–S time (duration of tremors)|初期微动持续时间",
    [["震度|Seismic intensity|震度","震度はその场所のゆれの大きさです。|Intensity is how strongly a place shakes.|震度是该地摇晃的程度。"],["マグニチュード|Magnitude|规模","マグニチュードは地震そのものの规模です。|Magnitude is the size of the quake itself.|规模是地震本身的大小。"],["主要动|Main shaking|主震动","主要动は B からのゆれです。|Main shaking starts at B.|主震动是从 B 开始的摇晃。"]],
    "初期微动継続时间は、震源からの距离が远いほど长い（距离に比例）。|The P–S time grows with distance (proportional).|初期微动持续时间和震源距离成正比，越远越长。",FIG_SEIS),
  ()=>{ const v=pick([5,6,7,8]),t=pick([5,8,10,12,15,20]); const d=v*t;
    return C(X(`震源から ${d} km の地点に、P波が ${t} 秒后に届いた。P波の速さは？|P waves reached a point ${d} km away in ${t} s. Their speed?|P 波在 ${t} 秒后到达离震源 ${d} km 的地点，P 波的速度是？`),v," km/s",
      [[t/d,X("速さ ＝ 距离 ÷ 时间 です。|Speed = distance ÷ time.|速度 ＝ 距离 ÷ 时间。")],[d*t,X("かけ算ではなく、わり算です。|Divide, don't multiply.|是除法，不是乘法。")],[d-t,X("ひき算ではなく、わり算です。|Divide, don't subtract.|是除法，不是减法。")]],
      X(`速さ ＝ ${d} ÷ ${t} ＝ ${v} km/s|Speed = ${d} ÷ ${t} = ${v} km/s|速度 ＝ ${d} ÷ ${t} ＝ ${v} km/s`)); },
  ()=>{ const k=pick([6,7,8]),x1=pick([5,10,15]),x2=pick([4,6,8,12,20,25,30].filter(v=>v!==x1)); const d1=k*x1,d2=k*x2;
    return C(X(`震源から ${d1} km の地点で初期微动継続时间が ${x1} 秒だった。震源から ${d2} km の地点では何秒？|At ${d1} km from the focus the P–S time was ${x1} s. What is it at ${d2} km?|离震源 ${d1} km 处的初期微动持续时间是 ${x1} 秒。离震源 ${d2} km 处是几秒？`),x2," s",
      [[x1*d2/10,X("初期微动継続时间は距离に比例します。|The P–S time is proportional to distance.|初期微动持续时间和距离成正比。")],[x1+(d2-d1),X("距离の差をそのままたしてはいけません。比例で考えます。|Don't add the distance; use proportion.|不能直接加距离差，要用比例。")],[d2/x1,X(`距离 ${d1} km で ${x1} 秒 → 1秒あたり ${k} km。|${d1} km ↔ ${x1} s, so ${k} km per second.|${d1} km 对应 ${x1} 秒 → 每秒 ${k} km。`)]],
      X(`${d1} km で ${x1} 秒 → ${d2} km では ${x1} × ${d2}/${d1} ＝ ${x2} 秒|${x1} s at ${d1} km → at ${d2} km: ${x1} × ${d2}/${d1} = ${x2} s|${d1} km 为 ${x1} 秒 → ${d2} km 为 ${x1} × ${d2}/${d1} ＝ ${x2} 秒`)); },
  ()=>{ const d=12*R(3,10); const tp=d/6,ts=d/4;
    return C(X(`P波の速さ 6 km/s、S波の速さ 4 km/s。震源から ${d} km の地点の初期微动継続时间は？|P waves: 6 km/s, S waves: 4 km/s. P–S time at ${d} km?|P 波 6 km/s、S 波 4 km/s。离震源 ${d} km 处的初期微动持续时间是？`),ts-tp," s",
      [[ts,X(`それは S波が届くまでの时间です。P波の ${tp} 秒をひきます。|That is the S arrival; subtract the P time ${tp} s.|那是 S 波到达的时间，要减掉 P 波的 ${tp} 秒。`)],[tp,X("それは P波が届くまでの时间です。|That is the P arrival time.|那是 P 波到达的时间。")],[ts+tp,X("たし算ではなく、S波 − P波 の时间です。|It is S time − P time, not the sum.|是 S 波时间 − P 波时间，不是相加。")]],
      X(`P波 ${d}÷6 ＝ ${tp} 秒、S波 ${d}÷4 ＝ ${ts} 秒、差 ＝ ${ts-tp} 秒|P: ${d}÷6 = ${tp} s, S: ${d}÷4 = ${ts} s, difference = ${ts-tp} s|P 波 ${d}÷6 ＝ ${tp} 秒，S 波 ${d}÷4 ＝ ${ts} 秒，差 ＝ ${ts-tp} 秒`)); },
  Q("震源の真上の地表の点を何という？|The point on the surface right above the focus is…|震源正上方的地表点叫做？","震央|Epicenter|震央",
    [["震源|Focus (hypocenter)|震源","震源は地下で地震が発生した场所です。|The focus is underground where it starts.|震源是地下发生地震的地方。"],["断层|Fault|断层","断层は地层や岩石がずれたところです。|A fault is where rocks slipped.|断层是地层或岩石错动的地方。"],["火口|Crater|火山口","火口は火山の喷火口です。|A crater is a volcano's vent.|火山口是火山的喷发口。"]],
    "震源：地下の発生场所。震央：その真上の地表。|Focus: where it starts underground. Epicenter: directly above on the surface.|震源：地下发生处；震央：其正上方的地表。"),
  Q("日本の震度は何段阶？|How many levels does Japan's seismic intensity scale have?|日本的震度分为几级？","10段阶（0〜7、5と6は弱・强）|10 (0–7, with 5 and 6 split into lower/upper)|10级（0〜7，5和6分弱、强）",
    [["7段阶|7|7级","5弱・5强・6弱・6强があるので10段阶です。|5 and 6 are split, making 10.|5和6分弱、强，共10级。"],["8段阶|8|8级","0から7までに、5と6が弱・强に分かれて10段阶です。|0–7 with 5 and 6 split = 10.|0到7，5和6各分弱、强，共10级。"],["12段阶|12|12级","日本の震度は10段阶です。|Japan uses 10 levels.|日本的震度是10级。"]],
    "震度：その场所のゆれの大きさ（0・1・2・3・4・5弱・5强・6弱・6强・7）。|Intensity: shaking at a place (0, 1, 2, 3, 4, 5−, 5+, 6−, 6+, 7).|震度：该地摇晃程度（0、1、2、3、4、5弱、5强、6弱、6强、7）。"),
  Q("地震そのものの规模（エネルギーの大きさ）を表すものは？|What shows the size (energy) of the earthquake itself?|表示地震本身规模（能量大小）的是？","マグニチュード|Magnitude|规模",
    [["震度|Seismic intensity|震度","震度は场所ごとのゆれの大きさで、同じ地震でも场所でちがいます。|Intensity varies by place.|震度是各地的摇晃程度，同一地震各地不同。"],["初期微动継続时间|P–S time|初期微动持续时间","それは震源からの距离に関系します。|That depends on distance.|那和离震源的距离有关。"],["震央|Epicenter|震央","震央は场所のことです。|The epicenter is a place.|震央是一个地点。"]],
    "マグニチュード：地震の规模（1つの地震に1つ）。震度：各地のゆれ。|Magnitude: one value per quake. Intensity: shaking at each place.|规模：每次地震只有一个值；震度：各地的摇晃。"),
  Q("日本付近で、海洋プレートはどう动いている？|Near Japan, how do the ocean plates move?|日本附近的海洋板块怎么移动？","大陆プレートの下にしずみこんでいる|They sink under the continental plates|隐没到大陆板块下方",
    [["大陆プレートの上に乗り上げている|They ride over the continental plates|爬到大陆板块上方","海洋プレートのほうが下にしずみこみます。|Ocean plates go underneath.|海洋板块是往下隐没。"],["まったく动いていない|They don't move|完全不动","プレートは1年に数cmずつ动いています。|Plates move a few cm per year.|板块每年移动数公分。"],["日本からはなれている|They move away from Japan|远离日本","日本の下に向かって动いています。|They move toward and under Japan.|是朝日本下方移动。"]],
    "海洋プレートが大陆プレートの下にしずみこむ → ひずみがたまり地震が起こる。震源は太平洋侧で浅く、日本海侧ほど深い。|Ocean plates subduct under continental plates → strain builds → quakes. Foci are shallow on the Pacific side and deeper toward the Sea of Japan.|海洋板块隐没到大陆板块下 → 累积应力 → 发生地震；震源在太平洋侧浅、往日本海侧越深。"),
  Q("紧急地震速报のしくみは？|How does Japan's Earthquake Early Warning work?|日本紧急地震速报的原理是？","P波を感知して、S波が来る前に知らせる|It detects P waves and warns before S waves arrive|侦测到 P 波后，在 S 波到达前发出警报",
    [["地震が起こる前に予知して知らせる|It predicts quakes before they happen|在地震发生前预测并通知","地震の発生を前もって予知することはできません。|Quakes can't be predicted in advance.|无法事先预测地震发生。"],["S波を感知してから知らせる|It warns after detecting S waves|侦测到 S 波后才通知","S波が来てからでは大きなゆれに间に合いません。|After S waves it would be too late.|S 波到了才通知就来不及了。"],["津波を见てから知らせる|It warns after seeing a tsunami|看到海啸后才通知","地震のゆれの予报です。P波を使います。|It warns of shaking using P waves.|是地震摇晃的预报，利用 P 波。"]],
    "P波はS波より速い。その差を使い、大きなゆれ（S波）の前に知らせる。|P waves are faster than S waves; the gap gives warning time.|P 波比 S 波快，利用时间差在大摇晃（S 波）前发出通知。"),
];

// 地层：柱状図
const LAY=[["れき|gravel|砾",0],["砂|sand|砂",1],["泥|mud|泥",2],["凝灰岩|tuff|凝灰岩",3],["石灰岩|limestone|石灰岩",4]];
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
  const qs=[["最も古いと考えられる层は？（地层の逆転はない）|Which layer is the oldest? (no overturning)|最古老的地层是？（地层没有倒转）",LET[4],"地层はふつう下にあるものほど古い。|Lower layers are usually older.|地层通常越下面越古老。",l=>X(`${l} より下に古い层があります。|There are older layers below ${l}.|${l} 下面还有更古老的地层。`)],
    ["火山の喷火があったと分かる层は？|Which layer shows a volcanic eruption?|哪一层可以知道曾有火山喷发？",pos(3),"凝灰岩は火山灰などが积もってできた岩石。|Tuff forms from volcanic ash.|凝灰岩是火山灰等堆积形成的岩石。",l=>X(`${l} は${X(LAY[order[LET.indexOf(l)]][0])}の层です。|${l} is ${X(LAY[order[LET.indexOf(l)]][0])}.|${l} 是${X(LAY[order[LET.indexOf(l)]][0])}层。`)],
    ["粒が最も大きく、河口や海岸に近い浅い所で积もったと考えられる层は？|Which layer has the biggest grains, deposited near a river mouth or shore?|颗粒最大、被认为是在河口或海岸附近浅处堆积的地层是？",pos(0),"粒が大きいれき（2 mm以上）は重く、岸の近くで先に沈む。|Big gravel (≥2 mm) sinks first, near shore.|大颗粒的砾（2 mm以上）较重，在岸边先沉积。",l=>X(`${l} は${X(LAY[order[LET.indexOf(l)]][0])}の层です。粒の大きさを比べよう。|${l} is ${X(LAY[order[LET.indexOf(l)]][0])}. Compare grain sizes.|${l} 是${X(LAY[order[LET.indexOf(l)]][0])}层，比较颗粒大小。`)],
    ["粒が最も小さく、岸から远い冲で积もったと考えられる层は？|Which layer has the finest grains, deposited far offshore?|颗粒最小、被认为是在离岸较远处堆积的地层是？",pos(2),"泥（1/16 mm以下）は軽く、冲まで运ばれて积もる。|Mud (≤1/16 mm) is carried far offshore.|泥（1/16 mm以下）较轻，会被搬运到外海堆积。",l=>X(`${l} は${X(LAY[order[LET.indexOf(l)]][0])}の层です。粒の大きさを比べよう。|${l} is ${X(LAY[order[LET.indexOf(l)]][0])}. Compare grain sizes.|${l} 是${X(LAY[order[LET.indexOf(l)]][0])}层，比较颗粒大小。`)]];
  const [q,a,exp,why]=pick(qs);
  return {q:X(q)+fig,ans:a,wrongs:shuf(LET.slice(0,5).split("").filter(l=>l!==a)).slice(0,3).map(l=>({v:l,why:why(l)})),exp:X(exp),tf:v=>X(q)+fig+`→ ${v}`,kind:"fig"}; }
const earth3=[strata,strata,strata,strata,
  Q("サンゴの化石をふくむ地层は、どんな环境で积もった？|A layer with coral fossils formed in…|含有珊瑚化石的地层，是在什么环境堆积的？","あたたかくて浅い海|A warm, shallow sea|温暖的浅海",
    [["冷たくて深い海|A cold, deep sea|寒冷的深海","サンゴはあたたかく浅い海にすみます。|Coral lives in warm, shallow seas.|珊瑚生活在温暖的浅海。"],["湖や河口|A lake or river mouth|湖泊或河口","湖や河口を示すのはシジミの化石です。|Freshwater clams (shijimi) show lakes or river mouths.|表示湖泊或河口的是蚬的化石。"],["陆上の森|A forest on land|陆地上的森林","サンゴは海の生物です。|Coral is a sea creature.|珊瑚是海洋生物。"]],
    "示相化石：当时の环境が分かる（サンゴ→あたたかく浅い海、シジミ→河口や湖）。|Facies fossils show past environments (coral → warm shallow sea; shijimi clam → river mouth/lake).|指相化石：可知当时环境（珊瑚→温暖浅海，蚬→河口或湖泊）。"),
  Q("アンモナイトの化石が见つかった地层ができた时代は？|A layer with ammonite fossils formed in which era?|发现菊石化石的地层，是在哪个时代形成的？","中生代|Mesozoic|中生代",
    [["古生代|Paleozoic|古生代","古生代の示准化石は三叶虫やフズリナです。|Paleozoic index fossils: trilobites, fusulinids.|古生代的标准化石是三叶虫、纺锤虫。"],["新生代|Cenozoic|新生代","新生代の示准化石はビカリアやナウマンゾウです。|Cenozoic: Vicarya, Naumann's elephant.|新生代的标准化石是维卡里亚螺、诺氏古菱齿象。"],["どの时代か分からない|Can't tell|无法判断","アンモナイトは时代が分かる示准化石です。|Ammonites are index fossils.|菊石是可判断年代的标准化石。"]],
    "示准化石：古生代＝三叶虫・フズリナ、中生代＝アンモナイト・恐竜、新生代＝ビカリア・ナウマンゾウ。|Index fossils: Paleozoic = trilobites, fusulinids; Mesozoic = ammonites, dinosaurs; Cenozoic = Vicarya, Naumann's elephant.|标准化石：古生代＝三叶虫、纺锤虫；中生代＝菊石、恐龙；新生代＝维卡里亚螺、诺氏古菱齿象。"),
  Q("うすい塩酸をかけると気体（二酸化炭素）が出る岩石は？|Which rock gives off gas (CO₂) with dilute hydrochloric acid?|滴上稀盐酸会产生气体（二氧化碳）的岩石是？","石灰岩|Limestone|石灰岩",
    [["チャート|Chert|燧石","チャートは塩酸と反応せず、とてもかたい岩石です。|Chert doesn't react and is very hard.|燧石不和盐酸反应，非常坚硬。"],["花こう岩|Granite|花岗岩","花こう岩は火成岩で、塩酸で気体は出ません。|Granite is igneous; no gas.|花岗岩是火成岩，滴盐酸不会产生气体。"],["凝灰岩|Tuff|凝灰岩","凝灰岩は火山灰が固まった岩石です。|Tuff is hardened volcanic ash.|凝灰岩是火山灰凝固的岩石。"]],
    "石灰岩：塩酸で二酸化炭素が出る。チャート：反応しない・鉄のくぎで伤がつかないほどかたい。|Limestone fizzes (CO₂) in acid. Chert doesn't, and is too hard to scratch with an iron nail.|石灰岩：遇盐酸产生二氧化碳。燧石：不反应，硬到铁钉也刮不出痕迹。"),
  Q("堆积岩の粒が丸みをおびているのはなぜ？|Why are the grains in sedimentary rock rounded?|沉积岩的颗粒为什么是圆的？","流れる水に运ばれる间にけずられたから|They were worn down while carried by water|被流水搬运时磨圆了",
    [["マグマが冷えて固まったから|Magma cooled|岩浆冷却凝固","マグマからできるのは火成岩で、粒は角ばっています。|Igneous rocks from magma have angular grains.|岩浆形成的是火成岩，颗粒有棱角。"],["生物がつくったから|Living things made them|生物制造的","丸みは水に运ばれたしるしです。|Roundness shows transport by water.|圆滑是被水搬运的证据。"],["はじめから丸かったから|They were always round|本来就是圆的","川を流れる间にぶつかり合ってけずられます。|They collide and wear down in rivers.|在河中互相碰撞而被磨圆。"]],
    "堆积岩の粒は流水で运ばれて丸い。火山灰がもとの凝灰岩や火成岩の粒は角ばっている。|Sedimentary grains are rounded by water; tuff and igneous grains are angular.|沉积岩颗粒因流水搬运而圆滑；凝灰岩、火成岩颗粒有棱角。"),
  Q("离れた场所の地层を比べるとき、目印（かぎ层）になりやすい层は？|Which layer is a good key bed for matching distant strata?|比较不同地点的地层时，容易成为标准层（键层）的是？","火山灰の层（凝灰岩）|A volcanic ash layer (tuff)|火山灰层（凝灰岩）",
    [["泥の层|A mud layer|泥层","泥の层は多くの时代・场所にあり、目印になりにくいです。|Mud layers are common, so hard to match.|泥层在许多时代、地点都有，不易当标记。"],["砂の层|A sand layer|砂层","砂の层もいろいろな所にあります。|Sand layers are common too.|砂层也到处都有。"],["表面の土|Topsoil|表土","表面の土は地层を比べる目印になりません。|Topsoil isn't a marker.|表土不能当比较地层的标记。"]],
    "火山灰は短い期间に広い范囲に积もるので、かぎ层になる。|Ash falls widely in a short time, making a key bed.|火山灰在短时间内广泛堆积，所以能当键层。"),
];

// 大地の変动：断层としゅう曲
const FIG_FAULT=(()=>{ let b=""; // A：正断层（引っぱる力）
  for(let i=0;i<4;i++){ b+=`<polygon points="10,${24+i*14} 62,${24+i*14} ${62+7},${38+i*14} 10,${38+i*14}" class="${i%2?"ac":"bx"}"/>`; b+=`<polygon points="${66+4},${40+i*14} 122,${40+i*14} 122,${54+i*14} ${66+11},${54+i*14}" class="${i%2?"ac":"bx"}"/>`; }
  b+=L(60,14,84,96,"o")+AR(30,104,4,104,"k")+AR(100,104,126,104,"k")+T(66,124,"A");
  // B：逆断层（おす力）
  for(let i=0;i<4;i++){ b+=`<polygon points="150,${40+i*14} ${200},${40+i*14} ${200+7},${54+i*14} 150,${54+i*14}" class="${i%2?"ac":"bx"}"/>`; b+=`<polygon points="${204+4},${24+i*14} 262,${24+i*14} 262,${38+i*14} ${204+11},${38+i*14}" class="${i%2?"ac":"bx"}"/>`; }
  b+=L(198,14,222,96,"o")+AR(144,104,170,104,"k")+AR(268,104,242,104,"k")+T(206,124,"B");
  // C：しゅう曲
  for(let i=0;i<4;i++) b+=`<path d="M290 ${40+i*14} Q320 ${10+i*14} 350 ${40+i*14} Q380 ${70+i*14} 410 ${40+i*14}" class="${i%2?"ln":"o"}"/>`;
  b+=AR(284,104,308,104,"k")+AR(416,104,392,104,"k")+T(350,124,"C"); return SV(420,132,b); })();
const earth4=[
  Q("図の A の断层は、どんな力ではたらいてできた？（矢印は力の向き）|What force made fault A? (arrows show the force)|图中 A 的断层是受什么力形成的？（箭头为力的方向）","左右に引っぱる力|Pulling apart|向左右拉扯的力",
    [["左右からおす力|Pushing together|从左右推挤的力","おす力でできるのは B のような断层（逆断层）です。|Pushing makes faults like B (reverse faults).|推挤形成的是像 B 的断层（逆断层）。"],["下から持ち上げる力だけ|Only lifting from below|只有从下面擡起的力","矢印の向きを见よう。左右に引っぱられています。|See the arrows: it is pulled apart.|看箭头方向，是向左右拉。"],["力ははたらいていない|No force|没有受力","地层がずれるには大きな力が必要です。|Strata only slip under big forces.|地层要错动需要很大的力。"]],
    "引っぱる力 → 正断层（A）。おす力 → 逆断层（B）・しゅう曲（C）。|Pulling → normal fault (A). Pushing → reverse fault (B), folds (C).|拉张力 → 正断层（A）；挤压力 → 逆断层（B）、褶皱（C）。",FIG_FAULT),
  Q("図の C のように、地层が波打つように曲がったものを何という？|What is it called when strata bend like C?|像图中 C 那样地层弯曲成波浪状，叫做？","しゅう曲|Fold|褶皱",
    [["断层|Fault|断层","断层は地层が切れてずれたもの（A・B）です。|A fault is a break with slip (A, B).|断层是地层断开并错动（A、B）。"],["不集成|Unconformity|不集成","不集成は地层の重なりが途中でとぎれた面です。|An unconformity is a gap in the layers.|不集成是地层堆积中断的面。"],["柱状図|Columnar section|地层柱状图","柱状図は地层の重なりを表した図です。|A columnar section is a diagram of layers.|地层柱状图是表示地层堆栈的图。"]],
    "しゅう曲：左右からおす大きな力で、地层が曲がったもの。|Fold: strata bent by strong pushing from both sides.|褶皱：地层受到两侧强大挤压力而弯曲。",FIG_FAULT),
  Q("山の上の地层から海の生物の化石が见つかるのはなぜ？|Why are sea fossils found in strata on mountains?|山上的地层为什么会找到海洋生物的化石？","海底でできた地层が隆起したから|Seafloor strata were uplifted|海底形成的地层隆起了",
    [["海の生物が山に登ったから|Sea animals climbed up|海洋生物爬上山","化石の生物は海でくらしていました。|Those animals lived in the sea.|化石生物原本生活在海里。"],["大地が沈降したから|The land sank|大地沉降","沈降では地层は低くなります。|Sinking makes strata lower.|沉降会让地层变低。"],["雨で运ばれたから|Rain carried them up|被雨水搬上去","雨は高い所へ物を运びません。|Rain doesn't carry things uphill.|雨水不会把东西搬到高处。"]],
    "大地が持ち上がる＝隆起、しずむ＝沈降。海でできた地层が隆起すると陆や山になる。|Uplift raises land; subsidence lowers it. Uplifted seafloor becomes land or mountains.|大地擡升＝隆起，下沉＝沉降；海中形成的地层隆起后变成陆地或山。"),
  Q("海岸ぞいに阶段のような地形（海岸段丘）ができるのは？|Stepped coastal terraces form when…|沿着海岸形成阶梯状地形（海阶）是因为？","大地の隆起が何度かくり返されたから|Uplift happened several times|大地多次隆起",
    [["大地が沈降したから|The land sank|大地沉降","沈降すると谷に海水が入りこみ、入り组んだ海岸（リアス海岸）になります。|Sinking floods valleys into a ria coast.|沉降会让海水进入山谷，形成曲折的海岸（谷湾海岸）。"],["火山が喷火したから|A volcano erupted|火山喷发","段丘は海の波がけずった平らな面が持ち上がったものです。|Terraces are wave-cut flats that were raised.|海阶是被海浪侵蚀的平面被擡升形成的。"],["川が土砂を运んだから|Rivers brought sediment|河流搬运泥沙","川の土砂が积もってできるのは三角州などです。|River sediment builds deltas.|河流泥沙堆积形成的是三角洲等。"]],
    "海岸段丘＝隆起のくり返し。リアス海岸＝沈降。|Coastal terraces = repeated uplift. Ria coast = subsidence.|海阶＝多次隆起；谷湾海岸＝沉降。"),
  Q("火山がもたらす「めぐみ」はどれ？|Which is a benefit (blessing) from volcanoes?|火山带来的「恩惠」是？","温泉や地热発电|Hot springs and geothermal power|温泉和地热发电",
    [["火砕流|Pyroclastic flows|火山碎屑流","火砕流は高温のガスと火山灰が流れ下る灾害です。|Pyroclastic flows are deadly hot clouds.|火山碎屑流是高温气体和火山灰往下流的灾害。"],["液状化|Liquefaction|土壤液化","液状化は地震で地面が液体のようになる灾害です。|Liquefaction is a quake hazard.|土壤液化是地震时地面像液体一样的灾害。"],["津波|Tsunami|海啸","津波は地震などで起こる灾害です。|Tsunamis are disasters.|海啸是地震等引起的灾害。"]],
    "めぐみ：温泉・地热発电・美しい景観・豊かな地下水。灾害：火砕流・火山灰・溶岩流。|Benefits: hot springs, geothermal power, scenery, groundwater. Hazards: pyroclastic flows, ash, lava.|恩惠：温泉、地热发电、美景、丰富地下水；灾害：火山碎屑流、火山灰、熔岩流。"),
  Q("地震のときに、うめ立て地などで地面が液体のようになる现象は？|In a quake, ground on reclaimed land behaving like liquid is called…|地震时，填海地等地面变得像液体一样的现象叫做？","液状化|Liquefaction|土壤液化",
    [["隆起|Uplift|隆起","隆起は大地が持ち上がることです。|Uplift is land rising.|隆起是大地擡升。"],["しゅう曲|Folding|褶皱","しゅう曲は地层が曲がることです。|Folding is strata bending.|褶皱是地层弯曲。"],["风化|Weathering|风化","风化は岩石がもろくなることです。|Weathering is rocks breaking down.|风化是岩石变得脆弱。"]],
    "液状化：水をふくむ砂の地面がゆれで液体のようになる。ハザードマップで危険な场所を确かめる。|Liquefaction: wet sandy ground turns liquid-like. Check hazard maps.|土壤液化：含水的砂质地面因摇晃变得像液体。用灾害潜势图确认危险地点。"),
  Q("ずれた迹があり、今后もずれて地震を起こす可能性がある断层を何という？|A fault that may slip again and cause quakes is called…|有错动痕迹、今后仍可能错动引发地震的断层叫做？","活断层|Active fault|活断层",
    [["正断层|Normal fault|正断层","正断层は引っぱる力でできた断层の种类です。|A normal fault is a type, from pulling.|正断层是拉张力形成的断层种类。"],["逆断层|Reverse fault|逆断层","逆断层はおす力でできた断层の种类です。|A reverse fault is a type, from pushing.|逆断层是挤压力形成的断层种类。"],["しゅう曲|Fold|褶皱","しゅう曲は地层が曲がったものです。|A fold is bent strata.|褶皱是地层弯曲。"]],
    "活断层：くり返しずれてきた断层で、これからも地震を起こすおそれがある。|Active fault: has slipped repeatedly and may again.|活断层：曾反复错动，今后仍可能引发地震。"),
];
/* ========== なかま分け（2つのなかまにすばやく分ける） ========== */
const SORTS=[
  ["被子植物|Angiosperms|被子植物","裸子植物|Gymnosperms|裸子植物",[["アブラナ|Rapeseed|油菜",0],["サクラ|Cherry|樱花",0],["エンドウ|Pea|豌豆",0],["イネ|Rice|稻",0],["ユリ|Lily|百合",0],["マツ|Pine|松",1],["イチョウ|Ginkgo|银杏",1],["スギ|Japanese cedar|日本柳杉",1,"スギは种子をつくる裸子植物（スギゴケとはちがう）。|Cedar is a seed-making gymnosperm (not haircap moss).|柳杉是会产生种子的裸子植物（和杉叶藓不同）。"],["ソテツ|Cycad|苏铁",1],["ヒノキ|Japanese cypress|日本扁柏",1]]],
  ["単子叶类|Monocots|单子叶植物","双子叶类|Dicots|双子叶植物",[["イネ|Rice|稻",0],["トウモロコシ|Corn|玉米",0],["ユリ|Lily|百合",0],["ツユクサ|Dayflower|鸭跖草",0],["ネギ|Green onion|葱",0],["アブラナ|Rapeseed|油菜",1],["タンポポ|Dandelion|蒲公英",1],["アサガオ|Morning glory|牵牛花",1],["エンドウ|Pea|豌豆",1],["ヒマワリ|Sunflower|向日葵",1]]],
  ["合弁花类|Fused petals|合瓣花类","离弁花类|Free petals|离瓣花类",[["アサガオ|Morning glory|牵牛花",0],["ツツジ|Azalea|杜鹃",0],["タンポポ|Dandelion|蒲公英",0],["ヒマワリ|Sunflower|向日葵",0],["アブラナ|Rapeseed|油菜",1],["サクラ|Cherry|樱花",1],["エンドウ|Pea|豌豆",1],["バラ|Rose|玫瑰",1],["ホウセンカ|Garden balsam|凤仙花",1]]],
  ["脊椎动物|Vertebrates|脊椎动物","无脊椎动物|Invertebrates|无脊椎动物",[["メダカ|Medaka fish|青鳉鱼",0],["カエル|Frog|青蛙",0],["トカゲ|Lizard|蜥蜴",0],["ハト|Pigeon|鸽子",0],["クジラ|Whale|鲸鱼",0],["バッタ|Grasshopper|蝗虫",1],["カニ|Crab|螃蟹",1],["イカ|Squid|乌贼",1,"イカは软体动物で背骨がない。|Squid is a mollusk with no backbone.|乌贼是软件动物，没有脊椎骨。"],["クモ|Spider|蜘蛛",1],["ミミズ|Earthworm|蚯蚓",1]]],
  ["卵生|Lays eggs|卵生","胎生|Live birth|胎生",[["メダカ|Medaka fish|青鳉鱼",0],["カエル|Frog|青蛙",0],["ヘビ|Snake|蛇",0],["ペンギン|Penguin|企鹅",0,"ペンギンは鸟类なので卵生。|Penguins are birds: they lay eggs.|企鹅是鸟类，所以是卵生。"],["カメ|Turtle|龟",0],["イヌ|Dog|狗",1],["クジラ|Whale|鲸鱼",1,"クジラは哺乳类なので胎生。|Whales are mammals: live birth.|鲸鱼是哺乳类，所以是胎生。"],["コウモリ|Bat|蝙蝠",1,"コウモリは空を飞ぶが哺乳类。|Bats fly but are mammals.|蝙蝠会飞，但是哺乳类。"],["ウマ|Horse|马",1],["ヒト|Human|人类",1]]],
  ["有机物|Organic|有机物","无机物|Inorganic|无机物",[["砂糖|Sugar|砂糖",0],["デンプン|Starch|淀粉",0],["ロウ|Wax|蜡",0],["プラスチック|Plastic|塑料",0],["エタノール|Ethanol|乙醇",0],["食塩|Salt|食盐",1],["ガラス|Glass|玻璃",1],["鉄|Iron|铁",1],["水|Water|水",1],["二酸化炭素|Carbon dioxide|二氧化碳",1,"二酸化炭素は炭素をふくむが无机物として扱う。|CO₂ contains carbon but is treated as inorganic.|二氧化碳含碳，但归类为无机物。"]]],
  ["金属|Metal|金属","金属でない|Not metal|非金属",[["鉄|Iron|铁",0],["铜|Copper|铜",0],["アルミニウム|Aluminum|铝",0],["金|Gold|金",0],["水银|Mercury|水银",0,"水银は常温で液体の金属。|Mercury is a metal that is liquid at room temperature.|水银是常温下呈液态的金属。"],["ガラス|Glass|玻璃",1],["プラスチック|Plastic|塑料",1],["木|Wood|木头",1],["ゴム|Rubber|橡胶",1],["食塩|Salt|食盐",1]]],
  ["纯物质|Pure substance|纯物质","混合物|Mixture|混合物",[["水|Water|水",0],["酸素|Oxygen|氧气",0],["鉄|Iron|铁",0],["エタノール|Ethanol|乙醇",0],["塩化ナトリウム|Sodium chloride|氯化钠",0],["空気|Air|空气",1,"空気は窒素・酸素などの混合物。|Air is a mix of nitrogen, oxygen, etc.|空气是氮气、氧气等的混合物。"],["海水|Seawater|海水",1],["食塩水|Salt water|食盐水",1],["牛乳|Milk|牛奶",1],["花こう岩|Granite|花岗岩",1,"岩石はいろいろな鉱物の混合物。|Rocks are mixtures of minerals.|岩石是多种矿物的混合物。"]]],
  ["火山岩|Volcanic rock|火山岩","深成岩|Plutonic rock|深成岩",[["流纹岩|Rhyolite|流纹岩",0],["安山岩|Andesite|安山岩",0],["玄武岩|Basalt|玄武岩",0],["斑状组织|Porphyritic texture|斑状组织",0],["地表近くで急に冷えた|Cooled fast near the surface|在地表附近快速冷却",0],["花こう岩|Granite|花岗岩",1],["せん绿岩|Diorite|闪长岩",1],["斑れい岩|Gabbro|辉长岩",1],["等粒状组织|Equigranular texture|等粒状组织",1],["地下深くでゆっくり冷えた|Cooled slowly deep underground|在地下深处慢慢冷却",1]]],
  ["示相化石|Facies fossil|指相化石","示准化石|Index fossil|标准化石",[["サンゴ|Coral|珊瑚",0,"サンゴはあたたかく浅い海を示す。|Coral shows a warm, shallow sea.|珊瑚表示温暖的浅海。"],["シジミ|Shijimi clam|蚬",0,"シジミは河口や湖を示す。|Shijimi shows a river mouth or lake.|蚬表示河口或湖泊。"],["ブナの叶|Beech leaf|山毛榉的叶",0],["三叶虫|Trilobite|三叶虫",1],["フズリナ|Fusulinid|纺锤虫",1],["アンモナイト|Ammonite|菊石",1],["恐竜|Dinosaur|恐龙",1],["ビカリア|Vicarya|维卡里亚螺",1],["ナウマンゾウ|Naumann's elephant|诺氏古菱齿象",1]]],
  ["有色鉱物|Dark mineral|有色矿物","无色鉱物|Light mineral|无色矿物",[["クロウンモ|Biotite|黑云母",0],["カクセン石|Hornblende|角闪石",0],["キ石|Pyroxene|辉石",0],["カンラン石|Olivine|橄榄石",0],["磁鉄鉱|Magnetite|磁铁矿",0],["セキエイ|Quartz|石英",1],["チョウ石|Feldspar|长石",1]]],
  ["反射|Reflection|反射","屈折|Refraction|折射",[["镜に自分の姿がうつる|You see yourself in a mirror|在镜子里看到自己",0],["水面に景色がうつる|Scenery mirrored on water|水面映出景色",0],["光ファイバーで光が进む|Light travels in an optical fiber|光在光纤中前进",0,"光ファイバーは全反射を利用している。|Optical fibers use total internal reflection.|光纤利用全反射。"],["ものが见える（乱反射）|Seeing objects (diffuse light)|看得见物体（漫反射）",0],["コップのストローが折れて见える|A straw looks bent in a glass|杯中吸管看起来折断",1],["水中のコインが浮いて见える|A coin underwater looks raised|水中的硬币看起来浮起",1],["虫めがねで大きく见える|A magnifier makes things bigger|放大镜让东西变大",1],["プリズムで光が色に分かれる|A prism splits light into colors|三棱镜把光分成颜色",1]]],
  ["はなれていてもはたらく|Acts at a distance|不接触也能作用","ふれてはたらく|Acts by contact|接触才能作用",[["重力|Gravity|重力",0],["磁石の力|Magnetic force|磁力",0],["电気の力|Electric force|电力",0],["摩擦力|Friction|摩擦力",1],["弾性力|Elastic force|弹力",1],["垂直抗力|Normal force|正向力",1],["手でおす力|Pushing by hand|用手推的力",1]]],
];

/* ========== 単元 ========== */
const units=[
 {id:"bio",s:"sci",g:"life",n:{ja:"いろいろな生物",en:"Living things","zh-Hant":"各种生物"},gr:"1",k:"math",ref:X("第2分野(1) いろいろな生物とその共通点|Field 2 (1) Diversity of living things|第2领域(1) 各种生物及其共同点"),
  parts:[1,2,3,4,5],pn:{1:X("観察器具（顕微镜・ルーペ）|Microscopes & hand lenses|观察器材（显微镜、放大镜）"),2:X("花のつくり|Parts of a flower|花的构造"),3:X("种子植物の分类|Classifying seed plants|种子植物的分类"),4:X("种子をつくらない植物|Plants without seeds|不产生种子的植物"),5:X("动物の分类|Classifying animals|动物的分类")},
  sk:{1:bioMic,2:bioFlower,3:bioClass,4:bioSpore,5:bioAnimal}},
 {id:"mat",s:"sci",g:"part",n:{ja:"身の回りの物质",en:"Materials around us","zh-Hant":"身边的物质"},gr:"1",k:"math",ref:X("第1分野(2) 身の回りの物质|Field 1 (2) Materials around us|第1领域(2) 身边的物质"),
  parts:[1,2,3,4,5],pn:{1:X("物质の区别|Telling substances apart|物质的区别"),2:X("密度|Density|密度"),3:X("気体の性质|Properties of gases|气体的性质"),4:X("水溶液（浓度・溶解度）|Solutions (concentration, solubility)|水溶液（浓度、溶解度）"),5:X("状态変化|Changes of state|状态变化")},
  sk:{1:mat1,2:mat2,3:mat3,4:mat4,5:mat5}},
 {id:"phys",s:"sci",g:"ene",n:{ja:"光・音・力",en:"Light, sound & force","zh-Hant":"光、声音与力"},gr:"1",k:"math",ref:X("第1分野(1) 身近な物理现象|Field 1 (1) Everyday physics|第1领域(1) 身边的物理现象"),
  parts:[1,2,3,4,5],pn:{1:X("光の反射と屈折|Reflection & refraction|光的反射与折射"),2:X("凸レンズ|Convex lenses|凸透镜"),3:X("音|Sound|声音"),4:X("力と重さ・质量|Forces, weight & mass|力与重量、质量"),5:X("ばね・2力のつり合い|Springs & balanced forces|弹簧、两力平衡")},
  sk:{1:phys1,2:phys2,3:phys3,4:phys4,5:phys5}},
 {id:"earth",s:"sci",g:"earth",n:{ja:"大地の変化",en:"The changing Earth","zh-Hant":"大地的变化"},gr:"1",k:"math",ref:X("第2分野(2) 大地の成り立ちと変化|Field 2 (2) How the land forms and changes|第2领域(2) 大地的形成与变化"),
  parts:[1,2,3,4],pn:{1:X("火山と火成岩|Volcanoes & igneous rocks|火山与火成岩"),2:X("地震|Earthquakes|地震"),3:X("地层と化石|Strata & fossils|地层与化石"),4:X("大地の変动と灾害|Crustal movement & disasters|地壳变动与灾害")},
  sk:{1:earth1,2:earth2,3:earth3,4:earth4}},
 {id:"sort",s:"sci",g:"sort",n:{ja:"なかま分け",en:"Sort it!","zh-Hant":"分类游戏"},gr:"1",k:"math",ref:X("中1理科の全単元から|From all Grade 7 science units|国一自然全部单元"),
  parts:SORTS.map((_,i)=>i+1),pn:Object.fromEntries(SORTS.map(([a,b],i)=>[i+1,`${X(a)} / ${X(b)}`])),sk:Object.fromEntries(SORTS.map(([a,b,it],i)=>[i+1,SORT(a,b,it)]))},
];
// 问题を作る（MATH.make と同じ。変な选択肢が出ないよう作り直しつき）
function make(fn){ for(let i=0;i<20;i++){ try{ const g=fn(); if(g&&(g.opts||g.wrongs.length>=3)&&!g.wrongs.some(w=>w.v===g.ans)) return g; }catch(e){} } return fn(); }
return {units,make};
})();
