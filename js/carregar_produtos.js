document.addEventListener('DOMContentLoaded', () => {
    const mainContainer = document.querySelector('.main-catalogo');
    if (!mainContainer) return; // Não faz nada se não estiver em uma página de catálogo

    const jsonPath = mainContainer.dataset.jsonSource;
    const catalogoGrid = mainContainer.querySelector('.catalogo-grid');

    fetch(jsonPath)
        .then(response => response.json())
        .then(produtos => {
            if (produtos.length === 0) {
                catalogoGrid.innerHTML = "<p>Nenhum produto encontrado nesta categoria.</p>";
                return;
            }

            produtos.forEach(produto => {
                let imagensHtml = '';
                for (let i = 1; i <= produto.total_imagens; i++) {
                    // Tenta com .jpg e .png, adicione outras extensões se precisar
                    const caminhoBase = `${produto.pasta_imagens}/${i}`;
                    imagensHtml += `<div class="swiper-slide"><img src="${caminhoBase}.jpg" alt="${produto.titulo} - Imagem ${i}" loading="lazy"></div>`;
                }

                const produtoCard = document.createElement('div');
                produtoCard.className = 'produto-card';
                produtoCard.setAttribute('data-aos', 'fade-up');
                produtoCard.innerHTML = `
                    <div class="swiper">
                        <div class="swiper-wrapper">${imagensHtml}</div>
                        <div class="swiper-pagination"></div>
                        <div class="swiper-button-prev"></div>
                        <div class="swiper-button-next"></div>
                    </div>
                    <div class="produto-info">
                        <h3>${produto.titulo}</h3>
                        <p>${produto.descricao.replace(/\n/g, '  ')}</p>
                    </div>
                `;
                catalogoGrid.appendChild(produtoCard);
            });

            // Inicializa todos os carrosséis da página
            new Swiper('.swiper', {
                loop: true,
                pagination: { el: '.swiper-pagination', clickable: true },
                navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
            });
        })
        .catch(error => {
            console.error('Erro ao carregar produtos:', error);
            catalogoGrid.innerHTML = "<p>Ocorreu um erro ao carregar os produtos.</p>";
        });
});
