'use client';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from '@mui/material';
import { FormHash } from '../FormHash/FormHash';
import styles from './styles.module.css';

export default function AuthForm() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <Button onClick={() => signIn('github')} id={styles.btnsignin}>
        Войти через GitHub
      </Button>
    );
  }

  return (
    <>
      <header className={styles.header}>
        <Button onClick={() => signOut()}>Выйти</Button>
        {/* {session.user.role === 'admin' && (
          <Link href="/audit">
            <Button variant="contained" fullWidth sx={{ mt: 2 }}>
              Audit
            </Button>
          </Link>
        )} */}
      </header>
      <FormHash />
    </>
  );
}
