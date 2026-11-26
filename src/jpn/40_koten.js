/* ========== 古典入門（歴史的仮名遣い・古語・作品） ========== */
const RULE={ha:"語中・語尾の「は・ひ・ふ・へ・ほ」は「わ・い・う・え・お」に直す。|「は・ひ・ふ・へ・ほ」 in the middle or at the end of a word become 「わ・い・う・え・お」.|詞中、詞尾的「は・ひ・ふ・へ・ほ」改成「わ・い・う・え・お」。",
  wo:"「ゐ・ゑ・を」は「い・え・お」に直す。|「ゐ・ゑ・を」 become 「い・え・お」.|「ゐ・ゑ・を」改成「い・え・お」。",
  dz:"「ぢ・づ」は「じ・ず」に直す。|「ぢ・づ」 become 「じ・ず」.|「ぢ・づ」改成「じ・ず」。",
  au:"「あう」の音（au）は「おう」（ô）に直す。例：「やう」→「よう」|The sound au becomes ô, e.g. 「やう」 → 「よう」.|「あう」的音（au）改成「おう」（ô），例如「やう」→「よう」。",
  iu:"「いう」の音（iu）は「ゆう」（yû）に直す。例：「しう」→「しゅう」|The sound iu becomes yû, e.g. 「しう」 → 「しゅう」.|「いう」的音（iu）改成「ゆう」（yû），例如「しう」→「しゅう」。",
  eu:"「えう」の音（eu）は「よう」（yô）に直す。例：「けう」→「きょう」|The sound eu becomes yô, e.g. 「けう」 → 「きょう」.|「えう」的音（eu）改成「よう」（yô），例如「けう」→「きょう」。",
  kwa:"「くわ・ぐわ」は「か・が」に直す。|「くわ・ぐわ」 become 「か・が」.|「くわ・ぐわ」改成「か・が」。"};
const RSHORT={ha:"ハ行→ワ行|「は」-row → 「わ」-row|「は」行→「わ」行",wo:"ゐ・ゑ・を→い・え・お|「ゐ・ゑ・を」 → 「い・え・お」|「ゐ・ゑ・を」→「い・え・お」",dz:"ぢ・づ→じ・ず|「ぢ・づ」 → 「じ・ず」|「ぢ・づ」→「じ・ず」",
  au:"au→ô|au → ô|au→ô",iu:"iu→yû|iu → yû|iu→yû",eu:"eu→yô|eu → yô|eu→yô",kwa:"くわ→か|「くわ」 → 「か」|「くわ」→「か」"};
const RNAME={ha:"語中・語尾のハ行→ワ行|「は・ひ・ふ・へ・ほ」 → 「わ・い・う・え・お」|詞中、詞尾的「は」行→「わ」行",wo:"ゐ・ゑ・を→い・え・お|「ゐ・ゑ・を」 → 「い・え・お」|「ゐ・ゑ・を」→「い・え・お」",dz:"ぢ・づ→じ・ず|「ぢ・づ」 → 「じ・ず」|「ぢ・づ」→「じ・ず」",
  au:"あう（au）→おう（ô）|au → ô|「あう」（au）→「おう」（ô）",iu:"いう（iu）→ゆう（yû）|iu → yû|「いう」（iu）→「ゆう」（yû）",eu:"えう（eu）→よう（yô）|eu → yô|「えう」（eu）→「よう」（yô）",kwa:"くわ・ぐわ→か・が|「くわ・ぐわ」 → 「か・が」|「くわ・ぐわ」→「か・が」"};
