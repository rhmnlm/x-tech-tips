const TOTPGenerator = require('./totp-generator');

// Example of efficient TOTP usage with caching
class EfficientTOTPManager {
    constructor(totpGenerator) {
        this.totp = totpGenerator;
        this.cachedCode = null;
        this.cachedTimeStep = -1;
    }

    /**
     * Get current TOTP with smart caching
     * Only recalculates when we're in a new time period
     */
    getCurrentTOTP() {
        const now = Date.now();
        const currentTimeStep = this.totp.getCurrentTimeStep(now);
        
        // Only recalculate if we're in a new time period
        if (currentTimeStep !== this.cachedTimeStep) {
            this.cachedCode = this.totp.generateTOTP(now);
            this.cachedTimeStep = currentTimeStep;
            console.log(`🔄 Recalculated TOTP for time step ${currentTimeStep}`);
        } else {
            console.log(`📱 Using cached TOTP for time step ${currentTimeStep}`);
        }
        
        return {
            code: this.cachedCode,
            remainingTime: this.totp.getRemainingTime(now),
            period: this.totp.period
        };
    }
}

// Demo the efficient approach
async function demo() {
    console.log('=== Efficient TOTP Usage Demo ===\n');

    const totp = new TOTPGenerator({
        issuer: 'Demo App',
        accountName: 'test@example.com',
        secret: 'JBSWY3DPEHPK3PXP'
    });

    const efficientManager = new EfficientTOTPManager(totp);

    // Simulate multiple rapid calls (like a UI updating every second)
    console.log('Simulating rapid calls (like UI updates):');
    for (let i = 0; i < 5; i++) {
        const current = efficientManager.getCurrentTOTP();
        console.log(`Call ${i + 1}: ${current.code} (${current.remainingTime}s remaining)`);
        
        // Wait 1 second between calls
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('\n=== Server-Side Best Practices ===');
    console.log(`
For server-side applications:

1. 🚫 DON'T: Call getCurrentTOTP() every second
   - Wastes CPU on crypto calculations
   - No benefit since TOTP changes every ${totp.period} seconds

2. ✅ DO: Cache the TOTP code per time period
   - Calculate once per ${totp.period}-second window
   - Use time step as cache key
   - Only recalculate when time step changes

3. ✅ DO: For real-time displays
   - Calculate TOTP once per period
   - Update remaining time independently
   - Use efficient timer management

4. ✅ DO: For API responses
   - Generate TOTP on-demand
   - Include both code and remaining time
   - Let client handle countdown display

Example efficient server endpoint:
\`\`\`javascript
app.get('/totp', (req, res) => {
    const current = totp.getCurrentTOTP();
    res.json({
        code: current.code,
        remainingTime: current.remainingTime,
        expiresAt: Date.now() + (current.remainingTime * 1000)
    });
});
\`\`\`
`);
}

// Run the demo
demo().catch(console.error);