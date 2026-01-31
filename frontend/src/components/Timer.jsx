import { motion } from 'framer-motion';

const Timer = ({ timer, t }) => {
  const { isActive, isComplete, formatTime, start, stop, reset, progress } = timer;

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-8 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 text-white text-center shadow-xl"
      >
        <div className="text-5xl mb-4">🎉</div>
        <h3 className="font-display font-bold text-2xl mb-2">
          {t.timer.timeUp}
        </h3>
        <button
          onClick={() => reset()}
          className="mt-4 px-6 py-2 rounded-lg bg-white text-green-600 font-display font-bold hover:bg-gray-100 transition-colors"
        >
          {t.newSession}
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="p-6 rounded-2xl bg-light-surface dark:bg-dark-surface border-2 border-light-border dark:border-dark-border"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white">
            {t.timer.title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t.timer.description}
          </p>
        </div>
        <div className="text-4xl font-display font-bold text-primary">
          {formatTime()}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-4">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        {!isActive ? (
          <button
            onClick={start}
            className="flex-1 px-6 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-display font-bold transition-colors"
          >
            {t.startTimer}
          </button>
        ) : (
          <>
            <button
              onClick={stop}
              className="flex-1 px-6 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-display font-bold transition-colors"
            >
              {t.stopTimer}
            </button>
            <button
              onClick={() => reset()}
              className="px-6 py-3 rounded-xl border-2 border-light-border dark:border-dark-border hover:border-primary dark:hover:border-primary text-gray-700 dark:text-gray-300 font-display transition-colors"
            >
              ↻
            </button>
          </>
        )}
      </div>

      {isActive && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400"
        >
          🔥 Keep going! You're doing it!
        </motion.p>
      )}
    </motion.div>
  );
};

export default Timer;
