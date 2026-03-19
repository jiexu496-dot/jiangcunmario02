/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Music, 
  Eye, 
  Utensils, 
  Sprout, 
  ChevronRight, 
  Volume2, 
  Play,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

// ==========================================
// GAME_ASSETS - 预留资源字典
// ==========================================
const GAME_ASSETS = {
  // 背景与角色
  bg_map: 'https://picui.ogmua.cn/s1/2026/03/19/69bb3716842d1.webp', // 模糊处理模拟像素感
  bg_pixel_village: 'https://picui.ogmua.cn/s1/2026/03/19/69bb3716842d1.webp',
  character_jiangjiang: 'https://picui.ogmua.cn/s1/2026/03/19/69bb236117568.webp',
  character_uncle: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=uncle',
  
  // 关卡素材
  mario_block: 'https://picsum.photos/seed/block/100/100',
  voxel_window: 'https://picsum.photos/seed/voxel/400/400',
  rice_seedling: 'https://picsum.photos/seed/sprout/100/100',
  ginkgo_cake: 'https://picsum.photos/seed/cake/200/200',
  
  // 视频占位 (实际开发中替换为真实视频URL)
  intro_video: 'https://www.w3schools.com/html/mov_bbb.mp4',
  
  // 音效占位 (逻辑中使用)
  sfx_jump: 'https://assets.mixkit.co/sfx/preview/mixkit-player-jumping-in-a-video-game-2043.mp3',
  sfx_hit: 'https://assets.mixkit.co/sfx/preview/mixkit-game-ball-tap-2073.mp3',
  sfx_typewriter: 'https://assets.mixkit.co/sfx/preview/mixkit-typewriter-soft-click-1125.mp3',
  // 听觉碎片合成后的音乐
  bgm_auditory_complete: 'https://assets.mixkit.co/music/preview/mixkit-dreamy-pianos-464.mp3', // 备用音频
  doubao_music_link: 'https://www.doubao.com/music-sharing?vid=v0369cg10004d6qkgb7og65okp23abjg&source_type=mobile&share_id=40315848549666050&task_id=0',
};

// ==========================================
// 农谚库
// ==========================================
const PROVERBS = [
  "清明前后，种瓜点豆。",
  "人误地一时，地误人一季。",
  "庄稼一枝花，全靠肥当家。"
];

