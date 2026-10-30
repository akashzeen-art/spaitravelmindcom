# AI Avatar — Assets Guide (Perfect Lip-Sync)

This document lists **everything you need** to upgrade Aria from photo + audio lip-sync to **broadcast-quality** speaking avatar.

---

## Full body character (required for head-to-toe display)

The app is set to **full body mode**. Add this main image:

| Asset | Ratio | Size | Filename | Status |
|-------|-------|------|----------|--------|
| **Full body character** | **2:3** | **1024×1536 px** | `ai-character-fullbody.png` | ✅ Done |

**Save to:** `public/images/ai-character-fullbody.png`

Until you add it, the app falls back to your waist-up photo (`ai-character.png`).

### Full body image — AI prompt

```
Full body photorealistic portrait of a young woman AI travel guide named Aria,
standing straight facing camera, entire body visible from head to feet,
white sleeveless ribbed tank top tucked into black jeans,
gold heart necklace, blonde wavy hair, neutral pleasant expression,
mouth closed, arms relaxed at sides,
modern bright office background with soft natural light,
professional travel app character, 9:16 vertical composition,
1080x1920 pixels, sharp focus, no crop, feet visible on floor,
photorealistic, high detail, consistent lighting
```

### Full body — requirements checklist

- [ ] **Ratio:** 9:16 (vertical)
- [ ] **Size:** 1080×1920 px minimum
- [ ] **Format:** PNG or WebP
- [ ] **Framing:** Head to feet — nothing cut off
- [ ] **Pose:** Standing, facing camera, neutral
- [ ] **Mouth:** Closed (for lip-sync overlays)
- [ ] **Background:** Same style as your current photo (office/studio)
- [ ] **Filename:** `ai-character-fullbody.png`

### Mouth position on full body image (for 5 viseme PNGs)

When you crop mouth from the **full body** image (not waist-up):

| Setting | Value |
|---------|--------|
| Mouth crop ratio | **5:2** (400×160 px) |
| Position on full image | ~**16.5%** from top, centered |
| Viseme files | Same 5 PNGs in `public/images/avatar/` |

---

## Current setup (what you have now)

| Asset | Path | Status |
|-------|------|--------|
| Character photo (front-facing) | `public/images/ai-character.png` | ✅ Provided |
| Mouth region coordinates | `src/config/avatar.js` → `mouth` | ✅ Tuned in code |
| OpenAI TTS voice | `.env` → `OPENAI_TTS_VOICE=nova` | ✅ Configured |
| ~10 sec speech chunks | `src/utils/speechChunks.js` | ✅ Implemented |

**How it works today:** Photo + clipped mouth scales with audio volume (good demo, not film-quality).

---

## Level 1 — Good (minimal extra assets)

Improve the current photo lip-sync with these **images only**:

| # | Asset | Spec | Filename | Purpose |
|---|--------|------|----------|---------|
| 1 | **Hero portrait** | 1024×1365 px, PNG | `ai-character.png` | ✅ Done |
| 2 | **Mouth closed** | Lower-face PNG | `avatar/mouth-closed.png` | ✅ Done |
| 3 | **Mouth half-open** | Lower-face PNG | `avatar/mouth-half.png` | ✅ Done |
| 4 | **Mouth open** | Lower-face PNG | `avatar/mouth-open.png` | ✅ Done |
| 5 | **Mouth wide (O)** | Lower-face PNG | `avatar/mouth-wide.png` | ✅ Done |
| 6 | **Mouth smile (EE)** | Lower-face PNG | `avatar/mouth-smile.png` | ✅ Done |

**Folder:** `public/images/avatar/`

**How to create:** Photoshop / Figma — clone mouth area from your photo and paint 5 lip states. Same size & position for all 6.

---

## Level 2 — Better (short video loops)

| # | Asset | Spec | Filename | Purpose |
|---|--------|------|----------|---------|
| 7 | **Idle loop** | 3–5 sec MP4/WebM, 720p+, subtle blink/breath | `videos/aria-idle.webm` | Waiting state |
| 8 | **Listening loop** | 3 sec, slight nod | `videos/aria-listen.webm` | User typing |
| 9 | **Thinking loop** | 2 sec, eyes up/ aside | `videos/aria-think.webm` | AI generating |
| 10 | **Speaking loop** | 10 sec seamless loop, generic talk motion | `videos/aria-speak.webm` | Fallback while TTS plays |

**Requirements:**
- Same outfit, lighting, background as photo
- Loop must be seamless (first frame = last frame)
- WebM (VP9) preferred for web; MP4 (H.264) fallback

---

