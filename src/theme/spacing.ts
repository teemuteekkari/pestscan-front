export const spacing = {
    none: 0,
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  } as const;
  
  export type SpacingKey = keyof typeof spacing;
  
  // Helper function to get spacing value
  export const getSpacing = (multiplier: number): number => {
    return spacing.md * multiplier;
  };
  
  // Border radius
  export const borderRadius = {
    none: 0,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    round: 999,
  } as const;
  
  export type BorderRadiusKey = keyof typeof borderRadius;
  
  // Size constants
  export const sizes = {
    // Icon sizes
    iconXs: 16,
    iconSm: 20,
    iconMd: 24,
    iconLg: 32,
    iconXl: 40,
    
    // Avatar sizes
    avatarXs: 24,
    avatarSm: 32,
    avatarMd: 40,
    avatarLg: 56,
    avatarXl: 80,
    
    // Button heights
    buttonSm: 36,
    buttonMd: 44,
    buttonLg: 52,
    
    // Input heights
    inputSm: 36,
    inputMd: 44,
    inputLg: 52,
    
    // Header heights
    headerHeight: 56,
    tabBarHeight: 60,
  } as const;
  
  export type SizeKey = keyof typeof sizes;