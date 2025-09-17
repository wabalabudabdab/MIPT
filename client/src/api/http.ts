const baseURL = ((import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3000') + '/api';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
	const url = `${baseURL}${endpoint}`;

	const config: RequestInit = {
		...options,
		headers: {
			'Content-Type': 'application/json',
			...options.headers,
		},
	};

	try {
		const response = await fetch(url, config);

		if (!response.ok) {
			const error = await response.json().catch(() => ({ message: 'Request failed' }));
			throw new Error(error.message || `HTTP ${response.status}`);
		}

		return await response.json();
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
		throw new Error('Network error occurred');
	}
}

export const http = {
	async get<T>(endpoint: string, params?: Record<string, any>): Promise<{ data: T }> {
		const searchParams = params ? new URLSearchParams(params).toString() : '';
		const url = searchParams ? `${endpoint}?${searchParams}` : endpoint;

		const data = await request<T>(url);
		return { data };
	},

	async post<T>(endpoint: string, body?: any): Promise<{ data: T }> {
		const data = await request<T>(endpoint, {
			method: 'POST',
			body: body ? JSON.stringify(body) : undefined,
		});
		return { data };
	},

	async patch<T>(endpoint: string, body?: any): Promise<{ data: T }> {
		const data = await request<T>(endpoint, {
			method: 'PATCH',
			body: body ? JSON.stringify(body) : undefined,
		});
		return { data };
	},

	async delete<T>(endpoint: string): Promise<{ data: T }> {
		const data = await request<T>(endpoint, {
			method: 'DELETE',
		});
		return { data };
	}
};