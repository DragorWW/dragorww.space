var g=Object.defineProperty;var C=(a,t,n)=>t in a?g(a,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):a[t]=n;var l=(a,t,n)=>C(a,typeof t!="symbol"?t+"":t,n);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))o(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const h of r.addedNodes)h.tagName==="LINK"&&h.rel==="modulepreload"&&o(h)}).observe(document,{childList:!0,subtree:!0});function n(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(i){if(i.ep)return;i.ep=!0;const r=n(i);fetch(i.href,r)}})();(()=>{const a={MAX_FPS:60,MIN_FRAME_TIME:16.666666666666668,FONT_SIZE:30,FONT_FAMILY:"Fira Code, monospace",COLUMN_SPACING:.1,MAX_ACTIVE_COLUMNS_RATIO:5.55,SPAWN_RATE:.5,DESPAWN_RATE:.1,TRAIL_OPACITY:.15,MIN_SCROLL_OPACITY:.2,SYMBOL_UPDATE_RATE:.2},t={COLORS:{OPERATORS:"229, 192, 123",KEYWORDS:"198, 120, 221",FUNCTIONS:"97, 175, 239",STRINGS:"152, 195, 121",COMMENTS:"92, 99, 112",CONSTANTS:"224, 108, 117",BRACKETS:"209, 154, 102"},MIN_OPACITY:.4,MAX_OPACITY:.8,MIN_SPEED:.01,MAX_SPEED:.1},n={OPERATORS:[">=","<=","=>","->","<>","===","!==","||","&&","++","--"],KEYWORDS:["import","export","default","class","const","let","var","function","return","await","async"],FUNCTIONS:["try","catch","finally","break","continue","for","while","if","else","switch","case","do"],STRINGS:["...","?.","::"],COMMENTS:["<!--","-->","/**","*/","//","/*","*/"],CONSTANTS:["=>==","#!/"],BRACKETS:["[]","{}","()","<>","</>"]},o={PIXEL_SIZE:8,MIN_OPACITY:.02,MAX_OPACITY:.15,FADE_SPEED:.001,MAX_PIXELS:300,MOUSE_INFLUENCE_RADIUS:150,MOUSE_REPEL_STRENGTH:1,RETURN_SPEED:.05},i={light:{background:"rgba(255, 255, 255, 1)",pixelColor:"0, 0, 0",minOpacity:.05,maxOpacity:.25},dark:{background:"rgba(17, 17, 17, 1)",pixelColor:"255, 255, 255",minOpacity:.02,maxOpacity:.15}};class r{constructor(e,s=1e3){this.canvas=document.getElementById(e),this.ctx=this.canvas.getContext("2d"),this.startDelay=s,this.mousePosition={x:-1e3,y:-1e3},this.currentTheme=document.documentElement.getAttribute("data-theme")||"dark",this.setupCanvas(),this.ctx.fillStyle=i[this.currentTheme].background,this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height),this.isInitialized=!1,this.pixels=[],this.setupBackground(),this.bindEvents(),this.themeObserver=new MutationObserver(c=>{c.forEach(d=>{d.attributeName==="data-theme"&&(this.currentTheme=document.documentElement.getAttribute("data-theme")||"dark")})}),this.themeObserver.observe(document.documentElement,{attributes:!0,attributeFilter:["data-theme"]})}initialize(){this.isInitialized||(this.setupMeasureCanvas(),this.initializeArrays(),this.bindEvents(),this.lastTime=0,this.isInitialized=!0)}setupCanvas(){this.canvas.width=window.innerWidth,this.canvas.height=window.innerHeight}setupMeasureCanvas(){this.measureCanvas=document.createElement("canvas"),this.measureCtx=this.measureCanvas.getContext("2d"),this.measureCtx.font=`${a.FONT_SIZE}px ${a.FONT_FAMILY}`;const e=Object.values(n).flat();this.maxCharWidth=Math.max(...e.map(s=>this.measureCtx.measureText(s).width)),this.columnWidth=this.maxCharWidth+a.FONT_SIZE*a.COLUMN_SPACING}initializeArrays(){this.columns=Math.floor(this.canvas.width/this.columnWidth),this.drops=Array(this.columns).fill(1),this.activeColumns=new Set,this.opacities=Array(this.columns).fill(t.MAX_OPACITY),this.speeds=Array(this.columns).fill(1),this.currentSymbols=new Map,this.symbolUpdateCounters=new Map}bindEvents(){window.addEventListener("resize",()=>this.handleResize()),window.addEventListener("scroll",()=>this.handleScroll()),document.addEventListener("mousemove",e=>{const s=this.canvas.getBoundingClientRect();this.mousePosition={x:e.clientX-s.left,y:e.clientY-s.top+window.scrollY}}),document.addEventListener("mouseleave",()=>{this.mousePosition={x:-1e3,y:-1e3}})}handleResize(){this.canvas.width=window.innerWidth,this.canvas.height=window.innerHeight,this.setupBackground();const e=Math.floor(this.canvas.width/this.columnWidth);this.drops.length=e,this.opacities.length=e,this.speeds.length=e,this.drops.fill(1),this.opacities.fill(t.MAX_OPACITY),this.speeds.fill(1),this.activeColumns.clear(),this.currentSymbols.clear(),this.symbolUpdateCounters.clear()}handleScroll(){const e=window.scrollY/(document.documentElement.scrollHeight-window.innerHeight);this.canvas.style.opacity=Math.max(a.MIN_SCROLL_OPACITY,1-e)}draw(e){requestAnimationFrame(c=>this.draw(c)),!(e-this.lastTime<a.MIN_FRAME_TIME)&&(this.lastTime=e,this.ctx.fillStyle=i[this.currentTheme].background,this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height),this.updatePixels(),this.spawnNewColumns(),this.updateActiveColumns())}isColumnAvailable(e){for(const c of this.activeColumns)if(Math.abs(c-e)<3)return!1;return!0}spawnNewColumns(){if(this.activeColumns.size<this.columns*a.MAX_ACTIVE_COLUMNS_RATIO&&Math.random()>a.SPAWN_RATE){let e=10,s;do s=Math.floor(Math.random()*this.columns),e--;while((this.activeColumns.has(s)||!this.isColumnAvailable(s))&&e>0);e>0&&!this.activeColumns.has(s)&&this.isColumnAvailable(s)&&(this.activeColumns.add(s),this.drops[s]=1,this.speeds[s]=t.MIN_SPEED+Math.random()*(t.MAX_SPEED-t.MIN_SPEED),this.opacities[s]=t.MIN_OPACITY+Math.random()*(t.MAX_OPACITY-t.MIN_OPACITY))}}updateActiveColumns(){for(const e of this.activeColumns){if(!this.currentSymbols.has(e)||!this.symbolUpdateCounters.has(e)||Math.random()<a.SYMBOL_UPDATE_RATE){const u=Object.keys(n),p=u[Math.floor(Math.random()*u.length)],y=n[p],E=y[Math.floor(Math.random()*y.length)];this.currentSymbols.set(e,{text:E,category:p}),this.symbolUpdateCounters.set(e,0)}const{text:s,category:c}=this.currentSymbols.get(e),d=e*this.columnWidth+(this.columnWidth-this.measureCtx.measureText(s).width)/2;this.ctx.fillStyle=`rgba(${t.COLORS[c]}, ${this.opacities[e]})`,this.ctx.font=`${a.FONT_SIZE}px ${a.FONT_FAMILY}`,this.ctx.fillText(s,d,this.drops[e]*a.FONT_SIZE),this.symbolUpdateCounters.set(e,(this.symbolUpdateCounters.get(e)||0)+1),this.drops[e]*a.FONT_SIZE>this.canvas.height&&(Math.random()>a.DESPAWN_RATE?(this.activeColumns.delete(e),this.drops[e]=1,this.speeds[e]=1,this.opacities[e]=t.MAX_OPACITY,this.currentSymbols.delete(e),this.symbolUpdateCounters.delete(e)):this.drops[e]=0),this.drops[e]+=this.speeds[e]}}setupBackground(){const e=i[this.currentTheme];this.pixels=Array(o.MAX_PIXELS).fill(null).map(()=>({x:Math.random()*this.canvas.width,y:Math.random()*this.canvas.height,originalX:Math.random()*this.canvas.width,originalY:Math.random()*this.canvas.height,size:o.PIXEL_SIZE+Math.random()*o.PIXEL_SIZE*2,opacity:e.minOpacity+Math.random()*(e.maxOpacity-e.minOpacity),fadeDirection:Math.random()>.5?1:-1}))}updatePixels(){const e=i[this.currentTheme];this.pixels.forEach(s=>{if(s.opacity+=o.FADE_SPEED*s.fadeDirection,(s.opacity<=e.minOpacity||s.opacity>=e.maxOpacity)&&(s.fadeDirection*=-1),this.mousePosition){const c=s.x-this.mousePosition.x,d=s.y-this.mousePosition.y,u=Math.sqrt(c*c+d*d);if(u<o.MOUSE_INFLUENCE_RADIUS){const p=(o.MOUSE_INFLUENCE_RADIUS-u)/o.MOUSE_INFLUENCE_RADIUS;s.x+=c/u*p*o.MOUSE_REPEL_STRENGTH,s.y+=d/u*p*o.MOUSE_REPEL_STRENGTH}}s.x+=(s.originalX-s.x)*o.RETURN_SPEED,s.y+=(s.originalY-s.y)*o.RETURN_SPEED,this.ctx.fillStyle=`rgba(${i[this.currentTheme].pixelColor}, ${s.opacity})`,this.ctx.fillRect(s.x,s.y,s.size,s.size)})}start(){setTimeout(()=>{this.initialize(),requestAnimationFrame(e=>this.draw(e))},this.startDelay)}destroy(){this.themeObserver.disconnect()}}const h=(m,e=1e3)=>{const s=new r(m,e);return s.start(),s};window.initMatrixAnimation=h})();class T{constructor(t){l(this,"preventScroll",()=>{this.autoScrollEnabled&&(this.terminal.scrollTop=this.savedScrollTop)});this.terminal=t,this.autoScrollEnabled=!0,this.savedScrollTop=0,this.resizeObserver=new ResizeObserver(()=>{this.scrollToBottom()}),this.observeLastPrompt()}observeLastPrompt(){const t=this.terminal.querySelector(".terminal__prompt:last-child");t&&(this.resizeObserver.disconnect(),this.resizeObserver.observe(t))}disableScroll(){this.terminal.style.overflowY="hidden",this.savedScrollTop=this.terminal.scrollTop,this.terminal.addEventListener("scroll",this.preventScroll)}enableScroll(){this.terminal.style.overflowY="auto",this.terminal.removeEventListener("scroll",this.preventScroll)}disableAutoScroll(){this.autoScrollEnabled=!1,this.savedScrollTop=this.terminal.scrollTop}enableAutoScroll(){this.autoScrollEnabled=!0}scrollToBottom(){this.autoScrollEnabled&&(this.savedScrollTop=this.terminal.scrollHeight-this.terminal.clientHeight,this.terminal.scrollTop=this.savedScrollTop)}smoothScrollToBottom(){this.autoScrollEnabled&&this.terminal.scrollTo({top:this.terminal.scrollHeight,behavior:"smooth"})}restoreScroll(){this.terminal.scrollTop=this.savedScrollTop}}class S{constructor(){l(this,"commandDelay",50);l(this,"commandPause",1e3);l(this,"currentDirectory","");l(this,"currentBranch","");l(this,"currentInput","");l(this,"commandHistory",[]);l(this,"historyIndex",-1);l(this,"isAnimating",!1);l(this,"hints",["где ты работаешь?","какие проекты делал?","расскажи про опыт работы","как с тобой связаться?","какие технологии используешь?","где тебя найти в соцсетях?","help - список всех команд"]);l(this,"hintDelay",1500);l(this,"typeDelay",60);l(this,"eraseDelay",30);l(this,"pauseDelay",1e3);l(this,"betweenHintsDelay",300);l(this,"hintIndex",0);l(this,"hintTimeout",null);l(this,"isShowingHint",!1);l(this,"isInitializing",!0);l(this,"isAnimating",!0);l(this,"hasAISupport","userAgentData"in navigator&&"speechRecognition"in window);l(this,"HF_API_TOKEN","hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");l(this,"MODEL_URL","https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill");this.container=document.querySelector(".terminal__history"),this.terminalContent=document.querySelector(".terminal__content"),this.scrollManager=new T(this.terminalContent),this.initialize(),this.startHintCycle()}async initialize(){this.loadCommands(),this.scrollManager.disableScroll(),await this.simulateCommand("welcome");const t=["about","skills","projects"];for(const n of t)await this.sleep(this.commandPause),await this.simulateCommand(n);await this.sleep(this.commandPause),this.isAnimating=!1,this.isInitializing=!1,this.scrollManager.enableScroll(),this.setupEventListeners(),this.handlePrompt({showCursor:document.activeElement===this.terminalContent,action:"append"}),setTimeout(()=>{this.currentInput||this.startHintCycle()},1e3)}loadCommands(){const t={};document.querySelectorAll(".terminal__command").forEach(n=>{const o=n.dataset.command;t[o]={description:n.dataset.description||"",directory:n.dataset.directory||"",branch:n.dataset.branch||"",command:n.dataset.command||o,execute:()=>n.querySelector("template").innerHTML.trim()}}),this.commands=t}handlePrompt({command:t="",showCursor:n=!1,action:o="create",isHint:i=!1}={}){const r=n&&(document.activeElement===this.terminalContent||this.isInitializing),h=`
            <span class="terminal__prompt">
                ${this.currentDirectory?`<span class="terminal__prompt-path">${this.currentDirectory}</span>`:""}
                ${this.currentBranch?`<span class="terminal__prompt-branch">(${this.currentBranch})</span>`:""}
                <span class="terminal__prompt-symbol">$</span> 
                <span class="terminal__prompt-input ${i?"hint":""}">${t}${r?'<span class="terminal__prompt-cursor">█</span>':""}</span>
            </span>`;switch(o){case"create":const m=document.createElement("p");return m.innerHTML=h,m;case"update":const e=this.container.lastElementChild;return e.innerHTML=h,i||(this.container.appendChild(e),this.scrollManager.observeLastPrompt(),this.scrollManager.scrollToBottom()),e;case"append":const s=document.createElement("p");return s.innerHTML=h,i||(this.container.appendChild(s),this.scrollManager.observeLastPrompt(),this.scrollManager.scrollToBottom()),s}}sendAnalytics(t,n){typeof gtag=="function"?gtag("event",t,{event_category:"Terminal",...n}):console.debug("Google Analytics not available")}async runCommand(t){if(t.command==="clear"){this.container.innerHTML="";return}const n=t.execute(),o=document.createElement("div");o.innerHTML=n;const i=Array.from(o.children);for(let r=0;r<i.length;r++){const h=i[r],m=document.createElement("div");m.classList.add("terminal__output"),m.appendChild(h),this.container.appendChild(m),this.scrollManager.scrollToBottom(),r<i.length-1&&await this.sleep(500)}t.directory&&(this.currentDirectory=t.directory),t.branch&&(this.currentBranch=t.branch)}async simulateCommand(t){const n=this.commands[t],o=n.command||t;let i=this.handlePrompt({action:"append"}),r="";for(const h of o)await this.sleep(this.commandDelay),r+=h,i.innerHTML=this.handlePrompt({command:r,action:"create"}).innerHTML,this.scrollManager.scrollToBottom();await this.sleep(500),await this.runCommand(n)}async executeCommand(){const t=this.currentInput.trim().toLowerCase();if(t){this.sendAnalytics("terminal_command",{event_label:t,value:1}),this.isAnimating=!0,this.commandHistory.unshift(t),this.historyIndex=-1;const n=this.container.lastElementChild;if(n.innerHTML=this.handlePrompt({command:this.currentInput,action:"update"}).innerHTML,this.commands[t])await this.runCommand(this.commands[t]);else{const o=await this.tryAIResponse(t);if(o){const i=document.createElement("div");i.innerHTML=o,this.container.appendChild(i.firstElementChild),this.scrollManager.scrollToBottom()}}this.isAnimating=!1}this.currentInput="",this.handlePrompt({showCursor:!0,action:"append"}),this.startHintCycle()}async tryAIResponse(t){try{const o=document.getElementById("loading-template").content.cloneNode(!0).firstElementChild;this.container.appendChild(o),this.scrollManager.scrollToBottom(),await this.sleep(2e3);const i=await fetch(this.MODEL_URL,{method:"POST",headers:{Authorization:`Bearer ${this.HF_API_TOKEN}`,"Content-Type":"application/json"},body:JSON.stringify({inputs:{text:`Context: You are a helpful assistant for Sergey Andreev's personal website. 
                               He is a CTO with experience in educational projects.
                               Current question: ${t}`,max_length:100}})});if(o.remove(),!i.ok)throw new Error("API Error");const r=await i.json(),h=r.generated_text||r[0].generated_text;return sendAnalytics("ai_response",{event_label:t,value:1,response_type:"huggingface",response_text:f(h)}),`<div class="terminal__output terminal__output--ai">
                <div class="terminal__output-header">🤖 AI Response:</div>
                <div class="terminal__output-content">${h}</div>
            </div>`}catch(n){console.error("AI Error:",n);const i=new v().generateResponse(t);return this.sendAnalytics("ai_response",{event_label:t,value:1,response_type:"local",response_text:f(i)}),`<div class="terminal__output terminal__output--ai">
                <div class="terminal__output-header">🤖 Local AI:</div>
                <div class="terminal__output-content">${i}</div>
            </div>`}}sleep(t){return new Promise(n=>setTimeout(n,t))}setupEventListeners(){this.terminalContent.addEventListener("click",()=>{this.terminalContent.focus()}),this.terminalContent.setAttribute("tabindex","0"),this.terminalContent.addEventListener("keydown",t=>{t.code==="Space"&&t.preventDefault(),this.handleKeyPress(t)}),this.terminalContent.addEventListener("focus",()=>{this.isShowingHint&&(this.isShowingHint=!1,clearTimeout(this.hintTimeout),this.handlePrompt({command:"",showCursor:!0,action:"update"}))}),this.terminalContent.addEventListener("blur",()=>{!this.currentInput&&!this.isAnimating&&this.startHintCycle()}),document.removeEventListener("keydown",this.handleKeyPress)}handleKeyPress(t){this.isShowingHint&&(this.isShowingHint=!1,clearTimeout(this.hintTimeout),this.currentInput="",this.handlePrompt({command:"",showCursor:!0,action:"update"})),t.key==="Enter"?(this.executeCommand(),this.startHintCycle()):t.key==="Backspace"?(this.currentInput=this.currentInput.slice(0,-1),this.handlePrompt({command:this.currentInput,showCursor:!0,action:"update"})):t.key==="ArrowUp"?this.navigateHistory(-1):t.key==="ArrowDown"?this.navigateHistory(1):t.key.length===1&&(this.currentInput+=t.key,this.handlePrompt({command:this.currentInput,showCursor:!0,action:"update"}))}navigateHistory(t){this.commandHistory.length!==0&&(this.historyIndex=Math.max(-1,Math.min(this.commandHistory.length-1,this.historyIndex+t)),this.historyIndex===-1?this.currentInput="":this.currentInput=this.commandHistory[this.historyIndex],this.handlePrompt({command:this.currentInput,showCursor:!0,action:"update"}))}startHintCycle(){!this.currentInput&&!this.isAnimating&&document.activeElement!==this.terminalContent&&(this.hintTimeout=setTimeout(()=>this.showNextHint(),this.hintDelay))}async showNextHint(){if(this.currentInput||this.isAnimating||document.activeElement===this.terminalContent)return;this.isShowingHint=!0;const t=this.hints[this.hintIndex];let n="";for(const o of t){if(this.currentInput||!this.isShowingHint||document.activeElement===this.terminalContent)break;n+=o,this.handlePrompt({command:n,showCursor:!0,action:"update",isHint:!0}),await this.sleep(this.typeDelay)}for(!this.currentInput&&this.isShowingHint&&document.activeElement!==this.terminalContent&&await this.sleep(this.pauseDelay);n.length>0&&this.isShowingHint&&!this.currentInput&&document.activeElement!==this.terminalContent;)n=n.slice(0,-1),this.handlePrompt({command:n,showCursor:!0,action:"update",isHint:!0}),await this.sleep(this.eraseDelay);!this.currentInput&&document.activeElement!==this.terminalContent&&(this.hintIndex=(this.hintIndex+1)%this.hints.length,await this.sleep(this.betweenHintsDelay),this.startHintCycle()),this.isShowingHint=!1}}class v{constructor(){this.keywords={"опыт|работа|карьера":["Более 10 лет опыта в разработке. Сейчас работаю CTO в Ultimate Education.","Руковожу IT-стратегией образовательного холдинга из 7 компаний.","Специализируюсь на масштабировании образовательных проектов."],"проект|достижени":["Разработал LMS систму для 100k+ пользователей.","Создал комплексную аналитическую платформу для образовательного холдинга.","Оптимизировал производительность DevOps-системы в 10 раз."],"технолог|стек|язык":["Основной стек: React, TypeScript, Python, Kubernetes.","Опыт работы с Java, Kotlin, Node.js.","Активно использую современные облачные технологии."],"образовани|обучени":["Постоянно развиваюсь в сфре технологий.","Особый интерес к AI и масштабированию систем.","Делюсь опытом через менторство и технические статьи."],"контакт|связ|найти":["Email: dragorww@gmail.com","Telegram: @dragorww","GitHub: github.com/dragorww"]},this.defaultResponses=["Извините, не совсем понял вопрос. Попробуйте спросить о моем опыте работы, проектах или технологиях.","Может быть, вас интересует мой опыт работы в образовательных проектах?","Я могу рассказать о технологиях, которые использую, или о своих проектах."]}generateResponse(t){const n=t.toLowerCase();for(const[o,i]of Object.entries(this.keywords))if(new RegExp(o,"i").test(n))return i[Math.floor(Math.random()*i.length)];return this.defaultResponses[Math.floor(Math.random()*this.defaultResponses.length)]}}const f=(a,t=500)=>a.length>t?a.substring(0,t)+"...":a;window.initTerminalAnimation=()=>{new S};(()=>{const a=`
        color: #E2C08D;
        font-family: monospace;
        font-size: 12px;
        line-height: 1;
    `,t=`
    ██████╗ ██████╗  █████╗  ██████╗  ██████╗ ██████╗ ██╗    ██╗██╗    ██╗
    ██╔══██╗██╔══██╗██╔══██╗██╔════╝ ██╔═══██╗██╔══██╗██║    ██║██║    ██║
    ██║  ██║██████╔╝███████║██║  ███╗██║   ██║██████╔╝██║ █╗ ██║██║ █╗ ██║
    ██║  ██║██╔══██╗██╔══██║██║   ██║██║   ██║██╔══██╗██║███╗██║██║███╗██║
    ██████╔╝██║  ██║██║  ██║╚██████╔╝╚██████╔╝██║  ██║╚███╔███╔╝╚███╔███╔╝
    ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝ ╚══╝╚══╝  ╚══╝╚══╝ 
    `,n=`
    👋 Привет, разработчик! 
    
    🚀 Раз уж ты заглянул в консоль, то наверняка тебе интересно что тут происходит.
    💼 Я всегда открыт к общению и новым проектам.
    
    📫 Связаться со мной:
    → Telegram: @dragorww
    → Twitter: @dragorww
    → Email: dragorww@gmail.com
    → GitHub: github.com/dragorww
    
    🔍 P.S. Попробуй поискать другие пасхалки на сайте!
    `;console.log("%c"+t,a),console.log("%c"+n,a)})();(()=>{function a(o){document.querySelectorAll('link[rel="icon"]').forEach(h=>{h.setAttribute("media","none"),h.setAttribute("rel","icon")});const r=document.querySelector(`link[rel="icon"][data-theme="${o}"]`);r&&r.removeAttribute("media")}function t(){const i=(document.documentElement.getAttribute("data-theme")||"dark")==="light"?"dark":"light";document.documentElement.setAttribute("data-theme",i),localStorage.setItem("theme",i),a(i)}function n(){const o=localStorage.getItem("theme")||"dark";document.documentElement.setAttribute("data-theme",o),a(o)}document.addEventListener("DOMContentLoaded",n),window.toggleTheme=t})();document.addEventListener("DOMContentLoaded",()=>{initMatrixAnimation("matrix",1e3),initTerminalAnimation()});