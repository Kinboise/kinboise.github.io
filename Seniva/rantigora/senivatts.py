import re
import yaml
from unidecode import unidecode
import argparse
import asyncio
import edge_tts

# 把 senivatts 里最后合成部分改成：
async def _save(text, voice, rate_str, output):
    communicate = edge_tts.Communicate(text, voice, rate=rate_str)
    await communicate.save(output)

# ------------------------------------------------------------
# 核心函数
# ------------------------------------------------------------
def senivatts(text: str = 'nes!, basone',
              lang: str = 'ka',
              voice: int = 1,
              rate: float = 1.0,
              file: str = None,
              output: str = None):
    """
    使用 edge-tts 生成语音
    """
    # 1. 读取 YAML 配置
    with open('senivatts.yml', encoding='utf-8') as f:
        cfg = yaml.safe_load(f)[lang]

    # 2. 读文件或直接用 text
    if file is not None:
        with open(file, encoding='utf-8') as f:
            text = f.read()

    # 3. 文本预处理（照搬原逻辑）
    text = unidecode(text.lower())
    for pattern, repl in cfg['rules'].items():
        text = re.sub(pattern, repl, text)
    text = re.sub(':', '-', text)

    # 4. 计算最终语速：edge-tts 用百分比，如 +20% / -30%
    base_rate = cfg['rates'][voice - 1]
    final_rate_percent = int((base_rate * rate - 100) * 2 / 3)
    # final_rate_percent = int((rate - 1) * 100)
    rate_str = f"{final_rate_percent:+}%"
    # print(final_rate_percent)

    # 5. 合成
    tts_voice = cfg['voices'][voice - 1]        # 如 zh-CN-YunyangNeural
    asyncio.run(_save(text, tts_voice, rate_str, output))

# ------------------------------------------------------------
# CLI
# ------------------------------------------------------------
if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument("-f", "--file", help="读取文件")
    parser.add_argument("-t", "--text", default='nes!, basone', help="直接输入文本")
    parser.add_argument("-l", "--lang", default='ka', help="语种，默认 ka")
    parser.add_argument("-v", "--voice", type=int, default=1, help="语音序号，默认 1")
    parser.add_argument("-r", "--rate", type=float, default=1.0, help="速度倍率，默认 1")
    parser.add_argument("-o", "--output", help="输出音频文件")
    args = parser.parse_args()
    senivatts(args.text, args.lang, args.voice, args.rate, args.file, args.output)