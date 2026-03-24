// Arquivo: api-github.js
// Lê estatísticas locais geradas pelo GitHub Actions
const username = 'Gabbfernyh';

async function getGithubStats() {
    try {
        const response = await fetch('src/data/github-stats.json', {
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(`Falha ao carregar github-stats.json: ${response.status}`);
        }

        const data = await response.json();

        if (typeof data.repos !== 'number') {
            throw new Error('Campo repos invalido em github-stats.json');
        }

        return String(data.repos);
    } catch (error) {
        console.error('Erro ao carregar estatisticas locais:', error);
        return null;
    }
}
