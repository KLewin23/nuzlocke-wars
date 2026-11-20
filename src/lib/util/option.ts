interface Some<Data> {
	_type: 'some';
	data: Data
}

interface None {
	_type: 'none';
}

type Option<Data> = Some<Data> | None;

const someOf = <Data>(data: Data): Some<Data> => ({ _type: 'some', data });
const none: None = { _type: 'none' };

export { someOf, none };

export type { Option, Some, None };
