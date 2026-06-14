# avkit

A browser-based audio and video utility toolkit — no uploads, no servers, no accounts. Everything runs locally in your browser using [mediabunny](https://mediabunny.dev).

## Tools

| Tool                  | Description                                                                |
| --------------------- | -------------------------------------------------------------------------- |
| **Inspect**           | View detailed metadata, tracks, codecs, and stream info for any media file |
| **Convert Format**    | Convert audio/video to a different container format                        |
| **Change Codec**      | Re-encode audio or video tracks with a different codec                     |
| **Change Frame Rate** | Adjust the frame rate of a video                                           |
| **Change Quality**    | Compress video by adjusting quality settings                               |
| **Trim**              | Cut audio or video to a specific time range                                |
| **Extract Track**     | Pull out individual audio or video tracks from a file                      |
| **Discard Track**     | Remove audio or video tracks from a media file                             |
| **Crop Video**        | Crop the video frame to a custom region                                    |
| **Resize Video**      | Scale video to a different resolution                                      |
| **Rotate Video**      | Rotate video by 90°, 180°, or 270°                                         |
| **Remove Metadata**   | Strip metadata from audio or video files                                   |

## Tech Stack

- **[Next.js 16](https://nextjs.org)** — React framework
- **[mediabunny](https://mediabunny.dev)** — In-browser audio/video processing engine
- **[Tailwind CSS v4](https://tailwindcss.com)** — Styling
- **[shadcn/ui](https://ui.shadcn.com)** — UI components
- **[Zustand](https://zustand-demo.pmnd.rs)** — State management

## Caveats

Codec support varies by browser and OS. Whether a codec can be decoded (read) or encoded (written) depends on what your browser and operating system support natively.

## Development

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
pnpm build    # production build
pnpm lint     # lint
pnpm typecheck  # type check
```
