import { IKeystore } from '@/interfaces/secret-store';
import * as AWS from 'aws-sdk';

export class AWSKeystore implements IKeystore {
    private readonly client: AWS.SecretsManager;

    constructor() {
        this.client = new AWS.SecretsManager();
    }

    public async getAllSecretValue(key: string): Promise<string> {
        const secret = await this.client.getSecretValue({ SecretId: key }).promise();
        return secret.SecretString as string;
    }

    public async checkAccess(): Promise<boolean> {
        try {
            await this.client.listSecrets().promise();
            return true;
        } catch (error) {
            return false;
        }
    }
}