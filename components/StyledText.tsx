import { Text, TextProps } from './Themed';

interface CustomTextProps extends TextProps {
  useMono?: boolean;  // Flag to decide if Mono font should be used
  useUltra?: boolean;  // Flag to use Ultra font
}

export function MonoText(props: CustomTextProps) {
  let fontFamily = 'TripSansRegular';  // Default to regular
  if (props.useMono) {
    fontFamily = 'SpaceMono';  // Use Space Mono if specified
  } else if (props.useUltra) {
    fontFamily = 'TripSansUltra';  // Use TripSans Ultra if specified
  }

  return <Text {...props} style={[props.style, { fontFamily }]} />;
}
