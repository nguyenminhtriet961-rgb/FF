/* Máy chủ: phát file trong public/ và chuyển tiếp tin nhắn giữa 2 người cùng phòng. */
const http=require('http'),fs=require('fs'),path=require('path'),os=require('os'),{WebSocketServer}=require('ws');
const PORT=process.env.PORT||3000,PUB=path.join(__dirname,'public');
const MIME={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8'};

const srv=http.createServer((q,r)=>{
 let u;try{u=decodeURIComponent(q.url.split('?')[0])}catch{return r.writeHead(400).end()}
 if(u.endsWith('/'))u+='index.html';
 const f=path.join(PUB,u);
 if(!f.startsWith(PUB+path.sep))return r.writeHead(403).end();
 fs.readFile(f,(e,d)=>{
  if(e)return r.writeHead(404).end('Not found');
  r.writeHead(200,{'Content-Type':MIME[path.extname(f)]||'application/octet-stream'});r.end(d)})});

const rooms=new Map(),OK=new Set(['s','f','h','dead','go']);   // chỉ chuyển tiếp các loại tin này
const send=(w,o)=>w.readyState==1&&w.send(JSON.stringify(o));
const newCode=()=>{let c;do c=Array.from({length:4},()=>'ABCDEFGHJKLMNPQRSTUVWXYZ'[Math.random()*24|0]).join('');while(rooms.has(c));return c};
function leave(w){
 const c=w.room,r=rooms.get(c);w.room=null;if(!r)return;
 if(w==r[0]){rooms.delete(c);r.slice(1).forEach(x=>{x.room=null;send(x,{t:'left'})})}   // chủ phòng thoát: đóng phòng
 else if(r.includes(w)){r.splice(r.indexOf(w),1);send(r[0],{t:'peer',n:r.length})}}

const wss=new WebSocketServer({server:srv,maxPayload:1024});
wss.on('connection',w=>{
 w.on('message',raw=>{
  let m;try{m=JSON.parse(raw)}catch{return}
  if(m.t=='create'){leave(w);const c=newCode();rooms.set(c,[w]);w.room=c;send(w,{t:'room',code:c,slot:0})}
  else if(m.t=='join'){
   leave(w);const c=String(m.code||'').toUpperCase(),r=rooms.get(c);
   if(!r)return send(w,{t:'err',msg:'Không tìm thấy phòng '+c});
   if(r.length>1)return send(w,{t:'err',msg:'Phòng đã đủ 2 người'});
   r.push(w);w.room=c;send(w,{t:'room',code:c,slot:1});r.forEach(x=>send(x,{t:'peer',n:2}))}
  else if(w.room&&OK.has(m.t))rooms.get(w.room).forEach(x=>x!==w&&send(x,m))});
 w.on('close',()=>leave(w));w.on('error',()=>{})});
setInterval(()=>wss.clients.forEach(c=>c.ping()),25000);   // giữ kết nối khi chạy trên host miễn phí

srv.listen(PORT,()=>{
 console.log('Mở game:  http://localhost:'+PORT);
 Object.values(os.networkInterfaces()).flat().filter(i=>(i.family==4||i.family=='IPv4')&&!i.internal)
  .forEach(i=>console.log('Cùng Wi-Fi: http://'+i.address+':'+PORT))});
