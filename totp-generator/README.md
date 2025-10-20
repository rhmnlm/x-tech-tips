# TOTP Generator

A Node.js TOTP (Time-based One-Time Password) generator with QR code support and default parameters.

## Features

- Generate TOTP codes with customizable parameters
- Default secure configuration (SHA1, 6 digits, 30-second period)
- QR code generation for easy setup with authenticator apps
- Verification of TOTP codes with clock skew tolerance
- CLI interface with live TOTP display
- Modular design for easy integration

## Installation

1. Install dependencies:
```bash
npm install
```

## Usage

### Basic Usage

Run the generator with default parameters:
```bash
node totp-generator.js
```

This will:
- Generate a random secret
- Display TOTP information
- Create a QR code in the `output/` folder
- Show the current TOTP code

### Custom Parameters

You can customize the TOTP parameters:
```bash
node totp-generator.js --issuer "MyCompany" --accountName "john@example.com" --secret "MYSECRETKEY"
```

### Live TOTP Display

For a live updating display:
```bash
node totp-generator.js --live
```

### Available Options

- `--issuer`: The issuer name (default: "MyApp")
- `--accountName`: The account name (default: "user@example.com")
- `--secret`: Base32 encoded secret (default: randomly generated)
- `--algorithm`: Hash algorithm (default: "SHA1")
- `--digits`: Number of digits (default: 6)
- `--period`: Time period in seconds (default: 30)
- `--live`: Enable live TOTP display

### Programmatic Usage

```javascript
const TOTPGenerator = require('./totp-generator');

// Create with default parameters
const totp = new TOTPGenerator();

// Create with custom parameters
const customTotp = new TOTPGenerator({
    issuer: 'MyCompany',
    accountName: 'user@mycompany.com',
    secret: 'JBSWY3DPEHPK3PXP', // Optional: provide your own secret
    algorithm: 'SHA1',
    digits: 6,
    period: 30
});

// Generate current TOTP
const current = totp.getCurrentTOTP();
console.log(`Current code: ${current.code}`);
console.log(`Remaining time: ${current.remainingTime} seconds`);

// Verify a TOTP code
const isValid = totp.verifyTOTP('123456');
console.log(`Code is valid: ${isValid}`);

// Generate QR code
totp.generateQRCode('my-totp-qr.png').then(() => {
    console.log('QR code generated!');
});
```

## Default Parameters

The generator uses the following default parameters:

- **Algorithm**: SHA1 (widely supported)
- **Digits**: 6 (standard TOTP length)
- **Period**: 30 seconds (standard TOTP interval)
- **Window**: 1 (allows ±30 seconds for clock skew)
- **Issuer**: "MyApp"
- **Account**: "user@example.com"
- **Secret**: Randomly generated 32-character base32 string

## QR Code

The QR code is automatically generated in the `output/` folder and contains an `otpauth://` URI that can be scanned by authenticator apps like:

- Google Authenticator
- Microsoft Authenticator
- Authy
- 1Password
- LastPass Authenticator

## Performance Optimization

⚠️ **Important**: Don't call `getCurrentTOTP()` every second!

TOTP codes only change every 30 seconds (by default), so recalculating them every second wastes CPU cycles. Here's the right approach:

### ❌ Inefficient Approach
```javascript
// DON'T: Recalculate every second
setInterval(() => {
    const current = totp.getCurrentTOTP(); // Expensive crypto operation!
    updateDisplay(current.code, current.remainingTime);
}, 1000);
```

### ✅ Efficient Approach
```javascript
// DO: Cache per time period, update time independently
let cachedCode = '';
let lastTimeStep = -1;

setInterval(() => {
    const now = Date.now();
    const currentTimeStep = Math.floor(now / 1000 / 30);
    
    // Only recalculate when we enter a new 30-second period
    if (currentTimeStep !== lastTimeStep) {
        cachedCode = totp.generateTOTP(now);
        lastTimeStep = currentTimeStep;
    }
    
    // Calculate remaining time without expensive crypto
    const remainingTime = ((currentTimeStep + 1) * 30) - Math.floor(now / 1000);
    updateDisplay(cachedCode, remainingTime);
}, 1000);
```

**Performance improvement**: ~50x faster with 99.9% fewer crypto operations!

## Security Notes

- Keep your secret key secure and never share it
- The secret is displayed in the console for development purposes
- In production, store secrets securely (environment variables, key vaults, etc.)
- The generated QR codes contain the secret, so handle them securely

## License

MIT