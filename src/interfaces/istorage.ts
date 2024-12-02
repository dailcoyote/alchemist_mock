import { IStorageConnectionConfig } from "../types/iconfig";

export interface IRelationalStorageConnector {
    openStreamConnection(config: Partial<IStorageConnectionConfig>): Promise<boolean> | IRelationalStorageConnector | void | any
    disconnect(): any
    executeSQL(customSQL: string, parameters?: Array<string>): Promise<Object | Array<Object> | Array<any> | any>
}

export interface IRelationalStorageRepository<SC extends IRelationalStorageConnector> {
    storageConnector: SC
    rawSQLQuery(customSQL: string): Promise<Object | Array<Object> | any>
    /*
        CUSTOM FUNCTIONS: 
        (𝑓) selectBy, 
        (𝑓) insertByWithValues, 
        (𝑓) updateBy, 
        (𝑓) deleteBy 
        etc...
    */
}