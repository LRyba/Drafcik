import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { playersState } from '../states/PlayerState';
import { roundsState } from '../states/RoundsState';
import { Match, Player, Round } from '../model/model';
import { Button, Stack, styled } from '@mui/material';
import { MatchElement } from './MatchElement';

export interface TournamentBracketProps {
  rounds: Round[];
  onScoreUpdate: (matchId: string, score: Match['score']) => void;
}

export const TournamentBracket = (props: TournamentBracketProps) => {
  const { rounds, onScoreUpdate } = props;
  const [players, setPlayers] = useRecoilState(playersState);

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
                onUpdateScore={(score) => onScoreUpdate(match.id.toString(), score)}
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
