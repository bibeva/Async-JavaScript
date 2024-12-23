const btn = document.querySelector('button');
const people = document.querySelector('#people');
const astrosUrl = 'http://api.open-notify.org/astros.json';
const wikiUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/';

// Make an AJAX request
function getJSON(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        resolve(data);
      } else {
        reject(Error(xhr.statusText));
      }
    };
    xhr.open('GET', url);
    xhr.onerror = () => reject(Error('A network error occurred'));
    xhr.send();
  })
}

// Get the profiles of astronauts
function getProfiles(json) {
  const profiles = json.people.map(person => {
    return getJSON(wikiUrl + person.name);
  })
  return Promise.all(profiles);
}

// Generate the markup for each profile
function generateHTML(data) {
  data.map(person => {
    const div = document.createElement('div');
    people.appendChild(div);

    const imageUrl = person.thumbnail && person.thumbnail.source ? person.thumbnail.source : `https://avatar.iran.liara.run/username?username=${person.title}`;

    div.innerHTML = `
    <img src=${imageUrl}>
    <h2>${person.title}</h2>
    <p>${person.description}</p>
  `;
  })
}

btn.addEventListener('click', (event) => {
  event.target.textContent = 'Loading...';

  getJSON(astrosUrl)
    .then(getProfiles)
    .then(generateHTML)
    .catch(error => {
      people.innerHTML = '<h3>Something went wrong</h3>';
      console.error(error);
    })
    .finally(() => event.target.remove());
});