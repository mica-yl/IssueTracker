"use strict";
const { MongoClient } = require('mongodb');
const uri = 'mongodb://localhost:27017';
const { Command } = require('commander');
const program = new Command();

program
    .name('try-mongo-driver')
    .description('CLI to try mongodb driver.')
    .version('0.1.0');

[
    {
        name: 'callbacks',
        description: '',
        action: () => {
            MongoClient.connect(uri, (_err, client) => {
                const employees = client.db('mongodbVSCodePlaygroundDB').collection('employees');
                employees.insertOne({ id: 1, name: 'A. Callback' }, (_err, result) => {
                    console.log('result:');
                    console.dir(result);
                    employees.find({id:1}).toArray().then(docs => {
                    console.log('result of find:');
                    console.dir(docs);
                        client.close();
                    });
                });
            });
        },

    },
    { name: 'promises' },
    { name: 'generators' },
    { name: 'async' },


].forEach(( {name, action= () => console.log('TODO !'), description= 'TODO' }) =>
    program.command(name).description(description).action(action)
);

// program.command('callbacks');
//   .description('Split a string into substrings and display as an array')
//   .argument('<string>', 'string to split')
//   .option('--first', 'display just the first substring')
//   .option('-s, --separator <char>', 'separator character', ',')
//   .action((str, options) => {
//     const limit = options.first ? 1 : undefined;
//     console.log(str.split(options.separator, limit));
//   });


program.parse();


// async function run() {
//     const client = await MongoClient.connect(uri);

//     client.db('mongodbVSCodePlaygroundDB')
//         .collection('students')
//         .find().toArray().then(docs => {
//             console.dir(docs);
//             client.close();
//         });
// }
// run().catch(err => console.dir('errf: ', err));



