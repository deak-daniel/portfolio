import { useEffect, useRef, useState } from 'react'

type GameState = {
    player: Player;
    enemies: Enemy[];
    bullets?: Bullet[];
}

type Position = {
    x: number;
    y: number;
}

type Player = {
    name: string;
    health: number;
    state: 'dead' | 'alive'
    position: Position
}

type Enemy = {
    id: number;
    name: string;
    health: number;
    state: 'dead' | 'alive'
    position: Position
}

type Bullet = {
    position: Position;
    direction: Position;
    damage?: number;
}

const INITIAL_STATE: GameState = {
    player: { name: 'Hero', health: 100, state: 'alive', position: { x: 50, y: 50 } },
    enemies: [
        { id: 1, name: 'Monster', health: 50, state: 'alive', position: { x: 200, y: 200 } },
        { id: 2, name: 'Monster', health: 50, state: 'alive', position: { x: 250, y: 300 } },
    ],
    bullets: []
}

const canvasWidth = 800;
const canvasHeight = 600;

export default function Game() {
    const [points, setPoints] = useState(0);
    const gameState = useRef<GameState>(INITIAL_STATE);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const keysPressed = useRef<Set<string>>(new Set());
    const [isGameRunning, setIsGameRunning] = useState<boolean | null>(null);

    function isInsideCanvas(pos: Position, size: number) {
        return pos.x > 0 && pos.x < canvasWidth - size && pos.y > 0 && pos.y < canvasHeight - size;
    }

    function didHit(enemy: Enemy, bullet: Bullet) {
        return bullet.position.x < enemy.position.x + 30 &&
            bullet.position.x + 5 > enemy.position.x &&
            bullet.position.y < enemy.position.y + 30 &&
            bullet.position.y + 5 > enemy.position.y;
    }

    function update() {
        const state = gameState.current;
        const speed = 4;
        const enemySpeed = 2;
        const bulletSpeed = 8;

        if (keysPressed.current.has('w')) if (state.player.position.y > 0) state.player.position.y -= speed;
        if (keysPressed.current.has('s')) if (state.player.position.y < canvasHeight - 30) state.player.position.y += speed;
        if (keysPressed.current.has('a')) if (state.player.position.x > 0) state.player.position.x -= speed;
        if (keysPressed.current.has('d')) if (state.player.position.x < canvasWidth - 30) state.player.position.x += speed;

        state.enemies.forEach(enemy => {
            const direction: Position = getDirection(enemy.position, state.player.position);
            enemy.position.y += direction.y * enemySpeed;
            enemy.position.x += direction.x * enemySpeed;
            state.bullets?.forEach(bullet => {
                if (didHit(enemy, bullet)) {
                    enemy.health -= bullet.damage || 10;
                    state.bullets = state.bullets?.filter(b => b !== bullet);
                }
            });

            if (enemy.health <= 0) {
                enemy.state = 'dead';
            }
        });

        state.bullets?.forEach(b => {

            if (isInsideCanvas(b.position, 5)) {
                b.position.x += b.direction.x * bulletSpeed;
                b.position.y += b.direction.y * bulletSpeed;
            } else {
                state.bullets = state.bullets?.filter(bullet => bullet !== b);
            }
        });
    }

    function render() {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'royalblue';
        const p = gameState.current.player.position;
        ctx.fillRect(p.x, p.y, 30, 30);

        ctx.fillStyle = 'crimson';
        gameState.current.enemies.forEach(enemy => {
            if (enemy.state === 'alive') {
                ctx.fillRect(enemy.position.x, enemy.position.y, 30, 30);
            }
        });

        ctx.fillStyle = 'yellow';
        gameState.current.bullets?.forEach(bullet => {
            ctx.fillRect(bullet.position.x, bullet.position.y, 5, 5);
        });
    }

    function getDirection(from: Position, to: Position): Position {
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        return { x: dx / length, y: dy / length };
    }

    function shoot(e: MouseEvent) {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        gameState.current.bullets?.push({
            position: { ...gameState.current.player.position },
            direction: getDirection(gameState.current.player.position, { x: mouseX, y: mouseY }),
            damage: 10
        });
    }

    function startGame() {
        setIsGameRunning(true);
    }

    // logic
    useEffect(() => {
        if (!isGameRunning) return;
        const down = (e: KeyboardEvent) => keysPressed.current.add(e.key.toLowerCase());
        const up = (e: KeyboardEvent) => keysPressed.current.delete(e.key.toLowerCase());
        window.addEventListener('keydown', down);
        window.addEventListener('keyup', up);
        window.addEventListener('mousedown', shoot);

        let frameId: number;
        const tick = () => {
            update();
            render();
            frameId = requestAnimationFrame(tick);
        };

        tick();

        return () => {
            window.removeEventListener('keydown', down);
            window.removeEventListener('keyup', up);
            window.removeEventListener('mousedown', shoot);
            cancelAnimationFrame(frameId);
        };
    }, [isGameRunning]);

    return (
        <div className="relative w-full h-full">
            <div className=' font-mali absolute top-10 left-10 font-md border border-white text-white p-2 rounded-lg z-10'>
                points: {points}
            </div>
            {isGameRunning === null && (
                <div onClick={() => startGame()} className='inline absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 border border-white p-4 rounded-lg text-white font-mali text-lg cursor-pointer z-10 transition-opacity duration-500' style={{ opacity: isGameRunning ? 0 : 1 }}>
                    Click to start the game!
                </div>)}
            <canvas
                ref={canvasRef}
                width={canvasWidth}
                height={canvasHeight}
                style={{ border: '2px solid white', background: '#1a1a1a' }}
            />
        </div>
    )
}
