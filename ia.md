Registro de Uso de Inteligencia Artificial (ia.md)

Entrada 1
Herramienta utilizada: Gemini

Fecha: 24 de mayo

Prompt utilizado: Que etiquetas debo usar para un login en html para que uno pueda ingresar informacion tipo la contraseña y el correo

Resultado generado:
Las etiquetas esenciales para el formulario:

<form>: Es el contenedor principal de todo el formulario. Agrupa todos los elementos de entrada y define hacia dónde se enviarán los datos mediante atributos como action (el destino) y method (usualmente POST para inicios de sesión por seguridad).

<label>: Define una etiqueta de texto para cada campo de entrada. Es crucial para la accesibilidad (lectores de pantalla) y la usabilidad, ya que al hacer clic en el texto del label, el cursor se posiciona automáticamente dentro del campo asociado usando el atributo for.

<input>: Es el elemento estrella para capturar información. No tiene etiqueta de cierre y su comportamiento cambia por completo según el valor que le des a su atributo type.

<button>: Define el botón para procesar el formulario. Al asignarle el atributo type="submit", le indica al navegador que debe recopilar y enviar la información de los inputs al hacer clic.

Modificaciones realizadas: Generé mi código con esta guía.

Justificación: No cambié nada ya que el chat no me dio el código, sino que me ayudó a guiarme para generar mi propio código.

Entrada 2
Herramienta utilizada: Gemini

Fecha: 24 de mayo

Prompt utilizado: que codigo se utiliza para acomodar en box la estructura html ? en css que incluya Contenedor centrado en pantalla,Fondo de color claro,Formulario dentro de un cuadro (card). Uso de:márgenes,padding,bordes,tipografía.

Resultado generado:
Me dio códigos como este:

CSS
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
Modificaciones realizadas: Lo modifiqué según mi gusto.

Justificación: Utilicé solo la estructura que me dio, pero yo la ajusté con lo que me parecía mejor.

Entrada 3
Herramienta utilizada: Gemini

Fecha: 30 de mayo de 2026

Prompt utilizado: ¿Qué etiquetas puedo usar para mi proyecto que sean de html semantica?

Resultado generado:
Estas son etiquetas de estructura, semántica y formularios de HTML5. A diferencia de los contenedores genéricos como <div>, estas herramientas le comunican al navegador, a los motores de búsqueda y a las tecnologías de asistencia (como lectores de pantalla) la función exacta de cada elemento:

<main>: Representa el contenido central, exclusivo y único del documento (el bloque principal del login/registro).

<header>: Agrupa el contenido introductorio de una sección o tarjeta, como el área donde se ubican el logo de SportClub y el botón de retorno.

<section>: Agrupa contenidos relacionados bajo una misma temática. Se utiliza para delimitar la tarjeta blanca contenedora (.login-card o .registro-card).

<form>: Contenedor principal que captura datos, agrupando los campos de entrada y definiendo el destino del flujo mediante el atributo action.

<fieldset> y <legend>: Agrupa lógicamente campos o controles dentro de un formulario (como los bloques de preguntas), mientras que <legend> actúa como el título o enunciado de dicha agrupación.

<label>: Define el texto descriptivo de un campo de entrada. Su atributo for se enlaza matemáticamente al id del input, permitiendo que al hacer clic en el texto, el cursor se posicione automáticamente en la caja de texto, mejorando la usabilidad.

<input>: Elemento interactivo fundamental para capturar datos, cuyo comportamiento cambia por completo según su atributo type (como type="email", type="password", type="text" o type="checkbox").

<button>: Define un botón interactivo. Al configurarse con type="submit", procesa y envía de forma nativa los datos recolectados en el formulario.

<a>: Etiqueta de hipervínculo utilizada para la navegación entre páginas (como ir al registro, recuperar contraseña o los accesos de evaluación rápidos para el Coach y Administrador).

<span>: Contenedor en línea (inline) especializado para aplicar estilos específicos o manipular fragmentos de texto pequeños, como el mensaje flotante de error ("Correo inválido").

Modificaciones realizadas: Reestructuré por completo el esqueleto de mis páginas de acceso y registros sustituyendo la "divitis" (uso excesivo de <div>) por un entorno semántico rico, validando que cada entrada de datos (input) posea su respectiva descripción (label), agrupando los componentes del cuestionario con fieldset e implementando las rutas de redirección adecuadas mediante etiquetas <a> bien estructuradas en el pie de página.

Justificación: El uso exhaustivo de la semántica de HTML5 y los elementos nativos de formulario garantiza la máxima legibilidad del código fuente, optimiza de forma drástica la accesibilidad web bajo estándares internacionales (W3C) y cumple estrictamente con los criterios de desarrollo profesional y maquetación limpia exigidos en la pauta de evaluación técnica de INACAP.

Entrada 4
Herramienta utilizada: Gemini

Fecha: 1 de junio de 2026

Prompt utilizado: ¿Cómo puedo hacer para que un botón me lleve a otra página en HTML?

Resultado generado:
Para redirigir al usuario existen dos enfoques principales según el elemento que utilices:

Si usas un formulario (<form>): Debes definir el atributo action en la etiqueta de apertura del formulario apuntando a la página de destino (ej. action="dashboardUsuario.html") y asegurarse de que el botón interno tenga el atributo type="submit". No debes colocar un atributo href dentro de un <button>.

Si usas un enlace visual como botón: Debes utilizar la etiqueta de hipervínculo <a>, asignarle el destino en el atributo href (ej. href="registro.html") y aplicar clases CSS (como .btn-block o .btn-primary) para darle la apariencia visual de un botón interactivo.

Modificaciones realizadas: Corregí la etiqueta del botón de ingreso del Login quitando el atributo href que causaba conflicto, confiando la redirección al action del formulario. Además, estructuré las opciones del pie de página con etiquetas <a> enlazadas correctamente.

Justificación: Eliminar atributos inválidos limpia la estructura del código bajo los estándares de la W3C y garantiza que el flujo de navegación entre el acceso y los paneles funcione correctamente.

Entrada 5
Herramienta utilizada: Gemini

Fecha: 2 de junio de 2026

Prompt utilizado: ¿Qué debe ir en un archivo README?

Resultado generado:
Un archivo README.md (escrito en formato Markdown) es la documentación y carta de presentación de tu repositorio. Debe explicar de manera concisa qué hace el proyecto y cómo ejecutarlo. Una estructura profesional incluye:

Título y Descripción: Nombre del sistema y propósito general del software.

Capturas de pantalla / Módulos: Espacios organizados (pueden ser tablas) para mostrar la interfaz del Login, Registro y los diferentes Paneles por rol.

Tecnologías y estándares aplicados: Detalle del stack de desarrollo (HTML5 Semántico, CSS3, Diseño Adaptable).

Estructura del proyecto: Mapa visual de las carpetas principales (assets/, css/, pages/).

Instalación y despliegue: Comandos para clonar en local y el enlace directo (URL) de la página en vivo en GitHub Pages.

Modificaciones realizadas: Diseñé un archivo README.md con un enfoque comercial, añadí marcadores para enlazar las imágenes de la app, inserté el enlace oficial de GitHub Pages e incluí una sección de créditos al final.

Justificación: Permite que cualquier persona, usuario o evaluador comprenda el alcance técnico del sistema, visualice las interfaces directamente desde el repositorio y acceda al sitio web en producción en menos de un minuto.