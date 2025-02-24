import z from "zod";
import { FastifyTypeInstance } from "./types";
import { randomUUID } from "node:crypto";

export async function routes(app: FastifyTypeInstance): Promise<void> {
    
    interface User {
        id: string;
        name: string;
        email: string;
    }
    
    const users: User[] = []

    app.get('/users', {
        schema: {
            tags: ['users'],
            description: 'Get all users',
            response: {
                200: z.array(z.object({
                    id: z.string(),
                    name: z.string(),
                    email: z.string(),
                }))
            }
        },
       
    }, async () => users);

    app.post('/users', 
        {
            schema: {
                tags: ['users'],
                description: 'Create a new user',
                body: z.object({
                    name: z.string().min(3).max(255),
                    email: z.string().email(),
                }),
                response: {
                    201: z.object({
                        message: z.string(),
                        user: z.object({
                            id: z.string(),
                            name: z.string(),
                            email: z.string(),
                        }).describe("user created")
                    }),
                    400: z.object({
                        error: z.string(),
                    })  
                }
            }
        },
        async (request, reply) => {

            const { name, email } = request.body;

            users.push({ id: randomUUID(), name, email });

            reply.status(201)
            .send({ message: 'User created successfully', user: { id: randomUUID(), name, email } });
        });	

}

