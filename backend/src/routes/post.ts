import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";

export const postRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string,
    },
    Variables: {
        userId: string
    }
}>();

// authentication check 
postRouter.use('/*', async (c, next) => {
    const header = c.req.header('Authorization') || '';
    if (!header) {
        c.status(401);
        return c.json({ error: "unathhorized " });
    }

    // const token = header.split(' ')[1];
    const response = await verify(header, c.env.JWT_SECRET)
    if (response.id) {
        c.set('userId',response.id);
        // c.set('userId',"jwt");
        await next()
    } else {
        c.status(403)
        return c.json({ error: "unauthorized" })
    }

})

postRouter.post('/', async (c) => {
    const userId = c.get('userId');
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

    const body = await c.req.json();
    const post = await prisma.post.create({
        data: {
            title: body.title,
            content: body.content,
            authorId: userId
        }
    });
    return c.json({
        id: post.id
    });
})

postRouter.put('/', async (c) => {
    // const userId = c.get('userId');
    const body = await c.req.json();
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

    const blog = await prisma.post.update({
        where: {
            id: body.id
        },
        data: {
            title: body.title,
            content: body.content
        }
    });

    return c.json({
        id : body.id
    })
})

postRouter.get('/bulk',async  (c) => {
    const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());
    const post = await prisma.post.findMany({
        select : {
            content: true,
            title: true,
            id: true,
            author: {
                select : {
                    name: true
                }
            }
        }
    });

    return c.json({
        post
    })
})

postRouter.get('/:id', async (c) => {
    const id = c.req.param("id");
    const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

    try {
        const post = await prisma.post.findUnique({
            where: {
                id
            },
            select: {
                id : true,
                title : true,
                content : true,
                author : {
                    select : {
                        name : true
                    }
                }
            }
        });
    
        return c.json({post});
    } catch(e) {
        c.status(411);
        return c.json ({
            message : "Error while fetching the post"
        });
    }
})




