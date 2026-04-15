export interface UserDto {
  id: number;
  companyId?: string;
  branchId?: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}

export interface UserCreateDto {
  companyId?: string;
  branchId?: string;
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface UserUpdateDto {
  name?: string;
  email?: string;
  role?: string;
  isActive?: boolean;
  companyId?: string;
  branchId?: string;
}

export interface UserPasswordResetDto {
  userId: number;
  newPassword: string;
}
