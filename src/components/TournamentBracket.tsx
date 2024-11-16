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
        // Use the roundrobin library to generate the matches
        const playerNames = players.map(player => player.name);
        const roundsRobin = robin(playerNames.length, playerNames);

        const generatedRounds: Round[] = roundsRobin.map((round: string[][], roundIndex: any) => {
            const matches: Match[] = round.map((matchPair: string[]) => {
                const player1 = players.find(player => player.name === matchPair[0]);
                const player2 = players.find(player => player.name === matchPair[1]);
                return {
                    player1: player1!,
                    player2: player2!,
                    score: undefined, // Initial score is undefined
                };
            });

            return {
                matches: matches,
                waitingPlayers: [], // This example doesn't handle waiting players, but you could add logic here
            };
        });

        const allMatches = generatedRounds.flatMap(round => round.matches);
        setMatches(allMatches);

        return generatedRounds;
    };

    const updatePlayersWithMatches = () => {

        // Create a new array of players with updated matches
        const updatedPlayers = players.map(player => {
            // Filter matches where the current player is either player1 or player2
            const playerMatches = matches.filter(match =>
                match.player1.name === player.name || match.player2.name === player.name);

            // Return a new player object with the updated matches array
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
            setSelectedScore(score); // Set the selected score to highlight the button
            onUpdateScore(score); // Call the provided onUpdateScore function to update the match score
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
                                backgroundColor: selectedScore === score ? '#ab8b16' : 'transparent', // Highlight the selected score button
                                color: selectedScore === score ? 'white' : 'black', // Change text color for selected button
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

    console.log(matches);



    // Effect hook to generate rounds on initial render
    useEffect(() => {
        if (rounds.length === 0) {
            const generatedRounds = generateTournamentRounds(players);
            setRounds(generatedRounds);
            // Update matches state with all matches from all rounds
            const allMatches = generatedRounds.flatMap(round => round.matches);
            setMatches(allMatches);
        }
    }, [players, setMatches]);

    useEffect(() => {
        updatePlayersWithMatches();
    }, [rounds]);

    // Basic styling for now, will need to be expanded
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
                    </Stack>
                </div>
            ))}
        </div>
    );
};

export default TournamentBracket;
