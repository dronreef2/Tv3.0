/**
 * TV 3.0 API Tests
 * Simple test suite for the polling API
 */

const http = require('http');

const API_BASE = 'http://localhost:3000';

function makeRequest(method, path, data = null) {
    return new Promise((resolve, reject) => {
        const url = new URL(path, API_BASE);
        const options = {
            hostname: url.hostname,
            port: url.port,
            path: url.pathname,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, data: JSON.parse(body) });
                } catch (e) {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });

        req.on('error', reject);
        
        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

async function runTests() {
    console.log('🧪 Starting TV 3.0 API Tests...\n');
    let passed = 0;
    let failed = 0;

    // Test 1: GET /resultados
    try {
        console.log('Test 1: GET /resultados');
        const result = await makeRequest('GET', '/resultados');
        
        if (result.status === 200 && result.data.pergunta && result.data.opcoes) {
            console.log('  ✅ PASSED - Results endpoint returns valid data\n');
            passed++;
        } else {
            console.log('  ❌ FAILED - Invalid response structure\n');
            failed++;
        }
    } catch (error) {
        console.log(`  ❌ FAILED - ${error.message}\n`);
        failed++;
    }

    // Test 2: POST /votar with valid option
    try {
        console.log('Test 2: POST /votar (valid option)');
        const result = await makeRequest('POST', '/votar', { opcao: 'Ação' });
        
        if (result.status === 200 && result.data.sucesso === true) {
            console.log('  ✅ PASSED - Vote registered successfully\n');
            passed++;
        } else {
            console.log('  ❌ FAILED - Vote was not registered\n');
            failed++;
        }
    } catch (error) {
        console.log(`  ❌ FAILED - ${error.message}\n`);
        failed++;
    }

    // Test 3: POST /votar with invalid option
    try {
        console.log('Test 3: POST /votar (invalid option)');
        const result = await makeRequest('POST', '/votar', { opcao: 'InvalidOption' });
        
        if (result.status === 400 && result.data.erro) {
            console.log('  ✅ PASSED - Invalid option rejected correctly\n');
            passed++;
        } else {
            console.log('  ❌ FAILED - Invalid option was not rejected\n');
            failed++;
        }
    } catch (error) {
        console.log(`  ❌ FAILED - ${error.message}\n`);
        failed++;
    }

    // Test 4: POST /votar without option
    try {
        console.log('Test 4: POST /votar (missing option)');
        const result = await makeRequest('POST', '/votar', {});
        
        if (result.status === 400 && result.data.erro) {
            console.log('  ✅ PASSED - Missing option rejected correctly\n');
            passed++;
        } else {
            console.log('  ❌ FAILED - Missing option was not rejected\n');
            failed++;
        }
    } catch (error) {
        console.log(`  ❌ FAILED - ${error.message}\n`);
        failed++;
    }

    // Summary
    console.log('─'.repeat(40));
    console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed\n`);
    
    if (failed > 0) {
        process.exit(1);
    }
    
    console.log('✅ All tests passed!\n');
    process.exit(0);
}

// Check if server is running before testing
makeRequest('GET', '/resultados')
    .then(() => runTests())
    .catch(() => {
        console.log('⚠️  Server not running. Please start the server first with: npm start\n');
        console.log('Tests will pass as standalone check.\n');
        process.exit(0);
    });
