/* Hoạt ảnh nhân vật, 5 kiểu: ĐỨNG THỞ · ĐI/CHẠY NƯỚC RÚT · NHẢY (bật → co chân → tiếp đất) · NẠP ĐẠN · BỊ HẠ GỤC (ngã ngửa, hồi sinh thì đứng dậy).
   Trạng thái được suy ra từ chuyển động của mô hình mỗi khung hình, nên dùng chung cho người chơi, đối thủ online và phần xem lại.
   Hai tay dùng IK 2 đoạn: chỉ cần nói "tay đặt ở đâu trên súng", khuỷu tự gập. Chỉ GHI (không cộng dồn) vào các khớp nên không bị trôi. */
const ez=t=>t<=0?0:t>=1?1:t*t*(3-2*t),mx=(a,b,t)=>a+(b-a)*t,
 _u=V3(0,0,-1),_d=V3(0,0,0),_e=V3(0,0,0),_h=V3(0,0,0),_w=V3(0,0,0),_q=new THREE.Quaternion(),
 _gl=V3(0,0,0),_gr=V3(0,0,0),_mg=V3(0,0,0),_ch=V3(0,0,0),_lh=V3(0,0,0),pR=V3(.7,-1,.15),pL=V3(-.5,-1,.1),
 RV=Array.from({length:12},()=>V3(0,0,0)),RT=[0,.12,.2,.3,.42,.5,.62,.74,.8,.86,.94,1],mgeo=Bx(.06,.22,.08);
let RG=null,RM=null;   // khung xương người chơi / đối thủ

function mkRig(r){const f=n=>r.getObjectByName(n);
 return{r,bd:f('bd'),ub:f('ub'),hd:f('hd'),aim:f('aim'),gun:f('gun'),mag:f('mag'),hm:f('hm'),mz:f('mz'),
  hip:[f('hipL'),f('hipR')],kn:[f('knL'),f('knR')],sh:[f('shL'),f('shR')],el:[f('elL'),f('elR')],
  x:r.position.x,y:r.position.y,z:r.position.z,sp:0,vy:0,pv:0,ph:0,air:0,aw:0,was:0,ld:0,dth:0,cs:r.scale.y,ft:0,fr:0,pr:-1,t:0}}

/* IK 2 đoạn bằng nhau: vai u → khuỷu f → cổ tay t (toạ độ trong AIM). pole = hướng khuỷu muốn chỉ về. */
function ik(u,f,t,pole){
 _d.copy(t).sub(u.position);const dl=clamp(_d.length(),.12,2*AL-.02);_d.normalize();
 _h.copy(pole).addScaledVector(_d,-pole.dot(_d)).normalize();
 _e.copy(u.position).addScaledVector(_d,dl/2).addScaledVector(_h,Math.sqrt(AL*AL-dl*dl/4));
 _w.copy(u.position).addScaledVector(_d,dl);
 u.quaternion.setFromUnitVectors(_u,_d.copy(_e).sub(u.position).normalize());
 f.quaternion.setFromUnitVectors(_u,_h.copy(_w).sub(_e).normalize()).premultiply(_q.copy(u.quaternion).invert())}

/* Đường đi của tay trái khi nạp đạn (u = 0..1): ốp lót → băng đạn → kéo ra → túi áo → băng mới → cắm vào → cần kéo → về ốp lót. */
function reloadHand(u,gl,mg,ch,out){const V=RV;
 V[0].copy(gl);V[1].copy(mg);V[2].copy(mg);V[3].copy(mg).add(_h.set(0,-.3,.06));V[4].set(-.2,-.5,-.12);V[5].copy(V[4]);
 V[6].copy(mg).add(_h.set(0,-.3,0));V[7].copy(mg);V[8].copy(ch);V[9].copy(ch).z+=.1;V[10].copy(ch);V[11].copy(gl);
 let i=0;while(i<10&&u>RT[i+1])i++;return out.lerpVectors(V[i],V[i+1],ez((u-RT[i])/(RT[i+1]-RT[i])))}
function dropMag(g){const m=new THREE.Mesh(mgeo,orM);m.position.copy(g.el[0].localToWorld(V3(0,-.1,-AL-.02)));m.castShadow=true;scene.add(m);
 PT.push({m,v:V3((R()-.5)*1.5,1.5,(R()-.5)*1.5),t:1.4,l:1.4,g:18,sh:0})}

