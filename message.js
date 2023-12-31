const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors=require('cors')
const app = express();
const server = http.createServer(app);

const io = socketIo(server,{
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET','POST'],
        credentials: true,
    },
});
const PORT = 5000;

app.use(express.json());
app.use(cors())

app.post('/api/message', (req,res)=>{
    const {name,message} = req.body;
    console.log(req.body);

    io.emit('message', {name,message});
    res.status(200).json({status:true})
});

io.on('connection', (socket) => {
    console.log('New client connected');
  
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
  
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });