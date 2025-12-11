import { Parser } from './classes';
import { IParserInfo } from './types';
import { BASE_URL } from './const';

const main = async () => {
	const parser = new Parser(BASE_URL + '/wiki/parsers/');
	await parser.run();
};

if (require.main === module) {
	main().catch(console.error);
}

export { Parser, IParserInfo };
