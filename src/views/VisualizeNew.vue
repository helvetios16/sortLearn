<template>
  <div class="min-h-screen bg-gray-50 overflow-hidden rounded-xl">
    <!-- Title -->
    <div class="text-center py-3 bg-white rounded-t-xl border-b border-gray-200">
      <h1
        class="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500"
      >
        SELECTION SORT - Algoritmo de Ordenamiento por Selección
      </h1>
    </div>

    <div class="container mx-auto px-4 py-2 h-[calc(100vh-85px)] flex flex-col gap-4">
      <!-- Messages & Instruction (MOVED UP) -->
      <div
        v-if="message || instructionHint"
        class="p-3 rounded-xl shadow-xl border-l-[6px] flex items-center gap-4 transition-all duration-300 transform min-h-[70px] ring-1 ring-black/5"
        :class="{
          'bg-red-50 border-red-500 text-red-900 shadow-red-200':
            message && messageType === 'error',
          'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-emerald-200':
            message && messageType === 'success',
          'bg-amber-100 border-amber-500 text-gray-900 shadow-amber-200':
            !message || messageType === 'info',
        }"
      >
        <!-- Icono Grande (Compactado) -->
        <div class="text-3xl shrink-0 animate-bounce cursor-default select-none ml-1">
          <span v-if="message && messageType === 'error'">🛑</span>
          <span v-else-if="message && messageType === 'success'">🎉</span>
          <span v-else>💡</span>
        </div>

        <!-- Texto con Jerarquía (Compactado) -->
        <div class="flex-1 flex flex-col justify-center">
          <span
            class="text-[10px] font-black uppercase tracking-widest leading-none mb-0.5 opacity-60"
            :class="{
              'text-red-700': message && messageType === 'error',
              'text-emerald-700': message && messageType === 'success',
              'text-amber-800': !message || messageType === 'info',
            }"
          >
            {{
              message && messageType === 'error'
                ? 'ATENCIÓN REQUERIDA'
                : message && messageType === 'success'
                  ? '¡MUY BIEN!'
                  : 'GUÍA DE PASOS'
            }}
          </span>
          <span
            class="text-base md:text-lg font-medium leading-tight"
            v-html="message || instructionHint"
          >
          </span>
        </div>
      </div>

      <!-- Top Row: Lista de Frascos + Balanza (Principal focus) -->
      <div class="grid grid-cols-12 gap-8 flex-1 min-h-[50%]">
        <!-- Left Column: Bottle List -->
        <div
          class="col-span-8 bg-white rounded-lg shadow-lg p-3 border border-gray-800 transition-all duration-300"
        >
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-base font-bold text-blue-700 flex items-center gap-2">
              LISTA DE FRASCOS
            </h3>
            <div class="flex gap-4 text-sm">
              <!-- Counters -->
              <div class="flex gap-3">
                <div class="flex items-center gap-1">
                  <span class="text-green-600 font-bold text-base">✓</span>
                  <span class="font-semibold text-gray-700">Ordenados: {{ currentIteration }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <span class="text-orange-600 font-bold text-base">📋</span>
                  <span class="font-semibold text-gray-700"
                    >Desordenados: {{ 5 - currentIteration }}</span
                  >
                </div>
              </div>
              <!-- Color meanings -->
              <div class="border-l-2 border-gray-200 pl-3 flex gap-3">
                <div class="flex items-center gap-1">
                  <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span class="font-semibold text-yellow-700">Menor</span>
                </div>
                <div class="flex items-center gap-1">
                  <div class="w-3 h-3 bg-cyan-500 rounded-full"></div>
                  <span class="font-semibold text-cyan-700">A comparar</span>
                </div>
              </div>
            </div>
          </div>

          <div
            class="bg-gradient-to-r from-green-50 via-gray-50 to-amber-50 rounded-lg p-2 h-[calc(100%-40px)] transition-all duration-500 relative"
            :class="{
              'ring-4 ring-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.5)] scale-[1.01] z-[100]':
                showMidQuiz && quizTopic === 'strategy',
              'opacity-20 grayscale': showMidQuiz && quizTopic !== 'strategy',
            }"
          >
            <div class="relative flex gap-12 justify-center items-center h-full">
              <!-- Dynamic Labels -->
              <!-- Dynamic Group Labels (Bottom Watermark Style) -->
              <div
                class="absolute -bottom-3 w-full flex pointer-events-none justify-center items-end pb-1 h-full z-0"
              >
                <!-- Sorted Group Label -->
                <div
                  v-if="currentIteration > 0"
                  class="flex justify-center items-end pb-1 transition-all duration-500 border-r-2 border-gray-300/50"
                  :style="{ width: currentIteration * 20 + '%' }"
                >
                  <span class="text-xl md:text-2xl text-gray-400 font-bold tracking-tight">
                    Ordenados
                  </span>
                </div>

                <!-- Unsorted Group Label -->
                <div
                  v-if="currentIteration < 5"
                  class="flex justify-center items-end pb-1 transition-all duration-500 flex-1"
                >
                  <span class="text-xl md:text-2xl text-gray-500 font-bold tracking-tight">
                    Desordenados
                  </span>
                </div>
              </div>
              <div
                v-for="(bottle, idx) in allBottles"
                :key="'unified-' + idx"
                class="relative flex flex-col items-center justify-center transform scale-150"
                :class="{
                  'mr-6':
                    idx === currentIteration - 1 && currentIteration > 0 && currentIteration < 5,
                  'ml-6': idx === currentIteration && currentIteration > 0,
                }"
              >
                <!-- Highlight for menor actual -->
                <div
                  v-if="
                    (idx === minIndex && !waitingForNewMinDrag && idx >= currentIteration) ||
                    (waitingForNewMinDrag && idx === pendingNewMinIndex) ||
                    (waitingForSwapDrag && idx === minIndex)
                  "
                  class="absolute inset-0 -m-2 bg-yellow-400/30 rounded-lg border-2 border-yellow-500 animate-pulse z-0"
                ></div>

                <!-- Highlight for element to compare (HIDE during swap/newMin wait) -->
                <div
                  v-if="
                    !waitingForNewMinDrag &&
                    !waitingForSwapDrag &&
                    idx === currentIteration + currentCompareIndex &&
                    idx >= currentIteration &&
                    idx !== minIndex
                  "
                  class="absolute inset-0 -m-2 bg-cyan-400/30 rounded-lg border-2 border-cyan-500 animate-pulse z-0"
                ></div>

                <!-- Highlight for SWAP DESTINATION -->
                <div
                  v-if="waitingForSwapDrag && idx === currentIteration"
                  class="absolute inset-0 -m-2 bg-green-100/30 rounded-lg border-4 border-green-500 border-dashed animate-pulse z-0"
                >
                  <div
                    class="absolute -top-6 w-full text-center text-xs font-bold text-green-700 bg-white shadow rounded px-1"
                  >
                    APLICA AQUÍ
                  </div>
                </div>

                <Bottle
                  v-if="bottle"
                  :id="bottle.id"
                  :weight="bottle.weight"
                  :color="bottle.color"
                  :shouldShake="shouldShakeBottle(idx)"
                  :dimmed="shouldDimBottle(idx)"
                  :state="idx < currentIteration ? 'consolidated' : 'normal'"
                  @bottle-clicked="onBottleClick(idx)"
                  @dragstart="onDragStart($event, idx)"
                  @drop="onDropOnBottle($event, idx)"
                  @dragover="onDragOver"
                  @dragend="onDragEnd"
                  class="relative z-10"
                />

                <!-- MIN DEFAULT TIP -->
                <!-- MIN DEFAULT TIP - LEFT SIDE -->
                <div
                  v-if="showMinDefaultTip && currentIteration === 0 && idx === 0"
                  class="absolute -left-[100px] top-1/2 -translate-y-1/2 z-50 animate-pulse pointer-events-none w-24 flex flex-row items-center justify-end px-1"
                >
                  <div
                    class="relative bg-white text-gray-800 text-[10px] p-2 rounded-lg border-2 border-indigo-500 shadow-xl text-center font-bold leading-tight"
                  >
                    El "menor" es el primero por defecto
                    <!-- Flecha apuntando a la derecha (hacia el frasco) -->
                    <div
                      class="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-t-2 border-r-2 border-indigo-500 transform rotate-45"
                    ></div>
                  </div>
                </div>

                <div
                  class="text-center mt-1 text-xs font-bold"
                  :class="idx < currentIteration ? 'text-green-700' : 'text-gray-600'"
                >
                  {{ idx }}
                </div>

                <div
                  v-if="idx < currentIteration"
                  class="text-[10px] text-green-600 mt-0.5"
                >
                  ✓
                </div>

                <!-- Partition line -->
                <div
                  v-if="
                    idx === currentIteration - 1 && currentIteration > 0 && currentIteration < 5
                  "
                  class="absolute -right-4 top-2 bottom-6 flex items-center z-10"
                >
                  <div
                    class="w-1 h-full bg-gradient-to-b from-gray-700 via-gray-900 to-gray-700 rounded-full shadow-lg"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: BALANZA -->
        <div class="col-span-4 flex flex-col gap-2 relative">
          <!-- BALANZA -->
          <div
            class="bg-white rounded-lg shadow-md p-2 border border-gray-800 flex-1 relative transition-all duration-300"
            :class="{
              'opacity-30 pointer-events-none':
                waitingForNewMinDrag || waitingForSwapDrag || iterationSummary.show,
            }"
          >
            <h3
              class="text-sm font-bold text-gray-700 mb-1 text-center flex justify-center items-center gap-2"
            >
              <span>⚖️</span>
              <span>BALANZA</span>
            </h3>

            <div class="relative h-[calc(100%-40px)] flex flex-col items-center justify-center">
              <!-- Scale Notification (Floating Tooltip) -->
              <div
                v-if="scaleNotification"
                class="absolute top-4 z-40 px-4 py-2 rounded-lg shadow-xl font-black text-center text-sm md:text-base animate-bounce border-2"
                :class="
                  scaleNotificationType === 'new'
                    ? 'bg-green-100 text-green-800 border-green-500'
                    : 'bg-gray-100 text-gray-700 border-gray-400'
                "
              >
                {{ scaleNotification }}
              </div>

              <!-- Iteration Summary Popup REMOVED FROM HERE -->

              <!-- Base -->
              <div
                class="absolute bottom-0 w-28 h-4 bg-gradient-to-b from-gray-500 to-gray-700 rounded shadow-lg"
              ></div>

              <!-- Vertical Support (Shorter) -->
              <div
                class="absolute bottom-4 w-4 h-24 bg-gradient-to-r from-gray-500 via-gray-400 to-gray-500 rounded-t shadow-md"
              ></div>

              <!-- Fulcrum -->
              <div
                class="absolute bottom-[108px] w-7 h-7 bg-gray-800 rounded-full border-2 border-gray-900 shadow-lg z-30"
              ></div>

              <!-- Horizontal Beam -->
              <div
                class="absolute bottom-[110px] w-64 h-2 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 rounded-full shadow-md transition-transform duration-700 origin-center z-20"
                :class="{ 'animate-sway': isInitialState }"
                :style="{ transform: scaleRotation }"
              >
                <div
                  class="absolute -left-1 -top-1 w-4 h-4 bg-gray-700 rounded-full border border-gray-800"
                ></div>
                <div
                  class="absolute -right-1 -top-1 w-4 h-4 bg-gray-700 rounded-full border border-gray-800"
                ></div>
              </div>

              <!-- Left Pan Assembly -->
              <div
                class="absolute left-8 bottom-[110px] flex flex-col items-center transition-all duration-700"
                :style="{ transform: leftPanTransform }"
              >
                <div
                  class="w-24 h-32 flex flex-col items-center justify-center transition-all duration-300 rounded-xl relative"
                  @drop="onDropOnScale($event, 'left')"
                  @dragover="onDragOver"
                >
                  <!-- Placeholder Visual (Yellow for Min) -->
                  <div
                    v-if="!leftBottle"
                    class="absolute top-2 w-20 h-28 border-4 border-yellow-400 rounded-xl bg-yellow-50/30 transition-all duration-300 pointer-events-none"
                    :class="
                      draggedBottleIndex === minIndex
                        ? 'animate-pulse shadow-[0_0_20px_rgba(250,204,21,0.8)] border-solid scale-105 bg-yellow-100/50 opacity-100'
                        : 'border-dashed opacity-40'
                    "
                  ></div>

                  <div class="min-h-[70px] flex items-center justify-center z-10 relative">
                    <Bottle
                      v-if="leftBottle"
                      :id="leftBottle.id"
                      :weight="leftBottle.weight"
                      :color="leftBottle.color"
                      :comparison="scaleResult?.left"
                      state="comparing"
                    />
                  </div>
                  <div
                    class="w-20 h-5 rounded-full bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-500 border-2 border-yellow-600 shadow-lg mt-1 z-10"
                    style="transform: perspective(100px) rotateX(60deg)"
                  ></div>
                </div>
              </div>

              <!-- Right Pan Assembly -->
              <div
                class="absolute right-8 bottom-[110px] flex flex-col items-center transition-all duration-700"
                :style="{ transform: rightPanTransform }"
              >
                <div
                  class="w-24 h-32 flex flex-col items-center justify-center transition-all duration-300 rounded-xl relative"
                  @drop="onDropOnScale($event, 'right')"
                  @dragover="onDragOver"
                >
                  <!-- Placeholder Visual (Cyan for Compare) -->
                  <div
                    v-if="!rightBottle"
                    class="absolute top-2 w-20 h-28 border-4 border-cyan-400 rounded-xl bg-cyan-50/30 transition-all duration-300 pointer-events-none"
                    :class="
                      draggedBottleIndex !== null && draggedBottleIndex !== minIndex
                        ? 'animate-pulse shadow-[0_0_20px_rgba(34,211,238,0.8)] border-solid scale-105 bg-cyan-100/50 opacity-100'
                        : 'border-dashed opacity-40'
                    "
                  ></div>

                  <div class="min-h-[70px] flex items-center justify-center z-10 relative">
                    <Bottle
                      v-if="rightBottle"
                      :id="rightBottle.id"
                      :weight="rightBottle.weight"
                      :color="rightBottle.color"
                      :comparison="scaleResult?.right"
                      state="comparing"
                    />
                  </div>
                  <div
                    class="w-20 h-5 rounded-full bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-500 border-2 border-yellow-600 shadow-lg mt-1 z-10"
                    style="transform: perspective(100px) rotateX(60deg)"
                  ></div>
                </div>
              </div>
            </div>

            <div class="mt-2 text-center absolute bottom-2 w-full left-0">
              <button
                v-if="scaleWeighed"
                @click="clearScale"
                class="px-4 py-1.5 text-sm rounded font-bold text-white bg-gray-600 hover:bg-gray-700 shadow"
              >
                LIMPIAR
              </button>
              <p
                v-else
                class="text-[10px] text-gray-500"
              >
                Arrastra los frascos a la balanza
              </p>
            </div>
          </div>

          <!-- Iteration Summary Popup (Overlay - MOVED OUTSIDE to avoid opacity) -->
          <div
            v-if="iterationSummary.show"
            class="absolute inset-0 z-50 flex items-center justify-center p-4 m-2"
            style="pointer-events: none"
          >
            <!-- Container wrapper -->
            <div
              class="bg-white/95 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center text-center border-4 shadow-2xl p-6 transition-all duration-500 animate-[bounce_0.5s_ease-out]"
              style="pointer-events: auto"
              :class="
                iterationSummary.type === 'swap'
                  ? 'border-orange-400 shadow-orange-200'
                  : 'border-green-400 shadow-green-200'
              "
            >
              <div class="text-5xl mb-4">
                {{ iterationSummary.type === 'swap' ? '🔄' : '✅' }}
              </div>
              <h3
                class="text-2xl font-black mb-3 uppercase tracking-wide"
                :class="iterationSummary.type === 'swap' ? 'text-orange-600' : 'text-green-700'"
              >
                {{ iterationSummary.title }}
              </h3>
              <p class="font-bold text-gray-700 text-lg leading-snug mb-4">
                {{ iterationSummary.description }}
              </p>
              <p
                v-if="iterationSummary.type === 'swap'"
                class="text-sm text-orange-500 font-extrabold uppercase tracking-widest animate-pulse border-t border-orange-200 pt-2 w-full"
              >
                (Arrastra el frasco en la lista para continuar)
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Row: Information Panels (Memoria, Complejidad, Menor y Botones) -->
      <div class="grid grid-cols-12 gap-8 h-[35%]">
        <!-- MEMORIA -->
        <div
          class="col-span-4 bg-white rounded-lg shadow-md p-2 border border-gray-800 overflow-auto transition-all duration-500 relative"
          :class="{
            'opacity-20 grayscale pointer-events-none':
              shouldDimBottomPanels && !(showMidQuiz && quizTopic === 'space'),
            'z-[100] ring-4 ring-pink-400 scale-105 shadow-2xl':
              showMidQuiz && quizTopic === 'space',
          }"
        >
          <h3 class="text-sm font-bold text-gray-900 mb-1 flex items-center gap-1">
            <span>🧠</span> <span>MEMORIA</span>
          </h3>
          <p class="text-[10px] text-gray-600 font-semibold mb-1">Array[]:</p>
          <div class="grid grid-cols-5 gap-0.5 mb-2">
            <div
              v-for="(value, idx) in memoryArray"
              :key="'mem-' + idx"
              class="border rounded p-1 text-center text-[10px] font-mono"
              :class="{
                'border-green-500 bg-green-50': idx < currentIteration,
                'border-yellow-400 bg-yellow-50': idx === minIndex && idx >= currentIteration,
                'border-cyan-400 bg-cyan-50':
                  idx === currentIteration + currentCompareIndex &&
                  idx >= currentIteration &&
                  idx !== minIndex,
                'border-gray-300 bg-gray-50':
                  idx >= currentIteration &&
                  idx !== minIndex &&
                  idx !== currentIteration + currentCompareIndex,
              }"
            >
              <div class="text-[8px] text-gray-500">[{{ idx }}]</div>
              <div
                class="font-bold text-sm"
                :class="idx < currentIteration ? 'text-green-700' : 'text-gray-800'"
              >
                {{ value !== null ? value : '-' }}
              </div>
            </div>
          </div>
          <div class="grid grid-cols-3 gap-2 mb-3 text-xs">
            <div
              class="flex items-center gap-1 bg-green-50 px-2 py-1 rounded border border-green-300"
            >
              <div class="w-2 h-2 bg-green-500 rounded-full"></div>
              <span class="text-[10px] font-semibold text-black">Ordenado</span>
            </div>
            <div
              class="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded border border-yellow-300"
            >
              <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span class="text-[10px] font-semibold text-black">Menor</span>
            </div>
            <div
              class="flex items-center gap-1 bg-cyan-50 px-2 py-1 rounded border border-cyan-300"
            >
              <div class="w-2 h-2 bg-cyan-500 rounded-full"></div>
              <span class="text-[10px] font-semibold text-black">A comparar</span>
            </div>
          </div>
          <div class="bg-amber-50 border border-amber-400 rounded p-1.5 mb-1">
            <p class="text-[10px] font-bold text-black">
              min_actual = <span class="text-lg">{{ minIndex !== null ? minIndex : '?' }}</span>
            </p>
          </div>
        </div>

        <!-- COMPLEJIDAD -->
        <div
          class="col-span-4 bg-white rounded-lg shadow-md p-2 border border-gray-800 transition-all duration-500 relative overflow-hidden flex flex-col"
          :class="{
            'opacity-20 grayscale pointer-events-none':
              shouldDimBottomPanels &&
              !(showMidQuiz && (quizTopic === 'complexity' || quizTopic === 'math')),
            'z-[100] ring-4 ring-yellow-400 scale-105 shadow-2xl':
              showMidQuiz && (quizTopic === 'complexity' || quizTopic === 'math'),
          }"
        >
          <h3 class="text-sm font-bold text-gray-900 mb-2 flex items-center gap-1 shrink-0">
            <span>📊</span> <span>COMPLEJIDAD</span>
          </h3>
          <div class="flex flex-col gap-2 h-full overflow-hidden">
            <!-- Totales -->
            <div class="grid grid-cols-2 gap-2 shrink-0">
              <div class="bg-blue-50 rounded p-1.5 text-center border border-blue-200">
                <p class="text-[9px] text-black uppercase tracking-wider font-bold mb-0.5">
                  Total Comparaciones
                </p>
                <p class="text-xl font-extrabold text-black leading-none">{{ comparisons }}</p>
              </div>
              <div class="bg-purple-50 rounded p-1.5 text-center border border-purple-200">
                <p class="text-[9px] text-black uppercase tracking-wider font-bold mb-0.5">
                  Intercambios
                </p>
                <p class="text-xl font-extrabold text-black leading-none">{{ swaps }}</p>
              </div>
            </div>

            <!-- Desglose por Iteración -->
            <div
              class="bg-white rounded border border-gray-200 p-1 flex-1 flex flex-col justify-start overflow-hidden"
            >
              <div
                class="flex justify-between items-end mb-0.5 border-b border-gray-100 pb-0.5 shrink-0"
              >
                <span class="text-[9px] font-black text-black uppercase tracking-wider"
                  >Comparaciones por Vuelta</span
                >
                <span class="text-[8px] text-gray-400 italic"></span>
              </div>
              <div class="space-y-[3px] overflow-y-auto pr-0.5">
                <div
                  v-for="(maxComp, idx) in [4, 3, 2, 1]"
                  :key="idx"
                  class="flex justify-between items-center px-1.5 py-[3px] rounded transition-all duration-300 gap-1.5"
                  :class="
                    currentIteration === idx
                      ? 'bg-blue-50 border-l-2 border-blue-500 shadow-sm'
                      : currentIteration > idx
                        ? 'bg-gray-50'
                        : ''
                  "
                >
                  <!-- Título -->
                  <span
                    class="text-[10px] uppercase tracking-wide font-bold whitespace-nowrap"
                    :class="
                      currentIteration === idx
                        ? 'text-black'
                        : currentIteration > idx
                          ? 'text-gray-500'
                          : 'text-gray-300'
                    "
                  >
                    VUELTA {{ idx + 1 }}
                  </span>

                  <!-- Barra de Progreso Segmentada -->
                  <div class="flex-1 flex justify-end gap-[1px] h-[7px] mx-1">
                    <div
                      v-for="n in maxComp"
                      :key="n"
                      class="w-4 rounded-[1px] transition-colors duration-300"
                      :class="
                        n <=
                        (currentIteration > idx
                          ? maxComp
                          : currentIteration === idx
                            ? Math.max(0, currentCompareIndex)
                            : 0)
                          ? currentIteration > idx
                            ? 'bg-emerald-400'
                            : 'bg-blue-500'
                          : 'bg-gray-200'
                      "
                    ></div>
                  </div>

                  <!-- Contador -->
                  <span
                    class="font-mono text-[10px] whitespace-nowrap min-w-[28px] text-right leading-none"
                  >
                    <span
                      v-if="currentIteration === idx"
                      class="font-extrabold text-black text-[11px]"
                      >{{ Math.max(0, currentCompareIndex) }}</span
                    >
                    <span
                      v-else-if="currentIteration > idx"
                      class="text-green-600 font-bold"
                      >{{ maxComp }}</span
                    >
                    <span
                      v-else
                      class="text-gray-300"
                      >0</span
                    >
                    <span class="text-[9px] text-gray-400 opacity-70"> / {{ maxComp }}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- MENOR ACTUAL + BOTONES -->
        <div class="col-span-4 flex flex-col gap-3">
          <!-- Cuadro Menor Actual -->
          <div
            class="rounded-lg shadow-md p-2 transition-all duration-300 flex-1 flex flex-col relative"
            :class="[
              waitingForNewMinDrag
                ? 'bg-emerald-50 border-4 border-dashed border-emerald-500 shadow-emerald-100 shadow-xl'
                : 'bg-yellow-50 border border-gray-800',
              {
                'opacity-20 grayscale pointer-events-none':
                  shouldDimBottomPanels && !waitingForNewMinDrag,
              },
            ]"
            @drop="onDropOnMinBox"
            @dragover="onDragOver"
          >
            <!-- Overlay PONER AQUÍ -->
            <div
              v-if="waitingForNewMinDrag"
              class="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
            >
              <div
                class="bg-white/95 px-4 py-2 rounded-full border-2 border-emerald-600 text-emerald-700 font-black text-xs uppercase tracking-widest shadow-lg animate-bounce"
              >
                👇 Poner Aquí 👇
              </div>
            </div>
            <h3
              class="text-sm font-bold text-yellow-800 mb-1 text-center flex items-center justify-center gap-1"
            >
              <span>🏆</span> <span>MENOR ACTUAL (min_actual)</span>
            </h3>
            <div
              class="flex-1 flex flex-col items-center justify-center"
              @drop="onDropOnMinBox($event)"
              @dragover="onDragOver"
            >
              <Bottle
                v-if="minBottle"
                :id="minBottle.id"
                :weight="minBottle.weight"
                :color="minBottle.color"
                state="temp-variable"
              />
              <div
                v-else
                class="text-yellow-400 text-3xl"
              >
                ?
              </div>
              <p class="text-[10px] text-center text-yellow-700 mt-1 font-mono">
                {{ minBottle ? `Idx:${minIndex} | Peso:${minBottle.weight}` : '...' }}
              </p>
            </div>
          </div>

          <!-- Botones de Acción -->
          <div class="h-12 flex gap-2">
            <button
              @click="resetAlgorithm"
              class="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg shadow-md transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wide"
            >
              <span>🔄</span> <span>Reiniciar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- INTRO QUIZ MODAL -->
  <div
    v-if="showQuizIntro"
    class="fixed inset-0 bg-black/80 z-[100] flex justify-center items-center backdrop-blur-sm p-4 animate-fade-in"
  >
    <div
      class="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border-4 border-indigo-500 transform transition-all animate-bounce-in"
    >
      <div class="text-6xl mb-4">🤔</div>
      <h2 class="text-3xl font-black text-indigo-900 mb-2">PREGUNTAS DE RAZONAMIENTO</h2>
      <p class="text-gray-600 text-lg mb-6 leading-relaxed">
        ¡Has completado una vuelta! <br />
        Antes de continuar, responde unas breves preguntas para asegurar que entiendes lo que está
        pasando.
      </p>

      <button
        @click="startMidQuiz"
        class="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xl shadow-lg shadow-indigo-200 transition-all transform hover:scale-105 active:scale-95"
      >
        ¡Estoy listo! 🚀
      </button>
    </div>
  </div>

  <!-- FINAL ALGORITHM SUMMARY -->
  <div
    v-if="showFinalSummary"
    class="fixed inset-0 bg-black/90 z-[150] flex justify-center items-center backdrop-blur-md p-4 animate-fade-in"
  >
    <div
      class="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full text-center border-4 border-indigo-600 relative overflow-hidden"
    >
      <!-- Decoración de fondo suave -->
      <div
        class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500"
      ></div>

      <h2 class="text-3xl font-black text-gray-800 mb-6 uppercase tracking-tight">
        Resumen de Selection Sort
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-left">
        <div class="bg-blue-50 p-4 rounded-xl border-l-4 border-blue-500">
          <h3 class="font-bold text-blue-900 mb-2 flex items-center gap-2">⏱️ Tiempo (Time)</h3>
          <p class="text-sm text-blue-800 leading-relaxed">
            <b>Cuadrático O(n²)</b>. <br />
            Lento para listas grandes porque compara todos con todos.
          </p>
        </div>
        <div class="bg-emerald-50 p-4 rounded-xl border-l-4 border-emerald-500">
          <h3 class="font-bold text-emerald-900 mb-2 flex items-center gap-2">
            💾 Espacio (Space)
          </h3>
          <p class="text-sm text-emerald-800 leading-relaxed">
            <b>Constante O(1)</b>. <br />
            Muy eficiente en memoria. Solo usa una variable extra.
          </p>
        </div>
        <div class="bg-amber-50 p-4 rounded-xl border-l-4 border-amber-500 md:col-span-2">
          <h3 class="font-bold text-amber-900 mb-2 flex items-center gap-2">🦁 Estrategia</h3>
          <p class="text-sm text-amber-800 leading-relaxed">
            <b>Voraz (Greedy)</b>. <br />
            Busca repetidamente el elemento <u>menor</u> de la parte desordenada y lo coloca al
            inicio de la parte desordenada o al final de la parte ordenada.
          </p>
        </div>
      </div>

      <p class="text-gray-500 italic mb-6">
        "Simple de entender, ligero en memoria, pero lento para grandes volúmenes de datos."
      </p>

      <button
        @click="finishAlgorithmSummary"
        class="px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black rounded-xl text-xl shadow-lg shadow-indigo-200 hover:from-indigo-700 hover:to-purple-700 hover:scale-105 active:scale-95 transition-all w-full md:w-auto flex items-center justify-center gap-3 mx-auto"
      >
        <span>ENTENDIDO, CONTINUAR</span> <span>➜</span>
      </button>
    </div>
  </div>

  <!-- MID-ITERATION QUIZ MODAL -->
  <div
    v-if="showMidQuiz"
    class="fixed inset-0 bg-black/80 z-[90] flex justify-end items-start backdrop-blur-sm p-4 pr-6 pt-24"
  >
    <div
      class="bg-white rounded-xl shadow-2xl p-4 max-w-lg w-full transform transition-all animate-bounce-in border-4 border-indigo-500 max-h-[90vh] overflow-y-auto"
    >
      <div class="text-center mb-6">
        <div class="text-4xl mb-2">
          {{
            quizTopic === 'strategy'
              ? '🦁'
              : quizTopic === 'space'
                ? '💾'
                : currentQuizPhase === 1
                  ? '🧠'
                  : '🤔'
          }}
        </div>
        <h2 class="text-2xl font-black text-indigo-700 uppercase">
          {{
            quizTopic === 'strategy'
              ? 'Estrategia del Algoritmo'
              : quizTopic === 'space'
                ? 'Test de Memoria (Espacio)'
                : 'Test de Razonamiento'
          }}
        </h2>

        <!-- --- TIME QUIZ --- -->
        <template v-if="quizTopic === 'complexity'">
          <!-- PREGUNTA 1 -->
          <div v-if="currentQuizPhase === 1">
            <div
              class="bg-indigo-50 border-l-4 border-indigo-500 p-3 mb-3 rounded-r shadow-sm text-left"
            >
              <p class="text-indigo-900 text-sm font-semibold leading-relaxed">
                CONTEXTO: <br />
                Acabas de completar la 1ra vuelta con <b class="text-lg">5 elementos</b>. <br />
                Hiciste exactamente <b class="text-lg text-indigo-700">4 comparaciones</b>.
              </p>
            </div>
            <p class="text-gray-800 font-bold mt-2 text-lg leading-tight">
              Si tuvieras "n" elementos... ¿Cuántas comparaciones harías en esa primera vuelta?
            </p>
          </div>

          <!-- PREGUNTA 2 -->
          <div v-else-if="currentQuizPhase === 2">
            <p class="text-gray-600 text-sm mt-2">Imagina ahora un caso hipotético...</p>
            <p class="text-gray-800 font-bold mt-2 text-lg">
              Si la lista hubiera estado <u>YA ORDENADA</u> (mejor caso) al inicio, ¿cuántas
              comparaciones haría el algoritmo?
            </p>
          </div>

          <!-- PREGUNTA 3 -->
          <div v-else>
            <p class="text-gray-600 text-sm mt-2">Última pregunta para expertos...</p>
            <p class="text-gray-800 font-bold mt-2 text-lg">
              ¿Y si la lista estuviera <u>TOTALMENTE INVERTIDA</u> (peor caso)? ¿Qué pasaría con las
              comparaciones?
            </p>
          </div>
        </template>

        <!-- --- STRATEGY QUIZ Questions --- -->
        <template v-else-if="quizTopic === 'strategy'">
          <!-- PHASE 1: Action -->
          <div v-if="currentQuizPhase === 1">
            <p class="text-gray-600 text-sm mt-2">Observa los frascos resaltados...</p>
            <p class="text-gray-800 font-bold mt-2 text-lg">
              ¿Qué operación exacta hemos repetido en cada iteración hasta ahora?
            </p>
          </div>

          <!-- PHASE 2: Strategy/Greedy -->
          <div v-else-if="currentQuizPhase === 2">
            <p class="text-gray-600 text-sm mt-2">
              Esta forma de actuar ("tomar el mejor ahora mismo") tiene un nombre...
            </p>
            <p class="text-gray-800 font-bold mt-2 text-lg">
              ¿Cuál es la <u>Estrategia Formal</u> que usa Selection Sort?
            </p>
          </div>

          <!-- PHASE 3: Invariant -->
          <div v-else>
            <p class="text-gray-600 text-sm mt-2">
              Mira la línea divisoria entre Ordenados y Desordenados...
            </p>
            <p class="text-gray-800 font-bold mt-2 text-lg">
              ¿Qué regla (Invariante) se cumple SIEMPRE al final de cada vuelta?
            </p>
          </div>
        </template>

        <!-- --- MATH/BIG O QUIZ Questions --- -->
        <template v-else-if="quizTopic === 'math'">
          <!-- PHASE 1: Summation -->
          <div v-if="currentQuizPhase === 1">
            <div class="bg-indigo-50 border-l-4 border-indigo-500 p-3 mb-3 rounded-r shadow-sm">
              <p class="text-indigo-900 text-sm font-semibold leading-snug">
                En este ejemplo (5 elementos) hicimos: <br />
                <span class="block text-center text-2xl font-black text-indigo-700 my-2"
                  >4 + 3 + 2 + 1 = <span class="text-3xl underline decoration-wavy">10</span></span
                >
                comparaciones totales.
              </p>
            </div>
            <p class="text-gray-800 font-bold mt-2 text-lg leading-tight">
              Si tuviéramos "n" elementos... ¿Cómo calcularíamos el total exacto siguiendo este
              patrón de "escalera"?
            </p>
          </div>

          <!-- PHASE 2: Big O Inference -->
          <!-- PHASE 2: Big O Inference -->
          <div v-else-if="currentQuizPhase === 2">
            <div class="bg-blue-50 border-l-4 border-blue-500 p-3 mb-3 rounded-r shadow-sm">
              <p class="text-blue-900 text-sm font-semibold leading-relaxed">
                En la pregunta anterior vimos que el total es <b>n(n-1)/2</b>. <br />
                Si simplificamos esto, el término que domina es:
                <span
                  class="inline-block text-xl font-black bg-white text-blue-800 px-2 py-1 rounded mx-1 shadow-sm border border-blue-200"
                  >n²</span
                >
                .
              </p>
            </div>
            <p class="text-gray-800 font-bold mt-2 text-lg leading-tight">
              Sabiendo esto... ¿Cómo crees que se clasifica la "velocidad" (complejidad) de este
              algoritmo?
            </p>
          </div>

          <!-- PHASE 3: Scaling Prediction -->
          <div v-else>
            <p class="text-gray-600 text-sm mt-2">
              Ahora usa tu intuición de <span class="font-mono font-bold">O(n²)</span>.
            </p>
            <p class="text-gray-800 font-bold mt-2 text-lg">
              Si <u>TRIPLICAMOS</u> (x3) la cantidad de datos de entrada... ¿Cuánto aumentarán las
              comparaciones?
            </p>
          </div>
        </template>

        <!-- --- SPACE QUIZ Questions --- -->
        <template v-else-if="quizTopic === 'space'">
          <!-- PHASE 1: Concrete Case -->
          <div v-if="currentQuizPhase === 1">
            <p class="text-gray-600 text-sm mt-2">
              Observa la sección de memoria resaltada. Ya hemos hecho 2 vueltas.
            </p>
            <p class="text-gray-800 font-bold mt-2 text-lg">
              ¿Cuántas variables EXTRA (además del array original) estamos usando para encontrar el
              menor?
            </p>
          </div>

          <!-- PHASE 2: Generalization -->
          <div v-else-if="currentQuizPhase === 2">
            <p class="text-indigo-900 font-medium text-lg mt-3 mb-2">
              Ahora imagina que ordenamos <br />
              <span
                class="inline-block bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded border-2 border-yellow-300 font-black text-2xl transform rotate-[-1deg] shadow-sm my-1"
              >
                1,000,000
              </span>
              <br />
              de elementos...
            </p>
            <p class="text-gray-800 font-bold mt-2 text-xl">
              ¿Cuánto espacio extra necesitaríamos?
            </p>
          </div>

          <!-- PHASE 3: VERDICT -->
          <div v-else>
            <p class="text-gray-600 font-medium text-base mt-2">
              Veredicto Final 🤔: Teniendo en cuenta todo (Número de comparaciones y Espacio
              O(1))...
            </p>
            <p class="text-gray-800 font-bold mt-2 text-xl">
              ¿Recomendarías Selection Sort para ordenar esa lista de 1000000 de datos?
            </p>
          </div>
        </template>
      </div>

      <!-- --- TIME OPTIONS --- -->
      <template v-if="quizTopic === 'complexity'">
        <!-- OPCIONES FASE 1 -->
        <div
          v-if="currentQuizPhase === 1"
          class="space-y-2"
        >
          <button
            @click="handleMidQuizAnswer('n')"
            :disabled="midQuizSolved"
            class="w-full p-3 rounded-lg border-2 text-left font-bold transition-all flex justify-between items-center group"
            :class="
              selectedOption === 'n'
                ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200 text-indigo-800'
                : 'border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 text-gray-700'
            "
          >
            <span>A) n comparaciones</span>
          </button>

          <button
            @click="handleMidQuizAnswer('n-1')"
            :disabled="midQuizSolved"
            class="w-full p-3 rounded-lg border-2 text-left font-bold transition-all flex justify-between items-center group"
            :class="
              selectedOption === 'n-1'
                ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200 text-indigo-800'
                : 'border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 text-gray-700'
            "
          >
            <span>B) n - 1 comparaciones</span>
          </button>

          <button
            @click="handleMidQuizAnswer('n/2')"
            :disabled="midQuizSolved"
            class="w-full p-3 rounded-lg border-2 text-left font-bold transition-all flex justify-between items-center group"
            :class="
              selectedOption === 'n/2'
                ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200 text-indigo-800'
                : 'border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 text-gray-700'
            "
          >
            <span>C) n / 2 comparaciones</span>
          </button>
        </div>

        <!-- OPCIONES FASE 2 -->
        <div
          v-else-if="currentQuizPhase === 2"
          class="space-y-2"
        >
          <button
            @click="handleMidQuizAnswer('zero')"
            :disabled="midQuizSolved"
            class="w-full p-3 rounded-lg border-2 text-left font-bold transition-all flex justify-between items-center group"
            :class="
              selectedOption === 'zero'
                ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200 text-indigo-800'
                : 'border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 text-gray-700'
            "
          >
            <span>A) Cero (Detecta que está ordenada)</span>
          </button>

          <button
            @click="handleMidQuizAnswer('fewer')"
            :disabled="midQuizSolved"
            class="w-full p-3 rounded-lg border-2 text-left font-bold transition-all flex justify-between items-center group"
            :class="
              selectedOption === 'fewer'
                ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200 text-indigo-800'
                : 'border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 text-gray-700'
            "
          >
            <span>B) Menos comparaciones</span>
          </button>

          <button
            @click="handleMidQuizAnswer('same')"
            :disabled="midQuizSolved"
            class="w-full p-3 rounded-lg border-2 text-left font-bold transition-all flex justify-between items-center group"
            :class="
              selectedOption === 'same'
                ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200 text-indigo-800'
                : 'border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 text-gray-700'
            "
          >
            <span>C) Las mismas comparaciones</span>
          </button>
        </div>

        <!-- OPCIONES FASE 3 -->
        <div
          v-else
          class="space-y-2"
        >
          <button
            @click="handleMidQuizAnswer('more')"
            :disabled="midQuizSolved"
            class="w-full p-3 rounded-lg border-2 text-left font-bold transition-all flex justify-between items-center group"
            :class="
              selectedOption === 'more'
                ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200 text-indigo-800'
                : 'border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 text-gray-700'
            "
          >
            <span>A) Aumentan drásticamente</span>
          </button>

          <button
            @click="handleMidQuizAnswer('constant')"
            :disabled="midQuizSolved"
            class="w-full p-3 rounded-lg border-2 text-left font-bold transition-all flex justify-between items-center group"
            :class="
              selectedOption === 'constant'
                ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200 text-indigo-800'
                : 'border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 text-gray-700'
            "
          >
            <span>B) Se mantienen igual</span>
          </button>

          <button
            @click="handleMidQuizAnswer('fewer')"
            :disabled="midQuizSolved"
            class="w-full p-3 rounded-lg border-2 text-left font-bold transition-all flex justify-between items-center group"
            :class="
              selectedOption === 'fewer'
                ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200 text-indigo-800'
                : 'border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 text-gray-700'
            "
          >
            <span>C) Se reducen (por ser el peor caso)</span>
          </button>
        </div>
      </template>

      <template v-else-if="quizTopic === 'strategy'">
        <!-- PHASE 1 OPTIONS -->
        <div
          v-if="currentQuizPhase === 1"
          class="space-y-2"
        >
          <button
            @click="handleMidQuizAnswer('min_to_start')"
            :disabled="midQuizSolved"
            class="w-full p-3 rounded-lg border-2 text-left font-bold transition-all flex justify-between items-center group"
            :class="
              selectedOption === 'min_to_start'
                ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200 text-indigo-800'
                : 'border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 text-gray-700'
            "
          >
            <span>A) Encuentro el MÍNIMO y lo pongo al INICIO.</span>
          </button>
          <button
            @click="handleMidQuizAnswer('max_to_end')"
            :disabled="midQuizSolved"
            class="w-full p-3 rounded-lg border-2 text-left font-bold transition-all flex justify-between items-center group"
            :class="
              selectedOption === 'max_to_end'
                ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200 text-indigo-800'
                : 'border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 text-gray-700'
            "
          >
            <span>B) Encuentro el MÁXIMO y lo pongo al FINAL.</span>
          </button>
          <button
            @click="handleMidQuizAnswer('neighbors')"
            :disabled="midQuizSolved"
            class="w-full p-3 rounded-lg border-2 text-left font-bold transition-all flex justify-between items-center group"
            :class="
              selectedOption === 'neighbors'
                ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200 text-indigo-800'
                : 'border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 text-gray-700'
            "
          >
            <span>C) Intercambio solo vecinos adyacentes.</span>
          </button>
        </div>

        <!-- PHASE 2 OPTIONS -->
        <div
          v-else-if="currentQuizPhase === 2"
          class="space-y-2"
        >
          <button
            @click="handleMidQuizAnswer('divide')"
            :disabled="midQuizSolved"
            class="w-full p-3 rounded-lg border-2 text-left font-bold transition-all flex justify-between items-center group"
            :class="
              selectedOption === 'divide'
                ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200 text-indigo-800'
                : 'border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 text-gray-700'
            "
          >
            <span>A) Divide y Vencerás - Dividir el problema en subproblemas</span>
          </button>
          <button
            @click="handleMidQuizAnswer('greedy')"
            :disabled="midQuizSolved"
            class="w-full p-3 rounded-lg border-2 text-left font-bold transition-all flex justify-between items-center group"
            :class="
              selectedOption === 'greedy'
                ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200 text-indigo-800'
                : 'border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 text-gray-700'
            "
          >
            <span>B) Voraz (Greedy) - Tomar lo mejor localmente</span>
          </button>
          <button
            @click="handleMidQuizAnswer('dynamic')"
            :disabled="midQuizSolved"
            class="w-full p-3 rounded-lg border-2 text-left font-bold transition-all flex justify-between items-center group"
            :class="
              selectedOption === 'dynamic'
                ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200 text-indigo-800'
                : 'border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 text-gray-700'
            "
          >
            <span>C) Programación Dinámica - Aprovechar soluciones de subproblemas</span>
          </button>
        </div>

        <!-- PHASE 3 OPTIONS -->
        <div
          v-else
          class="space-y-2"
        >
          <button
            @click="handleMidQuizAnswer('only_left')"
            :disabled="midQuizSolved"
            class="w-full p-3 rounded-lg border-2 text-left font-bold transition-all flex justify-between items-center group"
            :class="
              selectedOption === 'only_left'
                ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200 text-indigo-800'
                : 'border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 text-gray-700'
            "
          >
            <span>A) La parte izquierda siempre está ordenada.</span>
          </button>
          <button
            @click="handleMidQuizAnswer('random')"
            :disabled="midQuizSolved"
            class="w-full p-3 rounded-lg border-2 text-left font-bold transition-all flex justify-between items-center group"
            :class="
              selectedOption === 'random'
                ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200 text-indigo-800'
                : 'border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 text-gray-700'
            "
          >
            <span>B) La parte derecha es aleatoria y menor.</span>
          </button>
          <button
            @click="handleMidQuizAnswer('invariant_ok')"
            :disabled="midQuizSolved"
            class="w-full p-3 rounded-lg border-2 text-left font-bold transition-all flex justify-between items-center group"
            :class="
              selectedOption === 'invariant_ok'
                ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200 text-indigo-800'
                : 'border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 text-gray-700'
            "
          >
            <span>C) Izquierda ordenada + Derecha (Mayores) Desordenada.</span>
          </button>
        </div>
      </template>

      <!-- --- MATH OPTIONS --- -->
      <template v-else-if="quizTopic === 'math'">
        <!-- PHASE 1 OPTIONS -->
        <div
          v-if="currentQuizPhase === 1"
          class="space-y-2"
        >
          <button
            @click="handleMidQuizAnswer('sum_gauss')"
            :disabled="midQuizSolved"
            class="w-full p-3 rounded-lg border-2 text-left font-bold transition-all flex justify-between items-center group"
            :class="
              selectedOption === 'sum_gauss'
                ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200 text-indigo-800'
                : 'border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 text-gray-700'
            "
          >
            <span>A) Sumando desde 1 hasta (n-1)</span>
          </button>
          <button
            @click="handleMidQuizAnswer('sum_random')"
            :disabled="midQuizSolved"
            class="w-full p-3 rounded-lg border-2 text-left font-bold transition-all flex justify-between items-center group"
            :class="
              selectedOption === 'sum_random'
                ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200 text-indigo-800'
                : 'border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 text-gray-700'
            "
          >
            <span>B) Multiplicando n por 2</span>
          </button>
          <button
            @click="handleMidQuizAnswer('sum_linear')"
            :disabled="midQuizSolved"
            class="w-full p-3 rounded-lg border-2 text-left font-bold transition-all flex justify-between items-center group"
            :class="
              selectedOption === 'sum_linear'
                ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200 text-indigo-800'
                : 'border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 text-gray-700'
            "
          >
            <span>C) Multiplicando n por n</span>
          </button>
        </div>

        <!-- PHASE 2 OPTIONS -->
        <div
          v-else-if="currentQuizPhase === 2"
          class="space-y-2"
        >
          <button
            @click="handleMidQuizAnswer('linear')"
            :disabled="midQuizSolved"
            class="w-full p-3 rounded-lg border-2 text-left font-bold transition-all flex justify-between items-center group"
            :class="
              selectedOption === 'linear'
                ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200 text-indigo-800'
                : 'border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 text-gray-700'
            "
          >
            <span>A) Lineal (El esfuerzo es igual a la cantidad de datos)</span>
          </button>
          <button
            @click="handleMidQuizAnswer('log')"
            :disabled="midQuizSolved"
            class="w-full p-3 rounded-lg border-2 text-left font-bold transition-all flex justify-between items-center group"
            :class="
              selectedOption === 'log'
                ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200 text-indigo-800'
                : 'border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 text-gray-700'
            "
          >
            <span>B) Logarítmica (El esfuerzo crece muy lento)</span>
          </button>
          <button
            @click="handleMidQuizAnswer('quadratic')"
            :disabled="midQuizSolved"
            class="w-full p-3 rounded-lg border-2 text-left font-bold transition-all flex justify-between items-center group"
            :class="
              selectedOption === 'quadratic'
                ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200 text-indigo-800'
                : 'border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 text-gray-700'
            "
          >
            <span>C) Cuadrática (El esfuerzo es proporcional a n²)</span>
          </button>
        </div>

        <!-- PHASE 3 OPTIONS -->
        <div
          v-else
          class="space-y-2"
        >
          <button
            @click="handleMidQuizAnswer('scale_3')"
            :disabled="midQuizSolved"
            class="w-full p-3 rounded-lg border-2 text-left font-bold transition-all flex justify-between items-center group"
            :class="
              selectedOption === 'scale_3'
                ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200 text-indigo-800'
                : 'border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 text-gray-700'
            "
          >
            <span>A) Aumentan 3 veces (Lineal)</span>
          </button>
          <button
            @click="handleMidQuizAnswer('scale_6')"
            :disabled="midQuizSolved"
            class="w-full p-3 rounded-lg border-2 text-left font-bold transition-all flex justify-between items-center group"
            :class="
              selectedOption === 'scale_6'
                ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200 text-indigo-800'
                : 'border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 text-gray-700'
            "
          >
            <span>B) Aumentan 6 veces (Doble)</span>
          </button>
          <button
            @click="handleMidQuizAnswer('scale_9')"
            :disabled="midQuizSolved"
            class="w-full p-3 rounded-lg border-2 text-left font-bold transition-all flex justify-between items-center group"
            :class="
              selectedOption === 'scale_9'
                ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200 text-indigo-800'
                : 'border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 text-gray-700'
            "
          >
            <span>C) Aumentan 9 veces (Cuadrado de 3)</span>
          </button>
        </div>
      </template>

      <!-- --- SPACE OPTIONS --- -->
      <template v-else-if="quizTopic === 'space'">
        <!-- PHASE 1 OPTIONS -->
        <div
          v-if="currentQuizPhase === 1"
          class="space-y-2"
        >
          <button
            @click="handleMidQuizAnswer('1var')"
            :disabled="midQuizSolved"
            class="w-full p-3 rounded-lg border-2 text-left font-bold transition-all flex justify-between items-center group"
            :class="
              selectedOption === '1var'
                ? 'border-pink-600 bg-pink-50 ring-2 ring-pink-200 text-pink-800'
                : 'border-gray-200 hover:border-pink-500 hover:bg-pink-50 text-gray-700'
            "
          >
            <span>A) 1 variable (mínimo)</span>
          </button>

          <button
            @click="handleMidQuizAnswer('nvars')"
            :disabled="midQuizSolved"
            class="w-full p-3 rounded-lg border-2 text-left font-bold transition-all flex justify-between items-center group"
            :class="
              selectedOption === 'nvars'
                ? 'border-pink-600 bg-pink-50 ring-2 ring-pink-200 text-pink-800'
                : 'border-gray-200 hover:border-pink-500 hover:bg-pink-50 text-gray-700'
            "
          >
            <span>B) 1 variable por cada elemento (N)</span>
          </button>

          <button
            @click="handleMidQuizAnswer('2vars')"
            :disabled="midQuizSolved"
            class="w-full p-3 rounded-lg border-2 text-left font-bold transition-all flex justify-between items-center group"
            :class="
              selectedOption === '2vars'
                ? 'border-pink-600 bg-pink-50 ring-2 ring-pink-200 text-pink-800'
                : 'border-gray-200 hover:border-pink-500 hover:bg-pink-50 text-gray-700'
            "
          >
            <span>C) 2 variables por vuelta</span>
          </button>
        </div>

        <!-- PHASE 2 OPTIONS -->
        <div
          v-else-if="currentQuizPhase === 2"
          class="space-y-2"
        >
          <button
            @click="handleMidQuizAnswer('on')"
            :disabled="midQuizSolved"
            class="w-full p-3 rounded-lg border-2 text-left font-bold transition-all flex justify-between items-center group"
            :class="
              selectedOption === 'on'
                ? 'border-pink-600 bg-pink-50 ring-2 ring-pink-200 text-pink-800'
                : 'border-gray-200 hover:border-pink-500 hover:bg-pink-50 text-gray-700'
            "
          >
            <span>A) Necesitamos 1 millón de variables extra</span>
          </button>

          <button
            @click="handleMidQuizAnswer('on2')"
            :disabled="midQuizSolved"
            class="w-full p-3 rounded-lg border-2 text-left font-bold transition-all flex justify-between items-center group"
            :class="
              selectedOption === 'on2'
                ? 'border-pink-600 bg-pink-50 ring-2 ring-pink-200 text-pink-800'
                : 'border-gray-200 hover:border-pink-500 hover:bg-pink-50 text-gray-700'
            "
          >
            <span>B) Necesitamos trillones de variables (una matriz gigante)</span>
          </button>

          <button
            @click="handleMidQuizAnswer('o1')"
            :disabled="midQuizSolved"
            class="w-full p-3 rounded-lg border-2 text-left font-bold transition-all flex justify-between items-center group"
            :class="
              selectedOption === 'o1'
                ? 'border-pink-600 bg-pink-50 ring-2 ring-pink-200 text-pink-800'
                : 'border-gray-200 hover:border-pink-500 hover:bg-pink-50 text-gray-700'
            "
          >
            <span>C) Seguimos necesitando solo 1 variable extra</span>
          </button>
        </div>

        <!-- PHASE 3 OPTIONS -->
        <div
          v-else
          class="space-y-2"
        >
          <button
            @click="handleMidQuizAnswer('yes_mem')"
            :disabled="midQuizSolved"
            class="w-full p-3 rounded-lg border-2 text-left font-bold transition-all flex justify-between items-center group"
            :class="
              selectedOption === 'yes_mem'
                ? 'border-pink-600 bg-pink-50 ring-2 ring-pink-200 text-pink-800'
                : 'border-gray-200 hover:border-pink-500 hover:bg-pink-50 text-gray-700'
            "
          >
            <span>A) SÍ, porque ahorra mucha memoria RAM.</span>
          </button>

          <button
            @click="handleMidQuizAnswer('no')"
            :disabled="midQuizSolved"
            class="w-full p-3 rounded-lg border-2 text-left font-bold transition-all flex justify-between items-center group"
            :class="
              selectedOption === 'no'
                ? 'border-pink-600 bg-pink-50 ring-2 ring-pink-200 text-pink-800'
                : 'border-gray-200 hover:border-pink-500 hover:bg-pink-50 text-gray-700'
            "
          >
            <span>B) NO, tardaría demasiado por las comparaciones.</span>
          </button>

          <button
            @click="handleMidQuizAnswer('yes_easy')"
            :disabled="midQuizSolved"
            class="w-full p-3 rounded-lg border-2 text-left font-bold transition-all flex justify-between items-center group"
            :class="
              selectedOption === 'yes_easy'
                ? 'border-pink-600 bg-pink-50 ring-2 ring-pink-200 text-pink-800'
                : 'border-gray-200 hover:border-pink-500 hover:bg-pink-50 text-gray-700'
            "
          >
            <span>C) SÍ, es simple y rápido de implementar.</span>
          </button>
        </div>
      </template>

      <!-- Feedback -->
      <div
        v-if="midQuizFeedback"
        class="mt-4 p-4 rounded-lg text-center font-bold border-2 text-sm flex flex-col items-center gap-3 bg-white"
        :class="
          midQuizFeedback.type === 'success'
            ? 'border-green-500 text-green-800 shadow-green-100 shadow-lg'
            : 'border-red-500 text-red-800 shadow-red-100 shadow-lg'
        "
      >
        <p
          v-html="midQuizFeedback.text"
          class="text-base leading-snug"
        ></p>

        <!-- MANUAL CONTINUE BUTTON -->
        <button
          v-if="midQuizFeedback.type === 'success'"
          @click="advanceMidQuiz"
          class="px-8 py-3 bg-indigo-600 text-white font-black rounded-full shadow-xl hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-widest flex items-center gap-2 animate-bounce mt-2"
        >
          <span>Continuar</span> <span>➜</span>
        </button>
      </div>
    </div>
  </div>
  <!-- RESET CONFIRMATION MODAL -->
  <div
    v-if="showResetConfirmation"
    class="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
  >
    <div
      class="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full border-4 border-orange-400 transform scale-100 animate-bounce-in text-center relative overflow-hidden"
    >
      <!-- Background Pattern -->
      <div
        class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 via-red-400 to-orange-400"
      ></div>

      <div class="mb-4 text-6xl animate-pulse">⚠️</div>

      <h3 class="text-2xl font-black text-gray-800 mb-2 uppercase tracking-tight">
        ¿Reiniciar Todo?
      </h3>

      <p class="text-gray-600 font-medium mb-6 leading-relaxed">
        Tu progreso actual se perderá y el algoritmo volverá al inicio con nuevos datos.
        <br />
        <span class="text-xs text-orange-600 font-bold uppercase tracking-widest mt-2 block"
          >Esta acción es irreversible</span
        >
      </p>

      <div class="flex gap-3 justify-center">
        <button
          @click="showResetConfirmation = false"
          class="px-5 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 border-2 border-transparent transition-all hover:scale-105 active:scale-95"
        >
          Cancelar
        </button>
        <button
          @click="confirmReset"
          class="px-5 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg shadow-orange-200 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
        >
          <span>🔄</span> Sí, Reiniciar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import Bottle from '../components/Bottle.vue';

