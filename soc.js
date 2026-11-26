/* 45 Study 社会（tools/build.py が src/soc/*.js から作る。直接編集しない） */
/* 45 Study 社会：問題をその場で作る（時差・対せき点の数字は毎回かわる）。tools/build.py が src/soc/*.js をつなげて soc.js を作る。
   単元の並び：中学校学習指導要領（平成29年告示）社会 地理的分野 A(1)・B(1)(2)、歴史的分野 B(1)(2)（中1でよく学ぶ範囲：世界と日本の姿 → 世界の諸地域、古代 → 中世）
   ことば：文は "日本語|English|繁體中文" の3つを | でつなげて書き、X() で今の言語を取り出す。簡体字は build.py が soc.js 全体を変換して soc_zh.js を作る。
   gen() が返すもの：{ q:問題, ans:答え, wrongs:[{v,why}], exp:解き方, tf:v=>○×の文, kind } （SCI・MATH と同じ形）
   表から作る問題（TB）は、組み合わせカードの組（PAIRS）とも同じ表を使う。 */
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
/* 文の問題：[問題, 答え, [[誤答,理由]×3], 解き方, 図] → 問題を作る関数 */
function Q(q,ans,ws,exp,fig){ return ()=>{ const qq=X(q)+(fig?(typeof fig==="function"?fig():fig):""); return {q:qq,ans:X(ans),wrongs:ws.map(([v,why])=>({v:X(v),why:X(why)})),exp:X(exp),tf:v=>`${qq}<br>→ ${v}`,kind:fig?"fig":"word"}; }; }
/* 表から問題：rows=[[A,B,ひとこと?]]。ab＝A を見て B を答える問い、ba＝B を見て A を答える問い（どちらかは null でよい）。
   why＝その行の A と B の関係を言う文（{a}{b} に入れる）。誤答の理由はその誤答の行の why、解き方は正解の行の why（＋ひとこと）。
   同じ B の行がいくつかあってもよい（B→A の問いでは、同じ B の行は誤答に使わない） */
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
/* Part1 大陸と海洋・6つの州 */
const w1=[
  Q("いちばん面積が大きい大陸は？|Which is the largest continent?|面積最大的大陸是？","ユーラシア大陸|Eurasia|歐亞大陸",
    [["アフリカ大陸|Africa|非洲大陸","アフリカ大陸は2番目に大きい大陸です。|Africa is the 2nd largest.|非洲大陸是第2大的大陸。"],["北アメリカ大陸|North America|北美洲大陸","北アメリカ大陸は3番目です。|North America is 3rd.|北美洲大陸是第3大。"],["南極大陸|Antarctica|南極大陸","南極大陸は5番目で、6大陸でいちばん小さいのはオーストラリア大陸です。|Antarctica is 5th; Australia is the smallest.|南極大陸是第5大；六大陸中最小的是澳洲大陸。"]],
    "6大陸：ユーラシア・アフリカ・北アメリカ・南アメリカ・南極・オーストラリア（大きい順）。|Six continents, largest first: Eurasia, Africa, N. America, S. America, Antarctica, Australia.|六大陸（由大到小）：歐亞、非洲、北美洲、南美洲、南極、澳洲。"),
  Q("いちばん面積が大きい海洋は？|Which is the largest ocean?|面積最大的海洋是？","太平洋|Pacific Ocean|太平洋",
    [["大西洋|Atlantic Ocean|大西洋","大西洋は2番目に大きい海洋です。|The Atlantic is 2nd.|大西洋是第2大。"],["インド洋|Indian Ocean|印度洋","インド洋は三大洋の3番目です。|The Indian Ocean is 3rd.|印度洋是三大洋中第3。"],["地中海|Mediterranean Sea|地中海","地中海は三大洋ではなく、ヨーロッパとアフリカの間の海です。|The Mediterranean isn't one of the three oceans.|地中海不是三大洋，是歐洲與非洲之間的海。"]],
    "三大洋：太平洋・大西洋・インド洋（大きい順）。|Three oceans: Pacific, Atlantic, Indian (largest first).|三大洋：太平洋、大西洋、印度洋（由大到小）。"),
  Q("地球の表面の、陸地と海洋の面積の割合は？|Land : ocean on Earth's surface is about…|地球表面陸地與海洋的面積比例約為？","陸地 3：海洋 7|3 : 7|陸地 3：海洋 7",
    [["陸地 5：海洋 5|5 : 5|陸地 5：海洋 5","海洋のほうがずっと広いです。|The ocean is much larger.|海洋大得多。"],["陸地 7：海洋 3|7 : 3|陸地 7：海洋 3","陸地と海洋が逆です。|Land and ocean are reversed.|陸地和海洋相反了。"],["陸地 1：海洋 9|1 : 9|陸地 1：海洋 9","陸地はおよそ3割あります。|Land is about 30%.|陸地約占3成。"]],
    "地球の表面の約7割が海洋（「水の惑星」）。|About 70% of the surface is ocean.|地球表面約7成是海洋。"),
  Q("6つの州のうち、日本がふくまれる州は？|Which of the six regions is Japan in?|六個洲中，日本屬於哪一洲？","アジア州|Asia|亞洲",
    [["オセアニア州|Oceania|大洋洲","オセアニア州はオーストラリアや太平洋の島々です。|Oceania is Australia and Pacific islands.|大洋洲是澳洲與太平洋島嶼。"],["ヨーロッパ州|Europe|歐洲","ヨーロッパ州はユーラシア大陸の西の部分です。|Europe is the west of Eurasia.|歐洲是歐亞大陸的西部。"],["北アメリカ州|North America|北美洲","北アメリカ州は太平洋をはさんだ東側です。|North America is across the Pacific.|北美洲在太平洋的另一側。"]],
    "6州：アジア・ヨーロッパ・アフリカ・北アメリカ・南アメリカ・オセアニア。日本はアジア州（東アジア）。|Six regions: Asia, Europe, Africa, N. America, S. America, Oceania. Japan is in Asia (East Asia).|六洲：亞洲、歐洲、非洲、北美洲、南美洲、大洋洲。日本屬於亞洲（東亞）。"),
  Q("6つの州のどれにもふくまれない大陸は？|Which continent belongs to none of the six regions?|不屬於六個洲中任何一洲的大陸是？","南極大陸|Antarctica|南極大陸",
    [["オーストラリア大陸|Australia|澳洲大陸","オーストラリア大陸はオセアニア州です。|Australia is in Oceania.|澳洲大陸屬於大洋洲。"],["ユーラシア大陸|Eurasia|歐亞大陸","ユーラシア大陸はアジア州とヨーロッパ州に分かれます。|Eurasia is split into Asia and Europe.|歐亞大陸分為亞洲和歐洲。"],["アフリカ大陸|Africa|非洲大陸","アフリカ大陸はアフリカ州です。|Africa is the Africa region.|非洲大陸屬於非洲。"]],
    "南極大陸は国のない大陸で、6つの州には入れません。|Antarctica has no countries and isn't one of the six regions.|南極大陸沒有國家，不列入六洲。"),
  Q("ユーラシア大陸は、アジア州と何州に分けられる？|Eurasia is divided into Asia and…|歐亞大陸分為亞洲和哪一洲？","ヨーロッパ州|Europe|歐洲",
    [["アフリカ州|Africa|非洲","アフリカ州はアフリカ大陸です。|Africa is its own continent.|非洲是非洲大陸。"],["オセアニア州|Oceania|大洋洲","オセアニア州はオーストラリア大陸と太平洋の島々です。|Oceania is Australia and islands.|大洋洲是澳洲大陸與太平洋島嶼。"],["北アメリカ州|North America|北美洲","北アメリカ州は北アメリカ大陸です。|North America is its own continent.|北美洲是北美洲大陸。"]],
    "ユーラシア大陸＝アジア州（東）＋ヨーロッパ州（西）。境はウラル山脈など。|Eurasia = Asia (east) + Europe (west), divided at the Urals, etc.|歐亞大陸＝亞洲（東）＋歐洲（西），以烏拉山脈等為界。"),
  Q("面積が世界でいちばん大きい国は？|Which country has the largest area?|面積世界最大的國家是？","ロシア|Russia|俄羅斯",
    [["カナダ|Canada|加拿大","カナダは2番目に大きい国です。|Canada is 2nd.|加拿大是第2大。"],["中国|China|中國","中国も大きいですが、ロシアの半分くらいです。|China is big, but about half of Russia.|中國也很大，但約為俄羅斯的一半。"],["アメリカ合衆国|United States|美國","アメリカ合衆国はロシアの6割ほどです。|The U.S. is about 60% of Russia.|美國約為俄羅斯的6成。"]],
    "ロシアは日本の約45倍の面積で、ヨーロッパ州とアジア州にまたがります。|Russia is about 45 times Japan, spanning Europe and Asia.|俄羅斯面積約為日本的45倍，橫跨歐洲與亞洲。"),
  Q("面積が世界でいちばん小さい国は？|Which country is the smallest in area?|面積世界最小的國家是？","バチカン市国|Vatican City|梵蒂岡",
    [["モナコ|Monaco|摩納哥","モナコは2番目に小さい国です。|Monaco is 2nd smallest.|摩納哥是第2小。"],["シンガポール|Singapore|新加坡","シンガポールは東京23区と同じくらいの大きさです。|Singapore is about the size of Tokyo's 23 wards.|新加坡與東京23區差不多大。"],["ルクセンブルク|Luxembourg|盧森堡","ルクセンブルクは神奈川県くらいの大きさです。|Luxembourg is about Kanagawa's size.|盧森堡約與神奈川縣一樣大。"]],
    "バチカン市国はイタリアのローマ市内にあり、カトリックの中心です。|Vatican City is inside Rome, the center of the Catholic Church.|梵蒂岡位於義大利羅馬市內，是天主教的中心。"),
  Q("海に面していない国（内陸国）は？|Which country is landlocked?|哪一個是不臨海的國家（內陸國）？","モンゴル|Mongolia|蒙古",
    [["イギリス|United Kingdom|英國","イギリスは海に囲まれた島国です。|The UK is an island country.|英國是被海包圍的島國。"],["チリ|Chile|智利","チリは太平洋に面した、南北に細長い国です。|Chile is long and faces the Pacific.|智利是面向太平洋、南北狹長的國家。"],["日本|Japan|日本","日本は海に囲まれた島国です。|Japan is an island country.|日本是被海包圍的島國。"]],
    "内陸国：モンゴル・スイス・ボリビアなど。島国：日本・イギリス・ニュージーランドなど。|Landlocked: Mongolia, Switzerland, Bolivia. Island countries: Japan, UK, New Zealand.|內陸國：蒙古、瑞士、玻利維亞等；島國：日本、英國、紐西蘭等。"),
  Q("まわりを海に囲まれた国（島国）は？|Which is an island country?|哪一個是四面環海的國家（島國）？","ニュージーランド|New Zealand|紐西蘭",
    [["スイス|Switzerland|瑞士","スイスは海に面していない内陸国です。|Switzerland is landlocked.|瑞士是不臨海的內陸國。"],["ボリビア|Bolivia|玻利維亞","ボリビアは南アメリカの内陸国です。|Bolivia is landlocked in South America.|玻利維亞是南美洲的內陸國。"],["モンゴル|Mongolia|蒙古","モンゴルはロシアと中国にはさまれた内陸国です。|Mongolia is landlocked between Russia and China.|蒙古是夾在俄羅斯與中國之間的內陸國。"]],
    "島国：日本・イギリス・ニュージーランド・フィリピンなど。|Island countries: Japan, UK, New Zealand, the Philippines, etc.|島國：日本、英國、紐西蘭、菲律賓等。"),
  Q("国境に、経線や緯線を利用した直線が多い州は？|Which region has many straight borders along lines of latitude or longitude?|國界多為沿經緯線的直線的是哪一洲？","アフリカ州|Africa|非洲",
    [["ヨーロッパ州|Europe|歐洲","ヨーロッパは山脈や川を国境にしている所が多いです。|Europe often uses mountains and rivers.|歐洲多以山脈、河川為國界。"],["アジア州|Asia|亞洲","アジアは山脈・川などの自然の国境が多いです。|Asia mostly has natural borders.|亞洲多為山脈、河川等自然國界。"],["南アメリカ州|South America|南美洲","南アメリカはアンデス山脈や川を国境にしている所が多いです。|South America often uses the Andes and rivers.|南美洲多以安地斯山脈或河川為國界。"]],
    "アフリカは、ヨーロッパの国々が植民地にしたときに経線・緯線で境を決めたため、直線の国境が多い。|European colonizers drew African borders along latitude and longitude lines.|非洲在被歐洲國家殖民時以經緯線劃界，所以直線國界多。"),
  Q("世界の人口の約6割が住んでいる州は？|Which region has about 60% of the world's people?|世界人口約6成居住在哪一洲？","アジア州|Asia|亞洲",
    [["アフリカ州|Africa|非洲","アフリカ州は2番目に人口が多く、いま急に増えています。|Africa is 2nd and growing fast.|非洲人口第2多，目前快速增加。"],["ヨーロッパ州|Europe|歐洲","ヨーロッパ州は世界の約1割です。|Europe is about 10%.|歐洲約占世界的1成。"],["北アメリカ州|North America|北美洲","北アメリカ州は世界の1割にとどきません。|North America is under 10%.|北美洲不到世界的1成。"]],
    "人口が多い国：インド・中国（どちらもアジア州）。|Most populous: India and China (both in Asia).|人口多的國家：印度、中國（都在亞洲）。"),
];
/* Part2 緯度と経度・地図 */
const LATS=(n,s)=>s==="N"?X(`北緯${n}度|${n}°N|北緯${n}度`):X(`南緯${n}度|${n}°S|南緯${n}度`);
const LONS=(n,e)=>e==="E"?X(`東経${n}度|${n}°E|東經${n}度`):X(`西経${n}度|${n}°W|西經${n}度`);
const PT=(a,s,b,e)=>LATS(a,s)+X("・|, |、")+LONS(b,e);
function antipode(){ const la=R(2,13)*5; let lo=R(2,34)*5; if(lo===90) lo=95; const s=pick(["N","S"]),e=pick(["E","W"]),s2=s==="N"?"S":"N",e2=e==="E"?"W":"E",lo2=180-lo;
  const q=X(`地球上で、${PT(la,s,lo,e)}の地点のちょうど反対側（対せき点）は？|What is the point exactly opposite ${PT(la,s,lo,e)} on the Earth (its antipode)?|地球上與${PT(la,s,lo,e)}正好相反的一點（對蹠點）是？`);
  const ans=PT(la,s2,lo2,e2);
  const ws=[{v:PT(la,s,lo2,e2),why:X("緯度は北緯と南緯を入れかえます（数字はそのまま）。|Switch N and S for latitude (same number).|緯度要把北緯、南緯互換（數字不變）。")},
    {v:PT(la,s2,lo,e2),why:X(`経度は 180 から引きます：180−${lo}＝${lo2}。|For longitude, subtract from 180: 180−${lo}=${lo2}.|經度要用180去減：180−${lo}＝${lo2}。`)},
    {v:PT(la,s2,lo2,e),why:X("経度は東経と西経も入れかえます。|Also switch E and W for longitude.|經度也要把東經、西經互換。")}];
  const exp=X(`緯度：${LATS(la,s)} → ${LATS(la,s2)}（北と南を入れかえる）。経度：180−${lo}＝${lo2}、${LONS(lo,e)} → ${LONS(lo2,e2)}（東と西も入れかえる）。|Latitude: ${LATS(la,s)} → ${LATS(la,s2)} (switch N/S). Longitude: 180−${lo}=${lo2}, ${LONS(lo,e)} → ${LONS(lo2,e2)} (switch E/W).|緯度：${LATS(la,s)} → ${LATS(la,s2)}（南北互換）；經度：180−${lo}＝${lo2}，${LONS(lo,e)} → ${LONS(lo2,e2)}（東西也互換）。`);
  return {q,ans,wrongs:ws,exp,tf:v=>`${q}<br>→ ${v}`,kind:"calc"}; }
