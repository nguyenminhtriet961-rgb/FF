/* Bản đồ + bia. buildMap(id) dựng lại cả sân; dữ liệu từng map nằm trong MAPS. */
const tRib=cv(64,64,(g,w)=>{g.fillStyle='#fff';g.fillRect(0,0,w,w);g.fillStyle='#b5b5b5';for(let i=0;i<w;i+=10)g.fillRect(i,0,4,w)});tRib.repeat.set(3,1);
const tCr=cv(64,64,(g,w)=>{g.fillStyle='#d09a55';g.fillRect(0,0,w,w);g.strokeStyle='#8a5a2b';g.lineWidth=7;g.strokeRect(3,3,58,58);g.lineWidth=5;g.beginPath();g.moveTo(6,6);g.lineTo(58,58);g.moveTo(58,6);g.lineTo(6,58);g.stroke()});
const tWin=cv(128,256,(g,w,h)=>{g.fillStyle='#0d1020';g.fillRect(0,0,w,h);for(let y=8;y<h;y+=16)for(let x=8;x<w;x+=16)if(R()<.45){g.fillStyle=R()<.5?'#ffd37a':'#7fe9ff';g.fillRect(x,y,8,8)}});
const D=[],mCr=M(0xffffff,{map:tCr});
const MAPS=[
{n:'Sân Huấn Luyện',d:'Bê tông, nắng ban ngày',c:['#9fd8ff','#8c9a82'],bb:'#e8590c',sky:0x9fd8ff,fog:[45,150],hemi:[0xdff2ff,0x7a8f5a],hi:.85,sun:0xfff0cc,si:.85,fl:['#8c9a82','#98a68e'],lane:0x56624e,wall:0x5f6f86,gnd:0x6fb24f,lwc:0xb0b7bf,
 cr:[[-6,8],[5,11],[-14,3],[14,5],[-20,-20],[21,-30],[-22,-45]],
 ct:[[-24,-12,0xe74c3c,8,2.4],[24,-22,0x2e86de,2.4,8],[-24,-36,0x27ae60,2.4,8],[24,-50,0xf39c12,2.4,8],[-18,12,0x8e44ad,7,2.4]],
 lw:[[-8,-8],[8,-8],[-9,-27],[9,-27],[-6,-40],[6,-40]],
 dm:[[-6,-12,0],[6,-12,0],[0,-18,4],[-10,-24,0],[10,-24,0],[0,-30,6],[-5,-36,0],[7,-36,4],[-12,-42,0],[12,-42,0],[0,-48,8],[-8,-54,4],[8,-54,0],[0,-62,10]]},
{n:'Sa Mạc Cháy',d:'Cát nóng, hoàng hôn',c:['#f6c37b','#c79a55'],bb:'#b5651d',sky:0xf3b36b,fog:[40,130],hemi:[0xffe2b0,0xb8874a],hi:.9,sun:0xffb36b,si:.9,fl:['#d9b36c','#e0bd7e'],lane:0xc79a55,wall:0x9c6b3f,gnd:0xd9b36c,lwc:0xc9a26a,
 cr:[[-8,10],[8,9],[-16,-4],[16,-6],[-12,-30],[13,-34],[0,-52]],
 ct:[[-23,-18,0xc0392b,2.4,8],[23,-26,0x16a085,2.4,8],[-22,-44,0xd35400,7,2.4]],
 lw:[[-7,-6],[7,-6],[0,-20],[-11,-34],[11,-34],[0,-46]],
 dm:[[-8,-10,0],[8,-10,3],[0,-16,6],[-14,-22,0],[14,-22,0],[-6,-28,5],[6,-28,5],[0,-36,9],[-12,-42,4],[12,-42,4],[-4,-50,0],[4,-50,0],[0,-58,12],[-16,-60,3]]},
{n:'Thành Phố Đêm',d:'Neon, sương mù',c:['#10163a','#e91e8c'],bb:'#c2185b',sky:0x0a0e26,fog:[22,95],hemi:[0x4a5cff,0x1a1030],hi:.8,sun:0x8fa4ff,si:.55,fl:['#272c3d','#2f3549'],lane:0x161a28,wall:0x1c2340,gnd:0x0d1020,lwc:0x3a4260,
 cr:[[-5,9],[6,12],[-13,0],[13,-2],[-17,-26],[18,-38]],
 ct:[[-23,-10,0xff2d95,8,2.4],[23,-18,0x19d3ff,2.4,8],[-23,-34,0xffb020,2.4,8],[23,-46,0x7c4dff,2.4,8],[-18,14,0x00e676,7,2.4]],
 lw:[[-8,-10],[8,-10],[-9,-24],[9,-24],[0,-34],[-7,-46],[7,-46]],
 dm:[[-5,-12,0],[5,-12,0],[-10,-18,5],[10,-18,5],[0,-24,7],[-7,-30,0],[7,-30,0],[-13,-36,6],[13,-36,6],[0,-42,10],[-6,-50,4],[6,-50,4],[0,-56,8],[-10,-62,0],[10,-62,0]]}
];
function flat(m,x,y,z){m.rotation.x=-PI/2;m.position.set(x,y,z);MG.add(m);return m}
function bx(x,z,w,h,d,mat){const m=new THREE.Mesh(Bx(w,h,d),mat);m.position.set(x,h/2,z);m.castShadow=m.receiveShadow=true;MG.add(m);T.push(m);cols.push({x0:x-w/2,x1:x+w/2,z0:z-d/2,z1:z+d/2,h})}
function neon(x,y,z,w,h,d,c){const m=new THREE.Mesh(Bx(w,h,d),new THREE.MeshBasicMaterial({color:c}));m.position.set(x,y,z);MG.add(m)}
function dummy(x,z,amp){
 const g=new THREE.Group(),piv=new THREE.Group();g.add(piv);g.position.set(x,0,z);
 const mb=M(0xf4511e),mh=M(0xf1c27d),ml=M(0x37474f),d={g,piv,hp:100,alive:1,f:0,rt:0,fl:0,x0:x,amp,sp:.6+R()*.5,ph:R()*6,mats:[mb,mh,ml]};
 const part=(geo,m,y,h)=>{const s=new THREE.Mesh(geo,m);s.position.y=y;s.castShadow=true;s.userData={d,h};piv.add(s);T.push(s)};
 part(Bx(.5,.8,.26),ml,.4,0);part(Bx(.68,.76,.34),mb,1.18,0);part(new THREE.SphereGeometry(.23,14,10),mh,1.78,1);
 const r1=new THREE.Mesh(new THREE.CircleGeometry(.22,16),new THREE.MeshBasicMaterial({color:0xffffff})),r2=new THREE.Mesh(new THREE.CircleGeometry(.1,16),new THREE.MeshBasicMaterial({color:0xd62828}));
 r1.position.set(0,1.2,.19);r2.position.set(0,1.2,.2);piv.add(r1,r2);
 const bs=new THREE.Mesh(new THREE.CylinderGeometry(.55,.6,.1,16),M(0x263238));bs.position.y=.05;g.add(bs);MG.add(g);D.push(d)}
