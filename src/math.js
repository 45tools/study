/* 45 Study 数学：問題をその場で作る（数字は毎回かわる）。
   まちがいの選択肢は「よくあるミス」から作るので、選んだ答えごとに理由を出せる。
   単元の並び：中学校学習指導要領（平成29年告示）数学 第1学年・第2学年それぞれ A 数と式 → B 図形 → C 関数 → D データの活用
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
  for(const w of list){ if(w==null||w.v==null||w.v==="") continue; const k=String(w.v); if(seen.has(k)) continue; if(typeof w.v==="number"&&!Number.isInteger(w.v)) continue; seen.add(k); out.push({v:typeof w.v==="number"?num(w.v):w.v,why:w.why}); }
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
    return {q:`${V("x")} = ${num(x)} のとき、${ex} の値`,ans:num(ans),wrongs:W(ans,[{v:a*-x+b,why:`符号に注意。負の数は ( ) をつけて代入し、${num(a)}×${par(x)} と計算します。`},{v:a+x+b,why:`${num(a)}x は ${num(a)}×x。たし算ではありません。`}],ans),exp:`${num(a)}×${par(x)} + ${par(b)} = ${num(ans)}`,tf:v=>`${V("x")} = ${num(x)} のとき、${ex} = ${v}`,kind:"sub"}; }
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
  if(Math.random()<.5) return {q:`${V("y")} は ${V("x")} に比例し、${V("x")} = ${num(x)} のとき ${V("y")} = ${num(y)}。比例定数は？`,ans:num(a),wrongs:W(a,[{v:Number.isInteger(x/y)?x/y:null,why:"比例定数は y ÷ x です（x ÷ y ではありません）。"},{v:y-x,why:"y = ax なので、a は y を x で「わって」求めます。"},{v:-a,why:"符号を確かめよう。"}],a),exp:`${V("y")} = ${V("a")}${V("x")} に代入：${num(y)} = ${V("a")}×${par(x)} → ${V("a")} = ${num(a)}`,tf:v=>`比例定数は ${v}`,kind:"word"};
  const x2=NZ(-6,6), y2=a*x2; return {q:`${V("y")} = ${coef(a,1)}${V("x")} で、${V("x")} = ${num(x2)} のときの ${V("y")} の値は？`,ans:num(y2),wrongs:W(y2,[{v:a+x2,why:`${coef(a,1)}x は ${num(a)}×x。たし算ではありません。`},{v:-y2,why:"符号を確かめよう。"},{v:Number.isInteger(x2/a)?x2/a:null,why:"y = ax は「かける」式です。"}],y2),exp:`${V("y")} = ${num(a)}×${par(x2)} = ${num(y2)}`,tf:v=>`${V("x")} = ${num(x2)} のとき ${V("y")} = ${v}`,kind:"word"}; }
function invEq(){ const x=NZ(-6,6),k=NZ(-6,6),a=x*k; if(Math.abs(a)<2) return invEq();
  if(Math.random()<.5) return {q:`${V("y")} は ${V("x")} に反比例し、${V("x")} = ${num(x)} のとき ${V("y")} = ${num(k)}。比例定数は？`,ans:num(a),wrongs:W(a,[{v:Number.isInteger(k/x)?k/x:null,why:"反比例は y = a/x なので、a = x × y です（y ÷ x は比例のとき）。"},{v:x+k,why:"反比例の比例定数は x と y の「積」です。"},{v:-a,why:"符号を確かめよう。"}],a),exp:`${V("a")} = ${V("x")}${V("y")} = ${par(x)}×${par(k)} = ${num(a)}`,tf:v=>`比例定数は ${v}`,kind:"word"};
  const ds=[1,2,3,4,6].filter(d=>a%d===0); const x2=pick(ds)*pick([1,-1]); const y2=a/x2;
  return {q:`${V("y")} = ${fr(num(a),V("x"))} で、${V("x")} = ${num(x2)} のときの ${V("y")} の値は？`,ans:num(y2),wrongs:W(y2,[{v:a*x2,why:`y = ${num(a)}/x は ${num(a)} を x で「わる」式です。`},{v:-y2,why:"符号を確かめよう。"},{v:a-x2,why:"わり算で求めます。"}],y2),exp:`${V("y")} = ${num(a)}÷${par(x2)} = ${num(y2)}`,tf:v=>`${V("x")} = ${num(x2)} のとき ${V("y")} = ${v}`,kind:"word"}; }
function coordRead(){ const x=NZ(-5,5),y=NZ(-5,5); if(x===y) return coordRead(); const L=pick(["A","B","P"]);
  return {q:`点${L}の座標は？${coord({pts:[[x,y,L]]})}`,ans:PAIR(x,y),wrongs:W(PAIR(x,y),[{v:PAIR(y,x),why:"座標は (x座標, y座標) の順に書きます。x が先です。"},{v:PAIR(-x,y),why:"x座標の符号を確かめよう（右が正、左が負）。"},{v:PAIR(x,-y),why:"y座標の符号を確かめよう（上が正、下が負）。"},{v:PAIR(-x,-y),why:"x座標・y座標の符号を確かめよう。"}]),exp:`右へ ${num(x)}、上へ ${num(y)} → ${PAIR(x,y)}`,tf:v=>`点${L}の座標は ${v}${coord({pts:[[x,y,L]]})}`,kind:"fig"}; }
function graphEq(){ if(Math.random()<.7){ const [p,q]=pick([[1,1],[2,1],[3,1],[-1,1],[-2,1],[-3,1],[1,2],[-1,2],[2,3],[-2,3],[3,2],[-3,2]]); const x=q===1?(Math.abs(p)>=3?2:pick([2,3])):q, y=p*x/q;
    const eqs=(a,b)=>`${V("y")} = ${coef(a,b)}${V("x")}`; const g=coord({line:[p,q],pts:[[x,y,""]]});
    const L=[{v:Math.abs(p)===q?null:eqs(q*Math.sign(p),Math.abs(p)),why:`比例定数は y ÷ x。グラフの点 (${num(x)}, ${num(y)}) から a = ${num(y)}÷${par(x)}。`},{v:eqs(-p,q),why:"右上がりなら比例定数は正、右下がりなら負です。"},{v:`${V("y")} = ${fr(num(x*y),V("x"))}`,why:"原点を通る直線は比例のグラフです。y = a/x は反比例（双曲線）。"},{v:q===1?eqs(p+Math.sign(p),1):null,why:"点の座標を読み直そう。x が 1 増えると y は a だけ増えます。"}];
    return {q:`グラフの式は？${g}`,ans:eqs(p,q),wrongs:W(eqs(p,q),L),exp:`点 (${num(x)}, ${num(y)}) を通る → a = ${num(y)}÷${par(x)} = ${q===1?num(p):(p<0?M:"")+fr(Math.abs(p),q)}`,tf:v=>`グラフの式は ${v}${g}`,kind:"fig"}; }
  const a=pick([6,-6,4,-4,8,-8,12,-12]); const x=pick([1,2,3,4,6].filter(d=>Math.abs(a)%d===0&&Math.abs(a/d)<=6&&d<=6)); const g=coord({hyp:a,pts:[[x,a/x,""]]});
  return {q:`グラフの式は？${g}`,ans:`${V("y")} = ${fr(num(a),V("x"))}`,wrongs:W(`${V("y")} = ${fr(num(a),V("x"))}`,[{v:`${V("y")} = ${coef(a,1)}${V("x")}`,why:"双曲線は反比例のグラフです。比例 y = ax のグラフは原点を通る直線。"},{v:`${V("y")} = ${fr(num(-a),V("x"))}`,why:"グラフがどの象限にあるかで符号を確かめよう。"},{v:`${V("y")} = ${fr(num(a/x),V("x"))}`,why:"反比例の比例定数は x × y。点 ("+num(x)+", "+num(a/x)+") から a = "+num(a)+"。"}]),exp:`点 (${num(x)}, ${num(a/x)}) を通る → a = ${num(x)}×${par(a/x)} = ${num(a)}`,tf:v=>`グラフの式は ${v}${g}`,kind:"fig"}; }
function whichRel(){ const t=pick(["p","i","n"]); const xs=[1,2,3,4,6]; let ys; const a=NZ(2,6)*pick([1,-1]);
  if(t==="p") ys=xs.map(x=>a*x); else if(t==="i") ys=xs.map(x=>12*Math.sign(a)/x*(Math.abs(a)%2?1:1)); else { const b=NZ(1,5); ys=xs.map(x=>a*x+b); }
  const tbl=`<table class="mt"><tr><th>${V("x")}</th>${xs.map(x=>`<td>${x}</td>`).join("")}</tr><tr><th>${V("y")}</th>${ys.map(y=>`<td>${num(y)}</td>`).join("")}</tr></table>`;
  const A={p:"比例",i:"反比例",n:"どちらでもない"}; const why={p:"比例なら、y ÷ x がいつも同じ（x が2倍、3倍…になると y も2倍、3倍…）。",i:"反比例なら、x × y がいつも同じ（x が2倍になると y は 1/2 倍）。",n:"y ÷ x も x × y も一定でなければ、どちらでもありません。"};
  return {q:`表の ${V("x")} と ${V("y")} の関係は？${tbl}`,ans:A[t],wrongs:[...Object.keys(A).filter(k=>k!==t).map(k=>({v:A[k],why:why[t]})),{v:"xとyは関係がない",why:"x の値を決めると y の値が1つに決まります。y は x の関数です。"}],exp:t==="p"?`y÷x がいつも ${num(a)} → 比例`:t==="i"?`x×y がいつも ${num(12*Math.sign(a))} → 反比例`:"y÷x も x×y も一定ではない",tf:v=>`表の関係は「${v}」${tbl}`,kind:"fig"}; }

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
  b+=`<text x="${P(F[0]).split(",")[0]*1+4}" y="${P(F[0]).split(",")[1]*1-6}" class="lb">ア</text><text x="${P(G[0]).split(",")[0]*1+(t==="tr"?4:-16)}" y="${P(G[0]).split(",")[1]*1+(t==="rot"?16:-6)}" class="lb">イ</text>`;
  const g=SV(16+Wd*S,16+Ht*S,b); const A={tr:"平行移動",ref:"対称移動（直線ℓが軸）",rot:"回転移動（点Oが中心）"};
  const why={tr:"平行移動は、図形を同じ方向に同じ長さだけずらす移動。向きは変わりません。",ref:"対称移動は、直線ℓを折り目にして裏返す移動。左右が反対になります。",rot:"回転移動は、点Oを中心に回す移動。イはアを点Oのまわりに180°回したものです。"};
  return {q:`アをイに重ねる移動は？${g}`,ans:A[t],wrongs:[...Object.keys(A).filter(k=>k!==t).map(k=>({v:A[k],why:why[t]})),{v:"拡大（大きさを変える）",why:"アとイは形も大きさも同じです。移動では大きさは変わりません。"}],exp:why[t],tf:v=>`アをイに重ねる移動は ${v}${g}`,kind:"fig"}; }
const construct=bank([
 ["線分ABの垂直二等分線上の点は？","2点A、Bからの距離が等しい",[["2つの辺からの距離が等しい","それは角の二等分線上の点の性質です。"],["点Aからの距離がいつも同じ","それは点Aを中心とする円の上の点です。"],["直線ABからの距離が等しい","それは直線ABに平行な直線の上の点です。"]],"垂直二等分線上の点は、線分の両端から等しい距離にある"],
 ["∠AOBの二等分線上の点は？","辺OA、OBからの距離が等しい",[["2点A、Bからの距離が等しい","それは線分ABの垂直二等分線上の点の性質です。"],["点Oからの距離がいつも同じ","それは点Oを中心とする円の上の点です。"],["辺OAと垂直に交わる","角の二等分線は、角を2等分する半直線です。"]],"角の二等分線上の点は、角の2辺から等しい距離にある"],
 ["円の接線と、接点を通る半径の関係は？","垂直に交わる",[["平行","接線と半径は接点で交わります。"],["45°で交わる","接線は接点を通る半径に垂直です。"],["重なる","接線は円と1点だけで交わる直線です。"]],"円の接線は、接点を通る半径に垂直"],
 ["点Pから直線ℓまでの距離を表す線分は？","Pからℓにひいた垂線",[["Pからℓへのいちばん長い線分","距離は「いちばん短い」長さです。"],["ℓに平行な線分","平行な線はℓと交わりません。"],["Pを中心とする円の半径","垂線の長さが点と直線の距離です。"]],"点と直線の距離は、点から直線にひいた垂線の長さ"],
 ["3点A、B、Cから等しい距離にある点を作図するには？","線分AB、BCの垂直二等分線の交点",[["∠A、∠Bの二等分線の交点","角の二等分線は、辺からの距離が等しい点です。"],["線分AB、BCの中点を結ぶ","2点から等しい距離の点は垂直二等分線の上にあります。"],["点Aから辺BCへの垂線","3点からの距離が等しい点は、垂直二等分線を2本ひいて求めます。"]],"2点から等しい距離＝垂直二等分線。2本の交点が3点から等しい"],
 ["作図に使う道具は？","定規とコンパスだけ",[["定規と分度器","作図では分度器は使いません。角度ははかりません。"],["コンパスと三角定規の目もり","作図では長さを目もりではかりません。"],["分度器だけ","作図は定規（線をひく）とコンパス（円をかく・長さを移す）で行います。"]],"作図は定規とコンパスだけを使う"],
 ["30°の角を作図するには？","正三角形で60°を作り、二等分する",[["分度器で30°をはかる","作図では分度器を使いません。"],["90°を3つに分ける垂線をひく","垂線では90°しか作れません。60°の二等分で30°です。"],["円を6等分する","円の6等分は60°ずつです。"]],"60°（正三角形の角）を角の二等分線で2等分"],
 ["線分ABの中点を作図するには？","線分ABの垂直二等分線とABの交点",[["∠Aの二等分線とABの交点","中点は線分の垂直二等分線で求めます。"],["点Aを中心にABを半径とする円","それはAから同じ距離の点です。"],["点Bからの垂線","中点は両端から等しい距離の点です。"]],"垂直二等分線は線分の中点を通る"],
]);
const symbols=bank([
 ["AB ∥ CD の意味は？","ABとCDは平行",[["ABとCDは垂直","垂直の記号は ⊥ です。"],["ABとCDの長さが等しい","長さが等しいときは AB = CD と書きます。"],["ABとCDが交わる","∥ は平行の記号です。"]],"∥ は平行"],
 ["AB ⊥ CD の意味は？","ABとCDは垂直",[["ABとCDは平行","平行の記号は ∥ です。"],["ABとCDの長さが等しい","長さが等しいときは AB = CD。"],["ABはCDより長い","⊥ は垂直の記号です。"]],"⊥ は垂直"],
 ["円周上の2点を結んだ線分を何という？","弦",[["弧","弧は円周の一部（曲線）です。"],["半径","半径は中心と円周上の点を結ぶ線分です。"],["接線","接線は円と1点で交わる直線です。"]],"円周上の2点を結ぶ線分＝弦"],
 ["円周の一部分を何という？","弧",[["弦","弦は2点を結ぶ線分（まっすぐ）です。"],["おうぎ形","おうぎ形は2本の半径と弧で囲まれた図形です。"],["中心角","中心角は角度です。"]],"円周の一部＝弧"],
 ["2本の半径と弧で囲まれた図形を何という？","おうぎ形",[["弓形","弓形は弦と弧で囲まれた図形です。"],["半円","半円は中心角180°のおうぎ形だけを指します。"],["扇の弦","おうぎ形が正しい名前です。"]],"2本の半径と弧＝おうぎ形"],
 ["両方向に限りなくのびたまっすぐな線を何という？","直線",[["線分","線分は両端がある（長さが決まっている）線です。"],["半直線","半直線は一方だけに限りなくのびる線です。"],["弧","弧は円周の一部です。"]],"両方向にのびる＝直線"],
 ["一方の端があり、もう一方に限りなくのびる線を何という？","半直線",[["直線","直線は両方向にのびます。"],["線分","線分は両端があります。"],["弦","弦は円周上の2点を結ぶ線分です。"]],"片方にのびる＝半直線"],
 ["∠ABC の頂点は？","点B",[["点A","∠ABC は真ん中の文字が頂点です。"],["点C","∠ABC は真ん中の文字が頂点です。"],["辺AC","頂点は点です。"]],"∠ABC は B が頂点"],
]);

/* ========== 空間図形（B(2)） ========== */
// おうぎ形：r×a/180（弧）、r²×a/360（面積）が整数になる組
function sectorPair(f){ for(let i=0;i<60;i++){ const r=R(2,12),a=pick([30,45,60,90,120,135,150,180,210,240,270,300]); const v=f(r,a); if(Number.isInteger(v)&&v>0&&v<=200) return [r,a]; } return [6,60]; }
function sectorFig(r,a){ const c=60,R0=50,rad=a*Math.PI/180; const x2=c+R0*Math.cos(-rad),y2=c+R0*Math.sin(-rad);
  return SV(120,120,`<path d="M${c} ${c} L${c+R0} ${c} A${R0} ${R0} 0 ${a>180?1:0} 0 ${x2.toFixed(1)} ${y2.toFixed(1)} Z" class="f1"/><text x="${c+R0/2-6}" y="${c+14}" class="nm">${r}cm</text><text x="${c+8}" y="${c-6}" class="nm">${a}°</text>`); }