// [歴史的仮名遣い, 現代仮名遣い, まちがえやすい書き×3, きまり, ひとこと?]
const KANA=[
  ["いふ","いう",["いぶ","ゆう","いお"],["ha"],"「言う」は今も「いう」と書く（「ゆう」とは書かない）。|「言う」 is still written 「いう」, not 「ゆう」.|「言う」現在也寫成「いう」，不寫「ゆう」。"],
  ["いはく","いわく",["いはく","いあく","いかく"],["ha"]],["かほ","かお",["かほ","かよ","かを"],["ha"]],["あはれ","あわれ",["あはれ","あばれ","あいれ"],["ha"]],
  ["おもふ","おもう",["おもふ","おもお","おもゆ"],["ha"]],["なほ","なお",["なほ","なを","なよ"],["ha"]],["たまふ","たまう",["たまふ","たまお","たまゆ"],["ha"]],
  ["いへ","いえ",["いへ","いべ","いい"],["ha"]],["こひ","こい",["こひ","こび","こえ"],["ha"]],["にほひ","におい",["にほひ","におひ","にほい"],["ha"]],
  ["うるはし","うるわし",["うるはし","うるあし","うるばし"],["ha"]],["まへ","まえ",["まへ","まべ","まい"],["ha"]],
  ["をかし","おかし",["をかし","わかし","うかし"],["wo"]],["をとこ","おとこ",["をとこ","わとこ","うとこ"],["wo"]],["ゐなか","いなか",["ゐなか","うなか","ひなか"],["wo"]],
  ["ゐる","いる",["ゐる","うる","える"],["wo"]],["こゑ","こえ",["こゑ","こへ","こい"],["wo"]],
  ["もみぢ","もみじ",["もみぢ","もみち","もみぎ"],["dz"]],["よろづ","よろず",["よろづ","よろつ","よろす"],["dz"]],
  ["はぢ","はじ",["はぢ","わじ","わぢ"],["dz"],"語頭の「は」はそのまま。|A 「は」 at the start of a word stays as it is.|詞首的「は」不改。"],
  ["くわし","かし",["くわし","くし","こわし"],["kwa"],"「菓子」のこと。|It means 「菓子」 (sweets).|指「菓子」（點心）。"],
  ["かはづ","かわず",["かはづ","かわづ","かはず"],["ha","dz"]],
  ["やうやう","ようよう",["やうやう","やおやお","ようやう"],["au"]],["まうす","もうす",["まうす","まおす","もおす"],["au"]],
  ["かうべ","こうべ",["かうべ","かおべ","こおべ"],["au"],"「頭」のこと。|It means 「頭」 (head).|指「頭」。"],
  ["さうらふ","そうろう",["さうらふ","そうらう","そうらふ"],["ha","au"]],
  ["うつくしう","うつくしゅう",["うつくしう","うつくしゆう","うつくしょう"],["iu"]],["きうり","きゅうり",["きうり","きょうり","きゆうり"],["iu"]],
  ["けふ","きょう",["けふ","けう","きゅう"],["ha","eu"],"「今日」のこと。|It means 「今日」 (today).|指「今日」（今天）。"],
  ["てふてふ","ちょうちょう",["てふてふ","てうてう","ちゅうちゅう"],["ha","eu"]],
  ["あふぎ","おうぎ",["あふぎ","あうぎ","おおぎ"],["ha","au"],"「扇」のこと。|It means 「扇」 (folding fan).|指「扇」（扇子）。"],
];
const kexp=r=>r[3].map(k=>X(RULE[k])).join(" ")+(r[4]?" "+X(r[4]):"");
const kanaQ=KANA.map(r=>()=>{ const [a,b,ws]=r,q=X(`「${a}」を現代仮名遣いに直すと？|Rewrite 「${a}」 in modern kana spelling.|把「${a}」改成現代假名拼法。`);
  return {q,ans:b,wrongs:ws.map(v=>({v,why:X(`「${v}」ではなく「${b}」。|Not 「${v}」 but 「${b}」.|不是「${v}」，是「${b}」。`)+" "+kexp(r)})),exp:kexp(r),tf:v=>`${q}<br>→ ${v}`,kind:"word"}; });
const ruleQ=KANA.filter(r=>r[3].length===1).map(r=>()=>{ const [a,b]=r,k=r[3][0],q=X(`「${a}」→「${b}」のように直すきまりは？|Which rule turns 「${a}」 into 「${b}」?|把「${a}」改成「${b}」是根據哪一條規則？`);
  return {q,ans:X(RNAME[k]),wrongs:shuf(Object.keys(RULE).filter(x=>x!==k)).slice(0,3).map(x=>({v:X(RNAME[x]),why:X(RULE[x])})),exp:X(RULE[k]),tf:v=>`${q}<br>→ ${v}`,kind:"word"}; });

