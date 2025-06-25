/*
 * @Author: jihao00122 52628008+jihao00122@users.noreply.github.com
 * @Date: 2025-06-24 21:38:41
 * @LastEditors: jihao00122 52628008+jihao00122@users.noreply.github.com
 * @LastEditTime: 2025-06-25 12:07:18
 * @FilePath: /CollaborativeDoc/packages/editor/src/CollaborativeEditor.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

// 导出编辑器引用接口类型
export interface CollaborativeEditorRef {
  getEditor: () => Editor | null;
}

// 注释掉这些类型声明，因为它们没有正确应用
// declare module '@tiptap/react' {
//   interface Commands<ReturnType> {
//     toggleBold: () => ReturnType;
//     toggleItalic: () => ReturnType;
//     toggleStrike: () => ReturnType;
//     toggleUnderline: () => ReturnType;
//     toggleHeading: (attrs: { level: number }) => ReturnType;
//     toggleBulletList: () => ReturnType;
//     toggleOrderedList: () => ReturnType;
//     toggleBlockquote: () => ReturnType;
//     toggleCodeBlock: () => ReturnType;
//   }
// }

interface CollaborativeEditorProps {
  documentId: string;
  username: string;
  userColor?: string;
  websocketUrl?: string;
  onActiveUsersChange?: (users: Array<{name: string, color: string}>) => void;
}

export const CollaborativeEditor = forwardRef<CollaborativeEditorRef, CollaborativeEditorProps>(({
  documentId,
  username,
  userColor = '#' + Math.floor(Math.random() * 16777215).toString(16), // 随机颜色
  websocketUrl = 'ws://localhost:1234',
  onActiveUsersChange,
}, ref) => {
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
      
      // 如果提供了回调函数，则通知父组件活跃用户状态更改
      if (onActiveUsersChange) {
        onActiveUsersChange(users);
      }
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
  }, [documentId, username, userColor, websocketUrl, onActiveUsersChange]);

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
          class: 'editor-content focus:outline-none',
        },
      },
    },
    [isConnected] // 只依赖连接状态，而不是provider对象本身
  );

  // 暴露编辑器实例到父组件
  useImperativeHandle(ref, () => ({
    getEditor: () => editor,
  }));

  // 自定义CSS，使用项目变量
  const editorStyles = `
    .editor-content {
      height: 100%;
      width: 100%;
      padding: var(--editor-padding, 2rem);
      background: var(--bg-color-card, #fff);
      color: var(--text-color, #1a202c);
      border-radius: var(--border-radius, 12px);
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: var(--editor-line-height, 1.7);
      transition: var(--transition, all 0.2s ease-in-out);
      min-height: 300px;
      box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
    }
    
    .editor-content:focus {
      outline: none;
      background: var(--bg-color-card, #fff);
    }
    
    .editor-content h1 {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 1rem;
      color: var(--text-color, #1a202c);
      border-bottom: 1px solid var(--border-color, rgba(229, 231, 235, 0.8));
      padding-bottom: 0.5rem;
    }
    
    .editor-content h2 {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 0.75rem;
      color: var(--text-color, #1a202c);
    }
    
    .editor-content h3 {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: var(--text-color, #1a202c);
    }
    
    .editor-content p {
      margin-bottom: 1rem;
    }
    
    .editor-content ul, .editor-content ol {
      margin-left: 1.5rem;
      margin-bottom: 1rem;
    }
    
    .editor-content li {
      margin-bottom: 0.25rem;
    }
    
    .editor-content blockquote {
      border-left: 3px solid var(--primary-color, #3182ce);
      padding-left: 1rem;
      margin-left: 0;
      color: var(--text-color-light, #718096);
      font-style: italic;
      margin: 1rem 0;
      background: rgba(var(--primary-rgb, 49, 130, 206), 0.05);
      padding: 0.5rem 1rem;
      border-radius: 0 var(--border-radius-sm, 6px) var(--border-radius-sm, 6px) 0;
    }
    
    .editor-content code {
      background-color: var(--bg-color-light, #edf2f7);
      padding: 0.2em 0.4em;
      border-radius: var(--border-radius-sm, 6px);
      font-family: 'Courier New', Courier, monospace;
      font-size: 0.9em;
    }
    
    .editor-content pre {
      background-color: var(--bg-color-light, #edf2f7);
      padding: 1rem;
      border-radius: var(--border-radius-sm, 6px);
      overflow-x: auto;
      margin-bottom: 1rem;
    }
    
    .editor-content pre code {
      background-color: transparent;
      padding: 0;
    }
    
    .editor-content a {
      color: var(--primary-color, #3182ce);
      text-decoration: underline;
      text-underline-offset: 2px;
    }
    
    .editor-content a:hover {
      color: var(--primary-color-dark, #2c5282);
    }
    
    .ProseMirror {
      outline: none;
    }
    
    .ProseMirror p.is-editor-empty:first-child::before {
      color: var(--text-color-lighter, #a0aec0);
      content: attr(data-placeholder);
      float: left;
      height: 0;
      pointer-events: none;
    }
    
    @media (prefers-color-scheme: dark) {
      .editor-content {
        background: var(--bg-color-card, #2d3748);
        color: var(--text-color-dark, #f7fafc);
        box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
      }
      
      .editor-content:focus {
        background: var(--bg-color-card, #2d3748);
      }
      
      .editor-content code {
        background-color: var(--bg-color-dark, #1a202c);
      }
      
      .editor-content pre {
        background-color: var(--bg-color-dark, #1a202c);
      }
      
      .editor-content h1, .editor-content h2, .editor-content h3 {
        color: var(--text-color-dark, #f7fafc);
      }
      
      .editor-content h1 {
        border-color: var(--border-color-dark, #4a5568);
      }
      
      .editor-content blockquote {
        background: rgba(var(--primary-rgb, 49, 130, 206), 0.1);
      }
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;

  // 如果还未连接，显示加载状态
  if (!isConnected) {
    return (
      <div className="loading-container" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100%',
        flexDirection: 'column',
        gap: '1rem',
        backgroundColor: 'var(--bg-color-card, #fff)',
        borderRadius: 'var(--border-radius, 12px)',
        padding: '2rem',
        boxShadow: 'var(--shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06))',
      }}>
        <div className="spinner" style={{
          width: '40px',
          height: '40px',
          border: '3px solid rgba(0, 0, 0, 0.1)',
          borderRadius: '50%',
          borderTopColor: 'var(--primary-color, #3182ce)',
          animation: 'spin 0.8s linear infinite'
        }}></div>
        <p style={{ 
          color: 'var(--text-color-light, #718096)',
          fontSize: '0.9rem',
          fontWeight: '500'
        }}>正在连接到协作服务器...</p>
      </div>
    );
  }

  return (
    <div className="collaborative-editor" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      width: '100%',
      borderRadius: 'var(--border-radius, 12px)',
      boxShadow: 'var(--shadow-lg, 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04))',
      overflow: 'hidden',
      border: 'var(--editor-border, 1px solid var(--border-color))',
    }}>
      <style dangerouslySetInnerHTML={{__html: editorStyles}} />
      <EditorContent editor={editor} style={{ height: '100%' }} />
    </div>
  );
});

// 为组件添加显示名称，提高开发体验
CollaborativeEditor.displayName = 'CollaborativeEditor';

export default CollaborativeEditor; 