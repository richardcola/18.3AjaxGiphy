"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  const response = await axios.get(`http://api.tvmaze.com/search/shows?q=${term}`);
  const shows = response.data.map((result) => {
    const show = result.show;
    return {
      id: show.id,
      name: show.name,
      summary: show.summary,
      image: show.image ? show.image.medium : "https://via.placeholder.com/210x295?text=No+Image"
    };
  });
  return shows;
}

/** Given list of shows, create markup for each and add it to the DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const imageHtml = show.image ? `<img class="card-img-top" src="${show.image}" alt="${show.name}">` : `<img class="card-img-top" src="https://tinyurl.com/tv-missing" alt="${show.name}">`;

    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="card">
           ${imageHtml}
           <div class="card-body">
             <h5 class="card-title text-primary">${show.name}</h5>
             <p class="card-text"><small>${show.summary}</small></p>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($show);
  }
}

/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

/** Given a show ID, get episodes for that show.
 *
 *  Returns (promise) an array of episode objects: [episode, episode, ...].
 *    Each episode object should contain exactly: {id, name, season, number}
 */

async function getEpisodes(showId) {
  const response = await axios.get(`http://api.tvmaze.com/shows/${showId}/episodes`);
  const episodes = response.data.map((episode) => {
    return {
      id: episode.id,
      name: episode.name,
      season: episode.season,
      number: episode.number
    };
  });
  return episodes;
}

/** Given a list of episodes, populate the episodes list in the DOM */

function populateEpisodes(episodes) {
  const $episodesList = $("#episodesList");
  $episodesList.empty();

  for (let episode of episodes) {
    const $episode = $("<li></li>").text(`${episode.name} (season ${episode.season}, number ${episode.number})`);
    $episodesList.append($episode);
  }

  $episodesArea.show();
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});
