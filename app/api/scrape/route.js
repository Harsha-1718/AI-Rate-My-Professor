import { NextResponse } from 'next/server';
import { chromium } from 'playwright';

export async function GET() {
  const requestId = Math.random().toString(36).substring(7);  // Generate a unique ID for each request
  console.log(`Scraping process started: Request ID ${requestId}`);

  const browser = await chromium.launch({ headless: true });  // Headless mode for better performance
  const page = await browser.newPage();
  const url = 'https://www.ratemyprofessors.com/professor/2538387';  // Single professor page URL

  try {
    // Navigate to the professor's page and wait for the page to fully load
    await page.goto(url, { timeout: 120000, waitUntil: 'domcontentloaded' });

    // Close any modals or overlays that might appear
    try {
      const modalCloseButton = await page.$('button:has-text("Close"), .FullPageModal__StyledFullPageModal-sc-1tziext-1 .fyxlwo, .CCPAModal__CCPAPromptBody-sc-10x9kq-1 .elfcka');
      if (modalCloseButton) {
        await modalCloseButton.click();
        await page.waitForTimeout(1000);  // Wait for the modal to close
      }
    } catch (error) {
      console.log('No modal to close or error closing modal:', error);
    }

    // Extract professor overview information
    const professorInfo = await page.evaluate(() => {
      const name = document.querySelector('.NameTitle__Name-dowf0z-0')?.innerText.trim() || 'N/A';
      const rating = document.querySelector('.RatingValue__Numerator-qw8sqy-2')?.innerText.trim() || 'N/A';
      const department = document.querySelector('.NameTitle__Title-dowf0z-1')?.innerText.trim() || 'N/A';
      const university = document.querySelector('.NameTitle__Title-dowf0z-2')?.innerText.trim() || 'N/A';
      const wouldConsider = document.querySelector('.FeedbackItem__FeedbackNumber-uof32n-1')?.innerText.trim() || 'N/A';
      const difficulty = document.querySelector('.FeedbackItem__StyledFeedbackItem-uof32n-0')?.nextElementSibling?.innerText.trim() || 'N/A';
      const numberOfReviews = document.querySelector('.RatingValue__NumRatings-qw8sqy-0')?.innerText.trim() || 'N/A';

      return {
        name,
        rating,
        department,
        university,
        wouldConsider,
        difficulty,
        numberOfReviews,
      };
    });

    // Loop to click the "Load More Ratings" button until it no longer appears
    let loadMoreButton;
    while (true) {
      loadMoreButton = await page.$('button:has-text("Load More Ratings")');
      if (!loadMoreButton) break;
      await loadMoreButton.click();
      await page.waitForTimeout(3000);  // Wait for new reviews to load
    }

    // Wait for the specific reviews section to load
    await page.waitForSelector('.TeacherRatingTabs__StyledTabPage-pnmswv-3.SjINA', { timeout: 60000 });

    // Extract the reviews
    const reviews = await page.evaluate(() => {
      const reviewElements = document.querySelectorAll('.TeacherRatingTabs__StyledTabPage-pnmswv-3.SjINA li');

      return Array.from(reviewElements)
        .map(review => {
          const reviewTextElement = review.querySelector('div[class*="Comments__StyledComments"]');
          const reviewText = reviewTextElement ? reviewTextElement.innerText.trim() : '';

          // Filter out reviews that are empty or contain "N/A"
          if (reviewText === '' || reviewText === 'N/A') {
            return null;
          }

          return {
            reviewText,
          };
        })
        .filter(review => review !== null);  // Remove null values from the array
    });

    // Log the number of reviews
    console.log(`Total number of reviews scraped: ${reviews.length}`);

    console.log(`Scraping process finished: Request ID ${requestId}`, { professorInfo, reviews });

    return NextResponse.json({ professorInfo, reviews });

  } catch (error) {
    console.error(`Error during scraping: Request ID ${requestId}`, error);
    return NextResponse.json({ message: 'Failed to scrape the data.', error: error.message });
  } finally {
    await browser.close();
  }
}