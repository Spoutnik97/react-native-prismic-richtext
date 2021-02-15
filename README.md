# Installation
- Run `yarn add react-native-prismic-richtext`

# Usage 

```jsx
  <RichText
      richText={prismicRichTextResponse}

      // default style for texts
      defaultStyle={{
        color: '#000',
        fontSize: 17,
      }}

      // specific style for each tag
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
````
