import { Connection } from "../data/Data-Source";
import { QueryRunner } from "typeorm";

export class StatusMysql {
    static async getStatus() {
        try {
            const queryRunner: QueryRunner = Connection.createQueryRunner();
            await queryRunner.connect();

            const connections = await queryRunner.query(
                `SHOW STATUS LIKE 'Threads_connected'`
            );

            const qpsQueries = await queryRunner.query(
                `SHOW GLOBAL STATUS LIKE 'Questions'`
            );

            const uptime = await queryRunner.query(
                `SHOW GLOBAL STATUS LIKE 'Uptime'`
            );

            const connectionsActive = Number(connections[0]?.Value ?? 0);
            const totalQuestions = Number(qpsQueries?.[0]?.Value ?? 0);
            const totalUptime = Number(uptime?.[0]?.Value ?? 1);

            const queriesPerSecond = Math.round(totalQuestions / totalUptime);

            await queryRunner.release();

            return {
                status: 'Online',
                connections_active: connectionsActive,
                queries_per_second: queriesPerSecond,
                uptime_seconds: totalUptime
            };
        } catch (err) {
            console.error('Erro ao verificar status do DB: ', err)

            return {
                status: 'Offiline',
                connections_active: 0,
                queries_per_second: 0,
                uptime_seconds: 0
            };
        }
    }
}