const STORAGE_KEYS = {
  SESSIONS: 'overthinking_sessions',
  LANGUAGE: 'overthinking_language',
  THEME: 'overthinking_theme',
};

const MAX_SESSIONS = 20; // Keep last 20 sessions

class StorageService {
  // Sessions
  getSessions() {
    try {
      const sessions = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      return sessions ? JSON.parse(sessions) : [];
    } catch {
      return [];
    }
  }

  saveSession(session) {
    try {
      const sessions = this.getSessions();
      
      const newSession = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...session
      };
      
      sessions.unshift(newSession);
      
      // Keep only last MAX_SESSIONS
      const trimmed = sessions.slice(0, MAX_SESSIONS);
      
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(trimmed));
      return newSession;
    } catch (error) {
      console.error('Failed to save session:', error);
      return null;
    }
  }

  clearSessions() {
    try {
      localStorage.removeItem(STORAGE_KEYS.SESSIONS);
      return true;
    } catch {
      return false;
    }
  }

  // Language
  getLanguage() {
    try {
      return localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'en';
    } catch {
      return 'en';
    }
  }

  setLanguage(language) {
    try {
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
      return true;
    } catch {
      return false;
    }
  }

  // Theme
  getTheme() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      if (saved) return saved;
      
      // Auto-detect from system preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
      return 'light';
    } catch {
      return 'light';
    }
  }

  setTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
      return true;
    } catch {
      return false;
    }
  }

  // Share session
  getShareableLink(session) {
    try {
      // Encode session data in URL (limited to basic info)
      const params = new URLSearchParams({
        type: session.type,
        lang: session.language
      });
      
      return `${window.location.origin}?${params.toString()}`;
    } catch {
      return window.location.origin;
    }
  }
}

export default new StorageService();
