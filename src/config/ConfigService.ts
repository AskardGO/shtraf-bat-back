import * as dotenv from "dotenv";

dotenv.config();

export class ConfigService {
    private readonly envConfig: NodeJS.ProcessEnv;

    constructor() {
        this.envConfig = process.env;
    }

    private getValue(key: string, required = true): string {
        const value = this.envConfig[key];
        if (!value && required) {
            throw new Error(`❌ Config error - missing env.${key}`);
        }
        return value!;
    }

    getPort(): number {
        return parseInt(this.getValue("PORT", true), 10);
    }

    getJwtSecret(): string {
        return this.getValue("JWT_SECRET", true);
    }

    getMongoUri(): string {
        const user = this.getValue("MONGO_USER");
        const pass = this.getValue("MONGO_PASS");
        const cluster = this.getValue("MONGO_CLUSTER");
        const db = this.getValue("MONGO_DB");

        return `mongodb+srv://${user}:${pass}@${cluster}/${db}?retryWrites=true&w=majority&appName=Shtraf-bat`;
    }
}
