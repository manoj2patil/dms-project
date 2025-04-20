# HTTPS Implementation Guide

## 1. SSL/TLS Configuration

### Certificate Management
```typescript name=ssl-config.ts
interface SSLConfig {
  key: string;
  cert: string;
  ca?: string[];
  ciphers: string[];
  minVersion: string;
  maxVersion: string;
}

const sslConfig: SSLConfig = {
  key: '/path/to/private.key',
  cert: '/path/to/certificate.crt',
  ca: ['/path/to/chain.crt'],
  ciphers: [
    'TLS_AES_256_GCM_SHA384',
    'TLS_CHACHA20_POLY1305_SHA256',
    'TLS_AES_128_GCM_SHA256',
    'ECDHE-RSA-AES256-GCM-SHA384',
  ],
  minVersion: 'TLSv1.2',
  maxVersion: 'TLSv1.3'
};