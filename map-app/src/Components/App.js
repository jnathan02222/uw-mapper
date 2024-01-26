import appStyles from "../StyleSheets/App.module.css"
import Menu from "./Menu.js"
import Canvas from "./Map.js"


function App() {
  //Save nodes and image location in cookies?
  
  return (
    <div className={appStyles.app}>
        <Menu></Menu>
        <Canvas></Canvas>
    </div>
  );
}

export default App;
