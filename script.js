const audio=new Audio('bgm.mp3'); audio.loop=false; const HIGHLIGHT=145;
const savedVol=Number(localStorage.getItem('saemVolume')); audio.volume=Number.isFinite(savedVol)&&savedVol>=0&&savedVol<=1?savedVol:.22;
const gate=document.querySelector('#gate'), sound=document.querySelector('#sound'), play=document.querySelector('#play'), volume=document.querySelector('#volume'), volumeValue=document.querySelector('#volumeValue'), mute=document.querySelector('#mute');
volume.value=Math.round(audio.volume*100); volumeValue.value=volume.value+'%'; let lastVolume=audio.volume||.22;
function start(){gate.classList.add('hide');audio.currentTime=HIGHLIGHT;audio.play().catch(()=>{});syncAudioUI();toast('ARCHIVE OPEN // WELCOME, STRANGER');}
document.querySelector('#enter').onclick=start; addEventListener('keydown',e=>{if(!gate.classList.contains('hide')&&(e.key==='Enter'||e.code==='Space'))start()});
audio.addEventListener('ended',()=>{audio.currentTime=HIGHLIGHT;audio.play()});
function syncAudioUI(){const on=!audio.paused;sound.textContent=on?'♫ ON':'♫ OFF';play.textContent=on?'Ⅱ':'▶';mute.textContent=audio.volume===0?'🔇':audio.volume<.5?'🔉':'🔊';volumeValue.value=Math.round(audio.volume*100)+'%'}
function toggle(){if(audio.paused)audio.play();else audio.pause();syncAudioUI()} sound.onclick=toggle;play.onclick=toggle;
volume.oninput=()=>{audio.volume=Number(volume.value)/100;if(audio.volume>0)lastVolume=audio.volume;localStorage.setItem('saemVolume',audio.volume);syncAudioUI()};
mute.onclick=()=>{if(audio.volume>0){lastVolume=audio.volume;audio.volume=0}else audio.volume=lastVolume||.22;volume.value=Math.round(audio.volume*100);localStorage.setItem('saemVolume',audio.volume);syncAudioUI()};
const questions=[
 ['디코 켜놓고 각자 할 일 하다가 한마디씩 하는 것도 편한가요?',16],
 ['게임 실력보다 같이 웃고 분위기 맞는 게 더 중요하다고 생각하나요?',12],
 ['갑자기 “마크나 옵치 할래?” 해도 종종 같이 놀 수 있나요?',8],
 ['서로 취향이나 생각이 달라도 존중하면서 대화할 수 있나요?',18],
 ['노가리 한 번 시작하면 생각보다 길어지는 편인가요?',9],
 ['연락을 의무처럼 하기보다 자연스럽게 이어가는 관계가 좋나요?',14],
 ['상대방이 불편해하는 선은 눈치껏 지켜주는 편인가요?',15],
 ['처음부터 너무 들이대기보다 천천히 친해지는 것도 괜찮나요?',8]
];
const answers=Array(questions.length).fill(null), quiz=document.querySelector('#quiz');
questions.forEach((q,i)=>{const d=document.createElement('div');d.className='qcard';d.innerHTML=`<span class="qnum">SIGNAL ${String(i+1).padStart(2,'0')}</span><div class="qtext">${q[0]}</div><div class="qactions"><button data-i="${i}" data-v="1">YES</button><button class="no" data-i="${i}" data-v="0">NO</button></div>`;quiz.appendChild(d)});
quiz.addEventListener('click',e=>{if(!e.target.matches('.qactions button'))return;const i=+e.target.dataset.i,v=+e.target.dataset.v;answers[i]=v;const card=e.target.closest('.qcard');card.classList.add('done');card.querySelectorAll('button').forEach(b=>b.classList.toggle('active',b===e.target));updateMatch()});
let celebrated=false;
function updateMatch(){const done=answers.filter(v=>v!==null).length;let answeredWeight=0,earned=0;answers.forEach((v,i)=>{if(v!==null){answeredWeight+=questions[i][1];if(v===1)earned+=questions[i][1]}});let pct=done?Math.round(35+(earned/answeredWeight)*65):50;if(done===questions.length&&earned===100)pct=100;document.querySelector('#score').textContent=pct+'%';document.querySelector('#matchFill').style.width=pct+'%';document.querySelector('#scoreRing').style.background=`conic-gradient(#d5a1b6 ${pct}%,#24252d 0)`;document.querySelector('#answered').textContent=`${done} / ${questions.length} ANSWERED`;let label='UNKNOWN SIGNAL',note='YES / NO를 선택하면 실시간으로 SYNC RATE가 계산됩니다.';if(done){if(pct>=90){label='RARE MATCH';note='이 정도면 꽤 같은 결. 디코에서 말 한 번 걸어봐도 좋을지도.'}else if(pct>=75){label='GOOD VIBE';note='취향보다 중요한 대화 코드가 꽤 잘 맞는 편이에요.'}else if(pct>=60){label='MAYBE SYNC';note='조금 더 대화해보면 의외로 잘 맞을 수도 있어요.'}else{label='DIFFERENT WAVE';note='결이 조금 다를 수 있어요. 그래도 테스트는 테스트일 뿐!'}}document.querySelector('#matchLabel').textContent=label;document.querySelector('#resultNote').textContent=note;
 const card=document.querySelector('#resultCard'); if(done===questions.length){card.classList.add('on');document.querySelector('#resultPct').textContent=pct+'%';document.querySelector('#resultTitle').textContent=label;document.querySelector('#resultCopy').textContent=note;document.querySelector('#perfectBadge').classList.toggle('on',pct===100);if(pct===100&&!celebrated){celebrated=true;document.querySelector('#perfectFlash').classList.add('go');setTimeout(()=>document.querySelector('#perfectFlash').classList.remove('go'),1300);toast('PERFECT SYNC // SAME FREQUENCY FOUND ✦')}}}
