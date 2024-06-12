const { Pool } = require('pg');

const config = {
    user: 'postgres',
    host: 'localhost',
    database: 'always_music',
    password: '123456', // clave simulada
    port: '5432',
    max: 20,
    min: 2,
};

const pool = new Pool(config);

//1.Crear una función asíncrona para registrar un nuevo estudiante en la base de datos.
const agregarUsuario = async (nombre, rut, curso, nivel) => {
    const client = await pool.connect();
    try {
        const resultado = await client.query(
            "INSERT INTO usuarios (nombre, rut, curso, nivel) VALUES ($1, $2, $3, $4) RETURNING *",
            [nombre, rut, curso, nivel]
        );
        console.log("Nuevo alumno registrado:", resultado.rows[0]);
    } catch (err) {
        console.error("Error en el registro:", err);
    } finally {
        client.release();
    }
}; //Ejecutar node index.js nuevo 'Brian May','12.345.678-9', 'Guitarra', '7'

//2. Crear una función asíncrona para obtener por consola el registro de un estudiante por medio de su rut.
const consultarRut = async (rut) => {
    const client = await pool.connect();
    try {
        const resultado = await client.query(
            "SELECT * FROM usuarios WHERE rut = $1",
            [rut]
        );

        if (resultado.rows.length) {
            console.log("Alumno registrado:", resultado.rows[0]);
        } else {
            console.log("Alumno no encontrado");
        }
    } catch (error) {
        console.error("Error al consultar por rut:", error.message);
    } finally {
        client.release();
    }
}; //Ejecutar node index.js rut '12.345.678-9'

//3. Crear una función asíncrona para obtener por consola todos los estudiantes registrados. 
const consultarTabla = async () => {
    const client = await pool.connect();
    try {
        const resultado = await client.query("SELECT * FROM usuarios");
        console.log("Alumnos registrados:", resultado.rows);
    } catch (error) {
        console.error("Error al obtener todos los alumnos:", error.message);
    } finally {
        client.release();
    }
};//Ejecutar node index.js consulta  


//4. Crear una función asíncrona para actualizar los datos de un estudiante en la base de datos.
const actualizarUsuario = async (nombre, rut, curso, nivel) => {
    const client = await pool.connect();
    try {
        const resultado = await client.query(
            "UPDATE usuarios SET nombre = $1, curso = $3, nivel = $4 WHERE rut = $2 RETURNING *",
            [nombre, rut, curso, nivel]
        );
        console.log("Alumno actualizado:", resultado.rows[0]);
    } catch (error) {
        console.error("Error al actualizar el Alumno:", error.message);
    } finally {
        client.release();
    }
}; //Ejecutar node index.js editar 'Brian May','12.345.678-9', 'Guitarra', '10'


//5. Crear una función asíncrona para eliminar el registro de un estudiante de la base de datos.
const eliminarUsuario = async (rut) => {
    const client = await pool.connect();
    try {
        const resultado = await client.query(
            "DELETE FROM usuarios WHERE rut = $1 RETURNING *",
            [rut]
        );
        if (resultado.rows.length) {
            console.log("Alumno eliminado:", resultado.rows[0]);
        } else {
            console.log("Alumno no registrado");
        }
    }
    catch (error) {
        console.error("Error al eliminar el Alumno:", error.message);
    } finally {
        client.release();
    }
};//Ejecutar node index.js eliminar '12.345.678-9'


// Comandos
const comandos = async () => {
    try {
        switch (funcion) {
            case "nuevo": agregarUsuario(args[0], args[1], args[2], args[3]);
                break;
            case "consulta": consultarTabla();
                break;
            case "rut":
                await consultarRut(args[0], args[1], args[2], args[3]);
                break;
            case "editar": actualizarUsuario(args[0], args[1], args[2], args[3]);
                break;
            case "eliminar": eliminarUsuario(args[0]);
                break;
            default:
                console.info("Comando no válido");
                break;
        }
    } catch (error) {
        console.error("Error al ejecutar:", error.message);
    } finally {
        await pool.end();
    }
};
comandos();