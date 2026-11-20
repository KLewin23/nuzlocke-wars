import { expect } from '@jest/globals';
import { none, someOf } from '@/util/option';

import segmentString from '../segmentString';

describe('segmentString', () => {
	it('should split a simple string into the correct segments based on a delimiter', () => {
		const result = segmentString('Lion/23/Africa', '/', ['animal', 'age', 'country']);
		expect(result).toStrictEqual({
			animal: someOf('Lion'),
			age: someOf('23'),
			country: someOf('Africa'),
		});
	});
	it('should ignore remaining string once segments are filled', () => {
		const result = segmentString('Lion/23/Africa', '/', ['animal', 'age']);
		expect(result).toStrictEqual({
			animal: someOf('Lion'),
			age: someOf('23'),
		});
	});
	it('should return none on attributes that cannot be filled', () => {
		const result = segmentString('Lion/23/Africa', '/', ['animal', 'age', 'country', 'colour', 'type']);
		expect(result).toStrictEqual({
			animal: someOf('Lion'),
			age: someOf('23'),
			country: someOf('Africa'),
			colour: none,
			type: none,
		});
	});
	it('should return none on all attributes when provided an empty string', () => {
		const result = segmentString('', '/', ['animal', 'age']);
		expect(result).toStrictEqual({
			animal: none,
			age: none,
		});
	});
	it('should return an none for all segments when given a single delimiter', () => {
		const result = segmentString('/', '/', ['animal', 'age']);
		expect(result).toStrictEqual({
			animal: none,
			age: none,
		});
	});
	it('should return an none for all segments when given a multiple of the delimiter', () => {
		const result = segmentString('///', '/', ['animal', 'age', 'country']);
		expect(result).toStrictEqual({
			animal: none,
			age: none,
			country: none,
		});
	});
});
