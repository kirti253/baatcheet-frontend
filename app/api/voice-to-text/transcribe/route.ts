import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_API_URL || "http://localhost:3000";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Log the incoming FormData for debugging
    const audioFile = formData.get("audio") as File | null;
    if (audioFile) {
      console.log("API Route - Received audio file:", {
        name: audioFile.name,
        type: audioFile.type,
        size: audioFile.size,
      });
    }

    // Reconstruct FormData to ensure file type is preserved
    const newFormData = new FormData();

    // Copy all fields, ensuring file type is preserved
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        // Read the file as a blob first to ensure we have the actual data
        const fileBlob = await value.arrayBuffer();

        // Determine the correct MIME type
        // If the file already has a type, use it; otherwise infer from name or default to webm
        let mimeType = value.type;
        if (!mimeType || mimeType === "application/octet-stream") {
          const fileName = value.name.toLowerCase();
          if (fileName.endsWith(".webm")) {
            mimeType = "audio/webm";
          } else if (fileName.endsWith(".mp4") || fileName.endsWith(".m4a")) {
            mimeType = "audio/mp4";
          } else if (fileName.endsWith(".wav")) {
            mimeType = "audio/wav";
          } else if (fileName.endsWith(".ogg")) {
            mimeType = "audio/ogg";
          } else {
            mimeType = "audio/webm"; // Default
          }
        }

        // Ensure filename has proper extension
        let fileName = value.name;
        if (!fileName || !fileName.includes(".")) {
          // If no extension, add one based on MIME type
          const extension =
            mimeType.includes("mp4") || mimeType.includes("m4a")
              ? "mp4"
              : mimeType.includes("wav")
              ? "wav"
              : mimeType.includes("ogg")
              ? "ogg"
              : "webm";
          fileName = `recording.${extension}`;
        }

        // Create a new Blob with explicit type, then create File from it
        const typedBlob = new Blob([fileBlob], { type: mimeType });
        const fileWithType = new File([typedBlob], fileName, {
          type: mimeType,
        });

        // Append with explicit filename to ensure backend receives it correctly
        newFormData.append(key, fileWithType, fileName);
        console.log("API Route - Appending file with corrected type:", {
          key,
          name: fileWithType.name,
          originalType: value.type,
          correctedType: fileWithType.type,
          size: fileWithType.size,
        });
      } else {
        newFormData.append(key, value as string);
      }
    }

    // Log what we're about to send
    const audioFileToSend = newFormData.get("audio") as File | null;
    if (audioFileToSend) {
      console.log("API Route - About to send file to backend:", {
        name: audioFileToSend.name,
        type: audioFileToSend.type,
        size: audioFileToSend.size,
        backendUrl: `${BACKEND_URL}/api/voice-to-text/transcribe`,
      });
    }

    // Forward the request to the backend
    // Note: We don't set Content-Type header - fetch will set it automatically
    // with the correct boundary for multipart/form-data
    console.log("API Route - Forwarding to backend:", {
      url: `${BACKEND_URL}/api/voice-to-text/transcribe`,
      hasFormData: !!newFormData,
    });

    const response = await fetch(
      `${BACKEND_URL}/api/voice-to-text/transcribe`,
      {
        method: "POST",
        body: newFormData,
        // Explicitly don't set Content-Type - let fetch handle it
        // This ensures the multipart boundary is set correctly
      }
    );

    console.log("API Route - Backend response status:", response.status);

    // Read response body once
    const contentType = response.headers.get("content-type");
    let data: {
      error?: string;
      message?: string;
      detail?: string;
      success?: boolean;
      data?: unknown;
    };

    try {
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        // If not JSON, return error with text
        return NextResponse.json(
          {
            success: false,
            error: text || `Backend error: ${response.statusText}`,
          },
          { status: response.status }
        );
      }
    } catch (parseError) {
      console.error("Error parsing response:", parseError);
      return NextResponse.json(
        {
          success: false,
          error: `Backend returned invalid response (${response.status})`,
        },
        { status: response.status }
      );
    }

    // Handle error responses (including 429 quota errors)
    if (!response.ok) {
      // Preserve the original status code (especially important for 429)
      return NextResponse.json(
        {
          success: false,
          error:
            data?.error ||
            data?.message ||
            data?.detail ||
            `Backend error: ${response.statusText}`,
        },
        { status: response.status } // Preserve original status code
      );
    }

    // Success response
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Error proxying transcription request:", error);
    const err = error as Error;
    return NextResponse.json(
      {
        success: false,
        error:
          err.message ||
          "Failed to connect to backend. Please ensure the backend server is running.",
      },
      { status: 500 }
    );
  }
}
