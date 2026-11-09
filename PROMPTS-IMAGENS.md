# Prompts das imagens: app Domínio

Cada imagem tem o **caminho exato** onde o app procura o arquivo. Enquanto ela não existir, o app mostra um degradê verde-azulado no lugar, então nada quebra.

## Como usar no Codex

1. Gere cada imagem com o prompt indicado.
2. Converta para **WebP com qualidade 85** (os ícones de app ficam em PNG).
3. Salve no caminho indicado, dentro de `public/`. Exemplo: `public/images/alimentos/banana.webp`.
4. Respeite o tamanho indicado em cada seção.

> Dica para o Codex: “Gere a imagem, converta para WebP qualidade 85 com o tamanho indicado e salve em `public/<caminho>`. Mantenha o original em PNG em `prompts-imagens/originais/`.”

---

## Estilo geral (cole no começo de TODOS os prompts)

```
STYLE: modern premium wellness app illustration, dark navy background (#0B1220), accent colors teal (#2DD4BF) and sky blue (#38BDF8), soft volumetric light, clean minimal composition, subtle grain, calm and confident mood, masculine but elegant, no text, no letters, no logos, no watermark. Tasteful and non-explicit: no nudity, no genitals, no sexual acts.
```

Para **fotos de comida** use este estilo:

```
STYLE: professional food photography, dark slate stone surface, moody soft side light, teal-tinted shadows, shallow depth of field, top-down or 45° angle, fresh and appetizing, no text, no hands, no logos.
```

---

## 1. Marca

| Caminho | Tamanho | Prompt |
|---|---|---|
| `images/marca/logo.webp` | 512×512 | App logo symbol: an abstract geometric shield formed by two curved strokes meeting at the top, suggesting control and balance, with a small circle in the center like a timer dial. Teal-to-sky-blue gradient on dark navy rounded square. Flat vector, crisp edges, no text. |
| `images/marca/icone-192.png` | 192×192 PNG | Same logo as above, centered, filling 70% of a rounded square, dark navy background. Flat vector, no text. |
| `images/marca/icone-512.png` | 512×512 PNG | Same as icone-192, high resolution. |

> O nome e o ícone são propositalmente discretos: nada no ícone deve indicar o tema do app.

## 2. Onboarding (1080×1080)

| Caminho | Prompt |
|---|---|
| `images/onboarding/1-boas-vindas.webp` | A confident man in his 30s seen from behind, standing on a calm mountain top at sunrise, arms relaxed, breathing deeply, teal light on the horizon. Sense of control and calm. |
| `images/onboarding/2-ciencia.webp` | Abstract 3D illustration of a glowing teal pulse line and a stopwatch dial merging with a stylized human silhouette, scientific and clean, floating particles. |
| `images/onboarding/3-privacidade.webp` | A smartphone on a dark desk with a glowing teal padlock hologram above the screen, soft bokeh, privacy and discretion. |

## 3. Programa: capas das fases (1600×900)

| Caminho | Prompt |
|---|---|
| `images/programa/fase-1.webp` | Week 1 "Awareness": a man meditating seated on a yoga mat in a minimalist dark room, a soft teal glow around the lower abdomen and pelvis area (abstract energy, fully clothed in athletic wear). |
| `images/programa/fase-2.webp` | Week 2 "Strength": man doing a glute bridge exercise on a mat, athletic clothing, dramatic teal rim light, gym studio at night. |
| `images/programa/fase-3.webp` | Week 3 "Control": close-up of a hand holding a minimalist analog stopwatch, needle paused, teal light trails, sense of precision. |
| `images/programa/fase-4.webp` | Week 4 "Mastery": a happy couple fully clothed laughing together on a sofa in a cozy dark apartment, warm lamp light mixed with teal accents, intimacy and complicity, non-sexual. |

## 4. Categorias de exercício (800×600)

| Caminho | Prompt |
|---|---|
| `images/categorias/assoalho.webp` | Stylized anatomical illustration of the male pelvic floor muscles as a glowing teal hammock-shaped muscle group inside a translucent pelvis bone, side view, medical-infographic style, no genitals shown. |
| `images/categorias/respiracao.webp` | Abstract illustration of lungs made of soft teal smoke expanding, with concentric breathing circles. |
| `images/categorias/tecnicas.webp` | A glowing vertical gauge from 0 to 10 with the needle in the middle green zone, abstract, minimal, sense of control. |
| `images/categorias/corpo.webp` | Athletic man doing a bodyweight squat in a dark studio, teal rim light, motion energy. |
| `images/categorias/alongamento.webp` | Man in child's pose yoga stretch on a mat, calm dark room with soft teal light. |

## 5. Exercícios sem banco de imagens (1600×1000)

