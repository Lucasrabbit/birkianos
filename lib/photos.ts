// 📸 Suas fotos — edite aqui para personalizar a colagem polaroid
//
// Como adicionar fotos do Google Drive:
// 1. Abra a foto no Google Drive → clique com botão direito → "Obter link"
// 2. Certifique que "Qualquer pessoa com o link pode ver"
// 3. Copie o ID da URL: drive.google.com/file/d/[ESTE_É_O_ID]/view
// 4. Cole assim: "https://lh3.googleusercontent.com/d/SEU_ID_AQUI"

export const BACKGROUND_PHOTOS: string[] = [
  // Suas fotos aqui (Google Drive, Imgur, qualquer URL pública):
  // "https://lh3.googleusercontent.com/d/SEU_ID_AQUI",

  // Fotos padrão (substitua pelas suas):
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=600&q=80&auto=format&fit=crop",
];

// Legendas manuscritas para cada polaroid (mesma ordem das fotos acima)
export const PHOTO_CAPTIONS: string[] = [
  "praia, 2024",
  "nosso 1º roteiro",
  "estrada da serra",
  "café da manhã ☕",
  "fim de tarde",
];

export const PHOTO_INTERVAL_MS = 6000;
