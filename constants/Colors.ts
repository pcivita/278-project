interface ColorScheme {
  light: string;
  dark: string;
}

interface ColorSchemes {
  [key: string]: ColorScheme;
}

const Colors: ColorSchemes = {
  color1: {  // Pink
    dark: "#B3578A",
    light: "#FFE5F3",
  },
  color2: {  // Moss
    dark: "#7B917A",
    light: "#E7F0E6",
  },
  color3: {  // Lavender
    dark: "#B58FBF",
    light: "#F9EBFD",
  },
  color4: {  // Purple
    dark: "#757BBA",
    light: "#E6E8FF",
  },
  color5: {  // Blue
    dark: "#5A8CAD",
    light: "#E1F3FF",
  },
};

export default Colors;
