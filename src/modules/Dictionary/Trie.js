import Node from './Node'

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

  this.print = function() {
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
    search(this.root, '')
    return words.length > 0 ? words : []
  }

  // Based on https://github.com/bluelovers/trie-prefix-tree#readme permutation.js
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
}

export default Trie
