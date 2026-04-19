import { Heart } from 'lucide-react'
import type { PetProfile } from '../types/pet'

interface MatchShelfProps {
  likedPets: PetProfile[]
}

export const MatchShelf = ({ likedPets }: MatchShelfProps) => {
  return (
    <section className="rounded-3xl border border-white/35 bg-white/65 p-4 shadow-lg backdrop-blur-md md:p-5">
      <div className="mb-3 flex items-center gap-2 text-rose-700">
        <Heart size={18} />
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em]">
          Tus matches
        </h2>
      </div>

      {likedPets.length === 0 ? (
        <p className="text-sm text-amber-900/80">
          Todavia no has marcado favoritos. Dale Me encanta a tu primera mascota.
        </p>
      ) : (
        <ul className="grid gap-2 sm:grid-cols-2">
          {likedPets.slice(-6).map((pet) => (
            <li
              key={pet.id}
              className="rounded-2xl border border-rose-100 bg-rose-50/70 px-3 py-2 text-left"
            >
              <p className="text-sm font-semibold text-rose-800">{pet.name}</p>
              <p className="text-xs text-rose-700">{pet.location.city}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
