export type Task = {
	id: number;
	name: string;
	dueAt: Date;
	status: string;
	additional_information: string;
	is_finished: boolean;
	taskColumn: number;
	orderPath?: string;
};
