import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AdoptionDetailsPage } from './pages/AdoptionDetailsPage'
import { HomePage } from './pages/HomePage'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/adopcion/:petId" element={<AdoptionDetailsPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
