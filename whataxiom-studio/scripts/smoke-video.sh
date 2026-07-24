#!/usr/bin/env bash
# End-to-end smoke test for the video-assembly pipeline (no external APIs).
set -euo pipefail

PORT=4100
BASE="http://localhost:$PORT/api"
cd "$(dirname "$0")/../server"

echo "== starting server on :$PORT =="
PORT=$PORT npx tsx src/index.ts >/tmp/wa-server.log 2>&1 &
SERVER_PID=$!
trap 'kill $SERVER_PID 2>/dev/null || true' EXIT

for i in $(seq 1 30); do
  if curl -sf "$BASE/health" >/dev/null 2>&1; then break; fi
  sleep 0.5
done
echo "health: $(curl -s "$BASE/health")"

echo "== create project =="
PID=$(curl -sf -X POST "$BASE/projects" -H 'Content-Type: application/json' \
  -d '{"title":"Smoke Test","topic":"testing the pipeline","channelType":"shorts"}' \
  | python3 -c 'import sys,json;print(json.load(sys.stdin)["id"])')
echo "project id: $PID"

echo "== synthesize 3 test frames =="
FR="storage/$PID/frames"
mkdir -p "$FR"
ffmpeg -y -loglevel error -f lavfi -i color=c=crimson:s=1080x1920:d=1 -frames:v 1 "$FR/frame_001.png"
ffmpeg -y -loglevel error -f lavfi -i color=c=teal:s=1080x1920:d=1   -frames:v 1 "$FR/frame_002.png"
ffmpeg -y -loglevel error -f lavfi -i color=c=orange:s=1080x1920:d=1 -frames:v 1 "$FR/frame_003.png"

echo "== attach frames to project =="
curl -sf -X PATCH "$BASE/projects/$PID" -H 'Content-Type: application/json' -d "{
  \"frames\": [
    {\"index\":1,\"narration\":\"Frame one.\",\"prompt\":\"p1\",\"duration\":1.5,\"image\":\"$PID/frames/frame_001.png\",\"status\":\"done\"},
    {\"index\":2,\"narration\":\"Frame two.\",\"prompt\":\"p2\",\"duration\":1.5,\"image\":\"$PID/frames/frame_002.png\",\"status\":\"done\"},
    {\"index\":3,\"narration\":\"Frame three.\",\"prompt\":\"p3\",\"duration\":1.5,\"image\":\"$PID/frames/frame_003.png\",\"status\":\"done\"}
  ]
}" >/dev/null
echo "frames attached"

echo "== assemble video (fade transitions) =="
JOB=$(curl -sf -X POST "$BASE/projects/$PID/video" -H 'Content-Type: application/json' \
  -d '{"transition":"fade","fps":24,"withNarration":false,"useMusic":false}' \
  | python3 -c 'import sys,json;print(json.load(sys.stdin)["jobId"])')
echo "job id: $JOB"

echo "== stream progress =="
curl -sN --max-time 60 "$BASE/jobs/$JOB/stream" | while IFS= read -r line; do
  [ -z "$line" ] && continue
  echo "  $line"
  case "$line" in
    *'"kind":"done"'*) break ;;
    *'"kind":"error"'*) echo "JOB ERROR"; exit 1 ;;
  esac
done

VIDEO="storage/$PID/video.mp4"
if [ -f "$VIDEO" ]; then
  echo "== SUCCESS: $VIDEO =="
  ffprobe -v error -show_entries format=duration,size -show_entries stream=codec_name,width,height -of default=noprint_wrappers=1 "$VIDEO"
else
  echo "== FAIL: no video produced =="
  cat /tmp/wa-server.log
  exit 1
fi
