import { create } from 'zustand';
import type { Patient, Visit, PaginatedResponse } from '../types';
import { fetchPatients, fetchPatientById, createPatient, updatePatient } from '../api/patients';
import { fetchVisits, createVisit, updateVisit } from '../api/visits';

interface PatientsListState {
	items: Patient[];
	total: number;
	search: string;
	loading: boolean;
	error?: string;
}

interface PatientDetailsState {
	current?: Patient;
	visits: Visit[];
	visitsTotal: number;
	visitsPage: number;
	visitsPageSize: number;
	loading: boolean;
	error?: string;
}

interface PatientsActions {
	setSearch: (q: string) => void;
	loadPatients: (opts?: { page?: number; pageSize?: number; search?: string }) => Promise<void>;
	loadPatientDetails: (id: string) => Promise<void>;
	savePatient: (input: Partial<Patient> & { id?: string }) => Promise<Patient | undefined>;
	loadVisits: (patientId: string, opts?: { page?: number; pageSize?: number }) => Promise<void>;
	saveVisit: (patientId: string, input: Partial<Visit> & { id?: string }) => Promise<Visit | undefined>;
	clearError: () => void;
}

export const usePatientsStore = create<{
	list: PatientsListState;
	details: PatientDetailsState;
	actions: PatientsActions;
}>((set, get) => ({
	list: {
		items: [],
		total: 0,
		search: '',
		loading: false,
		error: undefined,
	},
	details: {
		current: undefined,
		visits: [],
		visitsTotal: 0,
		visitsPage: 1,
		visitsPageSize: 10,
		loading: false,
		error: undefined,
	},
	actions: {
		// patients
		loadPatients: async ({ page = 1, pageSize, search } = {}) => {
			const st = get().list;

			if (st.loading) return;

			if (!pageSize) {
				console.error('pageSize is required for loadPatients');
				return;
			}

			const searchQuery = search !== undefined ? search : st.search;

			set({ list: { ...st, loading: true, error: undefined } });
			try {
				const res: PaginatedResponse<Patient> = await fetchPatients({
					page,
					pageSize,
					search: searchQuery,
				});
				set({
					list: {
						...st,
						items: res.data,
						total: res.meta.total,
						search: searchQuery,
						loading: false
					}
				});
			} catch (e: any) {
				console.error('API Error:', e);
				set({ list: { ...st, loading: false, error: e.message } });
			}
		},
		loadPatientDetails: async (id: string) => {
			const st = get().details;
			// Очищаем данные только если меняется ID пациента
			const shouldClear = !st.current || st.current.id !== id;

			set({
				details: {
					...st,
					current: shouldClear ? undefined : st.current,
					visits: shouldClear ? [] : st.visits,
					loading: true,
					error: undefined
				}
			});
			try {
				const patient = await fetchPatientById(id);
				set({ details: { ...get().details, current: patient, loading: false } });
			} catch (e: any) {
				set({ details: { ...get().details, loading: false, error: e.message } });
			}
		},
		savePatient: async (input) => {
			try {
				if (input.id) {
					return await updatePatient(input.id, input as any);
				}
				return await createPatient(input as any);
			} catch (e: any) {
				set((s) => ({ list: { ...s.list, error: e.message } }));
			}
		},
		// visits
		loadVisits: async (patientId, { page, pageSize } = {}) => {
			set((state) => ({ details: { ...state.details, loading: true, error: undefined } }));
			try {
				const st = get().details;
				const res = await fetchVisits({ patientId, page: page ?? st.visitsPage, pageSize: pageSize ?? st.visitsPageSize });
				const items = res.data || [];

				set((state) => ({
					details: {
						...state.details,
						visits: items,
						loading: false
					}
				}));
			} catch (e: any) {
				set((state) => ({ details: { ...state.details, loading: false, error: e.message } }));
			}
		},
		saveVisit: async (patientId, input) => {
			try {
				if (input.id) {
					return await updateVisit(patientId, input.id, input as any);
				}
				return await createVisit(patientId, input as any);
			} catch (e: any) {
				set((s) => ({ details: { ...s.details, error: e.message } }));
			}
		},

		setSearch: (q) => set((s) => ({ list: { ...s.list, search: q } })),
		clearError: () => set((s) => ({
			list: { ...s.list, error: undefined },
			details: { ...s.details, error: undefined },
		})),
	},
}));
