import React, { useState } from 'react'
import {
  Platform,
  StyleProp,
  Text,
  TextProps,
  TextStyle,
  ViewProps,
} from 'react-native'

type HoverableViewProps = ViewProps & {
  outerStyle?: StyleProp<TextStyle>
  hoverStyle?: StyleProp<TextStyle>
  linkProps: TextProps & { href: string; target?: string; rel?: string }
  children: React.ReactNode
}

export const HoverableLink = (props: HoverableViewProps) => {
  const [hover, setHover] = useState(false)
  const { outerStyle, hoverStyle, children, linkProps } = props

  return (
    <Text
      style={hover ? hoverStyle : outerStyle}
      {...linkProps}
      {...Platform.select({
        web: {
          accessibilityRole: 'link',
          onMouseEnter: () => setHover(true),
          onMouseLeave: () => setHover(false),
        },
      })}
    >
      {children}
    </Text>
  )
}
