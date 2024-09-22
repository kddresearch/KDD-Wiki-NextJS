interface ISecretStore {
    getAllSecretValue(key: string): Promise<string>;
    checkAccess(): Promise<boolean>;
}

export type { ISecretStore as IKeystore };
