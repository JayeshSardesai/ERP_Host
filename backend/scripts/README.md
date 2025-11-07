# Database Migration Scripts

This folder contains scripts to migrate and fix data in the ERP database.

## Available Scripts

### 1. fixLogoUrls.js

**Purpose:** Fixes schools that have old local file paths as logoUrl instead of Cloudinary URLs.

**Problem it solves:**
- Old schools have logoUrl like `/uploads/logos/SCHOOL_CODE_timestamp.jpg`
- These paths result in 404 errors since files are not served locally
- All logos should be stored in Cloudinary

**What it does:**
- Finds all schools with local logo paths (starting with `/uploads/logos/`)
- Sets their `logoUrl` to empty string
- Schools will show a placeholder logo until admins re-upload via the UI

**How to run:**
```bash
cd backend
node scripts/fixLogoUrls.js
```

**Output:**
```
🔗 Connecting to MongoDB...
✅ Connected to MongoDB

📊 Found 4 schools with local logo paths

🔄 Updating School Name (CODE)
   Old logoUrl: /uploads/logos/CODE_1761745583146.jpg
   ✅ Updated to: '' (empty - ready for re-upload)

============================================================
📊 Migration Summary:
   ✅ Successfully updated: 4 schools
   ❌ Failed: 0 schools
============================================================

💡 Note: Schools with empty logoUrl will show a placeholder.
   Admins can re-upload logos via the Edit School page.
```

**After running:**
1. Schools will show a placeholder logo in the UI
2. Admins can edit the school and upload a new logo
3. New logos will be automatically uploaded to Cloudinary
4. Old local files in `/uploads/logos/` can be safely deleted

## Adding New Scripts

When creating new migration scripts:
1. Follow the same structure as `fixLogoUrls.js`
2. Add proper error handling and logging
3. Document the script in this README
4. Test on a backup database first
5. Make the script idempotent (safe to run multiple times)
