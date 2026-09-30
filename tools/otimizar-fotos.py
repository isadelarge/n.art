"""Gera versões menores das fotos para o site carregar rápido no celular.

Para cada foto em assets/fotos/<categoria>/ cria nome-480.webp, nome-640.webp, nome-800.webp e nome-1200.webp.
A foto original continua sendo usada na tela cheia.

Uso (na pasta do projeto):  python tools/otimizar-fotos.py
"""
from pathlib import Path
from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent / 'assets' / 'fotos'
LARGURAS = (480, 640, 800, 1200)
VARIANTE = tuple(f'-{w}' for w in LARGURAS)

criadas = 0
for foto in sorted(RAIZ.rglob('*')):
    if foto.suffix.lower() not in ('.jpg', '.jpeg', '.png', '.webp') or foto.stem.endswith(VARIANTE):
        continue
    with Image.open(foto) as im:
        im = im.convert('RGB')
        for w in LARGURAS:
            destino = foto.with_name(f'{foto.stem}-{w}.webp')
            if destino.exists() and destino.stat().st_mtime >= foto.stat().st_mtime:
                continue
            copia = im.copy()
            if copia.width > w:
                copia = copia.resize((w, round(copia.height * w / copia.width)), Image.LANCZOS)
            copia.save(destino, 'WEBP', quality=72, method=6)
            criadas += 1

print(f'{criadas} versões criadas')
