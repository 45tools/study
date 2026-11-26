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
