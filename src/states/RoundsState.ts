import { atom } from "recoil";
import { Round } from "../model/model";

export const roundsState = atom<Round[]>({
    key: "roundsState",
    default: [],
});