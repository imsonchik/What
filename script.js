const CONFIG={
  password:"QHEX",
  hints:["Это не слово из словаря.","Четыре буквы. Я называл их тебе лично.","Спроси у меня, я подскажу."],
  intro:"Кто-то решил украсть у зимы один вечер. Только ты можешь узнать, какой. Сотри иней пальцем — и всё станет ясно.",
  date:{month:11,day:13,hour:19,min:0},
  snow:{images:["snow1.png","snow2.png","snow3.png"],count:70,size:[16,46],speed:[35,140],spin:[0.3,2.2]}
};
const $=s=>document.querySelector(s),rnd=(a,b)=>a+Math.random()*(b-a);

const cv=$("#snow"),cx=cv.getContext("2d");let W,H,boost=1,DPR=Math.min(devicePixelRatio||1,2);
function resize(){W=innerWidth;H=innerHeight;cv.width=W*DPR;cv.height=H*DPR;cx.setTransform(DPR,0,0,DPR,0,0)}
addEventListener("resize",resize);resize();
const fb=document.createElement("canvas");fb.width=fb.height=64;
(function(c){c.translate(32,32);c.strokeStyle="#fff";c.lineWidth=3;c.lineCap="round";
 for(let i=0;i<6;i++){c.rotate(Math.PI/3);c.beginPath();c.moveTo(0,0);c.lineTo(0,26);c.moveTo(0,14);c.lineTo(7,20);c.moveTo(0,14);c.lineTo(-7,20);c.stroke()}})(fb.getContext("2d"));
const imgs=CONFIG.snow.images.map(src=>{const i=new Image();i.onload=()=>i.ok=true;i.src=src;return i});
const S=CONFIG.snow;
const flakes=Array.from({length:S.count},()=>({x:rnd(0,W),y:rnd(-H,H),s:rnd(...S.size),vy:rnd(...S.speed),
 spin:rnd(...S.spin)*(Math.random()<.5?-1:1),rot:rnd(0,6.28),amp:rnd(8,35),ph:rnd(0,6.28),i:Math.floor(rnd(0,imgs.length)),a:rnd(.6,1)}));
let last=performance.now(),T=0;
function frame(now){const dt=Math.min((now-last)/1000,.05);last=now;T+=dt;boost+=(1-boost)*dt*.8;
 cx.clearRect(0,0,W,H);
 for(const f of flakes){f.y+=f.vy*dt*boost;f.x+=Math.sin(T*.8+f.ph)*f.amp*dt;f.rot+=f.spin*dt*boost;
  if(f.y>H+60){f.y=-60;f.x=rnd(0,W)}if(f.x<-60)f.x=W+60;if(f.x>W+60)f.x=-60;
  const im=imgs[f.i],src=im&&im.ok?im:fb;
  cx.save();cx.globalAlpha=f.a;cx.translate(f.x,f.y);cx.rotate(f.rot);cx.drawImage(src,-f.s/2,-f.s/2,f.s,f.s);cx.restore()}
 requestAnimationFrame(frame)}
requestAnimationFrame(frame);

const input=$("#pass"),field=$("#field"),msg=$("#msg");let wrong=0,locked=false;
const phr=["слово, которое знаешь только ты…","ключ ото льда…","шёпотом, пожалуйста…"];let pi=0,ci=0,del=false;
(function ph(){const t=phr[pi];
 if(input.value||document.activeElement===input){input.placeholder="";return setTimeout(ph,500)}
 if(!del){ci++;if(ci>=t.length){del=true;input.placeholder=t;return setTimeout(ph,1600)}}
 else{ci--;if(ci<=0){del=false;ci=0;pi=(pi+1)%phr.length;input.placeholder="";return setTimeout(ph,300)}}
 input.placeholder=t.slice(0,ci)+"▏";setTimeout(ph,del?30:75)})();
input.addEventListener("input",()=>{field.classList.remove("bad");
 for(let i=0;i<3;i++){const s=document.createElement("span");s.className="spark";
  s.style.left=rnd(15,85)+"%";s.style.top="50%";s.style.setProperty("--dx",rnd(-25,25)+"px");field.appendChild(s);setTimeout(()=>s.remove(),1000)}});
