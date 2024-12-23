const btn = document.querySelector('button');
const people = document.querySelector('#people');
const astrosUrl = 'http://api.open-notify.org/astros.json';
const wikiUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/';

// Get the profiles of astronauts
function getProfiles(json) {
  const profiles = json.people.map(person => {
    const craft = person.craft;
    return fetch(wikiUrl + person.name)
      .then(response => response.json())
      .then(profile => {
        return { ...profile, craft };
      })
      .catch(error => console.log('Error fetching Wiki: ', error));
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
      <span>${person.craft}</span>
      <h2>${person.title}</h2>
      <p>${person.description}</p>
    `;
  })
}

btn.addEventListener('click', (event) => {
  event.target.textContent = 'Loading...';

  fetch(astrosUrl)
    .then(response => response.json())
    .then(getProfiles)
    .then(generateHTML)
    .catch(error => {
      people.innerHTML = '<h3>Something went wrong</h3>';
      console.error(error);
    })
    .finally(() => event.target.remove());
});