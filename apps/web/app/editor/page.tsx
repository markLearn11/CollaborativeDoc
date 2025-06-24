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
    <main className={styles.container}>
      <h1 className={styles.title}>协同编辑文档</h1>
      
      {!isEditorReady ? (
        <div className={styles.setup}>
          <div className={styles.formGroup}>
            <label htmlFor="username">用户名:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={handleUsernameChange}
              className={styles.input}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="documentId">文档ID:</label>
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
            <Button onClick={handleJoinDocument} disabled={!documentId.trim()} appName="协同编辑">
              加入文档
            </Button>
            <Button onClick={handleCreateDocument} appName="协同编辑">
              创建新文档
            </Button>
          </div>
        </div>
      ) : (
        <div className={styles.editorContainer}>
          <CollaborativeEditor
            documentId={documentId}
            username={username}
          />
          <div className={styles.info}>
            <p>当前文档ID: <strong>{documentId}</strong></p>
            <p>分享此ID给其他用户以进行协作</p>
            <Button onClick={() => setIsEditorReady(false)} appName="协同编辑">
              返回
            </Button>
          </div>
        </div>
      )}
    </main>
  );
} 