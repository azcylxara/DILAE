
        (function() {
            const track = document.getElementById('carouselTrack');
            const prevButton = document.getElementById('prevSlide');
            const nextButton = document.getElementById('nextSlide');
            const indicators = document.querySelectorAll('.indicator');
            
            let currentIndex = 0;               // 0 = primeiro slide, 1 = segundo slide
            const totalSlides = document.querySelectorAll('.slide').length; // deve ser 2

            // função que atualiza a posição do track e a classe active dos indicadores
            function updateCarousel(index) {
                if (index < 0) index = 0;
                if (index >= totalSlides) index = totalSlides - 1;
                currentIndex = index;

                // desloca o track: cada slide tem 100% de largura
                const offset = -currentIndex * 100;
                track.style.transform = `translateX(${offset}%)`;

                // atualiza indicadores ativos
                indicators.forEach((ind, i) => {
                    if (i === currentIndex) {
                        ind.classList.add('active');
                    } else {
                        ind.classList.remove('active');
                    }
                });
            }

            // evento para botão próximo
            nextButton.addEventListener('click', () => {
                if (currentIndex < totalSlides - 1) {
                    updateCarousel(currentIndex + 1);
                } else {
                    // opcional: loop, mas preferimos ir para o último (já está) ou reset
                    // vamos permitir ir para o primeiro se quiser loop? mas melhor só navegar até o limite.
                    // caso queira loop, descomente a linha abaixo:
                    // updateCarousel(0);  
                    // Como são apenas 2, podemos permitir ir para o primeiro (comportamento de loop suave)
                    // Vou deixar com loop (vai do 2→1), pois dá fluidez.
                    updateCarousel(0);   // loop: do último para o primeiro
                }
            });

            // evento para botão anterior
            prevButton.addEventListener('click', () => {
                if (currentIndex > 0) {
                    updateCarousel(currentIndex - 1);
                } else {
                    // loop: do primeiro para o último
                    updateCarousel(totalSlides - 1);
                }
            });

            // cliques nos indicadores
            indicators.forEach((indicator, idx) => {
                indicator.addEventListener('click', () => {
                    updateCarousel(idx);
                });
            });

            // inicializa na posição correta
            updateCarousel(0);

            // pequeno toque: teclado (setas esquerda/direita) para acessibilidade
            window.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    prevButton.click();
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    nextButton.click();
                }
            });

            
            // garantir que o track se comporte bem se houver redimensionamento extremo
            // (a medida em % permanece correta)
        })();