function arc(){ const [r,a]=sectorPair((r,a)=>r*a/180); const v=r*a/180; const ans=PI(v)+" cm";
  return {q:`半径 ${r}cm、中心角 ${a}° のおうぎ形の弧の長さは？${sectorFig(r,a)}`,ans,wrongs:W(ans,[{v:Number.isInteger(r*r*a/360)?PI(r*r*a/360)+" cm":null,why:"πr²×中心角/360 は面積の式です。弧の長さは 2πr×中心角/360。"},{v:PI(2*r)+" cm",why:`円周 2πr に、中心角/360（${a}/360）をかけます。`},{v:Number.isInteger(r*a/360)?PI(r*a/360)+" cm":null,why:"円周は 2πr です（πr ではありません）。"},{v:PI(v*2)+" cm",why:"円周は 2πr。2倍しすぎていないか確かめよう。"}]),exp:`2π×${r}×${fr(a,360)} = ${PI(v)}`,tf:v=>`半径 ${r}cm、中心角 ${a}° の弧の長さは ${v}`,kind:"word"}; }
function sector(){ const [r,a]=sectorPair((r,a)=>r*r*a/360); const v=r*r*a/360; const ans=PI(v)+" cm²";
  return {q:`半径 ${r}cm、中心角 ${a}° のおうぎ形の面積は？${sectorFig(r,a)}`,ans,wrongs:W(ans,[{v:Number.isInteger(r*a/180)?PI(r*a/180)+" cm²":null,why:"2πr×中心角/360 は弧の長さの式です。面積は πr²×中心角/360。"},{v:PI(r*r)+" cm²",why:`円の面積 πr² に、中心角/360（${a}/360）をかけます。`},{v:Number.isInteger(2*r*a/360)?PI(2*r*a/360)+" cm²":null,why:"面積は半径を2回かけます（πr²）。"},{v:PI(v*2)+" cm²",why:"πr²×中心角/360。2倍しないよう確かめよう。"}]),exp:`π×${r}²×${fr(a,360)} = ${PI(v)}`,tf:v=>`半径 ${r}cm、中心角 ${a}° の面積は ${v}`,kind:"word"}; }
function volume(){ const t=pick(["prism","pyr","cyl","cone","sph"]);
  if(t==="prism"){ const a=R(2,6),b=R(2,6),h=R(2,9),v=a*b*h; return {q:`底面が ${a}cm×${b}cm の長方形、高さ ${h}cm の四角柱の体積は？`,ans:v+" cm³",wrongs:W(v+" cm³",[{v:Math.round(v/3)===v/3?v/3+" cm³":null,why:"柱の体積は 底面積×高さ。1/3 をかけるのは錐です。"},{v:(a*b+h)+" cm³",why:"底面積と高さはかけ算です。"},{v:2*(a*b+b*h+a*h)+" cm³",why:"それは表面積です。"},{v:(a+b)*h+" cm³",why:`底面積は ${a}×${b}。`}]),exp:`${a}×${b}×${h} = ${v}`,tf:x=>`この四角柱の体積は ${x}`,kind:"word"}; }
  if(t==="pyr"){ const a=R(2,6),h=3*R(1,4),v=a*a*h/3; return {q:`底面が1辺 ${a}cm の正方形、高さ ${h}cm の正四角錐の体積は？`,ans:v+" cm³",wrongs:W(v+" cm³",[{v:a*a*h+" cm³",why:"錐の体積は 底面積×高さ×1/3。1/3 を忘れています。"},{v:a*h/3+" cm³",why:`底面積は ${a}×${a} です。`},{v:a*a*h/2+" cm³",why:"錐は 1/2 ではなく 1/3 をかけます。"}]),exp:`${fr(1,3)}×${a}²×${h} = ${v}`,tf:x=>`この正四角錐の体積は ${x}`,kind:"word"}; }
  if(t==="cyl"){ const r=R(1,6),h=R(2,9),v=r*r*h; return {q:`底面の半径 ${r}cm、高さ ${h}cm の円柱の体積は？`,ans:PI(v)+" cm³",wrongs:W(PI(v)+" cm³",[{v:PI(2*r*h)+" cm³",why:"底面積は πr²（2πr は円周）。"},{v:Number.isInteger(v/3)?PI(v/3)+" cm³":PI(4*r*r*h)+" cm³",why:Number.isInteger(v/3)?"1/3 をかけるのは円錐です。円柱は 底面積×高さ。":"半径を使います（直径ではありません）。"},{v:PI(r*h)+" cm³",why:"底面積は π×半径×半径。"}]),exp:`π×${r}²×${h} = ${PI(v)}`,tf:x=>`この円柱の体積は ${x}`,kind:"word"}; }
  if(t==="cone"){ const r=R(1,6),h=3*R(1,4),v=r*r*h/3; return {q:`底面の半径 ${r}cm、高さ ${h}cm の円錐の体積は？`,ans:PI(v)+" cm³",wrongs:W(PI(v)+" cm³",[{v:PI(r*r*h)+" cm³",why:"錐の体積は 底面積×高さ×1/3。1/3 を忘れています。"},{v:PI(2*r*h/3)+" cm³",why:"底面積は πr²（2πr は円周）。"},{v:PI(r*h/3)+" cm³",why:"底面積は π×半径×半径。"}]),exp:`${fr(1,3)}×π×${r}²×${h} = ${PI(v)}`,tf:x=>`この円錐の体積は ${x}`,kind:"word"}; }
  const r=3*R(1,2),v=4*r*r*r/3; return {q:`半径 ${r}cm の球の体積は？`,ans:PI(v)+" cm³",wrongs:W(PI(v)+" cm³",[{v:PI(4*r*r)+" cm³",why:"4πr² は球の表面積です。体積は 4/3πr³。"},{v:PI(r*r*r)+" cm³",why:"球の体積は 4/3πr³。4/3 をかけます。"},{v:PI(4*r*r*r)+" cm³",why:"4/3 の「3でわる」を忘れています。"}]),exp:`${fr(4,3)}π×${r}³ = ${PI(v)}`,tf:x=>`この球の体積は ${x}`,kind:"word"}; }
function surface(){ const t=pick(["box","cube","cyl","sph"]);
  if(t==="box"){ const a=R(2,6),b=R(2,6),c=R(2,6),s=2*(a*b+b*c+a*c); return {q:`縦 ${a}cm、横 ${b}cm、高さ ${c}cm の直方体の表面積は？`,ans:s+" cm²",wrongs:W(s+" cm²",[{v:(a*b+b*c+a*c)+" cm²",why:"同じ形の面が2つずつあります。3種類の面積の和を2倍します。"},{v:a*b*c+" cm²",why:"それは体積です。"},{v:6*a*b+" cm²",why:"立方体ではないので、6つの面の大きさは同じではありません。"}]),exp:`2×(${a}×${b} + ${b}×${c} + ${a}×${c}) = ${s}`,tf:x=>`この直方体の表面積は ${x}`,kind:"word"}; }
  if(t==="cube"){ const a=R(2,9),s=6*a*a; return {q:`1辺 ${a}cm の立方体の表面積は？`,ans:s+" cm²",wrongs:W(s+" cm²",[{v:a*a*a+" cm²",why:"それは体積です。"},{v:4*a*a+" cm²",why:"立方体の面は6つです。"},{v:6*a+" cm²",why:`1つの面の面積は ${a}×${a}。`}]),exp:`6×${a}² = ${s}`,tf:x=>`この立方体の表面積は ${x}`,kind:"word"}; }
  if(t==="cyl"){ const r=R(1,5),h=R(2,8),s=2*r*r+2*r*h; return {q:`底面の半径 ${r}cm、高さ ${h}cm の円柱の表面積は？`,ans:PI(s)+" cm²",wrongs:W(PI(s)+" cm²",[{v:PI(r*r+2*r*h)+" cm²",why:"底面は上と下の2つあります。"},{v:PI(2*r*h)+" cm²",why:"側面だけでなく、底面2つも加えます。"},{v:PI(2*r*r+r*h)+" cm²",why:"側面は長方形で、横の長さは円周 2πr です。"}]),exp:`底面 π×${r}²×2 + 側面 ${h}×2π×${r} = ${PI(s)}`,tf:x=>`この円柱の表面積は ${x}`,kind:"word"}; }
  const r=R(1,6),s=4*r*r; return {q:`半径 ${r}cm の球の表面積は？`,ans:PI(s)+" cm²",wrongs:W(PI(s)+" cm²",[{v:Number.isInteger(4*r*r*r/3)?PI(4*r*r*r/3)+" cm²":PI(r*r)+" cm²",why:Number.isInteger(4*r*r*r/3)?"4/3πr³ は体積です。表面積は 4πr²。":"球の表面積は 4πr²。4をかけます。"},{v:PI(2*r*r)+" cm²",why:"球の表面積は 4πr²。"},{v:PI(4*r)+" cm²",why:"半径を2回かけます（r²）。"}]),exp:`4π×${r}² = ${PI(s)}`,tf:x=>`この球の表面積は ${x}`,kind:"word"}; }
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
  const NM={par:"平行な辺",cross:"交わる辺",skew:"ねじれの位置にある辺"}; const WHY={par:"平行（同じ向きで交わらない）",cross:"交わる（頂点を共有している）",skew:"ねじれの位置（平行でも交わってもいない）"};
  const ans=pick(same); const ws=shuffle(other).slice(0,3).map(x=>({v:"辺"+x,why:`辺${x}は辺${e}と${WHY[rel(e,x)]}です。`})); const f=boxFig();
  return {q:`直方体で、辺${e}と${NM[ty]}は？${f}`,ans:"辺"+ans,wrongs:ws,exp:`辺${e}と${NM[ty]}：${same.map(x=>"辺"+x).join("、")}`,tf:v=>`辺${e}と${v}は「${NM[ty].replace("にある辺","").replace("な辺","").replace("る辺","る")}」${f}`,kind:"fig"}; }

