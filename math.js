/* 45 Study 数学：問題をその場で作る（数字は毎回かわる）。
   まちがいの選択肢は「よくあるミス」から作るので、選んだ答えごとに理由を出せる。
   単元の並び：中学校学習指導要領（平成29年告示）数学 第1学年 A 数と式 (1)正の数・負の数 (2)文字を用いた式 (3)一元一次方程式
   gen() が返すもの：{ q:問題, ans:答え, wrongs:[{v,why}], exp:解き方, tf:v=>○×の文 }（どれもHTML） */
const MATH=(()=>{
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
  for(const w of list){ if(w==null||w.v==null) continue; const k=String(w.v); if(seen.has(k)) continue; if(typeof w.v==="number"&&!Number.isInteger(w.v)) continue; seen.add(k); out.push({v:typeof w.v==="number"?num(w.v):w.v,why:w.why}); }
  if(typeof near==="number"){ for(const d of [1,-1,2,-2,3,-3,5,-5,10,-10]){ if(out.length>=3) break; const v=near+d; if(seen.has(String(v))) continue; seen.add(String(v)); out.push({v:num(v),why:"計算ミスです。下の解き方で確かめよう。"}); } }
  return out; }
const Q=(q,ans,wrongs,exp,tf,kind)=>({q,ans:typeof ans==="number"?num(ans):ans,wrongs,exp,tf:tf||(v=>`${q} = ${v}`),kind:kind||"calc"});

/* ========== 正の数・負の数 ========== */
// 2数の加法・減法
function addsub(){ const a=NZ(-12,12),b=NZ(-12,12),op=pick(["+",M]); const y=op==="+"?b:-b, ans=a+y;
  const q=`${num(a)} ${op} ${par(b)}`; const L=[];
  if(op===M&&b<0) L.push({v:a+b,why:`${M}(${num(b)}) は +${-b} になります。ひく数の符号を変えてたし算にしよう。`});
  if(op===M&&b>0) L.push({v:a+b,why:`ひき算をたし算にしてしまっています。${M}${b} はそのまま ${M}${b}。`});
  if(Math.sign(a)!==Math.sign(y)) L.push({v:Math.sign(Math.abs(a)>=Math.abs(y)?a:y)*(Math.abs(a)+Math.abs(y)),why:"符号がちがう2数の和は、絶対値の「差」に、絶対値の大きい方の符号をつけます。"});
  else L.push({v:Math.sign(a)*Math.abs(Math.abs(a)-Math.abs(y)),why:"同じ符号の2数の和は、絶対値の「和」に、共通の符号をつけます。"});
  L.push({v:-ans,why:"答えの符号がちがいます。絶対値の大きい方の符号をつけよう。"});
  const exp=op===M?`${q} = ${num(a)} + ${par(-b)} = ${num(ans)}`:`${q} = ${num(ans)}`;
  return Q(q,ans,W(ans,L,ans),exp); }
// 3数以上の加減
function addsub3(){ const n=[NZ(-9,9),NZ(-9,9),NZ(-9,9)], ops=[pick(["+",M]),pick(["+",M])];
  const ys=[n[0],ops[0]==="+"?n[1]:-n[1],ops[1]==="+"?n[2]:-n[2]]; const ans=ys[0]+ys[1]+ys[2];
  const q=`${num(n[0])} ${ops[0]} ${par(n[1])} ${ops[1]} ${par(n[2])}`;
  const wrongNeg=ys[0]+(ops[0]===M&&n[1]<0?n[1]:ys[1])+(ops[1]===M&&n[2]<0?n[2]:ys[2]);
  const L=[{v:wrongNeg,why:`${M}( 負の数 ) は + になります。たし算だけの式に直してから計算しよう。`},
    {v:ys[0]-ys[1]+ys[2],why:`2つ目の項（${num(ys[1])}）の符号を取りちがえています。`},{v:ys[0]+ys[1]-ys[2],why:`3つ目の項（${num(ys[2])}）の符号を取りちがえています。`},
    {v:-ans,why:"答えの符号がちがいます。正の項の和と負の項の和を別々に出してみよう。"}];
  const exp=`${q} = ${num(ys[0])} + ${par(ys[1])} + ${par(ys[2])} = ${num(ans)}`;
  return Q(q,ans,W(ans,L,ans),exp); }
// 乗法・除法
function muldiv(){ const a=NZ(-9,9),b=NZ(-9,9); if(Math.random()<.5){ const ans=a*b; const q=`${num(a)} × ${par(b)}`;
    return Q(q,ans,W(ans,[{v:-ans,why:ans>0?"負の数×負の数は正になります。":"正の数と負の数の積は負になります（負の数が1個）。"},{v:a+b,why:"かけ算をたし算で計算しています。"},{v:Math.abs(ans)===ans?-(ans):ans+1,why:"符号を確かめよう。"}],ans),`${q} = ${num(ans)}（負の数が${(a<0)+(b<0)}個なので${ans>0?"正":"負"}）`); }
  const c=a*b, ans=a; const q=`${num(c)} ÷ ${par(b)}`;
  return Q(q,ans,W(ans,[{v:-ans,why:ans>0?"負の数÷負の数は正になります。":"正の数と負の数の商は負になります。"},{v:c*b,why:"わり算をかけ算で計算しています。"},{v:c-b,why:"わり算をひき算で計算しています。"}],ans),`${q} = ${num(ans)}`); }
// 累乗
function power(){ const t=pick(["neg2","negOut","pos3","neg3","coef"]); const a=R(2,5); const Wn=(ans,L)=>W(ans,L,ans);
  if(t==="neg2"){ const q=`(${M}${a})<sup>2</sup>`, ans=a*a; return Q(q,ans,Wn(ans,[{v:-ans,why:`(${M}${a})² は (${M}${a})×(${M}${a})。負×負で正になります。`},{v:-2*a,why:`2乗は2をかけるのではなく、同じ数を2回かけます。`},{v:2*a,why:`2乗は ${a}×2 ではなく (${M}${a})×(${M}${a})。`}]),`${q} = (${M}${a})×(${M}${a}) = ${ans}`); }
  if(t==="negOut"){ const q=`${M}${a}<sup>2</sup>`, ans=-a*a; return Q(q,ans,Wn(ans,[{v:a*a,why:`${M}${a}² は ${M}(${a}×${a})。2乗するのは ${a} だけで、${M} はそのまま残ります。`},{v:-2*a,why:"2乗は2をかけるのではなく、同じ数を2回かけます。"},{v:2*a,why:`${M}${a}² は ${M}(${a}×${a})。`}]),`${q} = ${M}(${a}×${a}) = ${num(ans)}`); }
  if(t==="pos3"){ const b=R(2,4), q=`${b}<sup>3</sup>`, ans=b**3; return Q(q,ans,Wn(ans,[{v:b*3,why:`3乗は ${b}×3 ではなく ${b}×${b}×${b}。`},{v:b*b,why:`3回かけます：${b}×${b}×${b}。`},{v:-ans,why:"正の数の累乗は正です。"}]),`${q} = ${b}×${b}×${b} = ${ans}`); }
  if(t==="neg3"){ const b=R(2,3), q=`(${M}${b})<sup>3</sup>`, ans=-(b**3); return Q(q,ans,Wn(ans,[{v:b**3,why:"負の数を3回（奇数回）かけると負になります。"},{v:-3*b,why:`3乗は3をかけるのではなく、同じ数を3回かけます。`},{v:-b*b,why:`3回かけます：(${M}${b})×(${M}${b})×(${M}${b})。`}]),`${q} = (${M}${b})×(${M}${b})×(${M}${b}) = ${num(ans)}`); }
  const k=pick([-3,-2,2,3]), q=`${num(k)} × (${M}${a})<sup>2</sup>`, ans=k*a*a; return Q(q,ans,Wn(ans,[{v:(k*-a)**2,why:"累乗を先に計算してから、かけ算をします。"},{v:-ans,why:`(${M}${a})² は正の数です。符号を確かめよう。`},{v:k*-2*a,why:"2乗は2をかけるのではなく、同じ数を2回かけます。"}]),`${q} = ${num(k)} × ${a*a} = ${num(ans)}`); }
// 四則の混じった計算
function mixed(){ const t=pick(["addmul","submul","subdiv","paren"]); const a=NZ(-9,9),b=NZ(-6,6),c=NZ(-6,6);
  if(t==="addmul"){ const q=`${num(a)} + ${par(b)} × ${par(c)}`, ans=a+b*c; return Q(q,ans,W(ans,[{v:(a+b)*c,why:"かけ算を先に計算します。左から順に計算してはいけません。"},{v:a-b*c,why:`${par(b)}×${par(c)} の符号を確かめよう。`}],ans),`${q} = ${num(a)} + ${par(b*c)} = ${num(ans)}`); }
  if(t==="submul"){ const q=`${num(a)} ${M} ${par(b)} × ${par(c)}`, ans=a-b*c; return Q(q,ans,W(ans,[{v:(a-b)*c,why:"かけ算を先に計算します。"},{v:a+b*c,why:`${M}(${num(b*c)}) の符号に注意。ひく数の符号を変えてたそう。`}],ans),`${q} = ${num(a)} ${M} ${par(b*c)} = ${num(ans)}`); }
  if(t==="subdiv"){ const d=b*c, q=`${num(a)} ${M} ${par(d)} ÷ ${par(c)}`, ans=a-b; return Q(q,ans,W(ans,[{v:Number.isInteger((a-d)/c)?(a-d)/c:null,why:"わり算を先に計算します。"},{v:a+b,why:`${par(d)}÷${par(c)} = ${num(b)}。ひく数の符号に注意。`}],ans),`${q} = ${num(a)} ${M} ${par(b)} = ${num(ans)}`); }
  const q=`(${num(a)} + ${par(b)}) × ${par(c)}`, ans=(a+b)*c; return Q(q,ans,W(ans,[{v:a+b*c,why:"かっこの中を先に計算します。"},{v:-ans,why:"かける数の符号を確かめよう。"}],ans),`${q} = ${par(a+b)} × ${par(c)} = ${num(ans)}`); }

/* ========== 文字を用いた式 ========== */
// 文字式の表し方
function notation(){ const t=pick(["prod","neg1","div","sq","mix"]); const k=R(2,9);
  const mk=(q,ans,L,exp)=>({q,ans,wrongs:W(ans,L),exp,tf:v=>`${q} を文字式で表すと ${v}`,kind:"note"});
  if(t==="prod") return mk(`${V("a")} × ${V("b")} × ${k}`,`${k}${V("ab")}`,[{v:`${V("ab")}${k}`,why:"数は文字の前に書きます。"},{v:`${k}+${V("ab")}`,why:"× をはぶくだけで、+ にはなりません。"},{v:`${V("a")}${k}${V("b")}`,why:"数は文字の前に書きます。"}],"× をはぶき、数は文字の前、文字はアルファベット順");
  if(t==="neg1") return mk(`${V("x")} × (${M}1)`,`${M}${V("x")}`,[{v:`${M}1${V("x")}`,why:"1 は書かずに −x と表します。"},{v:`${V("x")}${M}1`,why:"× (−1) は −x と表します。"},{v:V("x"),why:"−1 をかけるので符号が変わります。"}],"(−1) をかけると −x（1は書かない）");
  if(t==="div") return mk(`${V("a")} ÷ ${k}`,fr(V("a"),k),[{v:fr(k,V("a")),why:"わられる数 a が分子、わる数が分母です。"},{v:`${k}${V("a")}`,why:"÷ はかけ算ではありません。分数で表します。"},{v:`${V("a")}${k}`,why:"÷ は分数で表します。"}],"÷ は分数で：a ÷ "+k+" = a/"+k);
  if(t==="sq") return mk(`${V("x")} × ${V("x")} × ${V("y")}`,`${V("x")}<sup>2</sup>${V("y")}`,[{v:`2${V("xy")}`,why:"同じ文字の積は累乗の指数で表します（x×x＝x²）。"},{v:`${V("x")}<sup>3</sup>`,why:"x と y はちがう文字です。x×x＝x²、それに y。"},{v:`${V("xy")}<sup>2</sup>`,why:"2回かけているのは x だけです。"}],"x×x は x²。x²y");
  return mk(`${V("a")} × ${k} ${M} ${V("b")} ÷ 2`,`${k}${V("a")} ${M} ${fr(V("b"),2)}`,[{v:`${V("a")}${k} ${M} ${fr(2,V("b"))}`,why:"数は文字の前、÷ はわる数を分母にします。"},{v:fr(`${k}${V("a")} ${M} ${V("b")}`,2),why:"÷2 は b だけにかかっています。"},{v:`${k}${V("a")} ${M} 2${V("b")}`,why:"÷2 は分数で b/2 と表します。"}],`${k}a − b/2`); }
// 式の値（代入）
function substitute(){ const x=NZ(-5,5); const t=pick(["lin","sq","negsq"]);
  if(t==="lin"){ const a=NZ(-5,5),b=NZ(-9,9); const ex=lin(a,b), ans=a*x+b;
    return {q:`${V("x")} = ${num(x)} のとき、${ex} の値`,ans:num(ans),wrongs:W(ans,[{v:a*-x+b,why:`負の数を代入するときは ( ) をつけて ${a}×(${num(x)}) のように計算します。符号に注意。`},{v:a+x+b,why:`${a}${"x"} は ${a}×x。たし算ではありません。`}],ans),exp:`${num(a)}×${par(x)} + ${par(b)} = ${num(ans)}`,tf:v=>`${V("x")} = ${num(x)} のとき、${ex} = ${v}`,kind:"sub"}; }
  if(t==="sq"){ const ans=x*x; return {q:`${V("x")} = ${num(x)} のとき、${V("x")}<sup>2</sup> の値`,ans:num(ans),wrongs:W(ans,[{v:-ans,why:"負の数を2乗すると正になります。"},{v:2*x,why:"x² は x×2 ではなく x×x。"}],ans),exp:`${par(x)}×${par(x)} = ${ans}`,tf:v=>`${V("x")} = ${num(x)} のとき、${V("x")}<sup>2</sup> = ${v}`,kind:"sub"}; }
  const ans=-x*x; return {q:`${V("x")} = ${num(x)} のとき、${M}${V("x")}<sup>2</sup> の値`,ans:num(ans),wrongs:W(ans,[{v:x*x,why:`${M}x² は ${M}(x×x)。x² を計算してから ${M} をつけます。`},{v:-2*x,why:"x² は x×x。"}],ans),exp:`${M}(${par(x)}×${par(x)}) = ${num(ans)}`,tf:v=>`${V("x")} = ${num(x)} のとき、${M}${V("x")}<sup>2</sup> = ${v}`,kind:"sub"}; }
const xs=(q,ans,L,exp)=>({q,ans,wrongs:W(ans,L),exp,tf:v=>`${q} = ${v}`,kind:"expr"});
// 同類項をまとめる
function like(){ const a=NZ(-7,7),b=NZ(-9,9),c=NZ(-7,7),d=NZ(-9,9); if(a+c===0) return like();
  const q=poly([[a,"x"],[b,""],[c,"x"],[d,""]]); const ans=lin(a+c,b+d);
  return xs(q,ans,[{v:poly([[a+c+b+d,"x"]]),why:"文字の項と数の項は、まとめられません。"},{v:lin(-(a+c),b+d),why:"x の項の符号を確かめよう。"},{v:lin(a-c,b+d),why:"x の項の符号を確かめよう。"},{v:lin(a+c,b-d),why:"数の項の符号を確かめよう。"},{v:lin(a+c,-(b+d)),why:"数の項の符号を確かめよう。"}],`x の項：${num(a)}+${par(c)}=${num(a+c)}、数の項：${num(b)}+${par(d)}=${num(b+d)}`); }
// 1次式と数の乗除
function distrib(){ if(Math.random()<.65){ const k=NZ(-5,5),a=NZ(-6,6),b=NZ(-9,9); if(k===1) return distrib(); const q=`${k<0?`(${num(k)})`:k}(${lin(a,b)})`; const ans=lin(k*a,k*b);
    return xs(q,ans,[{v:lin(k*a,b),why:`かっこの中のすべての項に ${num(k)} をかけます（分配法則）。`},{v:lin(k*a,-k*b),why:"数の項の符号を確かめよう。"},{v:lin(a+k,b+k),why:"かけ算です。たし算ではありません。"}],`= ${par(k)}×(${lin(a,0)}) + ${par(k)}×${par(b)} = ${ans}`); }
  const k=R(2,5),a=NZ(-4,4)*k,b=NZ(-4,4)*k; const q=`(${lin(a,b)}) ÷ ${k}`; const ans=lin(a/k,b/k);
  return xs(q,ans,[{v:lin(a/k,b),why:`すべての項を ${k} でわります。`},{v:lin(a*k,b*k),why:"わり算です。かけ算ではありません。"},{v:lin(a/k,-b/k),why:"数の項の符号を確かめよう。"}],`= (${lin(a,0)})÷${k} + ${par(b)}÷${k} = ${ans}`); }
// かっこを外して加減
function bracket(){ const a=NZ(-6,6),b=NZ(-9,9),c=NZ(-6,6),d=NZ(-9,9); if(a===c) return bracket();
  if(Math.random()<.6){ const q=`(${lin(a,b)}) ${M} (${lin(c,d)})`, ans=lin(a-c,b-d);
    return xs(q,ans,[{v:lin(a-c,b+d),why:`${M}( ) をはずすときは、かっこの中のすべての項の符号を変えます。`},{v:lin(a+c,b+d),why:"ひき算です。うしろのかっこの符号をすべて変えよう。"},{v:lin(a-c,-b-d),why:"前のかっこはそのまま外します。"}],`= ${poly([[a,"x"],[b,""],[-c,"x"],[-d,""]])} = ${ans}`); }
  const p=NZ(2,4),qq=NZ(-4,4); const q=`${p}(${lin(a,b)}) + ${qq<0?`(${num(qq)})`:qq}(${lin(c,d)})`, ans=lin(p*a+qq*c,p*b+qq*d);
  return xs(q,ans,[{v:lin(p*a+qq*c,b+d),why:"かっこの中のすべての項に、前の数をかけます。"},{v:lin(p*a+qq*c,p*b-qq*d),why:"うしろのかっこの数の項の符号を確かめよう。"},{v:lin(p*a-qq*c,p*b+qq*d),why:"うしろのかっこの x の項の符号を確かめよう。"}],`= ${poly([[p*a,"x"],[p*b,""],[qq*c,"x"],[qq*d,""]])} = ${ans}`); }

/* ========== 一元一次方程式 ========== */
const eqQ=(q,x,L,exp)=>({q:`${q}`,ans:num(x),wrongs:W(x,L,x),exp,tf:v=>`${q} の解は ${V("x")} = ${v}`,kind:"eq"});
// x+a=b, ax=b
function eq1(){ const x=NZ(-9,9); if(Math.random()<.5){ const a=NZ(-9,9),b=x+a; const q=eq(lin(1,a),num(b));
    return eqQ(q,x,[{v:b+a,why:`移項すると符号が変わります。${num(a)} を右へ移すと ${num(-a)}。`},{v:-x,why:"符号を確かめよう。"}],`${V("x")} = ${num(b)} ${a>0?M:"+"} ${Math.abs(a)} = ${num(x)}`); }
  const a=NZ(-9,9); if(a===1) return eq1(); const b=a*x; const q=eq(lin(a,0),num(b));
  return eqQ(q,x,[{v:b*a,why:`両辺を ${num(a)} で「わる」と x が求められます。`},{v:b-a,why:`${num(a)}x は ${num(a)}×x。両辺を ${num(a)} でわります。`},{v:-x,why:"わる数の符号に注意しよう。"}],`両辺を ${num(a)} でわる：${V("x")} = ${num(b)}÷${par(a)} = ${num(x)}`); }
// ax+b=c
function eq2(){ const x=NZ(-6,6),a=NZ(-5,5),b=NZ(-9,9); if(a===1||a===-1) return eq2(); const c=a*x+b; const q=eq(lin(a,b),num(c));
  return eqQ(q,x,[{v:(c+b)/a,why:`移項すると符号が変わります。${num(b)} を右へ移すと ${num(-b)}。`},{v:c-b,why:`最後に両辺を ${num(a)} でわるのを忘れています。`},{v:-x,why:`両辺を ${num(a)} でわるときの符号に注意。`}],`${lin(a,0)} = ${num(c)} ${b>0?M:"+"} ${Math.abs(b)} = ${num(c-b)} → ${V("x")} = ${num(x)}`); }
// ax+b=cx+d
function eq3(){ const x=NZ(-6,6),a=NZ(-6,6),c=NZ(-6,6),b=NZ(-9,9); if(a===c) return eq3(); const d=a*x+b-c*x; const q=eq(lin(a,b),lin(c,d)); const k=a-c;
  return eqQ(q,x,[{v:(d+b)/k,why:`${num(b)} を右へ移項すると ${num(-b)} になります。`},{v:(d-b)/(a+c),why:`${lin(c,0)} を左へ移項すると ${lin(-c,0)} になります。`},{v:d-b,why:`最後に両辺を ${num(k)} でわります。`},{v:-x,why:"符号を確かめよう。"}],`${lin(a,0)} ${lin(-c,0).startsWith(M)?"":"+"} ${lin(-c,0)} = ${num(d)} ${b>0?M:"+"} ${Math.abs(b)} → ${lin(k,0)} = ${num(d-b)} → ${V("x")} = ${num(x)}`); }
// かっこを含む
function eq4(){ const x=NZ(-6,6),a=NZ(-4,4),b=NZ(-6,6); if(a===1||a===-1) return eq4(); const c=a*(x+b); const q=eq(`${a<0?`(${num(a)})`:a}(${lin(1,b)})`,num(c));
  return eqQ(q,x,[{v:Number.isInteger((c-b)/a)?(c-b)/a:null,why:`かっこを外すとき、${num(b)} にも ${num(a)} をかけます。`},{v:c/a+b,why:"移項すると符号が変わります。"},{v:c-a*b,why:`最後に両辺を ${num(a)} でわります。`}],`${lin(a,a*b)} = ${num(c)} → ${lin(a,0)} = ${num(c-a*b)} → ${V("x")} = ${num(x)}（または両辺を ${num(a)} でわって ${lin(1,b)} = ${num(c/a)}）`); }
// 比例式
function ratio(){ const c=R(2,6),a=R(2,9); const bb=c*R(1,4); const x=a*bb/c; const q=`${V("x")} : ${a} = ${bb} : ${c}`;
  return {q,ans:num(x),wrongs:W(x,[{v:Number.isInteger(a*c/bb)?a*c/bb:null,why:"比例式は「外側の積＝内側の積」：x×"+c+" = "+a+"×"+bb+"。"},{v:a*bb,why:`最後に両辺を ${c} でわります。`},{v:a+bb-c,why:"比はたし算・ひき算ではなく、かけ算で解きます。"}],x),exp:`${V("x")}×${c} = ${a}×${bb} → ${V("x")} = ${x}`,tf:v=>`${q} のとき ${V("x")} = ${v}`,kind:"eq"}; }

/* ========== 単元（学習指導要領 数学 第1学年 A 数と式） ========== */
const units=[
 {id:"int",s:"math",g:"A1",n:{ja:"正の数・負の数","en":"Positive & negative numbers","zh-Hant":"正數・負數"},gr:"1",k:"math",ref:"(1) 正の数・負の数",
  parts:[1,2,3,4,5],pn:{1:"2数の加法・減法",2:"3数以上の加法・減法",3:"乗法・除法",4:"累乗",5:"四則の混じった計算"},sk:{1:[addsub],2:[addsub3],3:[muldiv],4:[power],5:[mixed]}},
 {id:"expr",s:"math",g:"A1",n:{ja:"文字の式","en":"Expressions with letters","zh-Hant":"文字式"},gr:"1",k:"math",ref:"(2) 文字を用いた式",
  parts:[1,2,3,4,5],pn:{1:"文字式の表し方",2:"式の値（代入）",3:"同類項をまとめる",4:"1次式と数の乗法・除法",5:"かっこを外して加減"},sk:{1:[notation],2:[substitute],3:[like],4:[distrib],5:[bracket]}},
 {id:"leq",s:"math",g:"A1",n:{ja:"1次方程式","en":"Linear equations","zh-Hant":"一元一次方程式"},gr:"1",k:"math",ref:"(3) 一元一次方程式",
  parts:[1,2,3,4,5],pn:{1:"x+a=b・ax=b",2:"ax+b=c",3:"両辺に x がある",4:"かっこを含む",5:"比例式"},sk:{1:[eq1],2:[eq2],3:[eq3],4:[eq4],5:[ratio]}},
];
// 問題を作る（変な選択肢や答えが出ないよう、作り直しつき）
function make(fn){ for(let i=0;i<20;i++){ try{ const g=fn(); if(g&&g.wrongs.length>=3&&!g.wrongs.some(w=>w.v===g.ans)) return g; }catch(e){} } return fn(); }
return {units,make};
})();
