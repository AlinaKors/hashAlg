'use client';

import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './styles.module.css';

type AuditLog = {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  user_role: 'admin' | 'user';
  action: 'USER_SIGNIN' | 'USER_HASHSUBMIT' | 'USER_SIGNOUT';
  created_at: string;
};

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    fetch('http://localhost:4000/api/audit')
      .then((res) => res.json())
      .then((data) => setLogs(data))
      .catch((err) => console.error('Ошибка получения логов:', err));
  }, []);

  return (
    <div className={styles.auditContainer}>
      <div className={styles.topContainer}>
        <h1 className="">Audit Log</h1>
        <Link href="/">
          <Button variant="contained" fullWidth sx={{ mt: 2 }}>
            Back
          </Button>
        </Link>
      </div>
      <Paper sx={{ width: '100%' }}>
        <TableContainer>
          <Table sx={{ minWidth: 850 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>User ID</TableCell>
                <TableCell align="center">User Name</TableCell>
                <TableCell align="center">Email</TableCell>
                <TableCell align="center">Role</TableCell>
                <TableCell align="center">Action</TableCell>
                <TableCell align="center">Create at</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.map((row) => (
                <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    {row.user_id}
                  </TableCell>
                  <TableCell align="center">{row.user_name}</TableCell>
                  <TableCell align="center">{row.user_email}</TableCell>
                  <TableCell align="center">{row.user_role}</TableCell>
                  <TableCell align="center">{row.action}</TableCell>
                  <TableCell align="center">{row.created_at}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}
