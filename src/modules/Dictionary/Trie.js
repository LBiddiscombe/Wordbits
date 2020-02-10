// Based on https://codepen.io/beaucarnes/pen/mmBNBd?editors=0011
const Node = function() {
  this.keys = new Map()
  this.end = false
  this.setEnd = function() {
    this.end = true
  }
  this.isEnd = function() {
    return this.end
  }
}

const Trie = function() {
  this.root = new Node()

  this.add = function(input, node = this.root) {
    if (input.length === 0) {
      node.setEnd()
      return
    } else if (!node.keys.has(input[0])) {
      node.keys.set(input[0], new Node())
      return this.add(input.substr(1), node.keys.get(input[0]))
    } else {
      return this.add(input.substr(1), node.keys.get(input[0]))
    }
  }

  this.isWord = function(word) {
    word = word.toUpperCase()
    let node = this.root
    while (word.length > 1) {
      if (!node.keys.has(word[0])) {
        return false
      } else {
        node = node.keys.get(word[0])
        word = word.substr(1)
      }
    }
    return node.keys.has(word) && node.keys.get(word).isEnd() ? true : false
  }

  this.getPrefixNode = function(prefix) {
    prefix = prefix.toUpperCase()
    let node = this.root
    while (prefix.length > 1) {
      if (!node.keys.has(prefix[0])) {
        return false
      } else {
        node = node.keys.get(prefix[0])
        prefix = prefix.substr(1)
      }
    }
    return node
  }

  this.list = function(node = this.root, prefix = '') {
    let words = []
    let search = function(node, string) {
      if (node.keys.size !== 0) {
        for (let letter of node.keys.keys()) {
          search(node.keys.get(letter), string.concat(letter))
        }
        if (node.isEnd()) {
          words.push(string)
        }
      } else {
        return string.length > 0 ? words.push(string) : undefined
      }
    }
    search(node, prefix)
    return words.length > 0 ? words : []
  }

  // Inspired by https://github.com/bluelovers/trie-prefix-tree
  this.getAnagrams = function(letters, minLength = letters.length) {
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

      return words.sort((a, b) => b.length - a.length || a.localeCompare(b))
    }

    return permute(letters, this.root)
  }

  // matches wild card searches using all letters in place , e.g. 'ha.e' returns [ 'HAKE', 'HALE', 'HARE', 'HATE', 'HAVE', 'HAZE' ]
  this.getWordMatches = function(letters, wildcard, fullWordsOnly = true) {
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

    return readLetters(letters, this.root)
  }

  // matches wild card searches using all letters in place , e.g. 'ha.e' returns [ 'HAKE', 'HALE', 'HARE', 'HATE', 'HAVE', 'HAZE' ]
  this.getWordsBeginning = function(prefix, wildcard) {
    prefix = prefix.toUpperCase()
    const wordStart = prefix.slice(0, -1)
    let words = []
    const prefixWords = this.getWordMatches(wordStart, wildcard, false)
    prefixWords.forEach(word => {
      const node = this.getPrefixNode(word + wildcard)
      words = words.concat(this.list(node, word))
    })

    return words.sort((a, b) => b.length - a.length || a.localeCompare(b))
  }
}

export default Trie
