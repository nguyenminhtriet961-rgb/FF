/* Chơi mạng 1v1: kết nối WebSocket, đồng bộ vị trí, tính sát thương, hồi sinh, kết quả. */
const NET={on:0,ws:null,slot:0,code:'',n:1,ra:0,pm:0,tm:0,inv:0,mf:0,err:0},
 SP=[[0,18],[-20,5],[20,5],[0,-40],[-20,-55],[20,-55]],   // điểm xuất hiện
 rt={x:0,y:0,z:0,w:0,p:0,c:0,m:0};                        // trạng thái mới nhất của đối thủ
let rem=null,rAIM,rMz;const hb=[];
const send=o=>{if(NET.ws&&NET.ws.readyState==1)NET.ws.send(JSON.stringify(o))};
const ad=d=>((d+PI)%(PI*2)+PI*2)%(PI*2)-PI;

/* Đối thủ: nhân bản mô hình người chơi, đổi áo sang màu xanh, gắn 2 hộp va chạm vô hình (thân + đầu). */
function mkRemote(){
 rem=P.clone();const mb=M(0x2e86de);
 rem.traverse(o=>{if(o.material===jkt)o.material=mb});
 RM=mkRig(rem);rAIM=RM.aim;rMz=RM.mz;rMz.visible=false;   // RM: khung xương để anim.js làm hoạt ảnh
 const box=(g,y,h)=>{const m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({visible:false}));m.position.set(0,y,0);m.userData={pl:1,h};rem.add(m);hb.push(m)};
 box(Bx(.7,1.55,.5),.78,0);box(new THREE.SphereGeometry(.3,10,8),1.75,1)}
function setRA(a){NET.ra=a;if(rem){clearTimeout(rem.userData.tm);if(a)rem.visible=true;else rem.userData.tm=setTimeout(()=>{if(!NET.ra)rem.visible=false},1400)}hb.forEach(b=>{const i=T.indexOf(b);if(i>=0)T.splice(i,1)});if(a)T.push(...hb)}
function netBoxes(){if(NET.on&&NET.ra)T.push(...hb)}   // buildMap xóa T nên phải gắn lại

/* Gửi tin. */
function netFire(){send({t:'f'})}
function netHit(d,h){send({t:'h',d:Math.round(d),h:h?1:0})}
function netHud(){$('hpb').style.width=S.hp+'%';$('hpn').textContent=Math.ceil(S.hp)}

/* Điểm xuất hiện: lần đầu theo vị trí phòng; hồi sinh thì chọn điểm xa đối thủ nhất. */
function netSpawn(first){
 const s=first?SP[NET.slot?3:0]:SP.slice().sort((a,b)=>Math.hypot(b[0]-rt.x,b[1]-rt.z)-Math.hypot(a[0]-rt.x,a[1]-rt.z))[0];
 S.hp=100;S.dead=0;S.yaw=Math.atan2(s[0]-rt.x,s[1]-rt.z);S.pitch=.08;NET.inv=first?0:1.5;netHud();
 return{x:s[0],y:0,z:s[1],vy:0}}
function netRespawn(){$('dead').style.display='none';Object.assign(p,netSpawn());S.am=[30,2];S.w=0;S.rl=0;hud()}

/* Bị trúng đạn: trừ máu, nếu hết máu thì báo cho đối thủ để họ được tính hạ gục. */
function netHurt(m){
 if(S.stt!='play'||S.dead||NET.inv>0)return;
 S.hp-=m.d;shake=Math.min(1,shake+.5);snd(120,.1,.15);const e=$('hurt');e.style.opacity=1;setTimeout(()=>e.style.opacity=0,130);
 if(S.hp<=0){S.hp=0;S.dead=1;S.deaths++;S.rs=3;S.fire=0;S.held=0;S.rl=0;send({t:'dead',h:m.h?1:0});$('dead').style.display='flex'}
 netHud()}

function netMsg(m){
 if(m.t=='room'){NET.code=m.code;NET.slot=m.slot;lbs()}
 else if(m.t=='peer'){NET.n=m.n;if(NET.on&&m.n<2)netLost('Đối thủ đã thoát khỏi trận');else lbs()}
 else if(m.t=='err')$('lbs').textContent=m.msg;
 else if(m.t=='left')netLost('Chủ phòng đã thoát');
 else if(m.t=='go')netBegin(m.map);
 else if(m.t=='s'){Object.assign(rt,{x:m.x,y:m.y,z:m.z,w:m.w,p:m.p,c:m.c,m:m.m,r:m.r});if(m.a&&!NET.ra&&rem)rem.position.set(m.x,m.y,m.z);if(!!m.a!=!!NET.ra)setRA(m.a)}
 else if(m.t=='f'){if(rMz){rMz.visible=true;rMz.scale.setScalar(.8+R()*.7);NET.mf=.05}snd(230,.14,.05)}
 else if(m.t=='h')netHurt(m);
 else if(m.t=='dead'&&S.stt=='play'){S.kills++;if(m.h)S.hs++;popup('HẠ GỤC ĐỐI THỦ'+(m.h?' · HEADSHOT':''),m.h?'hs':'');snd(520,.18,.12);hud()}}

