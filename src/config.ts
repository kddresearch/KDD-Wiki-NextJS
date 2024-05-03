const config = {
    "auth": {
        "secret": process.env.AUTH_SECRET,
        "google": {
            "client_id":process.env.AUTH_GOOGLE_CLIENT_ID,
            "project_id":"canvascaboose",
            "auth_uri":"https://accounts.google.com/o/oauth2/auth",
            "token_uri":"https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs",
            "client_secret":process.env.AUTH_GOOGLE_CLIENT_SECRET,
        },
        "ksu": {
            "client_id": process.env.AUTH_KSU_CLIENT_ID,
            "client_secret": process.env.AUTH_KSU_CLIENT_SECRET,
            "issuer": "https://signin.k-state.edu/WebISO/oidc",
            "well_known": "https://signin.k-state.edu/WebISO/oidc/.well-known"
        }
    },
    "db": {
        "name": process.env.DB_NAME,
        "host": process.env.DB_HOST,
        "port": 5432,
        "username": process.env.DB_USERNAME,
        "password": process.env.DB_PASSWORD,
        "azure_connection_string": process.env.DB_AZURE_CONNECTION_STRING,
    },
    "dev_user": {
        "username": "wnbaldwin",
        "id": 109,
        "member": true,
        "admin": true,
        "readonly": false,
        "date_created": "2016-04-20T15:00:00.000Z",
        "date_modified": "2016-04-20T15:00:00.000Z",
        "is_kdd_only": false
    },
    "github_actions": process.env.GITHUB_ACTIONS === 'true',
    "github": {
        "owner": "kddresearch",
        "repo": "KDD-Wiki-NextJS",
        "maintainers": ["Legonois"],
    },
}

type ConfigType = typeof config;

const configProxy = new Proxy(config, {
    get(target, prop, receiver) {
        if (prop in target) {
            console.log(`Accessing ${String(prop)} configuration`);
            const value = Reflect.get(target, prop, receiver);
            if (value && typeof value === 'object') {
                return new Proxy(value, this);
            }
            return value;
        }
        return undefined; // Optionally, you can handle non-existent properties differently
    }
}) as ConfigType;

export default configProxy;