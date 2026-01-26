// gerenciamento de tema 
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.currentTheme = this.getStoredTheme() || this.getSystemTheme();
        this.init();
    }

    init() {
        this.setTheme(this.currentTheme);
        this.bindEvents();
        this.addThemeTransition();
    }

    getStoredTheme() {
        return localStorage.getItem('theme');
    }

    getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    setTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.updateThemeToggle();
    }

    updateThemeToggle() {
        const isDark = this.currentTheme === 'dark';
        this.themeToggle.setAttribute('aria-label',
            isDark ? 'Mudar para tema claro' : 'Mudar para tema escuro'
        );
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        this.addToggleAnimation();
    }

    addToggleAnimation() {
        const thumb = this.themeToggle.querySelector('.toggle-thumb');
        thumb.style.transform += ' scale(0.9)';
        setTimeout(() => {
            thumb.style.transform = thumb.style.transform.replace(' scale(0.9)', '');
        }, 150);
    }

    addThemeTransition() {
        const style = document.createElement('style');
        style.textContent = `
            * {
                transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease !important;
            }
        `;
        document.head.appendChild(style);

        setTimeout(() => {
            style.remove();
        }, 300);
    }

    bindEvents() {
        this.themeToggle.addEventListener('click', () => this.toggleTheme());

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!this.getStoredTheme()) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
}

// Gerenciamento de animações e interações
class AnimationManager {
    constructor() {
        this.init();
    }

    init() {
        this.addScrollAnimations();
        this.addHoverEffects();
        this.addClickAnimations();
        this.setupIntersectionObserver();
        this.addParallaxEffect();
    }

    addScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.skill-item, .social-btn, .stat-item').forEach(el => {
            observer.observe(el);
        });
    }

    addHoverEffects() {
        const profileImage = document.querySelector('.profile-avatar img');
        const skillItems = document.querySelectorAll('.skill-item');
        const socialBtns = document.querySelectorAll('.social-btn');

        profileImage.addEventListener('mousemove', (e) => {
            const rect = profileImage.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            const rotateX = (y / rect.height) * 15;
            const rotateY = (x / rect.width) * -15;
            profileImage.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });

        profileImage.addEventListener('mouseleave', () => {
            profileImage.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
        });

        skillItems.forEach(item => {
            item.addEventListener('click', (e) => {
                this.createRippleEffect(e, item);
            });
        });

        socialBtns.forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                this.addShineEffect(btn);
            });
        });
    }

    createRippleEffect(event, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        if (!document.querySelector('#ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-styles';
            style.textContent = `
                .ripple {
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(59, 130, 246, 0.3);
                    transform: scale(0);
                    animation: ripple-animation 0.6s linear;
                    pointer-events: none;
                    z-index: 1;
                }
                @keyframes ripple-animation {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    addShineEffect(element) {
        const shine = document.createElement('div');
        shine.classList.add('shine-effect');

        if (!document.querySelector('#shine-styles')) {
            const style = document.createElement('style');
            style.id = 'shine-styles';
            style.textContent = `
                .shine-effect {
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
                    animation: shine-animation 0.8s ease-out;
                    pointer-events: none;
                    z-index: 1;
                }
                @keyframes shine-animation {
                    0% { left: -100%; }
                    100% { left: 100%; }
                }
            `;
            document.head.appendChild(style);
        }

        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(shine);

        setTimeout(() => {
            shine.remove();
        }, 800);
    }

    addClickAnimations() {
        const socialBtns = document.querySelectorAll('.social-btn');
        const skillItems = document.querySelectorAll('.skill-item');

        [...socialBtns, ...skillItems].forEach(element => {
            element.addEventListener('click', (e) => {
                element.style.transform += ' scale(0.95)';
                setTimeout(() => {
                    element.style.transform = element.style.transform.replace(' scale(0.95)', '');
                }, 150);
            });
        });
    }

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -20px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        const style = document.createElement('style');
        style.textContent = `
            .skill-item,
            .stat-item {
                opacity: 0;
                transform: translateY(20px);
                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .skill-item.animate-in,
            .stat-item.animate-in {
                opacity: 1;
                transform: translateY(0);
            }
        `;
        document.head.appendChild(style);

        document.querySelectorAll('.skill-item, .stat-item').forEach((item, index) => {
            setTimeout(() => {
                observer.observe(item);
            }, index * 100);
        });
    }

    addParallaxEffect() {
        const profileCard = document.querySelector('.profile-card');

        document.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;
            const xPos = (clientX / innerWidth - 0.5) * 20;
            const yPos = (clientY / innerHeight - 0.5) * 20;
            profileCard.style.transform = `perspective(1000px) rotateX(${yPos * 0.1}deg) rotateY(${xPos * 0.1}deg)`;
        });

        document.addEventListener('mouseleave', () => {
            profileCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        });
    }
}

// Gerenciamento de dados do perfil
class ProfileManager {
    constructor() {
        this.profileData = {
            name: 'Marcos Gabriel Fernandes Vicente',
            role: 'Desenvolvedor Front End',
            location: 'Diadema, São Paulo',
            about: [
                'Olá me chamo Gabriel Fernandes, sou um desenvolvedor apaixonado por tecnologia com apenas 4 anos de experiência em desenvolvimento web.',
                'Sempre em busca de novos desafios e oportunidades para crescer profissionalmente em diversas áreas da tecnologia.'
            ],
            skills: [
                { name: 'JavaScript', icon: 'JS' },
                { name: 'React', icon: '⚛️' },
                { name: 'Node.js', icon: '📦' },
                // { name: 'Python', icon: '🐍' },
                { name: 'TypeScript', icon: 'TS' },
                { name: 'CSS3', icon: '🎨' }
            ],
            socialLinks: {
                github: 'https://github.com/Gabbfernyh',
                linkedin: 'https://linkedin.com',
                // whatsapp: 'https://wa.me/5511999999999'
            },
            stats: [
                { number: '4', label: 'Anos de Experiência' },
                { number: '20+', label: 'Projetos Concluídos', id: 'github-projects' }, // Adicionado ID para alvo da API
                { number: '100%', label: 'Dedicação' }
            ]
        };
        this.init();
    }

    // Tornamos o init assíncrono para aguardar a API antes de animar
    async init() {
        this.loadStoredData();
        this.setupImageUpload();

        // INTEGRAÇÃO API GITHUB
        await this.syncGithubRepos();

        this.addCounterAnimation();
    }

    // Novo método para sincronizar os dados reais
    async syncGithubRepos() {
        try {
            const stats = await getGithubStats('Gabbfernyh');
            const projectStat = document.getElementById('github-projects');
            if (projectStat) {
                projectStat.textContent = stats;
                // Atualizamos o dado do objeto interno também
                this.profileData.stats[1].number = stats;
            }
        } catch (e) {
            console.warn("Usando valor padrão para projetos.");
        }
    }

    loadStoredData() {
        const stored = localStorage.getItem('profileData');
        if (stored) {
            this.profileData = { ...this.profileData, ...JSON.parse(stored) };
            this.updateDisplay();
        }
    }

    updateDisplay() {
        const nameEl = document.querySelector('.profile-name');
        const roleEl = document.querySelector('.profile-role');
        const locationEl = document.querySelector('.profile-location span');
        const aboutEls = document.querySelectorAll('.about-section p');

        if (nameEl) nameEl.textContent = this.profileData.name;
        if (roleEl) roleEl.textContent = this.profileData.role;
        if (locationEl) locationEl.textContent = this.profileData.location;

        if (aboutEls.length >= 2) {
            aboutEls[0].textContent = this.profileData.about[0];
            aboutEls[1].textContent = this.profileData.about[1];
        }
    }

    setupImageUpload() {
        const profileImg = document.getElementById('profileImg');

        profileImg.addEventListener('dragover', (e) => {
            e.preventDefault();
            profileImg.style.opacity = '0.7';
        });

        profileImg.addEventListener('dragleave', () => {
            profileImg.style.opacity = '1';
        });

        profileImg.addEventListener('drop', (e) => {
            e.preventDefault();
            profileImg.style.opacity = '1';
            const files = e.dataTransfer.files;
            if (files.length > 0 && files[0].type.startsWith('image/')) {
                this.handleImageUpload(files[0]);
            }
        });
    }

    handleImageUpload(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const profileImg = document.getElementById('profileImg');
            profileImg.src = e.target.result;
            localStorage.setItem('profileImage', e.target.result);
        };
        reader.readAsDataURL(file);
    }

    addCounterAnimation() {
        const statNumbers = document.querySelectorAll('.stat-number');

        const animateCounter = (element, target) => {
            const isPercentage = target.includes('%');
            const isPlus = target.includes('+');
            const numericValue = parseInt(target.replace(/[^\d]/g, ''));

            let current = 0;
            const increment = numericValue / 50;

            const timer = setInterval(() => {
                current += increment;
                if (current >= numericValue) {
                    current = numericValue;
                    clearInterval(timer);
                }

                let displayValue = Math.floor(current);
                if (isPercentage) displayValue += '%';
                if (isPlus && current >= numericValue) displayValue += '+';

                element.textContent = displayValue;
            }, 30);
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target.getAttribute('data-target') || entry.target.textContent;
                    animateCounter(entry.target, target);
                    observer.unobserve(entry.target);
                }
            });
        });

        statNumbers.forEach(stat => {
            stat.setAttribute('data-target', stat.textContent);
            stat.textContent = '0';
            observer.observe(stat);
        });
    }
}

// Utilitários e Inicialização permanecem os mesmos...
class Utils {
    static copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showNotification('Link copiado para a área de transferência!');
        });
    }

    static showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification {
                    position: fixed; top: 20px; right: 20px; padding: 12px 24px;
                    border-radius: 12px; color: white; font-weight: 500; z-index: 1000;
                    animation: slideInRight 0.3s ease; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                }
                .notification.success { background: linear-gradient(135deg, #10b981, #059669); }
                @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
            `;
            document.head.appendChild(style);
        }
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Inicialização Final
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
    new AnimationManager();
    new ProfileManager();
});