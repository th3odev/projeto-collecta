
export async function uploadImages(files) {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    const token = localStorage.getItem('token');
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

    const response = await fetch('/api/images/upload', {
        method: 'POST',
        headers,
        body: formData
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
    }

    return data.urls;  // array of uploaded image URLs
}