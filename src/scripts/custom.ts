// Custom TypeScript goes in here.
import "#src/scripts/asciiArt.js";
import '#src/scripts/multiFileUpload.js';

document.querySelectorAll('[data-module="back-link"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    window.history.back();
  });
});
