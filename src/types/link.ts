export type LinkObject = {
	id: string;
	redirect_to: string;
	shortened: string;
	expires_at: string | null;
	created_at: string;
	updated_at: string;
	created_by: string;
	secret_key: {
		key: string;
		name: string;
	};
	visits: number;
	last_visited_at: string | null;
	is_active: boolean;
};