Os exercícios de corpo e alongamento já usam fotos do banco **free-exercise-db** (domínio público, salvas em `public/exercicios/`). Os exercícios abaixo são específicos do app e precisam de ilustração própria. Mantenha o estilo de **infográfico anatômico**, sem nudez.

| Caminho | Prompt |
|---|---|
| `images/exercicios/kegel-basico.webp` | Medical infographic, side cross-section of a stylized male pelvis (bones translucent, no genitals detail), the pelvic floor muscle highlighted in teal with small upward arrows showing contraction ("lift and squeeze"), next to a small icon of a person lying on their back with knees bent. |
| `images/exercicios/kegel-sustentado.webp` | Same anatomical style, pelvic floor highlighted teal and held lifted, with a circular timer ring around it at 10 seconds. |
| `images/exercicios/kegel-rapido.webp` | Same anatomical style, pelvic floor with rapid pulse lines and lightning-like teal flicks indicating quick contractions. |
| `images/exercicios/kegel-elevador.webp` | Same anatomical style, pelvic floor shown at three stacked levels like floors of an elevator (1, 2, 3 represented by intensifying teal bars, no numbers). |
| `images/exercicios/kegel-reverso.webp` | Same anatomical style, pelvic floor highlighted in soft sky blue with downward gentle arrows showing relaxation and lengthening, person icon breathing into the belly. |
| `images/exercicios/respiracao-diafragmatica.webp` | Man lying on his back on a mat, one hand on chest and one on belly, belly rising, soft teal glow around the diaphragm, fully clothed. |
| `images/exercicios/respiracao-478.webp` | Three glowing teal circles of increasing size connected in sequence, representing 4, 7 and 8 second phases (no numbers), calm abstract. |
| `images/exercicios/respiracao-quadrada.webp` | A glowing teal square path with a light orb traveling along its edges, representing box breathing, minimal abstract. |
| `images/exercicios/escala-excitacao.webp` | A vertical gradient bar from calm blue at the bottom through teal and yellow to red at the top, with a highlighted comfortable zone in the middle, abstract infographic, no numbers. |
| `images/exercicios/para-e-recomeca.webp` | Abstract wave graph rising toward a red line and dropping back down three times before the final peak, teal line on dark background, infographic style. |
| `images/exercicios/aperto.webp` | Abstract infographic: a stylized hand making a gentle pinch gesture next to a wave graph that drops sharply after the pinch, teal on dark navy, no anatomy shown. |
| `images/exercicios/foco-sensorial.webp` | Close-up of two hands of a couple gently touching fingertips, warm and teal light, intimacy and calm, non-sexual. |

## 6. Alimentos (1000×1000, estilo de foto de comida)

| Caminho | Prompt |
|---|---|
| `images/alimentos/banana.webp` | A bunch of ripe bananas and one peeled banana. |
| `images/alimentos/abacate.webp` | Two avocado halves, one with the pit, on stone. |
| `images/alimentos/ovos.webp` | Brown eggs in a ceramic bowl, one cracked with a bright yellow yolk. |
| `images/alimentos/semente-abobora.webp` | Small bowl of green pumpkin seeds with some spilled around. |
| `images/alimentos/sardinha.webp` | Grilled sardines with lemon wedges and parsley. |
| `images/alimentos/salmao.webp` | Raw salmon fillet with herbs and lemon slices. |
| `images/alimentos/beterraba.webp` | Fresh beets with leaves, one sliced showing the deep purple inside. |
| `images/alimentos/melancia.webp` | Watermelon triangles, juicy red with seeds. |
| `images/alimentos/espinafre.webp` | Fresh spinach leaves and kale in a wooden bowl. |
| `images/alimentos/chocolate.webp` | Pieces of dark chocolate 70% with cocoa beans. |
| `images/alimentos/aveia.webp` | Bowl of rolled oats with a wooden spoon. |
| `images/alimentos/castanhas.webp` | Mixed nuts: Brazil nuts, walnuts and cashews in a bowl. |
| `images/alimentos/carne.webp` | Lean grilled beef steak sliced, with rosemary. |
| `images/alimentos/frango.webp` | Grilled chicken breast sliced with herbs. |
| `images/alimentos/feijao.webp` | Bowls of black beans and chickpeas side by side. |
| `images/alimentos/alho.webp` | Garlic bulbs and peeled cloves. |
| `images/alimentos/gengibre.webp` | Fresh ginger root, one piece sliced. |
| `images/alimentos/roma.webp` | Pomegranate cut open showing ruby seeds. |

## 7. Receitas (1200×900, estilo de foto de comida)

