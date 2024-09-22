import 'server-only'

import { DefaultAzureCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';
import ConfigStructure from './interface';

class ConfigLoader {
    private config: Partial<ConfigStructure> = {};
    private secretClient: SecretClient | null = null;

    constructor(private keyVaultName?: String) {
        if (keyVaultName === undefined) {
            return;
        }

        const credential = new DefaultAzureCredential();
        const url = `https://${keyVaultName}.vault.azure.net`;
        this.secretClient = new SecretClient(url, credential);
    }

    async loadConfig(): Promise<Partial<ConfigStructure>> {
        await this.loadFromEnv();

        if (!this.secretClient) {
            return this.config;
        }

        if (await this.checkAccess() === false) {
            console.error("Access to configuration denied (Did you login? run `az login`)");
            return this.config;
        }

        if (this.config.Keystore?.Provider !== undefined) {
            console.log("Keystore is active, skipping keyvault load")
            return this.config;
        }

        await this.loadFromKeystore();
        return this.config;
    }

    private async loadFromKeystore() {

        const start = Date.now();

        const secretPromises = [];
        const secretTimes: any[] = [];

        for await (const secretProperties of this.secretClient!.listPropertiesOfSecrets()) {            
            const secretName = secretProperties.name!;
            const secretStart = Date.now();

            secretPromises.push(this.secretClient!.getSecret(secretName).then(secret => {

                const secretEnd = Date.now();
                const timeTaken = secretEnd - secretStart;

                secretTimes.push({ secretName, timeTaken });

                this.setConfigValue(secretName, secret.value! as string);
            }));
        }

        await Promise.all(secretPromises);

        console.log("Required reload of secrets");
        console.log("Time to load secrets:", Date.now() - start, "ms");
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

    private async loadFromEnv() {
        this.config = {
            port: Number(process.env.PORT) || 3000, // Defualt port 3000
            isdevelopment: process.env.NODE_ENV !== 'production', // Default to development
            Keystore: {
                Provider: process.env.KEYSTORE_PROVIDER,
            },
            Auth: {
                Secret: process.env.AUTH_SECRET,
                Google: {
                    ClientId: process.env.AUTH_GOOGLE_CLIENT_ID,
                    ProjectId: 'canvascaboose',
                    AuthUri: 'https://accounts.google.com/o/oauth2/auth',
                    TokenUri: 'https://oauth2.googleapis.com/token',
                    AuthProviderX509CertUrl: 'https://www.googleapis.com/oauth2/v1/certs',
                    ClientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET,
                },
                Ksu: {
                    ClientId: process.env.AUTH_KSU_CLIENT_ID,
                    ClientSecret: process.env.AUTH_KSU_CLIENT_SECRET,
                    Issuer: 'https://signin.k-state.edu/WebISO/oidc',
                    WellKnown: 'https://signin.k-state.edu/WebISO/oidc/.well-known',
                },
            },
            Db: {
                Name: process.env.DB_NAME,
                Host: process.env.DB_HOST,
                Port: process.env.DB_PORT,
                Username: process.env.DB_USERNAME,
                Password: process.env.DB_PASSWORD,
            },
            dev_user: {
                username: 'wnbaldwin',
                id: 109,
                member: true,
                admin: true,
                readonly: false,
                date_created: '2016-04-20T15:00:00.000Z',
                date_modified: '2016-04-20T15:00:00.000Z',
                is_kdd_only: false,
            },
            BlobStorage: {
                AccountName: process.env.BLOB_STORAGE_ACCOUNT_NAME,
                AccountKey: process.env.BLOB_STORAGE_ACCOUNT_KEY,
                ContainerName: process.env.BLOB_STORAGE_CONTAINER_NAME,
                DevelopmentUrl: process.env.BLOB_STORAGE_DEVELOPMENT_URL,
            },
            github_actions: process.env.GITHUB_ACTIONS === 'true',
            public: {
                github: {
                    owner: 'kddresearch',
                    repo: 'KDD-Wiki-NextJS',
                    maintainers: [
                        'Legonois',
                    ],
                },
            },
        }
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