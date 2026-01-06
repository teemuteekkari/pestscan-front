// src/types/api.types.ts

export enum Role {
    SCOUT = 'SCOUT',
    MANAGER = 'MANAGER',
    FARM_ADMIN = 'FARM_ADMIN',
    SUPER_ADMIN = 'SUPER_ADMIN'
  }
  
  export enum SessionStatus {
    DRAFT = 'DRAFT',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED'
  }
  
  export enum SubscriptionStatus {
    PENDING_ACTIVATION = 'PENDING_ACTIVATION',
    ACTIVE = 'ACTIVE',
    SUSPENDED = 'SUSPENDED',
    CANCELLED = 'CANCELLED',
    DELETED = 'DELETED'
  }
  
  export enum SubscriptionTier {
    BASIC = 'BASIC',
    STANDARD = 'STANDARD',
    PREMIUM = 'PREMIUM'
  }
  
  export enum FarmStructureType {
    GREENHOUSE = 'GREENHOUSE',
    FIELD = 'FIELD',
    OTHER = 'OTHER'
  }
  
  export enum ObservationCategory {
    PEST = 'PEST',
    DISEASE = 'DISEASE',
    BENEFICIAL = 'BENEFICIAL'
  }
  
  export enum SpeciesCode {
    // Pests
    THRIPS = 'THRIPS',
    RED_SPIDER_MITE = 'RED_SPIDER_MITE',
    WHITEFLIES = 'WHITEFLIES',
    MEALYBUGS = 'MEALYBUGS',
    CATERPILLARS = 'CATERPILLARS',
    FALSE_CODLING_MOTH = 'FALSE_CODLING_MOTH',
    PEST_OTHER = 'PEST_OTHER',
    
    // Diseases
    DOWNY_MILDEW = 'DOWNY_MILDEW',
    POWDERY_MILDEW = 'POWDERY_MILDEW',
    BOTRYTIS = 'BOTRYTIS',
    VERTICILLIUM = 'VERTICILLIUM',
    BACTERIAL_WILT = 'BACTERIAL_WILT',
    DISEASE_OTHER = 'DISEASE_OTHER',
    
    // Beneficial
    BENEFICIAL_PP = 'BENEFICIAL_PP'
  }
  
  export enum SeverityLevel {
    ZERO = 'ZERO',
    LOW = 'LOW',
    MODERATE = 'MODERATE',
    HIGH = 'HIGH',
    VERY_HIGH = 'VERY_HIGH',
    EMERGENCY = 'EMERGENCY'
  }
  
  export enum RecommendationType {
    BIOLOGICAL_CONTROL = 'BIOLOGICAL_CONTROL',
    CHEMICAL_SPRAYS = 'CHEMICAL_SPRAYS',
    OTHER_METHODS = 'OTHER_METHODS'
  }
  
  // User Types
  export interface UserDto {
    id: string;
    farmId?: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: Role;
    isEnabled: boolean;
    lastLogin?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface LoginResponse {
    token: string;
    refreshToken: string;
    expiresIn: number;
    user: UserDto;
  }
  
  export interface RegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: Role;
    farmId?: string;
  }
  
  // Farm Types
  export interface FarmResponse {
    id: string;
    farmTag?: string;
    name: string;
    description?: string;
    externalId?: string;
    address?: string;
    city?: string;
    province?: string;
    postalCode?: string;
    country?: string;
    contactName?: string;
    contactEmail?: string;
    contactPhone?: string;
    subscriptionStatus: SubscriptionStatus;
    subscriptionTier: SubscriptionTier;
    billingEmail?: string;
    licensedAreaHectares: number;
    licensedUnitQuota?: number;
    quotaDiscountPercentage?: number;
    licenseExpiryDate?: string;
    autoRenewEnabled?: boolean;
    accessLocked?: boolean;
    structureType: FarmStructureType;
    defaultBayCount?: number;
    defaultBenchesPerBay?: number;
    defaultSpotChecksPerBench?: number;
    createdAt: string;
    updatedAt: string;
    timezone?: string;
    ownerId: string;
    scoutId?: string;
  }
  
  export interface CreateFarmRequest {
    name: string;
    description?: string;
    externalId?: string;
    address?: string;
    city?: string;
    province?: string;
    postalCode?: string;
    country?: string;
    ownerId: string;
    scoutId?: string;
    contactName?: string;
    contactEmail?: string;
    contactPhone?: string;
    subscriptionStatus: SubscriptionStatus;
    subscriptionTier: SubscriptionTier;
    billingEmail?: string;
    licensedAreaHectares: number;
    licensedUnitQuota?: number;
    quotaDiscountPercentage?: number;
    structureType?: FarmStructureType;
    defaultBayCount?: number;
    defaultBenchesPerBay?: number;
    defaultSpotChecksPerBench?: number;
    greenhouses?: CreateGreenhouseRequest[];
    fieldBlocks?: CreateFieldBlockRequest[];
    timezone?: string;
    licenseExpiryDate?: string;
    autoRenewEnabled?: boolean;
  }

  export interface UpdateFarmRequest {
        name: string;
    description?: string;
    externalId?: string;
    address?: string;
    city?: string;
    province?: string;
    postalCode?: string;
    country?: string;
    contactName?: string;
    contactEmail?: string;
    contactPhone?: string;
    subscriptionStatus: SubscriptionStatus;
    subscriptionTier: SubscriptionTier;
    billingEmail?: string;
    licensedAreaHectares: number;
    licensedUnitQuota?: number;
    quotaDiscountPercentage?: number;
    defaultBayCount?: number;
    defaultBenchesPerBay?: number;
    defaultSpotChecksPerBench?: number;
    greenhouses?: CreateGreenhouseRequest[];
    fieldBlocks?: CreateFieldBlockRequest[];
    timezone?: string;
    licenseExpiryDate?: string;
    autoRenewEnabled?: boolean;
    isArchived?: boolean;
    licenseGracePeriodEnd?: string;
    licenseArchivedDate?: string;
    latitude?: number;
    longitude?: number;  
}
  
  // Greenhouse Types
  export interface GreenhouseDto {
    id: string;
    version: number;
    farmId: string;
    name: string;
    description?: string;
    bayCount?: number;
    benchesPerBay?: number;
    spotChecksPerBench?: number;
    bayTags: string[];
    benchTags: string[];
    active: boolean;
  }
  
  export interface CreateGreenhouseRequest {
    name: string;
    description?: string;
    bayCount: number;
    benchesPerBay: number;
    spotChecksPerBench: number;
    bayTags?: string[];
    benchTags?: string[];
  }

  export interface UpdateGreenhouseRequest {
    name?: string;
    bayCount?: number;
    benchesPerBay?: number;
    spotChecksPerBench?: number;
    active?: boolean;
    description?: string;
    bayTags?: string[];
    benchTags?: string[];
  }
  
  // Field Block Types
  export interface FieldBlockDto {
    id: string;
    version: number;
    farmId: string;
    name: string;
    bayCount?: number;
    spotChecksPerBay?: number;
    bayTags: string[];
    active: boolean;
  }
  
  export interface CreateFieldBlockRequest {
    name: string;
    bayCount: number;
    spotChecksPerBay: number;
    bayTags?: string[];
    active?: boolean;
  }
  
  // Scouting Session Types
  export interface ScoutingSessionDetailDto {
    id: string;
    version?: number;
    farmId: string;
    sessionDate: string;
    weekNumber?: number;
    status: SessionStatus;
    managerId?: string;
    scoutId?: string;
    crop?: string;
    variety?: string;
    temperatureCelsius?: number;
    relativeHumidityPercent?: number;
    observationTime?: string;
    weatherNotes?: string;
    notes?: string;
    startedAt?: string;
    completedAt?: string;
    confirmationAcknowledged: boolean;
    sections: ScoutingSessionSectionDto[];
    recommendations: RecommendationEntryDto[];
  }
  
  export interface ScoutingSessionSectionDto {
    targetId: string;
    greenhouseId?: string;
    fieldBlockId?: string;
    includeAllBays?: boolean;
    includeAllBenches?: boolean;
    bayTags: string[];
    benchTags: string[];
    observations: ScoutingObservationDto[];
  }
  
  export interface ScoutingObservationDto {
    id: string;
    version?: number;
    sessionId: string;
    sessionTargetId: string;
    greenhouseId?: string;
    fieldBlockId?: string;
    speciesCode: SpeciesCode;
    category: ObservationCategory;
    bayIndex: number;
    bayTag?: string;
    benchIndex: number;
    benchTag?: string;
    spotIndex: number;
    count: number;
    notes?: string;
  }
  
  export interface CreateScoutingSessionRequest {
    farmId: string;
    targets: SessionTargetRequest[];
    sessionDate: string;
    weekNumber?: number;
    crop?: string;
    variety?: string;
    temperatureCelsius?: number;
    relativeHumidityPercent?: number;
    observationTime?: string;
    weatherNotes?: string;
    notes?: string;
  }
  
  export interface SessionTargetRequest {
    greenhouseId?: string;
    fieldBlockId?: string;
    includeAllBays?: boolean;
    includeAllBenches?: boolean;
    bayTags?: string[];
    benchTags?: string[];
  }
  
  export interface UpsertObservationRequest {
    sessionId: string;
    sessionTargetId: string;
    speciesCode: SpeciesCode;
    bayIndex: number;
    bayTag?: string;
    benchIndex: number;
    benchTag?: string;
    spotIndex: number;
    count: number;
    notes?: string;
    version?: number;
  }
  
  export interface CompleteSessionRequest {
    version: number;
    confirmationAcknowledged: boolean;
  }
  
  export interface RecommendationEntryDto {
    type: RecommendationType;
    text: string;
  }
  
  // Heatmap Types
  export interface HeatmapResponse {
    farmId: string;
    farmName: string;
    week: number;
    year: number;
    bayCount: number;
    benchesPerBay: number;
    cells: HeatmapCellResponse[];
    sections: HeatmapSectionResponse[];
    severityLegend: SeverityLegendEntry[];
  }
  
  export interface HeatmapCellResponse {
    bayIndex: number;
    benchIndex: number;
    pestCount: number;
    diseaseCount: number;
    beneficialCount: number;
    totalCount: number;
    severityLevel: SeverityLevel;
    colorHex: string;
  }
  
  export interface HeatmapSectionResponse {
    targetId: string;
    greenhouseId?: string;
    fieldBlockId?: string;
    targetName: string;
    bayCount: number;
    benchesPerBay: number;
    cells: HeatmapCellResponse[];
  }
  
  export interface SeverityLegendEntry {
    level: string;
    minInclusive: number;
    maxInclusive: number;
    colorHex: string;
  }
  
  
  // Analytics Types
  export interface FarmWeeklyAnalyticsDto {
    farmId: string;
    farmName: string;
    week: number;
    year: number;
    bayCount: number;
    benchesPerBay: number;
    totalSessions: number;
    completedSessions: number;
    totalObservations: number;
    pestObservations: number;
    diseaseObservations: number;
    beneficialObservations: number;
    severityBuckets: Record<string, number>;
  }
  


