// Light and Dark theme toggle persisted in localStorage across all pages
(function () {
  const THEME_KEY = "apes_theme";

  function applyTheme(theme) {
    const isDark = theme === "dark";
    document.body.classList.toggle("dark-mode", isDark);

    const toggleBtn = document.querySelector("#theme-toggle");
    if (toggleBtn) {
      toggleBtn.textContent = isDark ? "☀️ Light" : "🌙 Dark";
      toggleBtn.setAttribute("aria-pressed", String(isDark));
      toggleBtn.setAttribute("title", isDark ? "Switch to light mode" : "Switch to dark mode");
    }
  }

  function loadTheme() {
    let savedTheme = "light";
    try {
      const stored = localStorage.getItem(THEME_KEY);
      if (stored === "dark" || stored === "light") {
        savedTheme = stored;
      }
    } catch (e) {
      savedTheme = "light";
    }
    applyTheme(savedTheme);
  }

  const themeBtn = document.querySelector("#theme-toggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      const nextTheme = document.body.classList.contains("dark-mode") ? "light" : "dark";
      try {
        localStorage.setItem(THEME_KEY, nextTheme);
      } catch (e) {
        // Ignore storage errors
      }
      applyTheme(nextTheme);
    });
  }

  loadTheme();
})();
