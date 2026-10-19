import { Hono } from 'hono'
import { PrismaClient } from './generated/prisma'
import { PrismaNeon } from '@prisma/adapter-neon'
import { sign } from 'hono/jwt'
import {verify} from 'hono/jwt'

type Bindings = {
  DATABASE_URL: string
  JWT_SECRET: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('/api/v1/blog/*', async(c,next)=>{
  const header = c.req.header("authorization") || "";
  const token = header.split(" ")[1];
  if(!token){
    return c.json({
      message: "Unauthoirzed"
    }, 401)
  }
  try{
    const response = await verify(token, c.env.JWT_SECRET, "HS256");
    await next();
  }catch{
    return c.json({message: "Invalid or expired token"}, 401);
  }
})

app.post('/api/v1/signup', async (c) => {
  const adapter = new PrismaNeon({ connectionString: c.env.DATABASE_URL })
  const prisma = new PrismaClient({ adapter })

  const body = await c.req.json()

  try {
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
      },
    })

    const token = await sign({ id: user.id }, c.env.JWT_SECRET)

    return c.json({ jwt: token })
  } catch (e: any) {
    c.status(403)
    return c.json({ error: e.message || 'Error while signing up' })
  }
})

app.post('/api/v1/signin', async (c)=>{
  const adapter = new PrismaNeon({ connectionString: c.env.DATABASE_URL })
  const prisma = new PrismaClient({ adapter })

  const body = await c.req.json();

  try{
    const user = await prisma.user.findUnique({
      where: {
        email: body.email
      }
    })
    if(!user){
      c.status(403);
      return c.json({ message: "Create an account first"})
    }
    const jwt = await sign({id: user.id}, c.env.JWT_SECRET);
    return c.json({message: "Login successful", jwt})
  }catch(e){
    return c.json({
      message: "An internal error occurred"
    })
  }
})

app.post('/api/v1/blog', (c)=>{

})

app.put('/api/v1/blog', (c)=>{

})

app.get('/api/v1/blog/:id', (c)=>{

})

export default app
