// Targeting my GitHub profile information
const overview = document.querySelector('.overview');
const username = 'marisabrantley';
const repoList = document.querySelector('.repo-list');


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
    //console.log(data);
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