/* ========== データの活用（D(1)(2)） ========== */
function dataset(){ const w=pick([5,10]),st=w===5?pick([140,145,150]):pick([30,40,50]); const T=pick([20,25,50]); const wt=[1,2,3,2,1];
  for(let k=0;k<200;k++){ const f=[1,1,1,1,1]; const sh=R(-1,1); for(let i=5;i<T;i++){ let r=Math.random()*9,j=0; while(r>wt[j]){ r-=wt[j]; j++; } j=Math.min(4,Math.max(0,j+(Math.random()<.3?sh:0))); f[j]++; }
    if(new Set(f).size>=4) return {w,st,f,T,unit:w===5?"cm":"点",cls:f.map((_,i)=>[st+i*w,st+(i+1)*w])}; }
  return dataset(); }
const tbl=D0=>`<table class="mt"><tr><th>階級（${D0.unit}）</th><th>度数</th></tr>${D0.cls.map(([a,b],i)=>`<tr><td>${a}以上〜${b}未満</td><td>${D0.f[i]}</td></tr>`).join("")}<tr><th>合計</th><th>${D0.T}</th></tr></table>`;
function histo(D0){ const S=34,H=110,mx=Math.max(...D0.f); let b="";
  D0.f.forEach((v,i)=>{ const h=v/mx*(H-10); b+=`<rect x="${30+i*S}" y="${10+H-h}" width="${S}" height="${h}" class="f1"/>`; b+=`<text x="${30+i*S}" y="${H+24}" class="nm" text-anchor="middle">${D0.cls[i][0]}</text>`; });
  b+=`<text x="${30+D0.f.length*S}" y="${H+24}" class="nm" text-anchor="middle">${D0.cls[D0.f.length-1][1]}</text>`;
  for(let v=0;v<=mx;v+=Math.max(1,Math.round(mx/4))){ const y=10+H-v/mx*(H-10); b+=`<line x1="26" y1="${y}" x2="${32+D0.f.length*S}" y2="${y}" class="g"/><text x="22" y="${y+4}" class="nm" text-anchor="end">${v}</text>`; }
  b+=`<line x1="30" y1="${10+H}" x2="${32+D0.f.length*S}" y2="${10+H}" class="ax"/><text x="${40+D0.f.length*S}" y="${H+24}" class="nm">(${D0.unit})</text>`;
  return SV(70+D0.f.length*S,H+32,b); }
function freq(){ const D0=dataset(),i=R(0,4),[a,b]=D0.cls[i]; const t=pick(["f","mid","tot"]); const T=tbl(D0);
  if(t==="f") return {q:`${a}${D0.unit}以上${b}${D0.unit}未満の階級の度数は？${T}`,ans:String(D0.f[i]),wrongs:W(D0.f[i],[{v:i<4?D0.f[i+1]:D0.f[i-1],why:`「${a}以上${b}未満」の行を見よう。となりの階級を見ています。`},{v:D0.f.slice(0,i+1).reduce((x,y)=>x+y,0),why:"度数はその階級だけの数です（累積度数ではありません）。"}],D0.f[i]),exp:`表の「${a}以上〜${b}未満」の行`,tf:v=>`${a}以上${b}未満の階級の度数は ${v}${T}`,kind:"fig"};
  if(t==="mid"){ const m=(a+b)/2; return {q:`${a}${D0.unit}以上${b}${D0.unit}未満の階級の階級値は？`,ans:String(m),wrongs:W(m,[{v:a,why:"階級値は階級の真ん中の値です（端の値ではありません）。"},{v:b,why:"階級値は (以上の値＋未満の値)÷2。"},{v:D0.w,why:"それは階級の幅です。"}]),exp:`(${a}+${b})÷2 = ${m}`,tf:v=>`${a}以上${b}未満の階級値は ${v}`,kind:"word"}; }
  return {q:`度数の合計は？（合計の行をかくしています）${T.replace(/<tr><th>合計<\/th><th>\d+<\/th><\/tr>/,"")}`,ans:String(D0.T),wrongs:W(D0.T,[{v:D0.f.length,why:"それは階級の数です。度数をすべてたします。"},{v:Math.max(...D0.f),why:"いちばん多い度数ではなく、すべての度数の和です。"}],D0.T),exp:D0.f.join("+")+" = "+D0.T,tf:v=>`度数の合計は ${v}`,kind:"fig"}; }
function histRead(){ const D0=dataset(); const g=histo(D0); const mi=D0.f.indexOf(Math.max(...D0.f)); const t=pick(["mode","over"]);
  if(t==="mode"&&D0.f.filter(x=>x===D0.f[mi]).length===1){ const ans=`${D0.cls[mi][0]}以上${D0.cls[mi][1]}未満`; return {q:`度数がいちばん多い階級は？${g}`,ans,wrongs:D0.cls.filter((_,i)=>i!==mi).slice(0,3).map(([a,b])=>({v:`${a}以上${b}未満`,why:"ヒストグラムでいちばん高い長方形の階級を選びます。"})),exp:"いちばん高い長方形",tf:v=>`度数がいちばん多い階級は ${v}${g}`,kind:"fig"}; }
  const k=R(2,4), s=D0.f.slice(k).reduce((a,b)=>a+b,0); return {q:`${D0.cls[k][0]}${D0.unit}以上は何人？${g}`,ans:s+"人",wrongs:W(s+"人",[{v:D0.f[k]+"人",why:`${D0.cls[k][0]}以上のすべての階級をたします（その階級だけではありません）。`},{v:(D0.T-s)+"人",why:`それは ${D0.cls[k][0]} 未満の人数です。`},{v:(s+D0.f[k-1])+"人",why:`${D0.cls[k-1][0]}以上${D0.cls[k][0]}未満の階級は入りません。`}]),exp:D0.f.slice(k).join("+")+" = "+s,tf:v=>`${D0.cls[k][0]}以上は ${v}${g}`,kind:"fig"}; }
const dec=x=>String(Math.round(x*100)/100);
function relFreq(){ const D0=dataset(),i=R(0,4),[a,b]=D0.cls[i],T=tbl(D0); const ans=dec(D0.f[i]/D0.T); const cum=D0.f.slice(0,i+1).reduce((x,y)=>x+y,0);
  return {q:`${a}以上${b}未満の階級の相対度数は？${T}`,ans,wrongs:W(ans,[{v:Number.isInteger(D0.T/D0.f[i]*100)?dec(D0.T/D0.f[i]):null,why:"相対度数は その階級の度数 ÷ 度数の合計。わる順番が反対です。"},{v:dec(D0.f[i]/D0.T*100),why:"相対度数は百分率（%）ではなく、1以下の小数で表します。"},{v:i?dec(cum/D0.T):null,why:"それは累積相対度数です。その階級の度数だけを使います。"},{v:dec(D0.f[i]/100),why:`度数の合計（${D0.T}）でわります。`}]),exp:`${D0.f[i]}÷${D0.T} = ${ans}`,tf:v=>`${a}以上${b}未満の相対度数は ${v}${T}`,kind:"fig"}; }
function cumFreq(){ const D0=dataset(),k=R(1,4),T=tbl(D0); const c=D0.f.slice(0,k+1).reduce((x,y)=>x+y,0); const t=Math.random()<.6;
  if(t) return {q:`${D0.cls[k][1]}${D0.unit}未満の累積度数は？${T}`,ans:String(c),wrongs:W(c,[{v:D0.f[k],why:"累積度数は、最初の階級からその階級までの度数をすべてたした数です。"},{v:c-D0.f[k],why:`${D0.cls[k][0]}以上${D0.cls[k][1]}未満の階級も入れます。`},{v:D0.T-c,why:`それは ${D0.cls[k][1]} 以上の度数です。`}],c),exp:D0.f.slice(0,k+1).join("+")+" = "+c,tf:v=>`${D0.cls[k][1]}未満の累積度数は ${v}${T}`,kind:"fig"};
  const ans=dec(c/D0.T); return {q:`${D0.cls[k][1]}${D0.unit}未満の累積相対度数は？${T}`,ans,wrongs:W(ans,[{v:dec(D0.f[k]/D0.T),why:"それはその階級だけの相対度数です。累積度数を合計でわります。"},{v:String(c),why:"累積相対度数は 累積度数÷合計 の小数です。"},{v:dec((D0.T-c)/D0.T),why:`それは ${D0.cls[k][1]} 以上の割合です。`}]),exp:`(${D0.f.slice(0,k+1).join("+")})÷${D0.T} = ${c}÷${D0.T} = ${ans}`,tf:v=>`${D0.cls[k][1]}未満の累積相対度数は ${v}${T}`,kind:"fig"}; }
function probTrial(){ const n=pick([200,500,1000,2000]),pp=pick([12,23,27,34,38,42,46,55,58,63,71]),k=n*pp/100; const thing=pick([["ペットボトルのキャップ","表向き"],["画びょう","針が上向き"],["紙コップ","横向き"],["ボタン","表"]]);
  const ans=dec(pp/100); return {q:`${thing[0]}を ${n} 回投げたら、${thing[1]}が ${k} 回でした。${thing[1]}になる確率はおよそ？`,ans,wrongs:W(ans,[{v:dec(1-pp/100),why:`それは「${thing[1]}にならない」確率です。`},{v:"0.5",why:"表と裏の出やすさが同じとはかぎりません。実験の結果から求めます。"},{v:String(k/100),why:`投げた回数（${n}回）でわります。`},{v:String(pp),why:"確率は 0〜1 の数で表します。"}]),exp:`${k}÷${n} = ${ans}（多くの回数をくり返すと、相対度数が確率に近づく）`,tf:v=>`${thing[1]}になる確率はおよそ ${v}（${n}回中${k}回）`,kind:"word"}; }

/* ==================== 中2 ==================== */
const mono=(c,v)=>term(c,v,true);
const pm=(c,v)=>c<0?`(${mono(c,v)})`:mono(c,v);
const frc=(n,d)=>{ if(d<0){n=-n;d=-d;} const g=gcd(n,d)||1; n/=g; d/=g; return d===1?num(n):(n<0?M:"")+fr(Math.abs(n),d); };
const XY=(x,y)=>`${V("x")} = ${num(x)}, ${V("y")} = ${num(y)}`;
const DEG=v=>`${v}°`;

/* ---------- A(1) 式の計算 ---------- */
function polyAdd(){ const a1=NZ(-7,7),b1=NZ(-7,7),a2=NZ(-7,7),b2=NZ(-7,7),sub=Math.random()<.6,s=sub?-1:1; const A=a1+s*a2,B=b1+s*b2; if(!A||!B) return polyAdd();
  const P=(a,b)=>poly([[a,"a"],[b,"b"]]); const q=`(${P(a1,b1)}) ${sub?M:"+"} (${P(a2,b2)})`; const ans=P(A,B);
  const L=[{v:sub?P(a1+a2,b1+b2):null,why:"ひくときは、うしろのかっこの中の符号をすべて変えます。"},{v:sub?P(a1-a2,b1+b2):null,why:`うしろのかっこの ${V("b")} の項の符号も変えます。`},{v:A+B?mono(A+B,"ab"):null,why:`${V("a")} と ${V("b")} は文字がちがうので、1つにまとめられません。`},{v:P(A,-B),why:`${V("b")} の項の符号を確かめよう。`},{v:P(-A,-B),why:"符号を確かめよう。"}];
  return {q,ans,wrongs:W(ans,L),exp:`${V("a")} の項：${num(a1)} ${sub?M:"+"} ${par(a2)} = ${num(A)}、${V("b")} の項：${num(b1)} ${sub?M:"+"} ${par(b2)} = ${num(B)}`,tf:v=>`${q} = ${v}`,kind:"expr"}; }
