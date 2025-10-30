import "reflect-metadata";
import { Connection } from "./data/Data-Source";

async function resetDatabase() {
  try {
    const dataSource = await Connection.initialize();
    console.log("✅ Banco de dados conectado para reset");

    // ⚠️ Apaga todas as tabelas e dados
    await dataSource.dropDatabase();
    console.log("✅ Banco de dados limpo com sucesso!");

    // Fecha a conexão
    await dataSource.destroy();
    console.log("✅ Conexão fechada");
  } catch (error) {
    console.error("❌ Erro ao resetar banco:", error);
  }
}

resetDatabase();