import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useLanguage from './hooks/useLanguage';
import useTimer from './hooks/useTimer';
import storage from './utils/storage';
import api from './services/api';
import LanguageSelector from './components/LanguageSelector';
import ThemeToggle from './components/ThemeToggle';
import InputForm from './components/InputForm';
import ResultCard from './components/ResultCard';
import Timer from './components/Timer';
import './App.css';

function App() {
  const { language, setLanguage, t } = useLanguage();
  const [theme, setTheme] = useState(storage.getTheme());
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const timer = useTimer(300); // 5 minutes

  useEffect(() => {
    // Apply theme class to document
    document.documentElement.classList.toggle('dark', theme === 'dark');
    storage.setTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleSubmit = async (userInput) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await api.getCoaching(userInput, language);
      
      if (response.success) {
        const sessionData = {
          input: userInput,
          language,
          ...response.data
        };
        
        setResult(sessionData);
        storage.saveSession(sessionData);
      }
    } catch (err) {
      if (err.message === 'OFFLINE') {
        setError(t.errors.offline);
      } else {
        setError(t.errors.apiError);
      }
      console.error('Coaching error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewSession = () => {
    setResult(null);
    setError(null);
    timer.reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-bg to-slate-100 dark:from-dark-bg dark:to-slate-900 transition-colors duration-300">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 dark:bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-display text-xl">→</span>
            </div>
            <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
              {t.title}
            </h1>
          </motion.div>

          <div className="flex items-center gap-3">
            <LanguageSelector 
              current={language} 
              onChange={setLanguage}
            />
            <ThemeToggle 
              theme={theme} 
              onToggle={toggleTheme}
              label={theme === 'dark' ? t.lightMode : t.darkMode}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-12 max-w-4xl">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-4">
                  {t.title}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  {t.subtitle}
                </p>
              </div>

              <InputForm 
                onSubmit={handleSubmit}
                isLoading={isLoading}
                error={error}
                t={t}
              />
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <ResultCard 
                result={result}
                t={t}
                onNewSession={handleNewSession}
              />

              <Timer 
                timer={timer}
                t={t}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="relative z-10 container mx-auto px-4 py-8 mt-20">
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            {t.footer.made} <span className="text-primary">❤️</span> {t.footer.by} Peter
          </p>
          <div className="flex items-center justify-center gap-4 mt-2">
            <a href="#" className="hover:text-primary transition-colors">
              {t.footer.privacy}
            </a>
            <span>•</span>
            <a href="#" className="hover:text-primary transition-colors">
              {t.footer.terms}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
