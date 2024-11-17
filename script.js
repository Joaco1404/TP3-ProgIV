document.getElementById("flightForm").addEventListener("input", function () {
    let isValid = true;

    // Validación de cada campo
    const fields = [
        { id: "fullName", errorId: "fullNameError", successId: "fullNameSuccess" },
        { id: "passportNumber", errorId: "passportNumberError", successId: "passportNumberSuccess" },
        { id: "birthDate", errorId: "birthDateError", successId: "birthDateSuccess" },
        { id: "nationality", errorId: "nationalityError", successId: "nationalitySuccess" },
        { id: "originCity", errorId: "originCityError", successId: "originCitySuccess" },
        { id: "destinationCity", errorId: "destinationCityError", successId: "destinationCitySuccess" },
        { id: "departureDate", errorId: "departureDateError", successId: "departureDateSuccess" },
        { id: "returnDate", errorId: "returnDateError", successId: "returnDateSuccess" },
        { id: "flightClass", errorId: "flightClassError", successId: "flightClassSuccess" },
        { id: "ticketNumber", errorId: "ticketNumberError", successId: "ticketNumberSuccess" },
        { id: "creditCardNumber", errorId: "creditCardNumberError", successId: "creditCardNumberSuccess" },
        { id: "expirationDate", errorId: "expirationDateError", successId: "expirationDateSuccess" },
        { id: "cvv", errorId: "cvvError", successId: "cvvSuccess" },
        { id: "cardName", errorId: "cardNameError", successId: "cardNameSuccess" },
    ];

    fields.forEach((field) => {
        const input = document.getElementById(field.id);
        const error = document.getElementById(field.errorId);
        const success = document.getElementById(field.successId);

        if (!input.checkValidity()) {
            error.classList.remove("hidden");
            success.classList.add("hidden");
            isValid = false;
        } else {
            error.classList.add("hidden");
            success.classList.remove("hidden");
        }
    });

    // Validación de fechas
    const departureDate = new Date(document.getElementById("departureDate").value);
    const returnDate = new Date(document.getElementById("returnDate").value);
    const today = new Date();

    // Validación de fecha de salida
    if (departureDate <= today) {
        document.getElementById("departureDateError").classList.remove("hidden");
        isValid = false;
    } else {
        document.getElementById("departureDateError").classList.add("hidden");
    }

    // Validación de fecha de regreso
    if (returnDate && returnDate <= departureDate) {
        document.getElementById("returnDateError").classList.remove("hidden");
        isValid = false;
    } else {
        document.getElementById("returnDateError").classList.add("hidden");
    }

    // Si no hay fecha de regreso seleccionada, no mostramos ningún mensaje
    if (!document.getElementById("returnDate").value) {
        document.getElementById("returnDateError").classList.add("hidden");
        document.getElementById("returnDateSuccess").classList.add("hidden");
    } else {
        // Si hay fecha de regreso, mostrar mensaje de éxito si es válida
        if (returnDate > departureDate) { // Cambiado a '>' para que sea estrictamente posterior
            document.getElementById("returnDateSuccess").classList.remove("hidden");
        } else {
            document.getElementById("returnDateSuccess").classList.add("hidden");
        }
    }

    // Validación de fecha de nacimiento
    const birthDateInput = document.getElementById("birthDate").value;
    const birthDateParts = birthDateInput.split("/");
    const birthDate = new Date(
        `${birthDateParts[2]}-${birthDateParts[1]}-${birthDateParts[0]}`
    );
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (age < 18 || (age === 18 && monthDiff < 0)) {
        document.getElementById("birthDateError").classList.remove("hidden");
        isValid = false;
    } else {
        document.getElementById("birthDateError").classList.add("hidden");
    }
    // Validación de ciudades
    const originCity = document.getElementById("originCity").value;
    const destinationCity = document.getElementById("destinationCity").value;
    if (originCity && destinationCity && originCity === destinationCity) {
        document.getElementById("destinationCityError").classList.remove("hidden");
        isValid = false;
    } else {
        document.getElementById("destinationCityError").classList.add("hidden");
    }

    // Habilitar o deshabilitar el botón de envío
    document.getElementById("submitButton").disabled = !isValid;
    document.getElementById("formError").classList.toggle("hidden", isValid);
});

// Función para cargar aeropuertos desde el archivo JSON
function cargarAeropuertos() {
    fetch("airports.json")
        .then((response) => response.json())
        .then((data) => {
            const originCitySelect = document.getElementById("originCity");
            const destinationCitySelect = document.getElementById("destinationCity");

            // Iterar sobre el arreglo de aeropuertos
            data.forEach((airport) => {
                const option = document.createElement("option");
                option.value = airport.code; // Usar el código del aeropuerto como valor
                option.textContent = airport.name; // Usar el nombre del aeropuerto como texto
                originCitySelect.appendChild(option.cloneNode(true));
                destinationCitySelect.appendChild(option.cloneNode(true));
            });
        })
        .catch((error) => console.error("Error al cargar aeropuertos:", error));
}

// Función para validar que la ciudad de destino no sea la misma que la ciudad de origen
function validarCiudades() {
    const originCitySelect = document.getElementById("originCity");
    const destinationCitySelect = document.getElementById("destinationCity");
    const destinationCityError = document.getElementById("destinationCityError");

    originCitySelect.addEventListener("change", () => {
        if (
            originCitySelect.value === destinationCitySelect.value &&
            destinationCitySelect.value !== ""
        ) {
            destinationCityError.classList.remove("hidden");
            destinationCitySelect.value = ""; // Restablecer la selección de ciudad de destino
        } else {
            destinationCityError.classList.add("hidden");
        }
    });

    destinationCitySelect.addEventListener("change", () => {
        if (originCitySelect.value === destinationCitySelect.value) {
            destinationCityError.classList.remove("hidden");
        } else {
            destinationCityError.classList.add("hidden");
        }
    });
}

// Función para cargar nacionalidades desde el archivo JSON
function cargarNacionalidades() {
    fetch('paises.json')
        .then(response => response.json())
        .then(data => {
            const nationalitySelect = document.getElementById('nationality');

            // Iterar sobre el arreglo de países
            data.forEach(country => {
                const option = document.createElement('option');
                option.value = country.nameES; // Usar el nombre del país en español como valor
                option.textContent = country.nameES; // Usar el nombre del país en español como texto
                nationalitySelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error al cargar nacionalidades:', error));
}

// Llamar a la función al cargar el script
document.addEventListener("DOMContentLoaded", () => {
    cargarAeropuertos();
    validarCiudades();
    cargarNacionalidades();
});