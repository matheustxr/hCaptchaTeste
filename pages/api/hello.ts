import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';
import axios from 'axios';
import Cors from 'cors';

const dbConfig = {
  host: 'vps-5528980.bmouseproductions.com',
  user: 'zomiescom_votos',
  password: '~^@r;XFrSNM+',
  database: 'zomiescom_votacoes',
};

// Inicializando o cors middleware
const cors = Cors({
  methods: ['GET', 'HEAD', 'POST'],
});

// Helper para executar o middleware manualmente
function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Execute o middleware cors
  await runMiddleware(req, res, cors);

  // Verifica se a requisição é POST
  if (req.method === 'POST') {
    // Verifica se o token do hCaptcha está presente no corpo da requisição
    const { token } = req.body;
    if (!token) {
      res.status(400).json({ error: 'Token do hCaptcha ausente.' });
      return;
    }

    // Verifica o hCaptcha
    try {
      const response = await axios({
        method: 'post',
        url: 'https://hcaptcha.com/siteverify',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: `response=${token}&secret=0xb6F0a1455503e6227156f727c41006605F0A6A80`
      });

      // Log the response from hCaptcha API
      console.log(response.data);

      const { success } = response.data;
      if (!success) {
        res.status(403).json({ error: 'Verificação do hCaptcha falhou.' });
        return;
      }
    } catch (error) {
      console.error('Erro na verificação do hCaptcha:', error);
      res.status(500).json({ error: 'Erro na verificação do hCaptcha.' });
      return;
    }

    // Obtém o endereço IP do cliente
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // Insere o voto no banco de dados
    try {
      const connection = await mysql.createConnection(dbConfig);
      await connection.execute('INSERT INTO votos (hcaptcha_token, ip_address, data) VALUES (?, ?, NOW())', [token, ipAddress]);
      await connection.end();
      res.status(200).json({ message: 'Voto computado com sucesso!' });
    } catch (error) {
      console.error('Erro ao inserir o voto no banco de dados:', error);
      res.status(500).json({ error: 'Erro ao inserir o voto no banco de dados.' });
    }
  } else {
    res.status(405).end(); // Método não permitido
  }
}
