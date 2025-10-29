import serverless from 'serverless-http';
import app from '../src/app';

// Wrap the Express app with serverless-http so Vercel can invoke it as a serverless function.
const handler = serverless(app as any);

export default async function (req: any, res: any) {
  return handler(req, res);
}
