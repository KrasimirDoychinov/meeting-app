export class GlobalErrorHelper {
	static areFieldsNotNull = (arr: any[]): boolean => {
		if (arr.some((x: any) => !x)) {
			return true;
		}

		return false;
	};
}
