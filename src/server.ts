import { fastify } from 'fastify';
import { fastifyCors} from '@fastify/cors';
import { validatorCompiler, serializerCompiler, ZodTypeProvider, jsonSchemaTransform } from 'fastify-type-provider-zod';
import { fastifySwagger } from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { routes } from './routes';


const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
});

app.register(fastifySwagger, {
    openapi: {
        info: {
            title: 'Fastify API',
            version: '1.0.0'
        },
    },
    transform: jsonSchemaTransform,
});



app.register(fastifySwaggerUi, {
    routePrefix: '/docs'
});

app.register(routes);


app.setErrorHandler((error, request, reply) => {
    console.error(error);
    reply.status(500).send({ error: 'Internal Server Error' });
});

app.listen({port: 3333}, async () => {
    console.log(`Server is running on port 3333`);
})