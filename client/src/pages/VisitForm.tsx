import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { usePatientsStore } from '../store/usePatientsStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { VisitStatus } from '@/types';

export default function VisitForm() {
	const navigate = useNavigate();
	const { id: patientId, visitId } = useParams();
	const isEdit = Boolean(visitId && visitId !== 'new');
	const { details, actions } = usePatientsStore();

	const [visitDate, setVisitDate] = useState('');
	const [diagnosis, setDiagnosis] = useState('');
	const [treatment, setTreatment] = useState('');
	const [status, setStatus] = useState<VisitStatus>('SCHEDULED');
	const [notes, setNotes] = useState('');
	const [error, setError] = useState<string | undefined>();

	useEffect(() => {
		if (patientId && !details.current) actions.loadPatientDetails(patientId);
	}, [patientId]);

	// Загружаем данные визита для редактирования
	useEffect(() => {
		if (isEdit && visitId && details.visits.length > 0) {
			const visit = details.visits.find(v => v.id === visitId);
			if (visit) {
				setVisitDate(visit.visitDate.slice(0, 16)); // формат datetime-local
				setDiagnosis(visit.diagnosis);
				setTreatment(visit.treatment);
				setStatus(visit.status);
				setNotes(visit.notes || '');
			}
		}
	}, [isEdit, visitId, details.visits]);

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(undefined);
		if (!visitDate) return setError('Дата визита обязательна');
		if (!diagnosis.trim()) return setError('Диагноз обязателен');
		if (!patientId) return;
		
		const saved = await actions.saveVisit(patientId, {
			patientId,
			visitDate: new Date(visitDate).toISOString(),
			diagnosis,
			treatment,
			status,
			notes: notes || undefined,
		}, isEdit ? visitId : undefined);
		if (saved) navigate(`/patients/${patientId}`);
	};

	return (
		<div className="container mx-auto p-6 max-w-2xl">
			<div className="mb-6">
				<Link to={patientId ? `/patients/${patientId}` : '/patients'}>
					<Button variant="outline">← Назад</Button>
				</Link>
			</div>

			<h1 className="text-3xl font-bold mb-6">{isEdit ? 'Редактирование визита' : 'Новый визит'}</h1>
			
			<Card>
				<CardHeader>
					<CardTitle>Данные визита</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={onSubmit} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="visitDate">Дата и время визита</Label>
							<Input
								id="visitDate"
								type="datetime-local"
								value={visitDate}
								onChange={(e) => setVisitDate(e.target.value)}
								required
							/>
						</div>
						
						<div className="space-y-2">
							<Label htmlFor="diagnosis">Диагноз</Label>
							<Input
								id="diagnosis"
								value={diagnosis}
								onChange={(e) => setDiagnosis(e.target.value)}
								placeholder="Диагноз"
								required
							/>
						</div>
						
						<div className="space-y-2">
							<Label htmlFor="treatment">Лечение</Label>
							<Input
								id="treatment"
								value={treatment}
								onChange={(e) => setTreatment(e.target.value)}
								placeholder="Лечение"
							/>
						</div>
						
						<div className="space-y-2">
							<Label htmlFor="status">Статус</Label>
							<select
								id="status"
								value={status}
								onChange={(e) => setStatus(e.target.value as VisitStatus)}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								<option value="SCHEDULED">Запланирован</option>
								<option value="COMPLETED">Завершён</option>
								<option value="CANCELLED">Отменён</option>
							</select>
						</div>
						
						<div className="space-y-2">
							<Label htmlFor="notes">Заметки (опционально)</Label>
							<textarea
								id="notes"
								value={notes}
								onChange={(e) => setNotes(e.target.value)}
								placeholder="Дополнительные заметки"
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
							/>
						</div>

						{(error || details.error) && (
							<div className="text-red-500 text-sm">{error || details.error}</div>
						)}

						<div className="flex gap-2 pt-4">
							<Button type="submit">Сохранить</Button>
							<Button type="button" variant="outline" onClick={() => navigate(-1)}>
								Отмена
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
