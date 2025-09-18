import { http } from './http';
import type { Patient, PaginatedResponse } from '../types';

export interface PatientsQuery {
	page?: number;
	pageSize?: number;
	search?: string;
}

export async function fetchPatients(params: PatientsQuery = {}): Promise<PaginatedResponse<Patient>> {
	const { page = 1, pageSize, search = '' } = params;

	// Бэкенд ожидает 'limit' вместо 'pageSize'
	const { data } = await http.get<PaginatedResponse<Patient>>('/patients', {
		page,
		limit: pageSize,
		search
	});
	return data;
}

export async function fetchPatientById(id: string): Promise<Patient> {
	const { data } = await http.get<Patient>(`/patients/${id}`);
	return data;
}

export type UpsertPatientInput = Omit<Patient, 'id' | 'createdAt' | 'updatedAt' | 'visits'> & { id?: string };

export async function createPatient(input: UpsertPatientInput): Promise<Patient> {
	const { data } = await http.post<Patient>('/patients', input);
	return data;
}

export async function updatePatient(id: string, input: UpsertPatientInput): Promise<Patient> {
	const { id: _, ...body } = input; // Исключаем id из тела запроса
	const { data } = await http.patch<Patient>(`/patients/${id}`, body);
	return data;
}

export async function deletePatient(id: string): Promise<void> {
	await http.delete(`/patients/${id}`);
}

export async function fetchAllPatients(): Promise<Patient[]> {
	const { data } = await http.get<PaginatedResponse<Patient>>('/patients', {
		limit: 999999 // Загружаем всех пациентов
	});
	return data.data; // Возвращаем массив пациентов из PaginatedResponse
}