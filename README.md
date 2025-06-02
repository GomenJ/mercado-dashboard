csv bajar formato
En vez de nuestra grafica poner descarga csv

Currently, two official plugins are available:

## Tarea 1 
Fanny
dos cotizaciones
## Tarea 2
Servidor ampliar
api key de Gemini
## Tarea 3
Mediciones de los clientes, pidiendo la autorización para el SIMEX
## Tarea 4
Reporte del MBP


fetch("http://127.0.0.1:5001/api/v1/mda_mtr/pml_yearly_comparison_data")
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json(); // or response.text(), response.blob(), etc.
  })
  .then(data => {
    // Process the data
    console.log(data);
  })
  .catch(error => {
    // Handle errors
    console.error('Fetch error:', error);
  });