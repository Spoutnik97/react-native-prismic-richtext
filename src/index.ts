// @ts-ignore
import PrismicRichText from 'prismic-richtext'
import React, { createElement, Fragment } from 'react'

import {
  RichTextContent,
  RichTextDefaultStyles,
  RichTextStyles,
} from '../typings'
import { computeStyles, serializerWithStyle } from './services'

type RichTextProps = {
  richText: RichTextContent[]
  defaultStyle?: RichTextDefaultStyles
  styles?: RichTextStyles
  ContainerComponent?: React.ComponentClass | React.ExoticComponent
}

export const RichText = ({
  richText,
  defaultStyle,
  styles,
  ContainerComponent,
}: RichTextProps) => {
  if (!richText) {
    console.warn(`Prop 'render' was not specified in 'RichTextComponent'.`)
    return null
  }

  if (Object.prototype.toString.call(richText) !== '[object Array]') {
    console.warn(
      `Rich text argument should be an Array. Received ${typeof richText}`
    )
    return null
  }

  const computedStyles = computeStyles(defaultStyle, styles)
  const serializedChildren = PrismicRichText.serialize(
    richText,
    serializerWithStyle(computedStyles)
  )
  return createElement(ContainerComponent || Fragment, {}, serializedChildren)
}
