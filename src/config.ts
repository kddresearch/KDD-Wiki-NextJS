// import { DefaultAzureCredential, ManagedIdentityCredential } from '@azure/identity';
// import { SecretClient } from '@azure/keyvault-secrets';
// // import jwt_decode from "jwt-decode";

// let client: SecretClient;

// async function initClient() {

//     // Check this isn't running on the client side
//     if (typeof window !== 'undefined') {
//         return;
//     }

//     const vaultName = process.env.AZURE_KEY_VAULT_NAME;
//     const KVUri = `https://${vaultName}.vault.azure.net`;

//     const credential = new DefaultAzureCredential();
//     client = new SecretClient(KVUri, credential);
// }

// async function getSecret(secretName: string) {
//     try {

//         if (!client) {
//             return null;
//         }

//         const secret = await client.getSecret(secretName);
//         return secret.value;
//     } catch (error) {
//         // console.error(error);
//         return null;
//     }
// }

// async function checkAccess() {
//     try {
//         const secret = await client.getSecret("vault-enabled");
//         if (secret.value === "true") {
//             return true;
//         } else {
//             return false;
//         }
//     } catch (error) {
//         // console.error("Access to configuration denied (Did you login? run `az login`)");
//         return false;
//     }
// }

// const config = {
//     port: process.env.PORT || 3000,
//     isdevelopment: process.env.NODE_ENV !== 'production',
//     keystore_active: process.env.KEYSTORE_ACTIVE === 'true',
//     auth: {
//         secret: process.env.AUTH_SECRET,
//         google: {
//             client_id: process.env.AUTH_GOOGLE_CLIENT_ID,
//             project_id: "canvascaboose",
//             auth_uri: "https://accounts.google.com/o/oauth2/auth",
//             token_uri: "https://oauth2.googleapis.com/token",
//             auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
//             client_secret: process.env.AUTH_GOOGLE_CLIENT_SECRET,
//         },
//         ksu: {
//             client_id: process.env.AUTH_KSU_CLIENT_ID,
//             client_secret: process.env.AUTH_KSU_CLIENT_SECRET,
//             issuer: "https://signin.k-state.edu/WebISO/oidc",
//             well_known: "https://signin.k-state.edu/WebISO/oidc/.well-known"
//         }
//     },
//     db: {
//         name: process.env.DB_NAME,
//         host: process.env.DB_HOST,
//         port: process.env.DB_PORT,
//         username: process.env.DB_USERNAME,
//         password: process.env.DB_PASSWORD,
//     },
//     dev_user: {
//         username: "wnbaldwin",
//         id: 109,
//         member: true,
//         admin: true,
//         readonly: false,
//         date_created: "2016-04-20T15:00:00.000Z",
//         date_modified: "2016-04-20T15:00:00.000Z",
//         is_kdd_only: false
//     },
//     github_actions: process.env.GITHUB_ACTIONS === 'true',
//     github: {
//         owner: "kddresearch",
//         repo: "KDD-Wiki-NextJS",
//         maintainers: [
//             "Legonois"
//         ],
//     },
//     blob_storage: {
//         account_name: process.env.BLOB_STORAGE_ACCOUNT_NAME!,
//         account_key: process.env.BLOB_STORAGE_ACCOUNT_KEY!,
//         container_name: process.env.BLOB_STORAGE_CONTAINER_NAME!,
//         development_url: process.env.BLOB_STORAGE_DEVELOPMENT_URL!, // Local development URL, if needed
//     },
// }

// type ConfigType = typeof config;

// const configProxy = new Proxy(config, {
//     get(target, prop, receiver) {
//         if (prop in target) {

//             console.log(`Accessing ${String(prop)} configuration`);
//             const value = Reflect.get(target, prop, receiver);
//             if (value && typeof value === 'object') {
//                 return new Proxy(value, this);
//             }
//             return value;
//         } else {
//             // Should never run on the client side
//             initClient();
//             (async () => {
//                 const result = await checkAccess();
//                 if (result === false) {
//                     console.error("Access to configuration denied (Did you login? run `az login`)");
//                 }
//             })();
//             // Fallback to Azure Key Vault
//             console.log(`Accessing ${String(prop)} configuration from Azure Key Vault`);
//             const secret = getSecret(String(prop));
//             return secret;
//         }
//         throw new Error(`Configuration property ${String(prop)} not found`);
//     }
// }) as ConfigType;

// export default configProxy;

import { DefaultAzureCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';

// class Config {
//     private client: SecretClient | null = null;
//     public port: number;
//     public isdevelopment: boolean;
//     public keystore_active: boolean
//     public auth: any;
//     public db: any;
//     public dev_user: any;
//     public blob_storage: any;
//     public github_actions: boolean;
//     public github: any;

//     constructor() {
//         if (typeof window === 'undefined') {
//             const vaultName = process.env.AZURE_KEY_VAULT_NAME;
//             const KVUri = `https://${vaultName}.vault.azure.net`;
//             this.client = new SecretClient(KVUri, new DefaultAzureCredential());
//         }

//         this.port = Number(process.env.PORT) || 3000;
//         this.isdevelopment = process.env.NODE_ENV !== 'production';
//         this.keystore_active = process.env.KEYSTORE_ACTIVE === 'true',

//         this.auth = {
//             secret: this.getSecretOrEnvVar('AUTH_SECRET'),
//             google: {
//                 client_id: this.getSecretOrEnvVar('AUTH_GOOGLE_CLIENT_ID'),
//                 project_id: 'canvascaboose',
//                 auth_uri: 'https://accounts.google.com/o/oauth2/auth',
//                 token_uri: 'https://oauth2.googleapis.com/token',
//                 auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
//                 client_secret: this.getSecretOrEnvVar('AUTH_GOOGLE_CLIENT_SECRET'),
//             },
//             ksu: {
//                 client_id: this.getSecretOrEnvVar('AUTH_KSU_CLIENT_ID'),
//                 client_secret: this.getSecretOrEnvVar('AUTH_KSU_CLIENT_SECRET'),
//                 issuer: 'https://signin.k-state.edu/WebISO/oidc',
//                 well_known: 'https://signin.k-state.edu/WebISO/oidc/.well-known',
//             },
//         }
//         this.db = {
//             name: this.getSecretOrEnvVar('DB_NAME'),
//             host: this.getSecretOrEnvVar('DB_HOST'),
//             port: this.getSecretOrEnvVar('DB_PORT'),
//             username: this.getSecretOrEnvVar('DB_USERNAME'),
//             password: this.getSecretOrEnvVar('DB_PASSWORD'),
//         }
//         this.dev_user = {
//             username: 'wnbaldwin',
//             id: 109,
//             member: true,
//             admin: true,
//             readonly: false,
//             date_created: '2016-04-20T15:00:00.000Z',
//             date_modified: '2016-04-20T15:00:00.000Z',
//             is_kdd_only: false,
//         }
//         this.blob_storage = {
//             account_name: this.getSecretOrEnvVar('BLOB_STORAGE_ACCOUNT_NAME'),
//             account_key: this.getSecretOrEnvVar('BLOB_STORAGE_ACCOUNT_KEY'),
//             container_name: this.getSecretOrEnvVar('BLOB_STORAGE_CONTAINER_NAME'),
//             development_url: this.getSecretOrEnvVar('BLOB_STORAGE_DEVELOPMENT_URL'),
//         }
//         this.github_actions = process.env.GITHUB_ACTIONS === 'true';
//         this.github = {
//             owner: "kddresearch",
//             repo: "KDD-Wiki-NextJS",
//             maintainers: [
//                 "Legonois"
//             ],
//         };
//     }

//     async getSecretOrEnvVar(secretName: string): Promise<string> {
//         if (this.client) {
//             try {
//                 const secret = await this.client.getSecret(secretName);
//                 if (!secret.value) {
//                     console.error(`Secret not found in Key Vault: ${secretName}`);
//                     return '';
//                 }
//                 return secret.value;
//             } catch (error) {
//                 console.error(`Failed to get secret from Key Vault: ${error}`);
//             }
//         }
//         return process.env[secretName] || '';
//     }
// }

// const config = new Config();

// console.log(config.auth);

// export default config;

let client: SecretClient;

if (typeof window === 'undefined') {
    const vaultName = process.env.AZURE_KEY_VAULT_NAME;
    const KVUri = `https://${vaultName}.vault.azure.net`;
    client = new SecretClient(KVUri, new DefaultAzureCredential());
}

async function getSecretOrEnvVar(secretName: string): Promise<string> {
    if (client) {
        try {
            const secret = await client.getSecret(secretName);
            if (!secret.value) {
                console.error(`Secret not found in Key Vault: ${secretName}`);
                return '';
            }
            return secret.value;
        } catch (error) {
            console.error(`Failed to get secret from Key Vault: ${error}`);
        }
    }

    const property = process.env[secretName];

    if (!property) {
        console.error(`Environment variable not found: ${secretName}`);
        return '';
    }

    return property;
}

const config = {
    port: process.env.PORT || 3000,
    isdevelopment: process.env.NODE_ENV !== 'production',
    keystore_active: process.env.KEYSTORE_ACTIVE === 'true',
    auth: {
        secret: process.env.AUTH_SECRET,
        google: {
            client_id: process.env.AUTH_GOOGLE_CLIENT_ID,
            project_id: "canvascaboose",
            auth_uri: "https://accounts.google.com/o/oauth2/auth",
            token_uri: "https://oauth2.googleapis.com/token",
            auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
            client_secret: process.env.AUTH_GOOGLE_CLIENT_SECRET,
        },
        ksu: {
            client_id: getSecretOrEnvVar("AUTH_KSU_CLIENT_ID"),
            client_secret: getSecretOrEnvVar("AUTH_KSU_CLIENT_SECRET"),
            issuer: "https://signin.k-state.edu/WebISO/oidc",
            well_known: "https://signin.k-state.edu/WebISO/oidc/.well-known"
        }
    },
    db: {
        name: getSecretOrEnvVar('DB_NAME'),
        host: getSecretOrEnvVar('DB_HOST'),
        port: getSecretOrEnvVar('DB_PORT'),
        username: getSecretOrEnvVar('DB_USERNAME'),
        password: getSecretOrEnvVar('DB_PASSWORD'),
    },
    dev_user: {
        username: "wnbaldwin",
        id: 109,
        member: true,
        admin: true,
        readonly: false,
        date_created: "2016-04-20T15:00:00.000Z",
        date_modified: "2016-04-20T15:00:00.000Z",
        is_kdd_only: false
    },
    github_actions: process.env.GITHUB_ACTIONS === 'true',
    github: {
        owner: "kddresearch",
        repo: "KDD-Wiki-NextJS",
        maintainers: [
            "Legonois"
        ],
    },
    blob_storage: {
        account_name: process.env.BLOB_STORAGE_ACCOUNT_NAME!,
        account_key: process.env.BLOB_STORAGE_ACCOUNT_KEY!,
        container_name: process.env.BLOB_STORAGE_CONTAINER_NAME!,
        development_url: process.env.BLOB_STORAGE_DEVELOPMENT_URL!, // Local development URL, if needed
    },
}

export default config;