# Estructura del proyecto

```txt
bistro-os/
├── docs/                     Documentación técnica, funcional y comercial
├── prompts/                  Prompts base para agentes futuros
├── workflows/n8n/            Workflows de referencia para automatizaciones opcionales
├── supabase/                 Esquema, policies y migraciones de persistencia real
├── src/
│   ├── app/                  Rutas Next.js
│   │   ├── login/            Login real con Supabase Auth
│   │   ├── select-branch/    Selector de restaurante/sucursal
│   │   ├── dashboard/        Dashboard interno contextual
│   │   ├── orders/           Pedidos operativos
│   │   ├── kitchen/          Cocina / KDS
│   │   ├── reservations/     Reservas
│   │   ├── menu/             Gestión operativa de carta
│   │   ├── sales/            Ventas y caja simulada
│   │   ├── users/            Gestión de usuarios
│   │   ├── branches/         Gestión de sucursales
│   │   ├── restaurants/      Gestión de restaurantes
│   │   └── demo/             Formulario comercial demo
│   ├── components/
│   │   ├── auth/             UI de login, sesión y accesos demo
│   │   ├── layout/           Navbar, Footer y AppShell interno
│   │   ├── orders/           UI de pedidos y creación de pedido
│   │   ├── kitchen/          UI del KDS
│   │   ├── sales/            UI de ventas y caja
│   │   └── ...
│   ├── features/
│   │   ├── auth/             Roles, Supabase Auth, session helpers y acciones
│   │   ├── restaurants/      Contexto multi-restaurante y acceso a datos
│   │   ├── menu/             Catálogo, CRUD de carta, repository y fallback local
│   │   ├── orders/           Tipos, cálculos y store demo compartida
│   │   ├── sales/            Tipos, mocks y cálculos de ventas
│   │   ├── leads/            Formulario comercial y automatización opcional
│   │   └── ...
│   └── lib/                  Helpers transversales, constantes e integraciones
├── tests/                    Validaciones y tests de lógica base
└── legacy/                   Material viejo o de referencia
```

## Criterio organizativo

- `src/features`: reglas de negocio, tipos, stores demo, cálculos y acciones.
- `src/components`: piezas de UI reutilizables.
- `src/app`: composición final por pantalla/ruta.
- `docs`: fuente de verdad del estado del producto y roadmap.

## Uso recomendado

1. Ejecutar `npm install`.
2. Ejecutar `npm run dev`.
3. Entrar por `/login` con usuarios demo de Supabase Auth.
4. Validar cambios con `npm run lint`, `npm test` y `npm run build`.
5. Mantener Supabase como fuente real donde ya está migrado; usar mocks/localStorage solo como fallback o para pedidos/cocina.
