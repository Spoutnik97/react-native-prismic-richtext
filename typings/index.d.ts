// @ts-ignore
import { Elements } from 'prismic-richtext'
import { ImageStyle, StyleProp, TextStyle, ViewStyle } from 'react-native'

export type RichTextElementType = Elements[keyof Elements]

export interface LinkType {
  url: string
  link_type: 'Web' | string
  target?: string
  type?: string
  id?: string
  uid?: string
  slug?: string
  lang?: string
  isBroken?: boolean
}

export interface LinkFunction {
  (data: LinkType | undefined): void
}

type SpanDataType = {
  type: 'hyperlink'
  data?: LinkType
}
interface SpanType extends SpanDataType {
  start: number
  end: number
  type: RichTextElementType
}

interface ImageType extends SpanDataType {
  url: string
  alt?: string
  dimensions: {
    width: number
    height: number
  }
  type: RichTextElementType
  linkTo: LinkType
}

export type RichTextContent = {
  type: string
  text: string
  spans: SpanType[]
}

export type HTMLTags =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'p'
  | 'pre'
  | 'strong'
  | 'em'
  | 'li'
  | 'ul'
  | 'ol'
  | 'label'
  | 'a'
  | 'img'

export type RichTextStyles = {
  [key in keyof Elements]?:
    | StyleProp<TextStyle>
    | StyleProp<ViewStyle>
    | StyleProp<ImageStyle>
}

export type RichTextDefaultStyles = TextStyle
