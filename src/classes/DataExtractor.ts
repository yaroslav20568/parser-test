import * as cheerio from 'cheerio';
import { IParserInfo } from '../types';

export class DataExtractor {
	extractParserName = (text: string): string | null => {
		const match = text.match(/([A-Za-z0-9_]+(?:::[A-Za-z0-9_]+)+)/);
		return match ? match[1] : null;
	};

	extractParsersFromHtml = (html: string): IParserInfo[] => {
		const $ = cheerio.load(html);
		const parsers: IParserInfo[] = [];
		const seenNames = new Set<string>();

		const nameElements = $(
			'div.text-xl.font-semibold, div[class*="text-xl"][class*="font-semibold"], div.text-xl.font-semibold.mt-4, div[class*="text-xl"][class*="font-semibold"][class*="mt-4"]',
		);
		console.log(`Найдено элементов с названиями: ${nameElements.length}`);

		let skippedNoName = 0;
		let skippedDuplicate = 0;
		let skippedNoDescription = 0;

		nameElements.each((_, nameEl) => {
			const $nameEl = $(nameEl);
			let nameText = $nameEl.html() || $nameEl.text();
			nameText = nameText
				.replace(/<wbr\s*\/?>/gi, '')
				.replace(/<[^>]+>/g, '')
				.trim()
				.replace(/\s+/g, '');
			const fullName = this.extractParserName(nameText);

			if (!fullName) {
				skippedNoName++;
				return;
			}

			if (seenNames.has(fullName)) {
				skippedDuplicate++;
				return;
			}

			seenNames.add(fullName);
			const name = fullName;

			const $parent = $nameEl.parent();
			let description = '';

			const nameElIndex = $nameEl.index();
			const $allChildren = $parent.children();

			for (let i = nameElIndex + 1; i < $allChildren.length; i++) {
				const $child = $($allChildren[i]);
				if ($child.is('p')) {
					description = $child.text().trim();
					break;
				}
			}

			if (!description) {
				const $nextP = $nameEl.nextAll('p').first();
				if ($nextP.length > 0) {
					description = $nextP.text().trim();
				}
			}

			if (!description) {
				const $description = $parent
					.find('p.text-sm.mt-1, p[class*="text-sm"][class*="mt-1"]')
					.first();
				if ($description.length > 0) {
					description = $description.text().trim();
				}
			}

			if (!description || description.length < 10) {
				skippedNoDescription++;
				return;
			}

			if (description && description.length >= 10) {
				parsers.push({ name, description });
			} else {
				skippedNoDescription++;
			}
		});

		console.log(`Пропущено без названия: ${skippedNoName}`);
		console.log(`Пропущено дубликатов: ${skippedDuplicate}`);
		console.log(`Пропущено без описания: ${skippedNoDescription}`);

		return parsers;
	};
}
