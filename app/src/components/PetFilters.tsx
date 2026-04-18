import { SlidersHorizontal } from 'lucide-react'
import { petLocationOptions, petTypeOptions } from '../data/mockData'
import type { PetFilters as PetFiltersState } from '../types/pet'

interface PetFiltersProps {
  filters: PetFiltersState
  onChange: (nextFilters: PetFiltersState) => void
  onReset: () => void
}

export const PetFilters = ({ filters, onChange, onReset }: PetFiltersProps) => {
  return (
    <section className="rounded-3xl border border-white/40 bg-white/70 p-4 shadow-lg backdrop-blur-md md:p-5">
      <div className="mb-4 flex items-center gap-2 text-amber-900">
        <SlidersHorizontal size={18} />
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em]">
          Filtros
        </h2>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="grid gap-2 text-sm text-amber-900">
          <span className="font-semibold">Tipo de mascota</span>
          <select
            className="rounded-2xl border border-amber-200 bg-white/85 px-3 py-2 text-amber-950 outline-none ring-0 transition focus:border-amber-400"
            value={filters.type}
            onChange={(event) =>
              onChange({
                ...filters,
                  type: event.target.value as PetFiltersState['type'],
              })
            }
          >
            {petTypeOptions.map((typeOption) => (
              <option key={typeOption} value={typeOption}>
                {typeOption}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm text-amber-900">
          <span className="font-semibold">Ubicacion</span>
          <select
            className="rounded-2xl border border-amber-200 bg-white/85 px-3 py-2 text-amber-950 outline-none ring-0 transition focus:border-amber-400"
            value={filters.location}
            onChange={(event) =>
              onChange({
                ...filters,
                location: event.target.value,
              })
            }
          >
            {petLocationOptions.map((locationOption) => (
              <option key={locationOption} value={locationOption}>
                {locationOption}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="mt-4 rounded-full border border-amber-300 px-4 py-2 text-sm font-semibold text-amber-800 transition hover:bg-amber-100"
      >
        Limpiar filtros
      </button>
    </section>
  )
}
