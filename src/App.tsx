import { AddPlayers } from './components/AddPlayers';
import { TournamentBracket } from './components/TournamentBracket';
import { useRecoilValue } from 'recoil';
import { Box, Container, Typography, ThemeProvider } from '@mui/material';
import { lightTheme } from './components/Theme';
import { navigationState } from './states/NavigationState';

function App() {
  const navigation = useRecoilValue(navigationState);

  return (
    <ThemeProvider theme={lightTheme}>
      <Box display="flex" justifyContent="center" minHeight="100vh" bgcolor='#5c5451'>
        <Container maxWidth="sm">
          <Typography variant='h1' textAlign='center' fontFamily='immortal' >Drafcik</Typography >
          {navigation === 'addPlayers' && <AddPlayers />}
          {navigation === 'bracket' && <TournamentBracket />}
          {/* <Leaderboard /> */}
        </Container>
      </Box>
    </ThemeProvider >
  );
}


export default App;