type GameState = 'intro' | 'level1' | 'level2' | 'level3' | 'level4' | 'outro';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('intro');
  const [collectedFragments, setCollectedFragments] = useState<string[]>([]);
  
  const nextLevel = () => {
    if (gameState === 'intro') setGameState('level1');
    else if (gameState === 'level1') setGameState('level2');
    else if (gameState === 'level2') setGameState('level3');
    else if (gameState === 'level3') setGameState('level4');
    else if (gameState === 'level4') setGameState('outro');
  };

  return (
    <div className="relative w-full h-screen bg-stone-100 flex items-center justify-center overflow-hidden font-sans select-none">
      {/* 9:16 容器 */}
      <div className="relative w-full max-w-[450px] aspect-[9/16] bg-white shadow-2xl overflow-hidden border-4 border-stone-800 rounded-3xl">
        
        <AnimatePresence mode="wait">
          {gameState === 'intro' && (
            <IntroScreen key="intro" onStart={nextLevel} />
          )}
          
          {gameState === 'level1' && (
            <Level1Auditory key="level1" onComplete={() => {
              setCollectedFragments(prev => [...prev, '听觉']);
              nextLevel();
            }} />
          )}
          
          {gameState === 'level2' && (
            <Level2Visual key="level2" onComplete={() => {
              setCollectedFragments(prev => [...prev, '视觉']);
              nextLevel();
            }} />
          )}
          
          {gameState === 'level3' && (
            <Level3Taste key="level3" onComplete={() => {
              setCollectedFragments(prev => [...prev, '味觉']);
              nextLevel();
            }} />
          )}
          
          {gameState === 'level4' && (
            <Level4Planting key="level4" onComplete={nextLevel} />
          )}
          
          {gameState === 'outro' && (
            <OutroScreen key="outro" fragments={collectedFragments} onRestart={() => {
              setGameState('intro');
              setCollectedFragments([]);
            }} />
          )}
        </AnimatePresence>

        {/* 顶部进度指示 */}
        {gameState !== 'intro' && gameState !== 'outro' && (
          <div className="absolute top-6 left-0 w-full px-6 flex justify-between items-center z-50">
            <div className="flex gap-2">
              {['听觉', '视觉', '味觉', '耕种'].map((f, i) => (
                <div 
                  key={i} 
                  className={`w-3 h-3 rounded-full border-2 border-stone-800 ${
                    collectedFragments.length > i ? 'bg-emerald-500' : 'bg-stone-200'
                  }`}
                />
              ))}
            </div>
            <button 
              onClick={() => setGameState('intro')}
              className="text-[10px] uppercase tracking-widest font-bold text-stone-400 hover:text-stone-800 transition-colors"
            >
              Exit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 开场画面
// ==========================================
function IntroScreen({ onStart }: { onStart: () => void, key?: string }) {
  return (
    <div className="w-full h-full relative flex flex-col items-center justify-center p-8 text-center bg-pixel-grid">
      <div className="absolute inset-0 z-0 opacity-40 overflow-hidden">
        <img 
          src={GAME_ASSETS.bg_map} 
          alt="bg" 
          className="w-full h-full object-cover scale-110 blur-[2px]" 
          style={{ imageRendering: 'pixelated' }}
        />
      </div>
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="z-10"
      >
        <h1 className="text-4xl font-black text-stone-900 mb-2 tracking-tighter">漾里乡</h1>
        <h2 className="text-xl font-medium text-stone-600 mb-8 italic">蒋村漫游记</h2>
        
        <div className="relative w-48 h-48 mx-auto mb-12">
          <motion.img 
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            src={GAME_ASSETS.character_jiangjiang} 
            className="w-full h-full object-contain"
          />
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-4 bg-stone-900/10 rounded-full blur-sm" />
        </div>
        
        <button 
          onClick={onStart}
          className="group relative px-12 py-4 bg-stone-900 text-white rounded-full font-bold text-lg overflow-hidden transition-transform active:scale-95"
        >
          <span className="relative z-10 flex items-center gap-2">
            开启冒险 <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </span>
          <motion.div 
            className="absolute inset-0 bg-emerald-500"
            initial={{ x: '-100%' }}
            whileHover={{ x: 0 }}
            transition={{ type: 'spring', damping: 20 }}
          />
        </button>
      </motion.div>
    </div>
  );
}

// ==========================================
// 第一关：听觉碎片 (马里奥风格)
// ==========================================
function Level1Auditory({ onComplete }: { onComplete: () => void, key?: string }) {
  const [blocks, setBlocks] = useState([
    { id: 1, x: 20, y: 40, hit: false, note: 'Do' },
    { id: 2, x: 50, y: 30, hit: false, note: 'Re' },
    { id: 3, x: 80, y: 40, hit: false, note: 'Mi' },
    { id: 4, x: 35, y: 15, hit: false, note: 'Fa' },
    { id: 5, x: 65, y: 15, hit: false, note: 'Sol' },
  ]);
  const [isJumping, setIsJumping] = useState(false);
  const [collectedCount, setCollectedCount] = useState(0);

  const handleJump = () => {
    if (isJumping) return;
    setIsJumping(true);
    
    // 模拟碰撞检测
    setTimeout(() => {
      const unhit = blocks.find(b => !b.hit);
      if (unhit) {
        setBlocks(prev => prev.map(b => b.id === unhit.id ? { ...b, hit: true } : b));
        setCollectedCount(c => c + 1);
        // Play sound logic would go here
      }
    }, 300);

    setTimeout(() => setIsJumping(false), 600);
  };

  useEffect(() => {
    if (collectedCount === blocks.length) {
      const audio = new Audio(GAME_ASSETS.bgm_auditory_complete);
      audio.play().catch(e => console.log('Audio playback failed:', e));
      
      setTimeout(onComplete, 5000); // 延长展示时间以便听音乐
    }
  }, [collectedCount, blocks.length, onComplete]);

  return (
    <div className="w-full h-full bg-pixel-sky relative p-6 flex flex-col pt-24" onClick={handleJump}>
      <div className="mb-4">
        <h3 className="text-xl font-bold text-sky-900 flex items-center gap-2">
          <Music className="w-5 h-5" /> 听觉碎片
        </h3>
        <p className="text-sm text-sky-700">撞击砖块，收集蒋村的声音</p>
      </div>

      <div className="flex-1 relative border-b-4 border-stone-800 mt-12">
        {/* 砖块 */}
        {blocks.map(block => (
          <motion.div
            key={block.id}
            style={{ left: `${block.x}%`, top: `${block.y}%` }}
            animate={block.hit ? { y: -10, scale: 1.1 } : {}}
            className={`absolute w-12 h-12 -translate-x-1/2 rounded-lg border-4 border-stone-800 flex items-center justify-center font-bold text-xl
              ${block.hit ? 'bg-stone-300 text-stone-500' : 'bg-amber-400 text-amber-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'}
            `}
          >
            {block.hit ? '✓' : '?'}
            {block.hit && (
              <motion.span 
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: -40 }}
                className="absolute text-xs text-emerald-600 font-mono"
              >
                {block.note}
              </motion.span>
            )}
          </motion.div>
        ))}

        {/* 角色 */}
        <motion.div 
          animate={{ y: isJumping ? -150 : 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-20"
        >
          <img src={GAME_ASSETS.character_jiangjiang} className="w-full h-full object-contain" />
        </motion.div>
      </div>

      <div className="h-32 flex items-center justify-center text-stone-400 text-xs font-bold uppercase tracking-widest">
        点击屏幕跳跃
      </div>

      {collectedCount === blocks.length && (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute inset-0 z-50 bg-emerald-500/90 flex flex-col items-center justify-center text-white p-8 text-center"
        >
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-4">
            <Music className="w-12 h-12 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-black mb-2">音乐合成成功！</h2>
          <p className="opacity-80 mb-4">你听到了蒋村清晨的鸟鸣与溪流...</p>
          <a 
            href={GAME_ASSETS.doubao_music_link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[10px] underline opacity-60 hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            点击此处在外部播放完整音乐
          </a>
        </motion.div>
      )}
    </div>
  );
}

// ==========================================
// 第二关：视觉碎片 (视频 + Voxel)
// ==========================================
function Level2Visual({ onComplete }: { onComplete: () => void, key?: string }) {
  const [stage, setStage] = useState<'video' | 'voxel'>('video');
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoEnd = () => {
    setStage('voxel');
  };

  return (
    <div className="w-full h-full bg-stone-900 relative flex flex-col bg-pixel-grid">
      {stage === 'video' ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="mb-8 text-center">
            <h3 className="text-xl font-bold text-white flex items-center justify-center gap-2 mb-2">
              <Eye className="w-5 h-5" /> 视觉碎片
            </h3>
            <p className="text-sm text-stone-400">观看非遗“蠡壳窗”的奥秘</p>
          </div>
          
          <div className="w-full aspect-video bg-black rounded-xl overflow-hidden border-2 border-stone-700 relative group">
            <video 
              ref={videoRef}
              src={GAME_ASSETS.intro_video} 
              className="w-full h-full object-cover"
              onEnded={handleVideoEnd}
              autoPlay
              playsInline
            />
            <button 
              onClick={handleVideoEnd}
              className="absolute bottom-4 right-4 px-4 py-2 bg-white/20 backdrop-blur-md text-white text-xs rounded-full hover:bg-white/40 transition-colors"
            >
              跳过视频
            </button>
          </div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center p-8 bg-stone-100"
        >
          <div className="text-center mb-12">
            <h2 className="text-2xl font-black text-stone-900 mb-2">蠡壳窗</h2>
            <p className="text-stone-500 text-sm">蒋村独有的体素光影艺术</p>
          </div>

          {/* Voxel 风格模拟 (CSS 3D) */}
          <div className="relative w-64 h-64 perspective-1000">
            <motion.div 
              animate={{ rotateY: 360 }}
              transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
              className="w-full h-full relative preserve-3d"
            >
              <img src={GAME_ASSETS.voxel_window} className="w-full h-full object-contain drop-shadow-2xl" />
            </motion.div>
          </div>

          <button 
            onClick={onComplete}
            className="mt-16 px-10 py-4 bg-stone-900 text-white rounded-xl font-bold flex items-center gap-2"
          >
            收集视觉碎片 <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      )}
    </div>
  );
}

// ==========================================
// 第三关：味觉碎片 (RPG 对话)
// ==========================================
function Level3Taste({ onComplete }: { onComplete: () => void, key?: string }) {
  const [dialogIndex, setDialogIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const script = [
    { speaker: "蒋蒋", text: "大家好，我是蒋蒋，我是蒋村土生土长的村里人。今天，我城里的叔叔回来了。看，他来了。" },
    { speaker: "叔叔", text: "（手里拎着一袋鸡蛋糕）蒋蒋，我买了一大兜银杏鸡蛋糕，你要不要尝尝？" },
    { speaker: "蒋蒋", text: "（皱眉）叔叔，我才不要吃呢，这鸡蛋糕我不爱吃，味道有点苦……你怎么吃得下去。" },
    { speaker: "叔叔", text: "（笑了笑，咬了一口，眼神温柔）苦吗？我怎么不觉得。我在城里打拼二十年，最想念的就是这个味道。这次好不容易回来一趟，我得多买点给家里人尝尝。" },
    { speaker: "叔叔", text: "你说的这苦味啊，咱们村里那两棵900多年的银杏树上的银杏果特有的，也是咱们蒋村才有的味道。每次吃到它，我就想起小时候你奶奶在灶台前做糕的样子，想起咱们家的老院子，想起秋天满地的银杏叶……等你长大了，说不定也会爱上这个味道呢。" },
    { speaker: "蒋蒋", text: "长大会喜欢上苦的味道？那我不想长大……" }
  ];

  useEffect(() => {
    let i = 0;
    const fullText = script[dialogIndex].text;
    setDisplayText("");
    setIsTyping(true);
    
    const timer = setInterval(() => {
      setDisplayText(fullText.slice(0, i + 1));
      i++;
      if (i >= fullText.length) {
        clearInterval(timer);
        setIsTyping(false);
      }
    }, 50);

    return () => clearInterval(timer);
  }, [dialogIndex]);

  const handleNext = () => {
    if (isTyping) {
      setDisplayText(script[dialogIndex].text);
      setIsTyping(false);
      return;
    }
    if (dialogIndex < script.length - 1) {
      setDialogIndex(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="w-full h-full bg-pixel-earth relative flex flex-col p-6 pt-24" onClick={handleNext}>
      <div className="mb-4">
        <h3 className="text-xl font-bold text-orange-900 flex items-center gap-2">
          <Utensils className="w-5 h-5" /> 味觉碎片
        </h3>
        <p className="text-sm text-orange-700">苦涩中的乡愁记忆</p>
      </div>

      <div className="flex-1 relative flex items-end justify-center pb-48">
        <div className="relative w-full flex justify-around items-end">
          <motion.div 
            animate={{ opacity: script[dialogIndex].speaker === '蒋蒋' ? 1 : 0.5, scale: script[dialogIndex].speaker === '蒋蒋' ? 1.1 : 1 }}
            className="w-32 h-32"
          >
            <img src={GAME_ASSETS.character_jiangjiang} className="w-full h-full object-contain" />
            <p className="text-center font-bold text-xs mt-2 bg-stone-800 text-white py-1 rounded">蒋蒋</p>
          </motion.div>
          
          <motion.div 
            animate={{ opacity: script[dialogIndex].speaker === '叔叔' ? 1 : 0.5, scale: script[dialogIndex].speaker === '叔叔' ? 1.1 : 1 }}
            className="w-32 h-32"
          >
            <img src={GAME_ASSETS.character_uncle} className="w-full h-full object-contain" />
            <p className="text-center font-bold text-xs mt-2 bg-stone-800 text-white py-1 rounded">叔叔</p>
          </motion.div>
        </div>
        
        {/* 鸡蛋糕素材 */}
        <motion.img 
          initial={{ scale: 0 }}
          animate={{ scale: dialogIndex >= 1 ? 1 : 0 }}
          src={GAME_ASSETS.ginkgo_cake} 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 drop-shadow-xl"
        />
      </div>

      {/* RPG 对话框 */}
      <div className="absolute bottom-8 left-4 right-4 h-48 bg-stone-900 border-4 border-stone-700 rounded-2xl p-6 text-white font-mono shadow-2xl">
        <div className="flex justify-between items-center mb-2">
          <span className="text-emerald-400 font-bold text-sm">[{script[dialogIndex].speaker}]</span>
          {!isTyping && <motion.div animate={{ opacity: [0, 1] }} transition={{ repeat: Infinity }}><ChevronRight className="w-4 h-4" /></motion.div>}
        </div>
        <p className="text-sm leading-relaxed h-24 overflow-y-auto">
          {displayText}
        </p>
        <div className="absolute bottom-2 right-4 text-[10px] text-stone-500 uppercase">点击继续</div>
      </div>
    </div>
  );
}

// ==========================================
// 第四关：插秧游戏 (最终关)
// ==========================================
function Level4Planting({ onComplete }: { onComplete: () => void, key?: string }) {
  const [planted, setPlanted] = useState<number[]>([]);
  const [phase, setPhase] = useState<'planting' | 'irrigating'>('planting');
  const [waterLevel, setWaterLevel] = useState(0);
  const [proverb, setProverb] = useState("");

  const totalSlots = 9;

  const handlePlant = (index: number) => {
    if (planted.includes(index)) return;
    setPlanted(prev => [...prev, index]);
    if (planted.length + 1 === totalSlots) {
      setTimeout(() => setPhase('irrigating'), 1000);
    }
  };

  useEffect(() => {
    if (waterLevel >= 100) {
      setProverb(PROVERBS[Math.floor(Math.random() * PROVERBS.length)]);
      setTimeout(onComplete, 4000);
    }
  }, [waterLevel, onComplete]);

  return (
    <div className="w-full h-full bg-emerald-900/10 bg-pixel-grid relative flex flex-col p-6 pt-24">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-emerald-900 flex items-center gap-2">
          <Sprout className="w-5 h-5" /> 漾里耕种
        </h3>
        <p className="text-sm text-emerald-700">
          {phase === 'planting' ? '快速点击泥土插下秧苗' : '滑动滑块引水灌溉'}
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        {/* 稻田网格 */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-[300px] aspect-square bg-stone-200 p-4 rounded-2xl border-4 border-stone-800 shadow-inner">
          {Array.from({ length: totalSlots }).map((_, i) => (
            <motion.div
              key={i}
              whileTap={{ scale: 0.9 }}
              onClick={() => phase === 'planting' && handlePlant(i)}
              className={`relative aspect-square rounded-lg border-2 border-stone-300 flex items-center justify-center overflow-hidden
                ${planted.includes(i) ? 'bg-emerald-100' : 'bg-stone-300 hover:bg-stone-400 cursor-pointer'}
              `}
            >
              {planted.includes(i) && (
                <motion.img 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  src={GAME_ASSETS.rice_seedling} 
                  className="w-full h-full object-contain"
                />
              )}
              {/* 水面效果 */}
              {phase === 'irrigating' && (
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${waterLevel}%` }}
                  className="absolute bottom-0 left-0 w-full bg-sky-400/30 backdrop-blur-[2px]"
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* 灌溉控制 */}
        {phase === 'irrigating' && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mt-12 w-full px-8"
          >
            <p className="text-center text-xs font-bold text-sky-700 mb-4 uppercase tracking-widest">引水灌溉进度: {waterLevel}%</p>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={waterLevel}
              onChange={(e) => setWaterLevel(parseInt(e.target.value))}
              className="w-full h-4 bg-stone-200 rounded-full appearance-none cursor-pointer accent-sky-500"
            />
          </motion.div>
        )}
      </div>

      {/* 农谚弹出 */}
      <AnimatePresence>
        {proverb && (
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute inset-0 z-50 bg-stone-900/90 flex flex-col items-center justify-center p-12 text-center"
          >
            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-white text-2xl font-black mb-4 leading-tight">
              "{proverb}"
            </h2>
            <p className="text-stone-400 text-sm italic">—— 蒋村传统农谚</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ==========================================
// 结局画面
// ==========================================
function OutroScreen({ fragments, onRestart }: { fragments: string[], onRestart: () => void, key?: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-full bg-stone-900 text-white flex flex-col items-center justify-center p-8 text-center"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="relative w-32 h-32 mx-auto mb-8">
          <img src={GAME_ASSETS.character_jiangjiang} className="w-full h-full object-contain" />
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -top-4 -right-4 w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-stone-900"
          >
            <CheckCircle2 className="w-6 h-6" />
          </motion.div>
        </div>
        
        <h1 className="text-3xl font-black mb-4">漫游完成！</h1>
        <p className="text-stone-400 mb-12">你已成功收集蒋村的全部碎片，感受到了这片土地的呼吸与记忆。</p>
        
        <div className="grid grid-cols-2 gap-4 mb-12">
          {fragments.map((f, i) => (
            <div key={i} className="bg-stone-800 p-4 rounded-xl border border-stone-700 flex flex-col items-center gap-2">
              {f === '听觉' && <Music className="w-6 h-6 text-sky-400" />}
              {f === '视觉' && <Eye className="w-6 h-6 text-purple-400" />}
              {f === '味觉' && <Utensils className="w-6 h-6 text-orange-400" />}
              <span className="text-xs font-bold">{f}碎片</span>
            </div>
          ))}
          <div className="bg-emerald-900/30 p-4 rounded-xl border border-emerald-500/30 flex flex-col items-center gap-2">
            <Sprout className="w-6 h-6 text-emerald-400" />
            <span className="text-xs font-bold">耕种成就</span>
          </div>
        </div>
        
        <button 
          onClick={onRestart}
          className="w-full py-4 bg-white text-stone-900 rounded-full font-black text-lg hover:bg-stone-200 transition-colors active:scale-95"
        >
          再次漫游
        </button>
      </motion.div>
    </motion.div>
  );
}