function polyNum(){ const t=pick([0,1,2]); const P=(a,b)=>poly([[a,"x"],[b,"y"]]);
  if(t===0){ const k=NZ(-5,5),a=NZ(-5,5),b=NZ(-5,5); if(Math.abs(k)===1) return polyNum(); const q=`${num(k)}(${P(a,b)})`, ans=P(k*a,k*b);
    return {q,ans,wrongs:W(ans,[{v:P(k*a,b),why:`${V("y")} の項にも ${num(k)} をかけます。`},{v:P(k*a,-k*b),why:"かけ算の符号を確かめよう。"},{v:P(k+a,k+b),why:"かっこの外の数は、中の各項に「かけ」ます。"},{v:P(-k*a,-k*b),why:"符号を確かめよう。"}]),exp:`${num(k)}×${par(a)}${V("x")} + ${par(k)}×${par(b)}${V("y")} = ${ans}`,tf:v=>`${q} = ${v}`,kind:"expr"}; }
  if(t===1){ const k=NZ(-4,4),a=NZ(-5,5),b=NZ(-5,5); if(Math.abs(k)===1) return polyNum(); const q=`(${P(k*a,k*b)}) ÷ ${par(k)}`, ans=P(a,b);
    return {q,ans,wrongs:W(ans,[{v:P(a,k*b),why:`${V("y")} の項も ${num(k)} でわります。`},{v:P(k*k*a,k*k*b),why:"わり算です。かけていませんか？"},{v:P(a,-b),why:"わり算の符号を確かめよう。"},{v:P(-a,-b),why:"符号を確かめよう。"}]),exp:`${mono(k*a,"x")}÷${par(k)} ${k*b<0?M:"+"} ${mono(Math.abs(k*b),"y")}÷${par(k)} = ${ans}`,tf:v=>`${q} = ${v}`,kind:"expr"}; }
  const c1=R(2,4),c2=R(2,4),a1=NZ(-4,4),b1=NZ(-4,4),a2=NZ(-4,4),b2=NZ(-4,4); const A=c1*a1-c2*a2,B=c1*b1-c2*b2; if(!A||!B) return polyNum();
  const q=`${c1}(${P(a1,b1)}) ${M} ${c2}(${P(a2,b2)})`, ans=P(A,B);
  return {q,ans,wrongs:W(ans,[{v:P(A,c1*b1+c2*b2),why:"うしろのかっこの2つ目の項も、符号を変えます。"},{v:P(A,c1*b1-b2),why:`うしろのかっこの2つ目の項にも ${c2} をかけます。`},{v:P(c1*a1+c2*a2,c1*b1+c2*b2),why:"ひき算なので、うしろのかっこの符号はすべて変わります。"},{v:P(-A,-B),why:"符号を確かめよう。"}]),exp:`${poly([[c1*a1,"x"],[c1*b1,"y"]])} ${M} (${poly([[c2*a2,"x"],[c2*b2,"y"]])}) = ${ans}`,tf:v=>`${q} = ${v}`,kind:"expr"}; }
function monoMD(){ const t=pick([0,1,2,3]); const big=a=>Math.abs(a)>1;
  if(t===0){ const p=NZ(-6,6),q=NZ(-6,6); if(!big(p)||!big(q)) return monoMD(); const Q0=`${mono(p,"a")} × ${pm(q,"b")}`, ans=mono(p*q,"ab");
    return {q:Q0,ans,wrongs:W(ans,[{v:p+q?mono(p+q,"ab"):null,why:"係数どうしはかけ算です。"},{v:poly([[p,"a"],[q,"b"]]),why:"かけ算なので、係数どうし・文字どうしをかけて1つの項にします。"},{v:mono(-p*q,"ab"),why:"符号を確かめよう。"}]),exp:`${num(p)}×${par(q)}×${V("a")}×${V("b")} = ${ans}`,tf:v=>`${Q0} = ${v}`,kind:"expr"}; }
  if(t===1){ const p=NZ(-6,6),q=NZ(-6,6); if(!big(p)||!big(q)) return monoMD(); const Q0=`${mono(p,"a")} × ${pm(q,"a")}`, ans=mono(p*q,"a²");
    return {q:Q0,ans,wrongs:W(ans,[{v:mono(p*q,"a"),why:`${V("a")}×${V("a")} = ${V("a²")} です。`},{v:mono(2*p*q,"a"),why:`${V("a")}×${V("a")} は ${V("a")} を2回かけた ${V("a²")}（2${V("a")} ではありません）。`},{v:p+q?mono(p+q,"a²"):null,why:"係数どうしはかけ算です。"},{v:mono(-p*q,"a²"),why:"符号を確かめよう。"}]),exp:`${num(p)}×${par(q)}×${V("a")}×${V("a")} = ${ans}`,tf:v=>`${Q0} = ${v}`,kind:"expr"}; }
  if(t===2){ const k=NZ(-6,6),q=NZ(-5,5); if(!big(k)||!big(q)) return monoMD(); const Q0=`${mono(k*q,"ab")} ÷ ${pm(q,"a")}`, ans=mono(k,"b");
    return {q:Q0,ans,wrongs:W(ans,[{v:mono(k,"ab"),why:`${V("a")} どうしもわります（${V("a")}÷${V("a")} = 1）。`},{v:mono(k*q*q,"ab"),why:"わり算です。かけていませんか？"},{v:mono(-k,"b"),why:"わり算の符号を確かめよう。"},{v:mono(k*q*q,"b"),why:"係数も、わり算で求めます。"}]),exp:`${fr(mono(k*q,"ab"),mono(q,"a"))} = ${ans}`,tf:v=>`${Q0} = ${v}`,kind:"expr"}; }
  const p=NZ(-5,5); if(!big(p)) return monoMD(); const Q0=`(${mono(p,"a")})²`, ans=mono(p*p,"a²");
  return {q:Q0,ans,wrongs:W(ans,[{v:mono(p,"a²"),why:"係数も2乗します。"},{v:mono(2*p,"a"),why:"2乗は2倍ではありません。同じものを2回かけます。"},{v:mono(-p*p,"a²"),why:p<0?"負の数の2乗は正の数です。":"符号を確かめよう。"},{v:mono(p*p,"a"),why:`${V("a")} も2乗します。`}]),exp:`${pm(p,"a")}×${pm(p,"a")} = ${ans}`,tf:v=>`${Q0} = ${v}`,kind:"expr"}; }
function sub2(){ const x=NZ(-4,4),y=NZ(-4,4); const pre=`${V("a")} = ${num(x)}, ${V("b")} = ${num(y)} のとき、`;
  if(Math.random()<.5){ const c1=NZ(-5,5),c2=NZ(-5,5); const e=poly([[c1,"a"],[c2,"b"]]); const ans=c1*x+c2*y;
    return {q:`${pre}${e} の値`,ans:num(ans),wrongs:W(ans,[{v:c1*x-c2*y,why:`符号に注意。${num(c2)}×${par(y)} を計算します。`},{v:c1*y+c2*x,why:`${V("a")} と ${V("b")} に代入する数を取りちがえていませんか？`},{v:c1+x+c2+y,why:"係数と文字の間はかけ算です。"}],ans),exp:`${num(c1)}×${par(x)} + ${par(c2)}×${par(y)} = ${num(ans)}`,tf:v=>`${pre}${e} = ${v}`,kind:"sub"}; }
  const k=NZ(-3,3),m=NZ(-3,3); if(Math.abs(m)<2) return sub2(); const e=`${mono(k*m,"a²b")} ÷ ${pm(m,"a")}`; const ans=k*x*y;
  return {q:`${pre}${e} の値`,ans:num(ans),wrongs:W(ans,[{v:k*m*x*x*y,why:`÷ ${pm(m,"a")} を忘れています。`},{v:k*x*x*y,why:`${V("a²")}÷${V("a")} = ${V("a")} です。`},{v:-ans,why:"符号を確かめよう。"}],ans),exp:`先に式を簡単にすると ${mono(k,"ab")}。代入して ${num(k)}×${par(x)}×${par(y)} = ${num(ans)}`,tf:v=>`${pre}${e} = ${v}`,kind:"sub"}; }
function trans(){ const t=pick([0,0,1,2,3]);
  if(t===0){ const a=NZ(-5,5),c=NZ(-9,9),s=pick([1,-1]); const lhs=poly([[a,"x"],[s,"y"]]); const q=`${lhs} = ${num(c)} を ${V("y")} について解くと？`;
    const Y=(p,r)=>`${V("y")} = ${poly([[p,"x"],[r,""]])}`; const A=-s*a,C=s*c,ans=Y(A,C);
    return {q,ans,wrongs:W(ans,[{v:Y(-A,C),why:`${V("x")} の項を移項すると、符号が変わります。`},{v:Y(-A,-C),why:s<0?`${M}${V("y")} = … のあと、両辺に ${M}1 をかけるのを忘れています。`:"符号を確かめよう。"},{v:Y(A,-C),why:"数の項の符号を確かめよう。"}]),exp:s>0?`${mono(a,"x")} を右辺に移項 → ${ans}`:`${mono(a,"x")} を移項して ${M}${V("y")} = ${poly([[-a,"x"],[c,""]])} → 両辺に ${M}1 をかける → ${ans}`,tf:v=>`${lhs} = ${num(c)} を ${V("y")} について解くと ${v}`,kind:"trans"}; }
  if(t===1){ const L0=V("ℓ"),a=V("a"),b=V("b"); const q=`${L0} = 2(${a} + ${b}) を ${a} について解くと？`; const ans=`${a} = ${fr(L0,2)} ${M} ${b}`;
    return {q,ans,wrongs:[{v:`${a} = ${fr(`${L0} ${M} ${b}`,2)}`,why:`両辺を2でわると ${fr(L0,2)} = ${a} + ${b}。${b} は2でわられません。`},{v:`${a} = ${L0} ${M} 2${b}`,why:`${L0} ${M} 2${b} = 2${a} なので、最後に2でわります。`},{v:`${a} = 2${L0} ${M} ${b}`,why:"両辺を2で「わり」ます。"},{v:`${a} = ${fr(L0,2)} + ${b}`,why:"移項すると符号が変わります。"}],exp:`両辺を2でわる → ${fr(L0,2)} = ${a} + ${b} → ${ans}`,tf:v=>`${q.replace(" を "+a+" について解くと？","")} を ${a} について解くと ${v}`,kind:"trans"}; }
  if(t===2){ const [S,a,h,nm]=pick([["S","a","h","平行四辺形の面積"],["V","S","h","柱の体積"],["ℓ","r","π","円周"]].slice(0,2)); const q=`${V(S)} = ${V(a)}${V(h)} を ${V(h)} について解くと？`; const ans=`${V(h)} = ${fr(V(S),V(a))}`;
    return {q,ans,wrongs:[{v:`${V(h)} = ${V(S)} ${M} ${V(a)}`,why:"かけ算の式なので、わり算で解きます。"},{v:`${V(h)} = ${fr(V(a),V(S))}`,why:`両辺を ${V(a)} でわります。わる順番が反対です。`},{v:`${V(h)} = ${V(S)}${V(a)}`,why:`両辺を ${V(a)} で「わり」ます。`}],exp:`両辺を ${V(a)} でわる → ${ans}（${nm}の式）`,tf:v=>`${V(S)} = ${V(a)}${V(h)} を ${V(h)} について解くと ${v}`,kind:"trans"}; }
  const q=`${V("V")} = ${fr(1,3)}${V("S")}${V("h")} を ${V("h")} について解くと？`, ans=`${V("h")} = ${fr("3"+V("V"),V("S"))}`;
  return {q,ans,wrongs:[{v:`${V("h")} = ${fr(V("V"),"3"+V("S"))}`,why:`両辺に3をかけてから ${V("S")} でわります。`},{v:`${V("h")} = ${fr("3"+V("S"),V("V"))}`,why:"わる順番が反対です。"},{v:`${V("h")} = 3${V("V")} ${M} ${V("S")}`,why:"かけ算の式なので、わり算で解きます。"}],exp:`両辺に3をかける → 3${V("V")} = ${V("S")}${V("h")} → ${ans}（錐の体積の式）`,tf:v=>`${V("V")} = ${fr(1,3)}${V("S")}${V("h")} を ${V("h")} について解くと ${v}`,kind:"trans"}; }

/* ---------- A(2) 連立方程式 ---------- */
const sysH=(e1,e2)=>`<span class="sys"><span>① ${e1}</span><span>② ${e2}</span></span>`;
const E2=(a,b,c)=>`${poly([[a,"x"],[b,"y"]])} = ${num(c)}`;
function sysW(x,y,a1,b1,a2,b2){ const g1=gcd(a1,b1)||1,g2=gcd(a2,b2)||1;
  return W(XY(x,y),[{v:XY(x+b1/g1,y-a1/g1),why:"①にはあてはまりますが、②にあてはまりません。両方にあてはまる組が解です。"},{v:XY(y,x),why:`${V("x")} と ${V("y")} の値を取りちがえていませんか？`},{v:XY(x,-y),why:`求めた ${V("x")} を代入して ${V("y")} を出すとき、符号に注意。`},{v:XY(x+b2/g2,y-a2/g2),why:"②にはあてはまりますが、①にあてはまりません。"},{v:XY(-x,y),why:"式をたす・ひくときの符号を確かめよう。"}]); }
function sysQ(x,y,a1,b1,a2,b2,exp,e1,e2){ const c1=a1*x+b1*y,c2=a2*x+b2*y; e1=e1||E2(a1,b1,c1); e2=e2||E2(a2,b2,c2); const S=sysH(e1,e2);
  return {q:S,ans:XY(x,y),wrongs:sysW(x,y,a1,b1,a2,b2),exp,tf:v=>`${S}<br>の解は ${v}`,kind:"sys"}; }
function sys1(){ const x=NZ(-5,5),y=NZ(-5,5); const ey=Math.random()<.6; let a1=NZ(-4,4),b1=NZ(-4,4),a2,b2;
  if(ey){ b2=pick([b1,-b1]); a2=NZ(-4,4); } else { a2=pick([a1,-a1]); b2=NZ(-4,4); }
  if(a1*b2-a2*b1===0) return sys1(); const c1=a1*x+b1*y,c2=a2*x+b2*y;
  const add=ey?b2===-b1:a2===-a1, op=add?"+":M; const k=add?1:-1;
  const exp=ey?`①${op}②で ${V("y")} を消す → ${mono(a1+k*a2,"x")} = ${num(c1+k*c2)} → ${V("x")} = ${num(x)}。①に代入して ${V("y")} = ${num(y)}`:`①${op}②で ${V("x")} を消す → ${mono(b1+k*b2,"y")} = ${num(c1+k*c2)} → ${V("y")} = ${num(y)}。①に代入して ${V("x")} = ${num(x)}`;
  return sysQ(x,y,a1,b1,a2,b2,exp); }
