export type IStorageConnectionConfig = {
    host: string,
    user: string,
    password: string
    database: string,
    port: number | string,
    max: number,
    idleTimeoutMillis: number,
    ssl: {
        rejectUnauthorized: boolean,
        ca: string
    }
}

export type ConnectorMemHash = string;