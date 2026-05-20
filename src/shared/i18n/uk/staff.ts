export const staff = {
  title: "Команда та Персонал",
  subtitle: "Керуйте доступами працівників, їхніми ролями та контактними даними.",
  emptyTitle: "У вас ще немає співробітників",
  emptyDesc: "Додайте першого працівника, щоб надати йому доступ до системи.",
  addBtn: "Додати працівника",
  searchPlaceholder: "Пошук за ім'ям або email...",
  roles: {
    MANAGER: "Адміністратор",
    WAITER: "Офіціант",
    CHEF: "Кухар",
    BARTENDER: "Бармен"
  },
  statusActive: "Доступ відкрито",
  statusInactive: "Доступ закрито",
  notifications: {
    createSuccess: "Працівника успішно додано!",
    createError: "Помилка при додаванні працівника",
    updateSuccess: "Дані працівника оновлено!",
    updateError: "Помилка при оновленні даних",
    deleteSuccess: "Працівника видалено",
    deleteError: "Помилка при видаленні"
  },
  modal: {
    createTitle: "Новий співробітник",
    editTitle: "Редагування профілю",
    firstNameLabel: "Ім'я",
    firstNamePlaceholder: "Олександр",
    lastNameLabel: "Прізвище",
    lastNamePlaceholder: "Шевченко",
    emailLabel: "Email (для входу)",
    emailPlaceholder: "sasha@gastro.com",
    phoneLabel: "Номер телефону",
    phonePlaceholder: "+380...",
    roleLabel: "Посада (Роль)",
    rolePlaceholder: "Оберіть посаду...",
    statusLabel: "Активний акаунт",
    cancel: "Скасувати",
    save: "Зберегти"
  },
  errors: {
    firstNameRequired: "Ім'я обов'язкове",
    emailRequired: "Email обов'язковий",
    emailInvalid: "Некоректний формат email",
    roleRequired: "Оберіть посаду"
  },
  deleteConfirm: "Ви впевнені, що хочете видалити цього працівника? Він втратить доступ до системи назавжди."
};