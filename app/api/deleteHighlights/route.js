import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI; // Make sure this is set in .env.local

// Connect to MongoDB
const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;
  if (!MONGODB_URI) throw new Error('MONGODB_URI is not defined');

  await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

// Define the Highlights model only once
let Highlight;
try {
  Highlight = mongoose.model('Highlight');
} catch {
  Highlight = mongoose.model(
    'Highlight',
    new mongoose.Schema({}, { strict: false })
  );
}

// DELETE function for Next.js App Router API
export async function DELETE(req) {
  try {
    await connectDB();
    await Highlight.deleteMany({});

    return Response.json(
      { message: 'All highlights deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting highlights:', error);
    return Response.json(
      { message: 'Error deleting data', error: error.message },
      { status: 500 }
    );
  }
}
