// Dados para os eixos temáticos
        const eixosTematicos = [
            {
                titulo: "1. Imaginários e narrativas amazônicas: cultura, memória, identidade e o insólito ficcional",
                descricao: "Este eixo acolhe trabalhos que investiguem a relação entre literatura, cultura e identidade na Amazônia, incluindo narrativas literárias que abordem o insólito ficcional",
                icone: "fas fa-laptop-code"
            },
            {
                titulo: "Sustentabilidade",
                descricao: "Discussões sobre práticas sustentáveis e desenvolvimento com responsabilidade ambiental.",
                icone: "fas fa-leaf"
            },
            {
                titulo: "Educação e Pesquisa",
                descricao: "Novas metodologias de ensino e avanços nas pesquisas científicas.",
                icone: "fas fa-graduation-cap"
            },
            {
                titulo: "Saúde e Bem-estar",
                descricao: "Inovações na área da saúde e promoção de qualidade de vida.",
                icone: "fas fa-heartbeat"
            },
            {
                titulo: "Cultura e Sociedade",
                descricao: "Reflexões sobre diversidade cultural e transformações sociais.",
                icone: "fas fa-users"
            }
        ];

        // Variáveis para controle do carrossel
        let currentSlide = 0;
        let slideInterval;
        const slidesPerView = 4;

        // Inicializar carrossel
        function initCarrossel() {
            const carrosselTrack = document.getElementById('carrosselTrack');
            const carrosselNav = document.getElementById('carrosselNav');
            
            // Criar blocos temáticos
            eixosTematicos.forEach((eixo, index) => {
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
            
            // Calcular número de slides
            const totalSlides = Math.ceil(eixosTematicos.length / slidesPerView);
            
            // Criar dots de navegação
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('div');
                dot.className = 'carrossel-dot';
                if (i === 0) dot.classList.add('active');
                dot.dataset.slide = i;
                dot.addEventListener('click', () => goToSlide(i));
                carrosselNav.appendChild(dot);
            }
            
            // Ajustar para telas menores
            updateSlidesPerView();
            
            // Iniciar transição automática
            startAutoSlide();
        }

        // Atualizar número de slides visíveis de acordo com o tamanho da tela
        function updateSlidesPerView() {
            const width = window.innerWidth;
            let slidesToShow = 4;
            
            if (width <= 992 && width > 768) {
                slidesToShow = 3;
            } else if (width <= 768 && width > 576) {
                slidesToShow = 2;
            } else if (width <= 576) {
                slidesToShow = 1;
            }
            
            // Ajustar largura dos blocos
            const blocos = document.querySelectorAll('.bloco-tematico');
            blocos.forEach(bloco => {
                bloco.style.flex = `0 0 ${100 / slidesToShow}%`;
            });
            
            // Atualizar slide atual para garantir visibilidade
            goToSlide(currentSlide);
        }

        // Ir para slide específico
        function goToSlide(slideIndex) {
            const totalSlides = Math.ceil(eixosTematicos.length / slidesPerView);
            if (slideIndex >= totalSlides) slideIndex = 0;
            if (slideIndex < 0) slideIndex = totalSlides - 1;
            
            currentSlide = slideIndex;
            const carrosselTrack = document.getElementById('carrosselTrack');
            const translateX = -currentSlide * 100;
            carrosselTrack.style.transform = `translateX(${translateX}%)`;
            
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
            const totalSlides = Math.ceil(eixosTematicos.length / slidesPerView);
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

        // Menu mobile
        document.addEventListener('DOMContentLoaded', () => {
            initCarrossel();
            
            // Menu toggle para mobile
            const menuToggle = document.getElementById('menuToggle');
            const menuNav = document.getElementById('menuNav');
            
            menuToggle.addEventListener('click', () => {
                menuNav.classList.toggle('active');
            });
            
            // Fechar menu ao clicar em um link
            const menuLinks = document.querySelectorAll('.menu-nav a');
            menuLinks.forEach(link => {
                link.addEventListener('click', () => {
                    menuNav.classList.remove('active');
                });
            });
            
            // Atualizar carrossel ao redimensionar a janela
            window.addEventListener('resize', updateSlidesPerView);
            
            // Pausar carrossel ao interagir
            const carrossel = document.querySelector('.carrossel');
            carrossel.addEventListener('mouseenter', pauseAutoSlide);
            carrossel.addEventListener('mouseleave', startAutoSlide);
        });
