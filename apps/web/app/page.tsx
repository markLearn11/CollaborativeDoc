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
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className={styles.logoIcon}
            >
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
              <polyline points="13 2 13 9 20 9"></polyline>
              <line x1="9" y1="16" x2="15" y2="16"></line>
              <line x1="9" y1="13" x2="15" y2="13"></line>
            </svg>
            <span>协同文档</span>
          </div>

          <div className={styles.navLinks}>
            <div className={styles.navDropdown}>
              <span>产品</span>
              <div className={styles.dropdownContent}>
                <Link href="/editor">
                  <div className={styles.dropdownItem}>
                    <div className={styles.dropdownItemIcon}>
                      <img src="/doc-icon.svg" alt="协同文档" width="24" height="24" />
                    </div>
                    <div className={styles.dropdownItemContent}>
                      <div className={styles.dropdownItemTitle}>协同文档</div>
                      <div className={styles.dropdownItemDesc}>实时多人协作文档编辑</div>
                    </div>
                  </div>
                </Link>
                <Link href="/spreadsheet">
                  <div className={styles.dropdownItem}>
                    <div className={styles.dropdownItemIcon}>
                      <img src="/table-icon.svg" alt="协同表格" width="24" height="24" />
                    </div>
                    <div className={styles.dropdownItemContent}>
                      <div className={styles.dropdownItemTitle}>协同表格</div>
                      <div className={styles.dropdownItemDesc}>在线数据表格与分析工具</div>
                    </div>
                  </div>
                </Link>
                <Link href="/mindmap">
                  <div className={styles.dropdownItem}>
                    <div className={styles.dropdownItemIcon}>
                      <img src="/mindmap-icon.svg" alt="协同脑图" width="24" height="24" />
                    </div>
                    <div className={styles.dropdownItemContent}>
                      <div className={styles.dropdownItemTitle}>协同脑图</div>
                      <div className={styles.dropdownItemDesc}>思维导图与创意展示</div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
            <Link href="#features">特性</Link>
            <Link href="#workflow">使用指南</Link>
            <a href="https://github.com/yourusername/CollaborativeDoc" target="_blank" rel="noopener noreferrer" className={styles.githubLink}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </nav>

      {/* 英雄区域 */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroTag}>
            <span>多人实时协作</span>
            <span className={styles.dot}></span>
            <span>云端存储</span>
            <span className={styles.dot}></span>
            <span>跨平台</span>
          </div>
          <h1>无缝协作的<br />全能在线工作空间</h1>
          <p>更高效的团队协作解决方案，支持文档、表格和思维导图，让创意与编辑变得更加简单高效</p>
          <div className={styles.heroButtons}>
            <Link href="/editor" className={styles.primaryButton}>
              立即开始
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
            <Link href="#products" className={styles.secondaryButton}>
              浏览产品
            </Link>
          </div>
          
          <div className={styles.heroStatsMobile}>
            <div className={styles.heroStat}>
              <div className={styles.heroStatNumber}>50万+</div>
              <div className={styles.heroStatLabel}>活跃用户</div>
            </div>
            <div className={styles.heroStat}>
              <div className={styles.heroStatNumber}>100+</div>
              <div className={styles.heroStatLabel}>企业客户</div>
            </div>
            <div className={styles.heroStat}>
              <div className={styles.heroStatNumber}>4.9/5</div>
              <div className={styles.heroStatLabel}>用户评分</div>
            </div>
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
                <div className={styles.mockupUsers}>
                  <div className={styles.mockupUser} style={{ backgroundColor: "#FF5733" }}>用户1</div>
                  <div className={styles.mockupUser} style={{ backgroundColor: "#33A1FF" }}>用户2</div>
                  <div className={styles.mockupUserMore}>+2</div>
                </div>
              </div>
              <div className={styles.mockupContent}>
                <div className={styles.mockupToolbar}>
                  <span className={styles.mockupToolbarItem}><b>B</b></span>
                  <span className={styles.mockupToolbarItem}><i>I</i></span>
                  <span className={styles.mockupToolbarItem}><u>U</u></span>
                  <span className={styles.mockupToolbarSeparator}></span>
                  <span className={styles.mockupToolbarItem}>H1</span>
                  <span className={styles.mockupToolbarItem}>H2</span>
                  <span className={styles.mockupToolbarItem}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="8" y1="6" x2="21" y2="6"></line>
                      <line x1="8" y1="12" x2="21" y2="12"></line>
                      <line x1="8" y1="18" x2="21" y2="18"></line>
                      <line x1="3" y1="6" x2="3.01" y2="6"></line>
                      <line x1="3" y1="12" x2="3.01" y2="12"></line>
                      <line x1="3" y1="18" x2="3.01" y2="18"></line>
                    </svg>
                  </span>
                </div>
                <div className={styles.mockupDocument}>
                  <div className={styles.mockupParagraph}><span className={styles.mockupHeading}>协作空间示例</span></div>
                  <div className={styles.mockupParagraph}>这是一个<span className={styles.mockupHighlight}>实时协作</span>的示例，多人可以同时编辑文档、表格和脑图。</div>
                  <div className={styles.mockupParagraph}>
                    <div className={styles.mockupList}>
                      <div>✓ 实时同步内容</div>
                      <div>✓ 显示用户光标位置</div>
                      <div>✓ 支持多种内容格式</div>
                      <div>✓ 历史版本回溯</div>
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
        
        <div className={styles.heroStatsDesktop}>
          <div className={styles.heroStat}>
            <div className={styles.heroStatNumber}>50万+</div>
            <div className={styles.heroStatLabel}>活跃用户</div>
          </div>
          <div className={styles.heroStatSeparator}></div>
          <div className={styles.heroStat}>
            <div className={styles.heroStatNumber}>100+</div>
            <div className={styles.heroStatLabel}>企业客户</div>
          </div>
          <div className={styles.heroStatSeparator}></div>
          <div className={styles.heroStat}>
            <div className={styles.heroStatNumber}>4.9/5</div>
            <div className={styles.heroStatLabel}>用户评分</div>
          </div>
        </div>
      </section>

      {/* 产品卡片区域 */}
      <section className={styles.productsSection} id="products">
        <h2>丰富的协作工具</h2>
        <p className={styles.sectionDesc}>为团队提供全方位的协作解决方案</p>
        
        <div className={styles.productCards}>
          <div className={styles.productCard}>
            <div className={styles.productIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <h3>协同文档</h3>
            <p>支持富文本编辑、实时协作的在线文档编辑器，轻松创建和分享内容，团队成员可以即时查看彼此的更改</p>
            <div className={styles.productFeatures}>
              <span>多人实时协作</span>
              <span>富文本编辑</span>
              <span>Markdown支持</span>
            </div>
            <Link href="/editor" className={styles.productButton}>
              开始使用
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </div>
          
          <div className={styles.productCard}>
            <div className={styles.productIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="3" y1="9" x2="21" y2="9"></line>
                <line x1="3" y1="15" x2="21" y2="15"></line>
                <line x1="9" y1="3" x2="9" y2="21"></line>
                <line x1="15" y1="3" x2="15" y2="21"></line>
              </svg>
            </div>
            <h3>协同表格</h3>
            <p>功能强大的在线电子表格，支持公式计算、数据分析和实时多人编辑，让数据处理变得更加高效和便捷</p>
            <div className={styles.productFeatures}>
              <span>格式化单元格</span>
              <span>公式支持</span>
              <span>数据可视化</span>
            </div>
            <Link href="/spreadsheet" className={styles.productButton}>
              开始使用
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </div>
          
          <div className={styles.productCard}>
            <div className={styles.productIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="6" r="3"></circle>
                <circle cx="18" cy="18" r="3"></circle>
                <line x1="8.7" y1="10.7" x2="15.3" y2="7.3"></line>
                <line x1="8.7" y1="13.3" x2="15.3" y2="16.7"></line>
              </svg>
            </div>
            <h3>协同脑图</h3>
            <p>可视化思维导图工具，帮助团队梳理想法、规划项目和进行头脑风暴，实时共享创意和构思</p>
            <div className={styles.productFeatures}>
              <span>节点自定义</span>
              <span>多人实时编辑</span>
              <span>多种布局选项</span>
            </div>
            <Link href="/mindmap" className={styles.productButton}>
              开始使用
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* 特性介绍 */}
      <section className={styles.features} id="features">
        <h2>核心特性</h2>
        <p className={styles.sectionDesc}>所有产品共享的强大功能</p>
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
            <p>支持多人同时编辑内容，实时查看他人更改</p>
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
                <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                <line x1="6" y1="6" x2="6.01" y2="6"></line>
                <line x1="6" y1="18" x2="6.01" y2="18"></line>
              </svg>
            </div>
            <h3>跨设备使用</h3>
            <p>在任何设备上无缝访问和编辑您的内容</p>
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
      <section className={styles.workflow} id="workflow">
        <h2>如何使用</h2>
        <p className={styles.sectionDesc}>简单三步，开始您的协作之旅</p>
        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <h3>选择工具</h3>
            <p>根据需求选择文档、表格或脑图工具</p>
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
            <p>复制唯一链接，邀请团队成员加入</p>
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
