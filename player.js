/* Nhân vật người chơi: mô hình khối có "khung xương" nhỏ để làm hoạt ảnh (xem anim.js).
   P → bd (cả thân, xoay quanh chân) → { 2 chân: hip → knee } + ub (thân trên, xoay quanh hông) → { hd (đầu), AIM (vai) → { 2 tay: sh → el, gun (súng) } }
   Mỗi bộ phận có .name để anim.js tìm lại được cả trên bản sao của đối thủ. mz = đầu nòng (lửa nổ). */
const P=new THREE.Group(),AIM=new THREE.Group(),legs=[],AL=.4;   // AL = độ dài mỗi đoạn tay
function pm(g,geo,m,x,y,z){const s=new THREE.Mesh(geo,m);s.position.set(x,y,z);s.castShadow=true;g.add(s);return s}
const nm=(o,n)=>(o.name=n,o);
const skin=M(0xf1c27d),jkt=M(0xff7a00),pn=M(0x2d3e50),dk=M(0x222831),gn=M(0x34452c),gy=M(0x3a3f4a),orM=M(0xffb020),bk=M(0x111418);
const bd=nm(new THREE.Group(),'bd'),ub=nm(new THREE.Group(),'ub'),hd=nm(new THREE.Group(),'hd'),GUN=nm(new THREE.Group(),'gun');
P.add(bd);bd.add(ub);ub.position.y=.84;hd.position.y=.66;ub.add(hd);nm(AIM,'aim');
// chân: hông → đùi → đầu gối → ống chân + giày
[[-.15,'L'],[.15,'R']].forEach(([x,s])=>{const h=nm(new THREE.Group(),'hip'+s),k=nm(new THREE.Group(),'kn'+s);h.position.set(x,.8,0);k.position.y=-.4;
 pm(h,Bx(.24,.44,.26),pn,0,-.2,0);pm(k,Bx(.23,.44,.25),pn,0,-.2,0);pm(k,Bx(.27,.16,.36),bk,0,-.36,.05);h.add(k);bd.add(h);legs.push(h)});
// thân trên
pm(ub,Bx(.62,.72,.34),jkt,0,.32,0);pm(ub,Bx(.66,.46,.38),gn,0,.36,.01);pm(ub,Bx(.64,.09,.36),bk,0,0,0);pm(ub,Bx(.48,.56,.2),gn,0,.36,.27);
// đầu: mũ, kính, khăn đỏ
pm(hd,new THREE.SphereGeometry(.22,14,10),skin,0,.22,0);
pm(hd,new THREE.SphereGeometry(.255,14,8,0,PI*2,0,PI/2),gn,0,.27,0);pm(hd,Bx(.5,.05,.12),gn,0,.3,-.2);
pm(hd,Bx(.36,.09,.08),new THREE.MeshBasicMaterial({color:0x19d3ff}),0,.24,-.2);pm(hd,Bx(.3,.12,.2),M(0xe53935),0,.12,-.08);
// vai (AIM) và hai tay: vai → khuỷu → găng. Tay trái có thêm băng đạn cầm trên tay (hm) cho cảnh nạp đạn.
AIM.position.y=.56;ub.add(AIM,hd);
[[-1,'L'],[1,'R']].forEach(([s,n])=>{const a=nm(new THREE.Group(),'sh'+n),e=nm(new THREE.Group(),'el'+n);a.position.x=s*.33;e.position.z=-AL;
 pm(a,Bx(.14,.14,AL+.04),jkt,0,0,-AL/2);pm(e,Bx(.12,.12,AL+.02),jkt,0,0,-AL/2);pm(e,Bx(.11,.11,.12),bk,0,0,-AL-.03);
 if(s<0)nm(pm(e,Bx(.06,.2,.08),orM,0,-.1,-AL-.02),'hm').visible=false;
 a.add(e);AIM.add(a)});
// súng trường (nhóm GUN để nạp đạn / chạy nước rút có thể nghiêng riêng, tay bám theo bằng IK)
AIM.add(GUN);GUN.position.z=.04;
pm(GUN,Bx(.09,.13,.55),dk,.14,-.05,-.5);pm(GUN,Bx(.08,.1,.4),gy,.14,-.04,-.88);pm(GUN,Bx(.04,.04,.3),dk,.14,-.04,-1.2);pm(GUN,Bx(.06,.06,.1),bk,.14,-.04,-1.38);
pm(GUN,Bx(.092,.02,.3),orM,.14,.01,-.5);pm(GUN,Bx(.07,.07,.28),dk,.14,-.04,-.1);pm(GUN,Bx(.06,.14,.07),dk,.14,-.2,-.35);
nm(pm(GUN,Bx(.07,.24,.1),orM,.14,-.2,-.62),'mag').rotation.x=.2;
const sc=pm(GUN,new THREE.CylinderGeometry(.045,.045,.26,10),bk,.14,.1,-.5);sc.rotation.x=PI/2;
pm(GUN,new THREE.SphereGeometry(.03,8,6),new THREE.MeshBasicMaterial({color:0x19d3ff}),.14,.1,-.64);
const mz=nm(new THREE.Group(),'mz'),mzs=new THREE.Mesh(new THREE.SphereGeometry(.13,8,6),new THREE.MeshBasicMaterial({color:0xffd24a})),mzc=new THREE.Mesh(new THREE.ConeGeometry(.07,.4,6),new THREE.MeshBasicMaterial({color:0xff9a1f}));
mzc.rotation.x=-PI/2;mzc.position.z=-.22;mz.add(mzs,mzc);mz.position.set(.14,-.04,-1.5);mz.visible=false;GUN.add(mz);scene.add(P);
