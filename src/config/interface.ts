interface ConfigStructure {
    // Local and Azure Configurations
    Keystore?: {
        Active: boolean;
    };
    Auth?: {
        Secret: string | undefined;
        Google: {
            ClientId: string | undefined;
            ProjectId: string;
            AuthUri: string;
            TokenUri: string;
            AuthProviderX509CertUrl: string;
            ClientSecret: string | undefined;
        };
        Ksu: {
            ClientId: string | undefined;
            ClientSecret: string | undefined;
            Issuer: string;
            WellKnown: string;
        };
    };
    Db?: {
        Name: string | undefined;
        Host: string | undefined;
        Port: string | undefined;
        Username: string | undefined;
        Password: string | undefined;
    };
    BlobStorage?: {
        AccountName: string | undefined;
        AccountKey: string | undefined;
        ContainerName: string | undefined;
        DevelopmentUrl: string | undefined;
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