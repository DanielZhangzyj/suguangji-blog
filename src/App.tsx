import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import Article from './pages/Article'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/article/:id" element={<Article />} />
    </Routes>
  )
}
