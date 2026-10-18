# 极简静态文件服务器（PowerShell HttpListener）
# 用法: powershell -File serve.ps1 <端口>
$port = if ($args.Count -gt 0) { $args[0] } else { 8000 }
$root = 'C:\Users\lenovo\.cline\data\workspaces\chat\bazi-chart'

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Prefixes.Add("http://127.0.0.1:$port/")
$listener.Start()
Write-Output "Serving $root at http://localhost:$port/ (Ctrl+C to stop)"

$ct = [System.Threading.CancellationToken]::None
while ($listener.IsListening) {
  $task = $listener.GetContextAsync()
  $ctx = $task.GetAwaiter().GetResult()
  $req = $ctx.Request
  $res = $ctx.Response

  # 解析请求路径
  $path = $req.Url.AbsolutePath
  if ($path -eq '/' -or $path -eq '') { $path = '/index.html' }
  $filePath = Join-Path $root ($path.TrimStart('/').Replace('/', '\'))

  try {
    if (Test-Path -LiteralPath $filePath -PathType Leaf) {
      $bytes = [System.IO.File]::ReadAllBytes($filePath)
      # 简单 MIME
      $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
      $mime = switch ($ext) {
        '.html' { 'text/html; charset=utf-8' }
        '.css'  { 'text/css; charset=utf-8' }
        '.js'   { 'application/javascript; charset=utf-8' }
        '.png'  { 'image/png' }
        '.jpg'  { 'image/jpeg' }
        '.ico'  { 'image/x-icon' }
        '.svg'  { 'image/svg+xml' }
        default { 'application/octet-stream' }
      }
      $res.ContentType = $mime
      $res.ContentLength64 = $bytes.Length
      $res.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
      $res.StatusCode = 404
      $msg = [System.Text.Encoding]::UTF8.GetBytes('404 Not Found')
      $res.OutputStream.Write($msg, 0, $msg.Length)
    }
  } catch {
    $res.StatusCode = 500
  } finally {
    $res.OutputStream.Close()
  }
}
