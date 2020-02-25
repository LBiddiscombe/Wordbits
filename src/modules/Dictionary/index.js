import Trie from './Trie'

const WILDCARD_CHAR = '.'
const USE_ALL_CHAR = '/'
const AS_WORD_START_CHAR = '*'
const MAX_WILDCARDS = 7

const validateSearch = value => {
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

export { Trie, validateSearch }
