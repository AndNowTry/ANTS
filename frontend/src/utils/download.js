export async function DownloadFile(url)
{
    const res = await fetch('http://localhost:8000' + url)
    const blob = await res.blob()
    const blobUrl = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = blobUrl
    a.download = decodeURIComponent(url.split('/').pop().split('______name______').slice(1).join('_'))
    a.click()
    URL.revokeObjectURL(blobUrl)
}
