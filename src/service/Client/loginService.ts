import { Connection } from "../../data/Data-Source";
import { User } from "../../models/User";
import { Company } from "../../models/Company";
import bcrypt from 'bcrypt';

interface LoginProps {
    name: string;
    password: string;
    companyId: number;
}

export const LoginClientService = {
    async login({ name, password, companyId}: LoginProps) {
        const userRepository = Connection.getRepository(User);
        const companyRepository = Connection.getRepository(Company);

        const company = await companyRepository.findOne({
            where: { id: companyId },
        });

        if(!company) {
            return {
                success: false,
                message: "Empresa não encontrada."
            };
        }

        const user = await userRepository.findOne({
            where: { name, company: { id: companyId } },
            relations: ["company"],
        });

        if(!user) {
            return {
                success: false,
                message: "Usuário não encontrado."
            };
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if(!passwordMatch) {
            return {
                success: false,
                message: 'Senha incorreta'
            };
        }

        return {
            success: true,
            message: "Login realizado com sucesso!",
            user: {
                id: user.id,
                name: user.name,
                role: user.role,
                company: {
                    id: company.id,
                    name: company.name,
                },
            },
        };
    }
}