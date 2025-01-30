
import { useState } from 'react';
import { Match, } from '../model/model';
import { Button, Stack, styled } from '@mui/material';



export const MatchElement = ({ match, onUpdateScore }: { match: Match; onUpdateScore: (score: Match['score']) => void }) => {
    const [selectedScore, setSelectedScore] = useState<Match['score']>(match.score);

    const MatchContainer = styled('div')(({ theme }) => ({
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.25rem',
        margin: '100px 0',
        border: '2px solid black',
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
            <Stack direction='row' spacing={2} alignItems='center'>
                <Stack alignItems='center'>
                    <img
                        src={match.player1.portrait}
                        alt={match.player1.name}
                        style={{ height: '6rem', maxWidth: '4rem', objectFit: 'cover' }}
                    />
                    <PlayerName>{match.player1.name}</PlayerName>
                </Stack>
                {scores.map((score) => (
                    <Button
                        key={score}
                        variant='outlined'
                        onClick={() => handleScoreSelect(score)}
                        style={{
                            backgroundColor: selectedScore === score ? '#ab8b16' : 'transparent',
                            color: selectedScore === score ? 'white' : 'black',
                            fontWeight: 'bold'
                        }}
                    >
                        {score}
                    </Button>
                ))}
                <Stack alignItems='center'>
                    <img
                        src={match.player2.portrait}
                        alt={match.player2.name}
                        style={{ height: '6rem', maxWidth: '4rem', objectFit: 'cover' }}
                    />
                    <PlayerName>{match.player2.name}</PlayerName>
                </Stack>
            </Stack>
        </MatchContainer>
    );
};