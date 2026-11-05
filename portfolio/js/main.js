/* Edit contact details here */
const CONTACT={email:"minahilmasood046@gmail.com",github:"https://github.com/minahilmasood208"};
const $=s=>document.querySelector(s);
$("#mail").href="mailto:"+CONTACT.email;$("#mail").textContent=CONTACT.email;
$("#social2").href=CONTACT.github;

/* Sound: synthesised with Web Audio (no files). Off until the visitor turns it on. */
const Snd=(()=>{let ctx,on=false,bus;
 /* Warm, soft palette: sine "bell" tones on a pentatonic scale, a touch of reverb, gently filtered air. */
 const setup=()=>{ctx=new AudioContext();bus=ctx.createGain();const lp=ctx.createBiquadFilter();lp.type="lowpass";lp.frequency.value=4500;const m=ctx.createGain();m.gain.value=.9;
  const len=ctx.sampleRate*1.8,ir=ctx.createBuffer(2,len,ctx.sampleRate);for(let c=0;c<2;c++){const d=ir.getChannelData(c);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.6)}
  const cv=ctx.createConvolver();cv.buffer=ir;const wet=ctx.createGain();wet.gain.value=.35;bus.connect(lp);lp.connect(m);lp.connect(cv);cv.connect(wet);wet.connect(m);m.connect(ctx.destination)};
 const bell=(f,at=0,v=.12,d=1.3)=>{const t=ctx.currentTime+at;[[1,1],[2.01,.22],[3.02,.07]].forEach(([k,a])=>{const o=ctx.createOscillator(),n=ctx.createGain();o.frequency.value=f*k;
  n.gain.setValueAtTime(.0001,t);n.gain.exponentialRampToValueAtTime(v*a,t+.008);n.gain.exponentialRampToValueAtTime(.0001,t+d/k);o.connect(n);n.connect(bus);o.start(t);o.stop(t+d+.05)})};
 const air=(t,f0,f1,v)=>{const b=ctx.createBuffer(1,ctx.sampleRate*t,ctx.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
  const s=ctx.createBufferSource();s.buffer=b;const f=ctx.createBiquadFilter();f.type="lowpass";f.Q.value=.7;const n=ctx.createGain(),n0=ctx.currentTime;
  f.frequency.setValueAtTime(f0,n0);f.frequency.exponentialRampToValueAtTime(f1,n0+t);n.gain.setValueAtTime(.0001,n0);n.gain.linearRampToValueAtTime(v,n0+t*.4);n.gain.exponentialRampToValueAtTime(.0001,n0+t);
  s.connect(f);f.connect(n);n.connect(bus);s.start()};
 const boom=(f0,f1,t,v)=>{const o=ctx.createOscillator(),n=ctx.createGain(),n0=ctx.currentTime;o.frequency.setValueAtTime(f0,n0);o.frequency.exponentialRampToValueAtTime(f1,n0+t);
  n.gain.setValueAtTime(.0001,n0);n.gain.exponentialRampToValueAtTime(v,n0+.02);n.gain.exponentialRampToValueAtTime(.0001,n0+t);o.connect(n);n.connect(bus);o.start();o.stop(n0+t+.05)};
 const P=[523.25,587.33,659.25,783.99,880,1046.5,1174.66,1318.5,1568];
 const play=fn=>()=>{if(on&&ctx)fn()};
 let last;addEventListener("pointerover",e=>{const t=e.target.closest(".about .chips li,.courses li,.str>div");if(t&&t!==last)Snd.pop();last=t});
 $("#snd").addEventListener("click",e=>{if(!ctx)setup();on=!on;ctx.resume();e.target.setAttribute("aria-pressed",on);e.target.textContent=on?"Sound on":"Sound off";if(on)Snd.chime()});
 const Snd={
  chime:play(()=>[0,2,4].forEach((i,k)=>bell(P[i],k*.11,.1,1.6))),
  pop:play(()=>bell(P[Math.floor(Math.random()*6)],0,.06,.55)),
  whoosh:play(()=>{air(1.1,250,1800,.22);bell(P[0],.35,.04,1.2)}),
  zoom:play(()=>{air(1.2,300,2600,.14);[0,2,3,5,6,8].forEach((i,k)=>bell(P[i],.1+k*.1,.07,1.1))}),
  zoomOut:play(()=>{air(1.2,2200,250,.14);[8,6,5,3,2,0].forEach((i,k)=>bell(P[i],k*.1,.06,1.1))}),
  fall:play(()=>{[7,6,5,3,2,0].forEach((i,k)=>bell(P[i],k*.11,.06,.9));air(.8,1500,200,.1)}),
  thud:play(()=>{boom(110,45,.45,.45);air(.25,600,150,.12);setTimeout(()=>on&&boom(85,45,.25,.2),280)}),
  success:play(()=>[0,2,3,5,7].forEach((i,k)=>bell(P[i],k*.09,.09,1.5))),
  error:play(()=>{bell(330,0,.08,.7);bell(262,.14,.08,.9)})};
 return Snd})();
