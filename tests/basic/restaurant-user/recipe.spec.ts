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

  await page.getByText("visibility_off").click();

  await expect(
    page
      .locator("div")
      .filter({ hasText: /^httpsPasswordvisibilityerror$/ })
      .getByPlaceholder(" ")
  ).toHaveValue(process.env.RU_BASIC_PASSWORD as string);

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

test.describe("New Recipe", () => {
  test("should create a new recipe", async ({ page }, { testId }) => {
    await page.getByRole("link", { name: "restaurant" }).click();
    await page.getByRole("button", { name: "New recipe" }).click();

    const { name, ingredients } = recipes["meatballs-mashed-potatoes"];

    for (const ingredient of ingredients) {
      await addIngredient(page, `${name}: ${testId}`, ingredient);
    }

    await page.getByRole("button", { name: "Save recipe" }).click();
    await page.getByRole("button", { name: "Save and continue" }).click();
  });
  test("should create a 2nd new recipe through 'Quick start'", async ({ page }, { testId }) => {
    await page.getByRole("link", { name: "restaurant" }).click();
    await page.getByRole("button", { name: "New recipe" }).click();

    const { name, ingredients } = recipes["mini-lobster-roll"];

    for (const ingredient of ingredients) {
      await addIngredient(page, `${name}: ${testId}`, ingredient);
    }

    await page.getByRole("button", { name: "Save recipe" }).click();
    await page.getByRole("button", { name: "Save and continue" }).click();
  });
});

async function addIngredient(page: Page, recipeName: string, ingredientData: Ingredient) {
  const { searchName, ingredientName, variationName, amount, unit, exact, locator } = ingredientData;

  await expect(page.getByRole("button", { name: "Add ingredient" })).toBeDisabled();

  await page.getByPlaceholder("Recipe name").fill(recipeName);
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

async function isIngredientHeadingVisible(page: Page, ingredientName: string) {
  expect(page.getByRole("heading", { name: ingredientName })).toBeVisible();
}

// test('has title', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Expect a title "to contain" a substring.
//   await expect(page).toHaveTitle(/Playwright/);
// });

// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
// });

// await expect(page.getByRole("button", { name: "Add ingredient" })).toBeDisabled();

// await page
//   .getByPlaceholder("Recipe name")
//   .fill("1-TEST-EN: Meatballs with mashed potatoes & lingonberry jam & gravy");

// await page.getByPlaceholder(" ").nth(2).fill("meatbal");
// await page.getByText("Meatballs halal", { exact: true }).click();
// await page.getByText("UK, Conventional").click();
// await page
//   .locator("div")
//   .filter({ hasText: /^Amounterrorgarrow_drop_downUnit$/ })
//   .getByPlaceholder(" ")
//   .fill("100");

// await expect(page.getByRole("button", { name: "Add ingredient" })).toBeEnabled();

// await page.getByRole("button", { name: "Add ingredient" }).click();