// --- QUIZ LOGIC ---
const showQuizIntro = ref(false);
const showMidQuiz = ref(false);

const startMidQuiz = () => {
  showQuizIntro.value = false;
  showMidQuiz.value = true;
};
const midQuizSolved = ref(false);
const currentQuizPhase = ref(1); // 1, 2, 3 phases
const quizTopic = ref<'complexity' | 'space' | 'strategy' | 'math'>('complexity'); // New state with math
const midQuizFeedback = ref<{ type: 'success' | 'error'; text: string } | null>(null);
const selectedOption = ref<string | null>(null);

const showMinDefaultTip = ref(false); // Tooltip for first iteration default min
const showResetConfirmation = ref(false); // Modal state for reset warnings

const showFinalSummary = ref(false);

const finishAlgorithmSummary = () => {
  showFinalSummary.value = false;
  continueNextIteration();
};

const advanceMidQuiz = () => {
  midQuizFeedback.value = null;
  midQuizSolved.value = false;
  selectedOption.value = null;

  // Si estamos en el último quiz (Math) y terminamos la última fase (3), mostramos resumen
  if (quizTopic.value === 'math' && currentQuizPhase.value >= 3) {
    showMidQuiz.value = false;
    showFinalSummary.value = true;
    return;
  }

  // Logic to advance phase or close based on topic/phase
  if (currentQuizPhase.value < 3) {
    currentQuizPhase.value++;
  } else {
    showMidQuiz.value = false;
    midQuizSolved.value = false; // Reset for next time
    continueNextIteration();
  }
};

