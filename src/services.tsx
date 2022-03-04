// @ts-ignore
import PrismicRichText, { Elements } from 'prismic-richtext'
import React, { createElement } from 'react'
import {
  ImageStyle,
  Linking,
  StyleProp,
  Text,
  TextProps,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'

import {
  HTMLTags,
  ImageType,
  LinkFunction,
  LinkType,
  RichTextContent,
  RichTextDefaultStyles,
  RichTextElementType,
  RichTextSerializer,
  RichTextStyles,
  SpanType,
} from '../typings'
import { HoverableLink } from './components/HoverableLink'
import { ImageView } from './components/ImageView'

function propsWithUniqueKey(props = {}, key: string) {
  return Object.assign(props, { key })
}

function getRNPropsFromHTMLTag(type: HTMLTags): TextProps {
  switch (type) {
    case 'h1':
      return { accessibilityLabel: 'header' }
    default:
      return {}
  }
}

function serializeStandardTag(
  tag: HTMLTags,
  children: React.ComponentElement<TextProps, Text>,
  key: string,
  style: StyleProp<TextStyle>
) {
  const props = getRNPropsFromHTMLTag(tag)

  if (tag === 'li') return children
  return createElement(
    Text,
    propsWithUniqueKey({ ...props, style }, key),
    children
  )
}

function serializeUl(
  children: React.ComponentElement<TextProps, Text>[],
  key: string,
  style: RichTextStyles
) {
  return createElement(
    View,
    propsWithUniqueKey({ style: style.list }, key),
    children.map((text, index) => (
      <Text key={`${key}_${text.key}_${index}`} style={style.listItem}>
        <Text>• </Text>
        <Text>{text}</Text>
      </Text>
    ))
  )
}

function serializeOl(
  children: React.ComponentElement<TextProps, Text>[],
  key: string,
  style: RichTextStyles
) {
  return createElement(
    View,
    propsWithUniqueKey({ style: style.oList }, key),
    children.map((text, index) => (
      <Text key={`${key}_${text.key}_${index}`} style={style.oListItem}>
        <Text>{`${index + 1}. `}</Text>
        <Text>{text}</Text>
      </Text>
    ))
  )
}

export const linkResolver = (link: LinkType): string => {
  return link.url
}

function serializeHyperlink(
  element: SpanType,
  children: React.ComponentElement<TextProps, Text>,
  key: string,
  style: StyleProp<TextStyle>,
  hoverStyle: StyleProp<TextStyle>,
  onLinkPress?: LinkFunction
) {
  if (element.data) {
    const targetAttr = element.data.target
      ? { target: element.data.target }
      : {}
    const relAttr = element.data.target ? { rel: 'noopener' } : {}

    const href = linkResolver(element.data)
    const props: TextProps & { href: string; target?: string; rel?: string } = {
      accessibilityLabel: 'link',
      onPress: () => {
        onLinkPress
          ? onLinkPress(element.data)
          : Linking.openURL(href).catch(console.warn)
      },
      href,
      ...targetAttr,
      ...relAttr,
    }
    return (
      <HoverableLink
        key={key}
        linkProps={props}
        outerStyle={style}
        hoverStyle={hoverStyle}
      >
        {children}
      </HoverableLink>
    )
  }
  return createElement(TouchableOpacity, propsWithUniqueKey({}, key), children)
}

function serializeSpan(
  content: string,
  key: string
): React.ComponentElement<TextProps, Text> | null {
  if (content) {
    return createElement(Text, propsWithUniqueKey({}, key), content)
  }
  return null
}

function serializeImage(
  element: ImageType,
  key: string,
  wrapperStyle?: StyleProp<ViewStyle>,
  style?: StyleProp<ImageStyle>,
  onLinkPress?: LinkFunction
) {
  return createElement(
    Text,
    propsWithUniqueKey({}, key),
    <ImageView
      element={element}
      wrapperStyle={wrapperStyle}
      style={style}
      accessibilityLabel={element.alt}
      onLinkPress={onLinkPress}
    />
  )
}

export const serializerWithStyle = (
  styles: RichTextStyles,
  onLinkPress?: LinkFunction,
  serializers?: RichTextSerializer
) => (
  type: RichTextElementType,
  element: SpanType,
  text: string,
  children: React.ComponentElement<TextProps, Text>,
  index: string
): React.ComponentElement<TextProps, Text> | null => {
  const serializeTag = serializers && serializers[type]
  if (serializeTag !== undefined) {
    return serializeTag(type, element, text, children, index)
  }
  switch (type) {
    case Elements.heading1:
      return serializeStandardTag('h1', children, index, styles.heading1)
    case Elements.heading2:
      return serializeStandardTag('h2', children, index, styles.heading2)
    case Elements.heading3:
      return serializeStandardTag('h3', children, index, styles.heading3)
    case Elements.heading4:
      return serializeStandardTag('h4', children, index, styles.heading4)
    case Elements.heading5:
      return serializeStandardTag('h5', children, index, styles.heading5)
    case Elements.heading6:
      return serializeStandardTag('h6', children, index, styles.heading6)
    case Elements.paragraph:
      return serializeStandardTag('p', children, index, styles.paragraph)
    case Elements.preformatted:
      return serializeStandardTag('pre', children, index, styles.preformatted)
    case Elements.strong:
      return serializeStandardTag('strong', children, index, styles.strong)
    case Elements.em:
      return serializeStandardTag('em', children, index, styles.em)
    case Elements.listItem:
      return serializeStandardTag('li', children, index, styles.listItem)
    case Elements.oListItem:
      return serializeStandardTag('li', children, index, styles.oListItem)
    case Elements.list:
      return serializeUl(
        (children as unknown) as React.ComponentElement<TextProps, Text>[],
        index,
        styles
      )
    case Elements.oList:
      return serializeOl(
        (children as unknown) as React.ComponentElement<TextProps, Text>[],
        index,
        styles
      )
    case Elements.image:
      return serializeImage(
        (element as unknown) as ImageType,
        index,
        styles.imageWrapper as ViewStyle,
        styles.image as ImageStyle,
        onLinkPress
      )
    case Elements.hyperlink:
      return serializeHyperlink(
        element,
        children,
        index,
        styles.hyperlink,
        styles.hyperlinkHover,
        onLinkPress
      )
    case Elements.label:
      return serializeStandardTag('label', children, index, styles.label)
    case Elements.span:
      return serializeSpan(text, index)
    default:
      return null
  }
}

export const asText = (structuredText: RichTextContent[]) => {
  if (Object.prototype.toString.call(structuredText) !== '[object Array]') {
    console.warn(
      `Rich text argument should be an Array. Received ${typeof structuredText}`
    )
    return null
  }
  return PrismicRichText.asText(structuredText)
}

export function computeStyles(
  defaultStyle: RichTextDefaultStyles = {},
  styles: RichTextStyles = {}
): RichTextStyles {
  const computedStyles: RichTextStyles = {
    heading1: [defaultStyle, styles.heading1],
    heading2: [defaultStyle, styles.heading2],
    heading3: [defaultStyle, styles.heading3],
    heading4: [defaultStyle, styles.heading4],
    heading5: [defaultStyle, styles.heading5],
    heading6: [defaultStyle, styles.heading6],
    paragraph: [defaultStyle, styles.paragraph],
    preformatted: [defaultStyle, styles.preformatted],
    strong: [defaultStyle, styles.strong],
    em: [defaultStyle, styles.em],
    listItem: [defaultStyle, styles.listItem],
    list: [defaultStyle, styles.list],
    oList: [defaultStyle, styles.oList],
    oListItem: [defaultStyle, styles.oListItem],
    label: [defaultStyle, styles.label],
    hyperlink: [defaultStyle, styles.hyperlink],
    hyperlinkHover: [defaultStyle, styles.hyperlinkHover],
    image: [defaultStyle, styles.image],
    imageWrapper: [defaultStyle, styles.imageWrapper],
    embed: [defaultStyle, styles.embed],
    span: [defaultStyle, styles.span],
  }

  return computedStyles
}
