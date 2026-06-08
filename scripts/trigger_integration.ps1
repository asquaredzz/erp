param(
  [string]$Repo = $env:GITHUB_REPO,
  [string]$Token = $env:GITHUB_TOKEN,
  [string]$Ref = 'main',
  [string]$WorkflowFile = 'integration.yml'
)

if (-not $Repo) { Write-Error "GITHUB_REPO not set. Use owner/repo format."; exit 2 }
if (-not $Token) { Write-Error "GITHUB_TOKEN not set. Export a PAT with repo/workflow scope."; exit 2 }

$uri = "https://api.github.com/repos/$Repo/actions/workflows/$WorkflowFile/dispatches"
$body = @{ ref = $Ref } | ConvertTo-Json

Write-Host "Triggering workflow $WorkflowFile on $Repo (ref=$Ref)"

try {
  $resp = Invoke-RestMethod -Uri $uri -Method Post -Headers @{ Authorization = "token $Token"; 'User-Agent' = 'erp-e2e-runner' } -Body $body -ContentType 'application/json'
  Write-Host "Dispatched workflow. Check Actions for run status."
  exit 0
} catch {
  Write-Error "Failed to dispatch workflow: $_"
  exit 3
}
