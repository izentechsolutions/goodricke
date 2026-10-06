#!/usr/bin/env python3
"""Check that every local file referenced by the pages, CSS and JS exists.
Run from the project root:  python3 build/check-links.py
"""
import glob, os, re, sys
from urllib.parse import unquote

PAGES = ['index.html', 'plp.html', 'pdp.html']
ATTR = re.compile(r'''\b(?:src|href|poster|data-[a-z-]+|content)\s*=\s*["']([^"']+)["']''')
URL = re.compile(r'''url\(\s*['"]?([^'")]+)['"]?\s*\)''')
STR = re.compile(r'''['"`]((?:\.{0,2}/)?assets/[^'"`\s]+)['"`]''')

def local(v):
    return v and not re.match(r'^(?:[a-z]+:|//|#|/)', v, re.I) and re.search(r'\.(?:html|css|js|webp|avif|png|jpe?g|gif|svg|ico|woff2?|ttf|otf|mp4|webm|json)$', v, re.I)

# Known and accepted missing files (none at the moment).
KNOWN = set()
checked, broken = 0, []
def check(v, base, where):
    global checked
    v = unquote(v.split('#')[0].split('?')[0])
    if not local(v) or v in KNOWN:
        return
    checked += 1
    if not os.path.isfile(os.path.normpath(os.path.join(base, v))):
        broken.append(f'{where}: {v}')

for f in PAGES + glob.glob('css/*.css') + glob.glob('js/*.js'):
    s = open(f, encoding='utf-8').read()
    base = 'css' if f.startswith('css/') else '.'
    for rx in (ATTR, URL, STR):
        for m in rx.finditer(s):
            check(m.group(1), base, f'{f}:{s.count(chr(10), 0, m.start()) + 1}')

print(f'{checked} local references checked, {len(broken)} broken')
for b in broken:
    print('  BROKEN', b)
sys.exit(1 if broken else 0)
