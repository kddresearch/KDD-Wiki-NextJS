interface ISecretStore {
    getSecretValue(key: string): Promise<string>;
    checkAccess(): Promise<boolean>;
}

export type { ISecretStore };