gsap.registerPlugin(ScrollTrigger);
const mm=gsap.matchMedia();
mm.add("(prefers-reduced-motion: no-preference)",()=>{
  // Hero: one orchestrated name reveal
  document.querySelectorAll("[data-split]").forEach(el=>{const t=el.textContent;el.textContent="";
    [...t].forEach(c=>{const s=document.createElement("span");s.className="ch";s.textContent=c;el.append(s)})});
  gsap.from(".ch",{yPercent:110,duration:1.1,ease:"power4.out",stagger:.045,delay:.2});
  gsap.from(".role,.tag",{opacity:0,y:20,duration:.9,delay:.9,stagger:.15});

  // Wow: the name's weight swells under the cursor
  if(matchMedia("(pointer:fine)").matches)addEventListener("pointermove",e=>{document.querySelectorAll(".ch").forEach(c=>{const r=c.getBoundingClientRect(),d=Math.hypot(e.clientX-(r.left+r.width/2),e.clientY-(r.top+r.height/2));c.style.fontVariationSettings=`"wght" ${Math.round(200+600*Math.min(1,d/260))}`})});
  // Bubbles pop in once as they scroll into view
  const bub=".about .chips li,.courses li,.str>div";gsap.set(bub,{opacity:0,scale:.6});
  ScrollTrigger.batch(bub,{start:"top 92%",once:true,onEnter:b=>Snd.pop()||gsap.to(b,{opacity:1,scale:1,stagger:.05,duration:.55,ease:"back.out(1.7)",clearProps:"transform,opacity"})});
  const fit=s=>()=>Math.min(innerWidth/s.offsetWidth,innerHeight/s.offsetHeight);
  const pin=id=>({trigger:id,start:"top top",end:"+=550%",scrub:1,pin:true,invalidateOnRefresh:true});

  // Desktop: enter -> zoom into screenshot -> full screen -> return -> exit
  const lap=$(".laptop"),lapS=lap.querySelector(".screen");
  gsap.set(lap,{xPercent:-50,yPercent:-48,transformOrigin:"50% 48%",transformPerspective:1400});
  gsap.timeline({scrollTrigger:pin("#desktop"),defaults:{ease:"power2.inOut"}})
   .fromTo(lap,{y:"90vh",rotationX:55,scale:.8,opacity:0},{y:0,rotationX:0,scale:1,opacity:1,duration:1.4,ease:"power2.out"})
   .call(Snd.whoosh,null,.2)
   .call(Snd.bell,null,1.4)
   .to({},{duration:.4})
   .call(Snd.zoom)
   .to(lap,{scale:fit(lapS),duration:1.8})
   .to("#desktop .fx",{opacity:0,duration:.9},"<.2")
   .call(Snd.shimmer)
   .to({},{duration:.8})
   .call(Snd.back)
   .call(Snd.zoomOut)
   .to(lap,{scale:1,duration:1.8})
   .to("#desktop .fx",{opacity:1,duration:.9},"<.6")
   .call(Snd.up)
   .to({},{duration:.4})
   .to(lap,{y:"-90vh",opacity:0,duration:1});

  // Phone: enter upright -> tilt -> fall -> land horizontal -> zoom -> return
  const ph=$(".phone"),phS=ph.querySelector(".screen");
  gsap.set(ph,{xPercent:-50,yPercent:-50,transformPerspective:1200});
  gsap.timeline({scrollTrigger:pin("#mobile"),defaults:{ease:"power2.inOut"}})
   .fromTo(ph,{y:"85vh",scale:.7,rotationY:-35,opacity:0},{y:0,scale:1,rotationY:0,opacity:1,duration:1.3,ease:"power2.out"})
   .call(Snd.whoosh,null,.2)
   .call(Snd.buzz,null,1.4)
   .to({},{duration:.4})
   .call(Snd.fall)
   .to(ph,{rotation:-16,x:"-3vw",rotationX:12,duration:.9,ease:"power1.in"})
   .call(Snd.fall)
   .to(ph,{rotation:-90,y:"10vh",x:0,rotationX:0,duration:1.1,ease:"power3.in"})
   .call(Snd.thud)
   .to(ph,{y:"8vh",duration:.25,ease:"power1.out"})
   .to(".ground",{opacity:1,duration:.3},"<")
   .to({},{duration:.4})
   .call(Snd.shimmer)
   .to(ph,{rotation:0,x:0,y:0,scale:fit(phS),duration:1.8})
   .to("#mobile .fx",{opacity:0,duration:.9},"<.2")
   .call(Snd.shimmer)
   .to({},{duration:.8})
   .call(Snd.back)
   .call(Snd.zoomOut)
   .to(ph,{rotation:-90,y:"8vh",scale:1,duration:1.8})
   .to("#mobile .fx",{opacity:1,duration:.9},"<.6")
   .to({},{duration:.3});
});

// Contact form: front-end validation only (no backend)
const form=$("#form"),status=$("#status");
form.addEventListener("submit",e=>{e.preventDefault();let ok=true;
  [...form.elements].filter(f=>f.name).forEach(f=>{let msg="";const v=f.value.trim();
    if(!v)msg="Enter your "+f.name+".";
    else if(f.type==="email"&&!/^\S+@\S+\.\S+$/.test(v))msg="Enter a valid email like name@example.com.";
    else if(f.name==="message"&&v.length<10)msg="Write at least 10 characters.";
    f.parentElement.nextElementSibling.textContent=msg;if(msg)ok=false;f.setAttribute("aria-invalid",!!msg)});
  if(!ok){Snd.error();status.textContent="Fix the highlighted fields and send again.";Snd.error();return}
  const d=new FormData(form),href=`mailto:${CONTACT.email}?subject=${encodeURIComponent(d.get("subject"))}&body=${encodeURIComponent(d.get("message")+"\n\n— "+d.get("name")+" ("+d.get("email")+")")}`;
  status.innerHTML=`Demo mode: this site has no server, so nothing was sent. <a href="${href}" style="color:var(--gold)">Open in your email app</a> to send it.`;Snd.success();form.reset()});
form.addEventListener("input",Snd.key);
form.querySelector("button").addEventListener("pointerenter",Snd.sparkle);
