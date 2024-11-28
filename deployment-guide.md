# Guia de Deployment - Node.js + React + Nginx

Este guia documenta os passos necessários para fazer o deployment de uma aplicação Node.js com React em um servidor Ubuntu usando Nginx como proxy reverso.

## 1. Preparação do Servidor

### 1.1 Atualizações Iniciais
```bash
sudo apt update
sudo apt upgrade
```

### 1.2 Instalação de Dependências
```bash
# Node.js e npm
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs

# Nginx
sudo apt install nginx

# PM2 (Gerenciador de processos Node.js)
sudo npm install -g pm2
```

## 2. Configuração do Nginx

### 2.1 Frontend (React)
```nginx
# /etc/nginx/sites-available/seu-dominio.com
server {
    server_name seu-dominio.com www.seu-dominio.com;
    root /var/www/build;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    # Segurança adicional
    location ~ /\. {
        deny all;
    }

    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/seu-dominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/seu-dominio.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}
```

### 2.2 Backend (API)
```nginx
# /etc/nginx/sites-available/api.seu-dominio.com
server {
    server_name api.seu-dominio.com;

    location / {
        # Se a API usa prefixo /api
        rewrite ^/(.*)$ /api/$1 break;
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    listen 443 ssl;
    # ... configurações SSL ...
}
```

## 3. Configuração do SSL (Certbot)

```bash
# Instalação do Certbot
sudo apt install certbot python3-certbot-nginx

# Obtenção dos certificados
sudo certbot --nginx -d seu-dominio.com -d www.seu-dominio.com -d api.seu-dominio.com
```

## 4. Deployment da API

### 4.1 Estrutura de Arquivos
```
/var/www/
├── api/
│   ├── src/
│   ├── package.json
│   └── .env
└── build/
    └── index.html
```

### 4.2 Configuração do .env
```env
PORT=3000
DB_URI=sua_uri_mongodb
JWT_SECRET=sua_chave_secreta
CORS_ORIGIN=https://seu-dominio.com,https://www.seu-dominio.com
NODE_ENV=production
```

### 4.3 Inicialização com PM2
```bash
cd /var/www/api
pm2 start src/server.js --name "api"
pm2 save
pm2 startup
```

## 5. Deployment do Frontend

### 5.1 Build do React
```bash
npm run build
```

### 5.2 Upload para o Servidor
```bash
scp -r build/* user@seu-ip:/var/www/build/
```

## 6. Checklist de Verificação

### 6.1 Segurança
- [ ] Firewall configurado (UFW)
- [ ] SSL/HTTPS ativo
- [ ] Variáveis de ambiente seguras
- [ ] Permissões de arquivos corretas
- [ ] Headers de segurança no Nginx

### 6.2 Performance
- [ ] Compressão Gzip ativada
- [ ] Cache configurado
- [ ] PM2 configurado com cluster mode

### 6.3 Monitoramento
- [ ] Logs do Nginx configurados
- [ ] PM2 monitoramento ativo
- [ ] Sistema de backup configurado

## 7. Comandos Úteis

### 7.1 Nginx
```bash
sudo nginx -t # Teste de configuração
sudo systemctl restart nginx
sudo tail -f /var/log/nginx/error.log
```

### 7.2 PM2
```bash
pm2 logs # Visualizar logs
pm2 monit # Monitor em tempo real
pm2 restart all # Reiniciar todas as aplicações
```

### 7.3 SSL
```bash
sudo certbot renew --dry-run # Teste de renovação
```

## 8. Solução de Problemas Comuns

### 8.1 CORS
- Verificar configuração do CORS no backend
- Confirmar origens permitidas no .env
- Verificar headers no Nginx

### 8.2 502 Bad Gateway
- Verificar se a API está rodando (pm2 status)
- Verificar logs do Nginx e PM2
- Confirmar porta correta no proxy_pass

### 8.3 SSL
- Verificar validade dos certificados
- Confirmar configuração dos arquivos SSL
- Verificar redirecionamento HTTP para HTTPS

## 9. Manutenção

### 9.1 Atualizações Regulares
- Manter sistema operacional atualizado
- Atualizar dependências do Node.js
- Renovar certificados SSL
- Monitorar logs e performance
