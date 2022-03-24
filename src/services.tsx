import { asText as asPrismicText, Element } from '@prismicio/richtext'
import {
  FilledLinkToDocumentField,
  FilledLinkToMediaField,
  FilledLinkToWebField,
  RichTextField,
  RTAnyNode,
  RTImageNode,
  RTLinkNode,
} from '@prismicio/types'
import React, { createElement, Fragment } from 'react'
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
  LinkFunction,
  RichTextDefaultStyles,
  RichTextElementType,
  RichTextSerializer,
  RichTextStyles,
  SerializerChildren,
  SerializerFunction,
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
  children: SerializerChildren,
  key: string,
  style: StyleProp<TextStyle>
) {
  const props = getRNPropsFromHTMLTag(tag)

  if (tag === 'li') {
    return createElement(Fragment, propsWithUniqueKey(props, key), children)
  }

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
      <Text key={`${key}_${text.key}_${index}`} style={style['list-item']}>
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
    propsWithUniqueKey({ style: style['o-list'] }, key),
    children.map((text, index) => (
      <Text key={`${key}_${text.key}_${index}`} style={style['o-list-item']}>
        <Text>{`${index + 1}. `}</Text>
        <Text>{text}</Text>
      </Text>
    ))
  )
}

export const linkResolver = (
  link:
    | FilledLinkToDocumentField
    | FilledLinkToWebField
    | FilledLinkToMediaField
): string => {
  return link.url || ''
}

function serializeHyperlink(
  element: RTLinkNode,
  children: SerializerChildren,
  key: string,
  style: StyleProp<TextStyle>,
  hoverStyle: StyleProp<TextStyle>,
  onLinkPress?: LinkFunction
) {
  if (element.data) {
    const targetAttr =
      element.data.link_type === 'Web' && element.data.target
        ? { target: element.data.target }
        : {}
    const relAttr =
      element.data.link_type === 'Web' && element.data.target
        ? { rel: 'noopener' }
        : {}

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
  element: RTImageNode,
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
      accessibilityLabel={element.alt || undefined}
      onLinkPress={onLinkPress}
    />
  )
}

export const serializerWithStyle = (
  styles: RichTextStyles,
  onLinkPress?: LinkFunction,
  serializers?: RichTextSerializer
): SerializerFunction => (
  type: RichTextElementType,
  element: RTAnyNode,
  text: string | undefined,
  children: SerializerChildren,
  index: string
) => {
  const serializeTag = serializers && serializers[type]
  if (serializeTag !== undefined) {
    return serializeTag(type, element, text, children, index)
  }
  switch (type) {
    case Element.heading1:
      return serializeStandardTag('h1', children, index, styles.heading1)
    case Element.heading2:
      return serializeStandardTag('h2', children, index, styles.heading2)
    case Element.heading3:
      return serializeStandardTag('h3', children, index, styles.heading3)
    case Element.heading4:
      return serializeStandardTag('h4', children, index, styles.heading4)
    case Element.heading5:
      return serializeStandardTag('h5', children, index, styles.heading5)
    case Element.heading6:
      return serializeStandardTag('h6', children, index, styles.heading6)
    case Element.paragraph:
      return serializeStandardTag('p', children, index, styles.paragraph)
    case Element.preformatted:
      return serializeStandardTag('pre', children, index, styles.preformatted)
    case Element.strong:
      return serializeStandardTag('strong', children, index, styles.strong)
    case Element.em:
      return serializeStandardTag('em', children, index, styles.em)
    case Element.listItem:
      return serializeStandardTag('li', children, index, styles['list-item'])
    case Element.oListItem:
      return serializeStandardTag('li', children, index, styles['o-list-item'])
    case Element.list:
      return serializeUl(
        (children as unknown) as React.ComponentElement<TextProps, Text>[],
        index,
        styles
      )
    case Element.oList:
      return serializeOl(
        (children as unknown) as React.ComponentElement<TextProps, Text>[],
        index,
        styles
      )
    case Element.image:
      return serializeImage(
        element as RTImageNode,
        index,
        styles.imageWrapper as ViewStyle,
        styles.image as ImageStyle,
        onLinkPress
      )
    case Element.hyperlink:
      return serializeHyperlink(
        element as RTLinkNode,
        children,
        index,
        styles.hyperlink,
        styles.hyperlinkHover,
        onLinkPress
      )
    case Element.label:
      return serializeStandardTag('label', children, index, styles.label)
    case Element.span:
      return serializeSpan(text || '', index)
    default:
      return null
  }
}

export const asText = (structuredText: RichTextField) => {
  if (Object.prototype.toString.call(structuredText) !== '[object Array]') {
    console.warn(
      `Rich text argument should be an Array. Received ${typeof structuredText}`
    )
    return null
  }
  return asPrismicText(structuredText)
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
    'list-item': [defaultStyle, styles['list-item']],
    list: [defaultStyle, styles.list],
    'o-list': [defaultStyle, styles['o-list']],
    'o-list-item': [defaultStyle, styles['o-list-item']],
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
