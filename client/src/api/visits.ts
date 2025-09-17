import { http } from './http';
import type { Visit, PaginatedResponse } from '../types';

export interface VisitsQuery {
	patientId: string;
	page?: number;
	pageSize?: number;
}

export async function fetchVisits(params: VisitsQuery): Promise<PaginatedResponse<Visit>> {
	const { patientId, page = 1, pageSize } = params;
	// Бэкенд ожидает 'limit' вместо 'pageSize'
	const { data } = await http.get<PaginatedResponse<Visit>>(`/patients/${patientId}/visits`, {
		page,
		limit: pageSize
	});
	return data;
}

export type UpsertVisitInput = Omit<Visit, 'id' | 'createdAt' | 'updatedAt' | 'patient'> & { id?: string };

export async function createVisit(patientId: string, input: UpsertVisitInput): Promise<Visit> {
	const { data } = await http.post<Visit>('/visits', { ...input, patientId });
	return data;
}

export async function updateVisit(patientId: string, id: string, input: UpsertVisitInput): Promise<Visit> {
	const { data } = await http.patch<Visit>(`/visits/${id}`, { ...input, patientId });
	return data;
} 