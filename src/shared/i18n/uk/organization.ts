export const organization = {
  create: {
    title: "Створення першого закладу",
    subtitle: "Давайте налаштуємо ваш робочий простір. Це займе менше хвилини.",
    nameLabel: "Назва закладу",
    namePlaceholder: "Наприклад: Кав'ярня Кіт",
    typeLabel: "Тип закладу",
    typePlaceholder: "Оберіть тип...",
    slugLabel: "Адреса сайту",
    slugHint: "За цією адресою гості відкриватимуть ваше меню.",
    currencyLabel: "Основна валюта",
    currencyPlaceholder: "Оберіть валюту...",
    languageLabel: "Мова сайту",
    languagePlaceholder: "Оберіть мову...",
    cityLabel: "Місто (Опціонально)",
    cityPlaceholder: "Київ",
    phoneLabel: "Контактний телефон (Опціонально)",
    phonePlaceholder: "+380...",
    submitBtn: "Створити заклад",
    types: {
      FAST_FOOD: "Фаст-фуд",
      CASUAL_DINING: "Повсякденний ресторан",
      FINE_DINING: "Ресторан високої кухні",
      CAFE: "Кав'ярня",
      BUFFET: "Шведський стіл",
      FOOD_TRUCK: "Фуд-трак"
    },
    currencies: {
      USD: "USD (Долар США)",
      EUR: "EUR (Євро)",
      GBP: "GBP (Британський фунт)",
      JPY: "JPY (Японська єна)",
      CNY: "CNY (Китайський юань)",
      RUB: "RUB (Російський рубль)",
      PLN: "PLN (Польський злотий)",
      UAH: "UAH (Українська гривня)"
    },
    languages: {
      EN: "English",
      FR: "Français",
      ES: "Español",
      DE: "Deutsch",
      IT: "Italiano",
      RU: "Русский",
      CN: "中文",
      JP: "日本語",
      PL: "Polski",
      UA: "Українська"
    }
  },
  animation: {
    step1: "Формуємо базу даних закладу...",
    step2: "Виділяємо піддомен ",
    step3: "Налаштовуємо дизайн цифрового меню...",
    step4: "Успішно!",
  },
  errors: {
    nameLength: "Назва закладу має містити мінімум 3 символи",
    slugFormat: "Адреса може містити лише латинські літери, цифри та дефіс",
    slugReserved: "Ця адреса є службовою і не може бути використана",
    slugTaken: "Ця адреса вже зайнята іншим закладом",
    required: "Будь ласка, оберіть значення зі списку",
    cityLength: "Назва міста має містити від 2 до 50 символів",
    cityFormat: "Назва міста не може містити спецсимволи",
    phoneFormat: "Некоректний формат. Використовуйте міжнародний формат (+380...)",
    serverError: "Внутрішня помилка сервера. Спробуйте пізніше."
  }
};