import type { Pet, PetImageSource, PetProfile } from '../types/pet'

const DOG_API_RANDOM_IMAGE_ENDPOINT = 'https://dog.ceo/api/breeds/image/random'

const catFallbackPhotos = [
  'https://upload.wikimedia.org/wikipedia/commons/3/3a/Cat03.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/b/b6/Felis_catus-cat_on_snow.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/5/5e/Sleeping_cat_on_her_back.jpg',
]

const rabbitFallbackPhotos = [
  'https://upload.wikimedia.org/wikipedia/commons/5/50/Domestic_rabbit.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/e/e0/Oryctolagus_cuniculus_Rcdo.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/4/46/Oryctolagus_cuniculus_Tasmania_2.jpg',
]

interface DogApiRandomImageResponse {
  message: string
  status: string
}

const buildPlaceholderImage = (name: string, typeLabel: string): string => {
  const shortName = name.slice(0, 18)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="960" viewBox="0 0 720 960"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ffedd5" offset="0"/><stop stop-color="#fdba74" offset="0.55"/><stop stop-color="#fb7185" offset="1"/></linearGradient></defs><rect width="720" height="960" fill="url(#g)"/><circle cx="360" cy="300" r="130" fill="#fff7ed" opacity="0.9"/><text x="360" y="322" text-anchor="middle" font-size="84" font-family="ui-sans-serif,Segoe UI,sans-serif">🐾</text><text x="360" y="540" text-anchor="middle" font-size="52" fill="#7c2d12" font-family="ui-sans-serif,Segoe UI,sans-serif">${shortName}</text><text x="360" y="610" text-anchor="middle" font-size="36" fill="#9a3412" font-family="ui-sans-serif,Segoe UI,sans-serif">${typeLabel}</text></svg>`

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

const mapDogApiResponseToImageUrl = (payload: DogApiRandomImageResponse): string => {
  if (payload.status !== 'success' || !payload.message) {
    throw new Error('Dog API did not return a valid image URL.')
  }

  return payload.message
}

const chooseFallbackPhoto = (profile: PetProfile): string => {
  if (profile.type === 'Gato') {
    return catFallbackPhotos[Number.parseInt(profile.id.slice(-2), 10) % catFallbackPhotos.length]
  }

  if (profile.type === 'Conejo') {
    return rabbitFallbackPhotos[Number.parseInt(profile.id.slice(-2), 10) % rabbitFallbackPhotos.length]
  }

  return buildPlaceholderImage(profile.name, profile.type)
}

export const fetchRandomDogImage = async (): Promise<string> => {
  const response = await fetch(DOG_API_RANDOM_IMAGE_ENDPOINT)

  if (!response.ok) {
    throw new Error(`Dog API request failed with status ${response.status}.`)
  }

  const payload = (await response.json()) as DogApiRandomImageResponse
  return mapDogApiResponseToImageUrl(payload)
}

export const mergePetProfileWithImage = async (
  profile: PetProfile,
): Promise<Pet> => {
  try {
    const imageUrl = profile.type === 'Perro' ? await fetchRandomDogImage() : chooseFallbackPhoto(profile)
    const imageSource: PetImageSource = profile.type === 'Perro' ? 'dog-api' : 'fallback'

    return {
      ...profile,
      imageUrl,
      imageSource,
    }
  } catch {
    return {
      ...profile,
      imageUrl: chooseFallbackPhoto(profile),
      imageSource: 'fallback',
    }
  }
}

export const fetchPetStack = async (
  profiles: PetProfile[],
  startIndex: number,
  stackSize = 3,
): Promise<Pet[]> => {
  if (!profiles.length) {
    return []
  }

  const targetSize = Math.max(1, Math.min(stackSize, profiles.length))
  const selectedProfiles: PetProfile[] = []

  for (let index = 0; index < targetSize; index += 1) {
    const profile = profiles[(startIndex + index) % profiles.length]
    selectedProfiles.push(profile)
  }

  return Promise.all(selectedProfiles.map((profile) => mergePetProfileWithImage(profile)))
}
