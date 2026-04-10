export interface BranchDto {
  id: string;
  companyId: string;
  companyName: string;
  name: string;
  code: string;
  address?: string;
  phone?: string;
  email?: string;
  latitude?: number;
  longitude?: number;
  isActive: boolean;
  createDate: string;
}

export interface CompanyDto {
  id: string;
  name: string;
  code: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
  isActive: boolean;
  createDate: string;
  branches?: BranchDto[];
}

export interface CompanyCreateDto {
  name: string;
  code: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
}

export interface CompanyUpdateDto {
  name?: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
  isActive?: boolean;
}

export interface BranchCreateDto {
  companyId: string;
  name: string;
  code: string;
  address?: string;
  phone?: string;
  email?: string;
  latitude?: number;
  longitude?: number;
}

export interface BranchUpdateDto {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  latitude?: number;
  longitude?: number;
  isActive?: boolean;
}
