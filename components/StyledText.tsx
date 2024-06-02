import React from 'react';
import { TextInput, TextInputProps, Text, TextProps } from 'react-native';

interface CustomTextProps extends TextProps {
  useMono?: boolean;
  useUltra?: boolean;
  useMedium?: boolean;
}

export function MonoText({ style, useMono, useUltra, useMedium, ...otherProps }: CustomTextProps) {
  let fontFamily = 'TripSans-Regular';
  if (useMono) {
    fontFamily = 'SpaceMono';
  } else if (useUltra) {
    fontFamily = 'TripSans-Ultra';
  } else if (useMedium) {
    fontFamily = 'TripSans-Medium';
  }

  const textStyle = { fontFamily, ...style };

  return <Text {...otherProps} style={textStyle} />;
}

interface CustomTextInputProps extends TextInputProps {
  useMono?: boolean;
  useUltra?: boolean;
  useMedium?: boolean;
}

export function MonoTextInput({
  style,
  useMono,
  useUltra,
  useMedium,
  ...otherProps
}: CustomTextInputProps) {
  let fontFamily = 'TripSans-Regular';
  if (useMono) {
    fontFamily = 'SpaceMono';
  } else if (useUltra) {
    fontFamily = 'TripSans-Ultra';
  } else if (useMedium) {
    fontFamily = 'TripSans-Medium';
  }

  const textInputStyle = { fontFamily, ...style };

  return <TextInput {...otherProps} style={textInputStyle} />;
}
