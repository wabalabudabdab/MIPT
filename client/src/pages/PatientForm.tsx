import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePatientsStore } from '../store/usePatientsStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PatientForm() {
	const navigate = useNavigate();
	const { id } = useParams();
	const isEdit = Boolean(id && id !== 'new');
	const { details, actions } = usePatientsStore();

	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [dateOfBirth, setDateOfBirth] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');
	const [email, setEmail] = useState('');
	const [error, setError] = useState<string | undefined>();

	useEffect(() => {
		if (isEdit && id) {
			actions.loadPatientDetails(id);
		}
	}, [id]);

	useEffect(() => {
		if (isEdit && details.current) {
			setFirstName(details.current.firstName);
			setLastName(details.current.lastName);
			setDateOfBirth(details.current.dateOfBirth.slice(0, 10));
			setPhoneNumber(details.current.phoneNumber);
			setEmail(details.current.email || '');
		}
	}, [details.current?.id]);

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(undefined);
		if (!firstName.trim() || !lastName.trim()) return setError('Имя и фамилия обязательны');
		if (!dateOfBirth) return setError('Дата рождения обязательна');
		if (!/^[+\d][\d\s()-]{5,}$/.test(phoneNumber)) return setError('Неверный телефон');
		if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError('Неверный email');

		const payload = {
			firstName, lastName,
			dateOfBirth: new Date(dateOfBirth).toISOString(),
			phoneNumber,
			email: email || undefined,
		};
		const saved = await actions.savePatient(isEdit ? { id, ...payload } : payload);
		if (saved) navigate(`/patients/${saved.id}`);
	};

	return (
		<div className="container mx-auto p-6 max-w-2xl">
			<h1 className="text-3xl font-bold mb-6">
				{isEdit ? 'Редактирование пациента' : 'Новый пациент'}
			</h1>
			
			<Card>
				<CardHeader>
					<CardTitle>Данные пациента</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={onSubmit} className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="lastName">Фамилия</Label>
								<Input
									id="lastName"
									value={lastName}
									onChange={(e) => setLastName(e.target.value)}
									placeholder="Фамилия"
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="firstName">Имя</Label>
								<Input
									id="firstName"
									value={firstName}
									onChange={(e) => setFirstName(e.target.value)}
									placeholder="Имя"
									required
								/>
							</div>
						</div>
						
						<div className="space-y-2">
							<Label htmlFor="dateOfBirth">Дата рождения</Label>
							<Input
								id="dateOfBirth"
								type="date"
								value={dateOfBirth}
								onChange={(e) => setDateOfBirth(e.target.value)}
								required
							/>
						</div>
						
						<div className="space-y-2">
							<Label htmlFor="phoneNumber">Телефон</Label>
							<Input
								id="phoneNumber"
								value={phoneNumber}
								onChange={(e) => setPhoneNumber(e.target.value)}
								placeholder="Телефон"
								required
							/>
						</div>
						
						<div className="space-y-2">
							<Label htmlFor="email">Email (опционально)</Label>
							<Input
								id="email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="Email"
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
