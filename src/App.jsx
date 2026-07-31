import { Routes, Route, Navigate } from 'react-router-dom'
import { useStore } from './store/store.jsx'
import AppLayout from './components/AppLayout.jsx'
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import Search from './pages/Search.jsx'
import Profile from './pages/Profile.jsx'
import Pay from './pages/Pay.jsx'
import Settings from './pages/Settings.jsx'

export default function App() {
  const { loggedIn } = useStore()

  if (!loggedIn) {
    return (
      <Routes>
        <Route path="*" element={<Login />} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/u/:id" element={<Profile />} />
        <Route path="/pay" element={<Pay />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
