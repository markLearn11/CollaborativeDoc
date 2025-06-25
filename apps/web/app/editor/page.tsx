"use client";

import React, { useState, useEffect, useRef, forwardRef, useCallback } from 'react';
import { CollaborativeEditor } from '@repo/editor';
import { Button } from '@repo/ui';
import Link from 'next/link';
import styles from './page.module.css';

// 定义缺失的接口
interface CollaborativeEditorRef {
  getEditor: () => any;
}

// 创建自定义包装组件
interface CustomEditorProps {
  documentId: string;
  username: string;
  onActiveUsersChange?: (users: Array<{name: string, color: string}>) => void;
}

const CustomCollaborativeEditor = forwardRef<CollaborativeEditorRef, CustomEditorProps>(
  (props, ref) => {
    // 保留所有必需的属性
    const { onActiveUsersChange, ...requiredProps } = props;
    
    // 确保documentId有效 - 使用固定的格式
    const validDocId = props.documentId.trim() ? props.documentId : `doc_${Date.now()}`;
    
    // 记录连接ID，帮助调试 - 仅在组件挂载时记录一次
    useEffect(() => {
      console.log(`协作文档ID: ${validDocId}`);
    }, [validDocId]);

    // 记忆化回调函数，避免在每次渲染时创建新的函数实例
    const stableOnActiveUsersChange = useCallback((users: Array<{name: string, color: string}>) => {
      if (onActiveUsersChange) {
        onActiveUsersChange(users);
      }
    }, [onActiveUsersChange]);
    
    // 将所有必需的属性传递给原始组件，确保documentId有效
    // 使用记忆化的回调来避免无限重渲染
    return <CollaborativeEditor 
      ref={ref} 
      {...requiredProps} 
      documentId={validDocId} 
      onActiveUsersChange={stableOnActiveUsersChange}
    />;
  }
);

CustomCollaborativeEditor.displayName = 'CustomCollaborativeEditor';

