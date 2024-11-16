import { atom } from "recoil";

export const navigationState = atom<'addPlayers' | 'bracket' | 'leaderboard'>({
    key: "navigationState",
    default: 'addPlayers',
});