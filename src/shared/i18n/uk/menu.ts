import { categories } from '@/shared/i18n/uk/categories';
import { dishes } from '@/shared/i18n/uk/dishes';
import { modifiers } from '@/shared/i18n/uk/modifiers';
import { combos } from '@/shared/i18n/uk/combos';
import { inventory } from '@/shared/i18n/uk/inventory';

export const menu = {
  currency: {
    "PLN": "PLN",
    "USD": "USD",
    "EUR": "EUR",
    "UAH": "UAH",
  },
  public: {
    title: "Меню закладу",
    subtitle: "Оберіть улюблені страви та надішліть замовлення миттєво",
    allDishes: "Усі страви",
    checkingTable: "Перевіряємо номер вашого столика...",
    noPhoto: "Фотографія відсутня",
    noDescription: "Опис та детальний склад страви запитуйте в офіціанта",
    cart: "Ваше замовлення",
    cartEmpty: "Кошик порожній. Додайте щось смачне з нашого меню!",
    activeOrder: "Активне замовлення",
    orderNumber: "Номер замовлення",
    activeOrderNoItems: "Позиції замовлення завантажуються або недоступні.",
    activeOrderTotal: "Сума активного замовлення",
    total: "Разом до сплати",
    submitOrder: "Підтвердити замовлення",
    addMore: "Дозамовити страви",
    placing: "Надсилаємо замовлення на кухню...",
    callWaiter: "Викликати офіціанта",
    waiterCalling: "Викликаємо офіціанта...",
    waiterCallSuccess: "Офіціанта викликано",
    billRequested: "Запит на рахунок відправлено. Офіціант скоро підійде.",
    findOrderPlaceholder: "Впишіть номер замовлення",
    goToOrder: "Перейти",
    orderNotFound: "Замовлення не знайдено",
    orderCodeAmbiguous: "Знайдено кілька замовлень, уточніть код",
    orderLookupFailed: "Не вдалося знайти замовлення",
    statusCompleted: "Готово",
    statusCancelled: "Скасовано",
    statusInProgress: "В процесі",
    requestBill: "Попросити рахунок",
    descriptionAndIngredients: "Опис та склад",
    vegan: "Веганська",
    notVegan: "Не веганська",
    spicy: "Гостра страва",
    notSpicy: "Лагідна",
    lactoseFree: "Без лактози",
    hasLactose: "Містить лактозу",
    allergensWarning: "Алергени та інша корисна інформація про страву.",
    tags: "Теги"
  },
  errors: {
    unavailable: "Цифрове меню цього закладу тимчасово недоступне. Зверніться до персоналу закладу.",
    tableValidationFailed: "Помилка верифікації столу. Будь ласка, відскануйте QR-код повторно.",
    tableNotFound: "Стіл не знайдено або він деактивований у системі ресторану.",
    orderClosedAction: "Ваше замовлення вже закрите офіціантом. Ми створили нове замовлення для вас."
  },
  constructor: {
    createAction: "Створити",
    title: "Конструктор Меню",
    subtitle: "Керуйте категоріями, стравами та модифікаторами в єдиному просторі.",
    viewMenu: "Перегляд меню",
    tabs: {
      categories: "Категорії",
      dishes: "Страви",
      modifiers: "Модифікатори",
      combos: "Комбо-набори"
    },
    categories,
    dishes,
    modifiers,
    combos,
    inventory,
    badges: {
      NONE: "Без бейджа",
      NEW: "Новинка",
      HIT: "Хіт",
      CHEF_CHOICE: "Вибір шефа",
      TOP_RATED: "Топ рейтинг"
    }
  }
};