function check(){if(locked)return;
 if(input.value.trim().toUpperCase()===CONFIG.password.toUpperCase()){
  locked=true;input.disabled=true;msg.textContent="";field.classList.add("ok");boost=5;
  setTimeout(()=>$("#s1").classList.add("melt"),800);
  setTimeout(()=>{$("#s1").classList.remove("active");$("#s2").classList.add("active");startS2()},2000)}
 else{msg.textContent=CONFIG.hints[Math.min(wrong,CONFIG.hints.length-1)];wrong++;
  field.classList.add("bad","shake");setTimeout(()=>field.classList.remove("shake"),520)}}
$("#go").onclick=check;input.addEventListener("keydown",e=>{if(e.key==="Enter")check()});

function typeText(el,text,cb){let i=0;(function n(){el.textContent=text.slice(0,++i);
 if(i<text.length)setTimeout(n,38);else{el.classList.add("done");cb&&cb()}})()}
function startS2(){typeText($("#intro"),CONFIG.intro,()=>{$("#win").classList.add("show");setTimeout(initFrost,60)});$("#intro").classList.add("type")}

function initFrost(){const c=$("#frost"),r=c.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);
 c.width=r.width*d;c.height=r.height*d;const g=c.getContext("2d");g.scale(d,d);
 const w=r.width,h=r.height,grad=g.createLinearGradient(0,0,w,h);
 grad.addColorStop(0,"#cfe3f7");grad.addColorStop(.5,"#e9f3ff");grad.addColorStop(1,"#b9d3ec");
 g.fillStyle=grad;g.fillRect(0,0,w,h);
 for(let i=0;i<500;i++){g.fillStyle=`rgba(255,255,255,${rnd(.2,.8)})`;g.beginPath();g.arc(rnd(0,w),rnd(0,h),rnd(.5,2.4),0,6.28);g.fill()}
 g.strokeStyle="rgba(255,255,255,.7)";g.lineWidth=1;
 for(let i=0;i<26;i++){let x=rnd(0,w),y=rnd(0,h);g.beginPath();g.moveTo(x,y);for(let k=0;k<5;k++){x+=rnd(-22,22);y+=rnd(-22,22);g.lineTo(x,y)}g.stroke()}
 g.fillStyle="#5a7da3";g.font="italic 500 1.35rem "+getComputedStyle(document.body).getPropertyValue("--serif");g.textAlign="center";
 g.fillText("сотри иней пальцем ❄",w/2,h/2+6);
 const cols=18,rows=10,seen=new Set();let px=null,done=false;
 function wipe(e){if(done||e.buttons===0&&e.pointerType==="mouse")return;
  const b=c.getBoundingClientRect(),x=e.clientX-b.left,y=e.clientY-b.top;
  g.globalCompositeOperation="destination-out";g.lineCap=g.lineJoin="round";g.lineWidth=54;g.beginPath();
  g.moveTo(px?px.x:x,px?px.y:y);g.lineTo(x,y);g.stroke();px={x,y};
  seen.add(Math.floor(x/w*cols)+"-"+Math.floor(y/h*rows));
  if(seen.size>cols*rows*.42){done=true;c.classList.add("gone");reveal()}}
 c.addEventListener("pointerdown",e=>{px=null;c.setPointerCapture(e.pointerId);wipe(e)});
 c.addEventListener("pointermove",wipe);c.addEventListener("pointerup",()=>px=null)}

function reveal(){boost=3;setTimeout(()=>$("#after").classList.add("show"),900);tick();setInterval(tick,1000)}
function tick(){const D=CONFIG.date,n=new Date();let t=new Date(n.getFullYear(),D.month-1,D.day,D.hour,D.min);
 if(t<n)t=new Date(n.getFullYear()+1,D.month-1,D.day,D.hour,D.min);
 let s=Math.floor((t-n)/1000);const d=Math.floor(s/86400);s%=86400;const h=Math.floor(s/3600);s%=3600;
 $("#count").textContent=`до встречи: ${d} д ${String(h).padStart(2,"0")} ч ${String(Math.floor(s/60)).padStart(2,"0")} м ${String(s%60).padStart(2,"0")} с`}
$("#yes").onclick=()=>{boost=6;$("#reply").textContent="Тогда до встречи. Только никому ни слова ❄"};
