// warmUp.js
const net = require('net');
const HOST = '127.0.0.1';
const PORT = 8080;
const fs = require('fs');


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
            resTest.send(300, '<head><link href="/stylesheet.css" rel="stylesheet"/><img src = "/bmo1.gif"/></head> ' +
                '<body><h2>Welcome to the homepage!</h2></body>');

        }

        else if(reqobj.path === "/stylesheet.css"){
            resTest.sendFile('/stylesheet.css');
        }
        else if(reqobj.path === '/bmo1.gif'){
            resTest.sendFile('/img/bmo1.gif');

        }
        else if (reqobj.path === '/test'){
            resTest.sendFile('/html/test.html');
        }
        else{
            resTest.setHeader('Content-Type', 'text/html');
            resTest.send(404, 'this is not a page');

        }

    });


});


server.listen(PORT, HOST);


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
        console.log("file path is " + filePath);

        const fileType = fileName.split(".")[1];
        const encoding = {
            'encoding' : ""
        };
        if(fileType === 'txt'){
            console.log("encoding is now utf8");
            encoding.encoding = "utf8";
        }
        console.log("file type is " + fileType);
        fs.readFile(filePath, encoding, this.fileHandler.bind(this, fileType));


    }

    fileHandler(contentType, err, data){
    console.log("data is " + data);

    //1. set the contentType header
     if(fileTypes.hasOwnProperty(contentType)){
        this.setHeader('Content-Type', fileTypes[contentType]);
     }
     console.log("content type is " + fileTypes[contentType]);
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
        Response: Response

    };





