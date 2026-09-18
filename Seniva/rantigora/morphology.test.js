const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const {
    analyze,
    fitenkaGlyphsToNotation,
    fitenkaNotationUnits,
    fitenkaNotationToGlyphs,
    fromFitenka,
    fromHanivako,
    parseFitenkaNam,
} = require('./morphology.js')

const entries = [
    { key: 'rav', label: 'rav', glossZh: ['圆', '旋转'], glossEn: ['rotate'], pos: ['动词 Verb'], hanivako: '圓', fitenka: 'rv' },
    { key: 'ploda', label: 'ploda', glossZh: ['园'], glossEn: ['garden, park'], pos: ['名词 Noun'], hanivako: '園', fitenka: "pl'd" },
    { key: '-i-', label: '-i-', glossZh: ['连接复合词'], glossEn: ['compound linker'], pos: ['词缀 Affix'], hanivako: '之' },
    { key: '-i', label: '-i', glossZh: ['动名词词尾'], glossEn: ['gerund ending'], pos: ['词缀 Affix'], hanivako: '之' },
    { key: 'be-', label: 'be-', glossZh: ['再'], glossEn: ['re-'], pos: ['词缀 Affix'], fitenka: 'be`' },
    { key: 'ku-', label: 'ku-', glossZh: ['开始'], glossEn: ['start to'], pos: ['词缀 Affix'], hanivako: '至', fitenka: 'k`' },
    { key: 'sof', label: 'sof', glossZh: ['生存'], glossEn: ['live'], pos: ['动词 Verb'], fitenka: 'sf' },
    { key: 'kusof', label: 'kusof', glossZh: ['生出'], glossEn: ['give birth to'], pos: ['动词 Verb'], fitenka: 'k`sf' },
    { key: 'bekusof', label: 'bekusof', glossZh: ['再生'], glossEn: ['be reborn'], pos: ['动词 Verb'], fitenka: 'be`k`sf' },
    { key: '-e', label: '-e', glossZh: ['名词词尾'], glossEn: ['noun ending'], pos: ['词缀 Affix'], hanivako: '兮' },
    { key: 'noco', label: 'noco', glossZh: ['夜'], glossEn: ['night'], pos: ['名词 Noun'], fitenka: 'nc' },
    { key: '-u', label: '-u', glossZh: ['副词词尾'], glossEn: ['adverbial ending'], pos: ['词缀 Affix'] },
    { key: 'z', label: 'z', glossZh: ['从'], glossEn: ['from'], pos: ['介词 Preposition'], hanivako: '自' },
    { key: 'zu-', label: 'zu-', glossZh: ['从，离'], glossEn: ['from, away'], pos: ['词缀 Affix'], hanivako: '自' },
    { key: 'h', label: 'h', glossZh: ['在'], glossEn: ['in'], pos: ['介词 Preposition'], hanivako: '在' },
    { key: 'hu', label: 'hu', glossZh: ['在'], glossEn: ['in'], pos: ['介词 Preposition'] },
    { key: 'vel', label: 'vel', glossZh: ['睡'], glossEn: ['sleep'], pos: ['动词 Verb'], fitenka: 'vl' },
    { key: 'bit', label: 'bit', glossZh: ['是；存在'], glossEn: ['be; exist'], pos: ['动词 Verb'], hanivako: '爲', fitenka: 'bt' },
    { key: 'kubit', label: 'kubit', glossZh: ['开始，成为'], glossEn: ['begin; become'], pos: ['动词 Verb'], hanivako: '至爲', fitenka: 'k`bt' },
    { key: 'rezova', label: 'rezova', glossZh: ['草原'], glossEn: ['grassland'], pos: ['名词 Noun'], hanivako: '草衆', fitenka: 'rz`v' },
    { key: 'reza', label: 'reza', glossZh: ['草'], glossEn: ['grass'], pos: ['名词 Noun'], hanivako: '草', fitenka: 'rz' },
    { key: '-ov-', label: '-ov-', glossZh: ['集合'], glossEn: ['mass group'], pos: ['词缀 Affix'], hanivako: '衆', fitenka: '`v' },
    { key: '-a', label: '-a', glossZh: ['名词词尾'], glossEn: ['noun ending'], pos: ['词缀 Affix'], hanivako: '也' },
    { key: '-n', label: '-n', glossZh: ['一般名词标志'], glossEn: ['general noun ending'], pos: ['词缀 Affix'] },
    { key: '-un', label: '-un', glossZh: ['介词词尾'], glossEn: ['prepositional ending'], pos: ['词缀 Affix'] },
    { key: 'gike', label: 'gike', glossZh: ['下'], glossEn: ['down'], pos: ['名词 Noun'], fitenka: 'gk' },
    { key: 'deve', label: 'deve', glossZh: ['神；偶像'], glossEn: ['god; idol'], pos: ['名词 Noun'], hanivako: '所拜', fitenka: '|dv' },
    { key: 'dav', label: 'dav', glossZh: ['崇拜'], glossEn: ['worship'], pos: ['动词 Verb'], hanivako: '拜' },
    { key: 'dere', label: 'dere', glossZh: ['树；木'], glossEn: ['tree; wood'], pos: ['名词 Noun'], hanivako: '木', fitenka: 'dr' },
    { key: 'duf', label: 'duf', glossZh: ['假装'], glossEn: ['pretend'], pos: ['动词 Verb'], hanivako: '僞矣', fitenka: 'df.' },
    { key: 'haf', label: 'haf', glossZh: ['说'], glossEn: ['say'], pos: ['动词 Verb'], hanivako: '言', fitenka: 'hf' },
    { key: 'fos', label: 'fos', glossZh: ['浸泡，淹没'], glossEn: ['soak, immerse'], pos: ['动词 Verb'], hanivako: '水矣', fitenka: 'fs.' },
    { key: '-as-', label: '-as-', glossZh: ['富有……的，被……的'], glossEn: ['rich in'], pos: ['词缀 Affix'], hanivako: '焉', fitenka: '`s' },
    { key: 'buna', label: 'buna', glossZh: ['边缘，岸'], glossEn: ['edge, shore'], pos: ['名词 Noun'], hanivako: '邊也', fitenka: 'bna' },
]

