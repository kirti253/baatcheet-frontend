# Backend Debug Checklist - MIME Type Issue

## Current Status

✅ **Frontend is working correctly:**
- Creating audio blob with type: `audio/webm; codecs=opus`
- Sending to Next.js API route correctly
- API route is reconstructing file with correct MIME type

❌ **Backend is receiving file as:** `application/octet-stream`

## Quick Debug Steps for Backend

### 1. Check What Backend Receives

Add logging in your backend to see what MIME type it receives:

**Python/FastAPI:**
```python
@app.post("/api/voice-to-text/transcribe")
async def transcribe(audio: UploadFile):
    # ADD THIS LOG
    print(f"Received file - Name: {audio.filename}")
    print(f"Received file - Content-Type: {audio.content_type}")
    print(f"Received file - Size: {audio.size if hasattr(audio, 'size') else 'unknown'}")
    
    # Your existing code...
```

**Node.js/Express with Multer:**
```javascript
app.post("/api/voice-to-text/transcribe", upload.single("audio"), (req, res) => {
  // ADD THIS LOG
  console.log("Received file - Name:", req.file.originalname);
  console.log("Received file - MIME Type:", req.file.mimetype);
  console.log("Received file - Size:", req.file.size);
  
  // Your existing code...
});
```

### 2. Verify Multipart Parser

Make sure your multipart parser is reading the `Content-Type` field:

**Check if your parser supports Content-Type:**
- FastAPI's `UploadFile` should automatically read it
- Multer should read it from `req.file.mimetype`
- Formidable should read it from `file.mimetype`

### 3. Test Direct File Upload

Test if the backend can receive files correctly:

**Using curl:**
```bash
curl -X POST http://localhost:3000/api/voice-to-text/transcribe \
  -F "audio=@test-audio.webm" \
  -F "language=en"
```

Check your backend logs - what MIME type does it report?

### 4. Check Backend Code

Look for these common mistakes:

❌ **WRONG - Inferring from filename:**
```python
# Python
mime_type = f"audio/{audio.filename.split('.')[-1]}"
```

❌ **WRONG - Not reading Content-Type:**
```javascript
// Node.js
const mimeType = "audio/webm"; // Hardcoded!
```

✅ **CORRECT - Reading from multipart headers:**
```python
# Python/FastAPI
mime_type = audio.content_type  # Reads from multipart headers
```

```javascript
// Node.js/Multer
const mimeType = req.file.mimetype;  // Reads from multipart headers
```

### 5. Verify AssemblyAI Upload

When sending to AssemblyAI, preserve the MIME type:

**Python:**
```python
files = {
    'file': (audio.filename, await audio.read(), audio.content_type)
}
# OR if you need to set it explicitly:
files = {
    'file': (audio.filename, audio_data, mime_type)
}
```

**Node.js:**
```javascript
const formData = new FormData();
formData.append('file', fileBuffer, {
  filename: originalFilename,
  contentType: mimeType  // Make sure this is set!
});
```

## Expected Logs

After adding logging, you should see:

**Frontend Console:**
```
Audio blob created: {size: 150159, type: "audio/webm; codecs=opus", extension: "webm"}
Sending audio to backend: {size: 150159, type: "audio/webm; codecs=opus", extension: "webm"}
API Route - About to send file to backend: {name: "recording.webm", type: "audio/webm", size: 150159, backendUrl: "http://localhost:3000/api/voice-to-text/transcribe"}
API Route - Backend response status: 500
```

**Backend Logs (What you should see):**
```
Received file - Name: recording.webm
Received file - Content-Type: audio/webm  ← Should NOT be application/octet-stream
Received file - Size: 150159
```

## If Backend Still Shows `application/octet-stream`

This means your multipart parser is not reading the `Content-Type` field. You need to:

1. **Check your multipart parser version** - Update if outdated
2. **Use a different parser** - Try a different library
3. **Manually parse multipart headers** - Read the Content-Type from raw multipart data

## Next Steps

1. Add the logging code above to your backend
2. Make a test recording
3. Check backend logs
4. Share the logs - this will show exactly where the MIME type is being lost

The frontend is 100% correct. The fix must be in the backend's multipart parsing.

