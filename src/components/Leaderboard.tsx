import { Stack, Typography, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Box } from "@mui/material";
import { useState, useEffect } from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import { Round, Player } from "../model/model";
import { roundsState } from "../states/RoundsState";
import { playersState } from "../states/PlayerState";

export const Leaderboard = () => {
    const players = useRecoilValue(playersState);
    const rounds = useRecoilValue(roundsState);


    const getHeadToHeadWinner = (playerA: Player, playerB: Player): number => {
        for (const round of rounds) {
            for (const match of round.matches) {
                if ((match.player1.name === playerA.name && match.player2.name === playerB.name) ||
                    (match.player1.name === playerB.name && match.player2.name === playerA.name)) {

                    if (match.score === "2:0" || match.score === "2:1") {
                        return match.player1.name === playerA.name ? -1 : 1;
                    } else if (match.score === "0:2" || match.score === "1:2") {
                        return match.player2.name === playerA.name ? -1 : 1;
                    }
                }
            }
        }
        return 0;
    };

    const sortedPlayers = [...players].sort((a, b) => {
        if (b.points !== a.points) {
            return b.points - a.points;
        }
        return getHeadToHeadWinner(a, b);
    });

    return (
        <Stack spacing={3}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', padding: '1rem', border: '3px solid #ab8b16', boxShadow: '0px 0px 6px rgba(0, 0, 0, 1)' }}>
                <Stack spacing={1} sx={{ alignItems: 'center', justifyContent: 'center' }}>
                    {sortedPlayers.map((player, place) => (
                        <Box key={player.name} sx={{ display: 'flex', alignItems: 'center', padding: '0.5rem', gap: '1rem' }}>
                            {place + 1 === 1 && <Typography variant='h4'>🥇</Typography>}
                            {place + 1 === 2 && <Typography variant='h4'>🥈</Typography>}
                            {place + 1 === 3 && <Typography variant='h4'>🥉</Typography>}
                            {place + 1 > 3 && <Typography variant='h4'>💐</Typography>}
                            <img src={player.portrait} alt={player.name} style={{ height: '4rem', maxWidth: '4rem', objectFit: 'cover' }} />
                            <Typography variant='h4' >{player.name}</Typography>
                            <Typography variant='h4'>{player.points}</Typography>
                        </Box>
                    ))}
                </Stack>
            </Box>
        </Stack>
    );
}