const TOTPGenerator = require('./totp-generator');

async function test() {
    console.log('=== TOTP Generator Test ===\n');
    
    // Test 1: Default parameters
    console.log('1. Testing with default parameters:');
    const totp1 = new TOTPGenerator();
    totp1.displayInfo();
    
    // Test 2: Custom parameters
    console.log('2. Testing with custom parameters:');
    const totp2 = new TOTPGenerator({
        issuer: 'TestApp',
        accountName: 'test@example.com',
        secret: 'JBSWY3DPEHPK3PXP',
        digits: 8,
        period: 60
    });
    totp2.displayInfo();
    
    // Test 3: TOTP verification
    console.log('3. Testing TOTP verification:');
    const currentCode = totp2.generateTOTP();
    console.log(`Generated code: ${currentCode}`);
    console.log(`Verification result: ${totp2.verifyTOTP(currentCode)}`);
    console.log(`Invalid code verification: ${totp2.verifyTOTP('000000')}`);
    
    // Test 4: QR code generation
    console.log('\n4. Testing QR code generation:');
    try {
        await totp1.generateQRCode('test-qr-default.png');
        await totp2.generateQRCode('test-qr-custom.png');
        console.log('QR codes generated successfully!');
    } catch (error) {
        console.error('QR code generation failed:', error.message);
    }
    
    console.log('\n=== Test Complete ===');
}

test();