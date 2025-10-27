# Exhibit Image Upload Fix - Setup Instructions

## Issue
Exhibit images uploaded in Admin Portal were not showing on the Attractions page.

## Root Causes Fixed
1. ✅ Customer API wasn't returning `Image_URL` field
2. ✅ Upload middleware was hardcoded to only save to `uploads/animals` directory
3. ❌ **STILL NEEDED**: `Image_URL` column doesn't exist in Exhibit table

## Required Step: Add Image_URL Column to Database

**You MUST run this SQL command** in MySQL Workbench or your MySQL client:

```sql
ALTER TABLE Exhibit ADD COLUMN Image_URL VARCHAR(500);
```

### How to run it:
1. Open MySQL Workbench
2. Connect to your `zoo_db` database
3. Open a new SQL tab
4. Paste the command above
5. Click Execute (⚡ icon) or press Ctrl+Enter
6. Verify it worked by running: `DESCRIBE Exhibit;`
7. You should see `Image_URL` in the column list

## What Was Fixed

### Backend Changes:
1. **customerController.js** - Added `Image_URL` to exhibit queries
2. **upload.js middleware** - Now supports both animals and exhibits directories
3. **adminRoutes.js** - Updated deleteImageFile calls to specify type

### How It Works Now:
1. Admin uploads exhibit image → Saved to `uploads/exhibits/`
2. Image URL stored in database → `Exhibit.Image_URL`
3. Customer views Attractions page → API returns `Image_URL`
4. Frontend displays image using `getExhibitImage()` function

## Testing After SQL Migration:
1. Restart backend: `npm start` in zoo-backend folder
2. Go to Admin Portal → Exhibit Management
3. Edit an exhibit and upload an image
4. Navigate to Home → Attractions
5. The image should now display!
