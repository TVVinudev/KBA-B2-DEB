const http = require('http')

const server = http.createServer((req,res)=>{
    res.statusCode = 200;
    res.setHeader('Context-Type','text/plain');
    res.end('hello from server');
});

server.listen(3000,'127.0.0.1',()=>{
    console.log('server running at http://127.0.0.1:3000');
})