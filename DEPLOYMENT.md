# 🚀 Azure Deployment Guide

## Quick Deployment Options

### Option 1: Azure Static Web Apps (Recommended) ⭐

**Best for:** Fast deployment, automatic HTTPS, global CDN, free tier available

1. **Upload to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/memory-word-games.git
   git push -u origin main
   ```

2. **Deploy via Azure Portal:**
   - Go to [Azure Portal](https://portal.azure.com)
   - Create Resource → Static Web Apps
   - Connect to your GitHub repository
   - Build presets: Custom
   - App location: `/` (root)
   - Output location: `/` (root)
   - Deploy automatically!

3. **Your games will be live at:** `https://your-app-name.azurestaticapps.net`

### Option 2: Azure App Service

**Best for:** More control, custom domains, scaling options

1. **Create App Service:**
   ```bash
   az webapp create --resource-group myResourceGroup --plan myAppServicePlan --name myWordGames --runtime "NODE|18-lts"
   ```

2. **Deploy files:**
   ```bash
   # Zip your files
   zip -r game.zip . -x "*.git*" "node_modules/*" "*.md"
   
   # Deploy to Azure
   az webapp deployment source config-zip --resource-group myResourceGroup --name myWordGames --src game.zip
   ```

3. **Your games will be live at:** `https://mywordgames.azurewebsites.net`

### Option 3: Azure Blob Storage (Static Website)

**Best for:** Lowest cost, simple hosting

1. **Create Storage Account:**
   ```bash
   az storage account create --name mystorageaccount --resource-group myResourceGroup --location eastus --sku Standard_LRS
   ```

2. **Enable Static Website:**
   ```bash
   az storage blob service-properties update --account-name mystorageaccount --static-website --index-document index.html --404-document index.html
   ```

3. **Upload Files:**
   ```bash
   az storage blob upload-batch --account-name mystorageaccount --destination '$web' --source .
   ```

## 🔧 Pre-Deployment Checklist

- [ ] All files are in the project directory
- [ ] Test locally by opening `index.html` in browser
- [ ] Check responsive design on mobile device
- [ ] Verify both games work correctly
- [ ] Update `package.json` with your details
- [ ] Add your analytics code (Google Analytics, etc.)
- [ ] Customize colors/themes if desired

## 🌐 Custom Domain Setup

### For Static Web Apps:
1. Go to Azure Portal → Your Static Web App
2. Settings → Custom domains
3. Add your domain and verify

### For App Service:
1. Go to Azure Portal → Your App Service
2. Settings → Custom domains
3. Add domain and configure DNS

### DNS Configuration:
```
Type: CNAME
Name: www (or your subdomain)
Value: your-app-name.azurestaticapps.net
```

## 📊 Analytics Integration

Add to `index.html` before `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

## 🚀 Performance Optimization

### Enable Compression:
Add to `web.config` (App Service):
```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <urlCompression doStaticCompression="true" doDynamicCompression="true" />
    <httpCompression>
      <staticTypes>
        <add mimeType="text/css" enabled="true" />
        <add mimeType="application/javascript" enabled="true" />
      </staticTypes>
    </httpCompression>
  </system.webServer>
</configuration>
```

### Add CDN (Optional):
1. Create Azure CDN profile
2. Add endpoint pointing to your app
3. Configure caching rules for static assets

## 🛡️ Security Headers

Add to your hosting configuration:
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

## 💰 Cost Estimation

### Static Web Apps:
- **Free Tier:** 100GB bandwidth, custom domains
- **Standard:** $9/month for additional features

### App Service:
- **Free Tier:** Limited, good for testing
- **Basic B1:** ~$13/month, custom domains, SSL

### Blob Storage:
- **Storage:** ~$0.02/GB per month
- **Bandwidth:** ~$0.05/GB outbound

## 🔍 Monitoring & Logging

### Application Insights (Recommended):
1. Create Application Insights resource
2. Add instrumentation key to your app
3. Monitor user behavior, performance, errors

### Basic Analytics Code:
```javascript
// Add to your game files for custom events
function trackGameEvent(eventName, gameType, level) {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, {
            'custom_parameter_1': gameType,
            'custom_parameter_2': level
        });
    }
}
```

## 🚨 Troubleshooting

### Common Issues:

1. **404 Errors:** Check `staticwebapp.config.json` routing
2. **JS Not Loading:** Verify file paths are correct
3. **Mobile Issues:** Test responsive CSS breakpoints
4. **Slow Loading:** Enable compression and CDN

### Debug Commands:
```bash
# Check deployment status
az webapp show --name myWordGames --resource-group myResourceGroup

# View logs
az webapp log tail --name myWordGames --resource-group myResourceGroup
```

## 🎯 Go Live Checklist

- [ ] Games deployed and accessible
- [ ] Custom domain configured (optional)
- [ ] Analytics tracking working
- [ ] Mobile responsiveness verified
- [ ] Performance testing completed
- [ ] Social sharing tested
- [ ] Error handling verified

**🎉 You're ready to go viral!** Share your game URL and watch people get addicted to Color Memory Chain and Word Fusion!