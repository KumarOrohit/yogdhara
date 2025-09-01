export function applyTheme(theme: any) {
  const root = document.documentElement;

  root.style.setProperty("--bg-color", theme.background);
  root.style.setProperty("--primary-color", theme.primary);
  root.style.setProperty("--secondary-color", theme.secondary);
  root.style.setProperty("--text-color", theme.text);
  root.style.setProperty("--text-light", theme.textLight);
}
