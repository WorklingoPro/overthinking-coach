import { useState } from 'react';
import { motion } from 'framer-motion';
import storage from '../utils/storage';

const ResultCard = ({ result, t, onNewSession }) => {
  const [copied, setCopied] = useState(false);

  const typeIcons = {
    fear: '😰',
    perfectionism: '🎯',
    decision_overload: '🤯',
    avoidance: '🙈',
    rumination: '🌀'
  };

  const handleCopy = () => {
    const text = `${t.nextAction}: ${result.action}\n\n${t.ignoreThis}: ${result.ignore}\n\n${t.reframe}: ${result.reframe}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    const link = storage.getShareableLink(result);
    if (navigator.share) {
      navigator.share({
        title: t.title,
        text: `${t.nextAction}: ${result.action}`,
        url: link
      });
    } else {
      navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Type Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-center gap-2"
      >
        <span className="text-3xl">{typeIcons[result.type]}</span>
        <span className="px-4 py-2 rounded-full bg-primary/10 dark:bg-primary/20 text-primary font-display font-bold">
          {t.types[result.type]}
        </span>
      </motion.div>

      {/* Main Cards */}
      <div className="space-y-4">
        {/* Action */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-white shadow-xl"
        >
          <h3 className="font-display font-bold text-sm uppercase tracking-wide mb-3 opacity-90">
            {t.nextAction}
          </h3>
          <p className="font-body text-lg leading-relaxed">
            {result.action}
          </p>
        </motion.div>

        {/* Ignore */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-2xl bg-light-surface dark:bg-dark-surface border-2 border-light-border dark:border-dark-border"
        >
          <h3 className="font-display font-bold text-sm uppercase tracking-wide mb-3 text-gray-600 dark:text-gray-400">
            {t.ignoreThis}
          </h3>
          <p className="font-body text-lg leading-relaxed text-gray-700 dark:text-gray-300 line-through opacity-60">
            {result.ignore}
          </p>
        </motion.div>

        {/* Reframe */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 rounded-2xl bg-light-surface dark:bg-dark-surface border-2 border-primary/30 dark:border-primary/30"
        >
          <h3 className="font-display font-bold text-sm uppercase tracking-wide mb-3 text-gray-600 dark:text-gray-400">
            {t.reframe}
          </h3>
          <p className="font-body text-lg leading-relaxed text-gray-900 dark:text-white font-medium">
            {result.reframe}
          </p>
        </motion.div>
      </div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-wrap gap-3 justify-center"
      >
        <button
          onClick={handleCopy}
          className="px-6 py-3 rounded-xl bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border hover:border-primary dark:hover:border-primary text-gray-700 dark:text-gray-300 font-display transition-colors"
        >
          {copied ? t.copied : t.copy}
        </button>

        <button
          onClick={handleShare}
          className="px-6 py-3 rounded-xl bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border hover:border-primary dark:hover:border-primary text-gray-700 dark:text-gray-300 font-display transition-colors"
        >
          {t.share}
        </button>

        <button
          onClick={onNewSession}
          className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-display font-bold transition-colors"
        >
          {t.newSession}
        </button>
      </motion.div>
    </div>
  );
};

export default ResultCard;
