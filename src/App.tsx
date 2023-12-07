import {Routes, Route} from "react-router-dom"
import { NewGame } from "./components/NewGame"
import { IconMode } from "./components/IconMode"
import { NumberMode } from "./components/NumberMode"
function App() {
  
  return (
    <>
        <Routes>
          <Route path="/" element={<NewGame />} />
          <Route path={`/game/icons/:playerNumber/:boardSize`} element={<IconMode />} />
          <Route path={`/game/numbers/:playerNumber/:boardSize`} element={<NumberMode />} />
        </Routes>
    </>
  )
}

export default App
