#About this Project

This is Group video chat application that is built on top the WebTC Mesh Topology.

WebRTC mesh allows multiple browsers to communicate directly with each other by forming a peer to peer network, which allows each browsers to act as both a sender and a receiver of data and can also relay data to other peers in the network.

The client side WebRTC connection is located in the Room.jsx file.

Following are the dependencies of this project:
    "@material-ui/core - For layout,
    "@material-ui/icons" - For icons,
    "@testing-library/jest-dom" - For testing,
    "@testing-library/react" - For testing,
    "@testing-library/user-event" - For testing,
    "react" - UI framework
    "socket.io-client" - For connection to the signalling server,
    "styled-components" - For styling.

To start this project,
    - Start the signalling server (more details in the root README file).
    - Open terminal and run the following command:
        - "cd web" - (Change directory) .
        - "npm install" - install project dependencies,
        - "npm start" - start the app.

Please note:
    - The maximum number of users is 4 (This is due to the fact on the mode of WebRTC mesh operation, more explanation in the video).
    - You need o start the server for the app to work.
