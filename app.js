const slides=[...document.querySelectorAll('.slide')];
const deck=document.getElementById('deck');
const title=document.getElementById('currentTitle');
const prev=document.getElementById('prev');
const next=document.getElementById('next');
let current=Math.max(0,Math.min(slides.length-1,(parseInt(location.hash.slice(1),10)||1)-1));
function fitDeck(){const scale=Math.min(innerWidth/1920,innerHeight/1080);deck.style.transform='translate(-50%,-50%) scale('+scale+')';resizePoc();}
function go(index){current=Math.max(0,Math.min(slides.length-1,index));slides.forEach((slide,i)=>{slide.classList.toggle('active',i===current);slide.inert=i!==current;slide.setAttribute('aria-hidden',String(i!==current));});title.textContent=slides[current].dataset.title;prev.disabled=current===0;next.disabled=current===slides.length-1;history.replaceState(null,'','#'+(current+1));resizePoc();}
function resizePoc(){const wrap=document.querySelector('.slide.active .poc-wrap');const frame=document.getElementById('pocFrame');if(!wrap||!frame)return;const scale=Math.min(wrap.clientWidth/1630,wrap.clientHeight/700);frame.style.transform='scale('+scale+')';frame.style.left=((wrap.clientWidth-1630*scale)/2)+'px';frame.style.top=((wrap.clientHeight-700*scale)/2)+'px';}
prev.addEventListener('click',()=>go(current-1));
next.addEventListener('click',()=>go(current+1));
window.addEventListener('resize',fitDeck);
window.addEventListener('hashchange',()=>go((parseInt(location.hash.slice(1),10)||1)-1));
document.getElementById('full').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{}});
document.addEventListener('fullscreenchange',fitDeck);
document.addEventListener('keydown',event=>{if(document.getElementById('mediaDialog').open){if(event.key==='Escape')document.getElementById('mediaDialog').close();return;}if(['ArrowRight','PageDown'].includes(event.key)||event.key===' '){event.preventDefault();go(current+1)}if(['ArrowLeft','PageUp'].includes(event.key)){event.preventDefault();go(current-1)}if(event.key==='Home')go(0);if(event.key==='End')go(slides.length-1);if(event.key.toLowerCase()==='f')document.getElementById('full').click();});
const poc=document.getElementById('pocFrame');
const loading=document.getElementById('pocLoading');
poc.addEventListener('load',()=>{loading.hidden=true;resizePoc()});
window.addEventListener('message',event=>{if(event.source===poc.contentWindow&&event.data?.type==='homsy-poc-ready')loading.hidden=true});
const dialog=document.getElementById('mediaDialog');
const stage=document.getElementById('mediaStage');
document.querySelectorAll('.zoomable').forEach(item=>item.addEventListener('click',()=>{const src=item.dataset.zoomSrc;const isVideo=item.dataset.mediaType==='video';const media=document.createElement(isVideo?'video':'img');media.src=src;if(isVideo){media.controls=true;media.autoplay=true;media.playsInline=true;media.preload='metadata';media.setAttribute('aria-label','Seedance 动作视频');}else{media.alt=item.querySelector('img')?.alt||'媒体预览';}stage.replaceChildren(media);dialog.showModal();if(isVideo)media.play().catch(()=>{});}));
document.getElementById('closeMedia').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
dialog.addEventListener('close',()=>{stage.querySelector('video')?.pause();stage.replaceChildren();});
fitDeck();
go(current);
document.fonts.ready.then(()=>{fitDeck();resizePoc()});
