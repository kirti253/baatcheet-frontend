"use client";

import { useState, useEffect, useRef, useCallback } from "react";

type Mode = "transcribe" | "transcribe-verbose" | "translate";
type RecordingState = "idle" | "recording" | "processing";

interface TranscriptionSegment {
  id: number;
  start: number;
  end: number;
  text: string;
}

interface TranscriptionResult {
  text: string;
  language?: string;
  // For verbose mode
  task?: string;
  duration?: number;
  segments?: TranscriptionSegment[];
  // Legacy support for timestamps format
  timestamps?: Array<{ start: number; end: number; text: string }>;
}

interface ApiResponse {
  success: boolean;
  data?: TranscriptionResult;
  error?: string;
}

const LANGUAGES = [
  { value: "auto", label: "Auto-detect" },
  { value: "en", label: "English" },
  { value: "hi", label: "Hindi" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "it", label: "Italian" },
  { value: "pt", label: "Portuguese" },
  { value: "ru", label: "Russian" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
  { value: "zh", label: "Chinese" },
];

// Backend API URL - call backend directly
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

export default function VoiceToText() {
  const [mode, setMode] = useState<Mode>("transcribe");
  const [language, setLanguage] = useState<string>("auto");
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const [result, setResult] = useState<TranscriptionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Format duration as MM:SS
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Start recording
  const startRecording = async () => {
    try {
      setError(null);
      setResult(null);
      setRecordingDuration(0);

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      streamRef.current = stream;

      // Determine best MIME type (prefer formats AssemblyAI supports well)
      // AssemblyAI supports: wav, mp3, mp4, m4a, ogg, flac
      // Prefer webm (widely supported) or fallback to mp4/wav
      let mimeType = "audio/webm;codecs=opus";
      let fileExtension = "webm";

      if (!MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
        if (MediaRecorder.isTypeSupported("audio/webm")) {
          mimeType = "audio/webm";
          fileExtension = "webm";
        } else if (MediaRecorder.isTypeSupported("audio/mp4")) {
          mimeType = "audio/mp4";
          fileExtension = "mp4";
        } else if (MediaRecorder.isTypeSupported("audio/wav")) {
          mimeType = "audio/wav";
          fileExtension = "wav";
        } else {
          // Use browser default
          mimeType = "";
          fileExtension = "webm"; // Most browsers default to webm
        }
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: mimeType || undefined,
      });

      audioChunksRef.current = [];
      const storedMimeType = mimeType;
      const storedFileExtension = fileExtension;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Create blob with explicit MIME type
        const audioBlob = new Blob(audioChunksRef.current, {
          type: storedMimeType || "audio/webm",
        });

        // Verify blob has correct type
        console.log("Audio blob created:", {
          size: audioBlob.size,
          type: audioBlob.type,
          extension: storedFileExtension,
        });

        await transcribeAudio(audioBlob, storedFileExtension);

        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
      };

      mediaRecorder.onerror = (event) => {
        console.error("MediaRecorder error:", event);
        setError("Recording error occurred. Please try again.");
        setRecordingState("idle");
        stopRecording();
      };

      mediaRecorder.start(100); // Collect data every 100ms
      mediaRecorderRef.current = mediaRecorder;
      setRecordingState("recording");

      // Start timer
      timerIntervalRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (error: unknown) {
      console.error("Error starting recording:", error);
      const err = error as Error & { name?: string };
      if (
        err.name === "NotAllowedError" ||
        err.name === "PermissionDeniedError"
      ) {
        setError(
          "Microphone permission denied. Please allow microphone access and try again."
        );
      } else if (
        err.name === "NotFoundError" ||
        err.name === "DevicesNotFoundError"
      ) {
        setError(
          "No microphone found. Please connect a microphone and try again."
        );
      } else {
        setError(
          `Failed to start recording: ${err.message || "Unknown error"}`
        );
      }
      setRecordingState("idle");
    }
  };

  // Stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && recordingState === "recording") {
      mediaRecorderRef.current.stop();
      setRecordingState("processing");

      // Clear timer
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }
  }, [recordingState]);

  // Store recording state in ref for keyboard handler
  const recordingStateRef = useRef(recordingState);
  useEffect(() => {
    recordingStateRef.current = recordingState;
  }, [recordingState]);

  // Transcribe audio
  const transcribeAudio = async (audioBlob: Blob, fileExtension?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Determine file extension from blob type or use provided
      let ext = fileExtension;
      if (!ext) {
        if (audioBlob.type.includes("webm")) {
          ext = "webm";
        } else if (
          audioBlob.type.includes("mp4") ||
          audioBlob.type.includes("m4a")
        ) {
          ext = "mp4";
        } else if (audioBlob.type.includes("wav")) {
          ext = "wav";
        } else if (audioBlob.type.includes("ogg")) {
          ext = "ogg";
        } else {
          // Default to webm if type is unknown
          ext = "webm";
        }
      }

      // Ensure blob has a proper MIME type
      let blobType = audioBlob.type;
      if (!blobType || blobType === "application/octet-stream") {
        // Set appropriate MIME type based on extension
        const mimeTypes: Record<string, string> = {
          webm: "audio/webm",
          mp4: "audio/mp4",
          m4a: "audio/mp4",
          wav: "audio/wav",
          ogg: "audio/ogg",
        };
        blobType = mimeTypes[ext] || "audio/webm";
      }

      // Create a new blob with explicit MIME type if needed
      const finalBlob =
        blobType !== audioBlob.type
          ? new Blob([audioBlob], { type: blobType })
          : audioBlob;

      const formData = new FormData();
      formData.append("audio", finalBlob, `recording.${ext}`);

      console.log("Sending audio to backend:", {
        size: finalBlob.size,
        type: finalBlob.type,
        extension: ext,
      });

      if (language && language !== "auto" && mode !== "translate") {
        formData.append("language", language);
      }

      const endpoint =
        mode === "translate"
          ? "/api/voice-to-text/translate"
          : mode === "transcribe-verbose"
          ? "/api/voice-to-text/transcribe-verbose"
          : "/api/voice-to-text/transcribe";

      // Call backend directly
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        // Try to get error message from response
        let errorMessage = `Server error (${response.status})`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // If response is not JSON, use status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data: ApiResponse = await response.json();

      if (data.success && data.data) {
        setResult(data.data);
        setRecordingState("idle");
      } else {
        throw new Error(data.error || "Transcription failed");
      }
    } catch (error: unknown) {
      console.error("Error transcribing audio:", error);

      // Provide user-friendly error messages
      let errorMessage = "Failed to transcribe audio. Please try again.";
      const err = error as Error;
      if (err.message) {
        if (
          err.message.includes("Failed to fetch") ||
          err.message.includes("NetworkError")
        ) {
          errorMessage =
            "Cannot connect to server. Please ensure the backend is running and check your network connection.";
        } else if (
          err.message.includes("429") ||
          err.message.includes("quota") ||
          err.message.includes("rate limit")
        ) {
          errorMessage =
            "API quota or rate limit exceeded. Please check your AssemblyAI plan and billing details, or try again later.";
        } else if (
          err.message.includes("401") ||
          err.message.includes("Unauthorized")
        ) {
          errorMessage =
            "Authentication failed. Please check your AssemblyAI API key credentials.";
        } else if (err.message.includes("500")) {
          errorMessage =
            "Server error occurred. Please try again or check if the backend service is running properly.";
        } else {
          // Show the actual error message from the backend
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
      setRecordingState("idle");
    } finally {
      setIsLoading(false);
    }
  };

  // Clear results
  const clearResults = () => {
    setResult(null);
    setError(null);
    setRecordingDuration(0);
  };

  // Copy to clipboard
  const copyToClipboard = async () => {
    if (result?.text) {
      try {
        await navigator.clipboard.writeText(result.text);
        // You could add a toast notification here
      } catch (error) {
        console.error("Failed to copy:", error);
        setError("Failed to copy to clipboard");
      }
    }
  };

  // Download as text file
  const downloadAsFile = () => {
    if (result?.text) {
      const blob = new Blob([result.text], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `transcription-${new Date().toISOString()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Keyboard shortcut: Space to start/stop recording
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only trigger if space is pressed and focus is on body (not in input/textarea)
      if (e.code === "Space") {
        const target = e.target as HTMLElement;
        // Don't trigger if user is typing in an input/textarea/select
        if (
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT"
        ) {
          return;
        }
        e.preventDefault();
        const currentState = recordingStateRef.current;
        if (currentState === "idle") {
          startRecording();
        } else if (currentState === "recording") {
          stopRecording();
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Functions are stable enough for keyboard handler

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2">
            Voice to Text
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Real-time audio transcription and translation
          </p>
        </div>

        {/* Mode Selection */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setMode("transcribe")}
              className={`flex-1 min-w-[120px] px-4 py-3 rounded-lg font-medium transition-all ${
                mode === "transcribe"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
              }`}
            >
              Transcribe
            </button>
            <button
              onClick={() => setMode("transcribe-verbose")}
              className={`flex-1 min-w-[120px] px-4 py-3 rounded-lg font-medium transition-all ${
                mode === "transcribe-verbose"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
              }`}
            >
              Transcribe Verbose
            </button>
            <button
              onClick={() => setMode("translate")}
              className={`flex-1 min-w-[120px] px-4 py-3 rounded-lg font-medium transition-all ${
                mode === "translate"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
              }`}
            >
              Translate
            </button>
          </div>

          {/* Language Selection */}
          {mode !== "translate" && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Recording Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex flex-col items-center">
            {/* Recording Button */}
            <button
              onClick={
                recordingState === "idle" ? startRecording : stopRecording
              }
              disabled={recordingState === "processing" || isLoading}
              className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                recordingState === "recording"
                  ? "bg-red-500 shadow-lg shadow-red-500/50"
                  : "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/50"
              }`}
            >
              {/* Pulsing animation when recording */}
              {recordingState === "recording" && (
                <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75"></div>
              )}

              {/* Microphone/Stop Icon */}
              <div className="relative z-10 text-white">
                {recordingState === "recording" ? (
                  <svg
                    className="w-12 h-12"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 012 0v4a1 1 0 11-2 0V7zM12 9a1 1 0 10-2 0v2a1 1 0 102 0V9z"
                      clipRule="evenodd"
                    />
                    <rect x="6" y="4" width="8" height="2" rx="1" />
                  </svg>
                ) : (
                  <svg
                    className="w-12 h-12"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </button>

            {/* Recording Timer */}
            {(recordingState === "recording" ||
              recordingState === "processing") && (
              <div className="mt-6 text-center">
                <div className="text-3xl font-mono font-bold text-slate-900 dark:text-white mb-2">
                  {formatDuration(recordingDuration)}
                </div>
                <div className="flex items-center justify-center gap-2">
                  {recordingState === "recording" && (
                    <>
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        Recording...
                      </span>
                    </>
                  )}
                  {recordingState === "processing" && (
                    <>
                      <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        Processing...
                      </span>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Instructions */}
            {recordingState === "idle" && !result && (
              <p className="mt-6 text-sm text-slate-500 dark:text-slate-400 text-center">
                Click the microphone to start recording • Press Space to
                start/stop
              </p>
            )}
          </div>
        </div>

        {/* Results Section */}
        {(result || error) && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-6">
            {error && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-red-600 dark:text-red-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-red-800 dark:text-red-300 font-medium">
                    Error
                  </p>
                </div>
                <p className="text-red-700 dark:text-red-400 mt-1">{error}</p>
              </div>
            )}

            {result && (
              <>
                {/* Language Detection & Task Info */}
                {(result.language || result.task) && (
                  <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex flex-wrap gap-4 text-sm text-blue-800 dark:text-blue-300">
                      {result.language && (
                        <p>
                          <span className="font-medium">
                            Detected Language:
                          </span>{" "}
                          {result.language}
                        </p>
                      )}
                      {result.task && (
                        <p>
                          <span className="font-medium">Task:</span>{" "}
                          {result.task}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Transcription Text */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {mode === "translate" ? "Translated Text" : "Transcription"}
                  </label>
                  <textarea
                    readOnly
                    value={result.text}
                    className="w-full h-48 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Verbose Mode: Segments/Timestamps */}
                {((result.segments && result.segments.length > 0) ||
                  (result.timestamps && result.timestamps.length > 0)) && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Transcription Segments
                      </label>
                      {result.duration && (
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          Duration:{" "}
                          {formatDuration(Math.floor(result.duration))}
                        </span>
                      )}
                    </div>
                    <div className="max-h-64 overflow-y-auto border border-slate-300 dark:border-slate-600 rounded-lg p-4 bg-slate-50 dark:bg-slate-900">
                      {/* Use segments if available (new format), otherwise fall back to timestamps */}
                      {(result.segments || result.timestamps || []).map(
                        (segment, idx) => {
                          const ts =
                            result.segments?.[idx] || result.timestamps?.[idx];
                          if (!ts) return null;
                          return (
                            <div
                              key={result.segments?.[idx]?.id || idx}
                              className="mb-3 pb-3 border-b border-slate-200 dark:border-slate-700 last:border-0"
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                                  {formatDuration(Math.floor(ts.start))} -{" "}
                                  {formatDuration(Math.floor(ts.end))}
                                </span>
                                {result.segments?.[idx]?.id !== undefined && (
                                  <span className="text-xs text-slate-400 dark:text-slate-500">
                                    (ID: {result.segments[idx].id})
                                  </span>
                                )}
                              </div>
                              <div className="text-slate-900 dark:text-white">
                                {ts.text}
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    Copy
                  </button>
                  <button
                    onClick={downloadAsFile}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Download
                  </button>
                  <button
                    onClick={clearResults}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Clear
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Loading State */}
        {isLoading && !result && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400">
              Processing your audio...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
