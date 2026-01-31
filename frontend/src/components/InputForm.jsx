import { useState } from 'react';
import { motion } from 'framer-motion';

const InputForm = ({ onSubmit, isLoading, error, t }) => {
  const [input, setInput] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError('');

    if (!input.trim()) {
      setLocalError(t.errors.required);
      return;
    }

    if (input.length > 500) {
      setLocalError(t.errors.tooLong);
      return;
    }

    onSubmit(input);
  };

  const charCount = input.length;
  const charLimit = 500;
  const isNearLimit = charCount > 400;

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.placeholder}
          disabled={isLoading}
          className={`w-full px-6 py-5 rounded-2xl font-body text-lg bg-light-surface dark:bg-dark-surface border-2 transition-all resize-none focus:outline-none focus:ring-4 focus:ring-primary/20 ${
            localError || error
              ? 'border-red-500 dark:border-red-500'
              : 'border-light-border dark:border-dark-border focus:border-primary dark:focus:border-primary'
          } text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed`}
          rows={5}
        />
        
        <div className="absolute bottom-4 right-4 text-sm">
          <span className={`${isNearLimit ? 'text-primary font-bold' : 'text-gray-400'}`}>
            {charCount}/{charLimit}
          </span>
        </div>
      </div>

      {(localError || error) && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-red-500 text-sm font-body"
        >
          {localError || error}
        </motion.p>
      )}

      <motion.button
        type="submit"
        disabled={isLoading || !input.trim()}
        whileHover={{ scale: isLoading ? 1 : 1.02 }}
        whileTap={{ scale: isLoading ? 1 : 0.98 }}
        className="w-full mt-6 px-8 py-4 rounded-2xl bg-primary hover:bg-primary-dark text-white font-display font-bold text-lg shadow-lg shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-3">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            {t.submitting}
          </span>
        ) : (
          t.submit
        )}
      </motion.button>

      <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
        ⏱️ ~3 minutes to clarity
      </p>
    </form>
  );
};

export default InputForm;
