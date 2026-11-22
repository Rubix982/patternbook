"""C-015: merge the three enumeration tables into atlas/<domain>.md, one file per domain, with duplicates resolved,
plus coverage, unattested, boundary and judgment-call files. Run from the scratchpad atlas folder; writes to argv[1]."""
import re, json, sys, os, collections
OUT=sys.argv[1]; os.makedirs(OUT,exist_ok=True)
FILES=['architecture.md','textiles.md','crafts.md']; STOP='## Memory items with no source found'
COUNTRIES=['India','Pakistan','Bangladesh','Nepal','Bhutan','Sri Lanka','Maldives']
ORDER=['Architecture','Gardens and water','Textiles and dress','Jewellery and adornment','Body and floor',
       'Painting and depiction','Objects and crafts','Script and lettering','Street, transport and signs','Ritual and festival objects']
def norm(n):
    n=re.sub(r'\([^)]*\)','',n.lower()); n=re.sub(r'[^a-z0-9 ]',' ',n); return ' '.join(n.split())
def slug(d): return re.sub(r'[^a-z0-9]+','-',d.lower()).strip('-')
rows=[]; tails={}
for f in FILES:
    s=open(f).read(); body,tail=s.split(STOP,1); tails[f]=STOP+tail
    dom=fam=None
    for l in body.split('\n'):
        if l.startswith('# '): dom=l[2:].strip(); continue
        if l.startswith('## '): fam=l[3:].strip(); continue
        if l.startswith('| ') and not l.startswith('| element') and not l.startswith('|---'):
            c=[x.strip() for x in l.strip().strip('|').split('|')]
            rows.append(dict(domain=dom,family=fam,element=c[0],aka=c[1],regions=c[2],branches=c[3],sources=c[4],
                             memory=c[5].lower().startswith('y'),key=norm(c[0]),seealso=None))
# different things sharing a name: qualify, don't merge
RENAME={('kalasha','Architecture'):'kalasha (finial)',('kalasha','Ritual and festival objects'):'kalasha (ritual pot)',
        ('terracotta','Architecture'):'terracotta (as building material)',('chadar','Gardens and water'):'chadar (water chute)'}
for r in rows:
    k=(r['key'],r['domain'])
    if k in RENAME: r['element']=RENAME[k]; r['key']=norm(r['element'])+'#'+r['domain']
# the same thing in two domains: file once (primary), link from the other
PRIMARY={'jali':'Architecture','newar window':'Architecture','pietra dura':'Architecture','khatamband':'Architecture',
         'kalamkari':'Textiles and dress','mata ni pachhedi':'Textiles and dress','rogan painting':'Textiles and dress',
         'jaapi':'Textiles and dress','thewa':'Jewellery and adornment','hupari silver craft':'Jewellery and adornment',
         'rangoli':'Body and floor','kolam':'Body and floor','alpana':'Body and floor','aipan':'Body and floor'}
def union(a,b):
    out=[]; 
    for x in [y.strip() for y in (a+'; '+b).split(';')]:
        if x and x not in ('—','-','') and x not in out: out.append(x)
    return '; '.join(out) if out else '—'
by=collections.defaultdict(list)
for r in rows: by[r['key']].append(r)
drop=set()
for k,v in by.items():
    if len(v)<2: continue
    if k not in PRIMARY: print('UNRESOLVED DUPLICATE',k,file=sys.stderr); continue
    p=[x for x in v if x['domain']==PRIMARY[k]][0]
    for x in v:
        if x is p: continue
        p['aka']=union(p['aka'],x['aka']); p['regions']=union(p['regions'],x['regions'])
        p['branches']=union(p['branches'],x['branches']); p['sources']=union(p['sources'],x['sources'])
        p['memory']=p['memory'] or x['memory']
        x['seealso']=f"{p['domain']} / {p['family']}"
# painting's floor-drawing family moves whole to Body and floor (same family, filed once)
for r in rows:
    if r['domain']=='Painting and depiction' and r['family']=='Floor and threshold drawing' and r['seealso'] is None:
        r['domain']='Body and floor'
kept=[r for r in rows if r['seealso'] is None]
links=[r for r in rows if r['seealso']]
def esc(x): return x.replace('|','/')
HEAD=("_Enumerated from sources in card C-015 (2026-11-22); merged from three passes whose full output and request logs "
      "are in `runs/c015/`. Every element has at least one source that names it. Regions are as the sources state them "
      "(historical region; modern country). Candidate branches are named varieties a source gives, many of them "
      "geographical-indication products; they become branches once samples show them (`docs/atlas.md`). \"First pass\" "
      "says whether the element was in the sketch written from memory that the card checked. Limits: `atlas/README.md`._\n")
