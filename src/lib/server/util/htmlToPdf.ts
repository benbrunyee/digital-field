import { readFile, rm } from 'fs/promises';
import puppeteer from 'puppeteer';

export async function htmlToPdf(html: string) {
	const browser = await puppeteer.launch({
		headless: 'new'
	});

	const page = await browser.newPage();

	await page.setContent(html);
	await page.emulateMediaType('screen');
	await page.pdf({
		path: 'test.pdf',
		format: 'A4',
		printBackground: true
	});

	await browser.close();

	const pdf = await readFile('test.pdf', { encoding: 'base64' });
	await rm('test.pdf');

	return pdf;
}
