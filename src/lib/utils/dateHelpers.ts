export const getDay30DaysBack = () => {
	return new Date(new Date().setDate(new Date().getDate() - 30)).toISOString();
};
