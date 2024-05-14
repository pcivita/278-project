interface ColorScheme {
  light: string;
  dark: string;
}

interface ColorSchemes {
  [key: string]: ColorScheme;
}

const Colors: ColorSchemes = {
  color1: {  // Blue
    dark: "#A40E5F",
    light: "#FFE5F3",
  },
  color2: {  // Moss
    dark: "#9AA899",
    light: "#E7F0E6",
  },
  color3: {  // Yellow
    dark: "#C6A5CF",
    light: "#F9EBFD",
  },
  color4: {  // Slate Grey
    dark: "#2A2D12",
    light: "#E6E8FF",
  },
  color5: {  // Lavender
    dark: "#4A7B9D",
    light: "#E1F3FF",
  },
};

export default Colors;
