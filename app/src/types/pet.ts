export type PetType = 'Perro' | 'Gato' | 'Conejo'

export type PetImageSource = 'dog-api' | 'fallback'

export interface PetLocation {
  city: string
  department: string
  label: string
}

export interface ShelterDetails {
  name: string
  contactPhone: string
  contactEmail: string
  address: string
  visitingHours: string
}

export interface PetProfile {
  id: string
  name: string
  bio: string
  type: PetType
  location: PetLocation
  shelter: ShelterDetails
}

export interface Pet extends PetProfile {
  imageUrl: string
  imageSource: PetImageSource
}

export interface PetFilters {
  type: 'Todas' | PetType
  location: 'Todas' | string
}

export interface MatchRecord {
  petId: string
  decision: 'like' | 'pass'
  decidedAt: string
}
