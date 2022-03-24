import { RTImageNode } from '@prismicio/types'
import React from 'react'
import {
  Image,
  ImageStyle,
  Linking,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native'

import { LinkFunction } from '../../typings'
import { linkResolver } from '../services'

type ImageProps = ViewProps & {
  element: RTImageNode
  wrapperStyle?: StyleProp<ViewStyle>
  style?: StyleProp<ImageStyle>
  onLinkPress?: LinkFunction
}
export const ImageView = (props: ImageProps) => {
  const { element, wrapperStyle, style, onLinkPress } = props

  const flattenedStyle = StyleSheet.flatten(style) as ImageStyle

  const width =
    typeof flattenedStyle?.width === 'number' ? flattenedStyle.width : 300
  const aspectRatio = element.dimensions.width / element.dimensions.height
  const height = width / aspectRatio
  return (
    <View style={wrapperStyle}>
      <Pressable
        onPress={() => {
          if (element.linkTo) {
            onLinkPress
              ? onLinkPress(element.linkTo)
              : Linking.openURL(linkResolver(element.linkTo)).catch(
                  console.warn
                )
          }
        }}
      >
        <Image
          style={[style, { width: width, height: height }]}
          source={{ uri: element.url }}
          accessibilityLabel={element.alt || ''}
        />
      </Pressable>
    </View>
  )
}
