import { useEffect, useRef, useState } from 'react';

type Position = { x: number; y: number; };

type Particle = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    color: string;
};

type Player = {
    health: number;
    state: 'dead' | 'alive';
    position: Position;
    iFrames: number;
};

type Enemy = {
    id: number;
    health: number;
    state: 'dead' | 'alive';
    position: Position;
};

type Bullet = {
    position: Position;
    direction: Position;
    damage: number;
};

type GameState = {
    player: Player;
    enemies: Enemy[];
    bullets: Bullet[];
    particles: Particle[];
    spawnTimer: number;
};

const canvasWidth = 800;
const canvasHeight = 600;
const damage = 10;
let spawnTime = 1;

const difficultySettings = {
    easy: { spawnTime: 2.0, enemyHealth: 20 },
    normal: { spawnTime: 1.0, enemyHealth: 30 },
    hard: { spawnTime: 0.5, enemyHealth: 40 },
};

const INITIAL_STATE: GameState = {
    player: { health: 100, state: 'alive', position: { x: 400, y: 300 }, iFrames: 2 },
    enemies: [
        { id: 1, health: 30, state: 'alive', position: { x: 100, y: 100 } },
        { id: 2, health: 30, state: 'alive', position: { x: 700, y: 500 } },
    ],
    bullets: [],
    particles: [],
    spawnTimer: 0.5,
};

