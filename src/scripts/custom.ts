// Custom TypeScript goes in here.
import "#src/scripts/asciiArt.js";
import '#src/scripts/multiFileUpload.js';

document.querySelectorAll('[data-module="back-link"]').forEach((link) => {
  // prevent ERR_CACHE_MISS (Confirm Form Resubmission) error
  window.history.replaceState(null, "", window.location.href);

  link.addEventListener("click", (event) => {
    event.preventDefault();
    window.history.back();
  });
});