// 古語：[古語, 意味(3言語), ひとこと?]
const KOGO=[
  ["いと","とても・たいそう|very|非常、很"],
  ["うつくし","かわいらしい|lovely; sweet|可愛","今の「美しい」とは意味がちがう。|Not the same as modern 「美しい」 (beautiful).|和現代的「美しい」（美麗）意思不同。"],
  ["あやし","不思議だ|strange; mysterious|奇怪、不可思議"],
  ["をかし","趣がある・興味深い|charming; interesting|有情趣、有趣","『枕草子』によく出てくることば。|Often used in 「枕草子」.|《枕草子》中常見的詞。"],
  ["あはれ","しみじみとした趣がある|deeply moving|深有感觸、令人感動"],
  ["いみじ","（よくも悪くも）程度がはなはだしい|extreme (good or bad)|非常、極其（好壞皆可）"],
  ["つとめて","早朝|early morning|清晨"],
  ["ゆかし","見たい・聞きたい・知りたい|to want to see, hear or know|想看、想聽、想知道"],
  ["よろづ","いろいろ・さまざま|all sorts of; many|各種各樣"],
  ["ありがたし","めったにない|rare; hard to find|難得、少有","今の「ありがとう」のもとになったことば。|The root of modern 「ありがとう」.|是現代「ありがとう」的由來。"],
  ["いとほし","気の毒だ|pitiful; sad to see|令人同情"],
  ["おどろく","はっと気がつく・目を覚ます|to notice suddenly; to wake up|突然察覺、醒來"],
  ["めでたし","すばらしい・りっぱだ|splendid|出色、了不起"],
  ["としごろ","長年|for many years|多年來"],
];
const kogo=TB(KOGO,"古語「{a}」の意味は？|What does the classical word 「{a}」 mean?|古語「{a}」是什麼意思？","「{b}」という意味の古語は？|Which classical word means \"{b}\"?|意思是「{b}」的古語是？","「{a}」は「{b}」という意味。|「{a}」 means \"{b}\".|「{a}」是「{b}」的意思。");

