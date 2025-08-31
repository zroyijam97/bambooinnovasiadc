#!/usr/bin/env node

/**
 * Delete All VCards Script
 * Removes all VCards from the database
 */

const http = require('http');
const { URL } = require('url');

// Configuration
const BACKEND_URL = 'http://localhost:8001';
const API_BASE = `${BACKEND_URL}/api/v1/vcards`;

// Utility function to make HTTP requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = http;
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || 80,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    const req = client.request(requestOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = {
            status: res.statusCode,
            headers: res.headers,
            data: data ? JSON.parse(data) : null
          };
          resolve(result);
        } catch (error) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data
          });
        }
      });
    });

    req.on('error', reject);
    
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    
    req.end();
  });
}

class VCardCleaner {
  constructor() {
    this.authToken = null;
  }

  log(message, type = 'INFO') {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${type}] ${message}`);
  }

  async authenticate() {
    this.log('Authenticating with test user...');
    
    // Create or login test user
    const authData = {
      email: 'robotester@bambooinnovasia.com',
      password: 'TestPassword123!'
    };

    try {
      // Try to register first
      const registerResponse = await makeRequest(`${BACKEND_URL}/api/v1/auth/register`, {
        method: 'POST',
        body: authData
      });

      if (registerResponse.status === 201 || registerResponse.status === 409) {
        // Registration successful or user already exists, now login
        const loginResponse = await makeRequest(`${BACKEND_URL}/api/v1/auth/login`, {
          method: 'POST',
          body: authData
        });

        if (loginResponse.status === 200 && loginResponse.data?.access_token) {
          this.authToken = loginResponse.data.access_token;
          this.log('Authentication successful');
          return true;
        }
      }
    } catch (error) {
      this.log(`Authentication error: ${error.message}`, 'ERROR');
    }

    return false;
  }

  async listAllVCards() {
    this.log('Fetching all VCards...');
    
    try {
      const response = await makeRequest(API_BASE, {
        headers: {
          'Authorization': `Bearer ${this.authToken}`
        }
      });

      if (response.status === 200) {
        this.log(`Found ${response.data.length} VCards`);
        return response.data;
      } else {
        this.log(`Failed to fetch VCards: ${response.status}`, 'ERROR');
        return [];
      }
    } catch (error) {
      this.log(`Error fetching VCards: ${error.message}`, 'ERROR');
      return [];
    }
  }

  async deleteVCard(vcardId, name) {
    this.log(`Deleting VCard: ${name} (${vcardId})`);
    
    try {
      const response = await makeRequest(`${API_BASE}/${vcardId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.authToken}`
        }
      });

      if (response.status === 200 || response.status === 204) {
        this.log(`Successfully deleted: ${name}`);
        return true;
      } else {
        this.log(`Failed to delete ${name}: ${response.status}`, 'ERROR');
        return false;
      }
    } catch (error) {
      this.log(`Error deleting ${name}: ${error.message}`, 'ERROR');
      return false;
    }
  }

  async deleteAllVCards() {
    this.log('Starting VCard cleanup process...');
    
    // Authenticate first
    const authenticated = await this.authenticate();
    if (!authenticated) {
      this.log('Authentication failed, cannot proceed', 'ERROR');
      return;
    }

    // Get all VCards
    const vcards = await this.listAllVCards();
    
    if (vcards.length === 0) {
      this.log('No VCards found to delete');
      return;
    }

    // Delete each VCard
    let deletedCount = 0;
    for (const vcard of vcards) {
      const success = await this.deleteVCard(vcard.id, vcard.name || vcard.slug);
      if (success) {
        deletedCount++;
      }
      // Small delay between deletions
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    this.log(`Cleanup complete. Deleted ${deletedCount} out of ${vcards.length} VCards`);
    
    // Also clean up any generated HTML files
    this.log('Cleaning up generated HTML files...');
    const fs = require('fs');
    const path = require('path');
    
    try {
      const htmlDir = path.join(__dirname, 'apps', 'web', 'public', 'hi');
      if (fs.existsSync(htmlDir)) {
        const files = fs.readdirSync(htmlDir);
        for (const file of files) {
          if (file.endsWith('.html')) {
            fs.unlinkSync(path.join(htmlDir, file));
            this.log(`Deleted HTML file: ${file}`);
          }
        }
      }
    } catch (error) {
      this.log(`Error cleaning HTML files: ${error.message}`, 'WARN');
    }
  }
}

// Run the cleaner
if (require.main === module) {
  const cleaner = new VCardCleaner();
  cleaner.deleteAllVCards().catch(error => {
    console.error('Cleanup failed:', error);
    process.exit(1);
  });
}

module.exports = VCardCleaner;