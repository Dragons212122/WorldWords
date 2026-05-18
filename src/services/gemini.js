// --- Gemini API (Phát âm) ---
const apiKey = ""; 

export async function callGeminiTTS(text) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Say clearly: ${text}` }] }],
        generationConfig: { 
          responseModalities: ["AUDIO"], 
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Kore" } } } 
        }
      })
    });
    const result = await response.json();
    return result.candidates[0].content.parts[0].inlineData;
  } catch (error) { 
    console.error("TTS Error:", error);
    return null; 
  }
}

export function pcmToWav(base64Data, sampleRate = 24000) {
  const binaryString = atob(base64Data);
  const len = binaryString.length;
  const buffer = new ArrayBuffer(44 + len);
  const view = new DataView(buffer);
  
  const writeString = (offset, string) => { 
    for (let i = 0; i < string.length; i++) view.setUint8(offset + i, string.charCodeAt(i)); 
  };
  
  writeString(0, 'RIFF'); 
  view.setUint32(4, 36 + len, true); 
  writeString(8, 'WAVE'); 
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true); 
  view.setUint16(20, 1, true); 
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true); 
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true); 
  view.setUint16(34, 16, true); 
  writeString(36, 'data'); 
  view.setUint32(40, len, true);
  
  for (let i = 0; i < len; i += 2) { 
    const sample = (binaryString.charCodeAt(i) | (binaryString.charCodeAt(i + 1) << 8)); 
    view.setInt16(44 + i, sample, true); 
  }
  
  return new Blob([buffer], { type: 'audio/wav' });
}
