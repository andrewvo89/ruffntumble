import { globalConstants } from "../../global/exports";

export default [
  {
    id: "park",
    name: 'Park',
    pluralName: 'Parks',
    radius: 5000,
    queryValue: 'parks',
    type: 'park',
    filters: [
      {
        name: 'Dog Friendly',
        type: globalConstants.BOOLEAN
      },
      {
        name: 'Fenced',
        type: globalConstants.BOOLEAN
      },
      {
        name: 'Poo Bags',
        type: globalConstants.BOOLEAN
      }
    ]
  },
  {
    id: "beach",
    name: 'Beach',
    pluralName: 'Beaches',
    radius: 10000,
    queryValue: 'beach',
    type: 'natural_feature',
    filters: true
  },
  {
    id: "cafe",
    name: 'Café',
    pluralName: 'Cafés',
    radius: 5000,
    queryValue: 'cafes',
    type: 'cafe',
    filters: true
  },
  {
    id: "pub",
    name: 'Pub',
    pluralName: 'Pubs',
    radius: 5000,
    queryValue: 'pubs',
    type: 'bar',
    filters: true
  },
  {
    id: "vetinarian",
    name: 'Vetinarian',
    pluralName: 'Vetinarians',
    radius: 20000,
    queryValue: 'vets',
    type: 'veterinary_care',
    filters: true
  },
  {
    id: "store",
    name: 'Pet Store',
    pluralName: 'Pet Stores',
    radius: 20000,
    queryValue: 'pet stores',
    type: 'pet_store',
    filters: false
  },
  {
    id: "daycare",
    name: 'Pet Daycare Service',
    pluralName: 'Pet Daycare Services',
    radius: 20000,
    queryValue: 'pet daycare',
    type: null,
    filters: false
  },
  {
    id: "grooming",
    name: 'Pet Grooming Service',
    pluralName: 'Pet Grooming Services',
    radius: 20000,
    queryValue: 'pet grooming',
    type: null,
    filters: false
  }
];