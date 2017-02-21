// warmUp.js
const net = require('net');
const fs = require('fs');


class App {
    constructor() { //pretty sure this is right
        console.log("inside constructor for new app object");
        this.server = net.createServer(this.handleConnection.bind(this));
        //this.server.listen(8080, '127.0.0.1');
        this.routes = {};
    }

    get(path, cb) { //pretty sure this is right
        console.log("inside get with path " + path + " and cb " + cb);
        this.routes[path] = cb; //callback should take req and resp parameters
    }

    listen(port, host) { //pretty sure this is right
        console.log("trying to listen");
        this.server.listen(port, host);

    }

    handleConnection(sock) { //ahhh
        //this.handleRequestData.bind(this, sock);
        sock.on('data', this.handleRequestData.bind(this, sock));
    }

    handleRequestData(sock, binaryData) {
        console.log('got data\n=====\n' + binaryData);

        //convert binaryData to string
        const bin = binaryData + '';

        //crete requestObject form string
        const reqobj = new Request(bin);
        console.log(reqobj.headers);
        //create new response ojbect
        const resTest = new Response(sock);

        //TODO: IS THIS WORKING??
        if (!reqobj.headers.hasOwnProperty('Host')) {
            console.log("doesn't have header");
            resTest.setHeader('Content-Type', 'text/html');
            resTest.send(400, '<h1><em>Not a valid request</em></h1>');
        }

        if (app.routes.hasOwnProperty(reqobj.path)) {
            console.log("this path " + reqobj.path + " has been set up");
            const requestHandler = app.routes[reqobj.path];
            requestHandler(reqobj, resTest);
        }else{
            resTest.setHeader('Content-Type', 'text/html');
            resTest.send(404, '<h1><em>This isn\'t a page :(</em></h1>');
        }

        sock.on('close', this.logResponse.bind(this, reqobj, resTest));
        /*/
         if(reqobj.path === '/'){
         resTest.setHeader('Content-Type', 'text/html');
         resTest.send(300, '<h1><em>FINALLY IT WORKS. Hello, Beautiful world!</em></h1>');

         }
         else if(reqobj.path === "/foo.css"){
         resTest.setHeader('Content-Type', 'text/html');
         resTest.send(300, '<h1><em>Welcome to the hidden page!!</em></h1>');
         }
         else if(reqobj.path === '/bmo1.gif'){
         resTest.sendFile('/img/bmo1.gif');
         }
         else if (reqobj.path === '/test'){
         resTest.sendFile('/html/test.html')
         }
         else{
         resTest.setHeader('Content-Type', 'text/html');
         resTest.send(404, 'this is not a page');

         }


         //if connection is closed, logResponse(req, res);
         }
         /*/

    }

    logResponse(req, res) {
        console.log(req.method);
        console.log(req.path);
        console.log(res.statusCode);
        console.log("socket has been closed successfully");
    }
}

const app = new App();
console.log("just tried to make app");
app.get('/hello', function(req, res) {
    res.send(200, 'HELLO WORLD');
});
app.get('/bmo1.gif', function(req, res) {
    res.sendFile('/img/bmo1.gif');
});
app.get('/harrypotter', function(req, res){
    res.sendFile('/img/celebration.gif');
})
app.listen(8080, '127.0.0.1');

/*/
const server = net.createServer((sock) => {
    console.log('got connection from ' + sock.remoteAddress + ':' + sock.remotePort);

    sock.on('data', function(binaryData) {
        console.log('got data\n=====\n' + binaryData);
        const bin = binaryData + '';
        const reqobj = new Request(bin);

        const resTest = new Response(sock);


        //TODO: figure out this """CSS""" nonsense
        if(reqobj.path === '/'){
            resTest.setHeader('Content-Type', 'text/html');
            resTest.send(300, '<h1><em>FINALLY IT WORKS. Hello, Beautiful world!</em></h1>');

        }
        else if(reqobj.path === "/foo.css"){
            resTest.setHeader('Content-Type', 'text/html');
            resTest.send(300, '<h1><em>Welcome to the hidden page!!</em></h1>');
        }
        else if(reqobj.path === '/bmo1.gif'){
            resTest.sendFile('/img/bmo1.gif');
        }
        else if (reqobj.path === '/test'){
            resTest.sendFile('/html/test.html')
        }
        else{
            resTest.setHeader('Content-Type', 'text/html');
            resTest.send(404, 'this is not a page');

        }

    });


});


server.listen(PORT, HOST);
/*/

class Response{

    constructor(socket){
        this.sock = socket;
        this. headers = {

        };

        this.body = "";
        this.statusCode = "";
    }
    setHeader(name, value){
        this.headers[name] = value;
    }

    write(data){
        this.sock.write(data);
    }

