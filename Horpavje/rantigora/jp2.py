#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sys
import os
import json
import yaml
from joppy.client_api import ClientApi

# ---------- 配置 ----------
BASE_PATH = 'Horpavje/rantigora/'
sys.path.append(BASE_PATH)
from 转换 import sep, conv

def load_aurime_order(yml_path):
    with open(yml_path, 'r', encoding='utf-8') as f:
        data = yaml.safe_load(f)
    return list(data.keys())

def parse_note_body(body):
    lines = body.strip().split('\n')
    entries = []
    start = 0
    if lines and 'rantigora' in lines[0].lower():
        start = 1
    for line in lines[start:]:
        line = line.strip()
        if not line:
            continue
        parts = line.split(',')
        if len(parts) < 3:
            continue
        entries.append({
            'chinese': parts[0].strip(),
            'latin1': parts[1].strip(),
            'latin2': parts[2].strip()
        })
    return entries

def process_entries(raw_entries, syllable_order):
    processed = []
    for e in raw_entries:
        syl1 = sep(e['latin1']).split() if e['latin1'] else []
        syl2 = sep(e['latin2']).split() if e['latin2'] else []
        aur1 = conv(sep(e['latin1'])) if e['latin1'] else ''
        aur2 = conv(sep(e['latin2'])) if e['latin2'] else ''
        processed.append({
            'chinese': e['chinese'],
            'latin1': e['latin1'],
            'latin2': e['latin2'],
            'syllables1': syl1,
            'syllables2': syl2,
            'aur1': aur1,
            'aur2': aur2
        })

    # 合并同音同形
    merged = {}
    for item in processed:
        key = (item['aur1'], item['aur2'])
        if key not in merged:
            merged[key] = {
                'aur1': item['aur1'],
                'aur2': item['aur2'],
                'latin1': item['latin1'],
                'latin2': item['latin2'],
                'syllables1': item['syllables1'],
                'syllables2': item['syllables2'],
                'chinese_set': set()
            }
        merged[key]['chinese_set'].add(item['chinese'])

    result = []
    for key, val in merged.items():
        val['chinese'] = ';'.join(sorted(val['chinese_set']))
        del val['chinese_set']
        result.append(val)

    # 排序：只按 syllables1（da- 形式）排序，短词（前缀）自动排在前面
    idx_map = {syl: i for i, syl in enumerate(syllable_order)}
    max_idx = len(syllable_order)

    def sort_key(item):
        combo = item['syllables1']
        return tuple(idx_map.get(syl, max_idx + ord(syl[0]) if syl else 0) for syl in combo)

    result.sort(key=sort_key)
    return result

