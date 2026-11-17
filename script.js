document.getElementById("y").textContent = new Date().getFullYear();
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
}
document.querySelectorAll(".gallery button[data-full]").forEach((button) =>
  button.addEventListener("click", () => {
    lightboxImage.src = button.dataset.full;
    lightboxImage.alt = button.querySelector("img").alt;
    lightboxCaption.textContent = button.dataset.caption || "";
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
  }),
);
document
  .getElementById("closeLightbox")
  .addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeLightbox();
});

// Visitor counter: hitung maksimal satu kunjungan per browser setiap 24 jam.
// Ganti namespace/key jika ingin memakai identitas counter milik sendiri.
(async function loadVisitorCounter() {
  const countEl = document.getElementById("visitorCount");
  const statusEl = document.getElementById("visitorStatus");
  const endpoint =
    "https://api.counterapi.dev/v1/ardiyanto-bijaksono-portfolio/visitors";
  const visitKey = "ab_portfolio_last_counted";
  const oneDay = 24 * 60 * 60 * 1000;

  try {
    const lastCounted = Number(localStorage.getItem(visitKey) || 0);
    const shouldCount = !lastCounted || Date.now() - lastCounted >= oneDay;
    const response = await fetch(endpoint + (shouldCount ? "/up" : "/"), {
      method: "GET",
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Counter service unavailable");
    const data = await response.json();
    const total = Number(data.count ?? data.value);
    if (!Number.isFinite(total)) throw new Error("Invalid counter response");

    countEl.textContent = total.toLocaleString("id-ID");
    statusEl.textContent = "Terima kasih sudah berkunjung";
    if (shouldCount) localStorage.setItem(visitKey, String(Date.now()));
  } catch (error) {
    countEl.textContent = "—";
    statusEl.textContent = "Statistik pengunjung belum tersedia";
    console.error("Visitor counter:", error);
  }
})();
