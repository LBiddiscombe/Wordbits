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

const searchDictionary = searchString => {
  let error = ''
  let results = []
  let resultText = ''
  let duration = 0

  if (!searchString) return { error, results, resultText }
  if (!dictionary) return { error, results, resultText: 'waiting for dictionary' }

  error = validateSearchString(searchString)

  const wildcardFound = searchString.indexOf(WILDCARD_CHAR) !== -1
  const useAllLetters = searchString.slice(-1) === USE_ALL_CHAR
  const asWordStart = searchString.slice(-1) === AS_WORD_START_CHAR

  if (!error && dictionary && searchString.length > 0) {
    const start = performance.now()
    if (asWordStart) {
      results = getWordsBeginning(searchString, WILDCARD_CHAR)
    } else if (wildcardFound) {
      results = getWordMatches(searchString, WILDCARD_CHAR)
    } else {
      results = getAnagrams(searchString, useAllLetters ? searchString.length - 1 : 3)
    }
    duration = Math.round(performance.now() - start)
  }

  if (results.length > 0)
    resultText = `Found  ${results.length} results in ${duration}ms ${
      useAllLetters ? ' using all letters' : ''
    }`

  return { error, results, resultText }
}

// Inspired by https://github.com/bluelovers/trie-prefix-tree
const getAnagrams = (letters, minLength = letters.length) => {
  letters = letters.toUpperCase()
  let words = []

  const permute = (word, node, prefix = '') => {
    const isEmpty = word.length === 0
    const isWordEnd = node.isEnd()
    const isMinLength = prefix.length >= minLength

    if (isEmpty && isWordEnd && isMinLength && !words.includes(prefix)) {
      words.push(prefix)
    }

    const letters = word.split('')
    for (let [i, letter] of letters.entries()) {
      if (isWordEnd && isMinLength && !words.includes(prefix)) {
        words.push(prefix)
      }

      if (node.keys.get(letter)) {
        const remaining = letters
          .slice(0, i)
          .concat(letters.slice(i + 1))
          .join('')
        permute(remaining, node.keys.get(letter), prefix + letter)
      }
    }

    return words.sort(byLength)
  }

  return permute(letters, dictionary.root)
}

// matches wild card searches using all letters in place , e.g. 'ha.e' returns [ 'HAKE', 'HALE', 'HARE', 'HATE', 'HAVE', 'HAZE' ]
const getWordMatches = (letters, wildcard, fullWordsOnly = true) => {
  letters = letters.toUpperCase()
  let words = []

  const readLetters = (word, node, prefix = '') => {
    const isWordEnd = node.isEnd()
    const isMinLength = prefix.length === letters.length

    if (fullWordsOnly) {
      if (isWordEnd && isMinLength) {
        words.push(prefix)
      }
    } else {
      if (isMinLength) {
        words.push(prefix)
      }
    }

    const chars = word.split('')
    for (let [i, char] of chars.entries()) {
      const remaining = chars.slice(i + 1).join('')
      if (char === wildcard) {
        const choices = [...node.keys.keys()]
        choices.forEach(choice => {
          if (node.keys.get(choice)) {
            readLetters(remaining, node.keys.get(choice), prefix + choice)
          }
        })
      } else {
        if (node.keys.get(char)) {
          readLetters(remaining, node.keys.get(char), prefix + char)
        }
      }
    }

    return words.sort()
  }

  return readLetters(letters, dictionary.root)
}

// matches wild card searches using all letters in place then return all words beginning with these prefixes
const getWordsBeginning = (prefix, wildcard) => {
  prefix = prefix.toUpperCase()
  const wordStart = prefix.slice(0, -1)
  let words = []
  const prefixWords = getWordMatches(wordStart, wildcard, false)
  prefixWords.forEach(word => {
    const node = dictionary.getPrefixNode(word)
    words = words.concat(dictionary.list(node, word))
  })

  return words.sort(byLength)
}

const byLength = (a, b) => b.length - a.length || a.localeCompare(b)

export { loadDictionary, validateSearchString, searchDictionary }
