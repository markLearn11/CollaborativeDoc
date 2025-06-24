"use client";

import React, { useState, useEffect } from 'react';
import { CollaborativeEditor } from '@repo/editor';
import { Button } from '@repo/ui';
import styles from './page.module.css';

export default function EditorPage() {
  const [username, setUsername] = useState('');
  const [documentId, setDocumentId] = useState('');
  const [isEditorReady, setIsEditorReady] = useState(false);
  
  // 在客户端生成随机用户名
  useEffect(() => {
    const randomName = '用户_' + Math.floor(Math.random() * 1000);
    setUsername(randomName);
  }, []);

  // 处理文档ID输入
  const handleDocumentIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocumentId(e.target.value);
  };

  // 处理加入文档
  const handleJoinDocument = () => {
    if (documentId.trim()) {
      setIsEditorReady(true);
    }
  };

  // 处理创建新文档
  const handleCreateDocument = () => {
    const newDocId = 'doc_' + Date.now();
    setDocumentId(newDocId);
    setIsEditorReady(true);
  };

  // 处理用户名输入
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path>
            </svg>
            <span>协同文档</span>
          </div>
          {isEditorReady && (
            <Button 
              onClick={() => setIsEditorReady(false)}
              appName="返回" 
              className={styles.headerButton}
            >
              返回主页
            </Button>
          )}
        </div>
      </header>
      
      <main className={styles.container}>
        {!isEditorReady ? (
          <div className={styles.welcome}>
            <h1 className={styles.title}>协同编辑文档</h1>
            <p className={styles.subtitle}>实时协作，畅享无界创作</p>
            
            <div className={styles.setup}>
              <div className={styles.formGroup}>
                <label htmlFor="username">用户名</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={handleUsernameChange}
                  className={styles.input}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="documentId">文档ID</label>
                <input
                  type="text"
                  id="documentId"
                  value={documentId}
                  onChange={handleDocumentIdChange}
                  className={styles.input}
                  placeholder="输入文档ID或创建新文档"
                />
              </div>
              
              <div className={styles.actions}>
                <Button 
                  onClick={handleJoinDocument} 
                  disabled={!documentId.trim()} 
                  appName="协同编辑"
                >
                  加入文档
                </Button>
                <Button 
                  onClick={handleCreateDocument} 
                  appName="协同编辑"
                >
                  创建新文档
                </Button>
              </div>
            </div>
            
            <div className={styles.features}>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <h3>多人协作</h3>
                <p>支持多人同时编辑，实时查看他人修改</p>
              </div>
              
              <div className={styles.feature}>
                <div className={styles.featureIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                </div>
                <h3>实时同步</h3>
                <p>基于CRDT技术，毫秒级同步，流畅协作</p>
              </div>
              
              <div className={styles.feature}>
                <div className={styles.featureIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 8v4l3 3"></path>
                  </svg>
                </div>
                <h3>自动保存</h3>
                <p>所有更改自动保存，不必担心数据丢失</p>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.editorContainer}>
            <CollaborativeEditor
              documentId={documentId}
              username={username}
            />
            <div className={styles.info}>
              <p>当前文档ID: <strong>{documentId}</strong> - 分享此ID给其他用户以进行协作</p>
            </div>
          </div>
        )}
      </main>
      
      <footer className={styles.footer}>
        <p>协同文档 © {new Date().getFullYear()} - 基于Yjs和TipTap构建</p>
      </footer>
    </>
  );
} 