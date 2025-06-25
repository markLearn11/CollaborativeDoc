import Link from "next/link";
import styles from "../page.module.css";

export default function SpreadsheetPage() {
  return (
    <div className={styles.pageContainer}>
      {/* 导航栏 */}
      <nav className={styles.navbar}>
        <div className={styles.navContent}>
          <div className={styles.navLogo}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path>
            </svg>
            <span>协同空间</span>
          </div>

          <div className={styles.navLinks}>
            <div className={styles.navDropdown}>
              <span>产品</span>
              <div className={styles.dropdownContent}>
                <Link href="/editor">协同文档</Link>
                <Link href="/spreadsheet">协同表格</Link>
                <Link href="/mindmap">协同脑图</Link>
              </div>
            </div>
            <Link href="/#features">特性</Link>
            <Link href="/#workflow">使用指南</Link>
            <Link href="https://github.com/yourusername/CollaborativeDoc" target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
              <span>GitHub</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* 内容区域 */}
      <main className={styles.comingSoonContainer}>
        <div className={styles.comingSoonContent}>
          <div className={styles.comingSoonIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="3" y1="9" x2="21" y2="9"></line>
              <line x1="3" y1="15" x2="21" y2="15"></line>
              <line x1="9" y1="3" x2="9" y2="21"></line>
              <line x1="15" y1="3" x2="15" y2="21"></line>
            </svg>
          </div>
          <h1>协同表格</h1>
          <p>我们正在开发更强大的协同表格功能，敬请期待！</p>
          <div className={styles.comingSoonFeatures}>
            <div className={styles.comingSoonFeature}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
              <span>公式计算</span>
            </div>
            <div className={styles.comingSoonFeature}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                <path d="M3 9h18"></path>
                <path d="M9 21V9"></path>
              </svg>
              <span>数据排序</span>
            </div>
            <div className={styles.comingSoonFeature}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8a6 6 0 0 0-9-4 6 6 0 0 0-3 10l9 9 9-9a6.002 6.002 0 0 0-6-6z"></path>
              </svg>
              <span>多人协作</span>
            </div>
          </div>
          <Link href="/" className={styles.primaryButton}>
            返回主页
          </Link>
        </div>
      </main>

      {/* 页脚 */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLogo}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path>
            </svg>
            <span>协同空间</span>
          </div>
          
          <div className={styles.footerLinks}>
            <div className={styles.footerLinkColumn}>
              <h4>产品</h4>
              <Link href="/editor">协同文档</Link>
              <Link href="/spreadsheet">协同表格</Link>
              <Link href="/mindmap">协同脑图</Link>
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
          <p>&copy; {new Date().getFullYear()} 协同空间. 保留所有权利.</p>
          <p>基于 Yjs 和 TipTap 构建</p>
        </div>
      </footer>
    </div>
  );
} 