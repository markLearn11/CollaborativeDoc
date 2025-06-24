/*
 * @Author: jihao00122 52628008+jihao00122@users.noreply.github.com
 * @Date: 2025-06-24 21:38:41
 * @LastEditors: jihao00122 52628008+jihao00122@users.noreply.github.com
 * @LastEditTime: 2025-06-24 22:10:30
 * @FilePath: /CollaborativeDoc/packages/editor/src/CollaborativeEditor.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

interface CollaborativeEditorProps {
  documentId: string;
  username: string;
  userColor?: string;
  websocketUrl?: string;
}

export const CollaborativeEditor: React.FC<CollaborativeEditorProps> = ({
  documentId,
  username,
  userColor = '#' + Math.floor(Math.random() * 16777215).toString(16), // 随机颜色
  websocketUrl = 'ws://localhost:1234',
}) => {
  // 使用useRef保存ydoc和provider，避免重新渲染时重新创建
  const ydocRef = useRef<Y.Doc>(new Y.Doc());
  const providerRef = useRef<WebsocketProvider | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // 清理之前的provider
    if (providerRef.current) {
      providerRef.current.disconnect();
    }

    // 连接到WebSocket服务器
    const websocketProvider = new WebsocketProvider(
      websocketUrl,
      documentId,
      ydocRef.current
    );

    // 设置用户信息
    websocketProvider.awareness.setLocalStateField('user', {
      name: username,
      color: userColor,
    });

    // 使用ref存储provider，而不是state
    providerRef.current = websocketProvider;
    
    // 使用简单的布尔状态表示连接状态，避免存储复杂对象
    setIsConnected(true);

    return () => {
      websocketProvider.disconnect();
      providerRef.current = null;
      setIsConnected(false);
    };
  }, [documentId, username, userColor, websocketUrl]);

  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          history: false, // 禁用内置历史记录，因为CRDT提供了历史记录
        }),
        Collaboration.configure({
          document: ydocRef.current,
        }),
        // 只有当provider存在时才添加CollaborationCursor扩展
        ...(providerRef.current ? [
          CollaborationCursor.configure({
            provider: providerRef.current,
            user: {
              name: username,
              color: userColor,
            },
          })
        ] : [])
      ],
      editorProps: {
        attributes: {
          class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
        },
      },
    },
    [isConnected] // 只依赖连接状态，而不是provider对象本身
  );

  // 如果还未连接，显示加载状态
  if (!isConnected) {
    return <div>正在连接到协作服务器...</div>;
  }

  return (
    <div className="collaborative-editor">
      <div className="editor-header">
        <div className="document-id">文档ID: {documentId}</div>
        <div className="user-info">
          <span className="username">{username}</span>
          <span
            className="user-color"
            style={{
              display: 'inline-block',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: userColor,
              marginLeft: '5px',
            }}
          ></span>
        </div>
      </div>
      <div className="editor-content">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default CollaborativeEditor; 