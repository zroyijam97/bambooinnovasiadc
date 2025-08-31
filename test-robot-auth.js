#!/usr/bin/env node

/**
 * Enhanced VCard Test Robot with Authentication
 * Tests VCard editing functionality with image uploads and proper authentication
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

// Configuration
const config = {
  FRONTEND_URL: 'http://localhost:3004',
  BACKEND_URL: 'http://localhost:8001',
  PUBLIC_API_BASE: 'http://localhost:8001/v',
  ROBOT_CARD: {
    name: 'Robot Tester Auth',
    title: 'Robot Tester Auth',
    bio: 'Automated testing robot with authentication',
    slug: 'robotester-auth-' + Math.floor(Math.random() * 10000),
    publishStatus: 'PUBLISHED',
    themeConfig: {
      color: '#3B82F6',
      backgroundColor: '#FFFFFF',
      textColor: '#1F2937'
    },
    fields: [
      {
        type: 'email',
        label: 'Email',
        value: 'robot@test.com',
        order: 1
      },
      {
        type: 'phone',
        label: 'Phone',
        value: '+1234567890',
        order: 2
      }
    ]
  },
  // Test user credentials
  TEST_USER: {
    id: 'test-user-id', // Match the hardcoded ID in frontend API
    email: 'test-frontend@example.com', // Match the hardcoded email in frontend API
    name: 'Test User Frontend', // Match the hardcoded name in frontend API
    password: 'test123456'
  }
};

// Sample base64 images for testing
const TEST_IMAGES = {
  // Small 1x1 PNG (red pixel)
  PNG: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
  // Small 1x1 JPEG (blue pixel)
  JPEG: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A8A'
};

// Utility function to make HTTP requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'VCard-Test-Robot/1.0',
        ...options.headers
      }
    };

    if (options.body) {
      const bodyString = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
      requestOptions.headers['Content-Length'] = Buffer.byteLength(bodyString);
    }

    const req = client.request(requestOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = data ? JSON.parse(data) : {};
          resolve({ status: res.statusCode, data: jsonData, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, data: data, headers: res.headers });
        }
      });
    });

    req.on('error', reject);
    
    if (options.body) {
      const bodyString = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
      req.write(bodyString);
    }
    
    req.end();
  });
}

// Enhanced VCard Test Robot with Authentication
class AuthenticatedVCardTestRobot {
  constructor() {
    this.createdCardId = null;
    this.createdCardSlug = null;
    this.accessToken = null;
    this.testResults = {
      passed: 0,
      failed: 0,
      tests: []
    };
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = {
      'info': 'ℹ️',
      'success': '✅',
      'error': '❌',
      'warning': '⚠️'
    }[type] || 'ℹ️';
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async registerTestUser() {
    this.log('👤 Registering test user...');
    
    try {
      const response = await makeRequest(`${config.BACKEND_URL}/api/v1/auth/register`, {
        method: 'POST',
        body: {
          email: config.TEST_USER.email,
          name: config.TEST_USER.name,
          password: config.TEST_USER.password
        }
      });

      if (response.status === 201 || response.status === 409) { // 409 = user already exists
        this.log('✅ Test user registered/exists', 'success');
        return true;
      } else {
        this.log(`❌ User registration failed with status ${response.status}`, 'error');
        this.log(`📄 Response: ${JSON.stringify(response.data)}`);
        return false;
      }
    } catch (error) {
      this.log(`❌ User registration error: ${error.message}`, 'error');
      return false;
    }
  }

  async loginTestUser() {
    this.log('🔐 Syncing test user with backend...');
    
    try {
      // Use the sync endpoint which creates user and organization
      const response = await makeRequest(`${config.BACKEND_URL}/api/v1/auth/sync`, {
        method: 'POST',
        body: {
          id: config.TEST_USER.id,
          email: config.TEST_USER.email,
          name: config.TEST_USER.name,
          password: config.TEST_USER.password,
          emailVerified: true
        }
      });

      if (response.status === 200 || response.status === 201) {
        this.accessToken = response.data.access_token;
        this.organizationId = response.data.organizationId;
        this.log('✅ User sync successful', 'success');
        this.log(`🔑 Access token obtained: ${this.accessToken ? 'Yes' : 'No'}`);
        this.log(`🏢 Organization ID: ${this.organizationId}`);
        return true;
      } else {
        this.log(`❌ User sync failed with status ${response.status}`, 'error');
        this.log(`📄 Response: ${JSON.stringify(response.data)}`);
        return false;
      }
    } catch (error) {
      this.log(`❌ User sync error: ${error.message}`, 'error');
      return false;
    }
  }

  async testCardCreation() {
    this.log('🆕 Testing Card Creation...');
    this.log('📤 Sending POST request to create VCard...');
    
    try {
      const response = await makeRequest(`${config.FRONTEND_URL}/api/vcards`, {
        method: 'POST',
        body: config.ROBOT_CARD
      });

      if (response.status === 200 || response.status === 201) {
        this.createdCardId = response.data.id;
        this.createdCardSlug = response.data.slug;
        this.log(`✅ Card created successfully with ID: ${this.createdCardId}`, 'success');
        this.log(`🔗 Card slug: ${this.createdCardSlug}`);
        return { success: true, cardId: this.createdCardId, slug: this.createdCardSlug };
      } else {
        this.log(`❌ Card creation failed with status ${response.status}`, 'error');
        this.log(`📄 Response: ${JSON.stringify(response.data)}`);
        return { success: false, error: response.data };
      }
    } catch (error) {
      this.log(`❌ Card creation error: ${error.message}`, 'error');
      return { success: false, error: error.message };
    }
  }

  async testCardViewing() {
    if (!this.createdCardSlug) {
      this.log('❌ No card slug available for viewing test', 'error');
      return { success: false, error: 'No card slug available' };
    }

    this.log('👀 Testing Card Viewing...');
    this.log(`🔍 Fetching card with slug: ${this.createdCardSlug}`);
    
    try {
      const response = await makeRequest(`${config.PUBLIC_API_BASE}/${this.createdCardSlug}`);

      if (response.status === 200) {
        this.log('✅ Card viewing successful', 'success');
        this.log(`📄 Card title: ${response.data.title}`);
        return { success: true, data: response.data };
      } else {
        this.log(`❌ Card viewing failed with status ${response.status}`, 'error');
        return { success: false, error: response.data };
      }
    } catch (error) {
      this.log(`❌ Card viewing error: ${error.message}`, 'error');
      return { success: false, error: error.message };
    }
  }

  async testCardEditingWithImage() {
    if (!this.createdCardId) {
      this.log('❌ No card ID available for editing test', 'error');
      return { success: false, error: 'No card ID available' };
    }

    if (!this.accessToken) {
      this.log('❌ No access token available for authenticated editing', 'error');
      return { success: false, error: 'No access token available' };
    }

    this.log('✏️🖼️ Testing Card Editing with Image Upload...');
    this.log('📤 Sending PATCH request with image data...');
    
    const editData = {
      name: 'Robot Tester Auth - Updated',
      title: 'Robot Tester Auth - Updated',
      bio: 'Updated bio with image upload test',
      avatar: TEST_IMAGES.PNG, // Add profile photo (correct field name)
      themeConfig: {
        ...config.ROBOT_CARD.themeConfig,
        color: '#10B981' // Change color to green
      }
    };
    
    try {
      const response = await makeRequest(`${config.BACKEND_URL}/api/v1/vcards/${this.createdCardId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: editData
      });

      if (response.status === 200) {
        this.log('✅ Card editing with image successful', 'success');
        this.log(`📄 Updated title: ${response.data.title}`);
        return { success: true, data: response.data };
      } else {
        this.log(`❌ Card editing failed with status ${response.status}`, 'error');
        this.log(`📄 Response: ${JSON.stringify(response.data)}`);
        return { success: false, error: response.data };
      }
    } catch (error) {
      this.log(`❌ Card editing error: ${error.message}`, 'error');
      return { success: false, error: error.message };
    }
  }

  async testImageFormats() {
    if (!this.createdCardId || !this.accessToken) {
      this.log('❌ No card ID or access token available for image format testing', 'error');
      return { success: false, error: 'Missing card ID or access token' };
    }

    this.log('🎨 Testing Different Image Formats...');
    
    const formats = ['PNG', 'JPEG'];
    const results = [];
    
    for (const format of formats) {
      this.log(`🖼️ Testing ${format} format...`);
      
      const editData = {
        avatar: TEST_IMAGES[format]
      };
      
      try {
        const response = await makeRequest(`${config.BACKEND_URL}/api/v1/vcards/${this.createdCardId}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: editData
        });

        if (response.status === 200) {
          this.log(`✅ ${format} format upload successful`, 'success');
          results.push({ format, success: true });
        } else {
          this.log(`❌ ${format} format upload failed with status ${response.status}`, 'error');
          results.push({ format, success: false, error: response.data });
        }
      } catch (error) {
        this.log(`❌ ${format} format upload error: ${error.message}`, 'error');
        results.push({ format, success: false, error: error.message });
      }
      
      await this.sleep(500); // Small delay between requests
    }
    
    const allSuccessful = results.every(r => r.success);
    return { success: allSuccessful, results };
  }

  recordTestResult(testName, result) {
    this.testResults.tests.push({ name: testName, ...result });
    if (result.success) {
      this.testResults.passed++;
      this.log(`✅ Test '${testName}' PASSED`, 'success');
    } else {
      this.testResults.failed++;
      this.log(`❌ Test '${testName}' FAILED`, 'error');
    }
  }

  async runAllTests() {
    this.log('🤖 Starting Enhanced VCard Test Robot with Authentication...');
    this.log('============================================================');
    
    // Test 1: User Registration
    this.log('\n==================================================');
    this.log('🧪 Running Test: User Registration');
    this.log('==================================================');
    const registrationResult = await this.registerTestUser();
    this.recordTestResult('User Registration', { success: registrationResult });
    await this.sleep(2000);
    
    // Test 2: User Sync
    this.log('\n==================================================');
    this.log('🧪 Running Test: User Sync');
    this.log('==================================================');
    const loginResult = await this.loginTestUser();
    this.recordTestResult('User Sync', { success: loginResult });
    await this.sleep(2000);
    
    // Test 3: Card Creation
    this.log('\n==================================================');
    this.log('🧪 Running Test: Card Creation');
    this.log('==================================================');
    const creationResult = await this.testCardCreation();
    this.recordTestResult('Card Creation', creationResult);
    await this.sleep(2000);
    
    // Test 4: Card Viewing
    this.log('\n==================================================');
    this.log('🧪 Running Test: Card Viewing');
    this.log('==================================================');
    const viewingResult = await this.testCardViewing();
    this.recordTestResult('Card Viewing', viewingResult);
    await this.sleep(2000);
    
    // Test 5: Card Editing with Image (only if we have authentication)
    this.log(`\n🔍 Debug: accessToken=${!!this.accessToken}, createdCardId=${!!this.createdCardId}`);
    if (this.accessToken && this.createdCardId) {
      this.log('\n✅ Proceeding with authenticated tests...', 'success');
      this.log('\n==================================================');
      this.log('🧪 Running Test: Card Editing with Image');
      this.log('==================================================');
      const editingResult = await this.testCardEditingWithImage();
      this.recordTestResult('Card Editing with Image', editingResult);
      await this.sleep(2000);
      
      // Test 6: Image Format Testing
      this.log('\n==================================================');
      this.log('🧪 Running Test: Image Format Testing');
      this.log('==================================================');
      const formatResult = await this.testImageFormats();
      this.recordTestResult('Image Format Testing', formatResult);
      await this.sleep(2000);
    } else {
      this.log('⚠️ Skipping authenticated tests due to missing token or card ID', 'warning');
    }
    
    // Summary
    this.log('\n============================================================');
    this.log('📊 TEST SUMMARY');
    this.log('============================================================');
    this.log(`✅ Passed: ${this.testResults.passed}/${this.testResults.tests.length}`);
    this.log(`❌ Failed: ${this.testResults.failed}/${this.testResults.tests.length}`);
    
    const successRate = (this.testResults.passed / this.testResults.tests.length * 100).toFixed(1);
    this.log(`📈 Success Rate: ${successRate}%`);
    
    if (this.testResults.failed > 0) {
      this.log('⚠️ Some tests failed. Please review the results above.', 'warning');
    } else {
      this.log('🎉 All tests passed successfully!', 'success');
    }
    
    this.log('🤖 Enhanced Test Robot with Authentication execution completed.');
    
    if (this.createdCardId && this.createdCardSlug) {
      this.log('\n📋 Created Card Info:');
      this.log(`   ID: ${this.createdCardId}`);
      this.log(`   Slug: ${this.createdCardSlug}`);
      this.log(`   Public URL: ${config.FRONTEND_URL}/hi/${this.createdCardSlug}`);
    }
    
    return this.testResults;
  }
}

// Run the test robot
if (require.main === module) {
  const robot = new AuthenticatedVCardTestRobot();
  robot.runAllTests().catch(error => {
    console.error('❌ Test robot crashed:', error);
    process.exit(1);
  });
}

module.exports = AuthenticatedVCardTestRobot;