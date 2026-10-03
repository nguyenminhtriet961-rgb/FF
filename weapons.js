/* Bắn súng: shoot(), nạp đạn, đổi súng, nhảy, hiệu ứng tia đạn/tia lửa/sát thương. */
const ray=new THREE.Raycaster(),fx=[],vv=V3(0,0,0);
function num(t,pt,hd){const v=pt.clone().project(cam),e=document.createElement('div');e.className='dmg'+(hd?' hd':'');e.textContent=Math.round(t);e.style.left=(v.x*.5+.5)*innerWidth+'px';e.style.top=(-v.y*.5+.5)*innerHeight+'px';document.body.appendChild(e);setTimeout(()=>e.remove(),700)}
function mark(k,h){const e=$('hm');e.className='';void e.offsetWidth;e.className=k?'k':h?'h':'n'}
function reload(){const w=W[S.w];if(S.rl||S.am[S.w]>=w.mag)return;S.rl=w.rt;hud()}
function sw(i){if(i==S.w)return;S.w=i;S.rl=0;S.cd=.3;hud()}
function jump(){if(p.y<=gh(p.x,p.z)+.02)p.vy=8.5}
function shoot(){
 const w=W[S.w];if(S.rl||S.cd>0||S.dead)return;
 if(S.am[S.w]<=0){reload();return}
 S.am[S.w]--;S.cd=w.rate;S.shots++;snd(w.pel>1?140:230,.14,.18);
 mz.visible=true;mz.scale.setScalar(.8+R()*.7);mz.rotation.z=R()*6;ML.intensity=2.6;shake=Math.min(1,shake+.35);fovK=Math.min(3,fovK+1.2);S.sp=Math.min(14,S.sp+6);casing();netFire();S.mf=.05;S.kick=1;S.pitch+=w.rec*(.6+R()*.8);S.yaw+=(R()-.5)*w.rec*.5;
 mz.getWorldPosition(vv);const org=vv.clone();let tot=0,head=0,kill=0,lp=null,pd=0;
 for(let i=0;i<w.pel;i++){
  const m=S.mv?1.6:1;
  ray.setFromCamera({x:(R()-.5)*2*w.sp*m,y:(R()-.5)*2*w.sp*m},cam);ray.near=3.5;ray.far=200;
  const hit=ray.intersectObjects(T).find(h=>!(h.object.userData.d&&!h.object.userData.d.alive));
  let end;
  if(hit){end=hit.point;const u=hit.object.userData;
   if(u.d){const a=w.dmg*(u.h?2.2:1)*(w.pel>1?Math.max(.3,1-hit.distance/40):1);tot+=a;lp=hit.point;burst(lp,u.h?0xffd400:0xff5252,u.h?10:6,3,.4);if(u.h)head=1;
    const d=u.d;d.hp-=a;d.fl=.08;if(d.hp<=0&&d.alive){d.alive=0;d.rt=3;S.kills++;kill=1;killFx(d,u.h)}}
   else if(u.pl){const a=w.dmg*(u.h?2.2:1)*(w.pel>1?Math.max(.3,1-hit.distance/40):1);tot+=a;pd+=a;lp=hit.point;burst(lp,0xff5252,u.h?10:6,3,.4);if(u.h)head=1}
   else burst(hit.point,0xffe08a,7,3.5,.4)
  }else end=ray.ray.at(120,V3(0,0,0));
  tracer(org,end)}
 if(pd)netHit(pd,head);if(lp){S.hits++;if(head)S.hs++;num(tot,lp,head);mark(kill,head);snd(900,.05,.08)}
 hud()}

