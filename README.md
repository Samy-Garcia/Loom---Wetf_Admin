# LØØM & WΞFT — Frontend Web

Proyecto de e-commerce de streetwear desarrollado por estudiantes apasionados por la moda urbana y el desarrollo web.

---

## ¿Qué es esto?

**LØØM & WΞFT** es una tienda de ropa urbana (streetwear) enfocada en el mercado centroamericano. Este repositorio contiene el **frontend completo** de la plataforma web: desde la landing page principal hasta el flujo de compra, autenticación de usuarios y páginas informativas.

El proyecto nació como una idea de negocio real combinada con un reto académico de construir una aplicación web completa desde cero. El objetivo siempre fue que se viera y sintiera **premium** — nada de diseños genéricos ni plantillas aburridas.

---

## El Equipo

Somos 4 personas detrás de esto:


- **Salvador Eduardo Martínez Zúniga** 
- **Oscar Alejandro Pérez García**
- **Francisco Samuel García Cruz**  
- **Mauricio José Castro García** 




## Stack Tecnológico

| Tecnología | Uso |
|---|---|
| **React 19** | Framework principal de UI |
| **React Router DOM v7** | Navegación entre páginas (SPA) |
| **Vite 8** | Bundler / Dev server ultrarrápido |
| **Vanilla CSS** | Estilos escritos a mano, sin frameworks |
| **SweetAlert2** | Alertas y confirmaciones estilizadas |
| **Lucide React** | Íconos SVG |


## Estructura del Proyecto

```
loomAndWeft/
└── frontend/
    └── src/
        ├── components/          # Componentes reutilizables
        │   ├── Navbar/          # Barra de navegación con carrito
        │   ├── Footer/          # Pie de página
        │   ├── HeroSection/     # Banner principal con imagen de fondo
        │   ├── ProductCards/    # Tarjetas de productos destacados
        │   ├── CategoryCards/   # Tarjetas de categorías (Hombre/Mujer/Conjuntos)
        │   ├── Cart/            # Sidebar del carrito de compras
        │   ├── Buttons/         # Botones reutilizables (Primary/Secondary)
        │   ├── Cards/           # ValueCard para la página About Us
        │   └── InfoBlock/       # Bloques de texto para misión/visión
        ├── pages/               # Páginas de la aplicación
        │   ├── Home.jsx         # Landing page principal
        │   ├── Store.jsx        # Tienda con filtros por categoría
        │   ├── ProductDetail.jsx# Vista de detalle de un producto
        │   ├── AboutUs.jsx      # Historia, valores, misión y visión
        │   ├── Contact.jsx      # Formulario de contacto
        │   ├── Reviews.jsx      # Reseñas de clientes
        │   ├── Terms.jsx        # Términos y condiciones
        │   ├── Login.jsx        # Inicio de sesión
        │   ├── Register.jsx     # Crear cuenta
        │   ├── ForgotPassword.jsx # Recuperar contraseña
        │   ├── Checkout.jsx     # Resumen de pedido
        │   └── Payment.jsx      # Pantalla de pago
        ├── images/              # Imágenes locales del proyecto
        │   ├── Fondo.png        # Fondo del hero section
        │   └── Prenda.png       # Imagen de producto placeholder
        └── utils/
            └── constants.js     # Constantes globales
```

---

## Rutas de la Aplicación (React-router)

| Ruta | Página |
|---|---|
| `/` | Home — Landing principal |
| `/tienda` | Tienda (todos los productos) |
| `/hombre` | Tienda filtrada por Hombre |
| `/mujer` | Tienda filtrada por Mujer |
| `/producto/:id` | Detalle de producto |
| `/sobre-nosotros` | Sobre Nosotros |
| `/contacto` | Contacto |
| `/resenas` | Reseñas |
| `/terminos` | Términos y condiciones |
| `/login` | Iniciar sesión |
| `/registro` | Crear cuenta |
| `/recuperar` | Olvidé mi contraseña |
| `/checkout` | Resumen del pedido |
| `/pago` | Pantalla de pago |

---

## Decisiones de Diseño

- **Estética dark-tech / streetwear**: fondo oscuro casi negro (`#0a0a0a`), tipografía italic y bold, acentos en blanco puro.
- **Sin imágenes externas**: todas las imágenes del proyecto son assets locales (`Fondo.png`, `Prenda.png`).
- **Glassmorphism**: algunos elementos como el Navbar usan efectos de blur/transparencia.
- **Animaciones sutiles**: hover effects, transiciones de escala y opacidad en tarjetas y botones.
- **Mobile-first**: diseño responsive con media queries escritas a mano.

---

## Autenticación (Simulada)

Por ahora el login y el registro son **simulados** — al enviar el formulario aparece un SweetAlert de confirmación y redirige al inicio. No se guarda nada en base de datos ni localStorage. Cuando conectemos el backend esto se reemplazará con llamadas reales a la API.

---

## Cómo correrlo localmente

bash
# Clona el repo
git clone <url-del-repo>

# Entra al frontend
cd loomAndWeft/frontend

# Instala dependencias
npm install

# Corre el servidor de desarrollo
npm run dev


El sitio corre en `http://localhost:5173` por defecto (con Vite).



## Estado del Proyecto

Este proyecto está en desarrollo activo. El frontend está funcional, el backend está pendiente de integración.

- [x] Navbar con carrito lateral
- [x] Hero section con imagen propia
- [x] Tarjetas de categorías y productos
- [x] Tienda con filtros por categoría
- [x] Detalle de producto con selector de talla y cantidad
- [x] Sidebar del carrito
- [x] Flujo de checkout y pago (UI)
- [x] Páginas de autenticación (simuladas con SweetAlert2)
- [x] About Us, Contacto, Reseñas, Términos
- [ ] Integración con backend / API REST
- [ ] Carrito funcional con estado global
- [ ] Procesamiento real de pagos
