import { cp, mkdir, rm, writeFile, readFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = path.join(root, 'dist');
const vendor = path.join(root, 'vendor/wanli-trail');
const result = spawnSync(process.execPath, [path.join(vendor, 'node_modules/vite/bin/vite.js'), 'build'], {cwd:vendor, stdio:'inherit'});
if(result.status !== 0) {
  console.error('长征沙盘构建失败。请使用 Node.js 22+，并先在项目目录执行 npm ci。');
  process.exit(result.status || 1);
}
await rm(dist, {recursive:true, force:true});
await mkdir(dist, {recursive:true});
for(const file of ['index.html','css','js','assets']) await cp(path.join(root,file),path.join(dist,file),{recursive:true});
await cp(path.join(vendor,'dist'),path.join(dist,'trail'),{recursive:true});
const routes={};
for(const [key,file] of Object.entries({first:'red-first',second:'red-second',fourth:'red-fourth',n25:'red-25th'})) {
  routes[key]=(await import(pathToFileURL(path.join(vendor,`src/mock/routes/${file}.js`)).href)).default;
}
await writeFile(path.join(dist,'js/routes.json'),JSON.stringify(routes));
await writeFile(path.join(dist,'.nojekyll'),'');
await cp(path.join(root,'THIRD_PARTY.md'),path.join(dist,'THIRD_PARTY.md'));
const qd=JSON.parse(await readFile(path.join(dist,'js/qingdao.json'),'utf8'));
const text=await readFile(path.join(dist,'js/config.js'),'utf8');
if(!text.includes('学硕第三党支部') || /专硕.{0,2}(第二|2)/.test(text))throw Error('支部名称校验失败');
console.log(`\n门户已构建：dist/（${qd.length} 位青岛人物、${Object.keys(routes).length} 路红军沙盘）`);
console.log('本地预览：npm run dev');
