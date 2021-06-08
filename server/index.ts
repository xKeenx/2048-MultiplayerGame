import { createServer } from "http";
import { Server } from "socket.io";
import {gameService} from "./game-service";


const httpServer = createServer(function(req,res){
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    res.setHeader('Access-Control-Allow-Headers', '*');
    if ( req.method === 'OPTIONS' ) {
        res.writeHead(200);
        res.end();
        return;
    }

    // ...
});

const io = new Server(httpServer,{ cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }});



io.on("connection",(socket) => {
    gameService.clientConnected(socket.id)
    console.log("Подключились")


    gameService.clients.watch((clients)=>{
        socket.emit('sendClients',clients)

    })


     socket.on('newGameClicked',()=>{
         gameService.init(socket.id)
     })

    socket.on('move',(direction)=>{
        gameService.move({direction: direction, clientId: socket.id})


    })

    socket.on('disconnect',_ => {
        gameService.clientDisconnected(socket.id)
        console.log("Отключились")
    })
})



httpServer.listen(3001);


