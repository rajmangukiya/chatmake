import logo from './logo.svg';
import './css/custom.css';
import Home from './page/Home';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import Chat from './page/Chat';
import Error from './page/Error';
import DashBoard from './page/DashBoard';

function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/dashboard" component={DashBoard} />
          <Route exact path="/chat" component={Chat} />
          <Route exact path="/error" component={Error} />
          <Redirect from="**" to="/error" />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
