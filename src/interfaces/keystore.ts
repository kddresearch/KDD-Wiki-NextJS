export interface IKeystore {
    encrypt(data: string): Promise<string>;
    decrypt(data: string): Promise<string>;
}
