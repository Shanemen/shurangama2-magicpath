import { useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import themeSettings from './settings/theme';
import { Theme } from './settings/types';
import ScriptureAnalysisPlatform from "./components/generated/ScriptureAnalysisPlatform.tsx";
import BlogPage from './components/Blog/BlogPage';

function App() {
  function setTheme(theme: Theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  setTheme(themeSettings.theme);

  const AppContent = () => {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<ScriptureAnalysisPlatform />} />
          <Route path="/blog" element={<BlogPage />} />
        </Routes>
      </Router>
    );
  };

  if (themeSettings.container === 'centered') {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center">
        <AppContent />
      </div>
    );
  } else {
    return <AppContent />;
  }
}

export default App;
