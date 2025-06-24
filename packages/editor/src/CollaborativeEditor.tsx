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
  const [activeUsers, setActiveUsers] = useState<Array<{name: string, color: string}>>([]);

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

    // 监听其他用户的状态变化
    websocketProvider.awareness.on('change', () => {
      const states = websocketProvider.awareness.getStates();
      const users: Array<{name: string, color: string}> = [];
      
      states.forEach((state: any) => {
        if (state.user) {
          users.push({
            name: state.user.name,
            color: state.user.color,
          });
        }
      });
      
      setActiveUsers(users);
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
    return (
      <div className="loading-container" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '200px',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div className="spinner" style={{
          width: '40px',
          height: '40px',
          border: '3px solid rgba(0, 0, 0, 0.1)',
          borderRadius: '50%',
          borderTopColor: '#3182ce',
          animation: 'spin 0.8s linear infinite'
        }}></div>
        <p style={{ 
          color: '#4a5568',
          fontSize: '0.9rem' 
        }}>正在连接到协作服务器...</p>
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}} />
      </div>
    );
  }

  return (
    <div className="collaborative-editor" style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      height: '100%',
      width: '100%',
    }}>
      <div className="editor-header" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem',
        backgroundColor: '#f7fafc',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e2e8f0',
      }}>
        <div className="document-info" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#4a5568' }}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <span style={{ fontWeight: 500, color: '#2d3748' }}>文档ID: </span>
          <span style={{ 
            backgroundColor: '#ebf8ff', 
            padding: '0.2rem 0.5rem', 
            borderRadius: '4px',
            fontSize: '0.9rem',
            color: '#2c5282',
            fontFamily: 'monospace'
          }}>{documentId}</span>
        </div>
        
        <div className="active-users" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <span style={{ fontSize: '0.9rem', color: '#718096' }}>在线用户:</span>
          <div style={{ display: 'flex', marginLeft: '0.5rem' }}>
            {activeUsers.map((user, index) => (
              <div 
                key={index} 
                style={{ 
                  position: 'relative',
                  marginLeft: index > 0 ? '-8px' : '0',
                  zIndex: activeUsers.length - index,
                }}
                title={user.name}
              >
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: user.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: '0.75rem',
                  border: '2px solid #fff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="editor-toolbar" style={{
        display: 'flex',
        gap: '0.25rem',
        padding: '0.5rem 0.75rem',
        backgroundColor: '#f7fafc',
        borderRadius: '8px 8px 0 0',
        borderTop: '1px solid #e2e8f0',
        borderLeft: '1px solid #e2e8f0',
        borderRight: '1px solid #e2e8f0',
      }}>
        <button 
          onClick={() => editor?.chain().focus().toggleBold().run()} 
          className={editor?.isActive('bold') ? 'is-active' : ''}
          style={{
            padding: '0.3rem 0.6rem',
            borderRadius: '4px',
            border: 'none',
            background: editor?.isActive('bold') ? '#e2e8f0' : 'transparent',
            cursor: 'pointer',
            color: '#4a5568',
            fontWeight: editor?.isActive('bold') ? 'bold' : 'normal',
          }}
        >
          B
        </button>
        <button 
          onClick={() => editor?.chain().focus().toggleItalic().run()} 
          className={editor?.isActive('italic') ? 'is-active' : ''}
          style={{
            padding: '0.3rem 0.6rem',
            borderRadius: '4px',
            border: 'none',
            background: editor?.isActive('italic') ? '#e2e8f0' : 'transparent',
            cursor: 'pointer',
            color: '#4a5568',
            fontStyle: editor?.isActive('italic') ? 'italic' : 'normal',
          }}
        >
          I
        </button>
      </div>
      
      <div className="editor-content" style={{
        flexGrow: 1,
        border: '1px solid #e2e8f0',
        borderRadius: '0 0 8px 8px',
        overflow: 'hidden',
      }}>
        <EditorContent editor={editor} />
      </div>
      
      <div className="editor-footer" style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0.75rem',
        fontSize: '0.85rem',
        color: '#718096',
        borderTop: '1px solid #e2e8f0',
      }}>
        <div>
          已连接 · 由 {username} 编辑中
        </div>
        <div>
          实时协作中
        </div>
      </div>
    </div>
  );
};

export default CollaborativeEditor; 