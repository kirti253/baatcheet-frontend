# Troubleshooting Guide

## 429 API Quota Exceeded Error

If you're seeing the error: **"429 You exceeded your current quota"** or similar rate limit errors, this means your AssemblyAI API key has reached its usage limit or rate limit.

### Steps to Fix:

1. **Check Your AssemblyAI Account**

   - Go to [AssemblyAI Dashboard](https://www.assemblyai.com/app)
   - Navigate to **Usage** or **Billing** page to see your current usage
   - Check your account status and remaining credits

2. **Add Credits or Update Billing**

   - Go to **Billing** section in AssemblyAI dashboard
   - Add a payment method if needed
   - Purchase credits to continue using the API
   - AssemblyAI offers pay-as-you-go pricing

3. **Check API Key Status**

   - Go to **API Keys** section in AssemblyAI dashboard
   - Verify your API key is active and valid
   - Check if there are any rate limits or restrictions
   - Generate a new API key if needed

4. **Verify Backend Configuration**

   - Ensure your backend is using the correct AssemblyAI API key
   - Check if the API key is set in your backend's environment variables
   - Verify the key is for AssemblyAI (not OpenAI or other providers)
   - Restart your backend server after updating the API key

5. **Check Usage Limits**
   - Review your usage in the AssemblyAI dashboard
   - Check if you've hit daily/monthly limits
   - AssemblyAI free tier: 5 hours/month of transcription
   - Wait for the limit to reset or upgrade your plan

### Common Issues:

- **Free Tier Exceeded**: AssemblyAI free tier provides 5 hours/month. You may have used all free credits
- **Payment Method Required**: Some features require a payment method
- **Rate Limits**: You may be hitting rate limits (requests per minute/hour)
- **Invalid API Key**: The API key might be expired, invalid, or for a different provider
- **Account Suspended**: Check if your account has any restrictions

### Quick Check:

1. Visit: https://www.assemblyai.com/app
2. Log in to your AssemblyAI account
3. Check your usage and billing status
4. Review your API keys
5. Add credits if needed

### AssemblyAI Specific Notes:

- **Free Tier**: 5 hours of transcription per month
- **Pay-as-you-go**: $0.00025 per second (~$0.90 per hour)
- **Rate Limits**: Vary by plan (check your dashboard)
- **API Documentation**: https://www.assemblyai.com/docs

### After Fixing:

Once you've resolved the quota issue:

1. Restart your backend server
2. Try recording again in the frontend
3. The error should be resolved

---

## Other Common Errors

### 500 Internal Server Error

- Check if your backend server is running
- Verify the `BACKEND_API_URL` environment variable is correct
- Check backend server logs for detailed error messages

### Network/CORS Errors

- Ensure your backend server is running on the correct port
- Check that `BACKEND_API_URL` in `.env.local` matches your backend URL
- The Next.js API routes should handle CORS automatically

### Microphone Permission Denied

- Allow microphone access in your browser
- Check browser settings for site permissions
- Try refreshing the page and allowing permissions again

---

## Audio File Type Error (application/octet-stream)

If you're seeing the error: **"File does not appear to contain audio. File type is application/octet-stream"**, this means the backend is receiving the file without the correct MIME type.

### Frontend Status ✅

The frontend is correctly:

- Creating audio blobs with explicit MIME types (`audio/webm`, `audio/mp4`, etc.)
- Reconstructing files in API routes to preserve MIME types
- Logging file types for debugging (check browser console)

### Backend Fix Required ⚠️

**This error must be fixed in your backend.** Your backend needs to:

1. **Read the file's Content-Type from multipart form data**

   - The MIME type is in the multipart headers, not just the file extension
   - Don't rely on file extension alone to determine type

2. **Preserve the MIME type when forwarding to AssemblyAI**

   - AssemblyAI needs the file with its original MIME type
   - Don't override or ignore the Content-Type header

3. **Check your multipart parser**
   - Ensure your backend's multipart parser reads the `Content-Type` field
   - The Content-Type should be in the multipart part headers

### Backend Code Examples

**Python/FastAPI:**

```python
from fastapi import UploadFile

@app.post("/api/voice-to-text/transcribe")
async def transcribe(audio: UploadFile):
    # Use audio.content_type - it reads from multipart headers
    content_type = audio.content_type  # Should be "audio/webm"
    # Don't use: audio.filename to infer type
```

**Node.js/Express with Multer:**

```javascript
const multer = require("multer");
const upload = multer();

app.post(
  "/api/voice-to-text/transcribe",
  upload.single("audio"),
  (req, res) => {
    // Use req.file.mimetype - it reads from multipart headers
    const mimeType = req.file.mimetype; // Should be "audio/webm"
    // Don't use: file extension to infer type
  }
);
```

**Node.js/Express with Formidable:**

```javascript
const formidable = require("formidable");

const form = formidable({});
form.parse(req, (err, fields, files) => {
  const file = files.audio[0];
  const mimeType = file.mimetype; // Should be "audio/webm"
});
```

### Debugging Steps

1. **Check browser console** - Look for "API Route - About to send file" logs
2. **Check backend logs** - See what MIME type your backend receives
3. **Verify backend code** - Ensure you're reading `Content-Type` from multipart data
4. **Test with curl** - Send a file directly to your backend to isolate the issue

### Common Backend Mistakes

- ❌ Inferring MIME type from file extension only
- ❌ Not reading the `Content-Type` field from multipart headers
- ❌ Overriding the MIME type before sending to AssemblyAI
- ❌ Using a multipart parser that ignores Content-Type headers
