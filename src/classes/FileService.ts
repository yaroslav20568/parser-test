import * as fs from 'fs';
import * as path from 'path';
import { IParserInfo, IWordsInfo } from '../types';

export class FileService {
	private outputPath: string;

	constructor(outputPath: string) {
		this.outputPath = outputPath;
	}

	async save(parsers: IParserInfo[]): Promise<void> {
		const dir = path.dirname(this.outputPath);
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true });
		}
		const json = JSON.stringify(parsers, null, 2);
		fs.writeFileSync(this.outputPath, json, 'utf-8');
		console.log(`Результаты сохранены в: ${this.outputPath}`);
		console.log(`Всего сохранено: ${parsers.length} парсеров`);
	}

	async saveWordsInfo(wordsInfo: IWordsInfo, outputPath: string): Promise<void> {
		const dir = path.dirname(outputPath);
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true });
		}
		const json = JSON.stringify(wordsInfo, null, 2);
		fs.writeFileSync(outputPath, json, 'utf-8');
		console.log(`Информация о словах сохранена в: ${outputPath}`);
	}
}
