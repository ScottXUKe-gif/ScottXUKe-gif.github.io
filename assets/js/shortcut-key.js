// Keep the search icon compact; expose the platform shortcut accessibly.
document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("search-toggle");
  if (!button) return;
  const isMac = navigator.platform.toUpperCase().includes("MAC");
  button.title = isMac ? "Search (⌘ K)" : "Search (Ctrl K)";
  button.setAttribute("aria-keyshortcuts", isMac ? "Meta+K" : "Control+K");
});
