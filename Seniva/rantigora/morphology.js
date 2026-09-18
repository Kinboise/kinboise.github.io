(function (root, factory) {
    const api = factory()
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = api
    }
    root.SenivaMorphology = api
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    const LATIN_WORD = /^[A-Za-zÀ-ÖØ-öø-ÿĀ-ž'’.-]+$/u
    const PERFECTIVE_FROM_IMPERFECTIVE = {
        i: 'e',
        e: 'a',
        a: 'o',
        o: 'u',
        u: 'i',
    }
    const WHOLE_COMPOUND_SEGMENT_BONUS = 180
    const MAX_STEM_DEPTH = 5
    const STEM_CANDIDATE_LIMIT = 12
    const HANIVAKO_GRAMMAR = {
        '-i-': '之',
        '-i': '之',
        '-e': '兮',
        '-a': '也',
        '-o': '乎',
        '-u': '然',
    }
    const FITENKA_GRAMMAR = {
        '-i-': 'i',
        '-i': 'i',
        '-e': 'e',
        '-a': 'a',
        '-o': 'o',
        '-u': 'u',
        '-n': '_N',
        '-un': 'u`n',
    }
    const FITENKA_DEFAULT_PREFIXES = {
        'he-': 'h`',
        'be-': 'b`',
        'ra-': 'ra`',
    }
    const RESTRICTED_SINGLE_LETTER_AFFIXES = new Set(['-i-', '-u', '-e', '-a', '-o'])

    function normalizeWord(value) {
        return String(value || '')
            .trim()
            .replace(/’/g, "'")
            .toLocaleLowerCase('en-US')
    }

    function markProperLatin(value, properNoun) {
        return properNoun && value
            ? `${value[0].toLocaleUpperCase('en-US')}${value.slice(1)}`
            : value
    }

    function unique(values) {
        return Array.from(new Set((values || []).filter(Boolean)))
    }

    function normalizeEntry(entry) {
        const key = normalizeWord(entry.key || entry.label)
        const hanivakoValue = Array.isArray(entry.hanivako)
            ? entry.hanivako[0]
            : entry.hanivako || entry.hnv3
        const fitenkaValues = Array.isArray(entry.fitenka)
            ? entry.fitenka
            : [entry.fitenka || entry.ftnk]
        return {
            key,
            label: entry.label || key,
            glossZh: unique(entry.glossZh),
            glossEn: unique(entry.glossEn),
            pos: unique(entry.pos),
            hanivako: String(hanivakoValue || '').trim(),
            fitenka: unique(fitenkaValues.map(normalizeFitenka).filter(Boolean)),
        }
    }

    function makeLexicon(entries) {
        const index = new Map()
        for (const rawEntry of entries || []) {
            const entry = normalizeEntry(rawEntry)
            if (entry.key && !index.has(entry.key)) {
                index.set(entry.key, entry)
            }
        }
        const singleConsonants = new Set([...index.keys()].filter(key => /^[a-z]$/i.test(key)))
        for (const entry of index.values()) {
            const surface = entry.key.replace(/-/g, '')
            const base = surface.replace(/u$/, '')
            entry.restrictedEndingBase = singleConsonants.has(surface)
                || (surface.endsWith('u') && singleConsonants.has(base))
        }
        return index
    }

    function hasPartOfSpeech(entry, englishName) {
        const needle = englishName.toLocaleLowerCase('en-US')
        return entry && entry.pos.some(value => value.toLocaleLowerCase('en-US').includes(needle))
    }

    function nounStemHanivako(entry) {
        const ending = HANIVAKO_GRAMMAR[`-${entry.key.slice(-1)}`]
        return ending && entry.hanivako.endsWith(ending)
            ? entry.hanivako.slice(0, -ending.length)
            : entry.hanivako
    }

    function normalizeFitenka(value) {
        let result = String(value || '')
            .trim()
            .replace(/’/g, "'")
            .replace(/\s+/g, '')
        if (!result) return ''
        // The rendered dictionary writes the no-vowel mark as its own glyph
        // (`df_.`), while source Ftnk fields write it directly after the root
        // (`df.`).  Morphology uses one canonical spelling for both.
        return result.replace(/_+\./g, '.').replace(/__+/g, '_')
    }

    function primaryFitenka(entry) {
        return entry?.fitenka?.[0] || ''
    }

    function stripFitenkaNoVowel(value) {
        return normalizeFitenka(value).replace(/_?\.$/, '')
    }

    function nounStemFitenka(entry) {
        let value = stripFitenkaNoVowel(primaryFitenka(entry))
        const ending = entry.key.slice(-1)
        if ('eao'.includes(ending) && value.endsWith(ending)) {
            value = value.slice(0, -1)
        }
        return value
    }

    function componentFitenka(entry, role) {
        if (role === 'noun-stem') return nounStemFitenka(entry)
        if (role === 'prefix' && FITENKA_DEFAULT_PREFIXES[entry.key]) {
            return FITENKA_DEFAULT_PREFIXES[entry.key]
        }
        return primaryFitenka(entry)
    }

    function entryComponent(entry, role, display) {
        return {
            type: 'entry',
            role,
            lookup: entry.key,
            display: display || entry.label,
            glossZh: entry.glossZh,
            glossEn: entry.glossEn,
            hanivako: role === 'noun-stem' ? nounStemHanivako(entry) : entry.hanivako,
            fitenka: componentFitenka(entry, role),
            restrictedEndingBase: Boolean(entry.restrictedEndingBase),
        }
    }

    function grammarComponent(display, role, lookup, glossZh, glossEn) {
        return {
            type: 'grammar',
            role,
            lookup,
            display,
            glossZh: glossZh ? [glossZh] : [],
            glossEn: glossEn ? [glossEn] : [],
            hanivako: HANIVAKO_GRAMMAR[lookup] || '',
            fitenka: FITENKA_GRAMMAR[lookup] || '',
        }
    }

    function candidateHanivako(candidate) {
        let result = ''
        const components = candidate.components || []
        for (let index = 0; index < components.length; index += 1) {
            const component = components[index]
            if (component.role === 'hyphen') continue
            let value = component.hanivako || HANIVAKO_GRAMMAR[component.lookup]
            if (!value) return ''
            const nextComponent = components[index + 1]
            if (value.endsWith('矣') && nextComponent && nextComponent.role !== 'hyphen') {
                value = value.slice(0, -1)
            }
            result += value
        }
        return result
    }

    function appendToLastFitenkaUnit(value, addition) {
        const cleaned = stripFitenkaNoVowel(value)
        return `${cleaned}${addition}`
    }

    function candidateFitenka(candidate, lexicon, word) {
        let result = ''
        let pendingPrefixes = ''
        const components = candidate.components || []

        for (const component of components) {
            const value = component.fitenka || FITENKA_GRAMMAR[component.lookup] || ''
            if (component.role === 'hyphen') {
                result += '-'
                continue
            }
            if (component.role === 'prefix') {
                if (!value) return ''
                pendingPrefixes += value
                continue
            }
            if (component.role === 'linker') {
                result = `${appendToLastFitenkaUnit(result, 'i')}_`
                continue
            }
            if (component.role === 'suffix') {
                if (!value) return ''
                result = appendToLastFitenkaUnit(result, value)
                continue
            }
            if (component.role === 'noun-ending'
                || component.role === 'adverb-ending'
                || component.role === 'gerund-ending') {
                if (!value) return ''
                if (component.lookup === '-e') continue
                if ((component.lookup === '-a' || component.lookup === '-o')
                    && word
                    && lexicon
                    && !lexicon.has(`${word.slice(0, -1)}e`)) {
                    continue
                }
                result = appendToLastFitenkaUnit(result, value)
                continue
            }
            if (component.role === 'general-ending') {
                result = `${stripFitenkaNoVowel(result)}_N`
                continue
            }
            if (component.role === 'simulfix') {
                const units = result.split('_')
                const last = units.pop() || ''
                units.push(last.startsWith('|') ? last : `|${last}`)
                result = units.join('_')
                continue
            }
            if (!value) return ''
            result += `${pendingPrefixes}${value}`
            pendingPrefixes = ''
        }
        return pendingPrefixes ? '' : normalizeFitenka(result)
    }

    function candidateSignature(candidate) {
        return candidate.components
            .map(component => `${component.role}:${component.lookup || component.display}`)
            .join('|')
    }

    function isRestrictedShortComponent(component) {
        const form = normalizeWord(component.display || component.lookup).replace(/^-+|-+$/g, '')
        return Boolean(component.restrictedEndingBase) || /^[a-z]$/i.test(form)
    }

    function hasRestrictedSingleLetterCombination(candidate) {
        const components = candidate.components || []
        return components.some((component, index) => {
            if (!RESTRICTED_SINGLE_LETTER_AFFIXES.has(component.lookup)) return false
            const previousIsSingle = index > 0 && isRestrictedShortComponent(components[index - 1])
            const nextIsSingle = index + 1 < components.length
                && isRestrictedShortComponent(components[index + 1])
            return component.lookup === '-i-'
                ? previousIsSingle || nextIsSingle
                : previousIsSingle
        })
    }

    function bestCandidates(candidates, limit) {
        const seen = new Set()
        return candidates
            .sort((left, right) => right.score - left.score)
            .filter(candidate => {
                if (hasRestrictedSingleLetterCombination(candidate)) return false
                const signature = candidateSignature(candidate)
                if (seen.has(signature)) return false
                seen.add(signature)
                return true
            })
            .slice(0, limit || 3)
    }

    function isWholeStemCandidate(candidate, form) {
        return candidate.kind === 'root'
            && candidate.surface === form
            && candidate.components.length === 1
    }

    function consumesWholeStem(candidate, form) {
        return candidate.surface === form && candidate.components.length === 1
    }

    function preferWholeStem(candidates, form) {
        return [...candidates].sort((left, right) => {
            const exactStemDifference = Number(isWholeStemCandidate(right, form))
                - Number(isWholeStemCandidate(left, form))
            const wholeStemDifference = Number(consumesWholeStem(right, form))
                - Number(consumesWholeStem(left, form))
            return exactStemDifference || wholeStemDifference || right.score - left.score
        })
    }

    function candidateVariants(candidates, form, limit) {
        const preferred = preferWholeStem(candidates, form)
        const detailed = [...candidates].sort((left, right) => (
            right.components.length - left.components.length
            || right.score - left.score
        ))
        const seen = new Set()
        return [preferred[0], detailed[0], ...preferred.slice(1)]
            .filter(Boolean)
            .filter(candidate => {
                const signature = candidateSignature(candidate)
                if (seen.has(signature)) return false
                seen.add(signature)
                return true
            })
            .slice(0, limit || 4)
    }

    function rankFinalCandidates(candidates, limit) {
        const ranked = bestCandidates(candidates, 24)
        if (ranked.length < 2) return ranked.slice(0, limit)
        const mostDetailed = [...ranked.slice(1)].sort((left, right) => (
            right.components.length - left.components.length
            || right.score - left.score
        ))[0]
        const detailedForDisplay = {
            ...mostDetailed,
            components: mostDetailed.components.map(component => ({
                ...component,
                display: component.role === 'root'
                    ? component.display.replace(/-$/, '')
                    : component.display,
            })),
        }
        const ordered = [ranked[0], detailedForDisplay]
        const detailedSignature = candidateSignature(mostDetailed)
        ordered.push(...ranked.slice(1).filter(candidate => (
            candidateSignature(candidate) !== detailedSignature
        )))
        return ordered.slice(0, limit)
    }

    function makeAnalysisContext(lexicon) {
        const nounStems = new Map()
        for (const [key, entry] of lexicon) {
            if (key.includes('-') || !/[eao]$/.test(key) || !hasPartOfSpeech(entry, 'Noun')) continue
            const stem = key.slice(0, -1)
            if (!stem) continue
            const entries = nounStems.get(stem) || []
            entries.push(entry)
            nounStems.set(stem, entries)
        }
        return { lexicon, nounStems }
    }

    function cognateVerbForStem(form, lexicon) {
        const shifted = replaceLastVowel(form)
        if (!shifted) return null
        const entry = lexicon.get(shifted.base)
        return hasPartOfSpeech(entry, 'Verb') ? entry : null
    }

    function analyzeStem(form, context, depth, trail) {
        if (!form || depth > MAX_STEM_DEPTH || trail.has(form)) return []
        const { lexicon, nounStems } = context
        const nextTrail = new Set(trail)
        nextTrail.add(form)
        const candidates = []
        const exact = lexicon.get(form)

        if (exact) {
            candidates.push({
                kind: 'root',
                surface: form,
                score: 30,
                components: [entryComponent(exact, 'root')],
                notesZh: [],
                summaryZh: exact.glossZh.join('、'),
                summaryEn: exact.glossEn.join('; '),
            })
        }

        for (const noun of nounStems.get(form) || []) {
            const nounEnding = noun.key.slice(-1)
            const cognateVerb = cognateVerbForStem(form, lexicon)
            const notesZh = [`${form}- 是名词 ${noun.label} 的词干。`]
            if (cognateVerb) {
                notesZh.push(`${form}- 由 ${cognateVerb.label}- 经元音交替形成。`)
            }
            candidates.push({
                kind: 'noun-stem',
                surface: form,
                score: 28,
                components: [{
                    ...entryComponent(noun, 'noun-stem', form),
                    rootLookup: cognateVerb?.key || null,
                }],
                notesZh,
                summaryZh: noun.glossZh.join('、'),
                summaryEn: noun.glossEn.join('; '),
            })
        }

        const finalVowel = form.slice(-1)
        if ('eao'.includes(finalVowel) && form.length > 2) {
            const stemForm = form.slice(0, -1)
            const stemVariants = candidateVariants(
                analyzeStem(stemForm, context, depth + 1, nextTrail),
                stemForm,
                4,
            )
            for (const base of stemVariants) {
                candidates.push({
                    kind: 'noun-ending',
                    score: base.score + 25,
                    components: [
                        ...base.components,
                        endingComponent(lexicon, finalVowel, 'noun-ending', '名词词尾', 'noun ending'),
                    ],
                    notesZh: unique([...base.notesZh, `词干加 -${finalVowel} 构成名词。`]),
                    summaryZh: `${base.summaryZh}（名词）`,
                    summaryEn: base.summaryEn ? `${base.summaryEn} (noun)` : '',
                })
            }
        }

        for (const [key, prefix] of lexicon) {
            if (key.startsWith('-') || !key.endsWith('-')) continue
            const surface = key.slice(0, -1)
            if (!surface || !form.startsWith(surface) || form.length <= surface.length + 1) continue
            const rest = form.slice(surface.length)
            for (const base of candidateVariants(
                analyzeStem(rest, context, depth + 1, nextTrail),
                rest,
                3,
            )) {
                // A second consecutive prefix is possible, but prefer the analysis
                // that keeps the longest attested stem intact (be- + kusof rather
                // than be- + ku- + sof).
                const nestedPrefixPenalty = base.components.some(component => component.role === 'prefix')
                    ? 65
                    : 0
                // Likewise, do not let a prefix wrapped around an already valid
                // compound outrank a compound whose longer side is itself an
                // attested dictionary entry (kubit + -i- + rezova).
                const wrappedCompoundPenalty = base.components.some(component => component.role === 'linker')
                    ? 120
                    : 0
                candidates.push({
                    kind: 'prefix',
                    score: base.score + 45 + surface.length
                        - nestedPrefixPenalty
                        - wrappedCompoundPenalty,
                    components: [entryComponent(prefix, 'prefix', prefix.label), ...base.components],
                    notesZh: unique([...base.notesZh, `${prefix.label} 是前缀。`]),
                    summaryZh: [...prefix.glossZh, base.summaryZh].filter(Boolean).join(' + '),
                    summaryEn: [...prefix.glossEn, base.summaryEn].filter(Boolean).join(' + '),
                })
            }
        }

        for (let index = 1; index < form.length - 1; index += 1) {
            if (form[index] !== 'i') continue
            const leftForm = form.slice(0, index)
            const rightForm = form.slice(index + 1)
            const leftCandidates = candidateVariants(
                analyzeStem(leftForm, context, depth + 1, nextTrail),
                leftForm,
                4,
            )
            const rightCandidates = candidateVariants(
                analyzeStem(rightForm, context, depth + 1, nextTrail),
                rightForm,
                4,
            )
            if (!leftCandidates.length || !rightCandidates.length) continue
            const linker = lexicon.get('-i-')
            const linkerComponent = linker
                ? entryComponent(linker, 'linker', '-i-')
                : grammarComponent('-i-', 'linker', '-i-', '复合词连接标志', 'compound linker')
            for (const left of leftCandidates) {
                for (const right of rightCandidates) {
                    const wholeLeft = isWholeStemCandidate(left, leftForm)
                    const wholeRight = isWholeStemCandidate(right, rightForm)
                    const preserved = []
                    if (wholeLeft && leftCandidates.some(candidate => !isWholeStemCandidate(candidate, leftForm))) {
                        preserved.push(leftForm)
                    }
                    if (wholeRight && rightCandidates.some(candidate => !isWholeStemCandidate(candidate, rightForm))) {
                        preserved.push(rightForm)
                    }
                    const leftComponents = left.components.map((component, componentIndex) => ({
                        ...component,
                        display: left.components.length === 1
                            && componentIndex === left.components.length - 1
                            ? `${component.display.replace(/-$/, '')}-`
                            : component.display,
                    }))
                    const notesZh = unique([
                        ...left.notesZh,
                        ...right.notesZh,
                        '复合结构为“词根 + -i- + 词根”，后项通常是中心语。',
                    ])
                    if (preserved.length) {
                        notesZh.push(`词典已收录 ${preserved.join('、')}。`)
                    }
                    candidates.push({
                        kind: 'compound',
                        score: left.score + right.score + 55
                            + (wholeLeft ? WHOLE_COMPOUND_SEGMENT_BONUS : 0)
                            + (wholeRight ? WHOLE_COMPOUND_SEGMENT_BONUS : 0),
                        components: [...leftComponents, linkerComponent, ...right.components],
                        notesZh,
                        summaryZh: `与“${left.summaryZh}”有关的“${right.summaryZh}”`,
                        summaryEn: left.summaryEn && right.summaryEn
                            ? `“${right.summaryEn}” related to “${left.summaryEn}”`
                            : left.summaryEn || right.summaryEn,
                    })
                }
            }
        }

        for (const [key, suffix] of lexicon) {
            if (!key.startsWith('-') || !key.endsWith('-') || key === '-i-') continue
            const surface = key.slice(1, -1)
            if (!surface || !form.endsWith(surface) || form.length <= surface.length + 1) continue
            const baseForm = form.slice(0, -surface.length)
            for (const base of candidateVariants(
                analyzeStem(baseForm, context, depth + 1, nextTrail),
                baseForm,
                4,
            )) {
                candidates.push({
                    kind: 'suffix',
                    score: base.score + 40 + surface.length,
                    components: [...base.components, entryComponent(suffix, 'suffix', suffix.label)],
                    notesZh: unique([...base.notesZh, `${suffix.label} 是后缀。`]),
                    summaryZh: [base.summaryZh, ...suffix.glossZh].filter(Boolean).join(' + '),
                    summaryEn: [base.summaryEn, ...suffix.glossEn].filter(Boolean).join(' + '),
                })
            }
        }

        return bestCandidates(candidates, STEM_CANDIDATE_LIMIT)
    }

    function replaceLastVowel(form) {
        for (let index = form.length - 1; index >= 0; index -= 1) {
            const replacement = PERFECTIVE_FROM_IMPERFECTIVE[form[index]]
            if (replacement) {
                return {
                    base: `${form.slice(0, index)}${replacement}${form.slice(index + 1)}`,
                    from: replacement,
                    to: form[index],
                }
            }
        }
        return null
    }

    function endingComponent(lexicon, ending, role, fallbackZh, fallbackEn) {
        const key = `-${ending}`
        const entry = lexicon.get(key)
        return entry
            ? entryComponent(entry, role, key)
            : grammarComponent(key, role, key, fallbackZh, fallbackEn)
    }

    function normalizeHanivako(value) {
        return String(value || '').replace(/\s+/g, '')
    }

    function isAffixEntry(entry) {
        return entry.key.startsWith('-') || entry.key.endsWith('-')
    }

    function romanSurface(entry, nextEntry, onlyToken) {
        if (isAffixEntry(entry)) return entry.key.replace(/-/g, '')
        const nextKey = nextEntry?.key || ''
        const needsBareNounStem = !onlyToken
            && hasPartOfSpeech(entry, 'Noun')
            && /[eao]$/.test(entry.key)
            && nextKey.startsWith('-')
            && nextKey !== '-n'
        return needsBareNounStem ? entry.key.slice(0, -1) : entry.key
    }

    function latinFromHanivakoPath(path) {
        return path.map((entry, index) => romanSurface(
            entry,
            path[index + 1],
            path.length === 1,
        )).join('')
    }

    function isRestrictedShortEntry(entry) {
        return Boolean(entry.restrictedEndingBase)
            || /^[a-z]$/i.test(entry.key.replace(/-/g, ''))
    }

    function isAllowedHanivakoPath(path) {
        return path.every((entry, index) => {
            if (!RESTRICTED_SINGLE_LETTER_AFFIXES.has(entry.key)) return true
            const previousIsSingle = index > 0 && isRestrictedShortEntry(path[index - 1])
            const nextIsSingle = index + 1 < path.length && isRestrictedShortEntry(path[index + 1])
            return entry.key === '-i-'
                ? !previousIsSingle && !nextIsSingle
                : !previousIsSingle
        })
    }

    function fromHanivako(rawValue, entries) {
        const markedInput = normalizeHanivako(rawValue)
        if (!markedInput) return null
        const properNoun = markedInput.startsWith('・')
        const input = properNoun ? markedInput.slice(1) : markedInput
        if (!input) return null
        const lexicon = entries instanceof Map ? entries : makeLexicon(entries)
        const hanivakoEntries = [...lexicon.values()].filter(entry => entry.hanivako)
        const directEntries = hanivakoEntries
            .filter(entry => normalizeHanivako(entry.hanivako) === input)
            .sort((left, right) => Number(isAffixEntry(left)) - Number(isAffixEntry(right)))
        if (directEntries.length) {
            return {
                input,
                latin: directEntries[0].key,
                parts: [directEntries[0].key],
                exact: true,
            }
        }

        const tokenIndex = new Map()
        const tokenSignatures = new Set()
        for (const entry of hanivakoEntries) {
            const hanivako = normalizeHanivako(entry.hanivako)
            const variants = [
                { hanivako, requiresContinuation: false },
                ...(hanivako.endsWith('矣')
                    ? [{ hanivako: hanivako.slice(0, -1), requiresContinuation: true }]
                    : []),
            ]
            for (const variant of variants) {
                const signature = `${variant.hanivako}|${entry.key}|${variant.requiresContinuation}`
                if (!variant.hanivako || tokenSignatures.has(signature)) continue
                tokenSignatures.add(signature)
                const initial = variant.hanivako[0]
                const tokens = tokenIndex.get(initial) || []
                tokens.push({ entry, ...variant })
                tokenIndex.set(initial, tokens)
            }
        }

        const paths = Array.from({ length: input.length + 1 }, () => [])
        paths[0].push({ entries: [], score: 0 })
        for (let index = 0; index < input.length; index += 1) {
            const currentPaths = paths[index]
                .sort((left, right) => right.score - left.score)
                .slice(0, 60)
            if (!currentPaths.length) continue
            for (const token of tokenIndex.get(input[index]) || []) {
                if (!input.startsWith(token.hanivako, index)) continue
                const nextIndex = index + token.hanivako.length
                if (token.requiresContinuation && nextIndex >= input.length) continue
                for (const path of currentPaths) {
                    paths[nextIndex].push({
                        entries: [...path.entries, token.entry],
                        score: path.score
                            + token.hanivako.length * 20
                            + (token.hanivako.length > 1 ? 15 : 0)
                            + (isAffixEntry(token.entry) ? 8 : 0)
                            + (token.entry.key === '-i-' ? 5 : 0),
                    })
                }
            }
        }

        const assembled = new Map()
        for (const path of paths[input.length]
            .sort((left, right) => right.score - left.score)
            .slice(0, 80)) {
            if (!isAllowedHanivakoPath(path.entries)) continue
            const latin = latinFromHanivakoPath(path.entries)
            const previous = assembled.get(latin)
            if (!latin || (previous && previous.score >= path.score)) continue
            assembled.set(latin, { latin, path: path.entries, score: path.score })
        }

        const evaluated = [...assembled.values()]
            .sort((left, right) => right.score - left.score)
            .slice(0, 16)
            .map(item => {
                const latin = markProperLatin(item.latin, properNoun)
                const result = analyze(latin, lexicon)
                const forwardMatch = result.candidates.some(candidate => candidate.hanivako === markedInput)
                const linkerScore = item.path.reduce((score, entry, index) => {
                    if (entry.key === '-i-' && index > 0 && index < item.path.length - 1) return score + 20
                    if (entry.key === '-i' && index < item.path.length - 1) return score - 20
                    return score
                }, 0)
                return {
                    ...item,
                    validAnalysis: Boolean(result.exact || forwardMatch),
                    score: item.score
                        + linkerScore
                        + (result.exact ? 1000 : 0)
                        + (result.candidates.length ? 150 : 0)
                        + (forwardMatch ? 500 : 0),
                }
            })
            .filter(item => item.validAnalysis)
            .sort((left, right) => right.score - left.score)
        if (!evaluated.length) return null
        const best = evaluated[0]
        return {
            input: markedInput,
            latin: markProperLatin(best.latin, properNoun),
            parts: best.path.map(entry => entry.key),
            exact: Boolean(lexicon.get(best.latin)),
        }
    }

    function fitenkaEntryForms(entry) {
        const forms = []
        for (const rawForm of entry.fitenka || []) {
            const form = normalizeFitenka(rawForm)
            if (!form || form.includes('_') || form.includes('-')) continue
            forms.push({ form: stripFitenkaNoVowel(form), entry, stem: false, score: 80 })
            if (hasPartOfSpeech(entry, 'Noun') && /[eao]$/.test(entry.key)) {
                forms.push({
                    form: nounStemFitenka({ ...entry, fitenka: [form] }),
                    entry,
                    stem: true,
                    score: 70,
                })
            }
        }
        return forms.filter(item => item.form)
    }

    function shiftedImperfective(form) {
        const inverse = { e: 'i', a: 'e', o: 'a', u: 'o', i: 'u' }
        for (let index = form.length - 1; index >= 0; index -= 1) {
            if (inverse[form[index]]) {
                return `${form.slice(0, index)}${inverse[form[index]]}${form.slice(index + 1)}`
            }
        }
        return ''
    }

    function fitenkaAffixRepresentations(lexicon, type) {
        const representations = []
        for (const entry of lexicon.values()) {
            const isPrefix = entry.key.endsWith('-') && !entry.key.startsWith('-')
            const isSuffix = entry.key.startsWith('-') && entry.key.endsWith('-')
            if ((type === 'prefix' && !isPrefix) || (type === 'suffix' && !isSuffix)) continue
            if (entry.key === '-i-') continue
            const values = [...entry.fitenka]
            if (type === 'prefix' && FITENKA_DEFAULT_PREFIXES[entry.key]) {
                values.unshift(FITENKA_DEFAULT_PREFIXES[entry.key])
            }
            for (const value of unique(values.map(normalizeFitenka))) {
                if (!value || value.includes('_') || value.includes('-')) continue
                representations.push({ value, entry })
            }
        }
        if (type === 'suffix' && lexicon.has('-un')) {
            representations.push({ value: 'u`n', entry: lexicon.get('-un') })
        }
        return representations.sort((left, right) => right.value.length - left.value.length)
    }

    function consumeFitenkaPrefixes(value, representations, depth) {
        const results = [{ rest: value, entries: [], score: 0 }]
        if (depth >= 3) return results
        for (const representation of representations) {
            if (!value.startsWith(representation.value)) continue
            const rest = value.slice(representation.value.length)
            if (!rest) continue
            for (const next of consumeFitenkaPrefixes(rest, representations, depth + 1)) {
                results.push({
                    rest: next.rest,
                    entries: [representation.entry, ...next.entries],
                    score: next.score + 20,
                })
            }
        }
        return results
    }

    function consumeFitenkaSuffixes(value, representations, depth) {
        const results = [{ rest: value, entries: [], score: 0 }]
        if (depth >= 3) return results
        for (const representation of representations) {
            if (!value.endsWith(representation.value)) continue
            const rest = value.slice(0, -representation.value.length)
            if (!rest) continue
            for (const next of consumeFitenkaSuffixes(rest, representations, depth + 1)) {
                results.push({
                    rest: next.rest,
                    entries: [...next.entries, representation.entry],
                    score: next.score + 20,
                })
            }
        }
        return results
    }

    function decodeFitenkaUnit(rawUnit, continuation, lexicon, rootForms, prefixForms, suffixForms) {
        let unit = stripFitenkaNoVowel(rawUnit)
        let linker = false
        if (continuation && unit.endsWith('i')) {
            unit = unit.slice(0, -1)
            linker = true
        }
        const endingOptions = [{ unit, ending: '', score: 0 }]
        const last = unit.slice(-1)
        if ('eaou'.includes(last)) {
            endingOptions.push({ unit: unit.slice(0, -1), ending: last, score: 8 })
        }
        const results = []

        for (const endingOption of endingOptions) {
            const alternating = endingOption.unit.startsWith('|')
            const unitVariants = alternating
                ? [endingOption.unit, endingOption.unit.slice(1)]
                : [endingOption.unit]
            for (const unitVariant of unitVariants) {
                for (const prefixPath of consumeFitenkaPrefixes(unitVariant, prefixForms, 0)) {
                    for (const suffixPath of consumeFitenkaSuffixes(prefixPath.rest, suffixForms, 0)) {
                        for (const root of rootForms) {
                            if (root.form !== suffixPath.rest) continue
                            let base = root.stem
                                ? root.entry.key.slice(0, -1)
                                : root.entry.key
                            if (continuation && /[eao]$/.test(base)) base = base.slice(0, -1)
                            if (endingOption.ending && /[eao]$/.test(base)) base = base.slice(0, -1)
                            if (suffixPath.entries.length && /[eao]$/.test(base)) base = base.slice(0, -1)
                            if (alternating && unitVariant === endingOption.unit.slice(1)) {
                                base = shiftedImperfective(base)
                                if (!base) continue
                            }
                            const prefixes = prefixPath.entries
                                .map(entry => entry.key.replace(/-/g, ''))
                                .join('')
                            const suffixes = suffixPath.entries
                                .map(entry => entry.key.replace(/-/g, ''))
                                .join('')
                            const inferredEndings = endingOption.ending
                                ? [endingOption.ending]
                                : suffixPath.entries.length ? ['', 'e', 'a', 'o'] : ['']
                            for (const ending of inferredEndings) {
                                const latin = `${prefixes}${base}${suffixes}${ending}`
                                results.push({
                                    latin,
                                    linker,
                                    score: root.score
                                        + prefixPath.score
                                        + suffixPath.score
                                        + endingOption.score
                                        + (ending ? 8 : 0)
                                        + (lexicon.has(latin) ? 100 : 0)
                                        + (alternating ? 15 : 0),
                                })
                            }
                        }
                    }
                }
            }
        }
        const seen = new Set()
        return results
            .sort((left, right) => right.score - left.score)
            .filter(item => {
                if (!item.latin || seen.has(item.latin)) return false
                seen.add(item.latin)
                return true
            })
            .slice(0, 40)
    }

    function decodeFitenkaWord(notation, lexicon) {
        const rootForms = [...lexicon.values()]
            .filter(entry => !isAffixEntry(entry))
            .flatMap(fitenkaEntryForms)
        const prefixForms = fitenkaAffixRepresentations(lexicon, 'prefix')
        const suffixForms = fitenkaAffixRepresentations(lexicon, 'suffix')
        const rawUnits = notation.split('_').filter(Boolean)
        const generalNoun = rawUnits[rawUnits.length - 1] === 'N'
        if (generalNoun) rawUnits.pop()
        if (!rawUnits.length) return []

        let paths = [{ latin: '', score: 0 }]
        rawUnits.forEach((unit, index) => {
            if (unit === '.') return
            const continuation = index < rawUnits.length - 1
            const unitCandidates = decodeFitenkaUnit(
                unit,
                continuation,
                lexicon,
                rootForms,
                prefixForms,
                suffixForms,
            )
            const nextPaths = []
            for (const path of paths) {
                for (const candidate of unitCandidates) {
                    nextPaths.push({
                        latin: `${path.latin}${path.latin ? 'i' : ''}${candidate.latin}`,
                        score: path.score + candidate.score + (candidate.linker ? 20 : 0),
                    })
                }
            }
            paths = nextPaths
                .sort((left, right) => right.score - left.score)
                .slice(0, 120)
        })
        if (generalNoun) {
            paths = paths.map(path => ({ ...path, latin: `${path.latin}n` }))
        }
        return paths
    }

    function fromFitenka(rawValue, entries) {
        const markedInput = normalizeFitenka(rawValue)
        if (!markedInput) return null
        const properNoun = markedInput.startsWith('·')
        const input = properNoun ? markedInput.slice(1) : markedInput
        if (!input) return null
        const lexicon = entries instanceof Map ? entries : makeLexicon(entries)
        const directEntries = [...lexicon.values()]
            .filter(entry => entry.fitenka.some(value => normalizeFitenka(value) === input))
            .sort((left, right) => Number(isAffixEntry(left)) - Number(isAffixEntry(right)))
        if (directEntries.length) {
            return {
                input,
                notation: input,
                latin: directEntries[0].key,
                exact: true,
            }
        }

        const wordParts = input.split('-')
        let paths = [{ latin: '', score: 0 }]
        for (const wordPart of wordParts) {
            const decoded = decodeFitenkaWord(wordPart, lexicon)
            const nextPaths = []
            for (const path of paths) {
                for (const item of decoded) {
                    nextPaths.push({
                        latin: `${path.latin}${path.latin ? '-' : ''}${item.latin}`,
                        score: path.score + item.score,
                    })
                }
            }
            paths = nextPaths.sort((left, right) => right.score - left.score).slice(0, 160)
        }

        const evaluated = paths
            .map(path => {
                const latin = markProperLatin(path.latin, properNoun)
                const result = analyze(latin, lexicon)
                const forwardMatch = result.candidates.some(candidate => (
                    normalizeFitenka(candidate.fitenka) === markedInput
                ))
                return {
                    ...path,
                    valid: Boolean(result.exact || forwardMatch),
                    score: path.score
                        + (result.exact ? 1000 : 0)
                        + (forwardMatch ? 500 : 0)
                        + (result.candidates.length ? 100 : 0),
                }
            })
            .filter(item => item.valid)
            .sort((left, right) => right.score - left.score)
        if (!evaluated.length) return null
        return {
            input: markedInput,
            notation: markedInput,
            latin: markProperLatin(evaluated[0].latin, properNoun),
            exact: Boolean(lexicon.get(evaluated[0].latin)),
        }
    }

    function parseFitenkaNam(text) {
        const tokenToGlyph = new Map()
        const glyphToToken = new Map()
        for (const line of String(text || '').split(/\r?\n/)) {
            const match = line.trim().match(/^0x([0-9A-Fa-f]+)\s+(.+)$/)
            if (!match) continue
            const glyph = String.fromCodePoint(Number.parseInt(match[1], 16))
            const token = match[2].trim()
            if (!token || tokenToGlyph.has(token)) continue
            tokenToGlyph.set(token, glyph)
            glyphToToken.set(glyph, token)
        }
        return { tokenToGlyph, glyphToToken }
    }

    function fitenkaGlyphsToNotation(value, glyphToToken) {
        const tokens = []
        for (const glyph of String(value || '').replace(/\s+/g, '')) {
            const token = glyphToToken.get(glyph)
            if (!token) return ''
            tokens.push(token)
        }
        if (!tokens.length) return ''
        let notation = ''
        for (const token of tokens) {
            if (token === '-') {
                notation = notation.replace(/_+$/, '') + '-'
            } else if (token === '.' && notation && !notation.endsWith('-')) {
                notation = notation.replace(/_+$/, '') + '.'
            } else {
                notation += notation && !notation.endsWith('-') ? `_${token}` : token
            }
        }
        return normalizeFitenka(notation)
    }

    function fitenkaNotationUnits(value, tokenToGlyph) {
        const normalized = normalizeFitenka(value)
        if (!normalized) return []
        const tokens = []
        for (const hyphenPart of normalized.split(/(-)/)) {
            if (!hyphenPart) continue
            if (hyphenPart === '-') {
                tokens.push('-')
                continue
            }
            for (const unit of hyphenPart.split('_').filter(Boolean)) {
                if (tokenToGlyph.has(unit)) {
                    tokens.push(unit)
                } else if (unit !== '...' && unit.endsWith('.')) {
                    tokens.push(unit.slice(0, -1), '.')
                } else {
                    tokens.push(unit)
                }
            }
        }
        return tokens.filter(Boolean).map(token => ({
            notation: token,
            glyph: tokenToGlyph.get(token) || '',
            encoded: tokenToGlyph.has(token),
        }))
    }

    function fitenkaNotationToGlyphs(value, tokenToGlyph) {
        const units = fitenkaNotationUnits(value, tokenToGlyph)
        if (!units.length || units.some(unit => !unit.encoded)) return ''
        return units.map(unit => unit.glyph).join('')
    }

    function analyze(rawWord, entries) {
        const input = String(rawWord || '').trim()
        const normalized = normalizeWord(input)
        const properNoun = Boolean(input && input[0] !== input[0].toLocaleLowerCase('en-US'))
        const lexicon = entries instanceof Map ? entries : makeLexicon(entries)
        const context = makeAnalysisContext(lexicon)
        const exact = lexicon.get(normalized) || null
        const result = {
            input,
            normalized,
            valid: Boolean(normalized && LATIN_WORD.test(input)),
            exact,
            properNoun,
            candidates: [],
        }
        if (!result.valid) return result

        const candidates = []
        const stemCandidates = analyzeStem(normalized, context, 0, new Set())
        candidates.push(...stemCandidates.filter(candidate => candidate.components.length > 1))

        if (normalized.includes('-')) {
            const parts = normalized.split('-').filter(Boolean)
            const partEntries = parts.map(part => lexicon.get(part))
            if (parts.length > 1 && partEntries.every(Boolean)) {
                const components = []
                partEntries.forEach((entry, index) => {
                    if (index) components.push(grammarComponent('-', 'hyphen', null, '保留词尾的复合连接号', 'hyphen compound'))
                    components.push(entryComponent(entry, 'root'))
                })
                candidates.push({
                    kind: 'hyphen-compound',
                    score: 120,
                    components,
                    notesZh: ['连字符复合词保留各组成词的词尾。'],
                    summaryZh: partEntries.map(entry => entry.glossZh.join('、')).join(' + '),
                    summaryEn: partEntries.map(entry => entry.glossEn.join('; ')).filter(Boolean).join(' + '),
                })
            }
        }

        const last = normalized.slice(-1)

        if (normalized.endsWith('un') && normalized.length > 3) {
            const stem = normalized.slice(0, -2)
            const possibleBases = [stem, `${stem}e`, `${stem}a`, `${stem}o`]
            for (const baseForm of unique(possibleBases)) {
                const base = lexicon.get(baseForm)
                if (!base) continue
                candidates.push({
                    kind: 'prepositional',
                    score: 108,
                    components: [
                        entryComponent(base, 'base'),
                        endingComponent(lexicon, 'un', 'suffix', '介词词尾', 'prepositional ending'),
                    ],
                    notesZh: [`在 ${base.label} 的词干后加 -un，构成介词。`],
                    summaryZh: `${base.glossZh.join('、')}（介词）`,
                    summaryEn: base.glossEn.length
                        ? `${base.glossEn.join('; ')} (preposition)`
                        : '',
                })
            }
        }

        if (last === 'u' && normalized.length > 2) {
            const possibleBases = [normalized.slice(0, -1)]
            for (const ending of ['e', 'a', 'o']) {
                possibleBases.push(`${normalized.slice(0, -1)}${ending}`)
            }
            for (const baseForm of unique(possibleBases)) {
                const base = lexicon.get(baseForm)
                if (!base) continue
                const changedEnding = baseForm.length === normalized.length
                candidates.push({
                    kind: 'adverb',
                    score: 110 + (hasPartOfSpeech(base, 'Noun') ? 5 : 0),
                    components: [
                        entryComponent(base, 'base'),
                        endingComponent(lexicon, 'u', 'adverb-ending', '副词词尾', 'adverbial ending'),
                    ],
                    notesZh: [changedEnding
                        ? `把 ${base.label} 的词尾 -${baseForm.slice(-1)} 改为 -u，构成副词。`
                        : `在 ${base.label} 后加 -u，构成副词。`],
                    summaryZh: `以“${base.glossZh.join('、')}”的方式或时间`,
                    summaryEn: base.glossEn.length
                        ? `in the manner or time of “${base.glossEn.join('; ')}”`
                        : '',
                })
            }
        }

        if (last === 'n' && normalized.length > 2) {
            const base = lexicon.get(normalized.slice(0, -1))
            if (base && hasPartOfSpeech(base, 'Noun')) {
                candidates.push({
                    kind: 'general-noun',
                    score: 105,
                    components: [
                        entryComponent(base, 'base'),
                        endingComponent(lexicon, 'n', 'general-ending', '一般名词标志', 'general noun ending'),
                    ],
                    notesZh: [`在 ${base.label} 后加 -n，由特指名词变为一般名词。`],
                    summaryZh: `${base.glossZh.join('、')}（一般）`,
                    summaryEn: base.glossEn.length
                        ? `${base.glossEn.join('; ')} (general noun)`
                        : '',
                })
            }
        }

        if (last === 'i' && normalized.length > 2) {
            const base = lexicon.get(normalized.slice(0, -1))
            if (base && hasPartOfSpeech(base, 'Verb')) {
                candidates.push({
                    kind: 'gerund',
                    score: 105,
                    components: [
                        entryComponent(base, 'base'),
                        endingComponent(lexicon, 'i', 'gerund-ending', '动名词词尾', 'gerund ending'),
                    ],
                    notesZh: [`在动词 ${base.label} 后加 -i，构成动名词。`],
                    summaryZh: `${base.glossZh.join('、')}（动名词）`,
                    summaryEn: base.glossEn.length
                        ? `${base.glossEn.join('; ')} (gerund)`
                        : '',
                })
            }
        }

        const aspect = replaceLastVowel(normalized)
        if (aspect) {
            const base = lexicon.get(aspect.base)
            if (base && hasPartOfSpeech(base, 'Verb')) {
                candidates.push({
                    kind: 'imperfective',
                    score: 115,
                    components: [
                        entryComponent(base, 'base'),
                        grammarComponent(
                            `${aspect.from}→${aspect.to}`,
                            'simulfix',
                            null,
                            '元音循环变换（未完成体）',
                            'cyclic vowel shift (imperfective)',
                        ),
                    ],
                    notesZh: [`把 ${base.label} 最后一个元音 ${aspect.from} 按 i→u→o→a→e→i 循环变为 ${aspect.to}，构成未完成体。`],
                    summaryZh: `${base.glossZh.join('、')}（未完成体）`,
                    summaryEn: base.glossEn.length
                        ? `${base.glossEn.join('; ')} (imperfective)`
                        : '',
                })
            }
        }

        result.candidates = rankFinalCandidates(candidates, 3).map(candidate => {
            const hanivako = candidateHanivako(candidate)
            const fitenka = candidateFitenka(candidate, lexicon, normalized)
            return {
                ...candidate,
                hanivako: properNoun && hanivako && !hanivako.startsWith('・')
                    ? `・${hanivako}`
                    : hanivako,
                fitenka: properNoun && fitenka && !fitenka.startsWith('·')
                    ? `·_${fitenka}`
                    : fitenka,
            }
        })
        return result
    }

    return {
        analyze,
        candidateFitenka,
        candidateHanivako,
        fitenkaGlyphsToNotation,
        fitenkaNotationUnits,
        fitenkaNotationToGlyphs,
        fromFitenka,
        fromHanivako,
        makeLexicon,
        normalizeFitenka,
        normalizeHanivako,
        normalizeWord,
        parseFitenkaNam,
    }
})
