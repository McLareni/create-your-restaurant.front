export const menu = {
  currency: "₴",
  public: {
    title: "Цифрове меню закладу",
    subtitle: "Оберіть улюблені страви та надішліть замовлення миттєво",
    checkingTable: "Перевіряємо номер вашого столика...",
    noPhoto: "Фотографія відсутня",
    noDescription: "Опис та детальний склад страви запитуйте в офіціанта",
    cart: "Ваше замовлення",
    cartEmpty: "Кошик порожній. Додайте щось смачне з нашого меню!",
    total: "Разом до сплати",
    submitOrder: "Підтвердити замовлення",
    placing: "Надсилаємо замовлення на кухню..."
  },
  errors: {
    unavailable: "Цифрове меню цього закладу тимчасово недоступне. Зверніться до персоналу закладу.",
    tableValidationFailed: "Помилка верифікації столу. Будь ласка, відскануйте QR-код повторно.",
    tableNotFound: "Стіл не знайдено або він деактивований у системі ресторану."
  },
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
      errors: {
        nameMin: "Назва категорії має містити мінімум 2 символи",
        nameMax: "Назва занадто довга (макс. 50 символів)"
      },
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
      emptyDesc: "Додайте першу страву до вашого меню, щоб гості могли її замовіти.",
      addBtn: "Додати страву",
      editBtn: "Редагувати",
      deleteBtn: "Вилучити",
      descTitle: "Опис страви",
      moreBtn: "Детальніше...",
      deleteConfirm: "Ви впевнені, що хочете видалити цю страву? Вона зникне з меню для всіх гостей.",
      notifications: {
        imageUploading: "Завантаження зображення...",
        imageUploadSuccess: "Зображення завантажено успішно!",
        imageUploadError: "Помилка завантаження файлу"
      },
      modal: {
        createTitle: "Нова XML страва",
        editTitle: "Редагування装 страви",
        basicInfo: "Основна інформація",
        nameLabel: "Назва страви",
        namePlaceholder: "Наприклад: Паста Карбонара",
        categoryLabel: "Категорія страви",
        categoryPlaceholder: "Оберіть категорію для страви...",
        descLabel: "Опис страви",
        descPlaceholder: "Склад, секрети приготування та смакові особливості...",
        priceLabel: "Базова ціна (₴)",
        taxRateLabel: "Ставка ПДВ (%)",
        taxText: "ПДВ",
        hasModifiers: "Має активні модифікатори",
        variantsTitle: "Розміри порцій / Варіанти",
        addVariantBtn: "Додати варіант",
        variantName: "Назва варіанту",
        variantPrice: "Ціна",
        variantSku: "Артикул (SKU)",
        tabs: {
          pricing: "Ціноутворення",
          characteristics: "Характеристики"
        },
        weightLabel: "Вага / Об'єм одиниці",
        weightPlaceholder: "350 г",
        unitLabel: "Одиниця виміру",
        unitPlaceholder: "г, мл, шт, порція",
        timeLabel: "Час приготування (хв)",
        timePlaceholder: "15",
        caloriesLabel: "Калорійність",
        caloriesPlaceholder: "450 ккал",
        media: "Галерея медіа",
        mediaHint: "Перетягніть фото сюди або клікніть для завантаження. Перше фото буде головним в гостьовому меню.",
        changeImage: "Змінити фото",
        availabilityLabel: "Активна позиція (показувати в QR-меню)",
        stockLabel: "Кількість за замовчуванням (для стоп-листів)",
        properties: {
          allergensTitle: "Харчові алергени",
          addAllergenPlaceholder: "Додати новий алерген",
          tagsTitle: "Особливості та Теги",
          addTagPlaceholder: "Додати новий тег"
        },
        allergensLabel: "Алергени",
        noModifiers: "У вас ще немає створених груп модифікаторів для вибору.",
        badgeLabel: "Маркетинговий бейдж (Стікер)",
        ingredients: {
  title: "Складники страви",
  empty: "Складників не додано",
  nameLabel: "Назва інгредієнта",
  selectPlaceholder: "Оберіть продукт зі складу...",
  qtyLabel: "Кількість",
  unitLabel: "Од. вим.",
  units: {
    g: "г",
    ml: "мл",
    pcs: "шт",
    kg: "кг"
  },
  errors: {
    alreadyAdded: "Цей інгредієнт вже додано до страви"
  }
},
        errors: {
          nameRequired: "Назва страви обов'язана для заповнення",
          priceNegative: "Ціна не може бути від'ємною",
          variantNameRequired: "Назва порції/розміру обов'язана",
          ingredientNameRequired: "Назва складника обов'язана",
          ingredientQtyNegative: "Кількість складника не може бути менше 0",
          allergenSaveFailed: "Не вдалося зберегти алерген у базу даних",
          allergenDeleteFailed: "Не вдалося видалити алерген з бази даних",
          tagSaveFailed: "Не вдалося зберегти тег у базу даних",
          tagDeleteFailed: "Не вдалося видалити тег з бази даних"
        },
        cancel: "Скасувати",
        save: "Зберегти позицію"
      }
    },
    modifiers: {
      title: "Групи модифікаторів",
      emptyTitle: "Немає модифікаторів",
      emptyDesc: "Створюйте додатки, які клієнти зможуть обирати до страв.",
      emptyStateDesc: "Додайте першу групу модифікаторів (наприклад \"Ступінь просмаження\" або \"Додатки до піци\").",
      addBtn: "Створити групу",
      addFirstBtn: "Створити першу групу",
      editBtn: "Редагувати",
      deleteBtn: "Видалити",
      deleteConfirm: "Видалити цю групу модифікаторів?",
      deleteOptionConfirm: "Видалити цю опцію?",
      requiredBadge: "Обов'язково",
      minSelect: "Мінімум:",
      maxSelect: "Максимум:",
      unlimited: "Безліміт",
      optionsCount: "опцій",
      emptyOptions: "У цій групі ще немає опцій.",
      free: "Безкоштовно",
      addOptionBtn: "Додати опцію",
      errors: {
        nameMin: "Назва групи модифікаторів має містити мінімум 2 символи",
        nameMax: "Назва групи занадто довга (макс. 50 символів)",
        minSelectionsNegative: "Мінімум виборів не може быть менше 0",
        maxSelectionsNegative: "Максимум виборів не може бути менше 0",
        valueMin: "Значення додаткової вартості не може бути менше 0"
      },
      modal: {
        group: {
          createTitle: "Створити групу модифікаторів",
          editTitle: "Редагувати групу",
          nameLabel: "Назва групи (напр. Ступінь просмаження)",
          minLabel: "Мінімум виборів",
          maxLabel: "Максимум виборів",
          unlimited: "Безліміт",
          requiredLabel: "Обов'язковий вибір (Клієйн не зможе замовити без вибору)"
        },
        option: {
          createTitle: "Додати опцію",
          editTitle: "Редагувати опцію",
          nameLabel: "Назва опції (напр. Екстра сир)",
          priceLabel: "Додаткова вартість (₴)",
          availableLabel: "В наявності"
        },
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
      notifications: {
        createSuccess: "Комбо успешно створено",
        createError: "Помилка при створенні комбо",
        updateSuccess: "Комбо оновлено",
        updateError: "Помилка при оновленні комбо",
        deleteSuccess: "Комбо видалено",
        deleteError: "Помилка при видаленні комбо"
      },
      errors: {
        dishIdRequired: "ID страви обовʼязковий",
        dishNameRequired: "Назва страви обовʼязкова",
        dishPriceNegative: "Ціна не може бути відʼємною",
        nameMin: "Назва комбо має містити мінімум 2 символи",
        valueMin: "Значення ціни або знижки не може бути менше 0",
        dishesMin: "Оберіть принаймні одну страву для комбо",
        discountMax: "Знижка не може перевищувати 100%"
      },
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
        save: "Зберегти",
        upsellTitle: "Рекомендовані товари для крос-продажів"
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
    }
  }
};