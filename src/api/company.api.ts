import apiClient from './client';
import type {
  CompanyDto,
  CompanyCreateDto,
  CompanyUpdateDto,
  BranchDto,
  BranchCreateDto,
  BranchUpdateDto,
} from '../types/company.types';

export const companyApi = {
  // Get all companies with branches
  getAllCompanies: async (): Promise<CompanyDto[]> => {
    const response = await apiClient.get<CompanyDto[]>('/api/companies');
    return response.data;
  },

  // Get company by ID
  getCompanyById: async (id: string): Promise<CompanyDto> => {
    const response = await apiClient.get<CompanyDto>(`/api/companies/${id}`);
    return response.data;
  },

  // Create new company
  createCompany: async (data: CompanyCreateDto): Promise<CompanyDto> => {
    const response = await apiClient.post<CompanyDto>('/api/companies', data);
    return response.data;
  },

  // Update company
  updateCompany: async (id: string, data: CompanyUpdateDto): Promise<CompanyDto> => {
    const response = await apiClient.put<CompanyDto>(`/api/companies/${id}`, data);
    return response.data;
  },

  // Delete company (soft delete)
  deleteCompany: async (id: string): Promise<string> => {
    const response = await apiClient.delete<string>(`/api/companies/${id}`);
    return response.data;
  },
};

export const branchApi = {
  // Get all branches
  getAllBranches: async (): Promise<BranchDto[]> => {
    const response = await apiClient.get<BranchDto[]>('/api/branches');
    return response.data;
  },

  // Get branches by company ID
  getBranchesByCompany: async (companyId: string): Promise<BranchDto[]> => {
    const response = await apiClient.get<BranchDto[]>(`/api/branches/company/${companyId}`);
    return response.data;
  },

  // Get branch by ID
  getBranchById: async (id: string): Promise<BranchDto> => {
    const response = await apiClient.get<BranchDto>(`/api/branches/${id}`);
    return response.data;
  },

  // Create new branch
  createBranch: async (data: BranchCreateDto): Promise<BranchDto> => {
    const response = await apiClient.post<BranchDto>('/api/branches', data);
    return response.data;
  },

  // Update branch
  updateBranch: async (id: string, data: BranchUpdateDto): Promise<BranchDto> => {
    const response = await apiClient.put<BranchDto>(`/api/branches/${id}`, data);
    return response.data;
  },

  // Delete branch (soft delete)
  deleteBranch: async (id: string): Promise<string> => {
    const response = await apiClient.delete<string>(`/api/branches/${id}`);
    return response.data;
  },
};
