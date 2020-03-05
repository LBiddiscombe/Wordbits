import words from './wordbits/words'
import { loadDictionary, searchDictionary } from './wordbits/dictionary'

loadDictionary(words)

exports.handler = async event => {
  const searchString = Object.keys(event.queryStringParameters)[0] || ''
  const results = searchDictionary(searchString)
  return {
    statusCode: 200,
    body: JSON.stringify(results)
  }
}
