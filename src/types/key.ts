export type KeyObject = {
	key: string;
	name: string;
	created_at: string;
	updated_at: string;
	is_active: boolean;
	is_admin: boolean;
};

export type ValidateKeyResponse = {
	message?: string;
	key?: KeyObject;
};
