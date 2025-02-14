import { connectToDatabase } from "@/lib/mongodb";

export async function GET(request) {
    const { database } = await connectToDatabase();
    const collection = database.collection("products");

    const results = await collection.find({}).toArray();

    return Response.json(results);
}

export async function POST(request) {
    const content = request.headers.get('content-type');

    if (content !== 'application/json') {
        return Response.json({ message: 'Debes proporcionar datos JSON' }, { status: 400 });
    }

    const { database } = await connectToDatabase();
    const collection = database.collection("products");

    const { name, price, stock, description, category, image } = await request.json();

    if (!name || !price || stock === undefined) {
        return Response.json({ message: 'Faltan campos obligatorios' }, { status: 400 });
    }

    const newProduct = {
        name,
        price,
        stock,
        description: description || "",
        category: category || "General",
        image: image || ""
    };

    const results = await collection.insertOne(newProduct);

    return Response.json(results, { status: 201 });
}
