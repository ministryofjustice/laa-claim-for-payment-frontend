import { test, expect } from '../fixtures/index.js';
import { ChooseUploadPage } from '../pages/ChooseUpload.js';

test('choose upload page displays radio options', async ({ page, checkAccessibility }) => {
  const chooseUploadPage = new ChooseUploadPage(page);

  await chooseUploadPage.navigate();
  await chooseUploadPage.waitForLoad();

  await expect(chooseUploadPage.form).toBeVisible();

  await expect(
    page.getByRole('heading', {
      name: 'How do you want to upload your evidence screen?',
    })
  ).toBeVisible();

  await expect(chooseUploadPage.allAtOnceOption).toBeVisible();
  await expect(
    page.getByText(
      'Upload evidence all at once, without associating it to specific work items or disbursements'
    )
  ).toBeVisible();

  await expect(chooseUploadPage.associatedToLineItemsOption).toBeVisible();
  await expect(
    page.getByText(
      'Upload evidence individually, and associate specific evidence with individual work items or disbursements. This makes it less likely that your claim will be ejected due to a lack of documentation'
    )
  ).toBeVisible();

  await checkAccessibility();
});

test('choose upload page shows an error when no option is selected', async ({ page, checkAccessibility }) => {
  const chooseUploadPage = new ChooseUploadPage(page);

  await chooseUploadPage.navigate();
  await chooseUploadPage.submit();

  await expect(chooseUploadPage.errorSummary).toBeVisible();
  await expect(chooseUploadPage.errorSummary).toContainText(
    'Select how you want to upload your evidence'
  );

  await expect(chooseUploadPage.inlineError).toBeVisible();
  await expect(chooseUploadPage.inlineError).toContainText(
    'Select how you want to upload your evidence'
  );

  await checkAccessibility();
});

test('choose upload page redirects when all at once is selected', async ({ page }) => {
  const chooseUploadPage = new ChooseUploadPage(page);

  await chooseUploadPage.navigate();
  await chooseUploadPage.chooseAllAtOnce();
  await chooseUploadPage.submit();

  await expect(page).toHaveURL(/all-at-once-file-upload/);
});

test('choose upload page redirects when associated to line items is selected', async ({ page }) => {
  const chooseUploadPage = new ChooseUploadPage(page);

  await chooseUploadPage.navigate();
  await chooseUploadPage.chooseAssociatedToLineItems();
  await chooseUploadPage.submit();

  await expect(page).toHaveURL(/multiple-file-upload/);
});