/* ========== 語句（ことわざ・慣用句・故事成語・四字熟語） ==========
   表：[語句（日本語のみ）, 意味(3言語), ひとこと(3言語)?]。同じ意味の語句（例：猿も木から落ちる／弘法にも筆の誤り）は同じ表に入れない（答えが2つになるため） */
const KOTO=[
  ["猫に小判","価値のわからない人に貴重なものを与えても役に立たない|something valuable is wasted on someone who can't appreciate it|再珍貴的東西，給不懂價值的人也沒用"],
  ["猿も木から落ちる","その道の名人でも、ときには失敗する|even experts sometimes make mistakes|再厲害的高手也會失手"],
  ["石の上にも三年","つらくてもがまんして続ければ、いつかは報われる|patience and persistence pay off in the end|只要堅持忍耐，終會有回報"],
  ["急がば回れ","急ぐときほど、安全で確実な方法をとるほうが結局早い|when in a hurry, the safe, sure way is faster in the end|越急越要走穩當的路，結果反而比較快"],
  ["塵も積もれば山となる","わずかなものでも、積み重なれば大きなものになる|little things add up to something big|積少成多"],
  ["二兎を追う者は一兎をも得ず","同時に二つのことをしようとすると、どちらもうまくいかない|chase two hares and you catch neither|同時追求兩件事，結果一件也做不成"],
  ["情けは人のためならず","人に親切にすれば、めぐりめぐって自分によい報いがある|kindness to others comes back to you in the end|對人好，終究會回報到自己身上","「親切にするとその人のためにならない」という意味ではない。|It does not mean \"kindness spoils people.\"|不是「同情別人反而害了他」的意思。"],
  ["転ばぬ先の杖","失敗しないように、前もって用心しておく|take precautions before things go wrong|未雨綢繆，事先做好防備"],
  ["百聞は一見にしかず","何度も聞くより、一度自分の目で見るほうがよくわかる|seeing once is better than hearing a hundred times|百聞不如一見"],
  ["能ある鷹は爪を隠す","本当に実力のある人は、それをむやみに見せびらかさない|truly able people don't show off|真正有本事的人不會隨便炫耀"],
  ["灯台下暗し","身近なことは、かえって気づきにくい|what is closest to you is often hardest to notice|越近的事越不容易察覺"],
  ["焼け石に水","少しばかりの助けでは、ほとんど効き目がない|too little help to make any difference|杯水車薪，幫助太少沒有效果"],
  ["案ずるより産むがやすし","心配していたことも、実際にやってみると意外にたやすい|things are easier to do than to worry about|事情做起來往往比擔心的容易"],
  ["良薬は口に苦し","ためになる忠告ほど、聞くのはつらい|good advice is hard to hear|良藥苦口，忠言逆耳"],
  ["泣き面に蜂","悪いことの上に、さらに悪いことが重なる|one misfortune on top of another|禍不單行"],
  ["果報は寝て待て","幸運は、あせらずに時機が来るのを待つのがよい|good luck comes to those who wait|好運要耐心等待"],
  ["のれんに腕押し","手ごたえがなく、張り合いがない|like pushing a curtain: no response at all|白費力氣，毫無反應"],
  ["腐っても鯛","すぐれたものは、いたんでもそれなりの値打ちがある|something truly good keeps its value even when worn|好東西即使變舊也仍有價值"],
];
const KANYO=[
  ["顔が広い","知り合いが多い|to know a lot of people|交遊廣闊"],
  ["手を焼く","扱いに困る|to have a hard time dealing with something|感到棘手"],
  ["耳が痛い","自分の弱点を言われて、聞くのがつらい|it hurts to hear (because it is true of you)|被說中缺點，聽了刺耳"],
  ["鼻が高い","得意で、誇らしい|to be proud|得意、驕傲"],
  ["口が軽い","言ってはいけないことを、すぐ人に話してしまう|can't keep a secret|嘴不牢，守不住秘密"],
  ["目がない","とても好きである|to love; to have a weakness for|非常喜歡"],
  ["足が出る","予定より多くお金を使ってしまう|to go over budget|超出預算"],
  ["肩を持つ","味方をする|to take someone's side|偏袒、站在某人那邊"],
  ["首を長くする","今か今かと待ちこがれる|to wait eagerly|引頸期盼"],
  ["舌を巻く","とても感心する、驚く|to be amazed|讚嘆不已"],
  ["腹を割る","本心を打ち明ける|to speak frankly; to open up|推心置腹，說出真心話"],
  ["歯が立たない","相手が強すぎて、とてもかなわない|to be no match for|完全不是對手"],
  ["骨が折れる","苦労する、手間がかかる|to take a lot of effort|費力、費工夫"],
  ["猫の額","場所がとても狭い|a tiny space|地方非常窄小"],
  ["油を売る","仕事の途中でむだ話などをして、なまける|to slack off by chatting|工作中閒聊偷懶"],
  ["さじを投げる","見込みがないと、あきらめる|to give up as hopeless|認為沒希望而放棄"],
  ["気が置けない","遠慮しなくてよく、気楽につき合える|easy to be around; no need to be formal|彼此不必客氣，相處輕鬆","「油断できない」という意味ではない。|It does not mean \"can't be trusted.\"|不是「不能大意」的意思。"],
  ["二の足を踏む","思い切れずに、ためらう|to hesitate|猶豫不決"],
  ["水に流す","過去のことを、なかったことにする|to let bygones be bygones|既往不咎"],
];
const KOJI=[
  ["矛盾","つじつまが合わないこと|a contradiction|前後不一致","「どんな盾も突き通す矛」と「どんな矛も防ぐ盾」を売った楚の人の話から（『韓非子』）。|From the man of Chu who sold a spear that could pierce any shield and a shield no spear could pierce (Han Feizi).|出自《韓非子》楚人賣矛與盾的故事。"],
  ["蛇足","よけいな付け足し|an unnecessary addition|多餘的東西","蛇の絵に足までかいて、酒を飲みそこねた人の話から。|From the man who drew legs on a snake and lost the wine.|出自畫蛇添足的故事。"],
  ["五十歩百歩","少しのちがいはあっても、本質的には同じ|there is little real difference|半斤八兩，本質上沒有差別","戦場で五十歩逃げた兵が、百歩逃げた兵を笑った話から（『孟子』）。|From the soldier who ran fifty steps and laughed at one who ran a hundred (Mencius).|出自《孟子》五十步笑百步。"],
  ["漁夫の利","二者が争っているすきに、第三者が利益を横取りする|a third party profits while two others fight|漁翁得利"],
  ["背水の陣","あとがない状況で、決死の覚悟で物事に当たる|an all-out effort with no way back|背水一戰"],
  ["推敲","文章や詩を何度も練り直す|to polish one's writing again and again|反覆修改文章","唐の詩人が「推す」と「敲く」のどちらにするか迷った話から。|From a Tang poet who could not decide between \"push\" and \"knock\" in a line.|出自唐代詩人賈島斟酌「推」「敲」的故事。"],
  ["杞憂","必要のない心配。取り越し苦労|needless worry|杞人憂天，不必要的擔心"],
  ["塞翁が馬","人生の幸不幸は予測できない|fortune and misfortune are hard to predict|塞翁失馬，焉知非福"],
  ["呉越同舟","仲の悪い者どうしが、同じ場所に居合わせる|enemies in the same boat|吳越同舟，敵對的人同處一地"],
  ["四面楚歌","周りが敵ばかりで、助けがなく孤立する|surrounded by enemies on all sides|四面楚歌，孤立無援"],
  ["守株","古いやり方やたまたまの成功にこだわって、進歩がない|clinging to old ways and waiting for luck to repeat|守株待兔，墨守成規"],
  ["画竜点睛","物事を完成させる、最後の大事な仕上げ|the finishing touch|畫龍點睛"],
  ["臥薪嘗胆","目的を果たすために、長い間苦労に耐える|enduring hardship for a long time to reach a goal|臥薪嘗膽"],
  ["覆水盆に返らず","一度してしまったことは、取り返しがつかない|what's done cannot be undone|覆水難收"],
];
const YOJI=[
  ["一石二鳥","一つのことをして、二つの利益を得る|two birds with one stone|一舉兩得"],
  ["異口同音","多くの人が、口をそろえて同じことを言う|many people saying the same thing|異口同聲"],
  ["以心伝心","言葉にしなくても、気持ちが通じ合う|understanding each other without words|心照不宣，心有靈犀"],
  ["自業自得","自分のした行いの報いを、自分が受ける|you reap what you sow|自作自受"],
  ["十人十色","考えや好みは、人によってちがう|everyone has different tastes and ideas|人各不同，各有所好"],
  ["一期一会","一生に一度の出会いだと思って大切にする|treasure each meeting, as it may never come again|一期一會，珍惜每次相遇"],
  ["危機一髪","ひとつまちがえば危険なことになる、せとぎわ|a narrow escape; by a hair|千鈞一髮"],
  ["右往左往","うろたえて、あちこち動き回る|running around in confusion|手忙腳亂，東奔西竄"],
  ["半信半疑","半分信じ、半分疑う|half believing, half doubting|半信半疑"],
  ["単刀直入","前置きなしに、いきなり本題に入る|getting straight to the point|開門見山，單刀直入"],
  ["一朝一夕","わずかな期間|in a short time; overnight|一朝一夕，短時間"],
  ["付和雷同","自分の考えを持たず、すぐ他人の意見に従う|going along with others without thinking|隨聲附和"],
  ["大器晩成","すぐれた人物は、遅れて大成する|great talents mature late|大器晚成"],
  ["適材適所","その人の能力に合った地位や仕事につける|the right person in the right place|人盡其才，適才適所"],
  ["絶体絶命","どうにもならない、追いつめられた状態|a desperate situation with no way out|走投無路，陷入絕境"],
  ["五里霧中","手がかりがなく、どうしてよいかわからない|completely lost; as if in a fog|摸不著頭緒，如墜五里霧中"],
];
const GQ=k=>[`「{a}」の意味は？|What does 「{a}」 mean?|「{a}」是什麼意思？`,`「{b}」という意味の${k[0]}は？|Which ${k[1]} means "{b}"?|意思是「{b}」的${k[2]}是？`,`「{a}」は「{b}」という意味。|「{a}」 means "{b}".|「{a}」是「{b}」的意思。`];
const GK={koto:["ことわざ","proverb","諺語"],kanyo:["慣用句","idiom","慣用語"],koji:["故事成語","idiom from a Chinese story","典故成語"],yoji:["四字熟語","four-character idiom","四字成語"]};
// 四字熟語の書き：[正しい書き, 読み, まちがえやすい書き×3, 手がかり(3言語)]
const YOJIW=[
  ["異口同音","いくどうおん",["異句同音","異口同意","意口同音"],"「異口」は「異なる口」＝多くの人の口。|「異口」 = many different mouths.|「異口」＝許多不同的嘴。"],
  ["絶体絶命","ぜったいぜつめい",["絶対絶命","絶体絶名","絶大絶命"],"「絶体」は体がきわまること。「絶対」ではない。|It is 「絶体」 (the body at its limit), not 「絶対」.|是「絶体」（身體走投無路），不是「絶対」。"],
  ["危機一髪","ききいっぱつ",["危機一発","危期一髪","機危一髪"],"「一髪」は髪の毛一本ほどのわずかな差。|「一髪」 = the width of a single hair.|「一髪」＝一根頭髮那麼小的差距。"],
  ["五里霧中","ごりむちゅう",["五里夢中","五理霧中","誤里霧中"],"「霧」の中で方向がわからないこと。「夢」ではない。|It is 「霧」 (fog), not 「夢」 (dream).|是「霧」，不是「夢」。"],
  ["単刀直入","たんとうちょくにゅう",["短刀直入","単刀直人","担刀直入"],"「単刀」は一本の刀で切りこむこと。|「単刀」 = charging in with a single sword.|「単刀」＝單槍匹馬拿一把刀衝進去。"],
  ["意味深長","いみしんちょう",["意味深重","意味慎重","異味深長"],"「深長」は奥深いこと。|「深長」 = deep and profound.|「深長」＝深奧。"],
  ["心機一転","しんきいってん",["心気一転","新機一転","心機一点"],"「心機」は心の動き。|「心機」 = the workings of the heart.|「心機」＝心思。"],
  ["自画自賛","じがじさん",["自我自賛","字画自賛","自画自参"],"自分でかいた絵（画）を自分でほめる（賛）。|Praising 「賛」 a picture 「画」 you drew yourself.|自己稱讚（賛）自己畫的畫（画）。"],
];
const yojiW=YOJIW.map(([w,r,ws,tip])=>()=>{ const q=X(`「${r}」を漢字で書くと？|Which is the correct way to write 「${r}」?|「${r}」的正確漢字是？`);
  return {q,ans:w,wrongs:ws.map(v=>({v,why:X(`「${v}」は誤り。|「${v}」 is wrong.|「${v}」是錯的。`)+" "+X(tip)})),exp:X(tip),tf:v=>`${q}<br>→ ${v}`,kind:"word"}; });
const g1=TB(KOTO,...GQ(GK.koto)), g2=TB(KANYO,...GQ(GK.kanyo)), g3=TB(KOJI,...GQ(GK.koji)), g4=[...TB(YOJI,...GQ(GK.yoji)),...yojiW];
