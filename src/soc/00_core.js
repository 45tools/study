/* 45 Study 社会：問題をその場で作る（時差・対せき点の数字は毎回かわる）。tools/build.py が src/soc/*.js をつなげて soc.js を作る。
   単元の並び：中学校学習指導要領（平成29年告示）社会 地理的分野 A(1)・B(1)(2)、歴史的分野 B(1)(2)（中1でよく学ぶ範囲：世界と日本の姿 → 世界の諸地域、古代 → 中世）
   ことば：文は "日本語|English|繁體中文" の3つを | でつなげて書き、X() で今の言語を取り出す。簡体字は build.py が soc.js 全体を変換して soc_zh.js を作る。
   gen() が返すもの：{ q:問題, ans:答え, wrongs:[{v,why}], exp:解き方, tf:v=>○×の文, kind } （SCI・MATH と同じ形）
   表から作る問題（TB）は、組み合わせカードの組（PAIRS）とも同じ表を使う。 */
const SOC=(()=>{
const LG=(()=>{ let l=null; try{ l=JSON.parse(localStorage.getItem("s_lang")); }catch(e){} if(!l){ const n=(navigator.language||"ja").toLowerCase(); l=n.startsWith("zh")?"zh":n.startsWith("ja")?"ja":"en"; } return {ja:0,en:1,"zh-Hant":2,zh:2}[l]??1; })();
const X=s=>{ if(typeof s!=="string") return s; const a=s.split("|"); return a.length===3?a[LG]:s; };
const R=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const LET="ABCDEF";
/* 図 */
const SV=(w,h,body)=>`<svg class="fig" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
const T=(x,y,s,c="lb",a="middle")=>`<text x="${x}" y="${y}" class="${c}" text-anchor="${a}">${s}</text>`;
const L=(x1,y1,x2,y2,c="k")=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${c}"/>`;
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
