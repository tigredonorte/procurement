import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import * as fs from 'fs';
import * as path from 'path';
import { AppConfig, DatabaseConfig, RedisConfig } from './types';

export class ConfigValidator {
  private ajv: Ajv;
  private schemas: Map<string, any> = new Map();

  constructor(schemaPath?: string) {
    this.ajv = new Ajv({ allErrors: true, verbose: true });
    addFormats(this.ajv);
    
    const basePath = schemaPath || path.join(process.cwd(), 'config', 'schemas');
    this.loadSchemas(basePath);
  }

  private loadSchemas(schemaPath: string): void {
    const schemaFiles = [
      { name: 'app', file: 'app.schema.json' },
      { name: 'database', file: 'database.schema.json' },
      { name: 'redis', file: 'redis.schema.json' }
    ];

    for (const { name, file } of schemaFiles) {
      const fullPath = path.join(schemaPath, file);
      if (fs.existsSync(fullPath)) {
        const schema = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
        this.schemas.set(name, schema);
        this.ajv.addSchema(schema, name);
      } else {
        console.warn(`Schema file not found: ${fullPath}`);
      }
    }
  }

  validateAppConfig(config: any): config is AppConfig {
    const validate = this.ajv.getSchema('app');
    if (!validate) {
      throw new Error('App schema not loaded');
    }
    
    const valid = validate(config);
    if (!valid) {
      throw new Error(`App config validation failed: ${JSON.stringify(validate.errors, null, 2)}`);
    }
    
    return true;
  }

  validateDatabaseConfig(config: any): config is DatabaseConfig {
    const validate = this.ajv.getSchema('database');
    if (!validate) {
      throw new Error('Database schema not loaded');
    }
    
    const valid = validate(config);
    if (!valid) {
      throw new Error(`Database config validation failed: ${JSON.stringify(validate.errors, null, 2)}`);
    }
    
    return true;
  }

  validateRedisConfig(config: any): config is RedisConfig {
    const validate = this.ajv.getSchema('redis');
    if (!validate) {
      throw new Error('Redis schema not loaded');
    }
    
    const valid = validate(config);
    if (!valid) {
      throw new Error(`Redis config validation failed: ${JSON.stringify(validate.errors, null, 2)}`);
    }
    
    return true;
  }

  validateAll(configs: { app: any; database: any; redis: any }): boolean {
    this.validateAppConfig(configs.app);
    this.validateDatabaseConfig(configs.database);
    this.validateRedisConfig(configs.redis);
    return true;
  }

  getValidationErrors(): any[] | null {
    return this.ajv.errors;
  }
}