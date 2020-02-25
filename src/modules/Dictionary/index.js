import Trie from './Trie'

const WILDCARD_CHAR = '.'
const USE_ALL_CHAR = '/'
const AS_WORD_START_CHAR = '*'
const MAX_WILDCARDS = 7

const validateSearchString = value => {
  const wildcardCount = (value.match(/\./g) || []).length
  if (wildcardCount > MAX_WILDCARDS) {
    return `Max ${MAX_WILDCARDS} wildcards allowed`
  }

  const beginsWithCount = (value.match(/\*/g) || []).length
  if (beginsWithCount > 1) {
    return `Only 1 begins with (${AS_WORD_START_CHAR}) wildcard allowed`
  }

  if (beginsWithCount === 1 && value.length - wildcardCount - 1 <= 1) {
    return `At least 2 letters required for prefix search`
  }

  return ''
}

const executeSearch = (dictionary, inputString) => {
  let duration = 0
  let results = undefined
  let resultText = ''
  const wildcardFound = inputString.indexOf(WILDCARD_CHAR) !== -1
  const useAllLetters = inputString.slice(-1) === USE_ALL_CHAR
  const asWordStart = inputString.slice(-1) === AS_WORD_START_CHAR

  if (dictionary && inputString.length > 0) {
    const start = performance.now()
    if (asWordStart) {
      results = dictionary.getWordsBeginning(inputString, WILDCARD_CHAR)
    } else if (wildcardFound) {
      results = dictionary.getWordMatches(inputString, WILDCARD_CHAR)
    } else {
      results = dictionary.getAnagrams(inputString, useAllLetters ? inputString.length - 1 : 3)
    }
    duration = Math.round(performance.now() - start)
  }

  if (results)
    resultText = `Found  ${results.length} results in ${duration}ms ${
      useAllLetters ? ' using all letters' : ''
    }`

  return [results, resultText]
}

export { Trie, validateSearchString, executeSearch }
