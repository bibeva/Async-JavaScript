const btn = document.querySelector('button');
const people = document.querySelector('#people');
const astrosUrl = 'http://api.open-notify.org/astros.json';
const wikiUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/';

// Handle all fetch requests
async function getAllPeople(url) {
  const peopleResponse = await fetch(url);
  const peopleJSON = await peopleResponse.json();

  const profiles = peopleJSON.people.map(async person => {
    const craft = person.craft;
    const profileResponse = await fetch(wikiUrl + person.name);
    const profileJSON = await profileResponse.json();

    return { ...profileJSON, craft };
  });

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

  getAllPeople(astrosUrl)
    .then(generateHTML)
    .finally(() => event.target.remove());
});