def generate_html(entries):
    data_json = json.dumps(entries, ensure_ascii=False)
    html = f"""<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>霍洛巴语词典</title>
    <style>
        * {{
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }}
        body {{
            font-family: Inter, Arial, MiSans, 思源黑体, 微软雅黑, sans-serif;
            background: #bfd3ca;
            padding: 20px;
            color: #333f50;
        }}
        .container {{
            max-width: 900px;
            margin: 0 auto;
            background: #dff3ea;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            padding: 30px 25px;
        }}
        h1 {{
            font-size: 28px;
            font-weight: 500;
            margin-bottom: 20px;
            text-align: center;
            color: #333f50;
        }}
        .back-link {{
            display: inline-block;
            margin-bottom: 15px;
            color: #333f50;
            text-decoration: none;
            font-size: 16px;
        }}
        .back-link:hover {{
            text-decoration: underline;
        }}
        .search-box {{
            display: flex;
            gap: 12px;
            margin-bottom: 25px;
            align-items: center;
        }}
        .search-box input {{
            font-family: MiSans, 思源黑体, 微软雅黑, sans-serif;
            flex: 1;
            padding: 12px 18px;
            font-size: 16px;
            border: 2px solid #bfd3ca;
            border-radius: 30px;
            outline: none;
            transition: border-color 0.2s;
        }}
        .search-box input:focus {{
            border-color: #333f50;
        }}
        .search-box .count {{
            font-size: 14px;
            color: #6c757d;
            white-space: nowrap;
            padding-right: 5px;
        }}
        .entry-list {{
            border-top: 1px solid #e9ecef;
            padding-top: 10px;
        }}
        .entry {{
            padding: 12px 10px;
            border-bottom: 1px solid #bfd3ca;
            display: flex;
            flex-wrap: wrap;
            align-items: baseline;
            transition: background 0.15s;
        }}
        .entry:hover {{
            background: #bfd3ca;
        }}
        .aur {{
            font-family: 'unifik', sans-serif;
            font-weight: bold;
            font-size: 24px;
            color: #333f50;
            margin-right: 10px;
        }}
        .lat {{
            font-size: 16px;
            color: #333f50;
            margin-right: 10px;
        }}
        .chinese {{
            font-size: 16px;
            color: #333f50;
            margin-right: 10px;
        }}
        .example {{
            font-size: 14px;
            color: #6f837a;
            word-break: break-all;
        }}
        .no-result {{
            text-align: center;
            padding: 40px 0;
            color: #adb5bd;
            font-size: 16px;
        }}
        @media (max-width: 600px) {{
            .container {{
                padding: 15px;
            }}
            .search-box {{
                flex-wrap: wrap;
            }}
            .search-box .count {{
                width: 100%;
                text-align: center;
                padding-right: 0;
            }}
            .entry {{
                padding: 10px 0;
                flex-direction: column;
                align-items: flex-start;
            }}
            .aur {{
                font-size: 24px;
            }}
            .lat {{
                font-size: 15px;
            }}
            .chinese {{
                font-size: 15px;
            }}
        }}
    </style>
</head>
<body>
    <div class="container">
        <h1>📖 Horpavje 词典</h1>
        <a href=".." class="back-link">◀ 返回上层</a>
        <div class="search-box">
            <input type="text" id="searchInput" placeholder="搜索中文、拉丁转写或人造文字…" autofocus>
            <span class="count" id="resultCount">共 0 条</span>
        </div>
        <div class="entry-list" id="entryList"></div>
    </div>

    <script>
        const entries = {data_json};

        function escapeHtml(text) {{
            if (!text) return '';
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }}

        function render(list) {{
            const container = document.getElementById('entryList');
            const countEl = document.getElementById('resultCount');
            countEl.textContent = `共 ${{list.length}} 条`;

            if (list.length === 0) {{
                container.innerHTML = '<div class="no-result">未找到匹配条目</div>';
                return;
            }}

            let html = '';
            list.forEach(entry => {{
                const aurDisplay = `${{escapeHtml(entry.aur1)}}${{escapeHtml(entry.aur2)}}`;

                // 处理拉丁转写：da- 前缀和 -ja 后缀显示为灰色
                let lat1 = entry.latin1;
                let lat2 = entry.latin2;
                let lat1_display, lat2_display;
                if (lat1.startsWith('da')) {{
                    lat1_display = `<span style="color:#aaa;">da</span>${{escapeHtml(lat1.slice(2))}}`;
                }} else {{
                    lat1_display = escapeHtml(lat1);
                }}
                if (lat2.endsWith('ja')) {{
                    lat2_display = `${{escapeHtml(lat2.slice(0, -2))}}<span style="color:#aaa;">ja</span>`;
                }} else {{
                    lat2_display = escapeHtml(lat2);
                }}
                const latinDisplay = `${{lat1_display}}, ${{lat2_display}}`;

                html += `<div class="entry">`;
                html += `<span class="aur">${{aurDisplay}}</span>`;
                html += `<span class="lat">${{latinDisplay}}</span>`;
                html += `<span class="chinese">${{escapeHtml(entry.chinese)}}</span>`;
                if (entry.example) {{
                    html += `<span class="example">${{escapeHtml(entry.example)}}</span>`;
                }}
                html += `</div>`;
            }});
            container.innerHTML = html;
        }}

        render(entries);

        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', function() {{
            const query = this.value.trim();
            if (!query) {{
                render(entries);
                return;
            }}
            const lower = query.toLowerCase();
            const filtered = entries.filter(e =>
                e.chinese.includes(query) ||
                e.latin1.toLowerCase().includes(lower) ||
                e.latin2.toLowerCase().includes(lower) ||
                e.aur1.includes(query) ||
                e.aur2.includes(query)
            );
            render(filtered);
        }});

        document.addEventListener('keydown', function(e) {{
            if ((e.ctrlKey || e.metaKey) && e.key === 'f') {{
                e.preventDefault();
                searchInput.focus();
            }}
        }});
    </script>
</body>
</html>
"""
    return html

def main():
    account_path = os.path.join(BASE_PATH, 'account.txt')
    if not os.path.exists(account_path):
        print(f"错误：找不到 {account_path}")
        sys.exit(1)
    with open(account_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    if len(lines) < 2:
        print("错误：account.txt 格式应为第一行 token，第二行 note id")
        sys.exit(1)
    token = lines[0].strip()
    note_id = lines[1].strip()

    try:
        client = ClientApi(token)
        note = client.get_note(note_id, fields='body')
        body = note.body
    except Exception as e:
        print(f"从 Joplin 获取笔记失败: {e}")
        sys.exit(1)

    raw_entries = parse_note_body(body)
    print(f"解析到 {len(raw_entries)} 个原始词条")

    if not raw_entries:
        print("警告：未解析到有效词条，请检查笔记内容格式。")
        return

    aurime_path = os.path.join(BASE_PATH, 'aurime.yml')
    if not os.path.exists(aurime_path):
        print(f"错误：找不到 {aurime_path}")
        sys.exit(1)
    syllable_order = load_aurime_order(aurime_path)

    processed = process_entries(raw_entries, syllable_order)
    print(f"合并后共 {len(processed)} 个条目")

    html_content = generate_html(processed)
    output_path = os.path.join(BASE_PATH, 'index.html')
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html_content)

    print(f"词典页面已生成：{output_path}")

if __name__ == '__main__':
    main()

    import subprocess as sp
    sp.run('git add Horpavje/rantigora')
    sp.run(['git', 'commit', '-m', 'novizi rantigora a Horpavje'])
    sp.run('git push origin main')