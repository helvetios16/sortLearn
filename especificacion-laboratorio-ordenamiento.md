# Laboratorio Interactivo de Algoritmos de Ordenamiento
## Sistema de Aprendizaje mediante Metáfora Visual

---

## 📋 Índice

1. [Visión General](#visión-general)
2. [Modelo Mental Teórico](#modelo-mental-teórico)
3. [Arquitectura Visual](#arquitectura-visual)
4. [Componentes del Sistema](#componentes-del-sistema)
5. [Mecánicas de Interacción](#mecánicas-de-interacción)
6. [Sistema de Retroalimentación](#sistema-de-retroalimentación)
7. [Modos de Operación](#modos-de-operación)
8. [Progresión Pedagógica](#progresión-pedagógica)
9. [Mapeo Conceptual](#mapeo-conceptual)

---

## 🎯 Visión General

### Objetivo Educativo
Transformar conceptos abstractos de algoritmos de ordenamiento en experiencias tangibles mediante una interfaz gráfica interactiva que simula un escenario físico del mundo real.

### Principio Fundamental
**"Aprender ordenamiento como si fuera un problema físico, no matemático"**

Los estudiantes manipulan objetos concretos (botellas) usando herramientas limitadas (balanza), descubriendo por sí mismos los patrones que subyacen a los algoritmos clásicos.

### Público Objetivo
- Estudiantes de programación (principiantes a intermedios)
- Autodidactas que buscan comprender Big O de forma intuitiva
- Educadores que necesitan material visual para enseñar algoritmos

---

## 🧠 Modelo Mental Teórico

### 1.1 Analogía del Mundo Real

#### 1.1.1 El Problema Base
**Escenario:** Tienes un conjunto de botellas de leche con diferentes niveles de llenado. Deben ordenarse de menor a mayor peso.

**Restricción Física:** Solo puedes comparar dos botellas a la vez usando una balanza de dos platillos.

#### 1.1.2 Mapeo Conceptual
| Concepto Abstracto | Representación Física |
|-------------------|----------------------|
| Dato/Elemento | Botella de leche |
| Valor numérico | Nivel de llenado (visual) |
| Comparación | Colocar botellas en balanza |
| Arreglo/Lista | Mesa de trabajo |
| Zona ordenada | Estantería final |
| Zona desordenada | Mesa de trabajo activa |

#### 1.1.3 Restricción de Herramientas
**Principio:** La balanza es la única herramienta de comparación disponible.

**Implicaciones:**
- No se puede "adivinar" el peso sin pesar
- Solo se pueden comparar dos elementos a la vez
- Cada comparación tiene un costo (tiempo, esfuerzo)
- Simula la operación `if (a < b)` en código

---

### 1.2 Estructura del Proceso de Ordenamiento

#### 1.2.1 Concepto de "Pasada"
**Definición:** Una pasada es un recorrido completo sobre el conjunto de datos con un propósito específico.

**Ejemplos:**
- **Burbuja:** Comparar pares adyacentes y hacer "flotar" el más pesado
- **Selección:** Buscar la botella más liviana en toda la mesa
- **Inserción:** Tomar una botella y encontrar su posición correcta

#### 1.2.2 Iteración vs. Progreso Global
**Visión Local:** En cada momento, el usuario solo ve/compara 2 botellas.

**Visión Global:** Después de múltiples comparaciones, emerge un patrón de orden.

**Objetivo Pedagógico:** Enseñar que los algoritmos construyen orden mediante decisiones locales repetidas.

#### 1.2.3 Zona de Consolidación
**Concepto:** A medida que el algoritmo progresa, algunas botellas ya están en su posición final.

**Representación Visual:**
- **Zona Activa:** Botellas que aún pueden moverse (fondo normal)
- **Zona Consolidada:** Botellas en posición final (fondo verde/brillante)

**Ejemplo en Burbuja:** Después de la primera pasada, la botella más pesada está consolidada al final.

#### 1.2.4 Invariantes del Algoritmo
**Definición:** Condiciones que siempre son verdaderas en ciertos puntos del algoritmo.

**Ejemplos:**
- **Selection Sort:** "Las primeras N posiciones ya contienen los N elementos más pequeños en orden"
- **Bubble Sort:** "Los últimos N elementos están en su posición final"

**Visualización:** Usar colores o marcadores visuales para mostrar estas zonas.

---

### 1.3 Descomposición de Sub-tareas

#### 1.3.1 Identificar el Objetivo
**Pregunta inicial:** ¿Qué botella busco en esta pasada?
- La más liviana (Selection)
- La más pesada (Bubble hacia arriba)
- La siguiente en orden (Insertion)

#### 1.3.2 Estrategia de Búsqueda
**Opciones:**
- **Lineal:** Revisar todas las botellas una por una
- **Dividir y Conquistar:** Separar en grupos, ordenar grupos, combinar (Merge/Quick)
- **Incremental:** Mantener parte ordenada, insertar nuevos elementos (Insertion)

#### 1.3.3 Criterio de Comparación
**Decisión:** ¿Qué hacer después de pesar dos botellas?
- Intercambiar posiciones
- Marcar la ganadora para siguiente comparación
- Descartar una de las dos

#### 1.3.4 Atomicidad de Operaciones
**Principio:** Cada operación es indivisible:
- **Pesar:** No se puede "pesar a medias"
- **Mover:** La botella se mueve completa, no por partes
- **Comparar:** El resultado es binario (mayor/menor/igual)

---

### 1.4 Patrones Recurrentes

#### 1.4.1 Patrón: Barrido Lineal
**Descripción:** Recorrer todas las botellas en orden, una por una.

**Aplicación:**
- Bubble Sort: Barrido comparando pares adyacentes
- Selection Sort: Barrido buscando el mínimo

#### 1.4.2 Patrón: Selección de Campeón
**Descripción:** Mantener un "campeón temporal" y compararlo con todos los demás.

**Aplicación:**
- Selection Sort: El mínimo actual es el campeón

#### 1.4.3 Patrón: Inserción Ordenada
**Descripción:** Mantener una zona ordenada e insertar nuevos elementos en la posición correcta.

**Aplicación:**
- Insertion Sort
- Ordenar cartas en la mano

#### 1.4.4 Patrón: Dividir y Conquistar
**Descripción:** Dividir el problema en sub-problemas más pequeños, resolverlos, y combinar soluciones.

**Aplicación:**
- Merge Sort: Dividir a la mitad recursivamente
- Quick Sort: Particionar en torno a un pivote

---

### 1.5 Estimación de Costo (Big O Intuitivo)

#### 1.5.1 Concepto de "Esfuerzo"
**Pregunta:** ¿Cuántos pesajes necesito para ordenar N botellas?

**Métricas:**
- **Pesajes:** Cada uso de la balanza
- **Movimientos:** Cada cambio de posición de una botella
- **Pasadas:** Cuántas veces se recorre el conjunto completo

#### 1.5.2 Relación Tamaño-Esfuerzo
**Experimento Mental:**
| Número de Botellas | Pesajes Mínimos | Pesajes Típicos (Bubble) |
|-------------------|-----------------|-------------------------|
| 3 | 3 | 6 |
| 5 | 10 | 20 |
| 10 | 45 | 90 |
| 100 | 4,950 | 9,900 |

**Objetivo:** Que el estudiante descubra que el esfuerzo crece cuadráticamente.

#### 1.5.3 Comparación de Estrategias
**Pregunta:** ¿Cuál método es más eficiente?

**Sistema de Medallas:**
- 🥇 Oro: Usó el mínimo de pesajes teórico
- 🥈 Plata: Usó menos de 2N²
- 🥉 Bronce: Completó el ordenamiento
- ⚠️ Revisar: Usó más de 3N²

#### 1.5.4 Introducción a Big O sin Matemáticas
**Frases Pedagógicas:**
- "Si duplicas el número de botellas, ¿cuánto más trabajo necesitas?"
- "Bubble Sort necesita aproximadamente N×N pesajes"
- "Merge Sort necesita aproximadamente N×log(N) pesajes"

**Visualización:** Gráfica que muestra cómo crece el esfuerzo según el tamaño.

---

## 🎨 Arquitectura Visual

### 2.1 Diseño de la Interfaz

#### 2.1.1 Layout Principal
```
┌─────────────────────────────────────────────────────────┐
│                    LABORATORIO DE                        │
│                 ALGORITMOS DE ORDENAMIENTO               │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌───────────────────────────────────────────────────┐  │
│  │         ZONA DE BOTELLAS DESORDENADAS             │  │
│  │   [🍼] [🍼] [🍼] [🍼] [🍼] [🍼] [🍼]             │  │
│  └───────────────────────────────────────────────────┘  │
│                                                           │
│  ┌───────────────────────────────────────────────────┐  │
│  │              BALANZA DE COMPARACIÓN               │  │
│  │                                                    │  │
│  │        [🍼]           ⚖️           [🍼]          │  │
│  │       Platillo             Platillo              │  │
│  │       Izquierdo            Derecho               │  │
│  │                                                    │  │
│  │            [PESAR] [RESETEAR]                     │  │
│  └───────────────────────────────────────────────────┘  │
│                                                           │
│  ┌───────────────────────────────────────────────────┐  │
│  │          ESTANTERÍA ORDENADA ✓                    │  │
│  │   [🍼] [🍼] [🍼] [🍼]                            │  │
│  └───────────────────────────────────────────────────┘  │
│                                                           │
├─────────────────────────────────────────────────────────┤
│  📊 ESTADÍSTICAS                                         │
│  ⚖️  Pesajes: 12    📦 Movimientos: 18    ⏱️ Tiempo: 45s│
└─────────────────────────────────────────────────────────┘
```

#### 2.1.2 Paleta de Colores Semántica

**Zona Desordenada:**
- Fondo: Gris claro (#F5F5F5)
- Botellas: Colores variados (rojo, azul, verde, naranja, morado)

**Zona de Comparación:**
- Fondo: Amarillo suave (#FFF9C4) - Atención activa
- Balanza: Metálico (#95A5A6)

**Zona Consolidada:**
- Fondo: Verde suave (#C8E6C9)
- Botellas: Mismo color original + brillo/glow

**Estados Especiales:**
- **Seleccionado:** Borde amarillo brillante
- **En movimiento:** Semi-transparente
- **Comparando:** Pulso suave de luz

---

### 2.2 Componentes Visuales Detallados

#### 2.2.1 Botella de Leche
**Características:**
- **Forma:** Cilindro con cuello (forma clásica de botella)
- **Material:** Vidrio transparente con reflejos
- **Contenido:** Líquido blanco/cremoso
- **Nivel de llenado:** Visible y proporcional al peso
- **Etiqueta:** Número ID pequeño en el cuello

**Estados Visuales:**
| Estado | Apariencia |
|--------|-----------|
| Normal | Opacidad 100%, sombra suave |
| Hover | Escala 105%, sombra pronunciada |
| Arrastre | Opacidad 70%, rotación leve |
| Consolidada | Brillo verde, partículas de éxito |
| Comparando | Pulso de luz amarilla |

#### 2.2.2 Balanza de Platillos
**Elementos:**
- **Base:** Triángulo sólido (fulcro)
- **Brazo:** Barra horizontal con pivote central
- **Platillos:** Dos platos circulares suspendidos
- **Cadenas:** Conectan platillos al brazo
- **Indicador:** Pequeña flecha en el centro

**Mecánica Visual:**
```
         [Botella A]                    [Botella B]
              |                              |
         _____|_____                    _____|_____
        |___________|                  |___________|
            |   |                          |   |
            |   |                          |   |
        =========================================
                         /\
                        /  \
                       /____\
```

**Animaciones:**
- **Peso mayor izquierda:** Platillo izquierdo baja, derecho sube, brazo rota
- **Peso mayor derecha:** Platillo derecho baja, izquierdo sube
- **Pesos iguales:** Ambos platillos en equilibrio horizontal
- **Física:** Movimiento con rebote elástico (ease-out elastic)

#### 2.2.3 Estantería de Consolidación
**Características:**
- **Diseño:** Estructura de madera con compartimentos
- **Separadores:** Divisiones verticales claras
- **Orden:** Las botellas se alinean de izquierda a derecha (menor a mayor)
- **Feedback:** Cada botella que entra hace un efecto de "encajar" (snap)

**Indicadores:**
- **Vacía:** Sombras de botellas fantasma en cada posición
- **Llenándose:** Botellas aparecen con animación de caída suave
- **Completa:** Confeti, sonido de éxito

---

### 2.3 Sistema de Señales Visuales

#### 2.3.1 Foco de Atención
**Objetivo:** Reducir carga cognitiva mostrando solo lo relevante.

**Técnicas:**
- **Dimming:** Cuando se seleccionan dos botellas, el resto pierde 50% de opacidad
- **Spotlight:** Círculo de luz alrededor de las botellas en comparación
- **Blur:** Desenfoque leve en elementos no activos

#### 2.3.2 Retroalimentación Inmediata
**Eventos con Feedback Visual:**

| Acción | Feedback Visual | Feedback Sonoro |
|--------|----------------|-----------------|
| Seleccionar botella | Borde brillante + lift | Click suave |
| Colocar en balanza | Snap a posición | Clink metálico |
| Pesar | Balanza se inclina | Clink + suspenso |
| Resultado comparación | Ganadora brilla | Campana |
| Mover a estantería | Trail de partículas | Whoosh |
| Consolidar | Efecto glow verde | Ding de éxito |

#### 2.3.3 Guías Visuales Adaptativas
**Contexto:** El sistema detecta patrones de confusión y ofrece ayudas.

**Ejemplos:**
- Si el usuario arrastra botellas sin pesarlas → "¿Has probado usar la balanza?"
- Si repite comparaciones innecesarias → "Ya comparaste estas dos botellas antes"
- Si no usa la zona consolidada → Flecha animada apuntando a estantería

---

## 🔧 Componentes del Sistema

### 3.1 Elemento: Botella

#### Propiedades
- **ID:** Identificador único
- **Peso/Valor:** Número del 1-100 (representado por nivel de llenado)
- **Color:** Color visual para identificación
- **Posición:** Ubicación actual (mesa, balanza, estantería)
- **Estado:** Normal, Seleccionada, Consolidada, Comparando

#### Comportamientos
- **Arrastrable:** Puede moverse con mouse/touch
- **Pesable:** Puede colocarse en balanza
- **Comparable:** Participa en comparaciones
- **Consolidable:** Puede marcarse como ordenada

---

### 3.2 Elemento: Balanza

#### Propiedades
- **Platillo Izquierdo:** Botella actual o null
- **Platillo Derecho:** Botella actual o null
- **Estado:** Vacía, Lista, Pesando, Resultado

#### Comportamientos
- **Aceptar botellas:** Drop zone para arrastrar botellas
- **Pesar:** Ejecutar comparación entre botellas
- **Mostrar resultado:** Animar inclinación según diferencia de peso
- **Limpiar:** Remover botellas de platillos

#### Restricciones
- Solo acepta exactamente 2 botellas (una por platillo)
- No se puede pesar si falta alguna botella
- Las botellas deben ser diferentes

---

### 3.3 Elemento: Zona de Trabajo

#### Sub-zonas
1. **Mesa Desordenada**
   - Contiene botellas pendientes de ordenar
   - Permite reorganización libre
   - Acepta botellas devueltas desde balanza

2. **Área de Comparación**
   - Contiene la balanza
   - Zona de alta visibilidad
   - Controles de acción (botones Pesar/Resetear)

3. **Estantería Ordenada**
   - Recibe botellas en posición final
   - Solo acepta botellas en orden correcto (opcional)
   - Muestra progreso visual

---

### 3.4 Elemento: Panel de Estadísticas

#### Métricas Rastreadas
1. **Pesajes:** Contador de veces que se usó la balanza
2. **Movimientos:** Veces que se movió una botella
3. **Intercambios:** Cambios de posición entre botellas
4. **Tiempo:** Cronómetro desde inicio
5. **Comparaciones redundantes:** Pesajes repetidos de mismo par

#### Visualización
- **Contadores numéricos:** Grandes y visibles
- **Gráfica de progreso:** Barra que muestra % de botellas ordenadas
- **Indicador de eficiencia:** Color según qué tan cerca está del óptimo
  - Verde: Muy eficiente
  - Amarillo: Aceptable
  - Rojo: Ineficiente

---

### 3.5 Elemento: Sistema de Ayuda Contextual

#### Tipos de Ayuda
1. **Tooltips:** Información al pasar sobre elementos
2. **Mensajes sugerentes:** Aparecen según contexto
3. **Tutorial interactivo:** Secuencia guiada para primer uso
4. **Modo demostración:** El sistema ordena automáticamente mostrando cada paso

#### Niveles de Asistencia
- **Nivel 0:** Sin ayuda (expertos)
- **Nivel 1:** Tooltips básicos
- **Nivel 2:** Sugerencias cuando hay inactividad
- **Nivel 3:** Modo tutorial completo

---

## 🎮 Mecánicas de Interacción

### 4.1 Flujo de Interacción Principal

#### Secuencia Básica
```
1. Usuario selecciona botella de mesa → Se resalta
2. Usuario arrastra botella a platillo izquierdo → Snap a posición
3. Usuario selecciona segunda botella → Se resalta
4. Usuario arrastra segunda botella a platillo derecho → Snap a posición
5. Usuario presiona botón "PESAR" → Animación de balanza
6. Sistema muestra resultado → Balanza se inclina
7. Usuario decide acción:
   a. Mover una botella a estantería (consolidar)
   b. Intercambiar posiciones en mesa
   c. Regresar ambas a mesa
   d. Comparar con otra botella
8. Repetir hasta ordenar todas las botellas
```

#### Atajos y Optimizaciones
- **Doble click en botella:** Selección rápida
- **Click derecho:** Menú contextual con acciones
- **Teclado:** Números para seleccionar botellas
- **Gestos:** Swipe para mover a zonas

---

### 4.2 Modos de Arrastre (Drag & Drop)

#### Comportamiento Detallado

**Inicio del arrastre:**
- Botella se levanta (efecto z-index)
- Sombra se alarga
- Cursor cambia a "agarrando"
- Aparecen zonas válidas de destino

**Durante el arrastre:**
- Botella sigue cursor/dedo
- Zonas válidas se iluminan al pasar sobre ellas
- Zonas inválidas muestran ícono de prohibido

**Al soltar:**
- **Sobre zona válida:** Snap con animación suave
- **Sobre zona inválida:** Regresa a posición original con rebote
- **Fuera de la interfaz:** Regresa a última posición válida

#### Restricciones de Arrastre
| Origen | Destinos Válidos |
|--------|-----------------|
| Mesa | Balanza (platillos), Estantería* |
| Balanza | Mesa, Estantería* |
| Estantería | Mesa (si modo permite deshacer) |

*Estantería solo si está habilitada la opción de consolidación manual

---

### 4.3 Interacción con la Balanza

#### Estados de la Balanza

**Estado 1: Vacía**
- Platillos en posición horizontal
- Mensaje: "Coloca dos botellas para comparar"
- Botón "PESAR" deshabilitado

**Estado 2: Con una botella**
- Un platillo ocupado, otro vacío
- Mensaje: "Coloca una segunda botella"
- Botón "PESAR" deshabilitado

**Estado 3: Lista**
- Ambos platillos ocupados
- Mensaje: "¡Listo para pesar!"
- Botón "PESAR" habilitado y pulsando

**Estado 4: Pesando (animación)**
- Balanza se mueve según resultado
- Sonido de pesaje
- Contador de pesajes aumenta
- Duración: 1.5 segundos

**Estado 5: Resultado mostrado**
- Balanza inclinada mostrando ganador
- Botella más pesada hacia abajo
- Indicador visual del resultado
- Opciones: "OTRA COMPARACIÓN" o "CONTINUAR"

---

### 4.4 Sistema de Comparación

#### Resultado de Comparación

**Información mostrada:**
- **Ganadora:** Botella más pesada resaltada
- **Diferencia:** Opcional, muestra diferencia de peso
- **Historial:** Se guarda el par comparado

**Representación Visual:**
```
[Botella A: 45ml]     ⚖️     [Botella B: 78ml]
                      
    ↓                        ↑↑↑
 (Más liviana)         (MÁS PESADA) ✓
```

**Feedback Adicional:**
- Botella ganadora brilla
- Sonido de "ding"
- Contador de pesajes +1

---

### 4.5 Consolidación en Estantería

#### Mecánica de Consolidación

**Opción A: Libre**
- Usuario puede colocar cualquier botella en estantería
- Sin validación de orden
- Útil para exploración libre

**Opción B: Validada**
- Sistema valida que la botella sea la siguiente en orden
- Si es incorrecta: rebote + mensaje "No es la correcta aún"
- Si es correcta: snap + efecto de éxito

**Opción C: Semi-guiada**
- Usuario puede colocar botellas libremente
- Sistema resalta cuál debería ser la siguiente
- Sin bloqueo, pero con sugerencias

#### Efectos de Consolidación
- Botella cambia a color verde brillante
- Efecto de partículas
- Sonido de "logro"
- La botella queda bloqueada (no se puede mover)
- Contador de progreso aumenta

---

## 📊 Sistema de Retroalimentación

### 5.1 Retroalimentación Inmediata

#### Durante la Acción
**Eventos con feedback instantáneo:**

1. **Seleccionar botella**
   - Visual: Borde brillante
   - Sonoro: Click
   - Háptico: Vibración leve (móvil)

2. **Arrastrar botella**
   - Visual: Sombra dinámica, trail de movimiento
   - Cursor: Cambia a "mano agarrando"

3. **Colocar en balanza**
   - Visual: Animación de "snap" a posición
   - Sonoro: Clink metálico
   - Balanza: Se ajusta por el peso

4. **Ejecutar pesaje**
   - Visual: Balanza se mueve, botellas tiemblan levemente
   - Sonoro: Secuencia de sonidos (suspense → resultado)
   - Temporal: 1.5s de animación

5. **Consolidar botella**
   - Visual: Efecto de brillo, cambio de color
   - Sonoro: Ding de éxito
   - Progreso: Barra de progreso avanza

---

### 5.2 Retroalimentación Acumulativa

#### Panel de Estadísticas en Vivo

**Métricas mostradas:**
```
┌──────────────────────────────────────┐
│  📊 ESTADÍSTICAS DE RENDIMIENTO      │
├──────────────────────────────────────┤
│  ⚖️  Pesajes realizados:      24     │
│  📦  Movimientos totales:     31     │
│  🔄  Intercambios:            12     │
│  ⏱️  Tiempo transcurrido:     2:15   │
│  📈  Eficiencia:              78%    │
├──────────────────────────────────────┤
│  [════════════════     ] 80% completo│
└──────────────────────────────────────┘
```

**Indicadores de Eficiencia:**
- **Verde (>80%):** "¡Excelente estrategia!"
- **Amarillo (50-80%):** "Buen trabajo, pero podrías optimizar"
- **Rojo (<50%):** "¿Hay una forma más eficiente?"

---

### 5.3 Retroalimentación al Completar

#### Pantalla de Resultados

```
┌────────────────────────────────────────┐
│          🎉 ¡ORDENAMIENTO              │
│             COMPLETADO! 🎉             │
├────────────────────────────────────────┤
│                                        │
│  Botellas ordenadas:  10               │
│  Tiempo total:        3:42             │
│  Pesajes usados:      45               │
│  Pesajes óptimos:     25               │
│                                        │
│  Tu eficiencia:       56% 🥉           │
│                                        │
├────────────────────────────────────────┤
│  📝 ANÁLISIS:                          │
│  Usaste un patrón similar a            │
│  "Bubble Sort". Este algoritmo         │
│  requiere aproximadamente N² pesajes.  │
│                                        │
│  💡 SUGERENCIA:                        │
│  ¿Podrías hacerlo en menos pesajes     │
│  buscando primero la botella más       │
│  liviana en cada pasada?               │
│                                        │
│  [INTENTAR DE NUEVO] [VER SOLUCIÓN]   │
└────────────────────────────────────────┘
```

#### Sistema de Medallas

| Medalla | Criterio | Mensaje |
|---------|----------|---------|
| 🥇 Oro | Usó pesajes óptimos ±5% | "¡Maestro del ordenamiento!" |
| 🥈 Plata | Usó menos de 1.5× óptimo | "Muy bien, casi perfecto" |
| 🥉 Bronce | Completó el ordenamiento | "Buen trabajo, sigue mejorando" |
| 🏅 Participación | Intentó ordenar | "Gran esfuerzo, ¡no te rindas!" |

---

### 5.4 Sistema de Hints (Pistas)

#### Tipos de Pistas

**Nivel 1: Observación**
- "Nota: La botella #3 parece más pesada que la #1"
- "Interesante: Ya has consolidado 3 botellas"

**Nivel 2: Sugerencia General**
- "¿Has considerado buscar la botella más liviana primero?"
- "Podrías comparar botellas adyacentes"

**Nivel 3: Guía Específica**
- "Intenta comparar la botella #2 con la #5"
- "La botella más liviana está entre las primeras 3"

**Nivel 4: Demostración**
- "Modo Fantasma activado: observa cómo se hace"
- [Sistema ejecuta el siguiente paso]

#### Activación de Hints
- **Manual:** Usuario presiona botón "💡 Pista"
- **Automática:** Después de 30s de inactividad
- **Adaptativa:** Si el usuario repite errores

---

### 5.5 Historial de Acciones

#### Visualización del Historial

```
┌──────────────────────────────────────┐
│  📜 HISTORIAL DE COMPARACIONES       │
├──────────────────────────────────────┤
│  1. 🍼(45ml) vs 🍼(78ml) → Derecha   │
│  2. 🍼(78ml) vs 🍼(23ml) → Izquierda │
│  3. 🍼(45ml) vs 🍼(23ml) → Izquierda │
│  4. 🍼(45ml) vs 🍼(67ml) → Derecha   │
│  ...                                  │
└──────────────────────────────────────┘
```

#### Funcionalidades
- **Ver historial completo:** Expandir lista
- **Detectar redundancias:** Resaltar comparaciones repetidas
- **Exportar:** Guardar secuencia de pasos
- **Reproducir:** Ver animación de todos los pasos

---

## 🎭 Modos de Operación

### 6.1 Modo Libre (Sandbox)

#### Descripción
El usuario experimenta libremente sin restricciones ni guías.

#### Características
- Sin validación de orden en estantería
- Sin límite de tiempo
- Sin penalización por ineficiencia
- Estadísticas visibles pero no invasivas
- Permite deshacer acciones

#### Objetivo Pedagógico
Permitir exploración y descubrimiento natural de patrones.

---

### 6.2 Modo Guiado (Tutorial)

#### Descripción
Sistema proporciona instrucciones paso a paso para aprender un algoritmo específico.

#### Estructura del Tutorial

**Fase 1: Introducción**
- Presentación de la metáfora
- Explicación de controles
- Primer pesaje asistido

**Fase 2: Práctica Guiada**
- Sistema indica qué botellas comparar
- Usuario ejecuta la acción
- Feedback inmediato

**Fase 3: Práctica Semi-Guiada**
- Sistema da objetivos ("Busca la botella más liviana")
- Usuario decide cómo lograrlo
- Pistas disponibles si se atora

**Fase 4: Práctica Independiente**
- Usuario ordena sin ayuda
- Sistema observa y analiza estrategia

---

### 6.3 Modo Desafío

#### Descripción
Escenarios con restricciones y objetivos específicos.

#### Tipos de Desafíos

**Desafío 1: Eficiencia**
- Objetivo: Ordenar N botellas en menos de X pesajes
- Ejemplo: 10 botellas en máximo 30 pesajes
- Recompensa: Desbloquear nivel siguiente

**Desafío 2: Contra Reloj**
- Objetivo: Ordenar en tiempo límite
- Ejemplo: 5 botellas en 60 segundos
- Dificultad: Incrementa con niveles

**Desafío 3: Algoritmo Específico**
- Objetivo: Ordenar usando solo un algoritmo particular
- Ejemplo: "Usa solo Selection Sort"
- Validación: Sistema detecta patrón usado

**Desafío 4: Botellas Parcialmente Ordenadas**
- Escenario: Algunas botellas ya en posición correcta
- Objetivo: Completar con mínimos movimientos
- Enseña: Optimización de casos especiales

---

### 6.4 Modo Fantasma (Visualización de Algoritmos)

#### Descripción
El sistema ejecuta un algoritmo automáticamente mientras el usuario observa.

#### Funcionamiento

**Preparación:**
1. Usuario ordena manualmente un conjunto de botellas
2. Sistema graba cada acción (comparación, movimiento)
3. Al terminar, usuario puede activar "Modo Fantasma"

**Reproducción:**
1. Sistema resetea botellas a posición inicial
2. Reproduce paso a paso las acciones del usuario
3. Velocidad ajustable (0.5x, 1x, 2x)
4. Pausar/reanudar en cualquier momento

**Comparación con Algoritmo Clásico:**
```
┌────────────────────────────────────┐
│  TU MÉTODO     vs.    BUBBLE SORT  │
├────────────────────────────────────┤
│  Pesajes: 45          Pesajes: 45  │
│  Tiempo: 3:42         Tiempo: 0:12 │
│  Patrón: Similar      Patrón: ---  │
└────────────────────────────────────┘
```

**Valor Pedagógico:**
- Ver la propia estrategia "en tercera persona"
- Comparar con algoritmos estándar
- Identificar redundancias
- Entender por qué un algoritmo es más eficiente

---

### 6.5 Modo Comparación

#### Descripción
Ver múltiples algoritmos ordenando el mismo conjunto simultáneamente.

#### Interfaz
```
┌─────────────────────────────────────────────────────┐
│        COMPARACIÓN DE ALGORITMOS                    │
├─────────────────────────────────────────────────────┤
│                                                      │
│  BUBBLE SORT         SELECTION SORT     QUICK SORT  │
│  ┌──────────┐        ┌──────────┐      ┌──────────┐│
│  │🍼🍼🍼🍼🍼│        │🍼🍼🍼🍼🍼│      │🍼🍼🍼🍼🍼││
│  │          │        │          │      │          ││
│  │ Pesajes: │        │ Pesajes: │      │ Pesajes: ││
│  │    45    │        │    25    │      │    18    ││
│  └──────────┘        └──────────┘      └──────────┘│
│                                                      │
│  [REPRODUCIR] [PAUSAR] [VELOCIDAD: 1x]              │
└─────────────────────────────────────────────────────┘
```

#### Características
- Sincronización: Todos inician al mismo tiempo
- Destaca el primero en terminar
- Muestra contador de operaciones en vivo
- Al finalizar: tabla comparativa de rendimiento

---

## 🎓 Progresión Pedagógica

### 7.1 Niveles de Aprendizaje

#### Nivel 1: Exploración (Principiante)
**Objetivo:** Familiarización con la metáfora.

**Actividades:**
- Tutorial interactivo de controles
- Ordenar 3 botellas libremente
- Introducción al concepto de "pesaje"

**Sin presión de:**
- Eficiencia
- Tiempo
- Método específico

**Criterio de éxito:** Completar ordenamiento (sin importar cómo)

---

#### Nivel 2: Patrones Básicos (Intermedio)
**Objetivo:** Descubrir patrones de ordenamiento.

**Actividades:**
- Ordenar 5-7 botellas
- Introducción a "pasadas"
- Concepto de "zona consolidada"

**Desafío:**
- "¿Puedes ordenar en menos de 20 pesajes?"
- "Intenta hacer que cada botella solo se mueva una vez"

**Criterio de éxito:** Reconocer patrón repetitivo

---

#### Nivel 3: Estrategias Específicas (Avanzado)
**Objetivo:** Aprender algoritmos clásicos.

**Actividades:**
- Desafíos de algoritmo específico
- "Ordena usando solo Selection Sort"
- "Imita el patrón de Bubble Sort"

**Herramientas:**
- Modo Fantasma para ver algoritmo en acción
- Comparación lado a lado

**Criterio de éxito:** Reproducir algoritmo correctamente

---

#### Nivel 4: Optimización (Experto)
**Objetivo:** Comprender complejidad algorítmica.

**Actividades:**
- Ordenar 10-20 botellas con restricción de pesajes
- Analizar Big O de propia estrategia
- Experimentos con casos especiales (ya ordenado, inverso)

**Herramientas:**
- Gráficas de complejidad
- Análisis automático de estrategia
- Comparación con óptimo teórico

**Criterio de éxito:** Alcanzar eficiencia >85%

---

### 7.2 Curva de Dificultad

#### Progresión de Complejidad

| Nivel | Botellas | Pesajes Óptimos | Dificultad |
|-------|----------|----------------|-----------|
| 1 | 3 | 3 | ★☆☆☆☆ |
| 2 | 5 | 10 | ★★☆☆☆ |
| 3 | 7 | 21 | ★★★☆☆ |
| 4 | 10 | 45 | ★★★★☆ |
| 5 | 15 | 105 | ★★★★★ |

---

### 7.3 Sistema de Desbloqueos

#### Progresión Escalonada

**Estructura:**
```
Nivel 1 (Desbloqueado inicialmente)
   ↓
Completar Nivel 1
   ↓
Desbloquear Nivel 2 + Modo Fantasma
   ↓
Completar Nivel 2 con Bronce+
   ↓
Desbloquear Nivel 3 + Modo Comparación
   ↓
Completar Nivel 3 con Plata+
   ↓
Desbloquear Nivel 4 + Algoritmos Avanzados
```

**Contenido Desbloqueable:**
- Nuevos niveles
- Modos especiales
- Algoritmos para visualizar
- Desafíos extras
- Herramientas de análisis

---

## 🗺️ Mapeo Conceptual

### 8.1 De lo Físico a lo Abstracto

#### Tabla de Correspondencias

| Concepto Físico | Concepto Programático | Notación |
|----------------|----------------------|----------|
| Botella | Elemento/Dato | `arr[i]` |
| Nivel de llenado | Valor numérico | `value` |
| Mesa de trabajo | Arreglo/Lista | `array` |
| Balanza | Operador de comparación | `if (a < b)` |
| Pesar | Comparación | `compare(a, b)` |
| Platillo baja | Elemento mayor | `a > b` |
| Platillos equilibrados | Elementos iguales | `a == b` |
| Mover botella | Asignación | `arr[i] = value` |
| Intercambiar botellas | Swap | `swap(arr, i, j)` |
| Estantería | Subarray ordenado | `sorted_region` |
| Una pasada | Iteración del bucle externo | `for (...)` |
| Una comparación | Iteración del bucle interno | `if (...)` |
| Zona consolidada | Invariante del algoritmo | `// arr[0..i] is sorted` |

---

### 8.2 Algoritmos como Estrategias Físicas

#### Bubble Sort (Ordenamiento Burbuja)

**Metáfora Física:**
"Hacer que las botellas pesadas 'floten' hacia el final"

**Proceso:**
1. Compara pares adyacentes de botellas
2. Si la de la izquierda es más pesada, intercámbialas
3. Repite para todos los pares
4. La botella más pesada termina al final (consolidada)
5. Repite el proceso sin incluir las ya consolidadas

**Observación del usuario:**
- "Cada pasada mueve la botella más pesada restante al final"
- "Necesito N-1 pasadas completas"
- "Cada pasada requiere menos comparaciones"

**Código equivalente:**
```javascript
// Lo que el usuario hace físicamente:
for (let i = 0; i < n-1; i++) {          // Cada pasada
  for (let j = 0; j < n-i-1; j++) {      // Comparar pares
    if (pesar(botella[j], botella[j+1]) === 'derecha_más_pesada') {
      intercambiar(j, j+1);               // Swap físico
    }
  }
  consolidar(botella[n-i-1]);             // Marcar como ordenada
}
```

---

#### Selection Sort (Ordenamiento por Selección)

**Metáfora Física:**
"Buscar la botella más liviana y colocarla en la estantería"

**Proceso:**
1. Busca la botella más liviana en toda la mesa
2. Colócala en la primera posición de la estantería
3. Busca la siguiente más liviana en lo que queda
4. Colócala en la segunda posición
5. Repite hasta vaciar la mesa

**Observación del usuario:**
- "Cada pasada encuentro UN ganador definitivo"
- "La estantería crece de izquierda a derecha"
- "Necesito comparar cada botella restante con el campeón actual"

**Código equivalente:**
```javascript
for (let i = 0; i < n; i++) {
  let min_index = i;
  for (let j = i+1; j < n; j++) {
    if (pesar(botella[j], botella[min_index]) === 'izquierda_más_liviana') {
      min_index = j;                      // Nuevo campeón
    }
  }
  moverAEstanteria(botella[min_index], posicion[i]);
  consolidar(i);
}
```

---

#### Insertion Sort (Ordenamiento por Inserción)

**Metáfora Física:**
"Como ordenar cartas en tu mano: tomar una y ponerla en su lugar correcto"

**Proceso:**
1. La primera botella ya está "ordenada" (estantería con 1 elemento)
2. Toma la siguiente botella de la mesa
3. Compárala con las de la estantería (de derecha a izquierda)
4. Insértala en la posición correcta
5. Repite para todas las botellas

**Observación del usuario:**
- "La estantería siempre está ordenada"
- "Inserto cada nueva botella en el lugar correcto"
- "A veces necesito hacer espacio (mover botellas)"

**Código equivalente:**
```javascript
for (let i = 1; i < n; i++) {
  let botella_actual = tomar(i);
  let j = i - 1;
  
  while (j >= 0 && pesar(botella_actual, estanteria[j]) === 'izquierda_más_liviana') {
    moverDerecha(estanteria[j]);          // Hacer espacio
    j--;
  }
  
  insertar(botella_actual, posicion[j+1]);
}
```

---

#### Quick Sort (Ordenamiento Rápido)

**Metáfora Física:**
"Elegir una botella de referencia y dividir en 'más livianas' y 'más pesadas'"

**Proceso:**
1. Elige una botella como "pivote" (ej: la del medio)
2. Compara todas las demás con el pivote
3. Separa en dos grupos: livianas a la izquierda, pesadas a la derecha
4. Coloca el pivote en el medio (su posición final)
5. Repite recursivamente para cada grupo

**Observación del usuario:**
- "Cada pivote encuentra su posición final de una vez"
- "Divido el problema en sub-problemas más pequeños"
- "No necesito comparar botellas de grupos diferentes"

**Visualización especial:**
- Mesa dividida en 3 zonas: [Livianas | Pivote | Pesadas]
- Colores diferentes para cada sub-grupo

---

#### Merge Sort (Ordenamiento por Mezcla)

**Metáfora Física:**
"Dividir botellas en grupos pequeños, ordenar grupos, luego combinarlos"

**Proceso:**
1. Divide todas las botellas en pares individuales
2. Ordena cada par (solo 1 comparación)
3. Combina pares ordenados en grupos de 4 (manteniendo orden)
4. Combina grupos de 4 en grupos de 8
5. Continúa hasta tener todo ordenado

**Observación del usuario:**
- "Orden divide y conquista"
- "Combinar dos grupos ordenados es más fácil que ordenar desde cero"
- "Necesito espacio extra (dos mesas)"

**Visualización especial:**
- Árbol de división/combinación
- Animación de grupos fusionándose

---

### 8.3 Detección Automática de Estrategia

#### Sistema de Reconocimiento de Patrones

El sistema analiza las acciones del usuario y determina qué algoritmo está usando.

**Heurísticas de Detección:**

| Patrón Observado | Algoritmo Probable |
|-----------------|-------------------|
| Comparaciones solo entre adyacentes, múltiples pasadas | Bubble Sort |
| Busca mínimo en cada pasada, mueve a estantería | Selection Sort |
| Construye zona ordenada insertando uno por uno | Insertion Sort |
| Divide en sub-grupos, usa pivotes | Quick Sort |
| Divide recursivamente, luego combina | Merge Sort |

**Feedback al Usuario:**
```
💡 Parece que estás usando un patrón similar a "Selection Sort"

Características detectadas:
✓ Buscas el mínimo en cada pasada
✓ Construyes la zona ordenada de izquierda a derecha
✓ Cada botella se mueve una sola vez

Big O estimado: O(n²) comparaciones
Complejidad espacial: O(1) - no usas espacio extra

¿Quieres ver cómo Selection Sort trabaja en modo automático?
[SÍ, MOSTRAR] [NO, CONTINUAR]
```

---

### 8.4 Introducción Progresiva de Complejidad

#### Secuencia de Conceptos

**Sesión 1: Fundamentos**
- Concepto: Comparación
- Aprende: "Ordenar significa decidir qué va antes"
- Herramienta: Balanza

**Sesión 2: Eficiencia**
- Concepto: Costo de operaciones
- Aprende: "Cada comparación tiene un precio"
- Herramienta: Contador de pesajes

**Sesión 3: Patrones**
- Concepto: Estrategias repetibles
- Aprende: "Hay formas sistemáticas de ordenar"
- Herramienta: Modo Fantasma

**Sesión 4: Comparación**
- Concepto: Algoritmos diferentes = eficiencia diferente
- Aprende: "Algunos métodos son más rápidos"
- Herramienta: Modo Comparación

**Sesión 5: Complejidad**
- Concepto: Big O
- Aprende: "Cómo crece el esfuerzo con más datos"
- Herramienta: Gráficas y análisis

---

## 📈 Extensiones y Mejoras Futuras

### 9.1 Características Avanzadas

#### Multi-Jugador Colaborativo
- Dos usuarios ordenan el mismo conjunto
- Compiten por eficiencia
- O colaboran compartiendo la balanza

#### Generador de Escenarios
- Usuario crea niveles personalizados
- Define número de botellas, pesos, restricciones
- Comparte con comunidad

#### Modo "Code Along"
- Interfaz dividida: visual + código
- Usuario ve cómo su acción se traduce a código
- Opción de escribir código que controla la interfaz

#### Análisis de Complejidad en Vivo
- Gráfica que muestra curva de crecimiento
- Comparación con O(n²), O(n log n), etc.
- Predicción de tiempo para N=1000 botellas

---

### 9.2 Algoritmos Adicionales

#### Algoritmos para Agregar
- Heap Sort
- Shell Sort
- Counting Sort (para rangos limitados)
- Radix Sort (ordenamiento por dígitos)
- Tim Sort (híbrido usado en Python)

#### Casos Especiales
- Nearly Sorted (casi ordenado)
- Reverse Sorted (orden inverso)
- Many Duplicates (muchos valores repetidos)
- Random Distributions (diferentes distribuciones)

---

### 9.3 Gamificación

#### Sistema de Logros
- 🏆 "Primer Orden": Completar primer nivel
- 🥇 "Perfeccionista": Lograr 100% eficiencia
- 🔥 "Racha": 5 niveles consecutivos con medalla
- 🧪 "Científico": Probar todos los algoritmos
- ⚡ "Velocista": Ordenar en menos de 30 segundos

#### Tabla de Clasificación
- Rankings locales y globales
- Categorías: eficiencia, velocidad, creatividad
- Desafíos semanales

#### Recompensas Cosméticas
- Nuevos diseños de botellas
- Temas visuales (laboratorio, cocina, fábrica)
- Efectos de partículas personalizados

---

### 9.4 Accesibilidad

#### Modo Narrado
- Descripción auditiva de cada acción
- Compatible con lectores de pantalla
- Navegación por teclado completa

#### Modo Daltónicos
- Paleta de colores alternativa
- Patrones en lugar de solo colores
- Etiquetas textuales redundantes

#### Modo Simplificado
- Menor cantidad de efectos visuales
- Controles más grandes
- Instrucciones paso a paso

---

## 🎬 Conclusión

### Impacto Educativo Esperado

Este sistema transforma el aprendizaje de algoritmos de ordenamiento de una experiencia puramente abstracta a una **manipulación concreta y tangible**. Los estudiantes:

1. **Descubren** patrones por sí mismos en lugar de memorizarlos
2. **Comprenden** Big O de forma intuitiva antes de ver las matemáticas
3. **Experimentan** la diferencia entre algoritmos en lugar de solo leerla
4. **Internalizan** que los algoritmos son estrategias, no solo código

### Principio Pedagógico Central

> **"La mejor manera de aprender un algoritmo no es leer su código, sino descubrir por qué necesitas ese código"**

Esta interfaz materializa ese principio mediante:
- Restricciones físicas que fuerzan el pensamiento algorítmico
- Retroalimentación inmediata que refuerza conceptos correctos
- Progresión natural desde exploración hasta optimización
- Múltiples representaciones del mismo concepto (visual, auditiva, numérica)

---

## 📚 Referencias Pedagógicas

### Marcos Teóricos Aplicados

1. **Constructivismo (Piaget):**
   - El estudiante construye conocimiento mediante interacción directa
   - La interfaz es el "material concreto" para manipular

2. **Aprendizaje por Descubrimiento (Bruner):**
   - Exploración guiada antes de instrucción formal
   - El sistema sugiere pero no impone soluciones

3. **Zona de Desarrollo Próximo (Vygotsky):**
   - Niveles adaptativos con scaffolding
   - Ayudas que se retiran progresivamente

4. **Carga Cognitiva (Sweller):**
   - Reducción de carga extrínseca (interfaz simple)
   - Aumento de carga relevante (el problema de ordenar)

---

**Versión:** 1.0  
**Última actualización:** Diciembre 2025  
**Autor:** Especificación de diseño educativo  
**Licencia:** Material pedagógico abierto
