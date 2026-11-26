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
