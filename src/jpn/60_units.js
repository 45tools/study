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
