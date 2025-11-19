export interface JwtPayload {
  id: number;
  name?: string;
  companyId?: number;
  type?: "access" | "refresh";
  iat?: number;
  exp?: number;
}