function buildMap(id){
 const m=MAPS[id];MG.children.slice().forEach(c=>MG.remove(c));T.length=0;cols.length=0;D.length=0;
 scene.background.set(m.sky);scene.fog.color.set(m.sky);scene.fog.near=m.fog[0];scene.fog.far=m.fog[1];
 HL.color.set(m.hemi[0]);HL.groundColor.set(m.hemi[1]);HL.intensity=m.hi;sun.color.set(m.sun);sun.intensity=m.si;
 const tF=cv(128,128,(g,w)=>{g.fillStyle=m.fl[0];g.fillRect(0,0,w,w);g.fillStyle=m.fl[1];g.fillRect(0,0,64,64);g.fillRect(64,64,64,64);g.strokeStyle='rgba(0,0,0,.18)';g.lineWidth=2;g.strokeRect(0,0,w,w)});tF.repeat.set(16,24);
 flat(new THREE.Mesh(new THREE.PlaneGeometry(700,700),M(m.gnd)),0,-.05,0);
 const fl=flat(new THREE.Mesh(new THREE.PlaneGeometry(62,96),M(0xffffff,{map:tF})),0,0,-24);fl.receiveShadow=true;T.push(fl);
 flat(new THREE.Mesh(new THREE.PlaneGeometry(9,64),M(m.lane)),0,.02,-30).receiveShadow=true;
 for(let k=1;k<=6;k++){flat(new THREE.Mesh(new THREE.PlaneGeometry(9,.16),new THREE.MeshBasicMaterial({color:0xffffff})),0,.03,-10*k);flat(lab(k*10+'m',2.2,1,70,'#fff'),5.6,.03,-10*k+1.2)}
 const mW=M(m.wall);bx(0,-72,64,3,1.2,mW);bx(0,24,64,3,1.2,mW);bx(-31,-24,1.2,3,96,mW);bx(31,-24,1.2,3,96,mW);
 const bb=lab(m.n.toUpperCase(),18,3,64,'#fff',m.bb);bb.position.set(0,5,-71.2);MG.add(bb);
 m.cr.forEach(([x,z])=>bx(x,z,1.6,1.6,1.6,mCr));
 m.ct.forEach(([x,z,c,w,d])=>bx(x,z,w,2.6,d,M(c,id==2?{map:tRib,emissive:new THREE.Color(c).multiplyScalar(.45)}:{map:tRib})));
 const mL=M(m.lwc);m.lw.forEach(([x,z])=>bx(x,z,5,1.1,.8,mL));
 if(id==0){
  for(let i=0;i<26;i++){const s=i%2?1:-1,h=4+R()*3,t=new THREE.Group(),a=new THREE.Mesh(new THREE.CylinderGeometry(.3,.4,2,6),M(0x7b4a24)),b=new THREE.Mesh(new THREE.ConeGeometry(2.2+R(),h,7),M(0x2f9e44));a.position.y=1;b.position.y=h/2+1.8;t.add(a,b);t.position.set(s*(36+R()*14),0,22-i*4.2);MG.add(t)}
  for(let i=0;i<6;i++){const h=40+R()*25,k=new THREE.Mesh(new THREE.ConeGeometry(30+R()*20,h,6),M(0x7c93b3));k.position.set(-110+i*45,h/2-2,-135-R()*20);MG.add(k)}
 }
 if(id==1){
  const mt=M(0x3f8f4a);
  for(let i=0;i<22;i++){const s=i%2?1:-1,h=2.5+R()*2.5,c=new THREE.Group(),a=new THREE.Mesh(new THREE.CylinderGeometry(.35,.4,h,8),mt),b=new THREE.Mesh(Bx(.9,.28,.28),mt),b2=new THREE.Mesh(Bx(.28,.9,.28),mt);a.position.y=h/2;b.position.set(.6,h*.6,0);b2.position.set(.9,h*.6+.4,0);c.add(a,b,b2);c.position.set(s*(35+R()*18),0,22-i*4.6);c.rotation.y=R()*6;MG.add(c)}
  for(let i=0;i<7;i++){const h=18+R()*16,w=14+R()*10,r=new THREE.Mesh(Bx(w,h,w*.8),M(0xb5683a));r.position.set(-90+i*30,h/2,-125-R()*15);MG.add(r)}
 }
 if(id==2){
  const a=[];for(let i=0;i<320;i++){const t=R()*PI*2;a.push(Math.cos(t)*140,40+R()*80,Math.sin(t)*140-24)}
  const sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.Float32BufferAttribute(a,3));MG.add(new THREE.Points(sg,new THREE.PointsMaterial({color:0xffffff,size:1.6,fog:false})));
  const bm=new THREE.MeshBasicMaterial({map:tWin});
  for(let i=0;i<30;i++){const s=i%2?1:-1,h=18+R()*40,w=8+R()*8,b=new THREE.Mesh(Bx(w,h,w),bm);b.position.set(s*(42+R()*30),h/2,24-i*4);MG.add(b)}
  neon(0,3.1,-71.3,64,.2,.2,0x19d3ff);neon(0,3.1,23.3,64,.2,.2,0x19d3ff);neon(-30.3,3.1,-24,.2,.2,96,0xff2d95);neon(30.3,3.1,-24,.2,.2,96,0xff2d95);neon(-4.6,.04,-30,.12,.03,64,0x19d3ff);neon(4.6,.04,-30,.12,.03,64,0x19d3ff);
 }
 if(!NET.on)m.dm.forEach(a=>dummy(...a));netBoxes();
}

