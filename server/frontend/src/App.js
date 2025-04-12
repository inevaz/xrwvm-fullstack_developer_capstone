const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 3030;

app.use(cors());
app.use(require('body-parser').urlencoded({ extended: false }));

// Cargar datos desde archivos JSON
const reviews_data = JSON.parse(fs.readFileSync("reviews.json", 'utf8'));
const dealerships_data = JSON.parse(fs.readFileSync("dealerships.json", 'utf8'));

// Conexión a MongoDB
mongoose.connect("mongodb://mongo_db:27017/", { dbName: 'dealershipsDB' });

// Importar modelos
const Reviews = require('./review');
const Dealerships = require('./dealership');

// Cargar datos iniciales en MongoDB
(async () => {
  try {
    await Reviews.deleteMany({});
    await Reviews.insertMany(reviews_data['reviews']);
    console.log("Datos de reviews cargados correctamente");

    await Dealerships.deleteMany({});
    await Dealerships.insertMany(dealerships_data['dealerships']);
    console.log("Datos de dealerships cargados correctamente");
  } catch (error) {
    console.error("Error al cargar datos:", error);
  }
})();

// Ruta principal
app.get('/', async (req, res) => {
  res.send("Welcome to the Mongoose API");
});

// Obtener todas las reseñas
app.get('/fetchReviews', async (req, res) => {
  try {
    const documents = await Reviews.find();
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// Obtener reseñas por concesionario
app.get('/fetchReviews/dealer/:id', async (req, res) => {
  try {
    const documents = await Reviews.find({ dealership: req.params.id });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// Obtener todos los concesionarios
app.get('/fetchDealers', async (req, res) => {
  try {
    const dealers = await Dealerships.find(); // Usa "Dealerships" en lugar de "Dealer"
    res.status(200).json(dealers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los concesionarios' });
  }
});

// Obtener concesionarios por estado
app.get('/fetchDealers/:state', async (req, res) => {
  try {
    const { state } = req.params;
    const dealers = await Dealerships.find({ state }); // Usa "Dealerships" en lugar de "Dealer"
    if (dealers.length === 0) {
      return res.status(404).json({ message: 'No se encontraron concesionarios para este estado' });
    }
    res.status(200).json(dealers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los concesionarios por estado' });
  }
});

// Obtener un concesionario por ID
app.get('/fetchDealer/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const dealer = await Dealerships.findById(id); // Usa "Dealerships" en lugar de "Dealer"
    if (!dealer) {
      return res.status(404).json({ message: 'Concesionario no encontrado' });
    }
    res.status(200).json(dealer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el concesionario por ID' });
  }
});

// Insertar una nueva reseña
app.post('/insert_review', express.raw({ type: '*/*' }), async (req, res) => {
  try {
    const data = JSON.parse(req.body);
    const documents = await Reviews.find().sort({ id: -1 });
    const new_id = documents[0]['id'] + 1;

    const review = new Reviews({
      id: new_id,
      name: data['name'],
      dealership: data['dealership'],
      review: data['review'],
      purchase: data['purchase'],
      purchase_date: data['purchase_date'],
      car_make: data['car_make'],
      car_model: data['car_model'],
      car_year: data['car_year'],
    });

    const savedReview = await review.save();
    res.json(savedReview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error inserting review' });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
