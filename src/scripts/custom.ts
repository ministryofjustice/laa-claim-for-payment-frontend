// Custom TypeScript goes in here.
import "#src/scripts/asciiArt.js";
import '#src/scripts/multiFileUpload.js';

document.querySelectorAll('[data-module="back-link"]').forEach((link) => {
  if (window.history) {
    // prevent resubmit warning
    if (window.history.replaceState && typeof window.history.replaceState === 'function') {
      window.history.replaceState(null, "", window.location.href);
    }

    link.addEventListener('click', (event) => {
      event.preventDefault();
      if (window.history.back && typeof window.history.back === 'function') {
        window.history.back();
      }
    });
  }
});
