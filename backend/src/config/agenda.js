const {Agenda} = require("agenda");
const agenda = new Agenda({
    db: {
        address: process.env.MONGO_URI,   // same DB you already use
        collection: 'jobs',             // agenda creates this collection
    },
    processEvery: '1 minute',         // how often to check for due jobs
});

module.exports = agenda;
