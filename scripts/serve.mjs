import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.resolve(fileURLToPath(new URL('../dist/',import.meta.url)));
const port=Number(process.env.PORT || 4173);
const types={'.html':'text/html;charset=utf-8','.js':'text/javascript;charset=utf-8','.css':'text/css;charset=utf-8','.json':'application/json;charset=utf-8','.svg':'image/svg+xml','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp','.woff2':'font/woff2','.md':'text/plain;charset=utf-8'};
const server=http.createServer(async(req,res)=>{
  try {
    let pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    // 测试 GitHub 项目子路径时，可用 PREFIX=/project/ 启动。
    const prefix=process.env.PREFIX;
    if(prefix){if(!pathname.startsWith(prefix)){res.writeHead(404);res.end('Not found');return;}pathname=pathname.slice(prefix.length-1);}
    let filename=path.resolve(root,'.'+pathname);
    if(filename!==root&&!filename.startsWith(root+path.sep)){res.writeHead(403);res.end('Forbidden');return;}
    if((await stat(filename)).isDirectory())filename=path.join(filename,'index.html');
    const body=await readFile(filename);
    res.writeHead(200,{'Content-Type':types[path.extname(filename)]||'application/octet-stream','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});
    res.end(req.method==='HEAD'?undefined:body);
  } catch { res.writeHead(404,{'Content-Type':'text/plain;charset=utf-8'});res.end('文件不存在。请先运行 npm run build。'); }
});
server.on('error',error=>{console.error(error.message);process.exit(1);});
server.listen(port,'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:${port}${process.env.PREFIX||'/'}`));
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.close(()=>process.exit(0)));
