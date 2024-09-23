import { Endpoint } from "aws-sdk";
import { url } from "inspector";
import { z } from "zod";

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

// -- KeyStore Schemas --

const KeystoreAzureSchema = z.union([
    AzureCredentialsSchema.optional(),
    z.object({
        KeyVaultName: z.string(),
        Url: z.string().optional(),
    })
]);

const KeystoreAWSSchema = z.union([
    AWSCredentialsSchema.optional(),
    z.object({
        Region: z.string(),
        Endpoint: z.string().optional(),
    })
]);

const KeystoreSchema = z
    .object({
        Provider: z
            .preprocess((val) => {
                if (typeof val === "string") {
                return val.toLowerCase();
                }
                return val;
            }, z.enum(["aws", "azure"]).optional()),
        Azure: KeystoreAzureSchema.optional(),
        AWS: KeystoreAWSSchema.optional(),
    })
    .refine((data) => {
        if (data.Provider === "aws") {
          return data.AWS !== undefined;
        }
        return true;
    }, {
        message: "AWS configuration must be defined when Provider is 'AWS'",
        path: ["Provider"],
    })
    .refine((data) => {
        if (data.Provider === "azure") {
          return data.Azure !== undefined;
        }
        return true;
    }, {
        message: "Azure configuration must be defined when Provider is 'Azure'",
        path: ["Provider"],
    });

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
    Issuer: z.string(),
    WellKnown: z.string(),
});

const AuthSchema = z
    .object({
        Secret: z.string(),
        Provider: z.preprocess((val) => {
            if (typeof val === "string") {
            return val.toLowerCase();
            }

            return val;
        }, z.enum(["oauth2", "oidc"]).optional()),
        Oauth2: AuthOAuth2Schema.optional(),
        OIDC: AuthOIDCSchema.optional(),
    })
    .refine((data) => {
        if (data.Provider === "oauth2") {
        return data.Oauth2 !== undefined;
        }

        return true;
    })
    .refine((data) => {
        if (data.Provider === "oidc") {
        return data.OIDC !== undefined;
        }

        return true;
    });


// -- Database Schemas --

const DbPostgresSchema = z.object({
    Name: z.string(),
    Host: z.string(),
    Port: z.string(),
    Username: z.string(),
    Password: z.string(),
});

const DbSchema = z
    .object({
        Provider: z.preprocess((val) => {
            if (typeof val === "string") {
            return val.toLowerCase();
            }

            return val;
        }, z.enum(["postgres"]).optional()),
        Postgres: DbPostgresSchema.optional(),
    }).refine((data) => {
        if (data.Provider === "postgres") {
        return data.Postgres !== undefined;
        }

        return true;
    });

// -- File Storage Schemas --

const FileStorageAzureSchema = z.union([
    AzureCredentialsSchema.optional(),
    z.object({
        ContainerName: z.string(),
    })
]);

const FileStorageAWSSchema = z.union([
    AWSCredentialsSchema.optional(),
    z.object({
        Region: z.string().optional(),
        BucketName: z.string().optional(),
    })
]);

const FileStorageSchema = z
    .object({
        Provider: z.preprocess((val) => {
            if (typeof val === "string") {
                return val.toLowerCase();
            }

            return val;
        }, z.enum(["azure", "aws"]).optional()),
        Azure: FileStorageAzureSchema.optional(),
        AWS: FileStorageAWSSchema.optional(),
    }).refine((data) => {
        if (data.Provider === "azure") {
            return data.Azure !== undefined;
        }

        return true;
    }).refine((data) => {
        if (data.Provider === "aws") {
            return data.AWS !== undefined;
        }

        return true;
    });

const ConfigStructureSchema = z.object({
    Keystore: KeystoreSchema.optional(),
    Auth: AuthSchema.optional(),
    Db: DbSchema.optional(),
    FileStorage: FileStorageSchema.optional(),
    CIBuild: z.boolean().optional(),
});

type ConfigStructure = z.infer<typeof ConfigStructureSchema>;

export default ConfigStructure;