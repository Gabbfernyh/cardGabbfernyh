// Arquivo: api-github.js
// Arquivo da API (Integrado conforme solicitado)
const username = 'Gabbfernyh';

async function getGithubStats(username) {
    try {
        const response = await fetch(`https://api.github.com/users/${username}`);
        if (!response.ok) throw new Error('Falha ao consultar API');
        const data = await response.json();
        const totalRepos = data.public_repos;
        const roundedRepos = Math.floor(totalRepos / 10) * 10;
        return `${roundedRepos}+`;
    } catch (error) {
        console.error("Erro na API do GitHub:", error);
        return "20+";
    }
}