const w2=[antipode,antipode,antipode,
  Q("緯度0度の緯線を何という？|What is the line of latitude 0° called?|緯度0度的緯線叫做？","赤道|The equator|赤道",
    [["本初子午線|The prime meridian|本初子午線","本初子午線は経度0度の経線です。|The prime meridian is longitude 0°.|本初子午線是經度0度的經線。"],["日付変更線|The date line|國際換日線","日付変更線はほぼ経度180度にそって引かれた線です。|The date line runs roughly along 180°.|國際換日線大致沿經度180度劃定。"],["経線|A meridian|經線","経線は北極と南極を結ぶ線です。|Meridians join the North and South Poles.|經線是連接北極與南極的線。"]],
    "赤道（緯度0度）から北が北緯、南が南緯。最大は90度（北極点・南極点）。|North of the equator (0°) is N, south is S; up to 90° at the poles.|赤道（緯度0度）以北為北緯、以南為南緯，最大90度（北極點、南極點）。"),
  Q("経度0度の経線（本初子午線）が通る都市は？|Which city does the prime meridian (0°) pass through?|經度0度的經線（本初子午線）通過哪個城市？","ロンドン|London|倫敦",
    [["パリ|Paris|巴黎","パリはロンドンより少し東です。|Paris is a little east of London.|巴黎在倫敦稍東。"],["ニューヨーク|New York|紐約","ニューヨークは西経約74度です。|New York is about 74°W.|紐約約在西經74度。"],["東京|Tokyo|東京","東京は東経約140度です。|Tokyo is about 140°E.|東京約在東經140度。"]],
    "本初子午線は、イギリスのロンドンにある旧グリニッジ天文台を通る。|The prime meridian passes the old Greenwich Observatory in London.|本初子午線通過英國倫敦的舊格林威治天文台。"),
  Q("緯度は、最大で何度まである？|What is the largest possible latitude?|緯度最大到幾度？","90度|90°|90度",
    [["180度|180°|180度","180度まであるのは経度（東経・西経）です。|180° is the maximum longitude.|最大到180度的是經度。"],["360度|360°|360度","360度は地球1周の角度です。|360° is a full circle.|360度是繞地球一圈的角度。"],["45度|45°|45度","北極点・南極点は90度です。|The poles are at 90°.|北極點、南極點是90度。"]],
    "緯度：赤道0度〜北極点・南極点90度。経度：本初子午線0度〜東西それぞれ180度。|Latitude 0° (equator) to 90° (poles); longitude 0° to 180° east or west.|緯度：赤道0度～南北極90度；經度：本初子午線0度～東西各180度。"),
  Q("東西それぞれ、経度は最大で何度まである？|What is the largest longitude, east or west?|東西經度各最大到幾度？","180度|180°|180度",
    [["90度|90°|90度","90度まであるのは緯度です。|90° is the maximum latitude.|最大到90度的是緯度。"],["360度|360°|360度","東経と西経を合わせて360度です。|East plus west makes 360°.|東經加西經合計360度。"],["120度|120°|120度","経度は東西それぞれ180度まであります。|Longitude goes to 180° each way.|經度東西各到180度。"]],
    "東経180度と西経180度は同じ経線（ほぼこれにそって日付変更線）。|180°E and 180°W are the same line (the date line roughly follows it).|東經180度與西經180度是同一條經線（國際換日線大致沿此線）。"),
  Q("北極点と南極点を結んだ線を何という？|What are lines joining the North and South Poles called?|連接北極點與南極點的線叫做？","経線|Meridians (lines of longitude)|經線",
    [["緯線|Parallels (lines of latitude)|緯線","緯線は赤道と平行な、東西の線です。|Parallels run east–west, parallel to the equator.|緯線是與赤道平行的東西向線。"],["赤道|The equator|赤道","赤道は緯度0度の緯線です。|The equator is latitude 0°.|赤道是緯度0度的緯線。"],["等高線|Contour lines|等高線","等高線は同じ高さの地点を結んだ線です。|Contours join points of equal height.|等高線是連接相同高度地點的線。"]],
    "経線＝南北の線（経度を表す）。緯線＝東西の線（緯度を表す）。|Meridians run N–S (longitude); parallels run E–W (latitude).|經線＝南北向（表示經度）；緯線＝東西向（表示緯度）。"),
  Q("東京のおよその位置は？|Roughly where is Tokyo?|東京的大約位置是？","北緯36度・東経140度|36°N, 140°E|北緯36度、東經140度",
    [["南緯36度・東経140度|36°S, 140°E|南緯36度、東經140度","日本は赤道より北（北半球）にあります。|Japan is north of the equator.|日本在赤道以北（北半球）。"],["北緯36度・西経140度|36°N, 140°W|北緯36度、西經140度","西経140度は太平洋の東側です。日本は本初子午線より東です。|140°W is in the eastern Pacific; Japan is east of Greenwich.|西經140度在太平洋東側；日本在本初子午線以東。"],["北緯140度・東経36度|140°N, 36°E|北緯140度、東經36度","緯度は90度までしかありません。|Latitude only goes to 90°.|緯度最多只到90度。"]],
    "日本はおよそ北緯20〜46度・東経122〜154度の範囲にある。|Japan lies at about 20–46°N, 122–154°E.|日本大約位於北緯20～46度、東經122～154度。"),
  Q("赤道が通る国は？|Which country does the equator pass through?|赤道通過哪個國家？","ブラジル|Brazil|巴西",
    [["エジプト|Egypt|埃及","エジプトは北緯22〜32度ほどにあります。|Egypt is at about 22–32°N.|埃及約在北緯22～32度。"],["インド|India|印度","インドはすべて北半球です。|India is entirely in the north.|印度全境在北半球。"],["オーストラリア|Australia|澳洲","オーストラリアはすべて南半球です。|Australia is entirely in the south.|澳洲全境在南半球。"]],
    "赤道が通る国：ブラジル・エクアドル・ケニア・インドネシアなど。|The equator crosses Brazil, Ecuador, Kenya, Indonesia, etc.|赤道通過巴西、厄瓜多、肯亞、印尼等國。"),
  Q("赤道が通る国は？|Which country does the equator pass through?|赤道通過哪個國家？","インドネシア|Indonesia|印尼",
    [["日本|Japan|日本","日本は北緯20〜46度ほどにあります。|Japan is at about 20–46°N.|日本約在北緯20～46度。"],["メキシコ|Mexico|墨西哥","メキシコはすべて北半球です。|Mexico is entirely in the north.|墨西哥全境在北半球。"],["南アフリカ共和国|South Africa|南非","南アフリカ共和国はアフリカ大陸の南のはしで、南半球です。|South Africa is at Africa's southern tip.|南非在非洲大陸南端，位於南半球。"]],
    "インドネシアは赤道付近に多くの島がならぶ国です。|Indonesia's many islands lie along the equator.|印尼有許多島嶼排列在赤道附近。"),
  Q("経線と緯線が直角に交わり、航海図に使われてきた地図は？|Which map has meridians and parallels at right angles and is used for sea charts?|經線與緯線垂直相交、一直用於航海圖的地圖是？","メルカトル図法|Mercator projection|麥卡托投影",
    [["正距方位図法|Azimuthal equidistant|方位等距投影","正距方位図法は中心からの距離と方位が正しい地図で、航空図に使われます。|It shows true distance and direction from the center (air routes).|方位等距投影從中心的距離與方位正確，用於航空圖。"],["モルワイデ図法|Mollweide projection|摩爾威德投影","モルワイデ図法は面積が正しい地図で、分布図に使われます。|Mollweide keeps true area (distribution maps).|摩爾威德投影面積正確，用於分布圖。"],["地球儀|A globe|地球儀","地球儀は地図ではなく、地球の模型です。|A globe is a model, not a flat map.|地球儀不是地圖，是地球的模型。"]],
    "メルカトル図法：角度が正しく、2点を結ぶ直線が一定の方角の航路になる。ただし高緯度ほど面積が大きく表される。|Mercator keeps angles (constant-bearing lines), but high latitudes look too large.|麥卡托投影角度正確，兩點連線為固定方向的航線；但高緯度面積會被放大。"),
  Q("中心からの距離と方位が正しく表される地図は？|Which map shows true distance and direction from its center?|從中心出發的距離與方位都正確的地圖是？","正距方位図法|Azimuthal equidistant|方位等距投影",
    [["メルカトル図法|Mercator projection|麥卡托投影","メルカトル図法は角度が正しく、航海図に使われる地図です。|Mercator keeps angles (sea charts).|麥卡托投影角度正確，用於航海圖。"],["モルワイデ図法|Mollweide projection|摩爾威德投影","モルワイデ図法は面積が正しい地図です。|Mollweide keeps true area.|摩爾威德投影面積正確。"],["どの地図でも正しい|Every map does|每種地圖都正確","平面の地図では、距離・面積・方位・形を一度に全部正しくはできません。|No flat map gets everything right at once.|平面地圖無法同時讓距離、面積、方位、形狀全部正確。"]],
    "正距方位図法：中心から各地への最短の道すじが直線になる→航空図に使う。|Straight lines from the center are shortest routes → air route maps.|方位等距投影中，從中心到各地的最短路線是直線→用於航空圖。"),
  Q("メルカトル図法の地図で、実際よりも面積が大きく表されるのは？|On a Mercator map, which areas look larger than they really are?|在麥卡托投影地圖上，面積被放大的是？","高緯度の地域（グリーンランドなど）|High-latitude areas (e.g. Greenland)|高緯度地區（如格陵蘭）",
    [["赤道の近くの地域|Areas near the equator|赤道附近地區","赤道付近は、ほぼ実際に近い大きさで表されます。|Near the equator, sizes are close to true.|赤道附近的大小接近實際。"],["経度0度の近くの地域|Areas near 0° longitude|經度0度附近地區","メルカトル図法のゆがみは経度ではなく緯度で決まります。|Distortion depends on latitude, not longitude.|麥卡托投影的變形取決於緯度，不是經度。"],["南半球の地域だけ|Only the southern hemisphere|只有南半球地區","北半球も南半球も、極に近いほど大きくなります。|Both hemispheres grow toward the poles.|南北半球都是越靠近極地越大。"]],
    "グリーンランドは実際はオーストラリアの3分の1ほどだが、メルカトル図法ではずっと大きく見える。|Greenland is about 1/3 of Australia but looks far bigger on Mercator.|格陵蘭實際約為澳洲的3分之1，在麥卡托投影上卻看起來大得多。"),
  Q("地球1周（赤道の長さ）は、およそ何km？|About how long is the Earth's circumference (equator)?|地球一圈（赤道長度）大約是幾km？","約4万km|About 40,000 km|約4萬km",
    [["約1万km|About 10,000 km|約1萬km","東京からロンドンまででも約1万kmあります。|Tokyo to London alone is about 10,000 km.|光是東京到倫敦就約1萬km。"],["約12万km|About 120,000 km|約12萬km","地球1周はその3分の1ほどです。|It's about a third of that.|地球一圈約為其3分之1。"],["約40万km|About 400,000 km|約40萬km","約40万kmに近いのは地球から月までの距離（約38万km）です。|That's close to the Earth–Moon distance (~380,000 km).|約40萬km接近地球到月球的距離（約38萬km）。"]],
    "地球は1周約4万km。距離・面積・方位・形をほぼ正しく表せるのは地球儀。|The Earth is about 40,000 km around; only a globe shows distance, area, direction and shape correctly.|地球一圈約4萬km；能大致正確表示距離、面積、方位、形狀的是地球儀。"),
];
/* Part3 時差（標準時子午線を問題に書く。サマータイムは考えない） */
const CITY=[["ロンドン|London|倫敦",0],["カイロ|Cairo|開羅",30],["ペキン|Beijing|北京",120],["シドニー|Sydney|雪梨",150],["ニューヨーク|New York|紐約",-75],["ロサンゼルス|Los Angeles|洛杉磯",-120],["ホノルル|Honolulu|檀香山",-150]];
const LON=d=>d===0?X("経度0度|0°|經度0度"):d>0?LONS(d,"E"):LONS(-d,"W");
const HR=n=>X(`${n}時間|${n} hours|${n}小時`).replace(/^1 hours/,"1 hour");
const MON=["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DT=(m,d,h)=>{ while(h<0){ h+=24; d--; } while(h>=24){ h-=24; d++; } return X(`${m}月${d}日 ${h}時|${MON[m]} ${d}, ${h}:00|${m}月${d}日 ${h}:00`); };
const TZQ=c=>X(`（標準時子午線：東京は東経135度、${X(c[0])}は${LON(c[1])}。サマータイムは考えない）|(Standard meridians: Tokyo 135°E, ${X(c[0])} ${LON(c[1])}. Ignore daylight saving time.)|（標準時子午線：東京為東經135度，${X(c[0])}為${LON(c[1])}；不考慮夏令時間）`);
function tzDiff(){ const c=pick(CITY),n=Math.abs(135-c[1])/15,nm=X(c[0]),deg=Math.abs(135-c[1]);
  const q=X(`東京と${nm}の時差は何時間？|What is the time difference between Tokyo and ${nm}?|東京與${nm}的時差是幾小時？`)+"<br><small>"+TZQ(c)+"</small>";
  const ws=[]; if(c[1]<0){ const v=Math.abs(135+c[1])/15; if(v!==n&&v>0) ws.push({v:HR(v),why:X(`西経は東経とは反対側です。経度の差は 135＋${-c[1]}＝${deg}度になります。|West longitude is on the other side: the difference is 135+${-c[1]}=${deg}°.|西經在東經的另一側，經度差是135＋${-c[1]}＝${deg}度。`)}); }
  for(const d of [1,-1,2,-2,3]){ if(ws.length>=3) break; const v=n+d; if(v>0&&!ws.some(w=>w.v===HR(v))) ws.push({v:HR(v),why:X("経度の差を15でわろう。|Divide the longitude difference by 15.|把經度差除以15。")}); }
  return {q,ans:HR(n),wrongs:ws.filter(w=>w.v!==HR(n)).slice(0,3),exp:X(`経度の差：${c[1]>=135?`${c[1]}−135`:c[1]>=0?`135−${c[1]}`:`135＋${-c[1]}`}＝${deg}度。${deg}÷15＝${n}時間。|Longitude difference: ${deg}°. ${deg}÷15 = ${n} hours.|經度差：${deg}度；${deg}÷15＝${n}小時。`),tf:v=>`${q}<br>→ ${v}`,kind:"calc"}; }
function tzClock(){ const c=pick(CITY),nm=X(c[0]),m=R(1,12),d=R(2,27),h=R(0,23),off=(c[1]-135)/15,ans=DT(m,d,h+off),deg=Math.abs(135-c[1]),n=Math.abs(off),east=off>0;
  const q=X(`東京が ${DT(m,d,h)} のとき、${nm}は何月何日の何時？|When it is ${DT(m,d,h)} in Tokyo, what is the date and time in ${nm}?|東京為 ${DT(m,d,h)} 時，${nm}是幾月幾日幾點？`)+"<br><small>"+TZQ(c)+"</small>";
  const ws=[{v:DT(m,d,h-off),why:east?X(`${nm}は東京より東なので、時刻は${n}時間進んでいます（引くのではなく足す）。|${nm} is east of Tokyo, so it is ${n} hour(s) ahead (add, don't subtract).|${nm}在東京以東，時間快${n}小時（要加，不是減）。`)
      :X(`${nm}は東京より西なので、時刻は${n}時間おくれています（足すのではなく引く）。|${nm} is west of Tokyo, so it is ${n} hours behind (subtract, don't add).|${nm}在東京以西，時間慢${n}小時（要減，不是加）。`)}];
  if(c[1]<0){ const o2=(-c[1]-135)/15; ws.push({v:DT(m,d,h+o2),why:X(`西経${-c[1]}度は東経とは反対側です。経度の差は 135＋${-c[1]}＝${deg}度です。|${-c[1]}°W is on the other side: the difference is 135+${-c[1]}=${deg}°.|西經${-c[1]}度在東經的另一側，經度差是135＋${-c[1]}＝${deg}度。`)}); }
  const hh=((h+off)%24+24)%24; ws.push({v:X(`${m}月${d}日 ${hh}時|${MON[m]} ${d}, ${hh}:00|${m}月${d}日 ${hh}:00`),why:X("時刻は合っていますが、日付が変わることを忘れています。|The time is right, but the date changes.|時間對了，但忘了日期會改變。")});
  const re=X("経度の差を15でわって、時差を出し直そう。|Recalculate: longitude difference ÷ 15.|重新用經度差除以15計算時差。");
  ws.push({v:DT(m,d,h+off+1),why:re},{v:DT(m,d,h+off-1),why:re});
  const seen=new Set([ans]); const wr=ws.filter(w=>!seen.has(w.v)&&seen.add(w.v)).slice(0,3);
  const ex=east?X(`経度の差 ${deg}度 ÷ 15 ＝ ${n}時間。${nm}は東京より東なので${n}時間進んでいる。|Difference ${deg}° ÷ 15 = ${n} h. ${nm} is east of Tokyo, so ${n} h ahead.|經度差 ${deg}度 ÷ 15 ＝ ${n}小時；${nm}在東京以東，快${n}小時。`)
    :X(`経度の差 ${deg}度 ÷ 15 ＝ ${n}時間。${nm}は東京より西なので${n}時間おくれている。|Difference ${deg}° ÷ 15 = ${n} h. ${nm} is west of Tokyo, so ${n} h behind.|經度差 ${deg}度 ÷ 15 ＝ ${n}小時；${nm}在東京以西，慢${n}小時。`);
  return {q,ans,wrongs:wr,exp:ex+` → ${ans}`,tf:v=>`${q}<br>→ ${v}`,kind:"calc"}; }
// 「東京より n 時間おくれている都市」の標準時子午線（西経にまわりこむ）
function tzBack(){ const n=pick([1,2,3,4,5,6,8,9,10,13,14,15,16,17,19]),L=135-15*n,ans=LON(L);
  const q=X(`ある都市の時刻は、東京（東経135度）より${n}時間おくれている。この都市の標準時子午線は？|A city is ${n} hours behind Tokyo (135°E). What is its standard meridian?|某城市的時間比東京（東經135度）慢${n}小時，此城市的標準時子午線是？`);
  let L2=135+15*n; if(L2>180) L2-=360;
  const ws=[{v:LON(L2),why:X("おくれている都市は東京より西にあります。135度から引きます。|A city behind Tokyo is to the west: subtract from 135°.|時間較慢的城市在東京以西，要從135度減。")},
    {v:LON(15*n),why:X(`${15*n}度は時差の分の経度で、東京（135度）からの差です。|${15*n}° is only the difference from 135°.|${15*n}度只是與東京（135度）的經度差。`)},
    {v:LON(-L),why:X("東経と西経を取りちがえています。|East and west are mixed up.|東經和西經弄反了。")},{v:LON(135-10*n),why:X("経度15度で1時間です。|It's 15° per hour.|經度每15度差1小時。")}];
  const seen=new Set([ans]); const wr=ws.filter(w=>Math.abs(+w.v.replace(/\D/g,""))<=180&&!seen.has(w.v)&&seen.add(w.v)).slice(0,3);
  const d=15*n,ex=L>=0?X(`経度の差：15×${n}＝${d}度。東京より西へ：135−${d}＝${L}|Difference: 15×${n} = ${d}°. Go west from 135°: 135−${d} = ${L}|經度差：15×${n}＝${d}度；從東京往西：135−${d}＝${L}`)
    :X(`経度の差：15×${n}＝${d}度。東京より西へ${d}度：0度までで135度、残りは${d}−135＝${-L}度なので西経${-L}度|Difference: 15×${n} = ${d}°. Going west, 135° takes you to 0°; the remaining ${d}−135 = ${-L}° gives ${-L}°W|經度差：15×${n}＝${d}度；往西走135度到0度，剩下${d}−135＝${-L}度，所以是西經${-L}度`);
  return {q,ans,wrongs:wr,exp:ex+` → ${ans}`,tf:v=>`${q}<br>→ ${v}`,kind:"calc"}; }
const w3=[tzDiff,tzDiff,tzClock,tzClock,tzClock,tzBack,
  Q("経度何度ごとに1時間の時差が生まれる？|Every how many degrees of longitude is a 1-hour time difference?|經度每幾度產生1小時的時差？","15度|15°|15度",
    [["10度|10°|10度","地球は24時間で360度回るので、360÷24＝15度です。|360° ÷ 24 h = 15°.|地球24小時轉360度，360÷24＝15度。"],["24度|24°|24度","24は1日の時間の数です。|24 is the number of hours in a day.|24是一天的小時數。"],["30度|30°|30度","30度だと2時間の差になります。|30° is a 2-hour difference.|30度是2小時的時差。"]],
    "地球は1日（24時間）で1回転（360度）→ 360÷24＝15度で1時間。|360° per 24 hours → 15° per hour.|地球一天（24小時）自轉一圈（360度）→ 360÷24＝15度差1小時。"),
  Q("日本の標準時子午線は？|What is Japan's standard meridian?|日本的標準時子午線是？","東経135度（兵庫県明石市）|135°E (Akashi, Hyogo)|東經135度（兵庫縣明石市）",
    [["東経140度（東京）|140°E (Tokyo)|東經140度（東京）","東京は東経約140度ですが、標準時は東経135度で決めています。|Tokyo is ~140°E, but standard time uses 135°E.|東京約在東經140度，但標準時以東經135度為準。"],["経度0度（ロンドン）|0° (London)|經度0度（倫敦）","経度0度は本初子午線で、世界の時刻の基準です。|0° is the prime meridian, the world's reference.|經度0度是本初子午線，是世界時間的基準。"],["東経120度（ペキン）|120°E (Beijing)|東經120度（北京）","東経120度は中国などの標準時子午線です。|120°E is China's standard meridian.|東經120度是中國等地的標準時子午線。"]],
    "日本の標準時子午線は兵庫県明石市を通る東経135度。ロンドンより9時間進んでいる。|Japan uses 135°E (through Akashi), 9 hours ahead of London.|日本標準時子午線為通過兵庫縣明石市的東經135度，比倫敦快9小時。"),
  Q("東へ行くほど、時刻はどうなる？|Going east, the local time becomes…|越往東，時間會怎樣？","進んでいる|Later (ahead)|越早進入（時間較快）",
    [["おくれている|Earlier (behind)|較慢","西へ行くほどおくれます。太陽は東からのぼります。|Going west it's behind; the sun rises in the east.|越往西越慢；太陽從東方升起。"],["変わらない|Unchanged|不變","経度が15度ちがうと1時間ずれます。|Every 15° changes the time by an hour.|經度差15度就差1小時。"],["緯度で決まる|Depends on latitude|由緯度決定","時差は緯度ではなく経度で決まります。|Time zones depend on longitude.|時差由經度而非緯度決定。"]],
    "地球は西から東へ自転するので、東の地域から先に朝になる。東ほど時刻が進んでいる。|The Earth spins west to east, so eastern places see morning first.|地球由西向東自轉，東邊先天亮，所以越往東時間越快。"),
  Q("日付変更線を西から東へこえるとき、日付はどうする？|Crossing the date line from west to east, you…|由西向東越過國際換日線時，日期要怎麼調整？","1日おくらせる|Set the date back one day|延後（減去）1天",
    [["1日進める|Move the date forward one day|提前（加上）1天","1日進めるのは、東から西へこえるときです。|Move forward when crossing east to west.|由東向西越過時才加1天。"],["そのまま|No change|不變","日付変更線をこえると日付を1日調整します。|You always adjust by one day.|越過國際換日線一定要調整1天。"],["2日おくらせる|Set it back two days|延後2天","調整するのは1日です。|The adjustment is one day.|只調整1天。"]],
    "日付変更線の西側（日本側）が、世界でいちばん早く新しい日をむかえる。|Places just west of the date line start each new day first.|國際換日線西側（日本這邊）最早迎接新的一天。"),
];
/* Part4 世界の気候（雨温図はその気候の典型的な形のデータ。実在の都市名はつけない。北半球） */
const CL={
 tr:["熱帯雨林気候|Tropical rainforest|熱帶雨林氣候","1年中気温が高く、雨も1年中多い|hot all year with heavy rain every month|全年高溫，全年多雨",[26.5,27,27.5,28,28,28,27.5,27.5,27.5,27.5,27,26.5],[240,160,180,170,170,150,160,170,170,190,250,280]],
 sv:["サバナ気候|Savanna|熱帶莽原氣候","1年中気温が高く、雨季と乾季がはっきりしている|hot all year with distinct wet and dry seasons|全年高溫，乾季與雨季分明",[26,28,29,30,30,29,29,28,28,28,27,26],[10,20,40,70,190,150,160,190,320,240,50,10]],
 de:["砂漠気候|Desert|沙漠氣候","1年を通して雨がほとんど降らない|almost no rain all year|全年幾乎不下雨",[14,16,19,24,28,30,31,31,29,25,20,15],[5,4,3,1,1,0,0,0,0,1,3,5]],
 hu:["温暖湿潤気候|Humid subtropical|溫暖濕潤氣候","四季がはっきりし、夏は高温で雨が多く、冬は気温が下がる|four clear seasons: hot, wet summers and cool winters|四季分明，夏季高溫多雨，冬季氣溫下降",[5.4,6.1,9.4,14.3,18.8,21.9,25.7,26.9,23.3,18,12.5,7.7],[60,56,116,134,140,168,156,155,225,235,96,58]],
 wc:["西岸海洋性気候|Marine west coast (oceanic)|西岸海洋性氣候","夏はすずしく、冬も高緯度のわりに温暖で、雨は1年を通して少しずつ降る|cool summers, mild winters, rain spread evenly through the year|夏季涼爽，冬季以高緯度來說溫和，全年少量平均降雨",[5,5,7,9,13,16,18,18,15,12,8,6],[55,45,45,45,50,45,45,50,50,65,60,55]],
 me:["地中海性気候|Mediterranean|地中海型氣候","夏は高温で乾燥し、冬に雨が多い|hot dry summers and rainy winters|夏季高溫乾燥，冬季多雨",[8,9,11,14,18,22,25,25,22,17,12,9],[70,70,60,60,40,20,15,25,70,110,110,90]],
 co:["冷帯（亜寒帯）気候|Subarctic (cold)|冷帶（亞寒帶）氣候","冬の寒さがきびしく、夏は気温が上がる|very cold winters but warm summers|冬季嚴寒，夏季氣溫會上升",[-6.5,-6.7,-1,6.7,13,17,19,17,11.5,5,-1,-5],[50,40,35,40,50,80,85,80,65,65,55,50]],
 po:["寒帯（ツンドラ気候）|Polar (tundra)|寒帶（苔原氣候）","1年中寒く、夏でも気温が10℃に届かない|cold all year; even summer stays below 10°C|全年寒冷，夏季氣溫也不到10℃",[-25,-27,-26,-18,-6,2,5,4,-1,-9,-18,-23],[5,4,4,5,5,10,25,25,15,10,6,5]]};
const CLW={tr:["sv","hu","me"],sv:["tr","de","hu"],de:["sv","me","po"],hu:["wc","me","co"],wc:["hu","me","co"],me:["wc","hu","de"],co:["po","wc","hu"],po:["co","de","wc"]};
function uon(k){ const [,,tm,pr]=CL[k],x0=40,x1=262,yb=160,bw=(x1-x0)/12,ty=t=>yb-(t+30)*2,py=p=>yb-p*.4; let b="";
  for(let t=-30;t<=40;t+=10){ b+=L(x0,ty(t),x1,ty(t),"g")+T(x0-5,ty(t)+4,t,"xs","end"); }
  for(let p=0;p<=300;p+=100) b+=T(x1+5,py(p)+4,p,"xs","start");
  pr.forEach((p,i)=>{ const h=p*.4; b+=`<rect x="${(x0+i*bw+2).toFixed(1)}" y="${(yb-h).toFixed(1)}" width="${(bw-4).toFixed(1)}" height="${h.toFixed(1)}" class="pr"/>`; b+=T(x0+i*bw+bw/2,yb+13,i+1,"xs"); });
  b+=`<polyline points="${tm.map((t,i)=>`${(x0+i*bw+bw/2).toFixed(1)},${ty(t).toFixed(1)}`).join(" ")}" class="tp"/>`+tm.map((t,i)=>`<circle cx="${(x0+i*bw+bw/2).toFixed(1)}" cy="${ty(t).toFixed(1)}" r="2.6" class="tpd"/>`).join("");
  b+=L(x0,ty(40),x0,yb,"ax")+L(x1,ty(40),x1,yb,"ax")+L(x0,yb,x1,yb,"ax");
  const av=(tm.reduce((a,c)=>a+c,0)/12).toFixed(1),sm=Math.round(pr.reduce((a,c)=>a+c,0));
  b+=T(x0-4,12,X("気温(℃)|Temp (°C)|氣溫(℃)"),"xs","start")+T(x1+4,12,X("降水量(mm)|Rain (mm)|降水量(mm)"),"xs","end")+T(151,188,X(`年平均気温 ${av}℃　年降水量 ${sm}mm|Mean ${av}°C · ${sm} mm/yr|年均溫 ${av}℃　年雨量 ${sm}mm`),"xs");
  return SV(300,196,b); }
const CLK=Object.keys(CL);
const uonQ=k=>()=>{ const [nm,ft]=CL[k],q=X("ある都市の雨温図です。この都市の気候は？（棒＝降水量、線＝気温）|This is a climate graph for a city. Which climate is it? (bars = rain, line = temperature)|這是某城市的氣溫雨量圖，此城市的氣候是？（長條＝降水量，折線＝氣溫）")+uon(k);
  return {q,ans:X(nm),wrongs:CLW[k].map(w=>({v:X(CL[w][0]),why:X(`${X(CL[w][0])}なら、${X(CL[w][1])}。|${X(CL[w][0])} would be ${X(CL[w][1])}.|若是${X(CL[w][0])}，應為${X(CL[w][1])}。`)})),exp:X(`${X(nm)}：${X(ft)}。|${X(nm)}: ${X(ft)}.|${X(nm)}：${X(ft)}。`),tf:v=>`${q}<br>→ ${v}`,kind:"fig"}; };
const w4=[...CLK.map(uonQ),
  Q("冷帯に広がる、針葉樹の大きな森林を何という？|What is the vast conifer forest of the subarctic zone called?|冷帶廣大的針葉林叫做？","タイガ|Taiga|泰加林",
    [["ツンドラ|Tundra|苔原","ツンドラは寒帯の、短い夏だけ地表の氷がとけてこけ類が生える土地です。|Tundra is polar land where moss grows in the short summer.|苔原是寒帶只有短暫夏季地表冰融化、長出苔類的土地。"],["サバナ|Savanna|莽原","サバナは熱帯の、背の高い草原にまばらに木が生える所です。|Savanna is tropical grassland with scattered trees.|莽原是熱帶高草原中散生樹木的地方。"],["ステップ|Steppe|草原（史帝普）","ステップは乾燥帯の、たけの短い草原です。|Steppe is short-grass dry grassland.|史帝普是乾燥帶的短草草原。"]],
    "タイガ：シベリアやカナダに広がる針葉樹林（冷帯）。|Taiga: conifer forest of Siberia and Canada.|泰加林：分布於西伯利亞、加拿大的針葉林（冷帶）。"),
  Q("日本の大部分が属する気候帯は？|Which climate zone covers most of Japan?|日本大部分屬於哪個氣候帶？","温帯|Temperate|溫帶",
    [["冷帯（亜寒帯）|Subarctic|冷帶（亞寒帶）","冷帯に属するのは北海道です。|Only Hokkaido is subarctic.|屬於冷帶的是北海道。"],["熱帯|Tropical|熱帶","熱帯は赤道付近の、1年中暑い地域です。|The tropics are near the equator.|熱帶是赤道附近全年炎熱的地區。"],["乾燥帯|Dry|乾燥帶","日本は雨が多く、乾燥帯ではありません。|Japan is rainy, not dry.|日本雨量多，不是乾燥帶。"]],
    "日本の大部分は温帯（温暖湿潤気候）、北海道は冷帯。|Most of Japan is temperate (humid subtropical); Hokkaido is subarctic.|日本大部分為溫帶（溫暖濕潤氣候），北海道為冷帶。"),
  Q("ヨーロッパ西部が高緯度のわりに冬も温暖なのは、暖流の北大西洋海流と、その上をふく何という風のため？|Western Europe has mild winters for its latitude because of the warm North Atlantic Current and which wind?|西歐以高緯度來說冬季仍溫和，是因為北大西洋暖流和吹過其上方的哪種風？","偏西風|The westerlies|西風（盛行西風）",
    [["季節風（モンスーン）|Monsoon|季風","季節風は、夏と冬で向きが変わる風で、アジアでよく見られます。|Monsoons change direction by season, mainly in Asia.|季風是夏冬風向改變的風，常見於亞洲。"],["台風|Typhoons|颱風","台風は夏〜秋に日本などをおそう熱帯低気圧です。|Typhoons are tropical storms in summer–autumn.|颱風是夏秋侵襲日本等地的熱帶低氣壓。"],["貿易風|Trade winds|信風（貿易風）","貿易風は赤道付近で東からふく風です。|Trade winds blow from the east near the equator.|信風是在赤道附近由東吹來的風。"]],
    "偏西風：1年中西からふく風。暖流であたためられた空気をヨーロッパへ運ぶ→西岸海洋性気候。|Westerlies carry air warmed by the current into Europe → oceanic climate.|西風全年由西吹來，把暖流加熱的空氣帶到歐洲→西岸海洋性氣候。"),
  Q("アンデス山脈などに見られる、赤道に近くても標高が高いためすずしい気候は？|Which climate is cool despite being near the equator, because of high altitude (e.g. the Andes)?|像安地斯山脈那樣，雖靠近赤道但因海拔高而涼爽的氣候是？","高山気候|Highland climate|高山氣候",
    [["冷帯（亜寒帯）気候|Subarctic|冷帶（亞寒帶）氣候","冷帯は高緯度の地域に見られます。|Subarctic is found at high latitudes.|冷帶出現在高緯度地區。"],["サバナ気候|Savanna|熱帶莽原氣候","サバナ気候は1年中気温が高い熱帯の気候です。|Savanna is hot all year.|熱帶莽原氣候全年高溫。"],["西岸海洋性気候|Marine west coast|西岸海洋性氣候","西岸海洋性気候はヨーロッパ西部などの温帯の気候です。|That is a temperate climate of western Europe.|西岸海洋性氣候是西歐等地的溫帶氣候。"]],
    "高山気候：1年の気温の差は小さいが、1日の気温の差が大きい。|Highland: small yearly range, but big day–night range.|高山氣候：年溫差小，但日夜溫差大。"),
  Q("乾燥帯のうち、少し雨が降り、たけの短い草原が広がる気候は？|Which dry climate gets a little rain and has short grassland?|乾燥帶中，有少量降雨、分布短草草原的氣候是？","ステップ気候|Steppe|草原氣候（史帝普）",
    [["砂漠気候|Desert|沙漠氣候","砂漠気候は雨がほとんど降らず、草もほとんど生えません。|Deserts get almost no rain.|沙漠氣候幾乎不下雨，也幾乎不長草。"],["サバナ気候|Savanna|熱帶莽原氣候","サバナは熱帯の、雨季と乾季がある草原です。|Savanna is tropical with wet/dry seasons.|莽原是熱帶有乾雨季的草原。"],["ツンドラ気候|Tundra|苔原氣候","ツンドラは寒帯の気候です。|Tundra is polar.|苔原氣候屬於寒帶。"]],
    "乾燥帯＝砂漠気候＋ステップ気候。ステップでは羊などの遊牧が行われる。|Dry zone = desert + steppe; steppe supports nomadic herding.|乾燥帶＝沙漠氣候＋草原氣候；草原上有放牧羊群等遊牧活動。"),
];
/* Part5 世界の人々の生活と宗教 */
const REL={chr:"キリスト教|Christianity|基督教",isl:"イスラム教|Islam|伊斯蘭教",bud:"仏教|Buddhism|佛教",hin:"ヒンドゥー教|Hinduism|印度教"};
const RW={chr:"キリスト教は日曜日に教会で祈り、聖典は聖書です。|Christians pray at church on Sundays; the scripture is the Bible.|基督教週日在教堂禮拜，經典是聖經。",
  isl:"イスラム教は1日5回メッカに向かって祈り、豚肉を食べません。|Muslims pray toward Mecca five times a day and don't eat pork.|伊斯蘭教每天5次朝麥加禮拜，不吃豬肉。",
  bud:"仏教はシャカが開き、東南アジアや東アジアに信者が多い宗教です。|Buddhism, founded by the Buddha, is common in Southeast and East Asia.|佛教由釋迦牟尼創立，東南亞、東亞信徒多。",
  hin:"ヒンドゥー教はインドで多く信仰され、牛を神聖な動物とします。|Hinduism, common in India, treats cows as sacred.|印度教在印度信仰者多，視牛為神聖的動物。"};
const RQ=(q,k,exp)=>Q(q,REL[k],Object.keys(REL).filter(x=>x!==k).map(x=>[REL[x],RW[x]]),exp);
const w5=[
  RQ("1日5回、聖地メッカの方向に向かって祈る宗教は？|Which religion prays toward Mecca five times a day?|每天5次朝聖地麥加方向禮拜的宗教是？","isl","イスラム教：聖典はコーラン。西アジア・北アフリカ・東南アジア（インドネシアなど）に多い。|Islam: scripture is the Quran; common in West Asia, North Africa and Southeast Asia (e.g. Indonesia).|伊斯蘭教：經典是古蘭經；西亞、北非、東南亞（如印尼）信徒多。"),
  RQ("豚肉を食べることや、お酒を飲むことが禁止されている宗教は？|Which religion forbids eating pork and drinking alcohol?|禁止吃豬肉和喝酒的宗教是？","isl","イスラム教で食べてよいと認められた食品は「ハラール」と表示される。|Food allowed in Islam is labeled \"halal\".|伊斯蘭教允許食用的食品會標示「清真（Halal）」。"),
  RQ("牛を神聖な動物と考え、牛肉を食べない人が多い宗教は？|In which religion is the cow sacred, so many don't eat beef?|視牛為神聖動物、許多人不吃牛肉的宗教是？","hin","ヒンドゥー教：インドの人口の約8割が信仰。ガンジス川で身を清める（沐浴）。|Hinduism: about 80% of India; people bathe in the Ganges.|印度教：約8成印度人信仰；在恆河沐浴淨身。"),
  RQ("タイなどで、僧が朝に家々を回り、食べ物などを受け取る修行（托鉢）が見られる宗教は？|In which religion do monks in Thailand walk around in the morning receiving food (alms)?|在泰國等地，僧侶早上挨家挨戶接受食物（托缽）的宗教是？","bud","仏教：紀元前5世紀ごろインドでシャカが開いた。東南アジア・東アジアに広がる。|Buddhism: founded in India by the Buddha around the 5th century BCE.|佛教：約西元前5世紀由釋迦牟尼在印度創立，傳布至東南亞、東亞。"),
  RQ("三大宗教のうち、信者がいちばん多い宗教は？|Which of the three world religions has the most followers?|三大宗教中信徒最多的是？","chr","キリスト教：イエスの教え。ヨーロッパ・南北アメリカ・オセアニアに多い。（ヒンドゥー教は三大宗教ではなく、インドの民族宗教）|Christianity: Europe, the Americas, Oceania. (Hinduism is not one of the three world religions.)|基督教：歐洲、南北美洲、大洋洲信徒多（印度教不屬於三大宗教，是印度的民族宗教）。"),
  Q("イスラム教の聖典は？|What is the holy book of Islam?|伊斯蘭教的經典是？","コーラン（クルアーン）|The Quran|古蘭經",
    [["聖書|The Bible|聖經","聖書はキリスト教の聖典です。|The Bible is Christian.|聖經是基督教的經典。"],["経|Sutras|佛經","経は仏教の教えを記したものです。|Sutras are Buddhist.|佛經記載佛教的教義。"],["ハラール|Halal|清真","ハラールはイスラム教で許された食品などのことで、聖典ではありません。|Halal means permitted, not a book.|清真指伊斯蘭教允許的食品等，不是經典。"]],
    "イスラム教：開いたのはムハンマド（7世紀・アラビア半島）。聖典はコーラン、礼拝所はモスク。|Islam: founded by Muhammad (7th c., Arabia); scripture Quran; worship at mosques.|伊斯蘭教：7世紀由穆罕默德在阿拉伯半島創立；經典為古蘭經，禮拜場所為清真寺。"),
  Q("イスラム教で、ラマダンの月に日の出から日没まで飲食をしないことを何という？|In Islam, not eating or drinking from sunrise to sunset during Ramadan is called…|伊斯蘭教在齋戒月從日出到日落不吃不喝，叫做？","断食|Fasting|齋戒（禁食）",
    [["托鉢|Alms round|托缽","托鉢は仏教の僧が食べ物などを受け取る修行です。|Alms rounds are Buddhist.|托缽是佛教僧侶接受食物的修行。"],["巡礼|Pilgrimage|朝聖","巡礼は聖地メッカなどにお参りすることです。|Pilgrimage is visiting Mecca.|朝聖是前往聖地麥加等地參拜。"],["礼拝|Prayer|禮拜","礼拝は1日5回の祈りのことです。|Prayer is five times a day.|禮拜是每天5次的祈禱。"]],
    "ラマダン（断食月）の間、日中は飲食をせず、日没後に食事をとる。|During Ramadan, Muslims eat only after sunset.|齋戒月期間白天不飲食，日落後才進食。"),
  Q("モンゴルの遊牧民が使う、組み立て式で移動できる住居は？|What is the portable tent home of Mongolian nomads?|蒙古遊牧民使用、可組裝移動的住所是？","ゲル|Ger (yurt)|蒙古包",
    [["イグルー|Igloo|冰屋","イグルーは、イヌイットが冬の狩りのときに雪のブロックで作った住居です。|Igloos are Inuit snow houses.|冰屋是因紐特人冬季狩獵時用雪塊建的住所。"],["日干しれんがの家|Mud-brick house|曬乾磚屋","日干しれんがの家は、乾燥帯で土をかためて作る、動かせない家です。|Mud-brick houses are fixed homes in dry areas.|曬乾磚屋是乾燥帶用土製成、無法移動的房子。"],["高床の住居|Stilt house|高腳屋","高床の住居は熱帯などで湿気や熱を防ぐための家です。|Stilt houses keep out damp in the tropics.|高腳屋是熱帶等地為防濕熱的房子。"]],
    "ゲル：骨組みに羊の毛のフェルトをかぶせた住居。家畜と草を求めて移動する遊牧に向く。|A ger is felt over a frame: easy to move for herding.|蒙古包是在骨架上覆蓋羊毛氈的住所，適合逐水草而居的遊牧生活。"),
  Q("シベリアで、建物を高床にしている主な理由は？|Why are buildings in Siberia raised on stilts?|西伯利亞的建築採用高腳式的主要原因是？","建物の熱で永久凍土がとけ、建物がかたむくのを防ぐため|So building heat doesn't melt the permafrost and tilt the building|防止建築的熱使永凍土融化、讓建築傾斜",
    [["風通しをよくして湿気を防ぐため|For airflow and to keep out damp|為了通風防潮","それは熱帯の高床の住居の理由です。|That is the reason in the tropics.|那是熱帶高腳屋的理由。"],["雨水をためるため|To collect rainwater|為了儲存雨水","高床は水をためるためのものではありません。|Stilts aren't for collecting water.|高腳不是用來儲水的。"],["砂ぼこりを防ぐため|To keep out sand|為了防風沙","砂ぼこりは乾燥帯の悩みです。|Sand is a dry-zone problem.|風沙是乾燥帶的困擾。"]],
    "シベリア（冷帯）の地下には、1年中こおった永久凍土がある。|Siberia (subarctic) has permanently frozen ground (permafrost).|西伯利亞（冷帶）地下有全年凍結的永凍土。"),
  Q("木が少ない乾燥帯で、住居の材料によく使われるものは？|In the dry zone with few trees, houses are often made of…|樹木稀少的乾燥帶，常用來蓋房子的材料是？","日干しれんが（土）|Sun-dried mud bricks|曬乾磚（土）",
    [["木|Wood|木材","木の家は森林の多い地域（日本・冷帯など）に多いです。|Wooden houses are common where forests are.|木屋多見於森林多的地區（日本、冷帶等）。"],["雪のブロック|Snow blocks|雪塊","雪のブロックはイヌイットのイグルーです。|Snow blocks make Inuit igloos.|雪塊是因紐特人的冰屋。"],["羊の毛のフェルト|Wool felt|羊毛氈","フェルトはモンゴルのゲルに使われます。|Felt is used for Mongolian gers.|羊毛氈用於蒙古包。"]],
    "日干しれんが：土と草などをこねて型に入れ、日光でかわかしたれんが。|Mud bricks are dried in the sun.|曬乾磚：把土和草等揉和、入模後用陽光曬乾的磚。"),
  Q("アンデス山脈の高地で、荷物を運んだり毛を利用したりするために飼われている動物は？|In the high Andes, which animals are kept to carry loads and for wool?|在安地斯山脈高地，為了搬運貨物和利用毛而飼養的動物是？","リャマ・アルパカ|Llamas and alpacas|駱馬、羊駝",
    [["ラクダ|Camels|駱駝","ラクダは乾燥帯（西アジア・北アフリカなど）で荷物を運びます。|Camels work in deserts.|駱駝在乾燥帶（西亞、北非等）搬運貨物。"],["トナカイ|Reindeer|馴鹿","トナカイは寒帯や冷帯で飼われています。|Reindeer are kept in polar/subarctic areas.|馴鹿飼養於寒帶、冷帶。"],["水牛|Water buffalo|水牛","水牛はアジアの水田で田を耕すのに使われます。|Buffalo plow rice fields in Asia.|水牛在亞洲的水田中用來耕田。"]],
    "アンデスの高地：リャマ・アルパカの放牧、じゃがいもの栽培、毛で作ったポンチョ。|Andes: llamas, alpacas, potatoes, woolen ponchos.|安地斯高地：放牧駱馬、羊駝，種植馬鈴薯，穿毛製斗篷。"),
  Q("西アジアなどで、男性も女性も長い衣服で全身をおおう主な理由は？|Why do people in West Asia often wear long clothes covering the whole body?|西亞等地男女都穿長衣遮住全身的主要原因是？","強い日差しや砂ぼこりから身を守るため|To protect against strong sun and dust|保護身體免受強烈日照和風沙",
    [["寒さを防ぐため|To keep warm|為了防寒","乾燥帯の昼は暑く、寒さが主な理由ではありません。|Desert days are hot; cold isn't the main reason.|乾燥帶白天炎熱，防寒不是主因。"],["雨にぬれないため|To keep dry from rain|為了防雨","乾燥帯は雨がほとんど降りません。|It rarely rains there.|乾燥帶幾乎不下雨。"],["動きやすくするため|To move more easily|為了方便活動","長い衣服は動きやすさのためではありません。|Long robes aren't for ease of movement.|長衣不是為了方便活動。"]],
    "乾燥帯の衣服：風通しのよい長い衣服で、日差しと砂から肌を守る。（イスラム教の教えで女性が肌をかくす意味もある）|Loose long clothes shield skin from sun and sand (and, for women, follow Islamic custom).|乾燥帶的服裝：通風的長衣，保護皮膚免受日曬與風沙（伊斯蘭教的教義中也有女性遮蔽肌膚之意）。"),
];
/* ========== ② 日本の姿（地理的分野 A(1)） ========== */
/* Part1 位置と領域（領土をめぐる問題は、学習指導要領と教科書に書かれた日本政府の立場で出す） */
const EDGE=[["北端|northernmost|最北端","択捉島（北海道）|Etorofu Island (Hokkaido)|擇捉島（北海道）"],["南端|southernmost|最南端","沖ノ鳥島（東京都）|Okinotori Island (Tokyo)|沖之鳥島（東京都）"],
  ["東端|easternmost|最東端","南鳥島（東京都）|Minamitori Island (Tokyo)|南鳥島（東京都）"],["西端|westernmost|最西端","与那国島（沖縄県）|Yonaguni Island (Okinawa)|與那國島（沖繩縣）"]];
const j1=[...TB(EDGE,"日本の{a}の島は？|Which is Japan's {a} island?|日本{a}的島是？","{b}は、日本の東西南北のどの端？|{b} is Japan's … island?|{b}位於日本東西南北的哪一端？","{b}は日本の{a}の島。|{b} is Japan's {a} island.|{b}是日本{a}的島。"),
  Q("国の領域にふくまれないものは？|Which is NOT part of a country's territory (domain)?|哪一項不屬於國家的領域？","排他的経済水域|The exclusive economic zone (EEZ)|專屬經濟海域",
    [["領土|Land territory|領土","領土は国の領域です。|Land territory is part of it.|領土屬於國家的領域。"],["領海|Territorial sea|領海","領海は国の領域です。|The territorial sea is part of it.|領海屬於國家的領域。"],["領空|Territorial airspace|領空","領空（領土と領海の上空）は国の領域です。|Airspace above land and sea is part of it.|領空（領土與領海上空）屬於國家的領域。"]],
    "国の領域＝領土・領海・領空。排他的経済水域は領域ではないが、資源を利用する権利がある。|Territory = land, sea, air. The EEZ isn't territory, but gives resource rights.|國家領域＝領土、領海、領空；專屬經濟海域不是領域，但有利用資源的權利。"),
  Q("日本の領海は、海岸線から何海里まで？|Japan's territorial sea extends how far from the coast?|日本的領海是從海岸線起幾海里？","12海里（約22km）|12 nautical miles (about 22 km)|12海里（約22km）",
    [["200海里（約370km）|200 nautical miles|200海里（約370km）","200海里までは排他的経済水域（領海をのぞく）です。|200 nm is the EEZ limit.|200海里內是專屬經濟海域（不含領海）。"],["3海里（約5.6km）|3 nautical miles|3海里（約5.6km）","いまの日本の領海は12海里です。|Japan's territorial sea is now 12 nm.|現在日本的領海是12海里。"],["100海里（約185km）|100 nautical miles|100海里（約185km）","領海は12海里までです。|It is 12 nm.|領海是到12海里。"]],
    "1海里＝1852m。領海12海里、排他的経済水域は200海里まで（領海をのぞく）。|1 nm = 1,852 m. Territorial sea 12 nm; EEZ to 200 nm (excluding the territorial sea).|1海里＝1852m；領海12海里，專屬經濟海域至200海里（不含領海）。"),
  Q("海岸線から200海里までのうち、領海をのぞく水域を何という？|The waters out to 200 nautical miles, excluding the territorial sea, are called…|從海岸線起至200海里、扣除領海的水域叫做？","排他的経済水域|Exclusive economic zone (EEZ)|專屬經濟海域",
    [["領海|Territorial sea|領海","領海は12海里までで、沿岸国の主権がおよびます。|The territorial sea is 12 nm, under full sovereignty.|領海到12海里，沿岸國擁有主權。"],["公海|High seas|公海","公海はどの国の水域でもなく、どの国も自由に使えます。|The high seas belong to no country.|公海不屬於任何國家，各國都可自由使用。"],["領空|Territorial airspace|領空","領空は領土と領海の上空です。|Airspace is above land and sea.|領空是領土與領海的上空。"]],
    "排他的経済水域では、沿岸国が魚などの水産資源や海底の鉱産資源を利用できる。|In the EEZ, the coastal country owns fish and seabed resources.|在專屬經濟海域內，沿岸國可利用魚類等水產資源及海底礦產資源。"),
  Q("排他的経済水域で、沿岸国に認められていることは？|What does a coastal country have the right to do in its EEZ?|在專屬經濟海域內，沿岸國被承認的權利是？","水産資源や鉱産資源を利用すること|Use the fish and mineral resources|利用水產資源和礦產資源",
    [["外国の船の通行を禁止すること|Ban foreign ships from passing|禁止外國船隻通行","排他的経済水域では、外国の船も自由に通行できます。|Foreign ships may pass freely.|外國船隻也能在專屬經濟海域自由通行。"],["外国の飛行機の通過を禁止すること|Ban foreign planes from flying over|禁止外國飛機飛越","排他的経済水域の上空は領空ではありません。|The air above the EEZ isn't national airspace.|專屬經濟海域上空不是領空。"],["自分の国の領土にすること|Make it national land|將其變成本國領土","排他的経済水域は領域ではありません。|The EEZ is not territory.|專屬經濟海域不是領域。"]],
    "日本は島が多く、排他的経済水域（領海をふくむ）は国土面積の10倍以上ある。|Japan's many islands give it sea areas over 10 times its land area.|日本島嶼多，專屬經濟海域（含領海）是國土面積的10倍以上。"),
  Q("沖ノ鳥島で、多くの費用をかけて護岸工事を行った理由は？|Why was costly shore-protection work done on Okinotori Island?|為何要花大筆經費在沖之鳥島進行護岸工程？","島が水没すると、まわりの広い排他的経済水域を失うから|If the island sank, Japan would lose the large EEZ around it|島嶼若沒入水中，就會失去周圍廣大的專屬經濟海域",
    [["観光客をふやすため|To attract tourists|為了增加觀光客","沖ノ鳥島は人が住まない小さな島で、観光地ではありません。|It's a tiny uninhabited island.|沖之鳥島是無人居住的小島，不是觀光地。"],["人が住めるようにするため|So people can live there|為了讓人能居住","工事の目的は島が波にけずられて消えないようにすることです。|The aim is to stop it eroding away.|工程目的是防止島嶼被海浪侵蝕消失。"],["漁港をつくるため|To build a fishing port|為了建造漁港","漁港づくりが目的ではありません。|Not for a port.|目的不是建漁港。"]],
    "沖ノ鳥島（東京都）は日本の南端。島のまわりに日本の国土面積より広い排他的経済水域がある。|Okinotori (Tokyo) is Japan's southernmost point; its EEZ is larger than Japan's land area.|沖之鳥島（東京都）是日本最南端，周圍的專屬經濟海域比日本國土面積還大。"),
  Q("北方領土（歯舞群島・色丹島・国後島・択捉島）を不法に占拠している国は？|Which country illegally occupies the Northern Territories (Habomai, Shikotan, Kunashiri, Etorofu), in Japan's view?|依日本政府立場，非法占領北方領土（齒舞群島、色丹島、國後島、擇捉島）的國家是？","ロシア|Russia|俄羅斯",
    [["韓国|South Korea|韓國","韓国が不法に占拠しているのは竹島（島根県）です。|South Korea occupies Takeshima (Shimane).|韓國非法占領的是竹島（島根縣）。"],["中国|China|中國","中国は尖閣諸島（沖縄県）の領有権を主張しています。|China claims the Senkaku Islands (Okinawa).|中國主張擁有尖閣諸島（沖繩縣）的主權。"],["アメリカ合衆国|United States|美國","アメリカ合衆国が統治していた沖縄は、1972年に日本に返還されました。|Okinawa was returned to Japan by the U.S. in 1972.|美國統治的沖繩已於1972年歸還日本。"]],
    "北方領土は北海道に属する日本固有の領土で、ソ連（いまのロシア）が占拠した（日本政府の立場）。|The Northern Territories belong to Hokkaido; the USSR (now Russia) occupied them (Japanese government position).|北方領土屬於北海道，是日本固有領土，遭蘇聯（今俄羅斯）占領（日本政府立場）。"),
  Q("島根県に属し、韓国が不法に占拠している島は？|Which island belongs to Shimane and is illegally occupied by South Korea, in Japan's view?|依日本政府立場，屬於島根縣、遭韓國非法占領的島是？","竹島|Takeshima|竹島",
    [["尖閣諸島|Senkaku Islands|尖閣諸島","尖閣諸島は沖縄県に属する島々です。|The Senkakus belong to Okinawa.|尖閣諸島屬於沖繩縣。"],["択捉島|Etorofu Island|擇捉島","択捉島は北海道に属する北方領土の島です。|Etorofu is one of the Northern Territories.|擇捉島是屬於北海道的北方領土。"],["与那国島|Yonaguni Island|與那國島","与那国島は沖縄県の、日本の西端の島です。|Yonaguni is Japan's westernmost island.|與那國島是沖繩縣、日本最西端的島。"]],
    "竹島は島根県に属する日本固有の領土（日本政府の立場）。|Takeshima belongs to Shimane (Japanese government position).|竹島屬於島根縣，是日本固有領土（日本政府立場）。"),
  Q("沖縄県に属し、日本が有効に支配しているが、中国などが領有権を主張している島々は？|Which Okinawa islands does Japan control, though China and others claim them?|屬於沖繩縣、由日本有效管轄，但中國等主張擁有主權的島嶼是？","尖閣諸島|Senkaku Islands|尖閣諸島",
    [["竹島|Takeshima|竹島","竹島は島根県に属し、韓国が占拠しています。|Takeshima (Shimane) is occupied by South Korea.|竹島屬於島根縣，遭韓國占領。"],["北方領土|Northern Territories|北方領土","北方領土は北海道に属し、ロシアが占拠しています。|They belong to Hokkaido, occupied by Russia.|北方領土屬於北海道，遭俄羅斯占領。"],["沖ノ鳥島|Okinotori Island|沖之鳥島","沖ノ鳥島は東京都に属する、日本の南端の島です。|Okinotori (Tokyo) is the southernmost point.|沖之鳥島屬於東京都，是日本最南端。"]],
    "日本政府は、尖閣諸島について「解決すべき領有権の問題は存在しない」という立場。|Japan's government says there is no territorial dispute to resolve over the Senkakus.|日本政府的立場是：尖閣諸島「不存在需要解決的主權問題」。"),
  Q("日本の国土面積は、およそどれくらい？|About how large is Japan's land area?|日本的國土面積大約是多少？","約38万km²|About 380,000 km²|約38萬km²",
    [["約12万km²|About 120,000 km²|約12萬km²","約12万km²は日本の3分の1ほどです。|That's about a third of Japan.|約12萬km²約為日本的3分之1。"],["約98万km²|About 980,000 km²|約98萬km²","日本はその半分以下です。|Japan is under half of that.|日本不到其一半。"],["約3800km²|About 3,800 km²|約3800km²","それは小さな県ほどの面積です。|That's the size of one small prefecture.|那只是一個小縣的面積。"]],
    "日本の面積は約38万km²。南北約3000kmにわたって島々が弓のようにならぶ。|Japan is about 380,000 km², an arc of islands about 3,000 km long.|日本面積約38萬km²，島嶼呈弓形排列，南北綿延約3000km。"),
  Q("日本の位置の説明として正しいものは？|Which describes Japan's location correctly?|關於日本位置的說明，正確的是？","ユーラシア大陸の東にある島国|An island country east of Eurasia|位於歐亞大陸東方的島國",
    [["ユーラシア大陸の西にある島国|An island country west of Eurasia|位於歐亞大陸西方的島國","ユーラシア大陸の西にある島国はイギリスなどです。|That's the UK.|位於歐亞大陸西方的島國是英國等。"],["南半球にある島国|An island country in the south|位於南半球的島國","日本は赤道より北（北半球）にあります。|Japan is north of the equator.|日本在赤道以北（北半球）。"],["インド洋にうかぶ島国|An island country in the Indian Ocean|位於印度洋的島國","日本は太平洋の北西部にあります。|Japan is in the northwest Pacific.|日本位於太平洋西北部。"]],
    "日本：ユーラシア大陸の東、太平洋の北西部にある。北緯約20〜46度・東経約122〜154度。|Japan: east of Eurasia, in the NW Pacific, about 20–46°N, 122–154°E.|日本：位於歐亞大陸東方、太平洋西北部，約北緯20～46度、東經122～154度。"),
];
/* Part2 都道府県と都道府県庁所在地（名前がちがうもの） */
const PREF=[["北海道|Hokkaido|北海道","札幌市|Sapporo|札幌市"],["岩手県|Iwate|岩手縣","盛岡市|Morioka|盛岡市"],["宮城県|Miyagi|宮城縣","仙台市|Sendai|仙台市"],["茨城県|Ibaraki|茨城縣","水戸市|Mito|水戶市"],
  ["栃木県|Tochigi|栃木縣","宇都宮市|Utsunomiya|宇都宮市"],["群馬県|Gunma|群馬縣","前橋市|Maebashi|前橋市"],["埼玉県|Saitama|埼玉縣","さいたま市|Saitama City|埼玉市"],["神奈川県|Kanagawa|神奈川縣","横浜市|Yokohama|橫濱市"],
  ["石川県|Ishikawa|石川縣","金沢市|Kanazawa|金澤市"],["山梨県|Yamanashi|山梨縣","甲府市|Kofu|甲府市"],["愛知県|Aichi|愛知縣","名古屋市|Nagoya|名古屋市"],["三重県|Mie|三重縣","津市|Tsu|津市"],
  ["滋賀県|Shiga|滋賀縣","大津市|Otsu|大津市"],["兵庫県|Hyogo|兵庫縣","神戸市|Kobe|神戶市"],["島根県|Shimane|島根縣","松江市|Matsue|松江市"],["香川県|Kagawa|香川縣","高松市|Takamatsu|高松市"],
  ["愛媛県|Ehime|愛媛縣","松山市|Matsuyama|松山市"],["沖縄県|Okinawa|沖繩縣","那覇市|Naha|那霸市"]];
const PQ=["{a}の都道府県庁所在地は？|What is the capital of {a}?|{a}的縣政府所在地是？","{b}が都道府県庁所在地なのは？|{b} is the capital of which prefecture?|{b}是哪個都道府縣的縣政府所在地？","{a}の都道府県庁所在地は{b}。|The capital of {a} is {b}.|{a}的縣政府所在地是{b}。"];
const NOSEA=[["奈良県|Nara|奈良縣",["和歌山県|Wakayama|和歌山縣","三重県|Mie|三重縣","京都府|Kyoto|京都府"]],["長野県|Nagano|長野縣",["静岡県|Shizuoka|靜岡縣","新潟県|Niigata|新潟縣","富山県|Toyama|富山縣"]],["埼玉県|Saitama|埼玉縣",["千葉県|Chiba|千葉縣","茨城県|Ibaraki|茨城縣","神奈川県|Kanagawa|神奈川縣"]],["岐阜県|Gifu|岐阜縣",["愛知県|Aichi|愛知縣","福井県|Fukui|福井縣","石川県|Ishikawa|石川縣"]]];
const noSea=([a,ws])=>Q("海に面していない県は？|Which prefecture has no coastline?|哪個縣不臨海？",a,ws.map(w=>[w,`${X(w)}は海に面しています。|${X(w)} has a coastline.|${X(w)}臨海。`]),
  "海に面していない8県：栃木・群馬・埼玉・山梨・長野・岐阜・滋賀・奈良。|The 8 landlocked prefectures: Tochigi, Gunma, Saitama, Yamanashi, Nagano, Gifu, Shiga, Nara.|不臨海的8縣：栃木、群馬、埼玉、山梨、長野、岐阜、滋賀、奈良。");
const j2=[...TB(PREF,...PQ),...NOSEA.map(noSea),
  Q("日本の都道府県の数は？|How many prefectures does Japan have?|日本有幾個都道府縣？","47|47|47",
    [["43|43|43","43は「県」の数です。1都1道2府を足します。|43 counts only the ken; add Tokyo, Hokkaido, Osaka and Kyoto.|43是「縣」的數量，還要加上1都1道2府。"],["46|46|46","1都1道2府43県で47です。|1+1+2+43 = 47.|1都1道2府43縣，共47個。"],["50|50|50","50はアメリカ合衆国の州の数です。|50 is the number of U.S. states.|50是美國的州數。"]],
    "47都道府県＝1都（東京都）・1道（北海道）・2府（大阪府・京都府）・43県。|47 = 1 to (Tokyo) + 1 do (Hokkaido) + 2 fu (Osaka, Kyoto) + 43 ken.|47個都道府縣＝1都（東京都）、1道（北海道）、2府（大阪府、京都府）、43縣。"),
  Q("面積がいちばん大きい都道府県は？|Which prefecture is the largest in area?|面積最大的都道府縣是？","北海道|Hokkaido|北海道",
    [["岩手県|Iwate|岩手縣","岩手県は2番目（県では最大）です。|Iwate is 2nd.|岩手縣是第2大。"],["東京都|Tokyo|東京都","東京都は人口は最多ですが、面積は小さいほうです。|Tokyo has the most people, not the most land.|東京都人口最多，但面積偏小。"],["長野県|Nagano|長野縣","長野県は4番目です。|Nagano is 4th.|長野縣是第4大。"]],
    "面積：最大は北海道、最小は香川県。|Largest: Hokkaido. Smallest: Kagawa.|面積：最大為北海道，最小為香川縣。"),
  Q("面積がいちばん小さい都道府県は？|Which prefecture is the smallest in area?|面積最小的都道府縣是？","香川県|Kagawa|香川縣",
    [["大阪府|Osaka|大阪府","大阪府は2番目に小さい都道府県です。|Osaka is 2nd smallest.|大阪府是第2小。"],["東京都|Tokyo|東京都","東京都は3番目に小さい都道府県です。|Tokyo is 3rd smallest.|東京都是第3小。"],["鳥取県|Tottori|鳥取縣","鳥取県は人口がいちばん少ない県です。|Tottori has the fewest people.|鳥取縣是人口最少的縣。"]],
    "香川県は四国の北東部、瀬戸内海に面した県。|Kagawa is in NE Shikoku, on the Seto Inland Sea.|香川縣位於四國東北部，面向瀨戶內海。"),
  Q("人口がいちばん少ない都道府県は？|Which prefecture has the smallest population?|人口最少的都道府縣是？","鳥取県|Tottori|鳥取縣",
    [["香川県|Kagawa|香川縣","香川県は面積がいちばん小さい県です。|Kagawa is the smallest in area.|香川縣是面積最小的縣。"],["島根県|Shimane|島根縣","島根県は2番目に人口が少ない県です。|Shimane is 2nd fewest.|島根縣人口第2少。"],["北海道|Hokkaido|北海道","北海道は面積が最大で、人口も多いほうです。|Hokkaido is large with many people.|北海道面積最大，人口也偏多。"]],
    "人口：最多は東京都、最少は鳥取県。|Most people: Tokyo. Fewest: Tottori.|人口：最多為東京都，最少為鳥取縣。"),
  Q("「府」がつくのは、大阪府と何府？|Besides Osaka, which prefecture is a 'fu'?|帶「府」字的是大阪府和哪個府？","京都府|Kyoto|京都府",
    [["東京都|Tokyo|東京都","東京は「都」です。|Tokyo is a 'to'.|東京是「都」。"],["兵庫県|Hyogo|兵庫縣","兵庫は「県」です。|Hyogo is a 'ken'.|兵庫是「縣」。"],["奈良県|Nara|奈良縣","奈良は「県」です。|Nara is a 'ken'.|奈良是「縣」。"]],
    "1都1道2府43県：都＝東京、道＝北海道、府＝大阪・京都。|To = Tokyo, Do = Hokkaido, Fu = Osaka and Kyoto.|都＝東京，道＝北海道，府＝大阪、京都。"),
];
/* Part3 7地方区分 */
const REG7=[["新潟県|Niigata|新潟縣","中部地方|Chubu|中部地方"],["福井県|Fukui|福井縣","中部地方|Chubu|中部地方"],["静岡県|Shizuoka|靜岡縣","中部地方|Chubu|中部地方"],["長野県|Nagano|長野縣","中部地方|Chubu|中部地方"],["山梨県|Yamanashi|山梨縣","中部地方|Chubu|中部地方"],
  ["三重県|Mie|三重縣","近畿地方|Kinki|近畿地方"],["兵庫県|Hyogo|兵庫縣","近畿地方|Kinki|近畿地方"],["和歌山県|Wakayama|和歌山縣","近畿地方|Kinki|近畿地方"],
  ["山口県|Yamaguchi|山口縣","中国・四国地方|Chugoku-Shikoku|中國、四國地方"],["岡山県|Okayama|岡山縣","中国・四国地方|Chugoku-Shikoku|中國、四國地方"],["徳島県|Tokushima|德島縣","中国・四国地方|Chugoku-Shikoku|中國、四國地方"],
  ["沖縄県|Okinawa|沖繩縣","九州地方|Kyushu|九州地方"],["大分県|Oita|大分縣","九州地方|Kyushu|九州地方"],["鹿児島県|Kagoshima|鹿兒島縣","九州地方|Kyushu|九州地方"],
  ["茨城県|Ibaraki|茨城縣","関東地方|Kanto|關東地方"],["群馬県|Gunma|群馬縣","関東地方|Kanto|關東地方"],["福島県|Fukushima|福島縣","東北地方|Tohoku|東北地方"],["秋田県|Akita|秋田縣","東北地方|Tohoku|東北地方"]];
const j3=[...TB(REG7,"7地方区分で、{a}は何地方？|In the seven-region division, {a} is in which region?|在七地方區分中，{a}屬於哪個地方？","7地方区分で、{b}にふくまれるのは？|In the seven-region division, which is in {b}?|在七地方區分中，屬於{b}的是？","{a}は{b}。|{a} is in {b}.|{a}屬於{b}。"),
  Q("中部地方を3つに分けたとき、日本海側の地域を何という？|When Chubu is split into three, the Sea of Japan side is called…|將中部地方分成三區時，日本海側的地區叫做？","北陸|Hokuriku|北陸",
    [["東海|Tokai|東海","東海は太平洋側の地域です。|Tokai is the Pacific side.|東海是太平洋側的地區。"],["中央高地|Central Highlands|中央高地","中央高地は山に囲まれた内陸の地域です。|The Central Highlands are inland.|中央高地是被山包圍的內陸地區。"],["山陰|San'in|山陰","山陰は中国地方の日本海側です。|San'in is Chugoku's Sea of Japan side.|山陰是中國地方的日本海側。"]],
    "中部地方＝北陸（日本海側）・中央高地（内陸）・東海（太平洋側）。|Chubu = Hokuriku (Sea of Japan), Central Highlands (inland), Tokai (Pacific).|中部地方＝北陸（日本海側）、中央高地（內陸）、東海（太平洋側）。"),
  Q("中国・四国地方を3つに分けたとき、瀬戸内海に面した地域を何という？|When Chugoku-Shikoku is split into three, the area along the Seto Inland Sea is…|將中國、四國地方分成三區時，面向瀨戶內海的地區叫做？","瀬戸内|Setouchi|瀨戶內",
    [["山陰|San'in|山陰","山陰は中国地方の日本海側です。|San'in is the Sea of Japan side.|山陰是中國地方的日本海側。"],["南四国|Southern Shikoku|南四國","南四国は四国の太平洋側です。|Southern Shikoku faces the Pacific.|南四國是四國的太平洋側。"],["北陸|Hokuriku|北陸","北陸は中部地方の日本海側です。|Hokuriku is in Chubu.|北陸是中部地方的日本海側。"]],
    "中国・四国地方＝山陰・瀬戸内・南四国。|Chugoku-Shikoku = San'in, Setouchi, Southern Shikoku.|中國、四國地方＝山陰、瀨戶內、南四國。"),
  Q("7地方区分の7つにふくまれないものは？|Which is NOT one of the seven regions?|哪一個不屬於七地方區分？","北陸地方|Hokuriku|北陸地方",
    [["中部地方|Chubu|中部地方","中部地方は7地方の1つです（北陸はその中の地域）。|Chubu is one; Hokuriku is part of it.|中部地方是七地方之一（北陸是其中一區）。"],["近畿地方|Kinki|近畿地方","近畿地方は7地方の1つです。|Kinki is one.|近畿地方是七地方之一。"],["東北地方|Tohoku|東北地方","東北地方は7地方の1つです。|Tohoku is one.|東北地方是七地方之一。"]],
    "7地方：北海道・東北・関東・中部・近畿・中国・四国・九州（中国・四国で1つ）。|Seven: Hokkaido, Tohoku, Kanto, Chubu, Kinki, Chugoku-Shikoku, Kyushu.|七地方：北海道、東北、關東、中部、近畿、中國・四國、九州。"),
];
/* ========== ③ 世界の諸地域（地理的分野 B(2)） ========== */
/* Part1 アジア州 */
const r1=[
  Q("夏は海から陸へ、冬は陸から海へと、季節によって向きが変わる風を何という？|What is the wind that blows from sea to land in summer and land to sea in winter?|夏季由海吹向陸、冬季由陸吹向海，隨季節改變方向的風叫做？","季節風（モンスーン）|Monsoon|季風",
    [["偏西風|Westerlies|西風","偏西風は1年中西からふく風で、ヨーロッパに影響します。|Westerlies blow from the west all year (Europe).|西風全年由西吹來，影響歐洲。"],["貿易風|Trade winds|信風","貿易風は赤道付近で東からふく風です。|Trade winds blow from the east near the equator.|信風在赤道附近由東吹來。"],["台風|Typhoon|颱風","台風は熱帯の海で発生する強い低気圧です。|A typhoon is a tropical storm.|颱風是在熱帶海洋形成的強烈低氣壓。"]],
    "季節風（モンスーン）：夏は海からしめった風がふいて雨が多く、稲作がさかんになる（東・東南・南アジア）。|Summer monsoon brings rain → rice farming in East, SE and South Asia.|季風：夏季海上濕風帶來豐沛雨量，使稻作興盛（東亞、東南亞、南亞）。"),
  Q("中国で、外国の企業を招くために沿海部に設けられた地区を何という？|What are the coastal zones China set up to attract foreign companies?|中國在沿海設立、用來吸引外國企業的地區叫做？","経済特区|Special economic zones|經濟特區",
    [["一人っ子政策|One-child policy|一胎化政策","一人っ子政策は人口の増加をおさえる政策でした（2015年に廃止）。|That was a population policy (ended 2015).|一胎化政策是抑制人口增加的政策（2015年廢止）。"],["プランテーション|Plantation|大農園","プランテーションは東南アジアなどの大農園です。|Plantations are large farms in SE Asia, etc.|大農園是東南亞等地的大規模農場。"],["ASEAN|ASEAN|東協","ASEANは東南アジアの国々の協力組織です。|ASEAN is a Southeast Asian group.|東協是東南亞國家的合作組織。"]],
    "経済特区（シェンチェンなど）から工業が発展し、中国は「世界の工場」とよばれるようになった。|From zones like Shenzhen, China became the \"world's factory\".|從深圳等經濟特區開始發展工業，中國被稱為「世界工廠」。"),
  Q("中国の人口の約9割をしめる民族は？|About 90% of China's population is which group?|占中國人口約9成的民族是？","漢族|Han Chinese|漢族",
    [["モンゴル族|Mongols|蒙古族","モンゴル族は少数民族の1つです。|Mongols are a minority.|蒙古族是少數民族之一。"],["チベット族|Tibetans|藏族","チベット族は西部に住む少数民族です。|Tibetans are a western minority.|藏族是住在西部的少數民族。"],["ウイグル族|Uyghurs|維吾爾族","ウイグル族は西部に住む少数民族です。|Uyghurs are a western minority.|維吾爾族是住在西部的少數民族。"]],
    "中国は約9割が漢族で、ほかに50をこえる少数民族がくらしている。|About 90% Han, plus over 50 minority groups.|中國約9成為漢族，另有50多個少數民族。"),
  Q("東南アジアの国々が結成した、地域の協力のための組織は？|What organization did Southeast Asian countries form for regional cooperation?|東南亞各國為區域合作而成立的組織是？","ASEAN（東南アジア諸国連合）|ASEAN|東協（東南亞國家協會）",
    [["EU（ヨーロッパ連合）|EU|歐盟","EUはヨーロッパの国々の組織です。|The EU is European.|歐盟是歐洲國家的組織。"],["AU（アフリカ連合）|AU|非洲聯盟","AUはアフリカの国々の組織です。|The AU is African.|非洲聯盟是非洲國家的組織。"],["OPEC（石油輸出国機構）|OPEC|石油輸出國組織","OPECは石油を輸出する国々の組織です。|OPEC is for oil exporters.|石油輸出國組織是石油出口國的組織。"]],
    "ASEAN：1967年結成。加盟国の間で貿易や交流をさかんにしている。|ASEAN (1967) promotes trade and exchange among members.|東協：1967年成立，促進成員國間的貿易與交流。"),
  Q("マレーシアやインドネシアのプランテーションで多く栽培されている作物は？|Which crop is widely grown on plantations in Malaysia and Indonesia?|馬來西亞、印尼的大農園大量栽種的作物是？","油やし（パーム油）|Oil palm|油棕（棕櫚油）",
    [["小麦|Wheat|小麥","小麦はすずしく乾いた地域の作物です。|Wheat suits cool, dry areas.|小麥是涼爽乾燥地區的作物。"],["綿花|Cotton|棉花","綿花はインドのデカン高原などで多く栽培されます。|Cotton is big in India's Deccan.|棉花多栽種於印度德干高原等地。"],["とうもろこし|Corn|玉米","とうもろこしはアメリカ合衆国の中西部などで多く栽培されます。|Corn is big in the U.S. Midwest.|玉米多栽種於美國中西部等地。"]],
    "プランテーション：植民地時代に開かれた大農園。油やし・天然ゴム・バナナなどを輸出向けに栽培。|Plantations from colonial times grow oil palm, rubber, bananas for export.|大農園始於殖民時代，栽種油棕、天然橡膠、香蕉等供出口。"),
  Q("インドの南部のベンガルールなどで発展している産業は？|Which industry has grown in Bengaluru and other cities in southern India?|在印度南部班加羅爾等地發展的產業是？","ICT（情報通信技術）産業|ICT (information technology)|資訊通訊科技（ICT）產業",
    [["石油化学工業|Petrochemicals|石油化學工業","石油の生産がさかんなのは西アジアのペルシア湾岸です。|Oil is big around the Persian Gulf.|石油生產盛行於西亞波斯灣沿岸。"],["自動車工業だけ|Only cars|只有汽車工業","ベンガルールで特に発展しているのはICT産業です。|Bengaluru is known for ICT.|班加羅爾特別發展的是ICT產業。"],["漁業|Fishing|漁業","ベンガルールは内陸の都市です。|Bengaluru is inland.|班加羅爾是內陸城市。"]],
    "インドのICT産業：英語を話す技術者が多く、アメリカと約半日の時差があるため、夜のあいだに仕事を引きつげる。|Many English-speaking engineers, and the time gap with the U.S. lets work continue overnight.|印度ICT產業：會說英語的技術人員多，且與美國有約半天時差，可在夜間接手工作。"),
  Q("西アジアのペルシア湾岸で、多く産出される資源は？|What resource is produced in large amounts around the Persian Gulf?|西亞波斯灣沿岸大量出產的資源是？","石油|Oil|石油",
    [["鉄鉱石|Iron ore|鐵礦石","鉄鉱石はオーストラリアやブラジルで多く産出されます。|Iron ore: Australia, Brazil.|鐵礦石大量產於澳洲、巴西。"],["銅|Copper|銅","銅はチリなどで多く産出されます。|Copper: Chile.|銅大量產於智利等地。"],["石炭|Coal|煤","石炭は中国やオーストラリアなどで多く産出されます。|Coal: China, Australia.|煤大量產於中國、澳洲等地。"]],
    "ペルシア湾岸の産油国は、OPEC（石油輸出国機構）をつくって石油の価格などに影響をあたえている。|Gulf oil producers formed OPEC to influence oil prices.|波斯灣沿岸產油國組成石油輸出國組織（OPEC），影響石油價格等。"),
  Q("同じ土地で1年に2回、米をつくることを何という？|Growing rice twice a year on the same land is called…|同一塊土地一年種兩次稻米叫做？","二期作|Double cropping (of rice)|一年兩穫（二期作）",
    [["二毛作|Two different crops a year|二毛作（一年兩作不同作物）","二毛作は、同じ土地で1年に2種類のちがう作物をつくることです。|Two-crop farming grows two different crops.|二毛作是同一土地一年種兩種不同作物。"],["焼畑農業|Slash-and-burn|游耕（燒墾）","焼畑農業は森林を焼いた灰を肥料にする農業です。|Slash-and-burn uses ash as fertilizer.|游耕是以燒林的灰作肥料的農業。"],["混合農業|Mixed farming|混合農業","混合農業は穀物の栽培と家畜の飼育を組み合わせた農業（ヨーロッパなど）です。|Mixed farming combines crops and livestock.|混合農業是結合穀物栽培與家畜飼養的農業（歐洲等）。"]],
    "二期作：同じ作物（米）を年2回。二毛作：ちがう作物を年2回（例：米と麦）。|Double cropping: rice twice. Two-crop: two different crops.|二期作：同一作物（稻米）一年兩次；二毛作：不同作物一年兩次（如稻和麥）。"),
];
/* Part2 ヨーロッパ州 */
const r2=[
  Q("ヨーロッパの多くの国が加盟し、共通通貨ユーロを使う国が多い組織は？|Which organization do many European countries belong to, many using the euro?|許多歐洲國家加入、多國使用共同貨幣歐元的組織是？","EU（ヨーロッパ連合）|EU (European Union)|歐盟（歐洲聯盟）",
    [["ASEAN|ASEAN|東協","ASEANは東南アジアの組織です。|ASEAN is Southeast Asian.|東協是東南亞的組織。"],["USMCA|USMCA|美墨加協定","USMCAはアメリカ・メキシコ・カナダの協定です。|USMCA is U.S.–Mexico–Canada.|美墨加協定是美國、墨西哥、加拿大的協定。"],["OPEC|OPEC|石油輸出國組織","OPECは石油を輸出する国々の組織です。|OPEC is for oil exporters.|石油輸出國組織是石油出口國的組織。"]],
    "EU：1993年に発足。多くの国の間でパスポートなしで国境をこえられる。2020年にイギリスが離脱。|EU (1993): passport-free travel between many members; the UK left in 2020.|歐盟：1993年成立，許多成員國間不需護照即可跨越國界；英國於2020年脫離。"),
  Q("夏はオリーブ・ぶどう・オレンジ、冬は小麦などを栽培する、地中海沿岸の農業は？|Which Mediterranean farming grows olives, grapes and oranges in summer and wheat in winter?|地中海沿岸夏季種橄欖、葡萄、柳橙，冬季種小麥等的農業是？","地中海式農業|Mediterranean agriculture|地中海式農業",
    [["混合農業|Mixed farming|混合農業","混合農業は穀物と家畜を組み合わせた農業で、ヨーロッパ北部・中部で行われます。|Mixed farming (crops + livestock) is in northern/central Europe.|混合農業結合穀物與家畜，在歐洲北部、中部進行。"],["酪農|Dairy farming|酪農業","酪農は乳牛を飼ってチーズやバターをつくる農業です。|Dairy raises cows for milk and cheese.|酪農業是飼養乳牛製作起司、奶油。"],["遊牧|Nomadic herding|遊牧","遊牧は草と水を求めて家畜と移動するくらしです。|Nomads move with herds.|遊牧是帶著家畜逐水草移動的生活。"]],
    "地中海性気候は夏に乾燥するので、乾燥に強いオリーブやぶどうを夏に育てる。|Dry summers suit drought-tolerant olives and grapes.|地中海型氣候夏季乾燥，所以夏季種耐旱的橄欖、葡萄。"),
  Q("ノルウェーの海岸に見られる、氷河にけずられた谷に海水が入りこんでできた湾は？|What are Norway's coastal inlets formed when the sea filled glacier-carved valleys?|挪威海岸由冰河侵蝕的谷地灌入海水所形成的海灣是？","フィヨルド|Fjord|峽灣",
    [["リアス海岸|Ria coast|谷灣式海岸","リアス海岸は川がつくった谷が沈んでできた海岸です（三陸海岸など）。|Rias are drowned river valleys (e.g. Sanriku).|谷灣式海岸是河谷沉降形成的海岸（如三陸海岸）。"],["三角州|Delta|三角洲","三角州は川の河口に土砂が積もってできた地形です。|Deltas form at river mouths.|三角洲是河口泥沙堆積形成的地形。"],["さんご礁|Coral reef|珊瑚礁","さんご礁はあたたかい海でさんごがつくる地形です。|Coral reefs form in warm seas.|珊瑚礁是溫暖海域中珊瑚形成的地形。"]],
    "フィヨルド：氷河がけずったU字谷に海水が入りこんだ、奥行きの長い湾。|A fjord is a long inlet in a U-shaped glacial valley.|峽灣：冰河侵蝕的U形谷灌入海水形成的狹長海灣。"),
  Q("ドイツ・フランスなど複数の国を流れ、どの国の船も自由に航行できる川（国際河川）は？|Which river flows through several countries (Germany, France…) and is open to all ships (an international river)?|流經德國、法國等多國，各國船隻都能自由航行的河川（國際河川）是？","ライン川|The Rhine|萊茵河",
    [["ナイル川|The Nile|尼羅河","ナイル川はアフリカの、世界でいちばん長い川です。|The Nile is in Africa.|尼羅河是非洲、世界最長的河。"],["アマゾン川|The Amazon|亞馬遜河","アマゾン川は南アメリカの川です。|The Amazon is in South America.|亞馬遜河在南美洲。"],["ミシシッピ川|The Mississippi|密西西比河","ミシシッピ川はアメリカ合衆国の川です。|The Mississippi is in the U.S.|密西西比河在美國。"]],
    "ライン川：アルプスからドイツなどを流れて北海へ。工業地域を結ぶ水運に使われる。|The Rhine runs from the Alps to the North Sea, a key transport route.|萊茵河：從阿爾卑斯山流經德國等地注入北海，是連結工業區的水運要道。"),
  Q("フランス語・イタリア語・スペイン語は、何系の言語？|French, Italian and Spanish are which language group?|法語、義大利語、西班牙語屬於哪一語系？","ラテン系|Latin (Romance)|拉丁語系",
    [["ゲルマン系|Germanic|日耳曼語系","ゲルマン系は英語・ドイツ語など（ヨーロッパ北西部）です。|Germanic: English, German (NW Europe).|日耳曼語系是英語、德語等（歐洲西北部）。"],["スラブ系|Slavic|斯拉夫語系","スラブ系はロシア語・ポーランド語など（東部）です。|Slavic: Russian, Polish (east).|斯拉夫語系是俄語、波蘭語等（東部）。"],["アラビア系|Arabic|阿拉伯語系","アラビア語は西アジア・北アフリカの言語です。|Arabic is spoken in West Asia and North Africa.|阿拉伯語是西亞、北非的語言。"]],
    "ヨーロッパの言語：北西部ゲルマン系・南部ラテン系・東部スラブ系。宗教も北西部プロテスタント・南部カトリック・東部正教会が多い。|Germanic NW, Latin south, Slavic east; religion: Protestant NW, Catholic south, Orthodox east.|歐洲語言：西北部日耳曼語系、南部拉丁語系、東部斯拉夫語系；宗教也多為西北部新教、南部天主教、東部東正教。"),
  Q("EUの課題として、よく取り上げられるものは？|Which is often cited as a problem within the EU?|常被提出的歐盟課題是？","加盟国の間の経済の格差|Economic gaps between member countries|成員國之間的經濟差距",
    [["共通の通貨がないこと|No common currency|沒有共同貨幣","多くの加盟国は共通通貨ユーロを使っています。|Many members use the euro.|許多成員國使用共同貨幣歐元。"],["国境の検査がきびしいこと|Strict border checks|邊境檢查嚴格","多くの加盟国の間では、国境の検査がほとんどありません。|Many members have almost no border checks.|許多成員國之間幾乎沒有邊境檢查。"],["加盟国が少ないこと|Too few members|成員國太少","EUには27か国が加盟しています（2020年以降）。|The EU has 27 members (since 2020).|歐盟有27個成員國（2020年以後）。"]],
    "西ヨーロッパと東ヨーロッパで所得の差が大きく、賃金の安い東ヨーロッパに工場が移ったり、西へ働きに出る人がふえたりしている。|Western members are richer; factories move east and workers move west.|西歐與東歐所得差距大，工廠移往工資較低的東歐，也有許多人前往西歐工作。"),
  Q("ヨーロッパの北部・中部で行われる、小麦などの穀物や飼料作物の栽培と、豚や牛の飼育を組み合わせた農業は？|What farming in northern/central Europe combines grain and fodder crops with pigs and cattle?|歐洲北部、中部結合小麥等穀物與飼料作物栽培，以及養豬、牛的農業是？","混合農業|Mixed farming|混合農業",
    [["地中海式農業|Mediterranean agriculture|地中海式農業","地中海式農業はオリーブ・ぶどうなどを育てる南部の農業です。|That's the south: olives, grapes.|地中海式農業是種橄欖、葡萄等的南部農業。"],["焼畑農業|Slash-and-burn|游耕（燒墾）","焼畑農業は熱帯の農業です。|Slash-and-burn is tropical.|游耕是熱帶的農業。"],["企業的な農業|Agribusiness|企業化農業","アメリカ合衆国などの大規模な農業をさすことが多いです。|Often refers to large U.S. farming.|常指美國等地的大規模農業。"]],
    "ヨーロッパの農業：北部・中部は混合農業、南部は地中海式農業、北海沿岸やアルプスは酪農。|North/central: mixed; south: Mediterranean; North Sea and Alps: dairy.|歐洲農業：北部、中部為混合農業，南部為地中海式農業，北海沿岸、阿爾卑斯山為酪農業。"),
  Q("航空機メーカー「エアバス」の生産の特色は？|What is special about how Airbus planes are made?|飛機製造商「空中巴士」的生產特色是？","各国で部品をつくり、フランスなどで組み立てる国際分業|Parts made in several countries, assembled in France etc.|各國製造零件，在法國等地組裝的國際分工",
    [["すべての部品を1つの国だけでつくる|Everything made in one country|所有零件只在一個國家製造","複数の国が協力しています。|Several countries cooperate.|由多個國家合作。"],["アジアの国だけでつくる|Made only in Asia|只在亞洲國家製造","エアバスはヨーロッパの国々が協力してつくっています。|European countries make Airbus.|空中巴士由歐洲各國合作製造。"],["手作業だけでつくる|Made entirely by hand|全部手工製造","大きな工場で組み立てています。|It's assembled in big factories.|在大型工廠組裝。"]],
    "EUの国々は、国境をこえて協力し、アメリカの大企業に対抗している。|EU countries cooperate across borders to compete with big U.S. firms.|歐盟各國跨國合作，與美國大企業競爭。"),
];
/* Part3 アフリカ州 */
const r3=[
  Q("アフリカ大陸の北部に広がる、世界最大の砂漠は？|What is the world's largest desert, in northern Africa?|分布於非洲大陸北部、世界最大的沙漠是？","サハラ砂漠|The Sahara|撒哈拉沙漠",
    [["ゴビ砂漠|The Gobi|戈壁沙漠","ゴビ砂漠はモンゴルや中国にある砂漠です。|The Gobi is in Mongolia/China.|戈壁沙漠在蒙古、中國。"],["カラハリ砂漠|The Kalahari|喀拉哈里沙漠","カラハリ砂漠はアフリカ南部の砂漠です。|The Kalahari is in southern Africa.|喀拉哈里沙漠在非洲南部。"],["アタカマ砂漠|The Atacama|阿他加馬沙漠","アタカマ砂漠は南アメリカのチリにあります。|The Atacama is in Chile.|阿他加馬沙漠在南美洲智利。"]],
    "サハラ砂漠の南のふち（サヘル）では、砂漠化が進んでいる。|Desertification is spreading in the Sahel, the Sahara's southern edge.|撒哈拉沙漠南緣（薩赫爾）的沙漠化持續擴大。"),
  Q("アフリカ東部を北へ流れ、地中海に注ぐ世界最長の川は？|What is the world's longest river, flowing north through eastern Africa into the Mediterranean?|流經非洲東部向北注入地中海、世界最長的河是？","ナイル川|The Nile|尼羅河",
    [["コンゴ川|The Congo|剛果河","コンゴ川はアフリカ中部の熱帯林を流れる川です。|The Congo flows through central African rainforest.|剛果河流經非洲中部的熱帶雨林。"],["ニジェール川|The Niger|尼日河","ニジェール川はアフリカ西部の川です。|The Niger is in West Africa.|尼日河在非洲西部。"],["アマゾン川|The Amazon|亞馬遜河","アマゾン川は南アメリカの、流域面積が世界最大の川です。|The Amazon has the largest basin.|亞馬遜河在南美洲，流域面積世界最大。"]],
    "ナイル川の流域にエジプト文明が栄えた。|Egyptian civilization grew along the Nile.|埃及文明在尼羅河流域興盛。"),
  Q("特定の農産物や鉱産資源の輸出にたよる経済を何という？|An economy that depends on exporting one or a few products is called…|依賴特定農產品或礦產資源出口的經濟叫做？","モノカルチャー経済|Monoculture economy|單一作物經濟",
    [["混合農業|Mixed farming|混合農業","混合農業はヨーロッパの農業の形です。|Mixed farming is a European farm type.|混合農業是歐洲的農業型態。"],["適地適作|Right crop, right place|適地適作","適地適作はアメリカ合衆国の農業の特色です。|That's a feature of U.S. farming.|適地適作是美國農業的特色。"],["経済特区|Special economic zone|經濟特區","経済特区は中国の外国企業を招く地区です。|That's China's foreign-investment zones.|經濟特區是中國吸引外國企業的地區。"]],
    "モノカルチャー経済は、天候や国際価格の変動で国の収入が大きく変わりやすい。|Income swings with weather and world prices.|單一作物經濟容易因天候或國際價格變動，使國家收入大幅變化。"),
  Q("コートジボワールやガーナで多く生産され、チョコレートの原料になる作物は？|Which chocolate crop is grown widely in Côte d'Ivoire and Ghana?|在象牙海岸、迦納大量生產，是巧克力原料的作物是？","カカオ|Cacao|可可",
    [["コーヒー豆|Coffee beans|咖啡豆","コーヒー豆の生産はブラジルが世界一です。|Brazil leads in coffee.|咖啡豆產量以巴西居世界第一。"],["茶|Tea|茶","茶はインドや中国、ケニアなどで多く生産されます。|Tea: India, China, Kenya.|茶大量產於印度、中國、肯亞等地。"],["さとうきび|Sugarcane|甘蔗","さとうきびはブラジルなどで多く生産されます。|Sugarcane: Brazil, etc.|甘蔗大量產於巴西等地。"]],
    "カカオの生産：コートジボワールとガーナが世界の上位。植民地時代のプランテーションが始まり。|Côte d'Ivoire and Ghana lead; it began with colonial plantations.|可可產量：象牙海岸、迦納居世界前列，起源於殖民時代的大農園。"),
  Q("アフリカで、英語やフランス語を公用語にしている国が多い理由は？|Why do many African countries use English or French as official languages?|非洲許多國家以英語或法語為官方語言的原因是？","かつてヨーロッパの国々の植民地だったから|They were once colonies of European countries|過去曾是歐洲國家的殖民地",
    [["英語やフランス語が古くからアフリカの言葉だったから|They were always African languages|英語、法語自古就是非洲語言","英語やフランス語はヨーロッパの言語です。|They're European languages.|英語、法語是歐洲的語言。"],["アメリカ合衆国が決めたから|The U.S. decided it|由美國決定","アメリカ合衆国が決めたのではありません。|The U.S. didn't decide it.|並不是美國決定的。"],["観光客のためだけ|Only for tourists|只為了觀光客","植民地支配の歴史が理由です。|The reason is colonial history.|原因是殖民統治的歷史。"]],
    "1960年は17か国が独立し「アフリカの年」とよばれた。いまはAU（アフリカ連合）で協力している。|In 1960, 17 countries became independent (\"Year of Africa\"); today they cooperate in the AU.|1960年有17國獨立，被稱為「非洲年」；現在透過非洲聯盟（AU）合作。"),
  Q("携帯電話などに使われ、アフリカ南部などで多く産出される、量が少なく貴重な金属を何という？|What are the scarce metals used in phones, mined a lot in southern Africa?|用於手機等、在非洲南部大量出產的稀少珍貴金屬叫做？","レアメタル（希少金属）|Rare metals|稀有金屬",
    [["鉄鉱石|Iron ore|鐵礦石","鉄鉱石は量が多く、レアメタルではありません。|Iron ore is plentiful.|鐵礦石產量多，不是稀有金屬。"],["石炭|Coal|煤","石炭は金属ではありません。|Coal isn't a metal.|煤不是金屬。"],["ボーキサイト|Bauxite|鋁土礦","ボーキサイトはアルミニウムの原料で、レアメタルにはふくめません。|Bauxite (for aluminum) isn't counted as rare.|鋁土礦是鋁的原料，不算稀有金屬。"]],
    "レアメタル：コバルト・プラチナなど。南アフリカ共和国やコンゴ民主共和国で多く産出。|Rare metals: cobalt, platinum, etc. (South Africa, DR Congo).|稀有金屬：鈷、鉑等，大量產於南非、剛果民主共和國。"),
  Q("南アフリカ共和国で、白人以外の人々を差別した人種隔離政策を何という？（1991年に廃止）|What was South Africa's racial segregation policy (ended 1991)?|南非歧視白人以外人民的種族隔離政策叫做？（1991年廢止）","アパルトヘイト|Apartheid|種族隔離政策",
    [["白豪主義|White Australia policy|白澳政策","白豪主義はオーストラリアの、白人以外の移民を制限した政策です。|That was Australia's immigration policy.|白澳政策是澳洲限制非白人移民的政策。"],["一人っ子政策|One-child policy|一胎化政策","一人っ子政策は中国の人口政策です。|That was China's population policy.|一胎化政策是中國的人口政策。"],["モノカルチャー|Monoculture|單一作物經濟","モノカルチャーは経済のしくみのことです。|That's an economic pattern.|單一作物經濟是一種經濟結構。"]],
    "アパルトヘイトは1991年に廃止され、1994年に黒人のマンデラが大統領になった。|Apartheid ended in 1991; Nelson Mandela became president in 1994.|種族隔離政策於1991年廢止，1994年黑人曼德拉當選總統。"),
];
/* Part4 北アメリカ州 */
const r4=[
  Q("アメリカ合衆国で、地域の気候や土地に合った作物をつくる農業の特色を何という？|What is the U.S. practice of growing the crops best suited to each area's climate and land called?|美國依各地氣候與土地種植合適作物的農業特色叫做？","適地適作|Right crop, right place (tekichi tekisaku)|適地適作",
    [["二期作|Double cropping|一年兩穫","二期作は同じ土地で年2回米をつくることです。|Double cropping is rice twice a year.|二期作是同一土地一年種兩次稻米。"],["モノカルチャー経済|Monoculture economy|單一作物經濟","モノカルチャー経済は、少ない品目の輸出にたよる経済です。|That's depending on a few exports.|單一作物經濟是依賴少數品項出口的經濟。"],["焼畑農業|Slash-and-burn|游耕（燒墾）","焼畑農業は熱帯で行われる農業です。|That's tropical farming.|游耕是熱帶的農業。"]],
    "アメリカの農業：北部〜中部で小麦・とうもろこし・大豆、南部で綿花、西部で放牧。少ない人手で大規模に行う企業的な農業。|North/central: wheat, corn, soy; south: cotton; west: grazing — large-scale agribusiness.|美國農業：北部至中部種小麥、玉米、大豆，南部種棉花，西部放牧；以少量人力大規模經營的企業化農業。"),
  Q("アメリカ合衆国の北緯37度より南の、先端技術産業などが発達した地域を何という？|What is the area of the U.S. south of 37°N where high-tech industry grew?|美國北緯37度以南、先進技術產業發達的地區叫做？","サンベルト|The Sun Belt|陽光帶",
    [["シリコンバレー|Silicon Valley|矽谷","シリコンバレーはサンフランシスコ近くのICT産業の集まる地域で、サンベルトの一部です。|Silicon Valley is one ICT hub within it.|矽谷是舊金山附近ICT產業聚集區，屬於陽光帶的一部分。"],["プレーリー|The Prairies|大草原","プレーリーは中部に広がる草原で、小麦などの畑が広がります。|The Prairies are central grasslands.|大草原是分布於中部的草原，有廣大小麥田。"],["五大湖周辺|Great Lakes area|五大湖周邊","五大湖周辺は鉄鋼や自動車など古くからの工業地域です。|That's the older steel and car region.|五大湖周邊是鋼鐵、汽車等傳統工業區。"]],
    "工業の中心は、五大湖周辺（鉄鋼・自動車）からサンベルト（航空宇宙・ICTなど）へ広がった。|Industry spread from the Great Lakes (steel, cars) to the Sun Belt (aerospace, ICT).|工業重心從五大湖周邊（鋼鐵、汽車）擴展到陽光帶（航太、ICT等）。"),
  Q("サンフランシスコの南にある、ICT関連の企業が集まる地域は？|What area south of San Francisco is home to many ICT companies?|位於舊金山南方、ICT相關企業聚集的地區是？","シリコンバレー|Silicon Valley|矽谷",
    [["デトロイト|Detroit|底特律","デトロイトは五大湖周辺の自動車工業の都市です。|Detroit is the Great Lakes car city.|底特律是五大湖周邊的汽車工業城市。"],["ピッツバーグ|Pittsburgh|匹茲堡","ピッツバーグは鉄鋼業で発展した都市です。|Pittsburgh grew on steel.|匹茲堡是以鋼鐵業發展的城市。"],["ヒューストン|Houston|休士頓","ヒューストンは石油化学や航空宇宙産業の都市です。|Houston: petrochemicals and aerospace.|休士頓是石油化學與航太產業城市。"]],
    "シリコンバレー：半導体の材料のシリコンから名づけられた。|Named after silicon, used for semiconductors.|矽谷：名稱來自半導體材料「矽」。"),
  Q("メキシコや中南米の国々からアメリカ合衆国に移り住んだ、スペイン語を話す人々を何という？|What are Spanish-speaking people who moved to the U.S. from Mexico and Latin America called?|從墨西哥及中南美洲移居美國、說西班牙語的人叫做？","ヒスパニック|Hispanics|西語裔（拉丁裔）",
    [["アボリジニ|Aboriginal Australians|澳洲原住民","アボリジニはオーストラリアの先住民です。|They're Australia's Indigenous people.|澳洲原住民是澳洲的原住民族。"],["マオリ|Māori|毛利人","マオリはニュージーランドの先住民です。|They're New Zealand's Indigenous people.|毛利人是紐西蘭的原住民族。"],["イヌイット|Inuit|因紐特人","イヌイットはカナダ北部などに住む先住民です。|They're Indigenous people of northern Canada.|因紐特人是住在加拿大北部等地的原住民族。"]],
    "ヒスパニックは農場や建設現場などで働く人が多く、アメリカの人口にしめる割合がふえている。|Hispanics are a growing share of the U.S. population.|西語裔多在農場、建築工地等工作，占美國人口的比例持續增加。"),
  Q("北アメリカ大陸の西部を南北に走る、けわしい山脈は？|Which rugged mountain range runs north–south in western North America?|縱貫北美洲大陸西部的險峻山脈是？","ロッキー山脈|The Rocky Mountains|洛磯山脈",
    [["アパラチア山脈|The Appalachians|阿帕拉契山脈","アパラチア山脈は東部のなだらかな山脈です。|The Appalachians are gentle eastern mountains.|阿帕拉契山脈是東部平緩的山脈。"],["アンデス山脈|The Andes|安地斯山脈","アンデス山脈は南アメリカの山脈です。|The Andes are in South America.|安地斯山脈在南美洲。"],["アルプス山脈|The Alps|阿爾卑斯山脈","アルプス山脈はヨーロッパの山脈です。|The Alps are in Europe.|阿爾卑斯山脈在歐洲。"]],
    "北アメリカの地形：西にロッキー山脈、東にアパラチア山脈、中央をミシシッピ川が流れ、北東に五大湖。|West: Rockies; east: Appalachians; center: Mississippi; northeast: Great Lakes.|北美洲地形：西有洛磯山脈、東有阿帕拉契山脈，中央有密西西比河，東北有五大湖。"),
  Q("アメリカ合衆国・メキシコ・カナダの3か国が結んでいる貿易の協定は？|What trade agreement links the U.S., Mexico and Canada?|美國、墨西哥、加拿大三國簽訂的貿易協定是？","USMCA（米国・メキシコ・カナダ協定）|USMCA|美墨加協定（USMCA）",
    [["EU|EU|歐盟","EUはヨーロッパの組織です。|The EU is European.|歐盟是歐洲的組織。"],["ASEAN|ASEAN|東協","ASEANは東南アジアの組織です。|ASEAN is Southeast Asian.|東協是東南亞的組織。"],["AU|AU|非洲聯盟","AUはアフリカの組織です。|The AU is African.|非洲聯盟是非洲的組織。"]],
    "USMCAは2020年に発効（それまではNAFTA）。メキシコには、賃金の安さを生かした工場が多い。|USMCA took effect in 2020 (replacing NAFTA); many factories use Mexico's lower wages.|美墨加協定於2020年生效（之前為北美自由貿易協定）；墨西哥有許多利用低工資的工廠。"),
  Q("カナダで、英語とならんで公用語になっている言語は？|Besides English, which language is official in Canada?|在加拿大，與英語並列為官方語言的是？","フランス語|French|法語",
    [["スペイン語|Spanish|西班牙語","スペイン語はメキシコなどの公用語です。|Spanish is Mexico's language.|西班牙語是墨西哥等國的官方語言。"],["ドイツ語|German|德語","ドイツ語はカナダの公用語ではありません。|German isn't official there.|德語不是加拿大的官方語言。"],["ポルトガル語|Portuguese|葡萄牙語","ポルトガル語はブラジルの公用語です。|Portuguese is Brazil's language.|葡萄牙語是巴西的官方語言。"]],
    "カナダのケベック州などでは、フランス系の人々が多く、フランス語が多く話されている。|In Quebec, many people are of French descent and speak French.|加拿大魁北克省等地法裔居民多，通行法語。"),
];
/* Part5 南アメリカ州・オセアニア州 */
const r5=[
  Q("流域面積が世界最大の、南アメリカの川は？|Which South American river has the world's largest drainage basin?|流域面積世界最大的南美洲河川是？","アマゾン川|The Amazon|亞馬遜河",
    [["ナイル川|The Nile|尼羅河","ナイル川は長さが世界最長のアフリカの川です。|The Nile is the longest, in Africa.|尼羅河是長度世界最長的非洲河川。"],["ラプラタ川|Río de la Plata|拉布拉他河","ラプラタ川はアルゼンチンとウルグアイの間の川です。|It's between Argentina and Uruguay.|拉布拉他河在阿根廷與烏拉圭之間。"],["ミシシッピ川|The Mississippi|密西西比河","ミシシッピ川は北アメリカの川です。|It's in North America.|密西西比河在北美洲。"]],
    "アマゾン川の流域には広大な熱帯林があるが、開発などで減少している。|The Amazon basin's vast rainforest is shrinking from development.|亞馬遜河流域有廣大的熱帶雨林，但因開發等而減少。"),
  Q("ブラジルの公用語は？|What is the official language of Brazil?|巴西的官方語言是？","ポルトガル語|Portuguese|葡萄牙語",
    [["スペイン語|Spanish|西班牙語","南アメリカの多くの国はスペイン語ですが、ブラジルはちがいます。|Most of South America speaks Spanish, but not Brazil.|南美洲多數國家說西班牙語，但巴西不同。"],["英語|English|英語","ブラジルの公用語は英語ではありません。|Not English.|巴西的官方語言不是英語。"],["フランス語|French|法語","フランス語はカナダやアフリカの一部の国などで使われます。|French is used in Canada, parts of Africa.|法語用於加拿大、非洲部分國家等。"]],
    "ブラジルはかつてポルトガルの植民地だった。ほかの多くの国はスペインの植民地だった。|Brazil was a Portuguese colony; most others were Spanish.|巴西曾是葡萄牙的殖民地，其他多數國家曾是西班牙殖民地。"),
  Q("ブラジルで、さとうきびなどの植物から作られ、自動車の燃料に使われるものは？|In Brazil, what fuel for cars is made from plants like sugarcane?|在巴西，由甘蔗等植物製成、用作汽車燃料的是？","バイオエタノール（バイオ燃料）|Bioethanol (biofuel)|生質乙醇（生質燃料）",
    [["石炭|Coal|煤","石炭は地下からほり出す化石燃料です。|Coal is a mined fossil fuel.|煤是從地下開採的化石燃料。"],["天然ガス|Natural gas|天然氣","天然ガスも化石燃料です。|Natural gas is fossil fuel too.|天然氣也是化石燃料。"],["原子力|Nuclear power|核能","原子力は自動車の燃料ではありません。|Not a car fuel.|核能不是汽車燃料。"]],
    "バイオ燃料は、燃やしても大気中の二酸化炭素を（理論上）ふやさないとされるが、畑をふやすための森林伐採が問題になっている。|Biofuel is seen as carbon-neutral, but clearing forest for fields is a problem.|生質燃料被認為燃燒時（理論上）不增加大氣中的二氧化碳，但為擴大農田而砍伐森林成為問題。"),
  Q("南アメリカの西部を南北に走り、高地でリャマやアルパカが飼われる山脈は？|Which mountain range runs along western South America, where llamas and alpacas are kept?|縱貫南美洲西部、高地飼養駱馬和羊駝的山脈是？","アンデス山脈|The Andes|安地斯山脈",
    [["ロッキー山脈|The Rockies|洛磯山脈","ロッキー山脈は北アメリカの山脈です。|The Rockies are in North America.|洛磯山脈在北美洲。"],["ヒマラヤ山脈|The Himalayas|喜馬拉雅山脈","ヒマラヤ山脈はアジアの山脈です。|The Himalayas are in Asia.|喜馬拉雅山脈在亞洲。"],["グレートディバイディング山脈|Great Dividing Range|大分水嶺","グレートディバイディング山脈はオーストラリア東部の山脈です。|That's in eastern Australia.|大分水嶺在澳洲東部。"]],
    "アンデス山脈の高地にはかつてインカ帝国が栄え、マチュピチュ（ペルー）の遺跡が残る。|The Inca Empire flourished in the Andes; Machu Picchu (Peru) remains.|安地斯高地曾有印加帝國興盛，留有馬丘比丘（祕魯）遺跡。"),
  Q("アルゼンチンに広がり、小麦の栽培や牛の放牧が行われる草原は？|What grassland in Argentina is used for wheat and cattle?|分布於阿根廷、種植小麥與放牧牛隻的草原是？","パンパ|The Pampas|彭巴草原",
    [["プレーリー|The Prairies|北美大草原","プレーリーは北アメリカの草原です。|The Prairies are in North America.|北美大草原在北美洲。"],["サバナ|Savanna|莽原","サバナは熱帯の草原です。|Savanna is tropical.|莽原是熱帶的草原。"],["タイガ|Taiga|泰加林","タイガは冷帯の針葉樹林です。|Taiga is subarctic forest.|泰加林是冷帶的針葉林。"]],
    "パンパ：ラプラタ川の流域に広がる温帯の草原。|The Pampas are temperate grasslands around the Río de la Plata.|彭巴草原：分布於拉布拉他河流域的溫帶草原。"),
  Q("オーストラリアの先住民を何という？|What are Australia's Indigenous people called?|澳洲的原住民族叫做？","アボリジニ（アボリジナルピープル）|Aboriginal peoples|澳洲原住民（Aboriginal）",
    [["マオリ|Māori|毛利人","マオリはニュージーランドの先住民です。|Māori are New Zealand's.|毛利人是紐西蘭的原住民族。"],["イヌイット|Inuit|因紐特人","イヌイットはカナダ北部などの先住民です。|Inuit live in northern Canada.|因紐特人是加拿大北部等地的原住民族。"],["ヒスパニック|Hispanics|西語裔","ヒスパニックはアメリカ合衆国のスペイン語を話す移民です。|Hispanics are Spanish-speaking U.S. migrants.|西語裔是美國說西班牙語的移民。"]],
    "オーストラリアは白豪主義（白人以外の移民の制限）をやめ、いまはアジアなどからの移民も多い多文化社会。|Australia ended the White Australia policy and is now multicultural.|澳洲廢除白澳政策，現在是有許多亞洲等地移民的多元文化社會。"),
  Q("オーストラリアの北西部で、地表から直接ほり進める「露天掘り」で多く産出される資源は？|What resource is mined in open pits in northwestern Australia?|澳洲西北部以「露天開採」大量出產的資源是？","鉄鉱石|Iron ore|鐵礦石",
    [["石油|Oil|石油","石油が多いのは西アジアのペルシア湾岸です。|Oil is big in the Persian Gulf.|石油多產於西亞波斯灣沿岸。"],["銅|Copper|銅","銅はチリで多く産出されます。|Copper: Chile.|銅大量產於智利。"],["金|Gold|金","オーストラリアは金も産出しますが、北西部の露天掘りといえば鉄鉱石です。|Australia has gold too, but NW open pits mean iron ore.|澳洲也產金，但西北部的露天開採以鐵礦石為主。"]],
    "オーストラリア：北西部で鉄鉱石、東部で石炭。日本や中国などアジアの国々へ多く輸出している。|Iron ore in the northwest, coal in the east, exported mostly to Asia.|澳洲：西北部產鐵礦石、東部產煤，大量出口至日本、中國等亞洲國家。"),
  Q("ニュージーランドの先住民を何という？|What are New Zealand's Indigenous people called?|紐西蘭的原住民族叫做？","マオリ|Māori|毛利人",
    [["アボリジニ|Aboriginal Australians|澳洲原住民","アボリジニはオーストラリアの先住民です。|They are Australia's.|澳洲原住民是澳洲的原住民族。"],["メスチソ|Mestizos|麥士蒂索人","メスチソは、中南米の先住民とヨーロッパ系の人々との混血の人々です。|Mestizos are of mixed Indigenous and European ancestry in Latin America.|麥士蒂索人是中南美洲原住民與歐洲裔的混血。"],["イヌイット|Inuit|因紐特人","イヌイットはカナダ北部などの先住民です。|Inuit live in northern Canada.|因紐特人是加拿大北部等地的原住民族。"]],
    "ニュージーランドでは、マオリの文化を大切にし、マオリ語も公用語になっている。|New Zealand values Māori culture; Māori is an official language.|紐西蘭重視毛利文化，毛利語也是官方語言。"),
];
/* ========== ④ 古代までの日本（歴史的分野 B(1)） ========== */
/* 年号の表：[年, できごと, ひとこと]。組み合わせカードと「古い順」の問題でも使う */
const Y_ANC=[["57年|57|57年","奴国の王が金印を授かる|King of Na receives a gold seal|奴國王獲贈金印","中国の後漢の皇帝から。「漢委奴国王」と刻まれた金印が志賀島（福岡県）で見つかった。|From the Later Han emperor; found on Shikanoshima (Fukuoka).|由中國東漢皇帝所贈，刻有「漢委奴國王」的金印在志賀島（福岡縣）出土。"],
  ["239年|239|239年","卑弥呼が魏に使いを送る|Himiko sends envoys to Wei|卑彌呼遣使至魏","邪馬台国の女王。「親魏倭王」の称号を受けた（『魏志』倭人伝）。|Queen of Yamatai; titled \"King of Wa, Friend of Wei\".|邪馬台國女王，獲封「親魏倭王」稱號（《魏志》倭人傳）。"],
  ["593年|593|593年","聖徳太子が推古天皇を助ける政治を始める|Prince Shotoku begins assisting Empress Suiko|聖德太子開始輔佐推古天皇","蘇我馬子と協力して、天皇中心の国づくりを進めた。|With Soga no Umako, he built a state centered on the ruler.|與蘇我馬子合作，推動以天皇為中心的國家建設。"],
  ["603年|603|603年","冠位十二階を定める|The Twelve Cap Ranks are set|制定冠位十二階","家がらにとらわれず、才能のある人を役人に取り立てた。|Officials chosen by talent, not family.|不拘家世，任用有才能的人為官。"],
  ["604年|604|604年","十七条の憲法を定める|The Seventeen-Article Constitution|制定十七條憲法","仏教や儒教の考えを取り入れ、役人の心構えを示した。|Rules for officials based on Buddhism and Confucianism.|融入佛教、儒教思想，揭示官員應有的態度。"],
  ["607年|607|607年","小野妹子を遣隋使として送る|Ono no Imoko sent as envoy to Sui|派小野妹子為遣隋使","隋の進んだ制度や文化を取り入れるため。|To learn from Sui China.|為了引進隋朝先進的制度與文化。"],
  ["645年|645|645年","大化の改新が始まる|The Taika Reform begins|大化革新開始","中大兄皇子と中臣鎌足が蘇我氏をたおした。公地公民の方針。|Prince Naka no Oe and Nakatomi no Kamatari overthrew the Soga.|中大兄皇子與中臣鎌足推翻蘇我氏，提出公地公民方針。"],
  ["663年|663|663年","白村江の戦い|Battle of Baekgang (Hakusukinoe)|白村江之戰","百済を助けた日本が、唐と新羅の連合軍に敗れた。|Japan, helping Baekje, lost to Tang and Silla.|援助百濟的日本敗給唐與新羅聯軍。"],
  ["672年|672|672年","壬申の乱|The Jinshin War|壬申之亂","天皇の後つぎ争い。勝った大海人皇子が天武天皇になった。|A succession war; Prince Oama won and became Emperor Tenmu.|天皇繼承之爭，獲勝的大海人皇子即位為天武天皇。"],
  ["701年|701|701年","大宝律令を定める|The Taiho Code is issued|制定大寶律令","唐の律令にならった法律。全国を治めるしくみが整った。|A legal code modeled on Tang China.|仿效唐朝律令的法典，建立治理全國的體制。"],
  ["710年|710|710年","平城京に都を移す|Capital moves to Heijo-kyo (Nara)|遷都平城京","唐の都・長安にならった都（奈良時代の始まり）。|Modeled on Chang'an; start of the Nara period.|仿效唐都長安（奈良時代開始）。"],
  ["743年|743|743年","墾田永年私財法を出す|Law allowing permanent ownership of new fields|頒布墾田永年私財法","開墾した土地の永久の私有を認めた→のちの荘園のもとに。|Newly cleared land could be owned forever → later estates (shoen).|承認新開墾土地可永久私有→成為日後莊園的起源。"],
  ["752年|752|752年","東大寺の大仏が完成する|The Great Buddha of Todaiji is completed|東大寺大佛完成","聖武天皇が仏教の力で国を守ろうとした。行基が協力。|Emperor Shomu sought to protect the country through Buddhism.|聖武天皇想藉佛教的力量守護國家，行基協助。"],
  ["794年|794|794年","平安京に都を移す|Capital moves to Heian-kyo (Kyoto)|遷都平安京","桓武天皇が政治を立て直すため（平安時代の始まり）。|Emperor Kanmu, to reform government; start of Heian.|桓武天皇為重整政治而遷都（平安時代開始）。"],
  ["894年|894|894年","遣唐使を停止する|Envoys to Tang are stopped|停派遣唐使","菅原道真が提案。のちに国風文化が栄えた。|Proposed by Sugawara no Michizane; Japanese-style culture later flourished.|由菅原道真提議，之後國風文化興盛。"],
  ["1016年|1016|1016年","藤原道長が摂政になる|Fujiwara no Michinaga becomes regent|藤原道長成為攝政","摂関政治の全盛期。|The peak of Fujiwara regency rule.|攝關政治的全盛期。"],
  ["1086年|1086|1086年","白河上皇が院政を始める|Retired Emperor Shirakawa begins cloister rule|白河上皇開始院政","位をゆずった上皇が政治を行う。|A retired emperor ruled from behind.|讓位後的上皇主持政治。"],
  ["1167年|1167|1167年","平清盛が太政大臣になる|Taira no Kiyomori becomes Chancellor|平清盛成為太政大臣","武士として初めて。日宋貿易を進めた。|The first samurai to do so; promoted trade with Song.|武士中的第一人，推動日宋貿易。"]];
// 年号の表から「古い順に正しくならべたもの」を作る
function ORD(rows){ return ()=>{ const yr=r=>parseInt(X(r[0])),ch=shuf(rows).slice(0,3).sort((a,b)=>yr(a)-yr(b)),nm=ch.map(r=>X(r[1]));
  const sq=o=>o.map(i=>nm[i]).join(" → "); const ans=sq([0,1,2]);
  const ws=shuf([[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]]).slice(0,3).map(o=>({v:sq(o),why:X("正しい順：|Correct order: |正確順序：")+ch.map(r=>X(r[1])+X(`（${X(r[0])}）| (${X(r[0])})|（${X(r[0])}）`)).join(" → ")}));
  const q=X("次のできごとを、古い順に正しくならべたものは？|Which puts these events in the correct order (oldest first)?|下列事件依時間先後排列，正確的是？");
  return {q,ans,wrongs:ws,exp:ch.map(r=>X(r[0])+X("：|: |：")+X(r[1])).join("<br>"),tf:v=>`${q}<br>→ ${v}`,kind:"word"}; }; }
// 時代の順
const ERA=["旧石器時代|Paleolithic|舊石器時代","縄文時代|Jomon|繩文時代","弥生時代|Yayoi|彌生時代","古墳時代|Kofun|古墳時代","飛鳥時代|Asuka|飛鳥時代","奈良時代|Nara|奈良時代","平安時代|Heian|平安時代","鎌倉時代|Kamakura|鎌倉時代","室町時代|Muromachi|室町時代"];
function eraOrd(a,b){ return ()=>{ const idx=shuf(Array.from({length:b-a+1},(_,i)=>a+i)).slice(0,3).sort((x,y)=>x-y),nm=idx.map(i=>X(ERA[i]));
  const sq=o=>o.map(i=>nm[i]).join(" → "),ans=sq([0,1,2]),why=X("正しい順：|Correct order: |正確順序：")+ans;
  const q=X("次の時代を、古い順に正しくならべたものは？|Which puts these periods in order (oldest first)?|下列時代依先後排列，正確的是？");
  return {q,ans,wrongs:shuf([[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]]).slice(0,3).map(o=>({v:sq(o),why})),exp:X("時代の流れ：|Order of periods: |時代順序：")+ERA.slice(a,b+1).map(X).join(" → "),tf:v=>`${q}<br>→ ${v}`,kind:"word"}; }; }
/* Part1 古代文明と宗教のおこり */
const CIV=[["エジプト文明|Egyptian civilization|埃及文明","ナイル川|the Nile|尼羅河","ピラミッド・象形文字・太陽暦。|Pyramids, hieroglyphs, a solar calendar.|金字塔、象形文字、太陽曆。"],
  ["メソポタミア文明|Mesopotamian civilization|美索不達米亞文明","チグリス川・ユーフラテス川|the Tigris and Euphrates|底格里斯河、幼發拉底河","くさび形文字・太陰暦・60進法・ハンムラビ法典。|Cuneiform, a lunar calendar, base-60, Code of Hammurabi.|楔形文字、太陰曆、六十進位法、漢摩拉比法典。"],
  ["インダス文明|Indus civilization|印度河文明","インダス川|the Indus|印度河","モヘンジョ・ダロの都市遺跡・インダス文字（まだ読めない）。|Mohenjo-daro; the Indus script is still undeciphered.|摩亨佐達羅城市遺跡、印度河文字（尚未解讀）。"],
  ["中国文明|Chinese civilization|中國文明","黄河（・長江）|the Yellow River (and Yangtze)|黃河（、長江）","殷の時代に甲骨文字が使われた。|Oracle-bone script was used under the Yin (Shang).|殷商時代使用甲骨文。"]];
const SCR=[["エジプト文明|Egyptian civilization|埃及文明","象形文字|Hieroglyphs|象形文字"],["メソポタミア文明|Mesopotamian civilization|美索不達米亞文明","くさび形文字|Cuneiform|楔形文字"],["インダス文明|Indus civilization|印度河文明","インダス文字|Indus script|印度河文字"],["中国文明（殷）|Chinese (Yin/Shang)|中國文明（殷商）","甲骨文字|Oracle-bone script|甲骨文"]];
const h1=[...TB(CIV,"{a}が栄えた川は？|Along which river did {a} flourish?|{a}在哪條河流域興盛？","{b}の流域で栄えた文明は？|Which civilization flourished along {b}?|在{b}流域興盛的文明是？","{a}は{b}の流域で栄えた。|{a} grew along {b}.|{a}在{b}流域興盛。"),
  ...TB(SCR,"{a}で使われた文字は？|Which writing was used in {a}?|{a}使用的文字是？",null,"{a}では{b}が使われた。|{a} used {b}.|{a}使用{b}。"),
  Q("占いの結果を、亀の甲や牛の骨に刻んだ文字は？|Which writing was carved on turtle shells and ox bones to record fortune-telling?|把占卜結果刻在龜甲、牛骨上的文字是？","甲骨文字|Oracle-bone script|甲骨文",
    [["象形文字|Hieroglyphs|象形文字","象形文字はエジプトの文字で、パピルスなどに書かれました。|Egyptian, written on papyrus etc.|象形文字是埃及的文字，寫在莎草紙等上。"],["くさび形文字|Cuneiform|楔形文字","くさび形文字はメソポタミアで粘土板に刻まれました。|Mesopotamian, pressed into clay.|楔形文字是美索不達米亞刻在泥板上的文字。"],["かな文字|Kana|假名","かな文字は平安時代の日本で生まれました。|Kana came from Heian Japan.|假名誕生於平安時代的日本。"]],
    "甲骨文字は中国の殷でつくられ、漢字のもとになった。|Oracle-bone script (Yin/Shang China) became the root of Chinese characters.|甲骨文創於中國殷商，是漢字的起源。"),
  Q("紀元前3世紀に中国を初めて統一し、万里の長城を整備した皇帝は？|Who first unified China in the 3rd century BCE and built up the Great Wall?|西元前3世紀首次統一中國、整修萬里長城的皇帝是？","秦の始皇帝|The First Emperor of Qin|秦始皇",
    [["光武帝|Emperor Guangwu|光武帝","光武帝は後漢の皇帝で、奴国の王に金印を授けました。|He was a Later Han emperor who gave Na a gold seal.|光武帝是東漢皇帝，曾贈金印給奴國王。"],["フビライ・ハン|Kublai Khan|忽必烈","フビライ・ハンは13世紀の元の皇帝です。|Kublai ruled the Yuan in the 13th century.|忽必烈是13世紀元朝的皇帝。"],["孔子|Confucius|孔子","孔子は皇帝ではなく、儒教（儒学）を説いた思想家です。|Confucius was a thinker, not an emperor.|孔子不是皇帝，是倡導儒家思想的思想家。"]],
    "始皇帝は文字・貨幣・ものさしなどを統一した。万里の長城は北方の遊牧民の侵入を防ぐため。|He standardized writing, coins and measures; the Wall kept out northern nomads.|秦始皇統一文字、貨幣、度量衡；萬里長城用來防禦北方遊牧民族入侵。"),
  Q("思いやりの心（仁）で行いを正し、国を治めることを説いた中国の思想家は？|Which Chinese thinker taught ruling through benevolence (ren)?|主張以仁心端正行為、治理國家的中國思想家是？","孔子|Confucius|孔子",
    [["シャカ|The Buddha|釋迦牟尼","シャカはインドで仏教を開いた人物です。|The Buddha founded Buddhism in India.|釋迦牟尼是在印度創立佛教的人。"],["イエス|Jesus|耶穌","イエスの教えはキリスト教になりました。|Jesus's teachings became Christianity.|耶穌的教誨成為基督教。"],["始皇帝|The First Emperor|秦始皇","始皇帝は中国を統一した秦の皇帝です。|He was the Qin emperor.|秦始皇是統一中國的秦朝皇帝。"]],
    "孔子の教えは儒教（儒学）として、朝鮮や日本にも広まった。|Confucianism spread to Korea and Japan.|孔子的學說成為儒家（儒學），也傳到朝鮮與日本。"),
  Q("中国からローマへ絹などを運んだ交易路は？|What trade route carried silk from China to Rome?|把絲綢等從中國運往羅馬的貿易路線是？","シルクロード（絹の道）|The Silk Road|絲路",
    [["万里の長城|The Great Wall|萬里長城","万里の長城は北方の遊牧民の侵入を防ぐ城壁です。|The Wall was a defense, not a route.|萬里長城是防禦北方遊牧民族的城牆。"],["東海道|The Tokaido|東海道","東海道は日本の街道です。|The Tokaido is a road in Japan.|東海道是日本的街道。"],["ナイル川|The Nile|尼羅河","ナイル川はアフリカの川です。|The Nile is in Africa.|尼羅河是非洲的河川。"]],
    "漢の時代にシルクロードが開かれ、中国の絹が西方へ、西方の文化が中国へ伝わった。|Under the Han, silk went west and Western culture came east.|漢代開通絲路，中國絲綢西傳，西方文化東傳。"),
  Q("古代ギリシャでつくられた、都市国家を何という？|What were the city-states of ancient Greece called?|古希臘的城邦叫做？","ポリス|Polis|城邦（Polis）",
    [["ローマ帝国|Roman Empire|羅馬帝國","ローマ帝国は地中海を囲む広い地域を支配した大帝国です。|Rome was a big empire around the Mediterranean.|羅馬帝國是統治地中海周圍廣大地區的大帝國。"],["モスク|Mosque|清真寺","モスクはイスラム教の礼拝所です。|A mosque is an Islamic place of worship.|清真寺是伊斯蘭教的禮拜場所。"],["ピラミッド|Pyramid|金字塔","ピラミッドはエジプトの王の墓などとされます。|Pyramids are Egyptian royal tombs.|金字塔被認為是埃及國王的陵墓等。"]],
    "アテネなどのポリスでは、成人男性の市民が民会で話し合う民主政が行われた。|In Athens, adult male citizens debated in the assembly (democracy).|雅典等城邦實行由成年男性公民在公民大會討論的民主政治。"),
  Q("7世紀にアラビア半島でイスラム教を開いた人物は？|Who founded Islam in the Arabian Peninsula in the 7th century?|7世紀在阿拉伯半島創立伊斯蘭教的人是？","ムハンマド|Muhammad|穆罕默德",
    [["イエス|Jesus|耶穌","イエスの教えはキリスト教です（パレスチナ）。|Jesus → Christianity (Palestine).|耶穌的教誨是基督教（巴勒斯坦）。"],["シャカ|The Buddha|釋迦牟尼","シャカは紀元前5世紀ごろインドで仏教を開きました。|The Buddha founded Buddhism in India c. 5th c. BCE.|釋迦牟尼約於西元前5世紀在印度創立佛教。"],["孔子|Confucius|孔子","孔子は中国の思想家で、儒教のもとです。|Confucius was a Chinese thinker.|孔子是中國思想家，儒家的始祖。"]],
    "仏教（シャカ・インド）、キリスト教（イエス・パレスチナ）、イスラム教（ムハンマド・アラビア半島）。|Buddhism (the Buddha, India), Christianity (Jesus, Palestine), Islam (Muhammad, Arabia).|佛教（釋迦牟尼、印度）、基督教（耶穌、巴勒斯坦）、伊斯蘭教（穆罕默德、阿拉伯半島）。"),
];
/* Part2 縄文・弥生・古墳 */
const h2=[eraOrd(0,4),eraOrd(0,4),
  Q("表面に縄目の文様がついた土器が使われ、狩りや漁・採集でくらした時代は？|In which period did people use pottery with cord patterns and live by hunting, fishing and gathering?|使用表面有繩紋的陶器、以狩獵、捕魚、採集為生的時代是？","縄文時代|Jomon period|繩文時代",
    [["弥生時代|Yayoi period|彌生時代","弥生時代には、うすくてかたい弥生土器が使われ、稲作が広まりました。|Yayoi had thin, hard pottery and rice farming.|彌生時代使用薄而硬的彌生陶器，稻作普及。"],["古墳時代|Kofun period|古墳時代","古墳時代は大きな墓（古墳）がつくられた時代です。|Kofun is the age of big burial mounds.|古墳時代是建造大型墳墓（古墳）的時代。"],["旧石器時代|Paleolithic|舊石器時代","旧石器時代には、まだ土器はつくられていません。|There was no pottery yet.|舊石器時代還沒有製作陶器。"]],
    "縄文時代：縄文土器・竪穴住居・貝塚・土偶。|Jomon: cord-marked pottery, pit dwellings, shell mounds, clay figurines.|繩文時代：繩文陶器、豎穴式住居、貝塚、土偶。"),
  Q("縄文時代の人々が食べた貝のからなどを捨てた跡を何という？|What are the sites where Jomon people threw away shells called?|繩文時代人們丟棄所吃貝殼等的遺跡叫做？","貝塚|Shell mounds|貝塚",
    [["古墳|Burial mound (kofun)|古墳","古墳は王や豪族の墓です。|Kofun are tombs of rulers.|古墳是王或豪族的墳墓。"],["環濠集落|Moated village|環濠聚落","環濠集落はまわりを堀で囲んだ弥生時代のむらです。|Moated villages are Yayoi.|環濠聚落是周圍以壕溝圍繞的彌生時代聚落。"],["竪穴住居|Pit dwelling|豎穴式住居","竪穴住居は地面をほって柱を立て、屋根をかけた住まいです。|A pit dwelling is a house.|豎穴式住居是挖地立柱、搭上屋頂的住所。"]],
    "大森貝塚（東京都）は、アメリカ人のモースが発見した。|Edward Morse discovered the Omori shell mound (Tokyo).|大森貝塚（東京都）由美國人摩斯發現。"),
  Q("青森県にある、縄文時代の大きな集落の遺跡は？|Which large Jomon village site is in Aomori?|位於青森縣的繩文時代大型聚落遺跡是？","三内丸山遺跡|Sannai-Maruyama site|三內丸山遺跡",
    [["吉野ヶ里遺跡|Yoshinogari site|吉野里遺跡","吉野ヶ里遺跡は佐賀県にある弥生時代の環濠集落です。|Yoshinogari is a Yayoi moated village in Saga.|吉野里遺跡是佐賀縣的彌生時代環濠聚落。"],["登呂遺跡|Toro site|登呂遺跡","登呂遺跡は静岡県にある弥生時代の水田の跡です。|Toro is a Yayoi rice-field site in Shizuoka.|登呂遺跡是靜岡縣的彌生時代水田遺跡。"],["大仙古墳|Daisen Kofun|大仙古墳","大仙古墳は大阪府堺市にある古墳時代の墓です。|Daisen is a Kofun-period tomb in Sakai.|大仙古墳是大阪府堺市的古墳時代墳墓。"]],
    "三内丸山遺跡では、大きな建物の柱の跡や、遠くの地域とのつながりを示す品が見つかっている。|Large building posts and goods from distant areas were found there.|三內丸山遺跡出土大型建築柱跡，以及顯示與遠方交流的物品。"),
  Q("弥生時代に、稲の穂をつみとるのに使われた道具は？|Which Yayoi tool was used to cut rice heads?|彌生時代用來摘取稻穗的工具是？","石包丁|Stone reaping knife|石刀（石包丁）",
    [["銅鐸|Dotaku bronze bell|銅鐸","銅鐸は祭りに使われたと考えられる青銅器です。|Dotaku were bronze ritual bells.|銅鐸被認為是祭祀用的青銅器。"],["打製石器|Chipped stone tools|打製石器","打製石器は旧石器時代の、石を打ちかいてつくった道具です。|Chipped tools are Paleolithic.|打製石器是舊石器時代打擊石頭製成的工具。"],["土偶|Clay figurine (dogu)|土偶","土偶は縄文時代の土の人形です。|Dogu are Jomon clay figures.|土偶是繩文時代的泥人偶。"]],
    "弥生時代：大陸から稲作が伝わり、石包丁で穂をつみ、高床倉庫に米をたくわえた。|Yayoi: rice farming arrived; heads cut with stone knives, rice stored in raised granaries.|彌生時代：稻作從大陸傳入，以石刀摘穗，把米存放在高腳倉庫。"),
  Q("弥生時代に、収穫した米をたくわえるためにつくられた建物は？|What Yayoi building stored harvested rice?|彌生時代為儲存收穫稻米而建的建築是？","高床倉庫|Raised-floor storehouse|高腳倉庫",
    [["竪穴住居|Pit dwelling|豎穴式住居","竪穴住居は人がくらす家です。|It's a home.|豎穴式住居是人居住的房子。"],["寝殿造|Shinden style|寢殿造","寝殿造は平安時代の貴族の住まいです。|Heian aristocrats' mansions.|寢殿造是平安時代貴族的住宅。"],["古墳|Burial mound|古墳","古墳は王や豪族の墓です。|A kofun is a tomb.|古墳是王或豪族的墳墓。"]],
    "床を高くして、湿気やネズミから米を守った。|The raised floor kept rice safe from damp and rats.|墊高地板以保護稻米免受潮濕和老鼠侵害。"),
  Q("佐賀県にある、まわりを堀やさくで囲んだ弥生時代の大きなむらの遺跡は？|Which large Yayoi village in Saga was surrounded by moats and fences?|位於佐賀縣、周圍以壕溝和柵欄圍繞的彌生時代大型聚落遺跡是？","吉野ヶ里遺跡|Yoshinogari site|吉野里遺跡",
    [["三内丸山遺跡|Sannai-Maruyama site|三內丸山遺跡","三内丸山遺跡は青森県の縄文時代の遺跡です。|That's a Jomon site in Aomori.|三內丸山遺跡是青森縣的繩文時代遺跡。"],["登呂遺跡|Toro site|登呂遺跡","登呂遺跡は静岡県の、弥生時代の水田の跡です。|Toro is a Yayoi rice-field site in Shizuoka.|登呂遺跡是靜岡縣的彌生時代水田遺跡。"],["大森貝塚|Omori shell mound|大森貝塚","大森貝塚は東京都の縄文時代の貝塚です。|Omori is a Jomon shell mound.|大森貝塚是東京都的繩文時代貝塚。"]],
    "むらどうしの争いが起こるようになり、堀やさくで守りを固めた。|Villages fought, so they built moats and fences.|聚落之間開始發生爭鬥，因此以壕溝和柵欄加強防守。"),
  Q("57年、倭の奴国の王が中国の皇帝から金印を授けられたことが書かれている歴史書は？|Which Chinese history records the King of Na receiving a gold seal in 57?|記載西元57年倭奴國王獲中國皇帝贈金印的史書是？","『後漢書』東夷伝|Book of the Later Han|《後漢書》東夷傳",
    [["『漢書』地理志|Book of Han (Geography)|《漢書》地理志","『漢書』地理志には、倭が100あまりの国に分かれていたことが書かれています。|It says Wa had 100-plus states.|《漢書》地理志記載倭分為一百多國。"],["『魏志』倭人伝|Records of Wei|《魏志》倭人傳","『魏志』倭人伝には邪馬台国の卑弥呼のことが書かれています。|It describes Himiko of Yamatai.|《魏志》倭人傳記載邪馬台國的卑彌呼。"],["『日本書紀』|Nihon Shoki|《日本書紀》","『日本書紀』は奈良時代に日本でつくられた歴史書です。|Japan's own history, Nara period.|《日本書紀》是奈良時代日本編寫的史書。"]],
    "金印には「漢委奴国王」と刻まれ、江戸時代に福岡県の志賀島で見つかった。|The seal reads 'King of Na of Wa, vassal of Han' and was found on Shikanoshima, Fukuoka.|金印刻有「漢委奴國王」，江戶時代在福岡縣志賀島出土。"),
  Q("3世紀に邪馬台国を治め、魏に使いを送った女王は？|Which queen ruled Yamatai in the 3rd century and sent envoys to Wei?|3世紀統治邪馬台國、遣使至魏的女王是？","卑弥呼|Himiko|卑彌呼",
    [["推古天皇|Empress Suiko|推古天皇","推古天皇は飛鳥時代の女性の天皇です。|Suiko was an Asuka-period empress.|推古天皇是飛鳥時代的女天皇。"],["紫式部|Murasaki Shikibu|紫式部","紫式部は平安時代に『源氏物語』を書いた人物です。|She wrote The Tale of Genji.|紫式部是平安時代寫《源氏物語》的人。"],["北条政子|Hojo Masako|北條政子","北条政子は鎌倉時代、源頼朝の妻です。|She was Yoritomo's wife (Kamakura).|北條政子是鎌倉時代源賴朝的妻子。"]],
    "239年、卑弥呼は魏に使いを送り「親魏倭王」の称号と金印、銅鏡などを授かった。|In 239 she received the title \"King of Wa, Friend of Wei\", a gold seal and mirrors.|239年卑彌呼遣使至魏，獲「親魏倭王」稱號及金印、銅鏡等。"),
  Q("大阪府堺市の大仙（大山）古墳のような、円と四角を組み合わせた形の古墳は？|What is the keyhole shape of tombs like Daisen Kofun in Sakai called?|像大阪府堺市大仙古墳那樣，結合圓形與方形的古墳是？","前方後円墳|Keyhole-shaped tomb|前方後圓墳",
    [["円墳|Round tomb|圓墳","円墳は円い形の古墳です。|A round tomb.|圓墳是圓形的古墳。"],["方墳|Square tomb|方墳","方墳は四角い形の古墳です。|A square tomb.|方墳是方形的古墳。"],["貝塚|Shell mound|貝塚","貝塚は縄文時代のごみ捨て場の跡です。|A shell mound is a Jomon trash heap.|貝塚是繩文時代丟棄垃圾的遺跡。"]],
    "大仙古墳は日本最大の前方後円墳。大和政権の大王の力の大きさを示す。|Daisen is Japan's largest, showing Yamato rulers' power.|大仙古墳是日本最大的前方後圓墳，顯示大和政權大王的強大勢力。"),
  Q("古墳の上やまわりにならべられた、素焼きの焼き物は？|What clay figures were set on and around kofun tombs?|排列在古墳上方及周圍的素燒陶器是？","はにわ（埴輪）|Haniwa|埴輪",
    [["土偶|Dogu|土偶","土偶は縄文時代につくられた土の人形です。|Dogu are Jomon.|土偶是繩文時代的泥人偶。"],["銅鐸|Dotaku|銅鐸","銅鐸は弥生時代の、祭りに使われたと考えられる青銅器です。|Dotaku are Yayoi bronze bells.|銅鐸是彌生時代被認為用於祭祀的青銅器。"],["須恵器|Sue ware|須惠器","須恵器は渡来人が伝えた、かたい土器です。|Sue ware is hard pottery from immigrants.|須惠器是渡來人傳入的堅硬陶器。"]],
    "はにわには、円筒形のほか、人・馬・家などの形がある。|Haniwa include cylinders, people, horses and houses.|埴輪除了圓筒形，還有人、馬、房屋等造型。"),
  Q("朝鮮半島などから日本に移り住み、漢字・儒教・須恵器の技術などを伝えた人々は？|Who moved to Japan from the Korean Peninsula and elsewhere, bringing kanji, Confucianism and Sue ware?|從朝鮮半島等地移居日本，傳入漢字、儒教、須惠器技術等的人是？","渡来人|Toraijin (immigrants)|渡來人",
    [["遣唐使|Envoys to Tang|遣唐使","遣唐使は日本から唐へ送った使節です。|They went from Japan to China.|遣唐使是日本派往唐朝的使節。"],["防人|Sakimori (border guards)|防人","防人は九州北部を守った兵士です。|They guarded northern Kyushu.|防人是守衛九州北部的士兵。"],["倭寇|Wako (pirates)|倭寇","倭寇は朝鮮や中国の沿岸をあらした海賊です。|They were pirates.|倭寇是侵擾朝鮮、中國沿岸的海盜。"]],
    "仏教も、6世紀に朝鮮半島の百済から正式に伝わった。|Buddhism officially came from Baekje in the 6th century.|佛教也在6世紀從朝鮮半島的百濟正式傳入。"),
  Q("埼玉県の稲荷山古墳と熊本県の江田船山古墳で見つかった刀剣に、名前が刻まれていた大王は？|Which great king's name is carved on swords found in tombs in Saitama and Kumamoto?|在埼玉縣稻荷山古墳與熊本縣江田船山古墳出土的刀劍上，刻有名字的大王是？","ワカタケル大王|Great King Wakatakeru|獲加多支鹵大王",
    [["卑弥呼|Himiko|卑彌呼","卑弥呼は3世紀の邪馬台国の女王です。|Himiko was a 3rd-century queen.|卑彌呼是3世紀邪馬台國的女王。"],["聖徳太子|Prince Shotoku|聖德太子","聖徳太子は飛鳥時代の人物です。|Shotoku is Asuka period.|聖德太子是飛鳥時代的人物。"],["天智天皇|Emperor Tenji|天智天皇","天智天皇は大化の改新を進めた中大兄皇子です。|Tenji was Prince Naka no Oe.|天智天皇即推動大化革新的中大兄皇子。"]],
    "関東と九州の両方で名前が見つかったことから、大和政権の勢力が広い範囲におよんでいたとわかる。|Finds in both Kanto and Kyushu show Yamato's wide reach.|在關東與九州都發現其名，可知大和政權的勢力範圍很廣。"),
];
/* Part3 飛鳥時代 */
const h3=[ORD(Y_ANC.slice(2,10)),ORD(Y_ANC.slice(2,10)),
  Q("家がらにとらわれず、才能や功績のある人を役人に取り立てるための制度は？|Which system promoted officials by talent and merit, not family?|不拘家世、任用有才能與功績者為官的制度是？","冠位十二階|The Twelve Cap Ranks|冠位十二階",
    [["十七条の憲法|Seventeen-Article Constitution|十七條憲法","十七条の憲法は、役人の心構えを示したものです。|It set out officials' attitudes.|十七條憲法揭示官員應有的態度。"],["班田収授法|Handen system|班田收授法","班田収授法は人々に口分田をあたえる制度です。|It gave rice land to people.|班田收授法是分配口分田給人民的制度。"],["御成敗式目|Goseibai Shikimoku|御成敗式目","御成敗式目は鎌倉時代の武士の法律です。|A Kamakura samurai code.|御成敗式目是鎌倉時代的武士法律。"]],
    "冠位十二階（603年）・十七条の憲法（604年）は聖徳太子が定めた。|Both were set by Prince Shotoku (603, 604).|冠位十二階（603年）、十七條憲法（604年）都由聖德太子制定。"),
  Q("仏教や儒教の考えを取り入れ、役人の心構えを示したものは？|What set out officials' attitudes, drawing on Buddhism and Confucianism?|融入佛教、儒教思想，揭示官員應有態度的是？","十七条の憲法|Seventeen-Article Constitution|十七條憲法",
    [["冠位十二階|Twelve Cap Ranks|冠位十二階","冠位十二階は役人を才能で取り立てる制度です。|It's about promoting by talent.|冠位十二階是依才能任用官員的制度。"],["大宝律令|Taiho Code|大寶律令","大宝律令は701年の、唐にならった法律です。|A 701 legal code modeled on Tang.|大寶律令是701年仿效唐朝的法律。"],["墾田永年私財法|Konden Einen Shizai Law|墾田永年私財法","墾田永年私財法は開墾した土地の私有を認めた法律です。|It allowed private land.|墾田永年私財法是承認開墾土地私有的法律。"]],
    "「和をもって貴しとなし」「あつく三宝（仏・法・僧）を敬え」などと記した。|It says \"Harmony is to be valued\" and \"Revere the Three Treasures\".|寫有「以和為貴」「篤敬三寶（佛、法、僧）」等。"),
  Q("607年に遣隋使として中国へ送られた人物は？|Who was sent to China as envoy to Sui in 607?|607年以遣隋使身分被派往中國的人是？","小野妹子|Ono no Imoko|小野妹子",
    [["中臣鎌足|Nakatomi no Kamatari|中臣鎌足","中臣鎌足は中大兄皇子と大化の改新を進めた人物です。|He led the Taika Reform with Naka no Oe.|中臣鎌足是與中大兄皇子推動大化革新的人。"],["鑑真|Ganjin (Jianzhen)|鑑真","鑑真は奈良時代に唐から来日した僧です。|Ganjin came from Tang in the Nara period.|鑑真是奈良時代從唐朝來日的僧人。"],["菅原道真|Sugawara no Michizane|菅原道真","菅原道真は894年に遣唐使の停止を提案した人物です。|He proposed stopping envoys in 894.|菅原道真是894年提議停派遣唐使的人。"]],
    "遣隋使は、隋の進んだ制度や文化を学ぶため。留学生や僧も同行した。|To learn Sui China's systems and culture; students and monks went too.|遣隋使是為了學習隋朝先進的制度與文化，留學生與僧侶也隨行。"),
  Q("聖徳太子が建てたとされ、現存する世界最古の木造建築は？|Which temple, said to be built by Prince Shotoku, is the world's oldest surviving wooden building?|相傳由聖德太子建造、現存世界最古老的木造建築是？","法隆寺|Horyuji|法隆寺",
    [["東大寺|Todaiji|東大寺","東大寺は奈良時代に聖武天皇が建て、大仏があります。|Todaiji (Nara period) has the Great Buddha.|東大寺是奈良時代聖武天皇所建，有大佛。"],["平等院鳳凰堂|Byodoin Phoenix Hall|平等院鳳凰堂","平等院鳳凰堂は平安時代に藤原頼通が建てました。|Built by Fujiwara no Yorimichi (Heian).|平等院鳳凰堂是平安時代藤原賴通所建。"],["唐招提寺|Toshodaiji|唐招提寺","唐招提寺は奈良時代に鑑真が開いた寺です。|Founded by Ganjin (Nara period).|唐招提寺是奈良時代鑑真開創的寺院。"]],
    "法隆寺など、日本で最初の仏教文化を飛鳥文化という。|Japan's first Buddhist culture is called Asuka culture.|法隆寺等日本最早的佛教文化稱為飛鳥文化。"),
  Q("645年、中大兄皇子と中臣鎌足が蘇我氏をたおして始めた政治の改革は？|What reform began in 645 when Naka no Oe and Nakatomi no Kamatari overthrew the Soga?|645年中大兄皇子與中臣鎌足推翻蘇我氏後展開的政治改革是？","大化の改新|The Taika Reform|大化革新",
    [["壬申の乱|The Jinshin War|壬申之亂","壬申の乱は672年の、天皇の後つぎをめぐる争いです。|A 672 succession war.|壬申之亂是672年的天皇繼承之爭。"],["承久の乱|The Jokyu War|承久之亂","承久の乱は1221年に後鳥羽上皇が起こした戦いです。|Emperor Go-Toba's 1221 revolt.|承久之亂是1221年後鳥羽上皇發動的戰爭。"],["建武の新政|Kenmu Restoration|建武新政","建武の新政は1334年に後醍醐天皇が始めた政治です。|Go-Daigo's 1334 rule.|建武新政是1334年後醍醐天皇開始的政治。"]],
    "大化の改新では、土地と人々を国のもの（公地公民）とする方針を示した。|It made land and people public (state-owned).|大化革新提出土地與人民歸國家所有（公地公民）的方針。"),
  Q("大化の改新で示された、土地と人々を国が直接支配する方針は？|Under the Taika Reform, the policy that land and people belong to the state was…|大化革新提出、由國家直接支配土地與人民的方針是？","公地公民|Public land and public people|公地公民",
    [["墾田永年私財法|Konden Einen Shizai Law|墾田永年私財法","墾田永年私財法は、開墾した土地の私有を認めた奈良時代の法律です。|It allowed private ownership (Nara).|墾田永年私財法是承認開墾土地私有的奈良時代法律。"],["御恩と奉公|Favor and service|御恩與奉公","御恩と奉公は鎌倉幕府の将軍と御家人の関係です。|It's the shogun–vassal bond (Kamakura).|御恩與奉公是鎌倉幕府將軍與御家人的關係。"],["下剋上|Gekokujo|下剋上","下剋上は室町時代の、下の者が上の者をたおす風潮です。|It's the Muromachi trend of overthrowing superiors.|下剋上是室町時代以下犯上的風潮。"]],
    "それまで豪族が支配していた土地と人々を、国家が直接支配することにした。|Land and people once held by clans came under the state.|原本由豪族支配的土地與人民，改由國家直接支配。"),
  Q("663年、百済を助けるため送った日本の軍が、唐と新羅の連合軍に敗れた戦いは？|In 663, Japan's army helping Baekje lost to Tang and Silla in which battle?|663年日本為援助百濟出兵，敗給唐與新羅聯軍的戰役是？","白村江の戦い|Battle of Baekgang|白村江之戰",
    [["壇ノ浦の戦い|Battle of Dan-no-ura|壇之浦之戰","壇ノ浦の戦いは1185年に源氏が平氏をほろぼした戦いです。|In 1185 the Minamoto destroyed the Taira.|壇之浦之戰是1185年源氏消滅平氏的戰役。"],["壬申の乱|The Jinshin War|壬申之亂","壬申の乱は672年の国内の争いです。|A 672 civil war.|壬申之亂是672年的國內爭鬥。"],["応仁の乱|The Onin War|應仁之亂","応仁の乱は1467年に始まった室町時代の戦乱です。|A Muromachi war from 1467.|應仁之亂是1467年開始的室町時代戰亂。"]],
    "敗戦後、唐や新羅の攻撃に備え、九州に大宰府を置き、山城や水城を築き、防人を送った。|Afterward Japan built defenses in Kyushu and sent sakimori guards.|戰敗後為防備唐與新羅進攻，在九州設大宰府、築山城與水城，並派遣防人。"),
  Q("672年の壬申の乱に勝って即位した天皇は？|Who won the Jinshin War of 672 and became emperor?|贏得672年壬申之亂而即位的天皇是？","天武天皇|Emperor Tenmu|天武天皇",
    [["天智天皇|Emperor Tenji|天智天皇","天智天皇は中大兄皇子が即位した天皇で、その死後に壬申の乱が起こりました。|Tenji (Naka no Oe); the war came after his death.|天智天皇即中大兄皇子，其死後發生壬申之亂。"],["聖武天皇|Emperor Shomu|聖武天皇","聖武天皇は奈良時代の天皇です。|Shomu is Nara period.|聖武天皇是奈良時代的天皇。"],["桓武天皇|Emperor Kanmu|桓武天皇","桓武天皇は794年に平安京に都を移した天皇です。|Kanmu moved the capital in 794.|桓武天皇是794年遷都平安京的天皇。"]],
    "天武天皇（大海人皇子）は天皇中心の国づくりを進め、のちの大宝律令につながった。|Tenmu strengthened imperial rule, leading to the Taiho Code.|天武天皇（大海人皇子）推動以天皇為中心的國家建設，促成日後的大寶律令。"),
  Q("701年、唐の律令にならってつくられた法律は？|What law code, modeled on Tang China, was made in 701?|701年仿效唐朝律令制定的法律是？","大宝律令|Taiho Code|大寶律令",
    [["十七条の憲法|Seventeen-Article Constitution|十七條憲法","十七条の憲法は604年に聖徳太子が定めました。|Shotoku's 604 rules.|十七條憲法是604年聖德太子制定的。"],["御成敗式目|Goseibai Shikimoku|御成敗式目","御成敗式目は1232年の武士の法律です。|A 1232 samurai code.|御成敗式目是1232年的武士法律。"],["分国法|Bunkokuho|分國法","分国法は戦国大名が定めたきまりです。|Rules of Sengoku daimyo.|分國法是戰國大名制定的規定。"]],
    "律は刑罰のきまり、令は政治のしくみのきまり。|Ritsu = penal law; ryo = administrative law.|律是刑罰的規定，令是政治制度的規定。"),
];
/* Part4 奈良時代 */
const TAX=[["租|So|租","稲（収穫の約3%）を納める|Pay rice (about 3% of the harvest)|繳納稻米（收穫的約3%）"],["調|Cho|調","地方の特産物を納める|Pay local products|繳納地方特產"],["庸|Yo|庸","労役の代わりに布を納める|Pay cloth instead of labor in the capital|以布代替勞役"],
  ["雑徭|Zoyo|雜徭","国司のもとで土木工事などで働く|Labor on local works under the governor|在國司之下從事土木等勞動"],["防人|Sakimori|防人","九州北部の守りにつく兵役|Military service guarding northern Kyushu|守衛九州北部的兵役"]];
const h4=[ORD(Y_ANC.slice(9,14)),...TB(TAX,"奈良時代の人々の負担で、「{a}」の内容は？|In the Nara period, what was the burden called {a}?|奈良時代人民的負擔中，「{a}」的內容是？","奈良時代の人々の負担で、「{b}」ことを何という？|In the Nara period, the burden \"{b}\" was called…|奈良時代人民的負擔中，「{b}」叫做？","{a}：{b}。|{a}: {b}.|{a}：{b}。"),
  Q("710年、唐の都・長安にならってつくられた都は？|Which capital, built in 710, was modeled on Chang'an?|710年仿效唐都長安建造的都城是？","平城京|Heijo-kyo|平城京",
    [["平安京|Heian-kyo|平安京","平安京は794年に京都につくられた都です。|Heian-kyo (Kyoto), 794.|平安京是794年建於京都的都城。"],["藤原京|Fujiwara-kyo|藤原京","藤原京は平城京の前の都です。|The capital before Heijo-kyo.|藤原京是平城京之前的都城。"],["大宰府|Dazaifu|大宰府","大宰府は九州に置かれた役所で、都ではありません。|An office in Kyushu, not a capital.|大宰府是設在九州的官署，不是都城。"]],
    "平城京（奈良）に都があった約80年間を奈良時代という。|The ~80 years with the capital at Heijo-kyo are the Nara period.|都城位於平城京（奈良）的約80年稱為奈良時代。"),
  Q("6歳以上のすべての男女に口分田をあたえ、死ぬと国に返させた制度は？|Which system gave rice land to everyone 6 and older, returned at death?|分配口分田給6歲以上所有男女、死後歸還國家的制度是？","班田収授法|Handen Shuju system|班田收授法",
    [["墾田永年私財法|Konden Einen Shizai Law|墾田永年私財法","墾田永年私財法は、開墾した土地を永久に自分のものにできる法律です。|It allowed permanent private land.|墾田永年私財法是允許開墾土地永久私有的法律。"],["冠位十二階|Twelve Cap Ranks|冠位十二階","冠位十二階は役人の位を決める制度です。|It ranked officials.|冠位十二階是決定官員位階的制度。"],["御成敗式目|Goseibai Shikimoku|御成敗式目","御成敗式目は鎌倉時代の法律です。|A Kamakura code.|御成敗式目是鎌倉時代的法律。"]],
    "人口がふえ、口分田が足りなくなったため、743年に墾田永年私財法が出された。|Population grew and land ran short → the 743 law.|人口增加導致口分田不足，因此在743年頒布墾田永年私財法。"),
  Q("743年に出された、新しく開墾した土地の永久の私有を認めた法律は？|Which 743 law allowed permanent private ownership of newly cleared land?|743年頒布、承認新開墾土地可永久私有的法律是？","墾田永年私財法|Konden Einen Shizai Law|墾田永年私財法",
    [["班田収授法|Handen Shuju system|班田收授法","班田収授法は口分田をあたえて、死ぬと返させる制度です。|It gave land returned at death.|班田收授法是分配口分田、死後歸還的制度。"],["大宝律令|Taiho Code|大寶律令","大宝律令は701年の法律です。|The 701 code.|大寶律令是701年的法律。"],["徳政令|Tokuseirei|德政令","徳政令は借金を帳消しにする法令（鎌倉・室町時代）です。|Debt cancellation (Kamakura/Muromachi).|德政令是取消債務的法令（鎌倉、室町時代）。"]],
    "貴族や寺社が開墾を進めて私有地を広げ、のちの荘園のもとになった。|Nobles and temples expanded private land → later estates (shoen).|貴族與寺社積極開墾、擴大私有地，成為日後莊園的起源。"),
  Q("仏教の力で国を守ろうと、国ごとに国分寺・国分尼寺を、都に東大寺を建てた天皇は？|Which emperor built provincial temples and Todaiji to protect the country through Buddhism?|想藉佛教力量守護國家，在各國建國分寺、國分尼寺，在京城建東大寺的天皇是？","聖武天皇|Emperor Shomu|聖武天皇",
    [["桓武天皇|Emperor Kanmu|桓武天皇","桓武天皇は平安京に都を移した天皇です。|Kanmu moved the capital to Heian-kyo.|桓武天皇是遷都平安京的天皇。"],["天武天皇|Emperor Tenmu|天武天皇","天武天皇は壬申の乱に勝った飛鳥時代の天皇です。|Tenmu is Asuka period.|天武天皇是贏得壬申之亂的飛鳥時代天皇。"],["後醍醐天皇|Emperor Go-Daigo|後醍醐天皇","後醍醐天皇は建武の新政を行った天皇です。|Go-Daigo led the Kenmu Restoration.|後醍醐天皇是推行建武新政的天皇。"]],
    "聖武天皇のころ、伝染病やききんが広がり、社会が不安定だった。|Epidemics and famine made society unstable then.|聖武天皇時期，傳染病與饑荒蔓延，社會動盪不安。"),
  Q("民衆に仏教を広め、東大寺の大仏づくりに協力した僧は？|Which monk spread Buddhism among the people and helped build the Great Buddha?|向民眾傳布佛教、協助建造東大寺大佛的僧人是？","行基|Gyoki|行基",
    [["鑑真|Ganjin|鑑真","鑑真は唐から来日し、正しい仏教の教えを伝えた僧です。|Ganjin came from Tang to teach Buddhist rules.|鑑真是從唐朝來日、傳授正統佛法的僧人。"],["最澄|Saicho|最澄","最澄は平安時代に天台宗を開いた僧です。|Saicho founded Tendai (Heian).|最澄是平安時代開創天台宗的僧人。"],["空海|Kukai|空海","空海は平安時代に真言宗を開いた僧です。|Kukai founded Shingon (Heian).|空海是平安時代開創真言宗的僧人。"]],
    "行基は橋や池などをつくる社会事業も行い、民衆にしたわれた。|Gyoki also built bridges and ponds and was loved by the people.|行基也從事造橋、修池等社會事業，深受民眾愛戴。"),
  Q("何度も航海に失敗しながら唐から来日し、唐招提寺を開いた僧は？|Which monk came from Tang after many failed voyages and founded Toshodaiji?|經歷多次航海失敗後從唐朝來日、開創唐招提寺的僧人是？","鑑真|Ganjin (Jianzhen)|鑑真",
    [["行基|Gyoki|行基","行基は日本の僧で、大仏づくりに協力しました。|A Japanese monk who helped build the Buddha.|行基是日本僧人，協助建造大佛。"],["空海|Kukai|空海","空海は遣唐使とともに唐へ行き、帰国して真言宗を開きました。|Kukai went to Tang and founded Shingon.|空海隨遣唐使赴唐，回國後開創真言宗。"],["栄西|Eisai|榮西","栄西は鎌倉時代に宋から臨済宗を伝えました。|Eisai brought Rinzai Zen from Song (Kamakura).|榮西於鎌倉時代從宋朝傳入臨濟宗。"]],
    "鑑真は来日までに視力を失ったといわれる。|Ganjin is said to have lost his sight before arriving.|相傳鑑真來日前已失明。"),
  Q("聖武天皇の遺品などがおさめられ、西アジアやインドから伝わった品もある東大寺の倉は？|Which Todaiji storehouse holds Emperor Shomu's belongings, including items from West Asia and India?|收藏聖武天皇遺物，也有來自西亞、印度物品的東大寺倉庫是？","正倉院|Shosoin|正倉院",
    [["法隆寺|Horyuji|法隆寺","法隆寺は飛鳥時代の寺です。|Horyuji is an Asuka temple.|法隆寺是飛鳥時代的寺院。"],["平等院鳳凰堂|Byodoin Phoenix Hall|平等院鳳凰堂","平等院鳳凰堂は平安時代の阿弥陀堂です。|A Heian Amida hall.|平等院鳳凰堂是平安時代的阿彌陀堂。"],["中尊寺金色堂|Chusonji Golden Hall|中尊寺金色堂","中尊寺金色堂は平安時代に奥州藤原氏が建てました。|Built by the Northern Fujiwara (Heian).|中尊寺金色堂是平安時代奧州藤原氏所建。"]],
    "正倉院の宝物から、シルクロードを通じて伝わった国際色豊かな天平文化がわかる。|Shosoin treasures show the cosmopolitan Tenpyo culture via the Silk Road.|從正倉院的寶物可看出經由絲路傳來、充滿國際色彩的天平文化。"),
  Q("奈良時代にまとめられた、日本の神話や国のおこりを記した歴史書は？|Which histories of Japan's myths and origins were compiled in the Nara period?|奈良時代編纂、記載日本神話與建國起源的史書是？","『古事記』『日本書紀』|Kojiki and Nihon Shoki|《古事記》《日本書紀》",
    [["『万葉集』『古今和歌集』|Man'yoshu and Kokinshu|《萬葉集》《古今和歌集》","どちらも和歌集で、『古今和歌集』は平安時代です。|Both are poetry; Kokinshu is Heian.|兩者都是和歌集，《古今和歌集》是平安時代。"],["『源氏物語』『枕草子』|The Tale of Genji and The Pillow Book|《源氏物語》《枕草子》","どちらも平安時代の文学です。|Both are Heian literature.|兩者都是平安時代的文學。"],["『徒然草』『方丈記』|Tsurezuregusa and Hojoki|《徒然草》《方丈記》","どちらも鎌倉時代の随筆です。|Both are Kamakura essays.|兩者都是鎌倉時代的隨筆。"]],
    "『古事記』（712年）・『日本書紀』（720年）。国ごとの地理や伝説は『風土記』にまとめられた。|Kojiki (712), Nihon Shoki (720); local geography and legends went into the Fudoki.|《古事記》（712年）、《日本書紀》（720年）；各國的地理與傳說彙整於《風土記》。"),
  Q("天皇から防人・農民まで、さまざまな人の和歌約4500首を集めた歌集は？|Which anthology gathers about 4,500 poems by people from emperors to border guards and farmers?|收錄從天皇到防人、農民等各種人約4500首和歌的歌集是？","『万葉集』|Man'yoshu|《萬葉集》",
    [["『古今和歌集』|Kokin Wakashu|《古今和歌集》","『古今和歌集』は平安時代に紀貫之らがまとめた歌集です。|Compiled by Ki no Tsurayuki and others (Heian).|《古今和歌集》是平安時代紀貫之等人編纂的歌集。"],["『新古今和歌集』|Shin Kokin Wakashu|《新古今和歌集》","『新古今和歌集』は鎌倉時代の歌集です。|A Kamakura anthology.|《新古今和歌集》是鎌倉時代的歌集。"],["『風土記』|Fudoki|《風土記》","『風土記』は国ごとの地理・産物・伝説などの記録です。|Records of local geography and legends.|《風土記》是各國地理、物產、傳說等的紀錄。"]],
    "『万葉集』は大伴家持がまとめたとされる。万葉がなで書かれている。|Thought to be compiled by Otomo no Yakamochi; written in man'yogana.|《萬葉集》相傳由大伴家持編纂，以萬葉假名書寫。"),
  Q("唐の制度や文化を学ぶため、奈良時代などに送られた使節は？|What envoys were sent to learn Tang China's systems and culture?|為了學習唐朝制度與文化而派遣的使節是？","遣唐使|Envoys to Tang|遣唐使",
    [["遣隋使|Envoys to Sui|遣隋使","遣隋使は唐の前の王朝・隋に送った使節です。|They went to Sui, before Tang.|遣隋使是派往唐朝前一個王朝隋的使節。"],["渡来人|Toraijin|渡來人","渡来人は大陸から日本に移り住んだ人々です。|They moved to Japan.|渡來人是從大陸移居日本的人。"],["防人|Sakimori|防人","防人は九州北部を守った兵士です。|Border guards.|防人是守衛九州北部的士兵。"]],
    "遣唐使は894年、菅原道真の提案で停止された。|Envoys to Tang were stopped in 894 at Michizane's suggestion.|遣唐使於894年依菅原道真的提議而停派。"),
];
/* Part5 平安時代 */
const h5=[ORD(Y_ANC.slice(13)),
  Q("794年、桓武天皇が都を移した場所は？|Where did Emperor Kanmu move the capital in 794?|794年桓武天皇遷都的地方是？","平安京（京都）|Heian-kyo (Kyoto)|平安京（京都）",
    [["平城京（奈良）|Heijo-kyo (Nara)|平城京（奈良）","平城京は710年に移した都です。|Heijo-kyo was 710.|平城京是710年遷入的都城。"],["鎌倉|Kamakura|鎌倉","鎌倉は源頼朝が幕府を置いた所です。|Kamakura was Yoritomo's base.|鎌倉是源賴朝設立幕府的地方。"],["藤原京|Fujiwara-kyo|藤原京","藤原京は平城京より前の都です。|It came before Heijo-kyo.|藤原京是平城京之前的都城。"]],
    "桓武天皇は、仏教勢力の強い奈良をはなれ、政治を立て直そうとした。|Kanmu left Nara, where Buddhist temples had grown too powerful.|桓武天皇想遠離佛教勢力強大的奈良，重整政治。"),
  Q("征夷大将軍として、東北地方の蝦夷を従わせた人物は？|Who, as seii taishogun, subdued the Emishi of northeastern Japan?|以征夷大將軍身分征服東北地方蝦夷的人是？","坂上田村麻呂|Sakanoue no Tamuramaro|坂上田村麻呂",
    [["源頼朝|Minamoto no Yoritomo|源賴朝","源頼朝は1192年に征夷大将軍となり、鎌倉幕府を開いた人物です。|Yoritomo became shogun in 1192 (Kamakura).|源賴朝於1192年成為征夷大將軍，開創鎌倉幕府。"],["足利尊氏|Ashikaga Takauji|足利尊氏","足利尊氏は1338年に征夷大将軍となり、室町幕府を開きました。|Takauji became shogun in 1338 (Muromachi).|足利尊氏於1338年成為征夷大將軍，開創室町幕府。"],["平清盛|Taira no Kiyomori|平清盛","平清盛は太政大臣になった武士です。|Kiyomori became chancellor.|平清盛是成為太政大臣的武士。"]],
    "坂上田村麻呂は、蝦夷の指導者アテルイを降伏させた。|He made the Emishi leader Aterui surrender.|坂上田村麻呂迫使蝦夷首領阿弖流為投降。"),
  Q("唐から帰国し、比叡山に延暦寺を建てて天台宗を広めた僧は？|Which monk, back from Tang, founded Enryakuji on Mt. Hiei and spread Tendai?|從唐朝回國、在比叡山建延曆寺、傳布天台宗的僧人是？","最澄|Saicho|最澄",
    [["空海|Kukai|空海","空海は高野山に金剛峯寺を建て、真言宗を開きました。|Kukai: Kongobuji, Mt. Koya, Shingon.|空海在高野山建金剛峯寺，開創真言宗。"],["法然|Honen|法然","法然は鎌倉時代に浄土宗を開きました。|Honen founded Jodo (Kamakura).|法然於鎌倉時代開創淨土宗。"],["鑑真|Ganjin|鑑真","鑑真は奈良時代に唐招提寺を開きました。|Ganjin founded Toshodaiji (Nara).|鑑真於奈良時代開創唐招提寺。"]],
    "最澄（天台宗・比叡山延暦寺）、空海（真言宗・高野山金剛峯寺）。山の中で修行する仏教。|Saicho (Tendai, Mt. Hiei) and Kukai (Shingon, Mt. Koya): mountain-based Buddhism.|最澄（天台宗、比叡山延曆寺）、空海（真言宗、高野山金剛峯寺）：在山中修行的佛教。"),
  Q("高野山に金剛峯寺を建て、真言宗を広めた僧は？|Which monk founded Kongobuji on Mt. Koya and spread Shingon?|在高野山建金剛峯寺、傳布真言宗的僧人是？","空海|Kukai|空海",
    [["最澄|Saicho|最澄","最澄は比叡山に延暦寺を建て、天台宗を開きました。|Saicho: Enryakuji, Tendai.|最澄在比叡山建延曆寺，開創天台宗。"],["親鸞|Shinran|親鸞","親鸞は鎌倉時代に浄土真宗を開きました。|Shinran: Jodo Shinshu (Kamakura).|親鸞於鎌倉時代開創淨土真宗。"],["行基|Gyoki|行基","行基は奈良時代に大仏づくりに協力した僧です。|Gyoki helped build the Buddha (Nara).|行基是奈良時代協助建造大佛的僧人。"]],
    "空海は書の名人としても知られる。|Kukai was also a master calligrapher.|空海也以書法名家聞名。"),
  Q("894年、遣唐使の停止を提案した人物は？|Who proposed stopping the envoys to Tang in 894?|894年提議停派遣唐使的人是？","菅原道真|Sugawara no Michizane|菅原道真",
    [["藤原道長|Fujiwara no Michinaga|藤原道長","藤原道長は摂関政治の全盛期を築いた人物です。|Michinaga led the regency at its peak.|藤原道長是開創攝關政治全盛期的人。"],["小野妹子|Ono no Imoko|小野妹子","小野妹子は607年の遣隋使です。|Imoko went to Sui in 607.|小野妹子是607年的遣隋使。"],["紀貫之|Ki no Tsurayuki|紀貫之","紀貫之は『古今和歌集』をまとめた歌人です。|Tsurayuki compiled the Kokinshu.|紀貫之是編纂《古今和歌集》的歌人。"]],
    "唐がおとろえ、航海も危険だったため。のちに日本の風土に合った国風文化が栄えた。|Tang was declining and voyages were risky; then Japanese-style culture flourished.|因唐朝衰落、航海危險；之後符合日本風土的國風文化興盛。"),
  Q("藤原氏が、娘を天皇のきさきにし、生まれた子を天皇に立てて、摂政・関白として行った政治は？|What was the Fujiwara rule as regents, by marrying daughters to emperors?|藤原氏讓女兒成為天皇后妃，立其所生之子為天皇，並以攝政、關白身分主政的政治是？","摂関政治|Regency government (sekkan)|攝關政治",
    [["院政|Cloister rule (insei)|院政","院政は、位をゆずった上皇が行う政治です。|Insei is rule by a retired emperor.|院政是讓位後的上皇主持的政治。"],["執権政治|Regent rule (shikken)|執權政治","執権政治は鎌倉幕府で北条氏が行った政治です。|Shikken rule was by the Hojo (Kamakura).|執權政治是鎌倉幕府中北條氏主持的政治。"],["建武の新政|Kenmu Restoration|建武新政","建武の新政は後醍醐天皇が行った政治です。|Go-Daigo's rule.|建武新政是後醍醐天皇推行的政治。"]],
    "摂政：天皇が幼いときに代わりに政治を行う。関白：成人した天皇を補佐する。|Sessho rules for a child emperor; kanpaku assists an adult emperor.|攝政：天皇年幼時代為執政；關白：輔佐成年天皇。"),
  Q("摂関政治の全盛期を築き、「この世をば わが世とぞ思ふ…」の歌をよんだ人物は？|Who led the regency at its peak and wrote the poem \"This world, I think, is my world…\"?|開創攝關政治全盛期，並詠出「此世即我世…」和歌的人是？","藤原道長|Fujiwara no Michinaga|藤原道長",
    [["藤原頼通|Fujiwara no Yorimichi|藤原賴通","藤原頼通は道長の子で、平等院鳳凰堂を建てました。|His son; built the Phoenix Hall.|藤原賴通是道長之子，建造平等院鳳凰堂。"],["中臣鎌足|Nakatomi no Kamatari|中臣鎌足","中臣鎌足は藤原氏の祖先で、飛鳥時代の人物です。|The Fujiwara ancestor (Asuka).|中臣鎌足是藤原氏的祖先，飛鳥時代人物。"],["平清盛|Taira no Kiyomori|平清盛","平清盛は武士で初めて太政大臣になりました。|The first samurai chancellor.|平清盛是第一位成為太政大臣的武士。"]],
    "11世紀前半、藤原道長・頼通の父子のころが摂関政治の全盛期。|The peak was under Michinaga and his son Yorimichi (early 11th c.).|11世紀前半，藤原道長、賴通父子時期是攝關政治的全盛期。"),
  Q("かな文字が広まった、日本の風土や生活に合った平安時代の文化は？|Which Heian culture, suited to Japanese life, spread kana writing?|假名普及、符合日本風土與生活的平安時代文化是？","国風文化|Kokufu (national) culture|國風文化",
    [["天平文化|Tenpyo culture|天平文化","天平文化は奈良時代の、唐の影響を強く受けた文化です。|Tenpyo (Nara) was strongly Tang-influenced.|天平文化是奈良時代深受唐朝影響的文化。"],["飛鳥文化|Asuka culture|飛鳥文化","飛鳥文化は日本で最初の仏教文化です。|Asuka was Japan's first Buddhist culture.|飛鳥文化是日本最早的佛教文化。"],["北山文化|Kitayama culture|北山文化","北山文化は室町時代、足利義満のころの文化です。|Kitayama is Muromachi (Yoshimitsu).|北山文化是室町時代足利義滿時期的文化。"]],
    "国風文化：かな文字・『源氏物語』・『枕草子』・『古今和歌集』・寝殿造・大和絵。|Kokufu: kana, Genji, Pillow Book, Kokinshu, shinden style, yamato-e.|國風文化：假名、《源氏物語》、《枕草子》、《古今和歌集》、寢殿造、大和繪。"),
  Q("『源氏物語』を書いた人物は？|Who wrote The Tale of Genji?|《源氏物語》的作者是？","紫式部|Murasaki Shikibu|紫式部",
    [["清少納言|Sei Shonagon|清少納言","清少納言は随筆『枕草子』を書きました。|She wrote The Pillow Book.|清少納言寫了隨筆《枕草子》。"],["紀貫之|Ki no Tsurayuki|紀貫之","紀貫之は『古今和歌集』をまとめ、『土佐日記』を書きました。|He compiled the Kokinshu and wrote the Tosa Diary.|紀貫之編纂《古今和歌集》，並寫了《土佐日記》。"],["兼好法師|Kenko|兼好法師","兼好法師は鎌倉時代の随筆『徒然草』を書きました。|He wrote Tsurezuregusa (Kamakura).|兼好法師寫了鎌倉時代的隨筆《徒然草》。"]],
    "紫式部と清少納言は、天皇のきさきに仕えた女性。|Both women served imperial consorts.|紫式部與清少納言都是侍奉天皇后妃的女性。"),
  Q("藤原頼通が建てた、阿弥陀仏をまつる阿弥陀堂は？|Which Amida hall did Fujiwara no Yorimichi build?|藤原賴通建造、供奉阿彌陀佛的阿彌陀堂是？","平等院鳳凰堂|Byodoin Phoenix Hall|平等院鳳凰堂",
    [["中尊寺金色堂|Chusonji Golden Hall|中尊寺金色堂","中尊寺金色堂は奥州藤原氏が平泉（岩手県）に建てた阿弥陀堂です。|Built by the Northern Fujiwara in Hiraizumi.|中尊寺金色堂是奧州藤原氏在平泉（岩手縣）建造的阿彌陀堂。"],["東大寺|Todaiji|東大寺","東大寺は奈良時代に聖武天皇が建てました。|Built by Shomu (Nara).|東大寺是奈良時代聖武天皇所建。"],["金閣|Kinkaku (Golden Pavilion)|金閣","金閣は室町時代に足利義満が建てました。|Built by Yoshimitsu (Muromachi).|金閣是室町時代足利義滿所建。"]],
    "念仏を唱えて阿弥陀仏にすがり、死後に極楽浄土へ生まれ変わることを願う浄土信仰が広まった。|Pure Land faith spread: chant to Amida to be reborn in paradise.|淨土信仰普及：唸佛號仰賴阿彌陀佛，祈求死後往生極樂淨土。"),
  Q("1086年、白河天皇が位をゆずって上皇となり、始めた政治は？|What rule did Shirakawa start in 1086 after stepping down as emperor?|1086年白河天皇讓位成為上皇後開始的政治是？","院政|Cloister rule (insei)|院政",
    [["摂関政治|Regency government|攝關政治","摂関政治は藤原氏が摂政・関白として行った政治です。|The Fujiwara regency.|攝關政治是藤原氏以攝政、關白身分主持的政治。"],["執権政治|Shikken rule|執權政治","執権政治は鎌倉幕府の北条氏の政治です。|The Hojo in Kamakura.|執權政治是鎌倉幕府北條氏的政治。"],["建武の新政|Kenmu Restoration|建武新政","建武の新政は1334年に後醍醐天皇が始めました。|Go-Daigo, 1334.|建武新政是1334年後醍醐天皇開始的。"]],
    "院政で、藤原氏の摂関政治はおとろえた。上皇は武士を重く用いた。|Insei weakened the Fujiwara; retired emperors relied on samurai.|院政使藤原氏的攝關政治衰退，上皇重用武士。"),
  Q("武士として初めて太政大臣になり、日宋貿易を進めた人物は？|Who was the first samurai to become chancellor and promoted trade with Song China?|第一位成為太政大臣的武士、推動日宋貿易的人是？","平清盛|Taira no Kiyomori|平清盛",
    [["源頼朝|Minamoto no Yoritomo|源賴朝","源頼朝は鎌倉幕府を開いた人物です。|Yoritomo founded the Kamakura shogunate.|源賴朝是開創鎌倉幕府的人。"],["藤原道長|Fujiwara no Michinaga|藤原道長","藤原道長は貴族で、摂関政治を行いました。|Michinaga was a court noble.|藤原道長是貴族，推行攝關政治。"],["足利義満|Ashikaga Yoshimitsu|足利義滿","足利義満は室町時代に日明貿易を始めました。|Yoshimitsu began trade with Ming.|足利義滿於室町時代開始日明貿易。"]],
    "平清盛は兵庫の港（大輪田泊）を整え、厳島神社（広島県）を厚く敬った。|He improved the port of Owada (Kobe) and honored Itsukushima Shrine.|平清盛整修兵庫港口（大輪田泊），並崇敬嚴島神社（廣島縣）。"),
  Q("平安時代の貴族の住まいの様式は？|What style were Heian aristocrats' homes?|平安時代貴族的住宅樣式是？","寝殿造|Shinden-zukuri|寢殿造",
    [["書院造|Shoin-zukuri|書院造","書院造は室町時代に広まった、たたみや床の間のある様式です。|Shoin style (tatami, alcove) is Muromachi.|書院造是室町時代普及、有榻榻米和床之間的樣式。"],["竪穴住居|Pit dwelling|豎穴式住居","竪穴住居は縄文・弥生時代の住まいです。|Jomon/Yayoi homes.|豎穴式住居是繩文、彌生時代的住所。"],["校倉造|Azekura style|校倉造","校倉造は正倉院などの倉の建て方です。|The log style of storehouses like Shosoin.|校倉造是正倉院等倉庫的建造方式。"]],
    "寝殿造：中央の寝殿と、池のある庭をもつ広い屋敷。|A main hall with a garden and pond.|寢殿造：有中央寢殿與附池庭園的寬廣宅邸。"),
];
/* ========== ⑤ 中世の日本（歴史的分野 B(2)） ========== */
/* 鎌倉幕府の始まりは「成立年」を問わず、できごとで出す（1185年 守護・地頭、1192年 征夷大将軍） */
const Y_MED=[["1185年|1185|1185年","守護・地頭を置く|Shugo and jito are appointed|設置守護、地頭","この年、壇ノ浦の戦いで平氏がほろびた。|The same year, the Taira fell at Dan-no-ura.|同年平氏於壇之浦之戰滅亡。"],
  ["1192年|1192|1192年","源頼朝が征夷大将軍になる|Minamoto no Yoritomo becomes shogun|源賴朝成為征夷大將軍","鎌倉に武士の政権（幕府）。|A samurai government at Kamakura.|在鎌倉建立武士政權（幕府）。"],
  ["1221年|1221|1221年","承久の乱|The Jokyu War|承久之亂","後鳥羽上皇が敗れ、京都に六波羅探題が置かれた。|Go-Toba lost; Rokuhara Tandai set up in Kyoto.|後鳥羽上皇戰敗，京都設置六波羅探題。"],
  ["1232年|1232|1232年","御成敗式目を定める|The Goseibai Shikimoku is issued|制定御成敗式目","執権北条泰時。武士の最初の法律。|By regent Hojo Yasutoki; the first samurai law code.|執權北條泰時制定，最早的武士法律。"],
  ["1274年|1274|1274年","文永の役（1度目の元寇）|Bun'ei campaign (1st Mongol invasion)|文永之役（第一次元日戰爭）","元の皇帝フビライ・ハン。執権は北条時宗。|Kublai Khan; regent Hojo Tokimune.|元朝皇帝忽必烈；執權為北條時宗。"],
  ["1281年|1281|1281年","弘安の役（2度目の元寇）|Koan campaign (2nd Mongol invasion)|弘安之役（第二次元日戰爭）","博多湾沿岸に石の防塁を築いて防いだ。|Stone walls along Hakata Bay held them off.|在博多灣沿岸築石壘防禦。"],
  ["1297年|1297|1297年","永仁の徳政令を出す|The Einin debt-relief order|頒布永仁德政令","生活の苦しい御家人を救うため、借金を帳消しに。|Cancelled debts of struggling vassals.|為救濟生活困苦的御家人而取消其債務。"],
  ["1333年|1333|1333年","鎌倉幕府がほろびる|The Kamakura shogunate falls|鎌倉幕府滅亡","後醍醐天皇の呼びかけに、足利尊氏・新田義貞らが応じた。|Takauji, Nitta Yoshisada and others answered Go-Daigo's call.|足利尊氏、新田義貞等響應後醍醐天皇的號召。"],
  ["1334年|1334|1334年","建武の新政が始まる|The Kenmu Restoration begins|建武新政開始","後醍醐天皇の天皇中心の政治。約2年でくずれた。|Go-Daigo's direct rule; collapsed in about 2 years.|後醍醐天皇以天皇為中心的政治，約2年即瓦解。"],
  ["1338年|1338|1338年","足利尊氏が征夷大将軍になる|Ashikaga Takauji becomes shogun|足利尊氏成為征夷大將軍","京都に室町幕府。|The Muromachi shogunate in Kyoto.|在京都建立室町幕府。"],
  ["1392年|1392|1392年","南北朝が統一される|North and South Courts reunite|南北朝統一","3代将軍足利義満。|By the 3rd shogun, Ashikaga Yoshimitsu.|由第三代將軍足利義滿完成。"],
  ["1404年|1404|1404年","日明貿易（勘合貿易）が始まる|Trade with Ming (kango trade) begins|日明貿易（勘合貿易）開始","足利義満。勘合で倭寇と区別した。|Yoshimitsu; tallies told official ships from pirates.|足利義滿；以勘合區分正式貿易船與倭寇。"],
  ["1428年|1428|1428年","正長の土一揆|The Shocho uprising|正長土一揆","近江の馬借をきっかけに、徳政を求めて土倉・酒屋をおそった。|Started by packhorse men in Omi; demanded debt relief.|以近江的馬借為開端，要求德政而襲擊土倉、酒屋。"],
  ["1429年|1429|1429年","琉球王国が成立する|The Ryukyu Kingdom is founded|琉球王國成立","尚氏が沖縄島を統一。中継貿易で栄えた。|The Sho family unified Okinawa; thrived on relay trade.|尚氏統一沖繩島，以轉口貿易繁榮。"],
  ["1467年|1467|1467年","応仁の乱が始まる|The Onin War begins|應仁之亂開始","8代将軍足利義政の後つぎ争いなど。京都が焼け野原に。|Over the 8th shogun Yoshimasa's heir; Kyoto burned.|起因於第八代將軍足利義政的繼承之爭等，京都化為焦土。"],
  ["1485年|1485|1485年","山城国一揆|The Yamashiro uprising|山城國一揆","武士と農民が守護大名を追い出し、8年間自治を行った。|Samurai and farmers expelled the daimyo and ruled for 8 years.|武士與農民驅逐守護大名，自治8年。"],
  ["1488年|1488|1488年","加賀の一向一揆|The Kaga Ikko uprising|加賀一向一揆","浄土真宗（一向宗）の信者が守護大名をたおし、約100年自治。|Jodo Shinshu believers overthrew the daimyo and ruled ~100 years.|淨土真宗（一向宗）信徒推翻守護大名，自治約100年。"]];
const SECT=[["天台宗|Tendai|天台宗","最澄|Saicho|最澄","平安時代。比叡山延暦寺。|Heian; Enryakuji on Mt. Hiei.|平安時代；比叡山延曆寺。"],["真言宗|Shingon|真言宗","空海|Kukai|空海","平安時代。高野山金剛峯寺。|Heian; Kongobuji on Mt. Koya.|平安時代；高野山金剛峯寺。"],
  ["浄土宗|Jodo (Pure Land)|淨土宗","法然|Honen|法然","念仏（南無阿弥陀仏）を唱えれば、だれでも極楽浄土に生まれ変われる。|Anyone chanting the nenbutsu can be reborn in the Pure Land.|只要唸佛（南無阿彌陀佛），任何人都能往生極樂淨土。"],
  ["浄土真宗（一向宗）|Jodo Shinshu (True Pure Land)|淨土真宗（一向宗）","親鸞|Shinran|親鸞","法然の弟子。阿弥陀仏を信じる心を重んじた。|Honen's disciple; stressed faith in Amida.|法然的弟子，重視信仰阿彌陀佛之心。"],
  ["時宗|Ji|時宗","一遍|Ippen|一遍","踊念仏で教えを広めた。|Spread through dancing nenbutsu.|以踊念佛傳布教義。"],
  ["日蓮宗（法華宗）|Nichiren (Lotus)|日蓮宗（法華宗）","日蓮|Nichiren|日蓮","題目（南無妙法蓮華経）を唱えれば救われる。|Chant the daimoku (Namu Myoho Renge Kyo).|唱誦題目（南無妙法蓮華經）即可得救。"],
  ["臨済宗|Rinzai Zen|臨濟宗","栄西|Eisai|榮西","座禅（禅宗）。宋から伝え、幕府が保護した。|Zen meditation from Song; protected by the shogunate.|坐禪（禪宗），從宋朝傳入，受幕府保護。"],
  ["曹洞宗|Soto Zen|曹洞宗","道元|Dogen|道元","ひたすら座禅に打ちこむ（禅宗）。|Just sit in meditation (Zen).|一心專注於坐禪（禪宗）。"]];
const SECTQ=["{a}を開いた人物は？|Who founded {a}?|開創{a}的人是？","{b}が開いた宗派は？|Which sect did {b} found?|{b}開創的宗派是？","{a}を開いたのは{b}。|{a} was founded by {b}.|{a}由{b}開創。"];
/* Part1 鎌倉幕府 */
const m1=[ORD(Y_MED.slice(0,4)),eraOrd(5,8),
  Q("1185年、源頼朝が国ごとに置いた、軍事・警察を行う役職は？|In 1185, which post did Yoritomo set up in each province for military and police duties?|1185年源賴朝在各國設置、負責軍事與警察的職務是？","守護|Shugo (military governor)|守護",
    [["地頭|Jito (steward)|地頭","地頭は荘園や公領ごとに置かれ、年貢の取り立てや土地の管理をしました。|Jito managed estates and collected taxes.|地頭設於各莊園與公領，負責徵收年貢、管理土地。"],["国司|Kokushi|國司","国司は律令制で都から各国に送られた役人です。|Kokushi were ritsuryo provincial officials.|國司是律令制下由京城派往各國的官員。"],["執権|Shikken (regent)|執權","執権は鎌倉幕府で将軍を補佐する役職です。|The shikken assisted the shogun.|執權是鎌倉幕府中輔佐將軍的職務。"]],
    "守護（国ごと・軍事と警察）、地頭（荘園・公領ごと・年貢と土地の管理）。|Shugo: per province, military/police. Jito: per estate, taxes/land.|守護（各國・軍事與警察）、地頭（各莊園與公領・年貢與土地管理）。"),
  Q("荘園や公領ごとに置かれ、年貢の取り立てや土地の管理を行った役職は？|Which post, set in each estate, collected taxes and managed land?|設於各莊園與公領，負責徵收年貢與管理土地的職務是？","地頭|Jito (steward)|地頭",
    [["守護|Shugo|守護","守護は国ごとに置かれ、軍事・警察を行いました。|Shugo handled military/police per province.|守護設於各國，負責軍事與警察。"],["管領|Kanrei|管領","管領は室町幕府で将軍を補佐した役職です。|Kanrei assisted Muromachi shoguns.|管領是室町幕府中輔佐將軍的職務。"],["防人|Sakimori|防人","防人は古代に九州北部を守った兵士です。|Ancient border guards.|防人是古代守衛九州北部的士兵。"]],
    "地頭には頼朝の家来（御家人）が任命された。|Yoritomo's vassals (gokenin) were made jito.|地頭由賴朝的家臣（御家人）擔任。"),
  Q("1192年に征夷大将軍に任じられた人物は？|Who was appointed seii taishogun in 1192?|1192年被任命為征夷大將軍的人是？","源頼朝|Minamoto no Yoritomo|源賴朝",
    [["源義経|Minamoto no Yoshitsune|源義經","源義経は頼朝の弟で、平氏をほろぼしたあと頼朝と対立しました。|Yoritomo's brother; he defeated the Taira, then fell out with Yoritomo.|源義經是賴朝之弟，消滅平氏後與賴朝對立。"],["坂上田村麻呂|Sakanoue no Tamuramaro|坂上田村麻呂","坂上田村麻呂は平安時代の初めに征夷大将軍になりました。|He was shogun in early Heian.|坂上田村麻呂於平安時代初期成為征夷大將軍。"],["足利尊氏|Ashikaga Takauji|足利尊氏","足利尊氏は1338年に征夷大将軍になりました。|Takauji, 1338.|足利尊氏於1338年成為征夷大將軍。"]],
    "源頼朝は鎌倉を本拠地とし、武士による政権（鎌倉幕府）を開いた。|Yoritomo based himself at Kamakura and set up a samurai government.|源賴朝以鎌倉為根據地，開創武士政權（鎌倉幕府）。"),
  Q("将軍が、御家人の領地を守ったり、新しい領地をあたえたりすることを何という？|What is it called when the shogun protects and grants land to his vassals?|將軍保護御家人的領地、或賜予新領地，叫做？","御恩|Goon (favor)|御恩",
    [["奉公|Hoko (service)|奉公","奉公は、御家人が将軍のために命がけで戦うことです。|Hoko is vassals fighting for the shogun.|奉公是御家人為將軍拚命作戰。"],["下剋上|Gekokujo|下剋上","下剋上は、下の者が上の者を実力でたおす風潮です。|Overthrowing superiors.|下剋上是下位者以實力推翻上位者的風潮。"],["公地公民|Public land and people|公地公民","公地公民は大化の改新の方針です。|A Taika Reform policy.|公地公民是大化革新的方針。"]],
    "御恩と奉公で結ばれた、土地を仲立ちとする主従関係（封建制度）。|Favor and service tied by land: the feudal system.|以土地為媒介、由御恩與奉公結合的主從關係（封建制度）。"),
  Q("御家人が、将軍のために命がけで戦うことを何という？|What is it called when vassals fight for the shogun at the risk of their lives?|御家人為將軍拚命作戰，叫做？","奉公|Hoko (service)|奉公",
    [["御恩|Goon (favor)|御恩","御恩は、将軍が御家人に領地をあたえたり守ったりすることです。|Goon is the shogun's land grants.|御恩是將軍賜予或保護御家人領地。"],["一揆|Ikki (uprising)|一揆","一揆は人々が団結して行動を起こすことです。|An ikki is a united uprising.|一揆是人們團結起來採取行動。"],["院政|Insei|院政","院政は上皇が行う政治です。|Rule by a retired emperor.|院政是上皇主持的政治。"]],
    "「いざ鎌倉」：事件が起きれば御家人は鎌倉へかけつけた。|\"To Kamakura!\": vassals rushed to Kamakura when trouble came.|「一旦有事，前往鎌倉」：發生事件時御家人就趕赴鎌倉。"),
  Q("鎌倉幕府で将軍を補佐する役職で、北条氏が代々ついたものは？|Which Kamakura post assisting the shogun was held by the Hojo family?|鎌倉幕府中輔佐將軍、由北條氏世襲的職務是？","執権|Shikken (regent)|執權",
    [["管領|Kanrei|管領","管領は室町幕府の将軍の補佐役です。|Kanrei is the Muromachi equivalent.|管領是室町幕府的將軍輔佐職。"],["摂政|Sessho|攝政","摂政は幼い天皇に代わって政治を行う朝廷の役職です。|A court post for child emperors.|攝政是代替年幼天皇執政的朝廷職務。"],["関白|Kanpaku|關白","関白は成人した天皇を補佐する朝廷の役職です。|A court post assisting adult emperors.|關白是輔佐成年天皇的朝廷職務。"]],
    "頼朝の死後、妻の北条政子の実家の北条氏が執権として実権をにぎった（執権政治）。|After Yoritomo died, his wife Masako's Hojo family took power as shikken.|賴朝死後，其妻北條政子的娘家北條氏以執權身分掌握實權（執權政治）。"),
  Q("1221年、朝廷の勢力を取りもどそうと兵を挙げ、幕府に敗れた上皇は？|Which retired emperor raised an army in 1221 to restore court power, and lost?|1221年為恢復朝廷勢力而起兵、敗給幕府的上皇是？","後鳥羽上皇|Retired Emperor Go-Toba|後鳥羽上皇",
    [["白河上皇|Retired Emperor Shirakawa|白河上皇","白河上皇は1086年に院政を始めました。|Shirakawa began insei in 1086.|白河上皇於1086年開始院政。"],["後醍醐天皇|Emperor Go-Daigo|後醍醐天皇","後醍醐天皇は1333年に鎌倉幕府をたおしました。|Go-Daigo ended Kamakura in 1333.|後醍醐天皇於1333年推翻鎌倉幕府。"],["桓武天皇|Emperor Kanmu|桓武天皇","桓武天皇は平安京に都を移しました。|Kanmu founded Heian-kyo.|桓武天皇遷都平安京。"]],
    "承久の乱のとき、北条政子が頼朝の御恩を説いて御家人をまとめた。乱の後、京都に六波羅探題を置いた。|Masako rallied the vassals; afterward the Rokuhara Tandai was set up in Kyoto.|承久之亂時，北條政子訴說賴朝的御恩以團結御家人；亂後在京都設六波羅探題。"),
  Q("承久の乱のあと、朝廷を監視するために京都に置かれた役所は？|After the Jokyu War, which office was set up in Kyoto to watch the court?|承久之亂後，為監視朝廷而設於京都的機構是？","六波羅探題|Rokuhara Tandai|六波羅探題",
    [["大宰府|Dazaifu|大宰府","大宰府は古代に九州に置かれた役所です。|An ancient office in Kyushu.|大宰府是古代設於九州的官署。"],["政所|Mandokoro|政所","政所は幕府の財政などを担当した役所です。|It handled shogunate finances.|政所是負責幕府財政等的機構。"],["侍所|Samurai-dokoro|侍所","侍所は御家人を統率した役所です。|It commanded the vassals.|侍所是統率御家人的機構。"]],
    "承久の乱で幕府の力は西日本にも広がった。|The shogunate's power spread into western Japan.|承久之亂後幕府勢力擴及西日本。"),
  Q("1232年、執権北条泰時が定めた、武士の最初の法律は？|What was the first samurai law, set by regent Hojo Yasutoki in 1232?|1232年執權北條泰時制定的最早的武士法律是？","御成敗式目（貞永式目）|Goseibai Shikimoku|御成敗式目（貞永式目）",
    [["大宝律令|Taiho Code|大寶律令","大宝律令は701年の、唐にならった法律です。|The 701 code.|大寶律令是701年仿效唐朝的法律。"],["十七条の憲法|Seventeen-Article Constitution|十七條憲法","十七条の憲法は聖徳太子が定めた役人の心構えです。|Shotoku's rules for officials.|十七條憲法是聖德太子制定的官員守則。"],["分国法|Bunkokuho|分國法","分国法は戦国大名が定めたきまりです。|Sengoku daimyo rules.|分國法是戰國大名制定的規定。"]],
    "御成敗式目：裁判の基準を示した。長く武士の法律の手本となった。|It set standards for trials and long served as a model of samurai law.|御成敗式目揭示審判標準，長期成為武士法律的典範。"),
  Q("鎌倉時代に西日本で広まった、同じ田畑で米と麦を交互につくる農業は？|What farming spread in western Japan in the Kamakura period, growing rice and wheat in turn on the same field?|鎌倉時代在西日本普及、同一田地輪流種稻和麥的農業是？","二毛作|Two-crop farming (nimosaku)|二毛作",
    [["二期作|Double cropping (rice twice)|二期作","二期作は同じ作物（米）を年2回つくることです。|Rice twice a year.|二期作是同一作物（稻米）一年種兩次。"],["焼畑農業|Slash-and-burn|游耕","焼畑農業は森林を焼いて行う農業です。|Burning forest for fields.|游耕是焚燒森林進行的農業。"],["混合農業|Mixed farming|混合農業","混合農業はヨーロッパなどの農業です。|European farming.|混合農業是歐洲等地的農業。"]],
    "牛や馬に犂を引かせたり、草木の灰を肥料にしたりして、生産が高まった。|Ox/horse plows and ash fertilizer raised output.|讓牛馬拉犁、以草木灰為肥料，提高了產量。"),
];
/* Part2 元寇と鎌倉時代の文化 */
const m2=[ORD(Y_MED.slice(2,8)),...TB(SECT.slice(2),...SECTQ),
  Q("日本に服属を求め、2度にわたって大軍を送った元の皇帝は？|Which Yuan emperor demanded Japan submit and sent armies twice?|要求日本臣服、兩度派遣大軍的元朝皇帝是？","フビライ・ハン|Kublai Khan|忽必烈",
    [["チンギス・ハン|Genghis Khan|成吉思汗","チンギス・ハンはモンゴル帝国を築いた、フビライの祖父です。|Kublai's grandfather, founder of the Mongol Empire.|成吉思汗是建立蒙古帝國的人，忽必烈的祖父。"],["始皇帝|The First Emperor of Qin|秦始皇","始皇帝は紀元前3世紀に中国を統一しました。|He unified China in the 3rd c. BCE.|秦始皇於西元前3世紀統一中國。"],["李成桂|Yi Seong-gye|李成桂","李成桂は1392年に朝鮮国を建てました。|He founded Joseon in 1392.|李成桂於1392年建立朝鮮。"]],
    "フビライ・ハンは都を大都（いまのペキン）に移し、国号を元とした。|Kublai moved the capital to Dadu (Beijing) and named the dynasty Yuan.|忽必烈遷都大都（今北京），國號為元。"),
  Q("元の要求をこばみ、元寇に立ち向かった鎌倉幕府の執権は？|Which Kamakura regent refused the Yuan's demands and faced the invasions?|拒絕元朝要求、對抗元軍來襲的鎌倉幕府執權是？","北条時宗|Hojo Tokimune|北條時宗",
    [["北条泰時|Hojo Yasutoki|北條泰時","北条泰時は1232年に御成敗式目を定めた執権です。|He issued the 1232 code.|北條泰時是1232年制定御成敗式目的執權。"],["北条政子|Hojo Masako|北條政子","北条政子は頼朝の妻で、承久の乱のとき御家人をまとめました。|Yoritomo's wife; rallied vassals in 1221.|北條政子是賴朝之妻，承久之亂時團結御家人。"],["足利義満|Ashikaga Yoshimitsu|足利義滿","足利義満は室町幕府の3代将軍です。|The 3rd Muromachi shogun.|足利義滿是室町幕府第三代將軍。"]],
    "元軍は集団戦法や「てつはう」という火薬の武器を使った。|The Yuan used group tactics and gunpowder bombs (teppo).|元軍使用集團戰術與名為「鐵炮」的火藥武器。"),
  Q("元寇のあと、御家人が幕府に不満をもった主な理由は？|After the Mongol invasions, why were vassals unhappy with the shogunate?|元日戰爭後，御家人對幕府不滿的主要原因是？","戦っても、新しい領地（恩賞）を十分もらえなかったから|They fought but got little new land as reward|作戰後卻未獲足夠的新領地（恩賞）",
    [["幕府が元に負けたから|The shogunate lost to the Yuan|幕府敗給元朝","元軍は2度とも引きあげ、日本は占領されていません。|The Yuan withdrew both times.|元軍兩次都撤退，日本未被占領。"],["税がなくなったから|Taxes were abolished|稅賦被取消","税がなくなったわけではありません。|Taxes weren't abolished.|稅賦並未被取消。"],["将軍がいなくなったから|There was no shogun|沒有將軍了","将軍はいました。実権は執権の北条氏にありました。|There was a shogun; the Hojo held power.|將軍仍在，實權在執權北條氏手中。"]],
    "防衛戦で新しい土地は手に入らなかった。幕府は1297年に徳政令を出したが、かえって混乱した。|A defensive war won no land; the 1297 debt order only caused confusion.|防衛戰沒有取得新土地；幕府雖於1297年頒布德政令，反而造成混亂。"),
  Q("東大寺南大門の金剛力士像をつくった人物は？|Who made the Kongo Rikishi guardian statues at Todaiji's Great South Gate?|製作東大寺南大門金剛力士像的人是？","運慶・快慶|Unkei and Kaikei|運慶、快慶",
    [["雪舟|Sesshu|雪舟","雪舟は室町時代の水墨画家です。|Sesshu was a Muromachi ink painter.|雪舟是室町時代的水墨畫家。"],["観阿弥・世阿弥|Kan'ami and Zeami|觀阿彌、世阿彌","観阿弥・世阿弥は室町時代に能を大成しました。|They perfected Noh (Muromachi).|觀阿彌、世阿彌於室町時代集能劇之大成。"],["鑑真|Ganjin|鑑真","鑑真は奈良時代に唐から来た僧です。|A Tang monk (Nara).|鑑真是奈良時代從唐朝來的僧人。"]],
    "鎌倉文化：武士の気風に合った、力強く写実的な文化。|Kamakura culture: strong and realistic, suiting samurai.|鎌倉文化：符合武士風氣、雄健寫實的文化。"),
  Q("琵琶法師によって語り伝えられた、平氏の栄華と滅亡をえがいた軍記物は？|Which war tale of the Taira's rise and fall was recited by biwa-playing monks?|由琵琶法師傳唱、描寫平氏榮華與滅亡的軍記物語是？","『平家物語』|The Tale of the Heike|《平家物語》",
    [["『源氏物語』|The Tale of Genji|《源氏物語》","『源氏物語』は平安時代に紫式部が書いた物語です。|Murasaki's Heian novel.|《源氏物語》是平安時代紫式部寫的物語。"],["『徒然草』|Tsurezuregusa|《徒然草》","『徒然草』は兼好法師の随筆です。|Kenko's essays.|《徒然草》是兼好法師的隨筆。"],["『古事記』|Kojiki|《古事記》","『古事記』は奈良時代の歴史書です。|A Nara-period history.|《古事記》是奈良時代的史書。"]],
    "文字の読めない人々にも、語りを通して広まった。|Recitation spread it even to people who couldn't read.|透過說唱，連不識字的人也能接觸到。"),
  Q("鎌倉時代に兼好法師が書いた随筆は？|Which essay collection did Kenko write in the Kamakura period?|鎌倉時代兼好法師寫的隨筆是？","『徒然草』|Tsurezuregusa|《徒然草》",
    [["『方丈記』|Hojoki|《方丈記》","『方丈記』は鴨長明が書いた随筆です。|Kamo no Chomei's essay.|《方丈記》是鴨長明寫的隨筆。"],["『枕草子』|The Pillow Book|《枕草子》","『枕草子』は平安時代に清少納言が書きました。|Sei Shonagon (Heian).|《枕草子》是平安時代清少納言寫的。"],["『土佐日記』|Tosa Diary|《土佐日記》","『土佐日記』は平安時代に紀貫之が書いた日記です。|Ki no Tsurayuki's Heian diary.|《土佐日記》是平安時代紀貫之寫的日記。"]],
    "随筆：『枕草子』（平安・清少納言）、『方丈記』（鎌倉・鴨長明）、『徒然草』（鎌倉・兼好法師）。|Essays: Pillow Book (Heian), Hojoki and Tsurezuregusa (Kamakura).|隨筆：《枕草子》（平安、清少納言）、《方丈記》（鎌倉、鴨長明）、《徒然草》（鎌倉、兼好法師）。"),
  Q("後鳥羽上皇の命令で、藤原定家らがまとめた和歌集は？|Which poetry anthology did Fujiwara no Teika and others compile on Go-Toba's order?|奉後鳥羽上皇之命、由藤原定家等人編纂的和歌集是？","『新古今和歌集』|Shin Kokin Wakashu|《新古今和歌集》",
    [["『古今和歌集』|Kokin Wakashu|《古今和歌集》","『古今和歌集』は平安時代に紀貫之らがまとめました。|Compiled by Tsurayuki and others (Heian).|《古今和歌集》是平安時代紀貫之等人編纂的。"],["『万葉集』|Man'yoshu|《萬葉集》","『万葉集』は奈良時代の歌集です。|A Nara anthology.|《萬葉集》是奈良時代的歌集。"],["『風土記』|Fudoki|《風土記》","『風土記』は国ごとの地理や伝説の記録です。|Local records.|《風土記》是各國地理與傳說的紀錄。"]],
    "和歌集の順：『万葉集』（奈良）→『古今和歌集』（平安）→『新古今和歌集』（鎌倉）。|Order: Man'yoshu (Nara) → Kokinshu (Heian) → Shin Kokinshu (Kamakura).|和歌集順序：《萬葉集》（奈良）→《古今和歌集》（平安）→《新古今和歌集》（鎌倉）。"),
];
/* Part3 室町幕府と東アジア */
const m3=[ORD(Y_MED.slice(7,14)),
  Q("1333年に鎌倉幕府をたおし、建武の新政を始めた天皇は？|Which emperor overthrew the Kamakura shogunate in 1333 and began the Kenmu Restoration?|1333年推翻鎌倉幕府、開始建武新政的天皇是？","後醍醐天皇|Emperor Go-Daigo|後醍醐天皇",
    [["後鳥羽上皇|Retired Emperor Go-Toba|後鳥羽上皇","後鳥羽上皇は1221年の承久の乱で幕府に敗れました。|Go-Toba lost in 1221.|後鳥羽上皇在1221年承久之亂中敗給幕府。"],["白河上皇|Retired Emperor Shirakawa|白河上皇","白河上皇は院政を始めました。|He began insei.|白河上皇開始了院政。"],["聖武天皇|Emperor Shomu|聖武天皇","聖武天皇は奈良時代に東大寺を建てました。|He built Todaiji (Nara).|聖武天皇於奈良時代建造東大寺。"]],
    "建武の新政は公家（貴族）を重く用いたため武士の不満が高まり、約2年でくずれた。|It favored court nobles, angering samurai, and collapsed in about 2 years.|建武新政重用公家（貴族），引發武士不滿，約2年即瓦解。"),
  Q("1338年に征夷大将軍となり、京都に幕府を開いた人物は？|Who became shogun in 1338 and set up a shogunate in Kyoto?|1338年成為征夷大將軍、在京都開設幕府的人是？","足利尊氏|Ashikaga Takauji|足利尊氏",
    [["足利義満|Ashikaga Yoshimitsu|足利義滿","足利義満は3代将軍で、南北朝を統一しました。|The 3rd shogun; reunited the courts.|足利義滿是第三代將軍，統一南北朝。"],["新田義貞|Nitta Yoshisada|新田義貞","新田義貞は鎌倉を攻め落とした武将で、のちに尊氏と対立しました。|He took Kamakura, later fought Takauji.|新田義貞是攻陷鎌倉的武將，後與尊氏對立。"],["源頼朝|Minamoto no Yoritomo|源賴朝","源頼朝は鎌倉幕府を開きました。|He founded the Kamakura shogunate.|源賴朝開創鎌倉幕府。"]],
    "後醍醐天皇は吉野（奈良県）にのがれ、京都の北朝と吉野の南朝が争う南北朝時代になった。|Go-Daigo fled to Yoshino: the Northern and Southern Courts era began.|後醍醐天皇逃往吉野（奈良縣），進入京都北朝與吉野南朝對立的南北朝時代。"),
  Q("室町幕府で将軍を補佐した役職は？|Which post assisted the shogun in the Muromachi shogunate?|室町幕府中輔佐將軍的職務是？","管領|Kanrei|管領",
    [["執権|Shikken|執權","執権は鎌倉幕府の将軍の補佐役です。|That's Kamakura.|執權是鎌倉幕府的將軍輔佐職。"],["太政大臣|Daijo-daijin|太政大臣","太政大臣は朝廷の最高の役職です。|The top court post.|太政大臣是朝廷的最高職位。"],["守護|Shugo|守護","守護は国ごとに置かれた役職です。|Shugo were provincial posts.|守護是設於各國的職務。"]],
    "管領には有力な守護大名（細川・斯波・畠山氏）がついた。|Powerful shugo daimyo (Hosokawa, Shiba, Hatakeyama) held it.|管領由有力的守護大名（細川、斯波、畠山氏）擔任。"),
  Q("足利義満が始めた明との貿易で、正式な貿易船と倭寇を区別するために使われた証明書は？|In Yoshimitsu's trade with Ming, what certificates told official ships from pirates?|足利義滿開始的對明貿易中，用來區分正式貿易船與倭寇的證明是？","勘合|Kango tallies|勘合",
    [["金印|Gold seal|金印","金印は57年に奴国の王が授かったものです。|The seal given to Na in 57.|金印是西元57年奴國王所獲贈的。"],["宋銭|Song coins|宋錢","宋銭は中国から輸入された銅銭です。|Copper coins imported from China.|宋錢是從中國進口的銅錢。"],["朱印状|Red-seal license|朱印狀","朱印状は江戸時代初めの朱印船貿易で使われました。|Used in early Edo red-seal trade.|朱印狀用於江戶時代初期的朱印船貿易。"]],
    "勘合貿易（日明貿易）で、銅銭・生糸などを輸入し、刀・銅などを輸出した。|Imports: copper coins, raw silk; exports: swords, copper.|勘合貿易（日明貿易）進口銅錢、生絲等，出口刀劍、銅等。"),
  Q("朝鮮半島や中国の沿岸をあらした海賊を何という？|What were the pirates raiding Korean and Chinese coasts called?|侵擾朝鮮半島與中國沿岸的海盜叫做？","倭寇|Wako|倭寇",
    [["渡来人|Toraijin|渡來人","渡来人は大陸から日本に移り住んだ人々です。|They were immigrants.|渡來人是從大陸移居日本的人。"],["馬借|Bashaku|馬借","馬借は馬を使った運送業者です。|Packhorse carriers.|馬借是使用馬匹的運輸業者。"],["防人|Sakimori|防人","防人は古代の兵士です。|Ancient soldiers.|防人是古代的士兵。"]],
    "明は倭寇の取りしまりを日本に求めた。|Ming asked Japan to suppress the wako.|明朝要求日本取締倭寇。"),
  Q("15世紀に尚氏が沖縄島を統一して建てた国は？|Which kingdom did the Sho family found by unifying Okinawa in the 15th century?|15世紀尚氏統一沖繩島所建立的國家是？","琉球王国|Ryukyu Kingdom|琉球王國",
    [["朝鮮国|Joseon|朝鮮","朝鮮国は1392年に李成桂が朝鮮半島に建てた国です。|Joseon, founded in Korea in 1392.|朝鮮是1392年李成桂在朝鮮半島建立的國家。"],["邪馬台国|Yamatai|邪馬台國","邪馬台国は3世紀に卑弥呼が治めた国です。|Himiko's 3rd-century realm.|邪馬台國是3世紀卑彌呼統治的國家。"],["奴国|Na|奴國","奴国は1世紀に金印を授かった国です。|Na got a gold seal in the 1st century.|奴國是1世紀獲贈金印的國家。"]],
    "琉球王国は首里を都とし、日本・中国・東南アジアを結ぶ中継貿易で栄えた。|With Shuri as capital, it thrived on relay trade between Japan, China and SE Asia.|琉球王國以首里為都，靠連結日本、中國、東南亞的轉口貿易而繁榮。"),
  Q("室町時代に、蝦夷地（北海道）に住み、本州の人々（和人）と交易していた人々は？|Who lived in Ezo (Hokkaido) and traded with people from Honshu?|室町時代居住在蝦夷地（北海道），與本州人（和人）交易的人們是？","アイヌの人々|The Ainu|愛努人",
    [["琉球の人々|Ryukyuans|琉球人","琉球の人々は沖縄に住む人々です。|They live in Okinawa.|琉球人是住在沖繩的人。"],["渡来人|Toraijin|渡來人","渡来人は古代に大陸から移り住んだ人々です。|Ancient immigrants.|渡來人是古代從大陸移居的人。"],["倭寇|Wako|倭寇","倭寇は海賊です。|Pirates.|倭寇是海盜。"]],
    "和人との対立から、1457年にコシャマインが戦いを起こした。|Conflict with Wajin led to Koshamain's war in 1457.|因與和人對立，1457年胡奢魔犬（Koshamain）起兵抗爭。"),
  Q("室町時代、農民が村を自分たちで運営するためにつくった自治のしくみは？|What self-governing village organization did Muromachi farmers create?|室町時代農民為自行管理村落而建立的自治組織是？","惣（惣村）|So (self-governing village)|惣（惣村）",
    [["座|Za (guild)|座","座は商人や手工業者の同業者の組合です。|Za were merchant/craft guilds.|座是商人與手工業者的同業公會。"],["土倉|Doso (moneylender)|土倉","土倉はお金を貸す金融業者です。|Doso lent money.|土倉是放款的金融業者。"],["守護大名|Shugo daimyo|守護大名","守護大名は国を支配した武士です。|Shugo daimyo ruled provinces.|守護大名是統治一國的武士。"]],
    "惣では寄合を開いておきてを決め、ときには団結して土一揆を起こした。|Villagers met to set rules and sometimes rose in uprisings.|惣村召開集會訂立規約，有時團結發動土一揆。"),
  Q("馬を使って物資を運んだ、室町時代の運送業者は？|Who were the packhorse carriers of the Muromachi period?|室町時代使用馬匹運送物資的運輸業者是？","馬借|Bashaku|馬借",
    [["土倉・酒屋|Doso and sakaya (lenders)|土倉、酒屋","土倉・酒屋はお金を貸す金融業者です。|They lent money.|土倉、酒屋是放款的金融業者。"],["座|Za|座","座は同業者の組合です。|Guilds.|座是同業公會。"],["防人|Sakimori|防人","防人は古代の九州北部の兵士です。|Ancient border guards.|防人是古代九州北部的士兵。"]],
    "1428年の正長の土一揆は、近江（滋賀県）の馬借の行動がきっかけだった。|The 1428 Shocho uprising began with Omi's packhorse men.|1428年的正長土一揆以近江（滋賀縣）馬借的行動為開端。"),
  Q("足利義満が京都の北山に建てた建物は？|Which building did Yoshimitsu build at Kitayama in Kyoto?|足利義滿在京都北山建造的建築是？","金閣|Kinkaku (Golden Pavilion)|金閣",
    [["銀閣|Ginkaku (Silver Pavilion)|銀閣","銀閣は8代将軍足利義政が東山に建てました。|Built by Yoshimasa at Higashiyama.|銀閣是第八代將軍足利義政在東山所建。"],["平等院鳳凰堂|Byodoin Phoenix Hall|平等院鳳凰堂","平等院鳳凰堂は平安時代に藤原頼通が建てました。|Built by Yorimichi (Heian).|平等院鳳凰堂是平安時代藤原賴通所建。"],["法隆寺|Horyuji|法隆寺","法隆寺は飛鳥時代の寺です。|An Asuka temple.|法隆寺是飛鳥時代的寺院。"]],
    "金閣には、貴族の文化と武士の文化がとけあった北山文化の特色が表れている。|Kinkaku shows Kitayama culture, blending noble and samurai tastes.|金閣展現了貴族文化與武士文化融合的北山文化特色。"),
  Q("足利義満の保護を受けて、能を大成した親子は？|Which father and son perfected Noh under Yoshimitsu's patronage?|受足利義滿保護、集能劇之大成的父子是？","観阿弥・世阿弥|Kan'ami and Zeami|觀阿彌、世阿彌",
    [["運慶・快慶|Unkei and Kaikei|運慶、快慶","運慶・快慶は鎌倉時代の仏像の彫刻家です。|Kamakura sculptors.|運慶、快慶是鎌倉時代的佛像雕刻家。"],["藤原道長・頼通|Michinaga and Yorimichi|藤原道長、賴通","藤原道長・頼通は平安時代の摂関政治の中心の親子です。|Heian regents.|藤原道長、賴通是平安時代攝關政治的核心父子。"],["法然・親鸞|Honen and Shinran|法然、親鸞","法然・親鸞は鎌倉時代の僧で、師と弟子です。|Kamakura monks, teacher and disciple.|法然、親鸞是鎌倉時代的僧人，為師徒關係。"]],
    "能の合間には、民衆の生活などを題材にした喜劇の狂言が演じられた。|Between Noh plays, comic kyogen about daily life were performed.|能劇之間會演出以民眾生活等為題材的喜劇「狂言」。"),
];
/* Part4 応仁の乱と戦国時代 */
const m4=[ORD(Y_MED.slice(10)),
  Q("1467年、8代将軍足利義政の後つぎ問題などから始まり、京都が焼け野原になった戦乱は？|Which war began in 1467 over the 8th shogun Yoshimasa's heir and burned Kyoto?|1467年因第八代將軍足利義政的繼承問題等而起、使京都化為焦土的戰亂是？","応仁の乱|The Onin War|應仁之亂",
    [["承久の乱|The Jokyu War|承久之亂","承久の乱は1221年、後鳥羽上皇が起こしました。|Go-Toba, 1221.|承久之亂是1221年後鳥羽上皇發動的。"],["壬申の乱|The Jinshin War|壬申之亂","壬申の乱は672年の天皇の後つぎ争いです。|A 672 succession war.|壬申之亂是672年的天皇繼承之爭。"],["平治の乱|The Heiji Disturbance|平治之亂","平治の乱は1159年、平清盛が源義朝を破った戦いです。|1159: Kiyomori beat Yoshitomo.|平治之亂是1159年平清盛擊敗源義朝的戰役。"]],
    "細川氏（東軍）と山名氏（西軍）の守護大名も加わり、11年続いた。幕府の力はおとろえた。|Hosokawa (East) and Yamana (West) joined; it lasted 11 years and weakened the shogunate.|守護大名細川氏（東軍）與山名氏（西軍）也加入，持續11年，幕府勢力衰退。"),
  Q("身分の低い者が、実力で身分の高い者をたおす風潮を何という？|What is the trend of lower-ranking people overthrowing their superiors by force called?|身分低者憑實力推翻身分高者的風潮叫做？","下剋上|Gekokujo|下剋上",
    [["御恩と奉公|Favor and service|御恩與奉公","御恩と奉公は将軍と御家人の主従関係です。|The shogun–vassal bond.|御恩與奉公是將軍與御家人的主從關係。"],["公地公民|Public land and people|公地公民","公地公民は大化の改新の方針です。|A Taika policy.|公地公民是大化革新的方針。"],["院政|Insei|院政","院政は上皇が行う政治です。|Rule by a retired emperor.|院政是上皇主持的政治。"]],
    "応仁の乱のあと下剋上が広がり、各地に戦国大名が現れた（戦国時代）。|After Onin, gekokujo spread and Sengoku daimyo rose everywhere.|應仁之亂後下剋上風潮擴散，各地出現戰國大名（戰國時代）。"),
  Q("戦国大名が、領国を治めるために定めた独自のきまりは？|What were the rules Sengoku daimyo set to govern their domains?|戰國大名為治理領國而制定的獨自規定是？","分国法|Bunkokuho (domain laws)|分國法",
    [["御成敗式目|Goseibai Shikimoku|御成敗式目","御成敗式目は鎌倉幕府の法律です。|A Kamakura law.|御成敗式目是鎌倉幕府的法律。"],["大宝律令|Taiho Code|大寶律令","大宝律令は701年の律令です。|The 701 code.|大寶律令是701年的律令。"],["十七条の憲法|Seventeen-Article Constitution|十七條憲法","十七条の憲法は聖徳太子が定めました。|Shotoku's rules.|十七條憲法是聖德太子制定的。"]],
    "分国法では、けんか両成敗などを定めて家臣を統制した。|Domain laws controlled retainers, e.g. punishing both sides of a fight.|分國法訂定「喧嘩兩成敗」等規定以統制家臣。"),
  Q("戦国大名が、城のまわりに家臣や商工業者を集めてつくった町は？|What towns did daimyo build around their castles, gathering retainers and merchants?|戰國大名在城堡周圍聚集家臣與工商業者所形成的城鎮是？","城下町|Castle town|城下町",
    [["門前町|Temple town|門前町","門前町は寺や神社の門前にできた町です。|Towns in front of temples/shrines.|門前町是在寺廟、神社門前形成的城鎮。"],["港町|Port town|港町","港町は港を中心に栄えた町（堺・博多など）です。|Towns around ports.|港町是以港口為中心繁榮的城鎮（堺、博多等）。"],["宿場町|Post town|宿場町","宿場町は街道ぞいの宿泊地として栄えた町です。|Towns along highways.|宿場町是沿街道作為住宿地而繁榮的城鎮。"]],
    "城下町には、大名の命令で家臣や商人・職人が集められた。|Daimyo ordered retainers, merchants and craftsmen to live there.|城下町依大名命令聚集家臣與商人、工匠。"),
  Q("8代将軍足利義政が京都の東山に建てた建物は？|Which building did the 8th shogun Yoshimasa build at Higashiyama?|第八代將軍足利義政在京都東山建造的建築是？","銀閣|Ginkaku (Silver Pavilion)|銀閣",
    [["金閣|Kinkaku|金閣","金閣は3代将軍足利義満が北山に建てました。|Built by Yoshimitsu at Kitayama.|金閣是第三代將軍足利義滿在北山所建。"],["中尊寺金色堂|Chusonji Golden Hall|中尊寺金色堂","中尊寺金色堂は平安時代に奥州藤原氏が建てました。|Built by the Northern Fujiwara (Heian).|中尊寺金色堂是平安時代奧州藤原氏所建。"],["東大寺南大門|Todaiji Great South Gate|東大寺南大門","東大寺南大門は鎌倉時代に再建されました。|Rebuilt in the Kamakura period.|東大寺南大門是鎌倉時代重建的。"]],
    "東山文化：禅宗の影響を受けた、簡素で落ち着いた文化。銀閣・書院造・水墨画。|Higashiyama culture: simple, Zen-influenced — Ginkaku, shoin style, ink painting.|東山文化：受禪宗影響、簡樸沉靜的文化，如銀閣、書院造、水墨畫。"),
  Q("銀閣と同じ敷地の東求堂同仁斎に見られる、たたみ・ふすま・床の間などのある建築様式は？|What style, with tatami, sliding doors and an alcove, is seen in the Togudo at Ginkakuji?|銀閣寺境內東求堂同仁齋可見、有榻榻米、拉門、床之間的建築樣式是？","書院造|Shoin-zukuri|書院造",
    [["寝殿造|Shinden-zukuri|寢殿造","寝殿造は平安時代の貴族の住まいです。|Heian aristocrats' style.|寢殿造是平安時代貴族的住宅。"],["校倉造|Azekura style|校倉造","校倉造は正倉院などの倉の建て方です。|Storehouse log style.|校倉造是正倉院等倉庫的建造方式。"],["竪穴住居|Pit dwelling|豎穴式住居","竪穴住居は縄文・弥生時代の住まいです。|Jomon/Yayoi homes.|豎穴式住居是繩文、彌生時代的住所。"]],
    "書院造は、いまの和風の住宅のもとになった。|Shoin style became the basis of today's Japanese-style rooms.|書院造成為現今日式住宅的原型。"),
  Q("明にわたって技法を学び、日本の水墨画を大成した人物は？|Who studied in Ming China and perfected Japanese ink painting?|赴明朝學習技法、集日本水墨畫之大成的人是？","雪舟|Sesshu|雪舟",
    [["運慶|Unkei|運慶","運慶は鎌倉時代の彫刻家です。|A Kamakura sculptor.|運慶是鎌倉時代的雕刻家。"],["世阿弥|Zeami|世阿彌","世阿弥は能を大成した人物です。|He perfected Noh.|世阿彌是集能劇之大成的人。"],["紫式部|Murasaki Shikibu|紫式部","紫式部は『源氏物語』の作者です。|Author of Genji.|紫式部是《源氏物語》的作者。"]],
    "水墨画：墨のこさとうすさだけで自然などをえがく絵。|Ink painting uses only shades of ink.|水墨畫：只用墨色濃淡描繪自然等的畫。"),
  Q("浄土真宗（一向宗）の信者たちが守護大名をたおし、約100年にわたって自治を行った一揆は？|Which uprising by Jodo Shinshu (Ikko) believers overthrew the daimyo and ruled for about 100 years?|淨土真宗（一向宗）信徒推翻守護大名、自治約100年的一揆是？","加賀の一向一揆|Kaga Ikko uprising|加賀一向一揆",
    [["山城国一揆|Yamashiro uprising|山城國一揆","山城国一揆は、武士と農民が守護大名を追い出し、8年間自治を行いました。|Samurai and farmers ruled for 8 years.|山城國一揆是武士與農民驅逐守護大名，自治8年。"],["正長の土一揆|Shocho uprising|正長土一揆","正長の土一揆は、徳政を求めて土倉や酒屋をおそった一揆です。|It demanded debt relief.|正長土一揆是要求德政而襲擊土倉、酒屋的一揆。"],["承久の乱|Jokyu War|承久之亂","承久の乱は後鳥羽上皇と幕府の戦いです。|Go-Toba vs. the shogunate.|承久之亂是後鳥羽上皇與幕府之間的戰爭。"]],
    "加賀（石川県）の一向一揆は1488年から約100年続いた。|The Kaga (Ishikawa) uprising lasted about 100 years from 1488.|加賀（石川縣）的一向一揆從1488年起持續約100年。"),
  Q("日明貿易などで栄え、有力な商人による自治が行われた港町は？|Which port town grew rich from Ming trade and was governed by its leading merchants?|因日明貿易等而繁榮、由有力商人自治的港町是？","堺（大阪府）|Sakai (Osaka)|堺（大阪府）",
    [["鎌倉|Kamakura|鎌倉","鎌倉は鎌倉幕府が置かれた所です。|Seat of the Kamakura shogunate.|鎌倉是設置鎌倉幕府的地方。"],["平泉|Hiraizumi|平泉","平泉（岩手県）は奥州藤原氏が栄えた所です。|The Northern Fujiwara's base.|平泉（岩手縣）是奧州藤原氏興盛之地。"],["大宰府|Dazaifu|大宰府","大宰府は古代の九州の役所です。|An ancient office in Kyushu.|大宰府是古代九州的官署。"]],
    "京都では町衆が、堺や博多では有力な商人が自治を行った。|Townspeople in Kyoto and merchants in Sakai and Hakata ran their own affairs.|京都由町眾、堺與博多由有力商人實行自治。"),
];
/* ========== 組み合わせカード（2枚の組を見つける。カードはすべて表向き） ========== */
const PEOPLE=[["卑弥呼|Himiko|卑彌呼","魏に使いを送る|Sent envoys to Wei|遣使至魏"],["小野妹子|Ono no Imoko|小野妹子","遣隋使|Envoy to Sui|遣隋使"],["聖徳太子|Prince Shotoku|聖德太子","十七条の憲法|Seventeen-Article Constitution|十七條憲法"],["中大兄皇子|Prince Naka no Oe|中大兄皇子","大化の改新|Taika Reform|大化革新"],
  ["聖武天皇|Emperor Shomu|聖武天皇","東大寺の大仏|Great Buddha of Todaiji|東大寺大佛"],["鑑真|Ganjin|鑑真","唐招提寺を開く|Founded Toshodaiji|開創唐招提寺"],["桓武天皇|Emperor Kanmu|桓武天皇","平安京に都を移す|Moved the capital to Heian-kyo|遷都平安京"],["坂上田村麻呂|Sakanoue no Tamuramaro|坂上田村麻呂","蝦夷を従わせる|Subdued the Emishi|征服蝦夷"],
  ["菅原道真|Sugawara no Michizane|菅原道真","遣唐使の停止|Stopped envoys to Tang|停派遣唐使"],["藤原道長|Fujiwara no Michinaga|藤原道長","摂関政治の全盛|Peak of regency rule|攝關政治全盛"],["白河上皇|Retired Emperor Shirakawa|白河上皇","院政を始める|Began cloister rule|開始院政"],["平清盛|Taira no Kiyomori|平清盛","日宋貿易|Trade with Song|日宋貿易"],
  ["源頼朝|Minamoto no Yoritomo|源賴朝","守護・地頭を置く|Set up shugo and jito|設置守護、地頭"],["北条泰時|Hojo Yasutoki|北條泰時","御成敗式目|Goseibai Shikimoku|御成敗式目"],["北条時宗|Hojo Tokimune|北條時宗","元寇に立ち向かう|Faced the Mongol invasions|對抗元軍來襲"],["後醍醐天皇|Emperor Go-Daigo|後醍醐天皇","建武の新政|Kenmu Restoration|建武新政"],
  ["足利尊氏|Ashikaga Takauji|足利尊氏","室町幕府を開く|Founded the Muromachi shogunate|開創室町幕府"],["足利義満|Ashikaga Yoshimitsu|足利義滿","南北朝の統一|Reunited the two courts|統一南北朝"],["足利義政|Ashikaga Yoshimasa|足利義政","銀閣|Ginkaku|銀閣"],["雪舟|Sesshu|雪舟","水墨画|Ink painting|水墨畫"]];
const WORKS=[["『源氏物語』|The Tale of Genji|《源氏物語》","紫式部|Murasaki Shikibu|紫式部"],["『枕草子』|The Pillow Book|《枕草子》","清少納言|Sei Shonagon|清少納言"],["『古今和歌集』|Kokin Wakashu|《古今和歌集》","紀貫之ら|Ki no Tsurayuki et al.|紀貫之等"],["『万葉集』|Man'yoshu|《萬葉集》","大伴家持（まとめたとされる）|Otomo no Yakamochi (said to compile)|大伴家持（相傳編纂）"],
  ["『徒然草』|Tsurezuregusa|《徒然草》","兼好法師|Kenko|兼好法師"],["『方丈記』|Hojoki|《方丈記》","鴨長明|Kamo no Chomei|鴨長明"],["『新古今和歌集』|Shin Kokin Wakashu|《新古今和歌集》","藤原定家ら|Fujiwara no Teika et al.|藤原定家等"],["金剛力士像|Kongo Rikishi statues|金剛力士像","運慶・快慶|Unkei and Kaikei|運慶、快慶"],
  ["平等院鳳凰堂|Byodoin Phoenix Hall|平等院鳳凰堂","藤原頼通|Fujiwara no Yorimichi|藤原賴通"],["金閣|Kinkaku|金閣","足利義満|Ashikaga Yoshimitsu|足利義滿"],["能|Noh|能劇","観阿弥・世阿弥|Kan'ami and Zeami|觀阿彌、世阿彌"],["法隆寺|Horyuji|法隆寺","聖徳太子（建てたとされる）|Prince Shotoku (said to build)|聖德太子（相傳建造）"]];
const CAP=[["アメリカ合衆国|United States|美國","ワシントンD.C.|Washington, D.C.|華盛頓特區"],["中国|China|中國","ペキン（北京）|Beijing|北京"],["韓国|South Korea|韓國","ソウル|Seoul|首爾"],["イギリス|United Kingdom|英國","ロンドン|London|倫敦"],
  ["フランス|France|法國","パリ|Paris|巴黎"],["ドイツ|Germany|德國","ベルリン|Berlin|柏林"],["イタリア|Italy|義大利","ローマ|Rome|羅馬"],["ロシア|Russia|俄羅斯","モスクワ|Moscow|莫斯科"],
  ["オーストラリア|Australia|澳洲","キャンベラ|Canberra|坎培拉","シドニーではない。|Not Sydney.|不是雪梨。"],["ブラジル|Brazil|巴西","ブラジリア|Brasília|巴西利亞","リオデジャネイロではない。|Not Rio de Janeiro.|不是里約熱內盧。"],["カナダ|Canada|加拿大","オタワ|Ottawa|渥太華","トロントではない。|Not Toronto.|不是多倫多。"],["エジプト|Egypt|埃及","カイロ|Cairo|開羅"],
  ["インド|India|印度","ニューデリー|New Delhi|新德里"],["タイ|Thailand|泰國","バンコク|Bangkok|曼谷"],["サウジアラビア|Saudi Arabia|沙烏地阿拉伯","リヤド|Riyadh|利雅德"],["トルコ|Türkiye (Turkey)|土耳其","アンカラ|Ankara|安卡拉","イスタンブールではない。|Not Istanbul.|不是伊斯坦堡。"],
  ["ケニア|Kenya|肯亞","ナイロビ|Nairobi|奈洛比"],["アルゼンチン|Argentina|阿根廷","ブエノスアイレス|Buenos Aires|布宜諾斯艾利斯"],["ニュージーランド|New Zealand|紐西蘭","ウェリントン|Wellington|威靈頓","オークランドではない。|Not Auckland.|不是奧克蘭。"],["スペイン|Spain|西班牙","マドリード|Madrid|馬德里"]];
const GEOF=[["ヒマラヤ山脈|The Himalayas|喜馬拉雅山脈","アジア州|Asia|亞洲"],["メコン川|The Mekong|湄公河","アジア州|Asia|亞洲"],["ガンジス川|The Ganges|恆河","アジア州|Asia|亞洲"],
  ["アルプス山脈|The Alps|阿爾卑斯山脈","ヨーロッパ州|Europe|歐洲"],["ライン川|The Rhine|萊茵河","ヨーロッパ州|Europe|歐洲"],["スカンディナビア半島|Scandinavian Peninsula|斯堪地那維亞半島","ヨーロッパ州|Europe|歐洲"],
  ["サハラ砂漠|The Sahara|撒哈拉沙漠","アフリカ州|Africa|非洲"],["ナイル川|The Nile|尼羅河","アフリカ州|Africa|非洲"],["ギニア湾|Gulf of Guinea|幾內亞灣","アフリカ州|Africa|非洲"],
  ["ロッキー山脈|The Rocky Mountains|洛磯山脈","北アメリカ州|North America|北美洲"],["ミシシッピ川|The Mississippi|密西西比河","北アメリカ州|North America|北美洲"],["五大湖|The Great Lakes|五大湖","北アメリカ州|North America|北美洲"],
  ["アンデス山脈|The Andes|安地斯山脈","南アメリカ州|South America|南美洲"],["アマゾン川|The Amazon|亞馬遜河","南アメリカ州|South America|南美洲"],["パンパ|The Pampas|彭巴草原","南アメリカ州|South America|南美洲"],
  ["グレートディバイディング山脈|Great Dividing Range|大分水嶺","オセアニア州|Oceania|大洋洲"],["グレートバリアリーフ|Great Barrier Reef|大堡礁","オセアニア州|Oceania|大洋洲"]];
const ANCW=[["エジプト文明|Egyptian civilization|埃及文明","ピラミッド|Pyramids|金字塔"],["メソポタミア文明|Mesopotamian civilization|美索不達米亞文明","くさび形文字|Cuneiform|楔形文字"],["インダス文明|Indus civilization|印度河文明","モヘンジョ・ダロ|Mohenjo-daro|摩亨佐達羅"],["中国文明（殷）|Chinese civilization (Yin)|中國文明（殷商）","甲骨文字|Oracle-bone script|甲骨文"],
  ["秦の始皇帝|The First Emperor of Qin|秦始皇","万里の長城|The Great Wall|萬里長城"],["孔子|Confucius|孔子","儒教（儒学）|Confucianism|儒家（儒學）"],["古代ギリシャ|Ancient Greece|古希臘","ポリス（都市国家）|Polis (city-state)|城邦"],["シャカ|The Buddha|釋迦牟尼","仏教|Buddhism|佛教"],["イエス|Jesus|耶穌","キリスト教|Christianity|基督教"],["ムハンマド|Muhammad|穆罕默德","イスラム教|Islam|伊斯蘭教"]];
const YQ=["{a}のできごとは？|What happened in {a}?|{a}發生的事是？","「{b}」は何年？|In what year: {b}?|「{b}」是哪一年？","{a}：{b}。|{a}: {b}.|{a}：{b}。"];
const PAIRS=[
  ["都道府県と都道府県庁所在地|Prefectures & capitals|都道府縣與縣政府所在地",PREF,PQ],
  ["古代の年号|Ancient dates|古代的年份",Y_ANC,YQ],
  ["中世の年号|Medieval dates|中世的年份",Y_MED,YQ],
  ["人物と行ったこと|People & deeds|人物與事蹟",PEOPLE,["{a}が行ったことは？|What did {a} do?|{a}做了什麼？","「{b}」と関係の深い人物は？|Who is linked to \"{b}\"?|與「{b}」關係密切的人物是？","{a}：{b}。|{a}: {b}.|{a}：{b}。"]],
  ["作品・建物と人物|Works & people|作品、建築與人物",WORKS,["{a}と関係の深い人物は？|Who is linked to {a}?|與{a}關係密切的人物是？","{b}と関係の深い作品・建物は？|Which work or building is linked to {b}?|與{b}關係密切的作品或建築是？","{a}：{b}。|{a}: {b}.|{a}：{b}。"]],
  ["仏教の宗派と開いた人|Buddhist sects & founders|佛教宗派與開創者",SECT,SECTQ],
  ["国と首都|Countries & capitals|國家與首都",CAP,["{a}の首都は？|What is the capital of {a}?|{a}的首都是？","{b}が首都の国は？|{b} is the capital of…|以{b}為首都的國家是？","{a}の首都は{b}。|The capital of {a} is {b}.|{a}的首都是{b}。"]],
  ["地名と州|Places & world regions|地名與洲",GEOF,["{a}がある州は？|Which region is {a} in?|{a}位於哪一洲？","{b}にあるのは？|Which is in {b}?|位於{b}的是？","{a}は{b}にある。|{a} is in {b}.|{a}位於{b}。"]],
  ["古代の世界|The ancient world|古代世界",ANCW,["{a}と組になるのは？|Which goes with {a}?|與{a}配對的是？","{b}と組になるのは？|Which goes with {b}?|與{b}配對的是？","{a} ― {b}|{a} — {b}|{a} ― {b}"]]];

/* ========== 単元 ========== */
const units=[
 {id:"wgeo",s:"soc",g:"geo",n:{ja:"世界の姿",en:"The world",["zh-Hant"]:"世界的樣貌"},gr:"1",k:"math",ref:X("地理的分野 A(1)・B(1) 世界の地域構成／人々の生活と環境|Geography A(1), B(1): the world's regions; life and environment|地理領域 A(1)、B(1) 世界的區域構成／人們的生活與環境"),
  parts:[1,2,3,4,5],pn:{1:X("大陸と海洋・6つの州|Continents, oceans & six regions|大陸與海洋、六大洲"),2:X("緯度と経度・地図|Latitude, longitude & maps|緯度與經度、地圖"),3:X("時差|Time differences|時差"),4:X("世界の気候（雨温図）|World climates (climate graphs)|世界的氣候（氣溫雨量圖）"),5:X("人々の生活と宗教|Ways of life & religions|人們的生活與宗教")},
  sk:{1:w1,2:w2,3:w3,4:w4,5:w5}},
 {id:"jgeo",s:"soc",g:"geo",n:{ja:"日本の姿",en:"Japan",["zh-Hant"]:"日本的樣貌"},gr:"1",k:"math",ref:X("地理的分野 A(1) 日本の地域構成|Geography A(1): Japan's regions|地理領域 A(1) 日本的區域構成"),
  parts:[1,2,3],pn:{1:X("位置と領域|Location & territory|位置與領域"),2:X("都道府県と都道府県庁所在地|Prefectures & capitals|都道府縣與縣政府所在地"),3:X("7地方区分|The seven regions|七地方區分")},
  sk:{1:j1,2:j2,3:j3}},
 {id:"wreg",s:"soc",g:"geo",n:{ja:"世界の諸地域",en:"World regions",["zh-Hant"]:"世界各區域"},gr:"1",k:"math",ref:X("地理的分野 B(2) 世界の諸地域|Geography B(2): regions of the world|地理領域 B(2) 世界各區域"),
  parts:[1,2,3,4,5],pn:{1:X("アジア州|Asia|亞洲"),2:X("ヨーロッパ州|Europe|歐洲"),3:X("アフリカ州|Africa|非洲"),4:X("北アメリカ州|North America|北美洲"),5:X("南アメリカ州・オセアニア州|South America & Oceania|南美洲、大洋洲")},
  sk:{1:r1,2:r2,3:r3,4:r4,5:r5}},
 {id:"anc",s:"soc",g:"hist",n:{ja:"古代までの日本",en:"Ancient Japan",["zh-Hant"]:"古代的日本"},gr:"1",k:"math",ref:X("歴史的分野 B(1) 古代までの日本|History B(1): Japan to the ancient period|歷史領域 B(1) 古代以前的日本"),
  parts:[1,2,3,4,5],pn:{1:X("古代文明と宗教のおこり|Ancient civilizations & religions|古代文明與宗教的起源"),2:X("縄文・弥生・古墳時代|Jomon, Yayoi & Kofun|繩文、彌生、古墳時代"),3:X("飛鳥時代|Asuka period|飛鳥時代"),4:X("奈良時代|Nara period|奈良時代"),5:X("平安時代|Heian period|平安時代")},
  sk:{1:h1,2:h2,3:h3,4:h4,5:h5}},
 {id:"med",s:"soc",g:"hist",n:{ja:"中世の日本",en:"Medieval Japan",["zh-Hant"]:"中世的日本"},gr:"1",k:"math",ref:X("歴史的分野 B(2) 中世の日本|History B(2): medieval Japan|歷史領域 B(2) 中世的日本"),
  parts:[1,2,3,4],pn:{1:X("鎌倉幕府|The Kamakura shogunate|鎌倉幕府"),2:X("元寇と鎌倉時代の文化|Mongol invasions & Kamakura culture|元日戰爭與鎌倉文化"),3:X("室町幕府と東アジア|The Muromachi shogunate & East Asia|室町幕府與東亞"),4:X("応仁の乱と戦国時代|The Onin War & the Sengoku era|應仁之亂與戰國時代")},
  sk:{1:m1,2:m2,3:m3,4:m4}},
 {id:"pair",s:"soc",g:"pair",pair:true,n:{ja:"組み合わせカード",en:"Match pairs",["zh-Hant"]:"配對卡"},gr:"1",k:"math",ref:X("中1社会の全単元から|From all Grade 7 social studies units|國一社會全部單元"),
  parts:PAIRS.map((_,i)=>i+1),pn:Object.fromEntries(PAIRS.map((s,i)=>[i+1,X(s[0])])),sk:Object.fromEntries(PAIRS.map((s,i)=>[i+1,TB(s[1],...s[2])])),
  pairs:Object.fromEntries(PAIRS.map((s,i)=>[i+1,s[1].map(r=>[X(r[0]),X(r[1]),r[2]?X(r[2]):""])]))},
];
// 問題を作る（MATH.make と同じ。変な選択肢が出ないよう作り直しつき）
function make(fn){ for(let i=0;i<20;i++){ try{ const g=fn(); if(g&&(g.opts||g.wrongs.length>=3)&&!g.wrongs.some(w=>w.v===g.ans)) return g; }catch(e){} } return fn(); }
return {units,make};
})();
