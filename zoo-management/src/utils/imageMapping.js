// Image mapping utility for animals and exhibits
// This maps species/exhibit names to local image files in the assets folder

// Animal images - maps species name to image filename
export const animalImages = {
  // African Savanna
  "African Elephant": "/src/assets/animals/african-elephant.jpg",
  "African Lion": "/src/assets/animals/african-lion.jpg",
  Giraffe: "/src/assets/animals/giraffe.jpg",
  Zebra: "/src/assets/animals/zebra.jpg",
  Cheetah: "/src/assets/animals/cheetah.jpg",

  // Big Cats
  "Bengal Tiger": "/src/assets/animals/bengal-tiger.jpg",
  "Black Panther": "/src/assets/animals/black-panther.jpg",

  // Primates
  Chimpanzee: "/src/assets/animals/chimpanzee.jpg",
  Gorilla: "/src/assets/animals/gorilla.jpg",
  "Spider Monkey": "/src/assets/animals/spider-monkey.jpg",

  // Australian
  "Red Kangaroo": "/src/assets/animals/red-kangaroo.jpg",
  Koala: "/src/assets/animals/koala.jpg",

  // Birds
  Macaw: "/src/assets/animals/macaw.jpg",
  Flamingo: "/src/assets/animals/flamingo.jpg",
  "Bald Eagle": "/src/assets/animals/bald-eagle.jpg",

  // Reptiles
  Python: "/src/assets/animals/python.jpg",
  "Monitor Lizard": "/src/assets/animals/monitor-lizard.jpg",
  Alligator: "/src/assets/animals/alligator.jpg",
  Iguana: "/src/assets/animals/iguana.jpg",

  // North American
  "Grizzly Bear": "/src/assets/animals/grizzly-bear.jpg",
  Bison: "/src/assets/animals/bison.jpg",
  Wolf: "/src/assets/animals/wolf.jpg",

  // Default fallback
  default: null,
};

// Exhibit images - maps exhibit name to image filename
export const exhibitImages = {
  "African Savanna": "/src/assets/exhibits/african-savanna.jpg",
  "Primate Paradise": "/src/assets/exhibits/primate-paradise.jpg",
  "Reptile House": "/src/assets/exhibits/reptile-house.jpg",
  "Australian Outback": "/src/assets/exhibits/australian-outback.jpg",
  "Tropical Rainforest": "/src/assets/exhibits/tropical-rainforest.jpg",
  "Bird Sanctuary": "/src/assets/exhibits/bird-sanctuary.jpg",
  "Polar Point": "/src/assets/exhibits/polar-point.jpg",
  "North American Wildlife": "/src/assets/exhibits/north-american-wildlife.jpg",

  // Default fallback
  default: null,
};

/**
 * Get the image URL for an animal
 * Priority: Database Image_URL > Local asset > null
 */
export function getAnimalImage(animal) {
  // First check if database has an image URL
  if (animal.Image_URL) {
    return animal.Image_URL;
  }

  // Otherwise, check for local image based on species
  const species = animal.Species;
  return animalImages[species] || animalImages.default;
}

/**
 * Get the image URL for an exhibit
 * Priority: Database Image_URL > Local asset > null
 */
export function getExhibitImage(exhibit) {
  // First check if database has an image URL
  if (exhibit.Image_URL) {
    return exhibit.Image_URL;
  }

  // Otherwise, check for local image based on exhibit name
  const exhibitName = exhibit.exhibit_Name || exhibit.Enclosure_Name;
  return exhibitImages[exhibitName] || exhibitImages.default;
}
