const https = require('https');
const url = require('url');

// set up rate limiting settings
const RATE_LIMIT = 100; // number of requests allowed
const RATE_LIMIT_WINDOW = 60000; // in milliseconds
let requestCounts = {}; // to track request counts

// Helper function to handle rate limiting
function checkRateLimit(clientId) {
    const now = Date.now();
    if (!requestCounts[clientId]) {
        requestCounts[clientId] = { count: 1, firstRequestTime: now };
    } else {
        requestCounts[clientId].count++;
        // reset count after time window
        if (now - requestCounts[clientId].firstRequestTime > RATE_LIMIT_WINDOW) {
            requestCounts[clientId] = { count: 1, firstRequestTime: now };
        }
    }
    return requestCounts[clientId].count <= RATE_LIMIT;
}

exports.handler = (event, context, callback) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (event.httpMethod === 'OPTIONS') {
        callback(null, { statusCode: 200, headers });
        return;
    }

    const requestBody = JSON.parse(event.body);
    const clientId = event.requestContext.identity.sourceIp;

    // Rate limiting check
    if (!checkRateLimit(clientId)) {
        callback(null, { statusCode: 429, headers, body: JSON.stringify({ message: 'Too Many Requests' }) });
        return;
    }

    // Input validation
    if (!requestBody || !requestBody.type || !requestBody.data) {
        callback(null, { statusCode: 400, headers, body: JSON.stringify({ message: 'Invalid request parameters' }) });
        return;
    }

    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
        callback(null, { statusCode: 500, headers, body: JSON.stringify({ message: 'Internal Server Error: Missing API Key' }) });
        return;
    }

    const geminiUrl = 'https://api.gemini.com/v1/flash';
    const requestData = JSON.stringify({ model: 'gemini-1.5-flash', ...requestBody });

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${geminiApiKey}`,
        },
    };

    const req = https.request(geminiUrl, options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
            callback(null, { statusCode: res.statusCode, headers, body: data });
        });
    });

    req.on('error', (error) => {
        console.error('Error with the API request:', error);
        callback(null, { statusCode: 500, headers, body: JSON.stringify({ message: 'Internal Server Error' }) });
    });

    req.write(requestData);
    req.end();
};