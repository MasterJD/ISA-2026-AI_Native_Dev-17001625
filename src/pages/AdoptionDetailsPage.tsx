import { CalendarCheck2, Clock3, Mail, MapPin, Phone, Undo2 } from 'lucide-react'
import { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import type { Pet } from '../types/pet'

interface AdoptionLocationState {
  pet?: Pet
}

export const AdoptionDetailsPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { petId } = useParams()
  const [visitScheduled, setVisitScheduled] = useState(false)

  const state = location.state as AdoptionLocationState | null
  const selectedPet = state?.pet

  if (!selectedPet || selectedPet.id !== petId) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center justify-center px-4 py-8">
        <section className="w-full rounded-[2rem] border border-white/40 bg-white/70 p-8 text-center shadow-xl backdrop-blur-lg">
          <h1 className="text-2xl font-black text-amber-950 md:text-3xl">
            La mascota seleccionada ya no esta en pantalla
          </h1>
          <p className="mt-3 text-sm text-amber-900">
            Regresa al catalogo para seguir explorando nuevas opciones de adopcion.
          </p>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-amber-300 px-5 py-2.5 text-sm font-semibold text-amber-800 transition hover:bg-amber-100"
          >
            <Undo2 size={16} />
            Volver al catalogo
          </button>
        </section>
      </main>
    )
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-4 py-6 md:px-8 md:py-10">
      <header className="rounded-[2rem] border border-white/40 bg-white/70 p-6 shadow-xl backdrop-blur-lg md:p-8">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-rose-700">
          Match confirmado
        </p>
        <h1 className="text-3xl font-black text-amber-950 md:text-5xl">
          Detalles de adopcion de {selectedPet.name}
        </h1>
        <p className="mt-3 text-sm text-amber-900 md:text-base">
          Tu siguiente paso esta listo. Contacta al refugio y agenda una visita para conocerle en persona.
        </p>
      </header>

      <section className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
        <article className="overflow-hidden rounded-[2rem] border border-white/45 bg-white/65 shadow-xl backdrop-blur-lg">
          <img
            src={selectedPet.imageUrl}
            alt={`Foto de ${selectedPet.name}`}
            className="h-[360px] w-full object-cover md:h-[420px]"
          />
          <div className="space-y-2 p-5 text-sm text-amber-900 md:p-6">
            {selectedPet.bio.split('\n').map((line, index) => (
              <p key={`${selectedPet.id}-adoption-bio-${index}`}>{line}</p>
            ))}
          </div>
        </article>

        <article className="rounded-[2rem] border border-white/45 bg-white/70 p-5 shadow-xl backdrop-blur-lg md:p-6">
          <h2 className="text-lg font-black text-amber-950 md:text-xl">
            Informacion del refugio
          </h2>

          <ul className="mt-4 space-y-3 text-sm text-amber-900">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5" size={16} />
              <span>
                <strong>Ubicacion:</strong> {selectedPet.shelter.address}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Phone className="mt-0.5" size={16} />
              <span>
                <strong>Telefono:</strong> {selectedPet.shelter.contactPhone}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Mail className="mt-0.5" size={16} />
              <span>
                <strong>Email:</strong> {selectedPet.shelter.contactEmail}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Clock3 className="mt-0.5" size={16} />
              <span>
                <strong>Horario:</strong> {selectedPet.shelter.visitingHours}
              </span>
            </li>
          </ul>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setVisitScheduled(true)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-600"
            >
              <CalendarCheck2 size={18} />
              Agendar visita
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-amber-300 bg-white/90 px-4 py-3 text-sm font-semibold text-amber-800 transition hover:bg-amber-100"
            >
              <Undo2 size={18} />
              Seguir buscando
            </button>
          </div>

          {visitScheduled ? (
            <p className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
              Visita agendada. El refugio se comunicara contigo para confirmar fecha y requisitos.
            </p>
          ) : null}
        </article>
      </section>
    </main>
  )
}
