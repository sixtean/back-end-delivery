import "reflect-metadata";
import { Connection } from "./data/Data-Source";
import { Company } from "./models/Company";
import { User } from "./models/User";
import bcrypt from "bcrypt";

async function seed() {
  try {
    const dataSource = await Connection.initialize();
    console.log("✅ Banco de dados conectado para seed");

    // 1️⃣ Criar empresas
    const companyRepository = dataSource.getRepository(Company);

    // criptografar senhas das empresas
    const hashedPassword1 = await bcrypt.hash("2007", 10);
    const hashedPassword2 = await bcrypt.hash("2001", 10);

    const ciaDelivery = companyRepository.create({ name: "Cia Delivery", password: hashedPassword1 });
    const rossetDelivery = companyRepository.create({ name: "Rosset Delivery", password: hashedPassword2 });

    await companyRepository.save([ciaDelivery, rossetDelivery]);
    console.log("✅ Empresas criadas:", ciaDelivery, rossetDelivery);

    // 2️⃣ Criar usuários (clientes)
    const userRepository = dataSource.getRepository(User);

    const hashedUserPassword = await bcrypt.hash("12345", 10);

    const users = [
      userRepository.create({ name: "Joao", password: hashedUserPassword, role: "client", company: ciaDelivery }),
      userRepository.create({ name: "Maria", password: hashedUserPassword, role: "client", company: ciaDelivery }),
      userRepository.create({ name: "Pedro", password: hashedUserPassword, role: "client", company: rossetDelivery }),
      userRepository.create({ name: "Ana", password: hashedUserPassword, role: "client", company: rossetDelivery }),
    ];

    await userRepository.save(users);
    console.log("✅ Usuários criados");

    await dataSource.destroy();
    console.log("✅ Seed finalizado e conexão fechada");
  } catch (error) {
    console.error("❌ Erro no seed:", error);
  }
}

seed();