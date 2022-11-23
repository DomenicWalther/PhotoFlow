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
