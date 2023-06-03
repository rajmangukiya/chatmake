import logo from './logo.svg';
import './css/custom.css';
import Layout from './layout';
import Router from './router';
import { BrowserRouter } from 'react-router-dom';

function App() {

  // const navigate = useNavigate();

  return (
    <div className="App">
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </div>
  );
}

export default App;
