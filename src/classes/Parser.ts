import * as path from 'path';
import { BrowserService } from './BrowserService';
import { DataExtractor } from './DataExtractor';
import { FileService } from './FileService';
import { IParserInfo } from '../types';

export class Parser {
	private url: string;
	private browserService: BrowserService;
	private dataExtractor: DataExtractor;
	private fileService: FileService;

	constructor(url: string) {
		this.url = url;
		const outputPath = path.join(__dirname, '..', 'results', 'parsers-info.json');
		this.browserService = new BrowserService();
		this.dataExtractor = new DataExtractor();
		this.fileService = new FileService(outputPath);
	}

	async parse(): Promise<IParserInfo[]> {
		try {
			await this.browserService.launch();
			await this.browserService.createPage();
			await this.browserService.navigateTo(this.url);

			const html = await this.browserService.getPageContent();
			const parsers = this.dataExtractor.extractParsersFromHtml(html);

			console.log(`Найдено парсеров: ${parsers.length}`);

			return parsers;
		} finally {
			await this.browserService.close();
		}
	}

	async save(parsers: IParserInfo[]): Promise<void> {
		await this.fileService.save(parsers);
	}

	async run(): Promise<void> {
		try {
			const parsers = await this.parse();
			await this.save(parsers);
		} catch (error) {
			console.error('Ошибка при выполнении парсинга:', error);
			throw error;
		}
	}
}
