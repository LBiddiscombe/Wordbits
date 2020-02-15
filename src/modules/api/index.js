import Trie from '../Dictionary'
import NProgress from 'nprogress'

async function loadDictionary() {
  NProgress.start()
  const APIKEY = `${process.env.REACT_APP_MLAB_APIKEY}`
  const url =
    'https://api.mlab.com/api/1/databases/wordbits/collections/words/5c263989fb6fc00eee87d369?apiKey=' +
    APIKEY
  const response = await fetch(url)
  const data = await response.json()
  const words = data.words
  const dictionary = new Trie()
  words.forEach((word, index) => {
    dictionary.add(word)
    if (index % 1000 === 0) {
      NProgress.inc()
    }
  })
  NProgress.done()
  return dictionary
}

async function getDefinition(input) {
  const response = await fetch(
    'https://googledictionaryapi.eu-gb.mybluemix.net/?define=' + input + '&lang=en'
  )
  const data = await response.json()
  const { word, phonetic, meaning } = data[0]
  const definitions = mergeMeanings(meaning)
  return {
    word,
    phonetic,
    definitions
  }

  function mergeMeanings(meanings) {
    const mergedMeanings = new Map()
    Object.keys(meanings).forEach(key => {
      if (mergedMeanings.has(key))
        mergedMeanings.set(
          key,
          mergedMeanings.get(key).concat(meanings[key].map(obj => obj.definition))
        )
      else
        mergedMeanings.set(
          key,
          meanings[key].map(obj => obj.definition)
        )
    })
    return mergedMeanings
  }
}

export { loadDictionary, getDefinition }