const copy=document.querySelector('#copyDiscord');copy.onclick=async()=>{try{await navigator.clipboard.writeText('_asa_mitaka');copy.textContent='COPIED ✓';copy.classList.add('copied');toast('DISCORD ID COPIED // _asa_mitaka');setTimeout(()=>{copy.textContent='COPY ID';copy.classList.remove('copied')},1800)}catch{toast('DISCORD // _asa_mitaka')}};
function toast(t){let e=document.querySelector('#toast');e.textContent=t;e.classList.add('on');setTimeout(()=>e.classList.remove('on'),2200)}
const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add('show')),{threshold:.12});document.querySelectorAll('.reveal').forEach(e=>io.observe(e));
addEventListener('mousemove',e=>{let g=document.querySelector('#cursorGlow');g.style.left=e.clientX+'px';g.style.top=e.clientY+'px'});
const c=document.querySelector('#stars'),x=c.getContext('2d');let pts=[];function size(){c.width=innerWidth;c.height=innerHeight;pts=Array.from({length:Math.min(110,innerWidth/10)},()=>({x:Math.random()*c.width,y:Math.random()*c.height,r:Math.random()*1.2+.2,s:Math.random()*.12+.03}))}function draw(){x.clearRect(0,0,c.width,c.height);const energy=audio.paused?.15:.15+audio.volume*.8;x.fillStyle='#d8c6d0';pts.forEach(p=>{p.y+=p.s*(1+audio.volume);if(p.y>c.height)p.y=0;x.globalAlpha=energy+Math.random()*.35;x.beginPath();x.arc(p.x,p.y,p.r*(1+audio.volume*.5),0,7);x.fill()});requestAnimationFrame(draw)}size();draw();addEventListener('resize',size);
const bars=document.querySelector('#bars');for(let i=0;i<16;i++){let b=document.createElement('i');bars.appendChild(b)}setInterval(()=>{[...bars.children].forEach(b=>b.style.height=(audio.paused?12:18+Math.random()*(45+audio.volume*45))+'%')},120);
let secret='';addEventListener('keydown',e=>{secret=(secret+e.key.toLowerCase()).slice(-10);if(secret.includes('saem'))toast('SECRET // 샘향 ARCHIVE VERIFIED')}); syncAudioUI();
