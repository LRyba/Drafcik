import { atom } from "recoil";
import { Player } from "../model/model";

export const playersState = atom<Player[]>({
    key: "playersState",
    default: [],
});