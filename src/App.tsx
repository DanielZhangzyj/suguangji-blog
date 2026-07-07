import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import Article from './pages/Article'
import CustomCursor from './components/CustomCursor'

export default function App() {
  return (
    <>
      <CustomCursor />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/article/:id" element={<Article />} />
      </Routes>
    </>
  )
}
