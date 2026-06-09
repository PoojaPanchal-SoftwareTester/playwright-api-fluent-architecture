import {test ,expect} from '@playwright/test';

test('First test', async({page})=>{
    await page.goto("https://playwright.dev/");

    await page.getByRole('button', { name: 'Search (Control+k)' }).click();
    await page.getByRole('searchbox', { name: 'Search' }).fill('fixture');
    await page.getByRole('searchbox', { name: 'Search' }).press('Enter');
   // await page.getByRole('link', { name: 'Docs' }).click();


   //await  expect(page.getByRole('heading',{name: "Introduction"})).toBeVisible();
})