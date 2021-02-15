import React, { useEffect, useState } from 'react'
import { RichText } from 'react-native-prismic-richtext'
import { RichTextContent } from '../../typings'

const App = () => {
  const [content, setContent] = useState<RichTextContent[]>([])
  useEffect(() => {
    // fetch primsic richtext
    ;(async () => {
      const fetchedContent: RichTextContent[] = []
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
