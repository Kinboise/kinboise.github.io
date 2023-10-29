import os

path = 'Sig/luming/FP/'

for svg in os.listdir(path):
    if svg.endswith('.svg'):
        f = open(path + svg, 'r', -1, 'utf-8')
        text = f.read()
        f.close()
        # text = text.replace('>K<', '>F<')
        # text = text.replace('>R<', '>P<')
        # text = text.replace('>西<', '>北<')
        # text = text.replace('>东<', '>南<')
        # text = text.replace('#fff', '#083')
        # text = text.replace('#e11', '#fff')
        text = text.replace('class="fit"', 'class="fit cls-3"')
        f = open(path + svg, 'w', -1, 'utf-8')
        f.write(text)