import 'server-only';

import ConfigLoader from './config/loader';
import type { ConfigStructure } from './config/schema';

class ConfigSingleton {
    private static instance: ConfigSingleton;
    private loader?: ConfigLoader;
    private _configPromise?: Promise<ConfigStructure>;

    private constructor() {
        this.loader = new ConfigLoader();
        this._configPromise = this.loader.loadConfig();
    }

    static getInstance(): ConfigSingleton {
        if (!ConfigSingleton.instance) {
            ConfigSingleton.instance = new ConfigSingleton();
        }
        return ConfigSingleton.instance;
    }

    public get config(): Promise<ConfigStructure> {
        return this._configPromise!;
    }
}

export default ConfigSingleton.getInstance().config;