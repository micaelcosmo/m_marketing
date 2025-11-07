document.addEventListener('DOMContentLoaded', () => {
    // Função principal para carregar e renderizar os dados
    async function loadPageData() {
        try {
            const response = await fetch('data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            // Renderiza as seções da página com os dados
            renderPageTitle(data.pageTitle);
            renderHeader(data.header);
            renderSectionTitle(data.sectionTitle);
            renderProducts(data.products);
            renderFooter(data.footer);

            // Inicializa os componentes interativos DEPOIS que o HTML foi criado
            initializeFilters();
            initializeScroll();
            animateCardsIn();

        } catch (error) {
            console.error('Falha ao carregar os dados da página:', error);
            // Você pode exibir uma mensagem de erro para o usuário aqui
        }
    }

    // --- Funções de Renderização ---

    function renderPageTitle(title) {
        document.title = title;
    }

    function renderHeader(headerData) {
        document.getElementById('hero-title').innerHTML = headerData.mainHeading;
        document.getElementById('hero-subtitle').innerHTML = headerData.subtitle;
        document.getElementById('hero-cta').innerHTML = headerData.ctaButtonText;
    }

    function renderSectionTitle(title) {
        document.getElementById('section-title').innerHTML = title;
    }

    function renderFooter(footerData) {
        document.getElementById('footer-copyright').innerHTML = footerData.copyright;
        document.getElementById('footer-disclaimer').innerHTML = footerData.disclaimer;
        
        const socialContainer = document.getElementById('footer-social');
        socialContainer.innerHTML = `
            <a href="${footerData.social.facebook}" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
            <a href="${footerData.social.instagram}" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
            <a href="${footerData.social.twitter}" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
        `;
    }

    function renderProducts(products) {
        const grid = document.getElementById('product-grid');
        let productsHTML = '';

        products.forEach((product) => {
            // Gera o HTML para o preço antigo, somente se ele existir
            const oldPriceHTML = product.oldPrice 
                ? `<span class="old-price">${product.oldPrice}</span>` 
                : '';

            // Adiciona as classes 'hidden' para a animação de entrada
            productsHTML += `
            <article class="product-card hidden-visual hidden-layout" data-store="${product.store}">
                <div class="card-image">
                    <img src="${product.imgSrc}" alt="${product.imgAlt}">
                    <span class="store-badge ${product.store}">${product.badgeText}</span>
                </div>
                <div class="card-content">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <div class="price">
                        ${oldPriceHTML}
                        <span class="new-price">${product.newPrice}</span>
                    </div>
                    <a href="${product.link}" target="_blank" rel="noopener noreferrer" class="cta-button">Ver Oferta <i class="fas fa-arrow-right"></i></a>
                </div>
            </article>
            `;
        });

        grid.innerHTML = productsHTML;
    }

    // --- Funções de Inicialização (Interatividade) ---

    function initializeFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        // Seleciona os cards que ACABARAM de ser criados
        const productCards = document.querySelectorAll('.product-card'); 
        const animationDuration = 400; // Tempo em MS (deve ser o mesmo do CSS: 0.4s)

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                productCards.forEach(card => {
                    const cardStore = card.getAttribute('data-store');
                    const shouldShow = (filter === 'all' || cardStore === filter);

                    if (shouldShow) {
                        card.classList.remove('hidden-layout');
                        setTimeout(() => {
                            card.classList.remove('hidden-visual');
                        }, 0);
                    } else {
                        card.classList.add('hidden-visual');
                        setTimeout(() => {
                            card.classList.add('hidden-layout');
                        }, animationDuration);
                    }
                });
            });
        });
    }

    function initializeScroll() {
        const scrollDownBtn = document.querySelector('.scroll-down-btn');
        if (scrollDownBtn) {
            scrollDownBtn.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelector('#product-section').scrollIntoView({
                    behavior: 'smooth'
                });
            });
        }
    }

    function animateCardsIn() {
        const productCards = document.querySelectorAll('.product-card');
        
        productCards.forEach((card, index) => {
            // 1. Remove 'hidden-layout' para que o card ocupe espaço (mas ainda invisível)
            card.classList.remove('hidden-layout');
            
            // 2. Remove 'hidden-visual' com um delay escalonado para o fade-in
            setTimeout(() => {
                card.classList.remove('hidden-visual');
            }, 100 + (index * 70)); // 70ms de delay entre cada card
        });
    }

    // Inicia todo o processo
    loadPageData();
});