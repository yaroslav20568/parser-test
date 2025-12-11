import puppeteer, { Browser, Page } from 'puppeteer';

export class BrowserService {
	private browser: Browser | null = null;
	private page: Page | null = null;

	async launch(): Promise<void> {
		this.browser = await puppeteer.launch({
			headless: 'new',
			args: ['--no-sandbox', '--disable-setuid-sandbox'],
		});
	}

	async createPage(): Promise<Page> {
		if (!this.browser) {
			throw new Error('Браузер не запущен');
		}
		this.page = await this.browser.newPage();
		await this.page.setUserAgent(
			'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
		);
		return this.page;
	}

	async navigateTo(url: string): Promise<void> {
		if (!this.page) {
			throw new Error('Страница не создана');
		}
		console.log(`Загрузка страницы: ${url}`);
		await this.page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
		await this.page.waitForTimeout(3000);
	}

	async getPageContent(): Promise<string> {
		if (!this.page) {
			throw new Error('Страница не создана');
		}
		return await this.page.content();
	}

	async close(): Promise<void> {
		if (this.browser) {
			await this.browser.close();
			this.browser = null;
			this.page = null;
		}
	}
}
