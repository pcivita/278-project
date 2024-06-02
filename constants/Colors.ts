interface ColorScheme {
  light: string;
  dark: string;
}

interface ColorSchemes {
  [key: string]: ColorScheme;
}

const Colors: ColorSchemes = {
  color1: {  // Purple
    dark: "#757BBA",
    light: "#E6E8FF",
  },
  color2: {  // Moss
    dark: "#7B917A",
    light: "#E0EDDF",
  },
  color3: {  // Lavender
    dark: "#B58FBF",
    light: "#F0E2F3",
  },
  color4: {  // Blue
    dark: "#5A8CAD",
    light: "#DBF1FF",
  },
  color5: {  // Pink
    dark: "#B3578A",
    light: "#FFE5F3",
  },
};

export default Colors;
