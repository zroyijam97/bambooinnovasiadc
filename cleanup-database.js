#!/usr/bin/env node

/**
 * Database Cleanup Script
 * Directly removes all VCards from the database using Prisma
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

class DatabaseCleaner {
  constructor() {
    this.prisma = new PrismaClient();
  }

  log(message, type = 'INFO') {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${type}] ${message}`);
  }

  async cleanupDatabase() {
    this.log('Starting database cleanup...');
    
    try {
      // Connect to database
      await this.prisma.$connect();
      this.log('Connected to database');

      // Get count of existing VCards
      const vcardCount = await this.prisma.vcard.count();
      this.log(`Found ${vcardCount} VCards in database`);

      if (vcardCount === 0) {
        this.log('No VCards to delete');
        return;
      }

      // Delete all related data first (due to foreign key constraints)
      this.log('Deleting testimonials...');
      const deletedTestimonials = await this.prisma.testimonial.deleteMany({});
      this.log(`Deleted ${deletedTestimonials.count} testimonials`);

      this.log('Deleting social links...');
      const deletedSocialLinks = await this.prisma.socialLink.deleteMany({});
      this.log(`Deleted ${deletedSocialLinks.count} social links`);

      this.log('Deleting services...');
      const deletedServices = await this.prisma.service.deleteMany({});
      this.log(`Deleted ${deletedServices.count} services`);

      this.log('Deleting VCards...');
      const deletedVCards = await this.prisma.vcard.deleteMany({});
      this.log(`Deleted ${deletedVCards.count} VCards`);

      // Also delete users if they were created for testing
      this.log('Deleting test users...');
      const deletedUsers = await this.prisma.user.deleteMany({
        where: {
          email: {
            contains: 'robotester'
          }
        }
      });
      this.log(`Deleted ${deletedUsers.count} test users`);

      this.log('Database cleanup completed successfully');

    } catch (error) {
      this.log(`Database cleanup error: ${error.message}`, 'ERROR');
      throw error;
    } finally {
      await this.prisma.$disconnect();
    }
  }

  async cleanupHTMLFiles() {
    this.log('Cleaning up generated HTML files...');
    
    try {
      const htmlDir = path.join(__dirname, 'apps', 'web', 'public', 'hi');
      
      if (fs.existsSync(htmlDir)) {
        const files = fs.readdirSync(htmlDir);
        let deletedCount = 0;
        
        for (const file of files) {
          if (file.endsWith('.html')) {
            fs.unlinkSync(path.join(htmlDir, file));
            this.log(`Deleted HTML file: ${file}`);
            deletedCount++;
          }
        }
        
        this.log(`Deleted ${deletedCount} HTML files`);
      } else {
        this.log('HTML directory does not exist');
      }
    } catch (error) {
      this.log(`Error cleaning HTML files: ${error.message}`, 'WARN');
    }
  }

  async cleanup() {
    try {
      await this.cleanupDatabase();
      await this.cleanupHTMLFiles();
      this.log('Complete cleanup finished successfully');
    } catch (error) {
      this.log(`Cleanup failed: ${error.message}`, 'ERROR');
      process.exit(1);
    }
  }
}

// Run the cleaner
if (require.main === module) {
  const cleaner = new DatabaseCleaner();
  cleaner.cleanup();
}

module.exports = DatabaseCleaner;