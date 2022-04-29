// Targeting my GitHub profile information
const overview = document.querySelector('.overview');
const username = 'marisabrantley';
const repoList = document.querySelector('.repo-list');
const repoSection = document.querySelector('.repos');
const repoDataSection = document.querySelector('.repo-data');


// Fetches GitHub profile data
const gitUserData = async () => {
    const userInfo = await fetch (`https://api.github.com/users/${username}`);
    const data = await userInfo.json();
    // console.log(data);
    displayData(data);
};

gitUserData();

// To display fetched GitHub profile data
const displayData = (data) => {
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
    // console.log(data);
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
    // console.log(repoInfo);
    const fetchLanguages = await fetch (repoInfo.languages_url);
    const languageData = await fetchLanguages.json();
    // console.log(languageData);

    const languages = [];
    for (const language in languageData) {
        languages.push(language);
    }
    // console.log(languages);
    displaySpecificInfo(repoInfo, languages);
};

const displaySpecificInfo = (repoInfo, languages) => {
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
