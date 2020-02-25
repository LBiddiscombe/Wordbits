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
    while (prefix.length > 0) {
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
}

export default Trie
