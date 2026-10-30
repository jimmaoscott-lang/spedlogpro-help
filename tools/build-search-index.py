# Builds assets/search-index.js from the lesson pages, so the front-page search can look at
# every lesson's title, part and step headings, and text. Run it after changing a lesson:
#   python tools/build-search-index.py
import glob, html, json, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def text(fragment):
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', fragment))).strip()


entries = []
for path in sorted(glob.glob(os.path.join(ROOT, 'lessons', '*.html'))):
    page = open(path, encoding='utf-8').read()
    if 'http-equiv="refresh"' in page:  # a forwarding page for a merged lesson
        continue
    main = re.search(r'<main>(.*)</main>', page, re.S).group(1)
    main = re.sub(r'<span class="newburst".*?</small></span>', '', main, flags=re.S)
    main = re.sub(r'<div class="promptcard">.*?</div>\s*</div>', '', main, flags=re.S)
    title = text(re.search(r'<h1>(.*?)</h1>', main, re.S).group(1))
    heads = [text(h) for h in re.findall(r'<h[23]>(.*?)</h[23]>', main, re.S)]
    body = text(re.sub(r'<h[123]>.*?</h[123]>', ' ', main, flags=re.S))
    entries.append({'url': 'lessons/' + os.path.basename(path), 'title': title, 'heads': heads, 'body': body})

out = os.path.join(ROOT, 'assets', 'search-index.js')
with open(out, 'w', encoding='utf-8', newline='\n') as f:
    f.write('// Made by tools/build-search-index.py from the lesson pages. Do not edit by hand.\n')
    f.write('window.SEARCH_INDEX = ' + json.dumps(entries, ensure_ascii=False) + ';\n')
print(f'{len(entries)} lessons, {os.path.getsize(out) // 1024} KB')
