interface Recipes {
  [key: string]: Recipe;
}

interface Recipe {
  name: string;
  ingredients: Ingredient[];
}

export interface Ingredient {
  searchName: string;
  ingredientName: string;
  variationName: string;
  amount: string;
  unit: string;
  exact?: boolean;
  locator?: string;
}

const recipes: Recipes = {
  "meatballs-mashed-potatoes": {
    name: "Meatballs with mashed potatoes",
    ingredients: [
      {
        searchName: "meatbal",
        ingredientName: "Meatballs halal",
        variationName: "UK, Conventional",
        amount: "100",
        unit: "g",
      },
      {
        searchName: "potato",
        ingredientName: "Potato, Small",
        variationName: "Portugal, Conventional",
        amount: "0.2",
        unit: "hg",
      },
      {
        searchName: "lingon",
        ingredientName: "Lingonberries",
        variationName: "Finland, Conventional",
        amount: "10",
        unit: "g",
      },
      {
        searchName: "gravy",
        ingredientName: "Gravy sauce",
        variationName: "Germany, Conventional",
        amount: "2",
        unit: "dl",
      },
      {
        searchName: "peas",
        ingredientName: "Peas, frozen",
        variationName: "Portugal, Conventional",
        amount: "15",
        unit: "g",
        locator: "#variations",
      },
    ],
  },
  "mini-lobster-roll": {
    name: "Mini Lobster Roll",
    ingredients: [
      {
        searchName: "brio",
        amount: "300",
        unit: "g",
        ingredientName: "Brioche",
        variationName: "Unknown origin, Conventional",
      },
      {
        searchName: "lemo",
        amount: "1",
        unit: "piece",
        ingredientName: "Lemon",
        variationName: "Brazil, Organic",
      },
      {
        searchName: "chiv",
        amount: "3",
        unit: "g",
        ingredientName: "Chive",
        variationName: "Unknown origin, Conventional",
        locator: "#variations",
      },
      {
        searchName: "mayo",
        amount: "4",
        unit: "tbsp",
        ingredientName: "Mayonnaise",
        variationName: "Netherlands, Conventional",
      },
      {
        searchName: "butter",
        amount: "40",
        unit: "g",
        ingredientName: "Butter, extra salted",
        variationName: "Finland, Organic",
      },
      {
        searchName: "lobst",
        amount: "90",
        unit: "g",
        ingredientName: "Lobster",
        variationName: "Sweden, Conventional",
      },
    ],
  },
};

export default recipes;