function lookups(word) {
    return analyze(word, entries).candidates[0].components.map(component => component.lookup)
}

const properCompound = analyze('Raviploda', entries)
assert.equal(properCompound.properNoun, true)
assert.deepEqual(lookups('Raviploda'), ['rav', '-i-', 'ploda'])
assert.match(properCompound.candidates[0].summaryZh, /圆|旋转/)
assert.match(properCompound.candidates[0].summaryEn, /rotate/)
assert.deepEqual(lookups('bekusofe'), ['be-', 'kusof', '-e'])
assert.deepEqual(lookups('nocu'), ['noco', '-u'])
assert.deepEqual(lookups('Kubitirezova'), ['kubit', '-i-', 'rezova'])
const detailedCompound = analyze('Kubitirezova', entries).candidates[1]
assert.deepEqual(
    detailedCompound.components.map(component => component.display),
    ['ku-', 'bit', '-i-', 'rez', '-ov-', '-a'],
)
assert.equal(analyze('Kubitirezova', entries).candidates[0].hanivako, '・至爲之草衆')
assert.equal(detailedCompound.hanivako, '・至爲之草衆也')
assert.equal(analyze('Raviploda', entries).candidates[0].hanivako, '・圓之園')
assert.equal(analyze('Raviploda', entries).candidates[0].fitenka, "·rvi_pl'd")
assert.equal(analyze('Kubitirezova', entries).candidates[0].fitenka, '·k`bti_rz`v')
assert.equal(detailedCompound.fitenka, '·k`bti_rz`v')
assert.equal(
    fromHanivako('至爲之草衆', entries).latin,
    'kubitirezova',
)
assert.equal(
    fromHanivako('至爲之草衆也', entries).latin,
    'kubitirezova',
)
assert.equal(fromHanivako('・至爲之草衆', entries).latin, 'Kubitirezova')
assert.equal(analyze('ziploda', entries).candidates.length, 0)
assert.equal(analyze('hiploda', entries).candidates.length, 0)
assert.equal(analyze('zuiploda', entries).candidates.length, 0)
assert.equal(analyze('huiploda', entries).candidates.length, 0)
assert.equal(analyze('zu', entries).candidates.length, 0)
assert.equal(fromHanivako('自之園', entries), null)
assert.equal(fromHanivako('自然', entries), null)
assert.equal(analyze('dufihaf', entries).candidates[0].hanivako, '僞之言')
assert.equal(fromHanivako('僞之言', entries).latin, 'dufihaf')
assert.equal(fromHanivako('僞矣之言', entries), null)
assert.equal(analyze('dufe', entries).candidates[0].hanivako, '僞兮')
assert.equal(fromHanivako('僞兮', entries).latin, 'dufe')
assert.equal(analyze('dufihaf', entries).candidates[0].fitenka, 'dfi_hf')
assert.equal(analyze('nocu', entries).candidates[0].fitenka, 'ncu')
assert.equal(fromFitenka("rvi_pl'd", entries).latin, 'raviploda')
assert.equal(fromFitenka('k`bti_rz`v', entries).latin, 'kubitirezova')
assert.equal(fromFitenka('·k`bti_rz`v', entries).latin, 'Kubitirezova')
assert.equal(fromFitenka('dfi_hf', entries).latin, 'dufihaf')
assert.equal(fromFitenka('ncu', entries).latin, 'nocu')
assert.equal(analyze('Fosasibuna', entries).candidates[0].fitenka, '·fs`si_bna')
assert.equal(analyze('Fosasibuna', entries).candidates[0].hanivako, '・水焉之邊也')
assert.equal(analyze('gikun', entries).candidates[0].fitenka, 'gku`n')
assert.equal(fromFitenka('gku`n', entries).latin, 'gikun')
assert.equal(analyze('plodan', entries).candidates[0].fitenka, "pl'd_N")
assert.equal(fromFitenka("pl'd_N", entries).latin, 'plodan')

