import { motion, AnimatePresence } from 'framer-motion';

export default function AlertTicker({ alerts }) {
  if (!alerts || alerts.length === 0) return null;

  const tickerText = alerts
    .map((a) => `🚨 ${a.title} - ${a.location_name}, ${a.province}`)
    .join('    •    ');

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-destructive/95 text-white overflow-hidden relative"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-destructive via-destructive/90 to-destructive pointer-events-none z-10" />

      <div className="relative z-20 flex items-center">
        <div className="flex items-center gap-2 px-4 py-2 bg-black/20">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <span className="text-lg">🚨</span>
          </motion.div>
          <span className="font-semibold text-sm whitespace-nowrap">LIVE</span>
        </div>

        <div className="flex-1 overflow-hidden relative">
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-destructive to-transparent z-20" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-destructive to-transparent z-20" />

          <motion.div
            className="py-2 whitespace-nowrap"
            animate={{ x: ['0%', '-50%'] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: 'loop',
                duration: 30,
                ease: 'linear',
              },
            }}
          >
            {tickerText} &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp; {tickerText}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
