import { Connection } from "../data/Data-Source";
import { Company } from "../models/Company";

export const CompanyService = {
    async getProfile(CompanyId: number) {
        const repo = Connection.getRepository(Company);

        const company = await repo.findOne({
            where: { id: CompanyId },
            relations: ["orders"],
        });
        
        if(!company) throw new Error("Empresa não encontrada");

        return company
    }
}