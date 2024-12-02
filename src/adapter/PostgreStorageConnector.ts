import { Pool, Client } from 'pg'       // npm --save pg
import { IRelationalStorageConnector } from "../interfaces/istorage";
import { IStorageConnectionConfig } from "../types/iconfig";
import { EStorageConnectorStatus } from "../interfaces/enums";
import { PGStorageError } from "../errors/StorageError";

class PostgreStorageConnector implements IRelationalStorageConnector {
    private _pgChannelPool: Pool;
    private _status: EStorageConnectorStatus = EStorageConnectorStatus.OFF;

    get status() {
        return this._status;
    }

    openStreamConnection(pgConfig: Partial<IStorageConnectionConfig>) {
        this._pgChannelPool = new Pool(pgConfig);
        this._status = EStorageConnectorStatus.ON;

        /*      CHANNEL POOL EVENTS     */
        this._pgChannelPool.on('connect', () => {
            console.log(
                '[PgStorageConnector]: A new channel to the Postgres database has been opened.'
            );
        });
        this._pgChannelPool.on('release', (err: Error) => {
            console.log(
                `[PgStorageConnector]: ${err ? err : 'Channel is released back into the pool'}`
            );
        });
        this._pgChannelPool.on('error', (err: Error) => {
            console.error('[PgStorageConnector]: Unexpected error on idle connection', err);
        });

        return this;
    }

    async disconnect() {
        if (this._pgChannelPool && this._status == EStorageConnectorStatus.ON) {
            await this._pgChannelPool.end();
            this._pgChannelPool = null;
            this._status = EStorageConnectorStatus.OFF;
            console.log('[PgStorageConnector]: Channel pool destroyed');
        }
    }

    async executeSQL(customSQL: string, parameters?: Array<string>) {
        let channel: Client;
        if (!this._pgChannelPool) {
            throw new PGStorageError(
                "No channel pool. Unable to execute SQL-command on server",
                "XX000"
            );
        }
        try {
            channel = await this._pgChannelPool.connect();
            const result = await channel
                .query(customSQL, parameters && parameters);
            return result;
        } catch (error) {
            let msg: string;
            let code: string;

            console.error('[PgStorageConnector]: error executing sql to remote server', error);

            code = error.code || 'XX000';
            msg = error.message || 'Unexpected error on executing SQL-query';

            throw new PGStorageError(msg, code);;
        } finally {
            if (channel instanceof Client) {
                channel.release();
            }
        }
    }
}

export default PostgreStorageConnector;