/* Trạng thái game (S, p, K), danh sách súng W, âm thanh, hiển thị HUD. */
// trang thai
const W=[{n:'M4A1',mag:30,rate:.09,dmg:22,sp:.01,pel:1,rec:.014,rt:1.5,auto:1},{n:'M1887',mag:2,rate:.75,dmg:15,sp:.045,pel:8,rec:.07,rt:1.8,auto:0}];
const S={on:0,ct:0,stt:'menu',rp:0,tl:0,sc:0,cb:0,lk:-9,sp:0,run:0,lw:0,t:0,yaw:0,pitch:.08,cr:0,w:0,am:[30,2],rl:0,cd:0,mf:0,kick:0,mv:0,hits:0,shots:0,hs:0,kills:0};
const p={x:0,y:0,z:18,vy:0},K={w:0,a:0,s:0,d:0},mj={x:0,z:0};
const gh=(x,z)=>{let h=0;for(const c of cols)if(x>c.x0-.4&&x<c.x1+.4&&z>c.z0-.4&&z<c.z1+.4&&c.h>h)h=c.h;return h};
let ac;function snd(f,d,v){try{ac=ac||new AudioContext();const t=ac.currentTime,o=ac.createOscillator(),g=ac.createGain();o.type='sawtooth';o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(40,t+d);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(ac.destination);o.start();o.stop(t+d)}catch(e){}}
function hud(){const w=W[S.w],ab=$('ab');$('wn').textContent=w.n;$('am').textContent=S.rl?'NẠP':S.am[S.w];$('mg').textContent=S.rl?'':'/ '+w.mag;
 if(S.rl){ab.style.transition='none';ab.style.width='0%';void ab.offsetWidth;ab.style.transition='width '+w.rt+'s linear';ab.style.width='100%';ab.style.background='#19d3ff'}else{ab.style.transition='width .1s';ab.style.width=S.am[S.w]/w.mag*100+'%';ab.style.background=''}
 $('st').textContent='Hạ gục '+S.kills+' · Headshot '+S.hs+' · Chính xác '+(S.shots?Math.round(S.hits/S.shots*100):0)+'%'}

