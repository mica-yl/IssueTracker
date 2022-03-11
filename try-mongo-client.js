"use strict";

const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
async function run() {
    const client = await MongoClient.connect(uri);

    client.db('mongodbVSCodePlaygroundDB')
        .collection('students')
        .find().toArray().then(docs => {
            console.dir(docs);
            client.close();
        });
}
run().catch(err => console.dir('errf: ',err));



