export class GlobalErrorHelper {
	static areFieldsNotNull = (arr: any[]): boolean => {
		if (arr.some((x: any) => !x || x?.length === 0)) {
			return true;
		}

		return false;
	};
}
