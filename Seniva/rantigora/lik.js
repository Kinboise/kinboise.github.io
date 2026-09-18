async function lik() {
    const searchId = ++latestSearchId
    const input = document.getElementById('keyword')
    const requestedKeyword = input.value.trim()
    const fitenkaMaps = await getFitenkaMaps()
    if (searchId !== latestSearchId) return
    const conversion = convertFitenkaSearch(requestedKeyword, fitenkaMaps)
        || convertHanivakoSearch(requestedKeyword)
    const searchKeywords = Array.from(new Set([
        requestedKeyword,
        conversion?.notation,
        conversion?.latin,
    ].filter(Boolean)))
    const normalizedKeywords = searchKeywords.map(value => SenivaMorphology.normalizeWord(value))
    const list = document.querySelectorAll('main > section')
    let exactFound = false

    for (const section of list) {
        section.removeAttribute('class')
        const search = section.getElementsByClassName('search')[0]
        if (!search) continue
        const word = search.textContent
        const words = word.split(';')
        const normalizedWords = words.map(value => SenivaMorphology.normalizeWord(value))
        const sectionFitenka = extractFitenkaNotations(section)
        const exactFitenka = Boolean(conversion?.notation && sectionFitenka.some(value => (
            SenivaMorphology.normalizeFitenka(value) === conversion.notation
        )))
        const matches = !requestedKeyword || exactFitenka || normalizedKeywords.some(keyword => (
            word.toLocaleLowerCase('en-US').includes(keyword)
        ))
        if (matches) {
            if (exactFitenka || normalizedKeywords.some(keyword => normalizedWords.includes(keyword))) {
                section.setAttribute('class', 'exact')
                exactFound = true
            }
        } else {
            section.setAttribute('class', 'hidden')
        }
    }

    renderMorphologyAnalysis(requestedKeyword, exactFound, conversion, fitenkaMaps)
}

let morphologyEntries = null
let fitenkaMapsPromise = null
let latestSearchId = 0

function getFitenkaMaps() {
    if (!fitenkaMapsPromise) {
        fitenkaMapsPromise = fetch(new URL('Fitenka.nam', document.baseURI))
            .then(response => {
                if (!response.ok) throw new Error(`Fitenka.nam: ${response.status}`)
                return response.text()
            })
            .then(SenivaMorphology.parseFitenkaNam)
            .catch(() => ({ tokenToGlyph: new Map(), glyphToToken: new Map() }))
    }
    return fitenkaMapsPromise
}

function isExactChineseGloss(keyword, entries) {
    const normalized = keyword.trim()
    return entries.some(entry => entry.glossZh.some(gloss => (
        gloss === normalized
        || gloss.split(/[，,；;、]/).map(value => value.trim()).includes(normalized)
    )))
}

function convertHanivakoSearch(keyword) {
    if (!keyword) return null
    const entries = getMorphologyEntries()
    const normalized = SenivaMorphology.normalizeHanivako(keyword)
    const exactHanivako = entries.some(entry => (
        SenivaMorphology.normalizeHanivako(entry.hanivako) === normalized
    ))
    if (!exactHanivako && isExactChineseGloss(keyword, entries)) return null
    return SenivaMorphology.fromHanivako(keyword, entries)
}

