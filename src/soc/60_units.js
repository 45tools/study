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
