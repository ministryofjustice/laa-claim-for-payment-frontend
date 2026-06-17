import { expect, test } from "../fixtures/index.js";

test("page should have the correct title", async ({ page }) => {
  await page.goto("/claims/1/poa-submitted");

  await expect(page).toHaveTitle(
    "Payment on account submitted – Claim for controlled work – GOV.UK",
  );
});

test("page displays the correct content", async ({
  pages,
  checkAccessibility,
}) => {
  const page = pages.poaSubmissionSuccessfulPage(1);

  await page.navigate();
  await page.waitForLoad();

  const heading = page.heading;
  await expect(heading).toBeVisible();
  await expect(heading).toHaveText("Payment on account submitted");

  const whatHappensNextHeading = page.whatHappensNextHeading;
  await expect(whatHappensNextHeading).toBeVisible();
  await expect(whatHappensNextHeading).toHaveText("What happens next");

  const firstParagraph = page.firstParagraph;
  await expect(firstParagraph).toBeVisible();
  await expect(firstParagraph).toHaveText(
    "We are processing this POA and you will receive a decision shortly.",
  );

  const secondParagraph = page.secondParagraph;
  await expect(secondParagraph).toBeVisible();
  await expect(secondParagraph).toHaveText(
    "You can view the guidance on processing timescales for more information.",
  );
  await expect(secondParagraph.getByRole("link")).toHaveText(
    "guidance on processing timescales",
  );

  const thirdParagraph = page.thirdParagraph;
  await expect(thirdParagraph).toBeVisible();
  await expect(thirdParagraph).toHaveText("Your account will be updated.");

  const fourthParagraph = page.fourthParagraph;
  await expect(fourthParagraph).toBeVisible();
  await expect(fourthParagraph).toHaveText("Return to claim summary page");
  await expect(fourthParagraph.getByRole("link")).toHaveText(
    "Return to claim summary page",
  );

  await checkAccessibility();
});
