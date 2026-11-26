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
