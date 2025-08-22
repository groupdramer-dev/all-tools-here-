const supabaseUrl = 'SUA_URL_SUPABASE';
const supabaseKey = 'SUA_CHAVE_API';
const supabase = Supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', () => {
    const toolsList = document.getElementById('toolsList');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const userStatus = document.getElementById('userStatus');
    const adminPanel = document.getElementById('adminPanel');
    const toolForm = document.getElementById('toolForm');

    let tools = [];
    let filteredTools = [];

    // Carregar ferramentas
    async function loadTools() {
        const { data, error } = await supabase.from('tools').select('*');
        if (error) return console.error('Erro ao carregar ferramentas:', error);
        tools = data;
        filteredTools = tools;
        displayTools(tools);
    }

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

    // Gerenciar autenticação
    supabase.auth.onAuthStateChange((event, session) => {
        if (session) {
            userStatus.textContent = `Logado como: ${session.user.email}`;
            loginBtn.style.display = 'none';
            logoutBtn.style.display = 'inline-block';
            adminPanel.style.display = 'block';
        } else {
            userStatus.textContent = 'Não logado';
            loginBtn.style.display = 'inline-block';
            logoutBtn.style.display = 'none';
            adminPanel.style.display = 'none';
        }
    });

    // Login
    loginBtn.addEventListener('click', async () => {
        const email = prompt('Digite seu email:');
        const password = prompt('Digite sua senha:');
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) alert('Erro ao fazer login: ' + error.message);
    });

    // Logout
    logoutBtn.addEventListener('click', async () => {
        await supabase.auth.signOut();
    });

    // Adicionar ferramenta
    toolForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newTool = {
            name: document.getElementById('toolName').value,
            description: document.getElementById('toolDescription').value,
            category: document.getElementById('toolCategory').value,
            install: document.getElementById('toolInstall').value,
            usage: document.getElementById('toolUsage').value
        };
        const { error } = await supabase.from('tools').insert([newTool]);
        if (error) {
            alert('Erro ao adicionar ferramenta: ' + error.message);
        } else {
            toolForm.reset();
            alert('Ferramenta adicionada com sucesso!');
            loadTools();
        }
    });

    // Carregar ferramentas iniciais
    loadTools();
});
