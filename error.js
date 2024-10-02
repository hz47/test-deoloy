// Define the backend endpoint to send error data
const scriptTag = document.getElementById('errorHandler');
const errorEndpoint = scriptTag.getAttribute('data-error-endpoint');

// Buffer to hold error messages
const errorBuffer = [];
const bufferLimit = 10; // Maximum number of errors to buffer before sending
const debounceTime = 2000; // Time in milliseconds to wait before sending errors

// Function to send error data to the backend
function sendErrorToBackend(data) {
    if (navigator.sendBeacon) {
        // Send data using sendBeacon for better performance
        navigator.sendBeacon(errorEndpoint, JSON.stringify(data));
    } else {
        // Fallback to fetch for browsers that don't support sendBeacon
        fetch(errorEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).catch((error) => {
            console.error('Error sending to backend:', error);
        });
    }
}

// Function to flush the error buffer
function flushErrorBuffer() {
    if (errorBuffer.length > 0) {
        const dataToSend = {
             "name": "milos",
            "message": errorBuffer.splice(0, bufferLimit)
            "source": "error"
         };
        sendErrorToBackend(dataToSend);
    }
}

// Debounce function to limit how often errors are sent
let debounceTimer;
function debounceSendErrors() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(flushErrorBuffer, debounceTime);
}

// Error handler for window errors
function handleWindowError(event) {
    const errorData = {
        type: 'error',
        message: event.message,
        source: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        timestamp: new Date().toISOString(),
    };
    errorBuffer.push(errorData);
    debounceSendErrors();
}

// Error handler for unhandled promise rejections
function handleUnhandledRejection(event) {
    const errorData = {
        type: 'unhandledrejection',
        message: event.reason ? event.reason.toString() : 'Unknown reason',
        timestamp: new Date().toISOString(),
    };
    errorBuffer.push(errorData);
    debounceSendErrors();
}

// Error handler for security policy violations
function handleSecurityPolicyViolation(event) {
    const errorData = {
        type: 'securitypolicyviolation',
        message: event.violatedDirective,
        timestamp: new Date().toISOString(),
    };
    errorBuffer.push(errorData);
    debounceSendErrors();
}

// Override console.error to capture logged errors
const originalConsoleError = console.error;
console.error = function (...args) {
    const errorData = {
        type: 'consoleError',
        message: args.join(' '),
        timestamp: new Date().toISOString(),
    };
    errorBuffer.push(errorData);
    debounceSendErrors();
    originalConsoleError.apply(console, args); // Call the original console.error
};

// Add event listeners for various error types
window.addEventListener('error', handleWindowError, true);
window.addEventListener('unhandledrejection', handleUnhandledRejection);
window.addEventListener('securitypolicyviolation', handleSecurityPolicyViolation);
