Herramienta utilizada: Gemini
Fecha: 24 de mayo
Prompt utilizado: Que etiquetas debo usar para un login en html para que uno pueda ingresar informacion tipo la contraseña y el correo 
Resultado generado: 
Las etiquetas esenciales para el formulario
<form>: Es el contenedor principal de todo el formulario. Agrupa todos los elementos de entrada y define hacia dónde se enviarán los datos mediante atributos como action (el destino) y method (usualmente POST para inicios de sesión por seguridad).

<label>: Define una etiqueta de texto para cada campo de entrada. Es crucial para la accesibilidad (lectores de pantalla) y la usabilidad, ya que al hacer clic en el texto del label, el cursor se posiciona automáticamente dentro del campo asociado usando el atributo for.

<input>: Es el elemento estrella para capturar información. No tiene etiqueta de cierre y su comportamiento cambia por completo según el valor que le des a su atributo type.

<button>: Define el botón para procesar el formulario. Al asignarle el atributo type="submit", le indica al navegador que debe recopilar y enviar la información de los inputs al hacer clic.
Modificaciones realizadas: genere mi codigo con esta guía 
Justificación: no cambie nada ya que el chat no me dio el codigo , si no que me ayudo a guiarme para generar mi propio codigo.


Herramienta utilizada: Gemini
Fecha: 24 de mayo 
Prompt utilizado: que codigo se utiliza para acomodar en box la estructura html ? en css que incluya Contenedor centrado en pantalla,Fondo de color claro,Formulario dentro de un cuadro (card).
Uso de:márgenes,padding,bordes,tipografía.

Resultado generado: me dio codigos como este : 
/* Fondo de color claro solicitado */
    background-color: #f4f6f9; 
    
    /* Ocupa todo el alto de la pantalla visible */
    min-height: 100vh; 
    
    /* ALINEACIÓN EN CAJA: Centra el formulario horizontal y verticalmente */
    display: flex;
    justify-content: center;
    align-items: center;
    
    /* Padding de seguridad para que la tarjeta no choque con los bordes en celulares */
    padding: 20px;
Modificaciones realizadas: lo modifique según mi gusto
Justificación: utilice solo la estructura que me dio , pero yo la ajuste con lo que me parecia mejor.

