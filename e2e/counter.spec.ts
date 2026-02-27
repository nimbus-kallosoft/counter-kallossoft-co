import { test, expect } from "@playwright/test";

test.describe("Counter App", () => {
  test("homepage loads with counter display", async ({ page }) => {
    await page.goto("/");

    // Page title contains "Counter"
    await expect(page).toHaveTitle(/Counter/);

    // "Visits" label is visible
    await expect(page.getByText("Visits")).toBeVisible();
  });

  test("counter shows a number after loading", async ({ page }) => {
    await page.goto("/");

    // The counter element starts as "—" (loading) then becomes a number
    const counter = page.locator("main").locator("div").first();
    await expect(counter).toBeVisible();

    // Wait for the loading placeholder to be replaced with a number
    await expect(async () => {
      const text = await counter.textContent();
      expect(text).not.toBe("—");
      expect(text).toMatch(/^[\d,]+$/); // number, possibly with commas
    }).toPass({ timeout: 15_000 });
  });

  test("visit increments the counter on reload", async ({ page }) => {
    await page.goto("/");

    // Wait for the counter to load
    const counter = page.locator("main").locator("div").first();
    await expect(async () => {
      const text = await counter.textContent();
      expect(text).toMatch(/^[\d,]+$/);
    }).toPass({ timeout: 15_000 });

    const firstCount = parseInt((await counter.textContent())!.replace(/,/g, ""), 10);

    // Reload to trigger another visit
    await page.reload();

    // Wait for the counter to load again
    await expect(async () => {
      const text = await counter.textContent();
      expect(text).toMatch(/^[\d,]+$/);
    }).toPass({ timeout: 15_000 });

    const secondCount = parseInt((await counter.textContent())!.replace(/,/g, ""), 10);

    // Count should have incremented
    expect(secondCount).toBeGreaterThan(firstCount);
  });

  test("API GET /api/visit returns count as JSON", async ({ request }) => {
    const response = await request.get("/api/visit");
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty("count");
    expect(typeof body.count).toBe("number");
    expect(body.count).toBeGreaterThanOrEqual(0);
  });

  test("API POST /api/visit increments and returns count", async ({ request }) => {
    // Get the current count
    const getBefore = await request.get("/api/visit");
    const before = await getBefore.json();

    // Increment via POST
    const postRes = await request.post("/api/visit");
    expect(postRes.status()).toBe(200);

    const postBody = await postRes.json();
    expect(postBody).toHaveProperty("count");
    expect(postBody.count).toBeGreaterThan(before.count);
  });
});
