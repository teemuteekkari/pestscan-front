export const colors = {
    // Primary colors
    primary: '#2ecc71',
    primaryDark: '#27ae60',
    primaryLight: '#58d68d',
    secondary: '#3498db',
    secondaryDark: '#2980b9',
    secondaryLight: '#5dade2',
    accent: '#e74c3c',
    
    // Severity colors (matching backend SeverityLevel)
    severityZero: '#2ecc71',
    severityLow: '#f1c40f',
    severityModerate: '#e67e22',
    severityHigh: '#e74c3c',
    severityVeryHigh: '#c0392b',
    severityEmergency: '#7f0000',
    
    // Status colors
    success: '#2ecc71',
    successDark: '#27ae60',
    successLight: '#58d68d',
    warning: '#f39c12',
    warningDark: '#e67e22',
    warningLight: '#f8c471',
    error: '#e74c3c',
    errorDark: '#c0392b',
    errorLight: '#ec7063',
    info: '#3498db',
    infoDark: '#2980b9',
    infoLight: '#5dade2',
    
    // Neutral colors
    background: '#f5f6fa',
    surface: '#ffffff',
    text: '#2c3e50',
    textSecondary: '#7f8c8d',
    textLight: '#95a5a6',
    border: '#dfe6e9',
    borderDark: '#bdc3c7',
    disabled: '#b2bec3',
    overlay: 'rgba(0, 0, 0, 0.5)',
    
    // Category colors
    pest: '#e74c3c',
    disease: '#e67e22',
    beneficial: '#2ecc71',
    
    // Additional UI colors
    white: '#ffffff',
    black: '#000000',
    transparent: 'transparent',
    
    // Chart colors
    chart1: '#3498db',
    chart2: '#2ecc71',
    chart3: '#f39c12',
    chart4: '#e74c3c',
    chart5: '#9b59b6',
    chart6: '#1abc9c',
    
    // Background variations
    backgroundLight: '#fafbfc',
    backgroundDark: '#ecf0f1',
  } as const;
  
  export type ColorKey = keyof typeof colors;
  
  // Helper function to get severity color
  export const getSeverityColor = (level: string): string => {
    const levelMap: Record<string, string> = {
      ZERO: colors.severityZero,
      LOW: colors.severityLow,
      MODERATE: colors.severityModerate,
      HIGH: colors.severityHigh,
      VERY_HIGH: colors.severityVeryHigh,
      EMERGENCY: colors.severityEmergency,
    };
    
    return levelMap[level] || colors.text;
  };
  
  // Helper function to get category color
  export const getCategoryColor = (category: string): string => {
    const categoryMap: Record<string, string> = {
      PEST: colors.pest,
      DISEASE: colors.disease,
      BENEFICIAL: colors.beneficial,
    };
    
    return categoryMap[category] || colors.text;
  };
  
  // Helper function to get status color
  export const getStatusColor = (status: string): string => {
    const statusMap: Record<string, string> = {
      ACTIVE: colors.success,
      INACTIVE: colors.disabled,
      PENDING: colors.warning,
      COMPLETED: colors.success,
      IN_PROGRESS: colors.info,
      DRAFT: colors.warning,
      CANCELLED: colors.error,
      SUSPENDED: colors.error,
    };
    
    return statusMap[status] || colors.text;
  };