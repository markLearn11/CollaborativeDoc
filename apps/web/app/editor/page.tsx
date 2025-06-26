"use client";

import React, { useState, useEffect, useRef, forwardRef, useCallback } from 'react';
import { CollaborativeEditor } from '@repo/editor';
import { Button } from '@repo/ui';
import Link from 'next/link';
import styles from './page.module.css';

// 定义编辑器类型接口
interface EditorInterface {
  chain: () => { focus: () => any };
  isActive: (name: string, attrs?: Record<string, any>) => boolean;
  on: (event: string, handler: () => void) => void;
  off: (event: string, handler: () => void) => void;
}

// 定义协作编辑器的引用类型
interface CollaborativeEditorRef {
  getEditor: () => EditorInterface;
}

// 定义协作编辑器的属性类型
interface CollaborativeEditorProps {
  documentId: string;
  username: string;
  userColor?: string;
  websocketUrl?: string;
  onActiveUsersChange?: (users: Array<{name: string, color: string}>) => void;
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
    const { documentId, username, onActiveUsersChange } = props;
    
    // 确保documentId有效 - 使用固定的格式
    const validDocId = documentId.trim() ? documentId : `doc_${Date.now()}`;
    
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
    
    // 用类型断言解决TypeScript类型检查问题
    const EditorComponent = CollaborativeEditor as React.ForwardRefExoticComponent<
      {
        documentId: string;
        username: string;
        onActiveUsersChange?: (users: Array<{name: string, color: string}>) => void;
      } & React.RefAttributes<CollaborativeEditorRef>
    >;
    
    return (
      <div className="collaborative-editor-wrapper" style={{width: '100%', height: '100%'}}>
        <EditorComponent
          ref={ref}
          documentId={validDocId}
          username={username}
          onActiveUsersChange={stableOnActiveUsersChange}
        />
      </div>
    );
  }
);

CustomCollaborativeEditor.displayName = 'CustomCollaborativeEditor';

