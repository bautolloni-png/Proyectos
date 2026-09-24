# Bot de WhatsApp para MotorTech

Desafío técnico del proceso de selección para Customer Success Manager en ATOM. MotorTech es un concesionario oficial Toyota en Colombia (empresa del enunciado).

**[Ver el caso completo →](https://bautolloni-png.github.io/Proyectos/customer-success/#motortech)**

## El desafío

Construir en ATOM Flow Builder un bot de WhatsApp que:

- identifique si el cliente quiere comprar un vehículo o necesita el taller;
- responda consultas de ventas solo con la base de conocimiento, sin inventar, con al menos 90% de respuestas correctas en el Test Bed;
- capture los datos de quien pide una cotización o un test drive y los registre en un CRM mediante su API (token, búsqueda por correo, creación si no existe);
- agende citas de taller y registre cada una como una fila nueva en Google Sheets.

## Resultados

| | |
|---|---|
| Test Bed del asesor de ventas | 10 de 10 respuestas correctas |
| Integración con el CRM | Probada con contacto nuevo y con contacto existente |
| Registro de citas | Una fila por cita en Google Sheets, vía Google Apps Script |
| Cambio de Ventas a Taller | Dentro de la misma conversación |

## Qué hay en esta carpeta

- [`flow/motortech-toyota-colombia-flow.json`](flow/motortech-toyota-colombia-flow.json): el flujo exportado de ATOM. Los tokens, claves y URLs privadas están reemplazados por marcadores como `<CRM_BEARER_TOKEN>`.
- [`Documentacion_Bot_MotorTech.pdf`](Documentacion_Bot_MotorTech.pdf): arquitectura, prompts, integraciones, pruebas, problemas resueltos y mejoras pendientes.
- [`Testbed_Toyota_Colombia_MotorTech.xlsx`](Testbed_Toyota_Colombia_MotorTech.xlsx): las diez preguntas del Test Bed con capturas, las pruebas de conversación y el registro de iteraciones.

## Videos

- [Ventas](https://www.loom.com/share/f906a8a9c511428caf58c1ed7787cbf8): consultas, captura del lead y registro en el CRM
- [Taller](https://www.loom.com/share/3aded0cb994a4459af1e63d13397dfd3): agendamiento y registro de la cita en Google Sheets
- [Test Bed](https://www.loom.com/share/415eee00573344359954256c15f75554): las diez preguntas de validación

## Planillas

- [Test Bed en Google Sheets](https://docs.google.com/spreadsheets/d/10EyuI5lfp0J-jNhDXGFfm0qARVBU5Es10pYyPI3eWEs)
- [Citas de taller](https://docs.google.com/spreadsheets/d/1w_grXUs9h-dljgpVBecnpxnd_ZMUFCwAgAMKNrCVt4Q)
