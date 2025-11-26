import { Connection } from "../data/Data-Source";
import { Company } from "../models/Company";
import bcrypt from "bcrypt";
import { Token } from "../utils/jsonwebtoken";

export class AuthService {
  private companyRepository = Connection.getRepository(Company);
  private tokenService = new Token();

  public async loginCompany({ id, password }: { id: number; password: string }) {
    const company = await this.companyRepository.findOne({
      where: { id },
    });

    if (!company) throw { status: 404, message: "Empresa não encontrada." };

    const isPasswordValid = await bcrypt.compare(password, company.password);
    if (!isPasswordValid) throw { status: 401, message: "Senha incorreta." };

    const tokens = await this.tokenService.generateTokens({ companyId: company.id });

    return {
      success: true,
      message: "Login realizado com sucesso!",
      company: {
        id: company.id,
        name: company.name,
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }
}