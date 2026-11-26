/* 45 Study 数学：問題をその場で作る（数字は毎回かわる）。
   まちがいの選択肢は「よくあるミス」から作るので、選んだ答えごとに理由を出せる。
   単元の並び：中学校学習指導要領（平成29年告示）数学 第1学年・第2学年それぞれ A 数と式 → B 図形 → C 関数 → D データの活用
   gen() が返すもの：{ q:問題, ans:答え, wrongs:[{v,why}], exp:解き方, tf:v=>○×の文 }（どれもHTML） */
const MATH=(()=>{
/* ことば：日本語の文はそのまま書き、J`…` でくるむ。英語・中国語は math_i18n.js（MATH_TR）から引く。
   キーは J`…` の中の文（${…} を {} にしたもの）。言語は読みこみ時に決まる（切りかえるとページを読みなおす） */
const LG=(()=>{ let l=null; try{ l=JSON.parse(localStorage.getItem("s_lang")); }catch(e){} if(!l){ const n=(navigator.language||"ja").toLowerCase(); l=n.startsWith("zh")?(/(tw|hk|mo|hant)/.test(n)?"zh-Hant":"zh"):n.startsWith("ja")?"ja":"en"; } return {ja:-1,en:0,"zh-Hant":1,zh:2}[l]??0; })();
const JA=()=>LG<0;
const TRT=(typeof MATH_TR!=="undefined")?MATH_TR:{};
function J(s,...v){ if(LG>=0){ const t=TRT[s.raw.join("{}")]; if(t){ let i=0; return t[LG].replace(/\{(\d+)\}/g,(m,d)=>v[+d]); } } let o=s[0]; for(let i=0;i<v.length;i++) o+=v[i]+s[i+1]; return o; }
const R=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const NZ=(a,b)=>{ let n=0; while(!n) n=R(a,b); return n; };
const pick=a=>a[Math.floor(Math.random()*a.length)];
const M="−";
const num=n=>n<0?M+(-n):String(n);
const par=n=>n<0?`(${num(n)})`:num(n);
const V=v=>`<i class="mv">${v}</i>`;
const fr=(a,b)=>`<span class="fr"><span>${a}</span><span>${b}</span></span>`;
// 係数つきの項：first=先頭の項か
function term(c,v,first){ if(!c) return ""; const a=Math.abs(c);
  const b=v&&a===1?V(v):`${a}${v?V(v):""}`; if(first) return (c<0?M:"")+b; return (c<0?` ${M} `:" + ")+b; }
function poly(ts){ let s="",f=true; for(const [c,v] of ts){ if(!c) continue; s+=term(c,v,f); f=false; } return s||"0"; }
const lin=(a,b,v="x")=>poly([[a,v],[b,""]]);
const eq=(l,r)=>`${l} = ${r}`;
// 選択肢の組み立て：答えと理由つきの誤答（同じ値・答えと同じものは除く）。足りなければ近い数で埋める
function W(ans,list,near){ const out=[],seen=new Set([String(ans)]);
  for(const w of list){ if(w==null||w.v==null||w.v==="") continue; const k=String(w.v); if(seen.has(k)) continue; if(typeof w.v==="number"&&!Number.isInteger(w.v)) continue; seen.add(k); out.push({v:typeof w.v==="number"?num(w.v):w.v,why:w.why}); }
  if(typeof near==="number"){ for(const d of [1,-1,2,-2,3,-3,5,-5,10,-10]){ if(out.length>=3) break; const v=near+d; if(seen.has(String(v))) continue; seen.add(String(v)); out.push({v:num(v),why:J`計算ミスです。下の解き方で確かめよう。`}); } }
  return out; }
const Q=(q,ans,wrongs,exp,tf,kind)=>({q,ans:typeof ans==="number"?num(ans):ans,wrongs,exp,tf:tf||(v=>`${q} = ${v}`),kind:kind||"calc"});

/* ========== 正の数・負の数 ========== */
// 2数の加法・減法
function addsub(){ const a=NZ(-12,12),b=NZ(-12,12),op=pick(["+",M]); const y=op==="+"?b:-b, ans=a+y;
  const q=`${num(a)} ${op} ${par(b)}`; const L=[];
  if(op===M&&b<0) L.push({v:a+b,why:J`${M}(${num(b)}) は +${-b} になります。ひく数の符号を変えてたし算にしよう。`});
  if(op===M&&b>0) L.push({v:a+b,why:J`ひき算をたし算にしてしまっています。${M}${b} はそのまま ${M}${b}。`});
  if(Math.sign(a)!==Math.sign(y)) L.push({v:Math.sign(Math.abs(a)>=Math.abs(y)?a:y)*(Math.abs(a)+Math.abs(y)),why:J`符号がちがう2数の和は、絶対値の「差」に、絶対値の大きい方の符号をつけます。`});
  else L.push({v:Math.sign(a)*Math.abs(Math.abs(a)-Math.abs(y)),why:J`同じ符号の2数の和は、絶対値の「和」に、共通の符号をつけます。`});
  L.push({v:-ans,why:J`答えの符号がちがいます。絶対値の大きい方の符号をつけよう。`});
  const exp=op===M?`${q} = ${num(a)} + ${par(-b)} = ${num(ans)}`:`${q} = ${num(ans)}`;
  return Q(q,ans,W(ans,L,ans),exp); }
// 3数以上の加減
function addsub3(){ const n=[NZ(-9,9),NZ(-9,9),NZ(-9,9)], ops=[pick(["+",M]),pick(["+",M])];
  const ys=[n[0],ops[0]==="+"?n[1]:-n[1],ops[1]==="+"?n[2]:-n[2]]; const ans=ys[0]+ys[1]+ys[2];
  const q=`${num(n[0])} ${ops[0]} ${par(n[1])} ${ops[1]} ${par(n[2])}`;
  const wrongNeg=ys[0]+(ops[0]===M&&n[1]<0?n[1]:ys[1])+(ops[1]===M&&n[2]<0?n[2]:ys[2]);
  const L=[{v:wrongNeg,why:J`${M}( 負の数 ) は + になります。たし算だけの式に直してから計算しよう。`},
    {v:ys[0]-ys[1]+ys[2],why:J`2つ目の項（${num(ys[1])}）の符号を取りちがえています。`},{v:ys[0]+ys[1]-ys[2],why:J`3つ目の項（${num(ys[2])}）の符号を取りちがえています。`},
    {v:-ans,why:J`答えの符号がちがいます。正の項の和と負の項の和を別々に出してみよう。`}];
  const exp=`${q} = ${num(ys[0])} + ${par(ys[1])} + ${par(ys[2])} = ${num(ans)}`;
  return Q(q,ans,W(ans,L,ans),exp); }
// 乗法・除法
function muldiv(){ const a=NZ(-9,9),b=NZ(-9,9); if(Math.random()<.5){ const ans=a*b; const q=`${num(a)} × ${par(b)}`;
    return Q(q,ans,W(ans,[{v:-ans,why:ans>0?J`負の数×負の数は正になります。`:J`正の数と負の数の積は負になります（負の数が1個）。`},{v:a+b,why:J`かけ算をたし算で計算しています。`},{v:Math.abs(ans)===ans?-(ans):ans+1,why:J`符号を確かめよう。`}],ans),J`${q} = ${num(ans)}（負の数が${(a<0)+(b<0)}個なので${ans>0?J`正`:J`負`}）`); }
  const c=a*b, ans=a; const q=`${num(c)} ÷ ${par(b)}`;
  return Q(q,ans,W(ans,[{v:-ans,why:ans>0?J`負の数÷負の数は正になります。`:J`正の数と負の数の商は負になります。`},{v:c*b,why:J`わり算をかけ算で計算しています。`},{v:c-b,why:J`わり算をひき算で計算しています。`}],ans),`${q} = ${num(ans)}`); }
// 累乗
function power(){ const t=pick(["neg2","negOut","pos3","neg3","coef"]); const a=R(2,5); const Wn=(ans,L)=>W(ans,L,ans);
  if(t==="neg2"){ const q=`(${M}${a})<sup>2</sup>`, ans=a*a; return Q(q,ans,Wn(ans,[{v:-ans,why:J`(${M}${a})² は (${M}${a})×(${M}${a})。負×負で正になります。`},{v:-2*a,why:J`2乗は2をかけるのではなく、同じ数を2回かけます。`},{v:2*a,why:J`2乗は ${a}×2 ではなく (${M}${a})×(${M}${a})。`}]),`${q} = (${M}${a})×(${M}${a}) = ${ans}`); }
  if(t==="negOut"){ const q=`${M}${a}<sup>2</sup>`, ans=-a*a; return Q(q,ans,Wn(ans,[{v:a*a,why:J`${M}${a}² は ${M}(${a}×${a})。2乗するのは ${a} だけで、${M} はそのまま残ります。`},{v:-2*a,why:J`2乗は2をかけるのではなく、同じ数を2回かけます。`},{v:2*a,why:J`${M}${a}² は ${M}(${a}×${a})。`}]),`${q} = ${M}(${a}×${a}) = ${num(ans)}`); }
  if(t==="pos3"){ const b=R(2,4), q=`${b}<sup>3</sup>`, ans=b**3; return Q(q,ans,Wn(ans,[{v:b*3,why:J`3乗は ${b}×3 ではなく ${b}×${b}×${b}。`},{v:b*b,why:J`3回かけます：${b}×${b}×${b}。`},{v:-ans,why:J`正の数の累乗は正です。`}]),`${q} = ${b}×${b}×${b} = ${ans}`); }
  if(t==="neg3"){ const b=R(2,3), q=`(${M}${b})<sup>3</sup>`, ans=-(b**3); return Q(q,ans,Wn(ans,[{v:b**3,why:J`負の数を3回（奇数回）かけると負になります。`},{v:-3*b,why:J`3乗は3をかけるのではなく、同じ数を3回かけます。`},{v:-b*b,why:J`3回かけます：(${M}${b})×(${M}${b})×(${M}${b})。`}]),`${q} = (${M}${b})×(${M}${b})×(${M}${b}) = ${num(ans)}`); }
  const k=pick([-3,-2,2,3]), q=`${num(k)} × (${M}${a})<sup>2</sup>`, ans=k*a*a; return Q(q,ans,Wn(ans,[{v:(k*-a)**2,why:J`累乗を先に計算してから、かけ算をします。`},{v:-ans,why:J`(${M}${a})² は正の数です。符号を確かめよう。`},{v:k*-2*a,why:J`2乗は2をかけるのではなく、同じ数を2回かけます。`}]),`${q} = ${num(k)} × ${a*a} = ${num(ans)}`); }
// 四則の混じった計算
function mixed(){ const t=pick(["addmul","submul","subdiv","paren"]); const a=NZ(-9,9),b=NZ(-6,6),c=NZ(-6,6);
  if(t==="addmul"){ const q=`${num(a)} + ${par(b)} × ${par(c)}`, ans=a+b*c; return Q(q,ans,W(ans,[{v:(a+b)*c,why:J`かけ算を先に計算します。左から順に計算してはいけません。`},{v:a-b*c,why:J`${par(b)}×${par(c)} の符号を確かめよう。`}],ans),`${q} = ${num(a)} + ${par(b*c)} = ${num(ans)}`); }
  if(t==="submul"){ const q=`${num(a)} ${M} ${par(b)} × ${par(c)}`, ans=a-b*c; return Q(q,ans,W(ans,[{v:(a-b)*c,why:J`かけ算を先に計算します。`},{v:a+b*c,why:J`${M}(${num(b*c)}) の符号に注意。ひく数の符号を変えてたそう。`}],ans),`${q} = ${num(a)} ${M} ${par(b*c)} = ${num(ans)}`); }
  if(t==="subdiv"){ const d=b*c, q=`${num(a)} ${M} ${par(d)} ÷ ${par(c)}`, ans=a-b; return Q(q,ans,W(ans,[{v:Number.isInteger((a-d)/c)?(a-d)/c:null,why:J`わり算を先に計算します。`},{v:a+b,why:J`${par(d)}÷${par(c)} = ${num(b)}。ひく数の符号に注意。`}],ans),`${q} = ${num(a)} ${M} ${par(b)} = ${num(ans)}`); }
  const q=`(${num(a)} + ${par(b)}) × ${par(c)}`, ans=(a+b)*c; return Q(q,ans,W(ans,[{v:a+b*c,why:J`かっこの中を先に計算します。`},{v:-ans,why:J`かける数の符号を確かめよう。`}],ans),`${q} = ${par(a+b)} × ${par(c)} = ${num(ans)}`); }

/* ========== 文字を用いた式 ========== */
// 文字式の表し方
function notation(){ const t=pick(["prod","neg1","div","sq","mix"]); const k=R(2,9);
  const mk=(q,ans,L,exp)=>({q,ans,wrongs:W(ans,L),exp,tf:v=>J`${q} を文字式で表すと ${v}`,kind:"note"});
  if(t==="prod") return mk(`${V("a")} × ${V("b")} × ${k}`,`${k}${V("ab")}`,[{v:`${V("ab")}${k}`,why:J`数は文字の前に書きます。`},{v:`${k}+${V("ab")}`,why:J`× をはぶくだけで、+ にはなりません。`},{v:`${V("a")}${k}${V("b")}`,why:J`数は文字の前に書きます。`}],J`× をはぶき、数は文字の前、文字はアルファベット順`);
  if(t==="neg1") return mk(`${V("x")} × (${M}1)`,`${M}${V("x")}`,[{v:`${M}1${V("x")}`,why:J`1 は書かずに −x と表します。`},{v:`${V("x")}${M}1`,why:J`× (−1) は −x と表します。`},{v:V("x"),why:J`−1 をかけるので符号が変わります。`}],J`(−1) をかけると −x（1は書かない）`);
  if(t==="div") return mk(`${V("a")} ÷ ${k}`,fr(V("a"),k),[{v:fr(k,V("a")),why:J`わられる数 a が分子、わる数が分母です。`},{v:`${k}${V("a")}`,why:J`÷ はかけ算ではありません。分数で表します。`},{v:`${V("a")}${k}`,why:J`÷ は分数で表します。`}],J`÷ は分数で：a ÷ `+k+" = a/"+k);
  if(t==="sq") return mk(`${V("x")} × ${V("x")} × ${V("y")}`,`${V("x")}<sup>2</sup>${V("y")}`,[{v:`2${V("xy")}`,why:J`同じ文字の積は累乗の指数で表します（x×x＝x²）。`},{v:`${V("x")}<sup>3</sup>`,why:J`x と y はちがう文字です。x×x＝x²、それに y。`},{v:`${V("xy")}<sup>2</sup>`,why:J`2回かけているのは x だけです。`}],J`x×x は x²。x²y`);
  return mk(`${V("a")} × ${k} ${M} ${V("b")} ÷ 2`,`${k}${V("a")} ${M} ${fr(V("b"),2)}`,[{v:`${V("a")}${k} ${M} ${fr(2,V("b"))}`,why:J`数は文字の前、÷ はわる数を分母にします。`},{v:fr(`${k}${V("a")} ${M} ${V("b")}`,2),why:J`÷2 は b だけにかかっています。`},{v:`${k}${V("a")} ${M} 2${V("b")}`,why:J`÷2 は分数で b/2 と表します。`}],`${k}a − b/2`); }
// 式の値（代入）
function substitute(){ const x=NZ(-5,5); const t=pick(["lin","sq","negsq"]);
  if(t==="lin"){ const a=NZ(-5,5),b=NZ(-9,9); const ex=lin(a,b), ans=a*x+b;
    return {q:J`${V("x")} = ${num(x)} のとき、${ex} の値`,ans:num(ans),wrongs:W(ans,[{v:a*-x+b,why:J`符号に注意。負の数は ( ) をつけて代入し、${num(a)}×${par(x)} と計算します。`},{v:a+x+b,why:J`${num(a)}x は ${num(a)}×x。たし算ではありません。`}],ans),exp:`${num(a)}×${par(x)} + ${par(b)} = ${num(ans)}`,tf:v=>J`${V("x")} = ${num(x)} のとき、${ex} = ${v}`,kind:"sub"}; }
  if(t==="sq"){ const ans=x*x; return {q:J`${V("x")} = ${num(x)} のとき、${V("x")}<sup>2</sup> の値`,ans:num(ans),wrongs:W(ans,[{v:-ans,why:J`負の数を2乗すると正になります。`},{v:2*x,why:J`x² は x×2 ではなく x×x。`}],ans),exp:`${par(x)}×${par(x)} = ${ans}`,tf:v=>J`${V("x")} = ${num(x)} のとき、${V("x")}<sup>2</sup> = ${v}`,kind:"sub"}; }
  const ans=-x*x; return {q:J`${V("x")} = ${num(x)} のとき、${M}${V("x")}<sup>2</sup> の値`,ans:num(ans),wrongs:W(ans,[{v:x*x,why:J`${M}x² は ${M}(x×x)。x² を計算してから ${M} をつけます。`},{v:-2*x,why:J`x² は x×x。`}],ans),exp:`${M}(${par(x)}×${par(x)}) = ${num(ans)}`,tf:v=>J`${V("x")} = ${num(x)} のとき、${M}${V("x")}<sup>2</sup> = ${v}`,kind:"sub"}; }
const xs=(q,ans,L,exp)=>({q,ans,wrongs:W(ans,L),exp,tf:v=>`${q} = ${v}`,kind:"expr"});
// 同類項をまとめる
function like(){ const a=NZ(-7,7),b=NZ(-9,9),c=NZ(-7,7),d=NZ(-9,9); if(a+c===0) return like();
  const q=poly([[a,"x"],[b,""],[c,"x"],[d,""]]); const ans=lin(a+c,b+d);
  return xs(q,ans,[{v:poly([[a+c+b+d,"x"]]),why:J`文字の項と数の項は、まとめられません。`},{v:lin(-(a+c),b+d),why:J`x の項の符号を確かめよう。`},{v:lin(a-c,b+d),why:J`x の項の符号を確かめよう。`},{v:lin(a+c,b-d),why:J`数の項の符号を確かめよう。`},{v:lin(a+c,-(b+d)),why:J`数の項の符号を確かめよう。`}],J`x の項：${num(a)}+${par(c)}=${num(a+c)}、数の項：${num(b)}+${par(d)}=${num(b+d)}`); }
// 1次式と数の乗除
function distrib(){ if(Math.random()<.65){ const k=NZ(-5,5),a=NZ(-6,6),b=NZ(-9,9); if(k===1) return distrib(); const q=`${k<0?`(${num(k)})`:k}(${lin(a,b)})`; const ans=lin(k*a,k*b);
    return xs(q,ans,[{v:lin(k*a,b),why:J`かっこの中のすべての項に ${num(k)} をかけます（分配法則）。`},{v:lin(k*a,-k*b),why:J`数の項の符号を確かめよう。`},{v:lin(a+k,b+k),why:J`かけ算です。たし算ではありません。`}],`= ${par(k)}×(${lin(a,0)}) + ${par(k)}×${par(b)} = ${ans}`); }
  const k=R(2,5),a=NZ(-4,4)*k,b=NZ(-4,4)*k; const q=`(${lin(a,b)}) ÷ ${k}`; const ans=lin(a/k,b/k);
  return xs(q,ans,[{v:lin(a/k,b),why:J`すべての項を ${k} でわります。`},{v:lin(a*k,b*k),why:J`わり算です。かけ算ではありません。`},{v:lin(a/k,-b/k),why:J`数の項の符号を確かめよう。`}],`= (${lin(a,0)})÷${k} + ${par(b)}÷${k} = ${ans}`); }
// かっこを外して加減
function bracket(){ const a=NZ(-6,6),b=NZ(-9,9),c=NZ(-6,6),d=NZ(-9,9); if(a===c) return bracket();
  if(Math.random()<.6){ const q=`(${lin(a,b)}) ${M} (${lin(c,d)})`, ans=lin(a-c,b-d);
    return xs(q,ans,[{v:lin(a-c,b+d),why:J`${M}( ) をはずすときは、かっこの中のすべての項の符号を変えます。`},{v:lin(a+c,b+d),why:J`ひき算です。うしろのかっこの符号をすべて変えよう。`},{v:lin(a-c,-b-d),why:J`前のかっこはそのまま外します。`}],`= ${poly([[a,"x"],[b,""],[-c,"x"],[-d,""]])} = ${ans}`); }
  const p=NZ(2,4),qq=NZ(-4,4); const q=`${p}(${lin(a,b)}) + ${qq<0?`(${num(qq)})`:qq}(${lin(c,d)})`, ans=lin(p*a+qq*c,p*b+qq*d);
  return xs(q,ans,[{v:lin(p*a+qq*c,b+d),why:J`かっこの中のすべての項に、前の数をかけます。`},{v:lin(p*a+qq*c,p*b-qq*d),why:J`うしろのかっこの数の項の符号を確かめよう。`},{v:lin(p*a-qq*c,p*b+qq*d),why:J`うしろのかっこの x の項の符号を確かめよう。`}],`= ${poly([[p*a,"x"],[p*b,""],[qq*c,"x"],[qq*d,""]])} = ${ans}`); }

/* ========== 一元一次方程式 ========== */
const eqQ=(q,x,L,exp)=>({q:`${q}`,ans:num(x),wrongs:W(x,L,x),exp,tf:v=>J`${q} の解は ${V("x")} = ${v}`,kind:"eq"});
// x+a=b, ax=b
function eq1(){ const x=NZ(-9,9); if(Math.random()<.5){ const a=NZ(-9,9),b=x+a; const q=eq(lin(1,a),num(b));
    return eqQ(q,x,[{v:b+a,why:J`移項すると符号が変わります。${num(a)} を右へ移すと ${num(-a)}。`},{v:-x,why:J`符号を確かめよう。`}],`${V("x")} = ${num(b)} ${a>0?M:"+"} ${Math.abs(a)} = ${num(x)}`); }
  const a=NZ(-9,9); if(a===1) return eq1(); const b=a*x; const q=eq(lin(a,0),num(b));
  return eqQ(q,x,[{v:b*a,why:J`両辺を ${num(a)} で「わる」と x が求められます。`},{v:b-a,why:J`${num(a)}x は ${num(a)}×x。両辺を ${num(a)} でわります。`},{v:-x,why:J`わる数の符号に注意しよう。`}],J`両辺を ${num(a)} でわる：${V("x")} = ${num(b)}÷${par(a)} = ${num(x)}`); }
// ax+b=c
function eq2(){ const x=NZ(-6,6),a=NZ(-5,5),b=NZ(-9,9); if(a===1||a===-1) return eq2(); const c=a*x+b; const q=eq(lin(a,b),num(c));
  return eqQ(q,x,[{v:(c+b)/a,why:J`移項すると符号が変わります。${num(b)} を右へ移すと ${num(-b)}。`},{v:c-b,why:J`最後に両辺を ${num(a)} でわるのを忘れています。`},{v:-x,why:J`両辺を ${num(a)} でわるときの符号に注意。`}],`${lin(a,0)} = ${num(c)} ${b>0?M:"+"} ${Math.abs(b)} = ${num(c-b)} → ${V("x")} = ${num(x)}`); }
// ax+b=cx+d
function eq3(){ const x=NZ(-6,6),a=NZ(-6,6),c=NZ(-6,6),b=NZ(-9,9); if(a===c) return eq3(); const d=a*x+b-c*x; const q=eq(lin(a,b),lin(c,d)); const k=a-c;
  return eqQ(q,x,[{v:(d+b)/k,why:J`${num(b)} を右へ移項すると ${num(-b)} になります。`},{v:(d-b)/(a+c),why:J`${lin(c,0)} を左へ移項すると ${lin(-c,0)} になります。`},{v:d-b,why:J`最後に両辺を ${num(k)} でわります。`},{v:-x,why:J`符号を確かめよう。`}],`${lin(a,0)} ${lin(-c,0).startsWith(M)?"":"+"} ${lin(-c,0)} = ${num(d)} ${b>0?M:"+"} ${Math.abs(b)} → ${lin(k,0)} = ${num(d-b)} → ${V("x")} = ${num(x)}`); }
// かっこを含む
function eq4(){ const x=NZ(-6,6),a=NZ(-4,4),b=NZ(-6,6); if(a===1||a===-1) return eq4(); const c=a*(x+b); const q=eq(`${a<0?`(${num(a)})`:a}(${lin(1,b)})`,num(c));
  return eqQ(q,x,[{v:Number.isInteger((c-b)/a)?(c-b)/a:null,why:J`かっこを外すとき、${num(b)} にも ${num(a)} をかけます。`},{v:c/a+b,why:J`移項すると符号が変わります。`},{v:c-a*b,why:J`最後に両辺を ${num(a)} でわります。`}],J`${lin(a,a*b)} = ${num(c)} → ${lin(a,0)} = ${num(c-a*b)} → ${V("x")} = ${num(x)}（または両辺を ${num(a)} でわって ${lin(1,b)} = ${num(c/a)}）`); }
// 比例式
function ratio(){ const c=R(2,6),a=R(2,9); const bb=c*R(1,4); const x=a*bb/c; const q=`${V("x")} : ${a} = ${bb} : ${c}`;
  return {q,ans:num(x),wrongs:W(x,[{v:Number.isInteger(a*c/bb)?a*c/bb:null,why:J`比例式は「外側の積＝内側の積」：x×`+c+" = "+a+"×"+bb+J`。`},{v:a*bb,why:J`最後に両辺を ${c} でわります。`},{v:a+bb-c,why:J`比はたし算・ひき算ではなく、かけ算で解きます。`}],x),exp:`${V("x")}×${c} = ${a}×${bb} → ${V("x")} = ${x}`,tf:v=>J`${q} のとき ${V("x")} = ${v}`,kind:"eq"}; }

/* ========== 共通：図・選択肢の文から作る問題 ========== */
const SV=(w,h,body)=>`<svg class="fig" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
// 文の問題（選択肢の文と理由をそのまま使う）
function bank(list){ return ()=>{ const [q,ans,ws,exp]=pick(list); return {q,ans,wrongs:ws.map(([v,why])=>({v,why})),exp,tf:v=>`${q}<br>→ ${v}`,kind:"word"}; }; }
const coef=(p,q)=>{ if(q===1) return p===1?"":p===-1?M:num(p); return (p<0?M:"")+fr(Math.abs(p),q); };
const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);
const PI=n=>n===1?"π":`${n}π`;
const shuffle=a=>{ a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };

/* ========== 比例と反比例（C(1)） ========== */
// 座標平面（-6〜6）。pts:[[x,y,名]]、line:[p,q]（y=p/q x）、hyp:a（y=a/x）
function coord({pts=[],line=null,hyp=null,lins=[]}){ const S=17,O=6*S+8,W=O*2; const X=x=>O+x*S, Y=y=>O-y*S; let b="";
  for(let i=-6;i<=6;i++){ b+=`<line x1="${X(i)}" y1="${Y(-6)}" x2="${X(i)}" y2="${Y(6)}" class="g"/><line x1="${X(-6)}" y1="${Y(i)}" x2="${X(6)}" y2="${Y(i)}" class="g"/>`; }
  b+=`<line x1="${X(-6.3)}" y1="${O}" x2="${X(6.3)}" y2="${O}" class="ax"/><line x1="${O}" y1="${Y(-6.3)}" x2="${O}" y2="${Y(6.3)}" class="ax"/>`;
  b+=`<text x="${X(6.3)}" y="${O-5}" class="lb">x</text><text x="${O+5}" y="${Y(6.2)}" class="lb">y</text><text x="${O-11}" y="${O+13}" class="lb">O</text>`;
  for(const i of [-5,5]){ b+=`<text x="${X(i)}" y="${O+13}" class="nm" text-anchor="middle">${num(i)}</text><text x="${O-5}" y="${Y(i)+4}" class="nm" text-anchor="end">${num(i)}</text>`; }
  for(const [p,q,c,cl] of lins){ const m=p/q; let x1=-6.3,x2=6.3; if(m){ const xa=(6.3-c)/m, xb=(-6.3-c)/m; x1=Math.max(x1,Math.min(xa,xb)); x2=Math.min(x2,Math.max(xa,xb)); } b+=`<line x1="${X(x1).toFixed(1)}" y1="${Y(m*x1+c).toFixed(1)}" x2="${X(x2).toFixed(1)}" y2="${Y(m*x2+c).toFixed(1)}" class="${cl||"ln"}"/>`; }
  if(line){ const [p,q]=line; const m=p/q; const x1=Math.abs(m)>1?6/Math.abs(m):6; b+=`<line x1="${X(-x1)}" y1="${Y(-x1*m)}" x2="${X(x1)}" y2="${Y(x1*m)}" class="ln"/>`; }
  if(hyp){ for(const sgn of [1,-1]){ let d=""; for(let x=.5;x<=6.01;x+=.25){ const xx=sgn*x, yy=hyp/xx; if(Math.abs(yy)>6.3) continue; d+=(d?"L":"M")+X(xx).toFixed(1)+" "+Y(yy).toFixed(1); } b+=`<path d="${d}" class="ln"/>`; } }
  for(const [x,y,n] of pts) b+=`<circle cx="${X(x)}" cy="${Y(y)}" r="4" class="pt"/>${n?`<text x="${X(x)+6}" y="${Y(y)-6}" class="lb">${n}</text>`:""}`;
  return SV(W+12,W,b); }
const PAIR=(x,y)=>`(${num(x)}, ${num(y)})`;
function propEq(){ const a=NZ(-6,6),x=NZ(-6,6); if(a===1) return propEq(); const y=a*x;
  if(Math.random()<.5) return {q:J`${V("y")} は ${V("x")} に比例し、${V("x")} = ${num(x)} のとき ${V("y")} = ${num(y)}。比例定数は？`,ans:num(a),wrongs:W(a,[{v:Number.isInteger(x/y)?x/y:null,why:J`比例定数は y ÷ x です（x ÷ y ではありません）。`},{v:y-x,why:J`y = ax なので、a は y を x で「わって」求めます。`},{v:-a,why:J`符号を確かめよう。`}],a),exp:J`${V("y")} = ${V("a")}${V("x")} に代入：${num(y)} = ${V("a")}×${par(x)} → ${V("a")} = ${num(a)}`,tf:v=>J`比例定数は ${v}`,kind:"word"};
  const x2=NZ(-6,6), y2=a*x2; return {q:J`${V("y")} = ${coef(a,1)}${V("x")} で、${V("x")} = ${num(x2)} のときの ${V("y")} の値は？`,ans:num(y2),wrongs:W(y2,[{v:a+x2,why:J`${coef(a,1)}x は ${num(a)}×x。たし算ではありません。`},{v:-y2,why:J`符号を確かめよう。`},{v:Number.isInteger(x2/a)?x2/a:null,why:J`y = ax は「かける」式です。`}],y2),exp:`${V("y")} = ${num(a)}×${par(x2)} = ${num(y2)}`,tf:v=>J`${V("x")} = ${num(x2)} のとき ${V("y")} = ${v}`,kind:"word"}; }
function invEq(){ const x=NZ(-6,6),k=NZ(-6,6),a=x*k; if(Math.abs(a)<2) return invEq();
  if(Math.random()<.5) return {q:J`${V("y")} は ${V("x")} に反比例し、${V("x")} = ${num(x)} のとき ${V("y")} = ${num(k)}。比例定数は？`,ans:num(a),wrongs:W(a,[{v:Number.isInteger(k/x)?k/x:null,why:J`反比例は y = a/x なので、a = x × y です（y ÷ x は比例のとき）。`},{v:x+k,why:J`反比例の比例定数は x と y の「積」です。`},{v:-a,why:J`符号を確かめよう。`}],a),exp:`${V("a")} = ${V("x")}${V("y")} = ${par(x)}×${par(k)} = ${num(a)}`,tf:v=>J`比例定数は ${v}`,kind:"word"};
  const ds=[1,2,3,4,6].filter(d=>a%d===0); const x2=pick(ds)*pick([1,-1]); const y2=a/x2;
  return {q:J`${V("y")} = ${fr(num(a),V("x"))} で、${V("x")} = ${num(x2)} のときの ${V("y")} の値は？`,ans:num(y2),wrongs:W(y2,[{v:a*x2,why:J`y = ${num(a)}/x は ${num(a)} を x で「わる」式です。`},{v:-y2,why:J`符号を確かめよう。`},{v:a-x2,why:J`わり算で求めます。`}],y2),exp:`${V("y")} = ${num(a)}÷${par(x2)} = ${num(y2)}`,tf:v=>J`${V("x")} = ${num(x2)} のとき ${V("y")} = ${v}`,kind:"word"}; }
function coordRead(){ const x=NZ(-5,5),y=NZ(-5,5); if(x===y) return coordRead(); const L=pick(["A","B","P"]);
  return {q:J`点${L}の座標は？${coord({pts:[[x,y,L]]})}`,ans:PAIR(x,y),wrongs:W(PAIR(x,y),[{v:PAIR(y,x),why:J`座標は (x座標, y座標) の順に書きます。x が先です。`},{v:PAIR(-x,y),why:J`x座標の符号を確かめよう（右が正、左が負）。`},{v:PAIR(x,-y),why:J`y座標の符号を確かめよう（上が正、下が負）。`},{v:PAIR(-x,-y),why:J`x座標・y座標の符号を確かめよう。`}]),exp:J`右へ ${num(x)}、上へ ${num(y)} → ${PAIR(x,y)}`,tf:v=>J`点${L}の座標は ${v}${coord({pts:[[x,y,L]]})}`,kind:"fig"}; }
function graphEq(){ if(Math.random()<.7){ const [p,q]=pick([[1,1],[2,1],[3,1],[-1,1],[-2,1],[-3,1],[1,2],[-1,2],[2,3],[-2,3],[3,2],[-3,2]]); const x=q===1?(Math.abs(p)>=3?2:pick([2,3])):q, y=p*x/q;
    const eqs=(a,b)=>`${V("y")} = ${coef(a,b)}${V("x")}`; const g=coord({line:[p,q],pts:[[x,y,""]]});
    const L=[{v:Math.abs(p)===q?null:eqs(q*Math.sign(p),Math.abs(p)),why:J`比例定数は y ÷ x。グラフの点 (${num(x)}, ${num(y)}) から a = ${num(y)}÷${par(x)}。`},{v:eqs(-p,q),why:J`右上がりなら比例定数は正、右下がりなら負です。`},{v:`${V("y")} = ${fr(num(x*y),V("x"))}`,why:J`原点を通る直線は比例のグラフです。y = a/x は反比例（双曲線）。`},{v:q===1?eqs(p+Math.sign(p),1):null,why:J`点の座標を読み直そう。x が 1 増えると y は a だけ増えます。`}];
    return {q:J`グラフの式は？${g}`,ans:eqs(p,q),wrongs:W(eqs(p,q),L),exp:J`点 (${num(x)}, ${num(y)}) を通る → a = ${num(y)}÷${par(x)} = ${q===1?num(p):(p<0?M:"")+fr(Math.abs(p),q)}`,tf:v=>J`グラフの式は ${v}${g}`,kind:"fig"}; }
  const a=pick([6,-6,4,-4,8,-8,12,-12]); const x=pick([1,2,3,4,6].filter(d=>Math.abs(a)%d===0&&Math.abs(a/d)<=6&&d<=6)); const g=coord({hyp:a,pts:[[x,a/x,""]]});
  return {q:J`グラフの式は？${g}`,ans:`${V("y")} = ${fr(num(a),V("x"))}`,wrongs:W(`${V("y")} = ${fr(num(a),V("x"))}`,[{v:`${V("y")} = ${coef(a,1)}${V("x")}`,why:J`双曲線は反比例のグラフです。比例 y = ax のグラフは原点を通る直線。`},{v:`${V("y")} = ${fr(num(-a),V("x"))}`,why:J`グラフがどの象限にあるかで符号を確かめよう。`},{v:`${V("y")} = ${fr(num(a/x),V("x"))}`,why:J`反比例の比例定数は x × y。点 (`+num(x)+", "+num(a/x)+J`) から a = `+num(a)+J`。`}]),exp:J`点 (${num(x)}, ${num(a/x)}) を通る → a = ${num(x)}×${par(a/x)} = ${num(a)}`,tf:v=>J`グラフの式は ${v}${g}`,kind:"fig"}; }
function whichRel(){ const t=pick(["p","i","n"]); const xs=[1,2,3,4,6]; let ys; const a=NZ(2,6)*pick([1,-1]);
  if(t==="p") ys=xs.map(x=>a*x); else if(t==="i") ys=xs.map(x=>12*Math.sign(a)/x*(Math.abs(a)%2?1:1)); else { const b=NZ(1,5); ys=xs.map(x=>a*x+b); }
  const tbl=`<table class="mt"><tr><th>${V("x")}</th>${xs.map(x=>`<td>${x}</td>`).join("")}</tr><tr><th>${V("y")}</th>${ys.map(y=>`<td>${num(y)}</td>`).join("")}</tr></table>`;
  const A={p:J`比例`,i:J`反比例`,n:J`どちらでもない`}; const why={p:J`比例なら、y ÷ x がいつも同じ（x が2倍、3倍…になると y も2倍、3倍…）。`,i:J`反比例なら、x × y がいつも同じ（x が2倍になると y は 1/2 倍）。`,n:J`y ÷ x も x × y も一定でなければ、どちらでもありません。`};
  return {q:J`表の ${V("x")} と ${V("y")} の関係は？${tbl}`,ans:A[t],wrongs:[...Object.keys(A).filter(k=>k!==t).map(k=>({v:A[k],why:why[t]})),{v:J`xとyは関係がない`,why:J`x の値を決めると y の値が1つに決まります。y は x の関数です。`}],exp:t==="p"?J`y÷x がいつも ${num(a)} → 比例`:t==="i"?J`x×y がいつも ${num(12*Math.sign(a))} → 反比例`:J`y÷x も x×y も一定ではない`,tf:v=>J`表の関係は「${v}」${tbl}`,kind:"fig"}; }

/* ========== 平面図形（B(1)） ========== */
function moveFig(){ const S=22,Wd=11,Ht=8; const P=([x,y])=>`${8+x*S},${8+(Ht-y)*S}`; const base=[[0,0],[3,0],[0,2]];
  const ox=R(1,2),oy=R(2,4); const F=base.map(([x,y])=>[x+ox,y+oy]); const t=pick(["tr","ref","rot"]); let G,extra="";
  const lx=ox+4; // 対称の軸 x=lx
  const O=[lx+1,oy];
  if(t==="tr"){ const dx=R(4,6),dy=R(-2,1); G=F.map(([x,y])=>[x+dx,y+dy]); }
  else if(t==="ref"){ G=F.map(([x,y])=>[2*lx-x,y]); }
  else { G=F.map(([x,y])=>[2*O[0]-x,2*O[1]-y]); }
  if(G.some(([x,y])=>x<0||x>Wd||y<0||y>Ht)) return moveFig();
  let b=""; for(let i=0;i<=Wd;i++) b+=`<line x1="${8+i*S}" y1="8" x2="${8+i*S}" y2="${8+Ht*S}" class="g"/>`; for(let j=0;j<=Ht;j++) b+=`<line x1="8" y1="${8+j*S}" x2="${8+Wd*S}" y2="${8+j*S}" class="g"/>`;
  b+=`<line x1="${8+lx*S}" y1="4" x2="${8+lx*S}" y2="${12+Ht*S}" class="dl"/><text x="${12+lx*S}" y="18" class="lb">ℓ</text>`;
  b+=`<circle cx="${8+O[0]*S}" cy="${8+(Ht-O[1])*S}" r="3.5" class="pt"/><text x="${13+O[0]*S}" y="${4+(Ht-O[1])*S}" class="lb">O</text>`;
  b+=`<polygon points="${F.map(P).join(" ")}" class="f1"/><polygon points="${G.map(P).join(" ")}" class="f2"/>`;
  b+=J`<text x="${P(F[0]).split(",")[0]*1+4}" y="${P(F[0]).split(",")[1]*1-6}" class="lb">ア</text><text x="${P(G[0]).split(",")[0]*1+(t==="tr"?4:-16)}" y="${P(G[0]).split(",")[1]*1+(t==="rot"?16:-6)}" class="lb">イ</text>`;
  const g=SV(16+Wd*S,16+Ht*S,b); const A={tr:J`平行移動`,ref:J`対称移動（直線ℓが軸）`,rot:J`回転移動（点Oが中心）`};
  const why={tr:J`平行移動は、図形を同じ方向に同じ長さだけずらす移動。向きは変わりません。`,ref:J`対称移動は、直線ℓを折り目にして裏返す移動。左右が反対になります。`,rot:J`回転移動は、点Oを中心に回す移動。イはアを点Oのまわりに180°回したものです。`};
  return {q:J`アをイに重ねる移動は？${g}`,ans:A[t],wrongs:[...Object.keys(A).filter(k=>k!==t).map(k=>({v:A[k],why:why[t]})),{v:J`拡大（大きさを変える）`,why:J`アとイは形も大きさも同じです。移動では大きさは変わりません。`}],exp:why[t],tf:v=>J`アをイに重ねる移動は ${v}${g}`,kind:"fig"}; }
const construct=bank([
 [J`線分ABの垂直二等分線上の点は？`,J`2点A、Bからの距離が等しい`,[[J`2つの辺からの距離が等しい`,J`それは角の二等分線上の点の性質です。`],[J`点Aからの距離がいつも同じ`,J`それは点Aを中心とする円の上の点です。`],[J`直線ABからの距離が等しい`,J`それは直線ABに平行な直線の上の点です。`]],J`垂直二等分線上の点は、線分の両端から等しい距離にある`],
 [J`∠AOBの二等分線上の点は？`,J`辺OA、OBからの距離が等しい`,[[J`2点A、Bからの距離が等しい`,J`それは線分ABの垂直二等分線上の点の性質です。`],[J`点Oからの距離がいつも同じ`,J`それは点Oを中心とする円の上の点です。`],[J`辺OAと垂直に交わる`,J`角の二等分線は、角を2等分する半直線です。`]],J`角の二等分線上の点は、角の2辺から等しい距離にある`],
 [J`円の接線と、接点を通る半径の関係は？`,J`垂直に交わる`,[[J`平行`,J`接線と半径は接点で交わります。`],[J`45°で交わる`,J`接線は接点を通る半径に垂直です。`],[J`重なる`,J`接線は円と1点だけで交わる直線です。`]],J`円の接線は、接点を通る半径に垂直`],
 [J`点Pから直線ℓまでの距離を表す線分は？`,J`Pからℓにひいた垂線`,[[J`Pからℓへのいちばん長い線分`,J`距離は「いちばん短い」長さです。`],[J`ℓに平行な線分`,J`平行な線はℓと交わりません。`],[J`Pを中心とする円の半径`,J`垂線の長さが点と直線の距離です。`]],J`点と直線の距離は、点から直線にひいた垂線の長さ`],
 [J`3点A、B、Cから等しい距離にある点を作図するには？`,J`線分AB、BCの垂直二等分線の交点`,[[J`∠A、∠Bの二等分線の交点`,J`角の二等分線は、辺からの距離が等しい点です。`],[J`線分AB、BCの中点を結ぶ`,J`2点から等しい距離の点は垂直二等分線の上にあります。`],[J`点Aから辺BCへの垂線`,J`3点からの距離が等しい点は、垂直二等分線を2本ひいて求めます。`]],J`2点から等しい距離＝垂直二等分線。2本の交点が3点から等しい`],
 [J`作図に使う道具は？`,J`定規とコンパスだけ`,[[J`定規と分度器`,J`作図では分度器は使いません。角度ははかりません。`],[J`コンパスと三角定規の目もり`,J`作図では長さを目もりではかりません。`],[J`分度器だけ`,J`作図は定規（線をひく）とコンパス（円をかく・長さを移す）で行います。`]],J`作図は定規とコンパスだけを使う`],
 [J`30°の角を作図するには？`,J`正三角形で60°を作り、二等分する`,[[J`分度器で30°をはかる`,J`作図では分度器を使いません。`],[J`90°を3つに分ける垂線をひく`,J`垂線では90°しか作れません。60°の二等分で30°です。`],[J`円を6等分する`,J`円の6等分は60°ずつです。`]],J`60°（正三角形の角）を角の二等分線で2等分`],
 [J`線分ABの中点を作図するには？`,J`線分ABの垂直二等分線とABの交点`,[[J`∠Aの二等分線とABの交点`,J`中点は線分の垂直二等分線で求めます。`],[J`点Aを中心にABを半径とする円`,J`それはAから同じ距離の点です。`],[J`点Bからの垂線`,J`中点は両端から等しい距離の点です。`]],J`垂直二等分線は線分の中点を通る`],
]);
const symbols=bank([
 [J`AB ∥ CD の意味は？`,J`ABとCDは平行`,[[J`ABとCDは垂直`,J`垂直の記号は ⊥ です。`],[J`ABとCDの長さが等しい`,J`長さが等しいときは AB = CD と書きます。`],[J`ABとCDが交わる`,J`∥ は平行の記号です。`]],J`∥ は平行`],
 [J`AB ⊥ CD の意味は？`,J`ABとCDは垂直`,[[J`ABとCDは平行`,J`平行の記号は ∥ です。`],[J`ABとCDの長さが等しい`,J`長さが等しいときは AB = CD。`],[J`ABはCDより長い`,J`⊥ は垂直の記号です。`]],J`⊥ は垂直`],
 [J`円周上の2点を結んだ線分を何という？`,J`弦`,[[J`弧`,J`弧は円周の一部（曲線）です。`],[J`半径`,J`半径は中心と円周上の点を結ぶ線分です。`],[J`接線`,J`接線は円と1点で交わる直線です。`]],J`円周上の2点を結ぶ線分＝弦`],
 [J`円周の一部分を何という？`,J`弧`,[[J`弦`,J`弦は2点を結ぶ線分（まっすぐ）です。`],[J`おうぎ形`,J`おうぎ形は2本の半径と弧で囲まれた図形です。`],[J`中心角`,J`中心角は角度です。`]],J`円周の一部＝弧`],
 [J`2本の半径と弧で囲まれた図形を何という？`,J`おうぎ形`,[[J`弓形`,J`弓形は弦と弧で囲まれた図形です。`],[J`半円`,J`半円は中心角180°のおうぎ形だけを指します。`],[J`扇の弦`,J`おうぎ形が正しい名前です。`]],J`2本の半径と弧＝おうぎ形`],
 [J`両方向に限りなくのびたまっすぐな線を何という？`,J`直線`,[[J`線分`,J`線分は両端がある（長さが決まっている）線です。`],[J`半直線`,J`半直線は一方だけに限りなくのびる線です。`],[J`弧`,J`弧は円周の一部です。`]],J`両方向にのびる＝直線`],
 [J`一方の端があり、もう一方に限りなくのびる線を何という？`,J`半直線`,[[J`直線`,J`直線は両方向にのびます。`],[J`線分`,J`線分は両端があります。`],[J`弦`,J`弦は円周上の2点を結ぶ線分です。`]],J`片方にのびる＝半直線`],
 [J`∠ABC の頂点は？`,J`点B`,[[J`点A`,J`∠ABC は真ん中の文字が頂点です。`],[J`点C`,J`∠ABC は真ん中の文字が頂点です。`],[J`辺AC`,J`頂点は点です。`]],J`∠ABC は B が頂点`],
]);

/* ========== 空間図形（B(2)） ========== */
// おうぎ形：r×a/180（弧）、r²×a/360（面積）が整数になる組
function sectorPair(f){ for(let i=0;i<60;i++){ const r=R(2,12),a=pick([30,45,60,90,120,135,150,180,210,240,270,300]); const v=f(r,a); if(Number.isInteger(v)&&v>0&&v<=200) return [r,a]; } return [6,60]; }
function sectorFig(r,a){ const c=60,R0=50,rad=a*Math.PI/180; const x2=c+R0*Math.cos(-rad),y2=c+R0*Math.sin(-rad);
  return SV(120,120,`<path d="M${c} ${c} L${c+R0} ${c} A${R0} ${R0} 0 ${a>180?1:0} 0 ${x2.toFixed(1)} ${y2.toFixed(1)} Z" class="f1"/><text x="${c+R0/2-6}" y="${c+14}" class="nm">${r}cm</text><text x="${c+8}" y="${c-6}" class="nm">${a}°</text>`); }
function arc(){ const [r,a]=sectorPair((r,a)=>r*a/180); const v=r*a/180; const ans=PI(v)+" cm";
  return {q:J`半径 ${r}cm、中心角 ${a}° のおうぎ形の弧の長さは？${sectorFig(r,a)}`,ans,wrongs:W(ans,[{v:Number.isInteger(r*r*a/360)?PI(r*r*a/360)+" cm":null,why:J`πr²×中心角/360 は面積の式です。弧の長さは 2πr×中心角/360。`},{v:PI(2*r)+" cm",why:J`円周 2πr に、中心角/360（${a}/360）をかけます。`},{v:Number.isInteger(r*a/360)?PI(r*a/360)+" cm":null,why:J`円周は 2πr です（πr ではありません）。`},{v:PI(v*2)+" cm",why:J`円周は 2πr。2倍しすぎていないか確かめよう。`}]),exp:`2π×${r}×${fr(a,360)} = ${PI(v)}`,tf:v=>J`半径 ${r}cm、中心角 ${a}° の弧の長さは ${v}`,kind:"word"}; }
function sector(){ const [r,a]=sectorPair((r,a)=>r*r*a/360); const v=r*r*a/360; const ans=PI(v)+" cm²";
  return {q:J`半径 ${r}cm、中心角 ${a}° のおうぎ形の面積は？${sectorFig(r,a)}`,ans,wrongs:W(ans,[{v:Number.isInteger(r*a/180)?PI(r*a/180)+" cm²":null,why:J`2πr×中心角/360 は弧の長さの式です。面積は πr²×中心角/360。`},{v:PI(r*r)+" cm²",why:J`円の面積 πr² に、中心角/360（${a}/360）をかけます。`},{v:Number.isInteger(2*r*a/360)?PI(2*r*a/360)+" cm²":null,why:J`面積は半径を2回かけます（πr²）。`},{v:PI(v*2)+" cm²",why:J`πr²×中心角/360。2倍しないよう確かめよう。`}]),exp:`π×${r}²×${fr(a,360)} = ${PI(v)}`,tf:v=>J`半径 ${r}cm、中心角 ${a}° の面積は ${v}`,kind:"word"}; }
function volume(){ const t=pick(["prism","pyr","cyl","cone","sph"]);
  if(t==="prism"){ const a=R(2,6),b=R(2,6),h=R(2,9),v=a*b*h; return {q:J`底面が ${a}cm×${b}cm の長方形、高さ ${h}cm の四角柱の体積は？`,ans:v+" cm³",wrongs:W(v+" cm³",[{v:Math.round(v/3)===v/3?v/3+" cm³":null,why:J`柱の体積は 底面積×高さ。1/3 をかけるのは錐です。`},{v:(a*b+h)+" cm³",why:J`底面積と高さはかけ算です。`},{v:2*(a*b+b*h+a*h)+" cm³",why:J`それは表面積です。`},{v:(a+b)*h+" cm³",why:J`底面積は ${a}×${b}。`}]),exp:`${a}×${b}×${h} = ${v}`,tf:x=>J`この四角柱の体積は ${x}`,kind:"word"}; }
  if(t==="pyr"){ const a=R(2,6),h=3*R(1,4),v=a*a*h/3; return {q:J`底面が1辺 ${a}cm の正方形、高さ ${h}cm の正四角錐の体積は？`,ans:v+" cm³",wrongs:W(v+" cm³",[{v:a*a*h+" cm³",why:J`錐の体積は 底面積×高さ×1/3。1/3 を忘れています。`},{v:a*h/3+" cm³",why:J`底面積は ${a}×${a} です。`},{v:a*a*h/2+" cm³",why:J`錐は 1/2 ではなく 1/3 をかけます。`}]),exp:`${fr(1,3)}×${a}²×${h} = ${v}`,tf:x=>J`この正四角錐の体積は ${x}`,kind:"word"}; }
  if(t==="cyl"){ const r=R(1,6),h=R(2,9),v=r*r*h; return {q:J`底面の半径 ${r}cm、高さ ${h}cm の円柱の体積は？`,ans:PI(v)+" cm³",wrongs:W(PI(v)+" cm³",[{v:PI(2*r*h)+" cm³",why:J`底面積は πr²（2πr は円周）。`},{v:Number.isInteger(v/3)?PI(v/3)+" cm³":PI(4*r*r*h)+" cm³",why:Number.isInteger(v/3)?J`1/3 をかけるのは円錐です。円柱は 底面積×高さ。`:J`半径を使います（直径ではありません）。`},{v:PI(r*h)+" cm³",why:J`底面積は π×半径×半径。`}]),exp:`π×${r}²×${h} = ${PI(v)}`,tf:x=>J`この円柱の体積は ${x}`,kind:"word"}; }
  if(t==="cone"){ const r=R(1,6),h=3*R(1,4),v=r*r*h/3; return {q:J`底面の半径 ${r}cm、高さ ${h}cm の円錐の体積は？`,ans:PI(v)+" cm³",wrongs:W(PI(v)+" cm³",[{v:PI(r*r*h)+" cm³",why:J`錐の体積は 底面積×高さ×1/3。1/3 を忘れています。`},{v:PI(2*r*h/3)+" cm³",why:J`底面積は πr²（2πr は円周）。`},{v:PI(r*h/3)+" cm³",why:J`底面積は π×半径×半径。`}]),exp:`${fr(1,3)}×π×${r}²×${h} = ${PI(v)}`,tf:x=>J`この円錐の体積は ${x}`,kind:"word"}; }
  const r=3*R(1,2),v=4*r*r*r/3; return {q:J`半径 ${r}cm の球の体積は？`,ans:PI(v)+" cm³",wrongs:W(PI(v)+" cm³",[{v:PI(4*r*r)+" cm³",why:J`4πr² は球の表面積です。体積は 4/3πr³。`},{v:PI(r*r*r)+" cm³",why:J`球の体積は 4/3πr³。4/3 をかけます。`},{v:PI(4*r*r*r)+" cm³",why:J`4/3 の「3でわる」を忘れています。`}]),exp:`${fr(4,3)}π×${r}³ = ${PI(v)}`,tf:x=>J`この球の体積は ${x}`,kind:"word"}; }
function surface(){ const t=pick(["box","cube","cyl","sph"]);
  if(t==="box"){ const a=R(2,6),b=R(2,6),c=R(2,6),s=2*(a*b+b*c+a*c); return {q:J`縦 ${a}cm、横 ${b}cm、高さ ${c}cm の直方体の表面積は？`,ans:s+" cm²",wrongs:W(s+" cm²",[{v:(a*b+b*c+a*c)+" cm²",why:J`同じ形の面が2つずつあります。3種類の面積の和を2倍します。`},{v:a*b*c+" cm²",why:J`それは体積です。`},{v:6*a*b+" cm²",why:J`立方体ではないので、6つの面の大きさは同じではありません。`}]),exp:`2×(${a}×${b} + ${b}×${c} + ${a}×${c}) = ${s}`,tf:x=>J`この直方体の表面積は ${x}`,kind:"word"}; }
  if(t==="cube"){ const a=R(2,9),s=6*a*a; return {q:J`1辺 ${a}cm の立方体の表面積は？`,ans:s+" cm²",wrongs:W(s+" cm²",[{v:a*a*a+" cm²",why:J`それは体積です。`},{v:4*a*a+" cm²",why:J`立方体の面は6つです。`},{v:6*a+" cm²",why:J`1つの面の面積は ${a}×${a}。`}]),exp:`6×${a}² = ${s}`,tf:x=>J`この立方体の表面積は ${x}`,kind:"word"}; }
  if(t==="cyl"){ const r=R(1,5),h=R(2,8),s=2*r*r+2*r*h; return {q:J`底面の半径 ${r}cm、高さ ${h}cm の円柱の表面積は？`,ans:PI(s)+" cm²",wrongs:W(PI(s)+" cm²",[{v:PI(r*r+2*r*h)+" cm²",why:J`底面は上と下の2つあります。`},{v:PI(2*r*h)+" cm²",why:J`側面だけでなく、底面2つも加えます。`},{v:PI(2*r*r+r*h)+" cm²",why:J`側面は長方形で、横の長さは円周 2πr です。`}]),exp:J`底面 π×${r}²×2 + 側面 ${h}×2π×${r} = ${PI(s)}`,tf:x=>J`この円柱の表面積は ${x}`,kind:"word"}; }
  const r=R(1,6),s=4*r*r; return {q:J`半径 ${r}cm の球の表面積は？`,ans:PI(s)+" cm²",wrongs:W(PI(s)+" cm²",[{v:Number.isInteger(4*r*r*r/3)?PI(4*r*r*r/3)+" cm²":PI(r*r)+" cm²",why:Number.isInteger(4*r*r*r/3)?J`4/3πr³ は体積です。表面積は 4πr²。`:J`球の表面積は 4πr²。4をかけます。`},{v:PI(2*r*r)+" cm²",why:J`球の表面積は 4πr²。`},{v:PI(4*r)+" cm²",why:J`半径を2回かけます（r²）。`}]),exp:`4π×${r}² = ${PI(s)}`,tf:x=>J`この球の表面積は ${x}`,kind:"word"}; }
// 直方体ABCD-EFGHの辺の位置関係
const BOXP={A:[0,0,1],B:[1,0,1],C:[1,1,1],D:[0,1,1],E:[0,0,0],F:[1,0,0],G:[1,1,0],H:[0,1,0]};
const EDGES=["AB","BC","CD","DA","EF","FG","GH","HE","AE","BF","CG","DH"];
function rel(e1,e2){ const d=e=>BOXP[e[1]].map((v,i)=>v-BOXP[e[0]][i]); const a=d(e1),b=d(e2); const par=a.every((v,i)=>Math.abs(v)===Math.abs(b[i])); if(par) return "par"; if([...e1].some(c=>e2.includes(c))) return "cross"; return "skew"; }
function boxFig(){ const s=70,dx=34,dy=-26,ox=26,oy=118; const p=n=>{ const [x,y,z]=BOXP[n]; return [ox+x*s*1.3+y*dx, oy-z*s+y*dy]; };
  const hidden=new Set(["HE","GH","DH"]); let b="";
  for(const e of EDGES){ const [x1,y1]=p(e[0]),[x2,y2]=p(e[1]); b+=`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${hidden.has(e)||hidden.has(e[1]+e[0])?"dl":"ax"}"/>`; }
  for(const n in BOXP){ const [x,y]=p(n); const ofs={A:[-12,-4],B:[4,-4],C:[4,-4],D:[-12,-4],E:[-12,12],F:[4,12],G:[4,10],H:[-14,4]}[n]; b+=`<text x="${x+ofs[0]}" y="${y+ofs[1]}" class="lb">${n}</text>`; }
  return SV(200,140,b); }
function position(){ const e=pick(EDGES); const ty=pick(["par","cross","skew"]); const same=EDGES.filter(x=>x!==e&&rel(e,x)===ty), other=EDGES.filter(x=>x!==e&&rel(e,x)!==ty);
  const NM={par:J`平行な辺`,cross:J`交わる辺`,skew:J`ねじれの位置にある辺`}; const WHY={par:J`平行（同じ向きで交わらない）`,cross:J`交わる（頂点を共有している）`,skew:J`ねじれの位置（平行でも交わってもいない）`};
  const ans=pick(same); const ws=shuffle(other).slice(0,3).map(x=>({v:J`辺`+x,why:J`辺${x}は辺${e}と${WHY[rel(e,x)]}です。`})); const f=boxFig();
  const q=J`直方体で、辺${e}と${NM[ty]}は？${f}`; return {q,ans:J`辺`+ans,wrongs:ws,exp:J`辺${e}と${NM[ty]}：${same.map(x=>J`辺`+x).join(J`、`)}`,tf:v=>JA()?J`辺${e}と${v}は「${NM[ty].replace(J`にある辺`,"").replace(J`な辺`,"").replace(J`る辺`,J`る`)}」${f}`:`${q}<br>→ ${v}`,kind:"fig"}; }

/* ========== データの活用（D(1)(2)） ========== */
function dataset(){ const w=pick([5,10]),st=w===5?pick([140,145,150]):pick([30,40,50]); const T=pick([20,25,50]); const wt=[1,2,3,2,1];
  for(let k=0;k<200;k++){ const f=[1,1,1,1,1]; const sh=R(-1,1); for(let i=5;i<T;i++){ let r=Math.random()*9,j=0; while(r>wt[j]){ r-=wt[j]; j++; } j=Math.min(4,Math.max(0,j+(Math.random()<.3?sh:0))); f[j]++; }
    if(new Set(f).size>=4) return {w,st,f,T,unit:w===5?"cm":J`点`,cls:f.map((_,i)=>[st+i*w,st+(i+1)*w])}; }
  return dataset(); }
const tbl=D0=>J`<table class="mt"><tr><th>階級（${D0.unit}）</th><th>度数</th></tr>${D0.cls.map(([a,b],i)=>J`<tr><td>${a}以上〜${b}未満</td><td>${D0.f[i]}</td></tr>`).join("")}<tr><th>合計</th><th>${D0.T}</th></tr></table>`;
function histo(D0){ const S=34,H=110,mx=Math.max(...D0.f); let b="";
  D0.f.forEach((v,i)=>{ const h=v/mx*(H-10); b+=`<rect x="${30+i*S}" y="${10+H-h}" width="${S}" height="${h}" class="f1"/>`; b+=`<text x="${30+i*S}" y="${H+24}" class="nm" text-anchor="middle">${D0.cls[i][0]}</text>`; });
  b+=`<text x="${30+D0.f.length*S}" y="${H+24}" class="nm" text-anchor="middle">${D0.cls[D0.f.length-1][1]}</text>`;
  for(let v=0;v<=mx;v+=Math.max(1,Math.round(mx/4))){ const y=10+H-v/mx*(H-10); b+=`<line x1="26" y1="${y}" x2="${32+D0.f.length*S}" y2="${y}" class="g"/><text x="22" y="${y+4}" class="nm" text-anchor="end">${v}</text>`; }
  b+=`<line x1="30" y1="${10+H}" x2="${32+D0.f.length*S}" y2="${10+H}" class="ax"/><text x="${40+D0.f.length*S}" y="${H+24}" class="nm">(${D0.unit})</text>`;
  return SV(70+D0.f.length*S,H+32,b); }
function freq(){ const D0=dataset(),i=R(0,4),[a,b]=D0.cls[i]; const t=pick(["f","mid","tot"]); const T=tbl(D0);
  if(t==="f") return {q:J`${a}${D0.unit}以上${b}${D0.unit}未満の階級の度数は？${T}`,ans:String(D0.f[i]),wrongs:W(D0.f[i],[{v:i<4?D0.f[i+1]:D0.f[i-1],why:J`「${a}以上${b}未満」の行を見よう。となりの階級を見ています。`},{v:D0.f.slice(0,i+1).reduce((x,y)=>x+y,0),why:J`度数はその階級だけの数です（累積度数ではありません）。`}],D0.f[i]),exp:J`表の「${a}以上〜${b}未満」の行`,tf:v=>J`${a}以上${b}未満の階級の度数は ${v}${T}`,kind:"fig"};
  if(t==="mid"){ const m=(a+b)/2; return {q:J`${a}${D0.unit}以上${b}${D0.unit}未満の階級の階級値は？`,ans:String(m),wrongs:W(m,[{v:a,why:J`階級値は階級の真ん中の値です（端の値ではありません）。`},{v:b,why:J`階級値は (以上の値＋未満の値)÷2。`},{v:D0.w,why:J`それは階級の幅です。`}]),exp:`(${a}+${b})÷2 = ${m}`,tf:v=>J`${a}以上${b}未満の階級値は ${v}`,kind:"word"}; }
  return {q:J`度数の合計は？（合計の行をかくしています）${T.replace(/<tr><th>[^<]*<\/th><th>\d+<\/th><\/tr>(?=<\/table>)/,"")}`,ans:String(D0.T),wrongs:W(D0.T,[{v:D0.f.length,why:J`それは階級の数です。度数をすべてたします。`},{v:Math.max(...D0.f),why:J`いちばん多い度数ではなく、すべての度数の和です。`}],D0.T),exp:D0.f.join("+")+" = "+D0.T,tf:v=>J`度数の合計は ${v}`,kind:"fig"}; }
function histRead(){ const D0=dataset(); const g=histo(D0); const mi=D0.f.indexOf(Math.max(...D0.f)); const t=pick(["mode","over"]);
  if(t==="mode"&&D0.f.filter(x=>x===D0.f[mi]).length===1){ const ans=J`${D0.cls[mi][0]}以上${D0.cls[mi][1]}未満`; return {q:J`度数がいちばん多い階級は？${g}`,ans,wrongs:D0.cls.filter((_,i)=>i!==mi).slice(0,3).map(([a,b])=>({v:J`${a}以上${b}未満`,why:J`ヒストグラムでいちばん高い長方形の階級を選びます。`})),exp:J`いちばん高い長方形`,tf:v=>J`度数がいちばん多い階級は ${v}${g}`,kind:"fig"}; }
  const k=R(2,4), s=D0.f.slice(k).reduce((a,b)=>a+b,0); return {q:J`${D0.cls[k][0]}${D0.unit}以上は何人？${g}`,ans:s+J`人`,wrongs:W(s+J`人`,[{v:D0.f[k]+J`人`,why:J`${D0.cls[k][0]}以上のすべての階級をたします（その階級だけではありません）。`},{v:(D0.T-s)+J`人`,why:J`それは ${D0.cls[k][0]} 未満の人数です。`},{v:(s+D0.f[k-1])+J`人`,why:J`${D0.cls[k-1][0]}以上${D0.cls[k][0]}未満の階級は入りません。`}]),exp:D0.f.slice(k).join("+")+" = "+s,tf:v=>J`${D0.cls[k][0]}以上は ${v}${g}`,kind:"fig"}; }
const dec=x=>String(Math.round(x*100)/100);
function relFreq(){ const D0=dataset(),i=R(0,4),[a,b]=D0.cls[i],T=tbl(D0); const ans=dec(D0.f[i]/D0.T); const cum=D0.f.slice(0,i+1).reduce((x,y)=>x+y,0);
  return {q:J`${a}以上${b}未満の階級の相対度数は？${T}`,ans,wrongs:W(ans,[{v:Number.isInteger(D0.T/D0.f[i]*100)?dec(D0.T/D0.f[i]):null,why:J`相対度数は その階級の度数 ÷ 度数の合計。わる順番が反対です。`},{v:dec(D0.f[i]/D0.T*100),why:J`相対度数は百分率（%）ではなく、1以下の小数で表します。`},{v:i?dec(cum/D0.T):null,why:J`それは累積相対度数です。その階級の度数だけを使います。`},{v:dec(D0.f[i]/100),why:J`度数の合計（${D0.T}）でわります。`}]),exp:`${D0.f[i]}÷${D0.T} = ${ans}`,tf:v=>J`${a}以上${b}未満の相対度数は ${v}${T}`,kind:"fig"}; }
function cumFreq(){ const D0=dataset(),k=R(1,4),T=tbl(D0); const c=D0.f.slice(0,k+1).reduce((x,y)=>x+y,0); const t=Math.random()<.6;
  if(t) return {q:J`${D0.cls[k][1]}${D0.unit}未満の累積度数は？${T}`,ans:String(c),wrongs:W(c,[{v:D0.f[k],why:J`累積度数は、最初の階級からその階級までの度数をすべてたした数です。`},{v:c-D0.f[k],why:J`${D0.cls[k][0]}以上${D0.cls[k][1]}未満の階級も入れます。`},{v:D0.T-c,why:J`それは ${D0.cls[k][1]} 以上の度数です。`}],c),exp:D0.f.slice(0,k+1).join("+")+" = "+c,tf:v=>J`${D0.cls[k][1]}未満の累積度数は ${v}${T}`,kind:"fig"};
  const ans=dec(c/D0.T); return {q:J`${D0.cls[k][1]}${D0.unit}未満の累積相対度数は？${T}`,ans,wrongs:W(ans,[{v:dec(D0.f[k]/D0.T),why:J`それはその階級だけの相対度数です。累積度数を合計でわります。`},{v:String(c),why:J`累積相対度数は 累積度数÷合計 の小数です。`},{v:dec((D0.T-c)/D0.T),why:J`それは ${D0.cls[k][1]} 以上の割合です。`}]),exp:`(${D0.f.slice(0,k+1).join("+")})÷${D0.T} = ${c}÷${D0.T} = ${ans}`,tf:v=>J`${D0.cls[k][1]}未満の累積相対度数は ${v}${T}`,kind:"fig"}; }
function probTrial(){ const n=pick([200,500,1000,2000]),pp=pick([12,23,27,34,38,42,46,55,58,63,71]),k=n*pp/100; const thing=pick([[J`ペットボトルのキャップ`,J`表向き`],[J`画びょう`,J`針が上向き`],[J`紙コップ`,J`横向き`],[J`ボタン`,J`表`]]);
  const ans=dec(pp/100); return {q:J`${thing[0]}を ${n} 回投げたら、${thing[1]}が ${k} 回でした。${thing[1]}になる確率はおよそ？`,ans,wrongs:W(ans,[{v:dec(1-pp/100),why:J`それは「${thing[1]}にならない」確率です。`},{v:"0.5",why:J`表と裏の出やすさが同じとはかぎりません。実験の結果から求めます。`},{v:String(k/100),why:J`投げた回数（${n}回）でわります。`},{v:String(pp),why:J`確率は 0〜1 の数で表します。`}]),exp:J`${k}÷${n} = ${ans}（多くの回数をくり返すと、相対度数が確率に近づく）`,tf:v=>J`${thing[1]}になる確率はおよそ ${v}（${n}回中${k}回）`,kind:"word"}; }

/* ==================== 中2 ==================== */
const mono=(c,v)=>term(c,v,true);
const pm=(c,v)=>c<0?`(${mono(c,v)})`:mono(c,v);
const frc=(n,d)=>{ if(d<0){n=-n;d=-d;} const g=gcd(n,d)||1; n/=g; d/=g; return d===1?num(n):(n<0?M:"")+fr(Math.abs(n),d); };
const XY=(x,y)=>`${V("x")} = ${num(x)}, ${V("y")} = ${num(y)}`;
const DEG=v=>`${v}°`;

/* ---------- A(1) 式の計算 ---------- */
function polyAdd(){ const a1=NZ(-7,7),b1=NZ(-7,7),a2=NZ(-7,7),b2=NZ(-7,7),sub=Math.random()<.6,s=sub?-1:1; const A=a1+s*a2,B=b1+s*b2; if(!A||!B) return polyAdd();
  const P=(a,b)=>poly([[a,"a"],[b,"b"]]); const q=`(${P(a1,b1)}) ${sub?M:"+"} (${P(a2,b2)})`; const ans=P(A,B);
  const L=[{v:sub?P(a1+a2,b1+b2):null,why:J`ひくときは、うしろのかっこの中の符号をすべて変えます。`},{v:sub?P(a1-a2,b1+b2):null,why:J`うしろのかっこの ${V("b")} の項の符号も変えます。`},{v:A+B?mono(A+B,"ab"):null,why:J`${V("a")} と ${V("b")} は文字がちがうので、1つにまとめられません。`},{v:P(A,-B),why:J`${V("b")} の項の符号を確かめよう。`},{v:P(-A,-B),why:J`符号を確かめよう。`}];
  return {q,ans,wrongs:W(ans,L),exp:J`${V("a")} の項：${num(a1)} ${sub?M:"+"} ${par(a2)} = ${num(A)}、${V("b")} の項：${num(b1)} ${sub?M:"+"} ${par(b2)} = ${num(B)}`,tf:v=>`${q} = ${v}`,kind:"expr"}; }
function polyNum(){ const t=pick([0,1,2]); const P=(a,b)=>poly([[a,"x"],[b,"y"]]);
  if(t===0){ const k=NZ(-5,5),a=NZ(-5,5),b=NZ(-5,5); if(Math.abs(k)===1) return polyNum(); const q=`${num(k)}(${P(a,b)})`, ans=P(k*a,k*b);
    return {q,ans,wrongs:W(ans,[{v:P(k*a,b),why:J`${V("y")} の項にも ${num(k)} をかけます。`},{v:P(k*a,-k*b),why:J`かけ算の符号を確かめよう。`},{v:P(k+a,k+b),why:J`かっこの外の数は、中の各項に「かけ」ます。`},{v:P(-k*a,-k*b),why:J`符号を確かめよう。`}]),exp:`${num(k)}×${par(a)}${V("x")} + ${par(k)}×${par(b)}${V("y")} = ${ans}`,tf:v=>`${q} = ${v}`,kind:"expr"}; }
  if(t===1){ const k=NZ(-4,4),a=NZ(-5,5),b=NZ(-5,5); if(Math.abs(k)===1) return polyNum(); const q=`(${P(k*a,k*b)}) ÷ ${par(k)}`, ans=P(a,b);
    return {q,ans,wrongs:W(ans,[{v:P(a,k*b),why:J`${V("y")} の項も ${num(k)} でわります。`},{v:P(k*k*a,k*k*b),why:J`わり算です。かけていませんか？`},{v:P(a,-b),why:J`わり算の符号を確かめよう。`},{v:P(-a,-b),why:J`符号を確かめよう。`}]),exp:`${mono(k*a,"x")}÷${par(k)} ${k*b<0?M:"+"} ${mono(Math.abs(k*b),"y")}÷${par(k)} = ${ans}`,tf:v=>`${q} = ${v}`,kind:"expr"}; }
  const c1=R(2,4),c2=R(2,4),a1=NZ(-4,4),b1=NZ(-4,4),a2=NZ(-4,4),b2=NZ(-4,4); const A=c1*a1-c2*a2,B=c1*b1-c2*b2; if(!A||!B) return polyNum();
  const q=`${c1}(${P(a1,b1)}) ${M} ${c2}(${P(a2,b2)})`, ans=P(A,B);
  return {q,ans,wrongs:W(ans,[{v:P(A,c1*b1+c2*b2),why:J`うしろのかっこの2つ目の項も、符号を変えます。`},{v:P(A,c1*b1-b2),why:J`うしろのかっこの2つ目の項にも ${c2} をかけます。`},{v:P(c1*a1+c2*a2,c1*b1+c2*b2),why:J`ひき算なので、うしろのかっこの符号はすべて変わります。`},{v:P(-A,-B),why:J`符号を確かめよう。`}]),exp:`${poly([[c1*a1,"x"],[c1*b1,"y"]])} ${M} (${poly([[c2*a2,"x"],[c2*b2,"y"]])}) = ${ans}`,tf:v=>`${q} = ${v}`,kind:"expr"}; }
function monoMD(){ const t=pick([0,1,2,3]); const big=a=>Math.abs(a)>1;
  if(t===0){ const p=NZ(-6,6),q=NZ(-6,6); if(!big(p)||!big(q)) return monoMD(); const Q0=`${mono(p,"a")} × ${pm(q,"b")}`, ans=mono(p*q,"ab");
    return {q:Q0,ans,wrongs:W(ans,[{v:p+q?mono(p+q,"ab"):null,why:J`係数どうしはかけ算です。`},{v:poly([[p,"a"],[q,"b"]]),why:J`かけ算なので、係数どうし・文字どうしをかけて1つの項にします。`},{v:mono(-p*q,"ab"),why:J`符号を確かめよう。`}]),exp:`${num(p)}×${par(q)}×${V("a")}×${V("b")} = ${ans}`,tf:v=>`${Q0} = ${v}`,kind:"expr"}; }
  if(t===1){ const p=NZ(-6,6),q=NZ(-6,6); if(!big(p)||!big(q)) return monoMD(); const Q0=`${mono(p,"a")} × ${pm(q,"a")}`, ans=mono(p*q,"a²");
    return {q:Q0,ans,wrongs:W(ans,[{v:mono(p*q,"a"),why:J`${V("a")}×${V("a")} = ${V("a²")} です。`},{v:mono(2*p*q,"a"),why:J`${V("a")}×${V("a")} は ${V("a")} を2回かけた ${V("a²")}（2${V("a")} ではありません）。`},{v:p+q?mono(p+q,"a²"):null,why:J`係数どうしはかけ算です。`},{v:mono(-p*q,"a²"),why:J`符号を確かめよう。`}]),exp:`${num(p)}×${par(q)}×${V("a")}×${V("a")} = ${ans}`,tf:v=>`${Q0} = ${v}`,kind:"expr"}; }
  if(t===2){ const k=NZ(-6,6),q=NZ(-5,5); if(!big(k)||!big(q)) return monoMD(); const Q0=`${mono(k*q,"ab")} ÷ ${pm(q,"a")}`, ans=mono(k,"b");
    return {q:Q0,ans,wrongs:W(ans,[{v:mono(k,"ab"),why:J`${V("a")} どうしもわります（${V("a")}÷${V("a")} = 1）。`},{v:mono(k*q*q,"ab"),why:J`わり算です。かけていませんか？`},{v:mono(-k,"b"),why:J`わり算の符号を確かめよう。`},{v:mono(k*q*q,"b"),why:J`係数も、わり算で求めます。`}]),exp:`${fr(mono(k*q,"ab"),mono(q,"a"))} = ${ans}`,tf:v=>`${Q0} = ${v}`,kind:"expr"}; }
  const p=NZ(-5,5); if(!big(p)) return monoMD(); const Q0=`(${mono(p,"a")})²`, ans=mono(p*p,"a²");
  return {q:Q0,ans,wrongs:W(ans,[{v:mono(p,"a²"),why:J`係数も2乗します。`},{v:mono(2*p,"a"),why:J`2乗は2倍ではありません。同じものを2回かけます。`},{v:mono(-p*p,"a²"),why:p<0?J`負の数の2乗は正の数です。`:J`符号を確かめよう。`},{v:mono(p*p,"a"),why:J`${V("a")} も2乗します。`}]),exp:`${pm(p,"a")}×${pm(p,"a")} = ${ans}`,tf:v=>`${Q0} = ${v}`,kind:"expr"}; }
function sub2(){ const x=NZ(-4,4),y=NZ(-4,4); const pre=J`${V("a")} = ${num(x)}, ${V("b")} = ${num(y)} のとき、`;
  if(Math.random()<.5){ const c1=NZ(-5,5),c2=NZ(-5,5); const e=poly([[c1,"a"],[c2,"b"]]); const ans=c1*x+c2*y;
    return {q:J`${pre}${e} の値`,ans:num(ans),wrongs:W(ans,[{v:c1*x-c2*y,why:J`符号に注意。${num(c2)}×${par(y)} を計算します。`},{v:c1*y+c2*x,why:J`${V("a")} と ${V("b")} に代入する数を取りちがえていませんか？`},{v:c1+x+c2+y,why:J`係数と文字の間はかけ算です。`}],ans),exp:`${num(c1)}×${par(x)} + ${par(c2)}×${par(y)} = ${num(ans)}`,tf:v=>`${pre}${e} = ${v}`,kind:"sub"}; }
  const k=NZ(-3,3),m=NZ(-3,3); if(Math.abs(m)<2) return sub2(); const e=`${mono(k*m,"a²b")} ÷ ${pm(m,"a")}`; const ans=k*x*y;
  return {q:J`${pre}${e} の値`,ans:num(ans),wrongs:W(ans,[{v:k*m*x*x*y,why:J`÷ ${pm(m,"a")} を忘れています。`},{v:k*x*x*y,why:J`${V("a²")}÷${V("a")} = ${V("a")} です。`},{v:-ans,why:J`符号を確かめよう。`}],ans),exp:J`先に式を簡単にすると ${mono(k,"ab")}。代入して ${num(k)}×${par(x)}×${par(y)} = ${num(ans)}`,tf:v=>`${pre}${e} = ${v}`,kind:"sub"}; }
function trans(){ const t=pick([0,0,1,2,3]);
  if(t===0){ const a=NZ(-5,5),c=NZ(-9,9),s=pick([1,-1]); const lhs=poly([[a,"x"],[s,"y"]]); const q=J`${lhs} = ${num(c)} を ${V("y")} について解くと？`;
    const Y=(p,r)=>`${V("y")} = ${poly([[p,"x"],[r,""]])}`; const A=-s*a,C=s*c,ans=Y(A,C);
    return {q,ans,wrongs:W(ans,[{v:Y(-A,C),why:J`${V("x")} の項を移項すると、符号が変わります。`},{v:Y(-A,-C),why:s<0?J`${M}${V("y")} = … のあと、両辺に ${M}1 をかけるのを忘れています。`:J`符号を確かめよう。`},{v:Y(A,-C),why:J`数の項の符号を確かめよう。`}]),exp:s>0?J`${mono(a,"x")} を右辺に移項 → ${ans}`:J`${mono(a,"x")} を移項して ${M}${V("y")} = ${poly([[-a,"x"],[c,""]])} → 両辺に ${M}1 をかける → ${ans}`,tf:v=>J`${lhs} = ${num(c)} を ${V("y")} について解くと ${v}`,kind:"trans"}; }
  if(t===1){ const L0=V("ℓ"),a=V("a"),b=V("b"); const q=J`${L0} = 2(${a} + ${b}) を ${a} について解くと？`; const ans=`${a} = ${fr(L0,2)} ${M} ${b}`;
    return {q,ans,wrongs:[{v:`${a} = ${fr(`${L0} ${M} ${b}`,2)}`,why:J`両辺を2でわると ${fr(L0,2)} = ${a} + ${b}。${b} は2でわられません。`},{v:`${a} = ${L0} ${M} 2${b}`,why:J`${L0} ${M} 2${b} = 2${a} なので、最後に2でわります。`},{v:`${a} = 2${L0} ${M} ${b}`,why:J`両辺を2で「わり」ます。`},{v:`${a} = ${fr(L0,2)} + ${b}`,why:J`移項すると符号が変わります。`}],exp:J`両辺を2でわる → ${fr(L0,2)} = ${a} + ${b} → ${ans}`,tf:v=>JA()?J`${q.replace(J` を `+a+J` について解くと？`,"")} を ${a} について解くと ${v}`:`${q}<br>→ ${v}`,kind:"trans"}; }
  if(t===2){ const [S,a,h,nm]=pick([["S","a","h",J`平行四辺形の面積`],["V","S","h",J`柱の体積`],["ℓ","r","π",J`円周`]].slice(0,2)); const q=J`${V(S)} = ${V(a)}${V(h)} を ${V(h)} について解くと？`; const ans=`${V(h)} = ${fr(V(S),V(a))}`;
    return {q,ans,wrongs:[{v:`${V(h)} = ${V(S)} ${M} ${V(a)}`,why:J`かけ算の式なので、わり算で解きます。`},{v:`${V(h)} = ${fr(V(a),V(S))}`,why:J`両辺を ${V(a)} でわります。わる順番が反対です。`},{v:`${V(h)} = ${V(S)}${V(a)}`,why:J`両辺を ${V(a)} で「わり」ます。`}],exp:J`両辺を ${V(a)} でわる → ${ans}（${nm}の式）`,tf:v=>J`${V(S)} = ${V(a)}${V(h)} を ${V(h)} について解くと ${v}`,kind:"trans"}; }
  const q=J`${V("V")} = ${fr(1,3)}${V("S")}${V("h")} を ${V("h")} について解くと？`, ans=`${V("h")} = ${fr("3"+V("V"),V("S"))}`;
  return {q,ans,wrongs:[{v:`${V("h")} = ${fr(V("V"),"3"+V("S"))}`,why:J`両辺に3をかけてから ${V("S")} でわります。`},{v:`${V("h")} = ${fr("3"+V("S"),V("V"))}`,why:J`わる順番が反対です。`},{v:`${V("h")} = 3${V("V")} ${M} ${V("S")}`,why:J`かけ算の式なので、わり算で解きます。`}],exp:J`両辺に3をかける → 3${V("V")} = ${V("S")}${V("h")} → ${ans}（錐の体積の式）`,tf:v=>J`${V("V")} = ${fr(1,3)}${V("S")}${V("h")} を ${V("h")} について解くと ${v}`,kind:"trans"}; }

/* ---------- A(2) 連立方程式 ---------- */
const sysH=(e1,e2)=>`<span class="sys"><span>① ${e1}</span><span>② ${e2}</span></span>`;
const E2=(a,b,c)=>`${poly([[a,"x"],[b,"y"]])} = ${num(c)}`;
function sysW(x,y,a1,b1,a2,b2){ const g1=gcd(a1,b1)||1,g2=gcd(a2,b2)||1;
  return W(XY(x,y),[{v:XY(x+b1/g1,y-a1/g1),why:J`①にはあてはまりますが、②にあてはまりません。両方にあてはまる組が解です。`},{v:XY(y,x),why:J`${V("x")} と ${V("y")} の値を取りちがえていませんか？`},{v:XY(x,-y),why:J`求めた ${V("x")} を代入して ${V("y")} を出すとき、符号に注意。`},{v:XY(x+b2/g2,y-a2/g2),why:J`②にはあてはまりますが、①にあてはまりません。`},{v:XY(-x,y),why:J`式をたす・ひくときの符号を確かめよう。`}]); }
function sysQ(x,y,a1,b1,a2,b2,exp,e1,e2){ const c1=a1*x+b1*y,c2=a2*x+b2*y; e1=e1||E2(a1,b1,c1); e2=e2||E2(a2,b2,c2); const S=sysH(e1,e2);
  return {q:S,ans:XY(x,y),wrongs:sysW(x,y,a1,b1,a2,b2),exp,tf:v=>J`${S}<br>の解は ${v}`,kind:"sys"}; }
function sys1(){ const x=NZ(-5,5),y=NZ(-5,5); const ey=Math.random()<.6; let a1=NZ(-4,4),b1=NZ(-4,4),a2,b2;
  if(ey){ b2=pick([b1,-b1]); a2=NZ(-4,4); } else { a2=pick([a1,-a1]); b2=NZ(-4,4); }
  if(a1*b2-a2*b1===0) return sys1(); const c1=a1*x+b1*y,c2=a2*x+b2*y;
  const add=ey?b2===-b1:a2===-a1, op=add?"+":M; const k=add?1:-1;
  const exp=ey?J`①${op}②で ${V("y")} を消す → ${mono(a1+k*a2,"x")} = ${num(c1+k*c2)} → ${V("x")} = ${num(x)}。①に代入して ${V("y")} = ${num(y)}`:J`①${op}②で ${V("x")} を消す → ${mono(b1+k*b2,"y")} = ${num(c1+k*c2)} → ${V("y")} = ${num(y)}。①に代入して ${V("x")} = ${num(x)}`;
  return sysQ(x,y,a1,b1,a2,b2,exp); }
function sys2(){ const x=NZ(-4,4),y=NZ(-4,4),a1=NZ(-5,5),b1=NZ(-5,5),a2=NZ(-5,5),b2=NZ(-5,5);
  if(Math.abs(a1)===Math.abs(a2)||Math.abs(b1)===Math.abs(b2)||a1*b2-a2*b1===0) return sys2(); if(Math.max(Math.abs(a1*x+b1*y),Math.abs(a2*x+b2*y))>30) return sys2();
  const L=Math.abs(b1*b2)/gcd(b1,b2), m1=L/Math.abs(b1), m2=L/Math.abs(b2), op=Math.sign(b1)===Math.sign(b2)?J`ひく`:J`たす`;
  const exp=J`${V("y")} の係数をそろえる：${m1===1?J`①はそのまま`:"①×"+m1}、${m2===1?J`②はそのまま`:"②×"+m2} で ${V("y")} の係数の大きさを ${L} にして${op} → ${V("x")} = ${num(x)}。代入して ${V("y")} = ${num(y)}`;
  return sysQ(x,y,a1,b1,a2,b2,exp); }
function sys3(){ const x=NZ(-4,4),y=NZ(-5,5),m=NZ(-4,4),n=y-m*x,a2=NZ(-5,5),b2=NZ(-4,4); if(a2+b2*m===0||Math.abs(n)>12) return sys3();
  const e1=`${V("y")} = ${poly([[m,"x"],[n,""]])}`; const c2=a2*x+b2*y;
  const exp=J`①を②に代入：${mono(a2,"x")} ${b2<0?M:"+"} ${Math.abs(b2)===1?"":Math.abs(b2)}(${poly([[m,"x"],[n,""]])}) = ${num(c2)} → ${V("x")} = ${num(x)}。①に代入して ${V("y")} = ${num(y)}`;
  return sysQ(x,y,-m,1,a2,b2,exp,e1); }

/* ---------- B(1) 平行と合同 ---------- */
function parFig(th,marks){ const yl=45,ym=115,t=th*Math.PI/180,P=[150,yl],Q=[150-70/Math.tan(t),ym],d=[Math.cos(t),-Math.sin(t)],e=35/Math.sin(t);
  const C={P,Q}; const RG={UR:[0,th],UL:[th,180],LL:[180,180+th],LR:[180+th,360]};
  let b=`<line x1="10" y1="${yl}" x2="270" y2="${yl}" class="ax"/><line x1="10" y1="${ym}" x2="270" y2="${ym}" class="ax"/><text x="274" y="${yl+5}" class="lb">ℓ</text><text x="274" y="${ym+5}" class="lb">m</text>`;
  b+=`<line x1="${(Q[0]-d[0]*e).toFixed(1)}" y1="${ym+35}" x2="${(P[0]+d[0]*e).toFixed(1)}" y2="${yl-35}" class="ax"/>`;
  for(const [at,r,txt] of marks){ const c=C[at],[s,en]=RG[r],bs=(s+en)/2*Math.PI/180,rad=x=>x*Math.PI/180; const p=a=>[c[0]+13*Math.cos(rad(a)),c[1]-13*Math.sin(rad(a))];
    const [x1,y1]=p(s),[x2,y2]=p(en); b+=`<path d="M${x1.toFixed(1)} ${y1.toFixed(1)} A13 13 0 0 0 ${x2.toFixed(1)} ${y2.toFixed(1)}" class="ln"/>`;
    const rr=(en-s)<70?30:25; b+=`<text x="${(c[0]+rr*Math.cos(bs)).toFixed(1)}" y="${(c[1]-rr*Math.sin(bs)+5).toFixed(1)}" class="lb" text-anchor="middle">${txt}</text>`; }
  return SV(290,160,b); }
function angPar(){ const th=pick([50,55,60,65,70,75]); const val={UR:th,UL:180-th,LL:th,LR:180-th}; const ty=pick(["dou","saku","dous","tai"]); let A,B;
  if(ty==="dou"){ const r=pick(Object.keys(val)); A=["P",r]; B=["Q",r]; }
  else if(ty==="saku"){ [A,B]=pick([[["P","LR"],["Q","UL"]],[["P","LL"],["Q","UR"]]]); }
  else if(ty==="dous"){ [A,B]=pick([[["P","LL"],["Q","UL"]],[["P","LR"],["Q","UR"]]]); }
  else { const at=pick(["P","Q"]); const [r1,r2]=pick([["UR","LL"],["UL","LR"]]); A=[at,r1]; B=[at,r2]; }
  if(Math.random()<.5) [A,B]=[B,A];
  const NM={dou:J`同位角`,saku:J`錯角`,tai:J`対頂角`}; const WHY={dou:J`同位角は、2本の直線に1本の直線が交わってできる角のうち、同じ位置にある角です。`,saku:J`錯角は、2本の直線の内側で、ななめに向かい合う角です。`,tai:J`対頂角は、2本の直線が交わってできる、向かい合う角です。`};
  if(ty!=="dous"&&Math.random()<.35){ const f=parFig(th,[[...A,J`ア`],[...B,J`イ`]]);
    return {q:J`∠ア と ∠イ の関係は？${f}`,ans:NM[ty],wrongs:[...Object.keys(NM).filter(k=>k!==ty).map(k=>({v:NM[k],why:WHY[ty]})),{v:J`同じ大きさとはかぎらない角`,why:WHY[ty]}],exp:WHY[ty],tf:v=>J`∠ア と ∠イ は${v}${f}`,kind:"fig"}; }
  const a=val[A[1]],ans=val[B[1]]; const f=parFig(th,[[...A,DEG(a)],[...B,`<tspan font-style="italic">x</tspan>`]]);
  const eqWhy=ty==="dous"?J`${V("x")} と ${a}° をたすと 180° になります（同位角や錯角を使って移してみよう）。`:J`${NM[ty]}は等しくなります。`;
  return {q:J`ℓ∥m のとき、∠${V("x")} の大きさは？${f}`,ans:DEG(ans),wrongs:[{v:DEG(180-ans),why:eqWhy},{v:"90°",why:J`直角とはかぎりません。等しい角や、一直線（180°）を使って求めます。`},{v:DEG(360-ans),why:J`一直線の角は 180° です（360° は1周）。`}],exp:ty==="dous"?J`同位角で移すと、${V("x")} と ${a}° は一直線にならぶ → 180 ${M} ${a} = ${ans}`:J`${NM[ty]}は等しい${ty==="tai"?"":J`（ℓ∥m）`} → ${ans}°`,tf:v=>J`ℓ∥m のとき、∠${V("x")} = ${v}${f}`,kind:"fig"}; }
function triFig(la,lb,lc,ext){ return SV(270,150,`<polygon points="110,20 30,130 190,130" class="f1"/>${ext?`<line x1="190" y1="130" x2="262" y2="130" class="ax"/>`:""}<text x="104" y="15" class="lb">A</text><text x="16" y="142" class="lb">B</text><text x="186" y="146" class="lb">C</text>
  <text x="110" y="54" class="lb" text-anchor="middle">${la}</text><text x="58" y="122" class="lb" text-anchor="middle">${lb}</text><text x="${ext?220:166}" y="122" class="lb" text-anchor="middle">${lc}</text>`); }
const XI=`<tspan font-style="italic">x</tspan>`;
function triAng(){ const t=pick(["in","ex","rev"]); const a=5*R(5,16),b=5*R(5,16); if(a+b>=160) return triAng();
  if(t==="in"){ const ans=180-a-b, f=triFig(DEG(a),DEG(b),XI,false); return {q:J`∠${V("x")} の大きさは？${f}`,ans:DEG(ans),wrongs:W(DEG(ans),[{v:DEG(a+b),why:J`それは∠C の外角です。三角形の内角の和は 180°。`},{v:DEG(180-a),why:J`内角は3つ。180° から2つの角をひきます。`},{v:DEG(360-a-b),why:J`三角形の内角の和は 180° です（360° は四角形）。`}]),exp:`180 ${M} ${a} ${M} ${b} = ${ans}`,tf:v=>`∠${V("x")} = ${v}${f}`,kind:"fig"}; }
  if(t==="ex"){ const ans=a+b, f=triFig(DEG(a),DEG(b),XI,true); return {q:J`∠${V("x")}（∠C の外角）の大きさは？${f}`,ans:DEG(ans),wrongs:W(DEG(ans),[{v:DEG(180-a-b),why:J`それは∠C（内角）です。外角は、となり合わない2つの内角の和。`},{v:DEG(180-a),why:J`外角 = となり合わない2つの内角の和（∠A + ∠B）。`},{v:DEG(360-a-b),why:J`外角 = ∠A + ∠B で求めます。`}]),exp:J`三角形の外角は、となり合わない2つの内角の和：${a} + ${b} = ${ans}`,tf:v=>`∠${V("x")} = ${v}${f}`,kind:"fig"}; }
  const ex=a+b, f=triFig(DEG(a),XI,DEG(ex),true); return {q:J`∠${V("x")} の大きさは？（${ex}° は∠C の外角）${f}`,ans:DEG(b),wrongs:W(DEG(b),[{v:DEG(ex+a),why:J`外角 = ∠A + ∠B なので、∠B = ${ex} ${M} ${a}。`},{v:DEG(180-ex),why:J`それは∠C（内角）です。`},{v:DEG(180-ex-a>0?180-ex-a:180-a),why:J`外角 = となり合わない2つの内角の和、を使います。`}]),exp:`${ex} = ${a} + ${V("x")} → ${V("x")} = ${b}`,tf:v=>`∠${V("x")} = ${v}${f}`,kind:"fig"}; }
function polyAng(){ const t=pick(["sum","one","ext","rev"]); const RN=[5,6,8,9,10,12];
  if(t==="sum"){ const n=R(5,12),ans=180*(n-2); return {q:J`${n}角形の内角の和は？`,ans:DEG(ans),wrongs:W(DEG(ans),[{v:DEG(180*n),why:J`${n}角形は、1つの頂点から対角線をひくと (${n}${M}2) 個の三角形に分けられます。`},{v:DEG(360),why:J`360° は外角の和です。`},{v:DEG(180*(n-1)),why:J`三角形の数は ${n}${M}2 個です。`},{v:DEG(180*(n-3)),why:J`三角形の数は ${n}${M}2 個です。`}]),exp:`180×(${n} ${M} 2) = ${ans}`,tf:v=>J`${n}角形の内角の和は ${v}`,kind:"word"}; }
  const n=pick(RN);
  if(t==="one"){ const ans=180*(n-2)/n; return {q:J`正${n}角形の1つの内角は？`,ans:DEG(ans),wrongs:W(DEG(ans),[{v:DEG(360/n),why:J`それは1つの外角です。`},{v:DEG(180*(n-2)),why:J`それは内角の和です。最後に ${n} でわります。`},{v:DEG(360*(n-2)/n),why:J`三角形1つの内角の和は 180° です。`}]),exp:J`180×(${n} ${M} 2)÷${n} = ${ans}（または 180 ${M} 360÷${n}）`,tf:v=>J`正${n}角形の1つの内角は ${v}`,kind:"word"}; }
  if(t==="ext"){ const ans=360/n; return {q:J`正${n}角形の1つの外角は？`,ans:DEG(ans),wrongs:W(DEG(ans),[{v:DEG(180*(n-2)/n),why:J`それは1つの内角です。`},{v:DEG(360),why:J`それは外角の和です。`},{v:Number.isInteger(180/n)?DEG(180/n):DEG(180*(n-2)),why:J`多角形の外角の和は 360° です。`}]),exp:J`外角の和は 360° → 360÷${n} = ${ans}`,tf:v=>J`正${n}角形の1つの外角は ${v}`,kind:"word"}; }
  const e=360/n,ans=J`正${n}角形`; return {q:J`1つの外角が ${e}° の正多角形は？`,ans,wrongs:W(ans,[{v:Number.isInteger(180/e)&&180/e>=3?J`正${180/e}角形`:null,why:J`外角の和は 360° です（180° ではありません）。`},{v:J`正${n+1}角形`,why:J`360÷${e} で求めます。`},{v:J`正${n-1}角形`,why:J`360÷${e} で求めます。`},{v:J`正${2*n}角形`,why:J`360÷${e} で求めます。`}]),exp:`360÷${e} = ${n}`,tf:v=>J`1つの外角が ${e}° の正多角形は ${v}`,kind:"word"}; }
const congB=bank([
 [J`三角形の合同条件で「ない」ものは？`,J`3つの角がそれぞれ等しい`,[[J`3組の辺がそれぞれ等しい`,J`これは合同条件です。`],[J`2組の辺とその間の角がそれぞれ等しい`,J`これは合同条件です。`],[J`1組の辺とその両端の角がそれぞれ等しい`,J`これは合同条件です。`]],J`3つの角が等しくても、大きさがちがうことがある（合同とはいえない）`],
 [J`AB=DE、BC=EF、CA=FD のとき △ABC≡△DEF。使った合同条件は？`,J`3組の辺がそれぞれ等しい`,[[J`2組の辺とその間の角がそれぞれ等しい`,J`角の条件は使っていません。`],[J`1組の辺とその両端の角がそれぞれ等しい`,J`角の条件は使っていません。`],[J`3つの角がそれぞれ等しい`,J`これは合同条件ではありません。`]],J`等しいのは辺が3組 → 3組の辺がそれぞれ等しい`],
 [J`AB=DE、BC=EF、∠B=∠E のとき △ABC≡△DEF。使った合同条件は？`,J`2組の辺とその間の角がそれぞれ等しい`,[[J`3組の辺がそれぞれ等しい`,J`等しいとわかっている辺は2組です。`],[J`1組の辺とその両端の角がそれぞれ等しい`,J`等しい角は1組です。`],[J`3つの角がそれぞれ等しい`,J`これは合同条件ではありません。`]],J`∠B は辺AB と辺BC の間の角`],
 [J`BC=EF、∠B=∠E、∠C=∠F のとき △ABC≡△DEF。使った合同条件は？`,J`1組の辺とその両端の角がそれぞれ等しい`,[[J`2組の辺とその間の角がそれぞれ等しい`,J`等しい辺は1組です。`],[J`3組の辺がそれぞれ等しい`,J`等しい辺は1組です。`],[J`3つの角がそれぞれ等しい`,J`これは合同条件ではありません。`]],J`∠B と ∠C は辺BC の両端の角`],
 [J`AB=DE、BC=EF、∠A=∠D のとき、△ABC と △DEF は？`,J`合同とはいえない`,[[J`2組の辺とその間の角で合同`,J`∠A は辺AB と辺BC の間の角ではありません（間の角は∠B）。`],[J`3組の辺で合同`,J`等しい辺は2組しかわかっていません。`],[J`1組の辺とその両端の角で合同`,J`等しい角は1組しかわかっていません。`]],J`等しい角が、等しい2辺の「間の角」ではない`],
 [J`△ABC と △DEF が合同であることを表す記号は？`,"≡",[["=",J`= は長さや角の大きさが等しいときに使います。`],["∽",J`∽ は相似の記号です（中3で学習）。`],["∥",J`∥ は平行の記号です。`]],J`合同は ≡`],
 [J`△ABC≡△DEF のとき、辺BC に対応する辺は？`,J`辺EF`,[[J`辺DE`,J`対応する頂点の順に書くので、B↔E、C↔F です。`],[J`辺DF`,J`対応する頂点の順に書くので、B↔E、C↔F です。`],[J`辺AC`,J`対応する辺は △DEF の中にあります。`]],J`A↔D、B↔E、C↔F の順に対応`],
 [J`△ABC≡△DEF のとき、∠C に等しい角は？`,"∠F",[["∠D",J`対応する頂点の順に書くので、C↔F です。`],["∠E",J`対応する頂点の順に書くので、C↔F です。`],["∠A",J`対応する角は △DEF の中にあります。`]],J`A↔D、B↔E、C↔F の順に対応`],
]);
const proofB=bank([
 [J`「AならばB」の、A の部分を何という？`,J`仮定`,[[J`結論`,J`結論は B の部分です。`],[J`定義`,J`定義は、言葉の意味をはっきり述べたものです。`],[J`定理`,J`定理は、証明されたことがらのうち大切なものです。`]],J`A が仮定、B が結論`],
 [J`「AならばB」の、B の部分を何という？`,J`結論`,[[J`仮定`,J`仮定は A の部分です。`],[J`定義`,J`定義は、言葉の意味をはっきり述べたものです。`],[J`逆`,J`逆は「BならばA」のことです。`]],J`A が仮定、B が結論`],
 [J`言葉の意味をはっきり述べたものを何という？`,J`定義`,[[J`定理`,J`定理は、証明されたことがらのうち大切なものです。`],[J`仮定`,J`仮定は「AならばB」の A の部分です。`],[J`反例`,J`反例は、ことがらが正しくないことを示す例です。`]],J`例：二等辺三角形の定義は「2つの辺が等しい三角形」`],
 [J`証明されたことがらのうち、よく使われる大切なものを何という？`,J`定理`,[[J`定義`,J`定義は、言葉の意味をはっきり述べたものです。`],[J`結論`,J`結論は「AならばB」の B の部分です。`],[J`逆`,J`逆は「BならばA」のことです。`]],J`例：「二等辺三角形の底角は等しい」は定理`],
 [J`「x = 2 ならば x² = 4」の逆は？`,J`x² = 4 ならば x = 2`,[[J`x = 2 ならば x² = 4`,J`それはもとのことがらです。`],[J`x ≠ 2 ならば x² ≠ 4`,J`逆は、仮定と結論を入れかえたものです。`],[J`x² ≠ 4 ならば x ≠ 2`,J`逆は、仮定と結論を入れかえたものです。`]],J`仮定と結論を入れかえる。この逆は正しくない（反例 x = −2）`],
 [J`ことがらが正しくないことを示す例を何という？`,J`反例`,[[J`逆`,J`逆は、仮定と結論を入れかえたものです。`],[J`定義`,J`定義は、言葉の意味をはっきり述べたものです。`],[J`仮定`,J`仮定は「AならばB」の A の部分です。`]],J`反例が1つでもあれば、そのことがらは正しくない`],
 [J`「△ABC≡△DEF ならば AB = DE」の逆は？`,J`正しくない（反例がある）`,[[J`正しい（いつも成り立つ）`,J`AB = DE だけでは、合同とはいえません。`],[J`もとのことがらと同じ`,J`逆は、仮定と結論を入れかえたものです。`],[J`逆は考えられない`,J`「AB = DE ならば △ABC≡△DEF」が逆です。`]],J`逆が正しいとはかぎらない`],
 [J`証明で、すでに正しいと認められていることがらとして使えないものは？`,J`図を見て等しそうな長さ`,[[J`対頂角は等しい`,J`これは正しいと認められたことがらです。`],[J`平行線の錯角は等しい`,J`これは正しいと認められたことがらです。`],[J`三角形の合同条件`,J`これは正しいと認められたことがらです。`]],J`見た目は根拠にならない`],
]);

/* ---------- B(2) 三角形と四角形 ---------- */
function isoFig(la,lb,lc){ const tick=(x,y)=>`<line x1="${x-5}" y1="${y-4}" x2="${x+5}" y2="${y+4}" class="ax"/>`;
  return SV(220,150,`<polygon points="110,15 40,135 180,135" class="f1"/>${tick(75,75)}${tick(145,75).replace(/x1="(\d+)" y1="(\d+)" x2="(\d+)" y2="(\d+)"/,(m,a,b,c,d)=>`x1="${a}" y1="${d}" x2="${c}" y2="${b}"`)}
  <text x="104" y="11" class="lb">A</text><text x="26" y="146" class="lb">B</text><text x="184" y="146" class="lb">C</text><text x="110" y="52" class="lb" text-anchor="middle">${la}</text><text x="66" y="126" class="lb" text-anchor="middle">${lb}</text><text x="154" y="126" class="lb" text-anchor="middle">${lc}</text>`); }
function isoAng(){ if(Math.random()<.5){ const a=10*R(2,14),ans=(180-a)/2, f=isoFig(DEG(a),XI,"");
    return {q:J`AB = AC の二等辺三角形。∠${V("x")} は？${f}`,ans:DEG(ans),wrongs:W(DEG(ans),[{v:DEG(180-a),why:J`底角は2つあり、等しい大きさです。(180 − 頂角)÷2 で求めます。`},{v:DEG(a),why:J`頂角と底角が等しいとはかぎりません（正三角形のときだけ）。`},{v:DEG(180-2*a>0?180-2*a:180-ans),why:J`頂角と底角を取りちがえていませんか？`}]),exp:J`二等辺三角形の底角は等しい → (180 ${M} ${a})÷2 = ${ans}`,tf:v=>`∠${V("x")} = ${v}${f}`,kind:"fig"}; }
  const b=5*R(5,17),ans=180-2*b, f=isoFig(XI,"",DEG(b));
  return {q:J`AB = AC の二等辺三角形。∠${V("x")} は？${f}`,ans:DEG(ans),wrongs:W(DEG(ans),[{v:DEG(180-b),why:J`底角は2つ（∠B と ∠C）あり、等しい大きさです。`},{v:DEG(b),why:J`頂角と底角が等しいとはかぎりません。`},{v:Number.isInteger((180-b)/2)?DEG((180-b)/2):DEG(90-b>0?90-b:2*b),why:J`∠B = ∠C を使い、180 − 底角×2 で求めます。`}]),exp:`∠B = ∠C = ${b}° → 180 ${M} ${b}×2 = ${ans}`,tf:v=>`∠${V("x")} = ${v}${f}`,kind:"fig"}; }
function paraFig(L){ return SV(270,150,`<polygon points="70,25 30,125 210,125 250,25" class="f1"/><text x="62" y="18" class="lb">A</text><text x="16" y="138" class="lb">B</text><text x="210" y="142" class="lb">C</text><text x="252" y="18" class="lb">D</text>
  <text x="80" y="50" class="lb" text-anchor="middle">${L.A||""}</text><text x="56" y="116" class="lb" text-anchor="middle">${L.B||""}</text><text x="198" y="116" class="lb" text-anchor="middle">${L.C||""}</text><text x="230" y="50" class="lb" text-anchor="middle">${L.D||""}</text>
  <text x="38" y="78" class="nm" text-anchor="end">${L.AB||""}</text><text x="120" y="142" class="nm" text-anchor="middle">${L.BC||""}</text><text x="236" y="80" class="nm">${L.CD||""}</text><text x="160" y="18" class="nm" text-anchor="middle">${L.AD||""}</text>`); }
function paraAng(){ if(Math.random()<.65){ const b=5*R(9,16),V0={A:180-b,B:b,C:180-b,D:b}; const vs=["A","B","C","D"]; const g=pick(vs),ask=pick(vs.filter(x=>x!==g)); const ans=V0[ask];
    const L={}; L[g]=DEG(V0[g]); L[ask]=XI; const f=paraFig(L); const opp={A:"C",B:"D",C:"A",D:"B"}[g]===ask;
    return {q:J`平行四辺形ABCD。∠${V("x")} は？${f}`,ans:DEG(ans),wrongs:W(DEG(ans),[{v:DEG(180-ans),why:opp?J`平行四辺形の向かい合う角は等しくなります。`:J`となり合う角の和は 180° です（AD∥BC）。`},{v:"90°",why:J`平行四辺形の角は直角とはかぎりません。`},{v:DEG(360-ans),why:J`となり合う角の和は 180°、向かい合う角は等しい、を使います。`}]),exp:opp?J`向かい合う角は等しい → ${ans}°`:J`となり合う角の和は 180° → 180 ${M} ${V0[g]} = ${ans}`,tf:v=>`∠${V("x")} = ${v}${f}`,kind:"fig"}; }
  const p=R(3,9),q=R(4,12); if(p===q) return paraAng(); const ask=pick(["CD","AD"]),ans=ask==="CD"?p:q; const L={AB:p+"cm",BC:q+"cm"}; L[ask]="?"; const f=paraFig(L);
  return {q:J`平行四辺形ABCD。辺${ask} の長さは？${f}`,ans:ans+"cm",wrongs:W(ans+"cm",[{v:(ask==="CD"?q:p)+"cm",why:J`平行四辺形の向かい合う辺は等しくなります。となりの辺ではありません。`},{v:(p+q)+"cm",why:J`向かい合う辺の長さが等しい、を使います。`},{v:2*(p+q)+"cm",why:J`それはまわりの長さです。`}]),exp:J`向かい合う辺は等しい → ${ask} = ${ask==="CD"?"AB":"BC"} = ${ans}cm`,tf:v=>J`辺${ask} = ${v}${f}`,kind:"fig"}; }
function paraCond(){ const good=[[J`AB∥DC、AD∥BC`,J`2組の向かい合う辺がそれぞれ平行（定義）`],[J`AB = DC、AD = BC`,J`2組の向かい合う辺がそれぞれ等しい`],[J`∠A = ∠C、∠B = ∠D`,J`2組の向かい合う角がそれぞれ等しい`],[J`対角線がそれぞれの中点で交わる`,J`対角線がそれぞれの中点で交わる`],[J`AB∥DC、AB = DC`,J`1組の向かい合う辺が平行で、その長さが等しい`]];
  const bad=[[J`AB∥DC、AD = BC`,J`等脚台形のように、平行四辺形にならないことがあります。`],[J`AB = AD、CB = CD`,J`たこ形のように、平行四辺形にならないことがあります。`],[J`対角線が垂直に交わる`,J`たこ形のように、平行四辺形にならないことがあります。`],[J`対角線の長さが等しい`,J`等脚台形のように、平行四辺形にならないことがあります。`],[J`∠A = ∠B、∠C = ∠D`,J`等脚台形のように、平行四辺形にならないことがあります。`]];
  const [ans,why]=pick(good); const ws=shuffle(bad).slice(0,3).map(([v,w])=>({v,why:w}));
  return {q:J`四角形ABCD が必ず平行四辺形になるのは？`,ans,wrongs:ws,exp:J`平行四辺形になる条件：${why}`,tf:v=>J`「${v}」なら、四角形ABCD は必ず平行四辺形`,kind:"word"}; }
const quadB=bank([
 [J`長方形の対角線の性質は？`,J`長さが等しい`,[[J`垂直に交わる`,J`それはひし形の対角線の性質です。`],[J`長さが等しく、垂直に交わる`,J`それは正方形の対角線の性質です。`],[J`平行である`,J`対角線どうしは交わります。`]],J`長方形：対角線の長さが等しい`],
 [J`ひし形の対角線の性質は？`,J`垂直に交わる`,[[J`長さが等しい`,J`それは長方形の対角線の性質です。`],[J`長さが等しく、垂直に交わる`,J`それは正方形の対角線の性質です。`],[J`平行である`,J`対角線どうしは交わります。`]],J`ひし形：対角線が垂直に交わる`],
 [J`正方形の対角線の性質は？`,J`長さが等しく、垂直に交わる`,[[J`長さが等しい`,J`正方形はひし形でもあるので、垂直にも交わります。`],[J`垂直に交わる`,J`正方形は長方形でもあるので、長さも等しくなります。`],[J`平行である`,J`対角線どうしは交わります。`]],J`正方形は長方形とひし形の両方の性質をもつ`],
 [J`平行四辺形に「1つの角が直角」を加えると？`,J`長方形`,[[J`ひし形`,J`ひし形は、となり合う辺が等しい平行四辺形です。`],[J`正方形`,J`正方形にするには、となり合う辺が等しいことも必要です。`],[J`台形`,J`平行四辺形は、もともと台形の仲間です。`]],J`4つの角が等しい → 長方形`],
 [J`平行四辺形に「となり合う辺が等しい」を加えると？`,J`ひし形`,[[J`長方形`,J`長方形は、角が直角の平行四辺形です。`],[J`正方形`,J`正方形にするには、角が直角であることも必要です。`],[J`台形`,J`平行四辺形は、もともと台形の仲間です。`]],J`4つの辺が等しい → ひし形`],
 [J`長方形に「となり合う辺が等しい」を加えると？`,J`正方形`,[[J`ひし形`,J`角が直角のままなので、正方形になります。`],[J`平行四辺形`,J`長方形は、もともと平行四辺形の仲間です。`],[J`台形`,J`長方形は、もともと台形の仲間です。`]],J`4つの角も4つの辺も等しい → 正方形`],
 [J`平行四辺形の性質で「ない」ものは？`,J`対角線の長さが等しい`,[[J`2組の向かい合う辺がそれぞれ等しい`,J`これは平行四辺形の性質です。`],[J`2組の向かい合う角がそれぞれ等しい`,J`これは平行四辺形の性質です。`],[J`対角線がそれぞれの中点で交わる`,J`これは平行四辺形の性質です。`]],J`対角線の長さが等しいのは長方形`],
 [J`AD∥BC の台形ABCD で、△ABC と面積が等しい三角形は？`,"△DBC",[["△ABD",J`底辺と高さが同じとはかぎりません。`],["△ACD",J`底辺と高さが同じとはかぎりません。`],[J`△AOD（O は対角線の交点）`,J`底辺BC が共通で、高さが等しい三角形をさがそう。`]],J`底辺BC が共通で、AD∥BC だから高さも等しい`],
 [J`AD∥BC の台形ABCD（対角線の交点O）で、△ABO と面積が等しい三角形は？`,"△DCO",[["△AOD",J`△ABO と面積が等しいとはかぎりません。`],["△BOC",J`△ABO と面積が等しいとはかぎりません。`],["△ABD",J`△ABD は △ABO より大きい三角形です。`]],J`△ABC = △DBC から、共通の △OBC をひく`],
]);

/* ---------- C(1) 一次関数 ---------- */
const LF=(p,q,b)=>`${V("y")} = ${coef(p,q)}${V("x")}${b?` ${b<0?M:"+"} ${Math.abs(b)}`:""}`;
function lf1(){ const a=NZ(-5,5),b=NZ(-8,8),p=R(-3,2),d=R(2,5),q=p+d; const pre=J`一次関数 ${LF(a,1,b)} で、${V("x")} が ${num(p)} から ${num(q)} まで増加するとき、`;
  if(Math.random()<.5) return {q:J`${pre}変化の割合は？`,ans:num(a),wrongs:W(a,[{v:a*d,why:J`それは y の増加量です。変化の割合 = y の増加量 ÷ x の増加量。`},{v:b,why:J`それは切片（x = 0 のときの y）です。`},{v:a*q+b,why:J`それは ${V("x")} = ${num(q)} のときの ${V("y")} の値です。`},{v:-a,why:J`符号を確かめよう。`}],a),exp:J`一次関数の変化の割合は、いつも ${V("x")} の係数 → ${num(a)}`,tf:v=>J`${pre}変化の割合は ${v}`,kind:"word"};
  return {q:J`${pre}${V("y")} の増加量は？`,ans:num(a*d),wrongs:W(a*d,[{v:a,why:J`それは変化の割合です。y の増加量 = 変化の割合 × x の増加量。`},{v:a*q+b,why:J`それは ${V("x")} = ${num(q)} のときの ${V("y")} の値です。`},{v:a*d+b,why:J`増加量に切片はたしません。`},{v:-a*d,why:J`符号を確かめよう。`}],a*d),exp:J`${V("x")} の増加量は ${d} → ${num(a)}×${d} = ${num(a*d)}`,tf:v=>J`${pre}${V("y")} の増加量は ${v}`,kind:"word"}; }
function lf2(){ const a=NZ(-5,5),b=NZ(-8,8); if(a===b) return lf2(); const t=pick(["s","i","v"]); const f=LF(a,1,b);
  if(t==="s") return {q:J`${f} のグラフの傾きは？`,ans:num(a),wrongs:W(a,[{v:b,why:J`それは切片です。傾きは x の係数。`},{v:-a,why:J`符号を確かめよう。`}],a),exp:J`${V("y")} = ${V("a")}${V("x")} + ${V("b")} の ${V("a")} が傾き → ${num(a)}`,tf:v=>J`${f} のグラフの傾きは ${v}`,kind:"word"};
  if(t==="i") return {q:J`${f} のグラフの切片は？`,ans:num(b),wrongs:W(b,[{v:a,why:J`それは傾きです。切片は数の項。`},{v:-b,why:J`符号を確かめよう。`}],b),exp:J`${V("y")} = ${V("a")}${V("x")} + ${V("b")} の ${V("b")} が切片 → ${num(b)}`,tf:v=>J`${f} のグラフの切片は ${v}`,kind:"word"};
  const x=NZ(-4,4),ans=a*x+b; return {q:J`${f} のグラフが点 (${num(x)}, ${V("k")}) を通るとき、${V("k")} は？`,ans:num(ans),wrongs:W(ans,[{v:a+x+b,why:J`${num(a)}${V("x")} は ${num(a)}×${V("x")}。たし算ではありません。`},{v:-a*x+b,why:J`符号を確かめよう。${num(a)}×${par(x)} を計算します。`},{v:a*x-b,why:J`数の項の符号を確かめよう。`}],ans),exp:J`${V("x")} = ${num(x)} を代入：${num(a)}×${par(x)} ${b<0?M:"+"} ${Math.abs(b)} = ${num(ans)}`,tf:v=>J`${f} のグラフは点 (${num(x)}, ${v}) を通る`,kind:"word"}; }
function lf3(){ const [p,q]=pick([[1,1],[2,1],[3,1],[-1,1],[-2,1],[-3,1],[1,2],[-1,2],[2,3],[-2,3],[3,2],[-3,2]]); const b=NZ(-4,4); if(Math.abs(b+p)>6) return lf3();
  const g=coord({lins:[[p,q,b]],pts:[[0,b,""],[q,b+p,""]]}); const ans=LF(p,q,b);
  const L=[{v:LF(p,q,-b),why:J`切片は、グラフが y 軸と交わる点の y 座標です。`},{v:LF(-p,q,b),why:J`右上がりなら傾きは正、右下がりなら負です。`},{v:Math.abs(p)!==q?LF(q*Math.sign(p),Math.abs(p),b):null,why:J`傾き = y の増加量 ÷ x の増加量。わる順番が反対です。`},{v:q===1&&b!==p?LF(b,1,p):null,why:J`傾きと切片が反対です。`},{v:LF(-p,q,-b),why:J`傾きと切片の符号を確かめよう。`}];
  return {q:J`グラフの式は？${g}`,ans,wrongs:W(ans,L),exp:J`切片 ${num(b)}（y 軸との交点）。右へ ${q} 進むと${p>0?J`上`:J`下`}へ ${Math.abs(p)} → 傾き ${q===1?num(p):(p<0?M:"")+fr(Math.abs(p),q)}`,tf:v=>J`グラフの式は ${v}${g}`,kind:"fig"}; }
function lf4(){ const a=NZ(-4,4),b=NZ(-6,6),x1=NZ(-3,3),y1=a*x1+b; if(a===b) return lf4();
  if(Math.random()<.5){ const x2=x1+R(1,3),y2=a*x2+b; const q=J`2点 ${PAIR(x1,y1)}、${PAIR(x2,y2)} を通る直線の式は？`, ans=LF(a,1,b);
    return {q,ans,wrongs:W(ans,[{v:LF(-a,1,y1-(-a)*x1),why:J`傾き = (y の増加量)÷(x の増加量)。ひく順番をそろえよう。`},{v:LF(a,1,y1+a*x1),why:J`切片は ${V("b")} = ${V("y")} ${M} ${V("a")}${V("x")} で求めます。符号に注意。`},{v:LF(a,1,y1),why:J`通る点の y 座標が切片とはかぎりません（切片は x = 0 のときの y）。`},{v:b!==0?LF(b,1,a):null,why:J`傾きと切片が反対です。`}]),exp:J`傾き = (${num(y2)} ${M} ${par(y1)})÷(${num(x2)} ${M} ${par(x1)}) = ${num(a)}。${V("b")} = ${num(y1)} ${M} ${par(a)}×${par(x1)} = ${num(b)}`,tf:v=>JA()?J`${q.replace(J` を通る直線の式は？`,"")} を通る直線の式は ${v}`:`${q}<br>→ ${v}`,kind:"word"}; }
  const q=J`傾きが ${num(a)} で、点 ${PAIR(x1,y1)} を通る直線の式は？`, ans=LF(a,1,b);
  return {q,ans,wrongs:W(ans,[{v:LF(a,1,y1+a*x1),why:J`${V("b")} = ${V("y")} ${M} ${V("a")}${V("x")} で求めます。符号に注意。`},{v:LF(a,1,y1),why:J`通る点の y 座標が切片とはかぎりません。`},{v:LF(a,1,x1),why:J`切片は、点の座標を代入して求めます。`},{v:LF(-a,1,b),why:J`傾きの符号を確かめよう。`}]),exp:`${num(y1)} = ${num(a)}×${par(x1)} + ${V("b")} → ${V("b")} = ${num(b)}`,tf:v=>JA()?`${q.replace(J`直線の式は？`,J`直線の式は `)}${v}`:`${q}<br>→ ${v}`,kind:"word"}; }
function lf5(){ const x=NZ(-4,4),y=NZ(-5,5),a1=NZ(-3,3),a2=NZ(-3,3); if(a1===a2) return lf5(); const b1=y-a1*x,b2=y-a2*x; if(Math.abs(b1)>9||Math.abs(b2)>9) return lf5();
  const g=coord({lins:[[a1,1,b1],[a2,1,b2,"ln2"]]}); const ans=PAIR(x,y);
  return {q:J`2直線 ${LF(a1,1,b1)}、${LF(a2,1,b2)} の交点の座標は？${g}`,ans,wrongs:W(ans,[{v:PAIR(y,x),why:J`座標は (x 座標, y 座標) の順に書きます。`},{v:PAIR(0,b1),why:J`それは1本目の直線と y 軸の交点です。2つの式を連立方程式として解きます。`},{v:PAIR(x,-y),why:J`${V("x")} を代入して ${V("y")} を出すとき、符号に注意。`},{v:PAIR(-x,y),why:J`連立方程式を解くときの符号を確かめよう。`}]),exp:J`連立方程式として解く：${poly([[a1,"x"],[b1,""]])} = ${poly([[a2,"x"],[b2,""]])} → ${V("x")} = ${num(x)}、${V("y")} = ${num(y)}`,tf:v=>J`2直線 ${LF(a1,1,b1)}、${LF(a2,1,b2)} の交点は ${v}${g}`,kind:"fig"}; }

/* ---------- D(1)(2) データの分布と確率 ---------- */
const med=a=>{ const n=a.length; return n%2?a[(n-1)/2]:(a[n/2-1]+a[n/2])/2; };
function quartData(){ const n=R(7,11); const a=Array.from({length:n},()=>R(1,30)).sort((x,y)=>x-y); if(new Set(a).size<n-1) return quartData(); const h=Math.floor(n/2);
  const lo=a.slice(0,h),hi=a.slice(n-h); const Q1=med(lo),Q2=med(a),Q3=med(hi); if(Q1===Q2||Q2===Q3) return quartData();
  return {a,n,Q1,Q2,Q3,lo2:n%2?med(a.slice(0,h+1)):null,hi2:n%2?med(a.slice(h)):null,show:`<span class="dl2">${a.join(", ")}</span>`}; }
function quart(){ const D=quartData(); const t=pick(["Q1","Q2","Q3"]); const NM={Q1:J`第1四分位数`,Q2:J`第2四分位数（中央値）`,Q3:J`第3四分位数`}; const ans=dec(D[t]);
  const L=t==="Q1"?[{v:dec(D.Q2),why:J`それは中央値（第2四分位数）です。第1四分位数は、下半分の中央値。`},{v:D.lo2!=null?dec(D.lo2):null,why:J`データの数が奇数のときは、中央値を除いて半分に分けます。`},{v:String(D.a[0]),why:J`最小値ではなく、下半分のデータの中央値です。`},{v:dec(D.Q3),why:J`それは第3四分位数（上半分の中央値）です。`}]
   :t==="Q3"?[{v:dec(D.Q2),why:J`それは中央値（第2四分位数）です。第3四分位数は、上半分の中央値。`},{v:D.hi2!=null?dec(D.hi2):null,why:J`データの数が奇数のときは、中央値を除いて半分に分けます。`},{v:String(D.a[D.n-1]),why:J`最大値ではなく、上半分のデータの中央値です。`},{v:dec(D.Q1),why:J`それは第1四分位数（下半分の中央値）です。`}]
   :[{v:dec((D.a[0]+D.a[D.n-1])/2),why:J`最小値と最大値の真ん中ではなく、小さい順に並べた真ん中の値です。`},{v:dec(D.Q1),why:J`それは第1四分位数です。`},{v:dec(D.Q3),why:J`それは第3四分位数です。`}];
  return {q:J`次の ${D.n} 個のデータ（小さい順）の${NM[t]}は？<br>${D.show}`,ans,wrongs:W(ans,L),exp:J`中央値 ${dec(D.Q2)}、下半分の中央値 ${dec(D.Q1)}、上半分の中央値 ${dec(D.Q3)}`,tf:v=>J`${D.show} の${NM[t]}は ${v}`,kind:"word"}; }
function iqr(){ const D=quartData(); const ans=dec(D.Q3-D.Q1);
  return {q:J`次の ${D.n} 個のデータ（小さい順）の四分位範囲は？<br>${D.show}`,ans,wrongs:W(ans,[{v:String(D.a[D.n-1]-D.a[0]),why:J`それは範囲（最大値 − 最小値）です。`},{v:dec(D.Q3-D.Q2),why:J`四分位範囲 = 第3四分位数 − 第1四分位数。`},{v:dec(D.Q2-D.Q1),why:J`四分位範囲 = 第3四分位数 − 第1四分位数。`},{v:dec(D.Q3+D.Q1),why:J`ひき算で求めます。`}]),exp:J`第1四分位数 ${dec(D.Q1)}、第3四分位数 ${dec(D.Q3)} → ${dec(D.Q3)} ${M} ${dec(D.Q1)} = ${ans}`,tf:v=>J`${D.show} の四分位範囲は ${v}`,kind:"word"}; }
function boxFig2(s){ const X=v=>20+v*2.6; let b="";
  for(let v=0;v<=100;v+=10){ b+=`<line x1="${X(v)}" y1="86" x2="${X(v)}" y2="${v%20?90:93}" class="ax"/>`; if(v%20===0) b+=`<text x="${X(v)}" y="106" class="nm" text-anchor="middle">${v}</text>`; b+=`<line x1="${X(v)}" y1="14" x2="${X(v)}" y2="86" class="g"/>`; }
  b+=J`<line x1="${X(0)}" y1="86" x2="${X(100)}" y2="86" class="ax"/><text x="${X(100)+16}" y="106" class="nm">(点)</text>`;
  b+=`<line x1="${X(s[0])}" y1="50" x2="${X(s[1])}" y2="50" class="ax"/><line x1="${X(s[3])}" y1="50" x2="${X(s[4])}" y2="50" class="ax"/><line x1="${X(s[0])}" y1="40" x2="${X(s[0])}" y2="60" class="ax"/><line x1="${X(s[4])}" y1="40" x2="${X(s[4])}" y2="60" class="ax"/>`;
  b+=`<rect x="${X(s[1])}" y="30" width="${X(s[3])-X(s[1])}" height="40" class="f1"/><line x1="${X(s[2])}" y1="30" x2="${X(s[2])}" y2="70" class="ln"/>`;
  return SV(332,112,b); }
function boxRead(){ const pool=[]; for(let v=10;v<=95;v+=5) pool.push(v); const s=shuffle(pool).slice(0,5).sort((a,b)=>a-b); const f=boxFig2(s);
  const ST={med:[J`中央値`,s[2],J`箱の中の線が中央値です。`],rng:[J`範囲`,s[4]-s[0],J`範囲 = 最大値 − 最小値（ひげの両端）。`],iqr:[J`四分位範囲`,s[3]-s[1],J`四分位範囲 = 第3四分位数 − 第1四分位数（箱の長さ）。`],q1:[J`第1四分位数`,s[1],J`箱の左端が第1四分位数です。`],q3:[J`第3四分位数`,s[3],J`箱の右端が第3四分位数です。`]};
  const t=pick(Object.keys(ST)),[nm,val,why]=ST[t]; const ans=val+J`点`;
  const L=Object.keys(ST).filter(k=>k!==t&&ST[k][1]!==val).map(k=>({v:ST[k][1]+J`点`,why:J`それは${ST[k][0]}です。${why}`})); L.push({v:s[0]+J`点`,why:J`それは最小値です。${why}`},{v:s[4]+J`点`,why:J`それは最大値です。${why}`});
  return {q:J`箱ひげ図の${nm}は？${f}`,ans,wrongs:W(ans,L),exp:J`最小値 ${s[0]}、第1四分位数 ${s[1]}、中央値 ${s[2]}、第3四分位数 ${s[3]}、最大値 ${s[4]} → ${nm} ${val}`,tf:v=>J`箱ひげ図の${nm}は ${v}${f}`,kind:"fig"}; }
function dice(){ const t=pick(["sum","sum","same","ge"]);
  if(t==="same") return {q:J`2つのさいころを投げるとき、同じ目が出る確率は？`,ans:frc(1,6),wrongs:W(frc(1,6),[{v:frc(1,36),why:J`同じ目は (1,1) 〜 (6,6) の6通りあります。`},{v:frc(5,6),why:J`それは、ちがう目が出る確率です。`},{v:frc(1,12),why:J`全部で 6×6 = 36 通り、そのうち同じ目は6通りです。`}]),exp:J`36通りのうち6通り → ${frc(6,36)}`,tf:v=>J`2つのさいころで同じ目が出る確率は ${v}`,kind:"word"};
  if(t==="ge"){ const s=R(9,11),cnt=[...Array(13-s)].reduce((acc,_,i)=>acc+6-Math.abs(s+i-7),0); const ans=frc(cnt,36);
    return {q:J`2つのさいころを投げるとき、目の和が ${s} 以上になる確率は？`,ans,wrongs:W(ans,[{v:frc(13-s,11),why:J`和は 2 〜 12 の11通りですが、どの和も同じように出るわけではありません。`},{v:frc(36-cnt,36),why:J`それは和が ${s} 未満になる確率です。`},{v:frc(cnt,6),why:J`全部で 6×6 = 36 通りです。`},{v:frc(cnt-1,36),why:J`(4,6) と (6,4) は別の出方です。表にして数えよう。`}]),exp:J`表にして数えると ${cnt} 通り → ${cnt}/36 = ${ans}`,tf:v=>J`2つのさいころで目の和が ${s} 以上になる確率は ${v}`,kind:"word"}; }
  const s=pick([3,4,5,6,8,9,10,11]),cnt=6-Math.abs(s-7),uc=Math.ceil(cnt/2),ans=frc(cnt,36);
  return {q:J`2つのさいころを投げるとき、目の和が ${s} になる確率は？`,ans,wrongs:W(ans,[{v:frc(1,11),why:J`和は 2 〜 12 の11通りですが、どの和も同じように出るわけではありません。`},{v:uc!==cnt?frc(uc,36):null,why:J`(1,2) と (2,1) のように、順番がちがう出方は別に数えます。`},{v:frc(36-cnt,36),why:J`それは和が ${s} にならない確率です。`},{v:frc(cnt,6),why:J`全部で 6×6 = 36 通りです。`}]),exp:J`和が ${s} になるのは ${cnt} 通り → ${cnt}/36 = ${ans}`,tf:v=>J`2つのさいころで目の和が ${s} になる確率は ${v}`,kind:"word"}; }
function coin(){ const t=pick(["c2a","c2b","c3a","c3b","c3c","b1","b2"]);
  const C={c2a:[J`2枚の硬貨を投げるとき、2枚とも表になる確率は？`,[1,4],[[1,2],J`1枚が表になる確率ではありません。`],[[1,3],J`表表・表裏・裏表・裏裏の4通り。表裏と裏表は別です。`],[[3,4],J`それは、少なくとも1枚が裏になる確率です。`],J`4通りのうち1通り`],
   c2b:[J`2枚の硬貨を投げるとき、1枚が表、1枚が裏になる確率は？`,[1,2],[[1,3],J`表裏と裏表は別の出方です（全部で4通り）。`],[[1,4],J`表裏と裏表の2通りあります。`],[[3,4],J`全部で4通り、そのうち2通りです。`],J`表裏・裏表の2通り／4通り`],
   c3a:[J`3枚の硬貨を投げるとき、3枚とも表になる確率は？`,[1,8],[[1,3],J`全部で 2×2×2 = 8 通りです。`],[[1,6],J`全部で 2×2×2 = 8 通りです。`],[[7,8],J`それは、少なくとも1枚が裏になる確率です。`],J`8通りのうち1通り`],
   c3b:[J`3枚の硬貨を投げるとき、少なくとも1枚は表になる確率は？`,[7,8],[[1,8],J`それは3枚とも裏になる確率です。1 からひきます。`],[[3,8],J`「少なくとも1枚」は、1枚・2枚・3枚すべてです。`],[[1,2],J`1 − (3枚とも裏の確率) で求めます。`],"1 − 1/8 = 7/8"],
   c3c:[J`3枚の硬貨を投げるとき、ちょうど2枚が表になる確率は？`,[3,8],[[1,8],J`表表裏・表裏表・裏表表の3通りあります。`],[[1,4],J`全部で8通り、そのうち3通りです。`],[[1,2],J`全部で8通り、そのうち3通りです。`],J`表表裏・表裏表・裏表表の3通り／8通り`]};
  if(C[t]){ const [q,[n,d],w1,w2,w3,ex]=C[t]; const ans=frc(n,d); return {q,ans,wrongs:[w1,w2,w3].map(([[a,b],why])=>({v:frc(a,b),why})),exp:ex,tf:v=>JA()?`${q.replace(J`確率は？`,J`確率は `)}${v}`:`${q}<br>→ ${v}`,kind:"word"}; }
  const r=R(2,5),w=R(2,4),n=r+w;
  if(t==="b1"){ const ans=frc(r,n),q=J`赤玉 ${r} 個、白玉 ${w} 個の袋から1個取り出すとき、赤玉の確率は？`; return {q,ans,wrongs:W(ans,[{v:frc(r,w),why:J`全体の個数（${n}個）でわります。`},{v:frc(w,n),why:J`それは白玉の確率です。`},{v:frc(1,n),why:J`赤玉は ${r} 個あります。`},{v:frc(1,2),why:J`赤と白の2通りですが、出やすさが同じではありません。`}]),exp:`${r}÷${n} = ${ans}`,tf:v=>JA()?`${q.replace(J`確率は？`,J`確率は `)}${v}`:`${q}<br>→ ${v}`,kind:"word"}; }
  const c2=k=>k*(k-1)/2, N=c2(n), ans=frc(c2(r),N), q=J`赤玉 ${r} 個、白玉 ${w} 個の袋から同時に2個取り出すとき、2個とも赤玉の確率は？`;
  return {q,ans,wrongs:W(ans,[{v:frc(r*r,n*n),why:J`同時に取り出すので、同じ玉を2回は取れません。組み合わせを数えます。`},{v:frc(r*w,N),why:J`それは赤と白が1個ずつの確率です。`},{v:frc(N-c2(r),N),why:J`それは2個とも赤にならない確率です。`},{v:w>=2?frc(c2(w),N):null,why:J`それは2個とも白の確率です。`}]),exp:J`取り出し方は全部で ${N} 通り、2個とも赤は ${c2(r)} 通り → ${ans}`,tf:v=>JA()?`${q.replace(J`確率は？`,J`確率は `)}${v}`:`${q}<br>→ ${v}`,kind:"word"}; }

/* ==================== 3年 ==================== */
const RT=n=>`<span class="rt">√<span>${n}</span></span>`;
// a√b（b=1 なら整数）
const SR=(a,b)=>{ if(!a) return "0"; if(b===1) return num(a); return (a===1?"":a===-1?M:num(a))+RT(b); };
function simp(n){ let a=1,b=n; for(let k=Math.floor(Math.sqrt(n));k>1;k--) if(n%(k*k)===0){ a=k; b=n/(k*k); break; } return [a,b]; }
const SS=(n,c=1)=>{ const [a,b]=simp(n); return SR(c*a,b); };   // c√n を簡単にした形
const SQF=[2,3,5,6,7];
const NSQ=[2,3,5,6,7,8,10,11,12,13,14,15];
const P2=(a,b,c,v="x")=>poly([[a,v+"²"],[b,v],[c,""]]);
const XX=V("x");
const RTS=(...r)=>`${XX} = ${[...new Set(r)].sort((p,q)=>p-q).map(num).join(", ")}`;

/* ---------- A(1) 平方根 ---------- */
function sq1(){ const t=pick(["root","val","neg","pow"]);
  if(t==="root"){ const n=R(2,13),q=J`${n*n} の平方根は？`,ans=`±${n}`;
    return {q,ans,wrongs:W(ans,[{v:num(n),why:J`平方根は正と負の2つあります。`},{v:M+n,why:J`正の平方根もあります（2つ）。`},{v:`±${n*n*2}`,why:J`2乗して ${n*n} になる数です。`},{v:`±${RT(n)}`,why:J`${n}² = ${n*n} なので、√ はつきません。`}]),exp:J`${n}² = ${n*n}、(${M}${n})² = ${n*n} → ±${n}`,tf:v=>J`${n*n} の平方根は ${v}`,kind:"calc"}; }
  if(t==="val"){ const n=R(2,13),Q0=RT(n*n);
    return {q:Q0,ans:num(n),wrongs:W(n,[{v:`±${n}`,why:J`√a は、正の方の平方根だけを表します。`},{v:n*n,why:J`√ は「2乗して ${n*n} になる正の数」です。`}],n),exp:`${n}² = ${n*n} → ${Q0} = ${n}`,tf:v=>`${Q0} = ${v}`,kind:"calc"}; }
  if(t==="neg"){ const n=R(2,13),Q0=M+RT(n*n);
    return {q:Q0,ans:num(-n),wrongs:W(-n,[{v:n,why:J`前に ${M} がついています。`},{v:`±${n}`,why:J`${M}√a は負の方の平方根だけです。`},{v:-n*n,why:J`√${n*n} = ${n} です。`}],-n),exp:`${RT(n*n)} = ${n} → ${M}${n}`,tf:v=>`${Q0} = ${v}`,kind:"calc"}; }
  const k=pick(NSQ),neg=Math.random()<.5,Q0=`(${neg?M:""}${RT(k)})²`;
  return {q:Q0,ans:num(k),wrongs:W(k,[{v:-k,why:neg?J`負の数の2乗は正の数です。`:J`(√a)² = a です。`},{v:2*k,why:J`2乗は2倍ではありません。`},{v:k*k,why:J`(√${k})² は √ がはずれて ${k} です。`}],k),exp:`(√a)² = a → ${k}`,tf:v=>`${Q0} = ${v}`,kind:"calc"}; }
function sq2(){ const t=pick(["simp","simp","mul","mul2","div"]); const a=R(2,5),b=pick(SQF),n=a*a*b;
  const alt=b!==a?SR(b,a):SR(a+1,b);
  if(t==="simp"){ const Q0=RT(n);
    return {q:J`${Q0} を ${V("a")}${RT(V("b"))} の形にすると？`,ans:SR(a,b),wrongs:W(SR(a,b),[{v:SR(a*a,b),why:J`${a*a} = ${a}² なので、√ の外には ${a} を出します。`},{v:alt,why:J`√ の外に出せるのは、2乗になっている数（${a*a}）だけです。`},{v:SR(a+1,b),why:J`${n} = ${a*a}×${b} に分けて確かめよう。`}]),exp:`${RT(n)} = ${RT(`${a*a}×${b}`)} = ${SR(a,b)}`,tf:v=>`${Q0} = ${v}`,kind:"expr"}; }
  if(t==="mul"){ const ds=[]; for(let x=2;x<n;x++) if(n%x===0&&x*x!==n) ds.push(x); if(!ds.length) return sq2(); const x=pick(ds),y=n/x,Q0=`${RT(x)} × ${RT(y)}`;
    return {q:Q0,ans:SR(a,b),wrongs:W(SR(a,b),[{v:SR(1,x+y),why:J`√a × √b = √(a×b)。たし算ではありません。`},{v:SR(a*a,b),why:J`${n} = ${a}²×${b} なので、外に出るのは ${a}。`},{v:alt,why:J`${n} = ${a*a}×${b} に分けて確かめよう。`}]),exp:`${RT(`${x}×${y}`)} = ${RT(n)} = ${SR(a,b)}`,tf:v=>`${Q0} = ${v}`,kind:"expr"}; }
  if(t==="mul2"){ const m=R(2,5),k=R(2,5),Q0=`${SR(m,b)} × ${SR(k,b)}`,ans=m*k*b;
    return {q:Q0,ans:num(ans),wrongs:W(ans,[{v:SR(m*k,b),why:J`${RT(b)} × ${RT(b)} = ${b} です。`},{v:(m+k)*b,why:J`係数どうしはかけ算です。`},{v:m*k*b*b,why:J`${RT(b)} × ${RT(b)} は ${b}² ではなく ${b}。`}],ans),exp:`${m}×${k}×${RT(b)}×${RT(b)} = ${m*k}×${b} = ${ans}`,tf:v=>`${Q0} = ${v}`,kind:"calc"}; }
  const x=pick(SQF),Q0=`${RT(x*n)} ÷ ${RT(x)}`;
  return {q:Q0,ans:SR(a,b),wrongs:W(SR(a,b),[{v:SR(1,x*n-x),why:J`√ の中どうしを「わり」ます。`},{v:SR(a*a,b),why:J`${n} = ${a}²×${b} なので、外に出るのは ${a}。`},{v:SR(a*x,b),why:J`${RT(x)} でわるのを確かめよう。`},{v:alt,why:J`√ の外に出せるのは、2乗になっている数だけです。`}]),exp:`${RT(`${x*n}÷${x}`)} = ${RT(n)} = ${SR(a,b)}`,tf:v=>`${Q0} = ${v}`,kind:"expr"}; }
function sq3(){ const b=pick(SQF);
  if(Math.random()<.5){ const p=NZ(-6,6),q=NZ(-6,6); if(p+q===0||p===q) return sq3(); const Q0=`${SR(p,b)} ${q<0?M:"+"} ${SR(Math.abs(q),b)}`,ans=SR(p+q,b);
    return {q:Q0,ans,wrongs:W(ans,[{v:SR(p+q,2*b),why:J`√ の中はそのまま。係数だけをたします。`},{v:SR(p-q,b),why:J`符号を確かめよう。`},{v:SR(p*q,b),why:J`係数どうしは「たし算」です。`},{v:SR(-(p+q),b),why:J`符号を確かめよう。`}]),exp:`(${num(p)} ${q<0?M:"+"} ${Math.abs(q)})${RT(b)} = ${ans}`,tf:v=>`${Q0} = ${v}`,kind:"expr"}; }
  const a1=R(1,5),a2=R(1,5); if(a1===a2) return sq3(); const sub=Math.random()<.5,s=sub?-1:1,c=a1+s*a2,op=sub?M:"+"; const n1=a1*a1*b,n2=a2*a2*b,Q0=`${RT(n1)} ${op} ${RT(n2)}`,ans=SR(c,b);
  return {q:Q0,ans,wrongs:W(ans,[{v:n1+s*n2>0?SR(1,n1+s*n2):null,why:J`√ の中どうしは${sub?J`ひけ`:J`たせ`}ません。先に ${V("a")}${RT(V("b"))} の形にします。`},{v:SR(a1*a2,b),why:J`係数どうしは、かけずに` +(sub?J`ひきます。`:J`たします。`)},{v:SR(a1-s*a2,b),why:J`符号を確かめよう。`},{v:SR(c+1,b),why:J`${RT(n1)} = ${SR(a1,b)}、${RT(n2)} = ${SR(a2,b)} から確かめよう。`}]),exp:`${SR(a1,b)} ${op} ${SR(a2,b)} = ${ans}`,tf:v=>`${Q0} = ${v}`,kind:"expr"}; }
function sq4(){ const b=pick(SQF),k=R(1,12),g=gcd(k,b),nk=k/g,d=b/g; const ans=d===1?SR(nk,b):fr(SR(nk,b),d),Q0=fr(k,RT(b));
  return {q:J`${Q0} の分母を有理化すると？`,ans,wrongs:W(ans,[{v:SR(k,b),why:J`分母と分子に ${RT(b)} をかけると、分母は ${b} になります。`},{v:frc(k,b),why:J`分子にも ${RT(b)} がつきます。`},{v:k>1?fr(RT(b),k):null,why:J`分母と分子が入れかわっています。`},{v:fr(SR(nk,b),d*2),why:J`分母は ${RT(b)}×${RT(b)} = ${b} です。`},{v:d===1?fr(SR(nk,b),b):SR(nk,b),why:J`約分を確かめよう。`}]),exp:J`分母と分子に ${RT(b)} をかける：${fr(SR(k,b),b)}${g>1?` = ${ans}`:""}`,tf:v=>`${Q0} = ${v}`,kind:"expr"}; }
function sq5(){ if(Math.random()<.5){ let n; do{ n=R(5,99); }while(Number.isInteger(Math.sqrt(n))); const f=Math.floor(Math.sqrt(n)),h=Math.floor(n/2); const ans=J`${f} と ${f+1} の間`;
    return {q:J`${RT(n)} は、どの2つの整数の間にある？`,ans,wrongs:W(ans,[{v:J`${f-1} と ${f} の間`,why:J`${f}² = ${f*f} は ${n} より小さいので、${RT(n)} は ${f} より大きい。`},{v:J`${f+1} と ${f+2} の間`,why:J`${f+1}² = ${(f+1)**2} は ${n} より大きいので、${RT(n)} は ${f+1} より小さい。`},{v:h>f+1?J`${h} と ${h+1} の間`:null,why:J`${RT(n)} は ${n}÷2 ではありません。2乗してくらべよう。`},{v:J`${f+2} と ${f+3} の間`,why:J`2乗してくらべよう。`}]),exp:J`${f}² = ${f*f}、${f+1}² = ${(f+1)**2} → ${f*f} < ${n} < ${(f+1)**2}`,tf:v=>J`${RT(n)} は ${v}`,kind:"word"}; }
  const C=[]; for(let k=2;k<=7;k++) C.push([num(k),k*k]); for(let a=1;a<=3;a++) for(const b of SQF) if(a*a*b<=50) C.push([SR(a,b),a*a*b]);
  const pk=[],seen=new Set(); for(const c of shuffle(C)){ if(seen.has(c[1])) continue; seen.add(c[1]); pk.push(c); if(pk.length===4) break; }
  const big=Math.random()<.6, s=pk.slice().sort((x,y)=>big?y[1]-x[1]:x[1]-y[1]); const lab=c=>`${c[0]} = ${RT(c[1])}`;
  return {q:J`いちばん${big?J`大きい`:J`小さい`}数は？<br>${pk.map(c=>c[0]).join(J`、 `)}`,ans:s[0][0],wrongs:s.slice(1).map(c=>({v:c[0],why:J`${lab(c)}、${lab(s[0])}。√ の形にしてくらべよう。`})),exp:J`すべて √ の形にする：${pk.map(lab).join(J`、`)}`,tf:v=>J`${pk.map(c=>c[0]).join(J`、 `)} でいちばん${big?J`大きい`:J`小さい`}のは ${v}`,kind:"word"}; }

/* ---------- A(2) 展開と因数分解 ---------- */
function ex1(){ const a=NZ(-7,7),b=NZ(-7,7); if(a+b===0) return ex1(); const Q0=`(${lin(1,a)})(${lin(1,b)})`,ans=P2(1,a+b,a*b);
  return {q:Q0,ans,wrongs:W(ans,[{v:P2(1,0,a*b),why:J`${XX} の項（${num(a)}${XX} と ${num(b)}${XX}）を忘れています。`},{v:P2(1,a*b,a+b),why:J`${XX} の係数は「和」、数の項は「積」です。`},{v:P2(1,a+b,-a*b),why:J`数の項の符号を確かめよう。`},{v:P2(1,-(a+b),a*b),why:J`${XX} の項の符号を確かめよう。`}]),exp:`(x + a)(x + b) = x² + (a + b)x + ab → ${ans}`,tf:v=>`${Q0} = ${v}`,kind:"expr"}; }
function ex2(){ const t=pick(["sq","sq","k","diff"]);
  if(t==="sq"){ const a=NZ(-9,9),Q0=`(${lin(1,a)})²`,ans=P2(1,2*a,a*a);
    return {q:Q0,ans,wrongs:W(ans,[{v:P2(1,0,a*a),why:J`まん中の項 ${mono(2*a,"x")} を忘れています（2乗は2つの項をそれぞれ2乗するだけではありません）。`},{v:P2(1,a,a*a),why:J`まん中の項は 2×${par(a)}×${XX} です。`},{v:P2(1,2*a,-a*a),why:J`${par(a)}² は正の数です。`},{v:P2(1,-2*a,a*a),why:J`まん中の項の符号を確かめよう。`}]),exp:`(x + a)² = x² + 2ax + a² → ${ans}`,tf:v=>`${Q0} = ${v}`,kind:"expr"}; }
  if(t==="k"){ const k=R(2,4),a=NZ(-6,6),Q0=`(${lin(k,a)})²`,ans=P2(k*k,2*k*a,a*a);
    return {q:Q0,ans,wrongs:W(ans,[{v:P2(k,2*k*a,a*a),why:J`(${mono(k,"x")})² = ${mono(k*k,"x²")} です。`},{v:P2(k*k,0,a*a),why:J`まん中の項を忘れています。`},{v:P2(k*k,k*a,a*a),why:J`まん中の項は 2×${mono(k,"x")}×${par(a)} です。`},{v:P2(k*k,2*k*a,-a*a),why:J`最後の項は正の数です。`}]),exp:`(${mono(k,"x")})² + 2×${mono(k,"x")}×${par(a)} + ${par(a)}² = ${ans}`,tf:v=>`${Q0} = ${v}`,kind:"expr"}; }
  const a=R(1,9),Q0=`(${lin(1,a)})(${lin(1,-a)})`,ans=P2(1,0,-a*a);
  return {q:Q0,ans,wrongs:W(ans,[{v:P2(1,0,a*a),why:J`${a}×(${M}${a}) で、数の項は負になります。`},{v:P2(1,-2*a,-a*a),why:J`${XX} の項は ${mono(a,"x")} と ${mono(-a,"x")} で打ち消し合います。`},{v:P2(1,0,-2*a),why:J`${a}×${a} = ${a*a} です。`},{v:P2(1,2*a,-a*a),why:J`${XX} の項は打ち消し合って 0 になります。`}]),exp:`(x + a)(x − a) = x² − a² → ${ans}`,tf:v=>`${Q0} = ${v}`,kind:"expr"}; }
function ex3(){ if(Math.random()<.5){ const k=pick([2,3,4,5,6,-2,-3]),b=NZ(-7,7); if(Math.abs(b)===1&&false) return ex3(); const Q0=P2(k,k*b,0),ans=`${mono(k,"x")}(${lin(1,b)})`;
    return {q:J`${Q0} を因数分解すると？`,ans,wrongs:W(ans,[{v:`${num(k)}(${P2(1,b,0)})`,why:J`${XX} も共通因数です。`},{v:`${XX}(${lin(k,k*b)})`,why:J`数の共通因数 ${num(k)} もくくり出します。`},{v:`${mono(k,"x")}(${lin(1,k*b)})`,why:J`かっこの中は、各項を ${mono(k,"x")} でわった式です。`},{v:`${mono(k,"x")}(${lin(1,-b)})`,why:J`かっこの中の符号を確かめよう。`}]),exp:J`共通因数 ${mono(k,"x")} をくくり出す → ${ans}`,tf:v=>`${Q0} = ${v}`,kind:"expr"}; }
  const k=R(2,6),p=R(1,5),q=NZ(-7,7); if(gcd(p,q)!==1) return ex3(); const Q0=poly([[k*p,"ab"],[k*q,"b"]]),ans=`${mono(k,"b")}(${lin(p,q,"a")})`;
  return {q:J`${Q0} を因数分解すると？`,ans,wrongs:W(ans,[{v:`${k}(${poly([[p,"ab"],[q,"b"]])})`,why:J`${V("b")} も共通因数です。`},{v:`${V("b")}(${lin(k*p,k*q,"a")})`,why:J`数の共通因数 ${k} もくくり出します。`},{v:`${mono(k,"b")}(${lin(p,k*q,"a")})`,why:J`かっこの中は、各項を ${mono(k,"b")} でわった式です。`},{v:`${mono(k,"ab")}(${lin(p,q,"")})`,why:J`${V("a")} は2つ目の項にありません。`}]),exp:J`共通因数 ${mono(k,"b")} をくくり出す → ${ans}`,tf:v=>`${Q0} = ${v}`,kind:"expr"}; }
const FP=(p,q,k=1)=>{ const [x,y]=[p,q].sort((m,n)=>n-m); return x===y?`(${lin(k,x)})²`:`(${lin(k,x)})(${lin(k,y)})`; };
function ex4(){ const a=NZ(-8,8),b=NZ(-8,8); if(a===b||a===-b) return ex4(); const Q0=P2(1,a+b,a*b),ans=FP(a,b);
  const pr=[]; const P=a*b; for(let c=-Math.abs(P);c<=Math.abs(P);c++){ if(!c||P%c) continue; const d=P/c; if(c<=d&&c+d!==a+b) pr.push([c,d]); } const o=pr.length?pick(pr):null;
  return {q:J`${Q0} を因数分解すると？`,ans,wrongs:W(ans,[{v:FP(-a,-b),why:J`符号を確かめよう。たして ${num(a+b)}、かけて ${num(a*b)} になる2数を探します。`},{v:o?FP(o[0],o[1]):null,why:o?J`かけると ${num(a*b)} ですが、たすと ${num(o[0]+o[1])} になります。`:""},{v:FP(a,-b),why:J`かけると ${num(-a*b)} になってしまいます。`},{v:FP(-a,b),why:J`かけると ${num(-a*b)} になってしまいます。`}]),exp:J`たして ${num(a+b)}、かけて ${num(a*b)} になる2数は ${num(a)} と ${num(b)} → ${ans}`,tf:v=>`${Q0} = ${v}`,kind:"expr"}; }
function ex5(){ const t=pick(["sq","diff","k"]);
  if(t==="sq"){ const a=NZ(-8,8),Q0=P2(1,2*a,a*a),ans=FP(a,a);
    return {q:J`${Q0} を因数分解すると？`,ans,wrongs:W(ans,[{v:FP(-a,-a),why:J`かっこの中の符号は、まん中の項の符号と同じです。`},{v:FP(a,-a),why:J`それを展開すると ${P2(1,0,-a*a)} です。`},{v:FP(2*a,2*a),why:J`かっこの中は ${num(a)}（${num(2*a)} は 2×${par(a)} の部分）。`}]),exp:`x² + 2ax + a² = (x + a)² → ${ans}`,tf:v=>`${Q0} = ${v}`,kind:"expr"}; }
  if(t==="diff"){ const a=R(2,9),Q0=P2(1,0,-a*a),ans=FP(a,-a);
    return {q:J`${Q0} を因数分解すると？`,ans,wrongs:W(ans,[{v:FP(-a,-a),why:J`それを展開すると ${P2(1,-2*a,a*a)} です。`},{v:FP(a,a),why:J`それを展開すると ${P2(1,2*a,a*a)} です。`},{v:FP(a*a,-1),why:J`${a*a} = ${a}² を使って x² − a² = (x + a)(x − a)。`}]),exp:`x² − a² = (x + a)(x − a) → ${ans}`,tf:v=>`${Q0} = ${v}`,kind:"expr"}; }
  const k=R(2,5),a=R(1,9); if(gcd(k,a)!==1) return ex5(); const Q0=P2(k*k,0,-a*a),ans=FP(a,-a,k);
  return {q:J`${Q0} を因数分解すると？`,ans,wrongs:W(ans,[{v:FP(a,-a,k*k),why:J`${mono(k*k,"x²")} = (${mono(k,"x")})² です。`},{v:FP(-a,-a,k),why:J`それを展開すると ${P2(k*k,-2*k*a,a*a)} です。`},{v:FP(a,a,k),why:J`それを展開すると ${P2(k*k,2*k*a,a*a)} です。`}]),exp:`(${mono(k,"x")})² − ${a}² = ${ans}`,tf:v=>`${Q0} = ${v}`,kind:"expr"}; }

/* ---------- A(3) 2次方程式 ---------- */
function qe1(){ const t=pick(["sq","sqr","shift"]); const X2=P2(1,0,0);
  if(t==="sq"){ const n=R(2,12),Q0=`${X2} = ${n*n}`,ans=`${XX} = ±${n}`;
    return {q:Q0,ans,wrongs:W(ans,[{v:`${XX} = ${n}`,why:J`${M}${n} も2乗すると ${n*n}。解は2つです。`},{v:`${XX} = ±${RT(n)}`,why:J`${n*n} = ${n}² なので √ はつきません。`},{v:`${XX} = ±${n*n}`,why:J`両辺の平方根をとります。`}]),exp:J`${XX} は ${n*n} の平方根 → ±${n}`,tf:v=>J`${Q0} の解は ${v}`,kind:"eq"}; }
  if(t==="sqr"){ const k=pick(NSQ),a=R(1,4),Q0=`${P2(a,0,0)} = ${a*k}`,ans=`${XX} = ±${SS(k)}`;
    return {q:Q0,ans,wrongs:W(ans,[{v:`${XX} = ${SS(k)}`,why:J`解は正と負の2つあります。`},{v:`${XX} = ±${k}`,why:J`${XX}² = ${k} なので、${XX} = ±${RT(k)} です。`},{v:a>1?`${XX} = ±${SS(a*k)}`:`${XX} = ±${k*k}`,why:a>1?J`先に両辺を ${a} でわります。`:J`両辺の平方根をとります。`}]),exp:`${a>1?J`両辺を ${a} でわって ${XX}² = ${k} → `:""}${XX} = ±${RT(k)}${simp(k)[0]>1?` = ±${SS(k)}`:""}`,tf:v=>J`${Q0} の解は ${v}`,kind:"eq"}; }
  const a=NZ(-6,6),n=R(1,6),Q0=`(${lin(1,a)})² = ${n*n}`,ans=RTS(-a+n,-a-n);
  return {q:Q0,ans,wrongs:W(ans,[{v:RTS(a+n,a-n),why:J`${lin(1,a)} = ±${n} → ${XX} = ${num(-a)} ± ${n}。符号に注意。`},{v:RTS(-a+n),why:J`${lin(1,a)} = ${M}${n} の場合もあります。解は2つ。`},{v:RTS(-a+n*n,-a-n*n),why:J`両辺の平方根をとると ${lin(1,a)} = ±${n}。`}]),exp:`${lin(1,a)} = ±${n} → ${XX} = ${num(-a)} ± ${n}`,tf:v=>J`${Q0} の解は ${v}`,kind:"eq"}; }
function qe2(){ if(Math.random()<.25){ const b=NZ(-9,9),Q0=`${P2(1,b,0)} = 0`,ans=RTS(0,-b);
    return {q:Q0,ans,wrongs:W(ans,[{v:RTS(-b),why:J`${XX} = 0 も解です。両辺を ${XX} でわってはいけません。`},{v:RTS(0,b),why:J`${XX}(${lin(1,b)}) = 0 → ${XX} = ${num(-b)}。符号に注意。`},{v:RTS(b),why:J`${XX}(${lin(1,b)}) = 0 から、解は2つです。`}]),exp:`${XX}(${lin(1,b)}) = 0 → ${ans}`,tf:v=>J`${Q0} の解は ${v}`,kind:"eq"}; }
  const r1=NZ(-8,8),r2=NZ(-8,8); if(r1===r2||r1===-r2) return qe2(); const Q0=`${P2(1,-(r1+r2),r1*r2)} = 0`,ans=RTS(r1,r2);
  return {q:Q0,ans,wrongs:W(ans,[{v:RTS(-r1,-r2),why:J`(${lin(1,-r1)})(${lin(1,-r2)}) = 0 の解は ${XX} = ${num(r1)}, ${num(r2)}。符号に注意。`},{v:RTS(r1,-r2),why:J`符号を確かめよう。`},{v:RTS(-r1,r2),why:J`符号を確かめよう。`}]),exp:`(${lin(1,-r1)})(${lin(1,-r2)}) = 0 → ${ans}`,tf:v=>J`${Q0} の解は ${v}`,kind:"eq"}; }
function qfmt(nb,s,r,den){ const g=gcd(gcd(Math.abs(nb),s),Math.abs(den))||1; let n1=nb/g,s1=s/g,d1=den/g; if(d1<0){ n1=-n1; d1=-d1; }
  const top=(n1?`${num(n1)} ± `:"±")+SR(s1,r); return `${XX} = ${d1===1?top:fr(top,d1)}`; }
function qe3(){ const a=pick([1,1,2,3]),b=NZ(-7,7),c=NZ(-6,6),D=b*b-4*a*c; if(D<=0) return qe3(); const [s,r]=simp(D); if(r===1) return qe3();
  const Q0=`${P2(a,b,c)} = 0`,ans=qfmt(-b,s,r,2*a); const alt=d=>{ if(d<=0) return null; const [s2,r2]=simp(d); return r2>1?qfmt(-b,s2,r2,2*a):null; };
  return {q:Q0,ans,wrongs:W(ans,[{v:qfmt(b,s,r,2*a),why:J`分子は ${M}${V("b")}、つまり ${num(-b)} です。`},{v:qfmt(-b,s,r,a),why:J`分母は 2${V("a")} = ${2*a} です。`},{v:alt(b*b+4*a*c),why:J`√ の中は ${V("b")}² ${M} 4${V("a")}${V("c")}。符号に注意。`},{v:alt(b*b-a*c),why:J`√ の中は ${V("b")}² ${M} 4${V("a")}${V("c")}（4 を忘れずに）。`}]),
    exp:J`解の公式：${XX} = ${fr(`${num(-b)} ± ${RT(`${par(b)}² ${M} 4×${a}×${par(c)}`)}`,`2×${a}`)} = ${fr(`${num(-b)} ± ${RT(D)}`,2*a)}${s>1||gcd(Math.abs(b),2*a)>1?` → ${ans.replace(XX+" = ","")}`:""}`,tf:v=>J`${Q0} の解は ${v}`,kind:"eq"}; }
function qe4(){ const r=NZ(-6,6),s=NZ(-6,6); if(r===s||r*s===0) return qe4(); const c=r*s,a=-(r+s); if(!a) return qe4();
  const Q0=`${P2(1,0,0)} + ${V("a")}${XX} ${c<0?M:"+"} ${Math.abs(c)} = 0`;
  if(Math.random()<.55) return {q:J`${Q0} の解の1つが ${XX} = ${num(r)} のとき、${V("a")} の値は？`,ans:num(a),wrongs:W(a,[{v:r+s,why:J`符号を確かめよう。`},{v:s,why:J`それはもう1つの解です。`},{v:-(r*r+c),why:J`代入した式を ${V("a")} について解きます（${num(r)} でわる）。`}],a),exp:J`${XX} = ${num(r)} を代入：${par(r)}² + ${V("a")}×${par(r)} ${c<0?M:"+"} ${Math.abs(c)} = 0 → ${V("a")} = ${num(a)}`,tf:v=>J`${Q0} の解の1つが ${XX} = ${num(r)} のとき、${V("a")} = ${v}`,kind:"word"};
  return {q:J`${Q0} の解の1つが ${XX} = ${num(r)} のとき、もう1つの解は？`,ans:num(s),wrongs:W(s,[{v:-s,why:J`符号を確かめよう。`},{v:a,why:J`それは ${V("a")} の値です。式に入れて解きます。`},{v:-r,why:J`${V("a")} を求めて、もとの方程式を解こう。`}],s),exp:J`代入して ${V("a")} = ${num(a)} → ${P2(1,a,c)} = 0 → (${lin(1,-r)})(${lin(1,-s)}) = 0 → ${XX} = ${num(s)}`,tf:v=>J`${Q0} の解の1つが ${XX} = ${num(r)} のとき、もう1つの解は ${v}`,kind:"word"}; }

/* ---------- B(1) 相似 ---------- */
const RATS=[[1,2],[1,3],[2,3],[3,4],[2,5],[3,5],[4,5],[3,7]];
function sim1(){ const [m,n]=pick(RATS),u=R(1,4),v=R(2,5); if(u===v) return sim1();
  if(Math.random()<.6){ const pre=J`△ABC ∽ △DEF で、AB = ${m*u}cm、DE = ${n*u}cm、BC = ${m*v}cm のとき、`,ans=n*v+"cm";
    return {q:J`${pre}EF の長さは？`,ans,wrongs:W(ans,[{v:(m*v+(n-m)*u)+"cm",why:J`差をたすのではなく、相似比（比）を使います。`},{v:(m*m*v)%n===0?(m*m*v/n)+"cm":null,why:J`相似比の向きが逆です。`},{v:n*u+"cm",why:J`それは DE の長さです。`},{v:(m*u+m*v)+"cm",why:J`相似比を使って求めます。`},{v:2*n*v+"cm",why:J`相似比を確かめよう。`}]),exp:J`相似比は AB : DE = ${m} : ${n} → EF = ${m*v}×${fr(n,m)} = ${n*v}`,tf:x=>`${pre}EF = ${x}`,kind:"word"}; }
  const pre=J`△ABC ∽ △DEF で、AB = ${m*u}cm、DE = ${n*u}cm のとき、`,ans=`${m} : ${n}`;
  return {q:J`${pre}△ABC と △DEF の相似比は？`,ans,wrongs:W(ans,[{v:`${n} : ${m}`,why:J`△ABC が先なので AB : DE の順です。`},{v:u>1?`${m*u} : ${n*u}`:`${m**3} : ${n**3}`,why:u>1?J`もっとも簡単な整数の比にします。`:J`それは体積比です。`},{v:`${m*m} : ${n*n}`,why:J`それは面積比です。`}]),exp:`AB : DE = ${m*u} : ${n*u} = ${m} : ${n}`,tf:x=>J`${pre}相似比は ${x}`,kind:"word"}; }
const S_AA=J`2組の角がそれぞれ等しい`,S_SSS=J`3組の辺の比がすべて等しい`,S_SAS=J`2組の辺の比とその間の角がそれぞれ等しい`;
const simB=bank([
 [J`∠A = ∠D、∠B = ∠E のとき、△ABC ∽ △DEF となる相似条件は？`,S_AA,[[S_SSS,J`辺の長さは分かっていません。`],[S_SAS,J`辺の比は分かっていません。`],[J`1組の辺とその両端の角がそれぞれ等しい`,J`それは合同条件です。`]],J`角が2組等しい → 2組の角がそれぞれ等しい`],
 [J`AB : DE = BC : EF = CA : FD = 2 : 3 のとき、△ABC ∽ △DEF となる相似条件は？`,S_SSS,[[S_AA,J`角は分かっていません。`],[S_SAS,J`3組すべての辺の比が分かっています。`],[J`3組の辺がそれぞれ等しい`,J`それは合同条件です。`]],J`3組の辺の比が等しい`],
 [J`AB : DE = AC : DF = 3 : 5、∠A = ∠D のとき、△ABC ∽ △DEF となる相似条件は？`,S_SAS,[[S_SSS,J`BC と EF の比は分かっていません。`],[S_AA,J`等しい角は1組だけです。`],[J`2組の辺とその間の角がそれぞれ等しい`,J`それは合同条件です。`]],J`∠A は AB と AC の間の角`],
 [J`△ABC と △ADE で、∠A が共通、DE∥BC のとき、使う相似条件は？`,S_AA,[[S_SSS,J`辺の比は分かっていません。`],[S_SAS,J`辺の比は分かっていません。`],[J`3組の辺がそれぞれ等しい`,J`それは合同条件です。`]],J`∠A が共通、平行線の同位角で ∠ADE = ∠ABC → 2組の角`],
 [J`相似な2つの図形で、対応する角の大きさは？`,J`等しい`,[[J`相似比の分だけ大きくなる`,J`形が同じなので、角は変わりません。`],[J`相似比の2乗になる`,J`2乗になるのは面積比です。`],[J`180° から引いた大きさになる`,J`対応する角は等しくなります。`]],J`相似 → 対応する角は等しく、対応する辺の比は等しい`],
 [J`記号「∽」の意味は？`,J`相似（形が同じ。大きさはちがってもよい）`,[[J`合同（形も大きさも同じ）`,J`合同の記号は ≡ です。`],[J`平行`,J`平行の記号は ∥ です。`],[J`垂直`,J`垂直の記号は ⊥ です。`]],J`∽ は相似の記号`],
]);
function triDE(t,L,nm=["D","E"]){ const A=[120,15],B=[30,135],C=[210,135],D=[A[0]+(B[0]-A[0])*t,A[1]+(B[1]-A[1])*t],E=[A[0]+(C[0]-A[0])*t,A[1]+(C[1]-A[1])*t];
  const mid=(p,q)=>[(p[0]+q[0])/2,(p[1]+q[1])/2]; const T=(p,s,dx,anc,cl)=>s?`<text x="${(p[0]+dx).toFixed(0)}" y="${(p[1]+4).toFixed(0)}" class="${cl||"lb"}" text-anchor="${anc}">${s}</text>`:"";
  return SV(250,158,`<polygon points="${A} ${B} ${C}" class="f1"/><line x1="${D[0]}" y1="${D[1]}" x2="${E[0]}" y2="${E[1]}" class="ln"/>
  <text x="114" y="11" class="lb">A</text><text x="16" y="146" class="lb">B</text><text x="214" y="146" class="lb">C</text><text x="${D[0]-16}" y="${D[1]+2}" class="lb">${nm[0]}</text><text x="${E[0]+6}" y="${E[1]+2}" class="lb">${nm[1]}</text>
  ${T(mid(A,D),L.AD,-10,"end")}${T(mid(D,B),L.DB,-10,"end")}${T(mid(A,E),L.AE,10,"start")}${T(mid(E,C),L.EC,10,"start")}${T([120,D[1]-6],L.DE,0,"middle")}${T([120,148],L.BC,0,"middle")}`); }
function sim3(){ if(Math.random()<.5){ const a=R(2,6),b=R(2,6),w=R(1,3); if(a===b) return sim3(); const c=a*w,ans=b*w,f=triDE(a/(a+b),{AD:a,DB:b,AE:c,EC:XI});
    return {q:J`DE∥BC のとき、${V("x")} の値は？${f}`,ans:num(ans),wrongs:W(ans,[{v:(c*a)%b===0?c*a/b:null,why:J`AD : DB = AE : EC の対応を確かめよう。`},{v:c+b-a,why:J`差ではなく比を使います。`},{v:c,why:J`AE と EC が等しいとはかぎりません。`},{v:a+b,why:J`AD : DB = AE : EC を使います。`}],ans),exp:`AD : DB = AE : EC → ${a} : ${b} = ${c} : ${V("x")} → ${V("x")} = ${ans}`,tf:v=>`${V("x")} = ${v}${f}`,kind:"fig"}; }
  const a=R(2,5),b=R(1,5),w=R(1,3); if(a===b) return sim3(); const bc=(a+b)*w,ans=a*w,f=triDE(a/(a+b),{AD:a,DB:b,DE:XI,BC:bc});
  return {q:J`DE∥BC のとき、${V("x")} の値は？${f}`,ans:num(ans),wrongs:W(ans,[{v:(bc*a)%b===0?bc*a/b:null,why:J`AD : DB ではなく AD : AB = DE : BC を使います。`},{v:bc%2===0?bc/2:null,why:J`D は中点とはかぎりません。`},{v:bc-b,why:J`差ではなく比を使います。`},{v:b*w,why:J`AD : AB = DE : BC。DB ではなく AD を使います。`}],ans),exp:`AD : AB = DE : BC → ${a} : ${a+b} = ${V("x")} : ${bc} → ${V("x")} = ${ans}`,tf:v=>`${V("x")} = ${v}${f}`,kind:"fig"}; }
function sim4(){ const k=R(3,12);
  if(Math.random()<.55){ const f=triDE(.5,{BC:2*k+"cm",DE:XI},["M","N"]);
    return {q:J`M、N は AB、AC の中点。${V("x")}（MN）の長さは？${f}`,ans:k+"cm",wrongs:W(k+"cm",[{v:2*k+"cm",why:J`MN は BC の半分です。`},{v:4*k+"cm",why:J`中点連結定理：MN = ½BC。`},{v:(k+2)+"cm",why:J`中点連結定理：MN = ½BC。`},{v:(2*k-2)+"cm",why:J`中点連結定理：MN = ½BC。`}]),exp:J`中点連結定理：MN∥BC、MN = ½BC = ${k}cm`,tf:v=>`MN = ${v}${f}`,kind:"fig"}; }
  const f=triDE(.5,{BC:XI,DE:k+"cm"},["M","N"]);
  return {q:J`M、N は AB、AC の中点。${V("x")}（BC）の長さは？${f}`,ans:2*k+"cm",wrongs:W(2*k+"cm",[{v:k+"cm",why:J`BC は MN の2倍です。`},{v:k%2===0?k/2+"cm":(4*k)+"cm",why:J`中点連結定理：MN = ½BC。`},{v:(k+2)+"cm",why:J`中点連結定理：BC = 2MN。`}]),exp:J`中点連結定理：BC = 2MN = ${2*k}cm`,tf:v=>`BC = ${v}${f}`,kind:"fig"}; }
function sim5(){ const [m,n]=pick(RATS.filter(([a,b])=>a>1||b<4)),t=pick(["ar","vol","arv","volv"]);
  if(t==="ar") return {q:J`相似比が ${m} : ${n} の2つの図形の面積比は？`,ans:`${m*m} : ${n*n}`,wrongs:[{v:`${m} : ${n}`,why:J`面積比は相似比の2乗です。`},{v:`${m**3} : ${n**3}`,why:J`それは体積比です（3乗）。`},{v:`${2*m} : ${2*n}`,why:J`2倍ではなく2乗します。`}],exp:J`面積比 = ${m}² : ${n}² = ${m*m} : ${n*n}`,tf:v=>J`相似比 ${m} : ${n} の図形の面積比は ${v}`,kind:"word"};
  if(t==="vol") return {q:J`相似比が ${m} : ${n} の2つの立体の体積比は？`,ans:`${m**3} : ${n**3}`,wrongs:[{v:`${m} : ${n}`,why:J`体積比は相似比の3乗です。`},{v:`${m*m} : ${n*n}`,why:J`それは面積比（表面積の比）です。`},{v:`${3*m} : ${3*n}`,why:J`3倍ではなく3乗します。`}],exp:J`体積比 = ${m}³ : ${n}³ = ${m**3} : ${n**3}`,tf:v=>J`相似比 ${m} : ${n} の立体の体積比は ${v}`,kind:"word"};
  const w=R(1,4); if(t==="arv"){ const S1=m*m*w,ans=n*n*w,q=J`相似比 ${m} : ${n} の図形 P、Q がある。P の面積が ${S1}cm² のとき、Q の面積は？`;
    return {q,ans:ans+"cm²",wrongs:W(ans+"cm²",[{v:(S1*n)%m===0?S1*n/m+"cm²":null,why:J`面積比は相似比の2乗です。`},{v:n**3*w+"cm²",why:J`面積比は2乗（3乗は体積比）。`},{v:(S1+n*n-m*m)+"cm²",why:J`面積比は相似比の2乗です。`},{v:2*ans+"cm²",why:J`面積比は相似比の2乗です。`}]),exp:J`面積比 ${m*m} : ${n*n} → ${S1}×${fr(n*n,m*m)} = ${ans}`,tf:v=>JA()?`${q.replace(J`面積は？`,J`面積は `)}${v}`:`${q}<br>→ ${v}`,kind:"word"}; }
  const V1=m**3*w,ans=n**3*w,q=J`相似比 ${m} : ${n} の立体 P、Q がある。P の体積が ${V1}cm³ のとき、Q の体積は？`;
  return {q,ans:ans+"cm³",wrongs:W(ans+"cm³",[{v:(V1*n)%m===0?V1*n/m+"cm³":null,why:J`体積比は相似比の3乗です。`},{v:(V1*n*n)%(m*m)===0?V1*n*n/(m*m)+"cm³":null,why:J`体積比は2乗ではなく3乗です。`},{v:2*ans+"cm³",why:J`体積比は相似比の3乗です。`},{v:(V1+n**3-m**3)+"cm³",why:J`体積比は相似比の3乗です。`}]),exp:J`体積比 ${m**3} : ${n**3} → ${V1}×${fr(n**3,m**3)} = ${ans}`,tf:v=>JA()?`${q.replace(J`体積は？`,J`体積は `)}${v}`:`${q}<br>→ ${v}`,kind:"word"}; }

/* ---------- B(2) 円周角 ---------- */
const CC=[120,92],CR=68; const CP=d=>[CC[0]+CR*Math.cos(d*Math.PI/180),CC[1]-CR*Math.sin(d*Math.PI/180)];
function angL(Vx,P1,P2,d){ const u=p=>{ const x=p[0]-Vx[0],y=p[1]-Vx[1],l=Math.hypot(x,y); return [x/l,y/l]; }; const a=u(P1),b=u(P2); let x=a[0]+b[0],y=a[1]+b[1]; const l=Math.hypot(x,y)||1; return [Vx[0]+x/l*d,Vx[1]+y/l*d+5]; }
function cfig(pts,segs,labs){ const P={O:CC}; for(const k in pts) P[k]=CP(pts[k]); const f=n=>n.toFixed(1);
  let b=`<circle cx="${CC[0]}" cy="${CC[1]}" r="${CR}" class="ax" fill="none"/>`;
  for(const [a,c] of segs) b+=`<line x1="${f(P[a][0])}" y1="${f(P[a][1])}" x2="${f(P[c][0])}" y2="${f(P[c][1])}" class="ln"/>`;
  for(const k in P){ const [x,y]=P[k]; const o=k==="O"; b+=`<circle cx="${f(x)}" cy="${f(y)}" r="3" class="pt"/><text x="${f(o?x-12:x+(x-CC[0])/CR*15)}" y="${f(o?y-4:y+(y-CC[1])/CR*15+5)}" class="lb" text-anchor="middle">${k}</text>`; }
  for(const [t,V0,A,B] of labs){ const [x,y]=angL(P[V0],P[A],P[B],V0==="O"?20:30); b+=`<text x="${f(x)}" y="${f(y)}" class="nm" text-anchor="middle" font-weight="700">${t}</text>`; }
  return SV(240,182,b); }
function cir1(){ const c=2*R(25,80),pd=R(70,110),pts={A:270-c/2,B:270+c/2,P:pd},segs=[["P","A"],["P","B"],["O","A"],["O","B"]];
  if(Math.random()<.55){ const ans=c/2,f=cfig(pts,segs,[[DEG(c),"O","A","B"],[XI,"P","A","B"]]);
    return {q:J`O は円の中心。∠${V("x")} の大きさは？${f}`,ans:DEG(ans),wrongs:W(DEG(ans),[{v:DEG(c),why:J`円周角は、同じ弧に対する中心角の半分です。`},{v:DEG(2*c),why:J`円周角は中心角の「半分」です。`},{v:DEG(180-ans),why:J`円周角 = 中心角 ÷ 2 を使います。`},{v:DEG(180-c>0?180-c:360-c),why:J`円周角 = 中心角 ÷ 2 を使います。`}]),exp:J`円周角 = 中心角 ÷ 2 → ${c}÷2 = ${ans}`,tf:v=>`∠${V("x")} = ${v}${f}`,kind:"fig"}; }
  const y=c/2,f=cfig(pts,segs,[[XI,"O","A","B"],[DEG(y),"P","A","B"]]);
  return {q:J`O は円の中心。∠${V("x")}（∠AOB）の大きさは？${f}`,ans:DEG(c),wrongs:W(DEG(c),[{v:DEG(y),why:J`中心角は、円周角の2倍です。`},{v:y%2===0?DEG(y/2):DEG(180-y),why:J`中心角 = 円周角 × 2 です。`},{v:DEG(180-y),why:J`中心角 = 円周角 × 2 です。`},{v:DEG(360-c),why:J`それは反対側の角です。`}]),exp:J`中心角 = 円周角 × 2 → ${y}×2 = ${c}`,tf:v=>`∠${V("x")} = ${v}${f}`,kind:"fig"}; }
function cir2(){ const a=5*R(5,13),pts={A:180,B:0,P:2*a},segs=[["A","B"],["P","A"],["P","B"]];
  if(Math.random()<.75){ const ans=90-a,f=cfig(pts,segs,[[DEG(a),"A","P","B"],[XI,"B","P","A"]]);
    return {q:J`AB は円 O の直径。∠${V("x")} の大きさは？${f}`,ans:DEG(ans),wrongs:W(DEG(ans),[{v:DEG(180-a),why:J`直径に対する円周角 ∠APB = 90° も使います。`},{v:DEG(a),why:J`∠APB = 90° なので、残りの2つの角の和が 90°。`},{v:DEG(90+a),why:J`三角形の内角の和は 180°、∠APB = 90°。`},{v:DEG(2*a),why:J`∠APB = 90° を使います。`}]),exp:J`直径に対する円周角 ∠APB = 90° → 180 ${M} 90 ${M} ${a} = ${ans}`,tf:v=>`∠${V("x")} = ${v}${f}`,kind:"fig"}; }
  const f=cfig(pts,segs,[[XI,"P","A","B"]]);
  return {q:J`AB は円 O の直径。∠${V("x")}（∠APB）の大きさは？${f}`,ans:"90°",wrongs:[{v:"180°",why:J`180° は直径（半円の弧）に対する中心角です。円周角はその半分。`},{v:"60°",why:J`直径に対する円周角は、いつも 90° です。`},{v:"45°",why:J`直径に対する円周角は、いつも 90° です。`}],exp:J`直径に対する円周角は 90°（中心角 180° の半分）`,tf:v=>`∠${V("x")} = ${v}${f}`,kind:"fig"}; }
function cir3(){ const a=5*R(5,15),pts={A:270-a,B:270+a,P:R(115,140),Q:R(45,70)},segs=[["P","A"],["P","B"],["Q","A"],["Q","B"]];
  const f=cfig(pts,segs,[[DEG(a),"P","A","B"],[XI,"Q","A","B"]]);
  return {q:J`∠${V("x")}（∠AQB）の大きさは？${f}`,ans:DEG(a),wrongs:W(DEG(a),[{v:DEG(2*a),why:J`同じ弧 AB に対する円周角は、すべて等しくなります。`},{v:DEG(180-a),why:J`同じ弧に対する円周角は等しい、を使います。`},{v:a%2===0?DEG(a/2):DEG(90-a>0?90-a:a+10),why:J`同じ弧に対する円周角は等しくなります。`}]),exp:J`弧 AB に対する円周角は等しい → ∠AQB = ∠APB = ${a}°`,tf:v=>`∠${V("x")} = ${v}${f}`,kind:"fig"}; }

/* ---------- B(3) 三平方の定理 ---------- */
function rtFig(la,lb,lc){ return SV(260,150,`<polygon points="40,25 40,128 228,128" class="f1"/><path d="M40 114 H54 V128" class="ax" fill="none"/><text x="30" y="20" class="lb">A</text><text x="24" y="142" class="lb">C</text><text x="232" y="142" class="lb">B</text>
  <text x="30" y="82" class="lb" text-anchor="end">${la}</text><text x="134" y="146" class="lb" text-anchor="middle">${lb}</text><text x="142" y="68" class="lb" text-anchor="middle">${lc}</text>`); }
function py1(){ let a,b; if(Math.random()<.35){ [a,b]=pick([[3,4],[6,8],[5,12],[8,15],[9,12]]); } else { a=R(1,8); b=R(2,9); if(a===b&&Math.random()<.5) return py1(); }
  const n=a*a+b*b,ans=SS(n),f=rtFig(a,b,XI);
  return {q:J`∠C = 90° の直角三角形。${V("x")}（斜辺）の長さは？${f}`,ans,wrongs:W(ans,[{v:num(a+b),why:J`たし算ではなく、${V("x")}² = ${a}² + ${b}² を使います。`},{v:a!==b?SS(Math.abs(a*a-b*b)):null,why:J`斜辺はいちばん長い辺です。2乗をたします。`},{v:num(n),why:J`${V("x")}² = ${n}。最後に √ をとります。`},{v:SS(2*n),why:J`${V("x")}² = ${a}² + ${b}² を確かめよう。`}]),exp:`${V("x")}² = ${a}² + ${b}² = ${n} → ${V("x")} = ${RT(n)}${simp(n)[0]>1||Number.isInteger(Math.sqrt(n))?` = ${ans}`:""}`,tf:v=>`${V("x")} = ${v}${f}`,kind:"fig"}; }
function py2(){ const c=R(4,12),a=R(2,c-1),n=c*c-a*a,ans=SS(n),f=rtFig(a,XI,c);
  return {q:J`∠C = 90° の直角三角形。${V("x")} の長さは？${f}`,ans,wrongs:W(ans,[{v:SS(c*c+a*a),why:J`斜辺は ${c} です。${V("x")}² = ${c}² ${M} ${a}²。`},{v:num(c-a),why:J`ひき算ではなく、${V("x")}² = ${c}² ${M} ${a}² を使います。`},{v:num(n),why:J`${V("x")}² = ${n}。最後に √ をとります。`},{v:SS(n+2),why:J`2乗の計算を確かめよう。`}]),exp:`${V("x")}² = ${c}² ${M} ${a}² = ${n} → ${V("x")} = ${ans}`,tf:v=>`${V("x")} = ${v}${f}`,kind:"fig"}; }
function py3(){ const k=R(2,8),t=pick(["45h","45l","30h","30l","30s"]); const T45=J`直角二等辺三角形（45°・45°・90°）`,T30=J`30°・60°・90° の直角三角形`;
  const C={"45h":[J`${T45}で、等しい2辺が ${k}cm のとき、斜辺は？`,SR(k,2),[[SR(k,3),J`直角二等辺三角形の辺の比は 1 : 1 : √2 です。`],[num(2*k),J`2倍になるのは 30°・60°・90° の斜辺です。`],[num(k),J`斜辺は、いちばん長い辺です。`]],"1 : 1 : √2"],
   "45l":[J`${T45}で、斜辺が ${2*k}cm のとき、等しい2辺の長さは？`,SR(k,2),[[num(k),J`斜辺 : 辺 = √2 : 1 です。`],[SR(2*k,2),J`それは斜辺より長くなってしまいます。`],[SR(k,3),J`辺の比は 1 : 1 : √2 です。`]],J`辺 = ${2*k}÷√2 = ${SR(k,2)}`],
   "30h":[J`${T30}で、いちばん短い辺が ${k}cm のとき、斜辺は？`,num(2*k),[[SR(k,3),J`それは残りの辺（60° の角と向かい合わない辺）です。`],[SR(k,2),J`√2 は直角二等辺三角形の比です。`],[num(3*k),J`辺の比は 1 : 2 : √3 です。`]],J`1 : 2 : √3（斜辺は短い辺の2倍）`],
   "30l":[J`${T30}で、いちばん短い辺が ${k}cm のとき、残りの辺（斜辺でない方）は？`,SR(k,3),[[num(2*k),J`それは斜辺です。`],[SR(k,2),J`√2 は直角二等辺三角形の比です。`],[SR(2*k,3),J`辺の比は 1 : 2 : √3 です。`]],"1 : 2 : √3"],
   "30s":[J`${T30}で、斜辺が ${2*k}cm のとき、いちばん短い辺は？`,num(k),[[SR(k,3),J`それは残りの辺です。いちばん短い辺は斜辺の半分。`],[num(4*k),J`短い辺は斜辺より短くなります。`],[SR(k,2),J`辺の比は 1 : 2 : √3 です。`]],J`短い辺 = 斜辺 ÷ 2`]};
  const [q,ans,ws,ex]=C[t]; return {q,ans,wrongs:ws.map(([v,why])=>({v,why})),exp:ex,tf:v=>JA()?`${q.replace(/は？$/,J`は `)}${v}`:`${q}<br>→ ${v}`,kind:"word"}; }
function py4(){ const x1=R(-5,5),y1=R(-5,5),x2=R(-5,5),y2=R(-5,5),dx=x2-x1,dy=y2-y1; if(!dx||!dy||Math.abs(dx)+Math.abs(dy)<3) return py4();
  const n=dx*dx+dy*dy,ans=SS(n),f=coord({pts:[[x1,y1,"A"],[x2,y2,"B"]]});
  return {q:J`2点 A${PAIR(x1,y1)}、B${PAIR(x2,y2)} の距離は？${f}`,ans,wrongs:W(ans,[{v:num(Math.abs(dx)+Math.abs(dy)),why:J`横と縦の長さをたすのではなく、三平方の定理を使います。`},{v:num(n),why:J`AB² = ${n}。最後に √ をとります。`},{v:Math.abs(dx)!==Math.abs(dy)?SS(Math.abs(dx*dx-dy*dy)):null,why:J`2乗を「たし」ます。`},{v:SS(n+2),why:J`横と縦の長さを確かめよう。`}]),exp:J`横 ${Math.abs(dx)}、縦 ${Math.abs(dy)} → AB² = ${dx*dx} + ${dy*dy} = ${n} → AB = ${ans}`,tf:v=>`AB = ${v}${f}`,kind:"fig"}; }
function py5(){ if(Math.random()<.25){ const a=R(2,8),ans=SR(a,3); return {q:J`1辺 ${a}cm の立方体の対角線の長さは？`,ans,wrongs:W(ans,[{v:SR(a,2),why:J`それは面の対角線です。`},{v:num(3*a),why:J`3辺をたすのではなく、2乗の和の √ です。`},{v:num(3*a*a),why:J`最後に √ をとります。`}]),exp:`√(${a}² + ${a}² + ${a}²) = ${RT(3*a*a)} = ${ans}`,tf:v=>J`1辺 ${a}cm の立方体の対角線は ${v}`,kind:"word"}; }
  const a=R(2,8),b=R(2,8),c=R(2,9); if(a===b&&b===c) return py5(); const n=a*a+b*b+c*c,ans=SS(n),q=J`縦 ${a}cm、横 ${b}cm、高さ ${c}cm の直方体の対角線の長さは？`;
  return {q,ans,wrongs:W(ans,[{v:SS(a*a+b*b),why:J`それは底面の対角線です。高さも使います。`},{v:num(a+b+c),why:J`3辺をたすのではなく、2乗の和の √ です。`},{v:num(n),why:J`最後に √ をとります。`}]),exp:`√(${a}² + ${b}² + ${c}²) = ${RT(n)}${simp(n)[0]>1||Number.isInteger(Math.sqrt(n))?` = ${ans}`:""}`,tf:v=>JA()?`${q.replace(J`長さは？`,J`長さは `)}${v}`:`${q}<br>→ ${v}`,kind:"word"}; }

/* ---------- C(1) 関数 y=ax² ---------- */
const QF=(p,q)=>`${V("y")} = ${coef(p,q)}${V("x²")}`;
const QA=[[1,1],[2,1],[3,1],[-1,1],[-2,1],[-3,1],[1,2],[-1,2],[1,3],[-1,3]];
function qf1(){ const [n,d]=pick(QA),p=d*NZ(-3,3)*(d>1?1:1); const pp=d>1?d*pick([1,2,-1,-2]):NZ(-4,4); const q=n*pp*pp/d; if(!Number.isInteger(q)) return qf1();
  const pre=J`${V("y")} は ${V("x")} の2乗に比例し、${V("x")} = ${num(pp)} のとき ${V("y")} = ${num(q)}。`,ans=frc(n,d);
  return {q:J`${pre}比例定数は？`,ans,wrongs:W(ans,[{v:frc(q,pp),why:J`${V("y")} = ${V("a")}${V("x²")} なので、${V("x")} を2乗して代入します。`},{v:frc(pp*pp,q),why:J`${V("a")} = ${V("y")} ÷ ${V("x")}² です（逆にわっています）。`},{v:frc(-n,d),why:J`符号を確かめよう。2乗すると正になります。`},{v:frc(q,2*pp),why:J`${V("x")}² は 2${V("x")} ではありません。`}]),exp:`${num(q)} = ${V("a")}×${par(pp)}² → ${V("a")} = ${num(q)}÷${pp*pp} = ${ans}`,tf:v=>J`${pre}比例定数は ${v}`,kind:"word"}; }
function qf2(){ const [n,d]=pick(QA),p=d>1?d*pick([1,2,-1,-2]):NZ(-5,5),ans=n*p*p/d,f=QF(n,d);
  return {q:J`${f} で、${V("x")} = ${num(p)} のときの ${V("y")} の値は？`,ans:num(ans),wrongs:W(ans,[{v:Number.isInteger(n*2*p/d)?n*2*p/d:null,why:J`${V("x")}² は 2${V("x")} ではありません。`},{v:-ans,why:p<0?J`${par(p)}² は正の数です。`:J`符号を確かめよう。`},{v:Number.isInteger(n*n*p*p/(d*d))&&n*n!==n*d?n*n*p*p/(d*d):null,why:J`2乗するのは ${V("x")} だけです。`}],ans),exp:`${coef(n,d)}×${par(p)}² = ${num(ans)}`,tf:v=>J`${f} で ${V("x")} = ${num(p)} のとき ${V("y")} = ${v}`,kind:"word"}; }
function qf3(){ const a=NZ(-3,3),p=R(-4,3),q=p+R(1,4); const f=QF(a,1),ans=a*(p+q),pre=J`${f} で、${V("x")} が ${num(p)} から ${num(q)} まで増加するとき、`;
  return {q:J`${pre}変化の割合は？`,ans:num(ans),wrongs:W(ans,[{v:a*(q*q-p*p),why:J`それは ${V("y")} の増加量です。÷（${V("x")} の増加量）をします。`},{v:a,why:J`${V("y")} = ${V("a")}${V("x²")} の変化の割合は一定ではありません。`},{v:a*(q-p),why:J`(${V("y")} の増加量) ÷ (${V("x")} の増加量) で求めます。`},{v:-ans,why:J`符号を確かめよう。`}],ans),exp:J`${V("y")} の増加量 ${num(a*q*q)} ${M} ${par(a*p*p)} = ${num(a*(q*q-p*p))}、${V("x")} の増加量 ${q-p} → ${num(ans)}`,tf:v=>J`${pre}変化の割合は ${v}`,kind:"word"}; }
function qf4(){ const a=NZ(-3,3),p=R(-4,2),q=R(p+1,4); const f=QF(a,1),yp=a*p*p,yq=a*q*q; let lo,hi; if(p<=0&&q>=0){ const m=a*Math.max(p*p,q*q); lo=Math.min(0,m); hi=Math.max(0,m); } else { lo=Math.min(yp,yq); hi=Math.max(yp,yq); }
  const RG=(l,h)=>`${num(l)} ≦ ${V("y")} ≦ ${num(h)}`,ans=RG(lo,hi),pre=J`${f} で、${V("x")} の変域が ${num(p)} ≦ ${V("x")} ≦ ${num(q)} のとき、`;
  return {q:J`${pre}${V("y")} の変域は？`,ans,wrongs:W(ans,[{v:RG(Math.min(yp,yq),Math.max(yp,yq)),why:p<0&&q>0?J`${V("x")} = 0 のとき ${V("y")} = 0 になります。グラフをかいて確かめよう。`:J`グラフをかいて確かめよう。`},{v:yp<=yq?null:RG(yp,yq),why:J`小さい方を左に書きます。`},{v:RG(Math.min(a*p,a*q),Math.max(a*p,a*q)),why:J`${V("x")} を2乗するのを忘れています。`},{v:RG(-hi,-lo),why:J`${V("a")} の符号から、グラフが上に開くか下に開くかを考えよう。`},{v:RG(lo,hi+Math.abs(a)),why:J`端の値を代入して確かめよう。`}]),exp:J`${V("x")} = ${num(p)} のとき ${num(yp)}、${V("x")} = ${num(q)} のとき ${num(yq)}${p<=0&&q>=0?J`、${V("x")} = 0 のとき 0`:""} → ${ans}`,tf:v=>J`${pre}${V("y")} の変域は ${v}`,kind:"word"}; }
const qfB=bank([
 [J`${V("y")} = ${V("a")}${V("x²")} のグラフについて正しいのは？`,J`原点を通り、y 軸について対称`,[[J`x 軸について対称`,J`対称の軸は y 軸です。`],[J`原点を通らない`,J`x = 0 のとき y = 0 なので、原点を通ります。`],[J`直線になる`,J`放物線になります。`]],J`y = ax² のグラフは原点を頂点とする放物線、y 軸について対称`],
 [J`${V("a")} > 0 のとき、${V("y")} = ${V("a")}${V("x²")} のグラフは？`,J`上に開いた形`,[[J`下に開いた形`,J`a < 0 のときです。`],[J`右上がりの直線`,J`それは一次関数（傾きが正）のグラフです。`],[J`双曲線`,J`それは反比例のグラフです。`]],J`a > 0 → 上に開く、a < 0 → 下に開く`],
 [J`${V("y")} = ${V("a")}${V("x²")} で、${V("a")} の絶対値が大きいほど、グラフは？`,J`開き方が小さい（細くなる）`,[[J`開き方が大きい（太くなる）`,J`絶対値が大きいほど細くなります。`],[J`上に動く`,J`頂点はいつも原点です。`],[J`変わらない`,J`a によって開き方が変わります。`]],J`|a| が大きい → 細い`],
 [J`${V("y")} = 2${V("x²")} のグラフと x 軸について対称なグラフの式は？`,`${V("y")} = ${M}2${V("x²")}`,[[`${V("y")} = 2${V("x")}`,J`一次関数ではありません。`],[`${V("y")} = ${fr(1,2)}${V("x²")}`,J`それは開き方がちがうグラフです。`],[`${V("y")} = 2${V("x²")} + 1`,J`x 軸について対称 → 係数の符号が変わります。`]],J`x 軸について対称 → y = −ax²`],
 [J`${V("y")} = 3${V("x²")} で、${V("x")} < 0 の範囲では、${V("x")} が増加すると ${V("y")} は？`,J`減少する`,[[J`増加する`,J`x > 0 の範囲では増加します。`],[J`変わらない`,J`グラフをかいて確かめよう。`],[J`いつも 0`,J`y = 0 になるのは x = 0 のときだけです。`]],J`a > 0 のとき：x < 0 で減少、x > 0 で増加`],
 [J`${V("y")} = ${M}${V("x²")} の ${V("y")} の値として、あてはまらないものは？`,"1",[["0",J`x = 0 のとき y = 0 です。`],[`${M}4`,J`x = ±2 のとき y = −4 です。`],[`${M}9`,J`x = ±3 のとき y = −9 です。`]],J`a < 0 なので y ≦ 0（正の値はとらない）`],
]);

/* ---------- D(1) 標本調査 ---------- */
const ZEN=[[J`国勢調査`,J`日本に住むすべての人を調べる全数調査です。`],[J`学校の健康診断`,J`全員の健康を確かめるので全数調査です。`],[J`高校の入学試験`,J`受験者全員を調べる全数調査です。`],[J`クラスの出欠確認`,J`全員を確かめる全数調査です。`],[J`飛行機に乗る前の手荷物検査`,J`安全のため全員を調べる全数調査です。`]];
const HYO=[[J`電球の寿命の検査`,J`全部調べると製品がなくなってしまうので標本調査です。`],[J`テレビの視聴率調査`,J`全世帯を調べるのは大変なので標本調査です。`],[J`缶詰の品質検査`,J`開けると売れなくなるので標本調査です。`],[J`新聞社の世論調査`,J`一部の人に聞いて全体を推定する標本調査です。`],[J`川の水質調査`,J`川の水全部は調べられないので標本調査です。`]];
function sv1(){ const h=Math.random()<.5,[A,B]=h?[HYO,ZEN]:[ZEN,HYO]; const a=pick(A),bs=shuffle(B).slice(0,3),kd=h?J`標本調査`:J`全数調査`;
  return {q:J`${kd}が適しているのは？`,ans:a[0],wrongs:bs.map(([v,why])=>({v,why})),exp:J`${a[0]}：${a[1]}`,tf:v=>J`${kd}が適しているのは ${v}`,kind:"word"}; }
function sv2(){ if(Math.random()<.5){ const k=pick([20,30,50,100]),m=R(2,6),r=R(3,12),n=m*(1+r),ans=k*r;
    const q=J`袋の中に白い玉がたくさん入っている。黒い玉 ${k} 個を入れてよく混ぜ、${n} 個取り出したら黒い玉が ${m} 個だった。白い玉はおよそ何個？`;
    return {q,ans:J`およそ ${ans} 個`,wrongs:W(J`およそ ${ans} 個`,[{v:J`およそ ${k*(1+r)} 個`,why:J`それは黒い玉もふくめた全体の数です。`},{v:J`およそ ${k*m*r} 個`,why:J`黒 : 白 = ${m} : ${n-m} = ${k} : ${V("x")} の比を使います。`},{v:J`およそ ${k+n-m} 個`,why:J`たし算ではなく比で考えます。`},{v:J`およそ ${n-m} 個`,why:J`それは取り出した中の白い玉の数です。`}]),exp:J`取り出した中は 黒 ${m} : 白 ${n-m} → ${m} : ${n-m} = ${k} : ${V("x")} → ${V("x")} = ${ans}`,tf:v=>JA()?J`${q.replace(J`およそ何個？`,"")}→ 白い玉は ${v}`:`${q}<br>→ ${v}`,kind:"word"}; }
  const T=pick([1000,2000,5000,10000]),n=pick([50,100,200]),m=R(1,8),ans=T*m/n; const q=J`ある工場で作った製品 ${T} 個から ${n} 個を無作為に取り出したら、不良品が ${m} 個あった。全体の不良品はおよそ何個？`;
  return {q,ans:J`およそ ${ans} 個`,wrongs:W(J`およそ ${ans} 個`,[{v:J`およそ ${T-ans} 個`,why:J`それは不良品でない製品の数です。`},{v:J`およそ ${m} 個`,why:J`それは標本の中の不良品の数です。全体を推定します。`},{v:J`およそ ${ans*10} 個`,why:J`${m}/${n} の割合を全体 ${T} 個にかけます。`},{v:J`およそ ${Math.round(ans/2)} 個`,why:J`${m}/${n} の割合を全体 ${T} 個にかけます。`}]),exp:`${T}×${fr(m,n)} = ${ans}`,tf:v=>JA()?`${q.replace(J`およそ何個？`,"")}→ ${v}`:`${q}<br>→ ${v}`,kind:"word"}; }
const svB=bank([
 [J`標本調査で、調べたい集団全体のことを何という？`,J`母集団`,[[J`標本`,J`標本は、母集団から取り出した一部です。`],[J`標本の大きさ`,J`標本の大きさは、取り出したデータの個数です。`],[J`全数調査`,J`全数調査は、集団全体をすべて調べる方法です。`]],J`調べたい集団全体 = 母集団`],
 [J`母集団から取り出した一部を何という？`,J`標本`,[[J`母集団`,J`母集団は、調べたい集団全体です。`],[J`度数`,J`度数は、階級に入るデータの個数です。`],[J`全数調査`,J`全数調査は、すべてを調べる方法です。`]],J`取り出した一部 = 標本`],
 [J`中学生 300 人から 40 人を選んで調べた。標本の大きさは？`,"40",[["300",J`それは母集団の大きさです。`],["260",J`それは選ばれなかった人数です。`],["340",J`たし算はしません。`]],J`標本の大きさ = 取り出したデータの個数`],
 [J`標本を選ぶとき、かたよりがないようにする方法は？`,J`無作為に抽出する（くじ・乱数など）`,[[J`自分の好きな人を選ぶ`,J`かたよりが出ます。`],[J`同じクラスの人だけを選ぶ`,J`かたよりが出ます。`],[J`先着順に選ぶ`,J`早く来る人にかたよるかもしれません。`]],J`無作為に抽出 → 母集団の性質を推定できる`],
 [J`標本調査の結果について正しいのは？`,J`母集団の性質を推定できるが、誤差がある`,[[J`母集団の値と必ず同じになる`,J`一部を調べるので誤差があります。`],[J`標本が小さいほど正確になる`,J`標本が大きいほど、推定は正確になりやすいです。`],[J`母集団のことは何も分からない`,J`無作為に選べば、母集団の性質を推定できます。`]],J`標本調査 → 推定（誤差あり）`],
]);

/* ========== 単元（学習指導要領 数学 第1〜3学年 A 数と式・B 図形・C 関数・D データの活用） ========== */
const units=[
 {id:"int",s:"math",g:"A1",n:{ja:"正の数・負の数","en":"Positive & negative numbers","zh-Hant":"正數・負數"},gr:"1",k:"math",ref:J`(1) 正の数・負の数`,
  parts:[1,2,3,4,5],pn:{1:J`2数の加法・減法`,2:J`3数以上の加法・減法`,3:J`乗法・除法`,4:J`累乗`,5:J`四則の混じった計算`},sk:{1:[addsub],2:[addsub3],3:[muldiv],4:[power],5:[mixed]}},
 {id:"expr",s:"math",g:"A1",n:{ja:"文字の式","en":"Expressions with letters","zh-Hant":"文字式"},gr:"1",k:"math",ref:J`(2) 文字を用いた式`,
  parts:[1,2,3,4,5],pn:{1:J`文字式の表し方`,2:J`式の値（代入）`,3:J`同類項をまとめる`,4:J`1次式と数の乗法・除法`,5:J`かっこを外して加減`},sk:{1:[notation],2:[substitute],3:[like],4:[distrib],5:[bracket]}},
 {id:"leq",s:"math",g:"A1",n:{ja:"1次方程式","en":"Linear equations","zh-Hant":"一元一次方程式"},gr:"1",k:"math",ref:J`(3) 一元一次方程式`,
  parts:[1,2,3,4,5],pn:{1:J`x+a=b・ax=b`,2:"ax+b=c",3:J`両辺に x がある`,4:J`かっこを含む`,5:J`比例式`},sk:{1:[eq1],2:[eq2],3:[eq3],4:[eq4],5:[ratio]}},
 {id:"plane",s:"math",g:"B1",n:{ja:"平面図形","en":"Plane figures","zh-Hant":"平面圖形"},gr:"1",k:"math",ref:J`B(1) 平面図形`,
  parts:[1,2,3],pn:{1:J`図形の移動`,2:J`作図の性質`,3:J`用語と記号`},sk:{1:[moveFig],2:[construct],3:[symbols]}},
 {id:"solid",s:"math",g:"B1",n:{ja:"空間図形","en":"Solid figures","zh-Hant":"空間圖形"},gr:"1",k:"math",ref:J`B(2) 空間図形`,
  parts:[1,2,3,4,5],pn:{1:J`おうぎ形の弧`,2:J`おうぎ形の面積`,3:J`立体の体積`,4:J`立体の表面積`,5:J`辺の位置関係`},sk:{1:[arc],2:[sector],3:[volume],4:[surface],5:[position]}},
 {id:"prop",s:"math",g:"C1",n:{ja:"比例と反比例","en":"Proportion & inverse proportion","zh-Hant":"正比與反比"},gr:"1",k:"math",ref:J`C(1) 比例、反比例`,
  parts:[1,2,3,4,5],pn:{1:J`比例の式`,2:J`反比例の式`,3:J`座標`,4:J`グラフと式`,5:J`比例か反比例か`},sk:{1:[propEq],2:[invEq],3:[coordRead],4:[graphEq],5:[whichRel]}},
 {id:"data",s:"math",g:"D1",n:{ja:"データの活用","en":"Using data","zh-Hant":"資料的運用"},gr:"1",k:"math",ref:J`D(1) データの分布・(2) 不確定な事象の起こりやすさ`,
  parts:[1,2,3,4,5],pn:{1:J`度数分布表`,2:J`ヒストグラム`,3:J`相対度数`,4:J`累積度数`,5:J`確率（多数回の試行）`},sk:{1:[freq],2:[histRead],3:[relFreq],4:[cumFreq],5:[probTrial]}},
 {id:"calc2",s:"math",g:"A2",n:{ja:"式の計算","en":"Algebraic expressions","zh-Hant":"式的運算"},gr:"2",k:"math",ref:J`2年 A(1) 文字を用いた式`,
  parts:[1,2,3,4,5],pn:{1:J`多項式の加法・減法`,2:J`多項式と数の乗除`,3:J`単項式の乗除`,4:J`式の値`,5:J`等式の変形`},sk:{1:[polyAdd],2:[polyNum],3:[monoMD],4:[sub2],5:[trans]}},
 {id:"sys",s:"math",g:"A2",n:{ja:"連立方程式","en":"Simultaneous equations","zh-Hant":"聯立方程式"},gr:"2",k:"math",ref:J`2年 A(2) 連立二元一次方程式`,
  parts:[1,2,3],pn:{1:J`加減法`,2:J`係数をそろえる`,3:J`代入法`},sk:{1:[sys1],2:[sys2],3:[sys3]}},
 {id:"cong",s:"math",g:"B2",n:{ja:"平行と合同","en":"Parallel lines & congruence","zh-Hant":"平行與全等"},gr:"2",k:"math",ref:J`2年 B(1) 基本的な平面図形の性質・B(2) 図形の合同`,
  parts:[1,2,3,4,5],pn:{1:J`平行線と角`,2:J`三角形の内角・外角`,3:J`多角形の角`,4:J`合同条件`,5:J`証明のことば`},sk:{1:[angPar],2:[triAng],3:[polyAng],4:[congB],5:[proofB]}},
 {id:"quad",s:"math",g:"B2",n:{ja:"三角形と四角形","en":"Triangles & quadrilaterals","zh-Hant":"三角形與四邊形"},gr:"2",k:"math",ref:J`2年 B(2) 図形の合同（三角形・平行四辺形）`,
  parts:[1,2,3,4],pn:{1:J`二等辺三角形`,2:J`平行四辺形の性質`,3:J`平行四辺形になる条件`,4:J`特別な四角形・面積`},sk:{1:[isoAng],2:[paraAng],3:[paraCond],4:[quadB]}},
 {id:"linf",s:"math",g:"C2",n:{ja:"一次関数","en":"Linear functions","zh-Hant":"一次函數"},gr:"2",k:"math",ref:J`2年 C(1) 一次関数`,
  parts:[1,2,3,4,5],pn:{1:J`変化の割合`,2:J`傾きと切片`,3:J`グラフから式`,4:J`直線の式を求める`,5:J`2直線の交点`},sk:{1:[lf1],2:[lf2],3:[lf3],4:[lf4],5:[lf5]}},
 {id:"data2",s:"math",g:"D2",n:{ja:"箱ひげ図と確率","en":"Box plots & probability","zh-Hant":"盒狀圖與機率"},gr:"2",k:"math",ref:J`2年 D(1) データの分布・D(2) 不確定な事象の起こりやすさ`,
  parts:[1,2,3,4,5],pn:{1:J`四分位数`,2:J`四分位範囲`,3:J`箱ひげ図`,4:J`確率（さいころ）`,5:J`確率（硬貨・玉）`},sk:{1:[quart],2:[iqr],3:[boxRead],4:[dice],5:[coin]}},
 {id:"sqrt",s:"math",g:"A3",n:{ja:"平方根","en":"Square roots","zh-Hant":"平方根"},gr:"3",k:"math",ref:J`3年 A(1) 正の数の平方根`,
  parts:[1,2,3,4,5],pn:{1:J`平方根の意味`,2:J`根号のついた数の乗除`,3:J`根号のついた数の加減`,4:J`分母の有理化`,5:J`大小と近似`},sk:{1:[sq1],2:[sq2],3:[sq3],4:[sq4],5:[sq5]}},
 {id:"fact",s:"math",g:"A3",n:{ja:"展開と因数分解","en":"Expanding & factoring","zh-Hant":"展開與因式分解"},gr:"3",k:"math",ref:J`3年 A(2) 簡単な多項式`,
  parts:[1,2,3,4,5],pn:{1:J`式の展開`,2:J`乗法公式`,3:J`共通因数`,4:J`因数分解（和と積）`,5:J`因数分解（公式）`},sk:{1:[ex1],2:[ex2],3:[ex3],4:[ex4],5:[ex5]}},
 {id:"qeq",s:"math",g:"A3",n:{ja:"2次方程式","en":"Quadratic equations","zh-Hant":"一元二次方程式"},gr:"3",k:"math",ref:J`3年 A(3) 二次方程式`,
  parts:[1,2,3,4],pn:{1:J`平方根の考えで解く`,2:J`因数分解で解く`,3:J`解の公式`,4:J`解と係数`},sk:{1:[qe1],2:[qe2],3:[qe3],4:[qe4]}},
 {id:"sim",s:"math",g:"B3",n:{ja:"相似な図形","en":"Similar figures","zh-Hant":"相似形"},gr:"3",k:"math",ref:J`3年 B(1) 図形の相似`,
  parts:[1,2,3,4,5],pn:{1:J`相似比`,2:J`相似条件`,3:J`平行線と線分の比`,4:J`中点連結定理`,5:J`面積比・体積比`},sk:{1:[sim1],2:[simB],3:[sim3],4:[sim4],5:[sim5]}},
 {id:"circ",s:"math",g:"B3",n:{ja:"円周角","en":"Inscribed angles","zh-Hant":"圓周角"},gr:"3",k:"math",ref:J`3年 B(2) 円周角と中心角`,
  parts:[1,2,3],pn:{1:J`円周角と中心角`,2:J`直径と円周角`,3:J`同じ弧の円周角`},sk:{1:[cir1],2:[cir2],3:[cir3]}},
 {id:"pyth",s:"math",g:"B3",n:{ja:"三平方の定理","en":"Pythagorean theorem","zh-Hant":"畢氏定理"},gr:"3",k:"math",ref:J`3年 B(3) 三平方の定理`,
  parts:[1,2,3,4,5],pn:{1:J`斜辺を求める`,2:J`ほかの辺を求める`,3:J`特別な直角三角形`,4:J`2点間の距離`,5:J`直方体の対角線`},sk:{1:[py1],2:[py2],3:[py3],4:[py4],5:[py5]}},
 {id:"sqf",s:"math",g:"C3",n:{ja:"関数 y=ax²","en":"Functions y = ax²","zh-Hant":"函數 y=ax²"},gr:"3",k:"math",ref:J`3年 C(1) 関数 y=ax²`,
  parts:[1,2,3,4,5],pn:{1:J`比例定数を求める`,2:J`y の値`,3:J`変化の割合`,4:J`変域`,5:J`グラフの性質`},sk:{1:[qf1],2:[qf2],3:[qf3],4:[qf4],5:[qfB]}},
 {id:"samp",s:"math",g:"D3",n:{ja:"標本調査","en":"Sampling","zh-Hant":"抽樣調查"},gr:"3",k:"math",ref:J`3年 D(1) 標本調査`,
  parts:[1,2,3],pn:{1:J`全数調査と標本調査`,2:J`母集団の推定`,3:J`標本調査のことば`},sk:{1:[sv1],2:[sv2],3:[svB]}},
];
// 問題を作る（変な選択肢や答えが出ないよう、作り直しつき）
function make(fn){ for(let i=0;i<20;i++){ try{ const g=fn(); if(g&&g.wrongs.length>=3&&!g.wrongs.some(w=>w.v===g.ans)) return g; }catch(e){} } return fn(); }
return {units,make};
})();
