

/**  
  for portability see : https://www.mongodb.com/docs/mongodb-shell/write-scripts/#connection-considerations
  command : mongosh --host 172.17.0.3 --port 27500 --file [name].mongo.js
*/
const db = db.getSiblingDB('issuetracker');

const owners = ['Ravan', 'Eddie', 'Pieta', 'Parvati', 'Victor', 'Violet'];
const statuses = ['New', 'Open', 'Assigned', 'Fixed', 'Verified', 'Closed'];

for (let i = 0; i < 1000; i++) {
  const randomCreatedDate = new Date(
    (new Date()) - Math.floor(Math.random() * 60) * 1000 * 60 * 60 * 24);
  const randomCompletionDate = new Date(
    (new Date()) - Math.floor(Math.random() * 60) * 1000 * 60 * 60 * 24);
  const randomOwner = owners[Math.floor(Math.random() * 6)];
  const randomStatus = statuses[Math.floor(Math.random() * 6)];
  const randomEffort = Math.ceil(Math.random() * 20);
  const issue = {
    created: randomCreatedDate, completionDate: randomCompletionDate,
    owner: randomOwner, status: randomStatus, effort: randomEffort,
  };
  issue.title = 'Lorem ipsum dolor sit amet, ' + i;
  db.issues.insertOne(issue);
}