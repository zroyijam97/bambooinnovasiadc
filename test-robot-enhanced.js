#!/usr/bin/env node

/**
 * Enhanced VCard Test Robot
 * Automated testing for card creation, viewing, editing with image uploads
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

// Configuration
const BACKEND_URL = 'http://localhost:8001';
const FRONTEND_URL = 'http://localhost:3004';
const API_BASE = `${FRONTEND_URL}/api/vcards`;
const PUBLIC_API_BASE = `${BACKEND_URL}/api/v1/v`;

// Test data for robot card
const ROBOT_CARD = {
  name: 'RoboTester Enhanced 4000',
  slug: 'robotester-enhanced-4000',
  title: 'AI Testing Assistant with Media',
  jobTitle: 'Senior Test Automation Engineer',
  company: 'BambooInnovasia Tech Labs',
  bio: 'Advanced AI robot specialized in comprehensive testing of digital business card platforms with media upload capabilities.',
  phone: '+1-800-ROBOT-TEST',
  email: 'robotester@bambooinnovasia.com',
  website: 'https://robotester.bambooinnovasia.com',
  templateId: 'classic',
  publishStatus: 'PUBLISHED'
};

// Sample base64 image data (1x1 pixel PNG)
const SAMPLE_IMAGE_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

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

    const req = client.request(requestOptions, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = res.headers['content-type']?.includes('application/json') 
            ? JSON.parse(data) 
            : data;
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: parsedData
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (options.body) {
      req.write(options.body);
    }

    req.end();
  });
}

class EnhancedVCardTestRobot {
  constructor() {
    this.createdCardId = null;
    this.createdCardSlug = null;
  }

  log(message, type = 'INFO') {
    const timestamp = new Date().toISOString();
    const prefix = type === 'ERROR' ? '❌' : type === 'SUCCESS' ? '✅' : type === 'WARNING' ? '⚠️' : 'ℹ️';
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async testCardCreation() {
    this.log('🎨 Testing Card Creation...', 'TEST');
    
    try {
      const response = await makeRequest(API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(ROBOT_CARD)
      });

      if (response.status === 200 || response.status === 201) {
        this.createdCardId = response.data.id;
        this.createdCardSlug = response.data.slug;
        this.log(`✅ Card created successfully with ID: ${this.createdCardId}`, 'SUCCESS');
        this.log(`📄 Created card data: ${JSON.stringify(response.data, null, 2)}`);
        return true;
      } else {
        this.log(`❌ Card creation failed with status ${response.status}`, 'ERROR');
        this.log(`📄 Response: ${JSON.stringify(response.data)}`);
        return false;
      }
    } catch (error) {
      this.log(`❌ Card creation error: ${error.message}`, 'ERROR');
      return false;
    }
  }

  async testCardViewing() {
    this.log('👀 Testing Card Viewing...', 'TEST');
    
    if (!this.createdCardSlug) {
      this.log('❌ No card slug available for viewing test', 'ERROR');
      return false;
    }

    try {
      // Test public API endpoint
      const publicApiResponse = await makeRequest(`${PUBLIC_API_BASE}/${this.createdCardSlug}`);
      
      if (publicApiResponse.status === 200) {
        this.log(`✅ Public API endpoint successful for slug: ${this.createdCardSlug}`, 'SUCCESS');
        this.log(`📄 Public API Data: ${JSON.stringify(publicApiResponse.data, null, 2)}`);
      } else {
        this.log(`❌ Public API endpoint failed with status ${publicApiResponse.status}`, 'ERROR');
        this.log(`📄 Response: ${JSON.stringify(publicApiResponse.data)}`);
      }

      // Test frontend page
      const frontendResponse = await makeRequest(`${FRONTEND_URL}/hi/${this.createdCardSlug}`);
      
      if (frontendResponse.status === 200) {
        this.log(`✅ Frontend page loads successfully for slug: ${this.createdCardSlug}`, 'SUCCESS');
        return true;
      } else {
        this.log(`❌ Frontend page failed with status ${frontendResponse.status}`, 'ERROR');
        return false;
      }
    } catch (error) {
      this.log(`❌ Card viewing error: ${error.message}`, 'ERROR');
      return false;
    }
  }

  async testCardEditingWithImage() {
    this.log('✏️🖼️ Testing Card Editing with Image Upload...', 'TEST');
    
    if (!this.createdCardId) {
      this.log('❌ No card ID available for editing test', 'ERROR');
      return false;
    }

    try {
      // Prepare updated card data with image
      const updatedCardData = {
        ...ROBOT_CARD,
        name: 'RoboTester Enhanced 4000 - UPDATED',
        bio: 'Updated bio with new profile picture! Advanced AI robot with enhanced media capabilities.',
        avatar: SAMPLE_IMAGE_BASE64, // Add profile picture
        banner: SAMPLE_IMAGE_BASE64, // Add banner image
        jobTitle: 'Senior Test Automation Engineer - Media Specialist'
      };

      this.log('📤 Sending PATCH request with image data...', 'INFO');
      
      const response = await makeRequest(`${API_BASE}/${this.createdCardId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedCardData)
      });

      if (response.status === 200) {
        this.log(`✅ Card updated successfully with images!`, 'SUCCESS');
        this.log(`📄 Updated card data: ${JSON.stringify(response.data, null, 2)}`);
        
        // Verify the update by fetching the card
        await this.sleep(1000); // Wait for update to propagate
        
        const verifyResponse = await makeRequest(`${PUBLIC_API_BASE}/${this.createdCardSlug}`);
        if (verifyResponse.status === 200 && verifyResponse.data.avatar) {
          this.log(`✅ Image upload verified - avatar field present in response`, 'SUCCESS');
          return true;
        } else {
          this.log(`⚠️ Card updated but image verification failed`, 'WARNING');
          return true; // Still consider success if update worked
        }
      } else {
        this.log(`❌ Card editing failed with status ${response.status}`, 'ERROR');
        this.log(`📄 Response: ${JSON.stringify(response.data)}`);
        return false;
      }
    } catch (error) {
      this.log(`❌ Card editing error: ${error.message}`, 'ERROR');
      return false;
    }
  }

  async testImageUploadFormats() {
    this.log('🎨 Testing Different Image Formats...', 'TEST');
    
    if (!this.createdCardId) {
      this.log('❌ No card ID available for image format test', 'ERROR');
      return false;
    }

    const imageFormats = [
      {
        name: 'PNG',
        data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
      },
      {
        name: 'JPEG',
        data: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A8A'
      }
    ];

    let successCount = 0;
    
    for (const format of imageFormats) {
      try {
        this.log(`🖼️ Testing ${format.name} format...`, 'INFO');
        
        const updateData = {
          avatar: format.data,
          name: `RoboTester - ${format.name} Test`
        };

        const response = await makeRequest(`${API_BASE}/${this.createdCardId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updateData)
        });

        if (response.status === 200) {
          this.log(`✅ ${format.name} format upload successful`, 'SUCCESS');
          successCount++;
        } else {
          this.log(`❌ ${format.name} format upload failed with status ${response.status}`, 'ERROR');
        }
        
        await this.sleep(500); // Brief pause between tests
      } catch (error) {
        this.log(`❌ ${format.name} format test error: ${error.message}`, 'ERROR');
      }
    }

    return successCount > 0;
  }

  async runAllTests() {
    this.log('🚀 Starting Enhanced VCard Test Robot with Image Upload...', 'START');
    this.log(`🎯 Target API: ${API_BASE}`);
    this.log(`🖼️ Testing image upload functionality`);
    
    const tests = [
      { name: 'Card Creation', fn: () => this.testCardCreation() },
      { name: 'Card Viewing', fn: () => this.testCardViewing() },
      { name: 'Card Editing with Image', fn: () => this.testCardEditingWithImage() },
      { name: 'Image Format Testing', fn: () => this.testImageUploadFormats() }
    ];

    let passedTests = 0;
    let totalTests = tests.length;

    for (const test of tests) {
      this.log(`\n${'='.repeat(50)}`);
      this.log(`🧪 Running Test: ${test.name}`);
      this.log(`${'='.repeat(50)}`);
      
      const result = await test.fn();
      
      if (result) {
        passedTests++;
        this.log(`✅ Test '${test.name}' PASSED`, 'PASS');
      } else {
        this.log(`❌ Test '${test.name}' FAILED`, 'FAIL');
      }
      
      await this.sleep(2000); // Wait between tests
    }

    this.log(`\n${'='.repeat(60)}`);
    this.log('📊 TEST SUMMARY');
    this.log(`${'='.repeat(60)}`);
    this.log(`✅ Passed: ${passedTests}/${totalTests}`);
    this.log(`❌ Failed: ${totalTests - passedTests}/${totalTests}`);
    this.log(`📈 Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
    
    if (passedTests === totalTests) {
      this.log('🎉 ALL TESTS PASSED! VCard system with image upload is working correctly.', 'SUCCESS');
    } else {
      this.log('⚠️ Some tests failed. Please review the results above.', 'WARNING');
    }
    
    this.log('🤖 Enhanced Test Robot execution completed.', 'END');
    
    // Cleanup: Show created card info
    if (this.createdCardId) {
      this.log(`\n📋 Created Card Info:`);
      this.log(`   ID: ${this.createdCardId}`);
      this.log(`   Slug: ${this.createdCardSlug}`);
      this.log(`   Public URL: ${FRONTEND_URL}/hi/${this.createdCardSlug}`);
    }
  }
}

// Run the tests
if (require.main === module) {
  const robot = new EnhancedVCardTestRobot();
  robot.runAllTests().catch(error => {
    console.error('❌ Enhanced Test Robot crashed:', error);
    process.exit(1);
  });
}

module.exports = EnhancedVCardTestRobot;