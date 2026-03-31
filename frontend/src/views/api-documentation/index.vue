<script setup>
import { computed } from 'vue'
import { useTheme } from 'vuetify'
import 'highlight.js/styles/github.css'
import 'highlight.js/styles/atom-one-dark.css'
import router from "@/router/index.js"

const theme = useTheme()
const hljsTheme = computed(() => theme.global.current.value.dark ? 'hljs-dark' : 'hljs-light')


const View = [
  {
    label: 'Python',
    class_name: 'python',
    code: `import requests
import json
import time

API_TOKEN = "your_api_token"
BASE_URL = "http://localhost:8000"
headers = {"Authorization": f"Api-Token {API_TOKEN}"}

# загрузка файла
with open("file.png", "rb") as f:
    res = requests.post(
        f"{BASE_URL}/api/file_convert/upload/",
        files={"file": f},
        data={"file_type_come": "png", "file_type_need": "jpg"},
        headers=headers
    )

task_id = res.json()["data"]["task_id"]
print(f"Task ID: {task_id}")

# поллинг статуса
while True:
    res = requests.get(
        f"{BASE_URL}/api/file_convert/status/{task_id}/",
        headers=headers,
        stream=True
    )
    for line in res.iter_lines():
        if line and line.startswith(b"data:"):
            data = json.loads(line[5:])
            print(data)
            if data["status"] in ("done", "error"):
                if data["status"] == "done":
                    # скачиваем файл
                    file_res = requests.get(BASE_URL + data["file_url"])
                    with open("result.jpg", "wb") as f:
                        f.write(file_res.content)
                    print("Downloaded: result.jpg")
                exit()`,
  },
  {
    label: 'Go',
    class_name: 'go',
    code: `package main

import (
    "bufio"
    "bytes"
    "encoding/json"
    "fmt"
    "io"
    "mime/multipart"
    "net/http"
    "os"
    "strings"
)

const API_TOKEN = "your_api_token"
const BASE_URL = "http://localhost:8000"

func main() {
    // загрузка файла
    file, _ := os.Open("file.png")
    defer file.Close()

    body := &bytes.Buffer{}
    writer := multipart.NewWriter(body)
    part, _ := writer.CreateFormFile("file", "file.png")
    io.Copy(part, file)
    writer.WriteField("file_type_come", "png")
    writer.WriteField("file_type_need", "jpg")
    writer.Close()

    req, _ := http.NewRequest("POST", BASE_URL+"/api/file_convert/upload/", body)
    req.Header.Set("Authorization", "Api-Token "+API_TOKEN)
    req.Header.Set("Content-Type", writer.FormDataContentType())

    client := &http.Client{}
    res, _ := client.Do(req)

    var uploadResp map[string]interface{}
    json.NewDecoder(res.Body).Decode(&uploadResp)
    taskID := uploadResp["data"].(map[string]interface{})["task_id"].(string)
    fmt.Println("Task ID:", taskID)

    // поллинг статуса
    req, _ = http.NewRequest("GET", BASE_URL+"/api/file_convert/status/"+taskID+"/", nil)
    req.Header.Set("Authorization", "Api-Token "+API_TOKEN)

    res, _ = client.Do(req)
    defer res.Body.Close()

    scanner := bufio.NewScanner(res.Body)
    for scanner.Scan() {
        line := scanner.Text()
        if strings.HasPrefix(line, "data:") {
            var data map[string]interface{}
            json.Unmarshal([]byte(line[5:]), &data)
            fmt.Println(data)
            if data["status"] == "done" || data["status"] == "error" {
                break
            }
        }
    }
}`
  },
  {
    label: 'Java',
    class_name: 'java',
    code: `import java.net.http.*;
import java.net.URI;
import java.nio.file.*;
import java.io.*;

public class Main {
    static final String API_TOKEN = "your_api_token";
    static final String BASE_URL = "http://localhost:8000";

    public static void main(String[] args) throws Exception {
        HttpClient client = HttpClient.newHttpClient();

        // загрузка файла
        String boundary = "----Boundary" + System.currentTimeMillis();
        byte[] fileBytes = Files.readAllBytes(Path.of("file.png"));

        String body = "--" + boundary + "\\r\\n" +
            "Content-Disposition: form-data; name=\\"file\\"; filename=\\"file.png\\"\\r\\n" +
            "Content-Type: image/png\\r\\n\\r\\n";
        String fields = "\\r\\n--" + boundary + "\\r\\n" +
            "Content-Disposition: form-data; name=\\"file_type_come\\"\\r\\n\\r\\npng\\r\\n" +
            "--" + boundary + "\\r\\n" +
            "Content-Disposition: form-data; name=\\"file_type_need\\"\\r\\n\\r\\njpg\\r\\n" +
            "--" + boundary + "--\\r\\n";

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        out.write(body.getBytes());
        out.write(fileBytes);
        out.write(fields.getBytes());

        HttpRequest uploadReq = HttpRequest.newBuilder()
            .uri(URI.create(BASE_URL + "/api/file_convert/upload/"))
            .header("Authorization", "Api-Token " + API_TOKEN)
            .header("Content-Type", "multipart/form-data; boundary=" + boundary)
            .POST(HttpRequest.BodyPublishers.ofByteArray(out.toByteArray()))
            .build();

        HttpResponse uploadRes = client.send(uploadReq, HttpResponse.BodyHandlers.ofString());
        System.out.println("Upload response: " + uploadRes.body());

        // поллинг статуса — читаем SSE построчно
        String taskId = "extracted_task_id"; // извлеки из uploadRes.body()

        HttpRequest statusReq = HttpRequest.newBuilder()
            .uri(URI.create(BASE_URL + "/api/file_convert/status/" + taskId + "/"))
            .header("Authorization", "Api-Token " + API_TOKEN)
            .GET()
            .build();

        client.send(statusReq, HttpResponse.BodyHandlers.ofLines()).body()
            .filter(line -> line.startsWith("data:"))
            .forEach(line -> {
                System.out.println(line.substring(5));
            });
    }
}`
  },
  {
    label: 'C#',
    class_name: 'csharp',
    code: `using System;
using System.IO;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

class Program
{
    const string API_TOKEN = "your_api_token";
    const string BASE_URL = "http://localhost:8000";

    static async Task Main()
    {
        using var client = new HttpClient();
        client.DefaultRequestHeaders.Add("Authorization", $"Api-Token {API_TOKEN}");

        // загрузка файла
        using var form = new MultipartFormDataContent();
        var fileBytes = await File.ReadAllBytesAsync("file.png");
        form.Add(new ByteArrayContent(fileBytes), "file", "file.png");
        form.Add(new StringContent("png"), "file_type_come");
        form.Add(new StringContent("jpg"), "file_type_need");

        var uploadRes = await client.PostAsync($"{BASE_URL}/api/file_convert/upload/", form);
        var uploadJson = await uploadRes.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(uploadJson);
        var taskId = doc.RootElement.GetProperty("data").GetProperty("task_id").GetString();
        Console.WriteLine($"Task ID: {taskId}");

        // поллинг статуса
        var stream = await client.GetStreamAsync($"{BASE_URL}/api/file_convert/status/{taskId}/");
        using var reader = new StreamReader(stream);

        while (!reader.EndOfStream)
        {
            var line = await reader.ReadLineAsync();
            if (line != null && line.StartsWith("data:"))
            {
                var data = line.Substring(5).Trim();
                Console.WriteLine(data);
                using var dataDoc = JsonDocument.Parse(data);
                var statusVal = dataDoc.RootElement.GetProperty("status").GetString();
                if (statusVal == "done" || statusVal == "error") break;
            }
        }
    }
}`
  },
  {
    label: 'PHP',
    class_name: 'php',
    code: `
const API_TOKEN = "your_api_token";
const BASE_URL = "http://localhost:8000";

// загрузка файла
$curl = curl_init();

curl_setopt_array($curl, [
    CURLOPT_URL => BASE_URL . "/api/file_convert/upload/",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => [
        "Authorization: Api-Token " . API_TOKEN,
    ],
    CURLOPT_POSTFIELDS => [
        "file" => new CURLFile("file.png", "image/png", "file.png"),
        "file_type_come" => "png",
        "file_type_need" => "jpg",
    ],
]);

$response = curl_exec($curl);
curl_close($curl);

$data = json_decode($response, true);
$taskId = $data["data"]["task_id"];
echo "Task ID: $taskId\\n";

// поллинг статуса
$curl = curl_init();
curl_setopt_array($curl, [
    CURLOPT_URL => BASE_URL . "/api/file_convert/status/$taskId/",
    CURLOPT_RETURNTRANSFER => false,
    CURLOPT_HTTPHEADER => [
        "Authorization: Api-Token " . API_TOKEN,
    ],
    CURLOPT_WRITEFUNCTION => function($ch, $data) {
        if (str_starts_with($data, "data:")) {
            $json = json_decode(substr($data, 5), true);
            print_r($json);
            if (in_array($json["status"], ["done", "error"])) {
                return -1; // останавливаем поток
            }
        }
        return strlen($data);
    },
]);

curl_exec($curl);
curl_close($curl);`
  }
]
</script>


<template>
  <div
      class="d-flex justify-center align-center"
      style="height: 100%"
  >
    <VCard style="width: 60vw">
      <VCardTitle class="mt-2">
        <VBtn
            color="primary"
            @click="router.push('/api-conversion')"
        >
          <VIcon class="mr-2">
            mdi-arrow-left-thin
          </VIcon>

          Back to API
        </VBtn>
      </VCardTitle>

      <VCardText>
        <template
            v-for="obj in View"
            :key="obj.label"
        >
          <h1>
            {{ obj.label }}
          </h1>

          <pre v-highlightjs="obj.code">
            <code :class="[hljsTheme, obj.class_name]">
              {{ obj.code }}
            </code>
          </pre>
        </template>
      </VCardText>
    </VCard>
  </div>
</template>

<style scoped>
code
{
  border-radius: 10px;
}

.hljs-dark
{
  background: #282c34;
}
.hljs-light
{
  background: #f5f5f5;
}
</style>
