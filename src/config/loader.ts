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

        if (typeof window === 'undefined') {
            return;
        }

        const credential = new DefaultAzureCredential();
        const url = `https://${keyVaultName}.vault.azure.net`;
        this.secretClient = new SecretClient(url, credential);
    }

    async loadConfig(): Promise<Partial<ConfigStructure>> {
        await this.loadFromEnv();
        if (this.secretClient) {
            if (await this.checkAccess()!) {
                console.error("Access to configuration denied (Did you login? run `az login`)");
                return this.config;
            }
            await this.loadFromKeyVault();
        }

        return this.config;
    }

    private async loadFromKeyVault() {
        // only runs if secretClient is not null!
        for await (const secretProperties of this.secretClient!.listPropertiesOfSecrets()) {
            const secretName = secretProperties.name!;
            const secret = await this.secretClient!.getSecret(secretName);
            this.setConfigValue(secretName.toLocaleLowerCase(), secret.value! as string)
        }
    }

    private setConfigValue(key: string, value: string) {
        // Set the config value, handling nested properties
        const parts = key.split('_'); // the _ acts as the . in the namespace
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
            port: Number(process.env.PORT) || 3000,
            isdevelopment: process.env.NODE_ENV !== 'production',
            keystore_active: process.env.KEYSTORE_ACTIVE === 'true',
            auth: {
                secret: process.env.AUTH_SECRET,
                google: {
                    client_id: process.env.AUTH_GOOGLE_CLIENT_ID,
                    project_id: 'canvascaboose',
                    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
                    token_uri: 'https://oauth2.googleapis.com/token',
                    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
                    client_secret: process.env.AUTH_GOOGLE_CLIENT_SECRET,
                },
                ksu: {
                    client_id: process.env.AUTH_KSU_CLIENT_ID,
                    client_secret: process.env.AUTH_KSU_CLIENT_SECRET,
                    issuer: 'https://signin.k-state.edu/WebISO/oidc',
                    well_known: 'https://signin.k-state.edu/WebISO/oidc/.well-known',
                },
            },
            db: {
                name: process.env.DB_NAME,
                host: process.env.DB_HOST,
                port: process.env.DB_PORT,
                username: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
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
            blob_storage: {
                account_name: process.env.BLOB_STORAGE_ACCOUNT_NAME,
                account_key: process.env.BLOB_STORAGE_ACCOUNT_KEY,
                container_name: process.env.BLOB_STORAGE_CONTAINER_NAME,
                development_url: process.env.BLOB_STORAGE_DEVELOPMENT_URL,
            },
            github_actions: process.env.GITHUB_ACTIONS === 'true',
            github: {
                owner: 'kddresearch',
                repo: 'KDD-Wiki-NextJS',
                maintainers: [
                    'Legonois',
                ],
            },
        }
    }

    async checkAccess() {
        try {
            const secret = await this.secretClient!.getSecret("vault-enabled");
            if (secret.value === "true") {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            // console.error("Access to configuration denied (Did you login? run `az login`)");
            return false;
        }
    }
}

export default ConfigLoader;