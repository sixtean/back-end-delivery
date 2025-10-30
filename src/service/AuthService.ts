import { Connection } from "../data/Data-Source";
import { User } from "../models/User";
import { Company } from "../models/Company";
import {  LoginDTO } from "../DTOs/authDTO";
import bcrypt from "bcrypt";
import { generateTokens, refreshTokens } from "../utils/jsonwebtoken";

export class AuthService {
  private userRepository = Connection.getRepository(User);
  

  async login({ name, password, companyId }: LoginDTO) {
    const user = await this.userRepository.findOne({
      where: { name },
      relations: ["company"],
    });

    if (!user) throw new Error("Usuário não encontrado.");
    if (user.company.id !== companyId)
      throw new Error("Usuário não pertence a esta empresa.");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error("Senha incorreta.");

    const tokens = generateTokens({id: user.id, name: user.name, companyId })

    return {
      success: true,
      message: "Login realizado com sucesso!",
      user,
      acessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async loginCompany({ id, password }: { id: number; password: string }) {
    const companyRepository = Connection.getRepository(Company);

    const company = await companyRepository.findOne({ where: { id }, relations: ["users"] });

    if (!company) throw { status: 404, message: "Empresa não encontrada." };

    const isPasswordValid = await bcrypt.compare(password, company.password);
    if (!isPasswordValid) throw { status: 401, message: "Senha incorreta." };

    const tokens = generateTokens({ id: company.id, name: company.name })

    return {
      success: true,
      message: "Login da empresa realizado com sucesso!",
      company: {
        name: company?.name,
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    };
  }
}