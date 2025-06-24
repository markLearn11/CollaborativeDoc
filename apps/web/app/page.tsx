import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.pageContainer}>
      {/* 导航栏 */}
      <nav className={styles.navbar}>
        <div className={styles.navContent}>
          <div className={styles.navLogo}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path>
            </svg>
            <span>协同文档</span>
          </div>

          <div className={styles.navLinks}>
            <Link href="/editor">编辑器</Link>
            <Link href="https://github.com/yourusername/CollaborativeDoc" target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
              <span>GitHub</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* 英雄区域 */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>实时协作的<br />在线文档编辑平台</h1>
          <p>无需安装，即开即用，多人实时协作的文档编辑体验</p>
          <div className={styles.heroButtons}>
            <Link href="/editor" className={styles.primaryButton}>
              立即开始
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
            <Link href="#features" className={styles.secondaryButton}>
              了解更多
            </Link>
          </div>
        </div>
        <div className={styles.heroImage}>
          <div className={styles.imageContainer}>
            <div className={styles.editorMockup}>
              <div className={styles.mockupHeader}>
                <div className={styles.mockupDots}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div className={styles.mockupTitle}>协同文档 - 多人编辑中</div>
              </div>
              <div className={styles.mockupContent}>
                <div className={styles.mockupToolbar}>
                  <span className={styles.mockupToolbarItem}>B</span>
                  <span className={styles.mockupToolbarItem}>I</span>
                  <span className={styles.mockupToolbarItem}>U</span>
                  <span className={styles.mockupToolbarSeparator}></span>
                  <span className={styles.mockupToolbarItem}>H1</span>
                  <span className={styles.mockupToolbarItem}>H2</span>
                </div>
                <div className={styles.mockupDocument}>
                  <div className={styles.mockupParagraph}><span className={styles.mockupHeading}>协作文档示例</span></div>
                  <div className={styles.mockupParagraph}>这是一个<span className={styles.mockupHighlight}>实时协作</span>的示例文档，多人可以同时编辑。</div>
                  <div className={styles.mockupParagraph}>
                    <div className={styles.mockupList}>
                      <div>✓ 实时同步内容</div>
                      <div>✓ 显示用户光标位置</div>
                      <div>✓ 支持富文本格式</div>
                    </div>
                  </div>
                  <div className={styles.mockupCursor} style={{ left: '30%', top: '70%' }}>
                    <div className={styles.mockupCursorLabel} style={{ backgroundColor: "#FF5733" }}>用户1</div>
                  </div>
                  <div className={styles.mockupCursor} style={{ left: '60%', top: '45%' }}>
                    <div className={styles.mockupCursorLabel} style={{ backgroundColor: "#33A1FF" }}>用户2</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 特性介绍 */}
      <section className={styles.features} id="features">
        <h2>核心特性</h2>
        <div className={styles.featureCards}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h3>多人协作</h3>
            <p>支持多人同时编辑文档，所见即所得</p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <h3>实时同步</h3>
            <p>基于CRDT技术，毫秒级同步，流畅体验</p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12h6"></path>
                <path d="M9 16h6"></path>
                <path d="M9 8h6"></path>
                <rect x="3" y="4" width="18" height="16" rx="2"></rect>
              </svg>
            </div>
            <h3>富文本编辑</h3>
            <p>支持Markdown格式，提供所见即所得的编辑体验</p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <h3>安全可靠</h3>
            <p>使用WebSocket加密连接，保障数据传输安全</p>
          </div>
        </div>
      </section>

      {/* 使用流程 */}
      <section className={styles.workflow}>
        <h2>如何使用</h2>
        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <h3>创建文档</h3>
            <p>点击"立即开始"按钮，创建一个新的协作文档</p>
          </div>
          
          <div className={styles.stepArrow}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </div>
          
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <h3>分享链接</h3>
            <p>复制文档ID，分享给团队成员或朋友</p>
          </div>
          
          <div className={styles.stepArrow}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </div>
          
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <h3>开始协作</h3>
            <p>实时查看他人编辑，共同创作内容</p>
          </div>
        </div>
        
        <div className={styles.callToAction}>
          <Link href="/editor" className={styles.primaryButton}>
            立即体验
          </Link>
        </div>
      </section>

      {/* 页脚 */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLogo}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path>
            </svg>
            <span>协同文档</span>
          </div>
          
          <div className={styles.footerLinks}>
            <div className={styles.footerLinkColumn}>
              <h4>产品</h4>
              <Link href="/editor">编辑器</Link>
              <Link href="#features">特性</Link>
            </div>
            
            <div className={styles.footerLinkColumn}>
              <h4>资源</h4>
              <Link href="https://github.com/yourusername/CollaborativeDoc" target="_blank" rel="noopener noreferrer">
                GitHub
              </Link>
              <Link href="https://yjs.dev/" target="_blank" rel="noopener noreferrer">
                Yjs文档
              </Link>
            </div>
            
            <div className={styles.footerLinkColumn}>
              <h4>关于</h4>
              <Link href="/">隐私政策</Link>
              <Link href="/">联系我们</Link>
            </div>
          </div>
        </div>
        
        <div className={styles.footerBottom}>
          <p>&copy; {new Date().getFullYear()} 协同文档. 保留所有权利.</p>
          <p>基于 Yjs 和 TipTap 构建</p>
        </div>
      </footer>
    </div>
  );
}