const handleMidQuizAnswer = (option: string) => {
  selectedOption.value = option;
  // ==========================================
  // TOPIC: SPACE COMPLEXITY (Iteration 2)
  // ==========================================
  if (quizTopic.value === 'space') {
    // --- PHASE 1: Variables Count ---
    if (currentQuizPhase.value === 1) {
      if (option === '1var') {
        midQuizFeedback.value = {
          type: 'success',
          text: '¡CORRECTO! 🎯 <br> Solo usamos <b>UNA</b> variable extra para rastrear al menor. No creamos nuevos arrays.',
        };
        midQuizSolved.value = true;
      } else if (option === 'nvars') {
        midQuizFeedback.value = {
          type: 'error',
          text: 'Incorrecto. 💾 <br> No estamos creando una variable por cada elemento. Solo una para el líder.',
        };
      } else if (option === '2vars') {
        midQuizFeedback.value = {
          type: 'error',
          text: 'Incorrecto. 💾 <br> Solo necesitamos recordar la POSICIÓN del menor.',
        };
      }
    }
    // --- PHASE 2: Generalization O(1) ---
    else if (currentQuizPhase.value === 2) {
      if (option === 'o1') {
        midQuizFeedback.value = {
          type: 'success',
          text: '¡EXACTO! 🎓 <br> No importa si son 5 o 1 millón de datos, solo usamos una variable para rastrear el mínimo.<br> A esto le llamamos <b>Espacio Constante O(1)</b>.',
        };
        midQuizSolved.value = true;
      } else if (option === 'on') {
        midQuizFeedback.value = {
          type: 'error',
          text: 'Incorrecto. ❌ <br> No necesitamos crear una copia de la lista. Solo apuntamos al índice del menor. El espacio no crece (es O(1), no O(n)).',
        };
      } else if (option === 'on2') {
        midQuizFeedback.value = {
          type: 'error',
          text: 'Incorrecto. ❌ <br> Eso sería excesivo. Selection Sort es eficiente en memoria porque trabaja "in-place" (en el mismo lugar).',
        };
      }
    }
    // --- PHASE 3: Verdict (Efficiency Balance) ---
    else if (currentQuizPhase.value === 3) {
      if (option === 'no') {
        midQuizFeedback.value = {
          type: 'success',
          text: '¡BRILLANTE! 🌟 <br> Aunque usa <u>poca memoria</u> (bueno), hace <b>DEMASIADAS comparaciones</b> (malo).<br> Para 1 millón de datos, haría ~500 mil millones de comparaciones. ¡Tardaría años! 🐢',
        };
        midQuizSolved.value = true;
      } else if (option === 'yes_mem') {
        midQuizFeedback.value = {
          type: 'error',
          text: 'Cuidado... ⚠️ <br> Ahorrar memoria es genial, pero el TIEMPO de espera sería inaceptable por las comparaciones O(n²).',
        };
      } else if (option === 'yes_easy') {
        midQuizFeedback.value = {
          type: 'error',
          text: 'Incorrecto. ⚠️ <br> "Fácil" no significa "Rápido". En producción, la velocidad suele importar más que la simplicidad del código.',
        };
      }
    }
    return;
  }

  // ==========================================
  // TOPIC: STRATEGY & INVARIANT (Iteration 3)
  // ==========================================
  if (quizTopic.value === 'strategy') {
    // --- PHASE 1: Action Analysis ---
    if (currentQuizPhase.value === 1) {
      if (option === 'min_to_start') {
        midQuizFeedback.value = {
          type: 'success',
          text: '¡ASI ES! 👋 <br> Básicamente buscamos al "más pequeño" del grupo desordenado y lo "rescatamos" llevándolo a la zona segura (ordenada) al inicio.',
        };
        midQuizSolved.value = true;
      } else if (option === 'max_to_end') {
        midQuizFeedback.value = {
          type: 'error',
          text: 'Incorrecto. ❌ <br> Eso sería Bubble Sort (burbujear el mayor al final).',
        };
      } else if (option === 'neighbors') {
        midQuizFeedback.value = {
          type: 'error',
          text: 'Incorrecto. ❌ <br> No solo comparamos vecinos, escaneamos TODO para hallar el mínimo real.',
        };
      }
    }
    // --- PHASE 2: Official Strategy (Greedy) ---
    else if (currentQuizPhase.value === 2) {
      if (option === 'greedy') {
        midQuizFeedback.value = {
          type: 'success',
          text: '¡CORRECTO! 🦁 <b>VORAZ (Greedy)</b>.<br> En cada paso, toma la mejor decisión local (el mínimo actual) sin pensar en el futuro, y eso construye la solución global.',
        };
        midQuizSolved.value = true;
      } else if (option === 'divide') {
        midQuizFeedback.value = {
          type: 'error',
          text: 'Incorrecto. ❌ <br> Divide y Vencerás rompe el problema en subproblemas (como Merge Sort), aquí no dividimos nada.',
        };
      } else if (option === 'dynamic') {
        midQuizFeedback.value = {
          type: 'error',
          text: 'Incorrecto. ❌ <br> Este algoritmo no guarda ni reutiliza subproblemas, por eso no es programación dinámica.',
        };
      }
    }
    // --- PHASE 3: Invariant ---
    else if (currentQuizPhase.value === 3) {
      if (option === 'invariant_ok') {
        midQuizFeedback.value = {
          type: 'success',
          text: '¡EXACTO! 🛡️ <b>La Invariante</b>.<br> La parte izquierda siempre crece ordenada. La derecha disminuye desordenada, y todos en la derecha son MAYORES que los de la izquierda.',
        };
        midQuizSolved.value = true;
      } else if (option === 'only_left') {
        midQuizFeedback.value = {
          type: 'error',
          text: 'Incompleto. ⚠️ <br> La izquierda está ordenada, sí, pero falta la relación con la derecha.',
        };
      } else if (option === 'random') {
        midQuizFeedback.value = {
          type: 'error',
          text: 'Incorrecto. ❌ <br> La parte derecha no es aleatoria, contiene siempre elementos mayores que la parte ordenada.',
        };
      }
    }
    return;
  }

  // ==========================================
  // TOPIC: MATH & BIG O (Iteration 4)
  // ==========================================
  if (quizTopic.value === 'math') {
    // --- PHASE 1: Summation ---
    if (currentQuizPhase.value === 1) {
      if (option === 'sum_gauss') {
        selectedOption.value = 'sum_gauss';
        midQuizFeedback.value = {
          type: 'success',
          text: '¡EXACTO! 🪜 <br> Es una "escalera" que baja: (n-1) + (n-2) + ... + 1.<br> Esta famosa suma vale matemáticamente: <b>n(n-1) / 2</b>.',
        };
        midQuizSolved.value = true;
      } else if (option === 'sum_random') {
        selectedOption.value = 'sum_random';
        midQuizFeedback.value = {
          type: 'error',
          text: 'Incorrecto. ❌ <br> n*2 es muy pequeño (Lineal). Necesitamos sumar desde 1 hasta (n-1).',
        };
      } else if (option === 'sum_linear') {
        selectedOption.value = 'sum_linear';
        midQuizFeedback.value = {
          type: 'error',
          text: 'Cerca... 🤏 <br> n*n es el orden de magnitud (Cuadrático), pero la operación exacta es la SUMA de 1 a n-1.',
        };
      }
    }
    // --- PHASE 2: Big O ---
    else if (currentQuizPhase.value === 2) {
      if (option === 'quadratic') {
        selectedOption.value = 'quadratic';
        midQuizFeedback.value = {
          type: 'success',
          text: '¡CORRECTO! 🎯 <br> Al tener <b>n²</b> llamamos a esto <b>Complejidad Cuadrática O(n²)</b>.<br> Esto significa que el trabajo crece "al cuadrado" de los datos (es muy costoso).',
        };
        midQuizSolved.value = true;
      } else if (option === 'linear') {
        selectedOption.value = 'linear';
        midQuizFeedback.value = {
          type: 'error',
          text: 'Incorrecto. ❌ <br> Lineal sería si la fórmula fuera solo "n". Aquí tenemos n² (n multiplicado por n), que es mucho mayor.',
        };
      } else if (option === 'log') {
        selectedOption.value = 'log';
        midQuizFeedback.value = {
          type: 'error',
          text: 'Incorrecto. ❌ <br> Logarítmico es extremadamente rápido. Nuestra "escalera" es la mitad de un cuadrado, así que es lento.',
        };
      }
    }
    // --- PHASE 3: Scaling ---
    else if (currentQuizPhase.value === 3) {
      if (option === 'scale_9') {
        selectedOption.value = 'scale_9';
        midQuizFeedback.value = {
          type: 'success',
          text: '¡IMPRESIONANTE! 🚀 <br> Si triplicas la entrada (3x), el esfuerzo se multiplica por 3² = <b>9 veces</b>.<br> ¡Por eso Selection Sort es peligroso para listas grandes!',
        };
        midQuizSolved.value = true;
      } else if (option === 'scale_3') {
        selectedOption.value = 'scale_3';
        midQuizFeedback.value = {
          type: 'error',
          text: 'Incorrecto. ❌ <br> Eso sería lineal O(n). Aquí pagamos el precio al cuadrado.',
        };
      } else if (option === 'scale_6') {
        selectedOption.value = 'scale_6';
        midQuizFeedback.value = {
          type: 'error',
          text: 'Incorrecto. ❌ <br> Recuerda elevar al cuadrado el factor de crecimiento (3²).',
        };
      }
    }
    return;
  }

  // ==========================================
  // TOPIC: TIME COMPLEXITY (Iteration 1)
  // ==========================================
  // ==========================================
  // TOPIC: TIME COMPLEXITY (Iteration 1)
  // ==========================================
  if (quizTopic.value === 'complexity') {
    // --- PHASE 1: Generaliza Fórmula ---
    if (currentQuizPhase.value === 1) {
      if (option === 'n-1') {
        midQuizFeedback.value = {
          type: 'success',
          text: '¡CORECTO! 🎉 <br> Se hacen <b>n-1</b> comparaciones.',
        };
        midQuizSolved.value = true;
      } else if (option === 'n') {
        midQuizFeedback.value = {
          type: 'error',
          text: 'Incorrecto. No comparas el elemento consigo mismo.',
        };
      } else if (option === 'n/2') {
        midQuizFeedback.value = {
          type: 'error',
          text: 'Incorrecto. Debes comparar con TODOS los restantes, no solo la mitad.',
        };
      }
    }
    // --- PHASE 2: Sorted Scenario ---
    else if (currentQuizPhase.value === 2) {
      if (option === 'same') {
        midQuizFeedback.value = {
          type: 'success',
          text: '¡EXACTO! 🧠 <br> <b>Selection Sort es "ciego" al orden.</b> <br> Siempre realiza todas las comparaciones para asegurarse de encontrar el mínimo, incluso si ya está ordenado.',
        };
        midQuizSolved.value = true;
      } else if (option === 'zero') {
        midQuizFeedback.value = {
          type: 'error',
          text: 'Incorrecto. ❌ <br> El algoritmo <b>no sabe</b> que está ordenado mágicamente. Debe verificarlo.',
        };
      } else if (option === 'fewer') {
        midQuizFeedback.value = {
          type: 'error',
          text: 'Incorrecto. ❌ <br> Selection Sort no se detiene antes. Sigue buscando el mínimo hasta el final.',
        };
      }
    }
    // --- PHASE 3: Reversed Scenario ---
    else if (currentQuizPhase.value === 3) {
      if (option === 'constant') {
        midQuizFeedback.value = {
          type: 'success',
          text: '¡MAESTRO DEL ORDENAMIENTO! 🎓 <br> Has entendido la clave: <b>Selection Sort siempre hace n-1 comparaciones por vuelta</b>.<br> No importa si está ordenada, invertida o aleatoria. ¡Su complejidad de comparaciones es constante!',
        };
        midQuizSolved.value = true;
      } else if (option === 'more') {
        midQuizFeedback.value = {
          type: 'error',
          text: 'Incorrecto. ❌ <br> Aunque es el "peor caso" para intercambios, ¡las <b>comparaciones</b> son exactamente las mismas!',
        };
      } else if (option === 'fewer') {
        midQuizFeedback.value = {
          type: 'error',
          text: 'Incorrecto. ❌ <br> No hay atajos, el algoritmo compara todo contra todo siempre.',
        };
      }
    }
    return;
  }
};
// ------------------

