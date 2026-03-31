export function GetIcon(file_name)
{
    if (!file_name) return "mdi-file"

    const ext = file_name.split(".").pop().toLowerCase()
    if (["png","jpg","jpeg","webp"].includes(ext)) return "mdi-image"
    if (["mp4","mov","avi","mkv"].includes(ext)) return "mdi-video"
    if (["mp3","wav","aac","flac"].includes(ext)) return "mdi-music"
    if (["pdf","doc","docx","xls","xlsx","ppt","pptx"].includes(ext)) return "mdi-file-document"

    return "mdi-file"
}