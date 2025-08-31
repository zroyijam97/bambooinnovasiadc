const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

// Initialize Prisma client with the backend database URL
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_u43FtIHeAEnh@ep-morning-wave-adrevv5x-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
    }
  }
});

async function deleteAllVCards() {
  try {
    console.log('🔍 Connecting to database...');
    
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Get all VCards to see what we're deleting
    const allVCards = await prisma.vCard.findMany({
      select: {
        id: true,
        slug: true,
        title: true,
        name: true,
        createdAt: true
      }
    });
    
    console.log(`📊 Found ${allVCards.length} VCards to delete:`);
    allVCards.forEach((card, index) => {
      console.log(`   ${index + 1}. ${card.title || card.name} (${card.slug})`);
    });
    
    if (allVCards.length === 0) {
      console.log('✅ No VCards found to delete');
      return;
    }
    
    console.log('\n🗑️  Starting deletion process...');
    
    // Delete related data first (due to foreign key constraints)
    console.log('   Deleting testimonials...');
    const deletedTestimonials = await prisma.testimonial.deleteMany({});
    console.log(`   ✅ Deleted ${deletedTestimonials.count} testimonials`);
    
    console.log('   Deleting social links...');
    const deletedSocialLinks = await prisma.socialLink.deleteMany({});
    console.log(`   ✅ Deleted ${deletedSocialLinks.count} social links`);
    
    console.log('   Deleting services...');
    const deletedServices = await prisma.service.deleteMany({});
    console.log(`   ✅ Deleted ${deletedServices.count} services`);
    
    console.log('   Deleting business hours...');
    const deletedBusinessHours = await prisma.businessHour.deleteMany({});
    console.log(`   ✅ Deleted ${deletedBusinessHours.count} business hours`);
    
    // Now delete the VCards
    console.log('   Deleting VCards...');
    const deletedVCards = await prisma.vCard.deleteMany({});
    console.log(`   ✅ Deleted ${deletedVCards.count} VCards`);
    
    // Clean up HTML files
    console.log('\n🧹 Cleaning up HTML files...');
    const htmlDir = path.join(__dirname, 'apps', 'web', 'public', 'hi');
    
    if (fs.existsSync(htmlDir)) {
      const files = fs.readdirSync(htmlDir);
      const htmlFiles = files.filter(file => file.endsWith('.html'));
      
      console.log(`   Found ${htmlFiles.length} HTML files to delete`);
      
      htmlFiles.forEach(file => {
        const filePath = path.join(htmlDir, file);
        fs.unlinkSync(filePath);
        console.log(`   ✅ Deleted ${file}`);
      });
    } else {
      console.log('   📁 HTML directory not found, skipping file cleanup');
    }
    
    console.log('\n🎉 All VCards and related data deleted successfully!');
    console.log('\n📈 Performance should be improved now. The dashboard was slow because:');
    console.log('   1. User sync was happening on every API call');
    console.log('   2. Heavy data loading with all related entities');
    console.log('   3. Multiple database queries per request');
    
  } catch (error) {
    console.error('❌ Error during deletion:', error);
    
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      console.log('\n💡 Database connection failed. This might be because:');
      console.log('   1. The database server is not running');
      console.log('   2. Network connectivity issues');
      console.log('   3. Incorrect database URL');
      console.log('\n🔧 Try checking the backend server logs or database status');
    }
  } finally {
    await prisma.$disconnect();
    console.log('\n🔌 Database connection closed');
  }
}

// Run the deletion
deleteAllVCards()
  .then(() => {
    console.log('\n✨ Script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });