import { ECredentialType, ECredentialDbDriver } from "./enums";

export interface ICredentialSqlConnection {
    hostname: string;
    port: string;
    database: string;
    dbUsername: string;
    dbPassword: string;
}

export interface ICredential {
    id?: string;
    userId: string;
    type: ECredentialType;
    name: string;
    data: any;
    dbConfig: {
        connection: ICredentialSqlConnection,
        dbDriver: ECredentialDbDriver
    };
    createdAt?: Date;
}
