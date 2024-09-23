import { SecretStore } from "@/config/schema";

interface ISecretStore {
    provider: string;
    getSecretValue(key: string): Promise<string>;
    checkAccess(): Promise<boolean>;
    get config(): SecretStore;
}

export type { ISecretStore };
