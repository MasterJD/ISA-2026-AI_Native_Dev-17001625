import { motion, useMotionValue, useTransform } from 'framer-motion'
import { Heart, MapPin, X } from 'lucide-react'
import { useMemo } from 'react'
import type { Pet } from '../types/pet'

interface PetCardProps {
  pet: Pet
  disabled?: boolean
  onLike: () => void
  onPass: () => void
}

const SWIPE_THRESHOLD = 120

export const PetCard = ({ pet, disabled, onLike, onPass }: PetCardProps) => {
  const axisX = useMotionValue(0)
  const rotate = useTransform(axisX, [-240, 0, 240], [-14, 0, 14])
  const likeOpacity = useTransform(axisX, [0, 130], [0, 1])
  const passOpacity = useTransform(axisX, [-130, 0], [1, 0])

  const truncatedBio = useMemo(() => {
    const bioLines = pet.bio.split('\n')
    return bioLines.slice(0, 3)
  }, [pet.bio])

  return (
    <motion.article
      drag={disabled ? false : 'x'}
      dragConstraints={{ left: 0, right: 0 }}
      style={{ x: axisX, rotate }}
      onDragEnd={(_, info) => {
        if (disabled) {
          return
        }

        if (info.offset.x > SWIPE_THRESHOLD) {
          onLike()
          return
        }

        if (info.offset.x < -SWIPE_THRESHOLD) {
          onPass()
        }
      }}
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="relative w-full overflow-hidden rounded-[2rem] border border-white/50 bg-white/55 shadow-2xl backdrop-blur-xl"
    >
      <div className="pointer-events-none absolute inset-x-0 top-5 flex justify-between px-5 md:px-6">
        <motion.span
          style={{ opacity: passOpacity }}
          className="rounded-full border-2 border-orange-500 bg-white/95 px-4 py-1 text-xs font-black uppercase tracking-[0.2em] text-orange-600"
        >
          Pass
        </motion.span>
        <motion.span
          style={{ opacity: likeOpacity }}
          className="rounded-full border-2 border-rose-500 bg-white/95 px-4 py-1 text-xs font-black uppercase tracking-[0.2em] text-rose-600"
        >
          Like
        </motion.span>
      </div>

      <div className="relative h-[380px] w-full md:h-[500px]">
        <img
          src={pet.imageUrl}
          alt={`Foto de ${pet.name}`}
          className="h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-amber-950/85 via-amber-900/20 to-transparent p-5 text-left text-amber-50 md:p-6">
          <p className="mb-2 inline-flex rounded-full border border-amber-200/40 bg-amber-50/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            {pet.type}
          </p>
          <h2 className="text-3xl font-black tracking-tight md:text-4xl">{pet.name}</h2>
          <p className="mt-2 flex items-center gap-1 text-sm text-amber-100/90">
            <MapPin size={14} />
            {pet.location.label}
          </p>
        </div>
      </div>

      <div className="space-y-3 p-5 text-left md:p-6">
        {truncatedBio.map((line, index) => (
          <p key={`${pet.id}-bio-${index}`} className="text-sm text-amber-900">
            {line}
          </p>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 px-5 pb-5 md:px-6 md:pb-6">
        <button
          type="button"
          onClick={onPass}
          disabled={disabled}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-orange-300 bg-white/80 px-4 py-3 text-sm font-semibold text-orange-700 transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <X size={18} />
          Pasar
        </button>
        <button
          type="button"
          onClick={onLike}
          disabled={disabled}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-300/50 transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Heart size={18} />
          Me encanta
        </button>
      </div>
    </motion.article>
  )
}
