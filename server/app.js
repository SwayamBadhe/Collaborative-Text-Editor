const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const ShareDB = require('sharedb');
const WebSocketJSONStream = require('@teamwork/websocket-json-stream');
const mongoose = require('mongoose');
const richText = require('rich-text');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoute = require('./routes/AuthRoute');
const { UserSchema, DocumentSchema } = require('./models');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use('/', authRoute);

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB is  connected successfully'))
  .catch((err) => console.error(err));

const user = mongoose.model('User', UserSchema);

const document = mongoose.model('Document', DocumentSchema);

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
