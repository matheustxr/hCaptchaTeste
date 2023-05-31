import { useEffect, useRef, useState } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';


import Image from 'next/image'
import doguinho from '../../assets/Dachshund11.webp'

const Card = () => {
  const hcaptchaRef = useRef(null);
  const [hcaptchaToken, setHcaptchaToken] = useState('');

  const handleHcaptchaVerify = (token: string) => {
    setHcaptchaToken(token);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (hcaptchaToken) {
      // Realize as ações necessárias com o token do hCaptcha
      console.log('Token do hCaptcha:', hcaptchaToken);

      // Coloque aqui o código para enviar os dados ao backend
      try {
        const response = await fetch('./verify.ts', {
          method: 'POST',
          body: JSON.stringify({ token: hcaptchaToken }),
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();
        console.log('Resposta do servidor:', data);
      } catch (error) {
        console.error('Erro ao enviar os dados:', error);
      }
    } else {
      // O hCaptcha não foi preenchido corretamente
      alert('Por favor, verifique o hCaptcha antes de enviar o formulário.');
      return;
    }
  };

  useEffect(() => {
    if (hcaptchaToken) {
      // Realize ações adicionais se o token do hCaptcha estiver disponível
    }
  }, [hcaptchaToken]);

  return (
    <form onSubmit={handleSubmit} className='w-full h-screen flex flex-col items-center gap-5 bg-slate-950'>
      <div className='w-[340px] mt-5 p-5 flex flex-col gap-5 bg-sky-500 rounded text-white'>
        <Image src={doguinho} alt='' className='w-[300px] rounded'/>
        <h1 className='font-bold text-3xl text-center'>Gregório</h1>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit magnam ei deserunt laboriosam in commodi et corrupti. Dolores, impedit corporis.</p>
        <button type="submit" className='px-3 py-1 bg-white rounded text-black'>votar</button>
      </div>
      <HCaptcha
        ref={hcaptchaRef}
        sitekey="30000000-ffff-ffff-ffff-000000000003"
        onVerify={handleHcaptchaVerify}
      />

    
  </form>
  );
};

export default Card;
