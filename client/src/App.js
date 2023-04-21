import './App.css';
import './carousel.css';
import Carousel  from './components/carousel';
import Admin from './components/admin';
import Login from './components/login';
import useToken from './useToken';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Redirect,
} from "react-router-dom";

function App() {
    const { token, setToken } = useToken();
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="/" element={<Carousel/>}/>/>
                    <Route path='/login' exact element={<Login
                        setToken={setToken}
                    />}/>
                    <Route path="/admin" element={<Admin/>}/>/>
                </Routes>
            </Router>
        </div>
    );
}

export default App;