cov=collections.OrderedDict()
for d in ORDER:
    R=[r for r in kept if r['domain']==d]; L=[r for r in links if r['domain']==d]
    fams=[]; [fams.append(r['family']) for r in R+L if r['family'] not in fams]
    out=[f'# {d}\n',HEAD]
    cov[d]=collections.OrderedDict()
    for fam in fams:
        FR=[r for r in R if r['family']==fam]; FL=[r for r in L if r['family']==fam]
        out.append(f'\n## {fam}\n')
        if FR:
            out.append('| element | also called | regions (historical; modern country) | candidate branches | sources | first pass |')
            out.append('|---|---|---|---|---|---|')
            for r in FR:
                out.append('| '+' | '.join(esc(r[x]) for x in ('element','aka','regions','branches','sources'))+' | '+('yes' if r['memory'] else 'no')+' |')
        if FL:
            out.append('\nFiled elsewhere: '+'; '.join(f"{r['element']} ({r['seealso']})" for r in FL)+'.')
        nb=sum(len([b for b in r['branches'].split(';') if b.strip() and b.strip() not in ('—','-')]) for r in FR)
        cov[d][fam]=(len(FR),nb,sum(r['memory'] for r in FR))
    open(os.path.join(OUT,slug(d)+'.md'),'w').write('\n'.join(out)+'\n')
# countries, recomputed the same way for every row
cc=collections.Counter(); none=0; india_only=0
for r in kept:
    hit=[c for c in COUNTRIES if re.search(r'\b'+c+r'\b',r['regions'])]
    for c in hit: cc[c]+=1
    if not hit: none+=1
    if hit==['India']: india_only+=1
N=len(kept); M=sum(r['memory'] for r in kept); B=sum(v[1] for d in cov.values() for v in d.values())
stats=dict(elements=N,memory=M,source_only=N-M,source_only_share=round((N-M)/N,3),branches=B,countries=dict(cc),no_country=none,india_only=india_only,cross_links=len(links))
json.dump(stats,open(os.path.join(OUT,'..','c015-stats.json'),'w'),indent=1)
c=['# Coverage\n','_Generated from the domain files by `runs/c015/merge_atlas.py` (C-015, 2026-11-22); not edited by hand._\n',
   f'**{N} elements** across 10 domains, **{B} candidate branches**. {M} were in the first-pass sketch; **{N-M} ({(N-M)/N:.0%}) were found only by the sources.** {len(links)} elements are filed in one domain and linked from another.\n',
   '## By domain and family\n','| domain | family | elements | candidate branches | in first pass |','|---|---|---|---|---|']
for d,fs in cov.items():
    for fam,(n,b,m) in fs.items():
        if n: c.append(f'| {d} | {fam} | {n} | {b} | {m} |')
    c.append(f'| **{d}** | | **{sum(v[0] for v in fs.values())}** | **{sum(v[1] for v in fs.values())}** | **{sum(v[2] for v in fs.values())}** |')
c+=['\n## Countries the sources name\n','Counted from the regions column of every element, the same way for all ten domains. An element counts for each country its sources name.\n',
    '| country | elements |','|---|---|']+[f'| {k} | {cc[k]} |' for k in COUNTRIES]+[f'| none named | {none} |',
    f'\n{india_only} elements ({india_only/N:.0%}) are attested for India alone. This is the sources\' bias as much as the subject\'s: English Wikipedia has far more articles, categories and registered geographical indications for India than for its neighbours (see `atlas/README.md`, Limits).']
open(os.path.join(OUT,'coverage.md'),'w').write('\n'.join(c)+'\n')
def section(name):
    out=[]
    for f,label in zip(FILES,['Architecture; Gardens and water','Textiles and dress; Jewellery and adornment; Body and floor','Painting and depiction; Objects and crafts; Script and lettering; Street, transport and signs; Ritual and festival objects']):
        t=tails[f]; m=re.search(r'^## '+re.escape(name)+r'\s*\n(.*?)(?=^## |\Z)',t,re.S|re.M)
        if m: out.append(f'## {label}\n\n'+m.group(1).strip()+'\n')
    return '\n'.join(out)
open(os.path.join(OUT,'unattested.md'),'w').write('# Items from the first pass that no source attested\n\n_C-015, 2026-11-22. Kept out of the atlas until a source names them; not deleted. "Not found" is not "doesn\'t exist": several were never queried for lack of budget._\n\n'+section('Memory items with no source found'))
open(os.path.join(OUT,'boundary.md'),'w').write('# Boundary\n\n_C-015, 2026-11-22. Related things just outside the subcontinent (India, Pakistan, Bangladesh, Nepal, Bhutan, Sri Lanka, the Maldives), recorded so the atlas knows where its edge is._\n\n'+section('Boundary'))
open(os.path.join(OUT,'judgment-calls.md'),'w').write('# Judgment calls\n\n_C-015, 2026-11-22. Where element, branch and sample were hard to tell apart, and other placements a reader should be able to question._\n\n'+section('Judgment calls'))
print(json.dumps(stats,indent=1))
