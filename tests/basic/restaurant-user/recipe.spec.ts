import { test, expect, Page } from "@playwright/test";
import recipes, { Ingredient } from "./mockRecipes";

test.beforeEach("Accept cookie and sign in", async ({ page }, testInfo) => {
  console.log(`Running test: ${testInfo.title}`);
  console.log(`Worker index: ${testInfo.workerIndex}`);
  console.log(`Test ID: ${testInfo.testId}`);

  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Mmmm... cookies!" })).toBeVisible();

  await page.getByRole("button", { name: "Accept cookies" }).click();

  await page.locator('input[type="text"]').fill(process.env.RU_BASIC_EMAIL as string);
  await page.locator('input[type="password"]').fill(process.env.RU_BASIC_PASSWORD as string);

  await page.getByRole("button", { name: "Log in" }).click();
});

test.describe("User Profile", () => {
  test("should show basic restaurant", async ({ page }) => {
    await expect(page.locator("ul").filter({ hasText: "The Basic Restaurant" })).toBeVisible();
  });

  test("should show basic organisation", async ({ page }) => {
    await expect(page.locator("ul").filter({ hasText: "The Basic Organisation" })).toBeVisible();
  });
});

test.describe("Display information", () => {
  test("should display breadcrumbs for the chosen library", async ({ page }) => {
    await page.getByText("Calculate a recipe").click();
    await page.locator("#userpilot-restaurant-indicator").getByText("The Basic Restaurant").hover();
    await expect(page.getByRole("heading", { name: "Restaurant library" })).toContainText("Restaurant library");
  });

  test("should display emission data for Sweden", async ({ page }) => {
    await page.getByText("Calculate a recipe").click();
    await page.locator(".database-indicator-chip").hover();
    await expect(page.getByText("Emission data for Sweden is provided by the Klimato database.")).toBeVisible();
  });

  test("should display the calculated carbon emission", async ({ page }) => {
    await page.getByText("Calculate a recipe").click();

    const { name, ingredients } = recipes["meatballs-mashed-potatoes"];

    for (const ingredient of ingredients) {
      await addIngredient(page, name, ingredient);
      await isIngredientHeadingVisible(page, ingredient);
    }

    await expect(page.locator("svg").filter({ hasText: "0.0" })).not.toBeEmpty();
  });
});

test.describe("Recipes Overview", () => {
  test("should search for a specific recipe", async ({ page }) => {
    await page.getByRole("link", { name: "restaurant" }).click();

    await page.getByPlaceholder("Search").fill("diavol");
    await expect(page.getByRole("cell", { name: "Pizza Diavola" })).toBeVisible();
  });
});

test.describe("Create Recipe", () => {
  test("should create a new recipe", async ({ page }) => {
    await page.getByRole("link", { name: "restaurant" }).click();
    await page.getByRole("button", { name: "New recipe" }).click();

    const { name, ingredients } = recipes["meatballs-mashed-potatoes"];

    for (const ingredient of ingredients) {
      await addIngredient(page, name, ingredient);
      await isIngredientHeadingVisible(page, ingredient);
    }

    await saveRecipe(page);
  });

  test("should create a 2nd new recipe through 'Quick start'", async ({ page }) => {
    await page.getByText("Calculate a recipe").click();

    const { name, ingredients } = recipes["mini-lobster-roll"];

    for (const ingredient of ingredients) {
      await addIngredient(page, name, ingredient);
      await isIngredientHeadingVisible(page, ingredient);
    }

    await saveRecipe(page);
  });
});

test.skip("Delete Recipe", () => {
  test("should delete lobster roll recipe", async ({ page }) => {
    await page.getByRole("link", { name: "restaurant" }).click();

    const { name } = recipes["mini-lobster-roll"];

    const selectedRecipeName = await page.getByRole("cell", { name: name }).first().innerText();

    await page.getByRole("cell", { name: name }).first().click();
    await page.locator(".modal-container > .container").getByText("more_vert").click();

    await page.getByText("Delete", { exact: true }).click();
    await page.getByRole("button", { name: "Delete" }).click();

    await expect(page.getByRole("cell", { name: selectedRecipeName })).toBeHidden();
  });
});

async function addIngredient(page: Page, recipeName: string, ingredientData: Ingredient) {
  const { searchName, ingredientName, variationName, amount, unit, locator } = ingredientData;

  await expect(page.getByRole("button", { name: "Add ingredient" })).toBeDisabled();

  await page.getByPlaceholder("Recipe name").fill(`${recipeName} - ${getCurrentTime()}`);
  await page.getByPlaceholder(" ").nth(2).fill(searchName);
  await page.getByText(ingredientName, { exact: true }).click();

  if (locator) {
    await page.locator(locator).getByText(variationName).click();
  } else {
    await page.getByText(variationName).click();
  }

  await page
    .locator("div")
    .filter({ hasText: /^Amounterrorgarrow_drop_downUnit$/ })
    .getByPlaceholder(" ")
    .fill(amount);

  if (unit !== "g") {
    await page.getByText("g", { exact: true }).click();
    await page.getByText(unit);
  }

  await expect(page.getByRole("button", { name: "Add ingredient" })).toBeEnabled();

  await page.getByRole("button", { name: "Add ingredient" }).click();
}

async function saveRecipe(page: Page) {
  await page.getByRole("button", { name: "Save recipe" }).click();
  await page.getByRole("button", { name: "Save and continue" }).click();
  await page.getByText("View here.").click();
}

async function isIngredientHeadingVisible(page: Page, { ingredientName }: { ingredientName: string }) {
  expect(page.getByRole("heading", { name: ingredientName })).toBeVisible();
}

function getCurrentTime() {
  const now = new Date();

  const h = now.getHours().toString().padStart(2, "0");
  const m = now.getMinutes().toString().padStart(2, "0");
  const s = now.getSeconds().toString().padStart(2, "0");

  return `${h}:${m}:${s}`;
}
