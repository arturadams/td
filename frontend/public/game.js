// Tower defense game script

const CONFIG = {
    gameSettings: { sellMultiplier: 0.5, initialMoney: 220, sellGracePeriod: 5000 },
    gridSize: 20, tileSize: 0,
    mapLayout: [
        ['S','T','T','T','T','T','T','T','T','T','T','T','T','T','T','T','T','T','T','T'],
        ['O','O','O','O','O','O','O','T','T','T','T','T','T','T','T','T','T','T','T','T'],
        ['T','T','T','T','T','T','O','T','T','T','T','T','T','T','T','T','T','T','T','T'],
        ['T','T','T','T','T','T','O','T','T','T','T','T','T','T','T','T','T','T','T','T'],
        ['T','T','T','T','T','T','O','T','T','T','T','T','T','T','T','T','T','T','T','T'],
        ['T','T','T','T','T','T','O','T','T','T','T','T','T','T','T','T','T','T','T','T'],
        ['T','T','T','T','T','T','O','T','T','T','T','T','T','T','T','T','T','T','T','T'],
        ['T','T','T','T','T','T','O','T','T','T','T','T','T','T','T','T','T','T','T','T'],
        ['T','T','T','T','T','T','O','T','T','T','T','T','T','T','T','T','T','T','T','T'],
        ['T','T','T','T','T','T','O','T','T','T','T','T','T','T','T','T','T','T','T','T'],
        ['T','T','T','T','T','T','O','T','T','T','T','T','T','T','T','T','T','T','T','T'],
        ['T','T','T','T','T','T','O','T','T','T','T','O','O','O','O','O','O','O','O','O'],
        ['T','T','T','T','T','T','T','T','T','T','T','T','T','T','T','T','T','T','T','E'],
        ['T','T','T','T','T','T','T','T','T','T','T','T','T','T','T','T','T','T','T','T'],
        ['T','T','T','T','T','T','T','T','T','T','T','T','T','T','T','T','T','T','T','T']
    ],
    enemies: {
        standard: { name:'Standard', health:100, speed:1, money:5, color:'#ef4444', resistances:{} },
        fast: { name:'Fast', health:70, speed:2, money:7, color:'#f97316', resistances:{} },
        scout: { name:'Scout', health:60, speed:2.5, money:8, color:'#a3a3a3', evasion:0.25 },
        heavy: { name:'Heavy', health:400, speed:0.6, money:15, color:'#8b5cf6', resistances:{ physical:0.25 } },
        frost_golem: { name:'Frost Golem', health:750, speed:0.5, money:20, color:'#93c5fd', resistances:{ frost:0.75, lightning:-0.5 } },
        boss: { name:'Boss', health:3000, speed:0.4, money:100, color:'#ec4899', evasion:0.1, resistances:{ physical:0.35, frost:0.3, lightning:0.3 } }
    },
    towers: {
        gun: { name:'Gun Turret', cost:50, range:100, damage:25, fireRate:500, color:'#22c55e', attackType:'single', damageType:'physical', projectileSpeed:8, upgrades:['gun_machinegun','gun_sniper'] },
        frost: { name:'Frost Tower', cost:80, range:80, damage:5, fireRate:1000, color:'#3b82f6', attackType:'splash', damageType:'frost', splashRadius:50, projectileSpeed:6, effect:{ type:'slow', power:0.4, duration:2000 }, upgrades:['frost_field'] },
        lightning: { name:'Lightning Spire', cost:100, range:120, damage:40, fireRate:800, color:'#f59e0b', attackType:'single', damageType:'lightning', projectileSpeed:20, upgrades:['lightning_chain'] },
        fire: { name:'Fireball Tower', cost:120, range:130, damage:25, fireRate:1500, color:'#f97316', attackType:'splash', damageType:'fire', splashRadius:30, projectileSpeed:6, effect:{ type:'burn', dps:10, duration:3000 }, upgrades:['fire_meteor'] },
        aura: { name:'Aura Tower', cost:150, range:120, color:'#a855f7', attackType:'aura', effect:{ type:'buff_damage', power:0.15 }, upgrades:['aura_range'] },
        gun_machinegun: { name:'Machine Gun', cost:150, range:110, damage:20, fireRate:200, color:'#16a34a', attackType:'single', damageType:'physical', projectileSpeed:10, upgrades:['gun_gatling'] },
        gun_sniper: { name:'Sniper Tower', cost:150, range:250, damage:100, fireRate:2000, color:'#15803d', attackType:'single', damageType:'physical', projectileSpeed:30, upgrades:['gun_railgun'] },
        frost_field: { name:'Frost Field', cost:200, range:100, damage:10, fireRate:800, color:'#2563eb', attackType:'splash', damageType:'frost', splashRadius:60, projectileSpeed:7, effect:{ type:'slow', power:0.6, duration:2500 }, upgrades:['frost_absolute_zero'] },
        lightning_chain: { name:'Chain Lightning', cost:220, range:130, damage:35, fireRate:900, color:'#d97706', attackType:'single', damageType:'lightning', projectileSpeed:20, effect:{ type:'chain', targets:3, range:75, power:0.5 }, upgrades:[] },
        fire_meteor: { name:'Meteor Tower', cost:300, range:180, damage:60, fireRate:2500, color:'#dc2626', attackType:'splash', damageType:'fire', splashRadius:60, projectileSpeed:5, effect:{ type:'burn', dps:25, duration:4000 }, upgrades:[] },
        aura_range: { name:'Range Aura', cost:100, range:150, color:'#9333ea', attackType:'aura', effect:{ type:'buff_damage', power:0.20 }, upgrades:[] },
        gun_gatling: { name:'Gatling Gun', cost:400, range:120, damage:25, fireRate:100, color:'#14532d', attackType:'single', damageType:'physical', projectileSpeed:12, upgrades:[] },
        gun_railgun: { name:'Railgun', cost:450, range:300, damage:250, fireRate:3000, color:'#064e3b', attackType:'pierce', damageType:'physical', projectileSpeed:50, upgrades:['gun_supercollider'] },
        frost_absolute_zero: { name:'Absolute Zero', cost:500, range:110, damage:20, fireRate:1000, color:'#1e3a8a', attackType:'splash', damageType:'frost', splashRadius:70, projectileSpeed:8, effect:{ type:'brittle', power:0.8, duration:3000 }, upgrades:[] },
        gun_supercollider: { name:'Supercollider', cost:900, range:350, damage:500, fireRate:2500, color:'#f0fdfa', attackType:'pierce', damageType:'physical', projectileSpeed:60, effect:{ type:'vulnerable', power:0.25, duration:5000 }, upgrades:[] }
    },
    waves: [
        { enemies:[['standard',15,800]], description:"Standard infantry approaching.", disclosedEnemies:['standard'] },
        { enemies:[['standard',10,700],['fast',8,1500]], description:"Watch out for fast movers.", disclosedEnemies:['fast'] },
        { enemies:[['heavy',5,2000],['fast',10,800]], description:"Armored units detected.", disclosedEnemies:['heavy'] },
        { enemies:[['frost_golem',3,2500],['standard',10,500]], description:"Frost-resistant Golems inbound.", disclosedEnemies:['frost_golem'] },
        { enemies:[['scout',20,400]], description:"Evasive scouts are hard to hit.", disclosedEnemies:['scout'] },
        { enemies:[['fast',25,300],['frost_golem',5,2000]], description:"Mixed force of fast and durable enemies.", disclosedEnemies:['fast','frost_golem'] },
        { enemies:[['heavy',15,1000],['fast',15,500]], description:"A large armored platoon.", disclosedEnemies:['heavy'] },
        { enemies:[['scout',40,250]], description:"A massive swarm of scouts!", disclosedEnemies:['scout'] },
        { enemies:[['boss',1,1000]], description:"!!! MASSIVE LIFEFORM DETECTED !!!", disclosedEnemies:['boss'] },
        { enemies:[['heavy',20,800],['frost_golem',10,1500]], description:"An elite, heavily armored force.", disclosedEnemies:['heavy','frost_golem'] },
        { enemies:[['boss',2,4000],['scout',30,300]], description:"!!! ALL HELL BREAKS LOOSE !!!", disclosedEnemies:['boss','scout'] },
        { enemies:[['boss',3,3000]], description:"!!! THE FINAL ASSAULT !!!", disclosedEnemies:['boss'] }
    ]
};

