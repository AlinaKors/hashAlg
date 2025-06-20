import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Box,
  type SelectChangeEvent,
} from '@mui/material';
import { useState } from 'react';
import styles from './styles.module.css';

const Algoritm = {
  MD5: 'md5',
  SHA1: 'sha1',
  SHA256: 'sha256',
};

type FormHash = {
  user: {
    id?: string | null;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: 'admin' | 'user';
  };
};

export const FormHash: React.FC<FormHash> = ({ user }) => {
  const [algoritm, setAlgoritm] = useState('');
  const [userString, setUserString] = useState('');
  const [hashResult, setHashResult] = useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setAlgoritm(event.target.value);
  };

  const addHashActionDB = async () => {
    await fetch('http://localhost:4000/api/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.id,
        action: 'USER_HASHSUBMIT',
        name: user.name,
        email: user.email,
        role: user.name === 'Alina' ? 'admin' : 'user',
      }),
    });
  };

  const handleHash = async () => {
    const res = await fetch('http://localhost:4000/api/hash', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ algoritm, value: userString }),
    });
    const data = await res.json();
    setHashResult(data.hash);
    addHashActionDB();
  };

  return (
    <>
      <div className="hashForm">
        <Box
          sx={{
            width: 468,
            borderRadius: 1,
          }}
        >
          <FormControl fullWidth id={styles.formControl}>
            <InputLabel id="algoritmSelected">Algoritm</InputLabel>
            <Select
              labelId="algoritmSelected"
              id="algoritmSelect"
              value={algoritm}
              label="Algoritm"
              onChange={handleChange}
            >
              <MenuItem value={Algoritm.MD5}>md5</MenuItem>
              <MenuItem value={Algoritm.SHA1}>sha1</MenuItem>
              <MenuItem value={Algoritm.SHA256}>sha256</MenuItem>
            </Select>
          </FormControl>
          <TextField
            id="userString"
            label="String"
            placeholder="Enter the string you want to encrypt"
            value={userString}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setUserString(event.target.value);
            }}
            fullWidth
            sx={{ width: '468px;' }}
          />
          <Button
            variant="contained"
            onClick={handleHash}
            fullWidth
            sx={{ width: '468px;' }}
            id={styles.btnHash}
          >
            сalculate the hash
          </Button>
          {hashResult && (
            <TextField
              fullWidth
              margin="normal"
              label="Хэш"
              value={hashResult}
              InputProps={{ readOnly: true }}
              sx={{ width: '468px;' }}
            />
          )}
        </Box>
      </div>
    </>
  );
};
