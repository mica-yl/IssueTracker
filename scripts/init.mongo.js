const db = new Mongo().getDB("issuetracker");

db.issues.remove({});/// drop ?

db.issues.insertMany([
    {
        status: 'Open', owner: 'Ravan',
        created: new Date('2016-08-15'), effort: 5
        , completionDate: undefined
        , title: 'Error in Console when clicking add.',
    },

    {
        status: 'Assigned', owner: 'Eddie',
        created: new Date('2016-08-16'), effort: 14,
        completionDate: new Date('2016-05-16')
        , title: 'Missing bottom border on panel',
    },

]);

[{ status: 1 }, { owner: 1 }, { created: 1 }].forEach(obj =>
    db.issues.createIndex(obj));