// 当评论列表为空时显示的组件
const EmptyComments = () => (
  <div className={styles.emptyComments}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
    <p>暂无评论</p>
    <span>添加第一条评论来开始讨论</span>
  </div>
);

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
  
  // 新增状态
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [commentSidebarOpen, setCommentSidebarOpen] = useState(false);
  const [outline, setOutline] = useState<Array<{id: string, level: number, text: string}>>([]);
  const [comments, setComments] = useState<Array<{id: string, author: string, content: string, timestamp: Date}>>([]);
  const [newComment, setNewComment] = useState('');
  const [viewMode, setViewMode] = useState<'edit' | 'read' | 'present'>('edit');
  
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
      const chain = (editor.chain().focus() as any);
      
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
        // 新增功能
        case 'alignLeft':
          chain.setTextAlign('left').run();
          break;
        case 'alignCenter':
          chain.setTextAlign('center').run();
          break;
        case 'alignRight':
          chain.setTextAlign('right').run();
          break;
        case 'indent':
          chain.indent().run();
          break;
        case 'outdent':
          chain.outdent().run();
          break;
        case 'table':
          chain.insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
          break;
        case 'textColor':
          // 简单实现，实际应该弹出颜色选择器
          chain.setColor('#7aa2f7').run();
          break;
        default:
          break;
      }
      
      // 更新工具栏状态以反映当前文本格式
      setTimeout(() => {
        setToolbarState({
          bold: (editor as any).isActive('bold'),
          italic: (editor as any).isActive('italic'),
          strike: (editor as any).isActive('strike'),
          underline: (editor as any).isActive('underline'),
          heading1: (editor as any).isActive('heading', { level: 1 }),
          heading2: (editor as any).isActive('heading', { level: 2 }),
          heading3: (editor as any).isActive('heading', { level: 3 }),
          bulletList: (editor as any).isActive('bulletList'),
          orderedList: (editor as any).isActive('orderedList'),
          blockquote: (editor as any).isActive('blockquote'),
          code: (editor as any).isActive('codeBlock'),
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
        bold: (editor as any).isActive('bold'),
        italic: (editor as any).isActive('italic'),
        strike: (editor as any).isActive('strike'),
        underline: (editor as any).isActive('underline'),
        heading1: (editor as any).isActive('heading', { level: 1 }),
        heading2: (editor as any).isActive('heading', { level: 2 }),
        heading3: (editor as any).isActive('heading', { level: 3 }),
        bulletList: (editor as any).isActive('bulletList'),
        orderedList: (editor as any).isActive('orderedList'),
        blockquote: (editor as any).isActive('blockquote'),
        code: (editor as any).isActive('codeBlock'),
      });
    };

    (editor as any).on('selectionUpdate', updateToolbarState);
    (editor as any).on('focus', updateToolbarState);
    
    return () => {
      (editor as any).off('selectionUpdate', updateToolbarState);
      (editor as any).off('focus', updateToolbarState);
    };
  }, [isEditorReady]);

  // 处理大纲点击
  const handleOutlineClick = (id: string) => {
    const editor = editorRef.current?.getEditor();
    if (editor) {
      // 实现逻辑：滚动到对应的标题位置
      console.log(`Scroll to heading with id: ${id}`);
    }
  };

  // 处理添加评论
  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: `comment_${Date.now()}`,
        author: username,
        content: newComment,
        timestamp: new Date()
      };
      setComments([...comments, comment]);
      setNewComment('');
      setCommentSidebarOpen(true);
    }
  };

  // 处理视图模式切换
  const handleViewModeChange = (mode: 'edit' | 'read' | 'present') => {
    setViewMode(mode);
  };

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
          <div className={styles.headerLeft}>
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

            {isEditorReady && (
              <input 
                type="text" 
                value={documentTitle} 
                onChange={handleTitleChange}
                placeholder="无标题文档"
                className={styles.documentTitleHeader}
                aria-label="文档标题"
              />
            )}
          </div>
          
          {isEditorReady ? (
            <div className={styles.headerActions}>
              {/* 视图模式切换 */}
              <div className={styles.viewModeToggle}>
                <button 
                  className={`${styles.viewModeButton} ${viewMode === 'edit' ? styles.active : ''}`}
                  onClick={() => handleViewModeChange('edit')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                  </svg>
                  <span>编辑</span>
                </button>
                <button 
                  className={`${styles.viewModeButton} ${viewMode === 'read' ? styles.active : ''}`}
                  onClick={() => handleViewModeChange('read')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  <span>阅读</span>
                </button>
                <button 
                  className={`${styles.viewModeButton} ${viewMode === 'present' ? styles.active : ''}`}
                  onClick={() => handleViewModeChange('present')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                    <line x1="8" y1="21" x2="16" y2="21"></line>
                    <line x1="12" y1="17" x2="12" y2="21"></line>
                  </svg>
                  <span>演示</span>
                </button>
              </div>

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
                      <div className={styles.userAvatar} style={{ backgroundColor: 'var(--bg-hover)' }}>
                        +{activeUsers.length - 3}
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* 分享按钮 */}
              <button 
                className={`${styles.headerButton} ${styles.shareButton}`} 
                onClick={handleCopyDocId}
                title={isCopied ? '已复制链接' : '分享文档'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3"></circle>
                  <circle cx="6" cy="12" r="3"></circle>
                  <circle cx="18" cy="19" r="3"></circle>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                </svg>
                <span>{isCopied ? '已复制链接' : '分享'}</span>
              </button>
              
              {/* 评论按钮 */}
              <button 
                className={`${styles.headerButton} ${commentSidebarOpen ? styles.active : ''}`} 
                onClick={() => setCommentSidebarOpen(!commentSidebarOpen)}
                title="评论"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <span>评论</span>
              </button>
              
              {/* 更多选项 */}
              <button className={styles.headerButton} title="更多选项">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="1"></circle>
                  <circle cx="19" cy="12" r="1"></circle>
                  <circle cx="5" cy="12" r="1"></circle>
                </svg>
              </button>
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
          <div className={styles.editorLayout}>
            {/* 左侧边栏 - 目录导航 */}
            <div className={`${styles.sidebar} ${sidebarOpen ? styles.open : styles.closed}`}>
              <div className={styles.sidebarHeader}>
                <h3>目录大纲</h3>
                <button 
                  className={styles.sidebarToggle}
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  aria-label={sidebarOpen ? "关闭侧边栏" : "打开侧边栏"}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {sidebarOpen ? (
                      <polyline points="15 18 9 12 15 6"></polyline>
                    ) : (
                      <polyline points="9 18 15 12 9 6"></polyline>
                    )}
                  </svg>
                </button>
              </div>
              
              <div className={styles.outlineList}>
                {outline.length > 0 ? (
                  <ul className={styles.outline}>
                    {outline.map((item) => (
                      <li 
                        key={item.id} 
                        className={styles.outlineItem}
                        style={{ paddingLeft: `${(item.level - 1) * 16}px` }}
                        onClick={() => handleOutlineClick(item.id)}
                      >
                        <span className={styles.outlineIndicator}></span>
                        <span className={styles.outlineTitle}>{item.text}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className={styles.emptyOutline}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="32" height="32">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                    </svg>
                    <p>添加标题来创建目录</p>
                    <span className={styles.outlineHint}>使用「H1、H2、H3」按钮添加标题</span>
                  </div>
                )}
              </div>
              
              <div className={styles.sidebarActions}>
                <button className={styles.addSectionButton}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  <span>添加章节</span>
                </button>
              </div>
            </div>
            
            <div className={styles.editorContainer}>
              {/* 更新后的工具栏区域，更简洁现代 */}
              <div className={styles.toolbar}>
                {/* 文字格式控制 */}
                <div className={styles.toolbarGroup}>
                  <div className={styles.toolbarDropdown}>
                    <button className={styles.toolbarDropdownButton}>
                      <span>正文</span>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </button>
                  </div>
                </div>

                <div className={styles.toolbarSeparator} />

                <div className={styles.toolbarGroup}>
                  {renderToolbarButton('heading1', 
                    <span className={styles.headingButton}>H1</span>, 
                    toolbarState.heading1)}
                  {renderToolbarButton('heading2', 
                    <span className={styles.headingButton}>H2</span>, 
                    toolbarState.heading2)}
                  {renderToolbarButton('heading3', 
                    <span className={styles.headingButton}>H3</span>, 
                    toolbarState.heading3)}
                </div>
                
                <div className={styles.toolbarSeparator} />

                {/* 文字样式控制 */}
                <div className={styles.toolbarGroup}>
                  {renderToolbarButton('bold', 
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                      <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
                      <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
                    </svg>, 
                    toolbarState.bold)}
                  {renderToolbarButton('italic', 
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                      <line x1="19" y1="4" x2="10" y2="4"></line>
                      <line x1="14" y1="20" x2="5" y2="20"></line>
                      <line x1="15" y1="4" x2="9" y2="20"></line>
                    </svg>, 
                    toolbarState.italic)}
                  {renderToolbarButton('underline', 
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                      <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"></path>
                      <line x1="4" y1="21" x2="20" y2="21"></line>
                    </svg>, 
                    toolbarState.underline)}
                  {renderToolbarButton('strike', 
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <path d="M16 6c-.5-2-2.5-3-4.5-3S7 4 7 6"></path>
                      <path d="M8 18c.5 2 2.5 3 4.5 3s4-1 4.5-3"></path>
                    </svg>, 
                    toolbarState.strike)}
                </div>

                <div className={styles.toolbarSeparator} />

                {/* 列表和引用 */}
                <div className={styles.toolbarGroup}>
                  {renderToolbarButton('bulletList', 
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                      <line x1="9" y1="6" x2="20" y2="6"></line>
                      <line x1="9" y1="12" x2="20" y2="12"></line>
                      <line x1="9" y1="18" x2="20" y2="18"></line>
                      <circle cx="4" cy="6" r="2"></circle>
                      <circle cx="4" cy="12" r="2"></circle>
                      <circle cx="4" cy="18" r="2"></circle>
                    </svg>, 
                    toolbarState.bulletList)}
                  {renderToolbarButton('orderedList', 
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                      <line x1="10" y1="6" x2="21" y2="6"></line>
                      <line x1="10" y1="12" x2="21" y2="12"></line>
                      <line x1="10" y1="18" x2="21" y2="18"></line>
                      <path d="M4 6h1v4"></path>
                      <path d="M4 10h2"></path>
                      <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path>
                    </svg>, 
                    toolbarState.orderedList)}
                  {renderToolbarButton('blockquote', 
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
                      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
                    </svg>, 
                    toolbarState.blockquote)}
                </div>

                <div className={styles.toolbarSeparator} />

                {/* 对齐和缩进 */}
                <div className={styles.toolbarGroup}>
                  {renderToolbarButton('alignLeft', 
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                      <line x1="21" y1="6" x2="3" y2="6"></line>
                      <line x1="15" y1="12" x2="3" y2="12"></line>
                      <line x1="17" y1="18" x2="3" y2="18"></line>
                    </svg>)}
                  {renderToolbarButton('alignCenter', 
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                      <line x1="21" y1="6" x2="3" y2="6"></line>
                      <line x1="18" y1="12" x2="6" y2="12"></line>
                      <line x1="21" y1="18" x2="3" y2="18"></line>
                    </svg>)}
                  {renderToolbarButton('alignRight', 
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                      <line x1="21" y1="6" x2="3" y2="6"></line>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                      <line x1="21" y1="18" x2="7" y2="18"></line>
                    </svg>)}
                </div>

                <div className={styles.toolbarSeparator} />

                {/* 插入功能 */}
                <div className={styles.toolbarGroup}>
                  <button className={`${styles.toolbarButton} ${styles.insertButton}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                    <span>插入</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>
                </div>
                
                <div className={styles.toolbarSeparator} />

                {/* 评论功能 */}
                <div className={styles.toolbarGroup}>
                  <button 
                    className={`${styles.toolbarButton} ${styles.commentButton}`}
                    onClick={() => setCommentSidebarOpen(!commentSidebarOpen)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <span>评论</span>
                  </button>
                </div>
              </div>
              
              {/* 编辑器内容区域 */}
              <div className={`${styles.editorContent} ${viewMode === 'read' ? styles.readMode : ''} ${viewMode === 'present' ? styles.presentMode : ''}`}>
                <CustomCollaborativeEditor 
                  documentId={documentId} 
                  username={username} 
                  ref={editorRef} 
                  onActiveUsersChange={handleActiveUsersChange}
                />
              </div>
            </div>
            
            {/* 右侧评论区 */}
            <div className={`${styles.commentSidebar} ${commentSidebarOpen ? styles.open : styles.closed}`}>
              <div className={styles.commentSidebarHeader}>
                <h3>评论</h3>
                <button 
                  className={styles.commentSidebarClose}
                  onClick={() => setCommentSidebarOpen(false)}
                  aria-label="关闭评论区"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              
              <div className={styles.commentList}>
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment.id} className={styles.commentItem}>
                      <div className={styles.commentHeader}>
                        <div className={styles.commentAuthor}>
                          <div className={styles.commentAvatar}>
                            {comment.author && comment.author[0]?.toUpperCase()}
                          </div>
                          <span>{comment.author}</span>
                        </div>
                        <div className={styles.commentTime}>
                          {new Date(comment.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                      <div className={styles.commentContent}>
                        {comment.content}
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyComments />
                )}
              </div>
              
              <div className={styles.addCommentForm}>
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="添加评论..."
                  className={styles.addCommentInput}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                />
                <button 
                  className={styles.addCommentButton}
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  aria-label="发送评论"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </div>
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