// Dashboard Analytics Types
export interface DashboardDto {
  summary: DashboardSummaryDto;
  pestDistribution: PestDistributionItemDto[];
  diseaseDistribution: DiseaseDistributionItemDto[];
  weeklyTrends: WeeklyPestTrendDto[];
  severityTrend: SeverityTrendPointDto[];
  heatmap: HeatmapCellResponse[];
  alerts: AlertDto[];
  recommendations: RecommendationDto[];
  farmComparison: FarmComparisonDto[];
  scoutPerformance: ScoutPerformanceDto[];
}

export interface DashboardSummaryDto {
  farmId: string;
  totalSessions: number;
  activeScouts: number;
  averageSeverityThisWeek: number;
  averageSeverityLastWeek: number;
  pestsDetectedThisWeek: number;
  treatmentsApplied: number;
  currentWeekHeatmap: WeeklyHeatmapResponse[];
  severityTrend: TrendPointDto[];
}

export interface FarmMonthlyReportDto {
  farmId: string;
  year: number;
  month: number;
  weeklyHeatmaps: WeeklyHeatmapResponse[];
  severityTrend: TrendPointDto[];
  topPestTrends: PestTrendResponse[];
  totalSessions: number;
  totalObservations: number;
  activeScouts: number;
  averageSeverity: number;
  worstSeverity: number;
  distinctPestsDetected: number;
  periodStart: string; // ISO date
  periodEnd: string; // ISO date
  legend: SeverityLegendEntry;
}

