import { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { playersState } from '../states/PlayerState';
import { matchesState } from '../states/MatchesState';
import { Match, Player, Round } from '../model/model';
import { Button, Stack, styled } from '@mui/material';

var robin = require('roundrobin');

export const TournamentBracket = () => {
    const players = useRecoilValue(playersState);
    const setPlayers = useSetRecoilState(playersState);
    const matches = useRecoilValue(matchesState);
    const setMatches = useSetRecoilState(matchesState);
    const [rounds, setRounds] = useState<Round[]>([]);

    const generateTournamentRounds = (players: Player[]): Round[] => {
        const playerNames = players.map(player => player.name);
        const robinOutput = robin(playerNames.length, playerNames);

        const generatedRounds: Round[] = robinOutput.map((round: string[][], roundIndex: any) => {
            const waitingPlayers: Player[] = [...players];
            const matches: Match[] = round.map((matchPair: string[]) => {
                const player1 = players.find(player => player.name === matchPair[0]);
                const player2 = players.find(player => player.name === matchPair[1]);

                //TODO fix player matches push logic
                if (player1 && player2) {
                    waitingPlayers.splice(waitingPlayers.indexOf(player1), 1);
                    waitingPlayers.splice(waitingPlayers.indexOf(player2), 1);

                    const match = {
                        player1: player1,
                        player2: player2,
                        score: undefined,
                    }

                    player1.matches.push(match);
                    player2.matches.push(match);

                    return match;
                }
                throw new Error('Player not found');
            });

            return {
                matches: matches,
                waitingPlayer: waitingPlayers[0],
            };
        });

        const allMatches = generatedRounds.flatMap(round => round.matches);
        setMatches(allMatches);

        return generatedRounds;
    };

    const updatePlayersWithMatches = () => {
        const updatedPlayers = players.map(player => {
            const playerMatches = matches.filter(match =>
                match.player1.name === player.name || match.player2.name === player.name);
            return {
                ...player,
                matches: playerMatches,
            };
        });

        // Update the playersState with the new array of updated players
        setPlayers(updatedPlayers);
    };


    const MatchItem = ({ match, onUpdateScore }: { match: Match; onUpdateScore: (score: Match['score']) => void }) => {
        const [selectedScore, setSelectedScore] = useState<Match['score'] | null>(null);

        const MatchContainer = styled('div')(({ theme }) => ({
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.25rem',
            margin: '10px 0',
            border: '2px solid #ab8b16',
            borderRadius: theme.shape.borderRadius,
            boxShadow: '0px 0px 6px rgba(0, 0, 0, 0.5)',
        }));

        const PlayerName = styled('span')({
            fontWeight: 'bold',
            marginTop: '0.5rem',
        });

        const scores: Match['score'][] = ['2:0', '2:1', '1:2', '0:2'];

        const handleScoreSelect = (score: Match['score']) => {
            setSelectedScore(score);
            onUpdateScore(score);
        };

        return (
            <MatchContainer>
                <Stack direction="row" spacing={2} alignItems='center'>
                    <Stack alignItems="center">
                        <img src={match.player1.portrait} alt={match.player1.name} style={{ height: '6rem', maxWidth: '4rem', objectFit: 'cover' }} />
                        <PlayerName>{match.player1.name}</PlayerName>
                    </Stack>
                    {scores.map(score => (
                        <Button
                            key={score}
                            variant="outlined"
                            onClick={() => handleScoreSelect(score)}
                            style={{
                                backgroundColor: selectedScore === score ? '#ab8b16' : 'transparent',
                                color: selectedScore === score ? 'white' : 'black',
                            }}
                        >
                            {score}
                        </Button>
                    ))}
                    <Stack alignItems="center">
                        <img src={match.player2.portrait} alt={match.player2.name} style={{ height: '6rem', maxWidth: '4rem', objectFit: 'cover' }} />
                        <PlayerName>{match.player2.name}</PlayerName>
                    </Stack>
                </Stack>
            </MatchContainer>
        );
    };

    useEffect(() => {
        if (rounds.length === 0) {
            const generatedRounds = generateTournamentRounds(players);
            setRounds(generatedRounds);
            const allMatches = generatedRounds.flatMap(round => round.matches);
            setMatches(allMatches);
        }
    }, [players, setMatches]);

    useEffect(() => {
        updatePlayersWithMatches();
    }, [rounds]);

    const roundStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0.5rem',
        border: '3px solid #ab8b16',
        boxShadow: '0px 0px 6px rgba(0, 0, 0, 1)',
    };
    const handleUpdateScore = (matchId: string, score: Match['score']) => {
        // Placeholder: Implement logic to update the match score in the application state
        console.log(matchId, score);
    };

    return (
        <div>
            {rounds.map((round, roundIndex) => (
                <div key={roundIndex} style={roundStyle}>
                    <Stack justifyContent='center' alignItems='center' spacing={1}>
                        <h2>Runda {roundIndex + 1}</h2>
                        {round.matches.map((match, matchIndex) => (
                            <MatchItem key={matchIndex} match={match} onUpdateScore={(score) => handleUpdateScore(`${roundIndex}-${matchIndex}`, score)} />
                        ))}
                        {round.waitingPlayer && <h3>Przerwa: {round.waitingPlayer.name}</h3>}
                    </Stack>
                </div>
            ))}
        </div>
    );
};

export default TournamentBracket;
