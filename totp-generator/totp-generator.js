const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const qrcode = require('qrcode');

class TOTPGenerator {
    constructor(options = {}) {
        // Default parameters
        this.secret = options.secret || this.generateSecret();
        this.issuer = options.issuer || 'MyApp';
        this.accountName = options.accountName || 'user@example.com';
        this.algorithm = options.algorithm || 'SHA1';
        this.digits = options.digits || 6;
        this.period = options.period || 30; // 30 seconds
        this.window = options.window || 1; // Allow 1 period before/after for clock skew
    }

    /**
     * Generate a random base32 secret
     */
    generateSecret(length = 32) {
        const base32Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        let secret = '';
        
        for (let i = 0; i < length; i++) {
            secret += base32Chars[Math.floor(Math.random() * base32Chars.length)];
        }
        
        return secret;
    }

    /**
     * Convert base32 to buffer
     */
    base32ToBuffer(base32) {
        const base32Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        base32 = base32.toUpperCase().replace(/=+$/, '');
        
        let bits = '';
        for (let i = 0; i < base32.length; i++) {
            const char = base32[i];
            const index = base32Chars.indexOf(char);
            if (index === -1) {
                throw new Error('Invalid base32 character: ' + char);
            }
            bits += index.toString(2).padStart(5, '0');
        }
        
        const bytes = [];
        for (let i = 0; i < bits.length; i += 8) {
            if (i + 8 <= bits.length) {
                bytes.push(parseInt(bits.substr(i, 8), 2));
            }
        }
        
        return Buffer.from(bytes);
    }

    /**
     * Generate TOTP code for a given time
     */
    generateTOTP(timestamp = Date.now()) {
        const timeStep = Math.floor(timestamp / 1000 / this.period);
        const timeBuffer = Buffer.alloc(8);
        timeBuffer.writeBigUInt64BE(BigInt(timeStep));
        
        const secretBuffer = this.base32ToBuffer(this.secret);
        const hmac = crypto.createHmac(this.algorithm.toLowerCase(), secretBuffer);
        hmac.update(timeBuffer);
        const hash = hmac.digest();
        
        const offset = hash[hash.length - 1] & 0x0f;
        const binary = ((hash[offset] & 0x7f) << 24) |
                      ((hash[offset + 1] & 0xff) << 16) |
                      ((hash[offset + 2] & 0xff) << 8) |
                      (hash[offset + 3] & 0xff);
        
        const otp = binary % Math.pow(10, this.digits);
        return otp.toString().padStart(this.digits, '0');
    }

    /**
     * Verify a TOTP code
     */
    verifyTOTP(token, timestamp = Date.now()) {
        const currentTimeStep = Math.floor(timestamp / 1000 / this.period);
        
        for (let i = -this.window; i <= this.window; i++) {
            const testTime = (currentTimeStep + i) * this.period * 1000;
            const expectedToken = this.generateTOTP(testTime);
            
            if (token === expectedToken) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * Generate otpauth URI for QR code
     */
    generateOtpAuthUri() {
        const params = new URLSearchParams({
            secret: this.secret,
            issuer: this.issuer,
            algorithm: this.algorithm,
            digits: this.digits.toString(),
            period: this.period.toString()
        });
        
        return `otpauth://totp/${encodeURIComponent(this.issuer)}:${encodeURIComponent(this.accountName)}?${params.toString()}`;
    }

    /**
     * Generate QR code and save to output folder
     */
    async generateQRCode(filename = 'totp-qr.png') {
        try {
            const outputDir = path.join(__dirname, 'output');
            
            // Create output directory if it doesn't exist
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }
            
            const otpAuthUri = this.generateOtpAuthUri();
            const qrCodePath = path.join(outputDir, filename);
            
            await qrcode.toFile(qrCodePath, otpAuthUri, {
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                },
                width: 300
            });
            
            console.log(`QR code generated successfully: ${qrCodePath}`);
            return qrCodePath;
        } catch (error) {
            console.error('Error generating QR code:', error);
            throw error;
        }
    }

    /**
     * Get current TOTP with remaining time
     */
    getCurrentTOTP() {
        const now = Date.now();
        const currentCode = this.generateTOTP(now);
        const timeStep = Math.floor(now / 1000 / this.period);
        const nextTimeStep = (timeStep + 1) * this.period;
        const remainingTime = nextTimeStep - Math.floor(now / 1000);
        
        return {
            code: currentCode,
            remainingTime: remainingTime,
            period: this.period
        };
    }

    /**
     * Get remaining time for current TOTP period without generating new code
     */
    getRemainingTime(timestamp = Date.now()) {
        const timeStep = Math.floor(timestamp / 1000 / this.period);
        const nextTimeStep = (timeStep + 1) * this.period;
        return nextTimeStep - Math.floor(timestamp / 1000);
    }

    /**
     * Get current time step (useful for caching)
     */
    getCurrentTimeStep(timestamp = Date.now()) {
        return Math.floor(timestamp / 1000 / this.period);
    }

    /**
     * Display TOTP information
     */
    displayInfo() {
        const current = this.getCurrentTOTP();
        
        console.log('\n=== TOTP Generator Information ===');
        console.log(`Issuer: ${this.issuer}`);
        console.log(`Account: ${this.accountName}`);
        console.log(`Secret: ${this.secret}`);
        console.log(`Algorithm: ${this.algorithm}`);
        console.log(`Digits: ${this.digits}`);
        console.log(`Period: ${this.period} seconds`);
        console.log(`\nCurrent TOTP: ${current.code}`);
        console.log(`Remaining time: ${current.remainingTime} seconds`);
        console.log(`\nOtpAuth URI: ${this.generateOtpAuthUri()}`);
        console.log('\n=================================\n');
    }
}

// Example usage and CLI interface
if (require.main === module) {
    async function main() {
        try {
            // Parse command line arguments
            const args = process.argv.slice(2);
            const options = {};
            
            for (let i = 0; i < args.length; i += 2) {
                const key = args[i].replace(/^--/, '');
                const value = args[i + 1];
                
                if (key && value) {
                    options[key] = value;
                }
            }
            
            // Create TOTP generator with default parameters
            const totp = new TOTPGenerator(options);
            
            // Display information
            totp.displayInfo();
            
            // Generate QR code
            await totp.generateQRCode();
            
            // Live TOTP display (optional)
            if (args.includes('--live')) {
                console.log('Starting live TOTP display (press Ctrl+C to exit)...');
                
                let lastCode = '';
                let lastTimeStep = -1;
                
                const updateDisplay = () => {
                    const now = Date.now();
                    const currentTimeStep = Math.floor(now / 1000 / totp.period);
                    
                    // Only recalculate TOTP when we're in a new time period
                    if (currentTimeStep !== lastTimeStep) {
                        const current = totp.getCurrentTOTP();
                        lastCode = current.code;
                        lastTimeStep = currentTimeStep;
                    }
                    
                    // Calculate remaining time without calling getCurrentTOTP()
                    const nextTimeStep = (currentTimeStep + 1) * totp.period;
                    const remainingTime = nextTimeStep - Math.floor(now / 1000);
                    
                    process.stdout.write(`\rCurrent TOTP: ${lastCode} (${remainingTime}s remaining)`);
                };
                
                // Initial display
                updateDisplay();
                
                // Update every second, but only recalculate TOTP when needed
                setInterval(updateDisplay, 1000);
            }
            
        } catch (error) {
            console.error('Error:', error.message);
            process.exit(1);
        }
    }
    
    main();
}

module.exports = TOTPGenerator;