async function searchDictionary(searchString) {
  const response = await fetch('/.netlify/functions/wordbits?' + searchString)
  const data = await response.json()
  return data
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

export default { searchDictionary, getDefinition }
