
export interface Player {
    name: string;
    colors: {
        white: boolean;
        blue: boolean;
        black: boolean;
        red: boolean;
        green: boolean;
    }
    portrait?: string;
    matchIds: number[];
    points: number;
}

export type Color = keyof Player['colors'];

export interface Match {
    id: number;
    player1: Player;
    player2: Player;
    score: "2:0" | "2:1" | "1:2" | "0:2" | undefined;
}

export interface Round {
    matches: Match[];
    waitingPlayer: Player | undefined;
}