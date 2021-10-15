// hämta token.key filen
async function readFile(file) {
  return fetch(file)
    .then((response) => response.text())
    .then((text) => text);
}
// hämtar git keyn från token.key
async function getToken() {
  const response = await readFile('../token.key');
  return response;
}

// constanter
const url = 'https://api.github.com';

async function files(event) {
  const forkid = event.target.id;
  const main = document.querySelector('main');
  main.innerHTML = '';

  const path = await fetch(`${url}/repositories/${forkid}/contents`, { method: 'GET', headers: { Authorization: `token ${await getToken()}` } });
  const pathFetched = await path.json();
  console.log(pathFetched);
  const file = JSON.stringify(pathFetched[1].download_url);
  const htmlLink = pathFetched[1].html_url;

  console.log(file);

  const filecardtemplate = document.querySelector('#fork');
  const forkClone = filecardtemplate.content.cloneNode(true);

  forkClone.querySelector('.fork-title').textContent = 'Api-test';
  forkClone.querySelector('code').textContent = file;
  forkClone.querySelector('a').href = htmlLink;
  forkClone.querySelector('.unit-tests').textContent = '40p';

  main.appendChild(forkClone);
}

// eventlistener på input

// api funktionen på eventlistener
function api(e) {
  e.preventDefault();
  const searchInput = document.querySelector('#search').value;

  async function repositories() {
    const repos = await fetch(`${url}/users/${searchInput}/repos`, { method: 'GET', headers: { Authorization: `token ${await getToken()}` } });
    const reposFetched = await repos.json();

    for (let i = 0; i < reposFetched.length; i += 1) {
      const id = JSON.stringify(reposFetched[i].id);

      let repoName = JSON.stringify(reposFetched[i].name);
      repoName = repoName.replaceAll('"', '');
      const repoForks = JSON.stringify(reposFetched[i].forks);

      const container = document.querySelector('.row');
      const tmpl = document.querySelector('#repo');
      const clone = tmpl.content.cloneNode(true);

      clone.querySelector('#showForks').addEventListener('click', files);
      clone.querySelector('#showForks').id = id;
      const addName = document.createTextNode(repoName);
      const addForks = document.createTextNode(repoForks);
      clone.querySelector('#name').appendChild(addName);
      clone.querySelector('#forks').appendChild(addForks);
      container.appendChild(clone);
    }
    return reposFetched;
  }
  repositories();
}

document.querySelector('form#input').addEventListener('submit', api);
