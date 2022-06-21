import { PassThrough } from 'stream';

const startChunk = `<!DOCTYPE html>

<html>

<head>
    <meta charset="utf8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pro MERN hello example</title>
    <!-- style --> 
    <link rel="stylesheet" href="/main.css">
    <link rel="stylesheet" href="/bootstrap/css/bootstrap.min.css">
</head>

<body>
    <!-- the app root -->

    <div id="root">
`;

const endChunk = `
</div>

<script src="/bundle/app.bundle.js"></script>
<script src="/bundle/vendors.bundle.js"></script>  

</body>

</html>`;

export default function template(body:string) {
  return startChunk + body + endChunk;
}

export const templateStream = () => new PassThrough({
  autoDestroy: true,
  construct(this, next) {
    this.push(Buffer.from(startChunk));
    next();
  },
  final(this, next) {
    this.push(Buffer.from(endChunk));
    next();
  },
});
