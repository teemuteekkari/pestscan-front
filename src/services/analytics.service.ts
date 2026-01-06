// src/services/analytics.service.ts
import { axiosInstance } from './api.client';
import {
  HeatmapResponse,
  FarmWeeklyAnalyticsDto,
  DashboardDto,
  DashboardSummaryDto,
  FarmMonthlyReportDto,
  ReportExportRequest,
  ReportExportResponse, // ✅ Add this
} from '../types/api.types';


class AnalyticsService {
  /**
   * Get heatmap data for a specific farm, week, and year
   * Backend endpoint: GET /api/farms/{farmId}/heatmap?week={week}&year={year}
   */
  async getHeatmap(farmId: string, week: number, year: number): Promise<HeatmapResponse> {
    const response = await axiosInstance.get<HeatmapResponse>(
      `/farms/${farmId}/heatmap`,
      { params: { week, year } }
    );
    return response.data;
  }

  /**
   * Get weekly analytics for a specific farm
   * Backend endpoint: GET /api/analytics/farms/{farmId}/weekly?week={week}&year={year}
   */
  async getWeeklyAnalytics(
    farmId: string,
    week: number,
    year: number
  ): Promise<FarmWeeklyAnalyticsDto> {
    const response = await axiosInstance.get<FarmWeeklyAnalyticsDto>(
      `/analytics/farms/${farmId}/weekly`,
      { params: { week, year } }
    );
    return response.data;
  }

  /**
   * Get dashboard summary only (lighter weight)
   * Backend endpoint: GET /api/analytics/dashboard?farmId={farmId}
   */
  async getDashboardSummary(farmId: string): Promise<DashboardSummaryDto> {
    const response = await axiosInstance.get<DashboardSummaryDto>(
      '/analytics/dashboard',
      { params: { farmId } }
    );
    return response.data;
  }

  /**
   * Get full dashboard analytics for a farm (comprehensive)
   * Backend endpoint: GET /api/analytics/dashboard/full?farmId={farmId}
   */
  async getFullDashboard(farmId: string): Promise<DashboardDto> {
    const response = await axiosInstance.get<DashboardDto>(
      '/analytics/dashboard/full',
      { params: { farmId } }
    );
    return response.data;
  }

  /**
   * Get monthly report for a specific farm
   * Backend endpoint: GET /api/analytics/reports/monthly?farmId={farmId}&year={year}&month={month}
   */
  async getMonthlyReport(
    farmId: string,
    year: number,
    month: number
  ): Promise<FarmMonthlyReportDto> {
    const response = await axiosInstance.get<FarmMonthlyReportDto>(
      '/analytics/reports/monthly',
      { params: { farmId, year, month } }
    );
    return response.data;
  }

  /**
   * Export report in specified format
   * Backend endpoint: POST /api/analytics/reports/export
   */
  async exportReport(request: ReportExportRequest): Promise<ReportExportResponse> {
    const response = await axiosInstance.post<ReportExportResponse>(
      '/analytics/reports/export',
      request
    );
    return response.data;
  }
}

export const analyticsService = new AnalyticsService();