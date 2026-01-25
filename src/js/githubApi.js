// Arquivo: api-github.js
async function getGithubStats(username) {
    try {
        const response = await fetch(`https://api.github.com/users/${username}`);
        if (!response.ok) throw new Error('Falha ao consultar API');

        const data = await response.json();
        const totalRepos = data.public_repos;

        // Lógica de 10 em 10 (Ex: 27 vira 20+)
        const roundedRepos = Math.floor(totalRepos / 10) * 10;

        return `${roundedRepos}+`;
    } catch (error) {
        console.error("Erro na API do GitHub:", error);
        return "20+"; // Valor padrão caso a API falhe
    }
}

getGithubStats('Gabbfernyh').then(stats => {});
