def senivatts(text, lang='ka', voice=1, rate=1, file=None, output=None):
    import yaml
    import os
    path = os.path.dirname(os.path.abspath(__file__)).replace('\\', '/') + '/'
    with open(path + 'senivatts.yml','r',-1,'utf-8') as s:
        dict = yaml.safe_load(s)
    info = dict[lang]

    if file is not None:
        with open(file,'r',-1,'utf-8') as f:
            text = f.read()
    from unidecode import unidecode
    text = unidecode(text.lower())
    import re
    for rule in info['rules']:
        text = re.sub(rule, info['rules'][rule], text)

    import pyttsx4
    engine = pyttsx4.init('sapi5')
    engine.setProperty('voice', r'HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Speech\Voices' + '\\' + info['voices'][voice-1])
    engine.setProperty('rate', info['rates'][voice-1] * rate)
    if output is None:
        engine.say(text)
    else:
        engine.save_to_file(text, output)
    engine.runAndWait()

if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("-f", "--file", help="读取文件")
    parser.add_argument("-t", "--text", help="读取文本，默认nes!, basone", default='nes!, basone')
    parser.add_argument("-l", "--lang", help="音源语种，默认ka", default='ka')
    parser.add_argument("-v", "--voice", help="音源编号，默认0", type=int, default=0)
    parser.add_argument("-r", "--rate", help="速度倍率，默认1", type=float, default=1)
    parser.add_argument("-o", "--output", help="输出音频文件")
    args = parser.parse_args()
    senivatts(args.text, args.lang, args.voice, args.rate, args.file, args.output)