import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET || "access_secret_key";
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || "refresh_secret_key";

const ACCESS_TOKEN_EXPIRATION = "1h";
const REFRESH_TOKEN_EXPIRATION = "7d";

export interface JwtPayload {
  id: number;
  name?: string;
  companyId?: number;
}

export function generateTokens(payload: JwtPayload) {
  const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRATION });
  const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION });

  return { accessToken, refreshToken };
}

export function verifyAccessToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export function refreshTokens(refreshToken: string): { accessToken: string; refreshToken?: string} | null {
  const decoded = verifyRefreshToken(refreshToken);
  if (!decoded) return null;

  const newAccessToken = jwt.sign(
    { id: decoded.id, name: decoded.name, companyId: decoded.companyId },
    ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRATION }
  );

  const newRefreshToken = jwt.sign(
    { id: decoded.id, name: decoded.name, companyId: decoded.companyId },
    REFRESH_TOKEN_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRATION }
  );

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}