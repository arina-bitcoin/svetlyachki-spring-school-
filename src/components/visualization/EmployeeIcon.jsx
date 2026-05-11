import { motion, AnimatePresence } from 'framer-motion'
import { ParticleEffect } from '../common/ParticleEffect'

export function EmployeeIcon({ employeeId }) {
  const animation = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0, opacity: 0 },
    transition: { duration: 0.25, ease: 'easeOut' }
  }

  return (
    <AnimatePresence mode="wait">
        <motion.div
            key={employeeId}
            className="employee-icon"
            style={{
                backgroundImage: `url(/assets/animated_cook.gif)`,
                position: 'relative',
                // Уменьшаем сам контейнер
                width: '70px',
                height: '70px',
                // 'contain' гарантирует, что гифка впишется в эти размеры целиком без обрезки
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
            }}
            {...animation}
        >
            <ParticleEffect />
        </motion.div>
    </AnimatePresence>
  )
}