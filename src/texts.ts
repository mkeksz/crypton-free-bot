import {SectionOfUser} from '@/types/storage'

export const REPLIES = {
  start: 'Добро пожаловать',
  nftDrop: 'Описание NFT drop Crypton',
  chat: 'Бесплатный чат криптона: [ссылка](https://example.com)',
  support: 'Описание услуги поддержки\\. [ссылка](https://example.com)',
  calendar: 'Бесплатная версия календаря\\. [ссылка](https://example.com)',
  ecosystem: 'Превью текст экосистемы\\. [ссылка](https://example.com)',
  discord: 'Описание Discord',
  training: 'Выберите раздел обучения',
  rightAnswerLesson: 'Верно!',
  notRightAnswerLesson: 'Ответ неверный! Попробуй ещё раз.',
  unknownCommand: 'Неизвестная команда. Возвращаю в главное меню.',
  completedSection: getTextCompletedSection,
  selectedSection: getTextSelectedSection
}

export const BUTTONS = {
  training: 'Обучение криптовалюте',
  discord: 'Discord',
  ecosystem: 'Экосистема Crypton',
  calendar: 'Календарь событий LITE',
  support: 'Поддержка LITE',
  chat: 'Бесплатный чат Crypton',
  nft: 'NFT drop Crypton'
}

export const INLINE_BUTTONS = {
  discord: 'Перейти в канал',
  backToSections: '« Вернуться к разделам',
  nextLesson: 'Следующий этап »',
  againLesson: '« Назад',
  backToMenu: '« Возврат в меню',
  startQuiz: 'Пройти квиз и подтвердить свои знания',
  laterQuiz: 'Пройти квиз позднее'
}

export const ANSWER_CB_QUERY = {
  lockedLesson: 'Этот раздел пока закрыт. Сначала пройдите доступные разделы.',
  wrongAnswer: 'Ответ неверный',
  wait: getTextWait
}

function getTextCompletedSection(sectionName: string): string {
  return `Поздравляю! Ты закончил раздел ${sectionName}.`
}

function getTextWait(seconds: number): string {
  return `Подождите ${seconds}с.`
}

function getTextSelectedSection(section: SectionOfUser): string {
  return `Выбран раздел: ${section.textButton}\nВыберите подраздел\\.`
}
