const http = require('http');

const TARGET_URL = 'http://localhost:3001/api/products'; // Hitting Gateway URL
const REQUESTS_TO_SEND = 150;
const results = {
  success: 0,
  rate_limited: 0,
  failed: 0
};

console.log(`🚀 Starting DDoS / Rate Limiting Simulation Test...`);
console.log(`🎯 Target: ${TARGET_URL}`);
console.log(`📦 Simulating ${REQUESTS_TO_SEND} rapid requests...`);

let completed = 0;

function sendRequest(id) {
  return new Promise((resolve) => {
    http.get(TARGET_URL, (res) => {
      if (res.statusCode === 200) {
        results.success++;
      } else if (res.statusCode === 429) {
        results.rate_limited++;
      } else {
        results.failed++;
      }
      
      res.on('data', () => {}); // Consume data
      res.on('end', () => {
        completed++;
        if (completed === REQUESTS_TO_SEND) {
          printResults();
        }
        resolve();
      });
    }).on('error', (err) => {
      results.failed++;
      completed++;
      if (completed === REQUESTS_TO_SEND) {
        printResults();
      }
      resolve();
    });
  });
}

function printResults() {
  console.log(`\n================================`);
  console.log(`📊 SIMULATION RESULTS`);
  console.log(`================================`);
  console.log(`✅ Success (200 OK):      ${results.success}`);
  console.log(`🛡️  Rate Limited (429):   ${results.rate_limited}`);
  console.log(`❌ Failed/Errors:         ${results.failed}`);
  console.log(`================================`);
  
  if (results.rate_limited > 0) {
    console.log(`\n🎉 AWESOME! Your Rate Limiter works perfectly! It blocked ${results.rate_limited} potential DDoS requests.`);
  } else {
    console.log(`\n⚠️ No requests were rate-limited. Ensure the Gateway is running with the rate limiter active.`);
  }
}

// Fire all requests at once (Simulating high concurrency)
for (let i = 0; i < REQUESTS_TO_SEND; i++) {
  sendRequest(i);
}
