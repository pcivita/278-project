import React from 'react';
import { Text, TextProps } from 'react-native';

interface CustomTextProps extends TextProps {
  useMono?: boolean;
  useUltra?: boolean;
  useMedium?: boolean; // Add the useMedium prop
}

export function MonoText({ style, useMono, useUltra, useMedium, ...otherProps }: CustomTextProps) {
  let fontFamily = 'TripSans-Regular';
  if (useMono) {
    fontFamily = 'SpaceMono';
  } else if (useUltra) {
    fontFamily = 'TripSans-Ultra';
  } else if (useMedium) {
    fontFamily = 'TripSans-Medium'; // Use TripSans-Medium when useMedium is true
  }

  const textStyle = { fontFamily, ...style };  // Combine fontFamily with existing styles safely

  return <Text {...otherProps} style={textStyle} />;
}
