/**
 * S3 저장소 헬퍼 함수
 * Manus 내장 S3 저장소에 파일을 업로드하고 URL을 반환합니다.
 */

export async function storagePut(
  relKey: string,
  data: Buffer | string,
  contentType?: string
): Promise<{ key: string; url: string }> {
  try {
    // Manus 내장 저장소 API 호출
    const response = await fetch("/.manus/storage/put", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key: relKey,
        data: typeof data === "string" ? data : data.toString("base64"),
        contentType: contentType || "application/octet-stream",
        isBase64: typeof data !== "string",
      }),
    });

    if (!response.ok) {
      throw new Error(`Storage API error: ${response.statusText}`);
    }

    const result = await response.json();
    return {
      key: result.key,
      url: result.url,
    };
  } catch (error) {
    console.error("Storage error:", error);
    throw error;
  }
}

export async function storageGet(
  relKey: string,
  expiresIn?: number
): Promise<{ key: string; url: string }> {
  try {
    const response = await fetch("/.manus/storage/get", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key: relKey,
        expiresIn: expiresIn || 3600,
      }),
    });

    if (!response.ok) {
      throw new Error(`Storage API error: ${response.statusText}`);
    }

    const result = await response.json();
    return {
      key: result.key,
      url: result.url,
    };
  } catch (error) {
    console.error("Storage error:", error);
    throw error;
  }
}
