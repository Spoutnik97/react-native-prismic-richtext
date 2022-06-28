import { RichTextFunctionSerializer } from '@prismicio/richtext'
import {
  FilledLinkToDocumentField,
  FilledLinkToMediaField,
  FilledLinkToWebField,
  RichTextNodeType,
} from '@prismicio/types'
import {
  ImageStyle,
  StyleProp,
  Text,
  TextProps,
  TextStyle,
  ViewStyle,
} from 'react-native'

export type RichTextElementType = typeof RichTextNodeType[keyof typeof RichTextNodeType]

export type LinkType =
  | FilledLinkToDocumentField
  | FilledLinkToWebField
  | FilledLinkToMediaField

export interface LinkFunction {
  (data: LinkType | undefined): void
}

type SpanDataType = {
  type: 'hyperlink'
  data?: LinkType
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
  [key in
    | RichTextElementType
    | 'imageWrapper'
    | 'hyperlinkHover'
    | 'list'
    | 'o-list']?:
    | StyleProp<TextStyle>
    | StyleProp<ViewStyle>
    | StyleProp<ImageStyle>
}

export type SerializerFunction = RichTextFunctionSerializer<React.ComponentElement<
  TextProps,
  Text
> | null>

export type SerializerChildren = (React.ComponentElement<
  TextProps,
  Text
> | null)[]

export type RichTextSerializer = {
  [key in RichTextElementType]?: SerializerFunction
}

export type RichTextDefaultStyles = TextStyle
