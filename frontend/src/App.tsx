import { useMemo, useState, type FormEvent, type SVGProps } from 'react'
import './App.css'

type Room = {
  code: string
  name: string
  players: number
  language: string
}

const STARTING_ROOMS: Room[] = [
  { code: 'QRRV', name: 'Masala Night', players: 22, language: 'English' },
  { code: 'CHAI', name: "Ananya's room", players: 8, language: 'Hindi' },
  { code: 'BLLY', name: 'Bollywood Bits', players: 14, language: 'English' },
  { code: 'SPCE', name: 'Saturday Spice', players: 6, language: 'Hindi' },
  { code: 'POPS', name: "Rohan's room", players: 11, language: 'English' },
  { code: 'TAST', name: 'Pop till you drop', players: 4, language: 'English' },
  { code: 'MNGL', name: "Guest4401's room", players: 2, language: 'Hindi' },
  { code: 'KRNL', name: 'Desi Trivia Hour', players: 9, language: 'English' },
  { code: 'WALA', name: 'Chaat & Chat', players: 7, language: 'Hindi' },
]

const LETTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
const PRIVATE_ROOM_COUNT = 37

function randomCode() {
  return Array.from(
    { length: 4 },
    () => LETTERS[Math.floor(Math.random() * LETTERS.length)],
  ).join('')
}

function App() {
  const [guestName] = useState(
    () => `Guest${Math.floor(1000 + Math.random() * 9000)}`,
  )
  const [roomName, setRoomName] = useState(`${guestName}'s room`)
  const [isPublic, setIsPublic] = useState(true)
  const [joinCode, setJoinCode] = useState('')
  const [filter, setFilter] = useState('')
  const [rooms, setRooms] = useState<Room[]>(STARTING_ROOMS)
  const [notice, setNotice] = useState('')
  const [hotCode, setHotCode] = useState('')
  const [refreshing, setRefreshing] = useState(false)

  const visibleRooms = useMemo(() => {
    const q = filter.trim().toLowerCase()
    if (!q) return rooms
    return rooms.filter(
      (room) =>
        room.name.toLowerCase().includes(q) ||
        room.code.toLowerCase().includes(q) ||
        room.language.toLowerCase().includes(q),
    )
  }, [filter, rooms])

  const playerCount = rooms.reduce((sum, room) => sum + room.players, 0)

  function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const name = roomName.trim() || `${guestName}'s room`
    const code = randomCode()

    if (isPublic) {
      setRooms((prev) => [
        { code, name, players: 1, language: 'English' },
        ...prev,
      ])
    }

    setHotCode(code)
    setNotice(
      isPublic
        ? `Opened public room ${code}.`
        : `Opened private room ${code}. Share that code with friends.`,
    )
  }

  function handleJoin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const code = joinCode.trim().toUpperCase()
    if (code.length < 4) {
      setNotice('Enter a 4-letter room code.')
      return
    }

    const match = rooms.find((room) => room.code === code)
    setHotCode(code)
    setNotice(
      match
        ? `Joining ${match.name} (${match.code}).`
        : `No public room found for ${code}.`,
    )
  }

  function joinRoom(room: Room) {
    setHotCode(room.code)
    setJoinCode(room.code)
    setNotice(`Joining ${room.name} (${room.code}).`)
  }

  function handleRefresh() {
    setRefreshing(true)
    setRooms((prev) =>
      prev.map((room) => ({
        ...room,
        players: Math.max(1, room.players + Math.floor(Math.random() * 5) - 2),
      })),
    )
    window.setTimeout(() => setRefreshing(false), 450)
  }

  return (
    <div className="lobby">
      <header className="topbar">
        <a className="brand" href="/">
          <SodaIcon className="brand-mark" />
          <span className="brand-name">Desi Pop Sauce</span>
        </a>
        <span className="guest-chip">
          <TicketIcon />
          {guestName}
        </span>
      </header>

      <div className="banner" aria-hidden="true">
        <div className="flags">
          {Array.from({ length: 20 }, (_, i) => (
            <span key={i} className={`flag tone-${i % 5}`} />
          ))}
        </div>
        <div className="hill hill-a" />
        <div className="hill hill-b" />
        <div className="hill hill-c" />
      </div>

      <main className="page">
        {notice ? <p className="notice">{notice}</p> : null}

        <section className="actions">
          <form className="panel" onSubmit={handleCreate}>
            <h2 className="panel-title">Start a new room</h2>
            <div className="game-picks">
              <div className="game-pick is-selected">
                <SodaIcon />
                PopSauce
              </div>
            </div>
            <div className="create-row">
              <input
                className="room-name"
                value={roomName}
                onChange={(event) => setRoomName(event.target.value)}
                aria-label="Room name"
              />
              <div className="privacy" role="group" aria-label="Room privacy">
                <button
                  type="button"
                  className={`privacy-btn public${isPublic ? ' is-on' : ''}`}
                  aria-pressed={isPublic}
                  onClick={() => setIsPublic(true)}
                >
                  <GlobeIcon />
                  Public
                </button>
                <button
                  type="button"
                  className={`privacy-btn private${!isPublic ? ' is-on' : ''}`}
                  aria-pressed={!isPublic}
                  onClick={() => setIsPublic(false)}
                >
                  <LockIcon />
                  Private
                </button>
              </div>
              <button className="btn-play" type="submit">
                Play
              </button>
            </div>
          </form>

          <div>
            <form className="panel" onSubmit={handleJoin}>
              <h2 className="panel-title">Join a private room</h2>
              <div className="join-row">
                <label htmlFor="room-code">Code:</label>
                <input
                  id="room-code"
                  className="code-input"
                  value={joinCode}
                  maxLength={4}
                  spellCheck={false}
                  autoComplete="off"
                  onChange={(event) =>
                    setJoinCode(
                      event.target.value
                        .toUpperCase()
                        .replace(/[^A-Z]/g, '')
                        .slice(0, 4),
                    )
                  }
                />
                <button className="btn-join" type="submit">
                  Join
                </button>
              </div>
            </form>
            <nav className="side-links" aria-label="Help">
              <a href="#how-to-play">How to play</a>
              <a href="#faq">Frequently Asked Questions</a>
            </nav>
          </div>
        </section>

        <div className="rooms-toolbar">
          <p className="rooms-stats">
            Play with {playerCount} players in {rooms.length} public rooms and{' '}
            {PRIVATE_ROOM_COUNT} private rooms.
          </p>
          <div className="rooms-tools">
            <input
              className="filter-input"
              value={filter}
              placeholder="Filter..."
              aria-label="Filter rooms"
              onChange={(event) => setFilter(event.target.value)}
            />
            <button
              type="button"
              className={`btn-refresh${refreshing ? ' is-spinning' : ''}`}
              onClick={handleRefresh}
            >
              Refresh
            </button>
          </div>
        </div>

        <section className="room-grid" aria-label="Public rooms">
          {visibleRooms.length === 0 ? (
            <p className="empty">No rooms match that filter.</p>
          ) : (
            visibleRooms.map((room) => (
              <button
                key={room.code}
                type="button"
                className={`ticket${hotCode === room.code ? ' is-hot' : ''}`}
                onClick={() => joinRoom(room)}
              >
                <div className="ticket-body">
                  <div className="ticket-top">
                    <span className="ticket-name">{room.name}</span>
                    <span className="player-count">{room.players}</span>
                  </div>
                  <span className="ticket-game">
                    <SodaIcon />
                    PopSauce ({room.language})
                  </span>
                </div>
                <span className="ticket-stub">
                  <span className="ticket-code">{room.code}</span>
                </span>
              </button>
            ))
          )}
        </section>
      </main>
    </div>
  )
}

function SodaIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" {...props}>
      <path d="M18.5 4.5c1.8 1.2 3.2 2.8 3.2 4.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M20.2 6.2c2.4.1 4.3 1.2 4.8 2.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M11.2 10.5h9.6l-1.3 16.2a2.2 2.2 0 0 1-2.2 2H14.7a2.2 2.2 0 0 1-2.2-2l-1.3-16.2Z"
        fill="currentColor"
        opacity="0.2"
      />
      <path
        d="M11.2 10.5h9.6l-1.3 16.2a2.2 2.2 0 0 1-2.2 2H14.7a2.2 2.2 0 0 1-2.2-2l-1.3-16.2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M10.6 10.5h11.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 4.5v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.6" />
      <ellipse cx="8" cy="8" rx="3" ry="6.25" stroke="currentColor" strokeWidth="1.6" />
      <path d="M2 8h12M3.2 5h9.6M3.2 11h9.6" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="3" y="7" width="10" height="7.5" rx="1.6" stroke="currentColor" strokeWidth="1.6" />
      <path d="M5.2 7V5.2a2.8 2.8 0 0 1 5.6 0V7" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

function TicketIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M2.5 5.2c0-.9.7-1.7 1.7-1.7h7.6c.9 0 1.7.8 1.7 1.7v1.1a1.4 1.4 0 0 0 0 2.8v1.1c0 .9-.8 1.7-1.7 1.7H4.2c-.9 0-1.7-.8-1.7-1.7V9.1a1.4 1.4 0 0 0 0-2.8V5.2Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M9.5 4.5v8" stroke="currentColor" strokeWidth="1.5" strokeDasharray="1.6 1.8" />
    </svg>
  )
}

export default App
