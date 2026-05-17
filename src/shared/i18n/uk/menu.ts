export const menu = {
  constructor: {
    title: "Конструктор Меню",
    subtitle: "Керуйте категоріями, стравами та модифікаторами в єдиному просторі.",
    tabs: {
      categories: "Категорії",
      dishes: "Страви",
      modifiers: "Модифікатори",
      combos: "Комбо-набори"
    },
    categories: {
      title: "Дерево категорій",
      emptyTitle: "У вас ще немає категорій",
      emptyDesc: "Створіть першу категорію, щоб почати наповнювати меню.",
      addBtn: "Створити категорію",
      editBtn: "Редагувати",
      deleteBtn: "Видалити",
      modal: {
        createTitle: "Нова категорія",
        editTitle: "Редагування категорії",
        nameLabel: "Назва категорії (Укр)",
        namePlaceholder: "Наприклад: Гарячі закуски",
        cancel: "Скасувати",
        save: "Зберегти"
      }
    },
    dishes: {
      title: "Картки страв",
      emptyTitle: "У вас ще немає страв",
      emptyDesc: "Додайте першу страву до вашого меню, щоб гості могли її замовити.",
      addBtn: "Додати страву",
      editBtn: "Редагувати",
      deleteBtn: "Видалити",
      modal: {
        createTitle: "Нова страва",
        editTitle: "Редагування страви",
        basicInfo: "Основна інформація",
        nameLabel: "Назва страви",
        namePlaceholder: "Наприклад: Паста Карбонара",
        descLabel: "Опис страви",
        descPlaceholder: "Склад та смакові особливості...",
        priceLabel: "Ціна",
        weightLabel: "Вага/Об'єм",
        weightPlaceholder: "350 г",
        timeLabel: "Час приготування (хв)",
        timePlaceholder: "15",
        caloriesLabel: "Калорійність",
        caloriesPlaceholder: "450 ккал",
        media: "Галерея медіа",
        mediaHint: "Перетягніть фото сюди або клікніть для завантаження. Перше фото буде головним.",
        properties: "Характеристики та Алергени",
        tags: {
          vegan: "Веган",
          spicy: "Гостре",
          lactoseFree: "Без лактози"
        },
        allergensLabel: "Алергени",
        allergensPlaceholder: "Оберіть алергени...",
        badgeLabel: "Маркетинговий бейдж",
        cancel: "Скасувати",
        save: "Зберегти"
      }
    },
    modifiers: {
      title: "Модифікатори та Додатки",
      emptyTitle: "Модифікатори відсутні",
      emptyDesc: "Створіть опції, щоб гості могли налаштовувати страви під себе.",
      addBtn: "Додати модифікатор",
      editBtn: "Редагувати",
      deleteBtn: "Видалити",
      modal: {
        createTitle: "Створення модифікатора",
        editTitle: "Редагування модифікатора",
        nameLabel: "Внутрішня назва",
        namePlaceholder: "Наприклад: Розмір піци",
        typeLabel: "Тип",
        typeSingle: "Одиночний (Так/Ні)",
        typeGroup: "Груповий вибір",
        limitsLabel: "Ліміти вибору",
        minSelect: "Мінімум",
        maxSelect: "Максимум",
        optionsLabel: "Варіанти (Опції)",
        addOptionBtn: "Додати варіант",
        optionNamePlaceholder: "Назва (напр. 'Додати сир')",
        optionPricePlaceholder: "Ціна (₴)",
        cancel: "Скасувати",
        save: "Зберегти"
      }
    },
    combos: {
      title: "Комбо-набори та Сети",
      emptyTitle: "Комбо-набори відсутні",
      emptyDesc: "Створіть вигідні пропозиції, об'єднавши кілька страв в один сет.",
      addBtn: "Створити комбо",
      editBtn: "Редагувати",
      deleteBtn: "Видалити",
      modal: {
        createTitle: "Створення комбо",
        editTitle: "Редагування комбо",
        nameLabel: "Назва набору",
        namePlaceholder: "Наприклад: Бургер Меню",
        priceTypeLabel: "Тип ціноутворення",
        typeFixed: "Фіксована ціна",
        typeDiscount: "Знижка (%) на страви",
        priceValueLabel: "Значення",
        searchLabel: "Пошук страв",
        searchPlaceholder: "Почніть вводити назву страви...",
        includedDishes: "Склад комбо",
        emptyIncluded: "Додайте страви зі списку вище",
        cancel: "Скасувати",
        save: "Зберегти"
      }
    },
    badges: {
      NONE: "Без бейджа",
      NEW: "Новинка",
      HIT: "Хіт",
      CHEF_CHOICE: "Вибір шефа",
      TOP_RATED: "Топ рейтинг"
    }
  }
};