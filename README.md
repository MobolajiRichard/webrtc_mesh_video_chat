#About this Project

This is Group video chat application that is built on top the WebRTC Mesh Topology.

This is the server side of the application, more details about this project can be found in the Web directory of this project.

In as much as WebRTC doesn't require a server, it still needs a signalling server to connect to other peers.

This signalling server is built using Node, express and socket.io.

To start server,
Open your terminal and run the command:
            - "npm install" - (To install the dependencies)
            - "node server" - (To start the server)

After a succesful connection, you should see a message in the console - 'Server running on Port 8080'

Dependencies:
    "cors" - For cross origin access,
    "express" - Used for creating server,
    "http" - http requests,
    "socket.io" - For signalling



