
interface ConfigStructure {
    Keystore?: {
        Provider?: string;
        Azure?: {
            KeyVaultName: string | undefined;
            TenantId: string | undefined;
            ClientId?: string | undefined;
            ClientSecret?: string | undefined;
            Url: string | undefined;
        };
        AWS?: {
            Region: string | undefined;
            AccessKeyId: string | undefined;
            SecretAccessKey: string | undefined;
        }
    };
    Auth?: {
        Secret: string | undefined;
        Provider: string | undefined;
        Oauth2?: {
            ClientId: string | undefined;
            ClientSecret: string | undefined;
            RedirectUri: string | undefined;
            AuthorizationUri: string | undefined;
            TokenUri: string | undefined;
            UserInfoUri: string | undefined;
            Scope: string | undefined;
        }
        OIDC?: {
            ClientId: string | undefined;
            ClientSecret: string | undefined;
            Issuer: string;
            WellKnown: string;
        };
    };
    Db?: {
        Provider: string | undefined;
        Postgres?: {
            Name: string | undefined;
            Host: string | undefined;
            Port: string | undefined;
            Username: string | undefined;
            Password: string | undefined;
        };
    };
    FileStorage?: {
        Provider: string | undefined;
        Azure?: {
            AccountName: string | undefined;
            AccountKey: string | undefined;
            ContainerName: string | undefined;
            DevelopmentUrl: string | undefined;
        };
        AWS?: {
            Region: string | undefined;
            AccessKeyId: string | undefined;
            SecretAccessKey: string | undefined;
            BucketName: string | undefined;
        };
    };
    github_actions?: boolean;
    public?: {
        github?: {
            owner: string;
            repo: string;
            maintainers: string[];
        };
    }

    // Local ONLY Configurations (lowercase)
    port?: number;
    isdevelopment?: boolean;
    dev_user?: {
        username: string;
        id: number;
        member: boolean;
        admin: boolean;
        readonly: boolean;
        date_created: string;
        date_modified: string;
        is_kdd_only: boolean;
    };
}

export default ConfigStructure;