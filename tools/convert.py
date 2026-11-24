"""Converte as pranchetas .dc.html do canvas em módulos TS para o runtime de templates."""
import re, json, glob, os, sys

SRC = sys.argv[1]
OUT = os.path.join(os.path.dirname(__file__), '..', 'src')
os.makedirs(OUT + '/screens', exist_ok=True)

def slug(name):
    return re.sub(r'(?<=[a-z])(?=[A-Z])|(?<=[A-Z])(?=[A-Z][a-z])', '-', name).lower()

names = sorted(os.path.basename(f)[:-8] for f in glob.glob(SRC + '/*.dc.html'))
SL = {n: slug(n) for n in names}

def relink(s):
    return re.sub(r'([A-Za-z]+)\.dc\.html', lambda m: '/t/' + SL[m.group(1)] if m.group(1) in SL else m.group(0), s)

canvas = json.load(open(SRC + '/canvas.json'))['boards']
manifest, warn = [], []
for n in names:
    s = open('%s/%s.dc.html' % (SRC, n), encoding='utf-8').read()
    title = re.search(r'<title>(.*?)</title>', s, re.S).group(1).replace('LogArt — ', '')
    tpl = re.search(r'</helmet>\s*(.*?)\s*</x-dc>', s, re.S).group(1)
    m = re.search(r"data-dc-script data-props='(.*?)'>\n(.*?)</script>", s, re.S)
    props = json.loads(m.group(1).replace('&#39;', "'").replace('&amp;', '&'))
    code = m.group(2)
    pv = props.pop('$preview', {'width': 1440, 'height': 900})
    defaults = {k: v.get('default') for k, v in props.items() if isinstance(v, dict) and 'default' in v}

    # navegação lateral: acrescenta Etiquetas depois de "Ordens de serviço"
    if n not in ('Etiquetas',) and "['Ordens de serviço','Painel.dc.html']," in code:
        code = code.replace("['Ordens de serviço','Painel.dc.html'],", "['Ordens de serviço','Painel.dc.html'],['Etiquetas','Etiquetas.dc.html'],")
        if '"Assistente": "' in code:
            code = code.replace('"Assistente": "', '"Etiquetas": "M6 9V3h12v6M6 18H4v-7h16v7h-2M7 14h10v7H7z", "Assistente": "', 1)
        else:
            warn.append(n + ': NAVI sem chave Assistente')
    elif n == 'Etiquetas':
        code = code.replace("['Ordens de serviço','Painel.dc.html'],", "['Ordens de serviço','Painel.dc.html'],['Etiquetas','Etiquetas.dc.html'],")
        code = code.replace('"Assistente": "', '"Etiquetas": "M6 9V3h12v6M6 18H4v-7h16v7h-2M7 14h10v7H7z", "Assistente": "', 1)
        code = code.replace('navFor("Ordens de servi\\u00e7o")', 'navFor("Etiquetas")')
    elif n in ('Painel', 'NovaOS'):
        warn.append(n + ': NAV não casou')

    if n == 'Etiquetas':
        code = code.replace(".pdf baixado'", ".pdf (prévia)'")
    tpl, code = relink(tpl), relink(code)
    kind = 'phone' if pv['width'] <= 480 else 'web'
    out = ('// @ts-nocheck\n// Gerado por tools/convert.py a partir de %s.dc.html. Não edite à mão.\n'
           "import { DCLogic } from '@/lib/dc';\n"
           'export const template = %s;\nexport const defaults = %s;\n%s\nexport default Component;\n') % (
        n, json.dumps(tpl, ensure_ascii=False), json.dumps(defaults), code.replace('class Component extends DCLogic', 'class Component extends DCLogic'))
    open('%s/screens/%s.ts' % (OUT, n), 'w', encoding='utf-8').write(out)
    manifest.append(dict(name=n, slug=SL[n], title=canvas.get(n + '.dc.html', {}).get('title', title), full=title, kind=kind, w=pv['width'], h=pv['height']))

reg = 'export const registry: Record<string, () => Promise<any>> = {\n' + ''.join(
    "  '%s': () => import('./%s'),\n" % (m['slug'], m['name']) for m in manifest) + '};\n'
open(OUT + '/screens/registry.ts', 'w').write(reg)
open(OUT + '/lib/screens.json', 'w', encoding='utf-8').write(json.dumps(manifest, ensure_ascii=False, indent=1))
print(len(manifest), 'telas;', warn or 'sem avisos')
