
import api from "./api";

export interface UserCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends UserCredentials {
  name: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role?: string;
  };
  token: string;
}

export const authService = {
  async login(credentials: UserCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/login", credentials);
    this.setUserData(response.data);
    return response.data;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/register", data);
    this.setUserData(response.data);
    return response.data;
  },

  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser(): any {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem("token");
  },

  setUserData(data: AuthResponse): void { // Removed 'private'
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
  },
};

// Exporting both default and named export for flexibility
export default authService;
