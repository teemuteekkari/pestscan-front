export const fontFamily = {
    regular: 'System',
    medium: 'System',
    semiBold: 'System',
    bold: 'System',
  } as const;
  
  export const fontWeights = {
    regular: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
    extraBold: '800' as const,
  } as const;
  
  export const fontSizes = {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 20,
    xxxl: 24,
    huge: 32,
  } as const;
  
  export const lineHeights = {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  } as const;
  
  export const typograph = {
    h1: {
      fontSize: 32,
      fontWeight: fontWeights.bold,
      lineHeight: 40,
      letterSpacing: -0.5,
    },
    h2: {
      fontSize: 28,
      fontWeight: fontWeights.bold,
      lineHeight: 36,
      letterSpacing: -0.3,
    },
    h3: {
      fontSize: 24,
      fontWeight: fontWeights.semiBold,
      lineHeight: 32,
      letterSpacing: -0.2,
    },
    h4: {
      fontSize: 20,
      fontWeight: fontWeights.semiBold,
      lineHeight: 28,
      letterSpacing: 0,
    },
    h5: {
      fontSize: 18,
      fontWeight: fontWeights.semiBold,
      lineHeight: 24,
      letterSpacing: 0,
    },
    subtitle: {
      fontSize: 16,
      fontWeight: fontWeights.medium,
      lineHeight: 24,
      letterSpacing: 0,
    },
    body: {
      fontSize: 16,
      fontWeight: fontWeights.regular,
      lineHeight: 24,
      letterSpacing: 0,
    },
    bodySmall: {
      fontSize: 14,
      fontWeight: fontWeights.regular,
      lineHeight: 20,
      letterSpacing: 0,
    },
    caption: {
      fontSize: 12,
      fontWeight: fontWeights.regular,
      lineHeight: 16,
      letterSpacing: 0.4,
    },
    overline: {
      fontSize: 10,
      fontWeight: fontWeights.medium,
      lineHeight: 16,
      letterSpacing: 1.5,
      textTransform: 'uppercase' as const,
    },
    button: {
      fontSize: 16,
      fontWeight: fontWeights.semiBold,
      lineHeight: 24,
      letterSpacing: 0.5,
    },
    buttonSmall: {
      fontSize: 14,
      fontWeight: fontWeights.semiBold,
      lineHeight: 20,
      letterSpacing: 0.5,
    },
    buttonLarge: {
      fontSize: 18,
      fontWeight: fontWeights.semiBold,
      lineHeight: 28,
      letterSpacing: 0.5,
    },
    label: {
      fontSize: 14,
      fontWeight: fontWeights.medium,
      lineHeight: 20,
      letterSpacing: 0.1,
    },
  } as const;
  
  export type TypographKey = keyof typeof typograph;