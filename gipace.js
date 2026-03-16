// JavaScript para o site GIPACE

document.addEventListener('DOMContentLoaded', function() {
    console.log('Site GIPACE carregado e pronto!');
    
    // ===== VARIÁVEIS GLOBAIS =====
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const backToTopButton = document.createElement('button');
    const currentYear = new Date().getFullYear();
    
    // ===== INICIALIZAÇÃO =====
    initSite();
    
    // ===== FUNÇÕES PRINCIPAIS =====
    
    function initSite() {
        setupMenuMobile();
        setupSmoothScroll();
        setupBackToTop();
        setupActiveNav();
        setupLazyLoading();
        setupAnimations();
        setupFormValidation();
        setupTableResponsive();
        setupIntersectionObserver();
        updateFooterYear();
        setupReadMore();
    }
    
    // 1. MENU MOBILE RESPONSIVO
    function setupMenuMobile() {
        if (!menuToggle || !mainNav) return;
        
        // Criar botão menu mobile se não existir
        if (!menuToggle) {
            const newMenuToggle = document.createElement('button');
            newMenuToggle.className = 'menu-toggle';
            newMenuToggle.setAttribute('aria-label', 'Abrir menu');
            newMenuToggle.setAttribute('aria-expanded', 'false');
            newMenuToggle.innerHTML = '<span class="hamburger"></span>';
            document.querySelector('.header-container').appendChild(newMenuToggle);
        }
        
        // Evento de clique no menu toggle
        menuToggle.addEventListener('click', toggleMenu);
        
        // Fechar menu ao clicar em links
        navLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });
        
        // Fechar menu ao clicar fora
        document.addEventListener('click', (e) => {
            if (!mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
                closeMenu();
            }
        });
        
        // Fechar menu com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeMenu();
        });
    }
    
    function toggleMenu() {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        mainNav.classList.toggle('active');
        document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
        
        // Animar hamburger
        menuToggle.classList.toggle('open');
    }
    
    function closeMenu() {
        menuToggle.setAttribute('aria-expanded', 'false');
        mainNav.classList.remove('active');
        document.body.style.overflow = '';
        menuToggle.classList.remove('open');
    }
    
    // 2. SCROLL SUAVE
    function setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Ignorar âncoras vazias
                if (href === '#' || href === '') return;
                
                e.preventDefault();
                
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // Calcular offset considerando header fixo
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = targetPosition - headerHeight;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Atualizar URL sem recarregar a página
                    history.pushState(null, null, href);
                    
                    // Fechar menu mobile se aberto
                    closeMenu();
                }
            });
        });
    }
    
    // 3. BOTÃO VOLTAR AO TOPO
    function setupBackToTop() {
        backToTopButton.className = 'back-to-top';
        backToTopButton.setAttribute('aria-label', 'Voltar ao topo da página');
        backToTopButton.innerHTML = '<i class="fas fa-chevron-up"></i>';
        document.body.appendChild(backToTopButton);
        
        // Mostrar/ocultar botão baseado no scroll
        window.addEventListener('scroll', toggleBackToTop);
        
        // Evento de clique
        backToTopButton.addEventListener('click', scrollToTop);
    }
    
    function toggleBackToTop() {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    }
    
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Dar foco ao header para acessibilidade
        document.querySelector('header').focus();
    }
    
    // 4. NAVEGAÇÃO ATIVA
    function setupActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        
        function highlightActiveSection() {
            let scrollPosition = window.scrollY + 100;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    // Remover classe ativa de todos os links
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        link.removeAttribute('aria-current');
                    });
                    
                    // Adicionar classe ativa ao link correspondente
                    const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                    if (activeLink) {
                        activeLink.classList.add('active');
                        activeLink.setAttribute('aria-current', 'page');
                    }
                }
            });
        }
        
        window.addEventListener('scroll', highlightActiveSection);
        window.addEventListener('load', highlightActiveSection);
    }
    
    // 5. LAZY LOADING DE IMAGENS
    function setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const lazyImageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const lazyImage = entry.target;
                        
                        if (lazyImage.dataset.src) {
                            lazyImage.src = lazyImage.dataset.src;
                        }
                        
                        if (lazyImage.dataset.srcset) {
                            lazyImage.srcset = lazyImage.dataset.srcset;
                        }
                        
                        lazyImage.classList.add('loaded');
                        lazyImageObserver.unobserve(lazyImage);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });
            
            document.querySelectorAll('img[data-src]').forEach(img => {
                lazyImageObserver.observe(img);
            });
        } else {
            // Fallback para navegadores antigos
            const lazyImages = document.querySelectorAll('img[data-src]');
            let lazyImageCount = lazyImages.length;
            
            if (lazyImageCount > 0) {
                const lazyLoad = () => {
                    lazyImages.forEach(img => {
                        if (img.dataset.src && img.getBoundingClientRect().top <= window.innerHeight) {
                            img.src = img.dataset.src;
                            img.classList.add('loaded');
                        }
                    });
                    
                    // Remover event listener quando todas as imagens carregarem
                    if (--lazyImageCount === 0) {
                        document.removeEventListener('scroll', lazyLoad);
                    }
                };
                
                document.addEventListener('scroll', lazyLoad);
                window.addEventListener('resize', lazyLoad);
                window.addEventListener('orientationchange', lazyLoad);
                lazyLoad(); // Carregar imagens visíveis inicialmente
            }
        }
    }
    
    // 6. ANIMAÇÕES
    function setupAnimations() {
        // Adicionar classe animada quando elementos entrarem na viewport
        const animatedElements = document.querySelectorAll('.card, .info-card, .professor-card');
        
        if ('IntersectionObserver' in window) {
            const animationObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                        animationObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });
            
            animatedElements.forEach(element => {
                animationObserver.observe(element);
            });
        }
        
        // Efeito de digitação para título principal (opcional)
        const landingTitle = document.querySelector('.landing-title');
        if (landingTitle && window.innerWidth > 768) {
            typeWriterEffect(landingTitle);
        }
    }
    
    function typeWriterEffect(element) {
        const text = element.textContent;
        element.textContent = '';
        let i = 0;
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, 50);
            }
        }
        
        setTimeout(type, 1000);
    }
    
    // 7. VALIDAÇÃO DE FORMULÁRIO
    function setupFormValidation() {
        const newsletterForm = document.getElementById('newsletter-form');
        
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const emailInput = this.querySelector('input[type="email"]');
                const email = emailInput.value.trim();
                
                if (!validateEmail(email)) {
                    showFormError(emailInput, 'Por favor, insira um e-mail válido.');
                    return;
                }
                
                // Simular envio
                showFormSuccess(this, 'Obrigado por se inscrever!');
                emailInput.value = '';
            });
            
            // Validação em tempo real
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            emailInput.addEventListener('input', function() {
                clearFormError(this);
            });
        }
    }
    
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function showFormError(input, message) {
        clearFormError(input);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        errorDiv.textContent = message;
        errorDiv.style.cssText = 'color: #ff4444; font-size: 14px; margin-top: 5px;';
        
        input.parentNode.appendChild(errorDiv);
        input.classList.add('error');
        
        // Focar no input com erro
        input.focus();
    }
    
    function clearFormError(input) {
        const errorDiv = input.parentNode.querySelector('.form-error');
        if (errorDiv) errorDiv.remove();
        input.classList.remove('error');
    }
    
    function showFormSuccess(form, message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'form-success';
        successDiv.textContent = message;
        successDiv.style.cssText = 'color: #059d60; font-size: 14px; margin-top: 10px; padding: 10px; background: rgba(5, 157, 96, 0.1); border-radius: 5px;';
        
        form.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }
    
    // 8. TABELAS RESPONSIVAS
    function setupTableResponsive() {
        const tables = document.querySelectorAll('table');
        
        tables.forEach(table => {
            // Verificar se a tabela precisa de container
            if (table.offsetWidth > table.parentNode.offsetWidth) {
                let container = table.parentNode;
                
                if (!container.classList.contains('table-container')) {
                    container = document.createElement('div');
                    container.className = 'table-container';
                    table.parentNode.insertBefore(container, table);
                    container.appendChild(table);
                }
            }
            
            // Adicionar funcionalidade de ordenação (opcional)
            if (table.querySelector('thead')) {
                makeTableSortable(table);
            }
        });
    }
    
    function makeTableSortable(table) {
        const headers = table.querySelectorAll('th');
        
        headers.forEach((header, index) => {
            if (header.textContent.trim() !== '') {
                header.style.cursor = 'pointer';
                header.setAttribute('title', 'Clique para ordenar');
                
                header.addEventListener('click', () => {
                    sortTable(table, index);
                });
            }
        });
    }
    
    function sortTable(table, columnIndex) {
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        const isNumeric = rows.every(row => {
            const cell = row.children[columnIndex];
            return !isNaN(parseFloat(cell.textContent)) && isFinite(cell.textContent);
        });
        
        rows.sort((rowA, rowB) => {
            const cellA = rowA.children[columnIndex].textContent.trim();
            const cellB = rowB.children[columnIndex].textContent.trim();
            
            if (isNumeric) {
                return parseFloat(cellA) - parseFloat(cellB);
            } else {
                return cellA.localeCompare(cellB, 'pt-BR', { sensitivity: 'base' });
            }
        });
        
        // Reordenar linhas
        rows.forEach(row => tbody.appendChild(row));
    }
    
    // 9. OBSERVADOR DE INTERSEÇÃO PARA ANIMAÇÕES AVANÇADAS
    function setupIntersectionObserver() {
        if (!('IntersectionObserver' in window)) return;
        
        // Observador para elementos que devem aparecer suavemente
        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });
        
        // Aplicar a elementos que devem ter fade-in
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.add('fade-in');
            fadeObserver.observe(section);
        });
        
        // Observador para contadores (se houver)
        const counters = document.querySelectorAll('.counter');
        if (counters.length > 0) {
            const counterObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        startCounterAnimation(entry.target);
                        counterObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            counters.forEach(counter => counterObserver.observe(counter));
        }
    }
    
    function startCounterAnimation(counter) {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 segundos
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    }
    
    // 10. ATUALIZAR ANO NO FOOTER
    function updateFooterYear() {
        const yearElements = document.querySelectorAll('.current-year');
        yearElements.forEach(element => {
            element.textContent = currentYear;
        });
    }
    
    // ===== FUNÇÕES UTILITÁRIAS =====
    
    // Debounce para eventos de resize/scroll
    function debounce(func, wait = 20, immediate = true) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }
    
    // Throttle para eventos frequentes
    function throttle(func, limit = 100) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // ===== EVENT LISTENERS ADICIONAIS =====
    
    // Ajustar layout ao redimensionar a janela
    window.addEventListener('resize', debounce(function() {
        setupTableResponsive();
        closeMenu(); // Fechar menu mobile ao redimensionar
    }, 250));
    
    // Prevenir comportamento padrão de formulários
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!this.checkValidity()) {
                e.preventDefault();
                // Adicionar validação visual
                this.classList.add('was-validated');
            }
        });
    });
    
    // Melhorar acessibilidade do teclado
    document.addEventListener('keydown', function(e) {
        // Navegação por tab nos cards
        if (e.key === 'Tab') {
            document.querySelectorAll('.card, .info-card').forEach(card => {
                if (card === document.activeElement || card.contains(document.activeElement)) {
                    card.classList.add('keyboard-focused');
                } else {
                    card.classList.remove('keyboard-focused');
                }
            });
        }
    });
    
    // Adicionar tooltips para elementos com título
    document.querySelectorAll('[title]').forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
        element.addEventListener('focus', showTooltip);
        element.addEventListener('blur', hideTooltip);
    });
    
    function showTooltip(e) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = this.getAttribute('title');
        tooltip.style.cssText = `
            position: absolute;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 14px;
            z-index: 10000;
            pointer-events: none;
            transform: translateY(-100%);
            margin-top: -10px;
        `;
        
        const rect = this.getBoundingClientRect();
        tooltip.style.left = rect.left + window.scrollX + 'px';
        tooltip.style.top = rect.top + window.scrollY + 'px';
        
        document.body.appendChild(tooltip);
        this._tooltip = tooltip;
    }
    
    function hideTooltip() {
        if (this._tooltip) {
            this._tooltip.remove();
            this._tooltip = null;
        }
    }
    
    // ===== CARREGAMENTO PROGRESSIVO DE CONTEÚDO =====
    
    // Carregar mais professores quando necessário (exemplo)
    let professoresCarregados = 2; // Já carregamos 2 inicialmente
    
    function carregarMaisProfessores() {
        // Simular carregamento assíncrono
        setTimeout(() => {
            // Adicionar mais professores
            const novosProfessores = [
                // Array com dados dos novos professores
            ];
            
            // Adicionar ao DOM
            // ...
            
            professoresCarregados += novosProfessores.length;
            
            // Verificar se ainda há mais para carregar
            if (professoresCarregados >= 12) { // Exemplo
                document.querySelector('.load-more-btn').style.display = 'none';
            }
        }, 1000);
    }
    
    // Adicionar botão "Carregar mais" se necessário
    if (document.querySelectorAll('.professor-card').length > 6) {
        const loadMoreBtn = document.createElement('button');
        loadMoreBtn.className = 'load-more-btn';
        loadMoreBtn.textContent = 'Carregar mais professores';
        loadMoreBtn.style.cssText = `
            display: block;
            margin: 40px auto;
            padding: 15px 30px;
            background: var(--primary-color);
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            transition: background 0.3s;
        `;
        
        loadMoreBtn.addEventListener('click', carregarMaisProfessores);
        loadMoreBtn.addEventListener('mouseenter', () => {
            loadMoreBtn.style.background = 'var(--primary-dark)';
        });
        loadMoreBtn.addEventListener('mouseleave', () => {
            loadMoreBtn.style.background = 'var(--primary-color)';
        });
        
        document.querySelector('.producoes-grid').appendChild(loadMoreBtn);
    }

    // Botão "Ler mais" para cards
    function setupReadMore() {
        const buttons = document.querySelectorAll('.btn-read-more');
        
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                const card = this.closest('.card');
                card.classList.toggle('expanded');
                
                // Muda o texto do botão
                if (card.classList.contains('expanded')) {
                    this.textContent = 'Ler menos';
                } else {
                    this.textContent = 'Ler mais';
                }
            });
        });
    }
    
    // ===== NOTIFICAÇÕES E FEEDBACK =====
    
    // Mostrar notificação de cookies (exemplo)
    function showCookieNotice() {
        if (!localStorage.getItem('cookiesAccepted')) {
            const cookieNotice = document.createElement('div');
            cookieNotice.id = 'cookie-notice';
            cookieNotice.innerHTML = `
                <p>Este site utiliza cookies para melhorar sua experiência. 
                <a href="#" id="cookie-policy">Política de Cookies</a></p>
                <button id="accept-cookies">Aceitar</button>
            `;
            cookieNotice.style.cssText = `
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: rgba(0,0,0,0.9);
                color: white;
                padding: 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                z-index: 9999;
            `;
            
            document.body.appendChild(cookieNotice);
            
            document.getElementById('accept-cookies').addEventListener('click', () => {
                localStorage.setItem('cookiesAccepted', 'true');
                cookieNotice.remove();
            });
            
            document.getElementById('cookie-policy').addEventListener('click', (e) => {
                e.preventDefault();
                // Abrir modal com política de cookies
            });
        }
    }
    
    // Inicializar notificação de cookies após 2 segundos
    setTimeout(showCookieNotice, 2000);
    
    // ===== DIAGNÓSTICO E DEBUG =====
    
    // Log de performance
    window.addEventListener('load', () => {
        const timing = performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        console.log(`Tempo de carregamento: ${loadTime}ms`);
        
        // Verificar conexão
        if (navigator.connection) {
            console.log(`Conexão: ${navigator.connection.effectiveType}`);
        }
    });
    
    // Tratamento de erros
    window.addEventListener('error', function(e) {
        console.error('Erro capturado:', e.error);
        // Aqui poderia enviar para um serviço de log
    });
    
    // ===== EXPORTAÇÃO PARA USO GLOBAL (SE NECESSÁRIO) =====
    window.GIPACE = {
        toggleMenu,
        closeMenu,
        scrollToTop,
        carregarMaisProfessores,
        // Adicionar outras funções públicas aqui
    };
    
    console.log('Inicialização do site GIPACE concluída!');

});

