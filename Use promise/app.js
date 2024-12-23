const btn = document.querySelector('button');
const people = document.querySelector('#people');
const astrosUrl = 'http://api.open-notify.org/astros.json';
const wikiUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/';

// Make an AJAX request
function getJSON(url, callback) {
  const xhr = new XMLHttpRequest();
  xhr.onload = function() {
    if (xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);
      return callback(data);
    }
  };
  xhr.open('GET', url);
  xhr.send();
}

// Get the profiles of astronauts
function getProfiles(json) {
  json.people.map(person => {
    getJSON(wikiUrl + person.name, generateHTML);
  })
}

// Generate the markup for each profile
function generateHTML(data) {
  const div = document.createElement('div');
  people.appendChild(div);

  const imageUrl = data.thumbnail && data.thumbnail.source ? data.thumbnail.source : `https://avatar.iran.liara.run/username?username=${data.title}`;

  div.innerHTML = `
    <img src=${imageUrl}>
    <h2>${data.title}</h2>
    <p>${data.description}</p>
  `;
}

btn.addEventListener('click', (event) => {
  getJSON(astrosUrl, getProfiles);  
  event.target.remove();
});