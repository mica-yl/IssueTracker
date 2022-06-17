"use strict";
const { MongoClient } = require('mongodb');
const uri = 'mongodb://localhost:27017/issuetracker';


async function run() {
    const client = await MongoClient.connect(uri);
    console.log('connecting...');
    const db = client.db();
    const doc = await db.stats();
    console.dir(doc);
    client.close();
}
run().catch(err => console.dir('errf: ', err));



