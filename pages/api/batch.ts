import type { NextApiRequest, NextApiResponse } from 'next'

export async function createUserHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.status(200).json({ name: 'John Doe' });
}