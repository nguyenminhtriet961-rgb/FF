/* Khởi tạo 3D: scene, camera, ánh sáng, hàm tiện ích (M, Bx, cv, lab). */
const MOBILE=matchMedia('(pointer:coarse)').matches||/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
const $=i=>document.getElementById(i),R=Math.random,PI=Math.PI,V3=(x,y,z)=>new THREE.Vector3(x,y,z);
const scene=new THREE.Scene(),SKY=0x9fd8ff;
scene.background=new THREE.Color(SKY);scene.fog=new THREE.Fog(SKY,45,150);
const cam=new THREE.PerspectiveCamera(68,1,.3,300);
const ren=new THREE.WebGLRenderer({antialias:true});
ren.shadowMap.enabled=true;ren.shadowMap.type=THREE.PCFSoftShadowMap;
document.body.prepend(ren.domElement);
function rsz(){ren.setPixelRatio(Math.min(devicePixelRatio,MOBILE?1.5:2));ren.setSize(innerWidth,innerHeight);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix();place(95,innerHeight-110)}
const HL=new THREE.HemisphereLight(0xdff2ff,0x7a8f5a,.85),MG=new THREE.Group(),ML=new THREE.PointLight(0xffb347,0,14);scene.add(HL,MG,ML);
const sun=new THREE.DirectionalLight(0xfff0cc,.85);sun.position.set(25,45,-9);sun.target.position.set(0,0,-24);scene.add(sun,sun.target);
sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-55,right:55,top:55,bottom:-55,far:140});sun.shadow.bias=-.0005;
const M=(c,o)=>new THREE.MeshLambertMaterial(Object.assign({color:c},o)),Bx=(w,h,d)=>new THREE.BoxGeometry(w,h,d);
function cv(w,h,f){const c=document.createElement('canvas');c.width=w;c.height=h;f(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;return t}
function lab(t,w,h,fs,col,bg){const c=document.createElement('canvas');c.width=512;c.height=Math.round(512*h/w);const g=c.getContext('2d');if(bg){g.fillStyle=bg;g.fillRect(0,0,512,c.height)}g.fillStyle=col;g.font='bold '+fs+'px sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(t,256,c.height/2);return new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c),transparent:!bg}))}
const T=[],cols=[]; // danh sách vật thể để bắn trúng / va chạm

