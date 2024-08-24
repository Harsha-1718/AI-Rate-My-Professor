// pages/api/scrape.js
import { NextResponse } from 'next/server';
import { chromium } from 'playwright';

export async function POST(req) {
  
  const { url } = await req.json();
  console.log(url)
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(url, { timeout: 120000, waitUntil: 'domcontentloaded' });

    const professorInfo = await page.evaluate(() => {
      const name = document.querySelector('.NameTitle__Name-dowf0z-0')?.innerText.trim() || 'N/A';
      const rating = document.querySelector('.RatingValue__Numerator-qw8sqy-2')?.innerText.trim() || 'N/A';
      const department = document.querySelector('.NameTitle__Title-dowf0z-1')?.innerText.trim() || 'N/A';
      const university = document.querySelector('.NameTitle__Title-dowf0z-2')?.innerText.trim() || 'N/A';

      return { name, rating, department, university };
    });

    const reviews = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.TeacherRatingTabs__StyledTabPage-pnmswv-3.SjINA li'))
        .map(review => {
          const reviewTextElement = review.querySelector('div[class*="Comments__StyledComments"]');
          const reviewText = reviewTextElement ? reviewTextElement.innerText.trim() : '';

          if (reviewText === '' || reviewText === 'N/A') {
            return null;
          }

          return { reviewText };
        })
        .filter(review => review !== null);
    });

    return NextResponse.json({ professorInfo, reviews });

  } catch (error) {
    console.error('Error during scraping:', error);
    return NextResponse.json({ message: 'Failed to scrape the data.', error: error.message });
  } finally {
    await browser.close();
  }
}
