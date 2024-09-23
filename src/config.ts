import 'server-only';

import ConfigLoader from './config/loader';
import type { ConfigStructure } from './config/schema';

class ConfigSingleton {
    private static instance: ConfigSingleton;
    private loader?: ConfigLoader;
    private _config?: ConfigStructure;

    private constructor() {}

    static getInstance(): ConfigSingleton {
        if (!ConfigSingleton.instance) {
            ConfigSingleton.instance = new ConfigSingleton();
        }
        return ConfigSingleton.instance;
    }

    async init() {
        if (this._config) {
            return;
        }

        this.loader = new ConfigLoader();
        this._config = await this.loader.loadConfig();
    }

    public get config(): ConfigStructure {
        if (!this._config) {
            throw new Error('Config not loaded');
        }

        return this._config;
    }
}

const configInstance = ConfigSingleton.getInstance();
await configInstance.init();

export default configInstance.config;
