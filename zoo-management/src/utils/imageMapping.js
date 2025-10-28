// Image mapping utility for animals and exhibits
// All images are now stored in Azure Blob Storage
// No local fallbacks - consistent null handling for missing images

/**
 * Get the image URL for an animal
 * Returns: Azure Blob Storage Image_URL or null
 * All new images must be uploaded to Azure via Admin Portal
 */
export function getAnimalImage(animal) {
  // Return Azure Blob Storage URL or null
  return animal?.Image_URL || null;
}

/**
 * Get the image URL for an exhibit
 * Returns: Azure Blob Storage Image_URL or null
 * All new images must be uploaded to Azure via Admin Portal
 */
export function getExhibitImage(exhibit) {
  // Return Azure Blob Storage URL or null
  return exhibit?.Image_URL || null;
}
