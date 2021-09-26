import {InlineKeyboardButton, InlineKeyboardMarkup} from 'telegraf/typings/core/types/typegram'
import {Markup} from 'telegraf'
import {ActionContext, BotContext} from '@/src/types/telegraf'
import {SectionOfUser} from '@/src/types/storage'
import locales from '@/src/locales/ru.json'

export function getTrainingSectionsInlineKeyboard(sections: SectionOfUser[]): Markup.Markup<InlineKeyboardMarkup> {
  const buttons: InlineKeyboardButton[][] = sections.map(section => {
    return [{text: `${section.available ? '' : locales.shared.emoji_locked} ${section.textButton}`, callback_data: `sid:${section.id}`}]
  })
  buttons.push([{text: locales.inline_keyboards.back_to_menu, callback_data: 's:back'}])
  return Markup.inlineKeyboard(buttons)
}

export function getTrainingSubsectionsInlineKeyboard(subsections: SectionOfUser[]): Markup.Markup<InlineKeyboardMarkup> {
  const buttons: InlineKeyboardButton[][] = subsections.map(subsection => {
    const subsectionText = `${subsection.available ? (subsection.availableQuiz ? locales.shared.emoji_checked : '') : locales.shared.emoji_locked} ${subsection.textButton}`
    const subsectionButton = {text: subsectionText, callback_data: `ssid:${subsection.id}`}

    const buttonsLine = [subsectionButton]

    const quizButton = {text: locales.scenes.lessons.quiz, callback_data: `qssid:${subsection.id}`}
    if (subsection.hasQuizzes && subsection.availableQuiz) buttonsLine.push(quizButton)

    if (subsection.stars > 0) {
      const stars = subsection.stars > 3 ? 3 : (subsection.stars < 0 ? 0 : subsection.stars)
      let starsText = ''
      for (let i = 0; i < stars; i++) {
        starsText += locales.shared.emoji_star
      }
      buttonsLine.push({text: starsText, callback_data: `qsss:${stars}`})
    }

    return buttonsLine
  })
  buttons.push([{text: locales.inline_keyboards.back, callback_data: 'ss:back'}])
  return Markup.inlineKeyboard(buttons)
}

export function getParentSections(ctx: BotContext): Promise<SectionOfUser[]> {
  return ctx.storage.getSectionsOfUser(ctx.from!.id, true)
}

export function showAlertLockedSection(ctx: BotContext): Promise<true> {
  return ctx.answerCbQuery(locales.scenes.training_sections.locked_section)
}

export function getSectionFromActionData(ctx: ActionContext): Promise<SectionOfUser | null> {
  const data = ctx.match[0]
  const [,sectionID] = data.split(':')
  return ctx.storage.getSectionOfUserByID(ctx.from!.id, Number(sectionID))
}

export function getEditFromState(ctx: BotContext): boolean {
  const edit = ctx.state['edit'] as unknown
  return Boolean(edit)
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
