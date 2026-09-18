import argparse
from pathlib import Path

import yaml

from senivatts import senivatts


ROOT = Path(__file__).resolve().parent


def pending_words(dictionary_path: Path, audio_dir: Path) -> list[str]:
    with dictionary_path.open('r', encoding='utf-8') as stream:
        dictionary = yaml.safe_load(stream) or []

    audio_dir.mkdir(parents=True, exist_ok=True)
    existing = {item.name for item in audio_dir.glob('*.ogg')}
    words = []
    seen = set()
    for entry in dictionary:
        word = entry['ph'][0]
        filename = f'{word}.ogg'
        if filename not in existing and word not in seen:
            words.append(word)
            seen.add(word)
    return words


def main() -> None:
    parser = argparse.ArgumentParser(description='只生成网页词典中尚缺少的读音。')
    parser.add_argument('--dictionary', type=Path, default=ROOT / 'dic.yaml')
    parser.add_argument('--audio-dir', type=Path, default=ROOT / 'seniva-cute')
    parser.add_argument('--manifest', type=Path, default=ROOT / '.seniva-new-audio.txt')
    parser.add_argument('--list-only', action='store_true', help='只列出缺少的音频，不生成。')
    args = parser.parse_args()

    words = pending_words(args.dictionary, args.audio_dir)
    print(f'需要生成 {len(words)} 个音频。')
    if args.list_only:
        for word in words:
            print(word)
        return

    args.manifest.parent.mkdir(parents=True, exist_ok=True)
    with args.manifest.open('w', encoding='utf-8', newline='\n') as manifest:
        for index, word in enumerate(words, start=1):
            output = args.audio_dir / f'{word}.ogg'
            print(f'[{index}/{len(words)}] {word}')
            senivatts(word, lang='ka', voice=2, output=str(output))
            manifest.write(f'{output.name}\n')
            manifest.flush()

    print(f'本次生成清单：{args.manifest}')


if __name__ == '__main__':
    main()
