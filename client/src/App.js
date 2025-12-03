import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

import MainPage from './pages/MainPage/MainPage';

import UsersPage from './pages/UsersPage/UsersPage';

import CategoriesPage from './pages/CategoriesPage/CategoriesPage';
import CalendarPage from './pages/CalendarPage/CalendarPage';
import AccountPage from './pages/AccountPage/AccountPage';

function App() {
  return (
    <Router>
      <div style={{overflow: "hidden", maxHeight: "calc(100vh)"}}>
        <Header />
        <Routes>
          <Route path='/' element={<MainPage />} />

          <Route path='/users' element={<UsersPage />} />

          <Route path='/categories' element={<CategoriesPage />} />
          <Route path='/calendar/:id' element={<CalendarPage />} />
          <Route path='/account' element={<AccountPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
