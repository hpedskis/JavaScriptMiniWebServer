// warmUp.js
const net = require('net');
const HOST = '127.0.0.1';
const PORT = 8080;


const server = net.createServer((sock) => {
        console.log('got connection from ' + sock.remoteAddress + ':' + sock.remotePort);
        /*/
        sock.on('data', function(binaryData) {
            console.log('got data\n=====\n' + binaryData);
            sock.write('HTTP/1.1 200 OK\r\n Content-Type: text/html \r\n <h1>Check out my fancy header!</h1>');
            sock.end();

        });
        /*/
    sock.on('data', function(binaryData) {
        console.log('got data\n=====\n' + binaryData);
        sock.write('HTTP/1.1 200 OK \r\n\r\n <h1><em>FINALLY IT WORKS</em></h1>');

        // uncomment me if you want the connection to close
        // immediately after we send back data
        sock.end();
    });


});

server.listen(PORT, HOST);
