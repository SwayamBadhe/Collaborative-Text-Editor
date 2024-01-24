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

app.use(
  cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Origin', 'Content-Type', 'Accept'],
  })
);

app.use((req, res, next) => {
  console.log('Received request:', req.method, req.url);
  next();
});

app.options('*', cors());
app.use(express.json());
app.use(cookieParser());
app.use('/', authRoute);

mongoose
  .connect(process.env.MONGODB_URL)
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
const collectionName = 'doc-collection';

const startServer = () => {
  const server = http.createServer(app);
  const webSocketServer = new WebSocket.Server({ server });

  // console.log(`WebSocket server started on port ${PORT}`);

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

const setupDocument = (documentId) => {
  return new Promise(async (resolve, reject) => {
    const doc = connection.get(collectionName, documentId);

    try {
      await doc.fetch();
      if (!doc.type) {
        /**
         * If the document doesn't exist, create it with initial content
         */
        doc.create([{ insert: 'Start Typing below' }], 'rich-text', (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(doc);
          }
        });
      } else {
        resolve(doc);
      }
    } catch (error) {
      reject(error);
    }
  });
};

app.get('/documents/:title', async (req, res) => {
  const title = req.params.title;

  try {
    const existingDocument = await document.findOne({ title });

    if (!existingDocument) {
      res.status(404).json({ message: 'Document not found' });
      return;
    }

    const documentId = existingDocument._id.toString();
    await setupDocument(existingDocument.title);

    res.status(200).json({ existingDocument });
  } catch (error) {
    console.error('Error fetching document by title:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

startServer();
