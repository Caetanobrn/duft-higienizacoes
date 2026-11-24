
document.addEventListener("DOMContentLoaded", () => {

    /* ========================================
       MENU MOBILE
    ======================================== */

    const menuToggle = document.querySelector(".menu-toggle");
    const navigation = document.querySelector(".navigation");
    const navLinks = document.querySelectorAll(".navigation a");

    function closeMenu() {
        if (!menuToggle || !navigation) return;

        menuToggle.classList.remove("active");
        navigation.classList.remove("active");

        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Abrir menu");
    }

    if (menuToggle && navigation) {

        menuToggle.addEventListener("click", () => {

            const isOpen = navigation.classList.toggle("active");

            menuToggle.classList.toggle("active", isOpen);
            menuToggle.setAttribute("aria-expanded", String(isOpen));
            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Fechar menu" : "Abrir menu"
            );

        });

    }

    navLinks.forEach(link => {
        link.addEventListener("click", closeMenu);
    });


    /* ========================================
       NAVEGAÇÃO E CORREÇÃO DA LOGO
    ======================================== */

    const internalLinks = document.querySelectorAll('a[href^="#"]');

    internalLinks.forEach(link => {

        link.addEventListener("click", event => {

            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);

            if (!target) return;

            event.preventDefault();

            closeMenu();

            const header = document.querySelector(".header");
            const headerHeight = header ? header.offsetHeight : 0;

            const targetPosition =
                target.getBoundingClientRect().top +
                window.scrollY -
                headerHeight;

            window.scrollTo({
                top: Math.max(0, targetPosition),
                behavior: "smooth"
            });

            /*
             * Atualiza o endereço da página sem provocar
             * uma segunda navegação ou interromper a rolagem.
             */
            if (history.pushState) {
                history.pushState(null, "", targetId);
            }

        });

    });


    /*
     * Garante que a logo sempre leve ao início,
     * mesmo se o usuário já estiver no início da página.
     */

    const logos = document.querySelectorAll(".logo, .footer-logo");

    logos.forEach(logo => {

        logo.addEventListener("click", event => {

            event.preventDefault();

            closeMenu();

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

            if (history.pushState) {
                history.pushState(null, "", "#inicio");
            }

        });

    });


    /* ========================================
       FECHAR MENU AO CLICAR FORA
    ======================================== */

    document.addEventListener("click", event => {

        if (!menuToggle || !navigation) return;

        const clickedInsideMenu = navigation.contains(event.target);
        const clickedToggle = menuToggle.contains(event.target);

        if (!clickedInsideMenu && !clickedToggle) {
            closeMenu();
        }

    });


    /* ========================================
       ANO AUTOMÁTICO NO RODAPÉ
    ======================================== */

    const currentYear = document.getElementById("current-year");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }


    /* ========================================
       COMPARADORES ANTES E DEPOIS
    ======================================== */

    const comparisonCards = document.querySelectorAll(".comparison-card");

    function updateComparison(card, value) {

        const beforeWrap = card.querySelector(".comparison-before-wrap");

        if (!beforeWrap) return;

        const percentage = Math.min(100, Math.max(0, Number(value)));

        beforeWrap.style.clipPath =
            `inset(0 ${100 - percentage}% 0 0)`;

    }

    comparisonCards.forEach(card => {

        const range = card.querySelector(".comparison-range");

        if (!range) return;

        updateComparison(card, range.value);

        range.addEventListener("input", () => {
            updateComparison(card, range.value);
        });

    });


    /* ========================================
       LIGHTBOX - AMPLIAR COMPARAÇÕES
    ======================================== */

    const lightbox = document.getElementById("comparisonLightbox");
    const lightboxClose = document.querySelector(".lightbox-close");

    const lightboxStage = document.querySelector(".lightbox-stage");
    const lightboxBefore = document.querySelector(".lightbox-before");
    const lightboxAfter = document.querySelector(".lightbox-after");
    const lightboxBeforeWrap = document.querySelector(".lightbox-before-wrap");
    const lightboxRange = document.querySelector(".lightbox-range");

    let previousScrollPosition = 0;


    function updateLightboxComparison(value) {

        if (!lightboxBeforeWrap) return;

        const percentage = Math.min(100, Math.max(0, Number(value)));

        lightboxBeforeWrap.style.clipPath =
            `inset(0 ${100 - percentage}% 0 0)`;

    }


    function openLightbox(card) {

        if (!lightbox) return;

        const beforeImage = card.querySelector(".comparison-before");
        const afterImage = card.querySelector(".comparison-after");
        const range = card.querySelector(".comparison-range");

        if (!beforeImage || !afterImage) return;

        lightboxBefore.src = beforeImage.src;
        lightboxAfter.src = afterImage.src;

        lightboxBefore.alt = beforeImage.alt;
        lightboxAfter.alt = afterImage.alt;

        const currentValue = range ? range.value : 50;

        lightboxRange.value = currentValue;

        updateLightboxComparison(currentValue);

        previousScrollPosition = window.scrollY;

        lightbox.classList.add("active");
        lightbox.setAttribute("aria-hidden", "false");

        document.body.classList.add("lightbox-open");

        if (lightboxClose) {
            lightboxClose.focus();
        }

    }


    function closeLightbox() {

        if (!lightbox) return;

        lightbox.classList.remove("active");
        lightbox.setAttribute("aria-hidden", "true");

        document.body.classList.remove("lightbox-open");

        window.scrollTo({
            top: previousScrollPosition,
            behavior: "instant"
        });

    }


    /*
     * Clique na imagem abre a comparação ampliada.
     */

    comparisonCards.forEach(card => {

        const stage = card.querySelector(".comparison-stage");

        if (!stage) return;

        stage.addEventListener("click", () => {
            openLightbox(card);
        });

        stage.addEventListener("keydown", event => {

            if (event.key === "Enter" || event.key === " ") {

                event.preventDefault();

                openLightbox(card);

            }

        });

    });


    /*
     * Controle da comparação dentro do lightbox.
     */

    if (lightboxRange) {

        lightboxRange.addEventListener("input", () => {
            updateLightboxComparison(lightboxRange.value);
        });

    }


    /*
     * Botão de fechar.
     */

    if (lightboxClose) {

        lightboxClose.addEventListener("click", closeLightbox);

    }


    /*
     * Clique no fundo escuro fecha a ampliação.
     */

    if (lightbox) {

        lightbox.addEventListener("click", event => {

            if (event.target === lightbox) {
                closeLightbox();
            }

        });

    }


    /*
     * Tecla ESC fecha a ampliação.
     */

    document.addEventListener("keydown", event => {

        if (event.key === "Escape" && lightbox?.classList.contains("active")) {
            closeLightbox();
        }

    });


    /* ========================================
       ANIMAÇÕES AO ROLAR A PÁGINA
    ======================================== */

    const revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {

        const observer = new IntersectionObserver((entries, currentObserver) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                    currentObserver.unobserve(entry.target);

                }

            });

        }, {
            threshold: 0.12,
            rootMargin: "0px 0px -30px 0px"
        });


        revealElements.forEach(element => {
            observer.observe(element);
        });

    } else {

        revealElements.forEach(element => {
            element.classList.add("visible");
        });

    }


    /* ========================================
       IMAGENS: TRATAMENTO DE ERROS
    ======================================== */

    document.querySelectorAll("img").forEach(image => {

        image.addEventListener("error", () => {

            console.warn("Não foi possível carregar a imagem:", image.src);

        });

    });

});
