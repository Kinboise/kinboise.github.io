#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import pandas as pd
import json
import sys
import os

CUSTOM_ALPHABET = "numflackpdbghsoziwertyvčxšž♀♂"

def custom_sort_key(entry):
    word = entry['nivoni'].lower().replace("'", '')
    # 创建字母到索引的映射
    order_map = {char: idx for idx, char in enumerate(CUSTOM_ALPHABET)}
    # 若字符不在自定义表中，则放到最后，并用 ord() 决定它们之间的相对顺序
    return tuple(order_map.get(c, len(CUSTOM_ALPHABET) + ord(c)) for c in word)

def read_excel(file_path):
    """读取所有含有 'Nivoni' 和 '中文/简体中文' 列的 sheet，合并为词条列表"""
    xls = pd.ExcelFile(file_path)
    entries = []

    for sheet_name in xls.sheet_names:
        try:
            # 尝试用第一行作为列名
            df = pd.read_excel(xls, sheet_name=sheet_name, header=0)
        except Exception:
            continue

        niv_col = None
        chi_col = None
        pos_col = None
        ex_col = None

        for col in df.columns:
            col_str = str(col).strip()
            lower = col_str.lower()
            if lower == 'nivoni':
                niv_col = col
            elif '简体中文' in col_str or '中文' in col_str:
                chi_col = col
            elif '词性' in col_str:
                pos_col = col
            elif '例句' in col_str:
                ex_col = col

        # 若未找到必要的列，跳过此 sheet
        if niv_col is None or chi_col is None:
            continue

        for _, row in df.iterrows():
            niv = row[niv_col]
            if pd.isna(niv):
                continue
            chi = row[chi_col] if chi_col in row else ''
            if pd.isna(chi):
                chi = ''

            entry = {
                'nivoni': str(niv).strip(),
                'chinese': str(chi).strip()
            }
            if pos_col and pos_col in row and not pd.isna(row[pos_col]):
                entry['pos'] = str(row[pos_col]).strip()
            if ex_col and ex_col in row and not pd.isna(row[ex_col]):
                entry['example'] = str(row[ex_col]).strip()

            entries.append(entry)

    # 按 Nivoni 排序（不区分大小写）
    entries.sort(key=custom_sort_key)
    return entries


def generate_html(entries):
    """根据词条列表生成完整的 HTML 页面"""
    data_json = json.dumps(entries, ensure_ascii=False)

    html = f"""<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>立准语词典</title>
    <link rel="stylesheet" href="../../css/pajne.css">
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
        .search-box {{
            display: flex;
            gap: 12px;
            margin-bottom: 25px;
            align-items: center;
        }}
        .search-box input {{
            font-family: Harin Nifik, MiSans, sans-serif;
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
        .nivoni {{
            font-family: Harin Nifik;
            font-weight: bold;
            font-size: 24px;
            color: #333f50;
            margin-right: 10px;
        }}
        .pos {{
            font-family: Harin Nifik, MiSans, 思源黑体, 微软雅黑, sans-serif;
            font-size: 13px;
            color: #6c757d;
            background: #e9ecef;
            padding: 2px 10px;
            border-radius: 20px;
            margin-right: 10px;
            font-weight: 400;
        }}
        .chinese {{
            font-size: 16px;
            color: #333f50;
            margin-right: 10px;
        }}
        .example {{
            font-family: Harin Nifik, MiSans, 思源黑体, 微软雅黑, sans-serif;
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
            .nivoni {{
                font-size: 24px;
            }}
            .pos {{
                margin: 2px 0;
            }}
            .chinese {{
                font-size: 15px;
            }}
        }}
    </style>
</head>
<body>
    <div class="container">
        <h1>立准语词典</h1>
        <a href="..">◀ 返回上层</a>
        <div class="search-box">
            <input type="text" id="searchInput" placeholder="搜索词条或释义…" autofocus>
            <span class="count" id="resultCount">共 0 条</span>
        </div>
        <div class="entry-list" id="entryList"></div>
    </div>

    <script>
        // 嵌入数据
        const entries = {data_json};

        // HTML 转义（防止 XSS）
        function escapeHtml(text) {{
            if (!text) return '';
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }}

        // 渲染列表
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
                html += `<div class="entry">`;
                html += `<span class="nivoni">${{escapeHtml(entry.nivoni)}}</span>`;
                html += `<span class="lat">${{escapeHtml(entry.nivoni)}}</span>`;
                if (entry.pos) {{
                    html += `<span class="pos">${{escapeHtml(entry.pos)}}</span>`;
                }}
                html += `<span class="chinese">${{escapeHtml(entry.chinese)}}</span>`;
                if (entry.example) {{
                    html += `<span class="example">${{escapeHtml(entry.example)}}</span>`;
                }}
                html += `</div>`;
            }});
            container.innerHTML = html;
        }}

        // 初始显示全部
        render(entries);

        // 搜索过滤
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', function() {{
            const query = this.value.trim().toLowerCase();
            if (!query) {{
                render(entries);
                return;
            }}
            const filtered = entries.filter(e =>
                e.nivoni.toLowerCase().includes(query) ||
                e.chinese.toLowerCase().includes(query)
            );
            render(filtered);
        }});

        // 快捷键：Ctrl+F 聚焦搜索框
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
    # 默认文件名
    default_file = "D:/hafa-zug/Rantrugork i'Nivoni.xlsx"
    if len(sys.argv) > 1:
        file_path = sys.argv[1]
    else:
        file_path = default_file

    if not os.path.exists(file_path):
        print(f"错误：文件 '{file_path}' 不存在。")
        sys.exit(1)

    print(f"正在读取 {file_path} ...")
    entries = read_excel(file_path)
    print(f"成功读取 {len(entries)} 个词条。")

    output_file = "Nivoni/rantigora/index.html"
    html_content = generate_html(entries)

    with open(output_file, "w", encoding="utf-8") as f:
        f.write(html_content)

    print(f"词典页面已生成：{output_file}")


if __name__ == "__main__":
    main()