import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Paper,
    Typography,
    Stack,
    Button,
    Container,
    Card,
    CardHeader,
    CardActions,
    CardContent,
    TextField,
    Snackbar,
    Alert,
} from '@mui/material';

interface Book {
    id: number;
    title: string;
    author: string;
    sales: number;
}

const Detail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [book, setBook] = useState<Book | null>(null);
    const [sales, setSales] = useState<number | ''>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>('');

    useEffect(() => {
        const fetchBookDetail = async () => {
            try {
                const response = await axios.get(`https://rgt-book-store.onrender.com/api/books/${id}`);
                setBook(response.data);
                setSales(response.data.sales);
            } catch (err) {
                setError('Failed to fetch book details');
            } finally {
                setLoading(false);
            }
        };

        fetchBookDetail();
    }, [id]);

    const handleUpdateSales = async () => {
        if (book) {
            try {
                await axios.put(`https://rgt-book-store.onrender.com/api/books/${book.id}`, {
                    ...book,
                    sales: sales,
                });
                setSnackbarMessage('판매 수량이 업데이트되었습니다.');
                setSnackbarOpen(true);
            } catch (err) {
                setError('Failed to update book sales');
            }
        }
    };

    const handleDeleteBook = async () => {
        if (book) {
            try {
                await axios.delete(`https://rgt-book-store.onrender.com/api/books/${book.id}`);
                setSnackbarMessage('책이 삭제되었습니다.');
                setSnackbarOpen(true);
                navigate('/books'); // 목록 페이지로 이동
            } catch (err) {
                setError('Failed to delete book');
            }
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!book) {
        return <div>No book details available</div>;
    }

    return (
        <Paper style={{ padding: '16px' }}>
            <Container maxWidth="lg">
                <Stack spacing={2}>
                    <Card>
                        <CardHeader title={book.title}></CardHeader>
                        <CardContent>
                            <Typography variant="body1">저자: {book.author}</Typography>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <Typography variant="body1" style={{ whiteSpace: 'nowrap' }}>판매 수량:</Typography>
                                <TextField
                                    variant="outlined"
                                    type="number"
                                    value={sales}
                                    onChange={(e) => setSales(Number(e.target.value))}
                                    fullWidth
                                />
                            </Stack>
                        </CardContent>
                        <CardActions style={{ justifyContent: 'space-between' }}>
                            <Stack direction="row" spacing={1}>
                                <Button variant="contained" onClick={handleUpdateSales}>
                                    수정
                                </Button>
                                <Button variant="contained" color="secondary" onClick={handleDeleteBook}>
                                    삭제
                                </Button>
                            </Stack>
                            <Button variant="contained" onClick={() => window.history.back()}>
                                목록
                            </Button>
                        </CardActions>
                    </Card>
                </Stack>
            </Container>

            <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Paper>
    );
};

export default Detail;