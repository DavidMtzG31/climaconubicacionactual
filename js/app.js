
const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');



document.addEventListener('DOMContentLoaded', () => {
    navigator.geolocation.getCurrentPosition(success, error, options); 
    climaDefault();
})

const options = {
    EnableHighAccuracy: true,  // Presición exacta
    timeout: 5000,            // Tiempo de respuesta
    maximunAge: 0// Indica de hace cuanto tiempo quiero recuperar la geolocalización, es decir, si quisiera de caché
}

function success(geolocation) {
    const { latitude, longitude } = geolocation.coords;

    consultarAPIInicial(latitude, longitude);
}

function error(error) {
    console.log(error);  // Hay 3 errores: permiso denegado, no se pudo encontrar la localizacion, tiempo de espera excedido
}




window.addEventListener('load', () => {
    formulario.addEventListener('submit', buscarClima);
    formulario.reset();
})


function buscarClima(e) {
    e.preventDefault();

    // Validar
    const ciudadInput = document.querySelector('#ciudad').value;
    const paisInput = document.querySelector('#pais').value;  

    if(ciudadInput === '' || paisInput === '' ) {
        Swal.fire({
            icon: 'warning',
            title: 'Todos los campos son obligatorios',
            showConfirmButton: false,
            timer: 1500
          })
          return;
    }

    // Consultar API
    consultarAPI(ciudadInput, paisInput);
}

function consultarAPI(ciudadInput, paisInput) {
    const appID = '36d15caa15b099f63c507f45271c19c2';

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudadInput},${paisInput}&appid=${appID}`;

    spinner(); // Muestra el spinner de carga

    fetch( url ) 
        .then(respuesta => {
            return respuesta.json();
        })
        .then(datos => {
            limpiarHTML(); // Limpiar si hay una consulta previa
            if(datos.cod === '404') {
                console.log(datos); // Es el código de la consulta, 200 correcto, 404 no exitoso
                Swal.fire({
                    icon: 'warning',
                    title: 'La ciudad es incorrecta',
                    showConfirmButton: false,
                    timer: 1500
                  })
            return;
            }

            // Imprime la respuesta en el HTML
            mostrarClima(datos);
        })
}


function mostrarClima(datos) {
    console.log(datos);
    const { coord: {lon, lat} } = datos;
    console.log(lat, lon)
    const { name, main: { temp, temp_max, temp_min } } = datos;
    const centigrados = kelvinACentigrados(temp);
    const max = kelvinACentigrados(temp_max);
    const min = kelvinACentigrados(temp_min);

    const nombreCiudad = document.createElement('p');
    nombreCiudad.textContent = `${name}`;
    nombreCiudad.classList.add('font-bold', 'text-2xl');

    const actual = document.createElement('p');
    actual.innerHTML = `${centigrados} &#8451`; // El código añade el simbolo de grados centígrados
    actual.classList.add('font-bold', 'text-6xl');

    // Para max
    const tempMaxima = document.createElement('p');
    tempMaxima.innerHTML = `Max: ${max} 	&#8451`;
    tempMaxima.classList.add('text-xl');

    // Para min
    const tempMinima = document.createElement('p');
    tempMinima.innerHTML = `Min: ${min} 	&#8451`;
    tempMinima.classList.add('text-xl')

    const resultadoDiv = document.createElement('div');
    resultadoDiv.classList.add('text-center', 'text-white');
    resultadoDiv.appendChild(nombreCiudad);
    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(tempMaxima);
    resultadoDiv.appendChild(tempMinima);

    resultado.appendChild(resultadoDiv);
}

const kelvinACentigrados = grados => parseInt(grados - 273.15);

function limpiarHTML() {
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

function spinner() {
    limpiarHTML();
    const divSpiner = document.createElement('div');
    divSpiner.classList.add('sk-fading-circle');

    divSpiner.innerHTML = `
        <div class="sk-circle1 sk-circle"></div>
        <div class="sk-circle2 sk-circle"></div>
        <div class="sk-circle3 sk-circle"></div>
        <div class="sk-circle4 sk-circle"></div>
        <div class="sk-circle5 sk-circle"></div>
        <div class="sk-circle6 sk-circle"></div>
        <div class="sk-circle7 sk-circle"></div>
        <div class="sk-circle8 sk-circle"></div>
        <div class="sk-circle9 sk-circle"></div>
        <div class="sk-circle10 sk-circle"></div>
        <div class="sk-circle11 sk-circle"></div>
        <div class="sk-circle12 sk-circle"></div>
    `;

    resultado.appendChild(divSpiner);
}

function climaDefault() {
    spinner();
}

function consultarAPIInicial(lat, long) {
    console.log(lat, long);

    const appID = '36d15caa15b099f63c507f45271c19c2';

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${appID}`;

    fetch ( url )
    .then(respuesta => {
        return respuesta.json();
    })
    .then(datos => {
        limpiarHTML(); // Limpiar si hay una consulta previa
        mostrarClima(datos);
    })

}
