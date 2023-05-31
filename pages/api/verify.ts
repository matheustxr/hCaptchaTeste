import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';
import axios from 'axios';

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Ae@1254453',
  database: 'hcaptcha',
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
      const response = await axios.post('https://hcaptcha.com/siteverify', {
        response: token,
        secret: '0xb6F0a1455503e6227156f727c41006605F0A6A80',
      });

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