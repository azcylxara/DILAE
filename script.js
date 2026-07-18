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

// Variáveis para controle do carrossel (deixadas dinâmicas para responsividade)
let currentSlide = 0;
let slideInterval;
let slidesPerView = 4;

// Inicializar carrossel
function initCarrossel() {
    const carrosselTrack = document.getElementById('carrosselTrack');
    if (!carrosselTrack) return;
    
    carrosselTrack.innerHTML = ''; // Limpa o container para evitar duplicações
    
    // Criar blocos temáticos
    eixosTematicos.forEach((eixo) => {
        const bloco = document.createElement('div');
        bloco.className = 'bloco-tematico';
        bloco.innerHTML = `
            <div class="bloco-content">
                <div class="bloco-icon">
                    <i class="${eixo.icone}"></i>
                </div>
                <h3>${eixo.titulo}</h3>
                <p>${eixo.descricao}</p>
            </div>
        `;
        carrosselTrack.appendChild(bloco);
    });
    
    // Ajustar para telas menores e renderizar indicadores
    updateSlidesPerView();
    
    // Iniciar transição automática
    startAutoSlide();
}

// Atualizar número de slides visíveis de acordo com o tamanho da tela
function updateSlidesPerView() {
    const width = window.innerWidth;
    
    if (width <= 576) {
        slidesPerView = 1;
    } else if (width <= 768) {
        slidesPerView = 2;
    } else if (width <= 992) {
        slidesPerView = 3;
    } else {
        slidesPerView = 4;
    }
    
    // Ajustar largura dinâmica dos blocos de forma responsiva
    const blocos = document.querySelectorAll('.bloco-tematico');
    blocos.forEach(bloco => {
        bloco.style.flex = `0 0 ${100 / slidesPerView}%`;
    });
    
    // Recriar os círculos (dots) de navegação para a proporção correta da tela
    renderDots();
    
    // Atualizar slide atual para garantir visibilidade
    goToSlide(currentSlide);
}

// Criar dots de navegação dinamicamente
function renderDots() {
    const carrosselNav = document.getElementById('carrosselNav');
    if (!carrosselNav) return;
    
    carrosselNav.innerHTML = '';
    const totalSlides = Math.ceil(eixosTematicos.length / slidesPerView);
    
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.className = 'carrossel-dot';
        if (i === currentSlide) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        carrosselNav.appendChild(dot);
    }
}

// Ir para slide específico
function goToSlide(slideIndex) {
    const totalSlides = Math.ceil(eixosTematicos.length / slidesPerView);
    if (slideIndex >= totalSlides) slideIndex = 0;
    if (slideIndex < 0) slideIndex = totalSlides - 1;
    
    currentSlide = slideIndex;
    const carrosselTrack = document.getElementById('carrosselTrack');
    if (carrosselTrack) {
        const translateX = -currentSlide * 100;
        carrosselTrack.style.transform = `translateX(${translateX}%)`;
    }
    
    // Atualizar dots ativos
    const dots = document.querySelectorAll('.carrossel-dot');
    dots.forEach((dot, index) => {
        if (index === currentSlide) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// Próximo slide
function nextSlide() {
    goToSlide(currentSlide + 1);
}

// Iniciar transição automática
function startAutoSlide() {
    if (slideInterval) clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 5000); // Muda a cada 5 segundos
}

// Pausar transição automática ao passar o mouse
function pauseAutoSlide() {
    clearInterval(slideInterval);
}

// Inicialização após carregamento do DOM
// Controle do Carrossel de Inscrições
document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('trackInscricao');
    const prevBtn = document.getElementById('prevInscricao');
    const nextBtn = document.getElementById('nextInscricao');
    const cards = document.querySelectorAll('.card-inscricao');
    
    let currentIndex = 0;
    const totalCards = cards.length;

    function updateInscricaoCarousel(index) {
        if (index < 0) {
            currentIndex = totalCards - 1; // Volta para o último
        } else if (index >= totalCards) {
            currentIndex = 0; // Vai para o primeiro
        } else {
            currentIndex = index;
        }
        
        // Desloca o track lateralmente
        const offset = -currentIndex * 100;
        track.style.transform = `translateX(${offset}%)`;
    }

    // Ouvintes de clique para os botões laterais
    if (prevBtn && nextBtn && track) {
        prevBtn.addEventListener('click', () => {
            updateInscricaoCarousel(currentIndex - 1);
        });

        nextBtn.addEventListener('click', () => {
            updateInscricaoCarousel(currentIndex + 1);
        });
    }
});