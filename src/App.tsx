import React from 'react';
import {Provider as ReduxProvider} from 'react-redux';
import './App.css';
import useLocalStorage from "./hooks/useLocalStorage";
import Bad from "./pages/Bad";
import Good from "./pages/Good";
import Home from "./pages/Home";
import Insert from "./pages/Insert";
import Navigation from "./pages/Navigation";
import Play from "./pages/Play";

const STORAGE_KEY = 'RATE_CODE';
const STORAGE_DATA = {
  currentPage: 'insert',
}

// @ts-ignore
import configureStore from './redux/configureStore';

const store = configureStore();

const App = () => {
  const [storedValue, setValue] = useLocalStorage(STORAGE_KEY, STORAGE_DATA)

  // @ts-ignore
  const {currentPage} = storedValue;
  console.log(storedValue);

  return (
      <>
        <ReduxProvider store={store}>
          <div className="ct" id="home">
            <div className="ct" id="play">
              <div className="ct" id="insert">
                <div className="ct" id="good">
                  <div className="ct" id="bad">
                    <Navigation/>
                    <Home/>
                    <Play/>
                    <Insert/>
                    <Good/>
                    <Bad/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ReduxProvider>
      </>
  );
};

export default App;