function sys2(){ const x=NZ(-4,4),y=NZ(-4,4),a1=NZ(-5,5),b1=NZ(-5,5),a2=NZ(-5,5),b2=NZ(-5,5);
  if(Math.abs(a1)===Math.abs(a2)||Math.abs(b1)===Math.abs(b2)||a1*b2-a2*b1===0) return sys2(); if(Math.max(Math.abs(a1*x+b1*y),Math.abs(a2*x+b2*y))>30) return sys2();
  const L=Math.abs(b1*b2)/gcd(b1,b2), m1=L/Math.abs(b1), m2=L/Math.abs(b2), op=Math.sign(b1)===Math.sign(b2)?"ひく":"たす";
  const exp=`${V("y")} の係数をそろえる：${m1===1?"①はそのまま":"①×"+m1}、${m2===1?"②はそのまま":"②×"+m2} で ${V("y")} の係数の大きさを ${L} にして${op} → ${V("x")} = ${num(x)}。代入して ${V("y")} = ${num(y)}`;
  return sysQ(x,y,a1,b1,a2,b2,exp); }
function sys3(){ const x=NZ(-4,4),y=NZ(-5,5),m=NZ(-4,4),n=y-m*x,a2=NZ(-5,5),b2=NZ(-4,4); if(a2+b2*m===0||Math.abs(n)>12) return sys3();
  const e1=`${V("y")} = ${poly([[m,"x"],[n,""]])}`; const c2=a2*x+b2*y;
  const exp=`①を②に代入：${mono(a2,"x")} ${b2<0?M:"+"} ${Math.abs(b2)===1?"":Math.abs(b2)}(${poly([[m,"x"],[n,""]])}) = ${num(c2)} → ${V("x")} = ${num(x)}。①に代入して ${V("y")} = ${num(y)}`;
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
  const NM={dou:"同位角",saku:"錯角",tai:"対頂角"}; const WHY={dou:"同位角は、2本の直線に1本の直線が交わってできる角のうち、同じ位置にある角です。",saku:"錯角は、2本の直線の内側で、ななめに向かい合う角です。",tai:"対頂角は、2本の直線が交わってできる、向かい合う角です。"};
  if(ty!=="dous"&&Math.random()<.35){ const f=parFig(th,[[...A,"ア"],[...B,"イ"]]);
    return {q:`∠ア と ∠イ の関係は？${f}`,ans:NM[ty],wrongs:[...Object.keys(NM).filter(k=>k!==ty).map(k=>({v:NM[k],why:WHY[ty]})),{v:"同じ大きさとはかぎらない角",why:WHY[ty]}],exp:WHY[ty],tf:v=>`∠ア と ∠イ は${v}${f}`,kind:"fig"}; }
  const a=val[A[1]],ans=val[B[1]]; const f=parFig(th,[[...A,DEG(a)],[...B,`<tspan font-style="italic">x</tspan>`]]);
  const eqWhy=ty==="dous"?`${V("x")} と ${a}° をたすと 180° になります（同位角や錯角を使って移してみよう）。`:`${NM[ty]}は等しくなります。`;
  return {q:`ℓ∥m のとき、∠${V("x")} の大きさは？${f}`,ans:DEG(ans),wrongs:[{v:DEG(180-ans),why:eqWhy},{v:"90°",why:"直角とはかぎりません。等しい角や、一直線（180°）を使って求めます。"},{v:DEG(360-ans),why:"一直線の角は 180° です（360° は1周）。"}],exp:ty==="dous"?`同位角で移すと、${V("x")} と ${a}° は一直線にならぶ → 180 ${M} ${a} = ${ans}`:`${NM[ty]}は等しい${ty==="tai"?"":"（ℓ∥m）"} → ${ans}°`,tf:v=>`ℓ∥m のとき、∠${V("x")} = ${v}${f}`,kind:"fig"}; }
function triFig(la,lb,lc,ext){ return SV(270,150,`<polygon points="110,20 30,130 190,130" class="f1"/>${ext?`<line x1="190" y1="130" x2="262" y2="130" class="ax"/>`:""}<text x="104" y="15" class="lb">A</text><text x="16" y="142" class="lb">B</text><text x="186" y="146" class="lb">C</text>
  <text x="110" y="54" class="lb" text-anchor="middle">${la}</text><text x="58" y="122" class="lb" text-anchor="middle">${lb}</text><text x="${ext?220:166}" y="122" class="lb" text-anchor="middle">${lc}</text>`); }
const XI=`<tspan font-style="italic">x</tspan>`;
function triAng(){ const t=pick(["in","ex","rev"]); const a=5*R(5,16),b=5*R(5,16); if(a+b>=160) return triAng();
  if(t==="in"){ const ans=180-a-b, f=triFig(DEG(a),DEG(b),XI,false); return {q:`∠${V("x")} の大きさは？${f}`,ans:DEG(ans),wrongs:W(DEG(ans),[{v:DEG(a+b),why:"それは∠C の外角です。三角形の内角の和は 180°。"},{v:DEG(180-a),why:"内角は3つ。180° から2つの角をひきます。"},{v:DEG(360-a-b),why:"三角形の内角の和は 180° です（360° は四角形）。"}]),exp:`180 ${M} ${a} ${M} ${b} = ${ans}`,tf:v=>`∠${V("x")} = ${v}${f}`,kind:"fig"}; }
  if(t==="ex"){ const ans=a+b, f=triFig(DEG(a),DEG(b),XI,true); return {q:`∠${V("x")}（∠C の外角）の大きさは？${f}`,ans:DEG(ans),wrongs:W(DEG(ans),[{v:DEG(180-a-b),why:"それは∠C（内角）です。外角は、となり合わない2つの内角の和。"},{v:DEG(180-a),why:"外角 = となり合わない2つの内角の和（∠A + ∠B）。"},{v:DEG(360-a-b),why:"外角 = ∠A + ∠B で求めます。"}]),exp:`三角形の外角は、となり合わない2つの内角の和：${a} + ${b} = ${ans}`,tf:v=>`∠${V("x")} = ${v}${f}`,kind:"fig"}; }
  const ex=a+b, f=triFig(DEG(a),XI,DEG(ex),true); return {q:`∠${V("x")} の大きさは？（${ex}° は∠C の外角）${f}`,ans:DEG(b),wrongs:W(DEG(b),[{v:DEG(ex+a),why:`外角 = ∠A + ∠B なので、∠B = ${ex} ${M} ${a}。`},{v:DEG(180-ex),why:"それは∠C（内角）です。"},{v:DEG(180-ex-a>0?180-ex-a:180-a),why:"外角 = となり合わない2つの内角の和、を使います。"}]),exp:`${ex} = ${a} + ${V("x")} → ${V("x")} = ${b}`,tf:v=>`∠${V("x")} = ${v}${f}`,kind:"fig"}; }
function polyAng(){ const t=pick(["sum","one","ext","rev"]); const RN=[5,6,8,9,10,12];
  if(t==="sum"){ const n=R(5,12),ans=180*(n-2); return {q:`${n}角形の内角の和は？`,ans:DEG(ans),wrongs:W(DEG(ans),[{v:DEG(180*n),why:`${n}角形は、1つの頂点から対角線をひくと (${n}${M}2) 個の三角形に分けられます。`},{v:DEG(360),why:"360° は外角の和です。"},{v:DEG(180*(n-1)),why:`三角形の数は ${n}${M}2 個です。`},{v:DEG(180*(n-3)),why:`三角形の数は ${n}${M}2 個です。`}]),exp:`180×(${n} ${M} 2) = ${ans}`,tf:v=>`${n}角形の内角の和は ${v}`,kind:"word"}; }
  const n=pick(RN);
  if(t==="one"){ const ans=180*(n-2)/n; return {q:`正${n}角形の1つの内角は？`,ans:DEG(ans),wrongs:W(DEG(ans),[{v:DEG(360/n),why:"それは1つの外角です。"},{v:DEG(180*(n-2)),why:`それは内角の和です。最後に ${n} でわります。`},{v:DEG(360*(n-2)/n),why:"三角形1つの内角の和は 180° です。"}]),exp:`180×(${n} ${M} 2)÷${n} = ${ans}（または 180 ${M} 360÷${n}）`,tf:v=>`正${n}角形の1つの内角は ${v}`,kind:"word"}; }
  if(t==="ext"){ const ans=360/n; return {q:`正${n}角形の1つの外角は？`,ans:DEG(ans),wrongs:W(DEG(ans),[{v:DEG(180*(n-2)/n),why:"それは1つの内角です。"},{v:DEG(360),why:"それは外角の和です。"},{v:Number.isInteger(180/n)?DEG(180/n):DEG(180*(n-2)),why:"多角形の外角の和は 360° です。"}]),exp:`外角の和は 360° → 360÷${n} = ${ans}`,tf:v=>`正${n}角形の1つの外角は ${v}`,kind:"word"}; }
  const e=360/n,ans=`正${n}角形`; return {q:`1つの外角が ${e}° の正多角形は？`,ans,wrongs:W(ans,[{v:Number.isInteger(180/e)&&180/e>=3?`正${180/e}角形`:null,why:"外角の和は 360° です（180° ではありません）。"},{v:`正${n+1}角形`,why:`360÷${e} で求めます。`},{v:`正${n-1}角形`,why:`360÷${e} で求めます。`},{v:`正${2*n}角形`,why:`360÷${e} で求めます。`}]),exp:`360÷${e} = ${n}`,tf:v=>`1つの外角が ${e}° の正多角形は ${v}`,kind:"word"}; }
const congB=bank([
 ["三角形の合同条件で「ない」ものは？","3つの角がそれぞれ等しい",[["3組の辺がそれぞれ等しい","これは合同条件です。"],["2組の辺とその間の角がそれぞれ等しい","これは合同条件です。"],["1組の辺とその両端の角がそれぞれ等しい","これは合同条件です。"]],"3つの角が等しくても、大きさがちがうことがある（合同とはいえない）"],
 ["AB=DE、BC=EF、CA=FD のとき △ABC≡△DEF。使った合同条件は？","3組の辺がそれぞれ等しい",[["2組の辺とその間の角がそれぞれ等しい","角の条件は使っていません。"],["1組の辺とその両端の角がそれぞれ等しい","角の条件は使っていません。"],["3つの角がそれぞれ等しい","これは合同条件ではありません。"]],"等しいのは辺が3組 → 3組の辺がそれぞれ等しい"],
 ["AB=DE、BC=EF、∠B=∠E のとき △ABC≡△DEF。使った合同条件は？","2組の辺とその間の角がそれぞれ等しい",[["3組の辺がそれぞれ等しい","等しいとわかっている辺は2組です。"],["1組の辺とその両端の角がそれぞれ等しい","等しい角は1組です。"],["3つの角がそれぞれ等しい","これは合同条件ではありません。"]],"∠B は辺AB と辺BC の間の角"],
 ["BC=EF、∠B=∠E、∠C=∠F のとき △ABC≡△DEF。使った合同条件は？","1組の辺とその両端の角がそれぞれ等しい",[["2組の辺とその間の角がそれぞれ等しい","等しい辺は1組です。"],["3組の辺がそれぞれ等しい","等しい辺は1組です。"],["3つの角がそれぞれ等しい","これは合同条件ではありません。"]],"∠B と ∠C は辺BC の両端の角"],
 ["AB=DE、BC=EF、∠A=∠D のとき、△ABC と △DEF は？","合同とはいえない",[["2組の辺とその間の角で合同","∠A は辺AB と辺BC の間の角ではありません（間の角は∠B）。"],["3組の辺で合同","等しい辺は2組しかわかっていません。"],["1組の辺とその両端の角で合同","等しい角は1組しかわかっていません。"]],"等しい角が、等しい2辺の「間の角」ではない"],
 ["△ABC と △DEF が合同であることを表す記号は？","≡",[["=","= は長さや角の大きさが等しいときに使います。"],["∽","∽ は相似の記号です（中3で学習）。"],["∥","∥ は平行の記号です。"]],"合同は ≡"],
 ["△ABC≡△DEF のとき、辺BC に対応する辺は？","辺EF",[["辺DE","対応する頂点の順に書くので、B↔E、C↔F です。"],["辺DF","対応する頂点の順に書くので、B↔E、C↔F です。"],["辺AC","対応する辺は △DEF の中にあります。"]],"A↔D、B↔E、C↔F の順に対応"],
 ["△ABC≡△DEF のとき、∠C に等しい角は？","∠F",[["∠D","対応する頂点の順に書くので、C↔F です。"],["∠E","対応する頂点の順に書くので、C↔F です。"],["∠A","対応する角は △DEF の中にあります。"]],"A↔D、B↔E、C↔F の順に対応"],
]);
const proofB=bank([
 ["「AならばB」の、A の部分を何という？","仮定",[["結論","結論は B の部分です。"],["定義","定義は、言葉の意味をはっきり述べたものです。"],["定理","定理は、証明されたことがらのうち大切なものです。"]],"A が仮定、B が結論"],
 ["「AならばB」の、B の部分を何という？","結論",[["仮定","仮定は A の部分です。"],["定義","定義は、言葉の意味をはっきり述べたものです。"],["逆","逆は「BならばA」のことです。"]],"A が仮定、B が結論"],
 ["言葉の意味をはっきり述べたものを何という？","定義",[["定理","定理は、証明されたことがらのうち大切なものです。"],["仮定","仮定は「AならばB」の A の部分です。"],["反例","反例は、ことがらが正しくないことを示す例です。"]],"例：二等辺三角形の定義は「2つの辺が等しい三角形」"],
 ["証明されたことがらのうち、よく使われる大切なものを何という？","定理",[["定義","定義は、言葉の意味をはっきり述べたものです。"],["結論","結論は「AならばB」の B の部分です。"],["逆","逆は「BならばA」のことです。"]],"例：「二等辺三角形の底角は等しい」は定理"],
 ["「x = 2 ならば x² = 4」の逆は？","x² = 4 ならば x = 2",[["x = 2 ならば x² = 4","それはもとのことがらです。"],["x ≠ 2 ならば x² ≠ 4","逆は、仮定と結論を入れかえたものです。"],["x² ≠ 4 ならば x ≠ 2","逆は、仮定と結論を入れかえたものです。"]],"仮定と結論を入れかえる。この逆は正しくない（反例 x = −2）"],
 ["ことがらが正しくないことを示す例を何という？","反例",[["逆","逆は、仮定と結論を入れかえたものです。"],["定義","定義は、言葉の意味をはっきり述べたものです。"],["仮定","仮定は「AならばB」の A の部分です。"]],"反例が1つでもあれば、そのことがらは正しくない"],
 ["「△ABC≡△DEF ならば AB = DE」の逆は？","正しくない（反例がある）",[["正しい（いつも成り立つ）","AB = DE だけでは、合同とはいえません。"],["もとのことがらと同じ","逆は、仮定と結論を入れかえたものです。"],["逆は考えられない","「AB = DE ならば △ABC≡△DEF」が逆です。"]],"逆が正しいとはかぎらない"],
 ["証明で、すでに正しいと認められていることがらとして使えないものは？","図を見て等しそうな長さ",[["対頂角は等しい","これは正しいと認められたことがらです。"],["平行線の錯角は等しい","これは正しいと認められたことがらです。"],["三角形の合同条件","これは正しいと認められたことがらです。"]],"見た目は根拠にならない"],
]);

