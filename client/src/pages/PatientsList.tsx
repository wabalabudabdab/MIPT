import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePatientsStore } from '../store/usePatientsStore';
import { usePagination } from '../hooks/usePagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PatientsList() {
	const list = usePatientsStore((state) => state.list);
	const loadPatients = usePatientsStore((state) => state.actions.loadPatients);
	const setSearch = usePatientsStore((state) => state.actions.setSearch);

	// Используем наш новый хук для пагинации
	const pagination = usePagination(list.total, 50);

	// Начальная загрузка данных
	useEffect(() => {
		loadPatients({
			page: 1,
			pageSize: 50,
			search: ''
		});
	}, []);

	// Загружаем данные при изменении пагинации (только если уже есть данные)
	useEffect(() => {
		if (list.total > 0) {
			loadPatients({
				page: pagination.state.currentPage,
				pageSize: pagination.state.pageSize,
				search: list.search
			});
		}
	}, [pagination.state.currentPage, pagination.state.pageSize, list.search]);


	return (
		<div className="container mx-auto p-6">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-3xl font-bold">Пациенты</h1>
				<Link to="/patients/new">
					<Button>Добавить пациента</Button>
				</Link>
			</div>
			
			<Card className="mb-6">
				<CardHeader>
					<CardTitle>Поиск</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex gap-2">
						<Input
							type="text"
							placeholder="Поиск по имени/телефону"
							value={list.search}
							onChange={(e) => setSearch(e.target.value)}
						/>
						<Button onClick={() => {
							pagination.actions.goToFirstPage();
						}}>
							Искать
						</Button>
					</div>
				</CardContent>
			</Card>

			{list.loading && <div className="text-center py-4">Загрузка...</div>}
			{list.error && <div className="text-red-500 text-center py-4">Ошибка: {list.error}</div>}

			<div className="grid gap-4">
				{list.items && list.items.length > 0 ? (
					list.items.map((p) => (
						<Card key={p.id}>
							<CardContent className="p-6">
								<div className="flex justify-between items-start">
									<div>
										<h3 className="text-lg font-semibold">{p.lastName} {p.firstName}</h3>
										<p className="text-gray-600">Телефон: {p.phoneNumber}</p>
										<p className="text-gray-600">Email: {p.email || '-'}</p>
									</div>
									<div className="flex gap-2">
										<Link to={`/patients/${p.id}`}>
											<Button variant="outline">Открыть</Button>
										</Link>
										<Link to={`/patients/${p.id}/edit`}>
											<Button variant="secondary">Редактировать</Button>
										</Link>
									</div>
								</div>
							</CardContent>
						</Card>
					))
				) : (
					<Card>
						<CardContent className="p-6 text-center">
							<p>Пациентов не найдено</p>
						</CardContent>
					</Card>
				)}
			</div>

			{/* Пагинация */}
			{list.total > 0 && (
				<div className="mt-6">
					{/* Выбор размера страницы */}
					<div className="flex justify-center items-center gap-2 mb-4 text-sm">
						<span className="text-gray-600">Показывать по:</span>
						{[25, 50, 100].map((size) => (
							<Button
								key={size}
								variant={pagination.state.pageSize === size ? "default" : "outline"}
								size="sm"
								onClick={() => pagination.actions.setPageSize(size)}
							>
								{size}
							</Button>
						))}
						<span className="text-gray-600">записей на странице</span>
					</div>

					{/* Информация о пагинации */}
					<div className="text-center text-sm text-gray-600 mb-4">
						Показано {pagination.info.startItem}-{pagination.info.endItem} из {list.total} записей
						<br />
						Страница {pagination.state.currentPage} из {pagination.info.totalPages}
					</div>

					{/* Навигация - показываем только если больше одной страницы */}
					{pagination.info.totalPages > 1 && (
						<div className="flex justify-center items-center gap-2 flex-wrap">
							{/* Первая страница */}
							<Button
								variant="outline"
								disabled={!pagination.info.hasPrevPage}
								onClick={pagination.actions.goToFirstPage}
							>
								Первая
							</Button>

							{/* Назад */}
							<Button
								variant="outline"
								disabled={!pagination.info.hasPrevPage}
								onClick={pagination.actions.goToPrevPage}
							>
								‹
							</Button>

							{/* Номера страниц */}
							{pagination.info.visiblePages.map((page, index) => {
								if (page === '...') {
									return <span key={`ellipsis-${index}`} className="px-2">...</span>;
								}
								return (
									<Button
										key={`page-${page}`}
										variant={page === pagination.state.currentPage ? "default" : "outline"}
										size="sm"
										onClick={() => pagination.actions.goToPage(page as number)}
									>
										{page}
									</Button>
								);
							})}

							{/* Вперёд */}
							<Button
								variant="outline"
								disabled={!pagination.info.hasNextPage}
								onClick={pagination.actions.goToNextPage}
							>
								›
							</Button>

							{/* Последняя страница */}
							<Button
								variant="outline"
								disabled={!pagination.info.hasNextPage}
								onClick={pagination.actions.goToLastPage}
							>
								Последняя
							</Button>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
