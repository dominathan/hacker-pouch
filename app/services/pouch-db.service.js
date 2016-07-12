var { filterByInternalType, cleanBulkData } = require('../lib/utils')()

module.exports = function () {
  const PouchDB = require('pouchdb')
  let db, pouchSyncUrl

  return {
    init: init
  }

  function init (dbName) {
    db = dbName ? new PouchDB(dbName) : new PouchDB('hacker-pouch')
    pouchSyncUrl = dbName ? `http://localhost:3001/db/${dbName}` : `http://localhost:3001/db/hacker-pouch`
    db.sync(pouchSyncUrl, {
      live: true,
      retry: true
    }).on('change', function (info) {
      console.log("CHANGE", info)
    }).on('complete', function (info) {
      console.log('COMPLETE', info)
    }).on('error', function (err) {
      console.log('ERRORED OUT', err)
    })

    return {
      bulkInsert: bulkInsert,
      updateDoc: updateDoc,
      db: db,
      listenForDbChanges: listenForDbChanges
    }
  }

  function bulkInsert (items) {
    items.forEach((itemToSave) => updateDoc(itemToSave))
  }

  function listenForDbChanges () {
    db.changes({
      since: 'now',
      include_docs: true
    })
    .on('complete', (info) => {
      if (info.results.length) {
        console.log('info for complete event', info)
        // getDocsByWord(info.results[0].doc.internalType)
      }
    })
    .on('error', handleErrors)
  }

  function updateDoc (hackItem) {
    db.get(hackItem._id)
      .then((doc) => {
        if (doc.descendants !== hackItem.descendants || doc.score !== hackItem.score) {
          return db.put(Object.assign(doc, hackItem))
                   .catch((err) => console.log('Error updating item', err))
        }
      })
      .catch((err) => {
        if (err.name === 'not_found') {
          db.put(hackItem)
            .catch((error) => console.log('TROUBLE SAVING NEW ITEM', error))
        }
      })
  }

  function handleErrors (err) {
    console.log('ERROR', err)
  }
}
