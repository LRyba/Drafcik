import { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { playersState } from '../states/PlayerState';
import { matchesState } from '../states/MatchesState';
import { Match, Player, Round } from '../model/model';
import { Button, Stack, styled } from '@mui/material';

const robin = require('roundrobin');

export const TournamentBracket = () => {
  const players = useRecoilValue(playersState);
  const setMatches = useSetRecoilState(matchesState);
  const [rounds, setRounds] = useState<Round[]>([]);

  const generateTournamentRounds = (players: Player[]): Round[] => {
    const playerNames = players.map((player) => player.name);
    const robinOutput = robin(playerNames.length, playerNames);
    let matchId = 0;

    const generatedRounds: Round[] = robinOutput.map((round: string[][], roundIndex: any) => {
      const unmatchedPlayers: Player[] = [...players];
      const matches: Match[] = round.map((matchPair: string[]) => {
        const player1 = players.find((player) => player.name === matchPair[0]) as Player;
        const player2 = players.find((player) => player.name === matchPair[1]) as Player;

        unmatchedPlayers.splice(unmatchedPlayers.indexOf(player1), 1);
        unmatchedPlayers.splice(unmatchedPlayers.indexOf(player2), 1);
        player1.matchIds.push(matchId);
        player2.matchIds.push(matchId);

        const match = {
          id: matchId++,
          player1: player1,
          player2: player2,
          score: undefined,
        };
        return match;
      });

      return {
        matches: matches,
        waitingPlayer: unmatchedPlayers[0] || undefined,
      };
    });

    const allMatches = generatedRounds.flatMap((round) => round.matches);
    setMatches(allMatches);

    return generatedRounds;
  };

  const MatchElement = ({ match, onUpdateScore }: { match: Match; onUpdateScore: (score: Match['score']) => void }) => {
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

  useEffect(() => {
    if (rounds.length === 0) {
      const generatedRounds = generateTournamentRounds(players);
      setRounds(generatedRounds);
      const allMatches = generatedRounds.flatMap((round) => round.matches);
      setMatches(allMatches);
    }
  }, [players, setMatches]);

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
              <MatchElement
                key={matchIndex}
                match={match}
                onUpdateScore={(score) => handleUpdateScore(`${roundIndex}-${matchIndex}`, score)}
              />
            ))}
            {round.waitingPlayer && <h3>Przerwa: {round.waitingPlayer.name}</h3>}
          </Stack>
        </div>
      ))}
    </div>
  );
};

export default TournamentBracket;
