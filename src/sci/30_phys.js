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
