export interface Patient {
	id: string;
	firstName: string;
	lastName: string;
	dateOfBirth: string; // ISO string для сериализации
	phoneNumber: string;
	email?: string;
	createdAt: string;
	updatedAt: string;
	visits?: Visit[];
}

export type VisitStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELED';

export interface Visit {
	id: string;
	patient: Patient;
	patientId: string;
	visitDate: string; // ISO string
	diagnosis: string;
	treatment: string;
	status: VisitStatus;
	notes?: string;
	createdAt: string;
	updatedAt: string;
}

export interface PaginatedResponse<T> {
	data: T[];
	meta: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
} 