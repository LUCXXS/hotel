// ================== IMPORTACIÓN DE MÓDULOS ==================
const express = require('express');           // Framework web
const mongoose = require('mongoose');         // Conexión y modelado de MongoDB
const bodyParser = require('body-parser');    // Parseo de JSON en solicitudes
const cors = require('cors');                 // Habilita solicitudes entre dominios
const bcrypt = require('bcrypt');             // Encriptación de contraseñas

// ================== CONFIGURACIÓN BÁSICA ==================
const app = express();                        // Crear instancia de la app Express
const PORT = 3000;                            // Puerto en el que corre el servidor

app.use(cors());                              // Permite solicitudes CORS
app.use(bodyParser.json());                   // Permite recibir JSON en las solicitudes
app.use(express.static('public'));            // Servir archivos estáticos desde la carpeta "public"

// ================== CONEXIÓN A BASE DE DATOS ==================
mongoose.connect('mongodb://localhost:27017/hotel', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Conexión exitosa a MongoDB'))
.catch(err => console.error('Error al conectar a MongoDB:', err));

// ================== DEFINICIÓN DE ESQUEMAS Y MODELOS ==================

// Usuarios
const UsuarioSchema = new mongoose.Schema({
    nombre: String,
    email: String,
    password: String
});
const Usuario = mongoose.model('Usuario', UsuarioSchema);

// Clientes
const ClienteSchema = new mongoose.Schema({
     nombre: String,
     email: String,
     telefono: String
});
const Cliente = mongoose.model('Cliente', ClienteSchema);

// Empleados
const EmpleadoSchema = new mongoose.Schema({
    nombre: String,
    puesto: String,
    telefono: String
});
const Empleado = mongoose.model('Empleado', EmpleadoSchema);

// Habitaciones
const HabitacionSchema = new mongoose.Schema({
    numero: Number,
    tipo: String,
    precio: Number
});
const Habitacion = mongoose.model('Habitacion', HabitacionSchema);

// Reservas
const ReservaSchema = new mongoose.Schema({
     cliente: String,
  habitacion: String,
  fechaEntrada: String,  
  fechaSalida: String
});
const Reserva = mongoose.model('Reserva', ReservaSchema);

// Servicios
const ServicioSchema = new mongoose.Schema({
    nombreS: String,
    habitacion: Number,
    costo: Number
});
const Servicio = mongoose.model('Servicio', ServicioSchema);

// ================== RUTAS DE AUTENTICACIÓN ==================

// Registro de usuarios
app.post('/registro', async (req, res) => {
    const { nombre, email, password } = req.body;

    // Encripta la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crea un nuevo usuario y lo guarda en la base de datos
    const nuevoUsuario = new Usuario({ nombre, email, password: hashedPassword });
    await nuevoUsuario.save();

    res.status(201).send('Usuario registrado');
});

// Inicio de sesión
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Busca al usuario por email
    const usuario = await Usuario.findOne({ email });
    if (!usuario) return res.status(401).send('Usuario no encontrado');

    // Compara la contraseña ingresada con la almacenada
    const valid = await bcrypt.compare(password, usuario.password);
    if (!valid) return res.status(401).send('Contraseña incorrecta');

    res.send('Bienvenido ' + usuario.nombre);
});

// ================== CRUD: CLIENTES ==================

// Obtener todos los clientes
app.get('/api/clientes', async (req, res) => {
    const clientes = await Cliente.find();
    res.json(clientes);
});

// Crear un nuevo cliente
app.post('/api/clientes', async (req, res) => {
    const nuevo = new Cliente(req.body);
    await nuevo.save();
    res.status(201).send('Cliente creado');
});

// Eliminar cliente por ID
app.delete('/api/clientes/:id', async (req, res) => {
    await Cliente.findByIdAndDelete(req.params.id);
    res.send('Cliente eliminado');
});

// ================== CRUD: EMPLEADOS ==================

// Obtener todos los empleados
app.get('/api/empleados', async (req, res) => {
    const empleados = await Empleado.find();
    res.json(empleados);
});

// Crear un nuevo empleado
app.post('/api/empleados', async (req, res) => {
    const nuevo = new Empleado(req.body);
    await nuevo.save();
    res.status(201).send('Empleado creado');
});

// Eliminar empleado por ID
app.delete('/api/empleados/:id', async (req, res) => {
    await Empleado.findByIdAndDelete(req.params.id);
    res.send('Empleado eliminado');
});

// ================== CRUD: HABITACIONES ==================

// Obtener todas las habitaciones
app.get('/api/habitaciones', async (req, res) => {
    const habitaciones = await Habitacion.find();
    res.json(habitaciones);
});

// Crear una nueva habitación
app.post('/api/habitaciones', async (req, res) => {
    const nueva = new Habitacion(req.body);
    await nueva.save();
    res.status(201).send('Habitación creada');
});

// Eliminar habitación por ID
app.delete('/api/habitaciones/:id', async (req, res) => {
    await Habitacion.findByIdAndDelete(req.params.id);
    res.send('Habitación eliminada');
});

// ================== CRUD: RESERVAS ==================

// Obtener todas las reservas
app.get('/api/reservas', async (req, res) => {
    const reservas = await Reserva.find();
    res.json(reservas);
});

// Crear una nueva reserva
app.post('/api/reservas', async (req, res) => {
    const nueva = new Reserva(req.body);
    await nueva.save();
    res.status(201).send('Reserva creada');
});

// Eliminar reserva por ID
app.delete('/api/reservas/:id', async (req, res) => {
    await Reserva.findByIdAndDelete(req.params.id);
    res.send('Reserva eliminada');
});

// ================== CRUD: SERVICIOS ==================

// Obtener todos los servicios
app.get('/api/servicios', async (req, res) => {
    const servicios = await Servicio.find();
    res.json(servicios);
});

// Crear un nuevo servicio
app.post('/api/servicios', async (req, res) => {
    const nuevo = new Servicio(req.body);
    await nuevo.save();
    res.status(201).send('Servicio creado');
});

// Eliminar servicio por ID
app.delete('/api/servicios/:id', async (req, res) => {
    await Servicio.findByIdAndDelete(req.params.id);
    res.send('Servicio eliminado');
});

// ================== INICIAR SERVIDOR ==================
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
