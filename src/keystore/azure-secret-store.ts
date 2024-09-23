import { ISecretStore } from '@/interfaces/secret-store';
import { getDefaultAzureCredentials } from '@/utils/credentials';
import { ClientSecretCredential, TokenCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';

class AzureSecretStore implements ISecretStore {
    private secretClient: SecretClient;
    public provider: string;

    constructor() {
        const vaultName = process.env.WIKI_SECRETSTORE_AZURE_VAULT_NAME;

        if (!vaultName) {
            throw new Error('Azure key vault name not found. Please provide WIKI_SECRETSTORE_AZURE_VAULT_NAME');
        }

        const tenantId = process.env.WIKI_SECRETSTORE_AZURE_TENANT_ID;
        const clientId = process.env.WIKI_SECRETSTORE_AZURE_CLIENT_ID;
        const clientSecret = process.env.WIKI_SECRETSTORE_AZURE_CLIENT_SECRET;
        let url = process.env.WIKI_SECRETSTORE_AZURE_URL;

        let credential: TokenCredential;

        if (tenantId && clientId && clientSecret) {
            console.log('Azure key vault credentials found');
            credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
            console.log('Azure key vault credentials loaded');
        } else {
            console.log('Azure key vault credentials not found. Using default credentials...');
            credential = getDefaultAzureCredentials();
            console.log('Azure key vault credentials loaded');
        }

        if (url) {
            console.log(`Using custom Azure Key Vault URL: ${url}`);
        } else {
            url = `https://${vaultName}.vault.azure.net`;
        }

        this.secretClient = new SecretClient(url, credential);
        this.provider = 'azure';
    }

    public async getSecretValue(key: string): Promise<string> {
        const secret = await this.secretClient.getSecret(key);

        if (!secret.value) {
            throw new Error(`Secret ${key} not found`);
        }

        return secret.value;
    }

    public async checkAccess(): Promise<boolean> {
        try {
            await this.secretClient.getSecret('verifying-wiki-connection');
            return true;
        } catch (error) {
            return false;
        }
    }
}

export { AzureSecretStore };