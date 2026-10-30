const dateAsSimpleString = (date: Date) =>
	`${date.getFullYear()}${date.getMonth()}${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}`;

export default dateAsSimpleString;
