/*
 * @Author: jihao00122 52628008+jihao00122@users.noreply.github.com
 * @Date: 2025-06-24 21:39:28
 * @LastEditors: jihao00122 52628008+jihao00122@users.noreply.github.com
 * @LastEditTime: 2025-06-24 22:04:19
 * @FilePath: /CollaborativeDoc/apps/api/src/index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import http from 'http';
import express from 'express';
import cors from 'cors';
import { Server } from 'ws';
// @ts-ignore
import { setupWSConnection } from 'y-websocket/bin/utils';

const app = express();
const PORT = process.env.PORT || 1234;

// 允许跨域请求
app.use(cors());

// 添加健康检查端点
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// 创建HTTP服务器
const server = http.createServer(app);

// 创建WebSocket服务器
const wss = new Server({ server });

wss.on('connection', (ws, req) => {
  setupWSConnection(ws, req, { docName: req.url?.slice(1) });
  console.log(`新连接: ${req.url}`);
});

// 启动服务器
server.listen(PORT, () => {
  console.log(`协同编辑服务器运行在 http://localhost:${PORT}`);
}); 