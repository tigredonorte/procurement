import { Controller, Get } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';

let cachedVersion = '0.0.0';

function getVersion(): string {
  if (cachedVersion === '0.0.0') {
    try {
      const pkg = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf-8'));
      cachedVersion = pkg.version ?? '0.0.0';
    } catch {
      // fallback already set
    }
  }
  return cachedVersion;
}

@Controller('health')
export class HealthController {
  @Get()
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'backend',
      version: getVersion(),
    };
  }
}
