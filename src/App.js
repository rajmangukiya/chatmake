import logo from './logo.svg';
import './css/custom.css';
import Layout from './layout';
import Router from './router';
import { HashRouter, BrowserRouter } from 'react-router-dom';

function App() {

  // const navigate = useNavigate();

  return (
    <div className="App">
      <HashRouter>
        <Router />
      </HashRouter>
    </div>
  );
}

export default App;
