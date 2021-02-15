import React, { useEffect, useState } from 'react'
import { RichText } from 'react-native-prismic-richtext'
import { RichTextContent } from '../../typings'

const fakeContent = [
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
  const [content, setContent] = useState<RichTextContent[]>(fakeContent)
  useEffect(() => {
    // fetch primsic richtext
    ;(async () => {
      const fetchedContent: RichTextContent[] = fakeContent
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
        oList: {
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
