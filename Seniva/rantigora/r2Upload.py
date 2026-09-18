import argparse
from pathlib import Path
import shutil
import subprocess


ROOT = Path(__file__).resolve().parent


def files_from_manifest(manifest: Path, audio_dir: Path) -> list[Path]:
    result = []
    for line in manifest.read_text(encoding='utf-8').splitlines():
        name = line.strip()
        if not name:
            continue
        candidate = (audio_dir / name).resolve()
        if candidate.parent != audio_dir.resolve() or candidate.suffix.lower() != '.ogg':
            raise ValueError(f'清单中包含无效文件名：{name}')
        if not candidate.is_file():
            raise FileNotFoundError(candidate)
        result.append(candidate)
    return result


def main() -> None:
    parser = argparse.ArgumentParser(description='将帜和语读音上传到 Cloudflare R2。')
    parser.add_argument('--audio-dir', type=Path, default=ROOT / 'seniva-cute')
    parser.add_argument('--manifest', type=Path, help='只上传清单中的文件；省略则上传目录内全部 OGG。')
    parser.add_argument('--bucket', default='guc-bise')
    parser.add_argument('--prefix', default='seniva-cute')
    parser.add_argument('--dry-run', action='store_true')
    args = parser.parse_args()

    if args.manifest:
        files = files_from_manifest(args.manifest, args.audio_dir)
    else:
        files = sorted(args.audio_dir.glob('*.ogg'))

    wrangler = shutil.which('wrangler')
    if not wrangler and not args.dry_run:
        raise RuntimeError('找不到 wrangler。请先安装并登录 Cloudflare Wrangler。')

    print(f'准备上传 {len(files)} 个音频。')
    for index, file in enumerate(files, start=1):
        object_name = f'{args.bucket}/{args.prefix}/{file.name}'
        command = [wrangler or 'wrangler', 'r2', 'object', 'put', object_name, f'--file={file}']
        print(f'[{index}/{len(files)}] {object_name}')
        if not args.dry_run:
            subprocess.run(command, check=True, cwd=ROOT)


if __name__ == '__main__':
    main()
