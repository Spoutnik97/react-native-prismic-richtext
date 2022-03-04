// @ts-ignore
import { Elements } from 'prismic-richtext'
import {
  ImageStyle,
  StyleProp,
  Text,
  TextProps,
  TextStyle,
  ViewStyle,
} from 'react-native'

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

export interface OembedType {
  type: 'embed'
  oembed: {
    author_name?: string | null
    author_url?: string | null
    embed_url?: string | null
    height?: number | null
    html?: string | null
    provider_name?: string | null
    provider_url?: string | null
    thumbnail_url?: string | null
    thumbnail_height?: number | null
    thumbnail_width?: number | null
    title?: string | null
    type?: string | null
    version?: string | null
    width?: number | null
  }
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

export interface SerializerFunction {
  (
    type: RichTextElementType,
    element: SpanType,
    text: string,
    children: React.ComponentElement<TextProps, Text>,
    index: string
  ): React.ComponentElement<TextProps, Text> | null
}

export type RichTextSerializer = {
  [key in keyof Elements]?: SerializerFunction
}

export type RichTextDefaultStyles = TextStyle
