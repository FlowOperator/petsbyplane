/**
 * Dog and cat breed lists for the quote flow breed selector.
 */

export const DOG_BREEDS = [
  'Akita', 'Alaskan Malamute', 'American Bulldog', 'American Staffordshire Terrier',
  'Australian Shepherd', 'Basset Hound', 'Beagle', 'Belgian Malinois',
  'Bernese Mountain Dog', 'Bichon Frise', 'Border Collie', 'Border Terrier',
  'Boston Terrier', 'Boxer', 'British Bulldog', 'Bull Terrier',
  'Bullmastiff', 'Cavalier King Charles Spaniel', 'Chihuahua', 'Chow Chow',
  'Cockapoo', 'Cocker Spaniel', 'Corgi', 'Dachshund',
  'Dalmatian', 'Dobermann', 'Dogue de Bordeaux', 'English Setter',
  'English Springer Spaniel', 'Fox Terrier', 'French Bulldog', 'German Shepherd',
  'German Shorthaired Pointer', 'Golden Retriever', 'Great Dane', 'Greyhound',
  'Hungarian Vizsla', 'Husky', 'Irish Setter', 'Irish Wolfhound',
  'Jack Russell Terrier', 'Japanese Chin', 'King Charles Spaniel', 'Labradoodle',
  'Labrador Retriever', 'Lhasa Apso', 'Lurcher', 'Maltese',
  'Miniature Pinscher', 'Miniature Schnauzer', 'Newfoundland', 'Old English Sheepdog',
  'Papillon', 'Pekingese', 'Pointer', 'Pomeranian',
  'Poodle (Miniature)', 'Poodle (Standard)', 'Poodle (Toy)', 'Pug',
  'Rhodesian Ridgeback', 'Rottweiler', 'Saint Bernard', 'Samoyed',
  'Schnauzer (Giant)', 'Schnauzer (Standard)', 'Scottish Terrier', 'Shar Pei',
  'Shiba Inu', 'Shih Tzu', 'Siberian Husky', 'Staffordshire Bull Terrier',
  'Tibetan Mastiff', 'Tibetan Terrier', 'Weimaraner', 'West Highland White Terrier',
  'Whippet', 'Yorkshire Terrier',
];

export const CAT_BREEDS = [
  'Abyssinian', 'Bengal', 'Birman', 'British Shorthair',
  'Burmese', 'Devon Rex', 'Exotic Shorthair', 'Himalayan',
  'Maine Coon', 'Norwegian Forest Cat', 'Persian', 'Ragdoll',
  'Russian Blue', 'Scottish Fold', 'Siamese', 'Sphynx',
  'Tabby (Domestic)', 'Turkish Angora', 'Turkish Van',
];

export const BIRD_TYPES = [
  'African Grey Parrot', 'Amazon Parrot', 'Budgerigar', 'Canary',
  'Cockatiel', 'Cockatoo', 'Conure', 'Finch',
  'Lovebird', 'Macaw', 'Parakeet', 'Parrotlet',
];

export function getBreedsForSpecies(species: string): string[] {
  switch (species) {
    case 'dog': return DOG_BREEDS;
    case 'cat': return CAT_BREEDS;
    case 'bird': return BIRD_TYPES;
    default: return [];
  }
}
