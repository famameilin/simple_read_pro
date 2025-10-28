package com.nativefileencoding

import android.content.ContentResolver
import android.net.Uri
import com.facebook.react.bridge.*
import org.mozilla.universalchardet.UniversalDetector
import java.io.ByteArrayOutputStream
import java.io.InputStream
import java.nio.charset.Charset

class NativeFileEncodingModule(reactContext: ReactApplicationContext) : NativeFileEncodingSpec(reactContext) {

    override fun getName() = NAME

    override fun convertToUtf8Async(uri: String, promise: Promise) {
        val context = reactApplicationContext
        if (context == null) {
            promise.reject("CONTEXT_UNAVAILABLE", "React context is unavailable")
            return
        }

        try {
            val parsedUri = Uri.parse(uri)
            val contentResolver: ContentResolver = context.contentResolver

            contentResolver.openInputStream(parsedUri)?.use { inputStream ->
                val (bytes, bufferSize) = readStreamWithProgress(inputStream, promise)

                if (bytes == null) {
                    promise.reject("READ_ERROR", "Failed to read stream content")
                    return@use
                }

                val (encodingName, detectedCharset) = detectEncoding(bytes).let {
                    Pair(it.first, Charset.forName(it.second))
                }

                val resultMap = Arguments.createMap().apply {
                    putString("data", String(bytes, detectedCharset))
                    putString("originalEncoding", encodingName)
                    putInt("bytesProcessed", bufferSize)
                }

                promise.resolve(resultMap)
            } ?: run {
                promise.reject("STREAM_OPEN_FAILED", "Cannot open input stream for URI: $uri")
            }
        } catch (e: SecurityException) {
            promise.reject("SECURITY_ERROR", "Missing required permissions: ${e.message}", e)
        } catch (e: Exception) {
            promise.reject("CONVERSION_ERROR", "Conversion failed: ${e.javaClass.simpleName}", e)
        }
    }

    private fun readStreamWithProgress(
        inputStream: InputStream,
        promise: Promise
    ): Pair<ByteArray?, Int> {
        val buffer = ByteArrayOutputStream()
        val data = ByteArray(1024)
        var totalRead = 0
        var bytesRead: Int

        return try {
            while (inputStream.read(data).also { bytesRead = it } != -1) {
                buffer.write(data, 0, bytesRead)
                totalRead += bytesRead

                // 可选：实现进度回调
                // val progressMap = Arguments.createMap().apply {
                //     putInt("totalRead", totalRead)
                // }
                // promise.resolve(progressMap)
            }
            Pair(buffer.toByteArray(), totalRead)
        } catch (e: Exception) {
            Pair(null, totalRead)
        }
    }

    private fun detectEncoding(bytes: ByteArray): Pair<String, String> {
        return UniversalDetector(null).run {
            handleData(bytes, 0, bytes.size)
            dataEnd()
            val detected = detectedCharset ?: "UTF-8"
            reset()
            Pair(detected, if (detected.isEmpty()) "UTF-8" else detected)
        }
    }

    companion object {
        const val NAME = "NativeFileEncoding"
    }
}
