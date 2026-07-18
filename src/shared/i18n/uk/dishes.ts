export const dishes = {
  title: "Картки страв",
  emptyTitle: "У вас ще немає страв",
  emptyDesc: "Додайте першу страву до вашого меню, щоб гості могли її замовити.",
  addBtn: "Додати страву",
  editBtn: "Редагувати",
  deleteBtn: "Вилучити",
  descTitle: "Опис страви",
  moreBtn: "Детальніше...",
  deleteConfirm: "Ви впевнені, що хочете видалити цю страву? Вона зникне з меню для всіх гостей.",
  statusAvailable: "В меню",
  statusStopped: "У стоп-листі",
  notifications: {
    imageUploading: "Завантаження зображення...",
    imageUploadSuccess: "Зображення завантажено успішно!",
    imageUploadError: "Помилка завантаження файлу",
    createSuccess: "Страва успішно створена",
    updateSuccess: "Дані про страву оновлено"
  },
  modal: {
    charCreateTip: "Почніть вводити назву в поле пошуку, щоб створити новий тег або алерген, якого немає у списку.",
    createAction: "Створити",
    createTitle: "Нова страва",
    editTitle: "Редагування страви",
    basicInfo: "Основна інформація",
    nameLabel: "Назва страви",
    namePlaceholder: "Наприклад: Паста Карбонара",
    categoryLabel: "Категорія страви",
    categoryPlaceholder: "Оберіть категорію для страви...",
    descLabel: "Опис страви",
    descPlaceholder: "Склад, секрети приготування та смакові особливості...",
    priceLabel: "Базова ціна (₴)",
    hasModifiers: "Має активні модифікатори",
    searchPlaceholder: "Почніть вводити назву...",
    notFound: "Нічого не знайдено",
    doneBtn: "Зберегти позицію",
    cancel: "Скасувати",
    save: "Зберегти позицію",
    tabs: {
      general: "Основне",
      pricing: "Ціноутворення",
      characteristics: "Характеристики",
      ingredients: "Складники",
      modifiers: "Модифікатори",
      media: "Медіа"
    },
    weightLabel: "Вага / Об'єм одиниці",
    weightPlaceholder: "350 г",
    unitLabel: "Одиниця виміру",
    unitPlaceholder: "г, мл, шт, порція",
    timeLabel: "Час приготування (хв)",
    timePlaceholder: "15",
    caloriesLabel: "Калорійність",
    caloriesPlaceholder: "450 ккал",
    mediaTitle: "Галерея медіа",
    mediaHint: "Натисніть сюди, щоб додати фотографії страви",
    changeImage: "Змінити фото",
    availabilityLabel: "Активна позиція (показувати в QR-меню)",
    stockLabel: "Кількість за замовчуванням (для стоп-листів)",
    units: {
      minutesShort: "хв",
      caloriesShort: "ккал"
    },
    characteristics: {
      selectTags: "Обрати особливості",
      selectAllergens: "Вказати алергени",
      noTags: "Особливості або теги страви не вказані",
      noAllergens: "Для цієї страви немає зафіксованих алергенів"
    },
    properties: {
      vegan: "Веганська",
      spicy: "Гостра",
      lactoseFree: "Без лактози",
      allergensTitle: "Харчової алергени",
      addAllergenPlaceholder: "Додати новий алерген",
      tagsTitle: "Теги та Особливості",
      addTagPlaceholder: "Додати новий тег",
      priceLabel: "Вартість страви",
      descriptionLabel: "Опис",
      weightLabel: "Вага:",
      caloriesLabel: "Калорійність:"
    },
    allergensLabel: "Алергени",
    noModifiers: "У вас ще немає створених груп модифікаторів для вибору.",
    badgeLabel: "Маркетинговий бейдж (Стікер)",
    ingredients: {
      title: "Складники страви",
      listTitle: "Рецептурний склад страви",
      selectLabel: "Компонент зі складу закладу",
      selectPlaceholder: "Оберіть товар зі складу...",
      quantityLabel: "Кількість",
      empty: "Додайте перші інгредієнти для контролю залишків на складі",
      nameLabel: "Назва інгредієнта",
      qtyLabel: "Кількість",
      unitLabel: "Од. вим.",
      units: {
        g: "г",
        ml: "мл",
        pcs: "шт",
        kg: "кг",
        l: "л"
      },
      errors: {
        alreadyAdded: "Цей інгредієнт вже додано до страви"
      }
    },
    media: {
      mainPhotoBadge: "Головне фото",
      setAsMainBtn: "Зробити головним",
      deletePhotoBtn: "Видалити фото"
    },
    errors: {
      nameRequired: "Назва страви обов'язана для заповнення",
      priceNegative: "Ціна не може бути від'ємною",
      ingredientNameRequired: "Назва складника обов'язана",
      ingredientQtyNegative: "Кількість складника не може бути менше 0",
      allergenSaveFailed: "Не вдалося зберегти алерген у базу даних",
      allergenDeleteFailed: "Не вдалося видалити алерген з бази даних",
      tagSaveFailed: "Не вдалося зберегти тег у базу даних",
      tagDeleteFailed: "Не вдалося видалити тег з бази даних"
    }
  }
};