interface Bottle {
  id: number;
  weight: number;
  color: string;
}

type ComparisonState = 'heavier' | 'lighter' | 'equal' | null;

// State
const unsortedBottles = ref<(Bottle | null)[]>([]);
const sortedBottles = ref<(Bottle | null)[]>([null, null, null, null, null]);

const leftBottle = ref<Bottle | null>(null);
const rightBottle = ref<Bottle | null>(null);
const currentCompareLeft = ref<number | null>(null);
const currentCompareRight = ref<number | null>(null);

const minIndex = ref<number | null>(null);
const minBottle = ref<Bottle | null>(null);
const tempValue = ref<number | null>(null);
const tempUsed = ref(false);

const currentIteration = ref(0);
const currentCompareIndex = ref(0);
const comparisons = ref(0);
const swaps = ref(0);

const scaleResult = ref<{ left: ComparisonState; right: ComparisonState } | null>(null);
const scaleWeighed = ref(false);

const message = ref('');
const messageType = ref<'error' | 'success' | 'info'>('info');
const instructionHint = ref('');

const isComplete = ref(false);
const showQuiz = ref(false);

// Drag and drop state
const draggedBottleIndex = ref<number | null>(null);
const waitingForNewMinDrag = ref(false); // true when waiting for user to drag new min to box
const pendingNewMinBottle = ref<Bottle | null>(null); // temporary storage for new min before drag
const pendingNewMinIndex = ref<number | null>(null); // temporary storage for new min index
const waitingForSwapDrag = ref(false); // true when waiting for swap at end of iteration

