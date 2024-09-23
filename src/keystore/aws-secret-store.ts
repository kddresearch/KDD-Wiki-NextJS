import { ISecretStore } from '@/interfaces/secret-store';
import { getDefaultAWSCredentials } from '@/utils/credentials';
import * as AWS from 'aws-sdk';

export class AWSSecretStore implements ISecretStore {
    private readonly client: AWS.SecretsManager;

    constructor() {
        const region = process.env.WIKI_SECRETSTORE_AWS_REGION;

        if (!region) {
            throw new Error('AWS region not found. Please provide WIKI_SECRETSTORE_AWS_REGION');
        }

        const accessKeyId = process.env.WIKI_SECRETSTORE_AWS_ACCESS_KEY_ID;
        const secretAccessKey = process.env.WIKI_SECRETSTORE_AWS_SECRET_ACCESS_KEY;
        let endpoint = process.env.WIKI_SECRETSTORE_AWS_ENDPOINT;

        let credential: AWS.Credentials;

        if (accessKeyId && secretAccessKey) {
            console.log('AWS secret manager credentials found');
            credential = new AWS.Credentials({
                accessKeyId: accessKeyId,
                secretAccessKey: secretAccessKey
            });
            console.log('AWS secret manager credentials loaded');
        } else {
            console.log('AWS secret manager credentials not found. Using default credentials...');
            credential = getDefaultAWSCredentials();
            console.log('AWS secret manager credentials loaded');
        }

        const secretManagerConfig: AWS.SecretsManager.Types.ClientConfiguration = {
            region: region,
            credentials: credential
        };

        if (endpoint) {
            secretManagerConfig.endpoint = endpoint;
            console.log(`Using custom AWS Secrets Manager endpoint: ${endpoint}`);
        }

        this.client = new AWS.SecretsManager(secretManagerConfig);
    }

    public async getSecretValue(key: string): Promise<string> {
        const secret = await this.client.getSecretValue({ SecretId: key }).promise();

        if (!secret.SecretString) {
            throw new Error(`Secret ${key} not found`);
        }

        return secret.SecretString;
    }

    public async checkAccess(): Promise<boolean> {
        try {
            await this.client.getSecretValue({ SecretId: 'verifying-wiki-connection' }).promise();
            return true;
        } catch (error) {
            return false;
        }
    }
}