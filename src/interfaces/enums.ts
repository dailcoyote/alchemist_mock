/*  Storage Connector Status */
export enum EStorageConnectorStatus {
    ON = 0x01,
    OFF = 0x00
}

export enum ECredentialType {
    urlToken = "urlToken", // Like Telegram
    bearerAccessToken = "bearerAccessToken",
    apiKey = "apiKey",
    basicAuth = "basicAuth",
    oAuth2 = "oAuth2",
}

/* Database Driver */
export enum ECredentialDbDriver {
    postgres = "postgres",
    mssql = "mssql",
}

// export enum EPostgreStorageErrorCodes {
//     "08000" = "connection_exception",
//     "08003" = "connection_does_not_exist",
//     "28000" = "invalid_authorization_specification",
//     "28P01" = "invalid_password",
//     "XX000" = "INTERNAL ERROR"
// }