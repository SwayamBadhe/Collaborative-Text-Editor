import React, { useEffect } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.bubble.css';
import Sharedb from 'sharedb/lib/client';
import richText from 'rich-text';

// Registering the rich text type to make sharedb work
// with our quill editor
Sharedb.types.register(richText.type);

function Home() {
  useEffect(() => {
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

    const socket = new WebSocket('ws://127.0.0.1:3001');
    const connection = new Sharedb.Connection(socket);
    const doc = connection.get('doc-collection', 'doc-id');
    let quill;

    /**
     * subscribe to changes in the document
     */
    doc.subscribe((err) => {
      if (err) {
        console.error('Error subscribing to document:', err);
        return;
      }
      console.log('Successfully subscribed to document');

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

    return () => {
      connection.close();
      socket.close();
    };
  }, []);

  return (
    <div style={{ margin: '5%', border: '1px solid' }}>
      <div id="editor"></div>
    </div>
  );
}

export default Home;
