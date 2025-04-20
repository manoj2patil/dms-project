import { checkCertificate } from './utils';

const monitorCertificate = async () => {
  const domain = 'yourdomain.com';
  const daysBeforeWarning = 30;

  const certInfo = await checkCertificate(domain);
  
  if (certInfo.daysUntilExpiry < daysBeforeWarning) {
    // Send notification
    notifyAdmin(`SSL Certificate for ${domain} expires in ${certInfo.daysUntilExpiry} days`);
  }
};

// Run daily
setInterval(monitorCertificate, 24 * 60 * 60 * 1000);