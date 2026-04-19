import { PawPrint } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { MatchShelf } from '../components/MatchShelf'
import { PetCard } from '../components/PetCard'
import { PetFilters } from '../components/PetFilters'
import { usePetDeck } from '../hooks/usePetDeck'

export const HomePage = () => {
  const navigate = useNavigate()
  const {
    deck,
    error,
    filters,
    likedPets,
    loading,
    registerDecision,
    resetFilters,
    setFilters,
  } = usePetDeck()

  const currentPet = deck[0]

  const handleLike = async () => {
    const likedPet = await registerDecision('like')

    if (likedPet) {
      navigate(`/adopcion/${likedPet.id}`, {
        state: {
          pet: likedPet,
        },
      })
    }
  }

  const handlePass = async () => {
    await registerDecision('pass')
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-6 md:gap-8 md:px-8 md:py-10">
      <header className="rounded-[2rem] border border-white/40 bg-white/60 px-6 py-6 shadow-xl backdrop-blur-md md:px-8 md:py-8">
        <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-100/80 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-amber-700">
          <PawPrint size={14} />
          Tinder para mascotas
        </p>
        <h1 className="text-4xl font-black tracking-tight text-amber-950 md:text-6xl">
          PawsMatch
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-amber-900 md:text-base">
          Descubre companeros de vida con un gesto. Desliza a la derecha para adoptar y a la izquierda para seguir explorando.
        </p>
      </header>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div className="space-y-4 md:space-y-5">
          <PetFilters
            filters={filters}
            onChange={setFilters}
            onReset={resetFilters}
          />

          {loading && !currentPet ? (
            <div className="rounded-3xl border border-white/40 bg-white/65 p-8 text-center text-sm font-medium text-amber-900 shadow-lg backdrop-blur-md">
              Preparando mascotas para ti...
            </div>
          ) : null}

          {error && !currentPet ? (
            <div className="rounded-3xl border border-orange-200 bg-orange-50 p-6 text-sm text-orange-700">
              {error}
            </div>
          ) : null}

          {currentPet ? (
            <PetCard
              pet={currentPet}
              disabled={loading}
              onLike={handleLike}
              onPass={handlePass}
            />
          ) : null}
        </div>

        <aside className="space-y-4 md:space-y-5">
          <MatchShelf likedPets={likedPets} />

          <section className="rounded-3xl border border-white/35 bg-white/65 p-4 shadow-lg backdrop-blur-md md:p-5">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-800">
              Como funciona
            </h2>
            <ol className="mt-3 space-y-2 text-sm text-amber-900">
              <li>1. Filtra por tipo y ubicacion.</li>
              <li>2. Desliza o usa los botones Pasar / Me encanta.</li>
              <li>3. Al dar Me encanta, veras la ficha de adopcion.</li>
            </ol>
          </section>
        </aside>
      </section>
    </main>
  )
}
