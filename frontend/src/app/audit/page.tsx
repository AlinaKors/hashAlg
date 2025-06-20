'use client';

import { Button } from '@mui/material';
import Link from 'next/link';

import styles from './styles.module.css';

export default function AuditPage() {
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
    </div>
  );
}
