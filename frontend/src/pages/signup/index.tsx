import { FormEvent, useState, useContext } from 'react';
import Head from 'next/head';
import logoImg from '../../../public/logo.svg';
import Image from 'next/image';
import styles from '../../../styles/home.module.scss';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import Link from 'next/link';
import { AuthContext } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

export default function Signup() {

  const { signUp } = useContext(AuthContext);

  const [ name, setName ] = useState('');

  const [ email, setEmail ] = useState('');

  const [ password, setPassword ] = useState('');

  const [ loading, setLoading ] = useState(false);

  async function handleSingUp(event: FormEvent) {
    event.preventDefault();

    if (name === '' || email === '' || password === '') {
      toast.warning("Preencha todos os campos");
      return;
    }

    setLoading(true);

    let data = {
      name,
      email,
      password
    }

    await signUp(data);

    setLoading(false);
    
  }

  return (
    <>
    <Head>
      <title>Crie teu cadastro agora!</title>
    </Head>
    <div className={ styles.containerCenter }>
      <Image src={ logoImg } alt="Logo Sujeito Pizzaria" />

      <div className={ styles.login }>
        <h1>Criando tua conta</h1>

        <form onSubmit={ handleSingUp }>

          <Input 
            placeholder='Digite teu nome'
            type='text'
            value={ name }
            onChange={ (e) => setName(e.target.value) }
          />

          <Input 
            placeholder='Digite teu E-mail'
            type='text'
            value={ email }
            onChange={ (e) => setEmail(e.target.value) }
          />

          <Input 
            placeholder='Senha'
            type='password'
            value={ password }
            onChange={ (e) => setPassword(e.target.value) }
          />

          <Button 
            type='submit'
            loading={ loading }
          >
            Cadastrar
          </Button>

        </form>

        <Link href='/' legacyBehavior>
          <a className={ styles.text }>Já possui uma conta? Faça login</a>
        </Link>
      </div>
    </div>
    </>
  )
}
