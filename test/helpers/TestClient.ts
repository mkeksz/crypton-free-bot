import {EventCallback, EventContext, EventNames} from '@/types/event'
import {Client} from '@/types/client'

export default class TestClient implements Client {
  private readonly commands: {name: string, execute: EventCallback<'text'>}[] = []
  private textCallback: EventCallback<'text'> = async () => {return}

  public onCommand(commandName: EventNames, callback: EventCallback<'text'>): void {
    this.commands.push({name: commandName, execute: callback})
  }

  public onText(callback: EventCallback<'text'>): void {
    this.textCallback = callback
  }

  public async executeCommand(commandName: EventNames, fakeContext: EventContext<'text'>): Promise<void> {
    const command = this.commands.find(command => command.name === commandName)
    await command?.execute(fakeContext)
  }

  public async executeText(fakeContext: EventContext<'text'>): Promise<void> {
    await this.textCallback(fakeContext)
  }

  public async launch(): Promise<void> {return}

  public stop(): void {return}
}
