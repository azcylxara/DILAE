// Dados para os eixos temáticos
const eixosTematicos = [
    {
        titulo: "1. Interculturalidade, Educação e Inclusão na Pan-Amazônia",
        descricao: "Este eixo acolhe trabalhos que investiguem a relação entre literatura, cultura e identidade na Amazônia, incluindo narrativas literárias que abordem o insólito ficcional",
        icone: "fas fa-laptop-code"
    },
    {
        titulo: "2. Discursos contemporâneos na Amazônia: gênero, políticas e resistências",
        descricao: "Discussões sobre práticas discursivas, representações de gênero e movimentos de resistência na Amazônia.",
        icone: "fas fa-users"
    },
    {
        titulo: "3. Artes, interculturalidades e Processos de criação na Pan-Amazônia",
        descricao: "Estudos voltados às manifestações artísticas e processos criativos integrados.",
        icone: "fas fa-palette"
    },
    {
        titulo: "4. Imaginários e narrativas amazônicas: culturas, memórias e identidades",
        descricao: "Narrativas orais e escritas que salvaguardam a memória cultural pan-amazônica.",
        icone: "fas fa-book-open"
    }
];

// Inicializar carrossel
(function() {
    const track = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicators = document.querySelectorAll('.indicator');
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;

    let currentIndex = 0;

    function updateCarousel(index) {
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;
        currentIndex = index;

        const offset = -currentIndex * 100;
        track.style.transform = `translateX(${offset}%)`;

        indicators.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    function goNext() {
        updateCarousel(currentIndex + 1);
    }

    function goPrev() {
        updateCarousel(currentIndex - 1);
    }

    nextBtn.addEventListener('click', goNext);
    prevBtn.addEventListener('click', goPrev);

    indicators.forEach((dot, idx) => {
        dot.addEventListener('click', () => updateCarousel(idx));
    });

    // Navegação por teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            goPrev();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            goNext();
        }
    });

    // ========================================
    // MENU MOBILE - TOGGLE E OVERLAY
    // ========================================
    const menuToggle = document.getElementById('menuToggle');
    const menuClose = document.getElementById('menuClose');
    const mobileOverlay = document.getElementById('mobileMenuOverlay');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function openMenu() {
        mobileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (menuToggle) {
        menuToggle.addEventListener('click', openMenu);
    }

    if (menuClose) {
        menuClose.addEventListener('click', closeMenu);
    }

    // Fechar menu ao clicar em um link e marcar como ativo
    mobileLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            mobileLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            setTimeout(closeMenu, 300);
        });
    });

    // Scroll suave para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Inicializa carrossel
    updateCarousel(0);

    if ('ontouchstart' in window) {
        document.querySelectorAll('.bloco, .nav-btn').forEach(el => {
            el.style.transition = 'box-shadow 0.2s, background 0.2s';
        });
    }
})();