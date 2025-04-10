import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'; // 필요 시 스타일 추가
import Header from './components/Header';
import BookList from './components/BookList'; // BookList 컴포넌트
import Detail from './components/Detail'

const App: React.FC = () => {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/books" element={<BookList />} />
                <Route path="/" element={<h1>Book Store</h1>} />
                <Route path="/detail/:id" element={<Detail />} />
            </Routes>
        </Router>
    );
};

export default App;