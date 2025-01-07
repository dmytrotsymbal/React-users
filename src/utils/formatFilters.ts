type UsersTableFilters = {
  minAge?: number;
  maxAge?: number;
  createdFrom?: string;
  createdTo?: string;
  onlyAdults?: boolean;
  onlyWithPhoto?: boolean;
};

type CarsTableFilters = {
  minYear?: number;
  maxYear?: number;
  carColor?: string;
  onlyWithPhoto?: boolean;
};

// Функція для форматування фільтрів у вигляді стовпчиків або тексту
export const formatFiltersColumns = (
  filters: string,
  searchType: string
): { label: string; value: string }[] | string => {
  try {
    // Обробка фільтрів для users
    if (searchType === "users") {
      const parsedUsersFilters: UsersTableFilters = JSON.parse(filters);

      const {
        minAge = 0,
        maxAge = 120,
        createdFrom = "0001-01-01T00:00:00",
        createdTo = "9999-12-31T23:59:59.9999999",
        onlyAdults = false,
        onlyWithPhoto = false,
      } = parsedUsersFilters;

      // Перевірка на значення за замовчуванням
      const isDefaultFilters =
        minAge === 0 &&
        maxAge === 120 &&
        createdFrom === "0001-01-01T00:00:00" &&
        createdTo === "9999-12-31T23:59:59.9999999" &&
        !onlyAdults &&
        !onlyWithPhoto;

      if (isDefaultFilters) return "Пошук без фільтрів";

      return [
        { label: "Вік від", value: `${minAge}` },
        { label: "Вік до", value: `${maxAge}` },
        {
          label: "Дата реєстрації від",
          value:
            createdFrom === "0001-01-01T00:00:00"
              ? "немає"
              : new Date(createdFrom).toLocaleDateString(),
        },
        {
          label: "Дата реєстрації до",
          value:
            createdTo === "9999-12-31T23:59:59.9999999"
              ? "немає"
              : new Date(createdTo).toLocaleDateString(),
        },
        { label: "Тільки дорослі", value: onlyAdults ? "Так" : "Ні" },
        { label: "З фото", value: onlyWithPhoto ? "Так" : "Ні" },
      ];
    }

    // Обробка фільтрів для cars
    if (searchType === "cars") {
      const parsedCarsFilters: CarsTableFilters = JSON.parse(filters);

      const {
        minYear = 0,
        maxYear = 9999,
        carColor = "", // Виправлено значення за замовчуванням на пустий рядок
        onlyWithPhoto = false,
      } = parsedCarsFilters;

      // Перевірка на значення за замовчуванням
      const isDefaultFilters =
        minYear === 0 && maxYear === 9999 && !carColor && !onlyWithPhoto;

      if (isDefaultFilters) return "Пошук без фільтрів";

      return [
        { label: "Рік випуску від", value: `${minYear}` },
        { label: "Рік випуску до", value: `${maxYear}` },
        { label: "Колір", value: `${carColor} ` },
        { label: "З фото", value: onlyWithPhoto ? "Так" : "Ні" },
      ];
    }

    return "Фільтри відсутні";
  } catch (error) {
    console.error("Error formatting filters:", error);
    return "Помилка відображення фільтрів";
  }
};
