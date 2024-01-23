import React, { useEffect, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.bubble.css';
import Sharedb from 'sharedb/lib/client';
import richText from 'rich-text';
import axios from 'axios';
import { Link } from 'react-router-dom';

// Registering the rich text type to make sharedb work
// with our quill editor
Sharedb.types.register(richText.type);

function Home() {
  const [isChosen, setIsChosen] = useState(false);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const fetchAllDocuments = async () => {
      try {
        const { data } = await axios.get(
          'https://collaborative-text-editor-xi.vercel.app/documents'
        );
        console.log('Received data:', data);
        setDocuments(data.documents);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllDocuments();
  }, []);

  const handleDocumentClick = async (document) => {
    setIsChosen(true);

    try {
      const { data } = await axios.get(
        `https://collaborative-text-editor-xi.vercel.app/documents/${document.title}`
      );
      console.log('Received single data:', data);
      const socket = new WebSocket(
        'wss://collaborative-text-editor-gilt.vercel.app'
      );
      socket.addEventListener('error', (error) => {
        console.error('WebSocket Error:', error);
      });
      /**
       * subscribe to changes in the document
       */
      const connection = new Sharedb.Connection(socket);
      const doc = connection.get('doc-collection', data.existingDocument.title);

      console.log('title: ', data.existingDocument.title);

      doc.subscribe((err) => {
        if (err) {
          console.error('Error subscribing to document:', err);
          return;
        }
        console.log('Successfully subscribed to document');

        let quill;

        const toolbarOptions = [
          'bold',
          'italic',
          'underline',
          'code-block',
          'list',
        ];
        const options = {
          theme: 'bubble',
          modules: {
            toolbar: toolbarOptions,
          },
        };

        if (!quill) {
          quill = new Quill('#editor', options);
        }

        quill.setContents(doc.data);

        quill.on('text-change', function (delta, oldDelta, source) {
          if (source !== 'user') return;
          doc.submitOp(delta, { source: quill });
        });

        /**
         * operation -> transformation to a ShareDB document
         */
        doc.on('op', function (op, source) {
          if (source === quill) return;
          quill.updateContents(op);
        });
      });
    } catch (error) {
      console.error('Error fetching document content:', error);
    }
  };

  // testing purpose
  useEffect(() => {
    console.log(documents);
  }, [documents]);

  return (
    <div className="flex flex-col justify-center bg-gray-100 mx-7 mt-10">
      {isChosen ? (
        <>
          <div style={{ margin: '5%', border: '1px solid' }}>
            <div id="editor"></div>
          </div>
          <button
            className="bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-10 mx-auto w-40"
            onClick={() => {
              window.location.reload();
            }}
          >
            Back
          </button>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map((document, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-center bg-slate-400 p-4 rounded-md shadow-md cursor-pointer hover:shadow-lg transition duration-300"
                onClick={() => handleDocumentClick(document)}
              >
                <h3 className="text-lg font-semibold mb-2">{document.title}</h3>
              </div>
            ))}
          </div>
          <button className="bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-10 mx-auto">
            <Link to="/">Go to Main Page</Link>
          </button>
        </>
      )}
    </div>
  );
}

export default Home;
