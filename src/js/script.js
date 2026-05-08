class AvatarCarousel {
    constructor() {
        this.root = document.querySelector("[data-avatar-carousel]");
        if (!this.root) return;

        this.slides = Array.from(this.root.querySelectorAll("[data-avatar-slide]"));
        this.interval = Number(this.root.dataset.interval || 6000);
        this.index = 0;
        this.timer = null;

        if (this.slides.length > 1) this.start();
    }

    start() {
        this.timer = setInterval(() => this.next(), this.interval);
        this.root.addEventListener("mouseenter", () => clearInterval(this.timer));
        this.root.addEventListener("mouseleave", () => this.start(), { once: true });
    }

    next() {
        this.slides[this.index].classList.remove("is-active");
        this.index = (this.index + 1) % this.slides.length;
        this.slides[this.index].classList.add("is-active");
    }
}

class HorizontalSlider {
    constructor(root) {
        this.root = root;
        this.track = root.querySelector("[data-track]");
        this.prev = root.querySelector("[data-prev]");
        this.next = root.querySelector("[data-next]");
        if (!this.track || !this.prev || !this.next) return;

        this.bindEvents();
    }

    bindEvents() {
        this.prev.addEventListener("click", () => this.scrollByCard(-1));
        this.next.addEventListener("click", () => this.scrollByCard(1));
    }

    scrollByCard(direction) {
        const firstCard = this.track.firstElementChild;
        if (!firstCard) return;

        const gap = Number.parseFloat(getComputedStyle(this.track).columnGap || "12");
        const amount = firstCard.getBoundingClientRect().width + gap;

        this.track.scrollBy({
            left: amount * direction,
            behavior: "smooth",
        });
    }
}

async function syncGithubProjects() {
    const target = document.getElementById("github-projects");
    if (!target || typeof getGithubStats !== "function") return;

    const repos = await getGithubStats();
    if (repos !== null) target.textContent = repos;
}

function wireCopyButtons() {
    document.querySelectorAll("[data-copy]").forEach((btn) => {
        btn.addEventListener("click", async () => {
            const value = btn.getAttribute("data-copy");
            if (!value) return;
            try {
                await navigator.clipboard.writeText(value);
                showToast("Copiado com sucesso");
            } catch (err) {
                showToast("Não foi possível copiar");
            }
        });
    });
}

function wireForm() {
    const form = document.getElementById("quoteForm");
    if (!form) return;

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const submitButton = form.querySelector('button[type="submit"]');
        const data = new FormData(form);

        if (submitButton) submitButton.disabled = true;

        try {
            const response = await fetch(form.action, {
                method: form.method,
                body: data,
                headers: {
                    Accept: "application/json",
                },
            });

            if (!response.ok) throw new Error("Falha no envio");

            showToast("Formulário enviado com sucesso");
            form.reset();
        } catch (err) {
            showToast("Não foi possível enviar o formulário");
        } finally {
            if (submitButton) submitButton.disabled = false;
        }
    });
}

function wireProjectPlaceholders() {
    document.querySelectorAll(".project-link-placeholder").forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            showToast("Adicione a URL real deste projeto para liberar o acesso");
        });
    });
}

function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 2200);
}

document.addEventListener("DOMContentLoaded", async () => {
    new AvatarCarousel();
    document.querySelectorAll("[data-slider]").forEach((el) => new HorizontalSlider(el));
    await syncGithubProjects();
    wireCopyButtons();
    wireProjectPlaceholders();
    wireForm();
});