export default function EditorPage() {
  // 状态管理
  const [username, setUsername] = useState('');
  const [documentId, setDocumentId] = useState('');
  const [documentTitle, setDocumentTitle] = useState('无标题文档');
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [activeUsers, setActiveUsers] = useState<Array<{name: string, color: string}>>([]);
  const [toolbarState, setToolbarState] = useState({
    bold: false,
    italic: false,
    underline: false,
    strike: false,
    heading1: false,
    heading2: false,
    heading3: false,
    bulletList: false,
    orderedList: false,
    blockquote: false,
    code: false,
  });
  
  // 编辑器引用
  const editorRef = useRef<CollaborativeEditorRef>(null);
  
  // 使用useCallback包装onActiveUsersChange，避免不必要的重新创建
  const handleActiveUsersChange = useCallback((users: Array<{name: string, color: string}>) => {
    setActiveUsers(users);
  }, []);
  
  // 初始化
  useEffect(() => {
    // 生成随机用户名
    const randomName = '用户_' + Math.floor(Math.random() * 1000);
    setUsername(randomName);
    
    // 检查URL中是否有文档ID参数
    const urlParams = new URLSearchParams(window.location.search);
    const docId = urlParams.get('id');
    if (docId) {
      setDocumentId(docId);
      setIsEditorReady(true);
    }
  }, []);

  // 处理文档ID输入变化
  const handleDocumentIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocumentId(e.target.value);
  };

  // 处理加入文档
  const handleJoinDocument = () => {
    if (!documentId.trim()) {
      // 如果没有提供ID，自动生成一个
      const newDocId = 'doc_' + Date.now();
      setDocumentId(newDocId);
      updateUrlWithDocId(newDocId);
    } else {
      // 更新URL以包含文档ID参数
      updateUrlWithDocId(documentId);
    }
    setIsEditorReady(true);
  };

  // 处理创建新文档
  const handleCreateDocument = () => {
    const newDocId = 'doc_' + Date.now();
    setDocumentId(newDocId);
    setIsEditorReady(true);
    // 更新URL以包含文档ID参数
    updateUrlWithDocId(newDocId);
  };

  // 更新URL以包含文档ID参数
  const updateUrlWithDocId = (docId: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('id', docId);
    window.history.pushState({}, '', url);
  };

  // 处理用户名输入变化
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };
  
  // 处理文档标题输入变化
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocumentTitle(e.target.value || '无标题文档');
  };
  
  // 处理复制文档ID
  const handleCopyDocId = () => {
    navigator.clipboard.writeText(documentId);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  // 处理工具栏按钮点击
  const handleToolbarButtonClick = (tool: string) => {
    const editor = editorRef.current?.getEditor();
    if (!editor) return;

    try {
      const chain = editor.chain().focus() as any;
      
      switch (tool) {
        case 'bold':
          chain.toggleBold().run();
          break;
        case 'italic':
          chain.toggleItalic().run();
          break;
        case 'strike':
          chain.toggleStrike().run();
          break;
        case 'underline':
          chain.toggleUnderline().run();
          break;
        case 'heading1':
          chain.toggleHeading({ level: 1 }).run();
          break;
        case 'heading2':
          chain.toggleHeading({ level: 2 }).run();
          break;
        case 'heading3':
          chain.toggleHeading({ level: 3 }).run();
          break;
        case 'bulletList':
          chain.toggleBulletList().run();
          break;
        case 'orderedList':
          chain.toggleOrderedList().run();
          break;
        case 'blockquote':
          chain.toggleBlockquote().run();
          break;
        case 'code':
          chain.toggleCodeBlock().run();
          break;
        default:
          break;
      }
      
      // 更新工具栏状态以反映当前文本格式
      setTimeout(() => {
        setToolbarState({
          bold: editor.isActive('bold'),
          italic: editor.isActive('italic'),
          strike: editor.isActive('strike'),
          underline: editor.isActive('underline'),
          heading1: editor.isActive('heading', { level: 1 }),
          heading2: editor.isActive('heading', { level: 2 }),
          heading3: editor.isActive('heading', { level: 3 }),
          bulletList: editor.isActive('bulletList'),
          orderedList: editor.isActive('orderedList'),
          blockquote: editor.isActive('blockquote'),
          code: editor.isActive('codeBlock'),
        });
      }, 10);
    } catch (error) {
      console.error('执行编辑器命令时出错:', error);
    }
  };
  
  // 每当编辑器选择变化时更新工具栏状态
  useEffect(() => {
    const editor = editorRef.current?.getEditor();
    if (!editor || !isEditorReady) return;
    
    const updateToolbarState = () => {
      setToolbarState({
        bold: editor.isActive('bold'),
        italic: editor.isActive('italic'),
        strike: editor.isActive('strike'),
        underline: editor.isActive('underline'),
        heading1: editor.isActive('heading', { level: 1 }),
        heading2: editor.isActive('heading', { level: 2 }),
        heading3: editor.isActive('heading', { level: 3 }),
        bulletList: editor.isActive('bulletList'),
        orderedList: editor.isActive('orderedList'),
        blockquote: editor.isActive('blockquote'),
        code: editor.isActive('codeBlock'),
      });
    };

    editor.on('selectionUpdate', updateToolbarState);
    editor.on('focus', updateToolbarState);
    
    return () => {
      editor.off('selectionUpdate', updateToolbarState);
      editor.off('focus', updateToolbarState);
    };
  }, [isEditorReady]);

  // 渲染工具栏按钮
  const renderToolbarButton = (name: string, icon: React.ReactNode, isActive: boolean = false) => {
    return (
      <button
        type="button"
        className={`${styles.toolbarButton} ${isActive ? styles.active : ''}`}
        onClick={() => handleToolbarButtonClick(name)}
        title={name}
      >
        {icon}
      </button>
    );
  };

  return (
    <div className={styles.container}>
      {/* 顶部导航栏 */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.logo}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.logoIcon}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            <span>协同文档</span>
          </Link>
          
          {isEditorReady ? (
            <div className={styles.headerActions}>
              {/* 活跃用户头像区域 */}
              <div className={styles.activeUsers}>
                {activeUsers.length > 0 && (
                  <div className={styles.userAvatars}>
                    {activeUsers.slice(0, 3).map((user, index) => (
                      <div key={index} className={styles.userAvatar} style={{ backgroundColor: user.color }}>
                        {user.name[0]}
                      </div>
                    ))}
                    {activeUsers.length > 3 && (
                      <div className={styles.userAvatar} style={{ backgroundColor: 'var(--bg-color-light)' }}>
                        +{activeUsers.length - 3}
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* 复制文档ID按钮 */}
              <button 
                className={styles.headerButton} 
                onClick={handleCopyDocId}
                aria-label="复制文档ID"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                <span>{isCopied ? '已复制ID' : '复制文档ID'}</span>
              </button>
              
              {/* 返回首页按钮 */}
              <Link href="/" className={styles.headerButton}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                <span>返回首页</span>
              </Link>
            </div>
          ) : (
            <nav className={styles.nav}>
              <Link href="/editor" className={styles.navLink}>协同文档</Link>
              <Link href="/spreadsheet" className={styles.navLink}>协同表格</Link>
              <Link href="/mindmap" className={styles.navLink}>协同脑图</Link>
              <a href="https://github.com/yourusername/CollaborativeDoc" target="_blank" rel="noopener noreferrer" className={styles.githubLink}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
                <span>GitHub</span>
              </a>
            </nav>
          )}
        </div>
      </header>
      
      <main className={styles.main}>
        {isEditorReady ? (
          <div className={styles.editorContainer}>
            {/* 编辑器标题区域 */}
            <div className={styles.editorHeader}>
              <div className={styles.documentMeta}>
                <input 
                  type="text" 
                  value={documentTitle} 
                  onChange={handleTitleChange}
                  placeholder="无标题文档"
                  className={styles.documentTitle}
                  aria-label="文档标题"
                />
                <div className={styles.documentInfo}>
                  <span className={styles.docIdLabel}>文档ID: </span>
                  <span className={styles.docId}>{documentId}</span>
                </div>
              </div>
            </div>
            
            {/* 工具栏区域 */}
            <div className={styles.toolbar}>
              <div className={styles.toolbarGroup}>
                {renderToolbarButton('bold', 
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
                    <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
                  </svg>, 
                  toolbarState.bold)}
                {renderToolbarButton('italic', 
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="4" x2="10" y2="4"></line>
                    <line x1="14" y1="20" x2="5" y2="20"></line>
                    <line x1="15" y1="4" x2="9" y2="20"></line>
                  </svg>, 
                  toolbarState.italic)}
                {renderToolbarButton('underline', 
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"></path>
                    <line x1="4" y1="21" x2="20" y2="21"></line>
                  </svg>, 
                  toolbarState.underline)}
                {renderToolbarButton('strike', 
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <path d="M16 6C16 6 16 6 16 6c-1.1 0-2-.9-2-2 0 0 0 0 0 0h-4c0 0 0 0 0 0 0 1.1-.9 2-2 2 0 0 0 0 0 0"></path>
                    <path d="M8 18c0 0 0 0 0 0 1.1 0 2 .9 2 2 0 0 0 0 0 0h4c0 0 0 0 0 0 0-1.1.9-2 2-2 0 0 0 0 0 0"></path>
                  </svg>, 
                  toolbarState.strike)}
              </div>

              <div className={styles.toolbarSeparator} />
              
              <div className={styles.toolbarGroup}>
                {renderToolbarButton('heading1', 
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12h16"></path>
                    <path d="M4 18V6"></path>
                    <path d="M12 18V6"></path>
                    <path d="M11 12h12"></path>
                  </svg>, 
                  toolbarState.heading1)}
                {renderToolbarButton('heading2', 
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12h16"></path>
                    <path d="M4 18V6"></path>
                    <path d="M12 18V6"></path>
                    <path d="M11 12h4"></path>
                  </svg>, 
                  toolbarState.heading2)}
                {renderToolbarButton('heading3', 
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12h16"></path>
                    <path d="M4 18V6"></path>
                    <path d="M12 18V6"></path>
                    <path d="M11 12h2"></path>
                  </svg>, 
                  toolbarState.heading3)}
              </div>

              <div className={styles.toolbarSeparator} />
              
              <div className={styles.toolbarGroup}>
                {renderToolbarButton('bulletList', 
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="9" y1="6" x2="20" y2="6"></line>
                    <line x1="9" y1="12" x2="20" y2="12"></line>
                    <line x1="9" y1="18" x2="20" y2="18"></line>
                    <circle cx="4" cy="6" r="2"></circle>
                    <circle cx="4" cy="12" r="2"></circle>
                    <circle cx="4" cy="18" r="2"></circle>
                  </svg>, 
                  toolbarState.bulletList)}
                {renderToolbarButton('orderedList', 
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="10" y1="6" x2="21" y2="6"></line>
                    <line x1="10" y1="12" x2="21" y2="12"></line>
                    <line x1="10" y1="18" x2="21" y2="18"></line>
                    <path d="M4 6h1v4"></path>
                    <path d="M4 10h2"></path>
                    <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path>
                  </svg>, 
                  toolbarState.orderedList)}
                {renderToolbarButton('blockquote', 
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
                    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
                  </svg>, 
                  toolbarState.blockquote)}
              </div>

              <div className={styles.toolbarSeparator} />
              
              <div className={styles.toolbarGroup}>
                {renderToolbarButton('code', 
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6"></polyline>
                    <polyline points="8 6 2 12 8 18"></polyline>
                  </svg>, 
                  toolbarState.code)}
              </div>
            </div>
            
            {/* 编辑器内容区域 */}
            <div className={styles.editorContent}>
              {/* 确保传递稳定的回调函数给编辑器组件 */}
              <CustomCollaborativeEditor 
                documentId={documentId} 
                username={username} 
                ref={editorRef} 
                onActiveUsersChange={handleActiveUsersChange}
              />
            </div>
          </div>
        ) : (
          <div className={styles.welcome}>
            <div className={styles.welcomeContent}>
              <div className={styles.welcomeHeader}>
                <h1>协同文档</h1>
                <p>实时多人协作，高效内容创作</p>
                
                <div className={styles.features}>
                  <span className={styles.feature}>无缝协作</span>
                  <span className={styles.featureDot}>•</span>
                  <span className={styles.feature}>实时同步</span>
                  <span className={styles.featureDot}>•</span>
                  <span className={styles.feature}>数据安全</span>
                </div>
              </div>
              
              <div className={styles.welcomeBody}>
                <div className={styles.formSection}>
                  <div className={styles.formCard}>
                    <h2>开始使用</h2>
                    
                    <div className={styles.formField}>
                      <label htmlFor="username">您的用户名</label>
                      <div className={styles.inputWrapper}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <input
                          type="text"
                          id="username"
                          value={username}
                          onChange={handleUsernameChange}
                          placeholder="请输入您的用户名"
                          autoComplete="off"
                        />
                      </div>
                    </div>
                    
                    <div className={styles.formField}>
                      <label htmlFor="documentId">文档ID</label>
                      <div className={styles.inputWrapper}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                          <line x1="16" y1="13" x2="8" y2="13"></line>
                          <line x1="16" y1="17" x2="8" y2="17"></line>
                          <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                        <input
                          type="text"
                          id="documentId"
                          value={documentId}
                          onChange={handleDocumentIdChange}
                          placeholder="输入现有文档ID或创建新文档"
                          autoComplete="off"
                        />
                      </div>
                    </div>
                    
                    <div className={styles.formActions}>
                      <Button
                        className={styles.createButton}
                        onClick={handleCreateDocument}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                          <line x1="12" y1="18" x2="12" y2="12"></line>
                          <line x1="9" y1="15" x2="15" y2="15"></line>
                        </svg>
                        创建新文档
                      </Button>
                      <Button
                        className={styles.joinButton}
                        onClick={handleJoinDocument}
                        disabled={!documentId.trim()}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                          <polyline points="10 17 15 12 10 7"></polyline>
                          <line x1="15" y1="12" x2="3" y2="12"></line>
                        </svg>
                        加入文档
                      </Button>
                    </div>
                  </div>
                  
                  <div className={styles.mockupWrapper}>
                    <div className={styles.mockupEditor}>
                      <div className={styles.mockupHeader}>
                        <div className={styles.mockupControls}>
                          <div className={styles.mockupDot}></div>
                          <div className={styles.mockupDot}></div>
                          <div className={styles.mockupDot}></div>
                        </div>
                        <div className={styles.mockupTitle}>协同文档 - 实时协作中</div>
                      </div>
                      <div className={styles.mockupToolbar}>
                        <div className={styles.mockupToolbarItems}>
                          <div className={styles.mockupToolbarItem}><strong>B</strong></div>
                          <div className={styles.mockupToolbarItem}><em>I</em></div>
                          <div className={styles.mockupToolbarItem}><u>U</u></div>
                          <div className={styles.mockupToolbarDivider}></div>
                          <div className={styles.mockupToolbarItem}>H1</div>
                          <div className={styles.mockupToolbarItem}>⋮</div>
                        </div>
                      </div>
                      <div className={styles.mockupContent}>
                        <div className={styles.mockupParagraph}><strong className={styles.mockupHeading}>项目协作文档</strong></div>
                        <div className={styles.mockupParagraph}>这是一个<span className={styles.mockupHighlight}>实时协作</span>的文档，团队成员可以同时编辑。</div>
                        <div className={styles.mockupParagraph}>
                          <div>• 实时查看协作者更改</div>
                          <div>• 支持富文本格式</div>
                          <div>• 自动保存至云端</div>
                        </div>
                      </div>
                      <div className={styles.mockupCursors}>
                        <div className={styles.mockupCursor} style={{ left: '40%', top: '60%' }}>
                          <div className={styles.mockupCursorFlag} style={{ backgroundColor: '#FF6B6B' }}>
                            用户1
                          </div>
                        </div>
                        <div className={styles.mockupCursor} style={{ left: '70%', top: '75%' }}>
                          <div className={styles.mockupCursorFlag} style={{ backgroundColor: '#4ECDC4' }}>
                            用户2
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className={styles.featureCards}>
                  <div className={styles.featureCard}>
                    <div className={styles.featureIcon}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                    </div>
                    <h3>多人协作</h3>
                    <p>多位用户可同时编辑同一文档，查看彼此的光标位置和即时更改</p>
                  </div>
                  
                  <div className={styles.featureCard}>
                    <div className={styles.featureIcon}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                    </div>
                    <h3>实时同步</h3>
                    <p>所有更改实时同步到所有参与者的设备，无需手动保存或刷新</p>
                  </div>
                  
                  <div className={styles.featureCard}>
                    <div className={styles.featureIcon}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                    </div>
                    <h3>安全可靠</h3>
                    <p>基于CRDT技术构建，确保数据一致性和冲突解决，支持离线编辑</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerInfo}>
            <div className={styles.footerLogo}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.footerLogoIcon}>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              <span>协同文档</span>
            </div>
            <p>高效协作，创造无限可能</p>
          </div>
          
          <div className={styles.footerLinks}>
            <div className={styles.footerLinkGroup}>
              <h4>产品</h4>
              <Link href="/editor">协同文档</Link>
              <Link href="/spreadsheet">协同表格</Link>
              <Link href="/mindmap">协同脑图</Link>
            </div>
            
            <div className={styles.footerLinkGroup}>
              <h4>资源</h4>
              <a href="https://github.com/yourusername/CollaborativeDoc" target="_blank" rel="noopener noreferrer">GitHub</a>
              <a href="https://tiptap.dev/" target="_blank" rel="noopener noreferrer">TipTap</a>
              <a href="https://docs.yjs.dev/" target="_blank" rel="noopener noreferrer">Yjs 文档</a>
            </div>
            
            <div className={styles.footerLinkGroup}>
              <h4>公司</h4>
              <Link href="/about">关于我们</Link>
              <Link href="/privacy">隐私政策</Link>
              <Link href="/terms">使用条款</Link>
            </div>
          </div>
        </div>
        
        <div className={styles.footerBottom}>
          <p>&copy; {new Date().getFullYear()} 协同文档. 保留所有权利.</p>
        </div>
      </footer>
    </div>
  );
} 