// js/layout.js
document.addEventListener("DOMContentLoaded", function () {
  const headerContainer = document.getElementById("site-header");
  const footerContainer = document.getElementById("site-footer");

  // Adjust paths if your HTML pages sit in subfolders
  const headerPath = "partials/header.html";
  const footerPath = "partials/footer.html";

  if (headerContainer) {
    fetch(headerPath)
      .then((res) => res.text())
      .then((html) => {
        headerContainer.innerHTML = html;
      })
      .catch((err) => console.error("Header load error:", err));
  }

  if (footerContainer) {
    fetch(footerPath)
      .then((res) => res.text())
      .then((html) => {
        footerContainer.innerHTML = html;
        // Ensure the year script runs even if it was in the partial
        const y = document.getElementById("footer-year");
        if (y) y.textContent = new Date().getFullYear();
      })
      .catch((err) => console.error("Footer load error:", err));
  }
});
