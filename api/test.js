export default function handler(req, res) {
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(`
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FAIR — Test Chatbot Nauxilia</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 60px auto; padding: 20px; background: #f5f5f5; }
    h1 { color: #1A2640; }
    p { color: #666; }
  </style>
</head>
<body>
  <h1>FAIR — Assistant IA</h1>
  <p>Cliquez sur le bouton en bas à droite pour tester l'assistant.</p>
  <script>
    window.NAUXILIA_API_URL = 'https://nauxilia-chatbot.vercel.app';
  </script>
  <script src="https://nauxilia-chatbot.vercel.app/public/chatbot.js"></script>
</body>
</html>
  `);
}
