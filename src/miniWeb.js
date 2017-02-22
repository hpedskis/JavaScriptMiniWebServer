// warmUp.js
const net = require('net');
const fs = require('fs');


class App {
    constructor() { //pretty sure this is right
        //console.log("inside constructor for new app object");
        this.server = net.createServer(this.handleConnection.bind(this));
        //this.server.listen(8080, '127.0.0.1');
        this.routes = {};
    }

    get(path, cb) { //pretty sure this is right
        //console.log("inside get with path " + path + " and cb " + cb);
        this.routes[path] = cb; //callback should take req and resp parameters
    }

    listen(port, host) { //pretty sure this is right
        //console.log("trying to listen");
        this.server.listen(port, host);

    }

    handleConnection(sock) { //ahhh
        //this.handleRequestData.bind(this, sock);
        sock.on('data', this.handleRequestData.bind(this, sock));
    }

    handleRequestData(sock, binaryData) {
        //console.log('got data\n=====\n' + binaryData);

        //convert binaryData to string
        const bin = binaryData + '';

        //crete requestObject form string
        const reqobj = new Request(bin);
        //console.log(reqobj.headers);
        //create new response ojbect
        const resTest = new Response(sock);

        if (!reqobj.headers.hasOwnProperty('Host')) {
            //console.log("doesn't have header");
            resTest.setHeader('Content-Type', 'text/html');
            resTest.send(400, '<h1><em>Not a valid request</em></h1>');
        }

        if (this.routes.hasOwnProperty(reqobj.path)) {
            const requestHandler = this.routes[reqobj.path];
            requestHandler(reqobj, resTest);
        }else{
            console.log("in else");
            //<img src = "/totoroGoodbye.gif"/>
            resTest.setHeader('Content-Type', 'text/html');
            resTest.send(404, '<head><link href="/css/base.css" rel="stylesheet"/><img src = "/totoroGoodbye.gif"/></head> ' +
                '<body><h2>This page does not exist but here is a cute totoro</h2></body>');
        }

        sock.on('close', this.logResponse.bind(this, reqobj, resTest));

    }

    logResponse(req, res) {
        console.log(req.method + " " + req.path + " " + res.statusCode);
        console.log("socket has been closed successfully");
    }
}


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
        const stringVersion = this.toString();

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
        const headers = this.headers;
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

        const stringVersion = this.toString();
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
        const headers = this.headers;
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
        const fileBeginning = '../public';
        const filePath = fileBeginning + fileName;
        //console.log("file path is " + filePath);

        const fileType = fileName.split(".")[1];
        const encoding = {
            'encoding' : ""
        };
        if(fileType === 'txt'){
            //console.log("encoding is now utf8");
            encoding.encoding = "utf8";
        }
        //console.log("file type is " + fileType);
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
const fileTypes = {
    'jpeg': 'image/jpeg',
    'jpg' : 'image/jpeg',
    'png' : 'image/png',
    'gif' : 'image/gif',
    'html': 'text/html',
    'css' : 'text/css',
    'txt' : 'text/plain'
};

const statusCodes ={
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

        const whereDoesBodyStart = responseSplit.length-1;
        const headers = {

        };
        for(let i=1; i<responseSplit.length; i++){
            const tempSplit = responseSplit[i].split(": ");
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
        const headers = this.headers;

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
    App: App

};






