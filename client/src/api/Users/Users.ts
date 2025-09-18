import type { User, UserDetail } from "../../types/Users/users";
import { Client, extractErrorMessage } from "../Client/Client";


// GET /users
export async function getUsers(): Promise<User[]> {
	try {
		const res = await Client.get<User[]>("/users");
		return res.data ?? [];
	} catch (error) {
		console.error(
			"Failed to get users:",
			extractErrorMessage(error, "Failed to get users")
		);
		return [];
	}
}

// GET /users/:msisdn
export async function getUserDetail(msisdn: string): Promise<UserDetail | null> {
	try {
		const res = await Client.get<UserDetail>(`/users/${msisdn}`);
		return res.data ?? null;
	} catch (error) {
		console.error(
			"Failed to get user detail:",
			extractErrorMessage(error, "Failed to get user detail")
		);
		return null;
	}
}

// DELETE /users/:msisdn
export async function deleteUser(msisdn: string): Promise<boolean> {
	try {
		await Client.delete(`/users/${msisdn}`);
		return true;
	} catch (error) {
		console.error(
			"Failed to delete user:",
			extractErrorMessage(error, "Failed to delete user")
		);
		return false;
	}
}