/* Mỗi khung hình: nội suy đối thủ, đếm giờ hồi sinh, gửi vị trí mình ~15 lần/giây. */
function netTick(dt){
 if(rem&&NET.ra){const k=Math.min(1,dt*14),q=rem.position;q.x+=(rt.x-q.x)*k;q.y+=(rt.y-q.y)*k;q.z+=(rt.z-q.z)*k;
  rem.rotation.y+=ad(rt.w-rem.rotation.y)*k;rAIM.rotation.x=rt.p;rem.scale.y=rt.c?.82:1}
 if(NET.mf>0){NET.mf-=dt;if(NET.mf<=0&&rMz)rMz.visible=false}
 if(NET.inv>0)NET.inv-=dt;
 if(S.dead){S.rs-=dt;$('dsec').textContent=Math.max(1,Math.ceil(S.rs));if(S.rs<=0)netRespawn()}
 NET.tm-=dt;
 if(NET.tm<=0&&(S.stt=='play'||S.stt=='count')){NET.tm=1/15;const f=n=>Math.round(n*100)/100;
  send({t:'s',x:f(p.x),y:f(p.y),z:f(p.z),w:f(S.yaw),p:f(S.pitch),c:S.cr?1:0,m:S.mv?1:0,a:S.dead?0:1,r:S.rl>0?f(1-S.rl/W[S.w].rt):-1})}}

/* Vào trận / ván lại / kết quả / rời phòng. */
function netStart(){send({t:'go',map:CH.map});netBegin(CH.map)}
function netBegin(map){
 if(!NET.on){NET.on=1;NET.pm=CH.mode}
 CH.mode=2;CH.map=map;document.querySelectorAll('.mc').forEach((e,j)=>e.classList.toggle('on',j==map));
 document.body.classList.remove('lb');document.body.classList.add('net');
 if(!rem)mkRemote();scene.add(rem);Object.assign(rt,{x:0,y:0,z:NET.slot?18:-40});rem.position.set(rt.x,0,rt.z);setRA(1);start()}
function netEnd(){
 const k=S.kills,d=S.deaths,r=$('rk'),a=$('again');
 r.style.fontSize='64px';r.textContent=k>d?'THẮNG':k<d?'THUA':'HÒA';r.style.color=k>d?'#ffd400':k<d?'#ff4d3d':'#cfd6e6';
 $('rinfo').textContent='Đấu 1v1 · '+MAPS[CH.map].n+' · '+k+' - '+d;
 a.textContent=NET.slot?'CHỜ CHỦ PHÒNG':'ĐẤU LẠI';a.disabled=!!NET.slot;$('rpb').style.display='none';
 setSt('end');cnt('r1',k*100+S.hs*50);cnt('r2',k);cnt('r3',S.hs);cnt('r4',S.shots?Math.round(S.hits/S.shots*100):0,'%');snd(300,.4,.15)}
function netLeave(){
 if(NET.ws){NET.ws.onclose=null;try{NET.ws.close()}catch(_){}NET.ws=null}
 if(NET.on){CH.mode=NET.pm;if(rem)scene.remove(rem);setRA(0)}
 NET.on=0;NET.code='';NET.n=1;NET.err=0;document.body.classList.remove('net','lb');$('dead').style.display='none'}
function netLost(t){
 const live=NET.on;if(NET.ws){NET.ws.onclose=null;try{NET.ws.close()}catch(_){}NET.ws=null}
 NET.code='';NET.n=1;
 if(live){toMenu();$('dl').textContent=t}else{if(!NET.err)$('lbs').textContent=t;$('lgo').style.display='none'}NET.err=0}

/* Sảnh chờ. */
function lbs(){
 const e=$('lbs'),g=$('lgo');
 e.innerHTML=NET.code?'Mã phòng<b>'+NET.code+'</b>'+(NET.n>1?'Đối thủ đã vào phòng.'+(NET.slot?' Chờ chủ phòng bắt đầu...':''):'Đang chờ đối thủ...'):'Tạo phòng mới, hoặc nhập mã để vào phòng của bạn bè.';
 g.style.display=NET.code&&!NET.slot?'':'none';g.disabled=NET.n<2}
function netConnect(msg){
 if(NET.ws){NET.ws.onclose=null;NET.ws.close()}
 NET.n=1;NET.code='';NET.err=0;$('lbs').textContent='Đang kết nối...';
 let ws;try{ws=new WebSocket($('lsrv').value.trim())}catch(e){$('lbs').textContent='Địa chỉ máy chủ không hợp lệ';return}
 NET.ws=ws;ws.onopen=()=>ws.send(JSON.stringify(msg));
 ws.onmessage=e=>{try{netMsg(JSON.parse(e.data))}catch(_){}};
 ws.onerror=()=>{NET.err=1;$('lbs').textContent='Không kết nối được máy chủ. Đã chạy "npm start" chưa?'};
 ws.onclose=()=>netLost('Mất kết nối với máy chủ')}
function netInit(){
 $('lsrv').value=/^https?:$/.test(location.protocol)?(location.protocol=='https:'?'wss://':'ws://')+location.host:'ws://localhost:3000';
 $('onl').onclick=()=>{document.body.classList.add('lb');lbs()};
 $('lx').onclick=netLeave;
 $('lmk').onclick=()=>netConnect({t:'create'});
 $('ljn').onclick=()=>{const c=$('lcode').value.trim().toUpperCase();if(c.length==4)netConnect({t:'join',code:c});else $('lbs').textContent='Nhập mã phòng 4 ký tự'};
 $('lgo').onclick=netStart}
