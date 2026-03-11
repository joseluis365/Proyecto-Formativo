try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/api/login" -Method Post -Body '{"email":"joseluis1409rodrigu@gmail.com","password":"Password123*"}' -ContentType "application/json"
    $response.Content | ConvertFrom-Json | ConvertTo-Json
}
catch {
    $_.Exception.Response.StatusCode.value__
    $stream = $_.Exception.Response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($stream)
    $reader.ReadToEnd()
}
