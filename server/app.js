var express = require('express');
var WebSocket = require('ws');
var http = require('http');
var ShareDB = require('sharedb');
var WebSocketJSONStream = require('@teamwork/websocket-json-stream');
const richText = require('rich-text');

/**
 * Registering this type allows ShareDB to understand the complex transformations that can occur in
 * rich-text documents when multiple users are collaborating. It enables ShareDB to properly
 * synchronize changes made by different users in real-time.
 */
ShareDB.types.register(richText.type);

const shareDBServer = new ShareDB();
const connection = shareDBServer.connect();

/**
 * The collectionName and documentId are used to identify the document that we want to share.
 */
const collectionName = 'doc-collection';
const documentId = 'doc-id';
const doc = connection.get(collectionName, documentId);

doc.fetch((error) => {
  if (error) return console.error(error);

  if (!doc.type) {
    /**
     * If the document doesn't exist, create it with initial content
     */
    doc.create([{ insert: 'Start Typing below' }], 'rich-text', () => {
      startServer();
    });
    return;
  } else {
    startServer();
  }
});

const startServer = () => {
  const app = express();
  const server = http.createServer(app);
  const webSocketServer = new WebSocket.Server({ server });

  console.log(`WebSocket server started on port ${server}`);

  webSocketServer.on('connection', (webSocket) => {
    console.log('Client connected');

    /**
     * establishing a communication channel between the ShareDB server and a WebSocket client
     */
    const stream = new WebSocketJSONStream(webSocket);
    shareDBServer.listen(stream);

    webSocket.on('close', () => {
      console.log('Client disconnected');
    });
  });

  const PORT = process.env.PORT || 3001;
  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
};
