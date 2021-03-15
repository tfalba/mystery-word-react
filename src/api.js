import axios from 'axios'

// endpoint = 'https://od-api.oxforddictionaries.com/api/v2/entries/{source_lang}/{word_id}'
// url = endpoint.format(source_lang='en', word_id=search_word)
// headers = {'app_id': env(OXFORD_APP_ID), 'app_key': env(OXFORD_APP_KEY)}
// response = requests.get(url, headers=headers)

// endpoint = 'https://od-api.oxforddictionaries.com/api/v2/entries/{source_lang}/{word_id}'
// export const getDefinition(search_word, source_lang) {

const API = axios.create({
  baseURL: 'https://od-api.oxforddictionaries.com/api/v2/entries/en/'
})

axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*'

export function getWordDefinition (searchWord) {
  return API
    .get(`/${searchWord}`, {
      headers: {
        OXFORD_APP_ID: '7e34cbc8',
        OXFORD_APP_KEY: '9f0002e1ec49289bec208516fd450264'
      }
    })
    .then(res => console.log(res.data.results))
}

// }
// {% if search_result %}
// <hr>
// {% if search_result.success %}
//   {% for result in search_result.results %}
//   <h3>{{ result.id }}</h3>
//     {% for lexicalentry in result.lexicalEntries %}
//       <ul>
//         {% for entry in lexicalentry.entries %}
//           {% for sense in entry.senses %}
//             {% for definition in sense.definitions %}
//               <li>{{ definition }}</li>
//             {% endfor %}
//           {% endfor %}
//         {% endfor %}
//       </ul>
//     {% endfor %}
//   {% endfor %}
// {% else %}
//     <p><em>{{ search_result.message }}</em></p>
// {% endif %}
// {% endif %}

// OXFORD_APP_ID=7e34cbc8
// OXFORD_APP_KEY=9f0002e1ec49289bec208516fd450264
