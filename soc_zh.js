/* 45 Study 社会（tools/build.py が src/soc/*.js から作る。直接编集しない） */
/* 45 Study 社会：问题をその场で作る（时差・対せき点の数字は毎回かわる）。tools/build.py が src/soc/*.js をつなげて soc.js を作る。
   単元の并び：中学校学习指导要领（平成29年告示）社会 地理的分野 A(1)・B(1)(2)、歴史的分野 B(1)(2)（中1でよく学ぶ范囲：世界と日本の姿 → 世界の诸地域、古代 → 中世）
   ことば：文は "日本语|English|繁体中文" の3つを | でつなげて书き、X() で今の言语を取り出す。简体字は build.py が soc.js 全体を変换して soc_zh.js を作る。
   gen() が返すもの：{ q:问题, ans:答え, wrongs:[{v,why}], exp:解き方, tf:v=>○×の文, kind } （SCI・MATH と同じ形）
   表から作る问题（TB）は、组み合わせカードの组（PAIRS）とも同じ表を使う。 */
const SOC=(()=>{
const LG=(()=>{ let l=null; try{ l=JSON.parse(localStorage.getItem("s_lang")); }catch(e){} if(!l){ const n=(navigator.language||"ja").toLowerCase(); l=n.startsWith("zh")?"zh":n.startsWith("ja")?"ja":"en"; } return {ja:0,en:1,"zh-Hant":2,zh:2}[l]??1; })();
const X=s=>{ if(typeof s!=="string") return s; const a=s.split("|"); return a.length===3?a[LG]:s; };
const R=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const LET="ABCDEF";
/* 図 */
const SV=(w,h,body)=>`<svg class="fig" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
const T=(x,y,s,c="lb",a="middle")=>`<text x="${x}" y="${y}" class="${c}" text-anchor="${a}">${s}</text>`;
const L=(x1,y1,x2,y2,c="k")=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${c}"/>`;
/* 文の问题：[问题, 答え, [[误答,理由]×3], 解き方, 図] → 问题を作る関数 */
function Q(q,ans,ws,exp,fig){ return ()=>{ const qq=X(q)+(fig?(typeof fig==="function"?fig():fig):""); return {q:qq,ans:X(ans),wrongs:ws.map(([v,why])=>({v:X(v),why:X(why)})),exp:X(exp),tf:v=>`${qq}<br>→ ${v}`,kind:fig?"fig":"word"}; }; }
/* 表から问题：rows=[[A,B,ひとこと?]]。ab＝A を见て B を答える问い、ba＝B を见て A を答える问い（どちらかは null でよい）。
   why＝その行の A と B の関系を言う文（{a}{b} に入れる）。误答の理由はその误答の行の why、解き方は正解の行の why（＋ひとこと）。
   同じ B の行がいくつかあってもよい（B→A の问いでは、同じ B の行は误答に使わない） */
function TB(rows,ab,ba,why){ const out=[]; const fill=(s,r)=>X(s).replace(/\{a\}/g,X(r[0])).replace(/\{b\}/g,X(r[1]));
  const exp=r=>fill(why,r)+(r[2]?" "+X(r[2]):"");
  rows.forEach(r=>{
    if(ab) out.push(()=>{ const q=fill(ab,r),ans=X(r[1]),seen=new Set([ans]),ws=[];
      for(const x of shuf(rows)){ if(ws.length>=3) break; const v=X(x[1]); if(seen.has(v)) continue; seen.add(v); ws.push({v,why:fill(why,x)}); }
      return {q,ans,wrongs:ws,exp:exp(r),tf:v=>`${q}<br>→ ${v}`,kind:"word"}; });
    if(ba) out.push(()=>{ const q=fill(ba,r),ans=X(r[0]),seen=new Set([ans]),ws=[];
      for(const x of shuf(rows)){ if(ws.length>=3) break; const v=X(x[0]); if(X(x[1])===X(r[1])||seen.has(v)) continue; seen.add(v); ws.push({v,why:fill(why,x)}); }
      return {q,ans,wrongs:ws,exp:exp(r),tf:v=>`${q}<br>→ ${v}`,kind:"word"}; }); });
  return out; }
/* ========== ① 世界の姿（地理的分野 A(1)・B(1)） ========== */
/* Part1 大陆と海洋・6つの州 */
const w1=[
  Q("いちばん面积が大きい大陆は？|Which is the largest continent?|面积最大的大陆是？","ユーラシア大陆|Eurasia|欧亚大陆",
    [["アフリカ大陆|Africa|非洲大陆","アフリカ大陆は2番目に大きい大陆です。|Africa is the 2nd largest.|非洲大陆是第2大的大陆。"],["北アメリカ大陆|North America|北美洲大陆","北アメリカ大陆は3番目です。|North America is 3rd.|北美洲大陆是第3大。"],["南极大陆|Antarctica|南极大陆","南极大陆は5番目で、6大陆でいちばん小さいのはオーストラリア大陆です。|Antarctica is 5th; Australia is the smallest.|南极大陆是第5大；六大陆中最小的是澳洲大陆。"]],
    "6大陆：ユーラシア・アフリカ・北アメリカ・南アメリカ・南极・オーストラリア（大きい顺）。|Six continents, largest first: Eurasia, Africa, N. America, S. America, Antarctica, Australia.|六大陆（由大到小）：欧亚、非洲、北美洲、南美洲、南极、澳洲。"),
  Q("いちばん面积が大きい海洋は？|Which is the largest ocean?|面积最大的海洋是？","太平洋|Pacific Ocean|太平洋",
    [["大西洋|Atlantic Ocean|大西洋","大西洋は2番目に大きい海洋です。|The Atlantic is 2nd.|大西洋是第2大。"],["インド洋|Indian Ocean|印度洋","インド洋は三大洋の3番目です。|The Indian Ocean is 3rd.|印度洋是三大洋中第3。"],["地中海|Mediterranean Sea|地中海","地中海は三大洋ではなく、ヨーロッパとアフリカの间の海です。|The Mediterranean isn't one of the three oceans.|地中海不是三大洋，是欧洲与非洲之间的海。"]],
    "三大洋：太平洋・大西洋・インド洋（大きい顺）。|Three oceans: Pacific, Atlantic, Indian (largest first).|三大洋：太平洋、大西洋、印度洋（由大到小）。"),
  Q("地球の表面の、陆地と海洋の面积の割合は？|Land : ocean on Earth's surface is about…|地球表面陆地与海洋的面积比例约为？","陆地 3：海洋 7|3 : 7|陆地 3：海洋 7",
    [["陆地 5：海洋 5|5 : 5|陆地 5：海洋 5","海洋のほうがずっと広いです。|The ocean is much larger.|海洋大得多。"],["陆地 7：海洋 3|7 : 3|陆地 7：海洋 3","陆地と海洋が逆です。|Land and ocean are reversed.|陆地和海洋相反了。"],["陆地 1：海洋 9|1 : 9|陆地 1：海洋 9","陆地はおよそ3割あります。|Land is about 30%.|陆地约占3成。"]],
    "地球の表面の约7割が海洋（「水の惑星」）。|About 70% of the surface is ocean.|地球表面约7成是海洋。"),
  Q("6つの州のうち、日本がふくまれる州は？|Which of the six regions is Japan in?|六个洲中，日本属于哪一洲？","アジア州|Asia|亚洲",
    [["オセアニア州|Oceania|大洋洲","オセアニア州はオーストラリアや太平洋の岛々です。|Oceania is Australia and Pacific islands.|大洋洲是澳洲与太平洋岛屿。"],["ヨーロッパ州|Europe|欧洲","ヨーロッパ州はユーラシア大陆の西の部分です。|Europe is the west of Eurasia.|欧洲是欧亚大陆的西部。"],["北アメリカ州|North America|北美洲","北アメリカ州は太平洋をはさんだ东侧です。|North America is across the Pacific.|北美洲在太平洋的另一侧。"]],
    "6州：アジア・ヨーロッパ・アフリカ・北アメリカ・南アメリカ・オセアニア。日本はアジア州（东アジア）。|Six regions: Asia, Europe, Africa, N. America, S. America, Oceania. Japan is in Asia (East Asia).|六洲：亚洲、欧洲、非洲、北美洲、南美洲、大洋洲。日本属于亚洲（东亚）。"),
  Q("6つの州のどれにもふくまれない大陆は？|Which continent belongs to none of the six regions?|不属于六个洲中任何一洲的大陆是？","南极大陆|Antarctica|南极大陆",
    [["オーストラリア大陆|Australia|澳洲大陆","オーストラリア大陆はオセアニア州です。|Australia is in Oceania.|澳洲大陆属于大洋洲。"],["ユーラシア大陆|Eurasia|欧亚大陆","ユーラシア大陆はアジア州とヨーロッパ州に分かれます。|Eurasia is split into Asia and Europe.|欧亚大陆分为亚洲和欧洲。"],["アフリカ大陆|Africa|非洲大陆","アフリカ大陆はアフリカ州です。|Africa is the Africa region.|非洲大陆属于非洲。"]],
    "南极大陆は国のない大陆で、6つの州には入れません。|Antarctica has no countries and isn't one of the six regions.|南极大陆没有国家，不列入六洲。"),
  Q("ユーラシア大陆は、アジア州と何州に分けられる？|Eurasia is divided into Asia and…|欧亚大陆分为亚洲和哪一洲？","ヨーロッパ州|Europe|欧洲",
    [["アフリカ州|Africa|非洲","アフリカ州はアフリカ大陆です。|Africa is its own continent.|非洲是非洲大陆。"],["オセアニア州|Oceania|大洋洲","オセアニア州はオーストラリア大陆と太平洋の岛々です。|Oceania is Australia and islands.|大洋洲是澳洲大陆与太平洋岛屿。"],["北アメリカ州|North America|北美洲","北アメリカ州は北アメリカ大陆です。|North America is its own continent.|北美洲是北美洲大陆。"]],
    "ユーラシア大陆＝アジア州（东）＋ヨーロッパ州（西）。境はウラル山脉など。|Eurasia = Asia (east) + Europe (west), divided at the Urals, etc.|欧亚大陆＝亚洲（东）＋欧洲（西），以乌拉山脉等为界。"),
  Q("面积が世界でいちばん大きい国は？|Which country has the largest area?|面积世界最大的国家是？","ロシア|Russia|俄罗斯",
    [["カナダ|Canada|加拿大","カナダは2番目に大きい国です。|Canada is 2nd.|加拿大是第2大。"],["中国|China|中国","中国も大きいですが、ロシアの半分くらいです。|China is big, but about half of Russia.|中国也很大，但约为俄罗斯的一半。"],["アメリカ合众国|United States|美国","アメリカ合众国はロシアの6割ほどです。|The U.S. is about 60% of Russia.|美国约为俄罗斯的6成。"]],
    "ロシアは日本の约45倍の面积で、ヨーロッパ州とアジア州にまたがります。|Russia is about 45 times Japan, spanning Europe and Asia.|俄罗斯面积约为日本的45倍，横跨欧洲与亚洲。"),
  Q("面积が世界でいちばん小さい国は？|Which country is the smallest in area?|面积世界最小的国家是？","バチカン市国|Vatican City|梵蒂冈",
    [["モナコ|Monaco|摩纳哥","モナコは2番目に小さい国です。|Monaco is 2nd smallest.|摩纳哥是第2小。"],["シンガポール|Singapore|新加坡","シンガポールは东京23区と同じくらいの大きさです。|Singapore is about the size of Tokyo's 23 wards.|新加坡与东京23区差不多大。"],["ルクセンブルク|Luxembourg|卢森堡","ルクセンブルクは神奈川県くらいの大きさです。|Luxembourg is about Kanagawa's size.|卢森堡约与神奈川县一样大。"]],
    "バチカン市国はイタリアのローマ市内にあり、カトリックの中心です。|Vatican City is inside Rome, the center of the Catholic Church.|梵蒂冈位于意大利罗马市内，是天主教的中心。"),
  Q("海に面していない国（内陆国）は？|Which country is landlocked?|哪一个是不临海的国家（内陆国）？","モンゴル|Mongolia|蒙古",
    [["イギリス|United Kingdom|英国","イギリスは海に囲まれた岛国です。|The UK is an island country.|英国是被海包围的岛国。"],["チリ|Chile|智利","チリは太平洋に面した、南北に细长い国です。|Chile is long and faces the Pacific.|智利是面向太平洋、南北狭长的国家。"],["日本|Japan|日本","日本は海に囲まれた岛国です。|Japan is an island country.|日本是被海包围的岛国。"]],
    "内陆国：モンゴル・スイス・ボリビアなど。岛国：日本・イギリス・ニュージーランドなど。|Landlocked: Mongolia, Switzerland, Bolivia. Island countries: Japan, UK, New Zealand.|内陆国：蒙古、瑞士、玻利维亚等；岛国：日本、英国、新西兰等。"),
  Q("まわりを海に囲まれた国（岛国）は？|Which is an island country?|哪一个是四面环海的国家（岛国）？","ニュージーランド|New Zealand|新西兰",
    [["スイス|Switzerland|瑞士","スイスは海に面していない内陆国です。|Switzerland is landlocked.|瑞士是不临海的内陆国。"],["ボリビア|Bolivia|玻利维亚","ボリビアは南アメリカの内陆国です。|Bolivia is landlocked in South America.|玻利维亚是南美洲的内陆国。"],["モンゴル|Mongolia|蒙古","モンゴルはロシアと中国にはさまれた内陆国です。|Mongolia is landlocked between Russia and China.|蒙古是夹在俄罗斯与中国之间的内陆国。"]],
    "岛国：日本・イギリス・ニュージーランド・フィリピンなど。|Island countries: Japan, UK, New Zealand, the Philippines, etc.|岛国：日本、英国、新西兰、菲律宾等。"),
  Q("国境に、経线や纬线を利用した直线が多い州は？|Which region has many straight borders along lines of latitude or longitude?|国界多为沿经纬线的直线的是哪一洲？","アフリカ州|Africa|非洲",
    [["ヨーロッパ州|Europe|欧洲","ヨーロッパは山脉や川を国境にしている所が多いです。|Europe often uses mountains and rivers.|欧洲多以山脉、河川为国界。"],["アジア州|Asia|亚洲","アジアは山脉・川などの自然の国境が多いです。|Asia mostly has natural borders.|亚洲多为山脉、河川等自然国界。"],["南アメリカ州|South America|南美洲","南アメリカはアンデス山脉や川を国境にしている所が多いです。|South America often uses the Andes and rivers.|南美洲多以安地斯山脉或河川为国界。"]],
    "アフリカは、ヨーロッパの国々が植民地にしたときに経线・纬线で境を决めたため、直线の国境が多い。|European colonizers drew African borders along latitude and longitude lines.|非洲在被欧洲国家殖民时以经纬线划界，所以直线国界多。"),
  Q("世界の人口の约6割が住んでいる州は？|Which region has about 60% of the world's people?|世界人口约6成居住在哪一洲？","アジア州|Asia|亚洲",
    [["アフリカ州|Africa|非洲","アフリカ州は2番目に人口が多く、いま急に増えています。|Africa is 2nd and growing fast.|非洲人口第2多，目前快速增加。"],["ヨーロッパ州|Europe|欧洲","ヨーロッパ州は世界の约1割です。|Europe is about 10%.|欧洲约占世界的1成。"],["北アメリカ州|North America|北美洲","北アメリカ州は世界の1割にとどきません。|North America is under 10%.|北美洲不到世界的1成。"]],
    "人口が多い国：インド・中国（どちらもアジア州）。|Most populous: India and China (both in Asia).|人口多的国家：印度、中国（都在亚洲）。"),
];
/* Part2 纬度と経度・地図 */
const LATS=(n,s)=>s==="N"?X(`北纬${n}度|${n}°N|北纬${n}度`):X(`南纬${n}度|${n}°S|南纬${n}度`);
const LONS=(n,e)=>e==="E"?X(`东経${n}度|${n}°E|东经${n}度`):X(`西経${n}度|${n}°W|西经${n}度`);
const PT=(a,s,b,e)=>LATS(a,s)+X("・|, |、")+LONS(b,e);
function antipode(){ const la=R(2,13)*5; let lo=R(2,34)*5; if(lo===90) lo=95; const s=pick(["N","S"]),e=pick(["E","W"]),s2=s==="N"?"S":"N",e2=e==="E"?"W":"E",lo2=180-lo;
  const q=X(`地球上で、${PT(la,s,lo,e)}の地点のちょうど反対侧（対せき点）は？|What is the point exactly opposite ${PT(la,s,lo,e)} on the Earth (its antipode)?|地球上与${PT(la,s,lo,e)}正好相反的一点（对跖点）是？`);
  const ans=PT(la,s2,lo2,e2);
  const ws=[{v:PT(la,s,lo2,e2),why:X("纬度は北纬と南纬を入れかえます（数字はそのまま）。|Switch N and S for latitude (same number).|纬度要把北纬、南纬互换（数字不变）。")},
    {v:PT(la,s2,lo,e2),why:X(`経度は 180 から引きます：180−${lo}＝${lo2}。|For longitude, subtract from 180: 180−${lo}=${lo2}.|经度要用180去减：180−${lo}＝${lo2}。`)},
    {v:PT(la,s2,lo2,e),why:X("経度は东経と西経も入れかえます。|Also switch E and W for longitude.|经度也要把东经、西经互换。")}];
  const exp=X(`纬度：${LATS(la,s)} → ${LATS(la,s2)}（北と南を入れかえる）。経度：180−${lo}＝${lo2}、${LONS(lo,e)} → ${LONS(lo2,e2)}（东と西も入れかえる）。|Latitude: ${LATS(la,s)} → ${LATS(la,s2)} (switch N/S). Longitude: 180−${lo}=${lo2}, ${LONS(lo,e)} → ${LONS(lo2,e2)} (switch E/W).|纬度：${LATS(la,s)} → ${LATS(la,s2)}（南北互换）；经度：180−${lo}＝${lo2}，${LONS(lo,e)} → ${LONS(lo2,e2)}（东西也互换）。`);
  return {q,ans,wrongs:ws,exp,tf:v=>`${q}<br>→ ${v}`,kind:"calc"}; }
const w2=[antipode,antipode,antipode,
  Q("纬度0度の纬线を何という？|What is the line of latitude 0° called?|纬度0度的纬线叫做？","赤道|The equator|赤道",
    [["本初子午线|The prime meridian|本初子午线","本初子午线は経度0度の経线です。|The prime meridian is longitude 0°.|本初子午线是经度0度的经线。"],["日付変更线|The date line|国际换日线","日付変更线はほぼ経度180度にそって引かれた线です。|The date line runs roughly along 180°.|国际换日线大致沿经度180度划定。"],["経线|A meridian|经线","経线は北极と南极を结ぶ线です。|Meridians join the North and South Poles.|经线是连接北极与南极的线。"]],
    "赤道（纬度0度）から北が北纬、南が南纬。最大は90度（北极点・南极点）。|North of the equator (0°) is N, south is S; up to 90° at the poles.|赤道（纬度0度）以北为北纬、以南为南纬，最大90度（北极点、南极点）。"),
  Q("経度0度の経线（本初子午线）が通る都市は？|Which city does the prime meridian (0°) pass through?|经度0度的经线（本初子午线）通过哪个城市？","ロンドン|London|伦敦",
    [["パリ|Paris|巴黎","パリはロンドンより少し东です。|Paris is a little east of London.|巴黎在伦敦稍东。"],["ニューヨーク|New York|纽约","ニューヨークは西経约74度です。|New York is about 74°W.|纽约约在西经74度。"],["东京|Tokyo|东京","东京は东経约140度です。|Tokyo is about 140°E.|东京约在东经140度。"]],
    "本初子午线は、イギリスのロンドンにある旧グリニッジ天文台を通る。|The prime meridian passes the old Greenwich Observatory in London.|本初子午线通过英国伦敦的旧格林威治天文台。"),
  Q("纬度は、最大で何度まである？|What is the largest possible latitude?|纬度最大到几度？","90度|90°|90度",
    [["180度|180°|180度","180度まであるのは経度（东経・西経）です。|180° is the maximum longitude.|最大到180度的是经度。"],["360度|360°|360度","360度は地球1周の角度です。|360° is a full circle.|360度是绕地球一圈的角度。"],["45度|45°|45度","北极点・南极点は90度です。|The poles are at 90°.|北极点、南极点是90度。"]],
    "纬度：赤道0度〜北极点・南极点90度。経度：本初子午线0度〜东西それぞれ180度。|Latitude 0° (equator) to 90° (poles); longitude 0° to 180° east or west.|纬度：赤道0度～南北极90度；经度：本初子午线0度～东西各180度。"),
  Q("东西それぞれ、経度は最大で何度まである？|What is the largest longitude, east or west?|东西经度各最大到几度？","180度|180°|180度",
    [["90度|90°|90度","90度まであるのは纬度です。|90° is the maximum latitude.|最大到90度的是纬度。"],["360度|360°|360度","东経と西経を合わせて360度です。|East plus west makes 360°.|东经加西经合计360度。"],["120度|120°|120度","経度は东西それぞれ180度まであります。|Longitude goes to 180° each way.|经度东西各到180度。"]],
    "东経180度と西経180度は同じ経线（ほぼこれにそって日付変更线）。|180°E and 180°W are the same line (the date line roughly follows it).|东经180度与西经180度是同一条经线（国际换日线大致沿此线）。"),
  Q("北极点と南极点を结んだ线を何という？|What are lines joining the North and South Poles called?|连接北极点与南极点的线叫做？","経线|Meridians (lines of longitude)|经线",
    [["纬线|Parallels (lines of latitude)|纬线","纬线は赤道と平行な、东西の线です。|Parallels run east–west, parallel to the equator.|纬线是与赤道平行的东西向线。"],["赤道|The equator|赤道","赤道は纬度0度の纬线です。|The equator is latitude 0°.|赤道是纬度0度的纬线。"],["等高线|Contour lines|等高线","等高线は同じ高さの地点を结んだ线です。|Contours join points of equal height.|等高线是连接相同高度地点的线。"]],
    "経线＝南北の线（経度を表す）。纬线＝东西の线（纬度を表す）。|Meridians run N–S (longitude); parallels run E–W (latitude).|经线＝南北向（表示经度）；纬线＝东西向（表示纬度）。"),
  Q("东京のおよその位置は？|Roughly where is Tokyo?|东京的大约位置是？","北纬36度・东経140度|36°N, 140°E|北纬36度、东经140度",
    [["南纬36度・东経140度|36°S, 140°E|南纬36度、东经140度","日本は赤道より北（北半球）にあります。|Japan is north of the equator.|日本在赤道以北（北半球）。"],["北纬36度・西経140度|36°N, 140°W|北纬36度、西经140度","西経140度は太平洋の东侧です。日本は本初子午线より东です。|140°W is in the eastern Pacific; Japan is east of Greenwich.|西经140度在太平洋东侧；日本在本初子午线以东。"],["北纬140度・东経36度|140°N, 36°E|北纬140度、东经36度","纬度は90度までしかありません。|Latitude only goes to 90°.|纬度最多只到90度。"]],
    "日本はおよそ北纬20〜46度・东経122〜154度の范囲にある。|Japan lies at about 20–46°N, 122–154°E.|日本大约位于北纬20～46度、东经122～154度。"),
  Q("赤道が通る国は？|Which country does the equator pass through?|赤道通过哪个国家？","ブラジル|Brazil|巴西",
    [["エジプト|Egypt|埃及","エジプトは北纬22〜32度ほどにあります。|Egypt is at about 22–32°N.|埃及约在北纬22～32度。"],["インド|India|印度","インドはすべて北半球です。|India is entirely in the north.|印度全境在北半球。"],["オーストラリア|Australia|澳洲","オーストラリアはすべて南半球です。|Australia is entirely in the south.|澳洲全境在南半球。"]],
    "赤道が通る国：ブラジル・エクアドル・ケニア・インドネシアなど。|The equator crosses Brazil, Ecuador, Kenya, Indonesia, etc.|赤道通过巴西、厄瓜多尔、肯尼亚、印尼等国。"),
  Q("赤道が通る国は？|Which country does the equator pass through?|赤道通过哪个国家？","インドネシア|Indonesia|印尼",
    [["日本|Japan|日本","日本は北纬20〜46度ほどにあります。|Japan is at about 20–46°N.|日本约在北纬20～46度。"],["メキシコ|Mexico|墨西哥","メキシコはすべて北半球です。|Mexico is entirely in the north.|墨西哥全境在北半球。"],["南アフリカ共和国|South Africa|南非","南アフリカ共和国はアフリカ大陆の南のはしで、南半球です。|South Africa is at Africa's southern tip.|南非在非洲大陆南端，位于南半球。"]],
    "インドネシアは赤道付近に多くの岛がならぶ国です。|Indonesia's many islands lie along the equator.|印尼有许多岛屿排列在赤道附近。"),
  Q("経线と纬线が直角に交わり、航海図に使われてきた地図は？|Which map has meridians and parallels at right angles and is used for sea charts?|经线与纬线垂直相交、一直用于航海图的地图是？","メルカトル図法|Mercator projection|麦卡托投影",
    [["正距方位図法|Azimuthal equidistant|方位等距投影","正距方位図法は中心からの距离と方位が正しい地図で、航空図に使われます。|It shows true distance and direction from the center (air routes).|方位等距投影从中心的距离与方位正确，用于航空图。"],["モルワイデ図法|Mollweide projection|摩尔威德投影","モルワイデ図法は面积が正しい地図で、分布図に使われます。|Mollweide keeps true area (distribution maps).|摩尔威德投影面积正确，用于分布图。"],["地球仪|A globe|地球仪","地球仪は地図ではなく、地球の模型です。|A globe is a model, not a flat map.|地球仪不是地图，是地球的模型。"]],
    "メルカトル図法：角度が正しく、2点を结ぶ直线が一定の方角の航路になる。ただし高纬度ほど面积が大きく表される。|Mercator keeps angles (constant-bearing lines), but high latitudes look too large.|麦卡托投影角度正确，两点连接为固定方向的航线；但高纬度面积会被放大。"),
  Q("中心からの距离と方位が正しく表される地図は？|Which map shows true distance and direction from its center?|从中心出发的距离与方位都正确的地图是？","正距方位図法|Azimuthal equidistant|方位等距投影",
    [["メルカトル図法|Mercator projection|麦卡托投影","メルカトル図法は角度が正しく、航海図に使われる地図です。|Mercator keeps angles (sea charts).|麦卡托投影角度正确，用于航海图。"],["モルワイデ図法|Mollweide projection|摩尔威德投影","モルワイデ図法は面积が正しい地図です。|Mollweide keeps true area.|摩尔威德投影面积正确。"],["どの地図でも正しい|Every map does|每种地图都正确","平面の地図では、距离・面积・方位・形を一度に全部正しくはできません。|No flat map gets everything right at once.|平面地图无法同时让距离、面积、方位、形状全部正确。"]],
    "正距方位図法：中心から各地への最短の道すじが直线になる→航空図に使う。|Straight lines from the center are shortest routes → air route maps.|方位等距投影中，从中心到各地的最短路线是直线→用于航空图。"),
  Q("メルカトル図法の地図で、実际よりも面积が大きく表されるのは？|On a Mercator map, which areas look larger than they really are?|在麦卡托投影地图上，面积被放大的是？","高纬度の地域（グリーンランドなど）|High-latitude areas (e.g. Greenland)|高纬度地区（如格陵兰）",
    [["赤道の近くの地域|Areas near the equator|赤道附近地区","赤道付近は、ほぼ実际に近い大きさで表されます。|Near the equator, sizes are close to true.|赤道附近的大小接近实际。"],["経度0度の近くの地域|Areas near 0° longitude|经度0度附近地区","メルカトル図法のゆがみは経度ではなく纬度で决まります。|Distortion depends on latitude, not longitude.|麦卡托投影的变形取决于纬度，不是经度。"],["南半球の地域だけ|Only the southern hemisphere|只有南半球地区","北半球も南半球も、极に近いほど大きくなります。|Both hemispheres grow toward the poles.|南北半球都是越靠近极地越大。"]],
    "グリーンランドは実际はオーストラリアの3分の1ほどだが、メルカトル図法ではずっと大きく见える。|Greenland is about 1/3 of Australia but looks far bigger on Mercator.|格陵兰实际约为澳洲的3分之1，在麦卡托投影上却看起来大得多。"),
  Q("地球1周（赤道の长さ）は、およそ何km？|About how long is the Earth's circumference (equator)?|地球一圈（赤道长度）大约是几km？","约4万km|About 40,000 km|约4万km",
    [["约1万km|About 10,000 km|约1万km","东京からロンドンまででも约1万kmあります。|Tokyo to London alone is about 10,000 km.|光是东京到伦敦就约1万km。"],["约12万km|About 120,000 km|约12万km","地球1周はその3分の1ほどです。|It's about a third of that.|地球一圈约为其3分之1。"],["约40万km|About 400,000 km|约40万km","约40万kmに近いのは地球から月までの距离（约38万km）です。|That's close to the Earth–Moon distance (~380,000 km).|约40万km接近地球到月球的距离（约38万km）。"]],
    "地球は1周约4万km。距离・面积・方位・形をほぼ正しく表せるのは地球仪。|The Earth is about 40,000 km around; only a globe shows distance, area, direction and shape correctly.|地球一圈约4万km；能大致正确表示距离、面积、方位、形状的是地球仪。"),
];
/* Part3 时差（标准时子午线を问题に书く。サマータイムは考えない） */
const CITY=[["ロンドン|London|伦敦",0],["カイロ|Cairo|开罗",30],["ペキン|Beijing|北京",120],["シドニー|Sydney|雪梨",150],["ニューヨーク|New York|纽约",-75],["ロサンゼルス|Los Angeles|洛杉矶",-120],["ホノルル|Honolulu|檀香山",-150]];
const LON=d=>d===0?X("経度0度|0°|经度0度"):d>0?LONS(d,"E"):LONS(-d,"W");
const HE=n=>n===1?"1 hour":n+" hours";
const HR=n=>X(`${n}时间|${n} hours|${n}小时`).replace(/^1 hours/,"1 hour");
const MON=["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DT=(m,d,h)=>{ while(h<0){ h+=24; d--; } while(h>=24){ h-=24; d++; } return X(`${m}月${d}日 ${h}时|${MON[m]} ${d}, ${h}:00|${m}月${d}日 ${h}:00`); };
const TZQ=c=>X(`（标准时子午线：东京は东経135度、${X(c[0])}は${LON(c[1])}。サマータイムは考えない）|(Standard meridians: Tokyo 135°E, ${X(c[0])} ${LON(c[1])}. Ignore daylight saving time.)|（标准时子午线：东京为东经135度，${X(c[0])}为${LON(c[1])}；不考虑夏令时间）`);
function tzDiff(){ const c=pick(CITY),n=Math.abs(135-c[1])/15,nm=X(c[0]),deg=Math.abs(135-c[1]);
  const q=X(`东京と${nm}の时差は何时间？|What is the time difference between Tokyo and ${nm}?|东京与${nm}的时差是几小时？`)+"<br><small>"+TZQ(c)+"</small>";
  const ws=[]; if(c[1]<0){ const v=Math.abs(135+c[1])/15; if(v!==n&&v>0) ws.push({v:HR(v),why:X(`西経は东経とは反対侧です。経度の差は 135＋${-c[1]}＝${deg}度になります。|West longitude is on the other side: the difference is 135+${-c[1]}=${deg}°.|西经在东经的另一侧，经度差是135＋${-c[1]}＝${deg}度。`)}); }
  for(const d of [1,-1,2,-2,3]){ if(ws.length>=3) break; const v=n+d; if(v>0&&!ws.some(w=>w.v===HR(v))) ws.push({v:HR(v),why:X("経度の差を15でわろう。|Divide the longitude difference by 15.|把经度差除以15。")}); }
  return {q,ans:HR(n),wrongs:ws.filter(w=>w.v!==HR(n)).slice(0,3),exp:X(`経度の差：${c[1]>=135?`${c[1]}−135`:c[1]>=0?`135−${c[1]}`:`135＋${-c[1]}`}＝${deg}度。${deg}÷15＝${n}时间。|Longitude difference: ${deg}°. ${deg}÷15 = ${HE(n)}.|经度差：${deg}度；${deg}÷15＝${n}小时。`),tf:v=>`${q}<br>→ ${v}`,kind:"calc"}; }
function tzClock(){ const c=pick(CITY),nm=X(c[0]),m=R(1,12),d=R(2,27),h=R(0,23),off=(c[1]-135)/15,ans=DT(m,d,h+off),deg=Math.abs(135-c[1]),n=Math.abs(off),east=off>0;
  const q=X(`东京が ${DT(m,d,h)} のとき、${nm}は何月何日の何时？|When it is ${DT(m,d,h)} in Tokyo, what is the date and time in ${nm}?|东京为 ${DT(m,d,h)} 时，${nm}是几月几日几点？`)+"<br><small>"+TZQ(c)+"</small>";
  const ws=[{v:DT(m,d,h-off),why:east?X(`${nm}は东京より东なので、时刻は${n}时间进んでいます（引くのではなく足す）。|${nm} is east of Tokyo, so it is ${HE(n)} ahead (add, don't subtract).|${nm}在东京以东，时间快${n}小时（要加，不是减）。`)
      :X(`${nm}は东京より西なので、时刻は${n}时间おくれています（足すのではなく引く）。|${nm} is west of Tokyo, so it is ${HE(n)} behind (subtract, don't add).|${nm}在东京以西，时间慢${n}小时（要减，不是加）。`)}];
  if(c[1]<0){ const o2=(-c[1]-135)/15; ws.push({v:DT(m,d,h+o2),why:X(`西経${-c[1]}度は东経とは反対侧です。経度の差は 135＋${-c[1]}＝${deg}度です。|${-c[1]}°W is on the other side: the difference is 135+${-c[1]}=${deg}°.|西经${-c[1]}度在东经的另一侧，经度差是135＋${-c[1]}＝${deg}度。`)}); }
  const hh=((h+off)%24+24)%24; ws.push({v:X(`${m}月${d}日 ${hh}时|${MON[m]} ${d}, ${hh}:00|${m}月${d}日 ${hh}:00`),why:X("时刻は合っていますが、日付が変わることを忘れています。|The time is right, but the date changes.|时间对了，但忘了日期会改变。")});
  const re=X("経度の差を15でわって、时差を出し直そう。|Recalculate: longitude difference ÷ 15.|重新用经度差除以15计算时差。");
  ws.push({v:DT(m,d,h+off+1),why:re},{v:DT(m,d,h+off-1),why:re});
  const seen=new Set([ans]); const wr=ws.filter(w=>!seen.has(w.v)&&seen.add(w.v)).slice(0,3);
  const ex=east?X(`経度の差 ${deg}度 ÷ 15 ＝ ${n}时间。${nm}は东京より东なので${n}时间进んでいる。|Difference ${deg}° ÷ 15 = ${n} h. ${nm} is east of Tokyo, so ${n} h ahead.|经度差 ${deg}度 ÷ 15 ＝ ${n}小时；${nm}在东京以东，快${n}小时。`)
    :X(`経度の差 ${deg}度 ÷ 15 ＝ ${n}时间。${nm}は东京より西なので${n}时间おくれている。|Difference ${deg}° ÷ 15 = ${n} h. ${nm} is west of Tokyo, so ${n} h behind.|经度差 ${deg}度 ÷ 15 ＝ ${n}小时；${nm}在东京以西，慢${n}小时。`);
  return {q,ans,wrongs:wr,exp:ex+` → ${ans}`,tf:v=>`${q}<br>→ ${v}`,kind:"calc"}; }
// 「东京より n 时间おくれている都市」の标准时子午线（西経にまわりこむ）
function tzBack(){ const n=pick([1,2,3,4,5,6,8,9,10,13,14,15,16,17,19]),L=135-15*n,ans=LON(L);
  const q=X(`ある都市の时刻は、东京（东経135度）より${n}时间おくれている。この都市の标准时子午线は？|A city is ${HE(n)} behind Tokyo (135°E). What is its standard meridian?|某城市的时间比东京（东经135度）慢${n}小时，此城市的标准时子午线是？`);
  let L2=135+15*n; if(L2>180) L2-=360;
  const ws=[{v:LON(L2),why:X("おくれている都市は东京より西にあります。135度から引きます。|A city behind Tokyo is to the west: subtract from 135°.|时间较慢的城市在东京以西，要从135度减。")},
    {v:LON(15*n),why:X(`${15*n}度は时差の分の経度で、东京（135度）からの差です。|${15*n}° is only the difference from 135°.|${15*n}度只是与东京（135度）的经度差。`)},
    {v:LON(-L),why:X("东経と西経を取りちがえています。|East and west are mixed up.|东经和西经弄反了。")},{v:LON(135-10*n),why:X("経度15度で1时间です。|It's 15° per hour.|经度每15度差1小时。")}];
  const seen=new Set([ans]); const wr=ws.filter(w=>Math.abs(+w.v.replace(/\D/g,""))<=180&&!seen.has(w.v)&&seen.add(w.v)).slice(0,3);
  const d=15*n,ex=L>=0?X(`経度の差：15×${n}＝${d}度。东京より西へ：135−${d}＝${L}|Difference: 15×${n} = ${d}°. Go west from 135°: 135−${d} = ${L}|经度差：15×${n}＝${d}度；从东京往西：135−${d}＝${L}`)
    :X(`経度の差：15×${n}＝${d}度。东京より西へ${d}度：0度までで135度、残りは${d}−135＝${-L}度なので西経${-L}度|Difference: 15×${n} = ${d}°. Going west, 135° takes you to 0°; the remaining ${d}−135 = ${-L}° gives ${-L}°W|经度差：15×${n}＝${d}度；往西走135度到0度，剩下${d}−135＝${-L}度，所以是西经${-L}度`);
  return {q,ans,wrongs:wr,exp:ex+` → ${ans}`,tf:v=>`${q}<br>→ ${v}`,kind:"calc"}; }
const w3=[tzDiff,tzDiff,tzClock,tzClock,tzClock,tzBack,
  Q("経度何度ごとに1时间の时差が生まれる？|Every how many degrees of longitude is a 1-hour time difference?|经度每几度产生1小时的时差？","15度|15°|15度",
    [["10度|10°|10度","地球は24时间で360度回るので、360÷24＝15度です。|360° ÷ 24 h = 15°.|地球24小时转360度，360÷24＝15度。"],["24度|24°|24度","24は1日の时间の数です。|24 is the number of hours in a day.|24是一天的小时数。"],["30度|30°|30度","30度だと2时间の差になります。|30° is a 2-hour difference.|30度是2小时的时差。"]],
    "地球は1日（24时间）で1回転（360度）→ 360÷24＝15度で1时间。|360° per 24 hours → 15° per hour.|地球一天（24小时）自转一圈（360度）→ 360÷24＝15度差1小时。"),
  Q("日本の标准时子午线は？|What is Japan's standard meridian?|日本的标准时子午线是？","东経135度（兵库県明石市）|135°E (Akashi, Hyogo)|东经135度（兵库县明石市）",
    [["东経140度（东京）|140°E (Tokyo)|东经140度（东京）","东京は东経约140度ですが、标准时は东経135度で决めています。|Tokyo is ~140°E, but standard time uses 135°E.|东京约在东经140度，但标准时以东经135度为准。"],["経度0度（ロンドン）|0° (London)|经度0度（伦敦）","経度0度は本初子午线で、世界の时刻の基准です。|0° is the prime meridian, the world's reference.|经度0度是本初子午线，是世界时间的基准。"],["东経120度（ペキン）|120°E (Beijing)|东经120度（北京）","东経120度は中国などの标准时子午线です。|120°E is China's standard meridian.|东经120度是中国等地的标准时子午线。"]],
    "日本の标准时子午线は兵库県明石市を通る东経135度。ロンドンより9时间进んでいる。|Japan uses 135°E (through Akashi), 9 hours ahead of London.|日本标准时子午线为通过兵库县明石市的东经135度，比伦敦快9小时。"),
  Q("东へ行くほど、时刻はどうなる？|Going east, the local time becomes…|越往东，时间会怎样？","进んでいる|Later (ahead)|越早进入（时间较快）",
    [["おくれている|Earlier (behind)|较慢","西へ行くほどおくれます。太阳は东からのぼります。|Going west it's behind; the sun rises in the east.|越往西越慢；太阳从东方升起。"],["変わらない|Unchanged|不变","経度が15度ちがうと1时间ずれます。|Every 15° changes the time by an hour.|经度差15度就差1小时。"],["纬度で决まる|Depends on latitude|由纬度决定","时差は纬度ではなく経度で决まります。|Time zones depend on longitude.|时差由经度而非纬度决定。"]],
    "地球は西から东へ自転するので、东の地域から先に朝になる。东ほど时刻が进んでいる。|The Earth spins west to east, so eastern places see morning first.|地球由西向东自转，东边先天亮，所以越往东时间越快。"),
  Q("日付変更线を西から东へこえるとき、日付はどうする？|Crossing the date line from west to east, you…|由西向东越过国际换日线时，日期要怎么调整？","1日おくらせる|Set the date back one day|延后（减去）1天",
    [["1日进める|Move the date forward one day|提前（加上）1天","1日进めるのは、东から西へこえるときです。|Move forward when crossing east to west.|由东向西越过时才加1天。"],["そのまま|No change|不变","日付変更线をこえると日付を1日调整します。|You always adjust by one day.|越过国际换日线一定要调整1天。"],["2日おくらせる|Set it back two days|延后2天","调整するのは1日です。|The adjustment is one day.|只调整1天。"]],
    "日付変更线の西侧（日本侧）が、世界でいちばん早く新しい日をむかえる。|Places just west of the date line start each new day first.|国际换日线西侧（日本这边）最早迎接新的一天。"),
];
/* Part4 世界の気候（雨温図はその気候の典型的な形のデータ。実在の都市名はつけない。北半球） */
const CL={
 tr:["热帯雨林気候|Tropical rainforest|热带雨林气候","1年中気温が高く、雨も1年中多い|hot all year with heavy rain every month|全年高温，全年多雨",[26.5,27,27.5,28,28,28,27.5,27.5,27.5,27.5,27,26.5],[240,160,180,170,170,150,160,170,170,190,250,280]],
 sv:["サバナ気候|Savanna|热带莽原气候","1年中気温が高く、雨季と干季がはっきりしている|hot all year with distinct wet and dry seasons|全年高温，干季与雨季分明",[26,28,29,30,30,29,29,28,28,28,27,26],[10,20,40,70,190,150,160,190,320,240,50,10]],
 de:["砂漠気候|Desert|沙漠气候","1年を通して雨がほとんど降らない|almost no rain all year|全年几乎不下雨",[14,16,19,24,28,30,31,31,29,25,20,15],[5,4,3,1,1,0,0,0,0,1,3,5]],
 hu:["温暖湿润気候|Humid subtropical|温暖湿润气候","四季がはっきりし、夏は高温で雨が多く、冬は気温が下がる|four clear seasons: hot, wet summers and cool winters|四季分明，夏季高温多雨，冬季气温下降",[5.4,6.1,9.4,14.3,18.8,21.9,25.7,26.9,23.3,18,12.5,7.7],[60,56,116,134,140,168,156,155,225,235,96,58]],
 wc:["西岸海洋性気候|Marine west coast (oceanic)|西岸海洋性气候","夏はすずしく、冬も高纬度のわりに温暖で、雨は1年を通して少しずつ降る|cool summers, mild winters, rain spread evenly through the year|夏季凉爽，冬季以高纬度来说温和，全年少量平均降雨",[5,5,7,9,13,16,18,18,15,12,8,6],[55,45,45,45,50,45,45,50,50,65,60,55]],
 me:["地中海性気候|Mediterranean|地中海型气候","夏は高温で干燥し、冬に雨が多い|hot dry summers and rainy winters|夏季高温干燥，冬季多雨",[8,9,11,14,18,22,25,25,22,17,12,9],[70,70,60,60,40,20,15,25,70,110,110,90]],
 co:["冷帯（亜寒帯）気候|Subarctic (cold)|冷带（亚寒带）气候","冬の寒さがきびしく、夏は気温が上がる|very cold winters but warm summers|冬季严寒，夏季气温会上升",[-6.5,-6.7,-1,6.7,13,17,19,17,11.5,5,-1,-5],[50,40,35,40,50,80,85,80,65,65,55,50]],
 po:["寒帯（ツンドラ気候）|Polar (tundra)|寒带（苔原气候）","1年中寒く、夏でも気温が10℃に届かない|cold all year; even summer stays below 10°C|全年寒冷，夏季气温也不到10℃",[-25,-27,-26,-18,-6,2,5,4,-1,-9,-18,-23],[5,4,4,5,5,10,25,25,15,10,6,5]]};
const CLW={tr:["sv","hu","me"],sv:["tr","de","hu"],de:["sv","me","po"],hu:["wc","me","co"],wc:["hu","me","co"],me:["wc","hu","de"],co:["po","wc","hu"],po:["co","de","wc"]};
function uon(k){ const [,,tm,pr]=CL[k],x0=40,x1=262,yb=160,bw=(x1-x0)/12,ty=t=>yb-(t+30)*2,py=p=>yb-p*.4; let b="";
  for(let t=-30;t<=40;t+=10){ b+=L(x0,ty(t),x1,ty(t),"g")+T(x0-5,ty(t)+4,t,"xs","end"); }
  for(let p=0;p<=300;p+=100) b+=T(x1+5,py(p)+4,p,"xs","start");
  pr.forEach((p,i)=>{ const h=p*.4; b+=`<rect x="${(x0+i*bw+2).toFixed(1)}" y="${(yb-h).toFixed(1)}" width="${(bw-4).toFixed(1)}" height="${h.toFixed(1)}" class="pr"/>`; b+=T(x0+i*bw+bw/2,yb+13,i+1,"xs"); });
  b+=`<polyline points="${tm.map((t,i)=>`${(x0+i*bw+bw/2).toFixed(1)},${ty(t).toFixed(1)}`).join(" ")}" class="tp"/>`+tm.map((t,i)=>`<circle cx="${(x0+i*bw+bw/2).toFixed(1)}" cy="${ty(t).toFixed(1)}" r="2.6" class="tpd"/>`).join("");
  b+=L(x0,ty(40),x0,yb,"ax")+L(x1,ty(40),x1,yb,"ax")+L(x0,yb,x1,yb,"ax");
  const av=(tm.reduce((a,c)=>a+c,0)/12).toFixed(1),sm=Math.round(pr.reduce((a,c)=>a+c,0));
  b+=T(x0-4,12,X("気温(℃)|Temp (°C)|气温(℃)"),"xs","start")+T(x1+4,12,X("降水量(mm)|Rain (mm)|降水量(mm)"),"xs","end")+T(151,188,X(`年平均気温 ${av}℃　年降水量 ${sm}mm|Mean ${av}°C · ${sm} mm/yr|年均温 ${av}℃　年雨量 ${sm}mm`),"xs");
  return SV(300,196,b); }
const CLK=Object.keys(CL);
const uonQ=k=>()=>{ const [nm,ft]=CL[k],q=X("ある都市の雨温図です。この都市の気候は？（棒＝降水量、线＝気温）|This is a climate graph for a city. Which climate is it? (bars = rain, line = temperature)|这是某城市的气温雨量图，此城市的气候是？（长条＝降水量，折线＝气温）")+uon(k);
  return {q,ans:X(nm),wrongs:CLW[k].map(w=>({v:X(CL[w][0]),why:X(`${X(CL[w][0])}なら、${X(CL[w][1])}。|${X(CL[w][0])} would be ${X(CL[w][1])}.|若是${X(CL[w][0])}，应为${X(CL[w][1])}。`)})),exp:X(`${X(nm)}：${X(ft)}。|${X(nm)}: ${X(ft)}.|${X(nm)}：${X(ft)}。`),tf:v=>`${q}<br>→ ${v}`,kind:"fig"}; };
const w4=[...CLK.map(uonQ),
  Q("冷帯に広がる、针叶树の大きな森林を何という？|What is the vast conifer forest of the subarctic zone called?|冷带广大的针叶林叫做？","タイガ|Taiga|泰加林",
    [["ツンドラ|Tundra|苔原","ツンドラは寒帯の、短い夏だけ地表の氷がとけてこけ类が生える土地です。|Tundra is polar land where moss grows in the short summer.|苔原是寒带只有短暂夏季地表冰融化、长出苔类的土地。"],["サバナ|Savanna|莽原","サバナは热帯の、背の高い草原にまばらに木が生える所です。|Savanna is tropical grassland with scattered trees.|莽原是热带高草原中散生树木的地方。"],["ステップ|Steppe|草原（史帝普）","ステップは干燥帯の、たけの短い草原です。|Steppe is short-grass dry grassland.|史帝普是干燥带的短草草原。"]],
    "タイガ：シベリアやカナダに広がる针叶树林（冷帯）。|Taiga: conifer forest of Siberia and Canada.|泰加林：分布于西伯利亚、加拿大的针叶林（冷带）。"),
  Q("日本の大部分が属する気候帯は？|Which climate zone covers most of Japan?|日本大部分属于哪个气候带？","温帯|Temperate|温带",
    [["冷帯（亜寒帯）|Subarctic|冷带（亚寒带）","冷帯に属するのは北海道です。|Only Hokkaido is subarctic.|属于冷带的是北海道。"],["热帯|Tropical|热带","热帯は赤道付近の、1年中暑い地域です。|The tropics are near the equator.|热带是赤道附近全年炎热的地区。"],["干燥帯|Dry|干燥带","日本は雨が多く、干燥帯ではありません。|Japan is rainy, not dry.|日本雨量多，不是干燥带。"]],
    "日本の大部分は温帯（温暖湿润気候）、北海道は冷帯。|Most of Japan is temperate (humid subtropical); Hokkaido is subarctic.|日本大部分为温带（温暖湿润气候），北海道为冷带。"),
  Q("ヨーロッパ西部が高纬度のわりに冬も温暖なのは、暖流の北大西洋海流と、その上をふく何という风のため？|Western Europe has mild winters for its latitude because of the warm North Atlantic Current and which wind?|西欧以高纬度来说冬季仍温和，是因为北大西洋暖流和吹过其上方的哪种风？","偏西风|The westerlies|西风（盛行西风）",
    [["季节风（モンスーン）|Monsoon|季风","季节风は、夏と冬で向きが変わる风で、アジアでよく见られます。|Monsoons change direction by season, mainly in Asia.|季风是夏冬风向改变的风，常见于亚洲。"],["台风|Typhoons|台风","台风は夏〜秋に日本などをおそう热帯低気圧です。|Typhoons are tropical storms in summer–autumn.|台风是夏秋侵袭日本等地的热带低气压。"],["贸易风|Trade winds|信风（贸易风）","贸易风は赤道付近で东からふく风です。|Trade winds blow from the east near the equator.|信风是在赤道附近由东吹来的风。"]],
    "偏西风：1年中西からふく风。暖流であたためられた空気をヨーロッパへ运ぶ→西岸海洋性気候。|Westerlies carry air warmed by the current into Europe → oceanic climate.|西风全年由西吹来，把暖流加热的空气带到欧洲→西岸海洋性气候。"),
  Q("アンデス山脉などに见られる、赤道に近くても标高が高いためすずしい気候は？|Which climate is cool despite being near the equator, because of high altitude (e.g. the Andes)?|像安地斯山脉那样，虽靠近赤道但因海拔高而凉爽的气候是？","高山気候|Highland climate|高山气候",
    [["冷帯（亜寒帯）気候|Subarctic|冷带（亚寒带）气候","冷帯は高纬度の地域に见られます。|Subarctic is found at high latitudes.|冷带出现在高纬度地区。"],["サバナ気候|Savanna|热带莽原气候","サバナ気候は1年中気温が高い热帯の気候です。|Savanna is hot all year.|热带莽原气候全年高温。"],["西岸海洋性気候|Marine west coast|西岸海洋性气候","西岸海洋性気候はヨーロッパ西部などの温帯の気候です。|That is a temperate climate of western Europe.|西岸海洋性气候是西欧等地的温带气候。"]],
    "高山気候：1年の気温の差は小さいが、1日の気温の差が大きい。|Highland: small yearly range, but big day–night range.|高山气候：年温差小，但日夜温差大。"),
  Q("干燥帯のうち、少し雨が降り、たけの短い草原が広がる気候は？|Which dry climate gets a little rain and has short grassland?|干燥带中，有少量降雨、分布短草草原的气候是？","ステップ気候|Steppe|草原气候（史帝普）",
    [["砂漠気候|Desert|沙漠气候","砂漠気候は雨がほとんど降らず、草もほとんど生えません。|Deserts get almost no rain.|沙漠气候几乎不下雨，也几乎不长草。"],["サバナ気候|Savanna|热带莽原气候","サバナは热帯の、雨季と干季がある草原です。|Savanna is tropical with wet/dry seasons.|莽原是热带有干雨季的草原。"],["ツンドラ気候|Tundra|苔原气候","ツンドラは寒帯の気候です。|Tundra is polar.|苔原气候属于寒带。"]],
    "干燥帯＝砂漠気候＋ステップ気候。ステップでは羊などの游牧が行われる。|Dry zone = desert + steppe; steppe supports nomadic herding.|干燥带＝沙漠气候＋草原气候；草原上有放牧羊群等游牧活动。"),
];
/* Part5 世界の人々の生活と宗教 */
const REL={chr:"キリスト教|Christianity|基督教",isl:"イスラム教|Islam|伊斯兰教",bud:"仏教|Buddhism|佛教",hin:"ヒンドゥー教|Hinduism|印度教"};
const RW={chr:"キリスト教は日曜日に教会で祈り、圣典は圣书です。|Christians pray at church on Sundays; the scripture is the Bible.|基督教周日在教堂礼拜，经典是圣经。",
  isl:"イスラム教は1日5回メッカに向かって祈り、豚肉を食べません。|Muslims pray toward Mecca five times a day and don't eat pork.|伊斯兰教每天5次朝麦加礼拜，不吃猪肉。",
  bud:"仏教はシャカが开き、东南アジアや东アジアに信者が多い宗教です。|Buddhism, founded by the Buddha, is common in Southeast and East Asia.|佛教由释迦牟尼创立，东南亚、东亚信徒多。",
  hin:"ヒンドゥー教はインドで多く信仰され、牛を神圣な动物とします。|Hinduism, common in India, treats cows as sacred.|印度教在印度信仰者多，视牛为神圣的动物。"};
const RQ=(q,k,exp)=>Q(q,REL[k],Object.keys(REL).filter(x=>x!==k).map(x=>[REL[x],RW[x]]),exp);
const w5=[
  RQ("1日5回、圣地メッカの方向に向かって祈る宗教は？|Which religion prays toward Mecca five times a day?|每天5次朝圣地麦加方向礼拜的宗教是？","isl","イスラム教：圣典はコーラン。西アジア・北アフリカ・东南アジア（インドネシアなど）に多い。|Islam: scripture is the Quran; common in West Asia, North Africa and Southeast Asia (e.g. Indonesia).|伊斯兰教：经典是古兰经；西亚、北非、东南亚（如印尼）信徒多。"),
  RQ("豚肉を食べることや、お酒を饮むことが禁止されている宗教は？|Which religion forbids eating pork and drinking alcohol?|禁止吃猪肉和喝酒的宗教是？","isl","イスラム教で食べてよいと认められた食品は「ハラール」と表示される。|Food allowed in Islam is labeled \"halal\".|伊斯兰教允许食用的食品会标示「清真（Halal）」。"),
  RQ("牛を神圣な动物と考え、牛肉を食べない人が多い宗教は？|In which religion is the cow sacred, so many don't eat beef?|视牛为神圣动物、许多人不吃牛肉的宗教是？","hin","ヒンドゥー教：インドの人口の约8割が信仰。ガンジス川で身を清める（沐浴）。|Hinduism: about 80% of India; people bathe in the Ganges.|印度教：约8成印度人信仰；在恒河沐浴净身。"),
  RQ("タイなどで、僧が朝に家々を回り、食べ物などを受け取る修行（托钵）が见られる宗教は？|In which religion do monks in Thailand walk around in the morning receiving food (alms)?|在泰国等地，僧侣早上挨家挨户接受食物（托钵）的宗教是？","bud","仏教：纪元前5世纪ごろインドでシャカが开いた。东南アジア・东アジアに広がる。|Buddhism: founded in India by the Buddha around the 5th century BCE.|佛教：约西元前5世纪由释迦牟尼在印度创立，传布至东南亚、东亚。"),
  RQ("三大宗教のうち、信者がいちばん多い宗教は？|Which of the three world religions has the most followers?|三大宗教中信徒最多的是？","chr","キリスト教：イエスの教え。ヨーロッパ・南北アメリカ・オセアニアに多い。（ヒンドゥー教は三大宗教ではなく、インドの民族宗教）|Christianity: Europe, the Americas, Oceania. (Hinduism is not one of the three world religions.)|基督教：欧洲、南北美洲、大洋洲信徒多（印度教不属于三大宗教，是印度的民族宗教）。"),
  Q("イスラム教の圣典は？|What is the holy book of Islam?|伊斯兰教的经典是？","コーラン（クルアーン）|The Quran|古兰经",
    [["圣书|The Bible|圣经","圣书はキリスト教の圣典です。|The Bible is Christian.|圣经是基督教的经典。"],["経|Sutras|佛经","経は仏教の教えを记したものです。|Sutras are Buddhist.|佛经记载佛教的教义。"],["ハラール|Halal|清真","ハラールはイスラム教で许された食品などのことで、圣典ではありません。|Halal means permitted, not a book.|清真指伊斯兰教允许的食品等，不是经典。"]],
    "イスラム教：开いたのはムハンマド（7世纪・アラビア半岛）。圣典はコーラン、礼拝所はモスク。|Islam: founded by Muhammad (7th c., Arabia); scripture Quran; worship at mosques.|伊斯兰教：7世纪由穆罕默德在阿拉伯半岛创立；经典为古兰经，礼拜场所为清真寺。"),
  Q("イスラム教で、ラマダンの月に日の出から日没まで饮食をしないことを何という？|In Islam, not eating or drinking from sunrise to sunset during Ramadan is called…|伊斯兰教在斋戒月从日出到日落不吃不喝，叫做？","断食|Fasting|斋戒（禁食）",
    [["托钵|Alms round|托钵","托钵は仏教の僧が食べ物などを受け取る修行です。|Alms rounds are Buddhist.|托钵是佛教僧侣接受食物的修行。"],["巡礼|Pilgrimage|朝圣","巡礼は圣地メッカなどにお参りすることです。|Pilgrimage is visiting Mecca.|朝圣是前往圣地麦加等地参拜。"],["礼拝|Prayer|礼拜","礼拝は1日5回の祈りのことです。|Prayer is five times a day.|礼拜是每天5次的祈祷。"]],
    "ラマダン（断食月）の间、日中は饮食をせず、日没后に食事をとる。|During Ramadan, Muslims eat only after sunset.|斋戒月期间白天不饮食，日落后才进食。"),
  Q("モンゴルの游牧民が使う、组み立て式で移动できる住居は？|What is the portable tent home of Mongolian nomads?|蒙古游牧民使用、可组装移动的住所是？","ゲル|Ger (yurt)|蒙古包",
    [["イグルー|Igloo|冰屋","イグルーは、イヌイットが冬の狩りのときに雪のブロックで作った住居です。|Igloos are Inuit snow houses.|冰屋是因纽特人冬季狩猎时用雪块建的住所。"],["日干しれんがの家|Mud-brick house|晒干砖屋","日干しれんがの家は、干燥帯で土をかためて作る、动かせない家です。|Mud-brick houses are fixed homes in dry areas.|晒干砖屋是干燥带用土制成、无法移动的房子。"],["高床の住居|Stilt house|高脚屋","高床の住居は热帯などで湿気や热を防ぐための家です。|Stilt houses keep out damp in the tropics.|高脚屋是热带等地为防湿热的房子。"]],
    "ゲル：骨组みに羊の毛のフェルトをかぶせた住居。家畜と草を求めて移动する游牧に向く。|A ger is felt over a frame: easy to move for herding.|蒙古包是在骨架上覆盖羊毛毡的住所，适合逐水草而居的游牧生活。"),
  Q("シベリアで、建物を高床にしている主な理由は？|Why are buildings in Siberia raised on stilts?|西伯利亚的建筑采用高脚式的主要原因是？","建物の热で永久冻土がとけ、建物がかたむくのを防ぐため|So building heat doesn't melt the permafrost and tilt the building|防止建筑的热使永冻土融化、让建筑倾斜",
    [["风通しをよくして湿気を防ぐため|For airflow and to keep out damp|为了通风防潮","それは热帯の高床の住居の理由です。|That is the reason in the tropics.|那是热带高脚屋的理由。"],["雨水をためるため|To collect rainwater|为了保存雨水","高床は水をためるためのものではありません。|Stilts aren't for collecting water.|高脚不是用来储水的。"],["砂ぼこりを防ぐため|To keep out sand|为了防风沙","砂ぼこりは干燥帯の悩みです。|Sand is a dry-zone problem.|风沙是干燥带的困扰。"]],
    "シベリア（冷帯）の地下には、1年中こおった永久冻土がある。|Siberia (subarctic) has permanently frozen ground (permafrost).|西伯利亚（冷带）地下有全年冻结的永冻土。"),
  Q("木が少ない干燥帯で、住居の材料によく使われるものは？|In the dry zone with few trees, houses are often made of…|树木稀少的干燥带，常用来盖房子的材料是？","日干しれんが（土）|Sun-dried mud bricks|晒干砖（土）",
    [["木|Wood|木材","木の家は森林の多い地域（日本・冷帯など）に多いです。|Wooden houses are common where forests are.|木屋多见于森林多的地区（日本、冷带等）。"],["雪のブロック|Snow blocks|雪块","雪のブロックはイヌイットのイグルーです。|Snow blocks make Inuit igloos.|雪块是因纽特人的冰屋。"],["羊の毛のフェルト|Wool felt|羊毛毡","フェルトはモンゴルのゲルに使われます。|Felt is used for Mongolian gers.|羊毛毡用于蒙古包。"]],
    "日干しれんが：土と草などをこねて型に入れ、日光でかわかしたれんが。|Mud bricks are dried in the sun.|晒干砖：把土和草等揉和、入模后用阳光晒干的砖。"),
  Q("アンデス山脉の高地で、荷物を运んだり毛を利用したりするために饲われている动物は？|In the high Andes, which animals are kept to carry loads and for wool?|在安地斯山脉高地，为了搬运货物和利用毛而饲养的动物是？","リャマ・アルパカ|Llamas and alpacas|骆马、羊驼",
    [["ラクダ|Camels|骆驼","ラクダは干燥帯（西アジア・北アフリカなど）で荷物を运びます。|Camels work in deserts.|骆驼在干燥带（西亚、北非等）搬运货物。"],["トナカイ|Reindeer|驯鹿","トナカイは寒帯や冷帯で饲われています。|Reindeer are kept in polar/subarctic areas.|驯鹿饲养于寒带、冷带。"],["水牛|Water buffalo|水牛","水牛はアジアの水田で田を耕すのに使われます。|Buffalo plow rice fields in Asia.|水牛在亚洲的水田中用来耕田。"]],
    "アンデスの高地：リャマ・アルパカの放牧、じゃがいもの栽培、毛で作ったポンチョ。|Andes: llamas, alpacas, potatoes, woolen ponchos.|安地斯高地：放牧骆马、羊驼，种植马铃薯，穿毛制斗篷。"),
  Q("西アジアなどで、男性も女性も长い衣服で全身をおおう主な理由は？|Why do people in West Asia often wear long clothes covering the whole body?|西亚等地男女都穿长衣遮住全身的主要原因是？","强い日差しや砂ぼこりから身を守るため|To protect against strong sun and dust|保护身体免受强烈日照和风沙",
    [["寒さを防ぐため|To keep warm|为了防寒","干燥帯の昼は暑く、寒さが主な理由ではありません。|Desert days are hot; cold isn't the main reason.|干燥带白天炎热，防寒不是主因。"],["雨にぬれないため|To keep dry from rain|为了防雨","干燥帯は雨がほとんど降りません。|It rarely rains there.|干燥带几乎不下雨。"],["动きやすくするため|To move more easily|为了方便活动","长い衣服は动きやすさのためではありません。|Long robes aren't for ease of movement.|长衣不是为了方便活动。"]],
    "干燥帯の衣服：风通しのよい长い衣服で、日差しと砂から肌を守る。（イスラム教の教えで女性が肌をかくす意味もある）|Loose long clothes shield skin from sun and sand (and, for women, follow Islamic custom).|干燥带的服装：通风的长衣，保护皮肤免受日晒与风沙（伊斯兰教的教义中也有女性屏蔽肌肤之意）。"),
];
/* ========== ② 日本の姿（地理的分野 A(1)） ========== */
/* Part1 位置と领域（领土をめぐる问题は、学习指导要领と教科书に书かれた日本政府の立场で出す） */
const EDGE=[["北端|northernmost|最北端","択捉岛（北海道）|Etorofu Island (Hokkaido)|择捉岛（北海道）"],["南端|southernmost|最南端","冲ノ鸟岛（东京都）|Okinotori Island (Tokyo)|冲之鸟岛（东京都）"],
  ["东端|easternmost|最东端","南鸟岛（东京都）|Minamitori Island (Tokyo)|南鸟岛（东京都）"],["西端|westernmost|最西端","与那国岛（冲縄県）|Yonaguni Island (Okinawa)|与那国岛（冲绳县）"]];
const j1=[...TB(EDGE,"日本の{a}の岛は？|Which is Japan's {a} island?|日本{a}的岛是？","{b}は、日本の东西南北のどの端？|{b} is Japan's … island?|{b}位于日本东西南北的哪一端？","{b}は日本の{a}の岛。|{b} is Japan's {a} island.|{b}是日本{a}的岛。"),
  Q("国の领域にふくまれないものは？|Which is NOT part of a country's territory (domain)?|哪一项不属于国家的领域？","排他的経済水域|The exclusive economic zone (EEZ)|专属经济海域",
    [["领土|Land territory|领土","领土は国の领域です。|Land territory is part of it.|领土属于国家的领域。"],["领海|Territorial sea|领海","领海は国の领域です。|The territorial sea is part of it.|领海属于国家的领域。"],["领空|Territorial airspace|领空","领空（领土と领海の上空）は国の领域です。|Airspace above land and sea is part of it.|领空（领土与领海上空）属于国家的领域。"]],
    "国の领域＝领土・领海・领空。排他的経済水域は领域ではないが、资源を利用する権利がある。|Territory = land, sea, air. The EEZ isn't territory, but gives resource rights.|国家领域＝领土、领海、领空；专属经济海域不是领域，但有利用资源的权利。"),
  Q("日本の领海は、海岸线から何海里まで？|Japan's territorial sea extends how far from the coast?|日本的领海是从海岸线起几海里？","12海里（约22km）|12 nautical miles (about 22 km)|12海里（约22km）",
    [["200海里（约370km）|200 nautical miles|200海里（约370km）","200海里までは排他的経済水域（领海をのぞく）です。|200 nm is the EEZ limit.|200海里内是专属经济海域（不含领海）。"],["3海里（约5.6km）|3 nautical miles|3海里（约5.6km）","いまの日本の领海は12海里です。|Japan's territorial sea is now 12 nm.|现在日本的领海是12海里。"],["100海里（约185km）|100 nautical miles|100海里（约185km）","领海は12海里までです。|It is 12 nm.|领海是到12海里。"]],
    "1海里＝1852m。领海12海里、排他的経済水域は200海里まで（领海をのぞく）。|1 nm = 1,852 m. Territorial sea 12 nm; EEZ to 200 nm (excluding the territorial sea).|1海里＝1852m；领海12海里，专属经济海域至200海里（不含领海）。"),
  Q("海岸线から200海里までのうち、领海をのぞく水域を何という？|The waters out to 200 nautical miles, excluding the territorial sea, are called…|从海岸线起至200海里、扣除领海的水域叫做？","排他的経済水域|Exclusive economic zone (EEZ)|专属经济海域",
    [["领海|Territorial sea|领海","领海は12海里までで、沿岸国の主権がおよびます。|The territorial sea is 12 nm, under full sovereignty.|领海到12海里，沿岸国拥有主权。"],["公海|High seas|公海","公海はどの国の水域でもなく、どの国も自由に使えます。|The high seas belong to no country.|公海不属于任何国家，各国都可自由使用。"],["领空|Territorial airspace|领空","领空は领土と领海の上空です。|Airspace is above land and sea.|领空是领土与领海的上空。"]],
    "排他的経済水域では、沿岸国が鱼などの水产资源や海底の鉱产资源を利用できる。|In the EEZ, the coastal country owns fish and seabed resources.|在专属经济海域内，沿岸国可利用鱼类等水产资源及海底矿产资源。"),
  Q("排他的経済水域で、沿岸国に认められていることは？|What does a coastal country have the right to do in its EEZ?|在专属经济海域内，沿岸国被承认的权利是？","水产资源や鉱产资源を利用すること|Use the fish and mineral resources|利用水产资源和矿产资源",
    [["外国の船の通行を禁止すること|Ban foreign ships from passing|禁止外国船只通行","排他的経済水域では、外国の船も自由に通行できます。|Foreign ships may pass freely.|外国船只也能在专属经济海域自由通行。"],["外国の飞行机の通过を禁止すること|Ban foreign planes from flying over|禁止外国飞机飞越","排他的経済水域の上空は领空ではありません。|The air above the EEZ isn't national airspace.|专属经济海域上空不是领空。"],["自分の国の领土にすること|Make it national land|将其变成本国领土","排他的経済水域は领域ではありません。|The EEZ is not territory.|专属经济海域不是领域。"]],
    "日本は岛が多く、排他的経済水域（领海をふくむ）は国土面积の10倍以上ある。|Japan's many islands give it sea areas over 10 times its land area.|日本岛屿多，专属经济海域（含领海）是国土面积的10倍以上。"),
  Q("冲ノ鸟岛で、多くの费用をかけて护岸工事を行った理由は？|Why was costly shore-protection work done on Okinotori Island?|为何要花大笔经费在冲之鸟岛进行护岸工程？","岛が水没すると、まわりの広い排他的経済水域を失うから|If the island sank, Japan would lose the large EEZ around it|岛屿若没入水中，就会失去周围广大的专属经济海域",
    [["観光客をふやすため|To attract tourists|为了增加观光客","冲ノ鸟岛は人が住まない小さな岛で、観光地ではありません。|It's a tiny uninhabited island.|冲之鸟岛是无人居住的小岛，不是观光地。"],["人が住めるようにするため|So people can live there|为了让人能居住","工事の目的は岛が波にけずられて消えないようにすることです。|The aim is to stop it eroding away.|工程目的是防止岛屿被海浪侵蚀消失。"],["渔港をつくるため|To build a fishing port|为了建造渔港","渔港づくりが目的ではありません。|Not for a port.|目的不是建渔港。"]],
    "冲ノ鸟岛（东京都）は日本の南端。岛のまわりに日本の国土面积より広い排他的経済水域がある。|Okinotori (Tokyo) is Japan's southernmost point; its EEZ is larger than Japan's land area.|冲之鸟岛（东京都）是日本最南端，周围的专属经济海域比日本国土面积还大。"),
  Q("北方领土（歯舞群岛・色丹岛・国后岛・択捉岛）を不法に占拠している国は？|Which country illegally occupies the Northern Territories (Habomai, Shikotan, Kunashiri, Etorofu), in Japan's view?|依日本政府立场，非法占领北方领土（齿舞群岛、色丹岛、国后岛、择捉岛）的国家是？","ロシア|Russia|俄罗斯",
    [["韩国|South Korea|韩国","韩国が不法に占拠しているのは竹岛（岛根県）です。|South Korea occupies Takeshima (Shimane).|韩国非法占领的是竹岛（岛根县）。"],["中国|China|中国","中国は尖阁诸岛（冲縄県）の领有権を主张しています。|China claims the Senkaku Islands (Okinawa).|中国主张拥有尖阁诸岛（冲绳县）的主权。"],["アメリカ合众国|United States|美国","アメリカ合众国が统治していた冲縄は、1972年に日本に返还されました。|Okinawa was returned to Japan by the U.S. in 1972.|美国统治的冲绳已于1972年归还日本。"]],
    "北方领土は北海道に属する日本固有の领土で、ソ连（いまのロシア）が占拠した（日本政府の立场）。|The Northern Territories belong to Hokkaido; the USSR (now Russia) occupied them (Japanese government position).|北方领土属于北海道，是日本固有领土，遭苏联（今俄罗斯）占领（日本政府立场）。"),
  Q("岛根県に属し、韩国が不法に占拠している岛は？|Which island belongs to Shimane and is illegally occupied by South Korea, in Japan's view?|依日本政府立场，属于岛根县、遭韩国非法占领的岛是？","竹岛|Takeshima|竹岛",
    [["尖阁诸岛|Senkaku Islands|尖阁诸岛","尖阁诸岛は冲縄県に属する岛々です。|The Senkakus belong to Okinawa.|尖阁诸岛属于冲绳县。"],["択捉岛|Etorofu Island|择捉岛","択捉岛は北海道に属する北方领土の岛です。|Etorofu is one of the Northern Territories.|择捉岛是属于北海道的北方领土。"],["与那国岛|Yonaguni Island|与那国岛","与那国岛は冲縄県の、日本の西端の岛です。|Yonaguni is Japan's westernmost island.|与那国岛是冲绳县、日本最西端的岛。"]],
    "竹岛は岛根県に属する日本固有の领土（日本政府の立场）。|Takeshima belongs to Shimane (Japanese government position).|竹岛属于岛根县，是日本固有领土（日本政府立场）。"),
  Q("冲縄県に属し、日本が有効に支配しているが、中国などが领有権を主张している岛々は？|Which Okinawa islands does Japan control, though China and others claim them?|属于冲绳县、由日本有效管辖，但中国等主张拥有主权的岛屿是？","尖阁诸岛|Senkaku Islands|尖阁诸岛",
    [["竹岛|Takeshima|竹岛","竹岛は岛根県に属し、韩国が占拠しています。|Takeshima (Shimane) is occupied by South Korea.|竹岛属于岛根县，遭韩国占领。"],["北方领土|Northern Territories|北方领土","北方领土は北海道に属し、ロシアが占拠しています。|They belong to Hokkaido, occupied by Russia.|北方领土属于北海道，遭俄罗斯占领。"],["冲ノ鸟岛|Okinotori Island|冲之鸟岛","冲ノ鸟岛は东京都に属する、日本の南端の岛です。|Okinotori (Tokyo) is the southernmost point.|冲之鸟岛属于东京都，是日本最南端。"]],
    "日本政府は、尖阁诸岛について「解决すべき领有権の问题は存在しない」という立场。|Japan's government says there is no territorial dispute to resolve over the Senkakus.|日本政府的立场是：尖阁诸岛「不存在需要解决的主权问题」。"),
  Q("日本の国土面积は、およそどれくらい？|About how large is Japan's land area?|日本的国土面积大约是多少？","约38万km²|About 380,000 km²|约38万km²",
    [["约12万km²|About 120,000 km²|约12万km²","约12万km²は日本の3分の1ほどです。|That's about a third of Japan.|约12万km²约为日本的3分之1。"],["约98万km²|About 980,000 km²|约98万km²","日本はその半分以下です。|Japan is under half of that.|日本不到其一半。"],["约3800km²|About 3,800 km²|约3800km²","それは小さな県ほどの面积です。|That's the size of one small prefecture.|那只是一个小县的面积。"]],
    "日本の面积は约38万km²。南北约3000kmにわたって岛々が弓のようにならぶ。|Japan is about 380,000 km², an arc of islands about 3,000 km long.|日本面积约38万km²，岛屿呈弓形排列，南北绵延约3000km。"),
  Q("日本の位置の说明として正しいものは？|Which describes Japan's location correctly?|关于日本位置的说明，正确的是？","ユーラシア大陆の东にある岛国|An island country east of Eurasia|位于欧亚大陆东方的岛国",
    [["ユーラシア大陆の西にある岛国|An island country west of Eurasia|位于欧亚大陆西方的岛国","ユーラシア大陆の西にある岛国はイギリスなどです。|That's the UK.|位于欧亚大陆西方的岛国是英国等。"],["南半球にある岛国|An island country in the south|位于南半球的岛国","日本は赤道より北（北半球）にあります。|Japan is north of the equator.|日本在赤道以北（北半球）。"],["インド洋にうかぶ岛国|An island country in the Indian Ocean|位于印度洋的岛国","日本は太平洋の北西部にあります。|Japan is in the northwest Pacific.|日本位于太平洋西北部。"]],
    "日本：ユーラシア大陆の东、太平洋の北西部にある。北纬约20〜46度・东経约122〜154度。|Japan: east of Eurasia, in the NW Pacific, about 20–46°N, 122–154°E.|日本：位于欧亚大陆东方、太平洋西北部，约北纬20～46度、东经122～154度。"),
];
/* Part2 都道府県と都道府県庁所在地（名前がちがうもの） */
const PREF=[["北海道|Hokkaido|北海道","札幌市|Sapporo|札幌市"],["岩手県|Iwate|岩手县","盛冈市|Morioka|盛冈市"],["宫城県|Miyagi|宫城县","仙台市|Sendai|仙台市"],["茨城県|Ibaraki|茨城县","水戸市|Mito|水户市"],
  ["栃木県|Tochigi|栃木县","宇都宫市|Utsunomiya|宇都宫市"],["群马県|Gunma|群马县","前桥市|Maebashi|前桥市"],["埼玉県|Saitama|埼玉县","さいたま市|Saitama City|埼玉市"],["神奈川県|Kanagawa|神奈川县","横浜市|Yokohama|横滨市"],
  ["石川県|Ishikawa|石川县","金沢市|Kanazawa|金泽市"],["山梨県|Yamanashi|山梨县","甲府市|Kofu|甲府市"],["爱知県|Aichi|爱知县","名古屋市|Nagoya|名古屋市"],["三重県|Mie|三重县","津市|Tsu|津市"],
  ["滋贺県|Shiga|滋贺县","大津市|Otsu|大津市"],["兵库県|Hyogo|兵库县","神戸市|Kobe|神户市"],["岛根県|Shimane|岛根县","松江市|Matsue|松江市"],["香川県|Kagawa|香川县","高松市|Takamatsu|高松市"],
  ["爱媛県|Ehime|爱媛县","松山市|Matsuyama|松山市"],["冲縄県|Okinawa|冲绳县","那覇市|Naha|那霸市"]];
const PQ=["{a}の都道府県庁所在地は？|What is the capital of {a}?|{a}的县政府所在地是？","{b}が都道府県庁所在地なのは？|{b} is the capital of which prefecture?|{b}是哪个都道府县的县政府所在地？","{a}の都道府県庁所在地は{b}。|The capital of {a} is {b}.|{a}的县政府所在地是{b}。"];
const NOSEA=[["奈良県|Nara|奈良县",["和歌山県|Wakayama|和歌山县","三重県|Mie|三重县","京都府|Kyoto|京都府"]],["长野県|Nagano|长野县",["静冈県|Shizuoka|静冈县","新潟県|Niigata|新潟县","富山県|Toyama|富山县"]],["埼玉県|Saitama|埼玉县",["千叶県|Chiba|千叶县","茨城県|Ibaraki|茨城县","神奈川県|Kanagawa|神奈川县"]],["岐阜県|Gifu|岐阜县",["爱知県|Aichi|爱知县","福井県|Fukui|福井县","石川県|Ishikawa|石川县"]]];
const noSea=([a,ws])=>Q("海に面していない県は？|Which prefecture has no coastline?|哪个县不临海？",a,ws.map(w=>[w,`${X(w)}は海に面しています。|${X(w)} has a coastline.|${X(w)}临海。`]),
  "海に面していない8県：栃木・群马・埼玉・山梨・长野・岐阜・滋贺・奈良。|The 8 landlocked prefectures: Tochigi, Gunma, Saitama, Yamanashi, Nagano, Gifu, Shiga, Nara.|不临海的8县：栃木、群马、埼玉、山梨、长野、岐阜、滋贺、奈良。");
const j2=[...TB(PREF,...PQ),...NOSEA.map(noSea),
  Q("日本の都道府県の数は？|How many prefectures does Japan have?|日本有几个都道府县？","47|47|47",
    [["43|43|43","43は「県」の数です。1都1道2府を足します。|43 counts only the ken; add Tokyo, Hokkaido, Osaka and Kyoto.|43是「县」的数量，还要加上1都1道2府。"],["46|46|46","1都1道2府43県で47です。|1+1+2+43 = 47.|1都1道2府43县，共47个。"],["50|50|50","50はアメリカ合众国の州の数です。|50 is the number of U.S. states.|50是美国的州数。"]],
    "47都道府県＝1都（东京都）・1道（北海道）・2府（大阪府・京都府）・43県。|47 = 1 to (Tokyo) + 1 do (Hokkaido) + 2 fu (Osaka, Kyoto) + 43 ken.|47个都道府县＝1都（东京都）、1道（北海道）、2府（大阪府、京都府）、43县。"),
  Q("面积がいちばん大きい都道府県は？|Which prefecture is the largest in area?|面积最大的都道府县是？","北海道|Hokkaido|北海道",
    [["岩手県|Iwate|岩手县","岩手県は2番目（県では最大）です。|Iwate is 2nd.|岩手县是第2大。"],["东京都|Tokyo|东京都","东京都は人口は最多ですが、面积は小さいほうです。|Tokyo has the most people, not the most land.|东京都人口最多，但面积偏小。"],["长野県|Nagano|长野县","长野県は4番目です。|Nagano is 4th.|长野县是第4大。"]],
    "面积：最大は北海道、最小は香川県。|Largest: Hokkaido. Smallest: Kagawa.|面积：最大为北海道，最小为香川县。"),
  Q("面积がいちばん小さい都道府県は？|Which prefecture is the smallest in area?|面积最小的都道府县是？","香川県|Kagawa|香川县",
    [["大阪府|Osaka|大阪府","大阪府は2番目に小さい都道府県です。|Osaka is 2nd smallest.|大阪府是第2小。"],["东京都|Tokyo|东京都","东京都は3番目に小さい都道府県です。|Tokyo is 3rd smallest.|东京都是第3小。"],["鸟取県|Tottori|鸟取县","鸟取県は人口がいちばん少ない県です。|Tottori has the fewest people.|鸟取县是人口最少的县。"]],
    "香川県は四国の北东部、瀬戸内海に面した県。|Kagawa is in NE Shikoku, on the Seto Inland Sea.|香川县位于四国东北部，面向濑户内海。"),
  Q("人口がいちばん少ない都道府県は？|Which prefecture has the smallest population?|人口最少的都道府县是？","鸟取県|Tottori|鸟取县",
    [["香川県|Kagawa|香川县","香川県は面积がいちばん小さい県です。|Kagawa is the smallest in area.|香川县是面积最小的县。"],["岛根県|Shimane|岛根县","岛根県は2番目に人口が少ない県です。|Shimane is 2nd fewest.|岛根县人口第2少。"],["北海道|Hokkaido|北海道","北海道は面积が最大で、人口も多いほうです。|Hokkaido is large with many people.|北海道面积最大，人口也偏多。"]],
    "人口：最多は东京都、最少は鸟取県。|Most people: Tokyo. Fewest: Tottori.|人口：最多为东京都，最少为鸟取县。"),
  Q("「府」がつくのは、大阪府と何府？|Besides Osaka, which prefecture is a 'fu'?|带「府」字的是大阪府和哪个府？","京都府|Kyoto|京都府",
    [["东京都|Tokyo|东京都","东京は「都」です。|Tokyo is a 'to'.|东京是「都」。"],["兵库県|Hyogo|兵库县","兵库は「県」です。|Hyogo is a 'ken'.|兵库是「县」。"],["奈良県|Nara|奈良县","奈良は「県」です。|Nara is a 'ken'.|奈良是「县」。"]],
    "1都1道2府43県：都＝东京、道＝北海道、府＝大阪・京都。|To = Tokyo, Do = Hokkaido, Fu = Osaka and Kyoto.|都＝东京，道＝北海道，府＝大阪、京都。"),
];
/* Part3 7地方区分 */
const REG7=[["新潟県|Niigata|新潟县","中部地方|Chubu|中部地方"],["福井県|Fukui|福井县","中部地方|Chubu|中部地方"],["静冈県|Shizuoka|静冈县","中部地方|Chubu|中部地方"],["长野県|Nagano|长野县","中部地方|Chubu|中部地方"],["山梨県|Yamanashi|山梨县","中部地方|Chubu|中部地方"],
  ["三重県|Mie|三重县","近畿地方|Kinki|近畿地方"],["兵库県|Hyogo|兵库县","近畿地方|Kinki|近畿地方"],["和歌山県|Wakayama|和歌山县","近畿地方|Kinki|近畿地方"],
  ["山口県|Yamaguchi|山口县","中国・四国地方|Chugoku-Shikoku|中国、四国地方"],["冈山県|Okayama|冈山县","中国・四国地方|Chugoku-Shikoku|中国、四国地方"],["徳岛県|Tokushima|德岛县","中国・四国地方|Chugoku-Shikoku|中国、四国地方"],
  ["冲縄県|Okinawa|冲绳县","九州地方|Kyushu|九州地方"],["大分県|Oita|大分县","九州地方|Kyushu|九州地方"],["鹿児岛県|Kagoshima|鹿儿岛县","九州地方|Kyushu|九州地方"],
  ["茨城県|Ibaraki|茨城县","関东地方|Kanto|关东地方"],["群马県|Gunma|群马县","関东地方|Kanto|关东地方"],["福岛県|Fukushima|福岛县","东北地方|Tohoku|东北地方"],["秋田県|Akita|秋田县","东北地方|Tohoku|东北地方"]];
const j3=[...TB(REG7,"7地方区分で、{a}は何地方？|In the seven-region division, {a} is in which region?|在七地方区分中，{a}属于哪个地方？","7地方区分で、{b}にふくまれるのは？|In the seven-region division, which is in {b}?|在七地方区分中，属于{b}的是？","{a}は{b}。|{a} is in {b}.|{a}属于{b}。"),
  Q("中部地方を3つに分けたとき、日本海侧の地域を何という？|When Chubu is split into three, the Sea of Japan side is called…|将中部地方分成三区时，日本海侧的地区叫做？","北陆|Hokuriku|北陆",
    [["东海|Tokai|东海","东海は太平洋侧の地域です。|Tokai is the Pacific side.|东海是太平洋侧的地区。"],["中央高地|Central Highlands|中央高地","中央高地は山に囲まれた内陆の地域です。|The Central Highlands are inland.|中央高地是被山包围的内陆地区。"],["山阴|San'in|山阴","山阴は中国地方の日本海侧です。|San'in is Chugoku's Sea of Japan side.|山阴是中国地方的日本海侧。"]],
    "中部地方＝北陆（日本海侧）・中央高地（内陆）・东海（太平洋侧）。|Chubu = Hokuriku (Sea of Japan), Central Highlands (inland), Tokai (Pacific).|中部地方＝北陆（日本海侧）、中央高地（内陆）、东海（太平洋侧）。"),
  Q("中国・四国地方を3つに分けたとき、瀬戸内海に面した地域を何という？|When Chugoku-Shikoku is split into three, the area along the Seto Inland Sea is…|将中国、四国地方分成三区时，面向濑户内海的地区叫做？","瀬戸内|Setouchi|濑户内",
    [["山阴|San'in|山阴","山阴は中国地方の日本海侧です。|San'in is the Sea of Japan side.|山阴是中国地方的日本海侧。"],["南四国|Southern Shikoku|南四国","南四国は四国の太平洋侧です。|Southern Shikoku faces the Pacific.|南四国是四国的太平洋侧。"],["北陆|Hokuriku|北陆","北陆は中部地方の日本海侧です。|Hokuriku is in Chubu.|北陆是中部地方的日本海侧。"]],
    "中国・四国地方＝山阴・瀬戸内・南四国。|Chugoku-Shikoku = San'in, Setouchi, Southern Shikoku.|中国、四国地方＝山阴、濑户内、南四国。"),
  Q("7地方区分の7つにふくまれないものは？|Which is NOT one of the seven regions?|哪一个不属于七地方区分？","北陆地方|Hokuriku|北陆地方",
    [["中部地方|Chubu|中部地方","中部地方は7地方の1つです（北陆はその中の地域）。|Chubu is one; Hokuriku is part of it.|中部地方是七地方之一（北陆是其中一区）。"],["近畿地方|Kinki|近畿地方","近畿地方は7地方の1つです。|Kinki is one.|近畿地方是七地方之一。"],["东北地方|Tohoku|东北地方","东北地方は7地方の1つです。|Tohoku is one.|东北地方是七地方之一。"]],
    "7地方：北海道・东北・関东・中部・近畿・中国・四国・九州（中国・四国で1つ）。|Seven: Hokkaido, Tohoku, Kanto, Chubu, Kinki, Chugoku-Shikoku, Kyushu.|七地方：北海道、东北、关东、中部、近畿、中国・四国、九州。"),
];
/* ========== ③ 世界の诸地域（地理的分野 B(2)） ========== */
/* Part1 アジア州 */
const r1=[
  Q("夏は海から陆へ、冬は陆から海へと、季节によって向きが変わる风を何という？|What is the wind that blows from sea to land in summer and land to sea in winter?|夏季由海吹向陆、冬季由陆吹向海，随季节改变方向的风叫做？","季节风（モンスーン）|Monsoon|季风",
    [["偏西风|Westerlies|西风","偏西风は1年中西からふく风で、ヨーロッパに影响します。|Westerlies blow from the west all year (Europe).|西风全年由西吹来，影响欧洲。"],["贸易风|Trade winds|信风","贸易风は赤道付近で东からふく风です。|Trade winds blow from the east near the equator.|信风在赤道附近由东吹来。"],["台风|Typhoon|台风","台风は热帯の海で発生する强い低気圧です。|A typhoon is a tropical storm.|台风是在热带海洋形成的强烈低气压。"]],
    "季节风（モンスーン）：夏は海からしめった风がふいて雨が多く、稲作がさかんになる（东・东南・南アジア）。|Summer monsoon brings rain → rice farming in East, SE and South Asia.|季风：夏季海上湿风带来丰沛雨量，使稻作兴盛（东亚、东南亚、南亚）。"),
  Q("中国で、外国の企业を招くために沿海部に设けられた地区を何という？|What are the coastal zones China set up to attract foreign companies?|中国在沿海设立、用来吸引外国企业的地区叫做？","経済特区|Special economic zones|经济特区",
    [["一人っ子政策|One-child policy|一胎化政策","一人っ子政策は人口の増加をおさえる政策でした（2015年に廃止）。|That was a population policy (ended 2015).|一胎化政策是抑制人口增加的政策（2015年废止）。"],["プランテーション|Plantation|大农园","プランテーションは东南アジアなどの大农园です。|Plantations are large farms in SE Asia, etc.|大农园是东南亚等地的大规模农场。"],["ASEAN|ASEAN|东协","ASEANは东南アジアの国々の协力组织です。|ASEAN is a Southeast Asian group.|东协是东南亚国家的合作组织。"]],
    "経済特区（シェンチェンなど）から工业が発展し、中国は「世界の工场」とよばれるようになった。|From zones like Shenzhen, China became the \"world's factory\".|从深圳等经济特区开始发展工业，中国被称为「世界工厂」。"),
  Q("中国の人口の约9割をしめる民族は？|About 90% of China's population is which group?|占中国人口约9成的民族是？","汉族|Han Chinese|汉族",
    [["モンゴル族|Mongols|蒙古族","モンゴル族は少数民族の1つです。|Mongols are a minority.|蒙古族是少数民族之一。"],["チベット族|Tibetans|藏族","チベット族は西部に住む少数民族です。|Tibetans are a western minority.|藏族是住在西部的少数民族。"],["ウイグル族|Uyghurs|维吾尔族","ウイグル族は西部に住む少数民族です。|Uyghurs are a western minority.|维吾尔族是住在西部的少数民族。"]],
    "中国は约9割が汉族で、ほかに50をこえる少数民族がくらしている。|About 90% Han, plus over 50 minority groups.|中国约9成为汉族，另有50多个少数民族。"),
  Q("东南アジアの国々が结成した、地域の协力のための组织は？|What organization did Southeast Asian countries form for regional cooperation?|东南亚各国为区域合作而成立的组织是？","ASEAN（东南アジア诸国连合）|ASEAN|东协（东南亚国家协会）",
    [["EU（ヨーロッパ连合）|EU|欧盟","EUはヨーロッパの国々の组织です。|The EU is European.|欧盟是欧洲国家的组织。"],["AU（アフリカ连合）|AU|非洲联盟","AUはアフリカの国々の组织です。|The AU is African.|非洲联盟是非洲国家的组织。"],["OPEC（石油输出国机构）|OPEC|石油输出国组织","OPECは石油を输出する国々の组织です。|OPEC is for oil exporters.|石油输出国组织是石油出口国的组织。"]],
    "ASEAN：1967年结成。加盟国の间で贸易や交流をさかんにしている。|ASEAN (1967) promotes trade and exchange among members.|东协：1967年成立，促进成员国间的贸易与交流。"),
  Q("マレーシアやインドネシアのプランテーションで多く栽培されている作物は？|Which crop is widely grown on plantations in Malaysia and Indonesia?|马来西亚、印尼的大农园大量栽种的作物是？","油やし（パーム油）|Oil palm|油棕（棕榈油）",
    [["小麦|Wheat|小麦","小麦はすずしく干いた地域の作物です。|Wheat suits cool, dry areas.|小麦是凉爽干燥地区的作物。"],["绵花|Cotton|棉花","绵花はインドのデカン高原などで多く栽培されます。|Cotton is big in India's Deccan.|棉花多栽种于印度德干高原等地。"],["とうもろこし|Corn|玉米","とうもろこしはアメリカ合众国の中西部などで多く栽培されます。|Corn is big in the U.S. Midwest.|玉米多栽种于美国中西部等地。"]],
    "プランテーション：植民地时代に开かれた大农园。油やし・天然ゴム・バナナなどを输出向けに栽培。|Plantations from colonial times grow oil palm, rubber, bananas for export.|大农园始于殖民时代，栽种油棕、天然橡胶、香蕉等供出口。"),
  Q("インドの南部のベンガルールなどで発展している产业は？|Which industry has grown in Bengaluru and other cities in southern India?|在印度南部班加罗尔等地发展的产业是？","ICT（情报通信技术）产业|ICT (information technology)|信息通信科技（ICT）产业",
    [["石油化学工业|Petrochemicals|石油化学工业","石油の生产がさかんなのは西アジアのペルシア湾岸です。|Oil is big around the Persian Gulf.|石油生产盛行于西亚波斯湾沿岸。"],["自动车工业だけ|Only cars|只有汽车工业","ベンガルールで特に発展しているのはICT产业です。|Bengaluru is known for ICT.|班加罗尔特别发展的是ICT产业。"],["渔业|Fishing|渔业","ベンガルールは内陆の都市です。|Bengaluru is inland.|班加罗尔是内陆城市。"]],
    "インドのICT产业：英语を话す技术者が多く、アメリカと约半日の时差があるため、夜のあいだに仕事を引きつげる。|Many English-speaking engineers, and the time gap with the U.S. lets work continue overnight.|印度ICT产业：会说英语的技术人员多，且与美国有约半天时差，可在夜间接手工作。"),
  Q("西アジアのペルシア湾岸で、多く产出される资源は？|What resource is produced in large amounts around the Persian Gulf?|西亚波斯湾沿岸大量出产的资源是？","石油|Oil|石油",
    [["鉄鉱石|Iron ore|铁矿石","鉄鉱石はオーストラリアやブラジルで多く产出されます。|Iron ore: Australia, Brazil.|铁矿石大量产于澳洲、巴西。"],["铜|Copper|铜","铜はチリなどで多く产出されます。|Copper: Chile.|铜大量产于智利等地。"],["石炭|Coal|煤","石炭は中国やオーストラリアなどで多く产出されます。|Coal: China, Australia.|煤大量产于中国、澳洲等地。"]],
    "ペルシア湾岸の产油国は、OPEC（石油输出国机构）をつくって石油の価格などに影响をあたえている。|Gulf oil producers formed OPEC to influence oil prices.|波斯湾沿岸产油国组成石油输出国组织（OPEC），影响石油价格等。"),
  Q("同じ土地で1年に2回、米をつくることを何という？|Growing rice twice a year on the same land is called…|同一块土地一年种两次稻米叫做？","二期作|Double cropping (of rice)|一年两获（二期作）",
    [["二毛作|Two different crops a year|二毛作（一年两作不同作物）","二毛作は、同じ土地で1年に2种类のちがう作物をつくることです。|Two-crop farming grows two different crops.|二毛作是同一土地一年种两种不同作物。"],["焼畑农业|Slash-and-burn|游耕（烧垦）","焼畑农业は森林を焼いた灰を肥料にする农业です。|Slash-and-burn uses ash as fertilizer.|游耕是以烧林的灰作肥料的农业。"],["混合农业|Mixed farming|混合农业","混合农业は谷物の栽培と家畜の饲育を组み合わせた农业（ヨーロッパなど）です。|Mixed farming combines crops and livestock.|混合农业是结合谷物栽培与家畜饲养的农业（欧洲等）。"]],
    "二期作：同じ作物（米）を年2回。二毛作：ちがう作物を年2回（例：米と麦）。|Double cropping: rice twice. Two-crop: two different crops.|二期作：同一作物（稻米）一年两次；二毛作：不同作物一年两次（如稻和麦）。"),
];
/* Part2 ヨーロッパ州 */
const r2=[
  Q("ヨーロッパの多くの国が加盟し、共通通货ユーロを使う国が多い组织は？|Which organization do many European countries belong to, many using the euro?|许多欧洲国家加入、多国使用共同货币欧元的组织是？","EU（ヨーロッパ连合）|EU (European Union)|欧盟（欧洲联盟）",
    [["ASEAN|ASEAN|东协","ASEANは东南アジアの组织です。|ASEAN is Southeast Asian.|东协是东南亚的组织。"],["USMCA|USMCA|美墨加协定","USMCAはアメリカ・メキシコ・カナダの协定です。|USMCA is U.S.–Mexico–Canada.|美墨加协定是美国、墨西哥、加拿大的协定。"],["OPEC|OPEC|石油输出国组织","OPECは石油を输出する国々の组织です。|OPEC is for oil exporters.|石油输出国组织是石油出口国的组织。"]],
    "EU：1993年に発足。多くの国の间でパスポートなしで国境をこえられる。2020年にイギリスが离脱。|EU (1993): passport-free travel between many members; the UK left in 2020.|欧盟：1993年成立，许多成员国间不需护照即可跨越国界；英国于2020年脱离。"),
  Q("夏はオリーブ・ぶどう・オレンジ、冬は小麦などを栽培する、地中海沿岸の农业は？|Which Mediterranean farming grows olives, grapes and oranges in summer and wheat in winter?|地中海沿岸夏季种橄榄、葡萄、柳橙，冬季种小麦等的农业是？","地中海式农业|Mediterranean agriculture|地中海式农业",
    [["混合农业|Mixed farming|混合农业","混合农业は谷物と家畜を组み合わせた农业で、ヨーロッパ北部・中部で行われます。|Mixed farming (crops + livestock) is in northern/central Europe.|混合农业结合谷物与家畜，在欧洲北部、中部进行。"],["酪农|Dairy farming|酪农业","酪农は乳牛を饲ってチーズやバターをつくる农业です。|Dairy raises cows for milk and cheese.|酪农业是饲养乳牛制作起司、奶油。"],["游牧|Nomadic herding|游牧","游牧は草と水を求めて家畜と移动するくらしです。|Nomads move with herds.|游牧是带着家畜逐水草移动的生活。"]],
    "地中海性気候は夏に干燥するので、干燥に强いオリーブやぶどうを夏に育てる。|Dry summers suit drought-tolerant olives and grapes.|地中海型气候夏季干燥，所以夏季种耐旱的橄榄、葡萄。"),
  Q("ノルウェーの海岸に见られる、氷河にけずられた谷に海水が入りこんでできた湾は？|What are Norway's coastal inlets formed when the sea filled glacier-carved valleys?|挪威海岸由冰河侵蚀的谷地灌入海水所形成的海湾是？","フィヨルド|Fjord|峡湾",
    [["リアス海岸|Ria coast|谷湾式海岸","リアス海岸は川がつくった谷が沈んでできた海岸です（三陆海岸など）。|Rias are drowned river valleys (e.g. Sanriku).|谷湾式海岸是河谷沉降形成的海岸（如三陆海岸）。"],["三角州|Delta|三角洲","三角州は川の河口に土砂が积もってできた地形です。|Deltas form at river mouths.|三角洲是河口泥沙堆积形成的地形。"],["さんご礁|Coral reef|珊瑚礁","さんご礁はあたたかい海でさんごがつくる地形です。|Coral reefs form in warm seas.|珊瑚礁是温暖海域中珊瑚形成的地形。"]],
    "フィヨルド：氷河がけずったU字谷に海水が入りこんだ、奥行きの长い湾。|A fjord is a long inlet in a U-shaped glacial valley.|峡湾：冰河侵蚀的U形谷灌入海水形成的狭长海湾。"),
  Q("ドイツ・フランスなど复数の国を流れ、どの国の船も自由に航行できる川（国际河川）は？|Which river flows through several countries (Germany, France…) and is open to all ships (an international river)?|流经德国、法国等多国，各国船只都能自由航行的河川（国际河川）是？","ライン川|The Rhine|莱茵河",
    [["ナイル川|The Nile|尼罗河","ナイル川はアフリカの、世界でいちばん长い川です。|The Nile is in Africa.|尼罗河是非洲、世界最长的河。"],["アマゾン川|The Amazon|亚马逊河","アマゾン川は南アメリカの川です。|The Amazon is in South America.|亚马逊河在南美洲。"],["ミシシッピ川|The Mississippi|密西西比河","ミシシッピ川はアメリカ合众国の川です。|The Mississippi is in the U.S.|密西西比河在美国。"]],
    "ライン川：アルプスからドイツなどを流れて北海へ。工业地域を结ぶ水运に使われる。|The Rhine runs from the Alps to the North Sea, a key transport route.|莱茵河：从阿尔卑斯山流经德国等地注入北海，是链接工业区的水运要道。"),
  Q("フランス语・イタリア语・スペイン语は、何系の言语？|French, Italian and Spanish are which language group?|法语、意大利语、西班牙语属于哪一语系？","ラテン系|Latin (Romance)|拉丁语系",
    [["ゲルマン系|Germanic|日耳曼语系","ゲルマン系は英语・ドイツ语など（ヨーロッパ北西部）です。|Germanic: English, German (NW Europe).|日耳曼语系是英语、德语等（欧洲西北部）。"],["スラブ系|Slavic|斯拉夫语系","スラブ系はロシア语・ポーランド语など（东部）です。|Slavic: Russian, Polish (east).|斯拉夫语系是俄语、波兰语等（东部）。"],["アラビア系|Arabic|阿拉伯语系","アラビア语は西アジア・北アフリカの言语です。|Arabic is spoken in West Asia and North Africa.|阿拉伯语是西亚、北非的语言。"]],
    "ヨーロッパの言语：北西部ゲルマン系・南部ラテン系・东部スラブ系。宗教も北西部プロテスタント・南部カトリック・东部正教会が多い。|Germanic NW, Latin south, Slavic east; religion: Protestant NW, Catholic south, Orthodox east.|欧洲语言：西北部日耳曼语系、南部拉丁语系、东部斯拉夫语系；宗教也多为西北部新教、南部天主教、东部东正教。"),
  Q("EUの课题として、よく取り上げられるものは？|Which is often cited as a problem within the EU?|常被提出的欧盟课题是？","加盟国の间の経済の格差|Economic gaps between member countries|成员国之间的经济差距",
    [["共通の通货がないこと|No common currency|没有共同货币","多くの加盟国は共通通货ユーロを使っています。|Many members use the euro.|许多成员国使用共同货币欧元。"],["国境の検查がきびしいこと|Strict border checks|边境检查严格","多くの加盟国の间では、国境の検查がほとんどありません。|Many members have almost no border checks.|许多成员国之间几乎没有边境检查。"],["加盟国が少ないこと|Too few members|成员国太少","EUには27か国が加盟しています（2020年以降）。|The EU has 27 members (since 2020).|欧盟有27个成员国（2020年以后）。"]],
    "西ヨーロッパと东ヨーロッパで所得の差が大きく、赁金の安い东ヨーロッパに工场が移ったり、西へ働きに出る人がふえたりしている。|Western members are richer; factories move east and workers move west.|西欧与东欧所得差距大，工厂移往工资较低的东欧，也有许多人前往西欧工作。"),
  Q("ヨーロッパの北部・中部で行われる、小麦などの谷物や饲料作物の栽培と、豚や牛の饲育を组み合わせた农业は？|What farming in northern/central Europe combines grain and fodder crops with pigs and cattle?|欧洲北部、中部结合小麦等谷物与饲料作物栽培，以及养猪、牛的农业是？","混合农业|Mixed farming|混合农业",
    [["地中海式农业|Mediterranean agriculture|地中海式农业","地中海式农业はオリーブ・ぶどうなどを育てる南部の农业です。|That's the south: olives, grapes.|地中海式农业是种橄榄、葡萄等的南部农业。"],["焼畑农业|Slash-and-burn|游耕（烧垦）","焼畑农业は热帯の农业です。|Slash-and-burn is tropical.|游耕是热带的农业。"],["企业的な农业|Agribusiness|企业化农业","アメリカ合众国などの大规模な农业をさすことが多いです。|Often refers to large U.S. farming.|常指美国等地的大规模农业。"]],
    "ヨーロッパの农业：北部・中部は混合农业、南部は地中海式农业、北海沿岸やアルプスは酪农。|North/central: mixed; south: Mediterranean; North Sea and Alps: dairy.|欧洲农业：北部、中部为混合农业，南部为地中海式农业，北海沿岸、阿尔卑斯山为酪农业。"),
  Q("航空机メーカー「エアバス」の生产の特色は？|What is special about how Airbus planes are made?|飞机制造商「空中巴士」的生产特色是？","各国で部品をつくり、フランスなどで组み立てる国际分业|Parts made in several countries, assembled in France etc.|各国制造零件，在法国等地组装的国际分工",
    [["すべての部品を1つの国だけでつくる|Everything made in one country|所有零件只在一个国家制造","复数の国が协力しています。|Several countries cooperate.|由多个国家合作。"],["アジアの国だけでつくる|Made only in Asia|只在亚洲国家制造","エアバスはヨーロッパの国々が协力してつくっています。|European countries make Airbus.|空中巴士由欧洲各国合作制造。"],["手作业だけでつくる|Made entirely by hand|全部手工制造","大きな工场で组み立てています。|It's assembled in big factories.|在大型工厂组装。"]],
    "EUの国々は、国境をこえて协力し、アメリカの大企业に対抗している。|EU countries cooperate across borders to compete with big U.S. firms.|欧盟各国跨国合作，与美国大企业竞争。"),
];
/* Part3 アフリカ州 */
const r3=[
  Q("アフリカ大陆の北部に広がる、世界最大の砂漠は？|What is the world's largest desert, in northern Africa?|分布于非洲大陆北部、世界最大的沙漠是？","サハラ砂漠|The Sahara|撒哈拉沙漠",
    [["ゴビ砂漠|The Gobi|戈壁沙漠","ゴビ砂漠はモンゴルや中国にある砂漠です。|The Gobi is in Mongolia/China.|戈壁沙漠在蒙古、中国。"],["カラハリ砂漠|The Kalahari|喀拉哈里沙漠","カラハリ砂漠はアフリカ南部の砂漠です。|The Kalahari is in southern Africa.|喀拉哈里沙漠在非洲南部。"],["アタカマ砂漠|The Atacama|阿他加马沙漠","アタカマ砂漠は南アメリカのチリにあります。|The Atacama is in Chile.|阿他加马沙漠在南美洲智利。"]],
    "サハラ砂漠の南のふち（サヘル）では、砂漠化が进んでいる。|Desertification is spreading in the Sahel, the Sahara's southern edge.|撒哈拉沙漠南缘（萨赫尔）的沙漠化持续扩大。"),
  Q("アフリカ东部を北へ流れ、地中海に注ぐ世界最长の川は？|What is the world's longest river, flowing north through eastern Africa into the Mediterranean?|流经非洲东部向北注入地中海、世界最长的河是？","ナイル川|The Nile|尼罗河",
    [["コンゴ川|The Congo|刚果河","コンゴ川はアフリカ中部の热帯林を流れる川です。|The Congo flows through central African rainforest.|刚果河流经非洲中部的热带雨林。"],["ニジェール川|The Niger|尼日尔河","ニジェール川はアフリカ西部の川です。|The Niger is in West Africa.|尼日尔河在非洲西部。"],["アマゾン川|The Amazon|亚马逊河","アマゾン川は南アメリカの、流域面积が世界最大の川です。|The Amazon has the largest basin.|亚马逊河在南美洲，流域面积世界最大。"]],
    "ナイル川の流域にエジプト文明が栄えた。|Egyptian civilization grew along the Nile.|埃及文明在尼罗河流域兴盛。"),
  Q("特定の农产物や鉱产资源の输出にたよる経済を何という？|An economy that depends on exporting one or a few products is called…|依赖特定农产品或矿产资源出口的经济叫做？","モノカルチャー経済|Monoculture economy|单一作物经济",
    [["混合农业|Mixed farming|混合农业","混合农业はヨーロッパの农业の形です。|Mixed farming is a European farm type.|混合农业是欧洲的农业型态。"],["适地适作|Right crop, right place|适地适作","适地适作はアメリカ合众国の农业の特色です。|That's a feature of U.S. farming.|适地适作是美国农业的特色。"],["経済特区|Special economic zone|经济特区","経済特区は中国の外国企业を招く地区です。|That's China's foreign-investment zones.|经济特区是中国吸引外国企业的地区。"]],
    "モノカルチャー経済は、天候や国际価格の変动で国の収入が大きく変わりやすい。|Income swings with weather and world prices.|单一作物经济容易因天候或国际价格变动，使国家收入大幅变化。"),
  Q("コートジボワールやガーナで多く生产され、チョコレートの原料になる作物は？|Which chocolate crop is grown widely in Côte d'Ivoire and Ghana?|在科特迪瓦、加纳大量生产，是巧克力原料的作物是？","カカオ|Cacao|可可",
    [["コーヒー豆|Coffee beans|咖啡豆","コーヒー豆の生产はブラジルが世界一です。|Brazil leads in coffee.|咖啡豆产量以巴西居世界第一。"],["茶|Tea|茶","茶はインドや中国、ケニアなどで多く生产されます。|Tea: India, China, Kenya.|茶大量产于印度、中国、肯尼亚等地。"],["さとうきび|Sugarcane|甘蔗","さとうきびはブラジルなどで多く生产されます。|Sugarcane: Brazil, etc.|甘蔗大量产于巴西等地。"]],
    "カカオの生产：コートジボワールとガーナが世界の上位。植民地时代のプランテーションが始まり。|Côte d'Ivoire and Ghana lead; it began with colonial plantations.|可可产量：科特迪瓦、加纳居世界前列，起源于殖民时代的大农园。"),
  Q("アフリカで、英语やフランス语を公用语にしている国が多い理由は？|Why do many African countries use English or French as official languages?|非洲许多国家以英语或法语为官方语言的原因是？","かつてヨーロッパの国々の植民地だったから|They were once colonies of European countries|过去曾是欧洲国家的殖民地",
    [["英语やフランス语が古くからアフリカの言叶だったから|They were always African languages|英语、法语自古就是非洲语言","英语やフランス语はヨーロッパの言语です。|They're European languages.|英语、法语是欧洲的语言。"],["アメリカ合众国が决めたから|The U.S. decided it|由美国决定","アメリカ合众国が决めたのではありません。|The U.S. didn't decide it.|并不是美国决定的。"],["観光客のためだけ|Only for tourists|只为了观光客","植民地支配の歴史が理由です。|The reason is colonial history.|原因是殖民统治的历史。"]],
    "1960年は17か国が独立し「アフリカの年」とよばれた。いまはAU（アフリカ连合）で协力している。|In 1960, 17 countries became independent (\"Year of Africa\"); today they cooperate in the AU.|1960年有17国独立，被称为「非洲年」；现在通过非洲联盟（AU）合作。"),
  Q("携帯电话などに使われ、アフリカ南部などで多く产出される、量が少なく贵重な金属を何という？|What are the scarce metals used in phones, mined a lot in southern Africa?|用于手机等、在非洲南部大量出产的稀少珍贵金属叫做？","レアメタル（希少金属）|Rare metals|稀有金属",
    [["鉄鉱石|Iron ore|铁矿石","鉄鉱石は量が多く、レアメタルではありません。|Iron ore is plentiful.|铁矿石产量多，不是稀有金属。"],["石炭|Coal|煤","石炭は金属ではありません。|Coal isn't a metal.|煤不是金属。"],["ボーキサイト|Bauxite|铝土矿","ボーキサイトはアルミニウムの原料で、レアメタルにはふくめません。|Bauxite (for aluminum) isn't counted as rare.|铝土矿是铝的原料，不算稀有金属。"]],
    "レアメタル：コバルト・プラチナなど。南アフリカ共和国やコンゴ民主共和国で多く产出。|Rare metals: cobalt, platinum, etc. (South Africa, DR Congo).|稀有金属：钴、铂等，大量产于南非、刚果民主共和国。"),
  Q("南アフリカ共和国で、白人以外の人々を差别した人种隔离政策を何という？（1991年に廃止）|What was South Africa's racial segregation policy (ended 1991)?|南非歧视白人以外人民的种族隔离政策叫做？（1991年废止）","アパルトヘイト|Apartheid|种族隔离政策",
    [["白豪主义|White Australia policy|白澳政策","白豪主义はオーストラリアの、白人以外の移民を制限した政策です。|That was Australia's immigration policy.|白澳政策是澳洲限制非白人移民的政策。"],["一人っ子政策|One-child policy|一胎化政策","一人っ子政策は中国の人口政策です。|That was China's population policy.|一胎化政策是中国的人口政策。"],["モノカルチャー|Monoculture|单一作物经济","モノカルチャーは経済のしくみのことです。|That's an economic pattern.|单一作物经济是一种经济结构。"]],
    "アパルトヘイトは1991年に廃止され、1994年に黒人のマンデラが大统领になった。|Apartheid ended in 1991; Nelson Mandela became president in 1994.|种族隔离政策于1991年废止，1994年黑人曼德拉当选总统。"),
];
/* Part4 北アメリカ州 */
const r4=[
  Q("アメリカ合众国で、地域の気候や土地に合った作物をつくる农业の特色を何という？|What is the U.S. practice of growing the crops best suited to each area's climate and land called?|美国依各地气候与土地种植合适作物的农业特色叫做？","适地适作|Right crop, right place (tekichi tekisaku)|适地适作",
    [["二期作|Double cropping|一年两获","二期作は同じ土地で年2回米をつくることです。|Double cropping is rice twice a year.|二期作是同一土地一年种两次稻米。"],["モノカルチャー経済|Monoculture economy|单一作物经济","モノカルチャー経済は、少ない品目の输出にたよる経済です。|That's depending on a few exports.|单一作物经济是依赖少数品项出口的经济。"],["焼畑农业|Slash-and-burn|游耕（烧垦）","焼畑农业は热帯で行われる农业です。|That's tropical farming.|游耕是热带的农业。"]],
    "アメリカの农业：北部〜中部で小麦・とうもろこし・大豆、南部で绵花、西部で放牧。少ない人手で大规模に行う企业的な农业。|North/central: wheat, corn, soy; south: cotton; west: grazing — large-scale agribusiness.|美国农业：北部至中部种小麦、玉米、大豆，南部种棉花，西部放牧；以少量人力大规模经营的企业化农业。"),
  Q("アメリカ合众国の北纬37度より南の、先端技术产业などが発达した地域を何という？|What is the area of the U.S. south of 37°N where high-tech industry grew?|美国北纬37度以南、先进技术产业发达的地区叫做？","サンベルト|The Sun Belt|阳光带",
    [["シリコンバレー|Silicon Valley|硅谷","シリコンバレーはサンフランシスコ近くのICT产业の集まる地域で、サンベルトの一部です。|Silicon Valley is one ICT hub within it.|硅谷是旧金山附近ICT产业聚集区，属于阳光带的一部分。"],["プレーリー|The Prairies|大草原","プレーリーは中部に広がる草原で、小麦などの畑が広がります。|The Prairies are central grasslands.|大草原是分布于中部的草原，有广大小麦田。"],["五大湖周辺|Great Lakes area|五大湖周边","五大湖周辺は鉄钢や自动车など古くからの工业地域です。|That's the older steel and car region.|五大湖周边是钢铁、汽车等传统工业区。"]],
    "工业の中心は、五大湖周辺（鉄钢・自动车）からサンベルト（航空宇宙・ICTなど）へ広がった。|Industry spread from the Great Lakes (steel, cars) to the Sun Belt (aerospace, ICT).|工业重心从五大湖周边（钢铁、汽车）扩展到阳光带（航太、ICT等）。"),
  Q("サンフランシスコの南にある、ICT関连の企业が集まる地域は？|What area south of San Francisco is home to many ICT companies?|位于旧金山南方、ICT相关企业聚集的地区是？","シリコンバレー|Silicon Valley|硅谷",
    [["デトロイト|Detroit|底特律","デトロイトは五大湖周辺の自动车工业の都市です。|Detroit is the Great Lakes car city.|底特律是五大湖周边的汽车工业城市。"],["ピッツバーグ|Pittsburgh|匹兹堡","ピッツバーグは鉄钢业で発展した都市です。|Pittsburgh grew on steel.|匹兹堡是以钢铁业发展的城市。"],["ヒューストン|Houston|休士顿","ヒューストンは石油化学や航空宇宙产业の都市です。|Houston: petrochemicals and aerospace.|休士顿是石油化学与航太产业城市。"]],
    "シリコンバレー：半导体の材料のシリコンから名づけられた。|Named after silicon, used for semiconductors.|硅谷：名称来自半导体材料「硅」。"),
  Q("メキシコや中南米の国々からアメリカ合众国に移り住んだ、スペイン语を话す人々を何という？|What are Spanish-speaking people who moved to the U.S. from Mexico and Latin America called?|从墨西哥及中南美洲移居美国、说西班牙语的人叫做？","ヒスパニック|Hispanics|西语裔（拉丁裔）",
    [["アボリジニ|Aboriginal Australians|澳洲原住民","アボリジニはオーストラリアの先住民です。|They're Australia's Indigenous people.|澳洲原住民是澳洲的原住民族。"],["マオリ|Māori|毛利人","マオリはニュージーランドの先住民です。|They're New Zealand's Indigenous people.|毛利人是新西兰的原住民族。"],["イヌイット|Inuit|因纽特人","イヌイットはカナダ北部などに住む先住民です。|They're Indigenous people of northern Canada.|因纽特人是住在加拿大北部等地的原住民族。"]],
    "ヒスパニックは农场や建设现场などで働く人が多く、アメリカの人口にしめる割合がふえている。|Hispanics are a growing share of the U.S. population.|西语裔多在农场、建筑工地等工作，占美国人口的比例持续增加。"),
  Q("北アメリカ大陆の西部を南北に走る、けわしい山脉は？|Which rugged mountain range runs north–south in western North America?|纵贯北美洲大陆西部的险峻山脉是？","ロッキー山脉|The Rocky Mountains|洛矶山脉",
    [["アパラチア山脉|The Appalachians|阿帕拉契山脉","アパラチア山脉は东部のなだらかな山脉です。|The Appalachians are gentle eastern mountains.|阿帕拉契山脉是东部平缓的山脉。"],["アンデス山脉|The Andes|安地斯山脉","アンデス山脉は南アメリカの山脉です。|The Andes are in South America.|安地斯山脉在南美洲。"],["アルプス山脉|The Alps|阿尔卑斯山脉","アルプス山脉はヨーロッパの山脉です。|The Alps are in Europe.|阿尔卑斯山脉在欧洲。"]],
    "北アメリカの地形：西にロッキー山脉、东にアパラチア山脉、中央をミシシッピ川が流れ、北东に五大湖。|West: Rockies; east: Appalachians; center: Mississippi; northeast: Great Lakes.|北美洲地形：西有洛矶山脉、东有阿帕拉契山脉，中央有密西西比河，东北有五大湖。"),
  Q("アメリカ合众国・メキシコ・カナダの3か国が结んでいる贸易の协定は？|What trade agreement links the U.S., Mexico and Canada?|美国、墨西哥、加拿大三国签订的贸易协定是？","USMCA（米国・メキシコ・カナダ协定）|USMCA|美墨加协定（USMCA）",
    [["EU|EU|欧盟","EUはヨーロッパの组织です。|The EU is European.|欧盟是欧洲的组织。"],["ASEAN|ASEAN|东协","ASEANは东南アジアの组织です。|ASEAN is Southeast Asian.|东协是东南亚的组织。"],["AU|AU|非洲联盟","AUはアフリカの组织です。|The AU is African.|非洲联盟是非洲的组织。"]],
    "USMCAは2020年に発効（それまではNAFTA）。メキシコには、赁金の安さを生かした工场が多い。|USMCA took effect in 2020 (replacing NAFTA); many factories use Mexico's lower wages.|美墨加协定于2020年生效（之前为北美自由贸易协定）；墨西哥有许多利用低工资的工厂。"),
  Q("カナダで、英语とならんで公用语になっている言语は？|Besides English, which language is official in Canada?|在加拿大，与英语并列为官方语言的是？","フランス语|French|法语",
    [["スペイン语|Spanish|西班牙语","スペイン语はメキシコなどの公用语です。|Spanish is Mexico's language.|西班牙语是墨西哥等国的官方语言。"],["ドイツ语|German|德语","ドイツ语はカナダの公用语ではありません。|German isn't official there.|德语不是加拿大的官方语言。"],["ポルトガル语|Portuguese|葡萄牙语","ポルトガル语はブラジルの公用语です。|Portuguese is Brazil's language.|葡萄牙语是巴西的官方语言。"]],
    "カナダのケベック州などでは、フランス系の人々が多く、フランス语が多く话されている。|In Quebec, many people are of French descent and speak French.|加拿大魁北克省等地法裔居民多，通行法语。"),
];
/* Part5 南アメリカ州・オセアニア州 */
const r5=[
  Q("流域面积が世界最大の、南アメリカの川は？|Which South American river has the world's largest drainage basin?|流域面积世界最大的南美洲河川是？","アマゾン川|The Amazon|亚马逊河",
    [["ナイル川|The Nile|尼罗河","ナイル川は长さが世界最长のアフリカの川です。|The Nile is the longest, in Africa.|尼罗河是长度世界最长的非洲河川。"],["ラプラタ川|Río de la Plata|拉布拉他河","ラプラタ川はアルゼンチンとウルグアイの间の川です。|It's between Argentina and Uruguay.|拉布拉他河在阿根廷与乌拉圭之间。"],["ミシシッピ川|The Mississippi|密西西比河","ミシシッピ川は北アメリカの川です。|It's in North America.|密西西比河在北美洲。"]],
    "アマゾン川の流域には広大な热帯林があるが、开発などで减少している。|The Amazon basin's vast rainforest is shrinking from development.|亚马逊河流域有广大的热带雨林，但因开发等而减少。"),
  Q("ブラジルの公用语は？|What is the official language of Brazil?|巴西的官方语言是？","ポルトガル语|Portuguese|葡萄牙语",
    [["スペイン语|Spanish|西班牙语","南アメリカの多くの国はスペイン语ですが、ブラジルはちがいます。|Most of South America speaks Spanish, but not Brazil.|南美洲多数国家说西班牙语，但巴西不同。"],["英语|English|英语","ブラジルの公用语は英语ではありません。|Not English.|巴西的官方语言不是英语。"],["フランス语|French|法语","フランス语はカナダやアフリカの一部の国などで使われます。|French is used in Canada, parts of Africa.|法语用于加拿大、非洲部分国家等。"]],
    "ブラジルはかつてポルトガルの植民地だった。ほかの多くの国はスペインの植民地だった。|Brazil was a Portuguese colony; most others were Spanish.|巴西曾是葡萄牙的殖民地，其他多数国家曾是西班牙殖民地。"),
  Q("ブラジルで、さとうきびなどの植物から作られ、自动车の燃料に使われるものは？|In Brazil, what fuel for cars is made from plants like sugarcane?|在巴西，由甘蔗等植物制成、用作汽车燃料的是？","バイオエタノール（バイオ燃料）|Bioethanol (biofuel)|生质乙醇（生质燃料）",
    [["石炭|Coal|煤","石炭は地下からほり出す化石燃料です。|Coal is a mined fossil fuel.|煤是从地下开采的化石燃料。"],["天然ガス|Natural gas|天然气","天然ガスも化石燃料です。|Natural gas is fossil fuel too.|天然气也是化石燃料。"],["原子力|Nuclear power|核能","原子力は自动车の燃料ではありません。|Not a car fuel.|核能不是汽车燃料。"]],
    "バイオ燃料は、燃やしても大気中の二酸化炭素を（理论上）ふやさないとされるが、畑をふやすための森林伐采が问题になっている。|Biofuel is seen as carbon-neutral, but clearing forest for fields is a problem.|生质燃料被认为燃烧时（理论上）不增加大气中的二氧化碳，但为扩大农田而砍伐森林成为问题。"),
  Q("南アメリカの西部を南北に走り、高地でリャマやアルパカが饲われる山脉は？|Which mountain range runs along western South America, where llamas and alpacas are kept?|纵贯南美洲西部、高地饲养骆马和羊驼的山脉是？","アンデス山脉|The Andes|安地斯山脉",
    [["ロッキー山脉|The Rockies|洛矶山脉","ロッキー山脉は北アメリカの山脉です。|The Rockies are in North America.|洛矶山脉在北美洲。"],["ヒマラヤ山脉|The Himalayas|喜马拉雅山脉","ヒマラヤ山脉はアジアの山脉です。|The Himalayas are in Asia.|喜马拉雅山脉在亚洲。"],["グレートディバイディング山脉|Great Dividing Range|大分水岭","グレートディバイディング山脉はオーストラリア东部の山脉です。|That's in eastern Australia.|大分水岭在澳洲东部。"]],
    "アンデス山脉の高地にはかつてインカ帝国が栄え、マチュピチュ（ペルー）の遗迹が残る。|The Inca Empire flourished in the Andes; Machu Picchu (Peru) remains.|安地斯高地曾有印加帝国兴盛，留有马丘比丘（秘鲁）遗迹。"),
  Q("アルゼンチンに広がり、小麦の栽培や牛の放牧が行われる草原は？|What grassland in Argentina is used for wheat and cattle?|分布于阿根廷、种植小麦与放牧牛只的草原是？","パンパ|The Pampas|彭巴草原",
    [["プレーリー|The Prairies|北美大草原","プレーリーは北アメリカの草原です。|The Prairies are in North America.|北美大草原在北美洲。"],["サバナ|Savanna|莽原","サバナは热帯の草原です。|Savanna is tropical.|莽原是热带的草原。"],["タイガ|Taiga|泰加林","タイガは冷帯の针叶树林です。|Taiga is subarctic forest.|泰加林是冷带的针叶林。"]],
    "パンパ：ラプラタ川の流域に広がる温帯の草原。|The Pampas are temperate grasslands around the Río de la Plata.|彭巴草原：分布于拉布拉他河流域的温带草原。"),
  Q("オーストラリアの先住民を何という？|What are Australia's Indigenous people called?|澳洲的原住民族叫做？","アボリジニ（アボリジナルピープル）|Aboriginal peoples|澳洲原住民（Aboriginal）",
    [["マオリ|Māori|毛利人","マオリはニュージーランドの先住民です。|Māori are New Zealand's.|毛利人是新西兰的原住民族。"],["イヌイット|Inuit|因纽特人","イヌイットはカナダ北部などの先住民です。|Inuit live in northern Canada.|因纽特人是加拿大北部等地的原住民族。"],["ヒスパニック|Hispanics|西语裔","ヒスパニックはアメリカ合众国のスペイン语を话す移民です。|Hispanics are Spanish-speaking U.S. migrants.|西语裔是美国说西班牙语的移民。"]],
    "オーストラリアは白豪主义（白人以外の移民の制限）をやめ、いまはアジアなどからの移民も多い多文化社会。|Australia ended the White Australia policy and is now multicultural.|澳洲废除白澳政策，现在是有许多亚洲等地移民的多元文化社会。"),
  Q("オーストラリアの北西部で、地表から直接ほり进める「露天掘り」で多く产出される资源は？|What resource is mined in open pits in northwestern Australia?|澳洲西北部以「露天开采」大量出产的资源是？","鉄鉱石|Iron ore|铁矿石",
    [["石油|Oil|石油","石油が多いのは西アジアのペルシア湾岸です。|Oil is big in the Persian Gulf.|石油多产于西亚波斯湾沿岸。"],["铜|Copper|铜","铜はチリで多く产出されます。|Copper: Chile.|铜大量产于智利。"],["金|Gold|金","オーストラリアは金も产出しますが、北西部の露天掘りといえば鉄鉱石です。|Australia has gold too, but NW open pits mean iron ore.|澳洲也产金，但西北部的露天开采以铁矿石为主。"]],
    "オーストラリア：北西部で鉄鉱石、东部で石炭。日本や中国などアジアの国々へ多く输出している。|Iron ore in the northwest, coal in the east, exported mostly to Asia.|澳洲：西北部产铁矿石、东部产煤，大量出口至日本、中国等亚洲国家。"),
  Q("ニュージーランドの先住民を何という？|What are New Zealand's Indigenous people called?|新西兰的原住民族叫做？","マオリ|Māori|毛利人",
    [["アボリジニ|Aboriginal Australians|澳洲原住民","アボリジニはオーストラリアの先住民です。|They are Australia's.|澳洲原住民是澳洲的原住民族。"],["メスチソ|Mestizos|麦士蒂索人","メスチソは、中南米の先住民とヨーロッパ系の人々との混血の人々です。|Mestizos are of mixed Indigenous and European ancestry in Latin America.|麦士蒂索人是中南美洲原住民与欧洲裔的混血。"],["イヌイット|Inuit|因纽特人","イヌイットはカナダ北部などの先住民です。|Inuit live in northern Canada.|因纽特人是加拿大北部等地的原住民族。"]],
    "ニュージーランドでは、マオリの文化を大切にし、マオリ语も公用语になっている。|New Zealand values Māori culture; Māori is an official language.|新西兰重视毛利文化，毛利语也是官方语言。"),
];
/* ========== ④ 古代までの日本（歴史的分野 B(1)） ========== */
/* 年号の表：[年, できごと, ひとこと]。组み合わせカードと「古い顺」の问题でも使う */
const Y_ANC=[["57年|57|57年","奴国の王が金印を授かる|King of Na receives a gold seal|奴国王获赠金印","中国の后汉の皇帝から。「汉委奴国王」と刻まれた金印が志贺岛（福冈県）で见つかった。|From the Later Han emperor; found on Shikanoshima (Fukuoka).|由中国东汉皇帝所赠，刻有「汉委奴国王」的金印在志贺岛（福冈县）出土。"],
  ["239年|239|239年","卑弥呼が魏に使いを送る|Himiko sends envoys to Wei|卑弥呼遣使至魏","邪马台国の女王。「亲魏倭王」の称号を受けた（『魏志』倭人伝）。|Queen of Yamatai; titled \"King of Wa, Friend of Wei\".|邪马台国女王，获封「亲魏倭王」称号（《魏志》倭人传）。"],
  ["593年|593|593年","圣徳太子が推古天皇を助ける政治を始める|Prince Shotoku begins assisting Empress Suiko|圣德太子开始辅佐推古天皇","苏我马子と协力して、天皇中心の国づくりを进めた。|With Soga no Umako, he built a state centered on the ruler.|与苏我马子合作，推动以天皇为中心的国家建设。"],
  ["603年|603|603年","冠位十二阶を定める|The Twelve Cap Ranks are set|制定冠位十二阶","家がらにとらわれず、才能のある人を役人に取り立てた。|Officials chosen by talent, not family.|不拘家世，任用有才能的人为官。"],
  ["604年|604|604年","十七条の宪法を定める|The Seventeen-Article Constitution|制定十七条宪法","仏教や儒教の考えを取り入れ、役人の心构えを示した。|Rules for officials based on Buddhism and Confucianism.|融入佛教、儒教思想，揭示官员应有的态度。"],
  ["607年|607|607年","小野妹子を遣隋使として送る|Ono no Imoko sent as envoy to Sui|派小野妹子为遣隋使","隋の进んだ制度や文化を取り入れるため。|To learn from Sui China.|为了引进隋朝先进的制度与文化。"],
  ["645年|645|645年","大化の改新が始まる|The Taika Reform begins|大化革新开始","中大兄皇子と中臣镰足が苏我氏をたおした。公地公民の方针。|Prince Naka no Oe and Nakatomi no Kamatari overthrew the Soga.|中大兄皇子与中臣镰足推翻苏我氏，提出公地公民方针。"],
  ["663年|663|663年","白村江の戦い|Battle of Baekgang (Hakusukinoe)|白村江之战","百済を助けた日本が、唐と新罗の连合军に败れた。|Japan, helping Baekje, lost to Tang and Silla.|援助百济的日本败给唐与新罗联军。"],
  ["672年|672|672年","壬申の乱|The Jinshin War|壬申之乱","天皇の后つぎ争い。胜った大海人皇子が天武天皇になった。|A succession war; Prince Oama won and became Emperor Tenmu.|天皇继承之争，获胜的大海人皇子即位为天武天皇。"],
  ["701年|701|701年","大宝律令を定める|The Taiho Code is issued|制定大宝律令","唐の律令にならった法律。全国を治めるしくみが整った。|A legal code modeled on Tang China.|仿效唐朝律令的法典，创建治理全国的体制。"],
  ["710年|710|710年","平城京に都を移す|Capital moves to Heijo-kyo (Nara)|迁都平城京","唐の都・长安にならった都（奈良时代の始まり）。|Modeled on Chang'an; start of the Nara period.|仿效唐都长安（奈良时代开始）。"],
  ["743年|743|743年","垦田永年私财法を出す|Law allowing permanent ownership of new fields|颁布垦田永年私财法","开垦した土地の永久の私有を认めた→のちの荘园のもとに。|Newly cleared land could be owned forever → later estates (shoen).|承认新开垦土地可永久私有→成为日后庄园的起源。"],
  ["752年|752|752年","东大寺の大仏が完成する|The Great Buddha of Todaiji is completed|东大寺大佛完成","圣武天皇が仏教の力で国を守ろうとした。行基が协力。|Emperor Shomu sought to protect the country through Buddhism.|圣武天皇想藉佛教的力量守护国家，行基协助。"],
  ["794年|794|794年","平安京に都を移す|Capital moves to Heian-kyo (Kyoto)|迁都平安京","桓武天皇が政治を立て直すため（平安时代の始まり）。|Emperor Kanmu, to reform government; start of Heian.|桓武天皇为重整政治而迁都（平安时代开始）。"],
  ["894年|894|894年","遣唐使を停止する|Envoys to Tang are stopped|停派遣唐使","菅原道真が提案。のちに国风文化が栄えた。|Proposed by Sugawara no Michizane; Japanese-style culture later flourished.|由菅原道真提议，之后国风文化兴盛。"],
  ["1016年|1016|1016年","藤原道长が摂政になる|Fujiwara no Michinaga becomes regent|藤原道长成为摄政","摂関政治の全盛期。|The peak of Fujiwara regency rule.|摄关政治的全盛期。"],
  ["1086年|1086|1086年","白河上皇が院政を始める|Retired Emperor Shirakawa begins cloister rule|白河上皇开始院政","位をゆずった上皇が政治を行う。|A retired emperor ruled from behind.|让位后的上皇主持政治。"],
  ["1167年|1167|1167年","平清盛が太政大臣になる|Taira no Kiyomori becomes Chancellor|平清盛成为太政大臣","武士として初めて。日宋贸易を进めた。|The first samurai to do so; promoted trade with Song.|武士中的第一人，推动日宋贸易。"]];
// 年号の表から「古い顺に正しくならべたもの」を作る
function ORD(rows){ return ()=>{ const yr=r=>parseInt(X(r[0])),ch=shuf(rows).slice(0,3).sort((a,b)=>yr(a)-yr(b)),nm=ch.map(r=>X(r[1]));
  const sq=o=>o.map(i=>nm[i]).join(" → "); const ans=sq([0,1,2]);
  const ws=shuf([[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]]).slice(0,3).map(o=>({v:sq(o),why:X("正しい顺：|Correct order: |正确顺序：")+ch.map(r=>X(r[1])+X(`（${X(r[0])}）| (${X(r[0])})|（${X(r[0])}）`)).join(" → ")}));
  const q=X("次のできごとを、古い顺に正しくならべたものは？|Which puts these events in the correct order (oldest first)?|下列事件依时间先后排列，正确的是？");
  return {q,ans,wrongs:ws,exp:ch.map(r=>X(r[0])+X("：|: |：")+X(r[1])).join("<br>"),tf:v=>`${q}<br>→ ${v}`,kind:"word"}; }; }
// 时代の顺
const ERA=["旧石器时代|Paleolithic|旧石器时代","縄文时代|Jomon|绳文时代","弥生时代|Yayoi|弥生时代","古坟时代|Kofun|古坟时代","飞鸟时代|Asuka|飞鸟时代","奈良时代|Nara|奈良时代","平安时代|Heian|平安时代","镰仓时代|Kamakura|镰仓时代","室町时代|Muromachi|室町时代"];
function eraOrd(a,b){ return ()=>{ const idx=shuf(Array.from({length:b-a+1},(_,i)=>a+i)).slice(0,3).sort((x,y)=>x-y),nm=idx.map(i=>X(ERA[i]));
  const sq=o=>o.map(i=>nm[i]).join(" → "),ans=sq([0,1,2]),why=X("正しい顺：|Correct order: |正确顺序：")+ans;
  const q=X("次の时代を、古い顺に正しくならべたものは？|Which puts these periods in order (oldest first)?|下列时代依先后排列，正确的是？");
  return {q,ans,wrongs:shuf([[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]]).slice(0,3).map(o=>({v:sq(o),why})),exp:X("时代の流れ：|Order of periods: |时代顺序：")+ERA.slice(a,b+1).map(X).join(" → "),tf:v=>`${q}<br>→ ${v}`,kind:"word"}; }; }
/* Part1 古代文明と宗教のおこり */
const CIV=[["エジプト文明|Egyptian civilization|埃及文明","ナイル川|the Nile|尼罗河","ピラミッド・象形文本・太阳暦。|Pyramids, hieroglyphs, a solar calendar.|金字塔、象形文本、太阳历。"],
  ["メソポタミア文明|Mesopotamian civilization|美索不达米亚文明","チグリス川・ユーフラテス川|the Tigris and Euphrates|底格里斯河、幼发拉底河","くさび形文本・太阴暦・60进法・ハンムラビ法典。|Cuneiform, a lunar calendar, base-60, Code of Hammurabi.|楔形文本、太阴历、六十进位法、汉摩拉比法典。"],
  ["インダス文明|Indus civilization|印度河文明","インダス川|the Indus|印度河","モヘンジョ・ダロの都市遗迹・インダス文本（まだ読めない）。|Mohenjo-daro; the Indus script is still undeciphered.|摩亨佐达罗城市遗迹、印度河文本（尚未解读）。"],
  ["中国文明|Chinese civilization|中国文明","黄河（・长江）|the Yellow River (and Yangtze)|黄河（、长江）","殷の时代に甲骨文本が使われた。|Oracle-bone script was used under the Yin (Shang).|殷商时代使用甲骨文。"]];
const SCR=[["エジプト文明|Egyptian civilization|埃及文明","象形文本|Hieroglyphs|象形文本"],["メソポタミア文明|Mesopotamian civilization|美索不达米亚文明","くさび形文本|Cuneiform|楔形文本"],["インダス文明|Indus civilization|印度河文明","インダス文本|Indus script|印度河文本"],["中国文明（殷）|Chinese (Yin/Shang)|中国文明（殷商）","甲骨文本|Oracle-bone script|甲骨文"]];
const h1=[...TB(CIV,"{a}が栄えた川は？|Along which river did {a} flourish?|{a}在哪条河流域兴盛？","{b}の流域で栄えた文明は？|Which civilization flourished along {b}?|在{b}流域兴盛的文明是？","{a}は{b}の流域で栄えた。|{a} grew along {b}.|{a}在{b}流域兴盛。"),
  ...TB(SCR,"{a}で使われた文本は？|Which writing was used in {a}?|{a}使用的文本是？",null,"{a}では{b}が使われた。|{a} used {b}.|{a}使用{b}。"),
  Q("占いの结果を、亀の甲や牛の骨に刻んだ文本は？|Which writing was carved on turtle shells and ox bones to record fortune-telling?|把占卜结果刻在龟甲、牛骨上的文本是？","甲骨文本|Oracle-bone script|甲骨文",
    [["象形文本|Hieroglyphs|象形文本","象形文本はエジプトの文本で、パピルスなどに书かれました。|Egyptian, written on papyrus etc.|象形文本是埃及的文本，写在莎草纸等上。"],["くさび形文本|Cuneiform|楔形文本","くさび形文本はメソポタミアで粘土板に刻まれました。|Mesopotamian, pressed into clay.|楔形文本是美索不达米亚刻在泥板上的文本。"],["かな文本|Kana|假名","かな文本は平安时代の日本で生まれました。|Kana came from Heian Japan.|假名诞生于平安时代的日本。"]],
    "甲骨文本は中国の殷でつくられ、汉字のもとになった。|Oracle-bone script (Yin/Shang China) became the root of Chinese characters.|甲骨文创于中国殷商，是汉字的起源。"),
  Q("纪元前3世纪に中国を初めて统一し、万里の长城を整备した皇帝は？|Who first unified China in the 3rd century BCE and built up the Great Wall?|西元前3世纪首次统一中国、整修万里长城的皇帝是？","秦の始皇帝|The First Emperor of Qin|秦始皇",
    [["光武帝|Emperor Guangwu|光武帝","光武帝は后汉の皇帝で、奴国の王に金印を授けました。|He was a Later Han emperor who gave Na a gold seal.|光武帝是东汉皇帝，曾赠金印给奴国王。"],["フビライ・ハン|Kublai Khan|忽必烈","フビライ・ハンは13世纪の元の皇帝です。|Kublai ruled the Yuan in the 13th century.|忽必烈是13世纪元朝的皇帝。"],["孔子|Confucius|孔子","孔子は皇帝ではなく、儒教（儒学）を说いた思想家です。|Confucius was a thinker, not an emperor.|孔子不是皇帝，是倡导儒家思想的思想家。"]],
    "始皇帝は文本・货币・ものさしなどを统一した。万里の长城は北方の游牧民の侵入を防ぐため。|He standardized writing, coins and measures; the Wall kept out northern nomads.|秦始皇统一文本、货币、度量衡；万里长城用来防御北方游牧民族入侵。"),
  Q("思いやりの心（仁）で行いを正し、国を治めることを说いた中国の思想家は？|Which Chinese thinker taught ruling through benevolence (ren)?|主张以仁心端正行为、治理国家的中国思想家是？","孔子|Confucius|孔子",
    [["シャカ|The Buddha|释迦牟尼","シャカはインドで仏教を开いた人物です。|The Buddha founded Buddhism in India.|释迦牟尼是在印度创立佛教的人。"],["イエス|Jesus|耶稣","イエスの教えはキリスト教になりました。|Jesus's teachings became Christianity.|耶稣的教诲成为基督教。"],["始皇帝|The First Emperor|秦始皇","始皇帝は中国を统一した秦の皇帝です。|He was the Qin emperor.|秦始皇是统一中国的秦朝皇帝。"]],
    "孔子の教えは儒教（儒学）として、朝鲜や日本にも広まった。|Confucianism spread to Korea and Japan.|孔子的学说成为儒家（儒学），也传到朝鲜与日本。"),
  Q("中国からローマへ绢などを运んだ交易路は？|What trade route carried silk from China to Rome?|把丝绸等从中国运往罗马的贸易路线是？","シルクロード（绢の道）|The Silk Road|丝路",
    [["万里の长城|The Great Wall|万里长城","万里の长城は北方の游牧民の侵入を防ぐ城壁です。|The Wall was a defense, not a route.|万里长城是防御北方游牧民族的城墙。"],["东海道|The Tokaido|东海道","东海道は日本の街道です。|The Tokaido is a road in Japan.|东海道是日本的街道。"],["ナイル川|The Nile|尼罗河","ナイル川はアフリカの川です。|The Nile is in Africa.|尼罗河是非洲的河川。"]],
    "汉の时代にシルクロードが开かれ、中国の绢が西方へ、西方の文化が中国へ伝わった。|Under the Han, silk went west and Western culture came east.|汉代开通丝路，中国丝绸西传，西方文化东传。"),
  Q("古代ギリシャでつくられた、都市国家を何という？|What were the city-states of ancient Greece called?|古希腊的城邦叫做？","ポリス|Polis|城邦（Polis）",
    [["ローマ帝国|Roman Empire|罗马帝国","ローマ帝国は地中海を囲む広い地域を支配した大帝国です。|Rome was a big empire around the Mediterranean.|罗马帝国是统治地中海周围广大地区的大帝国。"],["モスク|Mosque|清真寺","モスクはイスラム教の礼拝所です。|A mosque is an Islamic place of worship.|清真寺是伊斯兰教的礼拜场所。"],["ピラミッド|Pyramid|金字塔","ピラミッドはエジプトの王の墓などとされます。|Pyramids are Egyptian royal tombs.|金字塔被认为是埃及国王的陵墓等。"]],
    "アテネなどのポリスでは、成人男性の市民が民会で话し合う民主政が行われた。|In Athens, adult male citizens debated in the assembly (democracy).|雅典等城邦实行由成年男性公民在公民大会讨论的民主政治。"),
  Q("7世纪にアラビア半岛でイスラム教を开いた人物は？|Who founded Islam in the Arabian Peninsula in the 7th century?|7世纪在阿拉伯半岛创立伊斯兰教的人是？","ムハンマド|Muhammad|穆罕默德",
    [["イエス|Jesus|耶稣","イエスの教えはキリスト教です（パレスチナ）。|Jesus → Christianity (Palestine).|耶稣的教诲是基督教（巴勒斯坦）。"],["シャカ|The Buddha|释迦牟尼","シャカは纪元前5世纪ごろインドで仏教を开きました。|The Buddha founded Buddhism in India c. 5th c. BCE.|释迦牟尼约于西元前5世纪在印度创立佛教。"],["孔子|Confucius|孔子","孔子は中国の思想家で、儒教のもとです。|Confucius was a Chinese thinker.|孔子是中国思想家，儒家的始祖。"]],
    "仏教（シャカ・インド）、キリスト教（イエス・パレスチナ）、イスラム教（ムハンマド・アラビア半岛）。|Buddhism (the Buddha, India), Christianity (Jesus, Palestine), Islam (Muhammad, Arabia).|佛教（释迦牟尼、印度）、基督教（耶稣、巴勒斯坦）、伊斯兰教（穆罕默德、阿拉伯半岛）。"),
];
/* Part2 縄文・弥生・古坟 */
const h2=[eraOrd(0,4),eraOrd(0,4),
  Q("表面に縄目の文様がついた土器が使われ、狩りや渔・采集でくらした时代は？|In which period did people use pottery with cord patterns and live by hunting, fishing and gathering?|使用表面有绳纹的陶器、以狩猎、捕鱼、采集为生的时代是？","縄文时代|Jomon period|绳文时代",
    [["弥生时代|Yayoi period|弥生时代","弥生时代には、うすくてかたい弥生土器が使われ、稲作が広まりました。|Yayoi had thin, hard pottery and rice farming.|弥生时代使用薄而硬的弥生陶器，稻作普及。"],["古坟时代|Kofun period|古坟时代","古坟时代は大きな墓（古坟）がつくられた时代です。|Kofun is the age of big burial mounds.|古坟时代是建造大型坟墓（古坟）的时代。"],["旧石器时代|Paleolithic|旧石器时代","旧石器时代には、まだ土器はつくられていません。|There was no pottery yet.|旧石器时代还没有制作陶器。"]],
    "縄文时代：縄文土器・竖穴住居・贝冢・土偶。|Jomon: cord-marked pottery, pit dwellings, shell mounds, clay figurines.|绳文时代：绳文陶器、竖穴式住居、贝冢、土偶。"),
  Q("縄文时代の人々が食べた贝のからなどを舍てた迹を何という？|What are the sites where Jomon people threw away shells called?|绳文时代人们丢弃所吃贝壳等的遗迹叫做？","贝冢|Shell mounds|贝冢",
    [["古坟|Burial mound (kofun)|古坟","古坟は王や豪族の墓です。|Kofun are tombs of rulers.|古坟是王或豪族的坟墓。"],["环濠集落|Moated village|环濠聚落","环濠集落はまわりを堀で囲んだ弥生时代のむらです。|Moated villages are Yayoi.|环濠聚落是周围以壕沟围绕的弥生时代聚落。"],["竖穴住居|Pit dwelling|竖穴式住居","竖穴住居は地面をほって柱を立て、屋根をかけた住まいです。|A pit dwelling is a house.|竖穴式住居是挖地立柱、搭上屋顶的住所。"]],
    "大森贝冢（东京都）は、アメリカ人のモースが発见した。|Edward Morse discovered the Omori shell mound (Tokyo).|大森贝冢（东京都）由美国人摩斯发现。"),
  Q("青森県にある、縄文时代の大きな集落の遗迹は？|Which large Jomon village site is in Aomori?|位于青森县的绳文时代大型聚落遗迹是？","三内丸山遗迹|Sannai-Maruyama site|三内丸山遗迹",
    [["吉野ヶ里遗迹|Yoshinogari site|吉野里遗迹","吉野ヶ里遗迹は佐贺県にある弥生时代の环濠集落です。|Yoshinogari is a Yayoi moated village in Saga.|吉野里遗迹是佐贺县的弥生时代环濠聚落。"],["登吕遗迹|Toro site|登吕遗迹","登吕遗迹は静冈県にある弥生时代の水田の迹です。|Toro is a Yayoi rice-field site in Shizuoka.|登吕遗迹是静冈县的弥生时代水田遗迹。"],["大仙古坟|Daisen Kofun|大仙古坟","大仙古坟は大阪府堺市にある古坟时代の墓です。|Daisen is a Kofun-period tomb in Sakai.|大仙古坟是大阪府堺市的古坟时代坟墓。"]],
    "三内丸山遗迹では、大きな建物の柱の迹や、远くの地域とのつながりを示す品が见つかっている。|Large building posts and goods from distant areas were found there.|三内丸山遗迹出土大型建筑柱迹，以及显示与远方交流的物品。"),
  Q("弥生时代に、稲の穂をつみとるのに使われた道具は？|Which Yayoi tool was used to cut rice heads?|弥生时代用来摘取稻穗的工具是？","石包丁|Stone reaping knife|石刀（石包丁）",
    [["铜铎|Dotaku bronze bell|铜铎","铜铎は祭りに使われたと考えられる青铜器です。|Dotaku were bronze ritual bells.|铜铎被认为是祭祀用的青铜器。"],["打制石器|Chipped stone tools|打制石器","打制石器は旧石器时代の、石を打ちかいてつくった道具です。|Chipped tools are Paleolithic.|打制石器是旧石器时代打击石头制成的工具。"],["土偶|Clay figurine (dogu)|土偶","土偶は縄文时代の土の人形です。|Dogu are Jomon clay figures.|土偶是绳文时代的泥人偶。"]],
    "弥生时代：大陆から稲作が伝わり、石包丁で穂をつみ、高床仓库に米をたくわえた。|Yayoi: rice farming arrived; heads cut with stone knives, rice stored in raised granaries.|弥生时代：稻作从大陆传入，以石刀摘穗，把米存放在高脚仓库。"),
  Q("弥生时代に、収获した米をたくわえるためにつくられた建物は？|What Yayoi building stored harvested rice?|弥生时代为保存收获稻米而建的建筑是？","高床仓库|Raised-floor storehouse|高脚仓库",
    [["竖穴住居|Pit dwelling|竖穴式住居","竖穴住居は人がくらす家です。|It's a home.|竖穴式住居是人居住的房子。"],["寝殿造|Shinden style|寝殿造","寝殿造は平安时代の贵族の住まいです。|Heian aristocrats' mansions.|寝殿造是平安时代贵族的住宅。"],["古坟|Burial mound|古坟","古坟は王や豪族の墓です。|A kofun is a tomb.|古坟是王或豪族的坟墓。"]],
    "床を高くして、湿気やネズミから米を守った。|The raised floor kept rice safe from damp and rats.|垫高地板以保护稻米免受潮湿和老鼠侵害。"),
  Q("佐贺県にある、まわりを堀やさくで囲んだ弥生时代の大きなむらの遗迹は？|Which large Yayoi village in Saga was surrounded by moats and fences?|位于佐贺县、周围以壕沟和栅栏围绕的弥生时代大型聚落遗迹是？","吉野ヶ里遗迹|Yoshinogari site|吉野里遗迹",
    [["三内丸山遗迹|Sannai-Maruyama site|三内丸山遗迹","三内丸山遗迹は青森県の縄文时代の遗迹です。|That's a Jomon site in Aomori.|三内丸山遗迹是青森县的绳文时代遗迹。"],["登吕遗迹|Toro site|登吕遗迹","登吕遗迹は静冈県の、弥生时代の水田の迹です。|Toro is a Yayoi rice-field site in Shizuoka.|登吕遗迹是静冈县的弥生时代水田遗迹。"],["大森贝冢|Omori shell mound|大森贝冢","大森贝冢は东京都の縄文时代の贝冢です。|Omori is a Jomon shell mound.|大森贝冢是东京都的绳文时代贝冢。"]],
    "むらどうしの争いが起こるようになり、堀やさくで守りを固めた。|Villages fought, so they built moats and fences.|聚落之间开始发生争斗，因此以壕沟和栅栏加强防守。"),
  Q("57年、倭の奴国の王が中国の皇帝から金印を授けられたことが书かれている歴史书は？|Which Chinese history records the King of Na receiving a gold seal in 57?|记载西元57年倭奴国王获中国皇帝赠金印的史书是？","『后汉书』东夷伝|Book of the Later Han|《后汉书》东夷传",
    [["『汉书』地理志|Book of Han (Geography)|《汉书》地理志","『汉书』地理志には、倭が100あまりの国に分かれていたことが书かれています。|It says Wa had 100-plus states.|《汉书》地理志记载倭分为一百多国。"],["『魏志』倭人伝|Records of Wei|《魏志》倭人传","『魏志』倭人伝には邪马台国の卑弥呼のことが书かれています。|It describes Himiko of Yamatai.|《魏志》倭人传记载邪马台国的卑弥呼。"],["『日本书纪』|Nihon Shoki|《日本书纪》","『日本书纪』は奈良时代に日本でつくられた歴史书です。|Japan's own history, Nara period.|《日本书纪》是奈良时代日本编写的史书。"]],
    "金印には「汉委奴国王」と刻まれ、江戸时代に福冈県の志贺岛で见つかった。|The seal reads 'King of Na of Wa, vassal of Han' and was found on Shikanoshima, Fukuoka.|金印刻有「汉委奴国王」，江户时代在福冈县志贺岛出土。"),
  Q("3世纪に邪马台国を治め、魏に使いを送った女王は？|Which queen ruled Yamatai in the 3rd century and sent envoys to Wei?|3世纪统治邪马台国、遣使至魏的女王是？","卑弥呼|Himiko|卑弥呼",
    [["推古天皇|Empress Suiko|推古天皇","推古天皇は飞鸟时代の女性の天皇です。|Suiko was an Asuka-period empress.|推古天皇是飞鸟时代的女天皇。"],["紫式部|Murasaki Shikibu|紫式部","紫式部は平安时代に『源氏物语』を书いた人物です。|She wrote The Tale of Genji.|紫式部是平安时代写《源氏物语》的人。"],["北条政子|Hojo Masako|北条政子","北条政子は镰仓时代、源頼朝の妻です。|She was Yoritomo's wife (Kamakura).|北条政子是镰仓时代源赖朝的妻子。"]],
    "239年、卑弥呼は魏に使いを送り「亲魏倭王」の称号と金印、铜镜などを授かった。|In 239 she received the title \"King of Wa, Friend of Wei\", a gold seal and mirrors.|239年卑弥呼遣使至魏，获「亲魏倭王」称号及金印、铜镜等。"),
  Q("大阪府堺市の大仙（大山）古坟のような、円と四角を组み合わせた形の古坟は？|What is the keyhole shape of tombs like Daisen Kofun in Sakai called?|像大阪府堺市大仙古坟那样，结合圆形与方形的古坟是？","前方后円坟|Keyhole-shaped tomb|前方后圆坟",
    [["円坟|Round tomb|圆坟","円坟は円い形の古坟です。|A round tomb.|圆坟是圆形的古坟。"],["方坟|Square tomb|方坟","方坟は四角い形の古坟です。|A square tomb.|方坟是方形的古坟。"],["贝冢|Shell mound|贝冢","贝冢は縄文时代のごみ舍て场の迹です。|A shell mound is a Jomon trash heap.|贝冢是绳文时代丢弃垃圾的遗迹。"]],
    "大仙古坟は日本最大の前方后円坟。大和政権の大王の力の大きさを示す。|Daisen is Japan's largest, showing Yamato rulers' power.|大仙古坟是日本最大的前方后圆坟，显示大和政权大王的强大势力。"),
  Q("古坟の上やまわりにならべられた、素焼きの焼き物は？|What clay figures were set on and around kofun tombs?|排列在古坟上方及周围的素烧陶器是？","はにわ（埴轮）|Haniwa|埴轮",
    [["土偶|Dogu|土偶","土偶は縄文时代につくられた土の人形です。|Dogu are Jomon.|土偶是绳文时代的泥人偶。"],["铜铎|Dotaku|铜铎","铜铎は弥生时代の、祭りに使われたと考えられる青铜器です。|Dotaku are Yayoi bronze bells.|铜铎是弥生时代被认为用于祭祀的青铜器。"],["须恵器|Sue ware|须惠器","须恵器は渡来人が伝えた、かたい土器です。|Sue ware is hard pottery from immigrants.|须惠器是渡来人传入的坚硬陶器。"]],
    "はにわには、円筒形のほか、人・马・家などの形がある。|Haniwa include cylinders, people, horses and houses.|埴轮除了圆筒形，还有人、马、房屋等造型。"),
  Q("朝鲜半岛などから日本に移り住み、汉字・儒教・须恵器の技术などを伝えた人々は？|Who moved to Japan from the Korean Peninsula and elsewhere, bringing kanji, Confucianism and Sue ware?|从朝鲜半岛等地移居日本，传入汉字、儒教、须惠器技术等的人是？","渡来人|Toraijin (immigrants)|渡来人",
    [["遣唐使|Envoys to Tang|遣唐使","遣唐使は日本から唐へ送った使节です。|They went from Japan to China.|遣唐使是日本派往唐朝的使节。"],["防人|Sakimori (border guards)|防人","防人は九州北部を守った兵士です。|They guarded northern Kyushu.|防人是守卫九州北部的士兵。"],["倭寇|Wako (pirates)|倭寇","倭寇は朝鲜や中国の沿岸をあらした海贼です。|They were pirates.|倭寇是侵扰朝鲜、中国沿岸的海盗。"]],
    "仏教も、6世纪に朝鲜半岛の百済から正式に伝わった。|Buddhism officially came from Baekje in the 6th century.|佛教也在6世纪从朝鲜半岛的百济正式传入。"),
  Q("埼玉県の稲荷山古坟と熊本県の江田船山古坟で见つかった刀剣に、名前が刻まれていた大王は？|Which great king's name is carved on swords found in tombs in Saitama and Kumamoto?|在埼玉县稻荷山古坟与熊本县江田船山古坟出土的刀剑上，刻有名字的大王是？","ワカタケル大王|Great King Wakatakeru|获加多支卤大王",
    [["卑弥呼|Himiko|卑弥呼","卑弥呼は3世纪の邪马台国の女王です。|Himiko was a 3rd-century queen.|卑弥呼是3世纪邪马台国的女王。"],["圣徳太子|Prince Shotoku|圣德太子","圣徳太子は飞鸟时代の人物です。|Shotoku is Asuka period.|圣德太子是飞鸟时代的人物。"],["天智天皇|Emperor Tenji|天智天皇","天智天皇は大化の改新を进めた中大兄皇子です。|Tenji was Prince Naka no Oe.|天智天皇即推动大化革新的中大兄皇子。"]],
    "関东と九州の両方で名前が见つかったことから、大和政権の势力が広い范囲におよんでいたとわかる。|Finds in both Kanto and Kyushu show Yamato's wide reach.|在关东与九州都发现其名，可知大和政权的势力范围很广。"),
];
/* Part3 飞鸟时代 */
const h3=[ORD(Y_ANC.slice(2,10)),ORD(Y_ANC.slice(2,10)),
  Q("家がらにとらわれず、才能や功绩のある人を役人に取り立てるための制度は？|Which system promoted officials by talent and merit, not family?|不拘家世、任用有才能与功绩者为官的制度是？","冠位十二阶|The Twelve Cap Ranks|冠位十二阶",
    [["十七条の宪法|Seventeen-Article Constitution|十七条宪法","十七条の宪法は、役人の心构えを示したものです。|It set out officials' attitudes.|十七条宪法揭示官员应有的态度。"],["班田収授法|Handen system|班田收授法","班田収授法は人々に口分田をあたえる制度です。|It gave rice land to people.|班田收授法是分配口分田给人民的制度。"],["御成败式目|Goseibai Shikimoku|御成败式目","御成败式目は镰仓时代の武士の法律です。|A Kamakura samurai code.|御成败式目是镰仓时代的武士法律。"]],
    "冠位十二阶（603年）・十七条の宪法（604年）は圣徳太子が定めた。|Both were set by Prince Shotoku (603, 604).|冠位十二阶（603年）、十七条宪法（604年）都由圣德太子制定。"),
  Q("仏教や儒教の考えを取り入れ、役人の心构えを示したものは？|What set out officials' attitudes, drawing on Buddhism and Confucianism?|融入佛教、儒教思想，揭示官员应有态度的是？","十七条の宪法|Seventeen-Article Constitution|十七条宪法",
    [["冠位十二阶|Twelve Cap Ranks|冠位十二阶","冠位十二阶は役人を才能で取り立てる制度です。|It's about promoting by talent.|冠位十二阶是依才能任用官员的制度。"],["大宝律令|Taiho Code|大宝律令","大宝律令は701年の、唐にならった法律です。|A 701 legal code modeled on Tang.|大宝律令是701年仿效唐朝的法律。"],["垦田永年私财法|Konden Einen Shizai Law|垦田永年私财法","垦田永年私财法は开垦した土地の私有を认めた法律です。|It allowed private land.|垦田永年私财法是承认开垦土地私有的法律。"]],
    "「和をもって贵しとなし」「あつく三宝（仏・法・僧）を敬え」などと记した。|It says \"Harmony is to be valued\" and \"Revere the Three Treasures\".|写有「以和为贵」「笃敬三宝（佛、法、僧）」等。"),
  Q("607年に遣隋使として中国へ送られた人物は？|Who was sent to China as envoy to Sui in 607?|607年以遣隋使身分被派往中国的人是？","小野妹子|Ono no Imoko|小野妹子",
    [["中臣镰足|Nakatomi no Kamatari|中臣镰足","中臣镰足は中大兄皇子と大化の改新を进めた人物です。|He led the Taika Reform with Naka no Oe.|中臣镰足是与中大兄皇子推动大化革新的人。"],["鉴真|Ganjin (Jianzhen)|鉴真","鉴真は奈良时代に唐から来日した僧です。|Ganjin came from Tang in the Nara period.|鉴真是奈良时代从唐朝来日的僧人。"],["菅原道真|Sugawara no Michizane|菅原道真","菅原道真は894年に遣唐使の停止を提案した人物です。|He proposed stopping envoys in 894.|菅原道真是894年提议停派遣唐使的人。"]],
    "遣隋使は、隋の进んだ制度や文化を学ぶため。留学生や僧も同行した。|To learn Sui China's systems and culture; students and monks went too.|遣隋使是为了学习隋朝先进的制度与文化，留学生与僧侣也随行。"),
  Q("圣徳太子が建てたとされ、现存する世界最古の木造建筑は？|Which temple, said to be built by Prince Shotoku, is the world's oldest surviving wooden building?|相传由圣德太子建造、现存世界最古老的木造建筑是？","法隆寺|Horyuji|法隆寺",
    [["东大寺|Todaiji|东大寺","东大寺は奈良时代に圣武天皇が建て、大仏があります。|Todaiji (Nara period) has the Great Buddha.|东大寺是奈良时代圣武天皇所建，有大佛。"],["平等院凤凰堂|Byodoin Phoenix Hall|平等院凤凰堂","平等院凤凰堂は平安时代に藤原頼通が建てました。|Built by Fujiwara no Yorimichi (Heian).|平等院凤凰堂是平安时代藤原赖通所建。"],["唐招提寺|Toshodaiji|唐招提寺","唐招提寺は奈良时代に鉴真が开いた寺です。|Founded by Ganjin (Nara period).|唐招提寺是奈良时代鉴真开创的寺院。"]],
    "法隆寺など、日本で最初の仏教文化を飞鸟文化という。|Japan's first Buddhist culture is called Asuka culture.|法隆寺等日本最早的佛教文化称为飞鸟文化。"),
  Q("645年、中大兄皇子と中臣镰足が苏我氏をたおして始めた政治の改革は？|What reform began in 645 when Naka no Oe and Nakatomi no Kamatari overthrew the Soga?|645年中大兄皇子与中臣镰足推翻苏我氏后展开的政治改革是？","大化の改新|The Taika Reform|大化革新",
    [["壬申の乱|The Jinshin War|壬申之乱","壬申の乱は672年の、天皇の后つぎをめぐる争いです。|A 672 succession war.|壬申之乱是672年的天皇继承之争。"],["承久の乱|The Jokyu War|承久之乱","承久の乱は1221年に后鸟羽上皇が起こした戦いです。|Emperor Go-Toba's 1221 revolt.|承久之乱是1221年后鸟羽上皇发动的战争。"],["建武の新政|Kenmu Restoration|建武新政","建武の新政は1334年に后醍醐天皇が始めた政治です。|Go-Daigo's 1334 rule.|建武新政是1334年后醍醐天皇开始的政治。"]],
    "大化の改新では、土地と人々を国のもの（公地公民）とする方针を示した。|It made land and people public (state-owned).|大化革新提出土地与人民归国家所有（公地公民）的方针。"),
  Q("大化の改新で示された、土地と人々を国が直接支配する方针は？|Under the Taika Reform, the policy that land and people belong to the state was…|大化革新提出、由国家直接支配土地与人民的方针是？","公地公民|Public land and public people|公地公民",
    [["垦田永年私财法|Konden Einen Shizai Law|垦田永年私财法","垦田永年私财法は、开垦した土地の私有を认めた奈良时代の法律です。|It allowed private ownership (Nara).|垦田永年私财法是承认开垦土地私有的奈良时代法律。"],["御恩と奉公|Favor and service|御恩与奉公","御恩と奉公は镰仓幕府の将军と御家人の関系です。|It's the shogun–vassal bond (Kamakura).|御恩与奉公是镰仓幕府将军与御家人的关系。"],["下克上|Gekokujo|下克上","下克上は室町时代の、下の者が上の者をたおす风潮です。|It's the Muromachi trend of overthrowing superiors.|下克上是室町时代以下犯上的风潮。"]],
    "それまで豪族が支配していた土地と人々を、国家が直接支配することにした。|Land and people once held by clans came under the state.|原本由豪族支配的土地与人民，改由国家直接支配。"),
  Q("663年、百済を助けるため送った日本の军が、唐と新罗の连合军に败れた戦いは？|In 663, Japan's army helping Baekje lost to Tang and Silla in which battle?|663年日本为援助百济出兵，败给唐与新罗联军的战役是？","白村江の戦い|Battle of Baekgang|白村江之战",
    [["坛ノ浦の戦い|Battle of Dan-no-ura|坛之浦之战","坛ノ浦の戦いは1185年に源氏が平氏をほろぼした戦いです。|In 1185 the Minamoto destroyed the Taira.|坛之浦之战是1185年源氏消灭平氏的战役。"],["壬申の乱|The Jinshin War|壬申之乱","壬申の乱は672年の国内の争いです。|A 672 civil war.|壬申之乱是672年的国内争斗。"],["応仁の乱|The Onin War|应仁之乱","応仁の乱は1467年に始まった室町时代の戦乱です。|A Muromachi war from 1467.|应仁之乱是1467年开始的室町时代战乱。"]],
    "败戦后、唐や新罗の攻撃に备え、九州に大宰府を置き、山城や水城を筑き、防人を送った。|Afterward Japan built defenses in Kyushu and sent sakimori guards.|战败后为防备唐与新罗进攻，在九州设大宰府、筑山城与水城，并派遣防人。"),
  Q("672年の壬申の乱に胜って即位した天皇は？|Who won the Jinshin War of 672 and became emperor?|赢得672年壬申之乱而即位的天皇是？","天武天皇|Emperor Tenmu|天武天皇",
    [["天智天皇|Emperor Tenji|天智天皇","天智天皇は中大兄皇子が即位した天皇で、その死后に壬申の乱が起こりました。|Tenji (Naka no Oe); the war came after his death.|天智天皇即中大兄皇子，其死后发生壬申之乱。"],["圣武天皇|Emperor Shomu|圣武天皇","圣武天皇は奈良时代の天皇です。|Shomu is Nara period.|圣武天皇是奈良时代的天皇。"],["桓武天皇|Emperor Kanmu|桓武天皇","桓武天皇は794年に平安京に都を移した天皇です。|Kanmu moved the capital in 794.|桓武天皇是794年迁都平安京的天皇。"]],
    "天武天皇（大海人皇子）は天皇中心の国づくりを进め、のちの大宝律令につながった。|Tenmu strengthened imperial rule, leading to the Taiho Code.|天武天皇（大海人皇子）推动以天皇为中心的国家建设，促成日后的大宝律令。"),
  Q("701年、唐の律令にならってつくられた法律は？|What law code, modeled on Tang China, was made in 701?|701年仿效唐朝律令制定的法律是？","大宝律令|Taiho Code|大宝律令",
    [["十七条の宪法|Seventeen-Article Constitution|十七条宪法","十七条の宪法は604年に圣徳太子が定めました。|Shotoku's 604 rules.|十七条宪法是604年圣德太子制定的。"],["御成败式目|Goseibai Shikimoku|御成败式目","御成败式目は1232年の武士の法律です。|A 1232 samurai code.|御成败式目是1232年的武士法律。"],["分国法|Bunkokuho|分国法","分国法は戦国大名が定めたきまりです。|Rules of Sengoku daimyo.|分国法是战国大名制定的规定。"]],
    "律は刑罚のきまり、令は政治のしくみのきまり。|Ritsu = penal law; ryo = administrative law.|律是刑罚的规定，令是政治制度的规定。"),
];
/* Part4 奈良时代 */
const TAX=[["租|So|租","稲（収获の约3%）を纳める|Pay rice (about 3% of the harvest)|缴纳稻米（收获的约3%）"],["调|Cho|调","地方の特产物を纳める|Pay local products|缴纳地方特产"],["庸|Yo|庸","労役の代わりに布を纳める|Pay cloth instead of labor in the capital|以布代替劳役"],
  ["雑徭|Zoyo|杂徭","国司のもとで土木工事などで働く|Labor on local works under the governor|在国司之下从事土木等劳动"],["防人|Sakimori|防人","九州北部の守りにつく兵役|Military service guarding northern Kyushu|守卫九州北部的兵役"]];
const h4=[ORD(Y_ANC.slice(9,14)),...TB(TAX,"奈良时代の人々の负担で、「{a}」の内容は？|In the Nara period, what was the burden called {a}?|奈良时代人民的负担中，「{a}」的内容是？","奈良时代の人々の负担で、「{b}」ことを何という？|In the Nara period, the burden \"{b}\" was called…|奈良时代人民的负担中，「{b}」叫做？","{a}：{b}。|{a}: {b}.|{a}：{b}。"),
  Q("710年、唐の都・长安にならってつくられた都は？|Which capital, built in 710, was modeled on Chang'an?|710年仿效唐都长安建造的都城是？","平城京|Heijo-kyo|平城京",
    [["平安京|Heian-kyo|平安京","平安京は794年に京都につくられた都です。|Heian-kyo (Kyoto), 794.|平安京是794年建于京都的都城。"],["藤原京|Fujiwara-kyo|藤原京","藤原京は平城京の前の都です。|The capital before Heijo-kyo.|藤原京是平城京之前的都城。"],["大宰府|Dazaifu|大宰府","大宰府は九州に置かれた役所で、都ではありません。|An office in Kyushu, not a capital.|大宰府是设在九州的官署，不是都城。"]],
    "平城京（奈良）に都があった约80年间を奈良时代という。|The ~80 years with the capital at Heijo-kyo are the Nara period.|都城位于平城京（奈良）的约80年称为奈良时代。"),
  Q("6歳以上のすべての男女に口分田をあたえ、死ぬと国に返させた制度は？|Which system gave rice land to everyone 6 and older, returned at death?|分配口分田给6岁以上所有男女、死后归还国家的制度是？","班田収授法|Handen Shuju system|班田收授法",
    [["垦田永年私财法|Konden Einen Shizai Law|垦田永年私财法","垦田永年私财法は、开垦した土地を永久に自分のものにできる法律です。|It allowed permanent private land.|垦田永年私财法是允许开垦土地永久私有的法律。"],["冠位十二阶|Twelve Cap Ranks|冠位十二阶","冠位十二阶は役人の位を决める制度です。|It ranked officials.|冠位十二阶是决定官员位阶的制度。"],["御成败式目|Goseibai Shikimoku|御成败式目","御成败式目は镰仓时代の法律です。|A Kamakura code.|御成败式目是镰仓时代的法律。"]],
    "人口がふえ、口分田が足りなくなったため、743年に垦田永年私财法が出された。|Population grew and land ran short → the 743 law.|人口增加导致口分田不足，因此在743年颁布垦田永年私财法。"),
  Q("743年に出された、新しく开垦した土地の永久の私有を认めた法律は？|Which 743 law allowed permanent private ownership of newly cleared land?|743年颁布、承认新开垦土地可永久私有的法律是？","垦田永年私财法|Konden Einen Shizai Law|垦田永年私财法",
    [["班田収授法|Handen Shuju system|班田收授法","班田収授法は口分田をあたえて、死ぬと返させる制度です。|It gave land returned at death.|班田收授法是分配口分田、死后归还的制度。"],["大宝律令|Taiho Code|大宝律令","大宝律令は701年の法律です。|The 701 code.|大宝律令是701年的法律。"],["徳政令|Tokuseirei|德政令","徳政令は借金を帐消しにする法令（镰仓・室町时代）です。|Debt cancellation (Kamakura/Muromachi).|德政令是取消债务的法令（镰仓、室町时代）。"]],
    "贵族や寺社が开垦を进めて私有地を広げ、のちの荘园のもとになった。|Nobles and temples expanded private land → later estates (shoen).|贵族与寺社积极开垦、扩大私有地，成为日后庄园的起源。"),
  Q("仏教の力で国を守ろうと、国ごとに国分寺・国分尼寺を、都に东大寺を建てた天皇は？|Which emperor built provincial temples and Todaiji to protect the country through Buddhism?|想藉佛教力量守护国家，在各国建国分寺、国分尼寺，在京城建东大寺的天皇是？","圣武天皇|Emperor Shomu|圣武天皇",
    [["桓武天皇|Emperor Kanmu|桓武天皇","桓武天皇は平安京に都を移した天皇です。|Kanmu moved the capital to Heian-kyo.|桓武天皇是迁都平安京的天皇。"],["天武天皇|Emperor Tenmu|天武天皇","天武天皇は壬申の乱に胜った飞鸟时代の天皇です。|Tenmu is Asuka period.|天武天皇是赢得壬申之乱的飞鸟时代天皇。"],["后醍醐天皇|Emperor Go-Daigo|后醍醐天皇","后醍醐天皇は建武の新政を行った天皇です。|Go-Daigo led the Kenmu Restoration.|后醍醐天皇是推行建武新政的天皇。"]],
    "圣武天皇のころ、伝染病やききんが広がり、社会が不安定だった。|Epidemics and famine made society unstable then.|圣武天皇时期，传染病与饥荒蔓延，社会动荡不安。"),
  Q("民众に仏教を広め、东大寺の大仏づくりに协力した僧は？|Which monk spread Buddhism among the people and helped build the Great Buddha?|向民众传布佛教、协助建造东大寺大佛的僧人是？","行基|Gyoki|行基",
    [["鉴真|Ganjin|鉴真","鉴真は唐から来日し、正しい仏教の教えを伝えた僧です。|Ganjin came from Tang to teach Buddhist rules.|鉴真是从唐朝来日、传授正统佛法的僧人。"],["最澄|Saicho|最澄","最澄は平安时代に天台宗を开いた僧です。|Saicho founded Tendai (Heian).|最澄是平安时代开创天台宗的僧人。"],["空海|Kukai|空海","空海は平安时代に真言宗を开いた僧です。|Kukai founded Shingon (Heian).|空海是平安时代开创真言宗的僧人。"]],
    "行基は桥や池などをつくる社会事业も行い、民众にしたわれた。|Gyoki also built bridges and ponds and was loved by the people.|行基也从事造桥、修池等社会事业，深受民众爱戴。"),
  Q("何度も航海に失败しながら唐から来日し、唐招提寺を开いた僧は？|Which monk came from Tang after many failed voyages and founded Toshodaiji?|经历多次航海失败后从唐朝来日、开创唐招提寺的僧人是？","鉴真|Ganjin (Jianzhen)|鉴真",
    [["行基|Gyoki|行基","行基は日本の僧で、大仏づくりに协力しました。|A Japanese monk who helped build the Buddha.|行基是日本僧人，协助建造大佛。"],["空海|Kukai|空海","空海は遣唐使とともに唐へ行き、帰国して真言宗を开きました。|Kukai went to Tang and founded Shingon.|空海随遣唐使赴唐，回国后开创真言宗。"],["栄西|Eisai|荣西","栄西は镰仓时代に宋から临済宗を伝えました。|Eisai brought Rinzai Zen from Song (Kamakura).|荣西于镰仓时代从宋朝传入临济宗。"]],
    "鉴真は来日までに视力を失ったといわれる。|Ganjin is said to have lost his sight before arriving.|相传鉴真来日前已失明。"),
  Q("圣武天皇の遗品などがおさめられ、西アジアやインドから伝わった品もある东大寺の仓は？|Which Todaiji storehouse holds Emperor Shomu's belongings, including items from West Asia and India?|收藏圣武天皇遗物，也有来自西亚、印度物品的东大寺仓库是？","正仓院|Shosoin|正仓院",
    [["法隆寺|Horyuji|法隆寺","法隆寺は飞鸟时代の寺です。|Horyuji is an Asuka temple.|法隆寺是飞鸟时代的寺院。"],["平等院凤凰堂|Byodoin Phoenix Hall|平等院凤凰堂","平等院凤凰堂は平安时代の阿弥陀堂です。|A Heian Amida hall.|平等院凤凰堂是平安时代的阿弥陀堂。"],["中尊寺金色堂|Chusonji Golden Hall|中尊寺金色堂","中尊寺金色堂は平安时代に奥州藤原氏が建てました。|Built by the Northern Fujiwara (Heian).|中尊寺金色堂是平安时代奥州藤原氏所建。"]],
    "正仓院の宝物から、シルクロードを通じて伝わった国际色豊かな天平文化がわかる。|Shosoin treasures show the cosmopolitan Tenpyo culture via the Silk Road.|从正仓院的宝物可看出经由丝路传来、充满国际色彩的天平文化。"),
  Q("奈良时代にまとめられた、日本の神话や国のおこりを记した歴史书は？|Which histories of Japan's myths and origins were compiled in the Nara period?|奈良时代编纂、记载日本神话与建国起源的史书是？","『古事记』『日本书纪』|Kojiki and Nihon Shoki|《古事记》《日本书纪》",
    [["『万叶集』『古今和歌集』|Man'yoshu and Kokinshu|《万叶集》《古今和歌集》","どちらも和歌集で、『古今和歌集』は平安时代です。|Both are poetry; Kokinshu is Heian.|两者都是和歌集，《古今和歌集》是平安时代。"],["『源氏物语』『枕草子』|The Tale of Genji and The Pillow Book|《源氏物语》《枕草子》","どちらも平安时代の文学です。|Both are Heian literature.|两者都是平安时代的文学。"],["『徒然草』『方丈记』|Tsurezuregusa and Hojoki|《徒然草》《方丈记》","どちらも镰仓时代の随笔です。|Both are Kamakura essays.|两者都是镰仓时代的随笔。"]],
    "『古事记』（712年）・『日本书纪』（720年）。国ごとの地理や伝说は『风土记』にまとめられた。|Kojiki (712), Nihon Shoki (720); local geography and legends went into the Fudoki.|《古事记》（712年）、《日本书纪》（720年）；各国的地理与传说汇整于《风土记》。"),
  Q("天皇から防人・农民まで、さまざまな人の和歌约4500首を集めた歌集は？|Which anthology gathers about 4,500 poems by people from emperors to border guards and farmers?|收录从天皇到防人、农民等各种人约4500首和歌的歌集是？","『万叶集』|Man'yoshu|《万叶集》",
    [["『古今和歌集』|Kokin Wakashu|《古今和歌集》","『古今和歌集』は平安时代に纪贯之らがまとめた歌集です。|Compiled by Ki no Tsurayuki and others (Heian).|《古今和歌集》是平安时代纪贯之等人编纂的歌集。"],["『新古今和歌集』|Shin Kokin Wakashu|《新古今和歌集》","『新古今和歌集』は镰仓时代の歌集です。|A Kamakura anthology.|《新古今和歌集》是镰仓时代的歌集。"],["『风土记』|Fudoki|《风土记》","『风土记』は国ごとの地理・产物・伝说などの记录です。|Records of local geography and legends.|《风土记》是各国地理、物产、传说等的纪录。"]],
    "『万叶集』は大伴家持がまとめたとされる。万叶がなで书かれている。|Thought to be compiled by Otomo no Yakamochi; written in man'yogana.|《万叶集》相传由大伴家持编纂，以万叶假名书写。"),
  Q("唐の制度や文化を学ぶため、奈良时代などに送られた使节は？|What envoys were sent to learn Tang China's systems and culture?|为了学习唐朝制度与文化而派遣的使节是？","遣唐使|Envoys to Tang|遣唐使",
    [["遣隋使|Envoys to Sui|遣隋使","遣隋使は唐の前の王朝・隋に送った使节です。|They went to Sui, before Tang.|遣隋使是派往唐朝前一个王朝隋的使节。"],["渡来人|Toraijin|渡来人","渡来人は大陆から日本に移り住んだ人々です。|They moved to Japan.|渡来人是从大陆移居日本的人。"],["防人|Sakimori|防人","防人は九州北部を守った兵士です。|Border guards.|防人是守卫九州北部的士兵。"]],
    "遣唐使は894年、菅原道真の提案で停止された。|Envoys to Tang were stopped in 894 at Michizane's suggestion.|遣唐使于894年依菅原道真的提议而停派。"),
];
/* Part5 平安时代 */
const h5=[ORD(Y_ANC.slice(13)),
  Q("794年、桓武天皇が都を移した场所は？|Where did Emperor Kanmu move the capital in 794?|794年桓武天皇迁都的地方是？","平安京（京都）|Heian-kyo (Kyoto)|平安京（京都）",
    [["平城京（奈良）|Heijo-kyo (Nara)|平城京（奈良）","平城京は710年に移した都です。|Heijo-kyo was 710.|平城京是710年迁入的都城。"],["镰仓|Kamakura|镰仓","镰仓は源頼朝が幕府を置いた所です。|Kamakura was Yoritomo's base.|镰仓是源赖朝设立幕府的地方。"],["藤原京|Fujiwara-kyo|藤原京","藤原京は平城京より前の都です。|It came before Heijo-kyo.|藤原京是平城京之前的都城。"]],
    "桓武天皇は、仏教势力の强い奈良をはなれ、政治を立て直そうとした。|Kanmu left Nara, where Buddhist temples had grown too powerful.|桓武天皇想远离佛教势力强大的奈良，重整政治。"),
  Q("征夷大将军として、东北地方の虾夷を従わせた人物は？|Who, as seii taishogun, subdued the Emishi of northeastern Japan?|以征夷大将军身分征服东北地方虾夷的人是？","坂上田村麻吕|Sakanoue no Tamuramaro|坂上田村麻吕",
    [["源頼朝|Minamoto no Yoritomo|源赖朝","源頼朝は1192年に征夷大将军となり、镰仓幕府を开いた人物です。|Yoritomo became shogun in 1192 (Kamakura).|源赖朝于1192年成为征夷大将军，开创镰仓幕府。"],["足利尊氏|Ashikaga Takauji|足利尊氏","足利尊氏は1338年に征夷大将军となり、室町幕府を开きました。|Takauji became shogun in 1338 (Muromachi).|足利尊氏于1338年成为征夷大将军，开创室町幕府。"],["平清盛|Taira no Kiyomori|平清盛","平清盛は太政大臣になった武士です。|Kiyomori became chancellor.|平清盛是成为太政大臣的武士。"]],
    "坂上田村麻吕は、虾夷の指导者アテルイを降伏させた。|He made the Emishi leader Aterui surrender.|坂上田村麻吕迫使虾夷首领阿弖流为投降。"),
  Q("唐から帰国し、比叡山に延暦寺を建てて天台宗を広めた僧は？|Which monk, back from Tang, founded Enryakuji on Mt. Hiei and spread Tendai?|从唐朝回国、在比叡山建延历寺、传布天台宗的僧人是？","最澄|Saicho|最澄",
    [["空海|Kukai|空海","空海は高野山に金刚峰寺を建て、真言宗を开きました。|Kukai: Kongobuji, Mt. Koya, Shingon.|空海在高野山建金刚峰寺，开创真言宗。"],["法然|Honen|法然","法然は镰仓时代に浄土宗を开きました。|Honen founded Jodo (Kamakura).|法然于镰仓时代开创净土宗。"],["鉴真|Ganjin|鉴真","鉴真は奈良时代に唐招提寺を开きました。|Ganjin founded Toshodaiji (Nara).|鉴真于奈良时代开创唐招提寺。"]],
    "最澄（天台宗・比叡山延暦寺）、空海（真言宗・高野山金刚峰寺）。山の中で修行する仏教。|Saicho (Tendai, Mt. Hiei) and Kukai (Shingon, Mt. Koya): mountain-based Buddhism.|最澄（天台宗、比叡山延历寺）、空海（真言宗、高野山金刚峰寺）：在山中修行的佛教。"),
  Q("高野山に金刚峰寺を建て、真言宗を広めた僧は？|Which monk founded Kongobuji on Mt. Koya and spread Shingon?|在高野山建金刚峰寺、传布真言宗的僧人是？","空海|Kukai|空海",
    [["最澄|Saicho|最澄","最澄は比叡山に延暦寺を建て、天台宗を开きました。|Saicho: Enryakuji, Tendai.|最澄在比叡山建延历寺，开创天台宗。"],["亲鸾|Shinran|亲鸾","亲鸾は镰仓时代に浄土真宗を开きました。|Shinran: Jodo Shinshu (Kamakura).|亲鸾于镰仓时代开创净土真宗。"],["行基|Gyoki|行基","行基は奈良时代に大仏づくりに协力した僧です。|Gyoki helped build the Buddha (Nara).|行基是奈良时代协助建造大佛的僧人。"]],
    "空海は书の名人としても知られる。|Kukai was also a master calligrapher.|空海也以书法名家闻名。"),
  Q("894年、遣唐使の停止を提案した人物は？|Who proposed stopping the envoys to Tang in 894?|894年提议停派遣唐使的人是？","菅原道真|Sugawara no Michizane|菅原道真",
    [["藤原道长|Fujiwara no Michinaga|藤原道长","藤原道长は摂関政治の全盛期を筑いた人物です。|Michinaga led the regency at its peak.|藤原道长是开创摄关政治全盛期的人。"],["小野妹子|Ono no Imoko|小野妹子","小野妹子は607年の遣隋使です。|Imoko went to Sui in 607.|小野妹子是607年的遣隋使。"],["纪贯之|Ki no Tsurayuki|纪贯之","纪贯之は『古今和歌集』をまとめた歌人です。|Tsurayuki compiled the Kokinshu.|纪贯之是编纂《古今和歌集》的歌人。"]],
    "唐がおとろえ、航海も危険だったため。のちに日本の风土に合った国风文化が栄えた。|Tang was declining and voyages were risky; then Japanese-style culture flourished.|因唐朝衰落、航海危险；之后符合日本风土的国风文化兴盛。"),
  Q("藤原氏が、娘を天皇のきさきにし、生まれた子を天皇に立てて、摂政・関白として行った政治は？|What was the Fujiwara rule as regents, by marrying daughters to emperors?|藤原氏让女儿成为天皇后妃，立其所生之子为天皇，并以摄政、关白身分主政的政治是？","摂関政治|Regency government (sekkan)|摄关政治",
    [["院政|Cloister rule (insei)|院政","院政は、位をゆずった上皇が行う政治です。|Insei is rule by a retired emperor.|院政是让位后的上皇主持的政治。"],["执権政治|Regent rule (shikken)|执权政治","执権政治は镰仓幕府で北条氏が行った政治です。|Shikken rule was by the Hojo (Kamakura).|执权政治是镰仓幕府中北条氏主持的政治。"],["建武の新政|Kenmu Restoration|建武新政","建武の新政は后醍醐天皇が行った政治です。|Go-Daigo's rule.|建武新政是后醍醐天皇推行的政治。"]],
    "摂政：天皇が幼いときに代わりに政治を行う。関白：成人した天皇を补佐する。|Sessho rules for a child emperor; kanpaku assists an adult emperor.|摄政：天皇年幼时代为执政；关白：辅佐成年天皇。"),
  Q("摂関政治の全盛期を筑き、「この世をば わが世とぞ思ふ…」の歌をよんだ人物は？|Who led the regency at its peak and wrote the poem \"This world, I think, is my world…\"?|开创摄关政治全盛期，并咏出「此世即我世…」和歌的人是？","藤原道长|Fujiwara no Michinaga|藤原道长",
    [["藤原頼通|Fujiwara no Yorimichi|藤原赖通","藤原頼通は道长の子で、平等院凤凰堂を建てました。|His son; built the Phoenix Hall.|藤原赖通是道长之子，建造平等院凤凰堂。"],["中臣镰足|Nakatomi no Kamatari|中臣镰足","中臣镰足は藤原氏の祖先で、飞鸟时代の人物です。|The Fujiwara ancestor (Asuka).|中臣镰足是藤原氏的祖先，飞鸟时代人物。"],["平清盛|Taira no Kiyomori|平清盛","平清盛は武士で初めて太政大臣になりました。|The first samurai chancellor.|平清盛是第一位成为太政大臣的武士。"]],
    "11世纪前半、藤原道长・頼通の父子のころが摂関政治の全盛期。|The peak was under Michinaga and his son Yorimichi (early 11th c.).|11世纪前半，藤原道长、赖通父子时期是摄关政治的全盛期。"),
  Q("かな文本が広まった、日本の风土や生活に合った平安时代の文化は？|Which Heian culture, suited to Japanese life, spread kana writing?|假名普及、符合日本风土与生活的平安时代文化是？","国风文化|Kokufu (national) culture|国风文化",
    [["天平文化|Tenpyo culture|天平文化","天平文化は奈良时代の、唐の影响を强く受けた文化です。|Tenpyo (Nara) was strongly Tang-influenced.|天平文化是奈良时代深受唐朝影响的文化。"],["飞鸟文化|Asuka culture|飞鸟文化","飞鸟文化は日本で最初の仏教文化です。|Asuka was Japan's first Buddhist culture.|飞鸟文化是日本最早的佛教文化。"],["北山文化|Kitayama culture|北山文化","北山文化は室町时代、足利义満のころの文化です。|Kitayama is Muromachi (Yoshimitsu).|北山文化是室町时代足利义满时期的文化。"]],
    "国风文化：かな文本・『源氏物语』・『枕草子』・『古今和歌集』・寝殿造・大和絵。|Kokufu: kana, Genji, Pillow Book, Kokinshu, shinden style, yamato-e.|国风文化：假名、《源氏物语》、《枕草子》、《古今和歌集》、寝殿造、大和绘。"),
  Q("『源氏物语』を书いた人物は？|Who wrote The Tale of Genji?|《源氏物语》的作者是？","紫式部|Murasaki Shikibu|紫式部",
    [["清少纳言|Sei Shonagon|清少纳言","清少纳言は随笔『枕草子』を书きました。|She wrote The Pillow Book.|清少纳言写了随笔《枕草子》。"],["纪贯之|Ki no Tsurayuki|纪贯之","纪贯之は『古今和歌集』をまとめ、『土佐日记』を书きました。|He compiled the Kokinshu and wrote the Tosa Diary.|纪贯之编纂《古今和歌集》，并写了《土佐日记》。"],["兼好法师|Kenko|兼好法师","兼好法师は镰仓时代の随笔『徒然草』を书きました。|He wrote Tsurezuregusa (Kamakura).|兼好法师写了镰仓时代的随笔《徒然草》。"]],
    "紫式部と清少纳言は、天皇のきさきに仕えた女性。|Both women served imperial consorts.|紫式部与清少纳言都是侍奉天皇后妃的女性。"),
  Q("藤原頼通が建てた、阿弥陀仏をまつる阿弥陀堂は？|Which Amida hall did Fujiwara no Yorimichi build?|藤原赖通建造、供奉阿弥陀佛的阿弥陀堂是？","平等院凤凰堂|Byodoin Phoenix Hall|平等院凤凰堂",
    [["中尊寺金色堂|Chusonji Golden Hall|中尊寺金色堂","中尊寺金色堂は奥州藤原氏が平泉（岩手県）に建てた阿弥陀堂です。|Built by the Northern Fujiwara in Hiraizumi.|中尊寺金色堂是奥州藤原氏在平泉（岩手县）建造的阿弥陀堂。"],["东大寺|Todaiji|东大寺","东大寺は奈良时代に圣武天皇が建てました。|Built by Shomu (Nara).|东大寺是奈良时代圣武天皇所建。"],["金阁|Kinkaku (Golden Pavilion)|金阁","金阁は室町时代に足利义満が建てました。|Built by Yoshimitsu (Muromachi).|金阁是室町时代足利义满所建。"]],
    "念仏を唱えて阿弥陀仏にすがり、死后に极楽浄土へ生まれ変わることを愿う浄土信仰が広まった。|Pure Land faith spread: chant to Amida to be reborn in paradise.|净土信仰普及：念佛号仰赖阿弥陀佛，祈求死后往生极乐净土。"),
  Q("1086年、白河天皇が位をゆずって上皇となり、始めた政治は？|What rule did Shirakawa start in 1086 after stepping down as emperor?|1086年白河天皇让位成为上皇后开始的政治是？","院政|Cloister rule (insei)|院政",
    [["摂関政治|Regency government|摄关政治","摂関政治は藤原氏が摂政・関白として行った政治です。|The Fujiwara regency.|摄关政治是藤原氏以摄政、关白身分主持的政治。"],["执権政治|Shikken rule|执权政治","执権政治は镰仓幕府の北条氏の政治です。|The Hojo in Kamakura.|执权政治是镰仓幕府北条氏的政治。"],["建武の新政|Kenmu Restoration|建武新政","建武の新政は1334年に后醍醐天皇が始めました。|Go-Daigo, 1334.|建武新政是1334年后醍醐天皇开始的。"]],
    "院政で、藤原氏の摂関政治はおとろえた。上皇は武士を重く用いた。|Insei weakened the Fujiwara; retired emperors relied on samurai.|院政使藤原氏的摄关政治衰退，上皇重用武士。"),
  Q("武士として初めて太政大臣になり、日宋贸易を进めた人物は？|Who was the first samurai to become chancellor and promoted trade with Song China?|第一位成为太政大臣的武士、推动日宋贸易的人是？","平清盛|Taira no Kiyomori|平清盛",
    [["源頼朝|Minamoto no Yoritomo|源赖朝","源頼朝は镰仓幕府を开いた人物です。|Yoritomo founded the Kamakura shogunate.|源赖朝是开创镰仓幕府的人。"],["藤原道长|Fujiwara no Michinaga|藤原道长","藤原道长は贵族で、摂関政治を行いました。|Michinaga was a court noble.|藤原道长是贵族，推行摄关政治。"],["足利义満|Ashikaga Yoshimitsu|足利义满","足利义満は室町时代に日明贸易を始めました。|Yoshimitsu began trade with Ming.|足利义满于室町时代开始日明贸易。"]],
    "平清盛は兵库の港（大轮田泊）を整え、厳岛神社（広岛県）を厚く敬った。|He improved the port of Owada (Kobe) and honored Itsukushima Shrine.|平清盛整修兵库港口（大轮田泊），并崇敬严岛神社（广岛县）。"),
  Q("平安时代の贵族の住まいの様式は？|What style were Heian aristocrats' homes?|平安时代贵族的住宅样式是？","寝殿造|Shinden-zukuri|寝殿造",
    [["书院造|Shoin-zukuri|书院造","书院造は室町时代に広まった、たたみや床の间のある様式です。|Shoin style (tatami, alcove) is Muromachi.|书院造是室町时代普及、有榻榻米和床之间的样式。"],["竖穴住居|Pit dwelling|竖穴式住居","竖穴住居は縄文・弥生时代の住まいです。|Jomon/Yayoi homes.|竖穴式住居是绳文、弥生时代的住所。"],["校仓造|Azekura style|校仓造","校仓造は正仓院などの仓の建て方です。|The log style of storehouses like Shosoin.|校仓造是正仓院等仓库的建造方式。"]],
    "寝殿造：中央の寝殿と、池のある庭をもつ広い屋敷。|A main hall with a garden and pond.|寝殿造：有中央寝殿与附池庭园的宽广宅邸。"),
];
/* ========== ⑤ 中世の日本（歴史的分野 B(2)） ========== */
/* 镰仓幕府の始まりは「成立年」を问わず、できごとで出す（1185年 守护・地头、1192年 征夷大将军） */
const Y_MED=[["1185年|1185|1185年","守护・地头を置く|Shugo and jito are appointed|设置守护、地头","この年、坛ノ浦の戦いで平氏がほろびた。|The same year, the Taira fell at Dan-no-ura.|同年平氏于坛之浦之战灭亡。"],
  ["1192年|1192|1192年","源頼朝が征夷大将军になる|Minamoto no Yoritomo becomes shogun|源赖朝成为征夷大将军","镰仓に武士の政権（幕府）。|A samurai government at Kamakura.|在镰仓创建武士政权（幕府）。"],
  ["1221年|1221|1221年","承久の乱|The Jokyu War|承久之乱","后鸟羽上皇が败れ、京都に六波罗探题が置かれた。|Go-Toba lost; Rokuhara Tandai set up in Kyoto.|后鸟羽上皇战败，京都设置六波罗探题。"],
  ["1232年|1232|1232年","御成败式目を定める|The Goseibai Shikimoku is issued|制定御成败式目","执権北条泰时。武士の最初の法律。|By regent Hojo Yasutoki; the first samurai law code.|执权北条泰时制定，最早的武士法律。"],
  ["1274年|1274|1274年","文永の役（1度目の元寇）|Bun'ei campaign (1st Mongol invasion)|文永之役（第一次元日战争）","元の皇帝フビライ・ハン。执権は北条时宗。|Kublai Khan; regent Hojo Tokimune.|元朝皇帝忽必烈；执权为北条时宗。"],
  ["1281年|1281|1281年","弘安の役（2度目の元寇）|Koan campaign (2nd Mongol invasion)|弘安之役（第二次元日战争）","博多湾沿岸に石の防塁を筑いて防いだ。|Stone walls along Hakata Bay held them off.|在博多湾沿岸筑石垒防御。"],
  ["1297年|1297|1297年","永仁の徳政令を出す|The Einin debt-relief order|颁布永仁德政令","生活の苦しい御家人を救うため、借金を帐消しに。|Cancelled debts of struggling vassals.|为救济生活困苦的御家人而取消其债务。"],
  ["1333年|1333|1333年","镰仓幕府がほろびる|The Kamakura shogunate falls|镰仓幕府灭亡","后醍醐天皇の呼びかけに、足利尊氏・新田义贞らが応じた。|Takauji, Nitta Yoshisada and others answered Go-Daigo's call.|足利尊氏、新田义贞等响应后醍醐天皇的号召。"],
  ["1334年|1334|1334年","建武の新政が始まる|The Kenmu Restoration begins|建武新政开始","后醍醐天皇の天皇中心の政治。约2年でくずれた。|Go-Daigo's direct rule; collapsed in about 2 years.|后醍醐天皇以天皇为中心的政治，约2年即瓦解。"],
  ["1338年|1338|1338年","足利尊氏が征夷大将军になる|Ashikaga Takauji becomes shogun|足利尊氏成为征夷大将军","京都に室町幕府。|The Muromachi shogunate in Kyoto.|在京都创建室町幕府。"],
  ["1392年|1392|1392年","南北朝が统一される|North and South Courts reunite|南北朝统一","3代将军足利义満。|By the 3rd shogun, Ashikaga Yoshimitsu.|由第三代将军足利义满完成。"],
  ["1404年|1404|1404年","日明贸易（勘合贸易）が始まる|Trade with Ming (kango trade) begins|日明贸易（勘合贸易）开始","足利义満。勘合で倭寇と区别した。|Yoshimitsu; tallies told official ships from pirates.|足利义满；以勘合区分正式贸易船与倭寇。"],
  ["1428年|1428|1428年","正长の土一揆|The Shocho uprising|正长土一揆","近江の马借をきっかけに、徳政を求めて土仓・酒屋をおそった。|Started by packhorse men in Omi; demanded debt relief.|以近江的马借为开端，要求德政而袭击土仓、酒屋。"],
  ["1429年|1429|1429年","琉球王国が成立する|The Ryukyu Kingdom is founded|琉球王国成立","尚氏が冲縄岛を统一。中継贸易で栄えた。|The Sho family unified Okinawa; thrived on relay trade.|尚氏统一冲绳岛，以转口贸易繁荣。"],
  ["1467年|1467|1467年","応仁の乱が始まる|The Onin War begins|应仁之乱开始","8代将军足利义政の后つぎ争いなど。京都が焼け野原に。|Over the 8th shogun Yoshimasa's heir; Kyoto burned.|起因于第八代将军足利义政的继承之争等，京都化为焦土。"],
  ["1485年|1485|1485年","山城国一揆|The Yamashiro uprising|山城国一揆","武士と农民が守护大名を追い出し、8年间自治を行った。|Samurai and farmers expelled the daimyo and ruled for 8 years.|武士与农民驱逐守护大名，自治8年。"],
  ["1488年|1488|1488年","加贺の一向一揆|The Kaga Ikko uprising|加贺一向一揆","浄土真宗（一向宗）の信者が守护大名をたおし、约100年自治。|Jodo Shinshu believers overthrew the daimyo and ruled ~100 years.|净土真宗（一向宗）信徒推翻守护大名，自治约100年。"]];
const SECT=[["天台宗|Tendai|天台宗","最澄|Saicho|最澄","平安时代。比叡山延暦寺。|Heian; Enryakuji on Mt. Hiei.|平安时代；比叡山延历寺。"],["真言宗|Shingon|真言宗","空海|Kukai|空海","平安时代。高野山金刚峰寺。|Heian; Kongobuji on Mt. Koya.|平安时代；高野山金刚峰寺。"],
  ["浄土宗|Jodo (Pure Land)|净土宗","法然|Honen|法然","念仏（南无阿弥陀仏）を唱えれば、だれでも极楽浄土に生まれ変われる。|Anyone chanting the nenbutsu can be reborn in the Pure Land.|只要念佛（南无阿弥陀佛），任何人都能往生极乐净土。"],
  ["浄土真宗（一向宗）|Jodo Shinshu (True Pure Land)|净土真宗（一向宗）","亲鸾|Shinran|亲鸾","法然の弟子。阿弥陀仏を信じる心を重んじた。|Honen's disciple; stressed faith in Amida.|法然的弟子，重视信仰阿弥陀佛之心。"],
  ["时宗|Ji|时宗","一遍|Ippen|一遍","踊念仏で教えを広めた。|Spread through dancing nenbutsu.|以踊念佛传布教义。"],
  ["日莲宗（法华宗）|Nichiren (Lotus)|日莲宗（法华宗）","日莲|Nichiren|日莲","题目（南无妙法莲华経）を唱えれば救われる。|Chant the daimoku (Namu Myoho Renge Kyo).|唱诵题目（南无妙法莲华经）即可得救。"],
  ["临済宗|Rinzai Zen|临济宗","栄西|Eisai|荣西","座禅（禅宗）。宋から伝え、幕府が保护した。|Zen meditation from Song; protected by the shogunate.|坐禅（禅宗），从宋朝传入，受幕府保护。"],
  ["曹洞宗|Soto Zen|曹洞宗","道元|Dogen|道元","ひたすら座禅に打ちこむ（禅宗）。|Just sit in meditation (Zen).|一心专注于坐禅（禅宗）。"]];
const SECTQ=["{a}を开いた人物は？|Who founded {a}?|开创{a}的人是？","{b}が开いた宗派は？|Which sect did {b} found?|{b}开创的宗派是？","{a}を开いたのは{b}。|{a} was founded by {b}.|{a}由{b}开创。"];
/* Part1 镰仓幕府 */
const m1=[ORD(Y_MED.slice(0,4)),eraOrd(5,8),
  Q("1185年、源頼朝が国ごとに置いた、军事・警察を行う役职は？|In 1185, which post did Yoritomo set up in each province for military and police duties?|1185年源赖朝在各国设置、负责军事与警察的职务是？","守护|Shugo (military governor)|守护",
    [["地头|Jito (steward)|地头","地头は荘园や公领ごとに置かれ、年贡の取り立てや土地の管理をしました。|Jito managed estates and collected taxes.|地头设于各庄园与公领，负责征收年贡、管理土地。"],["国司|Kokushi|国司","国司は律令制で都から各国に送られた役人です。|Kokushi were ritsuryo provincial officials.|国司是律令制下由京城派往各国的官员。"],["执権|Shikken (regent)|执权","执権は镰仓幕府で将军を补佐する役职です。|The shikken assisted the shogun.|执权是镰仓幕府中辅佐将军的职务。"]],
    "守护（国ごと・军事と警察）、地头（荘园・公领ごと・年贡と土地の管理）。|Shugo: per province, military/police. Jito: per estate, taxes/land.|守护（各国・军事与警察）、地头（各庄园与公领・年贡与土地管理）。"),
  Q("荘园や公领ごとに置かれ、年贡の取り立てや土地の管理を行った役职は？|Which post, set in each estate, collected taxes and managed land?|设于各庄园与公领，负责征收年贡与管理土地的职务是？","地头|Jito (steward)|地头",
    [["守护|Shugo|守护","守护は国ごとに置かれ、军事・警察を行いました。|Shugo handled military/police per province.|守护设于各国，负责军事与警察。"],["管领|Kanrei|管领","管领は室町幕府で将军を补佐した役职です。|Kanrei assisted Muromachi shoguns.|管领是室町幕府中辅佐将军的职务。"],["防人|Sakimori|防人","防人は古代に九州北部を守った兵士です。|Ancient border guards.|防人是古代守卫九州北部的士兵。"]],
    "地头には頼朝の家来（御家人）が任命された。|Yoritomo's vassals (gokenin) were made jito.|地头由赖朝的家臣（御家人）担任。"),
  Q("1192年に征夷大将军に任じられた人物は？|Who was appointed seii taishogun in 1192?|1192年被任命为征夷大将军的人是？","源頼朝|Minamoto no Yoritomo|源赖朝",
    [["源义経|Minamoto no Yoshitsune|源义经","源义経は頼朝の弟で、平氏をほろぼしたあと頼朝と対立しました。|Yoritomo's brother; he defeated the Taira, then fell out with Yoritomo.|源义经是赖朝之弟，消灭平氏后与赖朝对立。"],["坂上田村麻吕|Sakanoue no Tamuramaro|坂上田村麻吕","坂上田村麻吕は平安时代の初めに征夷大将军になりました。|He was shogun in early Heian.|坂上田村麻吕于平安时代初期成为征夷大将军。"],["足利尊氏|Ashikaga Takauji|足利尊氏","足利尊氏は1338年に征夷大将军になりました。|Takauji, 1338.|足利尊氏于1338年成为征夷大将军。"]],
    "源頼朝は镰仓を本拠地とし、武士による政権（镰仓幕府）を开いた。|Yoritomo based himself at Kamakura and set up a samurai government.|源赖朝以镰仓为根据地，开创武士政权（镰仓幕府）。"),
  Q("将军が、御家人の领地を守ったり、新しい领地をあたえたりすることを何という？|What is it called when the shogun protects and grants land to his vassals?|将军保护御家人的领地、或赐予新领地，叫做？","御恩|Goon (favor)|御恩",
    [["奉公|Hoko (service)|奉公","奉公は、御家人が将军のために命がけで戦うことです。|Hoko is vassals fighting for the shogun.|奉公是御家人为将军拚命作战。"],["下克上|Gekokujo|下克上","下克上は、下の者が上の者を実力でたおす风潮です。|Overthrowing superiors.|下克上是下位者以实力推翻上位者的风潮。"],["公地公民|Public land and people|公地公民","公地公民は大化の改新の方针です。|A Taika Reform policy.|公地公民是大化革新的方针。"]],
    "御恩と奉公で结ばれた、土地を仲立ちとする主従関系（封建制度）。|Favor and service tied by land: the feudal system.|以土地为媒介、由御恩与奉公结合的主从关系（封建制度）。"),
  Q("御家人が、将军のために命がけで戦うことを何という？|What is it called when vassals fight for the shogun at the risk of their lives?|御家人为将军拚命作战，叫做？","奉公|Hoko (service)|奉公",
    [["御恩|Goon (favor)|御恩","御恩は、将军が御家人に领地をあたえたり守ったりすることです。|Goon is the shogun's land grants.|御恩是将军赐予或保护御家人领地。"],["一揆|Ikki (uprising)|一揆","一揆は人々が団结して行动を起こすことです。|An ikki is a united uprising.|一揆是人们团结起来采取行动。"],["院政|Insei|院政","院政は上皇が行う政治です。|Rule by a retired emperor.|院政是上皇主持的政治。"]],
    "「いざ镰仓」：事件が起きれば御家人は镰仓へかけつけた。|\"To Kamakura!\": vassals rushed to Kamakura when trouble came.|「一旦有事，前往镰仓」：发生事件时御家人就赶赴镰仓。"),
  Q("镰仓幕府で将军を补佐する役职で、北条氏が代々ついたものは？|Which Kamakura post assisting the shogun was held by the Hojo family?|镰仓幕府中辅佐将军、由北条氏世袭的职务是？","执権|Shikken (regent)|执权",
    [["管领|Kanrei|管领","管领は室町幕府の将军の补佐役です。|Kanrei is the Muromachi equivalent.|管领是室町幕府的将军辅佐职。"],["摂政|Sessho|摄政","摂政は幼い天皇に代わって政治を行う朝廷の役职です。|A court post for child emperors.|摄政是代替年幼天皇执政的朝廷职务。"],["関白|Kanpaku|关白","関白は成人した天皇を补佐する朝廷の役职です。|A court post assisting adult emperors.|关白是辅佐成年天皇的朝廷职务。"]],
    "頼朝の死后、妻の北条政子の実家の北条氏が执権として実権をにぎった（执権政治）。|After Yoritomo died, his wife Masako's Hojo family took power as shikken.|赖朝死后，其妻北条政子的娘家北条氏以执权身分掌握实权（执权政治）。"),
  Q("1221年、朝廷の势力を取りもどそうと兵を挙げ、幕府に败れた上皇は？|Which retired emperor raised an army in 1221 to restore court power, and lost?|1221年为恢复朝廷势力而起兵、败给幕府的上皇是？","后鸟羽上皇|Retired Emperor Go-Toba|后鸟羽上皇",
    [["白河上皇|Retired Emperor Shirakawa|白河上皇","白河上皇は1086年に院政を始めました。|Shirakawa began insei in 1086.|白河上皇于1086年开始院政。"],["后醍醐天皇|Emperor Go-Daigo|后醍醐天皇","后醍醐天皇は1333年に镰仓幕府をたおしました。|Go-Daigo ended Kamakura in 1333.|后醍醐天皇于1333年推翻镰仓幕府。"],["桓武天皇|Emperor Kanmu|桓武天皇","桓武天皇は平安京に都を移しました。|Kanmu founded Heian-kyo.|桓武天皇迁都平安京。"]],
    "承久の乱のとき、北条政子が頼朝の御恩を说いて御家人をまとめた。乱の后、京都に六波罗探题を置いた。|Masako rallied the vassals; afterward the Rokuhara Tandai was set up in Kyoto.|承久之乱时，北条政子诉说赖朝的御恩以团结御家人；乱后在京都设六波罗探题。"),
  Q("承久の乱のあと、朝廷を监视するために京都に置かれた役所は？|After the Jokyu War, which office was set up in Kyoto to watch the court?|承久之乱后，为监视朝廷而设于京都的机构是？","六波罗探题|Rokuhara Tandai|六波罗探题",
    [["大宰府|Dazaifu|大宰府","大宰府は古代に九州に置かれた役所です。|An ancient office in Kyushu.|大宰府是古代设于九州的官署。"],["政所|Mandokoro|政所","政所は幕府の财政などを担当した役所です。|It handled shogunate finances.|政所是负责幕府财政等的机构。"],["侍所|Samurai-dokoro|侍所","侍所は御家人を统率した役所です。|It commanded the vassals.|侍所是统率御家人的机构。"]],
    "承久の乱で幕府の力は西日本にも広がった。|The shogunate's power spread into western Japan.|承久之乱后幕府势力扩及西日本。"),
  Q("1232年、执権北条泰时が定めた、武士の最初の法律は？|What was the first samurai law, set by regent Hojo Yasutoki in 1232?|1232年执权北条泰时制定的最早的武士法律是？","御成败式目（贞永式目）|Goseibai Shikimoku|御成败式目（贞永式目）",
    [["大宝律令|Taiho Code|大宝律令","大宝律令は701年の、唐にならった法律です。|The 701 code.|大宝律令是701年仿效唐朝的法律。"],["十七条の宪法|Seventeen-Article Constitution|十七条宪法","十七条の宪法は圣徳太子が定めた役人の心构えです。|Shotoku's rules for officials.|十七条宪法是圣德太子制定的官员守则。"],["分国法|Bunkokuho|分国法","分国法は戦国大名が定めたきまりです。|Sengoku daimyo rules.|分国法是战国大名制定的规定。"]],
    "御成败式目：裁判の基准を示した。长く武士の法律の手本となった。|It set standards for trials and long served as a model of samurai law.|御成败式目揭示审判标准，长期成为武士法律的典范。"),
  Q("镰仓时代に西日本で広まった、同じ田畑で米と麦を交互につくる农业は？|What farming spread in western Japan in the Kamakura period, growing rice and wheat in turn on the same field?|镰仓时代在西日本普及、同一田地轮流种稻和麦的农业是？","二毛作|Two-crop farming (nimosaku)|二毛作",
    [["二期作|Double cropping (rice twice)|二期作","二期作は同じ作物（米）を年2回つくることです。|Rice twice a year.|二期作是同一作物（稻米）一年种两次。"],["焼畑农业|Slash-and-burn|游耕","焼畑农业は森林を焼いて行う农业です。|Burning forest for fields.|游耕是焚烧森林进行的农业。"],["混合农业|Mixed farming|混合农业","混合农业はヨーロッパなどの农业です。|European farming.|混合农业是欧洲等地的农业。"]],
    "牛や马に犂を引かせたり、草木の灰を肥料にしたりして、生产が高まった。|Ox/horse plows and ash fertilizer raised output.|让牛马拉犁、以草木灰为肥料，提高了产量。"),
];
/* Part2 元寇と镰仓时代の文化 */
const m2=[ORD(Y_MED.slice(2,8)),...TB(SECT.slice(2),...SECTQ),
  Q("日本に服属を求め、2度にわたって大军を送った元の皇帝は？|Which Yuan emperor demanded Japan submit and sent armies twice?|要求日本臣服、两度派遣大军的元朝皇帝是？","フビライ・ハン|Kublai Khan|忽必烈",
    [["チンギス・ハン|Genghis Khan|成吉思汗","チンギス・ハンはモンゴル帝国を筑いた、フビライの祖父です。|Kublai's grandfather, founder of the Mongol Empire.|成吉思汗是创建蒙古帝国的人，忽必烈的祖父。"],["始皇帝|The First Emperor of Qin|秦始皇","始皇帝は纪元前3世纪に中国を统一しました。|He unified China in the 3rd c. BCE.|秦始皇于西元前3世纪统一中国。"],["李成桂|Yi Seong-gye|李成桂","李成桂は1392年に朝鲜国を建てました。|He founded Joseon in 1392.|李成桂于1392年创建朝鲜。"]],
    "フビライ・ハンは都を大都（いまのペキン）に移し、国号を元とした。|Kublai moved the capital to Dadu (Beijing) and named the dynasty Yuan.|忽必烈迁都大都（今北京），国号为元。"),
  Q("元の要求をこばみ、元寇に立ち向かった镰仓幕府の执権は？|Which Kamakura regent refused the Yuan's demands and faced the invasions?|拒绝元朝要求、对抗元军来袭的镰仓幕府执权是？","北条时宗|Hojo Tokimune|北条时宗",
    [["北条泰时|Hojo Yasutoki|北条泰时","北条泰时は1232年に御成败式目を定めた执権です。|He issued the 1232 code.|北条泰时是1232年制定御成败式目的执权。"],["北条政子|Hojo Masako|北条政子","北条政子は頼朝の妻で、承久の乱のとき御家人をまとめました。|Yoritomo's wife; rallied vassals in 1221.|北条政子是赖朝之妻，承久之乱时团结御家人。"],["足利义満|Ashikaga Yoshimitsu|足利义满","足利义満は室町幕府の3代将军です。|The 3rd Muromachi shogun.|足利义满是室町幕府第三代将军。"]],
    "元军は集団戦法や「てつはう」という火薬の武器を使った。|The Yuan used group tactics and gunpowder bombs (teppo).|元军使用集团战术与名为「铁炮」的火药武器。"),
  Q("元寇のあと、御家人が幕府に不満をもった主な理由は？|After the Mongol invasions, why were vassals unhappy with the shogunate?|元日战争后，御家人对幕府不满的主要原因是？","戦っても、新しい领地（恩赏）を十分もらえなかったから|They fought but got little new land as reward|作战后却未获足够的新领地（恩赏）",
    [["幕府が元に负けたから|The shogunate lost to the Yuan|幕府败给元朝","元军は2度とも引きあげ、日本は占领されていません。|The Yuan withdrew both times.|元军两次都撤退，日本未被占领。"],["税がなくなったから|Taxes were abolished|税赋被取消","税がなくなったわけではありません。|Taxes weren't abolished.|税赋并未被取消。"],["将军がいなくなったから|There was no shogun|没有将军了","将军はいました。実権は执権の北条氏にありました。|There was a shogun; the Hojo held power.|将军仍在，实权在执权北条氏手中。"]],
    "防卫戦で新しい土地は手に入らなかった。幕府は1297年に徳政令を出したが、かえって混乱した。|A defensive war won no land; the 1297 debt order only caused confusion.|防卫战没有取得新土地；幕府虽于1297年颁布德政令，反而造成混乱。"),
  Q("东大寺南大门の金刚力士像をつくった人物は？|Who made the Kongo Rikishi guardian statues at Todaiji's Great South Gate?|制作东大寺南大门金刚力士像的人是？","运庆・快庆|Unkei and Kaikei|运庆、快庆",
    [["雪舟|Sesshu|雪舟","雪舟は室町时代の水墨画家です。|Sesshu was a Muromachi ink painter.|雪舟是室町时代的水墨画家。"],["観阿弥・世阿弥|Kan'ami and Zeami|观阿弥、世阿弥","観阿弥・世阿弥は室町时代に能を大成しました。|They perfected Noh (Muromachi).|观阿弥、世阿弥于室町时代集能剧之大成。"],["鉴真|Ganjin|鉴真","鉴真は奈良时代に唐から来た僧です。|A Tang monk (Nara).|鉴真是奈良时代从唐朝来的僧人。"]],
    "镰仓文化：武士の気风に合った、力强く写実的な文化。|Kamakura culture: strong and realistic, suiting samurai.|镰仓文化：符合武士风气、雄健写实的文化。"),
  Q("琵琶法师によって语り伝えられた、平氏の栄华と灭亡をえがいた军记物は？|Which war tale of the Taira's rise and fall was recited by biwa-playing monks?|由琵琶法师传唱、描写平氏荣华与灭亡的军记物语是？","『平家物语』|The Tale of the Heike|《平家物语》",
    [["『源氏物语』|The Tale of Genji|《源氏物语》","『源氏物语』は平安时代に紫式部が书いた物语です。|Murasaki's Heian novel.|《源氏物语》是平安时代紫式部写的物语。"],["『徒然草』|Tsurezuregusa|《徒然草》","『徒然草』は兼好法师の随笔です。|Kenko's essays.|《徒然草》是兼好法师的随笔。"],["『古事记』|Kojiki|《古事记》","『古事记』は奈良时代の歴史书です。|A Nara-period history.|《古事记》是奈良时代的史书。"]],
    "文本の読めない人々にも、语りを通して広まった。|Recitation spread it even to people who couldn't read.|通过说唱，连不识字的人也能接触到。"),
  Q("镰仓时代に兼好法师が书いた随笔は？|Which essay collection did Kenko write in the Kamakura period?|镰仓时代兼好法师写的随笔是？","『徒然草』|Tsurezuregusa|《徒然草》",
    [["『方丈记』|Hojoki|《方丈记》","『方丈记』は鸭长明が书いた随笔です。|Kamo no Chomei's essay.|《方丈记》是鸭长明写的随笔。"],["『枕草子』|The Pillow Book|《枕草子》","『枕草子』は平安时代に清少纳言が书きました。|Sei Shonagon (Heian).|《枕草子》是平安时代清少纳言写的。"],["『土佐日记』|Tosa Diary|《土佐日记》","『土佐日记』は平安时代に纪贯之が书いた日记です。|Ki no Tsurayuki's Heian diary.|《土佐日记》是平安时代纪贯之写的日记。"]],
    "随笔：『枕草子』（平安・清少纳言）、『方丈记』（镰仓・鸭长明）、『徒然草』（镰仓・兼好法师）。|Essays: Pillow Book (Heian), Hojoki and Tsurezuregusa (Kamakura).|随笔：《枕草子》（平安、清少纳言）、《方丈记》（镰仓、鸭长明）、《徒然草》（镰仓、兼好法师）。"),
  Q("后鸟羽上皇の命令で、藤原定家らがまとめた和歌集は？|Which poetry anthology did Fujiwara no Teika and others compile on Go-Toba's order?|奉后鸟羽上皇之命、由藤原定家等人编纂的和歌集是？","『新古今和歌集』|Shin Kokin Wakashu|《新古今和歌集》",
    [["『古今和歌集』|Kokin Wakashu|《古今和歌集》","『古今和歌集』は平安时代に纪贯之らがまとめました。|Compiled by Tsurayuki and others (Heian).|《古今和歌集》是平安时代纪贯之等人编纂的。"],["『万叶集』|Man'yoshu|《万叶集》","『万叶集』は奈良时代の歌集です。|A Nara anthology.|《万叶集》是奈良时代的歌集。"],["『风土记』|Fudoki|《风土记》","『风土记』は国ごとの地理や伝说の记录です。|Local records.|《风土记》是各国地理与传说的纪录。"]],
    "和歌集の顺：『万叶集』（奈良）→『古今和歌集』（平安）→『新古今和歌集』（镰仓）。|Order: Man'yoshu (Nara) → Kokinshu (Heian) → Shin Kokinshu (Kamakura).|和歌集顺序：《万叶集》（奈良）→《古今和歌集》（平安）→《新古今和歌集》（镰仓）。"),
];
/* Part3 室町幕府と东アジア */
const m3=[ORD(Y_MED.slice(7,14)),
  Q("1333年に镰仓幕府をたおし、建武の新政を始めた天皇は？|Which emperor overthrew the Kamakura shogunate in 1333 and began the Kenmu Restoration?|1333年推翻镰仓幕府、开始建武新政的天皇是？","后醍醐天皇|Emperor Go-Daigo|后醍醐天皇",
    [["后鸟羽上皇|Retired Emperor Go-Toba|后鸟羽上皇","后鸟羽上皇は1221年の承久の乱で幕府に败れました。|Go-Toba lost in 1221.|后鸟羽上皇在1221年承久之乱中败给幕府。"],["白河上皇|Retired Emperor Shirakawa|白河上皇","白河上皇は院政を始めました。|He began insei.|白河上皇开始了院政。"],["圣武天皇|Emperor Shomu|圣武天皇","圣武天皇は奈良时代に东大寺を建てました。|He built Todaiji (Nara).|圣武天皇于奈良时代建造东大寺。"]],
    "建武の新政は公家（贵族）を重く用いたため武士の不満が高まり、约2年でくずれた。|It favored court nobles, angering samurai, and collapsed in about 2 years.|建武新政重用公家（贵族），引发武士不满，约2年即瓦解。"),
  Q("1338年に征夷大将军となり、京都に幕府を开いた人物は？|Who became shogun in 1338 and set up a shogunate in Kyoto?|1338年成为征夷大将军、在京都开设幕府的人是？","足利尊氏|Ashikaga Takauji|足利尊氏",
    [["足利义満|Ashikaga Yoshimitsu|足利义满","足利义満は3代将军で、南北朝を统一しました。|The 3rd shogun; reunited the courts.|足利义满是第三代将军，统一南北朝。"],["新田义贞|Nitta Yoshisada|新田义贞","新田义贞は镰仓を攻め落とした武将で、のちに尊氏と対立しました。|He took Kamakura, later fought Takauji.|新田义贞是攻陷镰仓的武将，后与尊氏对立。"],["源頼朝|Minamoto no Yoritomo|源赖朝","源頼朝は镰仓幕府を开きました。|He founded the Kamakura shogunate.|源赖朝开创镰仓幕府。"]],
    "后醍醐天皇は吉野（奈良県）にのがれ、京都の北朝と吉野の南朝が争う南北朝时代になった。|Go-Daigo fled to Yoshino: the Northern and Southern Courts era began.|后醍醐天皇逃往吉野（奈良县），进入京都北朝与吉野南朝对立的南北朝时代。"),
  Q("室町幕府で将军を补佐した役职は？|Which post assisted the shogun in the Muromachi shogunate?|室町幕府中辅佐将军的职务是？","管领|Kanrei|管领",
    [["执権|Shikken|执权","执権は镰仓幕府の将军の补佐役です。|That's Kamakura.|执权是镰仓幕府的将军辅佐职。"],["太政大臣|Daijo-daijin|太政大臣","太政大臣は朝廷の最高の役职です。|The top court post.|太政大臣是朝廷的最高职位。"],["守护|Shugo|守护","守护は国ごとに置かれた役职です。|Shugo were provincial posts.|守护是设于各国的职务。"]],
    "管领には有力な守护大名（细川・斯波・畠山氏）がついた。|Powerful shugo daimyo (Hosokawa, Shiba, Hatakeyama) held it.|管领由有力的守护大名（细川、斯波、畠山氏）担任。"),
  Q("足利义満が始めた明との贸易で、正式な贸易船と倭寇を区别するために使われた证明书は？|In Yoshimitsu's trade with Ming, what certificates told official ships from pirates?|足利义满开始的对明贸易中，用来区分正式贸易船与倭寇的证明是？","勘合|Kango tallies|勘合",
    [["金印|Gold seal|金印","金印は57年に奴国の王が授かったものです。|The seal given to Na in 57.|金印是西元57年奴国王所获赠的。"],["宋銭|Song coins|宋钱","宋銭は中国から输入された铜銭です。|Copper coins imported from China.|宋钱是从中国进口的铜钱。"],["朱印状|Red-seal license|朱印状","朱印状は江戸时代初めの朱印船贸易で使われました。|Used in early Edo red-seal trade.|朱印状用于江户时代初期的朱印船贸易。"]],
    "勘合贸易（日明贸易）で、铜銭・生糸などを输入し、刀・铜などを输出した。|Imports: copper coins, raw silk; exports: swords, copper.|勘合贸易（日明贸易）进口铜钱、生丝等，出口刀剑、铜等。"),
  Q("朝鲜半岛や中国の沿岸をあらした海贼を何という？|What were the pirates raiding Korean and Chinese coasts called?|侵扰朝鲜半岛与中国沿岸的海盗叫做？","倭寇|Wako|倭寇",
    [["渡来人|Toraijin|渡来人","渡来人は大陆から日本に移り住んだ人々です。|They were immigrants.|渡来人是从大陆移居日本的人。"],["马借|Bashaku|马借","马借は马を使った运送业者です。|Packhorse carriers.|马借是使用马匹的运输业者。"],["防人|Sakimori|防人","防人は古代の兵士です。|Ancient soldiers.|防人是古代的士兵。"]],
    "明は倭寇の取りしまりを日本に求めた。|Ming asked Japan to suppress the wako.|明朝要求日本取缔倭寇。"),
  Q("15世纪に尚氏が冲縄岛を统一して建てた国は？|Which kingdom did the Sho family found by unifying Okinawa in the 15th century?|15世纪尚氏统一冲绳岛所创建的国家是？","琉球王国|Ryukyu Kingdom|琉球王国",
    [["朝鲜国|Joseon|朝鲜","朝鲜国は1392年に李成桂が朝鲜半岛に建てた国です。|Joseon, founded in Korea in 1392.|朝鲜是1392年李成桂在朝鲜半岛创建的国家。"],["邪马台国|Yamatai|邪马台国","邪马台国は3世纪に卑弥呼が治めた国です。|Himiko's 3rd-century realm.|邪马台国是3世纪卑弥呼统治的国家。"],["奴国|Na|奴国","奴国は1世纪に金印を授かった国です。|Na got a gold seal in the 1st century.|奴国是1世纪获赠金印的国家。"]],
    "琉球王国は首里を都とし、日本・中国・东南アジアを结ぶ中継贸易で栄えた。|With Shuri as capital, it thrived on relay trade between Japan, China and SE Asia.|琉球王国以首里为都，靠链接日本、中国、东南亚的转口贸易而繁荣。"),
  Q("室町时代に、虾夷地（北海道）に住み、本州の人々（和人）と交易していた人々は？|Who lived in Ezo (Hokkaido) and traded with people from Honshu?|室町时代居住在虾夷地（北海道），与本州人（和人）交易的人们是？","アイヌの人々|The Ainu|爱努人",
    [["琉球の人々|Ryukyuans|琉球人","琉球の人々は冲縄に住む人々です。|They live in Okinawa.|琉球人是住在冲绳的人。"],["渡来人|Toraijin|渡来人","渡来人は古代に大陆から移り住んだ人々です。|Ancient immigrants.|渡来人是古代从大陆移居的人。"],["倭寇|Wako|倭寇","倭寇は海贼です。|Pirates.|倭寇是海盗。"]],
    "和人との対立から、1457年にコシャマインが戦いを起こした。|Conflict with Wajin led to Koshamain's war in 1457.|因与和人对立，1457年胡奢魔犬（Koshamain）起兵抗争。"),
  Q("室町时代、农民が村を自分たちで运営するためにつくった自治のしくみは？|What self-governing village organization did Muromachi farmers create?|室町时代农民为自行管理村落而创建的自治组织是？","惣（惣村）|So (self-governing village)|惣（惣村）",
    [["座|Za (guild)|座","座は商人や手工业者の同业者の组合です。|Za were merchant/craft guilds.|座是商人与手工业者的同业公会。"],["土仓|Doso (moneylender)|土仓","土仓はお金を贷す金融业者です。|Doso lent money.|土仓是放款的金融业者。"],["守护大名|Shugo daimyo|守护大名","守护大名は国を支配した武士です。|Shugo daimyo ruled provinces.|守护大名是统治一国的武士。"]],
    "惣では寄合を开いておきてを决め、ときには団结して土一揆を起こした。|Villagers met to set rules and sometimes rose in uprisings.|惣村召开集会订立规约，有时团结发动土一揆。"),
  Q("马を使って物资を运んだ、室町时代の运送业者は？|Who were the packhorse carriers of the Muromachi period?|室町时代使用马匹运送物资的运输业者是？","马借|Bashaku|马借",
    [["土仓・酒屋|Doso and sakaya (lenders)|土仓、酒屋","土仓・酒屋はお金を贷す金融业者です。|They lent money.|土仓、酒屋是放款的金融业者。"],["座|Za|座","座は同业者の组合です。|Guilds.|座是同业公会。"],["防人|Sakimori|防人","防人は古代の九州北部の兵士です。|Ancient border guards.|防人是古代九州北部的士兵。"]],
    "1428年の正长の土一揆は、近江（滋贺県）の马借の行动がきっかけだった。|The 1428 Shocho uprising began with Omi's packhorse men.|1428年的正长土一揆以近江（滋贺县）马借的行动为开端。"),
  Q("足利义満が京都の北山に建てた建物は？|Which building did Yoshimitsu build at Kitayama in Kyoto?|足利义满在京都北山建造的建筑是？","金阁|Kinkaku (Golden Pavilion)|金阁",
    [["银阁|Ginkaku (Silver Pavilion)|银阁","银阁は8代将军足利义政が东山に建てました。|Built by Yoshimasa at Higashiyama.|银阁是第八代将军足利义政在东山所建。"],["平等院凤凰堂|Byodoin Phoenix Hall|平等院凤凰堂","平等院凤凰堂は平安时代に藤原頼通が建てました。|Built by Yorimichi (Heian).|平等院凤凰堂是平安时代藤原赖通所建。"],["法隆寺|Horyuji|法隆寺","法隆寺は飞鸟时代の寺です。|An Asuka temple.|法隆寺是飞鸟时代的寺院。"]],
    "金阁には、贵族の文化と武士の文化がとけあった北山文化の特色が表れている。|Kinkaku shows Kitayama culture, blending noble and samurai tastes.|金阁展现了贵族文化与武士文化融合的北山文化特色。"),
  Q("足利义満の保护を受けて、能を大成した亲子は？|Which father and son perfected Noh under Yoshimitsu's patronage?|受足利义满保护、集能剧之大成的父子是？","観阿弥・世阿弥|Kan'ami and Zeami|观阿弥、世阿弥",
    [["运庆・快庆|Unkei and Kaikei|运庆、快庆","运庆・快庆は镰仓时代の仏像の雕刻家です。|Kamakura sculptors.|运庆、快庆是镰仓时代的佛像雕刻家。"],["藤原道长・頼通|Michinaga and Yorimichi|藤原道长、赖通","藤原道长・頼通は平安时代の摂関政治の中心の亲子です。|Heian regents.|藤原道长、赖通是平安时代摄关政治的内核父子。"],["法然・亲鸾|Honen and Shinran|法然、亲鸾","法然・亲鸾は镰仓时代の僧で、师と弟子です。|Kamakura monks, teacher and disciple.|法然、亲鸾是镰仓时代的僧人，为师徒关系。"]],
    "能の合间には、民众の生活などを题材にした喜剧の狂言が演じられた。|Between Noh plays, comic kyogen about daily life were performed.|能剧之间会演出以民众生活等为题材的喜剧「狂言」。"),
];
/* Part4 応仁の乱と戦国时代 */
const m4=[ORD(Y_MED.slice(10)),
  Q("1467年、8代将军足利义政の后つぎ问题などから始まり、京都が焼け野原になった戦乱は？|Which war began in 1467 over the 8th shogun Yoshimasa's heir and burned Kyoto?|1467年因第八代将军足利义政的继承问题等而起、使京都化为焦土的战乱是？","応仁の乱|The Onin War|应仁之乱",
    [["承久の乱|The Jokyu War|承久之乱","承久の乱は1221年、后鸟羽上皇が起こしました。|Go-Toba, 1221.|承久之乱是1221年后鸟羽上皇发动的。"],["壬申の乱|The Jinshin War|壬申之乱","壬申の乱は672年の天皇の后つぎ争いです。|A 672 succession war.|壬申之乱是672年的天皇继承之争。"],["平治の乱|The Heiji Disturbance|平治之乱","平治の乱は1159年、平清盛が源义朝を破った戦いです。|1159: Kiyomori beat Yoshitomo.|平治之乱是1159年平清盛击败源义朝的战役。"]],
    "细川氏（东军）と山名氏（西军）の守护大名も加わり、11年続いた。幕府の力はおとろえた。|Hosokawa (East) and Yamana (West) joined; it lasted 11 years and weakened the shogunate.|守护大名细川氏（东军）与山名氏（西军）也加入，持续11年，幕府势力衰退。"),
  Q("身分の低い者が、実力で身分の高い者をたおす风潮を何という？|What is the trend of lower-ranking people overthrowing their superiors by force called?|身分低者凭实力推翻身分高者的风潮叫做？","下克上|Gekokujo|下克上",
    [["御恩と奉公|Favor and service|御恩与奉公","御恩と奉公は将军と御家人の主従関系です。|The shogun–vassal bond.|御恩与奉公是将军与御家人的主从关系。"],["公地公民|Public land and people|公地公民","公地公民は大化の改新の方针です。|A Taika policy.|公地公民是大化革新的方针。"],["院政|Insei|院政","院政は上皇が行う政治です。|Rule by a retired emperor.|院政是上皇主持的政治。"]],
    "応仁の乱のあと下克上が広がり、各地に戦国大名が现れた（戦国时代）。|After Onin, gekokujo spread and Sengoku daimyo rose everywhere.|应仁之乱后下克上风潮扩散，各地出现战国大名（战国时代）。"),
  Q("戦国大名が、领国を治めるために定めた独自のきまりは？|What were the rules Sengoku daimyo set to govern their domains?|战国大名为治理领国而制定的独自规定是？","分国法|Bunkokuho (domain laws)|分国法",
    [["御成败式目|Goseibai Shikimoku|御成败式目","御成败式目は镰仓幕府の法律です。|A Kamakura law.|御成败式目是镰仓幕府的法律。"],["大宝律令|Taiho Code|大宝律令","大宝律令は701年の律令です。|The 701 code.|大宝律令是701年的律令。"],["十七条の宪法|Seventeen-Article Constitution|十七条宪法","十七条の宪法は圣徳太子が定めました。|Shotoku's rules.|十七条宪法是圣德太子制定的。"]],
    "分国法では、けんか両成败などを定めて家臣を统制した。|Domain laws controlled retainers, e.g. punishing both sides of a fight.|分国法订定「喧哗两成败」等规定以统制家臣。"),
  Q("戦国大名が、城のまわりに家臣や商工业者を集めてつくった町は？|What towns did daimyo build around their castles, gathering retainers and merchants?|战国大名在城堡周围聚集家臣与工商业者所形成的城镇是？","城下町|Castle town|城下町",
    [["门前町|Temple town|门前町","门前町は寺や神社の门前にできた町です。|Towns in front of temples/shrines.|门前町是在寺庙、神社门前形成的城镇。"],["港町|Port town|港町","港町は港を中心に栄えた町（堺・博多など）です。|Towns around ports.|港町是以港口为中心繁荣的城镇（堺、博多等）。"],["宿场町|Post town|宿场町","宿场町は街道ぞいの宿泊地として栄えた町です。|Towns along highways.|宿场町是沿街道作为住宿地而繁荣的城镇。"]],
    "城下町には、大名の命令で家臣や商人・职人が集められた。|Daimyo ordered retainers, merchants and craftsmen to live there.|城下町依大名命令聚集家臣与商人、工匠。"),
  Q("8代将军足利义政が京都の东山に建てた建物は？|Which building did the 8th shogun Yoshimasa build at Higashiyama?|第八代将军足利义政在京都东山建造的建筑是？","银阁|Ginkaku (Silver Pavilion)|银阁",
    [["金阁|Kinkaku|金阁","金阁は3代将军足利义満が北山に建てました。|Built by Yoshimitsu at Kitayama.|金阁是第三代将军足利义满在北山所建。"],["中尊寺金色堂|Chusonji Golden Hall|中尊寺金色堂","中尊寺金色堂は平安时代に奥州藤原氏が建てました。|Built by the Northern Fujiwara (Heian).|中尊寺金色堂是平安时代奥州藤原氏所建。"],["东大寺南大门|Todaiji Great South Gate|东大寺南大门","东大寺南大门は镰仓时代に再建されました。|Rebuilt in the Kamakura period.|东大寺南大门是镰仓时代重建的。"]],
    "东山文化：禅宗の影响を受けた、简素で落ち着いた文化。银阁・书院造・水墨画。|Higashiyama culture: simple, Zen-influenced — Ginkaku, shoin style, ink painting.|东山文化：受禅宗影响、简朴沉静的文化，如银阁、书院造、水墨画。"),
  Q("银阁と同じ敷地の东求堂同仁斎に见られる、たたみ・ふすま・床の间などのある建筑様式は？|What style, with tatami, sliding doors and an alcove, is seen in the Togudo at Ginkakuji?|银阁寺境内东求堂同仁斋可见、有榻榻米、拉门、床之间的建筑样式是？","书院造|Shoin-zukuri|书院造",
    [["寝殿造|Shinden-zukuri|寝殿造","寝殿造は平安时代の贵族の住まいです。|Heian aristocrats' style.|寝殿造是平安时代贵族的住宅。"],["校仓造|Azekura style|校仓造","校仓造は正仓院などの仓の建て方です。|Storehouse log style.|校仓造是正仓院等仓库的建造方式。"],["竖穴住居|Pit dwelling|竖穴式住居","竖穴住居は縄文・弥生时代の住まいです。|Jomon/Yayoi homes.|竖穴式住居是绳文、弥生时代的住所。"]],
    "书院造は、いまの和风の住宅のもとになった。|Shoin style became the basis of today's Japanese-style rooms.|书院造成为现今日式住宅的原型。"),
  Q("明にわたって技法を学び、日本の水墨画を大成した人物は？|Who studied in Ming China and perfected Japanese ink painting?|赴明朝学习技法、集日本水墨画之大成的人是？","雪舟|Sesshu|雪舟",
    [["运庆|Unkei|运庆","运庆は镰仓时代の雕刻家です。|A Kamakura sculptor.|运庆是镰仓时代的雕刻家。"],["世阿弥|Zeami|世阿弥","世阿弥は能を大成した人物です。|He perfected Noh.|世阿弥是集能剧之大成的人。"],["紫式部|Murasaki Shikibu|紫式部","紫式部は『源氏物语』の作者です。|Author of Genji.|紫式部是《源氏物语》的作者。"]],
    "水墨画：墨のこさとうすさだけで自然などをえがく絵。|Ink painting uses only shades of ink.|水墨画：只用墨色浓淡描绘自然等的画。"),
  Q("浄土真宗（一向宗）の信者たちが守护大名をたおし、约100年にわたって自治を行った一揆は？|Which uprising by Jodo Shinshu (Ikko) believers overthrew the daimyo and ruled for about 100 years?|净土真宗（一向宗）信徒推翻守护大名、自治约100年的一揆是？","加贺の一向一揆|Kaga Ikko uprising|加贺一向一揆",
    [["山城国一揆|Yamashiro uprising|山城国一揆","山城国一揆は、武士と农民が守护大名を追い出し、8年间自治を行いました。|Samurai and farmers ruled for 8 years.|山城国一揆是武士与农民驱逐守护大名，自治8年。"],["正长の土一揆|Shocho uprising|正长土一揆","正长の土一揆は、徳政を求めて土仓や酒屋をおそった一揆です。|It demanded debt relief.|正长土一揆是要求德政而袭击土仓、酒屋的一揆。"],["承久の乱|Jokyu War|承久之乱","承久の乱は后鸟羽上皇と幕府の戦いです。|Go-Toba vs. the shogunate.|承久之乱是后鸟羽上皇与幕府之间的战争。"]],
    "加贺（石川県）の一向一揆は1488年から约100年続いた。|The Kaga (Ishikawa) uprising lasted about 100 years from 1488.|加贺（石川县）的一向一揆从1488年起持续约100年。"),
  Q("日明贸易などで栄え、有力な商人による自治が行われた港町は？|Which port town grew rich from Ming trade and was governed by its leading merchants?|因日明贸易等而繁荣、由有力商人自治的港町是？","堺（大阪府）|Sakai (Osaka)|堺（大阪府）",
    [["镰仓|Kamakura|镰仓","镰仓は镰仓幕府が置かれた所です。|Seat of the Kamakura shogunate.|镰仓是设置镰仓幕府的地方。"],["平泉|Hiraizumi|平泉","平泉（岩手県）は奥州藤原氏が栄えた所です。|The Northern Fujiwara's base.|平泉（岩手县）是奥州藤原氏兴盛之地。"],["大宰府|Dazaifu|大宰府","大宰府は古代の九州の役所です。|An ancient office in Kyushu.|大宰府是古代九州的官署。"]],
    "京都では町众が、堺や博多では有力な商人が自治を行った。|Townspeople in Kyoto and merchants in Sakai and Hakata ran their own affairs.|京都由町众、堺与博多由有力商人实行自治。"),
];
/* ========== 组み合わせカード（2枚の组を见つける。カードはすべて表向き） ========== */
const PEOPLE=[["卑弥呼|Himiko|卑弥呼","魏に使いを送る|Sent envoys to Wei|遣使至魏"],["小野妹子|Ono no Imoko|小野妹子","遣隋使|Envoy to Sui|遣隋使"],["圣徳太子|Prince Shotoku|圣德太子","十七条の宪法|Seventeen-Article Constitution|十七条宪法"],["中大兄皇子|Prince Naka no Oe|中大兄皇子","大化の改新|Taika Reform|大化革新"],
  ["圣武天皇|Emperor Shomu|圣武天皇","东大寺の大仏|Great Buddha of Todaiji|东大寺大佛"],["鉴真|Ganjin|鉴真","唐招提寺を开く|Founded Toshodaiji|开创唐招提寺"],["桓武天皇|Emperor Kanmu|桓武天皇","平安京に都を移す|Moved the capital to Heian-kyo|迁都平安京"],["坂上田村麻吕|Sakanoue no Tamuramaro|坂上田村麻吕","虾夷を従わせる|Subdued the Emishi|征服虾夷"],
  ["菅原道真|Sugawara no Michizane|菅原道真","遣唐使の停止|Stopped envoys to Tang|停派遣唐使"],["藤原道长|Fujiwara no Michinaga|藤原道长","摂関政治の全盛|Peak of regency rule|摄关政治全盛"],["白河上皇|Retired Emperor Shirakawa|白河上皇","院政を始める|Began cloister rule|开始院政"],["平清盛|Taira no Kiyomori|平清盛","日宋贸易|Trade with Song|日宋贸易"],
  ["源頼朝|Minamoto no Yoritomo|源赖朝","守护・地头を置く|Set up shugo and jito|设置守护、地头"],["北条泰时|Hojo Yasutoki|北条泰时","御成败式目|Goseibai Shikimoku|御成败式目"],["北条时宗|Hojo Tokimune|北条时宗","元寇に立ち向かう|Faced the Mongol invasions|对抗元军来袭"],["后醍醐天皇|Emperor Go-Daigo|后醍醐天皇","建武の新政|Kenmu Restoration|建武新政"],
  ["足利尊氏|Ashikaga Takauji|足利尊氏","室町幕府を开く|Founded the Muromachi shogunate|开创室町幕府"],["足利义満|Ashikaga Yoshimitsu|足利义满","南北朝の统一|Reunited the two courts|统一南北朝"],["足利义政|Ashikaga Yoshimasa|足利义政","银阁|Ginkaku|银阁"],["雪舟|Sesshu|雪舟","水墨画|Ink painting|水墨画"]];
const WORKS=[["『源氏物语』|The Tale of Genji|《源氏物语》","紫式部|Murasaki Shikibu|紫式部"],["『枕草子』|The Pillow Book|《枕草子》","清少纳言|Sei Shonagon|清少纳言"],["『古今和歌集』|Kokin Wakashu|《古今和歌集》","纪贯之ら|Ki no Tsurayuki et al.|纪贯之等"],["『万叶集』|Man'yoshu|《万叶集》","大伴家持（まとめたとされる）|Otomo no Yakamochi (said to compile)|大伴家持（相传编纂）"],
  ["『徒然草』|Tsurezuregusa|《徒然草》","兼好法师|Kenko|兼好法师"],["『方丈记』|Hojoki|《方丈记》","鸭长明|Kamo no Chomei|鸭长明"],["『新古今和歌集』|Shin Kokin Wakashu|《新古今和歌集》","藤原定家ら|Fujiwara no Teika et al.|藤原定家等"],["金刚力士像|Kongo Rikishi statues|金刚力士像","运庆・快庆|Unkei and Kaikei|运庆、快庆"],
  ["平等院凤凰堂|Byodoin Phoenix Hall|平等院凤凰堂","藤原頼通|Fujiwara no Yorimichi|藤原赖通"],["金阁|Kinkaku|金阁","足利义満|Ashikaga Yoshimitsu|足利义满"],["能|Noh|能剧","観阿弥・世阿弥|Kan'ami and Zeami|观阿弥、世阿弥"],["法隆寺|Horyuji|法隆寺","圣徳太子（建てたとされる）|Prince Shotoku (said to build)|圣德太子（相传建造）"]];
const CAP=[["アメリカ合众国|United States|美国","ワシントンD.C.|Washington, D.C.|华盛顿特区"],["中国|China|中国","ペキン（北京）|Beijing|北京"],["韩国|South Korea|韩国","ソウル|Seoul|首尔"],["イギリス|United Kingdom|英国","ロンドン|London|伦敦"],
  ["フランス|France|法国","パリ|Paris|巴黎"],["ドイツ|Germany|德国","ベルリン|Berlin|柏林"],["イタリア|Italy|意大利","ローマ|Rome|罗马"],["ロシア|Russia|俄罗斯","モスクワ|Moscow|莫斯科"],
  ["オーストラリア|Australia|澳洲","キャンベラ|Canberra|坎培拉","シドニーではない。|Not Sydney.|不是雪梨。"],["ブラジル|Brazil|巴西","ブラジリア|Brasília|巴西利亚","リオデジャネイロではない。|Not Rio de Janeiro.|不是里约热内卢。"],["カナダ|Canada|加拿大","オタワ|Ottawa|渥太华","トロントではない。|Not Toronto.|不是多伦多。"],["エジプト|Egypt|埃及","カイロ|Cairo|开罗"],
  ["インド|India|印度","ニューデリー|New Delhi|新德里"],["タイ|Thailand|泰国","バンコク|Bangkok|曼谷"],["サウジアラビア|Saudi Arabia|沙特阿拉伯","リヤド|Riyadh|利雅德"],["トルコ|Türkiye (Turkey)|土耳其","アンカラ|Ankara|安卡拉","イスタンブールではない。|Not Istanbul.|不是伊斯坦堡。"],
  ["ケニア|Kenya|肯尼亚","ナイロビ|Nairobi|奈洛比"],["アルゼンチン|Argentina|阿根廷","ブエノスアイレス|Buenos Aires|布宜诺斯艾利斯"],["ニュージーランド|New Zealand|新西兰","ウェリントン|Wellington|威灵顿","オークランドではない。|Not Auckland.|不是奥克兰。"],["スペイン|Spain|西班牙","マドリード|Madrid|马德里"]];
const GEOF=[["ヒマラヤ山脉|The Himalayas|喜马拉雅山脉","アジア州|Asia|亚洲"],["メコン川|The Mekong|湄公河","アジア州|Asia|亚洲"],["ガンジス川|The Ganges|恒河","アジア州|Asia|亚洲"],
  ["アルプス山脉|The Alps|阿尔卑斯山脉","ヨーロッパ州|Europe|欧洲"],["ライン川|The Rhine|莱茵河","ヨーロッパ州|Europe|欧洲"],["スカンディナビア半岛|Scandinavian Peninsula|斯堪地那维亚半岛","ヨーロッパ州|Europe|欧洲"],
  ["サハラ砂漠|The Sahara|撒哈拉沙漠","アフリカ州|Africa|非洲"],["ナイル川|The Nile|尼罗河","アフリカ州|Africa|非洲"],["ギニア湾|Gulf of Guinea|几内亚湾","アフリカ州|Africa|非洲"],
  ["ロッキー山脉|The Rocky Mountains|洛矶山脉","北アメリカ州|North America|北美洲"],["ミシシッピ川|The Mississippi|密西西比河","北アメリカ州|North America|北美洲"],["五大湖|The Great Lakes|五大湖","北アメリカ州|North America|北美洲"],
  ["アンデス山脉|The Andes|安地斯山脉","南アメリカ州|South America|南美洲"],["アマゾン川|The Amazon|亚马逊河","南アメリカ州|South America|南美洲"],["パンパ|The Pampas|彭巴草原","南アメリカ州|South America|南美洲"],
  ["グレートディバイディング山脉|Great Dividing Range|大分水岭","オセアニア州|Oceania|大洋洲"],["グレートバリアリーフ|Great Barrier Reef|大堡礁","オセアニア州|Oceania|大洋洲"]];
const ANCW=[["エジプト文明|Egyptian civilization|埃及文明","ピラミッド|Pyramids|金字塔"],["メソポタミア文明|Mesopotamian civilization|美索不达米亚文明","くさび形文本|Cuneiform|楔形文本"],["インダス文明|Indus civilization|印度河文明","モヘンジョ・ダロ|Mohenjo-daro|摩亨佐达罗"],["中国文明（殷）|Chinese civilization (Yin)|中国文明（殷商）","甲骨文本|Oracle-bone script|甲骨文"],
  ["秦の始皇帝|The First Emperor of Qin|秦始皇","万里の长城|The Great Wall|万里长城"],["孔子|Confucius|孔子","儒教（儒学）|Confucianism|儒家（儒学）"],["古代ギリシャ|Ancient Greece|古希腊","ポリス（都市国家）|Polis (city-state)|城邦"],["シャカ|The Buddha|释迦牟尼","仏教|Buddhism|佛教"],["イエス|Jesus|耶稣","キリスト教|Christianity|基督教"],["ムハンマド|Muhammad|穆罕默德","イスラム教|Islam|伊斯兰教"]];
const YQ=["{a}のできごとは？|What happened in {a}?|{a}发生的事是？","「{b}」は何年？|In what year: {b}?|「{b}」是哪一年？","{a}：{b}。|{a}: {b}.|{a}：{b}。"];
const PAIRS=[
  ["都道府県と都道府県庁所在地|Prefectures & capitals|都道府县与县政府所在地",PREF,PQ],
  ["古代の年号|Ancient dates|古代的年份",Y_ANC,YQ],
  ["中世の年号|Medieval dates|中世的年份",Y_MED,YQ],
  ["人物と行ったこと|People & deeds|人物与事迹",PEOPLE,["{a}が行ったことは？|What did {a} do?|{a}做了什么？","「{b}」と関系の深い人物は？|Who is linked to \"{b}\"?|与「{b}」关系密切的人物是？","{a}：{b}。|{a}: {b}.|{a}：{b}。"]],
  ["作品・建物と人物|Works & people|作品、建筑与人物",WORKS,["{a}と関系の深い人物は？|Who is linked to {a}?|与{a}关系密切的人物是？","{b}と関系の深い作品・建物は？|Which work or building is linked to {b}?|与{b}关系密切的作品或建筑是？","{a}：{b}。|{a}: {b}.|{a}：{b}。"]],
  ["仏教の宗派と开いた人|Buddhist sects & founders|佛教宗派与开创者",SECT,SECTQ],
  ["国と首都|Countries & capitals|国家与首都",CAP,["{a}の首都は？|What is the capital of {a}?|{a}的首都是？","{b}が首都の国は？|{b} is the capital of…|以{b}为首都的国家是？","{a}の首都は{b}。|The capital of {a} is {b}.|{a}的首都是{b}。"]],
  ["地名と州|Places & world regions|地名与洲",GEOF,["{a}がある州は？|Which region is {a} in?|{a}位于哪一洲？","{b}にあるのは？|Which is in {b}?|位于{b}的是？","{a}は{b}にある。|{a} is in {b}.|{a}位于{b}。"]],
  ["古代の世界|The ancient world|古代世界",ANCW,["{a}と组になるのは？|Which goes with {a}?|与{a}配对的是？","{b}と组になるのは？|Which goes with {b}?|与{b}配对的是？","{a} ― {b}|{a} — {b}|{a} ― {b}"]]];

/* ========== 単元 ========== */
const units=[
 {id:"wgeo",s:"soc",g:"geo",n:{ja:"世界の姿",en:"The world",["zh-Hant"]:"世界的样貌"},gr:"1",k:"math",ref:X("地理的分野 A(1)・B(1) 世界の地域构成／人々の生活と环境|Geography A(1), B(1): the world's regions; life and environment|地理领域 A(1)、B(1) 世界的区域构成／人们的生活与环境"),
  parts:[1,2,3,4,5],pn:{1:X("大陆と海洋・6つの州|Continents, oceans & six regions|大陆与海洋、六大洲"),2:X("纬度と経度・地図|Latitude, longitude & maps|纬度与经度、地图"),3:X("时差|Time differences|时差"),4:X("世界の気候（雨温図）|World climates (climate graphs)|世界的气候（气温雨量图）"),5:X("人々の生活と宗教|Ways of life & religions|人们的生活与宗教")},
  sk:{1:w1,2:w2,3:w3,4:w4,5:w5}},
 {id:"jgeo",s:"soc",g:"geo",n:{ja:"日本の姿",en:"Japan",["zh-Hant"]:"日本的样貌"},gr:"1",k:"math",ref:X("地理的分野 A(1) 日本の地域构成|Geography A(1): Japan's regions|地理领域 A(1) 日本的区域构成"),
  parts:[1,2,3],pn:{1:X("位置と领域|Location & territory|位置与领域"),2:X("都道府県と都道府県庁所在地|Prefectures & capitals|都道府县与县政府所在地"),3:X("7地方区分|The seven regions|七地方区分")},
  sk:{1:j1,2:j2,3:j3}},
 {id:"wreg",s:"soc",g:"geo",n:{ja:"世界の诸地域",en:"World regions",["zh-Hant"]:"世界各区域"},gr:"1",k:"math",ref:X("地理的分野 B(2) 世界の诸地域|Geography B(2): regions of the world|地理领域 B(2) 世界各区域"),
  parts:[1,2,3,4,5],pn:{1:X("アジア州|Asia|亚洲"),2:X("ヨーロッパ州|Europe|欧洲"),3:X("アフリカ州|Africa|非洲"),4:X("北アメリカ州|North America|北美洲"),5:X("南アメリカ州・オセアニア州|South America & Oceania|南美洲、大洋洲")},
  sk:{1:r1,2:r2,3:r3,4:r4,5:r5}},
 {id:"anc",s:"soc",g:"hist",n:{ja:"古代までの日本",en:"Ancient Japan",["zh-Hant"]:"古代的日本"},gr:"1",k:"math",ref:X("歴史的分野 B(1) 古代までの日本|History B(1): Japan to the ancient period|历史领域 B(1) 古代以前的日本"),
  parts:[1,2,3,4,5],pn:{1:X("古代文明と宗教のおこり|Ancient civilizations & religions|古代文明与宗教的起源"),2:X("縄文・弥生・古坟时代|Jomon, Yayoi & Kofun|绳文、弥生、古坟时代"),3:X("飞鸟时代|Asuka period|飞鸟时代"),4:X("奈良时代|Nara period|奈良时代"),5:X("平安时代|Heian period|平安时代")},
  sk:{1:h1,2:h2,3:h3,4:h4,5:h5}},
 {id:"med",s:"soc",g:"hist",n:{ja:"中世の日本",en:"Medieval Japan",["zh-Hant"]:"中世的日本"},gr:"1",k:"math",ref:X("歴史的分野 B(2) 中世の日本|History B(2): medieval Japan|历史领域 B(2) 中世的日本"),
  parts:[1,2,3,4],pn:{1:X("镰仓幕府|The Kamakura shogunate|镰仓幕府"),2:X("元寇と镰仓时代の文化|Mongol invasions & Kamakura culture|元日战争与镰仓文化"),3:X("室町幕府と东アジア|The Muromachi shogunate & East Asia|室町幕府与东亚"),4:X("応仁の乱と戦国时代|The Onin War & the Sengoku era|应仁之乱与战国时代")},
  sk:{1:m1,2:m2,3:m3,4:m4}},
 {id:"pair",s:"soc",g:"pair",pair:true,n:{ja:"组み合わせカード",en:"Match pairs",["zh-Hant"]:"配对卡"},gr:"1",k:"math",ref:X("中1社会の全単元から|From all Grade 7 social studies units|国一社会全部单元"),
  parts:PAIRS.map((_,i)=>i+1),pn:Object.fromEntries(PAIRS.map((s,i)=>[i+1,X(s[0])])),sk:Object.fromEntries(PAIRS.map((s,i)=>[i+1,TB(s[1],...s[2])])),
  pairs:Object.fromEntries(PAIRS.map((s,i)=>[i+1,s[1].map(r=>[X(r[0]),X(r[1]),r[2]?X(r[2]):""])]))},
];
// 问题を作る（MATH.make と同じ。変な选択肢が出ないよう作り直しつき）
function make(fn){ for(let i=0;i<20;i++){ try{ const g=fn(); if(g&&(g.opts||g.wrongs.length>=3)&&!g.wrongs.some(w=>w.v===g.ans)) return g; }catch(e){} } return fn(); }
return {units,make};
})();
