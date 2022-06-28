import { RichTextField, RTNode } from '@prismicio/types'
import React, { useEffect, useState } from 'react'
import { RichText } from 'react-native-prismic-richtext'

const fakeContent: RichTextField = [
  {
    type: 'paragraph',
    text:
      'My new paragraph with fake content to display string words and other normal words',
    spans: [
      {
        start: 0,
        end: 16,
        type: 'strong',
      },
    ],
  },
  {
    type: 'list-item',
    text: 'Wednesday – startup meeting',
    spans: [
      {
        start: 0,
        end: 27,
        type: 'strong',
      },
    ],
  },
  {
    type: 'paragraph',
    text: 'the sentence of the end.',
    spans: [],
  },
]

const App = () => {
  const [content, setContent] = useState<RichTextField>(fakeContent)
  useEffect(() => {
    // fetch primsic richtext
    ;(async () => {
      const fetchedContent = fakeContent
      setContent(fetchedContent)
    })()
  }, [])

  return (
    <RichText
      richText={content}
      defaultStyle={{
        color: '#000',
        fontSize: 17,
      }}
      styles={{
        hyperlink: { textDecorationLine: 'underline' },
        hyperlinkHover: {
          textDecorationLine: undefined,
        },
        list: {
          marginLeft: 8,
          marginVertical: 8,
        },
        'o-list': {
          marginLeft: 8,
          marginVertical: 8,
        },
        strong: {
          fontWeight: 'bold',
        },
        em: {
          fontStyle: 'italic',
        },
      }}
    />
  )
}

export default App
