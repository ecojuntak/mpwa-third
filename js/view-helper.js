async function buildTodayMatcesView(content, data) {
  content.innerHTML = ` 
    <h5> ${data.count} Matches Today </h5>
      <div class="row">`

  await data.matches.forEach(match => {
    buildMatchCard(content, match)
  })

  content.innerHTML += "</div>"

  return content;
}

function buildBookmarkView(content, matches) {
  if (matches.length === 0) {
    content.innerHTML = `
      <div class="center">
        <h4> You have no bookmarked match! <a href="#home" onclick="loadPage('home')"> Back home </a></h4>
        <img class="responsive-img" width="200" height="200" src="/images/empty-bookmark.png">
      </div>
    `

    return
  }
  content.innerHTML = `<h5> ${matches.length} Bookmarked Match </h5>`

  matches.forEach(match => {
    buildMatchCard(content, match)
  })

  return content;
}

function buildMatchDetailView(content, match) {
  content.innerHTML = `
    <div class="center">
      <div class="row">
        <div class="col s12 m12 l12">
          <a href="#team?id=${match.awayTeam.id}" onclick="loadPage('team?id=${match.awayTeam.id}')">
            <div class="card #9575cd deep-purple lighten-2">
              <div class="card-content white-text">
                <span class="card-title"> ${match.awayTeam.name}</span>
              </div>
            </div>
          </a>
        </div>
      </div>

      <h4> vs </h4>

      <div class="row">
        <div class="col s12 m12 l12">
          <a href="#team?id=${match.homeTeam.id}" onclick="loadPage('team?id=${match.homeTeam.id}')">
            <div class="card #64b5f6 blue lighten-2">
              <div class="card-content white-text">
                <span class="card-title"> ${match.homeTeam.name}</span>
              </div>
            </div>
          </a>
        </div>
      </div>

      <h5> ${match.competition.name} </h5>
      <h5> ${new Date(match.utcDate)} </h5>
    </div>
  `
}

function buildTeamDetailView(content, team) {
  const squad = team.squad
  content.innerHTML = `
    <div class="center">
      <img class="responsive-img m-" width="150" height="100" src="${team.crestUrl}" alt="${team.name}"/>

      <h5> ${team.name} </h5>
      <h5> ${team.venue} </h5>
    </div>
  `

  buildSquadView(content, squad)
}

function buildSquadView(content, squad) {
  squad.forEach(member => {
    content.innerHTML += `
      <ul> ${member.name} as ${member.position}</ul>
    ` 
  })
}

function buildBookmarkButton(match) {
  return `<button
    class="waves-effect #01579b light-blue darken-4 btn-small"
    type="button"
    onclick="addBookmark(${match.id})"
  > Bookmark</button>`
}

function buildUnbookmarkButton(match) {
  return `<button
    class="waves-effect #f44336 red btn-small"
    type="button"
    onclick="removeBookmark(${match.id})"
  > Unbookmark</button>`
}

async function buildMatchCard(content, match) {
  const cardActionButton = await isBookmarked(match.id) ? buildUnbookmarkButton(match) : buildBookmarkButton(match)

  content.innerHTML += `
      <div class="col s12 m6">
        <div class="card #039be5 light-blue darken-1">
          <a href="#detail?id=${match.id}" onclick="loadPage('detail?id=${match.id}')" style="color: white;">
            <div class="card-content white-text">
              <span class="card-title"> ${match.awayTeam.name} vs ${match.homeTeam.name} </span>
              <p> ${new Date(match.utcDate)} </p>
            </div>
          </a>
            <div class="card-action">` 
            + cardActionButton +
            `</div>
        </div>
      </div>
  `

  return match
}

async function buildCompetitionListView(content, data) {
  content.innerHTML = ` 
    <h5> ${data.count} Competition in Regional Asia </h5>
      <div class="row">`

  await data.competitions.forEach(competition => {
    buildCompetititonList(content, competition)
  })

  content.innerHTML += "</div>"

  return content;
}

function buildCompetititonList(content, competition) {
  content.innerHTML += `
    <div class="col s12 m7">
      <div class="card #039be5 light-blue darken-1">
        <div class="card-stacked">
          <div class="card-content">
            <h4> ${competition.name} </h4>
            <h6> Subarea ${competition.area.name} </h6>
          </div>
        </div>
      </div>
    </div>
  `
}

function buildNotFoundView(content) {
  content.innerHTML = `
    <h4> Opsss! Sorry, I couldn't find the page :( </h4>
    <img class="responsive-img" src="/images/404.jpg">
  `
}

async function loadPage(page = null) {
  if (page === null) {
    page = window.location.hash.substr(1);
    if (page === "") page = "home";
  }

  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = async function () {
    if (this.readyState === 4) {
      let content = document.querySelector("#body-content");

      if (this.status === 200) {
        if (page === 'home') {
          const data = await getTodayMatch();
          buildTodayMatcesView(content, data)
        } else if (page === 'bookmark') {
          const data = await getBookmarkedMatch();
          buildBookmarkView(content, data)
        } else if (page.includes('detail')) {
          let id = await page.split("=")[1]
          const data = await getMatchDetail(id);
          buildMatchDetailView(content, data)
        } else if (page.includes('team')) {
          let id = await page.split("=")[1]
          const data = await getTeamDetail(id);
          buildTeamDetailView(content, data)
        } else if (page === 'competition') {
          const data = await getCompetitions();
          buildCompetitionListView(content, data)
        } else {
          buildNotFoundView(content)
        }
      } else if (this.status === 404) {
        buildNotFoundView(content)
      }
    }
  };
  xhttp.open("GET", "index.html", true);
  xhttp.send();
}