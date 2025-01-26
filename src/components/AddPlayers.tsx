import { useState } from 'react';
import { TextField, Button, Box, styled, Stack } from '@mui/material';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { playersState } from '../states/PlayerState';
import { Color, Player } from '../model/model';
import { ArrowDownward, ArrowUpward, Close } from '@mui/icons-material';
import { navigationState } from '../states/NavigationState';

interface CustomImageProps {
  isSelected: boolean;
}

const CustomImage = styled('img', {
  shouldForwardProp: (prop) => prop !== 'isSelected',
})<CustomImageProps>(({ isSelected }) => ({
  height: '4rem',
  borderRadius: '50%',
  transition: 'box-shadow 0.3s ease-in-out, border 0.3s ease-in-out',
  '&:hover': {
    cursor: 'pointer',
    boxShadow: '0px 0px 12px rgba(0, 0, 0, 1)',
  },
  outline: isSelected ? '4px solid #ab8b16' : 'none',
}));

const CustomTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: theme.palette.primary.main,
      border: '2px solid #ab8b16',
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.light,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const CustomButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: 'black',
  fontSize: '1rem',
  fontFamily: 'immortal',
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
  },
}));

const PlayerList = ({
  players,
  setPlayers,
}: {
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
}) => {
  const PlayerItem = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.25rem',
    borderRadius: theme.shape.borderRadius,
    border: '3px solid #ab8b16',
    boxShadow: '0px 0px 6px rgba(0, 0, 0, 1)',
  }));

  const PlayerInfo = styled('div')({
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    flex: '1',
  });

  const NameSpan = styled('span')({
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2.5rem',
    textAlign: 'center',
  });

  const ActionButton = styled(Button)(({ theme }) => ({
    minWidth: '30px',
    height: '30px',
    margin: theme.spacing(0.5),
    fontSize: '1rem',
  }));

  const handleRemovePlayer = (indexToRemove: number) => {
    setPlayers(players.filter((_, index) => index !== indexToRemove));
  };

  const movePlayer = (index: number, direction: number) => {
    const newPosition = index + direction;
    if (newPosition < 0 || newPosition >= players.length) return;
    const newPlayers = [...players];
    [newPlayers[index], newPlayers[newPosition]] = [newPlayers[newPosition], newPlayers[index]];
    setPlayers(newPlayers);
  };

  return (
    <Stack spacing={1}>
      {players.map((player, index) => (
        <PlayerItem key={index}>
          <PlayerInfo>
            <img
              loading='eager'
              src={player.portrait}
              alt='portrait'
              style={{ height: '8rem', boxShadow: '0px 0px 12px rgba(0, 0, 0, 1)' }}
            />
            <NameSpan>{player.name}</NameSpan>
            <Stack spacing={'3px'}>
              {Object.entries(player.colors).map(([color, isSelected]) =>
                isSelected ? <img key={color} src={`/colors/${color}.png`} alt={color} style={{ height: '2rem' }} /> : null
              )}
            </Stack>
          </PlayerInfo>
          <Box display='flex' flexDirection='column' alignItems='flex-end'>
            <ActionButton onClick={() => movePlayer(index, -1)}> <ArrowUpward style={{ fontSize: '1.5rem' }} /> </ActionButton>
            <ActionButton onClick={() => handleRemovePlayer(index)}> <Close style={{ fontSize: '1.5rem' }} /> </ActionButton>
            <ActionButton onClick={() => movePlayer(index, 1)}> <ArrowDownward style={{ fontSize: '1.5rem' }} /> </ActionButton>
          </Box>
        </PlayerItem>
      ))}
    </Stack>
  );
};

const defaultPlayer: Player = {
  name: '',
  colors: {
    white: false,
    blue: false,
    black: false,
    red: false,
    green: false,
  },
  matchIds: [],
  points: 0,
};

export const AddPlayers = () => {
  const [players, setPlayers] = useRecoilState(playersState);
  const [newPlayer, setNewPlayer] = useState<Player>(defaultPlayer);
  const setNavigation = useSetRecoilState(navigationState);

  function handlePlayerNameChange(value: string): void {
    setNewPlayer({ ...newPlayer, name: value });
  }

  function handlePlayerColorChange(color: Color): void {
    setNewPlayer((currentPlayer) => ({
      ...currentPlayer,
      colors: {
        ...currentPlayer.colors,
        [color]: !currentPlayer.colors[color],
      },
    }));
  }

  function addPlayer(): void {
    const newPlayerWithPortrait = {
      ...newPlayer,
      portrait: `/portraits/portrait_${Math.floor(Math.random() * 32) + 1}.png`,
    };
    setPlayers([...players, newPlayerWithPortrait]);
  }

  return (
    <Stack spacing={3}>
      <Box display='flex' justifyContent='center' alignItems='center' gap='2rem'>
        <CustomImage src='/colors/white.png' alt='white' isSelected={newPlayer.colors.white} onClick={() => handlePlayerColorChange('white')} />
        <CustomImage src='/colors/blue.png' alt='blue' isSelected={newPlayer.colors.blue} onClick={() => handlePlayerColorChange('blue')} />
        <CustomImage src='/colors/black.png' alt='black' isSelected={newPlayer.colors.black} onClick={() => handlePlayerColorChange('black')} />
        <CustomImage src='/colors/red.png' alt='red' isSelected={newPlayer.colors.red} onClick={() => handlePlayerColorChange('red')} />{' '}
        <CustomImage src='/colors/green.png' alt='green' isSelected={newPlayer.colors.green} onClick={() => handlePlayerColorChange('green')} />
      </Box>
      <CustomTextField
        label='Dodaj zawodnika'
        autoFocus
        fullWidth
        variant='outlined'
        inputProps={{ sx: { color: 'black', fontFamily: 'immortal', fontSize: '1rem' } }}
        InputLabelProps={{
          sx: { color: 'primary.main', fontFamily: 'immortal', fontSize: '1rem' },
        }}
        onChange={(e) => handlePlayerNameChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
      />
      <CustomButton type='submit' fullWidth variant='contained' onClick={() => setNavigation('bracket')}>
        Wygeneruj drafcik
      </CustomButton>
      <PlayerList players={players} setPlayers={setPlayers} />
    </Stack>
  );
};
