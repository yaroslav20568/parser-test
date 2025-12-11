import { Parser, WordCounter } from './classes';
import { IParserInfo } from './types';
import { BASE_URL } from './const';

const main = async () => {
	const parser = new Parser(BASE_URL + '/wiki/parsers/');
	const wordCounter = new WordCounter(BASE_URL);

	await parser.run();
	await wordCounter.run();
};

if (require.main === module) {
	main().catch(console.error);
}

export { Parser, IParserInfo };