// 作品：[作品名(3言語), 作者(3言語) or null, 書き出し]
const SAKU=[
  ["『竹取物語』|「竹取物語」 (The Tale of the Bamboo Cutter)|《竹取物語》",null,"今は昔、竹取の翁といふものありけり。"],
  ["『枕草子』|「枕草子」 (The Pillow Book)|《枕草子》","清少納言|Sei Shonagon|清少納言","春はあけぼの。"],
  ["『源氏物語』|「源氏物語」 (The Tale of Genji)|《源氏物語》","紫式部|Murasaki Shikibu|紫式部","いづれの御時にか、女御、更衣あまたさぶらひたまひける中に"],
  ["『土佐日記』|「土佐日記」 (The Tosa Diary)|《土佐日記》","紀貫之|Ki no Tsurayuki|紀貫之","男もすなる日記といふものを、女もしてみむとてするなり。"],
  ["『平家物語』|「平家物語」 (The Tale of the Heike)|《平家物語》",null,"祇園精舎の鐘の声、諸行無常の響きあり。"],
  ["『方丈記』|「方丈記」 (Hojoki)|《方丈記》","鴨長明|Kamo no Chomei|鴨長明","ゆく河の流れは絶えずして、しかももとの水にあらず。"],
  ["『徒然草』|「徒然草」 (Essays in Idleness)|《徒然草》","兼好法師|Kenko|兼好法師","つれづれなるままに、日暮らし、硯にむかひて"],
  ["『おくのほそ道』|「おくのほそ道」 (The Narrow Road to the Deep North)|《奧之細道》","松尾芭蕉|Matsuo Basho|松尾芭蕉","月日は百代の過客にして、行きかふ年もまた旅人なり。"],
];
const sakuOpen=TB(SAKU.map(r=>[r[2],r[0]]),"「{a}」という書き出しの作品は？|Which work begins 「{a}」?|以「{a}」開頭的作品是？",null,"「{a}」は{b}の書き出し。|「{a}」 is the opening of {b}.|「{a}」是{b}的開頭。");
const sakuAuth=TB(SAKU.filter(r=>r[1]).map(r=>[r[0],r[1]]),"{a}の作者は？|Who wrote {a}?|{a}的作者是？","{b}が書いた作品は？|Which work did {b} write?|{b}寫的作品是？","{a}の作者は{b}。|{a} was written by {b}.|{a}的作者是{b}。");
const T_TK=X(SAKU[0][0]),T_GJ=X(SAKU[2][0]),T_HK=X(SAKU[4][0]),T_TS=X(SAKU[3][0]),T_MK=X(SAKU[1][0]),T_HJ=X(SAKU[5][0]),T_TZ=X(SAKU[6][0]);
const sakuQ=[
  Q("日本の三大随筆に入らないものは？|Which is NOT one of the three great essay collections (zuihitsu) of Japan?|下面哪一部不屬於日本三大隨筆？",SAKU[0][0],
    [[SAKU[1][0],`${T_MK}は清少納言の随筆。三大随筆の一つ。|${T_MK} is Sei Shonagon's essay collection, one of the three.|${T_MK}是清少納言的隨筆，三大隨筆之一。`],[SAKU[5][0],`${T_HJ}は鴨長明の随筆。三大随筆の一つ。|${T_HJ} is Kamo no Chomei's essay, one of the three.|${T_HJ}是鴨長明的隨筆，三大隨筆之一。`],[SAKU[6][0],`${T_TZ}は兼好法師の随筆。三大随筆の一つ。|${T_TZ} is Kenko's essay collection, one of the three.|${T_TZ}是兼好法師的隨筆，三大隨筆之一。`]],
    `${T_TK}は物語。三大随筆は${T_MK}・${T_HJ}・${T_TZ}。|${T_TK} is a tale. The three essays are ${T_MK}, ${T_HJ} and ${T_TZ}.|${T_TK}是物語。三大隨筆是${T_MK}、${T_HJ}、${T_TZ}。`),
  Q("現存する日本最古の物語といわれる作品は？|Which work is said to be the oldest surviving Japanese tale (monogatari)?|據說是現存最古老的日本物語的作品是？",SAKU[0][0],
    [[SAKU[2][0],`${T_GJ}は平安時代中ごろの、紫式部の長い物語。|${T_GJ} is Murasaki Shikibu's long tale from the mid-Heian period.|${T_GJ}是平安時代中期紫式部的長篇物語。`],[SAKU[4][0],`${T_HK}は鎌倉時代の軍記物語。|${T_HK} is a war tale from the Kamakura period.|${T_HK}是鎌倉時代的軍記物語。`],[SAKU[3][0],`${T_TS}は紀貫之の日記。|${T_TS} is Ki no Tsurayuki's diary.|${T_TS}是紀貫之的日記。`]],
    `${T_TK}は平安時代のはじめごろにできた、作者のわからない物語。|${T_TK} is an early Heian tale by an unknown author.|${T_TK}是平安時代初期、作者不詳的物語。`),
  Q("『平家物語』を語り伝えたのは？|Who told and passed on 「平家物語」?|將《平家物語》說唱流傳下來的是？","琵琶法師|biwa hoshi (blind monks playing the biwa lute)|琵琶法師",
    [["清少納言|Sei Shonagon|清少納言",`清少納言は${T_MK}の作者。|Sei Shonagon wrote ${T_MK}.|清少納言是${T_MK}的作者。`],["紀貫之|Ki no Tsurayuki|紀貫之",`紀貫之は${T_TS}の作者。|Ki no Tsurayuki wrote ${T_TS}.|紀貫之是${T_TS}的作者。`],["松尾芭蕉|Matsuo Basho|松尾芭蕉","松尾芭蕉は江戸時代の俳人。|Matsuo Basho was an Edo-period haiku poet.|松尾芭蕉是江戶時代的俳句詩人。"]],
    "琵琶法師が琵琶をひきながら語り、広まった。|Biwa hoshi recited it while playing the biwa, and it spread.|琵琶法師一邊彈琵琶一邊說唱，因而流傳。"),
  Q("「諸行無常」の意味は？|What does 「諸行無常」 mean?|「諸行無常」是什麼意思？","すべてのものは移り変わり、いつまでも同じものはない|everything changes; nothing stays the same forever|萬物都在變化，沒有永恆不變的東西",
    [["すべてのものは、いつまでも変わらない|everything stays the same forever|萬物永遠不變","反対の意味。|That is the opposite.|意思正好相反。"],["よい行いをすれば、よい報いがある|good deeds bring good rewards|做好事會有好報","それは「因果応報」に近い考え。|That is closer to 「因果応報」 (karma).|那比較接近「因果報應」。"],["強い者が必ず勝つ|the strong always win|強者必勝","『平家物語』は、勢いのある者もいつかはほろびると語る。|「平家物語」 says even the powerful fall in the end.|《平家物語》說的是強盛者終將衰亡。"]],
    "『平家物語』の書き出しにある仏教のことば。|A Buddhist phrase from the opening of 「平家物語」.|出自《平家物語》開頭的佛教用語。"),
  Q("「竹取の翁」の「翁」の意味は？|What does 「翁」 in 「竹取の翁」 mean?|「竹取の翁」的「翁」是什麼意思？","おじいさん|old man|老爺爺",
    [["おばあさん|old woman|老奶奶","おばあさんは「媼（おうな）」。|An old woman is 「媼（おうな）」.|老奶奶是「媼（おうな）」。"],["若者|young man|年輕人","「翁」は年をとった男の人。|「翁」 is an elderly man.|「翁」是年老的男人。"],["子ども|child|小孩","「翁」は年をとった男の人。|「翁」 is an elderly man.|「翁」是年老的男人。"]],
    "竹を取って、いろいろな物を作っていたおじいさん。|An old man who cut bamboo and made things from it.|砍竹子做各種東西的老爺爺。"),
  Q("「竹取の翁といふものありけり」の意味は？|What does 「竹取の翁といふものありけり」 mean?|「竹取の翁といふものありけり」是什麼意思？","竹取の翁という者がいた|there once was a man called the bamboo cutter|從前有個叫竹取翁的人",
    [["竹取の翁という者はいなかった|there was no man called the bamboo cutter|沒有叫竹取翁的人","「ありけり」は「いた」。打ち消しではない。|「ありけり」 means \"there was\"; it is not negative.|「ありけり」是「有過」的意思，不是否定。"],["竹取の翁になりたかった|someone wanted to be the bamboo cutter|想成為竹取翁","「ありけり」は「いた」。|「ありけり」 means \"there was\".|「ありけり」是「有過」的意思。"],["竹取の翁と言った|someone said \"bamboo cutter\"|說了竹取翁","「いふ」は「という」の意味で使われている。|Here 「いふ」 means \"called\".|這裡的「いふ」是「叫做」的意思。"]],
    "「けり」は「〜た（そうだ）」と、昔のことを伝える。|「けり」 tells of the past: \"there was (they say)\".|「けり」表示傳述過去的事：「（據說）曾經…」。"),
  Q("「もと光る竹なむ一筋ありける」の「もと光る」の意味は？|In 「もと光る竹なむ一筋ありける」, what does 「もと光る」 mean?|「もと光る竹なむ一筋ありける」中的「もと光る」是什麼意思？","根もとが光る|glowing at the base|根部發光",
    [["もともと光っている|always glowing|本來就在發光","「もと」は「根もと」のこと。|「もと」 here means \"the base\".|「もと」是「根部」的意思。"],["元気に光る|glowing brightly|有精神地發光","「もと」は「根もと」のこと。|「もと」 here means \"the base\".|「もと」是「根部」的意思。"],["もう一度光る|glowing again|再發光一次","「もと」は「根もと」のこと。|「もと」 here means \"the base\".|「もと」是「根部」的意思。"]],
    "根もとが光る竹が一本あった、という場面。|There was one bamboo stalk glowing at its base.|有一根竹子的根部在發光。"),
  Q("竹の中にいた女の子の大きさは？|How big was the girl found inside the bamboo?|在竹子裡發現的女孩有多大？","三寸（約9cm）ほど|about three sun (about 9 cm)|約三寸（約9公分）",
    [["三尺（約90cm）ほど|about three shaku (about 90 cm)|約三尺（約90公分）","本文は「三寸ばかりなる人」。尺ではない。|The text says 「三寸ばかりなる人」, not shaku.|原文是「三寸ばかりなる人」，不是尺。"],["一寸（約3cm）ほど|about one sun (about 3 cm)|約一寸（約3公分）","本文は「三寸ばかりなる人」。|The text says 「三寸ばかりなる人」.|原文是「三寸ばかりなる人」。"],["翁より大きい|bigger than the old man|比老爺爺還大","本文は「三寸ばかりなる人」。とても小さい。|The text says 「三寸ばかりなる人」: very small.|原文是「三寸ばかりなる人」，非常小。"]],
    "「三寸ばかりなる人、いとうつくしうてゐたり」。一寸は約3cm。|「三寸ばかりなる人、いとうつくしうてゐたり」. One sun is about 3 cm.|「三寸ばかりなる人、いとうつくしうてゐたり」。一寸約3公分。"),
  Q("かぐや姫が最後に帰っていったのは？|Where did Kaguya-hime finally return to?|輝夜姬最後回到了哪裡？","月の都|the capital on the moon|月亮上的都城",
    [["竜宮城|the Dragon Palace|龍宮","竜宮城は「浦島太郎」に出てくる。|The Dragon Palace is from 「浦島太郎」.|龍宮出自《浦島太郎》。"],["鬼ヶ島|Onigashima (ogre island)|鬼島","鬼ヶ島は「桃太郎」に出てくる。|Onigashima is from 「桃太郎」.|鬼島出自《桃太郎》。"],["海の向こうの国|a land across the sea|大海另一邊的國家","かぐや姫は月の世界の人だった。|Kaguya-hime came from the moon.|輝夜姬是月亮世界的人。"]],
    "かぐや姫は月の世界の人で、最後は月からの迎えとともに帰っていく。|She was from the moon and left with those who came to take her back.|輝夜姬是月亮世界的人，最後隨著來接她的人回到月亮。"),
];
const c1=[...kanaQ,...ruleQ], c2=kogo, c3=[...sakuOpen,...sakuAuth,...sakuQ];
