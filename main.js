(()=>{"use strict";function t(t,e,i){return t*(1-i)+e*i}function e(t,e,i){return Math.min(Math.max(t,i),e)}let i=()=>{};function s(t,e){let{x:i,y:s,width:r,height:n}=function(t){let{x:e=0,y:i=0,width:s,height:r,radius:n}=t.world||t;return t.mapwidth&&(s=t.mapwidth,r=t.mapheight),n&&(s=2*n.x,r=2*n.y),t.anchor&&(e-=s*t.anchor.x,i-=r*t.anchor.y),s<0&&(e+=s,s*=-1),r<0&&(i+=r,r*=-1),{x:e,y:i,width:s,height:r}}(e);do{i-=e.sx||0,s-=e.sy||0}while(e=e.parent);let h=t.x-Math.max(i,Math.min(t.x,i+r)),o=t.y-Math.max(s,Math.min(t.y,s+n));return h*h+o*o<t.radius*t.radius}let r,n,h={};function o(t,e){h[t]=h[t]||[],h[t].push(e)}function a(t,...e){(h[t]||[]).map((t=>t(...e)))}let c={get:(t,e)=>"_proxy"==e||i};function l(){return r}function d(){return n}class u{constructor(t=0,e=0,i={}){null!=t.x?(this.x=t.x,this.y=t.y):(this.x=t,this.y=e),i._c&&(this.clamp(i._a,i._b,i._d,i._e),this.x=t,this.y=e)}set(t){this.x=t.x,this.y=t.y}add(t){return new u(this.x+t.x,this.y+t.y,this)}subtract(t){return new u(this.x-t.x,this.y-t.y,this)}scale(t){return new u(this.x*t,this.y*t)}normalize(t=this.length()||1){return new u(this.x/t,this.y/t)}dot(t){return this.x*t.x+this.y*t.y}length(){return Math.hypot(this.x,this.y)}distance(t){return Math.hypot(this.x-t.x,this.y-t.y)}angle(t){return Math.acos(this.dot(t)/(this.length()*t.length()))}direction(){return Math.atan2(this.y,this.x)}clamp(t,e,i,s){this._c=!0,this._a=t,this._b=e,this._d=i,this._e=s}get x(){return this._x}get y(){return this._y}set x(t){this._x=this._c?e(this._a,this._d,t):t}set y(t){this._y=this._c?e(this._b,this._e,t):t}}function f(){return new u(...arguments)}class x{constructor(t){return this.init(t)}init(t={}){this.position=f(),this.velocity=f(),this.acceleration=f(),this.ttl=1/0,Object.assign(this,t)}update(t){this.advance(t)}advance(t){let e=this.acceleration;t&&(e=e.scale(t)),this.velocity=this.velocity.add(e);let i=this.velocity;t&&(i=i.scale(t)),this.position=this.position.add(i),this._pc(),this.ttl--}get dx(){return this.velocity.x}get dy(){return this.velocity.y}set dx(t){this.velocity.x=t}set dy(t){this.velocity.y=t}get ddx(){return this.acceleration.x}get ddy(){return this.acceleration.y}set ddx(t){this.acceleration.x=t}set ddy(t){this.acceleration.y=t}isAlive(){return this.ttl>0}_pc(){}}class g extends x{init({width:t=0,height:e=0,context:i=d(),render:s=this.draw,update:r=this.advance,children:n=[],anchor:h={x:0,y:0},opacity:a=1,rotation:c=0,drotation:l=0,ddrotation:u=0,scaleX:f=1,scaleY:x=1,...g}={}){this._c=[],super.init({width:t,height:e,context:i,anchor:h,opacity:a,rotation:c,drotation:l,ddrotation:u,scaleX:f,scaleY:x,...g}),this._di=!0,this._uw(),this.addChild(n),this._rf=s,this._uf=r,o("init",(()=>{this.context??=d()}))}update(t){this._uf(t),this.children.map((e=>e.update&&e.update(t)))}render(){let t=this.context;t.save(),(this.x||this.y)&&t.translate(this.x,this.y),this.rotation&&t.rotate(this.rotation),1==this.scaleX&&1==this.scaleY||t.scale(this.scaleX,this.scaleY);let e=this.width,i=this.height;this.radius&&(e=i=2*this.radius);let s=-e*this.anchor.x,r=-i*this.anchor.y;(s||r)&&t.translate(s,r),this.context.globalAlpha=this.opacity,this._rf(),(s||r)&&t.translate(-s,-r),this.children.map((t=>t.render&&t.render())),t.restore()}draw(){}_pc(){this._uw(),this.children.map((t=>t._pc()))}get x(){return this.position.x}get y(){return this.position.y}set x(t){this.position.x=t,this._pc()}set y(t){this.position.y=t,this._pc()}get width(){return this._w}set width(t){this._w=t,this._pc()}get height(){return this._h}set height(t){this._h=t,this._pc()}_uw(){if(!this._di)return;let{_wx:t=0,_wy:e=0,_wo:i=1,_wrot:s=0,_wsx:r=1,_wsy:n=1}=this.parent||{};this._wx=this.x,this._wy=this.y,this._ww=this.width,this._wh=this.height,this.radius&&(this._wrx=this.radius,this._wry=this.radius),this._wo=i*this.opacity,this._wsx=r*this.scaleX,this._wsy=n*this.scaleY,this._wx=this._wx*r,this._wy=this._wy*n,this._ww=this.width*this._wsx,this._wh=this.height*this._wsy,this.radius&&(this._wrx=this.radius*this._wsx,this._wry=this.radius*this._wsy),this._wrot=s+this.rotation;let{x:h,y:o}=function(t,e){let i=Math.sin(e),s=Math.cos(e);return{x:t.x*s-t.y*i,y:t.x*i+t.y*s}}({x:this._wx,y:this._wy},s);this._wx=h,this._wy=o,this._wx+=t,this._wy+=e}get world(){return{x:this._wx,y:this._wy,width:this._ww,height:this._wh,radius:this.radius?{x:this._wrx,y:this._wry}:void 0,opacity:this._wo,rotation:this._wrot,scaleX:this._wsx,scaleY:this._wsy}}set children(t){this.removeChild(this._c),this.addChild(t)}get children(){return this._c}addChild(...t){t.flat().map((t=>{this.children.push(t),t.parent=this,t._pc=t._pc||i,t._pc()}))}removeChild(...t){t.flat().map((t=>{(function(t,e){let i=t.indexOf(e);if(-1!=i)return t.splice(i,1),!0})(this.children,t)&&(t.parent=null,t._pc())}))}get radius(){return this._r}set radius(t){this._r=t,this._pc()}get opacity(){return this._opa}set opacity(t){this._opa=e(0,1,t),this._pc()}get rotation(){return this._rot}set rotation(t){this._rot=t,this._pc()}advance(t){super.advance(t),this.drotation+=this.ddrotation,this.rotation+=this.drotation}setScale(t,e=t){this.scaleX=t,this.scaleY=e}get scaleX(){return this._scx}set scaleX(t){this._scx=t,this._pc()}get scaleY(){return this._scy}set scaleY(t){this._scy=t,this._pc()}}function y(){return new g(...arguments)}class p extends g{init({image:t,width:e=(t?t.width:void 0),height:i=(t?t.height:void 0),...s}={}){super.init({image:t,width:e,height:i,...s})}get animations(){return this._a}set animations(t){let e,i;for(e in this._a={},t)this._a[e]=t[e].clone(),i=i||this._a[e];this.currentAnimation=i,this.width=this.width||i.width,this.height=this.height||i.height}playAnimation(t){this.currentAnimation?.stop(),this.currentAnimation=this.animations[t],this.currentAnimation.start()}advance(t){super.advance(t),this.currentAnimation?.update(t)}draw(){if(this.image&&this.context.drawImage(this.image,0,0,this.image.width,this.image.height),this.currentAnimation&&this.currentAnimation.render({x:0,y:0,width:this.width,height:this.height,context:this.context}),this.color){if(this.context.fillStyle=this.color,this.radius)return this.context.beginPath(),this.context.arc(this.radius,this.radius,this.radius,0,2*Math.PI),void this.context.fill();this.context.fillRect(0,0,this.width,this.height)}}}function m(){return new p(...arguments)}let w=/(\d+)(\w+)/;class _ extends g{init({text:t="",textAlign:e="",lineHeight:i=1,font:s=d()?.font,...r}={}){t=""+t,super.init({text:t,textAlign:e,lineHeight:i,font:s,...r}),this.context&&this._p(),o("init",(()=>{this.font??=d().font,this._p()}))}get width(){return this._w}set width(t){this._d=!0,this._w=t,this._fw=t}get text(){return this._t}set text(t){this._d=!0,this._t=""+t}get font(){return this._f}set font(t){this._d=!0,this._f=t,this._fs=function(t){if(!t)return{computed:0};let e=t.match(w),i=+e[1];return{size:i,unit:e[2],computed:i}}(t).computed}get lineHeight(){return this._lh}set lineHeight(t){this._d=!0,this._lh=t}render(){this._d&&this._p(),super.render()}_p(){this._s=[],this._d=!1;let t=this.context,e=[this.text];if(t.font=this.font,e=this.text.split("\n"),this._fw&&e.map((e=>{let i=e.split(" "),s=i.shift(),r=s;i.map((e=>{r+=" "+e,t.measureText(r).width>this._fw&&(this._s.push(s),r=e),s=r})),this._s.push(r)})),!this._s.length&&this.text.includes("\n")){let i=0;e.map((e=>{this._s.push(e),i=Math.max(i,t.measureText(e).width)})),this._w=this._fw||i}this._s.length||(this._s.push(this.text),this._w=this._fw||t.measureText(this.text).width),this.height=this._fs+(this._s.length-1)*this._fs*this.lineHeight,this._uw()}draw(){let t=0,e=this.textAlign,i=this.context;e=this.textAlign||("rtl"==i.canvas.dir?"right":"left"),t="right"==e?this.width:"center"==e?this.width/2|0:0,this._s.map(((s,r)=>{i.textBaseline="top",i.textAlign=e,i.fillStyle=this.color,i.font=this.font,this.strokeColor&&(i.strokeStyle=this.strokeColor,i.lineWidth=this.lineWidth??1,i.strokeText(s,t,this._fs*this.lineHeight*r)),i.fillText(s,t,this._fs*this.lineHeight*r)}))}}function P(){return new _(...arguments)}let v=new WeakMap,E={},R={},b={0:"left",1:"middle",2:"right"};function A(t=l()){return v.get(t)}function S(t,e){return parseFloat(t.getPropertyValue(e))||0}function I(t){let e=null!=t.button?b[t.button]:"left";R[e]=!0,T(t,"onDown")}function D(t){let e=null!=t.button?b[t.button]:"left";R[e]=!1,T(t,"onUp")}function C(t){T(t,"onOver")}function O(t){v.get(t.target)._oo=null,R={}}function M(t,e,i){let r=function(t){let e=t._lf.length?t._lf:t._cf;for(let i=e.length-1;i>=0;i--){let r=e[i];if(r.collidesWithPointer?r.collidesWithPointer(t):s(t,r))return r}}(t);r&&r[e]&&r[e](i),E[e]&&E[e](i,r),"onOver"==e&&(r!=t._oo&&t._oo&&t._oo.onOut&&t._oo.onOut(i),t._oo=r)}function T(t,e){t.preventDefault();let i=t.target,s=v.get(i),{scaleX:r,scaleY:n,offsetX:h,offsetY:o}=function(t){let{canvas:e,_s:i}=t,s=e.getBoundingClientRect(),r="none"!=i.transform?i.transform.replace("matrix(","").split(","):[1,1,1,1],n=parseFloat(r[0]),h=parseFloat(r[3]),o=(S(i,"border-left-width")+S(i,"border-right-width"))*n,a=(S(i,"border-top-width")+S(i,"border-bottom-width"))*h,c=(S(i,"padding-left")+S(i,"padding-right"))*n,l=(S(i,"padding-top")+S(i,"padding-bottom"))*h;return{scaleX:(s.width-o-c)/e.width,scaleY:(s.height-a-l)/e.height,offsetX:s.left+(S(i,"border-left-width")+S(i,"padding-left"))*n,offsetY:s.top+(S(i,"border-top-width")+S(i,"padding-top"))*h}}(s);t.type.includes("touch")?(Array.from(t.touches).map((({clientX:t,clientY:e,identifier:i})=>{let a=s.touches[i];a||(a=s.touches[i]={start:{x:(t-h)/r,y:(e-o)/n}},s.touches.length++),a.changed=!1})),Array.from(t.changedTouches).map((({clientX:i,clientY:c,identifier:l})=>{let d=s.touches[l];d.changed=!0,d.x=s.x=(i-h)/r,d.y=s.y=(c-o)/n,M(s,e,t),a("touchChanged",t,s.touches),"onUp"==e&&(delete s.touches[l],s.touches.length--,s.touches.length||a("touchEnd"))}))):(s.x=(t.clientX-h)/r,s.y=(t.clientY-o)/n,M(s,e,t))}function L(...t){t.flat().map((t=>{let e=t.context?t.context.canvas:l(),i=v.get(e);if(!i)throw new ReferenceError("Pointer events not initialized for the objects canvas");t.__r||(t.__r=t.render,t.render=function(){i._cf.push(this),this.__r()},i._o.push(t))}))}function k(t,e){let i=t[0].toUpperCase()+t.substr(1);E["on"+i]=e}function N(t){let e=t.canvas;t.clearRect(0,0,e.width,e.height)}let B,G={},j={},z={},V={Enter:"enter",Escape:"esc",Space:"space",ArrowLeft:"arrowleft",ArrowUp:"arrowup",ArrowRight:"arrowright",ArrowDown:"arrowdown"};function W(t=i,e){t._pd&&e.preventDefault(),t(e)}function U(t){let e=V[t.code],i=G[e];z[e]=!0,W(i,t)}function X(t){let e=V[t.code],i=j[e];z[e]=!1,W(i,t)}function Y(){z={}}class ${constructor({create:t,maxSize:e=1024}={}){let i;if(!t||!(i=t())||!(i.update&&i.init&&i.isAlive&&i.render))throw Error("Must provide create() function which returns an object with init(), update(), render(), and isAlive() functions");this._c=t,this.objects=[t()],this.size=0,this.maxSize=e}get(t={}){if(this.size==this.objects.length){if(this.size==this.maxSize)return;for(let t=0;t<this.size&&this.objects.length<this.maxSize;t++)this.objects.push(this._c())}let e=this.objects[this.size];return this.size++,e.init(t),e}getAliveObjects(){return this.objects.slice(0,this.size)}clear(){this.size=this.objects.length=0,this.objects.push(this._c())}update(t){let e,i=!1;for(let s=this.size;s--;)e=this.objects[s],e.update(t),e.isAlive()||(i=!0,this.size--);i&&this.objects.sort(((t,e)=>e.isAlive()-t.isAlive()))}render(){for(let t=this.size;t--;)this.objects[t].render()}}function H(){B??=Date.now(),B|=0,B=B+2654435769|0;let t=B^B>>>16;return t=Math.imul(t,569420461),t^=t>>>15,t=Math.imul(t,1935289751),((t^=t>>>15)>>>0)/4294967296}function K(t,e,i=H){return(i()*(e-t+1)|0)+t}class F{constructor(t,e){Object.assign(this,{state:t,transitions:e})}run(t,...e){this.transitions[this.state];const i=this.transitions[this.state][t];if(i)return i.apply(this,...e)}setState(t){this.state=t}setStateAndRun(t,e="start",...i){this.state=t,this.run(e,...i)}}class q{myvalue;events=[];oneShotEvents=[];get value(){return this.myvalue}set value(t){if("object"==typeof this.myvalue){let e=!0;if(Object.keys(this.myvalue).forEach((i=>{t[i]!=this.myvalue[i]&&(this.myvalue[i]=t[i],e=!1)})),e)return}else if(this.myvalue==t)return;this.myvalue=t,[...this.events,...this.oneShotEvents].forEach((t=>t())),this.oneShotEvents=[]}valueOf(){return this.myvalue}toString(){return"object"==typeof this.myvalue?String(Object.values(this.myvalue)):String(this.myvalue)}constructor(t){this.myvalue=t}listen(t,e=!0,i=!1){i?this.oneShotEvents.push(t):this.events.push(t),e&&t()}}const Z={slots:{x:7,y:7},coinRadius:30,coinBuffer:12,coinPalette:["#ffa600","#ff764a","#ef5675","#bc5090","#7a5195","#5779CC","#0073A8"],fallSpeed:12,fallAccel:1.1,turnsInRound:5,initialTurns:0,roundMode:"rise",comboStyle:1,weightCoins:!0,dirtCoins:!1,freePowers:!1};let J=[],Q={};class tt extends p{constructor(t,...e){let i=null,s=new F("DROPZONE",{IDLE:{drop:()=>s.setStateAndRun("DROPPING","start"),pop:()=>s.setStateAndRun("POPPING","start"),crumble:()=>{0!=this.dirtLayer&&this.machine.setStateAndRun("CRUMBLING","start")},snipe:()=>{this.doomed=!0},changeValue:(t=!0)=>s.setStateAndRun("CHANGEVALUE","start",[t]),restart:()=>s.setStateAndRun("RESTARTING")},DROPZONE:{start:t=>{i=t,this.gridPos.x=i.xPos*(2*Z.coinRadius+Z.coinBuffer),this.x=this.gridPos.x*(2*Z.coinRadius+Z.coinBuffer)},update:()=>{this.gridPos.x=Math.min(Math.max(0,i.xPos),Z.slots.x-1),this.x=this.gridPos.x*(2*Z.coinRadius+Z.coinBuffer)},drop:()=>{this.x=this.gridPos.x*(2*Z.coinRadius+Z.coinBuffer),s.setStateAndRun("DROPPING","start")}},DROPPING:{start:()=>{this.x=this.gridPos.x*(2*Z.coinRadius+Z.coinBuffer),this.dy=Z.fallSpeed,Q.grid[this.gridPos.x][this.gridPos.y]=null;for(let t=this.gridPos.y;t<Z.slots.y&&null===Q.grid[this.gridPos.x][t];t++)this.gridPos.y=t;return Q.grid[this.gridPos.x][this.gridPos.y]=this,-1==this.gridPos.y?Q.gameOver=!0:s.setState("DROPPING"),!0},update:()=>{this.advance(),this.dy*=Z.fallAccel;let t=this.gridPos.y*(2*Z.coinRadius+Z.coinBuffer);this.y>t&&(this.y=t,s.setState("IDLE"))}},POPPING:{start:()=>{if(this.dirtLayer>0&&!this.doomed)s.setState("IDLE");else{let t=this.machine.run("checkVertical"),e=this.machine.run("checkHorizontal");if(t.length>0||e.length>0||this.doomed)return Q.bg.lightup(t.concat(e)),Q.score.value+=1*Q.combo,Q.particles.addEffect("popping",{pos:{x:this.x+Z.coinRadius,y:this.y+Z.coinRadius},color:Z.coinPalette[r.value-1]}),this.doomed||this.machine.run("breakSurrounding"),!0;s.setState("IDLE")}},checkVertical:()=>{let t=[];for(let e=Z.slots.y-1;e>=0&&null!=Q.grid[this.gridPos.x][e];e--)t.push(`${this.gridPos.x},${e}`);return t.length===this.value?t:[]},checkHorizontal:()=>{let t=this.gridPos.x-1,e=[`${this.gridPos.x},${this.gridPos.y}`];for(;t>=0&&null!=Q.grid[t][this.gridPos.y];)e.push(`${t},${this.gridPos.y}`),t--;for(t=this.gridPos.x+1;t<Z.slots.x&&null!=Q.grid[t][this.gridPos.y];)e.push(`${t},${this.gridPos.y}`),t++;return e.length===this.value?e:[]},breakSurrounding:()=>{[[1,0],[-1,0],[0,1],[0,-1]].forEach((t=>{let e=this.gridPos.x+t[0],i=this.gridPos.y+t[1];if(e<0||e>=Z.slots.x)return;if(i<0||i>=Z.slots.y)return;let s=Q.grid[e][i];s&&s.machine.run("crumble")}))},update:()=>{this.fadeout-=.1,this.fadeout<=0&&(s.setState("IDLE"),this.kill())}},CRUMBLING:{start:()=>{Q.particles.addEffect("crumbling",{pos:{x:this.x+Z.coinRadius,y:this.y+Z.coinRadius}}),this.dirtLayer--,setTimeout((()=>s.setState("IDLE")),300)}},CHANGEVALUE:{start:(t=!0)=>{if(this.dirtLayer>0)return s.setState("IDLE");t?this.value++:this.value--,(this.value<=0||this.value>Q.maxCoinValue)&&(this.value=K(1,Q.maxCoinValue),this.dirtLayer=1),s.setState("IDLE")}},RISING:{start:()=>{this.gridPos.y-=1,Q.grid[this.gridPos.x][this.gridPos.y]=this,this.gridPos.y<=-1&&(Q.gameOver=!0)},update:()=>{this.y-=4;let t=this.gridPos.y*(2*Z.coinRadius+Z.coinBuffer);this.y<=t&&(this.machine.setState("IDLE"),this.y=t)}},RESTARTING:{start:()=>{Q.particles.addEffect("popping",{pos:{x:this.x+Z.coinRadius,y:this.y+Z.coinRadius},color:Z.coinPalette[r.value-1]}),this.kill()}},POWERPENDING:{},POWERSELECTED:{},OOB:{}});super(Object.assign({},{gridPos:{x:t,y:-1},x:t*(2*Z.coinRadius+Z.coinBuffer),y:-1*(2*Z.coinRadius+Z.coinBuffer),value:K(1,Q.maxCoinValue),machine:s,dirtLayer:0,opacity:1,fadeout:1,doomed:!1,zIndex:10,update:()=>s.run("update")},...e));let r=this}kill(){Q.grid[this.gridPos.x][this.gridPos.y]=null,this.ttl=0,this.fadeout=0,this.children=[]}}class et extends p{render(){let t=this.context,e={top:-200,bottom:Q.boardDims.height-Z.coinBuffer/2,left:-Z.coinBuffer/2,right:Q.boardDims.width-Z.coinBuffer/2};t.save(),t.moveTo(e.left,e.top),t.lineTo(e.right,e.top),t.lineTo(e.right,e.bottom),t.lineTo(e.left,e.bottom),t.closePath(),t.clip(),[...Q.coins,Q.dropZone.coin].forEach((e=>{if(!e||e.fadeout<1)return;let i=e.dirtLayer>0?e.dirtLayer>1?"#678":"#ABC":Z.coinPalette[e.value-1];t.globalOpacity=e.opacity,t.fillStyle=i,t.lineWidth=2.5,t.strokeStyle=i,t.beginPath(),t.arc(Z.coinRadius+e.x,Z.coinRadius+e.y,Z.coinRadius-3,0,2*Math.PI),t.closePath(),t.fill(),t.beginPath(),t.arc(Z.coinRadius+e.x,Z.coinRadius+e.y,Z.coinRadius,0,2*Math.PI),t.stroke(),t.closePath(),t.fillStyle=e.value>=5?"#CDE":"#311",t.font="bold 26px Arial";const s=0==e.dirtLayer?e.value:"",r=t.measureText(s);t.fillText(0==e.dirtLayer?e.value:"",e.x+Z.coinRadius-r.width/2,e.y+Z.coinRadius+9)})),t.restore()}}class it extends p{constructor(){let t=()=>e.setStateAndRun("LOCKED"),e=new F("ACTIVE",{ACTIVE:{start:()=>{Q.isInGrid(Q.cursorCellPos.value,!0)?(this.opacity=.6,this.xPos=Q.cursorCellPos.value.x):e.run("inactive")},prime:()=>e.setStateAndRun("PRIMED_ACTIVE"),lock:()=>t(),inactive:()=>e.setStateAndRun("INACTIVE")},INACTIVE:{start:()=>this.opacity=0,lock:()=>t(e.setStateAndRun("LOCKED")),active:()=>e.setStateAndRun("ACTIVE")},PRIMED_ACTIVE:{start:()=>this.opacity=1,drop:()=>(Q.coins.push(this.coin),this.coin=null,t(),!0),inactive:()=>e.setStateAndRun("PRIMED_INACTIVE")},PRIMED_INACTIVE:{start:()=>this.opacity=.3,drop:()=>e.setStateAndRun("ACTIVE"),active:()=>e.setStateAndRun("PRIMED_ACTIVE")},LOCKED:{start:()=>this.opacity=0,unlock:()=>e.setStateAndRun("ACTIVE")}});super({xPos:4,opacity:1,machine:e,coin:null,zIndex:-1,render:()=>{let t={x:-Z.coinBuffer/2+this.xPos*(2*Z.coinRadius+Z.coinBuffer),y:-Z.coinBuffer/2,w:2*Z.coinRadius+Z.coinBuffer,h:Q.boardDims.height};this.context.fillStyle="#334353AA",this.context.beginPath(),this.context.fillRect(t.x,t.y,t.w,t.h),this.context.closePath()}}),Q.dropZone=this,Q.cursorCellPos.listen((()=>{Q.isInGrid(Q.cursorCellPos.value,!0)?(this.machine.run("active"),"LOCKED"!=this.machine.state&&(this.xPos=Q.cursorCellPos.value.x)):this.machine.run("inactive")})),Q.addDebugText(e,"state","DropZoneState",2)}}const{slots:st,coinRadius:rt,coinBuffer:nt}=Z;class ht extends p{constructor(){super({cells:{},lightup:t=>{t.forEach((t=>this.cells[t].colour[3]=.3))}});for(let t=0;t<st.x;t++)for(let e=0;e<st.y;e++){let i=new ot({x:t,y:e});this.cells[`${t},${e}`]=i,this.addChild(i)}}}class ot extends y{constructor(t){super({gridPosition:t,fillOpacity:0,colour:[255,255,255,0],render:()=>{const e=this.context,i={x:t.x*(2*rt+nt)-nt/2,y:t.y*(2*rt+nt)-nt/2,w:2*rt+nt,h:2*rt+nt};e.lineWidth=1.5,e.strokeStyle="#345";let s=this.colour;e.fillStyle=`rgba(${s[0]}, ${s[1]}, ${s[2]}, ${s[3]})`,e.fillRect(i.x,i.y,i.w,i.h),e.strokeRect(i.x,i.y,i.w,i.h)},update:()=>{this.colour[3]>0&&(this.colour[3]-=.01)}})}}k("down",(function(t){Q.gameMachine.run("prime")})),k("up",(function(t){Q.gameMachine.run("drop")})),function(t,e,{handler:i="keydown",preventDefault:s=!0}={}){let r="keydown"==i?G:j;e._pd=s,[].concat(t).map((t=>r[t]=e))}("r",(function(t){Q.gameMachine.run("restart")}));const at=Object.freeze({board:t=>Q.coins,row:t=>{let e=[];for(let i=0;i<Z.slots.x;i++){let s=Q.grid[i][t.y];s&&e.push(s)}return e},column:t=>{let e=[];for(let i=0;i<Z.slots.y;i++){let s=Q.grid[t.x][i];s&&e.push(s)}return e},cell:t=>{let e=Q.grid[t.x][t.y];return e?[e]:[]},adjacent:t=>{let e=[Q.grid[t.x][t.y]];for(let i=-1;i<=1;i+=2)try{let s=Q.grid[t.x+i][t.y];s&&e.push(s)}catch{}for(let i=-1;i<=1;i+=2)try{let s=Q.grid[t.x][t.y+i];s&&e.push(s)}catch{}return e},surrounding:t=>{let e=[];for(let i=-1;i<=1;i++)for(let s=-1;s<=1;s++)try{let r=Q.grid[t.x+i][t.y+s];r&&e.push(r)}catch{}return e}}),ct=Object.freeze({blank:t=>{console.log("Power does nothing")},dig:t=>{t.forEach((t=>{t.machine.run("crumble")}))},destroy:t=>{t.forEach((t=>{t.machine.run("snipe")}))},increase:t=>{t.forEach((t=>{t.machine.run("changeValue",[!0])}))},decrease:t=>{t.forEach((t=>{t.machine.run("changeValue",[!1])}))}});class lt{constructor(){this.name="[ADD NAME]",this.description="A power",this.range=at.board,this.effect=ct.blank,this.useTurn=!0,this.pointsRequired=100,this.filter=t=>!0,this.effectDelay=300}highlightTargets=()=>Q.coins.map((t=>{this.filter(t)||(t.opacity=.3)}));activate=t=>{Q.coins.forEach((t=>t.opacity=1)),this.effect(this.range(t))}}class dt extends lt{constructor(){super(),this.name="Dig",this.description="Remove one layer of dirt from all buried coins.",this.range=at.surrounding,this.effect=ct.dig,this.filter=t=>t.dirtLayer>0}}class ut extends lt{constructor(){super(),this.name="Snipe",this.description="Destroys coin with tactical precision.",this.range=at.cell,this.effect=ct.destroy,this.effectDelay=0,this.pointsRequired=60}}class ft extends lt{constructor(){super(),this.name="Increase",this.description="Increases value of coins in range by one (7s become buried coins and their values are randomised).",this.range=at.row,this.effect=ct.increase,this.filter=t=>0===t.dirtLayer,this.pointsRequired=80}}class xt extends p{constructor(){super({x:147,y:Q.boardDims.height+10,zIndex:50,powerSlots:[],render:()=>{const t=this.context;t.lineWidth=4,t.strokeStyle="#567",t.strokeRect(0,0,200,70),this.powerSlots.forEach(((e,i)=>{t.beginPath(),t.arc(60*i+15+25,35,25,0,2*Math.PI),t.closePath(),t.stroke()}))}});let t=[dt,ut,ft];for(let e=0;e<3;e++){const i=new gt(new(0,t[e]),{x:60*e+15+25,y:35});this.addChild(i),this.powerSlots.push(i)}}}class gt extends p{constructor(e=null,i={}){let s={x:0,y:0},r={x:i.x,y:i.y},n=new F("LOCKED",{LOCKED:{drag:()=>console.log(this.meter)},UNLOCKED:{start:()=>{Q.coins.map((t=>t.opacity=1))},drag:()=>n.setStateAndRun("SELECT")},SELECT:{start:()=>{s.x=A().x,s.y=A().y,this.parent.children.sort(((t,e)=>t===this?1:-1)),this.power.highlightTargets(),Q.gameMachine.run("pendPower")},release:()=>{this.x=r.x,this.y=r.y,s={x:0,y:0},Q.gameMachine.run("cancel"),n.setStateAndRun("UNLOCKED")},update:()=>{let e={};e.x=A().x-s.x+r.x,e.y=A().y-s.y+r.y,this.x=t(r.x,e.x,.3),this.y=t(r.y,e.y,.3),Math.sqrt((this.x-r.x)**2+(this.y-r.y)**2)>15&&n.setState("DRAG")}},DRAG:{release:()=>{n.setStateAndRun("SNAPBACK"),s={x:0,y:0},this.valid?Q.gameMachine.run("activate",[this.power]):Q.gameMachine.run("cancel"),this.valid=!1},update:()=>{this.x=A().x-s.x+r.x,this.y=A().y-s.y+r.y,this.valid=null!=function(){const t=Q.cursorCellPos.value;return t.x>=0&&t.x<Z.slots.x&&t.y>=0&&t.y<Z.slots.y?t:null}(),this.valid?Q.powerCursor.targets=this.power.range(Q.cursorCellPos.value):Q.powerCursor.targets=[]}},SNAPBACK:{start:()=>{Q.powerCursor.targets=[],this.valid&&(this.x=r.x,this.y=r.y,this.prevScore=Q.score.value,this.meter=0,n.setStateAndRun("LOCKED")),this.lerpPos=.01},update:()=>{this.x=t(this.x,r.x,this.lerpPos),this.y=t(this.y,r.y,this.lerpPos),Math.abs(this.x-r.x)<1&&Math.abs(this.y-r.y)<1&&(this.x=r.x,this.y=r.y,n.setStateAndRun("UNLOCKED")),this.lerpPos=t(this.lerpPos,1,.2)}}});super(Object.assign({},{power:e,machine:n,meter:1,prevScore:0,stock:0,radius:22,anchor:{x:.5,y:.5},valid:!1,render:()=>{const t=this.context;t.lineWidth=2.5,t.strokeStyle=this.valid?"#FFF":"#CCC",t.fillStyle="#333",t.beginPath(),t.arc(22,20,25,0,2*Math.PI),t.closePath(),t.fill(),t.beginPath(),t.arc(22,20,25,2*Math.PI*-.25,2*Math.PI*(this.meter-.25)),1!==this.meter&&t.lineTo(22,20),t.closePath(),t.fillStyle=this.valid?"#888":"#555",t.fill(),1===this.meter&&t.stroke()},collidesWithPointer:t=>{let e=Q.getWorldPos(this),i=t.x-e.x,s=t.y-e.y;return Math.sqrt(i**2+s**2)<this.radius},onDown:()=>{"INPUT"==Q.gameMachine.state&&this.machine.run("drag")},onOver:()=>{},onOut:()=>{},update:()=>{this.advance(),this.machine.run("update"),R["left"]||this.machine.run("release")}},i)),this.addChild(new P({color:"white",text:this.power.name,font:"bold 10px Arial",textAlign:"center",width:40,x:-20,y:-5})),Q.score.listen((()=>{this.meter=Z.freePowers?1:Math.min(1,(Q.score-this.prevScore)/e.pointsRequired),1===this.meter&&n.setStateAndRun("UNLOCKED")})),L(this)}}class yt extends p{constructor(){super({targets:[],zIndex:20,render:()=>{if("HIDDEN"===this.machine.state)return;let t=this.context,e=2*Z.coinRadius+Z.coinBuffer,i=Z.coinBuffer/2;this.targets.forEach((s=>{s&&(t.strokeStyle="#FFF",t.lineWidth=2,t.strokeRect(s.x-i,s.y-i,e,e))}))}}),this.machine=new F("VISIBLE",{HIDDEN:{start:()=>{},show:()=>{}},VISIBLE:{start:()=>{},hide:()=>{}}})}}class pt extends y{constructor(){super({x:-30-Z.coinBuffer,y:Z.coinBuffer/2,render:()=>{let t=this.context;for(let e=0;e<Z.turnsInRound;e++)t.fillStyle=t.strokeStyle="#678",Q.remainingTurns>e&&t.fillRect(0,30*e,20,20),t.strokeRect(0,30*e,20,20)}})}}class mt extends y{constructor(){super({x:Q.boardDims.width+Z.coinBuffer+24,y:Z.coinBuffer/2+24,radius:24,colour:"#678",machine:new F("IDLE",{IDLE:{},PULSING:{},HOVERED:{},RESTARTING:{}}),collidesWithPointer:t=>{let e=Q.getWorldPos(this),i=t.x-e.x,s=t.y-e.y;return Math.sqrt(i**2+s**2)<this.radius},onDown:()=>{Q.gameMachine.run("restart")},onOver:()=>{this.colour="white"},onOut:()=>{this.colour="#678"},render:()=>{let t=this.context;t.beginPath(),t.fillStyle=t.strokeStyle=this.colour,t.arc(0,0,24,0,2*Math.PI),t.translate(-12.8,-12.8),t.lineWidth=2,t.stroke(),t.scale(.05,.05),t.lineWidth=16,[new Path2D("M444.84 83.16c-46.804-51.108-114.077-83.16-188.84-83.16-141.385 0-256 114.615-256 256h48c0-114.875 93.125-208 208-208 61.51 0 116.771 26.709 154.848 69.153l-74.848 74.847h176v-176l-67.16 67.16z"),new Path2D("M464 256c0 114.875-93.125 208-208 208-61.51 0-116.771-26.709-154.847-69.153l74.847-74.847h-176v176l67.16-67.16c46.804 51.108 114.077 83.16 188.84 83.16 141.385 0 256-114.615 256-256h-48z")].forEach((e=>{t.fill(e),t.stroke(e)})),t.closePath()}}),L(this)}}const wt={color:"#ABC",height:6,width:6,count:20,ttl:60,rotation:2*Math.PI*Math.random(),gravity:0,decel:.97,shrink:.3,vector:{x:0,y:0},border:0,anchor:{x:.5,y:.5},randomise:function(t){Pt(this,t)},update:function(){this.advance(),this.dx*=this.decel,this.dy=0==this.gravity?this.dy*this.decel:this.dy+this.gravity,this.height-=this.shrink,this.width-=this.shrink,this.height<=0?this.ttl=0:this.ttl--}},_t={popping:{...wt,height:14,width:14,gravity:.5,shrink:.4,ttl:100},breaking:{...wt,count:20,decel:.98,ttl:100,height:8,width:8,shrink:.12,randomise:function(t){Pt(this),this.dx=this.dy=0}},crumbling:{...wt,count:20,decel:.98,ttl:100,shrink:.1,randomise:function(t){Pt(this),this.dx=this.dy=0}}};function Pt(t,e){let i=360*e*Math.PI/180;t.vector.x=Math.sin(i),t.vector.y=Math.cos(i),t.x=t.pos.x+t.vector.x*Z.coinRadius+Q.camera.x,t.y=t.pos.y+t.vector.y*Z.coinRadius+Q.camera.y,t.dx=t.vector.x*Math.random()*2,t.dy=t.vector.y*Math.random()*2,t.rotation=Math.random()}let{canvas:vt}=function(t,{contextless:e=!1}={}){if(r=document.getElementById(t)||t||document.querySelector("canvas"),e&&(r=r||new Proxy({},c)),!r)throw Error("You must provide a canvas element for the game");return n=r.getContext("2d")||new Proxy({},c),n.imageSmoothingEnabled=!1,a("init"),{canvas:r,context:n}}(),Et=new class extends p{constructor(){super(),this.pool=function(){return new $(...arguments)}({create:m}),Q.particles=this}addEffect(t,e){let i={..._t[t]??wt,...e};for(let t=0;t<i.count;t++)i.randomise(t/i.count),this.pool.get(i)}update(){this.pool.update()}render(){this.pool.render()}};(function({radius:t=5,canvas:e=l()}={}){let i=v.get(e);if(!i){let s=window.getComputedStyle(e);i={x:0,y:0,radius:t,touches:{length:0},canvas:e,_cf:[],_lf:[],_o:[],_oo:null,_s:s},v.set(e,i)}e.addEventListener("mousedown",I),e.addEventListener("touchstart",I),e.addEventListener("mouseup",D),e.addEventListener("touchend",D),e.addEventListener("touchcancel",D),e.addEventListener("blur",O),e.addEventListener("mousemove",C),e.addEventListener("touchmove",C),i._t||(i._t=!0,o("tick",(()=>{i._lf.length=0,i._cf.map((t=>{i._lf.push(t)})),i._cf.length=0})))})(),function(){let t;for(t=0;t<26;t++)V["Key"+String.fromCharCode(t+65)]=String.fromCharCode(t+97);for(t=0;t<10;t++)V["Digit"+t]=V["Numpad"+t]=""+t;window.addEventListener("keydown",U),window.addEventListener("keyup",X),window.addEventListener("blur",Y)}();class Rt{constructor(){Q={gameMachine:null,camera:null,bg:null,grid:Array.from({length:Z.slots.x},(t=>Array.from({length:Z.slots.y},(t=>null)))),boardDims:{height:Z.slots.y*(2*Z.coinRadius+Z.coinBuffer),width:Z.slots.x*(2*Z.coinRadius+Z.coinBuffer)},dropZone:null,maxCoinValue:Math.max(Z.slots.x,Z.slots.y),coinWeights:null,remainingTurns:Z.initialTurns,coins:[],score:new q(0),cursorCellPos:new q({x:0,y:0}),combo:1,gameOver:!1,addDebugText:(t,e,i,s=0)=>{J.push({name:i||"",object:t,value:e,order:s}),J.sort(((t,e)=>(t.order>e.order)-(t.order<e.order)))},getDebugText:(t="\n")=>{let e="";return J.forEach(((i,s)=>{e=e.concat(i.name,i.name&&": ",i.object[i.value]),s!=J.length-1&&(e=e.concat(t))})),e},resetDebugText:()=>J=[],isInGrid:(t,e=!1)=>!(t.x<0||t.x>=Z.slots.x||!e&&t.y<0||t.y>=Z.slots.y),getWorldPos:t=>{let e={x:0,y:0};for(;t;)e.x+=t.x,e.y+=t.y,t=t.parent;return e}},Q.coinWeights=Object.fromEntries(Array.from({length:Q.maxCoinValue+(Z.dirtCoins?1:0)},((t,e)=>[e+1,1]))),Q.resetDebugText(),Q.addDebugText(Q,"combo","Combo",2),Q.particles=Et,this.dropZone=new it,this.changes=null,this.gridBg=Q.bg=new ht,this.powerCursor=Q.powerCursor=new yt,this.machine=Q.gameMachine=new F("NEXTROUND",{INPUT:{start:()=>{if(Q.combo=1,Q.gameOver)e.setStateAndRun("GAMEOVER");else if(s.machine.run("unlock"),!s.coin){let t=function(t){const{weightCoins:e,slots:i}=Z,{coinWeights:s,maxCoinValue:r}=Q;if(!e)return K(0,i.x-1);let n=0,h=K(0,Object.values(s).reduce(((t,e)=>t+e),0)),o=null;for(let t=1;t<=Object.keys(s).length;t++)if(n+=s[t],h<=n){o=t;break}Object.keys(s).forEach((t=>s[t]+=Object.keys(s).length)),s[o]=1;let a=o>r;return new tt(t,{value:a?K(1,r):o,dirtLayer:a?K(1,2):0})}(s.x);s.coin=t,t.machine.run("start",[s]),this.camera.addChild(t)}},prime:()=>{s.machine.run("prime"),this.camera.children=this.camera.children.filter((t=>t.ttl>0))},drop:()=>{s.machine.run("drop")&&(Q.remainingTurns--,e.setStateAndRun("DROPPING"))},pendPower:()=>{s.machine.run("lock"),e.setStateAndRun("POWERPENDING")},power:t=>{e.setStateAndRun("POWER","start",[t])},restart:()=>this.restart()},DROPPING:{start:()=>{Q.coins.sort(((t,e)=>(t.gridPos.y<e.gridPos.y)-(t.gridPos.y>e.gridPos.y))),Q.coins.forEach((t=>{t.machine.run("drop")})),t=Q.coins.filter((t=>!["IDLE","DROPZONE"].includes(t.machine.state))).length},update:()=>{Q.gameOver?e.setStateAndRun("GAMEOVER"):0===Q.coins.filter((t=>"IDLE"!==t.machine.state)).length&&e.setStateAndRun("POPPING")}},POPPING:{start:()=>{Q.coins.forEach((t=>{t.machine.run("pop")})),t=Q.coins.filter((t=>"IDLE"!==t.machine.state)).length},update:()=>{Q.coins=Q.coins.filter((t=>t.isAlive())),0===Q.coins.filter((t=>!["IDLE","DROPZONE"].includes(t.machine.state))).length&&(t>0?(this.machine.setStateAndRun("DROPPING"),Q.combo++):e.setStateAndRun("NEXTROUND"))}},POWERPENDING:{start:()=>{},cancel:()=>{e.setStateAndRun("INPUT")},activate:t=>{e.setStateAndRun("POWER","start",[t])}},POWER:{start:t=>{if(!t)return e.setStateAndRun("INPUT");t.useTurn&&Q.remainingTurns--,t.activate(Q.cursorCellPos.value),setTimeout((()=>e.setStateAndRun("POPPING")),t.effectDelay)}},NEXTROUND:{start:()=>{if(Q.remainingTurns>0)e.setStateAndRun("INPUT");else{let t="rise"==Z.roundMode?"RISING":"DROPPING";Q.remainingTurns=Z.turnsInRound,Q.coins.forEach((e=>{e.machine.setStateAndRun(t)}));let e=null;for(let i=0;i<Z.slots.x;i++){let s;do{s=K(1,Q.maxCoinValue)}while(s===e);e=s;let r=new tt(i,{gridPos:{x:i,y:"rise"==Z.roundMode?Z.slots.y:-1},y:"rise"==Z.roundMode?Q.boardDims.height:2*-Z.coinRadius-Z.coinBuffer,dirtLayer:2,value:s});Q.coins.push(r),r.machine.setStateAndRun(t),this.camera.addChild(r)}this.zSort()}},update:()=>{let t=0===Q.coins.filter((t=>"IDLE"!==t.machine.state)).length;Q.gameOver?e.setStateAndRun("GAMEOVER"):t&&e.setStateAndRun("POPPING")}},GAMEOVER:{start:()=>s.machine.run("lock"),restart:()=>this.restart()}});let{changes:t,machine:e,camera:i,dropZone:s}=this;this.camera=Q.camera=y({x:350-(Z.coinRadius+Z.coinBuffer)*(Z.slots.x-1)+Z.coinBuffer/2,y:2*Z.coinRadius+2*Z.coinBuffer}),this.debugText=P({y:Q.boardDims.height+10,color:"white",text:"hello",font:"bold 12px Arial",update:()=>{this.debugText.text=Q.getDebugText("\n\n")}}),this.score=P({x:Q.boardDims.width-Z.coinBuffer,y:Q.boardDims.height+10,color:"white",text:"hello",anchor:{x:1,y:0},textAlign:"right",font:"bold 28px Arial",update:()=>{this.score.text=`${Q.score}`}}),Q.addDebugText(e,"state",null,3),this.camera.addChild(s,new et,this.gridBg,this.score,new pt,new mt,this.powerCursor,new xt),e.run("start")}update(){this.camera.update(),this.machine.run("update"),Q.cursorCellPos.value=function(){let t=function(){const t=(({x:t,y:e})=>({x:t,y:e}))(A());return Object.keys(t).forEach((function(e,i){t[e]-=Q.camera[e]-Z.coinBuffer/2})),t}();return Object.keys(t).forEach((function(e,i){t[e]=Math.floor(t[e]/(2*Z.coinRadius+Z.coinBuffer))})),t}()}restart(){let t=e=>{if(e!=Z.slots.x){for(let t=-1;t<Z.slots.y;t++)Q.grid[e][t]&&Q.grid[e][t].machine.run("restart");setTimeout((()=>t(e+1)),30)}else setTimeout((()=>bt.game=new Rt),400)};t(0)}zSort(){this.camera.children.sort(((t,e)=>(t.zIndex>e.zIndex)-(t.zIndex<e.zIndex)))}}let bt={game:new Rt};(function({fps:t=60,clearCanvas:e=!0,update:s=i,render:r,context:n=d(),blur:h=!1}={}){if(!r)throw Error("You must provide a render() function");let c,l,u,f,x,g=0,y=1e3/t,p=1/t,m=e?N:i,w=!0;function _(){if(l=requestAnimationFrame(_),w&&(u=performance.now(),f=u-c,c=u,!(f>1e3))){for(g+=f;g>=y;)a("tick"),x.update(p),g-=y;m(x.context),x.render()}}return h||(window.addEventListener("focus",(()=>{w=!0})),window.addEventListener("blur",(()=>{w=!1}))),o("init",(()=>{x.context??=d()})),x={update:s,render:r,isStopped:!0,context:n,start(){this.isStopped&&(c=performance.now(),this.isStopped=!1,requestAnimationFrame(_))},stop(){this.isStopped=!0,cancelAnimationFrame(l)},_frame:_,set _last(t){c=t}},x})({update:()=>{null!=bt.game&&bt.game.update(),Et.update()},render:()=>{bt.game.camera.render(),Et.render()}}).start()})();