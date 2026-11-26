import re,sys,json
JP=re.compile(r'[぀-ヿ㐀-鿿！-～、。「」・〜…（）]')
def lex(src):
    """yield (kind,start,end) for string literals; templates as ('tpl',start,end,parts) where parts=[(static_start,static_end)...] and exprs"""
    i=0;n=len(src);out=[]
    prev=''
    def skip_ws(j):
        return j
    def read_tpl(i):
        # src[i]=='`'
        j=i+1; statics=[]; exprs=[]; s0=j
        while True:
            c=src[j]
            if c=='\\': j+=2; continue
            if c=='`': statics.append((s0,j)); return j+1,statics,exprs
            if c=='$' and src[j+1]=='{':
                statics.append((s0,j)); e0=j+2; j=read_code(j+2,'}'); exprs.append((e0,j)); j+=1; s0=j; continue
            j+=1
    def read_code(j,end):
        depth=0
        while j<n:
            c=src[j]
            if c in '"\'':
                k=read_str(j); out.append(('str',j,k)); j=k; continue
            if c=='`':
                k,st,ex=read_tpl(j); out.append(('tpl',j,k,st,ex)); j=k; continue
            if c=='/' and src[j+1]=='/':
                j=src.index('\n',j); continue
            if c=='/' and src[j+1]=='*':
                j=src.index('*/',j)+2; continue
            if c=='/':
                # regex?
                k=j-1
                while k>=0 and src[k] in ' \t\n': k-=1
                if k<0 or src[k] in '(,=:[!&|?{};+':
                    m=j+1; inclass=False
                    while True:
                        ch=src[m]
                        if ch=='\\': m+=2; continue
                        if ch=='[': inclass=True
                        elif ch==']': inclass=False
                        elif ch=='/' and not inclass: break
                        m+=1
                    j=m+1
                    while src[j].isalpha(): j+=1
                    continue
            if c in '({[': depth+=1
            elif c in ')}]':
                if depth==0 and c==end: return j
                depth-=1
            j+=1
        return j
    def read_str(j):
        q=src[j]; k=j+1
        while src[k]!=q:
            if src[k]=='\\': k+=1
            k+=1
        return k+1
    read_code(0,None)
    return out
if __name__=='__main__':
    src=open(sys.argv[1]).read()
    toks=lex(src)
    keys={}
    for t in toks:
        if t[0]=='str':
            s=src[t[1]+1:t[2]-1]
            if JP.search(s): keys.setdefault(s,0); keys[s]+=1
        else:
            st=[src[a:b] for a,b in t[3]]
            if any(JP.search(x) for x in st):
                k='{}'.join(st); keys.setdefault(k,0); keys[k]+=1
    print(len(keys), sum(keys.values()), sum(len(k) for k in keys))
    json.dump(list(keys),open(sys.argv[2],'w'),ensure_ascii=False,indent=0)