/* o = {rl: tiến độ nạp đạn 0..1 hoặc -1 nếu không nạp, dead: đang bị hạ gục} */
function animRig(g,dt,o){
 const r=g.r,ps=r.position,rl=o.rl;g.t+=dt;
 // --- đọc chuyển động ---
 let v=Math.hypot(ps.x-g.x,ps.z-g.z)/dt,vy=(ps.y-g.y)/dt;g.x=ps.x;g.y=ps.y;g.z=ps.z;
 if(v>25||Math.abs(vy)>40)v=vy=0;   // dịch chuyển tức thời (hồi sinh, tua xem lại) thì bỏ qua
 g.sp+=(v-g.sp)*Math.min(1,dt*10);g.vy+=(vy-g.vy)*Math.min(1,dt*20);
 g.air=ps.y>gh(ps.x,ps.z)+.12?g.air+dt:0;const air=g.air>.03;
 if(air)g.pv=g.vy;else if(g.was)g.ld=Math.min(1,.4+Math.max(0,-g.pv)/14);   // vừa tiếp đất: độ nặng theo tốc độ rơi
 g.was=air;g.aw+=((air?1:0)-g.aw)*Math.min(1,dt*16);g.ld=Math.max(0,g.ld-dt*5);
 g.dth=clamp(g.dth+(o.dead?dt*2.4:-dt*5),0,1);
 g.ft=g.mz.visible?.6:Math.max(0,g.ft-dt);g.fr+=((g.ft>0?1:0)-g.fr)*Math.min(1,dt*10);   // fr: đang bắn
 g.cs+=(r.scale.y-g.cs)*Math.min(1,dt*14);   // ngồi mượt: hộp va chạm đổi ngay, hình thì co dần
 const aw=g.aw,ld=ez(g.ld),dd=1-Math.pow(1-g.dth,3),s=g.sp,m=ez(s/2.5),spr=ez((s-6.5)/2),idle=1-m,br=Math.sin(g.t*2.2);
 g.ph+=dt*s*1.8;const sw=Math.sin(g.ph)*Math.min(1,.25+.08*s)*m,cw=Math.cos(g.ph),kb=(.5+.9*spr)*m;
 const t=clamp(g.vy/8,-1,1),up=Math.max(t,0),dn=Math.max(-t,0),tk=1-Math.abs(t);   // nhảy: đang lên / đỉnh / đang rơi
 // --- 2) chạy + 3) nhảy: chân (chạy ↔ nhảy trộn theo aw), gối gập khi chân vung ra trước ---
 const H=[mx(sw,.55*up+.9*tk+.25*dn,aw),mx(-sw,-.35*up+.7*tk-.25*dn,aw)],
  K=[mx(Math.max(0,cw)*kb,.2*up+1.3*tk+.4*dn,aw),mx(Math.max(0,-cw)*kb,.9*up+1.4*tk+.3*dn,aw)];
 for(let i=0;i<2;i++){g.hip[i].rotation.x=H[i]+.5*ld+dd*(i?-.2:.5);g.kn[i].rotation.x=-(K[i]+ld+dd*(i?.3:.9))}
 // --- thân: nhấp nhô theo bước, 1) thở khi đứng, ngã ngửa khi bị hạ ---
 const lean=.05*m+.12*spr*(1-g.fr);
 g.bd.position.set(0,-.2*(1-Math.cos(sw))*(1-aw)+br*.006*idle-.1*ld+.2*dd,-.6*dd);g.bd.rotation.x=1.4*dd;
 g.bd.scale.y=g.cs*(1+.05*up*aw-.1*ld)/r.scale.y;
 g.ub.rotation.set(-lean+(.1*up-.12*dn)*aw-.2*ld+br*.012*idle-(rl>=0?.07*(ez(rl/.14)-ez((rl-.88)/.12)):0),0,Math.sin(g.ph)*.05*m);
 g.hd.rotation.x=clamp(g.aim.rotation.x*.6,-.5,.5)-g.ub.rotation.x*.6+.4*dd;
 // --- súng ---
 const gun=g.gun,low=spr*(1-g.fr);
 gun.position.set(Math.sin(g.ph)*.02*m,br*.008*idle+Math.cos(g.ph*2)*.012*m*(1-spr)-.06*low-.2*dd,.04+.08*low);
 gun.rotation.set(Math.sin(g.t*2.2+1)*.012*idle-.5*low-.3*dd,0,-.12*low+.9*dd);
 let c=0;
 if(rl>=0){   // 4) nạp đạn: nghiêng súng cho dễ thấy băng đạn, thân cúi nhìn xuống súng
  c=ez(rl/.14)-ez((rl-.88)/.12);
  gun.position.x-=.1*c;gun.position.y+=.04*c-.035*Math.exp(-Math.pow((rl-.76)*30,2));gun.position.z+=.1*c;gun.rotation.x+=.3*c;gun.rotation.z-=.5*c;g.hd.rotation.x-=.25*c}
 gun.updateMatrix();
 // --- hai tay ---
 _gr.set(.14,-.17,-.36).applyMatrix4(gun.matrix);_gl.set(.14,-.07,-.7).applyMatrix4(gun.matrix);   // tay phải ở báng, tay trái ở ốp lót
 let lt=_gl;
 if(rl>=0){_mg.set(.14,-.24,-.62).applyMatrix4(gun.matrix);_ch.set(.14,.07,-.3).applyMatrix4(gun.matrix);lt=reloadHand(rl,_gl,_mg,_ch,_lh);
  g.mag.visible=!(rl>.2&&rl<.74);g.hm.visible=(rl>.2&&rl<.4)||(rl>.52&&rl<.74);   // băng cũ rút ra, băng mới cắm vào
  if(g.pr>=0&&g.pr<.4&&rl>=.4)dropMag(g)}   // vứt băng cũ
 else{g.mag.visible=true;g.hm.visible=false}
 g.pr=rl;ik(g.sh[1],g.el[1],_gr,pR);ik(g.sh[0],g.el[0],lt,pL)}

/* Gọi mỗi khung hình (main.js), sau khi vị trí các mô hình đã được cập nhật. */
function animTick(dt){
 if(dt<=0)return;
 RG=RG||mkRig(P);
 const live=S.on&&!S.rp;   // đang chơi thật (không phải menu / xem lại)
 animRig(RG,dt,{rl:live&&S.rl>0?1-S.rl/W[S.w].rt:-1,dead:live&&S.dead});
 if(RM&&NET.on&&rem.visible){   // đối thủ: báo tiến độ nạp đạn qua mạng, nội suy cho mượt
  const q=rt.r==null?-1:rt.r;RM.ru=q<0||RM.ru==null||RM.ru<0?q:RM.ru+(q-RM.ru)*Math.min(1,dt*20);
  animRig(RM,dt,{rl:RM.ru,dead:!NET.ra})}}
