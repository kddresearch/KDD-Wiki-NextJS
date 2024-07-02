import ConfigLoader from './config/loader';
import ConfigStructure from './config/interface';

let loaded;

class ConfigSingleton {
    private static instance: ConfigSingleton;
    private loader: ConfigLoader | null = null;
    public config: ConfigStructure | null = null;

    private constructor() {}

    static getInstance(): ConfigSingleton {
        if (!ConfigSingleton.instance) {
            ConfigSingleton.instance = new ConfigSingleton();
        }
        return ConfigSingleton.instance;
    }

    async init(keyVaultName: string | undefined = process.env.AZURE_KEY_VAULT_NAME): Promise<ConfigStructure>{
        if (!this.config) {
            this.loader = new ConfigLoader(keyVaultName);
            this.config = await this.loader.loadConfig();
        }
        return this.config;
    }

    public getConfig(): ConfigStructure | null {
        return this.config;
    }
}

// await ConfigSingleton.getInstance().init();

// console.log(ConfigSingleton.getInstance().config);

// const getConfig = ConfigSingleton.getInstance

let config;

const getConfig = (async () => {
    const configInstance = ConfigSingleton.getInstance();
    await configInstance.init();
    console.log("Config loaded", configInstance.config);

    config = configInstance.config;

    return config;
});

// console.log("tell me why", config);

export default getConfig;
