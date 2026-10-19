const getFromPath = (object: Record<string, unknown>, path: Array<string>) => {
	if (path.length === 0) return object;
	const [currentKey, ...restPath] = path;
	if (!object[currentKey]) return undefined;
	return getFromPath(object[currentKey] as Record<string, unknown>, restPath);
};

export const getObjectDotString = (path: string, object: Record<string, unknown>) => {
	const splitPath = path.split('.');
	return getFromPath(object, splitPath);
};

export { getFromPath };
