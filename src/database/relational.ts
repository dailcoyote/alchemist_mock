import { IRelationalStorageRepository, IRelationalStorageConnector } from "../interfaces/istorage";

class StandardSQLRepository
    implements IRelationalStorageRepository<IRelationalStorageConnector>
{
    storageConnector: IRelationalStorageConnector;

    constructor() {}

    async rawSQLQuery(customSQL: string) {
        return this.storageConnector.executeSQL(customSQL);
    }
}

export default StandardSQLRepository;

