import React, { useState } from 'react';
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
} from '@mui/material';
import axios from 'axios';

interface AddBookModalProps {
    open: boolean;
    onClose: () => void;
    onBookAdded: () => void;
}

const AddBookModal: React.FC<AddBookModalProps> = ({ open, onClose, onBookAdded }) => {
    const [newBookTitle, setNewBookTitle] = useState<string>('');
    const [newBookAuthor, setNewBookAuthor] = useState<string>('');

    const handleAddBook = async () => {
        if (newBookTitle && newBookAuthor) {
            try {
                await axios.post('https://rgt-book-store.onrender.com/api/books', {
                    title: newBookTitle,
                    author: newBookAuthor,
                });
                setNewBookTitle('');
                setNewBookAuthor('');
                onClose();
                onBookAdded();
            } catch (err) {
                console.error('Failed to add new book', err);
            }
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                border: '2px solid #000',
                boxShadow: 24,
                p: 4,
            }}>
                <Typography variant="h6" component="h2">
                    책 추가
                </Typography>
                <TextField
                    label="제목"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={newBookTitle}
                    onChange={(e) => setNewBookTitle(e.target.value)}
                />
                <TextField
                    label="저자"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={newBookAuthor}
                    onChange={(e) => setNewBookAuthor(e.target.value)}
                />
                <Button variant="contained" onClick={handleAddBook} fullWidth>
                    추가
                </Button>
                <Button onClick={onClose} fullWidth>
                    취소
                </Button>
            </Box>
        </Modal>
    );
};

export default AddBookModal;