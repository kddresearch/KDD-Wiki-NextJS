import { z } from "zod";

function stringToLowerCase(val: any): any {
    if (typeof val === "string") {
        return val.toLowerCase();
    }

    return val;
}

// -- Credential Schemas --

const AzureCredentialsSchema = z.object({
    TenantId: z.string(),
    ClientId: z.string(),
    ClientSecret: z.string(),
});

const AWSCredentialsSchema = z.object({
    AccessKeyId: z.string(),
    SecretAccessKey: z.string(),
});

// -- Secret Store Schemas --

const SecretStoreAzureSchema = z.object({
    KeyVaultName: z.string(),
    Url: z.string().url().optional(),
    Credentials: AzureCredentialsSchema.optional(),
});

const SecretStoreAWSSchema = z.object({
    Region: z.string(),
    Endpoint: z.string().url().optional(),
    Credentials: AWSCredentialsSchema.optional(),
});

const SecretStoreSchema = z.discriminatedUnion("Provider", [
    z.object({
        Provider: z.preprocess(
            stringToLowerCase,
            z.literal("azure")
        ),
        Azure: SecretStoreAzureSchema,
        AWS: SecretStoreAWSSchema.optional(),
    }),
    z.object({
        Provider: z.preprocess(
            stringToLowerCase,
            z.literal("aws")
        ),
        AWS: SecretStoreAWSSchema,
        Azure: SecretStoreAzureSchema.optional(),
    }),
]);

// -- Authenticaton Schemas --

const AuthOAuth2Schema = z.object({
    ClientId: z.string(),
    ClientSecret: z.string(),
    AuthorizationUri: z.string(),
    TokenUri: z.string(),
    UserInfoUri: z.string().optional(),
    Scope: z.string().optional(),
});

const AuthOIDCSchema = z.object({
    ClientId: z.string(),
    ClientSecret: z.string(),
    Issuer: z.string().url(),
    WellKnown: z.string().url().optional(),
});

const AuthSchema = z.discriminatedUnion("Provider", [
    z.object({
        Provider: z.preprocess(
            stringToLowerCase,
            z.literal("oauth2")
        ),
        Secret: z.string(),
        Oauth2: AuthOAuth2Schema,
        OIDC: AuthOIDCSchema.optional(),
    }),
    z.object({
        Provider: z.preprocess(
            stringToLowerCase,
            z.literal("oidc")
        ),
        Secret: z.string(),
        OIDC: AuthOIDCSchema,
        Oauth2: AuthOAuth2Schema.optional(),
    }),
]);

// -- Database Schemas --

const DbPostgresSchema = z.object({
    Name: z.string(),
    Host: z.string(),
    Port: z.coerce.number(),
    Username: z.string(),
    Password: z.string(),
});

const DbSchema = z.discriminatedUnion("Provider", [
    z.object({
        Provider: z.preprocess(
            stringToLowerCase,
            z.literal("postgres")
        ),
        Postgres: DbPostgresSchema,
    }),
]);

// -- File Storage Schemas --

const FileStorageAzureSchema = z.object({
    ContainerName: z.string(),
    Credentials: AzureCredentialsSchema.optional(),
});

const FileStorageAWSSchema = z.object({
    Region: z.string(),
    BucketName: z.string(),
    Credentials: AWSCredentialsSchema.optional(),
});

const FileStorageSchema = z.discriminatedUnion("Provider", [
    z.object({
        Provider: z.preprocess(
            stringToLowerCase,
            z.literal("azure")
        ),
        Azure: FileStorageAzureSchema,
        AWS: FileStorageAWSSchema.optional(),
    }),
    z.object({
        Provider: z.preprocess(
            stringToLowerCase,
            z.literal("aws")
        ),
        AWS: FileStorageAWSSchema,
        Azure: FileStorageAzureSchema.optional(),
    }),
]);

// -- Public Schemas --

const PublicSchema = z.object({
    Github: z.object({
        Owner: z.string(),
        Repository: z.string(),
        Maintainers: z.array(z.string()).optional(),
    }),
});

// -- Configuration Schema --

const ConfigStructureSchema = z.object({
    Keystore: SecretStoreSchema.optional(),
    Auth: AuthSchema.optional(),
    Db: DbSchema.optional(),
    FileStorage: FileStorageSchema.optional(),
    CIBuild: z.coerce.boolean().optional(),
    Development: z.coerce.boolean().optional(),
    Public: PublicSchema,
});

// -- Exports --

type ConfigStructure = z.infer<typeof ConfigStructureSchema>;
type SecretStore = z.infer<typeof SecretStoreSchema>;
type Auth = z.infer<typeof AuthSchema>;
type Db = z.infer<typeof DbSchema>;
type FileStorage = z.infer<typeof FileStorageSchema>;

export type {
    SecretStore,
    ConfigStructure,
    Auth,
    Db,
    FileStorage,
};

export {
    SecretStoreSchema,
    ConfigStructureSchema,
    AuthSchema,
    DbSchema,
    FileStorageSchema,
};
