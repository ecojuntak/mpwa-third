var dbPromise = idb.open("main-bola-db", 1, upgradeDb => {
  upgradeDb.createObjectStore("bookmarks", { keyPath: 'id' });
});

async function addBookmark(id) {
  const match = await getMatchDetail(id)
  
  await dbPromise.then(db => {
    var tx = db.transaction('bookmarks', 'readwrite');
    var bookmark = tx.objectStore('bookmarks');

    var newBookmark = {
      id: match.id,
      awayTeam: match.awayTeam,
      homeTeam: match.homeTeam,
      utcDate: match.utcDate
    };

    bookmark.add(newBookmark);
    return tx.complete;
  }).then(() => {
    var toastHTML = '<span>Match bookmarked!</span>';
    M.toast({html: toastHTML});
  }).catch((err) => {
    var toastHTML = '<span>Error while bookmarking match</span>';
    M.toast({html: toastHTML});
    console.log(err)
  })

  loadPage()
}

async function isBookmarked(id) {
  return await getSingleBookmarked(id) === undefined ? false : true
}

function getSingleBookmarked(id) {
  return dbPromise.then(db => {
    var tx = db.transaction('bookmarks', 'readonly');
    var bookmark = tx.objectStore('bookmarks');
   
    return bookmark.get(id); 
  }).then((match) => {
    return match
  }).catch(err => {
    console.log(err)
  });
}

async function removeBookmark(id) {
  await dbPromise.then(db => {
    var tx = db.transaction('bookmarks', 'readwrite');
    var bookmark = tx.objectStore('bookmarks');

    bookmark.delete(id);
    return tx.complete;
  }).then(() => {
    var toastHTML = '<span>Match unbookmarked!</span>';
    M.toast({html: toastHTML});
  });

  loadPage()
}

function getBookmarkedMatch() {
  return dbPromise.then(function (db) {
    var tx = db.transaction('bookmarks', 'readonly');
    var bookmark = tx.objectStore('bookmarks');

    return bookmark.getAll();
  }).then(bookmarks => {
    return bookmarks
  });
}