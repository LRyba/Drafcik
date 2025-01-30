import { Stack, Typography, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { useState, useEffect } from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import { Round, Player } from "../model/model";
import { roundsState } from "../states/RoundsState";
import { playersState } from "../states/PlayerState";

export const Leaderboard = () => {
    const [players, setPlayers] = useRecoilState(playersState);
    const matches = useRecoilValue(roundsState);
    const [leaderboard, setLeaderboard] = useState<Player[]>([]);

    // useEffect(() => {
    //     const updatedPlayers = players.map((player) => {
    //         if (player.matchIds.length !== 0) return player;
    //         const playerMatches = matches.filter((match) => match.player1.name === player.name || match.player2.name === player.name);
    //         return { ...player, matchIds: playerMatches.map((match) => match.id) };
    //     });

    //     setPlayers(updatedPlayers);
    // }, [matches]);

    // useEffect(() => {
    //     const updatedLeaderboard = players.sort((a, b) => b.points - a.points);
    //     setLeaderboard(updatedLeaderboard);
    // }, [players]);

    return (
        <Stack spacing={3}>
            <Typography variant='h4'>Tabela wyników</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Pozycja</TableCell>
                            <TableCell>Zawodnik</TableCell>
                            <TableCell>Punkty</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {leaderboard.map((player, index) => (
                            <TableRow key={player.name}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{player.name}</TableCell>
                                <TableCell>{player.points}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Stack>
    );
}