import { Controller, Get } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';

let cachedVersion: string | null = null;

function getVersion(): string {
  if (cachedVersion === null) {
    try {
      const pkg = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf-8'));
      cachedVersion = pkg.version ?? '0.0.0';
    } catch {
      cachedVersion = '0.0.0';
    }
  }
  return cachedVersion!;
}

@Controller('health')
export class HealthController {
  @Get()
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'worker',
      version: getVersion(), // reads from package.json at runtime
    };
  }
}
