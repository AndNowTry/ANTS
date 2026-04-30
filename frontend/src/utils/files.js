export const ConversionOptions = {
    png:  ["jpg", "jpeg", "webp", "pdf"],
    jpg:  ["png", "jpeg", "webp", "pdf"],
    jpeg: ["png", "jpg",  "webp", "pdf"],
    webp: ["png", "jpg",  "jpeg", "pdf"],
    doc:  ["pdf"],
    docx: ["pdf"],
    xls:  ["pdf"],
    xlsx: ["pdf"],
    ppt:  ["pdf"],
    pptx: ["pdf"],
    mp4:  ["mp4"],
    mov:  ["mp4"],
    avi: ["mp4"],
    mkv:  ["mp4"],
    flv:  ["mp4"],
    wmv: ["mp4"],
    mp3:  ["mp3"],
    wav:  ["mp3"],
    aac: ["mp3"],
    flac: ["mp3"],
    ogg:  ["mp3"],
    m4a: ["mp3"],
}

export function GetFileType(file)
{
    if (!file || !file.name) return null
    return file.name.split('.').pop().toLowerCase()
}

export function FormatSize(bytes)
{
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " kB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
}