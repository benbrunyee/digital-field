import { readFile, rm } from 'fs/promises';
import puppeteer from 'puppeteer';
import { createId } from '../../util/createId';

export async function htmlToPdf(html: string) {
	const browser = await puppeteer.launch({
		headless: 'new'
	});

	const pdfFileName = createId('pdf') + '.pdf';

	const page = await browser.newPage();

	await page.setJavaScriptEnabled(false);
	await page.setContent(html);
	await page.emulateMediaType('screen');
	await page.pdf({
		path: pdfFileName,
		format: 'A4',
		printBackground: true
	});

	await browser.close();

	const pdf = await readFile(pdfFileName, { encoding: 'base64' });
	await rm(pdfFileName);

	return pdf;
}
