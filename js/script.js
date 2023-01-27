const overview = document.querySelector('.overview');
const username = 'marisabrantley';
const repoList = document.querySelector('.repo-list');
const repoSection = document.querySelector('.repos');
const repoDataSection = document.querySelector('.repo-data');
const backButton = document.querySelector('.view-repos');
const filterInput = document.querySelector('.filter-repos');

const gitUserData = async () => {
    const userInfo = await fetch (`https://api.github.com/users/${username}`);
    const data = await userInfo.json();
    displayData(data);
};

gitUserData();

const displayData = (data) => {
    filterInput.classList.remove('hide');
    const newDiv = document.createElement('div');
    newDiv.classList.add('user-info');
    newDiv.innerHTML = `
        <figure>
            <img alt="user avatar" src=${data.avatar_url} />
        </figure>
        <div>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Bio:</strong> ${data.bio}</p>
            <p><strong>Location:</strong> ${data.location}</p>
            <p><strong>Number of public repos:</strong> ${data.public_repos}</p>
        </div>
        `;
    overview.append(newDiv);
    fetchRepos();
};

const fetchRepos = async () => {
    const res = await fetch (`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
    const data = await res.json();
    displayRepos(data);
};

const displayRepos = (repos) => {
    for (const repo of repos) {
        const repoItem = document.createElement ('li');
        repoItem.classList.add ('repo');
        repoItem.innerHTML = `<h3>${repo.name}</h3>`;
        repoList.append(repoItem);
    }
};

repoList.addEventListener('click', (e) => {
    if (e.target.matches('h3')) {
        const repoName = e.target.innerText;
        getRepoInfo(repoName);
    }
});

const getRepoInfo = async function (repoName) {
    const repoRes = await fetch (`https://api.github.com/repos/${username}/${repoName}`);
    const repoInfo = await repoRes.json();
    const fetchLanguages = await fetch (repoInfo.languages_url);
    const languageData = await fetchLanguages.json();

    const languages = [];
    for (const language in languageData) {
        languages.push(language);
    }
    displaySpecificInfo(repoInfo, languages);
};

const displaySpecificInfo = (repoInfo, languages) => {
    backButton.classList.remove('hide');
    repoDataSection.innerHTML = '';
    repoDataSection.classList.remove('hide');
    repoSection.classList.add('hide');
    const div = document.createElement('div');
    div.innerHTML = `
        <h3>Repo Name:  ${repoInfo.name}</h3>
        <p>Description:  ${repoInfo.description}</p>
        <p>Default Branch:  ${repoInfo.default_branch}</p>
        <p>Languages:  ${languages.join(", ")}</p>
        <p>Topics:  ${repoInfo.topics.join(", ")}</p>
        <a class="visit" href="${repoInfo.html_url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>
        `;
    repoDataSection.append(div);
};

backButton.addEventListener('click', () => {
    repoSection.classList.remove('hide');
    repoDataSection.classList.add('hide');
    backButton.classList.add('hide');
});

filterInput.addEventListener('input', (e) => {
    const searchValue = e.target.value;
    console.log(searchValue);
    const repos = document.querySelectorAll('.repo');
    const searchLowerCase = searchValue.toLowerCase();

    for (const repo of repos) {
        const repoLowerCase = repo.innerText.toLowerCase();
        if (repoLowerCase.includes(searchLowerCase)) {
            repo.classList.remove('hide');
        } else {
            repo.classList.add('hide');
        }
    };
});
