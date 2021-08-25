import {readdirSync} from 'fs'
import {ClientEvent} from '@/types/event'

const EVENTS_DIRECTORY = __dirname

export async function loadEventsFromDirectory(): Promise<ClientEvent[]> {
  const events: ClientEvent[] = []
  const files = readdirSync(EVENTS_DIRECTORY).filter(file => file.includes('.event.'))
  for (const file of files) {
    const event = await importEvent(`${EVENTS_DIRECTORY}/${file}`)
    events.push(wrapToSafeEvent(event))
  }
  return events
}

async function importEvent(path: string): Promise<ClientEvent> {
  const file = await import(path) as {default: ClientEvent}
  return file.default
}

function wrapToSafeEvent(event: ClientEvent): ClientEvent {
  const newEvent = Object.assign({}, event)
  newEvent.execute = async context => {
    try {
      await event.execute(context)
    } catch(error) {
      console.error(error)
    }
  }
  return newEvent
}