/* ---------- B(2) 三角形と四角形 ---------- */
function isoFig(la,lb,lc){ const tick=(x,y)=>`<line x1="${x-5}" y1="${y-4}" x2="${x+5}" y2="${y+4}" class="ax"/>`;
  return SV(220,150,`<polygon points="110,15 40,135 180,135" class="f1"/>${tick(75,75)}${tick(145,75).replace(/x1="(\d+)" y1="(\d+)" x2="(\d+)" y2="(\d+)"/,(m,a,b,c,d)=>`x1="${a}" y1="${d}" x2="${c}" y2="${b}"`)}
  <text x="104" y="11" class="lb">A</text><text x="26" y="146" class="lb">B</text><text x="184" y="146" class="lb">C</text><text x="110" y="52" class="lb" text-anchor="middle">${la}</text><text x="66" y="126" class="lb" text-anchor="middle">${lb}</text><text x="154" y="126" class="lb" text-anchor="middle">${lc}</text>`); }
function isoAng(){ if(Math.random()<.5){ const a=10*R(2,14),ans=(180-a)/2, f=isoFig(DEG(a),XI,"");
    return {q:`AB = AC の二等辺三角形。∠${V("x")} は？${f}`,ans:DEG(ans),wrongs:W(DEG(ans),[{v:DEG(180-a),why:"底角は2つあり、等しい大きさです。(180 − 頂角)÷2 で求めます。"},{v:DEG(a),why:"頂角と底角が等しいとはかぎりません（正三角形のときだけ）。"},{v:DEG(180-2*a>0?180-2*a:180-ans),why:"頂角と底角を取りちがえていませんか？"}]),exp:`二等辺三角形の底角は等しい → (180 ${M} ${a})÷2 = ${ans}`,tf:v=>`∠${V("x")} = ${v}${f}`,kind:"fig"}; }
  const b=5*R(5,17),ans=180-2*b, f=isoFig(XI,"",DEG(b));
  return {q:`AB = AC の二等辺三角形。∠${V("x")} は？${f}`,ans:DEG(ans),wrongs:W(DEG(ans),[{v:DEG(180-b),why:"底角は2つ（∠B と ∠C）あり、等しい大きさです。"},{v:DEG(b),why:"頂角と底角が等しいとはかぎりません。"},{v:Number.isInteger((180-b)/2)?DEG((180-b)/2):DEG(90-b>0?90-b:2*b),why:"∠B = ∠C を使い、180 − 底角×2 で求めます。"}]),exp:`∠B = ∠C = ${b}° → 180 ${M} ${b}×2 = ${ans}`,tf:v=>`∠${V("x")} = ${v}${f}`,kind:"fig"}; }
function paraFig(L){ return SV(270,150,`<polygon points="70,25 30,125 210,125 250,25" class="f1"/><text x="62" y="18" class="lb">A</text><text x="16" y="138" class="lb">B</text><text x="210" y="142" class="lb">C</text><text x="252" y="18" class="lb">D</text>
  <text x="80" y="50" class="lb" text-anchor="middle">${L.A||""}</text><text x="56" y="116" class="lb" text-anchor="middle">${L.B||""}</text><text x="198" y="116" class="lb" text-anchor="middle">${L.C||""}</text><text x="230" y="50" class="lb" text-anchor="middle">${L.D||""}</text>
  <text x="38" y="78" class="nm" text-anchor="end">${L.AB||""}</text><text x="120" y="142" class="nm" text-anchor="middle">${L.BC||""}</text><text x="236" y="80" class="nm">${L.CD||""}</text><text x="160" y="18" class="nm" text-anchor="middle">${L.AD||""}</text>`); }
function paraAng(){ if(Math.random()<.65){ const b=5*R(9,16),V0={A:180-b,B:b,C:180-b,D:b}; const vs=["A","B","C","D"]; const g=pick(vs),ask=pick(vs.filter(x=>x!==g)); const ans=V0[ask];
    const L={}; L[g]=DEG(V0[g]); L[ask]=XI; const f=paraFig(L); const opp={A:"C",B:"D",C:"A",D:"B"}[g]===ask;
    return {q:`平行四辺形ABCD。∠${V("x")} は？${f}`,ans:DEG(ans),wrongs:W(DEG(ans),[{v:DEG(180-ans),why:opp?"平行四辺形の向かい合う角は等しくなります。":"となり合う角の和は 180° です（AD∥BC）。"},{v:"90°",why:"平行四辺形の角は直角とはかぎりません。"},{v:DEG(360-ans),why:"となり合う角の和は 180°、向かい合う角は等しい、を使います。"}]),exp:opp?`向かい合う角は等しい → ${ans}°`:`となり合う角の和は 180° → 180 ${M} ${V0[g]} = ${ans}`,tf:v=>`∠${V("x")} = ${v}${f}`,kind:"fig"}; }
  const p=R(3,9),q=R(4,12); if(p===q) return paraAng(); const ask=pick(["CD","AD"]),ans=ask==="CD"?p:q; const L={AB:p+"cm",BC:q+"cm"}; L[ask]="?"; const f=paraFig(L);
  return {q:`平行四辺形ABCD。辺${ask} の長さは？${f}`,ans:ans+"cm",wrongs:W(ans+"cm",[{v:(ask==="CD"?q:p)+"cm",why:"平行四辺形の向かい合う辺は等しくなります。となりの辺ではありません。"},{v:(p+q)+"cm",why:"向かい合う辺の長さが等しい、を使います。"},{v:2*(p+q)+"cm",why:"それはまわりの長さです。"}]),exp:`向かい合う辺は等しい → ${ask} = ${ask==="CD"?"AB":"BC"} = ${ans}cm`,tf:v=>`辺${ask} = ${v}${f}`,kind:"fig"}; }
function paraCond(){ const good=[["AB∥DC、AD∥BC","2組の向かい合う辺がそれぞれ平行（定義）"],["AB = DC、AD = BC","2組の向かい合う辺がそれぞれ等しい"],["∠A = ∠C、∠B = ∠D","2組の向かい合う角がそれぞれ等しい"],["対角線がそれぞれの中点で交わる","対角線がそれぞれの中点で交わる"],["AB∥DC、AB = DC","1組の向かい合う辺が平行で、その長さが等しい"]];
  const bad=[["AB∥DC、AD = BC","等脚台形のように、平行四辺形にならないことがあります。"],["AB = AD、CB = CD","たこ形のように、平行四辺形にならないことがあります。"],["対角線が垂直に交わる","たこ形のように、平行四辺形にならないことがあります。"],["対角線の長さが等しい","等脚台形のように、平行四辺形にならないことがあります。"],["∠A = ∠B、∠C = ∠D","等脚台形のように、平行四辺形にならないことがあります。"]];
  const [ans,why]=pick(good); const ws=shuffle(bad).slice(0,3).map(([v,w])=>({v,why:w}));
  return {q:"四角形ABCD が必ず平行四辺形になるのは？",ans,wrongs:ws,exp:`平行四辺形になる条件：${why}`,tf:v=>`「${v}」なら、四角形ABCD は必ず平行四辺形`,kind:"word"}; }
const quadB=bank([
 ["長方形の対角線の性質は？","長さが等しい",[["垂直に交わる","それはひし形の対角線の性質です。"],["長さが等しく、垂直に交わる","それは正方形の対角線の性質です。"],["平行である","対角線どうしは交わります。"]],"長方形：対角線の長さが等しい"],
 ["ひし形の対角線の性質は？","垂直に交わる",[["長さが等しい","それは長方形の対角線の性質です。"],["長さが等しく、垂直に交わる","それは正方形の対角線の性質です。"],["平行である","対角線どうしは交わります。"]],"ひし形：対角線が垂直に交わる"],
 ["正方形の対角線の性質は？","長さが等しく、垂直に交わる",[["長さが等しい","正方形はひし形でもあるので、垂直にも交わります。"],["垂直に交わる","正方形は長方形でもあるので、長さも等しくなります。"],["平行である","対角線どうしは交わります。"]],"正方形は長方形とひし形の両方の性質をもつ"],
 ["平行四辺形に「1つの角が直角」を加えると？","長方形",[["ひし形","ひし形は、となり合う辺が等しい平行四辺形です。"],["正方形","正方形にするには、となり合う辺が等しいことも必要です。"],["台形","平行四辺形は、もともと台形の仲間です。"]],"4つの角が等しい → 長方形"],
 ["平行四辺形に「となり合う辺が等しい」を加えると？","ひし形",[["長方形","長方形は、角が直角の平行四辺形です。"],["正方形","正方形にするには、角が直角であることも必要です。"],["台形","平行四辺形は、もともと台形の仲間です。"]],"4つの辺が等しい → ひし形"],
 ["長方形に「となり合う辺が等しい」を加えると？","正方形",[["ひし形","角が直角のままなので、正方形になります。"],["平行四辺形","長方形は、もともと平行四辺形の仲間です。"],["台形","長方形は、もともと台形の仲間です。"]],"4つの角も4つの辺も等しい → 正方形"],
 ["平行四辺形の性質で「ない」ものは？","対角線の長さが等しい",[["2組の向かい合う辺がそれぞれ等しい","これは平行四辺形の性質です。"],["2組の向かい合う角がそれぞれ等しい","これは平行四辺形の性質です。"],["対角線がそれぞれの中点で交わる","これは平行四辺形の性質です。"]],"対角線の長さが等しいのは長方形"],
 ["AD∥BC の台形ABCD で、△ABC と面積が等しい三角形は？","△DBC",[["△ABD","底辺と高さが同じとはかぎりません。"],["△ACD","底辺と高さが同じとはかぎりません。"],["△AOD（O は対角線の交点）","底辺BC が共通で、高さが等しい三角形をさがそう。"]],"底辺BC が共通で、AD∥BC だから高さも等しい"],
 ["AD∥BC の台形ABCD（対角線の交点O）で、△ABO と面積が等しい三角形は？","△DCO",[["△AOD","△ABO と面積が等しいとはかぎりません。"],["△BOC","△ABO と面積が等しいとはかぎりません。"],["△ABD","△ABD は △ABO より大きい三角形です。"]],"△ABC = △DBC から、共通の △OBC をひく"],
]);

/* ---------- C(1) 一次関数 ---------- */
const LF=(p,q,b)=>`${V("y")} = ${coef(p,q)}${V("x")}${b?` ${b<0?M:"+"} ${Math.abs(b)}`:""}`;
function lf1(){ const a=NZ(-5,5),b=NZ(-8,8),p=R(-3,2),d=R(2,5),q=p+d; const pre=`一次関数 ${LF(a,1,b)} で、${V("x")} が ${num(p)} から ${num(q)} まで増加するとき、`;
  if(Math.random()<.5) return {q:`${pre}変化の割合は？`,ans:num(a),wrongs:W(a,[{v:a*d,why:"それは y の増加量です。変化の割合 = y の増加量 ÷ x の増加量。"},{v:b,why:"それは切片（x = 0 のときの y）です。"},{v:a*q+b,why:`それは ${V("x")} = ${num(q)} のときの ${V("y")} の値です。`},{v:-a,why:"符号を確かめよう。"}],a),exp:`一次関数の変化の割合は、いつも ${V("x")} の係数 → ${num(a)}`,tf:v=>`${pre}変化の割合は ${v}`,kind:"word"};
  return {q:`${pre}${V("y")} の増加量は？`,ans:num(a*d),wrongs:W(a*d,[{v:a,why:"それは変化の割合です。y の増加量 = 変化の割合 × x の増加量。"},{v:a*q+b,why:`それは ${V("x")} = ${num(q)} のときの ${V("y")} の値です。`},{v:a*d+b,why:"増加量に切片はたしません。"},{v:-a*d,why:"符号を確かめよう。"}],a*d),exp:`${V("x")} の増加量は ${d} → ${num(a)}×${d} = ${num(a*d)}`,tf:v=>`${pre}${V("y")} の増加量は ${v}`,kind:"word"}; }
