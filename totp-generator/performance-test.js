const TOTPGenerator = require('./totp-generator');

// Performance comparison: Inefficient vs Efficient approaches
class PerformanceTest {
    constructor() {
        this.totp = new TOTPGenerator({
            issuer: 'Performance Test',
            accountName: 'test@example.com',
            secret: 'JBSWY3DPEHPK3PXP'
        });
    }

    // ❌ INEFFICIENT: Recalculate TOTP every call
    inefficientApproach(iterations = 100) {
        const start = process.hrtime.bigint();
        let results = [];
        
        for (let i = 0; i < iterations; i++) {
            const current = this.totp.getCurrentTOTP();
            results.push(current.code);
        }
        
        const end = process.hrtime.bigint();
        const duration = Number(end - start) / 1000000; // Convert to milliseconds
        
        return {
            approach: 'Inefficient (recalculate every time)',
            iterations,
            duration: duration.toFixed(2),
            averagePerCall: (duration / iterations).toFixed(4),
            cryptoOperations: iterations // One crypto operation per call
        };
    }

    // ✅ EFFICIENT: Cache TOTP per time period
    efficientApproach(iterations = 100) {
        const start = process.hrtime.bigint();
        let results = [];
        let cachedCode = null;
        let cachedTimeStep = -1;
        let cryptoOperations = 0;
        
        for (let i = 0; i < iterations; i++) {
            const now = Date.now();
            const currentTimeStep = this.totp.getCurrentTimeStep(now);
            
            // Only recalculate if we're in a new time period
            if (currentTimeStep !== cachedTimeStep) {
                cachedCode = this.totp.generateTOTP(now);
                cachedTimeStep = currentTimeStep;
                cryptoOperations++;
            }
            
            results.push(cachedCode);
        }
        
        const end = process.hrtime.bigint();
        const duration = Number(end - start) / 1000000; // Convert to milliseconds
        
        return {
            approach: 'Efficient (cache per time period)',
            iterations,
            duration: duration.toFixed(2),
            averagePerCall: (duration / iterations).toFixed(4),
            cryptoOperations // Only when time period changes
        };
    }

    runComparison() {
        console.log('🚀 TOTP Performance Comparison\n');
        console.log('Running 1000 iterations of TOTP generation...\n');
        
        const inefficient = this.inefficientApproach(1000);
        const efficient = this.efficientApproach(1000);
        
        console.log('📊 Results:');
        console.log('════════════════════════════════════════════════════════');
        console.log(`❌ ${inefficient.approach}`);
        console.log(`   Total time: ${inefficient.duration}ms`);
        console.log(`   Average per call: ${inefficient.averagePerCall}ms`);
        console.log(`   Crypto operations: ${inefficient.cryptoOperations}`);
        console.log('');
        console.log(`✅ ${efficient.approach}`);
        console.log(`   Total time: ${efficient.duration}ms`);
        console.log(`   Average per call: ${efficient.averagePerCall}ms`);
        console.log(`   Crypto operations: ${efficient.cryptoOperations}`);
        console.log('');
        
        const speedup = (parseFloat(inefficient.duration) / parseFloat(efficient.duration)).toFixed(1);
        const cryptoReduction = ((inefficient.cryptoOperations - efficient.cryptoOperations) / inefficient.cryptoOperations * 100).toFixed(1);
        
        console.log(`🎯 Performance Improvement:`);
        console.log(`   Speed improvement: ${speedup}x faster`);
        console.log(`   Crypto operations reduced: ${cryptoReduction}%`);
        console.log(`   Memory efficiency: Better (no redundant calculations)`);
        console.log('════════════════════════════════════════════════════════');
        
        this.printBestPractices();
    }

    printBestPractices() {
        console.log(`
📋 Best Practices Summary:

🏠 CLIENT-SIDE (Browser/Mobile App):
   ✅ Cache TOTP code per time period
   ✅ Update countdown timer independently  
   ✅ Recalculate only when period expires
   ✅ Use Web Workers for crypto operations (if needed)

🖥️  SERVER-SIDE (API/Backend):
   ✅ Generate TOTP on-demand for verification
   ✅ Cache codes with time-step as key
   ✅ Return code + remaining time to client
   ✅ Let client handle real-time display

⚡ REAL-TIME DISPLAYS:
   ✅ Calculate TOTP once per ${this.totp.period}-second period
   ✅ Update remaining time every second
   ✅ Use efficient timers (don't create new ones)
   ✅ Clear intervals on component unmount

🔐 SECURITY CONSIDERATIONS:
   ✅ Never cache secrets in localStorage
   ✅ Use secure random for secret generation
   ✅ Implement proper clock skew tolerance
   ✅ Rate limit TOTP verification attempts

Example efficient React component:
\`\`\`jsx
const TOTPDisplay = ({ secret }) => {
  const [totp, setTotp] = useState('');
  const [remaining, setRemaining] = useState(0);
  
  useEffect(() => {
    let lastTimeStep = -1;
    
    const update = () => {
      const now = Date.now();
      const timeStep = Math.floor(now / 1000 / 30);
      
      // Only recalculate TOTP when period changes
      if (timeStep !== lastTimeStep) {
        setTotp(generateTOTP(secret, now));
        lastTimeStep = timeStep;
      }
      
      // Always update remaining time
      const nextPeriod = (timeStep + 1) * 30;
      setRemaining(nextPeriod - Math.floor(now / 1000));
    };
    
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [secret]);
  
  return <div>{totp} ({remaining}s)</div>;
};
\`\`\`
`);
    }
}

// Run the performance test
const test = new PerformanceTest();
test.runComparison();