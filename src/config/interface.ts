interface ConfigStructure {
    port?: number;
    isdevelopment?: boolean;
    keystore_active?: boolean;
    auth?: {
        secret: string | undefined;
        google: {
            client_id: string | undefined;
            project_id: string;
            auth_uri: string;
            token_uri: string;
            auth_provider_x509_cert_url: string;
            client_secret: string | undefined;
        };
        ksu: {
            client_id: string | undefined;
            client_secret: string | undefined;
            issuer: string;
            well_known: string;
        };
    };
    db?: {
        name: string | undefined;
        host: string | undefined;
        port: string | undefined;
        username: string | undefined;
        password: string | undefined;
    };
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
    github_actions?: boolean;
    github?: {
        owner: string;
        repo: string;
        maintainers: string[];
    };
    blob_storage?: {
        account_name: string | undefined;
        account_key: string | undefined;
        container_name: string | undefined;
        development_url: string | undefined;
    };
}

export default ConfigStructure;