class Pathfinding {
    constructor(grid){ this.grid = grid; }
    findPath(startPos,endPos){
        const open=[this.grid[startPos.y][startPos.x]];
        const closed=new Set();
        this.grid.forEach(row=>row.forEach(n=>{n.g=Infinity;n.f=Infinity;n.h=0;n.parent=null;}));
        this.grid[startPos.y][startPos.x].g=0;
        this.grid[startPos.y][startPos.x].f=this.heuristic(startPos,endPos);
        while(open.length>0){
            open.sort((a,b)=>a.f-b.f);
            const current=open.shift();
            if(current.x===endPos.x&&current.y===endPos.y){
                return this.reconstructPath(current);
            }
            closed.add(current);
            this.getNeighbors(current).forEach(neighbor=>{
                if(closed.has(neighbor)||!neighbor.walkable) return;
                const g=current.g+1;
                if(g<neighbor.g){
                    neighbor.parent=current;
                    neighbor.g=g;
                    neighbor.h=this.heuristic(neighbor,endPos);
                    neighbor.f=neighbor.g+neighbor.h;
                    if(!open.some(n=>n.x===neighbor.x&&n.y===neighbor.y)) open.push(neighbor);
                }
            });
        }
        return null;
    }
    heuristic(a,b){return Math.abs(a.x-b.x)+Math.abs(a.y-b.y);}
    getNeighbors(node){
        const neighbors=[];
        const{x,y}=node;
        if(this.grid[y-1]&&this.grid[y-1][x]) neighbors.push(this.grid[y-1][x]);
        if(this.grid[y+1]&&this.grid[y+1][x]) neighbors.push(this.grid[y+1][x]);
        if(this.grid[y]&&this.grid[y][x-1]) neighbors.push(this.grid[y][x-1]);
        if(this.grid[y]&&this.grid[y][x+1]) neighbors.push(this.grid[y][x+1]);
        return neighbors;
    }
    reconstructPath(curr){const path=[];while(curr){path.unshift(curr);curr=curr.parent;}return path;}
}

