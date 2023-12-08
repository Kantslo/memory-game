import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { Link, useParams } from "react-router-dom";
import { v4 as uuid } from "uuid";

interface NumberType {
  id: string;
  digit: number;
  matched: boolean;
  shown: boolean;
}

interface Player {
  number: number;
  points: number;
  currentTurn: boolean;
}

export const NumberMode = () => {

  ///// ცვლადები /////

  const [digits, setDigits] = useState<NumberType[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [choiceOne, setChoiceOne] = useState<NumberType | null>(null);
  const [choiceTwo, setChoiceTwo] = useState<NumberType | null>(null);
  const [seconds, setSeconds] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [gameResult, setGameResult] = useState<{
    time: { minutes: number; seconds: number };
    moves: number;
  } | null>(null);
  const { playerNumber } = useParams()
  const { boardSize } = useParams()
  const [players, setPlayers] = useState<Player[]>([
    { number: 1, points: 0, currentTurn: true },
    { number: 2, points: 0, currentTurn: false },
    { number: 3, points: 0, currentTurn: false },
    { number: 4, points: 0, currentTurn: false },
  ])
  const [test, setTest] = useState<number>(8)
  const [playerIndex, setPlayerIndex] = useState<number>(0)
  const [allMatched, setAllMatched] = useState<boolean>(false)
  const [openStats, setOpenStats] = useState<boolean>(false)

  ///// რიცხვითი რეჟიმი => ფუნცქიონალი /////

  const initializePlayers = (numberOfPlayers: number) => {
    return Array.from({ length: numberOfPlayers }, (_, index) => ({
      number: index + 1,
      points: 0,
      currentTurn: index === 0,
    }));
  };

  useEffect(() => {
    setPlayers(initializePlayers(Number(playerNumber)));
  }, [playerNumber]);

  useEffect(() => {
    if (Number(boardSize) === 6) {
      setTest(18)
    } else if (Number(boardSize) === 4) {
      setTest(8)
    }
  }, [])

  const handleMenuClick = () => {
    setMenuOpen(!menuOpen);
  };

  const generateRandomNumbers = () => {
    const allNumbers = Array.from({ length: 100 }, (_, index) => index);

    const selectedNumbers = allNumbers.slice(0, test).flatMap((digit) => [
      digit,
      digit,
    ]);

    const numbersWithIds = selectedNumbers.map((digit) => ({
      id: uuid(),
      digit,
      matched: false,
      shown: false,
    }));

    const shuffledNumbers = numbersWithIds.sort(() => Math.random() - 0.5);

    setTimerRunning(true)
    setDigits(shuffledNumbers);
  };

  useEffect(() => {
    generateRandomNumbers();
    setMoves(0);
  }, [test]);

  const updatePoints = (numbersMatch: boolean) => {
    setPlayers((prevPlayers) => {
      const updatedPlayers = [...prevPlayers];
  
      if (numbersMatch) {
        updatedPlayers[playerIndex] = {
          ...updatedPlayers[playerIndex],
          points: updatedPlayers[playerIndex].points + 1,
        };
      } else {
        const nextPlayerIndex = (playerIndex + 1) % players.length;
        updatedPlayers[nextPlayerIndex] = {
          ...updatedPlayers[nextPlayerIndex],
          currentTurn: true,
        };
        updatedPlayers[playerIndex] = {
          ...updatedPlayers[playerIndex],
          currentTurn: false,
        };
        setPlayerIndex(nextPlayerIndex);
      }
  
      return updatedPlayers;
    });
  };

  const handleClick = (digit: NumberType) => {
    if (digit.shown || digit.matched || (choiceOne && choiceOne.id === digit.id)) {
      return;
    } else {
      if (choiceOne && choiceTwo) {
        return;
      } else {
        if (!choiceOne) {
          setChoiceOne(digit);
        } else {
          setChoiceTwo(digit);
  
          if (choiceOne.digit === digit.digit) {
            setDigits((prevNums) => {
              const updatedNums = prevNums.map((prevNum) =>
                prevNum.digit === choiceOne.digit
                  ? { ...prevNum, matched: true, shown: true }
                  : prevNum
              );
              return updatedNums;
            });
            resetTurn();
            updatePoints(true)
          } else {
            setTimeout(() => {
              setDigits((prevNums) => {
                const updatedNums = prevNums.map((prevNum) =>
                  prevNum.id === choiceOne.id || prevNum.id === digit.id
                    ? { ...prevNum, shown: false }
                    : prevNum
                );
                return updatedNums;
              });
              resetTurn();
            }, 500);
            updatePoints(false)
          }
        }
      }
    }
  };

  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setMoves((prevTurns) => prevTurns + 1);
  };

  useEffect(() => {
    if (choiceOne && !choiceTwo) {
      setDigits((prevNums) =>
        prevNums.map((digit) =>
          digit.id === choiceOne.id ? { ...digit, shown: true } : digit
        )
      );
    }
    if (choiceTwo) {
      setDigits((prevNums) =>
        prevNums.map((digit) =>
          digit.id === choiceTwo.id ? { ...digit, shown: true } : digit
        )
      );
    }
  }, [choiceOne, choiceTwo]);

  ///// ტაიმერი /////

  useEffect(() => {
    if (timerRunning) {
      const interval = setInterval(() => {
        setSeconds((prevSeconds) => (prevSeconds + 1) % 60);
  
        if (seconds === 59) {
          setMinutes((prevMinutes) => (prevMinutes + 1) % 60);
        }
  
        const allMatched = digits.every((digit) => digit.matched);
        setAllMatched(allMatched);
        setOpenStats(true)
        if (allMatched) {
          setTimerRunning(false);
          clearInterval(interval);
          const gameTime = { minutes, seconds };
          const gameMoves = moves;
          setGameResult({ time: gameTime, moves: gameMoves });
        }
      }, 1000);
  
      return () => clearInterval(interval);
    }
  }, [timerRunning, seconds]);
  
  const timer = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  function isTied(player: Player) {
    const sortedPlayers = [...players].sort((a, b) => b.points - a.points);
    return sortedPlayers[0].points === player.points;
  }
  
  function getWinnerMessage() {
    const tiedPlayers = players.filter((player) => isTied(player));
    if (tiedPlayers.length === players.length) {
      return "It's a Tie!";
    } else if (tiedPlayers.length === 1) {
      return `Player ${tiedPlayers[0].number} Wins!`;
    } else {
      return "It's a Tie!";
    }
  }
  
  const sortedPlayers = [...players].sort((a, b) => b.points - a.points);

  return (
    <>
      <div className="mx-6 my-6 md:mx-10 md:my-10 x:mt-16 x:mx-40 font-atkinson">
        {menuOpen && <div className="z-10 dim-overlay"></div>}
        {menuOpen && (
          <div className="flex flex-col items-center justify-center gap-y-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[rgb(242,242,242)] rounded-lg p-6 z-10">
            <button
              onClick={() => {
                setGameResult(null);
                generateRandomNumbers();
                setMenuOpen(false);
                setSeconds(0);
                setMinutes(0);
                setPlayerIndex(0);
                setPlayers(initializePlayers(Number(playerNumber)));
              }}
              className="w-[279px] h-12 font-atkinson text-[#FCFCFC] font-bold text-[18px] bg-[#FDA214] rounded-3xl"
            >
              Restart
            </button>
            <Link to="/">
              <button className="w-[279px] h-12 font-atkinson text-[#304859] font-bold text-[18px] bg-[#DFE7EC] rounded-3xl">
                New Game
              </button>
            </Link>
            <button
              onClick={() => {
                setMenuOpen(false);
              }}
              className="w-[279px] h-12 font-atkinson text-[#304859] font-bold text-[18px] bg-[#DFE7EC] rounded-3xl"
            >
              Resume Game
            </button>
          </div>
        )}
        <header className="flex items-center justify-between">
          <Logo />
          <div className="items-center hidden gap-4 md:flex">
            <button onClick={() => {
              setGameResult(null);
              generateRandomNumbers();
              setMenuOpen(false);
              setSeconds(0);
              setMinutes(0);
              setPlayerIndex(0);
              setPlayers(initializePlayers(Number(playerNumber)));
            }} className="px-7 py-[13px] text-[#FCFCFC] text-[20px] font-bold bg-[#FDA214] rounded-[26px] hover:bg-[#FFB84A]">Restart</button>
            <Link to="/">
              <button className="px-7 py-[13px] text-[#304859] text-[20px] font-bold bg-[#DFE7EC] rounded-[26px] hover:bg-[#6395B8]">New Game</button>
            </Link>
          </div>
          <div className="md:hidden">
            <button 
            onClick={() => {handleMenuClick()}} className="px-[18px] py-[10px] text-[#FCFCFC] text-[16px] font-bold bg-[#FDA214] rounded-3xl">Menu</button>
          </div>
        </header>
        <main className="mt-20">
          <div style={{gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))`}} className="grid place-items-center gap-[9px] md:gap-4 mx-auto w-[327px] md:w-[532px] h-[327px] md:h-[532px]">
            {digits.map((digit, index) => (
              <div
                onClick={() => {
                  handleClick(digit);
                }}
                key={index}
                className={`relative flex items-center justify-center bg-[#152938] p-4 rounded-full text-[#FCFCFC] w-[46px] h-[46px] ${
                  digit.shown ? "bg-[#BCCED9]" : ""
                } ${digit.matched ? "bg-[#FDA214]" : ""} ${test === 8 && 'w-[82px]'} ${test === 8 && 'h-[82px]'} ${test === 8 ? 'md:w-[118px]' : 'md:w-[82px]'} ${test === 8 ? 'md:h-[118px]' : 'md:h-[82px]'}`}
              >
                <span className="text-white text-[24px] font-bold">{digit.digit}</span>
                <span className={`block cursor-pointer absolute top-0 left-0 w-[46px] h-[46px] rounded-full bg-[#152938] ${digit.shown ? 'hidden' : ''} ${test === 8 && 'w-[82px]'} ${test === 8 && 'h-[82px]'} hover:bg-[#6395B8] ${test === 8 && 'h-[82px]'} ${test === 8 ? 'md:w-[118px]' : 'md:w-[82px]'} ${test === 8 ? 'md:h-[118px]' : 'md:h-[82px]'}`}></span>
              </div>
            ))}
          </div>
        </main>
        <section className="font-atkinson mt-[100px] relative">
          {Number(playerNumber) > 1 && (
            <div className="flex items-center justify-center gap-6 pb-20">
              {players.map((player) => (
                <div key={player.number} className="relative">
                  <div className={`w-16 h-[70px] md:w-[164px] x:w-[255px] x:h-[91px] md:h-[92px] flex flex-col px-4 items-center md:items-start justify-evenly rounded-lg ${player.currentTurn ? 'bg-[#FDA214]' : 'bg-[#DFE7EC]'}`}>
                    <p className={`text-[#7191A5] font-bold text-[15px] ${player.currentTurn ? 'text-[#FCFCFC]' : ''} flex items-center gap-1`}><span className="md:hidden">P</span><span className="hidden md:block">Player</span>{player.number}</p>
                    <p className={`text-[#304859] font-bold text-[24px] ${player.currentTurn ? 'text-[#FCFCFC]' : ''}`}>
                      {player.points}
                    </p>
                  </div>
                  <p className={`text-[#152938] text-[13px] font-bold ${player.currentTurn ? '' : 'hidden'} absolute top-[125%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 tracking-[5px] w-[250px] text-center`}>CURRENT TURN</p>
                  <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full w-4 h-4 md:w-6 md:h-6 md:mt-3 bg-[#FDA214] rotate-45 mt-2 ${player.currentTurn ? '' : 'hidden'}`}></div>
                </div>
              ))}
            </div>
          )}
          </section>
        {Number(playerNumber) === 1 ? (
          <section className="flex items-center justify-center gap-[25px] mt-[100px]">
            <div className="flex flex-col md:flex-row items-center justify-center md:justify-between px-4 w-[151px] md:w-[225px] h-[72px] rounded-md bg-[#DFE7EC]">
              <p className="text-[15px] font-bold text-[#7191A5] md:text-[18px]">Time</p>
              <span className="text-[#304859] text-6 font-bold md:text-[32px]">{timer}</span>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-center md:justify-between px-4 w-[151px] md:w-[225px] h-[72px] rounded-md bg-[#DFE7EC]">
              <p className="text-[15px] font-bold text-[#7191A5] md:text-[18px]">Moves</p>
              <span className="text-[#304859] text-6 font-bold md:text-[32px]">{moves}</span>
            </div>
          </section>
        ) : null}
        {Number(playerNumber) === 1 && gameResult && (<div className="z-10 dim-overlay"></div>)}
        {Number(playerNumber) === 1 && gameResult && (
        <div className="flex flex-col items-center justify-center font-atkinson absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#F2F2F2] w-[327px] md:w-[654px] h-[376px] md:h-[510px] rounded-lg md:rounded-3xl px-6 md:px-14 z-10">
          <h1 className="text-[24px] text-[#152938] font-bold mt-4 md:text-[48px]">You did it!</h1>
          <p className="text-[#7191A5] text-[14px] font-bold mt-[9px] md:text-[18px]">Game over! Here’s how you got on…</p>
            <div className="flex items-center justify-between rounded-lg w-full px-4 bg-[#DFE7EC] h-12 md:h-[72px] mt-6">
              <p className="text-[13px] text-[#7191A5] font-bold md:text-[18px]">Time Elapsed</p>
              <p className="text-[#304859] text-[20px] font-bold md:text-[32px]">{gameResult.time.minutes.toString().padStart(2, '0')}:{gameResult.time.seconds.toString().padStart(2, '0')}</p>
            </div>
            <div className="flex items-center justify-between rounded-lg w-full px-4 bg-[#DFE7EC] h-12 md:h-[72px] mt-2 md:mt-4">
              <p className="text-[13px] text-[#7191A5] font-bold md:text-[18px]">Moves Taken</p>
              <p className="text-[#304859] text-[20px] font-bold md:text-[32px]">{gameResult.moves} Moves</p>
            </div>
            <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:gap-[14px] md:mt-10">
              <button
                onClick={() => {
                  setGameResult(null);
                  generateRandomNumbers();
                  setMenuOpen(false);
                  setSeconds(0);
                  setMinutes(0);
                  setPlayerIndex(0);
                  setPlayers(initializePlayers(Number(playerNumber)));
                }}
                className="w-[279px] md:w-[264px] h-12 md:h-[52px] font-atkinson text-[#FCFCFC] font-bold text-[18px] bg-[#FDA214] rounded-3xl mt-6"
                >
                  Restart
              </button>
              <Link to={"/"}>
              <button
                className="w-[279px] md:w-[264px] h-12 md:h-[52px] font-atkinson text-[#304859] font-bold text-[18px] bg-[#DFE7EC] rounded-3xl mt-4"
              >
                Setup New Game
              </button>
              </Link>
            </div>
          </div>
        )}
        {Number(playerNumber) > 1 && allMatched && openStats &&  (
          <div className="z-10 dim-overlay"></div>
        )}
        {Number(playerNumber) > 1 && allMatched && openStats ? (
            <div className="flex flex-col items-center justify-center font-atkinson absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#F2F2F2] w-[327px] md:w-[654px] h-auto rounded-lg px-6 z-10 pt-8 pb-6 md:px-14 md:pb-16">
              <h1 className="text-[24px] text-[#152938] font-bold md:text-[48px]">{getWinnerMessage()}</h1>
              <p className="text-[#7191A5] text-[14px] font-bold mt-[9px] md:text-[18px]">Game over! Here are the results…</p>
                  <div className="flex flex-col items-center justify-center w-full gap-2 mt-6 md:gap-4">
                  {sortedPlayers.map((player) => (
                      <div
                      key={player.number}
                      className={`w-[100%] h-12 flex items-center justify-between rounded-lg px-4 ${
                        isTied(player) ? 'bg-[#152938]' : 'bg-[#DFE7EC]'
                      } md:h-[72px]`}
                      >
                      <div className="flex items-center gap-1">
                        <p
                          className={`text-[13px] text-[#7191A5] font-bold ${
                            isTied(player) ? 'text-[#FCFCFC]' : ''
                          } md:h-[72px] flex items-center md:text-[18px]`}
                        >
                          Player {player.number}
                        </p>
                        {isTied(player) && (
                        <p className="text-[13px] font-bold text-[#FCFCFC] md:text-[18px]">(Winner!)</p>
                      )}
                      </div>
                        <p
                          className={`text-[20px] font-bold ${
                            isTied(player) ? 'text-[#FCFCFC]' : 'text-[#304859]'
                          } md:h-[72px] flex items-center md:text-[32px]`}
                          >
                          {player.points} Pairs!
                        </p>
                    </div>
                  ))}
                </div>
              <div>
                <div className="flex flex-col items-center justify-center md:flex-row gap-4 md:gap-[14px] mt-6 md:mt-14">
                  <button
                      onClick={() => {
                        setOpenStats(false);
                        setGameResult(null);
                        generateRandomNumbers();
                        setMenuOpen(false);
                        setPlayerIndex(0);
                        setPlayers(initializePlayers(Number(playerNumber)));
                      }}
                      className="w-[279px] md:w-[264px] h-12 font-atkinson text-[#FCFCFC] font-bold text-[18px] bg-[#FDA214] rounded-3xl md:h-[52px]"
                    >
                      Restart
                  </button>
                  <Link to={"/"}>
                    <button
                      className="w-[279px] md:w-[264px] h-12 font-atkinson text-[#304859] font-bold text-[18px] bg-[#DFE7EC] rounded-3xl md:h-[52px]"
                    >
                      Setup New Game
                    </button>
                  </Link>
                </div>
              </div>
            </div>
           ) : null}
      </div>
    </>
  );
};
