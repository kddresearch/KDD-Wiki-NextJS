import 'server-only'

import ConfigStructure from './interface';
import { ISecretStore } from '@/interfaces/secret-store';
import { AzureSecretStore } from '@/keystore/azure-secret-store';
import { AWSSecretStore } from '@/keystore/aws-secret-store';

class ConfigLoader {
    private config?: ConfigStructure;
    private secretClient?: ISecretStore;

    constructor() {
        const provider = process.env.WIKI_SECRETSTORE_PROVIDER;

        if (!provider) {
            this.secretClient = undefined;
            console.log("No secret store provider found");
        } else if (provider === 'azure') {
            this.secretClient = new AzureSecretStore();
            console.log("Azure key vault loaded");
        } else if (provider === 'aws') {
            this.secretClient = new AWSSecretStore();
            console.log("AWS secret manager loaded");
        } else {
            throw new Error(`Invalid secret store provider ${provider}`);
        }

        this.loadConfig();

        console.log("Config Loaded");
    }

    async loadConfig(): Promise<ConfigStructure> {
        let config = await this.loadFromEnv();

        if (!this.secretClient) {
            return this.config;
        }

        config = await this.loadFromSecretStore();
        return config;
    }

    private async loadFromSecretStore() {
        const secretClient = this.secretClient!;

        const access = await secretClient.checkAccess();
        if (!access) {
            throw new Error(`Access to ${secretClient.provider} denied. Please check your credentials and try again.`);
        }

        const secretKeys = Object.keys(this.config).filter((key) => key !== 'Keystore');

        for (const key of secretKeys) {
            try {
                const secret = await secretClient.getSecretValue(key);
                this.setConfigValue(key, secret);
            } catch (error) {
                console.error(`Error loading secret ${key} from ${secretClient.provider}`, error);
            }
        }
    }

    private setConfigValue(key: string, value: string) {
        // Set the config value, handling nested properties
        const parts = key.split('-'); // the _ acts as the . in the namespace
        let current: any = this.config;
        for (let i = 0; i < parts.length - 1; i++) {
            if (!(parts[i] in current)) {
                current[parts[i]] = {};
            }
            current = current[parts[i]];
        }
        current[parts[parts.length - 1]] = value;
    }

    private async loadFromEnv(): Promise<ConfigStructure> {
        const secretStoreProvider = process.env.WIKI_SECRETSTORE_PROVIDER?.toLocaleLowerCase();
        let secretStore;
        if (!secretStoreProvider) {
            secretStore = undefined;
        } else if (secretStoreProvider === 'azure') {
            secretStore = {
                Provider: process.env.WIKI_SECRETSTORE_PROVIDER,
                Azure: {
                    KeyVaultName: process.env.WIKI_SECRETSTORE_AZURE_VAULT_NAME,
                    TenantId: process.env.WIKI_SECRETSTORE_AZURE_TENANT_ID,
                    ClientId: process.env.WIKI_SECRETSTORE_AZURE_CLIENT_ID,
                    ClientSecret: process.env.WIKI_SECRETSTORE_AZURE_CLIENT_SECRET,
                    Url: process.env.WIKI_SECRETSTORE_AZURE_URL,
                }
            }
        } else if (secretStoreProvider === 'aws') {
            secretStore = {
                Provider: process.env.WIKI_SECRETSTORE_PROVIDER,
                AWS: {
                    Region: process.env.WIKI_SECRETSTORE_AWS_REGION,
                    AccessKeyId: process.env.WIKI_SECRETSTORE_AWS_ACCESS_KEY_ID,
                    SecretAccessKey: process.env.WIKI_SECRETSTORE_AWS_SECRET_ACCESS_KEY,
                    Endpoint: process.env.WIKI_SECRETSTORE_AWS_ENDPOINT,
                }
            }
        } else {
            throw new Error(`Invalid secret store provider ${secretStoreProvider}`);
        }

        const authProvider = process.env.WIKI_AUTH_PROVIDER?.toLocaleLowerCase();
        let auth;
        if (!authProvider) {
            auth = undefined;
        } else if (authProvider === 'oauth2') {
            console.log('Using OAuth2 Auth');
            
            auth = {
                Secret: process.env.WIKI_AUTH_SECRET,
                Provider: process.env.WIKI_AUTH_PROVIDER,
                Oauth2: {
                    ClientId: process.env.WIKI_AUTH_OAUTH2_CLIENT_ID,
                    ClientSecret: process.env.WIKI_AUTH_OAUTH2_CLIENT_SECRET,
                    AuthorizationUri: process.env.WIKI_AUTH_OAUTH2_AUTHORIZATION_URI,
                    TokenUri: process.env.WIKI_AUTH_OAUTH2_TOKEN_URI,
                    UserInfoUri: process.env.WIKI_AUTH_OAUTH2_USER_INFO_URI,
                    Scope: process.env.WIKI_AUTH_OAUTH2_SCOPE,
                }
            }
        } else if (authProvider === 'oidc') {
            console.log('Using OIDC Auth');

            auth = {
                Secret: process.env.WIKI_AUTH_SECRET,
                Provider: process.env.WIKI_AUTH_PROVIDER,
                OIDC: {
                    ClientId: process.env.WIKI_AUTH_OIDC_CLIENT_ID,
                    ClientSecret: process.env.AUTH_KSU_CLIENT_SECRET,
                    Issuer: process.env.WIKI_AUTH_OIDC_ISSUER,
                    WellKnown: process.env.WIKI_AUTH_OIDC_WELL_KNOWN
                }
            }
        } else {
            throw new Error(`Invalid Auth provider ${authProvider}`);
        }

        const dbProvider = process.env.DB_PROVIDER?.toLocaleLowerCase();
        if (!dbProvider) {
            throw new Error('DB provider not found. Please provide DB_PROVIDER');
        } else if (dbProvider === 'postgres') {
            console.log('Using Postgres DB');
        } else {
            throw new Error(`Invalid DB provider ${dbProvider}`);
        }

        // Must be locally configured
        const port = Number(process.env.PORT) || 3000; // Defualt port 3000
        const isdevelopment = process.env.NODE_ENV !== 'production'; // Default to development

        const config = {
        }

        return config
    }

    async checkAccess() {
        try {
            const secret = await this.secretClient!.getSecret("vault-enabled");
            if (secret.value === "true") {
                return true;
            }
            return false;
        } catch (error) {
            console.error("Unexpected Error Occurred with Access to Configuration (Did you login? run `az login`)", error);
            return false;
        }
    }
}

export default ConfigLoader;