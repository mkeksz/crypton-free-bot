import {readdirSync} from 'fs'
import {Scene} from '@/src/types/telegraf'

const SCENES_DIRECTORY = __dirname + '/../scenes/'

export async function loadScenes(): Promise<Scene[]> {
  const scenes: Scene[] = []
  const files = readdirSync(SCENES_DIRECTORY)
  for (const file of files) {
    const sceneFile = await import(SCENES_DIRECTORY + file) as {default: Scene}
    scenes.push(sceneFile.default)
  }
  return scenes
}
