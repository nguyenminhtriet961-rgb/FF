/* Điều khiển: cần trái, vuốt ngắm, nút bấm, bàn phím, chuột, nút vào game. */
// dieu khien
const pad=$('pad'),jb=$('jb'),jk=$('jk');let joy=null,lk=null,mouse=0,fb=0;
function place(x,y){jb.style.left=x+'px';jb.style.top=y+'px'}
function look(dx,dy){S.yaw-=dx*.0042;S.pitch-=dy*.0042}
function fireSet(){S.fire=mouse||fb;if(!S.fire)S.held=0}
pad.onpointerdown=e=>{
 if(!S.on)return;
 if(e.pointerType=='mouse'){mouse=1;fireSet();try{pad.requestPointerLock()}catch(_){}return}
 pad.setPointerCapture(e.pointerId);
 if(e.clientX<innerWidth*.4&&!joy){joy={id:e.pointerId,x:e.clientX,y:e.clientY};place(e.clientX,e.clientY);jb.style.opacity=1}
 else if(!lk)lk={id:e.pointerId,x:e.clientX,y:e.clientY}};
pad.onpointermove=e=>{
 if(e.pointerType=='mouse'){if(S.on&&(mouse||document.pointerLockElement==pad))look(e.movementX,e.movementY);return}
 if(joy&&e.pointerId==joy.id){let dx=e.clientX-joy.x,dy=e.clientY-joy.y;const l=Math.hypot(dx,dy),m=50;if(l>m){dx*=m/l;dy*=m/l}mj.x=dx/m;mj.z=dy/m;jk.style.left=32+dx+'px';jk.style.top=32+dy+'px'}
 else if(lk&&e.pointerId==lk.id){look((e.clientX-lk.x)*1.3,(e.clientY-lk.y)*1.3);lk.x=e.clientX;lk.y=e.clientY}};
pad.onpointerup=pad.onpointercancel=e=>{
 if(e.pointerType=='mouse'){mouse=0;fireSet();return}
 if(joy&&e.pointerId==joy.id){joy=null;mj.x=mj.z=0;jk.style.left=jk.style.top='32px';jb.style.opacity=.5;place(95,innerHeight-110)}
 if(lk&&e.pointerId==lk.id)lk=null};
pad.oncontextmenu=e=>e.preventDefault();
function btn(id,fn){$(id).onpointerdown=e=>{e.preventDefault();if(S.on)fn()}}
btn('bj',jump);btn('bc',()=>S.cr^=1);btn('br',reload);btn('bw',()=>sw(1-S.w));
const bf=$('bf');let fl2=null;
bf.onpointerdown=e=>{e.preventDefault();if(!S.on)return;bf.setPointerCapture(e.pointerId);fb=1;fl2={x:e.clientX,y:e.clientY};fireSet()};
bf.onpointermove=e=>{if(fb&&fl2){look((e.clientX-fl2.x)*1.3,(e.clientY-fl2.y)*1.3);fl2.x=e.clientX;fl2.y=e.clientY}};
bf.onpointerup=bf.onpointercancel=()=>{fb=0;fl2=null;fireSet()};
onkeydown=e=>{if(e.target.tagName=='INPUT')return;const k=e.key.toLowerCase();if(k=='w'&&!e.repeat){const n=performance.now();if(n-S.lw<300)S.run=1;S.lw=n}if(k in K)K[k]=1;else if(k==' '){e.preventDefault();if(S.on)jump()}else if(k=='c')S.cr^=1;else if(k=='r')reload();else if(k=='1')sw(0);else if(k=='2')sw(1)};
onkeyup=e=>{if(e.target.tagName=='INPUT')return;const k=e.key.toLowerCase();if(k in K)K[k]=0;if(k=='w')S.run=0};

