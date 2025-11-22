import { isDataURI } from "class-validator";
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
    },

    async listAll() {
        const repo = Connection.getRepository(Company);

        const companies = await repo.find({
            relations: ["users", "products", "orders", "config"],
        });

        return companies.map(company => ({
            id: company.id,
            name: company.name,
            payDay: company.billing_day,
            created_at: company.created_at,
        }));
    },

    async create(data: {
        name: string;
        password: string;
        billing_day: number;
    }) {
        const repo = Connection.getRepository(Company);

        const { name, password, billing_day } = data;
    
        if(!name || !password || !billing_day) {
            throw new Error ('Campos obrigatorios não enviados.');
        }

        if (![5, 20].includes(billing_day)) {
            throw new Error('dia de cobrança invalido, o dia deve ser 5 ou 20.');
        }

        const newCompany = repo.create({
            name,
            password,
            billing_day,
        });

        return await repo.save(newCompany);
    },

    async delete(CompanyId: number) {
        const repo = Connection.getRepository(Company);

        const company = await repo.findOne({ where: { id: CompanyId } });

        if(!company) {
            throw new Error("Empresa não encontrada");
        }

        await repo.remove(company);

        return { message: "Empresa removida com sucesso" };
    }
}