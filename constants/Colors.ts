interface ColorScheme {
  light: string;
  dark: string;
}

interface ColorSchemes {
  [key: string]: ColorScheme;
}

const Colors: ColorSchemes = {
  color1: {  // Blue
    dark: "#4A7B9D",
    light: "#E1F3FF",
  },
  color2: {  // Moss
    dark: "#9AA899",
    light: "#E7F0E6",
  },
  color3: {  // Yellow
    dark: "#ECFFB0",
    light: "#FCFFF2",
  },
  color4: {  // Slate Grey
    dark: "#54577C",
    light: "#D5D7E7",
  },
  color5: {  // Lavender
    dark: "#C6A5CF",
    light: "#F8F0FF",
  },
};

export default Colors;
