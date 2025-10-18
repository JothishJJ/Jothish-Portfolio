import apiConstructor from '../api.js'

const api = apiConstructor()

// Create WebSocket connection.
const socket = new WebSocket('ws://localhost:8974')

// Connection opened
socket.addEventListener('open', () => {
  console.log('Watching for Blueprint changes')
})

// Listen for messages
socket.addEventListener('message', (event) => {
  if (event.data === 'reload-blueprint') api.blueprint()
})
