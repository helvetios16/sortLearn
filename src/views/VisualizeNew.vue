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
      <!-- Top Row: Lista de Frascos + Balanza (Principal focus) -->
      <div class="grid grid-cols-12 gap-8 flex-1 min-h-[50%]">
        <!-- Left Column: Bottle List -->
        <div
          class="col-span-8 bg-white rounded-lg shadow-lg p-3 border-2 border-blue-300 transition-all duration-300"
          :class="{
            'ring-4 ring-blue-400 ring-opacity-50 shadow-[0_0_15px_rgba(59,130,246,0.5)]':
              isInitialState,
          }"
        >
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-base font-bold text-blue-700 flex items-center gap-2">
              LISTA DE FRASCOS
              <span
                v-if="isInitialState"
                class="flex h-3 w-3 relative"
              >
                <span
                  class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"
                ></span>
                <span class="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
              </span>
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
                <div
                  v-if="showMinDefaultTip && currentIteration === 0 && idx === 0"
                  class="absolute -top-[70px] z-50 animate-bounce pointer-events-none w-32 flex flex-col items-center"
                >
                  <div
                    class="relative bg-white text-gray-800 text-[10px] p-2 rounded-lg border-2 border-indigo-500 shadow-xl text-center font-bold leading-tight"
                  >
                    El "menor" es el primero por defecto
                    <div
                      class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b-2 border-r-2 border-indigo-500 transform rotate-45"
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
            class="bg-white rounded-lg shadow-md p-2 border border-blue-300 flex-1 relative transition-all duration-300"
            :class="{
              'opacity-30 pointer-events-none':
                waitingForNewMinDrag || waitingForSwapDrag || iterationSummary.show,
              'ring-4 ring-blue-400 ring-opacity-50 shadow-[0_0_15px_rgba(59,130,246,0.5)]':
                isInitialState && !waitingForNewMinDrag,
            }"
          >
            <h3
              class="text-sm font-bold text-gray-700 mb-1 text-center flex justify-center items-center gap-2"
            >
              <span>⚖️</span>
              <span>BALANZA</span>
              <span
                v-if="isInitialState"
                class="flex h-3 w-3 relative"
              >
                <span
                  class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"
                ></span>
                <span class="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
              </span>
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
                  class="w-24 h-32 flex flex-col items-center justify-center transition-all duration-300 rounded-xl"
                  :class="{
                    'shadow-[0_0_20px_rgba(234,179,8,0.6)] ring-4 ring-yellow-400 ring-opacity-70 scale-110':
                      highlightLeftPan,
                  }"
                  @drop="onDropOnScale($event, 'left')"
                  @dragover="onDragOver"
                >
                  <div class="min-h-[70px] flex items-center justify-center">
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
                    class="w-20 h-5 rounded-full bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-500 border-2 border-yellow-600 shadow-lg mt-1"
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
                  class="w-24 h-32 flex flex-col items-center justify-center transition-all duration-300 rounded-xl"
                  :class="{
                    'shadow-[0_0_20px_rgba(34,211,238,0.6)] ring-4 ring-cyan-400 ring-opacity-70 scale-110':
                      highlightRightPan,
                  }"
                  @drop="onDropOnScale($event, 'right')"
                  @dragover="onDragOver"
                >
                  <div class="min-h-[70px] flex items-center justify-center">
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
                    class="w-20 h-5 rounded-full bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-500 border-2 border-yellow-600 shadow-lg mt-1"
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

      <!-- Messages & Instruction (Barra completa en medio) -->
      <div
        v-if="message || instructionHint"
        class="p-2 rounded-r-lg rounded-bl-lg shadow-lg border-l-8 flex items-center gap-3 transition-all duration-500 transform hover:scale-[1.005] min-h-[60px]"
        :class="{
          'bg-white border-red-500 text-red-800 shadow-red-100': message && messageType === 'error',
          'bg-white border-green-500 text-green-900 shadow-green-100':
            message && messageType === 'success',
          'bg-white border-blue-500 text-slate-800 shadow-blue-100':
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
              'text-red-600': message && messageType === 'error',
              'text-green-600': message && messageType === 'success',
              'text-blue-600': !message || messageType === 'info',
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

      <!-- Bottom Row: Information Panels (Memoria, Complejidad, Menor y Botones) -->
      <div class="grid grid-cols-12 gap-8 h-[35%]">
        <!-- MEMORIA -->
        <div
          class="col-span-4 bg-white rounded-lg shadow-md p-2 border border-purple-200 overflow-auto transition-all duration-500 relative"
          :class="{
            'opacity-20 grayscale pointer-events-none':
              shouldDimBottomPanels && !(showMidQuiz && quizTopic === 'space'),
            'z-[100] ring-4 ring-pink-400 scale-105 shadow-2xl':
              showMidQuiz && quizTopic === 'space',
          }"
        >
          <h3 class="text-sm font-bold text-purple-700 mb-1 flex items-center gap-1">
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
              <span class="text-[10px] font-semibold text-green-800">Ordenado</span>
            </div>
            <div
              class="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded border border-yellow-300"
            >
              <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span class="text-[10px] font-semibold text-yellow-800">Menor</span>
            </div>
            <div
              class="flex items-center gap-1 bg-cyan-50 px-2 py-1 rounded border border-cyan-300"
            >
              <div class="w-2 h-2 bg-cyan-500 rounded-full"></div>
              <span class="text-[10px] font-semibold text-cyan-800">A comparar</span>
            </div>
          </div>
          <div class="bg-amber-50 border border-amber-400 rounded p-1.5 mb-1">
            <p class="text-[10px] font-bold text-amber-800">
              min_index = <span class="text-lg">{{ minIndex !== null ? minIndex : '?' }}</span>
            </p>
          </div>
        </div>

        <!-- COMPLEJIDAD -->
        <div
          class="col-span-4 bg-white rounded-lg shadow-md p-2 border border-blue-200 transition-all duration-500 relative overflow-hidden flex flex-col"
          :class="{
            'opacity-20 grayscale pointer-events-none':
              shouldDimBottomPanels &&
              !(showMidQuiz && (quizTopic === 'complexity' || quizTopic === 'math')),
            'z-[100] ring-4 ring-yellow-400 scale-105 shadow-2xl':
              showMidQuiz && (quizTopic === 'complexity' || quizTopic === 'math'),
          }"
        >
          <h3 class="text-sm font-bold text-blue-700 mb-2 flex items-center gap-1 shrink-0">
            <span>📊</span> <span>COMPLEJIDAD</span>
          </h3>
          <div class="flex flex-col gap-2 h-full overflow-hidden">
            <!-- Totales -->
            <div class="grid grid-cols-2 gap-2 shrink-0">
              <div class="bg-blue-50 rounded p-1.5 text-center border border-blue-200">
                <p class="text-[9px] text-blue-700 uppercase tracking-wider font-bold mb-0.5">
                  Total Comparaciones
                </p>
                <p class="text-xl font-extrabold text-blue-600 leading-none">{{ comparisons }}</p>
              </div>
              <div class="bg-purple-50 rounded p-1.5 text-center border border-purple-200">
                <p class="text-[9px] text-purple-700 uppercase tracking-wider font-bold mb-0.5">
                  Intercambios
                </p>
                <p class="text-xl font-extrabold text-purple-600 leading-none">{{ swaps }}</p>
              </div>
            </div>

            <!-- Desglose por Iteración -->
            <div
              class="bg-white rounded border border-gray-200 p-1 flex-1 flex flex-col justify-start overflow-hidden"
            >
              <div
                class="flex justify-between items-end mb-0.5 border-b border-gray-100 pb-0.5 shrink-0"
              >
                <span class="text-[9px] font-black text-gray-500 uppercase tracking-wider"
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
                        ? 'text-blue-700'
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
                      class="font-extrabold text-blue-700 text-[11px]"
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
            class="rounded-lg shadow-md p-2 border-2 transition-all duration-300 flex-1 flex flex-col"
            :class="[
              waitingForNewMinDrag
                ? 'bg-yellow-100 border-yellow-500 animate-pulse shadow-yellow-500/50 shadow-2xl'
                : 'bg-yellow-50 border-yellow-400',
              {
                'opacity-20 grayscale pointer-events-none':
                  waitingForSwapDrag || (draggedBottleIndex !== null && !waitingForNewMinDrag),
              },
            ]"
            @drop="onDropOnMinBox"
            @dragover="onDragOver"
          >
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

  <!-- MID-ITERATION QUIZ MODAL -->
  <div
    v-if="showMidQuiz"
    class="fixed inset-0 bg-black/80 z-[90] flex justify-end items-start backdrop-blur-sm p-4 pr-6 pt-24"
  >
    <div
      class="bg-white rounded-xl shadow-2xl p-6 max-w-lg w-full transform transition-all animate-bounce-in border-4 border-indigo-500"
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
            <p class="text-gray-600 text-sm mt-2">
              Acabas de completar la primera vuelta con <b>5 elementos</b> e hiciste
              <b>4 comparaciones</b>.
            </p>
            <p class="text-gray-800 font-bold mt-2 text-lg">
              Si tuvieras "n" elementos, ¿cuántas comparaciones harías en la primera vuelta?
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
            <p class="text-gray-600 text-sm mt-2">
              Mira el total de operaciones (4 + 3 + 2 + 1 = 10)...
            </p>
            <p class="text-gray-800 font-bold mt-2 text-lg">
              ¿Por qué sale exactamente ese número? ¿Qué fórmula matemática representa esta suma?
            </p>
          </div>

          <!-- PHASE 2: Big O Inference -->
          <div v-else-if="currentQuizPhase === 2">
            <p class="text-gray-600 text-sm mt-2">
              La fórmula anterior es <span class="font-mono bg-gray-100 px-1">n(n-1)/2</span>. Si
              expandimos eso, obtenemos algo proporcional a
              <span class="font-mono bg-gray-100 px-1">n²</span>.
            </p>
            <p class="text-gray-800 font-bold mt-2 text-lg">
              ¿Cómo llamamos a esta clase de complejidad en notación Big O?
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
          class="space-y-3"
        >
          <button
            @click="handleMidQuizAnswer('n')"
            :disabled="midQuizSolved"
            class="w-full p-4 rounded-lg border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 text-left font-bold text-gray-700 transition-all flex justify-between items-center group"
          >
            <span>A) n comparaciones</span>
          </button>

          <button
            @click="handleMidQuizAnswer('n-1')"
            :disabled="midQuizSolved"
            class="w-full p-4 rounded-lg border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 text-left font-bold text-gray-700 transition-all flex justify-between items-center group"
          >
            <span>B) n - 1 comparaciones</span>
          </button>

          <button
            @click="handleMidQuizAnswer('n/2')"
            :disabled="midQuizSolved"
            class="w-full p-4 rounded-lg border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 text-left font-bold text-gray-700 transition-all flex justify-between items-center group"
          >
            <span>C) n / 2 comparaciones</span>
          </button>
        </div>

        <!-- OPCIONES FASE 2 -->
        <div
          v-else-if="currentQuizPhase === 2"
          class="space-y-3"
        >
          <button
            @click="handleMidQuizAnswer('zero')"
            :disabled="midQuizSolved"
            class="w-full p-4 rounded-lg border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 text-left font-bold text-gray-700 transition-all flex justify-between items-center group"
          >
            <span>A) Cero (Detecta que está ordenada)</span>
          </button>

          <button
            @click="handleMidQuizAnswer('fewer')"
            :disabled="midQuizSolved"
            class="w-full p-4 rounded-lg border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 text-left font-bold text-gray-700 transition-all flex justify-between items-center group"
          >
            <span>B) Menos comparaciones</span>
          </button>

          <button
            @click="handleMidQuizAnswer('same')"
            :disabled="midQuizSolved"
            class="w-full p-4 rounded-lg border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 text-left font-bold text-gray-700 transition-all flex justify-between items-center group"
          >
            <span>C) Las mismas comparaciones</span>
          </button>
        </div>

        <!-- OPCIONES FASE 3 -->
        <div
          v-else
          class="space-y-3"
        >
          <button
            @click="handleMidQuizAnswer('more')"
            :disabled="midQuizSolved"
            class="w-full p-4 rounded-lg border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 text-left font-bold text-gray-700 transition-all flex justify-between items-center group"
          >
            <span>A) Aumentan drásticamente</span>
          </button>

          <button
            @click="handleMidQuizAnswer('constant')"
            :disabled="midQuizSolved"
            class="w-full p-4 rounded-lg border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 text-left font-bold text-gray-700 transition-all flex justify-between items-center group"
          >
            <span>B) Se mantienen igual</span>
          </button>

          <button
            @click="handleMidQuizAnswer('fewer')"
            :disabled="midQuizSolved"
            class="w-full p-4 rounded-lg border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 text-left font-bold text-gray-700 transition-all flex justify-between items-center group"
          >
            <span>C) Se reducen (por ser el peor caso)</span>
          </button>
        </div>
      </template>

      <!-- --- STRATEGY OPTIONS --- -->
      <template v-else-if="quizTopic === 'strategy'">
        <!-- PHASE 1 OPTIONS -->
        <div
          v-if="currentQuizPhase === 1"
          class="space-y-3"
        >
          <button
            @click="handleMidQuizAnswer('min_to_start')"
            :disabled="midQuizSolved"
            class="w-full p-4 rounded-lg border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 text-left font-bold text-gray-700 transition-all flex justify-between items-center group"
          >
            <span>A) Encuentro el MÍNIMO y lo pongo al INICIO.</span>
          </button>
          <button
            @click="handleMidQuizAnswer('max_to_end')"
            :disabled="midQuizSolved"
            class="w-full p-4 rounded-lg border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 text-left font-bold text-gray-700 transition-all flex justify-between items-center group"
          >
            <span>B) Encuentro el MÁXIMO y lo pongo al FINAL.</span>
          </button>
          <button
            @click="handleMidQuizAnswer('neighbors')"
            :disabled="midQuizSolved"
            class="w-full p-4 rounded-lg border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 text-left font-bold text-gray-700 transition-all flex justify-between items-center group"
          >
            <span>C) Intercambio solo vecinos adyacentes.</span>
          </button>
        </div>

        <!-- PHASE 2 OPTIONS -->
        <div
          v-else-if="currentQuizPhase === 2"
          class="space-y-3"
        >
          <button
            @click="handleMidQuizAnswer('divide')"
            :disabled="midQuizSolved"
            class="w-full p-4 rounded-lg border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 text-left font-bold text-gray-700 transition-all flex justify-between items-center group"
          >
            <span>A) Divide y Vencerás (Divide & Conquer)</span>
          </button>
          <button
            @click="handleMidQuizAnswer('greedy')"
            :disabled="midQuizSolved"
            class="w-full p-4 rounded-lg border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 text-left font-bold text-gray-700 transition-all flex justify-between items-center group"
          >
            <span>B) Voraz (Greedy) - Tomar lo mejor localmente</span>
          </button>
          <button
            @click="handleMidQuizAnswer('dynamic')"
            :disabled="midQuizSolved"
            class="w-full p-4 rounded-lg border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 text-left font-bold text-gray-700 transition-all flex justify-between items-center group"
          >
            <span>C) Programación Dinámica</span>
          </button>
        </div>

        <!-- PHASE 3 OPTIONS -->
        <div
          v-else
          class="space-y-3"
        >
          <button
            @click="handleMidQuizAnswer('only_left')"
            :disabled="midQuizSolved"
            class="w-full p-4 rounded-lg border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 text-left font-bold text-gray-700 transition-all flex justify-between items-center group"
          >
            <span>A) La parte izquierda siempre está ordenada.</span>
          </button>
          <button
            @click="handleMidQuizAnswer('random')"
            :disabled="midQuizSolved"
            class="w-full p-4 rounded-lg border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 text-left font-bold text-gray-700 transition-all flex justify-between items-center group"
          >
            <span>B) La parte derecha es aleatoria y menor.</span>
          </button>
          <button
            @click="handleMidQuizAnswer('invariant_ok')"
            :disabled="midQuizSolved"
            class="w-full p-4 rounded-lg border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 text-left font-bold text-gray-700 transition-all flex justify-between items-center group"
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
          class="space-y-3"
        >
          <button
            @click="handleMidQuizAnswer('sum_gauss')"
            :disabled="midQuizSolved"
            class="w-full p-4 rounded-lg border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 text-left font-bold text-gray-700 transition-all flex justify-between items-center group"
          >
            <span>A) Suma de Gauss: (n-1) * n / 2</span>
          </button>
          <button
            @click="handleMidQuizAnswer('sum_random')"
            :disabled="midQuizSolved"
            class="w-full p-4 rounded-lg border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 text-left font-bold text-gray-700 transition-all flex justify-between items-center group"
          >
            <span>B) Es el factorial de n (n!)</span>
          </button>
          <button
            @click="handleMidQuizAnswer('sum_linear')"
            :disabled="midQuizSolved"
            class="w-full p-4 rounded-lg border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 text-left font-bold text-gray-700 transition-all flex justify-between items-center group"
          >
            <span>C) Es simplemente n * 2</span>
          </button>
        </div>

        <!-- PHASE 2 OPTIONS -->
        <div
          v-else-if="currentQuizPhase === 2"
          class="space-y-3"
        >
          <button
            @click="handleMidQuizAnswer('linear')"
            :disabled="midQuizSolved"
            class="w-full p-4 rounded-lg border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 text-left font-bold text-gray-700 transition-all flex justify-between items-center group"
          >
            <span>A) Lineal O(n)</span>
          </button>
          <button
            @click="handleMidQuizAnswer('log')"
            :disabled="midQuizSolved"
            class="w-full p-4 rounded-lg border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 text-left font-bold text-gray-700 transition-all flex justify-between items-center group"
          >
            <span>B) Logarítmica O(log n)</span>
          </button>
          <button
            @click="handleMidQuizAnswer('quadratic')"
            :disabled="midQuizSolved"
            class="w-full p-4 rounded-lg border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 text-left font-bold text-gray-700 transition-all flex justify-between items-center group"
          >
            <span>C) Cuadrática O(n²)</span>
          </button>
        </div>

        <!-- PHASE 3 OPTIONS -->
        <div
          v-else
          class="space-y-3"
        >
          <button
            @click="handleMidQuizAnswer('scale_3')"
            :disabled="midQuizSolved"
            class="w-full p-4 rounded-lg border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 text-left font-bold text-gray-700 transition-all flex justify-between items-center group"
          >
            <span>A) Aumentan 3 veces (Lineal)</span>
          </button>
          <button
            @click="handleMidQuizAnswer('scale_6')"
            :disabled="midQuizSolved"
            class="w-full p-4 rounded-lg border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 text-left font-bold text-gray-700 transition-all flex justify-between items-center group"
          >
            <span>B) Aumentan 6 veces (Doble)</span>
          </button>
          <button
            @click="handleMidQuizAnswer('scale_9')"
            :disabled="midQuizSolved"
            class="w-full p-4 rounded-lg border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 text-left font-bold text-gray-700 transition-all flex justify-between items-center group"
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
          class="space-y-3"
        >
          <button
            @click="handleMidQuizAnswer('1var')"
            :disabled="midQuizSolved"
            class="w-full p-4 rounded-lg border-2 border-gray-200 hover:border-pink-500 hover:bg-pink-50 text-left font-bold text-gray-700 transition-all flex justify-between items-center group"
          >
            <span>A) 1 variable (mínimo)</span>
          </button>

          <button
            @click="handleMidQuizAnswer('nvars')"
            :disabled="midQuizSolved"
            class="w-full p-4 rounded-lg border-2 border-gray-200 hover:border-pink-500 hover:bg-pink-50 text-left font-bold text-gray-700 transition-all flex justify-between items-center group"
          >
            <span>B) 1 variable por cada elemento (N)</span>
          </button>

          <button
            @click="handleMidQuizAnswer('2vars')"
            :disabled="midQuizSolved"
            class="w-full p-4 rounded-lg border-2 border-gray-200 hover:border-pink-500 hover:bg-pink-50 text-left font-bold text-gray-700 transition-all flex justify-between items-center group"
          >
            <span>C) 2 variables por vuelta</span>
          </button>
        </div>

        <!-- PHASE 2 OPTIONS -->
        <div
          v-else-if="currentQuizPhase === 2"
          class="space-y-3"
        >
          <button
            @click="handleMidQuizAnswer('on')"
            :disabled="midQuizSolved"
            class="w-full p-4 rounded-lg border-2 border-gray-200 hover:border-pink-500 hover:bg-pink-50 text-left font-bold text-gray-700 transition-all flex justify-between items-center group"
          >
            <span>A) Aumenta mucho (Lineal O(n))</span>
          </button>

          <button
            @click="handleMidQuizAnswer('on2')"
            :disabled="midQuizSolved"
            class="w-full p-4 rounded-lg border-2 border-gray-200 hover:border-pink-500 hover:bg-pink-50 text-left font-bold text-gray-700 transition-all flex justify-between items-center group"
          >
            <span>B) Aumenta muchísimo (Cuadrático O(n²))</span>
          </button>

          <button
            @click="handleMidQuizAnswer('o1')"
            :disabled="midQuizSolved"
            class="w-full p-4 rounded-lg border-2 border-gray-200 hover:border-pink-500 hover:bg-pink-50 text-left font-bold text-gray-700 transition-all flex justify-between items-center group"
          >
            <span>C) Se mantiene en 1 variable (Constante O(1))</span>
          </button>
        </div>

        <!-- PHASE 3 OPTIONS -->
        <div
          v-else
          class="space-y-3"
        >
          <button
            @click="handleMidQuizAnswer('yes_mem')"
            :disabled="midQuizSolved"
            class="w-full p-4 rounded-lg border-2 border-gray-200 hover:border-pink-500 hover:bg-pink-50 text-left font-bold text-gray-700 transition-all flex justify-between items-center group"
          >
            <span>A) SÍ, porque ahorra mucha memoria RAM.</span>
          </button>

          <button
            @click="handleMidQuizAnswer('no')"
            :disabled="midQuizSolved"
            class="w-full p-4 rounded-lg border-2 border-gray-200 hover:border-pink-500 hover:bg-pink-50 text-left font-bold text-gray-700 transition-all flex justify-between items-center group"
          >
            <span>B) NO, tardaría demasiado por las comparaciones.</span>
          </button>

          <button
            @click="handleMidQuizAnswer('yes_easy')"
            :disabled="midQuizSolved"
            class="w-full p-4 rounded-lg border-2 border-gray-200 hover:border-pink-500 hover:bg-pink-50 text-left font-bold text-gray-700 transition-all flex justify-between items-center group"
          >
            <span>C) SÍ, es simple y rápido de implementar.</span>
          </button>
        </div>
      </template>

      <!-- Feedback -->
      <div
        v-if="midQuizFeedback"
        class="mt-4 p-3 rounded-lg text-center font-bold animate-pulse"
        :class="
          midQuizFeedback.type === 'success'
            ? 'bg-green-100 text-green-700 border border-green-300'
            : 'bg-red-100 text-red-700 border border-red-300'
        "
      >
        <span v-html="midQuizFeedback.text"></span>
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
const showMidQuiz = ref(false);
const midQuizSolved = ref(false);
const currentQuizPhase = ref(1); // 1, 2, 3 phases
const quizTopic = ref<'complexity' | 'space' | 'strategy' | 'math'>('complexity'); // New state with math
const midQuizFeedback = ref<{ type: 'success' | 'error'; text: string } | null>(null);

