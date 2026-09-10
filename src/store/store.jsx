import { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { generateSeed, CURRENT_USER_ID } from '../data/seed.js'
import { avatarFor } from '../data/avatar.js'

const STORAGE_KEY = 'payclone.db.v3'
const SESSION_KEY = 'payclone.session.v1'

const StoreContext = createContext(null)

function loadDB() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed && Array.isArray(parsed.users) && parsed.users.length) return parsed
    }
  } catch {
    /* fall through to fresh seed */
  }
  const seed = generateSeed()
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed))
  } catch {
    /* ignore quota errors — data still lives in memory */
  }
  return seed
}

let _uid = 0
function newId(prefix) {
  _uid += 1
  return `${prefix}_${Date.now().toString(36)}_${_uid}`
}

export function StoreProvider({ children }) {
  const [db, setDB] = useState(loadDB)
  const [loggedIn, setLoggedIn] = useState(() => {
    try {
      return sessionStorage.getItem(SESSION_KEY) === '1'
    } catch {
      return false
    }
  })
  const saveTimer = useRef(null)

  // Debounced persistence.
  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(db))
      } catch {
        /* ignore */
      }
    }, 150)
    return () => saveTimer.current && clearTimeout(saveTimer.current)
  }, [db])

  const login = useCallback(() => {
    try {
      sessionStorage.setItem(SESSION_KEY, '1')
    } catch { /* ignore */ }
    setLoggedIn(true)
  }, [])

  const logout = useCallback(() => {
    try {
      sessionStorage.removeItem(SESSION_KEY)
    } catch { /* ignore */ }
    setLoggedIn(false)
  }, [])

  // ---- Selectors -----------------------------------------------------------

  const usersById = useMemo(() => {
    const m = new Map()
    for (const u of db.users) m.set(u.id, u)
    return m
  }, [db.users])

  const currentUser = usersById.get(db.currentUserId) || db.users[0]

  const getUser = useCallback((id) => usersById.get(id), [usersById])

  const searchUsers = useCallback(
    (query, limit = 8) => {
      const q = query.trim().toLowerCase()
      if (!q) return []
      const out = []
      for (const u of db.users) {
        if (u.id === db.currentUserId) continue
        if (
          u.displayName.toLowerCase().includes(q) ||
          u.handle.toLowerCase().includes(q)
        ) {
          out.push(u)
          if (out.length >= limit) break
        }
      }
      return out
    },
    [db.users, db.currentUserId]
  )

  const feedFor = useCallback(
    (scope = 'friends') => {
      // 'friends' = transactions involving the current user; 'public' = all public.
      const uid = db.currentUserId
      if (scope === 'mine') {
        return db.transactions.filter((t) => t.fromId === uid || t.toId === uid)
      }
      if (scope === 'public') {
        return db.transactions.filter((t) => t.privacy === 'public')
      }
      // friends: your own tx + public tx from everyone else
      return db.transactions.filter(
        (t) =>
          t.fromId === uid ||
          t.toId === uid ||
          t.privacy === 'public' ||
          t.privacy === 'friends'
      )
    },
    [db.transactions, db.currentUserId]
  )

  const userTransactions = useCallback(
    (userId) =>
      db.transactions.filter((t) => t.fromId === userId || t.toId === userId),
    [db.transactions]
  )

  // ---- Mutations -----------------------------------------------------------

  const createTransaction = useCallback(
    ({ fromId, toId, amount, note, privacy = 'friends', kind = 'payment' }) => {
      const tx = {
        id: newId('t'),
        fromId,
        toId,
        amount: Math.round(Number(amount) * 100) / 100,
        note: note || '',
        privacy,
        kind,
        createdAt: Date.now(),
        likes: 0,
        comments: 0,
        audience: [],
      }
      setDB((prev) => {
        const users = prev.users.map((u) => {
          if (kind === 'payment' && u.id === fromId) {
            return { ...u, balance: Math.round((u.balance - tx.amount) * 100) / 100 }
          }
          if (kind === 'payment' && u.id === toId) {
            return { ...u, balance: Math.round((u.balance + tx.amount) * 100) / 100 }
          }
          return u
        })
        return { ...prev, users, transactions: [tx, ...prev.transactions] }
      })
      return tx
    },
    []
  )

  const toggleLike = useCallback((txId) => {
    setDB((prev) => ({
      ...prev,
      transactions: prev.transactions.map((t) =>
        t.id === txId ? { ...t, likes: t._liked ? t.likes - 1 : t.likes + 1, _liked: !t._liked } : t
      ),
    }))
  }, [])

  // ---- Admin / Mock Data Manager ------------------------------------------

  const addMockUser = useCallback(
    ({ displayName, handle, balance, bio, avatar }) => {
      const id = newId('u')
      const base =
        (handle || displayName || 'user').toLowerCase().replace(/[^a-z0-9_.]/g, '') || id

      // Keep handles unique — ad-hoc recipients are named from free text, so
      // collisions with the seeded personas are easy to hit. Built here rather
      // than inside the updater so the caller gets the real record back.
      const taken = new Set(db.users.map((u) => u.handle))
      let cleanHandle = base
      for (let n = 2; taken.has(cleanHandle); n++) cleanHandle = `${base}${n}`

      const user = {
        id,
        displayName: displayName || 'New User',
        handle: cleanHandle,
        balance: Number.isFinite(Number(balance)) ? Math.round(Number(balance) * 100) / 100 : 0,
        bio: bio || '',
        avatar: avatar || avatarFor(id + cleanHandle, displayName || cleanHandle),
        joined: new Date().toISOString().slice(0, 10),
      }
      setDB((prev) => ({ ...prev, users: [...prev.users, user] }))
      return user
    },
    [db.users]
  )

  const updateMockUser = useCallback((id, patch) => {
    setDB((prev) => ({
      ...prev,
      users: prev.users.map((u) => {
        if (u.id !== id) return u
        const next = { ...u, ...patch }
        if (patch.balance !== undefined) next.balance = Math.round(Number(patch.balance) * 100) / 100
        if (patch.handle !== undefined) {
          next.handle = String(patch.handle).toLowerCase().replace(/[^a-z0-9_.]/g, '')
        }
        return next
      }),
    }))
  }, [])

  // Edits the signed-in persona. Same machinery as editing any mock user —
  // "you" are just another row in the local database.
  const updateProfile = useCallback(
    (patch) => updateMockUser(db.currentUserId, patch),
    [updateMockUser, db.currentUserId]
  )

  // True when another persona already owns this handle.
  const isHandleTaken = useCallback(
    (handle, exceptId) => {
      const h = String(handle).toLowerCase().replace(/[^a-z0-9_.]/g, '')
      if (!h) return false
      return db.users.some((u) => u.id !== exceptId && u.handle === h)
    },
    [db.users]
  )

  const deleteMockUser = useCallback(
    (id) => {
      if (id === CURRENT_USER_ID) return // never delete the demo self
      setDB((prev) => ({
        ...prev,
        users: prev.users.filter((u) => u.id !== id),
        transactions: prev.transactions.filter(
          (t) => t.fromId !== id && t.toId !== id
        ),
      }))
    },
    []
  )

  const regenerateAvatar = useCallback((id) => {
    setDB((prev) => ({
      ...prev,
      users: prev.users.map((u) =>
        u.id === id
          ? { ...u, avatar: avatarFor(id + Math.random(), u.displayName) }
          : u
      ),
    }))
  }, [])

  const resetData = useCallback(() => {
    const seed = generateSeed()
    setDB(seed)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed))
    } catch { /* ignore */ }
    return seed
  }, [])

  const clearAllData = useCallback(() => {
    const empty = {
      version: 3,
      currentUserId: CURRENT_USER_ID,
      users: db.users.filter((u) => u.id === CURRENT_USER_ID),
      transactions: [],
    }
    setDB(empty)
  }, [db.users])

  const value = useMemo(
    () => ({
      db,
      loggedIn,
      login,
      logout,
      currentUser,
      usersById,
      getUser,
      searchUsers,
      feedFor,
      userTransactions,
      createTransaction,
      toggleLike,
      updateProfile,
      isHandleTaken,
      // admin
      addMockUser,
      updateMockUser,
      deleteMockUser,
      regenerateAvatar,
      resetData,
      clearAllData,
    }),
    [
      db, loggedIn, login, logout, currentUser, usersById, getUser, searchUsers,
      feedFor, userTransactions, createTransaction, toggleLike, addMockUser,
      updateMockUser, deleteMockUser, regenerateAvatar, resetData, clearAllData,
      updateProfile, isHandleTaken,
    ]
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
