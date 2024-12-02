import { describe, test, expect, beforeAll, afterAll } from "@jest/globals"
import { IStorageConnectionConfig, ConnectorMemHash } from "../src/types/iconfig";
import PostgreStorageConnectorInstance from "../src/adapter/PostgreStorageConnector";
import StandardSQLRepository from "../src/database/relational";
import { md5 } from "../src/helpers/cybersecurity";
import fs from "fs";

/* 
    This module was created to work with multiple database servers [MSSQL; Postgre; Oracle; MySQL]
*/

// We store various SQL-connectors in the Memory Cache
const pgConnectorMemoryCache = new Map<ConnectorMemHash, PostgreStorageConnectorInstance>();
const certFile = __dirname + '/cert/ca.pem';
const pgConfig: Partial<IStorageConnectionConfig> = {
    host: 'pg-12de625e-yergaliyev-4c4f.i.aivencloud.com',
    user: 'ADMIN',
    password: 'SOME_HPASS',
    database: 'alchemist',
    port: 17008,
    ssl: {
        rejectUnauthorized: false,
        ca: fs.readFileSync(certFile).toString()
    }
}
let pgSQLRepository:StandardSQLRepository;
let memCHash: string;

describe('Postgres:aviencloud setup', () => {
    pgSQLRepository = new StandardSQLRepository();

    beforeAll(() => {
        memCHash = md5(Buffer.from(JSON.stringify(pgConfig)));
        console.log("setup:Postgres [store mounting]");

        // Adapter Installation
        if (!pgConnectorMemoryCache.has(memCHash)) {
            const pgAivenStorageConnector = new PostgreStorageConnectorInstance();
            pgAivenStorageConnector.openStreamConnection(pgConfig);
            pgConnectorMemoryCache.set(memCHash, pgAivenStorageConnector);
        }
        pgSQLRepository.storageConnector = pgConnectorMemoryCache.get(memCHash);
    });

    test('[Postgres] (𝑓) VERSION: should return version info', async () => {
        const data = await pgSQLRepository.rawSQLQuery('SELECT VERSION()');
        const cursor = data?.rows[0];
        expect(typeof cursor).toBe('object');
        expect(typeof cursor.version).toBe('string');
        console.log(`setup:Postgres [VERSION INFO > ${JSON.stringify(cursor.version)}]`);
    });
});

describe('Postgres:aviencloud food:schema', () => {
    pgSQLRepository = new StandardSQLRepository();

    beforeAll(async () => {
        memCHash = md5(Buffer.from(JSON.stringify(pgConfig)));
        pgSQLRepository.storageConnector = pgConnectorMemoryCache.get(memCHash);
    })

    test('[Postgres] (𝑓) FOOD.INGREDIENTS: should return array of rows', async () => {
        const data = await pgSQLRepository.rawSQLQuery(
            'SELECT ing_id, ingredient_name FROM food.ingredients;'
        );
        expect(Array.isArray(data?.rows)).toBe(true);
        expect(typeof data?.rows[0]).toBe('object');
        console.log(`fetch:Postgres [food.ingredients > ${JSON.stringify(data?.rows)}]`);
    });

    afterAll(async () => {
        await pgConnectorMemoryCache.get(memCHash).disconnect();
        pgConnectorMemoryCache.delete(memCHash);
    });
});