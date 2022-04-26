const path = require('path');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {  cors: {
  origin: "*",
}});
const {version, validate} = require('uuid');

const PORT = process.env.PORT || 3001;

const ACTIONS = {
  JOIN: 'join',
  LEAVE: 'leave',
  SHARE_ROOMS: 'share-rooms',
  ADD_PEER: 'add-peer',
  REMOVE_PEER: 'remove-peer',
  RELAY_SDP: 'relay-sdp',
  RELAY_ICE: 'relay-ice',
  ICE_CANDIDATE: 'ice-candidate',
  SESSION_DESCRIPTION: 'session-description',
  RELAY_AUDIO_STATE: 'relay-audio-state',
  RELAY_VIDEO_STATE: 'relay-video-state',
  AUDIO_STATE: 'audio-state',
  VIDEO_STATE: 'video-state',
};

function getClientRooms() {
    const {rooms} = io.sockets.adapter;
    
    return Array.from(rooms.keys()).filter(roomID => validate(roomID) && version(roomID) === 4);
}


function shareRoomsInfo() {
    io.emit(ACTIONS.SHARE_ROOMS, {
    rooms: getClientRooms(),
    clients: allClients
    })
}

function arrayRemove(arr, value) {
    return arr.filter(function(ele) {
        return ele != value;
    });
}

var allClients = [];

io.on('connection', socket => {
    
    socket.on(ACTIONS.JOIN, ({roomID, userID, userName}) => {
        const {rooms: joinedRooms} = socket;
        

        allClients.push({
            "socketID": socket.id,
            "userID": userID,
            "userName": userName
        });
        
        if (Array.from(joinedRooms).includes(roomID)) {
            return console.warn(`Already joined to ${roomID}`);
        }
        
        const clients = Array.from(io.sockets.adapter.rooms.get(roomID) || []);
        
        clients.forEach(clientID => {
            //other romete connections
            io.to(clientID).emit(ACTIONS.ADD_PEER, {
            peerID: socket.id,
            userID: userID,
            userName: userName,
            createOffer: false
            });
            
            //own connection
            let client = allClients.find(client => client.socketID === clientID);

            socket.emit(ACTIONS.ADD_PEER, {
            peerID: clientID,
            userID: client.userID,
            userName: client.userName,
            createOffer: true,
            });
        });
        
        socket.join(roomID);
        shareRoomsInfo();
    });
    
    function leaveRoom() {
        const {rooms} = socket;
        
        Array.from(rooms)
        // LEAVE ONLY CLIENT CREATED ROOM
        .filter(roomID => validate(roomID) && version(roomID) === 4)
        .forEach(roomID => {
            
            const clients = Array.from(io.sockets.adapter.rooms.get(roomID) || []);
            
            clients
            .forEach(clientID => {
                io.to(clientID).emit(ACTIONS.REMOVE_PEER, {
                peerID: socket.id,
                });
                
                socket.emit(ACTIONS.REMOVE_PEER, {
                peerID: clientID,
                });
            });
            
            allClients = allClients.filter(client => client.socketID !== socket.id);
            
            socket.leave(roomID);
        });
        
        shareRoomsInfo();
    }
    
    socket.on(ACTIONS.LEAVE, leaveRoom);
    socket.on('disconnecting', leaveRoom);
    
    socket.on(ACTIONS.RELAY_SDP, ({peerID, sdp, sdpType}) => {
        
        io.to(peerID).emit(ACTIONS.SESSION_DESCRIPTION, {
        peerID: socket.id,
        sdp: sdp,
        sdpType: sdpType
        });
    });
    
    socket.on(ACTIONS.RELAY_ICE, ({peerID, iceSdp, iceSdpMLineIndex, iceSdpMid}) => {

        io.to(peerID).emit(ACTIONS.ICE_CANDIDATE, {
        peerID: socket.id,
        iceSdp: iceSdp,
        iceSdpMLineIndex: iceSdpMLineIndex,
        iceSdpMid: iceSdpMid
        });
    });
    
    //audio
    socket.on(ACTIONS.RELAY_AUDIO_STATE, ({roomID, audioState}) => {
        const clients = Array.from(io.sockets.adapter.rooms.get(roomID) || []);
        
        clients.forEach(clientID => {
            io.to(clientID).emit(ACTIONS.AUDIO_STATE, {
            peerID: socket.id,
            audioState: audioState
            });
        });
        
        shareRoomsInfo();
    });
    
    //video
    socket.on(ACTIONS.RELAY_VIDEO_STATE, ({roomID, videoState}) => {
        const clients = Array.from(io.sockets.adapter.rooms.get(roomID) || []);
        
        clients.forEach(clientID => {
            io.to(clientID).emit(ACTIONS.VIDEO_STATE, {
            peerID: socket.id,
            videoState: videoState
            });
        });
        
        shareRoomsInfo();
    });

});

const publicPath = path.join(__dirname, 'build');

app.use(express.static(publicPath));

app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

server.listen(3001, () => {
    console.log('Server Started!')
})
