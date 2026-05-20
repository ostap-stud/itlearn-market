export const initialProducts = [
  {
    id: 1,
    title: 'Java Core: практичний конспект',
    category: 'Java',
    level: 'Початковий',
    type: 'PDF + задачі',
    price: 349,
    rating: 4.8,
    author: 'ITLearn Team',
    direction: 'Backend',
    skills: ['Java', 'ООП', 'Колекції', 'Файли'],
    durationWeeks: 3,
    description:
      'Структурований навчальний матеріал з основ Java: синтаксис, ООП, колекції, винятки, файли та базові практичні завдання.',
    includes: ['PDF-конспект', '35 практичних завдань', 'приклади коду', 'чек-лист тем'],
    reviews: 42
  },
  {
    id: 2,
    title: 'Kotlin Basics для Java-розробників',
    category: 'Kotlin',
    level: 'Середній',
    type: 'Мінікурс',
    price: 499,
    rating: 4.9,
    author: 'O. Developer',
    direction: 'Backend',
    skills: ['Kotlin', 'Null-safety', 'Coroutines', 'Spring'],
    durationWeeks: 4,
    description:
      'Мінікурс для швидкого переходу з Java на Kotlin: null-safety, data class, extension functions, coroutines та практичні приклади.',
    includes: ['8 відеоуроків', 'PDF-шпаргалка', 'приклади проєктів', 'тести після модулів'],
    reviews: 31
  },
  {
    id: 3,
    title: 'SQL Практикум: запити та нормалізація',
    category: 'Бази даних',
    level: 'Початковий',
    type: 'Практикум',
    price: 299,
    rating: 4.7,
    author: 'DB Academy',
    direction: 'Backend',
    skills: ['SQL', 'JOIN', 'Нормалізація', 'Індекси'],
    durationWeeks: 2,
    description:
      'Практичний набір завдань для вивчення SQL-запитів, JOIN, агрегацій, індексів, нормалізації та проєктування структури БД.',
    includes: ['60 SQL-завдань', 'схеми БД', 'відповіді', 'коротка теорія'],
    reviews: 57
  },
  {
    id: 4,
    title: 'Spring Boot Starter Project',
    category: 'Backend',
    level: 'Середній',
    type: 'Шаблон проєкту',
    price: 699,
    rating: 4.6,
    author: 'Backend Lab',
    direction: 'Backend',
    skills: ['Spring Boot', 'REST API', 'DTO', 'Валідація'],
    durationWeeks: 5,
    description:
      'Готовий шаблон backend-проєкту на Spring Boot з REST API, DTO, валідацією, структурою пакетів і прикладами сервісного шару.',
    includes: ['архів проєкту', 'README', 'приклади API', 'інструкція запуску'],
    reviews: 24
  },
  {
    id: 5,
    title: 'Frontend UI Kit для навчальних платформ',
    category: 'Frontend',
    level: 'Середній',
    type: 'UI Kit',
    price: 399,
    rating: 4.5,
    author: 'Design Code Studio',
    direction: 'Frontend',
    skills: ['React', 'UI components', 'Адаптивна верстка', 'UX'],
    durationWeeks: 3,
    description:
      'Набір UI-компонентів для створення навчальних платформ: картки курсів, каталог, профіль, кошик, блоки статистики.',
    includes: ['компоненти', 'макети сторінок', 'адаптивна сітка', 'приклади використання'],
    reviews: 18
  },
  {
    id: 6,
    title: 'Алгоритми та структури даних: задачник',
    category: 'Алгоритми',
    level: 'Початковий',
    type: 'PDF + тести',
    price: 449,
    rating: 4.8,
    author: 'Algo School',
    direction: 'Computer Science',
    skills: ['Алгоритми', 'Структури даних', 'Сортування', 'Графи'],
    durationWeeks: 5,
    description:
      'Навчальний задачник з масивів, списків, стеків, черг, дерев, графів, сортувань і пошуку з поясненнями розв’язків.',
    includes: ['PDF-збірник', '80 задач', 'пояснення', 'тестові питання'],
    reviews: 63
  },
  {
    id: 7,
    title: 'React: практична розробка SPA',
    category: 'Frontend',
    level: 'Початковий',
    type: 'Мінікурс',
    price: 549,
    rating: 4.7,
    author: 'Frontend Lab',
    direction: 'Frontend',
    skills: ['React', 'Vite', 'State management', 'Routing'],
    durationWeeks: 4,
    description:
      'Практичний курс зі створення односторінкового застосунку: компоненти, стан, форми, робота з API та підготовка до деплою.',
    includes: ['10 уроків', 'шаблон проєкту', 'приклади компонентів', 'тести'],
    reviews: 29
  },
  {
    id: 8,
    title: 'Data Analytics Starter Pack',
    category: 'Data Analytics',
    level: 'Початковий',
    type: 'Практикум',
    price: 599,
    rating: 4.6,
    author: 'Data School',
    direction: 'Data Analytics',
    skills: ['Excel', 'SQL', 'Візуалізація', 'Метрики'],
    durationWeeks: 4,
    description:
      'Набір матеріалів для старту в аналітиці даних: метрики, таблиці, SQL-запити, візуалізація і базові бізнес-висновки.',
    includes: ['датасети', 'практичні кейси', 'інструкції', 'контрольні питання'],
    reviews: 21
  },
  {
    id: 9,
    title: 'QA Manual: тест-дизайн і баг-репорти',
    category: 'QA',
    level: 'Початковий',
    type: 'PDF + шаблони',
    price: 249,
    rating: 4.4,
    author: 'QA Studio',
    direction: 'QA',
    skills: ['Тест-кейси', 'Баг-репорти', 'Чек-листи', 'Тест-дизайн'],
    durationWeeks: 2,
    description:
      'Комплект для початку роботи в ручному тестуванні: теорія, шаблони тест-кейсів, чек-листи та приклади баг-репортів.',
    includes: ['PDF-конспект', 'шаблони документів', 'приклади багів', 'практичний кейс'],
    reviews: 16
  }
];

export const categories = ['Усі', 'Java', 'Kotlin', 'Бази даних', 'Backend', 'Frontend', 'Алгоритми', 'Data Analytics', 'QA'];
export const levels = ['Усі', 'Початковий', 'Середній'];
export const directions = ['Backend', 'Frontend', 'Data Analytics', 'QA', 'Computer Science'];