export interface PestTrendResponse {
  farmId: string;
  speciesCode: string;
  points: TrendPointDto[];
}

export interface WeeklyHeatmapResponse {
  weekNumber: number;
  rangeStart: string;
  rangeEnd: string;
  sections: HeatmapSectionResponse[];
}

export interface TrendPointDto {
  date: string;
  severity: number;
}

export interface PestDistributionItemDto {
  name: string;
  value: number;
  percentage: number;
  severity: string;
}

export interface DiseaseDistributionItemDto {
  name: string;
  value: number;
  percentage: number;
  severity: string;
}

export interface WeeklyPestTrendDto {
  week: string;
  thrips: number;
  redSpider: number;
  whiteflies: number;
  mealybugs: number;
  caterpillars: number;
  fcm: number;
  otherPests: number;
}

export interface SeverityTrendPointDto {
  week: string;
  zero: number;
  low: number;
  medium: number;
  high: number;
  critical: number;
}

export interface AlertDto {
  location: string;
  pest: string;
  severity: string;
  count: number;
  time: string;
}

export interface RecommendationDto {
  scout: string;
  location: string;
  text: string;
  priority: string;
  status: string;
  date: string;
}

export interface FarmComparisonDto {
  farm: string;
  avgSeverity: number;
  observations: number;
  alerts: number;
}

export interface ScoutPerformanceDto {
  scout: string;
  observations: number;
  accuracy: number;
  avgTime: string;
}
  
  // Error Response
  export interface ErrorResponse {
    timestamp: string;
    status: number;
    errorCode: string;
    message: string;
    path: string;
    details?: string[];
  }

  export interface ReportExportRequest {
  farmId: string;
  startDate: string; // ISO date
  endDate: string; // ISO date
  format: 'PDF' | 'EXCEL' | 'CSV';
  sections: {
    summary: boolean;
    observations: boolean;
    charts: boolean;
    heatmaps: boolean;
    recommendations: boolean;
    photos: boolean;
  };
}

export interface ReportExportResponse {
  downloadUrl: string;
  fileName: string;
  fileSize: number;
  expiresAt: string; // ISO datetime
}
