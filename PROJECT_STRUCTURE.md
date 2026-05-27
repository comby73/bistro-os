# Estructura del proyecto

```txt
bistro-os/
├── docs/                     Documentación técnica, funcional y comercial
├── prompts/                  Prompts base para agentes futuros
├── workflows/n8n/            Workflows de referencia para automatizaciones opcionales
├── supabase/                 Esquema y assets de persistencia futura
├── src/
│   ├── app/                  Rutas Next.js
│   │   ├── login/            Selector de rol demo
│   │   ├── dashboard/        Dashboard interno contextual
│   │   ├── orders/           Pedidos operativos
│   │   ├── kitchen/          Cocina / KDS
│   │   ├── reservations/     Reservas
│   │   ├── menu/             Menú operativo
│   │   ├── sales/            Ventas y caja simulada
│   │   └── demo/             Formulario comercial demo
│   ├── components/
│   │   ├── auth/             UI del selector de rol y controles de sesión demo
│   │   ├── layout/           Navbar, Footer y AppShell interno
│   │   ├── orders/           UI de pedidos y creación de pedido
│   │   ├── kitchen/          UI del KDS
│   │   ├── sales/            UI de ventas y caja
│   │   └── ...
│   ├── features/
│   │   ├── auth/             Roles demo, session helpers y acciones
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
3. Entrar por `/login` para probar roles demo.
4. Validar cambios con `npm run lint`, `npm test` y `npm run build`.
5. Mantener mocks/localStorage hasta conectar Supabase.
