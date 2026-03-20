/// <reference types="vite/client" />

declare module '*.json' {
    const value: unknown;
    export default value;
}

declare module '/media/lottie/*.json' {
    const value: unknown;
    export default value;
}

declare module '*.mp3' {
    const src: string;
    export default src;
}

declare module '*.wav' {
    const src: string;
    export default src;
}
