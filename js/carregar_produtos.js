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
                // ==========================================================
                // == PASSO 1: GERAR O HTML DAS IMAGENS (A PARTE QUE FALTAVA) ==
                // ==========================================================
                let imagensHtml = '';
                for (let i = 1; i <= produto.total_imagens; i++) {
                    // Assumimos que as imagens são .jpg. Se tiver outras, precisaria de mais lógica.
                    imagensHtml += `<div class="swiper-slide"><img src="${produto.pasta_imagens}/${i}.jpg" alt="${produto.titulo} - Imagem ${i}" loading="lazy"></div>`;
                }

                // ==========================================================
                // == PASSO 2: GERAR O HTML DAS VARIANTES                  ==
                // ==========================================================
                let variantesHtml = '';
                if (produto.variantes && produto.variantes.length > 0) {
                    variantesHtml += '<div class="produto-variantes-container">';
                    produto.variantes.forEach(variante => {
                        variantesHtml += `
                            <div class="variante-card">
                                <h4 class="variante-opcao">${variante.opcao}</h4>
                                <ul class="variante-specs">
                                    <li><strong>Tamanho:</strong> ${variante.tamanho}</li>
                                    <li><strong>Varejo:</strong> ${variante.valor_varejo}</li>
                                    <li><strong>Atacado:</strong> ${variante.valor_atacado}</li>
                                </ul>
                            </div>
                        `;
                    });
                    variantesHtml += '</div>';
                }

                // ==========================================================
                // == PASSO 3: GERAR O HTML DO COMENTÁRIO FIXO             ==
                // ==========================================================
                let comentarioHtml = '';
                if (produto.comentario_fixo) {
                    comentarioHtml = `<p class="produto-comentario">${produto.comentario_fixo}</p>`;
                }

                // ==========================================================
                // == PASSO 4: MONTAR O CARD COMPLETO DO PRODUTO           ==
                // ==========================================================
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
                        ${variantesHtml}
                        ${comentarioHtml}
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
