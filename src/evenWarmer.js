// warmUp.js
const net = require('net');
const HOST = '127.0.0.1';
const PORT = 8080;


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
        }else{
            resTest.setHeader('Content-Type', 'text/html');
            resTest.send(404, 'this is not a page');

        }
        resTest.end();

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
        //console.log("body isnide send is " + this.body);
        let stringVersion = this.toString();

        this.write(stringVersion);
        this.end();
    }

    writeHead(statusCode){
        this.statusCode = statusCode;
        let stringVersion = this.toString();

        this.write(stringVersion);
        //don't close
    }

    redirect(statusCode, url){

        if(!statusCode){
            this.statusCode = '301';
        }else{
           this.statusCode = statusCode;
        }

        this.headers['Location'] = url;
        let stringVersion = this.toString();
        this.write(stringVersion);
        this.end();
    }

    toString(){
        let resp = "HTTP/1.1 ";
        resp = resp.concat(this.statusCode + " ");
        if(statusCodes.hasOwnProperty(this.statusCode)){
            resp = resp.concat(statusCodes[this.statusCode] + "\r\n");
        }
        let headers = this.headers;
        Object.keys(headers).forEach(function(key) {

            resp = resp.concat(key + ": " + headers[key] + '\n');

        });
        resp = resp.concat("\r\n");
        if(!this.body){
            resp = resp.concat(" ");
        }else{
            resp = resp.concat(this.body);
        }

        return resp;
    }
    sendFile(fileName){
        
    }



}
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

            s = s.concat(key + ": " + headers[key] + '\n');

        });
    s = s.concat("\r\n");
    s = s.concat(this.body + "\n");

    return s;


    }


}


    module.exports = {
        Request: Request,
        Response: Response

    };





