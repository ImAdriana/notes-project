// Creación de variables

const formulario = document.querySelector('#formulario');
const listaTweets = document.querySelector('#lista-tweets');

let tweets = [];

eventListeners();
// Función para todos los event listeners
function eventListeners() {
    // Cuando el usuario agrega un nuevo
    formulario.addEventListener('submit', agregarTweet);

    // Cuando el documento está listo
    document.addEventListener('DOMContentLoaded', () => {
        // Intenta buscar los tweets si existen o asigna un arreglo vacio
        tweets = JSON.parse(localStorage.getItem('tweets')) || [];
        crearHTML();
    });
}
// Funciones
function agregarTweet(e) {
    e.preventDefault();
    // Text area donde el usuario escribe
    const contenidoText = document.querySelector('#tweet').value;
    // Validación sobre el contenido
    if (contenidoText === '') {
        mostrarError('Un mensaje no puede ir vacío');
        return; // Evita que sigan las siguientes lineas
    }

    const tweetObj = {
        id: Date.now(),
        contenidoText, // contenidoText: contenidoText
    };
    // Añadir al arreglo de tweets
    tweets = [...tweets, tweetObj];
    // Una vez agregado se crea el HTML
    crearHTML();

    // Reiniciar el formulario
    formulario.reset();
}

// Mostrar mensaje de error si no hay contenido
// Crea un párrafo con el mensaje de error
function mostrarError(error) {
    const mensajeError = document.createElement('p');
    mensajeError.textContent = error;
    mensajeError.classList.add('error');

    // Insentarlo en el contenido
    const contenido = document.querySelector('#contenido');
    contenido.appendChild(mensajeError);

    // Elimina la alerta despues de 2 seg
    setTimeout(() => {
        mensajeError.remove();
    }, 2000);
}

// Muestra un listado de los tweets
function crearHTML() {
    limpiarHTML();
    if (tweets.length > 0) {
        tweets.forEach((tweet) => {
            // Agregar un boton de eliminar
            const btnEliminar = document.createElement('a');
            btnEliminar.classList.add('borrar-tweet');
            btnEliminar.textContent = '🗑';

            // Añadir la función de eliminar
            // Lo hago así porque le debo pasar parámetros
            btnEliminar.onclick = () => {
                // Aquí verifica qué texto se elimina, esto a traves de su ID
                borrarTweet(tweet.id);
            };

            // Crear el HTML
            const li = document.createElement('li');

            // Añadir el contenido al html
            li.innerText = tweet.contenidoText;
            // Asignar el boton
            li.appendChild(btnEliminar);

            // Insertarlo
            // Mientras se tenga un appendChild no elimina el código previo
            // Example: 1ro una A, luego una B, luego una C --> A , AAB, AABABC
            listaTweets.appendChild(li);
        });
    }

    sincronizarStorage();
}

function limpiarHTML() {
    while (listaTweets.firstChild) {
        listaTweets.removeChild(listaTweets.firstChild);
    }
}

// Agrega los tweets actuales
function sincronizarStorage() {
    localStorage.setItem('tweets', JSON.stringify(tweets));
}

function borrarTweet(id) {
    // Checa en el arreglo, itera sobre cada contenido, por ello checa todos los
    // demás excepto el que le dí clic
    tweets = tweets.filter((tweet) => tweet.id != id);
    // Una vez eliminado al que se le dió clic se refresca solo con los que
    // quedaron
    crearHTML();
}