class TowerDefenseGame {
    constructor(canvas,config){
        this.canvas=canvas;this.ctx=canvas.getContext('2d');this.config=JSON.parse(JSON.stringify(config));
        this.animationFrameId=null;this.init();
    }
    init(){this.setupMainMenu();this.setupSettingsPanel();}
    setupMainMenu(){
        document.getElementById('start-game-btn').onclick=()=>this.startGame();
        document.getElementById('settings-btn').onclick=()=>this.showModal('settings-modal');
    }
    setupSettingsPanel(){
        const slider=document.getElementById('sell-multiplier-slider');
        const val=document.getElementById('sell-multiplier-value');
        slider.value=this.config.gameSettings.sellMultiplier;
        val.textContent=slider.value;
        slider.oninput=()=>{val.textContent=slider.value;this.config.gameSettings.sellMultiplier=parseFloat(slider.value);};
        document.getElementById('settings-close-btn').onclick=()=>this.hideModal('settings-modal');
    }
    startGame(){
        document.getElementById('main-menu').classList.add('hidden');
        document.getElementById('game-container').classList.remove('hidden');
        this.resizeCanvas();
        this.buildGrid();
        this.pathfinder=new Pathfinding(this.grid);
        this.speedButtons={'1':document.getElementById('speed-1x'),'2':document.getElementById('speed-2x'),'4':document.getElementById('speed-4x')};
        Object.entries(this.speedButtons).forEach(([s,b])=>{b.onclick=()=>this.setGameSpeed(parseInt(s));});
        this.resetGame();
        window.addEventListener('resize',()=>{this.resizeCanvas();this.recalculatePath();});
        this.canvas.addEventListener('pointerdown',e=>this.handleCanvasClick(e));
        document.getElementById('start-wave-btn').onclick=()=>this.startNextWave();
        document.getElementById('restart-btn').onclick=()=>{this.hideModal('game-over-modal');document.getElementById('game-container').classList.add('hidden');document.getElementById('main-menu').classList.remove('hidden');};
        document.getElementById('panel-close-btn').onclick=()=>this.hideControlPanel();
        document.getElementById('waves-info-btn').onclick=()=>this.showWavesInfoPanel();
        document.getElementById('waves-close-btn').onclick=()=>this.hideModal('waves-modal');
    }
    buildGrid(){
        this.grid=[];const map=this.config.mapLayout;
        for(let y=0;y<map.length;y++){this.grid[y]=[];for(let x=0;x<map[y].length;x++){const t=map[y][x];this.grid[y][x]={x,y,walkable:t!=='O',type:t};if(t==='S')this.startPos={x,y};if(t==='E')this.endPos={x,y};}}
    }
    resetGame(){
        this.money=this.config.gameSettings.initialMoney;this.health=20;this.currentWave=0;this.towers=[];this.enemies=[];this.projectiles=[];this.particles=[];this.isWaveActive=false;this.selectedTower=null;this.waveEnemyCount=0;
        this.grid.forEach(r=>r.forEach(n=>{if(n.type==='T')n.walkable=true;}));
        this.recalculatePath();this.updateStats();this.hideControlPanel();if(this.animationFrameId)cancelAnimationFrame(this.animationFrameId);this.setGameSpeed(1);this.gameLoop();
    }
    setGameSpeed(s){this.gameSpeed=s;Object.values(this.speedButtons).forEach(b=>b.classList.remove('active','bg-indigo-600'));this.speedButtons[s].classList.add('active','bg-indigo-600');}
    resizeCanvas(){const c=document.getElementById('game-container');this.canvas.width=c.clientWidth;this.config.tileSize=this.canvas.width/this.config.gridSize;this.canvas.height=this.config.mapLayout.length*this.config.tileSize;}
    recalculatePath(){this.path=this.pathfinder.findPath(this.startPos,this.endPos);this.pixelPath=this.path?this.path.map(p=>({x:p.x*this.config.tileSize+this.config.tileSize/2,y:p.y*this.config.tileSize+this.config.tileSize/2})):null;}
    handleCanvasClick(e){const r=this.canvas.getBoundingClientRect();const x=e.clientX-r.left;const y=e.clientY-r.top;const gx=Math.floor(x/this.config.tileSize);const gy=Math.floor(y/this.config.tileSize);if(gy<0||gy>=this.grid.length||gx<0||gx>=this.grid[0].length){this.hideControlPanel();return;}const clicked=this.towers.find(t=>t.gridX===gx&&t.gridY===gy);if(clicked){this.selectedTower=clicked;this.showTowerInfoPanel(clicked);}else if(this.grid[gy][gx].type==='T'){this.selectedTower=null;this.showBuildPanel(gx,gy);}else{this.selectedTower=null;this.hideControlPanel();}}
    placeTower(gx,gy,type){const data=this.config.towers[type];if(this.money<data.cost){this.showNotification('Not enough money!',gx,gy);return;}this.grid[gy][gx].walkable=false;if(!this.pathfinder.findPath(this.startPos,this.endPos)){this.showNotification('Cannot block path!',gx,gy);this.grid[gy][gx].walkable=true;return;}this.money-=data.cost;const t={...data,type,totalCost:data.cost,x:gx*this.config.tileSize+this.config.tileSize/2,y:gy*this.config.tileSize+this.config.tileSize/2,gridX:gx,gridY:gy,target:null,fireCooldown:0,createdAt:Date.now(),hasFired:false};this.towers.push(t);this.recalculatePath();this.updateStats();this.hideControlPanel();}
    upgradeTower(tower,up){const d=this.config.towers[up];if(this.money<d.cost){this.showNotification('Not enough money!',tower.gridX,tower.gridY);return;}this.money-=d.cost;const i=this.towers.indexOf(tower);if(i>-1){const nt={...d,type:up,totalCost:tower.totalCost+d.cost,x:tower.x,y:tower.y,gridX:tower.gridX,gridY:tower.gridY,target:null,fireCooldown:0,createdAt:tower.createdAt,hasFired:true};this.towers[i]=nt;this.selectedTower=nt;this.showTowerInfoPanel(nt);this.updateStats();}}
    sellTower(tower){const isNew=tower.attackType!=='aura'&&!tower.hasFired&&(Date.now()-tower.createdAt<this.config.gameSettings.sellGracePeriod);const mult=isNew?1.0:this.config.gameSettings.sellMultiplier;const val=Math.floor(tower.totalCost*mult);this.money+=val;const idx=this.towers.indexOf(tower);if(idx>-1){this.grid[tower.gridY][tower.gridX].walkable=true;this.towers.splice(idx,1);this.recalculatePath();}this.hideControlPanel();this.updateStats();}
    startNextWave(){if(this.isWaveActive||this.currentWave>=this.config.waves.length||!this.path)return;this.isWaveActive=true;this.currentWave++;this.updateStats();const wave=this.config.waves[this.currentWave-1];this.waveEnemyCount=0;wave.enemies.forEach(([type,count,delay])=>{this.waveEnemyCount+=count;for(let i=0;i<count;i++){setTimeout(()=>this.spawnEnemy(type),i*delay);}});document.getElementById('start-wave-btn').disabled=true;document.getElementById('start-wave-btn').classList.add('opacity-50','cursor-not-allowed');}
    spawnEnemy(type){const data={...this.config.enemies[type]};this.enemies.push({...data,x:this.pixelPath[0].x,y:this.pixelPath[0].y,pathIndex:0,maxHealth:data.health,effects:[]});}
    updateStats(){document.getElementById('money').textContent=this.money;document.getElementById('health').textContent=this.health;document.getElementById('wave').textContent=`${this.currentWave} / ${this.config.waves.length}`;}
    gameLoop(ts){for(let i=0;i<this.gameSpeed;i++){this.update(ts);}this.draw();this.animationFrameId=requestAnimationFrame(t=>this.gameLoop(t));}
    update(){
        this.updateTowers();this.updateEnemies();this.updateProjectiles();this.updateParticles();
        if(this.isWaveActive&&this.enemies.length===0&&this.waveEnemyCount>0){this.isWaveActive=false;this.waveEnemyCount=0;if(this.currentWave>=this.config.waves.length){this.showEndScreen(true);}else{const btn=document.getElementById('start-wave-btn');btn.disabled=false;btn.classList.remove('opacity-50','cursor-not-allowed');}}
    }
    updateTowers(){this.towers.forEach(t=>{t.currentDamage=t.damage;if(t.attackType!=='aura'){this.towers.forEach(a=>{if(a.attackType==='aura'&&this.getDistance(t,a)<=a.range){if(a.effect.type==='buff_damage'){t.currentDamage*=(1+a.effect.power);}}});}if(t.attackType==='aura')return;if(t.fireCooldown>0)t.fireCooldown-=16;if(!t.target||this.getDistance(t,t.target)>t.range||t.target.health<=0){t.target=null;for(const e of this.enemies){if(this.getDistance(t,e)<=t.range){t.target=e;break;}}}if(t.target&&t.fireCooldown<=0){t.fireCooldown=t.fireRate;this.createProjectile(t);}});}
    updateEnemies(){if(!this.pixelPath)return;for(let i=this.enemies.length-1;i>=0;i--){const e=this.enemies[i];e.effects=e.effects.filter(effect=>Date.now()<effect.endTime);if(e.effects.some(x=>x.type==='stun'))continue;let speed=e.speed;let dps=0;e.effects.forEach(effect=>{if(effect.type==='slow'||effect.type==='brittle')speed*=(1-effect.power);if(effect.type==='poison'||effect.type==='burn')dps+=effect.dps;});if(dps>0){e.health-=dps*(16/1000);this.checkEnemyDeath(e);if(e.health<=0)continue;}const target=this.pixelPath[e.pathIndex+1];if(!target){this.health--;this.enemies.splice(i,1);this.updateStats();if(this.health<=0)this.showEndScreen(false);continue;}const ang=Math.atan2(target.y-e.y,target.x-e.x);e.x+=Math.cos(ang)*speed;e.y+=Math.sin(ang)*speed;if(this.getDistance(e,target)<speed*1.5){e.pathIndex++;}}}
    updateProjectiles(){for(let i=this.projectiles.length-1;i>=0;i--){const p=this.projectiles[i];if(p.attackType==='pierce'){p.x+=p.vx;p.y+=p.vy;this.enemies.forEach(enemy=>{if(!p.hitEnemies.has(enemy)&&this.getDistance(p,enemy)<this.config.tileSize*0.4){this.handleSingleDamage(p,enemy);p.hitEnemies.add(enemy);}});if(p.x<0||p.x>this.canvas.width||p.y<0||p.y>this.canvas.height){this.projectiles.splice(i,1);}}else{if(!p.target||p.target.health<=0){if(p.attackType==='splash'){this.handleSplashDamage(p);}this.projectiles.splice(i,1);continue;}const ang=Math.atan2(p.target.y-p.y,p.target.x-p.x);p.x+=Math.cos(ang)*p.projectileSpeed;p.y+=Math.sin(ang)*p.projectileSpeed;if(this.getDistance(p,p.target)<p.projectileSpeed){if(p.attackType==='splash'){this.handleSplashDamage(p);}else{this.handleSingleDamage(p,p.target);}this.projectiles.splice(i,1);}}}}
    updateParticles(){for(let i=this.particles.length-1;i>=0;i--){const p=this.particles[i];p.x+=p.vx;p.y+=p.vy;p.life--;if(p.life<=0){this.particles.splice(i,1);}}}
    calculateDamage(enemy,dmg,dt){if(enemy.evasion&&Math.random()<enemy.evasion)return 0;const vuln=enemy.effects.some(e=>e.type==='vulnerable')?(1+enemy.effects.find(e=>e.type==='vulnerable').power):1;const res=(enemy.resistances&&enemy.resistances[dt])||0;return dmg*(1-res)*vuln;}
    handleSingleDamage(p,enemy){if(enemy&&enemy.health>0){const fd=this.calculateDamage(enemy,p.damage,p.damageType);if(fd>0){enemy.health-=fd;if(p.effect)this.applyEffect(enemy,p.effect);this.checkAndApplyCombos(enemy,p);}this.checkEnemyDeath(enemy);}}
    handleSplashDamage(p){this.createExplosion(p.x,p.y,p.splashRadius,p.color);this.enemies.forEach(enemy=>{if(this.getDistance({x:p.x,y:p.y},enemy)<=p.splashRadius){this.handleSingleDamage({...p,target:enemy},enemy);}});}
    checkAndApplyCombos(enemy,p){if(p.damageType==='lightning'&&enemy.effects.some(e=>e.type==='slow')){this.createChainLightning(enemy,3,75,p.damage*0.5);}if(p.damageType==='fire'&&enemy.effects.some(e=>e.type==='slow')){this.applyEffect(enemy,{type:'stun',duration:500});enemy.health-=50;}if(p.damageType==='physical'&&p.attackType==='splash'&&enemy.effects.some(e=>e.type==='brittle')){this.createExplosion(enemy.x,enemy.y,40,'#a1a1aa');this.handleSplashDamage({...p,x:enemy.x,y:enemy.y,splashRadius:40,damage:p.damage*0.5});enemy.health-=p.damage*0.5;}}
    createChainLightning(start,maxTargets,range,damage){let curr=start;const hit=new Set([start]);for(let i=0;i<maxTargets;i++){let next=null;let closest=range;for(const target of this.enemies){if(!hit.has(target)){const dist=this.getDistance(curr,target);if(dist<closest){closest=dist;next=target;}}}if(next){this.particles.push({x:curr.x,y:curr.y,vx:0,vy:0,life:20,type:'line',targetX:next.x,targetY:next.y,color:'#fef08a'});this.handleSingleDamage({damage,damageType:'lightning'},next);hit.add(next);curr=next;}else{break;}}}
    applyEffect(enemy,effect){if(effect.type==='chain'){this.createChainLightning(enemy,effect.targets,effect.range,enemy.damage*effect.power);return;}const existing=enemy.effects.find(e=>e.type===effect.type);if(existing){existing.endTime=Date.now()+effect.duration;}else{enemy.effects.push({...effect,endTime:Date.now()+effect.duration});}}
    checkEnemyDeath(enemy){if(enemy.health<=0){this.money+=enemy.money;this.updateStats();const idx=this.enemies.indexOf(enemy);if(idx>-1){this.enemies.splice(idx,1);}}}
    createProjectile(t){t.hasFired=true;if(t.attackType==='pierce'){const ang=Math.atan2(t.target.y-t.y,t.target.x-t.x);this.projectiles.push({x:t.x,y:t.y,vx:Math.cos(ang)*t.projectileSpeed,vy:Math.sin(ang)*t.projectileSpeed,damage:t.currentDamage,damageType:t.damageType,attackType:'pierce',hitEnemies:new Set(),color:'#fbbf24',effect:t.effect});}else{this.projectiles.push({x:t.x,y:t.y,target:t.target,damage:t.currentDamage,damageType:t.damageType,projectileSpeed:t.projectileSpeed,color:t.projectileColor,attackType:t.attackType,splashRadius:t.splashRadius,effect:t.effect});}}
    createExplosion(x,y,radius,color){for(let i=0;i<30;i++){const ang=Math.random()*Math.PI*2;const speed=Math.random()*3+1;this.particles.push({x,y,vx:Math.cos(ang)*speed,vy:Math.sin(ang)*speed,life:30,color,size:Math.random()*3+1});}}
    showNotification(text,gx,gy){const x=gx*this.config.tileSize+this.config.tileSize/2;const y=gy*this.config.tileSize;this.particles.push({x,y,text,life:60,color:'#f87171',vx:0,vy:-0.5});}
    draw(){this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);this.drawGrid();this.drawPath();this.drawTowers();this.drawEnemies();this.drawProjectiles();this.drawParticles();}
    drawGrid(){const{tileSize,gridSize,mapLayout}=this.config;for(let y=0;y<mapLayout.length;y++){for(let x=0;x<gridSize;x++){const type=mapLayout[y][x];if(type==='O'){this.ctx.fillStyle='#4a5568';}else if(type==='T'){this.ctx.fillStyle='#2d3748';}else{this.ctx.fillStyle='#1a202c';}this.ctx.fillRect(x*tileSize,y*tileSize,tileSize,tileSize);}}}
    drawPath(){if(!this.pixelPath)return;this.ctx.strokeStyle='rgba(74,85,104,0.5)';this.ctx.lineWidth=this.config.tileSize*0.2;this.ctx.lineCap='round';this.ctx.lineJoin='round';this.ctx.beginPath();this.ctx.moveTo(this.pixelPath[0].x,this.pixelPath[0].y);for(let i=1;i<this.pixelPath.length;i++){this.ctx.lineTo(this.pixelPath[i].x,this.pixelPath[i].y);}this.ctx.stroke();}
    drawTowers(){this.towers.forEach(t=>{if(this.selectedTower===t||t.attackType==='aura'){this.ctx.fillStyle=t.attackType==='aura'?'rgba(168,85,247,0.2)':'rgba(251,191,36,0.3)';this.ctx.beginPath();this.ctx.arc(t.x,t.y,t.range,0,Math.PI*2);this.ctx.fill();this.ctx.strokeStyle=t.attackType==='aura'?'rgba(168,85,247,0.5)':'rgba(251,191,36,0.8)';this.ctx.lineWidth=2;this.ctx.stroke();}this.drawTowerDesign(t);});}
    drawTowerDesign(t){const ts=this.config.tileSize;this.ctx.save();this.ctx.translate(t.x,t.y);if(t.attackType==='aura'){this.ctx.fillStyle=t.color;this.ctx.beginPath();this.ctx.arc(0,0,ts*0.3,0,Math.PI*2);this.ctx.fill();this.ctx.fillStyle='rgba(255,255,255,0.8)';this.ctx.beginPath();this.ctx.arc(0,0,ts*0.15,0,Math.PI*2);this.ctx.fill();}else{this.ctx.fillStyle='#4a5568';this.ctx.beginPath();this.ctx.arc(0,0,ts*0.45,0,Math.PI*2);this.ctx.fill();this.ctx.fillStyle=t.color;this.ctx.beginPath();this.ctx.arc(0,0,ts*0.35,0,Math.PI*2);this.ctx.fill();if(t.target){this.ctx.rotate(Math.atan2(t.target.y-t.y,t.target.x-t.x));}this.ctx.fillStyle='#718096';if(t.type.includes('railgun')||t.type.includes('supercollider')){this.ctx.fillRect(ts*0.2,-ts*0.1,ts*0.7,ts*0.2);}else if(t.type.includes('sniper')){this.ctx.fillRect(ts*0.2,-ts*0.08,ts*0.6,ts*0.16);}else if(t.type.includes('gatling')){this.ctx.fillRect(ts*0.2,-ts*0.12,ts*0.35,ts*0.24);}else{this.ctx.fillRect(ts*0.2,-ts*0.1,ts*0.3,ts*0.2);}}this.ctx.restore();}
    drawEnemies(){this.enemies.forEach(enemy=>{this.ctx.save();if(enemy.effects.some(e=>e.type==='brittle')){this.ctx.filter='saturate(2) brightness(1.5)';}else if(enemy.effects.some(e=>e.type==='vulnerable')){this.ctx.filter='drop-shadow(0 0 5px #f43f5e)';}this.ctx.fillStyle=enemy.color;this.ctx.beginPath();this.ctx.arc(enemy.x,enemy.y,this.config.tileSize*0.3,0,Math.PI*2);this.ctx.fill();this.ctx.restore();if(enemy.effects.some(e=>e.type==='stun')){this.ctx.fillStyle='rgba(250,204,21,0.7)';this.ctx.font='bold 20px "Roboto Mono"';this.ctx.textAlign='center';this.ctx.fillText('!',enemy.x,enemy.y-this.config.tileSize*0.4);}if(enemy.effects.some(e=>e.type==='slow')){this.ctx.strokeStyle='#60a5fa';this.ctx.lineWidth=2;this.ctx.beginPath();this.ctx.arc(enemy.x,enemy.y,this.config.tileSize*0.4,0,Math.PI*2);this.ctx.stroke();}const w=this.config.tileSize*0.6;const hp=enemy.health/enemy.maxHealth;this.ctx.fillStyle='#4a5568';this.ctx.fillRect(enemy.x-w/2,enemy.y-this.config.tileSize*0.5,w,5);this.ctx.fillStyle='#4ade80';this.ctx.fillRect(enemy.x-w/2,enemy.y-this.config.tileSize*0.5,w*hp,5);});}
    drawProjectiles(){this.projectiles.forEach(p=>{this.ctx.fillStyle=p.color;this.ctx.beginPath();if(p.attackType==='pierce'){this.ctx.rect(p.x-15,p.y-2,30,4);}else{this.ctx.arc(p.x,p.y,4,0,Math.PI*2);}this.ctx.fill();});}
    drawParticles(){this.particles.forEach(p=>{if(p.type==='line'){this.ctx.strokeStyle=p.color;this.ctx.lineWidth=2;this.ctx.globalAlpha=p.life/20;this.ctx.beginPath();this.ctx.moveTo(p.x,p.y);this.ctx.lineTo(p.targetX,p.targetY);this.ctx.stroke();this.ctx.globalAlpha=1.0;}else if(p.text){this.ctx.fillStyle=p.color;this.ctx.font='bold 16px "Roboto Mono"';this.ctx.textAlign='center';this.ctx.globalAlpha=p.life/60;this.ctx.fillText(p.text,p.x,p.y);this.ctx.globalAlpha=1.0;}else{this.ctx.fillStyle=p.color;this.ctx.beginPath();this.ctx.arc(p.x,p.y,p.size,0,Math.PI*2);this.ctx.fill();}});}
    showModal(id){document.getElementById('modal-backdrop').classList.remove('hidden');document.getElementById(id).classList.remove('hidden');}
    hideModal(id){document.getElementById('modal-backdrop').classList.add('hidden');document.getElementById(id).classList.add('hidden');}
    showBuildPanel(gx,gy){const panel=document.getElementById('control-panel');const title=document.getElementById('panel-title');const content=document.getElementById('panel-content');title.textContent='Build Tower';content.innerHTML='';['gun','frost','lightning','fire','aura'].forEach(type=>{const t=this.config.towers[type];const b=document.createElement('button');b.className='w-full text-left p-2 rounded-md hover:bg-gray-700 flex justify-between items-center';b.innerHTML=`<span>${t.name}</span> <span class="font-bold text-green-400">$${t.cost}</span>`;b.onclick=()=>this.placeTower(gx,gy,type);if(this.money<t.cost){b.disabled=true;b.classList.add('opacity-50','cursor-not-allowed');}content.appendChild(b);});panel.style.left=`${gx*this.config.tileSize+this.config.tileSize}px`;panel.style.top=`${gy*this.config.tileSize}px`;panel.classList.remove('hidden');}
    showTowerInfoPanel(t){const panel=document.getElementById('control-panel');const title=document.getElementById('panel-title');const content=document.getElementById('panel-content');title.textContent=t.name;let html=`<div class="text-sm space-y-1 mb-4">`;if(t.attackType!=='aura'){html+=`<p>Damage: <span class="font-bold float-right">${t.damage} (${t.damageType})</span></p><p>Range: <span class="font-bold float-right">${t.range}</span></p><p>Fire Rate: <span class="font-bold float-right">${(1000/t.fireRate).toFixed(2)}/s</span></p>`;}else{html+=`<p>Effect: <span class="font-bold float-right">+${t.effect.power*100}% Dmg</span></p><p>Range: <span class="font-bold float-right">${t.range}</span></p>`;}html+='</div>';content.innerHTML=html;t.upgrades.forEach(u=>{const d=this.config.towers[u];const b=document.createElement('button');b.className='w-full text-left p-2 rounded-md hover:bg-blue-700 flex justify-between items-center bg-blue-600';b.innerHTML=`<span>Upgrade: ${d.name}</span> <span class="font-bold text-white">$${d.cost}</span>`;b.onclick=()=>this.upgradeTower(t,u);if(this.money<d.cost){b.disabled=true;b.classList.add('opacity-50','cursor-not-allowed');}content.appendChild(b);});const isNew=t.attackType!=='aura'&&!t.hasFired&&(Date.now()-t.createdAt<this.config.gameSettings.sellGracePeriod);const mult=isNew?1.0:this.config.gameSettings.sellMultiplier;const val=Math.floor(t.totalCost*mult);const sell=document.createElement('button');sell.className=`w-full text-left p-2 rounded-md flex justify-between items-center mt-2 ${isNew?'bg-yellow-500 hover:bg-yellow-600':'bg-red-600 hover:bg-red-700'}`;sell.innerHTML=`<span>Sell Tower</span> <span class="font-bold text-white">$${val} ${isNew?'(100%)':''}</span>`;sell.onclick=()=>this.sellTower(t);content.appendChild(sell);panel.style.left=`${t.gridX*this.config.tileSize+this.config.tileSize}px`;panel.style.top=`${t.gridY*this.config.tileSize}px`;panel.classList.remove('hidden');}
    hideControlPanel(){document.getElementById('control-panel').classList.add('hidden');this.selectedTower=null;}
    showEndScreen(victory){cancelAnimationFrame(this.animationFrameId);this.showModal('game-over-modal');const title=document.getElementById('modal-title');const msg=document.getElementById('modal-message');if(victory){title.textContent='Victory!';msg.textContent='You have defended the realm!';}else{title.textContent='Game Over';msg.textContent='Your base has been destroyed.';}}
    showWavesInfoPanel(){const content=document.getElementById('waves-info-content');content.innerHTML='';this.config.waves.forEach((w,i)=>{if(i<this.currentWave)return;const div=document.createElement('div');div.className='p-3 bg-gray-700 rounded-lg';let html=`<h4 class="font-bold text-lg">Wave ${i+1}</h4>`;if(w.description){html+=`<p class="text-sm text-gray-400 italic">\"${w.description}\"</p>`;}if(w.disclosedEnemies&&w.disclosedEnemies.length>0){html+='<div class="flex gap-2 mt-2">';w.disclosedEnemies.forEach(k=>{const d=this.config.enemies[k];if(d){html+=`<span class="p-1 rounded" style="background-color:${d.color};" title="${d.name}"></span>`;}});html+='</div>';}div.innerHTML=html;content.appendChild(div);});this.showModal('waves-modal');}
    getDistance(o1,o2){const dx=o1.x-o2.x,dy=o1.y-o2.y;return Math.sqrt(dx*dx+dy*dy);}
}

window.addEventListener('load',()=>{
    new TowerDefenseGame(document.getElementById('gameCanvas'),CONFIG);
});
