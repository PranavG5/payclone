import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './components/AppLayout.jsx'
import Home from './pages/Home.jsx'
import Search from './pages/Search.jsx'
import Profile from './pages/Profile.jsx'
import Pay from './pages/Pay.jsx'
import Settings from './pages/Settings.jsx'
import Placeholder from './pages/Placeholder.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/u/:id" element={<Profile />} />
        <Route path="/pay" element={<Pay />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/cards" element={<Placeholder kind="cards" />} />
        <Route path="/crypto" element={<Placeholder kind="crypto" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