| Caminho | Prompt |
|---|---|
| `images/receitas/suco-circulacao.webp` | Tall glass of deep red beet, orange and watermelon juice with a ginger slice, beets and orange around. |
| `images/receitas/vitamina-calma.webp` | Creamy chocolate-banana oat smoothie in a glass jar, banana slices and cocoa powder around. |
| `images/receitas/mix-sementes.webp` | Toasted pumpkin seeds, cashews and walnuts mix with paprika in a jar and a small bowl. |
| `images/receitas/sardinha-forno.webp` | Baking dish with roasted sardines, lemon slices, herbs and sweet potato rounds. |
| `images/receitas/omelete-verde.webp` | Fluffy omelette with spinach, tomato and white cheese in a small cast iron pan. |

## 8. Artigos (1600×900)

| Caminho | Prompt |
|---|---|
| `images/artigos/o-que-e.webp` | A thoughtful man sitting on the edge of a bed at dawn, fully clothed, looking out the window, soft teal light, hopeful mood. |
| `images/artigos/causas.webp` | Abstract brain with glowing teal neural connections linked by a light thread to a stylized pelvis icon, infographic. |
| `images/artigos/mitos.webp` | Two speech bubbles, one cracked and dim, one glowing teal, abstract 3D, myth vs fact concept, no text. |
| `images/artigos/na-hora.webp` | Dimly lit bedroom with an unmade bed and a soft teal lamp glow, empty room, calm and intimate atmosphere, nobody in the scene. |
| `images/artigos/conversa.webp` | A couple fully clothed having a calm, caring conversation at a kitchen table with coffee mugs, warm light. |
| `images/artigos/quando-medico.webp` | Friendly male urologist doctor in a modern clinic, stethoscope, talking to a patient seen from behind, trustworthy. |
| `images/artigos/pornografia.webp` | A smartphone placed face down on a nightstand next to a book and a glass of water, calm night, digital detox concept. |
| `images/artigos/masturbacao-treino.webp` | Abstract slow-motion hourglass with teal sand, sense of patience and slowing down. |

## 9. Conquistas (512×512)

Estilo: medalha 3D brilhante, metal escovado com detalhes em teal, fundo navy, sem texto.

| Caminho | Prompt |
|---|---|
| `images/conquistas/primeiro-passo.webp` | 3D badge with a footprint icon. |
| `images/conquistas/semana-1.webp` | 3D badge with an eye icon (awareness), bronze tone. |
| `images/conquistas/semana-2.webp` | 3D badge with a flexed muscle / dumbbell icon, silver tone. |
| `images/conquistas/semana-3.webp` | 3D badge with a stopwatch icon, gold tone. |
| `images/conquistas/semana-4.webp` | 3D badge with a crown over a shield, platinum tone with teal glow. |
| `images/conquistas/sequencia-7.webp` | 3D badge with a flame icon and seven small dots around the rim. |
| `images/conquistas/habitos-100.webp` | 3D badge with a checkmark inside a hexagon, steel tone. |
| `images/conquistas/diario-10.webp` | 3D badge with an open notebook and pen icon. |

## 10. Hábitos (opcional, 800×800)

Hoje a tela de hábitos usa ícones. Estas imagens estão nos dados (`src/data/habitos.json`) para uso futuro, como um detalhe do hábito ou uma notificação.

| Caminho | Prompt |
|---|---|
| `images/habitos/sono.webp` | Dark bedroom, moonlight through the window, cozy bed, calm. |
| `images/habitos/agua.webp` | Glass water bottle with condensation, teal light. |
| `images/habitos/treino-pelvico.webp` | Yoga mat with a small timer, minimal dark studio. |
| `images/habitos/movimento.webp` | Running shoes on an urban path at sunrise. |
| `images/habitos/respiracao.webp` | Man breathing deeply outdoors with eyes closed, mist. |
| `images/habitos/sem-pornografia.webp` | Phone screen turned off with a soft teal shield reflection. |
| `images/habitos/sem-alcool.webp` | Glass of sparkling water with lime instead of beer. |
| `images/habitos/sem-cigarro.webp` | Broken cigarette on a dark surface, fresh green leaf beside it. |
| `images/habitos/alimentacao.webp` | Colorful healthy plate with salmon, greens and grains. |
| `images/habitos/sol.webp` | Man in t-shirt enjoying morning sun on a balcony. |
| `images/habitos/diario.webp` | Open notebook with pen on a dark wooden desk. |
| `images/habitos/conversa.webp` | Two coffee mugs on a table, warm afternoon light. |

## 11. Especialista Domínio (chat)

| Caminho | Tamanho | Prompt |
|---|---|---|
| `images/coach/avatar.webp` | 512×512 | Professional male men's health specialist in his early 40s, neatly trimmed beard, calm confident smile, wearing a dark navy blazer over a light teal shirt (no lab coat, no stethoscope, no badges), head-and-shoulders portrait centered for a circular crop, modern softly blurred office background with dark navy tones and subtle teal light, semi-realistic illustrated style, trustworthy, discreet and serious. **Troque a imagem atual por esta.** |

---

**Total: 79 imagens** (67 usadas nas telas + 12 opcionais de hábitos).
