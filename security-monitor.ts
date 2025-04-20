import { SecurityHeadersChecker } from './utils';

const checkSecurityHeaders = async () => {
  const checker = new SecurityHeadersChecker();
  const results = await checker.checkEndpoint('https://yourdomain.com');
  
  if (results.hasVulnerabilities) {
    notifyAdmin('Security headers check failed', results.details);
  }
};

// Run hourly
setInterval(checkSecurityHeaders, 60 * 60 * 1000);