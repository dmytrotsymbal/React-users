import { CarsTableFilters, UsersTableFilters } from "../types/filtersTypes";

export const formatFiltersColumns = (
  filters: string,
  searchType: string
): { label: string; value: string }[] | string => {
  try {
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

      const isDefaultFilters =
        (minAge === 0 || !minAge) &&
        (maxAge === 120 || !maxAge) &&
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

    // ======== CARS ========
    if (searchType === "cars") {
      const parsedCarsFilters: CarsTableFilters = JSON.parse(filters);

      const {
        minYear = 0,
        maxYear = 9999,
        carColor = "",
        onlyWithPhoto = false,
      } = parsedCarsFilters;

      const isDefaultFilters =
        (minYear === 0 || !minYear) &&
        (maxYear === 9999 || !maxYear) &&
        (!carColor || carColor === "Не задано") &&
        !onlyWithPhoto;

      if (isDefaultFilters) return "Пошук без фільтрів";

      return [
        { label: "Рік випуску від", value: `${minYear}` },
        { label: "Рік випуску до", value: `${maxYear}` },
        { label: "Колір", value: carColor || "Не задано" },
        { label: "З фото", value: onlyWithPhoto ? "Так" : "Ні" },
      ];
    }

    return "Фільтри відсутні";
  } catch (error) {
    console.error("Error formatting filters:", error);
    return "Помилка відображення фільтрів";
  }
};
