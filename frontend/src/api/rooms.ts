const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

export type Room = {
  code: string
  name: string
  players: number
  language: string
  isPublic: boolean
}

export type PublicLobby = {
  rooms: Room[]
  privateRoomCount: number
}

export async function fetchPublicLobby(): Promise<PublicLobby> {
  const response = await fetch(`${API_BASE}/api/rooms/public`)
  if (!response.ok) {
    throw new Error('Failed to load rooms')
  }
  return response.json()
}

export async function createRoom(input: {
  name: string
  isPublic: boolean
  language?: string
}): Promise<Room> {
  const response = await fetch(`${API_BASE}/api/rooms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!response.ok) {
    throw new Error('Failed to create room')
  }
  return response.json()
}
