// Theme management
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

// Set initial theme based on system preference
const setInitialTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    html.setAttribute('data-theme', savedTheme);
  } else {
    const theme = prefersDark.matches ? 'dark' : 'light';
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }
};

// Toggle theme
const toggleTheme = () => {
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
};

// Event listeners
themeToggle.addEventListener('click', toggleTheme);
prefersDark.addEventListener('change', (e) => {
  const theme = e.matches ? 'dark' : 'light';
  html.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
});

// Initialize theme
setInitialTheme();