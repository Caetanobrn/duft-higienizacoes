
document.addEventListener("DOMContentLoaded", () => {
  // Ano automático no rodapé
  const yearElement = document.getElementById("current-year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Menu mobile
  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".navigation");

  if (menuToggle && navigation) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navigation.classList.toggle("open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Fechar menu" : "Abrir menu"
      );
    });

    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navigation.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Abrir menu");
      });
    });

    document.addEventListener("click", (event) => {
      const clickedInsideMenu = navigation.contains(event.target);
      const clickedToggle = menuToggle.contains(event.target);

      if (!clickedInsideMenu && !clickedToggle) {
        navigation.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Abrir menu");
      }
    });
  }

  // Galeria com visualização ampliada
  const lightbox = document.querySelector(".lightbox");
  const lightboxImage = lightbox?.querySelector("img");
  const closeButton = lightbox?.querySelector(".lightbox-close");
  const previousButton = lightbox?.querySelector(".lightbox-prev");
  const nextButton = lightbox?.querySelector(".lightbox-next");
  const counter = lightbox?.querySelector(".lightbox-counter");

  const images = Array.from(
    document.querySelectorAll(".clickable-image")
  );

  let currentImageIndex = 0;
  let previousFocus = null;

  function updateLightbox() {
    if (!lightboxImage || !counter) return;

    const selectedImage = images[currentImageIndex];

    lightboxImage.src = selectedImage.currentSrc || selectedImage.src;
    lightboxImage.alt = selectedImage.alt || "Imagem ampliada";

    counter.textContent = `${currentImageIndex + 1} / ${images.length}`;

    const multipleImages = images.length > 1;

    previousButton.hidden = !multipleImages;
    nextButton.hidden = !multipleImages;
  }

  function openLightbox(index) {
    if (!lightbox || !images.length) return;

    currentImageIndex = index;
    previousFocus = document.activeElement;

    updateLightbox();

    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");

    closeButton?.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;

    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");

    if (previousFocus && typeof previousFocus.focus === "function") {
      previousFocus.focus();
    }
  }

  function showNextImage() {
    if (!images.length) return;

    currentImageIndex = (currentImageIndex + 1) % images.length;
    updateLightbox();
  }

  function showPreviousImage() {
    if (!images.length) return;

    currentImageIndex =
      (currentImageIndex - 1 + images.length) % images.length;

    updateLightbox();
  }

  images.forEach((image, index) => {
    image.addEventListener("click", () => openLightbox(index));
  });

  // Também permite abrir imagens da galeria pelo botão externo
  document.querySelectorAll(".gallery-photo").forEach((button) => {
    button.addEventListener("click", () => {
      const image = button.querySelector("img");
      const index = images.indexOf(image);

      if (index !== -1) {
        openLightbox(index);
      }
    });
  });

  closeButton?.addEventListener("click", closeLightbox);
  nextButton?.addEventListener("click", showNextImage);
  previousButton?.addEventListener("click", showPreviousImage);

  // Fecha ao clicar no fundo escuro
  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  // Navegação pelo teclado
  document.addEventListener("keydown", (event) => {
    if (!lightbox?.classList.contains("active")) return;

    if (event.key === "Escape") {
      closeLightbox();
    }

    if (event.key === "ArrowRight") {
      showNextImage();
    }

    if (event.key === "ArrowLeft") {
      showPreviousImage();
    }
  });

  // Garante que botões de navegação ocultos não recebam foco
  if (previousButton && nextButton) {
    previousButton.hidden = true;
    nextButton.hidden = true;
  }
});
