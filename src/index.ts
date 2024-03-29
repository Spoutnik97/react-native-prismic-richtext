import { serialize } from '@prismicio/richtext'
import { RichTextField } from '@prismicio/types'
import React, { createElement, Fragment } from 'react'

import {
  LinkFunction,
  RichTextDefaultStyles,
  RichTextSerializer,
  RichTextStyles,
} from '../typings'
import { computeStyles, serializerWithStyle } from './services'

type RichTextProps = {
  richText: RichTextField
  defaultStyle?: RichTextDefaultStyles
  styles?: RichTextStyles
  ContainerComponent?: React.ComponentClass | React.ExoticComponent
  onLinkPress?: LinkFunction
  serializers?: RichTextSerializer
}

export const RichText = ({
  richText,
  defaultStyle,
  styles,
  ContainerComponent,
  onLinkPress,
  serializers,
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
  const serializedChildren = serialize(
    richText,
    serializerWithStyle(computedStyles, onLinkPress, serializers)
  )
  return createElement(ContainerComponent || Fragment, {}, serializedChildren)
}
