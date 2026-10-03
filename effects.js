/* Hiệu ứng: hạt tia lửa, vỏ đạn, tia đạn, rung màn hình, popup hạ gục / combo. */
const PT=[],TR=[],pgeo=new THREE.BoxGeometry(.07,.07,.07),cgeo=new THREE.BoxGeometry(.035,.035,.09),trg=new THREE.BoxGeometry(.035,.035,1),pmt={};
const pmat=c=>pmt[c]||(pmt[c]=new THREE.MeshBasicMaterial({color:c}));
let shake=0,fovK=0;
function burst(pt,col,n,sp,life){for(let i=0;i<n;i++){const m=new THREE.Mesh(pgeo,pmat(col));m.position.copy(pt);scene.add(m);PT.push({m,v:V3((R()-.5)*sp,R()*sp*.9,(R()-.5)*sp),t:life*(.6+R()*.6),l:life,g:9,sh:1})}}
function casing(){const m=new THREE.Mesh(cgeo,pmat(0xd4a017)),cy=Math.cos(S.yaw),sy=Math.sin(S.yaw);m.position.copy(AIM.localToWorld(V3(.2,0,-.45)));m.rotation.set(R()*3,R()*3,0);scene.add(m);PT.push({m,v:V3(cy*(2+R()*1.5),2+R()*1.5,-sy*(2+R()*1.5)),t:1.4,l:1.4,g:18,sh:0})}
function tracer(a,b){const l=a.distanceTo(b);if(l<.1)return;const m=new THREE.Mesh(trg,new THREE.MeshBasicMaterial({color:0xffe9a0,transparent:true}));m.scale.z=l;m.position.copy(a).lerp(b,.5);m.lookAt(b);scene.add(m);TR.push({m,t:.09})}
function popup(t,c){const k=$('kf'),e=document.createElement('div');e.className='kp '+(c||'');e.textContent=t;k.appendChild(e);while(k.children.length>4)k.firstChild.remove();setTimeout(()=>e.remove(),1100)}
function killFx(d,h){const c=S.t-S.lk<3?S.cb+1:1;S.cb=c;S.lk=S.t;const pts=100+(h?50:0)+(c-1)*25;S.sc+=pts;
 const q=V3(d.g.position.x,1.5,d.g.position.z);burst(q,0xffb020,24,7,.8);burst(q,0xffffff,10,4,.5);
 popup('HẠ GỤC +'+pts,h?'hs':'');if(h)popup('HEADSHOT','hs');if(c>1)popup('COMBO x'+c,'cb');snd(520,.18,.12)}
function fxUpd(dt){
 for(let i=PT.length-1;i>=0;i--){const q=PT[i];q.t-=dt;q.v.y-=q.g*dt;q.m.position.addScaledVector(q.v,dt);
  if(q.m.position.y<.03){q.m.position.y=.03;q.v.y*=-.3;q.v.x*=.6;q.v.z*=.6}
  if(q.sh)q.m.scale.setScalar(Math.max(q.t/q.l,0));q.m.rotation.x+=dt*8;
  if(q.t<=0){scene.remove(q.m);PT.splice(i,1)}}
 for(let i=TR.length-1;i>=0;i--){const q=TR[i];q.t-=dt;q.m.material.opacity=Math.max(q.t/.09,0);if(q.t<=0){scene.remove(q.m);q.m.material.dispose();TR.splice(i,1)}}
 ML.intensity=Math.max(0,ML.intensity-dt*40);if(ML.intensity>0)mz.getWorldPosition(ML.position);
 shake=Math.max(0,shake-dt*4);if(shake>0){cam.position.x+=(R()-.5)*shake*.15;cam.position.y+=(R()-.5)*shake*.15}
 fovK=Math.max(0,fovK-dt*14);if(cam.fov!=68+fovK){cam.fov=68+fovK;cam.updateProjectionMatrix()}}