function lf2(){ const a=NZ(-5,5),b=NZ(-8,8); if(a===b) return lf2(); const t=pick(["s","i","v"]); const f=LF(a,1,b);
  if(t==="s") return {q:`${f} のグラフの傾きは？`,ans:num(a),wrongs:W(a,[{v:b,why:"それは切片です。傾きは x の係数。"},{v:-a,why:"符号を確かめよう。"}],a),exp:`${V("y")} = ${V("a")}${V("x")} + ${V("b")} の ${V("a")} が傾き → ${num(a)}`,tf:v=>`${f} のグラフの傾きは ${v}`,kind:"word"};
  if(t==="i") return {q:`${f} のグラフの切片は？`,ans:num(b),wrongs:W(b,[{v:a,why:"それは傾きです。切片は数の項。"},{v:-b,why:"符号を確かめよう。"}],b),exp:`${V("y")} = ${V("a")}${V("x")} + ${V("b")} の ${V("b")} が切片 → ${num(b)}`,tf:v=>`${f} のグラフの切片は ${v}`,kind:"word"};
  const x=NZ(-4,4),ans=a*x+b; return {q:`${f} のグラフが点 (${num(x)}, ${V("k")}) を通るとき、${V("k")} は？`,ans:num(ans),wrongs:W(ans,[{v:a+x+b,why:`${num(a)}${V("x")} は ${num(a)}×${V("x")}。たし算ではありません。`},{v:-a*x+b,why:`符号を確かめよう。${num(a)}×${par(x)} を計算します。`},{v:a*x-b,why:"数の項の符号を確かめよう。"}],ans),exp:`${V("x")} = ${num(x)} を代入：${num(a)}×${par(x)} ${b<0?M:"+"} ${Math.abs(b)} = ${num(ans)}`,tf:v=>`${f} のグラフは点 (${num(x)}, ${v}) を通る`,kind:"word"}; }
function lf3(){ const [p,q]=pick([[1,1],[2,1],[3,1],[-1,1],[-2,1],[-3,1],[1,2],[-1,2],[2,3],[-2,3],[3,2],[-3,2]]); const b=NZ(-4,4); if(Math.abs(b+p)>6) return lf3();
  const g=coord({lins:[[p,q,b]],pts:[[0,b,""],[q,b+p,""]]}); const ans=LF(p,q,b);
  const L=[{v:LF(p,q,-b),why:"切片は、グラフが y 軸と交わる点の y 座標です。"},{v:LF(-p,q,b),why:"右上がりなら傾きは正、右下がりなら負です。"},{v:Math.abs(p)!==q?LF(q*Math.sign(p),Math.abs(p),b):null,why:"傾き = y の増加量 ÷ x の増加量。わる順番が反対です。"},{v:q===1&&b!==p?LF(b,1,p):null,why:"傾きと切片が反対です。"},{v:LF(-p,q,-b),why:"傾きと切片の符号を確かめよう。"}];
  return {q:`グラフの式は？${g}`,ans,wrongs:W(ans,L),exp:`切片 ${num(b)}（y 軸との交点）。右へ ${q} 進むと${p>0?"上":"下"}へ ${Math.abs(p)} → 傾き ${q===1?num(p):(p<0?M:"")+fr(Math.abs(p),q)}`,tf:v=>`グラフの式は ${v}${g}`,kind:"fig"}; }
function lf4(){ const a=NZ(-4,4),b=NZ(-6,6),x1=NZ(-3,3),y1=a*x1+b; if(a===b) return lf4();
  if(Math.random()<.5){ const x2=x1+R(1,3),y2=a*x2+b; const q=`2点 ${PAIR(x1,y1)}、${PAIR(x2,y2)} を通る直線の式は？`, ans=LF(a,1,b);
    return {q,ans,wrongs:W(ans,[{v:LF(-a,1,y1-(-a)*x1),why:"傾き = (y の増加量)÷(x の増加量)。ひく順番をそろえよう。"},{v:LF(a,1,y1+a*x1),why:`切片は ${V("b")} = ${V("y")} ${M} ${V("a")}${V("x")} で求めます。符号に注意。`},{v:LF(a,1,y1),why:"通る点の y 座標が切片とはかぎりません（切片は x = 0 のときの y）。"},{v:b!==0?LF(b,1,a):null,why:"傾きと切片が反対です。"}]),exp:`傾き = (${num(y2)} ${M} ${par(y1)})÷(${num(x2)} ${M} ${par(x1)}) = ${num(a)}。${V("b")} = ${num(y1)} ${M} ${par(a)}×${par(x1)} = ${num(b)}`,tf:v=>`${q.replace(" を通る直線の式は？","")} を通る直線の式は ${v}`,kind:"word"}; }
  const q=`傾きが ${num(a)} で、点 ${PAIR(x1,y1)} を通る直線の式は？`, ans=LF(a,1,b);
  return {q,ans,wrongs:W(ans,[{v:LF(a,1,y1+a*x1),why:`${V("b")} = ${V("y")} ${M} ${V("a")}${V("x")} で求めます。符号に注意。`},{v:LF(a,1,y1),why:"通る点の y 座標が切片とはかぎりません。"},{v:LF(a,1,x1),why:"切片は、点の座標を代入して求めます。"},{v:LF(-a,1,b),why:"傾きの符号を確かめよう。"}]),exp:`${num(y1)} = ${num(a)}×${par(x1)} + ${V("b")} → ${V("b")} = ${num(b)}`,tf:v=>`${q.replace("直線の式は？","直線の式は ")}${v}`,kind:"word"}; }
function lf5(){ const x=NZ(-4,4),y=NZ(-5,5),a1=NZ(-3,3),a2=NZ(-3,3); if(a1===a2) return lf5(); const b1=y-a1*x,b2=y-a2*x; if(Math.abs(b1)>9||Math.abs(b2)>9) return lf5();
  const g=coord({lins:[[a1,1,b1],[a2,1,b2,"ln2"]]}); const ans=PAIR(x,y);
  return {q:`2直線 ${LF(a1,1,b1)}、${LF(a2,1,b2)} の交点の座標は？${g}`,ans,wrongs:W(ans,[{v:PAIR(y,x),why:"座標は (x 座標, y 座標) の順に書きます。"},{v:PAIR(0,b1),why:"それは1本目の直線と y 軸の交点です。2つの式を連立方程式として解きます。"},{v:PAIR(x,-y),why:`${V("x")} を代入して ${V("y")} を出すとき、符号に注意。`},{v:PAIR(-x,y),why:"連立方程式を解くときの符号を確かめよう。"}]),exp:`連立方程式として解く：${poly([[a1,"x"],[b1,""]])} = ${poly([[a2,"x"],[b2,""]])} → ${V("x")} = ${num(x)}、${V("y")} = ${num(y)}`,tf:v=>`2直線 ${LF(a1,1,b1)}、${LF(a2,1,b2)} の交点は ${v}${g}`,kind:"fig"}; }

/* ---------- D(1)(2) データの分布と確率 ---------- */
const med=a=>{ const n=a.length; return n%2?a[(n-1)/2]:(a[n/2-1]+a[n/2])/2; };
function quartData(){ const n=R(7,11); const a=Array.from({length:n},()=>R(1,30)).sort((x,y)=>x-y); if(new Set(a).size<n-1) return quartData(); const h=Math.floor(n/2);
  const lo=a.slice(0,h),hi=a.slice(n-h); const Q1=med(lo),Q2=med(a),Q3=med(hi); if(Q1===Q2||Q2===Q3) return quartData();
  return {a,n,Q1,Q2,Q3,lo2:n%2?med(a.slice(0,h+1)):null,hi2:n%2?med(a.slice(h)):null,show:`<span class="dl2">${a.join(", ")}</span>`}; }
function quart(){ const D=quartData(); const t=pick(["Q1","Q2","Q3"]); const NM={Q1:"第1四分位数",Q2:"第2四分位数（中央値）",Q3:"第3四分位数"}; const ans=dec(D[t]);
  const L=t==="Q1"?[{v:dec(D.Q2),why:"それは中央値（第2四分位数）です。第1四分位数は、下半分の中央値。"},{v:D.lo2!=null?dec(D.lo2):null,why:"データの数が奇数のときは、中央値を除いて半分に分けます。"},{v:String(D.a[0]),why:"最小値ではなく、下半分のデータの中央値です。"},{v:dec(D.Q3),why:"それは第3四分位数（上半分の中央値）です。"}]
   :t==="Q3"?[{v:dec(D.Q2),why:"それは中央値（第2四分位数）です。第3四分位数は、上半分の中央値。"},{v:D.hi2!=null?dec(D.hi2):null,why:"データの数が奇数のときは、中央値を除いて半分に分けます。"},{v:String(D.a[D.n-1]),why:"最大値ではなく、上半分のデータの中央値です。"},{v:dec(D.Q1),why:"それは第1四分位数（下半分の中央値）です。"}]
   :[{v:dec((D.a[0]+D.a[D.n-1])/2),why:"最小値と最大値の真ん中ではなく、小さい順に並べた真ん中の値です。"},{v:dec(D.Q1),why:"それは第1四分位数です。"},{v:dec(D.Q3),why:"それは第3四分位数です。"}];
  return {q:`次の ${D.n} 個のデータ（小さい順）の${NM[t]}は？<br>${D.show}`,ans,wrongs:W(ans,L),exp:`中央値 ${dec(D.Q2)}、下半分の中央値 ${dec(D.Q1)}、上半分の中央値 ${dec(D.Q3)}`,tf:v=>`${D.show} の${NM[t]}は ${v}`,kind:"word"}; }
function iqr(){ const D=quartData(); const ans=dec(D.Q3-D.Q1);
  return {q:`次の ${D.n} 個のデータ（小さい順）の四分位範囲は？<br>${D.show}`,ans,wrongs:W(ans,[{v:String(D.a[D.n-1]-D.a[0]),why:"それは範囲（最大値 − 最小値）です。"},{v:dec(D.Q3-D.Q2),why:"四分位範囲 = 第3四分位数 − 第1四分位数。"},{v:dec(D.Q2-D.Q1),why:"四分位範囲 = 第3四分位数 − 第1四分位数。"},{v:dec(D.Q3+D.Q1),why:"ひき算で求めます。"}]),exp:`第1四分位数 ${dec(D.Q1)}、第3四分位数 ${dec(D.Q3)} → ${dec(D.Q3)} ${M} ${dec(D.Q1)} = ${ans}`,tf:v=>`${D.show} の四分位範囲は ${v}`,kind:"word"}; }
function boxFig2(s){ const X=v=>20+v*2.6; let b="";
  for(let v=0;v<=100;v+=10){ b+=`<line x1="${X(v)}" y1="86" x2="${X(v)}" y2="${v%20?90:93}" class="ax"/>`; if(v%20===0) b+=`<text x="${X(v)}" y="106" class="nm" text-anchor="middle">${v}</text>`; b+=`<line x1="${X(v)}" y1="14" x2="${X(v)}" y2="86" class="g"/>`; }
  b+=`<line x1="${X(0)}" y1="86" x2="${X(100)}" y2="86" class="ax"/><text x="${X(100)+16}" y="106" class="nm">(点)</text>`;
  b+=`<line x1="${X(s[0])}" y1="50" x2="${X(s[1])}" y2="50" class="ax"/><line x1="${X(s[3])}" y1="50" x2="${X(s[4])}" y2="50" class="ax"/><line x1="${X(s[0])}" y1="40" x2="${X(s[0])}" y2="60" class="ax"/><line x1="${X(s[4])}" y1="40" x2="${X(s[4])}" y2="60" class="ax"/>`;
  b+=`<rect x="${X(s[1])}" y="30" width="${X(s[3])-X(s[1])}" height="40" class="f1"/><line x1="${X(s[2])}" y1="30" x2="${X(s[2])}" y2="70" class="ln"/>`;
  return SV(332,112,b); }
function boxRead(){ const pool=[]; for(let v=10;v<=95;v+=5) pool.push(v); const s=shuffle(pool).slice(0,5).sort((a,b)=>a-b); const f=boxFig2(s);
  const ST={med:["中央値",s[2],"箱の中の線が中央値です。"],rng:["範囲",s[4]-s[0],"範囲 = 最大値 − 最小値（ひげの両端）。"],iqr:["四分位範囲",s[3]-s[1],"四分位範囲 = 第3四分位数 − 第1四分位数（箱の長さ）。"],q1:["第1四分位数",s[1],"箱の左端が第1四分位数です。"],q3:["第3四分位数",s[3],"箱の右端が第3四分位数です。"]};
  const t=pick(Object.keys(ST)),[nm,val,why]=ST[t]; const ans=val+"点";
  const L=Object.keys(ST).filter(k=>k!==t&&ST[k][1]!==val).map(k=>({v:ST[k][1]+"点",why:`それは${ST[k][0]}です。${why}`})); L.push({v:s[0]+"点",why:`それは最小値です。${why}`},{v:s[4]+"点",why:`それは最大値です。${why}`});
  return {q:`箱ひげ図の${nm}は？${f}`,ans,wrongs:W(ans,L),exp:`最小値 ${s[0]}、第1四分位数 ${s[1]}、中央値 ${s[2]}、第3四分位数 ${s[3]}、最大値 ${s[4]} → ${nm} ${val}`,tf:v=>`箱ひげ図の${nm}は ${v}${f}`,kind:"fig"}; }
