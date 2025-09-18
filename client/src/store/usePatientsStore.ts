import { create } from 'zustand';
import type { Patient, Visit, PaginatedResponse } from '../types';
import { fetchPatients, fetchPatientById, createPatient, updatePatient, deletePatient, fetchAllPatients } from '../api/patients';
import { fetchVisits, createVisit, updateVisit } from '../api/visits';

interface PatientsListState {
	items: Patient[];
	allPatients: Patient[]; // КЭШ всех пациентов
	total: number;
	search: string;
	loading: boolean;
	cacheLoading: boolean; // Загрузка кэша
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
	loadAllPatients: () => Promise<void>; // Загрузка всех пациентов в кэш
	filterPatients: (page?: number, pageSize?: number) => void; // Фильтрация кэша по search
	loadPatientDetails: (id: string) => Promise<void>;
	savePatient: (input: Partial<Patient> & { id?: string }) => Promise<Patient | undefined>;
	deletePatient: (id: string) => Promise<boolean>;
	loadVisits: (patientId: string, opts?: { page?: number; pageSize?: number }) => Promise<void>;
	saveVisit: (patientId: string, input: Partial<Visit>, visitId?: string) => Promise<Visit | undefined>;
	clearError: () => void;
}

export const usePatientsStore = create<{
	list: PatientsListState;
	details: PatientDetailsState;
	actions: PatientsActions;
}>((set, get) => ({
	list: {
		items: [],
		allPatients: [], // КЭШ всех пациентов
		total: 0,
		search: '',
		loading: false,
		cacheLoading: false,
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
				let savedPatient;
				if (input.id) {
					// Обновление существующего пациента
					savedPatient = await updatePatient(input.id, input as any);
					// Обновляем пациента в кэше
					set((s) => ({
						list: {
							...s.list,
							allPatients: s.list.allPatients.map(p =>
								p.id === savedPatient.id ? savedPatient : p
							)
						}
					}));
				} else {
					// Создание нового пациента
					savedPatient = await createPatient(input as any);
					// Добавляем нового пациента в кэш
					set((s) => ({
						list: {
							...s.list,
							allPatients: [savedPatient, ...s.list.allPatients]
						}
					}));
				}
				// Перефильтровываем данные после изменения кэша
				get().actions.filterPatients();
				return savedPatient;
			} catch (e: any) {
				set((s) => ({ list: { ...s.list, error: e.message } }));
			}
		},
		deletePatient: async (id: string) => {
			try {
				await deletePatient(id);
				// Удаляем пациента из кэша
				set((s) => ({
					list: {
						...s.list,
						allPatients: s.list.allPatients.filter(p => p.id !== id)
					}
				}));
				// Перефильтровываем данные после удаления из кэша
				get().actions.filterPatients();
				return true;
			} catch (e: any) {
				set((s) => ({ list: { ...s.list, error: e.message } }));
				return false;
			}
		},
		loadAllPatients: async () => {
			const st = get().list;
			set({ list: { ...st, cacheLoading: true, error: undefined } });
			try {
				const allPatients = await fetchAllPatients();
				set({ list: { ...st, allPatients, cacheLoading: false } });
				// После загрузки кэша применяем фильтрацию
				get().actions.filterPatients();
			} catch (e: any) {
				set({ list: { ...st, cacheLoading: false, error: e.message } });
			}
		},
		filterPatients: (page = 1, pageSize = 50) => {
			const st = get().list;
			const { allPatients, search } = st;

			let filtered = allPatients;

			if (search.trim()) {
				// Фильтруем по поисковой строке
				filtered = allPatients.filter(patient =>
					patient.firstName.toLowerCase().includes(search.toLowerCase()) ||
					patient.lastName.toLowerCase().includes(search.toLowerCase()) ||
					patient.phoneNumber.includes(search) ||
					(patient.email && patient.email.toLowerCase().includes(search.toLowerCase()))
				);
			}

			// Применяем пагинацию к отфильтрованным результатам
			const startIndex = (page - 1) * pageSize;
			const endIndex = startIndex + pageSize;
			const paginatedItems = filtered.slice(startIndex, endIndex);

			set({
				list: {
					...st,
					items: paginatedItems,
					total: filtered.length
				}
			});
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
		saveVisit: async (patientId, input, visitId) => {
			try {
				if (visitId) {
					return await updateVisit(patientId, visitId, input as any);
				}
				return await createVisit(patientId, input as any);
			} catch (e: any) {
				set((s) => ({ details: { ...s.details, error: e.message } }));
			}
		},

		setSearch: (q) => {
			set((s) => ({ list: { ...s.list, search: q } }));
		},
		clearError: () => set((s) => ({
			list: { ...s.list, error: undefined },
			details: { ...s.details, error: undefined },
		})),
	},
}));
