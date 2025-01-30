import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { playersState } from '../states/PlayerState';
import { matchesState } from '../states/MatchesState';
import { Match, Player, Round } from '../model/model';
import { Button, Stack, styled } from '@mui/material';
import { MatchElement } from './MatchElement';

const robin = require('roundrobin');

export const TournamentBracket = () => {
  const [players, setPlayers] = useRecoilState(playersState);
  const [matches, setMatches] = useRecoilState(matchesState);
  const [rounds, setRounds] = useState<Round[]>([]);

  console.log(players)

  const generateTournamentRounds = (players: Player[]): Round[] => {
    const playerNames = players.map((player) => player.name);
    const robinOutput = robin(playerNames.length, playerNames);
    let matchId = 0;

    const generatedRounds: Round[] = robinOutput.map((round: string[][], roundIndex: any) => {
      const unmatchedPlayers: Player[] = [...players];
      const roundMatches: Match[] = round.map((matchPair: string[]) => {
        const player1 = players.find((player) => player.name === matchPair[0]) as Player;
        const player2 = players.find((player) => player.name === matchPair[1]) as Player;

        unmatchedPlayers.splice(unmatchedPlayers.indexOf(player1), 1);
        unmatchedPlayers.splice(unmatchedPlayers.indexOf(player2), 1);

        const match = {
          id: matchId++,
          player1: player1,
          player2: player2,
          score: undefined,
        };
        return match;
      });

      return {
        matches: roundMatches,
        waitingPlayer: unmatchedPlayers[0] || undefined,
      };
    });

    const allMatches = generatedRounds.flatMap((round) => round.matches);
    setMatches(allMatches);

    return generatedRounds;
  };

  const updatePlayersWithMatches = () => {
    const updatedPlayers = players.map((player) => {
      if (player.matchIds.length !== 0) return player;
      const playerMatches = matches.filter((match) => match.player1.name === player.name || match.player2.name === player.name);
      return { ...player, matchIds: playerMatches.map((match) => match.id) };
    });

    setPlayers(updatedPlayers);
  };

  const handleUpdateScore = (matchId: string, score: Match['score']) => {
    // const updatedMatches = matches.map((match) => (match.id.toString() === matchId ? { ...match, score } : match));
    // setMatches(updatedMatches);
    const updatedRounds = rounds.map((round) => ({
      ...round,
      matches: round.matches.map((match) => (match.id.toString() === matchId ? { ...match, score } : match)),
    }));
    setRounds(updatedRounds);
  };

  useEffect(() => {
    if (rounds.length === 0) {
      const generatedRounds = generateTournamentRounds(players);
      setRounds(generatedRounds);
      const allMatches = generatedRounds.flatMap((round) => round.matches);
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
    padding: '1rem',
    border: '3px solid #ab8b16',
    boxShadow: '0px 0px 6px rgba(0, 0, 0, 1)',
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem', justifyContent: 'center' }}>
      {rounds.map((round, roundIndex) => (
        <div key={roundIndex} style={roundStyle}>
          <Stack justifyContent="center" alignItems="center" spacing={2}>
            <h2>Runda {roundIndex + 1}</h2>
            {round.matches.map((match) => (
              <MatchElement
                key={`match-${match.id}`}
                match={match}
                onUpdateScore={(score) => handleUpdateScore(match.id.toString(), score)}
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
