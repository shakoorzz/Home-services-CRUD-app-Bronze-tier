$body = @{
    build_config = @{
        build_command = "npm run build && npm run pages:build"
        destination_dir = ".vercel/output/static"
    }
} | ConvertTo-Json -Depth 5

Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/accounts/5109a6272b0b10402cc3d82c049fe5a1/pages/projects/home-services-crud-app-bronze-tier" `
    -Method Patch `
    -Headers @{ Authorization = "Bearer cfut_bUl1BTDX3Y6F2Frq9AyBI8f5jx0Dn8CwFakdbLu51ecd25eb"; "Content-Type" = "application/json" } `
    -Body $body | ConvertTo-Json -Depth 5
