import petsJson from './pets.json'
import type { PetLocation, PetProfile, PetType, ShelterDetails } from '../types/pet'

interface PetSeed {
  id: string
  name: string
  bio: string
}

const petTypes: PetType[] = ['Perro', 'Gato', 'Conejo']

const petLocations: PetLocation[] = [
  {
    city: 'Ciudad de Guatemala',
    department: 'Guatemala',
    label: 'Ciudad de Guatemala, Guatemala',
  },
  {
    city: 'Mixco',
    department: 'Guatemala',
    label: 'Mixco, Guatemala',
  },
  {
    city: 'Antigua Guatemala',
    department: 'Sacatepequez',
    label: 'Antigua Guatemala, Sacatepequez',
  },
  {
    city: 'Quetzaltenango',
    department: 'Quetzaltenango',
    label: 'Quetzaltenango, Quetzaltenango',
  },
  {
    city: 'Escuintla',
    department: 'Escuintla',
    label: 'Escuintla, Escuintla',
  },
  {
    city: 'Coban',
    department: 'Alta Verapaz',
    label: 'Coban, Alta Verapaz',
  },
]

const shelters: ShelterDetails[] = [
  {
    name: 'Hogar Patitas Felices',
    contactPhone: '+502 2450-1201',
    contactEmail: 'adopciones@patitasfelices.gt',
    address: '14 calle 8-21, Zona 10, Ciudad de Guatemala',
    visitingHours: 'Lunes a Sabado, 09:00 a 17:30',
  },
  {
    name: 'Refugio Nueva Oportunidad',
    contactPhone: '+502 2460-4432',
    contactEmail: 'contacto@nuevaoportunidad.gt',
    address: 'Boulevard Principal 2-40, Mixco',
    visitingHours: 'Martes a Domingo, 10:00 a 18:00',
  },
  {
    name: 'Casa Animal Antigua',
    contactPhone: '+502 7832-8810',
    contactEmail: 'visitas@casaanimalantigua.gt',
    address: '5a avenida norte 11, Antigua Guatemala',
    visitingHours: 'Lunes a Viernes, 08:30 a 16:30',
  },
]

const normalizeBioForType = (bio: string, type: PetType): string => {
  if (type === 'Perro') {
    return bio
  }

  if (type === 'Gato') {
    return bio
      .replace(/perrito/gi, 'gatito')
      .replace(/perro/gi, 'gato')
      .replace(/caminatas/gi, 'juegos tranquilos')
  }

  return bio
    .replace(/perrito/gi, 'conejito')
    .replace(/perro/gi, 'conejo')
    .replace(/caminatas/gi, 'espacios seguros para explorar')
}

const seeds = petsJson as PetSeed[]

export const mockPetProfiles: PetProfile[] = seeds.map((pet, index) => {
  const type = petTypes[index % petTypes.length]
  const location = petLocations[index % petLocations.length]
  const shelter = shelters[index % shelters.length]

  return {
    id: pet.id,
    name: pet.name,
    bio: normalizeBioForType(pet.bio, type),
    type,
    location,
    shelter,
  }
})

export const petTypeOptions: Array<'Todas' | PetType> = [
  'Todas',
  ...new Set(mockPetProfiles.map((pet) => pet.type)),
]

export const petLocationOptions: Array<'Todas' | string> = [
  'Todas',
  ...new Set(mockPetProfiles.map((pet) => pet.location.label)),
]
