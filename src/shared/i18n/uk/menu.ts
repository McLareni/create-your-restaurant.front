export const menu = {
  currency: "₴",
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
      deleteConfirm: "Ви впевнені, що хочете видалити цю категорію? Страви, які до неї прив'язані, залишаться без категорії.",
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
      deleteConfirm: "Ви впевнені, що хочете видалити цю страву? Вона зникне з меню для всіх гостей.",
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
        allergens: {
          gluten: "Глютен",
          lactose: "Лактоза",
          nuts: "Горіхи",
          seafood: "Морепродукти"
        },
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
      deleteConfirm: "Ви впевнені, що хочете видалити цей модифікатор? Він буде відв'язаний від усіх страв.",
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
        optionNamePlaceholder: "Назва",
        optionPricePlaceholder: "Ціна",
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
      deleteConfirm: "Ви впевнені, що хочете видалити цей набір? Він зникне з меню для всіх гостей.",
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
        notFound: "Страви не знайдено",
        originalPrice: "Вартість без комбо:",
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
    },

    inventory: {
      title: "Інвентаризація та Стоп-листи",
      subtitle: "Контроль залишків у реальному часі. Зміни миттєво відображаються у гостей.",
      searchPlaceholder: "Пошук страв та модифікаторів...",
      columns: {
        name: "Позиція",
        zone: "Цех (Маршрутизація)",
        stock: "Залишок (порцій)",
        status: "Доступність"
      },
      zones: {
        NONE: "Не призначено",
        HOT_KITCHEN: "Гарячий цех",
        COLD_KITCHEN: "Холодний цех",
        BAR: "Бар",
        SUSHI: "Суші-бар",
        HOOKAH: "Кальянна"
      },
      stockUnlimited: "∞",
      statusAvailable: "В меню",
      statusStopped: "У стоп-листі"
    },

    prices: {
      title: "Управління цінами",
      subtitle: "Масове редагування цін. Змінюйте вартість окремих страв або застосовуйте знижки/націнки до обраних позицій.",
      searchPlaceholder: "Пошук страв...",
      bulkActions: "Масові дії для обраних",
      apply: "Застосувати",
      increase: "Підняти ціну на",
      decrease: "Знизити ціну на",
      typePercent: "%",
      typeFixed: "₴",
      saveChanges: "Зберегти всі зміни",
      discard: "Відхилити",
      unsavedAlert: "У вас є незбережені зміни",
      changedItemsCount: "Змінено позицій: {{count}}",
      columns: {
        dish: "Страва",
        currentPrice: "Поточна ціна",
        newPrice: "Нова ціна",
        difference: "Різниця"
      }
    },
  }
};