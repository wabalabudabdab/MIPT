import { useState, useMemo } from 'react';

export interface PaginationState {
  currentPage: number;
  pageSize: number;
  total: number;
}

export interface PaginationActions {
  goToPage: (page: number) => void;
  setPageSize: (size: number) => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  goToNextPage: () => void;
  goToPrevPage: () => void;
}

export interface PaginationInfo {
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  startItem: number;
  endItem: number;
  visiblePages: (number | '...')[];
}

export interface UsePaginationReturn {
  state: PaginationState;
  actions: PaginationActions;
  info: PaginationInfo;
}

export function usePagination(
  total: number,
  defaultPageSize: number = 50
): UsePaginationReturn {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(defaultPageSize);

  // Вычисляемые значения
  const info = useMemo((): PaginationInfo => {
    const totalPages = Math.ceil(total / pageSize);
    const hasNextPage = currentPage < totalPages;
    const hasPrevPage = currentPage > 1;
    const startItem = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, total);

    // Логика для отображения номеров страниц
    const visiblePages: (number | '...')[] = [];

    if (totalPages <= 7) {
      // Если страниц мало, показываем все
      for (let i = 1; i <= totalPages; i++) {
        visiblePages.push(i);
      }
    } else {
      // Сложная логика для больших списков
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, currentPage + 2);

      // Всегда показываем первую страницу
      if (start > 1) {
        visiblePages.push(1);
        if (start > 2) visiblePages.push('...');
      }

      // Показываем страницы вокруг текущей
      for (let i = start; i <= end; i++) {
        visiblePages.push(i);
      }

      // Всегда показываем последнюю страницу
      if (end < totalPages) {
        if (end < totalPages - 1) visiblePages.push('...');
        visiblePages.push(totalPages);
      }
    }

    return {
      totalPages,
      hasNextPage,
      hasPrevPage,
      startItem,
      endItem,
      visiblePages,
    };
  }, [total, pageSize, currentPage]);

  // Действия
  const actions = useMemo((): PaginationActions => ({
    goToPage: (page: number) => {
      if (page >= 1 && page <= info.totalPages) {
        setCurrentPage(page);
      }
    },
    setPageSize: (size: number) => {
      setPageSizeState(size);
      setCurrentPage(1); // Сброс на первую страницу при смене размера
    },
    goToFirstPage: () => setCurrentPage(1),
    goToLastPage: () => setCurrentPage(info.totalPages),
    goToNextPage: () => {
      if (info.hasNextPage) setCurrentPage(currentPage + 1);
    },
    goToPrevPage: () => {
      if (info.hasPrevPage) setCurrentPage(currentPage - 1);
    },
  }), [currentPage, info.totalPages, info.hasNextPage, info.hasPrevPage]);

  return {
    state: {
      currentPage,
      pageSize,
      total,
    },
    actions,
    info,
  };
}