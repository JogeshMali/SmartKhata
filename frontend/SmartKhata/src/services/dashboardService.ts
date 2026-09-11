import { axiosInstance } from '../api/axiosInstance';
import { DashboardResponse } from '../types/dashboard';

export const dashboardService = {
  getDashboard: async (): Promise<DashboardResponse> => {
    const response = await axiosInstance.get<DashboardResponse>('/dashboard');
    return response.data;
  },
};
