import { motion } from 'framer-motion';

export function ParticleEffect({ duration = 0.6 }) {
  return (
    <>
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: 6,
            height: 6,
            background: '#f1c40f',
            borderRadius: '50%',
            pointerEvents: 'none',
            top: '50%',
            left: '50%',
            x: '-50%',
            y: '-50%'
          }}
          initial={{ scale: 0, opacity: 1, x: '-50%', y: '-50%' }}
          animate={{
            scale: [0, 1, 0],
            opacity: [1, 0.8, 0],
            x: ['-50%', `-50% + ${(i % 4 - 2) * 20}px`],
            y: ['-50%', `-50% + ${(Math.floor(i / 4) - 1) * 20}px`]
          }}
          transition={{ duration, ease: 'easeOut' }}
        />
      ))}
    </>
  );
}