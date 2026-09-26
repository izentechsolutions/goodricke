#!/usr/bin/env python3
"""Check that every local file referenced by index.html, css/*.css and js/*.js exists.

Run from the project root:  python3 docs/check-links.py
"""
import glob, os, re, sys
from urllib.parse import unquote

ATTR = re.compile(r'''\b(?:src|href|poster|srcset|data-img|content)\s*=\s*"([^"]*)"''')
URL = re.compile(r'''url\(\s*['"]?([^'")]+)['"]?\s*\)''')
JS_STR = re.compile(r'''['"`]([^'"`\s]+\.(?:png|jpe?g|gif|webp|svg|mp4|webm|mp3|woff2?|ttf|otf|css|js|json))['"`]''')

def local(ref):
    return ref and not re.match(r'^(?:[a-z]+:|//|#)', ref, re.I) and '{' not in ref and '+' not in ref

checked, broken = 0, []
def check(ref, base, where):
    global checked
    for part in ref.split(','):              # srcset support
        path = unquote(part.strip().split(' ')[0].split('#')[0].split('?')[0])
        if not local(path):
            continue
        checked += 1
        if not os.path.isfile(os.path.normpath(os.path.join(base, path))):
            broken.append(f'{where}: {path}')

for html in glob.glob('*.html'):
    s = open(html, encoding='utf-8').read()
    for m in ATTR.finditer(s):
        if 'content=' in m.group(0) and not re.search(r'\.\w{2,5}$', m.group(1)):
            continue
        check(m.group(1), '.', f'{html}:{s.count(chr(10), 0, m.start()) + 1}')
    for m in URL.finditer(s):
        check(m.group(1), '.', f'{html}:{s.count(chr(10), 0, m.start()) + 1}')
for css in glob.glob('css/*.css'):
    s = open(css, encoding='utf-8').read()
    for m in URL.finditer(s):
        check(m.group(1), 'css', f'{css}:{s.count(chr(10), 0, m.start()) + 1}')
for js in glob.glob('js/*.js'):
    s = open(js, encoding='utf-8').read()
    for m in JS_STR.finditer(s):
        check(m.group(1), '.', f'{js}:{s.count(chr(10), 0, m.start()) + 1}')

print(f'{checked} local references checked, {len(broken)} broken')
for b in broken:
    print('  BROKEN', b)
sys.exit(1 if broken else 0)
