import glob, sys, os
from PIL import Image
import numpy as np
d = sys.argv[1]
def diff(a, b):
    A = np.asarray(Image.open(a).convert('RGB')).astype(int); B = np.asarray(Image.open(b).convert('RGB')).astype(int)
    if A.shape != B.shape: return 999
    return round(100 * (np.abs(A - B).max(axis=2) > 0).mean(), 3)
n = same_oo = same_on = 0
for f in sorted(glob.glob(d + '/orig-*.png')):
    k = os.path.basename(f)[5:]
    oo = diff(f, f'{d}/orig2-{k}') if os.path.exists(f'{d}/orig2-{k}') else -1
    on = diff(f, f'{d}/new-{k}')
    n += 1; same_oo += oo == 0; same_on += on == 0
    if oo or on: print(f'{k:45s} orig-vs-orig2 {oo:7}%  orig-vs-new {on:7}%')
print('frames', n, 'orig==orig2', same_oo, 'orig==new', same_on)
