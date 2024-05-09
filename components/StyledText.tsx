import React from 'react';
import { Text, TextProps } from 'react-native';

interface CustomTextProps extends TextProps {
  useMono?: boolean;
  useUltra?: boolean;
}

export function MonoText({ style, useMono, useUltra, ...otherProps }: CustomTextProps) {
  let fontFamily = 'TripSans-Regular';
  if (useMono) {
    fontFamily = 'SpaceMono';
  } else if (useUltra) {
    fontFamily = 'TripSans-Ultra';
  }

  const textStyle = { fontFamily, ...style };  // Combine fontFamily with existing styles safely

  return <Text {...otherProps} style={textStyle} />;
}

