import { FormEvent, useContext, useState } from 'react';
import Head from 'next/head';
import logoImg from '../../public/logo.svg';
import Image from 'next/image';
import styles from '../../styles/home.module.scss';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import Link from 'next/link';
import { canSSRGuest } from '../utils/canSSRGuest';
import { AuthContext } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

export default function Home() {
  const { signIn } = useContext(AuthContext);

  const [ email, SetEmail ] = useState('');
  const [ password, SetPassword ] = useState('');
  const [ loading, SetLoading ] = useState(false);

  async function handleLogin(event: FormEvent) {
    event.preventDefault();

    if ( email === '' || password === '') {
      toast.warning("Preencha os campos");
      return;
    }

    SetLoading(true);

    let data = {
      email,
      password
    }

    await signIn(data);

    SetLoading(false);

  }

  return (
    <>
    <Head>
      <title>SujeitoPizza - faça teu login</title>
    </Head>
    <div className={ styles.containerCenter }>
      <Image src={ logoImg } alt="Logo Sujeito Pizzaria" />

      <div className={ styles.login }>
        <form onSubmit={ handleLogin }>

          <Input 
            placeholder='Digite teu E-mail'
            type='text'
            value={ email }
            onChange={ (e) => SetEmail(e.target.value)}
          />

          <Input 
            placeholder='Senha'
            type='password'
            value={ password }
            onChange={ (e) => SetPassword(e.target.value)}
          />

          <Button 
            type='submit'
            loading={ loading }
          >
            Acessar
          </Button>

        </form>

        <Link href='/signup' legacyBehavior>
          <a className={ styles.text }>Não possui uma conta? Cadastra-se</a>
        </Link>
      </div>
    </div>
    </>
  )
}

export const getServerSideProps = canSSRGuest(async (context) => {
  
  return {
    props: {}
  }
})