function convertFitenkaSearch(keyword, maps) {
    if (!keyword || !maps) return null
    const entries = getMorphologyEntries()
    let notation = SenivaMorphology.fitenkaGlyphsToNotation(keyword, maps.glyphToToken)
    let source = 'glyph'
    if (!notation) {
        const latinExact = entries.some(entry => (
            SenivaMorphology.normalizeWord(entry.key) === SenivaMorphology.normalizeWord(keyword)
        ))
        if (latinExact || !/^[A-Za-z0-9_`'|.·˙,?!:\/-]+$/u.test(keyword)) return null
        notation = SenivaMorphology.normalizeFitenka(keyword)
        source = 'notation'
    }
    const result = SenivaMorphology.fromFitenka(notation, entries)
    return result ? { ...result, notation, source } : null
}

function textWithoutChildren(element, selectors) {
    const copy = element.cloneNode(true)
    for (const selector of selectors) {
        for (const child of copy.querySelectorAll(selector)) child.remove()
    }
    return copy.textContent.trim()
}

function extractFitenkaNotations(section) {
    const declared = section.querySelector('.search')?.dataset.fitenka
        ?.split(';')
        .map(value => value.trim())
        .filter(Boolean)
    if (declared?.length) return declared
    const fields = section.querySelector('.search')?.textContent.split(';') || []
    const candidate = fields[1]?.trim() || ''
    if (!candidate || !/^[A-Za-z0-9_`'|.·˙,?!:\/-]+$/u.test(candidate)) return []
    return [candidate]
}

function getMorphologyEntries() {
    if (morphologyEntries) return morphologyEntries
    morphologyEntries = Array.from(document.querySelectorAll('main > section')).map(section => {
        const label = section.querySelector('.pnst')?.textContent.trim()
            || section.querySelector('.label')?.textContent.trim()
            || section.id
        const senses = Array.from(section.querySelectorAll('.sense'))
        return {
            key: section.id,
            label,
            // Hnv1/Hnv3 (including source "nt Han:" data) are Seniva
            // orthographies, not Chinese definitions. Only use actual senses.
            glossZh: senses.map(sense => textWithoutChildren(
                sense,
                ['abbr', 'em', '.hnv1', '.hnv3'],
            )),
            glossEn: senses.map(sense => sense.querySelector('em')?.textContent.trim()),
            pos: senses.map(sense => sense.querySelector('abbr')?.getAttribute('title')),
            hanivako: section.querySelector('.hnv3')?.textContent.trim(),
            fitenka: extractFitenkaNotations(section),
        }
    })
    return morphologyEntries
}

function ensureMorphologyPanel() {
    let panel = document.getElementById('morphology-analysis')
    if (panel) return panel

    panel = document.createElement('aside')
    panel.id = 'morphology-analysis'
    panel.className = 'card morphology-analysis hidden'
    panel.setAttribute('aria-live', 'polite')
    const searchCard = document.getElementById('likForm').closest('.card')
    searchCard.insertAdjacentElement('afterend', panel)
    return panel
}

function placeMorphologyPanel(panel, exactFound) {
    const exactSections = Array.from(document.querySelectorAll('main > section.exact'))
    const anchor = exactFound && exactSections.length
        ? exactSections[exactSections.length - 1]
        : document.getElementById('likForm').closest('.card')
    anchor.insertAdjacentElement('afterend', panel)
}

function appendText(parent, tag, className, text) {
    const element = document.createElement(tag)
    if (className) element.className = className
    element.textContent = text
    parent.appendChild(element)
    return element
}

const generatedFitenkaSvg = new Map()

function makeFitenkaSvg(notation) {
    if (generatedFitenkaSvg.has(notation)) {
        return generatedFitenkaSvg.get(notation).cloneNode(true)
    }
    if (typeof prepare !== 'function' || typeof latToFit !== 'function') return null
    try {
        const source = latToFit(prepare(), notation)
        const documentNode = new DOMParser().parseFromString(source, 'image/svg+xml')
        const svg = documentNode.documentElement
        if (svg.localName !== 'svg' || svg.querySelector('parsererror')) return null
        svg.removeAttribute('width')
        svg.removeAttribute('height')
        svg.setAttribute('aria-hidden', 'true')
        generatedFitenkaSvg.set(notation, svg)
        return svg.cloneNode(true)
    } catch (error) {
        console.warn(`无法生成未编码的特正文单元：${notation}`, error)
        return null
    }
}

function appendFitenka(parent, notation, tokenToGlyph) {
    const units = SenivaMorphology.fitenkaNotationUnits(notation, tokenToGlyph)
    const missing = []
    for (const unit of units) {
        if (unit.encoded) {
            const glyph = appendText(parent, 'span', 'morph-fitenka ftnk', unit.glyph)
            glyph.title = unit.notation
            continue
        }

        missing.push(unit.notation)
        const wrapper = document.createElement('span')
        wrapper.className = 'morph-fitenka-missing'
        wrapper.title = `未编码的特正文单元：${unit.notation}`
        const svg = makeFitenkaSvg(unit.notation)
        if (svg) {
            wrapper.appendChild(document.importNode(svg, true))
        } else {
            appendText(wrapper, 'span', 'morph-fitenka-missing-text', unit.notation)
        }
        parent.appendChild(wrapper)
    }
    if (missing.length) {
        appendText(
            parent,
            'span',
            'morph-fitenka-warning',
            `未编码：${Array.from(new Set(missing)).join('、')}`,
        )
    }
}

function componentGlosses(component) {
    return {
        chinese: (component.glossZh || []).filter(Boolean).join('、'),
        english: (component.glossEn || []).filter(Boolean).join('; '),
    }
}

function appendComponent(parent, component) {
    const wrapper = document.createElement('span')
    wrapper.className = `morph-component morph-${component.role}`

    if (component.lookup && document.getElementById(component.lookup)) {
        const button = document.createElement('button')
        button.type = 'button'
        button.className = 'morph-token'
        button.textContent = component.display
        button.title = `在词典中查找 ${component.lookup}`
        button.addEventListener('click', () => crom(component.lookup))
        wrapper.appendChild(button)
    } else {
        appendText(wrapper, 'span', 'morph-token morph-token-static', component.display)
    }

    const glosses = componentGlosses(component)
    if (glosses.chinese || glosses.english) {
        const glossElement = document.createElement('span')
        glossElement.className = 'morph-glosses'
        if (glosses.chinese) {
            appendText(glossElement, 'span', 'morph-gloss morph-gloss-zh', glosses.chinese)
        }
        if (glosses.english) {
            appendText(glossElement, 'span', 'morph-gloss morph-gloss-en', glosses.english)
        }
        wrapper.appendChild(glossElement)
    }
    parent.appendChild(wrapper)
}

function renderMorphologyAnalysis(keyword, exactFound, conversion, fitenkaMaps) {
    const panel = ensureMorphologyPanel()
    placeMorphologyPanel(panel, exactFound)
    panel.replaceChildren()
    const analysisWord = conversion?.latin || keyword
    const result = SenivaMorphology.analyze(analysisWord, getMorphologyEntries())
    if (!keyword || !result.valid || result.exact) {
        panel.classList.add('hidden')
        return
    }

    panel.classList.remove('hidden')
    appendText(panel, 'h2', 'morph-title', `构词分析：${keyword}`)

    if (conversion?.source === 'glyph') {
        appendText(panel, 'p', 'morph-transliteration', `特正文转写：${conversion.notation}`)
    }
    if (conversion) {
        appendText(panel, 'p', 'morph-transliteration', `可能的拉丁转写：${conversion.latin}`)
    }

    if (result.properNoun) {
        appendText(panel, 'p', 'morph-note', '大写开头，是专有名词。')
    }

    if (!result.candidates.length) {
        appendText(panel, 'p', 'morph-empty', '未找到拆分。')
    } else {
        result.candidates.forEach((candidate, candidateIndex) => {
            const candidateElement = document.createElement('div')
            candidateElement.className = 'morph-candidate'
            if (result.candidates.length > 1) {
                appendText(candidateElement, 'div', 'morph-candidate-label', `分析 ${candidateIndex + 1}`)
            }

            const expression = document.createElement('div')
            expression.className = 'morph-expression'
            candidate.components.forEach((component, componentIndex) => {
                if (componentIndex) appendText(expression, 'span', 'morph-plus', '+')
                appendComponent(expression, component)
            })
            candidateElement.appendChild(expression)

            if (candidate.fitenka) {
                const fitenkaLine = document.createElement('div')
                fitenkaLine.className = 'morph-fitenka-line'
                appendText(fitenkaLine, 'span', 'morph-script-label', '特正文：')
                appendFitenka(
                    fitenkaLine,
                    candidate.fitenka,
                    fitenkaMaps.tokenToGlyph,
                )
                appendText(
                    fitenkaLine,
                    'span',
                    'morph-fitenka-notation',
                    `（${candidate.fitenka}）`,
                )
                candidateElement.appendChild(fitenkaLine)
            }

            if (candidate.hanivako) {
                const hanivakoLine = document.createElement('div')
                hanivakoLine.className = 'morph-hanivako'
                appendText(hanivakoLine, 'span', 'morph-script-label', '全汉帜文：')
                const hanivako = appendText(
                    hanivakoLine,
                    'span',
                    'morph-hanivako-text',
                    candidate.hanivako,
                )
                hanivako.title = '全汉帜文'
                hanivako.lang = 'zh-Hant'
                candidateElement.appendChild(hanivakoLine)
            }

            for (const note of candidate.notesZh || []) {
                appendText(candidateElement, 'p', 'morph-note', note)
            }
            if (candidate.summaryZh) {
                appendText(candidateElement, 'p', 'morph-summary morph-summary-zh', candidate.summaryZh)
            }
            if (candidate.summaryEn) {
                appendText(candidateElement, 'p', 'morph-summary morph-summary-en', candidate.summaryEn)
            }
            panel.appendChild(candidateElement)
        })
    }

    appendText(panel, 'p', 'morph-disclaimer', '仅供参考。')
}

function crom(word) {
    document.getElementById('keyword').value = word
    void lik()
    // location.href += '#' + word
}
const rub = {
    'i': '<ruby style="ruby-position:over">$1<rt>⟋</rt></ruby>',
    'e': '<ruby style="ruby-position:under">$1<rt>⟍</rt></ruby>',
    'a': '<ruby style="ruby-position:under">$1<rt>—</rt></ruby>',
    'o': '<ruby style="ruby-position:under">$1<rt>⟋</rt></ruby>',
    'u': '<ruby style="ruby-position:over">$1<rt>⟍</rt></ruby>',
    '\\.': '<ruby style="ruby-position:under">$1<rt>・</rt></ruby>',
}
const fene = {
    'I': '<sup>⟋</sup>',
    'E': '<sub>⟍</sub>',
    'A': '<sub>—</sub>',
    'O': '<sub>⟋</sub>',
    'U': '<sup>⟍</sup>',
    '，': ' | ',
    '。': ' ‖ '
}
function lat_rub() {
    for (var i in document.getElementsByClassName('hnv1')) {
        var hnv1 = document.getElementsByClassName('hnv1')[i]
        var fipe = hnv1.innerHTML
        for (var tomo in rub) {
            const re = new RegExp(tomo, 'g')
            fipe = fipe.replace(re, tomo + '\u200c')
        }
        for (var tomo in fene) {
            const re = new RegExp(tomo, 'g')
            fipe = fipe.replace(re, fene[tomo])
        }
        fipe = fipe.replace(/\\\./g, '.')
        for (var tomo in rub) {
            const re = new RegExp('(.)' + tomo + '\u200c', 'g')
            fipe = fipe.replace(re, rub[tomo])
        }
        hnv1.innerHTML = fipe
    }
}

window.addEventListener('load', lat_rub)

function haf(lat) {
    audio = document.getElementById('cute')
    audio.src = `https://r2.20121010.xyz/seniva-cute/${lat}.ogg`
    audio.play()
}
