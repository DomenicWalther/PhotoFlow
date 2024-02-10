/**
 * Returns a custom comparison function for sorting an array of objects by a specified field.
 * @param {string} field - The field by which to sort the array of objects.
 * @param {boolean|number} reverse - Optional. Indicates whether to sort in reverse order. Defaults to false (ascending order).
 * @param {Function} primer - Optional. A function to transform each element's field value before comparison.
 * @returns {Function} - A comparison function to be used with the Array.prototype.sort() method.
 * 
 * The returned comparison function compares two objects from the array based on the specified field.
 * If a primer function is provided, it transforms the field values before comparison.
 * Sorting order (ascending/descending) is determined by the 'reverse' parameter.

 */

export const sort_by = (field, reverse: Boolean | Number, primer: Function) => {
	const key = primer
		? function (x) {
				return primer(x[field]);
		  }
		: function (x: Object) {
				return x[field];
		  };

	reverse = !reverse ? 1 : -1;

	return function (a, b) {
		return (a = key(a)), (b = key(b)), reverse * ((a > b) - (b > a));
	};
};
