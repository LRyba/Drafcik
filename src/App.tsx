import { Box, Typography, ThemeProvider, Button, Stack } from '@mui/material';
import { lightTheme } from './components/Theme';
import { Player, Match, Round } from './model/model';
import { useRecoilState } from 'recoil';
import { navigationState } from './states/NavigationState';
import { playersState } from './states/PlayerState';
import { roundsState } from './states/RoundsState';
import { AddPlayers } from './components/AddPlayers';
import { TournamentBracket } from './components/TournamentBracket';
import { Leaderboard } from './components/Leaderboard';
const robin = require('roundrobin');

function App() {
  const [navigation, setNavigation] = useRecoilState(navigationState);
  const [players, setPlayers] = useRecoilState(playersState);
  const [rounds, setRounds] = useRecoilState(roundsState);

  console.log(players);

  const generateTournamentRounds = (players: Player[]): void => {
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
    setRounds(generatedRounds);

    const updatedPlayers = players.map((player) => {
      const playerMatches = generatedRounds.flatMap((round) => round.matches).filter((match) => match.player1.name === player.name || match.player2.name === player.name);
      return { ...player, matchIds: playerMatches.map((match) => match.id), points: 0 };
    });
    setPlayers(updatedPlayers);

  };

  const handleUpdateScore = (matchId: string, score: Match['score']) => {
    const updatedRounds = rounds.map((round) => ({
      ...round,
      matches: round.matches.map((match) => (match.id.toString() === matchId ? { ...match, score } : match)),
    }));
    setRounds(updatedRounds);
    const updatedPlayers = players.map((player) => {
      const player1Matches = updatedRounds.flatMap((round) => round.matches).filter((match) => match.player1.name === player.name);
      const player2Matches = updatedRounds.flatMap((round) => round.matches).filter((match) => match.player2.name === player.name);
      const playerPoints = player1Matches.reduce((acc, match) => {
        if (match.score === '2:0') return acc + 3;
        if (match.score === '2:1') return acc + 3;
        if (match.score === '1:2') return acc + 1;
        return acc;
      }, 0) + player2Matches.reduce((acc, match) => {
        if (match.score === '0:2') return acc + 3;
        if (match.score === '1:2') return acc + 3;
        if (match.score === '2:1') return acc + 1;
        return acc;
      }, 0);
      return { ...player, points: playerPoints };

    });
    setPlayers(updatedPlayers);
  };

  return (
    <ThemeProvider theme={lightTheme}>
      <Box display="flex" justifyContent="center" minHeight="100vh" bgcolor='#5c5451'>
        <Stack spacing={2} >
          <Typography variant='h1' textAlign='center' fontFamily='immortal' >Drafcik</Typography >
          <Box display='flex' justifyContent='center' alignItems='center' gap={3}>
            <Button sx={{ fontSize: '1.5rem' }} onClick={() => setNavigation('addPlayers')}>Gracze</Button>
            <Button sx={{ fontSize: '1.5rem' }} onClick={() => setNavigation('bracket')}>Draft</Button>
            <Button sx={{ fontSize: '1.5rem' }} onClick={() => setNavigation('leaderboard')}>Wyniki</Button>
          </Box>
          {navigation === 'addPlayers' && <AddPlayers onRoundGeneration={generateTournamentRounds} />}
          {navigation === 'bracket' && <TournamentBracket rounds={rounds} onScoreUpdate={handleUpdateScore} />}
          {navigation === 'leaderboard' && <Leaderboard />}
          {/* <Leaderboard /> */}
        </Stack>
      </Box>
    </ThemeProvider >
  );
}

export default App;