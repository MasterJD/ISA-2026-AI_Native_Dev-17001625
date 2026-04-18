import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { mockPetProfiles } from '../data/mockData'
import { fetchPetStack, mergePetProfileWithImage } from '../services/petProvider'
import type { MatchRecord, Pet, PetFilters, PetProfile } from '../types/pet'

const STACK_BUFFER_SIZE = 3

const DEFAULT_FILTERS: PetFilters = {
  type: 'Todas',
  location: 'Todas',
}

const filterProfiles = (profiles: PetProfile[], filters: PetFilters): PetProfile[] => {
  return profiles.filter((pet) => {
    const matchesType = filters.type === 'Todas' || pet.type === filters.type
    const matchesLocation =
      filters.location === 'Todas' || pet.location.label === filters.location

    return matchesType && matchesLocation
  })
}

export const usePetDeck = () => {
  const [filters, setFilters] = useState<PetFilters>(DEFAULT_FILTERS)
  const [deck, setDeck] = useState<Pet[]>([])
  const [matchRecords, setMatchRecords] = useState<MatchRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const filteredProfiles = useMemo(
    () => filterProfiles(mockPetProfiles, filters),
    [filters],
  )

  const likedPetIds = useMemo(() => {
    return new Set(
      matchRecords
        .filter((record) => record.decision === 'like')
        .map((record) => record.petId),
    )
  }, [matchRecords])

  const likedPets = useMemo(() => {
    const likedProfileMap = new Map(
      mockPetProfiles.map((profile) => [profile.id, profile]),
    )

    return Array.from(likedPetIds)
      .map((petId) => likedProfileMap.get(petId))
      .filter((pet): pet is PetProfile => Boolean(pet))
  }, [filteredProfiles, likedPetIds])

  const requestTokenRef = useRef(0)
  const nextProfileIndexRef = useRef(0)
  const hasInitializedRef = useRef(false)
  const filterKeyRef = useRef<string | null>(null)

  const filterKey = useMemo(
    () => `${filters.type}::${filters.location}`,
    [filters.location, filters.type],
  )

  const loadInitialDeck = useCallback(async (profiles: PetProfile[]) => {
    requestTokenRef.current += 1
    const requestToken = requestTokenRef.current

    if (!profiles.length) {
      setDeck([])
      setLoading(false)
      setError('No hay mascotas con esos filtros por ahora.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const targetSize = Math.min(STACK_BUFFER_SIZE, profiles.length)
      const nextDeck = await fetchPetStack(profiles, 0, targetSize)

      if (requestToken !== requestTokenRef.current) {
        return
      }

      nextProfileIndexRef.current = targetSize % profiles.length
      setDeck(nextDeck)
    } catch {
      if (requestToken !== requestTokenRef.current) {
        return
      }

      setDeck([])
      setError('No fue posible cargar el catalogo de mascotas.')
    } finally {
      if (requestToken === requestTokenRef.current) {
        setLoading(false)
      }
    }
  }, [])

  const topUpDeck = useCallback(
    async (profiles: PetProfile[], expectedDeckSize: number) => {
      if (!profiles.length) {
        return
      }

      const nextProfile = profiles[nextProfileIndexRef.current % profiles.length]
      nextProfileIndexRef.current =
        (nextProfileIndexRef.current + 1) % profiles.length

      const nextPet = await mergePetProfileWithImage(nextProfile)
      setDeck((currentDeck) => {
        const trimmedDeck = currentDeck.slice(0, expectedDeckSize - 1)
        return [...trimmedDeck, nextPet]
      })
    },
    [],
  )

  useEffect(() => {
    if (hasInitializedRef.current) {
      return
    }

    hasInitializedRef.current = true
    filterKeyRef.current = filterKey
    void loadInitialDeck(filteredProfiles)
  }, [filterKey, filteredProfiles, loadInitialDeck])

  useEffect(() => {
    if (!hasInitializedRef.current) {
      return
    }

    if (filterKeyRef.current === filterKey) {
      return
    }

    filterKeyRef.current = filterKey

    void loadInitialDeck(filteredProfiles)
  }, [filterKey, filteredProfiles, loadInitialDeck])

  const registerDecision = useCallback(
    async (decision: 'like' | 'pass'): Promise<Pet | null> => {
      const currentPet = deck[0]
      if (!currentPet) {
        return null
      }

      setMatchRecords((records) => [
        ...records,
        {
          petId: currentPet.id,
          decision,
          decidedAt: new Date().toISOString(),
        },
      ])

      const targetSize = Math.min(STACK_BUFFER_SIZE, filteredProfiles.length)
      setDeck((currentDeck) => currentDeck.slice(1))

      if (filteredProfiles.length > 0) {
        void topUpDeck(filteredProfiles, targetSize).catch(() => {
          setError('No se pudo actualizar la siguiente mascota. Intenta de nuevo.')
        })
      }

      return currentPet
    },
    [deck, filteredProfiles, topUpDeck],
  )

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS)
  }, [])

  return {
    deck,
    filters,
    likedPets,
    loading,
    error,
    registerDecision,
    resetFilters,
    setFilters,
  }
}
