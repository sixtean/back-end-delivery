import { Connection } from "../../data/Data-Source";
import { User } from "../../models/User";
import { Company } from "../../models/Company";
import bcrypt from 'bcrypt';

export class ClientRegisterService {
    private userRepository = Connection.getRepository(User);
    private companyRepository = Connection.getRepository(Company);

    async register(name:string, password: string, companyId: number) {
        if(!name || !password || !companyId) {
            throw new Error("Campos obrigatorios: nome e senha.")
        }

        const company = await this.companyRepository.findOneBy({ id: companyId });
        if(!company) {
            throw new Error("Empresa não encontrada.");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = this.userRepository.create({
            name,
            password: hashedPassword,
            role: "client",
            company,
        });

        await this.userRepository.save(user);

        return {
            id: user.id,
            name: user.name,
            created_at: user.created_at
        }
    }
}