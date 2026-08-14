import{W as ct,S as lt,A as ht,P as dt,a as B,M as x,b as h,C as E,c as I,B as V,V as P,d as C,e as ot,f as nt,G as v,D as Y,H as pt,g as ut,h as H,i as mt,j as $,I as at,k as wt,O as ft,l as gt,R as vt,m as q,n as M,o as _,T as W,p as X,L as yt,E as bt,q as _t,r as xt,F as Mt,s as St,t as $t}from"./three-BQ1_7Aob.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const n of o.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&s(n)}).observe(document,{childList:!0,subtree:!0});function e(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(i){if(i.ep)return;i.ep=!0;const o=e(i);fetch(i.href,o)}})();class kt{constructor(t){this.canvas=t;const e=new ct({canvas:t,antialias:!0,powerPreference:"high-performance",alpha:!1,stencil:!1});e.setPixelRatio(Math.min(window.devicePixelRatio||1,1.75)),e.setSize(window.innerWidth,window.innerHeight,!1),e.outputColorSpace=lt,e.toneMapping=ht,e.toneMappingExposure=1.05,e.shadowMap.enabled=!0,e.shadowMap.type=dt,e.setClearColor(656901,1),this.gl=e,this._onResize=this.resize.bind(this),window.addEventListener("resize",this._onResize),window.addEventListener("orientationchange",this._onResize)}resize(){const t=window.innerWidth,e=window.innerHeight;this.gl.setSize(t,e,!1),this.camera&&(this.camera.aspect=t/e,this.camera.updateProjectionMatrix())}attachCamera(t){this.camera=t,this.resize()}render(t,e){this.gl.render(t,e)}dispose(){window.removeEventListener("resize",this._onResize),window.removeEventListener("orientationchange",this._onResize),this.gl.dispose()}}class Pt{constructor(){this.systems=new Set,this.running=!1,this.last=0,this.acc=0,this.dt=1/60,this.elapsed=0,this._raf=0}add(t){this.systems.add(t)}remove(t){this.systems.delete(t)}start(){if(this.running)return;this.running=!0,this.last=performance.now();const t=e=>{if(!this.running)return;const s=Math.min(.1,(e-this.last)/1e3);for(this.last=e,this.acc+=s;this.acc>=this.dt;){this.elapsed+=this.dt;for(const i of this.systems)i.update?.(this.dt,this.elapsed);this.acc-=this.dt}for(const i of this.systems)i.lateUpdate?.(s,this.elapsed);for(const i of this.systems)i.render?.();this._raf=requestAnimationFrame(t)};this._raf=requestAnimationFrame(t)}stop(){this.running=!1,cancelAnimationFrame(this._raf)}}class Tt{constructor(){this.state={throttle:0,steer:0,brake:0,boost:0},this.pressed={action:!1,camera:!1,reset:!1,escape:!1},this.keys=new Set,this.touch={active:!1,base:{x:0,y:0},tip:{x:0,y:0}},this.hasTouch=matchMedia("(pointer: coarse)").matches,window.addEventListener("keydown",t=>this._kd(t)),window.addEventListener("keyup",t=>this._ku(t)),window.addEventListener("blur",()=>this.keys.clear()),this.hasTouch&&this._bindTouch()}_kd(t){if(t.repeat)return;const e=t.key.toLowerCase();this.keys.add(e),e==="e"&&(this.pressed.action=!0),e==="c"&&(this.pressed.camera=!0),e==="r"&&(this.pressed.reset=!0),e==="escape"&&(this.pressed.escape=!0)}_ku(t){this.keys.delete(t.key.toLowerCase())}_bindTouch(){window.addEventListener("touchstart",t=>{const e=t.changedTouches[0];e&&e.clientX<window.innerWidth/2&&(this.touch.active=!0,this.touch.base={x:e.clientX,y:e.clientY},this.touch.tip={x:e.clientX,y:e.clientY})},{passive:!0}),window.addEventListener("touchmove",t=>{if(!this.touch.active)return;const e=t.changedTouches[0];e&&(this.touch.tip={x:e.clientX,y:e.clientY})},{passive:!0}),window.addEventListener("touchend",()=>{this.touch.active=!1},{passive:!0})}update(){let t=0,e=0;(this.keys.has("w")||this.keys.has("arrowup"))&&(t+=1),(this.keys.has("s")||this.keys.has("arrowdown"))&&(t-=1),(this.keys.has("a")||this.keys.has("arrowleft"))&&(e-=1),(this.keys.has("d")||this.keys.has("arrowright"))&&(e+=1);const s=this.keys.has(" ")||this.keys.has("spacebar")?1:0,i=this.keys.has("shift")?1:0;if(this.touch.active){const n=this.touch.tip.x-this.touch.base.x,r=this.touch.tip.y-this.touch.base.y,c=60;e=O(e+n/c,-1,1),t=O(t-r/c,-1,1)}const o=navigator.getGamepads?.()??[];for(const n of o){if(!n)continue;const r=U(n.axes[0]||0),c=U(n.axes[1]||0);e=O(e+r,-1,1),t=O(t-c,-1,1),n.buttons[0]?.pressed&&(this.pressed.action=!0),n.buttons[3]?.pressed&&(this.pressed.camera=!0),n.buttons[9]?.pressed&&(this.pressed.reset=!0)}this.state.throttle=t,this.state.steer=e,this.state.brake=s,this.state.boost=i}clearOneShots(){this.pressed.action=!1,this.pressed.camera=!1,this.pressed.reset=!1,this.pressed.escape=!1}}function U(a,t=.15){return Math.abs(a)<t?0:a}function O(a,t,e){return Math.max(t,Math.min(e,a))}const At="modulepreload",Et=function(a,t){return new URL(a,t).href},Z={},A=function(t,e,s){let i=Promise.resolve();if(e&&e.length>0){const n=document.getElementsByTagName("link"),r=document.querySelector("meta[property=csp-nonce]"),c=r?.nonce||r?.getAttribute("nonce");i=Promise.allSettled(e.map(l=>{if(l=Et(l,s),l in Z)return;Z[l]=!0;const d=l.endsWith(".css"),g=d?'[rel="stylesheet"]':"";if(!!s)for(let b=n.length-1;b>=0;b--){const m=n[b];if(m.href===l&&(!d||m.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${l}"]${g}`))return;const p=document.createElement("link");if(p.rel=d?"stylesheet":At,d||(p.as="script"),p.crossOrigin="",p.href=l,c&&p.setAttribute("nonce",c),document.head.appendChild(p),d)return new Promise((b,m)=>{p.addEventListener("load",b),p.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${l}`)))})}))}function o(n){const r=new Event("vite:preloadError",{cancelable:!0});if(r.payload=n,window.dispatchEvent(r),!r.defaultPrevented)throw n}return i.then(n=>{for(const r of n||[])r.status==="rejected"&&o(r.reason);return t().catch(o)})},J=["site","departments","team","rover","sponsors","competitions","achievements","timeline","gallery","faq","recruitment","pois","missions","contact"],Lt=Object.assign({"../../content/achievements.json":()=>A(()=>import("./achievements-x1iEquwm.js"),[],import.meta.url),"../../content/competitions.json":()=>A(()=>import("./competitions-DXvTM4eP.js"),[],import.meta.url),"../../content/contact.json":()=>A(()=>import("./contact-B9Pzj2FG.js"),[],import.meta.url),"../../content/departments.json":()=>A(()=>import("./departments-DvCOadoK.js"),[],import.meta.url),"../../content/faq.json":()=>A(()=>import("./faq-CM_nI2_c.js"),[],import.meta.url),"../../content/gallery.json":()=>A(()=>import("./gallery-DvzHE8s4.js"),[],import.meta.url),"../../content/missions.json":()=>A(()=>import("./missions-C0FEl7P2.js"),[],import.meta.url),"../../content/pois.json":()=>A(()=>import("./pois-DAKlAKT-.js"),[],import.meta.url),"../../content/recruitment.json":()=>A(()=>import("./recruitment-Bn4T8ARu.js"),[],import.meta.url),"../../content/rover.json":()=>A(()=>import("./rover-3edcZe2W.js"),[],import.meta.url),"../../content/site.json":()=>A(()=>import("./site-DJLTuURq.js"),[],import.meta.url),"../../content/sponsors.json":()=>A(()=>import("./sponsors-B2cMGIoZ.js"),[],import.meta.url),"../../content/team.json":()=>A(()=>import("./team-DIQkQkfn.js"),[],import.meta.url),"../../content/timeline.json":()=>A(()=>import("./timeline-B2XKFPMX.js"),[],import.meta.url)});class Ct{#t={};#e=!1;async load(t=()=>{}){const e=J.length;let s=0;await Promise.all(J.map(async i=>{const o=Lt[`../../content/${i}.json`];if(!o)throw new Error(`Failed to resolve content/${i}.json`);this.#t[i]=await o(),s+=1,t(s/e,i)})),this.#e=!0}get ready(){return this.#e}get all(){return this.#t}get site(){return this.#t.site}get departments(){return this.#t.departments.departments}department(t){return this.departments.find(e=>e.id===t)}get team(){return this.#t.team}membersByDept(t){return this.team.members.filter(e=>e.department===t)}get rover(){return this.#t.rover}get sponsors(){return this.#t.sponsors}get competitions(){return this.#t.competitions}get achievements(){return this.#t.achievements.achievements}get timeline(){return this.#t.timeline.events}get gallery(){return this.#t.gallery.items}get faq(){return this.#t.faq.items}get recruitment(){return this.#t.recruitment}get pois(){return this.#t.pois}poi(t){return this.pois.pois.find(e=>e.id===t)}get missions(){return this.#t.missions.missions}get contact(){return this.#t.contact}}const R=new Ct;class Rt{#t=new Map;on(t,e){return this.#t.has(t)||this.#t.set(t,new Set),this.#t.get(t).add(e),()=>this.off(t,e)}off(t,e){const s=this.#t.get(t);s&&s.delete(e)}emit(t,e){const s=this.#t.get(t);if(s)for(const i of s)try{i(e)}catch(o){console.error(`[bus] handler for "${t}" threw:`,o)}}}const w=new Rt,F=new URLSearchParams(location.search),z={debug:F.has("debug"),a11y:F.has("a11y"),free:F.has("free"),nointro:F.has("nointro"),reducedMotion:matchMedia("(prefers-reduced-motion: reduce)").matches};function zt(...a){z.debug&&console.log("[dawn]",...a)}class It{constructor(t=800,e=220){this.size=t,this.segs=e,this.half=t/2;const s=e+1;this.heights=new Float32Array(s*s),this._buildHeights();const i=new B(t,t,e,e);i.rotateX(-Math.PI/2);const o=i.attributes.position;for(let n=0;n<o.count;n++)o.setY(n,this.heights[n]);i.computeVertexNormals(),this.geometry=i,this.material=new x({color:11033132,roughness:1,metalness:0,flatShading:!1}),this._paintVertexColors(),this.mesh=new h(this.geometry,this.material),this.mesh.receiveShadow=!0,this.mesh.name="mars-terrain"}_buildHeights(){const t=this.segs+1,e=1337,s=(n,r)=>{const c=Math.sin(n*127.1+r*311.7+e)*43758.5453;return c-Math.floor(c)},i=(n,r)=>{const c=Math.floor(n),l=Math.floor(r),d=n-c,g=r-l,u=s(c,l),p=s(c+1,l),b=s(c,l+1),m=s(c+1,l+1),f=d*d*(3-2*d),S=g*g*(3-2*g);return u*(1-f)*(1-S)+p*f*(1-S)+b*(1-f)*S+m*f*S},o=(n,r)=>{let c=1,l=1,d=0,g=0;for(let u=0;u<5;u++)d+=i(n*l,r*l)*c,g+=c,c*=.5,l*=2.02;return d/g};for(let n=0;n<t;n++)for(let r=0;r<t;r++){const c=r/(t-1)*2-1,l=n/(t-1)*2-1,d=(o(c*2.4,l*2.4)-.5)*14,g=(o(c*6.5+11,l*6.5-7)-.5)*5,u=(o(c*22+33,l*22+5)-.5)*1.2,p=Math.min(1,Math.hypot(c,l)),b=Math.pow(p,2.1)*10,m=Math.exp(-p*p*6)*-.9,f=.04,S=Math.exp(-(p*p)/(f*f))*1,T=(d+g+u+b+m)*(1-S)+S*0;this.heights[n*t+r]=T}}_paintVertexColors(){const t=this.segs+1,e=new Float32Array(t*t*3),s=new E(11033132),i=new E(6106388),o=new E(14061394),n=new E(7614996);for(let r=0;r<t;r++)for(let c=0;c<t;c++){const l=r*t+c,d=this.heights[l],g=this.heights[r*t+Math.max(0,c-1)],u=this.heights[r*t+Math.min(t-1,c+1)],p=this.heights[Math.max(0,r-1)*t+c],b=this.heights[Math.min(t-1,r+1)*t+c],m=Math.min(1,Math.hypot(u-g,b-p)*.6),f=c/(t-1)*2-1,S=r/(t-1)*2-1,T=Math.hypot(f,S),L=s.clone();L.lerp(i,m*.6),L.lerp(o,I.clamp((d+2)*.06,0,.45)),L.lerp(n,I.clamp((T-.7)*2,0,.7)),e[l*3]=L.r,e[l*3+1]=L.g,e[l*3+2]=L.b}this.geometry.setAttribute("color",new V(e,3)),this.material.vertexColors=!0}heightAt(t,e){const s=this.segs+1,i=this.size,o=(t+this.half)/i*(s-1),n=(e+this.half)/i*(s-1);if(o<0||n<0||o>s-1||n>s-1)return 0;const r=Math.floor(o),c=Math.floor(n),l=o-r,d=n-c,g=this.heights[c*s+r],u=this.heights[c*s+Math.min(s-1,r+1)],p=this.heights[Math.min(s-1,c+1)*s+r],b=this.heights[Math.min(s-1,c+1)*s+Math.min(s-1,r+1)],m=g*(1-l)+u*l,f=p*(1-l)+b*l;return m*(1-d)+f*d}normalAt(t,e,s=1){const i=this.heightAt(t-s,e),o=this.heightAt(t+s,e),n=this.heightAt(t,e-s),r=this.heightAt(t,e+s);return new P(i-o,2*s,n-r).normalize()}}const Dt=`
  varying vec3 vWorldDir;
  void main() {
    vWorldDir = normalize((modelMatrix * vec4(position, 0.0)).xyz);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,jt=`
  precision highp float;
  varying vec3 vWorldDir;
  uniform vec3 uHorizon;
  uniform vec3 uZenith;
  uniform vec3 uNadir;
  uniform vec3 uSun;
  uniform vec3 uSunColor;
  uniform float uTime;

  void main() {
    vec3 dir = normalize(vWorldDir);
    float h = clamp(dir.y * 0.5 + 0.5, 0.0, 1.0);
    // Height ramp: nadir -> horizon -> zenith
    vec3 lower = mix(uNadir, uHorizon, smoothstep(0.0, 0.5, h));
    vec3 upper = mix(uHorizon, uZenith, smoothstep(0.45, 1.0, h));
    vec3 col   = mix(lower, upper, step(0.5, h));

    // Sun disk + halo — Mars famously has a blue-tinted halo around the sun.
    float sun = max(dot(dir, normalize(uSun)), 0.0);
    float halo = pow(sun, 12.0) * 0.45;
    float disk = smoothstep(0.9985, 0.9997, sun);
    col += uSunColor * disk * 4.0;
    col += vec3(0.55, 0.7, 0.9) * halo * 0.35;   // blue halo characteristic of Mars

    // Subtle atmospheric grain to avoid banding.
    float grain = fract(sin(dot(dir.xy, vec2(12.9898, 78.233))) * 43758.5453);
    col += (grain - 0.5) * 0.008;

    gl_FragColor = vec4(col, 1.0);
  }
`;class qt{constructor(){const t=new C(4e3,48,32);this.uniforms={uHorizon:{value:new E(15243868)},uZenith:{value:new E(3808786)},uNadir:{value:new E(1772037)},uSun:{value:new P(.6,.45,-.4)},uSunColor:{value:new E(16765578)},uTime:{value:0}};const e=new ot({uniforms:this.uniforms,vertexShader:Dt,fragmentShader:jt,side:nt,depthWrite:!1});this.mesh=new h(t,e),this.mesh.name="sky"}setSunDirection(t){this.uniforms.uSun.value.copy(t).normalize()}update(t,e){this.uniforms.uTime.value=e}}class Bt{constructor(){this.group=new v,this.group.name="sun-rig",this.direction=new P(.55,.45,-.4).normalize(),this.key=new Y(16756856,2.4),this.key.position.copy(this.direction).multiplyScalar(200),this.key.castShadow=!0,this.key.shadow.mapSize.set(2048,2048),this.key.shadow.camera.near=.5,this.key.shadow.camera.far=500;const t=120;this.key.shadow.camera.left=-t,this.key.shadow.camera.right=t,this.key.shadow.camera.top=t,this.key.shadow.camera.bottom=-t,this.key.shadow.bias=-4e-4,this.key.shadow.normalBias=.4,this.rim=new Y(6981288,.35),this.rim.position.set(-this.direction.x,this.direction.y*.6,-this.direction.z).multiplyScalar(200),this.ambient=new pt(14264699,2757642,.45),this.group.add(this.key,this.rim,this.ambient)}followTarget(t,e){this.key.position.set(t+this.direction.x*200,this.direction.y*200,e+this.direction.z*200),this.key.target.position.set(t,0,e),this.key.target.updateMatrixWorld()}}const Wt=`
  attribute float aSeed;
  uniform float uTime;
  uniform float uSize;
  uniform float uArea;
  varying float vAlpha;

  void main() {
    vec3 p = position;
    float t = uTime * 0.15;
    p.x += sin(t * 0.6 + aSeed * 12.0) * 6.0;
    p.z += cos(t * 0.7 + aSeed * 8.0)  * 6.0;
    p.y += sin(t + aSeed * 4.0) * 0.6;

    // Wrap around the world extent for infinite scroll.
    p.x = mod(p.x + uArea * 0.5, uArea) - uArea * 0.5;
    p.z = mod(p.z + uArea * 0.5, uArea) - uArea * 0.5;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (300.0 / -mv.z);

    // Fade with distance.
    float dist = length(mv.xyz);
    vAlpha = smoothstep(220.0, 30.0, dist) * 0.55;
  }
`,Ot=`
  precision mediump float;
  varying float vAlpha;
  uniform vec3 uColor;
  void main() {
    // Soft round point.
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float a = smoothstep(0.5, 0.0, d) * vAlpha;
    if (a < 0.01) discard;
    gl_FragColor = vec4(uColor, a);
  }
`;class Ft{constructor({count:t=3500,area:e=800}={}){const s=new ut,i=new Float32Array(t*3),o=new Float32Array(t);for(let r=0;r<t;r++)i[r*3]=(Math.random()-.5)*e,i[r*3+1]=Math.random()*12+.3,i[r*3+2]=(Math.random()-.5)*e,o[r]=Math.random();s.setAttribute("position",new V(i,3)),s.setAttribute("aSeed",new V(o,1)),this.uniforms={uTime:{value:0},uSize:{value:8},uArea:{value:e},uColor:{value:new E(14262902)}};const n=new ot({uniforms:this.uniforms,vertexShader:Wt,fragmentShader:Ot,transparent:!0,depthWrite:!1,blending:H});this.points=new mt(s,n),this.points.frustumCulled=!1,this.points.name="dust-particles"}update(t,e){this.uniforms.uTime.value=e}}class Nt{constructor(t,e){this.renderer=t,this.sun=e,this.active=!1,this.intensity=0,this.target=0;const s=new C(300,32,24),i=new $({color:13141082,transparent:!0,opacity:0,side:nt,depthWrite:!1,fog:!1});this.mesh=new h(s,i),this.mesh.name="dust-storm-vol",this.mesh.frustumCulled=!1,w.on("storm:start",()=>this.start()),w.on("storm:end",()=>this.end())}start(){this.active=!0,this.target=1}end(){this.active=!1,this.target=0}followTarget(t,e){this.mesh.position.set(t,0,e)}update(t){this.intensity+=(this.target-this.intensity)*Math.min(1,t*.6),this.mesh.material.opacity=this.intensity*.62,this.sun&&(this.sun.key.intensity=I.lerp(2.4,.7,this.intensity),this.sun.rim.intensity=I.lerp(.35,.15,this.intensity)),this.renderer.gl.toneMappingExposure=I.lerp(1.05,.75,this.intensity)}}class Ht{constructor(t,{count:e=1200}={}){const s=new at(.5,0),i=s.attributes.position;for(let m=0;m<i.count;m++){const f=(Math.random()-.5)*.25;i.setXYZ(m,i.getX(m)*(1+f),i.getY(m)*(1+f*.6),i.getZ(m)*(1+f))}s.computeVertexNormals();const o=new x({color:9062950,roughness:.95,metalness:.02,flatShading:!0}),n=new wt(s,o,e);n.castShadow=!0,n.receiveShadow=!1,n.name="rock-field";const r=new ft,c=new gt(new Float32Array(e*3),3),l=new E(9062950),d=new E(3807756),g=new E(13205585),u=t.size/2-12;let p=0,b=0;for(;p<e&&b<e*6;){b++;const m=(Math.random()*2-1)*u,f=(Math.random()*2-1)*u;if(Math.hypot(m,f)<14)continue;const S=t.heightAt(m,f),T=.4+Math.random()*(Math.random()<.06?4.2:1.4);r.position.set(m,S+T*.35,f),r.rotation.set(Math.random()*Math.PI,Math.random()*Math.PI,Math.random()*Math.PI),r.scale.set(T,T*(.6+Math.random()*.6),T),r.updateMatrix(),n.setMatrixAt(p,r.matrix);const L=l.clone().lerp(d,Math.random()*.6).lerp(g,Math.random()*.25);c.setXYZ(p,L.r,L.g,L.b),p++}n.count=p,s.setAttribute("instanceColor",c),o.onBeforeCompile=m=>{m.vertexShader=`attribute vec3 instanceColor;
varying vec3 vInstanceColor;
`+m.vertexShader,m.vertexShader=m.vertexShader.replace("#include <begin_vertex>",`#include <begin_vertex>
vInstanceColor = instanceColor;`),m.fragmentShader=`varying vec3 vInstanceColor;
`+m.fragmentShader,m.fragmentShader=m.fragmentShader.replace("#include <color_fragment>",`#include <color_fragment>
diffuseColor.rgb *= vInstanceColor;`)},this.mesh=n,this.count=p,this.terrain=t}}class k{constructor(t,e){this.id=t.id,this.name=t.name,this.type=t.type,this.panel=t.panel,this.department=t.department||null,this.color=new E(t.color||"#f2a35d"),this.radius=t.radius||14,this.def=t;const[s,i]=t.position,o=e.heightAt(s,i);this.position=new P(s,o,i),this.group=new v,this.group.name=`poi:${this.id}`,this.group.position.copy(this.position);const n=new h(new vt(this.radius-.5,this.radius,64,1),new $({color:this.color,transparent:!0,opacity:.25,side:q,depthWrite:!1}));n.rotation.x=-Math.PI/2,n.position.y=.05,this.group.add(n),this.halo=n;const r=10,c=new h(new M(.15,.15,r,6,1,!0),new $({color:this.color,transparent:!0,opacity:.55,side:q,depthWrite:!1,blending:H}));c.position.y=r/2,this.group.add(c),this.pillar=c,this.labelWorldPos=new P;const l=this._buildStructure();l&&this.group.add(l)}_buildStructure(){return null}update(t,e){const s=.85+.15*Math.sin(e*1.4+this.position.x);this.pillar.material.opacity=.4*s+.15,this.halo.material.opacity=.18*s+.08}distanceTo(t){const e=t.x-this.position.x,s=t.z-this.position.z;return Math.hypot(e,s)}}const y={panel(a){return new x({color:a,roughness:.55,metalness:.35})},glow(a,t=.5){return new $({color:a,transparent:!0,opacity:t,blending:H,depthWrite:!1})},metal(a=12633804){return new x({color:a,roughness:.35,metalness:.85})},matte(a=13880772){return new x({color:a,roughness:.9,metalness:.05})}};class Gt extends k{_buildStructure(){const t=new v,e=new h(new M(this.radius-2,this.radius-2,.4,6),y.matte(6971480));e.position.y=.2,e.receiveShadow=!0,t.add(e);const s=new h(new M(.05,.05,6),y.metal(11184810));s.position.set(0,3,-2.5),s.castShadow=!0,t.add(s);const i=new h(new B(1.6,1),new $({color:this.color,side:q}));return i.position.set(.8,5.2,-2.5),t.add(i),t}}class Vt extends k{_buildStructure(){const t=new v,e=new h(new M(6,6.5,3,6),y.panel(2566962));e.position.y=1.5,e.castShadow=!0,e.receiveShadow=!0,t.add(e);const s=new h(new C(4.5,32,16,0,Math.PI*2,0,Math.PI/2),y.matte(14075313));s.position.y=3,s.castShadow=!0,t.add(s);for(let o=0;o<3;o++){const n=new h(new M(.04,.04,4),y.metal(10265519));n.position.set(Math.cos(o*2.09)*1.4,6,Math.sin(o*2.09)*1.4),t.add(n)}const i=new h(new W(6.1,.08,8,40),y.glow(this.color,.75));return i.rotation.x=Math.PI/2,i.position.y=3.02,t.add(i),t}}class Xt extends k{_buildStructure(){const t=new v,e=new h(new _(14,.2,10),y.matte(10129280));e.position.y=.1,e.receiveShadow=!0,t.add(e);for(let i=-6;i<=6;i+=2){const o=new h(new W(5,.15,8,32,Math.PI),y.metal(10265519));o.rotation.z=Math.PI/2,o.rotation.y=Math.PI/2,o.position.set(i,5,0),o.castShadow=!0,t.add(o)}const s=new _(14,5,.2);for(const i of[-5,5]){const o=new h(s,y.matte(12562592));o.position.set(0,2.5,i),t.add(o)}return t}}class Yt extends k{_buildStructure(){const t=new v,e=new h(new M(2.4,2.8,1.2,24),y.panel(1975082));e.position.y=.6,e.castShadow=!0,e.receiveShadow=!0,t.add(e);const s=new h(new W(2.42,.05,8,48),y.glow(this.color,.9));s.rotation.x=Math.PI/2,s.position.y=1.22,t.add(s);const i=new h(new M(.6,2.2,20,24,1,!0),new $({color:this.color,transparent:!0,opacity:.08,side:q,depthWrite:!1,blending:H}));return i.position.y=10.5,t.add(i),t}}class Ut extends k{_buildStructure(){const t=new v,e=new h(new _(7,4,7),y.panel(2040875));e.position.y=2,e.castShadow=!0,e.receiveShadow=!0,t.add(e);const s=new h(new _(7.4,.4,7.4),y.panel(1119514));s.position.y=4.2,s.castShadow=!0,t.add(s);const i=new $({color:this.color,transparent:!0,opacity:.9});for(const n of[{p:[3.51,2.4,0],r:[0,Math.PI/2,0]},{p:[-3.51,2.4,0],r:[0,-Math.PI/2,0]},{p:[0,2.4,3.51],r:[0,0,0]},{p:[0,2.4,-3.51],r:[0,Math.PI,0]}]){const r=new h(new B(6,.35),i);r.position.set(...n.p),r.rotation.set(...n.r),t.add(r)}const o=new h(new C(.35,12,8),y.glow(this.color,1));return o.position.y=4.7,t.add(o),t}}class Zt extends k{_buildStructure(){const t=new v,e=new h(new _(20,.1,20),y.matte(13208664));e.position.y=.05,e.receiveShadow=!0,t.add(e);for(let i=-10;i<=10;i+=5){for(const o of[-10,10]){const n=new h(new M(.08,.08,1.4),y.metal(9080725));n.position.set(i,.7,o),t.add(n)}for(const o of[-10,10]){const n=new h(new M(.08,.08,1.4),y.metal(9080725));n.position.set(o,.7,i),t.add(n)}}const s=new x({color:16742958,roughness:.6});for(let i=0;i<6;i++){const o=new h(new X(.4,1,12),s);o.position.set(-8+i*3.2,.5,Math.sin(i)*4),o.castShadow=!0,t.add(o)}return t}}class Jt extends k{_buildStructure(){const t=new v,e=18;for(const[o,n]of[[1,1],[-1,1],[1,-1],[-1,-1]]){const r=new h(new M(.08,.12,e),y.metal(10725808));r.position.set(o*.9,e/2,n*.9),t.add(r)}for(let o=1;o<e-1;o+=1.5){const n=new h(new _(2.3,.06,.06),y.metal(8159882));n.position.set(0,o,-.9),t.add(n);const r=n.clone();r.position.set(0,o,.9),t.add(r);const c=new h(new _(.06,.06,2.3),y.metal(8159882));c.position.set(-.9,o,0),t.add(c);const l=c.clone();l.position.set(.9,o,0),t.add(l)}const s=new h(new C(1.6,24,12,0,Math.PI*2,0,Math.PI/2.4),y.matte(14078409));s.rotation.x=-Math.PI/3,s.position.y=e+.3,s.castShadow=!0,t.add(s);const i=new h(new C(.18,8,8),new $({color:16723759}));return i.position.y=e+2,t.add(i),this._bulb=i,t}update(t,e){super.update(t,e),this._bulb&&(this._bulb.material.opacity=.6+.4*(Math.sin(e*4)*.5+.5))}}class Qt extends k{_buildStructure(){const t=new v,e=new x({color:1124682,roughness:.2,metalness:.6,emissive:727604,emissiveIntensity:.4}),s=y.metal(11910081);for(let i=0;i<4;i++)for(let o=0;o<3;o++){const n=new h(new _(2.6,.06,1.6),e);n.rotation.x=-Math.PI/6,n.position.set(-4.5+i*3,1.3,-2+o*2.4),n.castShadow=!0,n.receiveShadow=!0,t.add(n);const r=new h(new M(.06,.06,1.3),s);r.position.set(n.position.x,.65,n.position.z),t.add(r)}return t}}class Kt extends k{_buildStructure(){const t=new v,e=new at(5,1),s=new x({color:10465992,roughness:.15,metalness:.2,transparent:!0,opacity:.35,envMapIntensity:1,side:q}),i=new h(e,s);i.position.y=3,i.castShadow=!0,i.scale.y=.65,t.add(i);const o=new yt(new bt(e),new _t({color:this.color,transparent:!0,opacity:.6}));return o.position.y=3,o.scale.y=.65,t.add(o),t}}class te extends k{_buildStructure(){const t=new v,e=new h(new _(14,4.5,8),y.panel(1843239));e.position.y=2.25,e.castShadow=!0,e.receiveShadow=!0,t.add(e);const s=new h(new _(14.4,.4,8.4),new $({color:this.color}));s.position.y=4.6,t.add(s);const i=new h(new B(6,1.3),y.matte(14932167));return i.position.set(0,4.6,4.05),t.add(i),t}}class ee extends k{_buildStructure(){const t=new v,e=new h(new M(9,9,.3,32),y.matte(4735288));e.position.y=.15,e.receiveShadow=!0,t.add(e);const s=[{color:14008442,h:6,r:1.1,x:0},{color:15120732,h:4.6,r:.9,x:-4},{color:13003550,h:3.8,r:.85,x:4}];for(const i of s){const o=new h(new M(i.r*.55,i.r,i.h,4),new x({color:i.color,roughness:.4,metalness:.6}));o.position.set(i.x,i.h/2+.3,0),o.castShadow=!0,t.add(o)}return t}}class se extends k{_buildStructure(){const t=new v;for(let e=0;e<6;e++){const s=new h(new _(.4,4.5,2.6),y.matte(9139297));s.position.set(-8+e*3.2,2.25,0),s.castShadow=!0,t.add(s);const i=new h(new B(2.2,3.4),new $({color:this.color,transparent:!0,opacity:.85}));i.position.set(-8+e*3.2,2.5,1.31),t.add(i)}return t}}class ie extends k{_buildStructure(){const t=new v;for(let s=0;s<4;s++){const i=new h(new _(6-s*1.2,.9,6-s*1.2),y.matte(s===3?14725738:9074022));i.position.y=.45+s*.9,i.castShadow=!0,i.receiveShadow=!0,t.add(i)}const e=new h(new X(.6,2,6),new x({color:15979404,roughness:.2,metalness:.9,emissive:4465152,emissiveIntensity:.4}));return e.position.y=5,e.castShadow=!0,t.add(e),t}}class oe extends k{_buildStructure(){const t=new v;for(let e=0;e<6;e++){const s=new h(new M(.1,.1,2),y.metal(14209994));s.position.set(-7+e*2.8,1,0),s.castShadow=!0,t.add(s);const i=new h(new C(.22,12,8),new $({color:this.color}));i.position.set(-7+e*2.8,2.1,0),t.add(i)}return t}}class ne extends k{_buildStructure(){const t=new v,e=new h(new C(2.6,32,20),y.matte(1975082));e.position.y=3,e.castShadow=!0,t.add(e);const s=3;for(let i=0;i<s;i++){const o=3.1+i*.4,n=new h(new W(o,.05,8,48),y.glow(this.color,.6));n.position.y=3,n.rotation.x=Math.PI/2+i*.5,t.add(n)}return t}}class ae extends k{_buildStructure(){const t=new v,e=new h(new _(4.5,3,3.5),y.panel(2435891));e.position.y=1.5,e.castShadow=!0,e.receiveShadow=!0,t.add(e);const s=new h(new _(3,.9,.2),new $({color:this.color}));return s.position.set(0,3.7,1.8),t.add(s),t}}class rt extends k{_buildStructure(){const t=new v,e=new h(new M(6,6,.4,32),y.matte(4208685));e.position.y=.2,e.receiveShadow=!0,t.add(e);const s=6;for(let i=0;i<s;i++){const o=i/s*Math.PI*2,n=new h(new M(.35,.5,3.6+Math.random()*1.2,6),y.matte(13747376));n.position.set(Math.cos(o)*3.6,2,Math.sin(o)*3.6),n.castShadow=!0,t.add(n);const r=new h(new C(.25,12,8),new $({color:this.color}));r.position.copy(n.position),r.position.y+=2,t.add(r)}return t}}const re={landing:Gt,hub:Vt,rover:Xt,arm:Yt,department:Ut,range:Zt,landmark:null,competition:te,sponsors:ee,gallery:se,achievements:ie,timeline:oe,media:ne,recruitment:ae,team:rt};function ce(a,t){let e=re[a.type];return a.type==="landmark"&&(a.id==="communication-tower"?e=Jt:a.id==="solar-farm"?e=Qt:a.id==="research-dome"?e=Kt:e=rt),e||(e=k),new e(a,t)}class le{constructor(t,e){this.pois=[],this.group=new v,this.group.name="poi-registry";const s=t.pois.pois,i=t.pois.radius||14;for(const o of s){const n={...o,radius:i},r=ce(n,e);this.pois.push(r),this.group.add(r.group)}}byId(t){return this.pois.find(e=>e.id===t)}update(t,e){for(const s of this.pois)s.update(t,e)}nearest(t,e=1/0){let s=null,i=e;for(const o of this.pois){const n=o.distanceTo(t);n<i&&(i=n,s=o)}return{poi:s,distance:i}}}class he{constructor(t,e){this.scene=new xt,this.scene.fog=new Mt(2757640,.005),this.scene.background=new E(1707272),this.terrain=new It(800,220),this.scene.add(this.terrain.mesh),this.sky=new qt,this.scene.add(this.sky.mesh),this.sun=new Bt,this.scene.add(this.sun.group),this.sky.setSunDirection(this.sun.direction),this.rocks=new Ht(this.terrain,{count:1100}),this.scene.add(this.rocks.mesh),this.dust=new Ft({count:3500,area:800}),this.scene.add(this.dust.points),this.storm=new Nt(t,this.sun),this.scene.add(this.storm.mesh),this.pois=new le(e,this.terrain),this.scene.add(this.pois.group)}update(t,e,s){this.sky.update(t,e),this.dust.update(t,e),this.pois.update(t,e),this.storm.update(t),s&&(this.sun.followTarget(s.x,s.z),this.storm.followTarget(s.x,s.z))}}class de{constructor(){const t={shell:new x({color:14209994,roughness:.45,metalness:.55}),accent:new x({color:13003550,roughness:.4,metalness:.5}),joint:new x({color:2764598,roughness:.4,metalness:.75}),grip:new x({color:1842980,roughness:.7,metalness:.15})};this.root=new v,this.joints={};const e=new h(new M(.18,.22,.1,20),t.joint);e.castShadow=!0,this.root.add(e);const s=new v;s.name="shoulder-yaw",s.position.y=.08,this.root.add(s),this.joints["shoulder-yaw"]=s;const i=new h(new C(.13,20,16),t.joint);i.castShadow=!0,s.add(i);const o=new v;o.name="shoulder-pitch",o.position.y=.06,s.add(o),this.joints["shoulder-pitch"]=o;const n=new h(new _(.14,.9,.12),t.shell);n.position.y=.45,n.castShadow=!0,o.add(n);const r=new h(new _(.145,.12,.125),t.accent);r.position.y=.25,o.add(r);const c=new v;c.name="elbow",c.position.y=.9,o.add(c),this.joints.elbow=c;const l=new h(new C(.1,16,12),t.joint);l.castShadow=!0,c.add(l);const d=new h(new _(.11,.75,.1),t.shell);d.position.y=.4,d.castShadow=!0,c.add(d);const g=new h(new _(.115,.1,.105),t.accent);g.position.y=.6,c.add(g);const u=new v;u.name="wrist-pitch",u.position.y=.78,c.add(u),this.joints["wrist-pitch"]=u;const p=new h(new C(.08,16,12),t.joint);p.castShadow=!0,u.add(p);const b=new v;b.name="wrist-roll",b.position.y=.06,u.add(b),this.joints["wrist-roll"]=b;const m=new h(new M(.06,.06,.14,16),t.shell);m.position.y=.09,b.add(m);const f=new v;f.name="gripper",f.position.y=.18,b.add(f),this.joints.gripper=f;const S=new h(new _(.02,.16,.05),t.grip);S.name="finger-a",S.position.set(.04,.09,0),S.castShadow=!0,f.add(S);const T=S.clone();T.name="finger-b",T.position.set(-.04,.09,0),f.add(T),f.userData.fingerA=S,f.userData.fingerB=T,this.setPose({"shoulder-yaw":0,"shoulder-pitch":-.9,elbow:1.4,"wrist-pitch":-.4,"wrist-roll":0,gripper:.5})}setJoint(t,e){const s=this.joints[t];if(s){if(t==="shoulder-yaw")s.rotation.y=e;else if(t==="shoulder-pitch")s.rotation.z=e;else if(t==="elbow")s.rotation.z=e;else if(t==="wrist-pitch")s.rotation.z=e;else if(t==="wrist-roll")s.rotation.y=e;else if(t==="gripper"){const i=.02+e*.09;s.userData.fingerA.position.x=i,s.userData.fingerB.position.x=-i}this._pose={...this._pose||{},[t]:e}}}setPose(t){for(const[e,s]of Object.entries(t))this.setJoint(e,s)}idle(t){if(this._locked)return;const e=t;this.setJoint("shoulder-yaw",Math.sin(e*.3)*.15),this.setJoint("wrist-roll",Math.sin(e*.7)*.4)}lock(t){this._locked=t}get pose(){return{...this._pose||{}}}}class pe{constructor(){this.root=new v,this.root.name="rover-root",this._buildChassis(),this._buildWheels(),this._buildMast(),this._buildSolarPanels(),this._buildAntenna(),this._buildLights(),this.arm=new de,this.arm.root.position.set(.6,.55,-.9),this.arm.root.name="arm-root",this.chassis.add(this.arm.root),this.wheelBaseX=1.8,this.wheelBaseZ=1.3,this.wheelRadius=.32,this.velocity=new P,this.heading=0,this.speed=0,this.steer=0}_buildChassis(){const t=new v;t.name="chassis";const e=new x({color:15131354,roughness:.55,metalness:.25}),s=new x({color:13003550,roughness:.5,metalness:.3}),i=new x({color:2764598,roughness:.4,metalness:.7}),o=new h(new _(2.3,.55,1.5),e);o.position.y=.6,o.castShadow=!0,o.receiveShadow=!0,t.add(o);const n=new h(new _(2.1,.08,1.3),i);n.position.y=.9,n.castShadow=!0,t.add(n);for(const l of[-.77,.77]){const d=new h(new _(2.35,.11,.03),s);d.position.set(0,.55,l),t.add(d)}const r=new h(new _(.15,.35,1.55),i);r.position.set(1.2,.55,0),r.castShadow=!0,t.add(r);const c=new h(new _(.55,.35,.55),e);c.position.set(-.75,1.13,0),c.castShadow=!0,t.add(c);for(let l=0;l<5;l++){const d=new h(new _(.4,.02,.05),i);d.position.set(-1,.9,-.55+l*.2),t.add(d)}this.chassis=t,this.root.add(t)}_buildWheels(){const t=new x({color:2830132,roughness:.75,metalness:.15}),e=new x({color:14209994,roughness:.4,metalness:.7});this.bogies={},this.wheels={};for(const s of["left","right"]){const i=new v;i.name=`bogie-${s}`;const o=s==="left"?-1:1;i.position.set(0,.35,o*.75),this.chassis.add(i),this.bogies[s]=i;const n=[{name:"f",x:1},{name:"m",x:0},{name:"r",x:-1}];for(const r of n){const c=new h(new _(Math.abs(r.x)+.2,.06,.06),new x({color:9080725,roughness:.55,metalness:.55}));c.position.set(r.x*.5,0,0),i.add(c);const l=new v;l.name=`wheel-pivot-${r.name}${s[0]}`,l.position.set(r.x,-.35,0),i.add(l);const d=new h(new M(this.wheelRadius,this.wheelRadius,.22,24),t);d.rotation.x=Math.PI/2,d.castShadow=!0,l.add(d);const g=new h(new W(this.wheelRadius*.65,.02,8,20),e);g.rotation.x=Math.PI/2,l.add(g);for(let u=0;u<6;u++){const p=new h(new _(.02,this.wheelRadius*1.1,.02),e);p.rotation.z=u/6*Math.PI*2,l.add(p)}for(let u=0;u<8;u++){const p=new h(new _(.06,.24,.03),new x({color:1711136,roughness:.95}));p.rotation.x=Math.PI/2,p.rotation.z=u/8*Math.PI*2,p.position.copy(new P(Math.cos(u/8*Math.PI*2)*this.wheelRadius,0,Math.sin(u/8*Math.PI*2)*this.wheelRadius)),l.add(p)}l.userData.tire=d,l.userData.isSteered=r.name!=="m",l.userData.rowName=`${r.name}${s[0]}`,l.name=`wheel-${r.name}${s[0]}`,this.wheels[`${r.name}${s[0]}`]=l}}}_buildMast(){const t=new v;t.name="mast",t.position.set(.45,.95,0),this.chassis.add(t);const e=new h(new M(.06,.06,1.1),new x({color:10725808,roughness:.45,metalness:.6}));e.position.y=.55,e.castShadow=!0,t.add(e);const s=new h(new _(.5,.22,.28),new x({color:2764598,roughness:.4,metalness:.7}));s.position.y=1.2,s.castShadow=!0,t.add(s);const i=new $({color:8376532});for(const o of[-.12,.12]){const n=new h(new M(.06,.06,.05,20),i);n.rotation.x=Math.PI/2,n.position.set(o,1.2,.16),n.name="camera-eye",t.add(n)}}_buildSolarPanels(){const t=new x({color:1124682,roughness:.2,metalness:.6,emissive:727604,emissiveIntensity:.35});for(const e of[-.9,.9]){const s=new h(new _(1.4,.03,.6),t);s.position.set(-.1,.98,e),s.castShadow=!0,s.rotation.z=e>0?-.14:.14,this.chassis.add(s);for(let i=1;i<4;i++){const o=new h(new _(.005,.035,.58),new $({color:6981288,transparent:!0,opacity:.5}));o.position.set(-.7+i*.35,.99,e),o.rotation.z=s.rotation.z,this.chassis.add(o)}}}_buildAntenna(){const t=new v;t.position.set(-.9,1,.3);const e=new h(new M(.02,.02,.9),new x({color:14078409,roughness:.35,metalness:.85}));e.position.y=.45,e.castShadow=!0,t.add(e);const s=new h(new C(.05,12,8),new $({color:16735022}));s.position.y=.95,t.add(s),this.chassis.add(t)}_buildLights(){const t=new $({color:16774088});for(const e of[-.4,.4]){const s=new h(new M(.06,.06,.03,16),t);s.rotation.z=Math.PI/2,s.position.set(1.28,.55,e),this.chassis.add(s)}this.headlamp=new St(16770744,.9,22,Math.PI/6,.45,1),this.headlamp.position.set(1.25,.6,0),this.headlamp.target.position.set(3,.4,0),this.chassis.add(this.headlamp,this.headlamp.target),this.headlamp.castShadow=!1}applySteering(t){this.steer=t;for(const e of["fl","fr"])this.wheels[e].rotation.y=t;for(const e of["rl","rr"])this.wheels[e].rotation.y=-t*.65}rollWheels(t){for(const e in this.wheels){const s=this.wheels[e];s.userData.tire.rotation.y+=t}}}new P;class ue{constructor(t,e){this.rover=t,this.terrain=e,this.maxSpeed=8,this.reverseSpeed=4,this.accel=6,this.brakeDecel=12,this.rolling=1.6,this.maxSteer=.55,this.steerSpeed=3,this.steerAngle=0,this._up=new P(0,1,0)}reset(t=0,e=0){this.rover.root.position.set(t,this.terrain.heightAt(t,e)+this.rover.wheelRadius+.2,e),this.rover.root.rotation.set(0,0,0),this.rover.heading=0,this.rover.speed=0,this.rover.velocity.set(0,0,0),this.steerAngle=0,this.rover.applySteering(0)}update(t,e){const s=this.rover,i=e.throttle>0?e.throttle*this.maxSpeed:e.throttle*this.reverseSpeed,o=1+.5*e.boost,n=i*o;e.brake>0?s.speed=D(s.speed,0,this.brakeDecel*t):Math.sign(n)===Math.sign(s.speed)||s.speed===0?s.speed=D(s.speed,n,this.accel*t):s.speed=D(s.speed,n,this.accel*2*t),Math.abs(e.throttle)<.05&&e.brake===0&&(s.speed=D(s.speed,0,this.rolling*t));const r=e.steer*this.maxSteer;this.steerAngle=D(this.steerAngle,r,this.steerSpeed*t),s.applySteering(this.steerAngle);const c=s.wheelBaseX,l=s.speed/c*Math.tan(this.steerAngle);s.heading+=l*t;const d=Math.cos(s.heading),g=Math.sin(s.heading);s.root.position.x+=d*s.speed*t,s.root.position.z+=g*s.speed*t,s.velocity.set(d*s.speed,0,g*s.speed);const u=this.terrain.half-6;s.root.position.x=Q(s.root.position.x,-u,u),s.root.position.z=Q(s.root.position.z,-u,u),this._settleOnTerrain();const p=s.speed*t/s.wheelRadius;s.rollWheels(p)}_settleOnTerrain(){const t=this.rover,e=[],s=[[t.wheelBaseX/2,0,t.wheelBaseZ/2],[0,0,t.wheelBaseZ/2],[-t.wheelBaseX/2,0,t.wheelBaseZ/2],[t.wheelBaseX/2,0,-t.wheelBaseZ/2],[0,0,-t.wheelBaseZ/2],[-t.wheelBaseX/2,0,-t.wheelBaseZ/2]],i=Math.cos(t.heading),o=Math.sin(t.heading);let n=0;for(const[m,,f]of s){const S=t.root.position.x+m*i-f*o,T=t.root.position.z+m*o+f*i,L=this.terrain.heightAt(S,T);e.push(L),n+=L}n/=e.length,t.root.position.y=n+t.wheelRadius+.15;const r=(e[0]+e[3])*.5,c=(e[2]+e[5])*.5,l=Math.atan2(r-c,t.wheelBaseX),d=(e[0]+e[1]+e[2])/3,g=(e[3]+e[4]+e[5])/3,u=Math.atan2(g-d,t.wheelBaseZ);t.root.rotation.set(0,-t.heading,0),t.chassis.rotation.set(-l,0,-u);const p=(e[0]-e[2])*.35,b=(e[3]-e[5])*.35;t.bogies?.left&&(t.bogies.left.rotation.z=-p),t.bogies?.right&&(t.bogies.right.rotation.z=-b)}}function D(a,t,e){const s=t-a;return Math.abs(s)<=e?t:a+Math.sign(s)*e}function Q(a,t,e){return Math.max(t,Math.min(e,a))}class me{constructor(t){this.engine=t,this._built=!1}_build(){const t=this.engine.ctx;if(!t)return;const e=t.createOscillator();e.type="sawtooth",e.frequency.value=60;const s=t.createOscillator();s.type="sine",s.frequency.value=30;const i=t.createGain();i.gain.value=0;const o=t.createBiquadFilter();o.type="lowpass",o.frequency.value=380,o.Q.value=.7,e.connect(o),s.connect(o),o.connect(i),i.connect(this.engine.bus("sfx")),e.start(),s.start(),this.osc=e,this.sub=s,this.gain=i,this.filt=o,this._built=!0}update(t,e){if(!this.engine.ready||(this._built||this._build(),!this._built))return;const s=Math.min(1,Math.abs(e)/8),i=.12*s,o=55+s*140,n=320+s*900,r=this.engine.ctx.currentTime;this.gain.gain.setTargetAtTime(i,r,.15),this.osc.frequency.setTargetAtTime(o,r,.2),this.filt.frequency.setTargetAtTime(n,r,.2)}}const j=new P,K=new P;class we{constructor(){this.camera=new $t(58,window.innerWidth/window.innerHeight,.1,3e3),this.camera.position.set(-8,4,8),this.camera.lookAt(0,1,0),this.mode="follow",this.target=null,this.inspectionTarget=null,this._blendT=1,this._blendDur=.7,this._fromPos=new P,this._fromLook=new P,this._toPos=new P,this._toLook=new P,this._orbit={yaw:.6,pitch:.42,dist:9},this._orbitDragging=!1,this._orbitLastX=0,this._orbitLastY=0,window.addEventListener("mousedown",t=>{this.mode==="orbit"&&t.button===0&&(this._orbitDragging=!0,this._orbitLastX=t.clientX,this._orbitLastY=t.clientY)}),window.addEventListener("mousemove",t=>{if(!this._orbitDragging)return;const e=t.clientX-this._orbitLastX,s=t.clientY-this._orbitLastY;this._orbitLastX=t.clientX,this._orbitLastY=t.clientY,this._orbit.yaw-=e*.005,this._orbit.pitch=I.clamp(this._orbit.pitch-s*.005,.1,1.2)}),window.addEventListener("mouseup",()=>{this._orbitDragging=!1}),window.addEventListener("wheel",t=>{this.mode==="orbit"&&(this._orbit.dist=I.clamp(this._orbit.dist+t.deltaY*.01,3.5,22))},{passive:!0})}attachTarget(t){this.target=t}setMode(t,e={}){t===this.mode&&!e.force||(this._fromPos.copy(this.camera.position),this.camera.getWorldDirection(j),this._fromLook.copy(this.camera.position).add(j.multiplyScalar(5)),this.mode=t,this.inspectionTarget=e.target||null,this._blendT=0,this._blendDur=e.duration??.7,w.emit("camera:mode",{mode:t}))}cycleMode(){const t=["follow","orbit","inspection","cinematic"],e=t[(t.indexOf(this.mode)+1)%t.length];e==="inspection"&&!this.inspectionTarget?this.setMode("cinematic"):this.setMode(e)}update(t){if(this.target){switch(this.mode){case"follow":this._computeFollow(this._toPos,this._toLook);break;case"orbit":this._computeOrbit(this._toPos,this._toLook);break;case"inspection":this._computeInspection(this._toPos,this._toLook);break;case"cinematic":this._computeCinematic(this._toPos,this._toLook);break}if(this._blendT<1){this._blendT=Math.min(1,this._blendT+t/this._blendDur);const e=fe(this._blendT);j.copy(this._fromPos).lerp(this._toPos,e),K.copy(this._fromLook).lerp(this._toLook,e),this.camera.position.copy(j),this.camera.lookAt(K)}else if(this.mode==="follow"){const e=1-Math.exp(-t*6);this.camera.position.lerp(this._toPos,e),j.copy(this.camera.position).add(this._toLook.clone().sub(this.camera.position).multiplyScalar(1)),this.camera.lookAt(this._toLook)}else this.camera.position.copy(this._toPos),this.camera.lookAt(this._toLook)}}_computeFollow(t,e){const s=this.target,i=-s.rotation.y,o=new P(-Math.cos(i),0,-Math.sin(i));t.copy(s.position).addScaledVector(o,7.5).setY(s.position.y+3.4),e.copy(s.position).setY(s.position.y+1.2)}_computeOrbit(t,e){const s=this.target,{yaw:i,pitch:o,dist:n}=this._orbit,r=Math.cos(o)*Math.cos(i)*n,c=Math.sin(o)*n,l=Math.cos(o)*Math.sin(i)*n;t.set(s.position.x+r,s.position.y+c+1,s.position.z+l),e.copy(s.position).setY(s.position.y+1)}_computeInspection(t,e){const s=this.inspectionTarget;if(!s)return this._computeFollow(t,e);const o=performance.now()/1e3*.18,n=9;t.set(s.x+Math.cos(o)*n,s.y+3.6+Math.sin(o*.6)*.4,s.z+Math.sin(o)*n),e.copy(s).setY(s.y+1.5)}_computeCinematic(t,e){const s=this.target,o=performance.now()/1e3*.08;t.set(s.position.x+Math.cos(o)*22,s.position.y+12,s.position.z+Math.sin(o)*22),e.copy(s.position).setY(s.position.y+1)}}function fe(a){return a<.5?2*a*a:1-Math.pow(-2*a+2,2)/2}class ge{constructor(t,e,s){this.rover=t,this.registry=e,this.input=s,this._current=null}update(){const t=this.rover.root.position,{poi:e}=this.registry.nearest(t,1/0);let s=null;e&&e.distanceTo(t)<=e.radius&&(s=e),s!==this._current&&(this._current&&w.emit("poi:far",{poi:this._current}),s&&w.emit("poi:near",{poi:s}),this._current=s),this.input.pressed.action&&(s||z.free)&&w.emit("poi:enter",{poi:s})}get currentPOI(){return this._current}}class ve{constructor(t,e,s,{spawn:i=3}={}){this.rocks=t,this.terrain=e,this.rover=s,this.group=new v,this.group.name="scan-beacons",this.targets=[],this._spawn=i,this._deployed=!1,this._scanned=0}deploy(){if(!this._deployed){for(let t=0;t<this._spawn;t++){const e=Math.random()*Math.PI*2,s=20+Math.random()*40,i=this.rover.root.position.x+Math.cos(e)*s,o=this.rover.root.position.z+Math.sin(e)*s,n=this.terrain.heightAt(i,o),r=new h(new X(.4,1.6,12),new $({color:8376532,transparent:!0,opacity:.85}));r.position.set(i,n+1.2,o),r.userData.scanned=!1,this.group.add(r),this.targets.push(r)}this._deployed=!0,w.emit("toast",{text:"Scan beacons deployed · drive into each beacon."})}}update(t,e){if(this._deployed)for(const s of this.targets){if(s.userData.scanned)continue;s.rotation.y=e*1.4,s.position.y=this.terrain.heightAt(s.position.x,s.position.z)+1.2+Math.sin(e*3)*.08;const i=s.position.x-this.rover.root.position.x,o=s.position.z-this.rover.root.position.z;Math.hypot(i,o)<3.5&&(s.userData.scanned=!0,s.material.color.set(16107883),this._scanned++,w.emit("toast",{text:`Sample logged (${this._scanned}/${this.targets.length}).`}),this._scanned>=this.targets.length&&w.emit("mission:complete",{id:"sample-hunt"}))}}}class ye{constructor(t){this.missions=t.missions,this.status=new Map;for(const e of this.missions)this.status.set(e.id,{done:!1,progress:0});w.on("poi:enter",({poi:e})=>this._onEnter(e)),w.on("mission:complete",({id:e})=>this._complete(e))}_onEnter(t){if(t)for(const e of this.missions){const s=this.status.get(e.id);s.done||(e.target&&e.target===t.id&&this._complete(e.id),Array.isArray(e.targets)&&e.targets.includes(t.id)&&(s.progress+=1,s.progress>=e.targets.length?this._complete(e.id):w.emit("toast",{text:`${e.title} · ${s.progress}/${e.targets.length}`})))}}_complete(t){const e=this.status.get(t);if(!e||e.done)return;e.done=!0;const s=this.missions.find(i=>i.id===t);w.emit("toast",{text:`MISSION · ${s?.title} · complete.`}),w.emit("mission:done",{id:t})}isDone(t){return this.status.get(t)?.done}}class be{constructor(){this.ctx=null,this.ready=!1,this.muted=!1,this._buses={};const t=()=>{this.ready||(this._init(),window.removeEventListener("pointerdown",t),window.removeEventListener("keydown",t))};window.addEventListener("pointerdown",t),window.addEventListener("keydown",t)}_init(){try{const t=window.AudioContext||window.webkitAudioContext;if(!t)return;this.ctx=new t;const e=this.ctx.createGain();e.gain.value=.7,e.connect(this.ctx.destination);const s=this.ctx.createGain();s.gain.value=.6,s.connect(e);const i=this.ctx.createGain();i.gain.value=.9,i.connect(e),this._buses={master:e,music:s,sfx:i},this.ready=!0}catch(t){console.warn("[audio] init failed",t)}}bus(t){return this._buses[t]}toggleMute(){this.ready&&(this.muted=!this.muted,this._buses.master.gain.setTargetAtTime(this.muted?0:.7,this.ctx.currentTime,.05))}chirp(t=660){if(!this.ready)return;const e=this.ctx,s=e.createOscillator();s.type="square",s.frequency.value=t;const i=e.createGain();i.gain.value=1e-4,s.connect(i),i.connect(this._buses.sfx);const o=e.currentTime;i.gain.setValueAtTime(1e-4,o),i.gain.exponentialRampToValueAtTime(.09,o+.005),i.gain.exponentialRampToValueAtTime(1e-4,o+.12),s.start(o),s.stop(o+.14)}}class _e{constructor(t){this.engine=t,this._built=!1}_build(){const t=this.engine.ctx;if(!t)return;const e=2*t.sampleRate,s=t.createBuffer(1,e,t.sampleRate),i=s.getChannelData(0);let o=0,n=0,r=0;for(let p=0;p<e;p++){const b=Math.random()*2-1;o=.99765*o+b*.099046,n=.963*n+b*.2965164,r=.57*r+b*1.0526913,i[p]=(o+n+r+b*.1848)*.11}const c=t.createBufferSource();c.buffer=s,c.loop=!0;const l=t.createBiquadFilter();l.type="highpass",l.frequency.value=240;const d=t.createGain();d.gain.value=.35,c.connect(l),l.connect(d),d.connect(this.engine.bus("music"));const g=t.createOscillator();g.frequency.value=.05;const u=t.createGain();u.gain.value=120,g.connect(u),u.connect(l.frequency),c.start(),g.start(),this._built=!0}update(){this.engine.ready&&!this._built&&this._build()}}class xe{constructor(t,e,s,i,o="DAWN"){this.rover=e,this.registry=s,this.terrain=i,this.el=document.createElement("div"),this.el.className="hud",this.el.innerHTML=`
      <div class="hud__corner hud__corner--tl">
        <div class="hud__brand"><strong>${o}</strong><span>· FISAT Rover Team</span></div>
        <div class="hud__pill" id="hud-mode-pill">follow camera</div>
      </div>
      <div class="compass"><div class="compass__strip" id="compass-strip"></div><div class="compass__needle"></div></div>
      <div class="hud__corner hud__corner--tr">
        <div class="minimap">
          <div class="minimap__title">Terrain Map</div>
          <canvas class="minimap__canvas" id="minimap" width="336" height="336"></canvas>
        </div>
      </div>
      <div class="hud__corner hud__corner--bl">
        <div class="telem">
          <div class="telem__cell"><div class="telem__label">Speed</div><div class="telem__value" id="telem-speed">0.0</div><div class="telem__unit">m/s</div></div>
          <div class="telem__cell"><div class="telem__label">Heading</div><div class="telem__value" id="telem-heading">000</div><div class="telem__unit">deg</div></div>
          <div class="telem__cell"><div class="telem__label">Coord</div><div class="telem__value" id="telem-coord">0 · 0</div><div class="telem__unit">world</div></div>
        </div>
      </div>
      <div class="hud__corner hud__corner--br">
        <div class="hud__pill" id="hud-poi-pill" style="display:none">nearby</div>
      </div>
    `,t.appendChild(this.el),this.speedEl=this.el.querySelector("#telem-speed"),this.headEl=this.el.querySelector("#telem-heading"),this.coordEl=this.el.querySelector("#telem-coord"),this.modePill=this.el.querySelector("#hud-mode-pill"),this.poiPill=this.el.querySelector("#hud-poi-pill"),this.strip=this.el.querySelector("#compass-strip"),this.minimap=this.el.querySelector("#minimap"),this.mmCtx=this.minimap.getContext("2d"),this._buildCompass(),w.on("camera:mode",({mode:n})=>{this.modePill.textContent=`${n} camera`}),w.on("poi:near",({poi:n})=>{this.poiPill.style.display="",this.poiPill.textContent=`nearby · ${n.name}`}),w.on("poi:far",()=>{this.poiPill.style.display="none",this.poiPill.textContent=""}),this._paintMinimapBase()}_buildCompass(){const t=["N","30","60","E","120","150","S","210","240","W","300","330"];let e="";for(let s=0;s<3;s++)for(const i of t){const o=["N","E","S","W"].includes(i);e+=`<span class="${o?"card":""}">${i}</span>`}this.strip.innerHTML=e,requestAnimationFrame(()=>{this._stripWidth=this.strip.scrollWidth/3})}_paintMinimapBase(){const t=this.mmCtx,e=this.minimap.width,s=this.minimap.height,i=this.terrain.segs+1,o=t.createImageData(e,s);for(let r=0;r<s;r++)for(let c=0;c<e;c++){const l=c/e*(i-1)|0,d=r/s*(i-1)|0,g=this.terrain.heights[d*i+l],u=Math.max(0,Math.min(1,(g+6)/20)),p=60+u*140,b=30+u*60,m=20+u*30,f=(r*e+c)*4;o.data[f]=p,o.data[f+1]=b,o.data[f+2]=m,o.data[f+3]=255}t.putImageData(o,0,0);const n=t.createRadialGradient(e/2,s/2,e*.2,e/2,s/2,e*.55);n.addColorStop(0,"rgba(0,0,0,0)"),n.addColorStop(1,"rgba(0,0,0,0.6)"),t.fillStyle=n,t.fillRect(0,0,e,s),this._minimapBase=t.getImageData(0,0,e,s)}update(){const t=this.rover;this.speedEl.textContent=Math.abs(t.speed).toFixed(1);const e=(-t.heading*180/Math.PI%360+360)%360;if(this.headEl.textContent=String(Math.round(e)).padStart(3,"0"),this.coordEl.textContent=`${Math.round(t.root.position.x)} · ${Math.round(t.root.position.z)}`,this._stripWidth){const l=e/360*this._stripWidth;this.strip.style.transform=`translate(calc(-${l}px + 50%), -50%)`}const s=this.mmCtx;s.putImageData(this._minimapBase,0,0);const i=this.minimap.width,o=this.minimap.height,n=this.terrain.half;for(const l of this.registry.pois){const d=(l.position.x+n)/this.terrain.size*i,g=(l.position.z+n)/this.terrain.size*o;s.fillStyle="#f2a35d",s.beginPath(),s.arc(d,g,3,0,Math.PI*2),s.fill()}const r=(t.root.position.x+n)/this.terrain.size*i,c=(t.root.position.z+n)/this.terrain.size*o;s.save(),s.translate(r,c),s.rotate(t.heading),s.fillStyle="#7fd0d4",s.beginPath(),s.moveTo(6,0),s.lineTo(-4,4),s.lineTo(-4,-4),s.closePath(),s.fill(),s.restore()}}class Me{constructor(t){this.el=document.createElement("div"),this.el.className="prompt",this.el.innerHTML='<span class="prompt__key">E</span><span id="prompt-label">Enter</span>',t.appendChild(this.el),this.labelEl=this.el.querySelector("#prompt-label"),w.on("poi:near",({poi:e})=>{this.labelEl.textContent=`Enter · ${e.name}`,this.el.classList.add("prompt--visible")}),w.on("poi:far",()=>this.el.classList.remove("prompt--visible")),w.on("codex:open",()=>this.el.classList.remove("prompt--visible"))}}class Se{constructor(t,{life:e=3200}={}){this.el=document.createElement("div"),this.el.className="toast-stack",t.appendChild(this.el),this.life=e,w.on("toast",({text:s})=>this.push(s))}push(t){const e=document.createElement("div");e.className="toast",e.textContent=t,this.el.appendChild(e),requestAnimationFrame(()=>e.classList.add("toast--visible")),setTimeout(()=>{e.classList.remove("toast--visible"),setTimeout(()=>e.remove(),300)},this.life)}}class $e{constructor(t){this.el=document.createElement("div"),this.el.className="onboarding",this.el.innerHTML=`
      <div class="onboarding__row"><span class="onboarding__key">W</span><span class="onboarding__key">A</span><span class="onboarding__key">S</span><span class="onboarding__key">D</span><span>drive</span></div>
      <div class="onboarding__row"><span class="onboarding__key">Space</span><span>brake</span></div>
      <div class="onboarding__row"><span class="onboarding__key">C</span><span>camera</span></div>
      <div class="onboarding__row"><span class="onboarding__key">E</span><span>interact</span></div>
      <div class="onboarding__row"><span class="onboarding__key">Esc</span><span>close</span></div>
    `,t.appendChild(this.el),this.hidden=!1,this._t=0,this._dist=0,z.reducedMotion&&this.hide()}hide(){this.hidden||(this.hidden=!0,this.el.classList.add("onboarding--hidden"),setTimeout(()=>this.el.remove(),800))}update(t,e){this.hidden||(this._t+=t,this._dist+=Math.abs(e.speed)*t,(this._t>25||this._dist>55)&&this.hide())}}function ke(a){const t=a.site;return`
    <p>You have landed in the DAWN inspection world — an optional 3D layer for the FISAT Rover Team's public platform. This scene is meant to complement the main website, not replace it.</p>

    <h3>How to explore</h3>
    <ul>
      <li>Drive with <b>W A S D</b> or arrow keys. <b>Space</b> to brake.</li>
      <li>Approach a marked location and press <b>E</b> to open its dossier.</li>
      <li><b>C</b> cycles the camera through follow, orbit, inspection, and cinematic modes.</li>
    </ul>

    <h3>What is inside this build</h3>
    <ul>
      <li>Mission Control · public overview and mentors.</li>
      <li>Rover Garage · public rover brief.</li>
      <li>Robotic Arm Bay · interactive manipulator inspection.</li>
      <li>Sponsor Plaza · public partner tiers.</li>
      <li>Team Monument · official roster.</li>
    </ul>

    <div class="pill-row">
      <span class="pill pill--accent">${t.tagline}</span>
      <span class="pill">${t.institution}</span>
      <span class="pill">${t.location}</span>
    </div>
    <a class="linkbtn" href="/" target="_self">Main website ↗</a>
  `}function Pe(a){const t=a.site,e=a.team.patrons,s=a.team.mentors;return`
    <p>${t.mission}</p>

    <h3>Built Differently</h3>
    <p>${t.builtDifferent}</p>

    <h4>Patrons</h4>
    <div class="card-grid">
      ${e.map(i=>`
        <figure>
          <img loading="lazy" src="${i.photo}" alt="${i.name}">
          <figcaption><b>${i.name}</b><span>${i.role}</span></figcaption>
        </figure>
      `).join("")}
    </div>

    <h4>Mentors</h4>
    <div class="card-grid">
      ${s.map(i=>`
        <figure>
          <img loading="lazy" src="${i.photo}" alt="${i.name}">
          <figcaption><b>${i.name}</b><span>${i.role}</span></figcaption>
        </figure>
      `).join("")}
    </div>

    <h4>Reach us</h4>
    <div class="pill-row">
      ${a.contact.socials.map(i=>`<a class="pill" href="${i.url}" target="_blank" rel="noopener">${i.label} · ${i.handle}</a>`).join("")}
    </div>
  `}function Te(a){const t=a.rover;return`
    <p>${t.summary}</p>
    <figure style="margin:0 0 var(--s-4);border-radius:var(--r-md);overflow:hidden;border:1px solid var(--stroke-hair);">
      <img loading="lazy" src="${t.heroImage}" alt="${t.name}" style="width:100%;display:block;">
    </figure>

    <h4>Callsign</h4>
    <div class="pill-row"><span class="pill pill--accent">${t.callsign}</span><span class="pill">${t.season}</span></div>

    <h4>Specification</h4>
    <div class="spec-grid">
      ${t.specs.map(e=>`
        <div class="cell">
          <div class="k">${e.label}</div>
          <div class="v">${e.value}</div>
        </div>`).join("")}
    </div>

    <h4>Detail view</h4>
    <figure style="margin:0;border-radius:var(--r-md);overflow:hidden;border:1px solid var(--stroke-hair);">
      <img loading="lazy" src="${t.galleryImage}" alt="${t.name} · detail" style="width:100%;display:block;">
    </figure>
  `}function Ae(a){const t=a.rover.armCallouts,e=document.createElement("div");return e.className="arm-inspector",e.innerHTML=`
    <p style="margin-bottom:var(--s-5)">A 5-DOF manipulator with a compliant gripper. Move each joint below — the rover parked outside will move in sync.</p>
    ${t.map(s=>`
      <div class="joint" data-joint="${s.joint}">
        <div>
          <b>${s.label}</b>
          <small>${s.note}</small>
          <input type="range" min="-1.4" max="1.4" step="0.02" value="0" style="width:100%;margin-top:6px;accent-color:var(--accent-hi);" />
        </div>
        <span class="code">${s.joint}</span>
      </div>
    `).join("")}
    <div style="margin-top:var(--s-4);display:flex;gap:var(--s-2);">
      <button class="linkbtn" id="arm-home">Home pose</button>
      <button class="linkbtn" id="arm-reach">Reach forward</button>
    </div>
  `,e.querySelectorAll(".joint").forEach(s=>{const i=s.dataset.joint,o=s.querySelector("input");i==="gripper"&&(o.min="0",o.max="1",o.step="0.01",o.value="0.5"),o.addEventListener("input",()=>{s.classList.add("is-active");const n=parseFloat(o.value);w.emit("arm:setJoint",{joint:i,value:n})}),o.addEventListener("change",()=>setTimeout(()=>s.classList.remove("is-active"),400))}),e.querySelector("#arm-home").addEventListener("click",()=>{const s={"shoulder-yaw":0,"shoulder-pitch":-.9,elbow:1.4,"wrist-pitch":-.4,"wrist-roll":0,gripper:.5};w.emit("arm:pose",{pose:s}),tt(e,s)}),e.querySelector("#arm-reach").addEventListener("click",()=>{const s={"shoulder-yaw":0,"shoulder-pitch":.2,elbow:.3,"wrist-pitch":0,"wrist-roll":.3,gripper:.9};w.emit("arm:pose",{pose:s}),tt(e,s)}),e}function tt(a,t){a.querySelectorAll(".joint").forEach(e=>{const s=e.dataset.joint;t[s]!==void 0&&(e.querySelector("input").value=t[s])})}function Ee(a,t){const e=a.department(t.department);if(!e)return`<p>Unknown department: ${t.department}</p>`;const s=a.membersByDept(e.id);return`
    <div class="pill-row">
      <span class="pill pill--accent" style="color:${e.color};border-color:${e.color}">${e.shortName}</span>
      <span class="pill">${e.name}</span>
    </div>

    <p>${e.summary}</p>

    <h3>Responsibilities</h3>
    <ul>
      ${e.responsibilities.map(i=>`<li>${i}</li>`).join("")}
    </ul>

    <h3>Roster (${s.length})</h3>
    <div class="card-grid">
      ${s.map(i=>`
        <figure>
          <img loading="lazy" src="${i.photo}" alt="${i.name}">
          <figcaption><b>${i.name}</b><span>${i.role}</span></figcaption>
        </figure>
      `).join("")}
    </div>
  `}function Le(){const a=document.createElement("div");return a.innerHTML=`
    <p>The testing area is presented as the rover-validation zone. Public materials confirm that the team designs, builds, and tests DAWN for Mars-analogue competition environments, but detailed test procedures are intentionally not overstated here.</p>

    <h3>Try the scene systems</h3>
    <div class="pill-row">
      <button class="linkbtn" id="deploy-scan">Deploy scene beacons</button>
      <button class="linkbtn" id="start-storm">Trigger dust storm</button>
      <button class="linkbtn" id="end-storm">Clear weather</button>
    </div>

    <h3>What this stop communicates</h3>
    <ul>
      <li>DAWN is built for rough-terrain competition environments.</li>
      <li>The team combines mechanical, electrical, software, and testing work.</li>
      <li>Detailed performance data should come from internal team documentation, not this public scene.</li>
    </ul>
  `,a.querySelector("#deploy-scan").addEventListener("click",()=>w.emit("scan:deploy")),a.querySelector("#start-storm").addEventListener("click",()=>w.emit("storm:start")),a.querySelector("#end-storm").addEventListener("click",()=>w.emit("storm:end")),a}function Ce(){return`
    <p>This station represents the communications layer behind rover operations. The public site confirms DAWN as a competition rover program, but detailed public documentation for radios, network topology, and operational handoff is not currently published.</p>

    <h3>Publicly safe reading</h3>
    <div class="spec-grid">
      <div class="cell"><div class="k">Purpose</div><div class="v">Ground-to-rover coordination</div></div>
      <div class="cell"><div class="k">Status</div><div class="v">Competition-critical subsystem</div></div>
      <div class="cell"><div class="k">Detail level</div><div class="v">High-level public summary only</div></div>
      <div class="cell"><div class="k">Next step</div><div class="v">Team-only technical brief for exact architecture</div></div>
    </div>
  `}function Re(){return`
    <p>This landmark has been reframed as a power-systems stop. The official public team modal mentions dual 25.2 V batteries with BMS and separate power lines, together with a fused power board protecting rover subsystems.</p>

    <h3>Publicly stated power notes</h3>
    <ul>
      <li>Dual 25.2 V batteries with BMS.</li>
      <li>Separate power lines.</li>
      <li>Fused power board for subsystem protection.</li>
      <li>No additional public specification values are shown here.</li>
    </ul>
  `}function ze(a){const t=a.competitions.primary,e=a.competitions.tasks;return`
    <p>${t.summary}</p>

    <h4>Current campaign</h4>
    <div class="pill-row">
      <span class="pill pill--accent">${t.acronym}</span>
      <span class="pill">${t.role}</span>
    </div>

    <h4>Task categories</h4>
    <ul>
      ${e.map(s=>`<li><b style="color:var(--c-white)">${s.name}</b> — ${s.blurb}</li>`).join("")}
    </ul>

    <h4>Progress log</h4>
    <div class="timeline-list">
      ${t.milestones.map(s=>`
        <div class="row">
          <div class="dot"></div>
          <div>
            <span>${s.day}</span>
            <b>${s.title}</b>
            <p>${s.note}</p>
          </div>
        </div>
      `).join("")}
    </div>

    <a class="linkbtn" href="${t.referenceUrl}" target="_blank" rel="noopener">Full progress log ↗</a>
  `}function Ie(a){const t=a.sponsors.tiers,e=a.sponsors.valueProps;return`
    <p>DAWN exists because of the industry partners who bet on a student team. Here they are, tiered by investment — and here is the case for joining them.</p>

    ${t.map(s=>`
      <div class="tier">
        <div class="tier__head"><span style="background:${s.accent}"></span><h4>${s.name}</h4></div>
        ${s.sponsors.map(i=>`
          <a class="sponsor-card" href="${i.url}" target="_blank" rel="noopener">
            <div class="sponsor-card__logo"><img loading="lazy" src="${i.logo}" alt="${i.name}"></div>
            <div class="sponsor-card__meta">
              <b>${i.name}</b>
              <p>${i.blurb}</p>
            </div>
          </a>
        `).join("")}
      </div>
    `).join("")}

    <h3>Why sponsor us</h3>
    <ul>
      ${e.map(s=>`<li><b style="color:var(--c-white)">${s.title}</b> — ${s.body}</li>`).join("")}
    </ul>
  `}function De(a){return`
    <p>Photographs from the season — captured on the shop floor and at the competition site.</p>
    <div class="gallery-grid">
      ${a.gallery.map(e=>`
        <figure>
          <img loading="lazy" src="${e.src}" alt="${e.caption}">
          <figcaption>${e.caption}</figcaption>
        </figure>
      `).join("")}
    </div>
  `}function je(a){return`
    <p>Milestones that mark the season. Each is a receipt on years of work — not just this year's team, but every generation of the FISAT Rover Team stacking on top of the last.</p>
    <div class="timeline-list">
      ${a.achievements.map(e=>`
        <div class="row">
          <div class="dot"></div>
          <div>
            <span>${e.year}</span>
            <b>${e.title}</b>
            <p>${e.body}</p>
            ${e.source?`<a class="linkbtn" style="margin-top:var(--s-2)" href="${e.source}" target="_blank" rel="noopener">Source ↗</a>`:""}
          </div>
        </div>
      `).join("")}
    </div>
  `}function qe(a){return`
    <p>The season, from kickoff to finals.</p>
    <div class="timeline-list">
      ${a.timeline.map(e=>`
        <div class="row">
          <div class="dot"></div>
          <div>
            <span>${e.date}</span>
            <b>${e.title}</b>
            <p>${e.body}</p>
          </div>
        </div>
      `).join("")}
    </div>
  `}function Be(a){const t=a.contact.socials,e=a.faq;return`
    <p>Follow the team, ask a question, or dig through the frequently asked ones below.</p>

    <h4>Channels</h4>
    <div class="pill-row">
      ${t.map(s=>`<a class="linkbtn" href="${s.url}" target="_blank" rel="noopener">${s.label} · ${s.handle} ↗</a>`).join("")}
    </div>

    <h3>Frequently asked</h3>
    ${e.map(s=>`
      <details style="border-top:1px solid var(--stroke-hair);padding:var(--s-3) 0;">
        <summary style="color:var(--c-white);cursor:pointer;">${s.q}</summary>
        <p style="margin:var(--s-2) 0 0;color:var(--text-muted)">${s.a}</p>
      </details>
    `).join("")}
  `}function We(){return`
    <h3 style="margin-top:0">Team intake details need direct confirmation.</h3>
    <p>The official public materials clearly show a large multidisciplinary team, but they do not publish a fully verified intake workflow. This public experience therefore avoids inventing application steps.</p>

    <h4>What is visible publicly</h4>
    <ul>
      <li>The team includes patrons, mentors, and multiple engineering roles.</li>
      <li>Roles visible on the public roster include electrical, controls, design and manufacturing, AI and autonomy, science, and research and documentation.</li>
      <li>Prospective contributors should contact the team through official channels for current recruitment information.</li>
    </ul>
  `}function Oe(a){const t=a.team,e=a.departments;return`
    <p>Every human behind DAWN. Roles map to the departments you can visit around the world; each portrait lists the sub-team the person contributes to.</p>

    <div class="pill-row">
      <span class="pill pill--accent">${t.members.length+t.mentors.length+t.patrons.length} people</span>
      <span class="pill">${e.length} departments</span>
      <span class="pill">1 mission</span>
    </div>

    <h3>Patrons</h3>
    <div class="card-grid">
      ${t.patrons.map(i=>`
        <figure>
          <img loading="lazy" src="${i.photo}" alt="${i.name}">
          <figcaption><b>${i.name}</b><span>${i.role}</span></figcaption>
        </figure>`).join("")}
    </div>

    <h3>Mentors</h3>
    <div class="card-grid">
      ${t.mentors.map(i=>`
        <figure>
          <img loading="lazy" src="${i.photo}" alt="${i.name}">
          <figcaption><b>${i.name}</b><span>${i.role}</span></figcaption>
        </figure>`).join("")}
    </div>

    <h3>Team</h3>
    <div class="card-grid">
      ${t.members.map(i=>`
        <figure>
          <img loading="lazy" src="${i.photo}" alt="${i.name}">
          <figcaption><b>${i.name}</b><span>${i.role}</span></figcaption>
        </figure>`).join("")}
    </div>
  `}const Fe={IntroPanel:ke,MissionControlPanel:Pe,RoverPanel:Te,ArmInspector:Ae,DepartmentPanel:Ee,TestingPanel:Le,CommsPanel:Ce,SolarPanel:Re,CompetitionPanel:ze,SponsorPanel:Ie,GalleryPanel:De,AchievementPanel:je,TimelinePanel:qe,MediaPanel:Be,RecruitmentPanel:We,TeamPanel:Oe};class Ne{constructor(t,e,s){this.content=e,this.audio=s,this.el=document.createElement("aside"),this.el.className="codex",this.el.setAttribute("role","complementary"),this.el.setAttribute("aria-label","Location dossier"),this.el.innerHTML=`
      <button class="codex__close" id="codex-close" aria-label="Close">✕</button>
      <div class="codex__head">
        <div class="codex__eyebrow" id="codex-eyebrow">Landing zone</div>
        <h2 class="codex__title" id="codex-title">Welcome to Mars</h2>
      </div>
      <div class="codex__body" id="codex-body"></div>
    `,t.appendChild(this.el),this.eyebrow=this.el.querySelector("#codex-eyebrow"),this.title=this.el.querySelector("#codex-title"),this.body=this.el.querySelector("#codex-body"),this.el.querySelector("#codex-close").addEventListener("click",()=>this.close()),window.addEventListener("keydown",i=>{i.key==="Escape"&&this.open&&this.close()}),w.on("poi:enter",({poi:i})=>this.openForPOI(i)),w.on("codex:openById",({id:i})=>{const o=this.content.poi(i);o&&this.openForPOI({...o,distanceTo:()=>0})})}openForPOI(t){if(!t)return;const e=Fe[t.panel];if(!e){console.warn("[codex] no panel for",t.panel);return}this.eyebrow.textContent=t.type?t.type.toUpperCase():"DOSSIER",this.title.textContent=t.name,this.body.innerHTML="";const s={content:this.content,audio:this.audio,close:()=>this.close()},i=e(this.content,t,s);typeof i=="string"?this.body.innerHTML=i:i instanceof HTMLElement&&this.body.appendChild(i),this.body.scrollTop=0,this.el.classList.add("codex--open"),this.open=!0,this.audio?.chirp?.(720),w.emit("codex:open",{poi:t})}close(){this.open&&(this.el.classList.remove("codex--open"),this.open=!1,this.audio?.chirp?.(340),w.emit("codex:close"))}}class He{constructor(t,e,s){this.el=document.createElement("div"),this.el.className="cine cine--visible",this.el.innerHTML=`
      <div>
        <div class="cine__title"><strong>DAWN</strong>${e||"FISAT Rover Team"}</div>
        <div class="cine__sub">${s||"the interactive Mars rover experience"}</div>
      </div>
      <button class="cine__cta" id="cine-cta">Begin drive · ${Ge()}</button>
    `,t.appendChild(this.el);const i=()=>this.dismiss();this.el.querySelector("#cine-cta").addEventListener("click",i),window.addEventListener("keydown",o=>{this.dismissed||["Enter","Escape"," "].includes(o.key)&&i()}),(z.nointro||z.reducedMotion)&&setTimeout(i,400)}dismiss(){this.dismissed||(this.dismissed=!0,this.el.classList.remove("cine--visible"),setTimeout(()=>this.el.remove(),1200),w.emit("cinematic:end"))}}function Ge(){return matchMedia("(pointer: coarse)").matches?"tap":"press · space"}class Ve{constructor(t,e){this.canvas=t,this.uiRoot=e,this.renderer=new kt(t),this.loop=new Pt,this.input=new Tt,this.audio=new be,this.ambience=new _e(this.audio)}async boot(t){await R.load(e=>t?.(e*.5,"content")),this.world=new he(this.renderer,R),t?.(.7,"world"),this.rover=new pe,this.roverPhysics=new ue(this.rover,this.world.terrain),this.roverAudio=new me(this.audio),this.world.scene.add(this.rover.root),this.roverPhysics.reset(0,6),this.cameraRig=new we,this.cameraRig.attachTarget(this.rover.root),this.renderer.attachCamera(this.cameraRig.camera),this.proximity=new ge(this.rover,this.world.pois,this.input),this.scanSystem=new ve(this.world.rocks,this.world.terrain,this.rover,{spawn:3}),this.world.scene.add(this.scanSystem.group),this.missions=new ye(R),this.hud=new xe(this.uiRoot,this.rover,this.world.pois,this.world.terrain,R.site.name),this.prompt=new Me(this.uiRoot),this.toast=new Se(this.uiRoot),this.codex=new Ne(this.uiRoot,R,this.audio),this.onboarding=new $e(this.uiRoot),this._wireEvents(),!z.nointro&&!z.reducedMotion&&(this.intro=new He(this.uiRoot,R.site.team,R.site.subtitle)),this.loop.add({update:(e,s)=>this._update(e,s),lateUpdate:e=>this._lateUpdate(e),render:()=>this.renderer.render(this.world.scene,this.cameraRig.camera)}),t?.(1,"ready"),zt("boot complete")}_wireEvents(){w.on("arm:setJoint",({joint:t,value:e})=>this.rover.arm.setJoint(t,e)),w.on("arm:pose",({pose:t})=>this.rover.arm.setPose(t)),w.on("scan:deploy",()=>this.scanSystem.deploy()),w.on("codex:open",({poi:t})=>{const e=this.world.pois.byId(t.id);e&&(this.cameraRig.inspectionTarget=e.position.clone(),this.cameraRig.setMode("inspection",{duration:.9}))}),w.on("codex:close",()=>this.cameraRig.setMode("follow",{duration:.6})),w.on("cinematic:end",()=>{this.toast.push("Welcome to Mars. Drive to Mission Control.")})}_update(t,e){this.input.update(),this.input.pressed.reset&&this.roverPhysics.reset(0,6),this.input.pressed.camera&&this.cameraRig.cycleMode(),this.input.pressed.escape&&this.codex.close(),this.roverPhysics.update(t,this.input.state),Math.abs(this.rover.speed)<.05&&!this.codex.open&&this.rover.arm.idle(e),this.proximity.update(),this.scanSystem.update(t,e),this.world.update(t,e,this.rover.root.position),this.ambience.update(),this.roverAudio.update(t,this.rover.speed),this.input.clearOneShots()}_lateUpdate(t){this.cameraRig.update(t),this.hud.update(),this.onboarding&&this.onboarding.update(t,this.rover)}start(){this.loop.start()}stop(){this.loop.stop()}}function et(a,t){const e=t.site,s=t.team,i=t.rover;a.innerHTML=`
    <section>
      <p style="color:var(--accent-hi);text-transform:uppercase;letter-spacing:.24em;font-size:.72rem;font-family:var(--font-mono)">${e.subtitle}</p>
      <h1 style="font-size:clamp(2.4rem,6vw,4rem);margin:.2em 0">${e.name} · ${e.team}</h1>
      <p>${e.mission}</p>
      <p>${e.builtDifferent}</p>
      <p><a href="${e.canonicalUrl}">Classic website</a></p>
    </section>

    <section>
      <h2>Rover · ${i.name}</h2>
      <p>${i.summary}</p>
      <ul>${i.specs.map(o=>`<li><b>${o.label}:</b> ${o.value}</li>`).join("")}</ul>
    </section>

    <section>
      <h2>Departments</h2>
      ${t.departments.map(o=>`
        <article>
          <h3>${o.name}</h3>
          <p>${o.summary}</p>
          <ul>${o.responsibilities.map(n=>`<li>${n}</li>`).join("")}</ul>
        </article>
      `).join("")}
    </section>

    <section>
      <h2>Team (${s.members.length+s.mentors.length+s.patrons.length})</h2>
      <h3>Patrons</h3>
      <ul>${s.patrons.map(o=>`<li>${o.name} — ${o.role}</li>`).join("")}</ul>
      <h3>Mentors</h3>
      <ul>${s.mentors.map(o=>`<li>${o.name} — ${o.role}</li>`).join("")}</ul>
      <h3>Members</h3>
      <ul>${s.members.map(o=>`<li>${o.name} — ${o.role}</li>`).join("")}</ul>
    </section>

    <section>
      <h2>Sponsors</h2>
      ${t.sponsors.tiers.map(o=>`
        <h3>${o.name}</h3>
        <ul>${o.sponsors.map(n=>`<li><a href="${n.url}"><b>${n.name}</b></a> — ${n.blurb}</li>`).join("")}</ul>
      `).join("")}
    </section>

    <section>
      <h2>Achievements</h2>
      <ul>${t.achievements.map(o=>`<li><b>${o.year} · ${o.title}:</b> ${o.body}</li>`).join("")}</ul>
    </section>

    <section>
      <h2>Timeline</h2>
      <ul>${t.timeline.map(o=>`<li><b>${o.date} · ${o.title}:</b> ${o.body}</li>`).join("")}</ul>
    </section>

    <section>
      <h2>Competitions</h2>
      <p>${t.competitions.primary.summary}</p>
      <ul>${t.competitions.tasks.map(o=>`<li><b>${o.name}:</b> ${o.blurb}</li>`).join("")}</ul>
    </section>

    <section>
      <h2>Recruitment</h2>
      <p>${t.recruitment.headline} — ${t.recruitment.sub}</p>
      <ol>${t.recruitment.process.map(o=>`<li><b>${o.title}:</b> ${o.body}</li>`).join("")}</ol>
    </section>

    <section>
      <h2>FAQ</h2>
      <dl>${t.faq.map(o=>`<dt><b>${o.q}</b></dt><dd>${o.a}</dd>`).join("")}</dl>
    </section>

    <section>
      <h2>Contact</h2>
      <p>${t.contact.primary.team} — ${t.contact.primary.institute}<br>${t.contact.primary.address}</p>
      <ul>${t.contact.socials.map(o=>`<li><a href="${o.url}">${o.label} · ${o.handle}</a></li>`).join("")}</ul>
    </section>
  `,a.hidden=!1}const N=document.getElementById("boot"),Xe=document.getElementById("boot-bar"),Ye=document.getElementById("boot-pct"),G=document.getElementById("stage"),Ue=document.getElementById("ui-root"),st=document.getElementById("a11y-fallback");function it(a,t=""){const e=Math.round(a*100);Xe.style.width=e+"%",Ye.textContent=String(e),t&&console.debug("[boot]",t)}async function Ze(){const a=(()=>{try{const e=document.createElement("canvas");return!!(e.getContext("webgl2")||e.getContext("webgl"))}catch{return!1}})();if(z.a11y||!a){await R.load(it),et(st,R),N.classList.add("boot--hidden"),G.style.display="none";return}const t=new Ve(G,Ue);try{await t.boot(it)}catch(e){console.error(e),await R.load(()=>{}).catch(()=>{}),et(st,R),N.classList.add("boot--hidden"),G.style.display="none";return}t.renderer.render(t.world.scene,t.cameraRig.camera),t.start(),requestAnimationFrame(()=>{N.classList.add("boot--hidden"),setTimeout(()=>N.remove(),1400)})}Ze();