// Scale Notification State
const scaleNotification = ref('');
const scaleNotificationType = ref<'new' | 'keep' | null>(null);

// End of Iteration Summary Popup
const iterationSummary = ref<{
  show: boolean;
  title: string;
  description: string;
  type: 'swap' | 'stay';
}>({ show: false, title: '', description: '', type: 'stay' });

// Watch for auto-weighing when both bottles are on scale
watch([leftBottle, rightBottle], ([left, right]) => {
  if (left && right && !scaleWeighed.value) {
    // Auto weigh after a short delay
    setTimeout(() => {
      weighBottles();
    }, 500);
  }
});

// Initialize
const initializeBottles = () => {
  const bottles: Bottle[] = [];
  const palette = [
    'bg-red-400',
    'bg-blue-400',
    'bg-green-400',
    'bg-purple-400',
    'bg-yellow-400',
    'bg-pink-400',
    'bg-cyan-400',
    'bg-orange-400',
  ];
  palette.sort(() => Math.random() - 0.5);

  for (let i = 0; i < 5; i++) {
    bottles.push({
      id: i + 1,
      weight: Math.floor(Math.random() * 80) + 20,
      color: palette[i % palette.length],
    });
  }
  unsortedBottles.value = bottles;
  sortedBottles.value = [null, null, null, null, null];

  currentIteration.value = 0;
  currentCompareIndex.value = 1;
  comparisons.value = 0;
  swaps.value = 0;

  // Initialize minIndex with first element of unsorted part
  minIndex.value = 0;
  minBottle.value = bottles[0];

  // Reset waiting and temp states completely
  tempValue.value = null;
  tempUsed.value = false;
  leftBottle.value = null;
  rightBottle.value = null;
  scaleWeighed.value = false;
  scaleResult.value = null;
  isComplete.value = false;

  // Reset Quiz State
  showMidQuiz.value = false;
  midQuizSolved.value = false;
  midQuizFeedback.value = null;
  currentQuizPhase.value = 1;

  waitingForNewMinDrag.value = false;
  pendingNewMinBottle.value = null;
  pendingNewMinIndex.value = null;
  waitingForSwapDrag.value = false;
  scaleNotification.value = '';
  scaleNotificationType.value = null;
  showMinDefaultTip.value = true; // Show tooltip at start

  // Mensaje introductorio con formato rico y mayor duración
  showMessage(
    '<b class="text-indigo-700 text-lg">SELECTION SORT:</b> siempre elige <b class="text-yellow-600 uppercase">EL MENOR</b> y lo fija al inicio de la <b class="text-cyan-600 uppercase">LISTA DESORDENADA</b>.',
    'info',
    6000,
  );

  // Retrasar la instrucción para dar tiempo de lectura al concepto
  setInstruction('');
  setTimeout(() => {
    setInstruction(
      `Arrastra <b class="text-yellow-600 uppercase">EL MENOR ACTUAL</b> (índice ${minIndex.value}) y el elemento <b class="text-cyan-600 uppercase">A COMPARAR</b> a la balanza.`,
    );
  }, 5000);
};

