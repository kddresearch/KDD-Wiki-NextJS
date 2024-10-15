import 'server-only'

import {
    ConfigStructure,
    ConfigStructureSchema
} from './schema';
import { ISecretStore } from '@/interfaces/secret-store';
import { AzureSecretStore } from '@/keystore/azure-secret-store';
import { AWSSecretStore } from '@/keystore/aws-secret-store';
import { extractSchemaPaths } from '@/utils/zod';
import { SecretStore, SecretStoreSchema } from './schema';

const prefix = "WIKI_";

function pathToEnvVar(path: string[]): string {
    return (
        prefix +
        path
            .map(segment => {
                return segment.toUpperCase();
            })
            .join("_")
    );
}

class ConfigLoader {
    private secretClient?: ISecretStore;
    private unverifiedConfig?: any = {};

    constructor() {
        this.secretClient = ConfigLoader.loadSecretStore();
    }

    static setConfigValue(path: string[], value: string, config: any) {
        // Set the config value, handling nested properties
        let current: any = config;

        if (config === undefined || config === null) {
            config = {};
        }

        console.log('Setting config value', path, value);

        for (let i = 0; i < path.length - 1; i++) {
            const key = path[i];
            if (!(key in current)) {
                current[key] = {};
            }
            current = current[key];
        }
        current[path[path.length - 1]] = value;
    }

    static loadSecretStore(): ISecretStore | undefined {
        const allSchemaPaths = extractSchemaPaths(SecretStoreSchema);
        let secretClient: ISecretStore | undefined;
        let secretStoreUnverifiedConfig: any;
        let secretStoreConfig: SecretStore;

        for (const path of allSchemaPaths) {
            const envVar = pathToEnvVar(path);
            const value = process.env[envVar];

            if (value !== undefined) {
                ConfigLoader.setConfigValue(path, value, secretStoreUnverifiedConfig);

                const output = SecretStoreSchema.safeParse(secretStoreUnverifiedConfig);

                if (!output.success) {
                    throw new Error("Invalid secret store configuration");
                }

                secretStoreConfig = output.data;

                if (!secretStoreConfig?.Provider) {
                    return undefined;
                } else if (secretStoreConfig.Provider === 'azure') {
                    secretClient = new AzureSecretStore();
                } else if (secretStoreConfig.Provider === 'aws') {
                    secretClient = new AWSSecretStore();
                }
            }
        }

        return secretClient;
    }

    async loadConfig(): Promise<ConfigStructure> {
        await this.loadFromEnv();

        if (this.secretClient) {
            await this.loadFromSecretStore();
        }
        
        // Validate the config using Zod schema
        const parsedConfig = ConfigStructureSchema.safeParse(this.unverifiedConfig);

        if (!parsedConfig.success) {
            console.error("Configuration validation failed:", parsedConfig.error);
            throw new Error("Invalid configuration");
        }

        console.log("Configuration loaded successfully");

        return parsedConfig.data;
    }

    private setUnverifiedConfigValue(path: string[], value: string) {
        let current: any = this.unverifiedConfig;
        ConfigLoader.setConfigValue(path, value, current);
    }

    private async loadFromEnv() {
        const allSchemaPaths = extractSchemaPaths(ConfigStructureSchema);

        for (const path of allSchemaPaths) {
            const envVar = pathToEnvVar(path);
            const value = process.env[envVar];

            if (value !== undefined) {
                this.setUnverifiedConfigValue(path, value);
            }
        }
    }

    private async loadFromSecretStore(): Promise<ConfigStructure> {
        const allSchemaPaths = extractSchemaPaths(ConfigStructureSchema);        
        const secretClient = this.secretClient!;

        for (const path of allSchemaPaths) {
            const envVar = pathToEnvVar(path);
            const value = process.env[envVar];

            if (value !== undefined) {
                this.setUnverifiedConfigValue(path, value);
            }
        }

        const access = await secretClient.checkAccess();
        if (!access) {
            throw new Error(`Access to ${secretClient.provider} denied. Please check your credentials and try again.`);
        }

        const config = ConfigStructureSchema.safeParse({
            SecretClient: secretClient.config,
        });

        if (!config.success) {
            throw new Error('Invalid Configuration');
        }

        return config.data;
    }
}

export default ConfigLoader;