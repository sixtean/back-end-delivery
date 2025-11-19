import jwt from "jsonwebtoken";

export interface CompanyJwtPayload {
  companyId: number;
  iat?: number;
  exp?: number;
}

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET || "access_secret_key";
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || "refresh_secret_key";

const ACCESS_TOKEN_EXPIRATION = "30m";
const REFRESH_TOKEN_EXPIRATION = "7d";

export class Token {
  public async generateTokens(payload: CompanyJwtPayload) {
    if (!payload.companyId) {
      throw new Error("Payload inválido: companyId é obrigatório");
    }

    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRATION,
    });

    const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRATION,
    });

    return { accessToken, refreshToken };
  }

  public verifyAccessToken(token: string): CompanyJwtPayload | null {
    try {
      return jwt.verify(token, ACCESS_TOKEN_SECRET) as CompanyJwtPayload;
    } catch {
      return null;
    }
  }

  public verifyRefreshToken(token: string): CompanyJwtPayload | null {
    try {
      return jwt.verify(token, REFRESH_TOKEN_SECRET) as CompanyJwtPayload;
    } catch {
      return null;
    }
  }

  static refresh(refreshToken: string): { accessToken: string; refreshToken: string } | null {
    const tokenInstance = new Token();
    const decoded = tokenInstance.verifyRefreshToken(refreshToken);
    if (!decoded || !decoded.companyId) return null;

    const newAccessToken = jwt.sign(
      { companyId: decoded.companyId },
      ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRATION }
    );

    const newRefreshToken = jwt.sign(
      { companyId: decoded.companyId },
      REFRESH_TOKEN_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRATION }
    );

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }
}