/**
 * Migration Script: Fix Logo URLs
 * 
 * This script updates schools that have local file paths as logoUrl
 * to use a default placeholder or empty string instead.
 * 
 * Old format: /uploads/logos/SCHOOL_CODE_timestamp.jpg
 * New format: '' (empty) or a default logo URL
 */

const mongoose = require('mongoose');
require('dotenv').config();

const School = require('../models/School');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/erp_main';

async function fixLogoUrls() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find all schools with local logo paths
    const schoolsWithLocalLogos = await School.find({
      logoUrl: { $regex: '^/uploads/logos/', $options: 'i' }
    });

    console.log(`\n📊 Found ${schoolsWithLocalLogos.length} schools with local logo paths\n`);

    if (schoolsWithLocalLogos.length === 0) {
      console.log('✅ No schools need updating!');
      return;
    }

    let updated = 0;
    let failed = 0;

    for (const school of schoolsWithLocalLogos) {
      try {
        console.log(`🔄 Updating ${school.name} (${school.code})`);
        console.log(`   Old logoUrl: ${school.logoUrl}`);
        
        // Set logoUrl to empty string - they can re-upload via the UI
        school.logoUrl = '';
        await school.save();
        
        console.log(`   ✅ Updated to: '' (empty - ready for re-upload)`);
        updated++;
      } catch (error) {
        console.error(`   ❌ Failed to update ${school.name}:`, error.message);
        failed++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`📊 Migration Summary:`);
    console.log(`   ✅ Successfully updated: ${updated} schools`);
    console.log(`   ❌ Failed: ${failed} schools`);
    console.log('='.repeat(60));

    if (updated > 0) {
      console.log('\n💡 Note: Schools with empty logoUrl will show a placeholder.');
      console.log('   Admins can re-upload logos via the Edit School page.');
    }

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

// Run the migration
if (require.main === module) {
  fixLogoUrls()
    .then(() => {
      console.log('\n✅ Migration completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Migration failed:', error);
      process.exit(1);
    });
}

module.exports = fixLogoUrls;
