import { test, expect } from '@playwright/test'

test('generates, regenerates and starts a race', async ({ page }) => {
  await page.goto('/')

  await expect(page.locator('h1')).toHaveText('Horse Racing')
  await expect(page.getByRole('tab', { name: 'Program' }).filter({ visible: true })).toBeVisible()

  const rosterRows = page.locator('[data-slot="horse-roster-row"]')
  await expect(rosterRows).toHaveCount(20)

  const generate = page.getByRole('button', { name: 'Generate program' })

  await generate.click()
  await expect(rosterRows).toHaveCount(20)

  await page.getByRole('button', { name: 'Start Race' }).click()
  await expect(generate).toBeDisabled()

  await page.getByRole('button', { name: 'Pause' }).click()
  await expect(generate).toBeEnabled()

  await page.getByRole('button', { name: 'Resume' }).click()
  await expect(generate).toBeDisabled()
})

test('runs all six rounds and records results', async ({ page }) => {
  await page.goto('/?speed=120')

  await page.getByRole('button', { name: 'Start Race' }).click()
  await expect(page.locator('[data-phase="FINISHED"]')).toBeVisible({ timeout: 30_000 })

  const generate = page.getByRole('button', { name: 'Generate program' })
  await expect(generate).toBeEnabled()
  await expect(page.locator('header').getByText('Finished')).toBeVisible()

  await page
    .getByRole('tab', { name: 'Results' })
    .filter({ visible: true })
    .click()

  await expect(page.getByText('Final')).toHaveCount(6)
})
