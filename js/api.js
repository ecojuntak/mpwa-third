function getTodayMatch() {
  const key = generateKey()

  if(isLatestUpdate(key)) {
    let data = localStorage.getItem(key)
    return JSON.parse(data)
  }

  return fetch('https://api.football-data.org/v2/matches', {
    method: 'get',
    headers: {
      'X-Auth-Token': 'b2bd13c3d314406790c5999e110dac42'
    }
  }).then(res => {
    return res.json()
  }).then(data => {
    localStorage.clear()
    localStorage.setItem(key, JSON.stringify(data))
    return data
  }).catch(err => {
    console.log(err)
  })
}

function getTeamDetail(id) {
  if(localStorage.getItem('team-'+id) !== null) {
    let data = localStorage.getItem('team-'+id)
    return JSON.parse(data)
  }

  return fetch('https://api.football-data.org/v2/teams/' + id, {
    method: 'get',
    headers: {
      'X-Auth-Token': 'b2bd13c3d314406790c5999e110dac42'
    }
  }).then(res => {
    return res.json()
  }).then(data => {
    localStorage.setItem('team-'+id, JSON.stringify(data))
    return data
  }).catch(err => {
    console.log(err)
  })
}

function getMatchDetail(id) {
  const key = generateKey()

  if(isLatestUpdate(key)) {
    let data = localStorage.getItem(key)
    matches = JSON.parse(data).matches

    let selectedMatch = {}

    for(let i=0; i<matches.length; i++) {
      if(matches[i].id == id) {
        selectedMatch = matches[i]
        break
      }
    }

    return selectedMatch
  }

  return fetch('https://api.football-data.org/v2/matches/' + id, {
    method: 'get',
    headers: {
      'X-Auth-Token': 'b2bd13c3d314406790c5999e110dac42'
    }
  }).then(res => {
    return res.json()
  }).then(data => {
    return data.match
  }).catch(err => {
    console.log(err)
  })
}

function getCompetitions() {
  if(localStorage.getItem('asia-competitions') !== null) {
    let data = localStorage.getItem('asia-competitions')
    return JSON.parse(data)
  }

  return fetch('https://api.football-data.org/v2/competitions?areas=2014', {
    method: 'get',
    headers: {
      'X-Auth-Token': 'b2bd13c3d314406790c5999e110dac42'
    }
  }).then(res => {
    return res.json()
  }).then(data => {
    localStorage.setItem('asia-competitions', JSON.stringify(data))
    return data
  }).catch(err => {
    console.log(err)
  })
}

function isLatestUpdate(key) {
  return localStorage.getItem(key) === null ? false : true
}

function generateKey() {
  let date = new Date();
  return date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate()
}