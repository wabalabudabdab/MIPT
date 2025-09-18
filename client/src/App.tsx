import { Link, Route, Routes, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import PatientsList from './pages/PatientsList';
import PatientForm from './pages/PatientForm';
import PatientDetails from './pages/PatientDetails';
import VisitForm from './pages/VisitForm';

function Navbar() {
	return (
		<nav className="border-b bg-white shadow-sm">
			<div className="container mx-auto px-6 py-4">
				<div className="flex items-center justify-between">
					<Link to="/patients" className="text-xl font-bold text-gray-900">
						🏥 
					</Link>
					<div className="flex items-center space-x-4">
						<Link to="/patients">
							<Button variant="ghost">Пациенты</Button>
						</Link>
					</div>
				</div>
			</div>
		</nav>
	);
}

export default function App() {
	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar />
			<main>
				<Routes>
					<Route path="/" element={<Navigate to="/patients" replace />} />
					<Route path="/patients" element={<PatientsList />} />
					<Route path="/patients/new" element={<PatientForm />} />
					<Route path="/patients/:id/edit" element={<PatientForm />} />
					<Route path="/patients/:id" element={<PatientDetails />} />
					<Route path="/patients/:id/visits/new" element={<VisitForm />} />
					<Route path="/patients/:id/visits/:visitId/edit" element={<VisitForm />} />
				</Routes>
			</main>
		</div>
	);
}
