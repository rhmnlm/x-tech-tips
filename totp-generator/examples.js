const TOTPGenerator = require('./totp-generator');

// Example 1: Simple usage with defaults
console.log('=== Example 1: Default TOTP Generator ===');
const simpleTotp = new TOTPGenerator();
const current = simpleTotp.getCurrentTOTP();
console.log(`Current TOTP: ${current.code}`);
console.log(`Expires in: ${current.remainingTime} seconds`);
console.log(`Secret: ${simpleTotp.secret}`);

// Example 2: Corporate use case
console.log('\n=== Example 2: Corporate TOTP ===');
const corporateTotp = new TOTPGenerator({
    issuer: 'Acme Corp',
    accountName: 'john.doe@acme.com',
    secret: 'JBSWY3DPEHPK3PXP', // In practice, generate this securely
});

corporateTotp.displayInfo();

// Example 3: High security settings
console.log('\n=== Example 3: High Security TOTP ===');
const secureTotp = new TOTPGenerator({
    issuer: 'SecureBank',
    accountName: 'customer@securebank.com',
    algorithm: 'SHA256',
    digits: 8,
    period: 15, // Shorter period for higher security
    window: 0   // No clock skew tolerance
});

const secureCode = secureTotp.getCurrentTOTP();
console.log(`Secure TOTP: ${secureCode.code} (${secureCode.remainingTime}s remaining)`);

// Example 4: Verification example
console.log('\n=== Example 4: TOTP Verification ===');
const verifyTotp = new TOTPGenerator({
    secret: 'NBSWY3DP'
});

const testCode = verifyTotp.generateTOTP();
console.log(`Generated code: ${testCode}`);
console.log(`Verification (correct): ${verifyTotp.verifyTOTP(testCode)}`);
console.log(`Verification (wrong): ${verifyTotp.verifyTOTP('123456')}`);

// Example 5: Generate QR codes for multiple accounts
async function generateMultipleQRCodes() {
    console.log('\n=== Example 5: Multiple QR Codes ===');
    
    const accounts = [
        { issuer: 'Gmail', accountName: 'user@gmail.com' },
        { issuer: 'Facebook', accountName: 'user@facebook.com' },
        { issuer: 'Twitter', accountName: '@username' }
    ];
    
    for (let i = 0; i < accounts.length; i++) {
        const totp = new TOTPGenerator(accounts[i]);
        const filename = `${accounts[i].issuer.toLowerCase()}-qr.png`;
        
        try {
            await totp.generateQRCode(filename);
            console.log(`✓ Generated QR code for ${accounts[i].issuer}: ${filename}`);
        } catch (error) {
            console.error(`✗ Failed to generate QR for ${accounts[i].issuer}:`, error.message);
        }
    }
}

generateMultipleQRCodes();