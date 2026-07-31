// Generates the default local mock database: hundreds of fictional users,
// each with a handle, display name, avatar seed, mock balance, and a shared
// global transaction feed between them. Everything here is invented — there is
// no connection to any real person or service.

import { avatarFor } from './avatar.js'

const FIRST = [
  'Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Jamie', 'Avery',
  'Quinn', 'Parker', 'Rowan', 'Sage', 'Devon', 'Reese', 'Skyler', 'Cameron',
  'Maya', 'Liam', 'Noah', 'Emma', 'Olivia', 'Ava', 'Sophia', 'Isabella',
  'Mia', 'Amelia', 'Harper', 'Evelyn', 'Abigail', 'Ella', 'Elijah', 'Lucas',
  'Mason', 'Logan', 'Ethan', 'James', 'Aiden', 'Jackson', 'Sebastian', 'Mateo',
  'Zoe', 'Leah', 'Nora', 'Layla', 'Hazel', 'Aria', 'Ellie', 'Lily',
  'Diego', 'Priya', 'Aisha', 'Kenji', 'Fatima', 'Marco', 'Nina', 'Omar',
  'Yuki', 'Ravi', 'Sofia', 'Andre', 'Lena', 'Ibrahim', 'Chloe', 'Malik',
]

const LAST = [
  'Rivera', 'Chen', 'Patel', 'Nguyen', 'Kim', 'Johnson', 'Garcia', 'Lopez',
  'Smith', 'Brooks', 'Reed', 'Cole', 'Foster', 'Hayes', 'Bishop', 'Ellis',
  'Ward', 'Fox', 'Bennett', 'Murphy', 'Rossi', 'Silva', 'Haddad', 'Okafor',
  'Novak', 'Larsen', 'Costa', 'Yamamoto', 'Singh', 'Abbott', 'Delgado', 'Frost',
  'Marsh', 'Quinn', 'Vance', 'Wu', 'Adeyemi', 'Kaur', 'Romano', 'Park',
]

// Suffixes never end in bare punctuation — handles should read like real ones.
const HANDLE_SUFFIX = ['', '', '', '99', 'x', '_official', '23', '_nyc', '_atx', '7', '11', '_pdx', '_1', '_co']

const NOTES = [
  '🍕 Pizza night', 'Rent 🏠', 'Coffee ☕', 'Uber split 🚕', 'Concert tickets 🎟️',
  'Groceries 🛒', 'Dinner 🍝', 'Movie 🎬', 'Utilities 💡', 'Gym membership 💪',
  'Brunch 🥞', 'Gas ⛽', 'Birthday gift 🎁', 'Tacos 🌮', 'Bar tab 🍻',
  'Netflix split', 'Spotify family', 'Weekend trip ✈️', 'Ramen 🍜', 'Ice cream 🍦',
  'Lunch 🥗', 'Parking 🅿️', 'Books 📚', 'Sushi 🍣', 'Wings 🍗',
  'Vet bill 🐶', 'Plant shopping 🪴', 'Thank you! 🙏', 'You’re the best', 'IOU settled ✅',
  'Wifi bill', 'Boba 🧋', 'Farmers market', 'Game night 🎲', 'Road trip snacks',
  'Ski trip 🎿', 'Beach day 🏖️', 'Halloween costume 🎃', 'Secret santa 🎅', 'BBQ 🍖',
]

const EMOJI_ONLY = ['🍕', '🎉', '☕', '🌮', '🍻', '🎁', '🏠', '✈️', '💸', '🙏']

// Deterministic PRNG so the "default" data set is stable across resets.
function mulberry32(seed) {
  let a = seed >>> 0
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function pick(rng, arr) {
  return arr[Math.floor(rng() * arr.length)]
}

function makeHandle(first, last, n, used) {
  const base = (first + last).toLowerCase().replace(/[^a-z0-9]/g, '')
  let handle
  let tries = 0
  do {
    const suffix = tries === 0 ? HANDLE_SUFFIX[n % HANDLE_SUFFIX.length] : String(n + tries)
    handle = base + suffix
    tries++
  } while (used.has(handle) && tries < 50)
  used.add(handle)
  return handle
}

export const CURRENT_USER_ID = 'u_me'

export function generateSeed({ userCount = 240, txCount = 600 } = {}) {
  const rng = mulberry32(20260731)
  const usedHandles = new Set()

  // The signed-in demo persona.
  const me = {
    id: CURRENT_USER_ID,
    displayName: 'Demo User',
    handle: 'demo_user',
    avatar: avatarFor('u_me', 'Demo User'),
    balance: 214.72,
    bio: 'Just here testing the UI 🧪',
    joined: '2021-03-14',
    email: '',
    phone: '',
    defaultPrivacy: 'friends',
    isDemoSelf: true,
  }

  const users = [me]
  for (let i = 0; i < userCount; i++) {
    const first = pick(rng, FIRST)
    const last = pick(rng, LAST)
    const displayName = `${first} ${last}`
    const handle = makeHandle(first, last, i, usedHandles)
    users.push({
      id: 'u_' + i,
      displayName,
      handle,
      avatar: avatarFor('u_' + i + handle, displayName),
      balance: Math.round(rng() * 1800 * 100) / 100,
      bio: rng() > 0.6 ? pick(rng, ['📍 NYC', '☀️ LA', '🌆 Chicago', '🎓 student', '🏃 runner', '🎨 artist', '🐕 dog parent', '☕ coffee addict']) : '',
      joined: `20${18 + Math.floor(rng() * 7)}-0${1 + Math.floor(rng() * 8)}-1${Math.floor(rng() * 9)}`,
    })
  }

  // Build a global feed of transactions between random pairs of users.
  const transactions = []
  const now = Date.now()
  for (let i = 0; i < txCount; i++) {
    let a = Math.floor(rng() * users.length)
    let b = Math.floor(rng() * users.length)
    while (b === a) b = Math.floor(rng() * users.length)

    const amount = Math.round((rng() * 120 + 3) * 100) / 100
    const note = rng() > 0.08 ? pick(rng, NOTES) : pick(rng, EMOJI_ONLY)
    // Weighted privacy: mostly public in the feed, some friends-only/private.
    const rp = rng()
    const privacy = rp > 0.85 ? 'private' : rp > 0.65 ? 'friends' : 'public'
    const kind = rng() > 0.78 ? 'charge' : 'payment' // charge = requested
    // Spread timestamps across the last ~120 days.
    const ts = now - Math.floor(rng() * 120 * 24 * 60 * 60 * 1000)

    const likes = Math.floor(rng() * rng() * 14)
    const comments = Math.floor(rng() * rng() * 6)

    transactions.push({
      id: 't_' + i,
      fromId: users[a].id,
      toId: users[b].id,
      amount,
      note,
      privacy,
      kind,
      createdAt: ts,
      likes,
      comments,
      audience: [], // reserved for future per-tx audience overrides
    })
  }

  transactions.sort((x, y) => y.createdAt - x.createdAt)

  return {
    version: 3,
    currentUserId: CURRENT_USER_ID,
    users,
    transactions,
  }
}
