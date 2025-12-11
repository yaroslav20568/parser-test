import * as path from 'path';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { FileService } from './FileService';
import { IWordsInfo } from '../types';

export class WordCounter {
	private url: string;
	private fileService: FileService;
	private outputPath: string;

	constructor(url: string) {
		this.url = url;
		this.outputPath = path.join(__dirname, '..', 'results', 'words-info.json');
		this.fileService = new FileService('');
	}

	async countWords(): Promise<number> {
		const html = await this.fetchHtml(this.url);
		const text = this.extractText(html);
		const words = this.extractWords(text);
		return words.filter((word) => word.length > 3).length;
	}

	async save(wordCount: number): Promise<void> {
		const wordsInfo: IWordsInfo = {
			url: this.url,
			count: wordCount,
			description: 'Количество слов длиной более 3 символов на главной странице',
		};
		await this.fileService.saveWordsInfo(wordsInfo, this.outputPath);
	}

	async run(): Promise<void> {
		try {
			const wordCount = await this.countWords();
			await this.save(wordCount);
		} catch (error) {
			console.error('Ошибка при подсчете слов:', error);
			throw error;
		}
	}

	private async fetchHtml(url: string): Promise<string> {
		const response = await axios.get(url, {
			headers: {
				'User-Agent':
					'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
			},
		});
		return response.data;
	}

	private extractText(html: string): string {
		const $ = cheerio.load(html);
		$('script').remove();
		$('style').remove();
		$('noscript').remove();
		return $('body').text() || $.text();
	}

	private extractWords(text: string): string[] {
		return text
			.replace(/[^\p{L}\p{N}\s]/gu, ' ')
			.split(/\s+/)
			.filter((word) => word.trim().length > 0);
	}
}
