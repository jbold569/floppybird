export const playerBoundingBox: BoundingBox = { x: 60, y: 180, width: 34, height: 24 };

export enum GameState {
    SplashScreen,
    Playing,
    PlayerDying,
    ScoreScreen,
}

// export const sounds = {
//     jump: new Howl({ src: ['/assets/sounds/sfx_wing.ogg'], volume: 0.3 }),
//     score: new Howl({ src: ['/assets/sounds/sfx_point.ogg'], volume: 0.3 }),
//     hit: new Howl({ src: ['/assets/sounds/sfx_hit.ogg'], volume: 0.3 }),
//     die: new Howl({ src: ['/assets/sounds/sfx_die.ogg'], volume: 0.3 }),
//     swoosh: new Howl({ src: ['/assets/sounds/sfx_swooshing.ogg'], volume: 0.3 }),
// };

export interface BoundingBox {
    x: number;
    y: number;
    width: number;
    height: number;
}

export const wait = async (time: number) => {
    return new Promise(resolve => {
        setTimeout(resolve, time);
    })
}

export const log = (...args: any[]) => {
    console.log(`[${Date.now()}]`, ...args);
}

export const toRad = (degrees: number) => {
    return degrees * Math.PI / 180;
}

export const isBoxIntersecting = (a: BoundingBox, b: BoundingBox) => {
    return (
        a.x <= (b.x + b.width) &&
        b.x <= (a.x + a.width) &&
        a.y <= (b.y + b.height) &&
        b.y <= (a.y + a.height)
    );
}

const debugBoxes = new Map<HTMLElement, HTMLDivElement>();
const debuggerEnabled = true;

export const drawDebugBox = (key: HTMLElement, box: BoundingBox) => {
    if (!debuggerEnabled) {
        return;
    }

    if (!debugBoxes.has(key)) {
        const newDebugBox = document.createElement('div');
        newDebugBox.className = 'boundingbox';
        const debugContainer = document.getElementById('debug');
        debugContainer!.appendChild(newDebugBox);
        debugBoxes.set(key, newDebugBox);
    }

    const boudingBox = debugBoxes.get(key);

    if (boudingBox == null) {
        log(`couldn't create a debug box for ${key}`);
        return;
    }

    boudingBox.style.top = `${box.y}px`;
    boudingBox.style.left = `${box.x}px`;
    boudingBox.style.width = `${box.width}px`;
    boudingBox.style.height = `${box.height}px`;
}