function dice(){ const t=pick(["sum","sum","same","ge"]);
  if(t==="same") return {q:"2つのさいころを投げるとき、同じ目が出る確率は？",ans:frc(1,6),wrongs:W(frc(1,6),[{v:frc(1,36),why:"同じ目は (1,1) 〜 (6,6) の6通りあります。"},{v:frc(5,6),why:"それは、ちがう目が出る確率です。"},{v:frc(1,12),why:"全部で 6×6 = 36 通り、そのうち同じ目は6通りです。"}]),exp:`36通りのうち6通り → ${frc(6,36)}`,tf:v=>`2つのさいころで同じ目が出る確率は ${v}`,kind:"word"};
  if(t==="ge"){ const s=R(9,11),cnt=[...Array(13-s)].reduce((acc,_,i)=>acc+6-Math.abs(s+i-7),0); const ans=frc(cnt,36);
    return {q:`2つのさいころを投げるとき、目の和が ${s} 以上になる確率は？`,ans,wrongs:W(ans,[{v:frc(13-s,11),why:"和は 2 〜 12 の11通りですが、どの和も同じように出るわけではありません。"},{v:frc(36-cnt,36),why:`それは和が ${s} 未満になる確率です。`},{v:frc(cnt,6),why:"全部で 6×6 = 36 通りです。"},{v:frc(cnt-1,36),why:"(4,6) と (6,4) は別の出方です。表にして数えよう。"}]),exp:`表にして数えると ${cnt} 通り → ${cnt}/36 = ${ans}`,tf:v=>`2つのさいころで目の和が ${s} 以上になる確率は ${v}`,kind:"word"}; }
  const s=pick([3,4,5,6,8,9,10,11]),cnt=6-Math.abs(s-7),uc=Math.ceil(cnt/2),ans=frc(cnt,36);
  return {q:`2つのさいころを投げるとき、目の和が ${s} になる確率は？`,ans,wrongs:W(ans,[{v:frc(1,11),why:"和は 2 〜 12 の11通りですが、どの和も同じように出るわけではありません。"},{v:uc!==cnt?frc(uc,36):null,why:"(1,2) と (2,1) のように、順番がちがう出方は別に数えます。"},{v:frc(36-cnt,36),why:`それは和が ${s} にならない確率です。`},{v:frc(cnt,6),why:"全部で 6×6 = 36 通りです。"}]),exp:`和が ${s} になるのは ${cnt} 通り → ${cnt}/36 = ${ans}`,tf:v=>`2つのさいころで目の和が ${s} になる確率は ${v}`,kind:"word"}; }
function coin(){ const t=pick(["c2a","c2b","c3a","c3b","c3c","b1","b2"]);
  const C={c2a:["2枚の硬貨を投げるとき、2枚とも表になる確率は？",[1,4],[[1,2],"1枚が表になる確率ではありません。"],[[1,3],"表表・表裏・裏表・裏裏の4通り。表裏と裏表は別です。"],[[3,4],"それは、少なくとも1枚が裏になる確率です。"],"4通りのうち1通り"],
   c2b:["2枚の硬貨を投げるとき、1枚が表、1枚が裏になる確率は？",[1,2],[[1,3],"表裏と裏表は別の出方です（全部で4通り）。"],[[1,4],"表裏と裏表の2通りあります。"],[[3,4],"全部で4通り、そのうち2通りです。"],"表裏・裏表の2通り／4通り"],
   c3a:["3枚の硬貨を投げるとき、3枚とも表になる確率は？",[1,8],[[1,3],"全部で 2×2×2 = 8 通りです。"],[[1,6],"全部で 2×2×2 = 8 通りです。"],[[7,8],"それは、少なくとも1枚が裏になる確率です。"],"8通りのうち1通り"],
   c3b:["3枚の硬貨を投げるとき、少なくとも1枚は表になる確率は？",[7,8],[[1,8],"それは3枚とも裏になる確率です。1 からひきます。"],[[3,8],"「少なくとも1枚」は、1枚・2枚・3枚すべてです。"],[[1,2],"1 − (3枚とも裏の確率) で求めます。"],"1 − 1/8 = 7/8"],
   c3c:["3枚の硬貨を投げるとき、ちょうど2枚が表になる確率は？",[3,8],[[1,8],"表表裏・表裏表・裏表表の3通りあります。"],[[1,4],"全部で8通り、そのうち3通りです。"],[[1,2],"全部で8通り、そのうち3通りです。"],"表表裏・表裏表・裏表表の3通り／8通り"]};
  if(C[t]){ const [q,[n,d],w1,w2,w3,ex]=C[t]; const ans=frc(n,d); return {q,ans,wrongs:[w1,w2,w3].map(([[a,b],why])=>({v:frc(a,b),why})),exp:ex,tf:v=>`${q.replace("確率は？","確率は ")}${v}`,kind:"word"}; }
  const r=R(2,5),w=R(2,4),n=r+w;
  if(t==="b1"){ const ans=frc(r,n),q=`赤玉 ${r} 個、白玉 ${w} 個の袋から1個取り出すとき、赤玉の確率は？`; return {q,ans,wrongs:W(ans,[{v:frc(r,w),why:`全体の個数（${n}個）でわります。`},{v:frc(w,n),why:"それは白玉の確率です。"},{v:frc(1,n),why:`赤玉は ${r} 個あります。`},{v:frc(1,2),why:"赤と白の2通りですが、出やすさが同じではありません。"}]),exp:`${r}÷${n} = ${ans}`,tf:v=>`${q.replace("確率は？","確率は ")}${v}`,kind:"word"}; }
  const c2=k=>k*(k-1)/2, N=c2(n), ans=frc(c2(r),N), q=`赤玉 ${r} 個、白玉 ${w} 個の袋から同時に2個取り出すとき、2個とも赤玉の確率は？`;
  return {q,ans,wrongs:W(ans,[{v:frc(r*r,n*n),why:"同時に取り出すので、同じ玉を2回は取れません。組み合わせを数えます。"},{v:frc(r*w,N),why:"それは赤と白が1個ずつの確率です。"},{v:frc(N-c2(r),N),why:"それは2個とも赤にならない確率です。"},{v:w>=2?frc(c2(w),N):null,why:"それは2個とも白の確率です。"}]),exp:`取り出し方は全部で ${N} 通り、2個とも赤は ${c2(r)} 通り → ${ans}`,tf:v=>`${q.replace("確率は？","確率は ")}${v}`,kind:"word"}; }

/* ========== 単元（学習指導要領 数学 第1学年・第2学年 A 数と式・B 図形・C 関数・D データの活用） ========== */
const units=[
 {id:"int",s:"math",g:"A1",n:{ja:"正の数・負の数","en":"Positive & negative numbers","zh-Hant":"正數・負數"},gr:"1",k:"math",ref:"(1) 正の数・負の数",
  parts:[1,2,3,4,5],pn:{1:"2数の加法・減法",2:"3数以上の加法・減法",3:"乗法・除法",4:"累乗",5:"四則の混じった計算"},sk:{1:[addsub],2:[addsub3],3:[muldiv],4:[power],5:[mixed]}},
 {id:"expr",s:"math",g:"A1",n:{ja:"文字の式","en":"Expressions with letters","zh-Hant":"文字式"},gr:"1",k:"math",ref:"(2) 文字を用いた式",
  parts:[1,2,3,4,5],pn:{1:"文字式の表し方",2:"式の値（代入）",3:"同類項をまとめる",4:"1次式と数の乗法・除法",5:"かっこを外して加減"},sk:{1:[notation],2:[substitute],3:[like],4:[distrib],5:[bracket]}},
 {id:"leq",s:"math",g:"A1",n:{ja:"1次方程式","en":"Linear equations","zh-Hant":"一元一次方程式"},gr:"1",k:"math",ref:"(3) 一元一次方程式",
  parts:[1,2,3,4,5],pn:{1:"x+a=b・ax=b",2:"ax+b=c",3:"両辺に x がある",4:"かっこを含む",5:"比例式"},sk:{1:[eq1],2:[eq2],3:[eq3],4:[eq4],5:[ratio]}},
 {id:"plane",s:"math",g:"B1",n:{ja:"平面図形","en":"Plane figures","zh-Hant":"平面圖形"},gr:"1",k:"math",ref:"B(1) 平面図形",
  parts:[1,2,3],pn:{1:"図形の移動",2:"作図の性質",3:"用語と記号"},sk:{1:[moveFig],2:[construct],3:[symbols]}},
 {id:"solid",s:"math",g:"B1",n:{ja:"空間図形","en":"Solid figures","zh-Hant":"空間圖形"},gr:"1",k:"math",ref:"B(2) 空間図形",
  parts:[1,2,3,4,5],pn:{1:"おうぎ形の弧",2:"おうぎ形の面積",3:"立体の体積",4:"立体の表面積",5:"辺の位置関係"},sk:{1:[arc],2:[sector],3:[volume],4:[surface],5:[position]}},
 {id:"prop",s:"math",g:"C1",n:{ja:"比例と反比例","en":"Proportion & inverse proportion","zh-Hant":"正比與反比"},gr:"1",k:"math",ref:"C(1) 比例、反比例",
  parts:[1,2,3,4,5],pn:{1:"比例の式",2:"反比例の式",3:"座標",4:"グラフと式",5:"比例か反比例か"},sk:{1:[propEq],2:[invEq],3:[coordRead],4:[graphEq],5:[whichRel]}},
 {id:"data",s:"math",g:"D1",n:{ja:"データの活用","en":"Using data","zh-Hant":"資料的運用"},gr:"1",k:"math",ref:"D(1) データの分布・(2) 不確定な事象の起こりやすさ",
  parts:[1,2,3,4,5],pn:{1:"度数分布表",2:"ヒストグラム",3:"相対度数",4:"累積度数",5:"確率（多数回の試行）"},sk:{1:[freq],2:[histRead],3:[relFreq],4:[cumFreq],5:[probTrial]}},
 {id:"calc2",s:"math",g:"A2",n:{ja:"式の計算","en":"Algebraic expressions","zh-Hant":"式的運算"},gr:"2",k:"math",ref:"2年 A(1) 文字を用いた式",
  parts:[1,2,3,4,5],pn:{1:"多項式の加法・減法",2:"多項式と数の乗除",3:"単項式の乗除",4:"式の値",5:"等式の変形"},sk:{1:[polyAdd],2:[polyNum],3:[monoMD],4:[sub2],5:[trans]}},
 {id:"sys",s:"math",g:"A2",n:{ja:"連立方程式","en":"Simultaneous equations","zh-Hant":"聯立方程式"},gr:"2",k:"math",ref:"2年 A(2) 連立二元一次方程式",
  parts:[1,2,3],pn:{1:"加減法",2:"係数をそろえる",3:"代入法"},sk:{1:[sys1],2:[sys2],3:[sys3]}},
 {id:"cong",s:"math",g:"B2",n:{ja:"平行と合同","en":"Parallel lines & congruence","zh-Hant":"平行與全等"},gr:"2",k:"math",ref:"2年 B(1) 基本的な平面図形の性質・B(2) 図形の合同",
  parts:[1,2,3,4,5],pn:{1:"平行線と角",2:"三角形の内角・外角",3:"多角形の角",4:"合同条件",5:"証明のことば"},sk:{1:[angPar],2:[triAng],3:[polyAng],4:[congB],5:[proofB]}},
 {id:"quad",s:"math",g:"B2",n:{ja:"三角形と四角形","en":"Triangles & quadrilaterals","zh-Hant":"三角形與四邊形"},gr:"2",k:"math",ref:"2年 B(2) 図形の合同（三角形・平行四辺形）",
  parts:[1,2,3,4],pn:{1:"二等辺三角形",2:"平行四辺形の性質",3:"平行四辺形になる条件",4:"特別な四角形・面積"},sk:{1:[isoAng],2:[paraAng],3:[paraCond],4:[quadB]}},
 {id:"linf",s:"math",g:"C2",n:{ja:"一次関数","en":"Linear functions","zh-Hant":"一次函數"},gr:"2",k:"math",ref:"2年 C(1) 一次関数",
  parts:[1,2,3,4,5],pn:{1:"変化の割合",2:"傾きと切片",3:"グラフから式",4:"直線の式を求める",5:"2直線の交点"},sk:{1:[lf1],2:[lf2],3:[lf3],4:[lf4],5:[lf5]}},
 {id:"data2",s:"math",g:"D2",n:{ja:"箱ひげ図と確率","en":"Box plots & probability","zh-Hant":"盒狀圖與機率"},gr:"2",k:"math",ref:"2年 D(1) データの分布・D(2) 不確定な事象の起こりやすさ",
  parts:[1,2,3,4,5],pn:{1:"四分位数",2:"四分位範囲",3:"箱ひげ図",4:"確率（さいころ）",5:"確率（硬貨・玉）"},sk:{1:[quart],2:[iqr],3:[boxRead],4:[dice],5:[coin]}},
];
// 問題を作る（変な選択肢や答えが出ないよう、作り直しつき）
function make(fn){ for(let i=0;i<20;i++){ try{ const g=fn(); if(g&&g.wrongs.length>=3&&!g.wrongs.some(w=>w.v===g.ans)) return g; }catch(e){} } return fn(); }
return {units,make};
})();
