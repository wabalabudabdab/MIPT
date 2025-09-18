import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { usePatientsStore } from '../store/usePatientsStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PatientDetails() {
	const { id } = useParams();
	const { details, actions } = usePatientsStore();

	useEffect(() => {
		if (id) {
			actions.loadPatientDetails(id);
			actions.loadVisits(id);
		}
	}, [id]);

	const patient = details.current;

	return (
		<div className="container mx-auto p-6">
			<div className="mb-6">
				<Link to="/patients">
					<Button variant="outline">← Список пациентов</Button>
				</Link>
			</div>

			{details.loading && <div className="text-center py-4">Загрузка...</div>}
			{details.error && <div className="text-red-500 text-center py-4">{details.error}</div>}

			{patient && (
				<div className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle className="text-2xl">{patient.lastName} {patient.firstName}</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2">
							<p><strong>Дата рождения:</strong> {patient.dateOfBirth.slice(0, 10)}</p>
							<p><strong>Телефон:</strong> {patient.phoneNumber}</p>
							<p><strong>Email:</strong> {patient.email || '-'}</p>
						</CardContent>
					</Card>

					<div className="flex gap-2">
						<Link to={`/patients/${patient.id}/edit`}>
							<Button>Редактировать</Button>
						</Link>
						<Link to={`/patients/${patient.id}/visits/new`}>
							<Button variant="secondary">Новый визит</Button>
						</Link>
					</div>

					<Card>
						<CardHeader>
							<CardTitle>История визитов</CardTitle>
						</CardHeader>
						<CardContent>
							{details.visits.length === 0 ? (
								<p className="text-gray-500">Визитов пока нет</p>
							) : (
								<div className="space-y-2">
									{details.visits.map(v => (
										<div key={v.id} className="border rounded p-3">
											<div className="flex justify-between items-start">
												<div className="flex-1">
													<p className="font-medium">{v.diagnosis}</p>
													<p className="text-sm text-gray-600">{v.treatment}</p>
													<p className="text-xs text-gray-500">
														{v.visitDate.slice(0, 16).replace('T', ' ')}
													</p>
												</div>
												<div className="flex items-center gap-2">
													<span className={`px-2 py-1 rounded text-xs ${
														v.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
														v.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-800' :
														'bg-red-100 text-red-800'
													}`}>
														{v.status}
													</span>
													<Link to={`/patients/${patient.id}/visits/${v.id}/edit`}>
														<Button variant="outline" size="sm">
															Редактировать
														</Button>
													</Link>
												</div>
											</div>
										</div>
									))}
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			)}
		</div>
	);
}