const totalIterations = computed(() => 4);

// Unified memory array representation
const memoryArray = computed(() => {
  const array: (number | null)[] = [];

  for (let i = 0; i < 5; i++) {
    if (i < currentIteration.value && sortedBottles.value[i]) {
      array.push(sortedBottles.value[i]!.weight);
    } else {
      const bottle = unsortedBottles.value[i];
      array.push(bottle ? bottle.weight : null);
    }
  }

  return array;
});

// All bottles in a single unified list for display
const allBottles = computed(() => {
  const bottles: (Bottle | null)[] = [];

  for (let i = 0; i < 5; i++) {
    if (i < currentIteration.value) {
      bottles.push(sortedBottles.value[i]);
    } else {
      bottles.push(unsortedBottles.value[i]);
    }
  }

  return bottles;
});

const isInitialState = computed(() => {
  return (
    currentIteration.value === 0 &&
    currentCompareIndex.value === 1 &&
    comparisons.value === 0 &&
    !leftBottle.value &&
    !rightBottle.value
  );
});

const canWeigh = computed(() => {
  return leftBottle.value !== null && rightBottle.value !== null && !scaleWeighed.value;
});

const scaleRotation = computed(() => {
  if (!scaleResult.value) return 'rotate(0deg)';
  if (scaleResult.value.left === 'heavier') return 'rotate(-8deg)';
  if (scaleResult.value.right === 'heavier') return 'rotate(8deg)';
  return 'rotate(0deg)';
});

