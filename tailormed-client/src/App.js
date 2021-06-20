import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import ProgramsPage from './pages/ProgramsPage'

function App() {
    return (
        <div className="App">
            <Router>
                <Switch>
                    <Route exact path="/programs" children={<ProgramsPage />} />
                    <Redirect from="/" to="/programs" />
                </Switch>
            </Router>
        </div>
    )
}

export default App
