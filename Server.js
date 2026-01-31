const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Store connected users
const users = new Map();

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('New user connected:', socket.id);

    // Handle user joining
    socket.on('join', (username) => {
        users.set(socket.id, username);
        io.emit('user joined', {
            username: username,
            totalUsers: users.size
        });
        console.log(`${username} joined the chat`);
    });

    // Handle incoming messages
    socket.on('chat message', (data) => {
        const username = users.get(socket.id) || 'Anonymous';
        io.emit('chat message', {
            username: username,
            message: data.message,
            timestamp: new Date().toISOString()
        });
    });

    // Handle user typing indicator
    socket.on('typing', () => {
        const username = users.get(socket.id);
        socket.broadcast.emit('typing', username);
    });

    // Handle stop typing
    socket.on('stop typing', () => {
        socket.broadcast.emit('stop typing');
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        const username = users.get(socket.id);
        if (username) {
            users.delete(socket.id);
            io.emit('user left', {
                username: username,
                totalUsers: users.size
            });
            console.log(`${username} left the chat`);
        }
    });
});

// Root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Server configuration
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`HaloTalk server is running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to start chatting`);
});
