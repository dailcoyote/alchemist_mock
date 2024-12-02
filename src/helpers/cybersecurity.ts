import crypto from "crypto";

export function md5(content: Buffer | string) {  
    return crypto.createHash('md5').update(content).digest('hex')
}