## Level 3 — Perfect (real lip-sync video)

For **perfect** lip-sync, you need **either** generated video **or** a lip-sync API.

### Option A — Pre-rendered clips (no API per message)

Record or generate **10-second speaking clips** per viseme set:

| # | Asset | Duration | Filename |
|---|--------|----------|----------|
| 11 | Speaking clip template | 10 sec each | `videos/speech-chunk-template.webm` |
| 12 | D-ID / HeyGen export | 10 sec per paragraph | `videos/speech-{hash}.mp4` |

App plays: TTS audio + matching video (generated offline).

### Option B — Live API (best quality, costs per message)

| Service | What you provide | What you get |
|---------|------------------|--------------|
| **[D-ID](https://www.d-id.com/)** | 1 photo + audio MP3 | MP4 with perfect lip-sync |
| **[HeyGen](https://www.heygen.com/)** | Photo + script | Talking head video |
| **[Sync Labs](https://synclabs.so/)** | Video + audio | Re-synced lips |

**Need from you:**
- 1 high-res portrait (you have ✅)
- API key for chosen service (add to `.env`)
- Optional: green-screen version for compositing

### Option C — 3D avatar (no photo lip-sync issues)

| # | Asset | Tool | Output |
|---|--------|------|--------|
| 13 | 3D model + rig | Ready Player Me / MetaHuman | `.glb` + blendshapes |
| 14 | Viseme map | Oculus visemes (15 shapes) | JSON config |

Libraries: `@react-three/fiber`, `three`, Ready Player Me avatar URL.

---

## Audio assets (optional polish)

| # | Asset | Spec | Filename |
|---|--------|------|------------|
| 15 | UI click | < 0.5 sec WAV | `sounds/click.wav` |
| 16 | Start speaking chime | soft, 0.3 sec | `sounds/speak-start.wav` |
| 17 | Ambient background | loop, low volume | `sounds/ambient.mp3` |

---

## Recommended image specs (all levels)

```
Portrait (main)
  Size:     1024 × 1365 px (3:4) minimum
  Format:   PNG or WebP
  Face:     Centered, eye line at ~38% from top
  Mouth:    Closed, neutral — at ~55–58% from top
  Lighting: Soft, even (no harsh shadows on lips)
  Background: Clean (office/blur OK)

Mouth crops (Level 1)
  Size:     200 × 80 px each (same for all visemes)
  Format:   PNG with transparency
  Align:    Pixel-perfect same position in every file
```

---

## Recommended video specs (Level 2–3)

```
Resolution:  720p (1280×720) or 1080p
Frame rate:  30 fps
Codec:       WebM VP9 + MP4 H.264 fallback
Duration:    Idle 3–5s | Speech chunks exactly 10s
Audio:       None in video files (TTS plays separately)
Loop:        Idle/speak loops must tile seamlessly
```

---

## Environment variables (when you add video/API)

```env
# Speech chunking (~10 sec per paragraph read)
SPEECH_CHUNK_SECONDS=10

# Optional: D-ID perfect lip-sync
D_ID_API_KEY=
D_ID_AVATAR_URL=https://your-hosted-portrait.jpg

# Optional: use video instead of photo
VITE_AVATAR_IDLE_VIDEO=/videos/aria-idle.webm
VITE_AVATAR_SPEAK_VIDEO=/videos/aria-speak.webm
```

---

## What to send / prepare (checklist)

- [x] 1 front-facing portrait (`ai-character.png`)
- [ ] 5 mouth viseme PNGs (Level 1 — biggest quality jump for static avatar)
- [ ] 4 short video loops: idle, listen, think, speak (Level 2)
- [ ] D-ID or HeyGen API key (Level 3 — perfect lip-sync)
- [ ] Optional: green-screen portrait for custom backgrounds

---

## How 10-second reading works in the app

Long AI answers are split into **~10 second chunks** (~25 words each):

```
Full reply (80 words)
  → Chunk 1 (10 sec) → speak + lip-sync
  → pause 0.35s
  → Chunk 2 (10 sec) → speak + lip-sync
  → …
```

Configure in `src/utils/speechChunks.js` → `SPEECH_CHUNK_CONFIG`.

---

## Quick priority order

1. **Now** — Use current photo + 10 sec chunk reading (done)
2. **Next** — Create 5 mouth PNG visemes (Level 1)
3. **Then** — Record idle + speak video loops (Level 2)
4. **Perfect** — Integrate D-ID API (Level 3)

When you add assets to `public/images/avatar/` or `public/videos/`, tell us and we can wire them into `AiAvatar.jsx`.
