import {ActionContext, BotContext} from '@/src/types/telegraf'
import {SectionOfUser} from '@/src/types/storage'
import locales from '@/src/locales/ru.json'

export function getParentSections(ctx: BotContext): Promise<SectionOfUser[]> {
  return ctx.storage.getSectionsOfUser(ctx.from!.id, true)
}

export function showAlertLockedSection(ctx: BotContext): Promise<true> {
  return ctx.answerCbQuery(locales.scenes.training_sections.locked_section)
}

export function getStarsFromActionData(ctx: ActionContext): string {
  const data = ctx.match[0]
  let stars = Number(data.split(':')[1])
  stars = stars > 3 ? 3 : (stars < 0 ? 0 : stars)
  let starsText = ''
  for (let i = 0; i < stars; i++) {
    starsText += locales.shared.emoji_star
  }
  return starsText
}
