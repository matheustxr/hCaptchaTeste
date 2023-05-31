import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Verifica se a requisição é POST
  if (req.method === 'POST') {
    // Configuração da requisição
    const config = {
      url: 'https://hcaptcha.com/siteverify',
      method: 'POST',
      data: {
        response: req.body['h-captcha-response'] ?? '',
      }
    };

    // Faz a requisição usando o Axios
    try {
      const response = await axios(config);

      // Verifica o sucesso da requisição
      const sucesso = response.data.success ?? false;

      // Mensagem de sucesso ou erro
      if (sucesso) {
        console.log('Voto computado com sucesso!');
      } else {
        console.log('hCaptcha inválido');
      }

      res.status(200).end();
    } catch (error) {
      console.error('Erro na requisição:', error);
      res.status(500).end();
    }
  } else {
    res.status(405).end(); // Método n
  }
}
