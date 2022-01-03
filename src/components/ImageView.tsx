import React from 'react'
import {
  Image,
  ImageStyle,
  StyleProp,
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native'

import { ImageType } from '../../typings'

type ImageProps = ViewProps & {
  element: ImageType
  wrapperStyle?: StyleProp<ViewStyle>
  style?: StyleProp<ImageStyle>
}
export const ImageView = (props: ImageProps) => {
  const { element, wrapperStyle, style } = props

  const flattenedStyle = StyleSheet.flatten(style) as ImageStyle

  const width =
    typeof flattenedStyle?.width === 'number' ? flattenedStyle.width : 300
  const aspectRatio = element.dimensions.width / element.dimensions.height
  const height = width / aspectRatio

  return (
    <View style={wrapperStyle}>
      <Image
        style={[style, { width: width, height: height }]}
        source={{ uri: element.url }}
        accessibilityLabel={element.alt}
      />
    </View>
  )
}