export default function Game() {
    const [points, setPoints] = useState(0);
    const [isGameRunning, setIsGameRunning] = useState<boolean | null>(null);

    const gameState = useRef<GameState>(JSON.parse(JSON.stringify(INITIAL_STATE)));
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const keysPressed = useRef<Set<string>>(new Set());
    const lastTime = useRef<number>(0);

    function getDirection(from: Position, to: Position): Position {
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const length = Math.sqrt(dx * dx + dy * dy) || 1;
        return { x: dx / length, y: dy / length };
    }

    function setDifficultySettings(level: string) {
        const settings = difficultySettings[level as keyof typeof difficultySettings];
        spawnTime = settings.spawnTime;
        INITIAL_STATE.enemies.forEach(enemy => enemy.health = settings.enemyHealth);
    }

    function didHit(enemy: Enemy, bullet: Bullet) {
        return bullet.position.x < enemy.position.x + 30 &&
            bullet.position.x + 5 > enemy.position.x &&
            bullet.position.y < enemy.position.y + 30 &&
            bullet.position.y + 5 > enemy.position.y;
    }

    function createExplosion(x: number, y: number, color: string) {
        for (let i = 0; i < 12; i++) {
            gameState.current.particles.push({
                x, y,
                vx: (Math.random() - 0.5) * 150,
                vy: (Math.random() - 0.5) * 150,
                life: 1.0, 
                color
            });
        }
    }

    function startGame() {
        gameState.current = INITIAL_STATE;
        setPoints(0);
        setIsGameRunning(true);
    }

    function update(dt: number) {
        const state = gameState.current;

        const playerSpeed = 250;
        const enemySpeed = 200;
        const bulletSpeed = 500;

        if (keysPressed.current.has('w') && state.player.position.y > 0)
            state.player.position.y -= playerSpeed * dt;
        if (keysPressed.current.has('s') && state.player.position.y < canvasHeight - 30)
            state.player.position.y += playerSpeed * dt;
        if (keysPressed.current.has('a') && state.player.position.x > 0)
            state.player.position.x -= playerSpeed * dt;
        if (keysPressed.current.has('d') && state.player.position.x < canvasWidth - 30)
            state.player.position.x += playerSpeed * dt;

        state.particles.forEach(p => {
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.life -= dt;
            p.vx *= 0.98;
            p.vy *= 0.98;
        });
        state.particles = state.particles.filter(p => p.life > 0);

        state.enemies.forEach(enemy => {
            if (enemy.state === 'dead') return;

            const dir = getDirection(enemy.position, state.player.position);
            enemy.position.x += dir.x * enemySpeed * dt;
            enemy.position.y += dir.y * enemySpeed * dt;

            state.bullets.forEach((bullet, bIndex) => {
                if (didHit(enemy, bullet)) {
                    createExplosion(bullet.position.x, bullet.position.y, '#FFD700');
                    enemy.health -= damage;

                    if (enemy.health <= 0) {
                        enemy.state = 'dead';
                        createExplosion(enemy.position.x + 15, enemy.position.y + 15, '#FF4500');
                        setPoints(prev => prev + 10);
                    }
                    state.bullets.splice(bIndex, 1);
                }
            });
        });

        state.bullets.forEach((b, index) => {
            b.position.x += b.direction.x * bulletSpeed * dt;
            b.position.y += b.direction.y * bulletSpeed * dt;

            if (b.position.x < 0 || b.position.x > canvasWidth || b.position.y < 0 || b.position.y > canvasHeight) {
                state.bullets.splice(index, 1);
            }
        });

        if (state.player.state === 'alive') {
            if (state.player.iFrames > 0) state.player.iFrames -= dt;

            state.enemies.forEach(enemy => {
                if (enemy.state === 'dead') return;

                const playerHit = didHit({ position: state.player.position } as Enemy, { position: enemy.position } as Bullet);

                if (playerHit && state.player.iFrames <= 0) {
                    state.player.health -= 25;
                    state.player.iFrames = 1.0; 
                    createExplosion(state.player.position.x, state.player.position.y, 'white');

                    if (state.player.health <= 0) {
                        state.player.state = 'dead';
                        setIsGameRunning(false); 
                    }
                }
            });
        }


        state.spawnTimer += dt;

        if (state.spawnTimer >= spawnTime) {
            const side = Math.floor(Math.random() * 4);
            let x = 0, y = 0;

            if (side === 0) { x = Math.random() * canvasWidth; y = -30; } // Top
            if (side === 1) { x = Math.random() * canvasWidth; y = canvasHeight + 30; } // Bottom
            if (side === 2) { x = -30; y = Math.random() * canvasHeight; } // Left
            if (side === 3) { x = canvasWidth + 30; y = Math.random() * canvasHeight; } // Right

            state.enemies.push({
                id: Math.random(),
                health: 30,
                state: 'alive',
                position: { x, y }
            });

            state.spawnTimer = 0;
        }
    }

    function render() {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!ctx || !canvas) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#4169E1';
        ctx.fillRect(gameState.current.player.position.x, gameState.current.player.position.y, 30, 30);

        ctx.fillStyle = '#DC143C';
        gameState.current.enemies.forEach(enemy => {
            if (enemy.state === 'alive') {
                ctx.fillRect(enemy.position.x, enemy.position.y, 30, 30);
            }
        });

        ctx.fillStyle = '#FFFF00';
        gameState.current.bullets.forEach(bullet => {
            ctx.fillRect(bullet.position.x, bullet.position.y, 5, 5);
        });

        gameState.current.particles.forEach(p => {
            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, 3, 3);
        });
        ctx.globalAlpha = 1;
    }

    function shoot(e: MouseEvent) {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const target = { x: e.clientX - rect.left, y: e.clientY - rect.top };

        gameState.current.bullets.push({
            position: { ...gameState.current.player.position },
            direction: getDirection(gameState.current.player.position, target),
            damage: 10
        });
    }

    useEffect(() => {
        if (!isGameRunning) return;

        const handleKeyDown = (e: KeyboardEvent) => keysPressed.current.add(e.key.toLowerCase());
        const handleKeyUp = (e: KeyboardEvent) => keysPressed.current.delete(e.key.toLowerCase());

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        window.addEventListener('mousedown', shoot);

        let frameId: number;
        lastTime.current = performance.now();

        const tick = (now: number) => {
            const dt = Math.min((now - lastTime.current) / 1000, 0.1);
            lastTime.current = now;

            update(dt);
            render();
            frameId = requestAnimationFrame(tick);
        };

        frameId = requestAnimationFrame(tick);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('mousedown', shoot);
            cancelAnimationFrame(frameId);
        };
    }, [isGameRunning]);

    return (
        <div className="relative flex flex-col items-center justify-center bg-gray-900 overflow-hidden">
            <div className='absolute top-10 left-10 text-2xl font-bold border-2 border-white text-white p-4 rounded-xl z-10 bg-black/50 backdrop-blur-sm'>
                SCORE: {points}
            </div>

            {isGameRunning === null && (
                <div className='absolute z-20 flex flex-col gap-4'>
                    <select defaultValue="normal" className='bg-transparent border border-white px-4 py-2 text-white text-lg rounded-md' onInput={(e) => setDifficultySettings(e.currentTarget.value)}>
                        <option className='text-white bg-black' value="easy">Easy</option>
                        <option className='text-white bg-black' value="normal">Normal</option>
                        <option className='text-white bg-black' value="hard">Hard</option>
                    </select>
                    <button
                        onClick={() => setIsGameRunning(true)}
                        className='px-8 py-4 text-2xl font-bold text-white border-4 border-white rounded-full hover:bg-white hover:text-black transition-all active:scale-95'
                    >
                        START GAME
                    </button>
                </div>
            )}
            {isGameRunning !== null && isGameRunning === false && (
                <div className='absolute z-20 px-8 py-4 text-2xl font-bold text-white border-2 border-white rounded-lg flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm'>
                    <div className='z-20 px-8 py-4 text-2xl font-bold text-white'>
                        GAME OVER<br />
                        FINAL SCORE: {points}
                    </div>
                    <button
                        onClick={() => startGame()}
                        className='z-20 border border-white px-8 py-4 text-2xl font-bold text-white hover:bg-white hover:text-black transition-all active:scale-95'
                    >
                        START GAME
                    </button>
                </div>

            )}
            <canvas
                ref={canvasRef}
                width={canvasWidth}
                height={canvasHeight}
                className="shadow-2xl rounded-lg"
                style={{ border: '4px solid white', background: '#0a0a0a' }}
            />
        </div>
    );
}