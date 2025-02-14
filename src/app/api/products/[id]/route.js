import Cors from 'cors';

// Configuración de CORS
const cors = Cors({
    methods: ['GET', 'PUT', 'DELETE'], // Métodos HTTP permitidos
    origin: '*', // Permitir solicitudes desde cualquier origen. Cambia esto por un dominio específico si es necesario.
});

// Middleware para manejar CORS
function runMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result); // Si hay un error, rechaza la promesa
            }
            return resolve(result); // Si todo va bien, resuelve la promesa
        });
    });
}
export async function GET(request, { params }) {
    // Ejecutar CORS
    await runMiddleware(request, {}, cors);

    const { database } = await connectToDatabase();
    const collection = database.collection(process.env.MONGODB_COLLECTION);

    const { id } = params;
    const results = await collection.findOne({ _id: new ObjectId(id) });

    return Response.json(results);
}

export async function PUT(request, { params }) {
    // Ejecutar CORS
    await runMiddleware(request, {}, cors);

    const content = request.headers.get('content-type');

    if (content !== 'application/json') {
        return Response.json({ message: 'Debes proporcionar datos JSON' });
    }

    const { database } = await connectToDatabase();
    const collection = database.collection(process.env.MONGODB_COLLECTION);

    const { id } = params;
    const { name, price, stock, description, category, image } = await request.json(); // Lee la solicitud
    const results = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { name, price, stock, description, category, image } }
    );

    return Response.json(results);
}

export async function DELETE(request, { params }) {
    // Ejecutar CORS
    await runMiddleware(request, {}, cors);

    const { database } = await connectToDatabase();
    const collection = database.collection(process.env.MONGODB_COLLECTION);

    const { id } = params;
    const results = await collection.deleteOne({ _id: new ObjectId(id) });

    return Response.json(results);
}