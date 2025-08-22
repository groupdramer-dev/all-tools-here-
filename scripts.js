document.addEventListener('DOMContentLoaded', () => {
    const toolsList = document.getElementById('toolsList');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');

    // Carregar dados das ferramentas
    fetch('data/tools.json')
        .then(response => response.json())
        .then(tools => {
            let filteredTools = tools;

            // Exibir ferramentas
            function displayTools(tools) {
                toolsList.innerHTML = '';
                tools.forEach(tool => {
                    const toolCard = document.createElement('div');
                    toolCard.className = 'tool-card';
                    toolCard.innerHTML = `
                        <h2>${tool.name}</h2>
                        <p><strong>Descrição:</strong> ${tool.description}</p>
                        <p><strong>Categoria:</strong> ${tool.category}</p>
                        <pre><strong>Instalação:</strong>\n${tool.install}</pre>
                        <pre><strong>Uso:</strong>\n${tool.usage}</pre>
                    `;
                    toolsList.appendChild(toolCard);
                });
            }

            // Filtro por categoria
            categoryFilter.addEventListener('change', () => {
                const category = categoryFilter.value;
                filteredTools = category === 'all' 
                    ? tools 
                    : tools.filter(tool => tool.category.toLowerCase() === category);
                displayTools(filteredTools);
            });

            // Busca por nome ou descrição
            searchInput.addEventListener('input', () => {
                const query = searchInput.value.toLowerCase();
                filteredTools = tools.filter(tool => 
                    tool.name.toLowerCase().includes(query) || 
                    tool.description.toLowerCase().includes(query)
                );
                if (categoryFilter.value !== 'all') {
                    filteredTools = filteredTools.filter(tool => tool.category.toLowerCase() === categoryFilter.value);
                }
                displayTools(filteredTools);
            });

            // Exibir todas as ferramentas inicialmente
            displayTools(tools);
        })
        .catch(error => console.error('Erro ao carregar ferramentas:', error));
});