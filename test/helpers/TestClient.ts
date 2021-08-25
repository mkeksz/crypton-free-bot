import {EventCallback, EventContext} from '@/types/telegraf'
import {EventNames} from '@/types/event'
import {Client} from '@/types/client'

export default class TestClient implements Client {
  private readonly commands: {name: string, execute: EventCallback}[] = []

  public onCommand(commandName: EventNames, callback: EventCallback): void {
    this.commands.push({name: commandName, execute: callback})
  }

  public async executeCommand(commandName: EventNames, fakeContext: EventContext): Promise<void> {
    const command = this.commands.find(command => command.name === commandName)
    await command?.execute(fakeContext)
  }

  public async launch(): Promise<void> {return}

  public stop(): void {return}
}
