import { atom } from "recoil";
import { Match } from "../model/model";

export const matchesState = atom<Match[]>({
    key: "matchesState",
    default: [],
});