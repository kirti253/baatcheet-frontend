# Backend Fix Required: Audio File MIME Type Issue

## Problem

The frontend is sending audio files with the correct MIME type (`audio/webm`, `audio/mp4`, etc.), but the backend is receiving them as `application/octet-stream`. This causes AssemblyAI to reject the files with the error:

```
Transcoding failed. File does not appear to contain audio. File type is application/octet-stream (data).
```

## Root Cause

The backend is **not reading the `Content-Type` header from the multipart form data**. Instead, it's likely inferring the file type from the file extension or defaulting to `application/octet-stream`.

## What the Frontend is Sending

The frontend correctly sends:

- **File MIME Type**: `audio/webm;codecs=opus` (or `audio/webm`, `audio/mp4`, etc.)
- **File Extension**: `.webm` (or `.mp4`, `.wav`, etc.)
- **Content-Type in multipart headers**: The MIME type is included in the multipart form data headers

## Required Fix

The backend **must read the `Content-Type` field from the multipart form data headers**, not infer it from the file extension.

## Implementation by Framework

### Python/FastAPI

**Current (WRONG):**

```python
from fastapi import UploadFile

@app.post("/api/voice-to-text/transcribe")
async def transcribe(audio: UploadFile):
    # ❌ DON'T infer from filename
    file_extension = audio.filename.split('.')[-1]
    mime_type = f"audio/{file_extension}"  # Wrong!

    # Send to AssemblyAI...
```

**Fixed (CORRECT):**

```python
from fastapi import UploadFile

@app.post("/api/voice-to-text/transcribe")
async def transcribe(audio: UploadFile):
    # ✅ Use the Content-Type from multipart headers
    mime_type = audio.content_type  # Reads from multipart headers

    # If content_type is None or octet-stream, fallback to extension
    if not mime_type or mime_type == "application/octet-stream":
        file_extension = audio.filename.split('.')[-1] if audio.filename else "webm"
        mime_type = f"audio/{file_extension}"

    # Ensure the file is sent to AssemblyAI with correct MIME type
    # When uploading to AssemblyAI, preserve the mime_type
    files = {
        'file': (audio.filename, await audio.read(), mime_type)
    }

    # Send to AssemblyAI with correct Content-Type...
```

### Node.js/Express with Multer

**Current (WRONG):**

```javascript
const multer = require("multer");
const upload = multer();

app.post(
  "/api/voice-to-text/transcribe",
  upload.single("audio"),
  (req, res) => {
    // ❌ DON'T infer from filename
    const fileExtension = req.file.originalname.split(".").pop();
    const mimeType = `audio/${fileExtension}`; // Wrong!

    // Send to AssemblyAI...
  }
);
```

**Fixed (CORRECT):**

```javascript
const multer = require("multer");
const upload = multer();

app.post(
  "/api/voice-to-text/transcribe",
  upload.single("audio"),
  (req, res) => {
    // ✅ Use the mimetype from multipart headers
    let mimeType = req.file.mimetype; // Reads from multipart headers

    // If mimetype is octet-stream, fallback to extension
    if (!mimeType || mimeType === "application/octet-stream") {
      const fileExtension = req.file.originalname.split(".").pop() || "webm";
      mimeType = `audio/${fileExtension}`;
    }

    // When sending to AssemblyAI, use FormData with correct type
    const formData = new FormData();
    formData.append("file", req.file.buffer, {
      filename: req.file.originalname,
      contentType: mimeType, // Preserve the MIME type
    });

    // Send to AssemblyAI...
  }
);
```

### Node.js/Express with Formidable

**Current (WRONG):**

```javascript
const formidable = require("formidable");

app.post("/api/voice-to-text/transcribe", (req, res) => {
  const form = formidable({});
  form.parse(req, (err, fields, files) => {
    const file = files.audio[0];
    // ❌ DON'T infer from filename
    const fileExtension = file.originalFilename.split(".").pop();
    const mimeType = `audio/${fileExtension}`; // Wrong!

    // Send to AssemblyAI...
  });
});
```

**Fixed (CORRECT):**

```javascript
const formidable = require("formidable");

app.post("/api/voice-to-text/transcribe", (req, res) => {
  const form = formidable({});
  form.parse(req, (err, fields, files) => {
    const file = files.audio[0];
    // ✅ Use the mimetype from multipart headers
    let mimeType = file.mimetype; // Reads from multipart headers

    // If mimetype is octet-stream, fallback to extension
    if (!mimeType || mimeType === "application/octet-stream") {
      const fileExtension = file.originalFilename?.split(".").pop() || "webm";
      mimeType = `audio/${fileExtension}`;
    }

    // When sending to AssemblyAI, preserve the MIME type
    const formData = new FormData();
    formData.append("file", fs.createReadStream(file.filepath), {
      filename: file.originalFilename,
      contentType: mimeType, // Preserve the MIME type
    });

    // Send to AssemblyAI...
  });
});
```

### Python/Flask

**Fixed (CORRECT):**

```python
from flask import request
from werkzeug.datastructures import FileStorage

@app.route("/api/voice-to-text/transcribe", methods=["POST"])
def transcribe():
    audio = request.files.get("audio")

    # ✅ Use the Content-Type from multipart headers
    mime_type = audio.content_type  # Reads from multipart headers

    # If content_type is None or octet-stream, fallback to extension
    if not mime_type or mime_type == "application/octet-stream":
        file_extension = audio.filename.split('.')[-1] if audio.filename else "webm"
        mime_type = f"audio/{file_extension}"

    # When sending to AssemblyAI, preserve the MIME type
    files = {
        'file': (audio.filename, audio.read(), mime_type)
    }

    # Send to AssemblyAI...
```

## Key Points

1. **Always read `Content-Type` from multipart headers first**

   - FastAPI: `file.content_type`
   - Multer: `req.file.mimetype`
   - Formidable: `file.mimetype`
   - Flask: `file.content_type`

2. **Only use file extension as fallback**

   - If `Content-Type` is missing or `application/octet-stream`
   - Then infer from file extension

3. **Preserve MIME type when forwarding to AssemblyAI**
   - Don't override the MIME type
   - Include it in the request to AssemblyAI
   - AssemblyAI needs the correct `Content-Type` header

## Testing

After the fix, verify:

1. **Check what MIME type the backend receives:**

   ```python
   # Python
   print(f"Received MIME type: {audio.content_type}")
   ```

   ```javascript
   // Node.js
   console.log("Received MIME type:", req.file.mimetype);
   ```

2. **Should see**: `audio/webm`, `audio/mp4`, etc.
3. **Should NOT see**: `application/octet-stream`

4. **Test the full flow:**
   - Frontend sends audio → Backend receives with correct type → AssemblyAI accepts it

## Expected Behavior After Fix

- ✅ Backend receives file with `Content-Type: audio/webm` (or other audio type)
- ✅ Backend forwards to AssemblyAI with correct MIME type
- ✅ AssemblyAI successfully transcribes the audio
- ✅ No more "File does not appear to contain audio" errors

## Additional Notes

- The frontend is already correctly sending files with proper MIME types
- The Next.js API routes are preserving the MIME types
- The issue is specifically in how the backend reads the multipart form data
- This is a common issue when multipart parsers don't read the `Content-Type` field from headers

## Questions?

If you need to verify what the frontend is sending, check the browser console logs:

- "Audio blob created" - shows the blob type
- "Sending audio to backend" - shows what's being sent
- "API Route - About to send file" - shows what the API route is forwarding

The frontend is working correctly. The fix needs to be in the backend's multipart form data parsing.
