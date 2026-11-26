/* 45 Study 国語（tools/build.py が src/jpn/*.js から作る。直接編集しない） */
/* 45 Study 国語：問題をその場で作る。tools/build.py が src/jpn/*.js をつなげて jpn.js を作る。
   単元の並び：中学校学習指導要領（平成29年告示）国語 第1学年〔知識及び技能〕(1) 言葉の特徴や使い方（漢字・語彙・文法）、(3) 我が国の言語文化（古典）。
   教科書の文章は使わない。古典の冒頭文は作品そのもの（著作権の保護期間外）から短く引く。
   ことば：文は "日本語|English|繁體中文" の3つを | でつなげて書き、X() で今の言語を取り出す。| のない文（日本語の語句そのもの）はどの言語でもそのまま出る。
   英語・繁体字の文では、日本語の語句を必ず「」でかこむ（テストで「」の外にかなが残っていないかを確かめる）。
   gen() が返すもの：{ q:問題, ans:答え, wrongs:[{v,why}], exp:解き方, tf:v=>○×の文, kind } （SCI・SOC と同じ形） */
const JPN=(()=>{
const LG=(()=>{ let l=null; try{ l=JSON.parse(localStorage.getItem("s_lang")); }catch(e){} if(!l){ const n=(navigator.language||"ja").toLowerCase(); l=n.startsWith("zh")?"zh":n.startsWith("ja")?"ja":"en"; } return {ja:0,en:1,"zh-Hant":2,zh:2}[l]??1; })();
const X=s=>{ if(typeof s!=="string") return s; const a=s.split("|"); return a.length===3?a[LG]:s; };
const R=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const LET="ABCDEF";
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
/* ========== 漢字 ========== */
// 読み：[語, 読み, [まちがえやすい読み×3], 手がかり（漢字ごとの読み。言語によらない）, ひとこと?]
const YOMI=[
  ["雰囲気","ふんいき",["ふいんき","ふんいけ","ぶんいき"],"雰（ふん）・囲（い）・気（き）","「ふいんき」は言いまちがえ。|「ふいんき」 is a common mispronunciation.|「ふいんき」是常見的錯誤念法。"],
  ["拍手","はくしゅ",["はくて","はくじゅ","ひょうしゅ"],"拍（はく）・手（しゅ）"],
  ["貢献","こうけん",["こうこん","くけん","こうげん"],"貢（こう）・献（けん）"],
  ["把握","はあく",["はおく","はやく","ばあく"],"把（は）・握（あく）"],
  ["披露","ひろう",["ひろ","はろう","ひろく"],"披（ひ）・露（ろう）"],
  ["抑揚","よくよう",["よくしょう","おくよう","よくあげ"],"抑（よく）・揚（よう）"],
  ["循環","じゅんかん",["じゅんけん","しゅんかん","じゅんえん"],"循（じゅん）・環（かん）"],
  ["克服","こくふく",["こくぶく","かつふく","こくふ"],"克（こく）・服（ふく）"],
  ["匿名","とくめい",["じゃくめい","とくみょう","にくめい"],"匿（とく）・名（めい）"],
  ["渋滞","じゅうたい",["しゅうたい","じゅうてい","しぶたい"],"渋（じゅう）・滞（たい）"],
  ["頻繁","ひんぱん",["ひんばん","びんぱん","ひんはん"],"頻（ひん）・繁（ぱん）"],
  ["奨励","しょうれい",["しょうりょく","そうれい","しょうらい"],"奨（しょう）・励（れい）"],
  ["境内","けいだい",["きょうない","けいない","さかいうち"],"境（けい）・内（だい）","寺や神社の敷地のこと。特別な読み方に注意。|The grounds of a temple or shrine. Note the unusual reading.|指寺廟或神社的境地。注意特別的念法。"],
  ["会釈","えしゃく",["かいしゃく","えしゃっく","かいせき"],"会（え）・釈（しゃく）","軽く頭を下げてあいさつすること。|A slight bow.|輕輕點頭致意。"],
  ["促す","うながす",["うなかす","そくす","もよおす"],"促（うなが）す"],
  ["偏る","かたよる",["かたむる","へんる","かたぶる"],"偏（かたよ）る"],
  ["潤う","うるおう",["うるう","じゅんう","うるむう"],"潤（うるお）う"],
  ["鮮やか","あざやか",["あさやか","せんやか","あでやか"],"鮮（あざ）やか"],
  ["繕う","つくろう",["つぐなう","なおう","ぜんう"],"繕（つくろ）う"],
  ["携わる","たずさわる",["たずさえる","けいわる","さずかわる"],"携（たずさ）わる","「たずさえる」なら送りがなは「える」（携える）。|「たずさえる」 would be written 「携える」.|「たずさえる」要寫成「携える」。"],
  ["培う","つちかう",["やしなう","ばいう","つちくう"],"培（つちか）う"],
  ["漂う","ただよう",["ひょうう","ただう","さまよう"],"漂（ただよ）う"],
  ["慎む","つつしむ",["しんむ","つつむ","いつくしむ"],"慎（つつし）む"],
  ["承る","うけたまわる",["うけまわる","しょうる","うけたまる"],"承（うけたまわ）る"],
  ["著しい","いちじるしい",["ちょしい","あらわしい","いちじしい"],"著（いちじる）しい"],
  ["遂げる","とげる",["ついげる","すいげる","とうげる"],"遂（と）げる"],
];
const yomiQ=YOMI.map(([w,r,ws,tp,note])=>()=>{ const tip=`「${tp}」`; const q=X(`「${w}」の読みは？|How is 「${w}」 read?|「${w}」怎麼念？`);
  const nt=note?" "+X(note):"";
  return {q,ans:r,wrongs:ws.map(v=>({v,why:X(`「${v}」ではなく「${r}」と読みます。|It is read 「${r}」, not 「${v}」.|要念「${r}」，不是「${v}」。`)+" "+tip+nt})),
    exp:tip+nt,tf:v=>`${q}<br>→ ${v}`,kind:"word"}; });

/* 同音異義語・同訓異字：グループ＝[[漢字, 意味(3言語)]…]、文＝[文（（ ）に読み）, 正しい漢字の番号, 送りがな?] */
function HG(groups){ const out=[];
  for(const [opts,sents] of groups) for(const [s,k,ok] of sents) out.push(()=>{ const suf=ok||"",ans=opts[k][0]+suf;
    const q=X("（　）の部分を漢字で書くと？|Which kanji fits the part in （　）?|（　）的部分要寫成哪個漢字？")+"<br>"+s;
    const mean=o=>{ const w=o[0]+suf,[mj,me,mz]=o[1].split("|"); return X(`「${w}」は${mj}|「${w}」: ${me}|「${w}」：${mz}`); };
    return {q,ans,wrongs:opts.filter((_,i)=>i!==k).map(o=>({v:o[0]+suf,why:mean(o)})),exp:mean(opts[k]),tf:v=>`${q}<br>→ ${v}`,kind:"word"}; });
  return out; }
const DOON=[
  [[["意外","「思っていたこととちがう」という意味。|unexpected|出乎意料"],["以外","「それをのぞいたほか」という意味。|other than; except|除此之外"],["遺骸","「死んだ人や動物の体」という意味。|remains (of the dead)|遺骸"]],
   [["試合は（いがい）な結果に終わった。",0],["日曜（いがい）は毎日練習がある。",1]]],
  [[["対象","「働きかける相手・目標」という意味。|target; the people or thing aimed at|對象、目標"],["対照","「比べ合わせること。ちがいがはっきりしていること」という意味。|contrast|對照、對比"],["対称","「（図形などが）つり合っていること」という意味。|symmetry|對稱"]],
   [["小学生を（たいしょう）にしたイベント。",0],["二人の性格は（たいしょう）的だ。",1],["左右（たいしょう）の図形。",2]]],
  [[["追求","「手に入れようとどこまでも追い求める」という意味。|to pursue (something you want)|追求（想得到的東西）"],["追究","「わからないことをどこまでも明らかにしようとする」という意味。|to investigate (the truth)|探究（真理）"],["追及","「責任などをどこまでも問いつめる」という意味。|to press someone (about responsibility)|追究（責任）"]],
   [["幸福を（ついきゅう）する。",0],["真理を（ついきゅう）する。",1],["責任を（ついきゅう）する。",2]]],
  [[["保証","「まちがいない・大丈夫だと請け合う」という意味。|to guarantee|保證"],["保障","「地位や権利などが害されないように守る」という意味。|to secure (rights, safety)|保障"],["補償","「与えた損害をつぐなう」という意味。|to compensate (for damage)|賠償、補償"]],
   [["この時計は品質を（ほしょう）します。",0],["社会（ほしょう）制度。",1],["事故の損害を（ほしょう）する。",2]]],
  [[["関心","「興味をもつこと」という意味。|interest|關心、興趣"],["感心","「りっぱだと心を動かされること」という意味。|to be impressed|佩服"],["歓心","「喜ぶ気持ち」という意味（「歓心を買う」）。|favor (to curry favor)|歡心"]],
   [["環境問題に（かんしん）を持つ。",0],["熱心な練習ぶりに（かんしん）する。",1]]],
  [[["機会","「ちょうどよい時・チャンス」という意味。|chance; opportunity|機會"],["機械","「動力で動く装置」という意味。|machine|機器、機械"],["器械","「簡単な道具や器具」という意味（「器械体操」など）。|apparatus; simple instrument|器械、器具"]],
   [["発表の（きかい）をもらう。",0],["工場の（きかい）が動く。",1]]],
  [[["移動","「位置が変わること」という意味。|moving from place to place|移動"],["異動","「勤め先での地位や持ち場が変わること」という意味。|a change of post at work|人事異動"],["異同","「ちがい」という意味。|difference|異同、差異"]],
   [["バスで（いどう）する。",0],["春の人事（いどう）。",1]]],
  [[["開放","「開けはなすこと。自由に出入りさせること」という意味。|opening (to the public)|開放"],["解放","「しばられているものを自由にすること」という意味。|release; freeing|解放、釋放"],["快方","「病気やけががよくなること」という意味。|recovery|好轉"]],
   [["休日に校庭を（かいほう）する。",0],["人質を（かいほう）する。",1],["病気が（かいほう）に向かう。",2]]],
  [[["構成","「いくつかの要素を組み立てること」という意味。|structure; composition|構成、結構"],["公正","「かたよらず正しいこと」という意味。|fair|公正"],["校正","「印刷物などの誤りを直すこと」という意味。|proofreading|校對"],["厚生","「健康で豊かな生活にすること」という意味。|public welfare|福利、衛生"]],
   [["文章の（こうせい）を考える。",0],["（こうせい）な判断をする。",1],["原稿を（こうせい）する。",2]]],
  [[["体制","「社会や組織の仕組み」という意味。|system (of a society or group)|體制"],["体勢","「体の構え・姿勢」という意味。|body posture|姿勢、體勢"],["態勢","「物事に対する身がまえ・準備」という意味。|readiness; preparedness|態勢、準備"]],
   [["政治（たいせい）が変わる。",0],["（たいせい）をくずして転んだ。",1]]],
];
const DOKUN=[
  [[["暑","気温が高いこと。|hot (weather)|天氣熱"],["熱","物の温度が高いこと。気持ちが高ぶること。|hot (to the touch); passionate|東西燙、熱情"],["厚","厚みがあること。|thick|厚"]],
   [["今年の夏は（あつ）い。",0,"い"],["（あつ）いお茶を飲む。",1,"い"],["（あつ）い辞書。",2,"い"]]],
  [[["測","長さ・高さ・深さ・広さなどを調べること。|to measure (length, height, area)|量（長度、高度、面積）"],["計","時間や数を調べること。|to time; to count|計（時間、數量）"],["量","重さや容積を調べること。|to weigh; to measure volume|量（重量、容量）"],["図","計画する・努めること。|to plan; to seek|謀求、力圖"]],
   [["身長を（はか）る。",0,"る"],["百メートル走のタイムを（はか）る。",1,"る"],["体重を（はか）る。",2,"る"],["問題の解決を（はか）る。",3,"る"]]],
  [[["取","手に持つ・書きとめることなど。|to take; to take (notes)|拿、記下"],["採","選んで集めること。|to gather; to pick|採集"],["捕","つかまえること。|to catch|捕捉"],["撮","写真などをとること。|to take (a photo)|拍攝"]],
   [["ノートにメモを（と）る。",0,"る"],["山で山菜を（と）る。",1,"る"],["網で虫を（と）る。",2,"る"],["旅行先で写真を（と）る。",3,"る"]]],
  [[["収","中に入れる・手に入れること。|to put away; to obtain|收、取得"],["納","お金や品物をわたすこと。しまうこと。|to pay; to deliver|繳納"],["治","世の中をしずめること。病気をなおすこと。|to govern|治理"],["修","学問や技術を身につけること。|to master (a study)|修習"]],
   [["大成功を（おさ）める。",0,"める"],["税金を（おさ）める。",1,"める"],["国を（おさ）める。",2,"める"],["学問を（おさ）める。",3,"める"]]],
  [[["努","力をつくすこと。|to make an effort|努力"],["務","役目を受け持つこと。|to serve as (a role)|擔任"],["勤","勤め先で働くこと。|to work (for a company)|任職、上班"]],
   [["問題の解決に（つと）める。",0,"める"],["学級会の議長を（つと）める。",1,"める"],["父は銀行に（つと）めている。",2,"め"]]],
  [[["会","人と人が顔を合わせること。|to meet (a person)|見面"],["合","一致すること。|to match; to agree|一致、合"],["遭","よくないことに出あうこと。|to run into (trouble)|遭遇"]],
   [["駅で友達に（あ）う。",0,"う"],["二人は意見がよく（あ）う。",1,"う"],["帰り道で夕立に（あ）う。",2,"う"]]],
  [[["写","そのとおりに書き取ること。写真にとること。|to copy; to photograph|抄寫、拍照"],["映","光や影で姿を表すこと。|to reflect; to project|映照、放映"],["移","場所を変えること。|to move (something)|移動"]],
   [["黒板の字をノートに（うつ）す。",0,"す"],["鏡に顔を（うつ）す。",1,"す"],["机をまどぎわに（うつ）す。",2,"す"]]],
  [[["開","閉じているものをひらくこと。|to open|打開"],["明","夜が終わって明るくなること。期間が終わること。|to dawn; to end (a period)|天亮、期間結束"],["空","中をからにすること。|to empty; to make room|空出來"]],
   [["窓を（あ）ける。",0,"ける"],["夜が（あ）ける。",1,"ける"],["バスでお年寄りに席を（あ）ける。",2,"ける"]]],
  [[["上","下から上へ行くこと。|to go up|往上"],["登","高い所へ自分の力で行くこと。|to climb|攀登"],["昇","勢いよく高く上がること。|to rise|上升"]],
   [["坂を（のぼ）る。",0,"る"],["富士山に（のぼ）る。",1,"る"],["東の空に日が（のぼ）る。",2,"る"]]],
  [[["立","まっすぐに起き上がること。その場所を去ること。|to stand; to leave (a seat)|站立、離開"],["建","建物ができること。|to be built|建起"],["裁","布や紙を寸法に合わせて切ること。|to cut (cloth)|裁剪"],["絶","つながりを切ること。|to cut off (contact)|斷絕"]],
   [["駅前に新しいビルが（た）つ。",1,"つ"],["布を型紙に合わせて（た）つ。",2,"つ"],["連絡を（た）つ。",3,"つ"]]],
];
const k1=yomiQ, k2=HG(DOON), k3=HG(DOKUN);
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
/* ========== 文法（学校文法：文節・単語・文の成分・品詞） ==========
   文の書き方："/" が文節の区切り、"・" が文節の中の単語の区切り。文節は「自立語1つ＋付属語0こ以上」。 */
const BUN=[
  ["弟・が/公園・で/元気に/走る。"],
  ["白い/花・が/庭・に/咲い・た。"],
  ["窓・から/海・が/見える。"],
  ["兄・は/本・を/読ん・で/いる。","H"],
  ["机・の/上・に/ノート・が/ある。","「机の上に」は「机の／上に」の2つの文節。|「机の上に」 is two bunsetsu: 「机の／上に」.|「机の上に」是「机の／上に」兩個文節。"],
  ["大きな/木・の/下・で/休ん・だ。"],
  ["春・に/なる・と/桜・の/花・が/咲く。"],
  ["先生・が/黒板・に/字・を/書い・て/くださっ・た。","H"],
  ["夜空・に/星・が/美しく/光る。"],
  ["私・は/毎朝/犬・と/歩く。"],
  ["今日・は/とても/寒い。"],
  ["ぼく・は/駅・まで/走っ・て/行っ・た。"],
  ["母・が/作っ・た/カレー・は/おいしい。"],
  ["小さな/子ども・が/庭・で/遊ん・で/いる。","H"],
  ["雨・が/降っ・た・ので/試合・は/中止・に/なっ・た。"],
];
const HOJO="「（読んで）いる」「（書いて）くださる」のような補助動詞（もとの意味がうすれ、上の語に意味をそえる動詞）も、1つの文節になる。|Helper verbs such as 「いる」 in 「読んでいる」 and 「くださる」 in 「書いてくださる」 form their own bunsetsu.|像「読んでいる」的「いる」、「書いてくださる」的「くださる」這種補助動詞，也自成一個文節。";
const bsOf=s=>s.split("/").map(b=>b.split("・"));
const plain=s=>s.replace(/[\/・]/g,"");
const segB=bs=>bs.map(b=>b.join("")).join("／");
const segW=bs=>bs.flat().join("／");
const bnote=r=>r[1]?" "+X(r[1]==="H"?HOJO:r[1]):"";
const NUM=n=>X(`${n}つ|${n}|${n}個`);
function nOpts(n,lo){ return shuf([n-1,n+1,n+2,n-2].filter(x=>x>=lo&&x!==n)).slice(0,3); }
const bsCount=BUN.map(r=>()=>{ const bs=bsOf(r[0]),n=bs.length,s=plain(r[0]),seg=segB(bs);
  const q=X("次の文は、いくつの文節に分けられる？|How many bunsetsu (phrases) are in this sentence?|下面的句子可以分成幾個文節？")+"<br>"+s;
  const exp=X(`「ネ」を入れて区切れるところで分けると「${seg}」（${n}つ）。|Split wherever you can insert 「ネ」: 「${seg}」 (${n}).|在可以加「ネ」的地方斷開：「${seg}」（${n}個）。`)+bnote(r);
  return {q,ans:NUM(n),wrongs:nOpts(n,2).map(x=>({v:NUM(x),why:exp})),exp,tf:v=>`${q}<br>→ ${v}`,kind:"word"}; });
const tgCount=BUN.map(r=>()=>{ const bs=bsOf(r[0]),n=bs.flat().length,s=plain(r[0]),seg=segW(bs);
  const q=X("次の文は、いくつの単語に分けられる？|How many words (tango) are in this sentence?|下面的句子可以分成幾個單語？")+"<br>"+s;
  const exp=X(`単語に分けると「${seg}」（${n}つ）。助詞・助動詞も1つの単語。|Split into words: 「${seg}」 (${n}). Particles and auxiliary verbs count as words.|分成單語：「${seg}」（${n}個）。助詞、助動詞也各算一個單語。`);
  return {q,ans:NUM(n),wrongs:nOpts(n,3).map(x=>({v:NUM(x),why:exp})),exp,tf:v=>`${q}<br>→ ${v}`,kind:"word"}; });
const bsSplit=BUN.map(r=>()=>{ const bs=bsOf(r[0]),s=plain(r[0]),ans=segB(bs),cand=[];
  for(let i=0;i+1<bs.length;i++){ const a=bs[i].join(""),b=bs[i+1].join("").replace(/。$/,""); const m=bs.map(x=>x.slice()); m.splice(i,2,[...bs[i],...bs[i+1]]);
    cand.push({v:segB(m),why:X(`「${a}」と「${b}」は別の文節（「${a}ネ」「${b}ネ」と区切れる）。|「${a}」 and 「${b}」 are separate bunsetsu (「${a}ネ」, 「${b}ネ」).|「${a}」和「${b}」是不同的文節（可以說「${a}ネ」「${b}ネ」）。`)}); }
  bs.forEach((b,i)=>{ for(let k=1;k<b.length;k++){ const x=b.slice(0,k).join(""),y=b.slice(k).join("").replace(/。$/,""); const m=bs.map(z=>z.slice()); m.splice(i,1,b.slice(0,k),b.slice(k));
    cand.push({v:segB(m),why:X(`「${y}」は付属語なので、前の「${x}」とあわせて1つの文節になる。|「${y}」 is a dependent word, so it goes with 「${x}」 in one bunsetsu.|「${y}」是附屬語，要和前面的「${x}」合成一個文節。`)}); } });
  const q=X("文節に正しく区切ったものは？|Which shows the correct bunsetsu breaks?|哪一個正確地分出了文節？")+"<br>"+s;
  return {q,ans,wrongs:shuf(cand).slice(0,3),exp:X(`「ネ」を入れて区切れるところで分ける：「${ans}」。|Split wherever you can insert 「ネ」: 「${ans}」.|在可以加「ネ」的地方斷開：「${ans}」。`)+bnote(r),tf:v=>`${q}<br>→ ${v}`,kind:"word"}; });
// 自立語・付属語
const FUZ=["が","を","に","から","まで","ので","ます","た"], JIR=["山","走る","とても","美しい","この","しかし","はい","静かだ"];
const JIRw=v=>X(`「${v}」は自立語（それだけで意味がわかり、文節のはじめにくる）。|「${v}」 is an independent word: it has meaning by itself and begins a bunsetsu.|「${v}」是自立語（單獨就有意思，位於文節開頭）。`);
const FUZw=v=>X(`「${v}」は付属語（それだけでは意味がわからず、自立語のあとにつく）。|「${v}」 is a dependent word: it has no meaning alone and follows an independent word.|「${v}」是附屬語（單獨沒有意思，接在自立語後面）。`);
const fuzQ=()=>{ const a=pick(FUZ),q=X("次のうち、付属語はどれ？|Which of these is a dependent word (fuzokugo)?|下面哪一個是附屬語？");
  return {q,ans:a,wrongs:shuf(JIR).slice(0,3).map(v=>({v,why:JIRw(v)})),exp:FUZw(a),tf:v=>`${q}<br>→ ${v}`,kind:"word"}; };
const jirQ=()=>{ const a=pick(JIR),q=X("次のうち、自立語はどれ？|Which of these is an independent word (jiritsugo)?|下面哪一個是自立語？");
  return {q,ans:a,wrongs:shuf(FUZ).slice(0,3).map(v=>({v,why:FUZw(v)})),exp:JIRw(a),tf:v=>`${q}<br>→ ${v}`,kind:"word"}; };

/* 文の成分：[文, 文節, 成分, ひとこと?] */
const SEI={S:["主語","subject","主語","主語は「何が（は）」にあたる文節。|The subject tells who or what (often with 「が」 or 「は」).|主語是相當於「什麼（誰）」的文節。"],
  P:["述語","predicate","述語","述語は「どうする・どんなだ・何だ・ある（いる・ない）」にあたる文節。|The predicate tells what the subject does, is like, or is.|述語是相當於「做什麼、怎麼樣、是什麼、有沒有」的文節。"],
  M:["修飾語","modifier","修飾語","修飾語は、ほかの文節をくわしく説明する文節。|A modifier describes another bunsetsu in more detail.|修飾語是詳細說明其他文節的文節。"],
  C:["接続語","connective","接續語","接続語は、前後の文や文節をつなぐ文節。|A connective links what comes before to what follows.|接續語是連接前後句子或文節的文節。"],
  I:["独立語","independent element","獨立語","独立語は、ほかの文節と直接の関係がなく独立している文節（感動・呼びかけ・応答・提示）。|An independent element stands apart from the rest (exclamations, calls, replies, topic words).|獨立語是與其他文節沒有直接關係、獨立的文節（感嘆、呼喚、應答、提示）。"]};
const seiN=k=>X(SEI[k].slice(0,3).join("|"));
const SEIR=[
  ["弟が公園で元気に走る。","弟が","S"],["弟が公園で元気に走る。","走る","P"],["弟が公園で元気に走る。","元気に","M","「走る」をくわしくしている。|It describes 「走る」.|它在詳細說明「走る」。"],
  ["弟が公園で元気に走る。","公園で","M","「どこで」走るのかをくわしくしている。|It tells where he runs.|說明在哪裡跑。"],
  ["はい、私が行きます。","はい","I","応答の独立語。|A reply.|表示應答的獨立語。"],["はい、私が行きます。","私が","S"],
  ["ああ、きれいな夕焼けだ。","ああ","I","感動の独立語。|An exclamation.|表示感嘆的獨立語。"],["ああ、きれいな夕焼けだ。","夕焼けだ","P","「何だ」にあたる。|It tells what something is.|相當於「是什麼」。"],
  ["ああ、きれいな夕焼けだ。","きれいな","M","「夕焼けだ」をくわしくしている。|It describes 「夕焼けだ」.|它在詳細說明「夕焼けだ」。"],
  ["雨が降った。だから、試合は中止だ。","だから","C"],["寒かったので、上着を着た。","寒かったので","C","「〜ので」「〜から」で、理由を表してあとにつなぐ文節も接続語。|A bunsetsu ending in 「〜ので」 that gives a reason is also a connective.|以「〜ので」表示理由、接到後面的文節也是接續語。"],
  ["急いだが、バスに乗りおくれた。","急いだが","C"],["花子さん、こちらへ来てください。","花子さん","I","呼びかけの独立語。|A call to someone.|表示呼喚的獨立語。"],
  ["夏休み、それは楽しい季節だ。","夏休み","I","提示の独立語。|A topic word set apart.|表示提示的獨立語。"],
  ["私は本を読む。","本を","M","「何を」読むのかをくわしくしている（連用修飾語）。|It tells what is read, so it modifies 「読む」.|說明讀什麼，是修飾「読む」的修飾語。"],
  ["鳥も空を飛ぶ。","鳥も","S","「も」がついても主語になる。|It is the subject even with 「も」.|加「も」也可以是主語。"],
  ["父は医者だ。","医者だ","P"],["庭に赤い花が咲いた。","花が","S"],["庭に赤い花が咲いた。","赤い","M","「花が」をくわしくしている（連体修飾語）。|It describes 「花が」.|它在詳細說明「花が」。"],
];
const seiQ=SEIR.map(([s,t,k,nt])=>()=>{ const q=X(`次の文の「${t}」は、文の成分では何？|In this sentence, what is 「${t}」?|下面句子中的「${t}」是哪一種句子成分？`)+"<br>"+s;
  const is=X(`「${t}」は${SEI[k][0]}。|「${t}」 is ${({S:"the ",P:"the ",M:"a ",C:"a ",I:"an "})[k]}${SEI[k][1]}.|「${t}」是${SEI[k][2]}。`)+(nt?" "+X(nt):"");
  return {q,ans:seiN(k),wrongs:shuf(Object.keys(SEI).filter(x=>x!==k)).slice(0,3).map(x=>({v:seiN(x),why:X(SEI[x][3])+" "+is})),exp:is+" "+X(SEI[k][3]),tf:v=>`${q}<br>→ ${v}`,kind:"word"}; });

/* 品詞：[ふくまれる文 or null, 語, 品詞, まちがえやすい品詞×3, ひとこと?] */
const HIN={n:["名詞","noun","名詞","名詞は、物事の名前を表し、「が」をつけて主語になれる。活用しない。|A noun names a thing and can be a subject with 「が」. It doesn't conjugate.|名詞表示事物的名稱，加「が」可當主語，沒有活用。"],
  v:["動詞","verb","動詞","動詞は、動作・作用・存在を表し、言い切りの形がウ段の音で終わる。|A verb shows an action or existence; its dictionary form ends in an -u sound.|動詞表示動作、作用或存在，原形以u段音結尾。"],
  a:["形容詞","i-adjective","形容詞","形容詞は、性質・状態を表し、言い切りの形が「い」で終わる。|An i-adjective describes a quality; its dictionary form ends in 「い」.|形容詞表示性質、狀態，原形以「い」結尾。"],
  na:["形容動詞","na-adjective","形容動詞","形容動詞は、性質・状態を表し、言い切りの形が「だ・です」で終わる。|A na-adjective describes a quality; its dictionary form ends in 「だ」 or 「です」.|形容動詞表示性質、狀態，原形以「だ」「です」結尾。"],
  adv:["副詞","adverb","副詞","副詞は、活用せず、主に用言（動詞・形容詞・形容動詞）をくわしくする。|An adverb doesn't conjugate and mainly modifies verbs and adjectives.|副詞沒有活用，主要修飾用言（動詞、形容詞、形容動詞）。"],
  ren:["連体詞","adnominal (rentaishi)","連體詞","連体詞は、活用せず、体言（名詞）だけをくわしくする。|An adnominal doesn't conjugate and only modifies nouns.|連體詞沒有活用，只修飾體言（名詞）。"],
  conj:["接続詞","conjunction","接續詞","接続詞は、活用せず、前後の文や語をつなぐ。|A conjunction links sentences or words.|接續詞沒有活用，用來連接前後的句子或詞語。"],
  int:["感動詞","interjection","感嘆詞","感動詞は、感動・呼びかけ・応答・あいさつを表し、それだけで独立語になる。|An interjection expresses a feeling, call, reply or greeting and stands alone.|感嘆詞表示感嘆、呼喚、應答、打招呼，可單獨成為獨立語。"],
  p:["助詞","particle","助詞","助詞は、活用しない付属語。語と語の関係を示したり、意味をそえたりする。|A particle is a dependent word that doesn't conjugate; it shows how words relate.|助詞是沒有活用的附屬語，表示詞與詞的關係或增添意思。"],
  aux:["助動詞","auxiliary verb","助動詞","助動詞は、活用する付属語。|An auxiliary verb is a dependent word that conjugates.|助動詞是有活用的附屬語。"]};
const hinN=k=>X(HIN[k].slice(0,3).join("|"));
const HINR=[
  [null,"走る","v",["n","a","adv"]],[null,"美しい","a",["na","v","ren"]],[null,"静かだ","na",["a","n","adv"]],
  ["大きな木","大きな","ren",["a","na","adv"],"「大きい」なら形容詞。「大きな」は形が変わらず、名詞だけをくわしくする。|「大きい」 would be an i-adjective; 「大きな」 never changes form and only modifies nouns.|「大きい」是形容詞；「大きな」沒有活用，只修飾名詞。"],
  ["ゆっくり歩く","ゆっくり","adv",["na","ren","v"]],["この本を読む","この","ren",["n","adv","a"]],
  ["雨が降った。しかし、試合は行われた。","しかし","conj",["adv","int","p"]],
  [null,"おはよう","int",["n","adv","conj"],"あいさつの言葉は感動詞。|Greetings are interjections.|打招呼的話是感嘆詞。"],
  ["本を読む","を","p",["aux","conj","adv"]],
  ["映画を見たい","たい","aux",["p","a","v"],"「たく・たかっ・たい・たけれ」と活用する付属語。|It conjugates (「たく」, 「たかっ」, 「たい」, 「たけれ」).|會變成「たく、たかっ、たい、たけれ」，是有活用的附屬語。"],
  [null,"きれいだ","na",["a","n","adv"],"「きれい」は「い」で終わるが、言い切りは「きれいだ」なので形容動詞。|「きれい」 ends in 「い」, but its dictionary form is 「きれいだ」.|「きれい」雖然以「い」結尾，原形是「きれいだ」，所以是形容動詞。"],
  ["とても寒い","とても","adv",["a","ren","conj"]],[null,"学校","n",["v","adv","ren"]],
  ["いいえ、ちがいます。","いいえ","int",["adv","conj","n"]],["朝ごはんを食べた。そして、家を出た。","そして","conj",["adv","int","p"]],
  ["ある日のこと","ある","ren",["v","a","adv"],"「本がある」の「ある」は動詞。「ある日」の「ある」は名詞だけをくわしくする連体詞。|In 「本がある」 it is a verb; in 「ある日」 it only modifies a noun.|「本がある」的「ある」是動詞；「ある日」的「ある」只修飾名詞，是連體詞。"],
  ["机の上に本がある","ある","v",["ren","a","aux"],"ものが存在することを表す動詞。|Here it is a verb meaning \"to exist\".|表示東西存在的動詞。"],
  [null,"楽しい","a",["na","v","adv"]],
  ["もし雨なら中止だ","もし","adv",["conj","ren","int"],"「もし〜なら」のように、決まった言い方と呼応する副詞。|「もし」 is an adverb that pairs with 「〜なら」.|「もし」是與「〜なら」呼應的副詞。"],
  ["弟と遊ぶ","と","p",["aux","conj","n"]],
];
const hinQ=HINR.map(([c,t,k,ws,nt])=>()=>{ const q=c?X(`「${c}」の「${t}」の品詞は？|What part of speech is 「${t}」 in 「${c}」?|「${c}」中的「${t}」是什麼詞性？`):X(`「${t}」の品詞は？|What part of speech is 「${t}」?|「${t}」是什麼詞性？`);
  const is=X(`「${t}」は${HIN[k][0]}。|「${t}」 is ${/^[aeiou]/.test(HIN[k][1])?"an":"a"} ${HIN[k][1]}.|「${t}」是${HIN[k][2]}。`)+(nt?" "+X(nt):"");
  return {q,ans:hinN(k),wrongs:ws.map(x=>({v:hinN(x),why:X(HIN[x][3])+" "+is})),exp:is+" "+X(HIN[k][3]),tf:v=>`${q}<br>→ ${v}`,kind:"word"}; });
const b1=[...bsCount,...bsSplit,...tgCount,fuzQ,fuzQ,jirQ,jirQ], b2=seiQ, b3=hinQ;
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
/* ========== かなづかい変換（組み合わせカードと同じ遊び：歴史的仮名遣い ↔ 現代仮名遣い） ========== */
const KPAIR=r=>[r[0],r[1],r[3].map(k=>X(RSHORT[k])).join("・")];
const KSETS=[
  ["ハ行の音|The 「は」 row|ハ行的音",KANA.filter(r=>r[3].join()==="ha")],
  ["ゐ・ゑ・を／ぢ・づ／くわ|ゐ・ゑ・を / ぢ・づ / くわ|ゐ・ゑ・を／ぢ・づ／くわ",KANA.filter(r=>["wo","dz","kwa"].includes(r[3][0])&&r[3].length===1)],
  ["母音が続く音（au・iu・eu）|Vowel pairs (au, iu, eu)|連續母音（au、iu、eu）",KANA.filter(r=>r[3].some(k=>["au","iu","eu"].includes(k)))],
  ["まとめ|Review: all|總複習",KANA],
];
/* ========== 単元 ========== */
const units=[
 {id:"kanji",s:"jpn",g:"kotoba",n:{ja:"漢字",en:"Kanji",["zh-Hant"]:"漢字"},gr:"1",k:"math",ref:X("〔知識及び技能〕(1) 漢字|Knowledge and skills (1): kanji|〔知識及技能〕(1) 漢字"),
  parts:[1,2,3],pn:{1:X("中学で習う漢字の読み|Reading kanji|國中漢字的讀音"),2:X("同音異義語|Homophones|同音異義詞"),3:X("同訓異字|Same reading, different kanji|同訓異字")},
  sk:{1:k1,2:k2,3:k3}},
 {id:"goku",s:"jpn",g:"kotoba",n:{ja:"語句",en:"Sayings & idioms",["zh-Hant"]:"語句"},gr:"1",k:"math",ref:X("〔知識及び技能〕(1) 語彙|Knowledge and skills (1): vocabulary|〔知識及技能〕(1) 語彙"),
  parts:[1,2,3,4],pn:{1:X("ことわざ|Proverbs|諺語"),2:X("慣用句|Idioms|慣用語"),3:X("故事成語|Idioms from Chinese stories|典故成語"),4:X("四字熟語|Four-character idioms|四字成語")},
  sk:{1:g1,2:g2,3:g3,4:g4}},
 {id:"bunpo",s:"jpn",g:"bunpo",n:{ja:"文法",en:"Grammar",["zh-Hant"]:"文法"},gr:"1",k:"math",ref:X("〔知識及び技能〕(1) 文や文章|Knowledge and skills (1): sentences|〔知識及技能〕(1) 句子與文章"),
  parts:[1,2,3],pn:{1:X("文節と単語|Bunsetsu & words|文節與單語"),2:X("文の成分|Parts of a sentence|句子成分"),3:X("品詞|Parts of speech|詞性")},
  sk:{1:b1,2:b2,3:b3}},
 {id:"koten",s:"jpn",g:"koten",n:{ja:"古典入門",en:"Classical Japanese",["zh-Hant"]:"古典入門"},gr:"1",k:"math",ref:X("〔知識及び技能〕(3) 我が国の言語文化|Knowledge and skills (3): Japanese literary culture|〔知識及技能〕(3) 日本的語言文化"),
  parts:[1,2,3],pn:{1:X("歴史的仮名遣い|Historical kana spelling|歷史假名拼法"),2:X("古語の意味|Classical words|古語的意思"),3:X("古典の作品|Classical works|古典作品")},
  sk:{1:c1,2:c2,3:c3}},
 {id:"kana",s:"jpn",g:"kana",pair:true,n:{ja:"かなづかい変換",en:"Kana spelling",["zh-Hant"]:"假名拼法轉換"},gr:"1",k:"math",ref:X("歴史的仮名遣い → 現代仮名遣い|Historical → modern kana spelling|歷史假名拼法 → 現代假名拼法"),
  parts:KSETS.map((_,i)=>i+1),pn:Object.fromEntries(KSETS.map((s,i)=>[i+1,X(s[0])])),
  sk:Object.fromEntries(KSETS.map((s,i)=>[i+1,TB(s[1].map(KPAIR),"「{a}」を現代仮名遣いに直すと？|Rewrite 「{a}」 in modern kana spelling.|把「{a}」改成現代假名拼法。",null,"「{a}」は「{b}」と直す。|「{a}」 becomes 「{b}」.|「{a}」改成「{b}」。")])),
  pairs:Object.fromEntries(KSETS.map((s,i)=>[i+1,s[1].map(KPAIR)]))},
];
// 問題を作る（SOC.make と同じ。同音異義語など選択肢が3つの問題もあるので、誤答は2つ以上）
function make(fn){ for(let i=0;i<20;i++){ try{ const g=fn(); if(g&&g.wrongs.length>=2&&!g.wrongs.some(w=>w.v===g.ans)) return g; }catch(e){} } return fn(); }
return {units,make};
})();