const showMinDefaultTip = ref(false); // Tooltip for first iteration default min
const showResetConfirmation = ref(false); // Modal state for reset warnings

const handleMidQuizAnswer = (option: string) => {
  // ==========================================
  // TOPIC: SPACE COMPLEXITY (Iteration 2)
  // ==========================================
  // ==========================================
  // TOPIC: SPACE COMPLEXITY (Iteration 2)
  // ==========================================
  if (quizTopic.value === 'space') {
    // --- PHASE 1: Variables Count ---
    if (currentQuizPhase.value === 1) {
      if (option === '1var') {
        midQuizFeedback.value = {
          type: 'success',
          text: '¡CORRECTO! 🎯 <br> Solo usamos <b>UNA</b> variable extra (min_index) para rastrear al menor. No creamos nuevos arrays.',
        };
        midQuizSolved.value = true;
        setTimeout(() => {
          midQuizFeedback.value = null;
          midQuizSolved.value = false;
          currentQuizPhase.value = 2; // Go to Space Phase 2
        }, 3000);
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
          text: '¡EXACTO! 🎓 <br> Si la cantidad de elementos (N) aumenta a 1 millón, ¡sigues necesitando solo <b>1 variable extra</b>!<br> Por eso la complejidad espacial es <b>Constante O(1)</b>.',
        };
        midQuizSolved.value = true;
        setTimeout(() => {
          midQuizFeedback.value = null;
          midQuizSolved.value = false;
          currentQuizPhase.value = 3; // Go to Space Phase 3 (Verdict)
        }, 5000);
      } else if (option === 'on') {
        midQuizFeedback.value = {
          type: 'error',
          text: 'Incorrecto. ❌ <br> El espacio extra NO crece con los datos.',
        };
      } else if (option === 'on2') {
        midQuizFeedback.value = {
          type: 'error',
          text: 'Incorrecto. ❌ <br> No estamos duplicando datos.',
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
        setTimeout(() => {
          showMidQuiz.value = false;
          midQuizFeedback.value = null;
          continueNextIteration();
        }, 7000); // 7s to read final verdict
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
        setTimeout(() => {
          midQuizFeedback.value = null;
          midQuizSolved.value = false;
          currentQuizPhase.value = 2;
        }, 4000);
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
        setTimeout(() => {
          midQuizFeedback.value = null;
          midQuizSolved.value = false;
          currentQuizPhase.value = 3;
        }, 5000);
      } else if (option === 'divide') {
        midQuizFeedback.value = {
          type: 'error',
          text: 'Incorrecto. ❌ <br> Divide y Vencerás rompe el problema en subproblemas (como Merge Sort), aquí no dividimos nada.',
        };
      } else if (option === 'dynamic') {
        midQuizFeedback.value = {
          type: 'error',
          text: 'Incorrecto. ❌ <br> No estamos reutilizando sub-soluciones complejas.',
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
        setTimeout(() => {
          showMidQuiz.value = false;
          midQuizFeedback.value = null;
          continueNextIteration();
        }, 6000);
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
        midQuizFeedback.value = {
          type: 'success',
          text: '¡EXCELENTE! 🔢 <br> Es la suma de Gauss de 1 a (n-1).<br> Matemáticamente: <b>n(n-1) / 2</b>.',
        };
        midQuizSolved.value = true;
        setTimeout(() => {
          midQuizFeedback.value = null;
          midQuizSolved.value = false;
          currentQuizPhase.value = 2;
        }, 4000);
      } else if (option === 'sum_random') {
        midQuizFeedback.value = {
          type: 'error',
          text: 'Incorrecto. ❌ <br> El factorial crece muchísimo más rápido.',
        };
      } else if (option === 'sum_linear') {
        midQuizFeedback.value = {
          type: 'error',
          text: 'Incorrecto. ❌ <br> 5 * 2 = 10 coincide por casualidad aquí, pero no es la fórmula general.',
        };
      }
    }
    // --- PHASE 2: Big O ---
    else if (currentQuizPhase.value === 2) {
      if (option === 'quadratic') {
        midQuizFeedback.value = {
          type: 'success',
          text: '¡CORRECTO! 📈 <b>O(n²)</b>.<br> En Big O, el término al cuadrado (n²) domina al lineal (n), así que decimos que el algoritmo es "Cuadrático".',
        };
        midQuizSolved.value = true;
        setTimeout(() => {
          midQuizFeedback.value = null;
          midQuizSolved.value = false;
          currentQuizPhase.value = 3;
        }, 5000);
      } else if (option === 'linear') {
        midQuizFeedback.value = {
          type: 'error',
          text: 'Incorrecto. ❌ <br> Si fuera lineal, al doblar los datos, el tiempo se doblaría. Aquí crece mucho más.',
        };
      } else if (option === 'log') {
        midQuizFeedback.value = {
          type: 'error',
          text: 'Incorrecto. ❌ <br> Logarítmico sería muy rápido (como Binary Search).',
        };
      }
    }
    // --- PHASE 3: Scaling ---
    else if (currentQuizPhase.value === 3) {
      if (option === 'scale_9') {
        midQuizFeedback.value = {
          type: 'success',
          text: '¡IMPRESIONANTE! 🚀 <br> Si triplicas la entrada (3x), el esfuerzo se multiplica por 3² = <b>9 veces</b>.<br> ¡Por eso Selection Sort es peligroso para listas grandes!',
        };
        midQuizSolved.value = true;
        setTimeout(() => {
          showMidQuiz.value = false;
          midQuizFeedback.value = null;
          continueNextIteration();
        }, 7000);
      } else if (option === 'scale_3') {
        midQuizFeedback.value = {
          type: 'error',
          text: 'Incorrecto. ❌ <br> Eso sería lineal O(n). Aquí pagamos el precio al cuadrado.',
        };
      } else if (option === 'scale_6') {
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
  if (quizTopic.value === 'complexity') {
    // --- PHASE 1: Generaliza Fórmula ---
    if (currentQuizPhase.value === 1) {
      if (option === 'n-1') {
        midQuizFeedback.value = {
          type: 'success',
          text: '¡CORECTO! 🎉 <br> Pasemos a una pregunta más interesante...',
        };
        midQuizSolved.value = true;
        setTimeout(() => {
          midQuizFeedback.value = null;
          midQuizSolved.value = false;
          currentQuizPhase.value = 2; // Go to Phase 2
        }, 2500);
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
        setTimeout(() => {
          midQuizFeedback.value = null;
          midQuizSolved.value = false;
          currentQuizPhase.value = 3; // Go to Phase 3
        }, 3500); // 3.5s to read explanation
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
        setTimeout(() => {
          showMidQuiz.value = false;
          midQuizFeedback.value = null;
          continueNextIteration();
        }, 6000); // 6s to read final completion message
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
  for (let i = 0; i < 5; i++) {
    bottles.push({
      id: i + 1,
      weight: Math.floor(Math.random() * 80) + 20,
      color: 'bg-blue-300',
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
  // Solo feedback visual para indicar que deben arrastrar
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
      showMidQuiz.value = true;
      return;
    }

    // Check for Mid-Sort Quiz 2: Space Complexity (End of 2nd Iteration)
    if (currentIteration.value === 2) {
      quizTopic.value = 'space';
      currentQuizPhase.value = 1;
      midQuizSolved.value = false; // Reset solution state
      midQuizFeedback.value = null;
      showMidQuiz.value = true;
      return;
    }

    // Check for Mid-Sort Quiz 3: Strategy & Invariant (End of 3rd Iteration)
    if (currentIteration.value === 3) {
      quizTopic.value = 'strategy';
      currentQuizPhase.value = 1;
      midQuizSolved.value = false;
      midQuizFeedback.value = null;
      showMidQuiz.value = true;
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
