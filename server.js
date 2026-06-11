// CalmOS 本地开发服务器
// 用法: node server.js   →  打开 http://localhost:3456
// 自动读取 .env.local，无需 vercel cli

const http = require('http');
const fs = require('fs');
const path = require('path');

// 读取 .env.local
function loadEnv(file) {
  if (!fs.existsSync(file)) return;
  fs.readFileSync(file, 'utf8').split('\n').forEach(line => {
    line = line.trim();
    if (!line || line.startsWith('#')) return;
    const idx = line.indexOf('=');
    if (idx === -1) return;
    const key = line.slice(0, idx).trim();
    const val = line.slice(idx + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  });
}
loadEnv(path.join(__dirname, '.env.local'));

const PORT = parseInt(process.env.PORT || '3456', 10);
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  // Health check — no auth needed
  if (url.pathname === '/api/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    return res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
  }

  // API route
  if (url.pathname === '/api/analyze' && req.method === 'POST') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', async () => {
      try {
        const { userMessage } = JSON.parse(body);
        if (!userMessage) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: '缺少 userMessage' }));
        }

        const apiKey = process.env.DEEPSEEK_API_KEY;
        if (!apiKey) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: '未配置 DEEPSEEK_API_KEY，请检查 .env.local' }));
        }

        const model = process.env.DEEPSEEK_MODEL || 'deepseek-chat';

        // Use the same prompt from api/analyze.js
        const apiCode = fs.readFileSync(path.join(__dirname, 'api/analyze.js'), 'utf8');
        // Extract SYSTEM_PROMPT from api/analyze.js
        const promptMatch = apiCode.match(/const SYSTEM_PROMPT = `([\s\S]*?)`;/);
        const systemPrompt = promptMatch ? promptMatch[1] : '你是一位温暖的中文心理咨询师。请根据用户问卷答案生成JSON分析。';

        console.log('→ Calling DeepSeek API...');
        const resp = await fetch('https://api.deepseek.com/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userMessage },
            ],
            temperature: 0.7,
            max_tokens: 2048,
            response_format: { type: 'json_object' },
          }),
        });

        if (!resp.ok) {
          const err = await resp.text();
          console.error('DeepSeek error:', resp.status, err);
          res.writeHead(502, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: `AI 服务返回错误 (${resp.status})` }));
        }

        const data = await resp.json();
        const content = data.choices?.[0]?.message?.content;
        const result = JSON.parse(content);
        console.log('✓ API 返回成功:', result.primary_cause);
        res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        res.end(JSON.stringify(result));
      } catch (e) {
        console.error('Error:', e.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // CORS for API
  if (url.pathname === '/api/analyze' && req.method === 'OPTIONS') {
    res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' });
    return res.end();
  }

  // Static files
  let filePath = url.pathname === '/' ? '/index.html' : url.pathname;
  filePath = path.join(__dirname, filePath);

  if (!fs.existsSync(filePath)) {
    // Fallback: serve index.html for all routes (SPA)
    filePath = path.join(__dirname, 'index.html');
  }

  const ext = path.extname(filePath);
  res.writeHead(200, { 'Content-Type': MIME[ext] || 'text/plain' });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, () => {
  console.log('');
  console.log('  ✨  CalmOS 本地开发服务器');
  console.log(`  →  http://localhost:${PORT}`);
  console.log('');
  console.log('  API Key:', process.env.DEEPSEEK_API_KEY ? '✓ 已配置 (' + process.env.DEEPSEEK_API_KEY.slice(0, 8) + '...)' : '✗ 未配置');
  console.log('  按 Ctrl+C 停止');
  console.log('');
});
