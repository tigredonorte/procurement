import * as fs from 'fs';
import * as path from 'path';
import { Config, Environment, ConfigOptions, AppConfig, DatabaseConfig, RedisConfig } from './types';
import { ConfigValidator } from './validator';

export class ConfigLoader {
  private static instance: ConfigLoader | null = null;
  private config: Config | null = null;
  private validator: ConfigValidator;
  private environment: Environment;
  private configPath: string;
  private watchers: Map<string, fs.FSWatcher> = new Map();
  private enableHotReload: boolean;
  private onReloadCallbacks: Array<(config: Config) => void> = [];

  private constructor(options: ConfigOptions = {}) {
    this.environment = options.environment || (process.env.NODE_ENV as Environment) || 'development';
    this.configPath = options.configPath || path.join(process.cwd(), 'config');
    this.enableHotReload = options.enableHotReload ?? (this.environment === 'development');
    this.validator = new ConfigValidator(path.join(this.configPath, 'schemas'));
  }

  static getInstance(options?: ConfigOptions): ConfigLoader {
    if (!ConfigLoader.instance) {
      ConfigLoader.instance = new ConfigLoader(options);
    }
    return ConfigLoader.instance;
  }

  static resetInstance(): void {
    if (ConfigLoader.instance) {
      ConfigLoader.instance.cleanup();
      ConfigLoader.instance = null;
    }
  }

  private loadConfigFile<T>(fileName: string): T {
    const filePath = path.join(this.configPath, 'environments', this.environment, fileName);
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`Configuration file not found: ${filePath}`);
    }

    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      throw new Error(`Failed to parse configuration file ${filePath}: ${error}`);
    }
  }

  private mergeWithSecrets<T extends object>(config: T, secrets: Record<string, any>): T {
    // This method will merge configuration with secrets from Doppler
    // Secrets take precedence over config file values
    const merged = { ...config };
    
    // Deep merge secrets into config
    for (const [key, value] of Object.entries(secrets)) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        (merged as any)[key] = this.mergeWithSecrets((merged as any)[key] || {}, value);
      } else {
        (merged as any)[key] = value;
      }
    }
    
    return merged;
  }

  private getSecretsFromEnvironment(): Record<string, any> {
    // Extract secrets from environment variables (injected by Doppler)
    const secrets: Record<string, any> = {};
    
    // MongoDB connection string from Doppler
    if (process.env.MONGODB_URI) {
      secrets.database = {
        ...secrets.database,
        connectionString: process.env.MONGODB_URI
      };
    }
    
    // Redis password from Doppler
    if (process.env.REDIS_PASSWORD) {
      secrets.redis = {
        ...secrets.redis,
        connection: {
          password: process.env.REDIS_PASSWORD
        }
      };
    }
    
    // JWT secrets
    if (process.env.JWT_SECRET) {
      secrets.auth = {
        ...secrets.auth,
        jwtSecret: process.env.JWT_SECRET
      };
    }
    
    // API keys
    if (process.env.SERP_API_KEY) {
      secrets.integrations = {
        ...secrets.integrations,
        serpApiKey: process.env.SERP_API_KEY
      };
    }
    
    return secrets;
  }

  private setupFileWatchers(): void {
    if (!this.enableHotReload) return;

    const envPath = path.join(this.configPath, 'environments', this.environment);
    const files = ['app.config.json', 'database.config.json', 'redis.config.json'];

    files.forEach(file => {
      const filePath = path.join(envPath, file);
      if (fs.existsSync(filePath)) {
        const watcher = fs.watch(filePath, (eventType) => {
          if (eventType === 'change') {
            console.log(`Config file ${file} changed, reloading...`);
            this.reload();
          }
        });
        this.watchers.set(file, watcher);
      }
    });
  }

  load(): Config {
    if (this.config) {
      return this.config;
    }

    try {
      // Load configuration files
      const appConfig = this.loadConfigFile<AppConfig>('app.config.json');
      const databaseConfig = this.loadConfigFile<DatabaseConfig>('database.config.json');
      const redisConfig = this.loadConfigFile<RedisConfig>('redis.config.json');

      // Validate configurations
      this.validator.validateAppConfig(appConfig);
      this.validator.validateDatabaseConfig(databaseConfig);
      this.validator.validateRedisConfig(redisConfig);

      // Get secrets from environment (Doppler)
      const secrets = this.getSecretsFromEnvironment();

      // Merge configurations with secrets
      const mergedConfig: Config = {
        app: this.mergeWithSecrets(appConfig, secrets.app || {}),
        database: this.mergeWithSecrets(databaseConfig, secrets.database || {}),
        redis: this.mergeWithSecrets(redisConfig, secrets.redis || {})
      };

      this.config = mergedConfig;

      // Setup file watchers for hot reload in development
      this.setupFileWatchers();

      return this.config;
    } catch (error) {
      console.error('Failed to load configuration:', error);
      throw error;
    }
  }

  reload(): Config {
    // Clear cached config
    this.config = null;
    
    // Reload configuration
    const newConfig = this.load();
    
    // Notify callbacks
    this.onReloadCallbacks.forEach(callback => {
      try {
        callback(newConfig);
      } catch (error) {
        console.error('Error in config reload callback:', error);
      }
    });
    
    return newConfig;
  }

  onReload(callback: (config: Config) => void): void {
    this.onReloadCallbacks.push(callback);
  }

  getConfig(): Config {
    if (!this.config) {
      return this.load();
    }
    return this.config;
  }

  getAppConfig(): AppConfig {
    return this.getConfig().app;
  }

  getDatabaseConfig(): DatabaseConfig {
    return this.getConfig().database;
  }

  getRedisConfig(): RedisConfig {
    return this.getConfig().redis;
  }

  getEnvironment(): Environment {
    return this.environment;
  }

  cleanup(): void {
    // Close file watchers
    this.watchers.forEach(watcher => watcher.close());
    this.watchers.clear();
    this.onReloadCallbacks = [];
    this.config = null;
  }
}

// Export singleton instance getter
export const getConfig = (options?: ConfigOptions): Config => {
  return ConfigLoader.getInstance(options).getConfig();
};

export const getAppConfig = (options?: ConfigOptions): AppConfig => {
  return ConfigLoader.getInstance(options).getAppConfig();
};

export const getDatabaseConfig = (options?: ConfigOptions): DatabaseConfig => {
  return ConfigLoader.getInstance(options).getDatabaseConfig();
};

export const getRedisConfig = (options?: ConfigOptions): RedisConfig => {
  return ConfigLoader.getInstance(options).getRedisConfig();
};