import Trie from './Trie'

const WILDCARD_CHAR = '.'
const USE_ALL_CHAR = '/'
const AS_WORD_START_CHAR = '*'
const MAX_WILDCARDS = 7
const dictionary = new Trie()

const loadDictionary = words => {
  words.forEach((word, index) => {
    dictionary.add(word)
  })
  return dictionary
}

const validateSearchString = searchString => {
  const wildcardCount = (searchString.match(/\./g) || []).length
  if (wildcardCount > MAX_WILDCARDS) {
    return `Max ${MAX_WILDCARDS} wildcards allowed`
  }

  const beginsWithCount = (searchString.match(/\*/g) || []).length
  if (beginsWithCount > 1) {
    return `Only 1 begins with (${AS_WORD_START_CHAR}) wildcard allowed`
  }

  if (beginsWithCount === 1 && searchString.length - wildcardCount - 1 <= 1) {
    return `At least 2 letters required for prefix search`
  }

  return ''
}

const executeSearch = searchString => {
  let duration = 0
  let results = undefined
  let resultText = ''

  if (!dictionary) return { results: null, resultText: 'waiting for dictionary' }

  const wildcardFound = searchString.indexOf(WILDCARD_CHAR) !== -1
  const useAllLetters = searchString.slice(-1) === USE_ALL_CHAR
  const asWordStart = searchString.slice(-1) === AS_WORD_START_CHAR

  if (dictionary && searchString.length > 0) {
    const start = performance.now()
    if (asWordStart) {
      results = dictionary.getWordsBeginning(searchString, WILDCARD_CHAR)
    } else if (wildcardFound) {
      results = dictionary.getWordMatches(searchString, WILDCARD_CHAR)
    } else {
      results = dictionary.getAnagrams(searchString, useAllLetters ? searchString.length - 1 : 3)
    }
    duration = Math.round(performance.now() - start)
  }

  if (results)
    resultText = `Found  ${results.length} results in ${duration}ms ${
      useAllLetters ? ' using all letters' : ''
    }`

  return { results, resultText }
}

export { loadDictionary, validateSearchString, executeSearch }