    end(){
        this.sock.end();
    }

    send(statusCode, body){
        this.statusCode = statusCode;
        this.body = body;
        let stringVersion = this.toString();

        this.write(stringVersion);
        this.end();
    }

    writeHead(statusCode){
        this.statusCode = statusCode;
        let resp = "HTTP/1.1 ";
        resp = resp.concat(this.statusCode + " ");
        if(statusCodes.hasOwnProperty(this.statusCode)){
            resp = resp.concat(statusCodes[this.statusCode] + '\r\n');
        }
        let headers = this.headers;
        Object.keys(headers).forEach(function(key) {
            resp = resp.concat(key + ": " + headers[key] + '\r\n');
        });
        resp = resp.concat("\r\n");
        this.write(resp);
    }

    redirect(statusCode, url){
        if(url === undefined){ //if first argument wasn't passed in
            this.statusCode = 301;
            this.headers['Location'] = statusCode;//only one argument passed in... the link
        }else{
            this.statusCode = statusCode;
            this.headers['Location'] = url;
        }

        let stringVersion = this.toString();
        this.write(stringVersion);
        this.end();
        //this.send(statusCode, stringVersion);
    }

    toString(){
        let resp = "HTTP/1.1 ";
        resp = resp.concat(this.statusCode + " ");
        if(statusCodes.hasOwnProperty(this.statusCode)){
            resp = resp.concat(statusCodes[this.statusCode] + "\r\n");
        }
        let headers = this.headers;
        Object.keys(headers).forEach(function(key) {

            resp = resp.concat(key + ": " + headers[key] + '\r\n');

        });
        resp = resp.concat("\r\n");
        if(!this.body){
            resp = resp.concat("");
        }else{
            resp = resp.concat(this.body);
        }

        return resp;
    }

    sendFile(fileName){
        let fileBeginning = '../public';
        let filePath = fileBeginning + fileName;
        console.log("file path is " + filePath);

        let fileType = fileName.split(".")[1];
        const encoding = {
            'encoding' : ""
        };
        if(fileType === 'txt'){
            console.log("encoding is now utf8");
            encoding.encoding == "utf8";
        }
        console.log("file type is " + fileType);
        fs.readFile(filePath, encoding, this.fileHandler.bind(this, fileType));


    }

    fileHandler(contentType, err, data){
        //console.log("data is " + data);

        //1. set the contentType header
        if(fileTypes.hasOwnProperty(contentType)){
            this.setHeader('Content-Type', fileTypes[contentType]);
        }
        this.writeHead(200);
        this.write(data);
        this.end();

    }



}
let fileTypes = {
    'jpeg': 'image/jpeg',
    'jpg' : 'image/jpeg',
    'png' : 'image/png',
    'gif' : 'image/gif',
    'html': 'text/html',
    'css' : 'text/css',
    'txt' : 'text/plain'
};

let statusCodes ={
    '200' : 'OK',
    '404' : 'Not Found',
    '500' : 'Internal Server Error',
    '400' : 'Bad Request',
    '301' : 'Moved Permanently',
    '302' : 'Found',
    '303' : 'See Other'
};



class Request{

    constructor (response) {
        const responseSplit = response.split('\r\n');
        /*/
         responseSplit.forEach((ele)=>{
         console.log(ele + "**");
         })
         /*/
        const firstLine = responseSplit[0]; //GET /PATH? /HTTP/1.1
        const firstLineSplit = firstLine.split(" ");
        this.version = 'HTTP/1.1';
        this.method = firstLineSplit[0].toString();
        this.path = firstLineSplit[1].toString();

        let whereDoesBodyStart = responseSplit.length-1;
        const headers = {

        };
        for(let i=1; i<responseSplit.length; i++){
            let tempSplit = responseSplit[i].split(": ");
            if(tempSplit[1] === undefined){
                continue;
            }
            headers[tempSplit[0]] = tempSplit[1];

        }
        this.headers = headers;
        //console.log("body apparently is " + responseSplit[whereDoesBodyStart]);
        if(!responseSplit[whereDoesBodyStart]){
            this.body = " "; //blank
        } else{
            this.body = responseSplit[whereDoesBodyStart];
        }

    }

    toString () {
        let s = '';
        s = s.concat(this.method+ " ");
        s = s.concat(this.path + " ");
        s = s.concat(this.version + "\r\n");
        let headers = this.headers;

        Object.keys(headers).forEach(function(key) {

            s = s.concat(key + ": " + headers[key] + '\r\n');

        });
        s = s.concat("\r\n");
        if(this.body === " "){
            return s;
        }else{
            s = s.concat(this.body);
            return s;
        }



    }


}



module.exports = {
    Request: Request,
    Response: Response,
   // App: App

};






