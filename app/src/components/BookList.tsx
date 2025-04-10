import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Stack,
    Button,
    TextField,
    Container,
    Checkbox,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddBookModal from './AddBookModal';

interface Book {
    id: number;
    title: string;
    author: string;
    sales: number;
}

interface ApiResponse {
    data: Book[];
    total_counts: number;
    total_pages: number;
    page: number;
    page_size: number;
}

const BookList: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [totalCounts, setTotalCounts] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [searchTitle, setSearchTitle] = useState<string>('');
    const [searchAuthor, setSearchAuthor] = useState<string>('');
    const [selectedBooks, setSelectedBooks] = useState<number[]>([]);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchBooks();
    }, [page, rowsPerPage]);

    const fetchBooks = async () => {
        try {
            const response = await axios.get<ApiResponse>(`https://rgt-book-store.onrender.com/api/books`, {
                params: {
                    page: page + 1,
                    page_size: rowsPerPage,
                    title: searchTitle,
                    author: searchAuthor,
                },
            });
            setBooks(response.data.data);
            setTotalCounts(response.data.total_counts);
            setTotalPages(response.data.total_pages);
        } catch (err) {
            setError('Failed to fetch books');
        } finally {
            setLoading(false);
        }
    };

    const handleCheckboxChange = (id: number) => {
        setSelectedBooks((prevSelected) => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter((bookId) => bookId !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    };

    const handleDeleteSelected = async () => {
        try {
            await Promise.all(selectedBooks.map(async (id) => {
                await axios.delete(`https://rgt-book-store.onrender.com/api/books/${id}`);
            }));
            setSelectedBooks([]);
            fetchBooks();
        } catch (err) {
            setError('Failed to delete selected books');
        }
    };

    const handleSearch = () => {
        setPage(0);
        fetchBooks();
    };

    const handleSearchTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTitle(event.target.value);
    };

    const handleSearchAuthorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchAuthor(event.target.value);
    };

    const handleDetailClick = async (id: number) => {
        try {
            await axios.get(`https://rgt-book-store.onrender.com/api/books/${id}`);
            navigate(`/detail/${id}`);
        } catch (err) {
            setError('Failed to fetch book details');
        }
    };

    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => setModalOpen(false);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <Paper>
            <Container maxWidth="lg">
                <Stack spacing={2} style={{ padding: '16px' }}>
                    <Stack direction="row" spacing={2} justifyContent="space-between">
                        <Stack direction="row" spacing={2}>
                            <TextField
                                label="제목"
                                variant="outlined"
                                value={searchTitle}
                                onChange={handleSearchTitleChange}
                            />
                            <TextField
                                label="저자"
                                variant="outlined"
                                value={searchAuthor}
                                onChange={handleSearchAuthorChange}
                            />
                            <Button variant="contained" onClick={handleSearch}>
                                검색
                            </Button>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={handleDeleteSelected}
                                disabled={selectedBooks.length === 0}
                            >
                                선택한 책 삭제
                            </Button>
                            <Button variant="contained" color="primary" onClick={handleOpenModal}>
                                책 추가
                            </Button>
                        </Stack>
                    </Stack>
                    <TableContainer style={{ minHeight: 800 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedBooks.length === books.length}
                                            onChange={() => {
                                                if (selectedBooks.length === books.length) {
                                                    setSelectedBooks([]);
                                                } else {
                                                    setSelectedBooks(books.map(book => book.id));
                                                }
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>#</TableCell>
                                    <TableCell>제목</TableCell>
                                    <TableCell>저자</TableCell>
                                    <TableCell>판매 수량</TableCell>
                                    <TableCell>상세 정보</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {books.map((book, index) => (
                                    <TableRow key={book.id}>
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedBooks.includes(book.id)}
                                                onChange={() => handleCheckboxChange(book.id)}
                                            />
                                        </TableCell>
                                        <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                        <TableCell>{book.title}</TableCell>
                                        <TableCell>{book.author}</TableCell>
                                        <TableCell>{book.sales}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                onClick={() => handleDetailClick(book.id)}
                                            >
                                                상세 정보
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
                        <Typography variant="body1">
                            {`${page * rowsPerPage + 1}–${Math.min((page + 1) * rowsPerPage, totalCounts)} of ${totalCounts}`}
                        </Typography>
                        <Stack direction="row" spacing={1}>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <Button key={i} onClick={() => setPage(i)} variant={page === i ? 'contained' : 'outlined'}>
                                    {i + 1}
                                </Button>
                            ))}
                        </Stack>
                    </Stack>
                </Stack>
            </Container>

            <AddBookModal
                open={modalOpen}
                onClose={handleCloseModal}
                onBookAdded={fetchBooks}
            />
        </Paper>
    );
};

export default BookList;