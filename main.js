/* Khởi động và vòng lặp chính. Luôn nạp CUỐI CÙNG. */
addEventListener('resize',rsz);menuInit();netInit();rsz();hud();upd(0);
let last=performance.now();
(function lp(n){requestAnimationFrame(lp);const dt=Math.min((n-last)/1000,.05);last=n;S.t+=dt;
 if(S.on){upd(dt);dupd(dt);tick(dt)}
 else if(S.rp)rpTick(dt);
 else if(S.ct>0){S.ct-=dt;upd(0);dupd(dt);cdUpd()}
 else{dupd(dt);menuCam()}
 fxUpd(dt);if(NET.on)netTick(dt);animTick(dt);ren.render(scene,cam)})(last);

