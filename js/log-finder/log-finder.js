const path = require('path')

const { log } = console;

[`debug`, `log`, `warn`, `error`, `table`, `dir`].forEach((methodName) => {
    const originalLoggingMethod = console[methodName];

    console[methodName] = (...args) => {
        const originalPrepareStackTrace = Error.prepareStackTrace;
        Error.prepareStackTrace = (_, stack) => stack;
        const callee = new Error().stack[1];
        Error.prepareStackTrace = originalPrepareStackTrace;
        const relativeFileName = path
            .relative(process.cwd(), callee.getFileName())
            .replace(process.cwd(), ``)
            .replace(`file:/`, ``);
    
        // Log in dark grey
        const label = `${relativeFileName}:${callee.getLineNumber()}`;
        log(label);
        originalLoggingMethod(...args)
    }
})