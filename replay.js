/* Ghi hình & xem lại trận (30 khung/giây): vị trí người chơi + bia, camera quay quanh nhân vật. */
let RC=[],recT=0,rpI=0,rpSp=1,rpPause=0;
function recStart(){RC=[];recT=0}
function rec(dt){recT+=dt;if(recT<1/30)return;recT-=1/30;const f=[p.x,p.y,p.z,S.yaw,S.pitch,S.cr,S.fire?1:0];D.forEach(d=>f.push(d.g.position.x,d.alive));RC.push(Float32Array.from(f))}
function rpStart(){if(RC.length<2)return;rpI=0;rpPause=0;rpSp=1;$('rps').textContent='x1';$('rpp').textContent='❚❚';S.rp=1;setSt('rep')}
function rpEnd(){S.rp=0;mz.visible=false;P.scale.y=1;setSt('end')}
function rpTick(dt){
 if(!rpPause)rpI=Math.min(RC.length-1,rpI+dt*30*rpSp);
 const i=Math.floor(rpI),f=rpI-i,a=RC[i],b=RC[Math.min(i+1,RC.length-1)],L=k=>a[k]+(b[k]-a[k])*f,x=L(0),y=L(1),z=L(2);
 P.position.set(x,y,z);P.rotation.y=L(3);AIM.rotation.x=L(4);P.scale.y=a[5]?.82:1;
 const mv=!rpPause&&Math.hypot(b[0]-a[0],b[2]-a[2])>.01;
 legs[0].rotation.x=mv?Math.sin(S.t*10)*.7:0;legs[1].rotation.x=-legs[0].rotation.x;
 mz.visible=a[6]>0&&(i%3)!=0;
 D.forEach((d,j)=>{d.g.position.x=L(7+j*2);d.f+=((a[8+j*2]?0:1)-d.f)*Math.min(1,dt*10);d.piv.rotation.x=-d.f*1.5});
 const g=S.t*.35;cam.position.set(Math.max(-30,Math.min(30,x+Math.cos(g)*5.5)),y+2.6,Math.max(-71,Math.min(23,z+Math.sin(g)*5.5)));cam.lookAt(x,y+1.3,z);
 $('rpr').value=rpI/(RC.length-1)*1000}