const leftPanTransform = computed(() => {
  if (!scaleResult.value) return 'translateY(0)';
  if (scaleResult.value.left === 'heavier') return 'translateY(24px)';
  if (scaleResult.value.left === 'lighter') return 'translateY(-24px)';
  return 'translateY(0)';
});

const rightPanTransform = computed(() => {
  if (!scaleResult.value) return 'translateY(0)';
  if (scaleResult.value.right === 'heavier') return 'translateY(24px)';
  if (scaleResult.value.right === 'lighter') return 'translateY(-24px)';
  return 'translateY(0)';
});

// Shake both the min and the element to compare
const shouldShakeBottle = (index: number) => {
  // If waiting for drag of new min, ONLY shake the pending new min
  if (waitingForNewMinDrag.value) {
    return index === pendingNewMinIndex.value;
  }

  if (waitingForSwapDrag.value) {
    return index === minIndex.value;
  }

  const nextToCompare = currentIteration.value + currentCompareIndex.value;
  const unsortedCount = 5 - currentIteration.value;

  if (currentCompareIndex.value >= unsortedCount) return false;

  // Shake if no bottles on scale and this is either the min or the next to compare
  return (
    (index === nextToCompare || index === minIndex.value) &&
    leftBottle.value === null &&
    rightBottle.value === null &&
    index >= currentIteration.value
  );
};

const shouldDimBottle = (index: number) => {
  // Strict focus when waiting for new min drag
  if (waitingForNewMinDrag.value) {
    return index !== pendingNewMinIndex.value;
  }

  // Strict focus when waiting for swap drag
  if (waitingForSwapDrag.value) {
    return index !== minIndex.value;
  }

  if (minIndex.value === null) return false;

  const nextToCompare = currentIteration.value + currentCompareIndex.value;
  const unsortedCount = 5 - currentIteration.value;

  if (currentCompareIndex.value < unsortedCount) {
    return index !== minIndex.value && index !== nextToCompare && index >= currentIteration.value;
  }

  return false;
};

const highlightLeftPan = computed(() => {
  if (waitingForNewMinDrag.value) return false;
  if (draggedBottleIndex.value === null) return false;
  // Highlight left pan if dragging current min
  return draggedBottleIndex.value === minIndex.value;
});

const highlightRightPan = computed(() => {
  if (waitingForNewMinDrag.value) return false;
  if (draggedBottleIndex.value === null) return false;
  // Highlight right pan if dragging element to compare
  return draggedBottleIndex.value === currentIteration.value + currentCompareIndex.value;
});

const shouldDimBottomPanels = computed(() => {
  // Estado inicial: Opaco hasta que se pese por primera vez para enfocar en la balanza
  if (comparisons.value === 0 && !scaleWeighed.value) return true;

  // Dim if waiting for special actions OR if dragging something that isn't for those actions
  if (waitingForNewMinDrag.value || waitingForSwapDrag.value) return true;

  // During normal compare drag, dim the bottom panels to focus on scale
  if (draggedBottleIndex.value !== null) return true;

  return false;
});

let messageTimeout: number | undefined;

const showMessage = (
  msg: string,
  type: 'error' | 'success' | 'info' = 'info',
  duration: number = 4000,
) => {
  message.value = msg;
  messageType.value = type;

  if (messageTimeout) clearTimeout(messageTimeout);

  messageTimeout = window.setTimeout(() => {
    message.value = '';
  }, duration);
};

const setInstruction = (hint: string) => {
  instructionHint.value = hint;
};

const onBottleClick = (index: number) => {
  if (waitingForNewMinDrag.value) {
    if (index === pendingNewMinIndex.value) {
      showMessage(
        '👇 Arrastra este frasco al cuadro MENOR ACTUAL para actualizar el mínimo.',
        'success',
      );
    } else {
      showMessage('⚠️ Este no es el nuevo menor encontrado. Busca el resaltado.', 'error');
    }
    return;
  }

  if (waitingForSwapDrag.value) {
    if (index === minIndex.value) {
      showMessage('👇 Arrastra este frasco a la primera posición desordenada.', 'success');
    } else {
      showMessage('⚠️ Debes mover el MENOR ACTUAL (marcado en amarillo).', 'error');
    }
    return;
  }

  // Default behavior
  showMessage('👆 Arrastra los frascos a la balanza para compararlos.', 'info');
};

// Drag and Drop Functions
const onDragStart = (event: DragEvent, index: number) => {
  showMinDefaultTip.value = false; // Hide tooltip on interaction
  // Restrict interactions based on state
  if (waitingForNewMinDrag.value && index !== pendingNewMinIndex.value) {
    event.preventDefault();
    return;
  }
  if (waitingForSwapDrag.value) {
    if (index !== minIndex.value) {
      event.preventDefault();
      return;
    }
    // If user starts dragging the correct bottle for swap, hide summary
    iterationSummary.value.show = false;
  }

  const bottle = unsortedBottles.value[index];
  if (!bottle || index < currentIteration.value) return;

  draggedBottleIndex.value = index;
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('bottleIndex', index.toString());
  }
};

const onDragEnd = () => {
  draggedBottleIndex.value = null;
};

const onDropOnScale = (event: DragEvent, pan: 'left' | 'right') => {
  event.preventDefault();

  const index = draggedBottleIndex.value;
  if (index === null) return;

  const bottle = unsortedBottles.value[index];
  if (!bottle) return;

  const expectedToCompare = currentIteration.value + currentCompareIndex.value;

  if (pan === 'left') {
    if (index === minIndex.value) {
      leftBottle.value = bottle;
      currentCompareLeft.value = index;
      setInstruction(
        'Ahora arrastra el frasco <b class="text-cyan-600 uppercase">A COMPARAR</b> al lado derecho de la balanza.',
      );
    } else {
      showMessage('⚠️ El lado izquierdo de la balanza es para el MENOR ACTUAL.', 'error');
    }
  } else if (pan === 'right') {
    if (index === expectedToCompare) {
      rightBottle.value = bottle;
      currentCompareRight.value = index;

      if (!leftBottle.value) {
        setInstruction(
          `Ahora arrastra <b class="text-yellow-600 uppercase">EL MENOR ACTUAL</b> al lado izquierdo de la balanza.`,
        );
        showMessage('⚠️ Falta el MENOR ACTUAL en el lado izquierdo.', 'info');
      } else {
        setInstruction('¡Perfecto! La balanza pesará automáticamente.');
      }
    } else {
      showMessage(
        `⚠️ Debes arrastrar el frasco índice ${expectedToCompare} para comparar.`,
        'error',
      );
    }
  }

  draggedBottleIndex.value = null;
};

const onDragOver = (event: DragEvent) => {
  event.preventDefault();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move';
  }
};

const onScalePanClick = (pan: 'left' | 'right') => {
  // Optional: handle click on pans
};

