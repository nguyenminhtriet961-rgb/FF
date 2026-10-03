/* Vòng cập nhật mỗi khung hình: di chuyển, camera, bia ngã/dựng lại. */
// vong lap
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function upd(dt){
 let ix=S.dead?0:K.d-K.a+mj.x,iz=S.dead?0:K.s-K.w+mj.z;const l=Math.hypot(ix,iz);if(l>1){ix/=l;iz/=l}S.mv=l>.1;
 S.pitch=clamp(S.pitch,-.9,.9);
 const sy=Math.sin(S.yaw),cy=Math.cos(S.yaw),sp=(S.cr?2.6:S.run?8.6:5.4)*dt,dx=(sy*iz+cy*ix)*sp,dz=(cy*iz-sy*ix)*sp;
 const nx=p.x+dx;if(Math.abs(nx)<29.4&&gh(nx,p.z)<=p.y+.05)p.x=nx;
 const nz=p.z+dz;if(nz>-69.6&&nz<21.8&&gh(p.x,nz)<=p.y+.05)p.z=nz;
 p.vy-=24*dt;p.y+=p.vy*dt;const g=gh(p.x,p.z);if(p.y<=g){p.y=g;p.vy=0}
 S.cd-=dt;if(S.rl>0){S.rl-=dt;if(S.rl<=0){S.rl=0;S.am[S.w]=W[S.w].mag;hud()}}
 if(S.mf>0){S.mf-=dt;if(S.mf<=0)mz.visible=false}
 if(S.fire&&(W[S.w].auto||!S.held)){shoot();S.held=1}
 S.kick=Math.max(0,S.kick-dt*8);
 P.position.set(p.x,p.y,p.z);P.rotation.y=S.yaw;P.scale.y=S.cr?.82:1;AIM.rotation.x=S.pitch+S.kick*.07;AIM.position.z=S.kick*.12;
 const ph=S.t*(S.run?15:10);legs[0].rotation.x=S.mv?Math.sin(ph)*.7:0;legs[1].rotation.x=S.mv?-Math.sin(ph)*.7:0;
 const cp=Math.cos(S.pitch),dir=V3(-sy*cp,Math.sin(S.pitch),-cy*cp),org=V3(p.x,p.y+(S.cr?1.15:1.55),p.z).addScaledVector(V3(cy,0,-sy),.75);
 cam.position.copy(org).addScaledVector(dir,-3.3);cam.position.set(clamp(cam.position.x,-30,30),Math.max(cam.position.y,.4),clamp(cam.position.z,-71,23));
 cam.lookAt(vv.copy(cam.position).add(dir));cam.updateMatrixWorld()}
function dupd(dt){
 D.forEach(d=>{
  if(d.alive){if(d.amp)d.g.position.x=d.x0+Math.sin(S.t*d.sp+d.ph)*d.amp;d.f=Math.max(0,d.f-dt*5)}
  else{d.f=Math.min(1,d.f+dt*6);d.rt-=dt;if(d.rt<=0){d.alive=1;d.hp=100}}
  d.piv.rotation.x=-d.f*1.5;d.fl-=dt;d.mats.forEach(m=>m.emissive.setHex(d.fl>0?0x777777:0))});
 }

