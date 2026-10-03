/* Menu, chế độ chơi, đếm ngược, kết quả trận, nhận diện thiết bị (điện thoại / máy tính). */
const CH={map:0,mode:0};let lastN=0;
function setSt(s){S.stt=s;document.body.dataset.s=s}
function setDev(d){document.body.classList.remove('pc','mob');document.body.classList.add(d);document.querySelectorAll('#devs button').forEach(b=>b.classList.toggle('on',b.dataset.d==d))}
function menuCam(){const a=S.t*.12;cam.position.set(Math.cos(a)*26,7+Math.sin(S.t*.3),-14+Math.sin(a)*26);cam.lookAt(0,2,-14)}
function pop(e,t){e.textContent=t;e.className='hd';void e.offsetWidth;e.className='hd pop'}
function pick(i){CH.map=i;buildMap(i);document.querySelectorAll('.mc').forEach((e,j)=>e.classList.toggle('on',j==i))}
function start(){
 buildMap(CH.map);
 Object.assign(S,{kills:0,deaths:0,dead:0,hp:100,hits:0,shots:0,hs:0,sc:0,cb:0,lk:-9,am:[30,2],rl:0,cd:0,w:0,cr:0,run:0,yaw:0,pitch:.08,tl:CH.mode?60:0,fire:0,sp:0,held:0,kick:0});
 Object.assign(p,NET.on?netSpawn(1):{x:0,y:0,z:18,vy:0});mouse=0;fb=0;lastN=0;
 $('tm').style.display=$('sc').style.display=CH.mode?'':'none';
 $('tm').textContent=60;$('sc').textContent=0;$('kf').innerHTML='';
 document.querySelector('.tag').textContent=CH.mode==2?'ĐẤU 1v1':CH.mode?'TRẬN 60 GIÂY':'HUẤN LUYỆN';
 try{ac=ac||new AudioContext();ac.resume()}catch(_){}
 hud();recStart();setSt('count');S.ct=3.2;S.on=0;
 try{if(document.body.classList.contains('pc'))pad.requestPointerLock()}catch(_){}}
function cdUpd(){
 if(S.ct<=0){S.on=1;setSt('play');pop($('cdn'),'VÀO!');setTimeout(()=>{if(S.on)$('cdn').textContent=''},800);return}
 const n=Math.ceil(S.ct-.2);if(n>0&&n!=lastN){lastN=n;pop($('cdn'),n)}}
function tick(dt){
 S.sp=Math.max(0,S.sp-dt*40);$('cross').style.setProperty('--s',(S.sp+(S.mv?5:0)-(S.cr?2:0))+'px');
 $('sc').textContent=NET.on?S.kills+' - '+S.deaths:S.sc;
 if(CH.mode){rec(dt);S.tl-=dt;$('tm').textContent=Math.max(0,Math.ceil(S.tl));if(S.tl<=0)endMatch()}}
function cnt(id,to,suf){const e=$(id),t0=performance.now();(function f(n){const k=Math.min(1,(n-t0)/900);e.textContent=Math.round(to*(1-Math.pow(1-k,3)))+(suf||'');if(k<1)requestAnimationFrame(f)})(t0)}
function endMatch(){
 S.on=0;S.fire=0;mouse=0;fb=0;try{document.exitPointerLock()}catch(_){}
 if(NET.on)return netEnd();$('again').textContent='CHƠI LẠI';$('again').disabled=false;$('rpb').style.display='';$('rk').style.fontSize='';const acc=S.shots?Math.round(S.hits/S.shots*100):0,rk=S.sc>=1800?'S':S.sc>=1200?'A':S.sc>=700?'B':'C';
 $('rk').textContent=rk;$('rk').style.color={S:'#ffd400',A:'#19d3ff',B:'#9be564',C:'#cfd6e6'}[rk];
 $('rinfo').textContent=MAPS[CH.map].n+' · 60 giây';
 setSt('end');cnt('r1',S.sc);cnt('r2',S.kills);cnt('r3',S.hs);cnt('r4',acc,'%');snd(300,.4,.15)}
function toMenu(){netLeave();S.on=0;S.ct=0;S.rp=0;S.fire=0;mouse=0;fb=0;$('cdn').textContent='';try{document.exitPointerLock()}catch(_){}buildMap(CH.map);setSt('menu')}
function menuInit(){
 const mp=$('maps');
 MAPS.forEach((m,i)=>{const e=document.createElement('button');e.className='mc';e.style.background='linear-gradient(160deg,'+m.c[0]+','+m.c[1]+')';e.innerHTML='<b class="hd">'+m.n+'</b><span>'+m.d+'</span>';e.onclick=()=>pick(i);mp.appendChild(e)});
 document.querySelectorAll('#modes button').forEach(b=>b.onclick=()=>{CH.mode=+b.dataset.m;document.querySelectorAll('#modes button').forEach(x=>x.classList.toggle('on',x==b))});
 document.querySelectorAll('#devs button').forEach(b=>b.onclick=()=>setDev(b.dataset.d));
 $('dl').textContent='Đã tự nhận diện: '+(MOBILE?'điện thoại':'máy tính')+' (bấm để đổi nếu sai)';
 setDev(MOBILE?'mob':'pc');pick(0);setSt('menu');
 $('go').onclick=start;$('again').onclick=()=>NET.on?netStart():start();$('tomenu').onclick=toMenu;$('rs').onclick=toMenu;$('rpb').onclick=rpStart;
 $('rpp').onclick=()=>{rpPause^=1;$('rpp').textContent=rpPause?'▶':'❚❚'};
 $('rps').onclick=()=>{rpSp=rpSp==1?2:rpSp==2?.5:1;$('rps').textContent='x'+rpSp};
 $('rpr').oninput=e=>{rpI=e.target.value/1000*(RC.length-1)};$('rpx').onclick=rpEnd}