const onDropOnMinBox = (event: DragEvent) => {
  event.preventDefault();

  const index = draggedBottleIndex.value;
  if (index === null) return;

  // Only accept when waiting for new min drag
  if (!waitingForNewMinDrag.value) {
    // Check if it's just a timing issue (we found a min recently but state isn't ready)
    // For now, just show a softer warning
    if (scaleNotificationType.value === 'new') {
      //message.value = '⏳ Espera un segundo a que termine el pesaje...';
      //message.value = '✅ ¡Correcto! Nuevo menor guardado correctamente.';
      messageType.value = 'info';
      setTimeout(() => {
        if (message.value.includes('Espera')) message.value = '';
      }, 1000); // Clear fast
    } else {
      showMessage('⚠️ Aún no has encontrado un nuevo menor para actualizar.', 'info');
    }
    return;
  }

  // Check if correct bottle
  if (index !== pendingNewMinIndex.value) {
    showMessage(
      `⚠️ Debes arrastrar el frasco índice ${pendingNewMinIndex.value} que es el nuevo menor.`,
      'error',
    );
    return;
  }

  // Success! Now update minBottle and minIndex
  waitingForNewMinDrag.value = false;
  minBottle.value = pendingNewMinBottle.value;
  minIndex.value = pendingNewMinIndex.value;
  pendingNewMinBottle.value = null;
  pendingNewMinIndex.value = null;

  showMessage('✅ ¡Correcto! Nuevo menor guardado.', 'success');

  setTimeout(() => {
    message.value = ''; // Clean message so it doesn't overlap with next step animations
    proceedToNextComparison();
  }, 2000);
};

const onDropOnBottle = (event: DragEvent, targetIndex: number) => {
  event.preventDefault();

  // Only active when waiting for swap
  if (!waitingForSwapDrag.value) return;

  const draggedIndex = draggedBottleIndex.value;
  if (draggedIndex === null) return;

  const minIdx = minIndex.value;
  const targetPos = currentIteration.value;

  // Validar drop correcto: Arrastró el MIN hacia la posición inicial
  if (draggedIndex === minIdx && targetIndex === targetPos) {
    waitingForSwapDrag.value = false;
    showMessage('✅ Correcto! Realizando intercambio...', 'success');
    finalizeIterationLogic();
  } else {
    if (draggedIndex !== minIdx) {
      showMessage(`⚠️ Debes arrastrar el frasco MENOR (índice ${minIdx}).`, 'error');
    } else {
      showMessage(`⚠️ Debes soltarlo en la posición inicial (índice ${targetPos}).`, 'error');
    }
  }
};

const clearScale = () => {
  leftBottle.value = null;
  rightBottle.value = null;
  currentCompareLeft.value = null;
  currentCompareRight.value = null;
  scaleWeighed.value = false;
  scaleResult.value = null;
};

const weighBottles = () => {
  if (!canWeigh.value || !leftBottle.value || !rightBottle.value) return;

  comparisons.value++;
  scaleWeighed.value = true;

  const leftWeight = leftBottle.value.weight;
  const rightWeight = rightBottle.value.weight;

  if (leftWeight > rightWeight) {
    scaleResult.value = { left: 'heavier', right: 'lighter' };
    showMessage(
      `El menor actual (${leftWeight}) es MÁS PESADO. Se encontró un nuevo menor: ${rightWeight}`,
      'info',
    );

    // NOTIFICATION: NEW MIN
    scaleNotification.value = '¡NUEVO MENOR ENCONTRADO!';
    scaleNotificationType.value = 'new';

    // Clear previous error messages immediately
    message.value = '';
    messageType.value = 'info';

    setTimeout(() => {
      // NO actualizar minBottle/minIndex aún, solo guardar temporalmente
      pendingNewMinBottle.value = rightBottle.value;
      pendingNewMinIndex.value = currentCompareRight.value;
      waitingForNewMinDrag.value = true;
      showMessage('✅ ¡Nuevo menor encontrado!', 'success', 2000);
      setInstruction(
        `Arrastra el frasco <b class="text-yellow-600 uppercase">MENOR</b> (índice ${currentCompareRight.value}) al cuadro MENOR ACTUAL para guardarlo como el nuevo mínimo.`,
      );
    }, 1000); // Back to 1s for fluid interaction
  } else if (rightWeight > leftWeight) {
    scaleResult.value = { left: 'lighter', right: 'heavier' };

    // NOTIFICATION: KEEP
    scaleNotification.value = 'EL MENOR SE MANTIENE';
    scaleNotificationType.value = 'keep';

    showMessage(
      `⚓ No se encontró un nuevo menor. El menor actual (${leftWeight}) se mantiene.`,
      'info',
    );
    setTimeout(() => {
      proceedToNextComparison();
    }, 3500);
  } else {
    scaleResult.value = { left: 'equal', right: 'equal' };

    // NOTIFICATION: KEEP (Equal)
    scaleNotification.value = 'PESO IGUAL - SE MANTIENE';
    scaleNotificationType.value = 'keep';

    showMessage('⚖️️ Mismo peso. El menor actual se mantiene.', 'info');
    setTimeout(() => {
      proceedToNextComparison();
    }, 3500);
  }
};

const proceedToNextComparison = () => {
  if (leftBottle.value && currentCompareLeft.value !== null) {
    unsortedBottles.value[currentCompareLeft.value] = leftBottle.value;
  }
  if (rightBottle.value && currentCompareRight.value !== null) {
    unsortedBottles.value[currentCompareRight.value] = rightBottle.value;
  }

  leftBottle.value = null;
  rightBottle.value = null;
  scaleWeighed.value = false;
  scaleResult.value = null;
  scaleNotification.value = ''; // Clear notification
  scaleNotificationType.value = null;
  currentCompareLeft.value = null;
  currentCompareRight.value = null;

  currentCompareIndex.value++;

  const unsortedCount = 5 - currentIteration.value;

  if (currentCompareIndex.value >= unsortedCount) {
    completeIteration();
  } else {
    // const nextToCompare = currentIteration.value + currentCompareIndex.value; // Not used in msg
    setInstruction(
      `Arrastra <b class="text-yellow-600 uppercase">EL MENOR ACTUAL</b> y el elemento <b class="text-cyan-600 uppercase">A COMPARAR</b> a la balanza.`,
    );
  }
};

const completeIteration = () => {
  if (!minBottle.value || minIndex.value === null) {
    showMessage('Error: No se encontró un mínimo en esta iteración', 'error');
    return;
  }

  const firstUnsortedIndex = currentIteration.value;

  // Si el menor NO es el primero de la lista desordenada, pedir SWAP manual
  if (minIndex.value !== firstUnsortedIndex) {
    // 1. Show Popup First
    iterationSummary.value = {
      show: true,
      title: '¡Menor Encontrado!',
      description: `El frasco menor (índice ${minIndex.value}) NO está al inicio. Debes moverlo a la posición inicial (índice ${firstUnsortedIndex}).`,
      type: 'swap',
    };

    // 2. Delay action enabling to allow reading
    setTimeout(() => {
      waitingForSwapDrag.value = true;
      showMessage(
        `🔄 Arrastra el MENOR (índice ${minIndex.value}) a la posición ${firstUnsortedIndex}.`,
        'success',
      );
      setInstruction(
        `Arrastra el frasco MENOR (amarillo flotante) hacia la posición ${firstUnsortedIndex} para hacer el intercambio.`,
      );

      // Hide popup after a while automatically? Or keep it?
      // Let's hide it when drag starts (already handled in onDragStart)
    }, 2500); // 2.5s delay for reading

    return;
  }

  // Si ya está en su sitio
  // POPUP: ALREADY IN PLACE
  iterationSummary.value = {
    show: true,
    title: '¡Excelente!',
    description: 'El menor ya está en la primera posición. ¡No es necesario moverlo!',
    type: 'stay',
  };

  showMessage('✅ El menor ya está en la posición correcta.', 'success');
  setTimeout(() => {
    iterationSummary.value.show = false; // Hide popup
    finalizeIterationLogic();
  }, 3000); // 3 seconds to read
};

const finalizeIterationLogic = () => {
  const firstUnsortedIndex = currentIteration.value;
  const minBottleValue = minBottle.value;
  const firstBottle = unsortedBottles.value[firstUnsortedIndex];

  if (!firstBottle || !minBottleValue) return;

  // Ejecutar el swap (lógico y visual)
  tempValue.value = firstBottle.weight; // Solo interno
  tempUsed.value = true;

  unsortedBottles.value[firstUnsortedIndex] = minBottleValue;
  unsortedBottles.value[minIndex.value!] = firstBottle;

  swaps.value++;

  setTimeout(() => {
    // Mover a sorted
    const minToSort = unsortedBottles.value[firstUnsortedIndex];
    if (minToSort) {
      sortedBottles.value[currentIteration.value] = minToSort;
      unsortedBottles.value[firstUnsortedIndex] = null;
    }

    tempValue.value = null;
    tempUsed.value = false;

    currentIteration.value++;
    currentCompareIndex.value = 1;

    // Check for Mid-Sort Quiz 1: Time Complexity (End of 1st Iteration)
    if (currentIteration.value === 1) {
      quizTopic.value = 'complexity';
      currentQuizPhase.value = 1;
      showQuizIntro.value = true;
      return;
    }

    // Check for Mid-Sort Quiz 2: Space Complexity (End of 2nd Iteration)
    if (currentIteration.value === 2) {
      quizTopic.value = 'space';
      currentQuizPhase.value = 1;
      midQuizSolved.value = false; // Reset solution state
      midQuizFeedback.value = null;
      showQuizIntro.value = true;
      return;
    }

    // Check for Mid-Sort Quiz 3: Strategy & Invariant (End of 3rd Iteration)
    if (currentIteration.value === 3) {
      quizTopic.value = 'strategy';
      currentQuizPhase.value = 1;
      midQuizSolved.value = false;
      midQuizFeedback.value = null;
      showQuizIntro.value = true;
      return;
    }

    // Check for Final Quiz 4: Math & Big O (End of 4th Iteration)
    if (currentIteration.value === 4) {
      quizTopic.value = 'math';
      currentQuizPhase.value = 1;
      midQuizSolved.value = false;
      midQuizFeedback.value = null;
      showQuizIntro.value = true;
      return;
    }

    // Check for Final Quiz 4: Math & Big O (End of 4th Iteration)
    if (currentIteration.value === 4) {
      quizTopic.value = 'math';
      currentQuizPhase.value = 1;
      midQuizSolved.value = false;
      midQuizFeedback.value = null;
      showMidQuiz.value = true;
      return;
    }

    continueNextIteration();
  }, 1000);
};

const continueNextIteration = () => {
  if (currentIteration.value >= totalIterations.value) {
    finishSort();
  } else {
    const newFirstIndex = currentIteration.value;
    minIndex.value = newFirstIndex;
    minBottle.value = unsortedBottles.value[newFirstIndex];

    showMessage(
      `✅ Iteración ${currentIteration.value} completada. Preparando siguiente vuelta...`,
      'success',
    );
    setInstruction('');

    setTimeout(() => {
      showMessage(
        `🚀 Comenzando iteración ${currentIteration.value + 1} con la nueva lista desordenada...`,
        'info',
      );

      setTimeout(() => {
        setInstruction(
          `Arrastra <b class="text-yellow-600 uppercase">EL MENOR ACTUAL</b> y el elemento <b class="text-cyan-600 uppercase">A COMPARAR</b> a la balanza.`,
        );
      }, 2000);
    }, 2000);
  }
};

const finishSort = () => {
  const remaining = unsortedBottles.value.filter((b) => b !== null);
  if (remaining.length === 1) {
    sortedBottles.value[4] = remaining[0];
    unsortedBottles.value[unsortedBottles.value.indexOf(remaining[0])] = null;
    // IMPORTANTE: Incrementar iteración para que allBottles muestre el último elemento desde sortedBottles
    currentIteration.value = 5;
  }

  isComplete.value = true;
  showMessage('🎉 ¡Ordenamiento completado!', 'success');
  setInstruction('¡Felicidades! Has completado el algoritmo Selection Sort.');
};

const resetAlgorithm = () => {
  // Check if there is any progress to lose
  if (currentIteration.value > 0 || comparisons.value > 0) {
    showResetConfirmation.value = true;
    return;
  }
  initializeBottles();
};

const confirmReset = () => {
  initializeBottles();
  showResetConfirmation.value = false;
};

// Initialize on mount
initializeBottles();
</script>

<style scoped>
@keyframes sway {
  0%,
  100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(2deg);
  }
  75% {
    transform: rotate(-2deg);
  }
}

.animate-sway {
  animation: sway 3s ease-in-out infinite;
}
</style>