const fitenkaMap = parseFitenkaNam([
    '0xF0001 .',
    '0xF000B -',
    '0xF0100 df',
    '0xF0101 dfi',
    '0xF0102 hf',
    '0xF0103 hca',
    '0xF0104 td',
].join('\n'))
assert.equal(
    fitenkaGlyphsToNotation('\u{F0100}\u{F0001}', fitenkaMap.glyphToToken),
    'df.',
)
assert.equal(
    fitenkaGlyphsToNotation('\u{F0101}\u{F0102}', fitenkaMap.glyphToToken),
    'dfi_hf',
)
assert.equal(
    fitenkaGlyphsToNotation('\u{F0103}\u{F000B}\u{F0104}', fitenkaMap.glyphToToken),
    'hca-td',
)
assert.equal(
    fitenkaNotationToGlyphs('df_.', fitenkaMap.tokenToGlyph),
    '\u{F0100}\u{F0001}',
)
assert.equal(
    fitenkaNotationToGlyphs('hca-td', fitenkaMap.tokenToGlyph),
    '\u{F0103}\u{F000B}\u{F0104}',
)
assert.deepEqual(
    fitenkaNotationUnits('dfi_unknown_hf', fitenkaMap.tokenToGlyph),
    [
        { notation: 'dfi', glyph: '\u{F0101}', encoded: true },
        { notation: 'unknown', glyph: '', encoded: false },
        { notation: 'hf', glyph: '\u{F0102}', encoded: true },
    ],
)
assert.deepEqual(
    fitenkaNotationUnits('unknown.', fitenkaMap.tokenToGlyph).map(unit => [
        unit.notation,
        unit.encoded,
    ]),
    [['unknown', false], ['.', true]],
)

const realFitenkaMap = parseFitenkaNam(
    fs.readFileSync(path.join(__dirname, 'Fitenka.nam'), 'utf8'),
)
for (const notation of ["rvi_pl'd", 'k`bti_rz`v', 'dfi_hf', '|vl', 'ncu', 'hca-td']) {
    const glyphs = fitenkaNotationToGlyphs(notation, realFitenkaMap.tokenToGlyph)
    assert.ok(glyphs, `Fitenka.nam should contain every unit in ${notation}`)
    assert.equal(fitenkaGlyphsToNotation(glyphs, realFitenkaMap.glyphToToken), notation)
}

const nounStemCompound = analyze('Devideriploda', entries).candidates[0]
assert.deepEqual(
    nounStemCompound.components.map(component => component.display),
    ['dev-', '-i-', 'der-', '-i-', 'ploda'],
)
assert.equal(
    nounStemCompound.components.find(component => component.display === 'dev-').rootLookup,
    'dav',
)
assert.match(nounStemCompound.notesZh.join(' '), /deve.*dav/)

const imperfective = analyze('vil', entries).candidates[0]
assert.equal(imperfective.kind, 'imperfective')
assert.equal(imperfective.components[0].lookup, 'vel')
assert.equal(imperfective.fitenka, '|vl')
assert.equal(fromFitenka('|vl', entries).latin, 'vil')

console.log('Morphology tests passed: Raviploda, bekusofe, nocu, vil, Kubitirezova, Devideriploda')
