/* 45 Study 理科：問題をその場で作る（計算問題の数字は毎回かわる）。tools/build.py が src/sci/*.js をつなげて sci.js を作る。
   単元の並び：中学校学習指導要領（平成29年告示）理科 第1学年（第1分野(1)(2)・第2分野(1)(2)）。教科書の順に 生物 → 物質 → 光・音・力 → 大地
   ことば：文は "日本語|English|繁體中文" の3つを | でつなげて書き、X() で今の言語を取り出す。簡体字は build.py が sci.js 全体を変換して sci_zh.js を作る。
   gen() が返すもの：{ q:問題, ans:答え, wrongs:[{v,why}], exp:解き方, tf:v=>○×の文, kind } （どれもHTML。MATH と同じ形） */
const SCI=(()=>{
const LG=(()=>{ let l=null; try{ l=JSON.parse(localStorage.getItem("s_lang")); }catch(e){} if(!l){ const n=(navigator.language||"ja").toLowerCase(); l=n.startsWith("zh")?"zh":n.startsWith("ja")?"ja":"en"; } return {ja:0,en:1,"zh-Hant":2,zh:2}[l]??1; })();
const X=s=>{ if(typeof s!=="string") return s; const a=s.split("|"); return a.length===3?a[LG]:s; };
const R=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const fm=(n,d=2)=>String(+(+n).toFixed(d));          // 2.70 → "2.7"
const LET="ABCDEF";
const UQ=(ans,ws)=>{ const seen=new Set([String(ans)]); return ws.filter(w=>!seen.has(String(w.v))&&seen.add(String(w.v))); };   // 同じ誤答をのぞく
/* 図 */
const SV=(w,h,body)=>`<svg class="fig" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
const T=(x,y,s,c="lb",a="middle")=>`<text x="${x}" y="${y}" class="${c}" text-anchor="${a}">${s}</text>`;
const L=(x1,y1,x2,y2,c="k")=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${c}"/>`;
// 矢印（先の三角つき）
function AR(x1,y1,x2,y2,c="ar"){ const a=Math.atan2(y2-y1,x2-x1),h=9,w=5; const bx=x2-h*Math.cos(a),by=y2-h*Math.sin(a);
  const p=[[x2,y2],[bx+w*Math.sin(a),by-w*Math.cos(a)],[bx-w*Math.sin(a),by+w*Math.cos(a)]].map(q=>q.map(v=>v.toFixed(1)).join(",")).join(" ");
  return `<line x1="${x1}" y1="${y1}" x2="${bx.toFixed(1)}" y2="${by.toFixed(1)}" class="${c}"/><polygon points="${p}" class="${c==="ar"?"ah":"kf"}"/>`; }
// 引き出し線つきの記号
const TAG=(lx,ly,px,py,s)=>L(lx+(px>lx?8:-8),ly-5,px,py,"k")+T(lx,ly,s);
/* 文の問題：[問題, 答え, [[誤答,理由]×3], 解き方, 図] → 問題を作る関数 */
function Q(q,ans,ws,exp,fig){ return ()=>{ const qq=X(q)+(fig?(typeof fig==="function"?fig():fig):""); return {q:qq,ans:X(ans),wrongs:ws.map(([v,why])=>({v:X(v),why:X(why)})),exp:X(exp),tf:v=>`${qq}<br>→ ${v}`,kind:fig?"fig":"word"}; }; }
// 計算の誤答：答えと同じ・同じ値はのぞき、足りなければ近い数で埋める
function WN(ans,list,unit,step){ const out=[],seen=new Set([fm(ans)]);
  for(const [v,why] of list){ if(v==null||!isFinite(v)||v<=0) continue; const k=fm(v); if(seen.has(k)) continue; seen.add(k); out.push({v:k+unit,why}); }
  for(const d of [1,-1,2,-2,3,-3]){ if(out.length>=3) break; const v=+(ans+d*step).toFixed(3); if(v<=0||seen.has(fm(v))) continue; seen.add(fm(v)); out.push({v:fm(v)+unit,why:X("計算ミスです。下の解き方で確かめよう。|A calculation slip. Check with the steps below.|計算錯誤。用下面的解法確認看看。")}); }
  return out.slice(0,3); }
const C=(q,ans,unit,ws,exp,fig)=>({q:q+(fig||""),ans:fm(ans)+unit,wrongs:WN(ans,ws,unit,Math.max(.1,Math.abs(ans)>=20?Math.round(Math.abs(ans)/10):1)),exp,tf:v=>`${q}${fig||""}<br>→ ${v}`,kind:fig?"fig":"calc"});
// 記号で答える問題の誤答（選んだ記号ごとの理由）
const WL=(ans,whyOf,letters)=>letters.filter(l=>l!==ans).slice(0,3).map(l=>({v:l,why:whyOf(l)}));
// 2つのなかまに分ける（なかま分け）：sets=[名前A,名前B]、items=[[ことば, 0か1, ひとこと]]
function SORT(a,b,items){ return items.map(([w,s,hint])=>()=>{ const A=X(a),B=X(b),ok=s?B:A,ng=s?A:B,ww=X(w);
  const why=X(`「${ww}」は「${ok}」のなかまです。|"${ww}" belongs to "${ok}".|「${ww}」屬於「${ok}」。`)+(hint?" "+X(hint):"");
  const mem=items.filter(x=>x[1]===s).map(x=>X(x[0])).join(X("、|, |、"));
  return {q:`<div class="srt">${ww}</div>`,ans:ok,wrongs:[{v:ng,why}],opts:[A,B],exp:X(`「${ok}」のなかま：|"${ok}": |「${ok}」：`)+mem,sec:6,tf:v=>X(`「${ww}」は「${v}」のなかま|"${ww}" belongs to "${v}"|「${ww}」屬於「${v}」`),kind:"sort",fwhy:why}; }); }
