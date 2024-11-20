/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  FlatList,
  TouchableOpacity
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';


type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({ children, title }: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

const mockData = [{ author: "Lauren Forristal", title: "Bye-bye bots: Altera's game-playing AI agents get backing from Eric Schmidt | TechCrunch", description: "Autonomous, AI-based players are coming to a gaming experience near you, and a new startup, Altera, is joining the fray to build this new guard of AI Research company Altera raised $9 million to build AI agents that can play video games alongside other player…" }]

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [articles, setArticles] = useState(mockData);
  const [selectedPiece, setSelectedPiece] = useState<{ row: number; col: number } | null>(null);
  const [validMoves, setValidMoves] = useState<{ row: number; col: number }[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<'white' | 'black'>('white');

  const [whiteTime, setWhiteTime] = useState(3600); 
  const [blackTime, setBlackTime] = useState(3600); 
  const [chessPieces, setChessPieces] = useState([
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
  ])
  const [isWhiteButtonActive, setIsWhiteButtonActive] = useState(true);
  const [isBlackButtonActive, setIsBlackButtonActive] = useState(false);
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (currentPlayer === 'white') {
        setWhiteTime((prev) => (prev > 0 ? prev - 1 : 0));
      } else {
        setBlackTime((prev) => (prev > 0 ? prev - 1 : 0));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentPlayer]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSquarePress = (row: number, col: number) => {
    const piece = chessPieces[row][col];

    if (selectedPiece && validMoves.some((move) => move.row === row && move.col === col)) {
      const newBoard = chessPieces.map((rowArr, rowIndex) =>
        rowArr.map((colVal, colIndex) => {
          if (rowIndex === row && colIndex === col) return chessPieces[selectedPiece.row][selectedPiece.col];
          if (rowIndex === selectedPiece.row && colIndex === selectedPiece.col) return '';
          return colVal;
        })
      );
      setChessPieces(newBoard);
      setSelectedPiece(null);
      setValidMoves([]);
      setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
      setIsWhiteButtonActive(!isWhiteButtonActive);
      setIsBlackButtonActive(!isBlackButtonActive);
    } else if (
      (currentPlayer === 'white' && piece === 'P') ||
      (currentPlayer === 'black' && piece === 'p')
    ) {
      setSelectedPiece({ row, col });
      calculateValidMoves(piece, row, col);
    } else {
      setSelectedPiece(null);
      setValidMoves([]);
    }
  };


  const calculateValidMoves = (piece: string, row: number, col: number) => {
    const moves: { row: number; col: number }[] = [];
    const direction = piece === 'P' ? -1 : 1; // White moves up (-1), Black moves down (+1)
  
    // Forward Move (1 square)
    if (chessPieces[row + direction]?.[col] === '') {
      moves.push({ row: row + direction, col });
    }
  
    // First Move (2 squares)
    if (
      (piece === 'P' && row === 6) || (piece === 'p' && row === 1) // Pawns start from row 6 (white) or row 1 (black)
    ) {
      if (chessPieces[row + direction * 2]?.[col] === '') {
        moves.push({ row: row + direction * 2, col });
      }
    }
  
    // Capture Move (diagonal left and right)
    if (
      chessPieces[row + direction]?.[col - 1] &&
      chessPieces[row + direction]?.[col - 1].toLowerCase() !== piece.toLowerCase() && // Check for opponent's piece
      col - 1 >= 0
    ) {
      moves.push({ row: row + direction, col: col - 1 });
    }
    
    if (
      chessPieces[row + direction]?.[col + 1] &&
      chessPieces[row + direction]?.[col + 1].toLowerCase() !== piece.toLowerCase() && // Check for opponent's piece
      col + 1 < 8
    ) {
      moves.push({ row: row + direction, col: col + 1 });
    }
  
    setValidMoves(moves);
  };

  const handlePlayerSwitch = (player: 'white' | 'black') => {
    if (player === 'white' && currentPlayer === 'black') {
      setCurrentPlayer('white');
      setIsWhiteButtonActive(true);
      setIsBlackButtonActive(false);
    } else if (player === 'black' && currentPlayer === 'white') {
      setCurrentPlayer('black');
      setIsWhiteButtonActive(false);
      setIsBlackButtonActive(true);
    }
  };



  const RenderItem = ({ item, index, colIndex }: any) => {
    const isHighlighted = validMoves.some((move) => move.row === index && move.col === colIndex);
    if (!Array.isArray(item)) {
      return (<TouchableOpacity
        style={[
          styles.square,
          (index + colIndex) % 2 === 0 ? styles.lightSquare : styles.darkSquare, isHighlighted && styles.highlightedSquare
        ]}
        onPress={() => handleSquarePress(index,colIndex)}
      >
        <Text style={[(index + colIndex) % 2 !== 0 ? styles.lightPiece : styles.darkPiece]}>{item}</Text>
      </TouchableOpacity>)
    }
    else {
      return (<View style={styles.row}>
        {item.map((square, colIndex) => <RenderItem key={colIndex} item={square} index={index} colIndex={colIndex} />)}
      </View>)
    }
  }
  const handlePlayerAction = () => {

  }
  return (
    <SafeAreaView style={[backgroundStyle, styles.container]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={styles.playerContainer}>

          <Text style={styles.buttonText}>Black Player</Text>

        <Text style={styles.timer}>{formatTime(blackTime)}</Text>
      </View>
      <View style={styles.boardContainer}>
        <FlatList data={chessPieces} renderItem={({ item, index }: any) => <RenderItem index={index} item={item} keyExtractor={(_, index) => index.toString()}
          scrollEnabled={false} />} />
      </View>
      <View style={styles.playerContainer}>

          <Text style={styles.buttonText}>WhitePlayer</Text>
        <Text style={styles.timer}>{formatTime(whiteTime)}</Text>
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  board: {
    width: '100%',
    aspectRatio: 1,
    flexDirection: 'column',
  },
  boardContainer: {
    width: '90%',
    borderWidth: 2
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  square: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lightSquare: {
    backgroundColor: '#EEE',
  },
  darkSquare: {
    backgroundColor: '#444',
  },
  lightPiece: {
    fontSize: 24,
    color: '#fff',
  },
  darkPiece: {
    fontSize: 24,
    color: '#000',
  },
  playerContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 50,
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  playerButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    width: '40%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  highlightedSquare: {
    backgroundColor: '#76ff03',
  },
  timer: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default App;
