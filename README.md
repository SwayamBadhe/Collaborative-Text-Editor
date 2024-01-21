# Collaborative Text Editor with Quill and ShareDB

This project demonstrates a collaborative text editor using Quill (a rich-text editor) on the frontend and ShareDB (a real-time, collaborative backend) to synchronize document changes across multiple clients.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/SwayamBadhe/Collaborative-Text-Editor.git

   ```

2. Install dependencies using your preferred package manager:

   ```bash
   yarn install
   or
   npm insatall
   ```

### Usage

1. Start the server

   ```bash
   node server/app.js

   ```

2. Start the React app

   ```bash
   cd react-app
   yarn start

   ```

3. Open the app in your web browser and collaborate on the shared document.

### Technologies Used

- Quill: A modern rich text editor.
- ShareDB: A real-time, collaborative backend.
- WebSocket: A communication protocol for a bidirectional, full-duplex communication channel over a single, long-lived connection.

### Aditional Information

The WebSocket API is an advanced technology that makes it possible to open a two-way interactive communication session between the user's browser and a server. With this API, you can send messages to a server and receive event-driven responses without having to poll the server for a reply.

The WebSocket object provides the API for creating and managing a WebSocket connection to a server, as well as for sending and receiving data on the connection.

To construct a WebSocket, use the WebSocket() constructor.

```
const doc = connection.get('doc-collection', 'doc-id');

```

So, the entire line is saying, "Get the document with the ID 'doc-id' from the collection named 'doc-collection' in the ShareDB server connected through the connection object."

```

const stream = new WebSocketJSONStream(webSocket);

```

This creates a new instance of the WebSocketJSONStream class, which is part of the @teamwork/websocket-json-stream library. The purpose of this class is to provide a readable and writable stream that can be used to send and receive JSON messages over a WebSocket.

In ShareDB, the subscribe function is used to subscribe to changes in a document. When you subscribe to a document, your client receives updates whenever changes are made to that document by any client.
