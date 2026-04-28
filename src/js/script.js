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
                showToast("Nao foi possivel copiar");
            }
        });
    });
}

function wireForm() {
    const form = document.getElementById("quoteForm");
    if (!form) return;

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const data = new FormData(form);
        const nome = data.get("nome");
        const contato = data.get("contato");
        const servico = data.get("servico");
        const objetivo = data.get("objetivo");

        const text = [
            "Ola, Gabriel! Quero solicitar uma proposta.",
            `Nome: ${nome}`,
            `Contato: ${contato}`,
            `Servico: ${servico}`,
            `Objetivo: ${objetivo}`,
        ].join("\n");

        const phone = "5511999999999";
        const link = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
        window.open(link, "_blank", "noopener,noreferrer");
        showToast("Formulario enviado para WhatsApp");
        form.reset();
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
    wireForm();
});
